# 门禁与完成自检

> 主流程见 `SKILL.md`。本文只写通过条件、失败回路和禁止项，不包含统计或上报协议。

## 核心原则

- 未通过当前阶段门禁，不进入下一阶段
- 证据不足时先补证据，不提前输出完整报告
- 完成由报告正文、结构化 `report.json`、标注校验和 docx 结果共同判定
- 对外优先调用 `precheck_walkthrough.py` 与 `generate_docx.py`；底层脚本仅用于调试
- 本文不定义 usage stats、telemetry closeout 或授权补传状态；这些不属于本 skill 的完成门禁
- 若环境缺少 `python-docx`，`.docx` 生成必须判定为失败，并明确说明依赖缺失；不得把报告正文当作完整完成

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
| 非页面项目 | 说明当前输入不是页面项目，并提示补充真正页面输入 |
| gate 固定失败 | 说明失败原因和下一步，不写完整报告 |

### 模式差异（证据门禁）

**code：** 目录可读；能扫描或手动识别页面结构；gate 通过后执行 `runtime_probe`（见 `probe_dev_server.py`）。  
**url：** 已进入业务页；可截图留证。  
**screenshot：** 截图可读且数量/顺序足够。

#### code · 运行时优先

| `runtime_probe.next_action` | 阶段 B |
|-----------------------------|--------|
| `try_url_walkthrough` | 对 `reachable_urls` 做 URL precheck + 浏览器走查，`source=url` |
| `start_dev_server_then_url_walkthrough` | 启动 `suggested_dev_command`；成功 → URL；失败 → 收窄 code |
| `fallback_code_walkthrough` | `source=code`；i18n/token/响应式降级或标「待启动后验证」 |

URL 无登录态但用户能补截图 → 可降级 `screenshot`。

---

## 阶段 B：走查与报告（证据采集 · 判断 · 输出）

### 证据采集

| 模式 | 必需材料 |
|------|----------|
| code（URL 分支） | 与 url 相同：首屏/关键交互截图、标注图 |
| code（fallback） | 扫描/手动定位：路由、页面、组件、样式；附录注明未启动 |
| url | 首屏截图、关键交互截图、标注图 |
| screenshot | 原图路径、局部确认图、标注图 |

### 问题判断顺序

1. 逐项过 ux-checklist；命中条目且需参考时，读该条 `related_examples` 锚点
2. ignore-list
3. severity-rubric

证据仍不足 → 回到阶段 A，不进入正式交付。

### 通过条件

- 完整 Markdown 报告已在对话输出
- 问题均经 P 级判断；猜测标「待确认」或「待交互验证」

### 禁止

- 先写问题再凑证据
- 模糊标注 / 无坐标依据的全图估框代替定位（见 `annotation-style.md` § 标注流程）
- screenshot / url 模式仅贴原图、不做 overlay（须 `annotate_issue.py`）
- 只给摘要或只给图片路径
- 凭感觉定 P0/P1/P2

---

## 阶段 C：docx 与完成自检

### 通过条件

- `validate_report_annotations.py` 已通过（screenshot / url）
- `generate_docx.py` 返回 `status=generated`
- 输出路径可用

### 失败回路

- 标注门禁未过 → 补标注产物（`annotate_issue.py`）并重跑 `validate_report_annotations.py`
- `.docx` 生成失败 → 说明失败阶段、直接原因和下一步
- 不可把 docx 失败的任务说成完整完成

字段与命名：`references/report-json.md`（含 JSON 与 DOCX 约定）。

---

## 完成判断（与 SKILL 一致）

同时满足：A 通过或已明确失败原因 · B 完整报告 · C docx 成功或已说明失败原因。
