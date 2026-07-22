# Host Integration Checklist

Use `src/CHECKLIST.md` as the source-of-truth acceptance checklist for the synced host integration example.

Before generating real business pages, first make sure the downstream project can render at least one synced baseline page and complete:

- `pnpm typical-page:verify -- --page <page-dir>`
- `pnpm typical-page:verify:visual -- --page <page-type>` when the page is high value or has obvious visual risk
