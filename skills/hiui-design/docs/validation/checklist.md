# 验收清单

这份文件现在只做**解释层补充**，默认 gate 统一以 `../../rules/validation-checklist.md` 为准。

它不再平行维护：

- 一套新的页面完成定义
- 一套新的最终回复前收口动作
- 一套新的 kickoff 前置字段
- 一套新的 contract 字段
- 一套新的组合页实现前清单

对应事实源如下：

- 首轮输出格式：`../generation/ai-kickoff-template.md`
- 生成原则与阶段门槛：`../../rules/generation-rules.md`
- contract 字段：`../../rules/contract-regions.md`
- 组合页增量要求：`../generation/implementation-checklist-template.md`
- 正式页面质量验收证据与页面完成门槛：`../../rules/validation-checklist.md`
- 最终回复前统计收口：`PRIVACY.md`

布局相关的跨页型误区，统一额外对照 `../generation/layout-anti-patterns.md`。

## 这份文件还保留什么

它只保留两类内容：

1. 如何理解正式验收证据
2. 做人工走查时优先看哪些高风险信号

## 人工走查优先级

### 1. 宿主层

先确认宿主基线没有失败，再看页面本身：

- header / footer 挂载点存在且指向同一份 host provider
- 页面所在内容列满足连续高度链，必要时 `overflow: hidden`
- 没有双宿主、双 provider、双 app shell
- `@hiui-design/typical-page-shells` 样式资源真实生效

### 2. 页面结构层

先确认页面没有壳层翻译失败：

- 页面使用固定页壳，而不是手拼壳层
- 菜单标题与 `PageHeader title` 一致
- 不存在双层主工作区、双层白底主体或双滚动容器
- 不存在“标题下方大段空白 / 页面整体下推”这类双宿主症状

### 3. 组件继承层

先确认没有把语义组件重新翻译成业务页自造 DOM：

- `PageHeader`、`QueryFilter`、`Table`、`Descriptions`、`Timeline`、`Empty`、`Tag`、`Progress`、`Steps` 保持真实复用
- 风险 / 状态表达继续走 `Tag` 或 shared renderer
- 若存在绕开现成组件的实现，必须有明确 bypass 原因

### 4. 国际化层

先确认页面没有把 i18n 留在“后补”状态：

- 页面标题、按钮、列标题、字段 label、placeholder、反馈文案、图表标题来自 locale 资源或 bridge
- 日期、时间、数字、金额、百分比走 locale-aware formatter / API
- RTL 与文本膨胀没有把页头、表头、按钮和字段区挤坏

### 5. 真实浏览器层

先确认没有只凭静态校验判定完成：

- 已做一次真实页面 / DOM / 控制台核验
- 命中 `page-scroll`、sticky footer、split workspace、左右栏独立滚动、图表区与明细表连续滚动等场景时，已补浏览器级 smoke 或等价校验

## 高风险症状速查

出现以下症状时，优先回到 owner 文档重新判定，不要直接补局部样式：

- 标题下方出现大段空白
- 页面退化成“灰底页面 + 单张大白卡”
- `PageHeader` / `QueryFilter` / `Table` 被宿主样式挤坏
- split 页面左右栏一起滚，或 page root / workspace 抢走 scroll owner
- 表格把 `white-body`、`split workspace` 或右栏横向撑破
- `primary-secondary` 后方还有通栏主内容，但分栏区没有先做视觉闭合

## 回查顺序

当人工验收发现问题时，默认按下面顺序回查：

1. `../../rules/validation-checklist.md`
2. `../../rules/generation-rules.md`
3. `../../rules/contract-regions.md`
4. `../generation/non-typical-pages.md` 或当前页型专章
5. `../generation/layout-anti-patterns.md`

## 结论

正式页面质量验收是否通过，统一以 [validation-checklist.md](../../rules/validation-checklist.md) 为准。

若当前任务生成或实质性修改了页面，企业内部版最终回复前的统计收口统一以 [PRIVACY.md](../../PRIVACY.md) 为准；开源版按 `PRIVACY.md` 关闭 usage collection，只呈现不适用 / 已跳过 / 不可用状态。

这份文件只用于帮助人工更快定位问题，不再单独定义“什么叫完整结束”。
