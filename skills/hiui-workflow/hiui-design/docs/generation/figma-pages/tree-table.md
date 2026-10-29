# 树形表格

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51257:107314`

## 适用

- 单张 `Table`
- 树层级在表内首列展开

共享表格规则见 [`table-shared.md`](table-shared.md)。

## 与左树右表区分

- 树形表格：树在表内首列
- 左树右表：`Tree` 和 `Table` 横向分栏

这两个页型不要混用。

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

- 当前项目存在共享实现时，优先复用 `src/components/pro-table-page/`
- 外槽与主区壳体风格沿用典型列表
- 筛选条 `padding: 20px 20px 16px`
- 表格区 `padding: 0 20px`
- `Table` 默认 `size="md"`、无斑马、可拖宽
- 树名称列不要只用裸 `.val`
- 树名称列需要：
  - 列上挂 `MWP({ className: styles.treeSwitcherCol })`
  - 仅在 `tbody td` 上做 `display:flex; align-items:center; min-width:0`
  - `renderCell` 从 `ctx.rawData[dataIndex]` 取值
  - 文本容器 `min-width:0; flex:1 1 0`
  - 单行省略 + Tooltip
- 状态列默认 `Tag`
- 业务分类列、是或否列默认文本
- 分页不要因为 `autoHide` 消失

## 页面逐层拆解

### 1. 运行骨架

- 树形表格的运行骨架和普通表格一致，仍然是 `ProListPageProvider -> TypicalPageFieldMapProvider -> TablePageFrame`。
- 区别不在壳层，而在“树结构放在哪里”：树必须收进表格首列，不额外创建左树区域。
- 这意味着筛选区、树表主体、分页区仍然是一张完整的列表页，而不是主从分栏页。

### 2. 标题区与筛选区

- 标题区仍由 `TablePageFrame` 统一持有；命名上通常使用对象名加页型，例如 `树形表格`。
- 右侧动作区沿用 `proTablePageStyles.headerExtra`，动作模式是“导出 + 新增部门”这种列表级操作，不和树节点操作混在一处。
- 筛选区位于标题区下方，默认 `padding: 20px 20px 16px`；“负责人 + 所属机构 + 关键词搜索”只是常见树节点筛选组合，具体筛选控件仍以当前项目接入的 HiUI5 `QueryFilter` / schema 支持能力为准。
- 搜索入口应覆盖树名称与树节点文本，不单独再造一个树搜索侧栏。

### 3. 树名称列

- 树名称列是本页型的核心，不是普通文本列；典型实现会把树名称字段作为首列并固定在左侧。
- 这一列必须挂 `proTablePageStyles.treeSwitcherCol`，让展开箭头、缩进、文本容器共用同一行内布局。
- `renderTreeTableTextEllipsis` 负责树名称的单行省略和 Tooltip，避免节点过长时把首列撑炸。
- 布局规则是：单元格本身 `display:flex; align-items:center; min-width:0`，文本容器 `flex:1 1 0; min-width:0`；不要只留图标和缩进，导致文字被压没。

### 4. 非树列与操作列

- 非树列仍然走普通表格列语法，职责是补充树节点的状态、职责、负责人、描述等信息。
- 状态列应保持统一 renderer；如果业务已有标准 `Tag`，应延续全局状态列模式，否则也要保持同一套状态映射语法。
- 操作列固定在右侧，组件模式是 link 按钮的轻操作组合，如“编辑 / 子部门”；不要把节点操作做成大按钮或展开更多卡片。

### 5. 表格主体与分页

- 树形表格的主体仍然是一整张 `Table`，不是 `Tree + Table` 的组合。
- 表格区水平 `padding: 0 20px`，分页与表格共用同一白底主体；树展开后也不能破坏分页链路。
- `defaultExpandedRowKeys` 这类树展开状态属于表格行为配置，不应演变成独立左栏状态管理。
- 如果需求变成“左侧树决定右侧表”，就不再是树形表格，而应回到 `tree-split`。

## 关键组件与属性契约

### `ProListPageProvider`

- `request`：树表数据入口；接收筛选和搜索参数，返回树状列表结果。
- 返回结构：树节点应通过 `children` 挂接，而不是返回平铺数组再在页面层二次拼树。

### `TablePageFrame`

- `title`：页型标题入口。
- `queryFields`：树表级筛选入口。
- `tableFields`：树表列入口；树列和普通列都从这里声明。
- `searchPlaceholder`：关键词搜索入口文案。
- `extra`：标题区动作入口。
- `tableProps`：树表行为配置入口；例如 `defaultExpandedRowKeys` 这类树展开行为应从这里进入。

### 树列配置

- `Control({ fixed: 'left' })`：树列通常固定在左侧，保证层级锚点稳定。
- `MWP({ className: proTablePageStyles.treeSwitcherCol })`：树展开列样式挂点；不要换成自定义 class 体系。
- `renderTreeTableTextEllipsis(...)`：树名称省略与 Tooltip 收口 helper。
- `W(...)`：树列宽度入口；树列宽必须同时为缩进、图标和文本省略留空间。

## 禁止

- 不要绕开 `TablePageFrame` 再重复手写页头、筛选区和表格高度链
- 不要把左树右表的分栏规则搬到这里
- 不要让树名称列只剩图标和缩进、文本丢失
- 不要传 `paginationProps={{ autoHide: true }}` 让分页整段隐藏

## 自检

- 是否为单表树而不是左右分栏
- 树名称列是否完成了 flex + ellipsis 处理
- 分页是否始终可见
