import type { LegacyPageSpec } from './types'

export const drawerFormSpec: LegacyPageSpec = {
  "pageType": "drawer-form",
  "shell": "ProFormDrawer",
  "regions": [
    "drawer-shell",
    "drawer-header",
    "drawer-body",
    "form-body",
    "drawer-footer"
  ],
  "regionOrder": [
    "drawer-shell",
    "drawer-header",
    "drawer-body",
    "form-body",
    "drawer-footer"
  ],
  "ownership": {
    "drawer-shell": "typical-page-shell",
    "drawer-header": "typical-page-shell",
    "drawer-body": "typical-page-shell",
    "form-body": "managed-component",
    "drawer-footer": "typical-page-shell"
  },
  "editableSlots": [
    "pageTitle",
    "formFields",
    "validationRules",
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
      "slotId": "formFields",
      "label": "表单字段",
      "contentType": "form-schema",
      "allowedChanges": [
        "fieldLabels",
        "fieldTypes",
        "validation",
        "initialValues"
      ],
      "forbiddenChanges": [
        "form-carrier",
        "footer-owner"
      ],
      "owner": "typed-structure-slot",
      "maxItems": 16
    },
    {
      "slotId": "validationRules",
      "label": "校验规则",
      "contentType": "validation-schema",
      "allowedChanges": [
        "required",
        "pattern",
        "asyncValidation"
      ],
      "forbiddenChanges": [
        "form-carrier"
      ],
      "owner": "business-rule-slot"
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
    "form-body": "Form",
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
