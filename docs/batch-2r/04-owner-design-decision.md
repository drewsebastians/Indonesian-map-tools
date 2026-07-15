# Batch 2R Prompt 4B — Owner Design Decision

Status: approved by the owner.

## Decision

- Selected prototype: **Option A — Guided Rail**.
- Desktop workspace: Option A's stable left workflow rail and dominant map canvas.
- Mobile workspace: Option C's map-first sheet model, including collapsed, medium, expanded, and dedicated data-sheet states.
- Palette: Option A direction (deep navy, restrained teal, light neutral surfaces, cool borders, and accessible blue focus treatment).
- Error handling: retain Option B's calm, actionable error presentation and focused issues treatment.
- Density and rejected patterns: no additional owner constraints were specified; keep the selected option's spacious density and continue to avoid the rejected patterns documented in the design principles.

## Required changes before production implementation

1. Keep a **USEFUL STARTING POINTS** section (templates/sample starting points) in the approved public experience, using the useful content treatment demonstrated by Option C.
2. Keep the highlighted-region cross-workflow suggestion: “Have a value for each region? Map spreadsheet data links rows to regions and builds the legend for you. **Switch to spreadsheet workflow →**” The final production copy must preserve the meaning and clear action, with normal link styling rather than markdown emphasis in rendered UI.

## Evidence reviewed

The selected prototype and all three isolated routes exist under `design-preview/batch-2r/`. Prompt 4 evidence passes: `artifacts/batch-2r/prototype-review.json` records 24 state checks, 39 axe runs with zero violations, 45 overflow checks, and 18 screenshots; `artifacts/batch-2r/prototype-isolation.json` passes its isolation checks. The prototype browser suite also passed. No production workspace layout was changed.

## Implementation sequence for Prompts 5–7

1. **Prompt 5 — approved shell and workflow UX:** implement the Option A desktop shell and goal-led navigation, the linked table/data drawer, Basic/Advanced separation, unmatched-row resolution, and the retained Useful Starting Points and spreadsheet cross-link. Use Option C's mobile sheet behavior and Option B's error/focus treatment. Keep existing engines and project contracts intact.
2. **Prompt 6 — visualization:** add the deterministic classification and legend presentation inside the approved shell. Keep map-data palettes separate from interface-action colors; preserve no-data, accessibility, and table/legend agreement.
3. **Prompt 7 — export and persistence:** implement the shared export specification, success state, safe metadata, project persistence, and mobile export flow. Verify that export and reopen behavior preserve the approved visual direction without introducing a permanent third column.

Production implementation remains subject to the existing regression, accessibility, performance, privacy, and license gates. This record authorizes the direction, not a remote rename or custom-domain activation.

## Verification metadata

- Verified commit: `e5fa19b` (`batch2r: add experience research and design prototypes`)
- Approved at: 2026-07-15 (Asia/Jakarta)
- Next status: ready for Batch 2R Prompt 5.
