## MODIFIED Requirements

### Requirement: Presentation includes a terminal end slide after the last content slide

The system SHALL enter a presentation-only end slide after the last content slide instead of stopping on the final content slide, and the rendered ending screen SHALL use `src/assets/images/End.jpg` as the background image for the end-slide hero surface.

#### Scenario: Advance beyond the last content slide

- **WHEN** a presenter activates next navigation while viewing the last content slide
- **THEN** the system transitions to a presentation-only end slide

#### Scenario: Render the designated ending background image

- **WHEN** the presentation enters the terminal end slide state
- **THEN** the ending screen uses `src/assets/images/End.jpg` as the background image for the end-slide hero surface

### Requirement: End slide copy is managed through presentation settings

The system SHALL manage end-slide copy through presentation settings, SHALL support a title, subtitle, and optional supporting text, and SHALL render that copy inside a cover-like 16:9 hero composition so the ending screen keeps a presentation opening/closing rhythm consistent with the cover surface.

#### Scenario: Configure end-slide copy

- **WHEN** an administrator updates end-slide text in presentation settings
- **THEN** the presentation-only end slide renders the saved title, subtitle, and optional supporting text

#### Scenario: Render end slide with cover-like hero proportion

- **WHEN** the presentation-only end slide is displayed
- **THEN** its main visual surface uses a cover-like 16:9 hero proportion rather than a short content card proportion

#### Scenario: Keep end-slide copy readable over the designated background

- **WHEN** the presentation-only end slide renders title, subtitle, and optional supporting text on top of `src/assets/images/End.jpg`
- **THEN** the copy remains readable without introducing unrelated report-page footer metadata or report-slide background changes
