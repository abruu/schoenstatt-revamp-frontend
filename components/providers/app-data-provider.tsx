'use client'

import { useEffect } from 'react'
import { useApiStore } from '@/lib/stores/api-store'

/**
 * AppDataProvider - Loads global application data at bootstrap
 * 
 * This component fetches branches and language certification levels
 * when the app initializes, making them available throughout the entire app.
 * 
 * Data is cached in Zustand store with 5-minute expiry.
 */
export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { fetchBranches, fetchLanguageCertificationLevels } = useApiStore()

  useEffect(() => {
    // Load global data on app bootstrap
    fetchBranches()
    fetchLanguageCertificationLevels()
  }, [fetchBranches, fetchLanguageCertificationLevels])

  return <>{children}</>
}
