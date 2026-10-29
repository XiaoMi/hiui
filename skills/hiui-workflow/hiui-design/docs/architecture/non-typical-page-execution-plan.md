# 非典型页面完整能力实施方案

## 1. 目标与边界

### 1.1 目标

本方案用于把 `hiui-design` 的 `non-typical-page` 从“生成前决策能力”推进到“受支持范围内的完整生成能力”。

状态说明：

- 当前仓库内，planner、brief、family-specific generator、runtime primitives、light sanity 与 capability report 已接入主链路
- 当前对外已对 validated v1 scope 在 `docs/generation/page-family-workflows.manifest.json` 中声明 `generatorReady=true`
- 因此本文件既保留实施设计，也承担“哪些步骤已完成、哪些边界仍保持关闭”的收口职责

这里的“完整生成能力”限定为：

- 可完成 family 级判型
- 可形成可执行 brief
- 可进入 family-specific generator
- 可输出正式业务页面代码
- 可完成轻量 sanity
- 可明确 stop / fallback

### 1.2 首版支持范围

首版只支持以下范围：

- 输入方式：`page-prompt`、`prototype-screenshot`、`figma-design-restore`
- 项目模式：`host-integration`、`rules-only`
- 页面场景：新页面生成
- 内部协调模式（machine term: `archetype`）：`process-stage-sync`、`selection-detail-sync`

设计还原补充：

- 当输入方式为 `figma-design-restore` 时，执行前必须先拿到 `confirmedDesignRestoreInput`
- 当 `confirmedDesignRestoreInput.restoreDecisionPackage` 已经明确指向 `non-typical-page` 时，上游 `brief / plan / generate` 链允许自动补齐缺失的 `page-family`
- `design-screenshot-restore` 仍保留为第二阶段降级入口，不作为当前公开执行范围
- 这里的 `confirmedDesignRestoreInput` 负责携带设计证据、目标状态与 `restoreDecisionPackage`，而不是让 family workflow 在缺少前置决策时临场补猜

### 1.3 首版非目标

首版明确不支持：

- `legacy-system-reconstruction`
- 第三方复杂画布 / 图形引擎页面
- 未经样本验证的新协调模式
- 脱离 HiUI5 与 `local-managed-runtime` 的自由页面生成

## 2. 当前问题

### 2.1 已完成能力

当前已经具备：

- family-specific AI 前置引导
- 最小 contract
- few-shot 判型包
- 统一对话输出模板
- 样本验证模板与首轮样本结果
- family-specific workflow manifest
- family-specific execution brief
- family-specific generator
- family-specific runtime primitives
- family-specific sanity check
- family-level capability report

### 2.2 当前剩余缺口

当前仍缺少或仍未对外放开的内容：

- 文档入口的持续收口，避免继续沿用“generator 尚未接通”的旧说法
- `legacy-system-reconstruction` 的二阶段执行合同

当前已经补齐的事实：

- 真实 target project `mit-design` 已完成 `scripts/validate-non-typical-real-project.mjs` 验收
- 正样本写页、边界 stop、负样本回退均已通过真实宿主验证
- project check 已具备内置 `auto` 轻量策略，可在满足 Node policy 时执行 `tsc --noEmit + 隔离输出目录 vite build`

### 2.3 根因

当前主链路以 `generationContract.baseTemplatePath + requiredShell + businessSlots` 为中心，天然偏向模板驱动。
非典型页面的本质不是“新增一个模板页型”，而是“在共享壳层原语与设计系统约束下，由 rules-composition 生成页面主工作区”。
这层设计系统约束不仅包含页头、白底主体和组件语义，也包含字体、颜色、间距，以及页面中的数据图表主题与图表卡节奏。
因此不能继续通过新增模板页型的方式补能力，必须新增 family-specific execution path。

### 2.4 当前对外状态

当前应统一为以下口径：

- `non-typical-page` 已具备 validated v1 scope 的对外公开开放能力
- `non-typical-page` 仍未具备全量场景的对外正式开放能力
- 对外是否开放，只看 `page-family-workflows.manifest.json` 的 `generatorReady`
- validated v1 scope 之外的能力仍必须继续 fail closed

## 3. 目标架构

首版非典型页面完整能力固定为如下链路：

`input -> shared guidance facts -> family classification -> supported coordination pattern (machine term: archetype) -> nonTypicalExecutionBrief -> primitive composition -> light sanity -> project integration`

其中：

- `input`
  支持 `page-prompt / prototype-screenshot / figma-design-restore`
- `shared guidance facts`
  先抽统一页头、唯一 `whiteBody`、主阅读流、区域角色、设计系统与图表主题约束
- `family classification`
  继续复用 shared guidance + conversation output template；few-shot 只在边界不清时介入
- `supported coordination pattern`
  首版只允许 `process-stage-sync / selection-detail-sync`
- `nonTypicalExecutionBrief`
  作为 generator 的直接输入
- `primitive composition`
  不依赖页面模板，而依赖共享壳层原语
- `light sanity`
  只保留 family-specific 红线，不引入重校验

## 4. 分阶段实施

### 阶段 P0：冻结首版范围

#### 目标

统一对外口径，避免首版能力边界漂移。

#### 修改文件

- `docs/architecture/hiui-design-v2-overview.md`
- `docs/generation/non-typical-page-contract.json`

#### 任务

- 明确“非典型页面完整能力 v1”的支持范围与非目标
- 在 contract 中补：
  - `supportedArchetypes`
  - `supportedInputModes`
  - `unsupportedScenarios`
  - `generatorReady`
  - `legacyRefactorReady`

#### 输入

- 当前非典型页面 contract
- 当前 few-shot 样本

#### 输出

- 冻结后的首版能力边界

#### 验收标准

- 文档与 contract 对支持范围表述一致
- `legacy-system-reconstruction` 仍为关闭态

### 阶段 P1：新增 family workflow manifest

#### 目标

为非典型页面建立机器可读执行合同。

#### 新增文件

- `docs/generation/page-family-workflows.manifest.json`
- `docs/generation/non-typical-workflow-archetypes.json`

#### 字段要求

`page-family-workflows.manifest.json` 至少包含：

- `pageFamily`
- `workflowId`
- `generatorMode`
- `briefMode`
- `supportedArchetypes`
- `requiredDecisionFields`
- `designSystemPolicy`
- `lightSanityChecks`
- `blockedConditions`

说明：

- `supportedArchetypes` 是当前 machine-readable schema 的字段名，但其语义应解释为“内部协调模式白名单”，不是页面模板目录

`non-typical-workflow-archetypes.json` 至少包含：

- `archetypeId`
- `label`
- `requiredPrimitives`
- `requiredRegions`
- `coordinationSchema`
- `primaryRegionRule`
- `stopRules`

说明：

- 本文件中的 `archetype` 表示 rules-composition 所用的内部协调 schema，不是截图样本归纳出的页面模板

#### 首版注册内容

- `process-stage-sync`
- `selection-detail-sync`

#### 验收标准

- 非典型页面可被机器识别为 family workflow，而不是 page type template
- 未注册 archetype 必须 fail closed

### 阶段 P2：接通 planner / brief

#### 目标

让 `plan-page-task` 与 `load-generation-brief` 能输出 `nonTypicalExecutionBrief`。

#### 修改文件

- `scripts/lib/load-generation-brief.mjs`
- `scripts/plan-page-task.mjs`
- `scripts/lib/page-family-contract.mjs`

#### 任务

- 增加 `loadPageFamilyWorkflowManifest()` 能力
- 在 `pageFamily=non-typical-page` 且 archetype 已支持时，不再直接 fail closed
- 新增 `nonTypicalExecutionBrief` 结构
- 保留 `partial` / `no` 边界停止机制

#### `nonTypicalExecutionBrief` 最小结构

```json
{
  "pageFamily": "non-typical-page",
  "workflowId": "non-typical-rules-composition",
  "archetypeId": "process-stage-sync",
  "classification": {},
  "nonTypicalDecisionPackage": {},
  "primitivePlan": {},
  "coordinationBindings": {},
  "integrationPlan": {},
  "lightSanityPlan": {}
}
```

#### 验收标准

- 正样本可输出 family brief
- `方案一` 这类边界样本必须输出 `stop-at-boundary`
- `业务规模` 必须回退到 `analytics-page`

### 阶段 P3：新增 family-specific generator

#### 目标

使非典型页面能从 family brief 落到页面源码。

#### 实施方式

推荐新增独立脚本：

- `scripts/generate-non-typical-page-from-brief.mjs`

主生成器通过 `workflowId` 或 `pageFamily` 分流调用。

#### 修改文件

- `scripts/generate-page-from-brief.mjs`
- `scripts/generate-non-typical-page-from-brief.mjs`（新增）

#### 生成原则

- 统一 `PageHeader`
- 统一 `whiteBody`
- 使用受控 primitives 组合页面主结构
- 不允许空白页自由拼装
- 不允许第二套本地设计系统

#### 生成器输出内容

- `index.tsx`
- `index.module.scss`
- `hiui-pagegen.meta.json`

#### 验收标准

- 两个正样本能稳定生成页面骨架
- 输出代码中能追溯 `primaryRegion`、`stableRegions`、`coordinationModel`

### 阶段 P4：沉淀 runtime primitives

#### 目标

把非典型页面运行时从“自由拼装”收敛为“受控原语组合”。

#### 新增文件建议

- `examples/host-integration/src/components/hiui-design-runtime` 内扩展，并由生成链物化到目标项目的 `src/components/hiui-design-runtime`，或
- `src/runtime/non-typical-primitives/**`

#### 首版 primitives

- `NonTypicalPageFrame`
- `WhiteBodyWorkspace`
- `SelectionPane`
- `StageRail`
- `SnapshotPane`
- `SectionGroup`
- `ActionStrip`

#### 约束

- 优先封装已有 `local-managed-runtime`
- 不新造第二套 UI 基础库
- token 与 spacing 继续回指 HiUI5 / hiui-design

#### 验收标准

- 不再依赖大量无语义 `div/span + className` 组合主结构
- 两个 archetype 都可由 primitives 拼出

### 阶段 P5：新增 family-specific sanity

#### 目标

建立非典型页面最小红线，不引入重校验。

#### 新增文件

- `scripts/lib/non-typical-page-sanity.mjs`

#### 检查项

- 唯一 `PageHeader`
- 唯一 `whiteBody owner`
- 唯一 `primaryRegion`
- `stableRegions / mutableRegions` 已声明
- `coordinationModel` 已声明
- 无未批准 token
- 无第二套视觉系统
- `partial` 样本必须 stop

#### 修改文件

- `scripts/generate-non-typical-page-from-brief.mjs`
- `scripts/generate-page-from-brief.mjs`

#### 验收标准

- 正样本 pass
- 边界样本 blocked
- 分析页样本回退

### 阶段 P6：扩展 capability report

#### 目标

让外部能明确分辨“前置能力”和“完整能力”。

#### 修改文件

- `scripts/lib/page-type-capability-report.mjs`

#### 新增报告字段

- `pageFamilyCapabilityReport`
- `supportedArchetypes`
- `generatorReady`
- `legacyRefactorReady`
- `blockedBy`
- `familyWorkflowStatus`

#### 验收标准

- 报告可以明确显示 `non-typical-page` 是否 generator-ready
- 报告可以区分“支持对话决策”与“支持完整生成”

### 阶段 P7：样本回归与发布准入

#### 目标

把首版能力收敛成可发布标准，而不是“主观感觉可用”。

#### 回归样本

- 正样本：
  - `确认订单信息`
  - `机构售卖单管理`
- 负样本：
  - `业务规模`
- 边界样本：
  - `方案一 / 车辆列表`

#### 回归检查点

- family classification 是否稳定
- brief 是否稳定
- generator 是否只对 `yes` 放行
- `partial / no` 是否正确 stop 或 fallback

#### 发布准入标准

- `plan-page-task` 能输出 `nonTypicalExecutionBrief`
- generator 能落出代码
- 2 个正样本能走通
- 1 个边界样本和 1 个负样本能正确 stop / fallback
- 默认不依赖重校验
- capability report 与文档口径一致

### 阶段 P8：第二阶段再支持 legacy reconstruction

#### 目标

在首版稳定后，再开放旧系统重构。

#### 新增内容

- `nonTypicalRefactorContract`
- `nonTypicalRefactorViewModel`
- family-specific migration invariant

#### 约束

- 未完成前，`legacy-system-reconstruction` 必须继续 fail closed
- 不得复用 `pageAdjustmentContract` 直接承载非典型页面重构

## 5. 研发任务拆解

| 编号 | 阶段 | 任务 | 主要文件 | 输出 | 验收 |
| --- | --- | --- | --- | --- | --- |
| T01 | P0 | 冻结首版能力边界 | `docs/architecture/hiui-design-v2-overview.md` `docs/generation/non-typical-page-contract.json` | 首版范围文档与 contract | 口径一致 |
| T02 | P1 | 新增 page family workflow manifest | `docs/generation/page-family-workflows.manifest.json` | family workflow manifest | 可表达 family workflow |
| T03 | P1 | 新增协调模式 manifest | `docs/generation/non-typical-workflow-archetypes.json` | machine-readable coordination contract | 只支持 2 个内部协调模式 |
| T04 | P2 | brief 加载器接通 family workflow | `scripts/lib/load-generation-brief.mjs` | `nonTypicalExecutionBrief` | 正样本可出 brief |
| T05 | P2 | planner 输出 family 计划 | `scripts/plan-page-task.mjs` | planner 支持非典型页面 | 边界样本 stop |
| T06 | P2 | page family contract 扩展字段 | `scripts/lib/page-family-contract.mjs` | family execution metadata | 非典型 family 可被 planner 使用 |
| T07 | P3 | 新增非典型页面生成器 | `scripts/generate-non-typical-page-from-brief.mjs` | family-specific generator | 可生成骨架代码 |
| T08 | P3 | 主生成器增加分流 | `scripts/generate-page-from-brief.mjs` | workflow 路由 | family 分流稳定 |
| T09 | P4 | 原语层实现 | `src/runtime/non-typical-primitives/**` 或 vendor 扩展 | runtime primitives | 2 个内部协调模式可复用 |
| T10 | P5 | 新增 family sanity | `scripts/lib/non-typical-page-sanity.mjs` | light sanity | 正样本 pass / 边界 blocked |
| T11 | P6 | capability report 扩展 | `scripts/lib/page-type-capability-report.mjs` | family capability report | 可见 generator-ready |
| T12 | P7 | 样本回归固定化 | `docs/generation/non-typical-sample-batch-round-1.md` 及回归脚本 | 回归样本集 | 判型不漂移 |
| T13 | P8 | legacy reconstruction 二阶段设计 | 新增 contract / view model 文件 | 二阶段设计稿 | 首版后再排期 |

## 6. 里程碑建议

### 里程碑 M1

- 完成 P0、P1、P2
- 能输出 `nonTypicalExecutionBrief`
- 但还不能正式对外宣称“已具备完整生成能力”

### 里程碑 M2

- 完成 P3、P4、P5
- 两个正样本可端到端生成
- 可对外宣称“首版完整生成能力已就绪”

### 里程碑 M3

- 完成 P6、P7
- 报告、样本回归、发布准入全部接通
- 能稳定发布

### 里程碑 M4

- 启动 P8
- 评估是否开放 `legacy-system-reconstruction`

## 7. 风险控制

- 不得把非典型页面重新模板化为新的 `pageType`
- 不得把内部协调模式误读成页面模板枚举
- 不得在首版扩展到未验证协调模式
- 不得为了首版通过而引入重截图 diff / 重 DOM diff
- 不得绕开 `partial` 边界 stop 机制
- 不得引入第二套本地视觉系统

## 8. 发布口径

只有同时满足以下条件，才能对外表述“已具备非典型页面完整能力（首版）”：

- 支持范围已明确冻结
- planner 可输出 `nonTypicalExecutionBrief`
- generator 可落出代码
- family sanity 已接通
- 2 个正样本通过
- 1 个边界样本与 1 个负样本正确 stop / fallback
- capability report 能反映 family-ready 状态

当前对外应表述为：

- “已具备非典型页面 validated v1 scope 的完整生成能力”
- “已具备非典型页面的规则驱动 family-specific generator 主链路”
- “legacy reconstruction 与未验证协调模式仍未对外开放”

## 9. 术语迁移

执行层中 `archetype*` 到 `coordinationPattern*` 的渐进迁移，不在本方案里直接硬切。

迁移原则、兼容层状态与零停机检查项见：

- `docs/architecture/non-typical-terminology-migration-plan.md`
