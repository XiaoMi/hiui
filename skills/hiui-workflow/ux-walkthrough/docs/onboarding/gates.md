# 门禁与统计附录

> 主流程见 `SKILL.md` 四阶段（A→B→C→D）。其中阶段 B 已升级为“先做任务理解与核心流程操作，再做结构快扫，最后用 checklist 收口”。本文只写 **通过条件 / 失败回路 / 禁止项 / 统计协议**，不重复流程说明。

## 核心原则

- 未通过当前阶段门禁，不进入下一阶段
- 完成由脚本 + 门禁共同判定，不靠主观感觉
- 对外只调用 `precheck_walkthrough.py` 与 `closeout_walkthrough.py`；底层脚本仅调试

---

## 阶段 A：前置检查（输入 · 模式 · 证据门禁）

对应 precheck 的 `mode`、`gate`、`next_action`。

### 通过条件

- 输入类型可识别（code / url / screenshot）
- `next_action=continue_walkthrough`，或 code 模式下 runtime 分支：
  - `try_url_walkthrough`
  - `start_dev_server_then_url_walkthrough`
  - `fallback_code_walkthrough`

### 失败回路

| 情况 | 动作 |
|------|------|
| 输入无法识别 | 只问一句最小澄清 |
| URL 在登录页 | 暂停；等登录或改 screenshot |
| 截图不足 | 标记证据不足；不进入正式交付 |
| 非页面项目 | `closeout` + `code_not_page_project` |
| gate 固定失败 | `closeout` 失败收口，不停留在 prose |

### 模式差异（证据门禁）

**code：** 目录可读；能扫描或手动识别页面结构；gate 通过后执行 `runtime_probe`（见 `probe_dev_server.py`）
**url：** 已进入业务页；可截图留证
**screenshot：** 截图可读且数量/顺序足够

#### code · 运行时优先

| `runtime_probe.next_action` | 阶段 B |
|-----------------------------|--------|
| `try_url_walkthrough` | 对 `reachable_urls` 做 URL precheck + 浏览器走查，`source=url` |
| `start_dev_server_then_url_walkthrough` | 启动 `suggested_dev_command`；成功 → URL；失败 → 收窄 code |
| `fallback_code_walkthrough` | `source=code`；i18n/token/响应式降级或标「待启动后验证」 |

URL 无登录态但用户能补截图 → 可降级 `screenshot`。

---

## 阶段 B：任务理解、主流程走查与报告（证据采集 · 判断 · 输出）

### 阶段 B 高层入口

优先先跑：

```bash
python3 <SKILL_DIR>/scripts/prepare_walkthrough_context.py \
  --precheck-json-file <A 阶段结果.json> \
  --prd-path <可选 PRD> \
  --signal-file <可选页面线索> \
  --json
```

读返回：

- `walkthrough_source`
- `status`
- `next_action`
- `business_context_result`

### 任务理解前提

- 有 PRD / 需求文档：先提炼产品目标、主要用户、核心任务、成功标志，再和现状核对
- 无 PRD：从页面、截图、代码、文案、字段、路由、接口名等证据反推任务理解
- 若 `主要用户 / 核心任务 / 成功标志` 三项仍不清晰：只允许最小澄清，或降级为“只报确定问题”
- 若已提供 PRD / 产品文档，但仍提炼不出有证据支撑的 `core_flows`，则直接返回 `needs_input`，不进入正式走查

### 证据采集

| 模式 | 必需材料 |
|------|----------|
| code（URL 分支） | 与 url 相同：首屏/关键交互截图、标注图 |
| code（fallback） | 扫描/手动定位：路由、页面、组件、样式；附录注明未启动 |
| url | 首屏截图、关键交互截图、标注图 |
| screenshot | 原图路径、局部确认图、标注图 |

### 问题判断顺序

1. 先产出简洁任务理解卡与 1–3 条核心流程
2. 先实际执行核心流程，再记录流程阻塞点；列表 / 管理页优先覆盖页头主动作与行内动作，低风险且可回收的创建默认跑完整闭环
3. 主流程完成或已明确停在提交前后，再做结构四问快扫；只有命中问题、主流程区域可疑或用户明确要求时，才展开局部样式细查
4. 再按 `ux-checklist` 回填证据与补齐漏项；命中条目且需参考时，读该条 `related_examples` 锚点
5. ignore-list
6. severity-rubric

证据仍不足 → 回到阶段 A，不进入正式交付。

### 通过条件

- 完整 Markdown 报告已在对话输出
- 已明确区分“已确认 / 推断 / 待确认”
- 问题均经 P 级判断；猜测标「待确认」

### 禁止

- 先写问题再凑证据
- 模糊标注 / 无坐标依据的全图估框代替定位（见 `annotation-style.md` § 标注流程）
- screenshot / url 模式 **仅贴原图、不做 overlay**（须 `annotate_issue.py`）
- 只给摘要或只给图片路径
- 凭感觉定 P0/P1/P2
- 不先完成任务理解与核心流程，就直接按 checklist 枚举问题
- 不先跑主流程，只做样式、间距、留白类检查

---

## 阶段 C：docx

### 通过条件

- `validate_core_flows.py` 已通过
- `action_inventory` 已填写；存在页头动作或行内动作时，`core_flows.type` 已分别覆盖 `页头主动作` / `行内动作`
- `validate_style_review.py` 已通过（url / screenshot 必过；code 写了 `style_review` 或 `walkthrough_options.style_review_required=true` 时必过；必须有 `trigger`，必要时必须有 `detail_check_reason`）
- `validate_checklist_coverage.py` 已通过
- `validate_report_annotations.py` 已通过（screenshot / url）
- `generate_docx.py` 返回 `status=generated`
- 输出路径可用，且 success 收口必须提供真实存在、非空、后缀为 `.docx` 的 `--docx-path`

### 失败回路

- 核心流程 / 样式走查 / checklist / 标注任一门禁未过 → 补齐对应证据并重跑校验
- 标注门禁未过 → 补标注产物（`annotate_issue.py`）并重跑 `validate_report_annotations.py`
- 不可进入 success 收口
- 必须 `closeout --docx-failed true --failure-preset docx_generation_failed`（或等价参数）

字段与命名：`references/report-json.md`（含 JSON 与 DOCX 约定）。

---

## 阶段 D：统一收口

### 通过条件

- `closeout_walkthrough.py` → `status=completed`

### 禁止

- 把收口当成「可选补跑」
- 未 closeout 就对用户说「已完成」

---

## 统一收口协议

### 适用范围

- 完整交付（code / url / screenshot）
- 已命中 skill 且做过前置/门禁，随后失败或用户取消
- **不适用于** 纯讨论、纯规则问答、`needs_input` 等待补证据

### Success 顺序（最终回复前）

1. 输出完整报告
2. 整理 `report.json`
3. `generate_docx.py`
4. `closeout_walkthrough.py`（`--report-json <report.json> --docx-generated true --docx-name ... --docx-path <output.docx>`）
5. 检查 `status` / `next_action` / 退出码

`failed / canceled` 不要求 docx；`needs_input` 暂不收口。
失败/取消时仍应向用户给出 **简短失败说明**（原因 + 下一步），再 closeout。

### 固定失败 preset

| 场景 | preset |
|------|--------|
| URL 登录页 | `url_login_required` |
| URL 不可达 | `url_page_unreachable` |
| 截图不足 | `screenshot_evidence_insufficient` |
| 非页面项目 | `code_not_page_project` |
| 扫描失败 | `code_scan_failed` |
| docx 失败 | `docx_generation_failed`（需 `--source`） |

用户取消（已开始前置/门禁后）：`--user-canceled true`
失败时传 `--failure-detail`（中文：对象 + 步骤 + 原因）。

### closeout 返回含义

| status | 含义 |
|--------|------|
| `needs_input` | 未到收口时机 |
| `completed` | 当前终态已完成统一收口 |

**禁止** 跳过 `closeout_walkthrough.py`，也不要把“已生成 docx”当成最终完成。

### Agent 约束

- success / failed / canceled 结束前 **必须** 跑 closeout
- 统一收口不是可选项
- closeout 成功后用户回复无需额外解释收口内部细节

---

## 完成判断（与 SKILL 一致）

同时满足：A 通过或已失败收口 · B 完整报告 · C docx 成功或已失败收口 · D closeout completed。
