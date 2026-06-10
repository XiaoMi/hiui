# 数据统计表

## 速览

- 何时读：已经判定为 `table-stat`，需要生成或验收统计列表页时
- 核心规则：指标卡、筛选、表格、分页必须继续留在同一个 `StatListPageFrame` 白底壳层
- 常见坑：把统计页退化成普通表格页，或因为样式失真临时补 `Card`

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `<figma-node-id>`

## 适用

- 顶部指标卡 + 筛选 + 表格
- 典型 `table-stat`

共享表格规则见 [`table-shared.md`](table-shared.md)。

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-stat-page/` 的 `StatListPageFrame` 和 `StatOverviewGrid`
- 外部项目必须参考 `examples/host-integration/src/pages/table-stat.tsx` 起步，但真实业务页要落在目标项目原有目录结构中，不要把模版页同步进 `src/typical-page-reuse/`
- 必须保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`
- 页头、指标卡、筛选、表格、分页必须继续留在同一个 `StatListPageFrame` 白底壳层里
- 筛选区必须直接使用真实 `hiui5/QueryFilter`；不要回退到宿主 schema 搜索壳、`searchConfig.fields`、`SearchForm`、`getSearchFields` 或手写 `Input + Select + DatePicker + Button` flex 行
- 若当前页直接手写 `QueryFilter.filterFields`，关键词搜索字段必须保持 `SearchInput` 语义，不要退化成普通白底 `Input`；至少保留 `filled` 外观和搜索前缀，确保搜索区视觉基线与示例一致
- `legacy-host-compatible` 也不能把 `stat-section` 退化成 `tabConfig`、状态 Tabs、纯数字摘要或普通标题栏计数；必须保留真实可见的指标卡区
- 宿主内容区必须给 `pro-stat-page` 一条可收口的高度链：内容列 / 路由出口至少满足 `display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`、必要时 `overflow: hidden`
- 页头与外槽背景 `#F5F8FC`
- 未被需求明确写出的页头内容一律禁止自行补充；默认只保留标题与右侧操作，不要额外添加副标题、说明文案、提示语或二级描述
- 页头默认复用真实 `PageHeader` 语义：返回入口必须落在 `back-button`，不能用普通 `Button` / `Link` 冒充；标题默认 `18px / 600`，页头可视高度默认 `60px`
- 主区白底从指标卡、筛选、表格一直铺到底部
- 主区白底禁止额外投影；应依靠单一白底主体、描边和分隔线建立层次，不要补 `box-shadow`
- 指标卡容器 `gap: 12`
- 单卡：白底 + `1px #EDEFF2` + 圆角 `8` + 内边距 `16`
- 默认只展示“名称 + 主值”，可选迷你图；没有书面依据不要加同环比
- `stat-section` 里的独立总览指标卡主数字默认使用 `24px / 32 / 600`；这是 `overview metric surface` 的默认 token，不要扩散到标题、摘要或其他正文信息
- 若 `table-stat` 内还存在列表卡、侧栏、本地摘要等嵌入式指标块，这些局部指标主值改用 `16px / 24 / 600`，不要把 `stat-section` 的总览 token 原样搬过去
- 有次要指标时：
  - 无迷你图：紧跟主值后，`gap: 8`，左对齐
  - 有迷你图：放到底部独占一行
- 指标名称必须单行省略 + Tooltip
- 指标名称与主数值之间不要再留竖向间距
- 筛选区 `padding: 16px 20px`，行内 `gap: 8`
- 行内筛选保留 HiUI5 `QueryFilter` 默认节奏：关键词搜索保持灰底 `SearchInput`，不要自行追加“查询”按钮；如有“全部筛选”，应使用 `FilterButton` 语义并保持在筛选区尾部
- 表格区水平 `padding: 0 20px`
- `Table` 中号、无斑马
- 分页区与同壳 `table-normal` 保持一致
- 分页必须位于同一个白底主体内部，不能掉到宿主灰底外部，也不能依赖宿主全局 footer 充当分页区
- 当表格内容区自滚动时，分页应作为同白底主体底部的吸底区存在；不要让分页跟随普通文档流掉出白底主体
- 行操作默认使用 HiUI5 蓝色 link 语义；不要退化成黑色 line/default 按钮
- 必须确认 `@hiui-design/typical-page-shells` 的样式资源已在目标项目中生效；否则指标卡会退化成普通文本、白底壳层也会丢失

## 统计页中插入图表

- `table-stat` 中新增图表时，页面主目标仍应首先是“指标卡 + 筛选 + 表格 + 分页”的统计列表阅读路径。
- 任何新增图表都必须遵循 `hiui-design` 图表规范；不要因为当前页不是 `data-visualization`，就回退到库默认 theme / palette / tooltip / legend。
- 图表若只作为统计页中的局部补充能力，可以保持 `table-stat` 身份；但图表若形成独立分析块，必须额外声明受管 `chart-section`。
- 独立 `chart-section` 仍需继续留在既有 `white-body` 内；不要为了安放图表再新增第二层页面级白底主体。
- 不要把 `Area` / `Line` / `Bar` 直接裸挂在通用白卡 children 上；图表应落在受管 chart body / approved chart carrier 中。
- 若页面主体已经变成“指标卡 + 多图表 + 明细表 / 明细分析区”，应升级为 `data-visualization`，不要继续停留在 `table-stat`。

### 当前项目覆盖：<legacy-host-project>

若当前仓库是 `<legacy-host-project>`，还必须额外遵守：

- 正式业务页只允许在旧宿主右侧内容区切换，不能生成新的一级导航或独立 layout
- `table-stat` 专章优先于“优先复用宿主 `PageTable`”的通用建议
- 只有当宿主基座能够完整承载 `header / white-body / stat-section / query-filter / table / pagination` 六个 region 时，才允许继续使用该基座
- 若宿主基座无法承载这些 region，就应直接在宿主内容区内翻译示例节奏，而不是把统计页降级成普通列表页
- isolated shell 只用于 baseline / smoke，不作为正式交付结果

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

## 禁止

- 不要绕开 `StatListPageFrame` 再手拼页头、白底壳、筛选区和表格高度链
- 不要把数据统计页退化成“灰底宿主 + 裸文本指标 + 一块普通表格”的通用列表页
- 不要把 `table-stat` 翻译成“普通列表 + 状态 Tabs”
- 不要手写 `Input + Select + DatePicker + 查询/重置按钮` 的筛选 flex 行冒充 `QueryFilter`
- 不要把宿主 schema 搜索壳、`searchConfig.fields`、`SearchForm` 或其他兼容桥当成 `QueryFilter` 替代品
- 不要在 direct `QueryFilter` 的关键词字段里塞一个普通 `Input` 就当成搜索框；这会把 HiUI5 默认灰底搜索语义改丢
- 不要把卡间距写成 `16`
- 不要把卡做成灰底填充卡
- 不要为了强调主值再发明 `20px`、`22px`、`28px`、`30px`、`32px` 等新字号；总览指标用 `24px / 32 / 600`，局部嵌入指标用 `16px / 24 / 600`
- 不要在页面根或 `ProListPage` 额外叠 `padding-right`
- 不要只在统计页单独改 `.hi-v5-table-footer`
- 不要让统计页 `queryFields` 与同壳普通列表分叉
- 不要看到指标卡无样式就临时补一层 `Card`、手写 border / radius；先排查包样式资源和宿主高度链
- 不要在 `QueryFilter.append` 里手工补“查询”主按钮打断默认节奏；若确需额外动作，必须先有明确书面设计依据
- 不要把“全部筛选”做成普通 outline/text 按钮后随意插入到字段中间；默认使用 `FilterButton` 语义并放在筛选尾部
- 不要把表格主白底做成带阴影的浮卡
- 不要把行操作写成 `type="line"` / 黑色文本按钮
- 不要把统计页中的独立图表分析块写成普通白卡子元素后绕开受管 `chart-section`
- 不要因为当前页仍是 `table-stat`，就让图表回退到库默认 theme、默认 palette 或手写图形 primitives
- 对 `<legacy-host-project>`，不要因为仓库里已有 `PageTable` 就默认把统计页落成 `PageTable` 变体
- 对 `<legacy-host-project>`，不要把 isolated shell 页面直接作为正式业务页接入旧宿主主树

## 自检

- 是否从 `table-stat.tsx` 起步，而不是从普通表格页或空白文件起步
- `stat-section` 是否是真实可见的指标卡区，而不是 tabs / summary text / titleExtra 计数
- 是否保留 `StatListPageFrame`、`StatOverviewGrid`、`proStatPageStyles.headerExtra`
- 指标卡样式是否是白卡 + 描边
- 指标卡是否不是“标题和数值直接散落在页面上”
- `stat-section` 指标卡主数字是否保持 `24px / 32 / 600`
- 是否默认未展示同环比
- 白底是否铺到底部
- 筛选是否是 `16 / 20`
- footer 是否与兄弟列表一致
- 页头、指标卡、筛选和表格之间是否没有贴边坍塌
- 样式资源和宿主高度链是否已确认正常
- 对 `<legacy-host-project>`，点击入口后是否表现为“旧宿主单层导航 + 右侧内容区切换”

## 失败信号

- 指标区只剩“名称 + 数值”纯文本，没有白卡、描边、圆角和 `12px` gap
- 指标卡主数字跑成了 `20px`、`22px`、`28px`、`30px`、`32px` 等新字号，或 `24px` 但没有 `600` 字重
- 页头与指标区、筛选区直接贴在一起，像普通文档流页面而不是典型页壳层
- 页头出现需求未描述的副标题、提示语，或返回入口退化成普通按钮
- 标题字号不是 `18px`，或返回入口没有落在 `PageHeader` back-button 语义上
- 主区白底没有从指标卡一直延伸到分页底部
- 主区白底出现额外投影，或分页没有作为白底主体底部吸底区存在
- 筛选区搜索框不是默认灰底，或出现了手工添加的“查询”按钮
- “全部筛选”按钮没有使用 `FilterButton` 语义并停在筛选尾部
- 行操作呈现为黑色文本/line 按钮，而不是蓝色 link 语义
- 表格区高度不收口，页面整体往下无限撑开，或分页和表格贴边错位
- 为了补样式开始在统计卡外层额外叠 `Card`、自定义灰底容器、额外 `padding-right`
