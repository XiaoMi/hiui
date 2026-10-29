# hiui-design Docs

## 本地事实源优先级

当前项目内，以 `.local-context/hiui-design/` 为 HiUI5 典型页唯一事实源。当前项目不依赖外部旧版 `hiui-design` 包；后续优化只在本目录内维护轻量规则、母版、manifest、slot boundary 和源码级 gate，不把外部重流程搬入普通页面生成链路。

历史旧版 `hiui-design` 包、其他已安装 skill 包或历史输出只能作为人工参考，不得覆盖本目录的 `SKILL.md`、`docs/generation/page-types.manifest.json`、`docs/generation/page-slot-boundaries.md` 和当前源码事实。

`.local-context/hiui-design/outputs/**/*.md`、`outputs/DEPENDENCY_ISOLATION_REPORT.*`、`outputs/PAGE_GENERATION_REPORT*.md`，以及历史遗留项目里的 `src/typical-page-preview/*.md` 都是运行快照，不是当前工程状态的唯一权威事实源。判断当前状态时，以当前 `package.json`、lockfile、manifest、源码和刚执行的命令输出为准。

`.context.jsonc` 是生成期默认策略的唯一事实源。普通页面生成阶段涉及的默认业务页面目录、preview 禁止输出根路径和 preview 只读参考策略，必须优先写入 `.context.jsonc`，再由脚本和文档消费；不要把这些常量散落在多个文档中重复维护。

## 入口分层

- `onboarding/`
  接入、模式选择、宿主边界、框架适配。
- `generation/`
  通用模板层。判页型、默认 Figma 规则、页型专章、共享规则、HiUI 5 视觉基线。
- `validation/`
  接入和生成后的验收清单。
- `../examples/host-integration/`
  仅作参考或联调用基线，不是默认要同步进业务项目的正式源码。

## 架构导读

如果想先从全局层理解 `hiui-design` 的目录职责、状态机、接入模式、页面生成链路与导航挂靠逻辑，优先阅读：

1. `architecture/hiui-design-architecture-runtime-guide.md`

当前对外术语约定：

- `integrationReadiness`：只表示 hiui-design 接入物料是否已同步
- `pageTaskReadiness = ready-to-generate`：才表示项目已经完成接入并可开始生成页面
- `rules-only`：仍然必须在接入阶段补齐项目级公共外壳基线，例如 app entry 对本地 host baseline CSS 的引入；这不是页面生成阶段再兜底的事
- 业务页面文件：只负责页面局部布局和业务槽位，不负责补 `html / body / #root` 这类全局样式

## 推荐阅读顺序

普通业务页生成优先阅读：

1. `generation/input-modes.md`
2. `generation/page-type-map.md`
3. `generation/ai-page-generation-guidance.md`
4. `generation/page-types.manifest.json`
5. `generation/page-slot-boundaries.md` 中命中页型的小节
6. `generation/page-generation-workflow.md`
7. `validation/checklist.md` 中“默认轻量自检”
8. 若要检查真实执行流程，再读 `validation/flow-audit.md`

完全非典型页面生成优先阅读：

1. `generation/design-system-first.md`
2. `generation/shared-page-design-guidance.md`
3. `generation/non-typical-design-principles.md`
4. `generation/hiui5-visual-baseline.md`
5. `generation/non-typical-ai-generation-guidance.md`
6. `generation/non-typical-conversation-output-template.md`
7. `generation/non-typical-few-shot-classification-pack.md`（仅在 family 边界不清时作为证据参考）
8. `generation/non-typical-page-contract.json`
9. `generation/page-family-workflows.manifest.json`
10. `generation/non-typical-workflow-archetypes.json`
11. `generation/non-typical-sample-validation-template.md`
12. `generation/non-typical-sample-batch-template.md`
13. `architecture/non-typical-page-execution-plan.md`
14. `architecture/non-typical-page-readiness-checklist.md`
15. `architecture/non-typical-terminology-migration-plan.md`
16. `architecture/non-typical-generator-ready-manual-review-checklist.md`

非典型页面术语约定：

- `shared-page-design-guidance`：family 之上的共享结构、视觉与设计系统事实源
- `archetype`：仅指执行层 machine contract 使用的内部协调模式词汇，不表示页面模板枚举
- `readiness checklist`：用于记录 validated v1 scope 的公开放行边界、剩余未开放能力与发布收口事实
- `manual review checklist`：用于把翻转 `generatorReady` 前必须人工核对的公开入口收敛成固定范围
- `few-shot`：只用于边界不清时的保守校准，不是页面模板来源

首次接入、异常排查或完整验收时，再阅读：

1. `onboarding/install-and-host.md`
2. `onboarding/host-profiles.md`
3. `generation/design-system-first.md`
4. `generation/generation-principles.md`
5. `generation/hiui5-visual-baseline.md`
6. `generation/figma-page-rules.md`
7. `generation/figma-pages/README.md`
8. `validation/checklist.md` 全量内容
