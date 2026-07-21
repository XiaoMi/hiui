# HiUI Runtime Contract

本文件是 `hiui-design` 运行时协议的唯一真相，定义 `page-task-plan.v1`、`requiredActions`、`preflight-report.v1` 与 acceptance profile 的字段语义。`SKILL.md` 只引用本文件，不复述完整 schema。

## Page Task Plan

页面任务以 `page-task-plan.v1` 为控制入口。计划字段缺失时，优先按兼容层读取旧字段；无法兼容时 fail closed。

建议最小结构：

```json
{
  "schemaVersion": "page-task-plan.v1",
  "status": "ready",
  "mode": {
    "id": "host-integration",
    "source": "mode-lock"
  },
  "taskLevel": {
    "id": "new-page-or-rearchitecture",
    "source": "change-intent"
  },
  "topology": {
    "id": "single-typical-page",
    "source": "page-type"
  },
  "pageType": {
    "id": "table-basic",
    "label": "普通表格",
    "source": "explicit-cli"
  },
  "pageUnits": [],
  "targetPage": {
    "path": "src/pages/order-list/index.tsx",
    "exists": false,
    "pageTypeMigration": false
  },
  "startFrom": {
    "id": "template",
    "source": "archetype",
    "templatePath": "templates/archetypes/rules-only/table-basic/page.template.tsx"
  },
  "fastPath": {
    "eligible": true,
    "entry": "copy-template-or-host-archetype-and-replace-business-slots",
    "reason": "slot-only standard typical page"
  },
  "blockingReasons": [],
  "blockingIssues": [],
  "requiredDocs": [],
  "requiredActions": [
    {
      "id": "start-page",
      "phase": "GenerateOrEdit",
      "tool": "npm-script",
      "command": "typical-page:start-page",
      "args": {
        "--page-type": "table-basic",
        "--page": "src/pages/order-list/index.tsx"
      },
      "required": true,
      "reason": "copy managed template before business slot replacement",
      "produces": [],
      "displayCommand": "typical-page:start-page --page-type table-basic --page src/pages/order-list/index.tsx"
    }
  ],
  "acceptanceLevel": "preview",
  "acceptanceProfile": {
    "level": "preview",
    "formalRequired": false,
    "defaultActions": [],
    "finalReportSections": ["pageStatus", "preflightStatus", "usageStatsStatus"]
  },
  "acceptanceReasons": [],
  "formalAcceptanceActions": [],
  "finalReportContract": {
    "schemaVersion": "final-report-contract.v1",
    "sections": ["pageStatus", "preflightStatus", "usageStatsStatus"],
    "requiredStatusFields": ["pageStatus", "preflightStatus", "usageStatsStatus"]
  }
}
```

`status` 语义：

- `ready`：计划合法，事实完整，可以按计划执行。
- `blocked`：计划合法，但事实不足。只能补 `blockingReasons` 对应事实，不得生成页面、写合同或跑验收。
- `invalid`：计划本身非法，例如 JSON 不合法、`schemaVersion` 不支持、必填字段缺失、字段组合矛盾、`pageType` 不存在或 action 不可解析。停止执行并报告计划非法原因。

核心字段职责：

- `blockingReasons`：强门禁，非空时不得生成或修改页面。
- `blockingIssues`：结构化阻断项，包含 failure code、来源、message、是否可自动修复；优先用于失败恢复。
- `requiredDocs`：默认唯一补读文档来源，不整包扫文档。
- `requiredActions`：默认唯一执行动作来源，AI 不手工拼关键命令链。
- `acceptanceLevel`：`preview | standard | formal`，决定验收范围。
- `acceptanceProfile`：验收范围结构化说明，包含 `level`、`formalRequired`、默认验收动作与最终报告分段。
- `formalAcceptanceActions`：可以始终返回；只有 `acceptanceLevel=formal` 时默认执行。
- `pageType` / `pageUnits` / `startFrom`：由计划给出；缺失表示未解析，不得直接等价为非典型页面。
- `visualizationRolePlan`：仅对 `managed-analytics` 生效，负责冻结主次图角色、主区域偏好，以及 `chartSectionLayoutPlan` 与 `controlStripPlan`。前者至少应回答 `baseGridMode`、`consistencyScope`、`fullSpanNeutral`，并明确 `stat-section` 指标卡与迷你图不参与 `chart-section` 的 grid mode / span 校验；后者至少应回答 `defaultRole`、`defaultControlScope`、`defaultPlacement`、`defaultVisualTreatment`、`detailQueryFilterPolicy`、`mixedScopeControls`，用于区分页面级视角切换与明细 `QueryFilter` 的结构职责。

兼容策略：

- 新增字段：旧 agent 可忽略。
- 删除字段：必须升 `schemaVersion`。
- 字段语义变化：必须升 `schemaVersion` 或提供兼容层。
- 未知 `schemaVersion`：必须 fail closed。
- 旧字段 `requiredCommands` 可作为 `requiredActions` 的兼容输入；旧字段 `formalAcceptanceCommands` 可作为 `formalAcceptanceActions` 的兼容输入。优先使用结构化动作对象。

### Runtime-Bridged Page Component Compatibility

当 legacy 页面通过 runtime bridge 进入 `page-component` 主链路时，允许计划输出一个面向人类更直观的
`generationStrategy.id=runtime-bridged-page-component`，但必须同时满足：

- `generationStrategy.normalizedId` 仍为 `page-component`
- `primaryGenerationAsset.type` 仍为 `page-component`
- `assetResolution.strategy` 仍为 `page-component`
- 下游消费方一律按 `normalizedId` 判定主链路，不得因为用户可读 id 新增而分叉为平行体系

计划可附加 `runtimeBridgeProfile` 作为 additive object，用于说明 legacy 桥接交付语义。推荐结构：

```json
{
  "schemaVersion": "runtime-bridge-profile-ref.v1",
  "profileId": "table-basic.runtime-bridge.v1",
  "normalizedStrategy": "page-component",
  "userFacingStrategy": "runtime-bridged-page-component",
  "deliveryMode": "runtime-component-filled-by-business-slots",
  "runtimeAssetSource": {
    "assetKind": "certified-page-component-shell",
    "certificationRef": "rules/page-component-certifications/standard-table-basic-page.v1.json",
    "componentShellField": "certificationInputs.componentShell"
  },
  "semanticReferencePolicy": {
    "examplePageRole": "semantic-and-structure-reference-only",
    "runtimeComponentRole": "primary-delivery-asset",
    "carrierPolicy": "prefer-project-certified-carrier-before-direct-standard-component"
  },
  "bridgeLayerPolicy": {
    "wrapperRole": "thin-runtime-wrapper",
    "slotAdapterRole": "slot-only-business-adapter",
    "thickness": "runtime-bridge-only"
  }
}
```

约束：

- `runtimeBridgeProfile` 只能补充 legacy `page-component` 的 bridge profile，不得替代
  `pageComponent`、`baseMoldId`、`generationRecipe`、`lockedRegions` 或 `editableSlots`。
- runtime shell 的真实来源必须通过 `runtimeAssetSource.certificationRef +
  componentShellField` 从 certification 解析；禁止在计划中手写猜测 import path。
- bridge wrapper 与 slot adapter 只允许承担 runtime bridge / business slot binding 职责；
  若接管 `shell`、`white-body`、`main-scroll`、`pagination`、`footer` 或把标准 region
  翻译为宿主 look-alike primitives，应视为 contract drift 并 fail closed。
- 若 `generationStrategy.id=runtime-bridged-page-component`，但 `runtimeBridgeProfile` 缺失、
  profile 不可解析或 runtime shell 来源不可解，则计划必须 `blocked`。

## Structured Actions

`requiredActions` 应优先使用动作对象；字符串命令只作为兼容层。

建议动作结构：

```json
{
  "id": "write-contract-standard",
  "phase": "WriteContract",
  "tool": "npm-script",
  "command": "typical-page:write-contract",
  "args": {
    "--page-type": "table-basic",
    "--page": "src/pages/order-list/index.tsx",
    "--mode": "host-integration",
    "--preset": "standard"
  },
  "required": true,
  "reason": "page-type-migration",
  "produces": [
    ".local-context/hiui-design/outputs/page-contracts/src/pages/order-list/index.tsx.json"
  ]
}
```

执行规则：

- `status=ready`：只读 `requiredDocs`，按 `requiredActions` 顺序执行；不要额外拼接 gate。
- `status=blocked`：只补事实，不执行页面修改、合同写入或 preflight。
- `status=invalid`：停止并报告计划非法原因。
- 动作模型保持顺序执行；不要自行引入 DAG、复杂 `when` 表达式或依赖推理。

## Preflight Report

交付前判断优先看 `preflight-report.v1`。preflight 初始目标是高确定性校验，不是泛化智能审查。

建议报告结构：

```json
{
  "schemaVersion": "preflight-report.v1",
  "status": "failed",
  "page": "src/pages/order-list/index.tsx",
  "pageType": "table-basic",
  "generationProfile": {
    "schemaVersion": "generation-profile.v1",
    "moldId": "table-basic.managed-mold.v1",
    "startFrom": "template",
    "slotManifest": [
      { "slotId": "queryFields", "contentType": "filter-controls" },
      { "slotId": "tableColumns", "contentType": "table-column-schema" }
    ],
    "requiredGates": ["slot-gate", "preflight"]
  },
  "productionContract": {
    "schemaVersion": "page-production-contract.v1",
    "policy": "generate-from-managed-mold-and-fill-business-slots-only",
    "moldId": "table-basic.managed-mold.v1",
    "requiredGates": ["slot-gate", "preflight"]
  },
  "checks": [
    {
      "id": "contractPageType",
      "status": "failed",
      "severity": "blocking",
      "message": "source declares table-stat but contract is table-basic",
      "suggestedActionIds": ["write-contract-standard"]
    }
  ],
  "blockingReasons": [],
  "warnings": [],
  "suggestedActions": []
}
```

`status` 语义：

- `passed`：所有阻断校验通过。
- `failed`：至少一个阻断校验失败。
- `invalid`：preflight 输入非法、报告非法或无法判断。

约束：

- 顶层不使用 `warning` 状态；warning 放入 `warnings[]` 或 `checks[].status=warning`。
- `checks[].id` 必须稳定，便于回归测试和自动修复建议。
- `suggestedActionIds` 应能关联 `plan.requiredActions` 或 `report.suggestedActions`。
- `generationProfile` 必须来自 page contract，不允许 preflight 临时推断；缺失、`mode` 不一致、`moldId` / `startFrom` / `requiredGates` / `sourceProofLevel` 缺失时应 fail closed。
- `productionContract` 必须来自 page contract，不允许 preflight 临时推断；缺失、与 `generationProfile` 镜像字段不一致、或 `policy` 不是受管模具槽位生成策略时应 fail closed。
- `productionContract` 类失败必须使用稳定 `checks[].id=productionContract` / `blockingIssues[].code=PRODUCTION_CONTRACT_MISMATCH`；`generationProfile` 类失败必须使用 `checks[].id=generationProfile` / `blockingIssues[].code=GENERATION_PROFILE_MISMATCH`。
- 第一批高确定性校验优先覆盖 `routeOwnership`、`sourceMarker`、`contractPageType`、`regionContract`。
- `scrollOwner`、`paginationMount`、`footerMount`、`shellCarrier`、`ownershipMapping`、`runtimeSmokeMapping` 等复杂校验只有在计划或文档明确要求时追加。

## Governance Report

受管页面治理的详细协议以 `rules/page-governance.md` 为唯一真相；本节只定义运行时交换边界。

`hiui-page-governance-report.v1` 用于汇总 source snapshot、acceptance contract、contract guard、shell guard、adapter guard、query-filter guard、layout guard、runtime smoke status 等机器检查结果。final report 和 CI 必须读取结构化 JSON，不解析自然语言日志。

建议报告结构：

```json
{
  "schemaVersion": "hiui-page-governance-report.v1",
  "status": "failed",
  "profile": "migration",
  "page": "src/pages/order-list/index.tsx",
  "summary": { "blocking": 1, "warning": 0, "info": 0 },
  "checks": [
    {
      "id": "HIUI005_QUERY_FILTER_FIELD_LOST",
      "severity": "blocking",
      "message": "Required inline filters are missing.",
      "evidence": { "expected": ["tradeUpayNo"], "actual": ["engineer"] },
      "provenance": ["sourceSnapshot", "acceptanceContract"],
      "suggestedFix": "Restore inline fields or update acceptance contract with approved migration reason.",
      "exceptionAllowed": false
    }
  ]
}
```

`status` 语义：

- `passed`：当前 profile 下所有 hard gate 通过。
- `failed`：当前 profile 下至少一个 hard gate 失败。
- `invalid`：输入、profile、schema 或报告非法。

Profile 语义：

- `report-only`：blocking 只进入风险报告，不阻断历史页交付。
- `new-managed` / `migration` / `managed` / `release`：blocking 必须阻断完成态；`release` 默认要求 runtime smoke hard fail。

交换边界：

- `pre-migration-snapshot.v1` 和 `page-acceptance-contract.v1` 是迁移 / 重架构页进入实现和最终验收的治理输入；缺失、低置信度或缺 provenance 时 hard profile 必须 fail closed。
- `preflight-report.v1` 继续负责受管 contract / source marker / region / ownership 等交付前校验。
- governance report 不得重新判断 `mode`、`pageType`、`startFrom` 或 `requiredActions`；这些仍由 `page-task-plan.v1` 决定。
- final report 不得把 `preflight failed` 或 hard profile `governance failed` 描述为完成。

## Lifecycle

详细生命周期以 `rules/page-task-lifecycle.md` 为唯一真相；本文件只定义生命周期中交换的运行时协议字段。

## Usage Stats Status

`usageStatsStatus` 是页面交付最终报告与 `preview-ready` 汇总里的标准统计收口字段。它只描述统计链路状态，不改变页面交付本身的 `preflight` / `formalAcceptance` 判断。

允许值：

- `completed`：统计已完成。
- `skipped`：当前执行链路允许跳过或延后统计。
- `requires_authorization`：统计已入队或待补传，需要用户授权网络后重试。
- `failed_retryable`：统计失败但可重试，例如 pending 队列未完全 flush。
- `failed_non_retryable`：统计失败且不建议自动重试，例如参数非法。

映射规则：

- `finalize-usage` 返回 `status=completed` 或 exit code `0` 且 `ok=true` -> `completed`。
- 明确跳过 after-hook -> `skipped`。
- `status=requires_network_authorization` 或 exit code `21` -> `requires_authorization`。
- `status=flush_incomplete` 或 exit code `24` -> `failed_retryable`。
- `ok=false` 或非零 exit code 且不属于上述可授权 / 可重试状态 -> `failed_non_retryable`。

报告规则：

- `usageStatsStatus` 必须作为独立字段呈现，不折叠进 `warnings[]`。
- `requires_authorization`、`failed_retryable`、`failed_non_retryable` 均不默认推翻页面交付。
- 非 `completed` 状态必须给出下一步：申请网络授权、稍后重试、或说明不可重试原因。

## Acceptance Profile

`acceptanceProfile` 是验收范围的结构化主字段；`acceptanceLevel` 是兼容字符串。

最小结构：

```json
{
  "level": "formal",
  "source": "formal-acceptance-overlay",
  "reason": "formal acceptance or strict gate requirement was requested",
  "formalRequired": true,
  "defaultActions": [
    "typical-page:source-gate",
    "typical-page:doctor",
    "typical-page:finalize-page"
  ],
  "finalReportSections": [
    "pageStatus",
    "preflightStatus",
    "formalAcceptanceStatus",
    "usageStatsStatus"
  ]
}
```

规则：

- 只有 `acceptanceProfile.formalRequired=true` 时默认执行 `formalAcceptanceActions[]`。
- `formalAcceptanceActions[]` 不为空但 `formalRequired=false` 时，只作为可升级候选。
- 用户在 preview / standard 后追加正式验收要求时，重新运行或升级 plan，不手工拼 formal 命令。

## Final Report Contract

`finalReportContract.v1` 是最终回复的结构化输出约束，默认由 `page-task-plan.v1.finalReportContract` 给出。它把“该报告哪些状态必须出现、每个状态允许哪些值、哪些证据必须披露”前置到计划阶段，避免最终回复自由发挥。

`final-page-report.v1` 是 `finalReportContract.v1` 的渲染结果，可由 `typical-page:render-final-report` / `scripts/render-final-report.mjs` 生成。页面任务最终回复应以该结构为依据，再转换成人类可读摘要。

最小结构：

```json
{
  "schemaVersion": "final-report-contract.v1",
  "sections": ["pageStatus", "preflightStatus", "usageStatsStatus"],
  "requiredStatusFields": ["pageStatus", "preflightStatus", "usageStatsStatus"],
  "statusFields": {
    "pageStatus": ["not_started", "generated", "modified", "blocked", "failed"],
    "preflightStatus": ["not_run", "passed", "failed", "invalid"],
    "usageStatsStatus": ["completed", "skipped", "requires_authorization", "failed_retryable", "failed_non_retryable"]
  },
  "requiredEvidence": ["executedActions", "changedFiles", "validationCommands"],
  "riskFields": ["blockingIssues", "warnings", "nextActions"],
  "rules": []
}
```

规则：

- `sections` 来自 `acceptanceProfile.finalReportSections`；formal 链路必须包含 `formalAcceptanceStatus`。
- `formalAcceptanceStatus=passed` 只能在 `formalAcceptanceActions[]` 已执行且成功后输出。
- `requiredEvidence` 不允许夸大：未执行的 action / command 不得写入已执行。
- `blockingIssues`、`warnings`、非 `completed` 的 `usageStatsStatus` 必须进入最终回复。

`final-page-report.v1` 最小结构：

```json
{
  "schemaVersion": "final-page-report.v1",
  "contractSchemaVersion": "final-report-contract.v1",
  "sections": ["pageStatus", "preflightStatus", "usageStatsStatus"],
  "statuses": {
    "pageStatus": "modified",
    "preflightStatus": "passed",
    "usageStatsStatus": "completed"
  },
  "preflightExecution": {
    "preflightStage": "implementation",
    "readyForImplementation": true,
    "readyForDelivery": true,
    "deferredChecks": []
  },
  "evidence": {
    "executedActions": [],
    "changedFiles": [],
    "validationCommands": []
  },
  "risks": {
    "blockingIssues": [],
    "warnings": [],
    "nextActions": []
  }
}
```

补充规则：

- `preflightExecution` 是 additive status object，用于把 `preflightStage`、`readyForImplementation`、`readyForDelivery` 与 `deferredChecks` 暴露给最终回复。
- 当 `preflightStatus=passed` 但 `readyForDelivery=false` 时，最终回复必须继续披露 `deferredChecks`，避免把 `scaffold-baseline` 误报成已可交付页面。

## Public Contract Fixtures

公开机器契约由 `scripts/public-cli-contracts.json` 维护，并通过 `scripts/tests/public-cli-contracts.test.mjs` 校验。当前相关 fixture：

- `scripts/tests/fixtures/public-cli/plan-page-task.table-stat.json`
- `scripts/tests/fixtures/public-cli/plan-page-task.table-stat-formal.json`
- `scripts/tests/fixtures/public-cli/preflight.quality-pass.json`
- `scripts/tests/fixtures/public-cli/translation-map.quality-pass.json`
- `scripts/tests/fixtures/public-cli/final-report.quality-pass.json`

## Translation Map

`translation-map.v1` 是 legacy / high-risk 转译场景的轻量可追踪产物，默认写入 `.local-context/hiui-design/outputs/translation-maps/<page>.json`。

最小结构：

```json
{
  "schemaVersion": "translation-map.v1",
  "generatedBy": "typical-page:translation-map",
  "generatedAt": "2026-06-17T00:00:00.000Z",
  "page": "src/pages/orders/index.tsx",
  "pageType": "table-stat",
  "mode": "legacy-host-compatible",
  "reason": "formal-acceptance",
  "sourceHash": "sha256:...",
  "previousSourceHash": "sha256:...",
  "stale": false,
  "staleReason": "",
  "invalidatesWhen": ["page source snapshot changes"],
  "mappings": []
}
```

触发原则：`legacy-host-compatible` 下的高风险页型、页型迁移、`formal` 验收或计划显式列出 `typical-page:translation-map` 时必须生成 / 刷新。preflight 会对高风险 legacy 页检查 translation map 是否存在且 `sourceHash` 匹配当前页面 source snapshot；缺失或过期时输出 `TRANSLATION_MAP_STALE`。

## Runtime Input Facts: host-qualification-facts.v1

`host-qualification-facts.v1` 是 legacy 宿主资格的 runtime input facts contract，不是 page contract、region contract、write-contract 输出或 execution plan。它只能作为 `plan-page-task` 的事实输入和 preflight 的边界校验依据；不得决定 `mode`、`pageType`、`startFrom`、`requiredDocs`、`requiredActions`、`acceptanceProfile` 或 `finalReportContract`。

### 顶层字段白名单

MVP 只允许以下顶层字段：

- `schemaVersion`
- `status`
- `statusReasons`
- `modeLock`
- `runtime`
- `componentQualification`
- `translationMapRefs`
- `preGenerationQualification`
- `postGenerationIsomorphism`
- `unverifiedObservations`
- `blockingIssues`
- `blockingReasons`
- `warnings`
- `automationLevel`
- `freshness`

字段变更必须同一轮更新字段白名单、JSON Schema、ready / blocked / invalid fixtures、本文字段映射表与 consumer 说明；否则视为协议不完整。

### automationLevel 与 ready 门槛

`automationLevel` 只允许：

- `manual-observed`：agent / 人工观察形成，永远不能让 legacy host facts ready。
- `script-derived`：正式 host facts 派生脚本生成。所有 legacy 关键字段 `verified=true` 且 freshness 非 `stale` / `invalid` 后，才允许 `status=ready`。

`tool-derived` 暂不启用。只有工具输出规范、`outputRef`、hash、validator、fixtures 与本文字段映射稳定后，才能作为后续 schema 版本或兼容扩展开放。

legacy 关键字段包括：`modeLock`、`hiuiV5Available`、`allowedComponentSource`、`adapterExists` 或等价组件来源证明、`shellCarrier`、`contentSlotOwner`、`mainScrollOwner`、`footerOwner`、`routeOwnership`，以及高风险页型下的 `preGenerationQualification`。

以下任一情况必须使 host facts `status=blocked`，不得进入 `PlanTask`：

- `automationLevel=manual-observed` 且 legacy 触发；
- 任一 legacy 关键字段 `verified=false`；
- 任一 legacy 关键字段 `confidence=low`；
- 任一 legacy 关键字段缺少 `sourceType`；
- 任一 legacy 关键字段缺少 `sourcePath` / `outputRef`；
- `freshness.status` 为 `stale` 或 `invalid`。

### provenance 标准

关键字段必须使用可复核 provenance：

```json
{
  "value": "local-adapter",
  "sourceType": "doctor-report",
  "sourcePath": ".local-context/hiui-design/outputs/doctor.json",
  "command": "npm run typical-page:doctor -- --json",
  "outputRef": {
    "type": "file",
    "path": ".local-context/hiui-design/outputs/doctor.json",
    "hash": "sha256:...",
    "summary": "legacy-compatible local adapter detected",
    "exitCode": 0
  },
  "observedAt": "2026-06-17T10:00:00+08:00",
  "confidence": "high",
  "verified": true
}
```

有 `command` 时必须有 `outputRef.path` 或 `outputRef.summary`；formal 链路推荐关键 command-derived facts 带 `outputRef.hash`。`user-confirmation` 不能单独证明组件来源、adapter 存在性、mode lock 或 Runtime Contract。

### 字段映射表

| field | allowed sourceType | source family / resolver | required? | missing behavior | consumer |
| --- | --- | --- | --- | --- | --- |
| `modeLock` | `mode-lock` | mode lock resolver | yes | blocked | plan |
| `hiuiV5Available` | `package-json` | package resolver | yes | blocked | plan / preflight |
| `allowedComponentSource` | `doctor-report` / `script-output` | doctor output resolver, `outputRef` required | yes | blocked | plan / preflight |
| `adapterExists` | `file` | adapter / archetype resolver | yes when `hiuiV5Available=false` | blocked | plan |
| `shellCarrier` | `translation-map` | translation map resolver | yes | blocked | plan / preflight |
| `contentSlotOwner` | `translation-map` | translation map resolver | yes | blocked | plan / preflight |
| `mainScrollOwner` | `translation-map` | translation map resolver | yes | blocked | plan / preflight |
| `footerOwner` | `translation-map` | translation map resolver | yes | blocked | plan / preflight |
| `routeOwnership` | `runtime-contract` | runtime contract resolver | yes for existing page | blocked | plan / preflight |
| `postGenerationIsomorphism` | `preflight` / `formal` | post-generation report resolver | no before generation | warning / formal required | formal |

### acceptanceProfile Gate

验收严格度只由 `acceptanceProfile` 控制；`acceptanceLevel` 仅为兼容展示字段。

- `acceptanceProfile.formalRequired=true`：关键 host facts 必须 fresh；command-derived facts 推荐带 `outputRef.hash`；`postGenerationIsomorphism` 必须进入 `formalAcceptanceActions` 或 formal report；缺失时不得写入 passed evidence。
- `acceptanceProfile.formalRequired=false`：freshness unknown 可按计划风险降级为 warning 或 blocked；`postGenerationIsomorphism` 可为 `not-required-for-preview` / `not-run`。

### Plan / Preflight 边界

`plan-page-task` 负责消费 facts、判断 facts 是否足够，并输出 `page-task-plan.v1`。`preflight` 只验证页面是否遵守 plan、contract 与 host facts 边界，可校验 provenance、import 来源、ownership、scroll/footer 与 contract 一致性。preflight 不得用 facts 重新判断 `pageType`、决定组件策略、选择 `startFrom`、推断 `mode`、生成 `requiredActions` 或改写计划。
