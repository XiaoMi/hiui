# 旧宿主桥接接入模式

## 适用场景

当目标项目命中下面任一特征时，不默认把标准 `@hiui-design/typical-page-shells` 视为 legacy 宿主主树里可直接落地的运行时依赖前提，而进入 `legacy-host-compatible` 的桥接接入判断。它不是一套平行页面生成体系，也不是把旧 `page-component` / carrier 大包默认灌入项目；默认路径是用一次性 `HiuiLegacyPage` runtime 承载 compiled PageSpec 与现有典型页壳，再让业务页通过 typed slots 填充。

这里要区分三层：

- 典型页结构、DOM region、ownership、slot schema 与视觉 token 仍来自 HiUI Design 事实源：`rules/typical-page-contracts/<pageType>.json`。
- legacy 宿主只提供挂载点、路由、权限、请求、消息、主题等运行时 adapter 事实：`.local-context/hiui-design/host-contract.json`。
- 业务页面只写 `page.instance.tsx`、`page.slots.ts`、必要时 `page.request.ts`；不得默认写入 `src/page-components`、project carrier 或页面级 support 大包。

命中特征包括：

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

## Do / Don't

Do：

- 项目接入阶段执行 `typical-page:legacy:init`，生成 host contract、一次性 `src/hiui-runtime/*` 运行时边界与 `.local-context/hiui-design/outputs/project-integration-state.json`。
- 在 host contract 中补齐 `request`、`message`、`permission`、`route`、`theme` adapter；必需 adapter 仍是 `partial` / `missing` 时，project integration state 必须保持 blocked，不允许生成业务页；`typical-page:legacy:verify` 仅在显式排障时读取同一阻断事实。
- 页面生成阶段只在 project integration state ready 后执行 `typical-page:legacy:new` 或 `typical-page:legacy:rewrite`，读取 `rules/typical-page-contracts/<pageType>.json`，只生成目标页面目录内的 slots / instance / request 文件；生成结果只能是 `generated-not-accepted`，不能直接作为交付完成态。
- 页面接受态必须执行 `typical-page:legacy:accept`，由机器汇总 `legacy:verify`、宿主 build、remoteEntry 实物模块、runtime DOM、视觉证据与 warning 分类；任一证据缺失时保持 failed / blocked，不允许用口头说明代替。
- warning 分类必须区分 P0 与 P1：P0 console error / pageerror 永远不能 waiver；P1 warning 只有在 waiver 同时声明 `pattern`、`reason`、`owner`、`expiresAt` 且未过期时才能临时通过。
- 不读取旧 `page-component` carrier 资料；reference 示例只作为语义参考，不作为运行时交付资产。

Don't：

- 不要把缺少 legacy 主树 direct shell import 前提，误读成“只能走 reference/fallback”。
- 不要因为 legacy 运行时较旧，就把普通典型页默认改写成 `PageHeader + QueryFilter + Table` 的兼容手拼页。
- 不要把 example/reference 当成默认运行时交付资产；它们只负责语义和结构参考。
- 不要为了一个壳默认创建 `src/page-components`、carrier、support、module.scss 或页面级 runtime 大包。
- 不要在 `page.slots.ts` 里替换 `PageHeader`、`QueryFilter`、`Table`、`Pagination` 等壳层根组件。
- 不要在 `page.instance.tsx` 里手写 `data-hiui5-region` 或覆盖 `--hiui-page-*` 视觉 token。

## 这个模式的目标

目标不是“把标准典型页壳强行跑起来”，也不是每次从旧系统截图 / URL 重新翻译主体骨架，而是：

- 继续沿用 `hiui design` 的页型判断
- 继续沿用 `hiui design` 的信息架构、视觉节奏、标题层级、滚动链和白底主体关系
- 实现层通过 `HiuiLegacyPage` 统一承载 compiled PageSpec 与现有典型页壳，业务页只提供 typed slots
- 通过 host contract 提前锁定 request / message / permission / route / theme adapter，防止目标项目环境污染页面生成效果
- 通过 typical page contract 提前锁定 DOM region、ownership、slot schema 与 visual token，防止 AI 生成时先写偏、再靠验收补救
- 数据可视化优先走 `managed-analytics`，旧系统只提供业务指标、接口、权限和宿主限制事实

也就是说：

- **设计语言继续对齐 `hiui design`**
- **实现语法不再强依赖每页 carrier 或 `src/page-components`**
- **legacy 主路径统一为项目接入链 `apply:legacy`（内部 `legacy:init`）+ 页面计划链 `light-plan` + 页面生成链 `legacy:new|rewrite --plan` + 接受态闭环 `legacy:accept`**

额外强调：

- 桥接模式只改变运行时与接入方式
- 桥接模式**不允许**降低页型专章里的 mandatory components、required regions 与 ownership 要求
- 桥接模式下旧系统材料只作为 business facts / host constraints，不再默认作为主体结构生成来源
- 如果示例页要求真实 `QueryFilter`、真实 `FilterDrawer`、真实指标卡区、真实 `Descriptions` 主表达或固定页壳语义，这些要求在桥接模式里依然成立
- 桥接模式也**不允许**把示例默认视觉语义偷换成宿主随手拼的近似壳层：真实 `PageHeader` back-button、默认灰底 `SearchInput`、`FilterButton` 语义、主白底延伸到底部、分页吸底和蓝色 link 行操作都必须继续成立，除非需求文字明确要求偏离
- 桥接模式下尤其要警惕“宿主 alias 组件会解析第一层 children”这一类运行时细节。像 `Descriptions` 这类组件，如果宿主实现会直接遍历第一层 children 并读取其 `props`，就不能再包一层自定义 React 组件后把它作为第一层节点传入；应直接内联 `Descriptions.Item`，或改走 `data/items` 配置模式

若当前项目已经额外准备了隔离标准壳子应用，则该结论只适用于 legacy 宿主主树本身；独立子应用中的新页面，改为读取 `isolated-standard-shell.md`。

## 旧页面组件直挂模型已删除

旧 page-component carrier 模型不再作为 `legacy-host-compatible` 的生成、迁移、审计或 fallback 路径保留在 skill 包内。若需要回滚旧资产，使用 Git 历史版本，不在当前默认规则中长期新旧并存。

quick start、designer setup、legacy:new、legacy:rewrite 与默认 requiredDocs 都不得引导 AI 走旧 carrier 主链；`legacy:verify` 只保留为显式排障入口，页面交付完成态必须指向 `legacy:accept`。

## Runtime adapter 与 host contract

桥接模式下不再要求业务页逐 region 翻译典型页组件，但必须先证明宿主边界不会污染受管页面。接入期扫描结果应进入 `.local-context/hiui-design/host-contract.json`，至少包含：

- `contentMount`：宿主内容区 owner 与 selector
- `routeOwner`：路由 owner
- `outerPaddingOwner`、`whiteBodyOwner`、`mainScrollOwner`：布局与滚动 owner
- `styleBoundary`：`data-hiui-page-root` 与 token source
- `adapters.request` / `message` / `permission` / `route` / `theme`：必需 adapter 状态
- `adapters.i18n`：可为 `not-required`，但如果项目声明正式 i18n 验收，则必须转为 ready

当任一必需 adapter 为 `partial` 或 `missing` 时，`typical-page:legacy:new` 与 `typical-page:legacy:rewrite` 必须 fail closed；显式排障时 `typical-page:legacy:verify` 读取同一阻断事实；阻断项应指向真正缺口，例如 request、permission、route-navigation、message 或 theme，而不是让页面生成阶段自由猜测宿主能力。

## Runtime-Managed Typical Page 语义

在 bridge 模式下，用户可读语义统一写作 `runtime-managed-typical-page`。它的机器含义是：

- 主生成事实仍是既有 typical page contract，不新增一套 legacy 页型或视觉模板。
- runtime shell 的真实来源由 `HiuiLegacyPage` 按 compiled PageSpec 的 `pageType` / `shell` 选择现有 `@hiui-design/typical-page-shells` 导出。
- `HiuiLegacyPage` 负责页面 root scope、DOM region owner 标记、slot 渲染与视觉 token scope；宿主 adapter 能力由 host contract 提前锁定。
- `page.instance.tsx` 只能挂 `HiuiLegacyPage` 并传入 typed slots，不得实例化壳层根组件或手写 managed region。
- `page.slots.ts` 只能把业务 schema / handlers 绑定到标准 slots 或 Level 1 受控扩展，不得把 `QueryFilter`、表格、分页、详情、底栏等 region 翻译成宿主 look-alike primitives。
- `typical-page:legacy:verify` 不是默认页面生成链路；DOM region、ownership、slot schema 与视觉 token 必须作为 `legacy:new/rewrite` 的生成输入约束。

## 接入成熟度解释模型（非 public contract）

该模型只用于解释和归纳现有机器字段组合所表达的接入成熟度，不新增 public contract 顶层状态，也不要求一一对应的新机器枚举。

- `mountable`：页面可以稳定挂入宿主内容区，但 runtime boundary / governance 未必完整；它更适合作为人类解释语义，不绑定单一机器字段。
- `preview-mountable`：在 `mountable` 基础上已经具备预览或局部运行验证条件，可做结构 / 视觉预览，但未必达到受管生成或可交付；同样保留为人类解释语义。
- `managed-ready`：主要由 host contract、compiled PageSpec、HiuiLegacyPage runtime 与 slot schema 的 ready 状态组合稳定解释，表示可以进入受管生成主链路。
- `delivery-ready`：在 `managed-ready` 基础上，再叠加 `preflightStatus`、`governanceStatus`、formal acceptance 等交付层状态，表示可以按交付协议对外汇报。

## 使用顺序

桥接模式下，生成页面时按轻量契约链路执行：

1. 读取或生成 host pack：默认 `host-packs/asp-fwt-common-front.json`，不得从业务页反推宿主能力。
2. 执行 `typical-page:legacy:init`：写入 `.local-context/hiui-design/host-contract.json` 与一次性 `src/hiui-runtime/*`。
3. 补齐 host contract：`request`、`message`、`permission`、`route`、`theme` 必须为 `ready` 或 `not-required`。
4. 读取 `rules/typical-page-contracts/<pageType>.json`：确认 shell、regions、regionOrder、ownership、slotSchema、componentSources、visualTokens、forbiddenOverrides 与 verificationRules。
5. 新页面执行 `typical-page:legacy:new`，改造既有页面执行 `typical-page:legacy:rewrite`；页面目录只写 `page.instance.tsx`、`page.slots.ts`、必要 `page.request.ts`。
6. 页面生成完成后，执行 `typical-page:legacy:accept`；该命令必须证明静态 gate、宿主 build、remoteEntry 实物模块、runtime DOM、视觉证据与 warning 分类，并把 `workflow.legacyAcceptanceStatus`、`workflow.legacyAcceptanceReportPath`、`workflow.legacyAcceptanceSnapshotHash` 写回 page contract。`typical-page:legacy:verify` 仅在排查接入或生成异常时显式调用。

补读文档时按这个顺序读：

1. `generation-principles.md`
2. `page-type-map.md`
3. 本文件
4. `rules/typical-page-contracts/<pageType>.json`
5. `figma-page-rules.md`
6. 命中的 `figma-pages/*.md`

其中：

- `page-type-map.md` 仍负责判页型
- `figma-pages/*.md` 仍负责理解该页型的结构目标
- `rules/typical-page-contracts/<pageType>.json` 负责机器可消费的 region / ownership / slots / token / verification 事实
- `host-packs/*.json` 与目标项目 `host-contract.json` 负责宿主边界事实
- `runtime/legacy/src/*` 负责一次性 `src/hiui-runtime/*` runtime mirror，不是每页模板
- `page-level-components.md` 只描述非 legacy page-component 边界，不是 legacy 默认生成入口
- `data-visualization.md` 负责 `managed-analytics` 的 chart usage contract、图表 token 与分析布局
- `host archetype` 与 `reference-or-scaffold` 属于合法 fallback 起点；只有 standard runtime boundary 不可用、宿主约束特殊或 drift 风险需要显式治理时，才进入这些路径

## 桥接典型页轻量生成路径

当用户需求清晰命中一个既有普通典型页型，且没有特殊布局、跨页型组合、非典型 section、独立分析图表或正式 i18n 验收要求时，`legacy-host-compatible` / 项目内称为 `host-compatible` 的桥接页默认进入轻量页面生成路径。该路径不是项目接入快捷路径，也不是 `plan-page-task -> start-page -> page-components`；前提是项目接入阶段已经完成 `apply:legacy`（内部执行 `legacy:init`），随后页面生成阶段执行 `light-plan` + `legacy:new|rewrite --plan`，最后用 `legacy:accept` 收口接受态。

对旧系统中已经存在的业务页，bridge 快速路径默认优先下面两类实现动作：

1. `slot-fill-only`：当前页已经是 ready 的 runtime-managed typical page，且本次需求没有触碰 `pageType`、`shell`、`ownership`、mandatory components 或 runtime boundary，只替换业务槽位。
2. `rewrite-by-contract-slots`：当前页仍属于同一典型页型，但现有源码不是 ready 的 managed instance。此时应直接用 typical page contract + runtime renderer 重建业务页实例，而不是在旧 JSX 上继续修补 `header / query-filter / table / pagination / white-body`。

`rewrite-by-contract-slots` 仍然属于 bridge 模式下的普通典型页主链；它不是 fallback，也不是 translated-reference。

数据可视化不属于普通典型页快速路径。即使存在示例页，也必须走 `generationStrategy=managed-analytics`：先提取旧系统中的业务指标、筛选维度、接口和权限事实，再建立 `chartUsageContract`，最后由数据可视化 token 与图表组件规则生成页面实例。

桥接快速路径的起点优先级：

1. ready host contract + compiled PageSpec + one-time HiuiLegacyPage runtime
2. 当前仓库里同页型、同宿主基座且已跑通的 typed slots 页面
3. `managed-analytics` 的受管分析承载器（仅数据可视化 / 分析页）
4. 当前仓库里同页型、同宿主基座的已跑通 slots 页面或 host archetype
5. 只替换业务槽位：标题、查询字段、指标、表格列、表单 / 详情字段、接口 / mock 数据、行操作；简单二次改造只能落到 `topNotice`、`toolbarSupplement` 等受控扩展槽位

桥接快速路径必须显式保留：

- 真实页头 / 筛选 / 表格 / 指标 / 分页 / 底栏语义
- 单一 content slot / white-body / outer-padding / main-scroll ownership
- host contract、compiled PageSpec、HiuiLegacyPage runtime 与 typed slots source marker
- 行操作 link 语义与页面级可预览能力

没有显式国际化要求时，默认 `i18nMode=none`；即使宿主已有 `t()` / `intl.get()` 等能力，也不能仅因依赖存在就进入 i18n 流程。只有用户明确要求多语言 / locale / 翻译 / 英文 / RTL，或旧页面已有强制 i18n contract 时，才升级到对应 i18n 流程。

## 分层转译漂移门禁

legacy 快速路径不是全量重流程，而是按接入层 / 生成层 / 治理层三层收敛：

1. **接入层必备门禁**：所有 legacy 典型页都必须先通过 host pack、host contract、HiuiLegacyPage runtime、adapter readiness、route owner、ownership、禁止 `src/page-components` 默认写入、禁止 reference / examples / `typical-page-reuse` 交付路径。
2. **生成层主链路门禁**：普通典型页默认以 `compiled PageSpec + HiuiLegacyPage runtime + typed page slots` 为主资产；只有 runtime mirror 不可用、结构升级或宿主约束特殊时，才允许进入 host archetype / reference / scaffold fallback。contract-first 只说明生成起点，不豁免 instance validation，也不把治理要求自动降到 `rules-only`。
3. **治理层增强门禁**：只有命中转译风险、页型迁移或正式验收条件时，才显式展开 Translation Drift Guard，并按需要补齐 finalize / source gate / doctor / runtime smoke。`StyleBoundary`、`PortalBoundary`、`runtimeSmoke` 默认属于这一层的触发式检查，但 style token scope 与必需 adapter readiness 已经是生成输入硬约束。

这里要明确区分两类升级：

- `implementation upgrade`：只有 `pageType`、`shell`、`ownership`、split、主工作区滚动链或 mandatory components 发生变化时，才升级成重结构改造。
- `governance upgrade`：迁移 / 重架构页、高风险 drift、正式验收 / 发布场景，会升级 snapshot、acceptance contract、translation map、source-gate、doctor、runtime smoke 等治理动作，但不必然要求页面结构重写。

若 host contract 中必需 adapter 仍为 `partial` / `missing`，或 typical page contract 缺少 regions / slotSchema / visualTokens，生成阶段必须停止；不得用“先拼一个能跑的页面”绕过准入。若项目结构已能自动推断 `CleanContentMount`，不得再要求通过改造页面证明内容区独立；若 capabilities 已能自动扫描 adapter 缺口，则必须复用扫描结果中的具体缺口，不得在页面阶段重新泛化成“缺运行时证明”。

legacy 的最小 host contract proof 必须能写清：

- `hostId`、`mode=legacy-host-compatible` 与宿主来源
- `contentMount.selector` 与 `contentMount.owner`
- `routeOwner`
- `outerPaddingOwner` / `whiteBodyOwner` / `mainScrollOwner`
- `styleBoundary.scopeAttribute=data-hiui-page-root` 与 token source
- `portalRoot` owner
- `request`、`message`、`permission`、`route`、`theme` adapter 状态

若当前页面选择 runtime-managed typical page，页面结构事实必须由 compiled PageSpec 复用，runtime 能力由 host contract 单独证明；当前业务页必须保留 required slots、受控扩展、route owner、business mapping、region ownership、visual token 与 runtime render 的生成输入事实。

命中下面任一情况，必须展开 Translation Drift Guard：

- 没有现成且合格的 host archetype
- 首次为该宿主生成当前页型
- host archetype 与 typical page contract 的 required regions 不完全一致
- 需要新增或修改 host adapter
- 进入 reference / scaffold 高风险转译
- 涉及 `table-stat`、`tree-split`、`drawer-form`、`drawer-detail`、`full-page-edit`、`full-page-detail`
- 修改 ownership、runtime mirror、route owner 或 source marker
- 出现 source marker warning 或显式排障发现的 runtime warning
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
example region -> host shell boundary -> adapter strategy -> verification evidence
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

required region 找不到 host shell boundary 或 adapter 证明时，不能用临时 `div`、`Card`、`SearchForm` 或 primitives 补位；必须先补 adapter，或退出快速路径。

### 3. Isomorphism Check

同构检查不是要求组件名相同，而是证明转译后仍保持典型页结构语义。

快速路径至少做 static check：

- source marker 存在
- required region marker 存在
- `examplePath`、`hostAdapter`、`hostArchetypePath` 或 adapter scaffold、`legacyRuntimeSurfacePath`、`ownershipMode` 存在
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

这些符号首先代表必须继承的页壳语义。只有当宿主已经证明可直接承载对应 runtime contract，且机器计划明确选择直接标准壳接入边界时，才可把它们落为该边界内的真实运行时依赖；否则兼容实现必须通过宿主基座、命名 shared shell boundary 或 host adapter 证明继承链，不能退回业务页面内的 primitive look-alike。

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
