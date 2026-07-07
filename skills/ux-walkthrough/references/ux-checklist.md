# UX 走查清单

> 来源：UX 体验规则  
> 用途：逐项检查页面/功能的用户体验质量。示例按需读 `related_examples` 锚点，**禁止通读 `issue-examples/*.md` 全文**。

## 执行要求

走查时必须按本文顺序逐项检查。最终报告只输出命中的问题，不输出未命中项。

走查前必须先枚举页面可交互面：按钮、链接、图标按钮、菜单、下拉、Tab、筛选、输入框、上传、弹窗、抽屉、列表项/卡片/表格行/树节点、分页、可滚动区域、横向滑动区域、拖拽区域、hover/长按/右键才出现的上下文操作。URL 模式须用页面快照、视觉检查和实际操作交叉验证，避免只验证主路径。

对列表、卡片、表格行、树节点、看板卡等重复单元，必须至少检查一组典型对象的默认态、hover 态、选中态、快捷操作、状态切换后反馈；隐藏操作只在 hover 后出现时，也要纳入走查。

对具备创建、编辑、删除、提交、发布、邀请、关联、导入等业务动作的页面，必须至少跑通一条完整任务闭环：进入入口 → 填写必要字段 → 提交 → 验证成功/失败反馈 → 验证结果落点（列表、详情、状态、数量变化）→ 如有详情页则进入详情验证 → 如可安全清理则执行删除/撤销/归档并验证结果回收。不得只验证按钮可点击、弹窗可打开或字段可输入。

若真实删除、提交、邀请、发布、转移权限等动作可能影响线上数据，必须使用测试对象或可回收对象；无法安全执行时，应在报告附录标记为「待交互验证」并说明阻塞原因，不能把流程视为已跑通。

截图/URL 证据不足但已暴露明显用户疑惑时，不应只写进附录概括，应作为「待交互验证」逐条列出。每条至少包含位置、疑惑点、需要验证的交互和建议验证方式；标题必须显式包含「待交互验证」，避免读者误解为已确认缺陷。不得因为无法确认最终行为就完全省略。

---

## 一、操作高效

核心目标：用户能快速、高效地完成任务。

### UX-1.1 信息架构与任务路径清晰

- **report_category**：流程问题
- **default_severity**：P1（核心入口完全不可达 → 升 P0，见 `severity-rubric.md`）
- **modes**：code, url, screenshot
- **ignore_boundary**：见 `ignore-list.md` §1；数据密集但主 CTA 可见 → 不报
- **related_examples**：`issue-examples/flow.md#main-cta-hidden`、`issue-examples/flow.md#menu-too-deep`、`issue-examples/flow.md#steps-redundant`、`issue-examples/flow.md#task-chain-dead-end`、`issue-examples/flow.md#task-lifecycle-not-verified`
- **检查项**：用户进入页面后，首屏应知道「这是做什么的」和「第一步做什么」；创建/提交类任务是否形成完整闭环
- **判断标准**：首屏是否包含页面标题、主操作入口、核心筛选/搜索；新建/提交后是否能验证结果落点、详情、状态变化和清理路径
- **✅ 推荐**：进入「客户列表」后，首屏能看到页面标题、搜索筛选和「新增客户」按钮；新建测试对象后能在列表找到、进入详情、编辑或删除后状态一致
- **❌ 不建议**：主操作被折叠进「更多」、首屏无主路径；菜单嵌套超过 3 级；只打开新建弹窗但未提交验证结果

### UX-1.2 内容展示合理且完整清晰

- **report_category**：样式问题
- **default_severity**：P1
- **modes**：code, url, screenshot
- **ignore_boundary**：见 `ignore-list.md` §1、§5；HiUI 各页型基线内 **合规密度**（列表 10 列、统计卡、树表、多图、异常单焦点等）→ 不报；**偏离 baseline** 或关键信息被埋没 → 仍报
- **related_examples**：`issue-examples/visual.md#info-hierarchy`、`issue-examples/flow.md#form-no-grouping`、`issue-examples/visual.md#table-too-many-columns`
- **检查项**：视觉清晰、密度合理、文字易读、重点突出、精简冗余
- **判断标准**：高频信息优先展示，低频信息适当收纳；标题与正文有主次区分
- **✅ 推荐**：标题与次要信息在大小、颜色上有主次；列表优先关键字段，低频字段进列设置
- **❌ 不建议**：标题与正文样式相同；≥10 字段表单无分组平铺

### UX-1.3 界面与交互一致性

- **report_category**：交互问题
- **default_severity**：P1
- **modes**：code, url, screenshot
- **边界**：与 UX-2.5 区分——本条看 **同类对象的结构/打开方式/返回路径**；跨页按钮位置、功能色语义归 UX-2.5
- **related_examples**：`issue-examples/visual.md#color-semantics`、`issue-examples/flow.md#cross-page-return-inconsistent`、`issue-examples/flow.md#rejected-no-resubmit`、`issue-examples/flow.md#task-lifecycle-not-verified`
- **检查项**：同一系统的内容结构、详情打开方式、返回路径应尽量一致；对象从列表到详情、编辑、删除/归档的闭环应可预测
- **判断标准**：同类型对象在不同模块中的交互模式是否统一；创建成功后的列表刷新、详情入口、返回落点和删除后回收是否一致
- **✅ 推荐**：订单、客户、合同详情结构相近；保存后进入详情或返回列表且保留上下文
- **❌ 不建议**：同类对象有的开新页、有的开抽屉、有的开弹窗；创建成功后找不到对象或删除后列表状态不刷新

### UX-1.4 功能及信息可见性

- **report_category**：交互问题
- **default_severity**：P1
- **modes**：code, url, screenshot
- **related_examples**：`issue-examples/flow.md#main-cta-hidden`、`issue-examples/interaction.md#disabled-button-tooltip`、`issue-examples/interaction.md#empty-state-missing`、`issue-examples/interaction.md#permission-entry-mismatch`、`issue-examples/interaction.md#interactive-surface-missed`
- **检查项**：功能易发现、可操作、可预见，文案统一；可点击、滑动、拖拽、长按/hover 的交互面不应遗漏
- **判断标准**：新能力/智能能力是否有可见标识；状态是否可感知；同功能文案是否一致；隐藏交互是否有可发现线索和可验证反馈
- **✅ 推荐**：新功能有标签或说明；禁用态 Hover 有原因；空状态有说明；可滚动/滑动区域有方向提示或滚动条
- **❌ 不建议**：核心 CTA 隐藏；禁用无解释；搜索无结果白屏；图标、卡片、列表项可操作但没有 hover/tooltip/焦点/手势提示

### UX-1.5 系统状态可见性

- **report_category**：交互问题
- **default_severity**：P1
- **modes**：code, url, screenshot（截图模式部分项 → 待交互验证）
- **边界**：与 UX-1.6 区分——本条看 **进行中** 状态（loading、上传进度、提交中遮罩）；操作 **结果** 反馈（成功/失败 toast）归 UX-1.6
- **related_examples**：`issue-examples/interaction.md#loading-missing`、`issue-examples/interaction.md#partial-success-no-detail`
- **检查项**：操作情境、运行状态、进度是否明确
- **判断标准**：加载/上传/提交等异步操作是否有状态提示
- **✅ 推荐**：加载显示「加载中」；上传显示进度
- **❌ 不建议**：提交后按钮无 loading、无遮罩，用户重复点击

### UX-1.6 操作反馈必要性

- **report_category**：交互问题
- **default_severity**：P1
- **modes**：code, url, screenshot
- **边界**：与 UX-1.5 区分——本条看 **结果** 是否告知（保存成功/失败）；进行中 loading 归 UX-1.5
- **related_examples**：`issue-examples/interaction.md#loading-missing`、`issue-examples/interaction.md#false-success-feedback`、`issue-examples/interaction.md#partial-success-no-detail`
- **检查项**：操作后是否有即时反馈，反馈是否区分结果
- **判断标准**：提交/保存/删除等操作后是否有明确结果提示
- **✅ 推荐**：保存/提交后有 Message「已提交」等反馈
- **❌ 不建议**：操作后无任何反馈，用户不确定是否成功

### UX-1.7 数值高效展示

- **report_category**：样式问题
- **default_severity**：P2
- **modes**：code, url, screenshot
- **ignore_boundary**：见 `ignore-list.md` §5；HiUI **basic-table** 文本/号码列左对齐 + ellipsis → 不报；**full-page-edit** 非金额列左对齐 → 不报
- **related_examples**：`issue-examples/visual.md#tabular-nums`
- **检查项**：金额、数量等数值列是否右对齐；是否使用等宽数字
- **判断标准**：表格数值列右对齐；必要时 `tabular-nums` 便于纵向比较
- **✅ 推荐**：金额、数量列右对齐且数字等宽
- **❌ 不建议**：数值左对齐/居中；比例字体导致列对不齐

---

## 二、符合用户直觉

核心目标：界面符合用户的心理模型和使用习惯。

### UX-2.1 易理解性

- **report_category**：交互问题
- **default_severity**：P1
- **modes**：code, url, screenshot
- **related_examples**：`issue-examples/interaction.md#unfriendly-error`
- **检查项**：文案是否面向业务而非系统实现
- **判断标准**：字段名、按钮、提示是否使用业务语言
- **✅ 推荐**：「库存同步失败，请稍后重试」
- **❌ 不建议**：「接口调用异常」、仅显示错误码

### UX-2.2 防错与容错

- **report_category**：交互问题
- **default_severity**：P1（批量删除无确认/无恢复 → 升 P0）
- **modes**：code, url, screenshot
- **related_examples**：`issue-examples/interaction.md#delete-no-recovery`、`issue-examples/interaction.md#ambiguous-context-action-icon`、`issue-examples/interaction.md#unfriendly-error`、`issue-examples/interaction.md#submit-failure-loses-input`、`issue-examples/flow.md#repeated-input-after-failure`、`issue-examples/flow.md#rejected-no-resubmit`
- **检查项**：是否预防错误、支持撤销、提供清晰指引
- **判断标准**：危险操作是否有二次确认；容易被理解为删除、关闭、移除、取消的图标是否真的执行对应动作；错误是否告知原因与解法
- **✅ 推荐**：删除有确认；错误提示含原因和下一步
- **❌ 不建议**：危险操作无防错；删除后无恢复路径；用 `X`、垃圾桶等高风险语义图标承载非删除/非关闭动作且缺少文字说明

### UX-2.3 诚实性

- **report_category**：交互问题
- **default_severity**：P2
- **modes**：code, url, screenshot
- **related_examples**：`issue-examples/interaction.md#false-success-feedback`
- **检查项**：是否透明、准确、不误导
- **判断标准**：是否如实展示操作/状态/结果
- **✅ 推荐**：状态与结果真实一致
- **❌ 不建议**：显示成功实际未成功；隐藏关键限制

### UX-2.4 易学性

- **report_category**：交互问题
- **default_severity**：P2
- **modes**：code, url
- **related_examples**：`issue-examples/interaction.md#modal-close-methods`、`issue-examples/interaction.md#keyboard-inaccessible`、`issue-examples/interaction.md#interactive-surface-missed`
- **检查项**：是否沿用通用交互习惯，认知负担低；复杂手势是否有替代入口
- **判断标准**：弹窗是否支持 Esc/蒙层关闭；点击、双击、滑动、拖拽、长按、右键、键盘操作是否符合平台习惯；是否过度引入自定义范式
- **✅ 推荐**：弹窗多种关闭方式；键盘可操作；长按/拖拽/横滑等低可见操作有提示和替代入口
- **❌ 不建议**：仅 X 关闭；完全依赖鼠标的自定义组件；关键操作只能通过长按/横滑/拖拽触发且无说明

### UX-2.5 一致与可预测性

- **report_category**：交互问题
- **default_severity**：P1
- **modes**：code, url, screenshot
- **边界**：与 UX-1.3 区分——本条看 **跨页面** 的主操作位置、功能色语义、术语是否统一；单对象详情结构归 UX-1.3
- **related_examples**：`issue-examples/visual.md#color-semantics`、`issue-examples/flow.md#cross-page-return-inconsistent`、`issue-examples/interaction.md#ambiguous-context-action-icon`
- **检查项**：同类对象同类结构；相同行为相同模式；术语、图标和功能色全局统一
- **判断标准**：主操作位置、功能色语义、图标语义是否跨页一致；同一对象的默认态/hover 态/选中态快捷操作是否可预测
- **✅ 推荐**：列表页「新增」在右上角；置顶/取消置顶、收藏/取消收藏、归档/恢复等状态切换使用成对图标或明确文字
- **❌ 不建议**：保存按钮位置页页不同；同色多义；同一图标在不同位置分别表示关闭、删除、取消状态或移除关系

---

## 三、好的体感

核心目标：界面美观、安全、有帮助、有人情味。

### UX-3.1 审美性

- **report_category**：样式问题
- **default_severity**：P2
- **modes**：url, screenshot（code 看样式文件）
- **related_examples**：`issue-examples/visual.md#spacing-inconsistent`、`issue-examples/visual.md#image-display`、`issue-examples/visual.md#logo-usage`
- **检查项**：美观服务于功能，视觉是否统一
- **判断标准**：图标风格、色彩层次、间距体系是否协调
- **✅ 推荐**：Icon 风格统一；8px 间距体系
- **❌ 不建议**：间距混乱；图片变形/裂图；Logo 用法不规范

### UX-3.2 安全性

- **report_category**：交互问题
- **default_severity**：P0
- **modes**：code, url, screenshot
- **ignore_boundary**：见 `ignore-list.md` §5；HiUI 模板 **mock 明文**（列表/表单）→ 不报；用户声明 **生产/合规场景** → 仍报 `[业务域]`
- **related_examples**：`issue-examples/interaction.md#sensitive-data-mask`、`issue-examples/interaction.md#permission-entry-mismatch`
- **检查项**：是否保护身份与企业数据
- **判断标准**：敏感信息是否脱敏；密码是否密文展示
- **✅ 推荐**：手机号脱敏；密码加密显示
- **❌ 不建议**：明文展示手机号、密码

### UX-3.3 帮助性

- **report_category**：交互问题
- **default_severity**：P2
- **modes**：code, url, screenshot
- **related_examples**：—
- **检查项**：是否主动帮助、场景化提示
- **判断标准**：新流程是否有引导或说明
- **✅ 推荐**：首次使用有引导气泡或空状态指引
- **❌ 不建议**：复杂流程无任何说明

### UX-3.4 人性化/情感化

- **report_category**：交互问题
- **default_severity**：P2
- **modes**：code, url（截图/code 难验证 → 待确认）
- **ignore_boundary**：见 `ignore-list.md` §3；无明确反例证据 → 默认不报
- **related_examples**：—
- **检查项**：语气是否友好、不机械
- **判断标准**：错误/成功提示是否可读、有温度
- **✅ 推荐**：提示语自然、含下一步指引
- **❌ 不建议**：全系统机械式「操作成功」且无上下文

### UX-3.5 用户多样性

- **report_category**：样式问题
- **default_severity**：P2
- **modes**：url, screenshot（需多 viewport 证据；单截图 → 待确认）
- **ignore_boundary**：见 `ignore-list.md` §3
- **related_examples**：`issue-examples/flow.md#mobile-table-scroll`、`issue-examples/interaction.md#keyboard-inaccessible`
- **检查项**：是否适配多端与不同使用场景
- **判断标准**：移动端是否可用；关键表格是否可访问
- **✅ 推荐**：小屏有列优先级或滚动提示；键盘可导航
- **❌ 不建议**：移动端表格溢出无提示；组件仅支持鼠标

---

## 快速索引

| ID | 名称 | 报告分类 | 默认严重度 | 主示例 |
|----|------|----------|------------|--------|
| UX-1.1 | 信息架构与任务路径 | 流程问题 | P1 | flow.md#main-cta-hidden |
| UX-1.2 | 内容展示 | 样式问题 | P1 | visual.md#info-hierarchy |
| UX-1.3 | 界面一致性 | 交互问题 | P1 | flow.md#cross-page-return-inconsistent |
| UX-1.4 | 功能可见性 | 交互问题 | P1 | interaction.md#empty-state-missing |
| UX-1.5 | 系统状态 | 交互问题 | P1 | interaction.md#partial-success-no-detail |
| UX-1.6 | 操作反馈 | 交互问题 | P1 | interaction.md#false-success-feedback |
| UX-1.7 | 数值展示 | 样式问题 | P2 | visual.md#tabular-nums |
| UX-2.1 | 易理解性 | 交互问题 | P1 | interaction.md#unfriendly-error |
| UX-2.2 | 防错容错 | 交互问题 | P1 | interaction.md#delete-no-recovery |
| UX-2.3 | 诚实性 | 交互问题 | P2 | interaction.md#false-success-feedback |
| UX-2.4 | 易学性 | 交互问题 | P2 | interaction.md#modal-close-methods |
| UX-2.5 | 一致可预测 | 交互问题 | P1 | visual.md#color-semantics |
| UX-3.1 | 审美性 | 样式问题 | P2 | visual.md#spacing-inconsistent |
| UX-3.2 | 安全性 | 交互问题 | P0 | interaction.md#sensitive-data-mask |
| UX-3.3 | 帮助性 | 交互问题 | P2 | — |
| UX-3.4 | 情感化 | 交互问题 | P2 | — |
| UX-3.5 | 用户多样性 | 样式问题 | P2 | flow.md#mobile-table-scroll |

| 分类 | 数量 | 默认 P0 | 默认 P1 | 默认 P2 |
|------|------|---------|---------|---------|
| 操作高效 | 7 | 0 | 6 | 1 |
| 符合用户直觉 | 5 | 0 | 3 | 2 |
| 好的体感 | 5 | 1 | 0 | 4 |
| **合计** | **17** | **1** | **9** | **7** |

> 默认严重度仅供初判；最终以 `severity-rubric.md` 为准。
