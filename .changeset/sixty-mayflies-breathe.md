---
"@hi-ui/hiui": patch
"@hi-ui/table": patch
---

<br>
- perf(table): 优化列宽更新逻辑，当 columns 长度和 dataKey、width 发生变化时，重新计算列宽 (5.0)
- fix(table): 用于计算真实列宽的行节点，考虑单元格合并的场景 (5.0)
- fix(table): 修复 stretchHeight 模式下高度变化时虚拟表格高度没有更新问题 (5.0)
