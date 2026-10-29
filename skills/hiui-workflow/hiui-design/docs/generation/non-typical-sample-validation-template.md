# 非典型页面样本验证模板

## 目标

本文件用于验证完全非典型页面流程是否真正可用。它不是正式交付报告模板，也不是重验收清单；它只服务一件事：

- 用 2 到 3 个真实页面样本，验证 `non-typical-ai-generation-guidance.md` 与 `non-typical-page-contract.json` 是否足够让 AI 在写代码前一次性做对

本模板默认保持轻量：

- 先看生成前决策是否稳定
- 再看轻量红线是否越界
- 最后才决定是否需要补规则或收紧 `stop rules`

不要把本模板扩写成完整审计文档，也不要要求每个样本都跑重型验收。

## 适用范围

适用于以下场景：

- 新增完全非典型页面流程后的首轮样本验证
- 新增完全非典型页面规则后的回归验证
- 讨论某个真实页面是否应纳入 `non-typical-page` 家族

不适用于以下场景：

- 典型页标准模板直出验证
- 典型页局部改造验证
- 首次接入、宿主异常、依赖异常时的 doctor / smoke 验收

## 使用方式

每个样本只回答以下四类问题：

1. 这个页面是否真的属于完全非典型页面
2. 生成前最小决策包是否能稳定形成
3. 页面实现是否越过了轻量红线
4. 当前样本是否足以反推新增或修改规则

若样本在第 1 步就无法证明属于完全非典型页面，直接停止，不进入后续验证。

## 样本记录模板

对每个样本复制以下模板，并填写最小事实。

````md
# 样本名称

## 1. 样本事实

- 页面名称：
- 输入方式：`page-prompt` / `prototype-screenshot` / `figma-design-restore`
- 设计证据：`无` / `Figma` 节点链接 / 设计稿截图路径 / 其他
- 页面目标：
- 主任务流：
- 为什么不适合典型页或典型页局部改造：

## 2. 非典型页面归类判断

- 是否进入 `non-typical-page`：`yes` / `no`
- 判断依据：
- 若 `no`，应回到哪条链路：

## 3. 生成前最小决策包

```json
{
  "pageGoal": "",
  "primaryWorkflows": [],
  "pageHeaderPlan": {
    "title": "",
    "hasBack": false,
    "primaryActions": []
  },
  "whiteBodyPlan": {
    "owner": "single-primary-workspace-owner",
    "workspaceMode": "",
    "outerSurfaceMode": "gray-slot-with-white-body"
  },
  "regionPlan": {
    "primaryRegion": "",
    "secondaryRegions": [],
    "stableRegions": [],
    "mutableRegions": [],
    "readingFlow": ""
  },
  "coordinationModel": {
    "type": "",
    "sourceRegion": "",
    "targetRegions": [],
    "interactionRule": ""
  },
  "dataCarriers": [],
  "dataShape": {
    "chartUsage": "none",
    "regionShapes": [],
    "crossRegionDependencies": []
  },
  "interactionContracts": [],
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

- 若输入方式为 `figma-design-restore`，补充填写：
  - `confirmedDesignRestoreInput` 是否已形成：
  - `restoreDecisionPackage` 是否已形成：
  - `regionDecisionTable` 是否非空：
  - 预期目标链路：`page-type` / `analytics-page` / `non-typical-page`

## 4. 生成前判断结果

- `PageHeader` 是否明确：
- `whiteBody owner` 是否唯一：
- `primaryRegion` 是否唯一：
- `stableRegions` / `mutableRegions` 是否可清晰区分：
- 跨区域主联动关系是否明确：
- 关键组件来源是否明确：
- 关键 token 来源是否明确：
- 目标链路是否明确：
- 是否触发 `stop-before-code`：
- 若触发，具体原因：

## 5. 轻量产后 sanity

- 是否存在统一 `PageHeader`：
- 是否存在统一 `whiteBody`：
- 是否存在唯一 `primaryRegion`：
- 是否存在明确的跨区域主联动关系：
- 是否出现第二主结构：
- 是否引入未批准视觉 token：
- 是否引入第三方 UI 组件：
- `light guard` 结论：`pass` / `partial` / `blocked`
- 若为设计还原输入，关键贴稿区域是否保住：

## 6. 结论

- 该样本是否支持当前非典型页面流程：`yes` / `partial` / `no`
- 当前规则是否足够：
- 需要补充或收紧的规则：
- 是否应沉淀为更稳定的共享结构语法或协调模式：
````

## 结果判定口径

样本验证只允许输出以下三类结果：

- `yes`
  当前样本可被现有规则稳定覆盖，不需要新增 `stop rule`
- `partial`
  当前样本大体成立，但需要补字段语义、收紧边界或补轻量 guidance
- `no`
  当前样本不应进入完全非典型页面流程，或当前规则无法支撑它继续生成

不要输出模糊结论，例如“差不多可以”“大体没问题但先继续做”。

## 样本选择建议

首轮只建议验证 2 到 3 个样本，不要一次拉很大范围。

建议至少覆盖：

- 一个主任务流明确、结构相对清晰的非典型页面
- 一个包含主副工作区的非典型页面
- 一个容易与典型页局部改造混淆的边界样本

不要在首轮选择：

- 纯视觉探索页
- 依赖第三方复杂画布或图形引擎的页面
- 宿主、依赖、样式基线本身尚未稳定的项目页面

## 使用原则

- 先验证分类是否正确，再验证生成是否稳定
- 先验证最小决策包是否可形成，再验证页面实现
- 优先补前置 guidance，不优先增加后置重校验
- 只有重复出现的稳定问题，才考虑沉淀为新规则或更清晰的协调模式命名
