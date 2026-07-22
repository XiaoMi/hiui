# Host Integration Checklist

## 安装

- 已安装 `@hiui-design/typical-page-shells`
- 已安装包要求的 peer dependencies
- 已在应用入口引入 `@hiui-design/typical-page-shells/styles.css`
- 已确认项目构建工具可处理 package 输出的 CSS 资源

## 宿主布局

- 已提供页面头部挂载点
- 已提供页面底部挂载点
- 已实现路由标题到 `PageHeader` 标题的兜底逻辑
- 已用 `TypicalPageHostProvider` 包裹路由内容区
- 若使用 `src/app-frame.tsx`，仍保留 `LayoutContentProvider`、`TypicalPageHostBridge`、`headerRef`、`footerRef`、`titleTextRef`、`ref={headerRef}`、`ref={footerRef}`
- 未依赖当前仓库的 `@/components/layout/portal`
- 内容区 / 路由出口已具备 `flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`

## 路由接线

- 已参考 `src/routes/config.tsx` 挂接页面
- 菜单标题与页面 `PageHeader title` 一致
- 若挂接 smoke/gallery 路由，顶级 `示例` 菜单带 icon；`表格 / 图表 / 表单 / 详情 / 异常` 仍是二级分组
- 若新增 `业务` / `项目` / `订单` / `工单` 等真实一级菜单，已使用匹配菜单语义的 `@hi-ui/icons` 面型 icon，且没有复用 `示例` 的 `AppStoreFilled`
- 多个可见一级菜单没有复用同一个占位 icon；如确实同域复用，已由 route owner 明确记录原因
- 抽屉页 / 详情页如需嵌套路由，已明确是否 `showInMenu: false`

## 页面实现

- 页面统一使用包导入，而不是复制当前仓库 `src/components/pro-*`
- 新页面已先按 `.local-context/hiui-design/rules/page-type-map.md` 判页型，再按 `.local-context/hiui-design/docs/generation/figma-page-rules.md` 命中默认页型规则
- 数据统计页使用 `StatListPageFrame`
- 普通表格 / 树形表格使用 `TablePageFrame`
- 左树右表使用 `TreeSplitPageFrame`
- 抽屉表单使用 `ProFormDrawer`
- 抽屉详情使用 `ProDetailDrawer`
- 全页编辑使用 `ProEditPage`
- 全页详情使用 `ProDetailPage`
- 已至少接通一个“表格 / 图表 / 表单 / 详情 / 异常”中的对应页示例，推荐直接复用本目录现成 10 个正式页型示例
- 若项目需要统计大屏或运营看板，已先核对 `src/pages/data-visualization.tsx` 的样式与图表资源链路
- 若项目需要反馈/异常页，已先核对 `src/pages/empty-state.tsx` 与其余 `feedback` 子页的图标资源是否正常
- 数据统计页从 `src/pages/table-stat.tsx` 起步，而不是从基础表格页或空白文件起步
- 数据统计页保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`
- 全页编辑从 `src/pages/full-page-edit.tsx` 起步，而不是从空白文件或普通表单页起步
- 全页编辑保留 `TypicalPageHeaderPortal`、`proEditPageShellStyles.formScrollBody`、`proEditPageShellStyles.inlineEditFooter`

## 验收

- 已运行 `pnpm typical-page:doctor` 或 `npm run typical-page:doctor`
- 已查看 `src/typical-page-reuse/SMOKE_REPORT.md`
- 页头标题正确挂载到宿主 header 区
- 宿主 header 槽允许 `PageHeader` 铺满整行宽度，操作区仍然贴右
- 无 `PageHeader` 重复渲染在内容区
- 若全页编辑 / 全页详情页头区域露出白底，已先排查 portal 是否回退到页面内容区，而不是给 header 补灰底
- 查询区、表格、分页样式与当前项目壳层一致
- 数据统计页指标卡仍然是白卡描边，不是裸文本
- 典型页样式资源在目标项目中已生效
- 表单里的 `CheckSelect` 已选标签显示正常，不是只剩关闭图标或计数
- 直接写 `SchemaForm` 且字段里含 `CheckSelect` 时，已包 `TypicalPageFieldMapProvider`
- 宿主内容区高度链能承接统计页 / 表格页，不是普通文档流页面
- 已先核对多组已同步示例页；若多个页型同时失真，已先修接入而不是继续生成业务页
- 侧边栏底部头像入口可打开用户卡片与语言子菜单，切换语言后页面示例会立即刷新
- 数据统计表与左树右表没有混用筛选区 `padding`
- 抽屉页和全页页型没有跨越 `16` 项边界误用
- picker 类筛选浮层宽度和层级正常
- 业务页面未直接耦合当前仓库私有路径
- 全页编辑不是“宿主灰底 + 单张大白卡表单页”
- 全页编辑 `formScrollBody` 根没有再包一层 `padding: 20px`
- 全页编辑底部操作区固定在页底，页面内没有双滚动条
