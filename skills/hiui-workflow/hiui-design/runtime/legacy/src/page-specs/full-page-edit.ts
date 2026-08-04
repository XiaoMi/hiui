import type { LegacyPageSpec } from './types'

export const fullPageEditSpec: LegacyPageSpec = {
  "pageType": "full-page-edit",
  "shell": "ProEditPage",
  "regions": [
    "shell",
    "header",
    "form-body",
    "footer",
    "main-scroll"
  ],
  "regionOrder": [
    "header",
    "form-body",
    "footer"
  ],
  "ownership": {
    "shell": "typical-page-shell",
    "header": "typical-page-shell",
    "form-body": "managed-component",
    "footer": "typical-page-shell",
    "main-scroll": "typical-page-shell"
  },
  "editableSlots": [
    "pageTitle",
    "headerExtra",
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
      "maxItems": 48
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
    "shell": "HiUI typical page shell",
    "header": "PageHeader",
    "form-body": "Form",
    "footer": "FooterActions",
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
