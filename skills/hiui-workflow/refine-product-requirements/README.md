# refine-product-requirements

`refine-product-requirements` 是一个面向产品需求细化的 Codex skill。它把模糊需求逐步收敛成可执行的产品方案，并在需要时继续产出正式 PRD、页面清单、全局生成上下文、页面级提示词和 HiUI 交接包。

## What It Does

- 将抽象想法收敛为 `solution-only`、`product-prd`、`page-inventory`、`prompt-pack`、`hiui-handoff` 或 `full-prd-to-generation`
- 用 `questionDebt`、`remainingDebt`、`assumptions` 控制确认深度和收口时机
- 在已有仓库上下文中执行最小项目预载，减少重复追问
- 将产品方案与生成输入拆层，避免把正式 PRD 和页面生成包混写
- 对页面生成、HiUI 生成、原型生成和 UX 验收设置明确的输入门禁

## When To Use

适合这些场景：

- “帮我细化需求”
- “帮我出产品方案 / PRD 方向”
- “帮我拆页面结构 / 页面清单”
- “把需求整理成正式 PRD”
- “给页面生成准备清晰的产品输入”
- “结合当前项目已有页面、接口、类型和文档继续收敛”

不适合这些场景：

- 只需要纯设计实现或直接写页面代码，不需要需求细化
- 只需要 UX 走查，不需要产品方案或页面生成输入
- 已有稳定 PRD 且不需要任何确认或重组

## Repository Layout

- `SKILL.md`: skill 主说明与核心 workflow
- `agents/openai.yaml`: 入口触发提示
- `skill.manifest.json`: runtime manifest、required paths 和 public contracts
- `references/`: 交付模式、确认模型、模板、PRD 结构、项目上下文预载和前向验证样例

## Install

将整个目录放入本地 Codex skills 目录，并保留目录名为 `refine-product-requirements`。

最小所需文件由 `skill.manifest.json` 的 `requiredPaths` 定义。不要只复制 `SKILL.md`，否则会缺少交付模式、PRD 模板和验证样例等依赖资源。

## Validation

建议在发布或修改后执行以下检查：

```bash
python3 /path/to/skill-optimizer/scripts/skill_lint.py /path/to/refine-product-requirements
```

然后至少手工抽查以下 4 类前向样例：

- 只要产品方案，不要 PRD
- 结合当前仓库上下文继续收敛
- 只要正式 PRD，不要生成包
- 一条龙交付，输出 PRD + generation-pack

具体样例见 `references/forward-test-examples.md`。

## Public Surface

这个 skill 对外承诺的稳定面以 `skill.manifest.json` 为准，重点包括：

- `SKILL.md`
- `references/delivery-modes.md`
- `references/confirmation-model.md`
- `references/output-templates.md`
- `references/hiui-handoff-template.md`
- `references/product-prd-template.md`
- `references/project-context-loading.md`
- `references/forward-test-examples.md`

## Release Notes

- 优先使用语义化版本号
- 行为规则发生变化时，同时更新 `CHANGELOG.md`
- 发布前重新跑 lint，并确认 `requiredPaths` 没有缺文件

## License

本仓库默认附带 MIT License。若你的使用场景需要更严格的专利或商标条款，可在发布前替换为更合适的许可证。
