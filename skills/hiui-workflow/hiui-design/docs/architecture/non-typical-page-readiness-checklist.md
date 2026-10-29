# 非典型页面 Readiness 收口清单

## 1. 目的

本文件用于给 `non-typical-page` 提供一份单独的发布收口口径，避免以下三类状态继续混写：

- 内部链路已经接线完成
- validated v1 scope 已公开放行，但文档仍沿用“尚未接通 generator”的旧说法
- validated v1 scope 已公开放行，但边界被误写成“全量场景全部开放”

本文件只回答两个问题：

- 当前事实层已经做到什么程度
- 维持 `generatorReady=true` 与当前公开边界一致，还必须持续满足哪些条件

## 2. 当前事实状态

### 2.1 已完成能力

当前仓库内，`non-typical-page` 已具备以下内部能力：

- family workflow manifest 已建立
- `load-generation-brief.mjs` 可正式产出 `nonTypicalExecutionBrief`
- `plan-page-task.mjs` 可正式输出 family 级计划信息
- `generate-non-typical-page-from-brief.mjs` 已存在
- `generate-page-from-brief.mjs` 已具备 page-family 分流能力
- runtime primitives 已落到 `examples/host-integration/src/runtime/non-typical-primitives/**`
- light sanity 已接入
- capability report 已能区分 `plannerReady / briefReady / generatorReady / generationStatus`
- 首批正样本、边界样本、负样本回归已固化为测试

### 2.2 当前对外状态

当前对外应明确保持以下事实：

- `docs/generation/page-family-workflows.manifest.json` 中，validated v1 scope 已声明 `generatorReady=true`
- `scripts/generate-page-from-brief.mjs` 已对 validated v1 scope 开放 family generator 主链路
- `legacyRefactorReady=false`
- `legacy-system-reconstruction` 仍不在首版开放范围内

这意味着：

- 当前已具备“validated v1 scope 对外公开开放能力”
- 当前仍不具备“无限制全量开放能力”

### 2.3 真实项目验收事实

真实 target project 验收事实已经补齐，当前至少具备以下明确证据：

- 已使用 `scripts/validate-non-typical-real-project.mjs` 在真实 target project `mit-design` 上完成 family 级写页验证
- 正样本 `确认订单信息`、`机构售卖单管理` 可写出页面并通过 light sanity
- 边界样本 `方案一`、负样本 `业务规模` 在真实链路中仍然被正确阻断
- project check 已具备仓库内置 `auto` 轻量策略：当前 launcher Node 满足项目 Node policy 时，自动执行 `tsc --noEmit + 隔离输出目录 vite build`
- 真实项目验收报告已落到目标项目 `.local-context/hiui-design/outputs/NON_TYPICAL_REAL_PROJECT_VALIDATION_REPORT.{json,md}`
- 发布收口可使用 `scripts/evaluate-non-typical-generator-readiness.mjs --target <project-root>` 汇总 manifest、capability report 与真实项目验收事实；它只输出 `evidenceStatus` 与 `releaseRecommendation`，不自动翻转 `generatorReady`
- 关键公开口径已补静态回归：`scripts/tests/non-typical-public-readiness-wording.test.mjs` 会检查 `SKILL.md`、`README` 与关键非典型文档没有把“内部已接线”误写成“对外已开放”
- 人工发布审阅范围已固定到 `docs/architecture/non-typical-generator-ready-manual-review-checklist.md`，避免最后一步继续依赖口头约定

### 2.4 当前不应再使用的旧表述

以下表述已经不再准确，不应继续出现：

- “non-typical-page 只有 AI 前置引导，还没有 generator”
- “generate-page-from-brief.mjs 完全没有接 family generator”
- “当前只能做生成前决策，尚未形成真实代码生成路径”

更准确的表述应为：

- “family generator 已对 validated v1 scope 公开开放，但 legacy reconstruction 与未验证协调模式仍保持关闭”

## 3. 维持 `generatorReady=true` 的持续条件

以下条件必须同时满足，才允许继续维持“validated v1 scope 已公开开放、边界仍受限”的当前状态。

### 3.1 事实源一致

必须确认以下入口表述一致：

- `page-family-workflows.manifest.json`
- `non-typical-page-contract.json`
- `page-type-capability-report` 输出
- `AI_GENERATION_READY_CONTEXT` 输出
- 主文档与架构文档

禁止出现：

- manifest 仍关闭，但文档宣称“已正式支持”
- capability report 显示 ready，但主入口仍 fail closed
- AI 指导文档仍写“generator 未接通”

### 3.2 真实链路验收

除了 isolated target 回归外，还必须至少完成 1 次真实 target project 验收，确认：

- family brief 可在真实项目中形成
- main generator 分流能在真实项目写入页面
- runtime primitives、样式链、输出目录与轻量 sanity 在真实宿主中不出现新的断点
- 生成页不依赖重校验即可通过最小工程检查

### 3.3 边界仍然受控

即使 `generatorReady=true` 已对 validated v1 scope 生效，以下边界也仍必须保持关闭：

- `legacy-system-reconstruction`
- 未验证 `coordinationPattern`
- 第三方复杂画布 / 图引擎页面
- 绕开 HiUI5 与 `local-managed-runtime` 的自由视觉系统

### 3.4 回归稳定

至少要满足：

- 正样本：`确认订单信息`
- 正样本：`机构售卖单管理`
- 边界样本：`方案一`
- 负样本：`业务规模`

并满足：

- 正样本可写出页面
- 边界样本先命中分类 stop
- 负样本回退到已有 family
- manifest-patching 测试并发执行不再互相污染

## 4. 当前剩余缺口

从当前仓库事实看，仍剩以下缺口：

- 文档入口此前存在过期描述，需要持续收口
- `legacy-system-reconstruction` 仍未进入二阶段设计落地

其中最关键的已经不再是补 generator 链路本身，而是基于现有真实项目验收事实，继续收口“对外口径一致 + 公开边界不被夸大或回退”。

## 5. 建议的下一步

当前最值得持续维护的顺序如下：

1. 保持 `generatorReady=true` 与公开文档口径一致
2. 把文档入口全部收口到“validated v1 scope 已开放、边界仍受限”
3. 持续用真实 target project 验证公开范围内的 family generator
4. 对未开放能力继续 fail closed，不把 legacy reconstruction 或未验证协调模式提前纳入默认链路
5. 若后续扩大公开范围，再同步更新 `SKILL.md` 与对外默认工作流口径

## 6. 一句话口径

当前 `hiui-design` 对 `non-typical-page` 的准确状态是：

> family-specific generator 已在 validated v1 scope 内公开开放并通过回归验证；当前应表述为“公开范围已开放、边界仍受限”，不能表述为“所有非典型场景都已正式开放”。
