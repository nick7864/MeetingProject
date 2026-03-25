## ADDED Requirements

### Requirement: Project-level one-time lock datetime with timezone

The system SHALL support a project-level one-time `lockAt` datetime configuration (date and time) interpreted in the project timezone.

#### Scenario: Configure one-time lock datetime

- **WHEN** an administrator sets a meeting lock datetime such as `2026-03-25 14:00` for a project
- **THEN** the system stores it as a one-time `lockAt` value bound to that project timezone

### Requirement: Scheduled auto-lock triggers on or after lockAt

The system SHALL automatically execute lock flow when current time is equal to or later than project `lockAt`.

#### Scenario: Auto-lock triggers at configured datetime

- **WHEN** current time is equal to or later than the configured meeting lock time
- **THEN** the system starts auto-lock flow for the latest editable version of that project

### Requirement: Auto-lock targets latest editable version only

The system SHALL evaluate only the latest editable version for auto-lock execution and SHALL NOT re-process already locked historical versions.

#### Scenario: Older locked versions are ignored

- **WHEN** a project has multiple versions and older versions are already locked
- **THEN** auto-lock checks and actions apply only to the latest editable version

### Requirement: Auto-lock uses lock-and-clone behavior

When auto-lock is triggered, the system SHALL lock the latest editable version and SHALL automatically create the next editable version.

#### Scenario: Auto-lock creates next editable version

- **WHEN** auto-lock flow is executed
- **THEN** the target version becomes locked and a new editable successor version is created

### Requirement: Overtime unlock with explicit expiration

The system SHALL allow authorized administrators to grant temporary overtime editing with a required expiration timestamp, and SHALL automatically return to locked state when the overtime window expires.

#### Scenario: Overtime can be granted only by administrator

- **WHEN** a non-admin user attempts to grant overtime editing
- **THEN** the system rejects the action and keeps lock state unchanged

### Requirement: Overtime unlock reason is mandatory

The system SHALL require a non-empty reason when overtime unlock is granted.

#### Scenario: Missing reason blocks overtime grant

- **WHEN** an administrator submits overtime unlock without a reason
- **THEN** the system denies the request and shows validation feedback

### Requirement: Overtime duration uses governed presets

The system SHALL provide overtime duration presets of 5, 10, 15, and 30 minutes, with default selection of 15 minutes.

#### Scenario: Use default overtime duration

- **WHEN** an administrator opens overtime controls without changing duration
- **THEN** the system applies a 15-minute overtime window

### Requirement: Overtime preserves existing role permissions

During overtime unlock, the system SHALL preserve existing role scope: administrators can edit across departments and department users can edit only their own department scope.

#### Scenario: Department user edits during overtime

- **WHEN** overtime is active and a department user edits content
- **THEN** edits are allowed only within that user's department scope

#### Scenario: Overtime edit window ends

- **WHEN** an overtime unlock period reaches its expiration time
- **THEN** the system re-enables lock enforcement and blocks editing again

### Requirement: Overtime expiration relocks immediately

The system SHALL relock immediately at overtime expiration and SHALL NOT provide grace period.

#### Scenario: Editing at exact overtime expiry

- **WHEN** current time reaches overtime expiration while a user is editing
- **THEN** subsequent input is blocked immediately by lock enforcement

### Requirement: Lock and overtime actions are auditable

The system SHALL record lock and overtime control actions with actor identity, action type, timestamp, and reason to support meeting governance traceability.

#### Scenario: Admin grants overtime unlock

- **WHEN** an administrator grants overtime editing for a locked version
- **THEN** the system stores an audit event containing who granted it, when it was granted, when it ends, and why it was granted
