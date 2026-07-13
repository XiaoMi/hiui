# 数据可视化

`data-visualization` 的生成策略固定为 `managed-analytics`。它可以有典型页面示例和受管承载组件，但不走普通 `page-component-only` 流程；页面组件只负责页头、单一白底主体、指标区、图表区、明细表区、滚动和间距，真正的图表表达由 `chart usage contract`、数据可视化 token 与图表组件规则决定。

## 何时使用

- 页面主结构是“指标卡 + 多图表 + 明细表”
- 需要在同一白底工作区里承接趋势、构成、排行、双轴、漏斗等多种图表
- 图表只是页面主体，不是某个表格页里的附属小卡片

若普通表格页中新增局部辅助图表，先归类为 `analytics-extension`；只有当图表形成独立业务分析块、多图表阅读线或“指标卡 + 多图表 + 明细表”的主体结构时，才升级为 `managed-analytics`。

## 示例起点

- `examples/host-integration/src/pages/data-visualization.tsx`
- 共享规则继续复用 `table-shared.md`

## 壳层

- 固定页壳：`StatListPageFrame`
- 不要退化成普通 `table-stat`
- 不要退化成自由拼接的图表墙
- 即使沿用 `StatListPageFrame`，默认也不要直接套用 `table-stat` 的“表体独占纵滚 + 吸底分页”实现；除非示例页或宿主 contract 明确要求，`data-visualization` 应保持单一白底主体内的页面级纵滚，让图表区和明细表顺着同一阅读流自然出现

## 实现顺序

`data-visualization` 的安全实现顺序固定为：

1. 读取项目 mode lock 与 `page-task-plan.v1`
2. 锁定 `generationStrategy=managed-analytics`
3. 锁定 `page type` 与 `shell inheritance`
4. 冻结 `white-body / outer-padding / main-scroll` ownership
5. 写 `chart usage contract`
6. 判断内部 `layout strategy`
7. 最后才进入业务 JSX 与图表配置实现

注意：

- 第 5 步前置的是“图表职责判断”，不是“图表容器实现”
- 不要把“先想图表”执行成“先搭图表壳层”
- 不要为了安放图表，在 `white-body` 外额外新增页面级白底、描边、圆角或统一 inset 容器

## 图表使用契约

命中 `data-visualization` 时，图表不是装饰性占位，也不是示例同构复制项。
进入实现前，必须先为每张图写清：

- 这张图回答哪个业务问题
- 它属于哪一种信息任务：`trend / comparison / composition / process / relationship / status`
- 为什么选择当前图，而不是相邻替代图
- 它位于哪条阅读线：`summary / primary / secondary / full-span follow-up`

未完成上述映射时，不得直接复用示例图表网格开始业务实现。

## 结构 P0

- 保留页头、筛选区、指标卡区、多图表区、明细表区
- 指标卡、图表和明细表必须位于同一白底工作区
- 图表卡片可以分多行，但不要拆成第二层主白卡工作区
- 明细表仍是页面的一部分，不要挪成独立二级页
- `query-filter` 在 `data-visualization` 中默认表示“图表控制条 / dashboard control strip”，不等于“必须用真实 QueryFilter”
- 若这一行承担的是 `日 / 周 / 月 / 年`、指标视角、统计粒度或图表视图切换，默认使用 `Radio.Group / Tabs / Segmented` 这类切换控件；只有真实筛选字段才使用 `QueryFilter`
- 明细表上方若还存在记录级筛选、关键词搜索、全部筛选抽屉，则该区域仍按 `table-shared.md` 使用真实 `QueryFilter + FilterDrawer`
- 对受管页 contract，默认把这条约束写成：`semanticContract.queryFilterRegionRole = dashboard-control-strip`；不要因为 contract 有 `query-filter` region 就自动生成 `QueryFilter`
- 对受管页 contract，默认把统计页防退化约束写成：`semanticContract.listShellComposition = forbid-table-list-scaffold`；不要把 `data-visualization` 借道 `ProListPageProvider / TablePageFrame / searchConfig` 生成成“带图表的列表页”

## 主体骨架保护

- 主体白色背景默认由既定 `white-body` 连续承接
- 指标卡区、图表区、明细表区必须继续落在同一主体白色背景之内
- 不要为了图表区完整感，在业务页新增第二层页面级 surface
- 图表卡内部的 `padding / border / radius` 只属于卡片内部，不属于页面主体骨架
- 这里的“骨架”特指主体白色背景承接层，即 `white-body` 与其 page-level geometry；它不等于一级分组，不等于图表卡，也不等于局部 section 容器

## 图表技术栈硬门槛

- 默认沿用 `examples/host-integration/src/pages/data-visualization.tsx` 的图表实现基线：真实 `@ant-design/charts`
- 下列视觉与交互基线不只约束 `data-visualization`，任何 `hiui-design` 受管页只要实际渲染图表并声明 `chart-section`，都必须一起遵守
- `legacy-host-compatible` / `rules-only` 也不能把 `chart-section` 降级成手写 `svg`、`canvas`、纯 CSS 走势线或其他“视觉近似图”
- 若目标项目尚未安装 `@ant-design/charts`，或运行时/打包链无法承接该依赖，先停下补依赖与宿主兼容方案；不要继续生成业务页再用 primitives 顶替
- 除非需求文字明确允许偏离，否则面积图、柱状图、饼图、雷达图、双轴图等都应继续使用 `@ant-design/charts` 或与其同源的受控 wrapper；“能画出来”不等于“满足页型要求”
- 图表主题、颜色、坐标轴、tooltip、legend 和交互节奏默认跟随示例页的 HiUI 图表主题，不要回退到库默认皮肤
- 业务页必须通过共享 helper 继承上述基线：默认使用 `withHiuiResponsiveChart` / `withHiuiMiniChart`；不要在业务页重新拼 theme 对象，更不要直接省略 theme
- `Column`、堆叠柱、分组柱、双轴图中的柱形 interval 默认复用 `createHiuiColumnLikeScale`、`createHiuiColumnLikeColorScale` 或 `withHiuiColumnLikeChart`，保持柱形与间隙 `1:2`
- `Bar` 默认复用 `createHiuiBarLikeScale`、`createHiuiBarLikeColorScale` 或 `withHiuiBarLikeChart`，保持条宽与间隙 `1:1`
- 面积图默认不展示数据点、marker、symbol 或逐点高亮；除非需求、设计稿或 contract 明确要求，否则禁止开启 `point`、自定义点样式或沿折线默认点标记输出
- 指标卡、图表卡和其他紧凑分析卡默认沿用 `紧凑卡片` 基线：`1px solid #E6E8EB`、圆角 `8px`、内边距 `16px`；不要沿共享 helper 默认值或页面局部样式把这些卡片放大成 `12px / 16px` 圆角表面
- 指标卡、图表卡和其他紧凑分析卡默认沿用 `紧凑卡片` 基线：`1px solid #E6E8EB`、圆角 `8px`、内边距 `16px`；不要沿共享 helper 默认值或页面局部样式把这些卡片放大成 `12px / 16px` 圆角表面

## 图表选型口径

- 先判断信息任务，再决定图表类型；不要从“哪个图更好看”出发选图
- 总览型信息优先使用指标卡、摘要卡；不要先手把可扫读指标做成图表
- 同一张图表默认只回答一个主问题；不要在一张图里混合趋势、构成、排名、过程等多个核心任务
- 图表标题必须能直接说明这张图回答的问题，例如“近 30 天销售额趋势”“各渠道流量占比”“重点区域销售额排名”
- 看 `单个指标` 的时间趋势，默认优先 `面积图`
- 看 `多个指标` 的时间趋势对比，默认优先 `折线图`
- 看 `多个指标的构成随时间变化`，默认使用 `堆叠面积图`
- 单指标若属于比率型、评分型、指数型，且重点是走势、波动、阈值穿越而不是体量感，可优先 `折线图`
- 多系列若没有明确“构成演变”任务，不得为了视觉丰富而使用面积图叠加

### 对比与构成补充

- 分类项不多的单时点对比，默认优先 `柱状图`
- 排名 / Top N / 长类目名称的并列比较，默认优先 `条形图`
- 同一类目下比较多个系列，默认优先 `分组柱状图`
- 单一时点的占比构成且类目较少，可使用 `环图 / 饼图`
- 既要看总量又要看内部构成，可使用 `堆叠柱状图`

### 过程与关系补充

- 阶段型流程转化，默认优先 `漏斗图`
- 行为记录、审批轨迹、物流轨迹、关键事件流，优先 `Timeline`；不要手写等价 DOM 伪复用
- 目标达成、进度完成、阈值状态，优先 `Progress` / `Gauge`；不要用仪表盘替代趋势图
- 看相关性、聚类、离群点，可使用 `散点图 / 气泡图`
- 看高密度矩阵分布，可使用 `热力图`
- 少量对象的多维画像比较，可使用 `雷达图`
- 地理位置本身是关键分析维度时才使用 `地图`；若只是区域对比或区域排名，通常优先 `条形图`

### 表格角色

- 表格是图表后的精确明细承接层，不是图表的替代品
- 当用户需要筛选、排序、导出、下钻到具体记录或对单条数据执行操作时，最终应回到表格
- `data-visualization` 页的推荐阅读路径通常为：摘要带 -> 主图表 -> 辅助图表 -> 明细表格

## 图表配色 Contract

- 配色策略默认遵循：`保留 Ant Design Charts / G2 的分配结构，不照抄其原始 hex；HiUI 负责提供最终受控色值`
- 禁止把“找最相近 hex”理解成逐个颜色的机械替换；映射时必须同时考虑图表角色、HiUI 语义角色与同图区分度
- 项目若封装共享 chart theme，应直接暴露图表色槽；业务页优先复用共享 helper，不要退回图表库默认色板
- 对本地化后的 `series / label / type / team / phase / stage` 文案，默认把文本只放在 `colorField` 与 `scale.color.domain`；不要把中文标签直接从 `color` / `fill` / `stroke` 回调返回给图表库
- 多分类图默认优先显式绑定 `domain -> range`，例如复用 `createHiuiCategoricalDomainScale([...domain], [...range])`；不要只给 `range`，更不要把系列名传进 `resolveHiuiSeriesColor(...)` 试图“猜颜色”

### 色槽定义

- `chart-primary`：`#2660FF`
- `chart-primary-hover`：`#4D82FF`
- `chart-primary-strong`：`#1843D2`
- `chart-primary-wash`：`#EDF2FF`
- `chart-primary-soft-wash`：`#E5ECFF`
- `chart-info`：`#04C2AC`
- `chart-success`：`#24B237`
- `chart-warning`：`#FFBE0A`
- `chart-danger`：`#FA4646`
- `chart-text-secondary`：`#4E5969`
- `chart-border`：`#E6E8EB`

### 默认分配口径

- `单序列`：默认使用 `chart-primary`；面积图描边与面积填充必须绑定到同一颜色槽，默认写成 `chart-primary + fillOpacity: 0.2`
- `双序列`：默认固定顺序 `series-1 -> chart-primary`、`series-2 -> chart-info`；顺序应由主次阅读关系决定，不得跟随接口返回顺序漂移
- `多分类`：默认固定槽位顺序 `chart-primary -> chart-info -> chart-primary-hover -> chart-warning -> chart-success -> chart-primary-strong`
- `语义态`：`success / 完成 / 健康 / 达标 -> chart-success`，`warning / 待处理 / 临界 / 关注 -> chart-warning`，`danger / 风险 / 异常 / 失败 -> chart-danger`
- `当前值 / 参考值` 这类稳定标签，优先使用显式 `category -> color slot` 映射，而不是仅依赖 palette 顺序

### 禁止项

- 不要直接照搬 `Ant Design Charts / G2` 的原始 hex 到业务页
- 不要让颜色跟随排序、筛选、接口返回顺序自动漂移
- 不要在同一 legend 维度中混用“普通分类色板”与“状态语义色板”而不声明规则
- 类目数超过 `6` 时，不要继续扩容新颜色；优先合并长尾类目、拆图或调整信息架构

## 指标卡与文案硬门槛

- 指标卡必须保持 HiUI 典型页的白卡 + 描边基线；全局装饰限制统一遵循 `rules/page-governance.md` 与 `../hiui5-visual-baseline.md`，不要把统计页指标卡升级成强装饰 surface
- 指标卡若存在选中态，默认只允许通过描边、轻量背景色、字重或图表联动来表达；除非需求、设计稿或 contract 明确要求，不允许把选中态做成渐变卡
- 页面中不允许出现需求、设计稿、contract 或示例语义之外的额外文案与派生统计；默认禁止自行补分组副标题、解释性说明、累计值、峰值、周期均值、同比环比总结卡或其他衍生指标
- 若需求只描述“指标卡 + 图表 + 明细表”，则页面只能输出被明确点名的指标卡、图表和明细表内容；不得因为图表库默认能力、统计页习惯或 AI 补全倾向额外生成摘要卡或说明文案
- 页面可见区域默认只承载业务语义内容；示例生成提示词、图表实现说明、配色 / 交互 guideline、验收提醒等 `demo-only` 文本不得直接出现在图表卡、指标卡、页头或正文里
- 若示例页为了演示接入保留“复制提示词”“示例导出”这类工具动作，必须明确标注为 `demo-only tooling` 并与业务页默认 header action 隔离；受管业务页默认不继承这类动作

## 禁止项

- 不要手拼 `PageHeader + 多层 Card + 默认图表主题`
- 不要把每一张图都包成新的页面级主白卡
- 不要把图表区与表格区拆成两个独立路由或两个独立工作区
- 不要让图表区和表格区各自拥有一套主滚动
- 不要让 `outer-padding`、`white-body`、`stat-section/chart-section` 同时承接 16px+ 页面节奏；统计页只能有一个 page-level spacing owner
- 不要以“当前仓库没装图表库”“legacy-host-compatible 要保守一点”“先画个趋势占位”作为理由绕过 `@ant-design/charts` 基线
- 不要把示例页里的真实图表替换成手写 `svg path`、`canvas`、绝对定位 `div` 或静态图片
- 不要在面积图上默认打开数据点
- 不要给单序列面积图散落多个 `fillOpacity` 变体；默认就是同色描边 + `0.2` 透明度填充
- 不要只写描边色而让面积填充继续落回图表库默认色；面积图必须显式绑定 fill 颜色
- 不要自行补“累计”“峰值”“周期均值”这类需求未描述的派生指标卡
- 不要自行补“当前按日维度查看近 30 日趋势”这类分组副标题、说明文案或图表解释语
- 不要把“主趋势保持蓝色系”“柱形与间隙比例为 1:2”这类图表实现说明直接写成用户可见的图表说明文案
- 不要把“复制提示词”“示例导出”等 `demo-only tooling` 默认挂进业务页页头；除非任务明确要求交付示例宿主工具区
- 不要为了摆放图表，在 `white-body` 外再包一层页面级白底容器
- 不要为了让图表区“更像看板”，给主体白色背景额外加描边、圆角或统一 inset
- 不要把图表卡内部的 `padding / border / radius` 抬升到页面主体骨架层
- 不要先写图表容器，再倒推 `white-body` 的尺寸、滚动和留白

## 自检

- 图表实现真实接入 `@ant-design/charts` 或明确批准的同源 wrapper，而不是手写 primitives 模拟
- 图表主题、颜色、坐标轴和文本样式没有回退成库默认值
- 单指标趋势是否优先使用面积图，多指标趋势对比是否优先使用折线图，多指标构成演变是否使用堆叠面积图
- 若单指标趋势使用折线图，是否已明确说明该指标属于比率型 / 评分型 / 指数型，且页面任务重在波动与拐点
- 面积图是否没有默认点标记
- 单序列面积图是否保持“同色描边 + 同色 20% 透明填充”
- 指标卡及其选中态是否仍为白卡 + 描边，而不是渐变卡
- 页面中是否没有出现需求未描述的分组副标题、解释语和派生统计卡
- 页面可见区域是否没有混入示例生成提示词、图表实现说明或其他 `demo-only tooling` 文案 / 动作
- 每张图标题是否都能直接回指到明确业务问题，而不是模板化或泛化标题
- 若页面声明 `primary-secondary`，主线核心图是否仍位于 `primary`，`secondary` 是否只承接辅助判断图与洞察图
- 指标卡、图表区和明细表仍在同一白底主体里
- 页面没有双滚动和双层主工作区
