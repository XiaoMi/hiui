import type { LegacyPageSpec } from './types'

export const fullPageDetailSpec: LegacyPageSpec = {
  "pageType": "full-page-detail",
  "shell": "ProDetailPage",
  "regions": [
    "shell",
    "header",
    "white-body",
    "detail-body",
    "main-scroll"
  ],
  "regionOrder": [
    "header",
    "white-body",
    "detail-body"
  ],
  "ownership": {
    "shell": "typical-page-shell",
    "header": "typical-page-shell",
    "white-body": "typical-page-shell",
    "detail-body": "managed-component",
    "main-scroll": "typical-page-shell"
  },
  "editableSlots": [
    "pageTitle",
    "headerExtra",
    "detailFields",
    "supportingSections",
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
        "header-carrier",
        "page-header-geometry",
        "page-header-portal",
        "page-header-padding",
        "page-header-align-items",
        "hi-v5-page-header-skeleton"
      ],
      "owner": "typed-action-slot",
      "maxItems": 3
    },
    {
      "slotId": "detailFields",
      "label": "详情字段",
      "contentType": "description-schema",
      "allowedChanges": [
        "fieldLabels",
        "valueFormatter",
        "grouping"
      ],
      "forbiddenChanges": [
        "detail-carrier",
        "label-width-defaults"
      ],
      "owner": "typed-structure-slot",
      "maxItems": 48
    },
    {
      "slotId": "supportingSections",
      "label": "辅助内容区",
      "contentType": "managed-section-schema",
      "allowedChanges": [
        "sectionTitle",
        "fieldGroups",
        "charts"
      ],
      "forbiddenChanges": [
        "white-body-owner",
        "main-scroll-owner"
      ],
      "owner": "typed-structure-slot",
      "maxItems": 6
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
    "detail-body": "Descriptions",
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
