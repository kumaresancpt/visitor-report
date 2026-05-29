import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { VisitRecord, ReportMetrics, ReportFilters, ReportType } from '../types'

interface UseReportDataReturn {
  data: VisitRecord[]
  metrics: ReportMetrics | null
  isLoading: boolean
  error: string | null
}

export function useReportData(
  dateFrom: string,
  dateTo: string,
  filters: ReportFilters,
  reportType: ReportType
): UseReportDataReturn {
  const [data, setData] = useState<VisitRecord[]>([])
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!dateFrom || !dateTo) return

    setIsLoading(true)
    setError(null)

    try {
      // Build query params
      const params = new URLSearchParams()
      params.append('dateFrom', dateFrom)
      params.append('dateTo', dateTo)
      params.append('reportType', reportType)

      // Add filters
      if (filters.department) {
        const depts = Array.isArray(filters.department)
          ? filters.department
          : [filters.department]
        depts.forEach(d => params.append('department', d))
      }
      if (filters.hostEmployee) {
        const employees = Array.isArray(filters.hostEmployee)
          ? filters.hostEmployee
          : [filters.hostEmployee]
        employees.forEach(e => params.append('hostEmployee', e))
      }
      if (filters.visitPurpose) {
        const purposes = Array.isArray(filters.visitPurpose)
          ? filters.visitPurpose
          : [filters.visitPurpose]
        purposes.forEach(p => params.append('visitPurpose', p))
      }
      if (filters.status) {
        const statuses = Array.isArray(filters.status)
          ? filters.status
          : [filters.status]
        statuses.forEach(s => params.append('status', s))
      }

      // Fetch report data
      const dataResponse = await axios.get(`/api/reports/data?${params.toString()}`)
      setData(dataResponse.data || [])

      // Fetch metrics
      const metricsResponse = await axios.get(`/api/reports/metrics?${params.toString()}`)
      setMetrics(metricsResponse.data || null)
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.detail || 'Failed to fetch report data'
        : 'Failed to fetch report data'
      setError(message)
      setData([])
      setMetrics(null)
    } finally {
      setIsLoading(false)
    }
  }, [dateFrom, dateTo, filters, reportType])

  // Debounce API calls to 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 500)

    return () => clearTimeout(timer)
  }, [fetchData])

  return { data, metrics, isLoading, error }
}
