# 全页编辑

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51257:102808`

## 适用

- 全页新建 / 编辑
- 字段数 `>16` 的编辑主流程

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

- 当前项目存在共享实现时，优先复用 `src/components/pro-edit-page/`
- 外部项目必须参考 `examples/host-integration/src/pages/full-page-edit.tsx` 起步，但真实业务页要落在目标项目原有目录结构中，不要把模版页同步进 `src/typical-page-preview/`
- 主体为 `ProEditPage + Form`
- 必须保留单一 `PageHeader`、`proEditPageShellStyles.formScrollBody`、`proEditPageShellStyles.inlineEditFooter`
- `PageHeader` 必须由页面自带 frame 承载，并固定在 `whiteBody / ProEditPage` 之前；表单滚动区与底部按钮区继续挂在同一个 `ProEditPage` 内，不能把页头改走宿主共享 slot
- `formScrollBody` 只能承担表单滚动；`inlineEditFooter` 必须作为它的同级兄弟留在 `ProEditPage` 底部，不要塞进 `formScrollBody`，也不要改走宿主 `footerPortal`
- 若业务包含结构化子记录，可在一级分组流中追加可选明细表分组；无业务需求时默认不渲染该分组，不把它升格成第二个页面主体
- 宿主内容列 / 路由出口 / 页面根到 `ProEditPage` 的直系包裹层必须保持连续高度链：`display: flex`、`flex-direction: column`、`flex: 1 1 0%`、`min-height: 0`，必要时 `overflow: hidden`；少任一层，底部操作区都会退回普通文档流，无法吸底
- 三栏布局，横向 `gutter: 40`
- `PageHeader` 只有在页面从列表、业务按钮或旧入口二级进入时才保留 `onBack`；挂到正式导航时默认不带返回按钮
- 页面标题字重统一 `600`
- `PageHeader` 必须保持页面壳内的单一页头 owner，`extra` 操作区靠右；不要让按钮跟标题挤在左侧
- 若宿主保留共享 `header slot` 或自定义 carrier，必须证明该区域在标准典型页未占用时会自动折叠；不要把共享 slot 的样式补丁写成全页编辑模板合同
- 底部按钮组靠右
- `inlineEditFooter` 不要 `box-shadow`，只保留白底 + 顶部分隔
- 主区白底延伸到底栏上方，保持单滚动链
- 扁平表单使用 `flatEditForm` 思路：例如 `padding: 16px 20px 0`，不要只套裸 `formNormal`
- 分组表单允许 `GS().CardProps`，但不要再叠多余的水平 padding
- 不要在 `formScrollBody` 根上再加 `padding: 20px` 一类外层内边距；一级分组与字段区间距应由 `Form` / `Card` 内部结构承担
- 多个一级分组块之间竖向 `16px`
- `Upload`、长 `Textarea` 等宽控件默认整行

## 分组补充

共享规则见 [`forms-shared.md`](forms-shared.md)。

- 一级分组标题前不要加色块，一级分组标题字重统一 `600`
- 二级子分组标题使用 `3x14 + 9px + 48px`，标题字重统一 `600`
- 二级子分组内容区不要额外水平缩进

## 页面逐层拆解

### 1. Provider 与页面壳

- 全页编辑的第一层是 `ProEditPageProvider`，它负责详情回填、提交、暂存等业务请求，不负责视觉。
- 第二层是页面自带的 self-contained frame：`PageHeader -> whiteBody -> ProEditPage`。其中 `PageHeader` 负责页面识别，以及按挂靠语义决定是否提供返回；`ProEditPage` 负责白底主体、表单滚动区与底部操作区。
- 如果页面看起来像“宿主灰底里再放一张大白卡”，通常就是绕开了这层壳。

### 2. 页头层

- 页头必须由页面自身的 `PageHeader` 承载，并保持在 `whiteBody / ProEditPage` 之前，不应掉进白底表单内部。
- 页面标题通常使用业务对象或编辑场景命名，例如 `全页编辑`；挂到正式导航时页头默认不带 `onBack`，只有二级进入页才带返回和轻操作按钮。
- `PageHeader` 在这里的职责是页面识别、返回与轻量页面级动作，不承载表单提交按钮。
- 若项目保留共享 `header slot` bridge，其样式补丁也只能做最小宽度约束，不能把 `PageHeader` 根节点改成新的布局语法；但这不属于全页编辑模板本体合同。

### 3. 白底主体与主滚动

- `whiteBody` 承接全页编辑的白底正文体块，负责把灰底页头与白底编辑主体分层。
- `ProEditPage` 内部的主主体分为两段：`formScrollBody` 和 `inlineEditFooter`。
- `formScrollBody` 是唯一允许滚动的主表单区域，职责是承接所有编辑字段和分组。
- 它必须与宿主内容列形成连续的 `flex + min-height: 0` 高度链；否则底栏会掉回普通文档流。
- 外部项目的全页编辑必须挂在固定页壳的表单滚动区内，不要把 `Form` 单独塞进一张普通 `Card`。
- 不要在 `formScrollBody` 根上再叠 `padding: 20px` 这种外层壳内边距，一级分组之间的节奏应由表单内部结构承担。

### 4. 表单分组层

- 此页型的表单通常由若干一级分组组成，例如 `基础信息`、`客户信息`、`服务信息`。
- 若业务还包含结构化明细记录，例如商品、设备、履约条目、处理步骤，可在一级分组之间插入一个可选明细表分组，例如 `商品信息`。
- 一级分组是页面的主阅读单元，不应拆成很多小白卡自由漂浮；一级分组之间竖向 `16px`。
- 一级分组标题前不要加色块，标题字重 `600`；如果有二级分组，再使用共享规则里的 `3x14 + 9px + 48px` 标题语法。
- 分组可通过 `GS().CardProps({ size: 'lg' })` 组织，但分组卡不应再叠额外水平 padding。
- 明细表分组的标题和右侧轻操作也必须继续走一级分组标题语法；例如 `添加商品` 这类动作应挂在标题右侧，不要再额外手写一套标题层，也不要在标题和表格之间自行补分割线冒充分组节奏。

### 5. 表单网格与字段模式

- 该页型默认使用三栏网格：`columnCount: 3`、`gutter: 40`。
- 普通短字段按三栏流式排布；宽字段如 `Textarea`、`Upload` 应直接整行，不靠再包一层容器补宽度。
- 字段组件模式以当前项目接入的 HiUI5 `Form` / `SchemaForm` / `schema-core` 支持能力为准；`Text`、`Select`、`Date`、`CheckSelect`、`Textarea` 只是常见输入类型，不代表全页编辑只能使用这些字段。
- 明细表若承载行内编辑，可在单元格内使用 HiUI5 `Input`、`Select`、`DatePicker` 等受管控件；下拉和日期浮层继续沿用运行时公开的 overlay 配置，不在表格局部再发明新的挂载层。
- 不要混入列表型按钮区、说明卡或额外统计块；新增字段类型时也应继续遵守全页编辑的表单语义、分组节奏和网格规则。
- 标签一律在上方，说明这是表单页而不是详情页；不要把标签改到左边形成另一套语法。

### 6. 底部操作区

- `inlineEditFooter` 是全页编辑的固定底栏，不是一个普通 `div`。
- 它必须是 `formScrollBody` 的同级兄弟；典型动作组合是 `CancelButton + StashButton + SubmitButton`。
- 布局上按钮组靠右；视觉上只保留白底与顶部分隔，不叠阴影、不放业务说明文字。
- 所有提交、暂存、取消类主流程动作都应落在这里，不要塞进页头，也不要放到表单滚动区末尾。

## 关键组件与属性契约

### `ProEditPageProvider`

- `detailRequest`：详情回填入口。
- `submitRequest`：主提交流程入口。
- `stashRequest`：暂存 / 草稿入口。
- 职责边界：provider 负责业务请求，不负责页头、滚动区和底栏视觉。

### `ProEditPage`

- `groups`：分组定义入口；控制页面主表单结构。
- `onCancel`：取消回调。
- `onSubmitSuccess`：提交成功后的反馈入口。
- `onStashSuccess`：暂存成功后的反馈入口。
- 职责边界：它是全页编辑壳层 owner，内部必须继续维持页头、滚动区、底栏的结构顺序。

### `PageHeader`

- `title`：页面标题入口。
- `onBack`：返回动作入口；仅用于从列表、业务按钮或旧入口二级进入的全页编辑。
- `extra`：页头轻操作入口；不承载主提交流程按钮。

### `Form`

- `groups`：表单分组入口。
- `initialValues`：默认值 / 回填值入口。
- `formProps.labelPlacement`：标签语法，默认 `top`。
- `borderedGroups`：是否描边分组。
- `gridProps.columnCount`：列数。
- `gridProps.gutter`：列间距；全页编辑默认 `40`。

### `CancelButton` / `StashButton` / `SubmitButton`

- 作用：底栏标准动作按钮。
- 布局约束：只应出现在 `inlineEditFooter` 内，不前移到页头或后移到滚动区末尾。

## 禁止

- 不要绕开 `ProEditPage` 再重复手写主白卡、滚动区和固定底栏
- 不要把全页编辑生成成“灰底页面里只有一张大白卡表单”的通用后台样式；这通常说明已经绕开固定页壳
- 不要把 `>16` 字段继续塞进抽屉
- 不要在表单外包层使用 `margin-left/right + width: 100%`
- 不要在 `ProEditPage` 外再包 `min-height: 100vh` 或重复 `overflow: auto`
- 不要把 `PageHeader` 再塞回 `ProEditPage` / 白底主体内部
- 不要把 `inlineEditFooter` 放进 `formScrollBody`，也不要改用 `PageFooterPortal` / 自定义宿主 footer 槽承载全页编辑底栏
- 不要在宿主内容列与 `ProEditPage` 之间再包普通文档流容器；若确实需要包层，也必须继续传递 `flex: 1 1 0%`、`min-height: 0`
- 不要漏掉 `Form` 根或 `labelPlacement: 'top'`
- 不要自行发明 `Card + Form + 自定义 footer` 来替代 `PageHeader + whiteBody + ProEditPage` 的固定结构

## 失败信号

- 页面看起来像宿主灰底上的一张大白卡，而不是完整的全页编辑壳层
- `PageHeader` 落在内容白卡内部，或页面内外出现两个页头
- `PageHeader` 操作区没有贴右，而是挤在标题后面
- 主内容区和页面外层同时出现滚动条
- 底部操作区跟随表单内容滚动，而不是固定在页底
- 底部操作区停在表单内容末尾，下方还露出大片白底或宿主灰底，而不是吸附在页底
- 为了对齐样式开始额外加 `Card`、`min-height: 100vh`、外层 `overflow: auto`
- 一级分组整体被额外包出一圈 `20px` 外边距/内边距，导致和当前项目基线不一致

## 常见根因

- 宿主内容列、路由出口、页面根或 `ProEditPage` 外层任意一层丢了 `flex: 1 1 0%` / `min-height: 0`，导致页面高度无法收口，`inlineEditFooter` 只能跟着内容自然排版
- 在 `ProEditPage` 外层或祖先容器重新加了 `overflow-y: auto` / `min-height: 100vh`，把单滚动链打断，底栏和表单滚动区重新耦合
- 把 `inlineEditFooter` 包进 `formScrollBody`，或改挂到宿主 footer 槽，导致它不再是页面内部固定底栏，而是普通内容的一部分
- 不是从 `full-page-edit.tsx` 起步，而是从普通表单页或通用后台脚手架起步，后续只补类名却没有补全壳层关系

## 自检

- 是否是全页而不是抽屉
- 是否从 `full-page-edit.tsx` 起步，而不是从空白文件或普通表单页起步
- 是否为三栏 `40`
- 页头返回语义是否与挂靠方式一致：二级进入页保留 `onBack`，正式导航页默认不带 `onBack`
- header 操作区是否仍然贴右
- 若宿主存在共享 `header slot` 组件，它是否没有为了兼容而改写 `PageHeader` 根布局，且空态会自动折叠
- 是否为右对齐底栏
- 是否保留单一 `PageHeader`、`formScrollBody`、`inlineEditFooter`
- `inlineEditFooter` 是否仍是 `formScrollBody` 的同级兄弟，而不是滚动区子节点或宿主 footer portal 内容
- 宿主内容列 / 路由出口 / 页面根到 `ProEditPage` 之间是否仍保持连续 `flex + min-height: 0` 高度链
- `formScrollBody` 根是否没有再加额外 `padding: 20px`
- 页面是否不是“单白卡表单页”
- 是否没有双滚动条
