'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface CourseLevel {
  id: string
  name: string
  description: string
  display_order: number
}

export function useCourseLevels() {
  const [courseLevels, setCourseLevels] = useState<CourseLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseLevels = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('course_levels')
          .select('*')
          .order('display_order')

        if (error) throw error

        setCourseLevels(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching course levels:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseLevels()
  }, [])

  return { courseLevels, loading, error }
}
