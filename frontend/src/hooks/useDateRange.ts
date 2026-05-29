import { useState, useCallback } from 'react'
import {
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  formatISO,
  differenceInDays,
} from 'date-fns'

interface UseDateRangeReturn {
  dateFrom: string
  dateTo: string
  setQuickSelect: (type: QuickSelectType) => void
  setCustomDate: (from: string, to: string) => void
  clearDate: () => void
  error: string | null
}

type QuickSelectType =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last3Months'
  | 'last6Months'
  | 'thisYear'

export function useDateRange(
  initialDateFrom = formatISO(startOfToday(), { representation: 'date' }),
  initialDateTo = formatISO(startOfToday(), { representation: 'date' })
): UseDateRangeReturn {
  const [dateFrom, setDateFrom] = useState(initialDateFrom)
  const [dateTo, setDateTo] = useState(initialDateTo)
  const [error, setError] = useState<string | null>(null)

  const getQuickSelectDates = useCallback((type: QuickSelectType): [string, string] => {
    const today = startOfToday()

    const ranges: Record<QuickSelectType, [Date, Date]> = {
      today: [today, today],
      yesterday: [startOfYesterday(), startOfYesterday()],
      thisWeek: [startOfWeek(today), endOfWeek(today)],
      lastWeek: [startOfWeek(subMonths(today, 1)), endOfWeek(subMonths(today, 1))],
      thisMonth: [startOfMonth(today), endOfMonth(today)],
      lastMonth: [startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1))],
      last3Months: [subMonths(today, 3), today],
      last6Months: [subMonths(today, 6), today],
      thisYear: [startOfYear(today), today],
    }

    const [from, to] = ranges[type]
    return [formatISO(from, { representation: 'date' }), formatISO(to, { representation: 'date' })]
  }, [])

  const setQuickSelect = useCallback(
    (type: QuickSelectType) => {
      const [from, to] = getQuickSelectDates(type)
      setDateFrom(from)
      setDateTo(to)
      setError(null)
    },
    [getQuickSelectDates]
  )

  const setCustomDate = useCallback((from: string, to: string) => {
    if (!from || !to) {
      setError('Please select both dates')
      return
    }

    if (to < from) {
      setError('End date must be greater than or equal to start date')
      return
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)
    const daysDiff = differenceInDays(toDate, fromDate)

    if (daysDiff > 365) {
      setError('Date range cannot exceed 12 months')
      return
    }

    setDateFrom(from)
    setDateTo(to)
    setError(null)
  }, [])

  const clearDate = useCallback(() => {
    const today = formatISO(startOfToday(), { representation: 'date' })
    setDateFrom(today)
    setDateTo(today)
    setError(null)
  }, [])

  return {
    dateFrom,
    dateTo,
    setQuickSelect,
    setCustomDate,
    clearDate,
    error,
  }
}
