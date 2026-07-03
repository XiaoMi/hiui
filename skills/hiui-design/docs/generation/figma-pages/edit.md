# 全页编辑

## 速览

- 何时读：已经判定为 `full-page-edit`，或字段数 `>16` 的编辑主流程
- 核心规则：必须保留 `ProEditPage` 的页头、滚动区和底栏三者的一体关系
- 常见坑：把全页编辑翻译成“灰底宿主 + 一张大白卡表单”，或把底栏塞进滚动区

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51257:102808`

## 适用

- 全页新建 / 编辑
- 字段数 `>16` 的编辑主流程

## 硬门槛说明

- 本页型规则默认按硬门槛执行，不是“全页表单视觉偏好”
- 全页编辑必须同时满足：`ProEditPage` 页壳语义、`Form` 主表达、`宿主适配页头 portal + PageHeader`、`formScrollBody`、`inlineEditFooter`、三栏 `40` 与连续高度链
- 全页编辑必须从 `examples/host-integration/src/pages/full-page-edit.tsx` 的语义骨架起步；不允许从抽屉表单、详情页或空白表单容器临时扩写
- 若页面实现不满足这些规则，应判定为不合规，而不是视作“业务自定义编辑布局”

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-edit-page/`
- 外部项目必须参考 `examples/host-integration/src/pages/full-page-edit.tsx` 起步，但真实业务页要落在目标项目原有目录结构中，不要把模版页同步进 `src/typical-page-reuse/`
- 在批量生成同类业务页之前，必须先把 `full-page-edit.tsx` 作为 archetype smoke baseline 跑通；只有页头、单一白底工作区、表单滚动区、底部操作区关系先锁定，业务页生成才有意义
- `rules-only + existing-system` 下，起步不是“照着示例手写一份像的页面”，而是先在目标项目里定位一个最近的全页编辑 archetype，再把 `full-page-edit.tsx` 的壳层语义翻译到那个 archetype 上
- 主体为 `ProEditPage + Form`
- `ProEditPage` 外必须保留 `ProEditPageProvider` 或等价 edit context chain；`Form`、`CancelButton`、`StashButton`、`SubmitButton` 都依赖这条上下文，缺失会直接触发运行时白屏
- 必须保留 `宿主适配页头 portal + PageHeader`、`proEditPageShellStyles.formScrollBody`、`proEditPageShellStyles.inlineEditFooter`
- `PageHeader`、表单滚动区、底部按钮区必须都挂在同一个 `ProEditPage` 内，不能拆成宿主灰底上的独立白卡
- `formScrollBody` 只能承担表单滚动；`inlineEditFooter` 必须作为它的同级兄弟留在 `ProEditPage` 底部，不要塞进 `formScrollBody`，也不要改走宿主 `footerPortal`
- 宿主内容列 / 路由出口 / 页面根到 `ProEditPage` 的直系包裹层必须保持连续高度链：`display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`，必要时 `overflow: hidden`；少任一层，底部操作区都会退回普通文档流，无法吸底
- 在 `rules-only + legacy-host-compatible` 下，`outer-padding` 与 `white-body` 两层都必须是 `flex column`；`main-scroll` 必须独占 `flex: 1 + min-height: 0 + overflow: auto`；`footer` 必须作为其同级兄弟保留 `flex-shrink: 0`
- 三栏布局，横向 `gutter: 40`
- 默认三栏在桌面端保持稳定；只有当**宿主内容槽实际宽度**不足以承载三栏时才降两栏，不要用 `max-width: 1366px` 这类 viewport 断点粗暴折成两列
- 字段栅格的纵向 `row-gap` 默认为 `0`；字段上下节奏由 `FormItem`、分组标题与宿主 section 自己承担，不要再给 grid 额外加 `24px` 一类纵向间距
- 页面层不要通过 `.hi-v5-form-item`、`.hi-v5-form`、`.hi-v5-form-label`、`.hi-v5-form-item__label` 的上下间距去重写整页表单节奏；`full-page-edit` 的字段纵向节奏必须继续归 `FormItem` 与 section 结构所有
- 字段 grid 只拥有列数、横向 `40` 与必要的 `min-width: 0`；不要让 grid 用 `row-gap`、`padding-bottom`、`margin-bottom` 或尾行留白去制造 footer 上方间距
- `input` / `select` / `checkSelect` / `switch` 这类紧凑控件默认留在三栏栅格内；只有 `Textarea`、`Upload`、媒体区或 contract 中显式声明的长文本特例，才允许整行 `colSpan: 3`
- `PageHeader` 必须有 `onBack`
- 若宿主 archetype 存在返回链路，必须继续映射为 header leading `onBack`；不要把返回行为翻译成右侧 `titleExtra / extra` 工具按钮
- 编辑页页头未被需求明确描述的内容一律不要自行补充；默认只保留标题与右侧操作，不要额外添加副标题、说明文案、提示语
- 编辑页页头默认复用真实 `PageHeader` 语义：返回入口必须落在 `hi-v5-page-header__back-button` 或其等价 semantic backButton 上，不能用普通 `Button` / `Link` 冒充；标题默认 `18px`，页头可视高度默认 `60px`
- 页面标题字重统一 `600`
- `PageHeader` 必须铺满宿主 header 槽宽度，`extra` 操作区靠右；不要让按钮跟标题挤在左侧
- `60px` 是宿主 header slot / shared header carrier 的垂直节奏，不要在 `PageHeader` 根节点上再写 `height/minHeight: 60` 加 `alignItems: center`；根节点不是用来做人造垂直居中壳的
- `PageHeader extra` 里的按钮保持 HiUI 默认尺寸基线；不要给 header action button 额外写 `height/minHeight: 60` 或把页头高度直接灌到按钮上
- 宿主 `page-header-portal.tsx` 只能给 `PageHeader` 根节点补 `width: 100%`、`minWidth: 0`，不要额外写 `display: flex` / `alignItems: center`
- 若宿主默认 `page-header` 根节点自带 `margin-bottom` 或 `20px` 标题，必须先把根间距归零、标题归一到 `18px / 600`，不要在页面局部再额外补 `8px` 之类的标题外边距
- 底部按钮组靠右
- `inlineEditFooter` 不要 `box-shadow`，只保留白底 + 顶部分隔
- 主区白底延伸到底栏上方，保持单滚动链
- 扁平表单使用 `flatEditForm` 思路：例如 `padding: 16px 20px 0`，不要只套裸 `formNormal`
- 分组表单允许 `GS().CardProps`，但不要再叠多余的水平 padding
- 如果宿主 archetype 已经是“外层白底主体 + 扁平 section 分组”，不要再为每个一级分组额外包 `Card`，否则会退化成双层容器嵌套
- 如果宿主 archetype 是“单一白底主体 + section 标题”的扁平编辑页，页面内容必须继续收口在同一个白底主体内；不要把每个一级 section 都翻译成独立白卡
- 不要在 `formScrollBody` 根上再加 `padding: 20px` 一类外层内边距；一级分组与字段区间距应由 `Form` / `Card` 内部结构承担
- 多个一级分组块之间竖向 `16px`
- `Upload`、长 `Textarea` 等宽控件默认整行
- 宿主 `Upload` 触发器如果默认已带上传图标，不要在页面局部自定义 `content` 时再补第二个上传 icon；优先只保留文案或沿用宿主默认触发器

## 分组补充

共享规则见 [`forms-shared.md`](forms-shared.md)。

- 一级分组标题前不要加色块，一级分组标题字重统一 `600`
- 二级子分组标题使用 `3x14 + 9px + 48px`，标题字重统一 `600`
- 二级子分组内容区不要额外水平缩进

## 禁止

- 不要绕开 `ProEditPage` 再重复手写主白卡、滚动区和固定底栏
- 不要把全页编辑生成成“灰底页面里只有一张大白卡表单”的通用后台样式；这通常说明已经绕开固定页壳
- 不要把 `>16` 字段继续塞进抽屉
- 不要在表单外包层使用 `margin-left/right + width: 100%`
- 不要在 `ProEditPage` 外再包 `min-height: 100vh` 或重复 `overflow: auto`
- 不要把 `inlineEditFooter` 放进 `formScrollBody`，也不要改用 `PageFooterPortal` / 自定义宿主 footer 槽承载全页编辑底栏
- 不要把宿主 archetype 的返回行为降级成右上角“返回列表”按钮来替代 `onBack`
- 不要在页头标题下方自行补一段副标题或帮助文案，除非需求文字明确给出
- 不要在宿主内容列与 `ProEditPage` 之间再包普通文档流容器；若确实需要包层，也必须继续传递 `flex: 1 1 0%`、`min-height: 0`
- 不要漏掉 `Form` 根或 `labelPlacement: 'top'`
- 不要自行发明 `Card + Form + 自定义 footer` 来替代 `ProEditPage` 的头部、滚动区和底栏
- 不要用通用 `Layout.footer` 去代替编辑页 archetype 的 sticky footer 语义
- 不要在宿主默认 Upload 触发器之外再额外拼一个 `UploadOutlined + 上传文件` 触发器
- 不要因为笔记本视口是 `1366` 左右，就把桌面三栏全页编辑一刀切成两列
- 不要用 `gap: 24px 40px` 这类同时放大纵横向间距的 grid 去替代表单本身的竖向节奏
- 不要在页面样式里覆写 `.hi-v5-form-item { margin-bottom / margin-top }` 来控制字段节奏
- 不要在页面样式里通过 `.hi-v5-form` / `.hi-v5-form-label` / `.hi-v5-form-item__label` 的上下间距去制造分组尾部留白
- 不要让 `groupGrid` / `fieldGrid` / 字段 grid 通过 `row-gap`、`padding-bottom`、`margin-bottom` 或最后一行留白去制造 footer 上方统一空白带
- 不要让宿主 `PageHeader` 的默认 `margin-bottom: 5px` 再叠加页面局部 `margin-bottom: 8px`
- 不要把 `input` / `select` / `checkSelect` / `switch` 这类紧凑控件默认写成 `colSpan: 3`；即使是多选，也不能因为值可能换行就直接整行铺满
- 不要把 `outer-padding` 只保留成普通 `padding` 容器；若它不是 `flex column`，白底主体的 `flex: 1` 不会真正接管高度，底部操作区会重新掉回文档流

## 失败信号

- 页面看起来像宿主灰底上的一张大白卡，而不是完整的全页编辑壳层
- 页头出现需求未描述的副标题、提示语，或返回入口退化成普通按钮
- 标题字号不是 `18px`，或没有使用 `PageHeader` back-button 语义
- 页面主体出现“外层白底壳 + 内层分组卡片”的双层主容器嵌套，视觉重心变厚
- 页面主体被拆成多张彼此断开的白卡，而不是“一个白底主体 + section 标题”
- `PageHeader` 落在内容白卡内部，或页面内外出现两个页头
- `PageHeader` 操作区没有贴右，而是挤在标题后面
- 页面存在返回能力，但返回按钮跑到了右上角工具区，leading back affordance 消失
- 主内容区和页面外层同时出现滚动条
- 底部操作区跟随表单内容滚动，而不是固定在页底
- 底部操作区停在表单内容末尾，下方还露出大片白底或宿主灰底，而不是吸附在页底
- 底部按钮虽然仍可点击，但整体落在 footer 中央或脱离 archetype 的右对齐动作区
- 上传字段触发器出现双图标或一前一后两个“上传”语义
- 桌面端本应三栏的表单在宽度仍充足时已经提前退成两栏
- 同一分组内字段上下被额外拉开，`FormItem` 之间像多叠了一层 `24px` row-gap
- 最后一行字段下方出现一条统一的空白带，像是整组字段整体又被向下垫高了 `16px`
- 标题区与主体区之间多出 `8px` 左右的额外缝隙，且该缝隙来自 `PageHeader` 根或页面局部 wrapper
- 为了对齐样式开始额外加 `Card`、`min-height: 100vh`、外层 `overflow: auto`
- 一级分组整体被额外包出一圈 `20px` 外边距/内边距，导致和当前项目基线不一致
- 本应与同组字段并排的 `select` / `checkSelect` 被强行整行铺满，导致三栏分组退化成单列或布局断裂

## 常见根因

- 宿主内容列、路由出口、页面根或 `ProEditPage` 外层任意一层丢了 `flex: 1 1 0%` / `min-height: 0`，导致页面高度无法收口，`inlineEditFooter` 只能跟着内容自然排版
- 在 `ProEditPage` 外层或祖先容器重新加了 `overflow-y: auto` / `min-height: 100vh`，把单滚动链打断，底栏和表单滚动区重新耦合
- 把 `inlineEditFooter` 包进 `formScrollBody`，或改挂到宿主 footer 槽，导致它不再是页面内部固定底栏，而是普通内容的一部分
- 不是从 `full-page-edit.tsx` 起步，而是从普通表单页或通用后台脚手架起步，后续只补类名却没有补全壳层关系
- `rules-only` 没有先选宿主 archetype，直接按通用示例手写，导致把“壳层语义”翻译成了“视觉近似”
- 宿主 archetype 原本提供了 leading back affordance，但生成页只保留了“返回列表”按钮，导致 header 交互语义退化
- 底部操作区没有复用 archetype 的 sticky footer 语义，而是退回通用 `Layout.footer` 或普通内容区按钮行
- 宿主 `Upload` 默认按钮已经有 icon，页面又在自定义 trigger content 里再补一次 icon，导致触发器语义重复
- 响应式策略偷懒使用 viewport 断点，而不是基于宿主内容槽宽度或复用宿主既有断点，导致桌面端过早从三栏掉到两栏
- 误把 grid 的 `row-gap` 当成字段间主节奏来源，导致纵向间距比宿主典型页更松
- 页面级覆写了 `.hi-v5-form-item` / `.hi-v5-form` / `.hi-v5-form-label`，把字段节奏 ownership 从 HiUI 表单骨架偷走
- 字段 grid 或 section wrapper 自己承担了 `padding-bottom` / `margin-bottom` / `row-gap`，导致 footer 上方出现统一 trailing whitespace
- 宿主默认 `page-header` 的 `20px + 5px margin-bottom` 没有被归一，页面局部又再补一层标题区 margin
- 把 `checkSelect` 误当成长文本控件处理，直接在 schema 里手写 `colSpan: 3`，导致服务信息等紧凑分组失去三栏基线
- `outer-padding` 只有 `padding` 没有 `display: flex; flex-direction: column;`，或 `white-body` / `main-scroll` / `footer` 任一层没守住自身职责，导致 sticky footer 高度链断掉

## 自检

- 是否是全页而不是抽屉
- 若是 `rules-only + existing-system`，是否已经明确写出“本页复用的宿主 archetype 文件路径”
- 是否从 `full-page-edit.tsx` 起步，而不是从空白文件或普通表单页起步
- 是否为三栏 `40`
- 桌面端在内容槽宽度仍充足时是否仍保持三栏，而不是提前掉两栏
- 字段 grid 是否只保留横向 `40`，纵向 `row-gap` 是否为 `0`
- 是否没有在页面层覆写 `.hi-v5-form-item` / `.hi-v5-form` / `.hi-v5-form-label` / `.hi-v5-form-item__label` 的上下间距
- 字段 grid 是否没有通过 `row-gap`、`padding-bottom`、`margin-bottom` 或尾行留白制造 footer 上方统一空白带
- 是否有 `onBack`
- 是否没有把返回行为降级成右上角 `titleExtra / extra` 按钮
- header 操作区是否仍然贴右
- 宿主 `page-header-portal.tsx` 是否没有把 `PageHeader` 根节点改成 `display:flex`
- 是否已经归零宿主 `page-header` 默认外边距，没有再额外补 `8px` 标题区间隙
- 是否为右对齐底栏
- 是否保留宿主适配页头 portal、`formScrollBody`、`inlineEditFooter`
- `inlineEditFooter` 是否仍是 `formScrollBody` 的同级兄弟，而不是滚动区子节点或宿主 footer portal 内容
- 宿主内容列 / 路由出口 / 页面根到 `ProEditPage` 之间是否仍保持连续 `flex + min-height: 0` 高度链
- `outer-padding` / `white-body` / `main-scroll` / `footer` 是否分别守住 `flex column` / `flex column + min-height: 0` / `flex: 1 + min-height: 0 + overflow: auto` / `flex-shrink: 0`
- `formScrollBody` 根是否没有再加额外 `padding: 20px`
- `input` / `select` / `checkSelect` / `switch` 是否没有无理由写成整行 `colSpan: 3`
- 是否没有出现“外层白底主体 + 内层 Card 分组”双层主容器
- 是否没有把单一白底主体拆成多张分散白卡
- 页面是否不是“单白卡表单页”
- 是否没有双滚动条
- 上传触发器是否没有出现双图标/双上传语义
