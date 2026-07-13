# 抽屉详情

## 速览

- 何时读：已经判定为 `drawer-detail`，且只读描述项 `<=16`
- 核心规则：必须走 `ProDetailDrawer + Descriptions`，超限直接切全页详情
- 常见坑：忘记 `th` 左对齐，或把全页详情的列距规则搬进抽屉

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51728:131344`

## 适用

- `Drawer + Descriptions`
- 只读描述项总数 `<=16`

只读描述项总数 `>16`：改为全页详情，见 [`detail-group.md`](detail-group.md)。

## 硬门槛说明

- 本页全部规则默认按硬门槛执行，不是“抽屉版详情建议”
- 抽屉详情必须同时满足：`ProDetailDrawer` 容器语义、`Descriptions` 主表达、`placement: 'vertical'`、字段数量分档、标题与内容区节奏、长文本整行
- 本页的 `分档`、`P0`、`列表嵌套详情` 与 `禁止` 都属于生成与验收的强制约束；命中对应场景时不得省略
- 抽屉详情必须从 `examples/host-integration/src/pages/drawer-detail.tsx` 的语义骨架起步；不允许从全页详情、表单页或空白抽屉临时拼装
- 若页面实现不满足这些规则，应直接判定为不合规，而不是视作“轻量详情变体”

## 分档

| 字段数 | `Drawer.width` | `Descriptions.column` |
|--------|----------------|-----------------------|
| `1~9` | `360` | `1` |
| `10~16` | `600` | `2`，`columnGap: 16` |

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-detail-drawer/`
- 标题 `16px / 600`，不要用全页详情的 `18px`
- 标题区带底部分隔线
- 内容区默认 `12 / 20 / 20`
- `Descriptions` 走 `placement: 'vertical'`
- vertical 详情字段保持真实 `Descriptions` 语义骨架，但不要依赖隐藏默认值；关键布局不变量要通过 props 显式冻结
- detail-shell 中必须显式写 `labelPlacement="left"`；不要把 left 对齐寄托在浏览器默认 `th` 行为上
- 不要写固定 `labelWidth`
- 双列场景下，长文本项独占整行
- 非中文默认继续保持上下结构；重要字段值最多 2 行，超出 `ellipsis + tooltip`
- 仅 1 个逻辑分组时不展示组内标题；`>=2` 组再展示 `16px / 600` 组标题
- 内容区不要再包一层 `Card`

## 列表嵌套详情

- 列表内嵌抽屉详情默认 `showMask={false}`
- `maskClosable={false}`
- 行切换时只更新路由参数，不要先关抽屉再打开

## 禁止

- 不要绕开 `ProDetailDrawer` 再重复手写头区 / body / `Descriptions` 对齐修正样式
- 不要把全页详情的 3 列 `40` 套进抽屉详情
- 不要给 vertical 详情字段写死 `labelWidth`
- 不要依赖 `Descriptions` 的隐式 label 对齐默认值；detail-shell 的 left 起点必须在 props 边界显式声明
- 不要把 `Descriptions` 改写成 label-value 卡片、字段网格或只读表单
- 不要在 `>16` 条描述项时继续留在抽屉

## 自检

- 容器是否仍是抽屉而不是全页
- `360 / 600 / 全页` 分支是否正确
- 标题是否为 `16px / 600`
- 双列长文本是否整行显示
