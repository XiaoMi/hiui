# HiUI Page Task Failure Matrix

本文件是页面任务失败恢复的唯一真相。`SKILL.md` 只引用本文件，不复述失败处理细节。

原则：

- 计划失败优先看 `page-task-plan.v1.status` 与 `blockingIssues[]`，兼容读取 `blockingReasons[]`。
- 交付失败优先看 `preflight-report.v1.status`、`checks[]` 与 `blockingIssues[]`，兼容读取 `blockingReasons[]`。
- 能自动修复时输出 `suggestedActions[]`；不能自动修复时输出明确 `blockingIssues[]` 与兼容文本 `blockingReasons[]`。
- `blocked` 表示事实不足；`invalid` 表示协议或输入非法；二者不得混用。

| Failure Code | 来源 | 判断条件 | 用户可见解释 | 下一步动作 | 自动修复 | 阻断 |
| --- | --- | --- | --- | --- | --- | --- |
| `PROJECT_ROOT_NOT_FOUND` | plan | 当前目录或 `--target` 不同时包含 `package.json` 与 `.local-context/hiui-design/` | 未定位到已接入 HiUI 典型页治理的项目根 | 切到真实项目根，或先完成接入 / bootstrap | 否 | 是 |
| `PLAN_SCHEMA_UNSUPPORTED` | plan | `schemaVersion` 缺失且无法兼容，或不是已支持版本 | 机器计划协议版本不可识别 | 停止执行，升级脚本或重新生成计划 | 否 | 是 |
| `PLAN_INVALID` | plan | `status=invalid`，或必填字段缺失、字段组合矛盾、action 不可解析 | 计划本身非法，不能通过补业务事实绕过 | 修复 `plan-page-task` 输入或脚本输出 | 否 | 是 |
| `PLAN_BLOCKED` | plan | `status=blocked`、`blockingIssues.length > 0` 或 `blockingReasons.length > 0` | 计划合法但事实不足 | 只补 `blockingIssues` / `blockingReasons` 指向的事实，不生成页面 | 视原因而定 | 是 |
| `MISSING_PAGE_TYPE` | plan | `blockingReasons` 包含 `missing pageType` | 页面类型未解析，不能直接当作非典型页处理 | 让用户确认页型，或补充需求后重新运行 plan | 否 | 是 |
| `RUNTIME_BRIDGE_PROFILE_MISSING` | plan | legacy `page-component` 需要 runtime bridge，但 `runtimeBridgeProfile` 缺失或 `rules/runtime-bridged-component-matrix.json` 未命中 | 缺少 legacy 桥接页面组件的结构化 bridge profile，不能安全进入主链路 | 补齐 bridge profile，或显式退回合法 fallback | 部分 | 是 |
| `RUNTIME_BRIDGE_SOURCE_UNRESOLVED` | plan | 选中的 runtime bridge profile 无法从 certification 解析 `certificationInputs.componentShell` | 无法确认真正的运行时页壳来源，不能生成 thin bridge 代码 | 修复 certification / profile 关联，或改用 project-certified carrier | 部分 | 是 |
| `ROUTE_OWNER_MISSING` | plan/preflight | 目标页落在 `src/typical-page-reuse/**`，或 route ownership 不是业务路由 | 当前目标属于示例 gallery / smoke baseline，不是真实业务路由 | 改到 `src/pages/<business-page>/index.jsx|tsx` 或宿主业务目录 | 否 | 是 |
| `SOURCE_MARKER_MISSING` | preflight | `checks[].id=sourceMarker` 且 `status=failed` | 源码缺少受管页面 source marker，无法确认页型与治理边界 | 使用受管起点重建，或补齐合法 source marker 后重跑 preflight | 部分 | 是 |
| `CONTRACT_PAGE_TYPE_MISMATCH` | preflight | `checks[].id=contractPageType` 且 `status=failed` | 源码声明的新页型与旧 contract 不一致 | 执行 `write-contract-standard`，刷新合同后再 preflight | 是 | 是 |
| `PAGE_TYPE_MIGRATION_CONTRACT_STALE` | plan/preflight | `targetPage.pageTypeMigration=true`，或 preflight 提示 source pageType 与 contract pageType 不一致 | 这是页型迁移，旧合同不能先参与验收 | `select-archetype -> replace slots -> write-contract --preset standard -> preflight` | 是 | 是 |
| `REGION_CONTRACT_MISMATCH` | preflight | `checks[].id=regionContract` 且 `status=failed` | 页面 region 与页型 contract 不一致 | 按 `rules/contract-regions.md` 修正 region / contract 映射 | 部分 | 是 |
| `OWNERSHIP_MAPPING_MISMATCH` | preflight | `checks[].id=ownershipMapping` 且 `status=failed` | ownership mapping 与宿主结构不一致 | 补齐 route owner、shell carrier 或 ownership mapping 后重跑 preflight | 部分 | 是 |
| `DIRECTORY_ARTIFACTS_MISSING` | preflight | `checks[].id=directoryArtifacts` 且 `status=failed` | 目录页入口缺少 sibling artifacts | 补齐 `sections` / `sections.module.scss` 等受管目录产物 | 是 | 是 |
| `CHART_GOVERNANCE_MISMATCH` | preflight | `checks[].id=chartGovernance` 且 `status=failed` | 图表区域违反受管图表栈或 chart-section 语义 | 按当前页型专章与 `docs/generation/figma-page-rules.md` 修复 | 部分 | 是 |
| `TRANSLATION_MAP_STALE` | translation-map | `translation-map.v1.sourceHash` 与当前页面 source snapshot 不一致，或 formal 验收要求刷新 | legacy 转译映射已过期 | 重新运行 `typical-page:translation-map` | 是 | 是 |
| `HIUI013_MISSING_SOURCE_SNAPSHOT` | governance | 迁移 / 重架构页缺少 `pre-migration-snapshot.v1` | 缺少旧页事实，继续实现可能静默丢失筛选字段、页头动作、表格列或分页行为 | 先生成机器提取的 source snapshot；不能由 agent 手写 | 是 | 是 |
| `HIUI016_LOW_CONFIDENCE_SNAPSHOT` | governance | source snapshot `confidence=low` 或 `invalid` | 旧页事实置信度不足，不能作为迁移保护依据 | 补充可验证源材料并重建 snapshot；`medium` 只能补事实，不覆盖已提取事实 | 部分 | 是 |
| `HIUI014_ACCEPTANCE_CONTRACT_MISSING` | governance | 迁移 / 重架构页缺少 `page-acceptance-contract.v1` | 缺少页面专属验收契约，通用页型规则无法保护业务体验 | 基于 source snapshot、用户需求、pageType baseline 与 page contract 生成 acceptance contract | 是 | 是 |
| `HIUI017_REQUIREMENT_WITHOUT_PROVENANCE` | governance | blocking requirement 缺少 `provenance` | 验收要求不可追溯，不能作为 hard gate | 补充 provenance 或降级为 warning；不得让 agent 自证 requirement 来源 | 部分 | 是 |
| `HIUI004_FAKE_SHELL_MARKER` | governance/preflight | 仅存在注释 marker / `data-hiui5-shell`，缺少 registry + AST 可证明的 shell carrier | 页面可能是手写壳伪装成典型页壳 | 使用合法 shell carrier，或补齐 registry 与真实导入 / 挂载证据 | 部分 | 是 |
| `RUNTIME_BRIDGE_RESPONSIBILITY_DRIFT` | governance/preflight | bridge wrapper / slot adapter 接管 `shell`、`white-body`、`main-scroll`、`pagination`、`footer`，或把标准 region 翻译成宿主 look-alike primitives | 运行时桥接层越界，已不再是 thin bridge，而是在重写页面组件 | 收回到 runtime bridge / slot binding 职责边界，必要时退出 `page-component` 主链路 | 部分 | 是 |
| `RUNTIME_BRIDGE_TEMPLATE_MISSING` | preflight | runtime bridge profile 声明了 wrapper / slot adapter 资产，但模板未 shipped 或路径缺失 | 计划已选择桥接页面组件，但配套桥接资产不完整 | 补齐并 ship 模板后重新执行 `start-page` / preflight | 是 | 是 |
| `HIUI010_ADAPTER_SCHEMA_INVALID` | governance | adapter 纯 re-export、未注入默认值、承担 page owner，或 localBypass 与 AST 不匹配 | 第三方 UI 接入只是形式合规，不能保证典型页默认值与 ownership | 改为 Managed 组件 / 合法 adapter；记录 owner + expiry 的 local bypass | 部分 | 是 |
| `HIUI005_QUERY_FILTER_FIELD_LOST` | governance | acceptance contract / source snapshot 要求的筛选字段在行内或抽屉中缺失 | 页面迁移丢失筛选能力或错误迁移字段位置 | 恢复字段，或用带 provenance 的 acceptance contract 说明迁移原因 | 部分 | 是 |
| `HIUI022_MANAGED_FILTER_CHAIN_MISSING` | governance/preflight | contract 要求 `query-filter` region，但源码没有真实 `QueryFilter` / 认可 host search shell 语义，或退回 `searchConfig.fields`、`SearchForm`、`getSearchFields`、手写 primitive 筛选栏 | 页面看起来还有搜索区，但已经脱离受管 `QueryFilter / FilterDrawer` 链路 | 恢复真实 `QueryFilter / FilterDrawer` 或认可的 host search shell；只有页面语义真的改变时才允许重写 contract | 部分 | 是 |
| `HIUI023_QUERY_FILTER_BASELINE_DRIFT` | governance/preflight/runtime | 行内 `QueryFilter` 打开 `showLabel`、偏离 contained baseline、关键词搜索退化成裸 `Input`、追加第二个“查询 / 重置”按钮，或“全部筛选”退回普通 `Button` | 筛选链路还在，但已偏离典型列表的受管基线，后续极易继续产生灰底丢失、节奏错位和操作重复 | 收回 no-label / contained / filled baseline，移除手工按钮，恢复 `FilterButton` / `FilterDrawer` 语义 | 部分 | 是 |
| `HIUI024_HOST_STYLE_CONTAMINATION` | governance/preflight/runtime | 页面本地样式、slot override 或 `.hi-v5-*` 选择器触达 `PageHeader`、`QueryFilter`、`Table` 等公共组件骨架 | 外部 / 本地样式污染了受管组件内部骨架，页头宽度、筛选灰底、按钮停靠或表格节奏都可能被静默挤坏 | 移除页面级骨架覆写，把几何、颜色和节奏责任收回 shared carrier / token bridge | 部分 | 是 |
| `HIUI025_LIST_WORKSPACE_WIDTH_OWNER_DRIFT` | governance/preflight/runtime | `outer-padding`、`white-body`、`main-scroll`、`table` region 或 project-certified carrier 抢占横向滚动，或使用 `max-content / min-content / fit-content` 等内容宽度策略 | 列表工作区不再随父容器自适应，筛选 / 表格容易被撑破或出现外层横向滚动 | 把横向滚动收回内层表格 wrapper，补 `min-width: 0` / `min-inline-size: 0` 等约束，让工作区回到 width-adaptive 链路 | 部分 | 是 |
| `HIUI051_QUERY_FILTER_FIELD_ROLE_DRIFT` | governance/preflight/runtime | `queryFields` 的关键词搜索与普通文本筛选角色没有分开治理，例如普通文本字段静默回退成裸 `Input`，或为了保留灰底把多个文本字段都直接伪装成 `SearchInput` | 页面表面像是“统一了筛选框”，实际已经把字段角色混掉，后续会继续出现多个主搜索入口、字段行为不一致、DSL 生成结果不可预测 | 恢复 `queryFieldRenderProfile`：关键词位回到 `search-input`，普通文本位回到共享皮肤下的 `filter-text-input` 角色；不要靠复制搜索组件语义兜视觉 | 部分 | 是 |
| `HIUI052_QUERY_FILTER_SURFACE_MISMATCH` | governance/preflight/runtime | `QueryFilter` 仍在，但内部字段没有共享同一筛选表面，例如关键词搜索框保留灰底 / filled，普通文本、选择器或日期字段却落成白底 / line / 另一套皮肤 | 页面结构合规但筛选区视觉基线失真，常见表象就是“一个灰底、多个白底”或控件节奏不再像同一块查询区 | 把筛选字段收回共享 `filterSurfaceBaseline`，让文本、选择与日期类字段重新落在同一 `query-filter` 表面；若共享组件存在能力缺口，需显式记录 waiver / fallback，而不是默默放过 | 部分 | 是 |
| `HIUI032_TASK_WRITE_SCOPE_VIOLATION` | plan/governance/preflight | 页面任务修改了 `writeScope` 之外的共享壳、公共 carrier、公共图表 primitives 或 vendor 资产 | 当前任务越过了页面本地实现边界，正在把页面问题扩散成公共资产变更 | 停止页面任务；改回页面本地文件，或升级为明确的维护任务后重新规划 | 否 | 是 |
| `HIUI033_PRIMARY_ROLE_MISMATCH` | preflight/runtime | `visualizationRolePlan` 规定的主图角色与实际主区域图类型不一致，例如主区域应为带轴主分析图却落成摘要型图 | 页面主阅读线漂移，用户第一眼读到的不是核心业务问题 | 按 `visualizationRolePlan` 重排主次区域或更换图表类型，并重跑 preview / runtime 验证 | 部分 | 是 |
| `HIUI034_SUMMARY_CHART_IN_PRIMARY_REGION` | preflight/runtime | `饼图 / 环图 / 雷达图 / 仪表盘 / 默认漏斗图` 在没有明确例外时占据主区域 | 摘要图形抢占主位，信息密度与画面权重不匹配 | 收回到辅助区；若确有业务理由，先在 `chartUsageContract` 与 layout plan 中声明例外 | 部分 | 是 |
| `HIUI035_CHART_HELPER_DECLARED_BUT_NOT_BOUND` | governance/preflight | 共享 helper 名称虽然被 import 或出现在转译源码中，但当前图表实例没有真正绑定对应 helper / theme / scale 配置 | 规则看起来存在，实际图表仍在裸跑或部分裸跑 | 改为校验实例级绑定，补齐当前图表 config 的真实 helper/theme 引用 | 部分 | 是 |
| `HIUI036_CHART_COLOR_CONTRACT_FAKE_PASS` | governance/preflight | 颜色 contract 只在共享 helper 文件里存在，但当前图表实例仍落回默认色板或未显式绑定 domain/range | 图表颜色“名义合规、结果不合规”，验收阶段才会暴露 | 要求当前图表实例显式绑定颜色 contract，并在 source / preview 阶段验证真实结果 | 部分 | 是 |
| `HIUI037_ANALYTICS_GRID_MODE_MIXED` | preflight/runtime | 同一 `chart-section` 内混用了 `two-column`、`three-column`、`four-column` 多种基础栏数模式，例如 `6/6 + 4/4/4` 或 `4/4/4 + 3/3/3/3` | 图表区的布局节奏漂移，用户无法稳定识别同层内容与主辅权重 | 收敛为单一基础栏数模式，并重新运行 preview / runtime 验证 | 部分 | 是 |
| `HIUI038_ANALYTICS_GRID_SPAN_BELOW_MINIMUM` | preflight/runtime | `four-column` 图表区出现 span 低于最小值的正式数据图表，或通过过窄网格把主图压成非受管小图 | 图表尺寸低于受管分析可读性下限，页面虽可渲染但主阅读任务已经失真 | 提升图表 span，或改回合法 mode / pattern 后重跑校验 | 部分 | 是 |
| `HIUI039_ANALYTICS_GRID_BYPASS` | governance/preflight | 业务页通过局部 wrapper、自写 `grid-template-columns`、裸 `Row/Col` 或其它自由 grid 实现绕开 shared analytics primitives | 页面表面接近规范，但底层已经脱离受管 `chart-section` 布局链路 | 收回到受管 shared primitives，移除本地 grid bypass 后重跑 preflight | 部分 | 是 |
| `HIUI040_FULL_SPAN_MODE_MISCLASSIFIED` | preflight/runtime | `12` full-span 被误判为新的基础栏数模式，进而导致同一 `chart-section` 被错误标记为 mixed-mode 或被错误切换 layout | 受管整行主图被当成模式切换，布局语义与实现语义不一致 | 把 `12` 重新收口为 neutral `full-span`，并修复 mode 判定逻辑 | 部分 | 是 |
| `HIUI041_METRIC_CARD_MISCLASSIFIED_AS_CHART_SECTION` | governance/preflight/runtime | `stat-section` 的指标卡或其中的 `sparkline / mini trend / mini chart` 被误计入 `chart-section` 的 mode / span / mixed-mode 校验 | KPI 区被错误纳入图表区治理，导致规则误伤指标卡布局 | 把指标卡及其迷你图收回 `stat-section` 语义边界，重新执行图表区校验 | 部分 | 是 |
| `HIUI042_CONTROL_STRIP_ORDER_DRIFT` | governance/preflight/runtime | `dashboard-control-strip` 没有保持在 `white-body` 顶部，而是漂移到 `stat-section` 或 `chart-section` 之后 | 页面级视角切换已经混入分析主体，用户第一眼不再先建立全页分析口径 | 把 control strip 收回白底主体最上方，并放在 `stat-section` 之前 | 部分 | 是 |
| `HIUI043_CONTROL_STRIP_PANELIZED` | governance/preflight/runtime | `dashboard-control-strip` 出现背景色、描边、圆角、阴影等 panel chrome，未保持 `plain-row-no-panel` | 顶部控制条回退成整块灰底查询面板，页面阅读线从“分析工作台”退回“列表检索页” | 移除 panel chrome，恢复 plain-row control strip 基线 | 部分 | 是 |
| `HIUI044_MIXED_SCOPE_CONTROL_ROW` | governance/preflight/runtime | 页面级 `dashboard-control-strip` 与明细 `QueryFilter` 被塞进同一 row / carrier，或 `QueryFilter` 直接嵌入 control strip | 页面级视角切换与明细筛选的作用域混淆，用户无法判断当前操作会影响全页还是只影响明细表 | 拆分为两条链路：顶部 control strip 负责全页视角，独立 `QueryFilter` 负责 detail filter | 部分 | 是 |
| `HIUI045_DETAIL_QUERY_FILTER_PLACEMENT_DRIFT` | governance/preflight/runtime | 独立明细 `QueryFilter` 提前到 `chart-section` 之前，或漂移到 detail table 之后 | 明细筛选不再紧邻结果区域，页面语义从“先分析再钻取”退化成混合筛选页 | 把 `QueryFilter` 收回 `chart-section` 之后、detail table 之前的邻接位置 | 部分 | 是 |
| `HIUI046_BODY_SECTION_LAYOUT_BYPASS` | governance/preflight/runtime | `form-body` / `detail-body` 内通过自由 wrapper、自写 grid、自写 panel 或第二套局部 workspace 组织一级 section，绕开受管 section 语义 | 页面外壳没歪，但壳内一级业务 section 已经脱离受管结构 | 收回到受管 section / `supportingSections` 扩展，移除自由布局 bypass 并重跑 preflight | 部分 | 是 |
| `HIUI047_BODY_SECTION_SPACING_OWNER_DRIFT` | governance/preflight/runtime | body 一级 section 的间距退回到 page root、field grid、统一尾留白或其他错误 owner，而不再由 section 结构 / `Descriptions` group / `FormItem` 承担 | 页面 section 节奏开始漂移，后续很容易长成“看起来像对了、结构其实歪了”的页 | 把 spacing owner 收回 section 结构与受管表达骨架，去掉 page-level `gap` / `padding-bottom` / `margin-bottom` 补位 | 部分 | 是 |
| `HIUI048_EMBEDDED_WIDGET_UNDECLARED` | governance/preflight/runtime | `form-body` / `detail-body` 中出现独立表格、只读摘要图、媒体行或控制条，但 contract 没声明 `bodySectionContract.embeddedWidgetPolicy` 或页面组件扩展白名单 | 页面里多了独立 widget，但 contract 无法解释它是否合法、归谁管 | 补齐 `bodySectionContract` 与对应 `supportingSections` / extension 声明，必要时升级 customization level | 部分 | 是 |
| `HIUI049_BODY_SECTION_PANELIZATION_DRIFT` | governance/preflight/runtime | 扁平 section 被翻译成第二层白卡、panel shell、独立主体卡，或在既有 `white-body` 内再长出平级 page-surface | 页面从“一个受管主体里的 section”退化成“多个自定义主容器” | 收回到扁平 section / 受管 supporting section；移除第二层 panel / white-body 壳 | 部分 | 是 |
| `HIUI050_BODY_SECTION_SCOPE_DRIFT` | governance/preflight/runtime | 独立表格、摘要、媒体、控制条虽然存在，但其作用域、owner 或挂载位置无法由 `bodySectionContract`、`allowedExtensions` 或 region mapping 解释 | 页面新增内容的结构边界不清，规则无法判断它是合法扩展还是结构升级 | 明确写入 `bodySectionContract`、页面组件扩展和 region/ownership 事实；若已接管工作区 owner，则升级策略而不是继续按 slot-fill 处理 | 部分 | 是 |
| `HIUI018_HEADER_LAYOUT_CONTRACT_MISSING` | governance/preflight | contract 声明 `header` region 或页级动作 owner 为 `PageHeader extra`，但缺少 `headerLayoutContract` | 页头承接链存在，但 stretch / right-dock / rhythm 缺少机器事实，不能证明共享页头真的可用 | 补齐 `headerLayoutContract`，并写明 carrier owner、stretch owner、actions docking、vertical rhythm owner 与 evidence | 是 | 是 |
| `HIUI019_HEADER_CARRIER_WIDTH_COLLAPSED` | governance/runtime | header carrier 无法证明 `PageHeader` root 已 stretch，或运行时宽度明显小于承接槽宽度 | 页头根容器没有铺满，按钮容易挤在标题旁边 | 修复 shared carrier / host slot 的 stretch 责任，重新认证 carrier，并重跑 preflight / runtime smoke | 部分 | 是 |
| `HIUI020_HEADER_EXTRA_NOT_RIGHT_DOCKED` | governance/runtime | `PageHeader extra` 没有停靠到 header 右边界，或被 wrapper 改造成标题旁 inline group | 页级按钮仍在 header 区，但没有按标准停靠到最右侧 | 收回到标准 `PageHeader extra` 承接链，修复 docking 证明后重跑 runtime smoke | 部分 | 是 |
| `HIUI021_HEADER_RHYTHM_OWNER_DRIFT` | governance/runtime | `60px` 页头节奏被业务页、本地 wrapper、`PageHeader` 根节点或按钮高度重新承接 | 页头高度和垂直节奏 owner 漂移，后续容易继续出现贴边或按钮被拉高 | 把节奏 ownership 收回 host slot / shared carrier，移除本地 geometry 覆写 | 部分 | 是 |
| `HIUI008_HEADER_ACTION_SLOT_INVALID` | governance/runtime | 页级 action 缺失、位置错误或尺寸不符合 acceptance contract | 页级按钮没有进入合法 action slot，或 slot 内尺寸 / priority 不符合 contract | 放回合法 PageHeader action slot，并匹配 size / priority | 部分 | 是 |
| `HIUI006_PAGINATION_DRIFT` | governance/runtime | pagination 不在表格 workspace 底部、空态与分页距离异常或滚动 owner 错误 | 表格主体与分页出现异常空白或分页漂移 | 修复 white-body / table / pagination 高度链和 bottom-docked 关系 | 部分 | 是 |
| `USAGE_STATS_REQUIRES_AUTHORIZATION` | stats | usage 脚本返回 `status=requires_network_authorization` 或退出码 `21` | 页面已交付，但统计补传需要网络授权 | 向用户申请网络授权；同意后按 `PRIVACY.md` 补传 | 是 | 否 |
| `USAGE_STATS_FAILED_RETRYABLE` | stats | usage 返回可重试失败 | 页面交付不被推翻，但统计尚未完成 | 记录统计状态，稍后重试 | 是 | 否 |
| `USAGE_STATS_FAILED_NON_RETRYABLE` | stats | usage 返回不可重试失败 | 页面交付不被推翻，但统计无法完成 | 最终回复说明统计失败原因 | 否 | 否 |

## Agent 处理规则

1. `PLAN_INVALID` / `PLAN_SCHEMA_UNSUPPORTED`：停止，不读取大段文档，不实现。
2. `PLAN_BLOCKED`：只补事实；补齐后重新运行 `plan-page-task`。
3. `CONTRACT_PAGE_TYPE_MISMATCH` / `PAGE_TYPE_MIGRATION_CONTRACT_STALE`：优先执行 `write-contract-standard`，不要按旧页型逐条修源码。
4. preflight `warnings[]` 不改变顶层 `status`，但 final report 必须展示。
5. hard profile 下 governance `blocking` 必须阻断完成态；`report-only` profile 的 blocking 只能进入风险报告，不得描述为已修复。
6. usage stats 失败不默认推翻页面状态，但不能静默吞掉。

## Acceptance Profile 规则

- `acceptanceProfile.level` 是验收等级结构化主字段；`acceptanceLevel` 是兼容字符串。
- 只有 `acceptanceProfile.formalRequired=true` 时默认执行 `formalAcceptanceActions[]`。
- `formalAcceptanceActions[]` 不为空但 `formalRequired=false` 时，只作为可升级候选，不自动执行。
- 用户在 preview / standard 后追加正式验收要求时，重新运行或升级 plan，不手工拼 formal 命令。

## Pre-plan Facts Failure Matrix

截图 / 旧系统转译任务在 `PlanTask` 前可能产生 `visual-translation-brief.v1` 与 `host-qualification-facts.v1`。这些失败仍归属统一失败恢复体系；不得另起实现流程，也不得在 facts 未 ready 时手工拼计划。

| code | source | signal | cause | behavior | recoverable | PlanTask allowed |
| --- | --- | --- | --- | --- | --- | --- |
| `VISUAL_BRIEF_BLOCKED` | visual-translation-brief | `status=blocked` 或 `blockingIssues.length > 0` | 源材料事实不足，例如业务对象、主目标、关键 artifact 或目标路径事实缺失 | 只补 brief 指向的事实；可重新生成 brief；不进入实现 | 是 | 否，除非用户缩小任务为只生成 / 修复 facts |
| `VISUAL_BRIEF_INVALID` | visual-translation-brief | `status=invalid` | schema 非法、artifact ref 非法、关键 artifact 来源冲突或禁止字段出现 | 重建 brief；不要调用 `plan-page-task` | 是 | 否 |
| `HOST_FACTS_BLOCKED` | host-qualification-facts | `status=blocked`、legacy 关键字段未 verified、`automationLevel=manual-observed` | legacy runtime facts 不足或不可证明 | 派生 / 补齐 host facts；不生成页面 | 是 | 否 |
| `HOST_FACTS_INVALID` | host-qualification-facts | `status=invalid` | mode lock 冲突、provenance 非法、runtime contract 引用非法 | 重建 host facts 或恢复 runtime contract 唯一真相 | 是 | 否 |
| `HOST_FACTS_STALE` | host-qualification-facts | `freshness.status=stale` | package、mode lock、translation map、runtime contract、doctor output 或 adapter/archetype 已变化 | 重新派生 host facts；formal 链路不得继续 | 是 | 否 |
| `HOST_FACTS_FRESHNESS_UNKNOWN` | host-qualification-facts | `freshness.status=unknown` | 缺少 hash 或 freshness 无法复核 | 由 `acceptanceProfile` 与计划风险决定：formal 阻断，非 formal 可 warning 或阻断 | 是 | 视 `acceptanceProfile` 而定 |

`pre-plan-facts` blocked 时不得调用 `plan-page-task`。唯一例外是用户明确把任务缩小为“只生成 / 修复 brief 或 host facts”。
