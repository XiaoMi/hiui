# 完全非典型页面 AI 前置引导

## 目标

本文件用于约束 `non-typical-page` 家族在写代码前的判断顺序。

它解决的是：

- 这是不是一个完全非典型页面
- 在还没开始写代码前，最小决策包能否形成
- 哪些情况下必须 stop-before-code

它不解决的是：

- 自动 brief / generator 如何直接落代码
- 旧系统重构时如何自动抽取非典型页面 contract
- 用脚本直接批量生成完全非典型页面

## 使用顺序

命中 `non-typical-page` 后，AI 写代码前优先按下面顺序建立上下文：

1. 读 `design-system-first.md`
2. 读 `shared-page-design-guidance.md`
3. 读 `non-typical-design-principles.md`
4. 读 `hiui5-visual-baseline.md`
5. 读 `non-typical-conversation-output-template.md`
6. 读 `non-typical-block-design-map.md`，把轻量 `dataShape` 映射成受控 block 语义
7. 若 family 边界仍不清，再把 `non-typical-few-shot-classification-pack.md` 当作边界证据参考，而不是主判定入口
8. 再用本文件形成最小决策包并判断是否 stop-before-code

当前边界：

- `non-typical-page` 当前已具备 family-specific 的 AI 前置引导、最小 contract、planning manifest、family brief、family-specific generator、light sanity 和样本验证回归
- `load-generation-brief.mjs` / `plan-page-task.mjs` / `generate-page-from-brief.mjs` 已接入主链路，`page-family-workflows.manifest.json` 当前对 validated v1 scope 声明 `generatorReady=true`
- 因此当前公开口径应为“validated v1 scope 已对外开放”，而不是“没有 generator”或“仍然 fail closed”；`legacy refactor contract` 仍未接通

补充约束：

- shared guidance 是 family 之上的第一事实层；先抽 `PageHeader`、`whiteBody`、`primaryRegion`、`readingFlow` 与 `coordination rule`，再判断是否进入 `non-typical-page`
- 样本包只能帮助 AI 做边界校准，不能把某张图、某组案例或某种排布方式抬升成新的页面模板来源或未验证协调模式来源

## 何时命中 `non-typical-page`

只有当页面明显不属于以下路径时，才考虑进入本家族：

- 标准典型页官方母版直出
- 典型页基础模板上的受控局部改造
- 数据可视化页的固定页头 + `whiteBody` 独立 workflow

典型信号：

- 页面主工作区不再由单一表格、单一表单、单一详情承载
- 主副工作区、上下文区、操作区之间的结构关系明显不同于现有页型
- 页面需要一套新的布局语义，但仍然必须继续遵守 HiUI5 与 `local-managed-runtime` 设计系统边界
- 页面即使包含数据图表，图表的字体、颜色、间距、卡片边界和主题来源也仍然必须继续落在 `hiui-design` 规范内

不属于本家族的情况：

- 只是标准典型页上方多一块受控信息区
- 只是筛选、表格、卡片、底栏中的少量局部调整
- 只是想绕开 manifest / 母版 / slot boundary 去自由手写
- 页面虽然出现左侧选择区、上方控制区或多列布局，但右侧仍然是经典表格、经典表单或经典详情主承载体

边界提醒：

- 当页面表现为“左侧选择 + 右侧表格”或“上方控制 + 下方表格”时，不要因为多分区就直接判为 `non-typical-page`
- 如果主任务仍然主要依赖经典表格、经典表单或经典详情完成，优先回查是否属于典型页 split 变体、局部改造，或已有 `analytics-page`
- 只有在多个稳定区域共同承担主任务，且不存在单一典型页骨架可稳定承载时，才进入完全非典型页面家族
- 若还无法判断，先回到 `shared-page-design-guidance.md` 检查：统一页头是否成立、唯一 `whiteBody` owner 是否成立、唯一主阅读流是否成立、跨区域主联动是否可解释；这些事实仍不清时，不应靠 few-shot 强行给出 `yes`

## 写代码前必须形成的最小决策包

命中 `non-typical-page` 时，AI 写代码前必须先形成 `nonTypicalDecisionPackage`。

最小结构如下：

```json
{
  "pageFamily": "non-typical-page",
  "pageGoal": "一句话说明页面完成什么核心任务",
  "primaryWorkflows": [
    "列出 2 到 4 个最重要的用户流程"
  ],
  "pageHeaderPlan": {
    "title": "页面级标题",
    "hasBack": false,
    "primaryActions": [],
    "hostConflictPolicy": "auto-hide-while-mounted",
    "restorePolicy": "restore-on-unmount"
  },
  "whiteBodyPlan": {
    "owner": "single-primary-workspace-owner",
    "workspaceMode": "页面主工作区的布局语义",
    "outerSurfaceMode": "gray-slot-with-white-body",
    "mountRegionFillPolicy": "fill-available-content-region",
    "hostEscalationRule": "block-only-when-mount-region-not-stretchable"
  },
  "regionPlan": {
    "primaryRegion": "唯一主区域",
    "secondaryRegions": [
      "辅助区域列表"
    ],
    "stableRegions": [
      "本次需求中必须保持稳定的结构区域"
    ],
    "mutableRegions": [
      "允许按业务诉求展开的区域"
    ],
    "readingFlow": "说明用户从上到下、从左到右如何理解该页面"
  },
  "coordinationModel": {
    "type": "selection-detail-sync | process-stage-sync | context-detail-sync",
    "sourceRegion": "发起主联动的区域",
    "targetRegions": [
      "被联动影响的区域"
    ],
    "interactionRule": "一句话说明跨区域主联动规则"
  },
  "dataCarriers": [
    "列出主要信息承载体，例如 timeline / board / split workspace / inspector"
  ],
  "dataShape": {
    "chartUsage": "none | supporting | primary",
    "regionShapes": [
      {
        "regionId": "区域 id",
        "regionRole": "primaryRegion | contextRegion | sourceRegion | supportingRegion | mutableRegion",
        "entityShape": "single-record | collection | section-list | metric-set | chart-series | state-flow | mixed",
        "cardinality": "single | multiple | mixed",
        "density": "compact | regular | dense",
        "updateMode": "static | selection-driven | stage-driven | editable | mixed",
        "visualizationHint": "descriptions | form | table | chart | timeline | snapshot | metrics | actions"
      }
    ],
    "crossRegionDependencies": [
      {
        "sourceRegion": "发起联动的 region id",
        "targetRegion": "被联动的 region id",
        "relationship": "一句话说明数据联动关系"
      }
    ]
  },
  "interactionContracts": [
    "列出不可破坏的关键交互，例如主选择关系、联动关系、保存/发布语义"
  ],
  "designSystemPlan": {
    "preferredSources": [
      "HiUI5",
      "local-managed-runtime"
    ],
    "approvedEscapes": []
  },
  "stopReason": ""
}
```

要求：

- `pageGoal` 必须是单句、可执行、不可空泛
- `primaryWorkflows` 只保留核心流程，不堆砌边缘功能
- `pageHeaderPlan` 必须说明页面级标题与页面级主操作如何存在
- 对挂到正式导航体系的非抽屉整页，`pageHeaderPlan.hasBack` 默认应为 `false`
- `pageHeaderPlan.hostConflictPolicy` 对非抽屉整页默认固定为 `auto-hide-while-mounted`，表示若宿主仍保留共享页头，新生成页面挂载时自动隐藏它，而不是先要求宿主整体改造
- `pageHeaderPlan.restorePolicy` 对非抽屉整页默认固定为 `restore-on-unmount`，表示离开页面时恢复宿主共享页头
- `whiteBodyPlan.owner` 必须固定为唯一主工作区 owner
- `whiteBodyPlan.mountRegionFillPolicy` 必须固定为 `fill-available-content-region`，表示白色主体铺满当前内容挂载区，而不是使用 `100vh`
- `whiteBodyPlan.hostEscalationRule` 必须固定为 `block-only-when-mount-region-not-stretchable`，表示只有宿主连最小可拉伸挂载区都给不出来时才升级为宿主阻断
- `regionPlan.primaryRegion` 必须唯一，且必须承担页面主任务
- `stableRegions` 与 `mutableRegions` 必须能明确区分
- `readingFlow` 必须是当前页面事实，不是理想化愿景
- `coordinationModel` 必须能解释当前页面最重要的一条跨区域主联动关系
- `dataShape` 必须是轻量数据承载 contract，不是提前写死视觉布局
- `dataShape.regionShapes` 至少覆盖 `primaryRegion`、`sourceRegion` 与全部 `targetRegions`
- `dataShape` 形成后，必须继续回看 `non-typical-block-design-map.md`，把 region 映射为受控 block 语义
- 若 `dataCarriers` 包含图表，图表实现仍必须可追溯到批准的图表运行时与主题来源；不得默许图表库默认皮肤
- `approvedEscapes` 默认必须为空
- 无法形成该决策包时，直接停止，不进入写代码阶段
- 若 `coordinationModel.type=selection-detail-sync` 且页面核心诉求明确包含左侧搜索、左侧标签筛选、卡片指标、右侧顶部摘要、状态 tab 或明细表格，应继续补显式 `displayContentPlan`：
  - `leftSearch`
  - `leftFilters`
  - `leftFiltersPolicy`
  - `selectionItems[].metrics`
  - `selectionItems[].detailHeader`
  - `selectionItems[].statusTabs`
  - `selectionItems[].statusTabsPolicy`
  - `selectionItems[].detailTable.columns`
  - `selectionItems[].detailTable.tablePolicy`
- `selection-detail-sync` 中的控件承载面不按左右位置粗分，而按“区域占比 + 筛选复杂度 + 切换目标”收口：
  - 简单轻量筛选：优先 `Tag`
  - 单字段主切换：优先 `Tabs`
  - 复杂筛选或表格上方筛选：优先 `QueryFilter`
- 对 `selection-detail-sync`，规则层只负责声明承载面与信息策略；共享运行时负责默认视觉。默认基线应保持：轻量筛选 `Tag` 使用 `square + md`，详情头部使用中性白底而非渐变强调面，状态 `Tabs` 不额外包一层分割线，明细 `Table` 默认无重边框模式与外层描边，非抽屉整页页面壳保持受管 `padding-inline: 16px` 横向安全边距，不用 `padding: 16px` 或 `gap` 冒充这一层基线。
- 这里的判断标准是：
  - 若控件只负责缩小局部列表、区域占比较小且选项数量有限，应视为轻量筛选
  - 若控件只切换一个主维度，并直接驱动同一块主内容区，应视为单字段主切换
  - 若控件承载关键词、状态、机构、日期等结构化字段组合，或位于表格上方 / 页面主控带，应视为复杂筛选
- 这一步的目标是把“说明文字”下沉成结构化合同，而不是把实现说明直接渲染到页面里。

## stop-before-code

出现以下情况时必须停止：

- 无法证明该页面真的不属于现有典型页或分析页家族
- 无法形成清晰的 `stableRegions` / `mutableRegions`
- 无法形成明确的 `pageHeaderPlan` / `whiteBodyPlan`
- 宿主连最小可拉伸 `mount region` 都无法提供
- 无法定义唯一 `primaryRegion`
- 无法说明跨区域主联动关系
- 页面核心工作流仍然可以被现有页型覆盖，却试图绕过官方母版
- 页面右侧或中心主区仍然是经典表格、经典表单或经典详情主承载体，却仅因为增加辅助分区就试图进入 `non-typical-page`
- 关键交互需要第三方复杂画布、图形引擎或宿主级能力，而当前仓库没有稳定承载面
- 设计系统来源不明确，只能靠自由样式拼装
- 旧项目的正式导航、宿主入口或页面挂靠点不明确
- 试图绕过已注册协调模式、design-system gate 或 validated v1 scope 边界，直接把未验证场景接进 `generate-page-from-brief.mjs` 自动执行链路
- 仅因为宿主共享页头空态尚未证实会自动折叠，就试图把页面自带兼容能力降级回“先整体改宿主”

## 轻量 sanity

形成最小决策包后，至少做以下轻量自检：

- 该页面是否真的属于 `non-typical-page`
- 是否明确了主任务和主阅读流
- 是否明确了页面级标题与唯一 `whiteBody`
- 是否明确了唯一 `primaryRegion`
- 是否明确了稳定结构区域与可变结构区域
- 是否明确了跨区域主联动关系
- 是否明确了每个核心 region 的 `dataShape`
- 是否继续优先使用 HiUI5 与 `local-managed-runtime`
- 是否已经用 `non-typical-block-design-map.md` 把核心 region 收口成 block 语义
- 若页面包含图表，图表主题、色板、标题字阶与卡片边界是否仍然符合 `hiui-design` 规范
- 是否没有偷渡第二套本地设计系统
- 是否没有把超出 validated v1 scope 的能力描述成“已开放能力”

## 与脚本链路的关系

- AI 对话中可以使用本文件、`non-typical-conversation-output-template.md` 与 `non-typical-page-contract.json` 做生成前决策
- 边界不清时，可额外参考 `non-typical-few-shot-classification-pack.md` 做保守校准；它是证据参考，不是主判定入口
- 样本验证时，使用 `non-typical-sample-validation-template.md` 与 `non-typical-sample-batch-template.md`
- 涉及 `generate-page-from-brief.mjs` 的真实代码生成时，validated v1 scope 已可直接进入 family generator；但仍必须继续遵守协调模式注册、design-system gate 与 light sanity 约束，且 `legacy-system-reconstruction` 仍不开放
