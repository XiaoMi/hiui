# HiUI5 Page Generation Report

- schema: hiui-design-page-generation-report.v2
- status: written
- templatePass: pass
- engineeringPass: pass
- navigationFlowPass: pass
- businessSemanticPass: placeholder
- technicalPass: pass
- businessPass: fail
- dryRun: false
- plannedFileCount: 136
- writtenFileCount: 18
- skippedIdenticalFileCount: 118
- managedRuntimeWrittenFileCount: 0
- parentFlowPatchStatus: not-applicable
- backNavigationStrategy: —
- mode: host-integration
- inputMode: page-prompt / 页面提示词
- confirmationMode: —
- requiresChatConfirmation: false
- confirmedPageFamily: —
- confirmedPageType: —
- finalPromptAvailable: false
- generationPath: standard-template-direct-output / 标准模板直出
- carrierStrategy(copyMode): direct-copy
- workflowKind: typical-template
- workflowDefaultFlow: official-template-copy-and-replace-business-slots
- replaceBusinessSlotsByDefault: true
- generatorMode: direct-copy
- contentGenerationMode: business-slot-replacement
- templateUsageMode: official-template-copy
- pageType: table-basic / 普通表格
- pageFamily: typical-page
- pageFamilyContract: typical-page / 典型页面
- primaryBusinessPageLink: —
- linkSource: blocked-local-route
- primaryPageLinkBlockedReason: Local business route link requires an explicit localOrigin in README.md; do not default to localhost:5173.
- primaryPageLinkRuntimeReadiness: —
- primaryPageLinkCaveat: —
- pageFamilyLegacyRefactorContractMode: none
- destDir: /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management
- primaryPageLink: —
- sourceTemplatePath: /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/pages/basic-table.tsx
- sourceStylePath: —
- hostCapability: partial
- hostCapabilityReason: Host compatibility light gate passed. Page generation can proceed.
- formalHostAction: create-formal-host-and-register-first-page
- navigationBlocked: false
- navigationBlockReason: —
- navigationMountAction: create-formal-shell-and-mount-entry
- navigationMountActionTargetShellPath: src/business-shell/app-frame.tsx
- navigationMountActionTargetRegistryPath: src/business-shell/routes.tsx
- navigationMountActionAppEntryPath: src/main.jsx
- hostShellDecisionStatus: materialize-official-formal-host-shell
- hostShellMaterializationStrategy: thin-wrapper-over-managed-local-runtime
- hostShellTargetShellPath: src/business-shell/app-frame.tsx
- hostShellTargetRegistryPath: src/business-shell/routes.tsx
- coverageDecision: legacy-contract-without-managed-coverage
- localAdjustmentHandling(adjustmentHandling): template-only
- managedByTemplate: true
- componentDecisionRequired: false
- tokenDecisionRequired: false
- pageAdjustmentContractStatus: not-requested
- pageAdjustmentContractSource: —
- pageAdjustmentExecutionStatus: not-requested
- pageAdjustmentExecutionMode: not-requested
- pageAdjustmentSelectedRegion: —

## Files

- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/app-frame.tsx ← hiui-design:generated-formal-business-app-frame
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/routes.tsx ← hiui-design:generated-formal-business-routes
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/app-frame-core.tsx ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/app-frame-core.tsx
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/components/layout/layout-content-context.tsx ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/components/layout/layout-content-context.tsx
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/host-shell-localization.ts ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/host-shell-localization.ts
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/components/layout/typical-page-host.tsx ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/components/layout/typical-page-host.tsx
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/route-base-path.ts ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/route-base-path.ts
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/host-reset.css ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/host-reset.css
- /Users/guorui/Documents/ChatGPT/New project/src/business-shell/components/layout/page-header-portal.tsx ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/components/layout/page-header-portal.tsx
- /Users/guorui/Documents/ChatGPT/New project/src/main.jsx ← hiui-design:generated-formal-business-app-entry
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/page-owned-mount-support/index.tsx ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/components/hiui-design-runtime/page-owned-mount-support/index.tsx
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/page-owned-mount-support/index.module.scss ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/components/hiui-design-runtime/page-owned-mount-support/index.module.scss
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/page-owned-mount-support/shared-header-node.ts ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/components/hiui-design-runtime/page-owned-mount-support/shared-header-node.ts
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/mock.ts ← hiui-design:generated-page-local-mock-module
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/index.tsx ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/pages/basic-table.tsx
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/data-visualization/request-utils.ts ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/pages/data-visualization/request-utils.ts
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/page-localization.ts ← /Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/examples/host-integration/src/pages/page-localization.ts
- /Users/guorui/Documents/ChatGPT/New project/src/pages/supplier-management/hiui-pagegen.meta.json ← hiui-design:generated-metadata

## Required Data Shape

```json
{
  "schemaGroupDataIndexMustExistInRequestResult": true,
  "dynamicRequestRequiresExplicitMapper": true
}
```

## Coverage Decision

```json
{
  "status": "legacy-contract-without-managed-coverage",
  "pageType": "table-basic",
  "matchedManifestPath": "/Users/guorui/Documents/ChatGPT/New project/.local-context/hiui-design/docs/generation/page-types.manifest.json",
  "managedRegions": [],
  "businessSlots": [
    "title",
    "queryFields",
    "tableFields",
    "searchPlaceholder",
    "listRequest",
    "headerActions",
    "mockData"
  ],
  "coveredRegions": [],
  "uncoveredUi": [],
  "escapeHatches": [],
  "unexpectedStructures": [],
  "adjustmentHandling": "template-only",
  "stopReason": "",
  "approvedBypass": null,
  "managedByTemplate": true,
  "hasManagedCoverageContract": false,
  "evidence": [
    "baseTemplatePath:examples/host-integration/src/pages/basic-table.tsx",
    "requiredShell:TablePageFrame"
  ],
  "pageTypeId": "table-basic",
  "requiredDecisions": {
    "componentDecision": false,
    "tokenDecision": false
  }
}
```

## Pass Assessment

```json
{
  "technicalPass": {
    "status": "pass",
    "reasons": []
  },
  "businessPass": {
    "status": "fail",
    "reasons": [
      "Current page is using page-type default business semantics. Writing can continue, but the generated fields and mock data should be reviewed before delivery.",
      "placeholder business content was detected in index.tsx"
    ]
  }
}
```

## Migration Invariants

```json
null
```

## Analytics Refactor Contract

```json
null
```

## Analytics Refactor View Model

```json
null
```

## Local Adjustment Decision

```json
{
  "status": "not-requested",
  "supported": true,
  "source": "",
  "contract": null,
  "specPath": "/Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/docs/generation/page-variant-contract.json",
  "specVersion": 2,
  "validation": {
    "status": "not-requested",
    "violations": []
  }
}
```

## Local Adjustment Execution

```json
{
  "status": "not-requested",
  "mode": "not-requested",
  "transformType": "none",
  "supportedRegions": [],
  "selectedRegion": "",
  "message": "No pageAdjustmentContract was provided."
}
```

## Local Adjustment Contract

```json
null
```

## Generation Path

```json
{
  "id": "standard-template-direct-output",
  "label": "标准模板直出",
  "category": "template-direct-output",
  "reason": "The official template already covers the page shape, so generation can remain inside managed business-slot replacement."
}
```

## Host Shell Decision

```json
{
  "status": "materialize-official-formal-host-shell",
  "materializationStrategy": "thin-wrapper-over-managed-local-runtime",
  "baseHostTemplatePath": "examples/host-integration/src/app-frame-core.tsx",
  "managedHostImportSource": "local-managed-runtime/host",
  "managedHostExportName": "TypicalPageAppFrame",
  "officialHostSourceStatus": "ready",
  "officialHostSourceReason": "Official host-shell core sources are present in the hiui-design skill and can be materialized into the first formal business shell.",
  "officialHostSourceRequiredFiles": [
    "examples/host-integration/src/app-frame-core.tsx",
    "examples/host-integration/src/host-shell-localization.ts",
    "examples/host-integration/src/route-base-path.ts",
    "examples/host-integration/src/components/layout/layout-content-context.tsx",
    "examples/host-integration/src/components/layout/page-header-portal.tsx",
    "examples/host-integration/src/components/layout/typical-page-host.tsx"
  ],
  "officialHostSourceMissingFiles": [],
  "targetShellDir": "src/business-shell",
  "targetShellPath": "src/business-shell/app-frame.tsx",
  "targetRegistryPath": "src/business-shell/routes.tsx",
  "preferredExtension": ".tsx",
  "shellCertification": "missing",
  "shellCertificationEvidence": [],
  "formalShellMigration": {
    "status": "not-applicable",
    "required": false,
    "kind": "missing-formal-shell",
    "blockingMode": "none",
    "reason": "Formal shell migration guidance is not required because no existing formal shell was detected.",
    "targetShellPath": "",
    "targetCorePath": "",
    "targetHostResetPath": "",
    "preferredExtension": ".tsx",
    "referenceAppFrameCorePath": "examples/host-integration/src/app-frame-core.tsx",
    "managedHostImportSource": "local-managed-runtime/host",
    "recommendedStrategy": "",
    "recommendedSteps": [],
    "evidence": []
  },
  "migrationStatus": "not-applicable",
  "migrationRequired": false,
  "migrationKind": "missing-formal-shell",
  "migrationReason": "Formal shell migration guidance is not required because no existing formal shell was detected.",
  "migrationBlockingMode": "none",
  "migrationTargetShellPath": "",
  "migrationTargetCorePath": "",
  "migrationTargetHostResetPath": "",
  "migrationReferenceAppFrameCorePath": "examples/host-integration/src/app-frame-core.tsx",
  "migrationRecommendedSteps": [],
  "sourceAppFramePath": "examples/host-integration/src/app-frame-core.tsx",
  "mustUseThinWrapper": true,
  "mustNotPrecreateShell": true,
  "mustKeepPreviewRouteTreeIsolated": true,
  "mustKeepFormalHostShellThinWrapper": true,
  "allowedReplacements": [
    "businessRoutes data",
    "businessLandingPath",
    "businessShellOptions.brandTitle",
    "businessShellOptions.profileName",
    "businessShellOptions.profileEmail",
    "businessShellOptions.routeBasePath",
    "first generated business page import and element binding"
  ],
  "lockedRegions": [
    "LayoutContentProvider",
    "TypicalPageHostBridge",
    "headerRef / footerRef / titleTextRef",
    "Layout / Sider / SideMenu / FloatMenuContainer shell grammar",
    "styles.root / sider / siderBody / sideMenuWrapper / main / headerSlot / outlet / footerSlot"
  ],
  "forbiddenPatterns": [
    "custom left-nav reassembly",
    "rewriting the host height chain",
    "folding preview routes into formal business routes",
    "adding min-height: 100vh patches to repair formal host height",
    "adding extra overflow-y:auto wrappers around the host outlet"
  ],
  "firstPageRegistration": {
    "title": "供应商管理",
    "routePath": "suppliers",
    "targetBusinessPath": "src/pages/supplier-management"
  }
}
```

## Navigation Mount Action

```json
{
  "action": "create-formal-shell-and-mount-entry",
  "targetShellPath": "src/business-shell/app-frame.tsx",
  "targetRegistryPath": "src/business-shell/routes.tsx",
  "appEntryPath": "src/main.jsx",
  "pageRoutePath": "suppliers",
  "menuTitle": "供应商管理",
  "mustDoBeforePageCode": true,
  "reason": "Create the first managed shell and registry, then mount that registry in the real app entry before writing page code.",
  "entryMountStrategy": "replace-minimal-reactdom-entry-with-formal-business-shell-router"
}
```

## Host Import Policy

```json
{
  "contextPath": "/Users/guorui/Documents/work/git/hiui/skills/hiui-workflow/hiui-design/.context.jsonc",
  "hiui5Components": "hiui5",
  "typicalPageShells": "local-managed-runtime",
  "icons": "@hi-ui/icons",
  "allowedVisualImportSources": [
    "hiui5",
    "local-managed-runtime",
    "local-managed-runtime/pro-list-page",
    "local-managed-runtime/pro-stat-page",
    "local-managed-runtime/pro-table-page",
    "local-managed-runtime/pro-detail-page",
    "local-managed-runtime/pro-edit-page",
    "local-managed-runtime/pro-form-drawer",
    "local-managed-runtime/pro-detail-drawer",
    "local-managed-runtime/pro-tree-split-page",
    "local-managed-runtime/host",
    "@hi-ui/icons",
    "@hi-ui/schema-core"
  ],
  "templateInternalAllowedVisualImportSources": [
    "@hi-ui/query-filter"
  ],
  "forbiddenNewVisualImports": [
    "@hi-ui/hiui",
    "@hi-ui/tag",
    "@hi-ui/button",
    "@hi-ui/table",
    "@hi-ui/pagination",
    "@hi-ui/input",
    "@hi-ui/select",
    "@hi-ui/date-picker"
  ]
}
```

## Required Layout

```json
{
  "rootMustAvoidViewportHeightHack": true,
  "requiresFlexMinHeightChain": true,
  "whiteBodyMustFillRemainingHeight": true,
  "mountRegionFillPolicy": "fill-available-content-region",
  "pageRootFillOwner": "page-owned-support-file",
  "forbiddenFallbacks": [
    "min-height:100vh",
    "height:100vh",
    "extra-gray-wrapper",
    "second-white-body",
    "page-type-whitelist-host-patch"
  ],
  "pageHeaderMustBeOutsideWhiteBody": false
}
```

## Required DOM Class Contract

```json
{
  "sourceForbiddenTokens": [
    "hi-v4-",
    "--hi-v4-"
  ],
  "runtimeCompatibilityTokens": [],
  "selectorMustMatchResolvedRuntimeClass": true
}
```

## Next Required Actions

- Replace remaining business slots with real fields, requests, and copy
- Review the patched real app entry src/main.jsx and confirm it now mounts the generated formal business shell src/business-shell/app-frame.tsx and registry src/business-shell/routes.tsx.
- Keep src/business-shell/app-frame.tsx as a thin wrapper over the local managed host core src/business-shell/app-frame-core.tsx and aligned with examples/host-integration/src/app-frame-core.tsx; keep the managed host import inside that local app-frame-core, and adjust menus and default shellOptions through src/business-shell/routes.tsx instead of rewriting the host shell.
- Run npm run typical-page:preflight -- --json
- Run the smallest target-project build or type check available
