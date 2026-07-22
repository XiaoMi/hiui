# HiUI Page Workflow

`hiui-page-workflow` 是一个端到端页面交付 workflow，用于把 HiUI 页面从需求细化、页面生成、工程验收到 UX 验收串成闭环。

它是运行时编排层，不是公开安装入口，也不负责 bundle 分发控制。

## What It Does

`hiui-page-workflow` 负责以下阶段的统一编排：

- 需求澄清与生成输入确认
- HiUI 页面规划
- 页面生成或修改
- 工程验收
- UX 验收
- 修复闭环与最终交付

它通过门禁控制需求确认、页面生成输入确认、工程结果记录和 UX 证据状态，避免在关键信息不完整时直接进入实现或输出确定性结论。

## Dependency Boundary

`hiui-page-workflow` 依赖以下独立 skill 在运行环境中已可用：

- `hiui-refine`
- `hiui-design`
- `ux-walkthrough`

其职责是编排和消费这些 skill 的稳定输出，不复制它们的正文规则或内部实现细节。

它只依赖三类稳定面：

- 能力标识：`requirements-refinement`、`page-planning-and-delivery`、`ux-walkthrough-review`
- 公开调度身份：`hiui-refine`、`hiui-design`、`ux-walkthrough`
- machine-public protocol：HiUI 交接包、planner JSON 最小字段、`requiredActions` / `formalAcceptanceActions`、UX evidence gate

正式冻结清单与边界表见 [references/dispatch-boundary.md](references/dispatch-boundary.md)。

- 对 `hiui-refine`：消费需求细化结果、页面清单、页面级提示词和 HiUI 交接包
- 对 `hiui-design`：消费页面规划、生成动作、工程验收状态和交付摘要
- 对 `ux-walkthrough`：消费 UX 证据门禁、问题分级和报告产物

## Installation

请通过公开安装入口 `hiui-workflow` 安装本 workflow 及其依赖 skill：

```bash
npx skills add XiaoMi/hiui/skills/hiui-workflow --skill '*'
```

上面这条命令当前只应被视为 Codex 默认安装方式。若当前不是 Codex 宿主，请改用 `hiui-workflow` 的 bundle 安装脚本并显式传入目标 skill 根目录。

如果你已经通过该入口安装了全部 skill，就不需要再单独安装 `hiui-page-workflow`。

## When To Use

适用于以下典型任务：

- 从模糊产品需求生成并验收 HiUI 页面
- 将需求细化、页面生成、工程检查和 UX 走查串成一条完整链路
- 在页面提测前做结构化工程与体验验收
- 在页面修复后补完整体验报告和交付闭环

如果用户只需要需求细化，应优先使用 `hiui-refine`。  
如果用户只需要体验走查，应优先使用 `ux-walkthrough`。  
如果任务只是单纯实现或修改页面，应优先由 `hiui-design` 主导。

## Workflow Positioning

`hiui-page-workflow` 的核心定位是门禁型总编排层，而不是下游 skill 的实现镜像。

这意味着：

- 它负责阶段推进和状态收口
- 它负责判断何时允许进入页面生成
- 它负责判断何时允许输出 UX 确定性结论
- 它不负责提供下游 skill 的完整实现细节
- 它不把安装、回滚、发布 smoke 作为普通页面任务的默认步骤

## Maintainer Notes

- 不要再把 `hiui-page-workflow` 对外描述成安装入口或 bundle 入口
- 若用户需要安装、升级或验证 4 个 skill 的组合分发，应引导其使用 `hiui-workflow`
- 本 skill 的 README、SKILL 和文档应始终保持“运行时编排层”口径
