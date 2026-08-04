# legacy runtime provenance 与 canonical shell 证明

本文定义 `legacy-host-compatible` 下 `src/hiui-runtime` 的受管证明规则。目标是防止页面表面仍走 `page.instance.tsx -> src/hiui-runtime/pages/<PageType>Page` 或兼容 facade `HiuiLegacyPage`，但 runtime 内部被项目改成 primitive renderer，导致 PageSpec、typed slots 与验收报告失真。

## 受管主链

合法主链固定为：

1. `typical-page:apply:legacy` 写入 host contract、runtime compatibility lock、runtime seal 与官方 runtime core。
2. `typical-page:light-plan` 读取接入事实，只生成当前页轻量计划。
3. `typical-page:legacy:new|rewrite --plan <light-plan.json>` 只写 `page.instance.tsx`、`page.slots.ts`、必要 `page.request.ts` 与 page contract。
4. `typical-page:legacy:verify` 验证业务页入口、typed slots、runtime seal、canonical shell binding、runtime provider contract、primitive region fallback 与 remote expose。
5. `typical-page:legacy:accept --profile preview|delivery` 在 static gate 后继续验证 runtime provenance、shell binding、runtime provider、peer/export、build warning、runtime capture、DOM geometry、visual evidence 与 adapter gate。

## runtime seal

`.local-context/hiui-design/outputs/runtime-seal.json` 是 `src/hiui-runtime` 的机器事实源，至少记录：

- `schemaVersion=runtime-seal.v1`
- `mode=legacy-host-compatible`
- `runtimeCoreVersion`
- `rulesVersion`
- `sealedCoreFiles[]`：官方 runtime core 文件及 `sha256`
- `allowedExtensionGlobs[]`：允许项目扩展的 adapter / host override 路径
- `canonicalShellByPageType`：每个 page type 必须绑定的标准 shell
- `criticalImportsByPageType`：每个 page type 的必要 shell import

默认 sealed core 包含：

- `src/hiui-runtime/HiuiLegacyPage.tsx`
- `src/hiui-runtime/pages/**`
- `src/hiui-runtime/shared/**`
- `src/hiui-runtime/page-specs/**`
- `src/hiui-runtime/types.ts`
- `src/hiui-runtime/styles.css`

默认 allowed extension 包含：

- `src/hiui-runtime/adapters/**`
- `src/hiui-runtime/host-overrides/**`

## canonical shell binding

PageSpec 中的 `shell` 必须绑定到 runtime 的真实实现，不能只写 DOM marker 或注释自证。

- `table-basic` / `tree-table` 必须绑定 `TablePageFrame`。
- `table-stat` 必须绑定 `StatListPageFrame`。
- `tree-split` 必须绑定 `TreeSplitPageFrame`。
- `drawer-form` 必须绑定 `ProFormDrawer`。
- `drawer-detail` 必须绑定 `ProDetailDrawer`。
- `full-page-edit` 必须绑定 `ProEditPage`。
- `full-page-detail` 必须绑定 `ProDetailPage`。

默认新生成的 `page.instance.tsx` 直接 import 对应 page type 的拆分入口，例如 `src/hiui-runtime/pages/TableBasicPage.tsx`；`HiuiLegacyPage.tsx` 仅作为旧合同兼容 facade，不再作为新页面默认入口。

## runtime provider contract

当官方 shell runtime 在目标项目依赖图中不可用时，不能把业务页改成原生手写页；只能声明受管 runtime adapter：

- 合同文件：`.local-context/hiui-design/outputs/runtime-provider-contract.json`
- schema：`schemas/runtime-provider.schema.json`
- provider：`project-runtime-adapter`
- runtime entry：必须在 `src/hiui-runtime/adapters/**`
- component：必须通过 `componentName` 被 `page.instance.tsx` import
- slots：必须 `consumesTypedSlots=true`，不能写死业务字段
- shell：`canonicalShell` 必须与 PageSpec 一致
- regions：`regionMarkers` 必须覆盖 page type 必需 region

## primitive region fallback 禁止项

`hiui5` 可以在 adapter、managed component 或 shell carrier 内部使用，但不得承担 locked region owner。

禁止：

- 在 `table-basic` / `tree-table` 分支直接渲染 `hiui5` 的 `Table`、`Pagination` 或 `QueryFilter` 作为表格页主体。
- 在 runtime 中引入 `NativeListPage`、`NativeTablePage`、`NativePagination` 等本地 primitive renderer 替代 canonical shell。
- 只保留 `data-hiui-legacy-shell="TablePageFrame"`，真实 DOM 或 source 却不绑定 `TablePageFrame`。

允许：

- `Button` 用于 header / row actions。
- `Input`、`Select` 用于 field adapter。
- `EmptyState` 用于空态 slot。
- `src/hiui-runtime/adapters/**` 中的宿主 request、message、permission、route、theme、field render bridge。

## 异常场景

- runtime seal 缺失：`legacy:verify` 输出 `runtime.seal.missing`，提示重新运行 `typical-page:apply:legacy`。
- sealed core hash 不一致：输出 `runtime.core.mutated`；除官方 migration stamp 外不得继续验收。
- canonical shell import 缺失：输出 `runtime.shellImport.missing`。
- page type 分支未渲染 canonical shell：输出 `runtime.canonicalShell.missing`。
- primitive 接管 locked region：输出 `runtime.primitiveRegionFallback.disallowed`。
- peer/export resolution blocked：输出 `runtime.peerResolution.blocked`，不得继续生成或验收。
- runtime provider contract 无效：输出 `runtimeProvider.*`，不得用 adapter 绕过 PageSpec、typed slots 或 region ownership。

## 风险点

- 全量 hash 会误伤合法宿主扩展，因此只 seal runtime core，不 seal allowed extension。
- 正则 source gate 可能误判复杂 TSX，第一期必须保守匹配，第二期再迁移到 AST。
- `@hiui-design/typical-page-shells/schema-field-map` subpath 当前 legacy tarball 存在，但是否兼容所有宿主 bundler 需要 fixture smoke 后再设为强规则。
- 多版本 HiUI 并存不应直接失败；critical export、canonical shell 或 runtime provider contract 失败才 blocked。

## 回滚操作

1. 回滚 runtime seal：删除 `.local-context/hiui-design/outputs/runtime-seal.json`，重新运行 `typical-page:apply:legacy --force`。
2. 回滚 runtime core：按 `runtime-seal.json.sealedCoreFiles[].sourcePath` 从 hiui-design 源恢复，或运行 `typical-page:apply:legacy --force`。
3. 回滚 peer gate：迁移窗口内可临时把 peer gate 降为 warn，但 CI 不允许跳过。
4. 回滚 canonical shell gate：仅允许维护者临时降级为 warn；业务交付不得把 warn 当作 delivery-ready。
5. 回滚 runtime provider：删除 `.local-context/hiui-design/outputs/runtime-provider-contract.json` 和对应 `src/hiui-runtime/adapters/**` 文件，重新运行 `typical-page:legacy:new|rewrite --plan <light-plan.json>` 让页面回到官方 runtime 入口。
6. 回滚 runtime 拆分：用官方发布的上一版 runtime 恢复，不得改成业务页本地 primitive renderer。
