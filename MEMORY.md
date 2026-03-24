# Project Memory

Last updated: 2026-03-24 (Asia/Taipei)

## Analysis Snapshot - Project Architecture and Page Logic Root Problems

### 1) Boundary and Structure (facts from code)

- This project is a React + TypeScript + MUI frontend prototype.
- Routing uses React Router v6.
- There are two route entries, both rendering the same page component:
  - `/`
  - `/report-workspace`
- Therefore, this is a single-workspace application with dual entry URLs, not multiple independent business pages.

References:
- `src/App.tsx`
- `src/components/ReportWorkspace/ReportWorkspace.tsx`
- `src/mock/reportWorkspaceData.ts`
- `src/types/reportWorkspace.ts`

### 2) Route-Level Page Analysis

#### Page: `/` (Home entry, mapped to workspace)

- Logic root: provide the fastest entry into the reporting workspace.
- Problem it solves: reduce navigation cost for users who need immediate access to active project/version/page context.

#### Page: `/report-workspace` (Named workspace entry)

- Logic root: provide a semantically explicit URL for the report workspace.
- Problem it solves: stable and shareable deep-link style entry while keeping implementation unified with `/`.

### 3) In-Page Workflow Analysis (inside `ReportWorkspacePage`)

The main workspace page contains internal work modes and page types that function as sub-flows.

#### Sub-flow A: Content mode (`workspaceTab = content`)

- Logic root: centralize department report operations under the active project/version.
- Problem it solves: keep cross-department reporting aligned in one controlled context.

##### A1. Report page type (`activePage.type = report`)

- Logic root: standardized form-based reporting by department blocks.
- Problem it solves: transform fragmented department updates into structured, comparable, meeting-ready records.

##### A2. Image page type (`activePage.type = image`)

- Logic root: image evidence management in reporting context.
- Problem it solves: preserve visual evidence (upload, annotate, order, delete) for clearer status communication and review.

#### Sub-flow B: Chat mode (`workspaceTab = chat`)

- Logic root: provide assistant-style summarization/risk hints from current page context.
- Problem it solves: reduce manual synthesis effort before cross-department discussion.
- Current boundary: mock assistant behavior (rule-based/local simulation), not a real backend AI integration.

### 4) Global Constraints Across All Workflows

#### 4.1 Role and permission model

- Roles: `admin` and `department_user`.
- Admin can manage projects/departments/versions globally.
- Department user is restricted to own department editing scope.
- Root problem solved: prevent unauthorized cross-department edits while allowing centralized oversight.

#### 4.2 Version lock and clone mechanism

- Locking current version makes it read-only.
- System then clones a next editable version.
- Root problem solved: freeze review snapshots while keeping ongoing reporting uninterrupted.

#### 4.3 Project isolation and archival

- Multiple projects exist in state; archived projects are hidden from active list.
- Root problem solved: isolate reporting cycles by project and avoid cross-project data mixing.

#### 4.4 State model and data source scope

- Current implementation is local mock state only (no backend API).
- Root problem solved at this stage: validate workflow and interaction design before integration complexity.

### 5) Final One-Sentence Problem Frame

This system is a single-page reporting workspace that solves controlled cross-department collaboration under role and version constraints by unifying structured report editing, image evidence management, and assistant-style analysis in one operational surface.

### 6) Known Analysis Guardrails (to avoid over-interpretation)

- Do not treat `report`, `image`, and `chat` as independent route pages; they are in-page workflows.
- Do not treat chat as production AI decision engine; current implementation is mock simulation.
- Do not infer separate business intent between `/` and `/report-workspace`; they map to the same component.
