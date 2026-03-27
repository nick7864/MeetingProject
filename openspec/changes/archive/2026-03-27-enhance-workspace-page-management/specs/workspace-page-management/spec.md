## ADDED Requirements

### Requirement: Workspace pages can be deleted with custom confirmation

The system SHALL allow an editable workspace version to delete a page only after the user confirms the action in a custom confirmation modal, and the system SHALL NOT use native browser alert or confirm dialogs for this workflow.

#### Scenario: Confirm page deletion from custom modal

- **WHEN** an admin triggers page deletion in an editable version
- **THEN** the system opens a custom confirmation modal showing the target page name and requires explicit confirmation before deleting the page

#### Scenario: Cancel page deletion from custom modal

- **WHEN** the user closes or cancels the page deletion confirmation modal
- **THEN** the target page remains unchanged and no deletion is applied

### Requirement: Workspace page deletion preserves a valid version state

The system SHALL preserve at least one page in every workspace version, SHALL select a neighboring page when the active page is deleted, and SHALL renumber page order values after deletion.

#### Scenario: Delete the active page from a multi-page version

- **WHEN** the active page is deleted from a version that still has other pages
- **THEN** the system removes the target page, switches the active page to a neighboring page, and reindexes the remaining page order values

#### Scenario: Attempt to delete the last remaining page

- **WHEN** an admin attempts to delete the only remaining page in a version
- **THEN** the system blocks the deletion and keeps the version with its single page intact

### Requirement: Workspace pages can be reordered within editable versions

The system SHALL allow page order changes through explicit move-up and move-down controls for both report pages and image pages in editable versions.

#### Scenario: Move a middle page upward

- **WHEN** an admin activates the move-up control for a page that is not already first
- **THEN** the system swaps its position with the previous page and updates the displayed order

#### Scenario: Move a middle page downward

- **WHEN** an admin activates the move-down control for a page that is not already last
- **THEN** the system swaps its position with the next page and updates the displayed order

### Requirement: Locked versions disable page management actions

The system SHALL disable page deletion and page reordering controls when the active workspace version is not editable.

#### Scenario: View page management in a locked version

- **WHEN** the active version is locked and not within an editable overtime window
- **THEN** the system disables page deletion and page reordering actions
