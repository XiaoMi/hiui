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
- 页面级组件策略：`../docs/generation/page-level-components.md`
- 页面组件认证：`../docs/generation/component-certification.md`
- HiUI 5 视觉 token 与字号角色硬门槛：`../docs/generation/hiui5-visual-baseline.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 非典型 / overlay 布局事实：`../docs/generation/non-typical-pages.md`
- 页面质量验收证据与页面完成门槛：`validation-checklist.md`
- 最终回复前统计收口：`PRIVACY.md`

## 读取顺序

1. 确认 project mode lock / bootstrap summary；仅当项目 mode 事实缺失、过期或互相冲突时才读 `mode-selection.md`
2. `page-type-map.md`
3. `contract-regions.md`
4. 本文件
5. `../docs/generation/hiui5-visual-baseline.md`
6. 命中页型后再读 `../docs/generation/figma-page-rules.md`
7. 需要细页型时再读 `../docs/generation/figma-pages/*.md`
8. 需要结构 / 视觉误区复核时再读 `../docs/generation/layout-anti-patterns.md`
9. 只有显式要求多语言 / i18n / 英文 / RTL / locale 验收，或任务是正式国际化验收时，才读 `../docs/generation/i18n-baseline.md`

## 阶段门槛

### 0. Intent Topology Gate

页面意图解析必须先于 `pageType` / `non-typical` 判断。一次用户提示词可以包含一个页面意图，也可以包含多个页面意图；不得把“一个提示词”默认压成“一个页面”。

机器计划中的 `topology` 是实现入口的第一层路由：

- `single-typical-page`：单个典型页，按 `pageType` 走当前页型快速路径或常规路径
- `multi-page-workflow`：多个并列页面意图，按 `pageUnits` 逐页生成；不得把多个意图揉成一个自由组合页面
- `single-page-composite`：一个页面内存在同屏、多栏、主从、左右或 split 联动，先补组合页 / split contract
- `non-typical-overlay`：存在明确非典型、自定义工作台、自由编排或典型 archetype 无法承接的正向证据，才进入非典型路径
- `unresolved`：页型尚未解析；只能要求补齐页型或输出候选页型，不能直接判成非典型

并列页面意图默认是多页面工作流。例如“查询页、详情页、编辑页”“统计页和评审页”“配置页和日志页”这类表达，默认按多个典型页拆分。只有用户明确要求“一个页面内 / 同屏 / 左右联动 / split / 主从联动”等布局关系时，才进入组合页判断。

### 0.1 Page-Type Execution Gate

链路强度由页面类型和改动边界决定；提示词只用于升级正式验收或在结构允许时缩小无关检查范围。

- `fast-slot`：新建槽位型典型页且只替换业务槽位。适用 `table-basic`、`table-stat`、`tree-table`、`tree-split`、`drawer-form`、`drawer-detail`、`full-page-edit`、`full-page-detail`、`feedback-status`。执行模板 / 宿主 archetype 起步、业务槽位替换、当前页 `preflight` 和浏览器确认。
- `standard-typical`：已有典型页局部改动，或新建 `data-visualization`。执行 `plan-page-task`、`start-page`、当前页 `preflight`、最小可靠 build / lint / typecheck 和浏览器确认。`data-visualization` 必须补图表结构与 ownership 判断。
- `strict-structure`：非典型页面、组合页、split / 主从 / 多区块工作台、页壳 / ownership / 滚动结构变化、复杂图表联动、真实权限 / 状态流 / 批量副作用。执行结构 gate、contract、必要 smoke 和更严格验收。
- `formal-acceptance`：发布 / 提测 / 合入 / 全量 gate / 无 warning / `source-gate` / `doctor` / `finalize-page` 是验收叠加层，不是快慢主判据；命中时在当前链路上追加正式验收命令。

执行强度还要区分两件事：

- `implementation` 升级：只有 `pageType`、`shell`、`ownership`、`split`、主工作区滚动链等结构事实变化时，才从轻量生成升级到 `strict-structure`。普通典型页旧系统升级若仍命中同一 `pageType` 且已存在 certified page component，不应因为“来自 legacy 页面”就自动升级成重结构改造。
- `governance` 升级：迁移 / 重架构页、legacy 高风险 drift、正式验收 / 发布可以要求更重的 snapshot、acceptance contract、translation-map、source-gate、doctor 或 finalize-page，但这不等于一定要重写页面结构。

### 0.2 Typical Fast Path Gate

当 `mode` 为 `host-integration`、`rules-only`、`legacy-host-compatible`，或项目内把兼容接入称为 `host-compatible`，且用户需求清晰命中一个或多个槽位型典型页型、没有特殊布局 / 非典型 section / 跨页型组合 / 复杂新增图表 / 正式 i18n 验收要求时，默认走典型页快速路径。`data-visualization` 不进入普通快速路径；它是 `managed-analytics` 受管分析页。

快速路径的动作是先按机器计划使用主生成资产；只有 `generationStrategy=managed-fallback` 或计划明确要求 fallback 时，才按 `startFrom` 兼容字段绑定 template / reference / scaffold / host archetype 等起点。`translation-map` 不属于这些生成起点，而是 legacy / high-risk 分支在 bridge、source 与 translation drift 上的治理增强工件：

- `page-component`：优先使用 certified page component，只替换业务槽位或 Level 1 受控扩展；不得重新认证组件或绕过组件锁定区。
- `managed-analytics`：先建立 `chartUsageContract`，再生成图表配置和分析布局；不得复制示例图表网格凑数。
- `managed-fallback`：按 `fallbackGenerationAsset` / `startFrom` 绑定 template / reference / scaffold / host archetype，再替换业务槽位。
- `host-integration`：若进入 fallback，优先复制已同步的 `src/typical-page-reuse/pages/*` 或 host-integration reference 作为起点，再把目标页生成到真实业务目录、替换业务槽位并注册到真实业务路由；不要把业务页塞回示例 gallery。
- `rules-only`：若进入 fallback，reference-only 示例是隐藏结构基线，不是展示页面或灵感参考；先绑定 template / reference / scaffold / host archetype，再确认宿主运行链、route owner、shell carrier、region / ownership mapping。
- `legacy-host-compatible` / `host-compatible`：按“接入层 bridge facts -> 生成层 component-first -> 治理层更强 source / adapter proof”理解。普通典型页优先 standard certified page component + available `legacy-runtime-adapter` proof；数据可视化走 `managed-analytics`；只有组件不可用、结构升级或宿主约束特殊时，才复制当前仓库同页型宿主 archetype、兼容示例 / reference、rules-only 标准模板或受管 scaffold 起点。即使走 component-first，也不表示 source-gate、adapter proof 或 formal governance 自动降到 `rules-only` 强度。
- 只替换标题、路由、查询字段、指标、表格列、表单 / 详情字段、接口 / mock 数据和行操作。
- 保留页壳、region 层级、白底主体、滚动 owner、分页 / footer 挂载语义、row action link 语义、source marker 和 contract 字段。
- 业务槽位里的自定义 JSX 与页面本地样式仍必须遵守 `hiui5-visual-baseline.md`：直接写出的 `font-size` 只能使用已登记字阶，尤其不得新增 `13px`；`24px` 只作为指标主值 token 使用。

当普通典型页命中 fast path 时，执行动作默认进一步细分为：

- `slot-fill-only`：当前页已经是受管实例，且本次需求没有修改 `pageType`、`shell`、`ownership`、`mandatory components` 或 runtime shell carrier；此时只允许替换业务槽位。
- `rewrite-by-page-component`：当前页仍属于同一典型页型、project-certified carrier 或 certified page component 已可用，但现有源码还不是 ready 的 managed instance；此时应直接以 page component / carrier 重建业务页实例，而不是在旧 JSX 上继续修补壳层、region 或 ownership。

`rewrite-by-page-component` 仍属于典型页主链，不是 `strict-structure`。它表达的是“用受管主资产重建业务页实例”，而不是“重做页面身份或自由改写页面结构”。

当 `generationStrategy=run-fast-path-per-page-unit` 时，按 `pageUnits` 逐页执行同一规则，并使用每个 `pageUnits[].startFrom` 决定起点；若任一 `pageUnit` 是 `data-visualization`，该单元走 `standard-typical` 而不是普通快速路径；不要因为一次需求包含多个典型页，就补读非典型文档或手写一个组合壳。

快速路径不是“降低结构要求”。它只减少实现前的冗长判断与全量文档读取：页面仍必须能回答当前模板来源、业务槽位替换范围、关键 ownership、当前页预览结果和当前页 preflight / lint / build 结果。全量 `finalize-page`、source gate、doctor、runtime smoke 保留为正式验收 / 发布链路，默认不被无关历史页面问题阻塞快速生成。

### 受管生成原则

所有模式都按“生成前约束 + 生成中模具 + 生成后兜底检查”执行。`page-task-plan.v1` 应给出最小 `generationProfile`：`strategy`、`moldId` / `startFrom`、`lockedRegions`、`editableSlots`、`slotManifest`、`requiredGates` 与 `fallback`。`moldId`、锁定区域、可编辑槽位和槽位说明优先来自 `rules/page-mold-registry.json`；在 registry 缺项时，`startFrom`、page type 专章、shell / adapter 证明和 contract 字段共同组成等价生成约束。

当 `page-task-plan.v1` 选择 `generationStrategy=page-component` 时，页面组件只是 `managed mold` 的可运行实现层：

- `pageComponent` 必须引用 `baseMoldId`，结构事实仍以 `rules/page-mold-registry.json` 为准。
- certified component 可复用资产级结构证明，但业务页仍必须运行 instance validation。
- planned / candidate / expired / blocked component 不得作为业务页起点。
- 组件轻量链路只允许标准业务槽位和 Level 1 受控扩展；Level 2 结构扩展必须升级增强链路，Level 3 非典型 / 组合页必须进入非典型路径。
- 受控扩展不得提供 `children`、`customContent`、`renderAnything`、`extraLayout` 等自由布局入口。

- `rules-only` / `host-integration`：通常从登记模板、reference 或标准 shell 起步；默认只做业务槽位替换和轻量 `slot-gate` + `preflight`。若改动越过槽位边界、修改锁定区域或出现来源异常，升级到 source gate。
- `legacy-host-compatible`：普通典型页默认先消耗 standard certified page component + `runtimeAdapterProof`；只有 fallback / drift 风险显式触发时，才进入宿主 archetype、`reference-or-scaffold` 或 adapter scaffold 等 fallback 起点，并按需追加 `translation-map` 这类治理增强工件；此时仍必须具备更强 source / adapter 证明，防止 adapter 演变成自由手写页面。
- 非典型 / overlay / 页型迁移：必须声明受管基础模具、增量范围与能力缺口；没有受管生成方式时 fail closed。非典型升级保留的是 `base archetype`、`layout strategy`、一级信息架构与 ownership contract，不是保留旧系统 DOM、旧样式类名或未受管布局实现后只换 token。

禁止把 `preflight` 或截图当成主生产方式。生成阶段不得先创建空白 `div` 页面，再用注释、`data-hiui5-*` marker、隐藏标准壳或 contract 字段补成“看似合规”的页面。关键结构只能来自受管模具、真实宿主 archetype、认证 shell carrier 或认证 adapter；AI 只填标题、字段、列、按钮、接口、mock 数据和明确的交互槽位。

`slot-gate` 是快速链路的轻量门禁，只验证页面已绑定 contract 且没有触碰锁定 shell / provenance 边界；它不替代 `source-gate`。`legacy-host-compatible` 新建页、页型迁移、非典型页、结构修复、ownership / shell carrier / adapter 变更仍必须执行 source / adapter 证明。

`data-visualization` 新建页不是普通“复制示例模块布局”的任务：默认只继承数据可视化页壳、图表主题和规范；必须先判断业务分析目标、指标区 / 图表区 / 明细区、图表类型与数量、是否需要 `chart-section`、以及 `content-slot` / `white-body` / `main-scroll` ownership。只有修改已有数据可视化页的标题、文案、mock 数据或已有图表配置时，才允许轻量标准处理。

### 1. Kickoff Gate

- 任何 `hiui-design` 页面生成、重写或大改任务，首次回复都必须先按 `ai-kickoff-template.md` 输出固定起手块。
- 命中 `Typical Fast Path Gate` 时，起手块可以压缩为机器计划摘要、模板 / 示例路径、业务槽位替换清单、i18nMode、当前页验证计划；不要展开长篇手工页型推理。命中 `data-visualization` 时必须额外输出分析目标、图表结构、`chart-section` 判断和 ownership 计划。
- 起手块没有写、顺序被打乱、或关键字段仍是猜测时，都按“尚未进入实现阶段”处理。
- 页面生成阶段默认读取并确认项目既有 `mode` 事实；只有当项目事实缺失、过期或互相冲突时，才重新判定。
- `doctor`、source gate、静态截图、相似示例页或“页面能跑起来”都不能替代 kickoff。

### 2. Routing Gate

- `page type` 统一由 `page-type-map.md` 路由。
- 命中典型页型后，必须继续读取对应页型专章；不要停在页型表本身。
- `pageType` 缺失只表示页型尚未解析；不得把缺失页型直接等价为非典型页面。
- 未命中典型页型，且存在明确非典型 / overlay 正向证据，或典型页型只是在内部一级分组上需要额外布局判断时，才转到 `non-typical-pages.md`。
- `data-visualization` 等 overlay 场景允许补 `layout strategy`，但不改变原 `page type` 身份，也不豁免原页型的 mandatory components、page shell、contract 与技术栈要求。
- 非典型页面允许自由拼装一级分组，但这种自由只发生在 HiUI-first、spec-constrained 的边界内；不要把非典型理解成可以自由替换组件层级、visual token、ownership 或 runtime shell。
- 任何典型页、快路径增量和非典型 overlay 的页面源码 / 页面本地样式，都不得绕过 `hiui5-visual-baseline.md` 的字号、颜色、圆角、边框、阴影基线；发现未登记 token 时先回到角色矩阵，而不是用局部 CSS 修补。

### 2.1 Route Ownership Gate

- `src/typical-page-reuse/routes/config.tsx` 只属于 host-integration 的 smoke / reference gallery；它不是业务菜单注册表，也不是新页面默认落点。
- `src/typical-page-reuse/pages/*` 只属于 host-integration 的示例 gallery 页面源码；它可以作为复制参考，但不能作为 `--page` 目标参与 `start-page`、`preflight`、`write-contract` 或业务页 marker 修复。
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

### 3.2 Rules-only Reference-driven Gate

`rules-only` 的 reference-only 示例只承担隐藏结构基线职责：定义页型、区域层级、壳层语义、关键节奏和 mandatory components；它不能拥有业务路由、业务菜单或正式交付路径。

进入 `rules-only` 快速生成时，固定按下面顺序收敛事实：

1. `Plan Gateway`
2. `Mode Lock`
3. `Topology / PageType Gate`
4. `FastPath Gate`
5. `StartFrom Gate`
6. `Structural Baseline Binding`
7. `Host Runtime Binding`
8. `Contract Mapping`
9. `Business Page Derivation`
10. `Slot Replacement`
11. `Demo-only Stripping`
12. `Business Route Integration`
13. `Page Verification`
14. `Formal Acceptance, if required`

其中 `Structural Baseline Binding` 至少锁定唯一 `example path` 与当前 `startFrom` 对应的 template / reference / scaffold / host archetype；`Host Runtime Binding` 至少锁定 `host archetype path`、`host adapter family`、`shell inheritance strategy`、`shell carrier path`、`route owner`、`menu group` 与权限 / 布局 owner；`Contract Mapping` 至少锁定 `region mapping`、`ownership mapping` 与 `semantic contract`。

命中下面任一情况，必须 fail closed，不能继续按快速路径生成：

- 没有 Plan Gateway 结果，或 `blockingReasons` 非空
- `topology=unresolved|single-page-composite|non-typical-overlay`
- `pageType` 未命中标准槽位型典型页，或 `fastPath.eligible` 不是 `true`
- `startFrom=unresolved`
- 找不到唯一 `example path`
- 找不到可承接的 template / reference / scaffold / host archetype
- `host archetype` 与 reference 的核心 region 无法对齐
- `route owner`、`shell carrier path` 或 `ownership mapping` 写不清
- 需要修改页壳、滚动、ownership、region 或 mandatory components
- 业务页目标路径落入 `.local-context/hiui-design/reference/**`、`src/typical-page-reuse/**` 或 `examples/host-integration/**`
- reference / gallery 的 demo-only 内容无法剥离

从 reference 派生业务页时必须剥离 `PromptCopyFloatingButton`、`examplePrompt`、`typicalExamplePrompts`、示例 gallery 页头动作、示例路由配置、示例菜单分组、`ExampleAppShell` 与不属于业务运行链的 host provider。

### 3.1 Legacy Page-Component Fast Path

`legacy-host-compatible` / `host-compatible` 的普通典型页生成默认采用 page-component fast path：在旧宿主边界已证明时，直接使用 standard certified page component 作为完整右侧内容区主资产，只替换业务槽位。它不是标准壳直接接入，也不是旧宿主 primitives 近似实现；translated-reference 只在 fallback / drift-risk 分支中显式展开。

为了避免普通槽位页被重流程拖慢，legacy 生成采用三层门禁：

1. **快速路径必备门禁**：所有 legacy 典型页都必须具备 Plan Gateway、mode lock、pageType / fastPath、available `pageComponent` 或合法 fallback 起点、`runtimeAdapterProof`、route owner、ownership、禁止标准壳 import、禁止 reference / examples / `typical-page-reuse` 交付路径，以及当前页 preflight。新增 legacy 受管页还必须能通过 source / adapter 证明，至少拦截假骨架、隐藏壳、marker-only 证明、contract 自证和裸 primitive 承担关键 region。
2. **漂移风险触发门禁**：缺少合格 host archetype、首次为该宿主适配页型、host archetype 与 reference region 不完全一致、需要新增 / 修改 adapter、`startFrom=reference-or-scaffold|scaffold`、涉及 `table-stat` / `tree-split` / drawer / full-page、修改 ownership / shell carrier、出现 preflight / source marker warning、需要声明 `driftExceptions` 时，必须展开 Translation Drift Guard。
3. **正式验收增强门禁**：发布、提测、合入、无 warning、用户要求 `source-gate` / `doctor` / `runtime-smoke`，或页面涉及 adapter / ownership / shell carrier 实质修改时，必须基于最新源码补齐 `finalize-page`、source gate、doctor、runtime smoke 与完整 contract。

legacy 典型页旧系统升级默认还要区分：

- `rewrite-by-page-component`：当前业务页仍命中同一 `pageType`，planner 已选中 certified page component / project carrier，但源码还未成为 ready managed instance；这类任务应优先重建业务页实例，不继续修补旧壳层。
- `structural-upgrade`：只有 `pageType`、`shell`、`ownership`、`split`、主工作区结构、独立滚动链或 mandatory components 发生变化时，才升级为重结构改造。

不要把 migration / formal acceptance 自动等价成 `structural-upgrade`。这些场景首先升级的是治理强度，而不是页面结构改造强度。

legacy 的最小 runtime adapter / host boundary proof 必须能命名：

- `adapterId`、`status`、`kind=legacy-runtime-adapter` 与 `responsibility=runtime-bridge-only`
- `CleanContentMount` / `RuntimeBridge` / `StyleBoundary` / `PortalBoundary` 的 evidence 状态
- 唯一 `examplePath`
- `hostArchetypePath`，或明确的 adapter scaffold plan（仅 fallback / drift guard 时必填）
- `hostAdapter`
- `shellCarrierPath`
- `routeOwner`
- `ownershipMode`
- `content-slot / white-body / outer-padding / main-scroll` 的唯一 owner

Translation Drift Guard 只包含三件事：

- `Semantic Lock`：锁定 `pageType`、canonical `examplePath`、required regions、mandatory components、region hierarchy、ownership facts、interaction anchors、可替换业务槽位与不可替换 shell facts。
- `Translation Map`：逐项声明 `example region -> host carrier -> adapter strategy -> verification evidence`；required region 找不到 host carrier 时，不能用临时 `div` 或 primitives 补位，必须先补 adapter 或退出快速路径。
- `Isomorphism Check`：快速路径至少做 static check，验证 source marker、required region marker、`examplePath`、`hostAdapter`、`hostArchetypePath` 或 adapter scaffold、`shellCarrierPath`、`ownershipMode`、禁止 import、禁止交付路径和 demo-only 剥离；正式验收或高风险页再做 runtime / visual check，验证单一白底、单一滚动、pagination / footer 挂载、drawer body / footer 分离、full-page footer、query submit / reset、row action link 等关键交互没有漂移。

`driftExceptions` 只能记录等价转译，不能豁免 mandatory components、required regions、ownership、关键交互锚点、route owner 或 source marker。例如允许“`QueryFilter` 由 `LegacyQueryFilterAdapter` 承接且保留 submit / reset / collapse 语义”；不允许“宿主没有 `QueryFilter`，所以改成普通 `SearchForm`”。

一旦 planner 已锁定 `generationStrategy=page-component`、`startFrom=page-component`，且 legacy `runtimeAdapterProof.status=available` / `generationProfile.runtimeBridgeStatus=available`，当前任务的默认交付物就必须是 `artifactRole=business-managed-page` 的受管页面实例。此时不允许把业务页默认实现偷偷降级成 compatibility 手写页、translated reference、自由 scaffold、reference 默认翻译页，或“先拼一个差不多的白底页再说”。

legacy 快速路径命中下面任一情况必须 fail closed：

- `Semantic Lock`、`Translation Map` 或 `Isomorphism Check` 无法建立
- required region 无法一一映射
- mandatory component 被低阶 primitive 替代
- `white-body / outer-padding / main-scroll` owner 不唯一
- pagination / footer / drawer body / full-page footer 挂载位置漂移
- `QueryFilter`、`FilterDrawer`、`Table setting / resize` 等页型要求无法承接
- `Descriptions` first-level children 被业务 wrapper 破坏
- `routeOwner`、`hostAdapter` 或 `shellCarrierPath` 无法命名
- 标准壳 import、demo-only 内容、reference / gallery route 或错误交付路径残留

### 4. Start / Preflight Gate

- 页面任务进入本节前必须已经通过 Plan Gateway：目标项目根执行 `typical-page:plan-page-task -- --json`，或旧项目执行 `node ".local-context/hiui-design/scripts/plan-page-task.mjs" --json`。没有机器计划时，`start-page`、模板复制、手写 JSX、lint / build 都不能被视为流程开始。
- Plan Gateway 返回的 `mode` / `projectMode`、`topology`、`pageType`、`generationStrategy` / `generationStrategyId`、`primaryGenerationAsset`、`fallbackGenerationAsset`、`customizationLevel`、`analyticsContractRequired`、`startFrom` 兼容字段、`fastPath`、`requiredDocs`、`requiredCommands` 是本次页面任务的执行边界；后续 doctor、host-profile 或人工判断只能补充诊断，不能覆写这些事实，除非重新执行 Plan Gateway。
- 若计划包含 `blockingReasons`，先补齐事实或修复脚本入口；不得用“先生成一个页面再调整”的方式绕过阻断。
- `host-integration`、`rules-only` / `legacy-host-compatible` 页面，在进入真实实现前必须先锁定主生成资产；普通典型页优先 certified page component，数据可视化优先 `managed-analytics`，只有组件不可用、结构升级或特殊宿主约束时才使用 `startFrom` / template / archetype / scaffold fallback。
- 当计划已经锁定 `page-component` 为主生成资产时，后续生成、contract、preflight 与最终回复都必须沿同一主链保持 `business-managed-page` 交付语义；不得把“legacy 主树不能 direct import standard shell runtime”重新解释成“可以默认交付兼容手拼页”。若确实需要 fallback，只能先重新执行 Plan Gateway，让计划显式把 `generationStrategy` 切到 `managed-fallback` 或其它合法 fallback。
- 对声明 `requiredStartFromExample=true` 的典型页，只有 `generationStrategy=managed-fallback` 或计划明确要求 fallback 时，`typical-page:start-page` 才按机器计划里的 `startFrom` 起步：`template` 直接复制 `page.template.tsx|jsx`，`host-archetype` 复制宿主 archetype，`reference-or-scaffold` 使用受管 reference / scaffold 承接同一页壳契约。只有这些受管起点都缺失时才失败；不得回退到自由壳层 scaffold。
- 当计划选择 `generationStrategy=page-component` 时，进入实现前只执行 `ComponentAvailabilityGate`：确认 component 已 certified / available、`baseMoldId` 与当前 `pageType` 匹配、当前任务只写入标准槽位或 Level 1 受控扩展；组件缺失、未认证、认证过期或扩展越界时，不得把组件当起点，也不得在业务生成阶段临时重认证组件。
- 当计划选择 `generationStrategy=managed-analytics` 或 `analyticsContractRequired=true` 时，必须先建立 `chartUsageContract`，再进入图表 JSX 与配置实现；不得把数据可视化退化为普通统计表、自由图表墙、手写 primitives 或图表库默认主题。
- 当前页在进入视觉细节与业务字段实现前，至少执行一次 `typical-page:preflight`。
- 当 `fastPath.eligible=true` 时，当前链路默认截止于当前页 `preflight`、预览和 lint / build 解释；`source-gate`、`doctor`、`runtime-smoke`、`finalize-page` 只有在 Plan Gateway 显式列入命令、用户要求正式验收 / 发布 / 提测、或实现改动越过业务槽位边界时才追加。
- 对组合页、split 页面、非典型页面，若增量事实尚未写清，不得靠边写代码边补 contract。
- 对非典型 / overlay 页面，进入实现前必须先写清 `base archetype`、`non-typical scope`、`mandatory components`、`header inheritance`、`ownership contract` 与 `shared baseline`；缺任一项时按“尚未进入实现阶段”处理。
- 对非典型 / overlay 页面，若所需组件超出 `../docs/hiui-v5-quick-reference.md` 覆盖范围，进入实现前还必须补读 `../docs/generation/non-typical-component-routing.md` 与 `../docs/generation/hiui-v5-component-map.md`，并写清 `primary semantic components`、`rejected alternatives`、`why not custom container` 与 `import path discipline`。
- 对 `layout archetype = context-main-split`，进入实现前还必须先写清 `split shell inheritance strategy` 与 `split shell carrier path`；若项目已有受管 split carrier，必须从该 carrier 或宿主翻译层起步，不得从 `ProDetailPage`、`ProEditPage` 或自拼 `workspace / leftPane / rightPane` 起步。

页面组件实例在 `preflight` 前还必须确认：

- 使用的 `componentId` 与 `pageType` / `baseMoldId` 匹配；
- required slots 完整；
- extension slots 在 `rules/page-component-registry.json` 允许范围内；
- 未新增 white-body、main-scroll、pagination owner；
- 原型 / 旧系统升级场景的 `businessMappingStatus` 不为 blocked。

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

- 当前页页壳、contract、ownership、marker、mandatory components 或运行时链路发生变化后，不得继续沿用旧 `finalize-page` 结果。
- `rules-only` / `legacy-host-compatible` 的当前页，若本次任务目标是正式验收、发布、回归修复或修改了页壳 / ownership / marker / mandatory components，必须基于**最新源码**重新执行一次 `typical-page:finalize-page`。
- 普通典型页快速生成的默认完成口径是“当前页可预览 + 当前页 preflight / lint / build 可解释”；全量 `finalize-page` / source gate / doctor 作为正式验收链路保留，不应被无关历史页面问题阻断当前页生成。
- `doctor PASS` 只能证明当前实现未越过静态硬门槛，不能替代最新一次 `finalize-page`。
- 对当前已支持的强制浏览器级场景，例如 `data-visualization + page-scroll`，或声明了左右栏独立滚动的 split master-detail，必须补 `runtime smoke`，并将结果绑定到当前 `sourceSnapshotHash`。

## 默认原则

### 原则 1：硬门槛默认开启

- 除文档明确给出豁免口外，视觉、框架、交互、国际化、图表与表格规则一律按硬门槛执行。
- 命中场景时，缺任一项都按未通过处理，不再视为“后续可补的优化项”。

### 原则 2：显式事实优先

- 对当前页，`page type`、`example path`、`host archetype path`、`mandatory components`、`i18nMode`、`scroll strategy` 等事实必须能在源码、contract 或受管产物中落到明确证据。
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
- `Timeline` 一旦命中，默认沿用 HiUI 官网 timeline 的信息流样式；除非设计稿或上游组件文档有明确书面依据，不得切换成自造卡片流、左右对拍或其它变体排版。
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
- `Timeline` 的官网信息流基线属于默认视觉 contract；未在 design deviation、上游组件文档或任务说明中获批前，不得通过局部容器、额外装饰节点或布局重组把它改写成另一种时间轴风格。
- 对 detail-shell 中的 `Descriptions`，允许且要求通过组件 props 显式声明布局不变量；不允许再用页面级 `.hi-v5-*` / `th` / `label` CSS 补救上游默认值漂移。

### 原则 6：国际化按任务模式纳入边界

- 每个页面任务先声明 `i18nMode`：默认 `none`；只有用户明确提出多语言 / i18n / locale / 翻译 / 英文 / RTL，或已有强制 i18n contract 时才进入 `full`。
- `none`：普通内部页面、快速原型或用户未要求国际化时可直接使用中文业务文案；日期、数字等展示仍优先用项目已有 formatter，不为 i18n 额外补全 7 语言资源。
- `key-only`：仅作为旧合同 / 已有页面局部维护的兼容状态；不得因为项目安装了 i18n 依赖就在新页面生成时自动进入该流程。
- `full`：用户明确要求多语言 / i18n / 英文 / RTL / locale 验收，或任务是正式国际化验收时启用；页面标题、按钮文案、列标题、字段 label、placeholder、反馈文案、图表标题来自 locale 资源或上游 i18n bridge，日期、时间、数字、金额、百分比、排序与大小写处理走 locale-aware formatter / API，并覆盖 RTL 与文本膨胀容错。
- 典型页快速路径默认使用 `none`；不要把 full i18n 当成普通典型页生成的默认阻断项。
- i18n 资源方向是单向的：`templates/i18n/**` 只能作为目标项目 `src/translation/**` 的通用 seed；当前业务页新增的标题、筛选项、表格列、mock 数据、队伍 / 商品 / 活动等业务词条只能进入目标项目，禁止反向同步到 skill 模板。维护者同步 / 发布前必须运行 `scripts/check-i18n-template-boundary.mjs`，防止业务词库污染全局 skill。

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
