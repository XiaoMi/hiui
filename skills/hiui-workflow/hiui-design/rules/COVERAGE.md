# Rules Coverage

## 事实源

- 页型列表来源：`page-type-map.md`
- 机读事实来源：`common.page-types.json`
- 权威顺序：`common.page-types.json` -> `page-type-map.md` -> `docs/generation/*.md`

## Generation Coverage

- `table-stat`
- `data-visualization`
- `table-basic`
- `tree-table`
- `tree-split`
- `drawer-form`
- `drawer-detail`
- `feedback-status`
- `full-page-edit`
- `full-page-detail`

规则入口：

- 默认生成边界：`generation-rules.md`
- 页型注册与正文入口：`../docs/generation/figma-page-rules.md`
- 页型专章：`../docs/generation/figma-pages/*.md`

## Validation Coverage

- `table-stat`
- `data-visualization`
- `table-basic`
- `tree-table`
- `tree-split`
- `drawer-form`
- `drawer-detail`
- `feedback-status`
- `full-page-edit`
- `full-page-detail`

规则入口：

- 默认 gate：`validation-checklist.md`
- 完整清单：`../docs/validation/checklist.md`

## Non-typical Layout Strategy Coverage

- `linear-stack`
- `parallel-sections`
- `primary-secondary`

规则入口：

- 非典型布局路由：`../docs/generation/non-typical-pages.md`
- 默认生成边界：`generation-rules.md`
- 默认 gate：`validation-checklist.md`

## Non-typical Layout Archetype Coverage

- `context-main-split`

规则入口：

- 非典型布局骨架：`../docs/generation/non-typical-pages.md`
- 默认生成边界：`generation-rules.md`
- 默认 gate：`validation-checklist.md`

## 当前缺口

- 无已登记页型缺口

若后续在 `page-type-map.md` 或 `common.page-types.json` 新增页型、非典型布局策略或布局骨架，必须同步更新：

1. `generation-rules.md` 或对应 `docs/generation/figma-pages/*.md`
2. `validation-checklist.md` 或 `docs/validation/checklist.md`
3. 本文件的覆盖列表
