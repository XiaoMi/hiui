# 左树右表

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51257:107202`

## 适用

- 左侧 `Tree`
- 右侧 `QueryFilter + Table`
- 无指标卡

共享表格规则见 [`table-shared.md`](table-shared.md)。

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

- 当前项目存在共享实现时，优先复用 `src/components/pro-tree-split-page/`
- 外槽背景 `#F5F8FC`
- 主区白卡仅上圆角 `12`，白底铺到底部
- 左树列默认宽 `200px`
- 左树与右表之间支持拖拽调宽
- 树区右侧 `1px #EDEFF2`
- 树顶 `SearchInput` 必须用 `style` 覆盖内联 `width: 200`
- 左树搜索区 `padding: 20px 12px 12px`
- 左树滚动区只保留 `padding-bottom: 16px`，不要再加左右 `12px`
- 左树面板本身只保留 `border-radius: 8px` 与 `overflow: hidden`，不要额外加灰底、`padding: 12px` 或 `min-height: 100%`
- 右侧筛选 `padding: 20px 20px 16px 20px`，`gap: 8`
- `queryFields` 与同壳 `table-normal` 一致
- 当前项目已有离散标签、枚举态或串号管理列渲染时，优先从现有业务页裁剪对应 renderer，不要先简化成裸文本后再回推样式
- 双表场景的 `Table` 外不要再包 `overflow-y:auto`
- 树选中与右侧筛选、全部筛选默认不联动

## 与数据统计表的边界

- 这里没有指标卡
- 这里的筛选 padding 是 `20 / 20 / 16 / 20`
- 不要复用数据统计表的 `16 / 20`

## 页面逐层拆解

### 1. 运行骨架

- 左树右表的骨架是 `ProListPageProvider -> TypicalPageFieldMapProvider -> TreeSplitPageFrame`。
- `TreeSplitPageFrame` 是左右结构的唯一 owner；左树、分割条、右侧标题、筛选、表格、分页都必须由它统一承载。
- 不要把它理解成“左边一个组件，右边再塞一个完整列表页”；这是一个页型，不是两个页型并排。

### 2. 左侧树导航区

- 左侧区域由两段组成：顶部 `treeSearch` 搜索带，下面 `treeScroll -> treePanel -> Tree` 树体。
- 搜索带职责是过滤树节点，只影响左树显示，不直接承担右表通用筛选。
- 树体职责是树导航和上下文切换；树选中应驱动右侧列表刷新，但不应自动把值同步回右侧筛选器。
- 样式上，搜索区 `padding: 20px 12px 12px`，滚动区只保留 `padding-bottom: 16px`；树面板本身只保留 `8px` 圆角和 `overflow: hidden`。
- 组件模式上，左侧只能使用 `SearchInput + Tree` 这类轻导航组合；不要塞完整 `TablePageFrame`、`PageHeader` 或第二个业务页面。

### 3. 分栏与宽度控制

- 左树默认宽度是 `200px`，这不是视觉偶然值，而是该页型的标准起始宽度。
- 中间分割条应允许拖拽调宽，但拖拽只影响左右栏宽度分配，不改变两侧结构归属。
- 左树区和右侧白底区不能各自再套一层独立的大白卡；真正的页面主主体仍是一套左右分栏壳。

### 4. 右侧标题与筛选区

- 右侧顶部由标题区和筛选控制带组成，仍然属于 `TreeSplitPageFrame` 的右栏固定结构。
- 标题右侧动作区使用 `proTreeSplitPageStyles.headerExtra`；动作通常是“导入 / 新增物料”这类列表级操作。
- 筛选区只承接右表级别筛选；属性、状态、关键词等只是常见右侧列表筛选，具体控件和字段能力仍以当前项目接入的 HiUI5 `QueryFilter` / schema 支持能力为准。
- 布局规则是 `padding: 20px 20px 16px 20px`，筛选项 `gap: 8px`；不要把树搜索和右表筛选混成一条工具带。

### 5. 右侧表格主体

- 右侧表格仍然是普通列表页表格，不因为左边有树就变成树表。
- 右侧表格的典型列结构是“索引列 + 主信息列 + 属性列 + 数值列 + 轻操作列”，操作列固定右侧。
- 组件模式上，表格继续走统一 `Table` 语法；树选中只影响请求参数，不让表格自己再承担树展开语义。
- 样式上右侧主体保持完整白底和高度链，禁止在 `Table` 外面再包 `overflow-y:auto` 或额外白卡。

### 6. 分页收口

- 分页是右侧列表主体的最后一段，与标题区和筛选区同属右栏白底，不单独浮到页面外层。
- 左树滚动与右表分页是两套不同滚动职责：左侧滚的是树体，右侧滚的是右栏内容链；不要用一个全页滚动去兜底两边。

## 关键组件与属性契约

### `ProListPageProvider`

- `request`：右侧列表数据入口；左树选中、右侧筛选和分页都应最终收口到这里。

### `TreeSplitPageFrame`

- `title`：右栏标题入口。
- `leftPane`：左侧树导航区入口；只承接树搜索和树体，不承接第二个页面。
- `queryFields`：右栏筛选入口。
- `tableFields`：右栏列表列入口。
- `searchPlaceholder`：右栏关键词搜索文案。
- `extra`：右栏标题区动作入口。
- `tableProps`：右栏表格行为入口。
- `storageKey`：分栏宽度持久化 key；用于记住左右栏拖拽宽度，不承载业务语义。

### `SearchInput`

- `value`：左树搜索关键词。
- `onChange`：更新左树过滤词。
- `placeholder`：左树搜索提示文案。
- `style`：必须显式覆盖组件默认 `width: 200` 的内联宽度，让它服从左栏宽度。

### `Tree`

- `data`：树节点数据入口。
- `selectedId`：当前选中节点。
- `defaultExpandedIds`：默认展开节点集合。
- `onSelect`：节点选择事件；通常用于驱动右侧列表刷新，不应用来自动回写右侧筛选器。

## 禁止

- 不要绕开 `TreeSplitPageFrame` 再重复手写页头、主白卡、分栏、拖拽线和表体高度链
- 不要把左树默认宽误写成 `20px`
- 不要只用 CSS 把树搜索框设成 `100%`
- 不要因为树选中就自动回写列表筛选
- 不要在 `leftPane` 里再包一层带左右 `12px` 的滚动容器
- 不要给左树面板额外加 `#F5F7FA` 灰底或 `padding: 12px`

## 自检

- 是否真的是左树 + 右表，而不是表内树
- 左树宽度是否默认为 `200`
- 搜索框是否成功覆盖内联宽度
- 左树滚动区是否只有底部 `16px`，没有多余左右内边距
- 左树面板是否没有额外灰底和 `padding: 12px`
- 右表是否没有多包一层纵向滚动
