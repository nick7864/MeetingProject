## ADDED Requirements

### Requirement: Report slides use card-section full-content layout

For report pages in meeting presentation, the system SHALL render all six report fields for the current department on a single slide using a card-section layout with subtle dividers, preserved whitespace, and full content readability without converting the page into a continuous scroll view.

#### Scenario: Open a report slide for one department page

- **WHEN** the presentation opens a report page slide for a department
- **THEN** the slide shows work item, weekly status and risk, planned build date, approval date, support plan, and executive discussion in fixed content sections on the same slide

## MODIFIED Requirements

### Requirement: Continuous department-first scroll presentation

The system SHALL render meeting presentation as a department-first slide deck, and within each department section it SHALL preserve original page order as discrete slides rather than a continuous scroll surface.

#### Scenario: Present project progress in meeting flow by department

- **WHEN** the presentation page loads a project version
- **THEN** the page builds slides in configured department order and, within each department, keeps the original page order for slide playback

### Requirement: Department tab navigation uses in-page smooth scroll

The system SHALL provide slide navigation that uses previous/next controls, keyboard left/right arrow shortcuts for sequential playback, and a hidden drawer for direct slide jumping, and SHALL NOT use in-page smooth scroll between department sections as the primary presentation interaction.

#### Scenario: Jump to another slide from presentation navigation

- **WHEN** a presenter uses previous/next controls or opens the hidden slide drawer to select a target slide
- **THEN** the presentation replaces the current slide with the target slide without scrolling within a continuous page

#### Scenario: Navigate slides with keyboard arrow shortcuts

- **WHEN** the presentation is in report playback mode and the presenter presses the Left or Right arrow key
- **THEN** the current slide moves to the previous or next slide when such a target exists

### Requirement: Presentation toolbar supports meeting controls

The presentation toolbar SHALL include project/version/lock status, previous/next slide controls, hidden slide-drawer access, fullscreen toggle, and font-size toggle after report playback begins.

#### Scenario: Show required controls in presentation toolbar

- **WHEN** the presentation page is visible in normal mode
- **THEN** the toolbar displays lock-aware meeting context and the required control groups for sequential slide playback and direct slide jumping

### Requirement: Fullscreen mode auto-hides toolbar

In fullscreen mode, the system SHALL auto-hide the presentation toolbar, SHALL reveal it when mouse movement reaches the presentation interaction area, and SHALL hide the application header and left navigation chrome while fullscreen is active.

#### Scenario: Reveal hidden toolbar in fullscreen after mouse movement

- **WHEN** fullscreen mode is active and the presenter moves the mouse into the reveal area
- **THEN** the toolbar becomes visible for interaction and returns to auto-hidden state after inactivity

#### Scenario: Hide application chrome during fullscreen presentation

- **WHEN** the presenter enters fullscreen mode from the presentation page
- **THEN** the application header and left sidebar are hidden until fullscreen mode ends

### Requirement: Presentation respects selected version snapshot

The system SHALL keep displayed content stable to the currently loaded snapshot during the meeting session, including during overtime editing windows, until the session is reloaded or version context is intentionally changed by defined workflow.

#### Scenario: Keep meeting content stable while overtime edits occur

- **WHEN** overtime editing is granted for the locked version while a meeting session is already presenting that version
- **THEN** the visible slide content remains bound to the previously loaded snapshot until the presenter explicitly reloads or re-enters the presentation
