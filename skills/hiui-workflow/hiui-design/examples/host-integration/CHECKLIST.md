# Host Integration Checklist

## 安装

- 已物化 `src/components/hiui-design-runtime`
- 已安装本地运行时要求的 peer dependencies
- 已在应用入口引入本地运行时样式 `src/components/hiui-design-runtime/styles.css`
- 已确认项目构建工具可处理本地运行时目录中的 CSS 资源

## 宿主布局

- 标准典型页默认使用页面自带页头，不强制要求宿主提供共享页头挂载点
- 若宿主保留历史共享页头，已提供可自动折叠的页面头部挂载点
- 已提供页面底部挂载点
- 若启用了历史共享页头兼容桥，已实现路由标题到 `PageHeader` 标题的兜底逻辑
- 已用 `TypicalPageHostProvider` 包裹路由内容区
- 若必须兼容历史共享页头，已在目标项目本地显式实现兼容桥，而不是把共享页头重新当成示例默认合同
- 若使用 `src/app-frame-core.tsx` 或其薄封装，仍保留 `LayoutContentProvider`、`TypicalPageHostBridge`、`headerRef`、`footerRef`、`titleTextRef`、`ref={headerRef}`、`ref={footerRef}`
- 若使用增强版宿主壳，仍保留 `src/app-frame-core.tsx` 中搜索入口、一级菜单、二级浮层菜单和底部操作区这一整套左栏语法，不单独删改其中一段
- 若复用增强版宿主壳，已同步并适配 `src/host-shell-localization.ts`，确认语言切换、RTL 方向和菜单标题翻译逻辑仍可用
- 若项目明确启用了本地 locale bridge，已同步或复用 `src/translation/`，并确认对应 locale 文件与 `demo-overrides.ts` 只承载项目自己的业务词条兜底
- 若启用了 prompt copy 浮层，已确认它只来自 preview/gallery 路由，正式业务页和正式导航注册表没有保留 `examplePrompt` 或 `PromptCopyFloatingButton`
- 未依赖当前仓库的 `@/components/layout/portal`
- 内容区 / 路由出口已具备 `flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
- 根挂载点没有 starter 盒化样式：`body` 不居中布局，`#root` / `#app` / `#__next` 没有 `max-width`、`margin: 0 auto`、`padding`；若整页只占左侧、右侧整块空白，先修根样式而不是补页面局部 CSS
- 根挂载点与首层公共壳没有重写公共排版基线：不要在 `:root`、`html`、`body`、`#root`、`#app`、`#__next` 或首层 app shell 上设置全局 `font` / `font-size` / `line-height` / `letter-spacing` / `text-align: center`；若整页文字一起变大或变小，先修 host baseline，而不是逐页补字体 CSS

## 路由接线

- 已把 `src/routes/config.tsx` 仅作为 skill 内部 preview/runtime 参考，不把它直接挂进目标项目正式路由树
- 若目标项目里仍残留 `/__typical-preview`、`typicalPagePreviewRoutes` 或 `src/typical-page-preview/**`，已删除这些旧流程接线
- 菜单标题与页面 `PageHeader title` 一致
- 抽屉页 / 详情页如需嵌套路由，已明确是否 `showInMenu: false`

## 页面实现

- 页面统一使用本地运行时导入，而不是直接引用旧壳包或复制当前仓库 `src/components/pro-*`
- 新页面已先按 `.local-context/hiui-design/docs/generation/figma-page-rules.md` 命中默认页型规则
- 数据统计页使用 `StatListPageFrame`
- 数据可视化页使用 `src/pages/data-visualization/index.tsx` 作为起点
- 普通表格 / 树形表格使用 `TablePageFrame`
- 左树右表使用 `TreeSplitPageFrame`
- 抽屉表单使用 `ProFormDrawer`
- 抽屉详情使用 `ProDetailDrawer`
- 全页编辑使用 `ProEditPage`
- 全页详情使用 `ProDetailPage`
- 异常反馈页使用 `src/pages/feedback-status/index.tsx` 和共享变体注册表
- 已至少接通一个“表格 / 图表 / 表单 / 详情 / 异常”页示例，推荐直接复用本目录现成页型示例
- 数据统计页从 `src/pages/table-stat.tsx` 起步，而不是从基础表格页或空白文件起步
- 数据统计页保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`
- 全页编辑从 `src/pages/full-page-edit.tsx` 起步，而不是从空白文件或普通表单页起步
- 全页编辑保留单一 `PageHeader`、`proEditPageShellStyles.formScrollBody`、`proEditPageShellStyles.inlineEditFooter`

## 验收

- 已运行 `pnpm typical-page:preflight` 或 `npm run typical-page:preflight`
- 若当前是在做首次接入验收、运行时排障或正式交付：已运行 `pnpm typical-page:doctor` 或 `npm run typical-page:doctor`
- 已查看 `.local-context/hiui-design/outputs/host-integration-guidance/SMOKE_REPORT.md`
- 标准典型页与 `non-typical-page` 保持页面内单一 `PageHeader`，不要求把页头转交给宿主 shared header slot
- 若宿主保留 shared header slot，该区域在页面未占用时会自动折叠，不保留额外空白高度
- 页面内不存在重复 `PageHeader`，也不存在 shared header slot 与页面内容区双渲染
- 目标项目里没有残留 preview 入口；若出现“业务页里再套一层典型页导航”，已先排查是否还留着旧的 preview route / preview host 接线
- 若全页编辑 / 全页详情页头区域露出白底，已先排查 shared header slot 是否正确折叠，以及官方壳高度链是否连续，而不是给 header 补灰底
- 查询区、表格、分页样式与当前项目壳层一致
- 数据统计页指标卡仍然是白卡描边，不是裸文本
- 典型页样式资源在目标项目中已生效
- 表单里的 `CheckSelect` 已选标签显示正常，不是只剩关闭图标或计数
- 直接写 `SchemaForm` 且字段里含 `CheckSelect` 时，已包 `TypicalPageFieldMapProvider`
- 宿主内容区高度链能承接统计页 / 表格页，不是普通文档流页面
- 已先核对多组已同步示例页；若多个页型同时失真，已先修接入而不是继续生成业务页
- 若基础表格 / 数据统计表同时出现“页头上方空白”或 `whiteBody` 不铺底，已先排查宿主高度链和旧 preview 接线残留，而不是直接给页面补局部 CSS
- 若基础表格 / 数据统计表同时出现“页面整体未铺满屏幕宽度”，已先排查 `root-viewport-style-contract` 与目标项目根挂载点宽度链
- 数据统计表与左树右表没有混用筛选区 `padding`
- 抽屉页和全页页型没有跨越 `16` 项边界误用
- picker 类筛选浮层宽度和层级正常
- 业务页面未直接耦合当前仓库私有路径
- 全页编辑不是“宿主灰底 + 单张大白卡表单页”
- 全页编辑 `formScrollBody` 根没有再包一层 `padding: 20px`
- 全页编辑底部操作区固定在页底，页面内没有双滚动条
