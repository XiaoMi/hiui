# UX Walkthrough（体验走查）

对 B 端产品做系统性体验走查：支持**代码库 / URL / 截图**三种输入，输出结构化 Markdown 报告，并生成本地 `.docx`。

统一收口为完成门禁之一。

## 适用场景

- 走查前端项目目录，找出交互与体验问题
- 打开业务 URL，结合截图留证做走查
- 基于设计稿或页面截图做审查

触发词：体验走查、UX review、交互走查、界面审查

## 安装

将本 skill 安装到所使用 Agent 平台的 skill 目录。目录名建议保持 `ux-walkthrough`。

常见路径示例（以各平台文档为准）：

| 平台 | 典型路径 |
|------|----------|
| Cursor | `~/.cursor/skills/ux-walkthrough/` |
| 其他 Agent / IDE | 按该平台 skill、plugin 或 rules 目录配置 |

步骤：

1. 复制或解压整个 `ux-walkthrough/` 到上述路径
2. 安装 Python 依赖：`pip install -r requirements.txt`
3. 在 Agent 中通过 skill 引用、插件名或触发词调用

**Agent 运行时以 `SKILL.md` 为唯一主规范。**
`agents/openai.yaml` 等为可选的平台集成描述，不影响核心流程。

## 环境要求

- Python 3.9+
- 依赖：

```bash
pip install -r requirements.txt
# macOS 标注定位需 ocrmac（Apple Vision OCR）
```

维护者可在完整仓库中运行：

```bash
./scripts/dev/smoke_test.sh
./scripts/dev/full_selftest.sh
```

## 主流程（四阶段）

```
A 前置 precheck → B 走查报告 → C 生 docx → D 统一收口（强制）
```

其中阶段 B 的默认顺序已经收成轻量路径：

`核心流程必跑 → 结构四问快扫 → 命中再展开 → checklist 收口`

先确认“能不能完成新增、编辑、导出等主任务”，再看间距、留白和样式细节。详见 `SKILL.md`。

## 交付物

1. 对话中的**完整** Markdown 报告（非摘要）
2. 本地 `.docx` 路径（success 路径必需）
3. URL/截图模式：确定问题附带标注图与 bbox

未完成 `closeout_walkthrough.py` 的统一收口，不算 skill 意义上的「完整完成」。

## 目录结构

```
ux-walkthrough/
├── SKILL.md                 # Agent 主入口
├── README.md
├── requirements.txt
├── output/                  # 默认 docx 输出
├── references/              # checklist · issue-examples · report 模板
├── scripts/                 # precheck · generate_docx · closeout
└── docs/onboarding/         # 门禁与执行说明
```

## 本地输出

本 skill 默认只会在本地生成或读取完成走查所需文件，例如：

| 路径 | 用途 |
|------|------|
| `output/` | 生成的 docx |
| 你提供的 `report.json` / 截图 / 标注图 | 走查与导出所需输入 |

## 常见问题

**Q：`python-docx not available`**
A：`pip install -r requirements.txt`

**Q：URL 停在登录页**
A：先登录，或改提供登录后截图

**Q：非页面项目**
A：需含 `package.json`、`src/` 或路由/页面文件

## 版本

当前：**1.4.6**（见 `SKILL.md` 正文与 `skill.manifest.json`）
