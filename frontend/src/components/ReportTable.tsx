import { useMemo } from 'react'
import { VisitRecord, SortConfig } from '../types'
import './ReportTable.css'

interface ReportTableProps {
  data: VisitRecord[]
  onSort: (column: string) => void
  currentSort: SortConfig
}

const COLUMN_HEADERS = [
  'Sr. No.',
  'Visitor Name',
  'Company',
  'Host Employee',
  'Department',
  'ID Type',
  'Check-in Date',
  'Check-in Time',
  'Check-out Time',
  'Total Duration',
  'Visit Purpose',
  'Status',
]

const SORTABLE_COLUMNS = [
  'id',
  'visitorName',
  'company',
  'hostEmployee',
  'department',
  'idTypeMasked',
  'checkInDate',
  'checkInTime',
  'checkOutTime',
  'totalDuration',
  'visitPurpose',
  'status',
]

function ReportTable({ data, onSort, currentSort }: ReportTableProps) {
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return []

    const sorted = [...data].sort((a, b) => {
      let aVal: any = a[currentSort.column as keyof VisitRecord]
      let bVal: any = b[currentSort.column as keyof VisitRecord]

      if (aVal === null || aVal === undefined) aVal = ''
      if (bVal === null || bVal === undefined) bVal = ''

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [data, currentSort])

  const handleColumnClick = (columnKey: string) => {
    onSort(columnKey)
  }

  const getSortIndicator = (columnKey: string) => {
    if (currentSort.column !== columnKey) return ''
    return currentSort.direction === 'asc' ? ' ▲' : ' ▼'
  }

  if (sortedData.length === 0) {
    return (
      <div className="report-table-empty">
        <p>No visitor records found for the selected filters and date range.</p>
      </div>
    )
  }

  return (
    <div className="report-table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            {COLUMN_HEADERS.map((header, idx) => {
              const columnKey = SORTABLE_COLUMNS[idx]
              const isSortable = SORTABLE_COLUMNS.includes(columnKey)

              return (
                <th
                  key={header}
                  className={isSortable ? 'sortable' : ''}
                  onClick={() => isSortable && handleColumnClick(columnKey)}
                  title={isSortable ? 'Click to sort' : ''}
                >
                  {header}
                  {isSortable && getSortIndicator(columnKey)}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record, idx) => (
            <tr key={record.id} className={idx % 2 === 0 ? 'even' : 'odd'}>
              <td>{idx + 1}</td>
              <td title={record.visitorName}>{record.visitorName}</td>
              <td title={record.company}>{record.company}</td>
              <td title={record.hostEmployee}>{record.hostEmployee}</td>
              <td>{record.department}</td>
              <td>{record.idTypeMasked}</td>
              <td>{record.checkInDate}</td>
              <td>{record.checkInTime}</td>
              <td>{record.checkOutTime}</td>
              <td>{record.totalDuration}</td>
              <td>{record.visitPurpose}</td>
              <td>
                <span className={`status-badge status-${record.status.toLowerCase().replace('-', '')}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-pagination">
        <span>Showing {sortedData.length} of {sortedData.length} records</span>
      </div>
    </div>
  )
}

export default ReportTable
