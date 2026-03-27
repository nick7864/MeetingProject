## MODIFIED Requirements

### Requirement: Text content uses configurable summary lines with expansion

The system SHALL truncate long report text to a globally configured summary line count in presentation mode and SHALL provide an expand action to show full text, while keeping a consistent field-heading hierarchy before and after expansion.

#### Scenario: Render long text with default summary

- **WHEN** summary line configuration is set to 4 and a field exceeds 4 lines
- **THEN** the view shows a 4-line summary with an explicit expand control for full content and keeps the same field-heading hierarchy in both summary and expanded states

## ADDED Requirements

### Requirement: Report fields use stronger but balanced heading hierarchy in presentation mode

The presentation view SHALL render report field headings with stronger hierarchy than body content, and SHALL keep the visual treatment balanced enough that field content remains the primary reading focus.

#### Scenario: Render report field heading in presentation mode

- **WHEN** the presentation view renders a report field heading
- **THEN** the heading is visually stronger than body text and remains easy to scan in projection reading conditions

#### Scenario: Preserve content-first balance in presentation mode

- **WHEN** the presentation view renders a report field with heading and content together
- **THEN** the heading improves structural readability without overpowering the body content or disrupting the page harmony

### Requirement: Report field headings use a restrained left-accent visual language

The presentation view SHALL use a restrained left-accent heading treatment for report fields instead of high-emphasis blocks, and SHALL apply that language consistently across the report page.

#### Scenario: Render multiple report fields on the same page

- **WHEN** the presentation view shows several report fields on a report page
- **THEN** each field heading uses the same restrained left-accent language and the page keeps a coherent visual rhythm
