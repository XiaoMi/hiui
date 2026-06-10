# Host-integration Drawer Detail Archetype

Mount the packaged drawer-detail shell directly.

## I18n Defaults

- visible copy, field labels, placeholders, empty/error text, chart titles, and CTA labels must go through the project i18n runtime or the hiui-design translation bridge.
- locale-sensitive date, number, currency, percent, and sorting output must use locale-aware formatters instead of handwritten concatenation.
- RTL locales must keep logical properties and overlay alignment intact; size regions for de-DE, th-TH, and ar-SA text expansion before locking widths.
