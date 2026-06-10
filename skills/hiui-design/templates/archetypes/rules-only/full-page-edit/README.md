# Rules-only Full-page Edit Adapter

Lock the packaged example first, then bind it to one host archetype.

Use this adapter contract when the project keeps its own layout system but is not forced onto a legacy runtime.

## I18n Defaults

- visible copy, field labels, placeholders, empty/error text, chart titles, and CTA labels must go through the project i18n runtime or the hiui-design translation bridge.
- locale-sensitive date, number, currency, percent, and sorting output must use locale-aware formatters instead of handwritten concatenation.
- RTL locales must keep logical properties and overlay alignment intact; size regions for de-DE, th-TH, and ar-SA text expansion before locking widths.
