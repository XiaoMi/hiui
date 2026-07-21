# rules-only 隐藏结构基线对齐契约

## 目的

这份文件只解决一个问题：

- `rules-only` 生成的业务页，怎样才能以 reference-only 示例作为隐藏结构基线，并落回宿主真实业务结构

这里说的一致，不是要求业务字段、接口名、按钮文案完全相同，而是要求：

1. 页型一致
2. 区域层级一致
3. 壳层语义一致
4. 关键节奏一致

换句话说，示例页不是“灵感参考”、展示页面或截图参考，而是 `rules-only` / `legacy-host-compatible` 的隐藏结构基线。reference 可以定义结构，但不能拥有路由、菜单或正式交付路径；真实业务页必须落回项目既有业务目录，并由宿主业务路由承接。

当 `plan-page-task` 选择 `generationStrategy=page-component` 时，`rules-only` 业务页的主生成资产是已认证页面级组件；reference / 示例页只作为组件认证、结构基线和 fallback 起点的证据，不再要求每次业务生成都从示例复制。`rules-only` 与 `host-integration` 的差异是“不接入示例 gallery / 示例路由”，不是“不能使用已认证组件”。

## 快速路径：结构基线派生 + 替换业务槽位

当用户需求已经清晰命中一个典型页型，且没有特殊布局、跨页型组合、非典型 section、复杂新增图表或正式 i18n 验收要求时，`rules-only` / `legacy-host-compatible` 默认直接走快速路径：

1. 先按机器计划的 `startFrom` 锁定固定模板、reference / scaffold 或宿主 archetype
2. 前置确认宿主运行链、route owner、shell carrier、region / ownership mapping
3. 从受管起点派生真实业务页
4. 替换业务槽位
5. 剥离示例专用内容
6. 最后做当前页验证

优先级：

- `rules-only`：完全服从机器计划的 `startFrom`。`template` 直接复制 `templates/archetypes/rules-only/<pageType>/page.template.tsx|jsx`；`reference-or-scaffold` 使用 `start-page` 的受管 scaffold / reference 分支；`host-archetype` 先绑定宿主 archetype，再把 reference 壳层语义翻译到该 archetype；任何情况下都不要自由手写页面
- `legacy-host-compatible` / `host-compatible`：默认先消费机器计划给出的 `pageComponent` 与 `runtimeAdapterProof`，直接走普通典型页主链路；只有组件不可用、结构升级、宿主约束特殊，或计划显式进入 `managed-fallback` 时，才优先复制当前仓库同页型宿主 archetype，再使用兼容示例 / reference，仍缺失时才退回 rules-only 标准模板或受管 scaffold 起点。legacy fallback 分支里的复制对象是典型页结构契约，不是标准壳运行时；缺少合格 host archetype、首次适配页型、`startFrom=reference-or-scaffold|scaffold`、涉及 `table-stat` / `tree-split` / drawer / full-page、修改 ownership / shell carrier、出现 warning 或进入正式验收时，必须按 `legacy-host-compatibility.md` 展开 Translation Drift Guard

允许快速替换的业务槽位：

- 页面标题、返回目标、路由 path
- 查询字段、筛选默认值、提交时间 / 时间范围字段
- 指标卡文案与数值来源
- 表格列、行数据映射、行操作
- 表单 / 详情字段
- 接口函数、mock 数据、权限开关

不允许在快速路径中替换的结构事实：

- 页壳类型与宿主承接链
- region 数量与嵌套关系
- 主白底主体、外层留白、主滚动 owner
- 页头、分页、底栏的挂载语义
- row action link 语义
- source marker 与 contract 字段

快速路径不要求在写代码前展开长篇示例映射说明；若使用固定模板、已命名宿主 archetype 或 `reference-or-scaffold` 受管起点，模板 / archetype / scaffold 中已经固化的 region 与 ownership 可作为默认映射。实现前只需写清：`startFrom`、`template / example / host archetype / scaffold`、本次替换的业务槽位、`i18nMode`、route owner、当前页验证计划。正式验收、发布、跨页型重构或 ownership 被修改时，再展开完整映射并执行全量 finalize 链路。

## 调试模式执行顺序

调试 `rules-only` 生成链路时，按下面顺序排查和实现；不要先改业务字段再回头补宿主结构。

1. `Plan Gateway`：先取得 `plan-page-task -- --json` 结果；没有机器计划时不得生成。
2. `Mode Lock`：确认 `mode=rules-only` 来自 project mode lock / bootstrap summary / 机器计划。
3. `Topology / PageType Gate`：确认是 `single-typical-page`，或 `multi-page-workflow` 中的典型页单元。
4. `FastPath Gate`：确认 `fastPath.eligible=true`，且当前页只替换业务槽位。
5. `StartFrom Gate`：完全按 `startFrom` 选择 template / reference-or-scaffold / host-archetype / page-units；`unresolved` 时停止。
6. `Structural Baseline Binding`：绑定唯一 `example path`，并锁定当前受管起点的 template / reference / scaffold / host archetype。
7. `Host Runtime Binding`：前置确认 `host archetype path`、`host adapter family`、`shell inheritance strategy`、`shell carrier path`、`route owner`、`menu group`、权限与布局 owner。
8. `Contract Mapping`：建立 `region mapping`、`ownership mapping`、`semantic contract`，明确 `content-slot / white-body / outer-padding / main-scroll` 的唯一 owner。
9. `Business Page Derivation`：从受管起点派生真实业务页；派生可以是复制模板、使用 scaffold、或把 reference 壳层语义翻译到宿主 archetype，不等于整页复制 reference 后交付。
10. `Slot Replacement`：只替换标题、路由 path、查询字段、指标、表格列、表单 / 详情字段、接口 / mock、权限开关和操作文案。
11. `Demo-only Stripping`：剥离 `PromptCopyFloatingButton`、`examplePrompt`、`typicalExamplePrompts`、示例 gallery 页头动作、示例路由配置、示例菜单分组、`ExampleAppShell` 与不属于业务运行链的 host provider。
12. `Business Route Integration`：页面写入真实业务目录，注册到宿主业务 route owner；不得写入 `.local-context/hiui-design/reference/**`、`src/typical-page-reuse/**` 或 `examples/host-integration/**`。
13. `Page Verification`：执行当前页 `preflight`、预览，以及必要的 lint / build / typecheck 解释。
14. `Formal Acceptance`：发布、提测、合入、无 warning、`source-gate`、`doctor`、`runtime-smoke` 或 `finalize-page` 要求出现时，再追加正式验收链路。

## 快速路径 fail-closed 条件

命中下面任一条件时，必须停止快速路径，先补事实或升级到标准 / 严格链路：

- 没有 Plan Gateway 结果，或 `blockingReasons` 非空
- `topology=unresolved|single-page-composite|non-typical-overlay`
- `pageType` 未命中标准槽位型典型页，或 `fastPath.eligible` 不是 `true`
- `startFrom=unresolved`
- 找不到唯一 `example path`
- 找不到可承接的 template / reference / scaffold / host archetype
- `host archetype` 与 reference 的核心 region 无法对齐
- `route owner`、`shell carrier path` 或 `ownership mapping` 写不清
- 需要修改页壳、滚动、ownership、region 或 mandatory components
- 业务页目标路径落入 `.local-context/hiui-design/reference/**`、`src/typical-page-reuse/**` 或 `examples/host-integration/**`
- reference / gallery 的 demo-only 内容无法剥离

## 架构原则

### 1. 示例定义结构，生成必须从示例照搬起步

- 先选定唯一对应的示例页
- 先照着示例页里的页头、筛选区/表单区、主体区、分页/底栏把壳层完整生成出来
- 宿主只能承接这套已确定的壳层，不能改写“区域语义”
- 若当前项目要求保留既有宿主导航，则示例照搬后的页面默认落在原宿主右侧内容区内，而不是通过独立 layout 重新包一层导航
- 示例 gallery 的 `PromptCopyFloatingButton` / `examplePrompt` 是复制当前示例生成提示词的宿主快捷入口，不属于典型页面内容；照搬示例生成业务页时必须剥离，不得变成页头 action 或页面依赖

例如：

- 示例是 `TablePageFrame + QueryFilter + Table + Pagination`
- 目标项目可以让这套结构落在宿主 `PageTable` / `page-table-v5` 一类承载层上
- 但不能变成“手写 `PageHeader + Search + Table + 自定义分页`”
- 也不能变成“在旧宿主内容区里再嵌一层有自己导航的标准壳”

### 2. 业务页只能替换槽位，不能重写壳层

允许替换的只有：

- 标题
- 路由 path
- 查询字段
- 表格列
- 表单字段
- 详情字段
- 接口函数
- 按钮文案

不允许替换的包括：

- 页壳类型
- 区域数量
- 区域嵌套关系
- 主白底主体的收口方式
- 单滚动链
- 页头、分页、底栏的挂载语义
- shared 组件语义
- shared 骨架样式 ownership
- 示例已定义的关键交互停靠与容器归属

这里的“一致”默认细化为三层：

1. 组件级一致：示例已使用 `PageHeader`、`DashboardControlStrip`、`JoinedTableSection`、`Tag`、`ManagedChartCard` 一类 shared 语义时，业务页默认继续复用，而不是手写外观近似替代品。
2. 样式级一致：header、outer-padding、white-body、table shell、chart body 的骨架样式 owner 不变；业务页不能用局部 style 把这些 owner 抢走。
3. 交互级一致：header action 右停靠、dashboard control strip 无外部字段名且位于 `white-body` 顶部单独一行、row action link 语义、pagination 仍在 table shell 内，这些都属于示例定义的运行时事实，不只是视觉建议。

### 3. 宿主承接的是照搬后的示例壳层，不是视觉近似

如果示例是三段式结构：

- header
- body
- footer

那生成结果也必须仍然是三段式结构，只是具体组件名可能因宿主承载层不同而不同。

如果最终实现只是“看起来差不多”，但结构已经变成了：

- header
- 外层白底 content
- 内层 Card 列表
- 静态 footer

那就不是照搬示例，而是重新发明了一套页面。

## 生成前必须写清的四件事

`rules-only` 生成前，必须先在说明里明确：

1. 本页命中的示例文件路径
2. 本页复用的宿主 archetype / page base 文件路径
3. 示例区域到宿主区域的一一映射
4. 主工作区 ownership 映射：谁拥有 content slot、白底主体、外层留白和主滚动

若命中 `rules-only` 或 `legacy-host-compatible`，还必须额外写清：

5. 当前页使用的 host adapter family
6. 当前页绑定的宿主 archetype 路径会回写到 source contract comment 中
7. 当前页绑定的示例路径会直接回写到 source contract comment 和 root attr 中
8. 若 archetype 声明 `requiredStartFromExample=true`，当前页绑定的受管起点：固定模板路径、宿主 archetype 路径、示例运行时骨架或 `start-page` scaffold / reference 分支

最少写成下面这种格式：

- example: `examples/host-integration/src/pages/full-page-edit.tsx`
- host archetype: `src/views/engineer-management/edit.tsx`
- mapping:
  - header -> 宿主编辑页 header 槽
  - form body -> 宿主 scroll body
  - footer -> 宿主 sticky footer slot
- ownership:
  - content slot -> 宿主 `page-content`，`padding` 归零
  - white-body -> 页面根白底主体
  - main scroll -> 宿主 scroll body
- host adapter: `<adapter family from common.adapter-capabilities.json>`
- startFrom: `<template | host-archetype | reference-or-scaffold>`
- start asset: `<template path | host archetype path | example path + scaffold branch>`

如果这些关键项写不出来，说明当前生成方案还没有完成结构对齐。

快速路径例外：若当前页直接复制固定模板、已命名宿主 archetype，或使用机器计划里的 `reference-or-scaffold` 受管起点，且本次只替换业务槽位，则上述映射可由模板 / archetype / scaffold 默认承接，不要求在实现前手工写成完整说明。此时必须至少写清 `startFrom`、模板 / 示例 / 宿主 archetype / scaffold 路径、业务槽位替换清单、`i18nMode` 与当前页验证计划；一旦修改页壳、ownership、region、source marker 或 mandatory components，就立即退出快速路径，补全本节完整映射。

若是 `rules-only` 或 `legacy-host-compatible`，上面的四项变成七项；若还命中固定模板、宿主 archetype 或 `reference-or-scaffold` 受管起点，则至少变成八项。缺少 `host adapter`、缺少明确的 `host archetype` 绑定、缺少明确的 `example path` 绑定，或机器计划已有 `startFrom` 但说明中没有写出对应起点路径 / 分支，同样不能开始生成。

快速路径下，这些字段优先从已复制的模板 / 宿主 archetype / 受管 scaffold / source marker 中继承，不要求在聊天说明中重复展开；但源码与 contract 中仍必须最终能追溯到唯一 `startFrom`、`template path` / `example path` / `host archetype path` / scaffold 分支与 `host adapter`。如果这些来源不存在或互相冲突，快速路径必须停止，回到完整映射流程。

对列表 / 统计 / 可视化，以及声明 `layout archetype = context-main-split` 的 split 页面，再额外补两项：

8. `shell inheritance strategy`
9. `shell carrier path`

这里的意思不是“这页看起来像哪个壳”，而是“运行时到底是谁在承接这个壳”。

contract 里的 `shell inheritance strategy` 继续只使用 `../../rules/contract-regions.md` 定义的中文值域；若源码需要落 source marker，也统一按那份文档里的 normalized slug 映射序列化，不在本文件再定义第二套值域。

如果这两项写不出来，说明当前方案还没有真正回答“运行时骨架由谁继承”，只能算 source contract 对齐，不算骨架级复用成立。

对 `context-main-split`，这里的 `shell carrier path` 不是泛指“页面看起来有左右两栏”，而是要回答谁在承接 split root、resize handle、`left-context` 与 `right-main` 的 runtime 链。若项目已有 `TreeSplitPageFrame`、`ContextMainSplitScaffold` 或宿主 split helper，不得在业务页重造一套看起来相似的 split 容器。

如果宿主 archetype 自带 `ss-v1-layout__content`、`page-content`、`table-content` 之类的默认内容槽，还必须明确写出：

- 当前方案是“继承该 slot 的默认 `padding / background / overflow`”
- 还是“在页面局部把该 slot 归零，再由 `white-body` 接管”

没有写清 ownership，就不能开始生成。

## 生成后必须沉淀为 contract

`rules-only` 页面完成后，不能只停留在聊天说明或代码注释里，必须补一份页面 contract 到：

- `.local-context/hiui-design/outputs/page-contracts/*.json`
- `.local-context/hiui-design/outputs/page-contracts/*.md`

推荐直接执行：

```bash
npm run typical-page:start-page -- \
  --page-type <page-type-id> \
  --page <generated-page-path>

npm run typical-page:preflight -- \
  --page <generated-page-path>

npm run typical-page:finalize-page -- \
  --page-type <page-type-id> \
  --page <generated-page-path> \
  --archetype <host-archetype-path> \
  --region header=<host-slot> \
  --region white-body=<host-slot> \
  --region query-filter=<host-slot> \
  --region table=<host-slot> \
  --region pagination=<host-slot> \
  --ownership-mode <host-slot-owns-workspace|page-surface-owns-workspace> \
  --ownership content-slot=<host-content-slot> \
  --ownership white-body=<page-surface> \
  --ownership outer-padding=<single-owner> \
  --ownership main-scroll=<single-scroll-owner>
```

这样 `example path + archetype path + region mapping` 才会变成生成物，而不是只留在口头描述里。进入正式验收 / 发布链路时，`finalize-page` 会同步触发 source gate 与 doctor；只要当前页仍有未允许 warning 或 hard fail，正式交付就不能算完成。

普通典型页快速生成只替换业务槽位时，可以先以当前页 `preflight / preview / lint / build` 作为生成完成信号；`source gate / doctor / finalize-page` 保留为正式验收、发布、结构修复或 ownership / marker 变更后的闭环动作。

这里的“未允许 warning”默认按当前页解释：只要 warning 与本次页面直接相关，就不能以“先交付再补”方式放行；仅历史遗留且与本次页面无关的 warning 才允许保留，并且必须在结果中显式写出。

对 `rules-only` / `legacy-host-compatible` 再额外补一条硬规则：

- `typical-page:finalize-page` 的成功结果只对**当次源码快照**有效
- 只要当前页在 finalize 之后继续发生结构、ownership、页壳、mandatory components、source marker 或运行时修复，就必须重新 finalize
- 普通典型页快速生成中，仅替换中文业务文案、字段、列或 mock 数据时，可以先以当前页 preflight / preview / lint / build 作为生成完成信号；进入正式验收或发布前再重新 finalize
- 旧 contract、旧截图、旧 `doctor PASS`、旧浏览器验收结果都不得继续代表当前页
- 若当前页修复过白屏、Provider/Portal 缺失、滚动链错误、双白底/双工作区、组件语义错误等运行时问题，默认视为 contract 已失效，必须重新闭环

对 `rules-only` / `legacy-host-compatible`，生成后的源码还必须显式留下：

- `/* hiui-design host-adapter: <adapter family> */`
- `/* hiui-design host-archetype: <host-archetype-path> */`
- `/* hiui-design example: <example-path> */`
- `/* hiui-design template: <template-path> */`（若当前 archetype 绑定了固定模板）
- `data-hiui5-example="<example-path>"`
- `data-hiui5-host-adapter="<adapter family>"`
- `data-hiui5-template="<template-path>"`（若当前 archetype 绑定了固定模板）

这些 source marker 缺一不可。它们的目的不是“写注释”，而是把“本页就是从哪一个示例照搬出来的”变成 source gate 可检查的硬证据。

若命中列表 / 统计 / 可视化页，再补一组骨架继承 marker：

- `/* hiui-design shell-inheritance: <normalized source marker slug from ../../rules/contract-regions.md> */`
- `/* hiui-design shell-carrier: <shared helper path or packaged shell path> */`
- `data-hiui5-shell-inheritance="<normalized-source-marker-slug>"`
- `data-hiui5-shell-carrier="<...>"`

它们的目的不是为了多写 marker，而是把“当前页到底有没有复用真实 shell carrier”变成 source gate 可核验的事实，而不是只看 comment 里有没有写 `shell=StatListPageFrame`。这些 marker slug 只用于源码序列化，不替代 contract 的中文值域。

若当前页缺少这些 source marker，却仍试图依赖 `doctor`、selector 名称或截图肉眼判断完成，直接按未对齐处理。

## 跨页型 structural guard

`rules-only` 的根问题，不是“有没有读到某一页型的说明”，而是是否守住了所有页型共享的结构约束。

下面这些约束对所有页型都成立：

1. 只能绑定一个示例页
2. 只能绑定一个宿主 archetype
3. 必须写出 example -> host 的关键 region 映射
4. 必须写出 content slot / white-body / padding / scroll 的 ownership 映射
5. 只能照搬示例壳层，不能从 primitive 自由拼页壳
6. 最终页面的主从关系必须与示例一致

对 `rules-only` / `legacy-host-compatible` 再补一条：

7. 必须命名唯一的 host adapter family，并把它挂到真正承接 header / white-body / footer 的 shell carrier 上
8. 若页面属于列表 / 统计 / 可视化页，必须明确唯一 `shell carrier`，并把 header / control strip / table footer 的运行时承接链绑定到它上面

这里说的“主从关系”至少包括：

- 页头是否独立
- 主体是否为单一主要工作区
- 分页 / sticky footer 是否属于主工作区的一部分
- 滚动链是单链还是多层嵌套
- 白底主体是一个主容器，还是被拆成多张散白卡

因此，`rules-only` 下不允许出现下面这类逃逸路径：

- 先手写一页 `PageHeader + Search + Table`
- 再补几条样式去“接近”示例
- 最后声称这是宿主兼容实现
- 先生成过一次 contract 或跑过一次 doctor
- 后续继续改页面结构 / 修运行时 bug
- 最后拿旧 contract 或旧 `doctor PASS` 声称页面已经完成对齐
- 页面源码自己手写 `PageHeader + query-filter + table + pagination` 的完整骨架，再用注释或 data attrs 声称“这页来自 `StatListPageFrame` / `TablePageFrame`”
- `table-basic` / `tree-table` 声明 `shell=TablePageFrame`，但源码没有直接挂 `<TablePageFrame>`，也没有命名 shared shell-carrier；这会让标准壳的筛选区、表格区、分页区间距链失去机器可检载体
- 只复制了 `QueryFilter` 的 `padding-inline: 20px`，却遗漏 `TablePageFrame.tableContainer` 的 `padding: 0 20px`，导致表格列贴到白底主体左右边缘
- 因为右栏内容复杂，就把 `context-main-split` 改挂到 `ProDetailPage` / `ProEditPage`，再手写 `workspace + leftPane + rightPane + splitter`
- `PageHeader` 虽然还在，但根节点已经被业务页改造成新的 flex/grid 布局壳，导致 `extra` 区不再由标准 header 节奏右停靠
- `dashboard-control-strip` 继续按“表单字段”方式渲染一排字段名，再在下面放分段按钮或下拉框
- `dashboard-control-strip` 被包成灰底查询面板，或与真实 `QueryFilter` / 关键词搜索 / 时间范围字段共挤在一条混合控制行
- 图表卡只是普通白卡 + 裸 `<Area /> / <Line /> / <Bar />`，没有机器可检的 chart body 载体
- 表格和分页被拆成两个并列 block，只靠外层留白营造“像在一个壳里”

这不是适配，而是重新发明页面。

## ownership 映射必须结构化落盘

`rules-only` / `legacy-host-compatible` 页面在真正开始写业务代码前，必须先输出并落盘下面 4 个 owner：

- `content-slot owner`
- `white-body owner`
- `outer-padding owner`
- `main-scroll owner`

推荐只使用固定枚举值：

- `host-slot`
- `page-root`
- `white-body`
- `section-root`
- `main-content-outlet`
- `none`

### 额外 guard

- `outer-padding owner` 与 `white-body owner` 不得在不同页面局部 wrapper 上重复承接同一圈外层留白
- 若已选择 `host-slot` 承接 `content-slot owner`，默认优先继续由宿主承接 `outer-padding owner`，除非 page contract 明确声明页面局部已把该 slot 归零
- 若页面出现 `workspace`、`container`、`shell`、`body` 一类泛化容器名称，必须在 contract 中明确它是否就是 `white-body`；若不是，默认不得让它承接 `padding / background / border-radius / overflow`
- 若最终 DOM 呈现为“宿主 content slot + 页面根 + 局部 section-root”三层同时承担主体视觉责任，直接按 ownership 映射失败处理

### 常见反模式：Region Spacing Promoted To Shell Padding

失败表现：

- 为了复刻局部 region 的 `20px` 或 `16px`，先在页面根 `workspace` 上写横向 `padding`
- 内层 `white-body` 或 `section-root` 继续拥有白底主体和自身 `padding`
- 最终形成双层外层留白或三层工作区

修正方式：

- 先判断当前 spacing 属于 `outer-padding` 还是某个具体 region
- 若属于 region，则只写在该 region owner 上
- 若属于 `outer-padding`，则 `host-slot` 与页面局部 owner 二选一，不得两者并存

### 常见反模式：伪 `TablePageFrame`

失败表现：

- contract / comment / `data-hiui5-shell` 写 `TablePageFrame`
- 运行时代码没有 `<TablePageFrame>`，而是在业务页局部手写 `PageHeader + ProListPage + QueryFilter + Table`
- 筛选区看起来有标准左右留白，但表格区没有 `TablePageFrame.tableContainer` 的水平 inset
- 表格表头、固定操作列或分页直接贴到 `white-body` 左右边缘

修正方式：

- 首选直接挂 `TablePageFrame`，把 `title / extra / queryFields / tableFields / searchPlaceholder / tableProps` 交给标准壳
- 若宿主必须翻译为本地列表基座，必须抽成命名 shared shell-carrier，并在源码声明 `hiui-design shell-carrier:` / `data-hiui5-shell-carrier`
- shared shell-carrier 必须同时承接 header、query-filter、table body、pagination，并暴露 table body 水平 inset；不要在单个业务页散落这些样式
- source gate 必须把“声明 `TablePageFrame` 却手拼骨架且无 table body inset”判为失败

## page contract 必须覆盖的结构区域

page contract 不只是“这页来自哪个示例”，还必须覆盖该页型最关键的结构区域。缺任一区域，都说明生成页还没有真正对齐示例。

### 普通表格 / 树形表格

- `header`
- `white-body`
- `query-filter`
- `table`
- `pagination`

### 数据统计表

- `header`
- `white-body`
- `stat-section`
- `query-filter`
- `table`
- `pagination`

### 左树右表

- `header`
- `split-workspace`
- `left-tree`
- `right-list`
- `query-filter`
- `table`
- `pagination`

### 抽屉表单

- `header`
- `drawer-body`
- `form-body`
- `drawer-footer`

### 抽屉详情

- `header`
- `drawer-body`
- `detail-body`
- `drawer-footer`

### 全页编辑

- `header`
- `white-body`
- `form-body`
- `footer`

### 全页详情

- `header`
- `white-body`
- `detail-body`

如果这些 region 写不出来，通常说明当前方案仍处在“看起来差不多”的阶段，而不是已经完成照搬生成。

## 页型对齐矩阵

### 普通表格

- 对齐示例：`examples/host-integration/src/pages/basic-table.tsx`
- 必保留：
  - `TablePageFrame` 语义
  - `QueryFilter` 语义
  - 单一白底主体里包含筛选、表格、分页
  - 标题右侧操作区仍是 header extra
  - 若存在操作列，固定列语义必须保留
- 常见错误：
  - 退回手写 `PageHeader + Search + Table`
  - 分页漂到白底主体外
  - 操作按钮掉进筛选区

### 数据统计表

- 对齐示例：`examples/host-integration/src/pages/table-stat.tsx`
- 必保留：
  - `StatListPageFrame` 语义
  - `StatOverviewGrid` 语义
  - 指标卡、筛选、表格、分页在同一白底主体内
  - 指标卡宽度充足时优先一行铺满
  - 标题操作区仍走 `proStatPageStyles.headerExtra`
- 常见错误：
  - 指标区拆出主体外
  - 指标卡写死 3 列
  - 用裸文本块代替统计卡

### 树形表格

- 对齐示例：`examples/host-integration/src/pages/tree-table.tsx`
- 必保留：
  - 树结构在表格内部展开
  - 仍是表格页语义，不是左右 split 工作区
- 常见错误：
  - 误判成左树右表

### 左树右表

- 对齐示例：`examples/host-integration/src/pages/inventory-split.tsx`
- 必保留：
  - 左树区与右侧列表区处于同一个 split 工作区
  - 右侧仍是 `QueryFilter + Table + Pagination` 语义
- 常见错误：
  - 左右变成两张白卡
  - 右侧失去列表页语义，退回自由拼装

### 抽屉表单

- 对齐示例：`examples/host-integration/src/pages/drawer-form.tsx`
- 必保留：
  - `宿主适配页头 portal + PageHeader`
  - `ProFormDrawer`
  - `ProDrawerFooterActions`
  - `SchemaForm` 顶部标签
  - 两列布局默认 `rowGap: 0`
- 常见错误：
  - 在 drawer body 里再包一层 `Card`
  - footer 按钮掉到 body 末尾

### 抽屉详情

- 对齐示例：`examples/host-integration/src/pages/drawer-detail.tsx`
- 必保留：
  - 抽屉详情壳层
  - 描述项语义
  - 标题、body、footer 保持一个抽屉结构
- 常见错误：
  - 把全页详情布局塞进抽屉

### 全页编辑

- 对齐示例：`examples/host-integration/src/pages/full-page-edit.tsx`
- 必保留：
  - `ProEditPage` 语义
  - `宿主适配页头 portal + PageHeader`
  - `formScrollBody`
  - `inlineEditFooter`
  - `inlineEditFooter` 与 `formScrollBody` 是同级兄弟
  - 默认三栏、横向 `gutter: 40`、纵向 `row-gap: 0`
  - 主体区到底栏上方保持单一白底和单滚动链
- 常见错误：
  - 回退成 `Card + Form + footer`
  - 外层白底主体里再套一级分组 `Card`
  - `1366px` 提前退两栏
  - 表单纵向 gap 被 grid 放大
  - 页头下再叠一层 `8px` 外边距
  - 底部操作区不吸底

### 全页详情

- 对齐示例：`examples/host-integration/src/pages/full-page-detail.tsx`
- 必保留：
  - `ProDetailPage` 语义
  - `宿主适配页头 portal + PageHeader`
  - 分组式 `Descriptions`
  - 详情布局按 3 列节奏展开
  - 字段主表达仍然是 `Descriptions` / `SchemaDescriptionsBridge`，而不是一组自造 `fieldCard`
  - 媒体内容仍属于 `detail-body` 的分组内只读内容，不额外生成第二套 hero / media 卡片体系
- 常见错误：
  - 根容器统一补 `padding: 20px`
  - 分组块叠描边或阴影
  - 为了展示机构编码、名称等信息额外造一个 `heroCard`
  - 用 `fieldGrid + fieldCard` 灰底字段卡替代 `Descriptions`
  - 把返回行为放进 `titleExtra` 右侧按钮，而不是 leading `onBack`
  - 用 `createMockImage` / `data:image` 生成大体积示例图片，导致媒体资源异常膨胀

## 允许变化的边界

下面这些可以根据业务变化：

- 查询字段数量
- 表格列数量
- 表单字段数量
- 某些宽控件是否整行
- 某些按钮是否出现
- 是否复用宿主现成基座而不是直接导入壳包

下面这些不能变化：

- 页型
- 页壳层级
- 区域相对位置
- 单白底主体的收口方式
- 页头、筛选区/表单区、主体区、分页/底栏之间的主从关系
- 关键间距基线

## 失败信号

只要出现下面任意一类，都说明当前实现已经偏离示例：

- 生成说明里说不出本页对应的示例文件
- 生成说明里说不出宿主 archetype 文件
- page contract 里缺关键 region，或者多个 region 被糊成一个 `main`
- 最终页面比示例多出一层主容器
- 最终页面新增了示例中不存在的主工作区容器、滚动容器、白底容器或底栏包层
- 宿主 content slot 和页面 `white-body` 同时持有外层 `padding / background / border-radius`，导致主体被额外再缩进一层
- page contract 已声明某个宿主 archetype，但实际代码又额外起了一套不属于该 archetype 的通用 `Layout / whiteBody / Card` 页面骨架
- 直接从 primitive 组合起步，例如手写 `PageHeader + Search + Table`、`PageHeader + Card + Form + footer`
- 全页详情出现 `heroCard`、`fieldCard`、`mediaCard` 一类示例中不存在的摘要卡 / 字段卡 / 媒体卡主容器
- 全页详情没有 `Descriptions` 语义，却改成自造字段网格或灰底信息卡
- 全页详情用 `titleExtra` 右侧返回按钮替代 leading `onBack`
- 详情页媒体资源直接内联 `data:image` 或运行时拼接大 SVG / Base64，导致资源体积失控
- 示例是 header extra，生成页却把按钮塞进筛选区或标题后
- 默认标题被自由扩写成副标题、说明文案或额外操作条
- 示例是 sticky footer，生成页却变成静态 footer
- 示例要求分页属于主工作区，生成页却缺分页或把分页挂到主体外
- 示例是三栏，生成页在桌面宽度仍充足时提前降两栏
- 示例字段竖向节奏来自 `FormItem`，生成页却额外叠出 `row-gap`
- 示例是单一白底主体，生成页却变成“灰底页面 + 单张大白卡”
- 左树右表被拆成左右两张白卡
- 全页编辑 / 抽屉页出现双层主容器，导致滚动链和吸底关系断裂

## 最低验收

- 每个 `rules-only` 业务页都能指出唯一对应的示例页
- 每个 `rules-only` 业务页都能指出唯一对应的宿主 archetype
- 生成说明里已经写出 example -> host archetype -> 业务页 的映射链
- page contract 已覆盖该页型要求的全部关键 region
- 最终实现只替换业务槽位，没有重写示例壳层
- 若宿主限制导致不能 1:1 落标准组件，也仍能保证区域层级与关键节奏和示例一致
- 当前页不存在未解决的 hard fail 或与当前页直接相关的 warning
- 已完成一次真实页面 / DOM / 控制台与视觉验收信号核对；至少确认没有“灰底页面 + 单张大白卡”回退、没有双层主工作区 / 双层白底主体、没有标题下方大面积空白
- 若同一根因修复后复测仍失败 2 次，已回到示例页与宿主 archetype 重新判定，而不是继续沿错误壳层补 patch
