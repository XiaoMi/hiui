# 旧宿主兼容生成模式

## 适用场景

当目标项目命中下面任一特征时，不再按标准 `@hiui-design/typical-page-shells` 运行时生成，而切换到本兼容模式：

- `react` / `react-dom` 主运行时 `< 18`
- `ahooks` 主运行时 `< 3`
- 宿主仍保留旧版 `@hi-ui/hiui`，只通过 `hiui5` 之类 alias 局部引入 HiUI 5
- Module Federation remote 在构建层把 `react` / `react-dom` 作为旧版本 singleton 全局共享

典型例子：

- 老业务 remote
- 旧运营后台
- 被宿主强绑定为 React 16/17 的联邦模块

## 这个模式的目标

目标不是“把标准典型页壳强行跑起来”，而是：

- 继续沿用 `hiui design` 的页型判断
- 继续沿用 `hiui design` 的信息架构、视觉节奏、标题层级、滚动链和白底主体关系
- 但实现层改用目标项目自己的运行时、现有布局能力、已有表单/表格/抽屉封装和 `hiui5` alias

也就是说：

- **设计语言继续对齐 `hiui design`**
- **实现语法不再强依赖 `@hiui-design/typical-page-shells`**

额外强调：

- 兼容模式只改变运行时与接入方式
- 兼容模式**不允许**降低页型专章里的 mandatory components、required regions 与 ownership 要求
- 如果示例页要求真实 `QueryFilter`、真实 `FilterDrawer`、真实指标卡区、真实 `Descriptions` 主表达或固定页壳语义，这些要求在兼容模式里依然成立
- 兼容模式也**不允许**把示例默认视觉语义偷换成宿主随手拼的近似壳层：真实 `PageHeader` back-button、默认灰底 `SearchInput`、`FilterButton` 语义、主白底延伸到底部、分页吸底和蓝色 link 行操作都必须继续成立，除非需求文字明确要求偏离
- 兼容模式下尤其要警惕“宿主 alias 组件会解析第一层 children”这一类运行时细节。像 `Descriptions` 这类组件，如果宿主实现会直接遍历第一层 children 并读取其 `props`，就不能再包一层自定义 React 组件后把它作为第一层节点传入；应直接内联 `Descriptions.Item`，或改走 `data/items` 配置模式

若当前项目已经额外准备了隔离标准壳子应用，则该结论只适用于 legacy 宿主主树本身；独立子应用中的新页面，改为读取 `isolated-standard-shell.md`。

## 使用顺序

兼容模式下，生成页面时按这个顺序读：

1. `generation-principles.md`
2. `page-type-map.md`
3. 本文件
4. `figma-page-rules.md`
5. 命中的 `figma-pages/*.md`

其中：

- `page-type-map.md` 仍负责判页型
- `figma-pages/*.md` 仍负责理解该页型的结构目标
- 但里面提到的 `TablePageFrame` / `ProEditPage` / `ProFormDrawer` 等，兼容模式下要理解为**必须继承的页壳语义**，不要求直接导入同名标准运行时组件
- 这条例外只豁免“直接 package import”，不豁免示例绑定、mandatory components、region 层级、ownership、source marker 或 shell-carrier 证据
- 若不能直接挂标准壳，必须翻译到命名 shared shell / host adapter，并在源码与 contract 中声明 `shell inheritance strategy`、`shell carrier path`、`host adapter`、`example path` 与 `host archetype path`
- 禁止把“结构参考语义”解释成在业务页局部手写 `PageHeader + QueryFilter + Table`、`Drawer + Form`、`Card + Descriptions` 等 primitives 后再补注释伪装成典型页
- 若当前仓库存在项目级 override，例如 `docs/business-lines/<line-id>/<project-id>.md`，则其优先级高于本文件中的通用“宿主基座优先”建议

## 兼容模式硬规则

### 1. 不再直接导入标准典型页壳

兼容模式下，不要新写下面这些导入：

- `@hiui-design/typical-page-shells`
- `@hiui-design/typical-page-shells/*`
- `TypicalPageHostProvider`
- `TypicalPageHeaderPortal`
- `TablePageFrame`
- `StatListPageFrame`
- `ProEditPage`
- `ProFormDrawer`
- `ProDetailDrawer`

这些只作为必须继承的页壳语义，不作为当前项目的真实运行时依赖。兼容实现必须通过宿主基座、命名 shared shell-carrier 或 host adapter 证明继承链；不能退回业务页面内的 primitive look-alike。

### 2. 组件来源必须收口到目标项目自己的可运行集合

优先顺序：

1. 目标项目已经存在的页面壳、布局容器、抽屉、表单、表格、详情组件
2. 目标项目约定的 `hiui5` alias
3. 目标项目已有的二次封装组件

不要在旧宿主里混用两套运行时：

- 一边继续走旧宿主 `react16 + singleton`
- 一边给新页面偷偷加 `@hiui-design/typical-page-shells + react18`

### 3. 只能复用“设计约束”，不能复用“标准运行时假设”

可以复用：

- 页型
- 页面节奏
- 标题层级
- 白底主体与灰底外槽关系
- 操作区位置
- 单一滚动链
- 抽屉 / 全页 / 统计 / 左树右表的结构边界

不能照搬：

- 标准页壳组件名
- 标准 portal 接法
- 标准 schema / query-filter 实验依赖
- 标准 `TypicalPageHostProvider` 宿主桥接

### 3.0 不能假设宿主 alias 组件具备“任意包装组件透明透传”语义

旧宿主兼容模式里，`hiui5` alias、本地二次封装和实验性组件实现，经常不会把 React children 当作完全透明的黑盒。

因此：

- 若某个组件会遍历第一层 children、克隆子节点、读取 `props.label / props.children / props.value` 或按固定子项类型组装结构，不要再额外包一层业务包装组件
- 对 `Descriptions` 这类字段主表达组件，默认直接写 `Descriptions.Item`
- 若需要减少重复代码，允许抽成“返回 `Descriptions.Item` 节点的普通函数”；不允许抽成 `<DescriptionField />` 这种 first-level wrapper component
- 若宿主组件已经提供 `data` / `items` 配置式 API，优先使用配置模式，而不是依赖包装组件透传 JSX 结构

### 3.1 安装态也必须保持旧宿主契约

兼容模式不是只看 `package.json` 写着什么，还要看 `node_modules` 实际装成了什么。

必须同时满足：

- 根 `react` / `react-dom` 仍停留在宿主声明的 legacy major，不允许在安装后漂移到 `18`
- 根 `@hi-ui/hiui` 仍停留在宿主声明的旧运行时，不能被 `hiui5` alias 或其它依赖顺手替换成 `5.x`
- 若仓库里还存在 `@hi-ui/hiui/es*` 导入，则根 `@hi-ui/hiui` 必须继续提供 `./es` ABI

如果 doctor 报下面这类问题：

- legacy `@hi-ui/hiui/es` consumers still have a compatible root package ABI
- installed root runtime still matches the compatibility contract for legacy host projects

就不要继续生成业务页，也不要去修某个单页样式。先把宿主根运行时恢复到删除前的 legacy 拓扑，再继续兼容生成。

### 4. 兼容模式不是“自由手拼模式”

兼容模式的核心不是“随便用这个项目能跑的组件拼一版”，而是：

- 先找到宿主里已经跑通的页面基座
- 再按 `hiui design` 的对应示例把壳层照搬出来，并让那个基座承接

如果宿主已经存在下面任一能力：

- `PageTable`
- `page-table-v5`
- `layoutConfig + searchConfig + tableConfig + tabConfig`
- schema 化的搜索字段定义 + 表格分页容器

则普通表格和数据统计表默认必须优先落到这些基座上。

只有在宿主确实没有等价基座，或页型明显超出这些基座表达边界时，才允许手写页面结构。

但这里的“优先落到宿主基座”有一个前置条件：

- 宿主基座必须能承接当前页型的 mandatory components

如果答案是否定的，就不要继续复用该基座作为最终实现。常见禁止情况：

- `table-stat` 被压回“旧 tabs 列表页 + 统计数字块”
- `data-visualization` 被压回“指标卡 + 手写 svg/canvas 趋势占位 + 普通表格”
- `QueryFilter` 被替换成 `SearchForm`、`searchConfig.fields` 或手写筛选 flex 行
- `drawer-form` / `drawer-detail` 被替换成普通 `Drawer + Form` / `Drawer + Descriptions`
- `full-page-edit` / `full-page-detail` 被替换成普通 `Card` 页面

对 `data-visualization` 额外补一条：

- `legacy-host-compatible` 只改变壳层接入方式，不授权把示例页里的真实图表技术栈降级成 primitives
- 若示例页使用 `@ant-design/charts`，兼容模式下也应继续接入 `@ant-design/charts`，或先停下来补依赖 / 兼容方案；不要用“先画一个能看的趋势图”替代正式实现

### 4.0 页型专章优先于宿主基座建议

上面这条“优先落到宿主基座上”只是一条默认建议，不是最高优先级。

若命中的页型专章对结构节奏提出了更强要求，例如：

- `table-stat`
- `data-visualization`
- `full-page-edit`
- `full-page-detail`

则应先问一个问题：

- 当前宿主基座能否完整承载该页型要求的全部核心 region 与单一白底主体关系

如果答案是否定的，就不要继续使用该宿主基座作为最终实现，即使仓库里已经存在：

- `PageTable`
- `page-table-v5`
- `ss-components5 PageTable`

此时正确做法是：

- 保留页型专章定义的示例节奏
- 在旧宿主现有右侧内容区中照着示例生成同构页面
- 明确 content slot / white-body / outer-padding / main-scroll 的唯一 ownership
- 对所有页型都要显式命名 host adapter family，取值来自 `archetypes/registry/common.adapter-capabilities.json`
- 把 `example + host-adapter + host-archetype` 一起回写到源码 source contract，缺少这条照搬链就视为“从 primitives 重新搭页”

### 4.1 宿主 content slot / white-body / padding 只能有一个拥有者

旧宿主最常见的失真，不是组件名选错，而是**主工作区 ownership 选错**。

如果宿主 archetype 已经提供了类似下面的内容槽：

- `ss-v1-layout__content`
- `page-content`
- `table-content`
- `layout-body`

并且这些槽位已经自带任一能力：

- 外层 `padding`
- 白底 / 灰底背景
- 圆角
- 主滚动容器

则生成页必须先明确 ownership，只允许两种合法写法：

1. 继续把宿主 content slot 当作主白底主体或外层留白拥有者，页面内部不再复制同一层 `padding / background / radius / overflow`
2. 在页面局部把宿主 content slot 的相关样式归零，再由页面自己的 `white-body` 成为唯一拥有者

禁止出现：

- 宿主 content slot 已经有 `padding`
- 页面根再补一层 `padding`
- `white-body` 再作为第二层主体继续缩进

这会把示例页的“灰底外槽 -> 单一白底主体”翻译成“宿主 content slot -> 内层白底 -> 再内层内容留白”的三层工作区，最终表现就是主体区域整体缩窄、统计区和表格区被多包一层，看起来像“页面没有铺满”。

以 `ss-components5/Layout` 为例：

- 若 `ss-v1-layout__content` 已承接主工作区节奏，就不要在页面里再复制一份等价的外层 `white-body` 留白
- 若页面必须自带 `white-body` 才能与示例对齐，就先在页面局部把 `ss-v1-layout__content` 的 `padding / background / overflow` 归一，再让 `white-body` 接管

只要 ownership 不清晰，就视为结构翻译失败，而不是允许通过补样式掩盖。

### 4.2 旧宿主单层导航必须保持稳定

若业务要求页面继续运行在旧宿主主树内，则正式交付时必须满足：

- 保留宿主自己的左侧导航
- 只切换右侧内容区
- 页面不能再声明一套新的一级导航或 layout 容器

因此下面这些形式不能作为 formal delivery：

- iframe 内嵌的标准壳整页
- 在右侧内容区里再嵌一层有自己导航的 page shell
- 独立子应用直接占满宿主工作区并替换原有 layout

这些方式只允许用于：

- baseline
- smoke
- screenshot 验证

### 5. `QueryFilter` 在兼容模式里仍是“真实组件契约”

兼容模式下，允许复用宿主列表页基座，但筛选层仍必须使用真实 `QueryFilter`，不能只保留它的外观或行为表象：

- 行内筛选、查询按钮、重置按钮仍收口在同一个筛选区
- 筛选区与表格区留在同一块白底主体里
- 默认是紧凑的单行/折叠式搜索，不要在页面上摊成一大片自由排布控件
- 没有明确设计特例时，不要额外补一排“字段名标签”把筛选区做回传统表单

如果宿主已经有列表页基座或搜索区域，例如：

- `PageTable`
- `page-table-v5`
- 自定义列表页壳

就应该把真实 `QueryFilter` 挂接进去，或改造宿主基座以容纳真实 `QueryFilter`，而不是退回 schema 搜索壳或手写 `Search + Select + DatePicker` 的 flex 行。

同样地：

- `FilterDrawer` 也是表格类页型的真实组件契约，不是“可选增强”
- 若宿主基座不支持 `FilterDrawer`，先补支持，再继续写业务页
- 不要先写出一个只有行内筛选、没有全部筛选的过渡版本，再寄希望于后补

补充约束：

- 不要以“兼容模式”为理由回退到 schema 搜索壳、`searchConfig.fields`、`searchPanelConfig` 或其他只保留表象的桥接层
- 不要以“外部样式会影响筛选表现”为理由回退到手写筛选；应优先修正 `QueryFilter` 的样式来源、bridge 默认值和宿主接入
- 若宿主现有列表页基座不能承接真实 `QueryFilter`，应先改造基座，再继续生成业务页

### 6. 页头标题要本地归一，不接受宿主默认值直接漏出

旧宿主常见情况是全局 `page-header` 默认自带：

- `font-size: 20px`
- `margin-bottom: 5px`
- 与 `hiui design` 不一致的高度或左右留白

兼容模式下不要直接接受这个默认值。

优先顺序：

1. 优先使用宿主列表基座自己的标题槽位，例如 `layoutConfig.title`
2. 若必须直接使用宿主 `PageHeader`，则在页面局部 class 中把标题归一到 `18px`、`600` 字重，并消除额外底部外边距
3. 不要让页头的外边距把标题和白底主体强行拉开，造成“标题漂在导航下方、主体另起一块”的错位感

### 7. 数据统计页的指标卡必须保持“自适应铺满一行”

兼容模式下统计页允许用宿主自己的样式体系实现指标卡，但结构不能退化。

必须满足：

- 指标卡、筛选区、表格区仍在同一块主白底里
- 指标卡使用自适应铺满的一行布局
- 只有在卡片达到最小宽度后才换行

推荐写法：

- `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`
- 或者使用宿主已有的响应式列数计算能力

不要写死：

- `repeat(3, minmax(...))`
- 依赖固定列数导致宽度还够时卡片已经提前换行

### 8. 操作列固定必须同时满足“列配置”和“宿主 wrapper 配置”

很多旧宿主不是只写列上的 `fixed: 'right'` 就会真正冻结操作列，还会要求外层表格封装再补一层固定列声明。

例如宿主若已有这类 API：

- `fixedToColumn: { right: 'operate' }`
- 表格 wrapper 自己的 `scroll` / fixed-column 映射

则必须与列定义一起补齐。

兼容模式下不要只看到列配置里已经有：

- `fixed: 'right'`

就判定“操作列已冻结”。

## 页型到兼容实现的映射

### 普通表格 / 树形表格 / 数据统计表

目标仍然是：

- 页头
- 筛选区
- 表格区
- 分页区
- 同一块白底主体

兼容实现要求：

- 用目标项目自己的 page 容器承接页头和主体
- 筛选区、表格区、分页区必须落在同一个主白底容器里
- 如果宿主已有 table page 模板，优先在那个模板上对齐 `hiui design` 节奏
- 如果宿主已有 `PageTable` / `page-table-v5` / schema 化搜索面板，普通表格优先落到该基座，而不是手写 `PageHeader + Search + Table`
- 没有模板时，至少保证“灰底外槽 + 单块白底主体”成立，不要拆成多张散卡
- 若宿主 archetype 的 content slot 已自带 `padding / background / overflow`，必须先明确 ownership，再决定是沿用该 slot 还是局部归零；不要让宿主 slot 与页面 `white-body` 同时拥有外层留白

数据统计表额外要求：

- 指标卡仍是该白底主体的第一个 section，不要拆到白底主体之外
- 指标区宽度应先铺满一行，再在最小宽度阈值后换行
- 若宿主已有状态 tab / search / result 的一体化列表基座，应把指标区插入到同一主白底体内，而不是另起一套页面骨架
- 不要为了复刻统计页示例，再在 `ss-v1-layout__content` 或同类宿主 slot 内部额外补一层等价外边距；若需要外层留白，只能由宿主 slot 或页面 `white-body` 二选一承担

### 左树右表

目标仍然是：

- 左树
- 右侧筛选
- 右侧表格
- 同一个 split 工作区

兼容实现要求：

- 先复用宿主已有 split layout
- 左树和右表必须同屏稳定共存
- 不要退化成“树在上，表在下”的普通文档流

### 抽屉表单 / 抽屉详情

目标仍然是：

- 任务短闭环
- 信息依附主列表
- 抽屉内完成编辑或浏览

兼容实现要求：

- 优先用项目已有 Drawer 能力
- 表单与详情布局优先沿用项目自己的字段渲染语法
- 继续遵守 `<= 16` 的字段规模边界

### 全页编辑 / 全页详情

目标仍然是：

- 页面级标题
- 主白底内容区
- 稳定的滚动链
- 编辑页底部操作区吸底

兼容实现要求：

- 用目标项目自己的 page 根容器承接整页
- 先在目标项目中锁定一个最近的全页编辑 archetype，再替换业务字段；不要从空白文件重新手写整页骨架
- 页面根必须维持 `display: flex`、`flex-direction: column`、`min-height: 0`
- 表单滚动区和底部按钮区必须留在同一页面根下
- 底部操作区可以用宿主自己的 sticky/flex 方案实现，但必须满足“视觉上固定在页底”
- 宿主若已有三栏全页编辑基座，默认继续保持三栏；只有当内容槽实际宽度不足时才降两栏，不要按 viewport 断点提前退成两列
- 字段 grid 默认只保留横向 `40` 间距，纵向 `row-gap` 归零；字段上下节奏来自宿主 `FormItem` / section 本身
- 若宿主 archetype 已经是扁平 section，不要再套一层“外部白底主体 + 内部 Card 分组”的双层主容器
- 若宿主默认 `page-header` 自带 `20px` 标题或额外底部外边距，必须先归零默认值，再由页面壳层决定标题区与主体区的节奏
- 若宿主 archetype 已提供返回链路，必须优先继续映射为 header leading `onBack`；不要退化成右上角“返回列表”按钮
- 若宿主 archetype 已提供 sticky footer 动作区，必须继续复用该 footer 语义；不要改写成通用 `Layout.footer`
- 若宿主 `Upload` 默认触发器已带上传 icon，页面局部自定义 `content` 时不要再补第二个上传 icon

## 生成时的写法约束

### 可以做

- 从 `page-type-map.md` 选最近页型
- 参考 `examples/host-integration/src/pages/*` 的结构节奏
- 用项目自己的组件把结构翻译出来
- 显式写明“这是兼容模式实现，不依赖标准典型页壳”

### 不可以做

- 在旧宿主里继续偷装 `@hiui-design/typical-page-shells` 再赌它运行
- 把 `figma-pages/*.md` 里的标准壳组件名原样粘进代码
- 因为没有标准壳，就退回普通后台通用布局
- 生成“灰底宿主 + 单张白卡表单”这种失真页

## 兼容模式自检

生成后至少检查：

- 页型判断是否仍正确
- 标题层级是否与 `hiui design` 一致
- 主体白底是否完整铺底
- 表格页是否仍为单一白底主区
- 宿主 content slot、页面根、`white-body` 之间是否只有一个外层 `padding / background / radius / overflow` 拥有者
- 若宿主使用 `ss-v1-layout__content` 或同类内容槽，是否已明确“继承该 slot”或“局部归零后由 `white-body` 接管”，而不是两者并存
- 若宿主已有列表页基座，页面是否确实复用了该基座，而不是退回手写列表
- 筛选区是否仍表现为 `QueryFilter` 语义下的紧凑搜索栏，而不是自由散排控件
- 数据统计页指标卡是否采用可自适应铺满的一行布局，而不是固定 3 列
- 表格操作列是否通过宿主 wrapper 与列配置双重固定到右侧
- 全页编辑底部按钮区是否吸底
- 页面是否继续复用目标项目可运行的组件集合，没有偷偷引入标准典型页壳

## 输出时要明确说的话

如果命中兼容模式，生成说明里必须明确写出：

- 当前页面按 `hiui design` 的页型和节奏生成
- 但由于宿主是旧运行时兼容模式，实现上没有使用标准 `@hiui-design/typical-page-shells`
- 页面结构已对齐 `hiui design`，实现语法则对齐目标项目现有运行时
