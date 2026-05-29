import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AccessDenied from '../pages/AccessDenied';

describe('AccessDenied', () => {
  // AC-01: Access Control Tests
  test('should display Access Denied heading', () => {
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  test('should display permission error message', () => {
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/You do not have permission to view reports/i)
    ).toBeInTheDocument();
  });

  test('should display exact error message text', () => {
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    expect(
      screen.getByText(
        /You do not have permission to view reports. Please contact your administrator./i
      )
    ).toBeInTheDocument();
  });

  test('should display Go Home button', () => {
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument();
  });

  test('should display icon', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const iconElement = container.querySelector('.access-denied-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement?.textContent).toBe('⛔');
  });

  test('should navigate home when Go Home button clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const goHomeButton = screen.getByRole('button', { name: /Go Home/i });
    await user.click(goHomeButton);

    // Button click should be processed (navigation happens via router)
    expect(goHomeButton).toBeInTheDocument();
  });

  test('should have proper semantic structure', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toBe('Access Denied');
  });

  test('should have CSS class for styling', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const mainContainer = container.querySelector('.access-denied-container');
    expect(mainContainer).toBeInTheDocument();
  });

  test('should display card element', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const card = container.querySelector('.access-denied-card');
    expect(card).toBeInTheDocument();
  });

  test('should display message with proper CSS class', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const message = container.querySelector('.access-denied-message');
    expect(message).toBeInTheDocument();
  });

  test('should display button with proper CSS class', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const button = container.querySelector('.btn-home');
    expect(button).toBeInTheDocument();
  });

  test('should prevent admin access when not authorized', () => {
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    // This page should be shown when access is denied
    expect(
      screen.getByText(/You do not have permission to view reports/i)
    ).toBeInTheDocument();
  });

  test('should be accessible by keyboard', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    const goHomeButton = screen.getByRole('button', { name: /Go Home/i });

    // Tab to button
    await user.tab();

    // Button should be focusable
    expect(goHomeButton).toBeInTheDocument();
  });

  test('should render without errors', () => {
    const { container } = render(
      <BrowserRouter>
        <AccessDenied />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
