# meeting-presentation-view Specification

## Purpose

TBD - created by archiving change 'add-meeting-presentation-controls'. Update Purpose after archive.

## Requirements

### Requirement: Dedicated meeting presentation route

The system SHALL provide a dedicated meeting presentation route that renders report content in read-only mode and SHALL NOT expose editing controls.

#### Scenario: Open presentation mode from navigation

- **WHEN** a user navigates to the presentation route
- **THEN** the system shows meeting-oriented content layout without edit buttons, input fields, or management actions


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Admin-only backend management tab visibility

The admin workspace SHALL include a backend management tab, and this tab SHALL be visible only to administrator role.

#### Scenario: Department user opens workspace tabs

- **WHEN** a non-admin user views workspace tab navigation
- **THEN** backend management tab is not rendered

#### Scenario: Admin opens workspace tabs

- **WHEN** an admin user views workspace tab navigation
- **THEN** backend management tab is rendered and selectable


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Backend management tab uses capability sub-tabs

The backend management tab SHALL organize settings using sub-tabs for presentation, lock-and-overtime, attendance, and field-length governance.

#### Scenario: Open backend management tab

- **WHEN** an admin enters backend management tab
- **THEN** sub-tab navigation is available for presentation, lock-and-overtime, attendance, and field-length governance settings


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Unified UI and interaction style across meeting surfaces

The system SHALL keep visual and interaction style consistent across workspace tabs, backend-management sub-tabs, and meeting presentation surfaces, including typography scale, spacing rhythm, status color semantics, button hierarchy, and state feedback patterns.

#### Scenario: Navigate between workspace, admin management, and presentation

- **WHEN** a user moves between workspace content, backend-management sub-tabs, and presentation views
- **THEN** shared design tokens and interaction patterns remain consistent and no conflicting visual language appears


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Presentation binds to latest locked version

The system SHALL load the latest locked version by default for meeting presentation.

#### Scenario: Open presentation with locked versions available

- **WHEN** at least one locked version exists for the selected project
- **THEN** the presentation view loads the most recently locked version as the displayed snapshot

#### Scenario: Open presentation with no locked version

- **WHEN** no locked version exists for the selected project
- **THEN** the system blocks content rendering and shows guidance that an administrator MUST lock a version first


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Continuous department-first scroll presentation

The system SHALL render content in a continuous department-first flow, and within each department section it SHALL preserve original page order.

#### Scenario: Present project progress in meeting flow by department

- **WHEN** the presentation page loads a project version
- **THEN** the page displays department sections in configured department order and each section displays content in original page order


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Department tab navigation uses in-page smooth scroll

The system SHALL provide department tabs in backend-defined department order, and tab selection SHALL perform in-page smooth scroll to the target department section.

#### Scenario: Jump to another department section

- **WHEN** a presenter selects a department tab
- **THEN** the viewport smoothly scrolls to the matching section without replacing the current page with a single-department mode


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Presentation toolbar supports meeting controls

The presentation toolbar SHALL include project/version/lock status, department tabs, fullscreen toggle, and font-size toggle.

#### Scenario: Show required controls in presentation toolbar

- **WHEN** the presentation page is visible in normal mode
- **THEN** the toolbar displays lock-aware meeting context and the four required control groups


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Cover page metadata is managed from admin workspace

The system SHALL source cover page metadata from admin-managed meeting data and SHALL limit cover fields to project, meeting datetime, and version information.

#### Scenario: Render cover with managed metadata

- **WHEN** presentation is opened for a valid meeting configuration
- **THEN** cover displays project, meeting datetime, and version information from admin-managed data


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Cover blocks entry when required metadata is missing

The system SHALL block entering report body if any required cover metadata is missing.

#### Scenario: Missing required cover field

- **WHEN** cover metadata is incomplete
- **THEN** the system blocks report start and prompts user to complete data in admin workspace


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Cover starts report body by manual action

The system SHALL enter report body only after explicit presenter action on cover page.

#### Scenario: Start report from cover

- **WHEN** presenter clicks start report action on cover
- **THEN** the system transitions from cover to report body view


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Cover includes attendee sign-in call-to-action

The cover SHALL include a clear attendee sign-in call-to-action that integrates with attendance workflows.

#### Scenario: View cover before report starts

- **WHEN** cover is displayed before report body start
- **THEN** attendees can discover and trigger sign-in from cover without navigating to admin tabs


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Presenter can return to cover from report body

The system SHALL provide a return-to-cover action in report body controls.

#### Scenario: Return to cover during meeting

- **WHEN** presenter uses return-to-cover action
- **THEN** the system navigates back to cover page without changing loaded snapshot


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Fullscreen mode auto-hides toolbar

In fullscreen mode, the system SHALL auto-hide the toolbar and SHALL reveal it when pointer interaction occurs at the top boundary.

#### Scenario: Reveal hidden toolbar in fullscreen

- **WHEN** fullscreen mode is active and the pointer reaches the top reveal area
- **THEN** the toolbar becomes visible for interaction and returns to auto-hidden state after inactivity


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Font-size toggle supports normal and large modes

The system SHALL provide exactly two typography modes for meeting presentation: normal and large.

#### Scenario: Switch to large mode

- **WHEN** the presenter toggles font size from normal to large
- **THEN** presentation text and key labels update to large mode across visible content


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Text content uses configurable summary lines with expansion

The system SHALL truncate long report text to a globally configured summary line count in presentation mode and SHALL provide an expand action to show full text.

#### Scenario: Render long text with default summary

- **WHEN** summary line configuration is set to 4 and a field exceeds 4 lines
- **THEN** the view shows a 4-line summary with an explicit expand control for full content


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Department image preview and lightbox behavior

For image pages in each department section, the system SHALL show up to 4 preview thumbnails and SHALL provide a "View All" action that opens a lightbox.

#### Scenario: Open lightbox from image section

- **WHEN** a presenter selects "View All" in a department image section
- **THEN** the lightbox opens starting from the first image of that section


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Lightbox shows image notes by default

The lightbox SHALL display image notes by default for each displayed image.

#### Scenario: Navigate images in lightbox with notes visible

- **WHEN** the presenter moves to next or previous image inside lightbox
- **THEN** the corresponding image note remains visible by default


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Presentation respects selected version snapshot

The system SHALL keep displayed content stable to the currently loaded snapshot during the meeting session.

#### Scenario: Keep meeting content stable

- **WHEN** a meeting is in progress on version N
- **THEN** the presented content remains bound to version N until the session is reloaded or version context is intentionally changed by defined workflow


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Presentation layout targets desktop and projector first

The first release of meeting presentation SHALL prioritize desktop and projector readability over mobile-first layout behavior.

#### Scenario: Display presentation on desktop resolution

- **WHEN** the page is rendered on desktop or projector viewport
- **THEN** spacing, control density, and section readability follow the meeting-first desktop layout baseline


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Footer remains fixed with minimal context fields

The system SHALL keep footer visible during report body and SHALL display only current department, current section, version, and lock status.

#### Scenario: View fixed footer in report body

- **WHEN** presenter scrolls through report body
- **THEN** footer remains fixed and shows department, section, version, and lock status context


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Footer excludes page count and clock

The system SHALL NOT display page count or current clock time in footer.

#### Scenario: Inspect footer content set

- **WHEN** footer is rendered
- **THEN** footer content excludes page numbering and current time fields


<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->

---
### Requirement: Cover uses minimalist presentation style

The cover SHALL NOT display logo, attendance statistics, or free-form note fields.

#### Scenario: Inspect cover content boundaries

- **WHEN** cover is displayed
- **THEN** only required meeting metadata appears without logo, attendance summary, or ad-hoc note input

<!-- @trace
source: add-meeting-presentation-controls
updated: 2026-03-25
code:
  - .opencode/skills/spectra-archive/SKILL.md
  - package.json
  - src/constants/reportFieldLimits.ts
  - .opencode/skills/spectra-apply/SKILL.md
  - src/mock/reportWorkspaceData.ts
  - .opencode/commands/spectra-audit.md
  - .opencode/commands/spectra-apply.md
  - src/App.tsx
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .opencode/skills/spectra-ingest/SKILL.md
  - .opencode/commands/spectra-propose.md
  - .opencode/skills/spectra-debug/SKILL.md
  - .opencode/commands/spectra-ask.md
  - .opencode/commands/spectra-archive.md
  - src/types/reportWorkspace.ts
  - src/components/PresentationPage/index.ts
  - .opencode/commands/spectra-ingest.md
  - .opencode/commands/spectra-discuss.md
  - AGENTS.md
  - src/styles/meetingSurface.ts
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - vite.config.ts
  - .opencode/commands/spectra-debug.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .opencode/skills/spectra-propose/SKILL.md
  - .opencode/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .opencode/skills/spectra-discuss/SKILL.md
  - CLAUDE.md
  - src/components/PresentationPage/PresentationPage.tsx
  - .opencode/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/test/setup.ts
  - src/App.test.tsx
  - src/test/smoke.test.ts
-->