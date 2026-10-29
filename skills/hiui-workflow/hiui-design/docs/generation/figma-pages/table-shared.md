# 表格与筛选共享规则

适用于：

- 数据统计表
- 左树右表右侧表
- 树形表格
- 普通 `ProListPage + Table` 列表

## QueryFilter

- 多个可搜字段默认合并为 1 个 `SearchInput`
- 列表筛选字段能力以当前项目接入的 HiUI5 `QueryFilter` / schema 适配层支持能力为准；文档中提到的 `SearchInput`、`Select`、`DatePicker`、`CheckSelect` 等只是常见筛选控件，不构成封闭列表
- `SearchInput` 维持 HiUI5 默认灰底；`Select` / `DatePicker` / `CheckSelect` 等筛选控件沿用 HiUI5 `QueryFilter` 默认外观，不要手动把它们统一改成 `filled`
- 行内 `QueryFilter` 与右侧 `FilterDrawer` 必须复用 HiUI5 默认表现：
  行内筛选由 `QueryFilter` 负责，默认 `showLabel={false}` + `appearance="contained"`，隐藏的是控件外部额外 label；控件内部已有的字段名/占位提示按当前项目正确样式保留；
  `全部筛选` 抽屉由 `FilterDrawer` 负责 `vertical + line`，字段名显示在控件外部标签位
- `filterFields.label` 是给 `FilterDrawer` 和显式开启的特殊场景复用的，不代表典型列表页行内筛选要展示额外字段 label
- 不要把 `QueryFilter` / `FilterDrawer` 的展示层默认值写进 schema 字段自身的 `fieldProps`，否则会覆盖 HiUI5 默认样式，导致行内筛选与抽屉筛选表现分叉
- 不要在适配层把行内 `QueryFilter` 的 `appearance` 默认值改回 `line`；若无明确设计特例，保持 HiUI5 官方默认 `contained`
- 不要在典型列表页额外传 `showLabel={true}` 或通过别的适配层把 schema `title` 强行渲染成行内标签，否则会回到“筛选区多出一排字段名”的旧问题
- `QueryFilter` 内部筛选器之间的横向与换行间距统一为 `8px`；这是 `QueryFilter` 自身的筛选布局节奏，不得借用 `Form` 的 `20px` 默认横向间距，也不得在单页 CSS 里覆盖 `.hi-v5-form`
- Picker 系控件默认关闭 `matchWidth`
- `FilterDrawer` 与行内筛选共用同一套 `queryFields`，不要只给某一页型加特殊 `appearance` / `size`
- 若需要补控件层视觉默认值，回看 `../hiui5-visual-baseline.md`；共享规则里只维护会影响页型一致性的关键约束

## Table

- 默认 `size="md"`
- 默认开启 `resizable`
- 表头默认 `#F2F3F5` 底、`14 / 600 / #1A1D26`
- 单元格默认 `14 / 400 / #1A1D26`
- hover 行默认 `#F2F3F5`，selected 行默认 `#EDF2FF`
- 默认文本列：单行、省略、Tooltip、`max-width: 360px`
- 状态 / 流程列默认 `Tag`
- 开关 / 是否 / 启停类列默认文本；若当前项目已有明确开关控件契约，则按受管控件契约落地
- 类型 / 分类 / 渠道 / 入口 / 是或否列默认文本
- 典型页表格页若在页头标题区放主操作按钮，主按钮应位于右侧操作区的最右端；若同组有多个按钮，主按钮写在最后
- 同一操作区默认最多 1 个主按钮；次级动作优先 outline，弱动作优先 text / link
- 当前项目若已有统一壳组件，优先复用壳组件而不是手拼页头、筛选、表格和分页结构

## 宿主与样式前置

- `pro-table-page` 与 `pro-stat-page` 一样依赖宿主内容区的高度链收口：内容列 / 路由出口至少满足 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
- 表格类典型页所在宿主内容区必须允许 `flex: 1 1 0%` + `min-height: 0`，不要让列表页处在普通文档流中自然撑高
- 目标项目必须确认 `src/components/hiui-design-runtime/styles.css` 已正常生效；不要只看到页面能渲染就继续往下改业务
- 一旦页面开始使用 `TablePageFrame` / `ProListPageProvider` 等壳组件，必须同时满足：
  - `package.json` 已由 hiui-design 接入链路写入所需 HiUI5 依赖合同
  - 应用入口或受管宿主入口已引入 `src/components/hiui-design-runtime/styles.css`
  - 代码只从 `local-managed-runtime` 逻辑源生成，并在落盘时改写到 `src/components/hiui-design-runtime` 的受管相对路径，不要走 `node_modules/.pnpm/.../dist/*`

## 常见误用

- 不要看到分页下方露灰就直接在页面根或白卡上补 `min-height: 100vh`、额外 `Card`、额外 `padding-right`
- 不要在双表场景的 `Table` 外再包 `overflow-y:auto`
- 不要在根容器额外叠 `padding-right`
- 不要遗漏头体列宽同源、滚动槽稳定和省略策略

## 关键组件与属性契约

这里只写页面规范会约束到的关键 props，不重复组件库完整 API 文档。

### `QueryFilter`

- `queryFields` / `fields`：筛选字段入口；字段能力以当前项目接入的 HiUI5 `QueryFilter` / schema 适配层支持能力为准。
- `showLabel`：典型列表页默认 `false`；不要打开后把页面变回“外部一排字段名”旧语法。
- `appearance`：典型列表页默认 `contained`；不要随意改成 `line` 或自定义 filled 语法。
- `searchPlaceholder`：关键词搜索入口文案；应服务合并搜索，不为每个字段各写一个搜索框。
- `fieldProps`：仅承载字段自身交互，不要把展示层默认值反写到字段级，避免行内筛选和抽屉筛选分叉。

### `FilterDrawer`

- `queryFields`：与行内筛选共用同一套字段定义，不单独维护第二套筛选字段。
- 展示语法：默认 `vertical + line`；字段名显示在外部标签位，不与行内筛选混为一谈。
- 适用场景：承接“全部筛选”或窄空间扩展筛选，不替代页面主筛选带。

### `Table`

- `tableFields` / `fields`：列表列入口；列能力以当前项目接入的表格运行时与 schema 支持能力为准。
- `size`：默认 `md`；无页型依据不要改成 `sm` / `lg`。
- `resizable`：默认开启；关闭时必须有明确原因。
- `paginationProps`：控制分页行为；不要通过 `autoHide` 等设置让分页整段消失。
- `scroll` / `maxHeight`：决定滚动行为；是否允许表体内部滚动由页型专章控制，不在 shared 层鼓励自由改。
- `renderCell`：列渲染入口；文本列、省略、Tooltip、状态列映射、操作列按钮都应从这里受控收口。
- `fixed`：通常用于树列、主锚点列或操作列；固定列应服务阅读流，不为视觉装饰滥用。

### 文本列

- `W(...)`：列宽主入口；文本列应先给稳定宽度，再做省略与 Tooltip。
- 文本省略策略：默认单行、省略、Tooltip，避免宽文本撑坏头体对齐。
- `renderTableTextEllipsis` / 同类 helper：优先使用受管 helper，而不是每列手写一份省略 DOM。

### 状态列与操作列

- 状态列：优先通过统一 `renderCell` / 统一 renderer 输出 `Tag` 或规范文本，不在单页里发明新的状态皮肤。
- 操作列：通常 `fixed: 'right'`，动作使用 link / text 语法；主按钮不应出现在表格行内。
