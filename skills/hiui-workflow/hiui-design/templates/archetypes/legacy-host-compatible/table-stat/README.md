# Legacy Table-stat Adapter

Use this adapter when the target project stays on the legacy host main tree and the plan selects translated host semantics instead of a direct page-component fast path. `legacy-host-compatible` still allows typical-page components through a project-certified carrier or a runtimeAdapterProof-backed standard component; this adapter is the fallback/translation path, not proof that the mode disables typical-page components.

Required behavior:

- stats, filter, table, and pagination stay inside one white-body
- stat cards fill the available row before wrapping
- pagination remains part of the list workspace

Do not translate this page into a generic list page plus a separate stats block.

## I18n Defaults

- visible copy, field labels, placeholders, empty/error text, chart titles, and CTA labels must go through the project i18n runtime or the hiui-design translation bridge.
- locale-sensitive date, number, currency, percent, and sorting output must use locale-aware formatters instead of handwritten concatenation.
- RTL locales must keep logical properties and overlay alignment intact; size regions for de-DE, th-TH, and ar-SA text expansion before locking widths.
