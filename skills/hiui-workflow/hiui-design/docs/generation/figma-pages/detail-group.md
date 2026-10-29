# 全页分组详情

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `52409:60782`

## 适用

- 全页只读详情
- 抽屉详情 `>16` 条后的落地页
- 多分组 `Descriptions` / `detail-group`
- 需要在主描述流中补充卡片摘要或只读支撑表格的详情页

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

- 当前项目存在共享实现时，优先复用 `src/components/pro-detail-page/`
- 页头 `onBack` 只用于从列表、业务按钮或旧入口二级进入的详情页；挂到正式导航时默认不带返回按钮
- 主标题 `18px / 600`
- 分组块之间竖向 `16px`
- 分组块白底、圆角 `12`、无描边、无阴影
- 一级分组 body 左右 `20`，不要写成 `24`
- 描述区行距 `16`、列距 `40`
- `labelWidth` 约 `114`
- 长文本项独占整行
- 主模型优先使用 `sections + request`
- `description-group` 仍是主阅读锚点；`summary-cards`、`data-table` 只作为 supporting sections 扩展
- supporting sections 继续留在 `SchemaGroup` 节奏内，不要脱离详情流重建第二套页面结构

## 二级分组

- 一级分组标题前不要加色块
- 一级分组标题默认字重 `600`
- 二级分组标题使用 `3x14` 色块 + `9px` 间距 + `48px` 高行，标题字重 `600`
- 二级标题下方不要再额外叠 `12px`
- 有二级分组时，子块内容不要再整体水平缩进

## 页面逐层拆解

### 1. 页面壳层

- 该页型页面最外层是 `PageHeader -> whiteBody -> ProDetailPage`。
- 页头在灰底宿主上，主详情流在白底主体里；这两层不能反过来，也不能并成一张普通白卡。
- `whiteBody` 是详情页唯一主体，承担滚动和主内容承载；不要再在里面额外造第二个主白底。

### 2. 页头层

- 页头由页面自身的 `PageHeader` 承载；标题通常是业务对象详情名，例如 `全页详情`。挂到正式导航时默认不带返回，只有二级进入页才带返回和轻操作。
- 页头职责是识别当前对象和承接页面级轻操作，不承载详情主体内容。
- 如果页头落回白底内部，说明页面壳层已经偏离全页详情语法。

### 3. 主详情流

- 主详情流由 `SchemaGroup` 驱动，顺序型堆叠多个受管 section，而不是手写一串 `Card`。
- 该页型的 section 通常按“主描述分组优先，摘要卡和支撑表格后置”的顺序组织，例如 `基础信息(description-group)` -> `三包信息(summary-cards)` -> `客户信息(description-group)` -> `服务信息(description-group)` -> `服务记录(data-table)`。
- 这里的主语义仍然是 `description-group`；其他两类 section 只作为 supporting sections 附着在同一详情流中。
- 布局上各组块之间 `gap: 16px`，不要用大段上下 margin 去拉开。

### 4. 描述分组

- `description-group` 是详情页的核心阅读单元，通常通过 `SchemaDescriptionsBridge` 映射到 `Descriptions`。
- 默认是三列布局，`labelWidth: 120`，长文本字段通过 `colSpan: 3` 独占整行。
- 样式上分组块本身无描边、无阴影，一级 body 左右 `20px`；不要把它重新改成 `Card + border + shadow` 的后台通用卡片。
- 组件模式上，描述分组只承接只读字段，不混入表单输入或按钮条。

### 5. 摘要卡 supporting section

- `summary-cards` 不是主 section 替代品，而是插在主详情流中的补充摘要层。
- 摘要卡类 supporting section 通常使用多列网格，每张卡内部结构是“类型 -> 主值 -> 元信息 -> 日期对”。
- 样式上单卡是白底、`1px` 描边、`8px` 圆角、`16px` 内边距；这是 supporting card 的局部样式，不应反推回整页分组样式。
- 组件模式上它用自定义 renderer，但仍然挂在 `SchemaGroup` 的 section 节奏里，不单独起第二套页面结构。

### 6. 支撑表格 supporting section

- `data-table` 用来承接服务记录、审计记录、履约记录这类只读列表，不取代主描述区。
- 支撑表格仍然放在同一详情流底部，作为阅读收口。
- 样式上表格背景保持透明，说明它嵌在分组卡节奏中；不要把它抬成第二主工作区或再包一张大白卡。

## 关键组件与属性契约

### `ProDetailPageProvider`

- `request`：详情数据入口；负责返回整页详情流所需结构化数据。

### `ProDetailPage`

- 作用：全页详情壳层。
- 职责边界：承接白底主体内的详情流，不重复创建页头或第二主滚动。

### `SchemaGroup`

- `groups`：详情 section 配置入口。
- `borderedGroups`：分组是否描边；全页详情通常关闭，避免退回通用卡片墙。

### `GroupMapProvider`

- `groups`：section type 到 renderer 的映射入口；例如 `descriptions`、`table` 等桥接类型。

### section config

- `description-group.fields`：主描述分组字段入口。
- `summary-cards.render`：摘要卡自定义渲染入口；仍需留在详情流内。
- `data-table.fields`：支撑表格列入口。
- `props`：各 section 对底层 `Descriptions` / `Table` 的受控 props 补充入口，不得借此重造第二套页面壳。

## 禁止

- 不要绕开 `ProDetailPage` 再重复手写详情白卡和滚动容器
- 不要把抽屉详情的 `360 / 600 / 2列16` 套到全页详情
- 不要给分组块加 `#EDEFF2` 边框或 `box-shadow`
- 不要让一级 body `24` 和二级 body padding 叠加出视觉缩进
- 不要把一级分组 body 的 `20px` 简化成整页内容根容器的 `padding: 20px`
- 不要让卡片摘要区替代主描述区
- 不要把支撑表格提成页面第二主工作区
- 不要继续把 `detailFields/groups/detailRequest` 当成新规则主语义

## 自检

- 是否是全页详情而非抽屉
- 是否无描边无阴影
- 一级 body 是否左右 `20`
- 根容器是否没有额外 `padding: 20px`
- 二级标题样式是否正确
- 是否仍保留 `description-group` 作为主 section
- supporting sections 是否仍留在同一 `SchemaGroup` 详情流中
