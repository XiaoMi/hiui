# 抽屉详情

## 默认稿

- `fileKey`: `jlYnxIW1FFGG8fK1sVcL5C`
- `nodeId`: `51728:131344`

## 适用

- `Drawer + Descriptions`
- 只读描述项总数 `<=16`

只读描述项总数 `>16`：改为全页详情，见 [`detail-group.md`](detail-group.md)。

## 分档

| 字段数 | `Drawer.width` | `Descriptions.column` |
|--------|----------------|-----------------------|
| `1~9` | `360` | `1` |
| `10~16` | `600` | `2`，`columnGap: 16` |

## P0

以下复用规则仅在 `integrationReadiness.ready=true` 且已进入 official-template generation path 后生效；未 ready 时先执行 `ensure-or-stop`，不要评估共享实现或旧业务页复用。

- 当前项目存在共享实现时，优先复用 `src/components/pro-detail-drawer/`
- 标题 `16px / 600`，不要用全页详情的 `18px`
- 标题区带底部分隔线
- 内容区默认 `12 / 20 / 20`
- `Descriptions` 走 `placement: 'vertical'`
- `labelPlacement: 'left'`
- `vertical + unset` 时，作用域内必须把 `th` 设为左对齐
- 双列场景下，长文本项独占整行
- 仅 1 个逻辑分组时不展示组内标题；`>=2` 组再展示 `16px / 600` 组标题
- 内容区不要再包一层 `Card`

## 列表嵌套详情

- 列表内嵌抽屉详情默认 `showMask={false}`
- `maskClosable={false}`
- 行切换时只更新路由参数，不要先关抽屉再打开

## 页面逐层拆解

### 1. 页面承载层

- 和抽屉表单一样，抽屉详情页本身主要承担页头与触发场景，不是真正的详情壳层。
- 页头由页面自身的 `PageHeader` 承载，承接页名和打开抽屉动作。
- 页面白底承载区只负责提供触发场景，不承担详情字段布局。

### 2. 抽屉壳层

- 抽屉详情的核心壳层是 `ProDetailDrawer`，标题、关闭能力、body 节奏都由它管理。
- 该页型在 `10~16` 条描述项场景下使用 `600` 双列详情；字段更少时应切回 `360` 单列。
- 抽屉详情不应再包第二张白卡或再造一个 `Card + Descriptions` 容器，所有主详情都应直接落在抽屉 body 内。

### 3. 详情主体

- 详情主体由 `ProDetailDrawerBody -> Loading -> Descriptions` 构成，`Loading` 负责请求态，`Descriptions` 负责阅读结构。
- 该页型的典型字段结构是“基础属性 + 一条长文本备注”，不再拆多组大 section。
- 缺省值统一回退到 `—`，这是详情页的默认空值模式；不要把空值显示成空白或随机占位词。

### 4. 描述项网格

- 该页型的 `Descriptions` 采用 `placement="vertical"`、`labelPlacement="left"`、`labelWidth={114}`、`column={2}`、`columnGap={16}`。
- 这意味着标签和数值仍然成组阅读，但视觉上是更适合抽屉的紧凑双列，而不是全页详情的三列大布局。
- 长文本 `备注信息` 使用 `colSpan: 2` 独占整行，避免在双列下被硬切成两半。
- 当 `vertical + left` 组合出现时，`th` 必须左对齐；否则标签区会显得偏移和发散。

### 5. 标题与交互

- 页面标题是 `抽屉详情`，抽屉标题是业务对象详情名，如 `用户详情`；两个标题层级不同，不应互相替代。
- 页面级按钮只负责打开抽屉；抽屉内默认不再堆第二排操作按钮，避免把只读详情误写成编辑页。
- 如果业务需要列表内切换详情，优先复用同一抽屉实例更新数据，而不是关闭再重开。

## 关键组件与属性契约

### `ProDetailPageProvider`

- `request`：详情数据入口；负责请求抽屉详情内容。

### `ProDetailDrawer`

- `title`：抽屉标题入口。
- `visible`：显隐状态。
- `width`：抽屉宽度；需服从抽屉详情分档。
- `closeable`：关闭能力。
- `unmountOnClose`：关闭后卸载策略。
- `onClose`：关闭回调。

### `ProDetailDrawerBody`

- 作用：抽屉正文承载层。
- 职责边界：内部直接承接 `Descriptions` 或受管详情结构，不再套第二张白卡。

### `Loading`

- `visible`：详情加载态开关；加载状态应覆盖正文区，而不是换成另一套页面结构。

### `Descriptions`

- `data`：描述项数据入口。
- `placement`：抽屉详情通常使用 `vertical`。
- `labelPlacement`：抽屉详情通常使用 `left`。
- `labelWidth`：标签宽度入口；需保证字段列对齐。
- `column`：列数；由抽屉详情分档决定。
- `columnGap`：列间距；双列详情的重要节奏参数。

## 禁止

- 不要绕开 `ProDetailDrawer` 再重复手写头区 / body / `th` 左对齐样式
- 不要把全页详情的 3 列 `40` 套进抽屉详情
- 不要遗漏 `th` 左对齐
- 不要在 `>16` 条描述项时继续留在抽屉

## 自检

- 容器是否仍是抽屉而不是全页
- `360 / 600 / 全页` 分支是否正确
- 标题是否为 `16px / 600`
- 双列长文本是否整行显示
