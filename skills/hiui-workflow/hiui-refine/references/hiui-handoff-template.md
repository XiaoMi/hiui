# HiUI 交接包模板

当细化后的需求要传递给 `hiui-page-workflow`，用于 React / HiUI 页面生成、工程验收、截图、UX 走查或正式验收时，使用本模板。

## Table of Contents

- [交接字段](#交接字段)
- [字段粒度要求](#字段粒度要求)
- [交接完成度与门禁状态](#交接完成度与门禁状态)
- [选择规则](#选择规则)

## 交接字段

```json
{
  "productName": "产品名称",
  "targetPlatform": "HiUI React admin",
  "workflowLevelSuggestion": "quick-preview | standard-e2e | formal-e2e",
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
      "hiuiPageType": "table-basic | table-stat | tree-table | tree-split | drawer-form | drawer-detail | full-page-edit | full-page-detail | data-visualization | feedback-status | non-typical | unresolved",
      "priority": "P0 | P1 | P2",
      "promptId": "PR01",
      "linkedScenarioIds": ["S01"],
      "linkedFeatureIds": ["F01"],
      "linkedRuleIds": ["R01"],
      "linkedDataIds": ["D01"],
      "surfaceSummary": "一句话说明本页看什么、改什么、完成什么",
      "statesToDesign": ["default", "empty", "loading", "error", "permission-limited", "success"],
      "primaryActions": ["查询", "新建", "编辑"],
      "secondaryActions": ["导出", "刷新"],
      "queryControls": [
        {
          "key": "dateRange",
          "label": "日期范围",
          "component": "DateRangePicker",
          "required": false,
          "defaultValue": "近7天",
          "rules": ["开始时间不得晚于结束时间"]
        }
      ],
      "metricFields": [
        {
          "key": "gmv",
          "label": "营业额",
          "definition": "支付成功订单金额汇总",
          "format": "currency"
        }
      ],
      "tableColumns": [
        {
          "key": "productName",
          "label": "商品名称",
          "valueType": "text",
          "source": "D01.productName",
          "emptyValue": "--"
        }
      ],
      "rowActions": ["查看详情", "编辑"],
      "batchActions": ["批量导出"],
      "formSections": [
        {
          "sectionName": "基础信息",
          "fields": [
            {
              "key": "storeName",
              "label": "门店名称",
              "component": "Input",
              "required": true,
              "readOnly": false,
              "defaultValue": "",
              "rules": ["长度 2-50 字符"]
            }
          ]
        }
      ],
      "detailSections": [
        {
          "sectionName": "经营概览",
          "fields": ["storeName", "storeStatus", "ownerName"]
        }
      ],
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

## 字段粒度要求

- `pages[].surfaceSummary` 必填，用一句话说明该工作面的职责边界。
- 列表页至少补齐 `queryControls`、`tableColumns`，有指标区时补 `metricFields`，有行级或批量动作时补 `rowActions`、`batchActions`。
- 表单页至少补齐 `formSections`，每个字段说明 `component`、`required`、`readOnly`、`defaultValue` 和 `rules`。
- 详情页至少补齐 `detailSections`，必要时配合 `metricFields` 或状态字段表达摘要信息。
- 不适用的数组可留空，但不得只给页名和动作，不提供字段/列/筛选结构。

## 交接完成度与门禁状态

- 若 handoff 仍只有页名、路由、页型、`surfaceSummary` 和动作，而缺少页型对应的字段结构，应视为 `draft generation-pack`，只能继续确认或作为评审草稿。
- 若 P0 关键页面都已满足本模板的字段粒度要求，可视为 `consumable generation-pack`，允许进入生成输入确认。
- `generationInputGate.status = ready-for-review` 的前提：
  - P0 关键页面已经具备页型对应的字段结构
  - B2B / 管理后台需求中的高影响对象粒度、权限、异常、审计缺口已补齐，或已被明确标注并获授权
  - handoff 不再依赖抽象模块名来承载关键规则
- 若用户明确指出“提示词太抽象”或 handoff 中缺少 `queryControls`、`tableColumns`、`formSections`、`detailSections` 中的必需结构，应回退为 `draft generation-pack`，不得继续停留在 `ready-for-review`。

## 选择规则

- 用户只想要可运行预览时，建议 `quick-preview`。
- 用户要求生成并验证、UX 走查或修复闭环时，建议 `standard-e2e`。
- 用户提到提测、发布、合入、无 warning、source-gate、doctor、finalize-page、完整体验走查或 UX 走查报告时，建议 `formal-e2e`。
- 管理后台页面优先选择典型 HiUI 页型。只有页面结构无法匹配已知模式时才使用 `non-typical`；事实不足时使用 `unresolved`。
- `generationOrder` 优先放 P0 列表、详情、编辑和核心流程页面；报表、高级设置、导入导出和审计页面默认后置，除非 P0 必须包含。
