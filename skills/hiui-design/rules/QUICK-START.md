# HiUI Design Quick Start

这份文件只负责一件事：把你路由到正确文档。

它不再重复维护：

- 首轮输出字段
- contract 字段定义
- 组合页增量清单
- 页面质量完成定义
- 最终回复前收口动作

对应事实源如下：

- 首轮输出格式：`../docs/generation/ai-kickoff-template.md`
- 生成原则与阶段门槛：`generation-rules.md`
- contract 字段唯一事实源：`contract-regions.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 非典型 / overlay 布局推理：`../docs/generation/non-typical-pages.md`
- 页面质量验收证据与页面完成门槛：`validation-checklist.md`
- `preview_ready` 统计收口与最终回复前动作：`PRIVACY.md`

页面生成阶段默认**读取并确认**项目既有 `mode` 事实；只有项目事实缺失、过期或互相冲突时，才重新判定。

## 默认入口

任何页面生成、重写或大改任务，先按下面顺序进入：

1. 优先执行 `../scripts/plan-page-task.mjs --json`，读取机器计划里的 `taskLevel`、`mode`、`pageType`、`requiredDocs`、`requiredCommands`、`contractFieldsNeeded` 和 `blockingReasons`
2. 若脚本不可执行，才退回手工读取 `mode-selection.md`
3. 继续读 `page-type-map.md`
4. 继续读 `contract-regions.md`
5. 继续读 `generation-rules.md`
6. 继续读 `../docs/generation/ai-kickoff-template.md`

然后再按场景补读专章，而不是整包遍历 `docs/`。

## 按场景最小路径

### 1. 接入项目

- 读 `mode-selection.md`
- 读 `scripts/README.md`
- 根据场景执行 `setup-for-designers.mjs` 或 `apply-in-current-project.mjs`
- 需要排障时，再读 `docs/onboarding/*.md`

### 2. 命中典型页型的页面生成

- 先按 `page-type-map.md` 锁定 `page type`
- 再按 `ai-kickoff-template.md` 输出首轮起手块
- 再按 `generation-rules.md` 进入 `start-page / preflight / finalize-page / runtime smoke` 对应阶段
- 命中页型后只补读当前页型专章、`figma-page-rules.md`、以及必要的 `i18n-baseline.md`

### 3. 未命中典型页型，或典型页型需要 overlay 布局判断

- 保留原 `page type` 结论，或明确“未命中典型页型”
- 读 `../docs/generation/non-typical-pages.md`
- 用该文件判断 `layout strategy`、`layout archetype` 与布局 ownership 语义
- 若所需组件超出 `../docs/hiui-v5-quick-reference.md` 覆盖范围，再补 `../docs/generation/non-typical-component-routing.md` 与 `../docs/generation/hiui-v5-component-map.md`
- 真正的 contract 字段形状仍回到 `contract-regions.md`

### 4. 组合页 / split 页面

- 在 kickoff 与 contract 基础上，额外读 `../docs/generation/implementation-checklist-template.md`
- 它只追加宽度总账、分栏弹性、固定列降级、scroll contract 与 runtime smoke 计划
- 若 `layout archetype = context-main-split`，实现前还要先锁定 `split shell inheritance strategy` 与 `split shell carrier path`
- 若项目里已经存在 `TreeSplitPageFrame`、`ContextMainSplitScaffold` 或宿主 split helper，必须从该受管 split carrier 起步，而不是先手写 `workspace / leftPane / rightPane` 再回头补 marker
- 右栏业务再复杂，也只能在受管 split 壳的 `right-main` 内自由组装；不能因此回退到 `ProDetailPage`、`ProEditPage` 或通用 `page-scroll` 壳

### 5. 交付与验收

- 页面质量验收证据、真实页面核验与页面完成门槛只看 `validation-checklist.md`
- 若当前任务生成或实质性修改了页面，最终回复前还必须按 `PRIVACY.md` 完成统计收口
- 不要回到 kickoff 模板或本文件抄一遍前置字段

## 文档职责图

- `ai-kickoff-template.md`
  只定义“首次回复长什么样”。
- `generation-rules.md`
  只定义原则与阶段门槛。
- `contract-regions.md`
  只定义 contract 字段与 region / ownership / semantic contract。
- `implementation-checklist-template.md`
  只定义组合页增量要求。
- `validation-checklist.md`
  只定义页面质量验收证据与页面完成门槛。
- `PRIVACY.md`
  只定义 `preview_ready` 统计收口与最终回复前动作。
- `non-typical-pages.md`
  只定义非典型 / overlay 布局推理与 archetype 语义。

## 按需补读

- `docs/generation/i18n-baseline.md`
  任何含用户文案、日期、数字、金额、百分比、图表标题或反馈态的页面都补读。
- `docs/generation/figma-page-rules.md`
  命中页型后补读。
- `docs/generation/figma-pages/*.md`
  只读当前命中的页型专章。
- `docs/generation/rules-only-component-matrix.md`
  命中 `rules-only` 时补读。
- `docs/generation/legacy-host-compatibility.md`
  命中旧宿主兼容路径时补读。
- `docs/generation/layout-anti-patterns.md`
  做结构与视觉误区复核时补读。
- `docs/generation/non-typical-component-routing.md` 与 `docs/generation/hiui-v5-component-map.md`
  命中非典型 / overlay 且组件超出最小速查覆盖范围时补读。

## 不要默认读

- `vendor/**`
- `scripts/**` 源码
- `examples/**`

若需要改字段、改 contract 结构、改页面完成门槛或改统计收口流程，直接修改对应 owner 文档，不要在本文件里再复制一套。
