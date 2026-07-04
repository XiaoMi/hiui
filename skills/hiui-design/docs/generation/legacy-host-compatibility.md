# 旧宿主桥接接入模式

## 适用场景

当目标项目命中下面任一特征时，不默认把标准 `@hiui-design/typical-page-shells` 视为 legacy 宿主主树里可直接落地的运行时依赖前提，而进入 `legacy-host-compatible` 的桥接接入判断。它不是独立生成体系，而是对既有 `page-component` / `managed-analytics` 主链路附加旧宿主边界约束。

这里要区分两层：

- `page-component` 仍可以作为普通典型页的主生成资产接入。
- `@hiui-design/typical-page-shells` 是否可直接进入目标项目，要看宿主是否已经证明可直接承载该运行时契约；在 legacy 主树中默认不预设它可直接落地，但也不把它表述成逻辑上绝对不可接入。

- `react` / `react-dom` 主运行时 `< 18`
- `ahooks` 主运行时 `< 3`
- 宿主仍保留旧版 `@hi-ui/hiui`，只通过 `hiui5` 之类 alias 局部引入 HiUI 5
- Module Federation remote 在构建层把 `react` / `react-dom` 作为旧版本 singleton 全局共享

典型例子：

- 老业务 remote
- 旧运营后台
- 被宿主强绑定为 React 16/17 的联邦模块

## 名称说明

`legacy-host-compatible` 的人类解释统一为“旧宿主桥接接入模式”，下文简称“桥接模式”。

`compatible` 指宿主边界与运行时契约可以被桥接和证明，不表示任意旧宿主天然兼容，也不表示只要能挂载就已经满足受管接入或交付要求。

## 这个模式的目标

目标不是“把标准典型页壳强行跑起来”，也不是每次从旧系统截图 / URL 重新翻译主体骨架，而是：

- 继续沿用 `hiui design` 的页型判断
- 继续沿用 `hiui design` 的信息架构、视觉节奏、标题层级、滚动链和白底主体关系
- 实现层优先通过 project-certified carrier page component 与目标项目运行时桥接；目标项目只提供 runtime adapter proof，不逐 region 翻译典型页组件
- 普通典型页优先使用 project-certified carrier page component；若项目尚未提供 carrier，再评估 direct standard component 是否已证明 runtime equivalence
- 数据可视化优先走 `managed-analytics`，旧系统只提供业务指标、接口、权限和宿主限制事实

也就是说：

- **设计语言继续对齐 `hiui design`**
- **实现语法不再强依赖 `@hiui-design/typical-page-shells`**
- **legacy 主路径统一为 `project-certified carrier first -> page-component semantics -> explicit fallback`**

额外强调：

- 桥接模式只改变运行时与接入方式
- 桥接模式**不允许**降低页型专章里的 mandatory components、required regions 与 ownership 要求
- 桥接模式下旧系统材料只作为 business facts / host constraints，不再默认作为主体结构生成来源
- 如果示例页要求真实 `QueryFilter`、真实 `FilterDrawer`、真实指标卡区、真实 `Descriptions` 主表达或固定页壳语义，这些要求在桥接模式里依然成立
- 桥接模式也**不允许**把示例默认视觉语义偷换成宿主随手拼的近似壳层：真实 `PageHeader` back-button、默认灰底 `SearchInput`、`FilterButton` 语义、主白底延伸到底部、分页吸底和蓝色 link 行操作都必须继续成立，除非需求文字明确要求偏离
- 桥接模式下尤其要警惕“宿主 alias 组件会解析第一层 children”这一类运行时细节。像 `Descriptions` 这类组件，如果宿主实现会直接遍历第一层 children 并读取其 `props`，就不能再包一层自定义 React 组件后把它作为第一层节点传入；应直接内联 `Descriptions.Item`，或改走 `data/items` 配置模式

若当前项目已经额外准备了隔离标准壳子应用，则该结论只适用于 legacy 宿主主树本身；独立子应用中的新页面，改为读取 `isolated-standard-shell.md`。

## 页面组件直挂模型

`legacy-host-compatible` 下的页面级组件不是“只提供页面中间一小块”，而是**完整右侧内容区组件**。旧系统继续负责全局导航、左侧菜单、业务路由入口和稳定内容挂载点；页面组件自己负责页头、筛选区、主白底主体、表格 / 表单 / 详情主体、分页 / 底栏和页面主滚动链。

因此 legacy 不需要维护一套平行的“legacy 页面组件系统”。推荐做法是：项目把自己的 carrier 通过 project-scoped overlay 认证成 page component，planner 优先选择这个 project-certified carrier；只有在项目未提供 overlay，且宿主已经证明可直接等价承载 standard component 的 runtime contract 时，才直接选择 standard component。旧宿主额外需要证明的是 `legacy-runtime-adapter` 可用，而不是把 `QueryFilter`、表格、分页或页壳翻译成旧组件。

因此适配目标只在外层边界，不在页面内部 region 逐项改写：

- `CleanContentMount`：宿主提供干净、稳定、可控高度的内容挂载点，不再重复提供页头、白底主体、分页 owner 或业务滚动容器。
- `RuntimeAdapter`：把旧宿主的内容槽、路由、权限、请求、字典和主题能力绑定成页面组件需要的运行时输入。
- `RuntimeBridge`：统一注入 request、auth、permission、user、dictionary、route-navigation、theme 等运行时能力，禁止页面组件直接读项目全局变量或硬编码菜单路径。
- `StyleBoundary`：用 scoped reset / safe prefix 保护页面组件的 typography、table、pagination、form、drawer、modal、tag-status 和 layout spacing，避免旧宿主全局样式污染。
- `PortalBoundary`：在宿主显式改写 popup container、或存在 overflow / z-index 裁切风险时，统一 select dropdown、tooltip、popover、modal、drawer 的挂载根和层级；未声明特殊约束时允许沿用组件库默认挂载能力。
- `AdapterRegistry`：用 `rules/adapter-registry.json` 记录 `legacy-runtime-adapter` 的职责边界、允许的运行时绑定能力与禁止的组件翻译职责。
- `RuntimeAdapterProof`：只有 adapter proof 为 `available`、`kind=legacy-runtime-adapter`、`responsibility=runtime-bridge-only`，`plan-page-task` 才能在 legacy 模式下把 standard 页面组件作为主生成资产。

这套模型的设计目标是：同一类旧宿主只做一次运行时边界适配和证明，后续普通典型页按 standard page component 填业务槽位生成；不是每个项目、每个页面都重新把 `PageHeader + QueryFilter + Table` 分层转译一遍。

推荐的 project-scoped overlay 落点是目标项目的 `.local-context/hiui-design/outputs/project-page-component-registry.json`。这类 overlay 属于项目事实，不属于 skill 全局通用资产。新的 legacy rollout 不应继续依赖 `legacy-table-basic-page.v1` 这类跨项目 generic placeholder 作为目标状态。

`CleanContentMount` 应优先在项目接入 / capabilities 阶段由项目结构自动识别，而不是要求 agent 通过改造某个业务页来“证明右侧内容区干净”。当仓库同时具备清晰业务页根目录（如 `src/views` / `src/pages` / `src/routes`）和 Module Federation remote `exposes` 配置时，可以自动推断旧宿主只承载全局导航、左侧菜单、业务路由入口和稳定内容挂载点，右侧内容区由 remote 页面组件独立拥有页头、筛选、白底主体、表格 / 表单 / 详情、分页 / 底栏和主滚动链。该自动推断应进入 `legacyHostFamily.inferredFacts.cleanContentMount` 与 `matchedEvidence=["clean-content-mount","clean-content-mount:project-structure"]`。

自动识别 `CleanContentMount` 不等于自动通过完整 `runtimeAdapterProof`。但 request、response、message、dictionary / i18n、permission、user、route-navigation、theme 等运行时能力也必须在项目接入 / capabilities 阶段被自动扫描并输出结构化结果，而不是拖到某个业务页生成时才临时追问。扫描结果应进入 `legacyHostFamily.inferredFacts.runtimeBridge`，包含 `status=passed|partial|missing`、`passedCapabilities`、`partialCapabilities`、`missingCapabilities` 与每项 `capabilityEvidence.source`。`portal-root` 默认视为浮层运行时的常规能力，不作为 runtime bridge 的硬必需项；只有宿主显式自定义容器或存在裁切风险时，才通过 `PortalBoundary` 补充事实。只要这些接入期事实已经足以证明宿主边界，页面生成阶段就应直接消费该证明；family registry 的 `status` 只反映宿主族规则本身的维护状态，不应再次把业务页 `page-component` 生成链路拦住。

当 runtime bridge 自动扫描为 `partial` 时，页面组件链路保持 blocked，但阻断项必须指向真正的接入期缺口，例如 request / permission / route-navigation 之类能力缺失，而不是把默认浮层挂载能力泛化成“必须先证明 portal-root”。只有扫描完整通过，或 `.local-context/hiui-design/outputs/legacy-host-boundary.json` / 对应脚本事实明确声明 `runtimeBridge.status=passed` 时，`runtime-bridge` 才能进入 `matchedEvidence` 并允许后续 `legacy-runtime-adapter` proof 继续判定。

## Runtime-Bridged Page Component 语义

在 bridge 模式下，用户可读语义允许写作 `runtime-bridged-page-component`，但它在机器语义上仍必须归一为
`page-component`。这意味着：

- 主生成资产仍是被选中的 certified page component 或 project-certified carrier。
- example page、页型专章、截图和旧页面源码只提供语义与结构参考，不替代运行时主资产。
- runtime shell 的真实来源必须从 component certification 的
  `certificationInputs.componentShell` 解析，不得在业务页、wrapper 或 planner 里手写猜测 import。
- bridge wrapper 只能负责宿主 runtime、mount boundary、provider、route-navigation、
  permission、request / response、message、theme 等 runtime 注入。
- slot adapter 只能把业务 schema / handlers 绑定到标准 slots 或 Level 1 受控扩展，不得把
  `QueryFilter`、表格、分页、详情、底栏等 region 翻译成宿主 look-alike primitives。
- 这套 bridge 语义的唯一规则真相是 `rules/runtime-bridged-component-matrix.json`；它补充的是
  “如何桥接交付”，不是“重新定义页型或组件体系”。

## 接入成熟度解释模型（非 public contract）

该模型只用于解释和归纳现有机器字段组合所表达的接入成熟度，不新增 public contract 顶层状态，也不要求一一对应的新机器枚举。

- `mountable`：页面可以稳定挂入宿主内容区，但 runtime bridge / adapter / 治理未必完整；它更适合作为人类解释语义，不绑定单一机器字段。
- `preview-mountable`：在 `mountable` 基础上已经具备预览或局部运行验证条件，可做结构 / 视觉预览，但未必达到受管生成或可交付；同样保留为人类解释语义。
- `managed-ready`：主要由现有 `facts.status`、`assetResolution.status`、`runtimeAdapterProof.status` 等字段组合稳定解释，表示可以进入受管生成主链路。
- `delivery-ready`：在 `managed-ready` 基础上，再叠加 `preflightStatus`、`governanceStatus`、formal acceptance 等交付层状态，表示可以按交付协议对外汇报。

## 使用顺序

桥接模式下，生成页面时先读取项目 mode lock 与 `page-task-plan.v1`，再按 `generationStrategy` 分流。普通典型页优先 `page-component`，且 legacy 内部优先级应为 `project-certified carrier -> direct standard component -> explicit fallback`；数据可视化优先 `managed-analytics`，只有主资产不可用、结构升级或治理风险需要显式兜底时才进入 `managed-fallback`。补读文档时按这个顺序读：

1. `generation-principles.md`
2. `page-type-map.md`
3. 本文件
4. `figma-page-rules.md`
5. 命中的 `figma-pages/*.md`

其中：

- `page-type-map.md` 仍负责判页型
- `figma-pages/*.md` 仍负责理解该页型的结构目标
- `page-level-components.md` 负责普通典型页组件实例化边界
- `runtime-bridged-component-matrix.json` 负责 legacy `page-component` 的 bridge profile、
  runtime shell 来源与薄桥层职责
- `data-visualization.md` 负责 `managed-analytics` 的 chart usage contract、图表 token 与分析布局
- capabilities / `legacy-host-family` 检测负责在项目接入阶段自动识别 clean content mount，并自动扫描 runtime bridge 能力；`adapter-registry.json` 负责声明 runtime bridge、style boundary、portal boundary 与 `legacy-runtime-adapter` proof 的能力边界
- `host archetype` 与 `reference-or-scaffold` 属于合法 fallback 起点；`translation map` 属于治理增强工件；只有 standard component 不可用、宿主约束特殊或 drift 风险需要显式治理时，才进入这些路径
- 但里面提到的 `TablePageFrame` / `ProEditPage` / `ProFormDrawer` 等，桥接模式下要理解为**必须继承的页壳语义**，不要求直接导入同名标准运行时组件
- 这条例外只豁免“直接 package import”，不豁免示例绑定、mandatory components、region 层级、ownership、source marker 或 shell-carrier 证据
- 若不能直接挂标准壳，必须翻译到命名 shared shell / host adapter，并在源码与 contract 中声明 `shell inheritance strategy`、`shell carrier path`、`host adapter`、`example path` 与 `host archetype path`
- 禁止把“结构参考语义”解释成在业务页局部手写 `PageHeader + QueryFilter + Table`、`Drawer + Form`、`Card + Descriptions` 等 primitives 后再补注释伪装成典型页
- 若当前仓库存在项目级 override，例如 `docs/business-lines/after-sales/asp-fwt-common-front.md`，则其优先级高于本文件中的通用“宿主基座优先”建议

## 桥接典型页快速路径

当用户需求清晰命中一个既有普通典型页型，且没有特殊布局、跨页型组合、非典型 section、独立分析图表或正式 i18n 验收要求时，`legacy-host-compatible` / 项目内称为 `host-compatible` 的桥接接入默认直接走快速路径。它不是独立生成体系，而是对既有 `page-component` / `managed-analytics` 主链路附加旧宿主边界约束。若 `plan-page-task` 选择 certified `pageComponent`，优先使用 standard 页面组件实现并只填业务槽位 / Level 1 受控扩展；这只说明生成层仍是 `page-component` first，不表示治理层自动降到 `rules-only`。adapter proof 缺失、过期或职责越界时只能 `blocked`，不得把 standard component 降级为 candidate 后自动手写页面。

数据可视化不属于普通典型页快速路径。即使存在示例页，也必须走 `generationStrategy=managed-analytics`：先提取旧系统中的业务指标、筛选维度、接口和权限事实，再建立 `chartUsageContract`，最后由数据可视化 token 与图表组件规则生成页面实例。

桥接快速路径的起点优先级：

1. project-certified carrier page component + available `legacy-runtime-adapter` proof
2. direct standard certified page component + available `legacy-runtime-adapter` proof
3. `managed-analytics` 的受管分析承载器（仅数据可视化 / 分析页）
4. 当前仓库里同页型、同宿主基座的已跑通页面或 archetype
5. 兼容示例 / reference
6. `templates/archetypes/rules-only/<pageType>/page.template.tsx|jsx` 或 `start-page` 的受管 scaffold / reference 起点，并把标准壳语义翻译到旧宿主可运行组件
7. 只替换业务槽位：标题、查询字段、指标、表格列、表单 / 详情字段、接口 / mock 数据、行操作；简单二次改造只能落到 `topNotice`、`toolbarSupplement` 等受控扩展槽位

这里的“使用 standard 页面组件实现”指 runtime delivery 资产仍是标准页面组件或其 project-certified
carrier，不是拿 example page 直接替换业务槽位，也不是把 example page 当成业务页壳源码复制后再做
host look-alike 改写。example 只保留语义与结构参考职责；真正进入业务页的 bridge 代码必须是 thin wrapper +
slot adapter。

快速路径不重新发明 primitives 页面。复制后的页面必须继续保留：

- 真实页头 / 筛选 / 表格 / 指标 / 分页 / 底栏语义
- 单一 content slot / white-body / outer-padding / main-scroll ownership
- host adapter、host archetype、example / template source marker
- 行操作 link 语义与页面级可预览能力

没有显式国际化要求时，默认 `i18nMode=none`；即使宿主已有 `t()` / `intl.get()` 等能力，也不能仅因依赖存在就进入 i18n 流程。只有用户明确要求多语言 / locale / 翻译 / 英文 / RTL，或旧页面已有强制 i18n contract 时，才升级到对应 i18n 流程。

## 分层转译漂移门禁

legacy 快速路径不是全量重流程，而是按接入层 / 生成层 / 治理层三层收敛：

1. **接入层必备门禁**：所有 legacy 典型页都必须先通过 Plan Gateway、mode lock、project host pack / runtime boundary 认证、`runtimeAdapterProof`、route owner、ownership、禁止标准壳 import、禁止 reference / examples / `typical-page-reuse` 交付路径，并至少执行当前页 preflight。
2. **生成层主链路门禁**：普通典型页默认仍以 certified `pageComponent` 为主资产；只有 component 不可用、结构升级或宿主约束特殊时，才允许进入 host archetype / reference / scaffold fallback。`component-first` 只说明生成起点，不豁免 instance validation，也不把治理要求自动降到 `rules-only`。
3. **治理层增强门禁**：只有命中转译风险、页型迁移或正式验收条件时，才显式展开 Translation Drift Guard，并按需要补齐 finalize / source gate / doctor / runtime smoke。`StyleBoundary`、`PortalBoundary`、`runtimeSmoke` 默认属于这一层的触发式检查，而不是普通表格页的必阻断项。

legacy 的最小 runtime adapter proof 必须能写清：

- `adapterId`、`status`、`kind=legacy-runtime-adapter` 与 `responsibility=runtime-bridge-only`（若计划选择 page component）
- `CleanContentMount` / `RuntimeBridge` / `StyleBoundary` / `PortalBoundary` 的 evidence 状态
- `examplePath`
- `hostArchetypePath`，或明确的 adapter scaffold plan
- `hostAdapter`
- `shellCarrierPath`
- `routeOwner`
- `ownershipMode`
- `content-slot / white-body / outer-padding / main-scroll` 的唯一 owner

写不出这些事实时，不要生成业务页，也不要用“先拼一个能跑的页面”绕过准入。若项目结构已能自动推断 `CleanContentMount`，不得再要求通过改造页面证明内容区独立；若 capabilities 已能自动扫描 runtime bridge，则必须复用扫描结果中的具体缺口，不得在页面阶段重新泛化成“缺运行时证明”。`legacy-host-compatible` 的 mode 名称本身不等于一律禁止标准 `@hiui-design/typical-page-shells`；是否可直接接入，取决于宿主是否已经证明可承载对应 runtime contract。只有 style boundary、portal boundary、route owner 等无法从结构可靠推断或扫描为 partial / missing 的宿主边界事实，才补 `.local-context/hiui-design/outputs/legacy-host-boundary.json` 或对应脚本派生事实。若 `runtimeAdapterProof.status` 不是 `available`，页面组件链路必须 blocked，不能自动退到自由手写或旧组件翻译。

若计划选择 certified page component，页面结构事实可由 component certification 复用，但 runtime adapter proof 仍必须单独通过；当前业务页仍必须通过 page instance validation：required slots、受控扩展、route owner、business mapping 和 runtime render 不得省略。

命中下面任一情况，必须展开 Translation Drift Guard：

- 没有现成且合格的 host archetype
- 首次为该宿主生成当前页型
- host archetype 与 reference 的 required regions 不完全一致
- 需要新增或修改 host adapter
- `startFrom=reference-or-scaffold|scaffold`
- 涉及 `table-stat`、`tree-split`、`drawer-form`、`drawer-detail`、`full-page-edit`、`full-page-detail`
- 修改 ownership、shell carrier、route owner 或 source marker
- 出现 preflight warning / source marker warning
- 需要声明 `driftExceptions`
- 进入正式验收、发布、提测或合入

Translation Drift Guard 只做三件事：

### 1. Semantic Lock

先锁定不能漂移的结构事实：

- `pageType`
- canonical `examplePath`
- required regions
- mandatory components
- region hierarchy
- ownership facts
- interaction anchors
- 可替换业务槽位
- 不可替换 shell facts

例如普通表格至少锁定：`header / query-filter / table / pagination / white-body / main-scroll`，`pagination` 仍属于 table shell，行操作保持 link 语义，查询区保留 submit / reset 语义。

### 2. Translation Map

逐项声明：

```text
example region -> host carrier -> adapter strategy -> verification evidence
```

示例：

```text
header -> HostPageHeader -> direct slot -> data-hiui5-region="header"
query-filter -> LegacyQueryFilterAdapter -> semantic adapter -> submit/reset preserved
table -> HostTableShell -> host archetype slot -> pagination coupled
pagination -> HostTableShell.pagination -> same shell -> not external footer
white-body -> HostContentSurface -> inherited owner -> single white-body
main-scroll -> HostLayoutBody -> inherited owner -> single scroll owner
```

required region 找不到 host carrier 时，不能用临时 `div`、`Card`、`SearchForm` 或 primitives 补位；必须先补 adapter，或退出快速路径。

### 3. Isomorphism Check

同构检查不是要求组件名相同，而是证明转译后仍保持典型页结构语义。

快速路径至少做 static check：

- source marker 存在
- required region marker 存在
- `examplePath`、`hostAdapter`、`hostArchetypePath` 或 adapter scaffold、`shellCarrierPath`、`ownershipMode` 存在
- 禁止 import 不存在
- 页面路径没有落入 reference / examples / `typical-page-reuse`
- demo-only 内容不存在

正式验收或高风险页面再做 runtime / visual check：

- `white-body` 视觉上单一
- `main-scroll` 行为单一
- pagination / footer 挂载位置正确
- drawer body 与 footer 分离
- full-page footer sticky / fixed 正确
- query submit / reset 行为正确
- row action link 语义正确
- 页面没有双 padding / 双白底 / 多滚动容器

如果 Isomorphism Check 不通过，不允许靠补 CSS 掩盖；回到 host qualification、Translation Map，或退出快速路径。

`driftExceptions` 只能解释等价转译，不能豁免 mandatory components、required regions、ownership、关键交互锚点、route owner 或 source marker。允许写“`QueryFilter` 由 `LegacyQueryFilterAdapter` 承接且保留 submit / reset / collapse 语义”；不允许写“宿主没有 `QueryFilter`，所以改成普通 `SearchForm`”。

## 桥接模式硬规则

### 1. 不默认在 legacy 主树直接导入标准典型页壳

桥接模式下，不要把下面这些导入默认当成 legacy 主树可直接落地的前提：

- `@hiui-design/typical-page-shells`
- `@hiui-design/typical-page-shells/*`
- `TypicalPageHostProvider`
- `TypicalPageHeaderPortal`
- `TablePageFrame`
- `StatListPageFrame`
- `ProEditPage`
- `ProFormDrawer`
- `ProDetailDrawer`

这些符号首先代表必须继承的页壳语义。只有当宿主已经证明可直接承载对应 runtime contract，且机器计划明确选择直接标准壳接入边界时，才可把它们落为该边界内的真实运行时依赖；否则兼容实现必须通过宿主基座、命名 shared shell-carrier 或 host adapter 证明继承链，不能退回业务页面内的 primitive look-alike。

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

旧宿主桥接接入模式里，`hiui5` alias、本地二次封装和实验性组件实现，经常不会把 React children 当作完全透明的黑盒。

因此：

- 若某个组件会遍历第一层 children、克隆子节点、读取 `props.label / props.children / props.value` 或按固定子项类型组装结构，不要再额外包一层业务包装组件
- 对 `Descriptions` 这类字段主表达组件，默认直接写 `Descriptions.Item`
- 若需要减少重复代码，允许抽成“返回 `Descriptions.Item` 节点的普通函数”；不允许抽成 `<DescriptionField />` 这种 first-level wrapper component
- 若宿主组件已经提供 `data` / `items` 配置式 API，优先使用配置模式，而不是依赖包装组件透传 JSX 结构

### 3.1 安装态也必须保持旧宿主契约

桥接模式不是只看 `package.json` 写着什么，还要看 `node_modules` 实际装成了什么。

必须同时满足：

- 根 `react` / `react-dom` 仍停留在宿主声明的 legacy major，不允许在安装后漂移到 `18`
- 根 `@hi-ui/hiui` 仍停留在宿主声明的旧运行时，不能被 `hiui5` alias 或其它依赖顺手替换成 `5.x`
- 若仓库里还存在 `@hi-ui/hiui/es*` 导入，则根 `@hi-ui/hiui` 必须继续提供 `./es` ABI

如果 doctor 报下面这类问题：

- legacy `@hi-ui/hiui/es` consumers still have a compatible root package ABI
- installed root runtime still matches the compatibility contract for legacy host projects

就不要继续生成业务页，也不要去修某个单页样式。先把宿主根运行时恢复到删除前的 legacy 拓扑，再继续桥接接入。

### 4. 桥接模式不是“自由手拼模式”

桥接模式的核心不是“随便用这个项目能跑的组件拼一版”，而是：

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
- 若示例页使用 `@ant-design/charts`，桥接模式下也应继续接入 `@ant-design/charts`，或先停下来补依赖 / 兼容方案；不要用“先画一个能看的趋势图”替代正式实现

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

### 5. `QueryFilter` 在桥接模式里仍是“真实组件契约”

桥接模式下，允许复用宿主列表页基座，但筛选层仍必须使用真实 `QueryFilter`，不能只保留它的外观或行为表象：

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

- 不要以“桥接模式”为理由回退到 schema 搜索壳、`searchConfig.fields`、`searchPanelConfig` 或其他只保留表象的桥接层
- 不要以“外部样式会影响筛选表现”为理由回退到手写筛选；应优先修正 `QueryFilter` 的样式来源、bridge 默认值和宿主接入
- 若宿主现有列表页基座不能承接真实 `QueryFilter`，应先改造基座，再继续生成业务页

### 6. 页头标题要本地归一，不接受宿主默认值直接漏出

旧宿主常见情况是全局 `page-header` 默认自带：

- `font-size: 20px`
- `margin-bottom: 5px`
- 与 `hiui design` 不一致的高度或左右留白

桥接模式下不要直接接受这个默认值。

优先顺序：

1. 优先使用宿主列表基座自己的标题槽位，例如 `layoutConfig.title`
2. 若必须直接使用宿主 `PageHeader`，则在页面局部 class 中把标题归一到 `18px`、`600` 字重，并消除额外底部外边距
3. 不要让页头的外边距把标题和白底主体强行拉开，造成“标题漂在导航下方、主体另起一块”的错位感

### 7. 数据统计页的指标卡必须保持“自适应铺满一行”

桥接模式下统计页允许用宿主自己的样式体系实现指标卡，但结构不能退化。

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

桥接模式下不要只看到列配置里已经有：

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
- 显式写明“这是桥接模式实现，不依赖标准典型页壳”

### 不可以做

- 在旧宿主里继续偷装 `@hiui-design/typical-page-shells` 再赌它运行
- 把 `figma-pages/*.md` 里的标准壳组件名原样粘进代码
- 因为没有标准壳，就退回普通后台通用布局
- 生成“灰底宿主 + 单张白卡表单”这种失真页

## 桥接模式自检

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

如果命中桥接模式，生成说明里必须明确写出：

- 当前页面按 `hiui design` 的页型和节奏生成
- 当前宿主处于旧运行时桥接接入模式；是否直接使用标准 `@hiui-design/typical-page-shells`，取决于宿主是否已证明可承载对应运行时契约，不能仅凭 mode 名称下结论
- 本次实现优先复用计划选中的主生成资产或桥接宿主承载器；若未直接落标准壳，页面结构仍需对齐 `hiui design`，实现语法与 runtime contract 则对齐目标项目现有运行时

## Host Qualification Facts（runtime input facts）

`host-qualification-facts.v1` 是 legacy 专项里的 runtime input facts contract，只用于旧宿主桥接、迁移预案或接入维护时补充宿主边界资格、bridge / adapter 事实与 provenance。字段语义、ready 门槛、provenance 与字段映射表的唯一真相在 `../../rules/runtime-contract.md`；`translation-map` / runtime contract / 组件来源在这里都只是关联引用，本文只说明 legacy 场景下为什么需要派生和如何使用。

触发场景：

- mode lock 为 `legacy-host-compatible`，且普通计划仍缺宿主边界证明。
- 用户要求旧系统截图 / URL / 源码现代化。
- `plan-page-task` 或 pre-plan facts 判断需要补充 legacy host boundary facts。

Phase 1 / 2 中只允许 `manual-observed` 与 `script-derived`。`manual-observed` 只可用于预览事实，不得让 legacy host facts ready；缺少 script-derived 且 verified 的关键 runtime facts 时，`host-qualification-facts.v1` 必须 `status=blocked`，这是预期行为，不是失败。

facts ready 后仍必须执行 `plan-page-task`；不得用 host facts 手工决定 `pageType`、`startFrom`、组件策略或 `requiredActions`。
