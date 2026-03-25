import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App routing', () => {
  it('shows presentation menu entry', () => {
    window.history.pushState({}, '', '/report-workspace');
    render(<App />);

    expect(screen.getAllByRole('link', { name: '會議呈現' }).length).toBeGreaterThan(0);
  });

  it('renders presentation page on /presentation', () => {
    window.history.pushState({}, '', '/presentation');
    render(<App />);

    expect(screen.getByRole('heading', { name: '會議呈現頁面' })).toBeInTheDocument();
  });
});
