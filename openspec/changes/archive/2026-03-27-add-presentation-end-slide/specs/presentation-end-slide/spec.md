## ADDED Requirements

### Requirement: Presentation includes a terminal end slide after the last content slide

The system SHALL enter a presentation-only end slide after the last content slide instead of stopping on the final content slide.

#### Scenario: Advance beyond the last content slide

- **WHEN** a presenter activates next navigation while viewing the last content slide
- **THEN** the system transitions to a presentation-only end slide

### Requirement: End slide copy is managed through presentation settings

The system SHALL manage end-slide copy through presentation settings and SHALL support a title, subtitle, and optional supporting text.

#### Scenario: Configure end-slide copy

- **WHEN** an administrator updates end-slide text in presentation settings
- **THEN** the presentation-only end slide renders the saved title, subtitle, and optional supporting text

### Requirement: End slide is not part of version page data

The system SHALL keep the end slide outside version page data and SHALL NOT expose it through workspace page management.

#### Scenario: View workspace page management after end slide is configured

- **WHEN** an administrator reviews version pages in workspace page management
- **THEN** the end slide does not appear as a report page or image page entry
