# hiui-design core

`core/` 是 `hiui-design` 在下游项目中默认分发的页面生成 runtime。

它描述的是**标准 pagegen 项目**的轻量执行面，不描述某个具体业务项目的原型状态，也不承担 maintainer 同步、发布、全局调试或内网上报后端的说明职责。

## Canonical Surface

标准 pagegen 项目默认公开 5 个命令：

- `typical-page:init`
- `typical-page:generate`
- `typical-page:analytics`
- `typical-page:verify`
- `typical-page:verify:visual`

对应语义：

- `init`：确认已接入项目具备可用的 `.local-context/hiui-design` runtime 上下文与根脚本入口
- `generate`：只处理**单页、显式 `--page`** 的典型页生成
- `analytics`：只处理 `data-visualization` 场景，公开入口保持轻量，但内部固定走 `managed-analytics` 交付语义与对应 verify contract；下游项目必须显式提供业务 schema，或复用目标页面目录中已有的 `page.schema.json`
- `verify`：默认结构与关键语义校验入口
- `verify:visual`：高价值页型的可选浏览器级视觉校验入口；若下游项目未内置 official runtime 子应用，则返回 `skipped`，并支持通过 `--url <project-preview-url>` 走项目页面截图模式

其中 `analytics` 的内部标准链路固定为：

```text
brief qualification
  -> business semantic match
  -> chart usage contract
  -> layout strategy / visualBaselinePlan / visualizationRolePlan / writeScope
  -> page write
  -> verify
```

这条链路是命令内部职责，不会扩张成新的公开脚本面。

如果目标项目还没有 `.local-context/hiui-design/`，先执行接入安装，再使用这 5 个命令；不要把“未接入”误判成 cwd 错误或 runtime 故障。

## Supported Modes

- 上述五命令默认适用于已完成接入的 `rules-only` / `host-integration` 标准 pagegen 项目
- `rules-only` / `host-integration` 下普通典型页默认不再把 canonical 当作新项目起点；优先级由 `asset-governance/governance-registry.json` 决定，不允许产出 official-runtime 宿主入口页
- 若项目 mode lock 是 `legacy-host-compatible`，主树默认**不暴露**这组根脚本；普通典型页继续走 planner-selected certified `page-component` / runtime bridge 承接链，reference-only 示例只保留为 parity / fallback evidence，只有隔离出的独立现代运行时入口才重新暴露标准轻量命令面，并且只有该场景允许 `official-runtime`
- `plan-page-task`、doctor、各类 gate、distribution、release 与 maintainer 回归能力可以继续存在，但它们不属于默认项目执行面

## Generation Contract

- `generate` / `analytics` 都必须拿到显式 `--page`，且 `--page` 必须是页面目录
- 当 `--page-type` 缺失但 `--change` 存在时，解析器最多只补齐**单页页型**，不得猜多页拓扑、业务目录或组合页工作流
- `analytics` 会固定把页型收敛到 `data-visualization`，不接受其它页型
- `analytics` 的内部元数据必须稳定产出 `generationStrategy=managed-analytics`、`runtimeFamily=local-managed-analytics`、`assetGovernance.profileId=managed-analytics-shell` 与 `assetGovernance.deliveryRole=managed-analytics-business-shell`
- `legacy-host-compatible` 下若页面生成落在隔离现代运行时子应用，且页型已登记在 `runtime-families/official-runtime-pages.json`，才允许走 `official-runtime`
- `host-integration` / `rules-only` 的 `greenfield` 项目里，多数已声明 `requiredStartFromExample` 且存在对应 archetype 模板的页型，默认优先生成 `reference-asset` 业务页；若页型治理策略显式覆写，则以 `asset-governance/governance-registry.json` 为准
- `canonical asset` 的默认角色是兼容壳、gap fallback 和 parity 对照资产；只有页型尚未具备 `reference-asset` 模板，或显式传入 `--mode canonical` 时，才回退到 canonical。`data-visualization` 是例外：它仍可能复用 canonical source 组件承载图表实现，但治理上不再归类为普通 canonical 兼容壳，而是 `managed-analytics-shell`
- 生成器与校验器都必须读取 `asset-governance/governance-registry.json` 中的 `preferredGenerationModes`、`truthSourcePriority`、`allowedModes` 和 `deliveryRole`；文档描述不得绕过这份机器事实

## Directory Layout

- `generators/`：`init` / `generate` / `analytics` 实现
- `verify/`：`verify-lite` / `verify-strict` / `verify-visual` 实现
- `asset-governance/`：资产角色、真值优先级、推荐模式与适用上下文的机器可读事实源
- `page-assets/`：典型页模板资产、slot schema 与 recipe
- `runtime-families/`：official runtime family 与页型支持登记
- `outputs/`：运行态摘要与校验产物，不是 maintainer 源事实，也不应作为默认接入资产灌入项目

对于 `data-visualization`，`outputs/generate-*.json` 需要额外体现两类信息：

- `analyticsArtifacts.kickoffFacts`：说明 `managed-analytics` 在业务 JSX 之前已经冻结了哪些关键事实
- `generationStrategy / runtimeFamily / assetGovernance.profileId / assetGovernance.deliveryRole`：说明这条链路是 `managed-analytics-shell`，而不是普通 canonical generated page
- `deliveryState / deliveryReadiness`：说明当前结果资产已经达到 `asset-ready / result-ready / binding-ready / release-ready` 的哪一级，并把结果校验、legacy 接线、release 视觉门禁分层展开，而不是再给一组并列布尔值

## Boundary

- `core/` 不承载 global sync、release archive、launch-agent 或发布自动化
- 开源版 `core/` 只负责页面生成与验证输出，不承担 usage telemetry、上报后端或身份材料能力
- 旧 `start-page` / `preflight` / `finalize-page` 写链仍是兼容/退役工具，不再是默认页面生成合同
