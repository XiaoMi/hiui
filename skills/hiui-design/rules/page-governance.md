# HiUI Managed Page Governance

本文件是受管页面治理协议的唯一真相。它把页面规范从「agent 自觉遵守」收敛为「事实快照、验收契约、静态门禁、运行时验证和机器报告」的闭环。`SKILL.md` 只引用本文件，不复述细节。

## 治理目标

- 防止手写壳、补 marker、补说明来伪装受管页合规。
- 防止迁移时静默丢失旧页面筛选字段、页头动作、表格列、分页和空态行为。
- 防止裸 `hiui5` primitive 的组件默认值漂移成页面规范缺陷。
- 防止 agent 自由生成 contract / acceptance contract 后自证通过。
- 防止 legacy 项目被一刀切 hard fail。
- 最终完成态只由机器状态决定，不由自然语言解释决定。

## Critical Region Proof

关键 region 的合规性必须由实现事实证明，不能由 `data-hiui5-region`、注释 marker 或 contract 字段单独证明。跨页型 critical region 证明规则见 `critical-region-proof.md`，机器可读能力矩阵维护在 `critical-region-capabilities.json`。

`data-hiui5-region` 只能定位 region；shell、header、white-body、query-filter、table、pagination、detail-body、form-body、drawer-body 等 carrier-critical region 必须由 managed shell、managed component、certified adapter、upstream host carrier 或 governed waiver 证明。hard profile 下 carrier-critical proof 失败必须阻断完成态，并进入 `hiui-page-governance-report.v1` / preflight blocking。普通 `hiui5` primitive 只能作为 leaf component 使用，不能裸承担 carrier-critical region。

### Header Carrier Lock

`header` 是跨页型 carrier-critical region。受管业务页不得通过本地 `createPortal`、页面内 `HeaderPortal / PageHeaderPortal` 变体、可见 DOM wrapper 或 `.hi-v5-page-header*` 样式覆盖来生产页头。页头必须由 managed shell、shared host adapter、upstream host carrier 或登记过的 governed waiver 承接；业务页只能填充标题、返回动作、右侧操作等业务槽位。

硬门槛：

- 页面源码直接导入或调用 `createPortal` 挂载 `PageHeader`，且没有 certified adapter 证明时，P0 失败。
- 页面内定义本地 `*HeaderPortal` / `*PageHeaderPortal` 组件作为页头 carrier，P0 失败。
- 页面样式覆盖 `PageHeader` 根布局、高度、padding、`align-items` 或 `.hi-v5-page-header*` 骨架，P0 失败。
- 若现有示例 / adapter 无法承接页头，生成流程必须阻断并要求先补 adapter，而不是在业务页手写页头。

### Header Layout Lock

`header` 的 carrier proof 只有在 layout 事实也成立时才完整。对声明了 `header` region
或把页级动作绑定到 `PageHeader extra` 的页面，必须同时证明 `PageHeader` root stretch、
`extra` right-docked 和 `60px` 节奏 owner 没有漂移。仅“用了共享页头组件”或“按钮还在页头区域”
都不足以通过。legacy 普通典型页是否把这条约束计入生成阶段硬门禁，由
`rules/legacy-host-hard-gates.json` 统一编排；本文件只定义一旦命中该门禁后的 P0 失败语义。

硬门槛：

- contract 命中 `header` region 但缺少 `headerLayoutContract`，P0 失败。
- shared shell / host slot / certified page component 无法证明 `PageHeader` root 获得 `width: 100%`
  或等价 stretch 事实时，P0 失败。
- `PageHeader extra` 仍在 header 区，但没有停靠到同一 carrier 的右边界，或被 wrapper 改造成标题旁
  inline group 时，P0 失败。
- `60px` 页头节奏被业务页、本地 wrapper、`PageHeader` 根节点或按钮高度重新承接时，P0 失败。
- header layout proof 只存在说明文档、截图或自然语言解释里，而没有 contract / certification /
  host facts / runtime smoke 证据时，P0 失败。

### Non-typical Strategy Proof

非典型 / overlay 页面不得只靠 `topology=non-typical-overlay` 或注释 marker 自证。它必须在计划、contract、源码 marker 与运行时 marker 中保持同一套 `layout strategy` / `layout archetype` / `non-typical scope` / `composition guardrails` / `strategy evidence`。

硬门槛：

- 进入非典型路径但缺少 `layout strategy` 或 `layout archetype`，P0 失败或回到计划阶段补事实。
- contract 声明非典型，但源码和运行时没有策略证据，P1/P0 按 page profile 阻断。
- 结果退化成普通详情字段分组且缺少策略证据时，不得以“已使用典型页壳”作为完成态依据。

### Upgrade Preservation Guard

页面升级、迁移、重写与旧系统现代化默认属于 preservation-first 任务。除非用户需求、`page-acceptance-contract.v1`、formal 评审结论或带 provenance 的显式 override 允许偏离，否则当前页必须保持原有功能集合、关键区块、关键业务动作、逻辑、接口、字段映射与统计口径不变。

这里的“保持”指：

- 不删除原有功能入口、关键区块、关键业务动作或关键结果表达。
- 不通过默认折叠、隐藏、抽屉迁移、二级页迁移或视觉弱化形成 `silent degradation`。
- 不修改查询 / 提交 / 计算 / 权限 / 状态流转 / 分页 / 导出等业务逻辑语义。
- 不修改接口地址、请求参数、返回字段消费方式、字段映射或统计口径。
- 不在未审批前调整一级分组、阅读顺序、主辅关系或页面工作区拓扑。

硬门槛：

- 升级任务若删除原有关键功能、关键区块或关键业务动作，且缺少带 provenance 的批准记录，P0 失败。
- 升级任务若修改业务逻辑、接口、字段映射或统计口径，且缺少显式批准与 contract 证据，P0 失败。
- 升级任务若发生未审批的一级结构重排、阅读顺序变化、主辅关系变化或页型退化，P0/P1 按 page profile 阻断。
- 任何把页面升级任务演变成产品改版、信息架构重做或功能裁剪的实现，都不得以“视觉规范化”解释为通过。

### Content Integrity Guard

受管页面不仅要“能渲染”，还要保持内容、语义和运行时几何的完整性。任何 `looks right but works wrong`、`内容还在但阅读关系已失真`、或 `runtime 可用但语义错位` 的结果，都不属于通过态。

默认要求：

- 标题、摘要、图表、图例、字段、状态、操作对象与业务语义保持正确对应。
- 文本、表格、图表、抽屉、弹窗、浮层与固定区不得出现溢出、裁切、遮挡或宿主层级误裁。
- 页面不得出现双主滚动、双白底主体、第二层页面级 surface、owner 漂移或 page shell 职责混乱。
- 页面不得通过局部补样式掩盖关键语义错误、阅读路径断裂或交互锚点漂移。

硬门槛：

- 页面出现标题内容错配、图表图例错配、状态语义错配、按钮对象错配或其它关键内容错乱时，P0 失败。
- 页面出现文本溢出不可读、关键内容裁切、浮层被宿主裁切、关键操作被遮挡、表格关键列不可用或图表主体越界时，P0/P1 按 page profile 阻断。
- `white-body / outer-padding / main-scroll` owner 不唯一、双主滚动、双白底或 page shell geometry 漂移时，不得进入完成态。

### Visual Restraint Baseline

所有受管 HiUI 页面默认保持克制、语义优先的视觉基线。无业务语义、无规范依据的额外视觉装饰不得成为页面层级、状态、强调或“升级质感”的替代手段。

默认禁止：

- 多余投影、重阴影、发光、光晕、纹理、装饰性背景图形、非语义色块与纯视觉 filler。
- 无规范依据的渐变背景、渐变描边、渐变按钮、渐变选中态或渐变统计卡。
- 通过彩色蒙层、装饰性描边强化或多层 surface 装饰伪造层级感。
- 把装饰性视觉效果当成状态语义、主次层级、风险表达或选中表达的主手段。

允许偏离的唯一来源：

- 页型专章明确要求。
- 设计 brief / 视觉输入明确要求。
- 认证组件语义自带的必要视觉层级，例如浮层、弹窗、下拉等受控容器。
- 有 owner、scope、expiry 的显式 governed waiver。

硬门槛：

- 页面若新增无业务语义、无规则依据的额外投影、渐变、发光、装饰性背景或纯视觉 filler，P1/P0 按 page profile 阻断。
- 页面对层级、状态、风险或选中态的表达若主要依赖未批准的装饰效果，而不是既有语义组件、token 与结构关系，不得进入完成态。

## 分层流程

```text
Plan Gateway
  -> Page Registry
  -> Source Snapshot
  -> Acceptance Contract
  -> Shell Carrier Registry
  -> Managed Components / Adapter
  -> Page Contract
  -> Static Governance
  -> Preflight
  -> Runtime Governance
  -> Final Report Renderer
  -> CI Gate
```

## Page Profiles

所有 guard 必须先解析 page profile，再决定 warning / blocking。不得对 legacy 项目全量一刀切 hard fail。

| Profile | 适用页面 | 默认策略 |
| --- | --- | --- |
| `report-only` | 历史未受管页面、全量扫描 | 只报告，不阻断 |
| `new-managed` | 新增受管页 | P0/P1 hard fail |
| `migration` | 正在迁移或重架构的业务页 | P0 hard fail，P1/P2 按 rollout；legacy exception 必须有 owner + expiry |
| `managed` | 已登记受管页 | P0/P1 hard fail |
| `release` | 发布 / 正式验收 | P0/P1/P2 hard fail，runtime smoke required |

## P0 Hard Gates

### Machine Status Lock

- `page-task-plan.v1.status=blocked`：只能补事实，不得实现。
- `page-task-plan.v1.status=invalid`：停止。
- `preflight-report.v1.status=failed`：最终回复不得输出完成态。
- `final-page-report.v1` 只能读取机器状态；agent 不得用自然语言把失败解释为通过。

### Page Contract

受管页必须存在 page contract，且至少包含：

- `pageType`
- `mode`
- `generationProfile`：记录 `moldId`、`startFrom`、`lockedRegions`、`editableSlots`、`slotManifest`、`requiredGates`、`fallback`、`sourceProofLevel`
- `productionContract`：`page-production-contract.v1`，镜像关键 `generationProfile` 字段，声明本页只能从受管模具生成并填业务槽位
- `regionMapping`
- `ownershipMapping`
- `headerLayoutContract`（当 contract 声明 `header` region，或页级动作 owner 为 `PageHeader extra` 时）
- `sourceSnapshotHash`

`generationProfile` 是“生成前约束 + 生成中模具 + 生成后兜底检查”的交接凭证。页面不得先自由手写，再在 contract 中补写该字段；`preflight` 必须校验该字段存在且与 `archetypeMode` 一致。

`productionContract` 是面向交付链路的机器凭证。它不替代 `generationProfile`，而是把本次页面生产策略固化为 preflight / final report / CI 都能读取的 contract；缺失、与 `generationProfile` 不一致或策略不是 `generate-from-managed-mold-and-fill-business-slots-only` 时必须 fail closed。

最终报告必须把该凭证汇总为 `productionLine`：至少展示 `status`、`policy`、`moldId`、`startFrom`、`requiredGates` 和相关 blocking issue。设计 / 产品同学不应通过阅读 source guard 日志来判断页面是否按生产线生成。

源码变更后，contract hash 必须刷新；hash 不匹配时阻断完成态。

### Source Snapshot

迁移页和重架构页必须先生成 `pre-migration-snapshot.v1`，再进入 `GenerateOrEdit`。snapshot 必须由脚本或工具从旧页面 / 旧源码 / 旧 URL 提取，不能由 agent 手写。

置信度规则：

| Confidence | 策略 |
| --- | --- |
| `high` | 可进入改造 |
| `medium` | 需要补事实；不得覆盖已提取事实 |
| `low` | 阻断改造 |
| `invalid` | 停止并重建 snapshot |

最小 schema：

```json
{
  "schemaVersion": "pre-migration-snapshot.v1",
  "page": "src/views/divide-management/divide-query/index.tsx",
  "sourceHash": "sha256:...",
  "confidence": "high",
  "facts": {
    "filters": {
      "inlineFields": ["engineer", "serviceType"],
      "actions": ["query", "reset"]
    },
    "headerActions": [
      { "id": "export", "label": "导出表单", "observedPosition": "header-right" }
    ],
    "table": {
      "columns": ["divideOrderNo", "tradeUpayNo"],
      "pagination": "inside-table-workspace"
    },
    "layout": {
      "emptyState": "inside-table-body",
      "paginationDocking": "bottom"
    }
  },
  "unresolved": []
}
```

### Acceptance Contract

迁移页必须有 `page-acceptance-contract.v1`。它合并 `sourceSnapshot`、用户明确要求、`pageType` baseline 和 page contract，用来约束页面专属验收。

规则：

- 每条 blocking requirement 必须有 `provenance`。
- 没有 provenance 的 requirement 只能 warning，不能 hard fail。
- `sourceSnapshot` 事实不能被 agent 覆盖，只能追加解释或提交人工 override。
- 用户明确要求优先级高于 pageType 默认规则。

示例：

```json
{
  "schemaVersion": "page-acceptance-contract.v1",
  "page": "src/views/divide-management/divide-query/index.tsx",
  "refs": {
    "sourceSnapshot": ".local-context/hiui-design/outputs/snapshots/divide-query.pre.json",
    "pageContract": ".local-context/hiui-design/outputs/page-contracts/src__views__divide-management__divide-query__index.json"
  },
  "requirements": [
    {
      "id": "filters.inline.required",
      "type": "query-filter",
      "value": ["engineer", "serviceType", "dateRange"],
      "provenance": ["sourceSnapshot", "userRequirement"],
      "severity": "blocking"
    },
    {
      "id": "header.export.slot",
      "type": "header-action",
      "value": { "slot": "page-header-right", "size": "md" },
      "provenance": ["sourceSnapshot", "userRequirement"],
      "severity": "blocking"
    }
  ]
}
```

## P0-B New / Migration Gates

### Shell Carrier Registry

典型页 shell 继承必须可由 registry + AST 证明。注释 marker 与 `data-hiui5-shell` 只能作为辅助证据，不能单独通过。

示例 registry entry：

```json
{
  "name": "ServiceOperationsTablePageFrame",
  "path": "src/typical-page-reuse/components/ServiceOperationsTablePageFrame.tsx",
  "supports": ["table-basic", "table-stat"],
  "regions": ["header", "white-body", "query-filter", "table", "pagination"],
  "ownership": ["content-slot", "white-body", "outer-padding", "main-scroll"]
}
```

禁止模式：手写 `div + h1 + QueryFilter + Table + Pagination` 后补 `hiui-design shell: TablePageFrame`。

同样禁止以下伪合规模式：

- 在业务页中把标准 shell 名称声明为普通 DOM / 字符串别名（例如 `TablePageFrame = 'div'`）。
- 挂载 `style={{ display: 'none' }}`、`hidden`、`aria-hidden` 或同类隐藏标准壳作为检查证据。
- 只靠注释、`data-hiui5-shell`、`data-hiui5-region` 或 contract 字段证明关键 region，真实页面仍由 page-local primitives 承担。
- `hostArchetypePath` / provenance 指向当前生成页本身，形成 contract 自证。

### Managed Components / Adapter

`hiui5` 是底层组件库，可以在 adapter / managed components / shell carrier 内部使用。受管页面不得裸用 `hiui5` primitive 承担 shell、header、white-body、query-filter、table、pagination 等关键 region 职责。

合法 adapter 必须满足：

- 内部 import `hiui5`。
- 导出 `Managed*` 组件，而不是纯 re-export。
- 注入规范默认值。
- 不承担 shell / header / white-body / main-scroll owner。
- `localBypass` 与 AST 使用位置一致。
- `hostAdapterId` 必须登记在 `rules/adapter-registry.json`；`localBypass.ownerContainment` 必须落在该 adapter 允许的 containment 内。

最小行为：

```tsx
function ManagedTable(props) {
  return <Table bordered={false} striped={false} resizable setting {...props} />
}

function ManagedSearchInput(props) {
  return <SearchInput appearance="filled" {...props} />
}

function ManagedPageHeader(props) {
  return <PageHeader actionSlot="right" actionSize="md" {...props} />
}
```

强制 baseline 不得被业务 props 关闭；需要覆盖时必须 contract 记录 exception、owner、expiry。

## Static Governance

推荐由统一执行器调度各子 guard：

```bash
npm run typical-page:guard -- --page <page> --profile migration --json
```

子检查：

- `source-snapshot-check`
- `acceptance-contract-check`
- `contract-guard`
- `header-layout-contract-check`
- `shell-guard`
- `adapter-guard`
- `query-filter-guard`
- `header-action-guard`
- `header-layout-guard`
- `layout-guard`
- `i18n-guard`
- `preflight-status-check`
- `runtime-smoke-status-check`

### Guard Report

所有 guard 必须输出结构化 JSON，CI 和 final report 只读 JSON，不解析自然语言日志。

```json
{
  "schemaVersion": "hiui-page-governance-report.v1",
  "status": "failed",
  "profile": "migration",
  "page": "src/views/divide-management/divide-query/index.tsx",
  "summary": { "blocking": 2, "warning": 3, "info": 1 },
  "checks": [
    {
      "id": "HIUI005_QUERY_FILTER_FIELD_LOST",
      "severity": "blocking",
      "message": "Required inline filters are missing.",
      "evidence": {
        "expected": ["tradeUpayNo", "serviceNo"],
        "actual": ["engineer", "serviceType"]
      },
      "provenance": ["sourceSnapshot", "acceptanceContract"],
      "suggestedFix": "Restore inline fields or update acceptance contract with approved migration reason.",
      "exceptionAllowed": false
    }
  ]
}
```

### Error Codes

- `HIUI001_DIRECT_UI_PRIMITIVE_FOR_REGION`
- `HIUI002_MISSING_CONTRACT`
- `HIUI003_CONTRACT_HASH_MISMATCH`
- `HIUI004_FAKE_SHELL_MARKER`
- `HIUI005_QUERY_FILTER_FIELD_LOST`
- `HIUI006_PAGINATION_DRIFT`
- `HIUI007_WHITE_BODY_DOUBLE_OWNER`
- `HIUI008_HEADER_ACTION_SLOT_INVALID`
- `HIUI009_TABLE_BASELINE_MISSING`
- `HIUI010_ADAPTER_SCHEMA_INVALID`
- `HIUI011_I18N_HARDCODED_COPY`
- `HIUI012_RUNTIME_SMOKE_FAILED`
- `HIUI013_MISSING_SOURCE_SNAPSHOT`
- `HIUI014_ACCEPTANCE_CONTRACT_MISSING`
- `HIUI015_SOURCE_CAPABILITY_REGRESSION`
- `HIUI016_LOW_CONFIDENCE_SNAPSHOT`
- `HIUI017_REQUIREMENT_WITHOUT_PROVENANCE`

## Runtime Governance

Runtime smoke 优先使用 DOM / layout relationship assertions，截图只作为辅助证据。必须区分环境失败和页面失败。

默认 rollout：

| Profile | Runtime smoke 策略 |
| --- | --- |
| `report-only` | warning |
| `migration` | warning，formal / release 时 hard fail |
| `new-managed` | merge 前 required |
| `release` | hard fail |

典型断言：筛选字段真实可见、搜索框灰底、页头按钮右侧和 `md` 尺寸、空态与分页距离、pagination bottom-docked、表格横向滚动不破坏布局。

## I18n Rollout

| 页面类型 | 策略 |
| --- | --- |
| `legacy-unmanaged` | report-only |
| `migration-in-progress` | warning + expiry exception |
| `new-managed` | new copy hard fail |
| `registered-managed` | rollout profile 控制 warning / hard fail |

## DivideQuery 防护示例

分账单查询这类迁移页必须：

- 改造前生成 source snapshot，记录 8 个筛选字段、导出按钮、表格列、分页位置和空态位置。
- acceptance contract 声明 8 个筛选字段行内可见、米聊号灰底、导出按钮在页头右侧且 `md`、表格 baseline、空态分页距离阈值。
- `query-filter-guard` 防字段丢失。
- `header-action-guard` 防按钮错位。
- `layout-guard` 防大空白和分页漂移。
- `runtime-smoke` 验证真实页面。

任何 blocking failed，final report 都不能输出完成态。
