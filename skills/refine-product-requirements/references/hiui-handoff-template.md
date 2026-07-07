# HiUI 交接包模板

当细化后的需求要传递给 `hiui-page-workflow`，用于 React / HiUI 页面生成、工程验收、截图、UX 走查或正式验收时，使用本模板。

## 交接字段

```json
{
  "productName": "产品名称",
  "targetPlatform": "HiUI React admin",
  "workflowLevelSuggestion": "quick-preview | standard-e2e | formal-e2e",
  "requirementGate": {
    "status": "needs-confirmation | requirements-confirmed | assumption-authorized | blocked",
    "resolvedQuestions": [
      "首版范围仅覆盖列表和详情"
    ],
    "remainingHighImpactQuestions": [
      "真实审批流是否进入 P0 待确认"
    ],
    "assumptions": [
      "首版按单角色运营管理员生成"
    ]
  },
  "generationInputGate": {
    "status": "not-ready | ready-for-review | confirmed | assumption-authorized | blocked",
    "confirmedPageIds": ["P01"],
    "confirmedPromptIds": ["PR01"],
    "confirmedSummary": "已确认先生成供应商列表页"
  },
  "globalContextRef": "全局生成上下文所在章节或文件",
  "sharedConstraints": [
    "组件库/设计系统约束",
    "统一命名、权限、状态、反馈规则"
  ],
  "pages": [
    {
      "pageId": "P01",
      "pageName": "页面名称",
      "route": "/example",
      "surfaceType": "page | modal | drawer | step-flow | tab | detail-panel | config-panel | embedded-work-surface",
      "hiuiPageType": "table-basic | table-stat | tree-table | tree-split | drawer-form | drawer-detail | full-page-edit | full-page-detail | data-visualization | feedback | non-typical | unresolved",
      "priority": "P0 | P1 | P2",
      "promptId": "PR01",
      "linkedScenarioIds": ["S01"],
      "linkedFeatureIds": ["F01"],
      "linkedRuleIds": ["R01"],
      "linkedDataIds": ["D01"],
      "statesToDesign": ["default", "empty", "loading", "error", "permission-limited", "success"],
      "primaryActions": ["查询", "新建", "编辑"],
      "acceptanceCriteria": [
        "P0 操作路径完整可走通"
      ],
      "dataAssumptions": [
        "接口暂按 mock 数据生成"
      ],
      "permissionAssumptions": [
        "管理员可新增/编辑，普通成员只读"
      ]
    }
  ],
  "generationOrder": ["P01", "P02"],
  "knownRisks": [
    "真实权限规则待确认",
    "接口字段待后端确认"
  ],
  "openQuestions": [
    "是否需要导入/导出能力进入 P0"
  ]
}
```

## 选择规则

- 用户只想要可运行预览时，建议 `quick-preview`。
- 用户要求生成并验证、UX 走查或修复闭环时，建议 `standard-e2e`。
- 用户提到提测、发布、合入、无 warning、source-gate、doctor、finalize-page、完整体验走查或 UX 走查报告时，建议 `formal-e2e`。
- `requirementGate.status=needs-confirmation` 或 `generationInputGate.status=not-ready|ready-for-review` 时，只允许作为待确认交接包流转，不能直接进入页面生成。
- 只有 `generationInputGate.status=confirmed|assumption-authorized`，下游 workflow 才能进入页面规划 / 文件修改。
- 管理后台页面优先选择典型 HiUI 页型。只有页面结构无法匹配已知模式时才使用 `non-typical`；事实不足时使用 `unresolved`。
- `generationOrder` 优先放 P0 列表、详情、编辑和核心流程页面；报表、高级设置、导入导出和审计页面默认后置，除非 P0 必须包含。
