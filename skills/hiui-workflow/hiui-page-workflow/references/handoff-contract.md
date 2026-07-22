# Handoff Contract

阶段之间用本契约交接事实。字段可以为空，但不要伪造；不确定的内容写入 `knownRisks` 或 `openQuestions`。

## Contents

- [`合同 JSON 结构`](#handoff-contract)
- [`使用规则`](#使用规则)
- [`字段分层`](#字段分层)

```json
{
  "projectRoot": "目标项目路径",
  "pagePath": "页面源码路径",
  "route": "页面访问路由",
  "pageType": "table-basic | table-stat | tree-table | tree-split | drawer-form | drawer-detail | full-page-edit | full-page-detail | data-visualization | feedback | non-typical | unresolved",
  "taskLevel": "minor-edit | managed-page-change | new-page-or-rearchitecture",
  "workflowLevel": "quick-preview | standard-e2e | formal-e2e",
  "devServerUrl": "http://localhost:xxxx/xxx",
  "requirementGate": {
    "status": "needs-confirmation | requirements-confirmed | assumption-authorized | blocked",
    "selectedOptions": [
      "1A",
      "2B"
    ],
    "resolvedQuestions": [
      "已确认首版只覆盖列表和详情"
    ],
    "remainingHighImpactQuestions": [
      "真实审批流是否进入首版待确认"
    ],
    "assumptions": [
      "首版按运营管理员单角色生成"
    ]
  },
  "generationInputGate": {
    "status": "not-ready | ready-for-review | confirmed | assumption-authorized | blocked",
    "confirmedPageIds": [
      "P01"
    ],
    "confirmedPromptIds": [
      "PR01"
    ],
    "assumptionsAllowed": false,
    "confirmedSummary": "用户已确认首版生成供应商列表和供应商详情"
  },
  "planSnapshot": {
    "sourceSkill": "hiui-design",
    "planStatus": "ready | blocked | invalid | missing",
    "factsStatus": "ready | blocked | missing | conflict | stale | unknown",
    "canStartImplementation": false,
    "currentExecutionState": {
      "status": "ready | blocked | unknown",
      "primaryAction": "generate-by-page-component-slot-fill | ResolveBlockingFacts | unknown",
      "currentPhase": "ResolveBlockingFacts | SelectStartPoint | GenerateOrEdit | WriteContract | Preflight | FormalAcceptance | RuntimeGovernance | UsageStats | unknown",
      "nextCommand": "下一条结构化动作命令",
      "blockerCodes": [
        "PROJECT_INTEGRATION_BLOCKED"
      ]
    },
    "requiredActions": [
      {
        "command": "typical-page:start-page",
        "phase": "GenerateOrEdit",
        "status": "pending | passed | failed | skipped | blocked"
      }
    ],
    "formalAcceptanceActions": [
      {
        "command": "typical-page:finalize-page",
        "phase": "FormalAcceptance",
        "status": "pending | passed | failed | skipped | blocked"
      }
    ],
    "deliverySummaryProfile": "planner delivery summary profile",
    "acceptanceProfile": {
      "formalRequired": false
    }
  },
  "requirementRefinement": {
    "sourceSkill": "hiui-refine",
    "deliveryMode": "quick-refine | hiui-handoff | full-prd-to-generation",
    "productName": "产品名称",
    "mvpScope": "MVP 范围摘要",
    "selectedOptions": [
      "1A",
      "2B"
    ],
    "scenarioIds": ["S01"],
    "pageIds": ["P01"],
    "promptIds": ["PR01"],
    "hiuiHandoffReady": true,
    "assumptions": [
      "接口暂按 mock 数据生成"
    ],
    "openQuestions": [
      "真实权限规则待确认"
    ]
  },
  "engineeringChecks": [
    {
      "command": "npm run ...",
      "status": "passed | failed | skipped | blocked",
      "note": "说明"
    }
  ],
  "screenshots": [
    {
      "path": "截图路径",
      "viewport": "desktop | mobile",
      "stage": "before-fix | after-fix | final | other",
      "purpose": "UX evidence | visual comparison | final proof",
      "state": "页面状态说明，例如默认列表、筛选后、抽屉打开",
      "fullPage": true
    }
  ],
  "uxGate": {
    "mode": "ux-smoke | ux-standard | ux-formal",
    "source": "code | url | screenshot",
    "evidenceStatus": "not-ready | ready | insufficient | blocked",
    "scenarioCoverageRequired": true,
    "docxRequired": false,
    "precheckExecuted": false
  },
  "p0ScenarioCoverage": [
    {
      "scenarioId": "S01",
      "scenarioName": "运营人员审核供应商申请",
      "entryVisible": "passed | failed | unknown",
      "mainPathCompletable": "passed | failed | unknown",
      "criticalDataVisible": "passed | failed | unknown",
      "permissionStateHandled": "passed | failed | unknown",
      "loadingEmptyErrorStatesHandled": "passed | failed | unknown",
      "dangerousActionProtected": "passed | failed | unknown",
      "feedbackAndRecoveryHandled": "passed | failed | unknown",
      "relatedIssues": [
        "UX-001"
      ]
    }
  ],
  "visualComparisons": [
    {
      "beforePath": "修复前截图路径",
      "afterPath": "修复后截图路径",
      "viewport": "desktop | mobile",
      "state": "对比对应的页面状态",
      "issueIds": ["UX-001"],
      "summary": "本次修复前后的可见变化"
    }
  ],
  "knownRisks": [
    "未验证登录态",
    "接口为 mock",
    "缺少真实权限场景"
  ]
}
```

## 使用规则

- `route` 或 `devServerUrl` 不确定时，先从项目路由和 dev server 输出确认。
- `requirementGate` 用来判断产品方向是否清楚；用户回答过问题不等于 `generationInputGate` 已确认。
- `generationInputGate.status` 只有 `confirmed` 或 `assumption-authorized` 时，才允许进入页面规划和文件修改。
- 若已执行 `hiui-design` 页面规划，`planSnapshot` 应保留最小 planner 快照；不要手工重造 `mode`、`pageType`、`startFrom` 或执行许可结论。
- 进入文件修改前，若存在 `planSnapshot`，必须同时满足 `planStatus=ready`、`factsStatus=ready`、`currentExecutionState.status=ready`、`canStartImplementation=true`。
- `planSnapshot.requiredActions` 与 `planSnapshot.formalAcceptanceActions` 只记录当前 workflow 真正消费的结构化动作及其结果；不要把未执行动作写成已通过。
- `planSnapshot.sourceSkill`、`requirementRefinement.sourceSkill` 等 `sourceSkill` 字段只记录公开调度身份，例如 `hiui-design`、`hiui-refine`；不要写内部脚本名、目录名或 references 文件名。
- workflow 允许依赖的下游结构化面只有本契约字段、planner 的最小公开字段以及 `requiredActions` / `formalAcceptanceActions`；不要从内部文档名或脚本路径推断调度路径。
- `assumption-authorized` 只能来自用户明确授权；不能把“生成 / 继续 / 开始吧 / 端到端”自动当作授权。
- 若执行过需求细化，`requirementRefinement` 必须记录真实的交付模式、关键假设和待确认项；没有执行需求细化时可省略。
- `hiuiHandoffReady` 为 false 时，不要假装需求已完备；若用户仍要求继续生成，必须把假设和风险带入 `knownRisks`。
- 页面停留在登录页时，不要默认把登录页当作目标页面走查。
- `engineeringChecks` 必须反映真实执行结果；未执行就写 `skipped` 并说明原因。
- `screenshots` 只登记真实存在的截图或标注图路径。
- `uxGate.evidenceStatus` 不是 `ready` 时，不要输出确定性 UX 完整报告，只能记录待补充证据、待交互验证或无法判断。
- `ux-standard` 和 `ux-formal` 必须填 `p0ScenarioCoverage`；若最终只发现 P2 问题，必须说明 P0/P1 核心路径已覆盖且未发现问题的依据。
- 进入 UX 修复前，应先登记 `stage: before-fix` 的基线截图；修复后应登记同路由、同视口、尽量同数据状态的 `stage: after-fix` 截图。
- 有实际修复时，`visualComparisons` 至少登记一组 before / after；无法形成对比时，写入 `knownRisks` 并说明原因。
- 报告里可以使用缩略图，但 `path`、`beforePath`、`afterPath` 必须指向可查看的清晰原图。
- `knownRisks` 用来约束 UX 判断，避免把证据不足的问题硬判为确定问题。

## 字段分层

- 必填：`workflowLevel`、`requirementGate`、`generationInputGate`、`engineeringChecks`、`knownRisks`。
- 完成页面规划后建议必填：`planSnapshot`。
- 进入 UX 后必填：`uxGate`、`screenshots`；`ux-standard` / `ux-formal` 还必须填 `p0ScenarioCoverage`。
- 有修复时必填：`visualComparisons`，并保留 before / after 清晰原图路径。
