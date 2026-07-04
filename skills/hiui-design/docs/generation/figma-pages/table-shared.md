# 表格与筛选共享规则

## 速览

- 何时读：已命中任一列表类页型，需要统一 `QueryFilter` / `Table` 行为时
- 核心规则：复用 HiUI5 默认筛选与表格语义，不要在页型里各自改默认值
- 常见坑：把行内 `QueryFilter` 改回 `line` 或强行开启 `showLabel`

适用于：

- 数据统计表
- 左树右表右侧表
- 树形表格
- 普通 `ProListPage + Table` 列表

## 硬门槛

以下条目是表格类页面的默认硬门槛。命中任一表格页型时，只要缺任一项，就视为未通过，不能继续把页面判定为完成：

- 本文件中涉及表格页生成的视觉、框架、交互约束全部按硬门槛执行；`QueryFilter`、`FilterDrawer`、`SearchInput`、`FilterButton`、`Table` 行为、行操作语义、白底主体、样式资源生效都不得再视作“默认值”或“体验建议”
- 筛选必须使用真实 `QueryFilter`，全部筛选必须使用真实 `FilterDrawer`
- 不允许回退到宿主 schema 搜索壳、`searchConfig.fields`、`SearchForm`、`getSearchFields` 或任何手写筛选栏
- `Table` 默认开启 `resizable`；只有 `virtual` 等明确冲突场景才允许关闭，并且需要在结果里写明原因
- `Table` 默认开启字段管理；只有明确产品限制、设计限制或组件冲突时才允许关闭，并且需要在结果里写明原因
- 直接使用 `Table` 时，默认显式写出 `bordered={false}`；不要把“无纵向分割线 / 不额外描边”继续留给宿主默认值猜
- 直接使用 `Table` 时，默认显式写出 `striped={false}`；无斑马不是建议项，而是表格类页面默认基线
- `bordered={false}` 与 `striped={false}` 不只是推荐默认值，而是表格类页面的显式基线；直接写 `<Table bordered />`、`<Table striped />`、或通过宿主封装把它们重新打开，都按违规处理
- 若页面右侧存在操作列且该列应冻结在右侧，必须同时补齐列定义和宿主 wrapper 侧的固定列声明；兼容宿主常见口径为 `fixedToColumn`
- 单元格默认只承载一个主语义字段；不要把机构名、编码、地址、状态摘要等多个并列字段塞进同一个 cell 再靠换行堆叠
- 不要以“外部样式影响筛选表现”或“宿主封装不方便”作为豁免理由；应先修 `QueryFilter` 的接入、样式来源和桥接默认值

## QueryFilter

- 本节中的搜索框表现、字段顺序、按钮节奏、标签展示与桥接默认值都属于硬门槛；除本文件明确允许的豁免口外，不允许按项目习惯自行改写
- 多个可搜字段默认合并为 1 个 `SearchInput`
- 所有表格类页面的筛选必须使用真实 `hiui5` / `@hi-ui/query-filter` `QueryFilter`；不允许回退到宿主 schema 搜索壳、`searchConfig.fields` 兼容壳或任何手写筛选栏
- `SearchInput` 维持 HiUI5 默认灰底；`Select` / `DatePicker` / `CheckSelect` 等筛选控件沿用 HiUI5 `QueryFilter` 默认外观，不要手动把它们统一改成 `filled`
- 在 split 左栏、树面板或其它受限 pane 中直接使用 `SearchInput` 时，必须显式覆盖其默认固定宽度并回接 pane contract；至少回答“由谁承接 `width: 100% + min-width: 0`”。不要把组件默认宽度泄漏到 pane 里，导致搜索框无法贴合左栏
- 若 `QueryFilter` 字段来自 schema / field config，页面必须接入 `FieldMapProvider` 或 `TypicalPageFieldMapProvider`；若 provider 明确位于更上游宿主，结果中需要写清承载位置，并在源码附近显式加注释 `hiui-design allow-queryfilter-with-upstream-fieldmap`，不要放任字段渲染退化成默认文本控件
- 若项目直接手写 `QueryFilter.filterFields`，关键词类字段不要退化成裸 `Input`；必须使用 `SearchInput` / `Search`，或至少保持 `Input` 的 `appearance="filled"` + 搜索前缀语义，否则会丢掉典型页基线里的灰底搜索框表现
- 行内 `QueryFilter` 默认不手工追加“查询”主按钮；若业务需要额外触发动作，必须有书面设计依据，且不能破坏 `QueryFilter` 的默认字段顺序与按钮节奏
- 行内 `QueryFilter` 与右侧 `FilterDrawer` 必须复用 HiUI5 默认表现：
  行内筛选由 `QueryFilter` 负责，默认 `showLabel={false}` + `appearance="contained"`，隐藏的是控件外部额外 label；控件内部已有的字段名/占位提示按当前项目正确样式保留；
  `全部筛选` 抽屉由 `FilterDrawer` 负责 `vertical + line`，字段名显示在控件外部标签位
- 行内“全部筛选”默认使用 `FilterButton` 语义，并位于筛选尾部；不要用普通 `Button` 打断搜索、筛选字段、重置之间的默认节奏
- 行内筛选默认没有选中值时不展示清空/重置按钮；当关键词、行内筛选或全部筛选中存在任意已选值时，才在 `全部筛选` 后展示带 `ClearOutlined` 图标的 `清空` 按钮。不要为了占位常驻“重置”按钮。
- `filterFields.label` 是给 `FilterDrawer` 和显式开启的特殊场景复用的，不代表典型列表页行内筛选要展示额外字段 label
- 不要把 `QueryFilter` / `FilterDrawer` 的展示层默认值写进 schema 字段自身的 `fieldProps`，否则会覆盖 HiUI5 默认样式，导致行内筛选与抽屉筛选表现分叉
- 不要在桥接层把行内 `QueryFilter` 的 `appearance` 默认值改回 `line`；若无明确设计特例，保持 HiUI5 官方默认 `contained`
- 不要在典型列表页额外传 `showLabel={true}` 或通过别的桥接把 schema `title` 强行渲染成行内标签，否则会回到“筛选区多出一排字段名”的旧问题
- 不要在可以直接用 `QueryFilter` 的项目里回退到自由排布的 `Input + Select + DatePicker + Button` 筛选栏
- Picker 系控件默认关闭 `matchWidth`
- `FilterDrawer` 与行内筛选共用同一套 `queryFields`，不要只给某一页型加特殊 `appearance` / `size`
- 若需要补控件层视觉默认值，回看 `../hiui5-visual-baseline.md`；共享规则里只维护会影响页型一致性的关键约束
- 不要以“外部样式会影响筛选表现”为理由回退到手写筛选；应修正 `QueryFilter` 的样式来源、桥接层或宿主接入，而不是替换组件语义
- 不要把“源码里有 `<QueryFilter />`”当成完成信号；真实预览中未选择筛选值时应看到关键词搜索框、至少一个筛选控件与 `全部筛选`，选择筛选值后才出现 `清空`
- 若控制台继续出现 `FieldsContext` / `ValueType` 缺失类 warning，优先按 `field map / renderer bridge` 未接通处理，不要继续写业务字段

## Table

- 本节中的表格外观、交互和动作语义都属于硬门槛；除明确冲突说明外，不允许把这些项降级成“宿主已有默认样式”
- 默认 `size="md"`
- 默认开启 `resizable`
- 默认开启表格字段管理；优先复用 HiUI5 表格已有的字段管理 / 列展示管理能力
- 默认 `bordered={false}`，避免回退到纵向分割线明显的表格骨架
- 默认 `striped={false}`，避免把后台表格做成高装饰化斑马纹
- 不要把 `bordered={false}`、`striped={false}` 理解成“宿主默认大概率会是这样”；业务页显式开启 `bordered` 或 `striped` 时，按共享表格骨架被主动改写处理
- 表头默认无额外底色；文案通常为 `14 / 500 / #91959E`，依靠分隔线和留白建立层级
- 单元格默认 `14 / 400 / #1A1D26`
- hover 行默认 `#F2F4F7`，selected 行默认 `#EDF2FF`
- 默认文本列：单行、省略、Tooltip、`max-width: 360px`
- 表头默认最多 2 行；超出 `ellipsis + tooltip`
- 非中文列宽默认按内容与 locale 膨胀适配；不要把中文窄列直接硬搬到 `de-DE / th-TH / ar-SA`
- 状态 / 流程 / 开关列默认 `Tag`
- 类型 / 分类 / 渠道 / 入口 / 是或否列默认文本
- 列表页标题区如果有操作按钮，优先用 `extra={<Space className={proTablePageStyles.headerExtra}>...</Space>}`；统计页则沿用 `proStatPageStyles.headerExtra`
- 典型页表格页若在页头标题区放主操作按钮，主按钮应位于右侧操作区的最右端；若同组有多个按钮，主按钮写在最后
- 同一操作区默认最多 1 个主按钮；次级动作优先 outline，弱动作优先 text / link
- 行操作默认使用 HiUI5 蓝色 `appearance="link"` 语义；没有明确设计特例时，不要回退到黑色 `line` / `default` 按钮
- 若操作列承担高频动作且设计要求冻结右侧，默认同时声明列配置固定和 wrapper 级 `fixedToColumn`；不要只写一半
- 单元格若需要补次级信息，优先落到独立列、Tooltip 或详情入口；不要默认在一个 cell 里堆多个并列语义字段
- 当前项目若已有统一壳组件，优先复用壳组件而不是手拼：
  - 数据统计表：`src/components/pro-stat-page/`
  - 普通列表 / 左树右表 / 树形表格：`src/components/pro-list-page/`

## 宿主与样式前置

- 本节中的白底主体、高度链、样式资源生效都按硬门槛验收；任何“先把业务页跑起来、样式以后再补”的路径都视为未通过
- 普通 `TablePageFrame` 列表页的主区白底必须和筛选区、表格区、分页区保持同一个白卡主体，并纵向铺满主槽到底部；不要出现分页下方露出宿主灰底的情况
- 普通表格 / 树形表格若声明 `shell=TablePageFrame`，运行时必须直接挂 `TablePageFrame`，或通过命名 shared shell-carrier 显式继承其结构；禁止在业务页局部手写 `PageHeader + QueryFilter + Table` 后只补 region marker 伪装成标准壳
- `TablePageFrame` 的表格区水平 inset 是硬契约：筛选区通常有 `20px` 左右留白，表格区也必须保留 `tableContainer` 级 `padding-inline: 20px` / `padding: 0 20px`；不要让表格表头、固定操作列或分页贴到白底主体边缘
- 列表页主白底禁止额外投影；若需要层级，只依靠分隔线、描边与留白，不要叠 `box-shadow`
- `pro-table-page` 与 `pro-stat-page` 一样依赖宿主内容区的高度链收口：内容列 / 路由出口至少满足 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
- 表格类典型页所在宿主内容区必须允许 `flex: 1 1 0%` + `min-height: 0`，不要让列表页处在普通文档流中自然撑高
- 只有示例页本身采用吸底分页的表格类页型，才要求分页作为白底主体底部的吸底区存在；不要把该规则外溢到 `data-visualization` 等未在示例中要求吸底分页的页型
- 目标项目必须确认 `@hiui-design/typical-page-shells` 的样式资源已正常生效；不要只看到页面能渲染就继续往下改业务
- 一旦页面开始使用 `TablePageFrame` / `ProListPageProvider` 等壳组件，必须同时满足：
  - `package.json` 正式声明 `@hiui-design/typical-page-shells`
  - 应用入口已引入 `@hiui-design/typical-page-shells/styles.css`
  - 代码只从 `@hiui-design/typical-page-shells` 或其公开子路径导入，不要走 `node_modules/.pnpm/.../dist/*`
- 如果数据统计页的指标卡退化成普通文本块、白底壳层消失，优先排查样式资源是否丢失，而不是继续手补 `Card` 和 `padding`

## 常见误用

- 不要看到分页下方露灰就直接在页面根或白卡上补 `min-height: 100vh`、额外 `Card`、额外 `padding-right`
- 不要把“白底没有铺到底部”当成单页 spacing 问题；对普通表格页优先排查宿主高度链和包样式资源
- 不要看到筛选能渲染就自行在 `QueryFilter.append` 里补“查询”按钮；那会让示例默认节奏漂移
- 不要把“全部筛选”退化成普通 outline/text 按钮
- 不要在 split 左栏 / 树面板里直接裸用 `SearchInput` 却不覆盖其默认固定宽度；若真实承接关系是 pane 宽度，必须显式把输入框接回 `width: 100% + min-width: 0`
- 不要在双表场景的 `Table` 外再包 `overflow-y:auto`
- 不要单独把统计页 footer 高度改得比同壳列表更高
- 不要在根容器额外叠 `padding-right`
- 不要因为外部样式干扰或宿主封装限制就关闭字段管理，除非有明确产品限制
- 不要在业务页直接写 `<Table bordered />`、`<Table striped />`，或通过宿主二次封装把它们默认重新打开；这不是“宿主微调”，而是对共享表格骨架的显式改写
- 不要遗漏头体列宽同源、滚动槽稳定和省略策略
- 不要把 `bordered={false}`、`striped={false}`、`fixedToColumn` 继续当成“宿主自己会处理”的隐式默认值
- 不要通过“一个单元格塞多个字段”去节省列数；那会破坏扫读和字段管理语义
- 不要在已有 `StatListPageFrame` / `StatOverviewGrid` 的项目里重新手写统计页白卡壳层
- 列标题、搜索占位、筛选文案、分页文案或行操作文案先按 `i18nMode` 处理；`none` 模式允许直接中文，`key-only` 模式沿用宿主翻译函数，`full` 模式必须进入 locale 资源与 formatter
