# Layout + Search + Table Adapter

Use this adapter only when it can preserve a single white-body workspace.

It is acceptable for `table-stat` only if:

- stats, filter, table, and pagination are still part of one workspace
- stats are rendered as a visible card section, not downgraded to tabs or plain count text
- the host footer is semantically the pagination region of that workspace
- there is no second white-body nested around the table
