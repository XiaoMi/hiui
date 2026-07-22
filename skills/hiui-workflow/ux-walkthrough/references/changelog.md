# 更新记录

## v1.0.2

- 新增 `checklist_coverage` 必填字段与 `scripts/validate_checklist_coverage.py` 覆盖门禁
- `generate_docx.py` 默认校验 17 条 checklist 全覆盖；未填完整则拒绝生成 docx
- `ux-checklist.md` 明确 coverage 留痕与用户报告分离
- `pass` 必须写 `pass: <验证证据>=8字>`，禁止裸 `pass`；`pending` / `n/a` 原因也要求 >=8 字
- 新增 `references/walkthrough-worksheet.md`：阶段 B 按 Batch 1→4 分批逐项走查

## v1.0.1

- 外部发布版：移除统计模块与内部专有信息
- 三阶段主流程：前置检查 → 走查与报告 → 生 docx 与完成自检
