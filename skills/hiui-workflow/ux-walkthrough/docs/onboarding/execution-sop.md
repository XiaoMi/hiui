# Execution SOP

This file exists as a compatibility bridge for workflows that still reference
the old `docs/onboarding/execution-sop.md` path.

The current open-source `ux-walkthrough` execution contract is defined by:

- [`SKILL.md`](../../SKILL.md)
- [`gates.md`](./gates.md)
- [`references/mode.md`](../../references/mode.md)

## Execution Order

1. Run `precheck_walkthrough.py` to determine mode, evidence gate, and runtime probe results.
2. After precheck allows continuation, follow the A -> B -> C stages in `SKILL.md`.
3. Generate `report.json`, then run `validate_checklist_coverage.py`.
4. Run `validate_report_annotations.py` when the source mode requires annotated evidence.
5. Only after the required validation gates pass, run `generate_docx.py`.

## Formal UX Closure

When `hiui-page-workflow` enters `ux-formal`, "full SOP" means:

- follow the complete three-stage flow in `SKILL.md`
- satisfy the gates in `docs/onboarding/gates.md`
- produce both the final report and the local `.docx`

If this compatibility document conflicts with `SKILL.md`, `SKILL.md` wins.
