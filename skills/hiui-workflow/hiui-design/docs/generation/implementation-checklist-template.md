# 页面生成检查清单模板

这份文件只负责**组合页 / split 页面**的增量实现要求。

它不重复定义：

- 首轮输出字段
- contract 字段
- 非典型页面布局事实
- 交付验收证据

对应事实源如下：

- 首轮输出格式：`ai-kickoff-template.md`
- contract 字段：`../../rules/contract-regions.md`
- 非典型 / overlay 布局事实：`non-typical-pages.md`
- 验收证据：`../../rules/validation-checklist.md`

## 适用场景

命中以下任一场景时，编码前必须先写出本清单，再开始落代码：

- 左列表右详情
- 左树右表
- 数据统计区 + 表格
- 主从布局 + 复杂表格
- 右侧主体区包含 `QueryFilter + Table` 的组合页

默认顺序固定如下：

1. 先用规则确定边界条件
2. 再用参考页决定结构和视觉组织
3. 最后才进入实现

不要反过来先抄参考页宽度常量，再回头补规则。

## 组合页增量 Checklist

基础事实统一来自 kickoff 与 contract；本文件只追加下面 8 个组合页专属检查项，其中第 0、5 项只核对已经锁定的 split 事实，不在这里重写 schema。

### 0. Split Shell Fact Reference Check

- kickoff 与 contract 是否已经锁定唯一的受管 split shell carrier
- 当前实现是否只是引用已锁定的 `shell inheritance strategy` / `shell carrier path`，而不是在 checklist 里再造一套值域
- 左右 pane 与 resize handle 是否仍由已锁定的 carrier / helper 承接
- 右栏复杂内容是否仍然只是 `right-main` 内部 section，而不是成为改壳理由
- 这一项若仍为空，不得开始实现

记录模板：

```md
- split shell reference:
  - kickoff / contract reference:
  - locked shell inheritance strategy:
  - locked shell carrier path:
  - implementation starts from:
  - left/right slot ownership:
  - right-pane customization scope:
```

### 1. 分栏比例

- 左右分栏是否由比例、`flex-basis`、`minmax()` 或可拖拽宽度驱动，而不是写死两栏定宽
- 若 `layout archetype = context-main-split`，左右栏是否默认支持通过分隔条拖拽调整宽度；初始比例是否只作为默认态，而不是不可变死宽
- 若左栏存在默认宽度，是否同时说明它是“默认值”还是“不可突破的固定值”
- 若页面后方还有同级通栏内容，是否已经先定义分栏区的视觉闭合方式

记录模板：

```md
- split ratio:
  - layout model:
  - left default width:
  - resize mode:
  - resize handle selector:
  - right growth rule:
  - closure strategy:
```

### 2. 右栏弹性规则与硬下限例外

- 右栏默认必须是弹性列，而不是硬下限列；默认优先 `minmax(0, 1fr)` 或同等 `flex: 1 1 0% + min-inline-size: 0`
- 若确实存在右栏最小可用宽度，这个硬下限是谁批准的、由什么业务内容决定
- 当容器继续收窄时，优先退让的是哪一层：左栏默认宽度、筛选区、表格内部横向滚动，还是固定列
- 未经明确批准，不要把右栏写成 `minmax(820px/960px, 1fr)` 一类会先把 split workspace 撑破的硬下限

记录模板：

```md
- right pane flex rule:
  - default:
  - hard-min exception:
  - driven by:
  - fallback order:
```

### 3. 表格列宽总账

- 表格可视容器宽度是多少
- 关键列最小宽度总和是多少
- 非关键列是否允许压缩、折叠、省略或进入字段管理
- 表格是否先适配父容器宽度，而不是把父容器撑破
- 当前宽度下若必须依赖横向滚动，滚动 owner 是否明确落在表格内部 wrapper，而不是 `page body / white-body / split workspace / right pane`

记录模板：

```md
- table width budget:
  - container width:
  - key columns total:
  - flexible columns:
  - fit strategy:
  - horizontal scroll owner:
```

### 4. 固定列降级策略

- 固定列是否默认开启
- 在什么宽度条件下启用
- 在什么宽度条件下关闭或降级
- 若关闭固定列，是否仍能保证关键操作列可达

记录模板：

```md
- fixed column strategy:
  - enabled by default:
  - enable threshold:
  - downgrade threshold:
  - fallback interaction:
```

### 5. Split Pane Runtime Verification

- 当前页是否已经引用 contract 中已锁定的 `splitPaneContract`
- 左栏和右栏是否按 contract 默认成为独立滚动 owner
- 若 `layout archetype = context-main-split`，`pane resize = user-resizable` 是否来自已锁定 contract，而不是 checklist 临时决定
- 左栏和右栏是否都通过显式 selector / region marker 暴露出来
- 右栏里的表格是否继续落在 contract 指定的滚动链内，而不是再额外包一层纵向滚动容器
- `page root / split workspace` 是否都保持 `overflow: hidden`，而不是抢走纵向滚动
- 左右 pane 默认不承接横向滚动；不要把 contract 中属于表格 wrapper 的横向滚动升级到 pane 自身

记录模板：

```md
- split pane runtime verification:
  - contract reference:
  - pane resize:
  - resize handle selector:
  - exposed selectors:
  - default scroll ownership:
  - vertical scroll chain:
  - horizontal scroll containment:
```

### 6. Region Spacing / Header Action Ownership

- 若 `content-slot owner = host-slot`，页面根 / `workspace` 是否仍错误承接了通用 `20px` 外层 `padding`
- 左侧搜索 / 筛选区是否只有一个 spacing owner，而不是 `leftQuery / filterRegion` 重复嵌套
- 左栏若直接使用 `SearchInput`，是否已显式覆盖其默认固定宽度并回接 pane 宽度 contract（至少回答 `width: 100% + min-width: 0` 由谁承接）
- 左侧状态筛选是否先区分“状态语义”与“按钮动作”；若只是状态切换，默认继续复用 `Tag` / shared status renderer，再补点击行为，而不是直接回退成 `Button`
- 若需求只说“提供状态标签筛选”但未指定默认激活项，是否保持初始数据全集可见，而不是默认选中第一项造成隐式预过滤
- 右侧详情表格区的局部 inset 是否明确落在真实内容 owner 上，而不是直接贴边
- 页级动作是否已经进入 `PageHeader extra`
- header slot 与 `PageHeader root` 是否共同证明了 `width: 100% + min-width: 0`，从而让 `PageHeader extra` 真正贴右，而不是仍然紧挨标题流动
- 右侧 pane header 是否只保留上下文信息，而不是承接页面主按钮

记录模板：

```md
- region/header ownership:
  - outer shell owner:
  - left query owner:
  - left query width owner:
  - left status semantics:
  - default filter state:
  - right detail/table inset owner:
  - page-level actions owner:
  - page-header stretch owner:
  - pane header scope:
```

### 7. Runtime Smoke Plan

- 当前页是否需要真实浏览器 smoke
- smoke 要验证哪几件真实 DOM 行为
- 页面对应的 route / url 是什么
- 若页面属于 `context-main-split`，至少断言以下 4 项：
  - 左栏滚动时，page root / split workspace 不跟着滚
  - 右栏滚动时，page root / split workspace 不跟着滚
  - page root / split workspace 的计算后 `padding-left/right = 0`，除非 contract 明确指定其它 owner
  - 页级主按钮出现在 `PageHeader extra`，而不是右栏 header

记录模板：

```md
- runtime smoke plan:
  - required:
  - route/url:
  - assertions:
```

## 宽度总账模板

需要更细时，直接按下面格式落盘：

```md
## Width Accounting

- outer container:
- page body usable width:
- left pane default:
- left pane min/max:
- right pane min:
- filter row reserved width:
- table viewport width:
- key columns:
  - column A:
  - column B:
  - column C:
- non-key columns:
  - compressible:
  - hideable:
  - move to setting:
- fixed columns:
  - left:
  - right:
- expected overflow behavior:
```

## 参考实现使用规则

- 参考页只能复用结构、信息分区、组件组合和视觉节奏
- 参考页里的宽度常量、固定列策略、列配置顺序，不得直接照搬
- 若确实沿用参考页的宽度常量，必须补一句“为什么它在当前宿主容器下仍成立”
- 若当前项目已经有可复用的宽度计算 hook、列预算 helper 或固定列策略函数，优先复用共享实现，不要每页单独写一份常量

## 交付说明

- 本文件不定义交付完成标准。
- 组合页的最终验收证据、视口走查与 runtime smoke 是否必须落盘，统一看 `../../rules/validation-checklist.md`。
