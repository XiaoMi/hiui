# 普通表格

## 默认稿

- 当前 `hiui-design` 不提供独立默认 `nodeId`
- 官方起点：`examples/host-integration/src/pages/basic-table.tsx`
- 运行时对照页：`examples/host-integration/src/pages/basic-table.tsx`
- 共享表格规则继续复用 [`table-shared.md`](table-shared.md)

## 适用

- 页面主体是“筛选 + 表格 + 分页”的常规列表
- 无指标卡、无左树分栏、无表内树展开
- 标题区可以有导出、新增、批量操作，但它们不改变列表主结构

如果页面已经是“指标卡 + 筛选 + 表格 + 分页”，优先使用 [`table-stat.md`](table-stat.md)；如果树结构在表格首列展开，优先使用 [`tree-table.md`](tree-table.md)；如果是左树 + 右表双区，优先使用 [`tree-split.md`](tree-split.md)。

## P0

- 必须从 `basic-table.tsx` 官方模板起步，不要从空白文件或手拼 `PageHeader + QueryFilter + Table` 起步
- 必须保留 `ProListPageProvider`、`TypicalPageFieldMapProvider`、`TablePageFrame`
- 页头、筛选、表格、分页必须继续留在同一个 `TablePageFrame` 白底主体里
- 标题右侧操作区必须走 `proTablePageStyles.headerExtra`
- 搜索框、`QueryFilter`、`Table`、分页继续沿用 [`table-shared.md`](table-shared.md) 的默认节奏；不要在业务页局部改出第二套列表语法
- 文本列默认单行、省略、Tooltip；操作列固定在右侧
- 宿主内容区必须给 `pro-table-page` 一条连续的 `flex + min-height: 0` 高度链，否则白底主体不会铺到底部

## 页面逐层拆解

### 1. 运行骨架

- 普通表格页不是“页面里直接放一张表”，而是 `ProListPageProvider -> TypicalPageFieldMapProvider -> TablePageFrame` 三层骨架。
- `ProListPageProvider` 负责列表请求、筛选参数、分页状态和刷新，不承载视觉。
- `TypicalPageFieldMapProvider` 负责 schema 字段到 HiUI5 视觉组件的桥接，不直接产生布局。
- `TablePageFrame` 才是页面视觉壳层 owner；标题、筛选区、表格区、分页区都应挂在它里面，而不是在外层平铺。

### 2. 页面主体白卡

- 普通表格页的主体不是多张卡片拼起来，而是一整块连续白底主体，内部再分成标题、筛选、表格、分页四段。
- 这块白底主体必须由 `TablePageFrame` 统一持有；不要在外面再套第二张 `Card` 去补白底、圆角或高度。
- 布局上它是单列垂直流，视觉顺序固定为“标题区 -> 筛选区 -> 表格区 -> 分页区”。
- 样式上它继承典型页的“灰底外槽 + 白底主体”关系；分页下方不应露出宿主灰底。

### 3. 标题区

- 标题区由 `TablePageFrame.title` 和 `extra` 组成，不额外创建第二个 `PageHeader`。
- 标题文字是页面识别锚点；命名上应使用“业务对象 / 业务场景 + 页型”的方式，例如 `基础表格`。
- 如果标题区有操作按钮，优先用 `extra={<Space className={proTablePageStyles.headerExtra}>...</Space>}` 收口，不自行发明另一套头部按钮容器。
- 右侧操作区必须通过 `proTablePageStyles.headerExtra` 收口；不要自己手写一排随意 `div` 或改成另一套按钮节奏。
- 组件模式是 `Space + Button`；标题区动作通常采用“导出 + 新增”这类组合，次操作用 outline，主操作用 primary，主按钮位于最右。

### 4. 筛选控制带

- 筛选控制带由 `queryFields + searchPlaceholder` 组成，仍属于 `TablePageFrame` 的固定结构，不是业务可自由重排的容器。
- 此页型的筛选器能力以当前项目接入的 HiUI5 `QueryFilter` / schema 支持能力为准；若干枚举筛选配合一个关键词搜索框只是常见组合，不是封闭列表。
- 布局上它位于标题区下方，与表格区同宽，默认 `padding: 20px 20px 16px`，筛选器之间 `gap: 8px`。
- 样式上它沿用 `QueryFilter` 的 contained/no-label 默认语法；不要自行加外部 label、filled 皮肤或第二行解释文字。
- 组件模式上，枚举筛选优先使用 `Select`，多关键词检索优先合并为一个 `SearchInput`；但具体可用控件仍以 `QueryFilter` 支持能力为准，不要把文档里的例子读成控件白名单。

### 5. 表格主体

- 表格主体由 `tableFields` 驱动，和分页同属列表主工作区；不要在表格上下插入新的公告、说明卡或业务提示条。
- 此页型的典型列结构是“主信息列 + 辅助文本列 + 操作列”，所有文本列默认走单行省略和 Tooltip。
- 文本列样式通过 `renderTableTextEllipsis` 收口；这不是单页装饰，而是列表页默认展示规则。
- 操作列固定在右侧，组件模式是 `Button appearance="link"` 的轻操作，不把表格操作写成大按钮堆叠。
- 表格视觉遵循共享规则：`size="md"`、表头浅灰底、无斑马纹、状态/分类列遵循统一 renderer，不单页发明新 cell 皮肤。

### 6. 分页收口

- 分页区不是附属小组件，而是白底主体的最后一段，必须和筛选区、表格区属于同一连续高度链。
- 分页应随列表状态自然更新，不要因为数据少就把整段分页逻辑删掉或让它漂在页面外层。
- 样式上分页与普通列表同壳统一，不单独改 footer 高度、阴影或定位方式。
- 生成或改页时，分页区的 owner 仍然是 `TablePageFrame`；业务只改数据请求和字段，不改分页容器结构。
- 如果分页下方露出宿主灰底，优先排查宿主高度链和样式资源，不要把它当成单页 spacing 问题去硬补。

## 关键组件与属性契约

### `ProListPageProvider`

- `request`：列表数据入口；负责接收筛选、搜索、分页参数并返回列表结果。
- 返回结构：至少应能稳定提供 `list`、`total`、`current`、`pageSize` 这类分页语义，不要把列表请求改成只回一段裸数组。
- 职责边界：它只管理列表状态和数据，不承载标题、白底主体或筛选布局。

### `TypicalPageFieldMapProvider`

- 作用：schema 字段到 HiUI5 视觉组件的桥接层。
- 职责边界：它不提供页面布局 props；主要职责是保证 `queryFields` / `tableFields` 的字段渲染落回正确组件体系。

### `TablePageFrame`

- `title`：页面标题入口；承载页名，不额外创建第二个 `PageHeader`。
- `queryFields`：筛选字段入口；只承接列表级筛选，不承接业务说明块或第二条工具带。
- `tableFields`：表格列入口；列结构、列宽、渲染都从这里进入。
- `searchPlaceholder`：合并搜索入口文案；用于单搜索框策略。
- `extra`：标题区右侧动作入口；应挂 `proTablePageStyles.headerExtra` 节奏。
- `tableProps`：表格行为补充入口；只改表格行为，不改白底主体、分页 owner 和整体壳层结构。
- `children`：普通表格页默认不开放业务 children；不要往里面塞说明条、公告块或第二张卡片。

## 禁止

- 不要把普通表格误判成数据统计表、树形表格或左树右表
- 不要绕开 `TablePageFrame` 再手拼页头、筛选区、表格区和分页
- 不要在页面根或白底主体外额外叠 `Card`、`min-height: 100vh` 或新的 `overflow-y: auto`
- 不要把 `QueryFilter` 的默认 `contained + no-label` 表现改回旧样式
- 不要把文本列默认省略策略、Tooltip、列宽和分页节奏改成单页私有实现

## 自检

- 是否从 `basic-table.tsx` 起步，而不是从空白文件起步
- 是否保留 `ProListPageProvider`、`TypicalPageFieldMapProvider`、`TablePageFrame`
- 标题区右侧操作是否仍走 `proTablePageStyles.headerExtra`
- 是否仍是“筛选 + 表格 + 分页”的单白卡主体，而不是多层容器拼装
- 文本列是否默认单行、省略、Tooltip
- 宿主高度链和 `src/components/hiui-design-runtime/styles.css` 是否已确认正常
