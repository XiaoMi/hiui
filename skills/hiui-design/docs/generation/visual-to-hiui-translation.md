# Visual to HiUI Translation

本文是不规范原型截图、旧系统截图 / URL / 源码转译为 HiUI 规范页时的 pre-plan facts 规则。它只定义 `visual-translation-brief.v1` 的事实提取边界；不定义页面执行计划、contract、preflight 或最终回复。

## 适用输入

- 不规范原型截图。
- 老旧系统截图。
- 可访问的旧页面 URL。
- 旧页面源码路径。

命中上述输入时，首轮使用 `docs/generation/ai-kickoff-template.md` 的 `kickoffType=pre-plan-facts`；普通文字页面需求仍先执行 `plan-page-task`。

## 协议边界

`visual-translation-brief.v1` 是 pre-plan input facts：

- 记录源材料观察。
- 提取业务对象、主目标、字段、操作、状态。
- 说明保留业务语义、丢弃旧视觉 / 旧布局。
- 给出页型候选与证据。
- 产出进入 `PlanTask` 前需要补齐的 `prePlanBlockingFacts`。

它不是 PRD、交互设计、页面计划、runtime contract 或最终报告。

## MVP 顶层字段白名单

只允许以下顶层字段：

- `schemaVersion`
- `status`
- `statusReasons`
- `source`
- `observation`
- `extractedFacts`
- `normalization`
- `pageTypeCandidates`
- `prePlanBlockingFacts`
- `blockingIssues`
- `blockingReasons`
- `planningHints`

字段变更必须同步更新 schema、fixture、validator 与 consumer 说明。

## 禁止字段

以下字段不得出现在任意层级；validator 必须递归扫描：

- `requiredDocs`
- `requiredActions`
- `requiredCommands`
- `formalAcceptanceActions`
- `startFrom`
- `modeOverride`
- `finalPageType`
- `targetPage`
- `contractRegions`
- `ownership`
- `routeConfig`
- `componentStrategy`
- `acceptanceProfile`
- `finalReportContract`
- `api`
- `permissionMatrix`
- `flowSteps`
- `implementationPlan`

`targetPage` 不属于 visual brief 核心字段；只能以 `prePlanBlockingFacts` 表达“PlanTask 前缺目标路径”。

## 防膨胀规则

- `planningHints.constraints` 最多 3 条。
- `pageTypeCandidates` 最多 3 个。
- `normalization.hiuiRecommendations` 最多 3 条，且只写规范化方向，不写实现方案。
- `pageTypeCandidates` 只是候选证据，不是最终页型。
- 需要完整 PRD、权限矩阵、接口设计或复杂流程时，转入需求澄清流程，不塞进 brief。

## artifact ref

MVP ref 格式：

- `file:<workspace-relative-path>`
- `url:<http-or-https-url>`
- `browser-screenshot:<absolute-or-workspace-path>`
- `user-upload:<stable-id>`
- `code:<workspace-relative-path>#L<line>`

Phase 1 优先支持 `file:`；`user-upload:` / `browser-screenshot:` 只有当前运行环境可解析时才允许 `status=ready`。

解析接口：

```text
resolve-artifact-ref(ref) -> {
  available: boolean,
  resolvedPath?: string,
  url?: string,
  checkedAt: string,
  error?: string
}
```

处理规则：

- ref 格式合法但当前不可访问：`status=blocked`。
- ref 格式非法：`status=invalid`。
- 关键 artifact 不可访问：按来源是否可补充，进入 `blocked` 或 `invalid`。

## 状态语义

- `ready`：协议合法，核心业务事实充分，可进入下一阶段。
- `blocked`：协议合法但事实不足，例如业务对象、主目标、关键 artifact 或 PlanTask 必需事实缺失。
- `invalid`：schema 非法、artifact ref 非法、关键 artifact 来源冲突或禁止字段出现。

## 示例骨架

```json
{
  "schemaVersion": "visual-translation-brief.v1",
  "status": "blocked",
  "statusReasons": ["PlanTask requires target page path"],
  "source": {
    "type": "legacy-page-screenshot",
    "artifacts": [
      {
        "kind": "image",
        "refType": "file",
        "ref": "file:screenshots/order-list.png",
        "resolvedPath": "screenshots/order-list.png",
        "available": true,
        "checkedAt": "2026-06-17T10:00:00+08:00"
      }
    ]
  },
  "observation": {
    "visibleRegions": ["filter", "toolbar", "table", "pagination"],
    "visibleTexts": ["订单号", "查询", "导出"],
    "visibleInteractions": ["query", "export", "row-detail"]
  },
  "extractedFacts": {
    "businessObject": {"value": "订单", "confidence": "high", "evidence": ["visibleTexts: 订单号"]},
    "primaryGoal": {"value": "查询和管理订单", "confidence": "high", "evidence": ["filter + table + pagination"]}
  },
  "normalization": {
    "preserve": ["可见查询字段", "可见表格字段"],
    "discard": ["旧系统视觉样式", "非 HiUI 间距"],
    "hiuiRecommendations": ["建议收敛为查询区 + 操作栏 + 标准表格 + 分页"]
  },
  "pageTypeCandidates": [
    {"pageType": "table-basic", "confidence": "high", "evidence": ["存在筛选区", "存在表格", "存在分页"]}
  ],
  "prePlanBlockingFacts": [
    {"field": "targetPage", "owner": "PlanTask", "reason": "PlanTask cannot bind route target", "blocking": true}
  ],
  "blockingIssues": [],
  "blockingReasons": ["请确认目标页面路径"],
  "planningHints": {
    "intentSummary": "将旧系统订单列表转译为规范 HiUI 页面",
    "constraints": ["保留可见业务字段", "不继承旧视觉样式"],
    "evidenceRefs": ["observation.visibleRegions", "pageTypeCandidates[0]"]
  }
}
```
