# 非典型页面组件路由

## 目标

这份文件只解决一个问题：

- 非典型 / overlay 页面在进入 JSX 拼装前，如何先把“页面语义”路由到正确的 HiUI 组件

它不负责：

- 重新定义 `page type`
- 重新定义 `layout strategy`
- 重新定义 ownership / contract
- 给页面发明新的视觉容器语言

对应事实源如下：

- 非典型 / overlay 布局事实：`non-typical-pages.md`
- 组件完整图谱：`hiui-v5-component-map.md`
- 高频兜底：`../hiui-v5-quick-reference.md`
- 生成阶段门槛：`../../rules/generation-rules.md`

## 先问四个问题

进入组件路由前，先回答下面四个问题；缺任一项时，不要开始 JSX。

1. 这块内容的主语义是什么  
   是标题、筛选、详情、时间记录、指标、表格、状态反馈、浮层任务，还是其它明确角色。
2. 这块内容是主表达，还是辅助补充  
   主表达优先用语义更强的组件，辅助补充优先用轻量表达，不要反过来。
3. 这块内容是否已经有受管 shell / owner  
   若页壳、白底主体、表格区、详情区已有 owner，不要再补第二层同类容器。
4. 这块内容是否真的缺 HiUI 组件  
   只有当前 HiUI 没有等价语义组件时，才考虑 approved bypass 或第三方 bridge。

## 快速路由

### 1. 页面标题、返回、页头动作

- 标题 + 返回 + 主操作：优先 `PageHeader`
- 多级路径补充：再加 `Breadcrumb`
- 同层操作排布：`Space + Button`
- 不要退回：内容白卡里的 `div + h2 + button`

### 2. 标题下紧邻的次要信息

- 轻量元信息：优先 `Tag`、普通文本行、secondary info band
- 风险或提示：优先 `Tag` 或 `Alert`
- 不要退回：`Descriptions`

判断口径：

- 若它只是帮助识别标题对象，不是详情正文，默认不是 `Descriptions`
- 若它开始承担主详情表达，再升级成 `Descriptions`

### 3. 只读字段主表达

- 成组字段、详情正文：优先 `Descriptions`
- 时间顺序记录：优先 `Timeline`
- 简单异构条目：优先 `List`
- 不要退回：自造 `infoStrip`、`fieldCard`、`label-value grid`

### 4. 列表与结构化数据

- 统一结构数据：优先 `Table`
- 分页导航：优先 `Pagination`，并保持与 `Table` / `List` 处于同一工作区 footer chain
- 条目异构且不强调列对齐：优先 `List`
- 层级节点浏览：优先 `Tree`
- 不要退回：手写 grid、重复 `Card` 列表、嵌套 `div`

### 5. 列表筛选区

- 标准列表筛选：优先 `QueryFilter`
- 单关键词检索：可在 `QueryFilter` 内组合 `Search`
- 轻量状态或维度切换：`Tag`、`Tabs`、`Radio`，前提是它们真的表达切换语义
- 不要退回：`Search + Select + DatePicker` 手拼 flex 行

### 6. 指标、摘要与状态

- 统计指标：优先复用既有指标 section / stat shell；局部才考虑 `Card`
- 状态标签：优先 `Tag`
- 数量提醒：优先 `Badge`
- 复杂结果态：优先 `Result` 或 `EmptyState`
- 不要退回：彩色胶囊 `span`、空白 filler、手写 KPI 盒子堆叠

### 7. 表单与编辑

- 多字段录入：优先 `Form`
- 单行文本：`Input`
- 长文本：`Textarea`
- 数字：`NumberInput` 或 `Counter`
- 布尔：`Switch`
- 少量互斥：`Radio`
- 少量多选：`Checkbox`
- 上传：`Upload`
- 不要退回：散装 `div + input`

### 8. 选择器

- 普通单选：`Select`
- 普通多选：`CheckSelect`
- 层级单选：`TreeSelect` 或 `Cascader`
- 层级多选：`CheckTreeSelect` 或 `CheckCascader`
- 时间：`DatePicker` / `TimePicker`
- 不要退回：普通 `Input` + 文本提示

### 9. 浮层与二次确认

- 中途编辑 / 查看详情：`Drawer`
- 阻断式任务：`Modal`
- 轻量补充信息：`Popover` / `Tooltip`
- 轻量确认：`PopConfirm`
- 次级动作收纳：`Dropdown`
- 不要退回：绝对定位 `div`、自造蒙层、散装确认文案

### 10. 加载、错误与空状态

- 已知结构加载：`Skeleton`
- 局部或整体等待：`Loading` / `Spinner`
- 空数据、无权限、无结果：`EmptyState`
- 明确结果反馈：`Result`
- 即时反馈：`Message` / `Toast`
- 系统级通知：`Notification`
- 不要退回：只有一行灰字、无语义占位块

## 易混组件对照

### 1. `Descriptions` vs 标题下次要信息带 vs `List`

| 场景 | 优先组件 | 不要误用 |
| --- | --- | --- |
| 标题下紧邻的少量识别信息，如状态、编号、更新时间 | `Tag` + 文本行 / secondary info band | 不要直接上 `Descriptions` |
| 详情正文，字段组承担主要阅读任务 | `Descriptions` | 不要降级成几列 `meta row` |
| 条目异构、段落化、活动流式阅读 | `List` | 不要为了“看起来整齐”硬做成 `Descriptions` |

### 2. `Drawer` vs `Modal` vs `Popover` vs `Tooltip`

| 场景 | 优先组件 | 不要误用 |
| --- | --- | --- |
| 不离开当前页上下文的中途编辑、查看详情 | `Drawer` | 不要把多字段任务硬塞进 `Modal` |
| 阻断式确认或必须聚焦完成的小任务 | `Modal` | 不要把持续性工作区做成 `Modal` |
| 轻量补充信息、轻量二次确认 | `Popover` | 不要把复杂表单放进 `Popover` |
| 一两句解释、图标含义、截断文案提示 | `Tooltip` | 不要把主信息放进 `Tooltip` |

### 3. `Select` vs `TreeSelect` vs `Cascader`

| 场景 | 优先组件 | 不要误用 |
| --- | --- | --- |
| 普通离散选项，无明显层级 | `Select` / `CheckSelect` | 不要因为选项多就默认上树 |
| 组织架构、目录树等可展开层级 | `TreeSelect` / `CheckTreeSelect` | 不要平铺成普通 `Select` |
| 多级分类路径选择，强调按层进入 | `Cascader` / `CheckCascader` | 不要手拼多个联动下拉 |

### 4. `EmptyState` vs `Result` vs `Alert` vs `Message`

| 场景 | 优先组件 | 不要误用 |
| --- | --- | --- |
| 当前区域没有数据、无权限、无结果、建设中 | `EmptyState` | 不要只放一行灰字 |
| 重要操作后的完整结果反馈 | `Result` | 不要只弹一条 `Message` |
| 页面或局部阅读型提示、警示、说明 | `Alert` | 不要把系统级即时反馈写成 `Alert` |
| 即时、短时、全局反馈 | `Message` / `Toast` | 不要拿它承载复杂说明 |

### 5. `Skeleton` vs `Loading` vs `Spinner`

| 场景 | 优先组件 | 不要误用 |
| --- | --- | --- |
| 结构已知、希望减少页面跳动 | `Skeleton` | 不要只放一个小 `Spinner` |
| 区域或页面正在加载，需表达等待中 | `Loading` | 不要把它当成空状态 |
| 纯等待指示、局部很轻的异步动作 | `Spinner` | 不要在大块内容加载时只留旋转点 |

## 何时可以用 `Card`

`Card` 只在下面三种情况优先成立：

- 某个 section 本身就是独立阅读任务
- 页面内部需要局部面板边界，而不是整页白底主体
- 项目已有同类 section 一直用 `Card` 承接

不要默认：

- 每个一级分组都包 `Card`
- 外层白底主体里再套一层统一大 `Card`
- 用 `Card` 代替 `Descriptions`、`Timeline`、`Table` 等主表达组件

## 何时不能发明自定义容器

下面这些名字默认都不是优先答案，除非 deviation 已明确批准：

- `summaryStrip`
- `heroCard`
- `fieldCard`
- `infoStrip`
- `mediaCard`
- `customInfoBlock`

先做的事应该是：

1. 判断它本质是 `Descriptions`、`Timeline`、`Table`、`Tag`、`Alert` 还是 `Card`
2. 判断它是主表达还是补充表达
3. 判断它有没有接管不该接管的 shell / owner

## 最小输出要求

只要页面进入非典型 / overlay 路径，且组件超出最小速查覆盖范围，进入实现前至少写清：

- `primary semantic components`
- `rejected alternatives`
- `why not custom container`
- `import path discipline`

其中：

- `primary semantic components` 回答每个一级信息组优先落到哪个 HiUI 组件
- `rejected alternatives` 回答为什么不是另一个看起来相似的组件
- `why not custom container` 回答为什么不需要 `heroCard / infoStrip / customInfoBlock`
- `import path discipline` 回答组件来自 `@hi-ui/hiui`、`@hi-ui/icons` 还是公开壳层路径

## 常见误判

- 标题下有几项字段，就直接上 `Descriptions`
- 有搜索、有筛选，就直接手拼 `Search + Select + DatePicker`
- 有分组内容，就默认每块包 `Card`
- 有两态切换，就把状态筛选全部做成 `Button`
- 需要层级选择，却仍然使用普通 `Select`
- 需要时间记录，却先写成普通 `List`
- 有局部弹出需求，就直接自造 `absolute` 浮层

## 与本 skill 的关系

- 这份路由文档只解决“先选谁”
- 真正的 layout、ownership、deviation 与 runtime gate 仍回到 `non-typical-pages.md`
- 真正的完整组件范围与误用边界仍回到 `hiui-v5-component-map.md`
