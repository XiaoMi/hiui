# 非典型页面首轮样本验证（Round 1）

## 1. 本轮目标

- 验证目的：用 4 个真实页面样本验证 `non-typical-page` 的家族边界、最小决策包与轻量 red-line 是否足够稳定。
- 样本数量：4
- 验证范围：页面家族归类、最小决策包可形成性、是否触发 `stop-before-code`、是否需要新增或收紧规则。

## 2. 样本列表

| 样本 | 页面名称 | 输入方式 | 预期归类 | 主任务摘要 |
| --- | --- | --- | --- | --- |
| A | 方案一 / 车辆列表 | `prototype-screenshot` | `partial` | 左侧区域卡片选择驱动右侧表格内容切换，形成多工作区联动列表页 |
| B | 确认订单信息 | `prototype-screenshot` | `non-typical-page` | 左侧用户上下文、中间流程阶段轨与订单确认主区、右侧订单快照协同完成订单确认 |
| C | 业务规模 | `prototype-screenshot` | `analytics-page` | 指标卡、趋势图与明细表共同完成业务规模分析 |
| D | 机构售卖单管理 | `prototype-screenshot` | `non-typical-page` | 左侧售卖单选择驱动右侧分组明细、发货状态与确认发货动作联动 |

## 3. 单样本结果摘要

| 样本 | 是否属于 `non-typical-page` | 最小决策包是否可形成 | 是否触发 stop-before-code | 轻量 sanity 结果 | 结论 |
| --- | --- | --- | --- | --- | --- |
| A | `partial` | `yes` | `yes` | `partial` | 边界样本，先停在分类层，不直接进入非典型页面生成 |
| B | `yes` | `yes` | `no` | `pass` | 支持当前完全非典型页面流程 |
| C | `no` | `n/a` | `yes` | `n/a` | 应回到 `analytics-page`，不进入完全非典型页面 |
| D | `yes` | `yes` | `no` | `pass` | 支持当前完全非典型页面流程 |

## 4. 单样本记录

### 样本 A：方案一 / 车辆列表

#### 1. 样本事实

- 页面名称：车辆列表
- 输入方式：`prototype-screenshot`
- 页面目标：在区域/国家分组上下文下查看车辆清单，并进行行内操作
- 主任务流：
  - 选择顶部发运区域
  - 选择左侧区域卡片
  - 查看并操作右侧车辆明细表
- 为什么不适合典型页或典型页局部改造：
  - 左侧存在持续参与主流程的选择面板，不是简单统计卡区
  - 右侧仍是明显的典型表格主承载体
  - 页面整体既有 split workspace 特征，又保留强典型列表页气质

#### 2. 非典型页面归类判断

- 是否进入 `non-typical-page`：`partial`
- 判断依据：
  - 页面具备 `selection-detail-sync` 的联动特征
  - 但右侧表格仍然是单一主信息承载体，左侧卡片更像增强控制面
  - 当前证据不足以证明它已经脱离“典型列表页的 split 变体”
- 若 `no` 或 `partial`，应回到哪条链路：
  - 优先回查“典型页局部改造”或未来正式 split 页型

#### 3. 生成前最小决策包

```json
{
  "pageGoal": "在区域与国家上下文下筛选、查看并操作车辆清单。",
  "primaryWorkflows": [
    "切换区域维度",
    "选择左侧国家卡片",
    "查看并操作右侧车辆表格"
  ],
  "pageHeaderPlan": {
    "title": "车辆列表",
    "hasBack": false,
    "primaryActions": []
  },
  "whiteBodyPlan": {
    "owner": "single-primary-workspace-owner",
    "workspaceMode": "split-workspace",
    "outerSurfaceMode": "gray-slot-with-white-body"
  },
  "regionPlan": {
    "primaryRegion": "right-table-region",
    "secondaryRegions": [
      "left-country-selection-region",
      "top-filter-region"
    ],
    "stableRegions": [
      "top-filter-region",
      "left-country-selection-region",
      "right-table-region"
    ],
    "mutableRegions": [
      "country-cards-content",
      "table-columns-and-actions"
    ],
    "readingFlow": "先看顶部筛选与区域切换，再看左侧国家选择，最后查看右侧表格明细并完成行内操作。"
  },
  "coordinationModel": {
    "type": "selection-detail-sync",
    "sourceRegion": "left-country-selection-region",
    "targetRegions": [
      "right-table-region"
    ],
    "interactionRule": "左侧国家卡片切换后，右侧车辆明细表同步切换到对应国家的车辆集合。"
  },
  "dataCarriers": [
    "selection cards",
    "data table"
  ],
  "dataShape": {
    "chartUsage": "none",
    "regionShapes": [
      {
        "regionId": "left-country-selection-region",
        "regionRole": "sourceRegion",
        "entityShape": "collection",
        "cardinality": "multiple",
        "density": "compact",
        "updateMode": "selection-driven",
        "visualizationHint": "descriptions"
      },
      {
        "regionId": "right-table-region",
        "regionRole": "primaryRegion",
        "entityShape": "collection",
        "cardinality": "multiple",
        "density": "dense",
        "updateMode": "selection-driven",
        "visualizationHint": "table"
      }
    ],
    "crossRegionDependencies": [
      {
        "sourceRegion": "left-country-selection-region",
        "targetRegion": "right-table-region",
        "relationship": "selection-drives-table"
      }
    ]
  },
  "interactionContracts": [
    "左侧选择结果必须稳定驱动右侧表格刷新",
    "右侧表格仍然保持主列表工作面"
  ],
  "designSystemPlan": {
    "preferredSources": [
      "HiUI5",
      "local-managed-runtime"
    ],
    "approvedEscapes": []
  },
  "stopReason": "当前无法证明该页已经脱离典型列表页 split 变体，应先回到典型页边界判断。"
}
```

#### 4. 生成前判断结果

- `PageHeader` 是否明确：`yes`
- `whiteBody owner` 是否唯一：`yes`
- `primaryRegion` 是否唯一：`yes`
- `stableRegions` / `mutableRegions` 是否可清晰区分：`yes`
- 跨区域主联动关系是否明确：`yes`
- 关键组件来源是否明确：`yes`
- 关键 token 来源是否明确：`yes`
- 是否触发 `stop-before-code`：`yes`
- 若触发，具体原因：
  - 该页仍然可能被“典型页局部改造 / split 变体”覆盖，不能直接归入完全非典型页面

#### 5. 轻量产后 sanity

- 是否存在统一 `PageHeader`：`yes`
- 是否存在统一 `whiteBody`：`yes`
- 是否存在唯一 `primaryRegion`：`yes`
- 是否存在明确的跨区域主联动关系：`yes`
- 是否出现第二主结构：`partial`
- 是否引入未批准视觉 token：`no-evidence`
- 是否引入第三方 UI 组件：`no-evidence`

#### 6. 结论

- 该样本是否支持当前非典型页面流程：`partial`
- 当前规则是否足够：
  - 足够把它识别为边界样本，但还不足以自动判定是完全非典型页面
- 需要补充或收紧的规则：
  - 增加一条边界提醒：当右侧仍为典型表格主承载体时，优先回查是否属于典型页 split 变体
- 是否应沉淀为更稳定的共享结构语法或协调模式：
  - 暂不建议，先保留为边界样本

### 样本 B：确认订单信息

#### 1. 样本事实

- 页面名称：确认订单信息
- 输入方式：`prototype-screenshot`
- 页面目标：围绕单个用户订单，完成阶段式核查与订单确认
- 主任务流：
  - 浏览左侧用户与订单上下文
  - 在中间阶段轨上定位当前阶段
  - 在主内容区确认订单与车辆信息
  - 在右侧快照区查看关键订单详情
- 为什么不适合典型页或典型页局部改造：
  - 页面主结构不是单一表格、表单或详情
  - 阶段轨与左右上下文共同参与主任务，不是局部增强区
  - 中间主区与右侧快照区存在稳定联动，不是单页详情小变体

#### 2. 非典型页面归类判断

- 是否进入 `non-typical-page`：`yes`
- 判断依据：
  - 这是典型的 `process-stage-sync + context-detail-sync`
  - 页面主任务依赖多个区域协同，不存在单一典型页骨架可稳定承载
- 若 `no`，应回到哪条链路：
  - `n/a`

#### 3. 生成前最小决策包

```json
{
  "pageGoal": "围绕单个订单完成阶段式核查、信息确认与最终确认操作。",
  "primaryWorkflows": [
    "查看用户与订单上下文",
    "沿阶段轨定位当前处理阶段",
    "确认订单与车辆配置",
    "执行订单确认"
  ],
  "pageHeaderPlan": {
    "title": "Confirm Order Status",
    "hasBack": true,
    "primaryActions": [
      "Complete Order Check"
    ]
  },
  "whiteBodyPlan": {
    "owner": "single-primary-workspace-owner",
    "workspaceMode": "multi-panel-workspace",
    "outerSurfaceMode": "gray-slot-with-white-body"
  },
  "regionPlan": {
    "primaryRegion": "center-confirmation-region",
    "secondaryRegions": [
      "left-context-region",
      "center-stage-rail-region",
      "right-order-snapshot-region"
    ],
    "stableRegions": [
      "left-context-region",
      "center-stage-rail-region",
      "center-confirmation-region",
      "right-order-snapshot-region"
    ],
    "mutableRegions": [
      "current-stage-detail-section",
      "follow-up-content"
    ],
    "readingFlow": "先看左侧用户与订单上下文，再看中间阶段轨确定当前阶段，随后在中间主区完成确认，必要时参考右侧订单快照。"
  },
  "coordinationModel": {
    "type": "process-stage-sync",
    "sourceRegion": "center-stage-rail-region",
    "targetRegions": [
      "center-confirmation-region",
      "right-order-snapshot-region"
    ],
    "interactionRule": "阶段轨决定中间主区当前展示的处理步骤，并与右侧快照共同支撑订单确认。"
  },
  "dataCarriers": [
    "context panel",
    "stage rail",
    "detail sections",
    "snapshot panel"
  ],
  "dataShape": {
    "chartUsage": "none",
    "regionShapes": [
      {
        "regionId": "left-context-region",
        "regionRole": "contextRegion",
        "entityShape": "single-record",
        "cardinality": "single",
        "density": "compact",
        "updateMode": "static",
        "visualizationHint": "descriptions"
      },
      {
        "regionId": "center-stage-rail-region",
        "regionRole": "sourceRegion",
        "entityShape": "state-flow",
        "cardinality": "single",
        "density": "compact",
        "updateMode": "stage-driven",
        "visualizationHint": "timeline"
      },
      {
        "regionId": "center-confirmation-region",
        "regionRole": "primaryRegion",
        "entityShape": "section-list",
        "cardinality": "single",
        "density": "regular",
        "updateMode": "stage-driven",
        "visualizationHint": "form"
      },
      {
        "regionId": "right-order-snapshot-region",
        "regionRole": "supportingRegion",
        "entityShape": "single-record",
        "cardinality": "single",
        "density": "compact",
        "updateMode": "stage-driven",
        "visualizationHint": "snapshot"
      }
    ],
    "crossRegionDependencies": [
      {
        "sourceRegion": "center-stage-rail-region",
        "targetRegion": "center-confirmation-region",
        "relationship": "stage-drives-content"
      },
      {
        "sourceRegion": "center-stage-rail-region",
        "targetRegion": "right-order-snapshot-region",
        "relationship": "stage-drives-snapshot"
      }
    ]
  },
  "interactionContracts": [
    "阶段轨必须稳定驱动当前处理上下文",
    "订单确认动作必须在当前阶段上下文中触发"
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

#### 4. 生成前判断结果

- `PageHeader` 是否明确：`yes`
- `whiteBody owner` 是否唯一：`yes`
- `primaryRegion` 是否唯一：`yes`
- `stableRegions` / `mutableRegions` 是否可清晰区分：`yes`
- 跨区域主联动关系是否明确：`yes`
- 关键组件来源是否明确：`yes`
- 关键 token 来源是否明确：`yes`
- 是否触发 `stop-before-code`：`no`
- 若触发，具体原因：`n/a`

#### 5. 轻量产后 sanity

- 是否存在统一 `PageHeader`：`yes`
- 是否存在统一 `whiteBody`：`yes`
- 是否存在唯一 `primaryRegion`：`yes`
- 是否存在明确的跨区域主联动关系：`yes`
- 是否出现第二主结构：`no`
- 是否引入未批准视觉 token：`no-evidence`
- 是否引入第三方 UI 组件：`no-evidence`

#### 6. 结论

- 该样本是否支持当前非典型页面流程：`yes`
- 当前规则是否足够：`yes`
- 需要补充或收紧的规则：
  - 当前不需要新增重规则
- 是否应沉淀为更稳定的共享结构语法或协调模式：
  - 可以作为 `process-stage-sync` 的代表样本

### 样本 C：业务规模

#### 1. 样本事实

- 页面名称：业务规模
- 输入方式：`prototype-screenshot`
- 页面目标：查看业务规模分析、趋势变化与明细数据
- 主任务流：
  - 查看指标卡
  - 查看趋势图
  - 查看明细表
- 为什么不适合典型页或典型页局部改造：
  - 不成立；该页已经明显符合分析页工作流

#### 2. 非典型页面归类判断

- 是否进入 `non-typical-page`：`no`
- 判断依据：
  - KPI 卡 + 折线图 + 明细表是标准分析页结构
  - 当前已有 `analytics-page / data-visualization` 家族承载这类页面
- 若 `no`，应回到哪条链路：
  - `analytics-page`

#### 3. 生成前最小决策包

```json
{
  "stopReason": "当前页面可被 analytics-page 覆盖，不应进入 non-typical-page。"
}
```

#### 4. 生成前判断结果

- `PageHeader` 是否明确：`n/a`
- `whiteBody owner` 是否唯一：`n/a`
- `primaryRegion` 是否唯一：`n/a`
- `stableRegions` / `mutableRegions` 是否可清晰区分：`n/a`
- 跨区域主联动关系是否明确：`n/a`
- 关键组件来源是否明确：`n/a`
- 关键 token 来源是否明确：`n/a`
- 是否触发 `stop-before-code`：`yes`
- 若触发，具体原因：
  - 该页面应进入 `analytics-page`，不是完全非典型页面

#### 5. 轻量产后 sanity

- 是否存在统一 `PageHeader`：`n/a`
- 是否存在统一 `whiteBody`：`n/a`
- 是否存在唯一 `primaryRegion`：`n/a`
- 是否存在明确的跨区域主联动关系：`n/a`
- 是否出现第二主结构：`n/a`
- 是否引入未批准视觉 token：`n/a`
- 是否引入第三方 UI 组件：`n/a`

#### 6. 结论

- 该样本是否支持当前非典型页面流程：`no`
- 当前规则是否足够：`yes`
- 需要补充或收紧的规则：
  - 无需为此样本增加非典型页面规则
- 是否应沉淀为更稳定的共享结构语法或协调模式：
  - 不应，保持在 `analytics-page`

### 样本 D：机构售卖单管理

#### 1. 样本事实

- 页面名称：机构售卖单管理
- 输入方式：`prototype-screenshot`
- 页面目标：选择售卖单并对右侧分组货品明细执行发货确认
- 主任务流：
  - 选择左侧售卖单
  - 查看右侧售卖单摘要
  - 在右侧分组明细中展开货品批次
  - 执行确认发货
- 为什么不适合典型页或典型页局部改造：
  - 页面主任务依赖左侧单据选择与右侧分组明细联动
  - 右侧不是单一普通表格，而是“摘要 + 分组区块 + 局部表格 + 分组动作”
  - 页面核心是单据选择与履约确认协同，不是典型列表页小增强

#### 2. 非典型页面归类判断

- 是否进入 `non-typical-page`：`yes`
- 判断依据：
  - 这是明确的 `selection-detail-sync`
  - 左右两区都持续参与主任务
  - 右侧详情区自身还是分组展开结构，不是单一典型明细表
- 若 `no`，应回到哪条链路：
  - `n/a`

#### 3. 生成前最小决策包

```json
{
  "pageGoal": "选择机构售卖单并在分组货品明细中完成发货确认。",
  "primaryWorkflows": [
    "选择左侧售卖单",
    "查看右侧单据摘要",
    "展开分组货品明细",
    "执行确认发货"
  ],
  "pageHeaderPlan": {
    "title": "售卖管理",
    "hasBack": false,
    "primaryActions": []
  },
  "whiteBodyPlan": {
    "owner": "single-primary-workspace-owner",
    "workspaceMode": "split-workspace",
    "outerSurfaceMode": "gray-slot-with-white-body"
  },
  "regionPlan": {
    "primaryRegion": "right-order-fulfillment-region",
    "secondaryRegions": [
      "left-order-selection-region",
      "top-filter-region"
    ],
    "stableRegions": [
      "left-order-selection-region",
      "right-order-summary-region",
      "right-grouped-detail-region"
    ],
    "mutableRegions": [
      "selected-order-detail",
      "group-expanded-table"
    ],
    "readingFlow": "先筛选并查看左侧售卖单，再进入右侧单据摘要和分组明细，最后执行确认发货。"
  },
  "coordinationModel": {
    "type": "selection-detail-sync",
    "sourceRegion": "left-order-selection-region",
    "targetRegions": [
      "right-order-summary-region",
      "right-grouped-detail-region"
    ],
    "interactionRule": "左侧售卖单选择变化后，右侧摘要与分组货品明细同步切换到当前单据。"
  },
  "dataCarriers": [
    "selection list",
    "summary header",
    "grouped detail blocks",
    "detail table"
  ],
  "dataShape": {
    "chartUsage": "none",
    "regionShapes": [
      {
        "regionId": "left-order-selection-region",
        "regionRole": "sourceRegion",
        "entityShape": "collection",
        "cardinality": "multiple",
        "density": "compact",
        "updateMode": "selection-driven",
        "visualizationHint": "descriptions"
      },
      {
        "regionId": "right-order-summary-region",
        "regionRole": "supportingRegion",
        "entityShape": "single-record",
        "cardinality": "single",
        "density": "compact",
        "updateMode": "selection-driven",
        "visualizationHint": "snapshot"
      },
      {
        "regionId": "right-grouped-detail-region",
        "regionRole": "primaryRegion",
        "entityShape": "mixed",
        "cardinality": "multiple",
        "density": "regular",
        "updateMode": "selection-driven",
        "visualizationHint": "table"
      }
    ],
    "crossRegionDependencies": [
      {
        "sourceRegion": "left-order-selection-region",
        "targetRegion": "right-order-summary-region",
        "relationship": "selection-drives-summary"
      },
      {
        "sourceRegion": "left-order-selection-region",
        "targetRegion": "right-grouped-detail-region",
        "relationship": "selection-drives-detail"
      }
    ]
  },
  "interactionContracts": [
    "左侧选择必须稳定驱动右侧单据上下文",
    "确认发货动作必须绑定当前单据与当前分组"
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

#### 4. 生成前判断结果

- `PageHeader` 是否明确：`yes`
- `whiteBody owner` 是否唯一：`yes`
- `primaryRegion` 是否唯一：`yes`
- `stableRegions` / `mutableRegions` 是否可清晰区分：`yes`
- 跨区域主联动关系是否明确：`yes`
- 关键组件来源是否明确：`yes`
- 关键 token 来源是否明确：`yes`
- 是否触发 `stop-before-code`：`no`
- 若触发，具体原因：`n/a`

#### 5. 轻量产后 sanity

- 是否存在统一 `PageHeader`：`yes`
- 是否存在统一 `whiteBody`：`yes`
- 是否存在唯一 `primaryRegion`：`yes`
- 是否存在明确的跨区域主联动关系：`yes`
- 是否出现第二主结构：`no`
- 是否引入未批准视觉 token：`no-evidence`
- 是否引入第三方 UI 组件：`no-evidence`

#### 6. 结论

- 该样本是否支持当前非典型页面流程：`yes`
- 当前规则是否足够：`yes`
- 需要补充或收紧的规则：
  - 当前不需要增加重规则
- 是否应沉淀为更稳定的共享结构语法或协调模式：
  - 可以作为 `selection-detail-sync` 的代表样本

## 5. 规则观察

- 当前最稳定的规则：
  - `pageHeaderPlan`
  - 唯一 `whiteBody owner`
  - 唯一 `primaryRegion`
  - `coordinationModel`
- 当前最容易漂移的字段：
  - 边界样本中的 `primaryRegion` 判定
  - `stableRegions` 与典型页局部改造边界的区分
- 当前最容易误判的边界：
  - “左侧选择 + 右侧表格”的 split 布局是否已经脱离典型列表页
- 当前不应继续加重的校验：
  - 不应新增重型 post-generation 验收
  - 不应在当前阶段扩展大量页面模板式枚举

## 6. 修订建议

- 建议补充的前置 guidance：
  - 当右侧仍是典型表格主承载体时，优先回查是否属于“典型页 split 变体”，不要直接判为 `non-typical-page`
- 建议收紧的 stop rule：
  - 无法证明页面已脱离典型页主骨架时，应先停在边界判断层
- 建议放宽的 stop rule：
  - 当前无需放宽已有 stop rule
- 是否需要新增更稳定的布局语义：
  - 当前证据足以保留 `process-stage-sync` 与 `selection-detail-sync`
  - 当前证据不足以继续扩新的协调模式
- 是否需要保持现状，不继续扩规则：
  - `yes`

## 7. 结论

- 当前非典型页面流程是否可继续试点：`yes`
- 下一轮验证前应先完成的动作：
  - 用后续真实页面继续验证边界样本，不新增重校验
  - 保持当前最小决策包与 `coordinationModel`，先观测其稳定性
