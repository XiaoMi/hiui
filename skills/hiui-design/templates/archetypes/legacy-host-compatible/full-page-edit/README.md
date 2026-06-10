# Legacy Full-page Edit Adapter

Use this adapter when the target project cannot import `@hiui-design/typical-page-shells` directly.

Required behavior:

- keep one header region with leading back
- keep one white-body workspace
- keep one scroll owner for the form body
- keep one sticky footer region inside the page shell
- bind the translated shell to `page-header-form-footer-adapter`
- start from `examples/host-integration/src/pages/full-page-edit.tsx` and keep its shell chain intact
- keep the source contract comment aligned to the chosen host archetype path

Do not translate this page into `Card + Form + footer`.

Required source evidence:

- `/* hiui-design host-adapter: page-header-form-footer-adapter */`
- `/* hiui-design host-archetype: <host-archetype-path> */`
- `/* hiui-design example: examples/host-integration/src/pages/full-page-edit.tsx */`
- `data-hiui5-example="examples/host-integration/src/pages/full-page-edit.tsx"`
- `data-hiui5-host-adapter="page-header-form-footer-adapter"`

If these markers are missing, the page is treated as a primitive rebuild instead of a copied example-based page.

## I18n Defaults

- visible copy, field labels, placeholders, empty/error text, chart titles, and CTA labels must go through the project i18n runtime or the hiui-design translation bridge.
- locale-sensitive date, number, currency, percent, and sorting output must use locale-aware formatters instead of handwritten concatenation.
- RTL locales must keep logical properties and overlay alignment intact; size regions for de-DE, th-TH, and ar-SA text expansion before locking widths.
