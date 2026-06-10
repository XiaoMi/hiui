# Page Contract Regions

这份文件是 `hiui-design` 页面 contract 字段的**唯一事实源**。

它负责：

- contract 最小字段
- region / ownership / semantic contract 的定义
- `shell inheritance strategy` / `shell carrier path` 的定义
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
- `host archetype path`
- `region mapping`
- `ownership mode`
- `ownership mapping`
- `semantic contract`

## example binding contract

- `example path` 是典型页生成的结构事实源，不是灵感链接；命中典型页型后，contract 必须锁定唯一示例页。
- 若页型声明 `requiredStartFromExample=true`，生成必须从该页型绑定的 `page.template.tsx|jsx` 或对应示例运行时骨架起步；模板缺失时应失败，而不是回退到自由 scaffold。
- 业务页只允许替换示例里的业务槽位，例如标题、查询字段、表格列、表单字段、详情字段、接口函数和按钮文案。
- 页壳类型、关键 region 数量、region 嵌套关系、白底主体收口方式、主滚动 owner、分页 / footer 挂载语义和 shared 组件骨架不属于业务槽位，不能在业务页局部重写。
- 若当前模式不能直接挂标准壳组件，必须通过 `shell inheritance strategy` 与 `shell carrier path` 把示例壳翻译到命名 shared shell / host adapter 上。
- 不允许仅凭 comment、`data-hiui5-region`、变量名或截图相似度声称“来自示例”；源码必须能证明直接挂了标准壳，或挂了命名 shell carrier。
- `rules-only` / `legacy-host-compatible` 的详细示例对齐流程看 `../docs/generation/rules-only-example-alignment.md`；本节只定义 contract 层的不变量。

对 `rules-only` 下的 `table-basic` / `table-stat` / `data-visualization` / `tree-table`，还必须额外包含：

- `shell inheritance strategy`
- `shell carrier path`

命中“左列表右详情 / 左树右表 / 主从布局 + 右侧表格”且左右栏需要独立滚动的组合页时，还必须额外包含：

- `split pane contract`

## shell inheritance contract

- `shell inheritance strategy` 只允许回答：`直接挂标准页壳`、`共享骨架 helper 翻译`、`宿主适配骨架翻译`
- `shell carrier path` 必须回答真实运行时结构链，至少说明 `header`、`query-filter`、`table` / `chart-section`、`pagination` 到底挂在哪个 shared shell / helper / host slot 下
- 这条要求不只适用于列表 / 统计 / 可视化壳；若页面声明 `layout archetype = context-main-split`，也必须能回答 split 壳到底由谁承接
- 不允许只写“复用 `PageHeader` / `Table` / `Pagination` 组件”，却不回答这些区域是不是仍然挂在同一个 runtime shell carrier 上
- 不允许只在 comment、contract label、变量名里声明 `shell=StatListPageFrame` 一类标签，却不提供运行时承接路径
- 若页面直接挂标准页壳，`shell carrier path` 应指向真实页壳文件或受管壳组件
- 若页面走共享骨架 helper / 宿主适配翻译，`shell carrier path` 应指向实际承接 `PageHeader`、控制区、图表区、表格区和分页区的 helper / host bridge / content slot 结构链
- 这些字段只解决“运行时骨架由谁承接”；它们不替代 `region mapping`、`ownership mapping` 或 `semantic contract`

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

## 全局图表规范适用范围

- 任何页面中新增的图表，都必须遵循 `hiui-design` 的数据可视化规范。
- 这条规则不以 `page type = data-visualization` 为前提。
- 这条规则也不以是否声明 `chart-section` 为前提。
- 只要页面实际渲染图表，就必须继续使用正式图表栈、共享 HiUI chart baseline、共享 color contract，以及图表标题 / tooltip / legend / 时间维度文案的 formatter 与 i18n 基线。
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

## semantic contract

- `semantic contract` 至少声明：`query-filter region role`、`dimension switch control`、`list shell composition`、`spacing ownership`
- `data-visualization` 默认必须写成：
  - `query-filter region role = dashboard-control-strip`
  - `dimension switch control = segmented-radio-tabs`
  - `list shell composition = forbid-table-list-scaffold`
  - `spacing ownership = single-owner`
- `table-basic` / `table-stat` / `tree-table` / `tree-split` 默认 `query-filter region role = table-query-filter`
- 当 `query-filter region role = dashboard-control-strip` 时，当前 region 的真实语义是页面维度/视图切换，不得为了过 contract 把它回写成真实 `QueryFilter`
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
