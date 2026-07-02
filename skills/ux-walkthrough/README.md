# UX Walkthrough（体验走查）

对 B 端产品做系统性体验走查：支持代码库 / URL / 截图三种输入，输出结构化 Markdown 报告，并生成本地 `.docx`。

## 适用场景

- 走查前端项目目录，找出交互与体验问题
- 打开业务 URL，结合截图留证做走查
- 基于设计稿或页面截图做审查

触发词：体验走查、UX review、交互走查、界面审查、体验问题

## 环境要求

- Python 3.9+
- 依赖：

```bash
pip install -r requirements.txt
```

macOS 标注定位可使用 Apple Vision OCR（`ocrmac`）；其他平台可安装 `pytesseract` + tesseract 作为 OCR 兜底。

## 主流程

```
A 前置 precheck → B 走查报告 → C 标注校验与 docx 生成
```

详见 `SKILL.md`。

## 交付物

1. 对话中的完整 Markdown 报告（非摘要）
2. 本地 `.docx` 路径（success 路径必需）
3. URL/截图模式：确定问题附带标注图与 bbox

## 版本

当前：**1.0.1**（见 `SKILL.md` frontmatter）
