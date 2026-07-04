# HiUI v5 组件选型图谱

## 目标

这份文件只解决一个问题：

- 当页面进入非典型 / overlay 路径，或所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时，应该优先落到哪一个 HiUI 语义组件

它不负责：

- 重复维护完整 API 文档
- 重复维护页型 contract
- 重复维护页壳 ownership
- 给业务页发明新的中间容器语义

对应事实源如下：

- 典型页与固定页壳：`../../rules/page-type-map.md`
- 非典型 / overlay 布局与 ownership：`non-typical-pages.md`
- 生成阶段门槛：`../../rules/generation-rules.md`
- 高频组件最小兜底：`../hiui-v5-quick-reference.md`

## 使用顺序

1. 先按 `../../rules/page-type-map.md` 锁定 `page type`
2. 命中非典型 / overlay 时，先读 `non-typical-pages.md`
3. 若所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围，再读本文件
4. 需要把“页面语义 -> 组件”快速路由时，再读 `non-typical-component-routing.md`

## 导入纪律

- 常用组件统一优先从 `@hi-ui/hiui` 导入。
- 图标统一优先从 `@hi-ui/icons` 导入。
- 典型页壳或其桥接组件，仍优先从 `@hiui-design/typical-page-shells` 及其公开子路径导入。
- 不要默认拆成单组件包导入，例如 `@hi-ui/button`、`@hi-ui/form`。
- `Provider`、`GlobalContext`、`LocaleContext`、`PortalContext` 这类基础上下文能力，只有在项目已有 precedent 或确有运行时缺口时才直接触达；不要在业务页面里随手新增一层全局 provider。

## 读法

- “优先使用”回答应该先看哪个 HiUI 语义组件。
- “不要退化成”回答最常见的错误替代写法。
- 本文件优先解决组件选型，不替代 props 细节；若必须查具体 props / 示例，再回看完整 `hiui-v5` 文档。

## 页面骨架与布局

- `PageHeader`：页面标题、返回链路、页头主操作的唯一入口；不要在内容白底里再手写一条标题工具栏。
- `Layout`：当页面确实需要应用级导航、侧栏、内容区骨架时使用；不要把业务页内部白卡误写成 page shell。
- `Grid`：一级分组或表单字段栅格编排；不要用无语义 `flex-wrap` 硬拼出不稳定多列。
- `Space`：同一语义动作组或同一行轻量内容的间距器；不要拿它承接页面级 section 排布。
- `Card`：局部信息分组或面板容器；不要把每个 section 都默认包成卡片，更不要让它接管整页白底主体。
- `Breadcrumb`：多级页面层级导航；不要把它替代真实返回语义或 `PageHeader.onBack`。
- `Menu`：系统级或区块级导航切换；不要用一排普通按钮冒充导航系统。
- `Tabs`：同层信息分段浏览；不要把互斥内容硬堆在一个长页面里，也不要把并列 section 误做成 tabs。
- `Anchor`：长页面的同页定位导航；不要把真正的主导航结构退化成锚点列表。
- `Stepper`：顺序明确、分步执行的流程；不要把普通分组详情页误写成步骤条。
- `Collapse`：次级信息折叠收纳；不要把主表达内容默认折进折叠面板。
- `ResizeBox`：需要用户调节面板尺寸的局部容器；不要直接拿它替代受管 split shell。
- `Scrollbar`：项目已要求统一滚动条样式或监听特殊滚动行为时使用；不要额外包一层破坏主滚动链。
- `ZenMode`：需要聚焦展示核心区域时使用；不要把普通详情页或编辑页默认做成沉浸模式。

## 信息表达与阅读

- `HiUI`：组件生态总览入口，只作为文档导航与组件发现入口；不要把它当成业务页面里的具体 JSX 组件答案。
- `Table`：统一结构数据的主表达；不要退回手写 grid、列表拼接或自造 data panel。
- `List`：异构条目、活动流、简单列表项阅读；不要在需要列对齐和排序能力时替代表格。
- `Descriptions`：只读字段主表达；不要把标题下紧邻元信息带、摘要指标带误升格成 `Descriptions`。
- `Timeline`：按时间线表达事件、日志、流程记录；不要用普通列表硬拼时间轴。
- `Tree`：层级结构浏览或节点操作；不要在需要树语义时退回嵌套列表。
- `Tag`：状态、分类、风险、轻量标签语义；不要手写彩色胶囊 `span`。
- `Badge`：未读、数量、红点、角标提醒；不要把状态主表达误写成 `Badge`。
- `Avatar`：用户或对象标识；不要用普通图标或文字占位冒充头像。
- `Counter`：数量微调或数值步进展示；不要在只读指标场景里误用成 KPI 卡。
- `Highlighter`：搜索命中关键词高亮；不要在普通正文里滥用高亮。
- `EllipsisTooltip`：单行或定宽文本省略后补完整提示；不要整列文本都默认套 `Tooltip`。
- `Result`：复杂结果反馈页或结果块；不要把错误/成功态硬塞成一条 `Message`。
- `EmptyState`：无数据、无权限、无结果、建设中等空状态；不要拿一段灰字替代完整反馈态。
- `Preview`：图片或媒体预览；不要自造 lightbox。
- `Watermark`：保密、版权、水印提示；不要在业务页面手写绝对定位文字层。

## 查询、筛选与导航输入

- `QueryFilter`：列表页真实筛选表单；不要退回手拼 `Search + Select + DatePicker` flex 行。
- `Search`：单一关键词搜索入口；不要把多字段复杂筛选误压成多个并排搜索框。
- `Filter`：轻量筛选聚合器；不要把完整查询表单误做成几个散落的按钮组。
- `Select`：从离散选项中单选或少量选择；不要在选项明显层级化时硬用普通下拉。
- `CheckSelect`：多项选择但仍保持下拉面板交互；不要用一长列复选框占满页面。
- `TreeSelect`：树形数据中的单选或少量选择；不要在层级选择场景退回平铺 `Select`。
- `CheckTreeSelect`：树形数据多选；不要自造树 + checkbox 组合。
- `Cascader`：多级分类选择；不要把层级关系硬展平成多个下拉。
- `CheckCascader`：多级分类下的多选；不要把跨层级多选退回成一堆并排选择框。
- `Picker`：通用选择器入口；只有项目已有 precedent 或通用选择需求明显时使用，不要先于语义更强的专用组件。
- `DatePicker`：日期、日期段、日期周期录入；不要手写输入框加格式提示。
- `TimePicker`：时间录入；不要用普通输入框承接结构化时间。
- `Radio`：少量互斥选项；不要把明显互斥的几个状态做成一排按钮。
- `Checkbox`：少量多选；不要在选项很多时硬堆复选框列表。
- `Switch`：布尔开关或立即生效的两态切换；不要把有提交语义的字段误写成 `Switch`。
- `Slider`：区间或连续值调节；不要把需要精确输入的字段默认做成滑块。
- `Anchor`：同页跳转定位；不要用它承接查询或筛选语义。

## 表单与数据录入

- `Form`：结构化录入主容器；不要把多字段录入写成松散 `div + Input` 集合。
- `Input`：单行文本输入；不要用它冒充数字、日期、选择器等结构化字段。
- `Textarea`：长文本、多行备注；不要把多行描述挤进单行输入框。
- `NumberInput`：数字录入；不要用普通 `Input` 再靠正则硬拦数字。
- `InputGroup`：多个输入控件的紧密组合；不要在整页层级用它代替布局系统。
- `TagInput`：以标签形式录入多值内容；不要手搓 chips editor。
- `Transfer`：两侧状态流转和批量归类；不要在有空间的双列表迁移场景退回多选下拉。
- `Upload`：文件或图片上传主入口；不要在项目已有上传基座时自写上传按钮和进度状态。
- `FileSelect`：只需要轻量文件选择或替换入口时使用；不要把完整上传流程误缩成一个裸文件 input。
- `Rate`：评分录入；不要用几个普通按钮、图标或文本链接手拼打分控件。
- `Counter`：需要显式增减步进的数字输入；不要在自由数字录入场景替代 `NumberInput`。

## 浮层、确认与分层交互

- `Drawer`：中途编辑、查看详情、不中断当前上下文的侧边面板；不要把大字段编辑硬塞进抽屉。
- `Modal`：阻断式确认或必须聚焦完成的小任务；不要把持续性工作区误做成 modal。
- `Popover`：轻量补充信息或轻量二次确认；不要把复杂表单塞进气泡卡。
- `PopConfirm`：危险操作或关键动作的轻量确认；不要为一句确认文案弹完整 modal。
- `Dropdown`：同组次级动作下收；不要在操作密度低时滥用下拉隐藏主动作。
- `Tooltip`：简短解释、图标含义、截断文本提示；不要拿它承载主信息或多段说明。
- `Popper`：需要自定义定位的底层弹层容器；只有项目已有 precedent 或必须做自定义弹层时使用，不要先于 `Tooltip` / `Popover` / `Dropdown`。
- `Portal`：把局部内容渲染到指定容器；不要在业务页面里无理由增加 portal 层。
- `PortalContext`：portal 容器配置的上下文桥；只有项目已有容器约束时触达，不要页面本地随意建立。
- `Carousel`：多图轮播或营销型图片切换；不要把普通业务内容块做成轮播。

## 反馈、状态与异步

- `Alert`：局部阅读型提醒、说明、风险提示；不要把系统级即时反馈写成 `Alert`。
- `Message`：即时、全局、短反馈；不要承接复杂错误说明。
- `Toast`：轻量自动消失提示；不要承接需要操作或长时间阅读的反馈。
- `Notification`：系统级通知、公告、广播；不要拿它替代页面内状态块。
- `Loading`：局部或整体加载态；不要在内容已知结构明显时错过骨架屏。
- `Skeleton`：已知结构的占位加载；不要用它替代真正的空状态。
- `Spinner`：纯旋转型等待提示；不要在大块内容加载时只留一个小 spinner。
- `Progress`：展示上传、下载、执行进度；不要只用文字描述百分比。
- `Pagination`：长列表的分页导航；不要把分页漂到白底主体之外，也不要用“加载更多”替代已有分页语义。
- `BackTop`：长内容返回顶部；不要把页面主导航功能误做成返回顶部按钮。

## 按钮、图标与基础视觉能力

- `Button`：显式动作入口；不要把导航、状态或筛选语义都压成按钮。
- `IconButton`：空间受限且图标语义足够明确的动作；不要在用户难以辨义时只放图标不放文案。
- `Icons`：项目需要语义化图标资源时使用；不要在业务页直接画散装 SVG。
- `SvgIcon`：已有 SVG 资源的统一渲染入口；不要在项目已有图标系统时另起一套封装。
- `Avatar`：身份标识图像；不要把图标按钮误用为头像。
- `Badge`：数量角标、提醒徽标；不要拿它做主要状态表达。

## 媒体、预览与辅助能力

- `Preview`：图片预览与放大查看；不要自写浮层图片浏览器。
- `Carousel`：多图切换展示；不要在信息密集业务页默认启用。
- `ResizeBox`：可调尺寸容器；不要接管页面级 split ownership。
- `Scrollbar`：统一滚动条视觉或特殊滚动事件；不要打断既有单滚动链。
- `Watermark`：内容保密标识；不要以页面级背景图方式模拟水印。
- `Highlighter`：命中高亮；不要在普通正文里长期保持强高亮。

## 上下文与基础设施组件

- `Provider`：主题、语言、全局配置的顶层 provider；不要在业务页面里重建一层 provider。
- `GlobalContext`：全局配置上下文；只有项目已有桥接链路时复用，不要业务页本地直接消费并改写全局配置。
- `LocaleContext`：语言上下文；不要在单页里临时切换 locale 绕开项目级 i18n。
- `PortalContext`：portal 挂载容器上下文；只在弹层挂载链确有缺口时使用。

## 典型误用对照

- 标题下紧邻元信息：优先 `secondary info band / Tag / text row`，不要默认 `Descriptions`
- 详情主表达：优先 `Descriptions`，不要降级成几列 `meta row`
- 列表筛选区：优先 `QueryFilter`，不要手拼 `Search + Select + DatePicker`
- 状态语义：优先 `Tag / Alert / Result / EmptyState`，不要手写彩色块
- 页面主容器：优先固定页壳 / shared shell，局部补充才用 `Card`，不要让 `Card` 变成整页白底 owner
- 时间记录：优先 `Timeline`，不要普通 `List` 硬拼时间点
- 树选择：优先 `TreeSelect / CheckTreeSelect`，不要普通 `Select` 平铺层级项
- 危险确认：优先 `PopConfirm` 或明确的 `Modal`，不要在行内静态文字提醒后直接执行

## 与本 skill 的关系

- 高频典型页组件仍先看 `../hiui-v5-quick-reference.md`
- 进入非典型 / overlay 路径时，先看 `non-typical-pages.md`
- 需要把页面语义快速路由到具体组件时，再看 `non-typical-component-routing.md`
- 这份图谱只解决“优先选谁”，不替代页型、ownership、contract 与完整 API 文档

## 自动同步附录

这一节优先从 `manifests/hiui-v5-components.json` 渲染，用来把组件目录、来源路径、频度、默认优先级与 README 摘要展开成快速核对视图。

- 生成脚本：`scripts/sync-hiui-v5-component-map.mjs`
- 组件 facts：`manifests/hiui-v5-components.json`
- 上游来源：`HIUI_V5_DOCS_ROOT/README.md`
- 作用边界：只展开 facts 层字段与 README 摘要，不覆盖上面的人工选型判断
- 当前数量：83 个组件

<!-- BEGIN GENERATED HIUI V5 COMPONENT CATALOG -->
| 组件 | 来源 | 频度 | 默认优先级 | 最小速查分组 | README 摘要 |
| --- | --- | --- | --- | --- | --- |
| `Alert` | `components/alert.mdx` | `high` | `primary` | - | 警示，内容提示，说明，要求，规则等阅读类信息 显示在页面局部的提示性文案 |
| `Anchor` | `components/anchor.mdx` | `medium` | `secondary` | - | 通过锚点可快速找到信息内容在当前页面的位置 |
| `Avatar` | `components/avatar.mdx` | `medium` | `secondary` | - | 用于展示用户或对象的标识，支持图片、图标或字符，常见于个人资料卡或成员列表 |
| `BackTop` | `components/back-top.mdx` | `medium` | `secondary` | - | 当内容滑动到设定高度时，显示回到顶部按钮，点击按钮回到最顶部 |
| `Badge` | `components/badge.mdx` | `medium` | `secondary` | - | 有新消息提示时 常见于图标、文字标题、按钮等位置 |
| `Breadcrumb` | `components/breadcrumb.mdx` | `medium` | `secondary` | - | 用户处于界面的内容区域时，内容的信息层级有 2 层以上 想要无需使用主导航系统就可以来去自如 进入二级页面，除了给予逃生出口外，告知用户更详细的信息 |
| `Button` | `components/button.mdx` | `high` | `secondary` | `页头与操作区` | 用户需要执行有具体含义的动作、命令 连接页面之间、页面和弹窗、页面和浮层面板的跳转 |
| `Card` | `components/card.mdx` | `high` | `secondary` | - | 当一组同类信息不能自然形成区块感时，需借助卡片来组织 当一个应用或功能由大量信息组成，需要通过重点信息快速识别时 后台展示概览信息时 |
| `Carousel` | `components/carousel.mdx` | `medium` | `secondary` | - | 在空间有限的情况下，需要展示多张图片时 常用于宣传营销 Banner、新功能上线等场景 |
| `Cascader` | `components/cascader.mdx` | `high` | `primary` | - | 需要从大量的离散型数据中选择一部分时使用 备选项数量 5 个以上时 不需要将全部备选项都展示给用户时 |
| `Checkbox` | `components/checkbox.mdx` | `high` | `secondary` | `表单` | 需要快速完成多选一且备选项数量不多时 常见于后台设置、调研问卷、表单等场景 |
| `CheckCascader` | `components/check-cascader.mdx` | `medium` | `secondary` | - | 采用多级分类组织选项，支持跨类别多选，适合在复杂层级数据中快速勾选多个项目 |
| `CheckSelect` | `components/check-select.mdx` | `medium` | `secondary` | - | 以下拉面板呈现可勾选的选项，适合在有限空间内完成多项选择或批量筛选 |
| `CheckTreeSelect` | `components/check-tree-select.mdx` | `medium` | `secondary` | - | 接收树形数据结构的多选控件，支持展开层级浏览并勾选多个节点，便于处理复杂结构数据 |
| `Collapse` | `components/collapse.mdx` | `medium` | `secondary` | - | 信息复杂，有主次之分时，将次要信息折叠进面板 一级信息需优先识别，二级信息多为辅助信息或描述信息 |
| `Counter` | `components/counter.mdx` | `medium` | `secondary` | - | 提供递增递减按钮的数值输入方式，常用于设置数量、配额或库存上下限 |
| `DatePicker` | `components/date-picker.mdx` | `high` | `secondary` | `列表与筛选` | 需要将某一个日期或时间录入到系统中时 需要将某一个时间段或任一个时间周期录入到系统中时 |
| `Descriptions` | `components/descriptions.mdx` | `high` | `primary` | `抽屉与详情` | 以成组字段展示只读信息，常用于详情页或侧边面板的关键信息概览 |
| `Drawer` | `components/drawer.mdx` | `high` | `secondary` | `抽屉与详情` | 当前任务中需要中途填写信息或执行别的动作 常见于后台设置、新建编辑等场景 |
| `Dropdown` | `components/dropdown.mdx` | `medium` | `secondary` | - | 有二级以上的菜单且展示空间有限 当一组平级的动作要展示时，将其收入一个入口，可让页面信息更整洁 |
| `EllipsisTooltip` | `components/ellipsis-tooltip.mdx` | `medium` | `secondary` | - | 文本溢出时以省略号收起，鼠标悬停后展示完整内容，兼顾信息完整性与布局整洁 |
| `EmptyState` | `components/empty-state.mdx` | `medium` | `primary` | - | 在无数据、无权限或搜索无结果等情境下展示空状态，引导用户下一步操作 |
| `FileSelect` | `components/file-select.mdx` | `medium` | `secondary` | - | 提供文件选择或替换入口，常用于上传附件、导入数据等场景 |
| `Filter` | `components/filter.mdx` | `medium` | `secondary` | - | 聚合多个筛选条件的输入控件，帮助用户对列表数据快速过滤和定位 |
| `Form` | `components/form.mdx` | `high` | `primary` | `表单` | 当系统需要收集、录入时 常见于调查问卷、登录、新建/编辑、设置等场景 |
| `GlobalContext` | `components/global-context.mdx` | `medium` | `helper` | - | 提供全局配置上下文，用于在组件树中统一管理全局状态和配置 |
| `Grid` | `components/grid.mdx` | `medium` | `secondary` | - | 24 栏栅格系统，用于实现内容区域的各种布局 |
| `Highlighter` | `components/highlighter.mdx` | `medium` | `helper` | - | 高亮结果中的关键字，帮助用户迅速识别匹配项 |
| `HiUI` | `components/hiui.mdx` | `low` | `helper` | - | HIUI 组件生态总览入口，汇集各类基础与业务组件的导航 |
| `IconButton` | `components/icon-button.mdx` | `medium` | `secondary` | - | 以图标强化按钮语义，适合空间紧凑或仅需图形表达含义的操作 |
| `Icons` | `components/icons.mdx` | `medium` | `secondary` | - | 引入语义化图标时使用 |
| `Input` | `components/input.mdx` | `high` | `primary` | `表单` | 用户需要通过键盘输入内容时 常见于表单，作为表单的组件类型之一 |
| `InputGroup` | `components/input-group.mdx` | `medium` | `secondary` | - | 常用于表单控件控制，灵活组合多种表单控件进行展示 |
| `Layout` | `components/layout.mdx` | `medium` | `secondary` | - | 提供包含导航、侧栏、内容区的页面布局框架，便于快速搭建管理后台骨架 |
| `List` | `components/list.mdx` | `high` | `primary` | - | 最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面 |
| `Loading` | `components/loading.mdx` | `medium` | `secondary` | - | 页面加载时 页面卡片、浮层面板加载时 |
| `LocaleContext` | `components/locale-context.mdx` | `medium` | `helper` | - | 注入语言配置上下文，在组件树内统一管理国际化文案 |
| `Menu` | `components/menu.mdx` | `medium` | `secondary` | - | 承载站点或系统的信息架构，用于顶部或侧边栏导航，引导用户定位功能页面 |
| `Message` | `components/message.mdx` | `high` | `secondary` | `页头与操作区` | 由用户在界面交互过程中发生的全局性操作提示 即时反馈当前操作的结果 |
| `Modal` | `components/modal.mdx` | `high` | `secondary` | - | 当前任务中需要中途填写信息或执行别的动作 常见于后台设置、新建编辑等场景 |
| `Notification` | `components/notification.mdx` | `medium` | `secondary` | - | 系统级推送 用于通知、通告、公告、广播等场景 |
| `NumberInput` | `components/number-input.mdx` | `high` | `primary` | `表单` | 只允许输入数字时使用 |
| `PageHeader` | `components/page-header.mdx` | `high` | `primary` | `页头与操作区` | 展示页面主标题、辅助信息与常用操作，构建清晰的页面头部区域 |
| `Pagination` | `components/pagination.mdx` | `high` | `secondary` | `列表与筛选` | 当数据量级较大，请求数据时延过长 当展示数据的页面空间有限，无法一次性展示时 用户更关心前几条或前几十条数据情况时 |
| `Picker` | `components/picker.mdx` | `medium` | `secondary` | - | 通用型下拉选择器，支持从备选项中快速选定一个或多个值 |
| `PopConfirm` | `components/pop-confirm.mdx` | `medium` | `secondary` | - | 触发后弹出轻量确认气泡，用于在提交、删除等敏感操作前再次确认 |
| `Popover` | `components/popover.mdx` | `high` | `secondary` | - | 信息先以隐藏的形式收起，递进式呈现，以优先展示一级信息 以轻量级的形式对操作进行二次确认提示 |
| `Popper` | `components/popper.mdx` | `medium` | `secondary` | - | 提供可自定义定位的轻量弹出层容器，支撑 Tooltip、Popover 等场景 |
| `Portal` | `components/portal.mdx` | `medium` | `helper` | - | 将子元素渲染到其它 DOM 容器，常用于跨层级展示弹层或浮动面板 |
| `PortalContext` | `components/portal-context.mdx` | `medium` | `helper` | - | 管理 Portal 挂载容器的上下文配置，确保弹层渲染到指定 DOM 节点 |
| `Preview` | `components/preview.mdx` | `medium` | `secondary` | - | 提供图片等多媒体的预览能力，支持放大查看、切换或全屏展示 |
| `Progress` | `components/progress.mdx` | `medium` | `secondary` | - | 需要显示、掌控某件事务的进展的状态，如百分比等 常用于上传、下载文件等场景 |
| `Provider` | `components/provider.mdx` | `medium` | `helper` | - | HIUI 的顶层 Provider，向下传递主题、语言等全局配置 |
| `QueryFilter` | `components/query-filter.mdx` | `high` | `primary` | `列表与筛选` | 提供表单化的筛选条件输入，支持多字段组合查询，常用于数据列表的筛选场景 |
| `Radio` | `components/radio.mdx` | `high` | `secondary` | `表单` | 需要快速完成多选一且备选项数量不多时 常见于后台设置、调研问卷等场景 |
| `Rate` | `components/rating.mdx` | `medium` | `secondary` | - | 需要对某一个指标或事件进行评级评分时 |
| `ResizeBox` | `components/resize-box.mdx` | `medium` | `secondary` | - | 用于可调整大小的布局 |
| `Result` | `components/result.mdx` | `high` | `primary` | - | 当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用 |
| `Scrollbar` | `components/scrollbar.mdx` | `medium` | `secondary` | - | 需要统一滚动条视觉样式，或者需要监听某些特殊滚动事件，比如滚动到底部、滚动到顶部 |
| `Search` | `components/search.mdx` | `high` | `secondary` | `列表与筛选` | - 全栈信息检索 - 表格数据、信息列表 |
| `Select` | `components/select.mdx` | `high` | `primary` | `列表与筛选` | 需要从大量的离散型数据中选择一部分时使用 备选项数量 5 个以上时 不需要将全部备选项都展示给用户时 |
| `Skeleton` | `components/skeleton.mdx` | `medium` | `secondary` | - | 在网络请求或数据处理过程中，需要展示内容的大致结构 在数据尚未加载完成前，用于替代真实内容的占位展示 用于避免页面空白和跳动，提升用户体验 |
| `Slider` | `components/slider.mdx` | `medium` | `secondary` | - | 设置多个参数且要求操作所即见即所得时 |
| `Space` | `components/space.mdx` | `high` | `helper` | `页头与操作区` | 快速对组件进行排版布局，保证组件之间有一定的控件划分 |
| `Spinner` | `components/spinner.mdx` | `medium` | `secondary` | - | 展示加载旋转动画，在异步请求或页面等待时提示用户进度 |
| `Stepper` | `components/stepper.mdx` | `medium` | `secondary` | - | 当完成的目标需要分布来执行，且带有明确的先后次序 一个任务的每一步都需要较为复杂的信息和执行操作 |
| `SvgIcon` | `components/svg-icon.mdx` | `medium` | `secondary` | - | 快速渲染 SVG 图标资源，支持自定义尺寸与配色 |
| `Switch` | `components/switch.mdx` | `high` | `secondary` | `表单` | 有两种状态，通常切换时会引起状态的改变 常用于设置参数、控制面板等场景 |
| `Table` | `components/table.mdx` | `high` | `primary` | `列表与筛选` | 当需要管理一定量级的统一结构的数据记录时 当需要对一部分全部数据进行编辑、筛选过滤时 |
| `Tabs` | `components/tabs.mdx` | `medium` | `secondary` | - | 当页面空间有限，要组织大量的信息且信息之间有明确的分界线 节省屏幕空间，减少用户视觉和信息干扰 无信息间的对比要求，即不同时查看 |
| `Tag` | `components/tag.mdx` | `high` | `secondary` | `抽屉与详情` | 有新消息提示时 常见于图标、文本标题、按钮等位置 |
| `TagInput` | `components/tag-input.mdx` | `medium` | `secondary` | - | 以标签形式录入和展示多值内容，常用于关键词、成员等集合型数据 |
| `Textarea` | `components/textarea.mdx` | `high` | `secondary` | `表单` | 提供多行文本输入区域，适合填写备注、描述等长文本 |
| `Timeline` | `components/timeline.mdx` | `high` | `primary` | - | 信息呈现的方式以时间流形式展示时 信息发生的时间粒度较小，且间隔较为均匀 常用在行为记录、日志、日程提醒、物流等场景 |
| `TimePicker` | `components/time-picker.mdx` | `medium` | `secondary` | - | 在弹出面板上选择时间，以便捷完成时间输入的控件 |
| `Toast` | `components/toast.mdx` | `medium` | `secondary` | - | 全局轻量通知组件，自动消失提示操作结果或系统状态 |
| `Tooltip` | `components/tooltip.mdx` | `medium` | `helper` | - | 词汇注释，生僻专业词汇，动作描述 图标代表的含义 |
| `Transfer` | `components/transfer.mdx` | `medium` | `secondary` | - | 一组数据进行两种状态的分类时 有更多的空间进行选择时 需快速批量的完成选项归类且可调整顺序时 |
| `Tree` | `components/tree.mdx` | `high` | `secondary` | `列表与筛选` | 多层级数据结构 需要明确的展示层级结构 对多层级结构节点进行操作 |
| `TreeSelect` | `components/tree-select.mdx` | `high` | `primary` | - | - 选择部门的组织结构、部门等 - 选择商品目录等 |
| `Upload` | `components/upload.mdx` | `medium` | `secondary` | - | 上传本地文档 上传图片附件或照片墙 |
| `Watermark` | `components/watermark.mdx` | `medium` | `secondary` | - | 页面内容涉及到保密或其它情况时 |
| `ZenMode` | `components/zen-mode.mdx` | `medium` | `secondary` | - | 将页面核心区域放大聚焦，可快速切换至演示或沉浸式浏览模式 |
<!-- END GENERATED HIUI V5 COMPONENT CATALOG -->
