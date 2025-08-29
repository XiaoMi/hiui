---
"@hi-ui/hiui": patch
"@hi-ui/table": patch
---

fix(table): 优化 useColSorter 钩子，移除不必要的 columnsLatestRef 引用，直接使用 columns 进行排序计算 (5.0)
