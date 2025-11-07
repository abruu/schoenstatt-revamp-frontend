'use client'

import { useApiStore } from '@/lib/stores/api-store'

export interface CourseLevel {
  id: string
  name: string
}

export function useCourseLevels() {
  const {
    languageCertificationLevels,
    languageCertificationLevelsLoading,
    languageCertificationLevelsError
  } = useApiStore()

  // Transform language certification levels to match the CourseLevel interface
  const courseLevels: CourseLevel[] = languageCertificationLevels.map(level => ({
    id: level.documentId,
    name: level.LabelFull,
  }))

  return {
    courseLevels,
    loading: languageCertificationLevelsLoading,
    error: languageCertificationLevelsError
  }
}
