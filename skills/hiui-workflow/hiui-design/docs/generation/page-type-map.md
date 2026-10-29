<!-- Generated from docs/generation/page-types.manifest.json. -->
<!-- Do not edit page-type facts directly in this file. -->
# 页型总表

## 这份文件负责什么

这份文件只做四件事：

1. 判页型
2. 选固定页壳
3. 选 runtime 对照页（仅参考，不可输出）和规则入口
4. 指向生成前 brief 需要读取的机器契约

## 这份文件不负责什么

- 不维护默认 `nodeId` / `fileKey`
- 不维护页型正文 P0
- 不维护具体分档、间距、失败信号、自检清单
- 不维护每个页型的长篇生成规则正文

这些内容统一去看：

- 共性生成原则：`generation-principles.md`
- 默认节点与正文入口：`figma-page-rules.md`
- 机器可读生成契约：`page-types.manifest.json` 的 `generationContract`
- 页型正文：`figma-pages/*.md`
- 共享规则：`figma-pages/forms-shared.md` / `figma-pages/table-shared.md`

## 页型路由表

| 页面类型 | 何时使用 | 固定页壳 | runtime 对照页（仅参考，不可输出） | 下一步 |
| --- | --- | --- | --- | --- |
| 数据统计表 | 指标卡 + 筛选 + 表格 + 分页 | `StatListPageFrame` | `examples/host-integration/src/pages/table-stat.tsx` | `figma-page-rules.md` -> `figma-pages/table-stat.md + figma-pages/table-shared.md` |
| 数据可视化 | 图表是主信息载体；是否带明细表取决于是否需要记录下钻、复核或后续操作承接 | `StatListPageFrame` | `examples/host-integration/src/pages/data-visualization/index.tsx` | `figma-page-rules.md` -> `figma-pages/data-visualization.md + figma-pages/table-shared.md` |
| 普通表格 | 常规筛选 + 表格 + 分页 | `TablePageFrame` | `examples/host-integration/src/pages/basic-table.tsx` | `figma-page-rules.md` -> `figma-pages/basic-table.md + figma-pages/table-shared.md` |
| 树形表格 | 树在表格首列内展开 | `TablePageFrame` | `examples/host-integration/src/pages/tree-table.tsx` | `figma-page-rules.md` -> `figma-pages/tree-table.md + figma-pages/table-shared.md` |
| 左树右表 | 左侧树，右侧筛选和表格 | `TreeSplitPageFrame` | `examples/host-integration/src/pages/inventory-split.tsx` | `figma-page-rules.md` -> `figma-pages/tree-split.md + figma-pages/table-shared.md` |
| 抽屉表单 | 字段较少，抽屉内完成编辑 | `ProFormDrawer` | `examples/host-integration/src/pages/drawer-form.tsx` | `figma-page-rules.md` -> `figma-pages/drawer-form.md + figma-pages/forms-shared.md` |
| 抽屉详情 | 字段较少，抽屉内只读详情 | `ProDetailDrawer` | `examples/host-integration/src/pages/drawer-detail.tsx` | `figma-page-rules.md` -> `figma-pages/drawer-detail.md` |
| 全页编辑 | 主流程为整页表单，需要底部操作区；结构化子记录可追加可选明细表 | `ProEditPage` | `examples/host-integration/src/pages/full-page-edit.tsx` | `figma-page-rules.md` -> `figma-pages/edit.md + figma-pages/forms-shared.md` |
| 全页详情 | 多分组只读详情页 | `ProDetailPage` | `examples/host-integration/src/pages/full-page-detail.tsx` | `figma-page-rules.md` -> `figma-pages/detail-group.md` |
| 异常反馈页 | 页面主内容是空状态、失败、无权限或建设中反馈 | `FeedbackStatusPage` | `examples/host-integration/src/pages/feedback-status/index.tsx` | `figma-page-rules.md` -> `figma-pages/feedback-status.md` |

## 判型边界

- 指标卡 + 筛选 + 表格 + 分页：优先判为“数据统计表”，不要落回普通表格
- 常规列表：走“普通表格”，不要因为有筛选就误判成数据统计表
- 树在表格首列内展开：走“树形表格”，不要误判成左树右表
- 左树和右表是两个区域：走“左树右表”，不要误判成树形表格
- 可编辑字段 `<= 16`：优先考虑“抽屉表单”
- 只读描述项 `<= 16`：优先考虑“抽屉详情”
- 可编辑字段 `> 16`：切到“全页编辑”
- 只读描述项 `> 16`：切到“全页详情”

## 使用提醒

- 先读 `generation-principles.md`，再用本文件判型
- 项目画像用于判断目标项目是否需要项目本地兼容桥：不需要时走 `host-integration`，需要时走 `rules-only`；`auto` 会先复用已记录 mode，再做这个判断；已下线历史链路已不再属于当前对外模式，不要从目标项目旧页面反推典型页结构
- 命中页型后，不要停在本文件；必须继续读 `figma-page-rules.md` 和对应专章
- 写代码前必须读取命中页型的 `generationContract`，形成单页生成 brief 后再按页型工作流起步：标准典型页复制母版，独立能力页固定受管壳层并按规范生成内容区
- 不要在这里重复维护默认节点和正文 P0；本文件只负责“把页面送到正确的文档入口”

## 未命中现成页型时

- 先回到 `generation-principles.md`
- 判断它本质更像编辑、详情、列表、统计还是树/主从结构
- 选择最接近的固定页壳、runtime 对照页（仅参考，不可输出）和规则专章
- 只做最小偏移，不要绕开现有壳层另起一套页面语法
