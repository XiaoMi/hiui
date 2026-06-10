# 左树右表

## 速览

- 何时读：已经判定为 `tree-split`，左侧独立树、右侧筛选加表格
- 核心规则：必须保留 `TreeSplitPageFrame` 的分栏语义和 `200px` 左树基线
- 常见坑：把它误做成表内树，或在左树面板额外加灰底和内边距

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `<figma-node-id>`

## 适用

- 左侧 `Tree`
- 右侧 `QueryFilter + Table`
- 无指标卡

共享表格规则见 [`table-shared.md`](table-shared.md)。

## P0

- 当前项目存在共享实现时，优先复用 `src/components/pro-tree-split-page/`
- 外槽背景 `#F5F8FC`
- 主区白卡仅上圆角 `12`，白底铺到底部
- 左树列默认宽 `200px`
- 左树与右表之间支持拖拽调宽
- 树区右侧 `1px #EDEFF2`
- 树顶 `SearchInput` 必须用 `style` 覆盖内联 `width: 200`
- 左树搜索区 `padding: 20px 12px 12px`
- 左树滚动区只保留 `padding-bottom: 16px`，不要再加左右 `12px`
- 左树面板本身只保留 `border-radius: 8px` 与 `overflow: hidden`，不要额外加灰底、`padding: 12px` 或 `min-height: 100%`
- 右侧筛选 `padding: 20px 20px 16px 20px`，`gap: 8`
- `queryFields` 与同壳 `table-normal` 一致
- 当前项目已有离散标签、枚举态或串号管理列渲染时，优先从现有业务页裁剪对应 renderer，不要在示例页里简化成裸文本后再回推样式
- 双表场景的 `Table` 外不要再包 `overflow-y:auto`
- 树选中与右侧筛选、全部筛选默认不联动

## 与数据统计表的边界

- 这里没有指标卡
- 这里的筛选 padding 是 `20 / 20 / 16 / 20`
- 不要复用数据统计表的 `16 / 20`

## 禁止

- 不要绕开 `TreeSplitPageFrame` 再重复手写页头、主白卡、分栏、拖拽线和表体高度链
- 不要把左树默认宽误写成 `20px`
- 不要只用 CSS 把树搜索框设成 `100%`
- 不要因为树选中就自动回写列表筛选
- 不要在 `leftPane` 里再包一层带左右 `12px` 的滚动容器
- 不要给左树面板额外加 `#F5F7FA` 灰底或 `padding: 12px`

## 自检

- 是否真的是左树 + 右表，而不是表内树
- 左树宽度是否默认为 `200`
- 搜索框是否成功覆盖内联宽度
- 左树滚动区是否只有底部 `16px`，没有多余左右内边距
- 左树面板是否没有额外灰底和 `padding: 12px`
- 右表是否没有多包一层纵向滚动
