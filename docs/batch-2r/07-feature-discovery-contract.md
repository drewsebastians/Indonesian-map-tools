# Batch 2R Prompt 7 — Feature discovery contract

## Rule

Show no more than one feature recommendation, and only after a successful export. It is a small inline completion panel, never a blocking modal or a data-transfer action.

## Current recommendations

| Completed workflow | Recommendation | Availability | Behaviour |
| --- | --- | --- | --- |
| Highlight regions | “Have a region list? Create your next map from a spreadsheet.” | Active Batch 2 workflow | Switches the temporary workspace goal to spreadsheet input; existing work remains intact. |
| Map spreadsheet data | “Need to group these regions? Build sales territories is coming soon.” | Future Batch 3 workflow | Clearly announces that it is upcoming. It does not navigate, create a project, or pass data. |

The completion panel always keeps Save project and another export format visibly primary. A user may dismiss the recommendation. It must not reappear as an interruption during the same completion state.

## Safety and privacy

- No recommendation sends spreadsheet data, project content, or identifiers to a service.
- No telemetry, analytics event, or network request is created by discovery.
- The shell does not mutate imported rows, matching corrections, highlights, or export metadata.
- A future workflow is never described as available until its runtime and handoff contract are implemented.

## Testable constraints

The guidance test verifies a maximum of one recommendation, an honest upcoming label for Sales territories, retained spreadsheet context, and no non-local requests. Product tests must keep these properties if completion copy or routes change.
