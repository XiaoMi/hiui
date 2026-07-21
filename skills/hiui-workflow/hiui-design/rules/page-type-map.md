<!-- Generated from rules/common.page-types.json by scripts/sync-manifest-docs.mjs. -->
<!-- Do not edit page-type facts directly in this file. Canonical machine facts live in rules/common.page-types.json. -->
<!-- Rules version: 1.0.7 (2026-07-21). -->

# 页型总表

## 这份文件负责什么

这份文件只做三件事：

1. 判页型
2. 选固定页壳
3. 选示例页起点

这是默认页型路由表，由 `common.page-types.json` 派生并保持同步。

## 这份文件不负责什么

- 不维护 kickoff 字段顺序
- 不维护 contract 字段形状
- 不维护非典型 / overlay 布局字段
- 不维护组合页增量 checklist
- 不维护验收完成定义

这些内容统一去看：

- kickoff 输出格式：`../docs/generation/ai-kickoff-template.md`
- 生成原则与阶段门槛：`generation-rules.md`
- contract 字段：`contract-regions.md`
- 非典型 / overlay 布局推理：`../docs/generation/non-typical-pages.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 验收证据：`validation-checklist.md`

## 页型路由表

| 页面类型 | 何时使用 | 固定页壳 | 示例起点 | 下一步 |
| --- | --- | --- | --- | --- |
| 数据统计表 | 指标卡 + 筛选 + 表格 + 分页 | `StatListPageFrame` | `examples/host-integration/src/pages/table-stat.tsx` | `figma-page-rules.md` -> `figma-pages/table-stat.md + figma-pages/table-shared.md` |
| 数据可视化 | 指标卡 + 多图表 + 明细表 | `StatListPageFrame` | `examples/host-integration/src/pages/data-visualization.tsx` | `figma-page-rules.md` -> `figma-pages/data-visualization.md + figma-pages/table-shared.md` |
| 普通表格 | 常规筛选 + 表格 + 分页 | `TablePageFrame` | `examples/host-integration/src/pages/basic-table.tsx` | `figma-page-rules.md` -> `figma-pages/table-shared.md` |
| 树形表格 | 树在表格首列内展开 | `TablePageFrame` | `examples/host-integration/src/pages/tree-table.tsx` | `figma-page-rules.md` -> `figma-pages/tree-table.md + figma-pages/table-shared.md` |
| 左树右表 | 左侧树，右侧筛选和表格 | `TreeSplitPageFrame` | `examples/host-integration/src/pages/inventory-split.tsx` | `figma-page-rules.md` -> `figma-pages/tree-split.md + figma-pages/table-shared.md` |
| 抽屉表单 | 字段较少，抽屉内完成编辑 | `ProFormDrawer` | `examples/host-integration/src/pages/drawer-form.tsx` | `figma-page-rules.md` -> `figma-pages/drawer-form.md + figma-pages/forms-shared.md` |
| 抽屉详情 | 字段较少，抽屉内只读详情 | `ProDetailDrawer` | `examples/host-integration/src/pages/drawer-detail.tsx` | `figma-page-rules.md` -> `figma-pages/drawer-detail.md` |
| 异常反馈页 | 空状态、加载失败、无权限、建设中、网络异常等反馈场景 | `FeedbackStatePanel` | `examples/host-integration/src/pages/empty-state.tsx` | `figma-page-rules.md` -> `figma-pages/feedback.md` |
| 全页编辑 | 主流程为整页表单，需要底部操作区 | `ProEditPage` | `examples/host-integration/src/pages/full-page-edit.tsx` | `figma-page-rules.md` -> `figma-pages/edit.md + figma-pages/forms-shared.md` |
| 全页详情 | 多分组只读详情页 | `ProDetailPage` | `examples/host-integration/src/pages/full-page-detail.tsx` | `figma-page-rules.md` -> `figma-pages/detail-group.md` |

## 判型边界

- 指标卡 + 多图表 + 明细表：优先判为“数据可视化”，不要误判成数据统计表
- 页面主目标是空状态、加载失败、无权限、建设中、网络异常等反馈：优先判为“异常反馈页”，不要套表格/详情壳
- 指标卡 + 筛选 + 表格 + 分页：优先判为“数据统计表”，不要落回普通表格
- 常规列表：走“普通表格”，不要因为有筛选就误判成数据统计表
- 树在表格首列内展开：走“树形表格”，不要误判成左树右表
- 左树和右表是两个区域：走“左树右表”，不要误判成树形表格
- 可编辑字段 `<= 16`：优先考虑“抽屉表单”
- 只读描述项 `<= 16`：优先考虑“抽屉详情”
- 可编辑字段 `> 16`：切到“全页编辑”
- 只读描述项 `> 16`：切到“全页详情”

## 硬规则

- 数据可视化页必须从 `data-visualization.tsx` 起步
- 异常反馈页默认从 `empty-state.tsx` 起步；若需求命中错误态或权限态，再切到同组 feedback 子页
- 数据统计页必须从 `table-stat.tsx` 起步
- 全页编辑必须从 `full-page-edit.tsx` 起步
- 不要从空白文件发明新的典型页骨架
- 不要手拼裸 `PageHeader + QueryFilter + Table`
- 不要手拼裸 `PageHeader + 多层白卡 + 一堆默认图表`

## rules-only 附加约束

- 先锁定唯一示例页，再锁定唯一宿主 archetype
- 先明确页头、筛选区/表单区、主体区、分页/底栏分别落在哪个组件语义或宿主基座
- 写不出 `example path`、`host archetype path`、`example -> host` 区域映射时，不要开始生成
- page contract 的关键 region、ownership 与 structural guard 统一看 `contract-regions.md`

## 使用提醒

- 先读 `generation-rules.md`，再用本文件判型
- 外部项目默认不落模版页面；应在目标项目既有目录结构中生成首个真实业务页后，再验证宿主和样式基线是否正常
- 命中页型后，不要停在本文件；必须继续读 `figma-page-rules.md` 和对应专章
- 本文件只负责把页面送到正确入口，不再平行维护其它事实源

## 非典型 / Overlay 路径

若页面未命中现成典型页型，或仍命中典型页型但内部一级分组需要额外布局判断，不要在本文件里继续定义 `layout strategy` 或 `layout archetype`。

统一做法：

1. 先保留当前 `page type` 结论，或明确“未命中典型页型”
2. 再读 `non-typical-pages.md`
3. 由该文档负责 `layout strategy`、`layout archetype` 与布局 ownership 的解释


## 未命中现成页型时

- 先回到 `generation-rules.md`
- 判断它本质更像编辑、详情、列表、统计还是树/主从结构；若仍不命中典型页型，再从 `../docs/generation/non-typical-pages.md` 继续收口
- 选择最接近的固定页壳和示例页起步
- 只做最小偏移，不要绕开现有壳层另起一套页面语法
