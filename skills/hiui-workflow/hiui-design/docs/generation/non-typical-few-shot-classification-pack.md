# 非典型页面 Few-shot 判型包

## 目标

本文件用于把已经验证过的真实页面样本，转成 AI 在 `non-typical-page` 边界不清时可参考的轻量 few-shot 证据包。

它解决的是：

- 面对截图或页面描述时，在共享结构事实已经抽取之后，如何做保守的 `yes / partial / no` 边界校准
- 哪些页面虽然看起来“不典型”，但其实仍应回到典型页变体或分析页
- AI 应优先模仿哪些判断依据，而不是凭视觉新鲜感误判

它不解决的是：

- 自动脚本化生成
- 把样本沉淀成页面模板式枚举或未验证协调模式持续扩容
- 把样本升格成新的页面模板或 family 定义
- 生成后的重验收

## 使用顺序

当输入方式是 `prototype-screenshot` 或用户直接给出页面截图时，若页面疑似为完全非典型页面，按下面顺序使用：

1. 先读 `design-system-first.md`
2. 再读 `shared-page-design-guidance.md`
3. 再读 `non-typical-design-principles.md`
4. 再读 `non-typical-ai-generation-guidance.md`
5. 只有在 family 边界仍不清时，才用本文件做 `yes / partial / no` few-shot 判型
6. 只有 `yes` 且共享结构事实已清晰时，才继续形成 `nonTypicalDecisionPackage`

使用前提：

- 先完成共享结构事实抽取，例如：统一 `PageHeader`、唯一 `whiteBody` owner、唯一 `primaryRegion`、主阅读流、跨区域主联动
- 样本只用于校准判断，不用于定义新页型、不用于提供布局模板、不用于把截图排布直接沉淀成页面模板或未验证协调模式

## 固定输出格式

AI 先输出一个轻量判型对象：

```json
{
  "familyDecision": "yes | partial | no",
  "recommendedRoute": "non-typical-page | typical-page-variant | analytics-page",
  "confidence": "high | medium | low",
  "reasons": [
    "2 到 4 条可观察结构事实"
  ],
  "boundaryRisk": [
    "1 到 3 条误判风险"
  ],
  "nextAction": "继续形成 decision package | 停在边界判断层 | 回到 analytics-page"
}
```

要求：

- `reasons` 只写结构事实和主任务承载事实，不写审美判断
- `boundaryRisk` 不能省略
- `familyDecision=partial` 时，不进入代码生成
- `familyDecision=no` 时，必须明确回到哪条链路

## Few-shot 样本

### 样本 1：确认订单信息

输入事实：

- 左侧是用户和订单上下文
- 中间存在阶段轨
- 中间主区承载订单确认
- 右侧存在订单快照
- 多个稳定区域共同完成主任务

输出示例：

```json
{
  "familyDecision": "yes",
  "recommendedRoute": "non-typical-page",
  "confidence": "high",
  "reasons": [
    "页面主任务依赖左侧上下文、中间阶段轨、中间确认区和右侧快照共同完成",
    "不存在单一表格、单一表单或单一详情可以稳定承载页面主任务",
    "阶段轨稳定驱动中间主区与右侧快照的跨区域协同"
  ],
  "boundaryRisk": [
    "不要把它误降级成详情页加侧栏"
  ],
  "nextAction": "继续形成 decision package"
}
```

学习重点：

- 不是因为分栏多才算非典型
- 而是因为多个稳定区域共同承担主任务，且跨区域主联动明确

### 样本 2：机构售卖单管理

输入事实：

- 左侧是售卖单选择列表
- 右侧是分组明细、状态与确认发货动作
- 左侧选择稳定驱动右侧内容切换
- 右侧不是单纯“一个普通表格页”

输出示例：

```json
{
  "familyDecision": "yes",
  "recommendedRoute": "non-typical-page",
  "confidence": "high",
  "reasons": [
    "页面核心任务依赖左侧选择与右侧分组明细联动完成",
    "右侧区域同时承载结构化分组、状态表达和主动作，不是典型列表页的简单延伸",
    "selection-detail-sync 是该页不可替代的主协同关系"
  ],
  "boundaryRisk": [
    "不要只因为右侧出现表格样元素就误判成普通 split 表格页"
  ],
  "nextAction": "继续形成 decision package"
}
```

学习重点：

- `selection-detail-sync` 可以成立为非典型页面
- 但前提是右侧已经不再是经典表格主承载体

### 样本 3：业务规模

输入事实：

- 顶部为指标卡
- 中间为趋势图
- 下方为明细表
- 阅读流符合分析页常见结构

输出示例：

```json
{
  "familyDecision": "no",
  "recommendedRoute": "analytics-page",
  "confidence": "high",
  "reasons": [
    "页面由指标卡、趋势图和明细表构成，属于分析页固定阅读流",
    "当前已有 analytics-page 家族可以覆盖该结构",
    "不需要引入新的非典型页面布局语义"
  ],
  "boundaryRisk": [
    "不要因为图表和表格混排就误判成 non-typical-page"
  ],
  "nextAction": "回到 analytics-page"
}
```

学习重点：

- 视觉复杂不等于非典型
- 只要已有分析页 workflow 能承载，就不应再开新家族

### 样本 4：方案一 / 车辆列表

输入事实：

- 左侧存在卡片式选择区
- 右侧是车辆明细表
- 顶部仍是筛选控制区
- 主任务仍主要通过右侧表格完成

输出示例：

```json
{
  "familyDecision": "partial",
  "recommendedRoute": "typical-page-variant",
  "confidence": "medium",
  "reasons": [
    "页面具备 selection-detail-sync 特征",
    "但右侧仍是经典表格主承载体",
    "当前证据不足以证明它已经脱离典型列表页 split 变体"
  ],
  "boundaryRisk": [
    "容易因为左侧卡片选择区而被误判成完全非典型页面",
    "若直接进入 non-typical-page，会放大页面家族边界"
  ],
  "nextAction": "停在边界判断层"
}
```

学习重点：

- `partial` 是必要分类，不要把所有边界样本强行判成 `yes` 或 `no`
- 只要经典表格仍是主任务承载体，就优先回查典型页 split 变体或局部改造

## 稳定判型规则

- 先看主任务由什么承载，而不是先看分栏数量
- 先看是否存在唯一经典主承载体，再看是否需要新的布局语义
- 先看 `shared-page-design-guidance.md` 中的共享结构事实是否已经成立，再看 few-shot 类比是否有意义
- 先看已有家族能否覆盖，再考虑 `non-typical-page`
- 先看跨区域主联动是否不可替代，再决定是否进入完全非典型页面

## 易错点

- 把“多分区”误当成“非典型页面”
- 把“图表 + 表格”误当成“非典型页面”
- 把“左侧选择 + 右侧经典表格”误当成“非典型页面”
- 因为页面看起来新颖，就绕开典型页变体和分析页

## 结论

当前 few-shot 只支持一个保守目标：

- 帮 AI 先把明显 `yes`、明显 `no` 和边界 `partial` 分开
- 在边界不清时提供反误判证据，而不是替代 shared guidance 与 family 原则

它不支持：

- 自动扩展更多协调模式
- 从样本反推出新的页型枚举
- 代替 `nonTypicalDecisionPackage`
- 代替生成前的设计系统约束
