# Standard Generation Protocol Explainer

本文件只解释标准生成协议的阅读方式；source of truth 仍是：

- `rules/generation-rules.md`
- `rules/QUICK-START.md`
- `docs/generation/page-level-components.md`

## 1. 生成协议回答的问题

标准生成协议只回答四类问题：

- 从什么起点开始生成。
- 关键 region 的装配顺序是什么。
- 哪些区域允许业务填充。
- 完成关键步骤后要做哪些轻量一致性检查。

## 2. 关键字段如何理解

- `startingPoint`：模板、host archetype、reference-or-scaffold 或其它 planner 允许的起点。
- `assemblyOrder`：结构装配顺序，不允许在业务填槽前自由重写页壳。
- `requiredAssets`：生成当前页面必须具备的组件、模板、adapter、carrier 或参考资产。
- `forbiddenMoves`：显式禁止的降级动作，例如空白页手写、绕开锁定区域、把 reference 当正式交付资产。

## 3. explainers 的作用边界

- 本文件帮助理解 planner 为什么选了某个 `startFrom`。
- 本文件帮助区分 `page-component`、`managed-fallback` 与 `host archetype` 的职责差异。
- 本文件不替代 planner，也不授权 Agent 自行更换 `startingPoint`。
