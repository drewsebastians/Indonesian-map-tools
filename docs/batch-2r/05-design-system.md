# Batch 2R Prompt 5 — Design system

Status: implemented for the public shell and established as the shared token foundation for later workspace work.

## Source of truth

`assets/css/design-system.css` owns named tokens for typography, spacing, layout, radii, borders, surfaces, text, actions, semantic states, map states, elevation, motion, responsive behavior, and safe-area insets. It has no external font dependency: the system sans-serif stack is deliberately fast and reliable. Numerical tables may use `--font-mono` or `font-variant-numeric: tabular-nums` when Prompt 6 creates the new table treatment.

The public shell uses deep navy text, restrained teal actions, white and cool-neutral surfaces, and a separate map palette. The primary action is `#086d73` with white text (5.50:1); the focus ring is `#1769aa` on white (5.61:1). Semantic success, warning, danger, and info states have independent named tokens and must include text or an icon/shape, not color alone.

## Governance

- New visual values belong in the token file before a component uses them.
- One filled primary action is allowed per public page or active workflow step; quiet, text, and danger variants communicate other actions.
- Touch controls use a 44 px minimum target where practical.
- Motion is brief and respects `prefers-reduced-motion`.
- The legacy workspace stylesheet remains a compatibility surface until Prompt 6. New public components must not copy its one-off values; Prompt 6 will migrate the workspace to the approved component contracts.

## Performance budgets

The public-shell verifier enforces gzip limits of 18 KB for public CSS, 4 KB for its JavaScript, and 6 KB for homepage HTML. It also fails if the homepage source refers to map, geometry, XLSX, or spreadsheet runtime assets.
