<!-- Generated from rules/common.page-types.json by scripts/sync-manifest-docs.mjs. -->
<!-- Do not edit page-type facts directly in this file. Canonical machine facts live in rules/common.page-types.json. -->
<!-- Rules version: 1.0.7 (2026-07-21). -->

# Figma Typical Page Reuse Matrix

## 说明

这份矩阵现在只保留 `hiui-design` 的核心页型映射，作为外部项目复用时的总览。

它是从 `common.page-types.json` 派生的说明性矩阵，不是单独的规则源。

详细规则来源改为：

- `.local-context/hiui-design/rules/generation-rules.md`
- `.local-context/hiui-design/rules/page-type-map.md`
- `.local-context/hiui-design/docs/generation/figma-page-rules.md`
- `.local-context/hiui-design/docs/generation/figma-page-rules-appendix.md`
- `.local-context/hiui-design/rules/common.page-types.json`

## 页型矩阵

| 页型 | 默认 `nodeId` | 固定页壳 | 示例起点 |
| --- | --- | --- | --- |
| 数据统计表 | `51257:107076` | `StatListPageFrame` | `examples/host-integration/src/pages/table-stat.tsx` |
| 数据可视化 | `无独立默认节点` | `StatListPageFrame` | `examples/host-integration/src/pages/data-visualization.tsx` |
| 普通表格 | `无独立默认节点` | `TablePageFrame` | `examples/host-integration/src/pages/basic-table.tsx` |
| 树形表格 | `51257:107314` | `TablePageFrame` | `examples/host-integration/src/pages/tree-table.tsx` |
| 左树右表 | `51257:107202` | `TreeSplitPageFrame` | `examples/host-integration/src/pages/inventory-split.tsx` |
| 抽屉表单 | `51728:128145` | `ProFormDrawer` | `examples/host-integration/src/pages/drawer-form.tsx` |
| 抽屉详情 | `51728:131344` | `ProDetailDrawer` | `examples/host-integration/src/pages/drawer-detail.tsx` |
| 异常反馈页 | `无独立默认节点` | `FeedbackStatePanel` | `examples/host-integration/src/pages/empty-state.tsx` |
| 全页编辑 | `51257:102808` | `ProEditPage` | `examples/host-integration/src/pages/full-page-edit.tsx` |
| 全页详情 | `52409:60782` | `ProDetailPage` | `examples/host-integration/src/pages/full-page-detail.tsx` |

## 使用顺序

1. 先运行 `typical-page:doctor`
2. 先读生成原则
3. 再判页型
4. 命中已有页型后再命中默认 `nodeId` 和核心 P0
5. 再从示例页开始改
6. 最后只替换业务槽位

## 非典型 / Overlay 路径

若页面未命中现成典型页型，或仍命中典型页型但内部一级分组需要额外布局判断，不要在本文件里继续定义 `layout strategy` 或 `layout archetype`。

统一做法：

1. 先保留当前 `page type` 结论，或明确“未命中典型页型”
2. 再读 `non-typical-pages.md`
3. 由该文档负责 `layout strategy`、`layout archetype` 与布局 ownership 的解释


## 不再作为默认来源的内容

- 任何第二份独立的典型页规则 skill
- `.local-context/hiui-pro-templates/views/*`
- 当前项目 feature 业务页面路径
