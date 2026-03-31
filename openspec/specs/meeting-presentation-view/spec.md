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


<!-- @trace
source: add-presentation-end-slide
updated: 2026-03-27
code:
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .docs/attendance-logic-notes.md
  - nul
  - src/styles/meetingSurface.ts
  - src/assets/images/cover-sample.jpg
  - src/mock/reportWorkspaceData.ts
  - src/components/PresentationPage/PresentationPage.tsx
  - src/types/reportWorkspace.ts
  - src/assets/images/End.jpg
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
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

The system SHALL render meeting presentation as a department-first slide deck, and within each department section it SHALL preserve original page order as discrete slides rather than a continuous scroll surface.

#### Scenario: Present project progress in meeting flow by department

- **WHEN** the presentation page loads a project version
- **THEN** the page builds slides in configured department order and, within each department, keeps the original page order for slide playback


<!-- @trace
source: redesign-meeting-presentation-slides
updated: 2026-03-25
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/App.tsx
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/App.test.tsx
-->

---
### Requirement: Department tab navigation uses in-page smooth scroll

The system SHALL provide slide navigation that uses previous/next controls, keyboard left/right arrow shortcuts for sequential playback, and a hidden drawer for direct slide jumping, and SHALL NOT use in-page smooth scroll between department sections as the primary presentation interaction.

#### Scenario: Jump to another slide from presentation navigation

- **WHEN** a presenter uses previous/next controls or opens the hidden slide drawer to select a target slide
- **THEN** the presentation replaces the current slide with the target slide without scrolling within a continuous page

#### Scenario: Navigate slides with keyboard arrow shortcuts

- **WHEN** the presentation is in report playback mode and the presenter presses the Left or Right arrow key
- **THEN** the current slide moves to the previous or next slide when such a target exists


<!-- @trace
source: redesign-meeting-presentation-slides
updated: 2026-03-25
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/App.tsx
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/App.test.tsx
-->

---
### Requirement: Presentation toolbar supports meeting controls

The presentation toolbar SHALL include project/version/lock status, previous/next slide controls, hidden slide-drawer access, fullscreen toggle, and font-size toggle after report playback begins.

#### Scenario: Show required controls in presentation toolbar

- **WHEN** the presentation page is visible in normal mode
- **THEN** the toolbar displays lock-aware meeting context and the required control groups for sequential slide playback and direct slide jumping


<!-- @trace
source: redesign-meeting-presentation-slides
updated: 2026-03-25
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/App.tsx
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/App.test.tsx
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

The cover SHALL include a clear attendee sign-in call-to-action that integrates with attendance workflows and SHALL open the authenticated self sign-in confirmation flow for normal attendee sign-in.

#### Scenario: View cover before report starts

- **WHEN** cover is displayed before report body start
- **THEN** attendees can discover and trigger sign-in from cover without navigating to admin tabs

#### Scenario: Open normal sign-in from cover

- **WHEN** an authenticated attendee triggers normal sign-in from the cover
- **THEN** the dialog shows a read-only identity confirmation flow instead of manual department and name input fields


<!-- @trace
source: auto-derive-self-signin-identity
updated: 2026-03-30
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/mock/reportWorkspaceData.ts
  - session-ses_2c35.md
  - src/assets/images/cover-sample.jpg
  - src/types/reportWorkspace.ts
  - src/styles/meetingSurface.ts
  - .docs/attendance-logic-notes.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/assets/images/End.jpg
  - nul
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
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

In fullscreen mode, the system SHALL auto-hide the presentation toolbar, SHALL reveal it when mouse movement reaches the presentation interaction area, and SHALL hide the application header and left navigation chrome while fullscreen is active.

#### Scenario: Reveal hidden toolbar in fullscreen after mouse movement

- **WHEN** fullscreen mode is active and the presenter moves the mouse into the reveal area
- **THEN** the toolbar becomes visible for interaction and returns to auto-hidden state after inactivity

#### Scenario: Hide application chrome during fullscreen presentation

- **WHEN** the presenter enters fullscreen mode from the presentation page
- **THEN** the application header and left sidebar are hidden until fullscreen mode ends


<!-- @trace
source: redesign-meeting-presentation-slides
updated: 2026-03-25
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/App.tsx
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/App.test.tsx
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

The system SHALL truncate long report text to a globally configured summary line count in presentation mode and SHALL provide an expand action to show full text, while preserving supported lightweight emphasis styles for the three narrative report fields.

#### Scenario: Render long text with default summary

- **WHEN** summary line configuration is set to 4 and a supported narrative field exceeds 4 lines
- **THEN** the view shows a 4-line summary with an explicit expand control for full content and keeps the allowed emphasis styling in both summary and expanded states


<!-- @trace
source: lightweight-report-text-emphasis
updated: 2026-03-30
code:
  - session-ses_2c35.md
  - src/styles/meetingSurface.ts
  - src/types/reportWorkspace.ts
  - src/mock/reportWorkspaceData.ts
  - src/assets/images/End.jpg
  - nul
  - .docs/attendance-logic-notes.md
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/assets/images/cover-sample.jpg
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
-->

---
### Requirement: Pure image page accepts only one image per page

For pure image presentation pages, the system SHALL allow at most one uploaded image for each department on each page.

#### Scenario: Attempt to upload a second image to the same pure image page

- **WHEN** a user tries to add another image to a pure image page that already contains one image for the same department
- **THEN** the system rejects the upload and instructs the user to create another pure image page for additional images


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
### Requirement: Pure image presentation page displays a single image with note

For pure image presentation pages, the system SHALL render the uploaded image as the primary visual content and SHALL display that image's note directly on the page.

#### Scenario: Open a pure image presentation page with one uploaded image

- **WHEN** the presentation opens a pure image page that contains one uploaded image for the current department
- **THEN** the page shows that image as the main content and shows its note inline without requiring a lightbox or gallery action


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
### Requirement: Report slides use card-section full-content layout

For report pages in meeting presentation, the system SHALL render all six report fields for the current department on a single slide using a card-section layout with subtle dividers, preserved whitespace, and full content readability without converting the page into a continuous scroll view.

#### Scenario: Open a report slide for one department page

- **WHEN** the presentation opens a report page slide for a department
- **THEN** the slide shows work item, weekly status and risk, planned build date, approval date, support plan, and executive discussion in fixed content sections on the same slide


<!-- @trace
source: redesign-meeting-presentation-slides
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


<!-- @trace
source: redesign-meeting-presentation-slides
updated: 2026-03-25
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/App.tsx
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/App.test.tsx
-->

---
### Requirement: Presentation respects selected version snapshot

The system SHALL keep displayed content stable to the currently loaded snapshot during the meeting session, including during overtime editing windows, until the session is reloaded or version context is intentionally changed by defined workflow.

#### Scenario: Keep meeting content stable while overtime edits occur

- **WHEN** overtime editing is granted for the locked version while a meeting session is already presenting that version
- **THEN** the visible slide content remains bound to the previously loaded snapshot until the presenter explicitly reloads or re-enters the presentation


<!-- @trace
source: redesign-meeting-presentation-slides
updated: 2026-03-25
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/App.tsx
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/App.test.tsx
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

The system SHALL keep a fixed footer in meeting presentation mode and SHALL display only the current slide index over the total slide count in `current/total` format.

#### Scenario: Show current slide index in fixed footer

- **WHEN** the presenter is viewing slide 2 of a 13-slide meeting deck
- **THEN** the footer shows `2/13`


<!-- @trace
source: refine-presentation-page-context
updated: 2026-03-25
code:
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - nul
  - src/assets/images/logo.png
  - src/App.tsx
  - src/styles/meetingSurface.ts
  - src/components/PresentationPage/PresentationPage.tsx
tests:
  - src/App.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
-->

---
### Requirement: Footer excludes page count and clock

The system SHALL NOT display page title, page type, current clock time, version text, or lock status in the footer, and SHALL use the footer only for slide index over total count.

#### Scenario: Inspect footer content while viewing a slide

- **WHEN** the presenter is viewing any slide in report playback mode
- **THEN** the footer excludes page title, page type, current time, version text, and lock status while keeping only `current/total` page count


<!-- @trace
source: refine-presentation-page-context
updated: 2026-03-25
code:
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - nul
  - src/assets/images/logo.png
  - src/App.tsx
  - src/styles/meetingSurface.ts
  - src/components/PresentationPage/PresentationPage.tsx
tests:
  - src/App.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
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

---
### Requirement: Meeting presentation navigation reaches a managed ending state

The system SHALL let presentation navigation reach a managed ending state after the final content slide and SHALL keep toolbar and keyboard behavior consistent with that ending state.

#### Scenario: Use next button on the final content slide

- **WHEN** a presenter clicks the next button while viewing the final content slide
- **THEN** the presentation enters the managed ending state instead of remaining stuck on the final content slide

#### Scenario: Use right arrow key on the final content slide

- **WHEN** a presenter presses the right arrow key while viewing the final content slide
- **THEN** the presentation enters the managed ending state instead of remaining stuck on the final content slide

### MODIFIED Requirements

<!-- @trace
source: add-presentation-end-slide
updated: 2026-03-27
code:
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - .docs/attendance-logic-notes.md
  - nul
  - src/styles/meetingSurface.ts
  - src/assets/images/cover-sample.jpg
  - src/mock/reportWorkspaceData.ts
  - src/components/PresentationPage/PresentationPage.tsx
  - src/types/reportWorkspace.ts
  - src/assets/images/End.jpg
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
-->

---
### Requirement: Report fields use stronger but balanced heading hierarchy in presentation mode

The presentation view SHALL render report field headings with stronger hierarchy than body content, and SHALL keep the visual treatment balanced enough that field content remains the primary reading focus.

#### Scenario: Render report field heading in presentation mode

- **WHEN** the presentation view renders a report field heading
- **THEN** the heading is visually stronger than body text and remains easy to scan in projection reading conditions

#### Scenario: Preserve content-first balance in presentation mode

- **WHEN** the presentation view renders a report field with heading and content together
- **THEN** the heading improves structural readability without overpowering the body content or disrupting the page harmony


<!-- @trace
source: strengthen-presentation-field-heading-hierarchy
updated: 2026-03-27
code:
  - nul
  - src/mock/reportWorkspaceData.ts
  - src/assets/images/cover-sample.jpg
  - .docs/attendance-logic-notes.md
  - src/components/PresentationPage/PresentationPage.tsx
  - src/assets/images/End.jpg
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/types/reportWorkspace.ts
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
-->

---
### Requirement: Report field headings use a restrained left-accent visual language

The presentation view SHALL use a restrained left-accent heading treatment for report fields instead of high-emphasis blocks, and SHALL apply that language consistently across the report page.

#### Scenario: Render multiple report fields on the same page

- **WHEN** the presentation view shows several report fields on a report page
- **THEN** each field heading uses the same restrained left-accent language and the page keeps a coherent visual rhythm

<!-- @trace
source: strengthen-presentation-field-heading-hierarchy
updated: 2026-03-27
code:
  - nul
  - src/mock/reportWorkspaceData.ts
  - src/assets/images/cover-sample.jpg
  - .docs/attendance-logic-notes.md
  - src/components/PresentationPage/PresentationPage.tsx
  - src/assets/images/End.jpg
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/styles/meetingSurface.ts
  - src/types/reportWorkspace.ts
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
-->

---
### Requirement: Cover sign-in dialog distinguishes self and management workflows

The presentation sign-in dialog SHALL present a simplified self sign-in flow for authenticated attendees and SHALL present workflow-specific inputs for proxy sign-in, correction, and backfill actions.

#### Scenario: Authenticated attendee opens self sign-in dialog

- **WHEN** the dialog opens in normal self sign-in mode
- **THEN** the attendee sees identity confirmation content and the minimum actions needed to confirm sign-in

#### Scenario: Operator switches to management workflow in sign-in dialog

- **WHEN** the dialog is opened for proxy sign-in, correction, or backfill
- **THEN** the dialog renders the workflow-specific target and audit inputs required by that management action

<!-- @trace
source: auto-derive-self-signin-identity
updated: 2026-03-30
code:
  - src/components/PresentationPage/PresentationPage.tsx
  - src/mock/reportWorkspaceData.ts
  - session-ses_2c35.md
  - src/assets/images/cover-sample.jpg
  - src/types/reportWorkspace.ts
  - src/styles/meetingSurface.ts
  - .docs/attendance-logic-notes.md
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/assets/images/End.jpg
  - nul
tests:
  - src/components/PresentationPage/PresentationPage.test.tsx
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
-->

---
### Requirement: Presentation renders lightweight text emphasis for supported narrative fields

The presentation view SHALL render bold, text color, emphasis font size, and preserved line breaks for `weeklyStatusAndRisk`, `supportPlan`, and `executiveDiscussion` when those fields contain lightweight text emphasis content.

#### Scenario: Render emphasized narrative field in meeting presentation

- **WHEN** a locked presentation snapshot contains supported narrative field content with lightweight text emphasis
- **THEN** the presentation view shows the stored emphasis styles for that field instead of flattening it to plain text

#### Scenario: Render unsupported plain text field in meeting presentation

- **WHEN** the presentation view renders `workItem`, `plannedBuildDate`, or `approvalDate`
- **THEN** the view keeps those fields in plain text presentation without lightweight emphasis formatting controls or rendering metadata

<!-- @trace
source: lightweight-report-text-emphasis
updated: 2026-03-30
code:
  - session-ses_2c35.md
  - src/styles/meetingSurface.ts
  - src/types/reportWorkspace.ts
  - src/mock/reportWorkspaceData.ts
  - src/assets/images/End.jpg
  - nul
  - .docs/attendance-logic-notes.md
  - src/components/PresentationPage/PresentationPage.tsx
  - src/components/ReportWorkspace/ReportWorkspace.tsx
  - src/assets/images/cover-sample.jpg
tests:
  - src/components/ReportWorkspace/ReportWorkspace.test.tsx
  - src/components/PresentationPage/PresentationPage.test.tsx
-->