import { useState, useCallback } from 'react'
import { ReportFilters } from '../types'

interface UseFiltersReturn {
  filters: ReportFilters
  addFilter: (key: string, value: string | string[]) => void
  removeFilter: (key: string) => void
  clearAllFilters: () => void
  activeFilterCount: number
}

export function useFilters(initialFilters: ReportFilters = {}): UseFiltersReturn {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters)

  const addFilter = useCallback((key: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFilters(prev => {
      const updated = { ...prev }
      delete updated[key as keyof ReportFilters]
      return updated
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({})
  }, [])

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key as keyof ReportFilters] !== undefined
  ).length

  return {
    filters,
    addFilter,
    removeFilter,
    clearAllFilters,
    activeFilterCount,
  }
}
