import type { LegacyPageSpec } from './types'

export const tableBasicSpec: LegacyPageSpec = {
  "pageType": "table-basic",
  "shell": "TablePageFrame",
  "regions": [
    "shell",
    "header",
    "white-body",
    "query-filter",
    "table",
    "pagination",
    "main-scroll"
  ],
  "regionOrder": [
    "header",
    "white-body",
    "query-filter",
    "table",
    "pagination"
  ],
  "ownership": {
    "shell": "typical-page-shell",
    "header": "typical-page-shell",
    "white-body": "typical-page-shell",
    "query-filter": "managed-component",
    "table": "managed-component",
    "pagination": "managed-component",
    "main-scroll": "typical-page-shell"
  },
  "editableSlots": [
    "pageTitle",
    "headerExtra",
    "queryFields",
    "tableColumns",
    "rowActions",
    "cellEditRules",
    "mockData",
    "apiBinding"
  ],
  "slotManifest": [
    {
      "slotId": "pageTitle",
      "label": "页面标题",
      "contentType": "plain-text",
      "allowedChanges": [
        "copy",
        "onBack"
      ],
      "forbiddenChanges": [
        "shell",
        "header-geometry",
        "header-carrier",
        "page-header-portal",
        "page-header-padding",
        "page-header-align-items",
        "hi-v5-page-header-skeleton"
      ],
      "owner": "typed-content-slot"
    },
    {
      "slotId": "headerExtra",
      "label": "页头右侧操作/信息",
      "contentType": "actions-or-summary",
      "allowedChanges": [
        "buttons",
        "statusText",
        "timeRange",
        "primaryAction"
      ],
      "forbiddenChanges": [
        "page-header-geometry",
        "header-carrier",
        "page-header-portal",
        "page-header-padding",
        "page-header-align-items",
        "hi-v5-page-header-skeleton"
      ],
      "owner": "typed-action-slot",
      "maxItems": 3
    },
    {
      "slotId": "queryFields",
      "label": "筛选字段",
      "contentType": "filter-controls",
      "allowedChanges": [
        "fieldLabels",
        "fieldTypes",
        "options",
        "defaultValues"
      ],
      "forbiddenChanges": [
        "query-filter-carrier",
        "filter-grid-geometry"
      ],
      "owner": "typed-structure-slot",
      "maxItems": 6
    },
    {
      "slotId": "tableColumns",
      "label": "表格列",
      "contentType": "table-column-schema",
      "allowedChanges": [
        "columnTitle",
        "dataIndex",
        "width",
        "render",
        "sorter"
      ],
      "forbiddenChanges": [
        "table-carrier",
        "pagination-owner",
        "table-viewport-wrapper",
        "local-horizontal-scroll-owner",
        "table-shell-padding",
        "content-width-sizing",
        "slot-root-geometry"
      ],
      "owner": "typed-structure-slot",
      "maxItems": 12
    },
    {
      "slotId": "rowActions",
      "label": "行操作",
      "contentType": "table-row-actions",
      "allowedChanges": [
        "actionText",
        "visibility",
        "handlers"
      ],
      "forbiddenChanges": [
        "table-carrier",
        "table-viewport-wrapper",
        "local-horizontal-scroll-owner",
        "table-shell-padding",
        "slot-root-geometry"
      ],
      "owner": "typed-action-slot",
      "maxItems": 4
    },
    {
      "slotId": "cellEditRules",
      "label": "单元格编辑规则",
      "contentType": "inline-cell-editing",
      "allowedChanges": [
        "editorType",
        "options",
        "validation",
        "saveTrigger"
      ],
      "forbiddenChanges": [
        "table-carrier",
        "row-height-owner",
        "table-viewport-wrapper",
        "local-horizontal-scroll-owner",
        "table-shell-padding",
        "content-width-sizing",
        "slot-root-geometry"
      ],
      "owner": "business-rule-slot"
    },
    {
      "slotId": "mockData",
      "label": "示例数据",
      "contentType": "mock-records",
      "allowedChanges": [
        "records",
        "emptyState"
      ],
      "forbiddenChanges": [
        "layout"
      ],
      "owner": "business-data-slot",
      "maxItems": 20
    },
    {
      "slotId": "apiBinding",
      "label": "接口绑定",
      "contentType": "request-mapping",
      "allowedChanges": [
        "queryParams",
        "responseMapping",
        "submitHandlers"
      ],
      "forbiddenChanges": [
        "layout"
      ],
      "owner": "host-adapter-slot"
    }
  ],
  "componentSources": {
    "shell": "HiUI typical page shell",
    "header": "PageHeader",
    "white-body": "WhiteBody",
    "query-filter": "QueryFilter",
    "table": "Table",
    "pagination": "Pagination",
    "main-scroll": "MainScroll"
  },
  "visualTokens": {
    "scope": "data-hiui-page-root",
    "tokenSource": "src/hiui-runtime/styles.css",
    "forbidPageLocalOverrides": [
      "font-size",
      "line-height",
      "padding",
      "margin",
      "border-radius",
      "box-shadow",
      "background",
      "color"
    ]
  }
}
