# legacy-host-compatible 轻量链路迁移指南

本文用于把已接入或正在接入 `hiui-design` 的 legacy 项目迁移到轻量页面生成链路。迁移目标不是新增复杂流程，而是把 AI 页面生成的关键事实前置到脚本内，避免最后才靠人工校验纠偏。

## 迁移前核实

1. 在目标项目执行 `git status --short`，确认当前业务改动边界。
2. 确认已有接入模式：读取 `.local-context/hiui-design/outputs/project-mode.json` 和 `.local-context/hiui-design/host-contract.json`。
3. 确认 React 版本仍满足 legacy runtime 要求；React 16.8 到 16.13.x 使用 `.local-context/hiui-design/vendor/hiui-design-typical-page-shells-0.1.2-legacy.tgz`。
4. 如果项目已有生成页，记录对应 `page.instance.tsx`、`page.slots.ts`、`page.request.ts`、page contract 和 legacy acceptance report。

## 迁移步骤

1. 重新同步最小资产：`typical-page:apply:legacy --sync-profile minimal`。如果当前项目需要维护者调试资产，才使用 `typical-page:apply:legacy:workbench`。
2. 为每个待生成或待重写页面补 light plan：`typical-page:light-plan --page-type <id> --page <page-path> --summary <summary>`。
3. 新建页面使用 `typical-page:legacy:new --plan <light-plan.json>`；重写页面使用 `typical-page:legacy:rewrite --plan <light-plan.json>`。
4. 生成后先看生成状态：`generated-not-accepted` 可以进入验收；`generated-blocked` 必须先修复 `slotGate`、`changeSize` 或 `writeScope` 问题。
5. 本地预览闭环运行 `typical-page:legacy:accept --profile preview`；真实交付闭环运行 `typical-page:legacy:accept --profile delivery --runtime-url <真实宿主URL>`。
6. 提交前运行 `typical-page:light-readiness --plan <light-plan.json> --profile preview|delivery`，确认 plan、writeScope、slotGate、adapterGate 和 acceptance report 一致。

## 旧链路替换规则

- 旧命令 `typical-page:legacy:new --page-type <id> --page <path> --change <summary>` 替换为 `typical-page:light-plan` 加 `typical-page:legacy:new --plan <light-plan.json>`。
- 旧命令 `typical-page:legacy:rewrite --page-type <id> --page <path> --change <summary>` 替换为 `typical-page:light-plan` 加 `typical-page:legacy:rewrite --plan <light-plan.json>`。
- `--unsafe-manual` 只允许本地调试；CI、自动化脚本或受管生成任务不得依赖它。
- 旧 `accepted` 报告只作为兼容别名；新增交付判断必须使用 `preview-ready` 或 `delivery-ready`。

## 异常场景

- light plan 无法生成：先修正 pageType、pagePath 或 mode，不要临时手写页面绕过。
- minimal 同步后命令缺文件：这是 manifest 缺失，先补 `config/legacy-minimal-sync-manifest.json`，不要切回永久 workbench 默认。
- delivery 验收失败：优先检查 runtimeCapture 是否来自真实宿主，再检查 visualEvidence、domGeometry 和 adapterGate。
- 写入边界失败：只扩大当前页面必要的 `writeScope`，不要使用 `**/*` 或项目根目录通配。
- 页面已被业务手改：先用 Git diff 判断是否仍能由 light plan 回滚；不能确认时停止自动回滚。

## 风险点

- 没有 light plan 的页面无法证明生成输入，后续验收和回滚都会缺证据。
- 把 `workbench` 当默认同步会再次放大业务仓库 diff，掩盖真正页面改动。
- 把 preview 结果当 delivery 使用，会让本地 smoke 页面冒充真实宿主页面。
- 绕过 `writeScope` 删除文件，可能误删业务手写代码。

## 回滚

- 单页迁移回滚：先执行 `typical-page:light-rollback --plan <light-plan.json> --json` 查看清单，再执行 `--apply`。
- 接入资产回滚：按 `docs/onboarding/legacy-host-compatible-rollback.md` 恢复 `package.json`、锁文件、host contract、runtime 和 `.local-context/hiui-design`。
- workbench 误同步回滚：删除 `.local-context/hiui-design/examples`、`.local-context/hiui-design/reference`、`.local-context/hiui-design/scripts/tests`，再运行 `typical-page:apply:legacy --sync-profile minimal`。
