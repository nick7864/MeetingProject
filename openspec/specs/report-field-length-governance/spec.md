# report-field-length-governance Specification

## Purpose

TBD - created by archiving change 'add-meeting-presentation-controls'. Update Purpose after archive.

## Requirements

### Requirement: Configurable maximum character limits per report field

The system SHALL define and enforce maximum character limits for each report input field.

#### Scenario: Input exceeds configured limit

- **WHEN** a user types text beyond the configured max characters of a field
- **THEN** the system rejects additional input and keeps stored value within the configured limit


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
### Requirement: Admin-managed limits with bounded range

The system SHALL allow administrators to adjust per-field character limits within a bounded range of 50 to 1000.

#### Scenario: Save field limit outside allowed range

- **WHEN** an administrator attempts to set a field limit below 50 or above 1000
- **THEN** the system rejects the update and shows validation feedback


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
### Requirement: Default field limit profile is provided

The system SHALL provide a default per-field limit profile before any admin customization.

#### Scenario: Initialize project with default limits

- **WHEN** a project has no customized field-limit settings
- **THEN** report fields use the system default per-field limits


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
### Requirement: Real-time character count feedback

The system SHALL display current character count and maximum allowed count while users edit report fields, and SHALL compute the count from plain text content even when a supported field stores lightweight text emphasis metadata.

#### Scenario: User edits long status content

- **WHEN** a user updates a report field
- **THEN** the UI shows live count in the format of current plain-text length over max length


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
### Requirement: Near-limit warning begins at 80 percent

The system SHALL show a near-limit warning state when field content reaches or exceeds 80 percent of that field limit.

#### Scenario: Enter content near limit

- **WHEN** field length reaches at least 80 percent of configured limit
- **THEN** the character counter switches to warning style


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
### Requirement: Over-limit paste is truncated with notice

The system SHALL truncate pasted content to the configured field limit and SHALL notify user that paste content was truncated, and truncation for emphasis-capable fields SHALL preserve only the allowed styles that still apply to the retained plain text.

#### Scenario: Paste oversized text

- **WHEN** pasted text length would exceed field limit
- **THEN** the stored field value is truncated to max plain-text length and truncation notice is shown


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
### Requirement: Character counting includes spaces and newlines

The system SHALL count spaces and newline characters toward field length limits, and SHALL ignore emphasis metadata when computing field length.

#### Scenario: Count multiline text with spaces

- **WHEN** a user enters multiline text containing spaces
- **THEN** the counter increases for visible characters, spaces, and newline characters regardless of emphasis styling


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
### Requirement: Publish and lock require compliant field lengths

The system SHALL block publish-or-lock actions if any report field violates configured length rules and SHALL show validation feedback indicating non-compliant fields.

#### Scenario: Attempt lock with non-compliant content

- **WHEN** an administrator attempts to lock or publish a version containing over-limit field values
- **THEN** the system denies the action and identifies the violating fields


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
### Requirement: Legacy over-limit content is never silently mutated

The system SHALL NOT auto-truncate existing stored content when limit settings change, and SHALL require remediation during next edit or lock workflow.

#### Scenario: Limit reduced below existing content length

- **WHEN** a field limit is reduced and existing stored content exceeds the new limit
- **THEN** existing content remains unchanged until user edits or lock validation enforces remediation

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