# Ownership Semantics

The following roles must have one owner only:

- `content-slot`
- `white-body`
- `outer-padding`
- `main-scroll`

If both the host slot and the page surface claim the same responsibility, the translation is structurally invalid.
