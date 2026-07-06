# HiUI Page Task Lifecycle

本文件是页面任务生命周期的唯一真相。`SKILL.md` 只保留摘要，详细阶段边界以本文为准。

生命周期目标：

- 让 agent 先拿机器计划，再读文档，再执行动作。
- 让 `plan-page-task` 成为普通与复杂页面任务的单一事实出口。
- 让项目基础事实与资产基础事实由 plan / pre-plan 工具内部读取，避免 agent 每次重复读取 capabilities、mode lock、project integration state、route ownership 或组件认证。
- 让复杂场景只额外补 source / visual / host / chart / acceptance 等场景专属事实，而不是重复读取基础项目事实。
- 让每个阶段都有输入、成功信号、失败策略和下一步。
- 让失败恢复统一回到 `rules/failure-matrix.md`。

## 基础事实责任边界

| 事实类型 | 示例 | 负责阶段 | Agent 是否每次显式读取 |
| --- | --- | --- | --- |
| 项目基础事实 | project root、project integration state、mode lock、capabilities、route ownership、i18n、governance availability | `PlanTask` 内部读取并输出 `facts` / `projectMode` / `targetPage.routeOwnership`；其中 `project integration state` 还必须证明 legacy 项目的 project-certified carriers 与宿主桥接输入事实已在接入期落地 | 否；只在 plan 缺失 / 冲突 / 排障 / 接入维护时读取 |
| 资产基础事实 | certified page component、mold、adapter catalog、baseMoldId、certification status、page-type component support | `PlanTask` 内部读取并输出 `assetResolution` / `primaryGenerationAsset` / `projectTypicalPageSupport` | 否；只在资产维护或 plan 排障时读取 |
| 场景专属事实 | `visual-translation-brief.v1`、`host-qualification-facts.v1`、`chartUsageContract`、`pre-migration-snapshot.v1`、`page-acceptance-contract.v1` | pre-plan / strategy-specific phases | 是，按计划和场景生成或读取 |
| 实例验证事实 | slot 边界、source proof、preflight、runtime smoke、governance report | validate / preflight / governance phases | 是，每次页面生成后验证 |

## 阶段表

| Phase | 输入 | 成功信号 | 失败策略 | 下一步 |
| --- | --- | --- | --- | --- |
| `LocateProjectRoot` | 当前工作区、用户给定路径 | 找到同时包含 `package.json` 与 `.local-context/hiui-design/` 的目录 | 报 `PROJECT_ROOT_NOT_FOUND`；不要在父目录执行页面命令 | `DetectSourceInput` 或 `PlanTask` |
| `DetectSourceInput` | 用户输入、附件、URL、本地源码路径 | 确认是否为不规范原型截图、旧系统截图 / URL / 源码转译任务 | 普通文本任务不进入本阶段；不要默认读取视觉转译文档 | `SourceObservation` 或 `PlanTask` |
| `SourceObservation` | 可追溯 artifact ref、旧页面 URL、旧源码路径 | 获得可访问的源材料观察；artifact ref 格式合法 | 关键 artifact 不可访问则进入 `VISUAL_BRIEF_BLOCKED` / `VISUAL_BRIEF_INVALID` | `CreateVisualTranslationBrief` |
| `CreateVisualTranslationBrief` | source observation、`docs/generation/visual-to-hiui-translation.md` | 获得 `visual-translation-brief.v1`，且只包含 pre-plan facts | 不得输出 `targetPage`、`requiredActions`、`startFrom` 等 plan 字段 | `DeriveHostQualificationFacts` 或 `ResolvePrePlanBlockingFacts` |
| `DeriveHostQualificationFacts` | plan/pre-plan 可用的 mode fact、runtime contract、legacy host 证据 | 只在 legacy 宿主桥接、迁移预案或宿主边界补事实场景获得 `host-qualification-facts.v1`；普通场景或接入期 facts 已齐备的 legacy 页面跳过 | `manual-observed` 永不使 legacy host facts ready；缺 verified/provenance 则 blocked | `ResolvePrePlanBlockingFacts` |
| `ResolvePrePlanBlockingFacts` | `visual-translation-brief.v1`、`host-qualification-facts.v1`、`blockingIssues[]`、`blockingReasons[]` | pre-plan facts `status=ready`，或用户缩小任务为只生成 / 修复 facts | facts blocked 不调用 `PlanTask`；facts invalid 先重建 facts | `PlanTask` |
| `PlanTask` | 项目根、用户需求、目标页路径、可选 page type / mode、pre-plan facts | 获得 `page-task-plan.v1`，`status` 为 `ready` / `blocked` / `invalid`，且基础事实通过 `facts`、`projectMode`、`targetPage.routeOwnership`、`assetResolution` 暴露；若项目已接入，则优先复用 `project-integration-state.json` / `project-mode.json` 而不是重新做接入诊断。若接入事实存在但 `integrationReady=false`，planner 必须直接给出 blocked，不得继续假设项目接入或 legacy bridge 已完整；页型级 `page-component` 资产是否 ready，继续由 `assetResolution` / `projectTypicalPageSupport` 独立判断。plan 还必须把生成期输入/轻检查/交付检查分别暴露为 `generationInputs`、`inlineChecks`、`deliveryChecks`，并把“目标交付主链”与“当前允许动作”拆成 `targetDeliverySemantics`、`currentExecutionState`；`requiredCommands` / `requiredActions` / `canStartImplementation` 必须跟 `currentExecutionState` 对齐。命中 `non-typical-overlay` 或 `single-page-composite` 时，还要直接暴露 `layoutStrategy`、`layoutArchetype`、`nonTypicalScope`、`mandatoryComponents`、`compositionGuardrails`、`strategyEvidence` 与 `ownershipPlan`。 | 无计划则 fail closed；未知 schema 则 `PLAN_SCHEMA_UNSUPPORTED`；`facts.status!=ready` 时只补事实 / 排障；overlay 布局事实缺失时不得继续生成 | `ready -> ReadRequiredDocs`；`blocked -> ResolveBlockingFacts`；`invalid -> OutputDeliverySummary` |
| `ResolveBlockingFacts` | `blockingIssues[]`、兼容文本 `blockingReasons[]`、用户需求、项目事实 | 阻断事实被补齐，并重新运行 plan 得到 `status=ready` | 不生成页面、不写合同、不跑 preflight；只补事实。若命中多个 blocker，执行顺序以 `currentExecutionState` / `requiredCommands` 为准，项目级接入 / carrier 认证始终先于 route ownership 等页面级阻断。若命中 `PROJECT_INTEGRATION_INCOMPLETE` 或 `LEGACY_CARRIER_CERTIFICATION_REQUIRED`，默认优先执行 `bootstrap-target-project.mjs` 修复项目级接入 / carrier 认证，再回到 `PlanTask` | `PlanTask` |
| `ReadRequiredDocs` | `requiredDocs[]`（`path/readMode/reason`）、按需读取索引 | 已读取计划要求的最小文档集合；先读 `readMode=required`，快速链路只按 `reason` 补读必要 `reference/conditional`；生成行为以 `generationInputs.requiredFacts` 为主，不靠 delivery checklist 倒推 | 不整包遍历 `docs/` / `rules/` / `examples/` / `scripts/` | `ResolveGenerationStrategy` |
| `ResolveGenerationStrategy` | `generationStrategy`、`primaryGenerationAsset`、`fallbackGenerationAsset`、`assetResolution`、`customizationLevel`、`analyticsContractRequired`、`generationInputs` | 策略归一为 `page-component` / `managed-analytics` / `controlled-extension` / `managed-fallback` / `non-typical`，并锁定起始骨架、必要资产和 overlay 布局事实。legacy 若命中 ready 的 `page-component + runtime bridge + slot fill`，必须把它视为默认主链，而不是因为 direct shell import 不成立就隐式回退 | 策略缺失、冲突或旧字段无法映射时回到 `PlanTask`；不得自行选择骨架 | `GenerateByStrategy` |
| `GenerateByStrategy` | `requiredActions[]`、`generationInputs`、业务需求、策略资产 | 按策略进入对应子流程：组件实例化、受管分析、受控扩展、fallback 或非典型；实现阶段只消费 `generationInputs` 与 `inlineChecks`，不把 `deliveryChecks` 当前置生成指导。legacy ready 的页面组件主链只允许填业务槽位或 Level 1 扩展，不得改写成 hand-built compatibility page | 主资产不可用且无 fallback 时 fail closed；不得回退到空白页手写 | `ValidateInstance` |
| `ConsumeAvailablePageComponent` | `generationStrategy=page-component`、`assetResolution.status=available`、`pageComponent.componentId`、`baseMoldId`、`extensionPolicy` | plan 已证明组件 certified / available；agent 只使用标准槽位或 Level 1 受控扩展；`rules-only` / `host-integration` 下的组件可用性属于此处消费的资产事实，不反写成项目接入失败。legacy 若附带 `runtimeBridgeProfile` / `runtimeAdapterProof` ready，也必须继续消费该主链，不得把 direct shell import 不成立解释成组件不可用 | `assetResolution` 缺失、blocked、stale 或候选不 certified 时 fail closed 或回到 `PlanTask`；不得业务生成时重新认证 | `FillBusinessSlots` |
| `BuildChartUsageContract` | `generationStrategy=managed-analytics` 或 `analyticsContractRequired=true`、业务指标、图表需求 | 每张图都有业务问题、信息任务、选图理由和阅读线 | contract 缺失或图表规则不满足时 blocked；不得复制示例网格或用默认图表主题凑数 | `GenerateAnalyticsPageInstance` |
| `ResolveManagedFallbackStartPoint` | `generationStrategy=managed-fallback`、`fallbackGenerationAsset`、`startFrom` 兼容字段 | fallback 明确为 mold / adapter / archetype / template / scaffold，且锁定不可改 region 与槽位 | 起点缺失、adapter 未认证、槽位边界不明时回到 `PlanTask` 或补事实；不得空白页手写 | `GenerateOrEdit` |
| `ClassifyInstanceCustomization` | 已登记页面、变更需求、`pageComponent.allowedExtensions` / mold slot manifest | 判断为 `slot-fill` / `controlled-extension` / `analytics-extension` / `structural-upgrade` / `true-non-typical` | Level 2+ 结构变化必须升级策略，不得轻量修改锁定区 | `GenerateOrEdit` 或 `PlanTask` |
| `GovernanceFacts` | `rules/page-governance.md`、受管页 profile、source snapshot / acceptance contract | 新建 / 迁移 / 重架构所需治理事实 ready | snapshot 低置信度、acceptance 缺 provenance 时 blocked | `GenerateOrEdit` |
| `ValidateInstance` | 生成结果、plan facts、`inlineChecks`、page component / analytics / fallback contract、route / API / permission / i18n facts | 业务实例未越过槽位 / 扩展 / 图表 / legacy 边界；路由与运行时事实可追踪 | 实例验证失败不得进入完成态；修复后重新验证 | `WriteContract` |
| `WriteContract` | 生成结果、contract fields、region mapping | contract / source marker 与页面实际结构一致 | 写到示例 gallery 或缺关键 region 时 fail closed | `StaticGovernance` |
| `StaticGovernance` | 生成源码、page profile、governance guard | hard profile 无 blocking；report-only profile 的风险被披露 | hard profile failed 不得输出完成态 | `Preflight` |
| `Preflight` | 页面路径、contract、source marker、region / ownership / i18n / chart / adapter facts | `preflight-report.v1.status=passed` | `failed|invalid` 不得完成；按 `blockingIssues[]` 修复后重跑 | `FormalAcceptance` 或 `RuntimeGovernance` |
| `FormalAcceptance` | `acceptanceProfile.formalRequired=true`、formal actions | formal actions 全部通过 | 未执行不得报告 passed | `RuntimeGovernance` |
| `RuntimeGovernance` | runtime smoke plan、governance report、preview facts | 必要 runtime smoke / governance 通过或明确 not-required；`runtime-smoke` 只写浏览器级证据，`preflight` / `doctor` 只按当前源码快照识别该证据是否 still-current，只有 `finalize-page` 能宣告 `finalized` | hard profile failed / required smoke failed 不得完成 | `PreviewReady` |
| `PreviewReady` | 当前页源码、可选 preview URL、轻量 page-quality checks | `previewReady=true` 且 `qualityVerified=true`；只证明页面可预览与当前页质量门槛通过 | preview-ready 失败不得宣告完成 | `UsageStats` 或 `OutputDeliverySummary` |
| `UsageStats` | `PRIVACY.md`、workspace policy、preview-ready output | 仅在 workspace policy 或维护者链路要求时收口 usage；状态为 completed / skipped / unavailable / not_applicable 等可解释状态 | 统计失败不推翻页面交付，但必须披露下一步 | `OutputDeliverySummary` |
| `OutputDeliverySummary` | `deliverySummaryProfile`、`finalReportContract`、已执行 actions、验证结果 | 输出轻量摘要或完整报告；只列真实证据；若存在 managed page contract / workflow，应优先复用其页面状态、stale 状态与 formal finalize 事实，而不是再向上层重复取同一组状态 | preflight/governance/source facts 失败时必须 blocked/failed | 结束 |

## 标准链路

普通页面任务默认链路：

```text
LocateProjectRoot
  -> PlanTask(load project integration state / mode lock / project capabilities / route ownership / asset catalog internally)
  -> status=invalid -> OutputDeliverySummary
  -> status=blocked or facts.status!=ready -> ResolveBlockingFacts -> PlanTask
  -> status=ready   -> ReadRequiredDocs
  -> ResolveGenerationStrategy
  -> GenerateByStrategy
  -> generationStrategy=page-component       -> ConsumeAvailablePageComponent -> FillBusinessSlots
  -> generationStrategy=managed-analytics    -> BuildChartUsageContract -> GenerateAnalyticsPageInstance
  -> generationStrategy=controlled-extension -> ClassifyInstanceCustomization -> GenerateOrEdit
  -> generationStrategy=managed-fallback     -> ResolveManagedFallbackStartPoint -> GenerateOrEdit
  -> generationStrategy=non-typical          -> GovernanceFacts -> GenerateOrEdit
  -> ValidateInstance
  -> WriteContract
  -> StaticGovernance
  -> Preflight
  -> acceptanceProfile.formalRequired ? FormalAcceptance : RuntimeGovernance
  -> RuntimeGovernance
  -> PreviewReady
  -> UsageStats(optional by workspace policy)
  -> OutputDeliverySummary
```

截图 / 旧系统转译任务先经过 pre-plan facts 分支；基础项目事实仍由 `PlanTask` / pre-plan 工具消费，不作为 agent 每次显式读取步骤：

```text
LocateProjectRoot
  -> DetectSourceInput
  -> SourceObservation
  -> CreateVisualTranslationBrief
  -> legacy? DeriveHostQualificationFacts : ResolvePrePlanBlockingFacts
  -> facts=invalid  -> OutputDeliverySummary
  -> facts=blocked  -> ResolvePrePlanBlockingFacts
  -> facts=ready    -> PlanTask(load project integration state / mode lock / project capabilities / route ownership / asset catalog internally)
  -> status=invalid -> OutputDeliverySummary
  -> status=blocked or plan facts blocked -> ResolveBlockingFacts -> PlanTask
  -> status=ready   -> ReadRequiredDocs
  -> ResolveGenerationStrategy
  -> GenerateByStrategy
  -> ValidateInstance
  -> WriteContract
  -> Preflight
  -> acceptanceProfile.formalRequired ? FormalAcceptance : RuntimeGovernance
  -> RuntimeGovernance
  -> PreviewReady
  -> UsageStats(optional by workspace policy)
  -> OutputDeliverySummary
```

`ResolvePrePlanBlockingFacts` 与 `ResolveBlockingFacts` 同属统一失败恢复体系；前者只处理 visual / host facts，后者只处理 `page-task-plan.v1` 输出的 `blockingIssues[]` / `blockingReasons[]`。pre-plan facts blocked 时不得调用 `plan-page-task`，除非用户明确把任务缩小为“只生成 / 修复 brief 或 host facts”。

已接入项目默认不应把“确认仓库结构 / 确认是否已接入 hiui-design”呈现为页面任务的首个可见动作。正确行为是：`PlanTask` 先读项目级 integration facts；只有该事实缺失、损坏或与当前仓库状态冲突时，才回退到接入诊断或维护链路。

## 不允许的跳转

- 不允许从 `PlanTask(status=blocked)` 或 `facts.status!=ready` 直接跳到 `GenerateOrEdit`。
- 不允许从 `visual-translation-brief.v1(status=blocked)` 或 `host-qualification-facts.v1(status=blocked)` 直接跳到 `PlanTask` 或 `GenerateOrEdit`。
- 不允许在 `kickoffType=pre-plan-facts` 输出 `status`、`taskLevel`、`topology`、`pageType`、`pageUnits`、`targetPage`、`generationStrategy`、`startFrom`、`fastPath`、`requiredDocs`、`requiredActions`、`acceptanceLevel`、`acceptanceProfile` 或 `finalReportContract` 等 plan 字段。
- 不允许跳过 `WriteContract` 直接对 page-type migration 跑旧合同 `Preflight`。
- 不允许在 `acceptanceProfile.formalRequired!=true` 时自行追加 `source-gate`、`doctor`、`finalize-page`。
- 不允许让 agent 重复执行 `page-task-plan.v1.facts.internalChecks` 已覆盖的 capabilities / mode-lock / route-ownership / component-certification，除非 plan 缺失、冲突、排障或维护任务需要。
- 不允许把 `pageComponent.status=planned|candidate` 当作 certified 组件使用。
- 不允许因 component certification 通过而跳过 `ValidatePageInstance`、业务映射、route ownership 或 runtime render 检查。
- 不允许在 legacy 模式下因为 standard shell 的 direct import 在宿主主树不可用，就把 ready 的 `page-component + runtime bridge + slot fill` 主链降级成 reference 默认翻译、兼容手拼页或自由 fallback。
- 不允许把 Level 2 / Level 3 扩展伪装成 Level 1 受控扩展来保留轻量链路。
- 不允许把数据可视化退化为普通统计表、自由图表墙、默认图表主题或手写 primitives。
- 不允许未提多语言 / locale / 翻译 / RTL 且无强制 contract 时进入 i18n full 流程。
- 不允许因 usage stats 失败推翻已经通过的页面 / preflight 状态，除非用户明确要求统计闭环必须成功。

## Delivery Summary / Final Report 状态分段

最终回复默认按 `page-task-plan.v1.deliverySummaryProfile` 输出轻量摘要；复杂 / 高风险场景再按 `finalReportContract` 输出完整报告。若旧计划没有这些字段，则至少区分：

- 页面状态：未开始 / 已生成 / 已修改 / 阻塞 / 失败。
- facts 状态：ready / blocked / missing / conflict / stale。
- asset resolution 状态：available / fallback / blocked / missing / stale。
- preflight 状态：未运行 / passed / failed / invalid。
- page component 状态：未使用 / certified / missing / expired / blocked。
- generation strategy 状态：page-component / managed-analytics / controlled-extension / managed-fallback / non-typical。
- customization level 状态：slot-fill / controlled-extension / analytics-extension / structural-upgrade / true-non-typical。
- analytics contract 状态：未要求 / missing / ready / failed。
- instance validation 状态：未运行 / passed / failed / invalid。
- formal 验收状态：未请求 / passed / failed。
- usage stats 状态：completed / skipped / requires_authorization / failed_retryable / failed_non_retryable。

必须同时披露：

- 已执行动作：只列真实执行过的 `requiredActions[]` / `formalAcceptanceActions[]`。
- 变更文件：只列本轮实际修改的文件。
- 验证命令：只列真实运行过的命令及结果。
- 剩余风险：`blockingIssues[]`、`warnings[]`、统计补传状态和下一步。

若计划的 `finalReportContract.sections` 声明 `translationSummary`，可呈现 `visualTranslationStatus`、`hostQualificationStatus`、`hostFactsFreshnessStatus`、`preserved`、`discarded`、`normalized`、`unresolved` 与 `assumptions`。该 section 只解释转译过程，不参与 plan 决策、preflight blocking 或 contract 修改。
