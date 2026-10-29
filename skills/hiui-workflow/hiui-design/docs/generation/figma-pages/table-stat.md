# 数据统计表

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51257:107076`

## 适用

- 顶部指标卡 + 筛选 + 表格
- 典型 `table-stat`

共享表格规则见 [`table-shared.md`](table-shared.md)。

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

- 当前项目存在共享实现时，优先复用 `src/components/pro-stat-page/` 的 `StatListPageFrame`、`StatOverviewGrid` 网格能力，以及项目共享运行时 `src/runtime/analytics-primitives` 的统一指标卡视觉合同
- 外部项目必须参考 `examples/host-integration/src/pages/table-stat.tsx` 起步，但真实业务页要落在目标项目原有目录结构中，不要把模版页同步进 `src/typical-page-preview/`
- 必须保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`；若项目已接入共享指标卡运行时，统计卡默认通过受管 `MetricOverviewGrid` / `MetricCard` 承接视觉
- 页头、指标卡、筛选、表格、分页必须继续留在同一个 `StatListPageFrame` 白底壳层里
- 宿主内容区必须给 `pro-stat-page` 一条可收口的高度链：内容列 / 路由出口至少满足 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
- 页头与外槽背景 `#F5F8FC`
- 主区白底从指标卡、筛选、表格一直铺到底部
- 指标卡容器 `gap: 12`
- 单卡：白底 + `1px #EDEFF2` + 圆角 `8` + 内边距 `16`
- 默认只展示“名称 + 主值”，可选迷你图；没有书面依据不要加同环比
- 有次要指标时：
  - 无迷你图：紧跟主值后，`gap: 8`，左对齐
  - 有迷你图：放到底部独占一行
- 指标名称必须单行省略 + Tooltip
- 指标名称与主数值之间不要再留竖向间距
- 筛选区 `padding: 16px 20px`，行内 `gap: 8`
- 表格区水平 `padding: 0 20px`
- `Table` 中号、无斑马
- 分页区与同壳 `table-normal` 保持一致
- 必须确认 `src/components/hiui-design-runtime/styles.css` 已在目标项目中生效；否则指标卡会退化成普通文本、白底壳层也会丢失

## 生成时边界

- 写代码前先按 `../ai-page-generation-guidance.md` 形成 `coverageDecision`。
- `stat-section` 默认由 `StatOverviewGrid` 持有网格合同，并由项目共享运行时 `src/runtime/analytics-primitives` 的 `MetricOverviewGrid` / `MetricCard` 承接卡片视觉；业务只替换统计数据请求和指标名称 / 数值数据，不重画统计卡片结构。
- 共享 `MetricCard` 的视觉基线必须继续对齐 `table-stat` 原有统计卡：标题 `14 / 22 / 400`、主值 `24 / 32 / 700`、左对齐、标题与主值之间不额外插入竖向间距。
- `query-filter`、`table`、`pagination` 默认由 `StatListPageFrame` / `ProListPageProvider` 持有；业务只替换 `queryFields`、`tableFields`、`tableProps` 中 manifest 允许的内容。
- 页面源文件里的 `renderCard`、`children`、`customWhiteBody`、`customMainScroll` 属于 escape hatch；未注册 manifest 组件前不得直接使用。若需要共享指标卡视觉，应优先复用受管 `MetricOverviewGrid`，而不是在页面层直接改 `renderCard`。
- 需要统计卡片内新增标签、徽标、趋势图或复杂布局时，先判定为未覆盖 UI，再选择 HiUI5 组件、受管 helper 或 manifest 注册组件；找不到来源时停止生成。
- 页面本地样式默认只允许布局辅助；统计卡片颜色、字号、圆角、阴影默认由共享 `MetricCard` 视觉合同和 shell 网格节奏持有。

## 指标卡最小宽

| 场景 | 最小宽 |
|------|--------|
| 无次要、无迷你图 | `100` |
| 有次要 | `180` |
| 仅迷你图、无次要 | `200` |

## 栅格算法

- 一行能放下全部卡片：`repeat(N, 1fr)` 铺满
- 一行放不下：固定两行，列数 `ceil(N/2)`
- 不能均分时最后一个栅格位留空，不要让末卡跨列补满

## 页面逐层拆解

### 1. 运行骨架

- 数据统计表页的运行骨架是 `ProListPageProvider -> TypicalPageFieldMapProvider -> StatListPageFrame`。
- `ProListPageProvider` 负责表格数据请求和分页状态，`TypicalPageFieldMapProvider` 负责字段桥接，`StatListPageFrame` 负责统计页全部视觉骨架。
- 统计页不是“在普通表格页上方塞一排卡片”，而是独立的统计页壳；标题区、指标区、筛选区、表格区、分页区必须都属于这个壳。

### 2. 标题区

- 标题区由 `StatListPageFrame.title` 和 `extra` 持有；命名上通常使用统计对象或分析主题，例如 `数据统计表`。
- 标题区操作按钮应沿用 `proStatPageStyles.headerExtra`，不要复用普通列表的头部按钮容器。
- 右侧动作区必须使用 `proStatPageStyles.headerExtra`，因为统计页标题区的按钮节奏和普通表格不是同一个样式入口。
- 组件模式仍是 `Space + Button`，但这里的动作语义通常是导出、刷新、切换口径等“页面级统计动作”，而不是新增表单对象。

### 3. 指标卡区

- 指标卡区不是业务自由排版区，而是 `statSection` 持有的受管区域；典型实现由 `StatOverviewGrid` 负责网格、由 `MetricOverviewGrid` / `MetricCard` 负责单卡视觉。
- 结构上，每张卡最小由“指标名称 + 主值”组成，可选再带次要指标或迷你图，但这两项都不是默认必需。
- 布局上，指标卡区位于标题区与筛选区之间，容器 `gap: 12px`；卡内采用垂直堆叠，标题与主值之间不要再额外塞出大段空白。
- 样式上，单卡是白底、`1px #EDEFF2` 描边、`8px` 圆角、`16px` 内边距；标题使用常规字重，主值使用更重的数字字重，不要把它做成灰底块、彩色块或重阴影卡。
- 组件模式上，指标卡由受管组件生成；业务只替换统计项名称、数值和请求，不重新手写卡片 DOM，也不在页面层另起一套指标卡皮肤。

### 4. 筛选控制带

- 筛选控制带仍然是列表级控制，而不是统计卡自身的一部分；人员、组织、时间范围等只是常见统计维度，控件能力仍以当前项目接入的 HiUI5 `QueryFilter` / schema 支持能力为准。
- 布局上，统计页筛选区与普通列表的区别在于 `padding: 16px 20px`，而不是 `20px 20px 16px`。
- 样式上继续沿用 `QueryFilter` 默认语法，不新增彩色底、说明条或二次 label。
- 组件模式上，枚举类统计维度通常用 `Select`，时间类维度通常用 `DateRange`；但这只是常见形式，不代表统计页只能使用这些筛选控件。关键词检索仍优先维持一个搜索入口，不拆多框。

### 5. 表格主体

- 表格主体是统计页的明细收口层，不是另一张独立页面；它与指标区和筛选区属于同一白底主体。
- 表格主体是统计明细表，列模式以只读数值列和轻文本列为主，没有行内编辑。
- 布局上表格区水平 `padding: 0 20px`，紧接筛选区往下延展；分页位于同一主体底部。
- 样式上继续使用中号、无斑马的统计表风格；不要因为数据是统计值就把表格单独改成另一套 dashboard 样式。

### 6. 分页收口

- 分页区属于统计页壳层，不允许从 `StatListPageFrame` 里拆出去做吸底自定义 footer。
- 它必须和上方表格、筛选、指标区处在同一高度链里，保证白底从顶部一直铺到底部。
- 如果统计卡样式、白底或分页同时失真，优先排查 `src/components/hiui-design-runtime/styles.css` 与宿主高度链，而不是逐块手补。
- 不要单独把统计页 footer 高度改得比同壳列表更高，也不要在已有 `StatListPageFrame` / `StatOverviewGrid` 的项目里重新手写统计页白卡壳层。

## 关键组件与属性契约

### `ProListPageProvider`

- `request`：明细表数据入口；接收统计筛选和分页参数，返回统计明细数据。
- 职责边界：它只管理明细列表状态，不直接管理指标卡布局。

### `StatListPageFrame`

- `title`：统计页标题入口。
- `queryFields`：统计筛选入口；承接统计维度，而不是指标卡内部局部控件。
- `tableFields`：明细表列入口。
- `searchPlaceholder`：合并关键词搜索文案。
- `statSection`：统计页专属内容入口；指标卡区必须从这里进入，不要在外层另造统计容器。
- `extra`：标题区动作入口；必须走 `proStatPageStyles.headerExtra` 节奏。
- `tableProps`：明细表行为补充入口；不能借它改坏整个统计页的白底和分页结构。

### `StatOverviewGrid`

- `request`：指标卡数据入口；负责返回统计卡片所需列表。
- 返回内容：至少应包含标题、主值及可选补充信息；若业务需要更复杂卡片形态，先判定为未覆盖 UI。
- 职责边界：它只承接指标卡区，不接管标题区、筛选区和明细表。

## 禁止

- 不要绕开 `StatListPageFrame` 再手拼页头、白底壳、筛选区和表格高度链
- 不要把数据统计页退化成“灰底宿主 + 裸文本指标 + 一块普通表格”的通用列表页
- 不要把卡间距写成 `16`
- 不要把卡做成灰底填充卡
- 不要在页面根或 `ProListPage` 额外叠 `padding-right`
- 不要只在统计页单独改 `.hi-v5-table-footer`
- 不要让统计页 `queryFields` 与同壳普通列表分叉
- 不要看到指标卡无样式就临时补一层 `Card`、手写 border / radius；先排查包样式资源和宿主高度链

## 自检

- 是否从 `table-stat.tsx` 起步，而不是从普通表格页或空白文件起步
- 是否保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`
- 指标卡样式是否是白卡 + 描边
- 指标卡是否不是“标题和数值直接散落在页面上”
- 是否默认未展示同环比
- 白底是否铺到底部
- 筛选是否是 `16 / 20`
- footer 是否与兄弟列表一致
- 页头、指标卡、筛选和表格之间是否没有贴边坍塌
- 样式资源和宿主高度链是否已确认正常

## 失败信号

- 指标区只剩“名称 + 数值”纯文本，没有白卡、描边、圆角和 `12px` gap
- 页头与指标区、筛选区直接贴在一起，像普通文档流页面而不是典型页壳层
- 主区白底没有从指标卡一直延伸到分页底部
- 表格区高度不收口，页面整体往下无限撑开，或分页和表格贴边错位
- 为了补样式开始在统计卡外层额外叠 `Card`、自定义灰底容器、额外 `padding-right`
