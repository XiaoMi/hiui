# Workflow Bundle Release

`hiui-workflow` 是 HiUI workflow 的公开安装与发布入口。本文档描述的是该入口目录下 4 个 skill 的组合分发、校验、回滚与发布 smoke 流程。

以下示例默认从仓库根目录执行。

## Role Boundary

- `hiui-workflow/` 负责安装与发布控制面
- `hiui-page-workflow/` 负责端到端 workflow 编排
- `hiui-refine/`、`hiui-design/`、`ux-walkthrough/` 负责各自独立能力
- 本入口目录不是新的业务 skill，只是公开分发入口

## Public Install Entry

仓库内 `skills/hiui-workflow/install-workflow.sh` 是公开 bundle 的默认 bootstrap 入口，负责：

- 检查 `git`、`node` 和 `python3`
- 调用 `scripts/install-workflow-bundle.mjs`
- 透传 `--dry-run`、`--reinstall`、`--force-sync`、`--allow-downgrade` 等参数

`install.sh` 与 `install-codex.sh` 如保留，仅作为兼容壳转调 `install-workflow.sh`，不作为对外默认示例。

公开安装分两类：

- Codex 默认安装：可以直接使用 `skills add`
- 其他宿主：必须显式传入目标 skill 根目录，不能默认落到 `~/.codex/skills`

Codex 默认安装示例：

```bash
npx skills add XiaoMi/hiui/skills/hiui-workflow --skill '*'
```

其他宿主或需要精确指定目标目录时，使用仓库内 bundle 脚本：

```bash
git clone https://github.com/XiaoMi/hiui.git
cd hiui
bash skills/hiui-workflow/install-workflow.sh --target /path/to/host/skills
```

若要通过 bundle 脚本安装到 Codex 默认 skill 目录，应显式写出：

```bash
bash skills/hiui-workflow/install-workflow.sh --host codex
```

当前 bundle 安装脚本已改为 fail closed：必须显式给出 `--host` 或 `--target`。因此在非 Codex 场景下，发布与安装文档都必须显式写出 `--target`，不要假设宿主会被自动识别。

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
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs --host codex --json
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs --target /tmp/workflow-bundle-check --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs --dry-run --host codex --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
node skills/hiui-workflow/scripts/release-workflow-bundle.mjs --target /tmp/workflow-bundle-check --json
```

若当前还在工作区联调、相关变更尚未合入 `XiaoMi/hiui:master`，请改用 local lock 执行相同验证：

```bash
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --host codex \
  --json
node skills/hiui-workflow/scripts/verify-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --target /tmp/workflow-bundle-check \
  --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --dry-run \
  --host codex \
  --json
node skills/hiui-workflow/scripts/install-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --dry-run \
  --target /tmp/workflow-bundle-check \
  --json
node skills/hiui-workflow/scripts/release-workflow-bundle.mjs \
  --lockfile skills/hiui-workflow/bundle/workflow-bundle.local.lock.json \
  --target /tmp/workflow-bundle-check \
  --json
```

## Rollback

若安装结果需要撤销，使用安装时生成的 `install-journal.json`：

```bash
node skills/hiui-workflow/scripts/rollback-workflow-bundle.mjs --journal <journal-path> --json
```

## Rename Migration

- 当前 bundle 会把历史安装目录 `refine-product-requirements` 识别为 `hiui-refine` 的 legacy install name。
- 若目标环境只有旧目录，安装时会先备份旧目录，再以新目录名 `hiui-refine` 落盘。
- 若目标环境已存在 `hiui-refine`，但仍残留旧目录，安装时会把旧目录一并备份清理，避免形成双目录残留状态。
- 回滚时会按 `install-journal.json` 把 legacy 目录恢复到原路径。

## Release Notes

- `hiui-workflow` 负责组合分发控制，不改变 4 个 skill 各自的运行时职责
- public lock 跟随 `XiaoMi/hiui:master`，不承诺跨时间点的强可复现性
- 若需要精确回滚、对外冻结发布或问题复现，应额外维护 release lock 并改写为固定 commit SHA refs
