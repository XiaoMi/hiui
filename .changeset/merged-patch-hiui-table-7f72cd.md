---
"@hi-ui/hiui": patch
"@hi-ui/table": patch
---

<br>
- fix(table): 修复在 stretchHeight 模式下，冻结列表头和单元格层级问题 (5.0)

- fix(table): 修复表头分组数据为空时表头显示异常问题，当 data 为空时，使用双表格 (5.0)

- perf(table): add cell class prefix to TbodyContent and adjust useColWidth debounce timing (5.0)

- refactor(table): stretchHeight 模式不再使用双表格结构，使用 sticky 实现 (5.0)

- fix(table): 优化 useColSorter 钩子，移除不必要的 columnsLatestRef 引用，直接使用 columns 进行排序计算 (5.0)

- fix(table): fix sorter ui bug (5.0)

- chore(table): export SettingDrawer types (5.0)

- perf(table): 优化列宽更新逻辑，当 columns 长度和 dataKey、width 发生变化时，重新计算列宽 (5.0)

- fix(table): 用于计算真实列宽的行节点，考虑单元格合并的场景 (5.0)

- fix(table): 修复 stretchHeight 模式下高度变化时虚拟表格高度没有更新问题 (5.0)

- fix(table): 标题去掉背景，头部加上边框 (5.0)

- fix(table): 单元格间距调整 & 设置最小高度 (5.0)

- fix(table): 不同尺寸修改 (5.0)

- fix(table): 修复 stretchHeight+bordered 模式下数据为空时左右边框未显示问题 (5.0)

- fix(table): 修复标题过长时，列头宽度拉宽后无法缩小的问题 (5.0)

- refactor(table): 调整列宽计算逻辑，兼容表头分组和单元格合并场景 (5.0)

- fix(table): 计算每列 top 值优化，只有在需要 sticky 的场景下才设置该值 (5.0)

- fix(table): 修复 SettingDrawer 打开时会触发 onReset 问题 (5.0)
