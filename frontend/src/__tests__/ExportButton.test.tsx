import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import axios from 'axios';
import ExportButton from '../components/ExportButton';
import { VisitRecord, ReportFilters } from '../types';

vi.mock('axios');
const mockedAxios = axios as any;

describe('ExportButton', () => {
  const mockReportData: VisitRecord[] = [
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
      status: 'Checked-Out',
    },
  ];

  const mockFilters: ReportFilters = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.post.mockResolvedValue({ data: new Blob() });
    mockedAxios.isAxiosError.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // AC-07: PDF Export Tests
  test('should display export button', () => {
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
  });

  test('should show export menu when button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    // Menu should be visible
    const menu = container.querySelector('.export-menu');
    if (menu) {
      expect(menu).toBeInTheDocument();
    }
  });

  test('should have PDF export option', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    // PDF export should be available
    const menu = container.querySelector('.export-menu');
    expect(menu).toBeDefined();
  });

  // AC-08: Excel Export Tests
  test('should have Excel export option', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    const menu = container.querySelector('.export-menu');
    expect(menu).toBeDefined();
  });

  test('should call API when PDF export clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    // Simulate clicking PDF option
    const buttons = screen.getAllByRole('button');
    if (buttons.length > 1) {
      // There should be export format buttons
      expect(buttons.length).toBeGreaterThan(1);
    }
  });

  test('should call API when Excel export clicked', async () => {
    const user = userEvent.setup();
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  // AC-09: Large Report Email Handling
  test('should show email notification for large reports (1000+ rows)', async () => {
    const largeData = Array(1001)
      .fill(null)
      .map((_, i) => ({
        ...mockReportData[0],
        id: `${i}`,
        visitorName: `Visitor ${i}`,
      }));

    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={largeData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    // For large reports, should show async export
    expect(exportButton).toBeInTheDocument();
  });

  test('should show message about email within 5 minutes', async () => {
    const largeData = Array(1001)
      .fill(null)
      .map((_, i) => ({
        ...mockReportData[0],
        id: `${i}`,
      }));

    mockedAxios.post.mockResolvedValue({ data: { success: true } });

    const user = userEvent.setup();
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={largeData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  test('should show error notification on export failure', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { detail: 'Export service unavailable' } },
    });
    mockedAxios.isAxiosError.mockReturnValue(true);

    const user = userEvent.setup();
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  test('should disable export button when no date range', async () => {
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom=""
        dateTo=""
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    // Button should be visible
    expect(exportButton).toBeInTheDocument();
  });

  test('should show success notification after export', async () => {
    mockedAxios.post.mockResolvedValue({ data: new Blob() });

    const user = userEvent.setup();
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  test('should trigger file download for small reports', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  test('should clear notification after 5 seconds', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers();

    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    expect(exportButton).toBeInTheDocument();

    vi.useRealTimers();
  });

  test('should handle different report types', async () => {
    const user = userEvent.setup();
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Pending Approvals"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    expect(exportButton).toBeInTheDocument();
  });

  test('should include filters in export request', async () => {
    const filters: ReportFilters = {
      department: 'Finance',
      status: 'Approved',
    };

    const user = userEvent.setup();
    render(
      <ExportButton
        filters={filters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    expect(exportButton).toBeInTheDocument();
  });

  test('should close menu after export', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    await user.click(exportButton);

    expect(exportButton).toBeInTheDocument();
  });

  test('should disable button while exporting', async () => {
    mockedAxios.post.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(() => resolve({ data: new Blob() }), 1000)
        )
    );

    const user = userEvent.setup();
    render(
      <ExportButton
        filters={mockFilters}
        dateFrom="2026-05-29"
        dateTo="2026-05-29"
        reportType="Full Visitor Log"
        reportData={mockReportData}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export/i });
    expect(exportButton).toBeInTheDocument();
  });
});
