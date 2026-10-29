# 样式专项走查

> 用途：在通用 UX 走查之外，补一层更细的视觉与样式检查。它不是单独替代 17 条清单，而是帮助走查者更稳定地发现「主次不清、间距失衡、颜色语义混乱、状态样式不统一」这类问题。

## 什么时候启用

- `url` / `screenshot`：**默认启用**
- 用户明确提出「样式走查 / 视觉走查 / UI 走查 / 看样式问题」：**强制启用**
- `code`：当能看到明确样式证据时启用，例如样式文件、Design Token、组件主题、页面截图、Storybook、Figma 对照等
- 纯逻辑页、无样式证据或证据明显不足：可降级，只输出「当前样式结论有限，优先以可见证据为准」

## 目标

样式专项不追求“艺术点评”，只回答 3 个问题：

1. 用户第一眼能不能迅速抓到重点？
2. 页面在密集信息下是否仍然整齐、稳定、可读？
3. 同类元素是否在颜色、间距、状态和结构上保持一致？

## 默认顺序

样式专项默认不做整页深扫，而是走可校验的四段：

1. 先做 **页面元素盘点**
2. 由元素盘点生成 **派生必检项**
3. 再做 **结构四问快扫**
4. 只有命中风险时，再做 **局部样式细查**

这样可以先抓大骨架问题，再决定是否需要展开，不把每次走查都拖得很重。

机器门禁：

- `url / screenshot` 模式必须填写 `style_review.structure_scan`
- 用户明确要求样式走查、代码证据暴露样式风险、主流程区域存在视觉风险或用户框选具体区域时，必须设置 `walkthrough_options.style_review_required=true`
- `code` 模式只要填写了 `style_review` 或 `walkthrough_options.style_review_required=true`，也必须填写 `structure_scan`
- `style_review.trigger` 必填，取值 `source_default / user_requested / code_style_evidence / main_flow_visual_risk / user_marked_area`
- `structure_scan` 四问必须逐项给出 `pass / issue / pending / n/a`、`note` 和 `evidence`
- 任一项标 `issue`，必须用 `linked_issue_index` 或 `linked_issue_title` 指向正式 `issues[]` 中的 `category=样式问题`
- 结构四问命中 `issue`、用户明确要求、主流程区域视觉风险或用户框选区域时，必须填写 `detail_check_reason` 并补全六个观察维度 `dimensions`
- `framework=hiui-design` 且执行样式专项时，必须补全 `hiui_sections` 的 `全局视觉基线 / 跨页面共享结构 / 页型规范 / 组件语义`
- `framework=hiui-design` 时必须填写顶层 `element_inventory`，且 `items` 必须覆盖 `page_header_actions / table_row_actions / danger_actions / form_actions / modal_or_drawer_actions / data_visualization`
- `framework=hiui-design` 时必须填写 `style_review.hiui_component_checks`，且必须覆盖八项派生检查；`element_inventory.items.<type>.present=true` 时，对应检查项不得写 `n/a`，`url/screenshot` 模式也不得写 `pending`

## 页面元素盘点与派生必检项

先盘点，后判断。不要先写“整体符合 / 整体不符合”，再回填结论。

`element_inventory.items` 固定包含：

| type | 看什么 |
|------|--------|
| `page_header_actions` | 页头或列表工具栏里的新增、导出、刷新、批量操作等动作组 |
| `table_row_actions` | 表格操作列里的查看、编辑、删除、启停等行内动作 |
| `danger_actions` | 删除、禁用、发布、撤回等可能造成损失的动作 |
| `form_actions` | 新建 / 编辑 / 详情页底部或顶部的取消、保存、提交、暂存 |
| `modal_or_drawer_actions` | 弹窗 / 抽屉底部操作区、关闭、确认、取消 |
| `data_visualization` | 统计卡、趋势图、图表、风险指标、状态数值 |

HiUI 派生检查固定包含：

| id | 检查项 | 适用元素 |
|----|--------|----------|
| `HIUI-ACTION-PRIMARY-RIGHTMOST` | 页头主按钮位于动作组最右端 | `page_header_actions` |
| `HIUI-ACTION-GROUP-RIGHT-ALIGNED` | 页头动作组靠右对齐 | `page_header_actions` |
| `HIUI-TABLE-ROW-ACTION-LINK-BLUE` | 表格行内操作使用蓝色 link 文本 | `table_row_actions` |
| `HIUI-TABLE-ROW-ACTION-FIXED-RIGHT` | 表格操作列固定在右侧 | `table_row_actions` |
| `HIUI-DANGER-ACTION-CONFIRM` | 危险操作具备二次确认或撤销路径 | `danger_actions` |
| `HIUI-FORM-FOOTER-ACTIONS` | 表单底部操作主次清晰并靠右 | `form_actions` |
| `HIUI-MODAL-DRAWER-ACTION-SEMANTICS` | 弹窗抽屉操作区符合主次与风险语义 | `modal_or_drawer_actions` |
| `HIUI-DATA-VIS-THEME-SEMANTICS` | 统计图表使用 HiUI 主题与状态语义 | `data_visualization` |

判定规则：凡是不符合规范的，都进入正式 `issues[]`；不影响任务完成或理解效率的，优先定为 `P3`，不得因为“只是样式”而漏报。

## 结构四问快扫

以下 4 项是首轮样式走查的默认必查项。它们都在看页面大骨架有没有“断、歪、散、空”。

### 1. 页头到首屏内容有没有接住

- 看什么：页头 / 页面标题出来后，首屏主内容是否及时接住
- 常见问题：标题出来了，但第一行卡片或主体内容整体下沉，首屏被长条留白切开
- 上报要求：一旦命中，不要只写“版面偏松”；要单独写成边距 / 留白问题

### 2. 主白底外边距稳不稳

- 看什么：主白底容器四周安全距离是否稳定，是否出现一侧明显更松或更紧
- 常见问题：左、上、右三侧边距档位不一致；白底壳虽然存在，但内容没有真正对齐到同一条边
- 上报要求：若影响首屏重心或阅读流，优先归到 `间距与对齐` 或 `密度与版面稳定性`

### 3. 多列有没有收口

- 看什么：双列 / 三列布局是否真的闭合，每一列是否承担持续职责
- 常见问题：第三列只放一张卡就结束；右下、左下或中段出现大块无效空白；页面像“少了一块”
- 上报要求：命中后要明确写出“哪一列没收口”，不要只写“页面松散”

### 4. 有没有大块无效空白

- 看什么：页面里的留白有没有真正承担分区、停顿或承接作用
- 常见问题：出现长条、大片、突兀的空白，但没有帮助阅读流或结构分组
- 上报要求：命中后要明确写出“哪一块空白没有承担任务”，不要只写“留白过多”

## 六个观察维度

以下 6 维不再默认整页细抠，而是在以下场景进入：

- 结构四问命中 `issue`
- 主流程经过区域存在明显视觉风险
- 用户明确要求样式走查
- 用户额外提供截图 / 箭头 / 标记指出具体区域

进入后，也只围绕重点区域细查，不做整页无差别扫描。

### 1. 信息层级

- 看什么：页面标题、分区标题、主按钮、核心数字、正文、辅助说明是否有明显主次
- 常见问题：标题和正文一样重；主按钮埋在一堆次要按钮里；关键状态不突出
- 输出句式：`首屏主次关系清楚 / 首屏重点不够聚焦，用户要先停下来辨认`

### 2. 间距与对齐

- 看什么：卡片间距、表单上下间隔、按钮组、列表列头列体、分区边界是否稳定
- 常见问题：同层元素间距忽大忽小；左边线不齐；按钮与输入框基线漂移
- 输出句式：`间距节奏稳定 / 同层对象留白不一致，导致页面显得松散或拥挤`

### 3. 文字可读性

- 看什么：字号层级、字重、行高、灰度、长文换行、数字可比性
- 常见问题：说明文过淡；表格数字难纵向比较；长文本挤成一坨
- 输出句式：`文字主次清楚 / 文本对比不足，阅读成本偏高`

### 4. 色彩语义

- 看什么：主色、危险色、成功色、选中色、禁用态是否各司其职
- 常见问题：同一种蓝色同时表示“可点击”“进行中”“选中”；危险动作不够醒目；禁用态像可点击
- 输出句式：`颜色语义基本统一 / 颜色承担了多重含义，容易误判状态`

### 5. 组件状态一致性

- 看什么：按钮、标签、卡片、表格行、输入框在默认、hover、选中、禁用、错误态是否一致
- 常见问题：有的卡片 hover 有反馈，有的没有；错误态颜色和普通提示一样；同类按钮圆角/高度不统一
- 输出句式：`同类组件反馈一致 / 同类状态表达不统一，用户难以形成稳定预期`

### 6. 密度与版面稳定性

- 看什么：高密信息页是否仍能快速扫读；窄屏或小窗口时是否明显塌陷；统计卡/表格/筛选区是否互相抢空间
- 常见问题：一屏元素太多但没有分层；窄屏挤压导致主路径消失；图表与表格互相打架
- 输出句式：`高密布局仍可扫读 / 页面在高密状态下开始失去节奏`

### HiUI 桌面页额外要求

若页面属于 HiUI / `hiui-design`，且当前主要视图是桌面宽屏，在结构快扫之外还必须明确回答：

1. 页头到首屏内容是否接得过慢
2. 主白底内容区的四周边距是否在同一档位
3. 双列 / 三列是否形成稳定收口，而不是某一列提前结束
4. 是否存在长条无效空白，削弱了主阅读流

这 4 条必须落到 `hiui_sections`；只要命中任一项，都不能只塞进“整体判断”里，必须单独写进 `dimensions`、`hiui_sections` 或正式 `issues[]`。

## 证据要求

- `url` / `screenshot`：优先用页面截图、交互后截图、标注图说明样式问题
- `code`：优先引用样式文件、组件 props、token、布局结构；不能静态证明的 hover / 响应式 / 动画，不写成已确认事实
- 若只是“感觉不好看”，但无法指出具体位置、现象与影响，**不要上报**

## 与现有清单的关系

- 仍以 `ux-checklist.md` 为主清单，但 checklist 更偏向收口与补漏，不再等同于第二轮整页样式检查
- 样式专项常用于补强这些条目：`UX-1.2`、`UX-1.7`、`UX-2.5`、`UX-3.1`、`UX-3.5`
- 不要因为做了样式专项，就跳过核心流程、反馈、防错等通用检查
- HiUI 场景仍先看 `hiui-template-baseline.md`；模板合规默认项不要误报成样式问题

## HiUI 专项分支

若页面明确属于 HiUI / `hiui-design` 体系，且执行了样式专项，必须再补一轮 HiUI 对照，读取：

- `references/hiui-visual-design-review-matrix.md`

建议顺序：

1. 先过结构四问快扫，确认页面大骨架是否稳定
2. 若结构或重点区域命中问题，再过通用 6 维，确认是否存在明显的主次、间距、颜色和状态问题
3. 再用 HiUI 对照表补 5 个专项结论：
   - `全局视觉基线`
   - `跨页面共享结构`
   - `页型规范`
   - `组件语义`
   - `数据可视化专项`（仅有图表页时）
4. 对 HiUI 页面，优先判断“是否还像同一套系统”，再判断“局部是否好看”

使用边界：

- `hiui-template-baseline.md` 负责判定“页型有没有偏离模板语法”
- `hiui-visual-design-review-matrix.md` 负责判定“视觉样式有没有偏离 HiUI 体系”
- 两者都命中时，报告里可以写成同一条问题，但不要重复报两遍
- 若只是模板合规默认项，不要误写成 HiUI 视觉问题

## 输出要求

若执行样式专项，必须在 `report.json` 中补充字段 `style_review`：

```json
"style_review": {
  "framework": "hiui-design",
  "trigger": "user_requested",
  "detail_check_required": true,
  "detail_check_reason": "user_requested",
  "summary": "首屏整体整洁，但主次层级和状态色仍不够稳定。",
  "priority_actions": [
    "先拉开标题、主按钮和辅助说明的视觉权重",
    "统一同层卡片与表单区块的间距节奏"
  ],
  "structure_scan": [
    {
      "name": "页头到首屏内容有没有接住",
      "status": "pass",
      "note": "页头下方可以直接承接主内容",
      "evidence": "标题后紧接筛选区和列表区"
    },
    {
      "name": "主白底外边距稳不稳",
      "status": "issue",
      "note": "主白底左右边距不在同一档位",
      "evidence": "右侧留白明显大于左侧",
      "linked_issue_index": 1
    },
    {
      "name": "多列有没有收口",
      "status": "n/a",
      "note": "当前页面不是多列布局",
      "evidence": "页面主体为单列列表工作区"
    },
    {
      "name": "有没有大块无效空白",
      "status": "pass",
      "note": "未发现割裂阅读流的大块空白",
      "evidence": "首屏内容从筛选区连续进入列表区"
    }
  ],
  "dimensions": [
    {
      "name": "信息层级",
      "status": "issue",
      "note": "主标题、副说明和操作按钮权重接近",
      "evidence": "首屏顶部区域需要反复辨认主路径",
      "linked_issue_index": 1
    },
    {
      "name": "间距与对齐",
      "status": "pass",
      "note": "主要卡片和列表骨架对齐稳定",
      "evidence": "列表区与筛选区左右边线一致"
    },
    {
      "name": "文字可读性",
      "status": "pass",
      "note": "正文和辅助说明仍保持可读",
      "evidence": "字号、行高和灰度未明显影响阅读"
    },
    {
      "name": "色彩语义",
      "status": "pass",
      "note": "主色和状态色语义没有混用",
      "evidence": "主按钮、链接和状态色职责清楚"
    },
    {
      "name": "组件状态一致性",
      "status": "pass",
      "note": "同类按钮和输入状态表达一致",
      "evidence": "默认态、禁用态和错误态没有明显分叉"
    },
    {
      "name": "密度与版面稳定性",
      "status": "pass",
      "note": "高密信息下仍能保持扫读节奏",
      "evidence": "筛选区、列表区和操作区没有互相挤压"
    }
  ],
  "hiui_sections": [
    {
      "name": "全局视觉基线",
      "status": "pass",
      "severity": "P2",
      "note": "主交互色、文字灰阶和主白底关系仍在 HiUI 体系内",
      "evidence": "主按钮、链接和选中态均回到 HiUI Blue"
    },
    {
      "name": "跨页面共享结构",
      "status": "pass",
      "severity": "P2",
      "note": "页面仍保持单一主工作区结构",
      "evidence": "未出现第二主滚动或第二白底工作区"
    },
    {
      "name": "页型规范",
      "status": "issue",
      "severity": "P3",
      "note": "列表页右侧留白节奏略偏松",
      "evidence": "主白底右侧空间比左侧更松",
      "linked_issue_index": 1
    },
    {
      "name": "组件语义",
      "status": "pass",
      "severity": "P2",
      "note": "按钮、筛选和表格组件语义保持一致",
      "evidence": "未发现伪造组件或同类组件样式分叉"
    }
  ]
}
```

字段说明：

- `framework`：可选；HiUI 页面建议填 `hiui-design`
- `summary`：一句整体判断，不超过 2 句
- `priority_actions`：1–3 条最值得先收敛的动作
- `structure_scan[]`：结构四问快扫，样式专项触发时必填
  - `name`：必须使用四问名称之一
  - `status`：`pass / issue / pending / n/a`
  - `note`：本项结论
  - `evidence`：一句证据或观察依据
  - `linked_issue_index / linked_issue_title`：当 `status=issue` 时必填其一，指向正式 `issues[]` 中的样式问题
- `dimensions[]`
  - `name`：建议用上述 6 维名称，也允许写更贴切的维度名
  - `status`：`pass / issue / pending / n/a`
  - `note`：该维度的结论
  - `evidence`：一句证据或观察依据
- `hiui_sections[]`：可选；HiUI 页面建议填写
  - `name`：建议使用 `全局视觉基线 / 跨页面共享结构 / 页型规范 / 组件语义 / 数据可视化专项`
  - `status`：`pass / issue / pending / n/a`
  - `severity`：建议用 `P0 / P1 / P2 / P3`；其中 `P3` 可用于轻微样式规范偏差
  - `note`：本项结论
  - `evidence`：一句证据或定位依据
  - `linked_issue_index / linked_issue_title`：当 `status=issue` 时必填其一，指向正式 `issues[]` 中的样式问题

一致性门禁：

- 若 `dimensions` 中 `信息层级 / 间距与对齐 / 组件状态一致性 / 密度与版面稳定性` 已标 `issue`，则 `UX-1.2 / UX-2.5 / UX-3.1` 不得全部为 `pass`
- 若 `framework=hiui-design` 且 `hiui_sections` 中 `跨页面共享结构 / 页型规范 / 组件语义 / 全局视觉基线` 已标 `issue`，则相关 checklist 不得全部为 `pass`
- 用户提供了额外截图并明确指出样式区域时，这些区域应直接进入优先细查范围，报告正文中应能找到对应结论

正式问题落点规则：

- `style_review` 只负责收纳维度结论与优先收敛方向，**不替代**正式问题列表
- 凡是不符合样式规范 / 设计系统规范的样式项，都必须同步写入 `issues[]`
- 是否影响任务完成、理解效率或稳定性，只决定优先级：影响明显时用 `P0 / P1 / P2`，不影响时可用 `P3`
- 在对话报告 / docx 中，这类样式问题必须进入「问题详情」模块，不能只留在附录里的「样式专项观察」
- `url / screenshot` 模式下，进入 `issues[]` 的正式样式问题必须附标注图与 `bbox`
- `style_review.dimensions` / `style_review.hiui_sections` 中的 `issue` 必须通过 `linked_issue_index` 或 `linked_issue_title` 指向正式样式 issue
- 只有 `pass / pending / n/a` 这类非确定问题，才可以只停留在 `style_review.dimensions` / 附录维度结论中

## 降噪原则

- 不把品牌偏好、个人审美倾向当成缺陷
- 不为了凑样式问题而报很轻的“好像可以更美观”
- 若真正影响任务效率，优先按任务影响写；若主要影响感知质量，再归到样式专项
