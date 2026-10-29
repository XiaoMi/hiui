# design-restore 首轮样本回归（Round 1）

## 1. 本轮目标

- 验证目的：用仓内自动化样本把 `design-restore` 的典型页、非典型页和边界局部改造三条主路径收口成可追溯回归记录。
- 样本数量：3
- 样本来源：`scripts/tests/design-restore-main-chain.test.mjs` 中的结构化 `confirmedDesignRestoreInput` 样本。

说明：

- 本轮记录对应仓内自动化回归，不宣称替代真实项目联调或真实 Figma 在线验收。
- 但每个样本都已经覆盖“输入证据 -> 决策结果 -> 目标链路 -> 生成结果 -> 轻守门结论”闭环，可作为主链行为留痕。

## 2. 样本列表

| 样本 | 页面名称 | 输入方式 | 设计证据 | 预期归类 | 主任务摘要 |
| --- | --- | --- | --- | --- | --- |
| A | 设计还原自动路由表格页 | `figma-design-restore` | 结构化 Figma 节点样本，含指标区、筛选区、表格区 | `typical-page / table-stat` | 指标卡 + 筛选 + 表格的一体化列表页 |
| B | 设计还原自动路由非典型页 | `figma-design-restore` | 结构化 Figma 节点样本，含阶段轨、主工作区、快照区 | `non-typical-page` | 围绕单个订单完成阶段式核查与确认 |
| C | 设计还原受控偏离表格页 | `figma-design-restore` | 结构化 Figma 节点样本，含筛选区、表格区与额外说明区诉求 | `typical-page / table-basic + local adjustment` | 保持普通表格主结构，在白底主体顶部补一块受控说明区 |

## 3. 单样本结果摘要

| 样本 | 决策结果 | 目标链路 | 生成结果 | 轻守门结论 | 自动化依据 |
| --- | --- | --- | --- | --- | --- |
| A | 自动命中 `table-stat` | `standard-template-direct-output` | `written` | `generatedOutputSanity.ok = true`，`preWriteDecisionSanity.ok = true` | `design-restore-main-chain.test.mjs` |
| B | 自动命中 `non-typical-page` | `non-typical family rules-composition` | `completed` | `lightSanity.status = pass` | `design-restore-main-chain.test.mjs` |
| C | 自动命中 `table-basic`，并进入 `pageAdjustmentContract` | `base-template-local-adjustment` | `written` | `pageAdjustmentExecution.status = ready`，`preWriteDecisionSanity.ok = true` | `design-restore-main-chain.test.mjs` |

## 4. 单样本记录

### 样本 A：设计还原自动路由表格页

#### 输入证据

- `inputMode`：`figma-design-restore`
- 证据类型：结构化 Figma 节点样本
- 关键区域：
  - `metric-summary`
  - `query-filter`
  - `data-table`
- 目标状态：桌面端默认态

#### 决策结果

- `restoreDecisionPackage.pageGoal`：查看订单统计并继续查询列表
- `designRestoreRoutingDecision.selector`：`page-type / table-stat`
- 决策依据：指标区、筛选区、表格区同时存在，且主任务仍是列表经营与数据查看

#### 目标链路

- `pageFamily`：`typical-page`
- `pageType`：`table-stat`
- `generationPath`：`standard-template-direct-output`

#### 生成结果

- `generate-page-from-brief.mjs` 已成功写入
- 输出状态：`written`
- 输出页型：`table-stat`

#### 轻守门结论

- `generatedOutputSanity.ok = true`
- `preWriteDecisionSanity.ok = true`
- 结论：该样本支持当前 design-restore 直连典型页主链

### 样本 B：设计还原自动路由非典型页

#### 输入证据

- `inputMode`：`figma-design-restore`
- 证据类型：结构化 Figma 节点样本
- 关键区域：
  - `stage-navigation`
  - `primary-workspace`
  - `snapshot-panel`
- 目标状态：桌面端默认态

#### 决策结果

- `restoreDecisionPackage.pageGoal`：围绕单个订单完成阶段式核查与确认
- `designRestoreRoutingDecision.selector`：`page-family / non-typical-page`
- 决策依据：多个稳定区域共同承担主任务，且阶段轨稳定驱动主区与快照区

#### 目标链路

- `pageFamily`：`non-typical-page`
- `generationPath`：`non-typical family rules-composition`
- `restorePrimitivePlan.regionBindings`：非空

#### 生成结果

- `execute-non-typical-page-task.mjs` 已完成 `plan -> generate -> light sanity`
- 输出状态：`completed`
- 执行阶段：`completed`

#### 轻守门结论

- `lightSanity.status = pass`
- 关键贴稿区域已通过 `restorePrimitivePlan` 进入区域原语绑定
- 结论：该样本支持当前 design-restore 进入非典型页正式主链

### 样本 C：设计还原受控偏离表格页

#### 输入证据

- `inputMode`：`figma-design-restore`
- 证据类型：结构化 Figma 节点样本
- 关键区域：
  - `query-filter`
  - `data-table`
  - 额外说明区诉求
- 目标状态：桌面端默认态

#### 决策结果

- `restoreDecisionPackage.pageGoal`：在列表页顶部补充一块设计稿要求的受控说明区
- 路由结果：`page-type / table-basic`
- 偏离建模：`pageAdjustmentContract`
- 偏离区域：`whiteBody top controlled region`

#### 目标链路

- `pageFamily`：`typical-page`
- `pageType`：`table-basic`
- `generationPath`：`base-template-local-adjustment`

#### 生成结果

- `generate-page-from-brief.mjs` 已成功写入
- 输出状态：`written`
- 生成代码中存在 `Hiui5PageAdjustmentRegion`
- `hiui-pagegen.meta.json` 已记录 `pageAdjustmentContract.basePageType = table-basic`

#### 轻守门结论

- `pageAdjustmentDecision.status = ready`
- `pageAdjustmentExecution.status = ready`
- `pageAdjustmentExecution.selectedRegion = whiteBody top controlled region`
- `preWriteDecisionSanity.ok = true`
- 结论：该样本证明 design-restore 下的典型页贴稿偏离，已经能够在受控区域内落到 `base-template-local-adjustment`

## 5. 当前结论

- `design-restore` 已具备三类可追溯样本：
  - 直连典型页
  - 直连非典型页
  - 典型页受控偏离
- 当前仓内主链已经不再只停留在“规则说明”层，而是具备实际自动化回归留痕。
- 后续若补真实项目或真实在线 Figma 样本，应继续沿用本文件字段，而不是另起一套记录口径。
