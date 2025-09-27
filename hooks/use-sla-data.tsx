/**
 * Custom hooks for accessing SLA website data
 * Provides easy-to-use hooks for components
 */

import { useEffect } from 'react'
import { useSLAStore } from '@/lib/store'

// Hook for home page data
export const useHomePageData = () => {
  const {
    homePageData,
    heroImages,
    testimonials,
    isLoadingHomePage,
    homePageError,
    fetchHomePageData
  } = useSLAStore()

  useEffect(() => {
    fetchHomePageData()
  }, [fetchHomePageData])

  return {
    homePageData,
    heroImages,
    testimonials,
    isLoading: isLoadingHomePage,
    error: homePageError,
    refetch: fetchHomePageData
  }
}

// Hook for branches data
export const useBranchesData = () => {
  const {
    branches,
    isLoadingBranches,
    branchesError,
    fetchBranches
  } = useSLAStore()

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return {
    branches,
    isLoading: isLoadingBranches,
    error: branchesError,
    refetch: fetchBranches
  }
}

// Hook for courses data
export const useCoursesData = () => {
  const {
    courses,
    isLoadingCourses,
    coursesError,
    fetchCourses
  } = useSLAStore()

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return {
    courses,
    isLoading: isLoadingCourses,
    error: coursesError,
    refetch: fetchCourses
  }
}

// Hook for getting specific data without auto-fetching
export const useSLAData = () => {
  const store = useSLAStore()

  return {
    // Data
    homePageData: store.homePageData,
    branches: store.branches,
    courses: store.courses,
    heroImages: store.heroImages,
    testimonials: store.testimonials,

    // Loading states
    isLoadingHomePage: store.isLoadingHomePage,
    isLoadingBranches: store.isLoadingBranches,
    isLoadingCourses: store.isLoadingCourses,

    // Error states
    homePageError: store.homePageError,
    branchesError: store.branchesError,
    coursesError: store.coursesError,

    // Actions
    fetchHomePageData: store.fetchHomePageData,
    fetchBranches: store.fetchBranches,
    fetchCourses: store.fetchCourses,
    clearErrors: store.clearErrors,
    resetStore: store.resetStore
  }
}

// Hook for counter data (extracted from home page)
export const useCounterData = () => {
  const { homePageData } = useSLAStore()

  return {
    students: parseInt(homePageData?.Students?.toString() || '500'),
    successRate: parseInt(homePageData?.SuccessRate?.toString() || '95'),
    centers: homePageData?.Centers || 3
  }
}

// Hook for header data
export const useHeaderData = () => {
  const { homePageData } = useSLAStore()

  return {
    header1: homePageData?.Header1 || "Immerse Yourself In The World Of The",
    header2: homePageData?.Header2 || "German Language",
    description: homePageData?.description || "SLA is an Initiative of the Secular Institute of Schoenstatt Fathers, which offers German language courses, levels A1, A2, B1 and B2. Our branches are sited in Thrissur, Chalakudy and Peravoor. Our institute is founded in Germany with a charism to renew the church and the society through the covenant of love with our heavenly Mother."
  }
}
