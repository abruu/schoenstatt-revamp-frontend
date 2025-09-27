/**
 * Global Zustand Store for SLA Website
 * Manages all API data and state across the application
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createSingleTypeService, createCollectionService } from './api-services'

// Define interfaces for all data types
interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiTestimonial {
  id: number;
  documentId: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface HomePageData {
  id?: number;
  documentId?: string;
  Heading?: string;
  description: string;
  Students?: number;
  SuccessRate?: number;
  Centers?: number;
  Header1?: string;
  Header2?: string;
  HeroImage?: StrapiMedia[];
  testimonials?: StrapiTestimonial[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface BranchData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  attributes: {
    name: string;
    header: string;
    address: string;
    phone: string;
    callno: string;
    email: string;
    timings: string;
    students: string;
    established: string;
    gradient: string;
    features: string[];
    instagram?: string;
    facebook?: string;
    location?: string;
    images?: {
      data: StrapiMedia[];
    };
  };
}

interface CourseData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  attributes: {
    title: string;
    level: string;
    duration: string;
    description: string;
    price: number;
    features: string[];
    image?: {
      data: StrapiMedia;
    };
  };
}

// Define the store state
interface SLAStore {
  // Data states
  homePageData: HomePageData | null;
  branches: BranchData[];
  courses: CourseData[];
  testimonials: { text: string; author: string }[];
  heroImages: { src: string; alt: string }[];

  // Loading states
  isLoadingHomePage: boolean;
  isLoadingBranches: boolean;
  isLoadingCourses: boolean;

  // Error states
  homePageError: string | null;
  branchesError: string | null;
  coursesError: string | null;

  // Cache timestamps
  lastFetchedHomePage: number | null;
  lastFetchedBranches: number | null;
  lastFetchedCourses: number | null;

  // Actions
  fetchHomePageData: () => Promise<void>;
  fetchBranches: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  clearErrors: () => void;
  resetStore: () => void;
}

// Helper function to get Strapi media URL
const getStrapiMediaUrl = (media: StrapiMedia): string => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL 
  const imageUrl = media.url
  return `${baseUrl}${imageUrl}`
}

// Process hero images from API response
const processHeroImages = (heroImageData: StrapiMedia[]) => {
  return heroImageData.map((image, index) => ({
    src: getStrapiMediaUrl(image),
    alt: image.alternativeText || image.name || `Hero Image ${index + 1}`,
  }))
}

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

// Default fallback data
const defaultHeroImages = [
  {
    src: "/images/Gallery/header_pic.jpg",
    alt: "SLA Students and Faculty"
  }
]

const defaultTestimonials = [
  { text: "Best German learning experience!", author: "Maria K." },
  { text: "Excellent teaching methodology", author: "John D." },
  { text: "Achieved B2 level in 8 months", author: "Sarah L." }
]

// Create the store
export const useSLAStore = create<SLAStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        homePageData: null,
        branches: [],
        courses: [],
        testimonials: defaultTestimonials,
        heroImages: defaultHeroImages,

        // Loading states
        isLoadingHomePage: false,
        isLoadingBranches: false,
        isLoadingCourses: false,

        // Error states
        homePageError: null,
        branchesError: null,
        coursesError: null,

        // Cache timestamps
        lastFetchedHomePage: null,
        lastFetchedBranches: null,
        lastFetchedCourses: null,

        // Actions
        fetchHomePageData: async () => {
          const state = get()
          const now = Date.now()

          // Check if data is cached and still valid
          if (
            state.homePageData &&
            state.lastFetchedHomePage &&
            now - state.lastFetchedHomePage < CACHE_DURATION
          ) {
            return // Use cached data
          }

          set({ isLoadingHomePage: true, homePageError: null })

          try {
            const homePageService = createSingleTypeService<HomePageData>('home-page')
            const response = await homePageService.find({
              populate: ['HeroImage', 'testimonials']
            })

            const data = response.data

            // Process hero images
            let processedImages = defaultHeroImages
            if (data.HeroImage && data.HeroImage.length > 0) {
              processedImages = processHeroImages(data.HeroImage)
            }

            // Process testimonials
            let processedTestimonials = defaultTestimonials
            if (data.testimonials && data.testimonials.length > 0) {
              processedTestimonials = data.testimonials.map(testimonial => ({
                text: testimonial.text,
                author: testimonial.author
              }))
            }

            set({
              homePageData: data,
              heroImages: processedImages,
              testimonials: processedTestimonials,
              isLoadingHomePage: false,
              homePageError: null,
              lastFetchedHomePage: now
            })
          } catch (error) {
            console.error('Error fetching home page data:', error)
            set({
              homePageError: 'Failed to load home page content',
              isLoadingHomePage: false,
              // Keep fallback data
              heroImages: defaultHeroImages,
              testimonials: defaultTestimonials,
              homePageData: {
                Header1: "Immerse Yourself In The World Of The",
                Header2: "German Language",
                description: "SLA is an Initiative of the Secular Institute of Schoenstatt Fathers, which offers German language courses, levels A1, A2, B1 and B2. Our branches are sited in Thrissur, Chalakudy and Peravoor. Our institute is founded in Germany with a charism to renew the church and the society through the covenant of love with our heavenly Mother.",
                Students: 500,
                SuccessRate: 95,
                Centers: 3
              }
            })
          }
        },

        fetchBranches: async () => {
          const state = get()
          const now = Date.now()

          // Check cache
          if (
            state.branches.length > 0 &&
            state.lastFetchedBranches &&
            now - state.lastFetchedBranches < CACHE_DURATION
          ) {
            return
          }

          set({ isLoadingBranches: true, branchesError: null })

          try {
            const branchService = createCollectionService<BranchData>('branches')
            const response = await branchService.findMany({
              populate: ['images'],
              sort: ['createdAt:asc']
            })

            set({
              branches: response.data,
              isLoadingBranches: false,
              branchesError: null,
              lastFetchedBranches: now
            })
          } catch (error) {
            console.error('Error fetching branches:', error)
            set({
              branchesError: 'Failed to load branches data',
              isLoadingBranches: false
            })
          }
        },

        fetchCourses: async () => {
          const state = get()
          const now = Date.now()

          // Check cache
          if (
            state.courses.length > 0 &&
            state.lastFetchedCourses &&
            now - state.lastFetchedCourses < CACHE_DURATION
          ) {
            return
          }

          set({ isLoadingCourses: true, coursesError: null })

          try {
            const courseService = createCollectionService<CourseData>('courses')
            const response = await courseService.findMany({
              populate: ['image'],
              sort: ['level:asc']
            })

            set({
              courses: response.data,
              isLoadingCourses: false,
              coursesError: null,
              lastFetchedCourses: now
            })
          } catch (error) {
            console.error('Error fetching courses:', error)
            set({
              coursesError: 'Failed to load courses data',
              isLoadingCourses: false
            })
          }
        },

        clearErrors: () => {
          set({
            homePageError: null,
            branchesError: null,
            coursesError: null
          })
        },

        resetStore: () => {
          set({
            homePageData: null,
            branches: [],
            courses: [],
            testimonials: defaultTestimonials,
            heroImages: defaultHeroImages,
            isLoadingHomePage: false,
            isLoadingBranches: false,
            isLoadingCourses: false,
            homePageError: null,
            branchesError: null,
            coursesError: null,
            lastFetchedHomePage: null,
            lastFetchedBranches: null,
            lastFetchedCourses: null
          })
        }
      }),
      {
        name: 'sla-store', // unique name for localStorage
        partialize: (state) => ({
          // Only persist data, not loading/error states
          homePageData: state.homePageData,
          branches: state.branches,
          courses: state.courses,
          testimonials: state.testimonials,
          heroImages: state.heroImages,
          lastFetchedHomePage: state.lastFetchedHomePage,
          lastFetchedBranches: state.lastFetchedBranches,
          lastFetchedCourses: state.lastFetchedCourses
        })
      }
    ),
    {
      name: 'SLA Store' // DevTools name
    }
  )
)

// Export types for use in components
export type { HomePageData, BranchData, CourseData, StrapiMedia, StrapiTestimonial }
