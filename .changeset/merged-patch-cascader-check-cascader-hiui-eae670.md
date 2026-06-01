---
"@hi-ui/cascader": patch
"@hi-ui/check-cascader": patch
"@hi-ui/hiui": patch
---

<br>
- style(cascader&check-cascader): 增加 white-space: nowrap; 样式以防止文本换行 (5.0)

- style(cascader&check-cascader): 调整搜索框默认宽度为 100px (5.0)

- feat(check-cascader): 增加 flattedSearchResult 属性，用于控制搜索结果的展现形式 (5.0)

- fix(cascader): 修复当搜索结果为空时，下拉框没有显示空状态问题 (5.0)

- fix(cascader): 处理当 value 为空时清空选项的选中态(5.0)

- style(cascader&check-cascader): 调整选项容器最小宽度为 160px (5.0)

- style(cascader&check-cascader): 优化下拉框宽度，让内容和搜索框默认宽度对齐 (5.0)

- perf(cascader&check-cascader): 优化 customRender 函数，支持传递选中项和当前值 (5.0)
