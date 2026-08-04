# 接入模式

## 目的

本文件只负责说明 `hiui-design` 的三种接入模式，以及各自的边界。

全局默认 mode 不存在；默认值必须由 `rules/mode-selection.md` 根据项目画像、runtime 兼容性与宿主承载能力计算。脚本实际输出用于核实当前项目状态；若脚本输出和 `mode-selection.md` 的判定意图冲突，应把冲突视为待修复问题，而不是把错误输出固化为规则。

发生冲突时：

1. `rules/mode-selection.md`
2. 脚本实际输出与项目 mode lock
3. 本文件
4. `one-click.md` / `install-and-host.md` / `SKILL.md` 中的摘要描述

## 接入状态术语

- `bootstrapWritten`：只表示接入脚本已经写入或同步 `.local-context/hiui-design/`、`package.json` 脚本、依赖声明、参考资产或 host assets；它不表示 doctor、build 或页面生成已可用。
- `modeLocked`：表示 `.local-context/hiui-design/outputs/project-mode.json` 存在，且 `mode`、`recommendedMode`、`projectType`、`framework`、`runtime` 等项目画像字段完整；mode 与推荐模式不一致时，必须存在显式 override 与非空原因。
- `dependencyInstalled`：表示依赖安装已经成功，或有可验证的 lockfile / node_modules 证据；`dependency install failed`、`timed-out`、`not-requested` 都不能被解释为依赖完成。
- `hostAssetsReady`：对 `host-integration` 表示 host bridge assets、route mount、shell styles、Vite alias 等宿主接线已完成；对 `legacy-host-compatible` 表示 host contract、adapter readiness、HiuiLegacyPage runtime、compiled PageSpec 和 runtime compatibility lock 已完成；对 `rules-only` 表示宿主已有结构与页面落点事实已确认，不要求接管正式路由。
- `doctorPassed`：表示对应项目接入 doctor 已执行并通过；`not-run`、`skipped`、`warn-only-with-hard-fail` 都不能被解释为通过。
- `engineeringPassed`：至少表示 build 通过；若 lint script 存在，lint 结果必须被记录，失败时必须说明是否阻断和后续处理责任。
- `runtimeIntegrationReady`：只表示当前 mode 的运行时 / contract / blockingReasons 事实可继续被页面生成链消费；它不是完整接入完成态，不能替代 doctor / build 门禁。
- `integrationReady` / `onboardingCompletionReady`：只能在 `modeLocked=true`、`doctorPassed=true`、`engineeringPassed=true` 且当前模式必需的 assets / contract / route / runtime gates 已满足时为 true；单独的 `bootstrapWritten=true`、脚本表存在、`src/typical-page-reuse/` 存在或预览页可打开都不能代表接入完成。
- 使用 `--skip-doctor-gate`、`--no-install`、manual route snippet、install timeout 或 route/app-frame not-applied 时，必须把状态标记为 partial / not-verified，并明确“不可声明 hiui-design 接入完成”。

## 接入审计入口

当项目出现“React + HiUI 组件已安装但 hiui-design 未完全接入”、“存在 `typical-page:*` 脚本但缺少 mode lock”、“`mode` 与 `recommendedMode` 不一致”或“bootstrap 已写入但 doctor/build 未完成”时，先运行只读审计工具，不要直接进入页面生成：

```bash
node ".local-context/hiui-design/scripts/audit-project-onboarding.mjs" --json
```

- 审计事实源：`package.json`、`.local-context/hiui-design/`、`.local-context/hiui-design/outputs/project-mode.json`、`.local-context/hiui-design/outputs/project-integration-state.json`。
- 审计只读：不写入、不删除、不修复目标项目文件，只输出接入缺口和模式风险。
- 发现 `install-mode-mismatch` 时：若确为例外，必须先通过 bootstrap / apply / setup 的 `--allow-mode-override --override-reason <reason>` 重新落盘审计原因；否则回到推荐 mode 重新接入。
- 发现 `onboarding-completion-not-ready` 时：不要把 bootstrap 成功当完成；继续补跑 doctor 与工程门禁，直到 `doctorPassed=passed`、`engineeringPassed=passed`。

## 已有系统默认模式：`rules-only`

适用：

- 旧项目已经有自己的目录结构、布局结构、路由结构
- 只希望把典型页规则带进项目
- 页面生成时直接落在目标项目自己的 feature / page 目录里
- 目标项目是已有系统、自定义布局、Umi、Next、微前端，或无法安全自动 patch 正式路由

行为：

- 保留 `.local-context/hiui-design/`
- 注册 `typical-page:*` 脚本
- 补 `@hiui-design/typical-page-shells` 依赖基线，让生成的典型页可以接入标准页壳运行时
- 默认同步一份 reference-only 典型页到 `.local-context/hiui-design/reference/host-integration/src/`
- 默认不把示例页、route gallery、宿主桥接文件同步到目标项目 `src/`
- 默认不自动 patch 路由
- 默认不自动 patch Vite alias
- `project integration ready` 只表示 rules-only 的项目接入、依赖与宿主前提已被 doctor / 工程门禁证明；某个典型页是否能命中标准 `page-component`，由 planner 在页面阶段按资产事实单独判断
- `rules-only` 不是 `greenfield` 新项目的 fallback、快捷接入或 reference-assets 降级路径

生成方式：

- 先读 `generation-principles.md`
- 再读 `page-type-map.md`
- 再读 `rules-only-component-matrix.md`
- 再读 `figma-page-rules.md`
- 再读命中的 `figma-pages/*.md`
- 最后在目标项目既有目录结构中生成真实业务页

额外要求：

- `rules-only` 不能只判页型，不判组件落点
- 进入真实业务页生成前，先用 `rules-only-component-matrix.md` 明确页头、筛选区、表格区、分页区、底栏分别落到哪一类 HiUI 5 组件语义或宿主基座
- 如果目标项目后续被提升为 `legacy-host-compatible`（旧宿主桥接接入模式），则不再按本节 `rules-only` 口径执行；改把该矩阵与 `legacy-host-compatibility.md` 一起读，写清楚当前页映射到宿主哪个页面基座

参考示例：

- 优先把 `.local-context/hiui-design/reference/host-integration/src/pages/*` 当作本地参考模板
- 若 reference 目录不存在，再回退到 `examples/host-integration/src/pages/*`
- 不把这些模板页挂进目标项目正式路由
- reference-only 示例只作为结构参考，不进入业务菜单、不接管宿主路由，也不代表 `greenfield` 项目已经完成 host 接入

## Greenfield 默认模式 / 显式模式：`host-integration`

适用：

- 需要一组可直接打开的典型页示例
- 需要基线联调页 / smoke gallery
- 需要宿主桥接示例帮助开发者接线

行为：

- 同步 `examples/host-integration/` 到目标项目
- 仅对 `greenfield` 项目自动 patch 路由
- 可选自动 patch Vite alias
- 可对接 `node ".local-context/hiui-design/scripts/typical-page-doctor.mjs"` 和 `SMOKE_REPORT.md` 做示例页基线联调
- 若目标项目被识别为 `existing-system`，即使显式使用 `host-integration`，也只同步 smoke/gallery 资产与桥接示例，不自动并入正式路由树
- `project integration ready` 只表示 host assets / 依赖 / 路由接线已被 doctor / 工程门禁证明；普通典型页是否可直接走 `page-component + slot-fill`，仍由 planner 的资产解析结果决定

使用方式：

- `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode host-integration`
- `apply-in-current-project.mjs --mode host-integration`
- `bootstrap-target-project.mjs --mode host-integration`
- 或本地脚本入口：`node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode host-integration`

## 显式模式：`legacy-host-compatible`（旧宿主桥接接入模式）

适用：

- 目标项目主运行时仍是 React 16/17 或等价旧宿主
- 目标项目以 `hiui5` alias / 本地封装的方式局部接入 HiUI 5
- Module Federation / 老后台宿主主树默认不预设可直接承载标准 `@hiui-design/typical-page-shells` 运行时

行为：

- 继续保留 `.local-context/hiui-design/` 与 reference-only 示例页
- 自动补 `@hiui-design/typical-page-shells` 依赖声明，但 React 16.8 到 16.13.x 必须指向 `vendor/hiui-design-typical-page-shells-0.1.2-legacy.tgz`；不得把现代 tarball 当作 legacy 主树的默认接入前提
- 不同步 route gallery / 宿主桥接文件到目标项目 `src/`
- 生成时继续使用页型、结构节奏、contract 与 doctor 约束；普通典型页主链路改为 `host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots`，legacy 主树里的具体运行时承载由 `src/hiui-runtime/*` 统一处理。若已隔离出独立现代运行时入口，则改走 `isolated-standard-shell`
- 该模式下 `project integration ready` 的定义本身就必须覆盖 host contract、必需 adapter readiness、HiuiLegacyPage runtime 与 compiled PageSpec；这是 legacy 独有的接入完成态，不向 `rules-only` / `host-integration` 扩散
- 因此，一旦 `legacy-host-compatible` 项目接入链 `apply:legacy` 完成且 project integration state ready（`legacy:init` 只作为 apply 内部步骤），普通典型页默认就应支持沿 `light-plan` + `legacy:new|rewrite --plan` 页面生成链，以替换 typed slots 的方式生成页面；若 host contract 或 HiuiLegacyPage runtime 仍缺失，应解释为接入 / bootstrap 未完成，而不是生成阶段补 carrier rollout
- React 低于 16.8 时，`runtime-compatibility-lock.json` 必须写入 `shell.status=blocked` 且 `project-integration-state.json` 必须 `integrationReady=false`
- pnpm 项目在 Node 16 环境下遇到系统 pnpm 要求 Node 18 时，安装命令降级为 `npx pnpm@8.6.12 install`
- 接入验收使用 `typical-page:doctor:integration`，不要让存量业务样式问题阻断本次接入状态；hiui-design 不提供存量业务样式体检入口
- 回滚文件和异常场景按 `docs/onboarding/legacy-host-compatible-rollback.md` 执行

使用方式：

- `node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode legacy-host-compatible`
- `apply-in-current-project.mjs --mode legacy-host-compatible`
- `bootstrap-target-project.mjs --mode legacy-host-compatible`
- 或本地脚本入口：`node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode legacy-host-compatible`
- 验收入口：`node ".local-context/hiui-design/scripts/typical-page-doctor-integration.mjs"`

## 选择原则

- 若脚本运行在 `--mode auto`，会先判断目标项目画像
- 若目标项目被判定为 **新项目 / 轻骨架 React + Vite**，默认选 `host-integration`
- 若目标项目已有稳定结构，默认选 `rules-only`
- 若目标项目被判定为 **旧宿主不兼容运行时**，自动提升为 `legacy-host-compatible`
- 若目标项目被判定为 **已有系统 / 旧框架 / 微前端 / Umi / Next**，默认选 `rules-only`
- `greenfield` 新项目默认选 `host-integration`；已有系统只有在“需要示例页和宿主桥接联调”的时候才显式选 `host-integration`
- 不要把 `host-integration` 当成所有项目的全局默认安装方式，也不要把 `rules-only` 当成新项目的快速降级安装方式
- 已有系统即使显式使用 `host-integration`，也只建议把它当作 smoke gallery / 联调页，不建议直接覆盖正式宿主

## 维护约定

- 修改默认接入行为时，先改脚本，再更新本文件
- 其他文档只保留摘要，不重复展开两种模式的完整定义
