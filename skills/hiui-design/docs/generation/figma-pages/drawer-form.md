# 抽屉表单

## 速览

- 何时读：已经判定为 `drawer-form`，且可编辑字段 `<=16`
- 核心规则：必须走 `ProFormDrawer + Form`，字段超限直接切全页编辑
- 常见坑：通过加宽抽屉规避 `>16` 规则，或忘记 `rowGap={0}`

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51728:128145`

## 适用

- `Drawer + Form`
- 字段数 `<=16`

字段数 `>16`：直接改为全页编辑，见 [`edit.md`](edit.md)。

## 硬门槛说明

- 本页型规则默认按硬门槛执行，不是“抽屉版编辑建议”
- 抽屉表单必须同时满足：`ProFormDrawer` 容器语义、`Form` 主表达、字段数量分档、`Grid.Row rowGap={0}`、抽屉头体底栏节奏、底部按钮靠右
- 抽屉表单必须从 `examples/host-integration/src/pages/drawer-form.tsx` 的语义骨架起步；不允许从全页编辑、详情抽屉或空白抽屉临时拼装
- 若页面实现不满足这些规则，应判定为不合规，而不是视作“轻量编辑变体”

## 分档

| 字段数 | 列数 | 横向间距 | `Drawer.width` |
|--------|------|----------|----------------|
| `<10` | 单列 | — | `360` |
| `10~16` | 双栏 | `32` | `600` |

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-form-drawer/`
- 必须有 `Form` 根，默认 `labelPlacement: 'top'`
- `Grid.Row` 必须显式 `rowGap={0}`，单列也一样
- 抽屉根必须带 `className`
- 去掉 `hi-v5-drawer__footer--divided` 顶线和阴影
- 标题区、body、footer padding 与典型抽屉统一
- 底部按钮默认靠右

## 分组补充

共享规则见 [`forms-shared.md`](forms-shared.md)。

- 抽屉分组不要用 `Card`
- 不要用 `Divider`
- 多组之间默认无额外间隙
- 组容器不要再加左右 padding
- 只有 1 个逻辑分组时不展示组标题
- `>=2` 组时，组标题 `16px / 600`，标题区总高 `60px`

## 禁止

- 不要绕开 `ProFormDrawer` 再重复手写头区 / body / footer 样式
- 不要把全页编辑的三栏 `40` 套进抽屉
- 不要把默认 `rowGap=16` 当成正确实现
- 不要省略 `Drawer` 根样式覆盖
- 不要通过加宽抽屉规避 `>16` 规则

## 自检

- 字段数是否仍在 `<=16`
- 单列 / 双栏分档是否正确
- 是否写了 `rowGap={0}`
- footer 顶线是否已去掉
- 单分组时是否没有多余组标题
