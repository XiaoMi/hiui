# Core Object Model Explainer

本文件只解释 `hiui-design` 控制面的核心对象如何协作；source of truth 仍是：

- `rules/runtime-contract.md`
- `rules/page-task-lifecycle.md`
- `rules/contract-regions.md`

## 1. 顶层控制对象

- `page-task-plan.v1`：唯一执行计划出口。负责暴露 `generationStrategy`、`requiredDocs`、`requiredActions`、`blockingReasons` 与 `acceptanceProfile`。
- `generationRecipe`：`page-task-plan.v1` 的生成子协议，只描述装配顺序与受控边界，不应复制可从 registry 或 contract 派生的事实。
- `requiredDocs`：默认唯一补读入口。复杂场景下可补 explainers，但 explainers 只能是 `reference` 级解释层。
- `requiredActions`：默认唯一执行入口。Agent 不应绕过它手工重组主命令链。

## 2. 资产与实例对象

- `pageComponent`：受认证页面组件；在 `page-component` 主链中代表可复用的运行时主资产。
- `baseMoldId`：结构事实源，锁定可编辑槽位与锁定区域。
- `runtimeBridgeProfile`：legacy `page-component` 的附加说明对象，不创建平行 generation family。
- `page contract` / `generationProfile` / `productionContract`：实例级事实，负责把当前业务页与受管结构绑定起来。

## 3. 设计原则

- 机器计划先于文档解释。
- 解释层先于自由推断。
- registry / contract 派生事实优先于 prose 复写。
- explainers 只能帮助理解对象关系，不得改写对象职责。
