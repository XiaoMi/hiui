---
name: ux-walkthrough
description: >-
  对代码库、URL 或截图进行系统性 B 端体验走查；优先建立业务理解与核心用户流程，先跑主流程与结构快扫，再用 checklist 收口，
  输出结构化问题报告并生成本地 docx；统一收口为完成门禁。适用于用户提出体验走查、UX review、交互走查、界面审查等需求时。
---

# UX Walkthrough

当前版本：`1.4.6`

对产品进行系统性体验走查，输出结构化报告与生成本地 `.docx`。**统一收口为完成门禁**，不可跳过。

## 路径约定

**`<SKILL_ROOT>`** = 本 skill 目录的绝对路径。

```bash
python3 <SKILL_ROOT>/scripts/<脚本>.py ...
```

## 角色与标准

- 角色：资深 B 端体验设计专家；给可执行建议，不是主观吐槽
- 主标准：先理解产品目标、核心任务与关键流程，再完成主流程操作走查；`references/ux-checklist.md` 主要用于最后收口与补漏，不再作为第二轮整页深扫
- HiUI 典型页：`references/hiui-template-baseline.md`（Delta 走查；**模板库全部典型页型**，见该文 **页型索引**）
- HiUI 视觉样式：`references/hiui-visual-design-review-matrix.md`（HiUI + 样式专项时必读；用于核对视觉基线、共享结构、页型语法、组件语义与图表主题）
- 样式专项：`references/style-walkthrough.md`（`url` / `screenshot` 默认启用；用户明确要求“样式走查”时强制启用）
- 辅助：Nielsen、WCAG、品牌规范；冲突时以效率、理解成本、错误恢复、专业感为准
- 优先级：以 `references/severity-rubric.md` 为准，不用 checklist 预设 P 级代替；正式 `issues[]` 默认用 `P0 / P1 / P2`，`category=样式问题` 的规范偏差可用 `P3`
- 无 PRD 时：按 `references/business-understanding.md` 做证据推断；**禁止**把推断写成已确认事实

## 输入 → 模式

| 输入 | 模式 | 文档 |
|------|------|------|
| 本地项目目录 | `code` | `references/mode.md#code` |
| `http(s)` URL | `url` | `references/mode.md#url` |
| 图片 | `screenshot` | `references/mode.md#screenshot` |

无法判断时，只问一句最小必要澄清。

---

## 四阶段主流程

```
A 前置检查 → B 走查与报告 → C 生 docx → D 统一收口（强制）
```

### 阶段 A：前置检查

```bash
python3 <SKILL_ROOT>/scripts/precheck_walkthrough.py <输入> --json
```

- 只读 `next_action`、`mode`、`status`、`gate`；**code 模式额外读 `runtime_probe`**
- `continue_walkthrough` → 进入 B；否则补证据 / 澄清 / 失败收口，**不写完整报告**
- **code 输入且 gate 通过后**，`next_action` 可能被 runtime 探测改写：
  - `try_url_walkthrough` → 对 `runtime_probe.reachable_urls[0]` 再跑 URL precheck，阶段 B 按 **url** 走
  - `start_dev_server_then_url_walkthrough` → 先启动 `runtime_probe.suggested_dev_command`；成功则 URL precheck，失败则收窄 code
  - `fallback_code_walkthrough` → 阶段 B 按 **code** 走，但须遵守体验边界（见 `mode-code.md` § 体验边界）
- 门禁细节：`docs/onboarding/gates.md` § 阶段 A

### 阶段 B：走查与报告

**阶段 B 高层入口：**

```bash
python3 <SKILL_ROOT>/scripts/prepare_walkthrough_context.py \
  --precheck-json-file <A 阶段结果.json> \
  --prd-path <prd.md|prd.docx> \
  --signal-file <页面线索.txt> \
  --json
```

- 先看 `walkthrough_source`
- 再看 `business_context_result.status`
- `run_url_walkthrough` / `run_code_walkthrough` → 进入正式走查
- `run_*_walkthrough_with_limited_business_claims` → 继续，但业务结论要保守
- `needs_input` → 先补最小必要信息，不写完整报告

**code 运行时优先（混合走查）：**

1. 若 A 返回 `try_url_walkthrough` 或启动 dev 后拿到本地 URL → **切换 url 模式**：浏览器截图 + 标注图，`report.json` 的 `source=url`
2. 若 dev 启动失败或 A 返回 `fallback_code_walkthrough` → **`source=code`**，附录注明「未启动项目，结论基于代码推断」；只强报 code 可确定的体验问题

**顺序（不可变）：**

0. **HiUI 前置（若适用）**：识别页型 → 读 `references/hiui-template-baseline.md` 对应节（**页型索引** 列全量页型）
   - 若样式快扫已命中结构问题，或页面明确属于 HiUI 且主流程区域存在明显视觉风险，再读 `references/hiui-visual-design-review-matrix.md` 的相关节：先过「全局视觉基线」「跨页面共享结构」；只有命中对应页型或组件时，再补「页面级规范 / 组件级规范 / 数据可视化专项」
1. **先做任务理解**：优先用 `prepare_walkthrough_context.py` 串起阶段 A 结果与 `build_business_context.py`；产出一段**简洁任务理解摘要**，至少写清：
   - `product_goal`
   - `primary_users`
   - `core_tasks`
   - `page_type / main_task`
   - `assumptions / missing_information`
   - **必须生成 1–3 条 `core_flows`**；若页面存在明确主按钮、页头主动作或行内主动作，`core_flows` **不得留空**
   - 若已提供 `PRD / 产品文档`，但仍未能产出 `core_flows`，则阶段 B 必须返回 `needs_input`，不得继续进入正式走查
   - 优先调用：

```bash
python3 <SKILL_ROOT>/scripts/build_business_context.py \
  --prd-path <prd.md|prd.docx> \
  --project-path <项目目录> \
  --signal-file <页面线索.txt> \
  --json
```
2. **有 PRD / 需求文档时**：把 PRD 当作预期目标来源；必须再和当前页面 / 截图 / 代码互相核对。PRD 与现状冲突时，报告中写清「预期如此、现状如此」，**不要**直接用 PRD 判错
3. **没有 PRD 时**：从页面标题、导航、按钮、字段、状态、URL、代码命名、接口字段等证据反推业务目标与核心流程；每个关键判断都要能回指证据来源
4. **若连这些关键信息都无法判断**：`product_goal / primary_users / core_tasks`，则只允许二选一：
   - 问一句最小必要澄清
   - 降级为“只报确定问题 + 明确业务信息不足”
5. **按用户流程走查（主流程必跑）**：先模拟并实际执行 1–3 条核心流程，再看局部体验。默认按「核心流程必跑 → 元素盘点 → 派生必检项 → 结构快扫 → 命中再展开 → checklist 收口」执行，至少覆盖；正式报告与 docx 生成会强制校验 `core_flows` 执行记录：
   - **先走主流程，后看样式**：样式、间距、留白等专项检查必须排在主流程操作走查之后；先确认“能不能完成新增、编辑、导出”，再看“看起来顺不顺”
   - **列表 / 管理页最低覆盖要求**：
     - 若存在页头主动作（如：`新增 / 新建 / 创建 / 发布 / 导出`），至少验证 **1 条页头主动作流程**
     - 若存在行内主动作（如：`查看 / 编辑 / 详情 / 删除 / 启停`），至少验证 **1 条行内动作流程**
     - 若两类都存在，则两类都要覆盖；若只存在其中一类，则该类至少覆盖 1 条
   - **每条核心流程都必须写清实际执行到哪一步**：至少明确是「已完成」「停在提交前」「因高风险待用户确认」之一；若没有这层记录，不得判定主流程已覆盖
   - 用户如何进入当前页面
   - 第一眼是否知道该做什么
   - 完成核心任务需要几步
   - 哪一步最容易卡住 / 误操作 / 丢失上下文
   - 失败后能否恢复
   - 完成后是否有明确反馈
   - 在结构快扫前必须先完成 `element_inventory`：逐项声明 `page_header_actions / table_row_actions / danger_actions / form_actions / modal_or_drawer_actions / data_visualization` 是否存在，并给出 `note / evidence`
   - HiUI 页面必须由 `element_inventory` 派生 `style_review.hiui_component_checks`：页头 primary 是否最右、页头动作组是否靠右、表格行内操作是否蓝色 link 文本、操作列是否固定右侧、危险操作是否二次确认、表单底部操作是否靠右、弹窗/抽屉操作区主次与风险语义、统计图表主题与状态语义
   - `url / screenshot` 模式下，已声明 `present=true` 的可见元素，其派生检查项不得填 `pending` 或 `n/a`；必须判定 `pass` 或 `issue`
   - 若为 `url` / `screenshot`，或用户明确要求样式走查，或 `code` 模式下已拿到明确样式证据（样式文件 / token / 组件主题 / 页面截图），在**主流程已完成或已明确停在提交前后**，先做一轮 **结构快扫**：只看 `references/style-walkthrough.md` 里的 4 项结构问题，快速判断页面大骨架是否存在“断、歪、散、空”
   - 结构快扫 4 项必须逐项给出 `pass / issue / pending / n/a` 结论：`页头到首屏内容有没有接住`、`主白底外边距稳不稳`、`多列有没有收口`、`有没有大块无效空白`
   - 只有以下任一条件成立时，才进入更细的样式检查：结构快扫命中 `issue`、主流程经过区域存在明显视觉风险、用户明确要求样式走查、用户额外提供截图 / 箭头 / 标记指出具体区域
   - 进入样式细查后，只重点看三类区域：主流程经过区域、结构快扫命中的可疑区域、用户明确指出的区域；**不要**默认再做一轮整页无差别深扫
   - HiUI 页面执行样式专项时，把 `references/hiui-visual-design-review-matrix.md` 当作**命中后增强判定**：先看共享结构，再看页型 / 组件 / 图表，不额外复制一整套重流程
6. **副作用与闭环验证**：凡是创建 / 发布 / 发送 / 启用 / 删除 / 提交审批 / 触发任务等会产生真实影响的动作，先分级再决定是否继续：
   - **无副作用**：查看、切换、筛选、填写但不提交，可直接执行
   - **低风险且可回收**：如测试空间里的新建、创建后可立即停用 / 删除的对象；可直接执行，**不需要**额外征得用户确认
   - **低风险创建默认要跑**：只要看起来像测试数据、可删除、可回收，就默认执行完整创建闭环，不要保守地停在“新增”按钮前
   - **高风险且影响生产**：如真实通知、真实外发、真实业务流写入、影响线上用户或生产流程的删除 / 启用 / 发布；执行前**必须先征得用户确认**
   - **无法判断**是否影响生产，或**无法确认**当前动作是否可回收：按 **高风险且影响生产** 处理
   - 只有进入 **高风险且影响生产** 分支时，才向用户确认；确认时必须一次性说清：**准备执行什么动作 / 会产生什么影响 / 是否可回收**
   - 对无副作用和低风险且可回收动作，优先使用测试空间、测试命名、低风险配置，并在提交后验证：成功反馈、结果落点、回到列表 / 详情；若能回收，再补做停用 / 删除 / 归档
   - 若用户明确拒绝高风险动作，或当前环境无法隔离、无法回收且会影响生产，则停止在提交前，并在报告里写明本次只验证到哪一步
7. **用 checklist 收口**：在核心流程、结构快扫和必要的局部细查完成后，再按 `references/walkthrough-worksheet.md` 的 Batch 1→4 顺序回填 `references/ux-checklist.md`；`checklist` 用于核对是否漏项与补齐证据，**不是**再开启第二轮整页检查
8. 命中条目且需参考时，读该条 `related_examples` 锚点（禁止通读 `issue-examples/*.md` 全文）；HiUI 页先问是否与 baseline **合规默认**一致
9. `references/ignore-list.md`（含 §5 HiUI）→ 去掉误报
10. `references/severity-rubric.md` → 定级：流程 / 交互正式问题定 `P0 / P1 / P2`；样式规范偏差可进入正式 `issues[]` 并按影响程度定 `P0 / P1 / P2 / P3`

**输出：** 对话中 **完整** Markdown 报告（`references/report-template.md`）

整理 `report.json` 前，必须为 **全部 17 条** 填写 `checklist_coverage`（见 `report-json.md`）：
- **`pass` 必须写 `pass: <验证证据，≥8 字>`**，禁止裸 `pass`
- `issue` / `pending:…` / `n/a:…` 规则见 `report-json.md`
- 正式交付必须写简洁 `business_context`，至少包含 `source / product_goal / primary_users / core_tasks / assumptions / missing_information`
- `business_context` 与 `core_flows` **必须填写**；每条流程必须记录 `execution.status`、实际步骤、证据和结果验证
- `action_inventory` **必须填写**；若存在页头动作 / 行内动作，`core_flows.type` 必须分别覆盖 `页头主动作` / `行内动作`
- `execution.status` 只能是 `completed`、`stopped_before_submit`、`blocked_high_risk`；低风险且可回收的创建流程不能用停在提交前替代执行
- `generate_docx.py` 与 `closeout_walkthrough.py` 都会执行核心流程、样式走查、checklist 覆盖与标注四类交付门禁；任一未通过时不得生成交付 docx，也不得成功收口
- 若触发样式专项，必须补充 `style_review.trigger` 与 `style_review.structure_scan` 四问；结构命中问题、显式要求细查、主流程视觉风险或用户框选区域时，再补 `detail_check_reason` 与 `dimensions` 六维；`framework=hiui-design` 时必须补 `hiui_sections` 核心四项、顶层 `element_inventory` 和 `style_review.hiui_component_checks` 八项组件派生检查
- **样式问题落点规则**：凡是不符合样式规范的项（如边距异常、留白断裂、层级混乱、状态样式不一致），都必须写入 `issues[]`，进入对话报告 / docx 的「问题详情」；不影响任务完成 / 理解效率 / 稳定性的，降为 `P3`，**不得**只留在 `style_review` 或附录里的「样式专项观察」
- `style_review` / 「样式专项观察」只保留维度结论与简短证据，用于收敛观察；**不能替代**正式样式问题的 `issues[]`
- 若为 **HiUI + 样式专项**，必须在 `style_review` 中补 `framework=hiui-design`、`hiui_sections` 与 `hiui_component_checks`，用来收纳「全局视觉基线 / 跨页面共享结构 / 页型规范 / 组件语义 / 数据可视化专项」和组件逐项结论
- 若 `style_review.dimensions` 已明确命中 `issue`，相关 checklist（至少 `UX-1.2 / UX-2.5 / UX-3.1` 之一）**不得全部写 pass**
- 若 `framework=hiui-design` 且 `style_review.hiui_sections` 中已明确命中 `issue`，相关 checklist（至少 `UX-1.2 / UX-2.5 / UX-3.1` 之一）**不得全部写 pass**
- 涉及创建 / 发布 / 删除等闭环操作时，可在 `report.json` 中补 `closure_verification` 作为内部辅助字段；默认**不写入**对外报告和 docx 正文

- **禁止**在交付报告中输出「HiUI 模板对齐」模块（HiUI Delta 仅走查阶段内部使用；issue 描述可保留 `[HiUI-偏离]` / `[业务域]` 标签）
- 标题格式：`序号. [P级]标题`
- URL/截图模式：确定 issue 须有标注图与 `images[].bbox`
- URL/截图模式下，**正式样式问题**同样按确定 issue 处理：必须进入 `issues[]`，并附标注图与 `images[].bbox`
- 证据不足 → 标「待确认 / 待交互验证」，不写确定问题；**仍不足则回到阶段 A，不硬写完整报告**
- **禁止**只按 checklist 枚举问题，却不说明当前现状、用户困扰和建议做法

### 阶段 C：生 docx

1. **标注（screenshot / url 必做）**：禁止手估 `--box`；须用 `annotate_issue.py`（或 `locate_in_screenshot.py` + `preview_bbox.py` + `annotate.py`），输出到 `output/annotations/*-annotated.png`（流程见 `annotation-style.md` § 标注流程）
2. 按 `references/report-json.md` 整理 `report.json`；URL/截图模式的 `issues[].images[]` 须指向标注版、设 `"annotated": true`，并记录 `"bbox": [x,y,w,h]`
3. 校验样式走查门禁：

```bash
python3 <SKILL_ROOT>/scripts/validate_style_review.py --report-json <report.json> --json
```

4. 校验 checklist 覆盖门禁：

```bash
python3 <SKILL_ROOT>/scripts/validate_checklist_coverage.py --report-json <report.json> --json
```

5. 校验标注门禁：

```bash
python3 <SKILL_ROOT>/scripts/validate_report_annotations.py --report-json <report.json> --json
```

6. 执行：

```bash
python3 <SKILL_ROOT>/scripts/generate_docx.py \
  --report-json <report.json> \
  --output <SKILL_ROOT>/output/<项目名>-ux-report-<YYYYMMDD>.docx \
  --json
```

- 命名、嵌图与收口边界：`references/report-json.md` § DOCX
- `generate_docx.py` **强制校验核心流程、样式走查、checklist 覆盖与标注**；`checklist` 覆盖门禁、样式门禁与标注门禁均不可跳过，未通过则不得 success 收口
- 标注图：`references/annotation-style.md`（**先 § 标注流程，再 § 样式**）；推荐工具：`annotate_issue.py`
- 失败 → 带 `--docx-failed true` 进入 D，**不能跳过收口**

### 阶段 D：统一收口（强制）

**Success：**

```bash
python3 <SKILL_ROOT>/scripts/closeout_walkthrough.py \
  --precheck-json '<A 阶段 JSON>' \
  --source <code|url|screenshot> \
  --report-json <report.json> \
  --report-generated true \
  --docx-generated true \
  --docx-name <文件名> \
  --docx-path <文件路径> \
  --json
```

**Failed / Canceled：** 见 `docs/onboarding/gates.md` § 统一收口协议 的 failure-preset，**必须先 closeout 再结束**。

**返回边界：**

- 返回 `completed` → 当前终态已完成统一收口
- 返回 `needs_input` → **暂不收口**，等待补证据后再走 C/D

---

## 完成定义（缺一不可）

1. A：precheck 已通过，或已走失败/取消收口
2. B：对话中已输出完整报告（非摘要）
3. C：success 路径 docx 已 `generated`；失败路径已 `--docx-failed` 收口
4. D：`closeout_walkthrough.py` → `status=completed`

若页面存在明确主按钮 / 行内主动作，但未完成主流程操作走查，也未写明停留位置与原因，则**不算完成**。

已分析 / 已出报告 / 已生 docx **均不等于完成**，D 未跑完不算完成。

---

## 分阶段读文档

| 阶段 | 必读 | 按需 |
|------|------|------|
| A | `mode.md` 对应锚点 | `gates.md` § 阶段 A |
| B | business-understanding, walkthrough-worksheet, hiui-template-baseline（HiUI 时）, checklist, ignore-list, severity-rubric | `style-walkthrough.md`（样式专项时）, `hiui-visual-design-review-matrix.md`（HiUI + 样式专项时） |
| C | report-template, report-json, annotation-style | `annotate_issue.py`, `validate_report_annotations.py` |
| D | `gates.md` § 统一收口协议 | — |

**默认不读：** 底层脚本源码及与单次走查无关的维护说明

---

## 底层脚本（仅单层调试）

```bash
python3 <SKILL_ROOT>/scripts/detect_input_mode.py <输入> --json
python3 <SKILL_ROOT>/scripts/probe_dev_server.py <项目路径> --json
python3 <SKILL_ROOT>/scripts/check_evidence_gate.py --source <mode> ... --json
python3 <SKILL_ROOT>/scripts/prepare_walkthrough_context.py --precheck-json-file <A结果.json> --json
python3 <SKILL_ROOT>/scripts/build_business_context.py --project-path <项目路径> --json
python3 <SKILL_ROOT>/scripts/classify_closeout.py ... --json
```

---

## 交付前自检

- [ ] 报告完整，非摘要
- [ ] 已完成简洁业务理解摘要；明确业务目标与判断边界
- [ ] 已生成 1–3 条核心流程；若页面存在页头主动作 / 行内动作，已覆盖对应主流程
- [ ] 已填写 `action_inventory`；页头动作 / 行内动作与 `core_flows.type` 覆盖关系已通过门禁
- [ ] 已先按核心流程走查，再用 checklist 收口补漏
- [ ] 若涉及真实创建 / 提交 / 删除，已按副作用分级处理；仅高风险且影响生产的动作才向用户确认
- [ ] 若存在低风险且可回收的创建动作，已默认执行创建闭环，不是停在新增入口前
- [ ] 每问题有：位置、描述、改进建议
- [ ] 标题：`序号. [P级]标题`
- [ ] 若未走完最终提交，报告已写明停在提交前的原因；若走完且可回收，已写明回收结果
- [ ] 已按 walkthrough-worksheet Batch 1→4 回填 checklist；若发现覆盖缺口，已补证据而不是重开整页深扫
- [ ] 若执行样式专项，已在主流程覆盖后完成 `element_inventory` 元素盘点，再完成结构四问快扫：页头到首屏、主白底外边距、列收口、无效空白
- [ ] 若执行样式专项，已填写 `trigger`；需要六维详查时已填写 `detail_check_reason`；HiUI 已填写核心 `hiui_sections` 与八项 `hiui_component_checks`
- [ ] `checklist_coverage` 17 条均已填写，且 pass 均含 ≥8 字验证证据
- [ ] `validate_checklist_coverage.py` 已通过
- [ ] URL/截图：每问题有标注图，且 `images[].bbox` 已记录
- [ ] docx 已生成或已失败收口
- [ ] closeout 已 `completed`
- [ ] 末尾附 docx 绝对路径（success 时）

---

## 附录

- 门禁与收口：`docs/onboarding/gates.md`
- 安装说明：`README.md`
- 检查清单：`references/ux-checklist.md`
- 分批工作表：`references/walkthrough-worksheet.md`
