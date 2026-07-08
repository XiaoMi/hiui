# Workflow Bundle Release

`hiui-page-workflow` 是团队通用 workflow；当前文档描述的是它的默认安装与发布控制面。

以下示例默认从仓库根目录执行。

## 角色边界

- `SKILL.md` 与 `references/` 继续定义页面交付 workflow 本身。
- `agents/`、`skill.manifest.json`、`install-workflow.sh` 与 `scripts/*workflow-bundle*.mjs` 属于安装与发布控制面。
- `bundle/` 负责声明 workflow 组合事实；默认安装入口负责把这些组合安装到本地 skills 目录。
- 安装与发布控制面不改变 `hiui-page-workflow` 的核心用途；它只负责声明、安装和验证下游 skill 组合。

## Public Install Entry

仓库内 `skills/hiui-page-workflow/install-workflow.sh` 是公开 bundle 的默认 bootstrap 入口，负责：

- 检查 `git`、`node` 和 `python3`
- 调用 `scripts/install-workflow-bundle.mjs`
- 透传 `--dry-run`、`--reinstall`、`--force-sync`、`--allow-downgrade` 等参数

`install.sh` 与 `install-codex.sh` 仍然保留，但只作为兼容壳转调 `install-workflow.sh`。

公开安装推荐直接从上游仓库执行：

```bash
git clone https://github.com/XiaoMi/hiui.git
cd hiui
bash skills/hiui-page-workflow/install-workflow.sh
```

若外部成员仍沿用旧命令，兼容入口也应保持可用：

```bash
bash skills/hiui-page-workflow/install.sh
```

安装入口所在的仓库分支可以继续前进；默认公开安装仍然以 `bundle/workflow-bundle.lock.json` 为准，但该 lock 现在默认跟随 `XiaoMi/hiui:master`，并通过 `follow-source-manifest` 读取当前源码 manifest 版本。

## 发布前检查

先确保 lock 文件、安装策略和兼容矩阵一致：

```bash
node skills/hiui-page-workflow/scripts/verify-workflow-bundle.mjs --json
```

在发布前的本地联调阶段，应先使用 maintainer 专用本地 lock，验证当前工作区源码是否已经形成一组自洽组合：

```bash
node skills/hiui-page-workflow/scripts/verify-workflow-bundle.mjs \
  --lockfile skills/hiui-page-workflow/bundle/workflow-bundle.local.lock.json \
  --json
```

若要验证安装计划但不真正写入目标目录：

```bash
node skills/hiui-page-workflow/scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
```

本地联调阶段对应命令：

```bash
node skills/hiui-page-workflow/scripts/install-workflow-bundle.mjs \
  --lockfile skills/hiui-page-workflow/bundle/workflow-bundle.local.lock.json \
  --dry-run \
  --target /tmp/workflow-bundle-check \
  --json
```

## 最小发布 smoke

使用临时目录执行一次完整安装与安装后验证：

```bash
node skills/hiui-page-workflow/scripts/release-workflow-bundle.mjs --json
```

若只是验证当前工作区组合是否能完整安装，也应显式指定本地 lock：

```bash
node skills/hiui-page-workflow/scripts/release-workflow-bundle.mjs \
  --lockfile skills/hiui-page-workflow/bundle/workflow-bundle.local.lock.json \
  --json
```

默认行为：

- 创建临时目标目录
- 执行一次 bundle 安装
- 对安装结果执行 `verify-workflow-bundle`
- 输出结构化发布 smoke 摘要

## 回滚

若安装后的结果需要撤销，使用安装时生成的 `install-journal.json`：

```bash
node skills/hiui-page-workflow/scripts/rollback-workflow-bundle.mjs --journal <journal-path> --json
```

## Public Source Policy

当前 lock 文件允许 `source.kind=local` 作为本地开发和 fixture 校验模式。  
默认公开分发应优先使用：

- `source.kind=git`
- `source.repoUrl=<https-git-url>`
- `source.ref=master`
- `source.path=<skill-root-path>`
- `versionPolicy=follow-source-manifest`

只有当下游公开 skill 已经提供 `skill.manifest.json`、`requiredPaths` 和 `publicContracts` 时，才允许接入 bundle。

默认公开 lock 跟随 `XiaoMi/hiui:master` 的好处是：

- 外部成员重新执行安装时，可以直接拿到主仓库当前最新 skill 版本
- 不需要每次合并后再单独回写 public lock 的 commit SHA
- bundle 入口与主仓当前源码保持同一套分发语义，减少“源码已更新、lock 仍旧”的错位

代价也需要明确接受：

- 不再承诺“同一条命令、不同时间、完全同结果”的强可复现性
- 若 `master` 上出现短暂不稳定，外部安装会直接吃到该状态
- 若要精确回滚或对外发布冻结版本，需要额外维护 release lock

当需要冻结发布、做外部问题复现或建立可回滚快照时，应新增一份 release lock，并把相同 bundle 改写为固定 commit SHA refs。生成后重新执行：

- `node skills/hiui-page-workflow/scripts/verify-workflow-bundle.mjs --json`
- `node skills/hiui-page-workflow/scripts/release-workflow-bundle.mjs --json`

推荐维护流程：

1. 先更新工作区源码与 `workflow-bundle.local.lock.json`，跑通本地 verify / dry-run / release smoke。
2. 将变更合入 `XiaoMi/hiui:master` 后，对默认 public lock 跑一次 verify / dry-run / release smoke，确认滚动安装链路正常。
3. 若需要冻结一个可复现版本，再从当前 public lock 派生 release lock，并把 `ref` 改成固定 commit SHA。
