import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { createWorkspaceProject } from './mock/reportWorkspaceData';

const seedPresentationProject = () => {
  const project = createWorkspaceProject('project-1', '專案 Alpha');
  project.versions = [{ ...project.versions[0], isLocked: true, versionNo: 3 }];
  project.presentation.cover.meetingDateTime = '2026-03-25 14:00';
  project.presentation.cover.versionInfo = 'v3 (已鎖定)';
  window.localStorage.setItem(
    'report-workspace-state',
    JSON.stringify({
      currentRole: 'admin',
      activeProjectId: project.id,
      projects: [project],
    })
  );
};

describe('App routing', () => {
  it('shows presentation menu entry', () => {
    window.history.pushState({}, '', '/report-workspace');
    render(<App />);

    expect(screen.getAllByRole('link', { name: '會議呈現' }).length).toBeGreaterThan(0);
  });

  it('renders presentation page on /presentation', () => {
    window.history.pushState({}, '', '/presentation');
    seedPresentationProject();
    render(<App />);

    expect(screen.getByRole('heading', { name: '會議呈現頁面' })).toBeInTheDocument();
  });

  it('hides app header and left sidebar while presentation is fullscreen', () => {
    window.history.pushState({}, '', '/presentation');
    seedPresentationProject();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '開始報告' }));

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '全螢幕' }));

    expect(screen.queryByTestId('app-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('app-sidebar')).not.toBeInTheDocument();
  });
});
