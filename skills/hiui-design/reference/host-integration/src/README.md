# Host Integration Example

This example shows the minimum host-side code another project needs in order to reuse
`@hiui-design/typical-page-shells`, and includes a route gallery covering the main typical
page types plus the shared data-visualization / feedback capability pages.

## Files

- `src/app-frame.tsx`
  Provides the application-level navigation shell for greenfield host-integration projects, aligned with the current repository's left navigation style. The shell now includes the HiUI-style app switcher, search trigger, help action, feedback action, and the bottom avatar entry with a language submenu for live locale switching.
- `src/components/layout/layout-content-context.tsx`
  Provides header/footer slot refs and the route title ref.
- `src/components/layout/page-header-portal.tsx`
  Implements the host project's header portal behavior.
- `src/components/layout/typical-page-host.tsx`
  Connects host portals to `TypicalPageHostProvider`.
- `src/pages/typical-pages.mock.ts`
  Centralizes reusable mock data, options, and request functions for the gallery.
- `src/pages/basic-table.tsx`
  Demonstrates a reusable normal table page.
- `src/pages/table-stat.tsx`
  Demonstrates a reusable stat-list page using only package imports.
- `src/pages/data-visualization.tsx`
  Demonstrates a shared data-visualization capability page built on the same host shell contract.
- `src/pages/tree-table.tsx`
  Demonstrates a reusable tree-table page.
- `src/pages/inventory-split.tsx`
  Demonstrates a reusable left-tree-right-table page.
- `src/pages/drawer-form.tsx`
  Demonstrates a reusable typical drawer form page.
- `src/pages/drawer-detail.tsx`
  Demonstrates a reusable typical drawer detail page.
- `src/pages/full-page-edit.tsx`
  Demonstrates a reusable full-page edit page.
- `src/pages/full-page-detail.tsx`
  Demonstrates a reusable grouped detail page.
- `src/pages/empty-state.tsx` and other `feedback/*.tsx`
  Demonstrate shared feedback/exception capability pages and their asset loading.
- `src/charts/hiui-chart-theme.ts`
  Centralizes the chart color and axis theme used by the shared visualization example.
- `src/assets/*.svg`
  Provides the shared feedback/exception illustration assets.
- `src/routes/config.tsx`
  Shows the minimum menu/route wiring pattern for an external project, including all
  core page shells and shared capability groups.
- `CHECKLIST.md`
  Acceptance checklist for consumers integrating the package.

## Integration steps

1. Install `@hiui-design/typical-page-shells`, its peer dependencies, and the additional host-side direct dependencies discovered from `src/`.
2. Import `@hiui-design/typical-page-shells/styles.css` once in the app entry, such as `src/main.tsx`.
3. If the target project uses the generated `src/translation` bridge, keep the top-level app wrapped in `LocaleProvider` and merge `en-US` into `id-ID / th-TH / de-DE / ar-SA` before mounting, so HiUI component copy stays aligned with the selected locale while page-level business text still follows the translation bridge.
4. Copy the host-side layout slot pattern from `src/components/layout/`.
5. For greenfield React Router apps, mount `src/app-frame.tsx` around the route outlet so the synced gallery renders inside an application-level sidebar shell that matches the current repository.
6. If the target project does not already have a real host header/footer contract, wrap the route outlet with `TypicalPageHostBridge` or build routes with `createTypicalPageReuseRoutes({ wrapInShell: true })`.
7. If the target project already has its own layout header, do not wrap each example page with `ExampleAppShell`; reuse the existing host so the page header only mounts once.
8. Do not build a second top-level preview workspace with `ExampleAppShell + custom sidebar/nav + createTypicalPageReuseRoutes(...)`. In greenfield host-integration, `src/app-frame.tsx` is the single owner of navigation, header/footer portals, background, and outlet height chain.
9. Keep the `src/app-frame.tsx` host contract intact: `LayoutContentProvider`, `TypicalPageHostBridge`, the header slot, the route outlet, the footer slot, and the route-title fallback ref all need to stay in the chain together.
10. When mounting the synced gallery into navigation, keep the icon on the top-level `示例` menu node. `表格`, `图表`, `表单`, `详情`, and `异常` are second-level groups under that node.
11. When adding real business first-level groups beside `示例`, choose semantic `@hi-ui/icons` Filled icons for each domain. `AppStoreFilled` is reserved for the `示例` gallery and must not be copied to `业务`, `项目`, `订单`, or `工单`.
12. Build pages with package imports:
   - `@hiui-design/typical-page-shells`
   - `@hiui-design/typical-page-shells/host`
13. Keep route wiring, layout CSS, and real portals inside the host project.
14. If the target project uses Vite, alias `@hi-ui/schema-types` to `src/typical-page-reuse/shims/schema-types-empty.js`.
15. Keep the host header slot full width so `PageHeader extra` actions stay right-aligned after portal mounting.
16. If a page writes raw `SchemaForm` and contains `CheckSelect`, wrap it with `TypicalPageFieldMapProvider` from `@hiui-design/typical-page-shells`.

## Host portal hard rule

- Do not simplify `src/app-frame.tsx` into "sidebar + outlet" only.
- Keep `LayoutContentProvider`, `TypicalPageHostBridge`, `headerRef`, `footerRef`, `titleTextRef`, `ref={headerRef}`, and `ref={footerRef}` together.
- Full-page edit/detail headers rely on that host chain. If it breaks, `TypicalPageHeaderPortal` falls back to the page content shell and the header area looks white.
- Do not try to hide that failure by repainting the header gray. Fix the host portal contract instead.

## Recommended command flow

1. First bootstrap from the target project root:
   - `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs"`
2. After bootstrap, reuse the registered project script:
   - `pnpm typical-page:apply`
   - or `npm run typical-page:apply`
3. For non-technical designers, prefer the higher-level setup script:
   - `pnpm typical-page:designer-setup`
   - or `npm run typical-page:designer-setup`
4. When asking AI to generate a new typical page, first load:
   - `.local-context/hiui-design/rules/generation-rules.md`
   - `.local-context/hiui-design/rules/page-type-map.md`
   - `.local-context/hiui-design/SKILL.md`
   - `.local-context/hiui-design/docs/generation/figma-page-rules.md`
5. Before generating any business page, first open the synced example pages and verify the host layout plus package styles are working.
6. Before generating any business page, run `pnpm typical-page:doctor` or `npm run typical-page:doctor`.
7. For Vite projects, verify that `vite.config.*` already contains the `@hi-ui/schema-types` alias or apply `src/typical-page-reuse/VITE_ALIAS_SNIPPET.md`.
8. Review `src/typical-page-reuse/SMOKE_REPORT.md` and open the listed baseline pages first.
9. Then copy the closest page from `src/pages/` and only replace business fields.
10. If the target is a full-page edit page, `src/pages/full-page-edit.tsx` is the required start point. Do not regenerate it from a blank file or a generic `Card + Form + footer` scaffold.
11. If the target is a stat-list page, `src/pages/table-stat.tsx` is the required start point. Do not rebuild it from a basic table page or a generic page shell.

## Full-page edit hard rule

- Full-page edit pages must keep the same shell chain as `src/pages/full-page-edit.tsx`.
- Keep `TypicalPageHeaderPortal`, `PageHeader`, `proEditPageShellStyles.formScrollBody`, and `proEditPageShellStyles.inlineEditFooter` inside the same `ProEditPage`.
- Keep `inlineEditFooter` as the sibling of `formScrollBody`; do not move it into the scroll body and do not remount it into a host footer slot.
- Keep the host content area, route outlet, page root, and direct wrappers around `ProEditPage` as one continuous `flex + min-height: 0` height chain; otherwise the action area will stop at the end of the form instead of sticking to the bottom.
- Do not add an extra `padding: 20px` wrapper on `formScrollBody`; top-level spacing should come from the form groups themselves.
- Only replace business slots such as fields, group definitions, request functions, button text, and route title.
- If the result looks like a gray host page containing a single white form card, or the action area no longer sticks to the bottom, treat it as a failed generation/integration and rebuild from the example page instead of patching footer CSS on top.

## Stat-list hard rule

- Stat-list pages must keep the same shell chain as `src/pages/table-stat.tsx`.
- Keep `StatListPageFrame`, `StatOverviewGrid`, and `proStatPageStyles.headerExtra` together.
- Keep the host content area as a flex column with `min-height: 0`; do not place the typical page inside a plain block-flow container.
- If stat cards turn into plain text or the white body disappears, treat it as a failed integration and first check package style resources plus host height chain.

## Cross-page stop rule

- If multiple example pages are visually off at the same time, stop generating new business pages.
- First fix host layout integration and package style loading.
- Only resume business-page generation after the synced example pages render close to the current project baseline.

## Covered core page types

- 数据统计表
- 普通表格
- 树形表格
- 左树右表
- 抽屉表单
- 抽屉详情
- 全页编辑
- 全页详情

## Covered shared capabilities

- 数据可视化
- 异常反馈页组

## Notes

- This directory is the editable source of truth for host-integration example assets.
- `src/typical-page-reuse/` in the app is the synced runtime copy used for smoke checks and gallery verification.
- The default route export no longer auto-wraps each page with `ExampleAppShell`. That wrapper is only for standalone smoke hosts that do not already provide a real page-header portal target.
- `ExampleAppShell` is not the root application shell for greenfield host-integration. If it appears in the top-level `App.*` together with custom nav/sidebar markup, treat that as a deprecated preview pattern and replace it with `TypicalPageAppFrame`.
- The example intentionally uses package imports instead of local `src/components/pro-*` paths.
- If stat cards degrade into plain text or the page shell loses its white card layout, first check whether the target project imported `@hiui-design/typical-page-shells/styles.css`.
- Greenfield `react-vite-router` projects now try to auto-patch both the route file and the top-level App shell. If that patch cannot be applied safely, bootstrap writes `APP_FRAME_SNIPPET.md` next to the synced assets.
- All synced typical pages are grouped under the top-level menu `示例`, instead of splitting them into separate first-level menus. That top-level node keeps its own icon.
- First-level menu icons are navigation semantics, not placeholders. Keep `AppStoreFilled` only on `示例`; business first-level groups need their own semantic Filled icons.
- The route tree and app-frame menu tree must share the same host-level `示例` gallery route. Do not pass bare `typicalPageReuseRoutes` into `TypicalPageAppFrame`; otherwise `表格`, `图表`, `表单`, `详情`, and `异常` become first-level menus.
