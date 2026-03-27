## ADDED Requirements

### Requirement: Meeting presentation navigation reaches a managed ending state

The system SHALL let presentation navigation reach a managed ending state after the final content slide and SHALL keep toolbar and keyboard behavior consistent with that ending state.

#### Scenario: Use next button on the final content slide

- **WHEN** a presenter clicks the next button while viewing the final content slide
- **THEN** the presentation enters the managed ending state instead of remaining stuck on the final content slide

#### Scenario: Use right arrow key on the final content slide

- **WHEN** a presenter presses the right arrow key while viewing the final content slide
- **THEN** the presentation enters the managed ending state instead of remaining stuck on the final content slide

### MODIFIED Requirements

### Requirement: Dedicated meeting presentation route

The system SHALL provide a dedicated meeting presentation route that renders report content in read-only mode, SHALL NOT expose editing controls, and SHALL include presentation-only flow states such as cover and ending screens that are managed outside version page data.

#### Scenario: Open presentation mode from navigation

- **WHEN** a user navigates to the presentation route
- **THEN** the system shows meeting-oriented content layout without edit buttons, input fields, or management actions and can navigate through presentation-only cover or ending flow states without mutating version pages
