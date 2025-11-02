import { useEffect, useMemo } from 'react'
import { useApiStore } from '@/lib/stores/api-store'

interface UseGraduatesOptions {
  searchTerm?: string
  selectedLevel?: string
  selectedCenter?: string
  selectedYear?: string
  autoFetch?: boolean
}

interface UseGraduatesReturn {
  graduates: any[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadingMore: boolean
  filteredGraduates: any[]
  stats: {
    total: number
    b2: number
    employed: number
    avgScore: number
  }
  actions: {
    fetchGraduates: (forceRefresh?: boolean) => Promise<void>
    loadMore: () => Promise<void>
    clearError: () => void
    refresh: () => Promise<void>
  }
}

export function useGraduates({
  searchTerm = '',
  selectedLevel = 'all',
  selectedCenter = 'all',
  selectedYear = 'all',
  autoFetch = true
}: UseGraduatesOptions = {}): UseGraduatesReturn {
  const {
    graduates,
    graduatesLoading,
    graduatesError,
    graduatesHasMore,
    graduatesLoadingMore,
    fetchGraduates,
    loadMoreGraduates,
    clearError
  } = useApiStore()

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && graduates.length === 0 && !graduatesLoading && !graduatesError) {
      fetchGraduates(false)
    }
  }, [autoFetch, graduates.length, graduatesLoading, graduatesError, fetchGraduates])

  // Filter graduates based on search and filter criteria
  const filteredGraduates = useMemo(() => {
    return graduates.filter((graduate) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        graduate.StudenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graduate.achievement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graduate.currentStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        graduate.certification?.toLowerCase().includes(searchTerm.toLowerCase())

      // Level filter
      const matchesLevel = selectedLevel === 'all' || 
        graduate.language_certification_level.LabelShort === selectedLevel

      // Center filter
      const matchesCenter = selectedCenter === 'all' || 
        graduate.branch.header.includes(selectedCenter) ||
        graduate.branch.name.toLowerCase().includes(selectedCenter.toLowerCase())

      // Year filter
      const graduateYear = new Date(graduate.GraduateDate).getFullYear().toString()
      const matchesYear = selectedYear === 'all' || graduateYear === selectedYear

      return matchesSearch && matchesLevel && matchesCenter && matchesYear
    })
  }, [graduates, searchTerm, selectedLevel, selectedCenter, selectedYear])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = graduates.length
    const b2Count = graduates.filter(g => 
      g.language_certification_level.LabelShort === 'B2'
    ).length
    const employedCount = graduates.filter(g => 
      g.currentStatus?.toLowerCase().includes('germany') ||
      g.currentStatus?.toLowerCase().includes('working') ||
      g.currentStatus?.toLowerCase().includes('employed')
    ).length
    const avgScore = graduates.length > 0 
      ? Math.round(graduates.reduce((acc, g) => acc + g.score_percentage, 0) / graduates.length)
      : 0

    return {
      total,
      b2: b2Count,
      employed: employedCount,
      avgScore
    }
  }, [graduates])

  // Action handlers
  const actions = useMemo(() => ({
    fetchGraduates,
    loadMore: loadMoreGraduates,
    clearError,
    refresh: () => fetchGraduates(true)
  }), [fetchGraduates, loadMoreGraduates, clearError])

  return {
    graduates,
    loading: graduatesLoading,
    error: graduatesError,
    hasMore: graduatesHasMore,
    loadingMore: graduatesLoadingMore,
    filteredGraduates,
    stats,
    actions
  }
}
