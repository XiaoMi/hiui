# HiUI Workflow Entry

`hiui-workflow` 是 HiUI 页面工作流的公开安装入口，用于一次性安装工作流所需的 4 个 skill。

它本身不是一个额外的业务 skill，也不承担页面生成或验收工作；它只负责组合分发、安装、校验、回滚和发布 smoke。

## Included Skills

当前入口目录会安装以下 4 个独立 skill：

- `hiui-page-workflow`
- `hiui-refine`
- `hiui-design`
- `ux-walkthrough`

这些 skill 仍然各自维护自己的源码、版本和职责边界。

## Install

对外统一使用以下安装命令：

```bash
npx skills add XiaoMi/hiui/skills/hiui-workflow --skill '*'
```

该命令会从 `hiui-workflow` 目录发现并安装其中包含的全部 skill。

若你的安装环境要求显式指定 skill 根目录，或你需要做 bundle 级安装校验，请改用 bundle 安装脚本并显式传入目标目录：

```bash
git clone https://github.com/XiaoMi/hiui.git
cd hiui
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs --target /path/to/host/skills --json
```

说明要求：

- `hiui-workflow` 是公开安装入口，不是额外的第 5 个业务 skill
- `npx skills add ...` 是对外统一安装命令
- bundle 安装脚本必须显式给出 `--host` 或 `--target`
- 对外安装说明不暴露宿主内部目录或宿主命名细节

## Local Validation

在仓库内开发或联调时，建议先做本地发现和安装验证。

列出当前入口目录可发现的 skill：

```bash
npx skills add ./skills/hiui-workflow --list
```

将入口目录中的全部 skill 安装到本地环境：

```bash
npx skills add ./skills/hiui-workflow --skill '*' -y
```

若要验证显式目标目录安装，请改用：

```bash
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
```

## Bundle Controls

本目录同时承载组合分发控制面，包括：

- `bundle/`：组合 lock、安装策略、兼容矩阵
- `scripts/`：安装、校验、回滚和发布 smoke 脚本
- `install-workflow.sh`：默认安装入口
- `docs/bundle-release.md`：发布与维护说明

这些文件只服务于组合分发控制，不改变 4 个 skill 各自的运行时职责。

## Runtime Responsibilities

4 个 skill 的职责分工如下：

- `hiui-page-workflow`：负责端到端 workflow 编排
- `hiui-refine`：负责需求细化和 HiUI 交接包生成
- `hiui-design`：负责页面规划、生成和工程验收
- `ux-walkthrough`：负责体验走查、报告和 docx 产物

## Maintainer Notes

- `hiui-workflow` 是安装入口目录，不是新的第 5 个 skill
- 对外安装说明统一使用 `hiui-workflow`
- 不再对外表述“安装 `hiui-page-workflow` 会顺带安装其他 skill”
- 不再把任何具体宿主当作公开安装说明的默认前提
- 若需要冻结可复现版本，应基于 public lock 生成额外的 release lock
- 修改 public lock 或 local lock 后，必须重新执行 verify、dry-run 和 release smoke

## Verification

发布或调整组合分发配置前，建议至少执行以下检查：

```bash
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
node skills/hiui-workflow/scripts/release-workflow-bundle.mjs --json
```

若当前还在工作区联调、相关变更尚未合入 `XiaoMi/hiui:master`，请改用 local lock 执行相同验证。
