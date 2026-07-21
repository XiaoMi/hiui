<!-- Generated from rules/common.page-types.json by scripts/sync-manifest-docs.mjs. -->
<!-- Do not edit page-type facts directly in this file. Canonical machine facts live in rules/common.page-types.json. -->
<!-- Rules version: 1.0.7 (2026-07-21). -->

# 当前项目 Figma 典型页注册总表

## 这份文件负责什么

这份文件只负责维护下面这些“注册信息”：

- 默认 `fileKey`
- 默认 `nodeId`
- 固定页壳
- 对应正文入口
- 每个页型的一句核心摘要

这是一份由 `common.page-types.json` 派生的展开说明，不是独立权威源。

## 这份文件不负责什么

- 不维护分档表
- 不维护具体 spacing / padding / 列数 / 宽度正文
- 不维护失败信号、自检清单、长篇禁止项

这些内容统一去看：

- AI 默认规则：`../../rules/generation-rules.md`
- 机读事实来源：`../../rules/common.page-types.json`
- 页型正文：`figma-pages/*.md`
- 表单共享规则：`figma-pages/forms-shared.md`
- 表格共享规则：`figma-pages/table-shared.md`

若本文件与页型专章或 shared 文档冲突，以后者为准。
本文件中的“默认规则”仅指注册信息默认值；页型专章与 shared 文档中的页面生成视觉、框架、交互约束仍按硬门槛执行。

## 非典型 / Overlay 路径

若页面未命中现成典型页型，或仍命中典型页型但内部一级分组需要额外布局判断，不要在本文件里继续定义 `layout strategy` 或 `layout archetype`。

统一做法：

1. 先保留当前 `page type` 结论，或明确“未命中典型页型”
2. 再读 `non-typical-pages.md`
3. 由该文档负责 `layout strategy`、`layout archetype` 与布局 ownership 的解释


## 使用顺序

1. 先看 `../../rules/generation-rules.md` 建立共性生成边界
2. 再看 `../../rules/page-type-map.md` 判页型
3. 命中现成页型后，再到本文件命中默认 `fileKey` / `nodeId` / 页壳 / 正文入口
4. 再读对应页型专章和 shared 文档
5. 需要速查和跨页陷阱时，再补看 `figma-reference.md`
6. 只有遇到少见边界时，再补看 `figma-page-rules-appendix.md`

## 跨页前置

- 对 `host-integration`、现代 `rules-only` 或 `isolated-standard-shell`，必须优先复用 `@hiui-design/typical-page-shells`
- 若目标项目主树处于 `legacy-host-compatible`（旧宿主桥接接入模式），普通典型页仍优先遵循 `page-component + runtimeAdapterProof` 主链路；只有宿主已证明可直接承载，或另行隔离现代运行时入口时，才直接落标准壳运行时
- 必须优先从示例页起步，不要从空白文件发明典型页结构
- 外部项目默认只把 `.local-context/hiui-design/` 作为规则能力保留在项目中，不把模版页面、路由 gallery 或宿主桥接整包同步进 `src/`
- 外部项目应直接在目标项目既有目录结构中生成业务页，并用 `examples/host-integration/src/pages/*` 作为参考示例
- 若多个页型同时出现白卡消失、页头贴边、固定底栏失效、主区白底不延伸等整体失真，先修接入，不要逐页 patch

## 页型注册表

| 页型 | `fileKey` | 默认 `nodeId` | 固定页壳 | 正文入口 | 核心摘要 |
| --- | --- | --- | --- | --- | --- |
| 数据统计表 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:107076` | `StatListPageFrame` | `figma-pages/table-stat.md + figma-pages/table-shared.md` | 保持“指标卡 + 筛选 + 表格 + 分页”一体白卡，不要退化成普通列表页 |
| 数据可视化 | `—` | `无独立默认节点` | `StatListPageFrame` | `figma-pages/data-visualization.md + figma-pages/table-shared.md` | 保持“指标卡 + 多图表 + 明细表”一体白底工作区，不退化成普通统计表或自由拼图表墙 |
| 普通表格 | `—` | `无独立默认节点` | `TablePageFrame` | `figma-pages/table-shared.md` | 延续“筛选 + 表格 + 分页”白卡结构，默认文本列省略并补 Tooltip |
| 树形表格 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:107314` | `TablePageFrame` | `figma-pages/tree-table.md + figma-pages/table-shared.md` | 树在表格首列内展开，分页保留 |
| 左树右表 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:107202` | `TreeSplitPageFrame` | `figma-pages/tree-split.md + figma-pages/table-shared.md` | 左树右表必须在同一个 split frame 内，不要拆成两个独立页面 |
| 抽屉表单 | `jlYnxIW1FFGG8fK1sVcL5C` | `51728:128145` | `ProFormDrawer` | `figma-pages/drawer-form.md + figma-pages/forms-shared.md` | 字段数 <=16 时使用，正文分档和组规只看专章 |
| 抽屉详情 | `jlYnxIW1FFGG8fK1sVcL5C` | `51728:131344` | `ProDetailDrawer` | `figma-pages/drawer-detail.md` | 只读描述项 <=16 时使用，宽度和双列规则只看专章 |
| 异常反馈页 | `—` | `无独立默认节点` | `FeedbackStatePanel` | `figma-pages/feedback.md` | 保持“页头 + 单一白底反馈面板 + 居中反馈内容”结构，不误用表格、表单或详情壳层 |
| 全页编辑 | `jlYnxIW1FFGG8fK1sVcL5C` | `51257:102808` | `ProEditPage` | `figma-pages/edit.md + figma-pages/forms-shared.md` | 主流程走全页，不走抽屉；头部、滚动区、底栏必须继续留在固定页壳里 |
| 全页详情 | `jlYnxIW1FFGG8fK1sVcL5C` | `52409:60782` | `ProDetailPage` | `figma-pages/detail-group.md` | 分组白卡无描边，块间距和长文本占整行等正文只看专章 |

## 允许偏离默认注册信息的场景

- 用户明确提供新的 Figma `nodeId`
- 产品或设计给出书面例外说明
- 目标项目有更高优先级宿主约束，但不影响页壳和页型本身

除以上情况外，一律先按本文件默认注册信息进入对应正文。
上面的偏离仅适用于 `fileKey`、`nodeId`、示例起点等注册信息；不构成放宽页壳语义、视觉节奏、框架语义或交互语义的授权。

若当前需求没有命中本表中的现成页型，不要在这里强行套注册项；应回到 `../../rules/generation-rules.md`，按最近页壳和示例页生成。
