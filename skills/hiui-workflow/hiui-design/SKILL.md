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

`legacy-host-compatible` 的主路径统一为 `host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots`。宿主承接事实必须先落到 `.local-context/hiui-design/host-contract.json`；典型页骨架、DOM region、ownership、slot schema 与视觉 token 必须先由 `rules/typical-page-contracts/<pageType>.json` 编译进 PageSpec，再由 `HiuiLegacyPage` runtime 持有；页面目录只写 `page.instance.tsx`、`page.slots.ts`、必要时 `page.request.ts`，默认不得生成 `src/page-components`。命中 `header` 时，`PageHeader` stretch、`extra` right-docked 和 `60px` 节奏 owner 由 PageSpec 与 runtime 共同持有，业务页只能填 typed slots，不能重建壳。

对外沟通时要把两件事拆开说明：legacy 宿主主树不能被当成 generic `@hiui-design/typical-page-shells` 直挂运行时，也不应把每页 carrier 作为接入手段。默认做法是通过 `typical-page:apply:legacy` 一次性接入 host contract、`HiuiLegacyPage` runtime、PageSpec 覆盖、adapter facts 与 runtime compatibility lock；业务页只能通过 `HiuiLegacyPage` 消费已编译 PageSpec 与 typed slots。`src/hiui-runtime` 是允许消费 `@hiui-design/typical-page-shells` 能力的受管边界；业务页不得 direct import shell 包。旧 page-component carrier 链路已删除，不作为迁移、fallback 或默认生成入口。

React 16.8 到 16.13.x 的 legacy 项目必须使用 `vendor/hiui-design-typical-page-shells-0.1.2-legacy.tgz`，不得直接安装现代 tarball；React 低于 16.8 时 `runtime-compatibility-lock.json` 必须阻断接入。pnpm 项目若系统 pnpm 要求 Node 18，接入链路使用 `npx pnpm@8.6.12 install` 作为安装 fallback。验收时使用 `typical-page:doctor:integration` 判断本次接入/当前页是否可继续，不把存量业务样式作为 hiui-design 接入或交付检查内容。回滚按 `docs/onboarding/legacy-host-compatible-rollback.md` 逐文件执行。

legacy 页面生成默认走轻量四步：`typical-page:apply:legacy`（默认 `--sync-profile minimal`）→ `typical-page:light-plan` → `typical-page:legacy:new|rewrite --plan <light-plan.json>` → `typical-page:legacy:accept --profile preview|delivery`。`hiui-light-page-plan.v1` 只是 `page-task-plan.v1` 的最小执行投影，不是新的平行顶层 contract；页面生成阶段不得绕过 plan 手写 `pageType/pagePath/change`，除非本地调试显式使用 `--unsafe-manual`，且该模式在 CI 或 `HIUI_DESIGN_DISALLOW_UNSAFE_MANUAL=1` 下必须阻断。验收状态分层为 `preview-ready` 与 `delivery-ready`：前者证明本地预览闭环，后者必须证明真实宿主 runtimeCapture、visualEvidence、domGeometry 与 adapterGate 通过；旧 `accepted` 只作为历史报告兼容别名。

基于 hiui-design 生成的典型页不得因 runtime、peer dependency、schema 或宿主兼容问题降级为原生手写 HiUI 页面，也不得把 `src/hiui-runtime/HiuiLegacyPage.tsx` 改成项目本地 primitive renderer 作为兼容 fallback。遇到运行时报错时只能修复官方受管 runtime、依赖解析、PageSpec 或 typed slots；官方 shell 在宿主依赖下不可用时，只能在 `src/hiui-runtime/adapters/**` 新增受管 runtime adapter 并写入 `.local-context/hiui-design/outputs/runtime-provider-contract.json`；若无法修复或声明 adapter，必须 blocked。不得删除 `page.instance.tsx` / `page.slots.ts` 后改写 `index.tsx` 为 `hiui5` primitive 页面，也不得在业务页内用 `hiui5` 的 `Table` / `Pagination` / `QueryFilter` / `PageHeader` 接管 `shell`、`header`、`white-body`、`query-filter`、`table`、`pagination`、`main-scroll` 等 locked regions。允许的宿主差异只能进入受管 adapter / managed component / shell carrier 边界，并由 runtime provenance、runtime provider contract、canonical shell binding 与 peer/export resolution 证明。

## Core Object Model

- `page-task-plan.v1` 是唯一执行计划与事实出口；AI 不手工拼 `mode`、`pageType`、`pageUnits`、`startFrom`、`requiredDocs`、`requiredActions` 或关键命令链。
- `generationRecipe` 作为 `page-task-plan.v1` 的增量子对象引入，不单独创建平行顶层 contract。
- `generationRecipe` 只描述装配顺序、资产映射、槽位边界、禁止动作与轻量一致性检查；不重复存储可由 `pageComponent`、`baseMoldId`、registry 或既有 contract 派生出的事实。
- `targetDeliverySemantics` 与 `currentExecutionState` 必须分层输出：前者回答“计划成立后应沿哪条受管生成主链落地”，后者回答“当前这一步允许执行什么”。legacy blocked 时，前者只能指向“项目接入链 `apply:legacy`（内部执行 `legacy:init`）+ 页面计划链 `light-plan` + 页面生成链 `legacy:new|rewrite --plan` + 接受态闭环 `legacy:accept`”的 PageSpec runtime 路径；后者必须先暴露 `ResolveBlockingFacts`，不得回退到旧 page-component carrier 主链。
- `editableSlots`、`lockedRegions`、`pageComponent`、`baseMoldId` 优先保持“引用或派生”，不复制进 planner。
- legacy 页面生成必须消费 `host-contract`、compiled PageSpec、`HiuiLegacyPage` runtime 与 typed page slots；不得通过已删除的 page-component carrier、外部矩阵或页面局部 renderer 重定义页面主链。
- project 级 `host pack` 是 legacy 接入的事实源；页面生成阶段不得复制 project-scoped page carrier，也不得把旧 carrier 认证字段平铺进每页合同。
- layout-critical facts，尤其 `header` 的 stretch owner、actions docking 与 vertical rhythm owner，属于 typical page contract 编译出的 PageSpec 与 runtime 共同消费的机器事实；不得退化成只存在于说明文档里的软建议，也不得后移成生成后的主流程证明。
- `acceptanceProfile`、`preflight-report.v1`、`hiui-page-governance-report.v1`、`finalReportContract` 继续保留，不降级、不移除。
- `requiredDocs` 是默认唯一补读来源；其最小结构固定为 `path`、`readMode`、`reason`。先读 `readMode=required`，`reference` / `conditional` 只在命中对应场景时补读。`requiredActions` 是默认唯一执行来源；没有结构化动作时，优先使用兼容命令字段，不自行扩展 gate。

对象模型与字段分级：`docs/generation/explainers/core-object-model.md`

## Standard Generation Protocol

`Standard Generation Protocol` 只回答 4 个问题：从什么骨架起步、关键 region 的装配顺序、哪些区域允许业务填充、关键步骤后做什么 `inlineChecks`。

`generationRecipe.required` 默认至少包含 `startingPoint`、`assemblyOrder`、`requiredAssets`、`forbiddenMoves`；`generationRecipe.optional` 可按页型与复杂度逐步补齐 `slotFillPolicy`、`regionOwnership`、`inlineChecks`。

第一批 recipe 只覆盖高频页型：`table-page`、`analytics-page`、`edit/detail-page`。

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
- 非开源版通过本 skill 新生成页面时，生成入口必须自动触发真实 usage 收口：`typical-page:generate`、`typical-page:analytics`、`typical-page:legacy:new`、`typical-page:legacy:rewrite` 写入页面后要自动调用 `typical-page:record-usage`，且不得带 `--dry-run`；`typical-page:start-page` 只能作为非 legacy 迁移期兼容或 maintainer-only 入口保留，不能作为 legacy 新页面生成入口；`--dry-run` 只能用于维护自检或 payload 预览，不能作为 `usageStatsStatus=completed` 的证据。缺 token、网络失败或服务端拒绝时必须以真实命令结果进入 pending / 授权补传链路，不能改用 dry-run 逃避上报。

## Generation Gates

- 生成前门禁：项目根、机器计划、能力画像、mode lock、pre-plan facts。
- 生成协议门禁：page-component 可用性、route ownership、slot 边界、shell / adapter 证明、analytics contract、业务内容边界、受控扩展。
- `legacy-host-compatible` 普通典型页的硬门禁真相统一收口到 `rules/legacy-host-hard-gates.json`：baseline 固定为 4 个硬门禁，命中 `header` 时再追加 `header-layout-proof` 条件门禁，因此当前常见典型页通常会落到 5 个有效硬门禁。`styleBoundary`、`portalBoundary`、`runtimeSmoke` 仍按风险触发；但 `header` 的 stretch / right-dock / rhythm owner 不再只是样式建议，缺少结构化证明时必须阻断主链路。
- `legacy-host-compatible` 下默认执行语义是 `host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots`。缺少 host contract、PageSpec、runtime binding、DOM region ownership 或视觉 token 作用域时，必须阻断生成输入；不得擅自降级到兼容手拼页、reference 默认翻译页、旧 page-component carrier 或自由 fallback。
- 前两层门禁属于“如何正确生成”的组成部分，不再和交付阻断口吻混写。
- `required` 级 `generationRecipe` 字段缺失时，不得假设或手工脑补；只能 blocked，或按计划明确给出的 fallback 执行。
- `startingPoint` 无法解析、`requiredAssets` 不可用、或 `assemblyOrder` 不完整时，不允许自由退回空白页手写。
- 只有当计划明确给出 `managed-fallback`、`host-archetype` 或 `reference-or-scaffold` 为合法 fallback 时，才允许降级生成。
- `optional` 字段缺失不自动阻断，但不得伪造填充；缺失时按页型默认策略或现有规则执行。

生成门禁细节：`docs/generation/explainers/generation-gates.md`

## Delivery Gates

- `preflight-report.v1` 与 `hiui-page-governance-report.v1` 继续是交付确认层核心判断对象。
- `acceptanceProfile` 决定验收范围；`formal acceptance` 是验收等级，不是生成链路。
- `finalReportContract` 继续保留，用于完整报告与下游兼容。
- 交付门禁只负责“是否允许宣告完成”，不再主导生成叙事。
- 若某类问题连续多次在 `DeliveryConfirmation` 阶段暴露，必须优先回灌到 `generationRecipe` 或 generation gates，而不是持续追加新的验收描述。

交付门禁细节：`docs/generation/explainers/delivery-gates.md`

## Runtime Protocol

- 运行时协议的唯一真相是 `rules/runtime-contract.md`；受管页面治理协议的唯一真相是 `rules/page-governance.md`。
- 旧 page-component carrier 矩阵已删除；legacy 默认生成不得读取旧矩阵、不得据此创建 `src/page-components`。
- `rules/legacy-host-hard-gates.json` 是 legacy 普通典型页硬门禁编排的唯一机器真相；`SKILL.md`、生成门禁说明和 planner 只引用它，不再各自手写门禁数量。
- 基础项目事实（mode、capabilities、route ownership、i18n、governance availability）与基础资产事实（certified page component、mold、adapter catalog）应由计划内部消费并通过 `facts`、`assetResolution`、`projectMode`、`targetPage.routeOwnership` 等字段暴露。
- `.local-context/hiui-design/outputs/project-integration-state.json` 与 `project-mode.json` 属于 project 级 runtime input facts；已接入项目应优先复用，只有缺失、损坏或冲突时才回退 host profile / mode detection。
- `legacy-host-compatible` 的 `runtimeIntegrationReady=true` 只表示 host contract、HiuiLegacyPage runtime 与 compiled PageSpec 链路可用；完整接入完成态仍以 `onboardingCompletionReady=true` / `integrationReady=true` 为准，不得再要求旧 required carrier batch ready 或旧 rollout 覆盖字段。
- project-scoped host pack facts 应在接入 / capabilities 阶段一次确认，页面生成阶段复用；Agent 只在 plan 缺失、冲突、排障或维护时显式读取 capabilities、mode lock、认证文件或 catalog。
- `host-qualification-facts.v1` 只是 runtime input facts contract，不是 execution plan；`runtime-smoke` 只记录当前源码快照证据，只有 `finalize-page` 可以把交付状态翻转为 `finalized`。

## Task Lifecycle

文档叙事层统一为：

`LocateProjectRoot -> PlanTask -> ResolveBlockingFacts -> BuildGenerationRecipe -> GenerateByRecipe -> InlineConformanceChecks -> DeliveryConfirmation -> OutputDeliverySummary`

- `PlanTask`：默认先消费项目级 integration facts，再补 capabilities / route / asset-resolution；不要把“确认仓库结构 / 确认是否已接入 hiui-design”当成每次页面任务的可见前置步骤。planner 默认还要把生成期与交付期动作拆成 `generationInputs`、`inlineChecks`、`deliveryChecks`，避免把重验收口径前移成生成指导。
- `PlanTask` 输出层必须同时暴露 `targetDeliverySemantics` 与 `currentExecutionState`：前者描述目标交付主链，后者描述当前允许动作、阻断相位与 blocker 优先级。`requiredCommands`、`requiredActions` 与 `canStartImplementation` 必须跟 `currentExecutionState` 一致，不得再让 blocked 计划对外看起来像可以直接开始页面生成。
- `PlanTask` 对 legacy 普通典型页的首要职责之一，是把 “禁止 legacy 主树 ad hoc 直挂 standard shell” 与 “允许通过 HiuiLegacyPage runtime 统一承载现有典型页壳” 同时暴露清楚；不得把 direct shell import 不成立，回退表达成旧 page-component carrier、兼容手拼或通用 fallback。
- 若项目级 integration facts 已存在但 `integrationReady=false`，`PlanTask` 必须 fail closed，
  直接回显接入阻断原因；不要再尝试把页面生成、起手 scaffold 或页面级 preflight 当成接入 /
  legacy lightweight contract 完整性的补救路径。页型级 `page-component` 资产是否 ready，继续由 planner 的
  `assetResolution` / `projectTypicalPageSupport` 独立判断，而不是反写成通用 integration debt。
- 当 `integrationReady=false` 的原因来自 legacy required rollout 未完成时，`PlanTask` 默认应把
  `bootstrap-target-project` 放在 `ResolveBlockingFacts` 队首；这表示当前项目的 legacy 接入 /
  bootstrap 还未完成，而不是“已接入项目在页面阶段追加一个 rollout 步骤”。若同时命中 route
  ownership blocker，再在其后追加 route 修复动作，不得跳过项目级 host contract / boundary 接入直接进入页面实现。
- `BuildGenerationRecipe`：把 `generationStrategy` 转化为标准装配协议。
- `GenerateByRecipe`：生成行为必须遵循 `assemblyOrder`、`requiredAssets`、`forbiddenMoves`；不允许自由发明页壳、region owner、slot 顺序。
- `InlineConformanceChecks`：关键装配步骤后的轻量一致性检查，不把重验收前移。
- `DeliveryConfirmation`：末端确认层，内部继续承接 `WriteContract`、`Preflight`、`PreviewReady`、`FormalAcceptance`、`RuntimeGovernance`，以及按 workspace policy 收口的 `UsageStats`。若工作区已启用 mandatory usage reporting，就不能把它当成可选后置项。
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
- 接入同步闭包：`config/sync-profile-contracts.json`、`config/vendor-tarballs.manifest.json`、`docs/onboarding/sync-profile-contracts.md`
- 运行时协议：`rules/runtime-contract.md`
- 页面任务生命周期：`rules/page-task-lifecycle.md`
- 失败恢复矩阵：`rules/failure-matrix.md`
- 生成约束：`rules/generation-rules.md`
- 数据可视化主次/样式机器策略：`rules/chart-semantic-policy.json`、`rules/data-visualization-layout-policy.json`
- 页面组件与模具注册表：`rules/page-component-registry.json`、`rules/page-mold-registry.json`
- legacy lightweight contracts：`rules/host-contract.schema.json`、`rules/typical-page-contract.schema.json`、`rules/typical-page-contracts/`，用于 host contract、typical page contract、boundary 与 slot schema 校验。
- legacy hard gates：`rules/legacy-host-hard-gates.json`
- runtime 交付策略：`rules/runtime-delivery-policy.json`
- 轻量场景路由：`rules/scenario-routing.json`
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
