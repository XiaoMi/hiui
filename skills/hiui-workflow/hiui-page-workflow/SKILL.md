---
name: hiui-page-workflow
description: >-
  用于 React / HiUI 页面从需求细化到端到端生成与验收。适用于从模糊产品需求生成并验收页面、
  HiUI 页面提测前检查、页面生成后做体验走查、页面从需求到实现再到 UX 验收闭环等任务。
  编排 refine-product-requirements、hiui-design 与 ux-walkthrough：用 requirementGate、
  generationInputGate 和 uxGate 控制需求确认、页面生成输入确认、工程验收、UX 分级验收、
  before/after 截图、修复闭环和报告输出。
---

# HiUI Page Workflow

## 角色

你是 HiUI 页面端到端交付 agent。目标不是只生成页面，也不是只写体验报告，而是把页面从需求细化、实现、工程验收到体验验收串成闭环。

这是门禁型编排 workflow，不复制下游 skill 的详细规则，但必须控制阶段状态、输入契约和证据门禁：

- 需求澄清、产品方案、页面清单、全局生成上下文、页面级提示词、HiUI 交接包：使用 `refine-product-requirements`
- 页面规划、生成、源码约束、contract、工程 gate：使用 `hiui-design`
- UX 检查标准、证据门禁、P 级问题、正式 docx 报告：使用或参考 `ux-walkthrough`

核心铁律：

- `generationInputGate` 未确认或未被用户明确授权假设时，不得生成页面或修改页面源码。
- `uxGate.evidenceStatus` 未就绪时，不得输出确定性的完整 UX 报告。
- `standard-e2e` / `formal-e2e` 未覆盖 P0 场景时，不得只输出 P2 表面问题。

## Guardrails

- Do not 改变本 skill 的核心用途：它负责端到端交付编排，不复制下游 skill 的正文和执行细节。
- Before 任何页面源码修改，必须同时 validate：`generationInputGate` 已通过、HiUI 交接包已就绪、`hiui-design` 机器计划已完成。
- Before 从页面规划进入页面实现，必须同时 validate：`plan.status=ready`、`facts.status=ready`、`currentExecutionState.status=ready`、`canStartImplementation=true`；任一条件不成立时，回到 `ResolveBlockingFacts`，must not 继续生成页面。
- Before 任何 UX 确定性结论，必须 validate `uxGate.evidenceStatus = ready`；证据不足时必须 refuse 确定性完整结论。
- Do not 在普通页面任务中默认调用分发控制面安装、升级、回滚脚本；除非用户明确要求处理 `hiui-workflow` 的分发控制面。
- 若用户明确要求处理组合分发、安装验证、lock 校验或发布 smoke，必须引导到 `hiui-workflow` 对应脚本与文档；未加 `--force-sync` 时，发现本地更高版本必须 keep 并提示，must not 静默降级。
- Before 真实写入分发控制面变更，必须先通过一次 `hiui-workflow` 的 verify 或 dry-run 验证。
- Backup `install-journal.json` 与目标 skill 目录后，才允许执行真实安装；若任一写入失败，必须 rollback，must not 留下半安装状态。
- Do not 把 bundle 脚本当成下游 skill 的发布替代品；四个 skill 仍然各自维护自己的源码和版本。
- Unless 下游 skill 通过 `skill.manifest.json`、required paths 和 public contracts 暴露稳定面，否则 refuse 建立 bundle 依赖。

## 输入识别

进入本 workflow 的典型请求：

- 生成并验收 HiUI 页面
- 从产品需求生成并验收 HiUI 页面
- 将模糊需求细化、生成页面并完成验收
- 需求细化、页面生成、工程验收、UX 验收一条龙
- 端到端生成页面
- 生成页面后做体验走查
- HiUI 页面提测前检查
- 修复页面并输出体验报告
- 页面生成、工程验收、UX 验收一条龙

若用户只要求需求细化、产品方案、页面清单或页面提示词，且没有页面生成 / 验收目标，可在本 workflow 的 S0 收口，并按 `refine-product-requirements` 的交付模式输出。
若用户通过本 workflow 明确要求“需求细化 -> 页面生成 -> 验收”全流程，不得停在 S0，必须继续进入 HiUI 规划、生成、工程验收和 UX 验收。
若用户只要求体验走查，优先使用 `ux-walkthrough`。

### HiUI 直通白名单

只有满足以下任一条件，才允许跳过完整需求细化并直接进入 `hiui-design`：

- 用户已提供确认过的 HiUI 交接包。
- 用户已提供明确页面清单和页面级提示词。
- 当前任务只是已有页面的局部修改，且不改变页面结构、业务规则、权限或状态机。
- 用户明确选择或明确表达“保留假设，先生成一版 / 按你的假设推进 / 不用再确认”。

用户说“生成页面 / 继续 / 开始吧 / 端到端 / 一条龙”只代表任务目标，不等于授权跳过确认。

## 先判验收等级

先初判 workflow level。详情见 `references/acceptance-matrix.md`。若 S0 产出的 HiUI 交接包包含 `workflowLevelSuggestion`，或需求细化后发现范围/验收要求变化，必须重新校准 workflow level。

- `quick-preview`：生成页面并确认可运行；做 `ux-smoke`
- `standard-e2e`：生成 / 修改页面，跑工程 gate，做 `ux-standard` 结构化 UX 验收
- `formal-e2e`：提测、发布、合入、无 warning、完整 UX review；做 `ux-formal` 完整 `ux-walkthrough`

若用户出现“提测 / 发布 / 合入 / 无 warning / source-gate / doctor / finalize-page / 完整体验走查 / UX review 报告”，升级为 `formal-e2e`。

## 阶段推进门禁

本 workflow 使用 6 个阶段和 3 个 Gate。详细字段见 `references/handoff-contract.md`。

| 阶段 | 目标 | 进入下一阶段必须满足 |
|---|---|---|
| S0 需求与生成输入确认 | 细化需求，确认页面清单、页面提示词和 HiUI 交接包 | `generationInputGate.status = confirmed | assumption-authorized` |
| S1 HiUI 页面规划 | 调用 `hiui-design` 规划页型、拓扑、命令和必读文档 | 机器计划完成，`blockingReasons` 为空或已处理 |
| S2 页面生成 / 修改 | 基于确认输入写页面 | S1 完成，且再次确认 `generationInputGate` 已通过 |
| S3 工程验收 | 记录并执行进入验证 / 交付相位的 `requiredActions` / `formalAcceptanceActions` | 动作结果已记录为 passed / failed / skipped / blocked |
| S4 UX 验收 | 按验收等级执行 `ux-smoke` / `ux-standard` / `ux-formal` | `uxGate.evidenceStatus = ready` 或明确降级 / 阻塞 |
| S5 修复与最终交付 | 修复 P0/P1，复验并输出报告 | 工程结果、UX 结果、截图和风险已收口 |

Gate 最小状态：

- `requirementGate.status`：`needs-confirmation | requirements-confirmed | assumption-authorized | blocked`
- `generationInputGate.status`：`not-ready | ready-for-review | confirmed | assumption-authorized | blocked`
- `uxGate.evidenceStatus`：`not-ready | ready | insufficient | blocked`

## S0：需求与生成输入确认

当输入是产品想法、粗略需求、PRD 片段、页面描述不完整，或用户明确要求“从需求到页面到验收”时，先调用 `refine-product-requirements`。

执行要求：

1. 选择适合的需求交付模式：
   - 默认使用 `hiui-handoff`
   - 用户要求完整 PRD / 完整页面提示词 / 可复用需求包时，使用 `full-prd-to-generation`
   - 用户只给出极抽象想法且关键决策缺失时，先用 `quick-refine` 进行选项式确认
2. 先执行 `requirementGate`：
   - 识别高影响未知项：目标角色与权限、MVP 范围、核心状态 / 生命周期、关键动作及副作用、审核 / 审批规则、数据对象与字段、页面清单 / 路由边界、异常与审计要求。
   - 只要存在任一高影响未知项，先输出“当前理解 + 待确认问题”，不得进入 S1。
   - 反向确认需求时，使用选项式问题；每轮最多 3 个问题，让用户可直接回复 `1A，2B`。
   - 问题必须聚焦会改变页面结构、业务规则、数据模型或验收范围的决策；不要询问低价值样式偏好。
   - 每轮回答后重新判断剩余高影响未知项；仍存在时继续下一轮，不得把“一轮反问”当作完成。
3. `requirementGate` 通过后，必须执行 `generationInputGate`：
   - 输出产品目标、MVP 范围、P0 场景、角色权限、核心对象、状态 / 生命周期、页面清单、页面级提示词、HiUI 页型建议、假设与风险。
   - 让用户选择：`A. 确认并生成`、`B. 调整 MVP / P0 场景`、`C. 调整页面清单 / 页面提示词`、`D. 保留假设，先生成一版`。
   - 只有用户选择 A，才能设置 `generationInputGate.status = confirmed`。
   - 只有用户选择 D 或明确授权使用假设，才能设置 `generationInputGate.status = assumption-authorized`。
4. 若用户要求快速推进但未确认生成输入，必须先明确写出推荐假设，并得到用户授权后才继续；不能把“用户希望端到端生成”解释为已经授权假设。
5. 输出或整理这些最小交接物：
   - 产品目标和 MVP 范围
   - P0 用户场景
   - 角色与权限差异
   - 核心数据对象和生命周期状态
   - 关键业务规则和异常
   - 页面清单、全局生成上下文、页面级提示词
   - HiUI 交接包，包含页面 ID、路由/位置、HiUI 页型建议、优先级、状态、提示词 ID、假设、风险、生成顺序、`requirementGate` 和 `generationInputGate`
6. 若需求仍有缺口但用户已授权继续生成页面，按 `refine-product-requirements` 的规则保留“待确认”和假设，不能伪造成已确认；`generationInputGate.status` 必须标为 `assumption-authorized`。

需求细化的输出作为后续 `hiui-design` 的输入事实。后续不得手工重造页型、页面清单或业务规则；若 `hiui-design` 计划与 HiUI 交接包冲突，必须说明冲突并以项目事实和计划工具结果重新收敛。

## S1：HiUI 页面规划

调用 `hiui-design`：

0. 检查 S0 交接包中的 `generationInputGate.status`；只有 `confirmed` 或 `assumption-authorized` 可以继续。
1. 优先在目标项目根运行 `npm run typical-page:plan-page-task -- --json`
2. 若目标项目暂未注册 npm script，运行 `node ".local-context/hiui-design/scripts/plan-page-task.mjs" --json`
3. 若两者都不可用，fail closed：先修目标项目的 planner 入口或接入状态；不要把 `hiui-design` skill 源码仓里的 planner 脚本当成业务项目的默认 planner 入口
4. 结合 S0 的 HiUI 交接包，确认 `mode`、`topology`、`pageType` / `pageUnits`、`taskLevel`、`startFrom`
5. 按 `requiredDocs[].readMode` 消费计划文档：先读 `required`，`reference` / `conditional` 只按 `reason` 命中情况补读
6. 若 `plan.status!=ready`、`facts.status!=ready`、`currentExecutionState.status!=ready`、`canStartImplementation=false`，或 `currentExecutionState.primaryAction=ResolveBlockingFacts`，先补齐阻断事实，不直接实现

首轮计划以 `plan-page-task` 的 JSON 为准，不手工重造页型结论。

## S2：页面生成或修改

继续按 `hiui-design` 执行：

- 执行面默认以 `requiredActions` 为主；`requiredCommands` 只作为兼容摘要或人工复核视图
- 生成路径以 `targetDeliverySemantics`、`generationRecipe`、`generationInputs` 与 `requiredActions` 为准；不要由 workflow 手工重建下游页型策略
- “快速 / 标准 / 严格链路”只用于沟通风险和验收深度，不替代 planner 的结构化事实与动作分期

执行任何文件变更前，再次检查 `generationInputGate` 与 S1 机器计划；若 `generationInputGate` 未通过、HiUI 交接包未就绪，或 `plan.status` / `facts.status` / `currentExecutionState.status` 不是 `ready`，或 `canStartImplementation!=true`，必须停止并回到 S0 / S1，不得“先生成再补需求”。

不得破坏：

- 页壳
- region 层级
- 白底主体
- 滚动 owner
- 分页 / footer 挂载语义
- source marker
- contract ownership

## S3：工程验证与交付前检查

本阶段只承接进入验证 / 交付确认相位的动作：

- 默认以 `requiredActions` 与 `formalAcceptanceActions` 为主调度面
- `requiredCommands` 与 `formalAcceptanceCommands` 仅作为兼容摘要，不再单独定义 workflow 阶段
- phase 属于 `ResolveBlockingFacts`、`GenerateOrEdit`、`WriteContract` 的动作，必须在前序阶段完成；不得堆到 S3 再统一执行
- 进入 S3 后，优先记录 `Preflight`、工程脚本、`FormalAcceptance` 及其他交付前验证动作的真实结果

记录每条命令的结果：

- `passed`
- `failed`
- `skipped`
- `blocked`

失败时先判断是否阻断页面运行或交付，不要静默吞掉。

## S4：运行页面、截图与 UX 验收

页面需要浏览器时：

1. 启动或复用 dev server
2. 打开目标路由
3. 确认不是空白页、错误页、登录页或错误路由
4. 先保存修复前基线截图，再截图留证

若无法获得登录态，按 `ux-walkthrough` 的 URL 降级规则处理。

### 修复前基线截图

进入 UX 验收或修复前，必须先保留当前页面的可查看原图，作为 `before-fix` 基线证据：

- 至少保存桌面视口截图；页面涉及移动适配时追加移动视口
- 优先保存清晰原始 PNG，不只保留压缩缩略图
- 截图文件名或登记信息必须标明 `before-fix`、视口和页面状态
- 若页面有筛选、分页、弹窗、抽屉、错误态等关键状态，只截与本次问题相关的最小必要状态
- 若无法截图，必须在 `knownRisks` 中说明原因，不能把最终截图伪装成修复前截图

把工程阶段交接给 UX 阶段的信息整理成 `references/handoff-contract.md` 中的结构。

### UX 分级

| workflow level | UX 模式 | 名称 | 要求 |
|---|---|---|---|
| `quick-preview` | `ux-smoke` | 轻量可用性自检 | 页面可见、主入口可见、无空白 / 错路由、最终截图留证 |
| `standard-e2e` | `ux-standard` | 结构化 UX 验收 | evidence gate、P0 场景覆盖、P0/P1/P2 分级、P0/P1 修复闭环 |
| `formal-e2e` | `ux-formal` | 完整 `ux-walkthrough` | 完整 SOP、report.json，以及当前 `ux-walkthrough` 版本要求的完成门禁（1.0.2 起含 checklist coverage 校验、标注校验与 docx） |

`standard-e2e` 不要声称已完成完整 `ux-walkthrough`；它是参考 `ux-walkthrough` 标准的结构化 UX 验收。`formal-e2e` 才执行完整 `ux-walkthrough`。

### UX Gate

进入 UX 判断前建立 `uxGate`：

- `ux-smoke`：确认目标页面不是空白页、错误页、登录页或错误路由，并保留最终截图路径。
- `ux-standard`：必须有可用证据，读取 `ux-walkthrough` 的 checklist、severity、ignore-list 和 issue examples；必须覆盖 P0 场景。
- `ux-formal`：按 `ux-walkthrough` 的 `SKILL.md` 主流程与 `docs/onboarding/gates.md` 执行完整 SOP，包括 precheck、证据门禁、report.json，以及当前 `ux-walkthrough` 版本要求的完成门禁（1.0.2 起含 checklist coverage 校验、标注校验与 docx 交付）。

证据不足时，不输出确定性 UX 问题；只能输出“待补充证据 / 待交互验证 / 无法判断”。

### P0 场景覆盖

`ux-standard` 和 `ux-formal` 必须先从 S0 交接包读取 P0 场景，并输出覆盖结论：

- 入口是否可见
- 主路径是否可完成
- 关键数据是否可理解
- 权限 / 禁用状态是否有解释
- 加载、空、错误、成功状态是否覆盖
- 危险操作是否有防错
- 反馈和失败恢复是否明确

UX 报告必须先回答“P0 用户是否能完成核心任务”，再检查视觉、文案、间距、一致性和专业感。

P2 视觉、文案、一致性问题不能作为 `standard-e2e` / `formal-e2e` 的唯一输出；除非报告同时说明已覆盖 P0/P1 核心路径且未发现问题的证据依据。

所有问题必须使用格式：

```text
1. [P1] 问题标题
```

每个问题只写最小必要信息：

- 位置
- 问题描述
- 改进建议
- 截图证据，若适用

截图证据优先引用 `before-fix` 基线图；报告中展示可压缩缩略图，但必须同时保留可查看的原图路径。

`formal-e2e` 必须生成本地 `.docx` 报告；`standard-e2e` 仅在用户要求完整 UX review、可转发报告或归档报告时生成。

## S5：修复与最终交付

UX 问题处理策略：

- P0：必须修复，修复后重新工程验收和 UX 复查
- P1：默认修复，除非用户明确接受风险
- P2：可记录为建议；若改动小且不破坏 HiUI 结构，可以修复
- 待确认项：不硬改，说明缺什么证据

修复体验问题时，仍必须遵守 `hiui-design` 的页壳、region、ownership、source marker 和 contract 约束。

修复 P0 / P1，或实际修改了 P2 后，必须使用相同路由、相同视口、尽量相同数据状态复拍 `after-fix` 截图，并在报告中形成 before / after 对比。若无法保持相同状态，必须说明差异来源。

修复后回到：

```text
HiUI 修改 -> 工程 gate -> 页面截图 -> UX 复查
```

### 最终交付

最终回复按 `references/final-report-template.md` 收口，至少包含：

- `requirementGate` 和 `generationInputGate` 状态
- 需求细化摘要，若执行过 S0
- 页面生成 / 修改摘要
- 页面类型和 workflow level
- 工程验收结果
- `uxGate`、UX 验收模式和 P0 场景覆盖结果
- 修复前 / 修复后效果对比截图路径和简短说明
- 已修复的 P0 / P1 问题
- 遗留风险或待确认项
- 本地 docx 报告路径，若已生成
- 未执行的验证项，若存在

## 常见错误与正确做法

- 错误：用户说“帮我生成供应商管理页”，直接创建页面文件。正确：先输出 MVP、角色、页面范围的选项式确认。
- 错误：用户回复 `1A，2B` 后，直接进入 `hiui-design`。正确：先展示生成输入确认块，让用户确认页面清单和页面提示词。
- 错误：UX 报告只列“间距不统一、按钮不突出”。正确：先给出 P0 场景覆盖结论，再列 P0/P1/P2 问题。

## 统计收口

仅对 `hiui-design` 页面交付链路处理 usage stats：

- 标准 / 严格 HiUI 页面生成完成且可渲染后，按 `hiui-design` 的 usage stats 规则收口
- `ux-walkthrough` 的完成定义到完整报告、`report.json` 与当前版本要求的完成门禁为止；1.0.2 起至少包含 checklist coverage 校验、标注校验与 docx；不额外要求 usage stats 或 telemetry closeout

若 `hiui-design` 统计返回 `requires_network_authorization` 或退出码 `21`，按其规则申请一次授权。
统计失败不阻断主任务交付，但不能静默吞掉入队或授权状态。

## Runtime Dependency Boundary

`hiui-page-workflow` 是运行时编排层，依赖以下 skill 在环境中已可用：

- `refine-product-requirements`
- `hiui-design`
- `ux-walkthrough`

本 skill 只负责编排和消费这些 skill 的稳定输出，不负责公开安装入口，也不承担 bundle 分发控制。

边界要求：

- 若用户需要安装、升级、校验、回滚或发布 4 个 skill 的组合分发，应引导其使用 `hiui-workflow`
- 普通页面交付任务中，不要把安装、回滚、发布 smoke 脚本当成 workflow 默认步骤
- 不要把 `hiui-page-workflow` 对外表述成安装入口、bundle 入口或组合分发入口
- `dependencies` 只表达运行时依赖，不应被解释为当前 `skills add` 会自动安装这些 skill
- 若运行环境缺少上述依赖 skill，应先说明缺口，再提示使用公开入口完成安装

## Installation Guidance

当用户询问如何安装本 workflow 或其依赖 skill 时，统一引导到公开安装入口：

```bash
npx skills add XiaoMi/hiui/skills/hiui-workflow --skill '*'
```

说明要求：

- 安装入口是 `hiui-workflow`
- 被安装的是其中包含的 4 个独立 skill
- 不再对外表述“单独安装 `hiui-page-workflow` 会顺带安装其他 skill”

## Validation Boundary

本 skill 自身的完成判断，仍以页面交付 workflow 为准：

- 需求确认是否完成
- 页面生成输入是否确认
- 页面规划和实现是否完成
- 工程验收结果是否已记录
- UX 证据是否就绪
- 修复闭环和最终交付是否完成

安装、校验、回滚和发布 smoke 属于 `hiui-workflow` 的分发控制面，不属于本 skill 的默认完成路径。

只有当用户明确要求处理分发控制面时，才应转到入口目录对应的脚本和文档，而不是在普通页面任务中默认触发。

## Maintainer Notes

维护本 skill 时，始终保持以下口径：

- `hiui-page-workflow` = 运行时工作流编排 skill
- `hiui-workflow` = 公开安装入口
- `refine-product-requirements`、`hiui-design`、`ux-walkthrough` = 独立下游 skill

若文档、脚本说明或对外回复中再次把 `hiui-page-workflow` 描述成安装入口，视为职责边界回退，应修正。
