# HiUI 典型页模板基线

走查 **HiUI 模板生成或对齐典型页的页面** 时，先读本文件对应节，再跑通用 checklist。

**策略：Delta 走查** —— 与基线一致的默认实现 **不报**；只报 **相对基线的偏离（deviation）** 与 **业务/数据错误**。

> 当前收录 **HiUI 模板库全部典型页型**（见文末 **页型索引**）。走查时按识别结果读对应节。

---

## 使用方式（阶段 B）

1. **识别 HiUI 上下文**（见下表）
2. **识别页型**：见 **页型索引**；无法确认时标「待确认」，读最接近的一节
3. **对照本节「合规默认」**：命中 → 写入 ignore 或报告「HiUI-合规」，**不上报为 UX 问题**
4. **对照「偏离模式」**：命中 → 正常上报，标题或描述可标 `[HiUI-偏离]`
5. **业务域问题**（数据算错、合规要求与 mock 不同）→ 标 `[业务域]`，不因「模板也这样」而 silence

### HiUI 上下文识别

| 模式 | 识别依据 |
|------|----------|
| `code` | 依赖含 `@hi-ui/hiui`、`@xiaomi/hiui`、`hiui-design`；或典型壳：`ProListPage*` / `ProEditPage*` / **`ProDetailPage*`** / **`ProFormDrawer`** / **`ProDetailDrawer`** |
| `url` | URL 含 `hiui-template` / `hi-template`；或用户声明为 HiUI 典型页 |
| `screenshot` | 对照 [HiUI 模板库](https://hiui-group.github.io/hiui-template/) 对应示例路由（见 **页型索引** · 线上 URL） |

### 页型识别 · basic-table

满足 **多数** 以下条件即可视为 `basic-table`：

- 单列表格 + `QueryFilter` 筛选条（非左树右表、非统计卡片区）
- 页头右侧：**导出**（次要）+ **新增**（primary，常带 `PlusOutlined`）
- 筛选：1 个合并 **SearchInput** + 若干 **Select** + **全部筛选**
- 表格行内 **查看 / 编辑** 双 link 操作列，`fixed: 'right'`

**源码锚点**（官方模板）：`hiui-group/hiui-template` → `src/typical-page-reuse/pages/basic-table.tsx`  
**路由**：`#/examples/table/common/basic`  
**菜单**：侧栏一级「表格」→「基础表格」

---

## basic-table（基础表格）

### 合规默认（与模板一致 → 忽略）

以下在 basic-table 页型下 **不作为 UX 缺陷上报**：

| # | 默认实现 | 关联 checklist | 说明 |
|---|----------|----------------|------|
| B1 | **10 列**数据列（含操作列） | UX-1.2 | 官方模板即 10 列；密度属 B 端屏效设计 |
| B2 | 行内 **查看 + 编辑** 两个 link 按钮 | UX-1.4、UX-2.5 | `appearance="link"` + `type="primary"` 为模板默认 |
| B3 | **1 个**合并关键词搜索框 | UX-1.1、ignore-list §1 | placeholder 多字段（如「用户名称/米聊/电话」）为模板默认 |
| B4 | 行内 Select 筛选项 + **全部筛选** 抽屉 | UX-1.1 | 与 `queryFields` + `FilterDrawer` 同构 |
| B5 | 分页：**共 100 条** mock、**20 条/页**、「前往 N 页」 | — | 模板 mock 总量固定 100，非数据真实性缺陷 |
| B6 | 文本列 **左对齐 + ellipsis + Tooltip** | UX-1.7 | 模板不对手机号/米聊号做右对齐 tabular-nums |
| B7 | **Mock 手机号、邮箱完整明文** | UX-3.2 | 演示数据；见下「敏感信息例外」 |
| B8 | 页头 **导出**（default）+ **新增**（primary）在右上角 | UX-1.1、UX-2.5 | 与 `PageHeaderPortal` + `extra` 一致 |
| B9 | **用户状态** 筛选 + 表格 **用户状态** 列（Tag 色） | — | 筛选与列 **对齐** 为模板基线 |

### 敏感信息例外（UX-3.2）

| 场景 | 处理 |
|------|------|
| HiUI 模板站 / 原型 mock / 用户未声明生产数据 | B7 适用 → **不报** 手机号明文 |
| 用户声明 **生产环境** 或 **HR/财务等合规场景** | **仍报** `[业务域]`，建议脱敏与权限；**不要**写成「违反 HiUI 模板」 |

### 偏离模式（相对 basic-table → 仍应上报）

| # | 偏离 | 严重度参考 | 说明 |
|---|------|------------|------|
| D1 | 筛选项有维度，**表格无对应列** | P1 | 例：筛「在职状态」但表头无状态列；模板 B9 要求对齐 |
| D2 | `PageHeader` 标题与 **菜单/路由 `title` 不一致** | P1 | 例：菜单「数据统计」、页头写「工单数据统计」 |
| D3 | 空数据仍显示分页「共 0 条」 | P1 | 违反 HiUI 桥接：total≤0 时 `pagination: false` |
| D4 | 表格空状态使用 **彩色** EmptyState 插图 | P2 | 模板要求基础 EmptyState |
| D5 | 筛选 **重置无效**（仅清 subscription 未清表单） | P1 | 见 typical-page-patterns 重置语义 |
| D6 | 同应用列表页 **行高 size** 与兄弟页不一致（无书面依据改 sm/lg） | P2 | 默认 `md` |
| D7 | 数值/业务 **展示错误**（如 12/24 显示为 12%） | P0–P1 | `[业务域]`，与模板无关 |

### 判断句

1. 「官方 [基础表格](https://hiui-group.github.io/hiui-template/#/examples/table/common/basic) 是否故意这样？」→ **是** → 不报  
2. 「相对该页型，用户多做了什么 / 少做了什么？」→ **有差异** → 报 deviation  
3. 「即使用户不用 HiUI，也会伤害任务或合规吗？」→ **是** → 报 `[业务域]`

### 走查内部记录（勿写入交付报告）

页型识别与合规/偏离计数仅用于走查阶段去误报；**对话 Markdown 与 docx 均不包含「HiUI 模板对齐」模块**。问题描述中可保留 `[HiUI-偏离]` / `[业务域]` 标签。

---

## full-page-edit（全页编辑）

### 页型识别

满足 **多数** 以下条件即可视为 `full-page-edit`：

- **`ProEditPage` + `ProEditPageProvider`**（或等价全页编辑壳），**非** `Drawer` 承载主表单
- 页头 **`PageHeader` 带返回**（`onBack` / 返回箭头）
- 主体为 **Schema `Form`** + 分组 **`GS` + Card** 或扁平 `fields`（无列表 `Table` / `QueryFilter` 主流程）
- 底部 **`inlineEditFooter`** 固定于视口内主槽底：**取消** + **暂存** + **提交**（整组靠右），**非** `PageFooterPortal`
- 表单项 **常 >10 个**；字段 **>16 仍用全页** 为模板正确分档（**禁止**改用抽屉）

**源码锚点**：`hiui-group/hiui-template` → `src/typical-page-reuse/pages/full-page-edit.tsx`  
**路由**：`#/examples/form/typical/edit`  
**菜单**：侧栏一级「表单」→「全页编辑」  
**Figma 默认**：`51257:102808`（三栏 · 列距 40 · 标签置顶）

### 合规默认（与模板一致 → 忽略）

| # | 默认实现 | 关联 checklist | 说明 |
|---|----------|----------------|------|
| E1 | **字段多、需纵向滚动** | UX-1.2 | 滚动发生在 **`formScrollBody`** 内；**不报**「表单太长一屏放不下」 |
| E2 | 表单 **三栏** + 列间 **约 40px** | UX-1.2 | HiUI 典型编辑页栅格；**不报**「表单项过密/列太多」 |
| E3 | 标签 **`labelPlacement: 'top'`**（控件上方） | UX-1.2 | 与模板/稿一致；**不报**「标签占行高」 |
| E4 | **分组 Card**（`GS` + `CardProps size: 'lg'`）+ 组间 **约 16px** | UX-1.2、UX-2.5 | 如「基础信息 / 客户信息 / 服务信息」多块 |
| E5 | 底栏 **取消 + 暂存 + 提交**，按钮组 **靠右** | UX-1.1、UX-2.5 | 模板 `CancelButton` / `StashButton` / `SubmitButton` |
| E6 | 底栏 **仅 `border-top` + 白底**，**无** `box-shadow` | UX-3.1 | `inlineEditFooter` 禁止投影 |
| E7 | 底栏 **钉在主槽底部**，**不**随表单滚走 | UX-1.1 | `mainContent` **`overflow-y: hidden`**，仅表单区滚 |
| E8 | **长文本 / Textarea / Upload** 占 **整行（span 24）** | UX-1.2 | 如「问题描述」通栏 |
| E9 | 页头 **`onBack`** 返回 | UX-2.4 | 模板 `navigate(-1)` |
| E10 | 页头 **`extra`** 可放次要按钮（如「复制提示词」） | UX-1.4 | 不抢主路径即可 |
| E11 | **Mock 电话等敏感字段明文** | UX-3.2 | 演示数据；见下「敏感信息例外」 |
| E12 | 提交/暂存成功用 **`Message.open`** 反馈 | UX-1.6 | 模板示例行为 |

### 敏感信息例外（UX-3.2）

与 basic-table **B7 同逻辑**：模板站 / 原型 mock → **不报** 表单内手机号明文；**生产 / HR / 财务等合规场景** → **仍报** `[业务域]`。

### 偏离模式（相对 full-page-edit → 仍应上报）

| # | 偏离 | 严重度参考 | 说明 |
|---|------|------------|------|
| ED1 | 字段 **>16** 仍用 **Drawer** 做主编辑 | P0–P1 | 须独立全页路由 + `ProEditPage` |
| ED2 | **缺少** 页头返回 / `backIcon={false}` 盖掉 `onBack` | P1 | Portal 注入时常见陷阱 |
| ED3 | 主表单 **`labelPlacement: 'right'`**（侧标）且无稿面依据 | P1 | 典型页要求 **top** |
| ED4 | 底按钮用 **`PageFooterPortal`** 或底栏 **带阴影** | P1–P2 | 须 `inlineEditFooter` + 无投影 |
| ED5 | **`mainContent` 整页纵滚**，操作条被卷到文档最底 | P1 | 须仅 `formScrollBody` 内滚 |
| ED6 | 表单区出现 **常态横向滚动条** | P1 | 常见原因：`formNormal` 左右 margin + `width:100%` |
| ED7 | **一级分组** Card 标题前 **竖向色块**（色块应仅 **二级** 子分组） | P2 | 见 typical-page-patterns §5 |
| ED8 | `PageHeader` 标题与 **菜单/路由 `title` 不一致** | P1 | 同 basic-table D2 |
| ED9 | 长 Textarea 仅占 **单列宽**，右侧大块留白 | P2 | 应 `MWP({ span: 24 })` |
| ED10 | 无分组却用 **`formNormal`** 作唯一水平留白 | P2 | 应 `flatEditForm`（16px 20px 0） |
| ED11 | 必填项 schema 有 `Required()` 但 UI **无** 必填标识 | P1 | 与模板/Form 规则不一致 |
| ED12 | 数值/业务 **展示或校验错误** | P0–P1 | `[业务域]` |

### 判断句

1. 「官方 [全页编辑](https://hiui-group.github.io/hiui-template/#/examples/form/typical/edit) 是否故意这样？」→ **是** → 不报  
2. 「是否违反 ProEditPage 滚动/底栏/三栏/标签置顶等 P0？」→ **是** → 报 `[HiUI-偏离]`  
3. 「是否生产合规或业务数据错误？」→ **是** → 报 `[业务域]`

### 走查内部记录（勿写入交付报告）

同 basic-table：**不输出**「HiUI 模板对齐」摘要节；仅在 issue 描述中按需标注 `[HiUI-偏离]` / `[业务域]`。

---

## full-page-detail（全页详情）

### 页型识别

- **`ProDetailPage` + `ProDetailPageProvider`**，主体为 **`SchemaGroup` + `G().Descriptions()`**（只读）
- 页头 **`PageHeader` + `onBack`**；**无** 底栏提交条
- **多块分组**（如基础/客户/服务信息），**非** 侧滑 `Drawer` 承载主详情
- 描述项 **常 >16** 或分组多 → **应用全页**（相对抽屉详情分档）

**源码**：`full-page-detail.tsx` · **路由** `#/examples/detail/typical/page` · **菜单** 详情 → 全页详情  
**Figma**：`52409:60782`（**3 列 · 列距 40 · 页头 18px**）

### 合规默认（→ 忽略）

| # | 默认实现 | 关联 checklist | 说明 |
|---|----------|----------------|------|
| F1 | **多块分组** + 组间 **约 16px** | UX-1.2 | `schema-group__container` gap 16 |
| F2 | 每组 **`Descriptions` 3 列**、列距 **约 40** | UX-1.2 | `placement: vertical` · `column: 3` |
| F3 | 标签 **左对齐**、`labelWidth` 约 **114** | UX-1.2 | 与稿一致 |
| F4 | 分组块 **白底圆角、无描边/投影** | UX-3.1 | `borderedGroups: false` 气质 |
| F5 | **长文本**（备注/描述）**独占一行** `colSpan: 3` | UX-1.2 | 勿与短字段并排 |
| F6 | 页头 **`onBack`** + **`extra`** 次要操作（如「查看流程」） | UX-2.4、UX-1.4 | 模板 `navigate(-1)` |
| F7 | 只读字段 **多、信息密度高** | UX-1.2、§1 | B 端详情屏效；**不报**「字段太多」 |
| F8 | Card body 水平 **约 20px**（非 24） | UX-3.1 | 见 `full-page-detail.module.scss` |
| F9 | **Mock 电话等明文** | UX-3.2 | 见「敏感信息例外」 |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 | 说明 |
|---|------|--------|------|
| FD1 | 描述项 **>16** 仍用 **Drawer** | P0–P1 | 须 `navigate` 全页详情 |
| FD2 | **缺少 `onBack`** | P1 | 从列表进入须可返回 |
| FD3 | 全页详情误用 **抽屉档**（2 列·16 / 360·600 抽屉宽） | P1 | 全页须 **3 列·40** |
| FD4 | 分组块 **带描边/投影** | P2 | 典型稿无描边 |
| FD5 | 长文本 **未通栏** `colSpan` | P2 | 三列下应 `colSpan: 3` |
| FD6 | 一级分组标题前 **竖向色块** | P2 | 色块仅二级子分组 |
| FD7 | `PageHeader` 与 **菜单 title 不一致** | P1 | 同 D2 |
| FD8 | 业务 **展示错误** | P0–P1 | `[业务域]` |

### 判断句

1. [全页详情](https://hiui-group.github.io/hiui-template/#/examples/detail/typical/page) 是否故意这样？→ **是** → 不报  
2. 是否混用抽屉详情量纲（2 列·16）或 >16 仍抽屉？→ **是** → `[HiUI-偏离]`  
3. 生产合规 / 数据错误？→ `[业务域]`

---

## drawer-form（抽屉表单）

### 页型识别

- **`Drawer` / `ProFormDrawer`** 承载 **可编辑 Form**（非只读 `Descriptions`）
- 表单项 **≤16**（模板示例 **10 项**）；**>16 禁止抽屉**，须全页编辑
- **`SchemaForm`** + `grid` · **`labelPlacement: 'top'`** · 底栏 **取消 + 确认**（靠右）
- 抽屉内 **不用 Card 包分组**、**无** 组间分割线（`borderedGroups: false`）

**源码**：`drawer-form.tsx` · **路由** `#/examples/form/typical/drawer` · **菜单** 表单 → 抽屉表单  
**Figma**：`51728:128145`

### 字段分档（合规宽度，勿与全页三栏混用）

| 字段数 | 布局 | Drawer 宽度 |
|--------|------|-------------|
| **1～9** | **单列** | **360** |
| **10～16**（含 10、16） | **双列**，列间 **32**，**`rowGap: 0`** | **600** |
| **>16** | — | **禁止抽屉** → 全页编辑 |

模板示例：10 字段 · **2 列 · gutter 32 · rowGap 0 · width 600** · 备注 `span: 24`。

### 合规默认（→ 忽略）

| # | 默认实现 | 关联 checklist | 说明 |
|---|----------|----------------|------|
| W1 | **≤16 字段** 用抽屉（非全页） | UX-1.2 | 分档正确即合规 |
| W2 | 标签 **置顶** `labelPlacement: 'top'` | UX-1.2 | |
| W3 | **`Grid.Row` `rowGap: 0`**（含单列） | UX-1.2 | 库默认 16 须显式清零 |
| W4 | **无 Card 分组**、组间 **无间隙/分割线** | UX-2.5 | 抽屉分组规则 |
| W5 | **仅 1 个逻辑分组时不展示** 组内大标题 | UX-1.2 | `Drawer.title` 已说明场景 |
| W6 | 底栏 **取消 + 确认** 靠右；**无** footer 顶线/投影 | UX-3.1 | 覆盖 `__footer--divided` |
| W7 | Textarea **通栏** `span: 24` | UX-1.2 | |
| W8 | **Mock 电话明文** | UX-3.2 | 见「敏感信息例外」 |
| W9 | 提交成功 **`Message.open`** | UX-1.6 | |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 | 说明 |
|---|------|--------|------|
| WD1 | **>16 字段**仍用抽屉 | P0–P1 | 须全页编辑 |
| WD2 | **`rowGap` 未置 0**（行距叠加） | P1 | Grid 默认 16px |
| WD3 | **`labelPlacement: 'right'`** | P1 | 抽屉/全页均须 top |
| WD4 | 抽屉内用 **Card 包分组** 或 **Divider** | P1–P2 | |
| WD5 | **footer 顶部分割线/阴影**未覆盖 | P2 | `__footer--divided` |
| WD6 | 宽度与分档不符（如 10 字段却 **360 单列**） | P1 | 见分档表 |
| WD7 | 误套 **全页三栏 40px** 到抽屉 | P1 | |
| WD8 | 业务校验/数据错误 | P0–P1 | `[业务域]` |

### 判断句

1. [抽屉表单](https://hiui-group.github.io/hiui-template/#/examples/form/typical/drawer) + 字段分档是否一致？→ **是** → 不报  
2. 是否 >16 仍抽屉 / rowGap 未 0 / Card 分组？→ `[HiUI-偏离]`  
3. 生产合规？→ `[业务域]`

---

## drawer-detail（抽屉详情）

### 页型识别

- **`ProDetailDrawer` / `Drawer`** 承载 **只读 `Descriptions`**（非 Form）
- 描述项 **≤16**（模板 **10 项**）；**>16 须全页详情**
- 内容区 **无外层 Card**；`placement: vertical` · 标签 **左对齐**
- 列表嵌套场景：**`showMask: false`** · **`maskClosable: false`**（列表仍可见）

**源码**：`drawer-detail.tsx` · **路由** `#/examples/detail/typical/drawer` · **菜单** 详情 → 抽屉详情  
**Figma**：`51728:131344`

### 字段分档（合规，勿与全页 3 列·40 混用）

| 描述项数 | 布局 | Drawer 宽度 |
|----------|------|-------------|
| **1～9** | **`column: 1`** | **360** |
| **10～16**（含 10、16） | **`column: 2`** · **`columnGap: 16`** | **600** |
| **>16** | — | **禁止抽屉** → 全页详情 |

模板示例：10 项 · **2 列 · 600 宽** · 备注 **`colSpan: 2`** 通栏。

### 合规默认（→ 忽略）

| # | 默认实现 | 关联 checklist | 说明 |
|---|----------|----------------|------|
| V1 | **≤16 项** 用抽屉详情 | UX-1.2 | |
| V2 | 抽屉标题 **16px**（非全页 18px） | UX-3.1 | |
| V3 | 内容区 **padding 约 12/20/20**；**无 Card 外壳** | UX-1.2 | |
| V4 | **`Descriptions` vertical + label 左对齐** | UX-1.2 | vertical+unset 时须 CSS 覆盖 `th` |
| V5 | **≥2 逻辑分组** 才展示组内块标题（16px/500）；**仅 1 组不展示** | UX-1.2 | |
| V6 | 长文本项 **`colSpan` = 当前 column** | UX-1.2 | 双列下 `colSpan: 2` |
| V7 | 列表嵌套 **无遮罩**（`showMask: false`） | UX-2.4 | 模板列表+Outlet 场景 |
| V8 | **Mock 电话明文** | UX-3.2 | 见「敏感信息例外」 |
| V9 | 加载态 **`Loading`** 包裹内容 | UX-1.5 | |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 | 说明 |
|---|------|--------|------|
| VD1 | **>16 项**仍用抽屉 | P0–P1 | 须全页详情 |
| VD2 | 误用 **全页 3 列·40 / 18px 页头** | P1 | |
| VD3 | 内容外包 **Card** | P2 | 典型抽屉详情无 Card |
| VD4 | 标签 **`th` 居中**（未左对齐） | P1 | vertical+unset 陷阱 |
| VD5 | 宽度/列数与 **分档表** 不符 | P1 | |
| VD6 | **仅 1 组**却展示组内分组标题 | P2 | |
| VD7 | 列表嵌套抽屉 **强遮罩** 挡列表（产品未要求） | P2 | 典型为无遮罩 |
| VD8 | 切换行 **先关再开**、数据 **不随 id 刷新** | P1 | 列表嵌套 P0 |
| VD9 | 业务展示错误 | P0–P1 | `[业务域]` |

### 判断句

1. [抽屉详情](https://hiui-group.github.io/hiui-template/#/examples/detail/typical/drawer) + 分档是否一致？→ **是** → 不报  
2. 是否 >16 仍抽屉 / 3 列·40 / Card 外包？→ `[HiUI-偏离]`  
3. 生产合规？→ `[业务域]`

---

### 敏感信息例外（详情/抽屉共用）

与 basic-table **B7** 相同：模板站 / mock → **不报** 电话明文；**HR/生产/合规** → **仍报** `[业务域]`。

### 跨页型分档速查（走查时勿混用）

| 场景 | 载体 | 列/宽 |
|------|------|--------|
| 编辑 **>16 字段** | 全页 `ProEditPage` | 三栏 · 40 |
| 编辑 **≤16 字段** | 抽屉表单 | 见 drawer-form 分档 |
| 只读 **>16 项** | 全页 `ProDetailPage` | 3 列 · 40 |
| 只读 **≤16 项** | 抽屉详情 | 见 drawer-detail 分档 |

---

## table-stat（数据统计表）

### 页型识别

- **`StatListPageFrame` / `pro-stat-page`** + 顶部 **`StatOverviewGrid` 指标卡**
- 纵向顺序：**指标卡 → 筛选 → 表格 → 分页**（同壳 `ProListPageProvider`）
- 页头区背景常为 **`#F5F8FC`**，主内容 **白底一体** 向下铺满
- **无** 左树；**有** 统计卡（与 `basic-table`、左树右表区分）

**源码**：`table-stat.tsx` · **路由** `#/examples/table/common/table-stat` · **菜单** 表格 → 数据统计表  
**Figma**：`51257:107076`

### 合规默认（→ 忽略）

| # | 默认 | 说明 |
|---|------|------|
| S1 | 顶部 **多块指标卡**、卡片行 **gap 12** | 不报「统计区占屏」 |
| S2 | 指标卡 **仅名称+主值**（默认 **无** 同环比） | 无书面要求时不报「缺少环比」 |
| S3 | 筛选区 **padding 16px 20px**（非普通列表 20/20/16/20） | 统计页专用节奏 |
| S4 | 合并 **SearchInput** + Select/DateRange + **全部筛选** | 同 basic-table B3/B4 |
| S5 | 表格 **多列指标**（如 9 列业务量） | 继承 B 端屏效；**不报**列过多 |
| S6 | **`size="md"`**、默认 **无斑马纹**、分页与同壳 `table-normal` 一致 | |
| S7 | 页头 **导出**（+ 模板 **刷新** 等次要按钮） | |
| S8 | Mock **total 100 / 20 条/页** | 同 B5 |
| S9 | 文本列 **ellipsis**；空表 **无分页** + 基础 **EmptyState** | 同 basic-table 表格 P0 |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 |
|---|------|--------|
| SD1 | 白卡 **未铺满**主槽、下方 **露灰底** | P1 |
| SD2 | 表体 **无法滚动**（缺 `maxHeight` 链 / `pro-stat-page` 布局） | P1 |
| SD3 | **`maxHeight` 模式**误传 `stickyTop={filterHeight}` 致表头错位 | P1 |
| SD4 | 统计页筛选 **16/20** 与左树右表混用，或 **仅统计页** 改 `queryFields` 外观致 **全部筛选抽屉** 与兄弟列表不一致 | P1–P2 |
| SD5 | 指标卡用 **彩色**插图或名称/主值 **错误间距**（违背稿面 P0） | P2 |
| SD6 | 表格空态用 **COLORFUL** EmptyState | P2 |
| SD7 | 页头 title 与 **菜单 title** 不一致 | P1 |
| SD8 | 业务指标 **算错/口径错** | P0–P1 `[业务域]` |

---

## tree-table（树形表格）

### 页型识别

- **`TablePageFrame` + `Table`**，数据为 **`children` 树形行**
- 首列 **树开关 + 名称**（`renderTreeName` · **`treeSwitcherCol`**）
- 行内操作为模板默认（如 **编辑 + 子部门** 双 link，**非** basic-table 的查看/编辑）
- **无** 左侧独立 Tree 面板（与左树右表区分）

**源码**：`tree-table.tsx` · **路由** `#/examples/table/common/tree` · **菜单** 表格 → 树形表格  
**Figma**：`51257:107314`

### 合规默认（→ 忽略）

| # | 默认 | 说明 |
|---|------|------|
| TT1 | 树形 **多级展开**、首列 **较宽**（如 360） | |
| TT2 | 首列 **flex 对齐**开关与文案（模板 `treeSwitcherCol`） | 不报「树列排版」除非子行空白/错行 |
| TT3 | 行内 **双 link 操作**（编辑/子部门等） | 同 B2 精神 |
| TT4 | 合并搜索 + 行内 Select + **全部筛选** | |
| TT5 | 底部分页 **须可见**（**勿** `autoHide: true` 致根节点少时分页消失） | 模板 `total=countTreeNodes` |
| TT6 | **`size="md"`** · **resizable** · 空表无分页 | 同表格 P0 |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 |
|---|------|--------|
| TD1 | 子层级 **只见箭头不见名称** / 图标与文案 **错行** | P0–P1 |
| TD2 | **`pagination.autoHide: true`** 致 **分页整段消失** | P1 |
| TD3 | 首列仅用默认字符串 **无** `treeSwitcherCol` + ellipsis | P1 |
| TD4 | 树表误用 **左树右表** 布局或统计卡 | P1 |
| TD5 | 筛选列与表格列 **不对齐** | P1 |
| TD6 | 业务树数据 **错误** | P1 `[业务域]` |

---

## tree-split（左树右表）

### 页型识别

- **`TreeSplitPageFrame` / `pro-tree-split-page`**：**左 Tree + 右** `QueryFilter` + `Table`
- 树顶 **独立 SearchInput**（过滤树节点）；右侧 **合并搜索** 过滤表格
- 树列 **约 200px** + **Splitter** 可调；树选中 **驱动**右侧列表（模板 `treeCategoryRef`）
- **无** 指标卡；筛选 **padding 20/20/16/20**（**同 table-normal，非 table-stat**）

**源码**：`inventory-split.tsx` · **路由** `#/examples/table/common/split` · **菜单** 表格 → 左树右表  
**Figma**：`51257:107202`

### 合规默认（→ 忽略）

| # | 默认 | 说明 |
|---|------|------|
| RS1 | **左树 + 右表** 分栏；外槽 **#F5F8FC**、主区 **白卡上圆角 12** | |
| RS2 | 树搜索与表搜索 **分离**（两个 SearchInput） | 不报「搜索框重复」 |
| RS3 | 树选中 **刷新**右侧表（与右侧筛选项 **无默认联动** 亦合规） | |
| RS4 | 右侧 **9 列**左右 + 单 link **查看** | 屏效默认 |
| RS5 | 合并表搜 + Select + **全部筛选** + 标准分页 | 同 basic-table |
| RS6 | **`size="md"`** · 空表无分页 · 基础 EmptyState | |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 |
|---|------|--------|
| RD1 | 误用 **table-stat 筛选 16/20** 或 **指标卡** | P1 |
| RD2 | 树搜索 **width:100% CSS 无效** 导致树顶搜索 **过窄/不可用** | P1 |
| RD3 | 表格外包 **`overflow-y:auto`** 致 **双表头错位** | P1 |
| RD4 | **无 Splitter** 且产品要求可调（稿面 P0） | P2 |
| RD5 | 树选中与表数据 **未联动**（产品声明须联动时） | P1 `[业务域]` |
| RD6 | 同 TD1 树表首列问题（若右表为树形数据） | P1 |

---

## data-visualization（数据可视化）

### 页型识别

- **`StatListPageFrame`** + **多图表区**（折线/柱/饼/仪表盘等）+ 底部 **洞察表格**
- **`ProListPageProvider`**；筛选 + 表格与 **table-stat 同壳气质**
- 路由在 **图表** 菜单下（非纯 table-stat，但结构相近）

**源码**：`data-visualization.tsx` · **路由** `#/examples/chart/common/data-visualization` · **菜单** 图表 → 数据可视化

### 合规默认（→ 忽略）

| # | 默认 | 说明 |
|---|------|------|
| DV1 | **一屏多图 + 指标卡 + 表格**，信息密度高 | 不报「图表太多/太乱」 |
| DV2 | 迷你 **sparkline / 小图** 嵌在指标卡 | |
| DV3 | 图表使用 **HiUI 主题色板**（`hiui-chart-theme`） | 不报「颜色不统一」除非偏离品牌 |
| DV4 | 底部表格 **6～7 列** + 分页 + 合并搜索 | 同列表屏效 |
| DV5 | 筛选 **DateRange** + Select + **queryFilter*Overlay** | 同 table-stat |
| DV6 | Mock 数据 / 示例文案 | 非 `[业务域]` 除非用户声明生产 |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 |
|---|------|--------|
| DDV1 | 图表 **无标题/图例** 且无法读懂维度（非模板默认可读场景） | P1 |
| DDV2 | 布局 **重叠/截断**、图表容器 **无 min-width:0** 致横滚 | P1 |
| DDV3 | 与 **table-stat** 混用筛选 padding 或 **缺** 表体滚动链 | P1 |
| DDV4 | 表格区违背表格 P0（彩色空态、空表仍分页等） | P1–P2 |
| DDV5 | 指标 **业务口径错误** | P0–P1 `[业务域]` |

---

## exception-page（异常页）

涵盖模板 **异常** 菜单下 7 种示例（结构同壳，插图/文案不同）：

| 子类型 | 路由 suffix | 典型标题 |
|--------|-------------|----------|
| `empty-state` | `feedback/empty-state` | 暂无数据 |
| `load-fail` | `feedback/load-fail` | 加载失败 |
| `page-not-found` | `feedback/page-not-found` | 页面不存在 |
| `no-permission` | `feedback/no-permission` | 暂无权限 |
| `network-error` | `feedback/network-error` | 网络异常 |
| `under-construction` | `feedback/under-construction` | 页面建设中 |
| `intranet-offline` | `feedback/intranet-offline` | 未连接内网 |

**源码**：`empty-state.tsx` 等 · **菜单** 异常 → 各子页

### 页型识别

- 外背景 **`#F5F8FC`**；内容 **白面板**（**12px 圆角 · 1px #EDEFF2**）**居中**
- **`EmptyState`** + **自定义线稿插图**（约 **100×100**）+ **标题 16/500** + **说明 14px**
- 说明内 **蓝色链接**（`#2660FF`）；底部 **居中按钮组**（重试/返回/申请等）
- 仍保留 **`PageHeader` + extra 演示按钮**（模板示例行为）

### 合规默认（→ 忽略）

| # | 默认 | 说明 |
|---|------|------|
| X1 | **单焦点**异常反馈（一标题 + 一说明 + 一组操作） | 不报「页太空」 |
| X2 | 页头 **次要+主操作** 仅为模板演示 | 不报「无关按钮过多」 |
| X3 | 各异常 **专用 SVG 插图**（非表格 `<EmptyState />` 默认灰图） | 异常页允许场景化插图 |
| X4 | 文案 **简短** + 链式引导（如「联系管理员」） | |
| X5 | 按钮 **居中**排列 | |

### 偏离模式（→ 仍报）

| # | 偏离 | 严重度 |
|---|------|--------|
| XD1 | **无**主路径按钮（重试/返回/申请/创建等） | P1 |
| XD2 | 异常类型与 **文案/插图** 明显不符（如 404 页写「加载失败」） | P1 |
| XD3 | **无**说明文字、仅图标 | P1 |
| XD4 | 把 **表格 COLORFUL EmptyState** 规则套到异常页导致误报 | —（走查侧 **勿报** 异常页插图「不够基础」） |
| XD5 | 真实 **故障无恢复指引**（生产场景） | P1 `[业务域]` |

---

## 页型索引

| page_template | 线上 URL |
|---------------|----------|
| `basic-table` | [#/examples/table/common/basic](https://hiui-group.github.io/hiui-template/#/examples/table/common/basic) |
| `table-stat` | [#/examples/table/common/table-stat](https://hiui-group.github.io/hiui-template/#/examples/table/common/table-stat) |
| `tree-table` | [#/examples/table/common/tree](https://hiui-group.github.io/hiui-template/#/examples/table/common/tree) |
| `tree-split` | [#/examples/table/common/split](https://hiui-group.github.io/hiui-template/#/examples/table/common/split) |
| `full-page-edit` | [#/examples/form/typical/edit](https://hiui-group.github.io/hiui-template/#/examples/form/typical/edit) |
| `drawer-form` | [#/examples/form/typical/drawer](https://hiui-group.github.io/hiui-template/#/examples/form/typical/drawer) |
| `full-page-detail` | [#/examples/detail/typical/page](https://hiui-group.github.io/hiui-template/#/examples/detail/typical/page) |
| `drawer-detail` | [#/examples/detail/typical/drawer](https://hiui-group.github.io/hiui-template/#/examples/detail/typical/drawer) |
| `data-visualization` | [#/examples/chart/common/data-visualization](https://hiui-group.github.io/hiui-template/#/examples/chart/common/data-visualization) |
| `exception-page` | [#/examples/feedback/empty-state](https://hiui-group.github.io/hiui-template/#/examples/feedback/empty-state)（同壳见 §exception-page 子类型） |

**code 识别补充**：`ProStatPage` / `StatListPageFrame` → stat 或 visualization；`TreeSplitPageFrame` → tree-split；树形 `children` 数据 + 无左栏 Tree → tree-table；`EmptyState` 居中整页 + `#F5F8FC` 外槽 → exception-page。
