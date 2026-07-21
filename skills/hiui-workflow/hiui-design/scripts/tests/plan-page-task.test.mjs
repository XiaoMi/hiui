import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
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

function createExistingManagedPageProjectFixture({
  mode = "rules-only",
  pagePath = "src/views/orders/list/index.tsx",
  pageTypeId = "table-basic",
  pageSource = "export default function Page() { return <div /> }\n",
  workflowStatus = "contract-written",
  preflightStatus = "not-run",
  semanticContract = {},
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
    { recursive: true },
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
        semanticContract,
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
  fs.writeFileSync(path.join(targetRoot, "src", "index.ts"), "export default {}\n");
  fs.writeFileSync(
    path.join(targetRoot, "build", "webpack.base.conf.js"),
    `const { ModuleFederationPlugin } = require('webpack').container
module.exports = { plugins: [new ModuleFederationPlugin({ name: 'serviceOperations', exposes: { './Withdraw': './src/pages/withdraw' } })] }
`,
  );
  return targetRoot;
}

function writeLegacyHostBoundaryFixture(targetRoot) {
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

function writeProjectPageComponentOverlayFixture(targetRoot) {
  const componentId = "demo-project.table-basic-carrier.v1";
  const certificationRef =
    ".local-context/hiui-design/outputs/page-component-certifications/demo-project.table-basic-carrier.v1.json";
  fs.mkdirSync(
    path.join(
      targetRoot,
      ".local-context",
      "hiui-design",
      "outputs",
      "page-component-certifications",
    ),
    { recursive: true },
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
}

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
  assert.equal(plan.targetPage.managedInstanceReadiness.status, "migration-required");
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

test("plan-page-task blocks legacy list generation when the managed QueryFilter baseline asset is missing", () => {
  const targetRoot = createLegacyAutoCleanMountProjectFixture();
  writeLegacyHostBoundaryFixture(targetRoot);
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
    "--page",
    "src/pages/orders/index.tsx",
  ]);

  assert.equal(plan.status, "blocked");
  assert.equal(plan.canStartImplementation, false);
  assert.equal(plan.currentExecutionState.status, "blocked");
  assert.equal(plan.currentExecutionState.nextCommand, "bootstrap-target-project");
  assert.equal(plan.facts.managedQueryFilterBaseline.required, true);
  assert.equal(plan.facts.managedQueryFilterBaseline.status, "blocked");
  assert.match(plan.blockingReasons.join("; "), /managed QueryFilter baseline asset is missing/);
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
});
