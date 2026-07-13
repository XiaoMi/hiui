# rules-only 组件映射矩阵

## 目的

这份文件只解决一个问题：

- 当目标项目走 `rules-only` 时，典型页的每个关键区域应该优先落到哪类 HiUI 5 组件语义或宿主基座

它不是页型专章，也不替代 `figma-pages/*.md`。它负责把下面两件事显式化：

1. 页面区域 -> 必选组件语义
2. 标准实现 -> 兼容宿主实现 -> 禁止替代写法

## 使用顺序

1. 先读 `generation-principles.md`
2. 再读 `page-type-map.md` 判页型
3. 运行 `plan-page-task`，若命中 `generationStrategy=page-component`，优先使用 `pageComponent.componentId` 或 `pageComponent.components[]` 声明的认证组件
4. 只有组件不可用、结构升级、宿主 adapter 约束或 `generationStrategy=managed-fallback` 时，才读本文件完成区域到组件语义 / 宿主基座的映射
5. 再读 `rules-only-example-alignment.md`，确认当前页必须对齐的示例结构
6. 再读 `figma-page-rules.md`
7. 最后读命中的 `figma-pages/*.md`

若 doctor 或机器计划已提示目标项目命中旧宿主桥接接入模式，再把本文件与 `legacy-host-compatibility.md` 对照阅读；这属于 bridge 约束补充，不把普通典型页默认降级成翻译链。

## 读法

- “标准实现”指目标项目可以直接使用 `@hiui-design/typical-page-shells` 的现代运行时场景
- “兼容宿主落点”指目标项目不直接落标准壳，而复用宿主自己的页面基座、布局槽位和 hiui5 alias
- 组件映射优先级低于页型专章；若专章给出了更窄的要求，以专章为准
- 本文件只定义“区域应该落到哪里”；`rules-only-example-alignment.md` 定义“这些区域最终必须与哪一个示例保持同构”

`rules-only` 不等于禁用页面级组件。它只是不把 host-integration 示例 gallery 作为接入产物；当 `rules/page-component-registry.json` 中的认证组件通过 `supportedModes` 声明支持 `rules-only` 时，普通典型页必须优先走组件链路，再由本矩阵作为 fallback / adapter / 结构对齐解释。

## 跨页区域矩阵

| 页面区域 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页面标题区 | `宿主适配页头 portal + PageHeader` | 宿主 header 槽 / 列表基座 title 槽 / 宿主 `PageHeader` | 标题与菜单名一致；标题字重 `600`；主操作区靠右 | 不要把标题写成内容白卡里的普通文本块；不要让按钮挤在标题后面 |
| 标题操作区 | `PageHeader.extra` + `Space` + `Button` | 宿主 page header action slot / 列表基座 action slot | 同组最多 1 个主按钮；主按钮位于最右 | 不要把操作按钮拆到筛选区；不要把主按钮写在动作组左侧 |
| 主白底主体 | 固定页壳自身白底主体 | 宿主 page 容器里的单一白底主工作区 | 筛选、表格、分页、指标区、底栏等必须在统一主体内收口 | 不要拆成多张散卡；不要退化成“灰底页面 + 单张白卡” |
| 风险/状态标签 | `Tag` / shared status renderer | 宿主 status tag alias / shared status helper | 默认继承 HiUI 标签语义、圆角、字号、行高与状态色 | 不要在业务页手写 `span + backgroundColor + borderRadius:999` 胶囊标签 |
| 可点击状态筛选 | `Tag` / shared status renderer + click / keyboard bridge | 宿主 status tag alias + selectable bridge / shared status helper | 若本质是状态语义切换，优先保留 `Tag` 语义，再补点击与键盘交互；未声明默认激活项时保持初始数据全集可见 | 不要因为“可点击”就直接回退成 `Button`；不要默认选中第一项造成隐式预过滤 |
| 行内筛选区 | `QueryFilter` | 宿主列表基座中的真实 `QueryFilter` 槽 / 经过宿主适配的 `QueryFilter` 容器 | 必须使用真实 `QueryFilter`；紧凑单行；默认无外部 label；查询/重置与筛选控件共处同一块区域 | 不要回退到 schema 化搜索栏 / `searchConfig.fields`；不要手写自由排布的 `Search + Select + DatePicker` flex 行；不要额外补一排字段名标签 |
| dashboard control strip | `DashboardControlStrip` / shared control-strip helper | 宿主 analytics toolbar / shared dashboard control bridge | 分段控件无外部字段名；下拉 label 在控件内部；1440 下保持紧凑单排 | 不要手写“字段名 + Radio.Group/Select”两层表单条；不要把按钮/筛选拆成第二层 |
| 全部筛选抽屉 | `FilterDrawer` | 宿主高级筛选抽屉中的真实 `FilterDrawer` / `QueryFilter` 扩展抽屉 | 与行内筛选复用同一套字段语义；字段标签在抽屉里回到外部标签位 | 不要给抽屉和行内筛选维护两套字段定义；不要只改某一侧的视觉默认值 |
| 表格主体 | `Table`，优先由 `TablePageFrame` / `StatListPageFrame` / `TreeSplitPageFrame` 承接 | 宿主 `PageTable` / `page-table-v5` / 列表基座 table slot | 默认 `size="md"`、`resizable`、字段管理；文本列省略 + Tooltip；状态列优先 `Tag` | 不要在已有列表基座上退回裸 `Table`；不要再包一层破坏滚动链的滚动容器；不要省略字段管理 |
| 分页区 | 固定页壳内的分页槽 | 宿主列表基座分页槽 / 主白底主体底部分页区 | 必须与筛选区、表格区保持同一白底主体；不要漂到白底外 | 不要把分页拆到页面灰底外层；不要把分页下方露出宿主灰底当成单页 spacing 问题 |
| table shell | `JoinedTableSection` / list frame footer chain | 宿主 table workspace shell / page-table footer chain | 表格内容与分页仍属于同一个 shell / footer 链 | 不要把表格和分页拆成两个松散 block 再靠外层 spacing 假装一体 |
| 表格操作列 | 列定义 + 壳层固定列配置 | 列定义 + 宿主 wrapper 固定列配置 | 必须真正冻结到右侧；若宿主需要 wrapper 级 fixed 配置，要与列配置同时声明 | 不要只写 `fixed: 'right'` 就认为完成；不要让操作列跟随横向滚动 |
| 表格行操作 | `appearance="link"` / 宿主主链接动作语义 | 宿主 row-action link / dropdown action bridge | 默认单行、蓝色主链接语义；过多动作进入下拉 | 不要把两三个 line/default 按钮堆在单元格里；不要用 `flex-wrap` 把行高撑开 |
| 图表卡 body | `ManagedChartCard` / approved chart carrier | 宿主 chart-card shell / shared chart body helper | 图表必须落在独立 chart body 容器里并随卡片收口 | 不要把 `Area` / `Line` / `Bar` 直接裸挂在通用白卡 children 上 |
| 页面根高度链 | 页壳 + 内容区连续 `flex + min-height: 0` | 宿主内容列 / 路由出口 / 页面根连续高度链 | 表格页、统计页、全页编辑都要保持单一滚动链 | 不要额外补 `min-height: 100vh` 或外层 `overflow-y: auto` 掩盖宿主问题 |

## 页型矩阵

### 数据统计表

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `StatListPageFrame` | 宿主统计列表基座 / 列表页基座的统计变体 | 指标卡 + 筛选 + 表格 + 分页留在同一白底主体内 | 不要退化成普通表格页；不要把指标区拆到白底主体外 |
| 指标卡区 | `StatOverviewGrid` / 统计概览栅格 | 宿主统计概览区 / 自适应卡片栅格 | 宽度允许时先铺满一行，最小宽度后再换行 | 不要写死 `repeat(3, ...)`；不要用裸文本块代替指标卡 |
| 筛选区 | `QueryFilter` | 宿主统计页中的真实 `QueryFilter` 区域 | `padding` 走统计页基线 `16 / 20` | 不要复用左树右表的筛选 `padding`；不要回退到 schema 搜索栏 |
| 表格列呈现 | 单行文本列 + 必要时 Tooltip | 宿主 table cell renderer / shared cell helper | 默认一列回答一个主语义字段；默认单行 | 不要把主标题 + 副标题 + 标签堆进同一普通数据列；未书面批准前不要使用复合单元格 |

### 数据可视化 / 监控调度页补充

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `FixedDashboardPageFrame` / `StatListPageFrame` 翻译后的 shared shell carrier | 宿主 analytics page base / fixed dashboard helper | header、white-body、outer-padding、main-scroll 由 shared/helper 承接；frame root 保持 flush，不再额外补 `padding-inline: 20` / `padding-block-end: 16` 这类 page-root inset | 不要在业务页重新声明 page inset、white-body、header 容器 |
| 控制条 | `DashboardControlStrip` | 宿主 dashboard control bridge | 维度切换用 segmented/radio/tabs；select label 留在控件内部 | 不要回退成上 label 下控件的表单条 |
| 风险标签 | `Tag` / shared status renderer | 宿主 status helper | 风险等级默认继承 HiUI 标签语义 | 不要手写红黄绿胶囊 span |
| 表格工作区 | `JoinedTableSection` | 宿主 joined table shell | 表格内容与分页同壳；默认 `striped=false`、`bordered=false` | 不要加斑马线；不要把分页拆出去 |

### 普通表格 / 树形表格

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `TablePageFrame` | 宿主列表基座 / 命名 shared shell-carrier | 白底主体从筛选区一直铺到底部分页；`rules-only` 默认必须直接挂 `TablePageFrame`，只有当项目已有命名 shared shell-carrier 且 contract/source marker 显式声明继承链时，才允许翻译成宿主壳 | 不要在业务页手拼 `PageHeader + QueryFilter + Table` 后再用 `data-hiui5-*` 或注释伪装成 `TablePageFrame` |
| 表格容器水平留白 | `TablePageFrame.tableContainer` | shared shell-carrier 的 table body inset | 表格区必须保留标准 `padding-inline: 20px` / `padding: 0 20px` 水平 inset；筛选区和表格区都要各自承接同一白底主体内的横向节奏 | 不要只给 `query-filter` 加 `20px` padding，却让 `table` region 直接贴到 `white-body` 边缘 |
| 树形展开 | 表格首列树形展开 | 宿主表格树模式 / 树表基座 | 树在表格内部展开，而不是拆成左右双栏 | 不要误判成左树右表 |

### 左树右表

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `TreeSplitPageFrame` | 宿主 split page / 左树右表基座 | 左树与右表处于同一个 split 工作区 | 不要拆成两个独立页面或两张白卡 |
| 左树区 | `Tree` + 树搜索输入 | 宿主树面板 / 目录树基座 | 左树默认 `200px`；支持拖拽调宽；树与右表不自动联动搜索字段 | 不要只用 CSS 把树搜索框强拉满；不要把左树再包一层多余滚动容器 |
| 右侧列表区 | `QueryFilter + Table + Pagination` | 宿主列表基座右侧内容槽 | 右侧仍是典型列表页语义，不是自由拼装控件区 | 不要因为有左树就放弃 `QueryFilter` 语义 |

### 抽屉表单

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `ProFormDrawer` | 宿主表单抽屉 / 编辑抽屉基座 | `<=16` 字段优先抽屉；标题、body、footer 仍是一个抽屉结构 | 不要把 `>16` 字段硬塞进抽屉 |
| 内容区 | `Form` / `SchemaForm` | 宿主表单容器 / hiui5 alias 表单 | 标签默认在控件上方；宽控件整行 | 不要把抽屉 body 再包一层额外 `Card` |
| 底栏 | 抽屉 footer 动作区 | 宿主 drawer footer slot | 主动作靠右；动作区和 body 分层清晰 | 不要把动作按钮散落到 body 末尾 |

### 抽屉详情

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `ProDetailDrawer` | 宿主详情抽屉 / 查看抽屉基座 | `<=16` 条描述项优先抽屉；标题 `16px / 600` | 不要把全页详情布局套进抽屉 |
| 内容区 | `Descriptions` | 宿主详情描述组件 / hiui5 alias `Descriptions` | 双列场景长文本整行；`th` 左对齐 | 不要遗漏 `th` 左对齐；不要再包额外 `Card` |

### 全页编辑

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `ProEditPage` | 宿主全页编辑基座 / 最近业务编辑页 archetype / pro-edit-page 封装 | `>16` 字段优先全页；头区、滚动区、底栏在同一页壳内；生成前必须先锁定一个宿主 archetype | 不要退回 `Card + Form + footer`；不要从空白文件手拼整页 |
| 页头区 | `宿主适配页头 portal + PageHeader` | 宿主 header 槽 / 编辑页 title slot | `onBack`、标题 `18px / 600`、操作区靠右；返回语义属于页头左侧 leading 区；header action button 保持 HiUI 默认尺寸；`60px` 节奏归宿主 header slot 所有 | 不要让页头掉回内容白卡内部；不要把“返回”翻译成右侧 `titleExtra` 工具按钮；不要把按钮高度硬拉到 `60px` 去贴页头高度；不要把 `PageHeader` 根节点改成假 flex 居中壳 |
| 表单滚动区 | `formScrollBody + Form` | 宿主编辑页 scroll body + 表单根 | 只承担表单滚动，不承载底栏；若宿主 archetype 是扁平 section，不要再叠一层 Card 容器语义 | 不要把底栏塞进滚动区；不要外层白底主体和内层 Card 同时作为主容器 |
| 底部操作区 | `inlineEditFooter` | 宿主编辑页 sticky footer slot | 必须吸底，且与表单滚动区为同级兄弟；按钮组靠右 | 不要挂到宿主全局 footer；不要跟随内容滚动；不要只做静态 `border-top` 底栏 |
| 上传触发器 | `Upload` 默认触发器 / 宿主上传字段封装 | 宿主 `Upload` / 字段上传基座 | 触发器语义与宿主一致；若宿主默认已带上传 icon，自定义内容只保留文案或宿主允许的最小定制 | 不要在宿主 `Upload` 默认图标外再补第二个上传图标 |

全页编辑额外强约束：

- 命中 `rules-only + existing-system` 时，先在目标项目里定位一个最近的全页编辑 archetype，再替换业务字段；不要直接照着 `full-page-edit.tsx` 的视觉表象手写一份
- 当宿主 archetype 复用 `ProEditPage` 语义时，必须同时保留 `ProEditPageProvider` 或等价 edit context chain；否则 `Form` / `CancelButton` / `StashButton` / `SubmitButton` 会在运行时缺上下文直接白屏
- 三栏全页编辑默认保持三栏；只有当**宿主内容槽实际宽度**不足以承载三栏时才允许降两栏，不要写基于 viewport 的粗暴 `max-width: 1366px -> 2 列`
- 表单字段栅格默认只保留横向 `40px` gutter，纵向 `row-gap` 归零，字段上下节奏由 `FormItem` / section 自身承担
- 若宿主默认 `PageHeader` 自带 `margin-bottom`，必须先归零，再由页壳决定标题区与主体区的间距；不要再在页面局部额外补一层 `8px` 之类的外边距
- 若宿主 archetype 的标题区已有返回链路，必须优先映射为 leading `onBack`；不要为了“保留返回能力”改写成右上角二级按钮
- 若宿主 archetype 的底栏已承担右对齐动作区，必须继续复用该 footer 语义；不要退回通用 `Layout.footer`

### 全页详情

| 区块 | 标准实现优先落点 | 兼容宿主落点 | 硬规则 | 禁止替代写法 |
| --- | --- | --- | --- | --- |
| 页壳 | `ProDetailPage` | 宿主全页详情基座 / detail-page 封装 | `>16` 条描述项或多分组详情优先全页 | 不要继续留在抽屉详情 |
| 分组详情区 | 分组白底详情块 + `Descriptions` | 宿主分组详情组件 / hiui5 alias `Descriptions` | 分组间距 `16`；长文本整行；分组白底无描边无阴影 | 不要叠额外描边和阴影；不要把根容器写成统一 `padding: 20px` |

## 落地顺序

### 典型页快速路径例外

若当前页已经命中固定模板、示例、已命名宿主 archetype 或机器计划里的 `reference-or-scaffold` 受管起点，并且本次只替换标题、查询字段、指标、表格列、表单 / 详情字段、接口 / mock 数据、行操作等业务槽位，则本矩阵只作为 fallback / 排错参考，不要求在实现前完整展开区域映射。

只有出现下面情况时，才回到本节完整矩阵流程：

- 固定模板、示例、宿主 archetype 与受管 scaffold 起点均缺失，或 `startFrom=unresolved`
- 模板 / source marker / contract 中的 `example path`、`host archetype path` 或 `host adapter` 互相冲突
- 本次修改了页壳、ownership、region、mandatory components 或 source marker
- `pageType` 不确定，或页面进入非典型 / overlay 判断

生成 `rules-only` 页面时，按下面顺序执行：

1. 判页型
2. 用本矩阵先锁定“页壳 + 标题区 + 筛选区/表单区 + 主体区 + 分页/底栏”
3. 再去页型专章补 spacing、分档、失败信号和自检项
4. 最后才替换业务字段、表格列、按钮文案、接口与路由

## 最低验收

- 页面没有退回手拼 `PageHeader + Search + Table` 或 `Card + Form + footer`
- 标题区、筛选区、主体区、分页/底栏都能在本矩阵中找到对应落点
- 生成说明里已经明确写出唯一对应的示例页路径，而不是把多个示例混着拼
- 生成说明里已经明确写出“示例区域 -> 宿主槽位 / 基座”的一一映射，没有出现示例有而目标页额外新增的结构区块
- 若目标项目命中旧宿主桥接接入模式，生成说明里已经明确写出“当前页分别映射到宿主哪一个页面基座 / 槽位 / 组件封装”
