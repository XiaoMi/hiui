# 非典型页面

## 这份文件负责什么

这份文件只负责两件事：

1. 判断何时进入“非典型 / overlay 布局推理”路径
2. 定义 `layout strategy`、`layout archetype` 与布局 ownership 的解释口径

它不负责：

- 重复列出 kickoff 固定字段
- 重复定义 contract 字段形状
- 重复维护组合页增量 checklist
- 重复维护验收证据

对应事实源如下：

- 首轮输出格式：`ai-kickoff-template.md`
- 生成原则与阶段门槛：`../../rules/generation-rules.md`
- contract 字段唯一事实源：`../../rules/contract-regions.md`
- 组合页增量要求：`implementation-checklist-template.md`
- 验收证据：`../../rules/validation-checklist.md`
- 超出最小速查后的组件选型：`hiui-v5-component-map.md` 与 `non-typical-component-routing.md`

## 何时进入非典型页面路径

进入本文件前，必须先完成机器计划里的 `topology` / `intentUnits` / `pageUnits` 判断。禁止因为 `pageType` 为空、提示词包含多个页面名、或用户没有显式写典型页型，就直接进入非典型路径。

进入非典型路径前还必须先判断能否由“典型页 + 受控扩展”承接：

- 标准槽位变更属于 Level 0，不进入非典型。
- 顶部提示、辅助链接、状态 badge、轻量说明条等 Level 1 受控扩展，不进入非典型。
- 只有新增独立 section、独立图表块、详情预览区、独立滚动 / 查询 / 分页等 Level 2 结构扩展，才进入增强链路。
- 只有 split、主从联动、多工作区、自定义 dashboard 等 Level 3 结构变化，才进入本文件定义的 non-typical / composition 重流程。

满足任一条件即可进入：

- 现有典型页型没有可直接套用的 archetype
- 虽有近似 archetype，但强行套用会误导页面一级结构组织
- 页面核心信息组织方式无法被现有典型页壳稳定承接

不要误判：

- 非典型页面不等于页型尚未解析
- 非典型页面不等于多页面工作流
- 非典型页面不等于详情页
- 非典型页面不等于主次分栏页面
- 非典型页面只说明“不能直接套典型页模板”，不说明“必须采用某一种布局”

下面这些默认不是非典型页面：

- 一个提示词中并列出现多个页面意图，例如查询页、详情页、编辑页、统计页、评审页、配置页或日志页
- 列表页带查看详情、评审、编辑等行操作
- 典型页基础上的 Level 1 受控扩展，例如顶部提示、轻量说明条、工具栏辅助 badge 或帮助链接
- 单个详情、编辑、表单、统计、树表或异常反馈页面
- 同屏主从 / split 布局的早期判断阶段；它应先进入组合页 contract，而不是自由非典型拼装

## 自由拼装的边界

非典型页面允许自由拼装，但这里的“自由”只表示：

- 一级分组可以脱离典型页默认排法
- 阅读路径、主辅关系、局部补充区组织方式可以按业务重新编排
- 可以在 archetype 允许的范围内补充非模板化 section

它**不**表示：

- 可以替换原 `page type` 的 base archetype
- 可以降低 HiUI 语义组件优先级
- 可以绕开 shared token、shared helper、shared chart baseline
- 可以把 archetype 已有的共享页头 / leading 返回语义改写成页面局部标题块或右侧返回按钮
- 可以在业务页链路里通过 `classNames / styles` 或本地 `.hi-v5-*` 选择器重写 `PageHeader`、`Descriptions`、`Timeline` 等 HiUI 公共组件骨架
- 可以重新分散 `white-body`、`outer-padding`、`main-scroll` 的 ownership
- 可以通过 `pageRootStyle`、`whiteBodyStyle`、或带 `style` 的 shared-shell props 去改写共享壳层几何
- 可以用摘要卡、字段卡、空白 filler 或额外壳层去替代现有规范

默认约束统一按下面口径理解：

- non-typical means custom grouping, not custom component hierarchy
- free composition is allowed only inside a HiUI-first, spec-constrained frame
- 组件优先级、视觉 token、spacing ownership、禁止大段空白、runtime shell requirements 仍然是硬门槛

## 策略驱动生成门槛

非典型页面必须先证明“为什么不能直接套典型页”，再进入 JSX / 样式实现。这里的证明不是固定某个区块组合，而是把页面的一层信息组织策略落成机器可追踪事实。

进入 `non-typical / overlay` 路径时，`page-task-plan.v1` / contract / source markers / runtime markers 必须共用同一组事实：

- `layout strategy`：本页采用的布局策略，例如工作台式详情、流程追踪式详情、看板式详情、决策辅助式详情、对比分析式详情、时间线式详情等。不要新造一套与本字段平行的 `informationStrategy`。
- `layout archetype`：本页复用或翻译的布局原型，例如 `primary-secondary`、`parallel-sections`、`context-main-split`、`detail-workbench` 等。
- `non-typical scope`：只说明哪些一级组织需要非典型编排；不要把 header、white-body、main-scroll 等关键壳层纳入自由范围。
- `composition guardrails`：说明允许自由组合的槽位、禁止替换的 carrier、禁止重写的 HiUI 骨架。
- `strategy evidence`：说明源码和运行时需要出现哪些布局 marker / 语义组件 / 一级分组来证明策略已兑现。

阻断规则：

- 用户明确要求非典型，但计划无法给出 `layout strategy` 与 `layout archetype` 时，必须 `status=blocked` 补业务意图，不能降级为自由拼装。
- 若页面只声明 `non-typical-overlay`，但没有策略、范围、guardrails 与 evidence，contract 不完整，不得交付。
- 若生成结果只剩标准 `Descriptions / SchemaGroup` 字段分组，且没有策略证据，应按“非典型退化成典型详情”处理。
- 不允许把“顶部摘要 + 主区 + 右侧栏”固化为所有非典型详情的必备结构；它只能是 `detail-workbench` 等策略下的一种证据组合。

## 页头生成边界

页头属于 carrier-critical region，非典型自由拼装不得覆盖它。业务页面只能替换页头的业务槽位，不能拥有页头承载方式或几何。

生成规则：

- 页头必须来自已有示例、受管 mold、shared shell 或已认证 host adapter。
- 业务页不得定义本地 header portal、不得直接 `createPortal` 注入 `PageHeader`、不得自定义 `HeaderPortal / PageHeaderPortal` 变体。
- 业务页只允许替换 `pageTitle`、`headerExtra`、`onBack`、`statusText`、`primaryAction` 等业务槽位。
- `PageHeader` 高度、padding、align-items、portal carrier、`.hi-v5-page-header*` 骨架样式属于锁定区域。
- 若当前宿主没有可复用页头 adapter，必须先补 adapter / 示例，再生成业务页；不得在业务页临时手写页头。

### Host-slot shell 根容器规则

当项目已经通过 `TypicalPageAppFrame`、宿主 layout outlet、或等价 host bridge 承接 `content-slot` 与 `main-scroll` 时，非典型页面默认走 `host-slot-shell`：

- `content-slot / outer-padding / main-scroll` 同向归 `host-slot`
- `white-body` 默认为 `none`，除非宿主或共享壳明确提供连续白底主体
- 业务页根节点只能负责布局填充，如 `display / flex / grid / min-height / min-width`
- 业务页根节点不得补 page-level `padding / background / border-radius / overflow:auto|scroll`
- 模块间距只能落在真实局部容器，如 `section-body / card-body / metric-grid / table-body`

若业务页确实要自己承接 `outer-padding`，它必须同时成为连续的 `white-body / page-surface` owner；不允许只把 `outer-padding` 切到 `page-root`，而让 `content-slot` 与 `main-scroll` 继续归宿主。

当页面所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时，再额外遵守：

- 先做 component routing，再开始 JSX
- 先回答 `primary semantic components`，再考虑局部容器长什么样
- 先排除 `Descriptions / Timeline / Table / Tag / Alert / Card` 等现成语义组件，再讨论是否需要自定义容器
- 不要因为设计稿看起来是“卡片感 / 条带感 / 模块感”，就直接发明 `heroCard / infoStrip / customInfoBlock`

## 外部项目中的非 HiUI 组件

外部项目接入 `hiui-design` 时，如果局部能力必须依赖非 HiUI 组件，统一按下面口径处理：

- 只有在 HiUI 当前没有等价语义组件或 approved helper 能承接该能力时，才允许引入非 HiUI 组件
- 非 HiUI 组件只补“能力缺口”，不补“页面语义”与“页壳基线”；`PageHeader`、`Descriptions`、`Timeline`、`Table`、`Tag` 等已命中的 HiUI 主表达仍保持优先
- 非 HiUI 组件必须包在 page-local adapter / bridge 里；不要在业务页面根、共享 shell 或多个一级 section 中散落裸第三方组件
- adapter 默认只允许承接局部 `section-body` / `panel-body` / `chart-body` 样式，不得接管 `white-body`、`outer-padding`、`main-scroll`、`content-slot` 或共享页头 ownership
- 第三方组件主题必须通过 token bridge 映射回 HiUI 基线；不得直接沿用库默认 palette、默认字号体系、默认阴影、默认圆角或默认容器层级
- kickoff 中必须把 bypass reason、adapter path、token bridge path 与 forbidden local overrides 写清；缺任一项都不算进入实现阶段

默认把这类接入理解为：

- third-party provides capability, HiUI still owns semantics
- third-party stays inside adapter, not page shell
- token bridge is mandatory, library defaults are not

## 共享页头与返回语义

只要 `base archetype` 已经提供稳定 `PageHeader` / 宿主页头承接链，就按下面口径处理：

- 非典型只影响 body 的一级分组组织，不影响页头骨架 ownership
- 页面仍然优先复用共享页头 carrier，只替换 `title`、`onBack`、`extra` 这些业务槽位
- 若页面存在明确返回路径，返回语义默认落在 leading `onBack`
- 不要把返回动作降级成右侧 `extra` / `titleExtra` 工具按钮，也不要在右侧再重复放一个“返回列表”
- 右侧 action 只承接真正的业务动作，如查看流程、导出、发起协同；不要混入导航回退语义
- 业务页不得通过 `PageHeader classNames/styles`、语义 slot 覆写或 `.hi-v5-page-header*` 本地样式去改公共页头骨架；这类基线只能由宿主 header carrier、共享 shell 或包级 archetype 承接

## 非典型页面的固化生成流程

进入非典型 / overlay 路径后，生成顺序固定为：

1. 锁定 `base archetype`
2. 明确 `non-typical scope`
3. 锁定 `mandatory components`
4. 完成 `component routing`
5. 写清 `ownership contract`
6. 锁定 `shared baseline`
7. 记录 `deviation`
8. 执行 `runtime gate`

其中：

- `base archetype` 回答页面原本属于哪种典型页型或稳定页壳
- `non-typical scope` 只回答哪些一级分组可以自由重组
- `mandatory components` 回答必须保留的 HiUI 语义组件与壳层链路
- `component routing` 回答每个一级信息组优先落到哪个 HiUI 组件，以及为什么不是看起来相似的另一个组件
- `ownership contract` 回答 `content-slot / white-body / outer-padding / main-scroll / chart-section` 到底由谁承接
- `shared baseline` 回答 token、图表 helper、状态渲染、字段表达基线，以及页头 `title / onBack / extra` 的共享承接方式
- `deviation` 只记录被明确批准的例外
- `runtime gate` 回答当前页是否需要浏览器级 smoke，且不能被 `doctor` 替代

若 `mandatory components` 中存在 approved bypass，固定顺序里还要额外回答：

1. bypass 补的是哪一个能力缺口
2. bypass 通过哪个 adapter / bridge 落地
3. bypass 是否继续复用 HiUI token baseline
4. bypass 是否仍被限制在局部 section body，而没有晋升为页面级 owner

若 `layout archetype = context-main-split`，上面的固定顺序再额外插入一个不可跳过的子步骤：

1. 先锁定受管 split shell carrier
2. 再决定左右 pane 的业务内容与 section 组织
3. 最后才写 `split pane contract`、宽度总账与 runtime smoke

这里的“受管 split shell carrier”只允许回答：

- 真实 `TreeSplitPageFrame`
- 真实 `ContextMainSplitScaffold`
- 经批准的宿主 split helper / host-translated shell

若这一步答不清，就不要开始写 `workspace / leftPane / rightPane / splitter`。

## 典型页型的布局 overlay

部分典型页型仍然应保留原 `page type` 身份，但其内部一级分组组织可能已经超出默认示例排法。

此时允许复用本文件的布局推理规则，但要明确：

- 复用的是“内部一级分组组织规则”，不是“页型身份替换”
- 页面仍然保持原典型页型判定
- 原典型页型的 hard gates、mandatory components、page shell、contract 和技术栈要求仍然有效

### `data-visualization` 的默认口径

`data-visualization` 仍优先视为典型页型。只要页面主体仍然是“指标卡 + 图表区 + 明细表 / 明细分析区”，就不要直接改判成非典型页面。

但若内部一级分组组织明显超出默认示例，例如：

- 图表区之外混入大量洞察摘要、异常提醒、趋势解读、业务动作建议
- 主图表 / 主分析区与补充图表之间已经出现明显主辅关系
- 图表与洞察模块的并列关系、主次关系或分区扫描方式不再适合示例默认编排

则允许在保持 `page type: data-visualization` 的前提下，额外补 `layout strategy` 判断。

这里的 `layout strategy` 只负责内部一级分组组织，不替代 `page type`，也不豁免 `data-visualization` 本身的单一白底工作区、`chart-section`、图表技术栈与指标语义等硬门槛。

## 进入实现前的最小事实确认

只要页面进入非典型 / overlay 路径，生成前至少确认下面几类事实；这里不再平行维护另一套 kickoff / contract 字段表：

- 页面仍绑定唯一 `base archetype`，没有因为进入非典型路径而改写原页型身份
- `non-typical scope` 已锁定，明确哪些一级分组可以自由重组，哪些仍受原 archetype 约束
- 必保留的 HiUI 语义组件与共享壳层链路已经锁定，不会因为自由编排而降级
- 组件选型已确认：写清 `primary semantic components`、`rejected alternatives`、`why not custom container` 与 `import path discipline`
- ownership 已确认：`content-slot / white-body / outer-padding / main-scroll`，以及含图表时的 `chart-section`
- 若页面同时出现标题、状态、次要信息、摘要指标与详情字段，已经先区分 `title secondary info`、`metric summary`、`detail body`；不要把标题下元信息误判成 `Descriptions`，也不要把详情主表达降级成标题信息带
- `shared baseline` 与 approved bypass 边界已确认；若存在第三方组件，已经说明 capability gap、adapter / bridge、token bridge，以及它没有接管页面级 owner 的证据

若以上任何一类事实仍说不清，就不要直接开始 JSX 拼装。

其中：

- 页头与返回语义默认仍复用共享 `PageHeader` carrier / 宿主页头链路，除非已有书面例外
- 第三方 bypass 只能停留在局部 `section-body / panel-body / chart-body`，不能晋升为 `white-body / outer-padding / main-scroll` owner

## 一级分组定义

这里的“一级分组”统一按下面口径判断：

- 页面一级结构块
- 能独立命名标题
- 在阅读上承担一个独立信息任务
- 不是卡片内部的小字段组，也不是纯装饰容器

计数时额外遵守：

- 一个标题下的一组 KPI / 标签 / 字段，只要共同服务同一阅读任务，默认只算 `1` 个一级分组
- 标题、状态标签与紧邻标题的次要信息带若共同服务同一对象识别，默认仍算同一个一级分组；不要把这条信息带误升格成独立详情分组
- 紧邻标题的次要信息带不同于详情正文 `Descriptions`；只有当字段组承担主详情表达或被明确组织为独立详情 section 时，才算详情分组
- 纯布局包裹层、背景层、间距层不计入一级分组

## 三种布局策略

### `linear-stack`

适用：

- 一级分组较少
- 阅读路径单线
- 用户按从上到下顺序理解页面

默认判断：

- 一级分组 `<= 5` 时，优先考虑 `linear-stack`

### `parallel-sections`

适用：

- 一级分组较多
- 多数分组处于同一层级
- 页面强调并列浏览、分区扫描或平权比较

默认判断：

- 一级分组 `> 5` 且多数分组处于同一层级时，默认 `parallel-sections`

补充口径：

- 允许部分高信息量一级分组 `full-span`
- `full-span` 的意义是“它仍属于并列结构，但扫描优先级或信息密度要求它独占一行”

### `primary-secondary`

适用：

- 一级分组较多
- 存在明显主信息与辅助信息分层
- 用户需要先抓主线，再查看辅助信息

默认判断：

- 一级分组 `> 5` 且多数分组处于不同层级关系时，默认 `primary-secondary`

补充说明：

- “不同层级关系”指页面存在明确主线分组，其他分组更多承担补充、支撑、提示或辅助判断作用
- `secondary` 应承接稳定的辅助阅读线，而不是轻量块的临时收纳区
- 不要因为需求里写了“3 个指标”就直接落成固定等宽三列；先判断这些指标是否真的适合继续留在 `secondary`

### `primary-secondary` 的结构闭合

当页面采用 `primary-secondary` 时，再额外按下面口径判断：

- 若分栏后方没有同级通栏主内容，允许主栏长于副栏
- 若分栏后方仍有同级通栏主内容，当前分栏区必须先完成视觉闭合，再进入下一块
- 这里的“视觉闭合”指：主栏与副栏作为同一个一级结构块，应在进入下一块通栏内容前落到同一视觉底线

闭合必须通过重组结构实现，不允许：

- 用默认 `stretch` 制造等高
- 用 `height: 100%`、`min-height: 100%`、固定补高去追平 sibling
- 用空白占位块、空卡片、无信息 filler 伪造闭合

优先重组手段：

- 把轻量总览指标组抽成通栏摘要带
- 把更适合独立阅读的一级分组提升为 `full-span`
- 把当前区块拆成“通栏摘要带 + 分栏主体 + 通栏后续”三段
- 把并不承担辅助阅读任务的内容移出 `secondary`

## 判断口径

- 一级分组数量是默认信号，不覆盖明显的层级关系判断
- `<= 5` 不是绝对硬阈值；若层级关系非常明确，仍可进入 `primary-secondary`
- `> 5` 也不意味着必须分栏；若阅读路径仍然单线，可继续采用 `linear-stack`

## 非典型布局骨架

`layout strategy` 只回答“一级分组如何组织”，不回答“页面是否命中某种稳定结构骨架”。

若页面在非典型路径下仍命中稳定结构骨架，必须额外显式写出 `layout archetype`。当前默认支持：

- `context-main-split`

### `context-main-split`

定义：

- 稳定左右双栏
- 左右栏独立滚动
- 默认支持用户通过分隔条拖拽调整左右宽度分配
- 左栏承担“选择 / 缩小范围 / 建立上下文”
- 右栏承担“主任务区”
- 页级动作归 `PageHeader extra`
- pane 内 spacing 只能由各自真实 region owner 承接，不得提升成 page shell padding

适用：

- 左树右表
- 左列表右详情
- 左卡片右详情
- 左侧负责上下文建立 / 范围收敛，右侧负责主任务区的 split 页面

不适用：

- 左右两栏只是平权并列展示，没有明确 context / main 分工
- 双栏只是局部 section，而不是页面一级结构骨架
- 页面直接命中现有典型页壳且不会误导结构翻译

实现语义：

- `context-main-split` 的自由只发生在 pane 内一级分组组织，不发生在 split 壳 ownership
- 若项目已有受管 split scaffold / page frame，业务页只替换 left/right slot 内容，不重建 split 根壳
- 若页面不能直接挂标准 split 壳，至少显式回答 `split shell inheritance strategy` 与 `split shell carrier path`
- `split-workspace` 不是纵向滚动 owner，左右 pane 才是
- 左栏默认回答“默认宽度 / 默认比例”，而不是不可变死宽
- page root / workspace 不应重新抢走 `overflow-y`
- 横向滚动若存在，应继续收口在表格或局部内容容器内，而不是把 `workspace`、`right pane` 或页面主体横向撑破

红线：

- 不要用自带整页 `overflow:auto` / 固定高度语义的壳去承接 `context-main-split`
- 不要把 `ProDetailPage`、`ProEditPage` 或通用 `page-scroll` 壳当成 `context-main-split` 的顶层 carrier
- 不要因为右栏有详情、指标、tab、表格，就把 split 壳降级成“像 split 的结构”
- 若已有受管 split scaffold / page frame，不要在业务页重造 `workspace + leftPane + rightPane + splitter`
- 不要为了补局部留白，在 `workspace` 或页面根统一加一圈通用 `padding`
- 不要先按“看起来像双栏”落结构，再回头补 scroll owner；scroll owner 未明确前，按不可实现处理

## ownership 解释口径

非典型 / overlay 页面仍然必须维持单一 owner 语义，但字段名称与 contract 形状统一看 `../../rules/contract-regions.md`。本文件只解释这些 owner 在布局上的含义：

- `content-slot owner`
  谁在承接宿主内容槽语义。若宿主已稳定提供内容槽，优先让宿主继续承接。
- `white-body owner`
  谁在承接主白底主体。不要让宿主 slot、页面根和局部 section 同时承担。
- `outer-padding owner`
  谁在承接页面外层留白。局部 region 的 spacing 不得提升成壳层 `padding`。
- `main-scroll owner`
  谁在承接页面主滚动链。若页面属于 split archetype，通常不应把它解释成左右 pane 的替代品。

解释这些 owner 时，重点不是“字段怎么命名”，而是回答：

- 页面外层留白到底由谁负责
- 主白底主体到底由谁负责
- 纵向主滚动到底由谁负责
- 某层 `workspace / container / shell / body` 是否真的有资格承接这些职责

若回答不清，就先回到 `contract-regions.md` 补事实，不要继续写页面容器。

## 源码与运行时标记

非典型 / overlay 页面需要把布局事实同步到源码与运行时。

### source markers

- `hiui-design non-typical: true`
- `hiui-design layout strategy: ...`
- `hiui-design layout archetype: ...`

ownership、`split pane contract` 等 contract 字段形状，统一按 `../../rules/contract-regions.md` 落盘，不在本文件重复定义。

### runtime markers

- 页面根：
  - `data-hiui5-layout-strategy="..."`
- 布局分组容器：
  - `data-hiui5-layout-group="..."`
- 若采用 `primary-secondary`：
  - `data-hiui5-layout-region="primary"`
  - `data-hiui5-layout-region="secondary"`
- 每个一级分组：
  - `data-hiui5-layout-item="true"`
- 若 `parallel-sections` 中某分组需要独占：
  - `data-hiui5-layout-span="full"`
- 若 `layout archetype = context-main-split`：
  - `data-hiui5-layout-group="context-main-split"`
  - `data-hiui5-region="left-context"`
  - `data-hiui5-region="right-main"`

## 与其它文档的配合方式

### kickoff

首轮输出的固定顺序和字段名，只看 `ai-kickoff-template.md`。

当页面进入非典型 / overlay 路径时，只是说明 kickoff 中需要补非典型事实；不要在本文件再维护另一套起手模板。

这里的“非典型事实”至少包含两层：

- 布局事实：`layout strategy`、`non-typical scope`、`layout archetype`、`composition guardrails`
- 组件路由事实：当所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时，额外补 `primary semantic components`、`rejected alternatives`、`why not custom container` 与 `import path discipline`

### contract

`split pane contract`、ownership 映射、region mapping、semantic contract 的字段形状，只看 `../../rules/contract-regions.md`。

尤其是 `context-main-split` 相关的 contract 结构，统一以那份文档为准；本文件只解释它为什么成立、什么时候成立、以及布局上意味着什么。

### 组合页增量要求

宽度总账、固定列降级、runtime smoke plan 等组合页增量要求，只看 `implementation-checklist-template.md`。

### 验收
页面质量验收证据、真实页面核验与页面完成门槛，只看 `../../rules/validation-checklist.md`。

若当前任务生成或实质性修改了页面，最终回复前的统计收口再看 `PRIVACY.md`。

## 配套阅读

- `../../rules/generation-rules.md`
- `../../rules/contract-regions.md`
- `implementation-checklist-template.md`
- `../../rules/validation-checklist.md`
- `PRIVACY.md`
- `layout-anti-patterns.md`
