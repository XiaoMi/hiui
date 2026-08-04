# Generation Recipe Forward Tests

## Legacy Host Compatible

- prompt shape: add a standard business table page in `legacy-host-compatible`
- expected path: `legacy-lightweight-contract`
- expected command boundary: project-level `typical-page:apply:legacy` (internally runs `typical-page:legacy:init`) + page-level `typical-page:light-plan` + `typical-page:legacy:new|rewrite --plan`
- expected scaffold guidance when ready:
  - page directory contains `page.instance.tsx`, `page.slots.ts`, and optional `page.request.ts`
  - generated comments preserve host contract, typical page contract, DOM region, ownership, slot schema, and visual token proof
  - no `src/page-components` carrier, wrapper, or adapter files are generated

## Success Metrics

- First-pass `preflight` success rate improves because generation starts from contract-owned DOM region, ownership, slot schema, and visual token facts.
- Page generation remains lightweight because legacy mode does not create page-component carrier files.
- Anti-regression guard: any reintroduction of old carrier wrapper, adapter, or matrix assets must fail keyword scans and structure tests.
- Average rework rounds should decrease because generator input already encodes DOM regions, ownership, slot schema, and visual tokens before code is written.
- `generationRecipe` must keep lightweight legacy startingPoint, requiredAssets, forbiddenMoves, and inlineChecks aligned with host contract and typical page contract facts.
- Do not keep expanding delivery-only descriptions; generation facts must stay in `generationRecipe` and contract assets, not prose-only fallback notes.
