# Workflow Bundle Release

`hiui-workflow` 是 HiUI workflow 的公开安装与发布入口。本文档描述的是该入口目录下 4 个 skill 的组合分发、校验、回滚与发布 smoke 流程。

以下示例默认从仓库根目录执行。

## Role Boundary

- `hiui-workflow/` 负责安装与发布控制面
- `hiui-page-workflow/` 负责端到端 workflow 编排
- `refine-product-requirements/`、`hiui-design/`、`ux-walkthrough/` 负责各自独立能力
- 本入口目录不是新的业务 skill，只是公开分发入口

## Public Install Entry

仓库内 `skills/hiui-workflow/install-workflow.sh` 是公开 bundle 的默认 bootstrap 入口，负责：

- 检查 `git`、`node` 和 `python3`
- 调用 `scripts/install-workflow-bundle.mjs`
- 透传 `--dry-run`、`--reinstall`、`--force-sync`、`--allow-downgrade` 等参数

`install.sh` 与 `install-codex.sh` 如保留，仅作为兼容壳转调 `install-workflow.sh`，不作为对外默认示例。

公开安装推荐直接使用：

```bash
npx skills add XiaoMi/hiui/skills/hiui-workflow --skill '*'
```

若需要直接执行仓库内脚本，可使用：

```bash
git clone https://github.com/XiaoMi/hiui.git
cd hiui
bash skills/hiui-workflow/install-workflow.sh
```

## Public Lock Policy

默认公开安装以 `skills/hiui-workflow/bundle/workflow-bundle.lock.json` 为准。

- public lock 使用 `source.kind=git`
- `source.path` 使用仓库根相对路径
- 当条目标记 `follow-source-manifest` 时，以源仓当前 manifest 版本作为目标版本
- local lock 仅用于 maintainer 在工作区内做联调和发布前验证

## Validation

发布或调整组合分发配置前，建议至少执行以下检查：

```bash
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
node skills/hiui-workflow/scripts/release-workflow-bundle.mjs --json
```

若当前还在工作区联调、相关变更尚未合入 `XiaoMi/hiui:master`，请改用 local lock 执行相同验证：

```bash
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --dry-run \
  --target /tmp/workflow-bundle-check \
  --json
node skills/hiui-workflow/scripts/release-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --json
```

## Rollback

若安装结果需要撤销，使用安装时生成的 `install-journal.json`：

```bash
node skills/hiui-workflow/scripts/rollback-workflow-bundle.mjs --journal <journal-path> --json
```

## Release Notes

- `hiui-workflow` 负责组合分发控制，不改变 4 个 skill 各自的运行时职责
- public lock 跟随 `XiaoMi/hiui:master`，不承诺跨时间点的强可复现性
- 若需要精确回滚、对外冻结发布或问题复现，应额外维护 release lock 并改写为固定 commit SHA refs
