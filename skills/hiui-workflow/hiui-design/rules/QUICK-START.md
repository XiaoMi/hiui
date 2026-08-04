# HiUI Design Quick Start

这份文件只负责一件事：把你路由到正确文档。

它不再重复维护：

- 首轮输出字段
- contract 字段定义
- 组合页增量清单
- 页面质量完成定义
- 最终回复前收口动作

对应事实源如下：

- 轻量场景路由：`scenario-routing.json`
- 首轮输出格式：`../docs/generation/ai-kickoff-template.md`
- 生成原则与阶段门槛：`generation-rules.md`
- contract 字段唯一事实源：`contract-regions.md`
- 组合页增量要求：`../docs/generation/implementation-checklist-template.md`
- 非典型 / overlay 布局推理：`../docs/generation/non-typical-pages.md`
- 页面质量验收证据与页面完成门槛：`validation-checklist.md`
- usage 收口策略与最终回复前动作：`PRIVACY.md`

页面生成阶段默认**读取并确认**项目既有 `mode` 事实；只有项目事实缺失、过期或互相冲突时，才重新判定。若 doctor 或 host-profile 重新检测出不同建议，只作为诊断信号，不得覆盖 project mode lock。

## Lightweight Public Surface

默认项目面不再承载旧 managed-page 写链路；默认公开执行面以 `scenario-routing.json` 为准：`typical-page:init` -> `typical-page:generate` / `typical-page:analytics` -> `typical-page:verify` -> `typical-page:verify:visual`。原型图 / 旧系统升级也先识别页型，再进入同一轻量命令面。

未接入先做什么：先运行 `apply-in-current-project.mjs` 或 `setup-for-designers.mjs` 完成 `.local-context/hiui-design/`、脚本表和项目 mode lock；未完成接入的目标项目不会注册 `typical-page:init / generate / analytics / verify / verify:visual`。

数据可视化的最小命中文档集是 `data-visualization.md + table-shared.md + hiui5-visual-baseline.md`，执行顺序是 `brief qualification -> business semantic match -> chart usage contract`，并在 `analyticsArtifacts.kickoffFacts`、`deliveryState=result-ready`、`deliveryState / deliveryReadiness` 与 `deliveryReadiness.bindingReady.status=pending` 中保留可检查状态。高价值页面补跑 `verify:visual -- --page-path <page-dir>`。

## 示例基线

- `src/typical-page-reuse/**` 只作为示例 gallery / smoke baseline 资产，不是业务受管页面。
- `.local-context/hiui-design/reference/host-integration/src/**` 是项目本地参考事实，不是要同步到业务路由的页面目录。

## 项目根与 Plan Gateway

- 页面任务必须先定位目标项目根目录。目标项目根目录应同时具备 `package.json` 与 `.local-context/hiui-design/`；父级工作区、比赛目录、多项目容器都不能直接当作页面命令的 cwd。
- 默认机器入口是目标项目根的 `npm run typical-page:plan-page-task -- --json ...`。该入口是页面任务的 Plan Gateway，不是可选建议。
- 若旧项目暂未注册 npm script，使用 `node ".local-context/hiui-design/scripts/plan-page-task.mjs" --json ...`。执行成功后，后续应通过 `typical-page:apply` / `typical-page:designer-setup` 或手工补 script 修复项目脚本表。
- 只有维护 skill 源码、跑 skill 自身测试或构建发布包时，才使用 skill 根目录下的 `scripts/plan-page-task.mjs`。不要把 skill 仓库路径写进目标项目页面交付流程。
- Plan Gateway 失败时必须 fail closed：不能凭记忆或截图手工组装 `mode`、`pageType`、`startFrom`、`requiredDocs`、`requiredCommands`。先修 cwd、脚本入口或缺失事实；修不了才进入本文件的手工兜底顺序。
- 若计划目标页落在 `src/typical-page-reuse/**`，必须视为示例 gallery / smoke baseline 资产，而不是业务受管页面。不要补 contract 或 marker；改为生成到 `src/pages/<business-page>/index.jsx|tsx`、`src/views/<business-page>/index.tsx` 等真实业务目录。

## 默认入口

任何页面生成、重写或大改任务，先按下面顺序进入：

1. 优先在目标项目根执行 `npm run typical-page:plan-page-task -- --json`，读取机器计划里的 `taskLevel`、`projectMode` / `mode`、`topology`、`intentUnits`、`pageUnits`、`pageType`、`pageTypeDocs`、`generationStrategy` / `generationStrategyId`、`primaryGenerationAsset`、`fallbackGenerationAsset`、`customizationLevel`、`analyticsContractRequired`、`visualBaselinePlan`、`visualizationRolePlan`、`visualizationRolePlan.chartSectionLayoutPlan`、`writeScope`、`deliverySummaryProfile`、`startFrom` 兼容字段、`fastPath`、`i18nMode`、`requiredDocs`、`requiredCommands`、`formalAcceptanceCommands`、`contractFieldsNeeded` 和 `blockingReasons`；其中 `requiredDocs` 现在是 `{ path, readMode, reason }[]`，先读 `readMode=required`，`reference` / `conditional` 只按需补读；`mode` 应来自 project mode lock / bootstrap summary 的确认结果，只有缺失或冲突时才重新判定
2. 若 npm script 缺失，执行 `node ".local-context/hiui-design/scripts/plan-page-task.mjs" --json`，并把缺失 script 视为项目接入待修复项
3. 若 `.local-context/hiui-design/scripts/plan-page-task.mjs` 不存在或不可执行，才退回手工读取 `mode-selection.md`
4. 继续读 `page-type-map.md`
5. 继续读 `contract-regions.md`
6. 继续读 `generation-rules.md`
7. 继续读 `../docs/generation/ai-kickoff-template.md`

然后再按场景补读专章，而不是整包遍历 `docs/`。

若 `taskLevel=minor-edit`，按 `generationStrategy=reuse-existing-contract-for-minor-edit` 执行：只复用既有 contract 做局部修改，不重新展开完整页型生成、模板选择或 runtime smoke 链路。

## 已锁定 mode 后的页面生成路径

本节只描述项目 mode 已由 `project-mode.json`、bootstrap summary 或 `plan-page-task` 读取并确认后的页面生成路径，不负责项目接入模式选择。mode 缺失、过期或互相冲突时，必须先回到 `mode-selection.md` 补齐项目画像与接入判定；不得把 `rules-only` 当作 `greenfield` 新项目的 fallback、快捷接入或 reference-assets 降级路径。

这条路径的目标不是“少读规则但多赌运气”，而是把 planner 已确认的 `page-component`、carrier、slot 与页面生成资产事实直接转成最小执行面。命中普通典型页页面生成路径时，Agent 默认只消费机器计划、当前页 scaffold、slot contract 与最少补读文档；除非计划显式升级，否则不要手工重开完整治理文档。

当机器计划已经读取并确认：

- `mode` 为 `host-integration`、`rules-only`、`legacy-host-compatible`，或项目内把兼容接入称为 `host-compatible`
- `topology` 为 `single-typical-page`，且 `pageType` 命中一个既有典型页型；或 `topology` 为 `multi-page-workflow`，且每个 `pageUnits[].pageType` 都命中既有典型页型
- 没有特殊布局、跨页型组合、非典型 section、复杂图表新增或正式 i18n 验收要求

则直接进入“使用主生成资产或页面资产 fallback 起点 + 替换业务槽位”的页面生成路径：

1. 先看机器计划的 `generationStrategy` 与 `primaryGenerationAsset`；只有 `generationStrategy=managed-fallback` 时再读取 `startFrom`。这里的 fallback 只表示页面生成资产起点，不表示接入模式 fallback：`template` 表示复制 `page.template.tsx|jsx`，`host-archetype` 表示复制宿主 archetype，`reference-or-scaffold` 表示由 `start-page` 使用受管 scaffold / reference 起步
2. `host-integration`：优先复制已同步的 `src/typical-page-reuse/pages/*` 或 host-integration reference 作为起点，但目标文件必须落到真实业务目录；业务页必须注册到真实业务路由而不是示例 gallery
3. `rules-only`：仅当 mode lock 已确认为 `rules-only` 时适用。若进入页面资产 fallback，reference-only 示例是隐藏结构基线，不进入业务菜单、不接管宿主路由，也不代表 `greenfield` 项目已完成 host 接入；按 `startFrom` 绑定 `templates/archetypes/rules-only/<pageType>/page.template.tsx|jsx`、reference-only 示例或受管 scaffold，再确认宿主运行链、route owner、shell carrier、region / ownership mapping，最后派生真实业务页并只替换业务槽位
4. `legacy-host-compatible` / `host-compatible`：分为项目接入链路和页面生成链路。项目接入链路以 `typical-page:apply:legacy` 为外部入口，内部执行 `legacy:init`，用 host pack 写入 `.local-context/hiui-design/host-contract.json`、一次性 `src/hiui-runtime/*`、PageSpec 覆盖、adapter facts、`.local-context/hiui-design/outputs/runtime-compatibility-lock.json` 与 `.local-context/hiui-design/outputs/project-integration-state.json`；React 16.8 到 16.13.x 走 `vendor/hiui-design-typical-page-shells-0.1.2-legacy.tgz`，React 低于 16.8 必须 blocked；pnpm + Node 16 环境使用 `npx pnpm@8.6.12 install` fallback。页面生成链路只在 project integration state ready 后执行 `legacy:new|rewrite`，用 `rules/typical-page-contracts/<pageType>.json` 编译出的 PageSpec 驱动页面目录内 `page.instance.tsx`、`page.slots.ts`、必要 `page.request.ts`；legacy 主树不能 ad hoc direct import `@hiui-design/typical-page-shells`，业务页也不能自建壳层、DOM region、ownership 或视觉 token；只有 `src/hiui-runtime` 可以作为受管边界消费 compatible shell runtime。验收时跑 `typical-page:doctor:integration`，不把存量业务样式作为 hiui-design 接入或交付检查内容；回滚按 `docs/onboarding/legacy-host-compatible-rollback.md`。命中高风险转译时展开 Translation Drift Guard；`typical-page:legacy:verify` 仅作显式排障命令
5. 只替换标题、路由、查询字段、指标、表格列、表单 / 详情字段、接口 / mock 数据、行操作等业务槽位
6. 保留页壳、region 层级、白底主体、滚动 owner、分页 / footer 挂载语义、source marker 与 row action 语义

对旧系统升级，普通典型页的 fast path 默认再细分为：

- `slot-fill-only`：当前页已经是受管实例，只改业务槽位。
- `rewrite-by-contract-slots`：当前页仍命中同一典型页型，但现有源码还不是 ready 的 managed instance；此时用 `typical-page-contract` 与 runtime renderer 重建轻量业务页实例，不在旧 JSX 上继续修补壳层。

这两类都属于典型页快路径，不等于 `strict-structure`。

`multi-page-workflow` 的快速路径不是把多个意图揉成一个复杂页面，而是按 `pageUnits` 逐页执行典型页快速路径，并使用每个 `pageUnits[].startFrom` 选择对应起点。并列页面意图默认表示多个路由页面 / 视图工作流；只有出现“一个页面内 / 同屏 / 左右联动 / split / 主从联动”等布局证据时，才进入组合页 / split 判断。

快速路径仍要保证当前页可预览、lint / build 可解释、当前页 contract / preflight 不失真；但不需要在实现前手工展开长篇 page-type 判断、全量 i18n 策略或全局 doctor 历史问题排查。全量 `finalize-page` / source gate / doctor / runtime smoke 保留为正式验收或发布链路。

快速路径的禁止升级规则：

- 计划里的 `formalAcceptanceCommands` 为空时，不要把 `source-gate`、`doctor`、`runtime-smoke`、`finalize-page` 说成当前链路必需步骤。
- `typical-page:preview-ready` 只负责当前页 `previewReady + qualityVerified` 轻量确认；若当前任务新生成了页面，还要在页面文件存在后单独执行 `typical-page:record-usage`。`report-preview-ready-usage` 只作为显式串联包装器，不是默认链路。
- `npm run build`、`npm run lint`、浏览器预览可以作为额外工程验证，但不能替代 `plan-page-task`、`startFrom` 与当前页 `preflight`，也不能反过来改变 page type / mode 结论。
- 若 `fastPath.eligible=true`，实现只允许填业务槽位、Level 1 受控扩展或受管图表配置；任何页壳、白底主体、region 层级、滚动 owner、分页 / footer 挂载语义变化都会把任务升级为标准 / 严格链路，并需要重新跑 Plan Gateway。
- 若 legacy host contract 与 typical page contract 已 ready，不要因为 direct shell import 在 legacy 主树里被禁止，就把任务改写成“兼容 hand-built 页面”、旧 carrier 页面或把 reference 当默认交付资产。
- 对 `rules-only`，`reference-driven` 不等于整页复制 reference 后交付；若 `route owner`、`shell carrier path`、`ownership mapping` 或唯一 `example path` 写不清，快速路径必须停止，先补事实或升级标准 / 严格链路。
- 对 `legacy-host-compatible`，fallback / `translated-reference` 分支不等于直接复制标准壳 import，也不等于旧宿主 primitives 近似实现；若缺少合格宿主 archetype、首次适配页型、`startFrom=reference-or-scaffold|scaffold`、涉及 `table-stat` / `tree-split` / drawer / full-page、修改 ownership / shell carrier、出现 warning 或进入正式验收，必须补 `Semantic Lock`、`Translation Map` 与 `Isomorphism Check`。

## 按场景最小路径

### 1. 接入项目

- 读 `mode-selection.md`
- 读 `scripts/README.md`
- 根据场景执行 `setup-for-designers.mjs` 或 `apply-in-current-project.mjs`
- 需要排障时，再读 `docs/onboarding/*.md`

### 2. 命中典型页型的页面生成

- 先按机器计划或 `page-type-map.md` 锁定 `page type` / `pageUnits`，并读取计划里的 `pageTypeDocs`。
- 普通典型页优先看 `generationStrategy=page-component` 与 `primaryGenerationAsset`；只在计划选择 `managed-fallback` 时读取 `fallbackGenerationAsset` / `startFrom` 绑定模板、宿主 archetype 或 scaffold 起点。
- 数据可视化固定走 `generationStrategy=managed-analytics`：先建立 `chartUsageContract`，再锁定 `visualBaselinePlan`、`visualizationRolePlan` 与 `writeScope`，最后生成图表配置和分析布局；不要按普通典型页骨架快速复制。`visualizationRolePlan.chartSectionLayoutPlan` 还必须先回答当前 `chart-section` 的单一基础栏数模式、`12` 的 neutral `full-span` 语义，以及 `stat-section` 指标卡不参与图表区 grid 判定的边界。
- 不满足快速路径时，再按 `ai-kickoff-template.md` 输出首轮起手块。
- 再按 `generation-rules.md` 进入当前链路需要的 `start-page / preflight / preview / lint-build`；`finalize-page / runtime smoke` 只在正式验收、发布、结构修复或命中强制浏览器级场景时追加。
- 命中页型后只补读计划里的 `pageTypeDocs` 和 `figma-page-rules.md`；只有显式 i18n / 多语言 / RTL / locale 验收时才补读 `i18n-baseline.md`。

### 3. 未解析页型、多页面工作流与非典型入口

- `topology=unresolved` 只表示页型尚未解析；不得因此直接进入非典型页面路径
- `topology=multi-page-workflow` 表示一次需求包含多个页面意图，默认按 `pageUnits` 拆成多个典型页分别生成
- `topology=single-page-composite` 表示一个页面内存在多个意图或同屏联动，先按组合页 / split 规则补 contract，不得直接把它降级成自由非典型页
- 只有 `topology=non-typical-overlay` 或存在明确非典型 / 自定义布局证据时，才读 `../docs/generation/non-typical-pages.md`

### 4. 未命中典型页型，或典型页型需要 overlay 布局判断

- 保留原 `page type` 结论，或明确“未命中典型页型”
- 读 `../docs/generation/non-typical-pages.md`
- 用该文件判断 `layout strategy`、`layout archetype` 与布局 ownership 语义
- 若所需组件超出 `../docs/hiui-v5-quick-reference.md` 覆盖范围，再补 `../docs/generation/non-typical-component-routing.md` 与 `../docs/generation/hiui-v5-component-map.md`
- 真正的 contract 字段形状仍回到 `contract-regions.md`

### 5. 组合页 / split 页面

- 在 kickoff 与 contract 基础上，额外读 `../docs/generation/implementation-checklist-template.md`
- 它只追加宽度总账、分栏弹性、固定列降级、scroll contract 与 runtime smoke 计划
- 若 `layout archetype = context-main-split`，实现前还要先锁定 `split shell inheritance strategy` 与 `split shell carrier path`
- 若项目里已经存在 `TreeSplitPageFrame`、`ContextMainSplitScaffold` 或宿主 split helper，必须从该受管 split carrier 起步，而不是先手写 `workspace / leftPane / rightPane` 再回头补 marker
- 右栏业务再复杂，也只能在受管 split 壳的 `right-main` 内自由组装；不能因此回退到 `ProDetailPage`、`ProEditPage` 或通用 `page-scroll` 壳

### 6. 交付与验收

- 页面质量验收证据、真实页面核验与页面完成门槛只看 `validation-checklist.md`
- 若当前任务新生成了页面，默认仍需完成当前页 `preview_ready` 轻量确认，并在页面文件存在后单独执行 `typical-page:record-usage`；若 usage 失败，只能作为非阻断风险披露并给出补传动作
- 不要回到 kickoff 模板或本文件抄一遍前置字段

## 文档职责图

- `ai-kickoff-template.md`
  只定义“首次回复长什么样”。
- `generation-rules.md`
  只定义原则与阶段门槛。
- `../docs/generation/explainers/*.md`
  只提供复杂场景的解释层与补读索引；不是 source of truth，不得重新定义字段、gate 或页型协议。
- `contract-regions.md`
  只定义 contract 字段与 region / ownership / semantic contract。
- `implementation-checklist-template.md`
  只定义组合页增量要求。
- `validation-checklist.md`
  只定义页面质量验收证据与页面完成门槛。
- `PRIVACY.md`
  只定义 `record-usage` 收口与最终回复前动作；`preview_ready` 继续属于质量确认。
- `non-typical-pages.md`
  只定义非典型 / overlay 布局推理与 archetype 语义。

## 按需补读

- `docs/generation/i18n-baseline.md`
  仅在显式要求多语言 / i18n / 英文 / RTL / locale 验收，或任务本身是正式国际化验收时补读；普通典型页快速生成默认按 `none` 或宿主既有 `key-only` 风格处理。
- `docs/generation/figma-page-rules.md`
  命中页型后补读。
- `docs/generation/figma-pages/*.md`
  只读当前命中的页型专章。
- `docs/generation/rules-only-component-matrix.md`
  仅在 `rules-only` 非快速路径、`startFrom=unresolved`、模板 / 示例 / scaffold 起点全部缺失、ownership / region 修改或排错时补读。
- `docs/generation/legacy-host-compatibility.md`
  命中旧宿主兼容路径时补读。
- `docs/generation/explainers/*.md`
  仅在 planner 明确输出、或处于 legacy lightweight contract / managed-fallback / non-typical / strict governance 等复杂场景时补读；普通典型页快路径不要主动展开 explainers。
- `docs/generation/layout-anti-patterns.md`
  做结构与视觉误区复核时补读。
- `docs/generation/non-typical-component-routing.md` 与 `docs/generation/hiui-v5-component-map.md`
  命中非典型 / overlay 且组件超出最小速查覆盖范围时补读。

## 不要默认读

- `vendor/**`
- scripts 目录源码
- `examples/**`

若需要改字段、改 contract 结构、改页面完成门槛或改统计收口流程，直接修改对应 owner 文档，不要在本文件里再复制一套。
