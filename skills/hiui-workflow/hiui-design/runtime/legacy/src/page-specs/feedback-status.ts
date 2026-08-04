import type { LegacyPageSpec } from './types'

export const feedbackStatusSpec: LegacyPageSpec = {
  "pageType": "feedback-status",
  "shell": "FeedbackStatePanel",
  "regions": [
    "shell",
    "header",
    "white-body",
    "feedback-panel",
    "main-scroll"
  ],
  "regionOrder": [
    "header",
    "white-body",
    "feedback-panel"
  ],
  "ownership": {
    "shell": "typical-page-shell",
    "header": "typical-page-shell",
    "white-body": "typical-page-shell",
    "feedback-panel": "managed-component",
    "main-scroll": "typical-page-shell"
  },
  "editableSlots": [
    "pageTitle",
    "headerExtra",
    "statusTitle",
    "statusDescription",
    "primaryAction",
    "secondaryAction"
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
      "slotId": "statusTitle",
      "label": "状态标题",
      "contentType": "plain-text",
      "allowedChanges": [
        "copy"
      ],
      "forbiddenChanges": [
        "feedback-carrier"
      ],
      "owner": "typed-content-slot"
    },
    {
      "slotId": "statusDescription",
      "label": "状态说明",
      "contentType": "rich-copy",
      "allowedChanges": [
        "copy",
        "links"
      ],
      "forbiddenChanges": [
        "feedback-carrier"
      ],
      "owner": "typed-content-slot"
    },
    {
      "slotId": "primaryAction",
      "label": "主操作",
      "contentType": "button-action",
      "allowedChanges": [
        "buttonText",
        "handler"
      ],
      "forbiddenChanges": [
        "feedback-carrier"
      ],
      "owner": "typed-action-slot"
    },
    {
      "slotId": "secondaryAction",
      "label": "次操作",
      "contentType": "button-action",
      "allowedChanges": [
        "buttonText",
        "handler"
      ],
      "forbiddenChanges": [
        "feedback-carrier"
      ],
      "owner": "typed-action-slot"
    }
  ],
  "componentSources": {
    "shell": "HiUI typical page shell",
    "header": "PageHeader",
    "white-body": "WhiteBody",
    "feedback-panel": "FeedbackStatePanel",
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
