# legacy-host-compatible 轻量页面生成流程

本文面向业务项目使用者，目标是让 AI 一次按 HiUI 典型页链路生成正确页面，而不是先手写再靠验收纠偏。

## 四步主流程

1. 接入项目：`typical-page:apply:legacy`。默认同步 profile 是 `minimal`，只带页面生成、runtime、规则、计划、合同和验收所需资产；维护者排障才使用 `typical-page:apply:legacy:workbench`。接入必须写入 `.local-context/hiui-design/outputs/runtime-compatibility-lock.json` 与 `.local-context/hiui-design/outputs/runtime-seal.json`，用于证明 legacy runtime 的 peer/export resolution、canonical shell binding 与 runtime core provenance。
2. 生成计划：`typical-page:light-plan --page-type <id> --page <page-path> --summary <summary>`。该计划是 `page-task-plan.v1` 的轻量执行投影，包含 pageType、pagePath、writeScope、dataMode 和 validationLevel。
3. 生成页面：`typical-page:legacy:new --plan <light-plan.json>` 或 `typical-page:legacy:rewrite --plan <light-plan.json>`。生成器会自动执行 writeScope、slot gate 和 change size gate；失败时状态为 `generated-blocked`，不得包装成交付完成。
4. 验收页面：`typical-page:legacy:accept --profile preview|delivery`。preview 面向本地预览闭环，delivery 必须有真实宿主 runtimeCapture、visualEvidence、domGeometry 和 adapterGate 证据；两种 profile 都必须先通过 runtime seal、canonical shell binding、runtime provider contract、peer/export resolution 与危险 build warning 分类，不能用业务页 primitive runtime 代替官方典型页壳；官方 shell 在宿主依赖下不可用时，只能在 `src/hiui-runtime/adapters/**` 提供受管 adapter 并提交 `.local-context/hiui-design/outputs/runtime-provider-contract.json`。
   - 当传入 `--runtime-evidence <json>` 时，`typical-page:legacy:accept` 只校验该证据，不要求目标项目存在 `node_modules/react/umd/react.development.js` 或 `node_modules/react-dom/umd/react-dom.development.js`。
   - 当 `--runtime-url` 指向 `dist/hiui-runtime-harness.html` 时，runner 会生成 `dist/hiui-runtime-harness.html` 并复制 React / ReactDOM UMD 到 `dist/vendor/`；缺失 UMD 必须作为 `runtimeHarness` gate 失败处理，不能中断 JSON report，也不能标记 preview-ready。
   - 当 `--runtime-url` 指向真实宿主页时，不应把 harness 依赖当作接入前置；真实宿主页面的通过与否由 `runtimeCapture`、`runtimeDom`、`domGeometry`、`visualEvidence` 和 `adapterGate` 决定。

## 辅助命令

- `typical-page:light-readiness --plan <light-plan.json>`：汇总当前页面是否已经满足 preview 或 delivery 条件。
- `typical-page:adapter-gate --profile delivery`：单独检查宿主 adapter 的声明和实测事实。
- `typical-page:dom-geometry-gate --runtime-evidence <json> --profile delivery`：单独检查 DOM 几何结构是否符合典型页关键关系。
- `typical-page:light-rollback --plan <light-plan.json>`：默认 dry-run；确认清单后再追加 `--apply`。
- `typical-page:clean-stale-outputs -- --json`：dry-run 检查旧 `page-contracts` 和 `managed-pages.index.*` 是否指向已不存在页面；确认后再追加 `--apply`，脚本会先备份到 `.local-context/hiui-design/outputs/.stale-backup/<timestamp>/`。
- `node .local-context/hiui-design/scripts/check-sync-profile-contract.mjs --profile legacy-minimal --json`：检查 legacy minimal 的同步文件、脚本目标、本地 tarball 与 hash 是否形成闭包。
- `node .local-context/hiui-design/scripts/check-all-sync-profile-contracts.mjs --json`：维护者检查所有声明 profile；业务项目默认只需要 legacy minimal 或当前接入 mode 对应 profile。

同步 profile、三条接入链路、异常场景与回滚边界详见 `docs/onboarding/sync-profile-contracts.md`。

## 异常场景

- 没有 light plan：停止生成，先补 `typical-page:light-plan`；不要回退到手写页面链路。
- `generated-blocked`：保留已写文件继续修复，但不能进入 preview-ready 或 delivery-ready。
- `preview-ready`：只能说明本地预览证据通过，不能替代真实宿主交付。
- `delivery-ready`：必须证明 runtime evidence 来自非本地宿主，并且视觉证据、DOM 几何和 adapter gate 通过。
- `runtimeHarness` 失败：先补齐宿主依赖安装产物或改传真实宿主 `--runtime-url` / 已生成的 `--runtime-evidence`；不要手动把 React UMD 文件提交进业务源码。
- workbench 资产误入项目：按 `docs/onboarding/legacy-host-compatible-delivery-boundary.md` 清理，并重新用 `--sync-profile minimal` 同步。

## 回滚

- 单页回滚先运行 `typical-page:light-rollback --plan <light-plan.json> --json`。
- 只有 dry-run 清单全部属于本次页面目录、page contract 和 acceptance report 时，才执行 `typical-page:light-rollback --plan <light-plan.json> --apply --json`。
- 如果 light plan 丢失，按 `docs/onboarding/legacy-host-compatible-rollback.md` 人工逐文件回滚，不要直接删除整个 `.local-context/hiui-design`。
