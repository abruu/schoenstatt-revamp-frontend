/**
 * Strapi API Client
 * A performance-optimized, reusable API client for Strapi CMS
 * Uses native fetch API with TypeScript support
 */

// Types and Interfaces
export interface StrapiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: any;
}

export interface StrapiErrorResponse {
  error: StrapiError;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean> | StrapiQueryParams;
  timeout?: number;
  cache?: boolean;
}

export interface StrapiQueryParams {
  populate?: string | string[] | Record<string, any>;
  fields?: string[];
  filters?: Record<string, any>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  publicationState?: 'live' | 'preview';
  locale?: string;
}

// Cache implementation for performance optimization
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Main API Client Class
export class StrapiApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private cache: ApiCache;
  private requestInterceptors: Array<(config: ApiRequestConfig) => ApiRequestConfig> = [];
  private responseInterceptors: Array<(response: any) => any> = [];

  constructor(baseURL?: string, defaultHeaders?: Record<string, string>) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.cache = new ApiCache();
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: (config: ApiRequestConfig) => ApiRequestConfig): void {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }

  // Set authorization token
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Remove authorization token
  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  // Build query string from Strapi query parameters
  private buildQueryString(params: StrapiQueryParams): string {
    const searchParams = new URLSearchParams();

    // Handle populate
    if (params.populate) {
      if (typeof params.populate === 'string') {
        searchParams.append('populate', params.populate);
      } else if (Array.isArray(params.populate)) {
        params.populate.forEach(field => searchParams.append('populate', field));
      } else {
        searchParams.append('populate', JSON.stringify(params.populate));
      }
    }

    // Handle fields
    if (params.fields) {
      params.fields.forEach(field => searchParams.append('fields', field));
    }

    // Handle filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([operator, operatorValue]) => {
            searchParams.append(`filters[${key}][${operator}]`, String(operatorValue));
          });
        } else {
          searchParams.append(`filters[${key}]`, String(value));
        }
      });
    }

    // Handle sort
    if (params.sort) {
      if (Array.isArray(params.sort)) {
        params.sort.forEach(sortField => searchParams.append('sort', sortField));
      } else {
        searchParams.append('sort', params.sort);
      }
    }

    // Handle pagination
    if (params.pagination) {
      Object.entries(params.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(`pagination[${key}]`, String(value));
        }
      });
    }

    // Handle other parameters
    if (params.publicationState) {
      searchParams.append('publicationState', params.publicationState);
    }

    if (params.locale) {
      searchParams.append('locale', params.locale);
    }

    return searchParams.toString();
  }

  // Generate cache key
  private generateCacheKey(endpoint: string, config: ApiRequestConfig): string {
    const method = config.method || 'GET';
    const params = config.params ? JSON.stringify(config.params) : '';
    const body = config.body ? JSON.stringify(config.body) : '';
    return `${method}:${endpoint}:${params}:${body}`;
  }

  // Core request method
  private async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<StrapiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = 10000,
      cache = method === 'GET',
    } = config;

    // Apply request interceptors
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = interceptor(processedConfig);
    }

    // Build URL
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const queryString = typeof params === 'object' && 'populate' in params 
        ? this.buildQueryString(params as StrapiQueryParams)
        : new URLSearchParams(params as Record<string, string>).toString();
      
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Check cache for GET requests
    const cacheKey = this.generateCacheKey(endpoint, processedConfig);
    if (cache && method === 'GET') {
      const cachedResponse = this.cache.get(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      } as Record<string, string>,
      signal: AbortSignal.timeout(timeout),
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type header for FormData (browser will set it with boundary)
        const headers = requestOptions.headers as Record<string, string>;
        delete headers['Content-Type'];
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    try {
      // Make the request
      const response = await fetch(url, requestOptions);

      // Parse response
      let responseData: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const error: StrapiError = {
          status: response.status,
          name: responseData.error?.name || 'APIError',
          message: responseData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          details: responseData.error?.details,
        };
        throw error;
      }

      // Apply response interceptors
      let processedResponse = responseData;
      for (const interceptor of this.responseInterceptors) {
        processedResponse = interceptor(processedResponse);
      }

      // Cache successful GET responses
      if (cache && method === 'GET') {
        this.cache.set(cacheKey, processedResponse);
      }

      return processedResponse;
    } catch (error) {
      // Handle network errors and timeouts
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }

  // Public API methods
  async get<T = any>(endpoint: string, params?: StrapiQueryParams, config?: Omit<ApiRequestConfig, 'method' | 'params'>): Promise<StrapiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET', params: params as any });
  }

  async post<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<StrapiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data, cache: false });
  }

  async put<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<StrapiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data, cache: false });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<StrapiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data, cache: false });
  }

  async delete<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<StrapiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE', cache: false });
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Simple pattern matching for cache invalidation
    const keys = Array.from((this.cache as any).cache.keys()) as string[];
    keys.forEach((key: string) => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }
}

// Create and export a default instance
export const strapiApi = new StrapiApiClient();

// Export utility function for creating custom instances
export const createStrapiClient = (baseURL?: string, defaultHeaders?: Record<string, string>) => {
  return new StrapiApiClient(baseURL, defaultHeaders);
};
