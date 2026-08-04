import type { LegacyPageSpec } from './types'

export const drawerDetailSpec: LegacyPageSpec = {
  "pageType": "drawer-detail",
  "shell": "ProDetailDrawer",
  "regions": [
    "drawer-shell",
    "drawer-header",
    "drawer-body",
    "detail-body",
    "drawer-footer"
  ],
  "regionOrder": [
    "drawer-shell",
    "drawer-header",
    "drawer-body",
    "detail-body",
    "drawer-footer"
  ],
  "ownership": {
    "drawer-shell": "typical-page-shell",
    "drawer-header": "typical-page-shell",
    "drawer-body": "typical-page-shell",
    "detail-body": "managed-component",
    "drawer-footer": "typical-page-shell"
  },
  "editableSlots": [
    "pageTitle",
    "detailFields",
    "footerActions",
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
      "maxItems": 16
    },
    {
      "slotId": "footerActions",
      "label": "底部操作",
      "contentType": "footer-actions",
      "allowedChanges": [
        "buttonText",
        "buttonState",
        "handlers"
      ],
      "forbiddenChanges": [
        "footer-geometry",
        "sticky-owner"
      ],
      "owner": "typed-action-slot",
      "maxItems": 3
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
    "drawer-shell": "Drawer",
    "drawer-header": "DrawerHeader",
    "drawer-body": "DrawerBody",
    "detail-body": "Descriptions",
    "drawer-footer": "DrawerFooter"
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
