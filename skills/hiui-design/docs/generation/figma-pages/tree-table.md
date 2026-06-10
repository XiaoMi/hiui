# 树形表格

## 速览

- 何时读：已经判定为 `tree-table`，树结构在表格首列内展开
- 核心规则：仍是单张 `TablePageFrame`，不要翻译成左右分栏
- 常见坑：树名称列只剩缩进和图标，文本省略链断掉

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `<figma-node-id>`

## 适用

- 单张 `Table`
- 树层级在表内首列展开

共享表格规则见 [`table-shared.md`](table-shared.md)。

## 与左树右表区分

- 树形表格：树在表内首列
- 左树右表：`Tree` 和 `Table` 横向分栏

这两个页型不要混用。

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-table-page/`
- 外槽与主区壳体风格沿用典型列表
- 筛选条 `padding: 20px 20px 16px`
- 表格区 `padding: 0 20px`
- `Table` 默认 `size="md"`、无斑马、可拖宽
- 树名称列不要只用裸 `.val`
- 树名称列需要：
  - 列上挂 `MWP({ className: styles.treeSwitcherCol })`
  - 仅在 `tbody td` 上做 `display:flex; align-items:center; min-width:0`
  - `renderCell` 从 `ctx.rawData[dataIndex]` 取值
  - 文本容器 `min-width:0; flex:1 1 0`
  - 单行省略 + Tooltip
- 状态列默认 `Tag`
- 业务分类列、是或否列默认文本
- 分页不要因为 `autoHide` 消失

## 禁止

- 不要绕开 `TablePageFrame` 再重复手写页头、筛选区和表格高度链
- 不要把左树右表的分栏规则搬到这里
- 不要让树名称列只剩图标和缩进、文本丢失
- 不要传 `paginationProps={{ autoHide: true }}` 让分页整段隐藏

## 自检

- 是否为单表树而不是左右分栏
- 树名称列是否完成了 flex + ellipsis 处理
- 分页是否始终可见
