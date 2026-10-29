# 设计还原落地流程

## 目标

本文件定义 `design-restore` 的主链路。

它强调的是“生成前先把关键判断锁住”，而不是“先生成，再靠多轮修复慢慢逼近”。

## 主链路

`design evidence -> restore intake -> regionDecisionTable -> family/type routing -> brief -> generator -> light guard`

说明：

- `design evidence` 表示正式设计稿证据，例如带节点定位的 `Figma` 链接或正式设计截图
- `restore intake` 表示设计还原预处理层；它负责先做区域决策，而不是直接写代码
- `regionDecisionTable` 表示区域决策表；它记录每个区域该怎么承接、哪些地方必须贴稿、哪些地方允许保守处理
- `light guard` 表示轻守门；它只检查高影响偏差，不默认拉起重型返工

## 固定原则

1. 设计还原和原型生成必须分链。
2. `HiUI5` 设计体系是硬边界，不是事后纠偏建议。
3. 优先提高首轮正确率，不默认依赖生成后修复。
4. 设计还原不是新的页面家族，而是新的输入链。
5. 能命中典型页 / 分析页 / 非典型页的现有主链时，必须优先复用现有主链。

## family/type routing 规则

`load-generation-brief` 当前会直接消费 `regionDecisionTable`，固定按下面顺序收口：

1. 出现稳定图表 / 分析信号时，优先路由到 `analytics-page`
2. 多个稳定区域共同承担主任务时，优先路由到 `non-typical-page`
3. 否则继续落回 `typical-page`，并尽量自动收口到明确 `page-type`

补充约束：

- 若上游没有显式传 `--page-type` 或 `--page-family`，且设计还原决策已经给出单一路线，主链会自动补齐选择器
- 若显式传入的选择器和设计还原的单一路线冲突，主链必须 fail closed
- 若设计还原只能把范围缩到一组候选页型，但还不足以唯一确认，主链仍会停下并要求显式选择

## 当前实施状态

- 产品合同：已冻结
- 输入对象：已接线；`confirmedDesignRestoreInput` 已进入主链脚本参数与共享 brief
- 预处理层：已接线基础校验、标准化与最小决策补全；当上游只提供 `mustMatchRegions`、目标状态与聊天确认时，`restore intake` 会先物化一份最小可用 `restoreDecisionPackage`
- brief 接线：已完成；`regionDecisionTable` 已进入 family/type routing，并会产出 `designRestoreRoutingDecision`
- light guard：已接线；当前复用生成前校验、`integration-preflight` 与 `non-typical-page-sanity`

## 首版范围

- 先做 `figma-design-restore`
- 先做桌面端单页面单状态
- 先接 `typical-page` 与 `non-typical-page`
- 生成后只保留轻守门，不默认开启多轮返工
