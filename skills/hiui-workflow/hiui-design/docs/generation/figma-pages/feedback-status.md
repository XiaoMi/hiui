# 异常反馈页

## 默认稿

- 当前 `hiui-design` 不提供独立默认 `nodeId`
- 官方起点：`examples/host-integration/src/pages/feedback-status/index.tsx`
- 运行时对照页：`examples/host-integration/src/pages/feedback-status/index.tsx`

## 适用

- 页面主内容是空状态、失败、无权限、建设中或网络中断反馈
- 主体信息是一块居中的反馈面板，而不是表格、表单或分组详情
- 页面需要主操作、次要操作或返回类动作作为后续承接

如果页面仍然是“筛选 + 表格 + 分页”的主体，只是局部存在空状态分支，不要改判 `feedback-status`；应继续使用原页型并在业务分支里处理状态反馈。

## P0

- 必须从 `feedback-status` 官方模板起步，不要从空白文件或自由公告页反推结构
- 必须保留单一 `PageHeader`、单一 `whiteBody` 和居中的 `EmptyState` 反馈面板
- 页头与反馈主体必须继续属于同一条连续的 `flex + min-height: 0` 高度链
- 反馈主体默认只承载标题、描述、插图和动作按钮，不要新增第二张白卡、第二个主滚动区或常驻业务说明块
- `feedback-status` 是“一个页型 + 多个变体”，不要为了不同插图拆成多个独立页型

## 生成时边界

- 写代码前先按 `../ai-page-generation-guidance.md` 形成 `coverageDecision`
- 本页型走“官方模板 + 业务槽位替换”的标准轻流程
- 允许替换的只有 `title`、`description`、`primaryAction`、`secondaryActions`、`headerActions`、`indicator`、`variantId`、`mockData`
- `PageHeader`、`whiteBody`、反馈面板居中布局和单主体结构都属于固定区域
- 接口未接入、mock 状态、生成说明和测试说明不得作为页面常驻内容渲染

## 默认生成步骤

1. 先判页型
   确认当前页面的主任务是状态反馈，而不是列表、表单或详情主流程。
2. 再读机读合同
   读取 `../page-types.manifest.json` 中 `feedback-status.generationContract`，确认 `requiredShell`、`businessSlots` 和 `lightSanityChecks`。
3. 再锁槽位边界
   对照 `../page-slot-boundaries.md` 的 `feedback-status` 小节，先声明允许替换槽位和禁止触碰区域。
4. 固定页面骨架
   保留页头、单一白底主体和居中的 `EmptyState` 反馈面板，不要发明第二套壳层。
5. 替换业务内容
   只替换标题、描述、插图和动作按钮文案；如需不同异常变体，沿用变体注册表而不是复制一份新页面。
6. 做轻量自检
   核对白底主体、单一 `PageHeader`、反馈面板和高度链是否仍然完整。

## 推荐变体

- `empty-state`
- `load-fail`
- `page-not-found`
- `no-permission`
- `under-construction`
- `network-error`
- `intranet-offline`

## 页面逐层拆解

### 1. 页面壳层

- 异常反馈页是非常明确的单主体页：`PageHeader -> whiteBody -> feedback panel -> EmptyState`。
- 页头和反馈主体必须处于同一连续高度链中；这保证了异常反馈页仍然是一个完整页面，而不是一张零散公告卡。
- `whiteBody` 是唯一主体承载层，只负责提供白底和居中空间，不再继续细分第二层主容器。

### 2. 页头层

- 页头由页面自身的单一 `PageHeader` 承接，标题直接使用异常主题文案。
- 若宿主存在共享 `header slot`，它必须在本页型未占用宿主区域时自动折叠，而不是把空白高度留在反馈主体上方。
- 标题区右侧动作组是页面级动作，通常用 `Space + Button` 组合“次要操作 / 主操作”。
- 样式上标题区按钮组 `gap: 12px`，主按钮在最右；不要在异常反馈页额外插第二个页头或说明栏。

### 3. 反馈面板

- 真正的反馈主体不是 `EmptyState` 直接贴在白底上，而是先有一整块居中的反馈面板。
- 这块面板负责提供边界、圆角、居中和承载空间；样式应为白底、`1px solid #EDEFF2`、`12px` 圆角。
- 布局上它填满白底可用空间，并将内容水平、垂直居中；不要再拆第二张小卡或加左右分栏。

### 4. 内容区 `EmptyState`

- `EmptyState` 是反馈页内容 owner，内部顺序固定为“插图 -> 标题 -> 描述 -> 动作按钮”。
- 内容区宽度约 `400px`，说明它是窄列阅读结构，不应被撑成整页宽文本块。
- 标题使用 `16 / 24 / 500`，描述使用 `14 / 22 / #60636B`，强调词可单独用 HiUI Blue `#2660FF`。
- 组件模式上它只承接异常插图、异常文案和按钮，不承接表格、表单、步骤条或统计模块。

### 5. 变体资源

- 不同异常状态不是不同页面壳，而是在同一骨架里替换 `indicator + title + description + primaryAction`。
- `variants.tsx` 负责注册每种变体的插图和文案，页面本体只负责把这些资源放进统一布局。
- 这意味着新增异常态时应补变体，不应复制一份新页面再手改布局。

## 关键组件与属性契约

### `PageHeader`

- `title`：页面标题入口。
- `extra`：页面级动作入口；通常承接次要操作和一个主操作。

### `EmptyState`

- `indicator`：插图 / 状态图入口。
- `title`：反馈标题入口。
- `size`：反馈面板内容尺寸入口；应服从反馈页单主体语法。
- `children`：描述文案和动作按钮入口。

### 变体数据

- `variantId`：异常态标识。
- `title`：异常标题文案。
- `description`：异常描述文案，可由前后缀和强调片段组成。
- `indicator`：对应的插图资源。
- `primaryActionLabel` / 次要动作：按钮文案和动作定义入口。

## 禁止

- 不要把 `feedback-status` 退化成自由插图 + 文案公告页
- 不要把多个异常说明拆成多张白卡或多段常驻说明
- 不要重复创建 `PageHeader`
- 不要把“接口未接入 / 当前为示例 / 测试说明”写成页面常驻内容

## 自检

- 是否从 `feedback-status` 官方模板起步，而不是从空白文件起步
- 是否保留单一 `PageHeader` 和单一 `whiteBody`
- 反馈主体是否仍是一个居中的 `EmptyState` 面板
- 是否没有出现第二个白底主体、第二套主滚动或常驻业务说明块
- 是否仍按“一个页型 + 多个变体”的方式组织，而不是复制出多个平行页型
