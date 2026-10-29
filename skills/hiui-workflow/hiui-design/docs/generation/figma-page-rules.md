<!-- Generated from docs/generation/page-types.manifest.json. -->
<!-- Do not edit page-type facts directly in this file. -->
# 当前项目 Figma 典型页注册总表

## 这份文件负责什么

这份文件只负责维护下面这些“注册信息”：

- 默认 `fileKey`
- 默认 `nodeId`
- 固定页壳
- 对应正文入口
- 生成前母版入口
- 可替换业务槽位摘要
- 每个页型的一句核心摘要

## 这份文件不负责什么

- 不维护分档表
- 不维护具体 spacing / padding / 列数 / 宽度正文
- 不维护失败信号、自检清单、长篇禁止项
- 不维护完整 brief；完整 brief 由脚本读取 manifest 和正文文档生成

这些内容统一去看：

- 共性生成原则：`generation-principles.md`
- 机读事实来源：`page-types.manifest.json`
- 生成契约来源：`page-types.manifest.json` 的 `generationContract`
- 页型正文：`figma-pages/*.md`
- 表单共享规则：`figma-pages/forms-shared.md`
- 表格共享规则：`figma-pages/table-shared.md`

若本文件与页型专章或 shared 文档冲突，以后者为准。

## 使用顺序

1. 先看 `generation-principles.md` 建立共性生成边界
2. 再看 `page-type-map.md` 判页型
3. 命中现成页型后，再到本文件命中默认 `fileKey` / `nodeId` / 页壳 / 正文入口
4. 再读取 manifest 中的 `generationContract`，形成生成前 brief
5. 再读对应页型专章和 shared 文档
6. 需要速查和跨页陷阱时，再补看 `figma-reference.md`
7. 只有遇到少见边界时，再补看 `figma-page-rules-appendix.md`

## 跨页前置

- 项目画像用于判断目标项目是否需要项目本地兼容桥：不需要时走 `host-integration`，需要时走 `rules-only`；`auto` 会先复用已记录 mode，再做这个判断
- `rules-only` 与 `host-integration` 都使用 `local-managed-runtime` 的受管运行时基线；区别在于是否具备更完整的宿主基线、source assets 与 smoke/doctor 联调治理能力。官方 preview 统一停留在 skill 包内 `preview-runtime/`，不再物化进目标项目
- 已下线历史链路已不属于当前对外模式；如需回溯旧链路，只能通过 git 历史恢复
- `rules-only` 不使用包内 source-template 自动生成链路，也不会同步 route gallery 或宿主桥接文件
- 必须优先从页型规则和 runtime 对照页建立结构，不要从空白文件发明典型页结构
- 外部项目默认只把 `.local-context/hiui-design/` 作为典型页规则、官方母版与运行时参考资产保留在项目中，不把模版页面、路由 gallery 或宿主桥接整包同步进 `src/`
- 外部项目应直接在目标项目既有目录结构中生成业务页，runtime 对照页只作结构和交互对照，不可作为正式输出
- 若多个页型同时出现白卡消失、页头贴边、固定底栏失效、主区白底不延伸等整体失真，先修接入，不要逐页 patch

## 页型注册表

| 页型 | `fileKey` | 默认 `nodeId` | 固定页壳 | 正文入口 | 生成母版 | 业务槽位 | 核心摘要 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 数据统计表 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:107076` | `StatListPageFrame` | `figma-pages/table-stat.md + figma-pages/table-shared.md` | `examples/host-integration/src/pages/table-stat.tsx` | `title`<br>`queryFields`<br>`tableFields`<br>`searchPlaceholder`<br>`overviewRequest`<br>`listRequest`<br>`headerActions`<br>`mockData` | 保持“指标卡 + 筛选 + 表格 + 分页”一体白卡，不要退化成普通列表页 |
| 数据可视化 | `—` | `无独立默认节点` | `StatListPageFrame` | `figma-pages/data-visualization.md + figma-pages/table-shared.md` | `examples/host-integration/src/pages/data-visualization/index.tsx` | `title`<br>`queryFields`<br>`searchPlaceholder`<br>`statSection`<br>`tableFields（按需）`<br>`tableProps（按需）`<br>`listRequest（按需）`<br>`mockData` | 保持“指标卡 + 多图表 + 可选明细表”单白底分析工作区；是否带明细表取决于业务是否需要记录下钻与复核 |
| 普通表格 | `—` | `无独立默认节点` | `TablePageFrame` | `figma-pages/basic-table.md + figma-pages/table-shared.md` | `examples/host-integration/src/pages/basic-table.tsx` | `title`<br>`queryFields`<br>`tableFields`<br>`searchPlaceholder`<br>`listRequest`<br>`headerActions`<br>`mockData` | 延续“筛选 + 表格 + 分页”白卡结构，默认文本列省略并补 Tooltip |
| 树形表格 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:107314` | `TablePageFrame` | `figma-pages/tree-table.md + figma-pages/table-shared.md` | `examples/host-integration/src/pages/tree-table.tsx` | `title`<br>`queryFields`<br>`treeColumn`<br>`tableFields`<br>`listRequest`<br>`mockData` | 树在表格首列内展开，分页保留 |
| 左树右表 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:107202` | `TreeSplitPageFrame` | `figma-pages/tree-split.md + figma-pages/table-shared.md` | `examples/host-integration/src/pages/inventory-split.tsx` | `title`<br>`treeData`<br>`queryFields`<br>`tableFields`<br>`listRequest`<br>`mockData` | 左树右表必须在同一个 split frame 内，不要拆成两个独立页面 |
| 抽屉表单 | `jlYnxIW1FFGG8fK1sVcL5C` | `51728:128145` | `ProFormDrawer` | `figma-pages/drawer-form.md + figma-pages/forms-shared.md` | `examples/host-integration/src/pages/drawer-form.tsx` | `title`<br>`trigger`<br>`formFields`<br>`initialValues`<br>`submitRequest`<br>`mockData` | 字段数 <=16 时使用，正文分档和组规只看专章 |
| 抽屉详情 | `jlYnxIW1FFGG8fK1sVcL5C` | `51728:131344` | `ProDetailDrawer` | `figma-pages/drawer-detail.md` | `examples/host-integration/src/pages/drawer-detail.tsx` | `title`<br>`trigger`<br>`detailFields`<br>`detailRequest`<br>`mockData` | 只读描述项 <=16 时使用，宽度和双列规则只看专章 |
| 全页编辑 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:102808` | `ProEditPage` | `figma-pages/edit.md + figma-pages/forms-shared.md` | `examples/host-integration/src/pages/full-page-edit.tsx` | `title`<br>`onBack（仅二级进入页）`<br>`formFields`<br>`groups`<br>`detailTable`<br>`initialValues`<br>`submitRequest`<br>`draftRequest`<br>`mockData` | 主流程走全页，不走抽屉；头部、滚动区、底栏必须继续留在固定页壳里；可选明细表仍属于同一表单阅读流 |
| 全页详情 | `jlYnxIW1FFGG8fK1sVcL5C` | `52409:60782` | `ProDetailPage` | `figma-pages/detail-group.md` | `examples/host-integration/src/pages/full-page-detail.tsx` | `title`<br>`onBack（仅二级进入页）`<br>`sections`<br>`request`<br>`mockData` | 分组白卡无描边，块间距和长文本占整行等正文只看专章 |
| 异常反馈页 | `—` | `无独立默认节点` | `FeedbackStatusPage` | `figma-pages/feedback-status.md` | `examples/host-integration/src/pages/feedback-status/index.tsx` | `title`<br>`description`<br>`primaryAction`<br>`secondaryActions`<br>`headerActions`<br>`indicator`<br>`variantId`<br>`mockData` | 保持“页头 + 单白底反馈面板 + EmptyState”结构，不要退化成自由公告页 |

## 允许偏离默认规则的场景

- 用户明确提供新的 Figma `nodeId`
- 产品或设计给出书面例外说明
- 目标项目有更高优先级宿主约束，但不影响页壳和页型本身

除以上情况外，一律先按本文件默认注册信息进入对应正文。

若当前需求没有命中本表中的现成页型，不要在这里强行套注册项；应回到 `generation-principles.md`，按最近页壳、规则专章和 runtime 对照页生成。
