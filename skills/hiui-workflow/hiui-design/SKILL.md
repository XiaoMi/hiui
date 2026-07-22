---
name: hiui-design
description: >-
  在 React 项目中接入、生成、修改、联调或验收 HiUI 典型页与非典型页面时使用。适用于
  数据统计表、普通表格、树形表格、左树右表、数据可视化、异常反馈页、抽屉表单/详情、
  全页编辑/详情、不规范原型截图转规范页、老旧系统截图/URL/源码现代化转译，以及
  host-integration、rules-only、legacy-host-compatible 等场景。
---

# HiUI 典型页 Skill

## Positioning

本 skill 是 HiUI React 页面工程的标准生成协议与交付治理控制面。`page-task-plan.v1` 继续是唯一顶层执行入口；`generationRecipe` 是其内部的正向生成子协议；交付完成态仍由 `preflight-report.v1`、`hiui-page-governance-report.v1`、`acceptanceProfile` 与 `finalReportContract` 决定。主叙事是“先按 recipe 正确生成，再由验收确认”，而不是“先生成一版，再靠验收纠偏”。

标准典型页命中 `page-component + slot-fill` 时，默认走 `minimal-doc fast path`：优先消费 planner、scaffold 与 slot contract，不再手工展开大段治理文档；复杂页、漂移页和正式验收场景才升级到完整规则链路。

`legacy-host-compatible` 的主路径统一为 `project-certified carrier first -> page-component semantics -> explicit fallback`。宿主承接事实成立时，应优先消费项目认证 carrier 或已认证页面组件，`managed-translation` 只保留为显式 fallback。`runtime-bridged-page-component` 只是 legacy 中对 `page-component` 的桥接语义命名，不引入平行 generation family；命中 `header` 时，只有 carrier certification、page contract 与 preflight 能共同证明 `PageHeader` stretch、`extra` right-docked 和 `60px` 节奏 owner 不漂移，主链路才成立。

对外沟通时要把两件事拆开说明：legacy 宿主主树不能被当成 generic `@hiui-design/typical-page-shells` 直挂运行时，不等于 legacy 项目不能走普通典型页组件主链。只要 planner 已给出 `page-component + runtime bridge + slot fill`，就必须沿该主链执行，不得把“不能 ad hoc direct shell import”误读成“只能 reference/fallback”。

## Core Object Model

- `page-task-plan.v1` 是唯一执行计划与事实出口；AI 不手工拼 `mode`、`pageType`、`pageUnits`、`startFrom`、`requiredDocs`、`requiredActions` 或关键命令链。
- `generationRecipe` 作为 `page-task-plan.v1` 的增量子对象引入，不单独创建平行顶层 contract。
- `generationRecipe` 只描述装配顺序、资产映射、槽位边界、禁止动作与轻量一致性检查；不重复存储可由 `pageComponent`、`baseMoldId`、registry 或既有 contract 派生出的事实。
- `targetDeliverySemantics` 与 `currentExecutionState` 必须分层输出：前者回答“计划成立后应沿哪条受管交付主链落地”，后者回答“当前这一步允许执行什么”。legacy blocked 时，前者仍可保留 `page-component + runtime bridge + slot fill` 目标语义，但后者必须只暴露 `ResolveBlockingFacts`。
- `editableSlots`、`lockedRegions`、`pageComponent`、`baseMoldId` 优先保持“引用或派生”，不复制进 planner。
- `runtimeBridgeProfile` 只作为 legacy `page-component` 路径的附加解析对象存在；它通过 `rules/runtime-bridged-component-matrix.json` 描述运行时桥接策略，不重定义 `pageComponent`、`baseMoldId`、`lockedRegions` 或业务槽位事实。
- project 级 `host pack`、project-scoped `page carrier` 与其认证结果属于运行时 / 资产事实，默认由计划通过 `facts`、`assetResolution`、`pageComponent` 等字段引用；不要把这些事实再平铺复制进每个页面合同。
- carrier-critical layout facts，尤其 `header` 的 stretch owner、actions docking 与 vertical rhythm owner，属于 contract + certification + preflight 共同消费的机器事实；不得退化成只存在于说明文档里的软建议。
- `acceptanceProfile`、`preflight-report.v1`、`hiui-page-governance-report.v1`、`finalReportContract` 继续保留，不降级、不移除。
- `requiredDocs` 是默认唯一补读来源；其最小结构固定为 `path`、`readMode`、`reason`。先读 `readMode=required`，`reference` / `conditional` 只在命中对应场景时补读。`requiredActions` 是默认唯一执行来源；没有结构化动作时，优先使用兼容命令字段，不自行扩展 gate。

对象模型与字段分级：`docs/generation/explainers/core-object-model.md`

## Standard Generation Protocol

`Standard Generation Protocol` 只回答 4 个问题：

- 从什么骨架起步。
- 关键 region 的装配顺序是什么。
- 哪些区域允许业务填充。
- 每完成一个关键步骤后做什么 `inlineChecks`。

`generationRecipe.required` 默认至少包含：

- `startingPoint`
- `assemblyOrder`
- `requiredAssets`
- `forbiddenMoves`

`generationRecipe.optional` 可按页型与复杂度逐步补齐：

- `slotFillPolicy`
- `regionOwnership`
- `inlineChecks`

第一批 recipe 只覆盖高频页型：

- `table-page`
- `analytics-page`
- `edit/detail-page`

标准生成协议补读：`docs/generation/explainers/standard-generation-protocol.md`

## Guardrails

- 本 skill 只处理 HiUI React 页面工程任务；需求细化、端到端流程编排、Figma 写入 / 设计稿生成、通用 React 重构必须交给对应 skill 或普通代码流程。
- 页面生成、重写、大改、页型迁移和旧系统 / 截图转译必须先取得 `page-task-plan.v1`；没有机器计划时不得手工拼结论、命令链或完成态。
- `blockingIssues` / `blockingReasons` 非空时必须 fail closed，只补事实；不得生成页面、写合同、跑 preflight 或输出完成态。
- 资产新增、补齐和更新只能走 shipped public contract；`add-asset` / `update-asset` 必须 dry-run，未 shipped 的 write / force / asset type 不得执行。
- 未经机器计划明确授权或维护者明确要求，不得执行 deploy、upload、publish、sync、global sync、Feishu / bitable 后台写入、release archive 生成或历史输出覆盖。
- 涉及外部服务、后台 agent、launch agent、守护进程或用户配置写入的动作，执行前必须同时验证目标范围、授权来源和 side effect 边界；缺任一条件时必须拒绝执行。
- `preflight` failed、hard profile governance failed、source snapshot 缺失 / 低置信度、`acceptance contract` 缺 provenance 时，最终回复必须是 blocked / failed。
- 开源版不得采集 usage data，必须按 `PRIVACY.md` 呈现 `not_applicable`、`skipped` 或 `unavailable`。

## Generation Gates

- 生成前门禁：项目根、机器计划、能力画像、mode lock、pre-plan facts。
- 生成协议门禁：page-component 可用性、route ownership、slot 边界、shell / adapter 证明、analytics contract、业务内容边界、受控扩展。
- `legacy-host-compatible` 普通典型页的硬门禁真相统一收口到 `rules/legacy-host-hard-gates.json`：baseline 固定为 4 个硬门禁，命中 `header` 时再追加 `header-layout-proof` 条件门禁，因此当前常见典型页通常会落到 5 个有效硬门禁。`styleBoundary`、`portalBoundary`、`runtimeSmoke` 仍按风险触发；但 `header` 的 stretch / right-dock / rhythm owner 不再只是样式建议，缺少结构化证明时必须阻断主链路。
- `legacy-host-compatible` 下若 planner 已证明 `page-component` ready 且 `runtimeAdapterProof.status=available`，默认执行语义就是 `page-component + runtime bridge + slot fill`。缺少 legacy 主树 direct shell import 前提，只能阻止 ad hoc standard-shell mount，不能作为擅自降级到兼容手拼页、reference 默认翻译页或自由 fallback 的理由。
- 前两层门禁属于“如何正确生成”的组成部分，不再和交付阻断口吻混写。
- `required` 级 `generationRecipe` 字段缺失时，不得假设或手工脑补；只能 blocked，
  或按计划明确给出的 fallback 执行。
- `startingPoint` 无法解析、`requiredAssets` 不可用、或 `assemblyOrder` 不完整时，
  不允许自由退回空白页手写。
- 只有当计划明确给出 `managed-fallback`、`host-archetype` 或
  `reference-or-scaffold` 为合法 fallback 时，才允许降级生成。
- `optional` 字段缺失不自动阻断，但不得伪造填充；缺失时按页型默认策略或现有规则执行。

生成门禁细节：`docs/generation/explainers/generation-gates.md`

## Delivery Gates

- `preflight-report.v1` 与 `hiui-page-governance-report.v1` 继续是交付确认层核心判断对象。
- `acceptanceProfile` 决定验收范围；`formal acceptance` 是验收等级，不是生成链路。
- `finalReportContract` 继续保留，用于完整报告与下游兼容。
- 交付门禁只负责“是否允许宣告完成”，不再主导生成叙事。
- 若某类问题连续多次在 `DeliveryConfirmation` 阶段暴露，必须优先回灌到
  `generationRecipe` 或 generation gates，而不是持续追加新的验收描述。

交付门禁细节：`docs/generation/explainers/delivery-gates.md`

## Runtime Protocol

- 运行时协议的唯一真相是 `rules/runtime-contract.md`；受管页面治理协议的唯一真相是
  `rules/page-governance.md`。
- `rules/runtime-bridged-component-matrix.json` 是 legacy `page-component` 桥接语义的唯一真相；它只声明 bridge profile、runtime shell 来源与薄桥层职责，不复制 mold / slot / ownership 事实。
- `rules/legacy-host-hard-gates.json` 是 legacy 普通典型页硬门禁编排的唯一机器真相；`SKILL.md`、生成门禁说明和 planner 只引用它，不再各自手写门禁数量。
- 基础项目事实（mode、capabilities、route ownership、i18n、governance availability）与基础资产事实（certified page component、mold、adapter catalog）应由计划内部消费并通过 `facts`、`assetResolution`、`projectMode`、`targetPage.routeOwnership` 等字段暴露。
- 对已接入项目，接入阶段写入的 `.local-context/hiui-design/outputs/project-integration-state.json`
  属于 project 级 runtime input fact。`PlanTask` 应优先复用它与 `project-mode.json`，
  直接进入页面规划；只有该状态缺失、损坏或与当前事实冲突时，才回退到 host profile /
  mode detection 诊断。
- `project-integration-state.json.integrationReady=true` 只有在接入阶段已经验证过
  project-certified carriers 的 `componentSource`、`componentShell` 与
  `componentSupportSources` 都能解析到真实项目源码时才成立；缺任一项时，接入必须保持
  `integrationReady=false`，页面生成阶段只允许暴露阻断原因，不得把缺失 carrier 问题延后到
  业务页实现期才发现。
- 对 `legacy-host-compatible`，`integrationReady=true` 的定义本身就包含项目级 required rollout 已完成：
  默认先覆盖 `table-basic`、`table-stat`、`tree-table`、`tree-split`、`drawer-form`、
  `drawer-detail`、`full-page-edit`、`full-page-detail` 这些 `carrier-first-required`
  页型；`feedback-status` 与 `data-visualization` 可作为 deferred batch 后补。缺少 required
  batch 的 project-certified carrier 时，integration state 必须显式输出
  `requiredLegacyPageTypes`、`deferredLegacyPageTypes`、`certifiedLegacyPageTypes`、
  `missingRequiredLegacyPageTypes` 与 `legacyRolloutCoverageStatus=blocked`，并把当前项目视为
  legacy 接入未完成，而不是“已接入但页面阶段再补 rollout”。
- `integrationReady` 默认只回答“项目是否已完成 hiui-design 接入”和“legacy 宿主桥接是否已具备项目级承接事实”。对 legacy，这个完成态已经内含 required carrier batch ready；`rules-only` / `host-integration` 下标准典型页组件是否可用，属于 planner 消费的资产事实与页型支持事实，不应被收口为通用项目接入失败。
- project-scoped host pack / carrier facts 也属于 runtime input facts。对 legacy 项目，应优先
  在项目接入 / capabilities 阶段一次认证，再由页面生成阶段复用，不要在每个页面重复解释宿主边界。
- Agent 只在 plan 缺失 / 冲突 / 排障 / 维护时显式读取 capabilities、mode lock、
  认证文件或 catalog。
- `host-qualification-facts.v1` 只是 runtime input facts contract，不是 execution plan；
  它只承载 legacy 宿主边界、bridge / adapter 事实与 provenance。
- `typical-page:runtime-smoke` 只记录“当前源码快照上的浏览器级证据”，不负责宣告页面完成；
  `preflight` / `doctor` 只把该证据与当前源码快照对齐并识别是否已过期；
  只有 `typical-page:finalize-page` 可以把交付状态翻转为 `finalized`。

## Task Lifecycle

文档叙事层统一为：

`LocateProjectRoot -> PlanTask -> ResolveBlockingFacts -> BuildGenerationRecipe -> GenerateByRecipe -> InlineConformanceChecks -> DeliveryConfirmation -> OutputDeliverySummary`

- `PlanTask`：默认先消费项目级 integration facts，再补 capabilities / route / asset-resolution；不要把“确认仓库结构 / 确认是否已接入 hiui-design”当成每次页面任务的可见前置步骤。planner 默认还要把生成期与交付期动作拆成 `generationInputs`、`inlineChecks`、`deliveryChecks`，避免把重验收口径前移成生成指导。
- `PlanTask` 输出层必须同时暴露 `targetDeliverySemantics` 与 `currentExecutionState`：前者描述目标交付主链，后者描述当前允许动作、阻断相位与 blocker 优先级。`requiredCommands`、`requiredActions` 与 `canStartImplementation` 必须跟 `currentExecutionState` 一致，不得再让 blocked 计划对外看起来像可以直接开始页面生成。
- `PlanTask` 对 legacy 普通典型页的首要职责之一，是把 “禁止 legacy 主树 ad hoc 直挂 standard shell” 与 “允许 page-component + runtime bridge + slot fill 主链” 同时暴露清楚；不得把 direct shell import 不成立，回退表达成通用 page-component 不可用。
- 若项目级 integration facts 已存在但 `integrationReady=false`，`PlanTask` 必须 fail closed，
  直接回显接入阻断原因；不要再尝试把页面生成、起手 scaffold 或页面级 preflight 当成接入 /
  legacy bridge 完整性的补救路径。页型级 `page-component` 资产是否 ready，继续由 planner 的
  `assetResolution` / `projectTypicalPageSupport` 独立判断，而不是反写成通用 integration debt。
- 当 `integrationReady=false` 的原因来自 legacy required rollout 未完成时，`PlanTask` 默认应把
  `bootstrap-target-project` 放在 `ResolveBlockingFacts` 队首；这表示当前项目的 legacy 接入 /
  bootstrap 还未完成，而不是“已接入项目在页面阶段追加一个 rollout 步骤”。若同时命中 route
  ownership blocker，再在其后追加 route 修复动作，不得跳过项目级 carrier rollout 直接进入页面实现。
- `BuildGenerationRecipe`：把 `generationStrategy` 转化为标准装配协议。
- `GenerateByRecipe`：生成行为必须遵循 `assemblyOrder`、`requiredAssets`、`forbiddenMoves`；不允许自由发明页壳、region owner、slot 顺序。
- `InlineConformanceChecks`：关键装配步骤后的轻量一致性检查，不把重验收前移。
- `DeliveryConfirmation`：末端确认层，内部继续承接 `WriteContract`、`Preflight`、`PreviewReady`、`FormalAcceptance`、`RuntimeGovernance`。开源版不承担 usage telemetry / stats closeout，最终回复只收口页面交付与质量验证状态。
- 这是叙事改名，不是立即的外部接口改名；公共脚本、报告对象和字段至少保留一个迁移周期 alias。

详细生命周期仍以 `rules/page-task-lifecycle.md` 为唯一真相。

## First Turn Output

页面任务首轮回复默认优先展示生成信息，而不是先铺验收字段。默认优先字段：

- `generationStrategy`
- `generationRecipe`
- `generationInputs`
- `inlineChecks`
- `primaryGenerationAsset`
- `assemblyOrder`
- `requiredAssets`
- `extensionPolicy`
- `requiredActions`

复杂或严格场景再展开：

- `deliveryChecks`
- `acceptanceLevel`
- `acceptanceProfile`
- `finalReportContract`

若命中 `non-typical-overlay` 或 `single-page-composite`，首轮还必须直接暴露 `layoutStrategy`、`layoutArchetype`、`nonTypicalScope`、`mandatoryComponents`、`compositionGuardrails`、`strategyEvidence` 与 `ownershipPlan`；这些属于生成输入事实，不是交付后才补的检查备注。

若命中不规范原型截图、旧系统截图 / URL / 源码，首轮按
`docs/generation/ai-kickoff-template.md` 输出 `kickoffType=pre-plan-facts`，只解释
`visual-translation-brief.v1` 与必要的 `host-qualification-facts.v1` 状态。

## Truth Index

- 机器计划入口、成功信号和失败信号：`scripts/README.md`
- 快路径执行入口与补读顺序：`rules/QUICK-START.md`
- 公开 CLI 契约：`scripts/public-cli-contracts.json`
- 运行时协议：`rules/runtime-contract.md`
- 页面任务生命周期：`rules/page-task-lifecycle.md`
- 失败恢复矩阵：`rules/failure-matrix.md`
- 生成约束：`rules/generation-rules.md`
- 数据可视化主次/样式机器策略：`rules/chart-semantic-policy.json`、`rules/data-visualization-layout-policy.json`
- 页面组件与模具注册表：`rules/page-component-registry.json`、`rules/page-mold-registry.json`
- runtime bridge profiles：`rules/runtime-bridged-component-matrix.json`
- legacy hard gates：`rules/legacy-host-hard-gates.json`
- runtime 交付策略：`rules/runtime-delivery-policy.json`
- adapter 注册表：`rules/adapter-registry.json`
- contract 约束与摘要：`rules/contract-regions.md`
- 页面治理与 source snapshot / acceptance contract：`rules/page-governance.md`
- 验收清单：`rules/validation-checklist.md`
- 前向验证与成功指标：`docs/validation/generation-recipe-forward-tests.md`
- 页面组件策略与认证：`docs/generation/page-level-components.md`、`docs/generation/component-certification.md`
- explainers（解释层，不是 source of truth）：`docs/generation/explainers/README.md`
- 页头几何与宿主 baseline：`docs/generation/figma-reference.md`
- 旧宿主转译：`docs/generation/legacy-host-compatibility.md`
- 视觉 / 旧系统 pre-plan facts：`docs/generation/visual-to-hiui-translation.md`
- 非典型页面：`docs/generation/non-typical-pages.md`
- 图表与数据可视化：`docs/generation/figma-page-rules.md`、`docs/generation/figma-pages/data-visualization.md`
- usage stats：`PRIVACY.md`

默认只读计划里的 `requiredDocs`；先消费 `readMode=required`，再按 `reason` 命中情况补读 `reference` / `conditional` 项。不要为选择模具或解释页型而整包遍历 `docs/`、`rules/`、`templates/`、`manifests/`。

## Final Report

- 最终回复默认基于 `deliverySummaryProfile` 输出轻量交付摘要。
- 复杂 / 高风险场景、严格验收、legacy 迁移、真非典型、复杂数据可视化、`preflight` / smoke 失败时，再进入 `finalReportContract` / `final-page-report.v1`。
- `final-page-report.v1` 应优先复用 managed page contract / workflow 已有事实来判断页面是否已生成、是否 stale、是否曾完成 formal finalize；不要再要求上层重复手填同一组状态。
- 最终报告默认阅读顺序是：页面如何生成 -> 使用了哪些主资产与槽位 -> 哪些区域继承 / 哪些区域业务填充 -> 当前交付确认状态。
- 状态字段必须完整保留，但不再占据主阅读中心。
- 若无法运行 `typical-page:render-final-report`，也必须呈现页面状态、preflight 状态、
  formal 验收状态、usage stats 状态、已执行动作、变更文件、验证命令与剩余风险。
