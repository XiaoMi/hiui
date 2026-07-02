# HiUI Page Workflow

`hiui-page-workflow` 同时承担两类职责：

- 作为 `hiui-page-workflow` skill 本身，编排需求细化、页面生成、工程验收和 UX 验收闭环。
- 作为 workflow bundle 控制面，给公开版本提供四个 skill 的统一安装、升级、校验和回滚入口。

当前公开 bundle 默认安装以下四个 skill：

- `hiui-page-workflow`
- `refine-product-requirements`
- `hiui-design`
- `ux-walkthrough`

## Prerequisites

执行安装前，需要保证本机具备：

- `git`
- `node`
- `python3`
- 对公开 GitHub 仓库和分支的访问能力

默认安装目标目录为 `~/.codex/skills`。

## Public Preview Install

公开预览版目前通过公开 GitHub clone URL + ref + path 安装四个 skill。若你希望直接验证当前 bundle，可先拉取 upstream PR 预览 ref，然后从 skill 目录执行安装：

```bash
git clone --depth 1 https://github.com/XiaoMi/hiui.git
cd hiui
git fetch --depth 1 origin refs/pull/3562/head
git checkout --detach FETCH_HEAD
bash skills/hiui-page-workflow/install.sh
```

也可以在已有仓库副本中直接运行：

```bash
bash skills/hiui-page-workflow/install.sh
```

## Common Commands

安装或升级到 bundle 推荐版本：

```bash
bash install.sh
```

只查看安装计划，不真正写入：

```bash
bash install.sh --dry-run --json
```

重新覆盖安装同版本：

```bash
bash install.sh --reinstall
```

强制按 lock 文件同步本地版本：

```bash
bash install.sh --force-sync
```

## Version Policy

默认安装策略由 `bundle/install-policy.json` 定义，当前行为如下：

- 未安装：直接安装
- 已安装旧版本：默认升级
- 已安装同版本：默认跳过
- 本地版本更新：默认保留
- 需要强制覆盖时：显式使用 `--force-sync`
- 需要允许降级时：显式使用 `--allow-downgrade`

`workflow-bundle.lock.json` 是唯一真相源。公开预览版默认使用官方 GitHub 仓库加显式 `ref` 和 `path` 来定位 skill 源码；在 upstream 合并前，preview 版本通过 upstream PR ref 保持可安装，同时避免把个人 fork 作为默认公开依赖。

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

- `SKILL.md`: `hiui-page-workflow` skill 主说明
- `bundle/`: bundle lock、安装策略、兼容矩阵
- `scripts/`: 安装、验证、回滚、发布 smoke 脚本
- `docs/`: bundle 发布与维护文档
- `references/`: workflow skill 的参考资料

## Notes For Maintainers

- bundle lock 中的每个 skill 都应声明稳定的公开 source 信息
- 若下游公开 skill 尚未提供 `skill.manifest.json` 与 public contracts，应先补齐稳定面，再把它接入 bundle
- 更新 lock 文件后，必须重新执行 `verify-workflow-bundle` 和 `release-workflow-bundle`
