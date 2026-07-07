# Acceptance Matrix

本矩阵定义 `hiui-page-workflow` 的验收等级。所有等级都必须遵守生成输入门禁：

- 进入页面规划 / 生成前，`generationInputGate.status` 必须是 `confirmed` 或 `assumption-authorized`。
- 用户只表达“生成 / 继续 / 端到端”不等于授权假设。
- 若需求或生成输入不完整，先回到 S0；若用户明确授权假设，必须把风险带到最终报告。

## Contents

- [`quick-preview`](#quick-preview)
- [`standard-e2e`](#standard-e2e)
- [`formal-e2e`](#formal-e2e)
- [`升级规则`](#升级规则)
- [`最小门禁表`](#最小门禁表)

## quick-preview

适用：

- 用户只要求生成页面或快速预览
- 新建槽位型典型页
- 没有提测 / 发布 / 完整 UX 报告要求

执行：

- 输入是粗略需求时，运行 `refine-product-requirements` 的 `hiui-handoff` 或最小选项式确认
- 展示生成输入确认块；用户确认或明确授权假设后才继续
- `hiui-design` 的 `plan-page-task`
- 页面生成或修改
- 基础 build / typecheck / dev server 可运行确认
- `ux-smoke`：确认页面可访问、不是空白页 / 错误页 / 登录页 / 错路由，并保留最终截图路径
- 若 quick-preview 中发生了体验修复，保留修复前 / 修复后关键截图路径

不要求：

- `ux-formal` docx
- 全量 `formalAcceptanceCommands`
- P0 场景覆盖矩阵，除非用户要求端到端验收或发现 P0 风险

## standard-e2e

适用：

- 用户要求“生成并验收”
- 用户要求“端到端”
- 用户要求“检查体验问题”
- 页面修改后需要确认工程质量和主要体验风险

执行：

- 运行 `refine-product-requirements`，产出页面清单、全局生成上下文、页面级提示词和 HiUI 交接包
- `requirementGate` 通过后，必须展示生成输入确认块
- `generationInputGate.status = confirmed | assumption-authorized` 后才进入页面规划
- 以 `hiui-design` 的 `requiredActions` 为主调度面；`requiredCommands` 只作兼容摘要
- 页面截图
- `ux-standard` 结构化 UX 验收
- UX evidence gate：目标页面可访问，截图 / 代码 / URL 证据可用
- P0 场景覆盖矩阵：覆盖入口、主路径、关键数据、权限、状态、防错、反馈恢复
- P0 / P1 / P2 问题分级；若只发现 P2，必须说明 P0/P1 核心路径已检查且未发现问题的依据
- P0 / P1 修复闭环
- P0 / P1 修复前后的同视口效果对比
- 最终交付工程验收结果和体验问题列表

可选：

- 本地 docx 报告。若用户明确要求完整体验走查、UX review 报告、可转发报告或归档报告，则升级到 `formal-e2e` 或执行 `ux-formal`。

## formal-e2e

适用：

- 提测
- 发布
- 合入
- 无 warning
- `source-gate`
- `doctor`
- `finalize-page`
- 完整体验走查
- UX review 报告

执行：

- 运行 `refine-product-requirements` 的 `full-prd-to-generation` 或等价完整交付，保留选项确认、假设、待确认和 HiUI 交接包
- `requirementGate` 与 `generationInputGate` 均必须通过；若是授权假设，最终报告必须高亮风险
- 以 `hiui-design` 的 `formalAcceptanceActions` 为主调度面；`formalAcceptanceCommands` 只作兼容摘要
- `ux-formal`：执行 `ux-walkthrough` 完整 SOP
- `precheck_walkthrough.py`、证据门禁、问题判断、report.json、docx 全部执行
- P0 场景覆盖矩阵和 P0/P1 修复后复验
- 截图和标注图
- 修复前 / 修复后效果对比图，报告中需可查看原图路径
- 本地 docx 报告
- `hiui-design` usage stats 收口；`ux-walkthrough` 以报告、`report.json`、标注校验与 docx 作为正式完成面

## 升级规则

- 任意 P0 问题出现后，当前 workflow 至少升级为 `standard-e2e` 修复闭环。
- 用户要求提测、发布、合入、无 warning 或完整报告时，升级为 `formal-e2e`。
- 用户要求“从需求到页面到验收一条龙”时，至少使用 `standard-e2e`；若同时要求完整 PRD、完整 UX 报告或提测，则升级为 `formal-e2e`。
- 只做局部文案、字段或 mock 调整，且用户没有验收诉求时，可保持 `quick-preview`。

## 最小门禁表

| 准备进入 | 必须满足 |
|---|---|
| 页面规划 | `generationInputGate.status = confirmed | assumption-authorized` |
| 文件修改 | 页面规划完成，且 `plan.status = ready`、`facts.status = ready`、`currentExecutionState.status = ready`、`canStartImplementation = true`，并且 required docs 已按 `readMode` 消费 |
| `ux-smoke` | 页面可访问，有最终截图或无法截图原因 |
| `ux-standard` | `uxGate.evidenceStatus = ready`，P0 场景已知或已说明缺口 |
| `ux-formal` | 完整 `ux-walkthrough` SOP，docxRequired = true |
| 最终交付 | 工程结果、UX 结果、截图路径、Gate 状态和风险说明已收口 |
