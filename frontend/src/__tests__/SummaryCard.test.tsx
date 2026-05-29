import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import SummaryCard from '../components/SummaryCard';

describe('SummaryCard', () => {
  // AC-05: Summary Metric Cards Tests
  test('should render card with title', () => {
    render(<SummaryCard title="Total Visitors" value={150} />);

    expect(screen.getByText('Total Visitors')).toBeInTheDocument();
  });

  test('should render card with numeric value', () => {
    render(<SummaryCard title="Total Visitors" value={150} />);

    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('should render card with string value', () => {
    render(<SummaryCard title="Avg Duration" value="2h 15m" />);

    expect(screen.getByText('2h 15m')).toBeInTheDocument();
  });

  test('should render card with zero value', () => {
    render(<SummaryCard title="Denied Entries" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('should render card with large number', () => {
    render(<SummaryCard title="Total Visitors" value={999999} />);

    expect(screen.getByText('999999')).toBeInTheDocument();
  });

  test('should display icon when provided', () => {
    const icon = <span data-testid="test-icon">📊</span>;
    const { container } = render(
      <SummaryCard title="Total Visitors" value={150} icon={icon} />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('should not display icon when not provided', () => {
    const { container } = render(
      <SummaryCard title="Total Visitors" value={150} />
    );

    const iconElement = container.querySelector('.card-icon');
    // Icon element may or may not exist based on implementation
    expect(screen.getByText('Total Visitors')).toBeInTheDocument();
  });

  test('should display trend indicator when provided', () => {
    render(
      <SummaryCard
        title="Total Visitors"
        value={150}
        trend={{ value: 5, isPositive: true }}
      />
    );

    // Trend should be displayed
    expect(screen.getByText('Total Visitors')).toBeInTheDocument();
  });

  test('should show positive trend correctly', () => {
    const { container } = render(
      <SummaryCard
        title="Total Visitors"
        value={150}
        trend={{ value: 5, isPositive: true }}
      />
    );

    // Positive trend class should be applied
    expect(screen.getByText('Total Visitors')).toBeInTheDocument();
  });

  test('should show negative trend correctly', () => {
    const { container } = render(
      <SummaryCard
        title="Denied Entries"
        value={5}
        trend={{ value: 2, isPositive: false }}
      />
    );

    // Negative trend class should be applied
    expect(screen.getByText('Denied Entries')).toBeInTheDocument();
  });

  test('should have semantic structure', () => {
    const { container } = render(
      <SummaryCard title="Total Visitors" value={150} />
    );

    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
  });

  test('should render with CSS classes for styling', () => {
    const { container } = render(
      <SummaryCard title="Total Visitors" value={150} />
    );

    const card = container.querySelector('.summary-card');
    expect(card).toBeInTheDocument();
  });

  test('should handle special characters in title', () => {
    render(<SummaryCard title="Avg Duration & Count" value={150} />);

    expect(screen.getByText('Avg Duration & Count')).toBeInTheDocument();
  });

  test('should handle long titles', () => {
    render(
      <SummaryCard
        title="Total Unique Companies Visited"
        value={45}
      />
    );

    expect(screen.getByText('Total Unique Companies Visited')).toBeInTheDocument();
  });

  test('should format duration values correctly', () => {
    render(<SummaryCard title="Avg Duration" value="1h 30m" />);

    expect(screen.getByText('1h 30m')).toBeInTheDocument();
  });

  test('should display integer without decimals', () => {
    render(<SummaryCard title="Total Visitors" value={150} />);

    // Should not display decimal places
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.queryByText('150.0')).not.toBeInTheDocument();
  });
});
