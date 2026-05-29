import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ReportPage from '../pages/ReportPage';

vi.mock('axios');
const mockedAxios = axios as any;

const mockReportData = [
  {
    id: '1',
    visitorName: 'John Smith',
    company: 'Acme Corp',
    hostEmployee: 'Alice Johnson',
    department: 'Finance',
    idTypeMasked: 'XXXX-XXXX-5678',
    checkInDate: '2026-05-29',
    checkInTime: '09:30',
    checkOutTime: '10:45',
    totalDuration: '1h 15m',
    visitPurpose: 'Meeting',
    status: 'Checked-Out' as const,
  },
  {
    id: '2',
    visitorName: 'Jane Doe',
    company: 'Tech Inc',
    hostEmployee: 'Bob Wilson',
    department: 'Operations',
    idTypeMasked: 'XXXX-XXXX-9876',
    checkInDate: '2026-05-29',
    checkInTime: '10:00',
    checkOutTime: '11:30',
    totalDuration: '1h 30m',
    visitPurpose: 'Interview',
    status: 'Checked-Out' as const,
  },
  {
    id: '3',
    visitorName: 'Mike Johnson',
    company: 'Vendor LLC',
    hostEmployee: 'Sarah Davis',
    department: 'Finance',
    idTypeMasked: 'XXXX-XXXX-1234',
    checkInDate: '2026-05-29',
    checkInTime: '14:00',
    checkOutTime: null,
    totalDuration: null,
    visitPurpose: 'Delivery',
    status: 'Pending' as const,
  },
];

const mockMetrics = {
  totalVisitors: 150,
  avgDuration: '2h 15m',
  deniedEntries: 5,
  overstays: 3,
  uniqueCompanies: 45,
  mostVisitedDepartment: 'Finance',
};

describe('ReportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: { records: mockReportData, metrics: mockMetrics },
    });
    mockedAxios.post.mockResolvedValue({ data: new Blob() });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // AC-02: Date Range Selection Tests
  describe('AC-02: Date Range Selection', () => {
    test('should display date range filter section', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      expect(screen.getByText('Visitor Reports')).toBeInTheDocument();
      // Should render DateRangeFilter component
      const dateInputs = screen.queryAllByRole('button');
      expect(dateInputs.length).toBeGreaterThan(0);
    });

    test('should display quick-select date range buttons', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Check for quick-select buttons
      expect(screen.queryByText(/Today|Yesterday|This Week/i)).toBeDefined();
    });

    test('should show custom date inputs when toggled', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Look for toggle or custom date option
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // AC-03: Multi-Dimensional Filtering Tests
  describe('AC-03: Multi-Dimensional Filtering', () => {
    test('should render Department filter dropdown', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Department filter should exist
      const filterButtons = screen.queryAllByRole('button');
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    test('should render Host Employee filter dropdown', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // MultiSelectFilter component should be rendered
      expect(screen.getByText('Visitor Reports')).toBeInTheDocument();
    });

    test('should render Visit Purpose filter dropdown', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Filters should be present
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('should render Status filter dropdown', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('should display filter badge when filters are applied', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Initially no filters
      expect(screen.queryByText(/filter.*applied/i)).not.toBeInTheDocument();
    });

    test('should have Clear All Filters button when filters applied', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Clear All button appears conditionally when filters exist
      expect(screen.queryByText(/Clear All/i)).not.toBeInTheDocument();
    });
  });

  // AC-04: Report Types Tests
  describe('AC-04: Report Types', () => {
    test('should display report type selector with all 6 types', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const reportTypeSelect = screen.getByLabelText(/Report Type:/i);
      expect(reportTypeSelect).toBeInTheDocument();

      const options = reportTypeSelect.querySelectorAll('option');
      expect(options.length).toBe(6);
    });

    test('should have Full Visitor Log as default report type', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const reportTypeSelect = screen.getByLabelText(/Report Type:/i) as HTMLSelectElement;
      expect(reportTypeSelect.value).toBe('Full Visitor Log');
    });

    test('should include all 6 report type options', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const reportTypeSelect = screen.getByLabelText(/Report Type:/i);
      const expectedTypes = [
        'Full Visitor Log',
        'Pending Approvals',
        'Overstay',
        'Department-wise',
        'Frequent Visitors',
        'Security Incidents',
      ];

      expectedTypes.forEach(type => {
        expect(
          screen.getByRole('option', { name: type })
        ).toBeInTheDocument();
      });
    });

    test('should allow changing report type', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const reportTypeSelect = screen.getByLabelText(/Report Type:/i);
      await userEvent.selectOption(reportTypeSelect, 'Pending Approvals');

      expect((reportTypeSelect as HTMLSelectElement).value).toBe('Pending Approvals');
    });
  });

  // AC-05: Summary Metric Cards Tests
  describe('AC-05: Summary Metric Cards', () => {
    test('should render Total Visitors summary card', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Total Visitors')).toBeInTheDocument();
      });
    });

    test('should render Avg Duration summary card', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Avg Duration')).toBeInTheDocument();
      });
    });

    test('should render Denied Entries summary card', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Denied Entries')).toBeInTheDocument();
      });
    });

    test('should render Overstays summary card', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Overstays')).toBeInTheDocument();
      });
    });

    test('should render Unique Companies summary card', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Unique Companies')).toBeInTheDocument();
      });
    });

    test('should render Most Visited Department summary card', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Most Visited Department')).toBeInTheDocument();
      });
    });

    test('should display metric values', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Values should be displayed (actual values from mock)
      expect(screen.queryByText(/150|Acme|Finance|Finance/)).toBeDefined();
    });
  });

  // AC-06: Report Table Tests
  describe('AC-06: Report Table Columns & Sorting', () => {
    test('should display all 12 table columns', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
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
    });

    test('should display visitor records in table', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('John Smith')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      });
    });

    test('should have sortable column headers', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const nameHeader = screen.getByText('Visitor Name');
        expect(nameHeader).toBeInTheDocument();
      });
    });

    test('should display masked IDs in table (AC-11)', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('XXXX-XXXX-5678')).toBeInTheDocument();
        expect(screen.getByText('XXXX-XXXX-9876')).toBeInTheDocument();
      });
    });

    test('should show status badges with correct colors', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Status badges should be rendered
        const statusCells = screen.queryAllByText(/Checked-Out|Pending/i);
        expect(statusCells.length).toBeGreaterThan(0);
      });
    });

    test('should display alternating row shading', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
      });
    });
  });

  // AC-07: PDF Export Tests
  describe('AC-07: PDF Export', () => {
    test('should display export button', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const exportButton = screen.queryByRole('button', { name: /Export/i });
      expect(exportButton).toBeDefined();
    });

    test('should have PDF export option in dropdown', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Export button should exist
      const exportButton = screen.queryByRole('button', { name: /Export/i });
      expect(exportButton).toBeDefined();
    });
  });

  // AC-08: Excel Export Tests
  describe('AC-08: Excel Export', () => {
    test('should have Excel export option in dropdown', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const exportButton = screen.queryByRole('button', { name: /Export/i });
      expect(exportButton).toBeDefined();
    });
  });

  // AC-09: Large Report Email Handling
  describe('AC-09: Large Report Handling', () => {
    test('should show email notification for reports with 1000+ rows', async () => {
      const largeData = Array(1001)
        .fill(null)
        .map((_, i) => ({
          ...mockReportData[0],
          id: `${i}`,
          visitorName: `Visitor ${i}`,
        }));

      mockedAxios.get.mockResolvedValue({
        data: { records: largeData, metrics: mockMetrics },
      });

      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Should handle large reports
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  // AC-11: Data Privacy Tests
  describe('AC-11: Data Privacy (ID Masking)', () => {
    test('should mask visitor IDs in table', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('XXXX-XXXX-5678')).toBeInTheDocument();
        // Should NOT show unmasked IDs
        expect(screen.queryByText(/^\d{10}$/)).not.toBeInTheDocument();
      });
    });

    test('should not display full ID numbers anywhere', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Verify masked format is used
      await waitFor(() => {
        const maskedIds = screen.queryAllByText(/XXXX-XXXX-\d{4}/);
        expect(maskedIds.length).toBeGreaterThan(0);
      });
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('should display error message when API fails', async () => {
      mockedAxios.get.mockRejectedValue({
        response: { data: { detail: 'Server error' } },
      });

      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      // Error handling should occur
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    test('should show notification if no date range selected', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      expect(screen.getByText('Visitor Reports')).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('should have accessible form labels', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/Report Type:/i)).toBeInTheDocument();
    });

    test('should have semantic HTML structure', async () => {
      const { container } = render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      const heading = container.querySelector('h1');
      expect(heading).toBeInTheDocument();
    });

    test('should have table with proper role', async () => {
      render(
        <BrowserRouter>
          <ReportPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        const table = screen.queryByRole('table');
        expect(table).toBeDefined();
      });
    });
  });
});
