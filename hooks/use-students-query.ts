'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { studentService, StrapiStudent, StudentParams } from '@/lib/services/student-service'

export interface UseStudentsParams {
  page: number
  pageSize: number
  search?: string
  courseLevel?: string
  statuses?: string
  center?: string
  enabled?: boolean
}

export function useStudents(params: UseStudentsParams) {
  const { page, pageSize, search, courseLevel, statuses, center, enabled = true } = params

  const queryParams: StudentParams = {
    page,
    pageSize,
    search: search || undefined,
    courseLevel: courseLevel && courseLevel !== 'all' ? courseLevel : undefined,
    statuses: statuses && statuses !== 'all' ? statuses : undefined,
    center: center && center !== 'all' ? center : undefined,
  }

  return useQuery({
    queryKey: ['students', queryParams],
    queryFn: async () => {
      const response = await studentService.getAll(queryParams)
      return response
    },
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useStudent(documentId: string | null) {
  return useQuery({
    queryKey: ['student', documentId],
    queryFn: async () => {
      if (!documentId) throw new Error('documentId is required')
      return await studentService.getOne(documentId)
    },
    enabled: !!documentId,
  })
}

export type { StrapiStudent }
