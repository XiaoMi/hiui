# Page-Level Components

本页只描述非 legacy 模式下的 page-component 边界。

## Legacy Boundary

`legacy-host-compatible` 不再使用 page-component carrier 作为页面生成主链，也不保留旧 wrapper / adapter / matrix 作为 fallback。

legacy 典型页必须走：

`host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots`

页面目录默认只生成：

- `page.instance.tsx`
- `page.slots.ts`
- 必要时 `page.request.ts`

不得因为需要一个壳而写入 `src/page-components`、carrier、support 文件或页面级样式壳。

## Non-Legacy Page Components

非 legacy 模式如果选择 page-component，必须满足：

- `rules/page-component-registry.json` 存在对应 `componentId`。
- certification artifact 有效。
- `baseMoldId`、locked regions、editable slots 与 slot manifest 可追溯。
- 页面只填业务 slots，不重建 shell / white-body / main-scroll / pagination / footer。

## Planner Rules

- `legacy-host-compatible`：planner 必须返回 `source=legacy-lightweight-contract`，`pageComponent.selected=false`。
- `host-integration` / `rules-only`：planner 可按认证结果选择 page-component。
- 不得把旧 carrier、旧 fallback 或旧审计资产注入 legacy 页面合同。
