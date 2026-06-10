# 生成约束

这份文件只负责两件事：

1. 定义页面生成的默认原则
2. 定义从“开始生成”到“允许交付”的阶段门槛

它不负责：

- 重复列出首轮输出字段清单
- 重复定义 contract 字段
- 重复维护组合页实现模板
- 重复维护验收证据清单

对应事实源如下：

- 首轮输出格式：`../docs/generation/ai-kickoff-template.md`
- contract 字段唯一事实源：`contract-regions.md`
- `rules-only` / `legacy-host-compatible` 示例对齐流程：`../docs/generation/rules-only-example-alignment.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 非典型 / overlay 布局事实：`../docs/generation/non-typical-pages.md`
- 页面质量验收证据与页面完成门槛：`validation-checklist.md`
- 最终回复前统计收口：`PRIVACY.md`

## 读取顺序

1. `mode-selection.md`
2. `page-type-map.md`
3. `contract-regions.md`
4. 本文件
5. `../docs/generation/i18n-baseline.md`
6. `../docs/generation/layout-anti-patterns.md`
7. 命中页型后再读 `../docs/generation/figma-page-rules.md`
8. 需要细页型时再读 `../docs/generation/figma-pages/*.md`

## 阶段门槛

### 1. Kickoff Gate

- 任何 `hiui-design` 页面生成、重写或大改任务，首次回复都必须先按 `ai-kickoff-template.md` 输出固定起手块。
- 起手块没有写、顺序被打乱、或关键字段仍是猜测时，都按“尚未进入实现阶段”处理。
- 页面生成阶段默认读取并确认项目既有 `mode` 事实；只有当项目事实缺失、过期或互相冲突时，才重新判定。
- `doctor`、source gate、静态截图、相似示例页或“页面能跑起来”都不能替代 kickoff。

### 2. Routing Gate

- `page type` 统一由 `page-type-map.md` 路由。
- 命中典型页型后，必须继续读取对应页型专章；不要停在页型表本身。
- 未命中典型页型，或典型页型只是在内部一级分组上需要额外布局判断时，统一转到 `non-typical-pages.md`。
- `data-visualization` 等 overlay 场景允许补 `layout strategy`，但不改变原 `page type` 身份，也不豁免原页型的 mandatory components、page shell、contract 与技术栈要求。
- 非典型页面允许自由拼装一级分组，但这种自由只发生在 HiUI-first、spec-constrained 的边界内；不要把非典型理解成可以自由替换组件层级、visual token、ownership 或 runtime shell。

### 2.1 Route Ownership Gate

- `src/typical-page-reuse/routes/config.tsx` 只属于 host-integration 的 smoke / reference gallery；它不是业务菜单注册表，也不是新页面默认落点。
- 新生成页面默认是业务页，即使它从 `src/typical-page-reuse/pages/*` 或 `examples/host-integration/src/pages/*` 起步，也必须注册到目标项目真实宿主路由树中。
- 只有当用户明确要求“新增示例页 / 扩展示例 gallery / smoke baseline”时，才允许修改 `src/typical-page-reuse/routes/config.tsx`。
- gallery route config 里的动态页面 import 必须保持在 `src/typical-page-reuse/**` 内；不得从 `../../pages/*`、`src/pages/*` 或其它业务目录导入真实业务页。
- 若项目使用 `TypicalPageAppFrame`，业务菜单应是 `业务 / 项目 / 订单 / 工单` 等宿主级 route group，并显式带一级语义 icon；`示例` 只承接典型页 gallery。
- 一级菜单 icon 必须从 `@hi-ui/icons` 选择匹配菜单域的 `Filled` 变体，不能把 `AppStoreFilled` 或任一通用图标复制给所有一级菜单；常见映射可用 `BusinessCardFilled` -> `业务`、`FolderOpenFilled` -> `项目`、`AppStoreFilled` -> `示例`。
- 业务页与示例页可以共享 page shell、archetype 和 source marker，但不能共享 route ownership。页面生成完成前必须能回答：`business route owner`、`menu group`、`default redirect`、`back target`。
- 若不确定业务菜单归属，先把页面挂到明确的临时业务 group（例如 `业务`），不要为了“能打开”把它塞进 `示例`。

### 3. Source-of-Truth Gate

- 首轮输出字段的格式和顺序，只看 `ai-kickoff-template.md`。
- contract 字段、最小 region、ownership、`split pane contract` 的定义，只看 `contract-regions.md`。
- 示例绑定、示例是否为结构事实源、以及 shell inheritance 的 contract 不变量，只看 `contract-regions.md`；`rules-only-example-alignment.md` 只补展开流程和反模式。
- 组合页额外需要的 `width accounting`、`runtime smoke plan`、固定列策略等，只看 `implementation-checklist-template.md`。
- 非典型 / overlay 场景的 `layout strategy`、`layout archetype`、ownership 与 runtime marker，只看 `non-typical-pages.md`。
- 任何文档都不应在本文件之外重新声明一套不同名字、不同顺序或不同作用域的同类字段。

### 3.1 Example Binding Gate

- 典型页示例是可执行结构事实源；生成器不得只按规则“写一个相似页面”。
- 命中典型页型后，先锁定唯一 `example path`、唯一 `host archetype path` 和必要的 `template path`，再进入 JSX。
- 对声明 `requiredStartFromExample=true` 的页型，若不能直接复制模板或示例运行时骨架，必须先声明并落盘命名 shell carrier / host adapter；不得回退为业务页内手拼 primitives。
- “替换业务槽位”与“重写页壳”必须分开判断；标题、字段、列和接口可替换，页壳、region 层级、白底主体、滚动 owner、分页 / footer 挂载语义不可在业务页局部重写。
- 这条 gate 的字段定义以 `contract-regions.md` 为准；rules-only / legacy 的具体操作顺序以 `rules-only-example-alignment.md` 为准。

### 4. Start / Preflight Gate

- `rules-only` / `legacy-host-compatible` 页面，在进入真实实现前必须先执行 `typical-page:start-page`。
- 对声明 `requiredStartFromExample=true` 的典型页，`typical-page:start-page` 默认必须直接从 `page.template.tsx|jsx` 起步；模板缺失时直接失败，不允许回退到自由壳层 scaffold。
- 当前页在进入视觉细节与业务字段实现前，至少执行一次 `typical-page:preflight`。
- 对组合页、split 页面、非典型页面，若增量事实尚未写清，不得靠边写代码边补 contract。
- 对非典型 / overlay 页面，进入实现前必须先写清 `base archetype`、`non-typical scope`、`mandatory components`、`header inheritance`、`ownership contract` 与 `shared baseline`；缺任一项时按“尚未进入实现阶段”处理。
- 对非典型 / overlay 页面，若所需组件超出 `../docs/hiui-v5-quick-reference.md` 覆盖范围，进入实现前还必须补读 `../docs/generation/non-typical-component-routing.md` 与 `../docs/generation/hiui-v5-component-map.md`，并写清 `primary semantic components`、`rejected alternatives`、`why not custom container` 与 `import path discipline`。
- 对 `layout archetype = context-main-split`，进入实现前还必须先写清 `split shell inheritance strategy` 与 `split shell carrier path`；若项目已有受管 split carrier，必须从该 carrier 或宿主翻译层起步，不得从 `ProDetailPage`、`ProEditPage` 或自拼 `workspace / leftPane / rightPane` 起步。

### 4.0 Component Routing Gate

- 非典型 / overlay 页面在进入 JSX 之前，先回答当前一级信息组的 `primary semantic components`。
- 只有当 HiUI 没有等价语义组件或 approved helper 无法承接时，才允许进入 approved bypass 讨论。
- `Card` 不是默认答案；只有在它确实承接局部 panel / section 边界时才成立，不能拿来替代 `Descriptions`、`Timeline`、`Table`、`Alert`、`Result` 等主表达。
- `heroCard`、`fieldCard`、`summaryStrip`、`infoStrip`、`customInfoBlock` 这类页面本地容器名默认都不是第一答案；若最终仍采用，必须先写清 rejected HiUI alternatives 与 deviation reason。
- 若组件来源不是 `@hi-ui/hiui`、`@hi-ui/icons` 或公开壳层路径，必须先说明 import discipline 与项目 precedent。

### 4.1 JSX Decision Gate

- 在开始写 JSX、局部样式或页面级布局容器之前，必须先完成下面四项结构判断；缺任一项时，不得进入实现阶段。
- 这四项判断不是视觉备注，而是实现前硬门槛；不允许先按“看起来差不多”的组件拼出页面，再回头补语义和 layout contract。
- `doctor`、source gate、已有示例页截图或“页面大概能跑起来”都不能替代这四项判断。

必须先回答：

- `region role`
  当前区域到底是 `header action`、`query-filter`、`summary`、`metric section`、`table shell`、`chart section`，还是其它明确角色；不要用“这里有个搜索框 / 按钮 / 表格”替代角色判断。
- `group boundary`
  当前信息组是一级信息组，还是某个一级组内部的子结构；不要把“同属一个业务结果”直接翻译成“必须共用一个总容器”。
- `surface owner`
  当前层是否是唯一承接白底、描边、圆角、内边距的 `surface owner`；若外层已承接同类职责，内层不得默认继续补一层同类 `card / surface / panel`。
- `parent layout behavior`
  父层若是 `grid` / `flex`，必须先判断默认 `stretch`、`wrap`、`min-width`、`min-height` 会不会影响子项几何；不要等到运行时才发现摘要被拉高、动作组被拆行、或内容被横向撑破。

默认失败信号：

- 页头查询误用 `QueryFilter` / 筛选区搜索语义
- 相邻信息组之间出现无语义大段空白
- 外层 `surface` 内继续嵌套同类 `surface`
- 父层 `grid / flex` 默认行为直到预览时才暴露布局问题

### 4.2 Shell Geometry Freeze

- 对 `data-visualization` 及任何实际声明 `chart-section` 的受管页，在进入图表选型、内部一级分组组织和业务 JSX 实现前，必须先冻结页面主体骨架几何。
- 至少先明确：`content-slot owner`、`white-body owner`、`outer-padding owner`、`main-scroll owner`。
- 业务页不得新增第二层页面级白底主体，也不得在 `page root`、`white-body` 外再包一层承接通用 `background / border / radius / page-level padding` 的容器。
- 若当前页命中 `host-slot-shell`，业务页根节点默认为 `host-flush-root`：只允许布局填充，不允许 page-level `padding / background / border-radius / overflow:auto|scroll`；需要 page-level padding 时必须改为连续 `page-surface-shell` 并同步更新 ownership contract。
- `PromptCopyFloatingButton`、`examplePrompt`、`typicalExamplePrompts` 只属于 host-integration 示例 gallery 的 `demo-only tooling`；从示例生成业务页时必须剥离，不得作为页头 action、页面内容或生成页依赖进入受管页面。
- 图表卡、指标卡、洞察卡的边框、圆角和内边距只能发生在一级分组内部，不得抬升为主体白色骨架的一部分。
- `chart usage contract` 可以前置于业务实现，但不得前置于 shell ownership；未冻结主体骨架几何前，不得开始图表容器实现。
- 这里的“先做图表”只表示先判断图表职责与用法，不表示先搭建图表壳层；不要把“先想图表”执行成“先写图表容器，再回头补 white-body”。

### 5. Completion Gate

- 当前页源码、contract、ownership、marker 或用户可见文案发生变化后，不得继续沿用旧 `finalize-page` 结果。
- `rules-only` / `legacy-host-compatible` 的当前页，在本次修改完成后必须基于**最新源码**重新执行一次 `typical-page:finalize-page`。
- `doctor PASS` 只能证明当前实现未越过静态硬门槛，不能替代最新一次 `finalize-page`。
- 对当前已支持的强制浏览器级场景，例如 `data-visualization + page-scroll`，或声明了左右栏独立滚动的 split master-detail，必须补 `runtime smoke`，并将结果绑定到当前 `sourceSnapshotHash`。

## 默认原则

### 原则 1：硬门槛默认开启

- 除文档明确给出豁免口外，视觉、框架、交互、国际化、图表与表格规则一律按硬门槛执行。
- 命中场景时，缺任一项都按未通过处理，不再视为“后续可补的优化项”。

### 原则 2：显式事实优先

- 对当前页，`page type`、`example path`、`host archetype path`、`mandatory components`、`i18n strategy`、`scroll strategy` 等事实必须能在源码、contract 或受管产物中落到明确证据。
- `doctor` 与 source gate 只能基于显式事实做校验与补诊断，不负责替页面“猜出正确设计”。
- `region role`、`group boundary`、`surface owner`、`parent layout behavior` 同样属于实现前显式事实；若仍停留在隐式猜测，不得直接进入 JSX 拼装。
- 任何会改变阅读起点、字段分布或骨架分支的组件 prop 默认值，都不得被当成稳定 contract。尤其是 detail-shell 的 vertical `Descriptions`，必须在源码边界显式冻结关键行为，而不是把“当前版本默认正好如此”当成规范本身。
- 若页面通过 `SchemaDescriptionsBridge` 落 detail-shell，必须显式写出 vertical 详情契约：`labelPlacement: 'left'`，并清空 bridge 继承来的固定 `labelWidth`。这属于 prop 级 contract，不属于页面级 CSS 骨架覆写。

### 原则 3：先复用壳层，再替换业务槽位

- 页面默认继承固定页壳、共享骨架、宿主承接链与 shared/helper 组件。
- 不要手拼裸 `PageHeader + QueryFilter + Table`，也不要把 `PageHeader`、`Table`、`Pagination` 等组件拆出真实 shell carrier 后重新拼壳。

### 原则 3.1：`context-main-split` 先继承 split 壳，再组织 pane 内容

- 命中 `layout archetype = context-main-split` 时，先决定受管 split shell carrier，再开始 left/right pane JSX 与样式实现。
- 右栏复杂度只影响 `right-main` 内部 section 组织，不构成替换 split 壳的理由。
- 若项目已有 `TreeSplitPageFrame`、`ContextMainSplitScaffold` 或宿主 split helper，默认优先复用；缺少 split shell carrier 证据时，不应继续写业务页容器。

### 原则 4：单一 owner

- `content-slot`、`white-body`、`outer-padding`、`main-scroll` 必须由唯一 owner 承接。
- 不允许宿主 content slot 和页面 `white-body` 同时承接外层 `padding / background / border-radius / overflow`。
- 组合页、split 页面、非典型页面若 owner 不清晰，先停下补 contract，不要继续写业务字段。

### 原则 4.1：主体白色骨架不得被业务容器接管

- `white-body` 一旦已承接主体白色背景、页面级留白或主滚动，业务页局部 wrapper 不得再次承接同级职责。
- 不要为了图表区视觉完整度，在业务页新增统一外描边、统一圆角或统一主体 inset。
- 若页面看起来需要更强的外层包裹感，必须回到 shared shell 层处理，不得在业务页局部补一层 page-level surface。

### 原则 5：组件与交互继承优先

- 命中 HiUI 已有语义组件时，默认优先复用真实组件，而不是手写等价 DOM。
- 非典型页面允许自由拼装 section，但默认先锁定 HiUI 语义组件，再组织 section；不要先造 `summaryStrip / heroCard / fieldCard / customInfoBlock`，再回头补 `Descriptions / Timeline / shared chart helper`。
- `shared component inheritance`、`style inheritance contract`、`interaction inheritance contract` 统一以 kickoff 输出和 contract 为准，不在本文件重复展开字段表。

### 原则 5.0：先做 component routing，再做容器命名

- 页面本地容器名不能替代组件选型结论；先回答“为什么是 `Descriptions` / `Timeline` / `Table` / `Alert` / `Card`”，再回答局部 wrapper 怎么命名。
- 若页面看起来像“条带 / 模块 / 卡片 / 摘要块”，先判断它是不是已有 HiUI 主表达的视觉结果，而不是立刻发明 `summaryStrip / heroCard / infoStrip`。
- 只有 rejected HiUI alternatives 与 import discipline 都已写清时，才允许进入 approved bypass 或 page-local adapter 讨论。

### 原则 5.1：非典型页面的自由拼装必须在框架内发生

- 自由拼装回答的是“一级分组如何组织”，不是“组件层级如何重写”。
- `Descriptions`、`Timeline`、`Table`、`PageHeader`、`chart-section` 等已命中的 HiUI 语义组件，默认保持为主表达。
- `标题邻接次要信息`、`摘要指标`、`详情字段主表达` 是三个不同层级；不要因为都长得像 `label + value`，就把标题下的紧凑元信息直接升级成 `Descriptions`。
- 标题下紧邻的补充元信息默认走 `secondary info band / meta row` 一类紧凑表达；只有当该字段组承担页面主详情正文时，才进入 `Descriptions / SchemaDescriptionsBridge` 语义。
- 反向也成立：已经承担详情主表达的字段区，不要为了贴近标题节奏而降级成一条 meta row、几列紧凑字段带或自造 `infoStrip`。
- 非设计稿显式要求且未在 deviation 中说明前，不新增 `heroCard`、`fieldCard`、`summaryStrip`、`mediaCard` 一类独立身份容器去替代 archetype 主表达。
- page-level `20`、白底主体、图表 safe-area、状态渲染和 shared color/token baseline 仍优先复用现有规范，不在页面本地重新发明一套。
- 共享壳 props 只承接 marker、data 属性和非几何类钩子；页面源码不得通过 `pageRootStyle`、`whiteBodyStyle`、或带 `style` 的 `pageRootProps / whiteBodyProps` 改写 shared shell 的 padding、white-body inset 或 scroll ownership。若几何确实不同，必须回到 shared shell 层新增或切换变体。

### 原则 5.2：共享页头 ownership 不因非典型而放宽

- 若 `base archetype` 已有真实 `PageHeader` / host header carrier，非典型页面默认继续复用同一条页头承接链。
- 业务页只填 `title / onBack / extra` 等槽位，不重建第二套标题壳，也不在内容区再造可见 header 白条。
- 若页面存在返回路径，默认优先落在 `PageHeader onBack`；不要在 `extra` 再重复放“返回列表 / 返回上一页”一类回退按钮，除非 deviation 已明确批准双入口。
- 业务页不得通过 `classNames`、`styles`、本地 `.hi-v5-*` 选择器或其它内部 slot 覆写方式去改 `PageHeader`、`Descriptions`、`Timeline`、`Table` 等公共组件骨架；统一基线只能在宿主 carrier、shared shell 或 archetype 层处理。
- 对 detail-shell 中的 `Descriptions`，允许且要求通过组件 props 显式声明布局不变量；不允许再用页面级 `.hi-v5-*` / `th` / `label` CSS 补救上游默认值漂移。

### 原则 6：国际化默认纳入生成边界

- 页面标题、按钮文案、列标题、字段 label、placeholder、反馈文案、图表标题默认来自 locale 资源或上游 i18n bridge。
- 日期、时间、数字、金额、百分比、排序与大小写处理默认走 locale-aware formatter / API。
- RTL 与文本膨胀容错是默认边界，不是可选优化。

### 原则 7：图表与表格走专门约束

- 任何页面中新增的图表，都必须遵循共享图表主题、color contract、chart stack 与页型专章中适用的图表要求；只有当图表形成独立分析区时，才必须额外声明受管 `chart-section`。
- 表格场景必须满足 `QueryFilter`、`FilterDrawer`、`Table.resizable`、`Table.setting` 等硬门槛。
- 这些条目是否可用、如何验收，分别以 kickoff 输出、contract 字段和 validation evidence 为准；本文件不再重复展开枚举。

### 典型页插图表决策顺序

- 当 `table-stat`、`full-page-detail`、`tree-split` 或其它受管页新增图表时，先确认原 `page type` 是否保持不变，再确认新增图表是否只是页面内图表，还是已经形成独立 `chart-section`。
- 若图表形成独立 `chart-section`，先冻结 `content-slot / white-body / outer-padding / main-scroll` ownership，再锁定共享 chart baseline、color contract 与 chart body carrier。
- 若图表尚未形成独立分析区，仍必须遵循全局图表规范；不要因为它停留在原页型内部，就回退到库默认 theme、palette 或局部 primitives。
- 只有当页面主体已经变成“指标卡 + 多图表 + 明细表 / 明细分析区”时，才应升级为 `data-visualization`；不要把页型升级与是否遵循图表规范混为一谈。
- 不要先把图表画出来，再回头补 `white-body`、ownership 或 region marker；也不要把“图表插入成功”误当成“图表规范已经满足”。

### 原则 8：真实浏览器证据优先于静态通过

- `build`、`lint`、`doctor`、source gate、contract pass 都不能替代真实页面 / DOM / 控制台 / 视觉核验。
- 命中真实 DOM 行为场景时，必须补浏览器级 smoke 或等价校验。

## 禁止路径

- 先改 JSX，再回头补 `page type`、`example path`、`host archetype path`。
- 把 `doctor` 当成第一页实现前的主判断器。
- 只在 comment、变量名或 contract label 里写 `shell=...`，却不回答真实承接链。
- 顶层已经有真实 app host，还在业务路由 element 上再包 `ExampleAppShell`，或在业务页内重建第二套 host provider。
- 因为宿主已有旧列表页 / 搜索壳 / 抽屉壳，就跳过页型专章要求的 mandatory components。
- 因为右栏包含详情、指标、Tabs、表格，就把 `context-main-split` 回退到 `ProDetailPage` / `ProEditPage` / 通用 page-scroll 壳，再手写一套“像 split”的 `workspace / leftPane / rightPane / splitter`。
- 把业务页写进 `examples/host-integration/**`、`src/typical-page-reuse/**` 或示例 route config，除非任务明确要求做示例接入。

## 文档边界

- `ai-kickoff-template.md` 只保留首轮输出格式。
- `contract-regions.md` 是 contract 字段唯一事实源。
- `implementation-checklist-template.md` 只保留组合页增量要求。
- `validation-checklist.md` 只保留页面质量验收证据与页面完成门槛。
- `PRIVACY.md` 只保留 `preview_ready` 统计收口与最终回复前动作。

若需要新增字段、调整 contract 结构、改变页面完成门槛或改变统计收口流程，优先修改对应事实源，不要在本文件与其它文档中平行复制。
