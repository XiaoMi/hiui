# Generation Gates Explainer

本文件只解释复杂场景下的生成门禁；source of truth 仍是：

- `rules/generation-rules.md`
- `rules/page-task-lifecycle.md`
- `rules/legacy-host-hard-gates.json`
- `docs/generation/legacy-host-compatibility.md`

## 1. 为什么需要 explainers

普通典型页快路径通常只需要 planner、模板和当前页 contract。只有在下面这些复杂场景中，才需要额外解释层帮助 Agent 正确理解 gate：

- `legacy-host-compatible`
- `managed-fallback`
- `single-page-composite`
- `non-typical-overlay`
- 严格 governance / 排障场景

## 2. 关键门禁层次

- `PlanTask` gate：先确认项目事实、资产事实与策略是否合法。
- `generation` gate：确认能否进入 `compiled PageSpec + HiuiLegacyPage runtime + typed page slots`、`managed-analytics`、`managed-fallback` 或非典型链路。
- `instance` gate：确认业务实现没有越过槽位、ownership、HiuiLegacyPage runtime 或 adapter 边界。
- `delivery` gate：确认 preflight、governance、preview-ready 等最终状态。

## 3. legacy 重点解释

- “不能 direct import standard shell” 只是否定业务页 ad hoc mount，不是否定通过 `HiuiLegacyPage` 统一承载 compiled PageSpec 与现有典型页壳。
- host contract、project integration state 与 typical page contract ready 时，应继续沿“项目接入链 `apply:legacy`（内部 `legacy:init`）+ 页面计划链 `light-plan` + 页面生成链 `legacy:new|rewrite --plan`”，而不是把 reference/fallback 或旧 carrier 误读成默认交付方式。
- `reference-only` 参考页只承担结构基线职责，不能反向成为业务主交付资产。
