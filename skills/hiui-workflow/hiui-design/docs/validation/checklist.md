# 验收清单

## 默认轻量自检（普通业务页生成）

普通业务页生成默认先做本节自检，不默认启动 doctor、preflight、smoke gallery、浏览器截图或 DOM diff。

- 已声明命中页型，并能用业务结构解释判型依据
- 已声明官方母版路径，且来自 `page-types.manifest.json` 的 `generationContract.baseTemplatePath`
- 目标业务页路径位于本次任务解析出的 `defaultBusinessPageDir/**`，且不在 `src/typical-page-preview/**`；当缺少页级证据时该目录默认可能是 `src/pages/**`，但 `existing-system` 也可能被证明为 `src/views/**` 或 `implicitFeatureBaseDir/**`
- 已保留命中页型的 `requiredShell`、必需 import、样式结构、滚动链和固定壳层
- 若命中页型的 `generationContract.moduleExportContract.routeMountable = true`，页面主模块同时保留具名 `*Page` 导出与 `export default`，并与正式路由默认导入方式保持一致
- 标准典型页只替换 `businessSlots` 允许的标题、查询字段、表格列、表单/详情字段、请求、按钮、mock 数据和跳转目标；`data-visualization` 这类独立能力页则确认只在受控重构面内整体改造
- 未占用 `slotBoundaryContract.forbiddenSlots`、forbidden children 或危险 props
- 未重复创建 `regionOwnershipContract` 已声明由母版持有的 header、white body、main scroll、footer、drawer body、left pane 或 table container
- 已保留 root flex / min-height 高度链；不得用 `min-height: 100vh` 或额外 `overflow-y: auto` 粗暴修白底
- 未把接口未接入说明、mock 说明、生成说明、测试说明渲染成页面常驻 UI
- 正式业务页源码没有引用 `typical-page-preview`、`createTypicalPagePreviewRoutes`、`ExampleAppShell`、`examplePrompt`、`PromptCopyFloatingButton` 或 `__typical-preview`
- 没有从空白文件、旧业务页、普通 `PageTable` 或旧 HiUI 页面反推典型页结构
- 目标页面目录若由生成器写入，应包含 `hiui-pagegen.meta.json`，用于记录页型、母版、工作流类型和业务槽位或受控重构面来源；缺少这份元数据时，不应把页面认定为标准典型页受管闭环产物

## design-restore light guard

当输入来自 `design-restore` 时，默认验收仍保持轻量，不自动升级成多轮重修。固定只先查三类高影响问题：

- 结构关系：主阅读流、主区域归属、固定页壳 owner 是否仍与 `restoreDecisionPackage` 一致
- 视觉层级：页头、主体、辅助区、卡片层级是否仍保持同一套 HiUI5 / `hiui-design` 语法
- 关键素材：必须保留的图标、插图、状态图、关键文案或设计稿指定素材是否被误替换

补充约束：

- 若上述三类都通过，不要因为局部像素差异自动触发重型修复
- 只有明显越界时，才允许进入 `targeted repair`，并且修复范围必须限定在对应区域
- `targeted repair` 不得把单一区域问题升级成整页重写，不得借机改动已通过的壳层、主滚动链或 page-family/type 路线

## Heavy checks 使用边界

以下检查保留为首次接入、异常排查和正式验收工具，不作为普通业务页生成默认第一步：

- 首次接入 HiUI 典型页能力：运行 `typical-page-doctor` 或 setup 入口
- 依赖变更、典型页 shell 无法解析、运行时 peer 报错：尽早运行 `dependency-isolation-check.mjs`；普通项目不需要把它包装成 `ensure` / `preflight` 前的独立步骤，真实写页若仍命中依赖隔离风险，由受管生成器 fail closed 后再修
- 新增或修改路由、菜单、Module Federation `exposes`、Camora `window.addPage` / `openNewPage` 且接入方式不明确：运行 `integration-preflight.mjs`
- 宿主壳、样式资源、运行时版本变更，或多个页型同时视觉失真：运行 smoke / gallery / 浏览器核对
- 用户明确要求验收报告、发布前交付证明或 CI 门禁：运行 doctor、目标项目 build/lint/typecheck，并按需补 `integration-preflight.mjs` 或 `dependency-isolation-check.mjs`

## 非典型页面真实项目最小验收

本节只用于 `non-typical-page` 的发布收口，不是普通页面生成默认门禁。

- 已确认当前状态是“validated v1 scope 已对外开放”，且没有把它误读成“无限制全量开放”
- 已在真实 target project 中完成至少 1 次 family 级页面写入，而不只是 isolated target 回归
- 真实项目中的 `plan-page-task.mjs` / `load-generation-brief.mjs` / `generate-page-from-brief.mjs` 能形成一致的 `nonTypicalExecutionBrief`
- 若上层采用最小闭环入口，`execute-non-typical-page-task.mjs` 能在真实项目中稳定收口 `plan -> generate -> light sanity`
- 真实项目写出的页面仍保持唯一 `PageHeader`、唯一 `whiteBody` owner、唯一 `primaryRegion`
- 真实项目写出的页面没有引入第二套视觉系统、本地自造 token 或未批准图表主题
- runtime primitives、页面样式链、输出目录与目标宿主接线在真实项目里没有出现额外断点
- 真实项目页面能通过最小 build、lint、typecheck 或语法检查，不依赖重截图 diff / DOM diff 才能证明可用
- 正样本至少覆盖 `确认订单信息` 与 `机构售卖单管理`
- 边界样本 `方案一` 在真实链路中仍然先 stop-at-boundary，而不是误写成非典型页面
- 负样本 `业务规模` 在真实链路中仍然回退到已有 family，而不是误写成非典型页面
- 相关对外状态文件与文档表述一致：`page-family-workflows.manifest.json`、`non-typical-page-contract.json`、`PAGE_TYPE_CAPABILITY_REPORT.json`、`AI_GENERATION_READY_CONTEXT.json`
- 只有当上述真实项目验收完成并留痕后，才允许讨论是否翻转 `generatorReady`

## 生成链路前置

- 项目级 `integrationReadiness` 只看两件事：`.local-context/hiui-design/` 最小 marker 是否存在，以及 `.local-context/hiui-design/outputs/HIUI_DESIGN_APPLY_STATE.json` 是否记录了合法非 `auto` `appliedMode`；它只表示 hiui-design 物料是否已同步
- 页面任务是否允许开始，额外看 `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json`；只有 `pageTaskReadiness = ready-to-generate` 才允许开始模板选择、页面写入、旧页复用分析和正式导航挂接规划，对外也只有此时才应把项目视为“接入完成，可开始生成页面”
- 若 `generation-brief.mjs` 或 `plan-page-task.mjs` 返回 `integrationReadiness.ready = false`，后续动作必须是 `ensure-or-stop`：真实写入链路先运行 ensure，只读链路直接停止；不要直接跳过
- 若 `integrationReadiness.ready = true` 但 `pageTaskReadiness != ready-to-generate`、状态文件缺失，或 freshness 已失效，说明接入物料虽已同步，但页面生成前提仍未满足；后续动作必须是 `preflight-or-stop`：先执行 `typical-page:preflight`，不得直接写页面
- 若 `integrationReadiness.status = missing-context`，没有误用项目内 `node ".local-context/hiui-design/scripts/ensure-in-current-project.mjs"`；此时应使用 brief / planner 返回的外部 `command`，从 skill 根目录执行 `scripts/ensure-in-current-project.mjs --target <project-root>`
- `integrationReadiness.ready = false` 时，没有改走旧业务页、普通 `PageTable`、空白页手写、`window.addPage` / 路由 / Module Federation `exposes` 猜测接入
- `integrationReadiness.ready = false` 时，没有执行业务页定位、共享实现复用分析、按钮挂载点定位、正式导航挂靠推演或 host shell 接入规划
- `pageTaskReadiness != ready-to-generate` 时，同样没有执行业务页定位、共享实现复用分析、按钮挂载点定位、正式导航挂靠推演或 host shell 接入规划
- 先用 `../generation/page-type-map.md` 判页型
- 再从 `../generation/page-types.manifest.json` 读取命中页型的 `generationContract`
- 再按需读 `../generation/page-generation-workflow.md` 和对应专章
- 普通业务页生成不默认运行 `npm run typical-page:doctor`
- 普通业务页生成不默认跑页面级 smoke 或浏览器人工核对

## 宿主层

- 已先确认目标项目画像：新项目还是已有系统
- 已确认当前接入模式与目标项目画像一致：新项目可带壳，已有系统默认兼容接入
- 若项目属于旧宿主、依赖刚变更、运行时 peer 报错或工程验收要求较高，已运行 `.local-context/hiui-design/scripts/dependency-isolation-check.mjs --json`，确认 `docs/onboarding/managed-local-runtime-dependencies.json`（本地运行时依赖合同文件，当前规定目标项目必须声明哪些受管依赖）、可选嵌入来源快照、`package.json`、lockfile、已安装版本、peer 依赖和构建层 HiUI5 peer replacement bridge 一致；若普通项目走标准受管生成链路且未命中相关 blocked reason，不需要把这一步重复包装成项目级开门动作
- 标准典型页与 `non-typical-page` 仍保持页面内单一 `PageHeader`，没有把页头 ownership 交回宿主共享 `header slot`
- 若正式宿主存在共享 `header slot`，已证明其在标准典型页 / `non-typical-page` 未占用时会自动折叠；若宿主同时保留共享 `footer slot`，也没有把全页编辑底栏改挂过去
- 若宿主保留 shared-slot bridge，它只作为宿主兼容证据存在，不再被当成标准典型页页面合同
- 未依赖当前仓库私有 portal 路径
- 典型页相关代码没有从 `node_modules/.pnpm/...`、`../node_modules/...`、或 `docs/onboarding/managed-local-runtime-dependencies.json` 当前声明的来源包 `dist/*` 私有路径导入；若仍配置了来源追溯包，也只把它当“来源包私有构建路径”示例，不把包名本身当验收规则入口
- 宿主与页面没有混用壳包源码路径和包路径；若存在 shared-slot bridge，provider / consumer 指向同一份包实例
- 已确认典型页所在内容列 / 路由出口满足 `flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
- 已确认 `body`、`#root`、`#app`、`#__next`、首层公共 app shell 或微前端挂载容器没有 `display: flex; place-items: center`、`max-width`、固定 `width`、`margin: 0 auto`、`padding` 等 starter 盒化约束；普通生成先看 `AI_GENERATION_READY_CONTEXT.publicViewport`，若页面右侧整块空白，再看 doctor 的 `root-viewport-style-contract`
- 已确认全页编辑页的页面根 / Provider 外层 / 路由包裹层没有把高度链切回普通文档流；若有额外包层，仍继续传递 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`
- 已确认宿主框架层保留主内容区右侧 `16px` 留白；浮动子菜单收起时，左侧导航与主体区域之间保留 `16px` 间距；浮动子菜单展开时只去掉左侧留白
- 若目标项目自己实现了共享 `header slot` 组件（如 `page-header-portal.tsx`），已确认它没有为了兼容而改写 `PageHeader` 根布局，也没有把空态高度常驻保留下来
- 若使用最小宿主示例 `app-frame-core.tsx` 或其薄封装，已确认仍保留 `LayoutContentProvider`、`TypicalPageHostBridge`、`headerRef`、`footerRef`、`titleTextRef`、`ref={headerRef}`、`ref={footerRef}`
- 已确认受管本地运行时 `src/components/hiui-design-runtime/styles.css` 样式资源在目标项目中正常生效
- 若目标项目是已有系统，已确认模版页面没有被整包同步进目标项目 `src/`，而是只作为 `.local-context` 内参考规则存在

## 页面层

- 页面使用的是固定页壳，而不是手拼壳层
- 已先用 `docs/generation/page-type-map.md` 判页型，再用 `docs/generation/figma-page-rules.md` 命中默认规则
- 已先生成并读取单页 brief，确认 `pageGenerationDecision.copyMode`、`requiredLayout`、`requiredDataShape`、`requiredDomClassContract` 后再写页面
- 若使用 `generate-page-from-brief.mjs --dry-run`，当项目未 ready 时应直接阻断并提示先执行 ensure；dry-run 本身不得补接入
- 若使用真实写入链路且项目初始未 ready，允许生成器自动执行一次轻量 ensure；但 ensure 后若页面任务门禁仍未被 `typical-page:preflight` 放行为 `ready-to-generate`，生成链路必须继续停止
- 若项目在 preflight 通过后又改动了 `package.json`、锁文件、入口文件、构建配置或项目本地 `.context.jsonc`，freshness 校验应把页面任务门禁重新视为关闭，并要求重新执行 `typical-page:preflight`
- 生成器 dry-run 返回 `generatedOutputSanity.ok = true`，且 `generatedOutputSanity.violations` 为空
- 若本次页面会被正式业务路由直接消费，`generatedOutputSanity.violations` 不包含“缺少具名 `*Page` 导出”或“缺少 default export”这类导出契约错误
- 若页型 manifest 声明 `baseStylePath`，目标页面目录已生成对应 `index.module.scss`，页面 import 已指向 `./index.module.scss`
- 正式验收时，`typical-page-doctor.mjs --json` 与目标项目的 build/lint/typecheck 已完成且结果符合预期
- 若真实写入链路命中过依赖隔离 blocked reason，已按提示重跑 `node .local-context/hiui-design/scripts/dependency-isolation-check.mjs --target "$PWD"` 并确认 `status = pass`；尤其要确认 `@hi-ui/table`、`@hi-ui/input`、`@hi-ui/select`、`@hi-ui/date-picker` 没有解析到 HiUI4，不要用“页面能打开”替代依赖隔离事实
- 一旦页面使用 `local-managed-runtime`，`package.json` 中对应的 HiUI5 依赖合同已由 hiui-design 接入链路正式写入，而不是只在本地安装树里“碰巧可用”
- 菜单标题与 `PageHeader title` 一致
- 修改正式入口前已运行 `.local-context/hiui-design/scripts/integration-preflight.mjs`，并确认目标页面目录、MF expose、`window.addPage` / `openNewPage` 路径、业务入口文件均可静态证明
- 若挂接了 smoke/gallery 路由，一级菜单 `示例` 自身带 icon；不要给 `表格 / 表单 / 详情` 这类二级分组误补一级 icon
- 页面标题是否为 `600` 字重
- 页面分组标题 / 二级分组标题是否为 `600` 字重
- 查询区、白卡结构、表格主体与当前项目典型页一致
- 普通表格 / 树形表格的筛选 + 表格 + 分页主白底已铺到底部，没有在分页下方露出宿主灰底
- 表格页标题区若存在主操作按钮，主按钮位于右侧操作区最右端；同组多个按钮时，主按钮写在最后
- 行内筛选与 `全部筛选` 抽屉都沿用 HiUI5 `QueryFilter` 默认样式，没有出现“行内 / 抽屉表现分叉”
- 表格 DOM class、表格包解析与 `SchemaTable -> @hi-ui/table` 链路均指向 HiUI5，不允许只挂 `StatListPageFrame` / `TablePageFrame` 但底层表格仍解析到 `@hi-ui/table@4.x`
- 行内筛选没有额外外部字段标签；当前项目里控件内部已有的字段名/占位提示保持正常；字段名在 `全部筛选` 抽屉中以外部标签位出现，或在明确特例中显式开启 `showLabel`
- 没有在 schema 字段的 `fieldProps` 里硬编码 `QueryFilter` 专属 `appearance` / `label`
- 列表页标题区若存在操作按钮，已使用 `proTablePageStyles.headerExtra` `proStatPageStyles.headerExtra`
- 数据统计页已参考安装包内 `examples/host-integration/src/pages/table-stat.tsx` 起步，但真实页面落在目标项目既有目录结构中
- 数据统计页保留了 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`
- 数据统计页指标卡仍然是白卡描边，不是裸文本块
- 抽屉页和全页页型没有混用
- 数据统计表与左树右表没有混用筛选区 `padding`
- 抽屉表单 / 抽屉详情已按 `<= 16` 与 `> 16` 的边界切换到正确页型
- 全页编辑已参考安装包内 `examples/host-integration/src/pages/full-page-edit.tsx` 起步，但真实页面落在目标项目既有目录结构中
- 全页编辑保留了单一 `PageHeader`、`formScrollBody`、`inlineEditFooter`
- 全页详情保留了单一 `PageHeader`、`ProDetailPage`、`ProDetailPageProvider`、`GroupMapProvider`、`SchemaGroup`、`SchemaDescriptionsBridge`
- 全页详情描述列表 label 左对齐选择器同时覆盖当前运行时可能出现的 `hi-v4-descriptions` 和 `hi-v5-descriptions`
- 全页编辑 `inlineEditFooter` 仍是 `formScrollBody` 的同级兄弟，没有被塞进滚动区，也没有改挂到宿主 footer 槽
- 全页编辑 header 操作区仍然贴右，没有挤在标题后面
- 全页编辑 `formScrollBody` 根没有额外 `padding: 20px`
- 表单里的 `CheckSelect` 已选标签显示正常，不是只剩关闭图标或计数
- 如果页面直接使用 `SchemaForm`，且字段里含 `CheckSelect`，已包 `TypicalPageFieldMapProvider`
- 没有残留 `hi-v4-*` / `--hi-v4-*` 选择器、变量或旧版本导向的演示文案
- 全页编辑不是“宿主灰底 + 单张大白卡表单页”
- 全页编辑 / 全页详情若在页头区域露出白底，已先回查宿主共享 `header slot` 是否正确折叠，以及官方壳高度链是否连续，而不是去补 header 灰底
- 全页编辑底部操作区固定在页底，没有跟随内容滚动
- 全页编辑页面内没有额外祖先容器重新加 `overflow-y: auto`、`min-height: 100vh` 等会打断高度链的样式

## 复用边界

- 标准典型页只替换业务槽位；`data-visualization` 只固定页头与 `whiteBody`，由 `queryFields + searchPlaceholder` 承担 page-global control strip，并按规范生成内容区
- `data-visualization` 的 `summarySection` 可独立使用摘要 grid；正式 `chartSection` 从头到尾只保持一种基础 grid mode，主图通过同一 grid 中的 span 强调，指标卡迷你图可选
- 标准典型页复制官方母版时已同时复制 TSX、样式、数据形状、布局合同、DOM class 合同和宿主承载决策，没有只复制 TSX；`data-visualization` 则只锁定官方壳层、样式合同和参考模块，不复制整页业务内容
- `copyMode = direct-copy` 时，目标宿主能力已被证明；`copyMode = host-shell-fix-required` 时，生成流程已明确停止并回到宿主治理，不存在页面壳旁路
- 没有重新发明筛选/分页/白卡布局
- 默认从 `examples/host-integration/src/pages/` 中的对应页起步

## 输出质量

- 生成页面类型判断正确
- 引入路径来自项目内 `src/components/hiui-design-runtime` 或其受管相对路径
- 没有出现当前仓库 `src/components/pro-*` 私有路径依赖
- 如果多个页型同时存在大范围视觉差异，已先回到宿主与样式前置排查，而不是逐页补样式
