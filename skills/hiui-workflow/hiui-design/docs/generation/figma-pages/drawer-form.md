# 抽屉表单

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51728:128145`

## 适用

- `Drawer + Form`
- 字段数 `<=16`

字段数 `>16`：直接改为全页编辑，见 [`edit.md`](edit.md)。

## 分档

| 字段数 | 列数 | 横向间距 | `Drawer.width` |
|--------|------|----------|----------------|
| `<10` | 单列 | — | `360` |
| `10~16` | 双栏 | `32` | `600` |

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

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

## 页面逐层拆解

### 1. 页面承载层

- 抽屉表单页本身不是表单主体，它的职责是提供页头与触发场景；真正的编辑主体从抽屉内部开始。
- 页头由页面自身的 `PageHeader` 承载，承接页名和打开抽屉动作。
- 页面白底承载区只负责提供触发场景，不是业务表单容器；真正的编辑结构从抽屉内部开始。

### 2. 抽屉壳层

- 抽屉壳层由 `ProFormDrawer` 持有，标题、关闭能力、body 和 footer 都归它管理。
- 该页型在 `10~16` 字段场景下使用 `600` 双栏抽屉；字段更少时应切回 `360` 单列抽屉，而不是在 `600` 上硬塞空白。
- 样式上抽屉根必须带受管类名，footer 顶线与阴影由壳层规则统一去掉，不在业务页重复覆盖。
- 组件模式上，抽屉只承接“少字段编辑”；字段数量超界就要改判全页编辑。

### 3. 表单主体

- 表单主体由 `TypicalPageFieldMapProvider -> SchemaForm` 组成，字段桥接和视觉组件解析不应跳过。
- 该页型的字段模式以当前项目接入的 HiUI5 `SchemaForm` / `schema-core` 支持能力为准；`Text`、`Select`、`Date`、`Textarea` 只是抽屉基础信息编辑流中的常见类型，不代表只能使用这些字段类型。
- 表单必须有 `Form` 根语义，标签默认在上方；不要把字段散成一堆自由摆放的控件。
- 长文本、上传、富输入或其他宽字段应通过 `span` 独占整行；`remark + Textarea` 只是常见例子，它在抽屉里不是额外卡片，而是网格里的宽字段。

### 4. 表单网格

- 该页型的双栏网格使用 `columnCount: 2`、`gutter: 32`、`rowGap: 0`。
- `rowGap: 0` 是硬约束，不是优化项；如果省略，会回到默认 `16` 的旧节奏，抽屉表单就会看起来发散。
- 抽屉表单的栅格只负责字段排布，不承担分组容器美化；不要再往每组外面套 `Card` 或横向 padding。
- 如果字段需要跨两列，应直接用字段 `span` 收口，而不是再包一层自定义 row。

### 5. 底部操作区

- 底部操作区由 `ProDrawerFooterActions` 持有，典型动作组合是“取消 + 确认”。
- 这块区域职责是提交、关闭、次操作，不承载说明文案、风险提示或 mock 状态公告。
- 布局上按钮默认靠右；组件模式上通常是一个次按钮加一个主按钮，不堆三四个主按钮。
- 生成或改页时，如果要加自定义 footer，也必须在受控 footer 范围内做，而不是自己拼普通 `div` footer。

## 关键组件与属性契约

### `PageHeader`

- `title`：页面标题入口。
- `extra`：页头右侧动作入口；抽屉触发按钮通常挂在这里。
- 职责边界：页头只负责页面入口和轻动作，不承载抽屉 body 内容。

### `ProFormDrawer`

- `title`：抽屉标题入口。
- `visible`：显隐状态。
- `width`：抽屉宽度；必须服从页型分档，不靠随意加宽解决字段超界。
- `closeable`：是否显示关闭能力。
- `unmountOnClose`：关闭后是否卸载；需根据表单保留策略决定。
- `onClose`：关闭回调。
- `footer`：抽屉底栏入口；应由 `ProDrawerFooterActions` 持有，而不是自拼普通 `div`。

### `SchemaForm`

- `fields`：字段 schema 列表。
- `formRef`：表单实例引用，用于校验与取值。
- `grid` / `column`：是否启用网格以及默认列数。
- `formProps.labelPlacement`：标签布局语法，抽屉表单默认 `top`。
- `gridProps.columnCount`：列数；抽屉表单分档的重要组成部分。
- `gridProps.gutter`：列间距。
- `gridProps.rowGap`：行间距；抽屉表单要求显式为 `0`。
- `borderedGroups`：分组是否描边；默认由页型规则控制。

### `ProDrawerFooterActions`

- 作用：底栏动作容器。
- 内容约束：承接提交、取消、关闭、次操作，不承载正文说明。

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
