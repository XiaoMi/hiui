# 页面输入方式

## 目标

本文件定义 `hiui-design` 页面生成主链路中的 `信息输入方式`，并把它从愿景描述收敛为可执行事实源。

页面输入方式只回答一个问题：

- AI 根据什么材料理解页面

它不回答：

- 页面最终属于什么页型
- 页面最终走哪条生成路径
- 页面代码应如何直接生成

页面级主链路固定为：

`信息输入方式 -> 页面家族 / 页面类型 -> 生成路径`

当前页面家族口径：

- `typical-page`：标准典型页家族，默认走官方母版 + 业务槽位替换；典型页变体仍属于该家族，只是生成路径会切到受控局部改造。
- `analytics-page`：数据可视化等分析页家族，固定页头与 `whiteBody`，内容区按独立 workflow 生成。
- `non-typical-page`：完全非典型页面家族，当前已提供 family-specific 的 AI 前置引导、最小 contract、`load-generation-brief.mjs` / `plan-page-task.mjs` 执行接线、`nonTypicalExecutionBrief`、family-specific generator、light sanity 和样本回归；当前对 validated v1 scope 的真实代码生成已公开开放，但 `legacy refactor contract` 仍未接通。

## 当前支持的输入方式

### `page-prompt`

- 中文标签：`页面提示词`
- 证据类型：`structured-intent`
- 说明：用户直接提供结构化或半结构化页面描述，由 AI 基于该描述进入页型判断与生成链路。

### `prototype-screenshot`

- 中文标签：`原型截图`
- 证据类型：`visual-reference`
- 说明：用户提供产品原型截图，由 AI 先提取共享结构事实与视觉线索，再推荐页型并形成提示词草稿，用户在对话中确认后继续生成。

补充约束：

- `prototype-screenshot` 只服务于“原型生成”目标，不承担“设计还原”目标
- 当用户要求“尽可能还原正式设计稿”时，不应继续复用 `prototype-screenshot` 口径，而应进入独立的 `design-restore` 输入链
- 当前 `design-restore` 输入链已经完成主链脚本接线；不要再把 `prototype-screenshot` 包装成高保真设计还原替代入口

### `legacy-system-reconstruction`

- 中文标签：`旧系统重构`
- 证据类型：`existing-page-facts`
- 说明：用户提供旧系统页面、旧系统代码或旧系统行为事实，由 AI 在保留业务事实的前提下进入页型判断与生成链路。

## 已接线输入方式（需上游先确认设计还原输入）

下面两种输入方式已经完成主链脚本接线，可被 `brief / plan / generate / execute` 共享主链接收。

但当前范围仍有一个固定前提：正式执行前，上游必须先产出 `confirmedDesignRestoreInput`，也就是整理好的设计证据、区域决策包与聊天确认结果；不要把它描述成“只给一个设计链接就能自动完成全部决策”的现成黑盒能力。

### `figma-design-restore`

- 中文标签：`Figma 设计还原`
- 证据类型：`structured-design-reference`
- 说明：用户提供带节点定位的 `Figma` 设计稿，由系统先完成设计还原决策，再进入页面家族 / 页型与生成主链路。
- 目标：在 `HiUI5` 设计体系内，优先追求首轮高保真还原，而不是“先生成再多轮修补”。

### `design-screenshot-restore`

- 中文标签：`设计稿截图还原`
- 证据类型：`design-visual-reference`
- 说明：用户提供正式设计稿截图，由系统先完成区域级还原决策，再进入页面家族 / 页型与生成主链路。
- 目标：作为 `figma-design-restore` 的降级输入；它追求视觉接近，但不承诺与带节点定位的 `Figma` 输入同等级的结构确定性。
- 当前开放状态：保留合同与内部结构定义，但暂不作为对外公开入口；第一阶段只对外开放 `figma-design-restore`。

## `legacy-system-reconstruction` 的正式口径

### P0 适用边界

`legacy-system-reconstruction` 的 P0 能力只负责两件事：

- 先把旧系统证据整理成可执行的页面事实对象
- 再把该对象送入与 `page-prompt` 共享的后续生成主链路

固定边界：

- `legacy-system-reconstruction` 是 `信息输入方式`，不是另一条独立页面生成体系
- 命中该模式后，后续仍共享 `页面家族 / 页面类型 -> 生成路径 -> brief -> generate -> gate -> report`
- 旧页重构先看“旧页面里哪些业务事实必须保留”，再决定页型与模板；不要把旧页面的历史 DOM、历史宿主结构或历史视觉直接视为新模板
- 若旧页面主体仍是标准典型页，则优先继续走普通典型页链路；只有标准模板无法完整覆盖，但页面仍保留基础页型大多数特征时，才在同一条主链路里触发 `pageAdjustmentContract`

### P0 最小输入对象口径

P0 阶段允许先形成最小 `legacyReconstructionInput` 内存对象，再继续进入主链路。最小对象至少应包含：

- `evidence`
- `pageFamilyRecommendation`
- `pageTypeRecommendation`
- `legacyFacts.titleDraft`
- `legacyFacts.pageGoal`
- `legacyFacts.layoutFacts`
- `legacyFacts.invariants`
- `confirmation`

固定要求：

- `evidence` 至少要能证明一个旧页事实来源，例如旧路由、旧页面代码路径、旧系统 URL、旧系统截图路径或旧系统名称
- `pageFamilyRecommendation` 与 `pageTypeRecommendation` 只表达“当前旧页更像什么”，不直接替代正式页型解析
- `legacyFacts` 先收口业务事实，例如布局、查询语义、表格语义、接口语义、交互语义与必须保留的不变量；不要把旧页实现细节混成生成模板
- `confirmation.finalPrompt` 必须基于旧页事实收口，而不是脱离旧页事实重新发明一个新需求

### P0 失败场景

以下情况必须停止，不允许自动回退成 `page-prompt`：

- 只能判断“像旧页重构”，但无法形成最小 `legacyReconstructionInput`
- 能找到旧页面代码或旧页面入口，但无法提炼出最小 `legacyFacts`
- `legacyFacts.invariants` 为空，无法说明哪些旧业务语义必须保留
- 用户尚未确认最终 `pageFamily` / `pageType` 或最终提示词
- 旧页事实不足以支撑页型判断，却试图直接进入生成

## `prototype-screenshot` 的正式口径

### P0 适用边界

`prototype-screenshot` 的 P0 能力只支持以下范围：

- 单张主页面截图
- AI 在对话中完成截图理解
- AI 在对话中给出页型推荐
- AI 在对话中形成提示词草稿
- 用户在对话中确认最终页型与最终提示词
- 确认结果以内存对象传递给现有 brief / generate 主链路

当 screenshot 页面疑似属于 `non-typical-page` 时，先不要直接形成“完全非典型页面”结论，而是先读取：

1. `shared-page-design-guidance.md`
2. `non-typical-design-principles.md`
3. `non-typical-ai-generation-guidance.md`
4. `non-typical-conversation-output-template.md`
5. 若 family 边界仍不清，再读 `non-typical-few-shot-classification-pack.md`

固定要求：

- 先从截图中抽取统一页头、唯一 `whiteBody`、主阅读流、区域角色与主联动关系，再判断 family
- 截图只能作为结构事实与视觉线索来源，不能直接被提升为新的页型模板、页面 archetype 或示例枚举

随后先做一次轻量 `yes / partial / no` 判型：

- `yes`：进入 `non-typical-page` 的最小决策包形成
- `partial`：停在边界判断层，优先回查典型页 split 变体或局部改造
- `no`：明确回到 `analytics-page` 或普通典型页链路

对话输出时，不要只给口头结论；应优先形成统一的 `classification + nonTypicalDecisionPackage + stopDecision` 结构化结果，再做简短说明。

### P0 非目标

P0 明确不做以下能力：

- 多张截图合并生成一个页面
- 在仓库内新增确认 UI、配置页或弹窗流程
- 独立 JSON artifact 落盘与回放
- 本地 OCR / CV 脚本直接识图
- image-to-code 直出
- 让 screenshot 流程绕过 `page-types.manifest.json`、官方母版、独立 workflow 或现有 gate

## `prototype-screenshot` 的对话输出要求

当输入方式为 `prototype-screenshot` 时，AI 必须先在对话中形成以下三类结果：

### 1. `pageTypeRecommendation`

至少包含：

- `recommended`
- `candidates`
- `confidence`
- `reasons`

要求：

- `candidates` 最多 3 个
- 必须说明推荐理由
- 若无法形成可解释推荐，则停止，不进入生成

### 2. `promptDraft`

至少包含：

- `sharedStructureFacts`
- `titleDraft`
- `pageGoal`
- `observedLayout`
- `observedModules`
- `unknowns`

要求：

- `observedLayout` 只描述从截图可观察到的结构事实
- `observedModules` 只描述从截图可观察到的模块与字段线索
- 若页面疑似复杂或非典型，应额外说明统一页头、唯一 `whiteBody`、主阅读流与区域主联动这些共享事实是否成立
- `unknowns` 必须保留，不能把不确定内容伪装成确定业务规则

### 3. `confirmation`

确认发生在 AI 对话框中，而不是仓库内 UI 中。P0 的确认结果必须至少包含：

- `confirmed=true`
- `confirmedPageType`
- `finalPrompt`

要求：

- 未确认前，禁止进入生成
- `confirmedPageType` 必须是正式页型 id
- `finalPrompt` 必须是对 `promptDraft` 的确认结果，而不是脱离截图和草稿重新发明

## `prototype-screenshot` 的内存对象口径

P0 不创建独立 artifact 文件。截图模式的确认结果只以内存对象传递给 brief / generate 主链路。

推荐对象结构如下：

```json
{
  "inputMode": "prototype-screenshot",
  "evidence": {
    "screenshotPath": "/absolute/path/to/prototype.png"
  },
  "pageTypeRecommendation": {
    "recommended": "table-stat",
    "candidates": [
      {
        "pageType": "table-stat",
        "score": 0.88,
        "reasons": ["识别到统计卡区", "识别到筛选区", "识别到表格区", "识别到分页区"]
      }
    ],
    "confidence": "medium",
    "reasons": ["页面主结构更接近数据统计表"]
  },
  "promptDraft": {
    "sharedStructureFacts": {
      "hasPageHeader": true,
      "hasSingleWhiteBody": true,
      "readingFlow": "header -> stat-section -> query-filter -> table -> pagination",
      "primaryRegion": "table"
    },
    "titleDraft": "门店任务管理",
    "pageGoal": "查看和筛选任务列表，并执行常见任务操作",
    "observedLayout": ["header", "stat-section", "query-filter", "table", "pagination"],
    "observedModules": {
      "headerActions": ["导出", "新建任务"],
      "queryFields": ["任务名称", "状态", "负责人", "时间范围"],
      "metricCards": ["任务总数", "待处理", "已完成", "超时任务"],
      "tableColumns": ["任务名称", "负责人", "状态", "截止时间", "更新时间"]
    },
    "unknowns": ["状态枚举值未确认", "按钮行为未确认"]
  },
  "confirmation": {
    "confirmed": true,
    "confirmedPageType": "table-stat",
    "finalPrompt": "基于 hiui-design 生成一个数据统计表页……"
  }
}
```

## `prototype-screenshot` 的正式门禁

当输入方式为 `prototype-screenshot` 时，以下条件必须全部满足，否则直接 fail closed：

- 只存在单张截图路径
- 截图路径存在且是单值字符串
- 已形成 `pageTypeRecommendation`
- 已形成 `promptDraft`
- `promptDraft.sharedStructureFacts` 非空
- `promptDraft.observedLayout` 非空
- 用户已在对话中确认
- `confirmedPageType` 非空
- `finalPrompt` 非空
- `confirmedPageType` 与实际生成页型一致

此外，即使 screenshot 输入已完成确认，也仍必须继续满足：

- `page-types.manifest.json` 页型事实源
- 对应页型的官方母版与 `generationWorkflow`
- `coverageDecision`
- `pageAdjustmentContract`（如命中）
- 输出目录、导航、dependency isolation、integration-preflight 等既有门禁

## screenshot 输入的失败场景

以下情况必须停止，不允许继续生成：

- 用户提供了多张截图
- 无法从截图中形成可解释的页型推荐
- 无法从截图中形成最小提示词草稿
- 用户尚未确认页型
- 用户尚未确认最终提示词
- `confirmedPageType` 与当前目标页型不一致
- 页面只是边界 `partial`，却被直接确认成 `non-typical-page`
- 页面更像 `data-visualization`，但确认结果试图走普通列表页
- 旧项目缺少正式导航挂靠证据

## 与其他输入方式的关系

- `page-prompt` 仍是最直接的结构化输入方式
- `prototype-screenshot` 先把视觉证据转成 `pageTypeRecommendation + promptDraft + confirmation`
- `legacy-system-reconstruction` 继续面向已有页面事实，不与 screenshot 模式混用；它先形成 `legacyReconstructionInput`，再进入与 `page-prompt` 相同的后续主链路

这三种输入方式共享同一条后续链路：

`页面家族 / 页面类型 -> 生成路径 -> brief -> generate -> gate -> report`
