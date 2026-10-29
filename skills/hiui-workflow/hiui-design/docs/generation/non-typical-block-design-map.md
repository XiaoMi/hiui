# 非典型页面区块设计映射

## 目标

本文件用于把 `non-typical-page` 的轻量 `dataShape`，映射成可执行的区块设计指导。

它解决的是：

- 非典型页面不走页面模板时，AI 应如何从“区域承载的数据形态”推导到“合适的区块语义与组件承载方式”
- 如何在不做案例枚举的前提下，把字体、颜色、间距、组件和图表统一收口到 `hiui-design`
- 如何让后续 generator 直接消费一致的 block 语义，而不是重新猜截图

它不解决的是：

- family 判型
- 页面业务数据填充
- 非典型页面 family generator 的最终代码落地细节

## 使用顺序

1. 先读 `shared-page-design-guidance.md`
2. 再读 `non-typical-ai-generation-guidance.md`
3. 先形成 `nonTypicalDecisionPackage.dataShape`
4. 最后用本文件，把每个 region 的 `dataShape` 映射成受控 block 语义

## 输入约束

`dataShape` 只描述“区域承载的数据形态”，不直接描述视觉实现。

推荐最小结构：

```json
{
  "chartUsage": "none | supporting | primary",
  "regionShapes": [
    {
      "regionId": "center-confirmation-region",
      "regionRole": "primaryRegion",
      "entityShape": "section-list",
      "cardinality": "single",
      "density": "regular",
      "updateMode": "stage-driven",
      "visualizationHint": "form"
    }
  ],
  "crossRegionDependencies": [
    {
      "sourceRegion": "center-stage-rail-region",
      "targetRegion": "center-confirmation-region",
      "relationship": "stage-drives-content"
    }
  ]
}
```

## 映射原则

### 1. 先判区块语义，再判具体组件

- `dataShape` 先决定当前 region 属于哪类 block
- block 再决定容器语义、排版层级、颜色/间距基线与推荐组件承载方式
- 不允许跳过 block 语义，直接从截图猜 DOM 结构

### 2. block 语义必须可回指到设计系统

- block 的容器、标题字阶、文本颜色、边界、内边距与区块间距，都必须回指到 HiUI5 与 `hiui-design`
- 页面本地样式默认只允许 `layout-only`
- 没有书面设计依据时，不得新增 block 级自定义 token

### 3. 图表 block 仍然属于统一设计系统

- chart 只是一种 block 语义，不是独立视觉子系统
- chart block 的主题、色板、legend、axis、标题字阶、卡片边界与留白，仍然必须服从 `hiui-design`
- 不得回退到图表库默认主题或自由装饰图表卡

## block 映射表

| dominantBlock | 典型 `dataShape` 信号 | 容器语义 | 推荐承载方式 | 字体/颜色/间距约束 | 风险点 |
| --- | --- | --- | --- | --- | --- |
| `context-facts` | `single-record + descriptions + static` | 辅助上下文块 | 紧凑 facts / descriptions | 标题低于页面标题；正文与辅助文本继续服从 HiUI 字阶与次级文本色 | 不得做成第二主工作区 |
| `stage-navigation` | `state-flow + timeline + stage-driven` | 阶段导航块 | `StageRail` / steps rail | 阶段标题与状态色必须沿用既有状态语义；间距服从统一 scale | 不得把时间轴视觉做成装饰主角 |
| `detail-sections` | `section-list + form` 或 `single-record + editable` | 主信息块 | `SectionGroup + fields/form rows` | 区块标题、字段标题、正文层级继续服从统一标题层级 | 不得自造字段样式体系 |
| `collection-review` | `collection + table` | 集合审阅块 | table / grouped collection review | 表头、行高、操作列、分组间距沿用 HiUI 表格语义 | 若它成为唯一主承载体，应回查是否其实是典型页 |
| `metric-summary` | `metric-set + metrics` | 指标摘要块 | metric cards / metric rows | 数字字阶、标签色、卡片边界服从统一基线 | 不得把指标卡墙做成 dashboard 装饰背景 |
| `chart-insight` | `chart-series + chart` | 图表洞察块 | `ChartCard + approved chart runtime` | 必须沿用批准图表主题、legend/axis/token 来源与卡片节奏 | 不得回退默认图表皮肤 |
| `snapshot-summary` | `single-record + snapshot` | 侧边快照块 | 紧凑摘要列表 / snapshot panel | 标题层级低于主区，边界和留白保持克制 | 不得通过高装饰卡片抢主视觉 |
| `action-strip` | `single + actions` | 操作收口块 | `ActionStrip` / grouped actions | 主次按钮优先级、危险态、留白继续服从统一按钮规范 | 不得与页面级主操作冲突 |

## 映射算法

1. 用 `visualizationHint` 判定第一优先级 block。
2. 若 `visualizationHint` 不足，再用 `entityShape` 判定。
3. 再用 `regionRole` 修正 block 的权重与容器语义。
4. 若 block 为 `chart-insight`，必须额外回查图表主题来源是否仍然在批准范围内。
5. 若 block 为 `collection-review` 且它明显成为页面唯一主承载体，应回退到 family 边界判断，而不是继续强行走非典型页面。

## 区块级设计指导

### 1. 标题层级

- 页面级标题最高
- `primaryRegion` 区块标题次之
- supporting / context / snapshot 区块标题再降一级
- 不得因为区块重要，就跳出统一标题体系

### 2. 颜色与状态

- 文字颜色、分割线、容器边界、状态色默认回指到 HiUI5 变量与既有语义
- 允许强调，但不允许把 block 变成新的色彩体系

### 3. 间距与密度

- 区块内边距、区块间距、字段行距、图表卡留白应服从统一 spacing scale
- `density` 只用于在统一 scale 内选择紧凑或常规，不允许生成局部自定义 spacing 体系

### 4. 组件选择

- 优先选已有 HiUI5 组件、`local-managed-runtime` 壳层能力与已批准扩展
- 若 block 语义明确、但找不到现成组件，优先新增受控 primitive，不直接写自由 DOM

## 反模式

- 把区块映射重新做成截图枚举
- 跳过 `dataShape`，直接从图片猜布局与组件
- 用“非典型页面”作为理由引入第二套 token、卡片皮肤或图表主题
- 把 `collection-review`、`detail-sections` 这类 block 误当成页面模板，而不是区块语义

## 结论

本文件只做一件事：

- 把 `dataShape` 收口成可执行的 block 语义与设计系统映射

这样后续 generator 才能基于“规则驱动的区块组合”继续推进，而不是重新回到模板驱动或自由拼装。
