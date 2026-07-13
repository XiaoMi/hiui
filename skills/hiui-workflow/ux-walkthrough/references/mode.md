# 走查模式

> 通用流程见 `SKILL.md`。本文只写 **code / url / screenshot 三种模式的差异**。

## code {#code}

### 适用

本地前端目录，含 `package.json`、`src/`、路由或页面组件。

### 运行时优先（体验混合走查）

code 模式**不能看见渲染页面**。前置 gate 通过后，`precheck` 会附加 `runtime_probe` 并可能改写 `next_action`：

| `next_action` | Agent 动作 |
|---------------|------------|
| `try_url_walkthrough` | 对可达本地 URL 再跑 URL precheck → 浏览器走查 + 标注图，`source=url` |
| `start_dev_server_then_url_walkthrough` | 执行 `runtime_probe.suggested_dev_command`；成功 → URL 走查；失败 → 收窄 code |
| `fallback_code_walkthrough` | 按 code 走查，遵守 § 体验边界 |

探测脚本（仅探测，默认不挂起启动）：

```bash
python3 {SKILL_DIR}/scripts/probe_dev_server.py <项目路径> --json
```

### 证据要求

- precheck 通过（gate `continue_walkthrough` 或 runtime 分支 `next_action`）
- 扫描或手动识别：路由、页面组件、样式、通用组件
- 非页面项目 → 说明原因并请求补充页面输入
- 扫描失败且无手动证据 → `code_scan_failed`

### 体验边界（fallback / 未启动 dev 时）

**可强报（code 可确定）：** 主流程逻辑缺口、无 loading/error/empty 分支、`return null` 导致空白、明显无兜底

**降级或标「待启动后验证」：** i18n 混用、design token/硬编码色值、响应式/小屏表格、真实视觉层级与密度

### 问题定位

- 每个问题落到：页面 / 文件 / 组件 / 函数
- 纯代码推断 → 注明「基于代码推断，建议结合实际页面确认」

### 走查侧重

主流程完整性 · 页面层级 · 高频操作路径 · 状态反馈 · 业务文案 · 样式一致性

### report.json

| 字段 | 约定 |
|------|------|
| `source` | 启动成功走 URL 时为 `url`；否则 `code` |
| `scope` | 项目路径 + 模块 |
| `issues[].images` | url 分支必填标注图；code 分支可为 `[]` |
| 附录 | 无图时写「结论基于代码推断；未启动项目」 |

### 交付

- 可无截图，仍须生成 docx
- docx 嵌图与命名见 `report-json.md` § DOCX
- 完整条件见 `SKILL.md` 完成定义

---

## url {#url}

### 适用

用户提供 `http(s)` URL，且能进入真实业务页。

### 证据要求

- 已进入业务页（非登录/授权页）
- **必须**截图留证：首屏、关键交互后、标注图
- 登录页 → 等用户登录，或降级 `screenshot`
- 失败 preset：`url_login_required` / `url_page_unreachable`

### 登录处理

默认提示用户先登录，**不**把登录页当系统内页走查。用户明确要求时可单独评登录页。

### 标注图

必须完整执行 `annotation-style.md` § [标注流程](annotation-style.md#workflow)：

1. [锁定对象](annotation-style.md#step-1-lock)
2. [取得坐标](annotation-style.md#step-2-coords)（URL：`browser_get_bounding_box` / CDP，与截图同 viewport/DPR）
3. **禁止手估 `--box`**；须用 `annotate_issue.py`（或 `locate_in_screenshot.py` + `preview_bbox.py` + `annotate.py`）
4. [像素复核](annotation-style.md#step-4-verify)（`preview_bbox.py` 3x 局部图）
5. 失败则 [降级](annotation-style.md#step-5-fallback)

### 走查侧重

首屏层级 · 主操作 · 导航回退 · 状态反馈 · 业务文案

### report.json

| 字段 | 约定 |
|------|------|
| `source` | `url` |
| `issues[].images` | **必须**标注版；每问题至少一张 |
| `issues[].images[].annotated` | 须为 `true` |
| `issues[].images[].bbox` | 须为 `[x,y,w,h]` |

### 交付

- 每问题须 `annotate_issue.py` 生成标注图（见 `annotation-style.md` § 标注流程）
- `validate_report_annotations.py` 通过后再 `generate_docx`
- docx 嵌图见 `report-json.md` § DOCX

---

## screenshot {#screenshot}

### 适用

页面截图、设计稿、竞品图；或 URL 无法登录时用户提供的登录后截图。

### 证据要求

- 截图可读、数量/顺序足够支撑结论
- 不足 → `screenshot_evidence_insufficient`
- 标注须按 `annotation-style.md` § 标注流程 执行；小控件 **必须先局部确认再回全图**（`annotation-style.md#step-2-coords`）

### 无法静态证明的项

点击反馈、流程是否走通、Hover/键盘/加载过程 → **待交互验证**，不写确定结论。

### 多张截图

按页面顺序分析，再评跨页一致性（入口、返回、列表-详情风格、表单规则）。

### 走查侧重

页面类型 · 信息层级 · 主操作 · 导航 · 文案 · 空/错/加载态 · 图片/Logo/间距

### report.json

| 字段 | 约定 |
|------|------|
| `source` | `screenshot` |
| `issues[].location` | 图上可定位区域 |
| `issues[].images` | 确定 issue 须用标注版并记录 bbox；定位失败只能作为局部证据或待确认说明 |
| `issues[].images[].annotated` | 须为 `true`（标注版） |
| `issues[].images[].bbox` | 须为 `[x,y,w,h]` |

### 交付

- 每问题须 `annotate_issue.py` 生成标注图
- 生 docx 前运行 `validate_report_annotations.py`；`generate_docx.py` 默认强制校验
- docx 嵌图见 `report-json.md` § DOCX
