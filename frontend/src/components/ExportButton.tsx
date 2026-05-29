import { useState } from 'react'
import axios from 'axios'
import { VisitRecord, ReportFilters, ReportType } from '../types'
import './ExportButton.css'

interface ExportButtonProps {
  filters: ReportFilters
  dateFrom: string
  dateTo: string
  reportType: ReportType
  reportData: VisitRecord[]
}

function ExportButton({
  filters,
  dateFrom,
  dateTo,
  reportType,
  reportData,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!dateFrom || !dateTo) {
      setNotification('Please select a date range')
      return
    }

    setIsExporting(true)
    const recordCount = reportData.length

    try {
      const endpoint = format === 'pdf' ? '/api/reports/export-pdf' : '/api/reports/export-excel'
      const payload = {
        filters,
        dateRange: { from: dateFrom, to: dateTo },
        reportType,
        recordCount,
      }

      // For large reports (>= 1000 records), use async export
      if (recordCount >= 1000) {
        await axios.post('/api/reports/export-large', payload)
        setNotification(
          'Your report is being generated. We will email you the download link within 5 minutes.'
        )
      } else {
        // For small reports, trigger file download
        const response = await axios.post(endpoint, payload, {
          responseType: 'blob',
        })
        
        const blob = response.data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `visitor-report-${format}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
        setNotification('Export successful!')
      }

      setShowMenu(false)
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.detail || 'Export failed'
        : error instanceof Error
          ? error.message
          : 'Export failed'
      setNotification(`Error: ${errorMessage}`)
    } finally {
      setIsExporting(false)

      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000)
    }
  }

  return (
    <div className="export-button-container">
      <div className="export-dropdown">
        <button
          className="btn-export"
          onClick={() => setShowMenu(!showMenu)}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : '📥 Export'}
        </button>

        {showMenu && (
          <div className="export-menu">
            <button
              className="export-option"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              📄 Export as PDF
            </button>
            <button
              className="export-option"
              onClick={() => handleExport('excel')}
              disabled={isExporting}
            >
              📊 Export as Excel
            </button>
          </div>
        )}
      </div>

      {notification && (
        <div className={`export-notification ${notification.includes('Error') ? 'error' : 'success'}`}>
          {notification}
        </div>
      )}
    </div>
  )
}

export default ExportButton
