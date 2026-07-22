# 页型专章索引

按下面顺序读取：

1. 先看 `../generation-principles.md` 建立共性生成边界
2. 再看 `../page-type-map.md` 判定页型
3. 命中现成页型后，再看 `../figma-page-rules.md` 命中默认 `nodeId` 和核心 P0
4. 再只读对应专章与命中的 shared rules
5. 开写前先把“本次最小命中文档集”写进生成说明，不要边写边猜
6. 最后回 `../figma-reference.md` 做通用陷阱和自检

如果 shared rules、overlay 或页型专章中的任一关键约束仍未命中，就不要开始写页面；先把命中的最小规则集合列清楚，再生成。

## 页型列表

| 页型 | 文档 | 默认 `nodeId` |
|------|------|---------------|
| 全页编辑 / 新建 | [`edit.md`](edit.md) | `51257:102808` |
| 抽屉表单 / 编辑 | [`drawer-form.md`](drawer-form.md) | `51728:128145` |
| 抽屉只读详情 | [`drawer-detail.md`](drawer-detail.md) | `51728:131344` |
| 全页分组详情 | [`detail-group.md`](detail-group.md) | `52409:60782` |
| 数据统计表 | [`table-stat.md`](table-stat.md) | `51257:107076` |
| 数据可视化 | [`data-visualization.md`](data-visualization.md) | 无独立默认节点 |
| 异常反馈页 | [`feedback.md`](feedback.md) | 无独立默认节点 |
| 左树右表 | [`tree-split.md`](tree-split.md) | `51257:107202` |
| 树形表格 | [`tree-table.md`](tree-table.md) | `51257:107314` |

## 共享规则

- 表单共性：[`forms-shared.md`](forms-shared.md)
- 表格 / 筛选共性：[`table-shared.md`](table-shared.md)

## 维护约定

- 规则只写在最贴近的专章里。
- 共享规则放到 `forms-shared.md` / `table-shared.md`，不要在每个页型文件复制一遍。
- `figma-reference.md` 只保留速查，不再承载完整规则正文。
- 页型的机读事实来源统一收口到 `../../rules/common.page-types.json`。
- 修改页型事实后，执行 `../../scripts/sync-manifest-docs.mjs`，同步生成上层索引和矩阵文档。
