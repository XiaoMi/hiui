# AI 固定起手模板

这份文件只负责一件事：定义 `hiui-design` 页面任务的**首轮输出格式**。

它不负责：

- 判定顺序
- 阶段门槛
- contract 字段定义
- 组合页增量检查
- 交付验收证据

上述内容统一分别看：

- 生成原则与阶段门槛：`../../rules/generation-rules.md`
- contract 字段唯一事实源：`../../rules/contract-regions.md`
- 组合页增量要求：`implementation-checklist-template.md`
- 非典型 / overlay 布局事实：`non-typical-pages.md`
- 交付验收证据：`../../rules/validation-checklist.md`

页面生成阶段默认**读取并确认**项目既有 `mode` 事实；只有当项目事实缺失、过期或互相冲突时，才重新判定。

## 固定起手顺序

首次回复默认按下面顺序输出；不要打乱顺序。

1. `mode`
2. `topology`
3. `page units`（仅在 `topology = multi-page-workflow` 或 `single-page-composite` 时输出）
4. `generation strategy`
5. `startFrom`
6. `page type docs`
7. `page type`
8. `example path`
9. `host archetype path`
10. `shell inheritance strategy`（仅在 `rules-only` / `legacy-host-compatible` 的 `table-basic` / `table-stat` / `data-visualization` / `tree-table` 时输出）
11. `shell carrier path`（仅在 `rules-only` / `legacy-host-compatible` 的 `table-basic` / `table-stat` / `data-visualization` / `tree-table` 时输出）
12. `mandatory components`
13. `shared component inheritance`
14. `style inheritance contract`
15. `interaction inheritance contract`
16. `i18nMode`（`none` / `key-only` / `full`；只有 `full` 才展开完整 `i18n strategy`）
17. `layout strategy`（仅在未命中典型页型，或命中 overlay 需要额外内部布局判断时输出）
18. `non-typical scope`（仅在进入非典型 / overlay 路径时输出）
19. `layout archetype`（仅在当前非典型 / overlay 页面还命中稳定布局 archetype 时输出，例如 `context-main-split`）
20. `primary semantic components`（仅在进入非典型 / overlay 路径且所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时输出）
21. `rejected alternatives`（仅在进入非典型 / overlay 路径且所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时输出）
22. `why not custom container`（仅在进入非典型 / overlay 路径且所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时输出）
23. `import path discipline`（仅在进入非典型 / overlay 路径且所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时输出）
24. `composition guardrails`（仅在进入非典型 / overlay 路径时输出）
25. `root chrome policy`（仅在进入非典型 / overlay 路径时输出）
26. `split shell inheritance strategy`（仅在 `layout archetype = context-main-split` 时输出）
27. `split shell carrier path`（仅在 `layout archetype = context-main-split` 时输出）
28. `split resize strategy`（仅在 `layout archetype = context-main-split` 时输出）
29. `resize handle selector`（仅在 `layout archetype = context-main-split` 时输出）
30. `split pane contract`（仅在 `layout archetype = context-main-split` 时输出）
31. `split risk check`（仅在 `layout archetype = context-main-split` 时输出）
32. `split-section closure strategy`（仅在 `layout strategy = primary-secondary` 且后方仍有同级通栏主内容时输出）
33. `chart baseline checklist`（仅在页面实际渲染图表时输出）
34. `table hard-gate verdicts`（仅在表格类页型或右侧表格工作区场景时输出）

## 固定起手格式

```md
mode: <host-integration | rules-only | legacy-host-compatible>
topology: <single-typical-page | multi-page-workflow | single-page-composite | non-typical-overlay | unresolved>
page units: <only when topology has multiple intent units; list role + pageType + generation order>
generation strategy: <copy-template-or-host-archetype-and-replace-business-slots | run-fast-path-per-page-unit | reuse-existing-contract-for-minor-edit | resolve-composite-layout-before-generation | non-typical-constrained-assembly | resolve-page-type-before-generation>
startFrom: <template | host-archetype | reference-or-scaffold | page-units | unresolved>
page type docs: <pageTypeDocs from plan-page-task>
page type: <page-type>
example path: <path>
host archetype path: <path>
shell inheritance strategy: <only when needed>
shell carrier path: <only when needed>
mandatory components: <list>
shared component inheritance: <summary>
style inheritance contract: <summary>
interaction inheritance contract: <summary>
i18nMode: <none | key-only | full; full 时补 i18n strategy summary>
layout strategy: <only when needed>
non-typical scope: <only when needed>
layout archetype: <only when needed>
primary semantic components: <only when needed>
rejected alternatives: <only when needed>
why not custom container: <only when needed>
import path discipline: <only when needed>
composition guardrails: <only when needed>
root chrome policy: <only when needed>
split shell inheritance strategy: <only when layout archetype = context-main-split>
split shell carrier path: <only when layout archetype = context-main-split>
split resize strategy: <only when layout archetype = context-main-split>
resize handle selector: <only when layout archetype = context-main-split>
split pane contract: <only when layout archetype = context-main-split>
split risk check: <only when layout archetype = context-main-split>
split-section closure strategy: <only when needed>
chart baseline checklist: <only when needed>
table hard-gate verdicts: <only when needed>
```

### chart baseline checklist

```md
chart-section ownership: <value>
chart stack: <value>
theme baseline: <value>
interval spacing baseline: <value>
chart selection baseline: <value>
area point policy: <value>
approved deviations: <value or none>
```

### table hard-gate verdicts

```md
QueryFilter: <available | unavailable>
FilterDrawer: <available | unavailable>
Table.resizable: <available | unavailable>
Table.setting: <available | unavailable>
```

### shell inheritance summary placeholder

```md
shell inheritance strategy: <summary only; canonical contract value see ../../rules/contract-regions.md>
shell carrier path: <runtime chain summary>
```

### inheritance facts

```md
shared component inheritance:
  - header: <PageHeader / shared frame / host slot>
  - filter/control strip: <QueryFilter / DashboardControlStrip / host bridge>
  - status tag: <Tag / shared status renderer>
  - table shell: <JoinedTableSection / list frame / host table shell>
  - chart body: <ManagedChartCard / approved chart carrier>
  - page-local bypasses: <none or explicit reasons; each bypass must state capability gap + adapter path + token bridge path>
style inheritance contract:
  - header owner: <shared shell / host portal>
  - outer-padding owner: <shared shell / host slot / page root>
  - white-body owner: <shared shell / page surface>
  - table shell owner: <shared shell / list frame>
  - chart body owner: <shared helper / chart card>
  - forbidden local overrides: <list; include HiUI public skeletons and page-level owners that bypass components may not take over>
interaction inheritance contract:
  - header actions docking: <PageHeader.extra right-docked>
  - dashboard control strip: <unlabeled segmented + internal select labels>
  - row actions: <primary link / single-line>
  - status semantics: <Tag / shared renderer>
  - table-pagination relationship: <same shell/footer chain>
```

### non-typical / overlay layout facts

```md
layout strategy: <value>
non-typical scope: <which first-level groups may be freely reorganized>
layout archetype: <value or none>
layout strategy reason: <value>
group counting: <value>
group hierarchy: <value>
content-slot owner: <value>
white-body owner: <value>
outer-padding owner: <value>
main-scroll owner: <value>
composition guardrails:
  - base archetype: <value>
  - mandatory components stay primary: <value>
  - page-level spacing owner: <value>
  - root chrome policy: <host-flush-root | page-surface-root | shared-shell-root>
  - shared shell prop policy: <shared shell props may carry markers/class hooks only; page code must not inject geometry-changing style overrides into pageRootStyle / whiteBodyStyle / style-bearing pageRootProps / whiteBodyProps>
  - shared baseline reuse: <value>
  - bypass containment: <third-party stays inside adapter / section body and cannot become white-body / outer-padding / main-scroll owner>
  - approved deviations: <value or none>
root chrome policy: <host-flush-root means page root is layout-only: no page-level padding/background/radius/overflow:auto|scroll; page-surface-root means page root also owns continuous white-body/page-surface>
split-section closure strategy: <only when primary-secondary continues into later full-width content>
```

### non-typical component routing facts

```md
primary semantic components:
  - <first-level group>: <chosen HiUI component(s)>
  - <first-level group>: <chosen HiUI component(s)>
rejected alternatives:
  - <group>: not <alternative> because <reason>
  - <group>: not <alternative> because <reason>
why not custom container:
  - <group>: no `heroCard / infoStrip / customInfoBlock` because <reason>
import path discipline:
  - hiui components: `@hi-ui/hiui`
  - icons: `@hi-ui/icons`
  - shell / bridge components: <public shell path or none>
```

当页面进入非典型 / overlay 路径，且所需组件超出 `../hiui-v5-quick-reference.md` 覆盖范围时，这四组事实视为 kickoff 必填项。

这里的四组事实至少回答：

- 哪一个一级信息组优先落到哪一个 HiUI 组件
- 为什么不是另一个看起来相似的组件
- 为什么不需要 `heroCard / infoStrip / customInfoBlock`
- 组件导入来自 `@hi-ui/hiui`、`@hi-ui/icons` 还是公开壳层路径

若这些事实仍说不清，按“尚未进入实现阶段”处理。

### 非典型组件显式命名要求

- 当一级信息组的主语义落在录入、选择、浮层、反馈、时间线或层级浏览时，不要只写 `form`、`filter`、`overlay`、`feedback`、`tree area` 这类泛词；要直接写出命中的 HiUI 组件名，例如 `Form`、`Input`、`Textarea`、`NumberInput`、`DatePicker`、`Search`、`Select`、`TreeSelect`、`Cascader`、`Radio`、`Checkbox`、`Switch`、`Drawer`、`Modal`、`Popover`、`Message`、`Timeline`、`Tree`
- 若页头动作区依赖 `Space + Button` 排布，`primary semantic components`、`rejected alternatives` 或 `composition guardrails` 至少一处显式写出 `Space` 与 `Button`
- 若工作区存在结构化列表并带翻页，`primary semantic components`、`composition guardrails` 或 `table hard-gate verdicts` 至少一处显式写出 `Table + Pagination` 或 `List + Pagination`

当页面存在非 HiUI 组件时，`page-local bypasses` 不能只写“用了某组件”。至少要回答：

- 它补的是哪一个 HiUI 当前没有覆盖的能力缺口
- 业务页通过哪一个 adapter / bridge 承接该组件，而不是把裸第三方组件散落在页面根和壳层链路里
- 视觉 token 通过哪一层 token bridge 映射回 HiUI 基线，而不是沿用库默认 palette / typography / radius / shadow

`shared baseline reuse` 在这类场景下至少要写清颜色、字号、圆角、边框和阴影是否继续复用 `hiui5-visual-baseline.md`；若没有答案，按“尚未进入实现阶段”处理。

### context-main-split summary placeholder

```md
layout archetype: context-main-split
left pane role: context / selection / narrowing
right pane role: main task
split shell inheritance strategy: <summary only; canonical contract value / source marker mapping see ../../rules/contract-regions.md>
split shell carrier path: <runtime chain summary>
page-level actions owner: <summary>
split resize strategy: <summary only; detailed splitPaneContract fields see ../../rules/contract-regions.md>
resize handle selector: <summary only>
split pane contract: <summary / reference to locked contract facts, not a second schema>
split risk check: <summary>
```

## 非典型页面 kickoff 示例

下面这段示例只演示“首轮输出应该长什么样”，不替代真实页型、contract 或 ownership 判定。

```md
mode: rules-only
page type: data-visualization
example path: examples/host-integration/src/pages/data-visualization.tsx
host archetype path: templates/archetypes/rules-only/data-visualization/page.template.tsx
mandatory components: PageHeader, Tag, Alert, ManagedChartCard, JoinedTableSection, Table, QueryFilter
shared component inheritance: header 继续走 host header carrier；图表继续走 shared chart card；风险状态继续走 Tag / Alert；明细区继续走 JoinedTableSection
style inheritance contract: white-body owner 保持 shared shell；page-level spacing 不下放到业务 section；局部信息块才允许 Card
interaction inheritance contract: header actions 仍右停靠；筛选仍由 QueryFilter 承接；表格与分页仍处于同一 shell/footer 链
i18nMode: full；标题、标签、图表标题、tooltip、表头与按钮文案全部走 locale 资源
layout strategy: primary-secondary
non-typical scope: 图表区之外新增“风险提醒”和“运营建议”两个一级分组；表格工作区与页头链路不改
layout archetype: none
primary semantic components:
  - page-header secondary info: Tag + text row
  - risk reminder: Alert
  - core trend analysis: ManagedChartCard
  - supporting recommendation list: List
  - detail workspace: QueryFilter + Table + Pagination
rejected alternatives:
  - page-header secondary info: not Descriptions because it only serves title-adjacent identification, not detail body
  - risk reminder: not Result because it is an in-flow reading notice, not a terminal outcome state
  - supporting recommendation list: not Card grid because entries are heterogeneous and read sequentially
why not custom container:
  - risk reminder: no heroCard because Alert already owns the warning semantics
  - recommendation area: no infoStrip because List already matches the reading pattern
import path discipline:
  - hiui components: @hi-ui/hiui
  - icons: @hi-ui/icons
  - shell / bridge components: @hiui-design/typical-page-shells and approved shared chart helpers only
composition guardrails:
  - base archetype: data-visualization
  - mandatory components stay primary: chart section and joined table shell remain unchanged
  - page-level spacing owner: shared shell
  - shared shell prop policy: no pageRootStyle / whiteBodyStyle geometry overrides
  - shared baseline reuse: hiui5 visual baseline + shared chart theme
  - bypass containment: none
  - approved deviations: add two first-level groups inside body only
chart baseline checklist:
  chart-section ownership: ManagedChartCard / shared chart carrier
  chart stack: @ant-design/charts
  theme baseline: shared chart theme
  interval spacing baseline: shared helper
  chart selection baseline: host default
  area point policy: no point markers by default
  approved deviations: none
table hard-gate verdicts:
  QueryFilter: available
  FilterDrawer: available
  Table.resizable: available
  Table.setting: available
```

这段示例的重点不是具体页面长什么样，而是下面四件事：

- 先说明哪些一级信息组保持原 archetype，不要一上来就把整页改判成“自由页”
- 标题下元信息、阅读型提示、异构推荐项、明细工作区分别落到不同组件，不混成一种 `Card`
- 明确写出 rejected alternatives，而不是只给一个“我选了什么”
- 在 kickoff 阶段就说明为什么不需要 `heroCard / infoStrip / customInfoBlock`

## 使用说明

- 这份文件只要求“首轮输出长什么样”，不要求在此重复解释字段含义。
- 字段含义、是否必填、何时阻断，统一由 `generation-rules.md`、`contract-regions.md`、`non-typical-pages.md`、`implementation-checklist-template.md` 定义。
- 若示例里出现 summary placeholder，不要把它扩写成另一套值域、contract 子字段或阻断条件；直接回 owner 文档取定义。
- 验收阶段不要回到本文件抄条件；统一以 `validation-checklist.md` 为准。

## Pre-plan Facts Kickoff（截图 / 旧系统转译特例）

普通页面任务首轮仍只解释 `plan-page-task` 输出的 `page-task-plan.v1`。只有 `DetectSourceInput` 命中不规范原型截图、旧系统截图 / URL / 源码时，才允许使用 `kickoffType=pre-plan-facts`。

`kickoffType=pre-plan-facts` 只能解释 `visual-translation-brief.v1` 与必要的 `host-qualification-facts.v1` 状态，不得推理或输出 `page-task-plan.v1` 字段。

允许字段：

- `kickoffType: pre-plan-facts`
- `visualTranslationStatus`
- `visualTranslationStatusReasons`
- `source`
- `businessObject`
- `primaryGoal`
- `pageTypeCandidates`
- `preserve`
- `discard`
- `prePlanBlockingFacts`
- `blockingIssues`
- `blockingReasons`
- legacy 触发时的 `hostQualificationStatus`、`automationLevel`、`modeLock`、`componentQualification`、`translationMapRefs`、`hostFactsFreshnessStatus`

禁止字段：

- `status`
- `taskLevel`
- `topology`
- `pageType`
- `pageUnits`
- `targetPage`
- `startFrom`
- `fastPath`
- `requiredDocs`
- `requiredActions`
- `acceptanceLevel`
- `acceptanceProfile`
- `finalReportContract`

facts ready 后必须运行 `plan-page-task`；在 `plan-page-task --brief --host-facts` 接入前，facts 只能作为需求上下文 / 附件，不是机器可消费计划输入。不得手工模拟 `page-task-plan.v1`。
