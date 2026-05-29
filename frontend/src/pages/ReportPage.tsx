import { useState, useCallback, useEffect } from 'react'
import DateRangeFilter from '../components/DateRangeFilter'
import MultiSelectFilter from '../components/MultiSelectFilter'
import SummaryCard from '../components/SummaryCard'
import ReportTable from '../components/ReportTable'
import ExportButton from '../components/ExportButton'
import { useReportData } from '../hooks/useReportData'
import { useDateRange } from '../hooks/useDateRange'
import { useFilters } from '../hooks/useFilters'
import { ReportFilters, SortConfig, ReportType } from '../types'
import './ReportPage.css'

function ReportPage() {
  const { dateFrom, dateTo, setQuickSelect, setCustomDate } = useDateRange()
  const { filters, addFilter, removeFilter, clearAllFilters, activeFilterCount } = useFilters()
  const [reportType, setReportType] = useState<ReportType>('Full Visitor Log')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'checkInDate', direction: 'desc' })

  // Debounced API fetch
  const { data, metrics, isLoading, error } = useReportData(
    dateFrom,
    dateTo,
    filters,
    reportType
  )

  const handleDateChange = useCallback((from: string, to: string) => {
    setCustomDate(from, to)
  }, [setCustomDate])

  const handleFilterChange = useCallback((key: string, value: string | string[] | undefined) => {
    if (value === undefined || (Array.isArray(value) && value.length === 0)) {
      removeFilter(key)
    } else {
      addFilter(key, value)
    }
  }, [addFilter, removeFilter])

  const handleSort = useCallback((column: string) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const handleClearAllFilters = useCallback(() => {
    clearAllFilters()
  }, [clearAllFilters])

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Visitor Reports</h1>
        <p>Welcome back! Here's your visitor activity summary.</p>
      </div>

      <div className="filters-section">
        <DateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onDateChange={handleDateChange} />
        
        <div className="filter-controls">
          <MultiSelectFilter filters={filters} onFilterChange={handleFilterChange} />
          
          <div className="report-type-selector">
            <label htmlFor="reportType">Report Type:</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
            >
              <option value="Full Visitor Log">Full Visitor Log</option>
              <option value="Pending Approvals">Pending Approvals</option>
              <option value="Overstay">Overstay</option>
              <option value="Department-wise">Department-wise</option>
              <option value="Frequent Visitors">Frequent Visitors</option>
              <option value="Security Incidents">Security Incidents</option>
            </select>
          </div>

          {activeFilterCount > 0 && (
            <div className="filter-badge">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
              <button className="btn-clear-filters" onClick={handleClearAllFilters}>
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-toast">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="metrics-section">
        <SummaryCard title="Total Visitors" value={metrics?.totalVisitors || 0} />
        <SummaryCard title="Avg Duration" value={metrics?.avgDuration || '0h 0m'} />
        <SummaryCard title="Denied Entries" value={metrics?.deniedEntries || 0} />
        <SummaryCard title="Overstays" value={metrics?.overstays || 0} />
        <SummaryCard title="Unique Companies" value={metrics?.uniqueCompanies || 0} />
        <SummaryCard title="Most Visited Dept" value={metrics?.mostVisitedDepartment || 'N/A'} />
      </div>

      <div className="table-section">
        <div className="table-header">
          <h2>Visitor Details</h2>
          <ExportButton
            filters={filters}
            dateFrom={dateFrom}
            dateTo={dateTo}
            reportType={reportType}
            reportData={data}
          />
        </div>

        {isLoading ? (
          <div className="loading-message">Loading report data...</div>
        ) : (
          <ReportTable
            data={data}
            onSort={handleSort}
            currentSort={sortConfig}
          />
        )}
      </div>

      <div className="scheduled-reports-section">
        <p>
          📅 <strong>Scheduled Reports:</strong> Set up automatic report generation.
          <a href="#scheduled-reports"> Configure here</a>
        </p>
      </div>
    </div>
  )
}

export default ReportPage
