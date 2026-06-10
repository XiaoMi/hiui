---
name: hiui-design
description: >-
  在 React 项目中接入、生成、修改、联调或验收 HiUI 典型页与非典型页面时使用。适用于
  数据统计表、普通表格、树形表格、左树右表、数据可视化、异常反馈页、抽屉表单/详情、
  全页编辑/详情，以及 host-integration、rules-only、legacy-host-compatible 等场景。
---

# HiUI 典型页 Skill

帮 React 项目接入、生成或验收 HiUI 典型页与非典型页面。核心只有 3 种模式和 10 种典型页型；未命中典型页型时，按非典型页面规则收口布局策略与源码契约。

## 四步走

1. 页面相关任务先执行 `scripts/plan-page-task.mjs --json` 得到机器计划；若当前环境不能执行脚本，再退回读取 `rules/QUICK-START.md`
2. 按计划里的 `taskLevel` 区分 `minor-edit` / `managed-page-change` / `new-page-or-rearchitecture`
3. 只补读计划里的 `requiredDocs`；若 `blockingReasons` 非空，先补齐缺失事实，不要直接实现
4. 需要完整生成路径时，按计划里的 `mode`、`pageType`、`contractFieldsNeeded` 和 `requiredCommands` 执行；若未命中典型页型，切到 `docs/generation/non-typical-pages.md`
5. 按任务等级跑对应 gate

## 详细规则

- 机器计划入口：`scripts/plan-page-task.mjs`
- 模式判定：`rules/mode-selection.md`
- 页型路由：`rules/page-type-map.md`
- 生成约束：`rules/generation-rules.md`
- 实现前 / 交付前模板：`docs/generation/implementation-checklist-template.md`
- contract 约束：`rules/contract-regions.md`
- 国际化基线：`docs/generation/i18n-baseline.md`
- 验收清单：`rules/validation-checklist.md`
- 非典型页面：`docs/generation/non-typical-pages.md`

## 按需读取

- 接入 / 安装 / 排障：`docs/onboarding/*.md`
- 命中页型后：`docs/generation/figma-page-rules.md` 与 `docs/generation/figma-pages/*.md`
- 命中任何含用户文案、数字、金额、时间、图表标题或反馈态的页面：`docs/generation/i18n-baseline.md`
- 未命中典型页型：`docs/generation/non-typical-pages.md`
- 典型页型 overlay：`data-visualization` 等内部结构较灵活的页型，也可补读 `docs/generation/non-typical-pages.md` 作为内部布局判断；若采用 `primary-secondary` 且后方仍有同级通栏主内容，还要补判 `split-section closure`
- `rules-only`：`docs/generation/rules-only-component-matrix.md`、`docs/generation/rules-only-example-alignment.md`
- 旧宿主兼容：`docs/generation/legacy-host-compatibility.md`

## 不要默认读

- `vendor/**`
- `scripts/**` 源码
- `examples/**`

## 首轮输出

- 页面相关任务优先以 `plan-page-task` 的 JSON 作为执行计划；首轮回复只展开计划要求的字段、文档和命令，不要重新手工拼一套路由结论
- 首次回复的固定顺序、字段名和何时追加字段，统一看 `docs/generation/ai-kickoff-template.md`
- `rules-only` / `legacy-host-compatible` 下的 contract 摘要，统一按 `rules/contract-regions.md` 输出，不在这里重复维护字段表
- 若未命中典型页型，或命中 overlay 仍需额外布局判断，再补读 `docs/generation/non-typical-pages.md`
- 若页面属于组合页、split 页面，补读 `docs/generation/implementation-checklist-template.md`
- 若页面实际渲染图表，补读 `docs/generation/figma-page-rules.md` 与当前命中的页型专章
- 若失败则回到判模式和判页型，不要整包遍历 `docs/`

组合页默认顺序固定为：先用规则确定边界条件，再参考示例决定结构；不要先按示例落宽度常量，再回头补规则。

脚本入口、成功信号和失败信号统一看 `scripts/README.md`。


## Open Source Note

公开版默认不包含内部可选使用统计、private publishing 发布、内网同步和业务线 overlay。需要这些能力时，请在私有维护层中扩展。
