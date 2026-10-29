# PROJECT_HOST_CONTRACT.json

## 目标

`PROJECT_HOST_CONTRACT.json` 是 hiui-design 当前唯一受支持的项目级宿主事实快照。

它的职责只有三件事：

1. 冻结 `typical-page:preflight` 已经证明过的项目级导航与宿主事实
2. 给 `generation-brief.mjs` / `load-generation-brief.mjs` 提供稳定的页面规划输入
3. 避免页面生成阶段再次源码重扫，减少重复判断、性能损耗和旧规则残留

它不是页面级执行结果，也不是最终交付报告。

## 生成时机

主生成仍只允许由 `typical-page:preflight` 链路完成。

当前实现上，`syncPageTaskStatusFromPreflight()` 会在项目门禁放行评估后写出这份 contract；`writePageTypeCapabilityArtifacts()` 只允许读取它，不再重复刷新它。

在此基础上，页面生成成功后的“受管项目级事实结算”允许对同一份 contract 做受限更新，但边界必须严格收口：

- 只允许在真实受管写入已经成功后执行
- 只允许回写已经物化成功的项目级事实，例如正式业务壳、正式路由注册表、implicit feature base dir、已确认的 MF publish config
- 不允许借这个步骤重新打开 `page-task gate`
- 不允许把 `navigationDecision`、`navigationMountDecision`、`navigationMountAction` 作为第二份项目级快照原样写回 contract

也就是说，post-write settlement 只是把“已经写成了什么项目级事实”补写进 contract，方便后续页面直接复用；真正能放行页面生成的仍然只有 `typical-page:preflight`。

如果项目关键输入漂移，freshness 会关闭页面任务门，并要求重新跑 `typical-page:preflight`；这时下游不能继续复用旧 contract 冒充当前事实。即使 post-write settlement 已经更新过 contract，只要命中了高风险项目级写入，门禁仍必须按 freshness 重新收口。

## 最小必需字段

当前主链路至少依赖这些字段：

- `hostFamily`
- `publishMechanism`
- `defaultBusinessPageDir`
- `managedLocalRuntime`
- `executionContract`
- `formalNavigation`
- `projectEntryMountCapability`

其中 `formalNavigation` 是唯一受支持的项目级导航事实块；下游需要的挂靠判断都必须基于它重新推导，不能再额外依赖第二份 `navigation.*` 或 `projectNavigation.*` 快照。

如果缺少 `formalNavigation`，brief 层必须直接 fail closed。

其中 `projectEntryMountCapability` 只负责冻结“项目入口文件能不能安全承接首个正式业务壳”这一条项目级事实；它不是页面级动作，也不替代后续结合 `routePath`、`title`、`dest` 推导出来的具体挂靠动作。

其中 `executionContract` 是项目级执行机制摘要。它只回答“这个项目已经证明了哪类挂靠执行机制、关键入口在哪里、当前确认度如何”，不直接替某一张页面下 `navigationMountAction` 结论。

其中 `managedLocalRuntime` 只负责冻结“目标项目里的受管本地运行时是否已经物化完成”这一条项目级事实。它至少会写出：

- `status`
- `materialized`
- `root`
- `entryPath`
- `stylePath`
- `blockedBy`
- `missingPaths`
- `reason`

这块字段的边界要保持很窄：

- 它回答的是 `src/components/hiui-design-runtime` 这层是否已经在项目里落盘且可被引用
- 它不替代 `pageTaskReadiness`
- 它不单独代表“接入完成，可开始生成页面”

也就是说，`managedLocalRuntime.materialized=true` 只说明本地运行时基座已经物化；是否真正允许开始页面生成，仍然要继续看 `PROJECT_PAGE_TASK_STATUS.json`。

## 优先级

事实优先级固定如下：

1. 页级显式输入
   例如 `navigationMountContract`、`dest`、`routePath`、`title`
2. `PROJECT_HOST_CONTRACT.json`
   负责项目级默认事实，例如默认业务目录、发布机制、已确认导航证据
3. 不允许再回退到页面生成阶段源码重扫

也就是说：

- `navigationMountContract` 一旦有效，应覆盖 contract 中同类默认导航事实
- contract 不能反向覆盖用户本次任务明确指定的 `entryPath`、`entryKind`、`entryRoutePath`、`entryName`
- contract 缺失或损坏时，不能“碰运气”重新扫仓库补齐

## executionContract 约束

`executionContract` 当前用于显式化项目级执行边界，避免“动作已经拆成 adapter，但合同里仍然只有口头理解”。

它至少包含：

- `kind`
- `enabled`
- `projectScoped`
- `confirmationStatus`

按宿主类型补充的事实块示例：

- `existing-route-registry`
  - `routeRegistry.path`
  - `routeRegistry.kind`
  - `routeRegistry.autoMountSupported`
- `implicit-feature-registry`
  - `implicitFeature.baseDir`
  - `implicitFeature.registryPath`
  - `implicitFeature.entryPattern`
- `greenfield-first-shell`
  - `bootstrap.appEntryPath`
  - `bootstrap.appEntrySupported`
  - `bootstrap.appEntryStrategy`
- `legacy-business-entry`
  - `businessEntry.path`
  - `businessEntry.kind`
  - `businessEntry.selectionBlocked`
- `mf-direct-expose-legacy`
  - `pageSource.defaultBusinessPageDir`
  - `publishEntry.configPath`
  - `publishEntry.managedPublishEntryRequired`
- `manual-contract-only`
  - `reason`

它的边界必须保持稳定：

- 它可以陈述项目级执行机制
- 它不能替代页面级 `navigationMountAction`
- 它不能重新引入第二份项目级导航事实
- 它不能绕过 `formalNavigation` 与 `projectEntryMountCapability`

## mf-direct-expose-legacy 适配器

对 `rules-only + existing-system + Module Federation direct expose`，contract 里会额外固化：

- `hostExecutionAdapter.kind = mf-direct-expose-legacy`

它的目的不是增加一层新逻辑，而是把原来散落在多处的旧式微前端直出判断收口为一个小合同。
它是条件合同，不是所有页面和所有项目都必须带的全局字段；普通正式路由页、普通路由注册表项目和 `same-module-subview` 默认都允许没有 `hostExecutionAdapter`。

这个适配器至少要明确两类事实：

1. 页面源码事实
   例如 `pageSource.defaultBusinessPageDir`、`pageSource.targetBusinessPath`
2. 发布入口事实
   例如 `publishEntry.configPath`、`publishEntry.managedPublishEntryPath`

这两类事实必须分离：

- `ModuleFederationPlugin.exposes` 只能证明发布入口，不单独证明页面源码目录
- 页面源码目录一旦已由项目级事实证明，例如 `src/views`，后续 brief / generator 应直接复用，不再重复猜测

## 只读影子审计

当维护者需要确认“冻结在 `PROJECT_HOST_CONTRACT.json` 里的事实”是否已经和当前项目代码漂移时，使用只读 `shadow audit`：

- 脚本：`scripts/project-host-contract-shadow-audit.mjs`
- 行为：重新执行一次只读项目扫描，但不写回 contract，也不翻转页面任务门禁
- 对比口径：`hostFamily`、`publishMechanism`、`defaultBusinessPageDir`、`formalNavigation`、`executionContract`、`hostExecutionAdapter`、`projectEntryMountCapability`、`evidenceFiles`、`fingerprint`

预期用途只有两个：

1. 收口重构后的短期审计，确认 contract-first 主链没有再和实时扫描分叉
2. 排查“合同看起来存在，但下游规划结果和当前项目事实不一致”的漂移问题

它不是主链默认步骤，也不能回退成长期双写。

如果审计返回 `mismatch`，下一步应重新执行 `typical-page:preflight` 刷新 contract，而不是在 downstream 临时放开源码重扫。

## 轻量扫描基准

当维护者需要用可复跑数字证明“导航重扫已经退出 downstream 主链”时，使用轻量基准：

- 脚本：`scripts/benchmark-contract-first-scan.mjs`
- 输入：一个已经具备项目本地 hiui-design context、并且可通过 `typical-page:preflight` 的目标项目，再加上 `page-type`、`dest`、`title`、可选 `route-path`
- 输出：`preflight` 阶段与 downstream `generation-brief -> plan-page-task -> generate-page-from-brief --dry-run` 的分相耗时与 trace 计数

当前基准只把下面三类事件记为“导航重扫”：

- `detectFormalNavigation`
- `inspectAppEntryMountPlan`
- `evaluateProjectGenerationReadiness`

也就是说，它证明的是“项目级导航与挂靠事实没有在 downstream 主链里再次重扫”；若结果里仍出现 `detect-host-profile` 这类辅助画像扫描，它会单独列成观察项，不冒充成导航重扫结论。

## Fail-Closed 规则

以下情况都必须直接阻断：

- `PROJECT_HOST_CONTRACT.json` 缺失
- contract 存在但 `formalNavigation` 缺失
- contract 存在但 `executionContract` 缺失
- contract 存在但与页面任务门的 freshness 不一致
- contract 中已声明的受管最小宿主事实无效

阻断后的下一步不是“继续生成试试看”，而是重新执行 `typical-page:preflight` 或先修 contract 自身。
