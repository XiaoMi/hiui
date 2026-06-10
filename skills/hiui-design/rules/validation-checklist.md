# 验收门槛

这份文件只保留**页面质量验收证据**与**页面完成门槛**。

它不负责：

- 重复首轮输出字段
- 重复 contract 字段定义
- 重复组合页实现模板
- 重复“编码前应该先写什么”
- 定义最终回复前的统计收口动作

对应事实源如下：

- 首轮输出格式：`../docs/generation/ai-kickoff-template.md`
- 生成原则与阶段门槛：`generation-rules.md`
- contract 字段：`contract-regions.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 最终回复前统计收口：`PRIVACY.md`

布局相关的跨页型误区，统一额外对照 `../docs/generation/layout-anti-patterns.md`。

## 宿主层证据

- 项目画像与接入模式一致
- 已提供 `TypicalPageHostProvider` 所需 header / footer 挂载点
- 典型页所在内容列满足连续高度链：`flex`、`min-height: 0`，必要时 `overflow: hidden`
- `@hiui-design/typical-page-shells` 样式资源已正常生效
- 若为已有系统，模板页面没有整包同步进正式 `src/`
- 若左侧导航由 `TypicalPageAppFrame` 驱动，一级菜单分组都显式带语义化 `icon`
- 若 `host-integration` 保留同步典型页 gallery，`TypicalPageAppFrame routes` 必须传宿主级菜单树；禁止裸传 `typicalPageReuseRoutes`
- 同步典型页 gallery 必须由同一个顶层 `示例` route group 同时服务 `useRoutes()` 与 `TypicalPageAppFrame`
- 同步典型页 gallery 的 route config 只允许导入 `src/typical-page-reuse/**` 下的示例页；真实业务页必须挂在宿主业务 route group，不能通过 `../../pages/*` 进入 `示例`
- `表格` / `图表` / `表单` / `详情` / `异常` 只能作为 `示例` 的二级菜单，不得作为 `TypicalPageAppFrame` 的一级菜单
- 左侧一级菜单 icon 统一使用面型图标；不要为一级菜单分组使用 `Outlined` / 线型 icon
- 左侧一级菜单 icon 必须随菜单语义区分；不得多个一级菜单复用同一个占位 icon，且非 `示例` 菜单不得继续使用 `AppStoreFilled`
- 若顶层已经挂 `TypicalPageAppFrame`，业务路由 element 与业务页面源码都不再引入 `ExampleAppShell`，也不在 `src/typical-page-reuse/**` 之外重建第二套 host provider

## Contract / Workflow 证据

- 当前页 contract 已落盘且可被工具正常解析
- `rules-only` / `legacy-host-compatible` 当前页已通过 `typical-page:start-page` 进入受管流程
- 当前页若在上一次 finalize 后继续发生源码变化，已经基于**最新源码**重新执行一次 `typical-page:finalize-page`
- `.local-context/hiui-design/outputs/managed-pages.index.{json,md}` 与当前受管页源码、contract 保持一致
- 当前页的 `source gate`、`doctor` 已通过
- `doctor PASS` 未被误当成替代 `finalize-page` 的完成信号

## 页面结构证据

- 页面使用固定页壳，而不是手拼壳层
- 菜单标题与 `PageHeader title` 一致
- 不存在双层主工作区、双层外层留白或双滚动容器
- 不存在“标题下方大段空白 / 页面整体下推”这类双宿主症状
- 若在 DevTools 中看到宿主 content slot、页面根、局部 `white-body` / `section-root` 三层同时持有 `padding / background / border-radius / overflow`，按结构失败处理
- 若页面声明 `host-slot-shell` 或等价 owner 组合，DevTools 中业务页根节点只能表现为布局填充层；若它同时持有 page-level padding、非透明背景、圆角或 `overflow:auto|scroll`，按结构失败处理
- 受管业务页不得包含 `PromptCopyFloatingButton`、`examplePrompt`、`typicalExamplePrompts` 或从示例 gallery 继承的“复制提示词”页头动作；这些只属于示例浏览器快捷入口
- 不存在由 `grid` / `flex` 默认 `stretch` 引起的等高误拉伸；卡片、图表区、详情区、时间线区都按内容自然高度收口

## 非典型 / Overlay 证据

命中非典型页面或 overlay 布局判断时，至少具备：

- kickoff 已显式写出 `layout strategy`、`non-typical scope`、`layout archetype`（若命中）与 `composition guardrails`
- 当所需组件超出 `hiui-v5-quick-reference.md` 覆盖范围时，kickoff 已显式写出 `primary semantic components`、`rejected alternatives`、`why not custom container` 与 `import path discipline`
- source contract 中的非典型 / overlay 布局事实已落盘
- root marker、owner marker、group marker、必要时的 region / span marker 已落盘
- `content-slot / white-body / outer-padding / main-scroll` owner 声明完整且互不冲突
- 若 `layout archetype = context-main-split`，运行时已暴露 `data-hiui5-layout-group="context-main-split"`，并补齐 `left-context` / `right-main` region marker
- 若 `layout archetype = context-main-split`，已明确落盘 `split shell inheritance strategy` 与 `split shell carrier path`，并能在源码里看到受管 split carrier 或等价 shell-carrier marker
- `context-main-split` 没有退化成 `ProDetailPage` / `ProEditPage` / 通用 page-scroll 壳 + 自定义 `workspace / leftPane / rightPane`
- 若 `primary-secondary` 后方仍有同级通栏主内容，分栏区已先完成视觉闭合，再进入下一块通栏内容
- 若 overlay 发生在 `data-visualization` 等典型页型中，原页型的 page shell、mandatory components、`chart-section` 与技术栈要求仍然保持
- 非典型页面的 `base archetype` 仍可被源码和 contract 识别；页面没有退化成“自由业务页”
- 非典型页面的自由拼装只发生在一级分组层；`Descriptions`、`Timeline`、`Table`、shared chart helper 等主表达没有被自定义容器替代
- 若 `layout archetype = context-main-split`，右栏复杂信息只发生在 `right-main` 内部 section；split 壳 ownership 没有被业务页改写
- 若 `base archetype` 已提供共享页头 carrier，非典型页面仍复用同一条页头承接链；不存在业务页自建第二套标题壳或白条 header 占位
- 若页面存在返回路径，返回语义仍落在 leading `onBack`；右侧 action 不重复放“返回列表 / 返回上一页”这类回退按钮
- 若标题下存在紧邻对象标题的补充元信息，它仍表现为紧凑次要信息带 / meta row，而不是被误翻译成 `Descriptions` 或几列手写字段网格
- page-level spacing owner 唯一；不存在把 `20` 分散给多个自定义 section 的情况
- 若页面挂载 `FixedDashboardPageFrame`、`ManagedWorkbenchPageFrame` 或同类 shared shell，页面源码没有再通过 `pageRootStyle`、`whiteBodyStyle`、或带 `style` 的 shell props 改写共享壳层几何
- 对 `data-visualization`，主体白色背景仍由既定 `white-body` 连续承接；业务页没有新增第二层页面级白底主体
- 页面主体外圈留白仍由既定 owner 承接；业务 JSX 没有通过额外 wrapper 重新分发 page-level padding
- 图表区、指标区、明细区的描边与圆角停留在 section / card 内部，没有提升成主体白色骨架的统一描边框

## 国际化证据

- 页面标题、按钮文案、列标题、字段 label、placeholder、反馈文案、图表标题来自 locale 资源或上游 bridge，而不是直接硬编码
- 日期、时间、数字、金额、百分比、排序与大小写处理走 locale-aware formatter / API
- 页面未继续使用物理方向属性 `margin-left/right`、`padding-left/right`、`border-left/right`、`left/right`、`text-align:left/right`
- 若支持 `ar-SA`，页面根方向、抽屉方向、浮层对齐与文本顺序已随 `dir="rtl"` 正常切换
- `de-DE / th-TH / ar-SA` 的长文本没有撑坏页头、表头、按钮、字段管理项、详情主信息与表单栅格；必要位置已补 `ellipsis + tooltip`

## 组件继承证据

- 命中 HiUI 已有语义组件的区域，真实复用了现成组件，而不是手写等价 DOM
- 风险/状态类标签复用 `Tag` 或 shared status renderer；不存在业务页手写 `span + 胶囊背景色`
- 可点击的状态筛选若本质仍是状态语义切换，继续复用 `Tag` / shared status renderer，并在交互层补 click / keyboard；不要因为“可点击”就回退成 `Button`
- `PageHeader`、`QueryFilter`、`Table`、`Descriptions`、`Timeline`、`Empty`、`Progress`、`Steps` 的骨架层没有被业务页重写成另一套结构
- 业务页没有通过 `classNames`、`styles`、slot semantic override 或本地 `.hi-v5-*` 选择器去改 `PageHeader`、`Descriptions`、`Timeline`、`Table` 等公共组件骨架
- detail-shell 的 vertical `Descriptions` 没有依赖隐藏默认值；关键布局不变量在源码边界显式冻结，而不是靠浏览器默认 `th` 行为或第三方 bridge 默认值碰巧成立
- 若页面使用 `SchemaDescriptionsBridge`，已显式写出 `labelPlacement: 'left'`，并清空 bridge 继承的固定 `labelWidth`；没有把 left 对齐修补下放到页面级 CSS
- `ProDetailPage`、`ProListPageProvider`、`ProDetailPageProvider` 等页壳运行时要求仍被满足；不存在只保留外观、漏掉 provider / context 链的实现
- 若存在绕开现成组件的实现，结果中已有明确的书面 bypass 原因
- 若存在绕开现成组件的实现，源码中能看到明确的 adapter / bridge 承接层；第三方组件没有散落在页面根、共享 shell 或多个一级分组边界上
- 若存在绕开现成组件的实现，第三方组件的可见 palette、字号、圆角、阴影和 surface 层级已通过 HiUI token bridge 收口；没有把库默认 theme 直接暴露到业务页
- 若存在绕开现成组件的实现，第三方组件没有接管 `outer-padding`、`white-body`、`main-scroll` 或共享页头 ownership，也没有替换本应保留的 mandatory components

## 表格类证据

命中 `table-basic`、`tree-table`、`tree-split`、`table-stat` 或任何“右侧表格工作区”时，至少具备：

- 行内筛选真实使用 `QueryFilter`
- 全部筛选真实使用 `FilterDrawer`
- 真实预览中能看到关键词搜索框、至少一个筛选控件、`全部筛选` 与 `重置`
- split 左栏若直接使用 `SearchInput`，真实预览中搜索框已贴合 pane 宽度；没有暴露组件默认固定宽度导致的“搜索框未贴满左栏”
- 不存在手工追加的“查询”主按钮
- 没有回退到 schema 搜索壳、`searchConfig.fields`、`SearchForm`、`getSearchFields` 或手写筛选栏
- `Table` 默认开启 `resizable`
- `Table` 默认开启字段管理
- 直接使用 `Table` 时，显式保持 `bordered={false}` 与 `striped={false}`
- 若页面同时存在状态标签筛选与列表结果，初始数据集没有被未声明的默认选中状态隐式预过滤
- 若页面右侧存在需要冻结的操作列，列配置固定与 wrapper 级 `fixedToColumn` 已同步声明
- 表格普通数据列默认保持单行；复合单元格、状态胶囊自定义渲染或多按钮行操作若存在，结果中已有书面批准依据
- 表格 row action 保持 HiUI link 语义且单行
- 主白底主体从筛选 / 表格 / 分页连续延伸；若示例页本身采用吸底分页，则分页仍处于同白底主体底部
- 若页面使用真实 `QueryFilter`，控制台不存在 `FieldsContext` / `ValueType` 缺失类 warning

## 图表类证据

任何页面只要新增图表，至少具备：

- 图表真实接入 `@ant-design/charts` 或明确批准的同源 wrapper
- 图表源码复用了共享 HiUI 图表基线，而不是直接回退到库默认 theme
- 图表配色遵守共享 color contract；未直接照搬库默认 palette
- 图表标题、tooltip、legend、时间维度文案遵守 i18n / formatter 基线
- 柱状图 / 条形图场景复用了共享间距 helper；不存在业务页散落的 `paddingInner / paddingOuter`
- 趋势图类型选择符合约束：单指标趋势默认优先面积图，多指标趋势对比默认优先折线图，构成随时间变化默认优先堆叠面积图
- 面积图默认无点标记；若存在例外，结果中已有批准依据
- 单序列面积图描边落在 `line.style`，面积层 `style` 只回答 fill
- 每张图标题都能直接回指到明确业务问题，而不是模板化标题或泛化标题
- 每张图的类型与其信息任务一致；不存在趋势任务误落构成图、流程任务误落对比图的情况
- 若页面声明 `primary-secondary`，主线核心图仍位于 `primary`；`secondary` 只承接辅助判断图与洞察图
- 页面不存在为了贴近示例数量而额外堆出的低价值图表；图表数量与一级信息任务数量基本匹配
- 数据可视化页仍保持指标卡、图表区、明细表在同一白底工作区内；没有误套普通列表的表体独占纵滚

若图表形成独立分析区，则还必须具备：

- contract 与源码都显式声明 `chart-section`
- 图表落在受管 chart body / approved chart carrier 中

## 组合页 / Split 证据

命中“左列表右详情 / 左树右表 / 数据统计区 + 表格 / 主从布局 + 复杂表格”这类组合页时，至少具备：

- 两档真实视口走查记录：`viewport A` 与 `viewport B`
- 两档视口下，分栏比例没有失真
- 拖动分隔条后左右宽度分配能更新且不抖动
- 右栏保持弹性列，没有因死宽度先撑破宿主
- 表格关键列完整露出，或其退化符合预期
- 固定列未把主工作区压坏
- 横向滚动只发生在预期表格容器上
- 页面主体 / `white-body` / `split workspace` / 左右栏未被表格横向撑破
- 若声明了左右栏独立滚动，已完成与当前源码快照绑定的 `runtime smoke`

## 真实浏览器证据

- 已完成一次真实页面 / DOM / 控制台核验
- 命中 `page-scroll`、sticky footer、split workspace、左右栏独立滚动、图表区与明细表连续滚动等依赖真实 DOM 的场景时，已补浏览器级 smoke 或等价校验
- 不能只依赖 `build`、`doctor`、source gate 或 contract 判定完成

## 视觉验收证据

- 没有“灰底页面 + 单张大白卡”回退
- 没有双层主工作区 / 双层白底主体
- 没有标题下方大面积空白
- `PageHeader` / `QueryFilter` / `Table` 没有被宿主样式挤坏
- 没有残留 `hi-v4-*` / `--hi-v4-*` 历史选择器和变量

## 页面完成定义

当前页同时满足以下条件才算完成：

- 当前页不存在未解决的 hard fail
- 与当前页直接相关的 warning 没有被以“先交付再补”方式保留
- `rules-only` / `legacy-host-compatible` 当前页已基于最新源码完成 `finalize-page`
- 强制场景下的 `runtime smoke` 结果已与当前 `sourceSnapshotHash` 绑定
- 已完成一次真实页面 / DOM / 控制台核验
- 已完成一次视觉验收信号核对

若同一根因修复后复测仍失败 2 次，回到 `mode / page type / example path / host archetype path` 重新判定；不要继续沿当前错误壳层做局部补样式。

## 最终回复前收口边界

若当前任务生成或实质性修改了页面，代理在最终回复前还必须按 `PRIVACY.md` 完成 `preview_ready` 统计收口。

这一步属于外层任务完成协议，不属于本文件的页面质量 gate；不要把“页面已通过本文件门槛”和“整个任务已完整结束”混为一谈。
