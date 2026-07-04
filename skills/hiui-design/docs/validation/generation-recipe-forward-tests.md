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

## Success Metrics

Track these metrics through regression runs and sampled forward tests:

1. First-pass `preflight` success rate improves.
2. Average rework rounds for the same page category decrease.
3. First-turn outputs more consistently expose `generationRecipe`, `assemblyOrder`,
   and `requiredAssets`.
4. Required `generationRecipe` fields are populated for high-frequency page types.

## Anti-Regression Rule

When defects are repeatedly discovered during delivery confirmation, maintainers
should first evaluate whether the issue belongs in:

- `generationRecipe`
- generation gates

Do not keep expanding delivery-only descriptions as the permanent workaround for a
missing generation rule.
