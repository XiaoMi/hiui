---
name: hiui-design
description: >-
  面向开源发布的 hiui-design skill，用于生成和维护 HiUI 典型页面能力包。
  包含项目判型、rules-only / host-integration
  模式选择、宿主接入脚本、示例页面、smoke gallery、doctor 校验、依赖版本快照、
  可选嵌入来源快照与 Vite shim。
  触发词包括“典型页”“典型页面”“数据统计表”“普通表格”“树形表格”“左树右表”“抽屉表单”
  “抽屉详情”“全页编辑”“全页详情”“host-integration”“rules-only”“smoke”“doctor”。
---

# HiUI 典型页开源技能

## P0 Hard Gate

在任何页型判断、母版选择、业务代码读取或接入推演之前，先看项目级 `integrationReadiness`。只要命中下面任一状态，本次任务就必须立即收敛成 `ensure-or-stop`：

- `missing-context`
- `missing-apply-state`
- `invalid-apply-state`
- `invalid-applied-mode`

未 ready 时只允许两类动作：

- 运行 `generation-brief.mjs` / `plan-page-task.mjs` 返回的 `typical-page:ensure` 命令
- 向用户报告当前阻断事实、阻断原因和下一步 ensure 命令
- 若只是为了拿到下一步 ensure 命令，默认只运行最小 gate：只传 `--target` 和可选 `--mode`；在 `integrationReadiness.ready=false` 时，不要提前传 `--page-type`、`--page-family`、`--title`、`--dest`、`--route-path` 等页面塑形参数

未 ready 时明确禁止：

- 读取目标项目现有业务页并做结构拆解
- 分析共享实现复用方案
- 定位按钮挂载点、路由挂靠点、菜单注册点、`window.addPage` / Module Federation `exposes`
- 选择官方母版、规划 host shell、推演 formal navigation 接入
- 用旧业务页、普通 `PageTable`、空白页手写或其他宿主兼容分支替代 hiui-design 接入

当 `integrationReadiness.ready=true` 后，还必须继续看项目级页面任务门禁文件 `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json`：

- 只有 `pageTaskReadiness = ready-to-generate` 时，才允许开始任何业务页写入、模板选择、旧页复用分析或正式导航挂接规划
- `pageTaskReadiness = ensure-only`、状态文件缺失、或 freshness 校验发现 `package.json`、锁文件、入口文件、构建配置、项目本地 `.context.jsonc` 任一发生漂移时，页面任务仍然必须停在阻断态
- 阻断态下下一步只允许执行 `typical-page:preflight` 或 `generation-brief.mjs` / `plan-page-task.mjs` 返回的 ensure 命令；不得直接开始写页面

## 目标项目先决条件

目标项目里必须存在完整的 `.local-context/hiui-design/` 目录。没有这个目录时，先停止生成，先把整个目录复制进去，再继续。

项目是否“已经完成接入物料同步”，默认只看两个轻量项目级信号：

- 本地存在 `.local-context/hiui-design/`，且至少具备 `.context.jsonc` 与 `scripts/apply-in-current-project.mjs`
- `.local-context/hiui-design/outputs/HIUI_DESIGN_APPLY_STATE.json` 存在，且 `appliedMode` 是合法的非 `auto` 模式

`HIUI_DESIGN_APPLY_STATE.json` 只要求存在合法的非 `auto` `appliedMode`。官方 preview 现在统一留在 skill 包内 `preview-runtime/`，不再把 preview 物化状态写成项目级契约。

只要这两个信号成立，就只说明项目级 hiui-design 物料已同步；不要把 `doctor`、smoke、浏览器截图、依赖隔离或 build 结果混进“物料是否已同步”的前置判断。

对外只有当 `PROJECT_PAGE_TASK_STATUS.json` 明确放行为 `ready-to-generate` 时，才视为“接入完成，可开始页面任务”。页面任务是否可开始，额外看 `PROJECT_PAGE_TASK_STATUS.json`：

- `apply` / `ensure` 成功后会把它写成 `ensure-only`，这只代表物料已同步，不代表可以开始页面生成
- `typical-page:preflight` 只有在页面生成放行条件全部满足时才会把它写成 `ready-to-generate`
- `PROJECT_PAGE_TASK_STATUS.json` 现在还会显式写出 `gateStatusReason`、`staleInputs`、`nextRequiredAction`、`canAutoRecover` 和 `contractSnapshotId`；AI、planner 和 brief 必须复用这同一套门禁字段，不再各自拼第二套阻断文案
- 对 `rules-only`，接入阶段还必须尽量补齐并证明项目级公共外壳基线，例如 app entry 对本地 host baseline CSS 的引入；`publicShell.status = blocked` 时页面任务仍然必须停在阻断态；`not-checked` 说明证据不足，应优先补齐 baseline，但不再自动等同于硬阻断。对 `rules-only + existing-system + Module Federation direct expose`，这里的 app entry 样式 import 只代表 `projectEntryShellReady`，不自动代表 `mfPublishEntryShellReady`；真实发布单元仍要看 expose 最终是否指向受管 publish entry。
- 一旦项目关键输入发生漂移，freshness 校验会自动把这道门重新视为关闭，要求重新执行 preflight
- React 19 项目还必须保留受管 runtime patch 基线：`package.json` 里的 `typical-page:runtime-patch`、`postinstall -> apply-runtime-patches.mjs`，以及项目本地 `.local-context/hiui-design/scripts/apply-runtime-patches.mjs` 必须同时存在；缺任一项时 `typical-page:preflight` 必须继续阻断页面生成。若 `node_modules` 里已存在 `react-resize-detector` / `rc-resize-observer` 热点文件，`typical-page:preflight` 还必须确认这些已安装文件已经落到 patched 状态，不能只看脚本接线存在就放行
- 状态文件会显式写出 `integrationComplete=false/true` 与 `userVisibleState=materialized-only/integration-complete`；AI 与人都必须以这两个字段配合 `pageTaskReadiness` 理解结果，不再把 `ensure-only` 误读成“接入完成”
- 每次 `typical-page:preflight` 还会刷新 `.local-context/hiui-design/outputs/PAGE_TYPE_CAPABILITY_REPORT.json` 与 `.local-context/hiui-design/outputs/AI_GENERATION_READY_CONTEXT.json`；前者给出当前项目可生成/不可生成的页型矩阵，后者给出 AI 写页前必须读取的最小上下文
- 这两份产物在项目接入阶段只负责回答“项目是否 ready”与“宿主支持哪类挂载机制”；只有当页面生成阶段已经拿到具体页级输入（如 `dest`、标题、路由名、expose 名或显式 `navigationMountContract`）后，才允许把挂载机制进一步收口成具体 `navigationMountDecision` / `navigationMountAction`

一旦项目已经是 `pageTaskReadiness = ready-to-generate`，默认进入“稳态生成”：

- 标准典型 `page-type` 默认优先走 `.local-context/hiui-design/scripts/generate-page.mjs` 单入口
- 不要为了普通页面生成重复跑 `setup-for-designers.mjs`、`apply-in-current-project.mjs`、`ensure-in-current-project.mjs`
- 不要默认先做 `--dry-run` 再正式写页；只有用户明确要求审计、排障或逐段调试时，才回到分段脚本链
- 若只是重生成同一页或继续补内容，先复用现有 `PROJECT_HOST_CONTRACT.json`、`AI_GENERATION_READY_CONTEXT.json` 和 page-task gate，不再把项目拉回首次接入路径

`host-integration` 只是接入模式，不代表项目一定可生成。没有项目本地 context 或没有合法 `appliedMode` 时，即使目标模式是 `host-integration`，也仍然属于“接入物料未同步完成”。

一旦判定为“未接入完成”，后续动作必须收敛成 `ensure-or-stop`：真实写入链路先补 `ensure`，只读链路直接停止。不得改走目标项目现有 `PageTable`、空白页手写、`window.addPage` / 路由 / Module Federation `exposes` 猜测接入，或其他“先生成再补接入”的宿主兼容分支。

不要只复制其中一部分，例如：

- 只复制 `scripts/`
- 只复制 `examples/`
- 只复制 `vendor/`

## AI 默认生成路径（最高优先级）

当用户要求“基于 hiui-design / HiUI5 典型页 / 典型页面生成、修改或替换业务内容”时，默认不要先启动 heavy checks，也不要模仿目标项目旧业务页手写。只有在项目级 `integrationReadiness.ready=true` 且 `PROJECT_PAGE_TASK_STATUS.json` 明确放行为 `ready-to-generate` 后，才进入页型决策；对外也只有此时才叫“接入完成，可开始生成页面”。标准典型页走“官方母版 + 替换业务槽位”；`data-visualization` 这类独立能力页走“固定页头与 whiteBody + 规则驱动内容区生成”；`non-typical-page` family 走“family decision package + family generator”。标准典型页与 `non-typical-page` 的受管 page frame 默认都使用单一 `self-contained` `PageHeader`；宿主只负责内容挂载、高度链和样式资源。若存在共享 `header slot`，对非抽屉整页默认由新生成页面自带 `page-owned support file`：挂载时自动隐藏宿主页头、卸载时恢复；只有当前内容挂载区本身不可拉伸时才升级为宿主协同问题。

固定前提：

- `hiui-design` 生成的新页面默认就是业务页面，不需要再判断是不是业务页
- 一个项目默认对应一条业务线，不需要在普通页面生成阶段再额外判断业务线
- 正式业务页默认落到目标项目的业务页面目录；当缺少页级证据时默认根目录是 `src/pages`，但对 `existing-system`，一旦已确认 legacy 业务入口、`implicit-feature-registry` 或显式 `navigationMountContract`，`defaultBusinessPageDir` 必须收口到该项目已证明的既有业务目录，例如 `src/views`，不得把 `src/pages` 误当成通用禁令
- `src/typical-page-preview/**`、`/__typical-preview`、`createTypicalPagePreviewRoutes`、`ExampleAppShell` 都属于 preview 参考资产，只能参考，不能作为正式业务输出或正式路由入口
- 宿主公共排版基线只允许由 `TypicalPageHost` / `host-reset.css` 这类受管 host baseline 统一承接；若页面里出现“所有文字整体变大/变小”，先修 host baseline，不在业务页里逐块打补丁
- `rules-only` 模式下，这层 host baseline 也必须在接入阶段由项目 app entry 接起来；业务页面文件不负责补 `html / body / #root` 这类全局样式
- 但对 `rules-only + existing-system + Module Federation direct expose`，app entry 里的样式 import 只证明项目级 baseline ready，不代表 remote 页面真实消费链已经带上 `components/hiui-design-runtime/styles.css`；这类页面必须通过受管 publish entry 单独携带 shell styles，且不默认下沉 `hiui-design-host.generated.css`
- 业务页与业务页样式不得声明 `:root`、`html`、`body`、`#root`、`#__next`、`#app` 或 `h1-h6` 这类全局排版选择器来纠偏宿主字号；页面本地样式只负责布局和页型允许槽位
- 标准典型页与 `non-typical-page` family 的页面壳默认自带唯一 `PageHeader`；不得再把这两类页面的页头归属交给宿主共享 `header slot`
- 若宿主存在共享 `header slot`，它只承担历史兼容或宿主自己的共享布局职责；对标准典型页与 `non-typical-page`，新生成页面默认自带共享页头冲突处理，不默认自动改旧宿主
- 对非抽屉整页，白色主体铺到底部也遵循同一边界：默认由页面自带 `page-owned support file` 和页型壳层一起铺满当前内容挂载区，不再依赖宿主页型白名单逐页收口

AI 写代码前必须先读取 `docs/generation/ai-page-generation-guidance.md`，再完成并简短说明七件事。注意：这里的第一件事发生在上面的 P0 接入门禁已经通过之后，不替代 `integrationReadiness` / `PROJECT_PAGE_TASK_STATUS.json` 检查；并且只有在当前任务已经进入“生成某一张具体页面”的阶段时，才允许从项目级挂载机制继续推导页级挂载决策：

- 若项目里已经存在 `.local-context/hiui-design/outputs/AI_GENERATION_READY_CONTEXT.json`，优先把它当作页面生成前的机器上下文入口；若其中 `readyToGenerate=false`，必须停止生成并先消除 `blockedBy`
- 在形成 `navigationMountDecision` 之前，先形成单一 `pageRelationDecision`：它优先根据用户提示词诉求和显式上下文证据判断，例如“在某个列表页增加按钮，点击进入创建页/详情页”、`relatedPagePath`、目标目录是否仍在父模块目录下、是否缺少独立 `routePath` / `exposeName`。`page-type` 只负责选模板，不参与“这是子页面还是独立发布页”的主判断。
- `pageRelationDecision` 一旦在 brief 阶段形成，后续 `plan-page-task.mjs`、`generate-page-from-brief.mjs`、`integration-preflight.mjs` 只能消费或校验这份结论，不得在后半段自由重算另一套页面关系。若页面已生成且当前命令缺少部分父页面参数，允许从页面目录下的 `hiui-pagegen.meta.json` 复用已落盘的页面关系事实。
- 当页面关系已经是 `same-module-subview` 时，不得再默认推导独立 `expectedExposeTarget`，不得再自动要求 `mf-entry.*`，也不得把“编辑页/详情页长得像独立页”当成新的发布信号。若历史产物已经残留独立发布痕迹，优先使用 `page-relation-safe-fix.mjs` 清理 hiui-design 自己生成的残留入口，再重新跑 `integration-preflight.mjs`。
- 若 `same-module-subview` 已拿到完整 `parentFlowContract`（父子页流转合同，这里指父页哪个触发器进入子页的机器描述），且父页能被证明也是 hiui-design 自生成页面，允许生成器只在白名单结构内自动补父页触发器；白名单外场景必须输出 `manualPatchSuggestion`（人工补丁建议，这里指可直接执行的补丁说明），不得假装自动成功

1. **判页面挂靠点**：形成轻量 `navigationMountDecision`。规则只回答一件事: 这张页面挂到哪里，不回答“老项目导航是否官方认证”。项目接入阶段只允许产出“支持哪类挂载机制”的项目级事实，不得在缺少页级输入时提前要求用户确认某一张页面的挂载点。对 `existing-system`，只要能从现有路由注册表、`ModuleFederationPlugin.exposes`、业务入口文件、`window.addPage` / `openNewPage`、或 `import.meta.glob('/src/features/*/index.*')` 这类 `implicit-feature-registry` 中确认一个真实挂靠点，就先确认它；自动探测到多个旧入口但无法唯一选中时，允许由上层显式传入 `navigationMountContract.entryPath + entryKind`（可再补 `entryRoutePath` / `entryTitle` / `entryName`）来确认其中一个已存在入口。这里还要区分“挂靠入口”和“发布入口”：`ModuleFederationPlugin.exposes` 只证明正式发布单元，不单独证明页面源码应写入哪个业务目录；`defaultBusinessPageDir` 必须优先跟随已确认的 legacy 业务入口、`implicitFeatureBaseDir` 或显式 contract。只有 `greenfield + host-integration` 且当前项目还没有业务导航时，才允许补首个正式业务导航壳，并且这个新补的导航必须业务化复用 `examples/host-integration/src/app-frame-core.tsx` 与受管 `TypicalPageAppFrame` 的结构、样式和高度链，保证和官方典型页面一致。若当前项目属于旧项目且挂靠点无法证明，停止询问用户，不得先写页面、裸挂路由或手写近似导航壳。
   **显式导航 contract 约束**：若使用现有导航注册表 contract，`navigationMountContract.menuRegistryPath` 必须与 `navigationMountContract.routeRegistryPath` 指向同一份正式注册表；split menu/route registry 不在当前受管 contract 范围内。
2. **执行导航挂靠动作**：把 `navigationMountDecision` 落成轻量 `navigationMountAction`。对 `greenfield + host-integration + 尚无业务导航`，必须在写正式业务页目录前先完成挂靠动作；`create-first-formal-shell` 必须由 `generate-page-from-brief.mjs` 物化 `src/business-shell/app-frame.*`、`src/business-shell/routes.*`，并仅在真实 app entry 命中受支持的最小 ReactDOM bootstrap 时才 patch 入口，否则保持 `ask-user`。对 `existing-system`，页面源码生成与自动挂靠解耦：命中已受支持的路由注册表时，允许由 `generate-page-from-brief.mjs` 先 patch 现有 `src/business-shell/routes.*` / `src/business-layout/routes.*` / 已确认的项目路由注册表；若注册表缺少受支持的 `export const businessRoutes = [...]`，必须 fail closed 到人工挂靠说明，而不是继续冒充自动成功。命中 `ModuleFederationPlugin.exposes` 时，应优先把它视为正式发布入口证据，再决定 expose 注册与宿主映射的后续动作，其中 `rules-only + existing-system + direct expose` 默认落成 `materialize-mf-publish-entry`：先在页面目录旁物化受管 publish entry，让它单独携带本地受管运行时样式并转发页面模块，再把 `ModuleFederationPlugin.exposes` 改指向它，而不是继续把裸页面模块当成真实交付单元；命中 `implicit-feature-registry` 时，必须先按 `materialize-implicit-feature-entry` 在 `implicitFeatureBaseDir` 下物化一个可被现有 `import.meta.glob` 自动发现的直属子目录入口；命中显式 legacy 业务入口 contract 时，当前默认落成 `append-existing-entry` 的人工确认动作，继续生成页面源码并输出旧项目入口接入说明，而不是假装已经自动 patch。若旧项目挂靠点已确认但当前执行器不支持自动 patch，不得阻断页面源码生成；必须改为输出明确的人工挂靠说明。AI 不得提前手写或预创建正式业务壳。
   **补宿主桥接动作**：若挂靠到已有业务布局，且项目里存在 `PageHeaderPortal`、`role="page-header"`、`headerRef` 或同类正式页头槽，先记录共享 `header slot` 在标准典型页与 `non-typical-page` 未占用时是否会自动折叠。若宿主仍保留 shared-slot carrier，再额外检查是否存在 `TypicalPageHostProvider headerPortal={PageHeaderPortal}`（必要时同时 `footerPortal`）作为宿主兼容 bridge 证据，但它不再是标准典型页的页面合同，也不再单独开关项目级 page-task gate。与此同时，继续核对宿主出口对 `pro-table-page`、`pro-stat-page`、`pro-tree-split-page`、`pro-detail-page`、`pro-edit-page` 或等价认证壳是否提供连续 `display:flex` / `flex:1 1 0%` / `min-height:0` / `overflow:hidden` 高度链；若事实缺失，应输出宿主修复 guidance，并在异常排查、slot gate 或 doctor 验收阶段收口，不要把页头空白或白底不铺满当成单页问题逐页打补丁。
3. **判页型**：根据业务形态命中固定页型，例如常规列表命中 `table-basic`，指标列表命中 `table-stat`，树结构命中 `tree-table` / `tree-split`，少字段操作命中 `drawer-form` / `drawer-detail`，多字段流程命中 `full-page-edit` / `full-page-detail`。状态反馈 `feedback-status`、图表分析 `data-visualization` 等扩展页型只有在本地 `page-types.manifest.json` 已注册 `generationContract` 时才能直接生成；未注册时先说明缺口并补 manifest 或选择最接近已注册页型，不得脑补母版。
4. **选母版**：从 `docs/generation/page-types.manifest.json` 读取命中页型的 `generationContract.baseTemplatePath` 与 `requiredShell`。
5. **锁边界**：读取 `docs/generation/page-slot-boundaries.md` 中命中页型的小节，并在写代码前简短声明允许槽位、禁止槽位和 locked region。
6. **判覆盖**：形成轻量 `coverageDecision`；典型页已覆盖区域直接复用，`uncoveredUi` 为空时不展开重型组件/token 论证，`uncoveredUi` 非空或命中 escape hatch 时才补 `componentDecision` / `tokenDecision`。
7. **定工作流**：标准典型页按 `businessSlotPlan` 替换 `businessSlots` / `slotBoundaryContract.allowedSlots` 声明的标题、查询字段、表格列、请求、按钮、mock 数据和跳转目标；不能只改标题后保留示例业务词。`data-visualization` 则读取 `generationWorkflow`，只固定页头与 `whiteBody`，内容区域按规范整体生成；已有图表仅允许按图表级别从官方示例中选择性复制并替换业务内容，不复制整页；两类页型都保留官方壳层、样式结构、滚动链和视觉语法。

`data-visualization` 写代码前必须先走轻量 Golden Path，不再把图表主题、卡片模式和落图规划放到生成报告末尾补救：

- 先从业务问题抽取 `summaryMetrics`、`chartCards`，以及“若业务确实需要记录下钻/复核/后续操作承接时才补”的 `detailRows` 三组数据；`chartCards` 必须在代码里显式表达 `slotPlan` 与 `rowFillDecision` 的结果，避免最后一行孤图。
- 默认复制并导入同目录 `chart-theme.ts`，图表色板、轴线、legend、响应式和卡片视觉节奏优先来自 `hiuiChartTokens` 与主题 helper；不要让 AI 直接回退到图表库默认皮肤。
- 用统一 `MetricCard` / `ChartCard` 渲染摘要卡和图表卡；`ChartCard` 必须是固定 header + stretchable chart body，不允许每张图自由写 DOM 卡片。
- 图表必须是真实 `@ant-design/charts` 实例；没有业务数据时生成可信 mock 数据，不用 CSS 图、空白占位或“稍后替换”注释顶替。
- `queryFields + searchPlaceholder` 只承接 page-global control strip；若业务包含明细表，它继续作为同一 `whiteBody` 阅读流尾部收口；无此诉求时不要为了套示例硬补表格。

默认轻量自检只看十一项：是否已形成 `navigationMountDecision`、是否已在写页面前执行 `navigationMountAction`、是否已确认页面不是裸挂而是挂到真实业务入口、若是新项目首个导航则是否与官方典型页面导航壳一致、是否没有裸挂业务路由、是否声明页型、是否声明母版路径、是否保留 `requiredShell`、是否按 `businessSlotPlan` 清理示例业务词、是否未占用 forbidden slot / forbidden children、是否没有把接口未接入说明或生成说明渲染成页面常驻 UI。

新业务页不得新建 `src/components/BusinessAppShell.*`、`src/routes/business-routes.*` 作为正式导航替代品，也不得在 `App.tsx` 里直接裸挂业务页组件。正式业务导航只允许通过 `src/business-shell/app-frame.*` 与 `src/business-shell/routes.*` 承载；如当前项目入口无法确认，应先停止并说明需要人工指定入口，不得用自造左栏壳绕过规则。

默认轻流程必须保持轻：如果 `coverageDecision.uncoveredUi=[]` 且 `escapeHatches=[]`，不得要求 AI 对典型页已覆盖的统计卡片、筛选、表格、分页逐项重做组件/token 设计说明；这些区域由 manifest、母版和受管 shell 默认证明。只有模板未覆盖 UI、自由渲染、第三方组件或页面本地视觉 token 才升级到 HiUI5 组件/token 路由。

接口未接入、mock 状态、生成状态和测试说明只能写入最终回复、README、`hiui-pagegen.meta.json` 或按钮点击后的 `Message`；除非 manifest 明确允许公告/提示槽位，否则不得作为页面常驻内容渲染。

页面生成完成后需要返回一个可点击主链接：对 `Camora / 代理项目`，只要 `testBaseUrl + ExposeName` 可构造，就优先把测试环境当前页面直达链接作为主链接返回，固定按 `testBaseUrl + ?path=@common/<ExposeName>` 生成；若 `Camora / 代理项目` 只具备 `testBaseUrl` 或 `ExposeName` 其中一项，则直接 fail closed。存在正式 `routePath` 时，可额外补充业务页面链接，但它不是 Camora 场景下的主链接；该业务页面链接必须从目标项目 `README.md` 的固定行 `- localOrigin: http://...` 推导；若无法证明正式业务链接，不得回退成 host preview、本地 localhost 或其他猜测链接。官方 preview 参考只通过 skill 包内 `preview-runtime/` 查看，不再作为项目侧返回链接。

`doctor`、`dependency-isolation-check`、`integration-preflight`、smoke gallery 和浏览器截图只在首次接入、运行时报错、宿主壳/依赖变更、Module Federation 暴露变更、正式发布验收或用户明确要求验收时使用。它们是异常排查和交付验收工具，不是普通业务页生成的默认第一步。其中 `generate-page-from-brief.mjs` 在真实写文件前仍可能按工程安全兜底调用 `dependency-isolation-check`，但这不会改变“项目 page-task gate 只由 `typical-page:preflight` 打开”这一规则。对 React 19 项目，`doctor` 还应明确验证受管 runtime patch 接线是否仍在，以及 `node_modules` 里 `react-resize-detector` / `rc-resize-observer` 这类热点文件是否已经落到 patched 状态。

## 何时使用

在下面场景统一使用本 skill：

- 把 HiUI 典型页面能力带到一个新项目或已有项目
- 判断目标项目该走 `rules-only` 还是 `host-integration`
- 在目标项目里生成或修改典型页
- 在目标项目里生成、修改或验收 validated v1 scope 的 `non-typical-page` family 页面
- 用示例页、smoke gallery、doctor 校验宿主接入是否健康
- 让 AI 按固定页型与页壳起点生成业务页面

不要用于：

- 只做纯视觉评审但不涉及典型页壳层
- 手拼后台页面并绕开 `hiui-design` 官方受管入口与 `local-managed-runtime`

## 设计还原口径

当任务目标是“尽可能还原正式设计稿”，固定按下面口径执行：

- 设计还原和 `prototype-screenshot` 原型生成是两条链，不混用
- 设计还原优先走 `figma-design-restore`；`design-screenshot-restore` 只保留为第二阶段降级输入，不作为当前公开入口
- 当 `confirmedDesignRestoreInput.restoreDecisionPackage` 已经能形成单一路由结论时，主链允许自动补齐缺失的 `page-type` / `page-family`
- 设计还原结果仍必须落在 HiUI5 与 `local-managed-runtime` 约束内，不得退回自由页面生成
- 后置修复只作为兜底，不作为默认主路径；优先在写页前形成 `confirmedDesignRestoreInput`

## 单目录原则

本目录就是单 skill 成品。把 **`.local-context/hiui-design/` 整个目录** 复制到目标项目，并保持目录结构不变，就具备最小可用能力：

- 统一页型判定与默认规则
- `rules-only` / `host-integration` 接入脚本
- 宿主桥接与示例页
- smoke gallery 与 doctor 校验
- `typical-page-shells` vendor 包与依赖快照
- Vite `@hi-ui/schema-types` shim

不要再额外拆分成第二个“生成 skill”。这个目录已经同时承担：

- 安装包
- 规则包
- 示例包
- 校验包
- 生成入口

注意：

- skill 可以内置脚本、示例、vendor 包和依赖快照
- 但目标项目最终仍需要把运行时依赖写入自己的 `package.json` 并完成安装
- 也就是说，skill 负责“携带和落地依赖声明”，不能替代目标项目自己的运行时环境

## 接入决策

先判断目标项目画像，再决定安装模式：

- 当前对外接入模式仅保留 `rules-only` 和 `host-integration`
- 接入阶段只要能安全接通受管宿主基线、样式资源、依赖线和桥接链路，就尽量选择 `host-integration`；`rules-only` 是保守降级，不是偷懒默认值

### `host-integration`

- 它表示目标项目**可以完整承接受管宿主基线、官方 source assets 与 smoke/doctor 联调治理能力**；官方示例统一由 skill 包内 `preview-runtime/` 承载，不再物化进项目
- 它不是“新项目模式”，也不是“正式业务宿主模式”
- 对 `greenfield + react-vite` / `react-vite-router` 的全新项目，只要没有明确反证表明受管宿主基线、高度链、样式资源或依赖线接不通，就应把 `host-integration` 作为默认优先项；不要因为想少改文件、少跑脚本或暂时只生成单页，就偷懒退回 `rules-only`
- 新项目和已有项目都可以显式使用 `host-integration`，前提是受管宿主基线、header/footer portal、高度链、样式资源和依赖线能够完整接通

### `greenfield` + `react-vite` / `react-vite-router`

- 通常更容易承接受管宿主基线与官方 source assets
- 默认优先选择 `host-integration`；`rules-only` 只在明确要求不引入 preview / smoke / doctor 基线，或已证明宿主桥接、样式资源、依赖线无法安全接通时才作为降级
- 首次生成真实业务页时，只有当前项目走 `host-integration` 且还不存在业务导航时，才允许补首个正式业务导航入口；不能把典型页面示例入口转成正式导航
- 该正式业务入口允许沿用示例导航的视觉风格，但不能把 preview route tree 直接转成正式业务导航

### `existing-system` + `react-vite-custom-layout` / `react-router-custom`

- 项目画像会用于判断是否需要项目本地兼容桥；需要时自动落到 `rules-only`
- 若项目能够证明受管宿主基线、样式资源、依赖线和桥接链路可安全接通，就尽量显式使用 `host-integration`
- 无论是否使用 `host-integration`，真实业务页都继续落在目标项目既有布局、路由和菜单体系中
- 若项目已存在业务导航，新生成页面必须继续落在既有导航体系下；自动挂靠是增强能力，不是旧项目页面源码生成的硬前置。若无法证明挂靠入口，必须停止并要求人工指定，不自动新建导航

### `umi` / `next` / 微前端

- 项目画像会用于判断是否需要项目本地兼容桥；需要时自动落到 `rules-only`
- 若团队后续愿意补项目本地兼容桥，再单独评估是否值得显式切到 `host-integration`
- 不自动覆盖正式宿主

重要边界：

- 不要因为同步出了 preview 资产目录，就把项目误判成 `existing-system`
- `host-integration` 只负责提供更完整的宿主基线、官方 source assets、smoke/doctor 联调基线和桥接 guidance；它不等于正式业务宿主
- 真实业务页不得从 preview 目录直接复制，不得与典型页面示例共用正式路由树、菜单树或默认 landing flow
- `rules-only` 不是“按规则自由手写页面”；它表示不自动覆盖宿主，但业务页仍必须从 `page-types.manifest.json` 的 `generationContract` 和官方单页母版起步
- 面对新项目 / 轻骨架时，`rules-only` 应视为带理由的例外降级，而不是“最省事的默认选项”
- 旧项目不自动补正式业务导航；只有 `host-integration` 的全新项目在首次生成真实业务页且尚无业务导航时，才允许自动补正式导航

接入模式总览见：

- `docs/onboarding/integration-modes.md`
- `docs/onboarding/host-profiles.md`
- `docs/onboarding/install-and-host.md`

## 最短接入路径

### 设计师或首次接入

若当前项目还没有完整的项目本地 `.local-context/hiui-design/`，先从 skill 包根目录执行：

```bash
cd "${CODEX_HOME:-$HOME/.codex}/skills/hiui-design"
node scripts/ensure-in-current-project.mjs --target <project-root> --mode auto
```

这一步的作用是先把项目本地 hiui-design 能力包补齐，并把项目收敛到 `ensure-only`。`ensure-only` 只表示“接入物料已同步，但还没完成页面生成放行”。

在目标项目根目录执行：

```bash
node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --mode auto
```

这个入口会：

- 自动判断目标项目类型
- `--mode auto` 时先复用已记录的 `appliedMode`
- 若没有这些项目级证据，就只判断当前项目是否需要项目本地兼容桥；不需要时自动走 `host-integration`，需要时自动走 `rules-only`
- 首次接入默认优先使用 `--mode auto`；若目标项目属于原生兼容载体且没有明确阻塞证据，自动模式通常会落到 `host-integration`
- 裸跑 `setup-for-designers.mjs` 更适合项目已经存在 mode 证据、只想复用既有决策的重复同步场景
- 注册后续重复使用的固定脚本
- 默认先运行 `typical-page:preflight` 打开页面任务门禁；若命中高风险旧宿主，会按受管车道继续补 legacy React runtime compat、HiUI5 replacement bridge、legacy MF shared contract，并在放行前自动复核 `dependency-isolation-check.mjs`；`doctor` 只用于首次接入验收、运行时异常、宿主壳/依赖变更、正式发布验收或用户明确要求验收的场景，不再作为默认生成前置
- 后续只要页面任务门禁仍是 `ensure-only`、状态文件缺失，或 freshness 已失效，就必须先运行 `typical-page:preflight` 重新开门，再开始写页面

### 开发者标准入口

```bash
node ".local-context/hiui-design/scripts/apply-in-current-project.mjs"
```

### 生成前轻量 ensure 入口

当用户已经全局安装 skill，但当前项目还没有本地 `.local-context/hiui-design/` 或缺少合法 `appliedMode` 时，先从 skill 包根目录运行：

```bash
cd "${CODEX_HOME:-$HOME/.codex}/skills/hiui-design"
node scripts/ensure-in-current-project.mjs --target <project-root>
```

说明：

- 上面这个外部命令适用于 `missing-context`、`missing-apply-state` 或需要先补齐项目本地 context 的场景
- 项目内 `node ".local-context/hiui-design/scripts/ensure-in-current-project.mjs"` 只适用于当前项目已经 materialize 了 `.local-context/hiui-design/` 的场景
- 若 `integrationReadiness.status = missing-context`，项目内命令本身不可执行；此时必须使用 `generation-brief.mjs` / `plan-page-task.mjs` 返回的外部 `command`，也就是从 skill 包根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root>`，而不是硬跑 `projectLocalCommand`
- 当此类 brief / planner 只是为了暴露外部 `ensure` 命令时，默认走最小 gate 调用：只传 `--target` 和可选 `--mode`；不要把 `--page-type`、`--page-family`、`--title`、`--dest`、`--route-path`、`--related-page-path` 等页面塑形参数提前带入未 ready 阶段
- 这是普通页面生成前的轻量接入补齐入口，默认先复用 ready 状态，不重复重接入
- 若项目已经 ready，但需要把最新 skill 包内容重新刷新到项目本地 `.local-context/hiui-design/`，应从 skill 包根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root> --force-context-sync`
- 缺 context 时先把 skill 目录同步到项目，再补 apply-state
- 普通写入生成入口会在必要时自动触发一次轻量 ensure；`--dry-run` 保持只读，不自动补接入
- 但自动 ensure 完成后，若 `PROJECT_PAGE_TASK_STATUS.json` 仍未被 preflight 放行为 `ready-to-generate`，生成链路必须继续停止，不得自动开始写页面
- `integrationReadiness.ready=false` 或页面任务门禁未放行时，生成链路只允许 `ensure-or-stop` / `preflight-or-stop`；不得切去分析旧业务页、普通 `PageTable`、`window.addPage` 或其他宿主兼容写法代替 hiui-design 接入

### 查看 skill 包内 preview 示例

```bash
cd "${CODEX_HOME:-$HOME/.codex}/skills/hiui-design"
node scripts/start-preview-runtime.mjs
```

只需要最小宿主基线时，仍然使用默认 apply：

```bash
node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode host-integration
```

以后任何场景都不再支持把 preview 示例物化进项目；如需查看，统一从 skill 包内 `preview-runtime/` 打开。

这里要明确区分两件事：

- `.local-context/hiui-design/examples/host-integration/**` 仍然会作为**官方母版 / source assets / shim / formal shell source** 留在项目本地 context 中，供生成器、宿主修复和人工对照使用
- 但目标项目**不再接入可预览的典型页 gallery、preview route tree、preview host 或 `/__typical-preview` 一类入口**；也就是说，项目本地保留的是源码事实，不是项目内可打开的 preview 应用

## Vite 项目硬前提

- 必须安装 `sass-embedded`
- 应用入口必须导入一次：

```ts
import './components/hiui-design-runtime/styles.css'
```

- `vite.config.*` 必须提供 `@hi-ui/schema-types` alias

可复用 shim：

```ts
'.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js'
```

直接复用本地 context 里的 shim：

```ts
'.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js'
```

## 生成步骤序

默认页面生成流程保持轻量，目标是让 AI 一次选对页型、选对母版和工作流：标准典型页只替换业务内容，数据可视化固定页头与 `whiteBody` 后按规范生成内容区。

1. 先判页型
   读取 `docs/generation/page-type-map.md`，必要时只读命中页型附近说明。
2. 再读机器契约
   从 `docs/generation/page-types.manifest.json` 读取命中页型的 `generationContract`，确认 `baseTemplatePath`、`requiredShell`、`businessSlots`、`forbiddenTokens` 和 `generationWorkflow`。
3. 再锁槽位边界
   读取 `docs/generation/page-slot-boundaries.md` 的命中页型小节，确认 allowed slots、forbidden slots、dangerous props 和 locked regions；写代码前先声明这些边界。
4. 选最近起点
   从 `generationContract.baseTemplatePath` 指向的官方母版起步；preview 资产只作为运行时对照和联调基线，真实业务页不从 preview 目录直接复制。
5. 按工作流落地
   标准典型页替换标题、路由 path、查询字段、表格列、表单字段、详情字段、请求函数、按钮文案、mock 数据和跳转目标；数据可视化固定页头与 `whiteBody` 后按规范生成分析内容区，并按需复用单个图表块。
6. 做轻量自检
   核对页型、母版、`requiredShell`、`businessSlots` 或受控重构面、slot boundary、region ownership、layout chain 与“未降级手写”。

异常排查或首次接入时再读最小文档集并运行对应工具：

1. 接入健康异常时
   运行 `npm run typical-page:preflight` 或直接执行 `scripts/typical-page-preflight.mjs`；首次接入验收、运行时异常或正式发布验收时，再补 `typical-page-doctor.mjs`。
2. 需要补充上下文时
   先读 `docs/generation/design-system-first.md`
   先读 `docs/generation/generation-principles.md`
   再读 `docs/generation/page-type-map.md`
   再读 `docs/generation/page-generation-workflow.md`
   命中页型后再读 `docs/generation/figma-page-rules.md`
   需要细页型时再读 `docs/generation/figma-pages/README.md` 和对应专章
3. 宿主/样式/运行时异常时
   再做 smoke 验证，至少覆盖一个相关页型；普通业务页生成不默认要求 smoke。

## 页型起点

- 普通表格：`basic-table.tsx`
- 数据统计表：`table-stat.tsx`
- 数据可视化：`data-visualization/index.tsx`
- 树形表格：`tree-table.tsx`
- 左树右表：`inventory-split.tsx`
- 抽屉表单：`drawer-form.tsx`
- 抽屉详情：`drawer-detail.tsx`
- 全页编辑：`full-page-edit.tsx`
- 全页详情：`full-page-detail.tsx`

硬规则：

- 数据统计页必须从 `table-stat.tsx` 起步，不要从基础表格页或空白文件发明
- 数据可视化页必须从 `data-visualization/index.tsx` 起步，不要从 `table-stat.tsx`、基础表格页或空白图表墙发明
- 全页编辑必须从 `full-page-edit.tsx` 起步，不要退回普通 `Card + Form + footer`
- 不要手拼裸 `PageHeader + QueryFilter + Table`
- 不要改坏宿主共享 slot bridge（若项目保留）、内容高度链和样式基线

## 当前目录结构的职责

- `scripts/`
  接入、同步、doctor、manifest 维护脚本
- `docs/`
  onboarding、generation、validation 文档
- `examples/host-integration/`
  宿主桥接、左侧导航、示例页、smoke gallery 源资产
- `vendor/`
  `typical-page-shells` tgz 与依赖快照
- `templates/`
  i18n 初始化模板与最小运行时种子
- `manifests/`
  页型覆盖层与事实源扩展

## 使用统计

- `hiui-design` 默认关闭 `telemetry`（使用统计，当前语境里指把运行信息写成本地记录或上传）
- 当前脚本仍保留 `--telemetry-prompt`、`--telemetry-prompt-file` 这类参数名，主要用于兼容旧调用链；默认关闭统计时不会触发上传
- 若后续需要显式恢复统计，先看 `PRIVACY.md` 中的开启条件，再决定是否继续保留这些兼容参数

## 常用命令

```bash
npm run typical-page:designer-setup
npm run typical-page:apply
npm run typical-page:preflight
npm run typical-page:doctor
```

没有 npm script 时，直接用本目录下的 `scripts/*.mjs` 入口。

## 验收标准

- 首次接入、正式发布验收、宿主异常或用户明确要求验收时，`doctor` 通过
- 普通业务页生成默认只做轻量自检：页型、母版、`requiredShell`、业务槽位、slot boundary、region ownership、layout chain 和未降级手写
- 样式资源已生效
- 标准典型页与 `non-typical-page` 保留页面内单一 `PageHeader`，且若宿主存在共享 `header slot`，其空态会自动折叠
- 全页编辑底部操作区仍然吸底
- 数据统计页指标卡不是裸文本
- 菜单标题与 `PageHeader title` 一致
- 若多个 smoke 页同时失真，先修宿主和样式接入，再继续生成业务页

## 历史兼容说明

已下线历史模式已不再属于当前 skill 的对外规则集合。若必须回溯历史维护链路，只能通过 git 历史恢复对应版本；当前仓内对外仅允许 `rules-only` 与 `host-integration`。

- `host-shell-fix-required`：表示页面母版本身仍是官方标准典型页，但当前项目的内容挂载区本身不可拉伸、共享 content outlet 高度链缺失，或受管宿主 contract 无效；先修宿主，再重跑生成，不允许生成一层旁路页面壳去绕过宿主问题。

### 强制规则

- 不得调用已下线的 `typical-page:generate-source` `typical-page:lint-source-templates`。
- 不得从包内 `templates/source/*` 复制页面作为一致性依据。
- 无论是否脚本化，标准典型页都不得绕过官方受管入口直接手写页面骨架；默认公共入口是 `.local-context/hiui-design/scripts/generate-page.mjs`，审计或逐段调试时才显式退回 `.local-context/hiui-design/scripts/generation-brief.mjs` 与 `.local-context/hiui-design/scripts/generate-page-from-brief.mjs`。AI 只允许生成业务槽位输入，最终页面必须来自官方母版替换业务槽位。`non-typical-page` family 同样不得直写页面壳层；AI 只允许形成 `nonTypicalDecisionPackage`，最终页面必须经过 family generator 与 light sanity。
- `generation-brief.mjs` 与 `plan-page-task.mjs` 只负责暴露 `integrationReadiness` 与阻断原因，不会自动改项目；未 ready 时只允许按它们给出的 `typical-page:ensure` 指令补齐接入，或直接停止；不得转去手写宿主兼容页。
- `generate-page-from-brief.mjs` 只有在真实写入路径下才允许自动执行一次轻量 ensure；`--dry-run` 若发现项目未 ready，必须 fail closed 并要求先执行 ensure。
- 页型 manifest 声明 `baseStylePath` 时，生成器必须复制样式并统一目标样式名为 `index.module.scss`。
- 生成器返回的 `generatedOutputSanity.ok` 必须为 `true`；若失败，先修母版合同、规则驱动壳层 scaffold、业务槽位替换或宿主契约，不得绕过检查写入页面。
- 旧项目首次接入、依赖变更、运行时 peer 报错或典型页 shell 无法解析时，可运行 `.local-context/hiui-design/scripts/dependency-isolation-check.mjs --json`；若失败，先修可选嵌入来源快照、依赖声明、lockfile、已安装版本、peer 依赖或构建层 HiUI5 peer replacement bridge。普通业务页生成不需要把这一步手工塞到 ensure / preflight 之前；真实写页时若依赖隔离仍有风险，受管生成器会自行 fail closed。
- 若项目已完成 hiui-design 接入，且宿主命中“高风险 legacy React 16/17 + 可唯一落到单一配置或共享 `base` 配置 + 无冲突本地 shim”，可显式执行 `.local-context/hiui-design/scripts/legacy-react-compat-autofix.mjs --json`，或项目内已注册的 `typical-page:legacy-react-compat`，自动补齐 `react-dom/client` 与 React 16 所需的 `react/jsx-runtime` / `react/jsx-dev-runtime` 兼容分支；当前已支持标准 `Rspack base + dev + prod` 三段式里唯一共享 `base` 的安全落点。执行后仍需重新运行 `typical-page:preflight`
- 若宿主还属于 `existing-system + legacy Webpack/Rspack`，并且缺少显式 `HiUI5 replacement bridge`，可显式执行 `.local-context/hiui-design/scripts/legacy-hiui5-bridge-autofix.mjs --json`，或项目内已注册的 `typical-page:legacy-hiui5-bridge-autofix`，自动补齐受管替换桥；它只会在“恰好一个”对象字面量 `CommonJS` 构建配置可安全改写，或能从标准 `Rspack base + dev + prod` 结构里唯一定位到共享 `base` 配置时自动接线；不能安全自动改时会返回阻断原因与后续动作
- 若宿主属于 `existing-system + legacy Module Federation`，且项目仍声明旧 `@hi-ui/hiui`，同时又启用了 scoped HiUI5 bridge，可显式执行 `.local-context/hiui-design/scripts/legacy-mf-shared-contract-autofix.mjs --json`，或项目内已注册的 `typical-page:legacy-mf-shared-contract-autofix`，自动把 `hiui5` / `@hi-ui/hiui` 的共享合同切回多版本模式；执行后同样需要重新运行 `typical-page:preflight`
- 修改正式入口、路由、菜单、Module Federation `exposes` 或 Camora `window.addPage` 前，若接入方式不明确或涉及独立访问入口，运行 `.local-context/hiui-design/scripts/integration-preflight.mjs`；若返回 `blocked`，先处理 `requiredManualActions`，不得猜测路由、菜单、MF expose 或业务按钮位置。仅在已加载模块内做内部视图切换时，可用目标项目既有组件状态接入并记录原因。
- 路由、菜单、Module Federation `exposes` 和 Camora `window.addPage` 必须按目标项目既有架构手工接入。
- 生成后默认做轻量自检和目标项目可承受的最小构建、语法检查或类型检查；正式发布、首次接入、宿主异常或用户要求验收时，再运行 doctor、构建和真实宿主打开验收。
