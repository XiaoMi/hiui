# HiUI Page Workflow

`hiui-page-workflow` 的产品定位是 **内部团队通用 workflow**，用于把 React / HiUI 页面从需求细化、页面生成、工程验收到 UX 验收串成闭环。

当前仓库里同时存在两类内容：

- workflow core：流程规则、交接契约、验收标准、报告模板
- distribution assets：安装、校验、回滚和发布 smoke 所需脚本与配置

当前仓库已提供默认安装入口，可将 workflow bundle 安装到本地 skills 目录；如需隔离环境或改写落点，可显式指定目标目录。

## What Is In This Package

- 作为 `hiui-page-workflow` skill 本身，编排需求细化、页面生成、工程验收和 UX 验收闭环
- 作为 workflow bundle 控制面，给一组关联 skill 提供统一安装、升级、校验和回滚入口

当前 bundle 组合的 skill 包括：

- `hiui-page-workflow`
- `refine-product-requirements`
- `hiui-design`
- `ux-walkthrough`

## Architecture Boundary

`hiui-page-workflow` 是门禁型总编排层，不是下游 skill 的实现镜像。

- 对 `refine-product-requirements`：消费需求细化结果、HiUI 交接包和确认状态，不复制其需求建模正文
- 对 `hiui-design`：消费稳定 planner contract 与交付状态，例如正式 Plan Gateway、执行许可、结构化 actions、交付摘要；不镜像其全部页面实现字段或内部生命周期细节
- 对 `ux-walkthrough`：消费证据门禁、问题分级和报告产物，不复制其完整 SOP 正文

因此，workflow core 的优化原则是“强约束对齐，弱实现耦合”：只吸收跨阶段协同真正需要的稳定面，不把下游 skill 的全部领域细节搬进 workflow 自身的数据结构。

## Distribution Status

当前已提供：

- 默认安装入口
- bundle 校验、回滚与发布 smoke 脚本

正在收敛中的方向：

- project adapter：项目内接入 `.local-context/`、模板、桥接规则
- other agent adapters：面向其他 AI 工具的规则导出或包装

## Install

执行安装前，需要保证本机具备：

- `git`
- `node`
- `python3`
- 对公开 GitHub 仓库和分支的访问能力

默认安装会写入当前环境的本地 skills 目录。若需指定其他位置，可使用 `--target`，或在 shell 中设置 `WORKFLOW_HOME`。

### Public Preview Install

当前灰度版通过公开 fork 分支安装四个 skill。若你希望验证在线安装，可直接拉取灰度分支并执行默认安装入口：

```bash
git clone --depth 1 --branch gray-skill-bundle-20260703 https://github.com/1108guorui-web/hiui.git
cd hiui
bash skills/hiui-page-workflow/install-workflow.sh
```

也可以在已有仓库副本中直接运行：

```bash
bash skills/hiui-page-workflow/install-workflow.sh
```

### Common Commands

安装或升级到 bundle 推荐版本：

```bash
bash install-workflow.sh
```

只查看安装计划，不真正写入：

```bash
bash install-workflow.sh --dry-run --json
```

重新覆盖安装同版本：

```bash
bash install-workflow.sh --reinstall
```

强制按 lock 文件同步本地版本：

```bash
bash install-workflow.sh --force-sync
```

### Compatibility Notes

旧入口脚本仍然保留，但只作为兼容壳转调 `install-workflow.sh`。后续文档和脚本示例统一使用 `install-workflow.sh`。

## Project Usage

如果你的目标是把 workflow 接到项目里，应通过 project adapter 把规则、模板和桥接资产落到业务仓库；如果你的目标是复用 workflow 规则，可直接使用 `SKILL.md`、`references/` 和 `bundle/` 里的约束与模板。

页面规划相关的正式入口由下游 `hiui-design` 提供。workflow 在项目里应优先消费目标项目根的 Plan Gateway 与 `.local-context/hiui-design/` 接入产物，而不是直接把 skill 仓库里的脚本路径写进业务项目交付流程。

## Version Policy

默认安装策略由 `bundle/install-policy.json` 定义，当前行为如下：

- 未安装：直接安装
- 已安装旧版本：默认升级
- 已安装同版本：默认跳过
- 本地版本更新：默认保留
- 需要强制覆盖时：显式使用 `--force-sync`
- 需要允许降级时：显式使用 `--allow-downgrade`

`workflow-bundle.lock.json` 是组合分发的真相源。当前灰度版默认使用公开 fork 的固定灰度分支加显式 `ref` 和 `path` 来定位 skill 源码，方便做一次完整的在线安装验证；完成灰度验证后，应再切回稳定上游分支、tag 或 commit。

若你只想在临时目录验证安装，不污染本机默认落点，可先指定一个临时目录：

```bash
WORKFLOW_HOME=/tmp/workflow-gray-test bash skills/hiui-page-workflow/install-workflow.sh
```

## Validation And Rollback

发布或变更 lock 文件前，建议按顺序执行：

```bash
node scripts/verify-workflow-bundle.mjs --json
node scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
node scripts/release-workflow-bundle.mjs --json
```

安装会自动生成备份和 `install-journal.json`。若要回滚，执行：

```bash
node scripts/rollback-workflow-bundle.mjs --journal <journal-path> --json
```

## Repository Layout

- `SKILL.md`: `hiui-page-workflow` workflow 主说明
- `references/`: workflow 的验收矩阵、交接契约和最终报告模板
- `bundle/`: workflow 组合定义、安装策略、兼容矩阵
- `scripts/`: 安装、验证、回滚、发布 smoke 脚本
- `docs/`: workflow bundle 的发布与维护文档

## Notes For Maintainers

- 对外表述时，应始终把 `hiui-page-workflow` 说明为“团队通用 workflow”，不要把某个工具或目录写成产品默认形态
- `install-workflow.sh` 只是默认安装入口；不要把它当成 project adapter 或其他工具适配器的替代品
- 若下游公开 skill 尚未提供 `skill.manifest.json` 与 public contracts，应先补齐稳定面，再把它接入 bundle
- 更新 lock 文件后，必须重新执行 `verify-workflow-bundle` 和 `release-workflow-bundle`
