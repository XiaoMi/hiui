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

安装入口所在的仓库分支可以继续前进，但真正安装的 skill 内容必须由 `bundle/workflow-bundle.lock.json` 锁定，不能依赖移动分支本身来定义发布内容。

## 发布前检查

先确保 lock 文件、安装策略和兼容矩阵一致：

```bash
node skills/hiui-page-workflow/scripts/verify-workflow-bundle.mjs --json
```

若要验证安装计划但不真正写入目标目录：

```bash
node skills/hiui-page-workflow/scripts/install-workflow-bundle.mjs --dry-run --target /tmp/workflow-bundle-check --json
```

## 最小发布 smoke

使用临时目录执行一次完整安装与安装后验证：

```bash
node skills/hiui-page-workflow/scripts/release-workflow-bundle.mjs --json
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
公开发布或公开预览分发时，应优先使用：

- `source.kind=git`
- `source.repoUrl=<https-git-url>`
- `source.ref=<commit-sha>`
- `source.path=<skill-root-path>`

只有当下游公开 skill 已经提供 `skill.manifest.json`、`requiredPaths` 和 `publicContracts` 时，才允许接入 bundle。

默认公开 lock 应让四个 skill 指向同一个上游 commit。这样可以保证：

- 外部成员从 `XiaoMi/hiui` 的 `master` 执行安装时，拿到的是经过验证的固定组合，而不是某个随时间漂移的灰度分支状态
- bundle 校验、安装 dry-run、真实安装和回滚都围绕同一份固定快照工作
- 版本不匹配问题会在更新 lock 时暴露，而不是在外部成员安装时暴露

只有在短期灰度联调、且明确不作为默认公开入口时，才应临时使用分支 ref。完成验证后，应尽快切回稳定上游 commit，并重新执行：

- `node skills/hiui-page-workflow/scripts/verify-workflow-bundle.mjs --json`
- `node skills/hiui-page-workflow/scripts/release-workflow-bundle.mjs --json`
