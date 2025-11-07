'use client'

import { useApiStore } from '@/lib/stores/api-store'

export interface Center {
  id: string
  name: string
  email: string
}

export function useCenters() {
  const { branches, branchesLoading, branchesError } = useApiStore()

  // Transform branches to match the Center interface
  const centers: Center[] = branches.map(branch => ({
    id: branch.documentId,
    name: branch.name,
    email: branch.email
  }))

  return {
    centers,
    loading: branchesLoading,
    error: branchesError
  }
}
