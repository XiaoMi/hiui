# Component Certification

页面组件认证用于把典型页结构验收从每个业务页前移到低频资产阶段。它只能证明组件资产可靠，不能证明某个业务页面实例正确。

## 认证对象

认证对象是 `rules/page-component-registry.json` 中的 `componentId`。认证必须引用：

- `baseMoldId`
- component template digest
- adapter digest 列表
- runtime profile
- visual preview / runtime smoke 证据

当 mold、adapter、component template 或 runtime profile 任一变化时，认证必须视为过期。

`legacy-host-compatible` 不再通过 page-component certification 选择业务页主资产。legacy 页面一致性由 `host-contract`、compiled PageSpec、`HiuiLegacyPage` runtime 与 typed page slots 在生成期持有；`typical-page:legacy:verify` 仅作显式排障命令。

## 职责边界

| 阶段 | 责任 | 输出 |
| --- | --- | --- |
| 资产维护 / 规则调试 | 认证组件结构、槽位、adapter、runtime 与预览证据 | certification artifact + registry available 状态 |
| 非 legacy 业务页面生成 | 只确认组件在可用目录中，且 mode / pageType / baseMoldId 匹配 | `ComponentAvailabilityGate` passed / blocked |
| legacy 业务页面生成 | 只消费 host contract、compiled PageSpec、HiuiLegacyPage runtime 与 typed page slots | lightweight contract gates |
| 业务实例验收 | 验证本次业务填充、受控扩展、路由、权限、API、i18n、runtime render | `page-instance-validation.v1` |

候选、规划中、过期或 blocked 的组件只能出现在维护者诊断视图，不能作为 legacy 业务页面生成候选。

## 认证状态判定

非 legacy 业务页面生成阶段只能把同时满足下列条件的组件视为可用：

1. `rules/page-component-registry.json` 中 `status=certified`。
2. `certificationStatus=certified`。
3. `certificationRef` 指向 skill 根目录内的认证工件。
4. 认证工件存在，且 `schemaVersion=page-component-certification.v1`、`status=certified`、`componentId`、`baseMoldId`、mode 与注册表一致。
5. 当前模式命中组件 `supportedModes`。

对外可读的认证状态由 `typical-page:capabilities --json`、`typical-page:list-assets --type page-components --json` 与 `typical-page:inspect-asset --type page-component --id <componentId> --json` 暴露；这些接口只提供 facts，不能替代 `page-task-plan.v1` 或业务实例验收。

## 资产级检查

- required regions 完整。
- locked regions 不可由业务实例改写。
- allowed slots 和 controlled extensions 可验证。
- adapter / shell carrier 可证明。
- white-body / main-scroll / pagination ownership 正确。
- source marker / contract marker 可由组件稳定暴露。
- visual preview 与 runtime smoke 通过或明确 blocked。

## 实例级检查

业务页仍必须运行 `page-instance-validation.v1`：

- required slots 是否完整。
- extension slots 是否合法。
- locked regions 是否未被覆盖。
- route owner / permission / API / i18n 是否正确。
- 原型或旧系统升级的业务事实是否完整映射。

组件认证不得替代实例验收、preflight、formal acceptance 或交付状态字段。
