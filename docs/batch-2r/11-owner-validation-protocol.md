# NusaCanvas owner validation protocol

Status: **not yet run.** This is a practical owner review, not an implementation inspection.

## Open these URLs

- Desktop: `http://127.0.0.1:4173/`
- Desktop workspace: `http://127.0.0.1:4173/workspace/`
- Phone: open the same local address through a phone-accessible local development setup, or use the browser's 393 × 851 device view.

Do not use the future custom domain. The target workers.dev address is not live-verified yet; if it is deployed later, run this same protocol there as a separate staging check.

## Setup

- Use a current desktop browser and one narrow phone or device view.
- Keep browser developer tools closed.
- Use the supplied sample or a non-sensitive test spreadsheet. Do not share real spreadsheet data with anyone during review.
- Record observations in the fields below; do not inspect code or test implementation.

## Tasks and expected outcomes

| Task | Do this | Expected outcome | Notes: confusion / wrong turn / visual feedback / severity |
| --- | --- | --- | --- |
| Find a goal | From the homepage, find **Highlight regions** and **Map spreadsheet data**. | Both active goals are clear; **Build sales territories** and **Analyze coverage** are visibly upcoming. | |
| Manual map | Highlight and color two regions, then export SVG. | The map stays prominent; the export is clear; the page suggests spreadsheet mapping only as a relevant next step. | |
| Spreadsheet map | Paste the two-column sample, preview it, apply it, and resolve one ambiguous row. | Data is described as staying in the browser; matching tells you what needs attention without losing input. | |
| Design and drawer | Change a map design option and use the data drawer/filter. | Map, table, and legend remain understandable and linked. | |
| Export and save | Export SVG, PNG, PDF, and mapping CSV; then use **Save project** and reopen the project. | Each format is clear, export success is visible, and the reopened project retains the same work. | |
| Recovery | With incomplete spreadsheet input, try to go to design. | The error says what happened, that work is safe, and what to do next. | |
| Phone | Use collapsed, medium, and expanded controls; open the table; return to the map. | No horizontal page scroll; the primary next action is reachable without covering map controls. | |
| Keyboard | On desktop, use Tab/Enter to reach input, matching, drawer, export, and completion controls. | Visible focus is not hidden; status messages make sense without color alone. | |
| Boundary appearance | Review national, Java/Jakarta, Bali/Nusa Tenggara, Maluku/Papua, and high-DPI screenshots. | Borders look consistent, internal seams do not look doubled, and selected areas stay distinct. | |

Severity: **P0** prevents safe use or causes loss; **P1** blocks a core task; **P2** is confusing or materially rough; **P3** is minor polish.

## Prototype-versus-production review

Compare the implemented application with the approved direction, not with a literal pixel copy:

- Desktop: Option A's compact guided rail and dominant map.
- Mobile: Option C's map-first sheet behavior.
- Errors: Option B's explicit, non-destructive recovery treatment.
- Retained requirements: **Useful starting points** and the manual-highlight spreadsheet handoff.

What should be retained? ________________________________________________

What should change? _____________________________________________________

Rejected pattern observed? ______________________________________________

## Approval record

- [ ] I reviewed desktop tasks.
- [ ] I reviewed phone/mobile tasks.
- [ ] I reviewed boundary appearance and export success.
- [ ] I found no unresolved P0/P1 issue.
- [ ] I approve this production experience for Batch 3 resumption.

Reviewer: ____________________  Date: ____________________

Decision / follow-up: ___________________________________________________

After approval, create the owner approval artifact described in `docs/batch-2r/11-batch-3-resumption-checklist.md`. Do not mark this protocol as performed merely because automated tests passed.
