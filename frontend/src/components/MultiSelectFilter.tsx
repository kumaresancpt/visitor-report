import { useState, useCallback } from 'react'
import { ReportFilters } from '../types'
import './MultiSelectFilter.css'

interface MultiSelectFilterProps {
  filters: ReportFilters
  onFilterChange: (key: string, value: string[] | undefined) => void
}

const DEPARTMENTS = ['Finance', 'HR', 'Operations', 'Security', 'Facility']
const VISIT_PURPOSES = ['Meeting', 'Interview', 'Delivery', 'Vendor', 'Other']
const VISITOR_STATUSES = ['Pending', 'Approved', 'Checked-In', 'Checked-Out', 'Denied']
const HOST_EMPLOYEES = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown']

function MultiSelectFilter({ filters, onFilterChange }: MultiSelectFilterProps) {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)

  const departmentValues = filters.department ? (Array.isArray(filters.department) ? filters.department : [filters.department]) : []
  const hostEmployeeValues = filters.hostEmployee ? (Array.isArray(filters.hostEmployee) ? filters.hostEmployee : [filters.hostEmployee]) : []
  const visitPurposeValues = filters.visitPurpose ? (Array.isArray(filters.visitPurpose) ? filters.visitPurpose : [filters.visitPurpose]) : []
  const statusValues = filters.status ? (Array.isArray(filters.status) ? filters.status : [filters.status]) : []

  const handleFilterToggle = useCallback((filterType: string, value: string) => {
    const currentValues = filterType === 'department' ? departmentValues
      : filterType === 'hostEmployee' ? hostEmployeeValues
      : filterType === 'visitPurpose' ? visitPurposeValues
      : statusValues

    const updated = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    onFilterChange(filterType, updated.length > 0 ? updated : undefined)
  }, [departmentValues, hostEmployeeValues, visitPurposeValues, statusValues, onFilterChange])

  const renderFilterDropdown = (title: string, filterType: string, options: string[], selectedValues: string[]) => (
    <div className="filter-dropdown">
      <button
        className="filter-dropdown-btn"
        onClick={() => setExpandedFilter(expandedFilter === filterType ? null : filterType)}
      >
        {title}
        {selectedValues.length > 0 && <span className="filter-count">{selectedValues.length}</span>}
      </button>

      {expandedFilter === filterType && (
        <div className="filter-dropdown-content">
          {options.map(option => (
            <label key={option} className="filter-option">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleFilterToggle(filterType, option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="multi-select-filter">
      {renderFilterDropdown('Department', 'department', DEPARTMENTS, departmentValues)}
      {renderFilterDropdown('Host Employee', 'hostEmployee', HOST_EMPLOYEES, hostEmployeeValues)}
      {renderFilterDropdown('Visit Purpose', 'visitPurpose', VISIT_PURPOSES, visitPurposeValues)}
      {renderFilterDropdown('Status', 'status', VISITOR_STATUSES, statusValues)}
    </div>
  )
}

export default MultiSelectFilter
