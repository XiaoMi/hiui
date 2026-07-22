# Page Contract Regions

这份文件是 `hiui-design` 页面 contract 字段的**唯一事实源**。

它负责：

- contract 最小字段
- region / ownership / semantic contract 的定义
- `shell inheritance strategy` / `shell carrier path` 的定义
- `header layout contract` 的定义
- `split pane contract` 的定义

它不负责：

- 首轮输出格式
- 组合页实现模板
- 验收证据

对应文档：

- 首轮输出格式：`../docs/generation/ai-kickoff-template.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 非典型 / overlay 布局事实：`../docs/generation/non-typical-pages.md`
- 验收证据：`validation-checklist.md`

其它文档应**引用**这里的字段，不要再平行维护第二套字段清单。

## contract 最小字段

每个 contract 至少包含：

- `example path`
- `region mapping`
- `ownership mode`
- `ownership mapping`
- `semantic contract`

当 `generationStrategy` 进入 `managed-fallback`、`translated-reference`、宿主 archetype / scaffold 起点时，还必须包含：

- `host archetype path`

当 `generationStrategy=page-component` 时，还必须包含：

- `page component id`
- `base mold id`
- `component certification ref`
- `runtime bridge profile id`（legacy bridge 场景）
- `instance validation status`
- `extension policy`（若使用受控扩展）

当 contract 声明 `header` region，或页级动作 owner 仍是 `PageHeader extra` 时，还必须包含：

- `header layout contract`

这些字段只记录组件实现与页面实例证据；`lockedRegions` / `editableSlots` 仍以 `base mold id` 指向的 `rules/page-mold-registry.json` 为准，不得在 contract 中平行维护第二套结构事实。`legacy-host-compatible` 的 page-component fast path 默认不再强制 `host archetype path`；只有计划显式退回 fallback / translated-reference 分支时，才重新要求 archetype provenance。

## example binding contract

- `example path` 是典型页生成的隐藏结构基线，不是展示页面、灵感链接或截图参考；命中典型页型后，contract 必须锁定唯一示例页，并把它作为页型、区域层级、壳层语义、关键节奏和 mandatory components 的结构事实源。
- 若页型声明 `requiredStartFromExample=true`，生成必须从机器计划里的受管 `startFrom` 起步：`page.template.tsx|jsx`、宿主 archetype、对应示例运行时骨架，或 `start-page` 的 reference / scaffold 分支。模板缺失不等于失败；只有没有任何受管模板、示例、宿主 archetype 或 scaffold 起点时才失败。任何情况下都不得回退到自由 scaffold。
- 业务页只允许替换示例里的业务槽位，例如标题、查询字段、表格列、表单字段、详情字段、接口函数和按钮文案。
- 页壳类型、关键 region 数量、region 嵌套关系、白底主体收口方式、主滚动 owner、分页 / footer 挂载语义和 shared 组件骨架不属于业务槽位，不能在业务页局部重写。
- `header layout contract` 也是页壳事实，不属于业务槽位；业务页不得通过局部 wrapper / style 抢走
  `header` 的 stretch、right-dock 或 vertical rhythm owner。
- 若当前模式不能直接挂标准壳组件，必须通过 `shell inheritance strategy` 与 `shell carrier path` 把示例壳翻译到命名 shared shell / host adapter 上。
- 不允许仅凭 comment、`data-hiui5-region`、变量名或截图相似度声称“来自示例”；源码必须能证明直接挂了标准壳，或挂了命名 shell carrier。
- `rules-only` 下 reference 可以定义结构，但不能拥有路由；生成页必须同时在 contract 中证明 `route owner` / `menu group` 属于宿主业务结构，不能把 reference、gallery route 或 `src/typical-page-reuse/**` 当作业务页交付路径。
- `rules-only` / `legacy-host-compatible` 的详细示例对齐流程看 `../docs/generation/rules-only-example-alignment.md`；本节只定义 contract 层的不变量。

对 `rules-only` 下的 `table-basic` / `table-stat` / `data-visualization` / `tree-table`，还必须额外包含：

- `shell inheritance strategy`
- `shell carrier path`

命中“左列表右详情 / 左树右表 / 主从布局 + 右侧表格”且左右栏需要独立滚动的组合页时，还必须额外包含：

- `split pane contract`

## shell inheritance contract

- `shell inheritance strategy` 只允许回答：`直接挂标准页壳`、`共享骨架 helper 翻译`、`宿主适配骨架翻译`
- `shell carrier path` 必须回答真实运行时结构链，至少说明 `header`、`query-filter`、`table` / `chart-section`、`pagination` 到底挂在哪个 shared shell / helper / host slot 下
- 若结构链包含 `header`，`shell carrier path` 只能回答“页头挂在哪”；它本身不能单独证明
  `PageHeader` root 已 stretch、`extra` 已 right-docked 或 `60px` 节奏 owner 正确，仍必须补
  `header layout contract`
- 这条要求不只适用于列表 / 统计 / 可视化壳；若页面声明 `layout archetype = context-main-split`，也必须能回答 split 壳到底由谁承接
- 不允许只写“复用 `PageHeader` / `Table` / `Pagination` 组件”，却不回答这些区域是不是仍然挂在同一个 runtime shell carrier 上
- 不允许只在 comment、contract label、变量名里声明 `shell=StatListPageFrame` 一类标签，却不提供运行时承接路径
- 若页面直接挂标准页壳，`shell carrier path` 应指向真实页壳文件或受管壳组件
- 若页面走共享骨架 helper / 宿主适配翻译，`shell carrier path` 应指向实际承接 `PageHeader`、控制区、图表区、表格区和分页区的 helper / host bridge / content slot 结构链
- 这些字段只解决“运行时骨架由谁承接”；它们不替代 `region mapping`、`ownership mapping` 或 `semantic contract`

## header layout contract

- 只要 contract 声明 `header` region，或页级动作仍通过 `PageHeader extra` 暴露，就必须声明
  `headerLayoutContract`
- `headerLayoutContract` 至少回答：
  - `header carrier owner`
  - `header stretch owner`
  - `header actions docking`
  - `header vertical rhythm owner`
  - `header business slots`
  - `header forbidden local overrides`
  - `header layout evidence`
- `header actions docking` 的默认事实应是 `PageHeader.extra right-docked`；若页面没有页级动作，可显式回答
  `not-applicable`，但不能省略字段
- `header business slots` 默认只允许 `title`、`onBack`、`extra`、`statusText` 这类业务内容；
  不允许开放 `renderAnything`、自定义 flex 壳或二次布局入口
- `header forbidden local overrides` 至少应覆盖：`page-header-geometry`、
  `hi-v5-page-header-skeleton`、`local-header-flex-shell`、`button-height-follows-header`
- `header layout evidence` 必须能回指真实证明来源，例如 component certification、
  host facts、runtime smoke selector 或 shared shell 文件；“已使用 `PageHeader`”本身不是证据
- 若 `header stretch owner` 不属于 shared shell / host slot / certified page component，
  则当前页不能宣称自己仍在“只填业务槽位”的主链路里
- `60px` 页头节奏必须由 `header vertical rhythm owner` 承接；不得把这条节奏回写到
  `PageHeader` 根节点、页级按钮高度或业务页局部 wrapper 上

## shell inheritance source marker normalization

- contract 里的 `shell inheritance strategy` 继续只使用上面的中文值域，不要把源码 marker 的 slug 直接写回 contract
- 若要把这条事实同步到源码 comment / `data-*` marker，统一按下面映射序列化：
  - `直接挂标准页壳` -> `direct-shell-runtime`
  - `共享骨架 helper 翻译` -> `shared-shell-carrier`
  - `宿主适配骨架翻译` -> `host-translated-shell`
- 这些 slug 只服务 source marker / source gate，对 contract 来说它们不是第二套值域
- 同理，不要把中文 contract 值直接塞进 `data-hiui5-shell-inheritance`；源码 marker 只写归一化 slug

## 通用 structural guard

- 唯一示例页
- 唯一宿主 archetype
- 唯一主工作区
- 关键区域完整
- 禁止示例外新增主容器、主滚动容器或额外白底主体

若 contract 缺关键 region，说明页面还没有完成结构对齐，不能进入“示例一致”状态。

## 按页型要求的 region

- `table-basic` / `tree-table`
  `header`、`white-body`、`query-filter`、`table`、`pagination`
- `table-stat`
  `header`、`white-body`、`stat-section`、`query-filter`、`table`、`pagination`
- `tree-split`
  `header`、`split-workspace`、`left-tree`、`right-list`、`query-filter`、`table`、`pagination`
- `drawer-form`
  `header`、`drawer-body`、`form-body`、`drawer-footer`、`footer-actions`
- `drawer-detail`
  `header`、`drawer-body`、`detail-body`、`drawer-footer`
- `full-page-edit`
  `header`、`header-leading`、`header-actions`、`white-body`、`form-body`、`footer`、`footer-actions`
- `full-page-detail`
  `header`、`white-body`、`detail-body`

## non-typical / overlay contract facts

非典型 / overlay 页面只说明“不能直接套典型页默认组织”，不说明“必须采用某个固定区块”。contract 必须记录策略事实，而不是固定 region 清单。

必填事实：

- `layoutStrategy`：与 source marker `hiui-design layout-strategy:` 和 runtime `data-hiui5-layout-strategy` 一致。
- `layoutArchetype`：与 source marker `hiui-design layout archetype:` 或 runtime `data-hiui5-layout-group` 一致。
- `nonTypicalScope`：描述非典型自由编排只发生在哪些业务内容区，不得包含 header / shell / white-body / main-scroll 等 carrier-critical region。
- `compositionGuardrails`：声明哪些 carrier 锁定、哪些槽位可编辑、哪些 HiUI 组件骨架不得本地重写。
- `strategyEvidence`：声明源码和运行时可验证的 marker / 语义组件 / 一级分组证据。

校验口径：

- 只有 `topology=non-typical-overlay` 但没有上述策略事实时，contract 不完整。
- 不要求固定出现 `summary-section`、`detail-main`、`side-actions`；这些只能作为某个 layout strategy 的证据。
- 若 strategy evidence 与实际源码 / runtime marker 对不上，必须回到计划或 contract 阶段修正，不得用自然语言解释为通过。

## 全局图表规范适用范围

- 任何页面中新增的图表，都必须遵循 `hiui-design` 的数据可视化规范。
- 这条规则不以 `page type = data-visualization` 为前提。
- 这条规则也不以是否声明 `chart-section` 为前提。
- 只要页面实际渲染图表，就必须继续使用正式图表栈、共享 HiUI chart baseline、共享 color contract，以及图表标题 / tooltip / legend / 时间维度文案的 formatter；若 `i18nMode=full`，再执行完整 i18n 基线。
- `chart-section` 只负责结构治理、region 显式声明与更强的 ownership / source gate 校验；它不是图表规范生效开关。

## 独立图表区判定口径

- 满足任一条件时，当前图表应升级为受管 `chart-section`：
  - 图表回答独立业务问题，而不是字段值、指标卡或描述项的轻量视觉辅助
  - 图表可以被单独命名为一个分析块，并在阅读路径上独立于字段区 / 表格区 / 指标区
  - 图表已经形成独立 section、独立标题或独立 card body，且需要单独布局治理
  - 图表与相邻内容之间已经出现明确的 section 边界，而不再只是卡片内部的附属元素
- 默认不升级为 `chart-section` 的场景：
  - 指标卡内的迷你趋势图或 sparkline
  - 只服务字段值理解的轻量图示
  - 不承担独立阅读任务的装饰性或附属性图形
- 若页面主体已经变成“指标卡 + 多图表 + 明细表 / 明细分析区”，则不再按“原页型 + 图表补充区”处理，应升级为 `data-visualization`。

## 图表补充区追加规则

- 任意页型只要实际包含图表区，都必须在现有页型 region 之外额外声明 `chart-section`
- 这条规则不只适用于 `data-visualization`；`table-stat`、`full-page-detail`、经营看板型详情页或其它带图表补充区的受管页同样适用
- `chart-section` 一旦出现在 contract 中，源码必须同步暴露 `data-hiui5-region="chart-section"`，以便 source gate 对图表技术栈做统一校验

## chart-section grid consistency

- `chart-section` 的图表布局只允许一种基础栏数模式：`two-column`、`three-column`、`four-column`
- `12` 只表示 neutral `full-span`，不构成基础栏数模式切换
- 同一 `chart-section` 内不得混用 `6/6 + 4/4/4`、`4/4/4 + 3/3/3/3` 一类多模式排布
- 这条规则只作用于 `chart-section` 中承担独立分析任务的数据图表
- `stat-section` 中的指标卡、指标卡里的 `sparkline / mini trend / mini chart` 不纳入 `chart-section` 的 mode / span / mixed-mode 校验
- contract 若声明 `chart-section`，建议同时落盘：
  - `chart-section base grid mode`
  - `chart-section consistency scope`
  - `chart-section full-span policy`
  - `chart-section scope = chart-section-only`
  - `chart-section excludes stat-section metrics`

## semantic contract

- `semantic contract` 至少声明：`query-filter region role`、`dimension switch control`、`control scope`、`control strip placement`、`control strip visual treatment`、`detail query-filter policy`、`mixed-scope controls`、`list shell composition`、`spacing ownership`
- 当页面存在真实 `QueryFilter` 时，`semantic contract` 还应显式回答：
  - `query field render profile`
  - `keyword field role`
  - `text field role`
  - `select/date field surface policy`
  - `filter surface baseline`
- 对 `full-page-edit`、`drawer-form`、`drawer-detail`、`full-page-detail`，`semantic contract` 还必须包含 `bodySectionContract`
- `bodySectionContract` 只回答 body 一级信息组织事实，不回答页壳事实；页壳、滚动链、白底主体、footer / drawer-footer 挂载关系仍由 `region mapping`、`ownership mapping`、`page component` / `base mold id` 负责
- `bodySectionContract` 至少回答：
  - `primaryExpression`
  - `sectionComposition`
  - `sectionSpacingOwnership`
  - `sectionContainerPolicy`
  - `embeddedWidgetPolicy`
- `primaryExpression` 只允许：`form-schema`、`descriptions`、`not-applicable`
- `sectionComposition` 只允许：`groups-only`、`groups-with-inline-help`、`groups-with-supporting-sections`、`mixed-unapproved`、`not-applicable`
- `sectionSpacingOwnership` 只允许：`section-structure`、`form-item`、`descriptions-group`、`field-local-wrapper`、`not-applicable`
- `sectionContainerPolicy` 只允许：`flat-section-only`、`approved-card-section`、`no-extra-panel-shell`、`not-applicable`
- `embeddedWidgetPolicy` 只允许：`none`、`section-toolbar`、`simple-table`、`readonly-chart-summary`、`media-row`、`declared-local-widget`、`not-applicable`
- `full-page-edit` / `drawer-form` 默认写成：
  - `primaryExpression = form-schema`
  - `sectionComposition = groups-only`
  - `sectionSpacingOwnership = section-structure`
  - `sectionContainerPolicy = flat-section-only`
  - `embeddedWidgetPolicy = none`
- `drawer-detail` / `full-page-detail` 默认写成：
  - `primaryExpression = descriptions`
  - `sectionComposition = groups-only`
  - `sectionSpacingOwnership = descriptions-group`
  - `sectionContainerPolicy = flat-section-only`
  - `embeddedWidgetPolicy = none`
- 当 body 内出现独立支持区、只读摘要表、媒体行或其它一级 section 时，必须显式提升 `sectionComposition` / `embeddedWidgetPolicy`；不要继续让 source gate 和 preflight 只靠页型默认值猜
- `data-visualization` 默认必须写成：
  - `query-filter region role = dashboard-control-strip`
  - `dimension switch control = segmented-radio-tabs`
  - `control scope = page-global`
  - `control strip placement = top-of-white-body-before-stat-section`
  - `control strip visual treatment = plain-row-no-panel`
  - `detail query-filter policy = separate-detail-query-filter-near-detail-table`
  - `mixed-scope controls = forbid-shared-control-row`
  - `list shell composition = forbid-table-list-scaffold`
  - `spacing ownership = single-owner`
  - `chart-section grid consistency = single-mode-per-chart-section`
  - `chart-section full-span policy = 12-is-neutral-span`
  - `chart-section metric exclusion = stat-section metrics excluded`
- `table-basic` / `table-stat` / `tree-table` / `tree-split` 默认 `query-filter region role = table-query-filter`
- `table-basic` / `table-stat` / `tree-table` / `tree-split` 若存在真实 `QueryFilter`，默认还应写成：
  - `query field render profile = shared-query-filter-skin`
  - `keyword field role = search-input`
  - `text field role = filter-text-input`
  - `select/date field surface policy = shared-query-filter-surface`
  - `filter surface baseline = query-filter-contained-shared-surface`
- 当 `query-filter region role = dashboard-control-strip` 时，当前 region 的真实语义是页面维度/视图切换，不得为了过 contract 把它回写成真实 `QueryFilter`
- 当 `control scope = page-global` 时，当前控制区必须影响 `stat-section + chart-section + detail-table` 的阅读状态，默认放在主体白底最上方且先于 `stat-section`；不要再把它降成表格检索栏或 chart card 局部工具条
- 当页面确实存在明细检索条件时，真实 `QueryFilter` 必须与 detail/table 绑定；默认遵循 `detail query-filter policy = separate-detail-query-filter-near-detail-table`，不要和 `dashboard-control-strip` 混排在同一行
- `mixed-scope controls = forbid-shared-control-row` 表示页面全局视角切换与明细数据筛选不得共用一条控制行、共用一组字段语义或共用一个灰底查询面板
- `control strip visual treatment = plain-row-no-panel` 表示 `dashboard-control-strip` 只能呈现为主体白底中的独立平铺控制行，不得包成整块灰底 panel / query shell
- `query field render profile = shared-query-filter-skin` 表示 `QueryFilter` 内的关键词搜索、普通文本筛选、选择器和日期类字段共享同一筛选皮肤基线；它约束的是一致皮肤，不等于“所有文本字段都直接复用搜索框组件”。
- `keyword field role = search-input` 表示关键词位继续保留搜索图标、filled 搜索语义与 clearable 行为。
- `text field role = filter-text-input` 表示普通文本筛选字段必须使用与关键词搜索同皮肤、但语义独立的受管筛选输入角色；不得静默回退为裸 `Input`，也不得冒充第二个搜索入口。
- `select/date field surface policy = shared-query-filter-surface` 表示 `Select` / `DatePicker` 等字段仍需与文本筛选位共享筛选容器皮肤，不得出现“关键词搜索灰底、其它字段白底”的混搭。
- `filter surface baseline = query-filter-contained-shared-surface` 表示 contract 不再只证明“页面用了真实 QueryFilter”，还要证明 `QueryFilter` 内字段最终落成共享筛选表面；若当前共享组件存在能力缺口，必须在 contract / waiver / fallback 中显式记录，不得默默放过。
- 若统计页确实把一条真实 `QueryFilter` 提升为受管 region，必须显式改 contract；不要让 source gate 继续靠页型默认值猜

## split pane contract

- 若页面属于“左列表/树 + 右侧详情/表格”的 split master-detail，且左右栏需要独立滚动，contract 必须显式写出 `splitPaneContract`
- `splitPaneContract` 至少声明：
  - `pane resize`
  - `resize handle selector`
  - `left pane selector`
  - `right pane selector`
  - `table region selector`
  - `left pane scroll`
  - `right pane scroll`
- 对 `context-main-split`，默认要求 `pane resize = user-resizable`；左栏默认宽度只能回答初始值，不得被 contract 解释成不可变死宽
- 对 `tree-split`，默认要求 `left pane scroll = independent-pane-scroll`、`right pane scroll = independent-pane-scroll`
- 对所有“左列表/树/卡片 + 右侧详情/表格”的 split master-detail，左右栏独立滚动不再只是个别页面约定，而是默认 contract；若要退回单滚动链，必须有显式书面例外
- `split workspace` 默认不是纵向滚动 owner；左右栏自己的滚动责任不得继续停留在隐式样式或浏览器默认行为里
- `table region selector` 只负责标出业务表格区；若横向滚动发生，它也必须继续收口在表格内部 wrapper，而不是把 `split workspace`、`right pane` 或页面主体横向撑破
- 不要只写页面级 `main-scroll owner`，却让左右栏的真实滚动责任继续停留在隐式样式或浏览器默认行为里
- 不要把 `splitPaneContract` 误当成 split 壳复用证据；对 `context-main-split`，还要能回答 `shell inheritance strategy` 与 `shell carrier path`
- 只要 `splitPaneContract` 声明为左右栏独立滚动，当前页就必须补一次真实浏览器 runtime smoke；静态 `doctor` 不能替代这类 DOM 行为校验

## ownership guard

- `content-slot / white-body / outer-padding / main-scroll` 必须有唯一拥有者
- 不允许宿主 content slot 和页面 `white-body` 同时拥有外层 `padding / background / radius / overflow`
- `ownership mapping` 必须显式写出 `content-slot owner`、`white-body owner`、`outer-padding owner`、`main-scroll owner`
- 推荐只使用固定枚举值：`host-slot | page-root | white-body | section-root | main-content-outlet | none`
- `ownership mapping` 不只检查字段存在，还必须检查组合语义是否连续；若 `content-slot` 与 `main-scroll` 已由 `host-slot` 承接，`outer-padding` 默认也必须由 `host-slot` 承接，除非页面同时声明并证明自己接管了连续 `white-body / page-surface` 主体
- `host-slot-shell` 组合：`content-slot=host-slot`、`outer-padding=host-slot`、`main-scroll=host-slot`、`white-body=none | host-slot`；此时业务页根节点只能承接布局填充，不得承接 page-level `padding / background / border-radius / overflow:auto|scroll`
- `page-surface-shell` 组合：业务页需要自行承接外层 padding 时，`outer-padding` 必须与 `white-body` 或 `page-root` 同向，并形成连续白底主体；不得出现“宿主滚动 + pageRoot padding + 内层卡片 padding”的三段式节奏
- `section-only-composition` 组合：宿主承接内容槽、外层留白和滚动，业务页只有一级分组与局部 section/card；局部 spacing 只能发生在 `section-body / card-body / metric-grid / table-body` 等真实内容容器
- 若 `outer-padding owner` 与 `white-body owner` 位于两个不同页面局部 wrapper 上，且两者都承接横向留白或主体白底，直接按 ownership 映射失败处理
- 若 `white-body owner` 已承接页面级 `padding / gap`，一级 region wrapper 不得再叠加第二层 `16px+` 通用节奏；局部 spacing 只能落在真实内容容器，如卡片 body、指标网格、表格头、图表卡内部
- 不允许把局部 region 的 spacing 晋升成页面壳层 padding；若 contract 无法说明某一层 `padding-left/right` 属于 `outer-padding` 还是局部 region，按未完成结构对齐处理
- 对非典型页面，若页面局部出现 `workspace`、`container`、`shell`、`body` 一类泛化容器名，contract 必须明确它是否就是 `white-body owner`；若不是，默认不得让它承接 `padding / background / border-radius / overflow`
- 若 `full-page-detail` 使用 `ProDetailPage`，允许 `main-scroll` 等外层 ownership 由壳组件内部实现；contract 仍要记录 owner 映射，但页面源码不应为了补 anchor 再复制第二套壳层
- 不能只写 `header + main + footer` 这类模糊映射

## 编辑页补充 guard

- `drawer-form` 的 `footer-actions` 必须落在 `drawer-footer` 内部，而不是散落到 `drawer-body` 末尾
- `full-page-edit` 的 `header-leading` 必须承接返回语义，不能把返回动作降级到 `header-actions`
- `full-page-detail` 若存在明确返回路径，必须优先由共享 `PageHeader` 的 leading `onBack` 承接；不要把返回语义改写成 `header-actions` 里的右侧按钮，或同时保留 leading + 右侧重复返回
- `full-page-edit` 的 `footer-actions` 必须落在 archetype footer 内并保持右对齐，不能回退到通用 `Layout.footer` 或滚动区内部

## 推荐命令

```bash
npm run typical-page:finalize-page -- \
  --page-type <page-type-id> \
  --page <generated-page-path> \
  --archetype <host-archetype-path> \
  --ownership-mode <host-slot-owns-workspace|page-surface-owns-workspace>
```

若页面刚开始生成，先用 `typical-page:start-page` 产出 started contract 和 source scaffold；不要只写 contract 就把页面视为完成。
