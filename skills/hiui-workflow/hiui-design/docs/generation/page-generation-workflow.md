# 页面生成落地流程

## 这份文件解决什么问题

这份文件把 HiUI 典型页生成从“先生成、再检查、再修补”的后置纠偏流程，收敛为“生成前约束 AI 一次做对”的轻量稳定流程。

主路径只做一件事：先把项目模式、`structure semantics`、组件语义 / 基础视觉承载、页面家族 / 页型、`adaptationMode`、官方母版、工作流类型、受控改动面、禁止项和轻量兜底项整理成生成输入，再按对应工作流落地。标准典型页走“母版 + 槽位替换”；数据可视化走“固定页头与 whiteBody + 规则驱动内容区生成”；两者在 family 主结构仍然成立时，都可以进入同一条 `local-adjustment` 路径。

本文件不替代以下事实源：

- `design-system-first.md`：组件和设计系统边界
- `shared-page-design-guidance.md`：family 之上的共享结构与视觉指导
- `generation-principles.md`：共性生成原则和禁止项
- `page-types.manifest.json`：机器可读页型事实源
- `page-type-map.md`：页型判定入口
- `figma-page-rules.md`：Figma 注册入口
- `figma-pages/*.md`：页型正文和共享规则

## 适用范围

- 生成新的 HiUI 典型页
- 修改已有 HiUI 典型页
- 将官方母版落到旧项目业务目录
- 将示例页业务化为真实页面
- 在旧项目中用轻量链路接入典型页

## 核心原则

### 1. 母版驱动优先

生成后检查不是主路径。AI 写代码前必须先得到轻量生成输入包，输入包至少包含：页型、官方母版路径、目标业务路径、工作流类型、必留壳层、可替换业务槽位或受控重构面、禁止项、轻量自检项。项目模式和宿主接入策略只在影响母版承载或入口接入时展开。

当前生成输入固定按三段收口：

1. 先判主结构：先形成 `structureSummary` 与 `intentContract`，确认 primary region、reading flow 和 owner。
2. 再锁组件语义：模板外的任何手写区域，必须先收口到受管基础组件、HiUI5 公开组件或已注册 runtime primitive；页面层只允许组合，不允许自由发明新的卡片、标签、按钮或视觉语义。
3. 最后模板落地：只有前两层稳定后，才允许选择官方母版并进入具体生成工作流。

固定假设：

- `hiui-design` 生成的新页面默认就是业务页面
- 默认业务页面目录根是 `src/pages`，但这只是缺少页级证据时的回退值；对 `existing-system`，一旦已确认 legacy 业务入口、`implicit-feature-registry` 或显式 `navigationMountContract`，`defaultBusinessPageDir` 必须收口到该项目已证明的既有业务目录，例如 `src/views`
- preview 资产只可参考，不可输出，不可进入正式路由树
- 若当前项目已存在业务导航，生成的新页面必须挂靠到既有导航；`hiui-design` 保障的是“页面不是裸页面”，不是“先把老项目导航改造成官方导航”
- 若当前项目是 `host-integration` 的全新项目且还不存在业务导航，首次生成真实业务页时必须同时补正式导航
- 首次补正式业务导航壳时，`examples/host-integration/src/app-frame-core.tsx` 是官方宿主母版，不只是导航样式参考。`examples/host-integration/src/app-frame.tsx` 仅承载 preview prompt overlay，不得作为正式宿主事实源。默认直接业务化复用 core 的宿主结构与高度链，只替换 `routes`、`shellOptions`、品牌文案和业务菜单数据；不要让 AI 自己重组 `Layout/Sider/SideMenu/FloatMenuContainer`，也不要让 AI 再发明一套“更轻”的左栏壳
- 若当前项目是旧项目且能够证明已有业务导航入口、业务路由注册表、业务入口文件或 legacy 页面入口，那么直接挂靠即可；这里不要求对老项目导航做官方认证
- 若当前项目是旧项目且自动挂靠能力不足，但页面目标目录、页型合同和宿主前提都成立，则页面源码仍然可以先生成；自动挂靠改为输出人工接入说明，而不是把整页生成流程卡死
- 若当前项目是旧项目且无法证明已有业务导航入口，必须停止并要求人工指定挂靠点；不得自动补正式导航
- 导航挂靠决策必须在写页面代码前完成：先形成 `navigationMountDecision`，再落成 `navigationMountAction`，随后才允许判页型、选母版和写正式业务页目录。若 `navigationMountAction` 属于自动动作，则先执行再写页面；若属于人工确认动作，则页面源码可以先生成，但结果里必须携带明确的人工接入说明。只有挂靠点本身无法确认时才必须停止

写代码前还必须完成 `docs/generation/ai-page-generation-guidance.md` 定义的 `coverageDecision`：先确认标准模板已覆盖区域、本次业务槽位、`structureSummary` 与 `intentContract` 是否一致，再判断是否存在 `uncoveredUi`、`unexpectedStructures` 或 `escapeHatches`。只有模板未覆盖 UI、自由渲染、第三方组件、页面本地视觉 token，或系统试图新增 `mustNotAdd` 禁止的结构，才升级到更重的决策或直接 fail closed。

当 `coverageDecision.uncoveredUi` 命中 `page-adjustment-controlled-region` 时，不得把 `pageAdjustmentContract` 误当成“已经可以直接写页面”。这只说明主结构已收口，还必须继续补齐 `componentDecision` 与 `tokenDecision`，把新增区域明确绑定到受管组件和基础视觉来源，然后才允许进入模板落地。

生成输入包必须说明组件运行时策略：hiui-design 链路中的 HiUI 视觉组件只能解析到 HiUI5；`@hi-ui/schema-*` 允许保持 schema 4.x，但它们继续解析到的 `@hi-ui/table`、`@hi-ui/input`、`@hi-ui/select`、`@hi-ui/date-picker` 等视觉 peer 也必须是 HiUI5。普通业务页生成不默认先跑依赖隔离；首次接入、依赖变更、典型页 shell 无法解析或运行时 peer 报错时，再运行依赖隔离检查。

生成器必须先引导源码走白名单：页面源码优先调用 `local-managed-runtime/*` 受管页壳和 schema/query 适配能力；`QueryFilter` 的样式与默认值由页壳内部托管，官方母版可以依赖 `@hi-ui/query-filter`，生成后的业务页继承这层适配而不是自己再手写一层；业务按钮、表格、输入、选择、日期等视觉能力不得直接 import 旧项目根依赖中的 `@hi-ui/*` 视觉包。若宿主是 legacy/Camora/Module Federation，必须先建立按 issuer scoped 生效的 HiUI5 peer replacement 适配能力或使用明确的 HiUI5 alias，覆盖本地运行时目录与 `@hi-ui/schema-*` / `@hi-ui/dumb-wrapper` / `@hi-ui/number-range` 等实际运行链路；只做全局 alias 或只覆盖壳包根都不算通过。对仍运行 classic JSX runtime 的宿主，生成页还必须保留显式 `import React from 'react'`。若宿主同时命中 `high-risk + Module Federation + legacy runtime`，而页型仍依赖 `TypicalPageFieldMapProvider`，生成器应继续从官方模板起步，但自动落一本地最小 `field-map-provider.tsx` 并把页面 import 精确切到本地 shim，而不是另起一套 compat 母版。

### 2. 官方母版优先

生成页面必须从 `examples/host-integration/src/pages/<nearest-template>.tsx` 起步。不要从空白文件、旧业务页面、通用后台脚手架或旧 HiUI 版本页面反推结构。

### 3. 标准典型页只替换业务槽位，独立能力页整体重构受控工作区

标准典型页允许替换标题、路由、查询字段、表格列、表单字段、详情字段、请求函数、mock 数据、按钮文案和跳转目标。独立能力页不按这份清单逐项自动替换，而是围绕 manifest 声明的受控重构面整体生成工作区；已有图表只允许按图表级别选择性复用。两者都禁止改写固定页壳、单一 `PageHeader` / `whiteBody` / footer owner、滚动链、默认 spacing 和默认视觉语法。

### 4. 旧项目轻量兜底

旧项目满足依赖、样式、路由和暴露前提时，不默认开启浏览器截图、全量 DOM diff 或重型 smoke gallery。默认只做源码级轻量 sanity check；浏览器级验收只在首次接入、宿主壳变更、样式版本变更或页面异常时启用。

## 分步落地流程

### 1. 确认输入方式

先明确当前任务属于哪种 `信息输入方式`：

- `page-prompt`
- `prototype-screenshot`
- `figma-design-restore`
- `design-screenshot-restore`（第二阶段降级入口，暂不对外公开）
- `legacy-system-reconstruction`

信息输入方式不决定页型，只决定 AI 如何理解页面证据。

补充约束：

- `prototype-screenshot` 只服务于原型生成，不再承担“高保真设计还原”口径
- `figma-design-restore` 与 `design-screenshot-restore` 属于设计还原输入链；它们应先形成 `restoreDecisionPackage`，再进入共享主链
- 当前主链脚本已经接收设计还原输入，但前置仍要求上游提供 `confirmedDesignRestoreInput`
- 当前第一阶段只对外开放 `figma-design-restore`；`design-screenshot-restore` 保留为第二阶段降级入口
- 不要把 `prototype-screenshot` 包装成设计还原替代入口

当输入方式是 `prototype-screenshot` 时，P0 固定规则如下：

- 只支持单张主页面截图
- AI 在对话中先完成共享结构事实提取，再完成截图理解
- AI 在对话中完成页型推荐与提示词草稿
- 用户在对话中确认最终页型与最终提示词
- 确认结果以内存对象传递给 brief / generate 主链路

截图固定约束：

- 先回指 `shared-page-design-guidance.md`，抽取统一页头、唯一 `whiteBody`、主阅读流、区域角色和主联动
- 图片、原型和历史页面只作为事实来源，不作为新页型定义或示例枚举来源

此阶段若发现多图输入、用户未确认或提示词草稿无法形成，必须直接停止。

### 2. screenshot 归一化与聊天确认

当输入方式是 `prototype-screenshot` 时，必须先完成以下子步骤，再继续走通用主链路：

1. 形成共享结构事实摘要
2. 形成 `pageTypeRecommendation`
3. 形成 `promptDraft`
4. 列出 `unknowns`
5. 在对话中确认 `confirmedPageType`
6. 在对话中确认 `finalPrompt`

固定门禁：

- 共享结构事实摘要为空时，不允许继续形成页型推荐
- `confirmedPageType` 为空时，不允许形成 brief
- `finalPrompt` 为空时，不允许形成 brief
- `confirmedPageType` 与最终生成页型不一致时，不允许进入生成
- screenshot 模式不得绕过 manifest、official template/reference、coverageDecision、slot boundary、workflow 和 navigationBlocked

### 3. 判定项目模式

先按 `docs/onboarding/integration-modes.md` 判定项目模式：`host-integration` 表示项目可承接受管宿主基线、官方 source assets 与 smoke/doctor 联调治理能力，且官方示例默认仍由 skill 包内 `preview-runtime/` 承载；`rules-only` 表示在目标项目既有结构中接入规则、官方母版起点和本地运行时基线，但不补 `host-integration` 那套更完整的 source/bridge/guidance 基线。`--mode auto` 会先复用已记录 mode；若没有这份 apply-state 证据，就只判断目标项目是否需要项目本地兼容桥，不需要时走 `host-integration`，需要时走 `rules-only`。已下线历史链路已不再属于当前对外模式；如需回溯旧链路，只能通过 git 历史恢复。真实业务页仍独立于 skill 包内 preview runtime 生成，并默认落到业务页面目录；只有当旧项目已经证明 `implicit-feature-registry`，且目标显式落在该宿主的 `implicitFeatureBaseDir` 下时，才允许改写到 `src/features/*` 这类自动发现入口目录。

正常用户路径下，项目模式不会再停在“无法判定”。若自动判型没有返回 `host-integration` 或 `rules-only`，应视为 `resolveAutoInstallMode()` 的实现异常，先修脚本，而不是围绕“未判定 mode”设计新的人工分支。

若项目级 `integrationReadiness` 仍为未 ready，生成流程必须停在接入补齐，不得转去分析目标项目现有业务页、普通 `PageTable`、空白页、`window.addPage`、路由或 Module Federation `exposes` 来拼一条“宿主兼容生成”分支。该状态下唯一允许的后续动作是 `ensure-or-stop`。

当 `integrationReadiness.ready=true` 后，生成流程还必须继续检查 `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json`：

- `pageTaskReadiness = ready-to-generate`：允许继续进入页型 brief、模板选择和页面写入
- `pageTaskReadiness = ensure-only`、状态文件缺失、或 freshness 检测到 `package.json`、锁文件、入口文件、构建配置、项目本地 `.context.jsonc` 任一发生漂移：流程必须继续阻断，并要求先运行 `typical-page:preflight`
- 阻断态的公开解释统一来自 `PROJECT_PAGE_TASK_STATUS.json` 的 `gateStatusReason`、`staleInputs`、`nextRequiredAction`、`canAutoRecover` 与 `contractSnapshotId`；planner、brief 和单入口生成器必须透传这组字段，不再各自产生第二套门禁语义

旧项目首次接入、依赖变更、典型页 shell 无法解析或运行时 peer 报错时，应尽早运行依赖隔离与缓存一致性检查：`node .local-context/hiui-design/scripts/dependency-isolation-check.mjs --target "$PWD" --json`。该检查只读不写，先核对 `docs/onboarding/managed-local-runtime-dependencies.json`（本地运行时依赖合同文件，当前规定目标项目必须声明哪些受管依赖）里的合同，再确认可选嵌入来源快照、`package.json` 声明、lockfile、已安装版本、peer 依赖、运行时 import 图和构建层 HiUI5 peer replacement bridge 一致；失败时先修依赖链。普通业务页生成默认不把该检查作为 discover / ensure / preflight 的第一步，但一旦 planner / brief 已经放行到真实写页阶段，`generate-page-from-brief.mjs` 仍会把它作为默认的预写入工程门禁，fail closed 后再写页面。

### 4. 执行导航挂靠动作

页面任务门禁放行后，先区分“项目挂载机制识别”与“具体页面挂载绑定”：

- 项目接入阶段只需要确认当前宿主属于哪类挂载机制，例如现有注册表、`ModuleFederationPlugin.exposes`、隐式 feature registry、legacy 业务入口
- 只有在进入某一张页面的真实生成任务，并且已经拿到 `dest`、标题、routePath、exposeName 或显式 `navigationMountContract` 后，才执行 `docs/generation/ai-page-generation-guidance.md` 定义的 `navigationMountDecision` 与 `navigationMountAction`
- 若使用显式现有导航注册表 contract，`navigationMountContract.menuRegistryPath` 必须与 `navigationMountContract.routeRegistryPath` 指向同一份正式注册表；split menu/route registry 自动双写不在当前受管 contract 范围内

- `attach-existing`：若命中当前执行器已支持自动 patch 的 `src/business-shell/routes.*` / `src/business-layout/routes.*` / 现有项目路由注册表，则先 patch 已识别且已确认可写入的 `src/business-shell/routes.*` / `src/business-layout/routes.*` / 现有项目路由注册表，由单一配置驱动菜单和路由，再写页面代码；若命中 `implicit-feature-registry`，则先执行 `materialize-implicit-feature-entry`，把页面物化到现有 `import.meta.glob('/src/features/*/index.*')` 可自动发现的直属子目录入口，再写页面代码；若命中显式 legacy 业务入口 contract，则落成 `append-existing-entry` 的人工确认动作，用已验证的 `entryPath + entryKind` 继续页面生成，并在结果中输出旧项目接入说明，而不是把旧项目一律升级成受管 formal shell。若挂靠点已确认但当前执行器不支持自动 patch，则页面源码继续生成，自动挂靠改为人工说明；只有旧项目挂靠点根本无法确认时才应 blocked。对旧项目，这里的核心要求是“挂靠点已确认”，不是“导航已认证”
- `attach-existing` 还包括命中 `ModuleFederationPlugin.exposes` 的场景：此时应先把 expose 视为正式发布入口，再决定 expose 注册、宿主映射或人工说明，而不是被零散的 `window.addPage` / `openNewPage` 噪音调用抢占优先级
- `attach-existing` 命中 `ModuleFederationPlugin.exposes` 时，还必须继续区分“发布入口”和“页面源码目录”：发布入口只回答对外怎么发，不单独回答页面应写到哪；页面业务目录优先跟随已确认 legacy 业务入口、`implicitFeatureBaseDir` 或显式 `navigationMountContract`
- `create-first-formal-shell`：先准备 `src/business-shell/app-frame.*`、`src/business-shell/routes.*` 和明确的真实入口接入目标，再写页面代码；只有真实 app entry 命中受支持的最小 ReactDOM bootstrap 时才允许自动 patch 入口，已有 router runtime 或入口形态不受支持时必须回到 `ask-user`
- `ask-user`：停止并要求用户指定挂靠入口，不得写正式业务页目录、不得裸挂 `App.tsx`、不得自造 `src/components/BusinessAppShell.*` 或 `src/routes/business-routes.*`

这一步不是生成后验收项，而是页面生成前的固定决策动作。目标是让 AI 一次走对挂靠路径，而不是生成后再靠 doctor 或人工发现左侧导航缺失。对旧项目中的人工确认型挂靠，这里要求的是“先确认挂靠点，再生成页面，并把后续接入说明带出来”，不是“先自动 patch 完所有入口”。但如果当前任务仍停留在“项目接入完成性检查”，则不应提前要求回答“某张页面挂到哪里”。

### 5. 判定页面页型

先读 `page-type-map.md` 的页型路由表和 AI 业务场景到页型快速判定。页面必须落到已有页型之一，或明确选择最接近页型并记录偏移原因。只有页型边界不清或需要视觉细则时，再读 `figma-page-rules.md` 和命中的 `figma-pages/*.md`。

在这一步之前，必须先完成 `structure semantics`：

- `primaryRegions`：页面有哪些稳定主区域。
- `regionRoles`：每个区域承担什么业务职责。
- `readingFlow`：页面如何开始阅读、如何收口。
- `interactionOwners`：核心操作归属在哪个区域。
- `intentContract.mustHave / mustNotAdd`：用户明确要什么、不要什么。

如果这层事实仍然模糊，不允许直接锁页型，也不允许仅因为“出现图表”或“出现表格”就提前判定页面家族。

页型边界：

- 指标卡 + 筛选 + 表格 + 分页：数据统计表
- 常规筛选 + 表格 + 分页：普通表格
- 树在表格首列内展开：树形表格
- 左树和右表分区：左树右表
- 可编辑字段 `<= 16`：抽屉表单
- 只读描述项 `<= 16`：抽屉详情
- 可编辑字段 `> 16`：全页编辑
- 只读描述项 `> 16`：全页详情
- 页面主内容是成功、失败、空状态、无权限说明：异常反馈页
- 图表是主信息载体：数据可视化

页面家族边界：

- `typical-page`：`table-stat`、`table-basic`、`tree-table`、`tree-split`、`drawer-form`、`drawer-detail`、`full-page-edit`、`full-page-detail`、`feedback-status`
- `analytics-page`：`data-visualization`
- `non-typical-page`：完全非典型页面家族；当前已提供 family-specific 的 AI 前置引导、最小 contract、`load-generation-brief.mjs` / `plan-page-task.mjs` 执行接线、`nonTypicalExecutionBrief`、family-specific generator、light sanity 与样本验证回归；validated v1 scope 的主链路已对外开放，但 `legacy refactor contract` 仍未接通

### 6. 锁组件语义与基础视觉承载

在页型已经明确、且本次任务存在模板外受控区域时，必须先形成组件与视觉承载决策，再继续读取模板契约：

- `componentDecision`：新增区域具体由哪些受管组件承载，例如 runtime primitive、HiUI5 组件或 `local-managed-runtime/*` 公开能力。
- `tokenDecision`：新增区域的视觉来源；默认只能是组件默认样式、官方 chart theme、HiUI5 baseline 或文档已批准 token 来源。

固定规则：

- `page-adjustment-controlled-region` 不得跳过这一步。
- 页面层禁止新增 `SkillCard`、`StatusBadge`、`TagChip` 这类未注册语义组件。
- 页面本地样式默认仍然只允许 `layout-only`；卡片、标签、按钮、标题层级、颜色、边框、圆角、阴影等视觉语义必须由受管 primitive 或 HiUI5 组件承接。

### 7. 读取机器可读生成契约

从 `page-types.manifest.json` 读取命中页型的 `generationContract`。如果当前页型缺少 `generationContract`，不允许靠经验脑补；必须先补 manifest，再同步派生文档。

`generationContract` 至少提供：

- `baseTemplatePath`
- `requiredShell`
- `requiredImports`
- `requiredSlots`
- `businessSlots`
- `moduleExportContract`
- `forbiddenTokens`

若 `generationContract.moduleExportContract.routeMountable = true`，则该页面主模块必须同时满足两条导出契约：保留一个具名 `*Page` 页面组件导出，并提供 `export default <SamePageComponent>`。当前受管路由补写链路默认通过 `import Xxx from '...'` 挂接页面，因此这条契约不是“代码风格建议”，而是正式业务路由可稳定消费页面模块的前置条件。

若页型声明了 `generationWorkflow`，还必须读取其 `kind`、`defaultFlow`、`generatorMode`、`requiredModuleSet` 和 `replaceBusinessSlotsByDefault`。当 `replaceBusinessSlotsByDefault = false` 时，不允许把该页型塞回“复制母版后替换业务槽位”的通用链路。

### 7.1 锁定槽位和区域边界

读取 `page-slot-boundaries.md` 中命中页型的小节，确认：

- `allowedSlots`：业务只允许填充这些槽位
- `forbiddenSlots`：不得使用或不得承载业务内容的槽位
- `dangerousProps`：容易被误当成自由扩展区的 props
- `regionOwnershipContract`：header、white body、main scroll、footer、drawer body、left pane、table container 的唯一 owner

接口未接入、mock 状态、生成说明和测试说明不得进入页面常驻 UI；除非 manifest 明确允许公告/提示槽位，否则只写入回复、README、meta 或按钮点击 `Message`。
- `lightSanityChecks`
- `generationNotes`

### 8. 形成轻量生成 brief

默认先运行 `scripts/plan-page-task.mjs` 做轻量 planner gate。只有当 planner 或 `generation-brief.mjs` 已确认 `integrationReadiness.ready=true` 且 `pageTaskReadiness = ready-to-generate` 后，才允许由 AI 根据 manifest、规则文档和官方母版形成轻量单页 brief。若 planner 返回 `integrationReadiness.ready=false`，后续只能执行 `typical-page:ensure` 或直接停止；若 `pageTaskReadiness != ready-to-generate`，后续只能执行 `typical-page:preflight` 或直接停止，AI 不再自由翻旧页面猜结构。对 `rules-only + existing-system + Module Federation direct expose` 且命中 `preWriteAction=materialize-managed-mf-host-contract` 的页型阻断，planner 现在必须显式输出 `managed-mf-host-contract-autofix -> typical-page:preflight -> rerun plan-page-task` 这条受管闭环，而不是只给一个“回宿主治理”的硬阻断结论。

从当前版本开始，brief 组装的事实链路固定为三层：

1. `typical-page:preflight` 负责唯一一次项目级源码扫描，并把结果冻结到 `PROJECT_HOST_CONTRACT.json`
2. `generation-brief.mjs` / `load-generation-brief.mjs` 只读取这份 contract，再叠加本次页级输入，例如 `dest`、`routePath`、`title`、`navigationMountContract`
3. `generate-page-from-brief.mjs` 只消费 brief 里的 `pageGenerationDecision` 与 `hostExecutionAdapter`，不再回退到项目源码重扫
4. `generate-page.mjs` 仅在 page-task gate 明确给出 `canAutoRecover=true` 且 `nextRequiredAction=typical-page:preflight` 时，允许内部自动补跑一次 preflight；除此之外仍保持 fail-closed

这意味着两个 fail-closed 规则必须同时成立：

- `PROJECT_HOST_CONTRACT.json` 缺失时，只要页面任务门还显示可继续，brief 就直接阻断
- `PROJECT_HOST_CONTRACT.json` 存在但缺少 `formalNavigation` 时，只要页面任务门还显示可继续，brief 同样直接阻断；不再允许偷偷回退到 `detectFormalNavigation()` 重新猜一次
- 但在当前实现里，更常见的表面现象是 `pageTaskReadiness` 先因 freshness 回退到 `ensure-only`，这时对外先看到的是“先重新跑 `typical-page:preflight`”，而不是 downstream（下游阶段，当前语境里指 brief / generate 这些后续步骤）单独报 contract 阻断

对 validated v1 scope 的 `non-typical-page`，上层 workflow 如需稳定调用最小闭环，应优先使用 `scripts/execute-non-typical-page-task.mjs`，而不是自行拼接 `plan-page-task -> generate-page-from-brief -> non-typical-page-sanity`。

brief 必须说明：

- 当前输入方式
- 若输入方式为 `prototype-screenshot`：页型推荐、提示词草稿摘要、确认方式、确认页型、最终提示词摘要

- `structureSummary`
- `intentContract`
- `adaptationMode`
- 当前项目模式
- 当前页型
- 官方母版路径
- 当前工作流类型
- 目标页面路径
- `targetBusinessPath`、`defaultBusinessPageDir`、preview forbidden roots 与 route isolation policy
- 必须保留的壳层和 import
- 允许替换的业务槽位，或独立能力页的受控重构面与固定区域
- 禁止改动的结构区域
- 页型专属轻量检查项
- 若命中 `local-adjustment`：当前仍保留哪些 family/pageType 特征、允许改造哪些稳定锚点、系统不得新增哪些结构
- 路由和入口是否允许自动接入
- `businessSlotPlan` 是否已经给出标题、筛选项、表格列、指标卡、请求/mock 主题和禁止残留文案；标准典型页必须先按它替换允许槽位，再写业务页
- 若命中 `rules-only + existing-system + Module Federation direct expose`：是否已经从 `PROJECT_HOST_CONTRACT.json` 读取 `hostExecutionAdapter.kind = mf-direct-expose-legacy`，并明确区分 `pageSource.defaultBusinessPageDir / targetBusinessPath` 与 `publishEntry.configPath / managedPublishEntryPath`
- 若未命中这条链路：是否保持 `hostExecutionAdapter` 为空，并且没有把这个条件字段误当成所有页面的全局必填合同
- 若本次新增的是项目首个正式业务导航壳：是否满足 `host-integration + greenfield + 当前不存在业务导航`、导航是否复用 preview `app-frame` 的样式/布局语法、以及 preview route tree 是否仍保持隔离
- 若当前项目已存在正式业务导航壳：正式导航注册表文件在哪、是否由同一份配置同时驱动菜单和路由、以及本次页面应追加到哪个导航分组下
- 若当前项目是旧项目且无法证明已有业务导航入口：是否已经明确 blocked，并要求人工指定挂靠点
- 正式导航是否只包含真实业务页、默认 landing 是否指向首个真实业务页、以及是否明确禁止自动生成“工作台/首页概览”等合成占位页
- 是否需要脚本 brief、dependency-isolation、integration-preflight 或 smoke；若不需要，说明原因

当输入方式为 `prototype-screenshot` 时，只有在“用户已在对话中确认 `confirmedPageType + finalPrompt`”之后，才允许进入本步骤；否则直接 fail closed。

### 8. 复制最近官方母版

按页型选择最近母版：

- 普通表格：`examples/host-integration/src/pages/basic-table.tsx`
- 数据统计表：`examples/host-integration/src/pages/table-stat.tsx`
- 数据可视化：`examples/host-integration/src/pages/data-visualization/index.tsx`
- 树形表格：`examples/host-integration/src/pages/tree-table.tsx`
- 左树右表：`examples/host-integration/src/pages/inventory-split.tsx`
- 抽屉表单：`examples/host-integration/src/pages/drawer-form.tsx`
- 抽屉详情：`examples/host-integration/src/pages/drawer-detail.tsx`
- 全页编辑：`examples/host-integration/src/pages/full-page-edit.tsx`
- 全页详情：`examples/host-integration/src/pages/full-page-detail.tsx`

所有项目都不能把 `examples/host-integration/` 整包复制进正式业务源码，只能把命中的单页母版结构迁移到目标业务目录。preview 示例页只用于联调、对照和 smoke，不进入正式业务菜单树，也不得写入 `src/typical-page-preview/**` 作为正式业务输出。

标准典型页复制母版时，不是只复制 `.tsx`。生成器必须同时复制并锁定：母版 `.tsx`、母版 `.module.scss`、请求 / mock 数据形状、宿主承载能力、DOM class 兼容选择器、页型布局契约。任何一项缺失，都视为“未完整复制官方典型页母版”。

`data-visualization` 不复制整页母版，但仍必须锁定官方 shell/style contract、`generationWorkflow.referenceModules`、DOM class 兼容选择器和页型布局契约；只有图表块可以被选择性复用。

当 brief 输出 `pageGenerationDecision.copyMode = host-shell-fix-required` 时，必须立即停止写页并回到宿主治理；但这里先分清阻断来源：

- 若项目已提供有效的 `src/**/hiui-managed-host.contract.json`，则它就是正式宿主事实源；这类项目不应再因为缺少旧式 `components/layout/*` / `business-layout/*` 证据而进入 `host-shell-fix-required`。
- 若项目存在 `hiui-managed-host.contract.json` 但 contract 无效，则阻断点是“contract 自身失真”，应先修 contract、`app-frame.*`、`app-frame-core.*`、`host-reset.css` 或 publish entry，而不是回退成源码启发式放行。
- 对非抽屉整页，若页面已具备 `page-owned support file`，则共享 `header slot` 的空态证明降为兼容事实与验收项，不再单独触发 `host-shell-fix-required`；此时默认由页面挂载时自动隐藏宿主页头、卸载时恢复。
- 只有在项目确实要复用现有共享布局内容区，且当前 `mount region` 仍不可拉伸、共享 content outlet 高度链缺失，或页面无法安全接入 `page-owned support file` 时，才保留原有严格动作：先修宿主，再重跑生成。

### 9. 按页型工作流落地改动

标准典型页按 brief 的 `businessSlotPlan` 替换标题、字段、列、请求、mock、按钮、跳转和路由信息；不能只改 `title` 后保留母版里的示例业务词。独立能力页则按 brief 固定页头与 `whiteBody`，由 shell-owned `queryFields / searchPlaceholder` 承担 page-global control strip，再按规范生成 `summarySection / chartSection / optional detailTable`；其中 `summarySection` 可独立使用摘要卡 grid，正式 `chartSection` 必须在整个图表区保持一种基础 grid mode，主图通过同一 grid 中的 span / 主次权重强调，指标卡迷你图按业务依据决定是否出现；若业务不需要记录下钻、复核或后续操作承接，不要为了套示例硬补尾部表格；如需复用示例，只复制单个图表块，不复制整页。两类页型都必须保留母版的固定页壳、slot 顺序、provider 包裹、样式 import、单一 `PageHeader` owner、`whiteBody` owner 和滚动链。

正式业务页不得引用 preview route tree、preview app shell 或 `__typical-preview` 入口；preview 资产只能作为结构和交互对照。

如果业务需求要求改变壳层结构，停止生成，先回到页型判定；不要在错误母版上继续 patch。

### 10. 接入目标项目入口

按目标项目既有架构接入入口：页面文件、路由、菜单、业务按钮、微前端 `exposes` Camora `window.addPage`。

旧项目接入口必须显式确认，不能自动猜测。如果业务导航挂靠点、路由注册表或微前端暴露方式不明确，必须停止并输出接入说明，不得先生成裸业务页面或自动修改正式入口。

若当前项目是 `host-integration` 的新项目/轻骨架，且本次是首个真实业务页接入正式菜单，同时当前项目还不存在业务导航，则默认需要补首个正式业务导航壳。该导航壳必须直接从 `examples/host-integration/src/app-frame-core.tsx` 业务化复用，而不是只“借鉴导航长相”或复用 `examples/host-integration/src/app-frame.tsx` 的 preview overlay 包装。在生成前要先形成 `navigationMountDecision`，明确是 `create-first-formal-shell` 而不是事后补救。`LayoutContentProvider`、`TypicalPageHostBridge`、`headerRef/footerRef/titleTextRef`、`Layout/Sider/SideMenu/FloatMenuContainer` 结构骨架，以及 `styles.root/sider/siderBody/sideMenuWrapper/main/headerSlot/outlet/footerSlot` 的高度链都属于认证锁区；允许替换菜单数据、品牌标题和业务路由挂靠，但不允许手写另一套自定义左栏视觉、自己重组宿主结构，或靠新增 `min-height: 100vh`、额外 `overflow-y: auto`、额外白卡/灰底包层去补宿主高度。`hiuiDesignFormalShell='official-managed-host-shell-wrapper'` 这类 marker 不能代替受管 import 认证。preview route tree 仍必须保持隔离，不能直接并入正式菜单树。

若当前项目已存在正式业务导航壳，则后续新页面默认必须继续落在该导航体系下。推荐做法是维护单一正式导航注册表：同一份配置同时产出左侧菜单和业务路由出口。若当前执行器支持这份注册表，则先把页面注册进去，再由宿主从该注册表派生菜单与路由；若当前执行器尚不支持自动 patch，则页面源码仍可生成，但必须输出人工接入说明，不要把“自动挂不上”误判成“页面不能生成”。

若当前项目属于旧项目，但无法从当前代码事实证明已有业务导航入口，则这里必须直接 blocked：不要自动补首个正式导航壳，也不要猜测挂靠位置。正确动作是要求人工指定目标导航注册表、菜单挂靠点或路由接入文件，再继续生成/接入。

无论是首次补正式导航壳还是后续追加页面，正式导航都只允许展示真实业务页。默认 landing 必须直接落到正式导航注册表中的首个真实业务页，不得为了“有个首页”自动合成“工作台”“业务工作台”“首页概览”等占位页面；只有用户显式要求仪表盘或工作台时，才允许新增这类页面，并按真实业务页面对待。

完成 `navigationMountAction` 之后，再判断是否还涉及独立入口。若要新增或修改 Module Federation `exposes`、Camora `window.addPage` / `openNewPage` 或导航注册表之外的业务入口，且接入方式无法由目标项目现有代码直接证明，再运行入口接入 preflight。示例：`node .local-context/hiui-design/scripts/integration-preflight.mjs --page-type table-stat --dest src/views/order/store-task-management --title 门店任务管理 --expose-name StoreTaskManagement --entry-file src/views/order/order-home/order-filter/index.jsx --json`。该脚本只检查目标页面目录、MF `exposes`、`window.addPage` / `openNewPage` 路径、业务入口文件引用；代码注册通过但 Camora / proxy live source 尚未确认时返回 `status: pass-with-runtime-pending`，显式入口证据缺失或 runtime source 已验证失败时才返回 `status: blocked`。若 preflight 进入 runtime pending，下一步先运行 `node .local-context/hiui-design/scripts/verify-remote-runtime-source.mjs --expose-name StoreTaskManagement --json`，不要把“尚未验证 live source”和“入口接法错误”混在一起。若仅在已加载模块内部做视图切换，不默认要求 preflight，但必须记录“不新增独立入口”的接入理由，并在 planner / brief 中写出对应的 `pageRelationDecision`。

页面关系的判断顺序必须保持轻量：先看用户提示词诉求和显式上下文证据，再看页型是否提供辅助信号。像“在客服工单管理增加按钮，点击进入创建客服工单页面”这种输入，主结论应该是“这是从父页进入子页”，而不是先因为它长得像 `full-page-edit`（全页编辑页型）就去猜它是不是独立发布页。也就是说，`page-type` 负责选模板，不负责决定页面归属。

一旦 `generation-brief.mjs` 已经形成 `pageRelationDecision`，后续阶段默认不得再自由重算另一套页面关系。`integration-preflight.mjs` 如果发现当前命令缺少 `related-page-path`，但目标目录下已经有 `hiui-pagegen.meta.json`，应优先复用那里的页面关系与父页面证据，而不是重新退回“独立暴露入口默认检查”。若历史产物已经残留独立发布痕迹，例如 `mf-entry.*` 或 `managedMfPublishEntry.required=true`，先使用 `page-relation-safe-fix.mjs --dest <relative-dir>` 做安全修复，再重新执行 preflight。

对 `Camora` 宿主还要额外遵守一个闭环约束：当 `remoteDebugContract.mode === camora-regex-proxy` 时，`generate-page-from-brief.mjs` 在真实写盘后会自动补做一次 live runtime 判断，而不是把它留给用户自己补。这里的目标不是加重普通生成链路，而是避免出现“页面文件已经生成、测试链接也给出来了，但页面还是一直 loading”的误导性结果。Camora 命中时，生成器只会在当前宿主分支里额外返回 `primaryPageLinkRuntimeReadiness`、`primaryPageLinkCaveat` 和 `camoraRuntimeClosure` 三组结果：

- `ready`：代码接线成立，live `remoteEntry.js` 已经暴露 expose，测试链接可直接验收
- `written-but-runtime-not-ready`：页面文件已生成，但当前本地 remote 未准备好，例如 dev server 未起或 Camora 仍在命中旧 bundle
- `blocked-by-code-registration`：问题首先在代码接线，先补 expose / addPage / 页面产物证据，再谈 Camora runtime

注意这个闭环只针对 Camora 宿主，不外溢到普通项目，也不会自动重启 dev server、自动修改代理规则或自动强刷浏览器。作为生成前闭环的一部分，`apply` / `bootstrap` 在能识别本地 Rspack/Webpack devServer 配置时，会先自动补受管 no-cache response headers，尽量减少 `remoteEntry.js` 与 chunk 命中不同缓存代的机会；`verify-remote-runtime-source.mjs` 继续只记录事实级 runtime 观察：`remote-entry-unreachable`、`remote-entry-reachable-but-expose-missing`、`remote-entry-reachable-and-expose-found`；“疑似旧 bundle”只允许在 Camora 闭环汇总层、并且仅当代码接线已被证明成立时给出。

### 11. 执行生成时自检

代码写完后，先由 AI 对照 brief 和写代码前的 `coverageDecision` 做兜底自检。自检项必须逐项回答“已满足 / 不适用 / 缺少证据”，不能用概括性描述替代。兜底自检不能替代生成前决策；如果写完后才发现 `uncoveredUi`、危险 props 或新增视觉 token，必须回到生成前决策重新判定，而不是继续在错误产物上打补丁。

生成器本身也必须执行生成产物合同检查。`generate-page-from-brief.mjs` 在 dry-run 和真实写入前都要检查转换后的 `index.tsx` 与样式文件；如果缺少页型必需 import、必需壳层、必需 provider、页型专属 slot、样式合同，或命中 forbidden token，必须直接失败，不允许先把问题页面写入业务目录再等人工发现。

必须自检：

- 页型是否正确
- 母版路径是否正确
- 必留壳层是否仍存在
- 必留 import 是否仍存在
- 生成器返回的 `generatedOutputSanity.ok` 是否为 `true`
- 业务槽位是否只做最小替换
- 母版样式文件是否已经同步到目标目录
- brief 的 `copyMode` 是否与实际生成结构一致
- `host-shell-fix-required` 是否只在“挂载区不可拉伸 / 受管 contract 无效”这类真正宿主阻断下出现，而不是因为共享页头空态证据不足就一刀切停止
- 禁止 token 是否未新增
- 路由入口是否按目标项目规则接入
- 若新增了首个正式业务导航壳：其导航样式与示例 `app-frame` 是否一致，且未把 preview route tree 直接转正
- 若向现有正式业务导航新增页面：菜单和路由是否都由同一份正式导航注册表派生，且该页面已经挂靠到预期导航分组
- 若当前项目属于旧项目且无法证明业务导航入口：是否已保持 blocked，而不是自动补导航
- 正式导航是否只包含真实业务页，且默认 landing 是否直接指向首个真实业务页而非合成占位页
- 入口接入 preflight 是否需要执行；若执行，是否为 `pass`；若为 `blocked`，是否已逐条处理 `requiredManualActions`
- 异常分支是否有明确处理

### 12. 执行轻量兜底检查

默认只运行轻量自检，以及目标项目能承受的最小构建、语法检查或类型检查命令。`npm run typical-page:doctor -- --json` 只在首次接入、运行时异常、宿主壳/依赖变更、正式发布验收或用户明确要求时运行。

但如果页面任务门禁文件缺失、仍是 `ensure-only`，或 freshness 校验已发现关键输入漂移，`typical-page:preflight` 就不再是“可选门禁”，而是重新开启页面任务的必需步骤。

需要一次性做正式验收时，优先组合运行 `node .local-context/hiui-design/scripts/typical-page-doctor.mjs --json`、目标项目本身的构建/语法/类型检查，以及按需 `integration-preflight.mjs` 或 `dependency-isolation-check.mjs --json`。这些检查仍不是普通页面生成的默认第一步。

浏览器打开、截图对比、DOM diff、全量 smoke gallery 不属于每次生成的默认必经流程，只在以下场景启用：

- 首次接入 HiUI 典型页
- 修改宿主壳或样式资源
- 升级受管本地运行时来源快照或其依赖合同
- 多个页型同时出现视觉失真
- 用户明确要求视觉验收

### 13. 输出交付报告

交付报告必须列出：页型、母版、目标文件、接入文件、已执行检查、未执行检查、剩余风险、回滚范围。

如果有无法确认的事实，必须写“无法确认”，不能用推测补齐。

## 代码修改规则

### A. 生成前规则

必须先判项目模式、页型、母版和 `coverageDecision`，再写代码。页型无法判定、母版缺失、宿主接入方式不明、典型页覆盖范围无法确认、未覆盖 UI 找不到 HiUI5 组件或 token 来源时，不得继续生成。

### B. 母版起点规则

列表页必须从列表页母版起步，抽屉页必须从抽屉母版起步，全页编辑必须从全页编辑母版起步，全页详情必须从全页详情母版起步。

如果页型 manifest 声明了 `baseStylePath`，生成器必须把该样式作为母版合同的一部分复制到目标页面目录。目标页面默认统一使用 `index.module.scss`，并同步改写页面内样式 import，禁止保留源模板样式文件名造成路径和命名分叉。

### C. 业务替换规则

标准典型页只替换业务槽位，不重画壳层，不把旧页面文案带进新页面，不把示例 mock 当成真实业务契约。独立能力页则只允许在受控重构面内整体改造，不得把其误降级成常规典型页的槽位替换任务。

### D. 结构稳定规则

页头、主白底区、筛选区、表格区、底栏、抽屉 body 必须保持当前页型节奏。禁止额外叠加普通 `Card` 去伪造典型页外观，禁止把固定页壳拆成普通文档流页面。

### E. 样式隔离规则

使用本地运行时时，必须保留 `src/components/hiui-design-runtime`、引入本地 `styles.css`，并只从受管运行时路径导入。禁止引用 `node_modules/.pnpm`、`dist/*` 或临时复制的私有适配路径。

### F. 页型专属规则

数据统计表检查 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`；数据可视化检查 `StatListPageFrame`、`statSection` 单工作区、真实 `@ant-design/charts` 图表实现、`chart-theme.ts` 主题来源，以及“若业务包含明细表时”它是否仍作为同一阅读流尾部；普通表格检查 `TablePageFrame`、`QueryFilter`、`Table`、分页；抽屉表单检查 `ProFormDrawer`、字段数边界、抽屉底栏；全页编辑检查 `ProEditPage`、单一 `PageHeader`、`formScrollBody`、`inlineEditFooter`。

全页详情额外检查 `PageHeader`、`ProDetailPage`、`ProDetailPageProvider`、`GroupMapProvider`、`SchemaGroup`、`SchemaDescriptionsBridge`、`whiteBody`、`detailBody`。若宿主存在共享 `header slot`，记录其空态行为；当页面已具备 `page-owned support file` 时，这条属于兼容事实与验收项，不再单独阻断生成。

### G. 禁止项规则

禁止手拼裸 `PageHeader + QueryFilter + Table`，禁止新增 `hi-v4-*`、`--hi-v4-*`、旧版 QueryFilter 适配层、旧版 Table 选择器，禁止用 `min-height: 100vh`、外层 `overflow-y: auto`、重复白卡、重复页头或重复 footer 掩盖壳层问题。

### H. 路由与入口规则

新增页面必须补齐目标项目需要的入口。微前端旧项目必须核对业务打开 path、项目配置 alias、构建 exposes 三者一致。

### I. 回滚规则

生成失败时只回滚本次业务产物：目标页面目录、mock 数据、路由配置、菜单入口、MF expose、入口按钮。不得回滚官方母版、manifest、公共规则文档和公共脚本，除非这些文件是本次变更直接改坏的。

如果失败发生在 `host-shell-fix-required` 阶段，优先回滚本次宿主治理改动和接入口 patch，不回滚 `.local-context/hiui-design/examples/host-integration/src/pages/*` 官方母版，不删除 `page-types.manifest.json` 中的页型合同。若生成器自身修改导致所有新页面失效，只回滚 `.local-context/hiui-design/scripts/generate-page-from-brief.mjs` 本次变更，再重新运行 dry-run 验证。

## 验收用例

### 用例 1：页型判定正确

核对生成记录brief，确认需求被映射到正确页型。数据统计表不能落成普通表格，`>16` 字段编辑不能落成抽屉表单，左树右表不能落成树形表格。

数据可视化不能落回“数据统计表 + 若干辅助图”的轻量列表结构；如果图表承担主信息载体，必须命中 `data-visualization`。

### 用例 2：母版来源正确

核对生成页面是否来源于对应官方母版。不能从空白文件、旧业务页或通用后台脚手架反推结构。

### 用例 3：壳层保留正确

核对固定页壳没有被拆掉。统计页必须仍有 `StatListPageFrame`，表格页必须仍有 `TablePageFrame`，抽屉页必须仍有 `ProFormDrawer` / `ProDetailDrawer`，全页编辑必须仍有 `ProEditPage`。

### 用例 4：业务槽位替换正确

核对标题、查询项、列定义、表单字段、详情字段、请求函数、按钮文案和 mock 数据是否已经替换为目标业务内容，同时确认壳层结构、单一 `PageHeader` / `whiteBody` owner 和滚动链没有被破坏。

### 用例 5：样式资源生效

确认应用入口存在本地运行时样式引入，例如 `import './components/hiui-design-runtime/styles.css'`，页面没有出现指标卡裸文本、筛选区灰底缺失、表格旧样式、白底主体不铺底等样式失效信号。

### 用例 6：旧版残留清零

搜索新增页面目录和相关样式文件，确认没有新增 `hi-v4-*`、`--hi-v4-*`、`hiui4`、旧版 QueryFilter 适配层、旧版 Table 选择器和历史 demo 文案。

### 用例 7：页型专属结构正确

按页型分别核对关键组件：统计页核对 `StatOverviewGrid`；列表页核对 `QueryFilter + Table + Pagination`；抽屉页核对抽屉底栏；全页编辑核对单一 `PageHeader + formScrollBody + inlineEditFooter`。

数据可视化页额外核对“指标卡 + 多图表 + 可选明细表”是否位于同一个 `StatListPageFrame` 白底工作区，图表是否仍使用真实 `@ant-design/charts`；若业务包含明细表，再核对它是否仍作为分析阅读流尾部。

### 用例 8：路由入口可达

点击菜单或业务按钮进入页面，确认路径、标题、微前端暴露和打开函数一致。

### 用例 9：轻量 doctor 通过

运行 `npm run typical-page:doctor -- --json`，预期 `status` 为 `pass`，且没有 `failed`、`hardFailures`。

### 用例 10：构建通过

运行当前项目最小可用构建命令，确认没有 TypeScript、Babel、Rspack、样式编译或依赖解析错误。

### 用例 11：页面基础交互可用

修改筛选项、点击查询、点击重置、点击主要按钮、打开抽屉或跳转详情，确认交互不报错，数据请求mock 响应正常，表格列和分页正常显示。

### 用例 12：宿主链未断裂

观察页面页头、主白底、滚动区、底栏和主体高度。预期没有重复页头、没有双滚动、没有分页下方露灰、没有底栏跟随内容漂移、没有整页变成“灰底上一张白卡”。

### 用例 13：异常分支可控

当页型无法判定、母版缺失、业务导航挂靠点不明确、样式入口缺失或 MF expose 不明确时，流程必须停止并输出明确待处理项；业务导航挂靠点未解析时不得只生成未接入口的业务页面文件。

### 用例 14：回滚边界清晰

模拟撤销本次页面生成，确认只需要删除目标页面目录、路由入口、菜单入口、MF expose、入口按钮和 mock 数据，就能恢复生成前状态。

## 失败信号

- 页头标题出现在内容区重复渲染
- 抽屉页 footer 样式回退成默认样式
- 查询区控件外观退回旧版样式
- 表格页分页下方露出宿主灰底
- 全页编辑底部操作区不吸底
- 主内容区和页面外层同时出现滚动条
- 指标卡退化成普通文本
- 为了修样式开始额外加 `Card`、`min-height: 100vh` 或外层 `overflow-y: auto`

## 异常与回滚

- 页型无法判定：停止生成，补页型判定证据
- 母版缺失：停止生成，修复 manifest 或示例资产
- 样式资源缺失：停止接入口，先补 `styles.css` 和依赖
- 业务导航挂靠点不明确：停止并输出接入说明，不写业务页面、不改正式路由
- 微前端暴露不明确：只生成页面和接入说明，不改 exposes
- 多个页型同时失真：停止业务生成，先修宿主和样式接入
- 回滚范围：仅回滚本次业务产物，不回滚官方母版、manifest、公共脚本和规则文档
