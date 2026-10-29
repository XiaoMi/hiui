# 页面生成流程实跑审计

## 目标

这份文档用于把 `hiui-design` 页面生成流程的讨论，从“看文档猜流程”收口成“在真实项目里按固定步骤跑一遍并留痕”。

这里的“实跑审计”只做流程体检，不做安全审计。目标是回答四个问题：

- 流程是否合理
- 流程是否顺畅
- 是否存在逻辑冲突
- 是否存在流程冗余

## 适用范围

优先用于以下场景：

- 想确认 `ensure -> preflight -> plan -> generate` 主链路是否顺
- 想对比 `host-integration` 与 `rules-only` 两条接入路径的真实体验
- 想验证文档口径、脚本行为、状态文件是否一致
- 想把“偶然跑通一次”和“流程设计真的合理”区分开

不建议只靠单次成功跑通就下结论。

单次成功只能证明“这次能走完”，不能证明：

- 不绕
- 不重复
- 不依赖人工兜底
- 不依赖前置隐性知识

## 核心原则

### 1. 先选代表性项目，再跑流程

至少选两类项目：

- `host-integration`
- `rules-only`

如果只跑一种项目，结论很容易偏向某一条接入路径。

### 2. 先看状态变化，再看命令是否成功

流程是否合理，不能只看命令退出码。

必须同时记录：

- 命令是否成功
- 当前阻断在哪一步
- 阻断理由是否和文档一致
- 状态文件是否按预期变化
- 后续脚本是否重复做了前一步已经做过的判断

### 3. 成功路径和失败路径都要跑

每类项目至少跑两条路径：

- 成功路径：从接入到生成
- 失败路径：缺 context、缺 apply-state、page-task gate 未开、freshness 失效等阻断场景

如果只跑成功路径，很难识别流程是否存在“前面说停，后面却继续分析”的问题。

### 4. 先静态审阅，再动态实跑

推荐顺序：

1. 静态审阅文档和脚本
2. 动态实跑真实项目
3. 对照文档与实跑记录输出结论

这份文档只负责第 2 步和第 3 步的留痕格式。

## 最小测试矩阵

### A 组：`host-integration`

- A1 成功路径
- A2 page-task gate 关闭路径

### B 组：`rules-only`

- B1 成功路径
- B2 integration 未 ready 路径

如果时间允许，再补：

- C1 `existing-system + Module Federation direct expose`
- C2 freshness 失效后的重新开门路径

## 固定观测对象

每次实跑都必须记录以下事实。

### 命令链

- `ensure-in-current-project.mjs`
- `typical-page-preflight.mjs`
- `plan-page-task.mjs`
- `generation-brief.mjs`
- `generate-page-from-brief.mjs --dry-run`
- `generate-page-from-brief.mjs`

### 项目级状态

- `integrationReadiness`
- `pageTaskReadiness`
- `userVisibleState`
- `integrationComplete`
- `readyToGenerate`
- `readyToExecute`

### 状态文件

- `.local-context/hiui-design/outputs/HIUI_DESIGN_APPLY_STATE.json`
- `.local-context/hiui-design/outputs/PROJECT_PAGE_TASK_STATUS.json`
- `.local-context/hiui-design/outputs/AI_GENERATION_READY_CONTEXT.json`
- `.local-context/hiui-design/outputs/PAGE_TYPE_CAPABILITY_REPORT.json`
- `.local-context/hiui-design/outputs/PROJECT_STATE_SUMMARY.json`

### 生成期产物

- `hiui-pagegen.meta.json`
- `PAGE_GENERATION_REPORT.*.md`
- `DEPENDENCY_ISOLATION_REPORT.json`

### 运行态验证产物

- `.local-context/hiui-design/outputs/verification/*`
- 浏览器控制台告警或报错记录
- 关键区域截图或可复现页面链接

## 标准执行顺序

### 0. 建立基线快照

记录：

- 项目类型
- 接入模式预期
- 是否已有 `.local-context/hiui-design/`
- 是否已有 apply-state
- 是否已有 `PROJECT_PAGE_TASK_STATUS.json`
- 当前要生成的页型
- 当前输入参数

建议同时记录：

- `package.json`
- 锁文件
- app entry
- 构建配置

这些文件会影响 freshness 判断。

### 1. 跑 ensure

命令示例：

```bash
node ".local-context/hiui-design/scripts/ensure-in-current-project.mjs"
```

若项目本地 context 不存在，改用 skill 根目录外部命令。

观察点：

- 是否成功同步 `.local-context/hiui-design/`
- 是否成功生成 apply-state
- `PROJECT_PAGE_TASK_STATUS.json` 是否被写成 `ensure-only`
- 对外提示是否明确说“仍需 preflight”

如果 `ensure` 成功后对外话术像“已经可以开始生成页面”，记为逻辑冲突。

### 2. 跑 preflight

命令示例：

```bash
node ".local-context/hiui-design/scripts/typical-page-preflight.mjs" --json
```

观察点：

- `pageTaskReadiness` 是否从 `ensure-only` 进入 `ready-to-generate`
- `AI_GENERATION_READY_CONTEXT.json` 是否刷新
- `PAGE_TYPE_CAPABILITY_REPORT.json` 是否刷新
- 返回结果是否明确区分“页面任务门未开”和“项目接入未完成”

如果 preflight 已经说明阻断原因，后续 planner 仍重新做一整套相同分析，记为流程冗余。

### 3. 跑 planner

命令示例：

```bash
node ".local-context/hiui-design/scripts/plan-page-task.mjs" --target "$PWD" --mode rules-only --json
```

观察点：

- 当 gate 未开时，是否只返回 `ensure` 或 `preflight` 下一步命令
- 是否在 gate 未开时仍然做深度页型、导航、模板分析
- 阻断原因是否和 preflight 一致
- `allowedActions` / `forbiddenActions` 是否合理

如果当前这一步只是为了拿下一步 `ensure` 命令，不要提前带 `--page-type`、`--dest`、`--title` 这类页面塑形参数；等 ensure 成功后再带完整页级输入重跑 planner。

如果 planner 说“必须先停”，但输出中已经包含大段模板、挂载、宿主推演，记为“阻断后仍继续分析”。

### 4. 跑 brief

命令示例：

```bash
node ".local-context/hiui-design/scripts/generation-brief.mjs" --target "$PWD" --mode rules-only --json
```

观察点：

- 它是否只是 planner 的导出版本
- 在 gate 未开时是否真的只返回 blocked brief
- 与 planner 的阻断口径是否一致

如果当前项目还没 ready，这一步同样只跑最小 gate；不要把 `--page-type`、`--route-path`、`--dest`、`--title` 提前塞进 brief。

如果 planner 和 brief 都调用同一套分析，但对外命名又像两个阶段，记为“入口冗余”。

### 5. 跑 dry-run

命令示例：

```bash
node ".local-context/hiui-design/scripts/generate-page-from-brief.mjs" --page-type table-basic --dest src/pages/demo --title 演示页 --dry-run --json
```

观察点：

- gate 未开时是否直接 fail closed
- 是否错误自动补 ensure
- 提示用户下一步动作时，是否指向正确命令

这里的 `fail closed` 表示“条件不满足就明确停止”，当前语境里，它用于避免脚本在未放行时继续写页面。

### 6. 跑真实生成

命令示例：

```bash
node ".local-context/hiui-design/scripts/generate-page-from-brief.mjs" --page-type table-basic --dest src/pages/demo --title 演示页 --json
```

观察点：

- 若 integration 未 ready，是否只自动补一次 ensure
- ensure 完成但 gate 未开时，是否明确停止并要求先跑 preflight
- 是否在写文件前执行 `dependency-isolation-check`
- 是否返回 `hiui-pagegen.meta.json`
- 是否把人工接入动作和自动接入动作区分清楚

### 7. 生成后留痕

记录：

- 实际生成文件
- 实际未生成文件
- 是否有人工步骤
- 是否有额外阻断
- 是否出现“命令成功但流程语义不对”的情况

### 8. 跑运行态验证

这一步不是重复做 `build`（构建产物检查，这里只说明代码能不能被工程打包），而是确认页面真正挂起来后有没有运行态问题。

推荐顺序：

1. 如果项目本身有正式本地入口，直接从正式入口打开
2. 如果项目是 `Module Federation remote`，优先补一个最小 `host harness`（本地承载壳，这里指只用于本地加载 `remoteEntry.js` 和远程页面的轻量验证页）
3. 页面成功渲染后，再看控制台和关键 UI 区域

观察点：

- `remoteEntry.js` 是否可访问
- 远程 expose 是否可加载
- 页面是否真的渲染出标题区、筛选区、表格区
- 控制台告警是否来自旧项目存量噪音，还是来自新生成页面
- `doctor` / `build` 通过后，是否仍存在明显运行态 warning

如果页面已经渲染出来，但控制台仍出现和新页面直接相关的 warning，应单独记录为“运行态质量未收口”，不要因为 `build` 通过就判定流程已完全健康。

## 问题归类规则

### 逻辑冲突

满足任一项即可归为逻辑冲突：

- 文档说必须停止，脚本却继续深分析
- 状态字段含义前后不一致
- 同一状态在不同入口里被解释成不同阶段
- 文档说 `preflight-or-stop`，实现却统一走 `ensure-or-stop`

### 流程冗余

满足任一项即可归为流程冗余：

- 同一事实在多个入口被重复判定
- 同一阻断在多个脚本里重复展开
- 某个中间产物已给出机器结论，但后续脚本仍重新推导
- 用户必须理解多个同层入口，才能完成一条普通链路

### 命名混乱

满足任一项即可归为命名混乱：

- 命令名听起来像不同阶段，实际只是同一能力的不同壳
- 字段名无法直接对应用户可理解的阶段
- 同一概念在文档中使用多个近义表达

### 交互不顺

满足任一项即可归为交互不顺：

- 下一步命令提示不唯一
- 阻断原因说不清楚
- 用户需要知道内部实现细节才能继续
- 失败后无法快速定位该回到哪一步

### 运行态质量未收口

满足任一项即可归为运行态质量问题：

- 页面已渲染，但控制台出现与新生成页面直接相关的 warning 或 error
- `build` 与 `doctor` 都通过，但筛选区、表格区或挂载边界仍出现真实 UI 异常
- 只能证明 expose 已注册，不能证明页面在真实运行时链路里健康工作

## 单次实跑记录模板

把下面模板复制到本次审计记录里使用。

```md
# hiui-design 页面生成流程实跑记录

## 基本信息

- 项目名称：
- 项目类型：
- 目标模式：
- 测试场景：
- 页型：
- 输入参数：
- 执行日期：

## 初始状态

- 是否存在 .local-context/hiui-design/：
- 是否存在 apply-state：
- 是否存在 PROJECT_PAGE_TASK_STATUS.json：
- 初始 integrationReadiness：
- 初始 pageTaskReadiness：

## Step 1: ensure

- 命令：
- 退出结果：
- 关键输出：
- 状态文件变化：
- 实际结论：
- 是否符合预期：

## Step 2: preflight

- 命令：
- 退出结果：
- 关键输出：
- pageTaskReadiness 变化：
- AI_GENERATION_READY_CONTEXT 是否刷新：
- 实际结论：
- 是否符合预期：

## Step 3: planner

- 命令：
- 退出结果：
- planning gate：
- 是否继续做了页型/导航/模板深分析：
- 实际结论：
- 是否符合预期：

## Step 4: brief

- 命令：
- 退出结果：
- 是否与 planner 结论一致：
- 实际结论：
- 是否符合预期：

## Step 5: generate dry-run

- 命令：
- 退出结果：
- 是否正确阻断或放行：
- 实际结论：
- 是否符合预期：

## Step 6: generate

- 命令：
- 退出结果：
- 是否自动补 ensure：
- 是否要求先跑 preflight：
- 是否执行 dependency-isolation-check：
- 生成产物：
- 实际结论：
- 是否符合预期：

## Step 7: 运行态验证

- 打开方式：
- 是否使用 host harness：
- 页面是否真实渲染：
- 标题区 / 筛选区 / 表格区是否可见：
- 控制台关键信号：
- 这些信号更像旧项目存量还是新页面问题：
- 实际结论：
- 是否符合预期：

## 问题清单

- [P1] 逻辑冲突：
- [P1] 流程冗余：
- [P2] 命名混乱：
- [P2] 交互不顺：
- [P1/P2] 运行态质量未收口：

## 最终判断

- 是否合理：
- 是否顺畅：
- 主要冲突点：
- 主要冗余点：
- 下一步建议：
```

## 建议输出物

每个代表性项目建议至少产出一份本地记录文档，命名示例：

```text
outputs/flow-audit/<project-name>.<scenario>.md
```

推荐场景命名：

- `host-integration.success`
- `host-integration.page-task-gate-blocked`
- `rules-only.success`
- `rules-only.integration-blocked`

## 判定标准

如果一次实跑同时满足下面四项，可以初步认为该链路“基本顺”：

- 阻断点唯一
- 下一步命令唯一
- 状态文件变化与文档一致
- 后续脚本没有重复展开前一步已完成的判断
- 页面至少有一条可复现的运行态验证证据，不只是 `build` 通过

如果出现下面任一项，就应判定流程仍需继续理顺：

- `ensure` 和 `preflight` 语义混用
- gate 未开时仍继续深分析
- 同一事实既来自状态文件，又被脚本重新推导且结果可能不一致
- planner、brief、generator 三个入口无法清晰区分职责
- 页面虽然生成成功，但运行态 warning 仍没有被分类收口
