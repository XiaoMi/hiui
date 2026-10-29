# AI 页面生成前指引

## 目标

本文件是 `hiui-design` 的生成时导航，不是页面完成后的补丁清单。AI 写业务页面文件前，必须先完成统一判断顺序：

1. 先确认项目级 `integrationReadiness`
2. 再确认 `信息输入方式`
3. 再形成 `structure semantics`
4. 再命中 `页面类型 / 基础页型`
5. 再判断 `生成路径 / adaptationMode`

如果标准模板已覆盖，就直接复用；如果标准模板不足，但页面仍然保留该基础页型或页面家族的大多数特征，才进入“基础模板上的局部改造”路径，并先抽取一份 `pageAdjustmentContract`。

补充口径：

- `legacy-system-reconstruction` 只是“旧页事实进入主链路”的输入模式，不是另一条独立页面生成体系
- `prototype-screenshot` 只是“原型截图进入主链路”的输入模式，不是“正式设计还原”的别名
- 设计还原应进入独立的 `design-restore` 输入链；它的前置产物应是 `restoreDecisionPackage`，不是原型生成使用的 `pageTypeRecommendation + promptDraft`
- 命中 `legacy-system-reconstruction` 时，先形成最小 `legacyReconstructionInput` 与 `migrationInvariantContract`，再继续页型判断、模板选择与生成路径决策
- 若只能判断“疑似旧页重构”，但无法形成最小旧页事实对象，必须停止；不得静默回落成 `page-prompt`
- 旧页事实只负责保留业务语义与迁移边界，不负责把旧页面的历史宿主结构、历史视觉补丁或历史 DOM 直接抄成新模板

这里的 `structure semantics` 指的是：页面有哪些稳定主区域、每个区域承担什么角色、页面阅读流如何收口、核心交互发生在哪个区域，以及用户有没有明确禁止系统自动补出的结构。只要这层事实还不稳定，就不允许直接锁页型。

### design-restore 固定顺序

当 `inputMode` 已经进入 `design-restore` 时，生成前固定按下面顺序思考：

1. 先读取 `confirmedDesignRestoreInput.restoreDecisionPackage`
2. 先复用已命中的局部模式和固定页壳，不先发明新结构
3. 先映射现有 HiUI5 / `local-managed-runtime/*` 受管运行时能力，再判断是否还存在未覆盖区域
4. 当前 family/pageType 若仍需贴稿偏离，只允许通过 `pageAdjustmentContract` 进入 `base-template-local-adjustment`
5. 非典型页若仍需贴稿偏离，只允许通过 `restorePrimitivePlan` 约束区域原语
6. 只有前面都无法直接覆盖时，才允许在 HiUI5 容器组合范围内做轻度扩展
7. 任何一步一旦找不到稳定承接方式，都必须停止，不得回退成整页自由手写

## P0 Hard Gate

只要项目级 `integrationReadiness` 命中 `missing-context`、`missing-apply-state`、`invalid-apply-state` 或 `invalid-applied-mode`，本次任务就必须立即收敛成 `ensure-or-stop`，不要再继续任何页型推演、模板选择或宿主接入规划。

当 `integrationReadiness.ready=true` 后，还必须继续检查 `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json`：

- 只有 `pageTaskReadiness = ready-to-generate` 时，才允许继续页型推演、母版选择、旧页复用分析、正式导航挂接规划和页面写入
- 若 `pageTaskReadiness = ensure-only`、状态文件缺失，或 freshness 已因 `package.json`、锁文件、入口文件、构建配置、项目本地 `.context.jsonc`、正式宿主合同文件漂移而失效，本次任务必须立即收敛成 `preflight-or-stop`
- `preflight-or-stop` 下只允许执行 `typical-page:preflight` 或向用户报告阻断事实；不得直接开始写页面
- 当 page-task gate 关闭时，对外阻断说明固定复用 `PROJECT_PAGE_TASK_STATUS.json` 里的 `gateStatusReason`、`staleInputs`、`nextRequiredAction`、`canAutoRecover` 和 `contractSnapshotId`；不要在 planner、brief 或 generator 里另起第二套“差不多意思”的门禁文案
- 读取状态文件时必须把 `integrationComplete=false/true` 与 `userVisibleState=materialized-only/integration-complete` 一并视为完成语义；`ensure-only` 永远只代表“物料已同步”，不代表“接入完成”
- 只要项目里存在 `.local-context/hiui-design/outputs/AI_GENERATION_READY_CONTEXT.json`，AI 写页前都应先读取它；当前这份快照已经编译进 `pageTypeManifestSnapshot`（页型清单快照，这里记录本次 preflight 使用的是哪份 manifest / overlay）、`pageTypes[].generationContract`（页型生成合同，这里直接给出模板路径、必需壳层、槽位边界、轻校验等机器规则）、`pageTypes[].requiredDocs`（页型补充文档列表，这里给出该页型还需要看的说明文档）以及 `projectHostContext`（项目宿主摘要，这里汇总默认业务目录和关键挂载事实）。因此外层默认不需要再重复读取 `page-types.manifest.json` 或 `page-slot-boundaries.md` 拼装机器输入；只有当快照缺字段、旧快照未刷新，或当前任务明确进入人工审计时，才回退去读原始文档。`navigationDecision`、`navigationMountDecision` 与 `navigationMountAction` 只在当前任务已经拿到具体页级输入时才作为页级执行输入使用，不需要也不应在项目接入阶段凭空脑补
- 当任务进入“扩展受管页壳能力”或“审计某个页壳符号实际落到目标项目哪个文件”时，回退读取 `page-types.manifest.json` 顶层 `managedLocalRuntimeImplementationMap`（本地受管运行时实现映射表，这里是 `local-managed-runtime/*` 逻辑导入名到目标项目 `src/components/hiui-design-runtime/**` 真实文件落点的总表）。不要一边改运行时一边凭文件名猜实现归属。
- 只要项目里存在 `.local-context/hiui-design/outputs/PROJECT_HOST_CONTRACT.json`，AI 就必须把它视为项目级宿主事实的唯一快照入口；页面任务门已经放行后，不再允许绕过这份 contract 再次自由扫描源码来猜业务目录、发布入口或导航事实。若 contract 缺失或缺少 `formalNavigation`，必须停止并要求重新跑 `typical-page:preflight`；但在当前实现里，这类问题很多时候会先把 `pageTaskReadiness` 打回 `ensure-only`，所以对外先看到的通常是 page-task gate（页面任务门禁，当前语境里是生成前总开关）未放行
- 若 `publicViewportReady=false`，必须在导航挂靠、母版选择和页面写入之前停止，并先修公共外壳或重新执行 `typical-page:preflight`；`formalHostCompatibility` 现在主要用来描述正式宿主兼容事实和后续修复 guidance，只有受管最小宿主 contract 明确无效时才继续阻断项目开门，其余 shared header slot / 高度链问题不再单独替代 preflight 开关页面任务门；不要退化成“先生成页面，再靠 doctor 发现左右留白/高度断链”
- 对 `rules-only`，若 `publicShell.status = not-checked`，应理解为“项目级公共外壳基线证据仍不完整”；优先补齐 baseline 证明，但不再把它自动等同于必须停止的硬阻断。对 `rules-only + existing-system + Module Federation direct expose`，还要额外区分 `projectEntryShellReady` 与 `mfPublishEntryShellReady`：app entry 已引样式只代表项目级 baseline ready，不自动代表 MF 发布页 ready

### 未 ready 时允许动作

- 运行 `generation-brief.mjs` / `plan-page-task.mjs` 返回的 `typical-page:ensure` 命令
- 向用户报告当前阻断状态、原因和下一步 ensure 命令
- 若只是为了取得 ensure 命令，默认使用最小 gate 调用：只传 `--target` 和可选 `--mode`；在 `integrationReadiness.ready=false` 时，不要提前传 `--page-type`、`--page-family`、`--title`、`--dest`、`--route-path`、`--related-page-path` 等页面塑形参数

### 未 ready 时禁止动作

- 读取目标项目现有业务页并做结构拆解
- 分析目标项目共享实现、复用路径或“先复用再补接入”方案
- 定位按钮挂载点、路由挂靠点、菜单注册点、`window.addPage` 或 Module Federation `exposes`
- 选择官方母版、形成 hostShellDecision、推演 formal navigation 接入
- 退化成旧业务页参考、普通 `PageTable`、空白页手写或其他宿主兼容生成分支

## 固定前提

- `hiui-design` 生成的新页面默认就是业务页面，不需要额外判断是不是业务页
- 当前项目默认只有一条业务线；当缺少页级证据时，生成目标默认落到 `src/pages/<route-slug>`。但对 `existing-system`，只要已确认 legacy 业务入口、`implicit-feature-registry` 或显式 `navigationMountContract`，`defaultBusinessPageDir` 就必须切到项目已证明的既有业务目录，例如 `src/views/<route-slug>`
- 写页面前先看项目级 `integrationReadiness`；它默认只看两件事：本地 `.local-context/hiui-design/` 是否具备最小 marker，以及 `HIUI_DESIGN_APPLY_STATE.json` 是否存在合法非 `auto` `appliedMode`
- `host-integration` 只是模式，不等于 ready；模式是 `host-integration` 但本地 context / apply-state 不完整时，仍然先补接入
- preview 资产只用于参考、联调和 smoke；不得作为正式业务输出目录
- `src/typical-page-preview/**`、`/__typical-preview`、`createTypicalPagePreviewRoutes`、`ExampleAppShell`、`examplePrompt`、`PromptCopyFloatingButton` 都属于 preview 参考资产，不能进入正式业务页代码或正式路由树
- 若命中正式业务页面模块，且 `page-types.manifest.json` 的 `generationContract.moduleExportContract.routeMountable = true`，页面源码必须同时保留具名 `*Page` 导出与 `export default`；不要只保留其中一种。当前正式路由补写链路默认使用 `import Xxx from '...'` 消费页面模块，而受管兼容入口与页面包裹逻辑又依赖稳定的具名 `*Page` 识别，因此双导出是正式业务页合同的一部分，不是可选风格偏好
- 宿主公共排版基线只允许由 `TypicalPageHost` / `host-reset.css` 这类 host baseline 统一承接；若页面里出现“所有文字整体变大/变小”，先修 host baseline，不要在业务页里逐块打补丁
- `rules-only` 项目默认也要有项目级 host baseline：app entry 负责引入本地受管 CSS，业务页面文件不负责补这层全局样式
- 但在 `rules-only + existing-system + Module Federation direct expose` 里，页面真实发布单元还必须通过受管 publish entry 单独引入本地运行时样式 `src/components/hiui-design-runtime/styles.css`；不要把 `hiui-design-host.generated.css` 误下沉到每个 remote 页面
- 业务页与业务页样式不得声明 `:root`、`html`、`body`、`#root`、`#__next`、`#app` 或 `h1-h6` 这类全局排版选择器来纠偏宿主字号；页面本地样式只负责布局和页型允许槽位
- 如果页面出现“白色内容区域没铺开、筛选和表格贴在一起、整体字体或留白异常”，优先视为公共外壳或样式引入问题；不要先怀疑典型页面文件本身缺少全局样式
- 命中非抽屉整页时，默认生成 `page-owned support file`：由新页面自己负责共享页头冲突处理和当前内容挂载区铺满，不默认改旧宿主文件
- `page-owned support file` 在这里表示“页面附带兼容文件”：若宿主仍保留共享 `header slot`，页面挂载时自动隐藏、卸载时恢复；若宿主没有共享页头，这层逻辑自动空转
- 对非抽屉整页，只有 `mount region` 本身不可拉伸、缺少连续高度链或受管宿主 contract 无效时，才升级为宿主阻断；不要因为共享页头空态证据不足就默认停止生成
- 正式业务导航只允许承载真实的用户业务页面；不得为了补齐首屏流程自动生成“工作台”“业务工作台”“首页概览”等合成占位页，除非用户明确要求
- 首次建立正式业务导航壳时，默认 landing 必须指向正式导航注册表中的首个真实业务页；后续新页面也必须继续挂靠在这份注册表下，而不是再创建第二个默认首页
- 当 `inputMode=prototype-screenshot` 时，用户确认发生在 AI 对话中，不在仓库内创建确认 UI；确认结果只以内存对象传递给 brief / generate 主链路
- 当 `inputMode=prototype-screenshot` 时，P0 只支持单张主页面截图；多图输入、截图合并、image-to-code 直出不在当前范围内

## 接入通过后的导航挂靠轻决策

项目级 `integrationReadiness.ready=true` 且 `pageTaskReadiness = ready-to-generate` 后，先区分两个阶段：

- 项目接入阶段：只确认宿主支持哪类挂载机制，例如现有路由注册表、`ModuleFederationPlugin.exposes`、隐式 feature registry、legacy 业务入口 contract
- 页面生成阶段：在已经拿到具体页级输入（如 `dest`、标题、routePath、exposeName、显式 `navigationMountContract`）后，才把挂载机制收口成轻量 `navigationMountDecision`

这一步是写页前引导，不是页面生成后的重校验；原则是先决定挂靠，再生成页面。但“先决定挂靠”只发生在具体页面任务中，不发生在纯项目接入阶段。

`navigationMountDecision` 不是报告字段，也不是生成后的待办事项；但它也不应在项目接入阶段提前生成。当 `action=attach-existing` 或 `action=create-first-formal-shell` 时，必须立即落成 `navigationMountAction`。若落成的是自动动作，例如 `append-existing-registry`、`materialize-implicit-feature-entry`、`create-formal-shell-and-mount-entry`，则必须在写正式业务页目录前先执行；若落成的是人工确认动作，例如 `append-existing-entry`、`manual-register-existing-registry`，则允许继续生成页面源码，但必须把挂靠说明显式写入结果。只有挂靠点本身无法确认时才停止，不得先写页面、裸挂业务路由或事后猜测补导航。

- 在形成 `navigationMountDecision` 之前，planner / brief 应先记录轻量 `pageRelationDecision`：至少区分 `same-module-subview`（模块内子页面，这里指从当前已加载模块内部进入详情或子视图）与 `publish-unit`（独立发布单元，这里指需要独立入口、独立路由或独立暴露的业务页）。这不是新增用户必填项，而是对现有 `relatedPagePath`、目标目录、用户提示词诉求、`routePath`、`exposeName` 和显式导航合同的派生判断；证据不足时允许保持 `undetermined`，但不得跳过记录。
- `pageRelationDecision` 的主判断源应优先来自“用户诉求 + 显式上下文证据”，例如“在某个列表页增加按钮，点击进入创建页/详情页”这类提示、本次 `dest` 是否落在父模块目录下、是否存在 `relatedPagePath`、是否缺少独立 `routePath` / `exposeName`。`page-type`（页型）只负责选模板，不参与页面归属主判断。
- 一旦 `generation-brief.mjs` 已经形成 `pageRelationDecision`，后续 `plan-page-task.mjs`、`generate-page-from-brief.mjs`、`integration-preflight.mjs` 只能消费或校验这份结论，不能在后半段自由重算另一套页面归属。若页面已经生成且目录下存在 `hiui-pagegen.meta.json`，后续校验可在“当前 brief 未给出明确结论”时复用该元数据里的页面关系事实。
- 当页面关系已经是 `same-module-subview` 时，不得再默认推导独立 `expectedExposeTarget`（预期暴露入口，这里指独立发布页的模块联邦源码目标）、不得再自动要求 `mf-entry.*`（独立发布入口文件），也不得把“编辑页/详情页”这种页型外观误当成独立发布需求。
- 对 `same-module-subview`，若 `navigationMountContract.parentFlowContract` 已完整给出 `parentPagePath / triggerKind / triggerLocator / targetPathPattern / paramMap / backBehavior`，且父页能被证明是 hiui-design 自生成页面，生成器只允许在白名单父页结构内自动 patch；不命中白名单时必须回落为 `manualPatchSuggestion`，而不是口头说“请手动处理”。
- 若历史产物已经出现“元数据判定为子页面，但目录里还残留 `mf-entry.*` 或 `managedMfPublishEntry.required=true`”这类矛盾，优先使用 `page-relation-safe-fix.mjs`（页面关系安全修复脚本，这里用于只修明确矛盾、且只删除 hiui-design 自己生成的独立发布残留）修复，再重新跑 `integration-preflight.mjs`。

- 若当前项目已经存在业务导航壳 / 业务路由注册表，那么新生成业务页必须追加到同一个现有挂靠体系中，由单一配置同时驱动菜单与路由；不得分别维护两份“菜单列表”和“路由列表”。
- 若当前项目通过 `ModuleFederationPlugin.exposes` 发布业务模块，那么这同样属于正式挂载机制。项目接入阶段应先识别出它具备 `module-federation-exposes` 能力；页面生成阶段再结合 expose 名、业务目录、宿主映射要求，决定是否自动补 expose、输出人工说明或继续要求确认。对 `rules-only + existing-system + direct expose`，默认动作不是“补 app entry”而是 `materialize-mf-publish-entry`：在页面目录旁生成受管 publish entry，仅引入本地运行时样式并转发页面模块，然后把 expose 改指向该 publish entry。
- 对 `rules-only + existing-system + direct expose`，页面规划与生成阶段应优先读取 `PROJECT_HOST_CONTRACT.json` 里的 `hostExecutionAdapter.kind = mf-direct-expose-legacy`。它会把“页面源码应写到哪里”和“发布入口应改到哪里”拆开：`pageSource.defaultBusinessPageDir / targetBusinessPath` 只负责源码落点，`publishEntry.configPath / managedPublishEntryPath` 只负责发布链路。不要再把 `ModuleFederationPlugin.exposes` 当成页面源码目录证明，也不要在生成器里重复跑一次目录猜测。
- 若当前页面不属于这条 `direct expose` 链路，就不要强造 `hostExecutionAdapter` 占位对象；普通正式路由页与 `same-module-subview` 可以合法地保持 `hostExecutionAdapter = null`。
- 若 `invalid-output-target` 阻断里显示 `defaultBusinessPageDir=src/pages`，不要立刻把它理解成“项目禁止 `src/views`”。先看阻断原因里这条目录是如何推导出来的：若只确认了 `ModuleFederationPlugin.exposes`，它只能证明发布入口，不能证明页面源码目录；若存在多个 legacy 业务入口候选，则应先用 `navigationMountContract.entryPath + entryKind`（必要时再补 `entryRoutePath` / `entryTitle` / `entryName`）显式锁定真实挂靠点。
- 对 `rules-only + existing-system + Module Federation direct expose`，正式宿主高度链现在优先读取显式最小宿主契约 `src/**/hiui-managed-host.contract.json`。只要该 contract 有效，项目级 gate 就应把它视为正式宿主事实源，而不是继续要求仓库先存在旧式 `components/layout/*` / `business-layout/*` 证据。只有 contract 缺失时，才回退到源码启发式探测；若 contract 已存在但无效，则应明确阻断并先修 contract 自身，不再让启发式结果“碰巧放行”。
- 若当前项目的业务导航通过 `import.meta.glob('/src/features/*/index.*')` 自动发现 feature entry module，那么这同样属于 `attach-existing`；正确动作是把页面物化成 `implicitFeatureBaseDir` 下可被现有 glob 发现的直属子目录入口，而不是再要求一份新的受管 formal registry 或手写第二套路由壳。
- 若当前项目是 `host-integration` 的新项目/轻骨架，且还不存在业务导航壳，那么首次生成真实业务页并新增正式业务路由时，必须同时形成 `navigationDecision`：补首个正式业务导航入口，并沿用 `examples/host-integration/src/app-frame-core.tsx` 的导航样式、布局节奏和宿主结构；只隔离 preview route tree，不得手写另一套自定义导航皮肤，也不得把 preview wrapper 的 prompt overlay 一并带入正式壳。
- 若本次任务会创建项目首个正式业务导航壳，默认把 `examples/host-integration/src/app-frame-core.tsx` 视为官方宿主母版，而不是“视觉参考图”。`examples/host-integration/src/app-frame.tsx` 仅是 preview wrapper。新补的正式导航壳必须继续使用 `local-managed-runtime/host` 对应的受管宿主能力。`LayoutContentProvider`、`TypicalPageHostBridge`、`headerRef`、`footerRef`、`titleTextRef`、`styles.root`、`styles.sider`、`styles.siderBody`、`styles.sideMenuWrapper`、`styles.main`、`styles.headerSlot`、`styles.outlet`、`styles.footerSlot` 属于认证锁区；AI 只能替换 `routes`、`shellOptions`、品牌文案、业务菜单数据和业务路由挂靠，不得重排 `Layout/Sider/SideMenu/FloatMenuContainer` 结构、不得另写一套宿主高度链、不得为了“更简洁”改成自行拼装的左栏壳。
- 若本次任务挂靠到已有业务布局，且源码里可见 `PageHeaderPortal`、`role="page-header"`、`headerRef` 或同类正式页头槽，写业务页前应记录共享 header slot 在标准典型页未占用时是否会自动折叠或隐藏；这条现在属于旧宿主兼容事实与验收关注点，不再单独决定项目 page-task gate。`TypicalPageHostProvider` 只在宿主本身保留 shared-slot carrier 时作为 bridge 证据出现，不再是标准典型页的页面合同，也不是页型级硬前置。
- 已有业务布局还必须给官方壳根类 `pro-table-page`、`pro-stat-page`、`pro-tree-split-page`、`pro-detail-page`、`pro-edit-page` 或等价认证壳提供连续 `display:flex`、`flex:1 1 0%`、`min-height:0`、`overflow:hidden` 的宿主出口高度链。若白底主体不铺到底部、分页下方露灰底、表体高度不收口或多个页型同时出现双滚动，先修共享宿主高度链，不要在单个业务页里加 `min-height:100vh`、额外白卡、额外滚动容器或页型专属补丁。
- 若项目已经走受管最小宿主 contract，则上述高度链证明默认由 `hiui-managed-host.contract.json + app-frame.* + app-frame-core.* + host-reset.css + publish entry` 这一组固定合同共同承担；此时不要再额外要求旧共享布局继续提供 `PageHeaderPortal`、`headerRef` 或共享 header slot 证据。共享 header slot 的严格证明只保留给“页面必须复用现有共享布局内容区”的场景。
- AI 不得在写业务页前自行预创建 `src/business-shell/app-frame.*`、`src/business-shell/routes.*` 或同类正式壳文件；首次正式业务壳必须由 `generate-page-from-brief.mjs` 根据 `navigationMountAction=create-formal-shell-and-mount-entry` 物化，确保官方 `app-frame-core` 薄封装、认证标记、菜单与路由注册表一次生成一致。
- 若当前项目是旧项目且能够证明已有业务导航入口、业务路由注册表、业务入口文件或 legacy 页面入口，那么直接挂靠即可；这里不要求把老项目导航升级成官方认证壳。旧项目页面源码生成默认继续允许，自动挂靠只是一层增强能力：能自动 patch 就自动 patch，不能自动 patch 就输出人工接入说明，不把整页生成卡死。
- 若当前项目是旧项目但无法证明已有业务导航入口，必须停止并要求人工指定挂靠点；不得自动补正式导航。
- 若发现疑似手写业务壳、非规范导航文件（例如根级 `src/business-shell.*` / `src/business-layout.*`）或其他历史实现，不要先讨论“它够不够官方”；先判断它能不能提供一个真实、唯一、可写入的页面挂靠点。能确认就挂靠，确认不了才 `ask-user`。
- `hiuiDesignFormalShell='official-managed-host-shell-wrapper'` 只表示“该文件自称是正式壳”；它不是老项目挂靠前提。官方认证只用于“新项目首个导航由 hiui-design 自动补齐”这件事，确保补出来的导航和官方典型页面一致。
- 若当前只是项目接入阶段，且尚未拿到具体页级输入，则不要因为“还不能确定某张页面挂到哪里”就输出 `ask-user`；此时只需要如实报告“项目挂载机制已识别/待识别”。只有进入具体页面生成阶段后，仍无法确定 `existingBusinessNavigation`、正式路由注册表、`ModuleFederationPlugin.exposes`、隐式 feature registry、legacy 入口或菜单挂靠点时，才必须把 `navigationMountDecision.action` 置为 `ask-user` 并停止，不得先写正式业务页目录、裸挂业务路由或事后补导航。

推荐的轻量决策摘要：

```json
{
  "navigationMountDecision": {
    "existingBusinessNavigation": "certified-existing | uncertified-existing | implicit-feature-registry | missing",
    "mountPointStatus": "confirmed | unresolved | requires-first-managed-shell",
    "mountPointKind": "existing-route-registry | legacy-business-entry | implicit-feature-entry | create-first-managed-shell | missing",
    "mountPointConfirmed": true,
    "action": "attach-existing | create-first-formal-shell | ask-user",
    "routeRegistryPath": "path-or-empty",
    "menuRegistryPath": "same-as-routeRegistryPath-or-empty",
    "formalShellPath": "path-or-empty",
    "shellCertification": "certified-existing | uncertified-existing | missing",
    "shellSource": "existing-business-shell | implicit-feature-registry | official-host-app-frame | unknown",
    "reason": "one sentence"
  }
}
```

显式 `navigationMountContract` 现在支持两类合同：

- 现有导航注册表 contract：提供 `routeRegistryPath`、`formalShellPath`，并可兼容读取 `menuRegistryPath`；其中 `menuRegistryPath` 必须与 `routeRegistryPath` 指向同一份正式注册表。对旧项目，这份 contract 的意义是“确认挂靠点”，不是“要求导航先认证完毕”。
- legacy 业务入口 contract：提供 `entryPath`、`entryKind`（当前支持 `window.addPage`、`openNewPage`、`module-federation-exposes`、`module-federation-expose`），必要时再补 `entryRoutePath`、`entryTitle` 或 `entryName`，用于在 existing-system 项目里显式选中一个已验证的现有业务入口；若二级页返回必须精确命中上级业务页，再额外补 `backRoutePath`，并按需补 `backTitle` / `backName`。这条 contract 只解决“页面应挂到哪个旧入口”和“二级页应精确回到哪里”这两件事，不把项目强行升级成受管 formal shell。

推荐的轻量挂靠动作摘要：

```json
{
  "navigationMountAction": {
    "action": "append-existing-entry | append-existing-registry | manual-register-existing-registry | materialize-implicit-feature-entry | create-formal-shell-and-mount-entry | ask-user",
    "targetShellPath": "src/business-shell/app-frame.tsx-or-empty",
    "targetRegistryPath": "src/business-shell/routes.tsx-or-empty",
    "targetEntryPath": "src/features-or-empty",
    "appEntryPath": "src/main.tsx-or-src/index.tsx-or-empty",
    "pageRoutePath": "route-path-without-leading-slash",
    "menuTitle": "业务菜单标题",
    "mustDoBeforePageCode": "true-for-auto-actions | false-for-manual-actions",
    "reason": "one sentence"
  }
}
```

`navigationMountAction.action=append-existing-entry` 时，表示 `navigationMountContract.entryPath + entryKind` 或自动探测已经唯一确认了一个现有 legacy 业务入口；本轮默认把它视为**人工确认型挂靠动作**：允许继续生成页面源码，并输出旧项目入口接入说明，但不再假装已经自动 patch 旧入口，因此 `mustDoBeforePageCode=false`。`navigationMountAction.action=append-existing-registry` 时，只允许命中当前执行器已支持自动 patch 的现有导航注册表；`generate-page-from-brief.mjs` 先 patch 同一份已确认的现有导航注册表，随后写页面文件；不得在 `App.tsx` 单独新增业务页路由，因此这里保持 `mustDoBeforePageCode=true`。若注册表缺少受支持的 `export const businessRoutes = [...]`，必须改为 `manual-register-existing-registry`，输出人工挂靠说明，而不是继续冒充自动成功。`navigationMountAction.action=manual-register-existing-registry` 时，表示挂靠点已经确认，但当前执行器只知道“该挂到哪个现有 router / registry”，还不会安全自动 patch 这份注册表；因此允许继续生成页面源码，并在结果中显式输出人工接入步骤，`mustDoBeforePageCode=false`。`navigationMountAction.action=materialize-mf-publish-entry` 时，只命中 `rules-only + existing-system + Module Federation direct expose`：生成器必须先在业务页面目录旁物化受管 publish entry，让它只引入本地运行时样式并转发页面模块，然后把人工接入说明默认收口成“把 `ModuleFederationPlugin.exposes` 改指向这个 publish entry”；这里不要把 `hiui-design-host.generated.css` 下沉到 publish entry，也不要再泛化成“补入口即可”。`navigationMountAction.action=materialize-implicit-feature-entry` 时，必须先把页面物化到 `targetEntryPath` 指向的 `implicitFeatureBaseDir` 下，并保持为可被现有 `import.meta.glob('/src/features/*/index.*')` 自动发现的直属子目录入口；若目标不在 `implicitFeatureBaseDir` 下、不是直属子目录，或现有 glob 模式无法发现该入口，必须 fail closed。`navigationMountAction.action=create-formal-shell-and-mount-entry` 时，先形成 `src/business-shell/app-frame.*`、`src/business-shell/routes.*` 并 patch 真实入口接入目标，再写页面文件；只有真实 app entry 命中受支持的最小 ReactDOM bootstrap 时才允许自动 patch，入口无法确认或已有 router runtime 时保持 `ask-user`，不得生成裸页面。

优先级补充：

- 页级显式 `navigationMountContract` 一旦提供且有效，应覆盖 `PROJECT_HOST_CONTRACT.json` 中同类默认导航事实
- `PROJECT_HOST_CONTRACT.json` 只负责项目级默认事实，不得覆盖用户这次任务明确指定的 `entryPath` / `entryKind` / `entryRoutePath` / `entryName`

`PageHeader.onBack` 必须跟随页面挂靠语义，而不是做成全页模板默认值：除抽屉类页面外，只要页面通过 `append-existing-registry`、`manual-register-existing-registry`、`materialize-implicit-feature-entry` 或 `create-formal-shell-and-mount-entry` 挂到正式导航体系，默认移除返回按钮；只有 `append-existing-entry` 这类从业务按钮或旧入口二级进入的页面，才默认保留返回按钮。

当 `append-existing-entry` 命中旧宿主二级入口时，保留的 `onBack` 不得默认假设项目存在 `react-router-dom`。没有显式返回目标时，优先使用宿主无关的浏览器原生回退语义，例如 `window.history.back()` 的 best-effort 回退；若业务确实要求“返回指定上级页面”而不是“回退上一页”，必须通过 legacy 业务入口 contract 显式提供 `backRoutePath`，并按需补 `backTitle` / `backName`，不要把 preview / host-integration 模板里的路由依赖原样带进 `rules-only + existing-system` 产物。

## 执行原则

1. 先确认项目级 `integrationReadiness`；若未 ready，立即执行 `ensure-or-stop`，不要继续页型推演、模板选择或宿主规划。
2. 若 `integrationReadiness.ready=false`，或 `pageTaskReadiness != ready-to-generate`，后续动作必须先收敛成最小 gate 探测：真实写入链路先执行 ensure / preflight，只读链路直接停止；`generation-brief.mjs` 和 `plan-page-task.mjs` 只报告这件事，不代替执行。若 `integrationReadiness.status = missing-context`，不要硬跑项目内 `node ".local-context/hiui-design/scripts/ensure-in-current-project.mjs"`，而要使用 brief / planner 返回的外部 `command`，即从 skill 根目录对目标项目执行 `scripts/ensure-in-current-project.mjs --target <project-root>`。此时默认只做最小 gate 调用：只传 `--target` 和可选 `--mode`，不要提前附带 `--page-type`、`--page-family`、`--title`、`--dest`、`--route-path` 或其他页面塑形参数。
3. 只有在 `integrationReadiness.ready=true` 且 `pageTaskReadiness = ready-to-generate` 后，才先形成导航挂靠轻决策，再判断当前需求命中哪个页型和本次任务属于哪条生成路径。若页面任务门仍未放行，只能执行 `preflight-or-stop`。
4. `generate-page-from-brief.mjs` 只有在真实写文件时才允许自动补一次轻量 ensure；`--dry-run` 保持只读，未 ready 时直接失败并提示先 ensure。即使 ensure 成功，只要页面任务门禁尚未被 `typical-page:preflight` 放行为 `ready-to-generate`，也必须继续停止。未 ready 或未放行时不得退化成旧业务页参考、普通 `PageTable`、空白页手写、`window.addPage` / 路由 / MF `exposes` 猜测接入；ready 后也不得跳过 `navigationMountDecision` 直接写业务页面文件。
5. 已由页型母版和受管 shell 覆盖的区域，不重新设计组件，不重新声明视觉 token。
6. 标准典型页只替换 manifest 允许的业务槽位；`data-visualization` 这类独立能力页则按 `generationWorkflow` 固定页头与 `whiteBody`，由 `queryFields + searchPlaceholder` 承担 page-global control strip，内容区按规范整体生成，不改壳层、白底主体、滚动 owner、筛选 owner、表格 owner、分页 owner。`summarySection` 可使用独立摘要 grid；正式 `chartSection` 必须先选定一种基础 grid mode 并贯穿整个图表区，主图只通过同一 grid 中的 span / 主次权重强调，不按每一行切换 grid 类型；指标卡迷你图可选，不要求强制出现。明细表在 `data-visualization` 中是按业务诉求决定的可选收口层，只有在需要记录下钻、复核或后续操作承接时才生成。若页面并非 `data-visualization`，但包含图表，也必须回指 `shared-page-design-guidance.md` 与 `figma-pages/data-visualization.md` 中的共享图表规则：统一主题来源、图表卡边界、标题层级、容器节奏，不得自由回退到图表库默认皮肤。若图表类型为趋势 `Area`，则无论页型都必须继续满足面积图 archetype 合同：`withHiuiResponsiveChart` 包装、批准的线宽与渐变填充、禁止 `shapeField: 'smooth'` 一类绕开受管样式的写法。
7. 页面级单维度主切换默认使用 HiUI5 `Radio` 按钮组；只有在交互语义明确属于状态页签或步骤切换时，才使用 `Tabs`。不要用普通 `Button` 列表伪造单选切换。
8. 图表标题、分组标题和区块标题默认不展示副标题；只有在用户明确要求阅读提示、补充说明或统计口径时，才允许显式传入 `subtitle` / `summary` 一类副文案字段。
   在形成这一步之前，还必须确认 `coverageDecision` 不仅回答“模板已经覆盖了哪些区域”，也回答“用户明确要求的结构是否都被承接”“系统是否计划新增 `intentContract.mustNotAdd` 禁止的结构”。
9. 命中 `data-visualization` 时，写代码前必须先形成最小图表布局决策：至少明确 `chartCount`、`desktopBaseColumns`、`slotPlan`、`slotRemainder`、`selectedChartArchetype` 和 `rowFillDecision`。如果 `slotPlan` 不能在桌面主布局下形成完整行，不要直接落图；先按 `merge-secondary -> remove-weak-chart -> switch-archetype -> adjust-span` 的顺序收口，避免最后一行只剩单卡。
10. 命中 `data-visualization` 时，正式图表卡必须填满所在网格单元：图表项容器需要可拉伸，图表卡需要 `height: 100%` 或等价 fill contract，卡片内部采用“header 固定 + chart body 拉伸”的结构，不允许只靠图表内容自然撑高来碰运气对齐。
11. 未覆盖 UI 必须先映射到 HiUI5 组件、`local-managed-runtime/*` 受管运行时能力或 manifest 注册组件。
12. 找不到组件来源或 token 来源时，停止生成，不写近似实现。
13. 后置 gate 只做兜底；正确页面应在写代码前已经知道哪些内容可写、哪些内容不可写。
14. `典型页面变体` 在执行层不是新的页型命名，而是“基础模板上的局部改造”这条生成路径。
15. 若标准典型页无法完整覆盖用户诉求，但页面仍保留该基础页型的大多数特征，必须先形成 `pageAdjustmentContract`；不得直接从空白文件手写一个“类似典型页”的页面。
16. `pageAdjustmentContract` 只能约束本次需求相对基础模板的局部调整，不能推翻基础页型的壳层、owner、主滚动链和主要阅读流。
    这条约束不再默认只属于 `typical-page`；只要当前 family/pageType 的主结构仍然成立，例如 `analytics-page` 仍保留分析阅读流与单一 `whiteBody`，同样可以进入受控局部改造。
17. 局部调整部分仍需继续遵守 HiUI5 与 `local-managed-runtime/*` 的组件和 token 规范；不得在调整区域内发明第二套局部设计系统。
18. 写代码前先锁定 `targetBusinessPath`；如果目标不是默认业务目录，或命中了 preview 输出根，必须先停止。
19. 若本次任务会创建项目的首个正式业务导航壳，必须先形成 `hostShellDecision`，至少说明：`baseHostTemplatePath=examples/host-integration/src/app-frame-core.tsx`、本次允许替换的业务数据面、以及必须保留的认证锁区。没有 `hostShellDecision` 时，不允许开始写宿主壳代码。
20. `hostShellDecision.lockedRegions` 至少包含：`LayoutContentProvider + TypicalPageHostBridge + headerRef/footerRef/titleTextRef`、`Layout/Sider/SideMenu/FloatMenuContainer` 结构骨架、`styles.root/sider/siderBody/sideMenuWrapper/main/headerSlot/outlet/footerSlot` 的高度链与布局角色。生成正式业务导航壳时，默认直接业务化复用这份官方宿主母版，不把它降级成“可自由改写的参考实现”。
21. 若本次任务会创建项目的首个正式业务导航壳，必须先确认它是否沿用了 preview `app-frame` 的导航样式和宿主结构；若计划改写成另一套自定义左栏视觉、自己重组 `Layout + Sider`、或只保留菜单数据而重写宿主高度链，必须先停止。
22. 若本次任务会创建项目的首个正式业务导航壳，禁止通过页面级补丁修宿主问题，例如在宿主页面根、白卡根、`main` 外层或侧栏外层新增 `min-height: 100vh`、额外 `overflow-y: auto`、额外 `Card`、额外灰底包层来“补齐高度”。正确动作是保留官方宿主母版的连续高度链。
23. 若本次任务会向现有正式业务导航新增页面，必须先确认导航入口、菜单高亮和路由出口都来自同一个正式导航注册表；若需要分别修改多份手工列表，必须先停下并收口为单一注册表。
24. 若本次任务会创建或更新默认 landing，必须确认 landing 指向真实业务页；若 landing 依赖合成占位页或额外工作台页面，必须先停止。
25. 若当前项目属于旧项目且无法证明已有业务导航入口，必须先停止并要求人工指定挂靠点；不得自动新建正式导航。若旧项目挂靠点已确认但当前执行器不支持自动 patch，则继续生成页面源码并输出人工接入说明，不得把页面本身转成 blocked。
26. 命中 `full-page-edit` 时，必须使用 `local-managed-runtime/pro-edit-page` 公开的 `Form` bridge；不得退回 `SchemaForm`、`mapToDumb`、本地兼容 wrapper 或自拼 `Card + Form + footer`。
27. 命中 `drawer-form` 时，必须从官方 `examples/host-integration/src/pages/drawer-form.tsx` 模板起步，并把 `TypicalPageFieldMapProvider + SchemaForm + formProps/gridProps` 视为已认证锁区；业务替换只发生在 `title`、`trigger`、`fields`、`initialValues`、`submitRequest` 等槽位，不得改写抽屉 body 的表单实现面。
28. 若表单页需要不同于官方模板的 body renderer、字段桥接或 React 19 兼容策略，必须先扩展 `local-managed-runtime/*` 公开能力，再继续生成；不得让 AI 在业务页里临时发明第二套表单桥接。
29. 若列表/树表/抽屉页在 React 19 下出现 `rc-resize-observer`、`react-resize-detector`、`FormField` 相关运行时告警，优先视为依赖基线问题；不得通过页面级样式 patch、局部 DOM 包裹或替换受管组件来绕过。
30. 若宿主属于 legacy / Camora / Module Federation 且仍运行 classic JSX runtime，生成页必须保留显式 `import React from 'react'`；同时 Rspack / Webpack 的 HiUI5 runtime 适配必须按 issuer scoped replacement 覆盖本地运行时目录与 `@hi-ui/schema-*` / `@hi-ui/dumb-wrapper` / `@hi-ui/number-range` 链路，不能只靠全局 alias 或只覆盖壳包根。
31. 若宿主命中 `high-risk + Module Federation + legacy runtime`，且当前页型仍依赖 `TypicalPageFieldMapProvider`，生成器可以受管地物化本地最小 `field-map-provider.tsx` 并把页面 import 精确切到 `./field-map-provider`；这属于 hiui-design 明确管理的兼容分支，不是业务页里手写第二套表单桥接。

## legacy-system-reconstruction 输入模式

当 `inputMode=legacy-system-reconstruction` 时，AI 写代码前必须先完成“旧页事实组装 -> family/type 推荐 -> 聊天确认 -> 进入共享主链路”四步，而不是把旧页面直接当成一张可以自由照抄的参考图。

### 第一步：旧页事实组装

必须先形成最小 `legacyReconstructionInput`，至少包含：

- `evidence`
- `pageFamilyRecommendation`
- `pageTypeRecommendation`
- `legacyFacts.titleDraft`
- `legacyFacts.pageGoal`
- `legacyFacts.layoutFacts`
- `legacyFacts.invariants`
- `confirmation`

规则：

- `evidence` 至少要证明一个旧页事实来源，例如旧路由、旧页面代码路径、旧系统 URL、旧系统截图路径或旧系统名称
- `legacyFacts` 先收口业务事实，例如布局、查询语义、表格语义、接口语义、交互语义和必须保留的不变量；不要把旧页面历史实现细节直接升级成新模板
- `migrationInvariantContract` 必须和 `legacyReconstructionInput` 一起进入主链路，用来约束哪些旧业务语义不能漂移

### 第二步：family / type 推荐

在旧页事实组装之后，必须先形成：

- `pageFamilyRecommendation`
- `pageTypeRecommendation`

规则：

- 若旧页主体仍是标准典型页，应优先回到普通典型页链路
- 只有旧页事实明确表明它超出标准模板，但仍保留基础页型大多数特征时，才在同一条主链路里准备 `pageAdjustmentContract`

### 第三步：聊天确认

用户必须在 AI 对话中明确确认以下两项结果：

- `confirmedPageFamily`
- `confirmedPageType`

并基于旧页事实确认 `finalPrompt`。

未完成确认前，禁止进入生成。

### legacy-system-reconstruction 模式 stop-before-code

以下情况必须停止，不允许继续生成，也不允许静默回落成 `page-prompt`：

- 无法形成最小 `legacyReconstructionInput`
- 无法明确 `legacyFacts.invariants`
- 无法给出可解释的 family / type 推荐
- 用户尚未确认最终 `pageFamily`、`pageType` 或 `finalPrompt`

## screenshot 输入模式

当 `inputMode=prototype-screenshot` 时，AI 写代码前必须先完成“截图理解 -> 页型推荐 -> 提示词草稿 -> 对话确认”四步，而不是直接进入模板复制或代码生成。

在“截图理解”这一步里，先回指 `shared-page-design-guidance.md` 抽取共享结构事实：统一页头、唯一 `whiteBody`、主阅读流、区域角色与主联动。若这些事实仍说不清，不应直接靠页面长相去猜页型，更不能把截图排布升格成新的模板枚举。

### 第一步：截图归一化

必须先把截图整理成最小结构事实，包括：

- `sharedStructureFacts`
- `titleDraft`
- `pageGoal`
- `observedLayout`
- `observedModules`
- `unknowns`

规则：

- `sharedStructureFacts` 至少说明统一页头、唯一 `whiteBody`、主阅读流、区域主次关系是否成立
- `observedLayout` 只描述可观察结构，不脑补业务规则
- `observedModules` 只描述可观察模块和字段线索，不等同于最终业务契约
- `unknowns` 必须显式保留

### 第二步：页型推荐

必须先形成 `pageTypeRecommendation`，至少包含：

- `recommended`
- `candidates`
- `confidence`
- `reasons`

规则：

- `candidates` 最多 3 个
- 必须说明为什么推荐这个页型
- 若无法给出可解释推荐，停止，不进入生成

### 第三步：提示词草稿

在页型推荐之后，必须形成 `promptDraft`，它是 screenshot 进入现有提示词链路前的标准草稿，而不是最终代码输入的替代品。

`promptDraft` 必须至少说明：

- 页面标题草稿
- 页面目标
- 可观察布局
- 可观察模块
- 不确定项

### 第四步：聊天确认

用户必须在 AI 对话中明确确认以下两项结果：

- `confirmedPageType`
- `finalPrompt`

未完成确认前，禁止进入生成。

### screenshot 模式 stop-before-code

出现以下情况必须停止：

- 未形成 `pageTypeRecommendation`
- 未形成 `promptDraft`
- 用户尚未确认页型
- 用户尚未确认最终提示词
- `confirmedPageType` 与当前目标页型不一致
- 试图让 screenshot 模式绕过 `coverageDecision`、官方母版、slot boundary 或独立 workflow
- 命中 `data-visualization`，但确认结果仍试图退回普通列表页生成链路

## coverageDecision

AI 写代码前必须形成 `coverageDecision`。纯典型页轻流程可以保持精简，但字段不能省略。

```json
{
  "pageType": "table-stat",
  "matchedManifestPath": ".local-context/hiui-design/docs/generation/page-types.manifest.json",
  "managedRegions": ["header", "whiteBody", "stat-section", "query-filter", "table", "pagination"],
  "businessSlots": ["title", "queryFields", "tableFields", "searchPlaceholder", "overviewRequest", "listRequest", "headerActions", "mockData"],
  "uncoveredUi": [],
  "escapeHatches": [],
  "stopReason": ""
}
```

字段要求：

- `pageType`：必须来自 `page-types.manifest.json`；无法判定时留空并设置 `stopReason`。
- `matchedManifestPath`：必须指向当前项目内的 manifest 路径。
- `managedRegions`：列出由页型 shell 或受管组件持有的区域。
- `businessSlots`：列出本次允许替换的业务槽位；若命中独立能力页工作流，则这里表示受控重构面，而不是批量自动替换清单。
- `uncoveredUi`：列出典型页没有覆盖但业务要求新增的 UI；没有就写空数组。
- `escapeHatches`：列出自由渲染、第三方组件、自定义视觉 token 等逃逸口；默认必须为空。
- `stopReason`：无法继续生成时必须写明具体原因。

## pageAdjustmentContract

当基础典型页无法完整覆盖用户诉求，但页面仍然保留基础页型的大多数特征时，AI 写代码前必须形成 `pageAdjustmentContract`。它描述的是“本次需求相对基础模板的局部改造关系”，不是预设增强类型清单。如果无法形成，就不应继续按“基础模板上的局部改造”路径处理。

```json
{
  "basePageType": "table-basic",
  "retainedTypicalCharacteristics": [
    "single whiteBody workspace",
    "table remains the primary information carrier",
    "pagination ownership stays inside the base page shell"
  ],
  "userAdjustmentIntent": "Add a controlled local structure above the main table workspace to satisfy the user request without rewriting the base page shell.",
  "allowedRegions": ["controlled local region above the primary table workspace"],
  "forbiddenRegions": ["header owner", "table owner", "pagination owner", "main scroll owner"],
  "insertPositionRule": "Adjusted content must stay above the table workspace and must not replace the page header or move below pagination.",
  "designSystemConstraints": [
    "Prefer HiUI5 and local-managed-runtime components",
    "Do not introduce non-HiUI5 base tokens or a second local visual system"
  ],
  "layoutPreservationRule": "The page must preserve the base page shell, whiteBody ownership, main reading flow, and continuous height chain.",
  "adjustmentValidationRules": [
    "result must still clearly belong to the base page type",
    "adjustment must stay inside allowed regions",
    "adjustment must not create a second main page structure"
  ],
  "stopReason": ""
}
```

字段要求：

- `basePageType`：必须是已命中的正式页型；若页型本身未明确，不允许形成 contract。
- `retainedTypicalCharacteristics`：列出生成后仍然必须保留的典型页核心特征。
- `userAdjustmentIntent`：用一句工程可执行的话描述用户要求新增或调整的局部内容。
- `allowedRegions`：描述本次需求允许发生局部调整的相对结构区域；它是当前页面事实，不是预设扩展枚举。
- `forbiddenRegions`：描述本次需求中严禁改动的结构或 owner。
- `insertPositionRule`：说明新增或调整内容相对基础模板应如何插入、挂靠或排序。
- `designSystemConstraints`：明确局部调整如何继续遵守 HiUI5 与典型页规范。
- `layoutPreservationRule`：说明哪些布局链、阅读流和壳层结构必须保留。
- `adjustmentValidationRules`：列出生成后需要满足的局部改造校验规则。
- `stopReason`：无法继续按局部改造 contract 处理时必须写明原因。

执行要求：

- 当 `generationPath=base-template-local-adjustment` 且 `pageAdjustmentContract` 校验通过时，生成器不应只停留在 brief、report 或待办说明层。
- 对已接通受控区域锚点的典型页模板，生成器必须保留官方基础模板，再把 contract 自动执行成一次相对基础模板的局部结构插入或挂靠。
- 自动执行只允许发生在能够映射为稳定结构锚点的受控区域；若当前 contract 指向的区域没有稳定锚点，必须停止生成并明确说明原因，不允许回退到自由手写页面。
- `allowedRegions` 不只用于校验，也用于驱动执行层选择局部改造的插入锚点。
- `insertPositionRule` 不只用于文字说明，也用于约束调整内容相对基础模板的前后顺序。
- `forbiddenRegions`、`layoutPreservationRule` 与 `designSystemConstraints` 必须继续参加生成后校验；即使内容已经自动插入，也不能越过这些边界。
- 当前执行器识别的是相对结构区域语义，例如 `whiteBody top controlled region`、`pre-table controlled region`、`detail-body top controlled region`、`form-scroll top controlled region`、`drawer-body top controlled region`。这些名称是执行层锚点语义，不是页面增强类型目录。

## componentDecision

只有 `uncoveredUi` 非空，或业务槽位内新增可视组件时，才需要展开 `componentDecision`。典型页已覆盖区域写 `covered-by-template`，不重复论证。注意：只要 `uncoveredUi` 命中 `page-adjustment-controlled-region`，即使已经有 `pageAdjustmentContract`，也仍然必须补齐 `componentDecision`；`pageAdjustmentContract` 只锁主结构，不替代组件语义决策。

示例：

```json
{
  "stat-section": "covered-by-template: StatOverviewGrid",
  "query-filter": "covered-by-template: StatListPageFrame + queryFields",
  "table": "covered-by-template: StatListPageFrame + tableFields",
  "headerActions": "hiui5 Button + hiui5 Space",
  "statusIndicator": "hiui5 Tag",
  "textEllipsis": "renderStatTableTextEllipsis",
  "icons": "@hi-ui/icons"
}
```

规则：

- 有 HiUI5 语义组件时，必须优先使用 HiUI5 组件。
- 有 `local-managed-runtime` 受管能力时，必须优先使用受管能力。
- 不得使用 `span/div + className` 伪造 `Tag`、`Badge`、状态胶囊、统计卡片或按钮。
- 不得把模板外手写区域直接落成页面本地 `SkillCard`、`MetricCard`、`StatusBadge`、`TagChip` 等新语义组件；若确有稳定模式，先收口为受管 runtime primitive，再由页面组合。
- 不得用第三方 UI 组件绕过 HiUI5；确有缺口时必须走 `approvedBypass`。

## tokenDecision

只有新增页面本地视觉样式时，才需要展开 `tokenDecision`。典型页 shell 和 HiUI5 组件默认样式写 `covered-by-component-token`。注意：`page-adjustment-controlled-region` 若新增模板外区域，即使最终仍然遵守 layout-only，也必须明确写出视觉来源，避免页面层偷偷发明卡片或标签皮肤。

示例：

```json
{
  "statCard": "covered-by-component-token: StatOverviewGrid",
  "button": "covered-by-component-token: hiui5 Button",
  "statusTag": "covered-by-component-token: hiui5 Tag",
  "localStyles": "layout-only: flex/min-width/min-height/overflow/text-overflow/white-space"
}
```

规则：

- 页面本地样式默认只允许布局辅助属性。
- 默认禁止新增未说明来源的 `color`、`background`、`font-size`、`line-height`、`border-radius`、`box-shadow`、`#hex`、`rgb()`、`rgba()`。
- 若某个新增区域需要卡片、标签、按钮、标题或悬浮态视觉，优先回指受管 primitive 或 HiUI5 组件默认样式；不要在页面样式里新写一套局部视觉规范。
- 宿主字号/行高异常只能回到 `TypicalPageHost` / `host-reset.css` 这类 host baseline 修复；`host-reset.css` 还必须本地接管 `--hi-v5-text-size-*` / `--hi-v5-text-lineheight-*` 等常用文字 token，避免组件回退到 `rem` 后继续吃到宿主根字号污染；不得在业务页里通过全局字体选择器、额外 `font-size` / `line-height` 或“局部纠偏 CSS”对冲宿主公共排版。
- `host-reset.css` 与 `page-owned-mount-support` 这类隔离层只允许恢复宿主排版基线，不得再用 `button`、`input`、`select`、`textarea`、`label`、`span` 这类原生标签做大面积继承去改组件内部。
- 隔离层若必须兼容组件内部结构，必须按真实组件版本类名收口，例如 `hi-v4-form-label*`、`hi-v5-form-label*`；禁止用“组件根类名 + `color: inherit`”或“原生标签兜底”这类宽覆盖方案冒充隔离。
- 当页面文字整体变大/变小时，优先视为公共外壳基线问题，而不是页型模板问题；先修 host baseline，再继续生成或改页。
- 如果业务确实需要新增视觉 token，必须回指 `hiui5-visual-baseline.md`、页型专章或已批准设计依据。
- 无法确认 token 来源时停止生成。

## 轻流程

满足以下条件时走轻流程：

1. `pageType` 已命中 manifest 页型。
2. 本次需求属于标准典型页槽位替换，或命中独立能力页时只在 manifest 声明的受控重构面内整体重构。
3. `uncoveredUi` 为空。
4. `escapeHatches` 为空。
5. 没有新增页面本地视觉 token。
6. 不需要 `pageAdjustmentContract`。

轻流程只需要：保留官方壳层、按页型工作流改动受控区域、运行页型 slot gate 和最小编译。标准典型页是“替换业务槽位”；`data-visualization` 是“固定页头与 whiteBody，由 `queryFields + searchPlaceholder` 承担 page-global control strip，再按规范生成分析内容区，并按需复用单个图表块”。其中摘要区允许独立摘要 grid，正式图表区保持一种基础 grid mode，指标卡迷你图按业务依据决定是否出现；正式图表区落图前必须先完成 `slotPlan / rowFillDecision / selectedChartArchetype` 收口，并保证图表卡片填满网格单元。

## contract 流程

命中以下任一条件时，先形成 `pageAdjustmentContract`，再决定是否补齐 `componentDecision`、`tokenDecision` 或 `approvedBypass`。不要把典型页模板已覆盖的任务强制升级成完整 AI 决策包；只有超出典型页模板已有范围、但仍保留基础页型大多数特征的任务，才进入 contract 流程：

- 使用 `renderCard`、`children`、`customWhiteBody`、`customMainScroll`。
- 新增 `.statCard*`、`.metricCard*`、`.statusBadge*`、`.tag*`、`.chip*` 等伪组件类名。
- 使用 `span/div` 承担状态、标签、徽标、统计卡片、按钮等组件语义。
- 在页面本地样式中新增颜色、字号、圆角、阴影、背景等视觉 token。
- 引入第三方 UI 组件或旧版 HiUI 视觉组件包。
- 业务要求改变页型 shell、白底主体、滚动 owner、筛选 owner、表格 owner 或分页 owner。

形成 `pageAdjustmentContract` 后再判断：

- 是否仍然保留基础页型的大多数特征。
- 是否能够把调整约束在受控区域内。
- 是否仍然基于官方母版起步，而不是回退到空白文件手写。
- 是否仍然可以用 HiUI5、受管 runtime primitive 和 `local-managed-runtime/*` 消化调整部分。
- 是否只是描述了“本次需求相对基础模板的局部改造”，而不是偷偷引入一张新的增强类型目录。

## stop-before-code

出现以下情况必须停止，不允许写近似实现：

- 页型无法判定。
- 母版路径不存在。
- 宿主 HiUI5 import source 无法确认。
- 未覆盖 UI 找不到 HiUI5 组件或 manifest 注册组件。
- 新增视觉 token 找不到 HiUI5 token 来源或设计依据。
- 需要 third-party bridge 但没有 adapter / token bridge。
- 用户需求要求破坏已锁定的典型页受管区域。
- 无法形成合法的 `pageAdjustmentContract`。
- `pageAdjustmentContract` 不能证明页面仍然保留基础页型的大多数特征。
- 目标输出目录不在 `defaultBusinessPageDir` 下，或命中了 `src/typical-page-preview/**` 等 preview forbidden root。
- 计划把 preview route tree、preview app shell 或 preview import 直接带入正式业务页代码。

## approvedBypass

只有 HiUI5 和受管 shell 都没有能力覆盖时，才允许声明 `approvedBypass`。必须包含：

```json
{
  "reason": "",
  "missingHiui5Capability": "",
  "owner": "",
  "expiry": "",
  "tokenBridge": "",
  "reviewEvidence": ""
}
```

缺少 `owner`、`expiry` 或 `reviewEvidence` 时，不允许 bypass。
