# Page Contract Stub

- page type: `<page-type-id>`
- example path: `examples/host-integration/src/pages/<example>.tsx`
- host archetype path: `src/views/<host-archetype>.tsx`
- archetype id: `<archetype-id>`
- strict example generation: `true`

## Workflow

- status: `started`
- delivery status: `not-finalized`
- started at: `<iso-timestamp>`
- finalized at: `(empty until finalize-page)`
- preflight status: `not-run`
- source gate status: `not-run`
- doctor status: `not-run`
- runtime smoke status: `not-required`
- runtime smoke snapshot hash: `(empty until runtime-smoke writes a bound result)`
- runtime smoke report path: `(empty until runtime-smoke writes a report)`
- last command: `typical-page:start-page`

## I18n Baseline

- strategy declaration: `required-before-visible-copy`
- reference doc: `docs/generation/i18n-baseline.md`
- runtime policy: `reuse-project-runtime-or-init-hiui-design-bridge`
- baseline provisioning: `auto via setup-for-designers/apply/bootstrap` | `pnpm typical-page:i18n:init (manual resync)` | `npm run typical-page:i18n:init (manual resync)`
- sync command: `pnpm i18n:sync`
- supported locales: `zh-CN, zh-TW, en-US, id-ID, th-TH, de-DE, ar-SA`
- formatter policy: `date, number, currency, percent, collation`
- direction strategy: `rtl-aware-logical-properties`
- text expansion: `zh-CN=1, zh-TW=1, en-US=1.5, id-ID=1.5, th-TH=2, de-DE=2.5, ar-SA=2`

## Region Mapping

- `<region>`: `<host target>`

## Ownership Mapping

- content-slot: `<owner>`
- white-body: `<owner>`
- outer-padding: `<owner>`
- main-scroll: `<owner>`

## Split Pane Contract

- enabled: `false`
- left pane selector: `(empty unless split page explicitly declares it)`
- right pane selector: `(empty unless split page explicitly declares it)`
- table region selector: `(empty unless split page explicitly declares it)`
- left pane scroll: `not-applicable`
- right pane scroll: `not-applicable`

## Semantic Contract

- query-filter region role: `table-query-filter`
- dimension switch control: `not-applicable`
- list shell composition: `page-type-shell`
- spacing ownership: `single-owner`
- area chart fill: `not-applicable`
