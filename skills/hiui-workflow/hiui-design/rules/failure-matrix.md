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
| `PROJECT_INTEGRATION_INCOMPLETE` | plan | `facts.projectIntegration.integrationReady=false`，或 `blockingReasons` 明确提示 `project integration is incomplete` | 项目级接入事实未完成，不能把页面任务当成接入补丁入口 | 先执行 `bootstrap-target-project.mjs --target <project-root> --mode <mode>` 修复项目接入，再重新运行 plan | 部分 | 是 |
| `MISSING_PAGE_TYPE` | plan | `blockingReasons` 包含 `missing pageType` | 页面类型未解析，不能直接当作非典型页处理 | 让用户确认页型，或补充需求后重新运行 plan | 否 | 是 |
| `LEGACY_CARRIER_CERTIFICATION_REQUIRED` | plan | `legacy-host-compatible` 命中 `carrier-first-required` 页型，且 planner 只找到 `direct-standard-component`，没有 ready 的 project-certified carrier | 当前 legacy 页型必须先完成项目级 carrier 承接认证，页面任务不能再继续生成或直接小改 | 先执行 `bootstrap-target-project.mjs --target <project-root> --mode legacy-host-compatible`，补齐 / 认证项目级 carrier 后再重新运行 plan | 部分 | 是 |
| `RUNTIME_BRIDGE_PROFILE_MISSING` | plan | legacy `page-component` 需要 runtime bridge，但 `runtimeBridgeProfile` 缺失或 `rules/runtime-bridged-component-matrix.json` 未命中 | 缺少 legacy 桥接页面组件的结构化 bridge profile，不能安全进入主链路 | 补齐 bridge profile，或显式退回合法 fallback | 部分 | 是 |
| `RUNTIME_BRIDGE_SOURCE_UNRESOLVED` | plan | 选中的 runtime bridge profile 无法从 certification 解析 `certificationInputs.componentShell` | 无法确认真正的运行时页壳来源，不能生成 thin bridge 代码 | 修复 certification / profile 关联，或改用 project-certified carrier | 部分 | 是 |
| `MANAGED_DELIVERY_PATH_DOWNGRADED` | preflight/governance | planner / contract 已锁定 `generationStrategy=page-component`、`startFrom=page-component`，且 legacy `runtimeAdapterProof.status=available` / `generationProfile.runtimeBridgeStatus=available`，但实际源码回退成 compatibility 手写页、reference 默认页、自由 scaffold，或缺少 runtime bridge / slot adapter / selected component 证明 | 计划已经证明应该交付受管页面组件主链，但实现偷偷降级成了非受管交付物 | 回到 `start-page` / contract 选定的 page-component 主链，恢复 runtime bridge shell、slot adapter、selected component 与 source markers；若确需 fallback，必须先重新执行 `plan-page-task` 并拿到显式 fallback 计划 | 部分 | 是 |
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
| `HIUI026_QUERY_FILTER_ROLE_DRIFT` | governance/preflight/runtime | 表格类页型把 `semanticContract.queryFilterRegionRole=table-query-filter` 漂移成 dashboard control strip、`SearchForm`、自由表单栅格或其它非真实 `QueryFilter` 语义；或数据可视化页在未显式改 contract 时反向漂移成真实列表筛选 | 筛选语义漂移会直接带来标签回流、控件节奏失真、`全部筛选/清空` 行为异常，常见表象就是筛选区域错乱或出现大段空隙 | 先回到 planner 的 `generationInputs.fastPathSummary.queryFilterPolicy`、`start-page` scaffold 和 `docs/generation/figma-pages/table-shared.md` 恢复真实 `QueryFilter` carrier；不要先打补丁 CSS 或顺势改成控制条 | 部分 | 是 |
| `HIUI027_TABLE_CARRIER_WRAPPER_DRIFT` | governance/preflight/runtime | 表格类页面或 project carrier 在 `QueryFilter` / `Table` / `pagination` 外额外引入 wrapper、padding、stretch、scroll owner 或样式覆写，导致白底主体、筛选区、表格区、分页区不再同属一个受管 shell 链 | 表格主体与搜索/分页之间出现异常空隙，通常说明外部 wrapper 抢走了 `pageShellPolicy` 对应的 ownership，而不是单纯 spacing 数值有误 | 回到 planner 的 `generationInputs.fastPathSummary.pageShellPolicy` 和 page-component / shell carrier 契约，收回 `white-body`、`query-filter`、`table`、`pagination` 到同一个受管壳；移除外部 style override / stretch wrapper | 部分 | 是 |
| `HIUI005_QUERY_FILTER_FIELD_LOST` | governance | acceptance contract / source snapshot 要求的筛选字段在行内或抽屉中缺失 | 页面迁移丢失筛选能力或错误迁移字段位置 | 恢复字段，或用带 provenance 的 acceptance contract 说明迁移原因 | 部分 | 是 |
| `HIUI022_MANAGED_FILTER_CHAIN_MISSING` | governance/preflight | contract 要求 `query-filter` region，但源码没有真实 `QueryFilter` / 认可 host search shell 语义，或退回 `searchConfig.fields`、`SearchForm`、`getSearchFields`、手写 primitive 筛选栏 | 页面看起来还有搜索区，但已经脱离受管 `QueryFilter / FilterDrawer` 链路 | 恢复真实 `QueryFilter / FilterDrawer` 或认可的 host search shell；只有页面语义真的改变时才允许重写 contract | 部分 | 是 |
| `HIUI023_QUERY_FILTER_BASELINE_DRIFT` | governance/preflight/runtime | 行内 `QueryFilter` 打开 `showLabel`、偏离 contained baseline、关键词搜索退化成裸 `Input`、追加第二个“查询 / 重置”按钮，或“全部筛选”退回普通 `Button` | 筛选链路还在，但已偏离典型列表的受管基线，后续极易继续产生灰底丢失、节奏错位和操作重复 | 收回 no-label / contained / filled baseline，移除手工按钮，恢复 `FilterButton` / `FilterDrawer` 语义 | 部分 | 是 |
| `HIUI024_HOST_STYLE_CONTAMINATION` | governance/preflight/runtime | 页面本地样式、slot override 或 `.hi-v5-*` 选择器触达 `PageHeader`、`QueryFilter`、`Table` 等公共组件骨架 | 外部 / 本地样式污染了受管组件内部骨架，页头宽度、筛选灰底、按钮停靠或表格节奏都可能被静默挤坏 | 移除页面级骨架覆写，把几何、颜色和节奏责任收回 shared carrier / token bridge | 部分 | 是 |
| `HIUI025_LIST_WORKSPACE_WIDTH_OWNER_DRIFT` | governance/preflight/runtime | `outer-padding`、`white-body`、`main-scroll`、`table` region 或 project-certified carrier 抢占横向滚动，或使用 `max-content / min-content / fit-content` 等内容宽度策略 | 列表工作区不再随父容器自适应，筛选 / 表格容易被撑破或出现外层横向滚动 | 把横向滚动收回内层表格 wrapper，补 `min-width: 0` / `min-inline-size: 0` 等约束，让工作区回到 width-adaptive 链路 | 部分 | 是 |
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
   若命中 `PROJECT_INTEGRATION_INCOMPLETE` 或 `LEGACY_CARRIER_CERTIFICATION_REQUIRED`，默认动作是 `ResolveBlockingFacts`，优先修复项目接入 / project-certified carrier，不要继续执行页面实现命令。
   若同时命中 route ownership 等页面级 blocker，planner 的 `currentExecutionState` / `requiredCommands` 必须把项目级 blocker 排在前面；不得只暴露 `resolve-business-route-target` 而隐藏 `bootstrap-target-project`。
3. `CONTRACT_PAGE_TYPE_MISMATCH` / `PAGE_TYPE_MIGRATION_CONTRACT_STALE`：优先执行 `write-contract-standard`，不要按旧页型逐条修源码。
4. preflight `warnings[]` 不改变顶层 `status`，但 final report 必须展示。
5. hard profile 下 governance `blocking` 必须阻断完成态；`report-only` profile 的 blocking 只能进入风险报告，不得描述为已修复。
6. usage stats 失败不默认推翻页面状态，但不能静默吞掉。
7. 命中 `HIUI026_QUERY_FILTER_ROLE_DRIFT` / `HIUI027_TABLE_CARRIER_WRAPPER_DRIFT` 时，优先修 planner / scaffold / carrier 事实源；不要先在业务页追加局部 CSS、空白占位或外层 wrapper 作为“临时修复”。

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
