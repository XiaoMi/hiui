#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import {
  loadRulesOnlyPageContracts,
  normalizeContractPath,
} from "./lib/rules-only-page-contracts.mjs";

const DEFAULT_STATUS_FIELDS = {
  pageStatus: ["not_started", "generated", "modified", "blocked", "failed"],
  preflightStatus: ["not_run", "passed", "failed", "invalid"],
  formalAcceptanceStatus: ["not_requested", "not_run", "passed", "failed"],
};

const DESIGN_REGION_LABELS = {
  shell: "页面壳",
  header: "页头",
  "white-body": "白底主体",
  "stat-section": "指标区",
  "query-filter": "查询区",
  table: "数据表格",
  pagination: "分页区",
  "main-scroll": "主滚动容器",
  "drawer-shell": "抽屉壳",
  "drawer-header": "抽屉页头",
  "drawer-body": "抽屉主体",
  "drawer-footer": "抽屉底部操作区",
  footer: "底部操作区",
};

const STRUCTURE_REGIONS = [
  "header",
  "stat-section",
  "query-filter",
  "table",
  "pagination",
  "drawer-header",
  "drawer-body",
  "drawer-footer",
  "footer",
];

function labelRegion(regionId) {
  return DESIGN_REGION_LABELS[regionId] || regionId;
}

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/render-final-report.mjs" \
    --plan <page-task-plan.json> \
    [--preflight <preflight-report.json>] \
    [--usage <preview-ready-report.json>] \
    [--page-status <not_started|generated|modified|blocked|failed>] \
    [--formal-status <not_requested|not_run|passed|failed>] \
    [--changed-files <comma-separated-paths>] \
    [--validation-command <command=passed|failed>] \
    [--executed-action <action-id>] \
    [--target <project-root>] \
    [--json] \
    [--contract-fixture <quality-pass>]

Default behavior:
  - reads finalReportContract.v1 from page-task-plan.v1
  - combines plan, preflight, usage, changed files, validation commands, and executed actions
  - emits final-page-report.v1 JSON for the final user-facing reply
`);
}

function parseArgs(argv) {
  const options = {
    changedFiles: [],
    contractFixture: "",
    executedActions: [],
    formalStatus: "",
    json: false,
    pageStatus: "",
    plan: "",
    preflight: "",
    target: process.cwd(),
    usage: "",
    validationCommands: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (
      arg === "--changed-files" ||
      arg === "--contract-fixture" ||
      arg === "--executed-action" ||
      arg === "--formal-status" ||
      arg === "--page-status" ||
      arg === "--plan" ||
      arg === "--preflight" ||
      arg === "--target" ||
      arg === "--usage" ||
      arg === "--validation-command"
    ) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }

      if (arg === "--changed-files") {
        options.changedFiles.push(
          ...value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        );
      }
      if (arg === "--contract-fixture") options.contractFixture = value;
      if (arg === "--executed-action") options.executedActions.push(value);
      if (arg === "--formal-status") options.formalStatus = value;
      if (arg === "--page-status") options.pageStatus = value;
      if (arg === "--plan") options.plan = value;
      if (arg === "--preflight") options.preflight = value;
      if (arg === "--target") options.target = path.resolve(value);
      if (arg === "--usage") options.usage = value;
      if (arg === "--validation-command")
        options.validationCommands.push(parseValidationCommand(value));
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (
    options.contractFixture &&
    !["quality-pass"].includes(options.contractFixture)
  ) {
    throw new Error("Expected --contract-fixture to be one of: quality-pass");
  }

  if (!options.contractFixture && !options.plan) {
    throw new Error("Missing --plan");
  }

  return options;
}

function parseValidationCommand(rawValue) {
  const [command, status = "passed"] = String(rawValue).split("=");
  const normalizedCommand = String(command || "").trim();
  const normalizedStatus = String(status || "").trim();
  if (!normalizedCommand) {
    throw new Error("Expected --validation-command to include a command");
  }
  if (!["passed", "failed", "skipped"].includes(normalizedStatus)) {
    throw new Error(
      "Expected validation command status to be one of: passed, failed, skipped",
    );
  }
  return { command: normalizedCommand, status: normalizedStatus };
}

async function readJsonFile(targetRoot, filePath) {
  if (!filePath) return null;
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(targetRoot, filePath);
  return JSON.parse(await fs.readFile(absolutePath, "utf8"));
}

function normalizePagePathCandidate(targetRoot, value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  return normalizeContractPath(targetRoot, rawValue);
}

async function resolveManagedContractForFinalReport(
  targetRoot,
  plan,
  preflight,
) {
  const pageCandidates = [
    normalizePagePathCandidate(targetRoot, preflight?.page),
    normalizePagePathCandidate(targetRoot, plan?.targetPage?.path),
  ].filter(Boolean);

  if (pageCandidates.length === 0) {
    return null;
  }

  const { contracts } = await loadRulesOnlyPageContracts(targetRoot);

  for (const candidate of pageCandidates) {
    const match = contracts.find((entry) => {
      if (!entry?.contract) return false;
      return (
        normalizePagePathCandidate(
          targetRoot,
          entry.contract.generatedPagePath,
        ) === candidate
      );
    });

    if (match?.contract) {
      return match.contract;
    }
  }

  return null;
}

function buildContractFixtureInputs() {
  const plan = {
    schemaVersion: "page-task-plan.v1",
    status: "ready",
    pageType: { id: "table-stat", label: "数据统计表" },
    targetPage: { path: "src/pages/orders/index.tsx", exists: false },
    acceptanceLevel: "formal",
    generationProfile: {
      schemaVersion: "generation-profile.v1",
      moldId: "table-stat.managed-mold.v1",
      lockedRegions: [
        "shell",
        "header",
        "white-body",
        "stat-section",
        "query-filter",
        "table",
        "pagination",
        "main-scroll",
      ],
      editableSlots: [
        "pageTitle",
        "headerExtra",
        "queryFields",
        "statItems",
        "tableColumns",
        "rowActions",
        "mockData",
        "apiBinding",
      ],
      slotManifest: [
        { slotId: "pageTitle", label: "页面标题" },
        { slotId: "headerExtra", label: "页头右侧操作/信息" },
        { slotId: "queryFields", label: "筛选字段" },
        { slotId: "statItems", label: "指标卡" },
        { slotId: "tableColumns", label: "表格列" },
        { slotId: "rowActions", label: "行操作" },
        { slotId: "mockData", label: "示例数据" },
        { slotId: "apiBinding", label: "接口绑定" },
      ],
    },
    finalReportContract: {
      schemaVersion: "final-report-contract.v1",
      sections: ["pageStatus", "preflightStatus", "formalAcceptanceStatus"],
      requiredStatusFields: [
        "pageStatus",
        "preflightStatus",
        "formalAcceptanceStatus",
      ],
      statusFields: {
        pageStatus: [
          "not_started",
          "generated",
          "modified",
          "blocked",
          "failed",
        ],
        preflightStatus: ["not_run", "passed", "failed", "invalid"],
        formalAcceptanceStatus: ["not_run", "passed", "failed"],
      },
      requiredEvidence: [
        "executedActions",
        "changedFiles",
        "validationCommands",
      ],
      riskFields: ["blockingIssues", "warnings", "nextActions"],
      rules: [
        "Do not report formalAcceptanceStatus as passed unless formalAcceptanceActions were executed successfully.",
        "Do not hide preflight warnings or blockingIssues.",
      ],
    },
  };

  const preflight = {
    schemaVersion: "preflight-report.v1",
    status: "passed",
    page: "src/pages/orders/index.tsx",
    pageType: "table-stat",
    generationProfile: {
      schemaVersion: "generation-profile.v1",
      moldId: "table-stat.managed-mold.v1",
      startFrom: "template",
      requiredGates: ["slot-gate", "preflight"],
      sourceProofLevel: "slot-boundary-proof",
    },
    productionContract: {
      schemaVersion: "page-production-contract.v1",
      policy: "generate-from-managed-mold-and-fill-business-slots-only",
      moldId: "table-stat.managed-mold.v1",
      startFrom: "template",
      requiredGates: ["slot-gate", "preflight"],
      sourceProofLevel: "slot-boundary-proof",
    },
    checks: [
      {
        id: "preflightBaseline",
        status: "passed",
        severity: "info",
        message: "managed page preflight completed without blocking failures",
        suggestedActionIds: [],
      },
    ],
    blockingReasons: [],
    blockingIssues: [],
    suggestedActions: [],
    warnings: [],
  };

  return {
    changedFiles: [
      "src/pages/orders/index.tsx",
      ".local-context/hiui-design/contracts/src-pages-orders-index.json",
    ],
    executedActions: [
      "start-page-table-stat",
      "preflight-table-stat",
      "formal-source-gate",
      "formal-doctor",
      "formal-finalize-page",
      "preview-ready",
    ],
    formalStatus: "passed",
    pageStatus: "generated",
    plan,
    preflight,
    validationCommands: [
      {
        command:
          "npm run typical-page:preflight -- --page src/pages/orders/index.tsx --json",
        status: "passed",
      },
      {
        command:
          "npm run typical-page:source-gate -- --page src/pages/orders/index.tsx",
        status: "passed",
      },
      {
        command:
          "npm run typical-page:preview-ready -- --page src/pages/orders/index.tsx",
        status: "passed",
      },
    ],
  };
}

function normalizeStatus(value, fallback) {
  return String(value || fallback || "").trim();
}

function fallbackFinalReportContract(plan) {
  const formalRequired = plan?.acceptanceProfile?.formalRequired === true;
  const sections = Array.isArray(plan?.acceptanceProfile?.finalReportSections)
    ? plan.acceptanceProfile.finalReportSections
    : formalRequired
      ? ["pageStatus", "preflightStatus", "formalAcceptanceStatus"]
      : ["pageStatus", "preflightStatus"];

  return {
    schemaVersion: "final-report-contract.v1",
    sections,
    requiredStatusFields: sections.filter((section) =>
      Object.hasOwn(DEFAULT_STATUS_FIELDS, section),
    ),
    statusFields: Object.fromEntries(
      sections
        .filter((section) => Object.hasOwn(DEFAULT_STATUS_FIELDS, section))
        .map((section) => [section, DEFAULT_STATUS_FIELDS[section]]),
    ),
    requiredEvidence: ["executedActions", "changedFiles", "validationCommands"],
    riskFields: ["blockingIssues", "warnings", "nextActions"],
    rules: [],
  };
}

function assertAllowedStatus(contract, field, value) {
  const allowed = contract.statusFields?.[field];
  if (!Array.isArray(allowed) || allowed.length === 0) return;
  if (!allowed.includes(value)) {
    throw new Error(`${field}=${value} is not allowed by finalReportContract`);
  }
}

function normalizeDeferredChecks(value) {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.map((item) => String(item || "").trim()).filter(Boolean),
        ),
      ]
    : [];
}

function inferManagedWorkflowPreflightExecution(managedContract) {
  const workflow = managedContract?.workflow || {};
  const workflowStatus = String(workflow.status || "").trim();
  const preflightStatus = String(workflow.preflightStatus || "").trim();
  const deferredChecks = normalizeDeferredChecks(workflow.deferredChecks);
  const inferredStage =
    String(workflow.preflightStage || "").trim() ||
    (workflowStatus === "started" && preflightStatus === "pass"
      ? "scaffold-baseline"
      : workflowStatus === "stale" ||
          workflowStatus === "preflight-pass" ||
          workflowStatus === "finalized"
        ? "implementation"
        : "");

  return {
    preflightStage: inferredStage,
    readyForImplementation:
      typeof workflow.readyForImplementation === "boolean"
        ? workflow.readyForImplementation
        : Boolean(inferredStage),
    readyForDelivery:
      typeof workflow.readyForDelivery === "boolean"
        ? workflow.readyForDelivery
        : workflowStatus === "finalized" || workflowStatus === "preflight-pass",
    deferredChecks:
      deferredChecks.length > 0
        ? deferredChecks
        : workflowStatus === "stale"
          ? ["finalizePage"]
          : inferredStage === "scaffold-baseline"
            ? ["placeholderMappings"]
            : [],
  };
}

function resolvePreflightExecution(preflight, managedContract) {
  const managedWorkflow =
    inferManagedWorkflowPreflightExecution(managedContract);
  if (!preflight) {
    return managedWorkflow;
  }

  const preflightDeferredChecks = normalizeDeferredChecks(
    preflight.deferredChecks,
  );
  const preflightPassed = String(preflight.status || "").trim() === "passed";
  return {
    preflightStage:
      String(preflight.preflightStage || "").trim() ||
      managedWorkflow.preflightStage ||
      (preflightPassed ? "implementation" : ""),
    readyForImplementation:
      typeof preflight.readyForImplementation === "boolean"
        ? preflight.readyForImplementation
        : managedWorkflow.readyForImplementation || preflightPassed,
    readyForDelivery:
      typeof preflight.readyForDelivery === "boolean"
        ? preflight.readyForDelivery
        : managedWorkflow.readyForDelivery ||
          (preflightPassed && preflightDeferredChecks.length === 0),
    deferredChecks:
      preflightDeferredChecks.length > 0
        ? preflightDeferredChecks
        : managedWorkflow.deferredChecks,
  };
}

function deferredCheckMessages(deferredChecks) {
  return normalizeDeferredChecks(deferredChecks).map((checkId) => {
    if (checkId === "placeholderMappings") {
      return {
        warning:
          "Preflight passed only at scaffold-baseline stage; placeholder mappings still need implementation before delivery.",
        nextAction:
          "Replace scaffold placeholder mappings and rerun typical-page:preflight before treating the page as delivery-ready.",
      };
    }
    if (checkId === "finalizePage") {
      return {
        warning:
          "Current workflow still requires finalize-page on the latest source snapshot before delivery can be declared complete.",
        nextAction:
          "Rerun typical-page:finalize-page on the latest page source snapshot before delivery.",
      };
    }
    return {
      warning: `Preflight deferred check "${checkId}" is still pending before delivery.`,
      nextAction: `Resolve deferred check "${checkId}" and rerun the required validation.`,
    };
  });
}

function collectWarnings(preflight, managedContract, preflightExecution) {
  const warnings = [];
  if (Array.isArray(preflight?.warnings)) warnings.push(...preflight.warnings);
  if (Array.isArray(preflight?.checks)) {
    warnings.push(
      ...preflight.checks
        .filter((check) => check?.status === "warning")
        .map((check) => check.message || check.id)
        .filter(Boolean),
    );
  }
  if (String(managedContract?.workflow?.status || "").trim() === "stale") {
    warnings.push(
      String(managedContract?.workflow?.staleReason || "").trim() ||
        "Managed page contract is stale for the current source snapshot.",
    );
  }
  if (
    preflightExecution.preflightStage === "scaffold-baseline" &&
    !preflightExecution.readyForDelivery
  ) {
    warnings.push(
      ...deferredCheckMessages(preflightExecution.deferredChecks).map(
        (item) => item.warning,
      ),
    );
  }
  return warnings;
}

function nextActionsForStatuses({
  managedContract,
  preflightStatus,
  formalAcceptanceStatus,
  pageStatus,
  preflight,
  preflightExecution,
}) {
  const actions = [];
  if (pageStatus === "blocked") {
    actions.push(
      "Resolve plan blockingIssues and rerun typical-page:plan-page-task before implementation.",
    );
  }
  if (String(managedContract?.workflow?.status || "").trim() === "stale") {
    actions.push(
      String(managedContract?.workflow?.staleReason || "").trim() ||
        "Page source changed after the last finalize-page result. Rerun preflight and finalize-page on the latest source snapshot.",
    );
  }
  if (preflightStatus === "failed") {
    const suggested = Array.isArray(preflight?.suggestedActions)
      ? preflight.suggestedActions
      : [];
    if (suggested.length > 0) {
      actions.push(
        ...suggested
          .map((item) => {
            if (item.displayCommand) return item.displayCommand;
            if (item.command && item.args && typeof item.args === "object") {
              const args = Object.entries(item.args)
                .map(([key, value]) =>
                  value === true ? key : `${key} ${value}`,
                )
                .join(" ");
              return [item.command, args].filter(Boolean).join(" ");
            }
            return item.command || item.id;
          })
          .filter(Boolean),
      );
    } else {
      actions.push(
        "Fix preflight blockingIssues and rerun typical-page:preflight.",
      );
    }
  } else if (
    !preflightExecution.readyForDelivery &&
    preflightExecution.deferredChecks.length > 0
  ) {
    actions.push(
      ...deferredCheckMessages(preflightExecution.deferredChecks).map(
        (item) => item.nextAction,
      ),
    );
  }
  if (formalAcceptanceStatus === "failed") {
    actions.push(
      "Fix formal acceptance failures and rerun formalAcceptanceActions.",
    );
  }
  return [...new Set(actions)];
}

function buildProductionLineSummary(preflight, managedContract) {
  const productionContract =
    preflight?.productionContract ||
    managedContract?.productionContract ||
    null;
  const generationProfile =
    preflight?.generationProfile || managedContract?.generationProfile || null;
  const blockingIssues = Array.isArray(preflight?.blockingIssues)
    ? preflight.blockingIssues
    : [];
  const productionBlockingIssues = blockingIssues.filter((issue) =>
    ["generationProfile", "productionContract"].includes(issue?.checkId),
  );
  const workflowStatus = String(managedContract?.workflow?.status || "").trim();
  const preflightExecution = resolvePreflightExecution(
    preflight,
    managedContract,
  );

  if (!preflight && !managedContract) {
    return {
      status: "not_run",
      policy: "",
      moldId: "",
      startFrom: "",
      requiredGates: [],
      sourceProofLevel: "",
      blockingIssues: [],
    };
  }

  return {
    status:
      productionBlockingIssues.length > 0
        ? "failed"
        : !preflight && workflowStatus === "stale"
          ? "stale"
          : productionContract && generationProfile
            ? ((preflight?.status === "passed" ||
                String(
                  managedContract?.workflow?.preflightStatus || "",
                ).trim() === "pass") &&
                preflightExecution.readyForDelivery) ||
              workflowStatus === "finalized"
              ? "passed"
              : "declared"
            : "not_declared",
    policy: productionContract?.policy || "",
    moldId: productionContract?.moldId || generationProfile?.moldId || "",
    startFrom:
      productionContract?.startFrom || generationProfile?.startFrom || "",
    requiredGates: Array.isArray(productionContract?.requiredGates)
      ? productionContract.requiredGates
      : Array.isArray(generationProfile?.requiredGates)
        ? generationProfile.requiredGates
        : [],
    sourceProofLevel:
      productionContract?.sourceProofLevel ||
      generationProfile?.sourceProofLevel ||
      "",
    preflightExecution,
    blockingIssues: productionBlockingIssues,
  };
}

function buildDesignerSummary({
  blockingIssues,
  managedContract,
  plan,
  preflight,
  productionLine,
  statuses,
  warnings,
}) {
  const generationProfile =
    plan?.generationProfile ||
    preflight?.generationProfile ||
    managedContract?.generationProfile ||
    null;
  const lockedRegions = Array.isArray(generationProfile?.lockedRegions)
    ? generationProfile.lockedRegions
    : [];
  const slotManifest = Array.isArray(generationProfile?.slotManifest)
    ? generationProfile.slotManifest
    : [];
  const editableSlots = Array.isArray(generationProfile?.editableSlots)
    ? generationProfile.editableSlots
    : [];
  const structure = STRUCTURE_REGIONS.filter((region) =>
    lockedRegions.includes(region),
  ).map(labelRegion);
  const editableAreas =
    slotManifest.length > 0
      ? slotManifest.map((slot) => slot.label || slot.slotId).filter(Boolean)
      : editableSlots;

  return {
    schemaVersion: "designer-summary.v1",
    optional: true,
    pageType:
      plan?.pageType?.label ||
      plan?.pageType?.id ||
      preflight?.pageType ||
      managedContract?.pageTypeLabel ||
      managedContract?.pageTypeId ||
      "",
    mold: productionLine.moldId || generationProfile?.moldId || "",
    structure,
    editableAreas,
    lockedAreas: lockedRegions.map(labelRegion),
    keyInteractions: [],
    acceptance: {
      pageStatus: statuses.pageStatus,
      preflightStatus: statuses.preflightStatus,
      formalAcceptanceStatus:
        statuses.formalAcceptanceStatus || "not_requested",
    },
    remainingDesignRisks: [...blockingIssues, ...warnings],
    questionsForDesigner:
      blockingIssues.length > 0
        ? ["请先确认阻断项处理方案，再判断页面设计是否可交付。"]
        : [],
  };
}

function resolvePreflightStatus(preflight, managedContract) {
  if (preflight) {
    return normalizeStatus(
      preflight?.status === "passed" ? "passed" : preflight?.status,
      "not_run",
    );
  }

  const workflowStatus = String(managedContract?.workflow?.status || "").trim();
  if (workflowStatus === "stale") {
    return "not_run";
  }

  const workflowPreflightStatus = String(
    managedContract?.workflow?.preflightStatus || "",
  ).trim();
  if (workflowPreflightStatus === "pass") return "passed";
  if (workflowPreflightStatus === "fail") return "failed";
  return "not_run";
}

function resolvePageStatus(pageStatus, plan, managedContract) {
  const explicitPageStatus = normalizeStatus(pageStatus, "");
  if (explicitPageStatus) {
    return explicitPageStatus;
  }

  if (plan.status === "blocked") {
    return "blocked";
  }

  const workflowStatus = String(managedContract?.workflow?.status || "").trim();
  const sourceSnapshotHash = String(
    managedContract?.workflow?.sourceSnapshotHash || "",
  ).trim();
  if (workflowStatus === "stale") {
    return "modified";
  }
  if (
    sourceSnapshotHash &&
    ["contract-written", "started", "preflight-pass", "finalized"].includes(
      workflowStatus,
    )
  ) {
    return "generated";
  }

  return "not_started";
}

function resolveFormalAcceptanceStatus(
  formalStatus,
  contract,
  managedContract,
) {
  if (!contract.sections.includes("formalAcceptanceStatus")) {
    return "not_requested";
  }

  const explicitFormalStatus = normalizeStatus(formalStatus, "");
  if (explicitFormalStatus) {
    return explicitFormalStatus;
  }

  return String(managedContract?.workflow?.status || "").trim() === "finalized"
    ? "passed"
    : "not_run";
}

function renderFinalReport({
  changedFiles,
  executedActions,
  formalStatus,
  managedContract,
  pageStatus,
  plan,
  preflight,
  validationCommands,
}) {
  const contract =
    plan.finalReportContract || fallbackFinalReportContract(plan);
  const preflightStatus = resolvePreflightStatus(preflight, managedContract);
  const formalAcceptanceStatus = resolveFormalAcceptanceStatus(
    formalStatus,
    contract,
    managedContract,
  );
  const normalizedPageStatus = resolvePageStatus(
    pageStatus,
    plan,
    managedContract,
  );
  const preflightExecution = resolvePreflightExecution(
    preflight,
    managedContract,
  );

  const statuses = {
    pageStatus: normalizedPageStatus,
    preflightStatus,
  };
  if (contract.sections.includes("formalAcceptanceStatus")) {
    statuses.formalAcceptanceStatus = formalAcceptanceStatus;
  }

  for (const field of contract.requiredStatusFields || []) {
    if (!Object.hasOwn(statuses, field)) {
      throw new Error(`Missing required final report status field: ${field}`);
    }
    assertAllowedStatus(contract, field, statuses[field]);
  }

  const blockingIssues = [
    ...(Array.isArray(plan?.blockingIssues) ? plan.blockingIssues : []),
    ...(Array.isArray(preflight?.blockingIssues)
      ? preflight.blockingIssues
      : []),
  ];
  const warnings = collectWarnings(
    preflight,
    managedContract,
    preflightExecution,
  );
  const nextActions = nextActionsForStatuses({
    formalAcceptanceStatus,
    managedContract,
    pageStatus: normalizedPageStatus,
    preflight,
    preflightStatus,
    preflightExecution,
  });
  const productionLine = buildProductionLineSummary(preflight, managedContract);
  const designerSummary = buildDesignerSummary({
    blockingIssues,
    managedContract,
    plan,
    preflight,
    productionLine,
    statuses,
    warnings,
  });

  return {
    schemaVersion: "final-page-report.v1",
    contractSchemaVersion: contract.schemaVersion || "final-report-contract.v1",
    sections: contract.sections,
    statuses,
    preflightExecution,
    productionLine,
    designerSummary,
    evidence: {
      executedActions,
      changedFiles,
      validationCommands,
    },
    risks: {
      blockingIssues,
      warnings,
      nextActions,
    },
    source: {
      planSchemaVersion: plan.schemaVersion || "",
      preflightSchemaVersion: preflight?.schemaVersion || "",
      preflightStage: preflightExecution.preflightStage,
    },
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const targetRoot = path.resolve(options.target);
    const inputs = options.contractFixture
      ? buildContractFixtureInputs()
      : await (async () => {
          const plan = await readJsonFile(targetRoot, options.plan);
          const preflight = await readJsonFile(targetRoot, options.preflight);
          const managedContract = await resolveManagedContractForFinalReport(
            targetRoot,
            plan,
            preflight,
          );

          return {
            changedFiles: options.changedFiles,
            executedActions: options.executedActions,
            formalStatus: options.formalStatus,
            managedContract,
            pageStatus: options.pageStatus,
            plan,
            preflight,
            validationCommands: options.validationCommands,
          };
        })();

    const payload = renderFinalReport(inputs);
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`render-final-report failed: ${message}`);
    printUsage();
    process.exit(1);
  }
}

main();
