# Changelog

All notable changes to `refine-product-requirements` will be documented in this file.

## [1.0.0] - 2026-07-02

### Added

- 正式 PRD 交付模式与独立 PRD 模板
- 项目上下文预载规则与反锚定确认
- 前向验证样例与最终检查清单模板
- 开源发布配套文件：`README.md`、`LICENSE`、`.gitignore`

### Changed

- 收紧 `full-prd-to-generation` 的默认升级条件
- 将 `product-prd` 与 `generation-pack` 的边界改为明确输出约束
- 将飞书优先策略改为可执行的能力探测与回退协议
- 压缩 `agents/openai.yaml`，将详细规则回收到主说明和 references
- 将 `quick-refine` 明确定义为探索优先的轻量出口

### Validation

- 通过 `skill_lint.py`
- 校验 `requiredPaths` 无缺失
