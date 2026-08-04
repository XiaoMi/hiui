# hiui-design 同步 Profile 闭包治理

本文定义 `hiui-design` 接入三条链路的同步闭包、失败处理和回滚边界。它不是页面生成规则的替代品；页面生成仍以 `SKILL.md`、`rules/page-task-lifecycle.md`、`rules/page-governance.md` 与各 mode 文档为事实源。

## 1. 三条链路

### 1.1 `host-integration/minimal`

- 契约文件：`.local-context/hiui-design/config/sync-profile-contracts.json` 中的 `host-integration-minimal`。
- 同步清单：`.local-context/hiui-design/config/host-integration-sync-manifest.json`。
- 依赖包：`.local-context/hiui-design/vendor/hiui-design-typical-page-shells-0.1.2.tgz`。
- 脚本面：保留标准 `typical-page:*` 生成、校验、doctor、preflight、preview 和 report 命令，但不暴露 rules-only reference-assets 命令。
- 成功信号：`typical-page:doctor:integration` 能读取 `.local-context/hiui-design/scripts`、`core`、`rules`、`schemas`、`docs`、`manifests`、`templates`、`examples/host-integration` 与 modern shell tarball。

### 1.2 `rules-only/minimal`

- 契约文件：`.local-context/hiui-design/config/sync-profile-contracts.json` 中的 `rules-only-minimal`。
- 同步清单：`.local-context/hiui-design/config/rules-only-sync-manifest.json`。
- 依赖包：`.local-context/hiui-design/vendor/hiui-design-typical-page-shells-0.1.2.tgz`，与当前 bootstrap 的非 legacy package patch 行为保持一致。
- 脚本面：保留标准生成、校验、doctor、preflight、preview 和 report 命令，并允许 `typical-page:apply:reference-assets` 与 designer reference-assets 命令。
- 成功信号：reference/example 只进入 `.local-context/hiui-design` 或脚本指定目标，不把业务页面写进 `.local-context/hiui-design/reference/**`、`src/typical-page-reuse/**` 或 `examples/host-integration/**`。

### 1.3 `legacy-host-compatible/minimal`

- 契约文件：`.local-context/hiui-design/config/sync-profile-contracts.json` 中的 `legacy-minimal`。
- 同步清单：`.local-context/hiui-design/config/legacy-minimal-sync-manifest.json`。
- 依赖包：`.local-context/hiui-design/vendor/hiui-design-typical-page-shells-0.1.2-legacy.tgz`。
- 脚本面：只暴露轻量四步、legacy init/new/rewrite/verify/accept、doctor、adapter/dom/slot gate、rollback、audit-onboarding 与 light-flow self-check；不暴露 canonical five、asset maintenance、reference-assets 或 workbench 命令。
- 成功信号：`typical-page:apply:legacy -> typical-page:light-plan -> typical-page:legacy:new|rewrite --plan -> typical-page:legacy:accept --profile preview|delivery` 可连续执行；业务页不得 direct import shell 包，不得绕过 `HiuiLegacyPage`、compiled PageSpec 与 typed slots。

### 1.4 `legacy-host-compatible/workbench`

- 契约文件：`.local-context/hiui-design/config/sync-profile-contracts.json` 中的 `legacy-workbench`。
- 同步清单：`.local-context/hiui-design/config/workbench-sync-manifest.json`。
- 使用场景：仅维护者排障、规则维护和完整测试使用，不是业务项目默认接入路径。
- 风险：workbench 会同步 examples、reference、references、scripts/tests 等完整资产；误用于业务项目会增加仓库体积和规则噪声。
- 回滚：重新执行 `typical-page:apply:legacy --sync-profile minimal`，并清理 workbench 额外资产。

## 2. 强制校验顺序

1. 先执行项目同步，把 profile 对应清单复制到 `.local-context/hiui-design`。
2. 立即执行 sync profile contract gate；失败时停止 bootstrap，不得继续 patch `package.json`。
3. 校验脚本名必须存在于 profile 的 `registeredScripts`。
4. 校验脚本实际 `.mjs` 目标必须等于 profile 中登记的目标。
5. 校验脚本目标必须被 profile 的 `requiredFiles` 覆盖。
6. 校验 profile 的 `requiredFiles` 与 `doctorRequiredFiles` 必须被同步清单覆盖。
7. 校验 `dependencySpecs` 中的本地 `.tgz` 必须登记在 `requiredTarballs`。
8. 校验 `requiredTarballs` 必须存在于 `vendor-tarballs.manifest.json`。
9. 校验 tarball 的 `sha256` 必须与 manifest 一致。
10. 校验 tarball 的 `allowedProfiles` 必须包含当前 profile。

## 3. 必跑命令

- 单 profile：`node .local-context/hiui-design/scripts/check-sync-profile-contract.mjs --profile legacy-minimal --json`。
- 全 profile：`node .local-context/hiui-design/scripts/check-all-sync-profile-contracts.mjs --json`。
- skill 源码维护时：在 skill 根目录执行 `node scripts/check-all-sync-profile-contracts.mjs --json`。
- 旧输出清理 dry-run：`node .local-context/hiui-design/scripts/typical-page-clean-stale-outputs.mjs --json`。
- 旧输出清理 apply：`node .local-context/hiui-design/scripts/typical-page-clean-stale-outputs.mjs --apply --json`，执行前必须确认 dry-run 只命中陈旧 contract 或 registry entry。
- bootstrap JSON 验证：检查输出里的 `syncProfileContract.status` 必须为 `passed`。

## 4. 异常场景

- tarball 缺失：停止安装，补齐 `vendor/*.tgz` 或改为受控 registry spec；不得让 `npm install` 到半途才失败。
- tarball hash 不一致：视为包内容漂移，必须恢复 tarball 或同步更新 `vendor-tarballs.manifest.json` 与测试证据。
- 脚本目标缺失：删除该脚本注册或补齐对应 `.mjs`，不得留下明确会失败的命令。
- profile 未声明：默认 fail closed；只有维护者本地排障可以临时跳过，CI 不允许跳过。
- `.local-context` 被整体忽略：必须写入 gitignore 边界，至少允许必要 rules、scripts、config、schemas 与 vendor tarball 被提交。
- Node 16 与系统 pnpm 冲突：使用 `npx pnpm@8.6.12 install` fallback，不自动升级项目 Node 或 pnpm。
- stale outputs 干扰 doctor：先运行 `typical-page:clean-stale-outputs -- --json` 做 dry-run；确认后再运行 `typical-page:clean-stale-outputs -- --apply --json`，脚本会备份并清理陈旧 `outputs/page-contracts/**` 与重建 `managed-pages.index.*`，不要把 stale contract 解释成 runtime 接入失败。
- `runtimeIntegrationReady=true` 但 `onboardingCompletionReady=false`：表示运行时接入可用但页面级验收未完成，不是逻辑冲突。
- `npm audit` critical 来自上游依赖链：记录风险和升级计划，不执行破坏性 `npm audit fix --force`。
- 构建 chunk 警告：进入性能治理，不阻断接入；正式业务页再做按路由拆包。

## 5. 回滚边界

- 回滚 `package.json`：恢复本次新增或修改的 `typical-page:*` scripts、`dependencies`、`devDependencies`。
- 回滚 lockfile：恢复 `package-lock.json`、`pnpm-lock.yaml` 或 `yarn.lock`。
- 回滚 `.gitignore`：恢复前确认本地 tarball 是否仍需要提交；如果继续使用 file tarball，不得重新整体忽略 `.local-context`。
- 回滚 `.local-context/hiui-design`：只删除本次 profile 新增文件；不要删除整个 outputs 目录。
- 回滚 stale cleanup：优先从 `.local-context/hiui-design/outputs/.stale-backup/<timestamp>/` 恢复。
- 回滚 legacy 页面：先运行 `typical-page:light-rollback --plan <light-plan.json> --json`，确认范围后再加 `--apply`。
- 回滚 workbench：重新执行 minimal 同步，并删除 workbench-only 的 examples、reference、references、scripts/tests 等资产。
