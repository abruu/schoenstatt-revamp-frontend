import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import qs from 'qs';

// Types
interface Event {
  id: number;
  attributes: {
    title: string;
    description: string;
    date: string;
    location?: string;
    image?: {
      data?: {
        attributes: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    category?: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ApiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface ApiState {
  // Events data
  events: Event[];
  eventsLoading: boolean;
  eventsError: string | null;
  
  // Generic loading states
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchEvents: (params?: Record<string, any>) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Create the Zustand store
export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  events: [],
  eventsLoading: false,
  eventsError: null,
  loading: false,
  error: null,

  // Actions
  fetchEvents: async (params = {}) => {
    set({ eventsLoading: true, eventsError: null });
    
    try {
      // Default parameters for Strapi with detailed population
      const defaultParams = {
        // Detailed population parameters
        populate: {
          tags: { fields: ['name'] },
          category: { fields: ['name'] },
          gradient: { fields: ['name','className'] },
          branch: { fields: ['header'] },
          coverImage: { fields: ['formats', 'name'] },
          GalleryItems: {
            populate: ['src'],
            fields: ['alt', 'title', 'description']
          },
          // Include any other relations that need to be populated
          coverImage: { populate: '*' },
        },
        sort: 'date:desc',
        pagination: {
          page: 1,
          pageSize: 10,
        },
        ...params,
      };

      // Convert params to query string using qs
      const queryString = qs.stringify(defaultParams, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Event[]>>(`/events?${queryString}`);
      
      set({ 
        events: response.data.data,
        eventsLoading: false,
        eventsError: null 
      });
    } catch (error) {
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.error?.message || error.message
        : 'An unexpected error occurred';
      
      set({ 
        events: [],
        eventsLoading: false,
        eventsError: errorMessage 
      });
    }
  },

  clearError: () => {
    set({ error: null, eventsError: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));

// Export the api instance for direct use if needed
export { api };

// Helper function to build Strapi query parameters
export const buildStrapiQuery = (params: Record<string, any>) => {
  return qs.stringify(params, {
    encodeValuesOnly: true,
  });
};

// Example usage functions
export const apiHelpers = {
  // Get events with filters
  getEvents: async (filters?: {
    category?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const params: Record<string, any> = {
      populate: {
        tags: { fields: ['name'] },
        category: { fields: ['name'] },
        gradient: { fields: ['name'] },
        branch: { fields: ['header'] },
        image: { fields: ['formats', 'name'] },
        GalleryItems: {
          populate: ['src'],
          fields: ['alt', 'title', 'description']
        },
        gallery: { populate: '*' },
      },
      sort: 'date:desc',
    };

    if (filters?.category) {
      params.filters = {
        category: {
          $eq: filters.category,
        },
      };
    }

    if (filters?.search) {
      params.filters = {
        ...params.filters,
        $or: [
          { title: { $containsi: filters.search } },
          { description: { $containsi: filters.search } },
        ],
      };
    }

    if (filters?.page || filters?.pageSize) {
      params.pagination = {
        page: filters.page || 1,
        pageSize: filters.pageSize || 10,
      };
    }

    return useApiStore.getState().fetchEvents(params);
  },

  // Get single event by ID
  getEventById: async (id: number) => {
    try {
      // Build detailed population parameters
      const params = {
        populate: {
          tags: { fields: ['name'] },
          category: { fields: ['name'] },
          gradient: { fields: ['name'] },
          branch: { fields: ['header'] },
          image: { fields: ['formats', 'name'] },
          GalleryItems: {
            populate: ['src'],
            fields: ['alt', 'title', 'description']
          },
          gallery: { populate: '*' },
        }
      };
      
      const queryString = qs.stringify(params, { encodeValuesOnly: true });
      const response = await api.get<{ data: Event }>(`/events/${id}?${queryString}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },
};
