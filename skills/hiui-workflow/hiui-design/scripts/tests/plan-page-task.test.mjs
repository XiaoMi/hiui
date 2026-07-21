import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const planScript = path.join(skillRoot, "scripts", "plan-page-task.mjs");

function runPlan(args) {
  const result = spawnSync(process.execPath, [planScript, ...args, "--json"], {
    cwd: skillRoot,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function copySkillFixture() {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "hiui-design-plan-test-"),
  );
  const target = path.join(tempRoot, "hiui-design");
  fs.cpSync(skillRoot, target, {
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}outputs${path.sep}`),
  });
  return target;
}

function writeLegacyHostBoundaryFixture(targetRoot) {
  fs.mkdirSync(
    path.join(targetRoot, ".local-context", "hiui-design", "outputs"),
    { recursive: true },
  );
  fs.writeFileSync(
    path.join(targetRoot, "package.json"),
    JSON.stringify(
      {
        dependencies: {
          react: "16.13.1",
          "react-dom": "16.13.1",
          hiui5: "npm:@hi-ui/hiui@5.0.0-canary.40",
        },
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-mode.json",
    ),
    JSON.stringify(
      { mode: "legacy-host-compatible", source: "test-fixture" },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "legacy-host-boundary.json",
    ),
    JSON.stringify(
      {
        schemaVersion: "legacy-host-boundary.v1",
        cleanContentMount: { status: "passed" },
        runtimeBridge: { status: "passed" },
        styleBoundary: { status: "passed" },
        portalBoundary: { status: "passed" },
        routeOwner: { status: "passed" },
      },
      null,
      2,
    ) + "\n",
  );
}

function writeBlockedLegacyProjectIntegrationStateFixture(
  targetRoot,
  overrides = {},
) {
  fs.mkdirSync(
    path.join(targetRoot, ".local-context", "hiui-design", "outputs"),
    { recursive: true },
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-integration-state.json",
    ),
    JSON.stringify(
      {
        schemaVersion: "hiui-project-integration-state.v1",
        status: "integrated",
        integrationReady: false,
        mode: "legacy-host-compatible",
        recommendedMode: "legacy-host-compatible",
        source: "bootstrap",
        confirmedAt: "2026-07-01T00:00:00.000Z",
        factPath:
          ".local-context/hiui-design/outputs/project-integration-state.json",
        projectModeFactPath:
          ".local-context/hiui-design/outputs/project-mode.json",
        bootstrapSummary: ".local-context/hiui-design/BOOTSTRAP_SUMMARY.md",
        hostProfile: {
          projectType: "existing-system",
          framework: "umi",
          runtime: "legacy-react",
          routing: "hash-router",
          strategy: "compat",
        },
        carrierValidation: {
          status: "not-applicable",
          registryPath:
            ".local-context/hiui-design/outputs/project-page-component-registry.json",
          checkedComponentCount: 0,
          readyComponentCount: 0,
          blockedComponentCount: 0,
          components: [],
          blockingReasons: [],
        },
        legacyBridgeValidation: {
          status: "ready",
          hostFamilyStatus: "matched",
          hostFamilyId: "test-legacy-host-family",
          adapterPackId: "legacy-host-pack",
          confidence: "high",
          missingFacts: [],
          blockingReasons: [],
        },
        legacyRuntimeReady: true,
        legacyCarrierReady: false,
        pageTypeDeliveryPolicyRef:
          ".local-context/hiui-design/outputs/page-type-delivery-policy.legacy-host-compatible.json",
        carrierFirstRequiredPageTypes: [
          "table-basic",
          "table-stat",
          "tree-table",
          "tree-split",
          "drawer-form",
          "drawer-detail",
          "full-page-edit",
          "full-page-detail",
        ],
        directStandardAllowedPageTypes: ["feedback-status"],
        requiredLegacyPageTypes: [
          "table-basic",
          "table-stat",
          "tree-table",
          "tree-split",
          "drawer-form",
          "drawer-detail",
          "full-page-edit",
          "full-page-detail",
        ],
        deferredLegacyPageTypes: ["feedback-status", "data-visualization"],
        certifiedLegacyPageTypes: ["table-basic", "table-stat"],
        missingRequiredLegacyPageTypes: [
          "tree-table",
          "tree-split",
          "drawer-form",
          "drawer-detail",
          "full-page-edit",
          "full-page-detail",
        ],
        legacyRolloutCoverageStatus: "blocked",
        legacyDeliveryPolicy: {
          status: "blocked",
          factPath:
            ".local-context/hiui-design/outputs/page-type-delivery-policy.legacy-host-compatible.json",
          carrierReady: false,
          carrierFirstRequiredPageTypes: [
            "table-basic",
            "table-stat",
            "tree-table",
            "tree-split",
            "drawer-form",
            "drawer-detail",
            "full-page-edit",
            "full-page-detail",
          ],
          directStandardAllowedPageTypes: ["feedback-status"],
          requiredLegacyPageTypes: [
            "table-basic",
            "table-stat",
            "tree-table",
            "tree-split",
            "drawer-form",
            "drawer-detail",
            "full-page-edit",
            "full-page-detail",
          ],
          deferredLegacyPageTypes: ["feedback-status", "data-visualization"],
          certifiedLegacyPageTypes: ["table-basic", "table-stat"],
          missingRequiredLegacyPageTypes: [
            "tree-table",
            "tree-split",
            "drawer-form",
            "drawer-detail",
            "full-page-edit",
            "full-page-detail",
          ],
          legacyRolloutCoverageStatus: "blocked",
          pageTypes: [],
          blockingReasons: [
            "legacy integration is incomplete because required project-certified carriers are still missing for page types: tree-table, tree-split, drawer-form, drawer-detail, full-page-edit, full-page-detail",
          ],
        },
        typicalPageSupport: {
          status: "not-applicable",
          readyPageTypeIds: [],
          blockedPageTypeIds: [],
          unsupportedPageTypeIds: [],
          pageTypes: [],
        },
        blockingReasons: [
          "legacy integration is incomplete because required project-certified carriers are still missing for page types: tree-table, tree-split, drawer-form, drawer-detail, full-page-edit, full-page-detail",
        ],
        ...overrides,
      },
      null,
      2,
    ) + "\n",
  );
}

function createLegacyAutoCleanMountProjectFixture() {
  const targetRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "hiui-design-legacy-auto-mount-"),
  );
  fs.mkdirSync(
    path.join(targetRoot, ".local-context", "hiui-design", "outputs"),
    { recursive: true },
  );
  fs.mkdirSync(path.join(targetRoot, "src", "pages"), { recursive: true });
  fs.mkdirSync(path.join(targetRoot, "build"), { recursive: true });
  fs.writeFileSync(
    path.join(targetRoot, "package.json"),
    JSON.stringify(
      {
        dependencies: {
          react: "16.13.1",
          "react-dom": "16.13.1",
          hiui5: "npm:@hi-ui/hiui@5.0.0-canary.40",
        },
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-mode.json",
    ),
    JSON.stringify(
      { mode: "legacy-host-compatible", source: "test-fixture" },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(targetRoot, "src", "index.ts"),
    "export default {}\n",
  );
  fs.writeFileSync(
    path.join(targetRoot, "build", "webpack.base.conf.js"),
    `const { ModuleFederationPlugin } = require('webpack').container
module.exports = { plugins: [new ModuleFederationPlugin({ name: 'serviceOperations', exposes: { './Withdraw': './src/pages/withdraw' } })] }
`,
  );
  return targetRoot;
}

function writeManagedQueryFilterBaselineFixture(targetRoot) {
  const baselinePath = path.join(
    targetRoot,
    "src",
    "typical-page-reuse",
    "query-filter",
    "managed-query-filter-fields.ts",
  );
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(
    baselinePath,
    `export const managedQueryFilterFields = [
  {
    key: "keyword",
    label: "关键词",
    type: "input",
  },
]
`,
  );
}

function writeProjectPageComponentOverlayFixture(
  targetRoot,
  { includeManagedQueryFilterBaseline = true } = {},
) {
  const componentId = "demo-project.table-basic-carrier.v1";
  const certificationRef =
    ".local-context/hiui-design/outputs/page-component-certifications/demo-project.table-basic-carrier.v1.json";
  if (includeManagedQueryFilterBaseline) {
    writeManagedQueryFilterBaselineFixture(targetRoot);
  }
  fs.mkdirSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "page-component-certifications",
    ),
    {
      recursive: true,
    },
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-page-component-registry.json",
    ),
    JSON.stringify(
      {
        schemaVersion: "project-page-component-registry.v1",
        components: [
          {
            componentId,
            pageTypeId: "table-basic",
            baseMoldId: "table-basic.managed-mold.v1",
            mode: "legacy-host-compatible",
            implementationKind: "page-level-component",
            status: "certified",
            certificationStatus: "certified",
            certificationRef,
            fallbackPolicy: "managed-mold",
            adapterIds: ["legacy-runtime-adapter"],
            supportedExtensionLevels: [0, 1],
            allowedExtensions: [
              {
                slotId: "topNotice",
                region: "white-body.before-query-filter",
                contentType: ["notice"],
                maxComplexity: "simple",
                forbidden: ["new-scroll-owner", "new-white-body"],
              },
            ],
            supportedModes: ["legacy-host-compatible"],
            legacyRuntimeAdapterSupport: {
              required: true,
              adapterKind: "legacy-runtime-adapter",
              defaultAdapterId: "legacy-runtime-adapter",
              supportedModes: ["legacy-host-compatible"],
              supportedExtensionLevels: [0, 1],
              requiredAdapterCapabilities: [
                "query-field-schema-binding",
                "table-column-schema-binding",
                "pagination-state-binding",
                "request-schema-binding",
                "response-schema-binding",
                "message-bridge",
                "i18n-bridge",
                "permission-bridge",
                "modal-container-binding",
                "scroll-owner-proof",
                "style-scope-proof",
              ],
              fallbackPolicy: "blocked-before-managed-fallback",
            },
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(targetRoot, certificationRef),
    JSON.stringify(
      {
        schemaVersion: "page-component-certification.v1",
        componentId,
        baseMoldId: "table-basic.managed-mold.v1",
        mode: "legacy-host-compatible",
        status: "certified",
        certificationInputs: {
          moldDigest: "test-mold-digest",
          componentDigest: "test-component-digest",
          componentShell:
            "src/page-components/ProjectTableBasicCarrier.tsx::ProjectTableBasicCarrier",
          adapterDigests: {
            "legacy-runtime-adapter": "test-adapter-digest",
          },
          runtimeProfile: {},
        },
        checks: {},
      },
      null,
      2,
    ) + "\n",
  );
  return componentId;
}

function writeUncertifiedProjectPageComponentOverlayFixture(targetRoot) {
  const componentId = "demo-project.table-basic-uncertified-carrier.v1";
  writeManagedQueryFilterBaselineFixture(targetRoot);
  fs.mkdirSync(
    path.join(targetRoot, ".local-context", "hiui-design", "outputs"),
    {
      recursive: true,
    },
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-page-component-registry.json",
    ),
    JSON.stringify(
      {
        schemaVersion: "project-page-component-registry.v1",
        components: [
          {
            componentId,
            pageTypeId: "table-basic",
            baseMoldId: "table-basic.managed-mold.v1",
            mode: "legacy-host-compatible",
            implementationKind: "page-level-component",
            status: "planned",
            certificationStatus: "pending",
            fallbackPolicy: "blocked-before-managed-fallback",
            adapterIds: ["legacy-runtime-adapter"],
            supportedExtensionLevels: [0],
            allowedExtensions: [],
            supportedModes: ["legacy-host-compatible"],
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  return componentId;
}

function createExistingManagedPageProjectFixture({
  mode = "rules-only",
  pagePath = "src/views/orders/list/index.tsx",
  pageTypeId = "table-basic",
  pageSource = "export default function Page() { return <div /> }\n",
  workflowStatus = "contract-written",
  preflightStatus = "not-run",
} = {}) {
  const targetRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "hiui-design-existing-page-"),
  );
  const contractName = pagePath.replace(/[\\/.:]+/g, "__");

  fs.mkdirSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "page-contracts",
    ),
    {
      recursive: true,
    },
  );
  fs.mkdirSync(path.join(targetRoot, path.dirname(pagePath)), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(targetRoot, "package.json"),
    JSON.stringify(
      {
        dependencies: {
          react: "16.13.1",
          "react-dom": "16.13.1",
          hiui5: "npm:@hi-ui/hiui@5.0.0-canary.40",
        },
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-mode.json",
    ),
    JSON.stringify({ mode, source: "test-fixture" }, null, 2) + "\n",
  );
  fs.writeFileSync(path.join(targetRoot, pagePath), pageSource);
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "page-contracts",
      `${contractName}.json`,
    ),
    JSON.stringify(
      {
        generatedPagePath: pagePath,
        pageTypeId,
        workflow: {
          status: workflowStatus,
          preflightStatus,
        },
      },
      null,
      2,
    ) + "\n",
  );

  return targetRoot;
}

function createUnregisteredManagedMarkerProjectFixture({
  mode = "rules-only",
  pagePath = "src/views/orders/list/index.tsx",
  pageSource = `/* hiui-design example: examples/host-integration/src/pages/basic-table.tsx */
/* hiui-design page-type: table-basic */
/* hiui-design archetype: table-basic-core */
/* hiui-design shell: TablePageFrame */
/* hiui-design host-archetype: templates/archetypes/rules-only/table-basic/page.template.tsx */
export default function OrdersPage() { return <div /> }
`,
} = {}) {
  const targetRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "hiui-design-unregistered-managed-page-"),
  );

  fs.mkdirSync(
    path.join(targetRoot, ".local-context", "hiui-design", "outputs"),
    {
      recursive: true,
    },
  );
  fs.mkdirSync(path.join(targetRoot, path.dirname(pagePath)), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(targetRoot, "package.json"),
    JSON.stringify(
      {
        dependencies: {
          react: "16.13.1",
          "react-dom": "16.13.1",
          hiui5: "npm:@hi-ui/hiui@5.0.0-canary.40",
        },
      },
      null,
      2,
    ) + "\n",
  );
  fs.writeFileSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "project-mode.json",
    ),
    JSON.stringify({ mode, source: "test-fixture" }, null, 2) + "\n",
  );
  fs.writeFileSync(path.join(targetRoot, pagePath), pageSource);

  return targetRoot;
}

function hasRequiredDoc(plan, docPath) {
  return (
    Array.isArray(plan.requiredDocs) &&
    plan.requiredDocs.some((doc) => doc?.path === docPath)
  );
}

test("plan-page-task builds an implementation-ready plan for an explicit typical page type", () => {
  const plan = runPlan([
    "--change",
    "新增一个数据看板页面",
    "--page-type",
    "table-stat",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.taskLevel.id, "new-page-or-rearchitecture");
  assert.equal(plan.schemaVersion, "page-task-plan.v1");
  assert.equal(plan.status, "ready");
  assert.equal(plan.mode.id, "rules-only");
  assert.equal(plan.contractVersion, 4);
  assert.equal(plan.topology.id, "single-typical-page");
  assert.equal(plan.pageType.id, "table-stat");
  assert.equal(plan.pageUnits.length, 1);
  assert.equal(plan.pageUnits[0].pageType.id, "table-stat");
  assert.equal(plan.canStartImplementation, true);
  assert.equal(
    plan.targetDeliverySemantics.deliveryPath,
    "page-component-plus-slot-fill",
  );
  assert.equal(plan.currentExecutionState.status, "ready");
  assert.equal(
    plan.currentExecutionState.nextCommand,
    "typical-page:select-archetype",
  );
  assert.equal(
    plan.executionDecisionSummary.targetDeliveryPath,
    "page-component-plus-slot-fill",
  );
  assert.equal(plan.fastPath.eligible, true);
  assert.equal(plan.generationStrategy.id, "page-component");
  assert.equal(plan.generationStrategy.normalizedId, "page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.implementationAction.action, "slot-fill-only");
  assert.equal(plan.governanceUpgrade.required, false);
  assert.equal(plan.generationRecipe.startingPoint, "page-component");
  assert.deepEqual(plan.generationRecipe.assemblyOrder, [
    "page header (outside white-body)",
    "white-body workspace",
    "QueryFilter",
    "table region",
    "pagination/footer",
    "empty/loading/error",
  ]);
  assert.ok(
    plan.generationRecipe.requiredAssets.includes(
      "standard-table-stat-page.v1",
    ),
  );
  assert.ok(
    plan.generationRecipe.requiredAssets.includes("table-stat.managed-mold.v1"),
  );
  assert.ok(plan.generationRecipe.forbiddenMoves.length > 0);
  assert.equal(
    plan.generationRecipe.slotFillPolicy,
    "fill only certified business slots and controlled extension regions",
  );
  assert.ok(plan.generationRecipe.regionOwnership.includes("page-header"));
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("table remains the main content owner"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("page header stays outside the white-body workspace"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("QueryFilter remains the managed search carrier"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("filter-text-input roles"),
    ),
    plan.generationRecipe.inlineChecks.join("\n"),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("shared QueryFilter surface baseline"),
    ),
    plan.generationRecipe.inlineChecks.join("\n"),
  );
  assert.equal(plan.generationProfile.schemaVersion, "generation-profile.v1");
  assert.equal(plan.generationProfile.strategy, "page-component");
  assert.equal(
    plan.generationProfile.legacyStrategyId,
    plan.generationStrategy.id,
  );
  assert.equal(
    plan.generationProfile.selectedSemanticStrategy,
    "page-component",
  );
  assert.equal(
    plan.generationProfile.selectedSemanticVariantId,
    "page-component",
  );
  assert.equal(
    plan.generationProfile.selectedDeliveryAssetKind,
    "direct-standard-component",
  );
  assert.equal(
    plan.generationProfile.selectedDeliveryAssetId,
    "standard-table-stat-page.v1",
  );
  assert.equal(plan.generationProfile.selectedDeliveryAssetStatus, "available");
  assert.equal(plan.generationProfile.mode, "rules-only");
  assert.equal(
    plan.generationProfile.pageComponentId,
    "standard-table-stat-page.v1",
  );
  assert.equal(plan.generationProfile.pageComponentStatus, "selected");
  assert.equal(
    plan.generationProfile.extensionPolicyStatus,
    "component-controlled",
  );
  assert.equal(plan.generationProfile.moldId, "table-stat.managed-mold.v1");
  assert.equal(plan.generationProfile.startFrom, "page-component");
  assert.ok(plan.generationProfile.lockedRegions.includes("shell"));
  assert.ok(plan.generationProfile.lockedRegions.includes("query-filter"));
  assert.ok(plan.generationProfile.editableSlots.includes("tableColumns"));
  assert.ok(
    plan.generationProfile.slotManifest.some(
      (slot) =>
        slot.slotId === "queryFields" && slot.contentType === "filter-controls",
    ),
  );
  assert.deepEqual(plan.generationProfile.requiredGates, [
    "slot-gate",
    "preflight",
    "page-instance-validation",
  ]);
  assert.equal(plan.generationProfile.sourceProofLevel, "slot-boundary-proof");
  assert.equal(plan.startFrom.id, "page-component");
  assert.equal(plan.primaryGenerationAsset.type, "page-component");
  assert.equal(plan.primaryGenerationAsset.id, "standard-table-stat-page.v1");
  assert.equal(plan.primaryGenerationAsset.status, "available");
  assert.equal(
    plan.primaryGenerationAsset.deliveryAssetKind,
    "direct-standard-component",
  );
  assert.equal(plan.assetResolution.semanticStrategyId, "page-component");
  assert.equal(
    plan.assetResolution.deliveryAssetKind,
    "direct-standard-component",
  );
  assert.equal(
    plan.assetResolution.deliveryAssetId,
    "standard-table-stat-page.v1",
  );
  assert.equal(plan.fallbackGenerationAsset.status, "fallback");
  assert.equal(plan.customizationLevel, "slot-fill");
  assert.equal(plan.analyticsContractRequired, false);
  assert.equal(
    plan.deliverySummaryProfile.schemaVersion,
    "delivery-summary-profile.v1",
  );
  assert.equal(plan.startFrom.templatePath, "");
  assert.equal(plan.i18nMode.id, "none");
  assert.deepEqual(plan.blockingReasons, []);
  assert.ok(hasRequiredDoc(plan, "docs/generation/hiui5-visual-baseline.md"));
  assert.ok(hasRequiredDoc(plan, "docs/generation/figma-pages/table-stat.md"));
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/figma-pages/table-shared.md"),
  );
  assert.ok(
    plan.pageTypeDocs.includes("docs/generation/figma-pages/table-stat.md"),
  );
  assert.ok(!hasRequiredDoc(plan, "docs/generation/i18n-baseline.md"));
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/rules-only-example-alignment.md"),
  );
  assert.ok(hasRequiredDoc(plan, "docs/generation/page-level-components.md"));
  assert.ok(hasRequiredDoc(plan, "docs/generation/component-certification.md"));
  assert.ok(hasRequiredDoc(plan, "docs/designer/page-component-preview.md"));
  assert.ok(plan.contractFieldsNeeded.includes("layoutStrategy"));
  assert.ok(plan.contractFieldsNeeded.includes("shellInheritanceStrategy"));
  assert.ok(plan.contractFieldsNeeded.includes("pageComponentId"));
  assert.ok(
    plan.generationInputs.requiredFacts.includes("query-field-render-profile"),
  );
  assert.ok(
    plan.generationInputs.requiredFacts.includes("filter-surface-baseline"),
  );
  assert.equal(
    plan.generationInputs.fastPathSummary.queryFieldPolicy,
    "search-input-plus-filter-text-input",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .queryFieldRenderProfile,
    "shared-query-filter-skin",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter.keywordFieldRole,
    "search-input",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter.textFieldRole,
    "filter-text-input",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .selectDateFieldSurfacePolicy,
    "shared-query-filter-surface",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .filterSurfaceBaseline,
    "query-filter-contained-shared-surface",
  );
  assert.equal(plan.pageComponent.selected, true);
  assert.equal(plan.pageComponent.componentId, "standard-table-stat-page.v1");
  assert.equal(plan.pageComponent.mode, "rules-only");
  assert.equal(plan.pageComponent.componentMode, "host-integration");
  assert.ok(plan.pageComponent.supportedModes.includes("rules-only"));
  assert.ok(
    plan.requiredCommands.some(
      (item) => item.script === "typical-page:start-page",
    ),
  );
  assert.ok(
    plan.requiredCommands.some(
      (item) => item.script === "typical-page:slot-gate",
    ),
  );
  assert.ok(
    plan.requiredActions.some(
      (item) => item.command === "typical-page:start-page",
    ),
  );
  assert.ok(
    plan.requiredActions.some(
      (item) => item.command === "typical-page:slot-gate",
    ),
  );
  assert.ok(
    plan.requiredActions.some(
      (item) => item.command === "typical-page:preview-ready",
    ),
  );
  assert.ok(
    plan.requiredActions.every(
      (item) => item.command !== "typical-page:record-usage",
    ),
  );
  assert.ok(
    plan.requiredActions.every((item) => item.id && item.phase && item.tool),
  );
  assert.equal(
    plan.requiredActions.find(
      (item) => item.command === "typical-page:start-page",
    ).args["--page-type"],
    "<page-type>",
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:finalize-page",
    ),
  );
  assert.equal(plan.acceptanceLevel, "preview");
  assert.equal(plan.acceptanceProfile.level, "preview");
  assert.equal(plan.acceptanceProfile.formalRequired, false);
  assert.ok(
    plan.acceptanceProfile.finalReportSections.includes("preflightStatus"),
  );
  assert.equal(
    plan.finalReportContract.schemaVersion,
    "final-report-contract.v1",
  );
  assert.deepEqual(plan.finalReportContract.requiredStatusFields, [
    "pageStatus",
    "preflightStatus",
  ]);
  assert.ok(
    plan.finalReportContract.requiredEvidence.includes("executedActions"),
  );
  assert.equal(plan.acceptanceReasons[0].source, "task-risk");
  assert.deepEqual(plan.formalAcceptanceActions, []);
  assert.equal(plan.deliveryLevel.id, "A");
  assert.deepEqual(plan.formalAcceptanceCommands, []);
  assert.deepEqual(plan.conditionalCommands, []);
  assert.ok(
    plan.requiredCommands.some(
      (item) => item.script === "typical-page:preview-ready",
    ),
  );
  assert.ok(
    plan.requiredCommands.every(
      (item) => item.script !== "typical-page:record-usage",
    ),
  );
});

test("plan-page-task blocks reuse-existing-contract when the current page is not a ready managed instance", () => {
  const targetRoot = createExistingManagedPageProjectFixture();
  const plan = runPlan([
    "--change",
    "重构现有普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "rules-only",
    "--target",
    targetRoot,
    "--page",
    "src/views/orders/list/index.tsx",
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.canStartImplementation, false);
  assert.equal(
    plan.targetPage.managedInstanceReadiness.status,
    "migration-required",
  );
  assert.ok(
    plan.targetPage.managedInstanceReadiness.blockerCodes.includes(
      "MANAGED_INSTANCE_SOURCE_PAGE_TYPE_MISSING",
    ),
  );
  assert.ok(
    plan.blockingIssues.some(
      (issue) => issue.code === "MANAGED_INSTANCE_MIGRATION_REQUIRED",
    ),
  );
  assert.equal(
    plan.targetDeliverySemantics.deliveryPath,
    "page-component-plus-slot-fill",
  );
  assert.equal(plan.currentExecutionState.status, "blocked");
  assert.equal(
    plan.currentExecutionState.primaryAction,
    "ResolveBlockingFacts",
  );
  assert.equal(
    plan.currentExecutionState.nextCommand,
    "resolve-managed-page-instance",
  );
  assert.equal(plan.implementationAction.action, "rewrite-by-page-component");
  assert.ok(
    plan.governanceUpgrade.reasons.includes("migration-or-rearchitecture"),
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "reuse-existing-contract",
    ),
  );
  assert.deepEqual(
    plan.requiredCommands.map((item) => item.script),
    ["resolve-managed-page-instance"],
  );
});

test("plan-page-task fails closed when project integration state reports missing required legacy carriers", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  writeLegacyHostBoundaryFixture(targetRoot);
  writeBlockedLegacyProjectIntegrationStateFixture(targetRoot);

  const plan = runPlan([
    "--change",
    "生成一个工单详情页",
    "--page-type",
    "full-page-detail",
    "--mode",
    "legacy-host-compatible",
    "--target",
    targetRoot,
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.canStartImplementation, false);
  assert.equal(plan.currentExecutionState.status, "blocked");
  assert.equal(
    plan.currentExecutionState.primaryAction,
    "ResolveBlockingFacts",
  );
  assert.equal(
    plan.currentExecutionState.nextCommand,
    "bootstrap-target-project",
  );
  assert.deepEqual(
    plan.requiredCommands.map((item) => item.script),
    ["bootstrap-target-project"],
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:start-page",
    ),
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:preflight",
    ),
  );
  assert.equal(plan.facts.projectIntegration.status, "blocked");
  assert.equal(plan.facts.projectIntegration.integrationReady, false);
  assert.equal(
    plan.facts.projectIntegration.legacyRolloutCoverageStatus,
    "blocked",
  );
  assert.deepEqual(
    plan.facts.projectIntegration.missingRequiredLegacyPageTypes,
    [
      "tree-table",
      "tree-split",
      "drawer-form",
      "drawer-detail",
      "full-page-edit",
      "full-page-detail",
    ],
  );
  assert.ok(
    plan.blockingReasons.some((reason) =>
      reason.includes(
        "project integration is incomplete: legacy integration is incomplete because required project-certified carriers are still missing",
      ),
    ),
  );
});

test("plan-page-task puts project integration recovery ahead of route fixes when both blockers exist", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  writeLegacyHostBoundaryFixture(targetRoot);
  writeBlockedLegacyProjectIntegrationStateFixture(targetRoot);

  const plan = runPlan([
    "--change",
    "生成一个普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "legacy-host-compatible",
    "--target",
    targetRoot,
    "--page",
    "src/typical-page-reuse/pages/table-basic.tsx",
  ]);

  assert.equal(plan.status, "blocked");
  assert.deepEqual(
    plan.requiredCommands.map((item) => item.script),
    ["bootstrap-target-project", "resolve-business-route-target"],
  );
  assert.equal(plan.requiredActions[0].phase, "ResolveBlockingFacts");
  assert.equal(plan.requiredActions[0].command, "bootstrap-target-project");
  assert.equal(plan.requiredActions[1].phase, "ResolveBlockingFacts");
  assert.equal(
    plan.requiredActions[1].command,
    "resolve-business-route-target",
  );
});

test("plan-page-task surfaces managed markers without contract registration as a process blocker", () => {
  const targetRoot = createUnregisteredManagedMarkerProjectFixture();
  const plan = runPlan([
    "--change",
    "重构现有普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "rules-only",
    "--target",
    targetRoot,
    "--page",
    "src/views/orders/list/index.tsx",
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.canStartImplementation, false);
  assert.equal(
    plan.targetPage.managedInstanceReadiness.status,
    "migration-required",
  );
  assert.ok(
    plan.targetPage.managedInstanceReadiness.blockerCodes.includes(
      "MANAGED_INSTANCE_CONTRACT_MISSING",
    ),
  );
  assert.match(
    plan.targetPage.managedInstanceReadiness.reason,
    /managed-page source markers but is not registered under page-contracts yet/,
  );
  assert.equal(
    plan.currentExecutionState.nextCommand,
    "register-managed-page-contract",
  );
  assert.deepEqual(
    plan.requiredCommands.map((item) => item.script),
    ["register-managed-page-contract"],
  );
  assert.ok(
    plan.blockingReasons.some((reason) =>
      reason.includes("not registered under page-contracts yet"),
    ),
    JSON.stringify(plan.blockingReasons, null, 2),
  );
});

test("plan-page-task allows reuse-existing-contract only after managed instance readiness is proven", () => {
  const targetRoot = createExistingManagedPageProjectFixture({
    pageSource: `/* hiui-design example: examples/host-integration/src/pages/basic-table.tsx */
/* hiui-design page-type: table-basic */
/* hiui-design archetype: table-basic-core */
/* hiui-design shell: TablePageFrame */
/* hiui-design host-archetype: templates/archetypes/rules-only/table-basic/page.template.tsx */
export default function Page() {
  return (
    <div
      data-hiui5-page-type="table-basic"
      data-hiui5-example="examples/host-integration/src/pages/basic-table.tsx"
      data-hiui5-archetype="table-basic-core"
      data-hiui5-shell="TablePageFrame"
    />
  )
}
`,
    workflowStatus: "preflight-pass",
    preflightStatus: "pass",
  });
  const plan = runPlan([
    "--change",
    "重构现有普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "rules-only",
    "--target",
    targetRoot,
    "--page",
    "src/views/orders/list/index.tsx",
  ]);

  assert.equal(plan.status, "ready");
  assert.equal(plan.canStartImplementation, true);
  assert.equal(plan.targetPage.managedInstanceReadiness.status, "ready");
  assert.equal(plan.currentExecutionState.status, "ready");
  assert.equal(plan.implementationAction.action, "slot-fill-only");
  assert.equal(plan.governanceUpgrade.required, false);
  assert.ok(
    plan.requiredCommands.some(
      (item) => item.script === "reuse-existing-contract",
    ),
  );
  assert.equal(
    plan.requiredCommands.find(
      (item) => item.script === "reuse-existing-contract",
    )?.args[0],
    "--page <existing-page>",
  );
});

test("plan-page-task blocks reuse-existing-contract when a managed query-filter page still binds queryFilter directly", () => {
  const targetRoot = createExistingManagedPageProjectFixture({
    mode: "rules-only",
    workflowStatus: "preflight-pass",
    preflightStatus: "pass",
    semanticContract: {
      queryFilterRegionRole: "table-query-filter",
    },
    pageSource: `/* hiui-design example: examples/host-integration/src/pages/basic-table.tsx */
/* hiui-design page-type: table-basic */
/* hiui-design archetype: table-basic-core */
/* hiui-design shell: TablePageFrame */
/* hiui-design host-archetype: templates/archetypes/rules-only/table-basic/page.template.tsx */
export default function Page() {
  const adaptedSlots = {
    businessSlots: {
      queryFilter: undefined,
    },
  };

  return (
    <TablePageFrame
      businessSlots={{
        queryFilter: adaptedSlots.businessSlots.queryFilter,
      }}
    />
  );
}
`,
  });

  const plan = runPlan([
    "--change",
    "重构现有普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "rules-only",
    "--target",
    targetRoot,
    "--page",
    "src/views/orders/list/index.tsx",
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.canStartImplementation, false);
  assert.equal(
    plan.targetPage.managedInstanceReadiness.status,
    "migration-required",
  );
  assert.ok(
    plan.targetPage.managedInstanceReadiness.blockerCodes.includes(
      "MANAGED_INSTANCE_QUERY_FILTER_SLOT_REIMPLEMENTED",
    ),
  );
  assert.equal(plan.currentExecutionState.nextCommand, "resolve-managed-page-instance");
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "reuse-existing-contract",
    ),
  );
});

test("plan-page-task keeps data visualization out of ordinary fast path", () => {
  const plan = runPlan([
    "--change",
    "新增一个经营数据可视化看板，包含趋势、构成和明细分析",
    "--page-type",
    "data-visualization",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.pageType.id, "data-visualization");
  assert.equal(plan.deliveryLevel.id, "B");
  assert.equal(plan.deliveryLevel.source, "page-type:data-visualization");
  assert.equal(plan.fastPath.eligible, false);
  assert.equal(plan.generationStrategy.id, "managed-analytics");
  assert.equal(plan.generationStrategy.normalizedId, "managed-analytics");
  assert.equal(plan.generationStrategyId, "managed-analytics");
  assert.equal(plan.generationRecipe.startingPoint, "managed-mold");
  assert.equal(plan.generationRecipe.assemblyOrder[0], "chartUsageContract");
  assert.ok(
    plan.generationRecipe.requiredAssets.includes("chartUsageContract"),
  );
  assert.ok(
    plan.generationRecipe.forbiddenMoves.some((item) =>
      item.includes("chart wall"),
    ),
  );
  assert.equal(plan.primaryGenerationAsset.type, "analytics-container");
  assert.equal(
    plan.primaryGenerationAsset.id,
    "data-visualization.managed-analytics.v1",
  );
  assert.equal(
    plan.generationProfile.runtimeCarrierPath,
    "src/shared/managed-page/fixed-dashboard-page-frame.tsx::FixedDashboardPageFrame",
  );
  assert.equal(
    plan.generationProfile.carrierRef,
    "data-visualization.managed-analytics.v1::FixedDashboardPageFrame",
  );
  assert.equal(
    plan.generationProfile.carrierCertificationRef,
    "rules/page-component-certifications/data-visualization.managed-analytics.v1.json",
  );
  assert.ok(
    plan.generationProfile.requiredRuntimeEvidence.includes(
      "shared-primitives:src/shared/managed-page/data-visualization-primitives.tsx",
    ),
  );
  assert.equal(plan.customizationLevel, "analytics-extension");
  assert.equal(plan.analyticsContractRequired, true);
  assert.equal(plan.layoutStrategy, "focus-plus-supporting-analysis");
  assert.equal(plan.layoutArchetype, "primary-secondary");
  assert.equal(plan.analyticsLayoutStrategy, "focus-plus-supporting-analysis");
  assert.equal(plan.layoutOverlayRequired, true);
  assert.equal(
    plan.visualBaselinePlan?.schemaVersion,
    "analytics-visual-baseline-plan.v1",
  );
  assert.equal(plan.visualBaselinePlan?.layoutTemplateId, "primary-secondary");
  assert.equal(
    plan.visualBaselinePlan?.colorPolicyId,
    "hiui-chart-slot-palette",
  );
  assert.equal(
    plan.visualizationRolePlan?.schemaVersion,
    "analytics-visualization-role-plan.v1",
  );
  assert.equal(
    plan.visualizationRolePlan?.layoutTemplateId,
    "primary-secondary",
  );
  assert.equal(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.schemaVersion,
    "chart-section-layout-plan.v1",
  );
  assert.equal(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.baseGridMode,
    "three-column",
  );
  assert.equal(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.consistencyScope,
    "single-mode-per-chart-section",
  );
  assert.equal(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.fullSpanNeutral,
    true,
  );
  assert.ok(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.excludedContentTypes.includes(
      "metric-card",
    ),
  );
  assert.equal(Array.isArray(plan.visualizationRolePlan?.chartRoleHints), true);
  assert.ok(
    plan.visualizationRolePlan?.chartRoleHints.some(
      (item) => item.chartType === "area" && item.canOwnPrimaryRegion === true,
    ),
  );
  assert.equal(plan.writeScope?.schemaVersion, "task-write-scope.v1");
  assert.equal(plan.writeScope?.hardBlockSharedAssetMutation, true);
  assert.ok(
    plan.writeScope?.forbiddenPaths.includes(
      "src/**/data-visualization-primitives.*",
    ),
  );
  assert.ok(plan.contractFieldsNeeded.includes("chartUsageContract"));
  assert.ok(plan.contractFieldsNeeded.includes("visualBaselinePlan"));
  assert.ok(plan.contractFieldsNeeded.includes("visualizationRolePlan"));
  assert.equal(plan.deliverySummaryProfile.id, "full");
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/figma-pages/data-visualization.md"),
  );
  assert.ok(
    plan.requiredCommands.some(
      (item) => item.script === "typical-page:start-page",
    ),
  );
  assert.ok(
    plan.requiredCommands.some(
      (item) => item.script === "typical-page:preview-ready",
    ),
  );
  assert.ok(
    plan.requiredCommands.every(
      (item) => item.script !== "typical-page:record-usage",
    ),
  );
  assert.ok(
    plan.requiredActions.every(
      (item) => item.command !== "typical-page:record-usage",
    ),
  );
  assert.ok(
    plan.requiredActions
      .find((item) => item.command === "typical-page:preview-ready")
      ?.reason.includes("chartUsageContract is ready"),
  );
  assert.equal(
    plan.generationInputs.fastPathSummary.queryFieldPolicy,
    "not-applicable",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .queryFilterRegionRole,
    "dashboard-control-strip",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .queryFieldRenderProfile,
    "not-applicable",
  );
  assert.deepEqual(plan.deliveryChecks.previewConfirmation, [
    "preview-ready-after-chart-usage-contract-ready",
  ]);
  assert.deepEqual(plan.formalAcceptanceCommands, []);
});

test("plan-page-task promotes data visualization detail QueryFilter semantics when prompt explicitly calls for table filters", () => {
  const plan = runPlan([
    "--change",
    "新增一个经营数据可视化看板，顶部保留日周月维度切换，明细表区域需要 QueryFilter 筛选和日期过滤",
    "--page-type",
    "data-visualization",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(
    plan.generationInputs.fastPathSummary.queryFieldPolicy,
    "search-input-plus-filter-text-input",
  );
  assert.ok(
    plan.generationInputs.requiredFacts.includes("query-field-render-profile"),
  );
  assert.ok(
    plan.generationInputs.requiredFacts.includes("filter-surface-baseline"),
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .queryFilterRegionRole,
    "table-query-filter",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .queryFieldRenderProfile,
    "shared-query-filter-skin",
  );
  assert.equal(
    plan.generationInputs.compiledTypicalBaseline.queryFilter
      .filterSurfaceBaseline,
    "query-filter-contained-shared-surface",
  );
});

test("plan-page-task does not infer four-column chart mode from generic business counts alone", () => {
  const plan = runPlan([
    "--change",
    "新增一个经营分析看板，覆盖四个维度的趋势、构成和明细分析",
    "--page-type",
    "data-visualization",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.baseGridMode,
    "three-column",
  );
});

test("plan-page-task infers explicit four-column chart layout declarations", () => {
  const plan = runPlan([
    "--change",
    "新增一个经营分析看板，主图表工作区采用四栏布局，展示趋势、构成、异常和归因图表",
    "--page-type",
    "data-visualization",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(
    plan.visualizationRolePlan?.chartSectionLayoutPlan?.baseGridMode,
    "four-column",
  );
});

test("plan-page-task treats formal acceptance as an overlay on typical page routing", () => {
  const plan = runPlan([
    "--change",
    "正式验收一个数据统计表页面，跑 source-gate doctor finalize",
    "--page-type",
    "table-stat",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.deliveryLevel.id, "C");
  assert.equal(plan.acceptanceLevel, "formal");
  assert.equal(plan.acceptanceProfile.level, "formal");
  assert.equal(plan.acceptanceProfile.formalRequired, true);
  assert.equal(plan.governanceUpgrade.required, true);
  assert.ok(plan.governanceUpgrade.reasons.includes("formal-acceptance"));
  assert.ok(
    plan.acceptanceProfile.defaultActions.includes("typical-page:source-gate"),
  );
  assert.ok(
    plan.acceptanceProfile.finalReportSections.includes(
      "formalAcceptanceStatus",
    ),
  );
  assert.ok(
    plan.finalReportContract.sections.includes("formalAcceptanceStatus"),
  );
  assert.deepEqual(
    plan.finalReportContract.statusFields.formalAcceptanceStatus,
    ["not_run", "passed", "failed"],
  );
  assert.ok(
    plan.finalReportContract.rules.some((rule) =>
      rule.includes("formalAcceptanceStatus as passed"),
    ),
  );
  assert.equal(plan.acceptanceReasons[0].source, "user-intent");
  assert.equal(plan.deliveryLevel.source, "formal-acceptance-overlay");
  assert.equal(plan.fastPath.eligible, true);
  assert.equal(plan.generationStrategy.id, "page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.pageComponent.selected, true);
  assert.equal(plan.pageComponent.componentId, "standard-table-stat-page.v1");
  assert.ok(
    plan.formalAcceptanceCommands.some(
      (item) => item.script === "typical-page:source-gate",
    ),
  );
  assert.ok(
    plan.formalAcceptanceCommands.some(
      (item) => item.script === "typical-page:doctor",
    ),
  );
  assert.ok(
    plan.formalAcceptanceCommands.some(
      (item) => item.script === "typical-page:finalize-page",
    ),
  );
  assert.ok(
    plan.formalAcceptanceActions.some(
      (item) => item.command === "typical-page:source-gate",
    ),
  );
  assert.ok(
    plan.formalAcceptanceActions.every((item) => item.required === true),
  );
});

test("plan-page-task escalates to full i18n docs when explicitly requested", () => {
  const plan = runPlan([
    "--change",
    "新增一个支持英文和 RTL 的数据统计表页面",
    "--page-type",
    "table-stat",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.fastPath.eligible, false);
  assert.equal(plan.i18nMode.id, "full");
  assert.ok(hasRequiredDoc(plan, "docs/generation/i18n-baseline.md"));
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/rules-only-component-matrix.md"),
  );
});

test("plan-page-task normalizes host-compatible mode alias", () => {
  const plan = runPlan([
    "--change",
    "新增一个数据统计表页面",
    "--page-type",
    "table-stat",
    "--mode",
    "host-compatible",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.mode.id, "legacy-host-compatible");
  assert.equal(plan.fastPath.eligible, true);
  assert.ok(
    plan.requiredActions.some(
      (item) => item.command === "typical-page:translation-map",
    ),
  );
  assert.ok(
    !plan.requiredActions.some(
      (item) => item.command === "typical-page:source-gate",
    ),
  );
  assert.ok(
    plan.requiredActions.some(
      (item) => item.command === "typical-page:slot-gate",
    ),
  );
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/legacy-host-compatibility.md"),
  );
  assert.ok(
    hasRequiredDoc(plan, "rules/runtime-bridged-component-matrix.json"),
  );
  assert.equal(plan.generationStrategy.id, "runtime-bridged-page-component");
  assert.equal(plan.generationProfile.mode, "legacy-host-compatible");
  assert.equal(plan.generationProfile.startFrom, "page-component");
  assert.equal(plan.generationProfile.sourceProofLevel, "slot-boundary-proof");
  assert.ok(!plan.generationProfile.requiredGates.includes("source-gate"));
  assert.ok(plan.generationProfile.requiredGates.includes("slot-gate"));
  assert.equal(plan.startFrom.id, "page-component");
  assert.equal(
    plan.runtimeBridgeProfile.profileId,
    "table-stat.runtime-bridge.v1",
  );
  assert.equal(
    plan.runtimeBridgeProfile.runtimeAssetSource.componentShell,
    "@hiui-design/typical-page-shells/pro-stat-page::StatListPageFrame",
  );
});

test("plan-page-task blocks legacy page component selection until runtime adapter facts are proven", () => {
  const plan = runPlan([
    "--change",
    "新增一个普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "legacy-host-compatible",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.pageComponent.schemaVersion, "page-component-selection.v1");
  assert.equal(plan.pageComponent.selected, false);
  assert.equal(plan.pageComponent.blockedByRuntimeAdapter, true);
  assert.equal(plan.pageComponent.source, "page-component-registry");
  assert.equal(plan.pageComponent.pageTypeId, "table-basic");
  assert.equal(plan.pageComponent.legacyHostFamily.status, "unmatched");
  assert.equal(plan.pageComponent.runtimeAdapterProof.status, "blocked");
  assert.equal(
    plan.pageComponent.runtimeAdapterProof.kind,
    "legacy-runtime-adapter",
  );
  assert.equal(
    plan.pageComponent.runtimeAdapterProof.adapterId,
    "legacy-runtime-adapter",
  );
  assert.deepEqual(plan.pageComponent.legacyHostFamily.missingFacts, [
    "clean-content-mount",
    "runtime-bridge",
  ]);
  assert.equal(
    plan.projectCapabilities.legacyHostFamily.mode,
    "legacy-host-compatible",
  );
  assert.ok(
    plan.pageComponent.candidates.some(
      (candidate) =>
        candidate.componentId === "standard-table-basic-page.v1" &&
        candidate.available === true &&
        candidate.effectiveMode === "legacy-host-compatible" &&
        candidate.legacyRuntimeAdapterSupport?.adapterKind ===
          "legacy-runtime-adapter",
    ),
  );
  assert.equal(plan.status, "blocked");
  assert.equal(plan.generationStrategy.id, "runtime-bridged-page-component");
  assert.equal(plan.generationStrategy.source, "legacy-runtime-adapter-gate");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.generationRecipe.startingPoint, "page-component");
  assert.ok(
    plan.generationRecipe.requiredAssets.includes(
      "table-basic.runtime-bridge.v1",
    ),
  );
  assert.ok(
    plan.generationRecipe.requiredAssets.includes(
      "templates/page-components/runtime-bridge/runtime-bridge-wrapper.template.tsx",
    ),
  );
  assert.equal(plan.assetResolution.status, "blocked");
  assert.equal(
    plan.assetResolution.runtimeBridgeResolution.status,
    "available",
  );
  assert.equal(plan.assetResolution.adapterResolution.status, "blocked");
  assert.equal(plan.primaryGenerationAsset.type, "page-component");
  assert.equal(plan.primaryGenerationAsset.status, "blocked");
  assert.equal(
    plan.primaryGenerationAsset.runtimeBridgeProfileId,
    "table-basic.runtime-bridge.v1",
  );
  assert.equal(plan.startFrom.id, "page-component");
  assert.equal(plan.generationProfile.startFrom, "page-component");
  assert.equal(plan.generationProfile.sourceProofLevel, "slot-boundary-proof");
  assert.ok(!plan.generationProfile.requiredGates.includes("source-gate"));
  assert.ok(plan.generationProfile.requiredGates.includes("slot-gate"));
  assert.equal(plan.generationProfile.pageComponentStatus, "not_selected");
  assert.equal(
    plan.generationProfile.runtimeBridgeProfileId,
    "table-basic.runtime-bridge.v1",
  );
  assert.equal(plan.extensionPolicy.schemaVersion, "extension-policy.v1");
  assert.equal(plan.extensionPolicy.status, "managed-mold-slots-only");
  assert.equal(plan.extensionPolicy.maxLightweightLevel, 0);
  assert.deepEqual(plan.extensionPolicy.allowedExtensions, []);
  assert.ok(hasRequiredDoc(plan, "docs/generation/page-level-components.md"));
  assert.ok(hasRequiredDoc(plan, "docs/generation/component-certification.md"));
  assert.ok(hasRequiredDoc(plan, "docs/designer/page-component-preview.md"));
  assert.ok(
    hasRequiredDoc(plan, "rules/runtime-bridged-component-matrix.json"),
  );
  assert.equal(plan.runtimeBridgeProfile.status, "available");
  assert.equal(
    plan.runtimeBridgeProfile.profileId,
    "table-basic.runtime-bridge.v1",
  );
  assert.equal(
    plan.runtimeBridgeProfile.runtimeAssetSource.componentShell,
    "@hiui-design/typical-page-shells/pro-table-page::TablePageFrame",
  );
  assert.equal(plan.kickoffSkeleton.pageComponent.selected, false);
  assert.equal(
    plan.kickoffSkeleton.runtimeBridgeProfile.profileId,
    "table-basic.runtime-bridge.v1",
  );
});

test("plan-page-task refuses certified page component status without certification artifact", () => {
  const tempSkillRoot = copySkillFixture();
  const registryPath = path.join(
    tempSkillRoot,
    "rules",
    "page-component-registry.json",
  );
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const component = registry.components.find(
    (item) => item.componentId === "legacy-table-basic-page.v1",
  );
  component.status = "certified";
  component.certificationStatus = "certified";
  delete component.certificationRef;
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n");

  const result = spawnSync(
    process.execPath,
    [
      path.join(tempSkillRoot, "scripts", "plan-page-task.mjs"),
      "--change",
      "新增一个普通表格页面",
      "--page-type",
      "table-basic",
      "--mode",
      "legacy-host-compatible",
      "--target",
      tempSkillRoot,
      "--json",
    ],
    {
      cwd: tempSkillRoot,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const plan = JSON.parse(result.stdout);

  assert.equal(plan.pageComponent.selected, false);
  assert.equal(plan.pageComponent.blockedByRuntimeAdapter, true);
  assert.equal(
    plan.pageComponent.candidates[0].componentId,
    "standard-table-basic-page.v1",
  );
  assert.equal(plan.pageComponent.candidates[0].available, true);
  assert.ok(
    plan.pageComponent.candidates.some(
      (candidate) =>
        candidate.componentId === "legacy-table-basic-page.v1" &&
        candidate.available === false,
    ),
  );
  assert.equal(plan.generationStrategy.id, "runtime-bridged-page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.generationProfile.pageComponentStatus, "not_selected");
  assert.ok(
    !plan.generationProfile.requiredGates.includes("page-instance-validation"),
  );
  assert.equal(
    plan.runtimeBridgeProfile.profileId,
    "table-basic.runtime-bridge.v1",
  );
});

test("plan-page-task auto-proves clean content mount from project structure but still blocks on runtime bridge", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  const plan = runPlan([
    "--change",
    "新增一个普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "legacy-host-compatible",
    "--target",
    targetRoot,
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.generationStrategy.id, "runtime-bridged-page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.pageComponent.blockedByRuntimeAdapter, true);
  assert.ok(
    plan.pageComponent.legacyHostFamily.matchedEvidence.includes(
      "clean-content-mount",
    ),
  );
  assert.ok(
    plan.pageComponent.legacyHostFamily.matchedEvidence.includes(
      "clean-content-mount:project-structure",
    ),
  );
  assert.deepEqual(plan.pageComponent.legacyHostFamily.missingFacts, [
    "runtime-bridge",
  ]);
  assert.equal(plan.pageComponent.runtimeAdapterProof.status, "blocked");
  assert.match(plan.pageComponent.runtimeAdapterProof.reason, /runtime bridge/);
  assert.equal(plan.runtimeBridgeProfile.status, "available");
  assert.equal(plan.assetResolution.adapterResolution.status, "blocked");
  assert.equal(
    plan.assetResolution.runtimeBridgeResolution.status,
    "available",
  );
  assert.equal(plan.primaryGenerationAsset.id, "standard-table-basic-page.v1");
});

test("plan-page-task allows standard certified page components after onboarding proves the legacy host boundary", () => {
  const tempSkillRoot = copySkillFixture();
  writeLegacyHostBoundaryFixture(tempSkillRoot);

  const result = spawnSync(
    process.execPath,
    [
      path.join(tempSkillRoot, "scripts", "plan-page-task.mjs"),
      "--change",
      "新增一个普通表格页面",
      "--page-type",
      "table-basic",
      "--mode",
      "legacy-host-compatible",
      "--target",
      tempSkillRoot,
      "--json",
    ],
    {
      cwd: tempSkillRoot,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const plan = JSON.parse(result.stdout);

  assert.equal(plan.pageComponent.selected, true);
  assert.equal(plan.pageComponent.componentId, "standard-table-basic-page.v1");
  assert.equal(
    plan.pageComponent.legacyHostFamily.hostFamilyId,
    "generic-clean-content-legacy.v1",
  );
  assert.equal(plan.pageComponent.legacyHostFamily.familyStatus, "planned");
  assert.equal(
    plan.pageComponent.certificationRef,
    "rules/page-component-certifications/standard-table-basic-page.v1.json",
  );
  assert.equal(plan.pageComponent.runtimeAdapterProof.status, "available");
  assert.equal(
    plan.pageComponent.runtimeAdapterProof.kind,
    "legacy-runtime-adapter",
  );
  assert.equal(
    plan.pageComponent.runtimeAdapterProof.responsibility,
    "runtime-bridge-only",
  );
  assert.equal(plan.pageComponent.candidates[0].available, true);
  assert.equal(plan.pageComponent.candidates[0].certificationAvailable, true);
  assert.equal(plan.generationStrategy.id, "runtime-bridged-page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.generationRecipe.startingPoint, "page-component");
  assert.ok(
    plan.generationRecipe.requiredAssets.includes(
      "table-basic.runtime-bridge.v1",
    ),
  );
  assert.equal(plan.primaryGenerationAsset.type, "page-component");
  assert.equal(plan.primaryGenerationAsset.id, "standard-table-basic-page.v1");
  assert.equal(
    plan.primaryGenerationAsset.deliveryAssetKind,
    "direct-standard-component",
  );
  assert.equal(
    plan.primaryGenerationAsset.runtimeComponentSource,
    "@hiui-design/typical-page-shells/pro-table-page::TablePageFrame",
  );
  assert.equal(plan.runtimeBridgeProfile.status, "available");
  assert.equal(
    plan.runtimeBridgeProfile.profileId,
    "table-basic.runtime-bridge.v1",
  );
  assert.equal(plan.assetResolution.adapterResolution.status, "available");
  assert.equal(
    plan.assetResolution.adapterResolution.kind,
    "legacy-runtime-adapter",
  );
  assert.equal(
    plan.assetResolution.runtimeBridgeResolution.status,
    "available",
  );
  assert.equal(
    plan.assetResolution.runtimeBridgeResolution.runtimeComponentSource,
    "@hiui-design/typical-page-shells/pro-table-page::TablePageFrame",
  );
  assert.equal(plan.customizationLevel, "slot-fill");
  assert.equal(plan.analyticsContractRequired, false);
  assert.equal(plan.startFrom.id, "page-component");
  assert.equal(plan.generationProfile.startFrom, "page-component");
  assert.equal(plan.generationProfile.sourceProofLevel, "slot-boundary-proof");
  assert.equal(
    plan.generationProfile.selectedSemanticStrategy,
    "page-component",
  );
  assert.equal(
    plan.generationProfile.selectedSemanticVariantId,
    "runtime-bridged-page-component",
  );
  assert.equal(
    plan.generationProfile.selectedDeliveryAssetKind,
    "direct-standard-component",
  );
  assert.equal(
    plan.generationProfile.selectedDeliveryAssetId,
    "standard-table-basic-page.v1",
  );
  assert.ok(!plan.generationProfile.requiredGates.includes("source-gate"));
  assert.ok(plan.generationProfile.requiredGates.includes("slot-gate"));
  assert.equal(plan.generationProfile.pageComponentStatus, "selected");
  assert.equal(
    plan.generationProfile.runtimeBridgeProfileId,
    "table-basic.runtime-bridge.v1",
  );
  assert.ok(
    plan.generationProfile.requiredGates.includes("page-instance-validation"),
  );
  assert.ok(plan.contractFieldsNeeded.includes("pageComponentId"));
  assert.ok(plan.contractFieldsNeeded.includes("pageInstanceValidationStatus"));
  assert.ok(plan.contractFieldsNeeded.includes("runtimeBridgeProfileId"));
  assert.equal(plan.extensionPolicy.status, "component-controlled");
  assert.equal(plan.extensionPolicy.maxLightweightLevel, 1);
  assert.ok(
    plan.extensionPolicy.allowedExtensions.some(
      (extension) => extension.slotId === "topNotice",
    ),
  );
});

test("plan-page-task blocks legacy list generation when the managed QueryFilter baseline asset is missing", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  writeLegacyHostBoundaryFixture(targetRoot);
  writeProjectPageComponentOverlayFixture(targetRoot, {
    includeManagedQueryFilterBaseline: false,
  });

  const plan = runPlan([
    "--change",
    "新增一个普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "legacy-host-compatible",
    "--target",
    targetRoot,
    "--page",
    "src/pages/orders/index.tsx",
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.canStartImplementation, false);
  assert.equal(plan.currentExecutionState.status, "blocked");
  assert.equal(plan.currentExecutionState.nextCommand, "bootstrap-target-project");
  assert.equal(plan.facts.managedQueryFilterBaseline.required, true);
  assert.equal(plan.facts.managedQueryFilterBaseline.status, "blocked");
  assert.match(
    plan.blockingReasons.join("; "),
    /managed QueryFilter baseline asset is missing/,
  );
  assert.ok(
    plan.requiredActions.some(
      (item) => item.command === "bootstrap-target-project",
    ),
  );
  assert.ok(
    plan.blockingIssues.some(
      (item) => item.code === "MANAGED_QUERY_FILTER_BASELINE_MISSING",
    ),
  );
  assert.ok(
    !plan.blockingIssues.some((item) => item.code === "ROUTE_OWNER_MISSING"),
  );
});

test("plan-page-task prefers project-scoped carrier overlay for legacy table-basic pages", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  writeLegacyHostBoundaryFixture(targetRoot);
  const overlayComponentId =
    writeProjectPageComponentOverlayFixture(targetRoot);

  const plan = runPlan([
    "--change",
    "新增一个普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "legacy-host-compatible",
    "--target",
    targetRoot,
  ]);

  assert.equal(plan.status, "ready");
  assert.equal(plan.generationStrategy.id, "runtime-bridged-page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.primaryGenerationAsset.type, "page-component");
  assert.equal(plan.primaryGenerationAsset.id, overlayComponentId);
  assert.equal(
    plan.primaryGenerationAsset.deliveryAssetKind,
    "project-certified-carrier",
  );
  assert.equal(plan.pageComponent.selected, true);
  assert.equal(plan.pageComponent.componentId, overlayComponentId);
  assert.equal(
    plan.pageComponent.candidates[0].componentId,
    overlayComponentId,
  );
  assert.equal(plan.pageComponent.runtimeAdapterProof.status, "available");
  assert.equal(plan.runtimeBridgeProfile.status, "available");
  assert.equal(
    plan.runtimeBridgeProfile.profileId,
    "table-basic.runtime-bridge.v1",
  );
  assert.equal(plan.runtimeBridgeProfile.matchedBy, "pageTypeId");
  assert.equal(
    plan.runtimeBridgeProfile.runtimeAssetSource.componentShell,
    "src/page-components/ProjectTableBasicCarrier.tsx::ProjectTableBasicCarrier",
  );
  assert.equal(plan.assetResolution.status, "available");
  assert.equal(plan.assetResolution.semanticStrategyId, "page-component");
  assert.equal(
    plan.assetResolution.deliveryAssetKind,
    "project-certified-carrier",
  );
  assert.equal(plan.assetResolution.deliveryAssetId, overlayComponentId);
  assert.equal(
    plan.assetResolution.runtimeBridgeResolution.status,
    "available",
  );
  assert.equal(
    plan.generationProfile.selectedDeliveryAssetKind,
    "project-certified-carrier",
  );
  assert.equal(
    plan.generationProfile.selectedDeliveryAssetId,
    overlayComponentId,
  );
});

test("plan-page-task rejects uncertified project-scoped carriers and keeps certified component routing", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  writeLegacyHostBoundaryFixture(targetRoot);
  const overlayComponentId =
    writeUncertifiedProjectPageComponentOverlayFixture(targetRoot);

  const plan = runPlan([
    "--change",
    "新增一个普通表格页面",
    "--page-type",
    "table-basic",
    "--mode",
    "legacy-host-compatible",
    "--target",
    targetRoot,
  ]);

  assert.equal(plan.status, "ready");
  assert.equal(plan.pageComponent.selected, true);
  assert.equal(plan.pageComponent.componentId, "standard-table-basic-page.v1");
  assert.equal(
    plan.pageComponent.candidates[0].componentId,
    overlayComponentId,
  );
  assert.equal(plan.pageComponent.candidates[0].projectOverlay, true);
  assert.equal(plan.pageComponent.candidates[0].available, false);
  assert.match(plan.pageComponent.reason, /project-scoped carrier/);
  assert.match(plan.pageComponent.reason, /not certified/);
  assert.equal(plan.primaryGenerationAsset.id, "standard-table-basic-page.v1");
});

test("plan-page-task treats explicit tree-split token as a baseline typical page intent", () => {
  const plan = runPlan([
    "--change",
    "生成一个 tree-split 典型页面",
    "--page-type",
    "tree-split",
    "--mode",
    "host-integration",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.status, "ready");
  assert.equal(plan.topology.id, "single-typical-page");
  assert.equal(plan.pageType.id, "tree-split");
  assert.equal(plan.generationStrategy.id, "page-component");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.pageComponent.selected, true);
  assert.equal(plan.pageComponent.componentId, "standard-tree-split-page.v1");
  assert.equal(plan.primaryGenerationAsset.type, "page-component");
  assert.equal(plan.primaryGenerationAsset.id, "standard-tree-split-page.v1");
  assert.deepEqual(plan.generationRecipe.assemblyOrder, [
    "page header (outside split workspace)",
    "split workspace carrier",
    "left tree region",
    "right QueryFilter",
    "right table/pagination",
  ]);
  assert.ok(
    plan.generationRecipe.forbiddenMoves.some((item) =>
      item.includes("SearchForm wrappers"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("page header stays outside the split workspace"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("managed search carrier"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes("filter-text-input roles"),
    ),
  );
  assert.equal(
    plan.generationInputs.fastPathSummary.queryFieldPolicy,
    "search-input-plus-filter-text-input",
  );
});

test("plan-page-task gives full-page-edit an explicit page-shell-first recipe", () => {
  const plan = runPlan([
    "--change",
    "新增一个全页编辑页面",
    "--page-type",
    "full-page-edit",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.status, "ready");
  assert.equal(plan.generationStrategy.id, "page-component");
  assert.equal(plan.generationRecipe.startingPoint, "page-component");
  assert.deepEqual(plan.generationRecipe.assemblyOrder, [
    "page header / back navigation",
    "primary form/detail body",
    "secondary information region",
    "footer actions",
  ]);
  assert.ok(
    plan.generationRecipe.forbiddenMoves.some((item) =>
      item.includes("page header, back navigation, or footer actions"),
    ),
  );
  assert.ok(
    plan.generationRecipe.inlineChecks.some((item) =>
      item.includes(
        "page header and back navigation stay outside the form/detail body",
      ),
    ),
  );
  assert.ok(plan.generationRecipe.regionOwnership.includes("page-header"));
});

test("plan-page-task blocks full generation when page type is missing", () => {
  const plan = runPlan([
    "--change",
    "新增一个审批管理页面",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.canStartImplementation, false);
  assert.equal(plan.status, "blocked");
  assert.ok(plan.blockingReasons.includes("missing pageType"));
  assert.ok(
    plan.blockingIssues.some((item) => item.code === "MISSING_PAGE_TYPE"),
  );
  assert.equal(plan.topology.id, "unresolved");
  assert.equal(plan.isNonTypical, false);
  assert.equal(
    plan.generationStrategy.id,
    "resolve-page-type-before-generation",
  );
  assert.equal(plan.generationStrategyId, "managed-fallback");
  assert.ok(!hasRequiredDoc(plan, "docs/generation/non-typical-pages.md"));
  assert.ok(hasRequiredDoc(plan, "docs/generation/hiui5-visual-baseline.md"));
});

test("plan-page-task blocks example gallery page targets before implementation", () => {
  const plan = runPlan([
    "--change",
    "生成一个数据统计表典型页",
    "--page-type",
    "table-stat",
    "--mode",
    "host-integration",
    "--target",
    skillRoot,
    "--page",
    "src/typical-page-reuse/pages/table-stat.tsx",
  ]);

  assert.equal(plan.canStartImplementation, false);
  assert.equal(plan.status, "blocked");
  assert.ok(
    plan.blockingIssues.some((item) => item.code === "ROUTE_OWNER_MISSING"),
  );
  assert.equal(
    plan.targetPage.path,
    "src/typical-page-reuse/pages/table-stat.tsx",
  );
  assert.equal(
    plan.targetPage.page,
    "src/typical-page-reuse/pages/table-stat.tsx",
  );
  assert.equal(plan.targetPage.routeOwnership.role, "example-gallery-page");
  assert.equal(
    plan.targetPage.routeOwnership.isBusinessManagedPageTarget,
    false,
  );
  assert.equal(plan.requiredCommands.length, 1);
  assert.equal(
    plan.requiredCommands[0].script,
    "resolve-business-route-target",
  );
  assert.equal(plan.requiredActions.length, 1);
  assert.equal(plan.requiredActions[0].phase, "ResolveBlockingFacts");
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:preflight",
    ),
  );
  assert.ok(
    plan.blockingReasons.some(
      (reason) =>
        reason.includes("example gallery") &&
        reason.includes("src/pages/<business-page>/index.jsx"),
    ),
  );
});

test("plan-page-task infers a single typical page without explicit page type", () => {
  const plan = runPlan([
    "--change",
    "生成一个报名管理数据统计表页面",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.topology.id, "single-typical-page");
  assert.equal(plan.pageType.id, "table-stat");
  assert.equal(plan.pageUnits.length, 1);
  assert.equal(plan.pageUnits[0].pageType.id, "table-stat");
  assert.equal(plan.fastPath.eligible, true);
  assert.equal(plan.isNonTypical, false);
  assert.equal(plan.canStartImplementation, true);
  assert.equal(plan.startFrom.id, "page-component");
  assert.ok(hasRequiredDoc(plan, "docs/generation/figma-pages/table-stat.md"));
});

test("plan-page-task uses certified page components for rules-only multi-page workflow", () => {
  const plan = runPlan([
    "--change",
    "生成一个任务管理列表页和详情页",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.topology.id, "multi-page-workflow");
  assert.deepEqual(
    plan.pageUnits.map((unit) => unit.pageType.id),
    ["table-basic", "full-page-detail"],
  );
  assert.equal(plan.pageType.source, "multi-page-request");
  assert.equal(plan.fastPath.eligible, true);
  assert.equal(
    plan.fastPath.entry,
    "run-template-copy-fast-path-per-page-unit",
  );
  assert.equal(plan.generationStrategy.id, "run-page-components-per-page-unit");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.primaryGenerationAsset.type, "page-components");
  assert.deepEqual(plan.primaryGenerationAsset.componentIds, [
    "standard-table-basic-page.v1",
    "standard-full-page-detail-page.v1",
  ]);
  assert.equal(plan.pageComponent.selected, true);
  assert.deepEqual(
    plan.pageComponent.components.map((component) => component.componentId),
    ["standard-table-basic-page.v1", "standard-full-page-detail-page.v1"],
  );
  assert.ok(
    plan.pageComponent.components.every(
      (component) => component.effectiveMode === "rules-only",
    ),
  );
  assert.equal(plan.startFrom.id, "page-units");
  assert.equal(plan.pageUnits[0].startFrom.id, "reference-or-scaffold");
  assert.equal(plan.pageUnits[1].startFrom.id, "template");
  assert.equal(plan.generationProfile.strategy, "page-component");
  assert.ok(
    plan.generationProfile.requiredGates.includes("page-instance-validation"),
  );
  assert.equal(plan.isNonTypical, false);
  assert.equal(plan.canStartImplementation, true);
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/figma-pages/table-shared.md"),
  );
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/figma-pages/detail-group.md"),
  );
  assert.ok(!hasRequiredDoc(plan, "docs/generation/non-typical-pages.md"));
});

test("plan-page-task uses certified page components for host multi-page list and detail", () => {
  const plan = runPlan([
    "--change",
    "生成物料列表和物料详情",
    "--mode",
    "host-integration",
    "--target",
    skillRoot,
    "--page",
    "src/pages/material/index.tsx",
  ]);

  assert.equal(plan.topology.id, "multi-page-workflow");
  assert.deepEqual(
    plan.pageUnits.map((unit) => unit.pageType.id),
    ["table-basic", "full-page-detail"],
  );
  assert.equal(plan.generationStrategy.id, "run-page-components-per-page-unit");
  assert.equal(plan.generationStrategyId, "page-component");
  assert.equal(plan.primaryGenerationAsset.type, "page-components");
  assert.deepEqual(plan.primaryGenerationAsset.componentIds, [
    "standard-table-basic-page.v1",
    "standard-full-page-detail-page.v1",
  ]);
  assert.equal(plan.pageComponent.selected, true);
  assert.deepEqual(
    plan.pageComponent.components.map((component) => component.componentId),
    ["standard-table-basic-page.v1", "standard-full-page-detail-page.v1"],
  );
  assert.equal(plan.generationProfile.strategy, "page-component");
  assert.ok(
    plan.generationProfile.requiredGates.includes("page-instance-validation"),
  );
  assert.equal(
    plan.requiredCommands.filter(
      (item) => item.script === "resolve-business-route-target",
    ).length,
    2,
  );
  assert.deepEqual(
    plan.requiredCommands
      .filter((item) => item.script === "resolve-business-route-target")
      .map((item) => item.args),
    [
      ["--page-unit", "browse", "--page", "<browse-page>"],
      ["--page-unit", "inspect", "--page", "<inspect-page>"],
    ],
  );
  assert.equal(
    plan.requiredCommands.filter(
      (item) => item.script === "typical-page:start-page",
    ).length,
    2,
  );
  assert.equal(
    plan.requiredCommands.filter(
      (item) => item.script === "typical-page:preflight",
    ).length,
    2,
  );
  assert.ok(
    !plan.requiredCommands.some((item) =>
      item.args.includes("--page <existing-page>"),
    ),
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "reuse-existing-contract",
    ),
  );
  assert.equal(
    plan.requiredCommands.find(
      (item) => item.script === "typical-page:preview-ready",
    )?.args[0],
    "--page <page-unit-targets>",
  );
  assert.equal(
    plan.requiredActions.filter((item) => item.phase === "ResolveBlockingFacts")
      .length,
    2,
  );
});

test("plan-page-task keeps same-screen multi-intent layouts out of non-typical fallback", () => {
  const plan = runPlan([
    "--change",
    "生成一个页面，左侧是任务列表，右侧展示任务详情",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.topology.id, "single-page-composite");
  assert.deepEqual(
    plan.pageUnits.map((unit) => unit.pageType.id),
    ["table-basic", "full-page-detail"],
  );
  assert.equal(plan.isNonTypical, false);
  assert.equal(plan.implementationAction.action, "structural-upgrade");
  assert.equal(plan.layoutOverlayRequired, true);
  assert.equal(plan.canStartImplementation, false);
  assert.ok(
    plan.blockingReasons.some((reason) => reason.includes("composite layout")),
  );
  assert.ok(
    hasRequiredDoc(
      plan,
      "docs/generation/implementation-checklist-template.md",
    ),
  );
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/figma-pages/table-shared.md"),
  );
  assert.ok(
    hasRequiredDoc(plan, "docs/generation/figma-pages/detail-group.md"),
  );
  assert.ok(!hasRequiredDoc(plan, "docs/generation/non-typical-pages.md"));
  assert.deepEqual(
    plan.requiredCommands.map((item) => item.script),
    ["typical-page:select-archetype", "typical-page:write-contract"],
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:start-page",
    ),
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:preflight",
    ),
  );
  assert.ok(
    !plan.requiredCommands.some((item) => item.script === "npm run build"),
  );
  assert.ok(
    !plan.requiredCommands.some(
      (item) => item.script === "typical-page:preview-ready",
    ),
  );
  assert.deepEqual(plan.formalAcceptanceCommands, []);
  assert.deepEqual(plan.conditionalCommands, []);
});

test("plan-page-task keeps minor edits lightweight", () => {
  const plan = runPlan([
    "--change",
    "修改表格页按钮文案",
    "--page-type",
    "table-basic",
    "--mode",
    "rules-only",
    "--target",
    skillRoot,
  ]);

  assert.equal(plan.taskLevel.id, "minor-edit");
  assert.equal(
    plan.generationStrategy.id,
    "reuse-existing-contract-for-minor-edit",
  );
  assert.equal(plan.generationStrategyId, "controlled-extension");
  assert.equal(plan.customizationLevel, "controlled-extension");
  assert.deepEqual(plan.contractFieldsNeeded, ["reuseExistingContract"]);
  assert.equal(plan.runtimeSmokePlan.required, false);
  assert.equal(plan.requiredCommands.length, 1);
  assert.equal(plan.requiredCommands[0].script, "reuse-existing-contract");
  assert.deepEqual(plan.formalAcceptanceCommands, []);
  assert.deepEqual(plan.conditionalCommands, []);
  assert.ok(
    !hasRequiredDoc(plan, "docs/generation/rules-only-component-matrix.md"),
  );
});

test("plan-page-task does not enter i18n flow just because project has i18n runtime", () => {
  const tempSkillRoot = copySkillFixture();
  fs.writeFileSync(
    path.join(tempSkillRoot, "package.json"),
    JSON.stringify({ dependencies: { i18next: "^23.0.0" } }, null, 2) + "\n",
  );

  const result = spawnSync(
    process.execPath,
    [
      path.join(tempSkillRoot, "scripts", "plan-page-task.mjs"),
      "--change",
      "新增一个普通表格页面",
      "--page-type",
      "table-basic",
      "--mode",
      "rules-only",
      "--target",
      tempSkillRoot,
      "--json",
    ],
    {
      cwd: tempSkillRoot,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const plan = JSON.parse(result.stdout);

  assert.equal(plan.i18nMode.id, "none");
  assert.equal(
    plan.i18nMode.source,
    "detected-project-i18n-runtime-without-explicit-request",
  );
  assert.ok(!hasRequiredDoc(plan, "docs/generation/i18n-baseline.md"));
});
