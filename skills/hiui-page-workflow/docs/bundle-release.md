# Workflow Bundle Release

`hiui-page-workflow` 除了是端到端交付 skill，也承担 workflow bundle 的组合发布入口。

## 角色边界

- `SKILL.md`、`references/` 与 `agents/` 继续定义页面交付 workflow 本身。
- `bundle/` 与 `scripts/*workflow-bundle*.mjs` 属于 bundle 控制面，用于安装、验证、回滚和发布 smoke。
- bundle 控制面不改变 `hiui-page-workflow` 的核心用途；它只负责声明和验证下游 skill 组合。

## Public Install Entry

根目录 `install.sh` 是公开 bundle 的 bootstrap 入口，负责：

- 检查 `git`、`node` 和 `python3`
- 调用 `scripts/install-workflow-bundle.mjs`
- 透传 `--dry-run`、`--reinstall`、`--force-sync`、`--allow-downgrade` 等参数

稳定发布前，推荐直接按 lock 中固定的 commit SHA 验证安装：

```bash
git clone --depth 1 https://github.com/XiaoMi/hiui.git
cd hiui
git fetch --depth 1 origin bf314829649f8304037257f4fbaf0050ba577d67
git checkout --detach FETCH_HEAD
bash skills/hiui-page-workflow/install.sh
```

## 发布前检查

维护者发版前，先跑统一 preflight：

```bash
node scripts/preflight-workflow-bundle-release.mjs --json
```

它会依次覆盖：

- lock / install policy / compatibility matrix 的 source verify
- `install-workflow-bundle --dry-run`
- `release-workflow-bundle` 的临时目录安装 smoke
- `CODEX_HOME=<temp>` 下通过 `install.sh` 走完整 bootstrap 入口
- bootstrap 安装后的目标目录 verify

若你需要单独定位某一步，再拆开执行：

先确保 lock 文件、安装策略和兼容矩阵一致：

```bash
node scripts/verify-workflow-bundle.mjs --json
```

若要验证安装计划但不真正写入目标目录：

```bash
node scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
```

## 最小发布 smoke

使用临时目录执行一次完整安装与安装后验证：

```bash
node scripts/release-workflow-bundle.mjs --json
```

默认行为：

- 创建临时目标目录
- 执行一次 bundle 安装
- 对安装结果执行 `verify-workflow-bundle`
- 输出结构化发布 smoke 摘要

## 回滚

若安装后的结果需要撤销，使用安装时生成的 `install-journal.json`：

```bash
node scripts/rollback-workflow-bundle.mjs --journal <journal-path> --json
```

## Public Source Policy

当前 lock 文件允许 `source.kind=local` 作为本地开发和 fixture 校验模式。  
公开发布或公开预览分发时，应优先使用：

- `source.kind=git`
- `source.repoUrl=<https-git-url>`
- `source.ref=<exact-commit-sha>`
- `source.path=<skill-root-path>`

只有当下游公开 skill 已经提供 `skill.manifest.json`、`requiredPaths` 和 `publicContracts` 时，才允许接入 bundle。

stable channel 不应依赖 upstream PR ref、个人 fork 或漂移分支；发布前应把 lock 固定到公开可获取的精确 commit SHA，并重新执行：

- `node scripts/verify-workflow-bundle.mjs --json`
- `node scripts/release-workflow-bundle.mjs --json`
