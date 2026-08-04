# legacy-host-compatible 轻量交付边界

本文定义 `hiui-design` 在 legacy 宿主项目中的最小提交边界。目标是让页面生成保持轻量、可复查、可回滚，同时避免把整套 skill 工作台提交进业务仓库。

## 默认同步边界

`typical-page:apply:legacy` 默认使用 `--sync-profile minimal`。minimal 只同步页面生成、legacy runtime 接入、计划、合同和验收所需资产；维护者需要本地排查模板、示例或测试时，才显式使用 `--sync-profile workbench` 或 `--include-workbench`。

## 可以提交

- `src/hiui-runtime/**`：legacy runtime 受管边界，由接入脚本维护。
- 业务页面目录：轻量计划 `pagePath` 对应目录下的 `page.instance.tsx`、`page.slots.ts`、必要时 `page.request.ts`。
- `.local-context/hiui-design/host-contract.json`：宿主接入事实源。
- `.local-context/hiui-design/outputs/light-plans/**`：本次页面生成的轻量计划。
- `.local-context/hiui-design/outputs/page-contracts/**`：页面合同与 markdown 摘要。
- `.local-context/hiui-design/outputs/legacy-acceptance/**`：preview 或 delivery 验收报告与证据索引。
- `.local-context/hiui-design/docs/**`：诊断与基线文档，minimal profile 需要保留给 doctor、迁移和验收复核。
- `.gitignore` 中的 `hiui-design managed boundary` block：用于防止输出和 workbench 资产误入提交。

## 默认不提交

- `.local-context/hiui-design/core/outputs/**`：历史本地生成输出，不属于页面交付证据。
- `.local-context/hiui-design/examples/**`：示例资产，只用于参考。
- `.local-context/hiui-design/reference/**`：参考工程资产，只用于维护者排障。
- `.local-context/hiui-design/scripts/tests/**`：skill 自测资产，不属于业务项目交付。
- 临时截图、浏览器缓存、手工调试中间文件：必须由验收报告引用后再决定是否保留。

## 异常场景

- 如果业务项目已经集中管理 `.local-context/hiui-design` 的提交策略，可在 `.gitignore` 放置 `# hiui-design:disable-managed-gitignore`，bootstrap 会跳过自动写入。
- 如果 delivery 验收依赖内网真实宿主截图，截图必须进入 `.local-context/hiui-design/outputs/legacy-acceptance/**` 并由报告引用，不能散落在页面目录。
- 如果必须提交 workbench 资产，需要在变更说明中标注原因，并使用 `--sync-profile workbench` 重新同步，避免把 accidental copy 当成默认行为。
- 如果 `generated-blocked` 已产生文件但未通过 gate，可以保留文件继续修复；不得把 blocked 报告包装成 delivery 完成态。

## 风险点

- 不提交 light plan 会导致后续无法证明页面是从哪个受管输入生成的。
- 不提交 page contract 会导致验收无法追踪页面类型、写入边界和 workflow 状态。
- 提交整套 workbench 会放大 diff，掩盖真正业务变更，并增加误改 skill 内部脚本的风险。
- 只提交截图不提交验收报告，会让截图无法关联 runtimeUrl、viewport、pageType 和页面路径。

## 回滚操作

- 回滚单页生成：按 light plan 的 `writeScope` 删除对应 `page.instance.tsx`、`page.slots.ts`、`page.request.ts` 和关联 page contract。
- 回滚验收证据：删除 `.local-context/hiui-design/outputs/legacy-acceptance/<page-slug>*`，保留 light plan 和 page contract 以便重新验收。
- 回滚 workbench 同步：删除 `.local-context/hiui-design/examples`、`.local-context/hiui-design/reference`、`.local-context/hiui-design/scripts/tests`，再运行 `typical-page:apply:legacy --sync-profile minimal`。
- 回滚 `.gitignore` 自动边界：删除 `# >>> hiui-design managed boundary >>>` 到 `# <<< hiui-design managed boundary <<<` 之间的 block；如果项目有自定义边界，改用 `# hiui-design:disable-managed-gitignore` 明确禁用自动写入。
