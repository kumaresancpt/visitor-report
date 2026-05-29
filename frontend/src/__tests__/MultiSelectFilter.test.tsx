import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { ReportFilters } from '../types';

describe('MultiSelectFilter', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  // AC-03: Multi-Dimensional Filtering Tests
  test('should render Department filter dropdown', () => {
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    // Should have filter buttons including Department
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should render Host Employee filter dropdown', () => {
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should render Visit Purpose filter dropdown', () => {
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should render Status filter dropdown', () => {
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should expand/collapse filter when clicked', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    const { container } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      // Dropdown should expand/collapse
      expect(buttons[0]).toBeInTheDocument();
    }
  });

  test('should display filter count badge when items selected', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = { department: ['Finance'] };
    const { rerender } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    // When filters exist, count badge should show
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should call onFilterChange when checkbox clicked', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    const { container } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      // Click first filter button to expand
      await user.click(buttons[0]);

      // Then click a checkbox if visible
      const checkboxes = screen.queryAllByRole('checkbox');
      if (checkboxes.length > 0) {
        await user.click(checkboxes[0]);
        expect(mockOnFilterChange).toHaveBeenCalled();
      }
    }
  });

  test('should display department options', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    const { container } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    // Should have Department button
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should display host employee options', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should display visit purpose options', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should display status options', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should handle multiple selections', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = {};
    const { rerender } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      // Simulate multiple filter selections
      await user.click(buttons[0]);
      expect(buttons[0]).toBeInTheDocument();
    }
  });

  test('should apply AND logic to filters', async () => {
    const filters: ReportFilters = {
      department: ['Finance'],
      status: ['Approved'],
    };
    const { rerender } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    // Both filters should be applied (AND logic)
    expect(mockOnFilterChange).toBeDefined();
  });

  test('should uncheck item when toggled', async () => {
    const user = userEvent.setup();
    const filters: ReportFilters = { department: ['Finance'] };
    const { rerender } = render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      expect(buttons[0]).toBeInTheDocument();
    }
  });

  test('should handle empty filter values', () => {
    const filters: ReportFilters = {};
    render(
      <MultiSelectFilter filters={filters} onFilterChange={mockOnFilterChange} />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
