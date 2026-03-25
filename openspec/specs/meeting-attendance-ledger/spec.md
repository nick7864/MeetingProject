# meeting-attendance-ledger Specification

## Purpose

TBD - created by archiving change 'add-meeting-presentation-controls'. Update Purpose after archive.

## Requirements

### Requirement: Session-based attendance model

The system SHALL bind attendance to each meeting session and SHALL maintain both expected roster and actual attendance records per session.

#### Scenario: Open attendance for a meeting session

- **WHEN** a meeting session is created
- **THEN** the session contains expected participant roster and accepts actual sign-in records linked to that session


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
### Requirement: Admin-only expected roster management before lock

The system SHALL allow only administrators to edit expected participant roster before meeting lock time.

#### Scenario: Non-admin tries to edit expected roster

- **WHEN** a non-admin user attempts to add, remove, or update expected participants
- **THEN** the system rejects the change


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
### Requirement: Expected roster freezes at lock time

The system SHALL freeze expected roster at meeting lock time and SHALL NOT allow roster edits after lock time.

#### Scenario: Attempt expected roster change after lock

- **WHEN** current time is equal to or later than meeting lock time
- **THEN** expected roster update actions are blocked


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
### Requirement: Electronic sign-in before meeting

The system SHALL provide an electronic sign-in flow for each meeting session before or during the meeting and SHALL associate each sign-in with the target meeting session.

#### Scenario: Participant signs in for a meeting

- **WHEN** a participant submits sign-in for an active meeting session
- **THEN** the system creates a sign-in record linked to that meeting session


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
### Requirement: Presentation cover provides attendee sign-in entry point

The system SHALL provide attendee sign-in entry on the meeting presentation cover, so attendees can sign in without entering admin workspace.

#### Scenario: Attendee signs in from presentation cover

- **WHEN** an attendee opens presentation cover during an active sign-in period
- **THEN** sign-in entry is available on cover and opens the manual sign-in flow


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
### Requirement: Cover sign-in entry reflects sign-in state

The system SHALL reflect session sign-in state on cover entry controls, including normal sign-in before close and backfill-only flow after close.

#### Scenario: Cover after sign-in close

- **WHEN** sign-in has been closed by admin
- **THEN** cover no longer offers normal sign-in and only offers backfill or correction flow


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
### Requirement: Manual sign-in mode for first release

The first release SHALL support manual sign-in operated through name, department, and confirmation inputs.

#### Scenario: Register manual attendance record

- **WHEN** an operator completes manual sign-in fields and confirms
- **THEN** the system stores the participant attendance record for the target session


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
### Requirement: Admin controls sign-in open and close

The system SHALL allow only administrators to trigger sign-in open and sign-in close actions for a meeting session.

#### Scenario: Non-admin tries to close sign-in

- **WHEN** a non-admin user attempts to execute sign-in open or sign-in close
- **THEN** the system rejects the action and keeps current sign-in state


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
### Requirement: Normal sign-in remains open until admin closes it

The system SHALL keep normal sign-in active until an administrator explicitly closes sign-in.

#### Scenario: Meeting continues without close action

- **WHEN** sign-in has not been explicitly closed by an administrator
- **THEN** normal sign-in remains available


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
### Requirement: Closed sign-in cannot be reopened

After an administrator closes sign-in for a session, the system SHALL NOT allow reopening normal sign-in for that same session.

#### Scenario: Attempt reopen after close

- **WHEN** an administrator attempts to reopen normal sign-in after close
- **THEN** the system denies reopen and requires correction or backfill workflows for further updates


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
### Requirement: No automatic fallback close

The system SHALL NOT automatically close sign-in if the administrator forgets to close it.

#### Scenario: Session exceeds planned end but close is not pressed

- **WHEN** planned meeting end time has passed and no manual close action exists
- **THEN** normal sign-in state remains unchanged


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
### Requirement: Late status is determined by meeting start

The system SHALL mark attendance as late when sign-in timestamp is after meeting start time and before sign-in close.

#### Scenario: Participant signs after start

- **WHEN** sign-in timestamp is later than meeting start time
- **THEN** the record is classified as late


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
### Requirement: Pre-start sign-in is classified as on-time

The system SHALL classify sign-in records created before meeting start as on-time.

#### Scenario: Participant signs before meeting start

- **WHEN** sign-in timestamp is earlier than meeting start time
- **THEN** the record is classified as on-time


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
### Requirement: Attendance record contains accountable identity fields

Each attendance record SHALL include participant name, department, sign-in timestamp, and operator context required for meeting accountability.

#### Scenario: Store complete sign-in metadata

- **WHEN** a sign-in is accepted
- **THEN** the stored record includes participant identity fields and sign-in time for audit use


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
### Requirement: Proxy sign-in requires proxy actor and reason

The system SHALL allow proxy sign-in only when proxy actor identity and proxy reason are provided.

#### Scenario: Submit proxy sign-in without reason

- **WHEN** proxy sign-in is submitted with missing proxy reason
- **THEN** the system denies record creation and shows validation feedback


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
### Requirement: No duplicate primary attendance per person per session

The system SHALL allow at most one active primary attendance record per person per session.

#### Scenario: Attempt duplicate primary sign-in

- **WHEN** a second primary sign-in is submitted for the same person in the same session
- **THEN** the system rejects direct duplication and requires correction workflow


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
### Requirement: Corrections require void-and-replace with reason

The system SHALL process attendance corrections by voiding the previous record and creating a replacement record, with mandatory correction reason and operator metadata.

#### Scenario: Correct existing attendance

- **WHEN** an operator corrects an attendance entry
- **THEN** the prior record is voided with reason and a replacement record is created with full audit trace


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
### Requirement: Attendance ledger is append-only with correction trace

The system SHALL treat attendance records as append-only and SHALL NOT hard-delete records; corrections SHALL be handled by voiding with reason and optional re-sign record.

#### Scenario: Correct a mistaken sign-in

- **WHEN** an operator marks a mistaken attendance record as void
- **THEN** the original record remains in the ledger with void reason and any replacement sign-in is stored as a new record


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
### Requirement: Backfill sign-in is allowed with audit metadata

The system SHALL allow post-meeting backfill sign-in and SHALL require backfill reason and operator metadata.

#### Scenario: Submit backfill sign-in

- **WHEN** an administrator submits backfill sign-in after sign-in is closed
- **THEN** the system stores it as backfill with reason and operator metadata


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
### Requirement: Backfill beyond 24 hours is marked overdue

The system SHALL mark backfill records as overdue when created more than 24 hours after sign-in close.

#### Scenario: Late backfill after 24 hours

- **WHEN** backfill is created later than 24 hours after sign-in close
- **THEN** the record is labeled overdue backfill


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
### Requirement: Attendance result locks at sign-in close

When sign-in is closed, the system SHALL lock normal attendance result state for that session and SHALL require correction or backfill workflows for subsequent changes.

#### Scenario: Admin closes sign-in

- **WHEN** an administrator confirms sign-in close
- **THEN** attendance result is finalized into on-time, late, and absent groups


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
### Requirement: Attendance report groups on-time, late, and absent

The system SHALL present attendance result in three groups: on-time, late, and absent.

#### Scenario: View meeting attendance summary

- **WHEN** attendance summary is opened for a session
- **THEN** participants are grouped into on-time, late, and absent sections


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
### Requirement: Export attendance result as CSV

The system SHALL support CSV export for session attendance result.

#### Scenario: Export session attendance CSV

- **WHEN** an authorized user requests attendance export
- **THEN** the system downloads a CSV containing session attendance details and status groups

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