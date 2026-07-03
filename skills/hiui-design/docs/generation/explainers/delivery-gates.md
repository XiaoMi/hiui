# Delivery Gates Explainer

本文件只解释交付阶段各 gate 的角色边界；source of truth 仍是：

- `rules/runtime-contract.md`
- `rules/page-governance.md`
- `rules/validation-checklist.md`
- `rules/page-task-lifecycle.md`

## 1. 交付 gate 的职责

- `Preflight`：确认 contract、source marker、ownership、i18n、结构一致性等高确定性条件已通过。
- `FormalAcceptance`：只在 `acceptanceProfile.formalRequired=true` 时执行。
- `RuntimeGovernance`：处理 runtime smoke、page governance 等浏览器级或治理级证据。
- `PreviewReady`：证明页面可预览且达到当前质量门槛，不等于 formal finalize。

## 2. 交付 gate 不负责什么

- 不负责重新决定 `pageType`。
- 不负责推翻 planner 生成策略。
- 不负责把 explainers 当成执行入口。

## 3. explainers 的作用边界

- 本文件帮助 Agent 判断“为什么当前只需要 preview-ready，而不是 full finalize”。
- 本文件帮助解释 formal acceptance、runtime governance 与 usage stats 之间的关系。
- 本文件不新增任何 status 字段，也不改变 `preflight-report.v1` / `finalReportContract` 的协议定义。
