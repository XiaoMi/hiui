# 非典型页面 GeneratorReady 人工审阅清单

## 1. 目的

本清单只服务一件事：

- 在 `non-typical-page` 的 validated v1 scope 已公开开放后，人工确认关键公开入口是否仍与当前 public-open 边界一致；若后续扩大公开范围，也用同一清单做最终收口

本清单不替代真实项目验证，不替代样本回归，也不替代 manifest 事实源。

它只解决一个机器暂时无法完全证明的问题：

- 关键公开入口是否仍然存在“内部已接线”和“对外已开放”混写的风险

## 2. 使用时机

仅在以下条件同时满足后使用：

1. `scripts/validate-non-typical-real-project.mjs --target <project-root>` 已通过
2. `scripts/evaluate-non-typical-generator-readiness.mjs --target <project-root>` 输出 `evidenceStatus=pass`
3. 计划验证当前 public-open 口径是否仍成立，或准备扩大公开范围

若上述条件任一不满足，先不要进入本清单。

## 3. 审阅范围

本轮人工审阅固定只看以下公开入口：

1. `SKILL.md`
2. `docs/README.md`
3. `docs/generation/non-typical-ai-generation-guidance.md`
4. `docs/generation/input-modes.md`
5. `docs/generation/page-generation-workflow.md`
6. `docs/architecture/non-typical-page-readiness-checklist.md`
7. `docs/generation/page-family-workflows.manifest.json`

不要把范围扩散到所有文档全文。发布前人工审阅只看这组关键入口。

## 4. 固定判断项

### 4.1 `SKILL.md`

确认：

- 当前 skill 入口已明确把 validated v1 scope 的 `non-typical-page` family 纳入公开能力
- `SKILL.md` 必须继续明确它的开放边界，而不是把它表述成无限制全量开放
- 若后续扩大公开范围，必须同步更新 `SKILL.md` 的边界描述，而不是只改 manifest

### 4.2 `docs/README.md`

确认：

- 推荐阅读顺序仍能把非典型页面收口到 `readiness checklist`
- 没有把 `readiness checklist` 误写成“已经开放”的证明
- 若后续扩大公开范围，README 中必须同步体现新的开放边界，而不是仍停留在旧的收口状态

### 4.3 `docs/generation/non-typical-ai-generation-guidance.md`

确认：

- 明确写出 family-specific generator 已存在
- 明确写出 validated v1 scope 已对外公开开放
- 若后续扩大公开范围，必须同步移除或改写旧的 fail-closed 口径，避免与 manifest 冲突

### 4.4 `docs/generation/input-modes.md`

确认：

- 当前对 `non-typical-page` 的执行能力描述与 manifest 保持一致
- 若后续扩大公开范围，这里必须同步改成新的公开范围描述，且边界说明仍保留

### 4.5 `docs/generation/page-generation-workflow.md`

确认：

- workflow 文档没有把 family generator 的存在与对外开放状态混为一谈
- validated v1 scope 内的 workflow 已体现主链路可直达 family generator
- 若后续扩大公开范围，workflow 文档必须同步体现新的开放边界

### 4.6 `docs/architecture/non-typical-page-readiness-checklist.md`

确认：

- 该文件仍准确区分“validated v1 scope 已公开开放”和“全量场景尚未开放”
- 若后续继续扩大公开范围，必须同步把“当前剩余缺口”与“一句话口径”改到新状态

### 4.7 `docs/generation/page-family-workflows.manifest.json`

确认：

- `generatorReady` 的当前值与上述所有文档口径一致
- 若后续再次调整 `generatorReady` 或扩大公开范围，必须与文档改动放在同一批提交里，禁止先改 manifest、后补文档

## 5. 放行规则

只有同时满足以下条件，才允许维持当前 public-open 口径并继续扩展公开范围：

1. readiness evaluator 的 `evidenceStatus=pass`
2. 关键公开入口没有残留“未接通 generator”旧表述
3. 关键公开入口没有把 validated v1 scope 夸大成“全量场景正式开放”
4. 若准备扩大公开范围，manifest 与关键文档会在同一批改动中同步修改

任一条件不满足，则本轮至少继续保持：

- validated v1 scope 之外的能力不扩圈
- 对外口径不得夸大为“全量场景正式开放”

## 6. 一句话结论模板

### 6.1 维持当前公开范围时

> 真实项目验证与发布证据已补齐；当前应保持“validated v1 scope 已公开开放、全量场景尚未开放”的口径，不夸大开放范围。

### 6.2 扩大公开范围时

> 真实项目验证、证据评估与关键公开入口审阅均已完成；若本轮扩大公开范围，必须同步更新 manifest、关键文档与边界说明，不能只放大能力不更新口径。
