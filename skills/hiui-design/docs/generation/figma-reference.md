# Figma 参考速查

## 角色声明

本文件是**速查和排错入口**，不是规则正文的事实来源。

发生冲突时，优先级如下：

1. `figma-pages/*.md`
2. `figma-pages/forms-shared.md` / `figma-pages/table-shared.md`
3. `figma-page-rules.md`
4. 本文件

## 文档分工

- `SKILL.md`：入口、场景判断、优先级
- `../../rules/generation-rules.md`：AI 默认生成规则和 fallback 基线
- `page-type-map.md`：页型判定、页壳与示例起点
- `hiui5-visual-baseline.md`：HiUI 5 颜色、字阶、按钮、表格、表单默认视觉基线
- `figma-page-rules.md`：默认 `fileKey` / `nodeId` / 页壳 / 正文入口注册总表
- `../../rules/common.page-types.json`：页型机读事实来源，供脚本和 doctor 使用
- `figma-pages/*.md`：各页型正文，单一事实来源
- `figma-reference.md`：默认节点速查、通用陷阱、跨页自检
- `figma-page-rules-appendix.md`：少见边界与易混对照补充

## 默认节点速查

这张表是从 `figma-page-rules.md` 派生出来的速查，不要在这里只改一份。

| 页型 | `fileKey` | `nodeId` | 专章 |
|------|-----------|----------|------|
| 全页编辑 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/edit.md`](figma-pages/edit.md) |
| 抽屉表单 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/drawer-form.md`](figma-pages/drawer-form.md) |
| 抽屉详情 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/drawer-detail.md`](figma-pages/drawer-detail.md) |
| 全页分组详情 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/detail-group.md`](figma-pages/detail-group.md) |
| 数据统计表 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/table-stat.md`](figma-pages/table-stat.md) |
| 左树右表 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/tree-split.md`](figma-pages/tree-split.md) |
| 树形表格 | `jlYnxIW1FFGG8fK1sVcL5C` | `<figma-node-id>` | [`figma-pages/tree-table.md`](figma-pages/tree-table.md) |

## 通用陷阱

| 场景 | 必须注意 |
|------|----------|
| `PageHeaderPortal` 返回箭头 | 有 `onBack` 时不要被 `backIcon: false` 覆盖 |
| 抽屉底栏 | `Drawer` 根必须带 `className`，去掉 `__footer--divided` 顶线和阴影 |
| 抽屉表单 | `Grid.Row` 默认 `rowGap=16`，必须显式写 `rowGap={0}` |
| 抽屉详情 | `Descriptions` 保持 `vertical` 语义骨架，并显式写 `labelPlacement="left"`；不要再补 `th` / label CSS 修正，也不要写死 `labelWidth` |
| 全页编辑壳层 | 命中全页编辑时必须从 `full-page-edit.tsx` 起步，并保留宿主适配页头 portal、`formScrollBody`、`inlineEditFooter` |
| 全页编辑吸底底栏 | `inlineEditFooter` 必须是 `formScrollBody` 的同级兄弟；宿主内容列 -> 路由出口 -> 页面根 -> `ProEditPage` 必须保持连续 `flex + min-height: 0`，否则操作区会停在内容末尾而不是吸底 |
| 宿主页头宽度 | header 槽必须允许 `PageHeader` 根节点铺满 `100%` 宽度；否则 `extra` 操作区会挤在标题旁边而不是贴右。宿主 portal 只能保留 `width: 100%`、`minWidth: 0`，不要把 `PageHeader` 根节点改成 `display:flex` |
| 全页页头垂直节奏 | `60px` 节奏归宿主 header slot / shared header carrier 所有；不要把 `PageHeader` 根节点写成 `height/minHeight: 60 + alignItems:center`，否则内容容易贴到上沿 |
| 全页页头按钮尺寸 | `PageHeader extra` 里的按钮保持 HiUI 默认尺寸；不要把 header 的 60px 节奏再转嫁到按钮高度上 |
| 全页编辑外观 | 如果页面变成“灰底上的单张大白卡表单”，说明 AI 退回了通用后台脚手架，没有复用固定壳层 |
| 全页编辑根 padding | 不要在 `formScrollBody` 根上再包 `padding: 20px`；一级分组与字段区间距应由表单内部承担 |
| Schema Form 多选标签 | `CheckSelect` 在 Schema Form + Grid + flex 下容易量宽失真。用包内 `Form` 桥接时会自动修；若页面直接写 `SchemaForm`，必须包 `TypicalPageFieldMapProvider` |
| 数据统计页起点 | 命中数据统计表时必须从 `table-stat.tsx` 起步，并保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra` |
| 数据统计页样式 | 指标卡退化成纯文本、白底壳层消失，优先排查 `@hiui-design/typical-page-shells` 的样式资源是否在目标项目中生效 |
| 数据统计页宿主 | `pro-stat-page` 依赖宿主内容区的 `flex + min-height: 0 + overflow` 收口；没有这条高度链时，页头、白底和表格高度会一起漂移 |
| 普通表格页宿主 | `pro-table-page` 同样依赖宿主内容区的 `flex + min-height: 0 + overflow` 收口；没有这条高度链时，筛选 + 表格 + 分页所在白底不会铺到底部，分页下方会露出宿主灰底 |
| 跨页基线校验 | 外部项目必须先看已同步示例页；若示例页整体失真，不要继续生成业务典型页 |
| 样式资源失效 | 如果多个页型同时出现白卡、圆角、标题区、固定底栏、筛选区节奏一起失真，优先判断为包样式资源未生效，而不是逐页样式问题 |
| 宿主高度链失效 | 如果多个页型同时出现页头贴边、白底不铺满、双滚动、表格高度不收口，优先判断为宿主内容区高度链缺失 |
| 左树搜索 | `SearchInput` 内联默认宽度 `200`，只能用 `style` 覆盖 |
| 下拉筛选 | Picker 系默认 `matchWidth=true`，必须关掉，否则选项会换行 |
| 筛选组件 | 所有表格类页面必须使用真实 `QueryFilter` / `FilterDrawer`；不要回退到 schema 搜索壳或手写筛选栏，即使外部样式异常也先修接入 |
| 表格分页 | 不要只在统计页单独改 `.hi-v5-table-footer`，会与同壳列表失衡 |
| 表格列宽 | 默认开启 `resizable`；`virtual` 等冲突场景再明确关闭 |
| 表格字段管理 | 默认开启字段管理；优先复用 HiUI5 表格已有的字段管理 / 列展示管理能力 |
| 文本列 | 默认单行、省略、Tooltip，展示上限 `max-width: 360px` |
| 状态列 | 流程/状态/开关默认 `Tag`；分类列、类型列、是或否列默认文本 |

## 跨页自检

### 表单 / 编辑

- 是否正确区分全页编辑和抽屉表单
- 全页编辑是否从 `full-page-edit.tsx` 起步
- 是否写了 `Form` 根 + `labelPlacement: 'top'`
- 是否遵守 `>16` 不用抽屉
- 是否误把 `formNormal` 用在扁平表单
- 是否保留宿主适配页头 portal、`formScrollBody`、`inlineEditFooter`
- `inlineEditFooter` 是否仍是 `formScrollBody` 的同级兄弟，没有被包进滚动区或改走宿主 footer portal
- 是否破坏主区白底 + 表单滚动 + 固定底栏的高度链
- 是否误生成成“灰底 + 单白卡表单页”

### 抽屉

- `Drawer` 根是否有 `className`
- `footer` 顶线和阴影是否去掉
- 标题 / body padding 是否已与典型稿对齐
- 抽屉详情是否按字段数切 `360 / 600 / 全页`

### 详情

- 抽屉详情是否保留 `16px / 600` 标题而不是全页 `18px / 600`
- 分组详情是否无描边、无阴影、一级 body 左右 `20`
- 二级标题是否为 `3x14 + 9px + 48px`，且标题字重为 `600`
- 长文本项是否独占整行

### 表格类页面

- 数据统计页是否从 `table-stat.tsx` 起步
- 数据统计页指标卡是否仍为白卡描边，而不是裸文本
- 普通表格 / 树形表格的筛选 + 表格 + 分页白底是否铺到底部，而不是分页下方露宿主灰底
- `@hiui-design/typical-page-shells` 的样式资源是否已正常生效
- 宿主内容区是否给 `pro-stat-page` / `pro-table-page` 提供 `flex:1`、`min-height:0`、`overflow:hidden` 的高度链
- 行内筛选与全部筛选是否真实使用 `QueryFilter` / `FilterDrawer`，而不是 schema 搜索壳或手写筛选栏
- 多关键词检索是否合并为 1 个 `SearchInput`
- Picker 系是否显式关闭 `matchWidth`
- `Table` 是否 `size="md"`，无依据不要改成 `sm / lg`
- 表格是否默认同时开启 `resizable` 与字段管理；若关闭，是否有明确场景说明
- 默认文本列是否省略 + Tooltip
- 状态列是否 `Tag`，分类列是否仍为文本
- 是否错误叠加了 `padding-right`、`footer` 高度或外层 `overflow-y:auto`

### 跨页总检

- 外部项目是否保持 rules-only 引入，不把模版页面整包同步进 `src/`；首个真实业务页是否已通过宿主与样式基线校验
- 是否多个页型同时失真；若是，不要逐页 patch，先修接入前置
- 是否仍然遵守“先原则、后页型、再注册总表、再专章、再示例页起步”的步骤序

## node-id 形态转换

- Figma URL 查询参数是 `12-345`
- MCP 调用参数必须写成 `12:345`
