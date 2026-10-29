# Host Integration Example

This directory now serves two purposes only:

1. It is the source of truth for the packaged preview runtime.
2. It is a host-shell reference for generating or auditing real business pages.

Target projects may still keep this directory under `.local-context/hiui-design/` as project-local
source assets, because the managed generator, host-shell repair flow, shim references, and formal
shell source contracts still point here. What they no longer do is integrate this directory as a
previewable gallery application: target projects must not mount its preview routes, must not keep
`/__typical-preview` style entries, and must not treat these files as a consumer-side route tree.
If you need to inspect official examples, open the packaged preview runtime instead of copying
this directory into project routes.

## Files

- `src/app-frame-core.tsx`
  Provides the official application-level host shell core for greenfield host-integration projects and first formal business shells, aligned with the current repository's enhanced left navigation style including menu search, grouped second-level float menus, host-side footer actions, language switching, app switching, and a profile center.
- `src/app-frame.tsx`
  Provides the preview wrapper around `src/app-frame-core.tsx`; it keeps the `TypicalPageAppFrame` import stable for preview runtime consumers and only adds gallery-only prompt overlay behavior.
- `src/host-shell-localization.ts`
  Provides the host-shell localization adapter. It is the formal reuse point for locale switcher behavior, menu-title translation, RTL direction, and host-side i18n fallbacks.
- `src/translation/`
  Provides the demo translation runtime, locale catalogs, and locale-aware helpers used by the preview example and by target projects that explicitly choose a local locale bridge. It is no longer the default formal host-shell contract.
- `src/components/prompt-copy-floating-button.tsx`
  Provides a preview-only floating prompt viewer/copy action for the synced gallery routes.
- `src/routes/example-prompts.ts`
  Stores the preview-only page-generation prompt presets referenced by gallery routes.
- `src/components/layout/layout-content-context.tsx`
  Provides header/footer slot refs and the route title ref.
- `src/components/layout/page-header-portal.tsx`
  Keeps the managed footer portal helper used by the official host shell. If a target host still needs a shared header bridge, implement that compatibility layer locally instead of reviving it as the default example path.
- `src/components/layout/typical-page-host.tsx`
  Connects `TypicalPageHostProvider` to the managed host bridge and keeps the default self-contained page header model.
- `src/pages/typical-pages.mock.ts`
  Centralizes reusable mock data, options, and request functions for the gallery.
- `src/pages/basic-table.tsx`
  Demonstrates a reusable normal table page.
- `src/pages/table-stat.tsx`
  Demonstrates a reusable stat-list page using only package imports.
- `src/pages/data-visualization/index.tsx`
  Demonstrates a reusable analytics page that keeps the shell-owned white-body workspace intact.
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
- `src/pages/feedback-status/`
  Demonstrates a reusable feedback-status page family with shared shell, variants, and SVG assets.
- `src/routes/config.tsx`
  Shows the minimum menu/route wiring pattern for an external project, including all
  core page shells.
- `CHECKLIST.md`
  Acceptance checklist for consumers integrating the package.

## Integration steps

1. Materialize the managed local runtime under `src/components/hiui-design-runtime`, install the peer dependencies it requires, and install the additional host-side direct dependencies discovered from `src/`.
2. Import the local managed runtime stylesheet once in the app entry, such as `src/main.tsx`, by resolving a relative path to `src/components/hiui-design-runtime/styles.css`.
3. Copy the host-side layout slot pattern from `src/components/layout/`.
4. When materializing the first formal business shell, treat `src/app-frame-core.tsx` as the certified host-shell source and keep preview-only wrapper concerns out of formal routes.
5. Keep the enhanced host-shell grammar intact: the search trigger, top-level side menu, floating second-level menu, footer action area, app switcher, and profile center work together as one host-integration example shell.
6. Bridge the route outlet with `TypicalPageHostBridge`; it keeps page headers self-contained inside the page and only carries footer hosting. If the target project must preserve a legacy shared header carrier, implement that compatibility bridge locally instead of restoring it as the default example path.
7. If the target project already has its own layout header, do not wrap each example page with `ExampleAppShell`; reuse the existing host so the page-owned header only mounts once.
8. Keep the `src/app-frame-core.tsx` host contract intact: `LayoutContentProvider`, `TypicalPageHostBridge`, the route outlet, the footer slot, and the route-title fallback ref all need to stay in the chain together. The shared header slot remains a legacy compatibility path, not the default page contract.
9. Treat any `/__typical-preview`, `typicalPagePreviewRoutes`, or copied gallery route tree inside a target project as legacy residue. Remove it and inspect official examples through the packaged `preview-runtime/` instead.
10. Build generated business pages with local managed runtime imports:
   - `src/components/hiui-design-runtime/*`
   - `src/components/hiui-design-runtime/host`
11. Keep route wiring, layout CSS, and real portals inside the host project.
12. If the target project uses Vite, alias `@hi-ui/schema-types` to `.local-context/hiui-design/examples/host-integration/src/shims/schema-types-empty.js`.
13. If the host keeps a legacy shared header slot as a compatibility bridge, keep that slot full width so any bridged `PageHeader extra` actions stay right-aligned; standard typical pages themselves should still own a single self-contained `PageHeader`.
14. If a page writes raw `SchemaForm` and contains `CheckSelect`, wrap it with `TypicalPageFieldMapProvider` from the managed local runtime entrypoint.
15. If you reuse the enhanced host shell, keep `src/host-shell-localization.ts` together with `src/app-frame-core.tsx`; the locale switcher, RTL placement, translated menu titles, and host-side fallback rules all depend on that adapter. Only keep `src/translation/` together as well when the target project explicitly chooses the local locale bridge path instead of reusing its own host i18n runtime.
16. Treat `src/components/prompt-copy-floating-button.tsx` and `src/routes/example-prompts.ts` as preview-only tooling; do not wire them into formal business routes or generated business pages.
17. If the target project wants the same standalone locale bridge outside the preview-runtime wrapper flow, run `node ".local-context/hiui-design/scripts/init-i18n.mjs"` once from the target project root, then maintain locale files through `pnpm i18n:sync` or `npm run i18n:sync`. Do not treat this as a default bootstrap step.
18. If the target project explicitly enables that local locale bridge, keep project-specific fallback terms in the target project's `src/translation/demo-overrides.ts`; do not sync those business terms back into `templates/i18n/src/translation/demo-overrides.ts` in the skill source.

## Host portal hard rule

- Do not simplify `src/app-frame-core.tsx` into "sidebar + outlet" only.
- Do not replace the enhanced host-integration shell with a custom left-bar implementation; keep the search trigger, grouped second-level float menu, footer actions, locale switcher, app switcher, and profile center in the same shell grammar.
- Keep `LayoutContentProvider`, `TypicalPageHostBridge`, `headerRef`, `footerRef`, `titleTextRef`, `ref={headerRef}`, and `ref={footerRef}` together.
- Treat the shared header slot as a legacy compatibility carrier. Standard typical pages should keep their own single `PageHeader` inside the page shell, and hosts with an explicit old shared-header requirement should keep that bridge local to the target project instead of relying on the example shell surface.
- Do not treat `/__typical-preview` as a supported target-project integration shape anymore. If such a route still exists in a consumer project, remove it and use the packaged preview runtime instead.
- Keep the managed host typography baseline inside `src/host-reset.css`, including the local `--hi-v5-text-size-*` and `--hi-v5-text-lineheight-*` token ownership that protects page headers and buttons from root rem pollution. Do not try to counter a shared business shell by adding `font`, `font-size`, `line-height`, `letter-spacing`, or global `h1-h6` fixes inside generated business pages.
- Treat `src/host-reset.css` and page-local `page-owned-mount-support` as baseline restorers, not component skin overrides. Do not use broad raw-tag inheritance such as `button` / `input` / `label` / `span` to rewrite component internals, and do not reset component root semantic colors such as `.hi-v5-button { color: inherit; }`.
- When isolation must adapt component internals, bind to the proven structure contract for that version, for example `hi-v4-form-label*` or `hi-v5-form-label*`, and cover it with regression tests before reusing the change in generated pages.
- If all text grows or shrinks together, treat it as a public-shell baseline problem. First fix the host baseline or remove the shared root typography override; do not patch individual page templates one by one.
- Full-page edit/detail pages rely on that host chain. If it breaks, the self-contained `PageHeader` and white-body workspace drift apart and the header area looks white.
- Do not try to hide that failure by repainting the header gray. Fix the shared header-slot collapse contract and the host height chain instead.

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
   - `.local-context/hiui-design/docs/generation/generation-principles.md`
   - `.local-context/hiui-design/docs/generation/page-type-map.md`
   - `.local-context/hiui-design/SKILL.md`
   - `.local-context/hiui-design/docs/generation/figma-page-rules.md`
5. Before generating any business page, first open the official preview pages through the packaged preview runtime and verify the host layout plus package styles are working.
6. Before generating any business page, run `pnpm typical-page:preflight` or `npm run typical-page:preflight`.
7. Run `pnpm typical-page:doctor` or `npm run typical-page:doctor` only for first-time acceptance, runtime troubleshooting, or formal handoff; it is no longer the default generation gate.
8. For Vite projects, verify that `vite.config.*` already contains the `@hi-ui/schema-types` alias or apply `.local-context/hiui-design/outputs/host-integration-guidance/VITE_ALIAS_SNIPPET.md` by default.
9. Review `.local-context/hiui-design/outputs/host-integration-guidance/SMOKE_REPORT.md` and open the listed baseline pages first through the packaged preview runtime.
10. For standard typical pages, the supported formal write path is `generate-page.mjs`; it internally freezes the brief, runs the managed generator, and closes with `typical-page-slot-gate`. When you need audit detail or step-by-step debugging, you may still run `generation-brief.mjs` or `plan-page-task.mjs` first and then `generate-page-from-brief.mjs`. Do not manually copy a page from `src/pages/`, and do not let AI bypass the managed generator path.
11. `src/pages/*` remains the official template fact source inspected by the managed generator. It is not a consumer-facing instruction to hand-copy page files into business code, and it is not a signal that the target project should mount these files as a local preview gallery.
12. If the target is a full-page edit page, the managed generator must resolve `src/pages/full-page-edit.tsx` as the required template start point. Do not regenerate it from a blank file or a generic `Card + Form + footer` scaffold.
13. If the target is a stat-list page, the managed generator must resolve `src/pages/table-stat.tsx` as the required template start point. Do not rebuild it from a basic table page or a generic page shell.
14. If the target is a data-visualization page, the managed generator must resolve `src/pages/data-visualization/index.tsx` as the required template start point. Do not collapse it back to `table-stat` or an ad-hoc chart wall.
15. If the target is a feedback-status page, the managed generator must resolve `src/pages/feedback-status/index.tsx` and switch variants through the shared registry instead of copying one file per state.

## Full-page edit hard rule

- Full-page edit pages must keep the same shell chain as `src/pages/full-page-edit.tsx`.
- Keep a single `PageHeader`, `proEditPageShellStyles.formScrollBody`, and `proEditPageShellStyles.inlineEditFooter` inside the same `ProEditPage`.
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
- If text across the whole page becomes uniformly larger or smaller, treat it as host baseline leakage. Fix the shared root typography or `src/host-reset.css` instead of adding page-local font patches.

## Cross-page stop rule

- If multiple example pages are visually off at the same time, stop generating new business pages.
- First fix host layout integration and package style loading.
- Only resume business-page generation after the synced example pages render close to the current project baseline.

## Covered page types

- 数据统计表
- 数据可视化
- 普通表格
- 树形表格
- 左树右表
- 抽屉表单
- 抽屉详情
- 全页编辑
- 全页详情
- 异常反馈页

## Notes

- This directory is the editable source of truth for host-integration source assets.
- Keeping this directory under `.local-context/hiui-design/` does not mean the target project supports a project-local preview app. It only means the project can resolve official templates, shims, shell source files, and preview-runtime references from one stable local context root.
- `src/app-frame-core.tsx` is the official host-shell core source for formal shell reuse; `src/app-frame.tsx` is the preview-runtime wrapper.
- `src/typical-page-preview/` in the app should be treated only as a legacy leftover to remove. Official preview now stays exclusively in the packaged `preview-runtime/`.
- The default route export no longer auto-wraps each page with `ExampleAppShell`. That wrapper is only for standalone smoke hosts that still need demo header/footer slot carriers outside a real business host.
- The floating prompt copy helper is preview-only. It stays in `src/app-frame.tsx`, but formal business pages and generated formal shells must not keep `examplePrompt` fields or import `PromptCopyFloatingButton`.
- The example intentionally uses package imports instead of local `src/components/pro-*` paths.
- If stat cards degrade into plain text or the page shell loses its white card layout, first check whether the target project imported the local managed runtime stylesheet from `src/components/hiui-design-runtime/styles.css`.
- `src/translation/` is the host-shell demo runtime and the standalone i18n baseline seed for explicit local-bridge adoption only. Target projects should evolve their own locale files locally and rerun `i18n:sync`; the skill template must stay generic.
- Greenfield `react-vite-router` projects now try to auto-patch both the route file and the top-level App shell. If that patch cannot be applied safely, bootstrap writes `APP_FRAME_SNIPPET.md` next to the synced assets.
- All synced typical pages are grouped under the top-level menu `示例`, instead of splitting them into separate first-level menus. That top-level node keeps its own icon.
