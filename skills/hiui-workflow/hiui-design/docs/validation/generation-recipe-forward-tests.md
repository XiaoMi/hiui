# Generation Recipe Forward Tests

## Purpose

This document defines the forward-test set and success metrics used to validate the
generation-recipe upgrade.

## Forward-Test Scenarios

### 1. Typical Page

- prompt shape: add a standard data table page
- expected path: `page-component`
- expected first-turn fields:
  - `generationStrategy`
  - `generationRecipe`
  - `assemblyOrder`
  - `requiredAssets`
  - `generationInputs.docBundle.profile = minimal-doc-fast-path`
  - `generationInputs.fastPathSummary.queryFilterPolicy = managed-query-filter`
  - `generationInputs.fastPathSummary.pageShellPolicy` is a managed carrier policy instead of free-form shell authoring

### 2. Managed Analytics

- prompt shape: add a business dashboard with trends, composition, and detail analysis
- expected path: `managed-analytics`
- expected first-turn fields:
  - `generationRecipe.startingPoint = managed-mold`
  - `generationRecipe.assemblyOrder[0] = chartUsageContract`
  - `generationRecipe.requiredAssets` includes `chartUsageContract`

### 3. Legacy Host Compatible

- prompt shape: add a standard business table page in `legacy-host-compatible`
- expected path: `page-component` when runtime adapter proof is ready
- blocked expectation: if runtime adapter proof is missing, generation still stays on
  the `page-component` strategy and does not fall back to blank-page authoring
- expected scaffold guidance when ready:
  - `typical-page:start-page` emits runtime-bridge wrapper + slot adapter
  - generated bridge comments explicitly prohibit translating `QueryFilter` / `Table` / `Pagination` / `PageHeader`

### 4. Table Scaffold Guidance

- prompt shape: start a `table-basic` or `table-stat` managed page from the planner-selected fast path
- expected scaffold guidance:
  - `query-filter` placeholder text explicitly says to mount the real `QueryFilter` carrier
  - the scaffold must not tell the implementer to mount a dashboard control strip for a normal table page
  - `table` placeholder text keeps pagination inside the same managed shell / carrier chain

## Success Metrics

Track these metrics through regression runs and sampled forward tests:

1. First-pass `preflight` success rate improves.
2. Average rework rounds for the same page category decrease.
3. First-turn outputs more consistently expose `generationRecipe`, `assemblyOrder`,
   and `requiredAssets`.
4. Required `generationRecipe` fields are populated for high-frequency page types.
5. Table-page scaffolds no longer require manual reinterpretation of `QueryFilter` or shell ownership before implementation starts.
6. Legacy bridge scaffolds stay thin and no longer drift into component translation language.

## Anti-Regression Rule

When defects are repeatedly discovered during delivery confirmation, maintainers
should first evaluate whether the issue belongs in:

- `generationRecipe`
- generation gates

Do not keep expanding delivery-only descriptions as the permanent workaround for a
missing generation rule.

If a list-page defect is “fixed” by adding CSS around `QueryFilter` / `Table` / `pagination`,
first prove it is not a `HIUI026_QUERY_FILTER_ROLE_DRIFT` or
`HIUI027_TABLE_CARRIER_WRAPPER_DRIFT` problem. Those defects belong in planner / scaffold /
carrier generation guidance first, not in late delivery patches.
