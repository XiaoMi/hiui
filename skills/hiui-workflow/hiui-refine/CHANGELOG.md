# Changelog

All notable changes to `hiui-refine` will be documented in this file.

## [2.0.0] - 2026-07-16

### Changed

- Breaking: canonical skill name updated to `hiui-refine`
- Repositioned the skill as the standard S0 prerequisite in the `hiui-page-workflow` family
- Updated install naming, display naming, and downstream workflow references to use `hiui-refine`

### Validation

- Verified version sources are aligned at `2.0.0`
- Updated `hiui-page-workflow` dependency references, bundle lock metadata, and handoff contracts
- Added workflow-bundle legacy install migration so `refine-product-requirements` upgrades move cleanly to `hiui-refine`

## [1.2.0] - 2026-07-16

### Added

- B 端中后台子类型路由、`PB01 ~ PB04` 高频场景 playbook、`AX01 ~ AX06` 后台增强产物模板、`BX01 ~ BX05` 专家判断框架
- `backend-ops-pack` 交付层与更严格的后台治理门禁
- `SKILL.md` 内联版本信息，作为可读文档层的显式版本声明

### Changed

- 将 skill 主定位从泛化产品需求细化收口为 B 端中后台需求细化与专家判断
- 强化主流程、轮次联动、反模式识别和生成输入确认规则
- 收紧页面提示词对权限矩阵、状态流转、字段字典、批量规范等约束的引用要求

### Validation

- 新增最小版本一致性校验脚本 `scripts/check_version_consistency.py`
- 校验 `skill.manifest.json`、`SKILL.md` front matter、`SKILL.md` 版本信息章节、`CHANGELOG.md` 顶部版本一致

## [1.1.0] - 2026-07-08

### Added

- 正式 PRD 独立模板 `references/product-prd-template.md`
- 项目上下文预载规则 `references/project-context-loading.md`
- 最小前向验证样例 `references/forward-test-examples.md`
- PRD 图示一致性、权限矩阵、状态流转表相关门禁

### Changed

- 收紧 generation-pack 的字段级完成度要求，区分 `draft generation-pack` 与 `consumable generation-pack`
- 当用户指出提示词过于抽象时，强制回退生成门禁并继续确认
- 将复杂 PRD 的图示要求从“建议”提升为可检查的交付约束
- 补强 `agents/openai.yaml` 的默认触发提示，明确项目上下文预载与 PRD / generation-pack 分层

### Validation

- 通过 `skill_lint.py`
- 前向样例覆盖 PRD、项目上下文预载、generation-pack 门禁与复杂 PRD 补图路径

## [1.0.0] - 2026-07-02

### Added

- 正式 PRD 交付模式与独立 PRD 模板
- 项目上下文预载规则与反锚定确认
- 前向验证样例与最终检查清单模板
- 开源发布配套文件：`README.md`、`LICENSE`、`.gitignore`

### Changed

- 收紧 `full-prd-to-generation` 的默认升级条件
- 将 `product-prd` 与 `generation-pack` 的边界改为明确输出约束
- 将协作文档优先策略改为可执行的能力探测与回退协议
- 压缩 `agents/openai.yaml`，将详细规则回收到主说明和 references
- 将 `quick-refine` 明确定义为探索优先的轻量出口

### Validation

- 通过 `skill_lint.py`
- 校验 `requiredPaths` 无缺失
