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
本 skill 是 HiUI React 页面工程的标准生成协议与交付治理控制面。`page-task-plan.v1`
继续是唯一顶层执行入口；`generationRecipe` 是其内部的正向生成子协议；交付完成态仍由
`preflight-report.v1`、`hiui-page-governance-report.v1`、`acceptanceProfile` 与
`finalReportContract` 决定。

本次协议的中心不是弱化验收，而是把“AI 应该如何正确生成”前置为主叙事，让常见典型页
优先走“按 recipe 生成”的主路径，而不是“先生成一版，再由验收纠偏”。

对 `legacy-host-compatible`，主路径统一为 `project-certified carrier first -> page-component semantics -> explicit fallback`。
也就是说，legacy 模式不是“默认逐页翻译”；只要项目级宿主承接事实已经成立，就应优先消费项目认证 carrier 或可直接复用的已认证页面组件，`managed-translation` 只保留为显式 fallback。
其中面向人类解释的 `runtime-bridged-page-component` 只是 legacy 中对 `page-component` 的桥接语义命名；
它不引入新的平行 generation family，归一后仍必须按 `page-component` 主链路执行。
对带 `header` 的典型页，`page-component` 主链路只有在 carrier certification、page
contract 与 preflight 能共同证明 `PageHeader` stretch、`extra` right-docked 和 `60px`
节奏 owner 不漂移时才成立；仅“使用了 `PageHeader`”不构成主链路通过。
## Core Object Model
- `page-task-plan.v1` 是唯一执行计划与事实出口；AI 不手工拼 `mode`、`pageType`、
  `pageUnits`、`startFrom`、`requiredDocs`、`requiredActions` 或关键命令链。
- `generationRecipe` 作为 `page-task-plan.v1` 的增量子对象引入，不单独创建平行顶层
  contract。
- `generationRecipe` 只描述装配顺序、资产映射、槽位边界、禁止动作与轻量一致性检查；
  不重复存储可由 `pageComponent`、`baseMoldId`、registry 或既有 contract 派生出的事实。
- `editableSlots`、`lockedRegions`、`pageComponent`、`baseMoldId` 优先保持“引用或派生”，
  不复制进 planner。
- `runtimeBridgeProfile` 只作为 legacy `page-component` 路径的附加解析对象存在；它通过
  `rules/runtime-bridged-component-matrix.json` 描述运行时桥接策略，不重定义
  `pageComponent`、`baseMoldId`、`lockedRegions` 或业务槽位事实。
- project 级 `host pack`、project-scoped `page carrier` 与其认证结果属于运行时 / 资产事实，
  默认由计划通过 `facts`、`assetResolution`、`pageComponent` 等字段引用；不要把这些事实再平铺
  复制进每个页面合同。
- carrier-critical layout facts，尤其 `header` 的 stretch owner、actions docking 与
  vertical rhythm owner，属于 contract + certification + preflight 共同消费的机器事实；
  不得退化成只存在于说明文档里的软建议。
- `acceptanceProfile`、`preflight-report.v1`、`hiui-page-governance-report.v1`、
  `finalReportContract` 继续保留，不降级、不移除。
- `requiredDocs` 是默认唯一补读来源；`requiredActions` 是默认唯一执行来源；没有结构化
  动作时，优先使用兼容命令字段，不自行扩展 gate。
对象模型与字段分级以 `rules/contract-regions.md`、`rules/page-task-lifecycle.md` 与 `scripts/public-cli-contracts.json` 为准。
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
标准生成协议与页型约束以 `rules/generation-rules.md`、`docs/generation/page-level-components.md` 与 `docs/validation/generation-recipe-forward-tests.md` 为准。
## Guardrails
- 本 skill 只处理 HiUI React 页面工程任务；需求细化、端到端流程编排、Figma 写入 /
  设计稿生成、通用 React 重构必须交给对应 skill 或普通代码流程。
- 页面生成、重写、大改、页型迁移和旧系统 / 截图转译必须先取得 `page-task-plan.v1`；
  没有机器计划时不得手工拼结论、命令链或完成态。
- `blockingIssues` / `blockingReasons` 非空时必须 fail closed，只补事实；不得生成页面、
  写合同、跑 preflight 或输出完成态。
- 资产新增、补齐和更新只能走 shipped public contract；`add-asset` /
  `update-asset` 必须 dry-run，未 shipped 的 write / force / asset type 不得执行。
- 未经机器计划明确授权或维护者明确要求，不得执行 deploy、upload、publish、sync、
  global sync、Feishu / bitable 后台写入、release archive 生成或历史输出覆盖。
- 涉及外部服务、后台 agent、launch agent、守护进程或用户配置写入的动作，执行前必须同时
  验证目标范围、授权来源和 side effect 边界；缺任一条件时必须拒绝执行。
- `preflight` failed、hard profile governance failed、source snapshot 缺失 / 低置信度、
  `acceptance contract` 缺 provenance 时，最终回复必须是 blocked / failed。
- 开源版不得采集 usage data，必须按 `PRIVACY.md` 呈现 `not_applicable`、`skipped`
  或 `unavailable`。
## Generation Gates
- 生成前门禁：项目根、机器计划、能力画像、mode lock、pre-plan facts。
- 生成协议门禁：page-component 可用性、route ownership、slot 边界、shell / adapter
  证明、analytics contract、业务内容边界、受控扩展。
- `legacy-host-compatible` 普通典型页默认至少保留 5 个硬门禁：`mode` 正确、project
  `host pack` 已认证、shell ownership 不漂移、命中 `header` 时 `headerLayoutContract`
  与 certification 证据完整、业务页只填标准 slots。`styleBoundary`、`portalBoundary`、
  `runtimeSmoke` 仍可按风险触发，但 `header` 的 stretch / right-dock / rhythm owner
  不再只是样式建议；缺少结构化证明时必须阻断主链路。
- 前两层门禁属于“如何正确生成”的组成部分，不再和交付阻断口吻混写。
- `required` 级 `generationRecipe` 字段缺失时，不得假设或手工脑补；只能 blocked，
  或按计划明确给出的 fallback 执行。
- `startingPoint` 无法解析、`requiredAssets` 不可用、或 `assemblyOrder` 不完整时，
  不允许自由退回空白页手写。
- 只有当计划明确给出 `managed-fallback`、`host-archetype` 或
  `reference-or-scaffold` 为合法 fallback 时，才允许降级生成。
- `optional` 字段缺失不自动阻断，但不得伪造填充；缺失时按页型默认策略或现有规则执行。
生成门禁细节：`rules/generation-rules.md` 与 `rules/page-governance.md`。
## Delivery Gates
- `preflight-report.v1` 与 `hiui-page-governance-report.v1` 继续是交付确认层核心判断对象。
- `acceptanceProfile` 决定验收范围；`formal acceptance` 是验收等级，不是生成链路。
- `finalReportContract` 继续保留，用于完整报告与下游兼容。
- 交付门禁只负责“是否允许宣告完成”，不再主导生成叙事。
- 若某类问题连续多次在 `DeliveryConfirmation` 阶段暴露，必须优先回灌到
  `generationRecipe` 或 generation gates，而不是持续追加新的验收描述。
交付门禁细节：`rules/page-governance.md` 与 `rules/validation-checklist.md`。
## Runtime Protocol
- 运行时协议的唯一真相是 `rules/runtime-contract.md`；受管页面治理协议的唯一真相是
  `rules/page-governance.md`。
- `rules/runtime-bridged-component-matrix.json` 是 legacy `page-component` 桥接语义的唯一真相；
  它只声明 bridge profile、runtime shell 来源与薄桥层职责，不复制 mold / slot / ownership
  事实。
- 基础项目事实（mode、capabilities、route ownership、i18n、governance
  availability）与基础资产事实（certified page component、mold、adapter catalog）
  应由计划内部消费并通过 `facts`、`assetResolution`、`projectMode`、
  `targetPage.routeOwnership` 等字段暴露。
- project-scoped host pack / carrier facts 也属于 runtime input facts。对 legacy 项目，应优先
  在项目接入 / capabilities 阶段一次认证，再由页面生成阶段复用，不要在每个页面重复解释宿主边界。
- Agent 只在 plan 缺失 / 冲突 / 排障 / 维护时显式读取 capabilities、mode lock、
  认证文件或 catalog。
- `host-qualification-facts.v1` 只是 runtime input facts contract，不是 execution plan；
  它只承载 legacy 宿主边界、bridge / adapter 事实与 provenance。
## Task Lifecycle
文档叙事层统一为：
`LocateProjectRoot -> PlanTask -> ResolveBlockingFacts -> BuildGenerationRecipe -> GenerateByRecipe -> InlineConformanceChecks -> DeliveryConfirmation -> OutputDeliverySummary`
- `BuildGenerationRecipe`：把 `generationStrategy` 转化为标准装配协议。
- `GenerateByRecipe`：生成行为必须遵循 `assemblyOrder`、`requiredAssets`、
  `forbiddenMoves`；不允许自由发明页壳、region owner、slot 顺序。
- `InlineConformanceChecks`：关键装配步骤后的轻量一致性检查，不把重验收前移。
- `DeliveryConfirmation`：末端确认层，内部继续承接 `WriteContract`、`Preflight`、
  `FormalAcceptance`、`RuntimeGovernance`、`UsageStats`。
- 这是叙事改名，不是立即的外部接口改名；公共脚本、报告对象和字段至少保留一个迁移周期
  alias。
详细生命周期仍以 `rules/page-task-lifecycle.md` 为唯一真相。
## First Turn Output
页面任务首轮回复默认优先展示生成信息，而不是先铺验收字段。默认优先字段：
- `generationStrategy`
- `generationRecipe`
- `primaryGenerationAsset`
- `assemblyOrder`
- `requiredAssets`
- `extensionPolicy`
- `requiredActions`
复杂或严格场景再展开：
- `acceptanceLevel`
- `acceptanceProfile`
- `finalReportContract`
若命中不规范原型截图、旧系统截图 / URL / 源码，首轮按
`docs/generation/ai-kickoff-template.md` 输出 `kickoffType=pre-plan-facts`，只解释
`visual-translation-brief.v1` 与必要的 `host-qualification-facts.v1` 状态。
## Truth Index
- 机器计划入口、成功信号和失败信号：`scripts/README.md`
- 公开 CLI 契约：`scripts/public-cli-contracts.json`
- 运行时协议：`rules/runtime-contract.md`
- 页面任务生命周期：`rules/page-task-lifecycle.md`
- 失败恢复矩阵：`rules/failure-matrix.md`
- 生成约束：`rules/generation-rules.md`
- 页面组件与模具注册表：`rules/page-component-registry.json`、
  `rules/page-mold-registry.json`
- runtime bridge profiles：`rules/runtime-bridged-component-matrix.json`
- adapter 注册表：`rules/adapter-registry.json`
- contract 约束与摘要：`rules/contract-regions.md`
- 页面治理与 source snapshot / acceptance contract：`rules/page-governance.md`
- 验收清单：`rules/validation-checklist.md`
- 前向验证与成功指标：`docs/validation/generation-recipe-forward-tests.md`
- 页面组件策略与认证：`docs/generation/page-level-components.md`、
  `docs/generation/component-certification.md`
- 页头几何与宿主 baseline：`docs/generation/figma-reference.md`
- 旧宿主转译：`docs/generation/legacy-host-compatibility.md`
- 视觉 / 旧系统 pre-plan facts：`docs/generation/visual-to-hiui-translation.md`
- 非典型页面：`docs/generation/non-typical-pages.md`
- 图表与数据可视化：`docs/generation/figma-page-rules.md`、
  `docs/generation/figma-pages/data-visualization.md`
- usage stats：`PRIVACY.md`
默认只读计划里的 `requiredDocs`；不要为选择模具或解释页型而整包遍历 `docs/`、`rules/`、
`templates/`、`manifests/`。
## Final Report
- 最终回复默认基于 `deliverySummaryProfile` 输出轻量交付摘要。
- 复杂 / 高风险场景、严格验收、legacy 迁移、真非典型、复杂数据可视化、
  `preflight` / smoke 失败时，再进入 `finalReportContract` / `final-page-report.v1`。
- 最终报告默认阅读顺序是：页面如何生成 -> 使用了哪些主资产与槽位 -> 哪些区域继承 /
  哪些区域业务填充 -> 当前交付确认状态。
- 状态字段必须完整保留，但不再占据主阅读中心。
- 若无法运行 `typical-page:render-final-report`，也必须呈现页面状态、preflight 状态、
  formal 验收状态、usage stats 状态、已执行动作、变更文件、验证命令与剩余风险。
