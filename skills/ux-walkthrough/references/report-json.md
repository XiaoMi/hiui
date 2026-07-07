# 报告结构化 JSON 约定

`generate_docx.py` 不直接吃自然语言大段正文，而是读取一份结构化 `report.json`。

主流程建议：

1. 先在对话中输出完整 Markdown 报告
2. 再同步整理一份 `report.json`
3. 最后调用 `scripts/generate_docx.py` 生成本地 `.docx`

前置依赖：

- 运行环境必须可导入 Python 包 `python-docx`
- 若缺少该依赖，`generate_docx.py` 会返回 `status=failed`、`failure_stage=docx_generation`
- 这种情况只能报告“docx 未生成成功”，不能把本次走查标记为完整完成

标准命令：

```bash
python3 <SKILL_ROOT>/scripts/generate_docx.py \
  --report-json <report.json> \
  --output <output.docx> \
  --json
```

可直接参考：`references/report-json.smoke.json`

## 必填字段

```json
{
  "title": "IPD 体验走查报告",
  "project": "IPD",
  "source": "screenshot",
  "generated_at": "2026-06-04T17:00:00+08:00",
  "scope": "需求页截图 3 张",
  "summary": {
    "overall": "页面信息承载较完整，但主次层级和操作引导仍有明显优化空间。",
    "key_points": [
      "主操作入口不突出",
      "信息分组边界不清晰"
    ],
    "improvement_direction": "先强化主操作与主信息层级，再收敛局部视觉噪音。"
  },
  "issues": [
    {
      "index": 1,
      "severity": "P1",
      "title": "主操作入口不突出",
      "category": "交互问题",
      "location": "首屏顶部操作区",
      "description": "主按钮和次级按钮视觉权重接近，用户难以快速识别主要路径。",
      "suggestion": "增强主按钮对比度，并压低次级按钮权重。",
      "evidence_note": "截图右上角操作区",
      "images": [
        {
          "path": "/abs/path/to/issue-1-annotated.png",
          "caption": "图 1：主操作与次级操作区分不明显（标注：右上角操作区）",
          "annotated": true,
          "bbox": [120, 80, 240, 96]
        }
      ]
    }
  ],
  "appendix": {
    "note": "本次报告基于用户提供截图完成。",
    "items": [
      "走查依据：UX 走查清单",
      "截图来源：用户本地文件"
    ]
  }
}
```

## 字段说明

- `title`：文档标题
- `project`：项目名，可为空
- `source`：必须是 `code / url / screenshot`
- `generated_at`：生成时间字符串
- `scope`：走查范围说明
- `summary.overall`：整体评价
- `summary.key_points`：核心问题列表
- `summary.improvement_direction`：改进方向
- `issues`：非空数组
- `issues[].index`：问题序号
- `issues[].severity`：必须是 `P0 / P1 / P2`
- `issues[].title`：不带序号和优先级也可以，脚本会统一组装为 `序号. [P级]标题`
- 截图/URL 证据不足但已暴露明显用户疑惑时，也应作为 `issues[]` 条目输出；标题必须显式包含「待交互验证」，`description` 写清疑惑点，`suggestion` 写清需要验证的交互和建议验证方式，不得只在 `appendix.items` 中概括
- `issues[].category`：与 checklist `report_category` 一致，使用 `流程问题` / `交互问题` / `样式问题` 三者之一
- `issues[].location`：页面区域 / 文件路径 / 模块
- `issues[].description`：问题描述
- `issues[].suggestion`：改进建议
- `issues[].evidence_note`：证据说明，可为空
- `issues[].images`：图片列表；可传字符串路径，也可传 `{path, caption, annotated}` 对象
- `issues[].images[].annotated`：**screenshot / url 必填 `true`**（须为 overlay 标注版，非整页原图重复引用）
- `issues[].images[].bbox`：**screenshot / url 必填** `[x, y, w, h]`（由 `locate_in_screenshot.py` / `annotate_issue.py` 产出；禁止手估）
- `appendix.note`：附录说明
- `appendix.items`：附录条目列表

## 图片规则

- `source=url` 或 `source=screenshot` 时，**每个 issue 都必须有标注图**，且 `annotated: true`
- 定位失败时的局部裁切 / 文字说明不能替代确定 issue 的标注门禁；若无法取得可靠 `bbox`，应标为「待确认 / 待交互验证」或补充证据后再交付
- 「待交互验证」问题若进入 `issues[]`，同样需要标注图与 `bbox`；若无法可靠定位，只能放入 `appendix.items` 并说明定位失败原因，不能伪造确定 issue

### 标注门禁（screenshot / url 必过）

```bash
python3 <SKILL_ROOT>/scripts/validate_report_annotations.py --report-json <report.json> --json
python3 <SKILL_ROOT>/scripts/annotate_issue.py \
  --input <原图> \
  --output <SKILL_ROOT>/output/annotations/issue-N-annotated.png \
  --find-text "<目标文案>" \
  --region x,y,w,h \
  --label "问题简述" \
  --preview-dir <SKILL_ROOT>/output/annotations/previews \
  --json
```

`generate_docx.py` 默认调用上述校验；未通过则 `status=failed`、`reason=annotations_missing`。
- `source=code` 时允许全篇无图
- 图片路径支持绝对路径，也支持相对 `report.json` 所在目录的相对路径
- 任一图片路径不存在时，`generate_docx.py` 会直接返回失败

## 返回结构

成功：

```json
{
  "ok": true,
  "status": "generated",
  "output_path": "/abs/path/IPD-ux-report-20260604.docx",
  "file_name": "IPD-ux-report-20260604.docx",
  "source": "screenshot",
  "issue_count": 5,
  "image_count": 4,
  "message": "DOCX generated"
}
```

失败：

```json
{
  "ok": false,
  "status": "failed",
  "failure_stage": "docx_generation",
  "failure_reason": "tool_error",
  "message": "DOCX generation failed",
  "detail": "图片不存在：/abs/path/to/annotated-1.png"
}
```

---

## DOCX 生成要求

每次完成体验走查时，除了对话中的完整报告，还必须同步生成一份本地 `.docx` 报告。

### 标准入口

```bash
python3 <SKILL_ROOT>/scripts/generate_docx.py --report-json <report.json> --output <output.docx> --json
```

### 文件命名

建议使用：`{项目名或页面名}-ux-report-{YYYYMMDD}.docx`

若同一天生成多份，可追加模式或时间：`{项目名}-url-ux-report-{YYYYMMDD-HHMM}.docx`

默认输出目录：`<SKILL_ROOT>/output/`

### 建议结构

1. 标题 · 2. 走查时间 · 3. 走查模式 · 4. 走查范围 · 5. 整体评价 · 6. 核心问题 · 7. 改进方向 · 8. 问题详情 · 9. 问题分布 · 10. 附录

### 图片规则

- 若存在问题对应截图，文档中应直接嵌入截图，而不是只写图片路径
- 若存在**标注版截图**，优先嵌入（样式与定位流程见 `annotation-style.md`）
- **screenshot / url**：禁止仅嵌入未标注的整页原图；须 `validate_report_annotations.py` 已通过
- 若没有标注版，`generate_docx.py` 将拒绝生成（勿依赖「可先使用原图」绕过）
- 每个问题尽量配最相关的一张图；问题文字与对应图片应尽量相邻排布
- 图下方可补一句简短说明

### 无截图时

若本次走查没有实际截图，也仍需生成 `.docx` 报告：保留完整文字报告，并明确标注「本次报告无截图证据」。

### 模式差异

| 模式 | docx 要求 |
|------|-----------|
| code | 允许只有文字；重点保留页面、文件、组件定位 |
| url | 必须保留页面截图、交互后截图和问题标注图 |
| screenshot | 必须直接嵌入用户提供的截图或标注图 |

### 交付边界

- `.docx` 是完整交付前的必过门禁
- 若 `.docx` 尚未生成成功，不得把任务说成完整完成；应说明失败阶段、直接原因和下一步
