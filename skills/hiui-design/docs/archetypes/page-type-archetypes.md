# Page-type Archetypes

Current packaged archetypes:

- `table-basic`
  regions: `header`, `white-body`, `query-filter`, `table`, `pagination`
  invariant: one list workspace, no extra white-body nesting
- `tree-table`
  regions: `header`, `white-body`, `query-filter`, `table`, `pagination`
  invariant: tree stays inside the table shell, not as a split workspace
- `tree-split`
  regions: `header`, `split-workspace`, `left-tree`, `right-list`, `query-filter`, `table`, `pagination`
  invariant: left tree and right list stay inside one split workspace
- `drawer-form`
  regions: `header`, `drawer-body`, `form-body`, `drawer-footer`
  invariant: body and footer stay inside one drawer shell
- `drawer-detail`
  regions: `header`, `drawer-body`, `detail-body`, `drawer-footer`
  invariant: detail body and footer stay inside one drawer shell
- `full-page-detail`
  regions: `header`, `white-body`, `detail-body`
  invariant: one detail workspace, not a custom grid rebuilt from primitives
- `feedback-status`
  regions: `header`, `white-body`, `feedback-panel`
  invariant: feedback content owns one panel workspace, not a borrowed list/form shell
- `data-visualization`
  regions: `header`, `white-body`, `stat-section`, `query-filter`, `chart-section`, `table`, `pagination`
  invariant: charts and detail table stay in one analytics workspace

- `full-page-edit`
  regions: `header`, `white-body`, `form-body`, `footer`
  invariant: header, form scroll body, and sticky footer stay in one shell
- `table-stat`
  regions: `header`, `white-body`, `stat-section`, `query-filter`, `table`, `pagination`
  invariant: stats, filter, table, and pagination stay in one white-body
