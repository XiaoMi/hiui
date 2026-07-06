# Component Certification

页面组件认证用于把典型页结构验收从每个业务页前移到低频资产阶段。它只能证明组件资产可靠，不能证明某个业务页面实例正确；业务页面生成阶段只做 `ComponentAvailabilityGate`，不得临时重做组件认证。

## 认证对象

认证对象是 `rules/page-component-registry.json` 中的 `componentId`。认证必须引用：

- `baseMoldId`
- component template digest
- adapter digest 列表
- runtime profile
- visual preview / runtime smoke 证据

当 mold、adapter、component template 或 runtime profile 任一变化时，认证必须视为过期。

`legacy-host-compatible`（旧宿主桥接接入模式）不再要求维护一套单独的 legacy 页面组件认证。这里的 `compatible` 只表示宿主边界与运行时契约可以被桥接和证明，不表示任意旧宿主天然兼容，也不表示挂载成功就等于进入受管 ready。standard 页面组件可以通过 `supportedModes` 声明支持 legacy；额外认证对象是 `legacy-runtime-adapter` proof，用来证明旧宿主边界已经提供 `CleanContentMount`、`RuntimeBridge`、`StyleBoundary`、`PortalBoundary` 与 request / response / message / i18n / permission / modal / scroll / style 等运行时绑定能力。`portal-root` 默认不作为 runtime bridge 的硬必需项；只有宿主显式声明自定义浮层容器或存在裁切风险时，才要求额外的 portal boundary 事实。

## 职责边界

| 阶段 | 责任 | 输出 |
| --- | --- | --- |
| 资产维护 / 规则调试 | 认证组件结构、槽位、adapter、runtime 与预览证据 | certification artifact + registry available 状态 |
| 业务页面生成 | 只确认组件在可用目录中，且 mode / pageType / baseMoldId 匹配 | `ComponentAvailabilityGate` passed / blocked |
| 业务实例验收 | 验证本次业务填充、受控扩展、路由、权限、API、i18n、runtime render | `page-instance-validation.v1` |

候选、规划中、过期或 blocked 的组件只能出现在维护者诊断视图，不能作为业务页面生成候选。

## 认证状态判定

业务页面生成阶段只能把同时满足下列条件的组件视为可用：

1. `rules/page-component-registry.json` 中 `status=certified`。
2. `certificationStatus=certified`。
3. `certificationRef` 指向 skill 根目录内的认证工件。
4. 认证工件存在，且 `schemaVersion=page-component-certification.v1`、`status=certified`、`componentId`、`baseMoldId`、mode 与注册表一致。

`mode` 是组件认证来源的 canonical mode；业务计划中的当前模式还必须命中组件的 `supportedModes`。例如标准页面级组件的认证来源可以是 `host-integration`，同时通过 `supportedModes=["host-integration","rules-only"]` 声明可用于 `rules-only`。如果当前模式不在 `supportedModes` 中，即使认证工件存在，也不得把组件作为主生成资产。

当当前模式为 `legacy-host-compatible` 时，还必须满足 runtime adapter proof 门禁：`runtimeAdapterProof.status=available`、`kind=legacy-runtime-adapter`、`responsibility=runtime-bridge-only`，且所需运行时能力没有缺口。`CleanContentMount` 优先由项目接入 / capabilities 自动读取业务页根目录和 Module Federation remote `exposes` 推断；推断通过时不需要通过改造某个页面再证明内容区独立。runtime bridge 能力也必须在项目接入 / capabilities 阶段自动扫描并输出 `legacyHostFamily.inferredFacts.runtimeBridge`；业务页计划只消费该扫描结果，不能在页面阶段重新泛化追问。只有组件认证和 runtime adapter proof 同时通过，业务页计划才允许选择 `generationStrategy=page-component`；缺少 proof 时必须 blocked，不得回退到组件翻译或自由手写。family registry 的 `status=planned|certified|...` 仅表示宿主族规则包自身的维护生命周期，不替代也不覆盖项目接入期已经产出的宿主边界证明。`portal-root` 默认不进入这组 runtime bridge 硬缺口；若宿主自定义 popup container 或明确存在 overflow / z-index 裁切风险，再通过 `PortalBoundary` 补事实。

对外可读的认证状态由 `typical-page:capabilities --json`、`typical-page:list-assets --type page-components --json` 与 `typical-page:inspect-asset --type page-component --id <componentId> --json` 暴露；这些接口只提供 facts，不能替代 `page-task-plan.v1` 或业务实例验收。

## 资产级检查

- required regions 完整。
- locked regions 不可由业务实例改写。
- allowed slots 和 controlled extensions 可验证。
- adapter / shell carrier 可证明。
- white-body / main-scroll / pagination ownership 正确。
- source marker / contract marker 可由组件稳定暴露。
- visual preview 与 runtime smoke 通过或明确 blocked。

### Legacy runtime adapter 额外检查

- `CleanContentMount` 证明旧宿主只提供干净内容挂载点，不重复提供页头、白底主体、分页 owner 或页面主滚动。
- `RuntimeAdapter` 证明路由、权限、请求、字典、主题和用户能力通过显式 props / provider 注入，而不是页面组件读取项目全局变量。
- `RuntimeBridge` 证明 request、auth、permission、user、route-navigation、theme 可用且来源可追踪；`dictionary / i18n` 只在项目明确要求国际化时作为可选桥接能力补证。
- `StyleBoundary` 证明旧宿主全局 CSS 不会破坏页面组件的表格、分页、表单、抽屉、状态标签和间距。
- `PortalBoundary` 证明下拉、气泡、弹窗、抽屉等浮层挂载位置和层级不会被裁切；若宿主未显式改写浮层容器，则允许沿用组件库默认挂载能力。
- `AdapterRegistry` 证明 adapter 只做 runtime bridge，禁止 `translate-hiui-components-to-legacy-components`、`replace-query-filter-with-legacy-form`、`replace-managed-table-with-legacy-table`、`reimplement-pagination-region` 或 `wrap-typical-page-as-business-page-component`。

## 实例级检查

业务页仍必须运行 `page-instance-validation.v1`：

- 是否使用 available certified page component。
- required slots 是否完整。
- extension slots 是否合法。
- locked regions 是否未被覆盖。
- route owner / permission / API / i18n 是否正确。
- 原型或旧系统升级的业务事实是否完整映射。

组件认证不得替代实例验收、preflight、formal acceptance 或交付状态字段。
