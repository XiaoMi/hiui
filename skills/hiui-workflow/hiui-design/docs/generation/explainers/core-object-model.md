# Core Object Model

- `page-task-plan.v1`：唯一顶层执行计划。
- `generationRecipe`：计划内的生成子协议，描述 starting point、assembly order、required assets、forbidden moves 与 inline checks。
- `host-contract`：legacy 接入时的宿主边界事实。
- `typical-page-contract`：典型页骨架、DOM region、ownership、slot schema 与视觉 token 的事实源。
- `HiuiLegacyPage`：legacy 主链唯一页面 runtime，负责消费 compiled PageSpec 与 typed page slots。
- `compiled PageSpec`：由 `rules/typical-page-contracts/<pageType>.json` 编译出的 DOM region、ownership、slot schema 与视觉 token 事实。
- `page slots`：业务页唯一可填充面。
- `acceptanceProfile` / `preflight-report.v1` / `hiui-page-governance-report.v1` / `finalReportContract`：交付与验收事实。

`legacy-host-compatible` 不再定义 page-component carrier、wrapper、adapter 或桥接 profile 对象。
