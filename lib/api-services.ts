/**
 * Strapi API Services
 * High-level service functions for common Strapi operations
 * Built on top of the StrapiApiClient for reusability and consistency
 */

import { strapiApi, StrapiResponse, StrapiQueryParams } from './api-client';

// Common Strapi entity interfaces
export interface StrapiEntity {
  id: number;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiCollection<T = any> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingle<T = any> {
  data: T;
  meta?: Record<string, any>;
}

// Generic service class for Strapi collections
export class StrapiCollectionService<T extends StrapiEntity = StrapiEntity> {
  constructor(private collectionName: string) {}

  // Get all items with optional query parameters
  async findMany(params?: StrapiQueryParams): Promise<StrapiCollection<T>> {
    return strapiApi.get<T[]>(`/${this.collectionName}`, params) as Promise<StrapiCollection<T>>;
  }

  // Get a single item by ID
  async findOne(id: number | string, params?: StrapiQueryParams): Promise<StrapiSingle<T>> {
    return strapiApi.get<T>(`/${this.collectionName}/${id}`, params);
  }

  // Create a new item
  async create(data: Partial<T['attributes']>): Promise<StrapiSingle<T>> {
    return strapiApi.post<T>(`/${this.collectionName}`, { data });
  }

  // Update an existing item
  async update(id: number | string, data: Partial<T['attributes']>): Promise<StrapiSingle<T>> {
    return strapiApi.put<T>(`/${this.collectionName}/${id}`, { data });
  }

  // Delete an item
  async delete(id: number | string): Promise<StrapiSingle<T>> {
    return strapiApi.delete<T>(`/${this.collectionName}/${id}`);
  }

  // Count items with optional filters
  async count(filters?: Record<string, any>): Promise<number> {
    const params: StrapiQueryParams = {};
    if (filters) {
      params.filters = filters;
    }
    
    const response = await strapiApi.get<T[]>(`/${this.collectionName}`, {
      ...params,
      pagination: { pageSize: 1 }
    });
    
    return response.meta?.pagination?.total || 0;
  }

  // Search items with text query
  async search(query: string, fields: string[] = ['title', 'name', 'description']): Promise<StrapiCollection<T>> {
    const filters: Record<string, any> = {
      $or: fields.map(field => ({
        [field]: {
          $containsi: query
        }
      }))
    };

    return this.findMany({ filters });
  }

  // Get published items only
  async findPublished(params?: StrapiQueryParams): Promise<StrapiCollection<T>> {
    return this.findMany({
      ...params,
      publicationState: 'live'
    });
  }
}

// Generic service class for Strapi single types
export class StrapiSingleTypeService<T extends Record<string, any> = Record<string, any>> {
  constructor(private singleTypeName: string) {}

  // Get the single type data
  async find(params?: StrapiQueryParams): Promise<StrapiSingle<T>> {
    return strapiApi.get<T>(`/${this.singleTypeName}`, params);
  }

  // Update the single type data
  async update(data: Partial<T>): Promise<StrapiSingle<T>> {
    return strapiApi.put<T>(`/${this.singleTypeName}`, { data });
  }
}

// Media/Upload service
export class StrapiMediaService {
  // Upload files
  async upload(files: File | File[], refId?: string, ref?: string, field?: string): Promise<StrapiResponse<any[]>> {
    const formData = new FormData();
    
    if (Array.isArray(files)) {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('files', files);
    }

    if (refId) formData.append('refId', refId);
    if (ref) formData.append('ref', ref);
    if (field) formData.append('field', field);

    return strapiApi.post('/upload', formData);
  }

  // Get file info
  async getFile(id: number | string): Promise<StrapiSingle<any>> {
    return strapiApi.get(`/upload/files/${id}`);
  }

  // Delete file
  async deleteFile(id: number | string): Promise<StrapiSingle<any>> {
    return strapiApi.delete(`/upload/files/${id}`);
  }

  // Search files
  async searchFiles(params?: StrapiQueryParams): Promise<StrapiCollection<any>> {
    return strapiApi.get('/upload/files', params) as Promise<StrapiCollection<any>>;
  }
}

// Authentication service
export class StrapiAuthService {
  // Login with email and password
  async login(identifier: string, password: string): Promise<StrapiResponse<{ jwt: string; user: any }>> {
    const response = await strapiApi.post('/auth/local', {
      identifier,
      password
    });

    // Set the JWT token for future requests
    if (response.data.jwt) {
      strapiApi.setAuthToken(response.data.jwt);
      // Store token in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('strapi_jwt', response.data.jwt);
      }
    }

    return response;
  }

  // Register new user
  async register(username: string, email: string, password: string): Promise<StrapiResponse<{ jwt: string; user: any }>> {
    const response = await strapiApi.post('/auth/local/register', {
      username,
      email,
      password
    });

    // Set the JWT token for future requests
    if (response.data.jwt) {
      strapiApi.setAuthToken(response.data.jwt);
      // Store token in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('strapi_jwt', response.data.jwt);
      }
    }

    return response;
  }

  // Get current user profile
  async getProfile(): Promise<StrapiResponse<any>> {
    return strapiApi.get('/users/me');
  }

  // Update user profile
  async updateProfile(data: Record<string, any>): Promise<StrapiResponse<any>> {
    return strapiApi.put('/users/me', data);
  }

  // Logout
  logout(): void {
    strapiApi.removeAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strapi_jwt');
    }
  }

  // Initialize auth from stored token
  initializeAuth(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('strapi_jwt');
      if (token) {
        strapiApi.setAuthToken(token);
      }
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<StrapiResponse<any>> {
    return strapiApi.post('/auth/forgot-password', { email });
  }

  // Reset password
  async resetPassword(code: string, password: string, passwordConfirmation: string): Promise<StrapiResponse<{ jwt: string; user: any }>> {
    return strapiApi.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation
    });
  }
}

// Utility functions for common operations
export class StrapiUtils {
  // Extract attributes from Strapi entity
  static extractAttributes<T>(entity: StrapiEntity): T {
    return entity.attributes as T;
  }

  // Extract data from Strapi response
  static extractData<T>(response: StrapiResponse<T>): T {
    return response.data;
  }

  // Build populate parameter for nested relations
  static buildPopulate(fields: string[]): Record<string, any> {
    const populate: Record<string, any> = {};
    
    fields.forEach(field => {
      const parts = field.split('.');
      let current = populate;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = true;
        } else {
          if (!current[part]) {
            current[part] = { populate: {} };
          }
          current = current[part].populate;
        }
      });
    });
    
    return populate;
  }

  // Format Strapi date
  static formatDate(dateString: string, locale: string = 'en-US'): string {
    return new Date(dateString).toLocaleDateString(locale);
  }

  // Get media URL
  static getMediaUrl(media: any, baseUrl?: string): string {
    if (!media) return '';
    
    const url = media.attributes?.url || media.url;
    if (!url) return '';
    
    // If URL is already absolute, return as is
    if (url.startsWith('http')) return url;
    
    // Otherwise, prepend the Strapi base URL
    const strapiBaseUrl = baseUrl || process.env.NEXT_PUBLIC_STRAPI_URL ;
    return `${strapiBaseUrl}${url}`;
  }

  // Build filters for date range
  static buildDateRangeFilter(field: string, startDate?: Date, endDate?: Date): Record<string, any> {
    const filter: Record<string, any> = {};
    
    if (startDate) {
      filter[field] = { $gte: startDate.toISOString() };
    }
    
    if (endDate) {
      if (filter[field]) {
        filter[field].$lte = endDate.toISOString();
      } else {
        filter[field] = { $lte: endDate.toISOString() };
      }
    }
    
    return filter;
  }
}

// Pre-configured service instances for common use cases
export const mediaService = new StrapiMediaService();
export const authService = new StrapiAuthService();

// Factory function to create collection services
export const createCollectionService = <T extends StrapiEntity = StrapiEntity>(collectionName: string) => {
  return new StrapiCollectionService<T>(collectionName);
};

// Factory function to create single type services
export const createSingleTypeService = <T extends Record<string, any> = Record<string, any>>(singleTypeName: string) => {
  return new StrapiSingleTypeService<T>(singleTypeName);
};

// Export commonly used services
export const utils = StrapiUtils;
