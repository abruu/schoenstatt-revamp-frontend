import { create } from "zustand";
import axios, { AxiosError } from "axios";
import qs from "qs";

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

interface Category {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  slug: string;
  WhichPage: string;
}

interface GalleryImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: {
    large?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    thumbnail?: { url: string; width: number; height: number };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Gallery {
  id: number;
  documentId: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category: Category;
  tags: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
  branch: {
    id: number;
    documentId: string;
    name: string;
    header: string;
    phone: string;
    callno: string;
    email: string;
    timings: string;
    students: string;
    established: string;
    instagram: string;
    facebook: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    address: string;
  };
  image: GalleryImage[];
}

interface Graduate {
  id: number;
  documentId: string;
  StudenName: string;
  course?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  GraduateDate: string;
  score_percentage: number;
  certification: string;
  currentStatus: string;
  achievement: string;
  testimonial: string;
  language_certification_level: {
    id: number;
    documentId: string;
    LabelFull: string;
    LabelShort: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  branch: {
    id: number;
    documentId: string;
    name: string;
    header: string;
    phone: string;
    callno: string;
    email: string;
    timings: string;
    students: string;
    established: string;
    instagram: string;
    facebook: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    address: string;
  };
  StudentProfileImage?: GalleryImage;
  gradient?: {
    id: number;
    documentId: string;
    name: string;
    className: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  certificate?: GalleryImage;
}

interface Branch {
  id: number;
  documentId: string;
  name: string;
  header: string;
  address: string;
  phone: string;
  callno: string;
  email: string;
  timings: string;
  students: string;
  established: string;
  instagram: string;
  facebook: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface LanguageCertificationLevel {
  id: number;
  documentId: string;
  LabelFull: string;
  LabelShort: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
  eventsPage: number;
  eventsHasMore: boolean;
  eventsLoadingMore: boolean;

  // Single event data
  currentEvent: Event | null;
  currentEventLoading: boolean;
  currentEventError: string | null;

  // Categories data
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;

  // Galleries data
  galleries: Gallery[];
  galleriesLoading: boolean;
  galleriesError: string | null;
  galleriesPage: number;
  galleriesHasMore: boolean;
  galleriesLoadingMore: boolean;

  // Graduates data
  graduates: Graduate[];
  graduatesLoading: boolean;
  graduatesError: string | null;
  graduatesPage: number;
  graduatesHasMore: boolean;
  graduatesLoadingMore: boolean;

  // Branches data
  branches: Branch[];
  branchesLoading: boolean;
  branchesError: string | null;

  // Language Certification Levels data
  languageCertificationLevels: LanguageCertificationLevel[];
  languageCertificationLevelsLoading: boolean;
  languageCertificationLevelsError: string | null;

  // Generic loading states
  loading: boolean;
  error: string | null;

  // Cache management
  lastFetchTime: number | null;
  categoriesLastFetchTime: number | null;
  galleriesLastFetchTime: number | null;
  graduatesLastFetchTime: number | null;
  branchesLastFetchTime: number | null;
  languageCertificationLevelsLastFetchTime: number | null;
  cacheExpiry: number; // Cache expiry time in milliseconds (default: 5 minutes)

  // Actions
  fetchEvents: (
    params?: Record<string, any>,
    forceRefresh?: boolean
  ) => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  fetchEventByDocumentId: (documentId: string) => Promise<void>;
  fetchCategories: (forceRefresh?: boolean) => Promise<void>;
  fetchGalleries: (forceRefresh?: boolean) => Promise<void>;
  loadMoreGalleries: () => Promise<void>;
  fetchGraduates: (forceRefresh?: boolean) => Promise<void>;
  loadMoreGraduates: () => Promise<void>;
  fetchBranches: (forceRefresh?: boolean) => Promise<void>;
  fetchLanguageCertificationLevels: (forceRefresh?: boolean) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearCache: () => void;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Create the Zustand store
export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  events: [],
  eventsLoading: false,
  eventsError: null,
  eventsPage: 1,
  eventsHasMore: true,
  eventsLoadingMore: false,
  currentEvent: null,
  currentEventLoading: false,
  currentEventError: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  galleries: [],
  galleriesLoading: false,
  galleriesError: null,
  galleriesPage: 1,
  galleriesHasMore: true,
  galleriesLoadingMore: false,
  graduates: [],
  graduatesLoading: false,
  graduatesError: null,
  graduatesPage: 1,
  graduatesHasMore: true,
  graduatesLoadingMore: false,
  branches: [],
  branchesLoading: false,
  branchesError: null,
  languageCertificationLevels: [],
  languageCertificationLevelsLoading: false,
  languageCertificationLevelsError: null,
  loading: false,
  error: null,

  // Cache management
  lastFetchTime: null,
  categoriesLastFetchTime: null,
  galleriesLastFetchTime: null,
  graduatesLastFetchTime: null,
  branchesLastFetchTime: null,
  languageCertificationLevelsLastFetchTime: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds

  // Actions
  fetchEvents: async (params = {}, forceRefresh = false) => {
    const state = get();
    const currentTime = Date.now();

    // Check if we have cached data and it's still valid
    const isCacheValid =
      state.lastFetchTime &&
      currentTime - state.lastFetchTime < state.cacheExpiry;

    // If we have valid cached data and not forcing refresh, return early
    if (!forceRefresh && isCacheValid && state.events.length > 0) {
      console.log("Using cached events data");
      return;
    }

    set({
      eventsLoading: true,
      eventsError: null,
      eventsPage: 1,
      eventsHasMore: true,
    });

    try {
      // Default parameters for Strapi with detailed population
      const defaultParams = {
        // Detailed population parameters
        populate: {
          tags: { fields: ["name"] },
          category: { fields: ["name", "slug", "WhichPage"] },
          gradient: { fields: ["name", "className"] },
          branch: { fields: ["header"] },
          coverImage: { populate: "*" },
          GalleryItems: {
            populate: ["src"],
            fields: ["alt", "title", "description"],
          },
        },
        sort: "date:desc",
        pagination: {
          page: 1,
          pageSize: 9, // Load 9 events per page for better performance
        },
        ...params,
      };

      // Convert params to query string using qs
      const queryString = qs.stringify(defaultParams, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Event[]>>(
        `/events?${queryString}`
      );
      const { data, meta } = response.data;

      set({
        events: data,
        eventsLoading: false,
        eventsError: null,
        eventsPage: 1,
        eventsHasMore: meta.pagination.page < meta.pagination.pageCount,
        lastFetchTime: Date.now(), // Update cache timestamp
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred";

      set({
        events: [],
        eventsLoading: false,
        eventsError: errorMessage,
        eventsHasMore: false,
      });
    }
  },

  loadMoreEvents: async () => {
    const state = get();

    // Don't load more if already loading or no more data available
    if (state.eventsLoadingMore || !state.eventsHasMore) {
      return;
    }

    set({ eventsLoadingMore: true, eventsError: null });

    try {
      const nextPage = state.eventsPage + 1;

      // Build query parameters for next page
      const params = {
        populate: {
          tags: { fields: ["name"] },
          category: { fields: ["name", "slug", "WhichPage"] },
          gradient: { fields: ["name", "className"] },
          branch: { fields: ["header"] },
          coverImage: { populate: "*" },
          GalleryItems: {
            populate: ["src"],
            fields: ["alt", "title", "description"],
          },
        },
        sort: "date:desc",
        pagination: {
          page: nextPage,
          pageSize: 9,
        },
      };

      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Event[]>>(
        `/events?${queryString}`
      );
      const { data, meta } = response.data;

      set({
        events: [...state.events, ...data], // Append new events
        eventsLoadingMore: false,
        eventsError: null,
        eventsPage: nextPage,
        eventsHasMore: meta.pagination.page < meta.pagination.pageCount,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while loading more events";

      set({
        eventsLoadingMore: false,
        eventsError: errorMessage,
      });
    }
  },

  fetchEventByDocumentId: async (documentId: string) => {
    set({ currentEventLoading: true, currentEventError: null });

    try {
      // Build the query parameters for single event fetch
      const params = {
        filters: {
          documentId: {
            $eq: documentId,
          },
        },
        populate: {
          tags: { fields: ["name"] },
          category: { fields: ["name", "slug", "WhichPage"] },
          gradient: { fields: ["name", "className"] },
          branch: { fields: ["header"] },
          coverImage: { populate: "*" },
          related_articles: {
            populate: "*",
          },
          GalleryItems: {
            populate: ["src"],
            fields: ["alt", "title", "description"],
          },
        },
        sort: "date:desc",
        pagination: {
          page: 1,
          pageSize: 10,
        },
      };

      // Convert params to query string using qs
      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Event[]>>(
        `/events?${queryString}`
      );

      // Since we're filtering by documentId, we should get exactly one result
      const event = response.data.data[0] || null;

      set({
        currentEvent: event,
        currentEventLoading: false,
        currentEventError: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred";

      set({
        currentEvent: null,
        currentEventLoading: false,
        currentEventError: errorMessage,
      });
    }
  },

  fetchCategories: async (forceRefresh = false) => {
    const state = get();
    const currentTime = Date.now();

    // Check if we have cached categories data and it's still valid
    const isCacheValid =
      state.categoriesLastFetchTime &&
      currentTime - state.categoriesLastFetchTime < state.cacheExpiry;

    // If we have valid cached data and not forcing refresh, return early
    if (!forceRefresh && isCacheValid && state.categories.length > 0) {
      console.log("Using cached categories data");
      return;
    }

    set({ categoriesLoading: true, categoriesError: null });

    try {
      // Build query parameters without WhichPage filter to get all categories
      const params = {
        sort: "name:asc",
        pagination: {
          page: 1,
          pageSize: 50, // Increased page size to get all categories
        },
      };

      // Convert params to query string using qs
      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Category[]>>(
        `/categories?${queryString}`
      );

      set({
        categories: response.data.data,
        categoriesLoading: false,
        categoriesError: null,
        categoriesLastFetchTime: Date.now(), // Update cache timestamp
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while fetching categories";

      set({
        categories: [],
        categoriesLoading: false,
        categoriesError: errorMessage,
      });
    }
  },

  fetchGalleries: async (forceRefresh = false) => {
    const state = get();
    const currentTime = Date.now();

    // Check if we have cached galleries data and it's still valid
    const isCacheValid =
      state.galleriesLastFetchTime &&
      currentTime - state.galleriesLastFetchTime < state.cacheExpiry;

    // If we have valid cached data and not forcing refresh, return early
    if (!forceRefresh && isCacheValid && state.galleries.length > 0) {
      console.log("Using cached galleries data");
      return;
    }

    set({
      galleriesLoading: true,
      galleriesError: null,
      galleriesPage: 1,
      galleriesHasMore: true,
    });

    try {
      // Build query parameters for galleries with full population
      const params = {
        populate: "*", // Populate all relations
        sort: "date:desc",
        pagination: {
          page: 1,
          pageSize: 12, // Load 12 items per page for better performance
        },
      };

      // Convert params to query string using qs
      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Gallery[]>>(
        `/galleries?${queryString}`
      );
      const { data, meta } = response.data;

      set({
        galleries: data,
        galleriesLoading: false,
        galleriesError: null,
        galleriesPage: 1,
        galleriesHasMore: meta.pagination.page < meta.pagination.pageCount,
        galleriesLastFetchTime: Date.now(), // Update cache timestamp
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while fetching galleries";

      set({
        galleries: [],
        galleriesLoading: false,
        galleriesError: errorMessage,
        galleriesHasMore: false,
      });
    }
  },

  loadMoreGalleries: async () => {
    const state = get();

    // Don't load more if already loading or no more data available
    if (state.galleriesLoadingMore || !state.galleriesHasMore) {
      return;
    }

    set({ galleriesLoadingMore: true, galleriesError: null });

    try {
      const nextPage = state.galleriesPage + 1;

      // Build query parameters for next page
      const params = {
        populate: "*",
        sort: "date:desc",
        pagination: {
          page: nextPage,
          pageSize: 12,
        },
      };

      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Gallery[]>>(
        `/galleries?${queryString}`
      );
      const { data, meta } = response.data;

      set({
        galleries: [...state.galleries, ...data], // Append new galleries
        galleriesLoadingMore: false,
        galleriesError: null,
        galleriesPage: nextPage,
        galleriesHasMore: meta.pagination.page < meta.pagination.pageCount,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while loading more galleries";

      set({
        galleriesLoadingMore: false,
        galleriesError: errorMessage,
      });
    }
  },

  fetchGraduates: async (forceRefresh = false) => {
    const state = get();
    const currentTime = Date.now();

    // Check if we have cached graduates data and it's still valid
    const isCacheValid =
      state.graduatesLastFetchTime &&
      currentTime - state.graduatesLastFetchTime < state.cacheExpiry;

    // If we have valid cached data and not forcing refresh, return early
    if (!forceRefresh && isCacheValid && state.graduates.length > 0) {
      console.log("Using cached graduates data");
      return;
    }

    set({
      graduatesLoading: true,
      graduatesError: null,
      graduatesPage: 1,
      graduatesHasMore: true,
    });

    try {
      // Build query parameters for graduates with full population
      const params = {
        populate: "*", // Populate all relations
        sort: "GraduateDate:desc",
        pagination: {
          page: 1,
          pageSize: 10, // Load 10 graduates per page for better performance
        },
      };

      // Convert params to query string using qs
      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Graduate[]>>(
        `/graduates?${queryString}`
      );
      const { data, meta } = response.data;

      set({
        graduates: data,
        graduatesLoading: false,
        graduatesError: null,
        graduatesPage: 1,
        graduatesHasMore: meta.pagination.page < meta.pagination.pageCount,
        graduatesLastFetchTime: Date.now(), // Update cache timestamp
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while fetching graduates";

      set({
        graduates: [],
        graduatesLoading: false,
        graduatesError: errorMessage,
        graduatesHasMore: false,
      });
    }
  },

  loadMoreGraduates: async () => {
    const state = get();

    // Don't load more if already loading or no more data available
    if (state.graduatesLoadingMore || !state.graduatesHasMore) {
      return;
    }

    set({ graduatesLoadingMore: true, graduatesError: null });

    try {
      const nextPage = state.graduatesPage + 1;

      // Build query parameters for next page
      const params = {
        populate: "*",
        sort: "GraduateDate:desc",
        pagination: {
          page: nextPage,
          pageSize: 10,
        },
      };

      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Graduate[]>>(
        `/graduates?${queryString}`
      );
      const { data, meta } = response.data;

      set({
        graduates: [...state.graduates, ...data], // Append new graduates
        graduatesLoadingMore: false,
        graduatesError: null,
        graduatesPage: nextPage,
        graduatesHasMore: meta.pagination.page < meta.pagination.pageCount,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while loading more graduates";

      set({
        graduatesLoadingMore: false,
        graduatesError: errorMessage,
      });
    }
  },

  fetchBranches: async (forceRefresh = false) => {
    const state = get();
    const currentTime = Date.now();

    // Check if we have cached branches data and it's still valid
    const isCacheValid =
      state.branchesLastFetchTime &&
      currentTime - state.branchesLastFetchTime < state.cacheExpiry;

    // If we have valid cached data and not forcing refresh, return early
    if (!forceRefresh && isCacheValid && state.branches.length > 0) {
      console.log("Using cached branches data");
      return;
    }

    set({ branchesLoading: true, branchesError: null });

    try {
      const params = {
        sort: "name:asc",
        pagination: {
          page: 1,
          pageSize: 50,
        },
      };

      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<Branch[]>>(
        `/branches?${queryString}`
      );

      set({
        branches: response.data.data,
        branchesLoading: false,
        branchesError: null,
        branchesLastFetchTime: Date.now(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while fetching branches";

      set({
        branches: [],
        branchesLoading: false,
        branchesError: errorMessage,
      });
    }
  },

  fetchLanguageCertificationLevels: async (forceRefresh = false) => {
    const state = get();
    const currentTime = Date.now();

    // Check if we have cached data and it's still valid
    const isCacheValid =
      state.languageCertificationLevelsLastFetchTime &&
      currentTime - state.languageCertificationLevelsLastFetchTime <
        state.cacheExpiry;

    // If we have valid cached data and not forcing refresh, return early
    if (
      !forceRefresh &&
      isCacheValid &&
      state.languageCertificationLevels.length > 0
    ) {
      console.log("Using cached language certification levels data");
      return;
    }

    set({
      languageCertificationLevelsLoading: true,
      languageCertificationLevelsError: null,
    });

    try {
      const params = {
        sort: "LabelShort:asc",
        pagination: {
          page: 1,
          pageSize: 50,
        },
      };

      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
      });

      const response = await api.get<ApiResponse<LanguageCertificationLevel[]>>(
        `/language-certification-levels?${queryString}`
      );

      set({
        languageCertificationLevels: response.data.data,
        languageCertificationLevelsLoading: false,
        languageCertificationLevelsError: null,
        languageCertificationLevelsLastFetchTime: Date.now(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || error.message
          : "An unexpected error occurred while fetching language certification levels";

      set({
        languageCertificationLevels: [],
        languageCertificationLevelsLoading: false,
        languageCertificationLevelsError: errorMessage,
      });
    }
  },

  clearError: () => {
    set({
      error: null,
      eventsError: null,
      currentEventError: null,
      categoriesError: null,
      galleriesError: null,
      graduatesError: null,
      branchesError: null,
      languageCertificationLevelsError: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  clearCache: () => {
    set({
      events: [],
      categories: [],
      galleries: [],
      graduates: [],
      branches: [],
      languageCertificationLevels: [],
      lastFetchTime: null,
      galleriesLastFetchTime: null,
      graduatesLastFetchTime: null,
      branchesLastFetchTime: null,
      languageCertificationLevelsLastFetchTime: null,
      eventsError: null,
      categoriesError: null,
      galleriesError: null,
      graduatesError: null,
      branchesError: null,
      languageCertificationLevelsError: null,
      galleriesPage: 1,
      galleriesHasMore: true,
      galleriesLoadingMore: false,
      graduatesPage: 1,
      graduatesHasMore: true,
      graduatesLoadingMore: false,
      eventsPage: 1,
      eventsHasMore: true,
      eventsLoadingMore: false,
    });
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
        tags: { fields: ["name"] },
        category: { fields: ["name"] },
        gradient: { fields: ["name"] },
        branch: { fields: ["header"] },
        image: { fields: ["formats", "name"] },
        GalleryItems: {
          populate: ["src"],
          fields: ["alt", "title", "description"],
        },
        gallery: { populate: "*" },
      },
      sort: "date:desc",
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

    return useApiStore.getState().fetchEvents(params, false); // Use cache by default
  },

  // Get single event by ID
  getEventById: async (id: number) => {
    try {
      // Build detailed population parameters
      const params = {
        populate: {
          tags: { fields: ["name"] },
          category: { fields: ["name"] },
          gradient: { fields: ["name"] },
          branch: { fields: ["header"] },
          image: { fields: ["formats", "name"] },
          GalleryItems: {
            populate: ["src"],
            fields: ["alt", "title", "description"],
          },
          gallery: { populate: "*" },
        },
      };

      const queryString = qs.stringify(params, { encodeValuesOnly: true });
      const response = await api.get<{ data: Event }>(
        `/events/${id}?${queryString}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },
};
