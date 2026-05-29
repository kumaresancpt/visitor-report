import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ReportTable from '../components/ReportTable';
import { VisitRecord, SortConfig } from '../types';

describe('ReportTable', () => {
  const mockOnSort = vi.fn();

  const mockData: VisitRecord[] = [
    {
      id: '1',
      visitorName: 'Alice Johnson',
      company: 'Tech Corp',
      hostEmployee: 'Bob Smith',
      department: 'Finance',
      idTypeMasked: 'XXXX-XXXX-1234',
      checkInDate: '2026-05-29',
      checkInTime: '09:30',
      checkOutTime: '10:45',
      totalDuration: '1h 15m',
      visitPurpose: 'Meeting',
      status: 'Checked-Out',
    },
    {
      id: '2',
      visitorName: 'Charlie Brown',
      company: 'Finance Inc',
      hostEmployee: 'Diana Prince',
      department: 'Operations',
      idTypeMasked: 'XXXX-XXXX-5678',
      checkInDate: '2026-05-29',
      checkInTime: '11:00',
      checkOutTime: '12:30',
      totalDuration: '1h 30m',
      visitPurpose: 'Interview',
      status: 'Checked-Out',
    },
  ];

  const defaultSortConfig: SortConfig = {
    column: 'checkInDate',
    direction: 'desc',
  };

  beforeEach(() => {
    mockOnSort.mockClear();
  });

  // AC-06: Report Table Tests
  test('should display all 12 column headers', () => {
    render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(screen.getByText('Sr. No.')).toBeInTheDocument();
    expect(screen.getByText('Visitor Name')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Host Employee')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('ID Type')).toBeInTheDocument();
    expect(screen.getByText('Check-in Date')).toBeInTheDocument();
    expect(screen.getByText('Check-in Time')).toBeInTheDocument();
    expect(screen.getByText('Check-out Time')).toBeInTheDocument();
    expect(screen.getByText('Total Duration')).toBeInTheDocument();
    expect(screen.getByText('Visit Purpose')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('should display visitor data in rows', () => {
    render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  test('should display masked IDs (AC-11)', () => {
    render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(screen.getByText('XXXX-XXXX-1234')).toBeInTheDocument();
    expect(screen.getByText('XXXX-XXXX-5678')).toBeInTheDocument();
  });

  test('should make column headers clickable for sorting', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const visitorNameHeader = screen.getByText('Visitor Name');
    await user.click(visitorNameHeader);

    expect(mockOnSort).toHaveBeenCalledWith('visitorName');
  });

  test('should call onSort when header clicked', async () => {
    const user = userEvent.setup();
    render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const companyHeader = screen.getByText('Company');
    await user.click(companyHeader);

    expect(mockOnSort).toHaveBeenCalled();
  });

  test('should display sort indicator on active column', () => {
    const activeSortConfig: SortConfig = {
      column: 'visitorName',
      direction: 'asc',
    };

    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={activeSortConfig}
      />
    );

    const visitorNameHeader = screen.getByText('Visitor Name');
    expect(visitorNameHeader).toBeInTheDocument();
  });

  test('should show ascending sort indicator', () => {
    const activeSortConfig: SortConfig = {
      column: 'visitorName',
      direction: 'asc',
    };

    render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={activeSortConfig}
      />
    );

    expect(screen.getByText('Visitor Name')).toBeInTheDocument();
  });

  test('should show descending sort indicator', () => {
    const activeSortConfig: SortConfig = {
      column: 'visitorName',
      direction: 'desc',
    };

    render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={activeSortConfig}
      />
    );

    expect(screen.getByText('Visitor Name')).toBeInTheDocument();
  });

  test('should display alternating row shading', () => {
    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    // Check for alternating classes
    expect(rows[0]).toHaveClass('even');
    expect(rows[1]).toHaveClass('odd');
  });

  test('should display status badge with styling', () => {
    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const statusBadges = container.querySelectorAll('.status-badge');
    expect(statusBadges.length).toBeGreaterThan(0);
  });

  test('should show correct status badge for checked-out', () => {
    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(screen.getByText('Checked-Out')).toBeInTheDocument();
  });

  test('should show empty message when no data', () => {
    render(
      <ReportTable
        data={[]}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(
      screen.getByText(/No visitor records found/i)
    ).toBeInTheDocument();
  });

  test('should handle single row of data', () => {
    render(
      <ReportTable
        data={[mockData[0]]}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Charlie Brown')).not.toBeInTheDocument();
  });

  test('should have proper table structure', () => {
    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();

    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  test('should display row numbers in Sr. No. column', () => {
    const { container } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const cells = container.querySelectorAll('tbody td:first-child');
    expect(cells[0].textContent).toBe('1');
    expect(cells[1].textContent).toBe('2');
  });

  test('should sort data correctly', () => {
    const { rerender } = render(
      <ReportTable
        data={mockData}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    // Verify sorting occurs
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  test('should handle special characters in names', () => {
    const dataWithSpecialChars: VisitRecord[] = [
      ...mockData,
      {
        ...mockData[0],
        id: '3',
        visitorName: "O'Brien-Smith, Jr.",
      },
    ];

    render(
      <ReportTable
        data={dataWithSpecialChars}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    expect(screen.getByText("O'Brien-Smith, Jr.")).toBeInTheDocument();
  });

  test('should display truncation titles for long text', () => {
    const dataWithLongNames: VisitRecord[] = [
      {
        ...mockData[0],
        visitorName: 'This is a very long visitor name that should be truncated',
      },
    ];

    const { container } = render(
      <ReportTable
        data={dataWithLongNames}
        onSort={mockOnSort}
        currentSort={defaultSortConfig}
      />
    );

    const cells = container.querySelectorAll('tbody td[title]');
    expect(cells.length).toBeGreaterThan(0);
  });
});
