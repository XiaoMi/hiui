# legacy-host-compatible 轻量链路 CI 命令

本文定义轻量页面链路在 CI 或提测前的推荐检查。目标是用少量命令证明“输入、生成、验收、提交边界”没有跑偏。

## 必跑命令

```bash
node scripts/verify-light-flow-regressions.mjs --suite focused
```

展开后等价覆盖：`sync-archetype-assets.test.mjs`、`bootstrap-target-project.test.mjs`、`legacy-new-lightweight.test.mjs`、`legacy-rewrite-lightweight.test.mjs`、`legacy-acceptance-runner.test.mjs`、`legacy-ci-gate.test.mjs`、`light-readiness.test.mjs`、`light-rollback.test.mjs`。

## Gate 覆盖

- `sync-archetype-assets.test.mjs`：证明 minimal/workbench 同步边界没有漂移。
- `bootstrap-target-project.test.mjs`：证明 bootstrap 能写入 sync profile 和 `.gitignore` 边界。
- `legacy-new-lightweight.test.mjs`：证明新建页面必须消费 light plan，并自动运行 writeScope、slotGate 和 changeSize。
- `legacy-rewrite-lightweight.test.mjs`：证明重写页面不回退旧 page-component carrier。
- `legacy-acceptance-runner.test.mjs`：证明 preview/delivery 状态分层、runtimeCapture、visualEvidence、domGeometry、adapterGate 都进入验收闭环。
- `light-readiness.test.mjs`：证明最终 readiness 汇总不会把 preview 冒充 delivery。
- `light-rollback.test.mjs`：证明回滚默认 dry-run，并受 writeScope 保护。

## 发布前扩展命令

```bash
node scripts/verify-light-flow-regressions.mjs --suite full
```

`full` 会额外覆盖 `light-page-plan.test.mjs`、`write-scope-gate.test.mjs`、`change-size-gate.test.mjs`、`light-slot-gate.test.mjs`、public CLI contract、脚本入口、文档、feature flag 和独立 gate 测试。

## CI 环境变量

- `HIUI_DESIGN_SYNC_PROFILE=minimal`：确保 CI 不把 workbench 资产当默认交付边界。
- `HIUI_DESIGN_DISALLOW_UNSAFE_MANUAL=1`：阻断 `--unsafe-manual`。
- `HIUI_DESIGN_ACCEPTANCE_PROFILE=delivery`：发布前默认按 delivery 语义验收。
- `HIUI_DESIGN_CHANGE_SIZE_MAX_FILES` 和 `HIUI_DESIGN_CHANGE_SIZE_MAX_LINES`：按团队阈值调整变更体积 gate。
- `HIUI_DESIGN_ALLOW_PROVIDED_HOST_EVIDENCE=1`：只在 CI 无法直接访问真实宿主、且 evidence 来源由外部系统可信生成时临时使用。

## 异常场景与处置

- CI 缺真实宿主 URL：只能通过 preview-ready，不能标记 delivery-ready。
- delivery 需要内网权限：把 `typical-page:legacy:accept --profile delivery --runtime-url <真实宿主URL>` 放在有权限的 runner。
- 测试因已有 fixture 漂移失败：先确认是规则变更还是 fixture 过期，不要直接降低 gate。
- 变更体积 gate 失败：拆分页面改动或调整阈值；不要删除 changeSize gate。

## 回滚

- 若新 CI gate 误杀，先把发布 profile 临时降到 `preview`，保留脚本和报告继续排查。
- 若 minimal manifest 漏同步文件，补 manifest 并新增测试；不要把默认 profile 改回 workbench。
- 若 delivery evidence 无法稳定采集，保留 preview-ready 作为开发完成态，把 delivery-ready 放到有真实宿主权限的环境执行。

## 页面级 CI gate

- 开发提测可使用 `typical-page:ci-gate --legacy-acceptance <report.json> --legacy-acceptance-profile preview`。
- 发布前必须使用 `typical-page:ci-gate --legacy-acceptance <report.json> --legacy-acceptance-profile delivery`；该模式只接受 `delivery-ready`，不会把 `preview-ready` 当交付完成。
