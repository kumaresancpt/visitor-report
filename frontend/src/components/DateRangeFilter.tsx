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
  addDays,
  formatISO,
} from 'date-fns'
import './DateRangeFilter.css'

interface DateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onDateChange: (from: string, to: string) => void
}

type QuickSelectType = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear'

function DateRangeFilter({ dateFrom, dateTo, onDateChange }: DateRangeFilterProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [customFrom, setCustomFrom] = useState(dateFrom)
  const [customTo, setCustomTo] = useState(dateTo)
  const [error, setError] = useState('')

  const getQuickSelectDates = (type: QuickSelectType): [string, string] => {
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
  }

  const handleQuickSelect = useCallback((type: QuickSelectType) => {
    const [from, to] = getQuickSelectDates(type)
    onDateChange(from, to)
    setShowCustom(false)
    setError('')
  }, [onDateChange])

  const handleCustomDateChange = useCallback(() => {
    if (!customFrom || !customTo) {
      setError('Please select both dates')
      return
    }

    if (customTo < customFrom) {
      setError('End date must be greater than or equal to start date')
      return
    }

    const fromDate = new Date(customFrom)
    const toDate = new Date(customTo)
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 365) {
      setError('Date range cannot exceed 12 months')
      return
    }

    onDateChange(customFrom, customTo)
    setError('')
  }, [customFrom, customTo, onDateChange])

  return (
    <div className="date-range-filter">
      <div className="quick-select-buttons">
        <button onClick={() => handleQuickSelect('today')}>Today</button>
        <button onClick={() => handleQuickSelect('yesterday')}>Yesterday</button>
        <button onClick={() => handleQuickSelect('thisWeek')}>This Week</button>
        <button onClick={() => handleQuickSelect('lastWeek')}>Last Week</button>
        <button onClick={() => handleQuickSelect('thisMonth')}>This Month</button>
        <button onClick={() => handleQuickSelect('lastMonth')}>Last Month</button>
        <button onClick={() => handleQuickSelect('last3Months')}>Last 3 Months</button>
        <button onClick={() => handleQuickSelect('last6Months')}>Last 6 Months</button>
        <button onClick={() => handleQuickSelect('thisYear')}>This Year</button>
      </div>

      <div className="date-range-display">
        <span>Reports for {dateFrom} to {dateTo}</span>
      </div>

      <button
        className="btn-custom-date"
        onClick={() => setShowCustom(!showCustom)}
      >
        {showCustom ? 'Hide Custom Date Picker' : 'Show Custom Date Picker'}
      </button>

      {showCustom && (
        <div className="custom-date-picker">
          <div className="date-input-group">
            <label htmlFor="dateFrom">From Date:</label>
            <input
              id="dateFrom"
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="date-input-group">
            <label htmlFor="dateTo">To Date:</label>
            <input
              id="dateTo"
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {error && <div className="date-error">{error}</div>}

          <button className="btn-apply-dates" onClick={handleCustomDateChange}>
            Apply Dates
          </button>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
