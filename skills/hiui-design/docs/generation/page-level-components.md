# Page-Level Components

本文定义 `hiui-design` 页面级组件策略。页面级组件不是新的页面规范，而是普通典型页在某个接入模式下的可运行实现层；数据可视化等分析型页面不走 `page-component-only`，而走 `managed-analytics`。

## 分层关系

```text
HiUI Typical Standard -> PageType -> ManagedMold -> Adapter/Carrier Proof -> Certified PageComponent -> RuntimeBridgeProfile(optional) -> Business PageInstance
```

- `PageType` 定义页面身份，事实源是 `rules/common.page-types.json`。
- `ManagedMold` 定义锁定区域、可编辑槽位和自由 scaffold 禁用策略，事实源是 `rules/page-mold-registry.json`。
- `Adapter` 定义宿主承接能力，事实源是 `rules/adapter-registry.json`。
- `PageComponent` 只实现 `baseMoldId`，不得重新定义 `lockedRegions` 或 `editableSlots`。
- `PageComponent` 的实现可以来自 direct standard shell，也可以来自 project-certified carrier；
  只要认证结果等价，它们在页面语义上都属于 `page-component`。
- `RuntimeBridgeProfile` 只在 legacy `page-component` 路径附加出现，事实源是
  `rules/runtime-bridged-component-matrix.json`；它只定义 bridge profile、runtime shell
  来源与薄桥层职责，不重定义模具、slot、ownership 或实例验收事实。
- `PageInstance` 只能填业务槽位和受控扩展，不得改写锁定 region。
- `DataVisualization` 只可复用页面组件的承载层，图表表达必须由 `chartUsageContract`、数据可视化 token 与图表组件规则决定。

## 适用边界

| generationStrategy | 适用页面 | 页面组件角色 |
| --- | --- | --- |
| `page-component` | 数据统计表、普通表格、树形表格、左树右表、异常反馈、抽屉表单 / 详情、全页编辑 / 详情 | 主生成资产 |
| `controlled-extension` | 在普通典型页基础上做轻量二次改造 | 主生成资产 + 受控扩展 |
| `managed-analytics` | 数据可视化、复杂指标分析、多图表 + 明细表 | 只承接页头、白底主体、指标区、图表区、明细表区等容器结构 |
| `managed-fallback` | 组件缺失、结构升级、特殊宿主约束 | 作为候选资产之一；不足时回到 mold / adapter / archetype |
| `non-typical` | 真非典型 / 组合页 / 自定义工作台 | 不作为默认入口 |

## 模式策略

| mode | component form | 用途 |
| --- | --- | --- |
| `host-integration` | standard page component | 直接承接标准页壳和标准组件能力，并可安装示例 gallery / smoke baseline |
| `rules-only` | standard page component（通过 `supportedModes` 复用） | 不接入示例 gallery，但业务页面生成仍优先使用已认证页面级组件 |
| `legacy-host-compatible` | project-certified carrier page component first; direct standard component only when runtime equivalence is proven | 旧宿主桥接接入；面向人类可解释为 `runtime-bridged-page-component`，但归一后仍是 `page-component` 主链路。页面组件仍作为完整右侧内容区主资产，adapter 只证明旧宿主运行时边界可承接，不做组件翻译 |

`rules-only` 不是“无组件模式”。它与 `host-integration` 的主要区别是接入方式：`rules-only` 不把 host 示例页作为项目运行入口，不安装示例 gallery；但只要组件在 `supportedModes` 中声明支持 `rules-only`，并且认证 artifact 与组件的 canonical `mode` / `baseMoldId` 匹配，`plan-page-task` 就可以把它作为主生成资产。只有宿主约束要求额外 adapter 或 legacy 兼容时，才需要单独的 host-adapted / legacy-compatible component。

对 `rules-only` / `host-integration` 而言，标准页面级组件是否 ready 属于 planner 的资产解析结果，不属于项目接入 readiness。接入阶段负责证明项目具备运行时 / 依赖 / 宿主前提；页面阶段再判断当前页型是否能命中 `page-component + slot-fill`。

`legacy-host-compatible` 也不是“无组件模式”。它的人类解释统一为“旧宿主桥接接入模式”。这里的 `compatible` 只表示宿主边界与运行时契约可被桥接和证明，不表示任意旧宿主天然兼容，也不表示只要能挂载就已经进入受管生成 / 交付状态。它与 `rules-only` 的区别是旧宿主运行时、全局样式、portal、路由和权限接法不可直接等同于标准宿主；因此 legacy 的主路径应优先选择 **project-certified carrier implementation of page-component**。只有当宿主已经证明可直接等价承载 standard component 的运行时契约时，才直接使用 standard certified page component。旧宿主只保留全局导航、左侧菜单、路由入口和干净内容挂载点；组件内部的页头、筛选、白底主体、表格 / 表单 / 详情、分页 / 底栏和主滚动链不再拆给宿主逐项承接。这里的宿主边界证明应在项目接入 / capabilities 阶段完成，页面生成阶段只消费该证明结果；`legacy-host-family-registry.json` 中的 family `status` 是注册表生命周期标签，不是业务页生成期的硬门禁。

`legacy-runtime-adapter` 是运行时转接证明，不是组件翻译器。它只能绑定 request / response / message / i18n / permission / modal / scroll / style 等运行时能力，不得把 `QueryFilter` 翻译成旧 `SearchForm`、把受管表格翻译成旧表格、重做分页区域，或把典型页整体包装成业务页面级组件。`portal-root` 默认视为浮层运行时的常规能力，不进入 runtime bridge 的硬缺口判断；只有宿主显式改写浮层容器或出现裁切风险时，才额外进入 `PortalBoundary` 事实。`host archetype` 与 `reference-or-scaffold` 是 fallback 起点；`translation-map` 是治理增强工件。只有 project-certified carrier 缺失、宿主约束特殊、direct standard component 不可直挂，或 drift 风险需要显式治理时，计划才应进入这些路径。

## Project-Scoped Carrier Overlay

对 legacy 项目，推荐通过 project-scoped overlay 提供 carrier 资产，而不是把项目自己的 carrier 直接登记成 skill 全局 generic 组件名。

- project overlay 的目标是表达“这个项目已经有自己的认证 carrier”，不是新增一套平行页型体系。
- overlay 里的 component 命名应体现项目归属，例如 `<project>.table-basic-carrier.v1`，避免 `legacy-table-basic-page.v1` 这类跨项目泛化命名继续扩散。
- planner 在 legacy 中的优先级应为：
  1. project-certified carrier page component
  2. direct standard certified page component
  3. `host-archetype`
  4. `reference-or-scaffold`
  5. explicit fallback / managed translation
- project overlay 只解决项目级承载差异，不改变 `baseMoldId`、slot 边界、required regions、mandatory components 和 page-instance validation。

## Runtime-Bridged Page Components

`runtime-bridged-page-component` 不是新的 normalized generation family，而是 legacy 中对
`page-component` 的用户可读语义。它只回答“标准页面组件如何通过薄桥层进入旧宿主运行时”，
不回答“页面该按什么页型生成”。

- normalized strategy 继续是 `page-component`；不能因为桥接接入就派生出新的平行主链路。
- 真实交付资产必须是 **selected certified page component** 或 **project-certified carrier**；
  业务页通过标准 slots / Level 1 受控扩展填充业务内容，而不是用 example page 或 host
  look-alike primitives 重新拼一个壳。
- example page、页型专章和示例源码只作为语义与结构参考，不替代运行时主资产。
- runtime shell 的真实来源必须来自被选中组件认证文件里的
  `certificationInputs.componentShell`；禁止在 bridge profile 或业务页里手写猜测 import path。
- bridge wrapper 与 slot adapter 必须保持 thin：前者只绑定宿主 runtime / mount boundary，
  后者只做业务槽位适配；两者都不得接管 `shell`、`white-body`、`main-scroll`、
  `pagination`、`footer` 或 `route owner`。
- 对表格类 `page-component`，`QueryFilter`、`Table` 与 `pagination` 都属于 carrier 内部语义；
  业务页 / bridge slot adapter 只允许填 `queryFields`、表格列、行操作和 Level 1 受控扩展，
  不允许再额外包一层外部样式容器、自由筛选栏，或把 `QueryFilter` 翻译成宿主 `SearchForm`。
- 对 legacy 表格类 bridge，业务页、本地 wrapper 与 slot adapter 还不得再合成第二层
  `white-body shell`、`main-scroll shell`、`pagination shell` 或 `query shell`。这些几何责任必须
  保持在 selected certified page component 或 project-certified carrier 内部。
- 若页面需要 `bodyTopNavigation`、筛选区前提示条或结果工具条，这些能力只能来自 page component
  已声明的标准 slot / Level 1 受控扩展；legacy bridge 不得通过外层 wrapper 把它们提升成新的
  page-level carrier，也不得把主体导航回流到 header region。
- 这类 bridge 规则的唯一真相是 `rules/runtime-bridged-component-matrix.json`；它只补充
  `page-component` 在 legacy 中的交付方式，不复制 `page-component-registry`、mold registry
  或 component certification 已经表达的事实。

## 决策规则

`plan-page-task` 是唯一决策入口。计划只有在满足以下条件时才能选择 `generationStrategy=page-component`：

1. `mode + pageType` 命中 `rules/page-component-registry.json`，或组件的 `supportedModes` 包含当前 `mode`。
2. component `status=certified` 且 certification 未过期。
3. 当前任务只修改 `baseMoldId` 允许的业务槽位，或只使用 Level 1 受控扩展。
4. 不修改 shell、region 层级、white-body、main-scroll、pagination owner 或 route owner。
5. 当前页不是 `data-visualization` 的主分析页；若是数据可视化，必须改走 `generationStrategy=managed-analytics`。
6. 当前模式为 `legacy-host-compatible` 时，必须同时取得 `runtimeAdapterProof.status=available`、`runtimeAdapterProof.kind=legacy-runtime-adapter`、`runtimeAdapterProof.responsibility=runtime-bridge-only`。缺少 request / response / message / i18n / permission / modal / scroll / style 等运行时能力事实时，计划必须 `blocked`，不得自动退回 `managed-fallback` 或自由手写。

不满足时应 fail closed 或回到 `managed-fallback` / `non-typical`，不得回退到空白页手写。

特别说明：legacy 主树不能 ad hoc direct import `@hiui-design/typical-page-shells`，并不等于 `page-component` 主链失效。只要 `runtimeAdapterProof` 已就绪，legacy 普通典型页的默认执行语义仍是 `page-component + runtime bridge + slot fill`；缺少 direct shell import 前提，只能阻止 direct shell mount，不能成为默认改写成兼容手拼页或把 reference 当交付资产的理由。

对 legacy 普通典型页，还应默认收敛为 4 个硬门禁：

1. `mode` 正确。
2. project-level host pack / runtime boundary 已认证。
3. shell ownership 不漂移。
4. 业务页只填标准 slots 或 Level 1 受控扩展。

`styleBoundary`、`portalBoundary`、`runtimeSmoke` 默认作为触发式检查。只有宿主显式声明浮层容器、自定义样式污染风险，或页面命中高风险发布 / 正式验收场景时，才升级为阻断性检查。

## 可用组件清单与认证状态

外部项目接入后，组件可用性必须来自结构化资产接口，而不是 agent 记忆或示例目录扫描：

- `typical-page:capabilities --json` 的 `assets.pageComponents` 列出当前可直接使用的认证页面组件，`assets.pageComponentMatrix` 列出每个组件的 `pageTypeId`、canonical `mode`、`supportedModes`、`available`、`status`、`certificationStatus` 与 `certificationRef`。
- `typical-page:list-assets --type page-components --json` 是完整页面组件目录；只有 `available=true`、`status=certified`、`certificationStatus=certified` 且 `certificationAvailable=true` 的组件可以作为业务页面主生成资产。
- `typical-page:inspect-asset --type page-component --id <componentId> --json` 用于解释单个组件继承的 `baseMoldId`、受控扩展槽位、认证状态和实例验收要求。
- 通过 npm wrapper 做机器读取时使用 `npm run --silent typical-page:capabilities -- --json`；不加 `--silent` 时 npm 会在 stdout 前加脚本 banner，不能直接当纯 JSON 解析。
- `data-visualization` 不进入普通 `page-component` 清单；它的主链路固定为 `managed-analytics`。

当前 `host-integration` / `rules-only` / `legacy-host-compatible` 可复用的已认证普通典型页组件为：`standard-table-stat-page.v1`、`standard-table-basic-page.v1`、`standard-tree-table-page.v1`、`standard-tree-split-page.v1`、`standard-drawer-form-page.v1`、`standard-drawer-detail-page.v1`、`standard-feedback-status-page.v1`、`standard-full-page-edit-page.v1`、`standard-full-page-detail-page.v1`。

在 `legacy-host-compatible` 下，这些 standard 组件不会因为宿主是旧系统而自动降级为 candidate；真正的额外门禁是 `legacyRuntimeAdapterSupport.required=true` 与 `runtimeAdapterProof`。但当项目已经提供 project-scoped certified carrier 时，planner 应优先使用 project carrier，而不是继续选择 generic legacy placeholder 或默认 translation 路径。若 adapter proof 缺失、过期或声明了组件翻译 / region 重实现职责，`plan-page-task` 与 `preflight` 都必须 fail closed。

## 受控扩展

页面组件允许区分四级扩展：

| level | 名称 | 例子 | 链路 |
| --- | --- | --- | --- |
| 0 | 标准槽位 | 标题、筛选项、表格列、按钮、mock、API | 轻量链路 |
| 1 | 受控扩展 | 顶部提示、辅助链接、状态 badge、轻量说明条 | 轻量链路 + extension validation |
| 2 | 结构扩展 | 详情预览区、独立 section、改变主阅读路径 | `managed-fallback` / 增强链路 |
| 3 | 非典型 / 组合页 | split、主从联动、多工作区、自定义 dashboard | non-typical 重流程 |

Level 1 扩展必须声明 `slotId`、目标 `region`、`contentType`、`maxComplexity` 和禁止事项。禁止开放 `children`、`renderAnything`、`customContent` 或 `extraLayout` 这类自由布局入口。

独立图表分析块不直接归入 Level 2 结构扩展；它先归类为 `analytics-extension`，并按图表契约判断：

- 只是局部辅助图表，且落在组件声明的受控扩展位中，可以继续走 `controlled-extension`。
- 形成独立业务分析块、拥有多图表阅读线或影响主体信息架构时，升级为 `managed-analytics`。
- 需要新增第二主工作区、双滚动或自定义 dashboard 时，升级为 `non-typical`。

## 非典型边界

页面组件化不取消非典型页面策略。若扩展改变主阅读路径、新增一级工作区、引入独立查询 / 表格 / 分页 / 滚动，必须升级到 `non-typical` / `composition` 路径。

## 页面实例验收

组件认证只证明资产可靠；每个业务页面实例仍必须检查：

- 使用的 `componentId`、`baseMoldId`、mode 与 pageType 是否匹配。
- required slots 是否填充完整。
- 受控扩展是否落在允许 slot / region 内。
- 是否新增非法 `white-body`、`main-scroll`、pagination / footer owner。
- route、API、permission、i18n 与 runtime render 是否与业务事实一致。
