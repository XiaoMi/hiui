# legacy-host-compatible 回滚流程

本文只覆盖 `legacy-host-compatible` 接入链路的回滚。目标是撤回 `typical-page:apply:legacy` / `typical-page:legacy:init` 写入的项目级资产，同时不删除业务方已有源码。

## 0. 回滚前核实

- 在目标项目根目录执行 `git status --short`，确认哪些文件是本次接入新增或修改。
- 若目标项目没有 Git 工作区，先复制一份完整项目目录；不要直接删除 `.local-context` 或 `src/hiui-runtime`。
- 若已经执行过安装命令，先记录包管理器与锁文件：`package-lock.json`、`pnpm-lock.yaml`、`yarn.lock`、`bun.lockb`、`bun.lock`。
- 若已经生成业务页面，先记录 `.local-context/hiui-design/outputs/page-contracts/` 下对应页面契约文件；页面回滚必须与契约一起回滚。

## 1. 回滚 `package.json`

- 文件路径：`<project-root>/package.json`。
- 删除或还原 `dependencies.@hiui-design/typical-page-shells`。
- 删除或还原以下脚本：`typical-page:apply`、`typical-page:apply:legacy`、`typical-page:legacy:init`、`typical-page:legacy:new`、`typical-page:legacy:rewrite`、`typical-page:legacy:verify`、`typical-page:legacy:accept`、`typical-page:doctor:integration`。
- 不要删除业务项目原有的 `react`、`react-dom`、`hiui5`、`@hi-ui/*` 依赖；这些依赖可能属于宿主系统。
- 异常场景：如果 `@hiui-design/typical-page-shells` 在接入前已经存在，必须根据 `git diff <project-root>/package.json` 只还原版本号，不要删除依赖。
- 回滚校验：执行 `git diff -- <project-root>/package.json`，确认只撤回 hiui-design 接入项。

## 2. 回滚锁文件

- 文件路径：`<project-root>/package-lock.json`、`<project-root>/pnpm-lock.yaml`、`<project-root>/yarn.lock`、`<project-root>/bun.lockb`、`<project-root>/bun.lock`。
- 优先使用 Git 还原本次接入修改的锁文件。
- 如果没有 Git，只能在恢复 `package.json` 后重新执行项目原本使用的安装命令。
- React 16 项目使用 pnpm 时，若系统 pnpm 要求 Node 18，回滚重装也使用 `npx pnpm@8.6.12 install`。
- 异常场景：如果锁文件包含其它业务分支改动，不要整文件覆盖；先让业务方确认锁文件来源。
- 回滚校验：执行包管理器的只读/冻结安装命令；如果项目没有配置冻结安装，至少确认 `@hiui-design/typical-page-shells` 不再出现在锁文件中。

## 3. 回滚 host contract

- 文件路径：`<project-root>/.local-context/hiui-design/host-contract.json`。
- 如果本次接入前不存在该文件，删除该文件。
- 如果本次接入前已存在该文件，按 Git diff 还原 `adapters`、`hostPack`、`runtime`、`integrationReady` 相关字段。
- 异常场景：如果已有页面仍依赖该 host contract，不要删除；先回滚页面和 page contract。
- 风险点：删除 host contract 会让 `typical-page:legacy:new` / `typical-page:legacy:rewrite` 无法继续生成页面。
- 回滚校验：执行 `test ! -f <project-root>/.local-context/hiui-design/host-contract.json` 或确认文件内容回到接入前版本。

## 4. 回滚 project integration state

- 文件路径：`<project-root>/.local-context/hiui-design/outputs/project-integration-state.json`。
- 如果本次接入前不存在该文件，删除该文件。
- 如果本次接入前已存在该文件，按 Git diff 还原 `mode`、`integrationReady`、`blockingReasons`、`runtimeCompatibilityLock`、`hostContractPath`。
- 异常场景：如果 `integrationReady=false` 是存量状态，不要强行改成 `true`；回滚只恢复接入前事实。
- 风险点：误改该文件会让页面生成流程误判项目已准备好或被阻断。
- 回滚校验：执行 `node .local-context/hiui-design/scripts/plan-page-task.mjs --target <project-root> --mode legacy-host-compatible --page-type table-basic --page src/tmp/check.tsx --change 回滚校验 --json`，确认状态符合预期；如果脚本已删除，则跳过此项。

## 5. 回滚 runtime compatibility lock

- 文件路径：`<project-root>/.local-context/hiui-design/outputs/runtime-compatibility-lock.json`。
- 如果本次接入前不存在该文件，删除该文件。
- 如果本次接入前已存在该文件，按 Git diff 还原 `react`、`react-dom`、`shellRuntimeVariant`、`shellRuntimeStatus`、`modernTarball`、`legacyTarball`。
- 异常场景：React 低于 16.8 的项目不能通过删除 lock 伪装兼容；必须升级 React 或停止 legacy 页面接入。
- 风险点：该文件是 React 16 使用 legacy shell tarball 的证据，误删会导致 doctor 无法区分现代包与 legacy 包。
- 回滚校验：确认文件不存在，或确认 `shellRuntimeStatus` 与接入前一致。

## 6. 回滚项目内 runtime

- 目录路径：`<project-root>/src/hiui-runtime`。
- 如果本次接入前不存在该目录，删除整个目录。
- 如果本次接入前已存在该目录，只删除本次新增的文件：`HiuiLegacyPage.tsx`、`types.ts`、`styles.css`、`page-specs/index.ts`、`page-specs/types.ts`、`page-specs/table-basic.ts`、`page-specs/table-stat.ts`、`page-specs/tree-table.ts`、`page-specs/tree-split.ts`、`page-specs/drawer-form.ts`、`page-specs/drawer-detail.ts`、`page-specs/feedback-status.ts`、`page-specs/full-page-edit.ts`、`page-specs/full-page-detail.ts`。
- 不要删除业务方手写的 runtime adapter、请求封装、权限封装或路由封装。
- 异常场景：如果已有 generated page import 了 `src/hiui-runtime`，先回滚这些页面，否则构建会出现模块找不到。
- 风险点：`src/hiui-runtime` 是唯一允许消费 `@hiui-design/typical-page-shells` 的边界；只删一半会造成 import 断裂。
- 回滚校验：执行 `rg "src/hiui-runtime|@/hiui-runtime|\.\./hiui-runtime" <project-root>/src`，确认没有残留业务页面引用。

## 7. 回滚页面契约与生成页

- 优先使用轻量回滚脚本做 dry-run：`node ".local-context/hiui-design/scripts/typical-page-light-rollback.mjs" --plan <light-plan.json> --json`。
- 确认 dry-run 文件清单只包含本次页面目录、对应 page contract 和对应 legacy acceptance 报告后，再执行：`node ".local-context/hiui-design/scripts/typical-page-light-rollback.mjs" --plan <light-plan.json> --apply --json`。
- 轻量回滚脚本会读取 `hiui-light-page-plan.v1` 的 `writeScope`，任何待删文件越界都会阻断；不要用 `rm -rf` 绕过该阻断。
- 页面文件路径：`<project-root>/src/**/<generated-page>.tsx`。
- 页面契约路径：`<project-root>/.local-context/hiui-design/outputs/page-contracts/*.json`。
- 页面契约说明路径：`<project-root>/.local-context/hiui-design/outputs/page-contracts/*.md`。
- legacy 接受态报告路径：`<project-root>/.local-context/hiui-design/outputs/legacy-acceptance/*.json`。
- 生成报告路径：`<project-root>/.local-context/hiui-design/outputs/*REPORT*.md`。
- 如果页面是本次接入后生成的，删除页面文件、页面样式文件、页面契约文件和对应报告。
- 如果页面保留但撤回本次接受态，只还原页面契约中的 `workflow.legacyAcceptanceStatus`、`workflow.legacyAcceptanceReportPath`、`workflow.legacyAcceptanceSnapshotHash`、`workflow.legacyAcceptanceAcceptedAt`、`workflow.legacyAcceptanceCommand`、`workflow.sourceSnapshotHash` 和 `workflow.lastCommand`，不要删除业务页面。
- 如果已经执行过 `typical-page:legacy:accept`，同步删除或还原对应 `legacy-acceptance/*.json`；不要保留与当前页面源码不匹配的旧 accepted 报告。
- 如果页面文件已有业务修改，不能直接删除；先让业务方确认是撤回整个页面还是只撤回 hiui-design 生成部分。
- 异常场景：如果路由已经接入该页面，必须同步删除路由配置，否则运行时报模块找不到。
- 异常场景：如果 light plan 丢失，先从 page contract 的 `generatedPagePath` 和 Git diff 重建候选清单，再人工逐文件回滚；不要为了省事删除整个 `.local-context/hiui-design/outputs`。
- 风险点：只删除 accepted 报告但不还原 page contract workflow，会让 CI 或 final report 误判页面已经完成 legacy 接受态。
- 回滚校验：执行 `rg "HiuiLegacyPage|PageSpec|typical-page" <project-root>/src`，确认没有本次生成残留；如果页面保留，执行 `rg "legacyAcceptance" <project-root>/.local-context/hiui-design/outputs/page-contracts`，确认接受态字段与回滚目标一致。

## 8. 回滚 `.local-context/hiui-design` 脚本镜像

- 目录路径：`<project-root>/.local-context/hiui-design/scripts`。
- 目录路径：`<project-root>/.local-context/hiui-design/vendor`。
- 如果本次接入前不存在 `.local-context/hiui-design`，可以删除整个 `<project-root>/.local-context/hiui-design` 目录。
- 如果本次接入前已存在 `.local-context/hiui-design`，只删除本次复制的脚本、vendor tarball、host pack、rules、runtime 镜像。
- 异常场景：多个页面或其它 skill 复用同一个 `.local-context` 时，不要整目录删除。
- 风险点：删除脚本镜像后，`package.json` 中残留的 `typical-page:*` 脚本会报文件不存在。
- 回滚校验：执行 `npm run typical-page:doctor:integration` 应该不存在或明确不可运行；如果还存在脚本名，回到第 1 步清理 `package.json`。

## 9. 回滚后验收

- 执行 `git status --short`，确认只保留业务方认可的改动。
- 执行项目原有最小构建或类型检查命令。
- 执行 `rg "@hiui-design/typical-page-shells|HiuiLegacyPage|typical-page:legacy" <project-root>`，确认没有不期望的残留。
- 如果仍保留 `src/hiui-runtime`，执行 `rg "@hiui-design/typical-page-shells" <project-root>/src --glob '!hiui-runtime/**'`，确认业务页没有直接消费 shell 包。
- 如果回滚后仍失败，先判断失败是否来自接入前存量问题；不要把存量样式、历史依赖冲突当成本次回滚失败。
