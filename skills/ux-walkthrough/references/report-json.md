# 报告结构化 JSON 约定

`generate_docx.py` 不直接吃自然语言大段正文，而是读取一份结构化 `report.json`。

主流程建议：

1. 先在对话中输出完整 Markdown 报告
2. 再同步整理一份 `report.json`
3. 最后调用 `scripts/generate_docx.py` 生成本地 `.docx`

标准命令：

```bash
python3 {SKILL_DIR}/scripts/generate_docx.py \
  --report-json <report.json> \
  --output <output.docx> \
  --json
```

可直接参考：

- `references/report-json.example.json`

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
          "path": "/abs/path/to/annotated-1.png",
          "caption": "图 1：主操作与次级操作区分不明显"
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
- `issues[].category`：问题类型，可为空
- `issues[].location`：页面区域 / 文件路径 / 模块
- `issues[].description`：问题描述
- `issues[].suggestion`：改进建议
- `issues[].evidence_note`：证据说明，可为空
- `issues[].images`：图片列表；可传字符串路径，也可传 `{path, caption}` 对象
- `appendix.note`：附录说明
- `appendix.items`：附录条目列表

## 图片规则

- `source=url` 或 `source=screenshot` 时，建议每个关键问题都带图
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

## 与交付动作的衔接

- `generate_docx.py` 成功后，应把生成出的 `.docx` 文件一并作为最终交付的一部分附上
- `generate_docx.py` 失败时，不要假装已经完整交付；应直接说明卡住位置和直接原因
