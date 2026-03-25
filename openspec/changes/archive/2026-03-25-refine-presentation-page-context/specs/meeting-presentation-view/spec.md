## MODIFIED Requirements

### Requirement: Footer remains fixed with minimal context fields

The system SHALL keep a fixed footer in meeting presentation mode and SHALL display only the current slide index over the total slide count in `current/total` format.

#### Scenario: Show current slide index in fixed footer

- **WHEN** the presenter is viewing slide 2 of a 13-slide meeting deck
- **THEN** the footer shows `2/13`

### Requirement: Footer excludes page count and clock

The system SHALL NOT display page title, page type, current clock time, version text, or lock status in the footer, and SHALL use the footer only for slide index over total count.

#### Scenario: Inspect footer content while viewing a slide

- **WHEN** the presenter is viewing any slide in report playback mode
- **THEN** the footer excludes page title, page type, current time, version text, and lock status while keeping only `current/total` page count
