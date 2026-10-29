# 数据可视化

## 默认稿

- 当前 `hiui-design` 不提供独立默认 `nodeId`
- 官方起点：`examples/host-integration/src/pages/data-visualization/index.tsx`
- 运行时对照页：`examples/host-integration/src/pages/data-visualization/index.tsx`
- 共享表格规则继续复用 [`table-shared.md`](table-shared.md)

## 当前 skill 范围

当前 `hiui-design` 已把 `data-visualization` 注册为可落地的扩展页型，但能力边界收敛在：

- manifest 机读合同
- 页头与 `whiteBody` 固定壳层
- 规则驱动的内容区生成
- `@ant-design/charts` 真实图表基线
- 本地 `chart-theme.ts` 主题与配色 helper

当前 skill 不额外引入旧版 `hiui-design` 包那套独立的 managed-analytics 治理链、chart registry 或 certified variant 审批流程。后续如果需要跨业务复用更重的图表治理能力，应单独扩展，不要在当前 skill 文档里假定这些能力已经存在。

## 适用

- 图表是页面主信息载体，而不是列表页里的局部辅助卡片
- 页面主体是“指标卡 + 多图表”为主的分析阅读流；是否追加明细表取决于业务是否需要记录下钻、复核或后续操作承接
- 需要趋势、分布、排行、监控、对比等图表阅读；若业务包含表格，它只承接精确明细

如果页面仍然是“指标卡 + 筛选 + 表格 + 分页”，优先使用 `table-stat`，不要误判成 `data-visualization`。

## P0

- 必须从 `data-visualization` 的固定壳层起步，不要从 `table-stat.tsx` 或空白文件降级生成
- 必须保留 `ProListPageProvider`、`TypicalPageFieldMapProvider`、`StatListPageFrame`
- 固定区域只有页头与 `whiteBody` 主体；内容区域不复制整页示例，而是按规则生成
- `queryFields + searchPlaceholder` 承担页面级 control strip；若业务存在记录级筛选，它仍应留在明细表附近，不与 page-global 控制混线
- 单维度主切换默认使用 HiUI5 `Radio` 按钮组；不要用普通 `Button` 列表伪造单选切换
- 指标卡与图表区必须位于同一个 `whiteBody` 工作区内；若业务包含明细表，它也必须位于同一个工作区内
- 页面主滚动默认由白底主体自然承接，不要再拆第二层页面白底或第二套主滚动
- 明细表在这里是按业务诉求决定的可选收口层，不是独立二级页；无此诉求时不要为了套示例硬补表格
- 图表必须继续使用真实 `@ant-design/charts`，不要用占位 DOM、纯 CSS 趋势线或“先画个近似图”顶替
- 图表主题、色板和图表容器节奏优先复用 `chart-theme.ts`，不要直接回退到图表库默认皮肤
- 共享 `MetricCard` / `ChartCard` 的视觉基线由项目共享运行时持有；页面本地样式默认只允许布局辅助，不得再对共享卡片追加 `min-height`、`border`、`background`、`padding` 等局部视觉覆写
- 已有图表允许从官方示例页中按图表级别选择性复制，并替换业务内容；不允许把整页布局原样搬运

## 生成时边界

- 写代码前先按 `../ai-page-generation-guidance.md` 形成 `coverageDecision`
- 不走常规典型页“复制母版后只替换业务槽位”的默认生成链；manifest 中声明的 `businessSlots` / `allowedSlots` 在本页型里只表示受控重构面，不表示可批量自动替换
- 规则驱动的固定区域只有 `header` 与 `whiteBody`；`queryFields + searchPlaceholder` 承担 page-global control strip，`summarySection`、`chartSection` 按规范生成；只有业务明确需要时才生成 `detailTable`。其中 `summarySection` 可独立使用摘要 grid，正式 `chartSection` 需在整个图表区保持一种基础 grid mode
- `statSection` 是整个分析工作区的业务入口，不是额外页面壳；在这里替换指标卡和图表内容时，不得创建第二个 `whiteBody`
- `queryFields + searchPlaceholder` 承担 shell-owned page-global control strip；不要在 `statSection` 里再手拼第二条页面级查询面板
- `tableFields` / `listRequest` 只在业务确实需要明细表时承接该区域；不要把页面重新写回“表格页主导、图表点缀”的结构，也不要在无明细诉求时硬补示例表格
- 接口未接入、mock、生成说明、测试说明不得作为页面常驻内容渲染

## AI 一次写对 Golden Path

`data-visualization` 的默认目标不是先产出空脚手架再修补，而是在首次写代码时就落到可运行、可替换业务数据的标准分析页骨架。AI 生成前必须按下面顺序组织代码：

1. 先确定核心业务数据：`summaryMetrics`、`chartCards`；只有业务明确需要记录下钻、复核或后续操作承接时，再补 `detailRows`。没有后端接口时生成可信 mock 数据，但不要留下“稍后接入 / 占位图表 / TODO 替换”的常驻内容。
2. 默认使用同目录 `chart-theme.ts`，从中导入 `hiuiChartTokens`、色板、坐标轴、响应式或颜色 scale helper；图表不得直接回退到 `@ant-design/charts` 默认皮肤。只要页面出现 `Column` 或 `Bar`，对应配置必须使用 `createHiuiColumnLikeScale` / `createHiuiColumnLikeColorScale` 或 `createHiuiBarLikeScale` / `createHiuiBarLikeColorScale`，不要只把柱图/条图挂到通用 `chartCommonConfig`。
   若页面使用单序列趋势 `Area`，对应配置必须走面积图 archetype 合同：通过 `withHiuiResponsiveChart` 包装、`line.style.lineWidth = 2`、使用批准的 HiUI 渐变填充与 `fillOpacity = 0.2`，并禁止使用 `shapeField: 'smooth'` 这类绕过受管样式的写法。
3. 先完成桌面端图表区规划，再落 JSX：常规默认三列 grid，主图用 `chartGridFeatured` 跨两列；`chartCards` 里要用 `featured` 或等价字段表达 `slotPlan / rowFillDecision` 的结果，避免最后一行孤图。
4. 统一通过 `MetricCard` 和 `ChartCard` 渲染；优先复用项目共享运行时 `src/runtime/analytics-primitives`，不要在业务页本地再次定义同名卡片实现。`MetricCard` 使用统一白底描边卡片，不要给单张指标卡增加彩色顶边、渐变条、角标等装饰；`ChartCard` 固定 `chartHeader -> chartContent`，`chartContent` 拉伸填满网格单元，不能每张图自己决定卡片 DOM、颜色和间距。
5. 若业务需要明细表，再接入 `queryFields + searchPlaceholder + tableFields + queryVisualizationDetailList`，让 control strip 属于 shell，明细表作为同一个 `whiteBody` 阅读流尾部收口；无此诉求时页面可以在图表阅读流结束。
6. 图表标题、区块标题和分组标题默认不展示副标题；只有在用户明确要求阅读提示、补充说明或统计口径时，才允许显式传入 `subtitle` / `summary`。
7. 若业务需要尾部明细表，且表格前面还需要补一个分组标题或操作条，标题到表格的收口间距必须作为受管阅读节奏处理；不要只在标题分组内部加 `gap`，否则会出现标题改了、shell 持有的表格起点没动的假修复。

轻量兜底只看少量硬约束：存在真实 `@ant-design/charts` 实例、存在 `./chart-theme` 主题来源、柱图/条图使用对应 HiUI scale helper、指标卡没有彩色顶边装饰、没有残留 placeholder / TODO / “稍后替换”文本。不要因为这些兜底再引入重审批或复杂组件决策表。

## 规则驱动内容区

内容区必须按规范生成，而不是按示例页一比一拷贝。至少遵守下面四层规则：

1. 工作区顺序
   `queryFields/searchPlaceholder(control strip) -> stat-section -> chart-section -> detail-table（按需）`
2. 正式图表区布局
   `summarySection` 可使用独立摘要卡 grid，不受正式图表区单一基础 `grid mode` 约束；正式 `chartSection` 只允许一种基础 `grid mode`，主图通过同一 grid 中的 `span` / 主次权重强调，不要按每一行切换 grid 类型，并避免最后一行的破洞布局
   生成前必须先做图表占位规划：至少明确 `chartCount`、`desktopBaseColumns`、`slotPlan`、`slotRemainder`、`selectedChartArchetype` 和 `rowFillDecision`
   若 `slotPlan` 在桌面主布局下不能形成完整行，不要直接落图；先按 `merge-secondary -> remove-weak-chart -> switch-archetype -> adjust-span` 的顺序收口，避免最后一行只剩单卡
   主图强调只允许在同一 chart grid 内通过 `span` 或主次权重完成；不要为了补齐最后一行再切回第二种 grid 写法
3. 色彩与图表主题
   业务页不直接回退到图表库默认色板；优先复用 `chart-theme.ts` 的色槽与轴线基线
   只要出现面积趋势图，就继续遵守同一套面积图 archetype 合同；这条合同同样适用于其他包含图表的页型，不因为页面不是 `data-visualization` 就放宽
4. 组件优先级
   正式图表使用真实 `@ant-design/charts`；若业务包含记录级筛选和明细承接，继续复用 `QueryFilter + Table` 语义
5. 指标卡表达
   指标卡默认只要求标题 + 主值；迷你图属于可选增强，没有业务依据时可以不展示
6. 图表卡填充
   图表项容器必须可拉伸，图表卡必须填满所在网格单元；卡片内部采用“header 固定 + chart body 拉伸”的结构，不要只靠图表内容自然撑高

如果某张图表在官方示例里已经有接近的实现，可以复制那一张图表卡或图表配置，再替换业务数据与文案；不要因此把整页结构也一起复制。

## 默认生成步骤

1. 先判页型
   确认页面是“图表主导，是否带表格由业务决定”的分析阅读流；如果仍然是“指标卡 + 筛选 + 表格 + 分页”，回退到 `table-stat`。
2. 再读机读合同
   读取 `../page-types.manifest.json` 中 `data-visualization.generationContract`，确认 `requiredShell`、`generationWorkflow`、`lightSanityChecks`、固定区域与图表复用策略。
3. 再锁槽位边界
   对照 `../page-slot-boundaries.md` 的 `data-visualization` 小节，先声明受控重构面和“禁止第二个 whiteBody / 第二套主滚动”的边界。
4. 生成壳层骨架
   固定 `header + whiteBody` 的受管壳层，由 `queryFields + searchPlaceholder` 落位 page-global control strip，内容区生成 `summarySection / chartSection` 的规则骨架；只有业务明确需要时才追加 `detailTable`；不要复制整页示例。
5. 先生成全局控制与摘要区
   先在 `queryFields + searchPlaceholder` 中配置页面级控制，再围绕指标卡和摘要带生成内容，保持它们位于同一个 `whiteBody` 顶部阅读流中。指标卡默认展示标题 + 主值，迷你图按业务依据可选补充。
6. 再生成图表区
   根据主问题选择布局 archetype、基础 grid mode、主图与辅图角色；正式图表区从头到尾保持一种基础 grid mode，如需强调主图，只能在同一 chart grid 中用 span / 主次权重表达；先完成 `slotPlan / rowFillDecision` 收口，确保桌面主布局下没有最后一行孤图，再落图；如有现成图表可复用，只复制该图表块并替换业务内容。
7. 按需生成明细表收口
   只有业务明确需要记录下钻、复核或后续操作承接时，才结合 `tableFields`、`tableProps`、`listRequest`、`mockData` 生成分析尾部明细；明细表仍属于同一个工作区，不得抽离为独立子页。无此诉求时，不生成该段。
8. 做轻量自检
   核对单白底工作区、真实 `@ant-design/charts`、`chart-theme.ts` 主题来源、主滚动和 `.hi-v5-table-footer` 的普通文档流状态是否保留。

## 图表与表格职责

- 指标卡负责摘要和快速扫读，默认可只展示数值，迷你图是可选增强
- 图表负责趋势、分布、排行、对比等分析判断
- 若存在明细表，它负责精确记录、筛选复核和后续操作承接

推荐阅读路径通常是：摘要带 -> 主图表 -> 辅助图表 -> 明细表（按需）。

## 样式与滚动

- 页面根必须保持连续的 `flex + min-height: 0` 高度链
- `whiteBody` 默认承接页面级纵向滚动
- 若存在明细表，它的容器应跟随工作区自然流动，不要恢复成列表页里的吸底分页脚手架
- `.hi-v5-table-footer` 在本页型中应保持普通文档流，不要固定吸底
- 正式图表区的图表项容器必须支持子项拉伸；图表卡默认填满网格单元，卡片标题区固定，图表内容区拉伸承接剩余高度

## 页面逐层拆解

### 1. 运行骨架

- 数据可视化页的运行骨架仍然是 `ProListPageProvider -> TypicalPageFieldMapProvider -> StatListPageFrame`，但它不是普通统计表。
- `StatListPageFrame` 在这里负责页头、全局筛选和单一 `whiteBody` 工作区；若业务包含明细表，它也由同一个壳层承接。
- 分析页和统计表的分界点在于：`statSection` 不再只是几张指标卡，而是整个分析工作区主体。

### 2. 全局控制带

- `queryFields + searchPlaceholder` 是页面级 control strip；区域、来源、时间范围加关键词搜索只是常见组合，具体控件和字段能力仍以当前项目接入的 HiUI5 `QueryFilter` / schema 支持能力为准。
- 这条控制带位于白底工作区顶部，只承担页面级查询，不混入记录级过滤或图表局部筛选。
- 样式和组件模式继续沿用 `QueryFilter` 体系；不要在这里再手拼第二条“分析条件栏”。
- 若控制带只承载单维度主切换，例如“日 / 周 / 月 / 年”，默认使用 HiUI5 `Radio` 按钮组语法；不要退回普通按钮列表。

### 3. 摘要区 `summarySection`

- 摘要区落在分析工作区内部，通常使用 `summaryGrid` 组织 `MetricCard`；实现默认复用项目共享运行时 `src/runtime/analytics-primitives`。
- 这套 `MetricCard` 也是 `table-stat` 指标卡的共享视觉基线；统计表若继续使用 `StatOverviewGrid`，它只负责网格排布，不再自带另一套卡片皮肤。
- `summaryGrid` 是独立摘要网格，桌面端四列、收缩时两列/一列；这块可以和正式图表区使用不同 grid，因为它承担的是摘要，不是图表主阅读流。
- 每张 `MetricCard` 的内部结构固定为“标题 -> 主值行 -> 可选迷你图”，并与 `table-stat` 原生统计卡保持同一排版基线。
- 标题使用 `14 / 22 / 400`，主值使用 `24 / 32 / 700`，标题与主值之间不额外拉开竖向间距；有备注时与主值基线对齐并排展示。
- 样式上卡片是白底、`1px` 描边、`8px` 圆角、`16px` 内边距；默认保持紧凑的统计卡节奏，不人为增加标题区和主值区之间的额外 `gap`。
- 页面本地样式若只是为了排布卡片，允许设置 grid 列数、响应式断点和最外层布局；不允许再给共享 `MetricCard` 单独加 `min-height`、重新描边、改背景或重写内边距。
- 指标卡不使用 `borderTop`、渐变顶条、彩色角标等单卡装饰；指标状态只能通过文案、主值语义或可选迷你图表达，避免破坏统一卡片节奏。

### 4. 正式图表区 `chartSection`

- 正式图表区由 `chartGrid` 持有，是整个分析页最核心的阅读区域。
- 正式图表区应明确使用一套基础三列 grid；重点图表通过 `chartGridFeatured` 跨两列表达，不通过切换第二套 grid 语法表达强调。
- 这意味着图表区的布局单位是“网格单元”，不是“每张图自己决定宽高”；落图前必须先收口 `slotPlan`。
- 每张图表卡都通过统一的 `ChartCard` 包裹，内部结构固定为“chartHeader -> chartContent”，header 不跟着图表内容高度漂移；实现默认复用项目共享运行时 `src/runtime/analytics-primitives`。
- `chartContent` 负责拉伸填满网格单元；不要把图表卡写成内容自然撑高，导致同一行卡片高低不齐。
- 页面本地样式若只是为了组织图表网格，允许设置 grid 和卡片占位；不要在业务页重新发明图表卡内边距、边框和内容区留白节奏。

### 5. 图表卡组件模式

- 图表卡不是自由 DOM 卡片，而是“受管卡片壳 + 真实图表实例”的组合。
- 图表类型以当前运行时可用、且适合该页型阅读流的真实 `@ant-design/charts` 能力为准；`Line`、`Pie`、`DualAxes`、`Column`、`Bar`、`Area`、`Gauge`、`Radar`、`Liquid`、`Funnel` 等都只是常见示例，不构成封闭列表，但都应落在统一图表卡模式中。
- 颜色、坐标轴、legend、mini chart、响应式行为都通过 `chart-theme.ts` 和 `hiuiChartTokens` 统一收口；不要直接用图表库默认主题。
- 特殊图表如 `Liquid` 允许在卡片内部加受控 overlay，但 overlay 仍应服务图表，不变成额外说明卡。

### 5.1 面积趋势图 archetype 合同

- 适用范围不是只有 `data-visualization`；只要页面里用 `Area` 承接趋势判断，就要复用这套合同。
- 面积趋势图配置必须通过 `withHiuiResponsiveChart` 输出，不要直接返回裸配置对象。
- 线条样式必须显式声明 `line.style.lineWidth = 2`，不要依赖图表库默认线宽。
- 面填充必须使用批准的 HiUI 渐变填充，并配合 `fillOpacity = 0.2` 形成统一视觉层次。
- 禁止使用 `shapeField: 'smooth'` 这类会绕开受管面积图样式的写法；平滑趋势应通过受管配置表达。

### 6. 尾部明细表 `detailTable`

- 这是一段按业务诉求决定的可选区域，不是 `data-visualization` 的固定必带结构。
- 只有在需要记录下钻、筛选复核或后续操作承接时，才由 `tableFields + listRequest` 生成该区域；它是分析阅读流的最后一段，不是第二张页面。
- 明细表仍放在 `StatListPageFrame` 里，使用普通文档流 footer，不采用列表页那种强吸底分页语法。
- 样式上表格区跟随同一工作区自然延展，并在容器底部补 `20px` 收口；不要把它抽出去再造一张“明细大卡”。
- 若明细表前面还有 `SectionHeader` 或导出操作区，标题与表格之间的留白必须沿着受管工作区一起收口；不要只改标题容器内部的 `gap`，否则无法真正改变 shell 持有的表格起点。

## 关键组件与属性契约

### `ProListPageProvider`

- `request`：尾部明细表数据入口；只有生成明细表时才需要，接收全局筛选、搜索和分页参数。

### `StatListPageFrame`

- `title`：页面标题入口。
- `queryFields`：页面级 control strip 入口。
- `searchPlaceholder`：合并搜索文案。
- `statSection`：分析工作区主体入口；摘要区和图表区都应从这里进入。
- `tableFields`：明细表列入口；只有生成明细表时才需要。
- `tableProps`：尾部明细表行为补充入口；只有生成明细表时才需要，不要借此把明细表改回吸底列表页。

### `MetricCard`

- 默认来源：项目共享运行时 `src/runtime/analytics-primitives`；规则源参考 `examples/host-integration/src/runtime/analytics-primitives`。
- `title`：指标标题。
- `value`：主值。
- `note`：补充说明 / 单位 / 辅助指标文本。
- `stateHint`：右上角状态提示；用于“当前趋势 / 点击查看”这类轻量状态，不得替代标题。
- `visual`：迷你图或其他受控补充内容入口；可选，不是每张卡都必须有。

### `ChartCard`

- 默认来源：项目共享运行时 `src/runtime/analytics-primitives`；规则源参考 `examples/host-integration/src/runtime/analytics-primitives`。
- `title`：图表标题。
- `subtitle`：图表副标题；可选，默认不展示。
- `children`：真实图表实例入口。
- `contentStyle`：图表内容区样式补充入口；仅用于特殊图表卡，不应用来重造卡片壳。

### 图表配置

- `data`：图表数据入口。
- `height`：图表高度入口；必须服从图表卡填充规则。
- `xField` / `yField` / `colorField`：图表维度映射入口；按图表类型选择。
- `scale` / `axis` / `legend`：主题与阅读流配置入口；应优先复用 `chart-theme.ts` 产物。

## 禁止

- 不要把 `data-visualization` 退化成 `table-stat`
- 不要把图表区拆成第二个页面壳、第二层白卡主体或独立二级页
- 不要把多个图表随意堆成没有阅读顺序的图表墙
- 不要直接用第三方 UI 容器绕过当前页型的壳层和主题 helper
- 不要在页面常驻区域渲染“接口未接入 / 当前为示例 / 测试说明”等说明文本

## 自检

- 是否从 `data-visualization` 官方示例页起步，而不是从 `table-stat` 或空白文件起步
- 是否保留 `ProListPageProvider`、`TypicalPageFieldMapProvider`、`StatListPageFrame`
- 指标卡、图表区是否仍位于同一个 `whiteBody` 工作区；若业务包含明细表，它是否也留在同一个工作区
- `summarySection` 是否只承担摘要表达并允许独立摘要 grid；正式 `chartSection` 是否从头到尾只保持一种基础 `grid mode`，主图通过同一 grid 内的 span / 主次权重强调
- 正式图表区是否先完成 `slotPlan / rowFillDecision / selectedChartArchetype` 收口，没有把最后一张图孤立到单独一行
- 图表项容器和图表卡是否具备 fill contract，没有只靠不同图表内容自然撑高
- 图表是否仍是 `@ant-design/charts` 真实实现，而不是占位近似图
- 若业务包含明细表，它是否仍位于页面阅读流尾部，没有退回吸底列表脚手架
- 页面本地样式是否只负责布局，而没有对共享 `MetricCard` / `ChartCard` 重写视觉基线
- 页面是否没有新增第二层白底主体、第二套主滚动或常驻交付说明

## 失败信号

- 页面整体看起来像“带几张图的普通统计表”，而不是分析页
- 正式图表区按每一行切换不同删格写法，主图靠切换另一套图表 grid 抢强调
- 图表被替换成文本占位、假走势图或不受控的第三方默认主题
- 图表区和可选明细表被拆成两块独立大白卡，阅读流断裂
- 明细表在存在时恢复成吸底分页列表，图表区和表格区像两张不同页
- 页面本地通过给共享卡片增加 `min-height`、重写描边或补内部假间距来“修”视觉，导致最终效果偏离典型页面模板
