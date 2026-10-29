# 非典型页面对话输出模板

## 目标

本文件用于把完全非典型页面在 AI 对话中的产出，统一成一份可继续工作的结构化结果。

它解决的是：

- 共享结构事实与 family 边界判断之后，AI 应输出什么
- `yes / partial / no` 与 `nonTypicalDecisionPackage` 如何放进同一份对话产物
- 哪些情况下应停在边界判断层，而不是假装已经可以进入生成

它不解决的是：

- 脚本化自动生成
- 生成后的重校验
- 把截图或样本扩写成新的页面模板枚举或未验证协调模式目录

## 使用顺序

当页面疑似属于完全非典型页面时，按下面顺序使用：

1. 先读 `design-system-first.md`
2. 读 `shared-page-design-guidance.md`
3. 读 `non-typical-design-principles.md`
4. 读 `non-typical-ai-generation-guidance.md`
5. 若 family 边界仍不清，再读 `non-typical-few-shot-classification-pack.md`
6. 最后用本文件组织统一对话输出

## 固定输出对象

AI 应优先形成如下对象，再在自然语言中做简短说明：

```json
{
  "inputSummary": {
    "inputMode": "page-prompt | prototype-screenshot",
    "evidence": [
      "页面结构事实"
    ],
    "knowns": [
      "已确认业务事实"
    ],
    "unknowns": [
      "缺乏证据支撑的内容"
    ]
  },
  "classification": {
    "familyDecision": "yes | partial | no",
    "recommendedRoute": "non-typical-page | typical-page-variant | analytics-page",
    "confidence": "high | medium | low",
    "reasons": [
      "2 到 4 条结构事实"
    ],
    "boundaryRisk": [
      "1 到 3 条误判风险"
    ],
    "nextAction": "continue-decision-package | stop-at-boundary | return-to-existing-family"
  },
  "nonTypicalDecisionPackage": null,
  "stopDecision": {
    "stopBeforeCode": true,
    "stopReason": "说明停止原因；若不停止则为空字符串"
  }
}
```

## 字段约束

- `inputSummary.evidence` 只写能从截图或需求文本直接观察到的事实
- `inputSummary.evidence` 应优先覆盖统一页头、唯一 `whiteBody`、主阅读流、区域角色与主联动这些共享结构事实
- `knowns` 与 `unknowns` 必须分开，不得把猜测写进 `knowns`
- `classification.reasons` 只写结构、承载体、阅读流和联动关系，不写审美评价
- `classification.boundaryRisk` 不能省略
- `nonTypicalDecisionPackage` 只有在 `familyDecision=yes` 时才允许非空
- `familyDecision=partial` 或 `familyDecision=no` 时，`nonTypicalDecisionPackage` 必须为 `null`
- `stopBeforeCode=false` 只允许出现在 `familyDecision=yes` 且最小决策包已完整形成的情况下
- `nonTypicalDecisionPackage.dataShape` 必须描述“区域承载的数据形态”，而不是提前写死视觉实现
- `dataShape.regionShapes` 至少覆盖 `primaryRegion`、`coordinationModel.sourceRegion` 与全部 `targetRegions`

## `yes` 场景模板

当 `familyDecision=yes` 时，`nonTypicalDecisionPackage` 必须补齐为完整对象：

```json
{
  "inputSummary": {
    "inputMode": "prototype-screenshot",
    "evidence": [
      "左侧存在订单上下文",
      "中间存在阶段轨",
      "右侧存在订单快照"
    ],
    "knowns": [
      "页面围绕单个订单完成阶段式确认"
    ],
    "unknowns": [
      "具体阶段状态枚举未确认"
    ]
  },
  "classification": {
    "familyDecision": "yes",
    "recommendedRoute": "non-typical-page",
    "confidence": "high",
    "reasons": [
      "多个稳定区域共同承担页面主任务",
      "不存在单一典型页骨架可以稳定承载",
      "跨区域主联动清晰"
    ],
    "boundaryRisk": [
      "不要误降级成详情页加侧栏"
    ],
    "nextAction": "continue-decision-package"
  },
  "nonTypicalDecisionPackage": {
    "pageFamily": "non-typical-page",
    "pageGoal": "围绕单个订单完成阶段式核查与确认。",
    "primaryWorkflows": [
      "查看订单上下文",
      "沿阶段轨定位当前步骤",
      "完成订单确认"
    ],
    "pageHeaderPlan": {
      "title": "确认订单信息",
      "hasBack": true,
      "primaryActions": [
        "确认订单"
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
        "current-stage-detail-section"
      ],
      "readingFlow": "先看上下文，再看阶段轨，最后在中间主区完成确认，必要时参考右侧快照。"
    },
    "coordinationModel": {
      "type": "process-stage-sync",
      "sourceRegion": "center-stage-rail-region",
      "targetRegions": [
        "center-confirmation-region",
        "right-order-snapshot-region"
      ],
      "interactionRule": "阶段轨决定当前处理步骤，并稳定驱动中间主区和右侧快照。"
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
      "主操作必须在当前阶段上下文中触发"
    ],
    "designSystemPlan": {
      "preferredSources": [
        "HiUI5",
        "local-managed-runtime"
      ],
      "approvedEscapes": []
    },
    "stopReason": ""
  },
  "stopDecision": {
    "stopBeforeCode": false,
    "stopReason": ""
  }
}
```

## `partial` / `no` 场景模板

当页面只是边界样本或明确属于其他家族时，不得伪造 `nonTypicalDecisionPackage`：

```json
{
  "inputSummary": {
    "inputMode": "prototype-screenshot",
    "evidence": [
      "左侧存在卡片式选择区",
      "右侧仍是车辆明细表"
    ],
    "knowns": [
      "主任务仍主要依赖右侧表格完成"
    ],
    "unknowns": [
      "是否已超出典型页 split 变体边界"
    ]
  },
  "classification": {
    "familyDecision": "partial",
    "recommendedRoute": "typical-page-variant",
    "confidence": "medium",
    "reasons": [
      "具备 selection-detail-sync 特征",
      "但右侧仍是经典表格主承载体"
    ],
    "boundaryRisk": [
      "容易被误判成完全非典型页面"
    ],
    "nextAction": "stop-at-boundary"
  },
  "nonTypicalDecisionPackage": null,
  "stopDecision": {
    "stopBeforeCode": true,
    "stopReason": "当前证据不足以证明页面已脱离典型列表页 split 变体。"
  }
}
```

## `selection-detail-sync` 补充结构

当页面核心工作区是“左侧选择驱动右侧详情、状态切换和表格”的组合时，除了最小 `nonTypicalDecisionPackage`，还应优先补一份显式 `displayContentPlan`。它的作用不是重复写需求，而是给 generator（生成器，当前语境里是把决策包转成页面代码的脚本）提供可直接落到结构位的数据合同。

最小推荐形状：

```json
{
  "displayContentPlan": {
    "leftSearch": {
      "placeholder": "售卖单号 / 名称 / 申请部门",
      "emptyText": "暂无匹配结果",
      "preferredCarrier": "search"
    },
    "leftFilters": [
      { "key": "pending-hq-review", "label": "待总部审核", "count": "4" },
      { "key": "warehouse-processing", "label": "仓库处理中", "count": "4" }
    ],
    "leftFiltersPolicy": {
      "controlComplexity": "light",
      "controlTarget": "selection-list",
      "preferredCarrier": "tag"
    },
    "selectionItems": [
      {
        "key": "sell-order-01",
        "label": "SM-20260928-001",
        "title": "华东秋季售卖单",
        "badge": "待总部审核",
        "summary": "华东销售一部 · 申请人 赵雪",
        "metrics": [
          { "label": "机构数量统计", "value": "18" },
          { "label": "商品数量统计", "value": "62" },
          { "label": "物品总价金额", "value": "￥128,600" }
        ],
        "detailHeader": {
          "title": "华东秋季售卖单",
          "statusLabel": "待总部审核",
          "actionLabel": "查看日志",
          "facts": [
            { "label": "售卖申请单号", "value": "AP-20260928-901" },
            { "label": "申请人", "value": "赵雪" },
            { "label": "申请时间", "value": "2026-09-28 09:10" }
          ],
          "metrics": [
            { "label": "机构数量统计", "value": "18" },
            { "label": "商品数量统计", "value": "62" },
            { "label": "物品总价金额", "value": "￥128,600" }
          ]
        },
        "statusTabs": [
          { "key": "all", "label": "全部", "count": "42" },
          { "key": "pending-warehouse", "label": "待仓库处理", "count": "12" },
          { "key": "pending-inspection", "label": "待驻厂抽检", "count": "6" },
          { "key": "pending-shipping", "label": "待仓库发货", "count": "10" },
          { "key": "completed", "label": "已完成", "count": "14" }
        ],
        "statusTabsPolicy": {
          "controlComplexity": "single-dimension-switch",
          "controlTarget": "detail-table",
          "preferredCarrier": "tabs"
        },
        "detailTable": {
          "columns": [
            { "key": "orderNo", "label": "售卖单号" },
            { "key": "status", "label": "状态标签", "kind": "status" },
            { "key": "organizationInfo", "label": "机构信息" },
            { "key": "itemAttribute", "label": "物品属性" },
            { "key": "quality", "label": "品相" },
            { "key": "quantity", "label": "物品数量" },
            { "key": "amount", "label": "物品金额" },
            { "key": "actions", "label": "操作", "kind": "actions" }
          ],
          "tablePolicy": {
            "preferredCarrier": "table",
            "cellWrap": "nowrap",
            "overflowX": "auto",
            "statusCarrier": "tag",
            "actionCarrier": "button-link"
          }
        }
      }
    ]
  }
}
```

要求：

- `leftSearch` 必须能支撑左侧搜索框，而不是只给一句“支持搜索”说明。
- `leftFilters` 必须是可点击的标签集合，而不是把状态名混进说明文字。
- `leftFiltersPolicy` 必须说明筛选复杂度、控制目标和首选承载面；简单轻量筛选默认收口为 `Tag`。
- `selectionItems[].metrics` 必须显式承载卡片三列指标。
- `selectionItems[].detailHeader` 必须显式承载右侧顶部信息栏。
- `selectionItems[].statusTabs` 必须显式承载带数字徽标的状态切换条。
- `selectionItems[].statusTabsPolicy` 必须说明切换复杂度、控制目标和首选承载面；单字段主切换默认收口为 `Tabs`。
- `selectionItems[].detailTable.columns` 至少要给出真实表格字段；若有条件，继续补 `rowsByStatus` 或等价结构。
- `selectionItems[].detailTable.tablePolicy` 必须说明表格承载面、单元格换行策略、横向滚动策略，以及状态列 / 操作列承载面。
- 视觉微观默认值不应继续写进页面输入合同。对 `selection-detail-sync`，共享运行时默认负责以下呈现：轻量筛选 `Tag` 为 `square + md`，详情头部为中性白底信息面，状态 `Tabs` 不额外包底线，明细 `Table` 默认无重边框模式与外层描边，页面壳不重复增加横向安全边距。
- 若筛选已升级为关键词、状态、机构、日期等结构化字段组合，或位于表格上方 / 页面主控带，则应改走 `QueryFilter`，不得继续伪装为 `Tag` 或 `Tabs`。

## 自检规则

- 若 `recommendedRoute=non-typical-page`，必须能同步给出唯一 `primaryRegion`
- 若 `familyDecision=yes`，必须能解释跨区域主联动关系
- 若 `familyDecision=yes`，必须给出轻量 `dataShape`，至少覆盖 `chartUsage` 与 `regionShapes`
- 若 `familyDecision=partial`，必须明确“停在哪一层”，不能模糊成“先生成再说”
- 若 `familyDecision=no`，必须明确回到哪个已存在家族
- 若 `unknowns` 足以影响页型判断，应保持 `stopBeforeCode=true`

## 结论

本模板只服务一个目标：

- 让 AI 在对话阶段先输出可继续工作的统一结果，再决定是否进入完全非典型页面生成前决策

它不意味着：

- 非典型页面已经接通自动生成
- 边界问题已经完全消失
- 后续不再需要补真实样本
