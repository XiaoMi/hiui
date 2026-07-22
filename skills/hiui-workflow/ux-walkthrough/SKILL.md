---
name: ux-walkthrough
version: 1.0.2
description: 体验走查 skill。适用于代码库、URL、截图三种输入，输出结构化体验问题报告，并同步生成本地 docx 报告。触发词：体验走查、UX review、交互走查、界面审查、体验问题。
---

# UX Walkthrough

对产品进行系统性体验走查，输出结构化报告与生成本地 `.docx`。

## 路径约定

**`<SKILL_ROOT>`** = 本 skill 目录的绝对路径。

```bash
python3 <SKILL_ROOT>/scripts/<脚本>.py ...
```

## 角色与标准

- 角色：资深 B 端体验设计专家；给可执行建议，不是主观吐槽
- 主标准：`references/ux-checklist.md`（UX 体验规则）
- HiUI 典型页：`references/hiui-template-baseline.md`（Delta 走查；模板库全部典型页型，见该文页型索引）
- 辅助：Nielsen、WCAG、品牌规范；冲突时以效率、理解成本、错误恢复、专业感为准
- 优先级：以 `references/severity-rubric.md` 为准，不用 checklist 预设 P 级代替

## 交付边界

- 本 skill 的正式完成面只包括：完整 Markdown 报告、结构化 `report.json`、标注校验和本地 `.docx`
- 本 public skill 不定义 usage stats、telemetry closeout、网络补传或授权重试 after-hook
- 若上游 workflow 需要统计或发布态补传，必须由页面生成 / 发布 skill 自己定义和承担，不得默认追加到本 skill
- 生成 `.docx` 依赖 Python 包 `python-docx`；若环境缺失，该任务只能报告 `docx_generation` 失败，不能宣称完整完成

## 输入 → 模式

| 输入 | 模式 | 文档 |
|------|------|------|
| 本地项目目录 | `code` | `references/mode.md#code` |
| `http(s)` URL | `url` | `references/mode.md#url` |
| 图片 | `screenshot` | `references/mode.md#screenshot` |

无法判断时，只问一句最小必要澄清。

---

## 三阶段主流程

```
A 前置检查 → B 走查与报告 → C 生 docx 与完成自检
```

### 阶段 A：前置检查

```bash
python3 <SKILL_ROOT>/scripts/precheck_walkthrough.py <输入> --json
```

- 只读 `next_action`、`mode`、`status`、`gate`；code 模式额外读 `runtime_probe`
- `continue_walkthrough` → 进入 B；否则补证据 / 澄清 / 失败说明，不写完整报告
- code 输入且 gate 通过后，`next_action` 可能被 runtime 探测改写：
  - `try_url_walkthrough` → 对 `runtime_probe.reachable_urls[0]` 再跑 URL precheck，阶段 B 按 url 走
  - `start_dev_server_then_url_walkthrough` → 先启动 `runtime_probe.suggested_dev_command`；成功则 URL precheck，失败则收窄 code
  - `fallback_code_walkthrough` → 阶段 B 按 code 走，但须遵守体验边界（见 `mode-code.md` § 体验边界）

### 阶段 B：走查与报告

**code 运行时优先（混合走查）：**

1. 若 A 返回 `try_url_walkthrough` 或启动 dev 后拿到本地 URL → 切换 url 模式：浏览器截图 + 标注图，`report.json` 的 `source=url`
2. 若 dev 启动失败或 A 返回 `fallback_code_walkthrough` → `source=code`，附录注明「未启动项目，结论基于代码推断」；只强报 code 可确定的体验问题

**顺序（不可变）：**

0. HiUI 前置（若适用）：识别页型 → 读 `references/hiui-template-baseline.md` 对应节（页型索引列全量页型）
1. **分批逐项走查**：按 `references/walkthrough-worksheet.md` 的 Batch 1→4 顺序，**逐条**对照 `references/ux-checklist.md` 判断；每批填完工作表再进下一批
2. 命中条目且需参考时，读该条 `related_examples` 指向的锚点（禁止通读 `issue-examples/*.md` 全文）；HiUI 页先问是否与 baseline 合规默认一致
3. `references/ignore-list.md`（含 §5 HiUI）→ 去掉误报
4. `references/severity-rubric.md` → 定 P0/P1/P2

**输出：** 对话中完整 Markdown 报告（`references/report-template.md`）

整理 `report.json` 前，必须为 **全部 17 条** 填写 `checklist_coverage`（见 `report-json.md`）：
- **`pass` 必须写 `pass: <验证证据，>=8 字>`**，禁止裸 `pass`
- `issue` / `pending:...` / `n/a:...` 规则见 `report-json.md`

- 禁止在交付报告中输出「HiUI 模板对齐」模块（HiUI Delta 仅走查阶段内部使用；issue 描述可保留 `[HiUI-偏离]` / `[业务域]` 标签）
- 标题格式：`序号. [P级]标题`
- URL/截图模式：确定 issue 须有标注图与 `images[].bbox`
- 证据不足 → 标「待确认 / 待交互验证」，不写确定问题；仍不足则回到阶段 A，不硬写完整报告

### 阶段 C：生 docx 与完成自检

1. 标注（screenshot / url 必做）：禁止手估 `--box`；须用 `annotate_issue.py`（或 `locate_in_screenshot.py` + `preview_bbox.py` + `annotate.py`），输出到 `output/annotations/*-annotated.png`（流程见 `annotation-style.md` § 标注流程）
2. 按 `references/report-json.md` 整理 `report.json`；URL/截图模式的 `issues[].images[]` 须指向标注版、设 `"annotated": true`，并记录 `"bbox": [x,y,w,h]`
3. 校验 checklist 覆盖门禁：

```bash
python3 <SKILL_ROOT>/scripts/validate_checklist_coverage.py --report-json <report.json> --json
```

4. 校验标注门禁：

```bash
python3 <SKILL_ROOT>/scripts/validate_report_annotations.py --report-json <report.json> --json
```

5. 执行：

```bash
python3 <SKILL_ROOT>/scripts/generate_docx.py \
  --report-json <report.json> \
  --output <SKILL_ROOT>/output/<项目名>-ux-report-<YYYYMMDD>.docx \
  --json
```

- 命名、嵌图与交付边界：`references/report-json.md` § DOCX
- screenshot / url：`generate_docx.py` **默认校验 checklist 覆盖与标注**；未通过则不得 success 完成判断
- 标注图：`references/annotation-style.md`（先 § 标注流程，再 § 样式）；推荐工具：`annotate_issue.py`
- 失败 → 说明卡住位置和直接原因，不能说已完整完成

---

## 完成定义（缺一不可）

1. A：precheck 已通过，或已明确说明无法继续的原因
2. B：对话中已输出完整报告（非摘要）
3. C：success 路径 docx 已 `generated`；失败路径已说明失败阶段和原因

已分析 / 已出报告 / 已生 json 均不等于完成，docx 未生成不算完整完成。

---

## 分阶段读文档

| 阶段 | 必读 | 按需 |
|------|------|------|
| A | `mode.md` 对应锚点 | `gates.md` § 阶段 A |
| B | walkthrough-worksheet, hiui-template-baseline（HiUI 时）, checklist, ignore-list, severity-rubric | — |
| C | report-template, report-json, annotation-style | `annotate_issue.py`, `validate_checklist_coverage.py`, `validate_report_annotations.py` |

**默认不读：** 底层脚本源码及与单次走查无关的维护说明

---

## 底层脚本（仅单层调试）

```bash
python3 <SKILL_ROOT>/scripts/detect_input_mode.py <输入> --json
python3 <SKILL_ROOT>/scripts/probe_dev_server.py <项目路径> --json
python3 <SKILL_ROOT>/scripts/check_evidence_gate.py --source <mode> ... --json
```

---

## 交付前自检

- [ ] 报告完整，非摘要
- [ ] 每问题有：位置、描述、改进建议
- [ ] 标题：`序号. [P级]标题`
- [ ] 已按 walkthrough-worksheet Batch 1→4 逐项检查
- [ ] `checklist_coverage` 17 条均已填写，且 pass 均含 >=8 字验证证据
- [ ] `validate_checklist_coverage.py` 已通过
- [ ] URL/截图：每问题有标注图，且 `images[].bbox` 已记录
- [ ] `validate_report_annotations.py` 已通过
- [ ] docx 已生成，或已说明失败原因
- [ ] 末尾附 docx 绝对路径（success 时）

---

## 附录

- 门禁与完成判断：`docs/onboarding/gates.md`
- 检查清单：`references/ux-checklist.md`
- 分批工作表：`references/walkthrough-worksheet.md`
- 报告模板：`references/report-template.md`
- 标注规范：`references/annotation-style.md`
