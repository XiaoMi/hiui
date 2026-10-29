# HiUI5 典型页槽位边界

本文件是 AI 写页面前必须读取的轻量边界文档。它只回答三件事：哪些槽位允许替换，哪些区域禁止触碰，哪些说明不能进入页面常驻 UI。

通用规则：

- 标准典型页允许替换的内容必须来自 `page-types.manifest.json` 的 `generationContract.businessSlots`、`slotBoundaryContract.allowedSlots` 和 brief 的 `businessSlotPlan`；生成时必须按 `businessSlotPlan` 一次替换标题、筛选、列、指标、请求/mock 主题和禁止残留文案，不能只替换标题。
- 禁止触碰的内容来自 `lockedRegions`、`slotBoundaryContract.forbiddenSlots` 和 `regionOwnershipContract`。
- 写代码前必须先形成 `structureSummary` 与 `intentContract`；如果还说不清页面有哪些稳定主区域、各区域负责什么、哪些结构不得新增，就不能直接进入模板生成。
- 当 `design-restore` 命中标准典型页，但仍需要在模板内做受控贴稿时，必须先形成 `pageAdjustmentContract`，再进入 `base-template-local-adjustment`；不得跳过合同直接自由改壳。
- `pageAdjustmentContract` 只允许在 manifest 已证明的局部受控区域内生效；它不能改写页头 owner、白底主体 owner、主滚动 owner，也不能把典型页改成第二个主页面结构。
- `pageAdjustmentContract` 的执行前提是“当前 family/pageType 仍然成立”；它不再默认只属于 `typical-page`。当 `analytics-page` 仍保留单一 `whiteBody`、分析阅读流与主骨架时，同样可以进入受控局部改造。
- 接口未接入、mock 状态、生成说明、测试说明只能写入最终回复、README、meta，或作为按钮点击后的 `Message`；不得渲染成页面常驻 UI。
- 如果业务确实需要公告、提示、说明区，必须先在 manifest 中补充受控业务槽位，再生成页面。
- 若 `intentContract.mustNotAdd` 已明确禁止某类结构，例如未请求的表格、分页、第二主体或常驻说明块，生成器不得再把它们解释成“模板默认收口”并补出。

## table-stat

允许槽位：`title`、`queryFields`、`tableFields`、`searchPlaceholder`、`statSection`、`extra`、`tableProps`、`overviewRequest`、`listRequest`、`headerActions`、`mockData`。

禁止触碰：`StatListPageFrame` 壳层、白底主体、筛选区容器、表格容器、分页区域、主滚动区域。

危险用法：不要把 `statSection` 改成普通文本块；不要在 `StatListPageFrame` 外追加说明块；不要重新手写 `PageHeader + QueryFilter + Table`。

结构要求：统计区默认由 `StatOverviewGrid` 或 manifest 登记的统计组件承载；筛选、统计、表格、分页必须属于同一个典型页主体。

## data-visualization

允许槽位：`title`、`queryFields`、`searchPlaceholder`、`statSection`、`tableFields`、`tableProps`、`listRequest`、`mockData`。

说明：这些槽位在 `data-visualization` 中表示“受控重构面”，不是常规典型页那种“复制母版后逐项替换业务槽位”的自动生成输入。固定区域只有页头与 `whiteBody`；其余内容区按规范规则生成。

禁止触碰：`StatListPageFrame` 壳层、单一 `whiteBody` 工作区、主滚动区域、图表与表格共用的阅读流、分页 owner。

危险用法：不要把 `statSection` 外提成第二个页面主体；不要把图表区拆成第二层白底或独立二级页；不要把正式图表区写成“每一行换一种 grid 类型”；主图强调不要靠切换第二套图表 grid 完成；不要把每张指标卡都强制配迷你图；不要把页面退化成“筛选 + 表格 + 分页 + 几张装饰图”；不要把 mock/接口说明做成页面常驻公告。

结构要求：指标卡与图表区必须继续位于同一个 `StatListPageFrame` 白底工作区；若业务包含明细表，它也必须留在同一个工作区中，作为分析阅读流尾部收口。`queryFields` / `searchPlaceholder` 承担页面级 control strip，`statSection` 承担分析工作区主体，`tableFields` / `listRequest` 只在需要尾部明细表时承接该区域。`summarySection` 可独立使用摘要卡 grid；正式 `chartSection` 必须在整个图表区保持一种基础 grid mode，主图通过同一 grid 中的 span 表达，指标卡默认只要求标题 + 主值，迷你图可选。

## feedback-status

允许槽位：`title`、`description`、`primaryAction`、`secondaryActions`、`headerActions`、`indicator`、`variantId`、`mockData`。

禁止触碰：单一 `PageHeader`、单一 `whiteBody` 主体、反馈面板居中结构、重复 `PageHeader`、额外主滚动容器。

危险用法：不要把异常反馈页误生成多张白卡或自由公告页；不要在反馈面板外追加常驻说明条；不要为了不同插图拆成多个独立页型。

结构要求：页头由页面自身的 `PageHeader` 持有；反馈主体默认是一块居中的 `EmptyState` 面板，承载标题、描述、插图和按钮；所有异常变体共用同一页型和同一页面骨架。

## table-basic

允许槽位：`title`、`queryFields`、`tableFields`、`searchPlaceholder`、`extra`、`tableProps`、`listRequest`、`headerActions`、`mockData`。

禁止触碰：`TablePageFrame.children`、白底主体、筛选区容器、表格容器、分页区域、主滚动区域。

危险用法：不要把说明文字、接口状态、mock 提示放进 `TablePageFrame` children；不要在表格下方追加常驻说明条；不要用额外白卡延长页面。

结构要求：`TablePageFrame` 默认不接收业务 children；需要提示时放在按钮点击 `Message` 或交付说明中。

## tree-table

允许槽位：`title`、`queryFields`、`treeColumn`、`tableFields`、`searchPlaceholder`、`extra`、`tableProps`、`listRequest`、`mockData`。

禁止触碰：`TablePageFrame.children`、表格外独立左树、两个独立页面、白底主体、表格分页链路。

危险用法：不要把树形表格误生成左树右表；不要把树移动到表格外；不要额外创建左侧栏。

结构要求：树展开必须在表格首列内完成；如果左树是独立区域，应改判 `tree-split`。

## tree-split

允许槽位：`title`、`leftPane`、`treeData`、`queryFields`、`tableFields`、`searchPlaceholder`、`extra`、`tableProps`、`listRequest`、`mockData`。

禁止触碰：`TreeSplitPageFrame.children`、两个独立页面、额外白卡主体、额外主滚动容器、左树右表分割器。

危险用法：不要把 `leftPane` 当自由页面容器；不要在 `leftPane` 内放完整 `PageHeader`、`TablePageFrame` 或 `PageTable`；不要把右侧表格拆出 `TreeSplitPageFrame`。

结构要求：左树、分割条、右筛选、右表格必须由 `TreeSplitPageFrame` 统一持有。

## drawer-form

允许槽位：`title`、`trigger`、`formFields`、`initialValues`、`submitRequest`、`mockData`、受控 `footer`。

禁止触碰：`Drawer.Footer`、普通自定义 footer、`Card + Form + footer`、抽屉根样式、抽屉底栏节奏。

危险用法：不要因为抽屉支持 children 就自由塞说明区；不要把少量字段表单写成普通页面表单；不要超过 16 个编辑字段。

结构要求：抽屉底部操作必须由 `ProDrawerFooterActions` 或 manifest 允许的 footer owner 承载；编辑字段超过 16 个应改判 `full-page-edit`。

## drawer-detail

允许槽位：`title`、`trigger`、`detailFields`、`detailRequest`、`mockData`。

禁止触碰：`Card + Descriptions`、多分组主详情、抽屉体多层白卡、常驻交付说明。

危险用法：不要把复杂主详情塞进抽屉；不要把只读字段堆成多组大详情；不要绕开 `ProDetailDrawerBody`。

结构要求：只读字段不超过 16 个；多分组或主流程详情应改判 `full-page-detail`。

## full-page-edit

允许槽位：`title`、`onBack`、`formFields`、`groups`、`detailTable`、`initialValues`、`submitRequest`、`draftRequest`、`mockData`、`headerExtra`。

禁止触碰：`ProEditPage` 壳层、`PageHeader`、`formScrollBody`、`inlineEditFooter`、底部吸底结构、主滚动区域。

危险用法：不要退化成 `Card + Form + footer`；不要用 `TypicalPageFooterPortal`；不要把 footer 放进滚动体；不要额外加页面说明块；不要把 `detailTable` 拆成第二个主页面体块、独立白卡或第二套标题层；不要在标题和表格之间额外手写分割线冒充分组节奏。

结构要求：`PageHeader`、`formScrollBody`、`inlineEditFooter` 必须保持母版顺序；底部操作区由 `inlineEditFooter` 持有，且 `inlineEditFooter` 必须是 `formScrollBody` 的同级兄弟。若页面挂到正式导航注册表或正式业务壳，`onBack` 默认不输出；只有从业务按钮或列表二级进入时，才保留 `onBack`。旧宿主二级入口保留 `onBack` 时，不得把 `react-router-dom` 视为默认前提。若业务存在结构化子记录，可在一级分组流中追加可选 `detailTable`；它仍属于 `groups` 驱动的表单阅读流，标题右侧轻操作与表格间距沿用一级分组节奏，无需求时默认隐藏该分组。`detailTable` 若包含行内编辑，优先复用 HiUI5 `Input`、`Select`、`DatePicker` 等受管控件，不在单元格里另造自由表单壳。

运行时边界：若宿主存在共享 `header slot`，它必须在页面未占用时自动折叠；标准典型页不得再把页头 ownership 交回宿主。

## full-page-detail

允许槽位：`title`、`onBack`、`sections`、`request`、`mockData`、`headerExtra`。

兼容别名：`detailFields`、`groups`、`detailRequest` 只作为过渡期输入别名保留；新生成和新规则都应回到 `sections + request` 主模型。

受管 section 类型：

- `description-group`：主只读详情分组，仍由 `SchemaDescriptionsBridge` / `Descriptions` 承担主表达。
- `summary-cards`：补充型卡片摘要区，适合三包信息、生命周期摘要、指标摘要等紧凑信息块。
- `data-table`：补充型只读表格区，适合服务记录、处理记录、履约明细、审计日志等支撑列表。

禁止触碰：重复 `PageHeader`、普通 `Card + Descriptions`、自定义白底主体、额外主滚动容器、常驻交付说明。

危险用法：不要把少字段辅助详情写成全页详情；不要重复创建页头；不要把分组详情拆成随意 Card 列表；不要让卡片摘要或表格区替代主描述分组；不要让补充 section 脱离 `SchemaGroup` 节奏单独生成第二套详情壳。

结构要求：页头由页面自身的 `PageHeader` 持有，详情分组由 `ProDetailPage` / `SchemaGroup` 节奏承载；`description-group` 仍是主阅读锚点，`summary-cards` 与 `data-table` 只允许作为受管 supporting sections 插入同一 detail flow；少字段详情应改判 `drawer-detail`。若页面挂到正式导航注册表或正式业务壳，`onBack` 默认不输出；只有从业务按钮或列表二级进入时，才保留 `onBack`。旧宿主二级入口保留 `onBack` 时，不得把 `react-router-dom` 视为默认前提。
