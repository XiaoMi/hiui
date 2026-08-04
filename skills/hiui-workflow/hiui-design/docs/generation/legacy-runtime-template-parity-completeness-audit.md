# Legacy Runtime Template Parity Completeness Audit

## Audit Metadata

- Generated At：2026-08-04T01:23:12.139Z
- Requirements Source：`/Users/guorui/Documents/skills/hiui-design/docs/generation/legacy-runtime-template-parity-requirements.json`
- Original Attachment：`/Users/guorui/.codex/attachments/725d2c25-9607-45e0-a5f3-1a68197b449f/pasted-text.txt`
- Step Ledger：`/Users/guorui/Documents/skills/hiui-design/docs/generation/legacy-runtime-template-parity.md`
- Output Path：`/Users/guorui/Documents/skills/hiui-design/docs/generation/legacy-runtime-template-parity-completeness-audit.md`

## Completion Summary

- Attachment Steps：131
- Expected Steps：131
- Ledger Covered Steps：131
- Done Steps：129
- Blocked Steps：2
- Missing In Ledger：0
- Missing File/Action/Exception/Risk/Rollback Text：0
- Extra Ledger Follow-Up Steps：15

## Blocking Items

- 22.6 运行物流页 delivery acceptance：Static gate, build with `NODE_OPTIONS`, runtime DOM, geometry, visual screenshot existence, and warning classification now pass with local React16 harness evidence; persisted delivery report still fails only because runtime capture is `provided-local` and delivery visual evidence requires a non-local runtime URL. Risk：Treating local harness evidence as delivery would overclaim production readiness. Rollback/Next：Keep failed delivery report, provide a real non-local host URL, then re-run acceptance without a waiver.
- 22.7 运行 9 页型 runtime acceptance：Under `HIUI_RUNTIME_PARITY_EXPOSES=1`, all 9 parity pages render through Module Federation with 0 console warnings/page errors and all 9 `*.dom-geometry.delivery.json` files report `ok:true`; this is still local harness evidence, not delivery-ready host evidence. Risk：Treating env-gated local exposes as production delivery would overclaim readiness. Rollback/Next：Keep parity exposes behind `HIUI_RUNTIME_PARITY_EXPOSES=1`; use a governed non-local host preview URL for delivery, then rerun acceptance.

## Extra Follow-Up Steps

- 0.4 Preserve original 131-step source：status=done；evidence=Machine-readable source keeps all 131 original attachment steps with file, action, exception, risk, rollback-or-validation text, and source line numbers.；risk=Rebuilding the source from memory can reintroduce omitted steps.；rollback=Regenerate from the original attachment only, then rerun completeness tests.
- 3.7.1 Legacy shell query component handoff：status=done；evidence=Legacy tarball rewrite now changes `pro-list-page/bridge/query-filter.js` so `filterFields[].component` is the official schema-field-map control element, not a wrapper component entering HiUI `Form.Item`; local React16 runtime evidence now has 0 `FormField must pass a valid element as children.` warnings.；risk=Rewriting vendored dist code can drift if upstream minified output changes.；rollback=Rebuild from the unpatched source tarball by reverting `rewriteQueryFilterBridgeFile`, then rerun `node scripts/build-legacy-shell-tarball.mjs`.
- 3.7.2 Legacy shell append null filter：status=done；evidence=Legacy tarball rewrite filters nullable `append` actions before passing them to HiUI `QueryFilter`, preventing empty `Form.Item` children when the clear button is hidden.；risk=Filtering falsy append entries would drop intentional `0`/empty-string custom append values, which are not valid QueryFilter action elements.；rollback=Remove `.filter(Boolean)` from the tarball rewrite and rebuild.
- 3.7.3 Sync patched shell tarball：status=done；evidence=Skill and target legacy tarballs share SHA-256 `cc3dc4b75cc46aba3c6e941a07d66d270310a51e4931860fec6fbf796c995830`; `pnpm update @hiui-design/typical-page-shells --ignore-scripts --latest` installed the patched package.；risk=Lockfile integrity must be updated together with the tarball, or target can reinstall the stale package from pnpm store.；rollback=Restore the prior tarball and `pnpm-lock.yaml`, then rerun `pnpm install --ignore-scripts --force`.
- 3.7.4 Restrict React shared fallback：status=done；evidence=Module Federation shared config now pins `react` and `react-dom` to project root `16.13.1` via `requiredVersion` and `import: require.resolve(...)`; build output provides only root React/ReactDOM fallback modules.；risk=A real host with incompatible React still needs host-level resolution instead of hiding the warning.；rollback=Restore the previous `{ singleton:true }` shared config and rebuild.
- 3.7.5 Empty query renderer contract：status=done；evidence=`toSchemaQueryField` emits empty `renderer:{}` so `@hi-ui/schema-core` receives a complete field shape while QueryFilter still resolves actual controls through `shared-query-filter-skin`.；risk=Adding `renderFormItem` or a non-empty renderer would bypass the shared skin.；rollback=Remove `renderer:{}` only after verifying upstream no longer dereferences `field.renderer`.
- 3.7.6 Empty renderer policy exception：status=done；evidence=`definesCustomQueryFieldRenderer` strips empty `renderer:{}` before blocking `renderFormItem` or non-empty renderer definitions.；risk=Regex scanning can miss computed renderer expressions.；rollback=Restore stricter scan and mark schema-field runtime blocked if false positives reappear.
- 8.11 Edit official header：status=done；evidence=Header portal renders HiUI `PageHeader` with title and `headerExtra`; local parity runtime evidence records header height `60` and no page errors.；risk=Replacing it with plain text collapses header rhythm.；rollback=Revert only with a matching geometry-gate threshold update.
- 9.2.1 Form renderer contract：status=done；evidence=`resolveFormFields` emits empty `renderer:{}` for every schema form field, preventing `SchemaForm` from reading `undefined.renderFormItem` while still using the official field map fallback.；risk=Adding a custom `renderFormItem` here would recreate primitive rendering drift.；rollback=Remove `renderer:{}` only after verifying a fixed upstream `SchemaForm` no longer dereferences `field.renderer`.
- 10.6 Detail official header：status=done；evidence=Header portal renders HiUI `PageHeader`; local parity runtime evidence records header height `60`.；risk=Plain text headers collapse the page rhythm.；rollback=Restore previous detail header only with a matching gate update.
- 10.7 Detail white-body stretch：status=done；evidence=`.pro-detail-page`, its loading wrapper, and `.hiui-legacy-full-detail` are flex-owned so local parity geometry reports `whiteBody.bottom === root.bottom`.；risk=Overriding upstream shell class names can drift if the shell package renames them.；rollback=Remove the override and block full-page-detail delivery until upstream provides a flex detail shell.
- 20.9 Completeness audit test：status=done；evidence=Test proves the requirements source has 131 steps, the ledger covers all 131, every ledger row has file/evidence/risk/rollback text, and the managed audit generator reports missing counts as zero.；risk=The test protects completeness structure, not delivery blockers.；rollback=Remove the test only if another machine gate replaces the same assertions.
- 23.7 Reproducible audit generation：status=done；evidence=Script regenerates `docs/generation/legacy-runtime-template-parity-completeness-audit.md` from the requirements JSON and current ledger; target mirror execution returns status `blocked` with `ledgerCoveredSteps:131` and zero missing text.；risk=A hand-edited report can drift from the ledger unless regenerated.；rollback=Re-run the generator after ledger changes; if removing it, delete the generated audit and its tests together.
- 23.8 Bridge provenance audit：status=done；evidence=Script checks installed `@hiui-design/typical-page-shells` shell exports together with target runtime wiring for `@hi-ui/schema-core`, `@hi-ui/schema-group/descriptions`, and the governed feedback carrier; current target evidence is persisted at `/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/outputs/legacy-acceptance/upstream-blockers.latest.json`.；risk=A future bridge export rename can still require source refresh, so this audit must remain evidence for the current contract shape rather than a substitute for upstream release notes.；rollback=Delete the script, test, manifest entry, and generated evidence JSON together if bridge provenance moves to an official package metadata contract.
- 23.9 Delivery blocker evidence audit：status=done；evidence=Script checks the logistics delivery report and all 9 parity runtime evidence files for non-local host URLs, delivery geometry, screenshot existence, and viewport metadata; current target evidence is persisted at `/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/outputs/legacy-acceptance/delivery-blockers.latest.json` and reports local runtime evidence as blocked.；risk=This audit proves evidence readiness, not visual correctness beyond the existing DOM geometry gates; a false non-local URL can still need host ownership review.；rollback=Delete the script, test, manifest entry, and generated evidence JSON together if delivery evidence becomes enforced only inside `typical-page-legacy-accept.mjs`.

## Requirement-By-Requirement Audit

### 0.1 锁定治理范围

- 需求源行：5
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/HiuiLegacyPage.tsx:19`
- 落地动作：确认本轮只治理 `HiuiLegacyPage` lightweight runtime 覆盖的 9 个页型：`table-stat`、`table-basic`、`tree-table`、`tree-split`、`drawer-form`、`drawer-detail`、`full-page-edit`、`full-page-detail`、`feedback-status`
- 异常场景：如果后续发现 `data-visualization` 也接入了另一条 runtime，不纳入本轮，另开专项
- 风险点：把非本链路页型混入会导致修复边界失控
- 回滚操作：不改代码，仅在方案文档中标注 `data-visualization` 为 out-of-scope
- 当前状态：done
- 权威文件：`runtime/legacy/src/HiuiLegacyPage.tsx`
- 当前证据：Runtime router covers the 9 listed page types.
- 当前风险：Including non-runtime page types would expand scope incorrectly.
- 当前回滚：Revert only documentation scope notes.

### 0.2 锁定页型类型定义

- 需求源行：7
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/types.ts:1`
- 落地动作：逐页型核对 `LegacyPageType` union 与 `LegacyPageSlotsByType`，确认每个页型需要哪些 slots
- 异常场景：若某页型 slot 不足以表达官方模板能力，例如 `tree-table` 缺树结构 slot，应标记为 schema gap
- 风险点：只改 renderer 不改 slot schema 会继续生成语义不足页面
- 回滚操作：还原 `types.ts`，并在页型 contract 标 blocked
- 当前状态：done
- 权威文件：`runtime/legacy/src/types.ts`
- 当前证据：`LegacyPageType` and `LegacyPageSlotsByType` enumerate all 9 page types.
- 当前风险：Renderer-only changes can hide schema gaps.
- 当前回滚：Revert `types.ts` and mark affected contracts blocked.

### 0.3 建立差异台账

- 需求源行：9
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/docs/generation/legacy-runtime-template-parity.md:1`
- 落地动作：新增文档，逐页型记录 runtime、strict template、contract、acceptance gate 的差异
- 异常场景：若仓库不接受新增文档，则改写到 `/Users/guorui/Documents/skills/hiui-design/docs/generation/delivery-gates.md:1` 的新章节
- 风险点：没有台账会导致后续只修眼前页面
- 回滚操作：删除该新增文档或移除新增章节
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：This file records page-type parity, gates, risks, and rollback.
- 当前风险：Without a ledger, future work can collapse back to page-local fixes.
- 当前回滚：Delete this file.

### 1.1 修 root flex 容器

- 需求源行：13
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：给 `[data-hiui-page-root='legacy-host-compatible']` 添加 `display:flex`
- 异常场景：宿主外层不是 flex 高度链时，`display:flex` 本身不足以撑满
- 风险点：只加 `display:flex` 不加方向和高度会形成半修复
- 回滚操作：删除新增的 `display:flex`
- 当前状态：done
- 权威文件：`runtime/legacy/src/styles.css`
- 当前证据：Root selector declares `display:flex`.
- 当前风险：Host block layout may still lack height chain.
- 当前回滚：Remove the declaration.

### 1.2 修 root 纵向排列

- 需求源行：15
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：添加 `flex-direction:column`
- 异常场景：若某 drawer 页型不需要纵向主页面结构，应通过 drawer 自身 region 排除，而不是取消 root 规则
- 风险点：缺失该属性会导致 header、white-body、footer 关系不可预测
- 回滚操作：删除新增的 `flex-direction:column`
- 当前状态：done
- 权威文件：`runtime/legacy/src/styles.css`
- 当前证据：Root selector declares `flex-direction:column`.
- 当前风险：Missing column flow breaks header/body/footer rhythm.
- 当前回滚：Remove the declaration.

### 1.3 修 root 弹性伸展

- 需求源行：17
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：添加 `flex:1 1 0%` 与 `align-self:stretch`
- 异常场景：若宿主 slot 是 block 而不是 flex item，`flex` 不生效，需要宿主 adapter 另补高度
- 风险点：误以为 `flex` 单独能解决所有高度问题
- 回滚操作：删除新增的 `flex` 和 `align-self`
- 当前状态：done
- 权威文件：`runtime/legacy/src/styles.css`
- 当前证据：Root selector declares `flex:1 1 0%` and `align-self:stretch`.
- 当前风险：Flex only works when host parent permits it.
- 当前回滚：Remove the declarations.

### 1.4 修 root 最小高度链

- 需求源行：19
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：添加 `min-height:0`
- 异常场景：如果宿主没有明确高度，`min-height:0` 只能防止溢出，不能创造高度
- 风险点：缺少 `min-height:0` 时内层滚动区可能撑破父容器
- 回滚操作：删除新增的 `min-height:0`
- 当前状态：done
- 权威文件：`runtime/legacy/src/styles.css`
- 当前证据：Root selector declares `min-height:0`.
- 当前风险：Missing min-height can force parent overflow.
- 当前回滚：Remove the declaration.

### 1.5 评估 root 高度声明

- 需求源行：21
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：根据宿主事实决定使用 `height:100%`、`min-height:100%` 或不加固定高度，并在 parity 文档说明
- 异常场景：错误加 `height:100vh` 会覆盖微前端宿主内容区高度
- 风险点：这里不能拍脑袋；缺少宿主高度事实时不得硬编码 `100vh`
- 回滚操作：撤销新增的 `height/min-height` 具体值，保留 `flex/min-height:0`
- 当前状态：done
- 权威文件：`runtime/legacy/src/styles.css`
- 当前证据：Root selector uses `height:100%`, not `100vh`.
- 当前风险：Hardcoding viewport height would break micro-frontend hosts.
- 当前回滚：Remove `height:100%` if host ownership changes.

### 1.6 修 root overflow 边界

- 需求源行：23
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：添加或评估 `overflow:hidden`，让内部 main-scroll 承担滚动
- 异常场景：如果宿主要求页面根滚动，`overflow:hidden` 会截断内容
- 风险点：未确认 scroll owner 前直接加 `overflow:hidden` 可能隐藏抽屉或浮层
- 回滚操作：删除新增 `overflow:hidden`，改由页型专属滚动区控制
- 当前状态：done
- 权威文件：`runtime/legacy/src/styles.css`
- 当前证据：Root selector declares `overflow:hidden`; inner shell owns scroll.
- 当前风险：Wrong scroll owner can clip portals if drawer is not portalized.
- 当前回滚：Remove `overflow:hidden` and move scroll to page-specific owner.

### 1.7 同步业务项目 root 样式

- 需求源行：25
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/styles.css:1`
- 落地动作：将 skill runtime 样式同步到业务项目
- 异常场景：目标项目已被人工热修，直接覆盖会丢改动
- 风险点：同步前不 diff 会造成业务项目局部补丁丢失
- 回滚操作：用 git checkout 还原该文件，或从同步前备份恢复
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/styles.css`
- 当前证据：Target file is synchronized and runtime seal rebuilt.
- 当前风险：Local target hotfixes can be overwritten by blind sync.
- 当前回滚：Restore target file and rebuild seal.

### 2.1 保留 legacy root marker

- 需求源行：29
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/core.tsx:93`
- 落地动作：保留 `data-hiui-page-root="legacy-host-compatible"`
- 异常场景：删除该 marker 会导致 runtime evidence 无法定位 root
- 风险点：所有验收链路依赖该 marker
- 回滚操作：恢复该属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/core.tsx`
- 当前证据：`Root` renders `data-hiui-page-root="legacy-host-compatible"`.
- 当前风险：Removing marker breaks runtime detection.
- 当前回滚：Restore `Root` marker.

### 2.2 保留 runtime 身份 marker

- 需求源行：31
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/core.tsx:95`
- 落地动作：保留 `data-hiui-legacy-runtime="HiuiLegacyPage"`
- 异常场景：如果 provider adapter 改为 `project-runtime-adapter`，必须同步验收允许值
- 风险点：runtime 身份不一致会让 accept 误判
- 回滚操作：恢复原 marker
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/core.tsx`
- 当前证据：`Root` renders `data-hiui-legacy-runtime="HiuiLegacyPage"`.
- 当前风险：Identity can be faked if gate only checks strings.
- 当前回滚：Restore marker and keep source gates.

### 2.3 增加可验收 shell region

- 需求源行：33
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/core.tsx:93`
- 落地动作：评估给 root 增加 `data-hiui5-region="shell"`，作为真实可见 shell 节点
- 异常场景：如果官方 shell 自身已经输出 shell region，不能重复
- 风险点：重复 shell region 会导致 runtime smoke 计数异常
- 回滚操作：删除新增 `data-hiui5-region="shell"`
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/core.tsx`
- 当前证据：`Root` wraps pages in `TypicalPageHostProvider`; `headerPortal`/`footerPortal` render visible governed region carriers while shell metadata remains on the root.
- 当前风险：Host portal wrappers can affect layout if their CSS loses `width:100%` or `flex:0 0 auto`.
- 当前回滚：Revert `TypicalPageHostProvider` wrapper and restore previous root markup.

### 2.4 禁止 hidden marker 自证

- 需求源行：35
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/core.tsx:100`
- 落地动作：继续保留 `data-hiui-legacy-region-order` 作为兼容信息，但不得把它作为真实 region 唯一证据
- 异常场景：旧报告仍只消费该字段，会出现短期兼容缺口
- 风险点：继续信任字符串会放过不可见页面
- 回滚操作：保留字段不变，仅回滚新增强校验
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Provider policy blocks hidden `data-hiui-legacy-region` markers and accepts adapters that delegate to managed runtime pages.
- 当前风险：Hidden fake markers can pass weak static regex.
- 当前回滚：Remove hidden-marker source scan if it overblocks.

### 3.1 移除裸 `Input` import

- 需求源行：39
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:2`
- 落地动作：删除 `Input` import，避免普通文本字段裸渲染
- 异常场景：如果当前官方 field map 不支持文本字段，必须先补 managed field map，不得退回裸 `Input`
- 风险点：直接删除但不修 valueType 会导致字段不显示
- 回滚操作：恢复 import 与原 renderer，但 contract 标记为不满足 shared skin
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：No `Input` import from `@hi-ui/hiui`.
- 当前风险：Regex may miss aliased imports without provider policy.
- 当前回滚：Revert import removal.

### 3.2 移除裸 `Select` import

- 需求源行：41
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:2`
- 落地动作：删除 `Select` import，避免选择字段裸渲染
- 异常场景：如果 `@hi-ui/schema-fields` select 数据格式不兼容，需要适配 `fieldProps.data`
- 风险点：错误数据结构会让 select 空白
- 回滚操作：恢复 import 与原 renderer，并阻断 delivery-ready
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：No `Select` import from `@hi-ui/hiui`.
- 当前风险：Regex may miss aliased imports without provider policy.
- 当前回滚：Revert import removal.

### 3.3 删除 `renderer.renderFormItem`

- 需求源行：43
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:59`
- 落地动作：从 `toSchemaQueryField` 返回值中移除 `renderer.renderFormItem`
- 异常场景：如果官方 QueryFilter bridge 找不到 field renderer，会导致字段不渲染
- 风险点：必须配合第 3.4 到 3.7 步
- 回滚操作：恢复原 renderer，保留新增测试失败作为已知 blocker
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：`toSchemaQueryField` has no `renderFormItem`.
- 当前风险：Table cell renderers must not be blocked.
- 当前回滚：Restore old query renderer only with waiver.

### 3.4 修文本字段 `valueType`

- 需求源行：45
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:39`
- 落地动作：确认 `input` 映射到官方 field map 可识别的文本类型
- 异常场景：当前版本 field map 只公开 `text/select/date/radio/number/upload/textarea/check-select`，不能臆造 `input` valueType
- 风险点：valueType 写错会跳不到 schema field map
- 回滚操作：还原 `toSchemaValueType`
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：Fallback value type is `text`.
- 当前风险：Unknown query types can silently become text.
- 当前回滚：Add explicit blocked status for unsupported field types.

### 3.5 修选择字段 `valueType`

- 需求源行：47
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:39`
- 落地动作：把 `select` 映射为 `select`，而不是当前默认 `text`
- 异常场景：若多选、树选需要不同 valueType，应单独扩展，不要复用 `select`
- 风险点：全部降成 `text` 会让选择器变输入框
- 回滚操作：还原旧映射并标记 select unsupported
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：`select` and `treeSelect` map to `select`.
- 当前风险：`treeSelect` loses tree semantics until schema support is verified.
- 当前回滚：Revert mapping or add dedicated tree field once verified.

### 3.6 修日期字段 `valueType`

- 需求源行：49
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:39`
- 落地动作：确认 `date`、`dateRange` 映射到当前 `@hi-ui/schema-fields` 支持的日期字段类型
- 异常场景：如果 `dateRange` 需要单独 field API，而当前 field map 只有 `date`，必须显式记录能力缺口
- 风险点：把区间当单日期会破坏业务筛选
- 回滚操作：保留 `dateRange` blocked，不生成该字段
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：`date`, `dateRange`, `datetime` map to `date`.
- 当前风险：Date range may need dedicated schema type in a future verified API.
- 当前回滚：Revert to explicit per-type mapping after API verification.

### 3.7 修 `fieldProps.data` 数据格式

- 需求源行：51
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:85`
- 落地动作：确保 options 转成 schema select 真实需要的 `{ id, title }` 或对应版本要求格式
- 异常场景：如果当前版本组件要求 `data` 中使用 `value/label`，必须按真实类型修正
- 风险点：数据格式错会使下拉不可选
- 回滚操作：恢复 options 映射，暂停 select 字段生成
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：Options map to `{ id, title }`.
- 当前风险：Upstream may require different option keys in a future version.
- 当前回滚：Restore previous option shape after type verification.

### 3.8 同步业务项目 list runtime

- 需求源行：53
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/list.tsx:1`
- 落地动作：同步第 3.1 到 3.7 步结果
- 异常场景：目标项目手动改过 row action renderer，需人工 merge
- 风险点：直接覆盖可能影响已生成列表页
- 回滚操作：还原该文件并重新生成 runtime seal
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/list.tsx`
- 当前证据：Target file is synchronized and runtime seal rebuilt.
- 当前风险：Blind sync can overwrite project patches.
- 当前回滚：Restore target file and rebuild seal.

### 4.1 确认 `table-basic` shell 唯一性

- 需求源行：57
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/TableBasicPage.tsx:20`
- 落地动作：保留 `TablePageFrame`，不新增本地白卡、分页、查询外壳
- 异常场景：若官方 shell 在宿主版本不可用，必须走受管 adapter contract
- 风险点：混入本地白卡会双壳
- 回滚操作：还原为只渲染 `TablePageFrame`
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/TableBasicPage.tsx`
- 当前证据：Imports only `TablePageFrame`, not edit/detail/drawer/split shells.
- 当前风险：String checks can miss re-export aliases.
- 当前回滚：Revert page runtime.

### 4.2 确认 `table-basic` queryFields 走共用修复

- 需求源行：59
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/TableBasicPage.tsx:23`
- 落地动作：继续调用 `resolveQueryFields(pageSlots)`，但该函数必须已移除裸 renderer
- 异常场景：如果页面无 queryFields，仍保留 `searchPlaceholder` 的关键词搜索
- 风险点：遗漏无筛选场景会导致空 QueryFilter 异常
- 回滚操作：只回滚该页型 queryFields 传入，不影响 shared list
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/TableBasicPage.tsx`
- 当前证据：Uses `resolveQueryFields(pageSlots)`.
- 当前风险：Empty query fields still need shell-owned query area semantics.
- 当前回滚：Revert to previous runtime only with waiver.

### 4.3 同步普通表格页 runtime

- 需求源行：61
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TableBasicPage.tsx:1`
- 落地动作：同步 skill 中该页型实现
- 异常场景：业务项目有 provider adapter `TableBasicPageAdapter` 时，需同步 adapter 指向新 runtime
- 风险点：adapter 继续插 hidden marker 会掩盖真实问题
- 回滚操作：还原该文件和 adapter 合同
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TableBasicPage.tsx`
- 当前证据：Full `runtime/legacy/src/pages/*.tsx` sync completed and runtime seal rebuilt.
- 当前风险：Partial sync can create seal mismatch.
- 当前回滚：Restore target page runtime and rebuild seal.

### 5.1 确认 `table-stat` shell 唯一性

- 需求源行：65
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/TableStatPage.tsx:20`
- 落地动作：保留 `StatListPageFrame`
- 异常场景：如果官方 `StatListPageFrame` 不兼容当前 peer，必须声明 adapter，不得手写替代
- 风险点：手写统计白卡会脱离典型模板
- 回滚操作：恢复原 shell 调用
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/TableStatPage.tsx`
- 当前证据：Imports `StatListPageFrame`.
- 当前风险：Stat page can regress into table-basic if stat section omitted.
- 当前回滚：Revert page runtime.

### 5.2 替换统计区渲染

- 需求源行：67
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:181`
- 落地动作：将 `renderMetricSection` 从 `hiui-legacy-stat-grid` 升级为 `StatOverviewGrid` 或等价受管统计区
- 异常场景：`StatOverviewGrid` 需要 async request，不是简单数组 children；必须按真实 API 包装
- 风险点：错误使用官方组件会运行时报错
- 回滚操作：恢复旧 `renderMetricSection`，并把 `table-stat` 标记 preview-only
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：`renderMetricSection` now renders verified `StatOverviewGrid` from `@hiui-design/typical-page-shells/pro-stat-page` and keeps the `stat-section` evidence carrier.
- 当前风险：`StatOverviewGrid` request is async; empty metrics render no stat row.
- 当前回滚：Restore previous local metric renderer.

### 5.3 补真实 `stat-section` region

- 需求源行：69
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:186`
- 落地动作：输出可见 `data-hiui5-region="stat-section"`
- 异常场景：如果官方 `StatListPageFrame` 已输出该 region，不重复包裹
- 风险点：重复 region 会让 smoke 误判
- 回滚操作：删除新增 region 属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：`renderMetricSection` marks `data-hiui-legacy-region="stat-section"`.
- 当前风险：Legacy marker does not prove upstream `data-hiui5-region`.
- 当前回滚：Move marker into certified shell adapter.

### 5.4 同步统计页 runtime

- 需求源行：71
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TableStatPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目没有统计页实例，也仍需同步 runtime 基线
- 风险点：不生成当前页也会影响后续生成
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TableStatPage.tsx`
- 当前证据：Full `runtime/legacy/src/pages/*.tsx` sync completed and runtime seal rebuilt.
- 当前风险：Partial sync can create seal mismatch.
- 当前回滚：Restore target page runtime and rebuild seal.

### 6.1 核对 `tree-table` slot schema

- 需求源行：75
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/types.ts:102`
- 落地动作：判断当前 `tree-table` 是否需要新增 tree-specific slots
- 异常场景：如果典型树表语义实际由 `tableColumns` 中 tree column 承载，则需在 contract 文档写明
- 风险点：错误新增 slots 会破坏现有生成器
- 回滚操作：撤销类型新增，保留 contract blocker
- 当前状态：done
- 权威文件：`runtime/legacy/src/types.ts`
- 当前证据：`tree-table` slot schema has list/table slots and no standalone tree slot by design.
- 当前风险：Tree hierarchy may need row-level data convention.
- 当前回滚：Extend schema with explicit written contract.

### 6.2 修 `tree-table` runtime 语义

- 需求源行：77
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/TreeTablePage.tsx:20`
- 落地动作：不能继续只是普通 `TablePageFrame`；需要补树表列、展开层级、inline tree affordance 或显式阻断
- 异常场景：官方 `TablePageFrame` 只提供通用表格能力时，应标记 `tree-table` lightweight runtime 不支持
- 风险点：假树表会误导业务生成
- 回滚操作：恢复原实现并禁止 `tree-table` delivery-ready
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/TreeTablePage.tsx`
- 当前证据：`TreeTablePage` uses `resolveTreeTableFields`; first data column renders `tree-cell` with indentation, expander affordance, ellipsis text, and normalized row ids.
- 当前风险：Expanded/collapsed interaction still depends on upstream table tree handling for `children`.
- 当前回滚：Revert to `resolveTableFields` and remove tree cell CSS.

### 6.3 同步树表 runtime

- 需求源行：79
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TreeTablePage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目无树表页也要同步
- 风险点：漏同步会导致 future page 复发
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TreeTablePage.tsx`
- 当前证据：Full `runtime/legacy/src/pages/*.tsx` sync completed and runtime seal rebuilt.
- 当前风险：Partial sync can create seal mismatch.
- 当前回滚：Restore target page runtime and rebuild seal.

### 7.1 统一 tree-split contract region

- 需求源行：83
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/rules/typical-page-contracts/tree-split.json:12`
- 落地动作：确定最终 region 集合是否包含 `query-filter`
- 异常场景：如果查询区属于 `right-main` 内部，则 contract 必须明确嵌套关系
- 风险点：contract 与 gate 不一致会导致假阳性或假阴性
- 回滚操作：恢复原 JSON
- 当前状态：done
- 权威文件：`rules/typical-page-contracts/tree-split.json`
- 当前证据：Contract declares `split-workspace`, `left-tree`, `right-main`, `table`, `pagination`, and `main-scroll`; provider contract requires the matching runtime markers.
- 当前风险：Contract and provider marker sets can diverge if one file changes alone.
- 当前回滚：Restore contract/provider marker map together.

### 7.2 统一 provider required markers

- 需求源行：85
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:11`
- 落地动作：把 `tree-split` required markers 改成与 contract 一致
- 异常场景：旧 adapter 仍输出 `tree` 而非 `left-tree`，会被新门禁阻断
- 风险点：未同步 adapter 会导致现有项目 verify 失败
- 回滚操作：恢复旧 marker 列表
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Required markers include `split-workspace`, `tree`, `right-main`, `query-filter`, `table`, and `pagination`.
- 当前风险：Static marker list still needs runtime visibility evidence.
- 当前回滚：Revert marker map and target provider contract update.

### 7.3 统一 runtime evidence required regions

- 需求源行：87
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:52`
- 落地动作：把 `tree-split` runtime DOM 必填 region 改成与 contract 一致
- 异常场景：真实官方 shell 没输出 `data-hiui5-region` 时，需要由 wrapper 补可见 region
- 风险点：只改静态门禁不改 runtime evidence 会继续双轨
- 回滚操作：恢复旧 required regions
- 当前状态：done
- 权威文件：`scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Geometry gate now requires `splitWorkspace` and `rightMain` for `tree-split`, checks containment, and blocks right/left overlap in delivery.
- 当前风险：CSS module selectors rely on upstream class name substrings such as `mainSplit` and `rightColumn`.
- 当前回滚：Revert tree-split geometry additions.

### 7.4 修左树 region

- 需求源行：89
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/list.tsx:197`
- 落地动作：`renderTree` 输出真实 `data-hiui5-region="left-tree"` 或由 `TreeSplitPageFrame` 可见左栏承接
- 异常场景：树数据为空时仍需有空态 region
- 风险点：空树导致 region 缺失会误判失败
- 回滚操作：恢复 `data-hiui-legacy-region="tree"`
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/list.tsx`
- 当前证据：`renderTree` marks `data-hiui-legacy-region="tree"`.
- 当前风险：Nested tree markers may duplicate counts.
- 当前回滚：Restrict marker to outer tree wrapper.

### 7.5 修右主区 region

- 需求源行：91
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/TreeSplitPage.tsx:20`
- 落地动作：确保右侧查询和表格区域有真实 `right-main` 语义
- 异常场景：官方 shell 内部不暴露 region，需要受管 wrapper
- 风险点：wrapper 层抢占布局可能破坏官方 split flex
- 回滚操作：移除新增 wrapper
- 当前状态：done
- 权威文件：`scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Runtime capture resolves right main through `data-hiui5-region`, `data-hiui-legacy-region`, or verified upstream `[class*="rightColumn"]` selector.
- 当前风险：Upstream CSS module rename would require selector refresh.
- 当前回滚：Remove right-main selector and mark tree-split runtime acceptance blocked.

### 7.6 同步左树右表 runtime

- 需求源行：93
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TreeSplitPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目无对应页也同步
- 风险点：漏同步 future page 复发
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TreeSplitPage.tsx`
- 当前证据：Full `runtime/legacy/src/pages/*.tsx` sync completed and runtime seal rebuilt.
- 当前风险：Partial sync can create seal mismatch.
- 当前回滚：Restore target runtime and rebuild seal.

### 8.1 引入编辑页 Provider

- 需求源行：97
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:1`
- 落地动作：从 `@hiui-design/typical-page-shells/pro-edit-page` 引入 `ProEditPageProvider`
- 异常场景：当前 legacy tarball export 不存在时，必须阻断，不能伪造
- 风险点：缺 Provider 会导致 `Form` 和按钮上下文异常
- 回滚操作：删除新增 import
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Imports and renders `ProEditPageProvider`.
- 当前风险：Missing provider can bypass official edit context.
- 当前回滚：Restore previous edit runtime.

### 8.2 引入编辑页 Form

- 需求源行：99
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:1`
- 落地动作：引入 `Form` 并渲染到 `ProEditPage` children
- 异常场景：`Form` 依赖 field map 和 provider，上下文缺失会报错
- 风险点：只传 `fields` 给 `ProEditPage` 不会自动展示表单
- 回滚操作：删除 `<Form />`
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Renders the exported `Form` bridge inside `ProEditPage`.
- 当前风险：Direct fields may not expose region markers.
- 当前回滚：Restore previous edit runtime.

### 8.3 引入编辑页 footer 按钮

- 需求源行：101
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:1`
- 落地动作：引入 `CancelButton`、`StashButton`、`SubmitButton`
- 异常场景：某业务页不需要暂存按钮时，由 slot 控制可见，不删 footer region
- 风险点：footer 缺失导致全页编辑不符合典型页
- 回滚操作：删除新增按钮
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Renders `SubmitButton`, `CancelButton`, and optional `StashButton`.
- 当前风险：Footer actions can disappear or drift.
- 当前回滚：Restore previous edit runtime.

### 8.4 引入 `proEditPageShellStyles`

- 需求源行：103
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:1`
- 落地动作：使用 `formScrollBody` 和 `inlineEditFooter`
- 异常场景：样式 export 缺失时，不能手写替代而不记录
- 风险点：不用官方样式会导致 footer 不吸底
- 回滚操作：删除样式引用
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Imports `proEditPageShellStyles` and uses `formScrollBody` / `inlineEditFooter`.
- 当前风险：Local class names can drift from shell.
- 当前回滚：Remove style import.

### 8.5 增加 `ProEditPageProvider` 包裹

- 需求源行：105
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:15`
- 落地动作：用 Provider 包住 `Root/ProEditPage`
- 异常场景：请求函数未接入时使用安全 mock，但必须标注
- 风险点：Provider 请求抛错会白屏
- 回滚操作：恢复原 `Root > ProEditPage`
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：`ProEditPageProvider` wraps `ProEditPage` and official edit controls.
- 当前风险：Context-dependent shell behavior can break.
- 当前回滚：Restore previous edit runtime.

### 8.6 增加 header portal

- 需求源行：107
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:16`
- 落地动作：补 `TypicalPageHeaderPortal` + `PageHeader`，让 header region 对齐
- 异常场景：宿主项目没有 PageHeader 兼容 export 时，走现有 `hiui-compatible`
- 风险点：直接从错误包 import 会构建失败
- 回滚操作：移除 header portal
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Edit page imports and renders `TypicalPageHeaderPortal`; `Root` provides the governed visible header portal carrier.
- 当前风险：Portal context can be bypassed if a page renders outside `Root`.
- 当前回滚：Remove `TypicalPageHeaderPortal` and revert root host provider.

### 8.7 增加 form-body region

- 需求源行：109
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:17`
- 落地动作：用 `proEditPageShellStyles.formScrollBody` 包 `<Form />`，加 `data-hiui5-region="form-body"`
- 异常场景：字段为空时也要显示空表单区
- 风险点：form-body 缺失会导致 delivery gate 失败
- 回滚操作：移除 region wrapper
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Explicit `data-hiui-legacy-region="form-body"` wraps `Form`.
- 当前风险：Verify can pass adapter but runtime page drifts.
- 当前回滚：Restore previous edit runtime.

### 8.8 增加 footer region

- 需求源行：111
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:17`
- 落地动作：用 `inlineEditFooter` 输出 `data-hiui5-region="footer"`
- 异常场景：只读页不应走 full-page-edit
- 风险点：footer 放进 form-body 会破坏吸底
- 回滚操作：移除 footer
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Explicit `data-hiui-legacy-region="footer"` wraps footer shell style.
- 当前风险：Footer cannot be geometry-tested.
- 当前回滚：Restore previous edit runtime.

### 8.9 增加 footer-actions region

- 需求源行：113
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageEditPage.tsx:17`
- 落地动作：按钮容器输出 `data-hiui5-region="footer-actions"`
- 异常场景：无按钮时仍需空 action region 或 contract 说明
- 风险点：action region 缺失会影响验收
- 回滚操作：删除该属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageEditPage.tsx`
- 当前证据：Explicit `data-hiui-legacy-region="footer-actions"` wraps official and custom actions.
- 当前风险：Action placement can drift.
- 当前回滚：Restore previous edit runtime.

### 8.10 同步全页编辑 runtime

- 需求源行：115
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/FullPageEditPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目 React 16.13 下 export 不兼容时必须回退并 blocked
- 风险点：运行时报 hook/context 错
- 回滚操作：还原该文件并恢复 runtime seal
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/FullPageEditPage.tsx`
- 当前证据：Full pages sync completed and target build passed.
- 当前风险：Sync before fix spreads incomplete runtime.
- 当前回滚：Restore target runtime and rebuild seal.

### 9.1 废弃 placeholder 表单渲染

- 需求源行：119
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/form.tsx:4`
- 落地动作：停止把字段渲染为字段类型文本
- 异常场景：drawer-form 还未接好 schema form 时，不能直接删到空白
- 风险点：业务以为表单可编辑，实际只是文本
- 回滚操作：恢复 `renderFormFields` 原实现
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/form.tsx`
- 当前证据：Fallback rows use schema field metadata and no longer print field type placeholders.
- 当前风险：Placeholder fields can mask official form skin gaps.
- 当前回滚：Restore old form renderer.

### 9.2 建立 formFields 到 schema fields 映射

- 需求源行：121
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/form.tsx:4`
- 落地动作：把 `LegacyFieldSlot` 转成当前 schema form 可消费的字段结构
- 异常场景：`switch/radio/checkbox/dateRange` 若当前 field map 能力不全，逐项 blocked 或 fallback 明示
- 风险点：字段类型乱映射会造成表单行为错误
- 回滚操作：撤销映射函数
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/form.tsx`
- 当前证据：`resolveFormFields` maps slots to schema `title/dataIndex/key/valueType/fieldProps/formItemProps/control`.
- 当前风险：Unsupported field types can render incorrectly.
- 当前回滚：Remove mapper and mark schema gap.

### 9.3 接入 validationRules

- 需求源行：123
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/types.ts:140`
- 落地动作：明确 `validationRules` 如何进入 schema form
- 异常场景：schema form 当前版本规则格式未知时，不要臆造；先记录 unsupported
- 风险点：错误校验会阻断提交或漏校验
- 回滚操作：保留字段但不消费，contract 标注能力缺口
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/form.tsx`
- 当前证据：Required fields and `validationRules[dataIndex]` are merged into `formItemProps.rules`.
- 当前风险：Required/business validation can be lost.
- 当前回滚：Revert validation binding.

### 9.4 同步 form shared runtime

- 需求源行：125
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/form.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目没有对应 form 页也同步
- 风险点：影响未来 drawer-form/full-page-edit
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/form.tsx`
- 当前证据：Full shared sync completed and target build passed.
- 当前风险：Partial sync can mismatch.
- 当前回滚：Restore target file and rebuild seal.

### 10.1 移除详情页内部 `h1` 页头

- 需求源行：129
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageDetailPage.tsx:20`
- 落地动作：不要用 `h1` 代替 PageHeader
- 异常场景：宿主无 header portal 时必须 adapter 化
- 风险点：双页头或错位页头
- 回滚操作：恢复 `h1`
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageDetailPage.tsx`
- 当前证据：Inner `h1` was removed; title is represented in the explicit header region.
- 当前风险：Double header can appear.
- 当前回滚：Restore previous detail runtime.

### 10.2 增加详情页 header portal

- 需求源行：131
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageDetailPage.tsx:18`
- 落地动作：渲染 `TypicalPageHeaderPortal` + `PageHeader`
- 异常场景：PageHeader peer 缺失走 compatibility alias
- 风险点：import 错误导致构建失败
- 回滚操作：移除 header portal
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageDetailPage.tsx`
- 当前证据：Detail page imports and renders `TypicalPageHeaderPortal`; `Root` provides the governed visible header portal carrier.
- 当前风险：Portal context can be bypassed if a page renders outside `Root`.
- 当前回滚：Remove `TypicalPageHeaderPortal` and revert root host provider.

### 10.3 标注 white-body region

- 需求源行：133
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageDetailPage.tsx:18`
- 落地动作：确保 `ProDetailPage` 或直接子节点输出 `data-hiui5-region="white-body"`
- 异常场景：官方组件不透传 unknown props 时，需外层可见 wrapper
- 风险点：region 标在无尺寸节点上会几何失败
- 回滚操作：移除新增 wrapper/属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FullPageDetailPage.tsx`
- 当前证据：Explicit `data-hiui-legacy-region="white-body"` wraps detail content.
- 当前风险：White body cannot be geometry-tested.
- 当前回滚：Restore previous detail runtime.

### 10.4 标注 detail-body region

- 需求源行：135
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FullPageDetailPage.tsx:19`
- 落地动作：详情内容容器输出 `data-hiui5-region="detail-body"`
- 异常场景：无 detailFields 时仍保留空态区域
- 风险点：空数据导致 region 缺失
- 回滚操作：删除属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/detail.tsx`
- 当前证据：`renderDetailFields` renders `data-hiui-legacy-region="detail-body"`.
- 当前风险：Detail body can be mistaken for generic content.
- 当前回滚：Restore previous detail runtime.

### 10.5 同步全页详情 runtime

- 需求源行：137
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/FullPageDetailPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目 PageHeader 兼容层不完整
- 风险点：构建失败或页头丢失
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/FullPageDetailPage.tsx`
- 当前证据：Full pages sync completed and target build passed.
- 当前风险：Partial sync can mismatch.
- 当前回滚：Restore target file and rebuild seal.

### 11.1 替换详情 legacy grid

- 需求源行：141
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/detail.tsx:4`
- 落地动作：用当前 HiUI 真实 `Descriptions` 或官方详情桥接替代 `div + span`
- 异常场景：`Descriptions` API 需按目标版本确认，不能臆造 props
- 风险点：错误 API 会构建失败
- 回滚操作：恢复 legacy grid
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/detail.tsx`
- 当前证据：Detail rendering now uses `SchemaDescriptionsBridge` from the official `@hi-ui/schema-group/descriptions` bridge and `@hi-ui/schema-core` field builders instead of a bespoke row grid; target build passed after adding `@hi-ui/schema-group@4.0.0-experimental.7` and `@hi-ui/schema-core@4.0.0-experimental.10`.
- 当前风险：Detail value normalization still depends on the slot data shape, so malformed `detailFields` can still produce empty labels or fallback text.
- 当前回滚：Restore the prior row-grid renderer and remove the `@hi-ui/schema-group` / `@hi-ui/schema-core` dependencies, then rerun the focused runtime surface and build checks.

### 11.2 修详情值来源

- 需求源行：143
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/detail.tsx:13`
- 落地动作：不要显示 `dataIndex` 字符串本身，应从 `mockData` 或 detail data 中取值
- 异常场景：无 mockData 时显示安全占位 `--`
- 风险点：显示字段 key 会误导验收
- 回滚操作：恢复旧显示逻辑
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/detail.tsx`
- 当前证据：Detail values resolve from the first `mockData` record by `dataIndex`.
- 当前风险：Labels may render without real values.
- 当前回滚：Restore previous detail renderer.

### 11.3 修 supporting sections

- 需求源行：145
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/shared/detail.tsx:20`
- 落地动作：让分组详情对齐典型分组结构
- 异常场景：分组为空时不输出重复空 section
- 风险点：多层 `detail-body` 嵌套造成 region 重复
- 回滚操作：恢复原 `renderSupportingSections`
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/detail.tsx`
- 当前证据：Supporting sections pass the same detail data source into nested fields.
- 当前风险：Section spacing can drift.
- 当前回滚：Restore previous renderer.

### 11.4 同步详情 shared runtime

- 需求源行：147
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/detail.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目已有手工详情兼容逻辑
- 风险点：覆盖本地兼容补丁
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/detail.tsx`
- 当前证据：Full shared sync completed and target build passed.
- 当前风险：Partial sync can mismatch.
- 当前回滚：Restore target file and rebuild seal.

### 12.1 修 drawer-form 默认可见策略

- 需求源行：151
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerFormPage.tsx:18`
- 落地动作：不能固定 `visible={false}`；改为 slot/action 可控，并提供验收模式可见入口
- 异常场景：真实业务只由按钮打开抽屉，独立验收 URL 需触发打开动作
- 风险点：固定不可见导致所有 drawer region 采不到
- 回滚操作：恢复 `visible={false}`，并阻断 drawer delivery-ready
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/DrawerFormPage.tsx`
- 当前证据：Drawer now uses `visible` instead of `visible={false}`.
- 当前风险：Drawer content invisible during runtime evidence capture.
- 当前回滚：Restore previous drawer runtime.

### 12.2 标注 drawer-shell region

- 需求源行：153
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerFormPage.tsx:18`
- 落地动作：确保可见 drawer 根输出或可采集 `drawer-shell`
- 异常场景：HiUI Drawer portal 到 body，root-scoped 查询可能找不到
- 风险点：region 在 portal 外导致 root scope 校验失败
- 回滚操作：移除 region 标注
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/DrawerFormPage.tsx`
- 当前证据：`ProFormDrawer` carries `data-hiui-legacy-region="drawer-shell"`.
- 当前风险：Drawer shell cannot be validated.
- 当前回滚：Restore previous drawer runtime.

### 12.3 标注 drawer-body region

- 需求源行：155
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerFormPage.tsx:18`
- 落地动作：使用 `bodyClassName` 或可见 wrapper 标注 `drawer-body`
- 异常场景：官方 Drawer 不支持 body props 时，需要确认真实 API
- 风险点：臆造 props 会构建失败
- 回滚操作：删除 bodyClassName/wrapper
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/DrawerFormPage.tsx`
- 当前证据：Children are wrapped by `data-hiui-legacy-region="drawer-body"`.
- 当前风险：Drawer body cannot be validated.
- 当前回滚：Restore previous drawer runtime.

### 12.4 标注 form-body region

- 需求源行：157
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerFormPage.tsx:19`
- 落地动作：表单内容输出 `data-hiui5-region="form-body"`
- 异常场景：字段为空仍保留空态
- 风险点：region 缺失验收失败
- 回滚操作：删除该属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/form.tsx`
- 当前证据：`renderFormFields` emits `data-hiui-legacy-region="form-body"` using schema field metadata.
- 当前风险：Form content may be hidden by drawer state.
- 当前回滚：Restore previous drawer runtime.

### 12.5 标注 drawer-footer region

- 需求源行：159
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerFormPage.tsx:18`
- 落地动作：footer 容器输出 `drawer-footer` 和必要 `footer-actions`
- 异常场景：footer prop 不透传 DOM 属性，需 wrapper
- 风险点：footer 被放进 body 会破坏典型结构
- 回滚操作：恢复旧 footer 渲染
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/DrawerFormPage.tsx`
- 当前证据：Footer wraps `ProDrawerFooterActions` with `drawer-footer` and `footer-actions` markers.
- 当前风险：Footer actions can be untestable.
- 当前回滚：Restore previous drawer runtime.

### 12.6 同步 drawer-form runtime

- 需求源行：161
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/DrawerFormPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目抽屉交互依赖宿主状态
- 风险点：默认可见可能影响真实业务
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/DrawerFormPage.tsx`
- 当前证据：Full pages sync completed and target build passed.
- 当前风险：Partial sync can mismatch.
- 当前回滚：Restore target file and rebuild seal.

### 13.1 修 drawer-detail 默认可见策略

- 需求源行：165
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerDetailPage.tsx:18`
- 落地动作：不能固定 `visible={false}`；改成可控并支持验收可见
- 异常场景：真实业务需点击后打开，验收需脚本触发
- 风险点：不可见导致 region 缺失
- 回滚操作：恢复 `visible={false}` 并 blocked
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/DrawerDetailPage.tsx`
- 当前证据：Drawer now uses `visible` instead of `visible={false}`.
- 当前风险：Drawer content invisible during runtime evidence capture.
- 当前回滚：Restore previous drawer runtime.

### 13.2 标注 drawer-detail shell/body/footer

- 需求源行：167
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerDetailPage.tsx:18`
- 落地动作：补 `drawer-shell`、`drawer-body`、`drawer-footer` 可采集语义
- 异常场景：Drawer portal 出 root 范围
- 风险点：root-scoped gate 找不到 portal 节点
- 回滚操作：移除新增 region
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/DrawerDetailPage.tsx`
- 当前证据：Drawer detail source marks `drawer-shell`, `drawer-body`, and `drawer-footer`.
- 当前风险：Drawer structure cannot be validated.
- 当前回滚：Restore previous drawer runtime.

### 13.3 标注 drawer detail-body

- 需求源行：169
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/DrawerDetailPage.tsx:19`
- 落地动作：详情内容输出 `data-hiui5-region="detail-body"`
- 异常场景：无详情字段时保留空态
- 风险点：空字段导致验收失败
- 回滚操作：删除属性
- 当前状态：done
- 权威文件：`runtime/legacy/src/shared/detail.tsx`
- 当前证据：Drawer detail uses `renderDetailFields`, which emits `detail-body`.
- 当前风险：Detail body can be hidden.
- 当前回滚：Restore previous drawer runtime.

### 13.4 同步 drawer-detail runtime

- 需求源行：171
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/DrawerDetailPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目抽屉 API 版本差异
- 风险点：构建通过但运行交互异常
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/DrawerDetailPage.tsx`
- 当前证据：Full pages sync completed and target build passed.
- 当前风险：Partial sync can mismatch.
- 当前回滚：Restore target file and rebuild seal.

### 14.1 确认是否存在 `FeedbackStatePanel`

- 需求源行：175
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/rules/typical-page-contracts/feedback-status.json:5`
- 落地动作：在当前依赖中确认官方或受管 `FeedbackStatePanel` 真实存在
- 异常场景：不存在时不得继续声明 shell 为真实组件
- 风险点：合同声明虚构 shell
- 回滚操作：不改 runtime，先把 contract 标 blocked 或 adapter-required
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FeedbackStatusPage.tsx`
- 当前证据：Installed `@hiui-design/typical-page-shells@0.1.2` has no `FeedbackStatePanel` export; runtime keeps the governed `EmptyState` fallback under the `data-hiui5-shell-carrier="FeedbackStatePanel"` marker.
- 当前风险：Inventing nonexistent component would break build.
- 当前回滚：Keep `EmptyState` fallback and carrier marker together.

### 14.2 修 feedback shell

- 需求源行：177
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FeedbackStatusPage.tsx:15`
- 落地动作：若 `FeedbackStatePanel` 存在，替换 `div + h1 + EmptyState`；若不存在，新增受管 adapter 并写明等价性
- 异常场景：组件不存在或 API 不明时停止实现
- 风险点：用 `EmptyState` 冒充 contract shell
- 回滚操作：恢复旧实现，合同写 waiver/blocker
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FeedbackStatusPage.tsx`
- 当前证据：Feedback page now carries the governed `data-hiui5-shell-carrier="FeedbackStatePanel"` marker around the real `EmptyState` panel, matching the page-spec shell contract while preserving the existing header / white-body / feedback-panel regions.
- 当前风险：A future upstream feedback shell could still shift the carrier contract, so this page must remain pinned to the current carrier marker and region names.
- 当前回滚：Restore the prior feedback page wrapper and remove the carrier marker, then rerun the feedback runtime surface and acceptance checks.

### 14.3 标注 feedback header

- 需求源行：179
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FeedbackStatusPage.tsx:17`
- 落地动作：输出真实 `data-hiui5-region="header"`
- 异常场景：反馈页若设计无页头，contract 必须改，不可静默缺失
- 风险点：合同和视觉不一致
- 回滚操作：删除 header region 并改 contract blocker
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FeedbackStatusPage.tsx`
- 当前证据：Feedback header wraps HiUI `PageHeader` in `data-hiui-legacy-region="header"`; local parity evidence records header height `60`.
- 当前风险：Header can drift if replaced by plain text.
- 当前回滚：Restore previous feedback runtime only with a matching gate update.

### 14.4 标注 feedback white-body

- 需求源行：181
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FeedbackStatusPage.tsx:18`
- 落地动作：输出真实 `data-hiui5-region="white-body"`
- 异常场景：反馈页采用全灰底无白卡时必须改 contract
- 风险点：假白卡破坏视觉
- 回滚操作：删除 white-body 标注
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FeedbackStatusPage.tsx`
- 当前证据：Feedback source marks `data-hiui-legacy-region="white-body"`; CSS removes outer bottom padding so local parity geometry reports `whiteBody.bottom === root.bottom`.
- 当前风险：Removing shell padding changes horizontal page gutters for the feedback fallback.
- 当前回滚：Restore padding only if the geometry gate accounts for intentional root insets.

### 14.5 标注 feedback panel

- 需求源行：183
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/pages/FeedbackStatusPage.tsx:18`
- 落地动作：输出真实 `data-hiui5-region="feedback-panel"`
- 异常场景：状态组件内部不透传属性，需外层可见 wrapper
- 风险点：wrapper 影响居中
- 回滚操作：删除 wrapper
- 当前状态：done
- 权威文件：`runtime/legacy/src/pages/FeedbackStatusPage.tsx`
- 当前证据：Panel has explicit `data-hiui-legacy-region="feedback-panel"`.
- 当前风险：Class selector is weaker than data region marker.
- 当前回滚：Restore previous feedback runtime.

### 14.6 同步 feedback runtime

- 需求源行：185
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/FeedbackStatusPage.tsx:1`
- 落地动作：同步 skill 修改
- 异常场景：目标项目无反馈页也同步
- 风险点：future page 复发
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/FeedbackStatusPage.tsx`
- 当前证据：Full pages sync completed and target build passed.
- 当前风险：Partial sync can mismatch.
- 当前回滚：Restore target file and rebuild seal.

### 15.1 校验 root CSS 存在

- 需求源行：189
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:55`
- 落地动作：读取 `src/hiui-runtime/styles.css` 并检查 root selector
- 异常场景：样式文件缺失时直接 error
- 风险点：没样式仍通过
- 回滚操作：删除新增 CSS 校验
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：`verifyRootSurfaceCss` checks existence.
- 当前风险：Missing CSS must block only when provider contract is declared.
- 当前回滚：Remove helper call.

### 15.2 校验 root `display:flex`

- 需求源行：191
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:97`
- 落地动作：缺失时报 `runtimeProvider.rootFlex.missing`
- 异常场景：CSS 通过变量或类组合实现，静态 regex 可能误判，需要允许明确 waiver
- 风险点：regex 过宽放过无效 CSS
- 回滚操作：移除此 issue
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Checks `display:flex`.
- 当前风险：Equivalent CSS from external file is not accepted yet.
- 当前回滚：Add waiver if external ownership is documented.

### 15.3 校验 root `flex-direction:column`

- 需求源行：193
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:97`
- 落地动作：缺失时报错
- 异常场景：CSS 压缩无空格，regex 需兼容
- 风险点：格式差异导致假阴性
- 回滚操作：移除该校验
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Checks `flex-direction:column`.
- 当前风险：Shorthand not supported.
- 当前回滚：Add normalized parser support.

### 15.4 校验 root 高度策略

- 需求源行：195
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:97`
- 落地动作：检查 `flex`、`min-height`、`height` 至少满足约定组合
- 异常场景：宿主 adapter 提供高度时，需 contract 显式声明
- 风险点：硬性要求 `height:100%` 可能误伤
- 回滚操作：放宽为 warning 或 waiver
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Checks `flex`, `align-self`, `height`, `min-height`, `min-width`, `overflow`.
- 当前风险：Hard requirement may block host-owned height alternatives.
- 当前回滚：Downgrade selected declarations to warning/waiver.

### 15.5 校验列表字段裸 renderer

- 需求源行：197
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:97`
- 落地动作：扫描 `src/hiui-runtime/shared/list.tsx`，发现 `renderer.renderFormItem` + `Input/Select` 即失败
- 异常场景：非 QueryFilter 的 table cell renderer 不应误伤
- 风险点：regex 范围过大
- 回滚操作：限制扫描到 `toSchemaQueryField` 函数体
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Scans `toSchemaQueryField` body and imports.
- 当前风险：Regex must remain scoped to query fields.
- 当前回滚：Restrict scan further to AST/parser.

### 15.6 校验 `full-page-edit` 结构

- 需求源行：199
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:97`
- 落地动作：扫描 `FullPageEditPage.tsx` 必须含 `ProEditPageProvider`、`Form`、`inlineEditFooter`
- 异常场景：等价受管 adapter 需声明
- 风险点：只查字符串仍可能假阳性
- 回滚操作：降级为 source gate，保留 runtime gate 验证
- 当前状态：done
- 权威文件：`scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：`verifyFullPageEditStructure` blocks missing provider, form bridge, official buttons, shell styles, and body/footer markers.
- 当前风险：String-only checks can create false confidence.
- 当前回滚：Move to runtime gate or make warning.

### 15.7 同步 provider policy 到业务项目

- 需求源行：201
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:1`
- 落地动作：同步 skill 修改
- 异常场景：业务项目 `.local-context` 有本地 patch
- 风险点：覆盖本地脚本
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs`
- 当前证据：Target policy file synchronized.
- 当前风险：Target local patch can be overwritten.
- 当前回滚：Restore target policy.

### 16.1 拆分页型 runtime pattern

- 需求源行：205
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-legacy-verify.mjs:260`
- 落地动作：把 `validateRuntimeDomMarkers` 从通用规则拆成页型规则
- 异常场景：feedback 没官方 shell 时应返回 blocked
- 风险点：通用规则继续漏检
- 回滚操作：恢复原函数
- 当前状态：done
- 权威文件：`scripts/typical-page-legacy-verify.mjs`
- 当前证据：`RUNTIME_MARKER_PATTERNS_BY_PAGE_TYPE` splits list/table/stat/split/drawer/edit/detail/feedback rules.
- 当前风险：Generic rules can miss drawer/edit/detail gaps.
- 当前回滚：Restore old function.

### 16.2 增加 table 类 source pattern

- 需求源行：207
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-legacy-verify.mjs:266`
- 落地动作：要求 `TablePageFrame/StatListPageFrame/TreeSplitPageFrame` 与 `queryFields/tableFields` 同时存在
- 异常场景：无查询字段页仍应保留 shell QueryFilter 能力
- 风险点：误判无筛选页
- 回滚操作：移除 queryFields 强制项
- 当前状态：done
- 权威文件：`scripts/typical-page-legacy-verify.mjs`
- 当前证据：Table page types require canonical shell plus `queryFields` and `tableFields` bindings.
- 当前风险：No-query pages can be misclassified.
- 当前回滚：Remove strict query requirement.

### 16.3 增加 `table-stat` stat-section pattern

- 需求源行：209
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-legacy-verify.mjs:266`
- 落地动作：要求真实 `stat-section` 或受管 `StatOverviewGrid`
- 异常场景：统计项为空时可有空态 region
- 风险点：静态字符串不等于真实 DOM
- 回滚操作：保留 runtime gate，移除静态 gate
- 当前状态：done
- 权威文件：`scripts/typical-page-legacy-verify.mjs`
- 当前证据：`table-stat` requires `StatListPageFrame` and `statSection={renderMetricSection(pageSlots.statItems)}`.
- 当前风险：Empty stats need explicit empty region.
- 当前回滚：Keep runtime gate.

### 16.4 增加 full-page-edit pattern

- 需求源行：211
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-legacy-verify.mjs:266`
- 落地动作：要求 Provider/Form/formScrollBody/inlineEditFooter/footer-actions
- 异常场景：只读编辑页不应使用该页型
- 风险点：把特殊页误归类
- 回滚操作：移除该 pattern
- 当前状态：done
- 权威文件：`scripts/typical-page-legacy-verify.mjs`
- 当前证据：`full-page-edit` requires provider, form bridge, form-body, footer, and footer-actions markers.
- 当前风险：Edit page can pass despite missing footer/body structure.
- 当前回滚：Remove strict pattern.

### 16.5 增加 drawer pattern

- 需求源行：213
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-legacy-verify.mjs:266`
- 落地动作：要求 drawer-shell/body/footer 对应 marker
- 异常场景：portal 结构需要 runtime 验证补充
- 风险点：静态检测和真实 DOM 不一致
- 回滚操作：删除 drawer pattern
- 当前状态：done
- 权威文件：`scripts/typical-page-legacy-verify.mjs`
- 当前证据：Drawer page types require visible drawer shell/body/footer plus form/detail body markers.
- 当前风险：Drawer pages can pass while invisible.
- 当前回滚：Remove strict pattern.

### 16.6 同步 legacy verify 到业务项目

- 需求源行：215
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-verify.mjs:1`
- 落地动作：同步修改
- 异常场景：目标项目脚本版本落后
- 风险点：脚本与 runtime seal 不匹配
- 回滚操作：还原该脚本
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-verify.mjs`
- 当前证据：Target verify script synchronized and 9 parity sample verifies pass.
- 当前风险：Script/runtime version mismatch.
- 当前回滚：Restore target script.

### 17.1 采集 root computed style

- 需求源行：219
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:194`
- 落地动作：采集 root 的 `display/flexDirection/flex/minHeight/height/overflow`
- 异常场景：元素不存在时返回 null
- 风险点：不采 style 无法证明高度链
- 回滚操作：删除新增字段
- 当前状态：done
- 权威文件：`scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Captures root computed style.
- 当前风险：Missing element returns null and must block delivery.
- 当前回滚：Remove captured field.

### 17.2 采集 white-body computed style

- 需求源行：221
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:211`
- 落地动作：采集 whiteBody 的 flex/height/overflow/background
- 异常场景：drawer 页没有 white-body，应按页型跳过
- 风险点：通用强制会误伤 drawer
- 回滚操作：按页型禁用该采集校验
- 当前状态：done
- 权威文件：`scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Captures whiteBody computed style.
- 当前风险：Selector must follow upstream shell region.
- 当前回滚：Remove captured field.

### 17.3 采集真实 region 可见性

- 需求源行：223
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:177`
- 落地动作：对每个 `[data-hiui5-region]` 采集 `offsetParent`、rect width/height、computed visibility/display
- 异常场景：fixed/portal 元素 `offsetParent` 可能为 null，需用 rect 和 visibility 综合判断
- 风险点：单一可见性规则误判
- 回滚操作：仅保留 rect
- 当前状态：done
- 权威文件：`scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Browser evidence now records `result.regionVisibility` for header, white-body, query/table/pagination, tree, form/detail body, footer, drawer, and feedback panel regions.
- 当前风险：Hidden fake markers can pass.
- 当前回滚：Remove visibility gate.

### 17.4 采集 drawer portal region

- 需求源行：225
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:194`
- 落地动作：drawer 页从 `document` 全局采集 drawer-shell/body/footer，不只 root 内查询
- 异常场景：多抽屉同时存在需按 page marker 缩小范围
- 风险点：采到别的业务抽屉
- 回滚操作：恢复 root-scoped 查询
- 当前状态：done
- 权威文件：`scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Browser selectors include `[data-hiui-legacy-region="drawer-shell"]`, `[data-hiui5-region="drawer-shell"]`, and `[data-hiui5-owner-drawer-shell="true"]` outside the page root.
- 当前风险：Portaled drawer content can be missed by root-scoped selectors.
- 当前回滚：Remove drawer portal capture.

### 17.5 同步 acceptance runner

- 需求源行：227
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:1`
- 落地动作：同步修改
- 异常场景：业务项目缺 Playwright，不影响静态验证但影响 delivery
- 风险点：runtime capture 报错
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Target file synchronized.
- 当前风险：Target local patch can be overwritten.
- 当前回滚：Restore target file.

### 18.1 增加 root flex 校验

- 需求源行：231
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/dom-geometry-gate.mjs:26`
- 落地动作：检查 root computed `display === flex`
- 异常场景：浏览器返回 `inline-flex` 时需判定是否允许
- 风险点：过严误伤
- 回滚操作：删除该 issue
- 当前状态：done
- 权威文件：`scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Checks computed `display:flex`.
- 当前风险：Preview profile only warns.
- 当前回滚：Remove check.

### 18.2 增加 root column 校验

- 需求源行：233
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/dom-geometry-gate.mjs:26`
- 落地动作：检查 `flexDirection === column`
- 异常场景：drawer 页可能不适用
- 风险点：未按页型区分
- 回滚操作：按页型跳过
- 当前状态：done
- 权威文件：`scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Checks computed `flexDirection:column`.
- 当前风险：Preview profile only warns.
- 当前回滚：Remove check.

### 18.3 增加 white-body 贴底校验

- 需求源行：235
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/dom-geometry-gate.mjs:60`
- 落地动作：列表页和详情页检查 `whiteBody.bottom >= root.bottom - 4`
- 异常场景：页面内容少但设计允许非撑满时，需要 contract waiver
- 风险点：不同宿主 padding 影响 tolerance
- 回滚操作：放宽 tolerance 或改 warning
- 当前状态：done
- 权威文件：`scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Checks bottom delta <= 8px.
- 当前风险：Non-table pages may need tailored thresholds.
- 当前回滚：Remove or page-type-gate threshold.

### 18.4 增加 form footer 吸底校验

- 需求源行：237
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/dom-geometry-gate.mjs:26`
- 落地动作：full-page-edit 检查 footer 在 root 底部附近，form-body 在 footer 上方且可滚动
- 异常场景：短表单不滚动也应 footer 吸底
- 风险点：把“不滚动”误判失败
- 回滚操作：删除滚动强制，只保留层级
- 当前状态：done
- 权威文件：`scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Gate blocks footer actions outside footer and footer overlapping the form body.
- 当前风险：Edit footer can float mid-page.
- 当前回滚：Remove footer gate.

### 18.5 增加 drawer 层级校验

- 需求源行：239
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/dom-geometry-gate.mjs:26`
- 落地动作：drawer body 与 footer 必须在 drawer shell 内，footer 不在 form/detail body 内
- 异常场景：HiUI Drawer portal 结构复杂，需真实 DOM 调整 selector
- 风险点：selector 错误
- 回滚操作：禁用 drawer geometry 分支
- 当前状态：done
- 权威文件：`scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Gate blocks drawer body/footer outside shell and drawer footer overlapping body.
- 当前风险：Drawer can be hidden behind page.
- 当前回滚：Remove drawer layer gate.

### 18.6 同步 geometry gate

- 需求源行：241
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/dom-geometry-gate.mjs:1`
- 落地动作：同步修改
- 异常场景：旧 evidence 没 style 字段时应给明确错误或兼容 warning
- 风险点：旧报告批量失败
- 回滚操作：恢复旧 gate 或加兼容分支
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/dom-geometry-gate.mjs`
- 当前证据：Target file synchronized.
- 当前风险：Target local patch can be overwritten.
- 当前回滚：Restore target file.

### 19.1 抽公共 white-body 检查

- 需求源行：245
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-runtime-smoke.mjs:1215`
- 落地动作：把 white-body 连续性逻辑抽到公共 lib
- 异常场景：抽取影响 runtime smoke 原行为
- 风险点：重构引入回归
- 回滚操作：恢复内联逻辑
- 当前状态：done
- 权威文件：`scripts/lib/runtime-surface-gates.mjs`
- 当前证据：`runWhiteBodySurfaceCheck` centralizes white-body overflow, bottom delta, and root computed-style checks.
- 当前风险：Duplicate logic can drift.
- 当前回滚：Delete helper and imports.

### 19.2 抽公共 QueryFilter surface 检查

- 需求源行：247
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/typical-page-runtime-smoke.mjs:1276`
- 落地动作：把 filled/shared surface 判断抽到公共 lib
- 异常场景：不同页型没有 QueryFilter 时跳过
- 风险点：误伤非查询页
- 回滚操作：恢复内联逻辑
- 当前状态：done
- 权威文件：`scripts/lib/runtime-surface-gates.mjs`
- 当前证据：`runQueryFilterSurfaceCheck` centralizes duplicate query filter and duplicate keyword checks.
- 当前风险：Duplicate logic can drift.
- 当前回滚：Delete helper and imports.

### 19.3 legacy acceptance 调用公共检查

- 需求源行：249
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-acceptance-runner.mjs:567`
- 落地动作：在 domGeometry 后加入共享 runtime surface gate
- 异常场景：缺 evidence 时不能 passed
- 风险点：双重错误信息过多
- 回滚操作：移除调用
- 当前状态：done
- 权威文件：`scripts/lib/legacy-acceptance-runner.mjs`
- 当前证据：Acceptance calls `runDomGeometryGate`, which imports and executes the shared surface gates.
- 当前风险：Runtime smoke and acceptance can diverge.
- 当前回滚：Restore acceptance runner and `dom-geometry-gate` import.

### 20.1 新增 root 高度链测试

- 需求源行：253
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-runtime-surface-facts.test.mjs:1`
- 落地动作：构造缺 `display:flex` 的 runtime CSS，断言 provider/doctor 失败
- 异常场景：测试 fixture 没同步 CSS
- 风险点：测试假阳性
- 回滚操作：删除新增测试
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Root CSS test exists.
- 当前风险：Regex-only CSS parsing is weaker than browser evidence.
- 当前回滚：Remove test.

### 20.2 新增 QueryFilter 裸 Input 测试

- 需求源行：255
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/query-filter-governance.test.mjs:1`
- 落地动作：断言 `renderer.renderFormItem` 返回裸 `Input` 必须失败
- 异常场景：测试只覆盖源码片段，不覆盖真实渲染
- 风险点：静态检测不足
- 回滚操作：删除测试或降级
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Import and query mapper tests exist.
- 当前风险：Aliased imports require policy test too.
- 当前回滚：Remove test.

### 20.3 新增 QueryFilter 裸 Select 测试

- 需求源行：257
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/query-filter-governance.test.mjs:1`
- 落地动作：断言裸 `Select` 或 white surface 混搭失败
- 异常场景：Select 由官方 field map 渲染时不能误判
- 风险点：regex 误伤
- 回滚操作：收窄测试 fixture
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Import and query mapper tests exist.
- 当前风险：Aliased imports require policy test too.
- 当前回滚：Remove test.

### 20.4 新增 `table-stat` stat-section 测试

- 需求源行：259
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-verify-boundary.test.mjs:1`
- 落地动作：缺真实 stat-section 时失败
- 异常场景：统计项为空但 region 存在应通过
- 风险点：把数据为空误判结构错
- 回滚操作：调整 fixture
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Test asserts `StatListPageFrame`, `StatOverviewGrid`, and `stat-section` evidence carrier.
- 当前风险：Test is source-level and cannot prove runtime screenshots alone.
- 当前回滚：Remove stat-section assertions.

### 20.5 新增 `tree-split` region 一致性测试

- 需求源行：261
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-verify-boundary.test.mjs:1`
- 落地动作：contract/provider/runtime required regions 不一致时失败
- 异常场景：历史 contract 需要迁移
- 风险点：旧项目批量失败
- 回滚操作：增加 migration waiver
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Test asserts `TreeSplitPageFrame`, left-pane binding, query binding, and table binding; geometry test covers right-main containment.
- 当前风险：Source test depends on stable runtime function names.
- 当前回滚：Remove tree-split assertions and geometry case.

### 20.6 新增 `full-page-edit` 结构测试

- 需求源行：263
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-verify-boundary.test.mjs:1`
- 落地动作：缺 Provider/Form/footer 任一项失败
- 异常场景：等价 adapter 需显式声明
- 风险点：字符串检查被注释欺骗
- 回滚操作：改 AST 或源码解析
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Test asserts official edit provider, `Form`, footer styles, footer regions, and `TypicalPageHeaderPortal`.
- 当前风险：Source test cannot prove remote host portal mounting alone.
- 当前回滚：Remove full-page-edit assertions.

### 20.7 新增 drawer 可见 region 测试

- 需求源行：265
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-runtime-surface-facts.test.mjs:1`
- 落地动作：`visible=false` 且无验收打开机制时失败
- 异常场景：测试环境无法打开 drawer
- 风险点：交互测试不稳定
- 回滚操作：先设为静态 source test
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Test asserts both drawers render visible and expose shell/body/footer regions.
- 当前风险：Source regex can miss runtime-only visibility issues.
- 当前回滚：Remove drawer assertions.

### 20.8 新增 feedback shell 测试

- 需求源行：267
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-verify-boundary.test.mjs:1`
- 落地动作：contract 声明 `FeedbackStatePanel` 但 runtime 只用 `EmptyState` 时失败
- 异常场景：如果明确 adapter waiver 存在则通过
- 风险点：未实现 waiver 读取
- 回滚操作：删除 waiver 分支
- 当前状态：done
- 权威文件：`scripts/tests/legacy-runtime-surface.test.mjs`
- 当前证据：Test asserts real `EmptyState`, governed `FeedbackStatePanel` carrier marker, and feedback header/white-body/panel CSS.
- 当前风险：Source test cannot prove final visual baseline alone.
- 当前回滚：Remove feedback assertions.

### 21.1 更新 minimal sync manifest

- 需求源行：271
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/config/legacy-minimal-sync-manifest.json:1`
- 落地动作：确认所有改动 runtime、scripts、tests 需要同步的文件被列入
- 异常场景：新增公共 lib 未列入会导致目标项目缺文件
- 风险点：本地测试通过，业务项目脚本缺依赖
- 回滚操作：移除新增 manifest 条目
- 当前状态：done
- 权威文件：`config/legacy-minimal-sync-manifest.json`
- 当前证据：Manifest includes the parity ledger, requirements JSON, completeness audit, managed audit generator, and `scripts/lib` runtime surface gates.
- 当前风险：Manifest drift can omit future standalone docs or scripts outside synced directories.
- 当前回滚：Remove the manifest entries and re-run minimal sync validation.

### 21.2 重建 runtime seal

- 需求源行：273
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/legacy-runtime-provenance.mjs:148`
- 落地动作：用现有 seal 构建流程生成目标项目新的 runtime hash
- 异常场景：未找到命令时，直接调用对应脚本函数或检查项目 npm scripts，不臆造命令
- 风险点：hash 不更新会导致 doctor 误判
- 回滚操作：恢复旧 `/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/outputs/runtime-seal.json:1`
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/outputs/runtime-seal.json`
- 当前证据：Seal was rebuilt after prior sync.
- 当前风险：Further runtime changes require rebuilding again.
- 当前回滚：Restore previous seal.

### 21.3 同步 runtime 到业务项目

- 需求源行：275
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/HiuiLegacyPage.tsx:1`
- 落地动作：同步 `runtime/legacy/src/HiuiLegacyPage.tsx`
- 异常场景：目标项目有本地 adapter 分支
- 风险点：覆盖本地兼容
- 回滚操作：还原该文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime`
- 当前证据：Root/list and scripts synced; all-file sync pending final audit.
- 当前风险：Partial sync can mismatch runtime source.
- 当前回滚：Restore target runtime.

### 21.4 同步 pages 到业务项目

- 需求源行：277
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages/TableBasicPage.tsx:1`
- 落地动作：同步所有 `pages/*.tsx`
- 异常场景：单文件同步遗漏
- 风险点：页型行为不一致
- 回滚操作：还原 `src/hiui-runtime/pages/**`
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/pages`
- 当前证据：Full runtime pages directory synchronized and seal rebuilt.
- 当前风险：Page runtime changes may not reach target.
- 当前回滚：Restore target pages.

### 21.5 同步 shared 到业务项目

- 需求源行：279
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared/list.tsx:1`
- 落地动作：同步 `shared/core.tsx`、`shared/list.tsx`、`shared/form.tsx`、`shared/detail.tsx`
- 异常场景：目标项目有人工热修
- 风险点：覆盖本地修复
- 回滚操作：还原 `src/hiui-runtime/shared/**`
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/shared`
- 当前证据：Full runtime shared directory synchronized and seal rebuilt.
- 当前风险：Shared helpers can diverge.
- 当前回滚：Restore target shared files.

### 21.6 同步 scripts 到业务项目

- 需求源行：281
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:1`
- 落地动作：同步所有被修改门禁脚本
- 异常场景：脚本引用新公共 lib 但 manifest 漏同步
- 风险点：业务项目验证脚本运行失败
- 回滚操作：还原 `.local-context/hiui-design/scripts/**`
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts`
- 当前证据：Changed verify, acceptance, geometry, provider, and surface gate scripts synchronized.
- 当前风险：Script set can diverge.
- 当前回滚：Restore target scripts.

### 22.1 验证 skill 单测

- 需求源行：285
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/package.json:1`
- 落地动作：先查真实 test script，再运行最小相关测试
- 异常场景：无统一 test script 时，直接运行相关 `.test.mjs`
- 风险点：臆造命令会浪费时间
- 回滚操作：不涉及文件回滚
- 当前状态：done
- 权威文件：`scripts/tests`
- 当前证据：Focused tests passed after the latest runtime/provider/geometry changes.
- 当前风险：Green subset can overclaim broad readiness if future files are added without tests.
- 当前回滚：Re-run the focused test command after each module.

### 22.2 验证目标项目静态门禁

- 需求源行：287
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-verify.mjs:1`
- 落地动作：对物流页运行 `node .local-context/hiui-design/scripts/typical-page-legacy-verify.mjs --page-type table-basic --page src/views/divide-management/logistics-management --target /Users/guorui/Documents/work/git/asp-service-operations-workbench --json`
- 异常场景：新门禁失败说明旧 runtime/adapter 仍未同步
- 风险点：只跑物流页覆盖不足
- 回滚操作：还原门禁或继续修 runtime
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-verify.mjs`
- 当前证据：Logistics page static verify passes.
- 当前风险：One page does not prove 9 page types.
- 当前回滚：Re-run after sync changes.

### 22.3 创建页型 parity 样例

- 需求源行：289
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/views/__hiui_runtime_parity__/table-basic/page.instance.tsx:1`
- 落地动作：为每个页型建立最小样例页
- 异常场景：业务项目不允许新增样例目录，则放 `.local-context/hiui-design/fixtures/runtime-parity/**`
- 风险点：样例进入生产路由
- 回滚操作：删除 parity 样例目录
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/views/__hiui_runtime_parity__`
- 当前证据：9 minimal parity sample pages and matching `runtime-parity-sample` page contracts were generated.
- 当前风险：Samples can leak into production routing.
- 当前回滚：Delete parity sample directory.

### 22.4 逐页型静态 verify

- 需求源行：291
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-verify.mjs:1`
- 落地动作：对 9 个页型逐个运行 verify
- 异常场景：某页型本轮明确 blocked，应输出 blocked 而非假通过
- 风险点：只看 exit code 不看 issue 明细
- 回滚操作：不改文件
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-verify.mjs`
- 当前证据：Static verify passed for all 9 parity sample page types.
- 当前风险：Narrow verify can hide non-table gaps.
- 当前回滚：Remove generated samples/reports.

### 22.5 启动业务项目

- 需求源行：293
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/package.json:1`
- 落地动作：按真实 script 启动 dev server
- 异常场景：Node/pnpm 版本不匹配时按项目 AGENTS 要求使用 Node 16.20.3、pnpm 8.6.12
- 风险点：用错误 Node 会出现非本次问题
- 回滚操作：停止 dev server
- 当前状态：done
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/package.json`
- 当前证据：`NODE_OPTIONS=--openssl-legacy-provider npm run start` launched dev server at `http://127.0.0.1:4117/` and compiled successfully.
- 当前风险：Dev server serves a Module Federation remote without a standalone production host page.
- 当前回滚：Stop dev server session and remove temporary harness files.

### 22.6 运行物流页 delivery acceptance

- 需求源行：295
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-accept.mjs:1`
- 落地动作：传真实 `--runtime-url` 与 `--profile delivery`
- 异常场景：没有真实 URL 时不能标 delivery-ready
- 风险点：preview-ready 冒充 delivery-ready
- 回滚操作：删除本次生成的 acceptance 报告或标 failed
- 当前状态：blocked
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/typical-page-legacy-accept.mjs`
- 当前证据：Static gate, build with `NODE_OPTIONS`, runtime DOM, geometry, visual screenshot existence, and warning classification now pass with local React16 harness evidence; persisted delivery report still fails only because runtime capture is `provided-local` and delivery visual evidence requires a non-local runtime URL.
- 当前风险：Treating local harness evidence as delivery would overclaim production readiness.
- 当前回滚：Keep failed delivery report, provide a real non-local host URL, then re-run acceptance without a waiver.

### 22.7 运行 9 页型 runtime acceptance

- 需求源行：297
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/outputs/legacy-acceptance/:1`
- 落地动作：确认每个页型都有报告
- 异常场景：blocked 页型必须报告 blocked reason
- 风险点：漏页型
- 回滚操作：删除 parity acceptance 报告
- 当前状态：blocked
- 权威文件：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/outputs/legacy-acceptance/parity-preview`
- 当前证据：Under `HIUI_RUNTIME_PARITY_EXPOSES=1`, all 9 parity pages render through Module Federation with 0 console warnings/page errors and all 9 `*.dom-geometry.delivery.json` files report `ok:true`; this is still local harness evidence, not delivery-ready host evidence.
- 当前风险：Treating env-gated local exposes as production delivery would overclaim readiness.
- 当前回滚：Keep parity exposes behind `HIUI_RUNTIME_PARITY_EXPOSES=1`; use a governed non-local host preview URL for delivery, then rerun acceptance.

### 23.1 回滚 skill runtime

- 需求源行：301
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/runtime/legacy/src/styles.css:1`
- 落地动作：用 git 恢复 `runtime/legacy/src/**`
- 异常场景：没有 git 历史时使用修复前备份
- 风险点：只回滚部分 runtime 会产生混合状态
- 回滚操作：Run `git restore runtime/legacy/src`, rebuild target runtime seal if already synced, then rerun `node --test scripts/tests/legacy-runtime-surface.test.mjs`.
- 验证方式：重新运行相关 verify 应回到修复前状态
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：Rollback recipe covers `git restore runtime/legacy/src` or restoring the pre-change backup, then rerunning focused verify.
- 当前风险：Partial rollback can mix versions.
- 当前回滚：Run `git restore runtime/legacy/src`, rebuild target runtime seal if already synced, then rerun `node --test scripts/tests/legacy-runtime-surface.test.mjs`.

### 23.2 回滚 skill scripts

- 需求源行：303
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/lib/dom-geometry-gate.mjs:1`
- 落地动作：恢复 `scripts/lib/**` 与相关 `scripts/*.mjs`
- 异常场景：新增公共 lib 需要删除引用和文件
- 风险点：残留 import 会导致脚本崩溃
- 回滚操作：Run `git restore scripts/lib scripts/*.mjs`, delete orphan new helper files, then run the affected script `--help` or focused tests.
- 验证方式：运行 `node` 脚本 help 或最小测试
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：Rollback recipe covers `git restore scripts/lib scripts/*.mjs` and deletion of newly introduced public gate helpers.
- 当前风险：Residual imports can break scripts.
- 当前回滚：Run `git restore scripts/lib scripts/*.mjs`, delete orphan new helper files, then run the affected script `--help` or focused tests.

### 23.3 回滚 skill tests

- 需求源行：305
- 文件路径：`/Users/guorui/Documents/skills/hiui-design/scripts/tests/legacy-verify-boundary.test.mjs:1`
- 落地动作：删除新增测试或恢复旧测试
- 异常场景：测试快照变更也要同步回滚
- 风险点：CI 留下无效失败
- 回滚操作：Run `git restore scripts/tests`, delete newly added test files, then rerun the minimal impacted test command.
- 验证方式：跑测试目录最小集
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：Rollback recipe covers restoring changed tests and removing newly added regression files.
- 当前风险：CI can keep stale tests.
- 当前回滚：Run `git restore scripts/tests`, delete newly added test files, then rerun the minimal impacted test command.

### 23.4 回滚业务项目 runtime

- 需求源行：307
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/styles.css:1`
- 落地动作：恢复 `src/hiui-runtime/**`
- 异常场景：物流页已依赖新 runtime，回滚后视觉问题复现
- 风险点：项目 runtime 与 `.local-context` 脚本版本不匹配
- 回滚操作：Restore target `src/hiui-runtime/**`, rerun runtime seal generation, then rerun target `typical-page-legacy-verify`.
- 验证方式：重新跑 legacy verify
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：Rollback recipe covers restoring `/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/hiui-runtime/**` and regenerating `.local-context/hiui-design/outputs/runtime-seal.json`.
- 当前风险：Runtime/seal mismatch.
- 当前回滚：Restore target `src/hiui-runtime/**`, rerun runtime seal generation, then rerun target `typical-page-legacy-verify`.

### 23.5 回滚业务项目脚本

- 需求源行：309
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/lib/legacy-runtime-provider-policy.mjs:1`
- 落地动作：恢复 `.local-context/hiui-design/scripts/**`
- 异常场景：runtime seal 仍是新 hash
- 风险点：旧脚本信任新 runtime 或新脚本检查旧 runtime
- 回滚操作：Restore `.local-context/hiui-design/scripts/**`, rerun target verify, and confirm checks match the restored runtime seal.
- 验证方式：verify 输出版本和 checks 一致
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：Rollback recipe covers restoring `/Users/guorui/Documents/work/git/asp-service-operations-workbench/.local-context/hiui-design/scripts/**` to the same version as the runtime.
- 当前风险：Script/runtime mismatch.
- 当前回滚：Restore `.local-context/hiui-design/scripts/**`, rerun target verify, and confirm checks match the restored runtime seal.

### 23.6 回滚生成报告和样例

- 需求源行：311
- 文件路径：`/Users/guorui/Documents/work/git/asp-service-operations-workbench/src/views/__hiui_runtime_parity__/table-basic/page.instance.tsx:1`
- 落地动作：删除 parity 样例和对应 acceptance 输出
- 异常场景：样例已加入路由或 module federation exposes，需同步删除引用
- 风险点：残留测试页进入生产
- 回滚操作：Delete `src/views/__hiui_runtime_parity__`, delete `.local-context/hiui-design/outputs/legacy-acceptance/parity-preview`, remove parity exposes, rebuild, then confirm `rg "HiuiRuntimeParity
- 验证方式：`rg "__hiui_runtime_parity__"` 无业务引用
- 当前状态：done
- 权威文件：`docs/generation/legacy-runtime-template-parity.md`
- 当前证据：Rollback recipe covers deleting parity samples, acceptance outputs, and env-gated Module Federation exposes after delivery evidence is collected.
- 当前风险：Test pages can leak to production.
- 当前回滚：Delete `src/views/__hiui_runtime_parity__`, delete `.local-context/hiui-design/outputs/legacy-acceptance/parity-preview`, remove parity exposes, rebuild, then confirm `rg "HiuiRuntimeParity

