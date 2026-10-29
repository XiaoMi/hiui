# 一键接入

## 给 AI 的最短话术

如果你是设计师，不需要自己理解脚本细节，直接让 AI：

- 首次接入优先用 `--mode auto` 接入
- 若项目还没有完整 `.local-context/hiui-design/`，先从 skill 包根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root> --mode auto`
- 项目本地 context 补齐后，再执行 `setup-for-designers.mjs --mode auto`
- 最后检查 `package.json` 和 `.local-context/hiui-design/` 是否就绪；脚本会先复用已记录 mode 或已存在的 host 资产证据，没有这些证据时再判断目标项目是否需要项目本地兼容桥

## 首次接入

如果目标项目里还没有 **整个** `.local-context/hiui-design/` 目录，先在 skill 包根目录执行：

```bash
cd "${CODEX_HOME:-$HOME/.codex}/skills/hiui-design"
node scripts/ensure-in-current-project.mjs --target <project-root> --mode auto
```

这一步先把项目本地 hiui-design 物料同步进去，并把页面任务门禁收敛到 `ensure-only`。这里的 `ensure-only` 表示“接入物料已同步，但还没完成页面生成放行”。

若需要显式指定 `registry`（注册表地址，当前语境里指 `lcm` 拉取物料时使用的源地址），优先设置 `HIUI_DESIGN_LCM_REGISTRY` 与 `HIUI_DESIGN_GIT_REGISTRY`（新的环境变量名，当前作用是给开源版 `hiui-design` 指定 registry）；旧的 `HIUI_DESIGN_OPEN_LCM_REGISTRY` 与 `HIUI_DESIGN_OPEN_GIT_REGISTRY`（旧环境变量名，当前只保留兼容作用）仍然有效。

当目标项目里已经有 **整个** `.local-context/hiui-design/` 目录后，再执行项目内接入入口。

关于为什么这一步不能用 `lcm init` / `registry add` / `link` 代替，见：

- [`../architecture/project-context-materialization.md`](../architecture/project-context-materialization.md)

接入模式说明见：

- [`integration-modes.md`](integration-modes.md)

在项目根目录执行：

```bash
node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode auto
```

默认行为：

- 自动判断目标项目类型，用于 adapter guidance 和风险提示
- `--mode auto` 时优先复用已记录的 `appliedMode`
- 若没有这些项目级证据，脚本就只判断当前项目是否需要项目本地兼容桥；不需要时自动走 `host-integration`，需要时自动走 `rules-only`
- 首次接入优先用 `--mode auto` 接入；若目标项目属于原生兼容载体且没有明确阻塞证据，自动模式通常会落到 `host-integration`；若需要项目本地兼容桥，则自动落到 `rules-only`
- 裸跑 `setup-for-designers.mjs` 更适合已经存在 mode 证据、需要复用既有接入决策的重复同步
- `setup-for-designers.mjs` 会先同步接入物料，再执行一次 `typical-page:preflight` 作为页面任务开门检查；只有在显式附加 `--with-doctor-gate` 时，才额外执行一次 `typical-page:doctor` 作为验收
- 如果 `preflight` 未通过，脚本同样非零退出；先补齐轻量宿主兼容基线，再开始写页面
- `--skip-doctor-gate` 仅保留为兼容参数；默认流程本身已不自动运行 doctor
- 首次接入重验收、运行时排障或正式交付证明时，再显式附加 `--with-doctor-gate`
- `apply` / `ensure` 只会把 `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json` 写成 `ensure-only`；这只表示 hiui-design 接入物料已同步。只有 `preflight` 通过后，这个页面任务门禁才会被切到 `ready-to-generate`，此时才对外代表“接入完成，可开始生成页面”
- 同一个状态文件还会明确写出 `integrationComplete` 与 `userVisibleState`；只要它们不是 `true` 和 `integration-complete`，就不能把当前项目对外表述成“接入完成”
- `preflight` 还会先刷新 `.local-context/hiui-design/outputs/PROJECT_HOST_CONTRACT.json`。这是项目宿主合同文件，当前语境里是项目级宿主事实的唯一机器事实源；后续 `generation-brief.mjs` 和 `plan-page-task.mjs` 都应优先读取它，不再在主路径里重新扫描一遍项目导航
- 如果 `PROJECT_HOST_CONTRACT.json` 缺失、无效，或它依赖的关键证据文件已经变化，`generation-brief.mjs` / `plan-page-task.mjs` 会直接停止并要求重跑 `typical-page:preflight`，而不是继续猜目录、猜挂靠点
- `preflight` 同时会刷新 `.local-context/hiui-design/outputs/PAGE_TYPE_CAPABILITY_REPORT.json` 与 `.local-context/hiui-design/outputs/AI_GENERATION_READY_CONTEXT.json`；前者告诉你当前项目哪些页型可直接生成，后者是 AI 真正开始写业务页前应优先读取的最小上下文
- 旧项目接入时，`apply` / `setup-for-designers` 会一并托管本地运行时、共享 peer、以及 `hiui5-*` 这类隔离 alias 依赖；缺失 alias 会自动补齐，明显不兼容的 alias 会自动修正，已经满足运行时合同的兼容 alias 会保留，不需要再靠人工补 `hiui5-check-select`、`hiui5-tabs`、`hiui5-upload` 等包

### lcm / 沙箱失败处理

注意：

- 当前 `lcm init` 只会创建通用 `.local-context/` 根目录与 registry 配置，不会直接把 `.local-context/hiui-design/` materialize 到目标项目
- 因此即使 `lcm` 成功，目标项目仍需要先通过全局 `ensure-in-current-project.mjs` 或其他显式同步方式拿到完整 `.local-context/hiui-design/`，才能继续执行项目内 `setup-for-designers.mjs`

如果脚本卡在：

```bash
lcm init --registry <configured-open-registry>
```

通常不是典型页脚本本身坏了，而是当前运行环境的沙箱或网络访问不到已配置的 registry。

处理方式：

- 不要改接入步骤
- 不要跳过后续典型页脚本
- 直接把**同一条**接入命令切到沙箱外重跑

例如在项目本地 context 已完整存在时：

```bash
node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode auto
```

如果你明确只想先跳过 `lcm` 初始化与 Cursor link，也可以在项目本地 context 已完整存在时临时加：

```bash
node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode auto --skip-lcm
```

但这只是降级路径；需要内部 registry 初始化时，仍应优先在沙箱外重跑原命令。

## 后续重复同步

优先执行：

```bash
pnpm typical-page:designer-setup
```

或：

```bash
npm run typical-page:designer-setup
```

## 结果判断

执行完成后，项目里至少应该保留：

- `.local-context/hiui-design/`

并且 `package.json` 里应有：

- `typical-page:apply`
- `typical-page:designer-setup`
- `typical-page:preflight`

并且要先验证：

- 模版页面没有被同步进目标项目的 `src/` 目录
- AI 生成首个业务页时，会直接落到目标项目既有目录结构中，而不是新建一套 `src/typical-page-preview/` gallery
- 项目不再接入 preview 宿主；典型页面示例统一只从 skill 包内 `preview-runtime/` 打开，不应混入正式业务导航
- `setup-for-designers.mjs` 已自动跑完 preflight；只有脚本成功结束且页面任务门禁被写成 `ready-to-generate`，才说明接入完成并可继续生成业务页
- 页面任务门禁打开后，可额外核对 `.local-context/hiui-design/outputs/PROJECT_HOST_CONTRACT.json` 是否已生成；它存在且有效，才说明后续页面规划和页面生成拿到的是同一份项目级宿主事实
- 若需要同时产出接入验收结论，再显式重跑 `pnpm run typical-page:designer-setup --with-doctor-gate` 或 `npm run typical-page:designer-setup -- --with-doctor-gate`
- 若后续修改了 `package.json`、锁文件、入口文件、构建配置或项目本地 `.context.jsonc`，freshness 校验会自动把页面任务门禁重新视为关闭；此时必须重跑 `typical-page:preflight`

设计师如果只想继续让 AI 完成这一步，可以直接说：

- 请重新同步典型页面生成能力，并检查接入结果
- 请优先用 `--mode auto` 重新接入；如果脚本明确判断需要退回 `rules-only`，再说明为什么

## 失败边界

这个入口不会：

- 自动替换目标项目现有布局文件
- 在高度定制的路由结构里强行改写路由

如果路由无法安全自动 patch，会输出挂载片段，交给开发者补最后一步。
