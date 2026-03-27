## MODIFIED Requirements

### Requirement: Manual sign-in mode for first release

The first release SHALL support self sign-in operated through authenticated identity confirmation instead of manual name and department entry.

#### Scenario: Register self attendance record from authenticated identity

- **WHEN** an authenticated attendee opens normal sign-in and confirms the action
- **THEN** the system stores the attendance record for the target session using the attendee's system-provided member identity, name, and department

## ADDED Requirements

### Requirement: Self sign-in blocks when authenticated identity is incomplete

The system SHALL block normal self sign-in when the authenticated meeting context does not provide a unique member identity, member name, and department.

#### Scenario: Missing identity context during self sign-in

- **WHEN** an attendee opens normal sign-in but the system cannot resolve the required authenticated identity fields
- **THEN** the system blocks sign-in submission and shows guidance that identity information is unavailable

### Requirement: Management sign-in modes preserve target selection and audit inputs

The system SHALL keep proxy sign-in, correction, and backfill workflows separate from normal self sign-in and SHALL require the target record or target attendee plus required reason fields for those management actions.

#### Scenario: Proxy sign-in still requires explicit target and audit reason

- **WHEN** an operator performs proxy sign-in for another attendee
- **THEN** the system requires the operator to identify the target attendee and provide the proxy audit inputs before creating the record

#### Scenario: Correction or backfill does not reuse self sign-in identity confirmation flow

- **WHEN** an operator opens correction or backfill flow after sign-in has started or closed
- **THEN** the system presents the workflow-specific target selection and reason inputs instead of the normal self sign-in identity confirmation view
