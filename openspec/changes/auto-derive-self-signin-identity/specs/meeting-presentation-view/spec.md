## MODIFIED Requirements

### Requirement: Cover includes attendee sign-in call-to-action

The cover SHALL include a clear attendee sign-in call-to-action that integrates with attendance workflows and SHALL open the authenticated self sign-in confirmation flow for normal attendee sign-in.

#### Scenario: View cover before report starts

- **WHEN** cover is displayed before report body start
- **THEN** attendees can discover and trigger sign-in from cover without navigating to admin tabs

#### Scenario: Open normal sign-in from cover

- **WHEN** an authenticated attendee triggers normal sign-in from the cover
- **THEN** the dialog shows a read-only identity confirmation flow instead of manual department and name input fields

## ADDED Requirements

### Requirement: Cover sign-in dialog distinguishes self and management workflows

The presentation sign-in dialog SHALL present a simplified self sign-in flow for authenticated attendees and SHALL present workflow-specific inputs for proxy sign-in, correction, and backfill actions.

#### Scenario: Authenticated attendee opens self sign-in dialog

- **WHEN** the dialog opens in normal self sign-in mode
- **THEN** the attendee sees identity confirmation content and the minimum actions needed to confirm sign-in

#### Scenario: Operator switches to management workflow in sign-in dialog

- **WHEN** the dialog is opened for proxy sign-in, correction, or backfill
- **THEN** the dialog renders the workflow-specific target and audit inputs required by that management action
