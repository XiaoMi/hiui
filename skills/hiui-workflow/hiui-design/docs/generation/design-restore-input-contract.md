# 设计还原输入合同

## 目标

本文件定义 `design-restore` 输入链的正式输入合同。

这里的 `design-restore` 表示“设计还原输入链”，也就是系统基于正式设计稿而不是原型草图进入页面生成主链。

它解决的是：

- 设计还原和原型生成如何分流
- 写代码前必须先锁定哪些输入事实
- 哪些输入缺失时必须 fail closed

它不解决的是：

- 生成器内部的最终代码落地细节
- family generator 的最终代码落地细节
- 生成后的重型视觉返工

## 输入方式

`design-restore` 当前规划为两种输入方式：

- `figma-design-restore`
- `design-screenshot-restore`

固定约束：

- `figma-design-restore` 是主输入方式；没有节点定位的文件级链接不在当前正式范围内
- `design-screenshot-restore` 是降级输入方式；它不能承诺与 `figma-design-restore` 同等级的结构确定性
- 当前第一阶段只对外开放 `figma-design-restore`；`design-screenshot-restore` 保留合同与内部结构定义，但不作为公开执行入口
- `prototype-screenshot` 继续只服务于原型生成，不复用为设计还原

## 最小确认对象

设计还原进入 brief / generate 主链前，必须先形成 `confirmedDesignRestoreInput`。

补充约束：

- 若上游已经能够明确给出 `restoreDecisionPackage`，应直接传完整对象
- 若上游暂时只有设计证据、`mustMatchRegions`、目标状态和聊天确认，`design-restore-intake` 会先补出一份最小可用 `restoreDecisionPackage`
- 但这类自动补全只负责形成“可进入主链的最小区域决策”，不等于已经完成高保真设计理解

推荐最小结构：

```json
{
  "inputMode": "figma-design-restore",
  "evidence": {
    "figmaUrl": "https://www.figma.com/...",
    "fileKey": "optional-file-key",
    "nodeId": "required-node-id-for-figma-input"
  },
  "targetViewport": {
    "kind": "desktop",
    "width": 1440
  },
  "targetState": {
    "stateId": "default",
    "label": "默认态"
  },
  "mustMatchRegions": [
    {
      "regionId": "page-header",
      "reason": "页面标题与主操作必须贴稿"
    }
  ],
  "allowedAdaptationLevel": "wrapper-only",
  "assetPolicy": {
    "icons": "prefer-design-assets",
    "images": "prefer-design-assets",
    "allowHandwrittenReplacement": false
  },
  "restoreDecisionPackage": {
    "pageGoal": "一句话说明本页面的核心任务",
    "layoutIntent": "说明页面的主阅读流与主工作区关系",
    "regionDecisionTable": []
  },
  "confirmation": {
    "confirmed": true,
    "finalPrompt": "基于 hiui-design 生成页面……"
  }
}
```

## 必填字段

- `inputMode`
- `evidence`
- `targetViewport`
- `targetState`
- `mustMatchRegions`
- `allowedAdaptationLevel`
- `assetPolicy`
- `restoreDecisionPackage`
- `confirmation.confirmed`
- `confirmation.finalPrompt`

## fail-closed 条件

出现以下任一情况时，设计还原输入必须停止，不得继续进入生成：

- `inputMode` 不属于当前支持的设计还原输入集合
- `figma-design-restore` 缺少 `nodeId`
- `design-screenshot-restore` 缺少绝对路径截图证据
- `targetViewport` 未确认
- `targetState` 未确认
- `restoreDecisionPackage` 为空
- `regionDecisionTable` 为空
- `confirmation.confirmed != true`
- `confirmation.finalPrompt` 为空
- `restore intake` 在最小补全后，仍无法产出非空 `regionDecisionTable`

## 与原型生成的边界

- `prototype-screenshot` 先产出 `pageTypeRecommendation + promptDraft + confirmation`
- `design-restore` 先产出 `restoreDecisionPackage + confirmation`
- 两者都可以继续进入共享主链，但前置决策对象不同，成功标准也不同

## 与 family/type routing 的关系

- `restoreDecisionPackage.regionDecisionTable` 是 `load-generation-brief` 做 family/type routing 的正式输入
- 当区域决策已经能稳定命中单一路线时，主链允许自动补齐缺失的 `page-type` 或 `page-family`
- 当显式传入的 `page-type` / `page-family` 与单一路线冲突时，主链必须 fail closed
- 当区域决策还只能缩到候选页型集合时，主链只返回候选范围，不自动脑补最终页型
