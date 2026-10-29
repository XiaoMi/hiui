# 非典型页面术语迁移计划

## 1. 目标

本文件用于把 `non-typical-page` 执行层中的历史术语 `archetype*`，逐步迁移为更准确的 `coordinationPattern*` 语义，同时保证现有 brief / planner / contract / manifest 链路零停机。

本计划解决的是：

- 哪些 `archetype*` 术语属于非典型页面执行层的历史命名债务
- 哪些位置已经具备兼容别名，可进入渐进迁移
- 哪些位置暂时不能改名，否则会打断现有机器契约

本计划不解决的是：

- 直接删除全部 legacy 字段
- 在本轮内升级所有 schema 名、文件名和函数名
- 把分析页图表布局中的 `selectedChartArchetype` 一并强行改名

## 2. 当前结论

### 2.1 已完成的兼容层

当前仓库已经具备一层零风险兼容能力：

- 读取侧接受 `coordinationPatternId` 作为 `archetypeId` 的别名输入
- 规范化后，`coordinationModel.type` 与 `coordinationModel.coordinationPatternId` 会自动对齐
- brief 输出同时包含：
  - legacy：`archetypeManifestPath`、`archetype.archetypeId`
  - alias：`coordinationPatternManifestPath`、`coordinationPattern.coordinationPatternId`
- workflow manifest 与 contract 同时包含：
  - `supportedArchetypes`
  - `supportedCoordinationPatterns`

### 2.2 当前迁移原则

- 对外文档优先使用“内部协调模式”或 `coordinationPattern`
- 现有 machine-readable 字段保持兼容输出，不做一次性硬切
- 新接入方优先消费 alias 字段
- 旧调用方继续可用，不因命名迁移中断

## 3. 术语分层

### 3.1 应迁移的历史术语

以下术语属于 `non-typical-page` 执行层历史命名，应逐步迁移为 `coordinationPattern*`：

- `supportedArchetypes`
- `archetypeId`
- `archetypeManifestPath`
- `getNonTypicalWorkflowArchetype`
- `non-typical-workflow-archetypes.json`
- `workflow archetype is not registered`

### 3.2 不应混改的同名术语

以下术语虽然包含 `archetype`，但不属于 `non-typical-page` 协调模式迁移范围，不应与本计划混做：

- `selectedChartArchetype`
- `switch-archetype`
- `docs/generation/figma-pages/data-visualization.md` 中的图表布局 archetype

原因：

- 这些术语服务的是分析页图表布局收口，不是非典型页面 family 的协调模式命名
- 若强行同批次改名，会把两套不同概念混在一起，增加迁移风险

## 4. 当前暴露面盘点

### 4.1 外部机读事实源

- `docs/generation/page-family-workflows.manifest.json`
  当前保留 `supportedArchetypes`，并已新增 `supportedCoordinationPatterns`
- `docs/generation/non-typical-page-contract.json`
  当前保留 `supportedArchetypes`，并已新增 `supportedCoordinationPatterns`
- `docs/generation/non-typical-workflow-archetypes.json`
  当前保留 `archetypeId`，并已新增 `coordinationPatternId`

### 4.2 执行层模块

- `scripts/lib/load-page-family-workflow-manifest.mjs`
  仍保留 `loadNonTypicalWorkflowArchetypes()` / `getNonTypicalWorkflowArchetype()` 命名
- `scripts/lib/non-typical-family-brief.mjs`
  仍保留 `archetype` 变量与 legacy 输出，但已支持 `coordinationPatternId`
- `scripts/lib/load-generation-brief.mjs`
  仍向外透传 `archetypeManifestPath`，同时已新增 `coordinationPatternManifestPath`
- `scripts/lib/page-family-contract.mjs`
  仍保留 `archetypeManifestPath`，同时已新增 `coordinationPatternManifestPath`

### 4.3 文档与说明

对外文档已基本完成收口：

- `archetype` 已被限制为 machine term
- 共享事实层已提升为 `shared-page-design-guidance`
- `few-shot` 已降级为边界证据，不再是模板来源

### 4.4 人类可读输出入口

以下入口已经进入“alias 主字段”状态，应视为 `coordinationPattern*` 优先消费面：

- `scripts/lib/load-generation-brief.mjs`
  Markdown 摘要已优先展示：
  - `coordinationPatternId`
  - `coordinationPatternManifestPath`
  - `supportedCoordinationPatterns`
  同时仍保留：
  - `legacyArchetypeId(alias)`
  - `legacyArchetypeManifestPath(alias)`
- `scripts/plan-page-task.mjs`
  计划摘要已优先展示：
  - `coordinationPatternId`
  - `coordinationPatternManifestPath`
  同时仍保留：
  - `legacyArchetypeId(alias)`
- `scripts/lib/load-page-family-workflow-manifest.mjs`
  非命中报错已改为：
  - `Unknown non-typical coordination pattern "..."`
  并在文案中标注：
  - `(legacy archetype alias)`

结论：

- 这些入口不再适合新增仅依赖 `archetype*` 的消费逻辑
- 新的报告、调试输出和人工 review 文案，应默认复用 `coordinationPattern*`

### 4.5 测试与内部消费者

当前仍以 `archetype*` 为主断言或主命名的消费者，属于“下一阶段优先清理对象”：

- `scripts/tests/load-page-family-workflow-manifest.test.mjs`
  仍主断言：
  - `supportedArchetypes`
  - `archetypeManifestPath`
  - `getNonTypicalWorkflowArchetype(... archetypeId)`
  - legacy 报错文案
- `scripts/tests/non-typical-brief.test.mjs`
  仍主断言：
  - `brief.nonTypicalExecutionBrief.archetype.archetypeId`
- `scripts/tests/non-typical-plan-page-task.test.mjs`
  仍主断言：
  - `plan.nonTypicalExecutionBrief.archetype.archetypeId`
- `scripts/tests/generation-brief-family.test.mjs`
  仍主断言：
  - `brief.nonTypicalExecutionBrief.archetype.archetypeId`
- `scripts/tests/non-typical-brief-guard.test.mjs`
  仍主断言 legacy 报错：
  - `Unknown non-typical workflow archetype`
- `scripts/tests/non-typical-readiness-consistency.test.mjs`
  仍主断言：
  - `familyContract.archetypeManifestPath`

内部实现层仍保留 `archetype*` 命名，但这些位置当前属于“兼容层或内核名”，不应与对人输出入口混淆：

- `scripts/lib/non-typical-family-brief.mjs`
- `scripts/lib/load-page-family-workflow-manifest.mjs`
- `scripts/lib/page-family-contract.mjs`
- `docs/generation/non-typical-workflow-archetypes.json`

迁移角色划分：

- `human-output-primary-switched`
  - `scripts/lib/load-generation-brief.mjs`
  - `scripts/plan-page-task.mjs`
- `legacy-required-machine-contract`
  - `docs/generation/page-family-workflows.manifest.json`
  - `docs/generation/non-typical-page-contract.json`
  - `docs/generation/non-typical-workflow-archetypes.json`
  - `scripts/lib/non-typical-family-brief.mjs`
  - `scripts/lib/page-family-contract.mjs`
- `future-hard-rename-candidate`
  - `getNonTypicalWorkflowArchetype`
  - `loadNonTypicalWorkflowArchetypes`
  - `archetypeManifestPath`
  - `supportedArchetypes`
  - `docs/generation/non-typical-workflow-archetypes.json`

## 5. 渐进迁移阶段

### 阶段 A：兼容并存期

当前状态已进入本阶段。

目标：

- 新旧字段同时可读
- 新旧字段同时可见
- 文档统一优先推荐 `coordinationPattern*`

完成标准：

- 新接入调用方只使用 alias 字段时，brief 仍可成功生成
- 旧调用方只使用 legacy 字段时，行为不变

### 阶段 B：alias 主字段期

当前已部分进入本阶段。

目标：

- 对外示例、文档和调试输出优先展示 `coordinationPattern*`
- legacy 字段降级为兼容附带字段

建议动作：

- 新增或调整示例对象时，优先展示 `coordinationPatternId`
- 新增 debug / report 输出时，优先展示 `coordinationPattern*`
- 将错误信息中的 `workflow archetype` 文案逐步迁成 `workflow coordination pattern`
- 将关键测试从“只断言 legacy 字段”改为“优先断言 alias，并保留 legacy 兼容断言”

### 阶段 C：内部函数重命名期

本阶段需要单独评估，不建议与业务改动混做。

目标：

- 将内部函数和文件名从 `archetype*` 迁到 `coordinationPattern*`

候选项：

- `getNonTypicalWorkflowArchetype()` -> `getNonTypicalCoordinationPattern()`
- `loadNonTypicalWorkflowArchetypes()` -> `loadNonTypicalCoordinationPatterns()`
- `non-typical-workflow-archetypes.json` -> 保留旧文件并增加新文件名，或引入 loader 兼容层

风险：

- 这一步会影响 import 路径、报错文本、测试快照和外部工具依赖
- 必须在兼容层稳定后单独推进

### 阶段 D：legacy 字段退场期

当前不建议立即进入。

只有满足以下条件才可考虑：

- 所有内部消费者已切到 `coordinationPattern*`
- 所有对外文档与示例已不再展示 legacy 字段
- 已有版本窗口允许破坏性或半破坏性迁移

## 6. 零停机检查清单

在每一轮迁移里，至少检查以下事项：

- 只传 `coordinationPatternId` 是否仍能命中正确协调模式
- `nonTypicalExecutionBrief` 是否仍同时输出 legacy 与 alias 字段
- `supportedCoordinationPatterns` 与 `supportedArchetypes` 是否保持同值
- `coordinationModel.type` 与 `coordinationModel.coordinationPatternId` 是否保持一致
- 旧错误路径是否仍可定位到 manifest / contract / brief 真正来源
- 是否误伤分析页图表布局相关的 `selectedChartArchetype`

## 7. 当前建议

当前建议更新为“阶段 A 完成，阶段 B 已开始，但尚未完成”。

原因：

- 执行链路已经具备安全兼容层
- 人类可读摘要入口已开始切到 `coordinationPattern*`
- 继续强推字段删除不会带来实质收益，反而会增加破坏风险
- 下一步最合理的是先清理测试与次级消费面，再决定是否进入内部函数重命名

## 8. 关联文件

- `docs/generation/page-family-workflows.manifest.json`
- `docs/generation/non-typical-page-contract.json`
- `docs/generation/non-typical-workflow-archetypes.json`
- `scripts/lib/load-page-family-workflow-manifest.mjs`
- `scripts/lib/non-typical-family-brief.mjs`
- `scripts/lib/load-generation-brief.mjs`
- `scripts/lib/page-family-contract.mjs`
- `docs/architecture/non-typical-page-execution-plan.md`
