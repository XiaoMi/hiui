import fs from "node:fs/promises";
import path from "node:path";
import {
  isDesignRestoreInputMode,
  normalizeConfirmedDesignRestoreInput,
  validateConfirmedDesignRestoreInput,
} from "./design-restore-intake.mjs";
import { resolveAutoInstallMode } from "./install-mode-resolution.mjs";
import { loadPageTypeManifest } from "./load-page-type-manifest.mjs";
import { getPageFamilyContract } from "./page-family-contract.mjs";
import {
  buildNonTypicalCoverageDecision,
  buildNonTypicalDocSet,
  buildNonTypicalExecutionBrief,
  buildNonTypicalGenerationContract,
  buildNonTypicalPageType,
  buildNonTypicalWorkflowSummary,
  NON_TYPICAL_PAGE_FAMILY,
  resolveNonTypicalConversationOutput,
  resolveNonTypicalFamilyExecution,
} from "./non-typical-family-brief.mjs";
import {
  applyExplicitNavigationMountContract,
  buildNavigationMountAction,
  buildNavigationMountDecision,
  inspectFormalHostShellOfficialSource,
  resolveExplicitNavigationMountContract,
  resolveNavigationDecision,
} from "./generation-readiness.mjs";
import { inspectIntegrationReadiness } from "./integration-readiness.mjs";
import {
  buildProjectRunScriptCommand,
  buildProjectRunScriptCommandWithArgs,
  detectProjectPackageManager,
  inspectPageTaskGate,
} from "./page-task-gate.mjs";
import {
  getInstallModeErrorMessage,
  isRecognizedInstallMode,
} from "./mode-contract.mjs";
import { getManagedLocalRuntimeHostLogicalSource } from "./managed-local-runtime-contract.mjs";
import {
  buildCoverageDecision,
  loadHostImportPolicy,
  validateCoverageDecision,
  validateOutputTargetDecision,
} from "./generation-decision-contract.mjs";
import {
  detectBusinessEntryEvidence,
  tokenizeBusinessEntryText,
} from "./business-entry-evidence.mjs";
import {
  buildPageRelationDecision,
  readPersistedPageGenerationMeta,
  resolveEffectivePageRelationDecision,
} from "./page-relation-decision.mjs";
import { buildPublishDeliveryDecision } from "./publish-delivery-decision.mjs";
import {
  createPendingHostGenerationContract,
  isHighRiskLegacyModuleFederationHost,
  resolveHostGenerationContract,
} from "./resolve-host-generation-contract.mjs";
import {
  AI_GENERATION_READY_CONTEXT_FILENAME,
  PROJECT_HOST_CONTRACT_FILENAME,
  getContextScriptPath,
  resolveProjectContextPath,
} from "./skill-identity.mjs";
import { buildPageScopedMfDirectExposeLegacyAdapter } from "./host-adapters/mf-direct-expose-legacy.mjs";
import { readProjectHostContract } from "./project-host-contract.mjs";

const INPUT_MODE_DEFINITIONS = {
  "page-prompt": {
    label: "页面提示词",
    aliases: ["prompt", "pagePrompt"],
    evidenceType: "structured-intent",
  },
  "prototype-screenshot": {
    label: "原型截图",
    aliases: ["prototype", "screenshot", "prototypeScreenshot"],
    evidenceType: "visual-reference",
  },
  "figma-design-restore": {
    label: "Figma 设计还原",
    aliases: ["figma-design", "figmaDesignRestore"],
    evidenceType: "structured-design-reference",
  },
  "design-screenshot-restore": {
    label: "设计稿截图还原",
    aliases: ["design-screenshot", "designScreenshotRestore"],
    evidenceType: "design-visual-reference",
  },
  "legacy-system-reconstruction": {
    label: "旧系统重构",
    aliases: ["legacy", "legacy-system", "legacySystemReconstruction"],
    evidenceType: "existing-page-facts",
  },
};

const LOCALIZATION_MODE_DEFINITIONS = {
  none: {
    label: "不接入本地国际化桥接",
    aliases: ["off", "disabled"],
  },
  "inherit-host": {
    label: "继承宿主国际化能力",
    aliases: ["inherit", "host"],
  },
  "local-bridge": {
    label: "接入本地国际化桥接",
    aliases: ["bridge", "local"],
  },
};

const DEFAULT_LOCALIZATION_MODE = "none";

const DEFAULT_FORBIDDEN_INTEGRATION_FALLBACKS = [
  "handwritten-page-from-existing-business-source",
  "PageTable-or-empty-page-fallback",
  "route-menu-mf-window-addPage-guessing-before-ensure",
  "host-compatibility-generation-without-project-local-hiui-design",
];

const NON_INHERITABLE_PAGE_DIR_PREFIXES = ["src/typical-page-preview"];
const RELATED_PAGE_SUPPORTED_BUSINESS_ROOT_CANDIDATES = new Set([
  "src/views",
  "src/pages",
  "src/features",
]);
const RELATED_PAGE_SUPPORTED_ENTRY_FILE_PATTERN =
  /^(index|page)\.[cm]?[jt]sx?$/i;
const SCRIPT_LIKE_DEST_PATTERN = /\.[cm]?[jt]sx?$/i;
async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function isReadableFile(targetPath) {
  try {
    const stat = await fs.stat(targetPath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, "utf8");
  } catch {
    return "";
  }
}

async function readJsonIfExists(targetPath) {
  try {
    return JSON.parse(await fs.readFile(targetPath, "utf8"));
  } catch {
    return null;
  }
}

async function readAiGenerationReadyContext(targetRoot) {
  const contextPath = resolveProjectContextPath(
    targetRoot,
    "outputs",
    AI_GENERATION_READY_CONTEXT_FILENAME,
  );
  const aiGenerationReadyContext = await readJsonIfExists(contextPath);

  return {
    contextPath,
    aiGenerationReadyContext,
  };
}

function cloneJson(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function getProjectHostContractPath(targetRoot) {
  return resolveProjectContextPath(
    targetRoot,
    "outputs",
    PROJECT_HOST_CONTRACT_FILENAME,
  );
}

async function normalizeMode(mode, targetRoot) {
  if (!mode || mode === "auto") {
    const modeResolution = await resolveAutoInstallMode({
      requestedMode: "auto",
      targetRoot,
    });
    if (!modeResolution.mode) {
      throw new Error(
        `Install mode resolution returned no mode for ${targetRoot}. This indicates an internal bug in resolveAutoInstallMode().`,
      );
    }
    return modeResolution.mode;
  }
  if (!isRecognizedInstallMode(mode, { allowAuto: false })) {
    throw new Error(getInstallModeErrorMessage());
  }
  return mode;
}

function resolveBlockedBriefMode(mode, integrationReadiness = {}) {
  if (mode && mode !== "auto") {
    if (!isRecognizedInstallMode(mode, { allowAuto: false })) {
      throw new Error(getInstallModeErrorMessage());
    }
    return mode;
  }

  const appliedMode = normalizeString(integrationReadiness.appliedMode);
  return isRecognizedInstallMode(appliedMode, { allowAuto: false })
    ? appliedMode
    : "auto";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function countSharedTokens(leftValues, rightValues) {
  const rightSet = new Set(
    normalizeStringArray(rightValues).map((item) => item.toLowerCase()),
  );
  let count = 0;

  for (const item of normalizeStringArray(leftValues)) {
    if (rightSet.has(item.toLowerCase())) count += 1;
  }

  return count;
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function normalizeRequestedPageTypeCapabilityEntry(
  entry,
  status,
  sourcePath,
  options = {},
) {
  const blockedBy = Array.isArray(entry?.blockedBy)
    ? entry.blockedBy.map((item) => normalizeString(item)).filter(Boolean)
    : [];
  const conditionalBlockedBy = Array.isArray(entry?.conditionalBlockedBy)
    ? entry.conditionalBlockedBy
        .map((item) => normalizeString(item))
        .filter(Boolean)
    : [];
  const capabilityStatus = normalizeString(options.capabilityStatus) || status;
  const effectiveStatus = normalizeString(options.effectiveStatus) || status;
  const capabilityBlockedBy =
    capabilityStatus === "requires-managed-formal-shell"
      ? conditionalBlockedBy
      : blockedBy;

  return {
    status: effectiveStatus,
    capabilityStatus,
    id: normalizeString(entry?.id),
    label: normalizeString(entry?.label),
    reason: normalizeString(entry?.reason),
    blockedBy: effectiveStatus === "blocked" ? blockedBy : [],
    capabilityBlockedBy,
    conditionalBlockedBy,
    preWriteAction: normalizeString(entry?.preWriteAction),
    preWriteActionReason: normalizeString(entry?.preWriteActionReason),
    requiredShell: normalizeString(entry?.requiredShell),
    baseTemplatePath: normalizeString(entry?.baseTemplatePath),
    sourcePath,
  };
}

function normalizePageTypeGenerationSnapshot(entry = {}, sourcePath = "") {
  const generationContract = isPlainObject(entry?.generationContract)
    ? cloneJson(entry.generationContract)
    : {
        baseTemplatePath: normalizeString(entry?.baseTemplatePath),
        requiredShell: normalizeString(entry?.requiredShell),
        businessSlots: normalizeStringArray(entry?.businessSlots),
        requiredSlots: normalizeStringArray(entry?.requiredSlots),
        lockedRegions: normalizeStringArray(entry?.lockedRegions),
      };

  return {
    id: normalizeString(entry?.id),
    label: normalizeString(entry?.label),
    pageFamily: normalizeString(entry?.pageFamily),
    kind: normalizeString(entry?.kind),
    whenToUse: cloneJson(entry?.whenToUse ?? []),
    shell: normalizeString(entry?.shell || entry?.requiredShell),
    docEntry: normalizeString(entry?.docEntry),
    sharedDocs: normalizeStringArray(entry?.sharedDocs),
    smokePath: normalizeString(entry?.smokePath),
    runtimeExamplePath: normalizeString(entry?.runtimeExamplePath),
    globalPreviewRoute: normalizeString(entry?.globalPreviewRoute),
    generationWorkflow: cloneJson(entry?.generationWorkflow || {}),
    generationContract,
    requiredDocs: normalizeStringArray(entry?.requiredDocs),
    sourcePath,
  };
}

function hasCompletePageTypeGenerationSnapshot(pageTypeSnapshot = {}) {
  const generationContract = pageTypeSnapshot?.generationContract || {};
  return Boolean(
    normalizeString(pageTypeSnapshot?.id) &&
      normalizeString(generationContract?.baseTemplatePath) &&
      normalizeString(generationContract?.requiredShell),
  );
}

function buildRequiredDocsFromAiGenerationReadyContext(
  aiGenerationReadyContext = {},
  pageTypeSnapshot = {},
) {
  if (
    Array.isArray(pageTypeSnapshot?.requiredDocs) &&
    pageTypeSnapshot.requiredDocs.length > 0
  ) {
    return normalizeStringArray(pageTypeSnapshot.requiredDocs);
  }

  const manifestSnapshot =
    aiGenerationReadyContext?.pageTypeManifestSnapshot &&
    typeof aiGenerationReadyContext.pageTypeManifestSnapshot === "object"
      ? aiGenerationReadyContext.pageTypeManifestSnapshot
      : {};

  return unique([
    normalizeString(manifestSnapshot?.principlesDoc),
    normalizeString(manifestSnapshot?.routerDoc),
    "docs/generation/page-generation-workflow.md",
    normalizeString(manifestSnapshot?.registryDoc),
    normalizeString(pageTypeSnapshot?.docEntry),
    ...normalizeStringArray(pageTypeSnapshot?.sharedDocs),
  ]);
}

function extractPageTypeGenerationSnapshot(
  aiGenerationReadyContext = {},
  pageTypeId = "",
  sourcePath = "",
) {
  const allPageTypes = Array.isArray(aiGenerationReadyContext?.pageTypes)
    ? aiGenerationReadyContext.pageTypes
    : [];
  const matchedEntry = allPageTypes.find(
    (entry) => normalizeString(entry?.id) === pageTypeId,
  );
  if (!matchedEntry) return null;

  return normalizePageTypeGenerationSnapshot(matchedEntry, sourcePath);
}

function buildManifestSnapshotFromAiGenerationReadyContext(
  aiGenerationReadyContext = {},
) {
  const manifestSnapshot =
    aiGenerationReadyContext?.pageTypeManifestSnapshot &&
    typeof aiGenerationReadyContext.pageTypeManifestSnapshot === "object"
      ? aiGenerationReadyContext.pageTypeManifestSnapshot
      : {};

  return {
    manifestPath: normalizeString(manifestSnapshot?.manifestPath),
    baseManifestPath: normalizeString(manifestSnapshot?.baseManifestPath),
    overlayPath: normalizeString(manifestSnapshot?.overlayPath),
  };
}

async function loadPageTypeGenerationSnapshotFromAiGenerationReadyContext({
  targetRoot,
  pageTypeId,
  aiGenerationReadyContext = undefined,
} = {}) {
  const { contextPath, aiGenerationReadyContext: loadedContext } =
    aiGenerationReadyContext === undefined
      ? await readAiGenerationReadyContext(targetRoot)
      : {
          contextPath: resolveProjectContextPath(
            targetRoot,
            "outputs",
            AI_GENERATION_READY_CONTEXT_FILENAME,
          ),
          aiGenerationReadyContext,
        };

  if (!isPlainObject(loadedContext)) {
    return {
      status: "not-checked",
      pageType: null,
      generationContract: null,
      requiredDocs: [],
      manifestPath: "",
      baseManifestPath: "",
      overlayPath: "",
      sourcePath: contextPath,
    };
  }

  const pageTypeSnapshot = extractPageTypeGenerationSnapshot(
    loadedContext,
    normalizeString(pageTypeId),
    contextPath,
  );
  if (!pageTypeSnapshot) {
    return {
      status: "not-declared",
      pageType: null,
      generationContract: null,
      requiredDocs: [],
      manifestPath: "",
      baseManifestPath: "",
      overlayPath: "",
      sourcePath: contextPath,
    };
  }

  const manifestSnapshot =
    buildManifestSnapshotFromAiGenerationReadyContext(loadedContext);
  const requiredDocs = buildRequiredDocsFromAiGenerationReadyContext(
    loadedContext,
    pageTypeSnapshot,
  );

  if (!hasCompletePageTypeGenerationSnapshot(pageTypeSnapshot)) {
    return {
      status: "incomplete",
      pageType: pageTypeSnapshot,
      generationContract: pageTypeSnapshot.generationContract || {},
      requiredDocs,
      sourcePath: contextPath,
      ...manifestSnapshot,
    };
  }

  return {
    status: "ready",
    pageType: pageTypeSnapshot,
    generationContract: pageTypeSnapshot.generationContract,
    requiredDocs,
    sourcePath: contextPath,
    ...manifestSnapshot,
  };
}

function buildRequestedPageTypeStatusSnapshot(
  requestedPageTypeCapability = null,
) {
  return {
    status:
      normalizeString(requestedPageTypeCapability?.status) || "not-checked",
    capabilityStatus:
      normalizeString(requestedPageTypeCapability?.capabilityStatus) ||
      normalizeString(requestedPageTypeCapability?.status) ||
      "not-checked",
    reason: normalizeString(requestedPageTypeCapability?.reason),
    blockedBy: Array.isArray(requestedPageTypeCapability?.blockedBy)
      ? requestedPageTypeCapability.blockedBy
      : [],
    capabilityBlockedBy: Array.isArray(
      requestedPageTypeCapability?.capabilityBlockedBy,
    )
      ? requestedPageTypeCapability.capabilityBlockedBy
      : [],
    conditionalBlockedBy: Array.isArray(
      requestedPageTypeCapability?.conditionalBlockedBy,
    )
      ? requestedPageTypeCapability.conditionalBlockedBy
      : [],
    preWriteAction: normalizeString(
      requestedPageTypeCapability?.preWriteAction,
    ),
    preWriteActionReason: normalizeString(
      requestedPageTypeCapability?.preWriteActionReason,
    ),
    nextCommand: normalizeString(requestedPageTypeCapability?.nextCommand),
    sourcePath: normalizeString(requestedPageTypeCapability?.sourcePath),
  };
}

async function maybeAttachRequestedPageTypeNextCommand({
  targetRoot,
  resolvedMode,
  line = "",
  pageTypeId = "",
  requestedBusiness = {},
  requestedPageTypeCapability = {},
}) {
  const preWriteAction = normalizeString(
    requestedPageTypeCapability?.preWriteAction,
  );
  const packageManager = await detectProjectPackageManager(targetRoot);

  if (preWriteAction === "repair-legacy-mf-shared-contract") {
    return {
      ...requestedPageTypeCapability,
      nextCommand: buildProjectRunScriptCommand(
        packageManager,
        "typical-page:legacy-mf-shared-contract-autofix",
      ),
    };
  }

  if (preWriteAction !== "materialize-managed-mf-host-contract") {
    return requestedPageTypeCapability;
  }

  const targetBusinessPath = normalizeString(
    requestedBusiness?.targetBusinessPath || requestedBusiness?.dest,
  );
  const title = normalizeString(requestedBusiness?.title);
  if (!targetBusinessPath || !title || !normalizeString(pageTypeId)) {
    return requestedPageTypeCapability;
  }

  const commandParts = [
    "--page-type",
    shellQuote(normalizeString(pageTypeId)),
    "--dest",
    shellQuote(targetBusinessPath),
    "--title",
    shellQuote(title),
  ];
  const routePath = normalizeString(requestedBusiness?.routePath);
  if (routePath) {
    commandParts.push("--route-path", shellQuote(routePath));
  }
  if (resolvedMode) {
    commandParts.push("--mode", shellQuote(resolvedMode));
  }
  if (line) {
    commandParts.push("--line", shellQuote(line));
  }

  return {
    ...requestedPageTypeCapability,
    nextCommand: buildProjectRunScriptCommandWithArgs(
      packageManager,
      "typical-page:managed-mf-host-contract-autofix",
      commandParts,
    ),
  };
}

function resolveBriefWriteReadiness({
  briefReadyToGenerate = false,
  pageTaskGateStatus = "",
  requestedPageTypeStatus = "not-checked",
  navigationBlocked = false,
}) {
  if (pageTaskGateStatus !== "ready-to-generate")
    return "blocked-by-page-task-gate";
  if (requestedPageTypeStatus === "blocked")
    return "blocked-by-requested-page-type";
  if (navigationBlocked) return "blocked-by-navigation-mount";
  if (briefReadyToGenerate === false) return "blocked-before-write";
  return "ready";
}

const WRITE_BLOCKED_ACTIONS = new Set(["write-page-source"]);
const MANUAL_NAVIGATION_EXECUTION_ACTIONS = new Set([
  "append-existing-entry",
  "materialize-mf-publish-entry",
  "manual-register-existing-registry",
]);

function resolveNavigationExecutionReadiness({
  navigationBlocked = false,
  navigationMountDecision = null,
  navigationMountAction = null,
}) {
  const mountDecisionAction = normalizeString(navigationMountDecision?.action);
  const mountAction = normalizeString(navigationMountAction?.action);

  if (
    navigationBlocked === true ||
    mountDecisionAction === "ask-user" ||
    mountAction === "ask-user"
  ) {
    return {
      blocked: true,
      writeBlocked: true,
      status: "needs-navigation-mount-confirmation",
      blockedBy: ["navigation-mount-point-not-confirmed"],
      reason:
        normalizeString(navigationMountAction?.reason) ||
        normalizeString(navigationMountDecision?.reason) ||
        "Navigation mount point is unresolved.",
    };
  }

  if (MANUAL_NAVIGATION_EXECUTION_ACTIONS.has(mountAction)) {
    return {
      blocked: true,
      writeBlocked: false,
      status: "manual-navigation-registration-required",
      blockedBy: ["manual-navigation-registration-required"],
      reason:
        normalizeString(navigationMountAction?.reason) ||
        "Page source can be generated, but the navigation mount still requires manual registration.",
    };
  }

  return {
    blocked: false,
    writeBlocked: false,
    status: "ready",
    blockedBy: [],
    reason: "",
  };
}

function buildWriteReadinessActionPolicy({
  allowedActions = [],
  forbiddenActions = [],
  writeReadiness = "ready",
}) {
  const normalizedAllowedActions = unique(
    (Array.isArray(allowedActions) ? allowedActions : [])
      .map((item) => normalizeString(item))
      .filter(Boolean),
  );
  const normalizedForbiddenActions = unique(
    (Array.isArray(forbiddenActions) ? forbiddenActions : [])
      .map((item) => normalizeString(item))
      .filter(Boolean),
  );

  if (writeReadiness === "ready") {
    return {
      allowedActions: normalizedAllowedActions,
      forbiddenActions: normalizedForbiddenActions,
    };
  }

  const strippedWriteActions = normalizedAllowedActions.filter((action) =>
    WRITE_BLOCKED_ACTIONS.has(action),
  );

  return {
    allowedActions: normalizedAllowedActions.filter(
      (action) => !WRITE_BLOCKED_ACTIONS.has(action),
    ),
    forbiddenActions: unique([
      ...normalizedForbiddenActions,
      ...strippedWriteActions,
    ]),
  };
}

function buildExecutionPolicyActionFields({
  allowedActions = [],
  forbiddenActions = [],
  writeReadiness = "ready",
}) {
  const actionPolicy = buildWriteReadinessActionPolicy({
    allowedActions,
    forbiddenActions,
    writeReadiness,
  });

  return {
    pageTaskAllowedActions: actionPolicy.allowedActions,
    pageTaskForbiddenActions: actionPolicy.forbiddenActions,
  };
}

function isNavigationMountWriteBlocked({
  navigationBlocked = false,
  navigationMountDecision = null,
  navigationMountAction = null,
}) {
  return resolveNavigationExecutionReadiness({
    navigationBlocked,
    navigationMountDecision,
    navigationMountAction,
  }).writeBlocked;
}

function getNavigationBlockReason(brief) {
  return (
    brief.executionPolicy?.navigationBlockReason ||
    brief.pageGenerationDecision?.navigationMountAction?.reason ||
    brief.pageGenerationDecision?.navigationMountDecision?.reason ||
    "Navigation mount point is unresolved."
  );
}

export function isGenerationBriefBlocked(brief) {
  const pageTaskGateStatus =
    brief?.executionPolicy?.pageTaskGateStatus ||
    brief?.pageTaskGate?.status ||
    "";

  return (
    brief?.executionPolicy?.briefReadyToGenerate === false ||
    pageTaskGateStatus !== "ready-to-generate" ||
    isNavigationMountWriteBlocked({
      navigationBlocked: brief?.executionPolicy?.navigationBlocked === true,
      navigationMountDecision:
        brief?.pageGenerationDecision?.navigationMountDecision,
      navigationMountAction:
        brief?.pageGenerationDecision?.navigationMountAction,
    })
  );
}

async function inspectRequestedPageTypeCapability({
  targetRoot,
  pageTypeId,
  aiGenerationReadyContext = undefined,
}) {
  const { contextPath, aiGenerationReadyContext: loadedContext } =
    aiGenerationReadyContext === undefined
      ? await readAiGenerationReadyContext(targetRoot)
      : {
          contextPath: resolveProjectContextPath(
            targetRoot,
            "outputs",
            AI_GENERATION_READY_CONTEXT_FILENAME,
          ),
          aiGenerationReadyContext,
        };

  if (!isPlainObject(loadedContext)) {
    return {
      status: "not-checked",
      capabilityStatus: "not-checked",
      id: normalizeString(pageTypeId),
      label: "",
      reason: "",
      blockedBy: [],
      capabilityBlockedBy: [],
      conditionalBlockedBy: [],
      preWriteAction: "",
      preWriteActionReason: "",
      requiredShell: "",
      baseTemplatePath: "",
      sourcePath: contextPath,
    };
  }

  const allowedPageTypes = Array.isArray(loadedContext.allowedPageTypes)
    ? loadedContext.allowedPageTypes
    : [];
  const conditionalPageTypes = Array.isArray(loadedContext.conditionalPageTypes)
    ? loadedContext.conditionalPageTypes
    : [];
  const blockedPageTypes = Array.isArray(loadedContext.blockedPageTypes)
    ? loadedContext.blockedPageTypes
    : [];
  const allowedEntry = allowedPageTypes.find(
    (entry) => normalizeString(entry?.id) === pageTypeId,
  );
  if (allowedEntry) {
    return normalizeRequestedPageTypeCapabilityEntry(
      allowedEntry,
      "allowed",
      contextPath,
      {
        capabilityStatus: "allowed",
      },
    );
  }

  const conditionalEntry = conditionalPageTypes.find(
    (entry) => normalizeString(entry?.id) === pageTypeId,
  );
  if (conditionalEntry) {
    return normalizeRequestedPageTypeCapabilityEntry(
      conditionalEntry,
      "requires-managed-formal-shell",
      contextPath,
      {
        capabilityStatus: "requires-managed-formal-shell",
      },
    );
  }

  const blockedEntry = blockedPageTypes.find(
    (entry) => normalizeString(entry?.id) === pageTypeId,
  );
  if (blockedEntry) {
    return normalizeRequestedPageTypeCapabilityEntry(
      blockedEntry,
      "blocked",
      contextPath,
      {
        capabilityStatus: "blocked",
      },
    );
  }

  return {
    status: "not-declared",
    capabilityStatus: "not-declared",
    id: normalizeString(pageTypeId),
    label: "",
    reason: "",
    blockedBy: [],
    capabilityBlockedBy: [],
    conditionalBlockedBy: [],
    preWriteAction: "",
    preWriteActionReason: "",
    requiredShell: "",
    baseTemplatePath: "",
    sourcePath: contextPath,
  };
}

function normalizeRequestedPageTypeHostCapabilityContract(contract = {}) {
  return {
    headerOwnership: normalizeString(contract?.headerOwnership) || "unknown",
  };
}

function getRequestedPageTypeCapabilityBlockedBy(requestedPageTypeCapability) {
  const capabilityStatus =
    normalizeString(requestedPageTypeCapability?.capabilityStatus) ||
    normalizeString(requestedPageTypeCapability?.status) ||
    "not-checked";

  return capabilityStatus === "requires-managed-formal-shell"
    ? normalizeStringArray(requestedPageTypeCapability?.conditionalBlockedBy)
    : normalizeStringArray(
        requestedPageTypeCapability?.capabilityBlockedBy ||
          requestedPageTypeCapability?.blockedBy,
      );
}

function canAutoMaterializeRequestedFormalShell({
  requestedPageTypeCapability,
  contract,
  navigationDecision,
  navigationMountDecision,
  navigationMountAction,
  officialHostSourceReadiness,
}) {
  const capabilityStatus =
    normalizeString(requestedPageTypeCapability?.capabilityStatus) ||
    normalizeString(requestedPageTypeCapability?.status) ||
    "not-checked";
  const capabilityBlockedBy = getRequestedPageTypeCapabilityBlockedBy(
    requestedPageTypeCapability,
  );
  const hostCapabilityContract =
    normalizeRequestedPageTypeHostCapabilityContract(
      contract?.hostCapabilityContract,
    );
  const preWriteAction = normalizeString(
    requestedPageTypeCapability?.preWriteAction,
  );
  const hasManagedFirstFormalShellSignal =
    preWriteAction === "create-first-formal-shell" ||
    capabilityBlockedBy.includes("missing-first-managed-formal-shell");

  if (!["blocked", "requires-managed-formal-shell"].includes(capabilityStatus))
    return false;
  if (hostCapabilityContract.headerOwnership !== "self-contained") return false;
  if (!hasManagedFirstFormalShellSignal) return false;
  if (navigationDecision?.shouldAutoCreateFormalBusinessShell !== true)
    return false;
  if (navigationMountDecision?.action !== "create-first-formal-shell")
    return false;
  if (navigationMountAction?.action !== "create-formal-shell-and-mount-entry")
    return false;
  if (normalizeString(officialHostSourceReadiness?.status) !== "ready")
    return false;
  return true;
}

function resolveRequestedPageTypeCapabilityForBrief({
  requestedPageTypeCapability,
  contract,
  hostProfile,
  navigationDecision,
  navigationMountDecision,
  navigationMountAction,
  officialHostSourceReadiness,
}) {
  const capabilityStatus =
    normalizeString(requestedPageTypeCapability?.capabilityStatus) ||
    normalizeString(requestedPageTypeCapability?.status) ||
    "not-checked";

  if (capabilityStatus === "allowed") {
    return {
      ...requestedPageTypeCapability,
      status: "allowed",
      capabilityStatus: "allowed",
      blockedBy: [],
      capabilityBlockedBy: [],
      conditionalBlockedBy: [],
    };
  }

  const bridgeable = canAutoMaterializeRequestedFormalShell({
    requestedPageTypeCapability,
    contract,
    navigationDecision,
    navigationMountDecision,
    navigationMountAction,
    officialHostSourceReadiness,
  });

  if (bridgeable) {
    const conditionalBlockedBy =
      capabilityStatus === "requires-managed-formal-shell"
        ? normalizeStringArray(
            requestedPageTypeCapability?.conditionalBlockedBy,
          )
        : normalizeStringArray(
            requestedPageTypeCapability?.capabilityBlockedBy ||
              requestedPageTypeCapability?.blockedBy,
          );

    return {
      ...requestedPageTypeCapability,
      status: "allowed",
      capabilityStatus: "requires-managed-formal-shell",
      blockedBy: [],
      capabilityBlockedBy: conditionalBlockedBy,
      conditionalBlockedBy,
      preWriteAction:
        normalizeString(requestedPageTypeCapability?.preWriteAction) ||
        "create-first-formal-shell",
      preWriteActionReason:
        normalizeString(requestedPageTypeCapability?.preWriteActionReason) ||
        normalizeString(navigationMountAction?.reason) ||
        "Create the first formal business shell and mount it in the real app entry before page code is written.",
      reason:
        normalizeString(requestedPageTypeCapability?.reason) ||
        "Requested page type can proceed after the managed first formal business shell is materialized.",
    };
  }

  if (capabilityStatus === "requires-managed-formal-shell") {
    return {
      ...requestedPageTypeCapability,
      status: "blocked",
      blockedBy: normalizeStringArray(
        requestedPageTypeCapability?.conditionalBlockedBy ||
          requestedPageTypeCapability?.capabilityBlockedBy,
      ),
    };
  }

  return requestedPageTypeCapability;
}

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeStringArray(value) {
  return unique(asArray(value).map((item) => normalizeString(item)));
}

function normalizeIntentContractPayload(value) {
  if (!isPlainObject(value)) {
    return {
      mustHave: [],
      mustNotAdd: [],
    };
  }

  return {
    mustHave: normalizeStringArray(value.mustHave),
    mustNotAdd: normalizeStringArray(value.mustNotAdd),
  };
}

function buildCertifiedImplementationPolicy(pageTypeId) {
  switch (pageTypeId) {
    case "drawer-form":
      return {
        boundary: "preserve-official-drawer-schema-subtree",
        notes: [
          "drawer-form is a certified template-preservation path: keep the official TypicalPageFieldMapProvider + SchemaForm subtree intact.",
          "Only replace title, trigger, fields, initialValues, mock data, and submit logic; do not redesign the drawer body renderer.",
          "Do not replace the certified subtree with Card + Form, a second ad-hoc form bridge, or a local compatibility wrapper that changes the certified schema subtree contract.",
        ],
      };
    case "full-page-edit":
      return {
        boundary: "managed-pro-edit-form-bridge",
        notes: [
          "full-page-edit must keep the managed Form bridge exported by local-managed-runtime/pro-edit-page.",
          "Do not reintroduce SchemaForm, mapToDumb, AsyncOptsDataInjector, or a local compatibility wrapper in the page source.",
        ],
      };
    case "table-basic":
    case "table-stat":
    case "tree-table":
    case "tree-split":
    case "data-visualization":
      return {
        boundary: "shared-runtime-baseline",
        notes: [
          "React 19 compatibility for table/tree/list page families belongs to the shared runtime baseline, not to page-level JSX workarounds.",
          "If rc-resize-observer, react-resize-detector, or similar runtime warnings appear, fix the dependency baseline before patching page source.",
          "For high-risk legacy Module Federation hosts, hiui-design may auto-materialize a page-local minimal field-map-provider.tsx that mirrors the official field map contract while cutting the package-root import chain.",
        ],
      };
    default:
      return {
        boundary: "",
        notes: [],
      };
  }
}

const FIELD_MAP_PROVIDER_PAGE_TYPES = new Set([
  "table-basic",
  "table-stat",
  "tree-table",
  "tree-split",
  "drawer-form",
  "data-visualization",
]);

function buildFieldMapProviderCompatibility({ pageTypeId, hostProfile } = {}) {
  const usesCertifiedFieldMapProvider = FIELD_MAP_PROVIDER_PAGE_TYPES.has(
    normalizeString(pageTypeId),
  );
  const highRiskLegacyModuleFederation =
    isHighRiskLegacyModuleFederationHost(hostProfile);

  if (!usesCertifiedFieldMapProvider) {
    return {
      enabled: false,
      strategy: "not-applicable",
      reason:
        "Current page type does not rely on the certified TypicalPageFieldMapProvider contract.",
      supportFile: null,
      evidence: [],
    };
  }

  if (!highRiskLegacyModuleFederation) {
    return {
      enabled: false,
      strategy: "official-shell-import",
      reason:
        "Current host does not match the managed high-risk legacy Module Federation downgrade profile; keep the official shell import.",
      supportFile: null,
      evidence: [],
    };
  }

  return {
    enabled: true,
    strategy: "local-minimal-provider",
    reason:
      "Detected a high-risk legacy Module Federation host. Materialize a page-local minimal field-map-provider.tsx and redirect TypicalPageFieldMapProvider imports there so the certified provider contract stays intact while the package-root import chain is cut.",
    supportFile: {
      destName: "field-map-provider.tsx",
      importSource: "./field-map-provider",
      exportedSymbol: "TypicalPageFieldMapProvider",
    },
    evidence: normalizeStringArray([
      normalizeString(hostProfile?.framework),
      normalizeString(hostProfile?.riskLevel),
      ...(Array.isArray(hostProfile?.riskTags) ? hostProfile.riskTags : []),
    ]),
  };
}

function buildBriefHostImportPolicy({
  contextPath = "",
  hostImportPolicy = {},
} = {}) {
  return {
    contextPath,
    hiui5Components: hostImportPolicy.hiui5Components || "hiui5",
    typicalPageShells:
      hostImportPolicy.typicalPageShells || "local-managed-runtime",
    icons: hostImportPolicy.icons || "@hi-ui/icons",
    allowedVisualImportSources:
      hostImportPolicy.allowedVisualImportSources ?? [],
    templateInternalAllowedVisualImportSources:
      hostImportPolicy.templateInternalAllowedVisualImportSources ?? [],
    forbiddenNewVisualImports: hostImportPolicy.forbiddenNewVisualImports ?? [],
  };
}

function buildBriefHostProfileSummary(hostProfile = {}) {
  return {
    projectType: normalizeString(hostProfile?.projectType),
    framework: normalizeString(hostProfile?.framework),
    runtime: normalizeString(hostProfile?.runtime),
    routing: normalizeString(hostProfile?.routing),
    reactMajor: Number.isFinite(Number(hostProfile?.reactMajor))
      ? Number(hostProfile.reactMajor)
      : 0,
    legacyReactRuntime: hostProfile?.legacyReactRuntime === true,
    riskLevel: normalizeString(hostProfile?.riskLevel),
    riskTags: normalizeStringArray(hostProfile?.riskTags),
    strategy: normalizeString(hostProfile?.strategy),
    reason: normalizeString(hostProfile?.reason),
    adapterDoc: normalizeString(hostProfile?.adapterDoc),
    adapterEntryHints: normalizeStringArray(hostProfile?.adapterEntryHints),
    readmePath: normalizeRelativePath(hostProfile?.readmePath),
    remoteOnlyRuntime: cloneJson(hostProfile?.remoteOnlyRuntime || {}),
    remoteDebugContract: cloneJson(hostProfile?.remoteDebugContract || {}),
  };
}

function normalizeInputMode(input) {
  const normalizedInput = normalizeString(input);
  if (!normalizedInput) {
    return {
      id: "page-prompt",
      label: INPUT_MODE_DEFINITIONS["page-prompt"].label,
      evidenceType: INPUT_MODE_DEFINITIONS["page-prompt"].evidenceType,
    };
  }

  const matched = Object.entries(INPUT_MODE_DEFINITIONS).find(
    ([id, definition]) =>
      id === normalizedInput || definition.aliases.includes(normalizedInput),
  );

  if (!matched) {
    const allowedModes = Object.keys(INPUT_MODE_DEFINITIONS).join(", ");
    throw new Error(
      `Unknown input mode "${normalizedInput}". Allowed values: ${allowedModes}`,
    );
  }

  const [id, definition] = matched;
  return {
    id,
    label: definition.label,
    evidenceType: definition.evidenceType,
  };
}

function normalizeHintText(...values) {
  return values
    .map((value) => normalizeString(value).toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function assertPublicInputModeAvailability(normalizedInputMode) {
  if (normalizedInputMode?.id !== "design-screenshot-restore") return;

  throw new Error(
    "design-screenshot-restore is reserved for the second-stage degraded design-restore lane and is not publicly open yet. Use figma-design-restore for the current public design-restore flow.",
  );
}

function normalizeLocalizationMode(input) {
  const normalizedInput = normalizeString(input);

  if (!normalizedInput) {
    return {
      id: DEFAULT_LOCALIZATION_MODE,
      label: LOCALIZATION_MODE_DEFINITIONS[DEFAULT_LOCALIZATION_MODE].label,
    };
  }

  const matched = Object.entries(LOCALIZATION_MODE_DEFINITIONS).find(
    ([id, definition]) =>
      id === normalizedInput || definition.aliases.includes(normalizedInput),
  );

  if (!matched) {
    const allowedModes = Object.keys(LOCALIZATION_MODE_DEFINITIONS).join(", ");
    throw new Error(
      `Unknown localization mode "${normalizedInput}". Allowed values: ${allowedModes}`,
    );
  }

  const [id, definition] = matched;
  return {
    id,
    label: definition.label,
  };
}

function resolvePageFamily(pageType, workflow = {}) {
  const declaredPageFamily = normalizeString(pageType?.pageFamily);
  if (declaredPageFamily) return declaredPageFamily;

  if (workflow.kind === "analytics-spec-driven") {
    return "analytics-page";
  }

  return "typical-page";
}

function listObservedDesignRestoreRegionTypes(
  confirmedDesignRestoreInput = null,
) {
  return normalizeStringArray(
    confirmedDesignRestoreInput?.restoreDecisionPackage?.regionDecisionTable?.map(
      (item) => item.regionType,
    ),
  );
}

function hasDesignRestoreHintToken(text, tokens = []) {
  const hint = normalizeHintText(text);
  if (!hint) return false;

  return tokens.some((token) => hint.includes(token));
}

function buildDesignRestoreRoutingDecision({
  normalizedInputMode,
  confirmedDesignRestoreInput,
} = {}) {
  if (
    !isDesignRestoreInputMode(normalizedInputMode?.id) ||
    !confirmedDesignRestoreInput
  ) {
    return null;
  }

  const observedRegionTypes = listObservedDesignRestoreRegionTypes(
    confirmedDesignRestoreInput,
  );
  const regionTypeSet = new Set(observedRegionTypes);
  const pageGoal = normalizeString(
    confirmedDesignRestoreInput?.restoreDecisionPackage?.pageGoal,
  );
  const layoutIntent = normalizeString(
    confirmedDesignRestoreInput?.restoreDecisionPackage?.layoutIntent,
  );
  const promptHint = normalizeString(
    confirmedDesignRestoreInput?.confirmation?.finalPrompt,
  );
  const routeHintText = normalizeHintText(pageGoal, layoutIntent, promptHint);
  const coreRegionTypes = observedRegionTypes.filter(
    (item) => item && item !== "page-header" && item !== "action-strip",
  );
  const uniqueCoreRegionCount = new Set(coreRegionTypes).size;
  const hasChart = regionTypeSet.has("chart-insight");
  const hasMetrics = regionTypeSet.has("metric-summary");
  const hasQueryFilter = regionTypeSet.has("query-filter");
  const hasTable = regionTypeSet.has("data-table");
  const hasTreePane = regionTypeSet.has("tree-pane");
  const hasForm = regionTypeSet.has("form-fields");
  const hasDetail = regionTypeSet.has("detail-sections");
  const hasStageRail = regionTypeSet.has("stage-navigation");
  const hasSnapshotPanel = regionTypeSet.has("snapshot-panel");
  const hasPrimaryWorkspace = regionTypeSet.has("primary-workspace");
  const looksLikeDrawer = hasDesignRestoreHintToken(routeHintText, [
    "drawer",
    "抽屉",
  ]);
  const looksLikeAnalytics = hasDesignRestoreHintToken(routeHintText, [
    "analytics",
    "analysis",
    "dashboard",
    "trend",
    "chart",
    "图表",
    "分析",
    "趋势",
    "看板",
  ]);
  const reasons = [];

  const buildDecision = ({
    confidence = "medium",
    recommendedPageFamily = "",
    recommendedPageTypeId = "",
    recommendedPageTypeCandidates = [],
    selectorKind = "",
    selectorId = "",
  } = {}) => ({
    inputMode: normalizedInputMode.id,
    confidence,
    recommendedPageFamily,
    recommendedPageTypeId,
    recommendedPageTypeCandidates: normalizeStringArray(
      recommendedPageTypeCandidates,
    ),
    selector:
      selectorKind && selectorId
        ? {
            kind: selectorKind,
            id: selectorId,
          }
        : null,
    observedRegionTypes,
    pageGoal,
    layoutIntent,
    reasons: normalizeStringArray(reasons),
    conflictPolicy: "fail-closed-on-explicit-mismatch",
  });

  if (
    hasChart ||
    (hasMetrics &&
      looksLikeAnalytics &&
      !hasForm &&
      !hasDetail &&
      !hasStageRail)
  ) {
    reasons.push("Detected chart-insight / analytics-oriented design signals.");
    if (hasMetrics) {
      reasons.push(
        "Metric-summary regions stay inside the analytics shell instead of a typical stat table.",
      );
    }
    return buildDecision({
      confidence: hasChart ? "high" : "medium",
      recommendedPageFamily: "analytics-page",
      recommendedPageTypeId: "data-visualization",
      recommendedPageTypeCandidates: ["data-visualization"],
      selectorKind: "page-type",
      selectorId: "data-visualization",
    });
  }

  if (
    uniqueCoreRegionCount >= 3 &&
    ((hasStageRail &&
      (hasSnapshotPanel || hasPrimaryWorkspace || hasDetail || hasForm)) ||
      (hasSnapshotPanel && hasPrimaryWorkspace && (hasDetail || hasForm)))
  ) {
    reasons.push(
      "Multiple stable regions jointly own the primary task instead of one typical shell.",
    );
    if (hasStageRail) {
      reasons.push(
        "Stage-navigation drives other regions, which matches the non-typical execution path.",
      );
    }
    return buildDecision({
      confidence: "high",
      recommendedPageFamily: NON_TYPICAL_PAGE_FAMILY,
      selectorKind: "page-family",
      selectorId: NON_TYPICAL_PAGE_FAMILY,
    });
  }

  if (hasTreePane && hasTable) {
    reasons.push(
      "Detected a dedicated tree-pane that controls a table workspace.",
    );
    return buildDecision({
      confidence: "high",
      recommendedPageFamily: "typical-page",
      recommendedPageTypeId: "tree-split",
      recommendedPageTypeCandidates: ["tree-split"],
      selectorKind: "page-type",
      selectorId: "tree-split",
    });
  }

  if (hasMetrics && hasTable) {
    reasons.push(
      "Detected metric-summary plus table regions, which fits the stat-table shell.",
    );
    return buildDecision({
      confidence: "high",
      recommendedPageFamily: "typical-page",
      recommendedPageTypeId: "table-stat",
      recommendedPageTypeCandidates: ["table-stat"],
      selectorKind: "page-type",
      selectorId: "table-stat",
    });
  }

  if (hasQueryFilter && hasTable) {
    reasons.push(
      "Detected query-filter plus data-table as the dominant workspace.",
    );
    return buildDecision({
      confidence: "high",
      recommendedPageFamily: "typical-page",
      recommendedPageTypeId: "table-basic",
      recommendedPageTypeCandidates: ["table-basic"],
      selectorKind: "page-type",
      selectorId: "table-basic",
    });
  }

  if (hasTable) {
    reasons.push("Detected data-table as the primary stable region.");
    return buildDecision({
      confidence: "medium",
      recommendedPageFamily: "typical-page",
      recommendedPageTypeId: "table-basic",
      recommendedPageTypeCandidates: ["table-basic", "tree-table"],
      selectorKind: "page-type",
      selectorId: "table-basic",
    });
  }

  if (hasForm) {
    reasons.push("Detected a form-focused primary workspace.");
    if (looksLikeDrawer) {
      reasons.push("Route hints mention a drawer-style interaction.");
      return buildDecision({
        confidence: "high",
        recommendedPageFamily: "typical-page",
        recommendedPageTypeId: "drawer-form",
        recommendedPageTypeCandidates: ["drawer-form"],
        selectorKind: "page-type",
        selectorId: "drawer-form",
      });
    }

    if (regionTypeSet.has("action-strip") || hasPrimaryWorkspace) {
      reasons.push(
        "Detected a full-page form workspace or action strip outside the form body.",
      );
      return buildDecision({
        confidence: "medium",
        recommendedPageFamily: "typical-page",
        recommendedPageTypeId: "full-page-edit",
        recommendedPageTypeCandidates: ["full-page-edit", "drawer-form"],
        selectorKind: "page-type",
        selectorId: "full-page-edit",
      });
    }

    return buildDecision({
      confidence: "medium",
      recommendedPageFamily: "typical-page",
      recommendedPageTypeCandidates: ["drawer-form", "full-page-edit"],
    });
  }

  if (hasDetail) {
    reasons.push("Detected a detail-reading workspace as the primary region.");
    if (looksLikeDrawer) {
      reasons.push("Route hints mention a drawer-style interaction.");
      return buildDecision({
        confidence: "high",
        recommendedPageFamily: "typical-page",
        recommendedPageTypeId: "drawer-detail",
        recommendedPageTypeCandidates: ["drawer-detail"],
        selectorKind: "page-type",
        selectorId: "drawer-detail",
      });
    }

    return buildDecision({
      confidence: "medium",
      recommendedPageFamily: "typical-page",
      recommendedPageTypeCandidates: ["drawer-detail", "full-page-detail"],
    });
  }

  if (hasPrimaryWorkspace && hasSnapshotPanel) {
    reasons.push(
      "Detected a multi-region workspace with a persistent snapshot panel.",
    );
    return buildDecision({
      confidence: "medium",
      recommendedPageFamily: NON_TYPICAL_PAGE_FAMILY,
      selectorKind: "page-family",
      selectorId: NON_TYPICAL_PAGE_FAMILY,
    });
  }

  return buildDecision({
    confidence: "low",
    recommendedPageFamily: "typical-page",
  });
}

function describeDesignRestoreRoutingDecision(routingDecision = null) {
  if (!routingDecision) return "";

  const confidence = routingDecision.confidence || "unknown";
  const reasons =
    routingDecision.reasons?.length > 0
      ? ` Reasons: ${routingDecision.reasons.join(" ")}`
      : "";

  if (routingDecision.selector?.kind === "page-type") {
    return `design-restore routing recommends --page-type ${routingDecision.selector.id} (confidence=${confidence}).${reasons}`;
  }

  if (routingDecision.selector?.kind === "page-family") {
    return `design-restore routing recommends --page-family ${routingDecision.selector.id} (confidence=${confidence}).${reasons}`;
  }

  if (routingDecision.recommendedPageTypeCandidates?.length > 0) {
    return (
      `design-restore routing narrowed the request to candidate page types: ` +
      `${routingDecision.recommendedPageTypeCandidates.join(
        ", ",
      )} (confidence=${confidence}).${reasons}`
    );
  }

  if (routingDecision.recommendedPageFamily) {
    return (
      `design-restore routing recommends pageFamily=${routingDecision.recommendedPageFamily} ` +
      `(confidence=${confidence}).${reasons}`
    );
  }

  return "";
}

function buildLegacyReconstructionRoutingDecision(
  legacyReconstructionInput = null,
) {
  if (!legacyReconstructionInput) return null;

  const recommendedPageTypeId = normalizeString(
    legacyReconstructionInput?.pageTypeRecommendation?.recommended,
  );
  const recommendedPageFamilyId = normalizeString(
    legacyReconstructionInput?.pageFamilyRecommendation?.recommended,
  );
  if (!recommendedPageTypeId && !recommendedPageFamilyId) return null;

  return {
    selector: recommendedPageTypeId
      ? {
          kind: "page-type",
          id: recommendedPageTypeId,
        }
      : {
          kind: "page-family",
          id: recommendedPageFamilyId,
        },
    recommendedPageTypeId,
    recommendedPageFamilyId,
    confidence:
      normalizeString(
        legacyReconstructionInput?.pageTypeRecommendation?.confidence,
      ) ||
      normalizeString(
        legacyReconstructionInput?.pageFamilyRecommendation?.confidence,
      ),
    pageTypeCandidates: asArray(
      legacyReconstructionInput?.pageTypeRecommendation?.candidates,
    )
      .slice(0, 3)
      .map((item) => normalizeRecommendationCandidate(item)),
    pageFamilyCandidates: asArray(
      legacyReconstructionInput?.pageFamilyRecommendation?.candidates,
    )
      .slice(0, 3)
      .map((item) => normalizePageFamilyRecommendationCandidate(item)),
    reasons: normalizeStringArray([
      ...(legacyReconstructionInput?.pageTypeRecommendation?.reasons || []),
      ...(legacyReconstructionInput?.pageFamilyRecommendation?.reasons || []),
    ]),
  };
}

function describeLegacyReconstructionRoutingDecision(routingDecision = null) {
  if (!routingDecision) return "";

  const confidence = routingDecision.confidence || "unknown";
  const reasons =
    routingDecision.reasons?.length > 0
      ? ` Reasons: ${routingDecision.reasons.join(" ")}`
      : "";

  if (routingDecision.selector?.kind === "page-type") {
    const candidateSummary =
      routingDecision.pageTypeCandidates?.length > 0
        ? ` Candidates: ${routingDecision.pageTypeCandidates
            .map(
              (item) =>
                `${item.pageType}(${Number(item.score || 0).toFixed(2)})`,
            )
            .join(", ")}.`
        : "";
    return (
      `legacy reconstruction routing recommends --page-type ${routingDecision.selector.id} ` +
      `(confidence=${confidence}).${candidateSummary}${reasons}`
    );
  }

  if (routingDecision.selector?.kind === "page-family") {
    const candidateSummary =
      routingDecision.pageFamilyCandidates?.length > 0
        ? ` Candidates: ${routingDecision.pageFamilyCandidates
            .map(
              (item) =>
                `${item.pageFamily}(${Number(item.score || 0).toFixed(2)})`,
            )
            .join(", ")}.`
        : "";
    return (
      `legacy reconstruction routing recommends --page-family ${routingDecision.selector.id} ` +
      `(confidence=${confidence}).${candidateSummary}${reasons}`
    );
  }

  return "";
}

function resolveRequestedPageSelector({
  pageTypeId = "",
  pageFamilyId = "",
  normalizedInputMode,
  designRestoreRoutingDecision = null,
  legacyReconstructionInput = null,
}) {
  const explicitPageTypeId = normalizeString(pageTypeId);
  const explicitPageFamilyId = normalizeString(pageFamilyId);
  const legacyRoutingDecision =
    normalizedInputMode?.id === "legacy-system-reconstruction"
      ? buildLegacyReconstructionRoutingDecision(legacyReconstructionInput)
      : null;

  if (explicitPageTypeId && explicitPageFamilyId) {
    throw new Error("Pass either pageTypeId or pageFamilyId, not both.");
  }

  if (explicitPageTypeId || explicitPageFamilyId) {
    if (!designRestoreRoutingDecision && !legacyRoutingDecision) {
      return {
        pageTypeId: explicitPageTypeId,
        pageFamilyId: explicitPageFamilyId,
      };
    }

    const routingDecision =
      designRestoreRoutingDecision || legacyRoutingDecision;
    const routingSummary = designRestoreRoutingDecision
      ? describeDesignRestoreRoutingDecision(designRestoreRoutingDecision)
      : describeLegacyReconstructionRoutingDecision(legacyRoutingDecision);
    const selectorKind = normalizeString(routingDecision?.selector?.kind);
    const selectorId = normalizeString(routingDecision?.selector?.id);
    const recommendedPageFamilyId = normalizeString(
      routingDecision?.recommendedPageFamilyId ||
        routingDecision?.recommendedPageFamily,
    );

    if (explicitPageFamilyId) {
      if (
        (selectorKind === "page-family" &&
          selectorId &&
          explicitPageFamilyId !== selectorId) ||
        (recommendedPageFamilyId &&
          explicitPageFamilyId !== recommendedPageFamilyId)
      ) {
        throw new Error(
          `Requested page family "${explicitPageFamilyId}" conflicts with inferred routing. ${routingSummary}`,
        );
      }

      return {
        pageTypeId: "",
        pageFamilyId: explicitPageFamilyId,
      };
    }

    if (
      selectorKind === "page-family" &&
      selectorId === NON_TYPICAL_PAGE_FAMILY
    ) {
      throw new Error(
        `Requested page type "${explicitPageTypeId}" conflicts with inferred routing. ${routingSummary}`,
      );
    }

    if (
      selectorKind === "page-type" &&
      selectorId &&
      explicitPageTypeId !== selectorId
    ) {
      throw new Error(
        `Requested page type "${explicitPageTypeId}" conflicts with inferred routing. ${routingSummary}`,
      );
    }

    return {
      pageTypeId: explicitPageTypeId,
      pageFamilyId: "",
    };
  }

  if (
    !designRestoreRoutingDecision ||
    !isDesignRestoreInputMode(normalizedInputMode?.id)
  ) {
    if (legacyRoutingDecision) {
      if (legacyRoutingDecision.selector?.kind === "page-type") {
        return {
          pageTypeId: legacyRoutingDecision.selector.id,
          pageFamilyId: "",
        };
      }

      if (legacyRoutingDecision.selector?.kind === "page-family") {
        return {
          pageTypeId: "",
          pageFamilyId: legacyRoutingDecision.selector.id,
        };
      }
    }

    throw new Error(
      "Missing page selector. Pass --page-type <id> or --page-family <id>.",
    );
  }

  if (designRestoreRoutingDecision.selector?.kind === "page-type") {
    return {
      pageTypeId: designRestoreRoutingDecision.selector.id,
      pageFamilyId: "",
    };
  }

  if (designRestoreRoutingDecision.selector?.kind === "page-family") {
    return {
      pageTypeId: "",
      pageFamilyId: designRestoreRoutingDecision.selector.id,
    };
  }

  const routingSummary = describeDesignRestoreRoutingDecision(
    designRestoreRoutingDecision,
  );
  throw new Error(
    `Missing page selector. ${
      routingSummary || "Pass --page-type <id> or --page-family <id>."
    }`,
  );
}

function slugifyAdjustmentId(value, index) {
  const base = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  return base || `adjustment-tab-${index + 1}`;
}

function splitSemanticTokens(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function hasAdjustmentSemanticToken(value) {
  const tokens = splitSemanticTokens(value);
  return tokens.some(
    (token) =>
      token === "adjust" ||
      token === "adjustment" ||
      token === "variant" ||
      token === "switch" ||
      token === "tab" ||
      token === "tabs" ||
      token === "local" ||
      token === "segment" ||
      token === "segmented",
  );
}

function hasTabPresentationSignal(value) {
  const text = normalizeString(value);
  if (!text) return false;
  if (/(标签页|页签|切换|分栏)/.test(text)) return true;

  return splitSemanticTokens(text).some(
    (token) =>
      token === "tab" ||
      token === "tabs" ||
      token === "switch" ||
      token === "segment" ||
      token === "segmented",
  );
}

function collectLegacyAdjustmentLabels(legacyFacts = {}) {
  const labels = [];
  const sources = [
    legacyFacts.queryFacts,
    legacyFacts.tableFacts,
    legacyFacts.formFacts,
    legacyFacts.detailFacts,
  ];

  for (const source of sources) {
    for (const item of asArray(source)) {
      if (!isPlainObject(item)) continue;
      labels.push(
        normalizeString(item.label) ||
          normalizeString(item.title) ||
          normalizeString(item.name) ||
          normalizeString(item.key),
      );
    }
  }

  return normalizeStringArray(labels).slice(0, 4);
}

function collectPageAdjustmentLabels({
  confirmedGenerationInput,
  legacyReconstructionInput,
}) {
  const observedModules =
    confirmedGenerationInput?.promptDraft?.observedModules || {};
  const preferred = [];
  const fallback = [];

  for (const [key, value] of Object.entries(observedModules)) {
    if (!Array.isArray(value)) continue;
    if (hasAdjustmentSemanticToken(key)) {
      preferred.push(...value);
      continue;
    }
    fallback.push(...value);
  }

  const screenshotLabels = normalizeStringArray(
    preferred.length > 0 ? preferred : fallback,
  ).slice(0, 4);
  if (screenshotLabels.length > 0) return screenshotLabels;

  return collectLegacyAdjustmentLabels(legacyReconstructionInput?.legacyFacts);
}

function normalizePageAdjustmentObservedModules({
  confirmedGenerationInput,
  legacyReconstructionInput,
}) {
  const observedModules = isPlainObject(
    confirmedGenerationInput?.promptDraft?.observedModules,
  )
    ? confirmedGenerationInput.promptDraft.observedModules
    : {};
  const legacyLabels = collectLegacyAdjustmentLabels(
    legacyReconstructionInput?.legacyFacts,
  );

  return {
    productTypeTabs: normalizeStringArray(observedModules.productTypeTabs),
    formFields: normalizeStringArray(observedModules.formFields),
    primaryActions: normalizeStringArray(observedModules.primaryActions),
    detailTableColumns: normalizeStringArray(
      observedModules.detailTableColumns,
    ),
    fallbackLabels: normalizeStringArray(legacyLabels),
  };
}

function inferPageAdjustmentPresentation({
  pageAdjustmentContract,
  confirmedGenerationInput,
  legacyReconstructionInput,
  observedLabels,
}) {
  const intentText = [
    pageAdjustmentContract?.userAdjustmentIntent || "",
    confirmedGenerationInput?.confirmation?.finalPrompt || "",
    confirmedGenerationInput?.promptDraft?.pageGoal || "",
    legacyReconstructionInput?.confirmation?.finalPrompt || "",
    legacyReconstructionInput?.legacyFacts?.pageGoal || "",
  ].join(" ");

  if (hasTabPresentationSignal(intentText) && observedLabels.length > 0) {
    return "tabs";
  }

  return "info-card";
}

function buildPageAdjustmentViewModel({
  pageAdjustmentContract,
  confirmedGenerationInput,
  legacyReconstructionInput,
}) {
  if (!pageAdjustmentContract) return null;

  const observedModules = normalizePageAdjustmentObservedModules({
    confirmedGenerationInput,
    legacyReconstructionInput,
  });
  const observedLabels = collectPageAdjustmentLabels({
    confirmedGenerationInput,
    legacyReconstructionInput,
  });
  const presentation = inferPageAdjustmentPresentation({
    pageAdjustmentContract,
    confirmedGenerationInput,
    legacyReconstructionInput,
    observedLabels,
  });

  return {
    title: "受控局部改造",
    summary:
      pageAdjustmentContract.userAdjustmentIntent ||
      "当前页面需要在保留基础典型页主体结构的前提下，执行一次受控局部改造。",
    structureSummary: normalizeString(pageAdjustmentContract.structureSummary),
    intentContract: pageAdjustmentContract.intentContract || {
      mustHave: [],
      mustNotAdd: [],
    },
    observedModules,
    observedLabels,
    retainedCharacteristics: normalizeStringArray(
      pageAdjustmentContract.retainedTypicalCharacteristics,
    ).slice(0, 4),
    designSystemConstraints: normalizeStringArray(
      pageAdjustmentContract.designSystemConstraints,
    ).slice(0, 4),
    validationRules: normalizeStringArray(
      pageAdjustmentContract.adjustmentValidationRules,
    ).slice(0, 4),
    presentation,
    tabs:
      presentation === "tabs"
        ? observedLabels.map((label, index) => ({
            id: slugifyAdjustmentId(label, index),
            title: label,
          }))
        : [],
  };
}

function buildPageAdjustmentCoverageSupportDecisions({
  pageAdjustmentContract,
  pageAdjustmentViewModel,
  confirmedGenerationInput,
  legacyReconstructionInput,
}) {
  if (!pageAdjustmentContract) {
    return {
      componentDecision: null,
      tokenDecision: null,
    };
  }

  const observedLabels =
    normalizeStringArray(pageAdjustmentViewModel?.observedLabels).length > 0
      ? normalizeStringArray(pageAdjustmentViewModel?.observedLabels)
      : collectPageAdjustmentLabels({
          confirmedGenerationInput,
          legacyReconstructionInput,
        });
  const observedModules =
    pageAdjustmentViewModel?.observedModules ||
    normalizePageAdjustmentObservedModules({
      confirmedGenerationInput,
      legacyReconstructionInput,
    });

  return {
    componentDecision: {
      decisionSource: "page-adjustment-contract",
      componentPlan: normalizeStringArray([
        "controlled-region:hiui5 local-adjustment workspace",
        observedModules.productTypeTabs.length > 0
          ? "product-type-toggle:hiui5 Tabs"
          : "",
        observedModules.formFields.length > 0
          ? "product-entry-form:local-managed-runtime/pro-edit-page Form"
          : "",
        observedModules.primaryActions.length > 0
          ? "primary-action:hiui5 Button"
          : "",
        observedModules.detailTableColumns.length > 0
          ? "detail-table:hiui5 Table"
          : "",
        ...observedLabels.map((label) => `page-adjustment-label:${label}`),
      ]),
      regionComponentMap: {
        productTypeToggle:
          observedModules.productTypeTabs.length > 0 ? "hiui5 Tabs" : "",
        entryForm:
          observedModules.formFields.length > 0
            ? "local-managed-runtime/pro-edit-page Form"
            : "",
        primaryAction:
          observedModules.primaryActions.length > 0 ? "hiui5 Button" : "",
        detailTable:
          observedModules.detailTableColumns.length > 0 ? "hiui5 Table" : "",
      },
      observedModules,
    },
    tokenDecision: {
      decisionSource: "page-adjustment-contract",
      tokenSources: normalizeStringArray([
        "controlled-region:hiui5 baseline",
        observedModules.productTypeTabs.length > 0
          ? "product-type-toggle:covered-by-component-token hiui5 Tabs"
          : "",
        observedModules.formFields.length > 0
          ? "product-entry-form:covered-by-component-token local-managed-runtime/pro-edit-page Form"
          : "",
        observedModules.primaryActions.length > 0
          ? "primary-action:covered-by-component-token hiui5 Button"
          : "",
        observedModules.detailTableColumns.length > 0
          ? "detail-table:covered-by-component-token hiui5 Table"
          : "",
        "local-adjustment-styles:layout-only spacing/flex/grid/min-height/overflow/section-ordering",
        ...normalizeStringArray(
          pageAdjustmentContract?.designSystemConstraints,
        ),
      ]),
      visualOwnership: normalizeStringArray(
        pageAdjustmentContract?.visualOwnershipPlan,
      ),
    },
  };
}

function normalizeScreenshotEvidence(value) {
  if (!isPlainObject(value)) {
    return {
      screenshotPath: "",
    };
  }

  return {
    screenshotPath: normalizeString(value.screenshotPath),
  };
}

function normalizeRecommendationCandidate(value) {
  return {
    pageType: normalizeString(value?.pageType),
    score: Number.isFinite(value?.score) ? value.score : null,
    reasons: normalizeStringArray(value?.reasons),
  };
}

function normalizePageFamilyRecommendationCandidate(value) {
  return {
    pageFamily: normalizeString(value?.pageFamily),
    score: Number.isFinite(value?.score) ? value.score : null,
    reasons: normalizeStringArray(value?.reasons),
  };
}

function normalizePageTypeRecommendation(value) {
  if (!isPlainObject(value)) {
    return {
      recommended: "",
      candidates: [],
      confidence: "",
      reasons: [],
    };
  }

  return {
    recommended: normalizeString(value.recommended),
    candidates: asArray(value.candidates)
      .slice(0, 3)
      .map((item) => normalizeRecommendationCandidate(item)),
    confidence: normalizeString(value.confidence),
    reasons: normalizeStringArray(value.reasons),
  };
}

function normalizePageFamilyRecommendation(value) {
  if (!isPlainObject(value)) {
    return {
      recommended: "",
      candidates: [],
      confidence: "",
      reasons: [],
    };
  }

  return {
    recommended: normalizeString(value.recommended),
    candidates: asArray(value.candidates)
      .slice(0, 3)
      .map((item) => normalizePageFamilyRecommendationCandidate(item)),
    confidence: normalizeString(value.confidence),
    reasons: normalizeStringArray(value.reasons),
  };
}

function normalizePromptDraft(value) {
  if (!isPlainObject(value)) {
    return {
      titleDraft: "",
      pageGoal: "",
      observedLayout: [],
      observedModules: {},
      unknowns: [],
    };
  }

  return {
    titleDraft: normalizeString(value.titleDraft),
    pageGoal: normalizeString(value.pageGoal),
    observedLayout: normalizeStringArray(value.observedLayout),
    observedModules: isPlainObject(value.observedModules)
      ? value.observedModules
      : {},
    unknowns: normalizeStringArray(value.unknowns),
  };
}

function normalizeConfirmation(value) {
  if (!isPlainObject(value)) {
    return {
      confirmed: false,
      confirmedPageFamily: "",
      confirmedPageType: "",
      finalPrompt: "",
    };
  }

  return {
    confirmed: value.confirmed === true,
    confirmedPageFamily: normalizeString(value.confirmedPageFamily),
    confirmedPageType: normalizeString(value.confirmedPageType),
    finalPrompt: normalizeString(value.finalPrompt),
  };
}

function normalizeBoolean(value) {
  return typeof value === "boolean" ? value : undefined;
}

function normalizeObjectArray(value) {
  return asArray(value)
    .filter((item) => isPlainObject(item))
    .map((item) => ({ ...item }));
}

function normalizePositiveInteger(value) {
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized > 0
    ? normalized
    : undefined;
}

function normalizeDetailSectionField(value) {
  if (!isPlainObject(value)) {
    return {
      label: "",
      key: "",
      colSpan: undefined,
    };
  }

  return {
    label: normalizeString(value.label),
    key: normalizeString(value.key),
    colSpan: normalizePositiveInteger(value.colSpan),
  };
}

function normalizeDetailSectionDateField(value) {
  if (!isPlainObject(value)) {
    return {
      label: "",
      key: "",
    };
  }

  return {
    label: normalizeString(value.label),
    key: normalizeString(value.key),
  };
}

function normalizeDetailSectionColumn(value) {
  if (!isPlainObject(value)) {
    return {
      label: "",
      key: "",
      width: undefined,
    };
  }

  return {
    label: normalizeString(value.label),
    key: normalizeString(value.key),
    width: normalizePositiveInteger(value.width),
  };
}

function normalizeDetailSectionsPayload(payload) {
  const rawSections = Array.isArray(payload)
    ? payload
    : isPlainObject(payload) && Array.isArray(payload.sections)
      ? payload.sections
      : [];

  return rawSections.map((section) => {
    const normalizedKind = isPlainObject(section)
      ? normalizeString(section.kind)
      : "";
    const base = {
      kind: normalizedKind,
      title: isPlainObject(section) ? normalizeString(section.title) : "",
      dataKey: isPlainObject(section) ? normalizeString(section.dataKey) : "",
    };

    if (normalizedKind === "description-group") {
      return {
        ...base,
        fields: Array.isArray(section.fields)
          ? section.fields.map((field) => normalizeDetailSectionField(field))
          : [],
      };
    }

    if (normalizedKind === "summary-cards") {
      return {
        ...base,
        cardTitleKey: isPlainObject(section)
          ? normalizeString(section.cardTitleKey)
          : "",
        metricValueKey: isPlainObject(section)
          ? normalizeString(section.metricValueKey)
          : "",
        metricUnitText: isPlainObject(section)
          ? normalizeString(section.metricUnitText)
          : "",
        metaText: isPlainObject(section)
          ? normalizeString(section.metaText)
          : "",
        dateFields: Array.isArray(section.dateFields)
          ? section.dateFields.map((field) =>
              normalizeDetailSectionDateField(field),
            )
          : [],
      };
    }

    if (normalizedKind === "data-table") {
      return {
        ...base,
        columns: Array.isArray(section.columns)
          ? section.columns.map((column) =>
              normalizeDetailSectionColumn(column),
            )
          : [],
      };
    }

    return base;
  });
}

function validateRequestedDetailSections({ pageTypeId, detailSections }) {
  if (!Array.isArray(detailSections) || detailSections.length === 0) return [];

  const violations = [];
  if (pageTypeId !== "full-page-detail") {
    violations.push("detailSections currently only apply to full-page-detail");
    return violations;
  }

  const allowedKinds = new Set([
    "description-group",
    "summary-cards",
    "data-table",
  ]);
  const seenDataKeys = new Set();
  const seenTitles = new Set();

  if (detailSections[0]?.kind !== "description-group") {
    violations.push(
      "detailSections[0] must be a description-group so the primary detail reading flow remains anchored",
    );
  }

  if (!detailSections.some((section) => section.kind === "description-group")) {
    violations.push(
      "detailSections must include at least one description-group section",
    );
  }

  for (const [index, section] of detailSections.entries()) {
    const prefix = `detailSections[${index}]`;

    if (!allowedKinds.has(section.kind)) {
      violations.push(
        `${prefix}.kind must be one of description-group, summary-cards, data-table`,
      );
      continue;
    }
    if (!section.title) violations.push(`${prefix}.title is required`);
    if (!section.dataKey) {
      violations.push(`${prefix}.dataKey is required`);
    } else {
      if (seenDataKeys.has(section.dataKey))
        violations.push(`${prefix}.dataKey must be unique`);
      seenDataKeys.add(section.dataKey);
    }
    if (section.title) {
      if (seenTitles.has(section.title))
        violations.push(`${prefix}.title must be unique`);
      seenTitles.add(section.title);
    }

    if (section.kind === "description-group") {
      if (!Array.isArray(section.fields) || section.fields.length === 0) {
        violations.push(`${prefix}.fields must be a non-empty array`);
      }
      for (const [fieldIndex, field] of (section.fields ?? []).entries()) {
        if (!field.label)
          violations.push(`${prefix}.fields[${fieldIndex}].label is required`);
        if (!field.key)
          violations.push(`${prefix}.fields[${fieldIndex}].key is required`);
        if (field.colSpan !== undefined && ![1, 2, 3].includes(field.colSpan)) {
          violations.push(
            `${prefix}.fields[${fieldIndex}].colSpan must be 1, 2, or 3`,
          );
        }
      }
      continue;
    }

    if (section.kind === "summary-cards") {
      if (!section.cardTitleKey)
        violations.push(`${prefix}.cardTitleKey is required`);
      if (!section.metricValueKey)
        violations.push(`${prefix}.metricValueKey is required`);
      for (const [fieldIndex, field] of (section.dateFields ?? []).entries()) {
        if (!field.label)
          violations.push(
            `${prefix}.dateFields[${fieldIndex}].label is required`,
          );
        if (!field.key)
          violations.push(
            `${prefix}.dateFields[${fieldIndex}].key is required`,
          );
      }
      continue;
    }

    if (section.kind === "data-table") {
      if (!Array.isArray(section.columns) || section.columns.length === 0) {
        violations.push(`${prefix}.columns must be a non-empty array`);
      }
      for (const [columnIndex, column] of (section.columns ?? []).entries()) {
        if (!column.label)
          violations.push(
            `${prefix}.columns[${columnIndex}].label is required`,
          );
        if (!column.key)
          violations.push(`${prefix}.columns[${columnIndex}].key is required`);
      }
    }
  }

  return violations;
}

function normalizeConfirmedGenerationInput(value) {
  if (!isPlainObject(value)) return null;

  return {
    inputMode: normalizeString(value.inputMode),
    evidence: normalizeScreenshotEvidence(value.evidence),
    pageTypeRecommendation: normalizePageTypeRecommendation(
      value.pageTypeRecommendation,
    ),
    promptDraft: normalizePromptDraft(value.promptDraft),
    confirmation: normalizeConfirmation(value.confirmation),
    nonTypicalConversationOutput: resolveNonTypicalConversationOutput({
      explicitOutput: null,
      confirmedGenerationInput: value,
    }),
  };
}

function normalizeLegacyEvidence(value) {
  if (!isPlainObject(value)) {
    return {
      sourceRoute: "",
      sourceCodePaths: [],
      sourceUrl: "",
      sourceScreenshotPath: "",
      sourceSystemName: "",
    };
  }

  return {
    sourceRoute: normalizeString(value.sourceRoute),
    sourceCodePaths: normalizeStringArray(value.sourceCodePaths),
    sourceUrl: normalizeString(value.sourceUrl),
    sourceScreenshotPath: normalizeString(value.sourceScreenshotPath),
    sourceSystemName: normalizeString(value.sourceSystemName),
  };
}

function normalizeLegacyFacts(value) {
  if (!isPlainObject(value)) {
    return {
      titleDraft: "",
      pageGoal: "",
      layoutFacts: [],
      queryFacts: [],
      tableFacts: [],
      formFacts: [],
      detailFacts: [],
      apiContracts: [],
      interactionContracts: [],
      routeFacts: {},
      permissionFacts: [],
      invariants: [],
      unknowns: [],
    };
  }

  return {
    titleDraft: normalizeString(value.titleDraft),
    pageGoal: normalizeString(value.pageGoal),
    layoutFacts: normalizeStringArray(value.layoutFacts),
    queryFacts: normalizeObjectArray(value.queryFacts),
    tableFacts: normalizeObjectArray(value.tableFacts),
    formFacts: normalizeObjectArray(value.formFacts),
    detailFacts: normalizeObjectArray(value.detailFacts),
    apiContracts: normalizeObjectArray(value.apiContracts),
    interactionContracts: normalizeObjectArray(value.interactionContracts),
    routeFacts: isPlainObject(value.routeFacts) ? { ...value.routeFacts } : {},
    permissionFacts: normalizeStringArray(value.permissionFacts),
    invariants: normalizeStringArray(value.invariants),
    unknowns: normalizeStringArray(value.unknowns),
  };
}

function normalizeLegacySourceMeta(value) {
  if (!isPlainObject(value)) {
    return {
      assemblyMode: "",
      promptMatched: false,
      promptConfidence: "",
      evidenceSummary: [],
      sourceCodePaths: [],
    };
  }

  return {
    assemblyMode: normalizeString(value.assemblyMode),
    promptMatched: normalizeBoolean(value.promptMatched),
    promptConfidence: normalizeString(value.promptConfidence),
    evidenceSummary: normalizeStringArray(value.evidenceSummary).slice(0, 8),
    sourceCodePaths: normalizeStringArray(value.sourceCodePaths).slice(0, 8),
  };
}

function normalizeLegacyReconstructionInput(value) {
  if (!isPlainObject(value)) return null;

  return {
    inputMode: normalizeString(value.inputMode),
    evidence: normalizeLegacyEvidence(value.evidence),
    pageFamilyRecommendation: normalizePageFamilyRecommendation(
      value.pageFamilyRecommendation,
    ),
    pageTypeRecommendation: normalizePageTypeRecommendation(
      value.pageTypeRecommendation,
    ),
    legacyFacts: normalizeLegacyFacts(value.legacyFacts),
    sourceMeta: normalizeLegacySourceMeta(value.sourceMeta),
    confirmation: normalizeConfirmation(value.confirmation),
  };
}

function normalizeMigrationInvariantContract(value) {
  if (!isPlainObject(value)) return null;

  return {
    mustKeepApiShape: normalizeBoolean(value.mustKeepApiShape),
    mustKeepInteractionSemantics: normalizeBoolean(
      value.mustKeepInteractionSemantics,
    ),
    mustKeepPermissionSemantics: normalizeBoolean(
      value.mustKeepPermissionSemantics,
    ),
    mustKeepRouteTargets: normalizeBoolean(value.mustKeepRouteTargets),
    allowedBehaviorDrift: normalizeStringArray(value.allowedBehaviorDrift),
    blockedReasons: normalizeStringArray(value.blockedReasons),
  };
}

function normalizeAnalyticsRefactorField(value) {
  if (!isPlainObject(value)) {
    return {
      label: "",
      key: "",
      semanticRole: "",
      description: "",
    };
  }

  return {
    label:
      normalizeString(value.label) ||
      normalizeString(value.title) ||
      normalizeString(value.name) ||
      normalizeString(value.key),
    key: normalizeString(value.key),
    semanticRole: normalizeString(value.semanticRole),
    description: normalizeString(value.description),
  };
}

function normalizeAnalyticsChartModule(value) {
  if (!isPlainObject(value)) {
    return {
      title: "",
      chartType: "",
      businessQuestion: "",
      priority: "",
      interactionKey: "",
    };
  }

  return {
    title:
      normalizeString(value.title) ||
      normalizeString(value.label) ||
      normalizeString(value.name) ||
      normalizeString(value.key),
    chartType: normalizeString(value.chartType),
    businessQuestion:
      normalizeString(value.businessQuestion) ||
      normalizeString(value.goal) ||
      normalizeString(value.description),
    priority: normalizeString(value.priority),
    interactionKey: normalizeString(value.interactionKey),
  };
}

function normalizeAnalyticsRefactorContract(value) {
  if (!isPlainObject(value)) return null;

  return {
    controlStripFields: asArray(value.controlStripFields)
      .map((item) => normalizeAnalyticsRefactorField(item))
      .filter((item) => item.label || item.key)
      .slice(0, 8),
    summaryMetrics: asArray(value.summaryMetrics)
      .map((item) => normalizeAnalyticsRefactorField(item))
      .filter((item) => item.label || item.key)
      .slice(0, 8),
    chartModules: asArray(value.chartModules)
      .map((item) => normalizeAnalyticsChartModule(item))
      .filter((item) => item.title)
      .slice(0, 8),
    detailTableColumns: asArray(value.detailTableColumns)
      .map((item) => normalizeAnalyticsRefactorField(item))
      .filter((item) => item.label || item.key)
      .slice(0, 10),
    preservedInteractions: normalizeStringArray(
      value.preservedInteractions,
    ).slice(0, 8),
    workspaceInvariant: normalizeString(value.workspaceInvariant),
    chartNarrativeGoal: normalizeString(value.chartNarrativeGoal),
    stopReason: normalizeString(value.stopReason),
  };
}

function buildAutoAnalyticsField(item, index, fallbackLabel, fallbackRole) {
  const label =
    normalizeString(item?.label) ||
    normalizeString(item?.title) ||
    normalizeString(item?.name) ||
    normalizeString(item?.field) ||
    normalizeString(item?.columnKey) ||
    fallbackLabel;
  const key =
    normalizeString(item?.key) ||
    normalizeString(item?.requestParamKey) ||
    normalizeString(item?.field) ||
    normalizeString(item?.columnKey) ||
    slugifyAdjustmentId(label || fallbackLabel, index);

  return {
    label,
    key,
    semanticRole: normalizeString(item?.semanticRole) || fallbackRole,
    description: normalizeString(item?.description),
  };
}

function buildAutoAnalyticsChartModule({ legacyFacts = {} } = {}) {
  const titleDraft = normalizeString(legacyFacts.titleDraft);

  return {
    title: titleDraft ? `${titleDraft}趋势` : "趋势分析",
    chartType: "line",
    businessQuestion:
      normalizeString(legacyFacts.pageGoal) ||
      "查看关键指标变化趋势，并与明细收口保持联动。",
    priority: "primary",
    interactionKey: "legacy-chart-to-detail-table",
  };
}

function maybeAutoAssembleAnalyticsRefactorContract({
  normalizedInputMode,
  pageFamily,
  analyticsRefactorContract,
  legacyReconstructionInput,
}) {
  if (analyticsRefactorContract) return analyticsRefactorContract;
  if (normalizedInputMode?.id !== "legacy-system-reconstruction") return null;
  if (pageFamily !== "analytics-page") return null;

  const legacyFacts = legacyReconstructionInput?.legacyFacts || {};
  const layoutFacts = new Set(normalizeStringArray(legacyFacts.layoutFacts));
  const hasQueryWorkspace = layoutFacts.has("query-filter");
  const hasAnalyticsWorkspace =
    layoutFacts.has("chart-section") ||
    layoutFacts.has("summary-section") ||
    layoutFacts.has("stat-section");
  const hasDetailWorkspace =
    layoutFacts.has("detail-table") || layoutFacts.has("table");

  if (!hasQueryWorkspace || !hasAnalyticsWorkspace || !hasDetailWorkspace) {
    return null;
  }

  const queryFacts = normalizeObjectArray(legacyFacts.queryFacts);
  const tableFacts = normalizeObjectArray(legacyFacts.tableFacts);
  const invariants = normalizeStringArray(legacyFacts.invariants);
  const titleDraft = normalizeString(legacyFacts.titleDraft);
  const pageGoal = normalizeString(legacyFacts.pageGoal);

  const controlStripFields =
    queryFacts.length > 0
      ? queryFacts
          .slice(0, 4)
          .map((item, index) =>
            buildAutoAnalyticsField(
              item,
              index,
              `筛选条件${index + 1}`,
              index === 0 ? "dimension" : "filter",
            ),
          )
      : [buildAutoAnalyticsField({}, 0, "筛选条件", "filter")];

  const summaryMetrics =
    layoutFacts.has("summary-section") || layoutFacts.has("stat-section")
      ? [
          buildAutoAnalyticsField(
            {},
            0,
            titleDraft ? `${titleDraft}核心指标` : "核心指标",
            "headline-metric",
          ),
        ]
      : [];

  const detailTableColumns =
    tableFacts.length > 0
      ? tableFacts
          .slice(0, 4)
          .map((item, index) =>
            buildAutoAnalyticsField(
              item,
              index,
              `明细列${index + 1}`,
              index === 0 ? "primary-dimension" : "dimension",
            ),
          )
      : [];

  const preservedInteractions =
    invariants.length > 0
      ? invariants.slice(0, 4)
      : ["筛选条件与图表、可选明细收口的分析语义保持不变"];

  return {
    controlStripFields,
    summaryMetrics,
    chartModules: [buildAutoAnalyticsChartModule({ legacyFacts })],
    detailTableColumns,
    preservedInteractions,
    workspaceInvariant: titleDraft
      ? `Keep ${titleDraft} metrics and charts inside one whiteBody analytics workspace; add a detail table only when the business needs drill-down records.`
      : "Keep metrics and charts inside one whiteBody analytics workspace; add a detail table only when the business needs drill-down records.",
    chartNarrativeGoal:
      pageGoal ||
      (titleDraft
        ? `让用户先看${titleDraft}趋势；只有在业务需要记录下钻时再进入明细收口。`
        : "让用户先看趋势；只有在业务需要记录下钻时再进入明细收口。"),
    stopReason: "",
  };
}

function buildAnalyticsRefactorViewModel({
  analyticsRefactorContract,
  legacyReconstructionInput,
}) {
  if (!analyticsRefactorContract) return null;

  return {
    title: "旧系统分析页重构约束",
    workspaceInvariant:
      analyticsRefactorContract.workspaceInvariant ||
      "Keep metrics and charts inside one managed analytics workspace; add a detail table only when the business needs drill-down records.",
    chartNarrativeGoal:
      analyticsRefactorContract.chartNarrativeGoal ||
      legacyReconstructionInput?.legacyFacts?.pageGoal ||
      "",
    controlStripFields: analyticsRefactorContract.controlStripFields.map(
      (item, index) => ({
        id: slugifyAdjustmentId(item.label || item.key, index),
        label: item.label || item.key,
        key: item.key,
        semanticRole: item.semanticRole,
        description: item.description,
      }),
    ),
    summaryMetrics: analyticsRefactorContract.summaryMetrics.map(
      (item, index) => ({
        id: slugifyAdjustmentId(item.label || item.key, index),
        label: item.label || item.key,
        key: item.key,
        semanticRole: item.semanticRole,
        description: item.description,
      }),
    ),
    chartModules: analyticsRefactorContract.chartModules.map((item, index) => ({
      id: slugifyAdjustmentId(item.title, index),
      title: item.title,
      chartType: item.chartType,
      businessQuestion: item.businessQuestion,
      priority: item.priority,
      interactionKey: item.interactionKey,
    })),
    detailTableColumns: analyticsRefactorContract.detailTableColumns.map(
      (item, index) => ({
        id: slugifyAdjustmentId(item.label || item.key, index),
        label: item.label || item.key,
        key: item.key,
        semanticRole: item.semanticRole,
        description: item.description,
      }),
    ),
    preservedInteractions: analyticsRefactorContract.preservedInteractions,
    legacyInvariants: normalizeStringArray(
      legacyReconstructionInput?.legacyFacts?.invariants,
    ).slice(0, 8),
  };
}

function validateConfirmedGenerationInput({
  normalizedInputMode,
  confirmedGenerationInput,
  pageFamily,
  pageTypeId,
}) {
  const violations = [];

  if (normalizedInputMode.id !== "prototype-screenshot") {
    if (confirmedGenerationInput) {
      violations.push(
        "confirmedGenerationInput is only allowed when inputMode=prototype-screenshot",
      );
    }
    return violations;
  }

  if (!confirmedGenerationInput) {
    violations.push(
      "prototype-screenshot mode requires confirmedGenerationInput",
    );
    return violations;
  }

  if (confirmedGenerationInput.inputMode !== "prototype-screenshot") {
    violations.push(
      "confirmedGenerationInput.inputMode must equal prototype-screenshot",
    );
  }

  if (!confirmedGenerationInput.evidence.screenshotPath) {
    violations.push(
      "confirmedGenerationInput.evidence.screenshotPath is required",
    );
  } else if (
    !path.isAbsolute(confirmedGenerationInput.evidence.screenshotPath)
  ) {
    violations.push(
      "confirmedGenerationInput.evidence.screenshotPath must be an absolute path",
    );
  }

  if (!confirmedGenerationInput.pageTypeRecommendation.recommended) {
    violations.push(
      "confirmedGenerationInput.pageTypeRecommendation.recommended is required",
    );
  }

  if (confirmedGenerationInput.promptDraft.observedLayout.length === 0) {
    violations.push(
      "confirmedGenerationInput.promptDraft.observedLayout must be a non-empty array",
    );
  }

  if (confirmedGenerationInput.confirmation.confirmed !== true) {
    violations.push(
      "prototype-screenshot mode requires chat confirmation before brief creation",
    );
  }

  if (pageFamily === NON_TYPICAL_PAGE_FAMILY) {
    if (
      confirmedGenerationInput.pageTypeRecommendation.recommended !==
      NON_TYPICAL_PAGE_FAMILY
    ) {
      violations.push(
        `confirmedGenerationInput.pageTypeRecommendation.recommended must equal ${NON_TYPICAL_PAGE_FAMILY}`,
      );
    }

    if (!confirmedGenerationInput.confirmation.confirmedPageFamily) {
      violations.push(
        "confirmedGenerationInput.confirmation.confirmedPageFamily is required",
      );
    } else if (
      confirmedGenerationInput.confirmation.confirmedPageFamily !==
      NON_TYPICAL_PAGE_FAMILY
    ) {
      violations.push(
        `confirmedGenerationInput.confirmation.confirmedPageFamily must equal ${NON_TYPICAL_PAGE_FAMILY}`,
      );
    }

    if (confirmedGenerationInput.confirmation.confirmedPageType) {
      violations.push(
        "confirmedGenerationInput.confirmation.confirmedPageType must stay empty for non-typical-page",
      );
    }

    if (!confirmedGenerationInput.nonTypicalConversationOutput) {
      violations.push(
        "confirmedGenerationInput.nonTypicalConversationOutput is required when confirmedPageFamily=non-typical-page",
      );
    }
  } else if (!confirmedGenerationInput.confirmation.confirmedPageType) {
    violations.push(
      "confirmedGenerationInput.confirmation.confirmedPageType is required",
    );
  } else if (
    confirmedGenerationInput.confirmation.confirmedPageType !== pageTypeId
  ) {
    violations.push(
      `confirmedGenerationInput.confirmation.confirmedPageType must equal pageTypeId ${pageTypeId}`,
    );
  }

  if (!confirmedGenerationInput.confirmation.finalPrompt) {
    violations.push(
      "confirmedGenerationInput.confirmation.finalPrompt is required",
    );
  }

  return violations;
}

function validateLegacyReconstructionInput({
  normalizedInputMode,
  legacyReconstructionInput,
  pageFamily,
  pageTypeId,
}) {
  const violations = [];

  if (normalizedInputMode.id !== "legacy-system-reconstruction") {
    if (legacyReconstructionInput) {
      violations.push(
        "legacyReconstructionInput is only allowed when inputMode=legacy-system-reconstruction",
      );
    }
    return violations;
  }

  if (!legacyReconstructionInput) {
    violations.push(
      "legacy-system-reconstruction mode requires legacyReconstructionInput",
    );
    return violations;
  }

  if (legacyReconstructionInput.inputMode !== "legacy-system-reconstruction") {
    violations.push(
      "legacyReconstructionInput.inputMode must equal legacy-system-reconstruction",
    );
  }

  const evidence = legacyReconstructionInput.evidence;
  const hasEvidence = Boolean(
    evidence.sourceRoute ||
      evidence.sourceUrl ||
      evidence.sourceScreenshotPath ||
      evidence.sourceSystemName ||
      evidence.sourceCodePaths.length > 0,
  );

  if (!hasEvidence) {
    violations.push(
      "legacyReconstructionInput.evidence must include at least one source fact",
    );
  }

  if (
    evidence.sourceScreenshotPath &&
    !path.isAbsolute(evidence.sourceScreenshotPath)
  ) {
    violations.push(
      "legacyReconstructionInput.evidence.sourceScreenshotPath must be an absolute path",
    );
  }

  if (!legacyReconstructionInput.pageFamilyRecommendation.recommended) {
    violations.push(
      "legacyReconstructionInput.pageFamilyRecommendation.recommended is required",
    );
  } else if (
    pageFamily &&
    legacyReconstructionInput.pageFamilyRecommendation.recommended !==
      pageFamily
  ) {
    violations.push(
      `legacyReconstructionInput.pageFamilyRecommendation.recommended must equal resolved pageFamily ${pageFamily}`,
    );
  }

  if (!legacyReconstructionInput.pageTypeRecommendation.recommended) {
    violations.push(
      "legacyReconstructionInput.pageTypeRecommendation.recommended is required",
    );
  } else if (
    legacyReconstructionInput.pageTypeRecommendation.recommended !== pageTypeId
  ) {
    violations.push(
      `legacyReconstructionInput.pageTypeRecommendation.recommended must equal pageTypeId ${pageTypeId}`,
    );
  }

  if (!legacyReconstructionInput.legacyFacts.titleDraft) {
    violations.push(
      "legacyReconstructionInput.legacyFacts.titleDraft is required",
    );
  }

  if (!legacyReconstructionInput.legacyFacts.pageGoal) {
    violations.push(
      "legacyReconstructionInput.legacyFacts.pageGoal is required",
    );
  }

  if (legacyReconstructionInput.legacyFacts.layoutFacts.length === 0) {
    violations.push(
      "legacyReconstructionInput.legacyFacts.layoutFacts must be a non-empty array",
    );
  }

  if (legacyReconstructionInput.legacyFacts.invariants.length === 0) {
    violations.push(
      "legacyReconstructionInput.legacyFacts.invariants must be a non-empty array",
    );
  }

  if (legacyReconstructionInput.confirmation.confirmed !== true) {
    violations.push(
      "legacy-system-reconstruction mode requires chat confirmation before brief creation",
    );
  }

  if (!legacyReconstructionInput.confirmation.confirmedPageFamily) {
    violations.push(
      "legacyReconstructionInput.confirmation.confirmedPageFamily is required",
    );
  } else if (
    pageFamily &&
    legacyReconstructionInput.confirmation.confirmedPageFamily !== pageFamily
  ) {
    violations.push(
      `legacyReconstructionInput.confirmation.confirmedPageFamily must equal resolved pageFamily ${pageFamily}`,
    );
  }

  if (!legacyReconstructionInput.confirmation.confirmedPageType) {
    violations.push(
      "legacyReconstructionInput.confirmation.confirmedPageType is required",
    );
  } else if (
    legacyReconstructionInput.confirmation.confirmedPageType !== pageTypeId
  ) {
    violations.push(
      `legacyReconstructionInput.confirmation.confirmedPageType must equal pageTypeId ${pageTypeId}`,
    );
  }

  if (!legacyReconstructionInput.confirmation.finalPrompt) {
    violations.push(
      "legacyReconstructionInput.confirmation.finalPrompt is required",
    );
  }

  return violations;
}

function validateMigrationInvariantContract({
  normalizedInputMode,
  migrationInvariantContract,
}) {
  const violations = [];

  if (normalizedInputMode.id !== "legacy-system-reconstruction") {
    if (migrationInvariantContract) {
      violations.push(
        "migrationInvariantContract is only allowed when inputMode=legacy-system-reconstruction",
      );
    }
    return violations;
  }

  if (!migrationInvariantContract) {
    violations.push(
      "legacy-system-reconstruction mode requires migrationInvariantContract",
    );
    return violations;
  }

  for (const field of [
    "mustKeepApiShape",
    "mustKeepInteractionSemantics",
    "mustKeepPermissionSemantics",
    "mustKeepRouteTargets",
  ]) {
    if (typeof migrationInvariantContract[field] !== "boolean") {
      violations.push(`migrationInvariantContract.${field} must be a boolean`);
    }
  }

  if (migrationInvariantContract.blockedReasons.length > 0) {
    violations.push(
      `migrationInvariantContract.blockedReasons blocks generation: ${migrationInvariantContract.blockedReasons.join(
        ", ",
      )}`,
    );
  }

  return violations;
}

function validateAnalyticsRefactorContract({
  normalizedInputMode,
  pageFamily,
  analyticsRefactorContract,
}) {
  const violations = [];
  const isLegacyReconstruction =
    normalizedInputMode.id === "legacy-system-reconstruction";
  const isAnalyticsPage = pageFamily === "analytics-page";

  if (!isAnalyticsPage) {
    if (analyticsRefactorContract) {
      violations.push(
        "analyticsRefactorContract is only allowed when resolved pageFamily=analytics-page",
      );
    }
    return violations;
  }

  if (!isLegacyReconstruction) {
    if (analyticsRefactorContract) {
      violations.push(
        "analyticsRefactorContract is only allowed when inputMode=legacy-system-reconstruction",
      );
    }
    return violations;
  }

  if (!analyticsRefactorContract) {
    violations.push(
      "analytics-page legacy-system-reconstruction mode requires analyticsRefactorContract",
    );
    return violations;
  }

  if (!analyticsRefactorContract.workspaceInvariant) {
    violations.push("analyticsRefactorContract.workspaceInvariant is required");
  }

  if (analyticsRefactorContract.controlStripFields.length === 0) {
    violations.push(
      "analyticsRefactorContract.controlStripFields must be a non-empty array",
    );
  }

  if (analyticsRefactorContract.chartModules.length === 0) {
    violations.push(
      "analyticsRefactorContract.chartModules must be a non-empty array",
    );
  }

  if (analyticsRefactorContract.preservedInteractions.length === 0) {
    violations.push(
      "analyticsRefactorContract.preservedInteractions must be a non-empty array",
    );
  }

  if (analyticsRefactorContract.stopReason) {
    violations.push(
      `analyticsRefactorContract.stopReason blocks generation: ${analyticsRefactorContract.stopReason}`,
    );
  }

  return violations;
}

async function parseJsonInput(rawInput, { targetRoot }) {
  if (!rawInput) return { value: null, source: "" };
  if (isPlainObject(rawInput))
    return { value: rawInput, source: "inline-object" };
  if (Array.isArray(rawInput))
    return { value: rawInput, source: "inline-array" };

  const normalizedInput = normalizeString(rawInput);
  if (!normalizedInput) return { value: null, source: "" };

  if (normalizedInput.startsWith("{") || normalizedInput.startsWith("[")) {
    return {
      value: JSON.parse(normalizedInput),
      source: "inline-json",
    };
  }

  const absolutePath = path.isAbsolute(normalizedInput)
    ? normalizedInput
    : path.resolve(targetRoot, normalizedInput);
  const raw = await fs.readFile(absolutePath, "utf8");

  return {
    value: JSON.parse(raw),
    source: absolutePath,
  };
}

async function loadPageAdjustmentContractSpec(skillRoot) {
  const specPath = path.join(
    skillRoot,
    "docs/generation/page-variant-contract.json",
  );
  const spec = JSON.parse(await fs.readFile(specPath, "utf8"));

  return { specPath, spec };
}

function normalizePageAdjustmentContractPayload(payload) {
  if (!isPlainObject(payload)) return null;

  return {
    basePageType: normalizeString(payload.basePageType),
    retainedTypicalCharacteristics: normalizeStringArray(
      payload.retainedTypicalCharacteristics,
    ),
    userAdjustmentIntent: normalizeString(payload.userAdjustmentIntent),
    structureSummary: normalizeString(payload.structureSummary),
    intentContract: normalizeIntentContractPayload(payload.intentContract),
    allowedRegions: normalizeStringArray(payload.allowedRegions),
    forbiddenRegions: normalizeStringArray(payload.forbiddenRegions),
    insertPositionRule: normalizeString(payload.insertPositionRule),
    componentCompositionPlan: normalizeStringArray(
      payload.componentCompositionPlan,
    ),
    visualOwnershipPlan: normalizeStringArray(payload.visualOwnershipPlan),
    forbiddenPrimitiveSemantics: normalizeStringArray(
      payload.forbiddenPrimitiveSemantics,
    ),
    designSystemConstraints: normalizeStringArray(
      payload.designSystemConstraints,
    ),
    layoutPreservationRule: normalizeString(payload.layoutPreservationRule),
    adjustmentValidationRules: normalizeStringArray(
      payload.adjustmentValidationRules ?? payload.variantValidationRules,
    ),
    stopReason: normalizeString(payload.stopReason),
  };
}

async function resolvePageAdjustmentDecision({
  skillRoot,
  targetRoot,
  pageType,
  workflow,
  pageAdjustmentContract,
}) {
  const { specPath, spec } = await loadPageAdjustmentContractSpec(skillRoot);
  const supported = workflow.replaceBusinessSlotsByDefault !== false;

  if (!pageAdjustmentContract) {
    return {
      status: "not-requested",
      supported,
      source: "",
      contract: null,
      specPath,
      specVersion: spec.version || 1,
      validation: {
        status: "not-requested",
        violations: [],
      },
    };
  }

  const parsedInput = await parseJsonInput(pageAdjustmentContract, {
    targetRoot,
  });
  const contract = normalizePageAdjustmentContractPayload(parsedInput.value);
  const violations = [];

  if (!supported) {
    violations.push(
      `${pageType.id}: pageAdjustmentContract currently only applies to template-based typical pages`,
    );
  }

  if (!contract) {
    violations.push(
      `${pageType.id}: pageAdjustmentContract must be a JSON object`,
    );
  } else {
    if (!contract.basePageType)
      violations.push(
        `${pageType.id}: pageAdjustmentContract.basePageType is required`,
      );
    if (contract.basePageType && contract.basePageType !== pageType.id) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.basePageType must equal current pageType id ${pageType.id}`,
      );
    }
    if (contract.retainedTypicalCharacteristics.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.retainedTypicalCharacteristics is required`,
      );
    }
    if (!contract.userAdjustmentIntent) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.userAdjustmentIntent is required`,
      );
    }
    if (!contract.structureSummary) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.structureSummary is required`,
      );
    }
    if (contract.intentContract.mustHave.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.intentContract.mustHave is required`,
      );
    }
    if (contract.intentContract.mustNotAdd.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.intentContract.mustNotAdd is required`,
      );
    }
    if (contract.allowedRegions.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.allowedRegions is required`,
      );
    }
    if (contract.forbiddenRegions.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.forbiddenRegions is required`,
      );
    }
    if (!contract.insertPositionRule) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.insertPositionRule is required`,
      );
    }
    if (contract.componentCompositionPlan.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.componentCompositionPlan is required`,
      );
    }
    if (contract.visualOwnershipPlan.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.visualOwnershipPlan is required`,
      );
    }
    if (contract.forbiddenPrimitiveSemantics.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.forbiddenPrimitiveSemantics is required`,
      );
    }
    if (contract.designSystemConstraints.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.designSystemConstraints is required`,
      );
    }
    if (!contract.layoutPreservationRule) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.layoutPreservationRule is required`,
      );
    }
    if (contract.adjustmentValidationRules.length === 0) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.adjustmentValidationRules is required`,
      );
    }
    if (contract.stopReason) {
      violations.push(
        `${pageType.id}: pageAdjustmentContract.stopReason blocks generation: ${contract.stopReason}`,
      );
    }
  }

  return {
    status: violations.length > 0 ? "invalid" : "ready",
    supported,
    source: parsedInput.source,
    contract,
    specPath,
    specVersion: spec.version || 1,
    validation: {
      status: violations.length > 0 ? "fail" : "pass",
      violations,
      requiredBriefFields: spec.decisionContract?.requiredBriefFields ?? [],
    },
  };
}

function normalizeRelativePath(input) {
  return String(input || "")
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/");
}

function rehydrateFormalNavigationFromProjectHostContract(
  projectHostContract = {},
) {
  if (!isPlainObject(projectHostContract)) return null;
  const formalNavigation = projectHostContract?.formalNavigation;
  return isPlainObject(formalNavigation) ? cloneJson(formalNavigation) : null;
}

function formatProjectHostContractDriftPaths(driftedPaths = []) {
  if (!Array.isArray(driftedPaths) || driftedPaths.length === 0) return "";

  return driftedPaths
    .map((item) => `${item.label} ${item.path}`)
    .filter(Boolean)
    .join(", ");
}

function buildProjectHostContractConsumptionBlockReason({
  targetRoot,
  driftedPaths = [],
  missingConfirmedMountPoint = false,
  missingProjectEntryMountCapability = false,
  missingExecutionContract = false,
} = {}) {
  const contractPath = getProjectHostContractPath(targetRoot);
  const driftedPathSummary = formatProjectHostContractDriftPaths(driftedPaths);

  if (driftedPathSummary) {
    return (
      `Project host contract at ${contractPath} references missing project paths: ${driftedPathSummary}. ` +
      "Downstream planning stays contract-first and does not rerun main-path navigation scanning. " +
      "Run typical-page:preflight again so hiui-design can refresh the project-scoped host contract before planning or writing page code."
    );
  }

  if (missingConfirmedMountPoint) {
    return (
      `Project host contract at ${contractPath} no longer confirms any writable navigation mount point. ` +
      "Downstream planning stays contract-first and does not rerun main-path navigation scanning. " +
      "Run typical-page:preflight again so hiui-design can refresh the project-scoped host contract before planning or writing page code."
    );
  }

  if (missingProjectEntryMountCapability) {
    return (
      `Project host contract at ${contractPath} is missing projectEntryMountCapability facts for the real app entry mount. ` +
      "Downstream planning stays contract-first and does not rerun main-path navigation scanning. " +
      "Run typical-page:preflight again so hiui-design can refresh the project-scoped host contract before planning or writing page code."
    );
  }

  if (missingExecutionContract) {
    return (
      `Project host contract at ${contractPath} is missing executionContract facts for the project-scoped mount mechanism summary. ` +
      "Downstream planning stays contract-first and does not rerun main-path navigation scanning. " +
      "Run typical-page:preflight again so hiui-design can refresh the project-scoped host contract before planning or writing page code."
    );
  }

  return (
    `Project host contract at ${contractPath} is no longer consumable by downstream generation. ` +
    "Run typical-page:preflight again so hiui-design can refresh the project-scoped host contract before planning or writing page code."
  );
}

function allowsDeferredNavigationMount(projectHostContract = {}) {
  if (!isPlainObject(projectHostContract)) return false;

  const formalNavigation =
    rehydrateFormalNavigationFromProjectHostContract(projectHostContract);
  if (!isPlainObject(formalNavigation)) return false;

  const navigationDecision = resolveNavigationDecision({
    resolvedMode: normalizeString(projectHostContract?.mode),
    hostProfile: projectHostContract?.hostProfile || {},
    formalNavigation,
  });
  const navigationMountDecision = buildNavigationMountDecision({
    navigationDecision,
  });

  return (
    navigationMountDecision?.action === "ask-user" ||
    navigationMountDecision?.action === "create-first-formal-shell"
  );
}

async function validateRehydratedFormalNavigation(
  targetRoot,
  projectHostContract = null,
) {
  const formalNavigation =
    rehydrateFormalNavigationFromProjectHostContract(projectHostContract);
  const projectEntryMountCapability =
    rehydrateProjectEntryMountCapabilityFromProjectHostContract(
      projectHostContract,
    );
  const executionContract = isPlainObject(
    projectHostContract?.executionContract,
  )
    ? cloneJson(projectHostContract.executionContract)
    : null;
  if (!isPlainObject(formalNavigation)) {
    return {
      status: "invalid",
      formalNavigation: null,
      blockReason: buildProjectHostContractConsumptionBlockReason({
        targetRoot,
        missingConfirmedMountPoint: true,
      }),
    };
  }

  if (!projectEntryMountCapability) {
    return {
      status: "invalid",
      formalNavigation: null,
      blockReason: buildProjectHostContractConsumptionBlockReason({
        targetRoot,
        missingProjectEntryMountCapability: true,
      }),
    };
  }

  if (!executionContract) {
    return {
      status: "invalid",
      formalNavigation: null,
      blockReason: buildProjectHostContractConsumptionBlockReason({
        targetRoot,
        missingExecutionContract: true,
      }),
    };
  }

  const next = cloneJson(formalNavigation);
  const confirmedPathEntries = [
    ["formal navigation registry", next.formalNavigationRegistryPath],
    ["selected business entry", next.selectedBusinessEntryPath],
    ["selected legacy mount entry", next.selectedLegacyMountEntryPath],
    ["selected publish entry", next.selectedPublishEntryPath],
    ["implicit feature registry", next.implicitFeatureRegistryPath],
  ];
  const driftedPaths = [];

  for (const [label, rawPath] of confirmedPathEntries) {
    const candidatePath = normalizeRelativePath(rawPath || "");
    if (!candidatePath) continue;
    if (await pathExists(path.join(targetRoot, candidatePath))) continue;
    driftedPaths.push({
      label,
      path: candidatePath,
    });
  }

  const selectedBusinessEntryPath = normalizeRelativePath(
    next.selectedBusinessEntryPath || "",
  );
  const selectedLegacyMountEntryPath = normalizeRelativePath(
    next.selectedLegacyMountEntryPath || "",
  );
  const selectedPublishEntryPath = normalizeRelativePath(
    next.selectedPublishEntryPath || "",
  );
  const hasConfirmedMountPoint =
    next.formalNavigationRegistryExists === true ||
    Boolean(selectedBusinessEntryPath) ||
    Boolean(selectedLegacyMountEntryPath) ||
    Boolean(selectedPublishEntryPath) ||
    Boolean(normalizeRelativePath(next.implicitFeatureRegistryPath || ""));
  const missingConfirmedMountPoint =
    !hasConfirmedMountPoint &&
    !allowsDeferredNavigationMount(projectHostContract);

  if (driftedPaths.length > 0 || missingConfirmedMountPoint) {
    return {
      status: "invalid",
      formalNavigation: null,
      blockReason: buildProjectHostContractConsumptionBlockReason({
        targetRoot,
        driftedPaths,
        missingConfirmedMountPoint,
      }),
    };
  }

  const legacyBusinessEntryCandidates = Array.isArray(
    next.businessEntryEvidence,
  )
    ? next.businessEntryEvidence.filter((item) => {
        const kind = normalizeString(item?.kind);
        return kind === "window.addPage" || kind === "openNewPage";
      })
    : [];
  if (
    next.formalNavigationRegistryExists !== true &&
    !normalizeRelativePath(next.selectedBusinessEntryPath || "") &&
    !normalizeRelativePath(next.selectedPublishEntryPath || "") &&
    legacyBusinessEntryCandidates.length > 1
  ) {
    next.businessEntrySelectionBlocked = true;
    next.businessEntrySelectionBlockReason =
      next.businessEntrySelectionBlockReason ||
      "Business entry evidence was found, but no single writable entry could be selected with enough confidence.";
  }

  return {
    status: "ready",
    formalNavigation: next,
    blockReason: "",
  };
}

function buildProjectHostContractSummary({
  targetRoot,
  projectHostContract = null,
  pageTaskGate = null,
  forcedStatus = "",
} = {}) {
  const pageTaskGateStatus = normalizeString(pageTaskGate?.status);
  const contractPath = getProjectHostContractPath(targetRoot);
  const formalNavigation =
    rehydrateFormalNavigationFromProjectHostContract(projectHostContract);
  const required = pageTaskGateStatus === "ready-to-generate";
  const status =
    normalizeString(forcedStatus) ||
    (!isPlainObject(projectHostContract)
      ? required
        ? "missing"
        : "deferred-until-page-task-ready"
      : !formalNavigation
        ? "invalid"
        : "ready");

  return {
    required,
    status,
    path: contractPath,
    schema: normalizeString(projectHostContract?.schema),
    hostFamily: normalizeString(projectHostContract?.hostFamily),
    publishMechanism: normalizeString(projectHostContract?.publishMechanism),
    defaultBusinessPageDir: normalizeRelativePath(
      projectHostContract?.defaultBusinessPageDir || "",
    ),
    generatedAt: normalizeString(projectHostContract?.generatedAt),
    fingerprintSource: normalizeString(
      projectHostContract?.fingerprint?.source,
    ),
    fingerprintValue: normalizeString(projectHostContract?.fingerprint?.value),
    evidenceFiles: normalizeStringArray(projectHostContract?.evidenceFiles),
    executionContractKind: normalizeString(
      projectHostContract?.executionContract?.kind,
    ),
    executionContractConfirmationStatus: normalizeString(
      projectHostContract?.executionContract?.confirmationStatus,
    ),
    hostExecutionAdapterKind: normalizeString(
      projectHostContract?.hostExecutionAdapter?.kind,
    ),
    formalNavigationReady: Boolean(formalNavigation),
    pageTaskGateStatus,
    consumptionPolicy: required
      ? "contract-first-no-main-path-rescan"
      : "deferred-until-page-task-ready",
  };
}

function isPathInsideRelativeRoot(targetPath, rootPath) {
  const normalizedTarget = normalizeRelativePath(targetPath);
  const normalizedRoot = normalizeRelativePath(rootPath);
  if (!normalizedTarget || !normalizedRoot) return false;
  return (
    normalizedTarget === normalizedRoot ||
    normalizedTarget.startsWith(`${normalizedRoot}/`)
  );
}

function isAbsolutePathInsideTargetRoot(targetRoot, candidatePath) {
  const relative = path.relative(targetRoot, candidatePath);
  return Boolean(relative)
    ? !relative.startsWith("..") && !path.isAbsolute(relative)
    : true;
}

function slugifyTitleSegment(input) {
  const asciiOnly = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return asciiOnly;
}

function normalizeWorkflowDefaultFlow(defaultFlow) {
  return defaultFlow || "official-template-copy-and-replace-business-slots";
}

function resolveGenerationPath({
  workflow,
  pageAdjustmentDecision,
  pageFamilyContract,
}) {
  if (pageAdjustmentDecision?.contract) {
    return {
      id: "base-template-local-adjustment",
      label: "基础模板上的局部改造",
      category: "typical-page-local-adjustment",
      reason:
        "Base page type is explicit, most typical-page characteristics are retained, and the request should be implemented as a controlled local adjustment on top of the official template.",
    };
  }

  if (workflow?.replaceBusinessSlotsByDefault !== false) {
    return {
      id: "standard-template-direct-output",
      label: "标准模板直出",
      category: "template-direct-output",
      reason:
        "The official template already covers the page shape, so generation can remain inside managed business-slot replacement.",
    };
  }

  return {
    id: "independent-workflow-generation",
    label: "独立工作流生成",
    category: pageFamilyContract.independentWorkflowCategory,
    reason:
      "This page type relies on a dedicated workflow instead of template-only business-slot replacement.",
  };
}

function validatePageFamilyExecutionSupport({
  normalizedInputMode,
  pageFamilyContract,
  workflow,
  pageAdjustmentContract,
}) {
  const violations = [];

  if (
    pageFamilyContract.supportsBusinessSlotReplacement === false &&
    workflow.replaceBusinessSlotsByDefault !== false
  ) {
    violations.push(
      `${pageFamilyContract.id} must keep replaceBusinessSlotsByDefault=false`,
    );
  }

  if (
    pageAdjustmentContract &&
    pageFamilyContract.supportsLocalAdjustment === false
  ) {
    violations.push(
      `${pageFamilyContract.id} does not support pageAdjustmentContract`,
    );
  }

  if (
    pageFamilyContract.legacyRefactorContractMode ===
      "family-specific-contract" &&
    normalizedInputMode.id === "legacy-system-reconstruction"
  ) {
    violations.push(
      `${pageFamilyContract.id} legacy-system-reconstruction requires a future family-specific refactor contract before generation is enabled`,
    );
  }

  return violations;
}

function buildDefaultBusinessPageLeaf({ pageTypeId, routePath, title }) {
  const normalizedRoutePath = normalizeRelativePath(routePath);
  if (normalizedRoutePath) return normalizedRoutePath;

  const titleSlug = slugifyTitleSegment(title);
  if (titleSlug) return titleSlug;

  return normalizeRelativePath(pageTypeId || "page");
}

const EXISTING_SYSTEM_BUSINESS_ROOT_CANDIDATES = new Set([
  "src/views",
  "src/pages",
]);

function getBusinessRootCandidate(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized) return "";

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length < 3 || segments[0] !== "src") return "";

  const root = `${segments[0]}/${segments[1]}`;
  return EXISTING_SYSTEM_BUSINESS_ROOT_CANDIDATES.has(root) ? root : "";
}

function inferExistingSystemBusinessPageDir({
  rawDest = "",
  formalNavigation = {},
} = {}) {
  const destRoot = getBusinessRootCandidate(rawDest);
  const selectedLegacyMountEntryRoot = getBusinessRootCandidate(
    formalNavigation?.selectedLegacyMountEntryPath || "",
  );
  const selectedBusinessEntryRoot = getBusinessRootCandidate(
    formalNavigation?.selectedBusinessEntryPath || "",
  );
  const evidenceRoots = unique(
    (Array.isArray(formalNavigation?.businessEntryEvidence)
      ? formalNavigation.businessEntryEvidence.flatMap((item) => [
          getBusinessRootCandidate(item?.sourcePath || ""),
          getBusinessRootCandidate(item?.entryPath || ""),
          getBusinessRootCandidate(item?.path || ""),
          getBusinessRootCandidate(item?.featureBaseDir || ""),
        ])
      : []
    ).filter(Boolean),
  );
  const inferredBusinessEntryRoot =
    selectedLegacyMountEntryRoot ||
    selectedBusinessEntryRoot ||
    evidenceRoots[0] ||
    "";

  if (
    destRoot &&
    inferredBusinessEntryRoot &&
    destRoot === inferredBusinessEntryRoot
  ) {
    return destRoot;
  }

  if (inferredBusinessEntryRoot) {
    return inferredBusinessEntryRoot;
  }

  return "";
}

function getSourceRootCandidate(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized) return "";

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length < 3 || segments[0] !== "src") return "";

  const root = `${segments[0]}/${segments[1]}`;
  return RELATED_PAGE_SUPPORTED_BUSINESS_ROOT_CANDIDATES.has(root) ? root : "";
}

function buildEmptyOutputTargetEvidence() {
  return {
    selectedSource: "none",
    rawDest: "",
    targetBusinessPathSource: "derived-default-dir",
    derivedDefaultBusinessPageDir: "",
    navigationContractDerivedDir: "",
    relatedPagePath: "",
    relatedPageAccepted: false,
    relatedPageDir: "",
    relatedPageRejectedReasons: [],
    implicitFeatureBaseDir: "",
    policyDefaultBusinessPageDir: "",
  };
}

function buildOutputTargetEvidence({
  rawDest = "",
  defaultBusinessPageDir = "",
  contractDefaultBusinessPageDir = "",
  navigationContractDerivedDir = "",
  navigationDerivedSource = "",
  relatedPageEvidence = {},
  implicitFeatureBaseDir = "",
  policyDefaultBusinessPageDir = "",
} = {}) {
  const normalizedRawDest = normalizeRelativePath(rawDest);
  const normalizedDefaultBusinessPageDir = normalizeRelativePath(
    defaultBusinessPageDir,
  );
  const normalizedContractDefaultBusinessPageDir = normalizeRelativePath(
    contractDefaultBusinessPageDir,
  );
  const normalizedNavigationContractDerivedDir = normalizeRelativePath(
    navigationContractDerivedDir,
  );
  const normalizedNavigationDerivedSource = normalizeString(
    navigationDerivedSource,
  );
  const normalizedImplicitFeatureBaseDir = normalizeRelativePath(
    implicitFeatureBaseDir,
  );
  const normalizedPolicyDefaultBusinessPageDir = normalizeRelativePath(
    policyDefaultBusinessPageDir,
  );
  const normalizedRelatedPagePath = normalizeRelativePath(
    relatedPageEvidence?.normalizedPath || "",
  );
  const normalizedRelatedPageDir = normalizeRelativePath(
    relatedPageEvidence?.derivedBusinessPageDir || "",
  );
  const relatedPageAccepted = relatedPageEvidence?.accepted === true;
  const relatedPageSource = normalizeString(relatedPageEvidence?.source || "");

  let selectedSource = "none";
  if (normalizedNavigationContractDerivedDir) {
    selectedSource =
      normalizedNavigationDerivedSource === "navigation-mount-contract"
        ? "navigation-mount-contract"
        : "legacy-business-entry";
  } else if (normalizedContractDefaultBusinessPageDir) {
    selectedSource = "project-host-contract";
  } else if (relatedPageAccepted && normalizedRelatedPageDir) {
    selectedSource = "related-page-path";
  } else if (normalizedImplicitFeatureBaseDir) {
    selectedSource = "implicit-feature-base-dir";
  } else if (normalizedPolicyDefaultBusinessPageDir) {
    selectedSource = "generation-target-policy";
  }

  return {
    selectedSource,
    rawDest: normalizedRawDest,
    targetBusinessPathSource: normalizedRawDest
      ? "raw-dest"
      : "derived-default-dir",
    derivedDefaultBusinessPageDir: normalizedDefaultBusinessPageDir,
    projectHostContractDefaultBusinessPageDir:
      normalizedContractDefaultBusinessPageDir,
    navigationContractDerivedDir: normalizedNavigationContractDerivedDir,
    relatedPagePath: normalizedRelatedPagePath,
    relatedPageAccepted,
    relatedPageDir: normalizedRelatedPageDir,
    relatedPageSource,
    relatedPageRejectedReasons: Array.isArray(
      relatedPageEvidence?.rejectedReasons,
    )
      ? relatedPageEvidence.rejectedReasons
          .map((item) => normalizeString(item))
          .filter(Boolean)
      : [],
    implicitFeatureBaseDir: normalizedImplicitFeatureBaseDir,
    policyDefaultBusinessPageDir: normalizedPolicyDefaultBusinessPageDir,
  };
}

async function resolveRelatedPagePathEvidence({
  targetRoot,
  relatedPagePath = "",
} = {}) {
  const normalizedPath = normalizeRelativePath(relatedPagePath);
  const evidence = {
    provided: Boolean(normalizedPath),
    normalizedPath,
    accepted: false,
    derivedBusinessPageDir: "",
    rejectedReasons: [],
  };

  if (!normalizedPath) {
    return evidence;
  }

  const absolutePath = path.resolve(targetRoot, normalizedPath);
  if (!isAbsolutePathInsideTargetRoot(targetRoot, absolutePath)) {
    evidence.rejectedReasons.push("related-page-path-outside-target-root");
    return evidence;
  }

  if (!(await isReadableFile(absolutePath))) {
    evidence.rejectedReasons.push("related-page-file-not-found");
    return evidence;
  }

  const fileName = path.posix.basename(normalizedPath);
  if (!RELATED_PAGE_SUPPORTED_ENTRY_FILE_PATTERN.test(fileName)) {
    evidence.rejectedReasons.push("related-page-path-unsupported-file-name");
    return evidence;
  }

  if (
    NON_INHERITABLE_PAGE_DIR_PREFIXES.some((prefix) =>
      isPathInsideRelativeRoot(normalizedPath, prefix),
    )
  ) {
    evidence.rejectedReasons.push("related-page-dir-is-non-inheritable");
    return evidence;
  }

  const relatedPageRootCandidate = getSourceRootCandidate(normalizedPath);
  if (!relatedPageRootCandidate) {
    evidence.rejectedReasons.push("related-page-path-unsupported-root");
    return evidence;
  }

  evidence.accepted = true;
  evidence.derivedBusinessPageDir =
    getBusinessRootCandidate(normalizedPath) || relatedPageRootCandidate;

  return evidence;
}

function buildCurrentPageRelationTokens({
  routePath = "",
  title = "",
  targetBusinessPath = "",
} = {}) {
  const normalizedTargetBusinessPath =
    normalizeRelativePath(targetBusinessPath);
  const currentPageDir = normalizedTargetBusinessPath
    ? normalizeRelativePath(path.posix.dirname(normalizedTargetBusinessPath))
    : "";
  const currentPageLeaf = normalizedTargetBusinessPath
    ? normalizeRelativePath(path.posix.basename(normalizedTargetBusinessPath))
    : "";

  return unique([
    ...tokenizeBusinessEntryText(routePath),
    ...tokenizeBusinessEntryText(title),
    ...tokenizeBusinessEntryText(currentPageDir),
    ...tokenizeBusinessEntryText(currentPageLeaf),
  ]);
}

function isLegacyRelatedParentEntryKind(kind = "") {
  return kind === "window.addPage" || kind === "openNewPage";
}

async function resolveModulePrimaryEntryPath(targetRoot, moduleDir = "") {
  const normalizedModuleDir = normalizeRelativePath(moduleDir);
  if (!normalizedModuleDir) return "";

  for (const fileName of [
    "index.tsx",
    "index.jsx",
    "index.ts",
    "index.js",
    "page.tsx",
    "page.jsx",
  ]) {
    const candidatePath = normalizeRelativePath(
      path.posix.join(normalizedModuleDir, fileName),
    );
    if (await isReadableFile(path.join(targetRoot, candidatePath))) {
      return candidatePath;
    }
  }

  return "";
}

function scoreRelatedParentEntryEvidence(
  item,
  {
    routePath = "",
    title = "",
    targetBusinessPath = "",
    candidateEntryPath = "",
  } = {},
) {
  if (!isLegacyRelatedParentEntryKind(normalizeString(item?.kind))) {
    return {
      score: 0,
      sharedTokenCount: 0,
      exactRouteMatch: false,
      evidence: [],
    };
  }

  if (
    normalizeRelativePath(item?.path) !==
    normalizeRelativePath(candidateEntryPath)
  ) {
    return {
      score: 0,
      sharedTokenCount: 0,
      exactRouteMatch: false,
      evidence: [],
    };
  }

  const normalizedRoutePath = normalizeString(routePath);
  const pageTokens = buildCurrentPageRelationTokens({
    routePath,
    title,
    targetBusinessPath,
  });
  const evidenceTokens = unique([
    ...normalizeStringArray(item?.routeTokens),
    ...normalizeStringArray(item?.titleTokens),
    ...normalizeStringArray(item?.nameTokens),
    ...tokenizeBusinessEntryText(item?.routePath),
    ...tokenizeBusinessEntryText(item?.title),
    ...tokenizeBusinessEntryText(item?.name),
  ]);

  let score = 0;
  const evidence = [];
  const exactRouteMatch =
    Boolean(normalizedRoutePath) &&
    normalizeString(item?.routePath) === normalizedRoutePath;

  if (exactRouteMatch) {
    score += 1200;
    evidence.push(`matched-route-path:${normalizedRoutePath}`);
  }

  const sharedTokenCount = countSharedTokens(pageTokens, evidenceTokens);
  if (sharedTokenCount > 0) {
    score += sharedTokenCount * 120;
    evidence.push(`shared-page-tokens:${sharedTokenCount}`);
  }

  if (normalizeRelativePath(candidateEntryPath).endsWith("/index.tsx")) {
    score += 60;
    evidence.push("parent-entry:index.tsx");
  } else if (normalizeRelativePath(candidateEntryPath).includes("/index.")) {
    score += 40;
    evidence.push("parent-entry:index.*");
  }

  return {
    score,
    sharedTokenCount,
    exactRouteMatch,
    evidence,
  };
}

async function inferRelatedPagePathFromParentEntryEvidence({
  targetRoot,
  formalNavigation = {},
  routePath = "",
  title = "",
  targetBusinessPath = "",
} = {}) {
  const normalizedTargetBusinessPath =
    normalizeRelativePath(targetBusinessPath);
  if (!normalizedTargetBusinessPath) return null;

  const parentModuleDir = normalizeRelativePath(
    path.posix.dirname(normalizedTargetBusinessPath),
  );
  if (!parentModuleDir) return null;

  const candidateEntryPath = await resolveModulePrimaryEntryPath(
    targetRoot,
    parentModuleDir,
  );
  if (
    !candidateEntryPath ||
    candidateEntryPath === normalizedTargetBusinessPath
  ) {
    return null;
  }

  let evidenceItems = asArray(formalNavigation?.businessEntryEvidence);
  let candidateEvidence = evidenceItems.filter(
    (item) =>
      isLegacyRelatedParentEntryKind(normalizeString(item?.kind)) &&
      normalizeRelativePath(item?.path) === candidateEntryPath,
  );

  if (candidateEvidence.length === 0) {
    evidenceItems = await detectBusinessEntryEvidence(targetRoot, {
      routePath,
      title,
      dest: normalizedTargetBusinessPath,
    });
    candidateEvidence = evidenceItems.filter(
      (item) =>
        isLegacyRelatedParentEntryKind(normalizeString(item?.kind)) &&
        normalizeRelativePath(item?.path) === candidateEntryPath,
    );
  }

  if (candidateEvidence.length === 0) return null;

  const rankedEvidence = candidateEvidence
    .map((item) => ({
      item,
      ...scoreRelatedParentEntryEvidence(item, {
        routePath,
        title,
        targetBusinessPath: normalizedTargetBusinessPath,
        candidateEntryPath,
      }),
    }))
    .sort((left, right) => right.score - left.score);

  const bestEvidence = rankedEvidence[0];
  if (!bestEvidence) return null;

  const hasEnoughEvidence =
    bestEvidence.exactRouteMatch ||
    bestEvidence.sharedTokenCount >= 2 ||
    bestEvidence.score >= 360;

  if (!hasEnoughEvidence) return null;

  return {
    normalizedPath: candidateEntryPath,
    source: "module-parent-entry-evidence",
    evidence: unique([
      `parent-module-entry:${candidateEntryPath}`,
      ...bestEvidence.evidence,
    ]),
  };
}

function resolveBusinessPageTargetPath({
  pageTypeId,
  routePath,
  title,
  dest,
  generationTargetPolicy,
  formalNavigation,
  projectHostContract = null,
  relatedPageEvidence = null,
}) {
  const rawDest = normalizeRelativePath(dest);
  const normalizedRawTargetPath =
    pageTypeId === NON_TYPICAL_PAGE_FAMILY &&
    SCRIPT_LIKE_DEST_PATTERN.test(path.posix.basename(rawDest))
      ? normalizeRelativePath(path.posix.dirname(rawDest))
      : rawDest;
  const configuredDefaultBusinessPageDir = normalizeRelativePath(
    generationTargetPolicy?.defaultBusinessPageDir || "src/pages",
  );
  const contractDefaultBusinessPageDir = normalizeRelativePath(
    projectHostContract?.defaultBusinessPageDir || "",
  );
  const implicitFeatureBaseDir = normalizeRelativePath(
    formalNavigation?.implicitFeatureBaseDir || "",
  );
  const existingSystemBusinessPageDir = inferExistingSystemBusinessPageDir({
    rawDest: normalizedRawTargetPath || rawDest,
    formalNavigation,
  });
  const relatedPageBusinessPageDir =
    relatedPageEvidence?.accepted === true
      ? normalizeRelativePath(relatedPageEvidence?.derivedBusinessPageDir)
      : "";
  const navigationDerivedSource = existingSystemBusinessPageDir
    ? normalizeString(formalNavigation?.explicitNavigationMountContractKind) ===
      "legacy-business-entry"
      ? "navigation-mount-contract"
      : "legacy-business-entry"
    : "";
  const defaultBusinessPageDir =
    contractDefaultBusinessPageDir ||
    existingSystemBusinessPageDir ||
    relatedPageBusinessPageDir ||
    implicitFeatureBaseDir ||
    configuredDefaultBusinessPageDir;
  const targetBusinessPath =
    normalizedRawTargetPath ||
    normalizeRelativePath(
      path.posix.join(
        defaultBusinessPageDir,
        buildDefaultBusinessPageLeaf({ pageTypeId, routePath, title }),
      ),
    );

  return {
    rawDest,
    targetBusinessPath,
    defaultBusinessPageDir,
    forbiddenOutputRoots: unique(
      (generationTargetPolicy?.forbiddenOutputRoots ?? []).map((item) =>
        normalizeRelativePath(item),
      ),
    ),
    previewReferencePolicy:
      generationTargetPolicy?.previewReferencePolicy || "reference-only",
    routeIsolationPolicy: generationTargetPolicy?.routeIsolationPolicy || "",
    notes: generationTargetPolicy?.notes ?? [],
    outputTargetEvidence: buildOutputTargetEvidence({
      rawDest,
      defaultBusinessPageDir,
      contractDefaultBusinessPageDir,
      navigationContractDerivedDir: existingSystemBusinessPageDir,
      navigationDerivedSource,
      relatedPageEvidence,
      implicitFeatureBaseDir,
      policyDefaultBusinessPageDir: configuredDefaultBusinessPageDir,
    }),
  };
}

async function resolveBusinessTargetWithNavigation({
  targetRoot,
  routePath,
  title,
  dest,
  generationTargetPolicy,
  explicitNavigationMountContract,
  projectHostContract = null,
  validatedFormalNavigation = null,
  pageTypeId = "",
  relatedPagePath = "",
} = {}) {
  const validatedContractNavigation = validatedFormalNavigation
    ? {
        status: "ready",
        formalNavigation: cloneJson(validatedFormalNavigation),
        blockReason: "",
      }
    : await validateRehydratedFormalNavigation(targetRoot, projectHostContract);
  if (
    validatedContractNavigation.status !== "ready" ||
    !validatedContractNavigation.formalNavigation
  ) {
    return {
      businessTarget: null,
      formalNavigation: null,
      projectHostContractConsumption: validatedContractNavigation,
    };
  }
  const formalNavigation = applyExplicitNavigationMountContract({
    formalNavigation: validatedContractNavigation.formalNavigation,
    explicitNavigationMountContract,
  });
  const explicitRelatedPageEvidence = await resolveRelatedPagePathEvidence({
    targetRoot,
    relatedPagePath,
  });
  const initialBusinessTarget = resolveBusinessPageTargetPath({
    pageTypeId,
    routePath,
    title,
    dest,
    generationTargetPolicy,
    formalNavigation,
    projectHostContract,
    relatedPageEvidence: explicitRelatedPageEvidence,
  });
  const inferredRelatedPage =
    explicitRelatedPageEvidence.accepted === true
      ? null
      : await inferRelatedPagePathFromParentEntryEvidence({
          targetRoot,
          formalNavigation,
          routePath,
          title,
          targetBusinessPath: initialBusinessTarget.targetBusinessPath,
        });
  const effectiveRelatedPagePath =
    explicitRelatedPageEvidence.accepted === true
      ? explicitRelatedPageEvidence.normalizedPath
      : inferredRelatedPage?.normalizedPath || "";
  const relatedPageEvidence =
    explicitRelatedPageEvidence.accepted === true
      ? explicitRelatedPageEvidence
      : await resolveRelatedPagePathEvidence({
          targetRoot,
          relatedPagePath: effectiveRelatedPagePath,
        });

  if (relatedPageEvidence.accepted === true) {
    relatedPageEvidence.source =
      explicitRelatedPageEvidence.accepted === true
        ? "explicit-related-page-path"
        : inferredRelatedPage?.source || "";
  }

  const businessTarget =
    relatedPageEvidence.accepted === true &&
    effectiveRelatedPagePath &&
    effectiveRelatedPagePath !== explicitRelatedPageEvidence.normalizedPath
      ? resolveBusinessPageTargetPath({
          pageTypeId,
          routePath,
          title,
          dest,
          generationTargetPolicy,
          formalNavigation,
          projectHostContract,
          relatedPageEvidence,
        })
      : initialBusinessTarget;

  return {
    businessTarget,
    formalNavigation,
    projectHostContractConsumption: validatedContractNavigation,
  };
}

async function resolveBriefNavigationContext({
  targetRoot,
  resolvedMode,
  hostProfile,
  formalNavigation,
  projectHostContract = null,
  requestedBusiness = null,
  pageRelationDecision = null,
  relatedPagePath = "",
  preferredTemplatePath = "",
} = {}) {
  const navigationDecision = resolveNavigationDecision({
    resolvedMode,
    hostProfile,
    formalNavigation,
  });
  const navigationMountDecision = buildNavigationMountDecision({
    navigationDecision,
  });
  const appEntryMountPlan =
    rehydrateProjectEntryMountCapabilityFromProjectHostContract(
      projectHostContract,
    );
  const navigationMountAction = buildNavigationMountAction({
    navigationMountDecision,
    navigationDecision,
    pageRelationDecision,
    relatedPagePath,
    pageRoutePath: requestedBusiness?.routePath,
    menuTitle: requestedBusiness?.title,
    appEntryMountPlan,
    resolvedMode,
  });
  const hostExecutionAdapter = buildPageScopedMfDirectExposeLegacyAdapter({
    projectHostContract,
    projectAdapter: projectHostContract?.hostExecutionAdapter || null,
    requestedBusiness,
    preferredTemplatePath,
  });
  const officialHostSourceReadiness =
    await inspectFormalHostShellOfficialSource();
  const hostShellDecision = buildHostShellDecision({
    navigationDecision,
    requestedBusiness,
    officialHostSourceReadiness,
  });

  return {
    navigationDecision,
    navigationMountDecision,
    navigationMountAction,
    hostExecutionAdapter,
    officialHostSourceReadiness,
    hostShellDecision,
  };
}

function rehydrateProjectEntryMountCapabilityFromProjectHostContract(
  projectHostContract = null,
) {
  if (!isPlainObject(projectHostContract?.projectEntryMountCapability))
    return null;

  const capability = {
    appEntryPath: normalizeRelativePath(
      projectHostContract.projectEntryMountCapability.appEntryPath || "",
    ),
    supported:
      projectHostContract.projectEntryMountCapability.supported === true,
    strategy: normalizeString(
      projectHostContract.projectEntryMountCapability.strategy,
    ),
    reason: normalizeString(
      projectHostContract.projectEntryMountCapability.reason,
    ),
  };

  if (
    !capability.appEntryPath &&
    capability.supported !== true &&
    !capability.strategy &&
    !capability.reason
  ) {
    return null;
  }

  return capability;
}

function resolveBriefNavigationExecution({
  pageTaskGateStatus = "",
  requestedPageTypeStatus = "not-checked",
  navigationDecision = null,
  navigationMountDecision = null,
  navigationMountAction = null,
} = {}) {
  const navigationBlocked = isNavigationMountWriteBlocked({
    navigationBlocked: navigationDecision?.navigationBlocked,
    navigationMountDecision,
    navigationMountAction,
  });

  return {
    writeReadiness: resolveBriefWriteReadiness({
      briefReadyToGenerate: true,
      pageTaskGateStatus,
      requestedPageTypeStatus,
      navigationBlocked,
    }),
    navigationExecution: resolveNavigationExecutionReadiness({
      navigationBlocked: navigationDecision?.navigationBlocked,
      navigationMountDecision,
      navigationMountAction,
    }),
  };
}

function validateRequestedBusinessOutputTarget({
  pageType,
  requestedBusiness,
  generationTargetPolicy,
}) {
  const validation = validateOutputTargetDecision({
    pageType,
    requestedBusiness,
    generationTargetPolicy,
  });

  return {
    ok: validation.status === "pass",
    violations: validation.violations ?? [],
    reason: (validation.violations ?? []).join("; "),
  };
}

function isLegacyExplicitBusinessEntryKind(kind = "") {
  return kind === "window.addPage" || kind === "openNewPage";
}

function findBusinessEntryEvidenceBySelection({
  formalNavigation = {},
  selectedPath = "",
  selectedKind = "",
} = {}) {
  const normalizedPath = normalizeRelativePath(selectedPath);
  const normalizedKind = normalizeString(selectedKind);
  if (!normalizedPath || !normalizedKind) return null;

  return (
    asArray(formalNavigation?.businessEntryEvidence).find(
      (item) =>
        normalizeRelativePath(item?.path) === normalizedPath &&
        normalizeString(item?.kind) === normalizedKind,
    ) || null
  );
}

function buildLegacyMountCandidates(formalNavigation = {}) {
  return unique(
    asArray(formalNavigation?.businessEntryEvidence)
      .filter((item) => isLegacyExplicitBusinessEntryKind(item?.kind))
      .map((item) => {
        const parts = [];
        const entryPath = normalizeRelativePath(item?.path);
        const entryKind = normalizeString(item?.kind);
        const routePath = normalizeString(item?.routePath);
        const title = normalizeString(item?.title);
        const name = normalizeString(item?.name);

        if (!entryPath || !entryKind) return "";
        parts.push(`${entryPath} (${entryKind})`);
        if (routePath) parts.push(`entryRoutePath=${routePath}`);
        if (title) parts.push(`entryTitle=${title}`);
        if (name) parts.push(`entryName=${name}`);
        return parts.join(", ");
      })
      .filter(Boolean),
  );
}

function buildLegacyMountContractSuggestion(formalNavigation = {}) {
  const entry = findBusinessEntryEvidenceBySelection({
    formalNavigation,
    selectedPath: formalNavigation?.selectedLegacyMountEntryPath,
    selectedKind: formalNavigation?.selectedLegacyMountEntryKind,
  });
  const fallbackEntry = asArray(formalNavigation?.businessEntryEvidence).find(
    (item) => isLegacyExplicitBusinessEntryKind(item?.kind),
  );
  const candidate = entry || fallbackEntry;
  if (!candidate || !isLegacyExplicitBusinessEntryKind(candidate?.kind))
    return "";

  const suggestion = {
    entryPath: normalizeRelativePath(candidate.path),
    entryKind: normalizeString(candidate.kind),
  };
  const routePath = normalizeString(candidate.routePath);
  const title = normalizeString(candidate.title);
  const name = normalizeString(candidate.name);

  if (routePath) suggestion.entryRoutePath = routePath;
  if (title) suggestion.entryTitle = title;
  if (name) suggestion.entryName = name;

  return JSON.stringify(suggestion);
}

function describeDefaultBusinessPageDirSource({
  requestedBusiness = {},
  generationTargetPolicy = {},
  formalNavigation = {},
  outputTargetEvidence = {},
}) {
  const defaultBusinessPageDir = normalizeRelativePath(
    requestedBusiness?.defaultBusinessPageDir,
  );
  const policyBusinessPageDir = normalizeRelativePath(
    generationTargetPolicy?.defaultBusinessPageDir,
  );
  const selectedLegacyMountEntryPath = normalizeRelativePath(
    formalNavigation?.selectedLegacyMountEntryPath,
  );
  const selectedLegacyMountEntryKind = normalizeString(
    formalNavigation?.selectedLegacyMountEntryKind,
  );
  const selectedPublishEntryPath = normalizeRelativePath(
    formalNavigation?.selectedPublishEntryPath,
  );
  const selectedPublishEntryKind = normalizeString(
    formalNavigation?.selectedPublishEntryKind,
  );
  const implicitFeatureBaseDir = normalizeRelativePath(
    formalNavigation?.implicitFeatureBaseDir,
  );
  const selectedSource = normalizeString(outputTargetEvidence?.selectedSource);
  const relatedPagePath = normalizeRelativePath(
    outputTargetEvidence?.relatedPagePath,
  );
  const relatedPageDir = normalizeRelativePath(
    outputTargetEvidence?.relatedPageDir,
  );

  if (selectedSource === "project-host-contract" && defaultBusinessPageDir) {
    return `Current defaultBusinessPageDir ${defaultBusinessPageDir} is reused from PROJECT_HOST_CONTRACT.json, so page-source generation follows the project-scoped host contract before any page-specific override dest.`;
  }

  if (
    selectedSource === "related-page-path" &&
    relatedPagePath &&
    relatedPageDir
  ) {
    return `Current defaultBusinessPageDir ${defaultBusinessPageDir} is inferred from relatedPagePath ${relatedPagePath}, which contributes the writable business root ${relatedPageDir}.`;
  }

  if (
    (selectedSource === "implicit-feature-base-dir" ||
      formalNavigation?.implicitFeatureRegistryExists === true) &&
    implicitFeatureBaseDir &&
    implicitFeatureBaseDir === defaultBusinessPageDir
  ) {
    return `Current defaultBusinessPageDir ${defaultBusinessPageDir} is inferred from the confirmed implicit feature registry base directory ${implicitFeatureBaseDir}.`;
  }

  if (
    (selectedSource === "navigation-mount-contract" ||
      selectedSource === "legacy-business-entry") &&
    selectedLegacyMountEntryPath
  ) {
    return `Current defaultBusinessPageDir ${defaultBusinessPageDir} is inferred from confirmed legacy business entry ${selectedLegacyMountEntryPath} (${
      selectedLegacyMountEntryKind || "unknown"
    }).`;
  }

  if (selectedLegacyMountEntryPath) {
    return `Current defaultBusinessPageDir ${defaultBusinessPageDir} is inferred from confirmed legacy business entry ${selectedLegacyMountEntryPath} (${
      selectedLegacyMountEntryKind || "unknown"
    }).`;
  }

  if (
    selectedSource === "generation-target-policy" ||
    (policyBusinessPageDir && policyBusinessPageDir === defaultBusinessPageDir)
  ) {
    if (selectedPublishEntryPath) {
      return `Current defaultBusinessPageDir ${defaultBusinessPageDir} still comes from the project generation target policy because only publish entry ${selectedPublishEntryPath} (${
        selectedPublishEntryKind || "unknown"
      }) is confirmed; publish entries do not prove the writable business page directory.`;
    }

    return `Current defaultBusinessPageDir ${defaultBusinessPageDir} comes from the project generation target policy because no writable legacy mount directory has been confirmed yet.`;
  }

  return `Current defaultBusinessPageDir ${defaultBusinessPageDir} is the effective business page output root for this task.`;
}

function formatRelatedPageRejectedReason(reason = "") {
  if (reason === "related-page-file-not-found") {
    return "the file does not exist or is not readable in the current project";
  }
  if (reason === "related-page-path-unsupported-file-name") {
    return "the file is not a supported page entry file; use a project-relative page file such as index.jsx, index.tsx, page.jsx, or page.tsx";
  }
  if (reason === "related-page-path-unsupported-root") {
    return `the file does not live under a supported business page root such as ${[
      ...RELATED_PAGE_SUPPORTED_BUSINESS_ROOT_CANDIDATES,
    ].join(", ")}`;
  }
  if (reason === "related-page-path-outside-target-root") {
    return "the path resolves outside the current project root";
  }
  if (reason === "related-page-dir-is-non-inheritable") {
    return `the file lives under a non-inheritable directory such as ${NON_INHERITABLE_PAGE_DIR_PREFIXES.join(
      ", ",
    )}`;
  }
  return (
    normalizeString(reason) ||
    "the evidence was rejected by the current relatedPagePath guard"
  );
}

function describeRelatedPageEvidence(outputTargetEvidence = {}) {
  const relatedPagePath = normalizeRelativePath(
    outputTargetEvidence?.relatedPagePath,
  );
  if (!relatedPagePath) return "";

  if (outputTargetEvidence?.relatedPageAccepted === true) {
    const relatedPageDir = normalizeRelativePath(
      outputTargetEvidence?.relatedPageDir,
    );
    return `relatedPagePath ${relatedPagePath} is accepted as directory evidence and maps to business root ${
      relatedPageDir || "unknown"
    }.`;
  }

  const rejectedReasons = Array.isArray(
    outputTargetEvidence?.relatedPageRejectedReasons,
  )
    ? outputTargetEvidence.relatedPageRejectedReasons.map((item) =>
        formatRelatedPageRejectedReason(item),
      )
    : [];

  if (rejectedReasons.length > 0) {
    return `relatedPagePath ${relatedPagePath} was not accepted because ${rejectedReasons.join(
      "; ",
    )}.`;
  }

  return `relatedPagePath ${relatedPagePath} did not contribute directory evidence for this task.`;
}

function summarizeDeferredBriefArgValue(flag, value) {
  const rawValue = value == null ? "" : String(value).trim();
  if (!rawValue) return "";

  if (
    flag === "--page-adjustment-contract" ||
    flag === "--detail-sections-json" ||
    flag === "--confirmed-generation-input-json" ||
    flag === "--confirmed-design-restore-input-json" ||
    flag === "--navigation-mount-contract" ||
    flag === "--non-typical-conversation-output-json" ||
    flag === "--legacy-reconstruction-input-json" ||
    flag === "--migration-invariant-contract-json" ||
    flag === "--analytics-refactor-contract-json"
  ) {
    return "[provided]";
  }

  return rawValue.length > 120 ? `${rawValue.slice(0, 117)}...` : rawValue;
}

function pushDeferredBriefArg(entries, flag, value) {
  const summarizedValue = summarizeDeferredBriefArgValue(flag, value);
  if (!summarizedValue) return;
  entries.push({
    flag,
    value: summarizedValue,
  });
}

export function collectDeferredBriefShapingArgs({
  pageTypeId = "",
  pageFamilyId = "",
  inputMode = "",
  localizationMode = "",
  dest = "",
  relatedPagePath = "",
  title = "",
  routePath = "",
  detailSectionsJson = "",
  feedbackVariantId = "",
  pageAdjustmentContract = "",
  confirmedGenerationInputJson = "",
  confirmedDesignRestoreInputJson = "",
  navigationMountContract = "",
  nonTypicalConversationOutputJson = "",
  legacyReconstructionInputJson = "",
  migrationInvariantContractJson = "",
  analyticsRefactorContractJson = "",
} = {}) {
  const entries = [];
  pushDeferredBriefArg(entries, "--page-type", normalizeString(pageTypeId));
  pushDeferredBriefArg(entries, "--page-family", normalizeString(pageFamilyId));
  pushDeferredBriefArg(entries, "--input-mode", normalizeString(inputMode));
  pushDeferredBriefArg(
    entries,
    "--localization-mode",
    normalizeString(localizationMode),
  );
  pushDeferredBriefArg(entries, "--dest", normalizeRelativePath(dest));
  pushDeferredBriefArg(
    entries,
    "--related-page-path",
    normalizeRelativePath(relatedPagePath),
  );
  pushDeferredBriefArg(entries, "--title", normalizeString(title));
  pushDeferredBriefArg(
    entries,
    "--route-path",
    normalizeRelativePath(routePath),
  );
  pushDeferredBriefArg(entries, "--detail-sections-json", detailSectionsJson);
  pushDeferredBriefArg(
    entries,
    "--feedback-variant-id",
    normalizeString(feedbackVariantId),
  );
  pushDeferredBriefArg(
    entries,
    "--page-adjustment-contract",
    pageAdjustmentContract,
  );
  pushDeferredBriefArg(
    entries,
    "--confirmed-generation-input-json",
    confirmedGenerationInputJson,
  );
  pushDeferredBriefArg(
    entries,
    "--confirmed-design-restore-input-json",
    confirmedDesignRestoreInputJson,
  );
  pushDeferredBriefArg(
    entries,
    "--navigation-mount-contract",
    navigationMountContract,
  );
  pushDeferredBriefArg(
    entries,
    "--non-typical-conversation-output-json",
    nonTypicalConversationOutputJson,
  );
  pushDeferredBriefArg(
    entries,
    "--legacy-reconstruction-input-json",
    legacyReconstructionInputJson,
  );
  pushDeferredBriefArg(
    entries,
    "--migration-invariant-contract-json",
    migrationInvariantContractJson,
  );
  pushDeferredBriefArg(
    entries,
    "--analytics-refactor-contract-json",
    analyticsRefactorContractJson,
  );
  return entries;
}

function buildMinimalEnsureGateAdvice({
  integrationReadiness = null,
  deferredBriefShapingArgs = [],
} = {}) {
  if (integrationReadiness?.ready) return null;

  return {
    strategy: "minimal-ensure-gate",
    reason:
      "Project integration is not ready yet. Use generation-brief / plan-page-task only to surface nextCommand for ensure, not to shape the page request.",
    preferredFlags: ["--target", "--mode"],
    deferredBriefShapingArgs,
  };
}

function buildOutputTargetBlockedReason({
  outputTargetValidation,
  requestedBusiness,
  generationTargetPolicy,
  formalNavigation,
  explicitNavigationMountContract,
  outputTargetEvidence,
}) {
  const parts = [
    normalizeString(outputTargetValidation?.reason),
    describeDefaultBusinessPageDirSource({
      requestedBusiness,
      generationTargetPolicy,
      formalNavigation,
      outputTargetEvidence,
    }),
    describeRelatedPageEvidence(outputTargetEvidence),
  ].filter(Boolean);

  const hasExplicitContract =
    explicitNavigationMountContract?.provided === true;
  const selectedLegacyMountEntryPath = normalizeRelativePath(
    formalNavigation?.selectedLegacyMountEntryPath,
  );
  const legacyMountCandidates = buildLegacyMountCandidates(formalNavigation);

  if (
    !hasExplicitContract &&
    !selectedLegacyMountEntryPath &&
    legacyMountCandidates.length > 0
  ) {
    parts.push(
      `Candidate legacy mount entries were found but not uniquely confirmed yet: ${legacyMountCandidates.join(
        "; ",
      )}.`,
    );

    const contractSuggestion =
      buildLegacyMountContractSuggestion(formalNavigation);
    if (contractSuggestion) {
      parts.push(
        `If one of those is the real mount point, retry with navigationMountContract. Example: ${contractSuggestion}.`,
      );
    }
  }

  parts.push(
    `Move the page under ${requestedBusiness.defaultBusinessPageDir} or update the project generation target policy before continuing.`,
  );

  return parts.join(" ");
}

function getDocSet(manifest, pageType) {
  return unique([
    manifest.principlesDoc,
    manifest.routerDoc,
    "docs/generation/page-generation-workflow.md",
    manifest.registryDoc,
    pageType.docEntry,
    ...(pageType.sharedDocs ?? []),
  ]);
}

export function toBlockedGenerationBrief(brief, targetRoot) {
  const pageTaskGateStatus =
    brief.executionPolicy?.pageTaskGateStatus ||
    brief.pageTaskGate?.status ||
    "";
  const navigationBlocked = isNavigationMountWriteBlocked({
    navigationBlocked: brief.executionPolicy?.navigationBlocked === true,
    navigationMountDecision:
      brief.pageGenerationDecision?.navigationMountDecision,
    navigationMountAction: brief.pageGenerationDecision?.navigationMountAction,
  });
  const pageTaskBlocked = pageTaskGateStatus !== "ready-to-generate";
  const actionPolicy = buildWriteReadinessActionPolicy({
    allowedActions:
      brief.executionPolicy?.pageTaskAllowedActions ||
      brief.pageTaskGate?.allowedActions ||
      [],
    forbiddenActions:
      brief.executionPolicy?.pageTaskForbiddenActions ||
      brief.pageTaskGate?.forbiddenActions ||
      [],
    writeReadiness:
      brief.executionPolicy?.writeReadiness ||
      resolveBriefWriteReadiness({
        briefReadyToGenerate: brief.executionPolicy?.briefReadyToGenerate,
        pageTaskGateStatus,
        requestedPageTypeStatus:
          brief.executionPolicy?.requestedPageTypeStatus ||
          brief.executionPolicy?.requestedPageTypeCapabilityStatus ||
          "not-checked",
        navigationBlocked,
      }),
  });
  const requestedPageType = buildRequestedPageTypeStatusSnapshot({
    status:
      brief.executionPolicy?.requestedPageTypeStatus ||
      brief.executionPolicy?.requestedPageTypeCapabilityStatus,
    capabilityStatus: brief.executionPolicy?.requestedPageTypeCapabilityStatus,
    reason:
      brief.executionPolicy?.requestedPageTypeReason ||
      brief.executionPolicy?.requestedPageTypeCapabilityReason,
    blockedBy:
      brief.executionPolicy?.requestedPageTypeBlockedBy ||
      brief.executionPolicy?.requestedPageTypeCapabilityBlockedBy,
    capabilityBlockedBy:
      brief.executionPolicy?.requestedPageTypeCapabilityBlockedBy,
    conditionalBlockedBy:
      brief.executionPolicy?.requestedPageTypeConditionalBlockedBy,
    preWriteAction: brief.executionPolicy?.requestedPageTypePreWriteAction,
    preWriteActionReason:
      brief.executionPolicy?.requestedPageTypePreWriteActionReason,
    nextCommand: brief.executionPolicy?.requestedPageTypeNextCommand,
    sourcePath:
      brief.executionPolicy?.requestedPageTypeSourcePath ||
      brief.executionPolicy?.requestedPageTypeCapabilitySourcePath,
  });

  return {
    schema: "hiui-design-generation-brief-blocked.v1",
    status:
      brief.executionPolicy?.briefBlockStatus ||
      (pageTaskBlocked
        ? "blocked-until-page-task-ready"
        : navigationBlocked
          ? "blocked-by-navigation-mount"
          : "blocked-until-page-task-ready"),
    blockedBy:
      brief.executionPolicy?.briefBlockedBy ||
      (pageTaskBlocked
        ? "page-task-gate-not-ready"
        : navigationBlocked
          ? "navigation-mount-not-ready"
          : "page-task-gate-not-ready"),
    reason:
      brief.executionPolicy?.briefBlockReason ||
      (requestedPageType.status === "blocked"
        ? requestedPageType.reason
        : navigationBlocked
          ? getNavigationBlockReason(brief)
          : brief.pageTaskGate?.reason ||
            brief.integrationReadiness?.reason ||
            ""),
    targetRoot,
    requestedMode: brief.requestedMode,
    mode: brief.mode,
    inputModeId: normalizeString(brief.inputMode?.id),
    localizationMode:
      normalizeString(brief.localizationMode) || DEFAULT_LOCALIZATION_MODE,
    requestedPageTypeStatus: requestedPageType.status,
    requestedPageTypeReason: requestedPageType.reason,
    requestedPageTypeBlockedBy: requestedPageType.blockedBy,
    requestedPageTypeSourcePath: requestedPageType.sourcePath,
    legacyActionGaps: normalizeObjectArray(brief.legacyActionGaps),
    writeReadiness:
      brief.executionPolicy?.writeReadiness ||
      resolveBriefWriteReadiness({
        briefReadyToGenerate: brief.executionPolicy?.briefReadyToGenerate,
        pageTaskGateStatus,
        requestedPageTypeStatus: requestedPageType.status,
        navigationBlocked,
      }),
    gateAdvice:
      brief.gateAdvice ||
      buildMinimalEnsureGateAdvice({
        integrationReadiness: brief.integrationReadiness,
        deferredBriefShapingArgs: brief.deferredBriefShapingArgs || [],
      }),
    integrationReadiness: brief.integrationReadiness,
    projectHostContract:
      brief.projectHostContract ||
      buildProjectHostContractSummary({
        targetRoot,
        projectHostContract: null,
        pageTaskGate: brief.pageTaskGate,
      }),
    pageTaskGate: {
      status: pageTaskGateStatus,
      nextStage:
        brief.executionPolicy?.pageTaskGateNextStage ||
        brief.pageTaskGate?.nextStage ||
        "",
      reason:
        brief.executionPolicy?.pageTaskGateReason ||
        brief.pageTaskGate?.reason ||
        "",
      gateStatusReason:
        brief.executionPolicy?.pageTaskGateReason ||
        brief.pageTaskGate?.gateStatusReason ||
        brief.pageTaskGate?.reason ||
        "",
      nextCommand:
        brief.executionPolicy?.pageTaskGateNextCommand ||
        brief.pageTaskGate?.nextCommand ||
        "",
      nextRequiredAction:
        brief.executionPolicy?.pageTaskGateNextRequiredAction ||
        brief.pageTaskGate?.nextRequiredAction ||
        "",
      staleInputs: Array.isArray(
        brief.executionPolicy?.pageTaskGateStaleInputs,
      )
        ? brief.executionPolicy.pageTaskGateStaleInputs
        : Array.isArray(brief.pageTaskGate?.staleInputs)
          ? brief.pageTaskGate.staleInputs
          : [],
      canAutoRecover:
        brief.executionPolicy?.pageTaskGateCanAutoRecover === true ||
        brief.pageTaskGate?.canAutoRecover === true,
      contractSnapshotId:
        brief.executionPolicy?.pageTaskGateContractSnapshotId ||
        brief.pageTaskGate?.contractSnapshotId ||
        "",
      allowedActions: actionPolicy.allowedActions,
      forbiddenActions: actionPolicy.forbiddenActions,
    },
    pageTypeCapability: {
      status: requestedPageType.capabilityStatus,
      reason: requestedPageType.reason,
      blockedBy: requestedPageType.capabilityBlockedBy,
      conditionalBlockedBy: requestedPageType.conditionalBlockedBy,
      preWriteAction: requestedPageType.preWriteAction,
      preWriteActionReason: requestedPageType.preWriteActionReason,
      nextCommand: requestedPageType.nextCommand,
      sourcePath: requestedPageType.sourcePath,
    },
    navigation: {
      blocked: navigationBlocked,
      reason: navigationBlocked ? getNavigationBlockReason(brief) : "",
      pageRelationKind:
        brief.pageGenerationDecision?.pageRelationDecision?.kind ||
        "undetermined",
      pageRelationConfidence:
        brief.pageGenerationDecision?.pageRelationDecision?.confidence || "low",
      mountDecisionAction:
        brief.pageGenerationDecision?.navigationMountDecision?.action || "",
      mountActionAction:
        brief.pageGenerationDecision?.navigationMountAction?.action || "",
    },
    requestedBusiness: isPlainObject(brief.requestedBusiness)
      ? {
          title: normalizeString(brief.requestedBusiness.title),
          rawDest: normalizeRelativePath(brief.requestedBusiness.rawDest || ""),
          dest: normalizeRelativePath(brief.requestedBusiness.dest || ""),
          targetBusinessPath: normalizeRelativePath(
            brief.requestedBusiness.targetBusinessPath ||
              brief.requestedBusiness.dest ||
              "",
          ),
          defaultBusinessPageDir: normalizeRelativePath(
            brief.requestedBusiness.defaultBusinessPageDir || "",
          ),
          routePath: normalizeRelativePath(
            brief.requestedBusiness.routePath || "",
          ),
          detailSectionsCount: Array.isArray(
            brief.requestedBusiness.detailSections,
          )
            ? brief.requestedBusiness.detailSections.length
            : 0,
          detailSectionsSource: normalizeString(
            brief.requestedBusiness.detailSectionsSource,
          ),
          feedbackVariantId: normalizeString(
            brief.requestedBusiness.feedbackVariantId,
          ),
        }
      : null,
    outputTargetEvidence:
      brief.outputTargetEvidence && isPlainObject(brief.outputTargetEvidence)
        ? brief.outputTargetEvidence
        : buildEmptyOutputTargetEvidence(),
    legacyReconstructionInput:
      brief.legacyReconstructionInput &&
      isPlainObject(brief.legacyReconstructionInput)
        ? brief.legacyReconstructionInput
        : null,
    migrationInvariantContract:
      brief.migrationInvariantContract &&
      isPlainObject(brief.migrationInvariantContract)
        ? brief.migrationInvariantContract
        : null,
    analyticsRefactorContract:
      brief.analyticsRefactorContract &&
      isPlainObject(brief.analyticsRefactorContract)
        ? brief.analyticsRefactorContract
        : null,
    analyticsRefactorViewModel:
      brief.pageGenerationDecision?.analyticsRefactorViewModel &&
      isPlainObject(brief.pageGenerationDecision.analyticsRefactorViewModel)
        ? brief.pageGenerationDecision.analyticsRefactorViewModel
        : null,
  };
}

function renderBlockedGenerationBriefMarkdown(
  brief,
  targetRoot,
  detailBody = "",
) {
  const blocked = toBlockedGenerationBrief(brief, targetRoot);
  const summaryNextCommand =
    blocked.pageTypeCapability.nextCommand ||
    blocked.pageTaskGate.nextCommand ||
    "—";
  const lines = [
    "# HiUI Generation Brief Blocked",
    "",
    `- status: ${blocked.status}`,
    `- blockedBy: ${blocked.blockedBy}`,
    `- targetRoot: ${blocked.targetRoot}`,
    `- requestedMode: ${blocked.requestedMode}`,
    `- resolvedMode: ${blocked.mode}`,
    `- localizationMode: ${
      blocked.localizationMode || DEFAULT_LOCALIZATION_MODE
    }`,
    `- requestedPageTypeStatus: ${
      blocked.requestedPageTypeStatus || "not-checked"
    }`,
    `- writeReadiness: ${blocked.writeReadiness || "blocked-before-write"}`,
    `- integrationReadiness: ${
      blocked.integrationReadiness.status || "unknown"
    }`,
    `- pageTaskGate: ${blocked.pageTaskGate.status || "unknown"}`,
    `- reason: ${blocked.reason || blocked.pageTaskGate.reason || "—"}`,
    `- nextCommand: ${summaryNextCommand}`,
    `- nextRequiredAction: ${blocked.pageTaskGate.nextRequiredAction || "—"}`,
    `- canAutoRecover: ${blocked.pageTaskGate.canAutoRecover === true}`,
  ];

  if (blocked.gateAdvice) {
    lines.push("", "## Minimal Gate Advice");
    lines.push(
      `- strategy: ${blocked.gateAdvice.strategy || "minimal-ensure-gate"}`,
    );
    lines.push(`- reason: ${blocked.gateAdvice.reason || "—"}`);
    lines.push(
      `- preferredFlags: ${
        Array.isArray(blocked.gateAdvice.preferredFlags) &&
        blocked.gateAdvice.preferredFlags.length > 0
          ? blocked.gateAdvice.preferredFlags.join(", ")
          : "—"
      }`,
    );
    if (
      Array.isArray(blocked.gateAdvice.deferredBriefShapingArgs) &&
      blocked.gateAdvice.deferredBriefShapingArgs.length > 0
    ) {
      lines.push("- deferredBriefShapingArgs:");
      lines.push(
        ...blocked.gateAdvice.deferredBriefShapingArgs.map(
          (item) => `  - ${item.flag}${item.value ? `=${item.value}` : ""}`,
        ),
      );
    }
  }

  if (
    blocked.pageTypeCapability.status &&
    blocked.pageTypeCapability.status !== "not-checked"
  ) {
    lines.push("", "## Requested Page Type Capability");
    lines.push(`- status: ${blocked.pageTypeCapability.status}`);
    lines.push(`- reason: ${blocked.pageTypeCapability.reason || "—"}`);
    lines.push(
      `- blockedBy: ${
        Array.isArray(blocked.pageTypeCapability.blockedBy) &&
        blocked.pageTypeCapability.blockedBy.length > 0
          ? blocked.pageTypeCapability.blockedBy.join(", ")
          : "—"
      }`,
    );
    lines.push(
      `- nextCommand: ${blocked.pageTypeCapability.nextCommand || "—"}`,
    );
    lines.push(`- sourcePath: ${blocked.pageTypeCapability.sourcePath || "—"}`);
  }

  if (blocked.navigation.blocked) {
    lines.push("", "## Navigation Mount");
    lines.push(`- blocked: ${blocked.navigation.blocked}`);
    lines.push(`- reason: ${blocked.navigation.reason || "—"}`);
    lines.push(
      `- mountDecisionAction: ${blocked.navigation.mountDecisionAction || "—"}`,
    );
    lines.push(
      `- mountActionAction: ${blocked.navigation.mountActionAction || "—"}`,
    );
  }

  if (blocked.projectHostContract) {
    lines.push("", "## Project Host Contract");
    lines.push(`- status: ${blocked.projectHostContract.status || "—"}`);
    lines.push(`- required: ${blocked.projectHostContract.required === true}`);
    lines.push(`- path: ${blocked.projectHostContract.path || "—"}`);
    lines.push(`- schema: ${blocked.projectHostContract.schema || "—"}`);
    lines.push(
      `- hostFamily: ${blocked.projectHostContract.hostFamily || "—"}`,
    );
    lines.push(
      `- publishMechanism: ${
        blocked.projectHostContract.publishMechanism || "—"
      }`,
    );
    lines.push(
      `- executionContractKind: ${
        blocked.projectHostContract.executionContractKind || "—"
      }`,
    );
    lines.push(
      `- executionContractConfirmationStatus: ${
        blocked.projectHostContract.executionContractConfirmationStatus || "—"
      }`,
    );
    lines.push(
      `- defaultBusinessPageDir: ${
        blocked.projectHostContract.defaultBusinessPageDir || "—"
      }`,
    );
    lines.push(
      `- consumptionPolicy: ${
        blocked.projectHostContract.consumptionPolicy || "—"
      }`,
    );
  }

  if (blocked.outputTargetEvidence) {
    lines.push("", "## Output Target Evidence");
    lines.push(
      `- selectedSource: ${blocked.outputTargetEvidence.selectedSource || "—"}`,
    );
    lines.push(
      `- targetBusinessPathSource: ${
        blocked.outputTargetEvidence.targetBusinessPathSource || "—"
      }`,
    );
    lines.push(
      `- derivedDefaultBusinessPageDir: ${
        blocked.outputTargetEvidence.derivedDefaultBusinessPageDir || "—"
      }`,
    );
    lines.push(
      `- relatedPagePath: ${
        blocked.outputTargetEvidence.relatedPagePath || "—"
      }`,
    );
    lines.push(
      `- relatedPageAccepted: ${
        blocked.outputTargetEvidence.relatedPageAccepted === true
      }`,
    );
    lines.push(
      `- relatedPageDir: ${blocked.outputTargetEvidence.relatedPageDir || "—"}`,
    );
    lines.push(
      `- relatedPageRejectedReasons: ${
        Array.isArray(
          blocked.outputTargetEvidence.relatedPageRejectedReasons,
        ) && blocked.outputTargetEvidence.relatedPageRejectedReasons.length > 0
          ? blocked.outputTargetEvidence.relatedPageRejectedReasons.join(", ")
          : "—"
      }`,
    );
  }

  if (blocked.requestedBusiness) {
    lines.push("", "## Requested Business");
    lines.push(`- rawDest: ${blocked.requestedBusiness.rawDest || "—"}`);
    lines.push(
      `- targetBusinessPath: ${
        blocked.requestedBusiness.targetBusinessPath || "—"
      }`,
    );
    lines.push(
      `- defaultBusinessPageDir: ${
        blocked.requestedBusiness.defaultBusinessPageDir || "—"
      }`,
    );
    lines.push(`- routePath: ${blocked.requestedBusiness.routePath || "—"}`);
  }

  if (blocked.pageTaskGate.allowedActions.length > 0) {
    lines.push("", "## Allowed Actions");
    lines.push(
      ...blocked.pageTaskGate.allowedActions.map((item) => `- ${item}`),
    );
  }

  if (blocked.pageTaskGate.forbiddenActions.length > 0) {
    lines.push("", "## Forbidden Actions");
    lines.push(
      ...blocked.pageTaskGate.forbiddenActions.map((item) => `- ${item}`),
    );
  }

  if (normalizeString(detailBody)) {
    lines.push("", "## Detailed Brief Context", "", detailBody.trim());
  }

  return `${lines.join("\n")}\n`;
}

function buildBlockedBrief({
  targetRoot,
  skillRoot,
  pageTypeId = "",
  pageFamilyId = "",
  requestedMode,
  resolvedMode,
  integrationReadiness,
  pageTaskGate,
  inputMode,
  routePath,
  title,
  dest,
  localizationMode = DEFAULT_LOCALIZATION_MODE,
  blockedStatus = "blocked-until-page-task-ready",
  blockedBy = "page-task-gate-not-ready",
  blockReason = "",
  requestedPageTypeCapability = null,
  businessTarget = null,
  outputTargetEvidence = null,
  projectHostContract = null,
  projectHostContractStatus = "",
  deferredBriefShapingArgs = [],
  legacyActionGaps = [],
}) {
  const selectorId = pageTypeId || pageFamilyId || "page";
  const effectiveBusinessTarget =
    businessTarget && isPlainObject(businessTarget)
      ? businessTarget
      : resolveBusinessPageTargetPath({
          pageTypeId: selectorId,
          routePath,
          title,
          dest,
          generationTargetPolicy: {},
        });
  const requestedBusiness = effectiveBusinessTarget;
  const requestedPageType = buildRequestedPageTypeStatusSnapshot(
    requestedPageTypeCapability,
  );
  const writeReadiness = resolveBriefWriteReadiness({
    briefReadyToGenerate: false,
    pageTaskGateStatus: pageTaskGate.status,
    requestedPageTypeStatus: requestedPageType.status,
    navigationBlocked: false,
  });

  return {
    schema: "hiui5-generation-brief.v2",
    targetRoot,
    skillRoot,
    line: "",
    mode: resolvedMode,
    requestedMode: requestedMode || "auto",
    localizationMode,
    inputMode,
    confirmedGenerationInput: null,
    confirmedDesignRestoreInput: null,
    designRestoreRoutingDecision: null,
    legacyReconstructionInput: null,
    migrationInvariantContract: null,
    analyticsRefactorContract: null,
    legacyActionGaps: normalizeObjectArray(legacyActionGaps),
    pageSelector: {
      kind: pageFamilyId ? "page-family" : "page-type",
      id: selectorId,
      label: pageFamilyId === NON_TYPICAL_PAGE_FAMILY ? "非典型页面" : "",
    },
    hostProfile: {
      projectType: "gated-before-detection",
      framework: "",
      runtime: "",
      routing: "",
      strategy: "",
      reason:
        "P0 hard gate blocked host profile detection before any page-task analysis.",
      adapterDoc: "",
      adapterEntryHints: [],
    },
    integrationReadiness,
    gateAdvice: buildMinimalEnsureGateAdvice({
      integrationReadiness,
      deferredBriefShapingArgs,
    }),
    deferredBriefShapingArgs,
    projectHostContract: buildProjectHostContractSummary({
      targetRoot,
      projectHostContract,
      pageTaskGate,
      forcedStatus: projectHostContractStatus,
    }),
    pageTaskGate,
    pageType: {
      id: pageTypeId,
      label: "",
      pageFamily: pageFamilyId || "",
      kind: "",
      whenToUse: "",
      shell: "",
      docEntry: "",
      sharedDocs: [],
      smokePath: "",
    },
    outputTargetEvidence:
      outputTargetEvidence && isPlainObject(outputTargetEvidence)
        ? outputTargetEvidence
        : effectiveBusinessTarget.outputTargetEvidence ||
          buildEmptyOutputTargetEvidence(),
    requestedBusiness: {
      title: title || "",
      rawDest: requestedBusiness.rawDest,
      dest: requestedBusiness.targetBusinessPath,
      targetBusinessPath: requestedBusiness.targetBusinessPath,
      defaultBusinessPageDir: requestedBusiness.defaultBusinessPageDir,
      forbiddenOutputRoots: requestedBusiness.forbiddenOutputRoots,
      previewReferencePolicy: requestedBusiness.previewReferencePolicy,
      routeIsolationPolicy: requestedBusiness.routeIsolationPolicy,
      notes: requestedBusiness.notes,
      routePath,
      detailSections: [],
      detailSectionsSource: "",
      feedbackVariantId: "",
    },
    sources: {
      manifestPath: "",
      baseManifestPath: "",
      overlayPath: "",
      requiredDocs: [],
      sourceTemplatePath: "",
      runtimeExamplePath: "",
      globalPreviewRoute: "",
      preferredTemplatePath: "",
      sourceStylePath: "",
      runtimeStylePath: "",
      preferredStylePath: "",
      sourceTemplateExists: false,
      runtimeExampleExists: false,
      preferredTemplateExists: false,
      sourceStyleExists: false,
      runtimeStyleExists: false,
      preferredStyleExists: false,
    },
    pageAdjustmentContract: null,
    generationContract: {},
    pageGenerationDecision: {
      copyMode: "",
      generationPath: {
        id: "",
        label: "",
        reason: "",
      },
      workflow: {},
      pageFamilyContract: {},
      hostCapability: {
        status: "blocked-until-gate",
        reason: "P0 hard gate blocked host capability analysis.",
        hasHostProviderBridge: false,
        hasSharedHeaderSlot: false,
        hasContinuousHeightChain: false,
        sharedHeaderSlotPolicy: "unknown",
        layoutMode: "unknown",
        evidenceFiles: [],
      },
      formalHostProfile: {
        layoutMode: "unknown",
        headerSlotPolicy: "unknown",
        hostProviderBridge: false,
        continuousHeightChain: false,
        evidenceFiles: [],
      },
      headerOwnershipDecision: createDefaultHeaderOwnershipDecision(),
      selectedHeaderStrategy: "unknown",
      requiredHostAction: "none",
      navigationDecision: {
        formalHostAction: "",
      },
      pageRelationDecision: {
        kind: "undetermined",
        confidence: "low",
        reason:
          "Page relation was not evaluated because the brief is blocked before page-level planning.",
        evidence: [],
      },
      publishDeliveryDecision: {
        kind: "parent-flow-only",
        reason:
          "Publish delivery was not evaluated because the brief is blocked before page-level planning.",
        evidence: [],
        pageRelationKind: "undetermined",
        hostExecutionAdapterKind: "",
      },
      navigationMountDecision: {
        existingBusinessNavigation: "missing",
        action: "",
        routeRegistryPath: "",
        menuRegistryPath: "",
        formalShellPath: "",
        shellSource: "unknown",
        reason: "",
      },
      hostExecutionAdapter: null,
      navigationMountAction: {
        action: "",
        targetShellPath: "",
        targetRegistryPath: "",
        appEntryPath: "",
        pageRoutePath: normalizeRelativePath(routePath).replace(/^\/+/, ""),
        menuTitle: title || "",
        mustDoBeforePageCode: true,
        reason: "",
      },
      hostShellDecision: {
        officialHostSourceStatus: "blocked-until-gate",
        officialHostSourceReason:
          "P0 hard gate blocked official host-source analysis.",
      },
      pageAdjustmentDecision: {},
      pageAdjustmentViewModel: {},
      analyticsRefactorViewModel: {},
      requiredDataShape: {},
      requiredLayout: {},
      requiredDomClassContract: {},
      fallbackPolicy: {},
      coverageDecision: {},
      coverageValidation: {},
      hostImportPolicy: buildBriefHostImportPolicy(),
      resolvedHostGenerationContract: createPendingHostGenerationContract(),
      generationTargetPolicy: {
        contextPath: "",
        scope: "",
        defaultBusinessPageDir: requestedBusiness.defaultBusinessPageDir,
        forbiddenOutputRoots: requestedBusiness.forbiddenOutputRoots,
        previewReferencePolicy: requestedBusiness.previewReferencePolicy,
        routeIsolationPolicy: requestedBusiness.routeIsolationPolicy,
        notes: requestedBusiness.notes,
      },
      generationGuidance: {
        guidanceDoc: "",
        defaultFlow: "coverage-first-light-flow",
        enforceDangerousProps: true,
        enforceForbiddenSlots: true,
        enforceVisualTokens: true,
        enforceSemanticComponents: true,
        enforceImportSourcePolicy: true,
      },
      certifiedImplementationPolicy: {
        boundary: "",
        notes: [],
      },
    },
    executionPolicy: {
      integrationGate:
        pageTaskGate.status === "ready-to-generate"
          ? "ready-to-generate"
          : "ensure-or-stop",
      briefReadyToGenerate: false,
      writeReadiness,
      briefBlockStatus: blockedStatus,
      briefBlockedBy: blockedBy,
      briefBlockReason:
        blockReason ||
        pageTaskGate.reason ||
        integrationReadiness.reason ||
        "Generation brief is blocked by the current project state.",
      mustPassIntegrationReadinessBeforeWriting: true,
      mustPassPageTaskGateBeforeWriting: true,
      requiresProjectLocalHiuiDesignContext: true,
      mustAutoEnsureOrStopWhenIntegrationMissing: !integrationReadiness.ready,
      mustStopWhenPageTaskGateClosed:
        pageTaskGate.status !== "ready-to-generate",
      pageTaskGateStatus: pageTaskGate.status,
      pageTaskGateReason: pageTaskGate.reason,
      pageTaskGateNextCommand: pageTaskGate.nextCommand,
      pageTaskGateNextRequiredAction: pageTaskGate.nextRequiredAction || "",
      pageTaskGateStaleInputs: Array.isArray(pageTaskGate.staleInputs)
        ? pageTaskGate.staleInputs
        : [],
      pageTaskGateCanAutoRecover: pageTaskGate.canAutoRecover === true,
      pageTaskGateContractSnapshotId: pageTaskGate.contractSnapshotId || "",
      ...buildExecutionPolicyActionFields({
        allowedActions: pageTaskGate.allowedActions,
        forbiddenActions: pageTaskGate.forbiddenActions,
        writeReadiness,
      }),
      forbidHostCompatibilityFallbackWhenIntegrationMissing:
        pageTaskGate.status !== "ready-to-generate",
      forbiddenIntegrationFallbacks:
        pageTaskGate.status === "ready-to-generate"
          ? []
          : DEFAULT_FORBIDDEN_INTEGRATION_FALLBACKS,
      mustCreateBriefBeforeWriting: true,
      mustStartFromOfficialTemplate: false,
      mustStartFromOfficialReference: false,
      mayReplaceOnlyBusinessSlots: false,
      inputMode: inputMode.id,
      confirmationMode: "",
      requiresChatConfirmation: false,
      confirmedPageFamily: "",
      confirmedPageType: "",
      finalPromptAvailable: false,
      generationPath: "",
      generationPathLabel: "",
      generationPathReason: "",
      pageAdjustmentContractStatus: "not-evaluated",
      pageAdjustmentContractProvided: false,
      pageAdjustmentContractSupported: false,
      pageAdjustmentContractSource: "",
      migrationInvariantContractProvided: false,
      analyticsRefactorContractProvided: false,
      analyticsRefactorContractSource: "",
      certifiedImplementationBoundary: "",
      certifiedImplementationNotes: [],
      mustPreserveWorkflowModuleSet: [],
      targetBusinessPath: requestedBusiness.targetBusinessPath,
      defaultBusinessPageDir: requestedBusiness.defaultBusinessPageDir,
      forbiddenOutputRoots: requestedBusiness.forbiddenOutputRoots,
      previewReferencePolicy: requestedBusiness.previewReferencePolicy,
      routeIsolationPolicy: requestedBusiness.routeIsolationPolicy,
      projectLine: "",
      formalNavigationRegistryPath: "",
      navigationBlocked: false,
      navigationBlockReason: "",
      requestedPageTypeStatus: requestedPageType.status,
      requestedPageTypeReason: requestedPageType.reason,
      requestedPageTypeBlockedBy: requestedPageType.blockedBy,
      requestedPageTypeSourcePath: requestedPageType.sourcePath,
      requestedPageTypeCapabilityStatus: requestedPageType.capabilityStatus,
      requestedPageTypeCapabilityReason: requestedPageType.reason,
      requestedPageTypeCapabilityBlockedBy:
        requestedPageType.capabilityBlockedBy,
      requestedPageTypeCapabilitySourcePath: requestedPageType.sourcePath,
      requestedPageTypeConditionalBlockedBy:
        requestedPageType.conditionalBlockedBy,
      requestedPageTypePreWriteAction: requestedPageType.preWriteAction,
      requestedPageTypePreWriteActionReason:
        requestedPageType.preWriteActionReason,
      requestedPageTypeNextCommand: requestedPageType.nextCommand,
      oldProjectMustNotCreateFormalNavigation: false,
      createFirstBusinessShellOnlyWhenHostIntegrationReady: false,
      officialHostSourceRequiredForFirstBusinessShell: false,
      officialHostSourceReady: false,
      officialHostSourceReason:
        "P0 hard gate blocked official host-source analysis.",
    },
    nonTypicalConversationOutput: null,
    nonTypicalExecutionBrief: null,
  };
}

function buildProjectHostContractBlockedBrief({
  targetRoot,
  skillRoot,
  pageTypeId = "",
  pageFamilyId = "",
  requestedMode = "auto",
  resolvedMode = "auto",
  integrationReadiness = null,
  pageTaskGate = null,
  inputMode = "",
  localizationMode = DEFAULT_LOCALIZATION_MODE,
  routePath = "",
  title = "",
  dest = "",
  businessTarget = null,
  outputTargetEvidence = null,
  blockedBy = "",
  projectHostContract = null,
  projectHostContractStatus = "",
  blockReason = "",
} = {}) {
  return buildBlockedBrief({
    targetRoot,
    skillRoot,
    pageTypeId,
    pageFamilyId,
    requestedMode,
    resolvedMode,
    integrationReadiness,
    pageTaskGate,
    inputMode,
    localizationMode,
    routePath,
    title,
    dest,
    businessTarget,
    outputTargetEvidence,
    blockedStatus: "blocked-by-project-host-contract",
    blockedBy,
    projectHostContract,
    projectHostContractStatus,
    blockReason,
  });
}

function maybeBuildProjectHostContractConsumptionBlockedBrief({
  targetRoot,
  skillRoot,
  pageTypeId = "",
  pageFamilyId = "",
  requestedMode = "auto",
  resolvedMode = "auto",
  integrationReadiness = null,
  pageTaskGate = null,
  inputMode = "",
  localizationMode = DEFAULT_LOCALIZATION_MODE,
  routePath = "",
  title = "",
  dest = "",
  businessTarget = null,
  outputTargetEvidence = null,
  projectHostContract = null,
  projectHostContractConsumption = null,
} = {}) {
  if (
    projectHostContractConsumption?.status === "ready" &&
    projectHostContractConsumption?.formalNavigation
  ) {
    return null;
  }

  return buildProjectHostContractBlockedBrief({
    targetRoot,
    skillRoot,
    pageTypeId,
    pageFamilyId,
    requestedMode,
    resolvedMode,
    integrationReadiness,
    pageTaskGate,
    inputMode,
    localizationMode,
    routePath,
    title,
    dest,
    businessTarget,
    outputTargetEvidence,
    blockedBy: "stale-project-host-contract",
    projectHostContract,
    projectHostContractStatus: "invalid",
    blockReason: projectHostContractConsumption?.blockReason || "",
  });
}

async function loadProjectHostContractForBrief(options = {}) {
  const {
    targetRoot,
    skillRoot,
    pageTypeId = "",
    pageFamilyId = "",
    requestedMode = "auto",
    resolvedMode = "auto",
    integrationReadiness = null,
    pageTaskGate = null,
    inputMode = "",
    localizationMode = DEFAULT_LOCALIZATION_MODE,
    routePath = "",
    title = "",
    dest = "",
    businessTarget = null,
    outputTargetEvidence = null,
    preloadedProjectHostContract,
  } = options;
  const projectHostContract = Object.prototype.hasOwnProperty.call(
    options,
    "preloadedProjectHostContract",
  )
    ? preloadedProjectHostContract
    : await readProjectHostContract(targetRoot);
  if (!isPlainObject(projectHostContract)) {
    return {
      blockedBrief: buildProjectHostContractBlockedBrief({
        targetRoot,
        skillRoot,
        pageTypeId,
        pageFamilyId,
        requestedMode,
        resolvedMode,
        integrationReadiness,
        pageTaskGate,
        inputMode,
        localizationMode,
        routePath,
        title,
        dest,
        businessTarget,
        outputTargetEvidence,
        blockedBy: "missing-project-host-contract",
        projectHostContractStatus: "missing",
        blockReason:
          `Project host contract is missing at ${getProjectHostContractPath(
            targetRoot,
          )}. ` +
          "Run typical-page:preflight again before planning or writing page code.",
      }),
    };
  }

  if (!rehydrateFormalNavigationFromProjectHostContract(projectHostContract)) {
    return {
      blockedBrief: buildProjectHostContractBlockedBrief({
        targetRoot,
        skillRoot,
        pageTypeId,
        pageFamilyId,
        requestedMode,
        resolvedMode,
        integrationReadiness,
        pageTaskGate,
        inputMode,
        localizationMode,
        routePath,
        title,
        dest,
        businessTarget,
        outputTargetEvidence,
        blockedBy: "invalid-project-host-contract",
        projectHostContract,
        projectHostContractStatus: "invalid",
        blockReason:
          `Project host contract at ${getProjectHostContractPath(
            targetRoot,
          )} is missing formalNavigation facts. ` +
          "Run typical-page:preflight again so hiui-design can refresh the project-scoped navigation contract before planning or writing page code.",
      }),
    };
  }

  const projectHostContractConsumption =
    await validateRehydratedFormalNavigation(targetRoot, projectHostContract);
  const blockedBrief = maybeBuildProjectHostContractConsumptionBlockedBrief({
    targetRoot,
    skillRoot,
    pageTypeId,
    pageFamilyId,
    requestedMode,
    resolvedMode,
    integrationReadiness,
    pageTaskGate,
    inputMode,
    localizationMode,
    routePath,
    title,
    dest,
    businessTarget,
    outputTargetEvidence,
    projectHostContract,
    projectHostContractConsumption,
  });

  if (blockedBrief) {
    return {
      blockedBrief,
    };
  }

  return {
    projectHostContract,
    projectHostContractConsumption,
  };
}

function getTemplatePaths({ targetRoot, skillRoot, pageType, contract }) {
  const sourceTemplatePath = path.join(skillRoot, contract.baseTemplatePath);
  const previewReferencePath =
    normalizeString(pageType.runtimeExamplePath) ||
    normalizeString(contract.baseTemplatePath);
  const runtimeExamplePath = previewReferencePath
    ? path.join(skillRoot, previewReferencePath)
    : sourceTemplatePath;
  const preferredTemplatePath = sourceTemplatePath;
  const sourceStylePath = contract.baseStylePath
    ? path.join(skillRoot, contract.baseStylePath)
    : "";
  const runtimeStylePath = contract.baseStylePath
    ? path.join(
        path.dirname(runtimeExamplePath),
        path.basename(contract.baseStylePath),
      )
    : "";
  const preferredStylePath = sourceStylePath;

  return {
    sourceTemplatePath,
    runtimeExamplePath,
    preferredTemplatePath,
    sourceStylePath,
    runtimeStylePath,
    preferredStylePath,
  };
}

function inferFormalNavigationTargetPaths(formalNavigation = {}) {
  const normalizedShellPath = normalizeRelativePath(
    formalNavigation.formalBusinessShellPath || "",
  );
  const normalizedRegistryPath = normalizeRelativePath(
    formalNavigation.formalNavigationRegistryPath || "",
  );
  const referencePath = normalizedShellPath || normalizedRegistryPath;
  const baseDir = referencePath
    ? path.posix.dirname(referencePath)
    : "src/business-shell";
  const normalizedBaseDir =
    !baseDir || baseDir === "." ? "src/business-shell" : baseDir;
  const detectedExtension = path.posix.extname(
    normalizedShellPath || normalizedRegistryPath,
  );
  const preferredExtension =
    detectedExtension === ".js"
      ? ".jsx"
      : detectedExtension === ".ts"
        ? ".tsx"
        : detectedExtension || ".tsx";

  return {
    targetShellDir: normalizedBaseDir,
    targetShellPath:
      normalizedShellPath ||
      path.posix.join(normalizedBaseDir, `app-frame${preferredExtension}`),
    targetRegistryPath:
      normalizedRegistryPath ||
      path.posix.join(normalizedBaseDir, `routes${preferredExtension}`),
    preferredExtension,
  };
}

function buildHostShellDecision({
  navigationDecision,
  requestedBusiness,
  officialHostSourceReadiness,
}) {
  const targets = inferFormalNavigationTargetPaths(navigationDecision);
  const shellCertification = navigationDecision.shellCertification || "missing";
  const formalShellMigration =
    navigationDecision.formalShellMigration &&
    typeof navigationDecision.formalShellMigration === "object"
      ? navigationDecision.formalShellMigration
      : {
          status: "not-applicable",
          required: false,
          kind: "",
          blockingMode: "none",
          reason: "",
          targetShellPath: "",
          targetCorePath: "",
          targetHostResetPath: "",
          preferredExtension: targets.preferredExtension,
          referenceAppFrameCorePath:
            "examples/host-integration/src/app-frame-core.tsx",
          managedHostImportSource: getManagedLocalRuntimeHostLogicalSource(),
          recommendedStrategy: "",
          recommendedSteps: [],
          evidence: [],
        };
  const hasCertifiedExistingShell = shellCertification === "certified-existing";
  const mustUseThinWrapper = Boolean(
    navigationDecision.shouldAutoCreateFormalBusinessShell ||
      hasCertifiedExistingShell ||
      formalShellMigration.required,
  );
  let status = "no-formal-host-shell-change";
  let materializationStrategy = "none";
  const normalizedOfficialHostSourceReadiness =
    officialHostSourceReadiness &&
    typeof officialHostSourceReadiness === "object"
      ? officialHostSourceReadiness
      : {
          status: "unknown",
          sourceAppFramePath:
            "examples/host-integration/src/app-frame-core.tsx",
          managedHostImportSource: getManagedLocalRuntimeHostLogicalSource(),
          requiredFiles: [],
          missingFiles: [],
          reason: "Official host-shell source readiness was not evaluated.",
        };

  if (navigationDecision.shouldAutoCreateFormalBusinessShell) {
    if (normalizedOfficialHostSourceReadiness.status === "ready") {
      status = "materialize-official-formal-host-shell";
      materializationStrategy = "thin-wrapper-over-managed-local-runtime";
    } else {
      status = "blocked-missing-official-host-source";
      materializationStrategy = "blocked-until-official-host-source-ready";
    }
  } else if (
    navigationDecision.shouldAppendToExistingNavigation ||
    navigationDecision.shouldReuseExistingProjectNavigation
  ) {
    status = "reuse-existing-formal-navigation";
  } else if (navigationDecision.shouldBlockForUncertifiedExistingNavigation) {
    status = formalShellMigration.required
      ? "blocked-requires-formal-shell-migration"
      : "blocked-uncertified-existing-shell";
    materializationStrategy =
      formalShellMigration.recommendedStrategy ||
      (formalShellMigration.required
        ? "migrate-existing-shell-to-managed-host-core"
        : "manual-review-uncertified-shell");
  } else if (navigationDecision.navigationBlocked) {
    status = "blocked-missing-existing-navigation";
  }

  return {
    status,
    materializationStrategy,
    baseHostTemplatePath: navigationDecision.requiredNavigationStyleReference,
    managedHostImportSource:
      normalizedOfficialHostSourceReadiness.managedHostImportSource ||
      getManagedLocalRuntimeHostLogicalSource(),
    managedHostExportName: "TypicalPageAppFrame",
    officialHostSourceStatus: normalizedOfficialHostSourceReadiness.status,
    officialHostSourceReason: normalizedOfficialHostSourceReadiness.reason,
    officialHostSourceRequiredFiles:
      normalizedOfficialHostSourceReadiness.requiredFiles ?? [],
    officialHostSourceMissingFiles:
      normalizedOfficialHostSourceReadiness.missingFiles ?? [],
    targetShellDir: targets.targetShellDir,
    targetShellPath: targets.targetShellPath,
    targetRegistryPath: targets.targetRegistryPath,
    preferredExtension: targets.preferredExtension,
    shellCertification,
    shellCertificationEvidence:
      navigationDecision.shellCertificationEvidence || [],
    formalShellMigration,
    migrationStatus: formalShellMigration.status,
    migrationRequired: formalShellMigration.required === true,
    migrationKind: formalShellMigration.kind || "",
    migrationReason: formalShellMigration.reason || "",
    migrationBlockingMode: formalShellMigration.blockingMode || "none",
    migrationTargetShellPath: formalShellMigration.targetShellPath || "",
    migrationTargetCorePath: formalShellMigration.targetCorePath || "",
    migrationTargetHostResetPath:
      formalShellMigration.targetHostResetPath || "",
    migrationReferenceAppFrameCorePath:
      formalShellMigration.referenceAppFrameCorePath ||
      normalizedOfficialHostSourceReadiness.sourceAppFramePath ||
      "examples/host-integration/src/app-frame-core.tsx",
    migrationRecommendedSteps: Array.isArray(
      formalShellMigration.recommendedSteps,
    )
      ? formalShellMigration.recommendedSteps
      : [],
    sourceAppFramePath: hasCertifiedExistingShell
      ? navigationDecision.formalBusinessShellPath || targets.targetShellPath
      : normalizedOfficialHostSourceReadiness.sourceAppFramePath ||
        "examples/host-integration/src/app-frame-core.tsx",
    mustUseThinWrapper,
    mustNotPrecreateShell:
      navigationDecision.shouldAutoCreateFormalBusinessShell,
    mustKeepPreviewRouteTreeIsolated:
      navigationDecision.previewMustRemainIsolated,
    mustKeepFormalHostShellThinWrapper: mustUseThinWrapper,
    allowedReplacements: navigationDecision.shouldAutoCreateFormalBusinessShell
      ? [
          "businessRoutes data",
          "businessLandingPath",
          "businessShellOptions.brandTitle",
          "businessShellOptions.profileName",
          "businessShellOptions.profileEmail",
          "businessShellOptions.routeBasePath",
          "first generated business page import and element binding",
        ]
      : [],
    lockedRegions: mustUseThinWrapper
      ? [
          "LayoutContentProvider",
          "TypicalPageHostBridge",
          "headerRef / footerRef / titleTextRef",
          "Layout / Sider / SideMenu / FloatMenuContainer shell grammar",
          "styles.root / sider / siderBody / sideMenuWrapper / main / headerSlot / outlet / footerSlot",
        ]
      : [],
    forbiddenPatterns: mustUseThinWrapper
      ? [
          "custom left-nav reassembly",
          "rewriting the host height chain",
          "folding preview routes into formal business routes",
          "adding min-height: 100vh patches to repair formal host height",
          "adding extra overflow-y:auto wrappers around the host outlet",
        ]
      : [],
    firstPageRegistration: {
      title: normalizeString(requestedBusiness?.title),
      routePath: normalizeRelativePath(requestedBusiness?.routePath || ""),
      targetBusinessPath: normalizeRelativePath(
        requestedBusiness?.targetBusinessPath || "",
      ),
    },
  };
}

function mapLegacyQueryControl(control) {
  const normalizedControl = normalizeString(control).toLowerCase();
  if (normalizedControl === "select") return "Select";
  if (normalizedControl === "datepicker" || normalizedControl === "date")
    return "DateRange";
  return "Input";
}

function buildLegacySearchPlaceholder(queryFields = []) {
  const preferredPlaceholders = queryFields
    .filter((field) => field.control === "Input")
    .map((field) => normalizeString(field.placeholder))
    .filter(Boolean);

  if (preferredPlaceholders.length > 0) {
    return preferredPlaceholders[0];
  }

  const preferredLabels = queryFields
    .filter((field) => field.control === "Input")
    .map((field) => normalizeString(field.label))
    .filter(Boolean);

  const fallbackLabels = queryFields
    .map((field) => normalizeString(field.label))
    .filter(Boolean);

  const labels = (
    preferredLabels.length > 0 ? preferredLabels : fallbackLabels
  ).slice(0, 3);
  return labels.join(" / ");
}

function stripBusinessTitleSuffix(title = "") {
  const normalizedTitle = normalizeString(title);
  if (!normalizedTitle) return "";

  return normalizedTitle.replace(
    /(复验|测试|演示|页面|页|工作台|工作台页|管理|列表|查询|总览|看板)$/u,
    "",
  );
}

function buildDefaultTableBasicProfile(title = "") {
  const normalizedTitle = normalizeString(title);
  const entityName =
    stripBusinessTitleSuffix(normalizedTitle) || normalizedTitle || "业务对象";

  if (/供应商|supplier/i.test(normalizedTitle)) {
    return {
      entityName: "供应商",
      queryFields: [
        {
          label: "供应商关键词",
          key: "keyword",
          control: "Input",
          placeholder: "供应商名称 / 供应商编码 / 联系人",
          requestParamKey: "keyword",
        },
        {
          label: "合作状态",
          key: "cooperationStatus",
          control: "Select",
          requestParamKey: "cooperationStatus",
        },
        {
          label: "更新时间",
          key: "updatedAtRange",
          control: "DateRange",
          requestParamKey: "updatedAtRange",
        },
      ],
      tableFields: [
        { label: "供应商名称", key: "supplierName" },
        { label: "供应商编码", key: "supplierCode" },
        { label: "联系人", key: "contactName" },
        { label: "联系电话", key: "contactPhone" },
        { label: "合作状态", key: "cooperationStatusText" },
        { label: "更新时间", key: "updatedAt" },
        { label: "操作", key: "actions" },
      ],
      keywordKeys: ["keyword", "supplierName", "supplierCode", "contactName"],
      rowNameExamples: [
        "华东维保供应链",
        "北京恒准配件服务",
        "深圳智联备件中心",
      ],
    };
  }

  if (/合同|contract/i.test(normalizedTitle)) {
    return {
      entityName: "合同",
      queryFields: [
        {
          label: "合同关键词",
          key: "keyword",
          control: "Input",
          placeholder: "合同名称 / 合同编号 / 负责人",
          requestParamKey: "keyword",
        },
        {
          label: "合同状态",
          key: "contractStatus",
          control: "Select",
          requestParamKey: "contractStatus",
        },
        {
          label: "更新时间",
          key: "updatedAtRange",
          control: "DateRange",
          requestParamKey: "updatedAtRange",
        },
      ],
      tableFields: [
        { label: "合同名称", key: "contractName" },
        { label: "合同编号", key: "contractNo" },
        { label: "合同负责人", key: "ownerName" },
        { label: "合同状态", key: "contractStatusText" },
        { label: "更新时间", key: "updatedAt" },
        { label: "操作", key: "actions" },
      ],
      keywordKeys: ["keyword", "contractName", "contractNo", "ownerName"],
      rowNameExamples: ["年度维保合同", "重点项目合同", "框架采购合同"],
    };
  }

  if (/客户|customer/i.test(normalizedTitle)) {
    return {
      entityName: "客户",
      queryFields: [
        {
          label: "客户关键词",
          key: "keyword",
          control: "Input",
          placeholder: "客户名称 / 客户编号 / 负责人",
          requestParamKey: "keyword",
        },
        {
          label: "客户状态",
          key: "customerStatus",
          control: "Select",
          requestParamKey: "customerStatus",
        },
        {
          label: "更新时间",
          key: "updatedAtRange",
          control: "DateRange",
          requestParamKey: "updatedAtRange",
        },
      ],
      tableFields: [
        { label: "客户名称", key: "customerName" },
        { label: "客户编号", key: "customerCode" },
        { label: "客户负责人", key: "ownerName" },
        { label: "客户状态", key: "customerStatusText" },
        { label: "更新时间", key: "updatedAt" },
        { label: "操作", key: "actions" },
      ],
      keywordKeys: ["keyword", "customerName", "customerCode", "ownerName"],
      rowNameExamples: ["华东核心客户", "重点合作客户", "新增签约客户"],
    };
  }

  if (
    /物流工单|物流单|运单|logistics(?:\s|-)?work(?:\s|-)?order/i.test(
      normalizedTitle,
    )
  ) {
    return {
      entityName: "物流工单",
      queryFields: [
        {
          label: "工单关键词",
          key: "keyword",
          control: "Input",
          placeholder: "工单号 / 物流单号 / 收件人手机号 / 工程师",
          requestParamKey: "keyword",
        },
        {
          label: "物流状态",
          key: "logisticsStatus",
          control: "Select",
          requestParamKey: "logisticsStatus",
        },
        {
          label: "物流类型",
          key: "logisticsType",
          control: "Select",
          requestParamKey: "logisticsType",
        },
        {
          label: "签收状态",
          key: "signStatus",
          control: "Select",
          requestParamKey: "signStatus",
        },
        {
          label: "建单时间",
          key: "createdAtRange",
          control: "DateRange",
          requestParamKey: "createdAtRange",
        },
      ],
      tableFields: [
        { label: "工单号", key: "workOrderNo" },
        { label: "物流单号", key: "logisticsNo" },
        { label: "服务产品", key: "serviceProduct" },
        { label: "收件人手机号", key: "recipientPhone" },
        { label: "履约网点", key: "stationName" },
        { label: "工程师", key: "engineerName" },
        { label: "物流状态", key: "logisticsStatusText" },
        { label: "签收状态", key: "signStatusText" },
        { label: "更新时间", key: "updatedAt" },
        { label: "操作", key: "actions" },
      ],
      keywordKeys: [
        "keyword",
        "workOrderNo",
        "logisticsNo",
        "recipientPhone",
        "engineerName",
      ],
      rowNameExamples: ["上门取件工单", "仓配发货工单", "快递寄修工单"],
    };
  }

  return {
    entityName,
    queryFields: [
      {
        label: `${entityName}关键词`,
        key: "keyword",
        control: "Input",
        placeholder: `${entityName}名称 / ${entityName}编号`,
        requestParamKey: "keyword",
      },
      {
        label: "状态",
        key: "status",
        control: "Select",
        requestParamKey: "status",
      },
      {
        label: "更新时间",
        key: "updatedAtRange",
        control: "DateRange",
        requestParamKey: "updatedAtRange",
      },
    ],
    tableFields: [
      { label: `${entityName}名称`, key: "entityName" },
      { label: `${entityName}编号`, key: "entityCode" },
      { label: "负责人", key: "ownerName" },
      { label: "状态", key: "statusText" },
      { label: "更新时间", key: "updatedAt" },
      { label: "操作", key: "actions" },
    ],
    keywordKeys: ["keyword", "entityName", "entityCode", "ownerName"],
    rowNameExamples: [
      `${entityName}一部`,
      `${entityName}二部`,
      `${entityName}三部`,
    ],
  };
}

function buildBusinessSlotSemanticReadiness({
  pageTypeId = "",
  planStatus = "",
  source = "",
  semanticEvidence = [],
  legacyReconstructionInput = null,
  migrationInvariantContract = null,
} = {}) {
  const normalizedPageTypeId = normalizeString(pageTypeId);
  const normalizedPlanStatus = normalizeString(planStatus);
  const normalizedSource = normalizeString(source);
  const normalizedSemanticEvidence = Array.isArray(semanticEvidence)
    ? semanticEvidence.map((item) => normalizeString(item)).filter(Boolean)
    : [];
  const legacyFacts = legacyReconstructionInput?.legacyFacts || {};
  const hasLegacyCriticalSlotFacts =
    normalizeObjectArray(legacyFacts.queryFacts).length > 0 ||
    normalizeObjectArray(legacyFacts.tableFacts).length > 0 ||
    normalizeObjectArray(legacyFacts.interactionContracts).some((item) => {
      const trigger = normalizeString(item?.trigger);
      const kind = normalizeString(item?.kind);
      return (
        trigger === "click:table-primary-link" ||
        trigger.startsWith("click:header-action") ||
        ["navigate", "open-drawer", "export"].includes(kind)
      );
    });
  const hasLegacyFullPageEditFacts =
    normalizeObjectArray(legacyFacts.queryFacts).length > 0 ||
    normalizeObjectArray(legacyFacts.formFacts).length > 0 ||
    normalizeObjectArray(legacyFacts.detailFacts).length > 0 ||
    normalizeObjectArray(legacyFacts.apiContracts).length > 0;

  if (!normalizedPageTypeId || normalizedPlanStatus === "missing-page-type") {
    return {
      status: "blocked",
      ready: false,
      blockedBy: ["missing-page-type"],
      reason:
        "Business slot semantics are incomplete because the target page type is still missing.",
      recommendedAction: "confirm-page-type-before-business-replacement",
    };
  }

  if (
    normalizedSource.startsWith("page-type-default-fallback:") &&
    migrationInvariantContract?.mustKeepInteractionSemantics === true &&
    hasLegacyCriticalSlotFacts
  ) {
    return {
      status: "blocked",
      ready: false,
      blockedBy: ["legacy-fact-consumption-blocked"],
      reason:
        "Legacy reconstruction already extracted critical old-page business facts, but business-slot planning still fell back to the page-type default template instead of consuming those facts.",
      recommendedAction: "fix-legacy-fact-consumption-before-write",
      evidence: unique([
        ...normalizedSemanticEvidence,
        normalizeObjectArray(legacyFacts.queryFacts).length > 0
          ? "legacy-query-facts"
          : "",
        normalizeObjectArray(legacyFacts.tableFacts).length > 0
          ? "legacy-table-facts"
          : "",
        normalizeObjectArray(legacyFacts.interactionContracts).length > 0
          ? "legacy-interaction-facts"
          : "",
      ]),
    };
  }

  if (
    normalizedPageTypeId === "full-page-edit" &&
    normalizedSource === "generic-page-type-plan" &&
    hasLegacyFullPageEditFacts
  ) {
    return {
      status: "blocked",
      ready: false,
      blockedBy: ["full-page-edit-legacy-slot-plan-generic-fallback"],
      reason:
        "Legacy reconstruction already extracted full-page-edit business facts, but business-slot planning still fell back to a generic full-page-edit plan. This usually means the generator is about to keep the shell while losing real business semantics.",
      recommendedAction: "fix-full-page-edit-legacy-business-slot-consumption-before-write",
      evidence: unique([
        ...normalizedSemanticEvidence,
        normalizeObjectArray(legacyFacts.queryFacts).length > 0
          ? "legacy-query-facts"
          : "",
        normalizeObjectArray(legacyFacts.formFacts).length > 0
          ? "legacy-form-facts"
          : "",
        normalizeObjectArray(legacyFacts.detailFacts).length > 0
          ? "legacy-detail-facts"
          : "",
        normalizeObjectArray(legacyFacts.apiContracts).length > 0
          ? "legacy-api-contracts"
          : "",
      ]),
    };
  }

  if (normalizedSource.startsWith("page-type-default-fallback:")) {
    return {
      status: "review-required",
      ready: true,
      blockedBy: [],
      warningBy: ["page-type-default-fallback"],
      reason:
        "Current page is using page-type default business semantics. Writing can continue, but the generated fields and mock data should be reviewed before delivery.",
      recommendedAction: "review-generated-business-semantics",
      evidence: normalizedSemanticEvidence,
      requiresReview: true,
    };
  }

  if (
    normalizedSource === "generic-page-type-plan" ||
    normalizedPlanStatus === "generic"
  ) {
    if (normalizedSemanticEvidence.length > 0) {
      return {
        status: "ready",
        ready: true,
        blockedBy: [],
        reason: "",
        recommendedAction: "none",
        evidence: normalizedSemanticEvidence,
      };
    }

    return {
      status: "review-required",
      ready: true,
      blockedBy: [],
      warningBy: ["generic-business-slot-plan"],
      reason:
        "Current page is using generic page-type business semantics. Writing can continue, but the generated business fields and mock data should be reviewed before delivery.",
      recommendedAction: "review-generated-business-semantics",
      requiresReview: true,
    };
  }

  return {
    status: "ready",
    ready: true,
    blockedBy: [],
    reason: "",
    recommendedAction: "none",
    evidence: normalizedSemanticEvidence,
  };
}

function scoreLegacyListRequestApiContract(contract = {}) {
  const apiId = normalizeString(contract?.id);
  const sourcePath = normalizeString(contract?.sourcePath);
  if (!apiId || /export/i.test(apiId)) return Number.NEGATIVE_INFINITY;

  let score = 0;
  if (/(detail|save|submit|update|edit|delete|remove|create|add)/i.test(apiId))
    score -= 8;
  if (/(list|page|query|search|records|items|rows)/i.test(apiId)) score += 6;
  if (/(fetch|get|query|load)[A-Z_a-z][\w$]*s$/u.test(apiId)) score += 3;
  if (/(list-page|\/list|index\.tsx|table)/i.test(sourcePath)) score += 2;
  return score;
}

function selectLegacyListRequestApiContract(apiContracts = []) {
  const candidates = normalizeObjectArray(apiContracts).filter(
    (item) => !/export/i.test(normalizeString(item?.id)),
  );
  if (candidates.length === 0) return null;

  return [...candidates].sort((left, right) => {
    const scoreDiff =
      scoreLegacyListRequestApiContract(right) -
      scoreLegacyListRequestApiContract(left);
    if (scoreDiff !== 0) return scoreDiff;
    return normalizeString(left?.id).localeCompare(normalizeString(right?.id));
  })[0];
}

function normalizeLegacySubmitActionContract(contract = {}) {
  const normalizedConfirmDialog = isPlainObject(contract?.confirmDialog)
    ? {
        type: normalizeString(contract.confirmDialog.type),
        title: normalizeString(contract.confirmDialog.title),
        contentExpression: normalizeString(
          contract.confirmDialog.contentExpression,
        ),
        contentSource: normalizeString(contract.confirmDialog.contentSource),
        contentSourceModule: normalizeString(
          contract.confirmDialog.contentSourceModule,
        ),
        contentSourcePath: normalizeString(
          contract.confirmDialog.contentSourcePath,
        ),
        cancelText: normalizeString(contract.confirmDialog.cancelText),
        confirmText: normalizeString(contract.confirmDialog.confirmText),
      }
    : {};
  const normalizedDetailLoad = isPlainObject(contract?.detailLoad)
    ? {
        recordBinding: normalizeString(contract.detailLoad.recordBinding),
        apiId: normalizeString(contract.detailLoad.apiId),
        apiSourceModule: normalizeString(contract.detailLoad.apiSourceModule),
        apiSourcePath: normalizeString(contract.detailLoad.apiSourcePath),
        requestArgSource: normalizeString(contract.detailLoad.requestArgSource),
        errorMessage: normalizeString(contract.detailLoad.errorMessage),
      }
    : {};
  const normalizedSnapshotParse = isPlainObject(contract?.snapshotParse)
    ? {
        snapshotBinding: normalizeString(
          contract.snapshotParse.snapshotBinding,
        ),
        adapterBinding: normalizeString(contract.snapshotParse.adapterBinding),
        adapterResolver: normalizeString(
          contract.snapshotParse.adapterResolver,
        ),
        adapterResolverSourceModule: normalizeString(
          contract.snapshotParse.adapterResolverSourceModule,
        ),
        adapterResolverSourcePath: normalizeString(
          contract.snapshotParse.adapterResolverSourcePath,
        ),
        adapterResolverArgSource: normalizeString(
          contract.snapshotParse.adapterResolverArgSource,
        ),
        parseMethod: normalizeString(contract.snapshotParse.parseMethod),
        parseArgSource: normalizeString(contract.snapshotParse.parseArgSource),
        errorMessage: normalizeString(contract.snapshotParse.errorMessage),
        submitGuardMessage: normalizeString(
          contract.snapshotParse.submitGuardMessage,
        ),
      }
    : {};
  const normalizedSubmitExecute = isPlainObject(contract?.submitExecute)
    ? {
        successBinding: normalizeString(contract.submitExecute.successBinding),
        receiverSource: normalizeString(contract.submitExecute.receiverSource),
        submitMethod: normalizeString(contract.submitExecute.submitMethod),
        args: normalizeStringArray(contract.submitExecute.args),
        successCondition: normalizeString(
          contract.submitExecute.successCondition,
        ),
      }
    : {};
  const normalizedSuccessRefresh = isPlainObject(contract?.successRefresh)
    ? {
        kind: normalizeString(contract.successRefresh.kind),
        refreshHandler: normalizeString(contract.successRefresh.refreshHandler),
        successMessage: normalizeString(contract.successRefresh.successMessage),
      }
    : {};

  return {
    sourceHandler: normalizeString(contract?.sourceHandler),
    confirmDialog: normalizedConfirmDialog,
    detailLoad: normalizedDetailLoad,
    snapshotParse: normalizedSnapshotParse,
    submitExecute: normalizedSubmitExecute,
    successRefresh: normalizedSuccessRefresh,
  };
}

function getLegacySubmitActionContractMissingFields(contract = {}) {
  const missingFields = [];
  const confirmDialog = isPlainObject(contract?.confirmDialog)
    ? contract.confirmDialog
    : {};
  const detailLoad = isPlainObject(contract?.detailLoad)
    ? contract.detailLoad
    : {};
  const snapshotParse = isPlainObject(contract?.snapshotParse)
    ? contract.snapshotParse
    : {};
  const submitExecute = isPlainObject(contract?.submitExecute)
    ? contract.submitExecute
    : {};
  const successRefresh = isPlainObject(contract?.successRefresh)
    ? contract.successRefresh
    : {};

  if (!normalizeString(confirmDialog.type))
    missingFields.push("confirmDialog.type");
  if (!normalizeString(confirmDialog.title))
    missingFields.push("confirmDialog.title");
  if (!normalizeString(confirmDialog.contentExpression))
    missingFields.push("confirmDialog.contentExpression");
  if (!normalizeString(confirmDialog.cancelText))
    missingFields.push("confirmDialog.cancelText");
  if (!normalizeString(confirmDialog.confirmText))
    missingFields.push("confirmDialog.confirmText");

  if (!normalizeString(detailLoad.apiId))
    missingFields.push("detailLoad.apiId");
  if (!normalizeString(detailLoad.apiSourceModule))
    missingFields.push("detailLoad.apiSourceModule");
  if (!normalizeString(detailLoad.requestArgSource))
    missingFields.push("detailLoad.requestArgSource");

  if (!normalizeString(snapshotParse.adapterResolver))
    missingFields.push("snapshotParse.adapterResolver");
  if (!normalizeString(snapshotParse.adapterResolverSourceModule))
    missingFields.push("snapshotParse.adapterResolverSourceModule");
  if (!normalizeString(snapshotParse.adapterResolverArgSource))
    missingFields.push("snapshotParse.adapterResolverArgSource");
  if (!normalizeString(snapshotParse.parseMethod))
    missingFields.push("snapshotParse.parseMethod");
  if (!normalizeString(snapshotParse.parseArgSource))
    missingFields.push("snapshotParse.parseArgSource");

  if (!normalizeString(submitExecute.submitMethod))
    missingFields.push("submitExecute.submitMethod");
  if (normalizeStringArray(submitExecute.args).length === 0)
    missingFields.push("submitExecute.args");

  if (!normalizeString(successRefresh.refreshHandler))
    missingFields.push("successRefresh.refreshHandler");
  if (!normalizeString(successRefresh.successMessage))
    missingFields.push("successRefresh.successMessage");

  return unique(missingFields.filter(Boolean));
}

function buildLegacyBasicTableBusinessSlotPlan({
  title,
  legacyReconstructionInput,
}) {
  const legacyFacts = legacyReconstructionInput?.legacyFacts || {};
  const queryFields = normalizeObjectArray(legacyFacts.queryFacts)
    .map((fact) => ({
      label: normalizeString(fact.label || fact.field),
      key: normalizeString(fact.fieldKey || fact.requestParamKey || fact.field),
      control: mapLegacyQueryControl(fact.control),
      placeholder: normalizeString(fact.placeholder),
      requestParamKey: normalizeString(
        fact.requestParamKey || fact.fieldKey || fact.field,
      ),
      fieldKey: normalizeString(
        fact.fieldKey || fact.requestParamKey || fact.field,
      ),
      searchable: fact.searchable === true,
      asyncOptions: fact.asyncOptions === true,
      optionApiId: normalizeString(fact.optionApiId),
      dependsOn: normalizeStringArray(fact.dependsOn),
      clearable: fact.clearable === true,
      startRequestParamKey: normalizeString(fact.startRequestParamKey),
      endRequestParamKey: normalizeString(fact.endRequestParamKey),
    }))
    .filter(
      (fact) => fact.label && fact.key && /^[A-Za-z_$][\w$]*$/.test(fact.key),
    );
  const tableFields = normalizeObjectArray(legacyFacts.tableFacts)
    .map((fact) => ({
      label: normalizeString(fact.title || fact.label),
      key: normalizeString(fact.columnKey || fact.key),
    }))
    .filter((fact) => fact.label && fact.key);

  if (queryFields.length === 0 || tableFields.length === 0) {
    return null;
  }

  const interactionContracts = normalizeObjectArray(
    legacyFacts.interactionContracts,
  );
  const apiContracts = normalizeObjectArray(legacyFacts.apiContracts);
  const detailFacts = normalizeObjectArray(legacyFacts.detailFacts);
  const headerActions = [];
  const legacyActionGaps = [];
  const rowActions = [];
  for (const interaction of interactionContracts) {
    const kind = normalizeString(interaction.kind);
    const trigger = normalizeString(interaction.trigger);
    const effect = normalizeString(interaction.effect);
    const isExportInteraction =
      kind === "export" ||
      trigger === "click:export" ||
      /^request:export/i.test(effect);
    if (isExportInteraction) {
      headerActions.push({
        key: normalizeString(interaction.key) || "export",
        label: normalizeString(interaction.label) || "导出",
        kind: "export",
        effect: effect || "request:export",
        sourceHandler:
          normalizeString(interaction.sourceHandler) || "handleExport",
        apiId:
          effect.replace(/^request:/, "") ||
          normalizeString(
            apiContracts.find((item) =>
              /export/i.test(normalizeString(item.id)),
            )?.id,
          ),
      });
      continue;
    }
    if (trigger === "click:row-action:edit") {
      const routePath = normalizeString(interaction.routePath);
      if (!routePath) {
        legacyActionGaps.push({
          key: normalizeString(interaction.key || "rowActionEdit"),
          label: normalizeString(interaction.label) || "编辑",
          kind: "row-action-edit",
          sourceHandler: normalizeString(interaction.sourceHandler),
          effect: normalizeString(interaction.effect),
        });
        continue;
      }
      rowActions.push({
        key: normalizeString(interaction.key || "rowActionEdit"),
        label: normalizeString(interaction.label) || "编辑",
        kind: "navigate",
        effect: normalizeString(interaction.effect) || `navigate:${routePath}`,
        sourceHandler: normalizeString(interaction.sourceHandler),
        routePath,
        targetTitle: normalizeString(
          interaction.targetTitle || interaction.label,
        ),
      });
      continue;
    }

    if (trigger === "click:row-action:submit") {
      const submitActionContract = normalizeLegacySubmitActionContract(
        interaction.submitActionContract,
      );
      const missingFields =
        getLegacySubmitActionContractMissingFields(submitActionContract);
      if (missingFields.length > 0) {
        legacyActionGaps.push({
          key: normalizeString(interaction.key || "rowActionSubmit"),
          label: normalizeString(interaction.label) || "提交",
          kind: "row-action-submit",
          sourceHandler: normalizeString(interaction.sourceHandler),
          effect: normalizeString(interaction.effect),
          missingFields,
        });
        continue;
      }
      rowActions.push({
        key: normalizeString(interaction.key || "rowActionSubmit"),
        label: normalizeString(interaction.label) || "提交",
        kind: "submit",
        effect: normalizeString(interaction.effect) || "action:submit",
        sourceHandler: normalizeString(interaction.sourceHandler),
        submitActionContract,
      });
      continue;
    }

    if (!kind) continue;
    if (kind === "unresolved") {
      legacyActionGaps.push({
        key: normalizeString(interaction.key),
        label: normalizeString(interaction.label),
        kind,
        sourceHandler: normalizeString(interaction.sourceHandler),
        effect: normalizeString(interaction.effect),
      });
      continue;
    }
    if (kind === "navigate") {
      if (trigger === "click:table-primary-link") continue;
      const routePath = normalizeString(interaction.routePath);
      if (!routePath) {
        legacyActionGaps.push({
          key: normalizeString(interaction.key),
          label: normalizeString(interaction.label),
          kind,
          sourceHandler: normalizeString(interaction.sourceHandler),
          effect: normalizeString(interaction.effect),
        });
        continue;
      }
      headerActions.push({
        key: normalizeString(interaction.key) || "legacyNavigate",
        label: normalizeString(interaction.label),
        kind,
        effect: normalizeString(interaction.effect) || `navigate:${routePath}`,
        sourceHandler: normalizeString(interaction.sourceHandler),
        routePath,
        targetTitle: normalizeString(
          interaction.targetTitle || interaction.label,
        ),
      });
      continue;
    }
    if (kind === "open-drawer") {
      if (
        !normalizeString(interaction.drawerComponent) ||
        !normalizeString(interaction.drawerImportSource)
      ) {
        legacyActionGaps.push({
          key: normalizeString(interaction.key),
          label: normalizeString(interaction.label),
          kind,
          sourceHandler: normalizeString(interaction.sourceHandler),
          effect: normalizeString(interaction.effect),
        });
        continue;
      }
      headerActions.push({
        key: normalizeString(interaction.key) || "legacyOpenDrawer",
        label: normalizeString(interaction.label),
        kind,
        effect:
          normalizeString(interaction.effect) ||
          `open:drawer:${normalizeString(interaction.drawerComponent)}`,
        sourceHandler: normalizeString(interaction.sourceHandler),
        drawerComponent: normalizeString(interaction.drawerComponent),
        drawerImportSource: normalizeString(interaction.drawerImportSource),
      });
    }
  }

  const keywordKeys = unique(
    [
      ...queryFields
        .filter((field) => field.control === "Input")
        .map((field) => normalizeString(field.key)),
      ...tableFields.slice(0, 3).map((field) => normalizeString(field.key)),
    ].filter(Boolean),
  );

  const statusFieldKeys = tableFields
    .filter((field) => /状态|status/i.test(`${field.label} ${field.key}`))
    .map((field) => field.key);
  const listRequestApiContract =
    selectLegacyListRequestApiContract(apiContracts);
  const exportHeaderAction =
    headerActions.find((item) => normalizeString(item.kind) === "export") ||
    null;
  const exportApiContract =
    apiContracts.find(
      (item) =>
        normalizeString(item.id) === normalizeString(exportHeaderAction?.apiId),
    ) ||
    apiContracts.find((item) => /export/i.test(normalizeString(item.id))) ||
    null;
  const primaryLinkInteraction =
    interactionContracts.find(
      (item) => normalizeString(item.trigger) === "click:table-primary-link",
    ) || null;
  const detailRoutePath = normalizeString(
    primaryLinkInteraction?.routePath ||
      detailFacts.find(
        (item) => normalizeString(item.kind) === "detail-page-route",
      )?.routePath,
  );
  const detailTargetTitle = normalizeString(
    primaryLinkInteraction?.targetTitle,
  );
  const rowActionFieldKey =
    tableFields.find(
      (field) =>
        /^(操作|actions?|operation)$/i.test(normalizeString(field.label)) ||
        /^(actions?|operation)$/i.test(normalizeString(field.key)),
    )?.key || "";

  return {
    status: "planned",
    source: "legacy-reconstruction-facts",
    semanticReadiness: buildBusinessSlotSemanticReadiness({
      pageTypeId: "table-basic",
      planStatus: "planned",
      source: "legacy-reconstruction-facts",
    }),
    mustReplaceAllowedBusinessSlots: true,
    allowedSlots: [
      "title",
      "queryFields",
      "tableFields",
      "searchPlaceholder",
      "headerActions",
      "listRequest",
      "mockData",
    ],
    replacementTheme: "legacy-business-facts",
    title: normalizeString(legacyFacts.titleDraft) || normalizeString(title),
    searchPlaceholder: buildLegacySearchPlaceholder(queryFields),
    queryFields,
    tableFields,
    headerActions,
    legacyActionGaps,
    keywordKeys,
    statusFieldKeys,
    primaryLinkFieldKey: interactionContracts.find(
      (item) => item.trigger === "click:table-primary-link",
    )
      ? tableFields[0]?.key || ""
      : "",
    detailRoutePath,
    detailTargetTitle,
    rowActionFieldKey,
    rowActions,
    listRequestApiId: normalizeString(listRequestApiContract?.id),
    listRequestApiSourceModule: normalizeString(
      listRequestApiContract?.sourceModule,
    ),
    listRequestApiSourcePath: normalizeString(
      listRequestApiContract?.sourcePath,
    ),
    exportApiId: normalizeString(
      exportApiContract?.id || exportHeaderAction?.apiId,
    ),
    exportApiSourceModule: normalizeString(exportApiContract?.sourceModule),
    exportApiSourcePath: normalizeString(exportApiContract?.sourcePath),
    mockDataTheme: {
      entityName:
        normalizeString(legacyFacts.titleDraft) || normalizeString(title),
    },
    forbiddenVisibleResiduals: [
      "用户姓名",
      "用户角色",
      "新增用户",
      "岗位名称",
      "邮箱",
      "用户电话",
    ],
  };
}

function toLegacyGeneratedIdentifier(value, fallback = "legacyBusiness") {
  const normalized = normalizeString(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((segment, index) =>
      index === 0
        ? segment.charAt(0).toLowerCase() + segment.slice(1)
        : segment.charAt(0).toUpperCase() + segment.slice(1),
    )
    .join("");

  return normalized || fallback;
}

function toLegacyPascalIdentifier(value, fallback = "LegacyBusiness") {
  const normalized = toLegacyGeneratedIdentifier(value, fallback.toLowerCase());
  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : fallback;
}

function inferLegacyBusinessIdentifier({ title, legacyReconstructionInput } = {}) {
  const sourceRoute = normalizeString(
    legacyReconstructionInput?.evidence?.sourceRoute,
  );
  const sourceCodePaths = normalizeStringArray(
    legacyReconstructionInput?.evidence?.sourceCodePaths,
  );
  const routeTail = sourceRoute.split("/").pop().replace(/^@+/u, "");
  const firstSourceCodePath = sourceCodePaths[0] || "";
  const sourceDirName = firstSourceCodePath
    ? path.basename(path.dirname(firstSourceCodePath))
    : "";
  const titleSeed = stripBusinessTitleSuffix(normalizeString(title));

  return (
    toLegacyGeneratedIdentifier(routeTail, "") ||
    toLegacyGeneratedIdentifier(sourceDirName, "") ||
    toLegacyGeneratedIdentifier(titleSeed, "") ||
    "legacyBusiness"
  );
}

function scoreLegacySubmitApiContract(contract = {}) {
  const apiId = normalizeString(contract?.id);
  const purpose = normalizeString(contract?.purpose);
  const sourcePath = normalizeString(contract?.sourcePath);
  if (!apiId) return Number.NEGATIVE_INFINITY;

  let score = 0;
  if (/(submit|save|send|dispatch|create|apply)/i.test(apiId)) score += 8;
  if (/(submit|save|send|dispatch|create|apply)/i.test(purpose)) score += 10;
  if (/(detail|query|get|load|list|page|search|export)/i.test(apiId)) score -= 6;
  if (/(detail|query|get|load|list|page|search|export)/i.test(purpose))
    score -= 6;
  if (/(submit|dispatch|edit|form|index\.(jsx|tsx))/i.test(sourcePath)) score += 2;
  return score;
}

function selectLegacySubmitApiContract(apiContracts = []) {
  const candidates = normalizeObjectArray(apiContracts);
  if (candidates.length === 0) return null;

  return [...candidates].sort((left, right) => {
    const scoreDiff =
      scoreLegacySubmitApiContract(right) - scoreLegacySubmitApiContract(left);
    if (scoreDiff !== 0) return scoreDiff;
    return normalizeString(left?.id).localeCompare(normalizeString(right?.id));
  })[0];
}

function resolveLegacyFullPageEditOptionApiContract(field = {}, apiContracts = []) {
  const explicitApiId = normalizeString(field.optionApiId);
  if (explicitApiId) {
    return (
      normalizeObjectArray(apiContracts).find(
        (item) => normalizeString(item?.id) === explicitApiId,
      ) || null
    );
  }

  const matcher = `${normalizeString(field.label)} ${normalizeString(field.key)}`;
  const candidates = normalizeObjectArray(apiContracts);
  const purposeMatchers = [];

  if (/原因|reason/i.test(matcher)) {
    purposeMatchers.push(/reason/i, /dispatch-reason/i);
  }
  if (/工程师|engineer|person|user/i.test(matcher)) {
    purposeMatchers.push(/engineer/i, /user/i, /person/i);
  }
  if (/物料库|仓库|storage|warehouse/i.test(matcher)) {
    purposeMatchers.push(/storage/i, /warehouse/i);
  }

  for (const purposeMatcher of purposeMatchers) {
    const matchedContract =
      candidates.find((item) => purposeMatcher.test(normalizeString(item?.purpose))) ||
      candidates.find((item) => purposeMatcher.test(normalizeString(item?.id)));
    if (matchedContract) return matchedContract;
  }

  return null;
}

function inferLegacyFullPageEditActionKind(label = "") {
  const normalizedLabel = normalizeString(label);
  if (/串号|imei|sn/iu.test(normalizedLabel)) return "textarea";
  if (/物料|商品/iu.test(normalizedLabel)) return "check-select";
  return "text";
}

function resolveLegacyFullPageEditSuccessMessage(title = "", fallback = "提交") {
  const normalizedTitle = normalizeString(title);
  if (!normalizedTitle) return `表单已${fallback}`;
  return `${normalizedTitle}已${fallback}`;
}

function buildLegacyFullPageEditBusinessSlotPlan({
  title,
  legacyReconstructionInput,
  migrationInvariantContract = null,
}) {
  const legacyFacts = legacyReconstructionInput?.legacyFacts || {};
  const queryFields = normalizeObjectArray(legacyFacts.queryFacts)
    .map((fact, index) => {
      const label = normalizeString(fact.label || fact.field);
      const key =
        normalizeString(fact.fieldKey || fact.requestParamKey || fact.field) ||
        `field${index + 1}`;
      if (!label || !key) return null;
      const optionApiContract = resolveLegacyFullPageEditOptionApiContract(
        fact,
        legacyFacts.apiContracts,
      );

      return {
        label,
        key,
        control: mapLegacyQueryControl(fact.control),
        placeholder: normalizeString(fact.placeholder),
        requestParamKey: normalizeString(
          fact.requestParamKey || fact.fieldKey || fact.field,
        ),
        fieldKey: key,
        required: fact.required !== false,
        searchable: fact.searchable === true,
        clearable: fact.clearable === true,
        optionApiId:
          normalizeString(fact.optionApiId) ||
          normalizeString(optionApiContract?.id),
        optionApiSourceModule: normalizeString(optionApiContract?.sourceModule),
        optionApiSourcePath: normalizeString(optionApiContract?.sourcePath),
      };
    })
    .filter(Boolean);
  const detailTableFields = normalizeObjectArray(legacyFacts.tableFacts)
    .map((fact) => ({
      label: normalizeString(fact.title || fact.label),
      key: normalizeString(fact.columnKey || fact.key),
    }))
    .filter((fact) => fact.label && fact.key);
  const formFacts = normalizeObjectArray(legacyFacts.formFacts);
  const detailFacts = normalizeObjectArray(legacyFacts.detailFacts);
  const interactionContracts = normalizeObjectArray(legacyFacts.interactionContracts);
  const apiContracts = normalizeObjectArray(legacyFacts.apiContracts);

  if (
    queryFields.length === 0 &&
    detailTableFields.length === 0 &&
    formFacts.length === 0
  ) {
    return null;
  }

  const pageTitle =
    normalizeString(legacyFacts.titleDraft) || normalizeString(title);
  const businessIdentifier = inferLegacyBusinessIdentifier({
    title: pageTitle,
    legacyReconstructionInput,
  });
  const businessIdentifierPascal = toLegacyPascalIdentifier(
    businessIdentifier,
    "LegacyBusiness",
  );
  const remarkFact =
    formFacts.find((item) =>
      /(备注|说明)/u.test(normalizeString(item.label || item.key)),
    ) || null;
  const detailModes = formFacts
    .filter((item) =>
      /(添加|串号|物料|商品|imei|sn)/iu.test(
        normalizeString(item.label || item.key),
      ),
    )
    .map((item, index) => ({
      id:
        normalizeString(item.key) ||
        `${businessIdentifier}-mode-${index + 1}`,
      title: normalizeString(item.label || item.key),
      kind: inferLegacyFullPageEditActionKind(item.label || item.key),
    }))
    .filter((item) => item.title);
  const submitInteraction =
    interactionContracts.find(
      (item) => normalizeString(item.trigger) === "click:footer-submit",
    ) || null;
  const stashInteraction =
    interactionContracts.find(
      (item) =>
        normalizeString(item.trigger) === "click:footer-stash" ||
        normalizeString(item.kind) === "stash",
    ) || null;
  const submitApiContract = selectLegacySubmitApiContract(apiContracts);
  const semanticEvidence = [
    queryFields.length > 0 ? "legacy-query-facts" : "",
    detailTableFields.length > 0 ? "legacy-table-facts" : "",
    formFacts.length > 0 ? "legacy-form-facts" : "",
    detailFacts.length > 0 ? "legacy-detail-facts" : "",
  ].filter(Boolean);

  return {
    status: "planned",
    source: "legacy-reconstruction-facts:full-page-edit",
    semanticReadiness: buildBusinessSlotSemanticReadiness({
      pageTypeId: "full-page-edit",
      planStatus: "planned",
      source: "legacy-reconstruction-facts:full-page-edit",
      semanticEvidence,
      legacyReconstructionInput,
      migrationInvariantContract,
    }),
    mustReplaceAllowedBusinessSlots: true,
    allowedSlots: [
      "title",
      "detailRequest",
      "submitRequest",
      "stashRequest",
      "mockData",
    ],
    replacementTheme: "legacy-full-page-edit-facts",
    title: pageTitle,
    businessIdentifier,
    queryFields,
    baseFields: queryFields,
    detailTableFields,
    tableFields: detailTableFields,
    detailModes,
    remarkField: remarkFact
      ? {
          label: normalizeString(remarkFact.label || "备注"),
          key:
            normalizeString(
              remarkFact.fieldKey ||
                remarkFact.requestParamKey ||
                remarkFact.key,
            ) || "remark",
          control: "Textarea",
          required: false,
        }
      : null,
    detailRequestFunctionName: `get${businessIdentifierPascal}InitialDetail`,
    submitRequestFunctionName:
      normalizeString(submitApiContract?.id) ||
      `submit${businessIdentifierPascal}`,
    submitApiId: normalizeString(submitApiContract?.id),
    submitApiSourceModule: normalizeString(submitApiContract?.sourceModule),
    submitApiSourcePath: normalizeString(submitApiContract?.sourcePath),
    stashRequestFunctionName: `stash${businessIdentifierPascal}Draft`,
    stashEnabled: Boolean(stashInteraction),
    submitActionLabel: normalizeString(submitInteraction?.label) || "提交",
    submitSuccessMessage: resolveLegacyFullPageEditSuccessMessage(
      pageTitle,
      "提交",
    ),
    stashSuccessMessage: "草稿已保存",
    pageGoal: normalizeString(legacyFacts.pageGoal),
    forbiddenVisibleResiduals: [
      "工单号",
      "工单状态",
      "工单类型",
      "服务方式",
      "关联商品",
      "购买渠道",
      "三包开始时间",
      "三包截止时间",
      "来访原因",
      "用户姓名",
      "用户标签",
      "用户电话",
      "服务机构",
      "受理时间",
      "问题描述",
    ],
  };
}

function buildDefaultBasicTableBusinessSlotPlan({ title }) {
  const profile = buildDefaultTableBasicProfile(title);

  return {
    status: "planned",
    source: "page-type-default-fallback:table-basic",
    semanticReadiness: buildBusinessSlotSemanticReadiness({
      pageTypeId: "table-basic",
      planStatus: "planned",
      source: "page-type-default-fallback:table-basic",
      semanticEvidence: [
        "page-type-default-fallback",
        "title-derived-business-entity",
      ],
    }),
    mustReplaceAllowedBusinessSlots: true,
    allowedSlots: [
      "title",
      "queryFields",
      "tableFields",
      "searchPlaceholder",
      "headerActions",
      "listRequest",
      "mockData",
    ],
    replacementTheme: "page-type-default-fallback",
    title: normalizeString(title),
    searchPlaceholder: buildLegacySearchPlaceholder(profile.queryFields),
    queryFields: profile.queryFields,
    tableFields: profile.tableFields,
    headerActions: [{ key: "export", label: "导出" }],
    keywordKeys: profile.keywordKeys,
    statusFieldKeys: profile.tableFields
      .filter((field) => /状态|status/i.test(`${field.label} ${field.key}`))
      .map((field) => field.key),
    primaryLinkFieldKey: "",
    detailRoutePath: "",
    listRequestApiId: "",
    listRequestApiSourceModule: "",
    listRequestApiSourcePath: "",
    exportApiId: "",
    exportApiSourceModule: "",
    exportApiSourcePath: "",
    mockDataTheme: {
      entityName: profile.entityName,
      rowNameExamples: profile.rowNameExamples,
    },
    forbiddenVisibleResiduals: [
      "用户姓名",
      "用户角色",
      "新增用户",
      "岗位名称",
      "邮箱",
      "用户电话",
      "工程师",
      "建单量",
      "签收量",
    ],
  };
}

function buildBusinessSlotPlan({
  pageTypeId,
  title,
  legacyReconstructionInput = null,
  migrationInvariantContract = null,
  detailSections = [],
}) {
  const normalizedPageTypeId = normalizeString(pageTypeId);
  const normalizedTitle = normalizeString(title);
  const isSalesManagement = /销售|sale|sales|商机|客户|订单/i.test(
    normalizedTitle,
  );
  const semanticEvidence = [];

  if (
    normalizedPageTypeId === "full-page-detail" &&
    Array.isArray(detailSections) &&
    detailSections.length > 0
  ) {
    semanticEvidence.push("detail-sections");
  }

  const legacyBusinessSlotPlan = buildLegacyBasicTableBusinessSlotPlan({
    title: normalizedTitle,
    legacyReconstructionInput,
  });
  const legacyFullPageEditBusinessSlotPlan =
    buildLegacyFullPageEditBusinessSlotPlan({
      title: normalizedTitle,
      legacyReconstructionInput,
      migrationInvariantContract,
    });
  if (
    normalizedPageTypeId === "full-page-edit" &&
    legacyFullPageEditBusinessSlotPlan
  ) {
    return legacyFullPageEditBusinessSlotPlan;
  }
  if (normalizedPageTypeId === "table-basic" && legacyBusinessSlotPlan) {
    legacyBusinessSlotPlan.semanticReadiness =
      buildBusinessSlotSemanticReadiness({
        pageTypeId: "table-basic",
        planStatus: "planned",
        source: "legacy-reconstruction-facts",
        semanticEvidence: ["legacy-reconstruction-facts"],
        legacyReconstructionInput,
        migrationInvariantContract,
      });
    return legacyBusinessSlotPlan;
  }

  if (normalizedPageTypeId === "table-basic") {
    const plan = buildDefaultBasicTableBusinessSlotPlan({
      title: normalizedTitle,
    });
    plan.semanticReadiness = buildBusinessSlotSemanticReadiness({
      pageTypeId: "table-basic",
      planStatus: "planned",
      source: plan.source,
      semanticEvidence: [
        "page-type-default-fallback",
        "title-derived-business-entity",
      ],
      legacyReconstructionInput,
      migrationInvariantContract,
    });
    return plan;
  }

  if (normalizedPageTypeId === "table-stat" && isSalesManagement) {
    return {
      status: "planned",
      source: "title-keyword:sales-management",
      semanticReadiness: buildBusinessSlotSemanticReadiness({
        pageTypeId: normalizedPageTypeId,
        planStatus: "planned",
        source: "title-keyword:sales-management",
        semanticEvidence,
      }),
      mustReplaceAllowedBusinessSlots: true,
      allowedSlots: [
        "title",
        "queryFields",
        "tableFields",
        "searchPlaceholder",
        "overviewRequest",
        "listRequest",
        "mockData",
      ],
      replacementTheme: "sales-management",
      title: normalizedTitle,
      searchPlaceholder: "客户名称 / 销售负责人",
      queryFields: [
        { label: "销售负责人", key: "ownerId", control: "Select" },
        { label: "成交时间", key: "timeRange", control: "DateRange" },
      ],
      tableFields: [
        { label: "销售负责人", key: "ownerName" },
        { label: "成交时间", key: "timeRange" },
        { label: "新增商机数", key: "createCount" },
        { label: "赢单数", key: "signCount" },
        { label: "成交金额", key: "completeCount" },
        { label: "流失商机", key: "rejectCount" },
        { label: "退款订单", key: "cancelCount" },
        { label: "待跟进商机", key: "cancelBeforeSignCount" },
        { label: "高价值客户", key: "cancelAfterSignCount" },
        { label: "复购客户", key: "cancelRebuildCount" },
      ],
      overviewMetrics: [
        "新增商机数",
        "赢单数",
        "成交金额",
        "流失商机",
        "退款订单",
      ],
      mockDataTheme: {
        entityName: "销售机会",
        ownerLabel: "销售负责人",
        rowNameExamples: ["华东大区", "华南大区", "北方大区"],
      },
      forbiddenVisibleResiduals: [
        "工程师",
        "建单量",
        "签收量",
        "业务完成量",
        "不予受理量",
        "取消量",
      ],
    };
  }

  return {
    status: normalizedPageTypeId ? "generic" : "missing-page-type",
    source: "generic-page-type-plan",
    semanticReadiness: buildBusinessSlotSemanticReadiness({
      pageTypeId: normalizedPageTypeId,
      planStatus: normalizedPageTypeId ? "generic" : "missing-page-type",
      source: "generic-page-type-plan",
      semanticEvidence,
      legacyReconstructionInput,
      migrationInvariantContract,
    }),
    mustReplaceAllowedBusinessSlots: true,
    allowedSlots: [],
    replacementTheme: "generic-business",
    title: normalizedTitle,
    searchPlaceholder: "",
    queryFields: [],
    tableFields: [],
    overviewMetrics: [],
    mockDataTheme: {},
    forbiddenVisibleResiduals: [],
  };
}

function createDefaultHeaderOwnershipDecision() {
  return {
    status: "unknown",
    compatible: false,
    headerOwnership: "unknown",
    compatibleHostHeaderSlotPolicies: [],
    selectedHeaderStrategy: "unknown",
    formalHostLayoutMode: "unknown",
    hostHeaderSlotPolicy: "unknown",
    requiredHostAction: "none",
    reason: "Header ownership was not evaluated.",
  };
}

function createDefaultHostCapability() {
  return {
    status: "unknown",
    reason: "Self-contained host readiness was not evaluated.",
    hasHostProviderBridge: false,
    hasSharedHeaderSlot: false,
    hasContinuousHeightChain: false,
    sharedHeaderSlotPolicy: "unknown",
    layoutMode: "unknown",
    contentOutletPath: "",
    scrollOwner: "unknown",
    rightViewportGutterPx: 0,
    leftGapPxWhenMenuCollapsed: 0,
    evidenceFiles: [],
  };
}

function supportsSelfContainedPageShell(formalHostProfile = {}) {
  const layoutMode =
    normalizeString(formalHostProfile?.layoutMode) || "unknown";
  const headerSlotPolicy =
    normalizeString(formalHostProfile?.headerSlotPolicy) || "unknown";
  const continuousHeightChain =
    formalHostProfile?.continuousHeightChain === true;

  return (
    continuousHeightChain &&
    (layoutMode === "self-contained-hiui-shell" ||
      headerSlotPolicy === "no-header-slot" ||
      headerSlotPolicy === "collapses-when-empty")
  );
}

function buildBriefHostCapability({
  hostCompatibility,
  formalHostProfile,
  headerOwnershipDecision,
}) {
  const normalizedFormalHostProfile =
    formalHostProfile && typeof formalHostProfile === "object"
      ? formalHostProfile
      : {
          layoutMode: "unknown",
          headerSlotPolicy: "unknown",
          hostProviderBridge: false,
          continuousHeightChain: false,
          contentOutletPath: "",
          scrollOwner: "unknown",
          rightViewportGutterPx: 0,
          leftGapPxWhenMenuCollapsed: 0,
          evidenceFiles: [],
        };
  const base = {
    ...createDefaultHostCapability(),
    hasHostProviderBridge:
      normalizedFormalHostProfile.hostProviderBridge === true,
    hasSharedHeaderSlot:
      normalizeString(normalizedFormalHostProfile.layoutMode) ===
      "shared-header-layout",
    hasContinuousHeightChain:
      normalizedFormalHostProfile.continuousHeightChain === true,
    sharedHeaderSlotPolicy:
      normalizeString(normalizedFormalHostProfile.headerSlotPolicy) ||
      "unknown",
    layoutMode:
      normalizeString(normalizedFormalHostProfile.layoutMode) || "unknown",
    contentOutletPath: normalizeString(
      normalizedFormalHostProfile.contentOutletPath,
    ),
    scrollOwner:
      normalizeString(normalizedFormalHostProfile.scrollOwner) || "unknown",
    rightViewportGutterPx: Number.isFinite(
      normalizedFormalHostProfile.rightViewportGutterPx,
    )
      ? normalizedFormalHostProfile.rightViewportGutterPx
      : 0,
    leftGapPxWhenMenuCollapsed: Number.isFinite(
      normalizedFormalHostProfile.leftGapPxWhenMenuCollapsed,
    )
      ? normalizedFormalHostProfile.leftGapPxWhenMenuCollapsed
      : 0,
    evidenceFiles: normalizeStringArray(
      normalizedFormalHostProfile.evidenceFiles,
    ),
  };
  const hostCompatibilityStatus =
    normalizeString(hostCompatibility?.status) || "not-checked";
  const hostCompatibilityReason = normalizeString(hostCompatibility?.reason);
  const headerOwnershipReason = normalizeString(
    headerOwnershipDecision?.reason,
  );

  if (headerOwnershipDecision?.status === "requires-host-action") {
    return {
      ...base,
      status: "requires-project-fix",
      reason:
        headerOwnershipReason ||
        hostCompatibilityReason ||
        "Current host still needs a shared-header-slot or height-chain fix before self-contained page shells can be generated safely.",
    };
  }

  if (supportsSelfContainedPageShell(normalizedFormalHostProfile)) {
    return {
      ...base,
      status: "satisfied",
      reason:
        hostCompatibilityReason ||
        "Project host proves the shared-header-slot policy and continuous height chain required by self-contained page shells.",
    };
  }

  if (hostCompatibilityStatus === "blocked") {
    return {
      ...base,
      status: "requires-project-fix",
      reason:
        hostCompatibilityReason ||
        "Project host is still blocked for self-contained page shells and must be fixed before generation can continue.",
    };
  }

  if (
    base.hasHostProviderBridge ||
    base.hasSharedHeaderSlot ||
    base.hasContinuousHeightChain ||
    base.evidenceFiles.length > 0
  ) {
    return {
      ...base,
      status: "partial",
      reason:
        hostCompatibilityReason ||
        "Project host exposes part of the managed host evidence, but self-contained page-shell readiness is not fully proven yet.",
    };
  }

  return {
    ...base,
    status: "unknown",
    reason:
      hostCompatibilityReason ||
      "Project-level self-contained host readiness could not be proven from the current project evidence.",
  };
}

function buildHeaderOwnershipDecision({ contract, formalHostProfile }) {
  const hostContract = contract.hostCapabilityContract || {};
  const headerOwnership =
    normalizeString(hostContract.headerOwnership) || "unknown";
  const compatibleHostHeaderSlotPolicies = Array.isArray(
    hostContract.compatibleHostHeaderSlotPolicies,
  )
    ? hostContract.compatibleHostHeaderSlotPolicies
        .map((item) => normalizeString(item))
        .filter(Boolean)
    : [];
  const normalizedFormalHostProfile =
    formalHostProfile && typeof formalHostProfile === "object"
      ? formalHostProfile
      : {
          layoutMode: "unknown",
          headerSlotPolicy: "unknown",
        };
  const hostHeaderSlotPolicy =
    normalizeString(normalizedFormalHostProfile.headerSlotPolicy) || "unknown";
  const formalHostLayoutMode =
    normalizeString(normalizedFormalHostProfile.layoutMode) || "unknown";

  if (headerOwnership === "self-contained") {
    if (
      formalHostLayoutMode === "shared-header-layout" &&
      hostHeaderSlotPolicy !== "no-header-slot" &&
      !compatibleHostHeaderSlotPolicies.includes(hostHeaderSlotPolicy)
    ) {
      return {
        status: "requires-host-action",
        compatible: false,
        headerOwnership,
        compatibleHostHeaderSlotPolicies,
        selectedHeaderStrategy: "self-contained",
        formalHostLayoutMode,
        hostHeaderSlotPolicy,
        requiredHostAction: "prove-host-header-slot-policy",
        reason:
          "Page header ownership is self-contained, but the shared host layout reserves a header slot whose empty-state behavior is not yet compatible with self-contained page headers.",
      };
    }

    return {
      status: "ready",
      compatible: true,
      headerOwnership,
      compatibleHostHeaderSlotPolicies,
      selectedHeaderStrategy: "self-contained",
      formalHostLayoutMode,
      hostHeaderSlotPolicy,
      requiredHostAction: "none",
      reason:
        "Page header ownership is self-contained, and the current host header-slot policy is compatible with self-contained page headers.",
    };
  }

  return createDefaultHeaderOwnershipDecision();
}

function resolveCopyMode({ headerOwnershipDecision }) {
  if (headerOwnershipDecision?.status === "requires-host-action") {
    return "host-shell-fix-required";
  }
  return "direct-copy";
}

function getAllowedAutoRoutePatch({ mode, hostProfile }) {
  return false;
}

function resolveGenerationWorkflow(contract = {}) {
  const workflow = contract.generationWorkflow || {};
  const normalizedDefaultFlow = normalizeWorkflowDefaultFlow(
    workflow.defaultFlow,
  );
  const replaceBusinessSlotsByDefault =
    workflow.replaceBusinessSlotsByDefault !== false;
  const sectionLayoutSemantics =
    workflow.sectionLayoutSemantics &&
    typeof workflow.sectionLayoutSemantics === "object"
      ? workflow.sectionLayoutSemantics
      : {};
  const chartSectionLayout =
    sectionLayoutSemantics.chartSection &&
    typeof sectionLayoutSemantics.chartSection === "object"
      ? sectionLayoutSemantics.chartSection
      : {};
  const chartLayoutPlanningRequired = Boolean(
    chartSectionLayout.rowFillPolicy ||
      chartSectionLayout.remainderResolutionOrder ||
      chartSectionLayout.cardStretchPolicy,
  );
  return {
    kind: workflow.kind || "typical-template",
    defaultFlow: normalizedDefaultFlow,
    replaceBusinessSlotsByDefault,
    generatorMode: workflow.generatorMode || "direct-copy",
    contentGenerationMode:
      workflow.contentGenerationMode ||
      (replaceBusinessSlotsByDefault
        ? "business-slot-replacement"
        : "rule-driven-content-generation"),
    defaultAuthoringPath: workflow.defaultAuthoringPath || "",
    templateUsageMode:
      workflow.templateUsageMode ||
      (replaceBusinessSlotsByDefault
        ? "official-template-copy"
        : "official-reference-shell-and-style-contract"),
    requiredModuleSet: Array.isArray(workflow.requiredModuleSet)
      ? workflow.requiredModuleSet
      : [],
    fixedRegions: Array.isArray(workflow.fixedRegions)
      ? workflow.fixedRegions
      : [],
    referenceModules: Array.isArray(workflow.referenceModules)
      ? workflow.referenceModules
      : [],
    description: workflow.description || "",
    manualRefactorOwners: Array.isArray(workflow.manualRefactorOwners)
      ? workflow.manualRefactorOwners
      : [],
    sectionLayoutSemantics,
    chartLayoutPlanningRequired,
    chartCount: chartLayoutPlanningRequired ? null : undefined,
    slotPlan: chartLayoutPlanningRequired ? null : undefined,
    slotRemainder: chartLayoutPlanningRequired ? null : undefined,
    selectedChartArchetype: chartLayoutPlanningRequired ? "" : undefined,
    rowFillDecision: chartLayoutPlanningRequired ? "" : undefined,
    chartReusePolicy: workflow.chartReusePolicy || "",
    stopAutoReplacementReason: workflow.stopAutoReplacementReason || "",
  };
}

async function buildNonTypicalFamilyBrief({
  targetRoot,
  skillRoot,
  requestedMode,
  resolvedMode,
  inputMode,
  localizationMode = DEFAULT_LOCALIZATION_MODE,
  line,
  dest,
  title,
  routePath,
  integrationReadiness,
  pageTaskGate,
  projectHostContract,
  projectHostContractConsumption,
  preflightBusinessTarget,
  preflightOutputTargetEvidence,
  confirmedGenerationInput,
  confirmedDesignRestoreInput,
  designRestoreRoutingDecision = null,
  nonTypicalConversationOutput,
  explicitNavigationMountContract,
  relatedPagePath = "",
}) {
  const pageFamily = NON_TYPICAL_PAGE_FAMILY;
  const pageFamilyContract = getPageFamilyContract(pageFamily);
  const hostProfile = buildBriefHostProfileSummary(
    projectHostContract?.hostProfile || {},
  );
  const formalHostProfile = integrationReadiness.hostCompatibility
    ?.formalHostProfile || {
    layoutMode: "unknown",
    headerSlotPolicy: "unknown",
    hostProviderBridge: false,
    continuousHeightChain: false,
    evidenceFiles: [],
  };
  const hostCapability = buildBriefHostCapability({
    hostCompatibility: integrationReadiness.hostCompatibility,
    formalHostProfile,
    headerOwnershipDecision: createDefaultHeaderOwnershipDecision(),
  });
  const { contextPath, hostImportPolicy, generationTargetPolicy } =
    await loadHostImportPolicy({ skillRoot });
  const {
    workflowEntry,
    workflowManifestPath,
    archetype,
    archetypeManifestPath,
    coordinationPatternManifestPath,
    violations,
  } = await resolveNonTypicalFamilyExecution({
    skillRoot,
    normalizedInputModeId: inputMode.id,
    resolvedMode,
    nonTypicalConversationOutput,
  });

  if (violations.length > 0) {
    throw new Error(
      `Invalid nonTypicalConversationOutput: ${violations.join("; ")}`,
    );
  }

  if (workflowEntry.briefReady !== true) {
    throw new Error(
      `non-typical-page brief execution is not ready in ${workflowManifestPath}`,
    );
  }

  const effectiveTitle =
    title ||
    nonTypicalConversationOutput?.nonTypicalDecisionPackage?.pageHeaderPlan
      ?.title ||
    confirmedGenerationInput?.promptDraft?.titleDraft ||
    "";
  const {
    businessTarget,
    formalNavigation,
    projectHostContractConsumption: resolvedProjectHostContractConsumption,
  } = await resolveBusinessTargetWithNavigation({
    targetRoot,
    routePath,
    title: effectiveTitle,
    dest,
    generationTargetPolicy,
    explicitNavigationMountContract,
    projectHostContract,
    validatedFormalNavigation: projectHostContractConsumption?.formalNavigation,
    pageTypeId: pageFamily,
    relatedPagePath,
  });
  const nonTypicalContractBlockedBrief =
    maybeBuildProjectHostContractConsumptionBlockedBrief({
      targetRoot,
      skillRoot,
      pageFamilyId: pageFamily,
      requestedMode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode,
      localizationMode,
      routePath,
      title: effectiveTitle,
      dest,
      businessTarget: preflightBusinessTarget,
      outputTargetEvidence: preflightOutputTargetEvidence,
      projectHostContract,
      projectHostContractConsumption: resolvedProjectHostContractConsumption,
    });
  if (nonTypicalContractBlockedBrief) {
    return nonTypicalContractBlockedBrief;
  }
  const requestedBusiness = {
    title: effectiveTitle,
    rawDest: businessTarget.rawDest,
    dest: businessTarget.targetBusinessPath,
    targetBusinessPath: businessTarget.targetBusinessPath,
    defaultBusinessPageDir: businessTarget.defaultBusinessPageDir,
    forbiddenOutputRoots: businessTarget.forbiddenOutputRoots,
    previewReferencePolicy: businessTarget.previewReferencePolicy,
    routeIsolationPolicy: businessTarget.routeIsolationPolicy,
    notes: businessTarget.notes,
    routePath,
    detailSections: [],
    detailSectionsSource: "",
    feedbackVariantId: "",
    navigationMountContract: explicitNavigationMountContract?.value ?? null,
    parentFlowContract: explicitNavigationMountContract?.value?.parentFlowContract ?? null,
  };
  const nonTypicalPageType = buildNonTypicalPageType({ workflowEntry });
  const outputTargetValidation = validateRequestedBusinessOutputTarget({
    pageType: nonTypicalPageType,
    requestedBusiness: {
      ...requestedBusiness,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
    },
    generationTargetPolicy,
  });

  if (!outputTargetValidation.ok) {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageFamilyId: pageFamily,
      requestedMode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode,
      localizationMode,
      routePath,
      title: effectiveTitle,
      dest,
      blockedStatus: "blocked-by-output-target",
      blockedBy: "invalid-output-target",
      blockReason: buildOutputTargetBlockedReason({
        outputTargetValidation,
        requestedBusiness,
        generationTargetPolicy,
        formalNavigation,
        explicitNavigationMountContract,
        outputTargetEvidence: businessTarget.outputTargetEvidence,
      }),
      businessTarget,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
      projectHostContract,
    });
  }
  const businessSlotPlan = buildBusinessSlotPlan({
    pageTypeId: pageFamily,
    title: requestedBusiness.title,
    legacyReconstructionInput: null,
    detailSections: requestedBusiness.detailSections,
  });
  const {
    navigationDecision,
    navigationMountDecision,
    navigationMountAction,
    hostExecutionAdapter,
    officialHostSourceReadiness,
    hostShellDecision,
  } = await resolveBriefNavigationContext({
    targetRoot,
    resolvedMode,
    hostProfile,
    formalNavigation,
    projectHostContract,
    requestedBusiness,
    relatedPagePath: businessTarget.outputTargetEvidence.relatedPagePath,
    preferredTemplatePath: "",
  });
  const generationWorkflow = buildNonTypicalWorkflowSummary({
    workflowEntry,
    archetype,
  });
  const generationContract = buildNonTypicalGenerationContract({
    workflowEntry,
  });
  const generationPath = {
    id: "non-typical-family-rules-composition",
    label: "非典型 family rules-composition brief",
    category: pageFamilyContract.independentWorkflowCategory,
    reason:
      "This page family uses a family-level decision package, approved primitives, and design-system gates instead of template slot replacement.",
  };
  const coverageDecision = buildNonTypicalCoverageDecision();
  const coverageValidation = {
    status: "pass",
    violations: [],
  };
  const nonTypicalExecutionBrief = buildNonTypicalExecutionBrief({
    workflowEntry,
    workflowManifestPath,
    archetype,
    archetypeManifestPath,
    coordinationPatternManifestPath,
    nonTypicalConversationOutput,
    confirmedDesignRestoreInput,
    resolvedMode,
    businessTarget,
  });
  const integrationGate =
    pageTaskGate.status === "ready-to-generate"
      ? "ready-to-generate"
      : "ensure-or-stop";
  const forbiddenIntegrationFallbacks =
    pageTaskGate.status === "ready-to-generate"
      ? []
      : DEFAULT_FORBIDDEN_INTEGRATION_FALLBACKS;
  const { writeReadiness, navigationExecution } =
    resolveBriefNavigationExecution({
      pageTaskGateStatus: pageTaskGate.status,
      requestedPageTypeStatus: "not-checked",
      navigationDecision,
      navigationMountDecision,
      navigationMountAction,
    });
  const certifiedImplementationPolicy = {
    boundary: "approved-family-primitives-and-design-system-gate",
    notes: [
      "Keep the page header owner and the white body owner stable.",
      "Compose only approved primitives registered by the selected non-typical coordination pattern.",
      "Do not introduce a second visual system or unapproved local visual tokens.",
      "This brief is family-ready, and the family generator is publicly open for the validated non-typical v1 scope.",
    ],
  };

  return {
    schema: "hiui5-generation-brief.v2",
    targetRoot,
    skillRoot,
    line,
    mode: resolvedMode,
    requestedMode: requestedMode || "auto",
    localizationMode,
    inputMode,
    confirmedGenerationInput,
    confirmedDesignRestoreInput,
    designRestoreRoutingDecision,
    legacyReconstructionInput: null,
    migrationInvariantContract: null,
    analyticsRefactorContract: null,
    pageSelector: {
      kind: "page-family",
      id: pageFamily,
      label: workflowEntry.label,
    },
    nonTypicalConversationOutput,
    nonTypicalExecutionBrief,
    hostProfile,
    integrationReadiness,
    projectHostContract: buildProjectHostContractSummary({
      targetRoot,
      projectHostContract,
      pageTaskGate,
    }),
    pageTaskGate,
    pageType: nonTypicalPageType,
    outputTargetEvidence: businessTarget.outputTargetEvidence,
    requestedBusiness,
    sources: {
      manifestPath: workflowManifestPath,
      baseManifestPath: "",
      overlayPath: "",
      familyWorkflowManifestPath: workflowManifestPath,
      archetypeManifestPath,
      coordinationPatternManifestPath,
      requiredDocs: buildNonTypicalDocSet({
        workflowEntry,
        familyContract: pageFamilyContract,
      }),
      sourceTemplatePath: "",
      runtimeExamplePath: "",
      globalPreviewRoute: "",
      preferredTemplatePath: "",
      sourceStylePath: "",
      runtimeStylePath: "",
      preferredStylePath: "",
      sourceTemplateExists: false,
      runtimeExampleExists: false,
      preferredTemplateExists: false,
      sourceStyleExists: false,
      runtimeStyleExists: false,
      preferredStyleExists: false,
    },
    pageAdjustmentContract: null,
    generationContract,
    pageGenerationDecision: {
      copyMode: "family-rules-composition",
      generationPath,
      workflow: generationWorkflow,
      pageFamilyContract,
      familyWorkflow: {
        ...workflowEntry,
        workflowManifestPath,
        archetypeManifestPath,
        coordinationPatternManifestPath,
      },
      hostCapability,
      formalHostProfile,
      headerOwnershipDecision: createDefaultHeaderOwnershipDecision(),
      selectedHeaderStrategy: "unknown",
      requiredHostAction: "none",
      navigationDecision,
      navigationMountDecision,
      navigationMountAction,
      hostExecutionAdapter,
      hostShellDecision,
      businessSlotPlan,
      nonTypicalExecutionBrief,
      pageAdjustmentDecision: {
        status: "not-applicable",
        supported: false,
        source: "",
        specPath: "",
        specVersion: "",
        validation: {
          status: "pass",
          violations: [],
        },
      },
      pageAdjustmentViewModel: null,
      analyticsRefactorViewModel: null,
      requiredDataShape: {},
      requiredLayout: {},
      requiredDomClassContract: {},
      fallbackPolicy: {},
      coverageDecision,
      coverageValidation,
      hostImportPolicy: buildBriefHostImportPolicy({
        contextPath,
        hostImportPolicy,
      }),
      resolvedHostGenerationContract: resolveHostGenerationContract({
        hostProfile,
        hostImportPolicy: buildBriefHostImportPolicy({
          contextPath,
          hostImportPolicy,
        }),
      }),
      generationTargetPolicy: {
        contextPath,
        scope: generationTargetPolicy.scope || "",
        defaultBusinessPageDir: businessTarget.defaultBusinessPageDir,
        forbiddenOutputRoots: businessTarget.forbiddenOutputRoots,
        previewReferencePolicy: businessTarget.previewReferencePolicy,
        routeIsolationPolicy: businessTarget.routeIsolationPolicy,
        notes: businessTarget.notes,
      },
      generationGuidance: {
        guidanceDoc: "docs/generation/non-typical-ai-generation-guidance.md",
        defaultFlow: "family-rules-composition",
        enforceDangerousProps: true,
        enforceForbiddenSlots: true,
        enforceVisualTokens: true,
        enforceSemanticComponents: true,
        enforceImportSourcePolicy: true,
      },
      certifiedImplementationPolicy,
    },
    executionPolicy: {
      integrationGate,
      mustPassIntegrationReadinessBeforeWriting: true,
      mustPassPageTaskGateBeforeWriting: true,
      requiresProjectLocalHiuiDesignContext: true,
      mustAutoEnsureOrStopWhenIntegrationMissing: !integrationReadiness.ready,
      mustStopWhenPageTaskGateClosed:
        pageTaskGate.status !== "ready-to-generate",
      pageTaskGateStatus: pageTaskGate.status,
      pageTaskGateReason: pageTaskGate.reason,
      pageTaskGateNextCommand: pageTaskGate.nextCommand,
      pageTaskGateNextRequiredAction: pageTaskGate.nextRequiredAction || "",
      pageTaskGateStaleInputs: Array.isArray(pageTaskGate.staleInputs)
        ? pageTaskGate.staleInputs
        : [],
      pageTaskGateCanAutoRecover: pageTaskGate.canAutoRecover === true,
      pageTaskGateContractSnapshotId: pageTaskGate.contractSnapshotId || "",
      ...buildExecutionPolicyActionFields({
        allowedActions: pageTaskGate.allowedActions,
        forbiddenActions: pageTaskGate.forbiddenActions,
        writeReadiness,
      }),
      forbidHostCompatibilityFallbackWhenIntegrationMissing:
        pageTaskGate.status !== "ready-to-generate",
      forbiddenIntegrationFallbacks,
      mustCreateBriefBeforeWriting: true,
      mustStartFromOfficialTemplate: false,
      mustStartFromOfficialReference: true,
      mayReplaceOnlyBusinessSlots: false,
      inputMode: inputMode.id,
      confirmationMode:
        confirmedGenerationInput || confirmedDesignRestoreInput
          ? "chat-confirmed"
          : "",
      requiresChatConfirmation:
        inputMode.id === "prototype-screenshot" ||
        isDesignRestoreInputMode(inputMode.id),
      confirmedPageFamily:
        confirmedGenerationInput?.confirmation?.confirmedPageFamily || "",
      confirmedPageType: "",
      finalPromptAvailable: Boolean(
        confirmedDesignRestoreInput?.confirmation?.finalPrompt ||
          confirmedGenerationInput?.confirmation?.finalPrompt,
      ),
      generationPath: generationPath.id,
      generationPathLabel: generationPath.label,
      generationPathReason: generationPath.reason,
      pageAdjustmentContractStatus: "not-applicable",
      pageAdjustmentContractProvided: false,
      pageAdjustmentContractSupported: false,
      pageAdjustmentContractSource: "",
      migrationInvariantContractProvided: false,
      analyticsRefactorContractProvided: false,
      analyticsRefactorContractSource: "",
      certifiedImplementationBoundary: certifiedImplementationPolicy.boundary,
      certifiedImplementationNotes: certifiedImplementationPolicy.notes,
      mustPreserveWorkflowModuleSet: generationWorkflow.requiredModuleSet,
      targetBusinessPath: businessTarget.targetBusinessPath,
      defaultBusinessPageDir: businessTarget.defaultBusinessPageDir,
      forbiddenOutputRoots: businessTarget.forbiddenOutputRoots,
      previewReferencePolicy: businessTarget.previewReferencePolicy,
      routeIsolationPolicy: businessTarget.routeIsolationPolicy,
      componentRuntimePolicy: {
        hiuiVisualPackagesMustResolveToMajor: 5,
        schemaPackagesExpectedMajor: 4,
        preferShellPublicImports: true,
        forbidLegacyHiuiVisualImportsInGeneratedPage: true,
        forbidAdHocComponentFallback: true,
        generatedSourceAllowedHiuiImports: [
          "local-managed-runtime/* managed runtime entrypoints",
          "@hi-ui/schema-* schema bridge packages",
          "@hi-ui/icons",
          "hiui5 aliases declared in package.json",
        ],
        dependencyIsolationCommand: `node ${getContextScriptPath(
          "dependency-isolation-check.mjs",
        )} --target "$PWD"`,
        importGuidance: [
          "Generation-time guidance must be read before coding: docs/generation/non-typical-ai-generation-guidance.md.",
          `Visual components must continue to import from ${
            hostImportPolicy.hiui5Components || "hiui5"
          } unless a manifest contract says otherwise.`,
          "Keep page header ownership, white body ownership, and primary-region uniqueness explicit.",
          "Compose only primitives allowed by the selected coordination pattern and the family workflow manifest.",
          "Do not introduce a second visual system or unapproved local visual tokens.",
          "If dependency isolation fails, stop generation and fix the runtime adaptation before writing or patching a page.",
          ...certifiedImplementationPolicy.notes,
        ],
      },
      mayPatchFormalRouteAutomatically: getAllowedAutoRoutePatch({
        mode: resolvedMode,
        hostProfile,
      }),
      mustRegisterToFormalNavigationRegistry:
        navigationDecision.shouldAppendToExistingNavigation ||
        navigationDecision.shouldAutoCreateFormalBusinessShell,
      formalNavigationRegistryPath:
        navigationDecision.formalNavigationRegistryPath,
      navigationBlocked: navigationDecision.navigationBlocked,
      navigationBlockReason: navigationDecision.blockReason,
      navigationExecutionBlocked: navigationExecution.blocked,
      navigationExecutionStatus: navigationExecution.status,
      navigationExecutionBlockedBy: navigationExecution.blockedBy,
      navigationExecutionReason: navigationExecution.reason,
      requiresManualNavigationRegistration:
        navigationExecution.status ===
        "manual-navigation-registration-required",
      formalNavigationMustContainOnlyGeneratedBusinessPages:
        navigationDecision.formalNavigationMustContainOnlyGeneratedBusinessPages,
      forbidSyntheticLandingPage: navigationDecision.forbidSyntheticLandingPage,
      defaultLandingPolicy: navigationDecision.defaultLandingPolicy,
      projectLine: line || "",
      oldProjectMustNotCreateFormalNavigation:
        navigationDecision.oldProjectMustNotCreateFormalNavigation,
      createFirstBusinessShellOnlyWhenHostIntegrationReady:
        navigationDecision.shouldAutoCreateFormalBusinessShell,
      officialHostSourceRequiredForFirstBusinessShell:
        navigationDecision.shouldAutoCreateFormalBusinessShell,
      officialHostSourceReady: officialHostSourceReadiness.status === "ready",
      officialHostSourceReason: officialHostSourceReadiness.reason,
      familyWorkflowStatus: workflowEntry.status,
      familyPlannerReady: workflowEntry.plannerReady === true,
      familyBriefReady: workflowEntry.briefReady === true,
      familyGeneratorReady: workflowEntry.generatorReady === true,
    },
    rollbackScope: [
      "target page directory",
      "mock or data files created for this page",
      "route entry created for this page",
      "menu entry created for this page",
      "micro-frontend expose created for this page",
      "business entry button created for this page",
    ],
  };
}

export async function loadGenerationBrief({
  targetRoot,
  skillRoot,
  integrationReadiness: providedIntegrationReadiness = null,
  pageTaskGate: providedPageTaskGate = null,
  pageTypeId = "",
  pageFamilyId = "",
  mode = "auto",
  inputMode = "",
  line = "",
  dest = "",
  title = "",
  routePath = "",
  detailSections = null,
  feedbackVariantId = "",
  variantId = "",
  pageAdjustmentContract = null,
  confirmedGenerationInput = null,
  confirmedDesignRestoreInput = null,
  nonTypicalConversationOutput = null,
  legacyReconstructionInput = null,
  migrationInvariantContract = null,
  analyticsRefactorContract = null,
  navigationMountContract = null,
  relatedPagePath = "",
  localizationMode = "",
}) {
  const normalizedInputMode = normalizeInputMode(inputMode);
  assertPublicInputModeAvailability(normalizedInputMode);
  const normalizedLocalizationMode =
    normalizeLocalizationMode(localizationMode);
  const normalizedConfirmedGenerationInput = normalizeConfirmedGenerationInput(
    confirmedGenerationInput,
  );
  const normalizedConfirmedDesignRestoreInput =
    normalizeConfirmedDesignRestoreInput(confirmedDesignRestoreInput);
  const normalizedLegacyReconstructionInput =
    normalizeLegacyReconstructionInput(legacyReconstructionInput);
  const integrationReadiness =
    providedIntegrationReadiness ||
    (await inspectIntegrationReadiness(targetRoot));
  const pageTaskGate =
    providedPageTaskGate ||
    (await inspectPageTaskGate({
      targetRoot,
      skillRoot,
      integrationReadiness,
    }));
  const blockedMode = resolveBlockedBriefMode(mode, integrationReadiness);
  const deferredBriefShapingArgs = collectDeferredBriefShapingArgs({
    pageTypeId,
    pageFamilyId,
    inputMode,
    localizationMode,
    dest,
    relatedPagePath,
    title,
    routePath,
    detailSectionsJson: detailSections ? "[provided]" : "",
    feedbackVariantId: feedbackVariantId || variantId,
    pageAdjustmentContract: pageAdjustmentContract ? "[provided]" : "",
    confirmedGenerationInputJson: confirmedGenerationInput ? "[provided]" : "",
    confirmedDesignRestoreInputJson: confirmedDesignRestoreInput
      ? "[provided]"
      : "",
    navigationMountContract: navigationMountContract ? "[provided]" : "",
    nonTypicalConversationOutputJson: nonTypicalConversationOutput
      ? "[provided]"
      : "",
    legacyReconstructionInputJson: legacyReconstructionInput
      ? "[provided]"
      : "",
    migrationInvariantContractJson: migrationInvariantContract
      ? "[provided]"
      : "",
    analyticsRefactorContractJson: analyticsRefactorContract
      ? "[provided]"
      : "",
  });
  const designRestoreRoutingDecision = buildDesignRestoreRoutingDecision({
    normalizedInputMode,
    confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
  });
  const shouldDeferSelectorResolution =
    !normalizeString(pageTypeId) &&
    !normalizeString(pageFamilyId) &&
    (!integrationReadiness.ready ||
      pageTaskGate.status !== "ready-to-generate");
  const resolvedSelector = shouldDeferSelectorResolution
    ? {
        pageTypeId: "",
        pageFamilyId: "",
      }
    : resolveRequestedPageSelector({
        pageTypeId,
        pageFamilyId,
        normalizedInputMode,
        designRestoreRoutingDecision,
        legacyReconstructionInput: normalizedLegacyReconstructionInput,
      });
  const normalizedPageTypeId = resolvedSelector.pageTypeId;
  const normalizedPageFamilyId = resolvedSelector.pageFamilyId;
  const selectorId = normalizedPageTypeId || normalizedPageFamilyId || "page";
  const preflightRelatedPageEvidence = await resolveRelatedPagePathEvidence({
    targetRoot,
    relatedPagePath,
  });
  const preflightBusinessTarget = resolveBusinessPageTargetPath({
    pageTypeId: selectorId,
    routePath,
    title,
    dest,
    generationTargetPolicy: {},
    formalNavigation: {},
    relatedPageEvidence: preflightRelatedPageEvidence,
  });
  const preflightOutputTargetEvidence =
    preflightBusinessTarget.outputTargetEvidence;

  if (
    !integrationReadiness.ready ||
    pageTaskGate.status !== "ready-to-generate"
  ) {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      pageFamilyId: normalizedPageFamilyId,
      requestedMode: mode,
      resolvedMode: blockedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title,
      dest,
      businessTarget: preflightBusinessTarget,
      outputTargetEvidence: preflightOutputTargetEvidence,
      deferredBriefShapingArgs,
    });
  }

  const loadedProjectHostContract = await loadProjectHostContractForBrief({
    targetRoot,
    skillRoot,
    pageTypeId: normalizedPageTypeId,
    pageFamilyId: normalizedPageFamilyId,
    requestedMode: mode,
    resolvedMode: blockedMode,
    integrationReadiness,
    pageTaskGate,
    inputMode: normalizedInputMode,
    localizationMode: normalizedLocalizationMode.id,
    routePath,
    title,
    dest,
    businessTarget: preflightBusinessTarget,
    outputTargetEvidence: preflightOutputTargetEvidence,
    ...(Object.prototype.hasOwnProperty.call(
      pageTaskGate || {},
      "projectHostContract",
    )
      ? {
          preloadedProjectHostContract: pageTaskGate.projectHostContract,
        }
      : {}),
  });
  if (loadedProjectHostContract.blockedBrief) {
    return loadedProjectHostContract.blockedBrief;
  }
  const { projectHostContract, projectHostContractConsumption } =
    loadedProjectHostContract;

  const parsedNavigationMountContract = await parseJsonInput(
    navigationMountContract,
    { targetRoot },
  );
  const explicitNavigationMountContract =
    await resolveExplicitNavigationMountContract({
      targetRoot,
      contract: parsedNavigationMountContract.value,
    });
  if (
    explicitNavigationMountContract.provided &&
    explicitNavigationMountContract.violations.length > 0
  ) {
    throw new Error(
      `Invalid navigationMountContract: ${explicitNavigationMountContract.violations.join(
        "; ",
      )}`,
    );
  }
  const resolvedNonTypicalConversationOutput =
    resolveNonTypicalConversationOutput({
      explicitOutput: nonTypicalConversationOutput,
      confirmedGenerationInput: normalizedConfirmedGenerationInput,
    });

  if (normalizedPageFamilyId) {
    if (normalizedPageFamilyId !== NON_TYPICAL_PAGE_FAMILY) {
      throw new Error(
        `Family-level brief execution is only supported for ${NON_TYPICAL_PAGE_FAMILY}. Use --page-type for other families.`,
      );
    }

    if (normalizedInputMode.id === "legacy-system-reconstruction") {
      throw new Error(
        `${NON_TYPICAL_PAGE_FAMILY} does not support inputMode legacy-system-reconstruction`,
      );
    }

    if (pageAdjustmentContract) {
      throw new Error(
        `${NON_TYPICAL_PAGE_FAMILY} does not support pageAdjustmentContract`,
      );
    }

    if (detailSections) {
      throw new Error(
        `${NON_TYPICAL_PAGE_FAMILY} does not support detailSections`,
      );
    }

    if (feedbackVariantId || variantId) {
      throw new Error(
        `${NON_TYPICAL_PAGE_FAMILY} does not support feedbackVariantId`,
      );
    }

    if (
      legacyReconstructionInput ||
      migrationInvariantContract ||
      analyticsRefactorContract
    ) {
      throw new Error(
        `${NON_TYPICAL_PAGE_FAMILY} does not support legacy reconstruction contracts`,
      );
    }

    const resolvedMode = await normalizeMode(mode, targetRoot);
    const confirmedGenerationInputViolations = validateConfirmedGenerationInput(
      {
        normalizedInputMode,
        confirmedGenerationInput: normalizedConfirmedGenerationInput,
        pageFamily: normalizedPageFamilyId,
        pageTypeId: "",
      },
    );
    const confirmedDesignRestoreInputViolations =
      validateConfirmedDesignRestoreInput({
        normalizedInputMode,
        confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
      });

    if (confirmedGenerationInputViolations.length > 0) {
      throw new Error(
        `Invalid confirmedGenerationInput: ${confirmedGenerationInputViolations.join(
          "; ",
        )}`,
      );
    }
    if (confirmedDesignRestoreInputViolations.length > 0) {
      throw new Error(
        `Invalid confirmedDesignRestoreInput: ${confirmedDesignRestoreInputViolations.join(
          "; ",
        )}`,
      );
    }

    if (!resolvedNonTypicalConversationOutput) {
      throw new Error(
        "nonTypicalConversationOutput is required for non-typical-page brief creation",
      );
    }

    return buildNonTypicalFamilyBrief({
      targetRoot,
      skillRoot,
      requestedMode: mode,
      resolvedMode,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      line,
      dest,
      title,
      routePath,
      integrationReadiness,
      pageTaskGate,
      projectHostContract,
      projectHostContractConsumption,
      preflightBusinessTarget,
      preflightOutputTargetEvidence,
      confirmedGenerationInput: normalizedConfirmedGenerationInput,
      confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
      designRestoreRoutingDecision,
      nonTypicalConversationOutput: resolvedNonTypicalConversationOutput,
      explicitNavigationMountContract,
      relatedPagePath,
    });
  }

  if (resolvedNonTypicalConversationOutput) {
    throw new Error(
      "nonTypicalConversationOutput is only supported with pageFamilyId=non-typical-page",
    );
  }

  const resolvedMode = await normalizeMode(mode, targetRoot);
  const { aiGenerationReadyContext } =
    await readAiGenerationReadyContext(targetRoot);
  const requestedPageTypeCapability = await inspectRequestedPageTypeCapability({
    targetRoot,
    pageTypeId: normalizedPageTypeId,
    aiGenerationReadyContext,
  });
  const aiPageTypeGenerationSnapshot =
    await loadPageTypeGenerationSnapshotFromAiGenerationReadyContext({
      targetRoot,
      pageTypeId: normalizedPageTypeId,
      aiGenerationReadyContext,
    });

  let manifest = null;
  let manifestPath = normalizeString(aiPageTypeGenerationSnapshot.manifestPath);
  let baseManifestPath = normalizeString(
    aiPageTypeGenerationSnapshot.baseManifestPath,
  );
  let overlayPath = normalizeString(aiPageTypeGenerationSnapshot.overlayPath);
  let pageType = aiPageTypeGenerationSnapshot.pageType;
  let contract = aiPageTypeGenerationSnapshot.generationContract;
  let requiredDocs = normalizeStringArray(
    aiPageTypeGenerationSnapshot.requiredDocs,
  );

  if (aiPageTypeGenerationSnapshot.status !== "ready") {
    const loadedManifest = await loadPageTypeManifest({
      skillRoot,
      line,
    });
    manifest = loadedManifest.manifest;
    manifestPath = loadedManifest.manifestPath;
    baseManifestPath = loadedManifest.baseManifestPath;
    overlayPath = loadedManifest.overlayPath;
    pageType = manifest.pageTypes.find(
      (item) => item.id === normalizedPageTypeId,
    );
    if (!pageType) {
      const knownIds = manifest.pageTypes.map((item) => item.id).join(", ");
      throw new Error(
        `Unknown page type "${normalizedPageTypeId}". Known page types: ${knownIds}`,
      );
    }

    contract = pageType.generationContract;
    if (!contract) {
      throw new Error(
        `Page type "${normalizedPageTypeId}" is missing generationContract in ${manifestPath}`,
      );
    }
    requiredDocs = getDocSet(manifest, pageType);
  }

  const hostProfile = buildBriefHostProfileSummary(
    projectHostContract?.hostProfile || {},
  );
  const integrationGate =
    pageTaskGate.status === "ready-to-generate"
      ? "ready-to-generate"
      : "ensure-or-stop";
  const forbiddenIntegrationFallbacks =
    pageTaskGate.status === "ready-to-generate"
      ? []
      : DEFAULT_FORBIDDEN_INTEGRATION_FALLBACKS;
  const templatePaths = getTemplatePaths({
    targetRoot,
    skillRoot,
    pageType,
    contract,
  });
  const formalHostProfile = integrationReadiness.hostCompatibility
    ?.formalHostProfile || {
    layoutMode: "unknown",
    headerSlotPolicy: "unknown",
    hostProviderBridge: false,
    continuousHeightChain: false,
    evidenceFiles: [],
  };
  const headerOwnershipDecision = buildHeaderOwnershipDecision({
    contract,
    formalHostProfile,
  });
  const hostCapability = buildBriefHostCapability({
    hostCompatibility: integrationReadiness.hostCompatibility,
    formalHostProfile,
    headerOwnershipDecision,
  });
  const copyMode = resolveCopyMode({ headerOwnershipDecision });
  const generationWorkflow = resolveGenerationWorkflow(contract);
  const pageFamily = resolvePageFamily(pageType, generationWorkflow);
  const pageFamilyContract = getPageFamilyContract(pageFamily);
  const normalizedMigrationInvariantContract =
    normalizeMigrationInvariantContract(migrationInvariantContract);
  const normalizedAnalyticsRefactorContract =
    normalizeAnalyticsRefactorContract(analyticsRefactorContract);
  const effectiveAnalyticsRefactorContract =
    maybeAutoAssembleAnalyticsRefactorContract({
      normalizedInputMode,
      pageFamily,
      analyticsRefactorContract: normalizedAnalyticsRefactorContract,
      legacyReconstructionInput: normalizedLegacyReconstructionInput,
    });
  const parsedDetailSections = await parseJsonInput(detailSections, {
    targetRoot,
  });
  const normalizedDetailSections = normalizeDetailSectionsPayload(
    parsedDetailSections.value,
  );
  const detailSectionViolations = validateRequestedDetailSections({
    pageTypeId: normalizedPageTypeId,
    detailSections: normalizedDetailSections,
  });
  const confirmedGenerationInputViolations = validateConfirmedGenerationInput({
    normalizedInputMode,
    confirmedGenerationInput: normalizedConfirmedGenerationInput,
    pageFamily,
    pageTypeId: normalizedPageTypeId,
  });
  const confirmedDesignRestoreInputViolations =
    validateConfirmedDesignRestoreInput({
      normalizedInputMode,
      confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
    });
  const legacyReconstructionInputViolations = validateLegacyReconstructionInput(
    {
      normalizedInputMode,
      legacyReconstructionInput: normalizedLegacyReconstructionInput,
      pageFamily,
      pageTypeId: normalizedPageTypeId,
    },
  );
  const migrationInvariantContractViolations =
    validateMigrationInvariantContract({
      normalizedInputMode,
      migrationInvariantContract: normalizedMigrationInvariantContract,
    });
  const analyticsRefactorContractViolations = validateAnalyticsRefactorContract(
    {
      normalizedInputMode,
      pageFamily,
      analyticsRefactorContract: effectiveAnalyticsRefactorContract,
    },
  );
  const pageFamilyExecutionSupportViolations =
    validatePageFamilyExecutionSupport({
      normalizedInputMode,
      pageFamilyContract,
      workflow: generationWorkflow,
      pageAdjustmentContract,
    });
  const effectiveFeedbackVariantId = normalizeString(
    feedbackVariantId || variantId,
  );
  const pageAdjustmentDecision = await resolvePageAdjustmentDecision({
    skillRoot,
    targetRoot,
    pageType,
    workflow: generationWorkflow,
    pageAdjustmentContract,
  });
  const pageAdjustmentViewModel = buildPageAdjustmentViewModel({
    pageAdjustmentContract: pageAdjustmentDecision.contract,
    confirmedGenerationInput: normalizedConfirmedGenerationInput,
    legacyReconstructionInput: normalizedLegacyReconstructionInput,
  });
  const pageAdjustmentCoverageSupport =
    buildPageAdjustmentCoverageSupportDecisions({
      pageAdjustmentContract: pageAdjustmentDecision.contract,
      pageAdjustmentViewModel,
      confirmedGenerationInput: normalizedConfirmedGenerationInput,
      legacyReconstructionInput: normalizedLegacyReconstructionInput,
    });
  const analyticsRefactorViewModel = buildAnalyticsRefactorViewModel({
    analyticsRefactorContract: effectiveAnalyticsRefactorContract,
    legacyReconstructionInput: normalizedLegacyReconstructionInput,
  });
  const generationPath = resolveGenerationPath({
    workflow: generationWorkflow,
    pageAdjustmentDecision,
    pageFamilyContract,
  });
  const certifiedImplementationPolicy = buildCertifiedImplementationPolicy(
    pageType.id,
  );
  const coverageDecision = buildCoverageDecision({
    pageType,
    contract,
    manifestPath,
    pageAdjustmentContract: pageAdjustmentDecision.contract,
  });
  const coverageValidation = validateCoverageDecision({
    pageType,
    contract,
    coverageDecision,
    componentDecision: pageAdjustmentCoverageSupport.componentDecision,
    tokenDecision: pageAdjustmentCoverageSupport.tokenDecision,
    pageAdjustmentContract: pageAdjustmentDecision.contract,
  });
  const {
    contextPath,
    hostImportPolicy,
    generationTargetPolicy,
    generationGuidance,
  } = await loadHostImportPolicy({ skillRoot });
  const {
    businessTarget,
    formalNavigation,
    projectHostContractConsumption: resolvedProjectHostContractConsumption,
  } = await resolveBusinessTargetWithNavigation({
    targetRoot,
    routePath,
    title,
    dest,
    generationTargetPolicy,
    explicitNavigationMountContract,
    projectHostContract,
    validatedFormalNavigation: projectHostContractConsumption.formalNavigation,
    pageTypeId: normalizedPageTypeId,
    relatedPagePath,
  });
  const projectHostContractBlockedBrief =
    maybeBuildProjectHostContractConsumptionBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      requestedMode: mode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title,
      dest,
      businessTarget: preflightBusinessTarget,
      outputTargetEvidence: preflightOutputTargetEvidence,
      projectHostContract,
      projectHostContractConsumption: resolvedProjectHostContractConsumption,
    });
  if (projectHostContractBlockedBrief) {
    return projectHostContractBlockedBrief;
  }
  const sourceTemplateExists = await pathExists(
    templatePaths.sourceTemplatePath,
  );
  const runtimeExampleExists = await pathExists(
    templatePaths.runtimeExamplePath,
  );
  const preferredTemplateExists = await pathExists(
    templatePaths.preferredTemplatePath,
  );
  const sourceStyleExists = templatePaths.sourceStylePath
    ? await pathExists(templatePaths.sourceStylePath)
    : false;
  const runtimeStyleExists = templatePaths.runtimeStylePath
    ? await pathExists(templatePaths.runtimeStylePath)
    : false;
  const preferredStyleExists = templatePaths.preferredStylePath
    ? await pathExists(templatePaths.preferredStylePath)
    : false;

  if (!sourceTemplateExists) {
    throw new Error(
      `Missing official source template: ${templatePaths.sourceTemplatePath}`,
    );
  }

  if (confirmedGenerationInputViolations.length > 0) {
    throw new Error(
      `Invalid confirmedGenerationInput: ${confirmedGenerationInputViolations.join(
        "; ",
      )}`,
    );
  }
  if (confirmedDesignRestoreInputViolations.length > 0) {
    throw new Error(
      `Invalid confirmedDesignRestoreInput: ${confirmedDesignRestoreInputViolations.join(
        "; ",
      )}`,
    );
  }

  if (legacyReconstructionInputViolations.length > 0) {
    throw new Error(
      `Invalid legacyReconstructionInput: ${legacyReconstructionInputViolations.join(
        "; ",
      )}`,
    );
  }

  if (migrationInvariantContractViolations.length > 0) {
    throw new Error(
      `Invalid migrationInvariantContract: ${migrationInvariantContractViolations.join(
        "; ",
      )}`,
    );
  }

  if (analyticsRefactorContractViolations.length > 0) {
    throw new Error(
      `Invalid analyticsRefactorContract: ${analyticsRefactorContractViolations.join(
        "; ",
      )}`,
    );
  }

  if (pageFamilyExecutionSupportViolations.length > 0) {
    throw new Error(
      `Invalid pageFamily execution support: ${pageFamilyExecutionSupportViolations.join(
        "; ",
      )}`,
    );
  }

  if (detailSectionViolations.length > 0) {
    throw new Error(
      `Invalid detailSections: ${detailSectionViolations.join("; ")}`,
    );
  }

  if (pageAdjustmentDecision.validation.status === "fail") {
    throw new Error(
      `Page type "${normalizedPageTypeId}" has invalid pageAdjustmentContract: ${pageAdjustmentDecision.validation.violations.join(
        "; ",
      )}`,
    );
  }

  if (coverageValidation.status !== "pass") {
    throw new Error(
      `Page type "${normalizedPageTypeId}" has invalid generation coverage decision: ${coverageValidation.violations.join(
        "; ",
      )}`,
    );
  }

  const requestedBusiness = {
    title:
      title ||
      normalizedConfirmedGenerationInput?.promptDraft?.titleDraft ||
      normalizedLegacyReconstructionInput?.legacyFacts?.titleDraft ||
      "",
    rawDest: businessTarget.rawDest,
    dest: businessTarget.targetBusinessPath,
    targetBusinessPath: businessTarget.targetBusinessPath,
    defaultBusinessPageDir: businessTarget.defaultBusinessPageDir,
    forbiddenOutputRoots: businessTarget.forbiddenOutputRoots,
    previewReferencePolicy: businessTarget.previewReferencePolicy,
    routeIsolationPolicy: businessTarget.routeIsolationPolicy,
    notes: businessTarget.notes,
    routePath,
    detailSections: normalizedDetailSections,
    detailSectionsSource: parsedDetailSections.source,
    feedbackVariantId: effectiveFeedbackVariantId,
    navigationMountContract: explicitNavigationMountContract?.value ?? null,
    parentFlowContract: explicitNavigationMountContract?.value?.parentFlowContract ?? null,
  };
  const briefPageRelationDecision = buildPageRelationDecision({
    pageTypeId: normalizedPageTypeId,
    requestedBusiness,
    outputTargetEvidence: businessTarget.outputTargetEvidence,
    explicitNavigationMountContract,
    promptText: line,
    promptTexts: [
      normalizedConfirmedGenerationInput?.confirmation?.finalPrompt || "",
      normalizedConfirmedGenerationInput?.promptDraft?.pageGoal || "",
      normalizedLegacyReconstructionInput?.confirmation?.finalPrompt || "",
      normalizedConfirmedDesignRestoreInput?.confirmation?.finalPrompt || "",
    ],
  });
  const persistedPageRelationState = await readPersistedPageGenerationMeta({
    targetRoot,
    dest: businessTarget.targetBusinessPath,
  });
  const persistedOutputTargetEvidence =
    persistedPageRelationState.meta?.outputTargetEvidence || {};
  if (
    !businessTarget.outputTargetEvidence.relatedPagePath &&
    persistedOutputTargetEvidence.relatedPagePath
  ) {
    businessTarget.outputTargetEvidence = {
      ...businessTarget.outputTargetEvidence,
      relatedPagePath: persistedOutputTargetEvidence.relatedPagePath,
      relatedPageAccepted:
        persistedOutputTargetEvidence.relatedPageAccepted === true ||
        businessTarget.outputTargetEvidence.relatedPageAccepted === true,
      relatedPageDir:
        persistedOutputTargetEvidence.relatedPageDir ||
        businessTarget.outputTargetEvidence.relatedPageDir,
    };
  }
  const pageRelationDecision = resolveEffectivePageRelationDecision({
    briefPageRelationDecision,
    persistedPageRelationDecision:
      persistedPageRelationState.meta?.pageRelationDecision || {},
    routePath,
  }).decision;
  const outputTargetValidation = validateRequestedBusinessOutputTarget({
    pageType,
    requestedBusiness: {
      ...requestedBusiness,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
    },
    generationTargetPolicy,
  });

  if (!outputTargetValidation.ok) {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      requestedMode: mode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title: requestedBusiness.title,
      dest,
      blockedStatus: "blocked-by-output-target",
      blockedBy: "invalid-output-target",
      blockReason: buildOutputTargetBlockedReason({
        outputTargetValidation,
        requestedBusiness,
        generationTargetPolicy,
        formalNavigation,
        explicitNavigationMountContract,
        outputTargetEvidence: businessTarget.outputTargetEvidence,
      }),
      businessTarget,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
      projectHostContract,
    });
  }
  const businessSlotPlan = buildBusinessSlotPlan({
    pageTypeId: normalizedPageTypeId,
    title: requestedBusiness.title,
    legacyReconstructionInput: normalizedLegacyReconstructionInput,
    migrationInvariantContract: normalizedMigrationInvariantContract,
    detailSections: requestedBusiness.detailSections,
  });
  if (
    businessSlotPlan?.semanticReadiness?.status === "blocked" &&
    normalizeStringArray(
      businessSlotPlan?.semanticReadiness?.blockedBy,
    ).includes("legacy-fact-consumption-blocked")
  ) {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      requestedMode: mode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title: requestedBusiness.title,
      dest,
      blockedStatus: "blocked-by-legacy-fact-consumption",
      blockedBy: "legacy-fact-consumption-blocked",
      blockReason:
        businessSlotPlan.semanticReadiness.reason ||
        "Legacy reconstruction facts were extracted, but the current business-slot planner still fell back to the default page-type template.",
      businessTarget,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
      projectHostContract,
    });
  }
  if (
    businessSlotPlan?.semanticReadiness?.status === "blocked" &&
    normalizeStringArray(
      businessSlotPlan?.semanticReadiness?.blockedBy,
    ).includes("full-page-edit-legacy-slot-plan-generic-fallback")
  ) {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      requestedMode: mode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title: requestedBusiness.title,
      dest,
      blockedStatus: "blocked-by-full-page-edit-legacy-slot-plan",
      blockedBy: "full-page-edit-legacy-slot-plan-generic-fallback",
      blockReason:
        businessSlotPlan.semanticReadiness.reason ||
        "Legacy reconstruction facts were extracted for full-page-edit, but the current business-slot planner still fell back to the generic page-type plan.",
      businessTarget,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
      projectHostContract,
    });
  }
  const legacyActionGaps = normalizeObjectArray(
    businessSlotPlan?.legacyActionGaps,
  );
  if (legacyActionGaps.length > 0) {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      requestedMode: mode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title: requestedBusiness.title,
      dest,
      blockedStatus: "blocked-by-legacy-header-actions",
      blockedBy: "legacy-header-actions-unresolved",
      blockReason: `Legacy actions could not be safely reconstructed: ${legacyActionGaps
        .map((item) => {
          const missingFields = normalizeStringArray(item.missingFields);
          const missingSuffix =
            missingFields.length > 0
              ? ` [missing: ${missingFields.join(", ")}]`
              : "";
          return `${
            normalizeString(item.label) || normalizeString(item.key)
          } (${
            normalizeString(item.sourceHandler) || "unknown handler"
          })${missingSuffix}`;
        })
        .join(", ")}`,
      businessTarget,
      outputTargetEvidence: businessTarget.outputTargetEvidence,
      projectHostContract,
      legacyActionGaps,
    });
  }
  const {
    navigationDecision,
    navigationMountDecision,
    navigationMountAction,
    hostExecutionAdapter,
    officialHostSourceReadiness,
    hostShellDecision,
  } = await resolveBriefNavigationContext({
    targetRoot,
    resolvedMode,
    hostProfile,
    formalNavigation,
    projectHostContract,
    requestedBusiness,
    pageRelationDecision,
    relatedPagePath: businessTarget.outputTargetEvidence.relatedPagePath,
    preferredTemplatePath: templatePaths.preferredTemplatePath,
  });
  const publishDeliveryDecision = buildPublishDeliveryDecision({
    pageRelationDecision,
    navigationMountAction,
    hostExecutionAdapter,
  });
  const effectiveRequestedPageTypeCapability =
    resolveRequestedPageTypeCapabilityForBrief({
      requestedPageTypeCapability,
      contract,
      hostProfile,
      navigationDecision,
      navigationMountDecision,
      navigationMountAction,
      officialHostSourceReadiness,
    });
  const requestedPageTypeCapabilityWithNextCommand =
    await maybeAttachRequestedPageTypeNextCommand({
      targetRoot,
      resolvedMode,
      line,
      pageTypeId: normalizedPageTypeId,
      requestedBusiness,
      requestedPageTypeCapability: effectiveRequestedPageTypeCapability,
    });
  const requestedPageType = buildRequestedPageTypeStatusSnapshot(
    requestedPageTypeCapabilityWithNextCommand,
  );

  if (requestedPageType.status === "blocked") {
    return buildBlockedBrief({
      targetRoot,
      skillRoot,
      pageTypeId: normalizedPageTypeId,
      requestedMode: mode,
      resolvedMode,
      integrationReadiness,
      pageTaskGate,
      inputMode: normalizedInputMode,
      localizationMode: normalizedLocalizationMode.id,
      routePath,
      title,
      dest,
      blockedStatus: "blocked-by-page-type-capability",
      blockedBy: "requested-page-type-capability-blocked",
      blockReason:
        `Requested page type "${normalizedPageTypeId}" is currently blocked by the project capability matrix.` +
        (requestedPageType.reason ? ` ${requestedPageType.reason}` : ""),
      requestedPageTypeCapability: requestedPageTypeCapabilityWithNextCommand,
    });
  }

  const { writeReadiness, navigationExecution } =
    resolveBriefNavigationExecution({
      pageTaskGateStatus: pageTaskGate.status,
      requestedPageTypeStatus: requestedPageType.status,
      navigationDecision,
      navigationMountDecision,
      navigationMountAction,
    });
  const fieldMapProviderCompatibility = buildFieldMapProviderCompatibility({
    pageTypeId: pageType.id,
    hostProfile,
  });
  const briefHostImportPolicy = buildBriefHostImportPolicy({
    contextPath,
    hostImportPolicy,
  });
  const resolvedHostGenerationContract = resolveHostGenerationContract({
    hostProfile,
    hostImportPolicy: briefHostImportPolicy,
    fieldMapProviderCompatibility,
  });

  return {
    schema: "hiui5-generation-brief.v2",
    targetRoot,
    skillRoot,
    line,
    mode: resolvedMode,
    requestedMode: mode || "auto",
    localizationMode: normalizedLocalizationMode.id,
    inputMode: normalizedInputMode,
    confirmedGenerationInput: normalizedConfirmedGenerationInput,
    confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
    designRestoreRoutingDecision,
    nonTypicalConversationOutput: null,
    legacyReconstructionInput: normalizedLegacyReconstructionInput,
    migrationInvariantContract: normalizedMigrationInvariantContract,
    analyticsRefactorContract: effectiveAnalyticsRefactorContract,
    legacyActionGaps,
    pageSelector: {
      kind: "page-type",
      id: pageType.id,
      label: pageType.label,
    },
    nonTypicalExecutionBrief: null,
    hostProfile,
    integrationReadiness,
    projectHostContract: buildProjectHostContractSummary({
      targetRoot,
      projectHostContract,
      pageTaskGate,
    }),
    pageTaskGate,
    outputTargetEvidence: businessTarget.outputTargetEvidence,
    pageType: {
      id: pageType.id,
      label: pageType.label,
      pageFamily,
      kind: pageType.kind,
      whenToUse: pageType.whenToUse,
      shell: pageType.shell,
      docEntry: pageType.docEntry,
      sharedDocs: pageType.sharedDocs ?? [],
      smokePath: pageType.smokePath,
    },
    requestedBusiness,
    sources: {
      manifestPath,
      baseManifestPath,
      overlayPath,
      requiredDocs,
      sourceTemplatePath: templatePaths.sourceTemplatePath,
      runtimeExamplePath: templatePaths.runtimeExamplePath,
      globalPreviewRoute: normalizeString(
        pageType.globalPreviewRoute || pageType.smokePath,
      ),
      preferredTemplatePath: templatePaths.preferredTemplatePath,
      sourceStylePath: templatePaths.sourceStylePath,
      runtimeStylePath: templatePaths.runtimeStylePath,
      preferredStylePath: templatePaths.preferredStylePath,
      sourceTemplateExists,
      runtimeExampleExists,
      preferredTemplateExists,
      sourceStyleExists,
      runtimeStyleExists,
      preferredStyleExists,
    },
    pageAdjustmentContract: pageAdjustmentDecision.contract,
    generationContract: contract,
    pageGenerationDecision: {
      copyMode,
      generationPath,
      workflow: generationWorkflow,
      pageFamilyContract,
      familyWorkflow: null,
      hostCapability,
      formalHostProfile,
      headerOwnershipDecision,
      selectedHeaderStrategy: headerOwnershipDecision.selectedHeaderStrategy,
      requiredHostAction: headerOwnershipDecision.requiredHostAction,
      navigationDecision,
      pageRelationDecision,
      publishDeliveryDecision,
      navigationMountDecision,
      navigationMountAction,
      hostExecutionAdapter,
      hostShellDecision,
      businessSlotPlan,
      nonTypicalExecutionBrief: null,
      pageAdjustmentDecision,
      pageAdjustmentViewModel,
      componentDecision: pageAdjustmentCoverageSupport.componentDecision,
      tokenDecision: pageAdjustmentCoverageSupport.tokenDecision,
      analyticsRefactorViewModel,
      requiredDataShape: contract.dataShapeContract ?? {},
      requiredLayout: contract.layoutContract ?? {},
      requiredDomClassContract: contract.domClassContract ?? {},
      fallbackPolicy: contract.fallbackPolicy ?? {},
      coverageDecision,
      coverageValidation,
      hostImportPolicy: briefHostImportPolicy,
      resolvedHostGenerationContract,
      generationTargetPolicy: {
        contextPath,
        scope: generationTargetPolicy.scope || "",
        defaultBusinessPageDir: businessTarget.defaultBusinessPageDir,
        forbiddenOutputRoots: businessTarget.forbiddenOutputRoots,
        previewReferencePolicy: businessTarget.previewReferencePolicy,
        routeIsolationPolicy: businessTarget.routeIsolationPolicy,
        notes: businessTarget.notes,
      },
      generationGuidance: {
        guidanceDoc:
          generationGuidance.guidanceDoc ||
          contract.generationGuidanceRef ||
          "",
        defaultFlow:
          generationGuidance.defaultFlow || "coverage-first-light-flow",
        enforceDangerousProps:
          generationGuidance.enforceDangerousProps !== false,
        enforceForbiddenSlots:
          generationGuidance.enforceForbiddenSlots !== false,
        enforceVisualTokens: generationGuidance.enforceVisualTokens !== false,
        enforceSemanticComponents:
          generationGuidance.enforceSemanticComponents !== false,
        enforceImportSourcePolicy:
          generationGuidance.enforceImportSourcePolicy !== false,
      },
      certifiedImplementationPolicy,
      fieldMapProviderCompatibility,
    },
    executionPolicy: {
      integrationGate,
      briefReadyToGenerate: true,
      writeReadiness,
      briefBlockStatus: "",
      briefBlockedBy: "",
      briefBlockReason: "",
      mustPassIntegrationReadinessBeforeWriting: true,
      mustPassPageTaskGateBeforeWriting: true,
      requiresProjectLocalHiuiDesignContext: true,
      mustAutoEnsureOrStopWhenIntegrationMissing: !integrationReadiness.ready,
      mustStopWhenPageTaskGateClosed:
        pageTaskGate.status !== "ready-to-generate",
      pageTaskGateStatus: pageTaskGate.status,
      pageTaskGateReason: pageTaskGate.reason,
      pageTaskGateNextCommand: pageTaskGate.nextCommand,
      ...buildExecutionPolicyActionFields({
        allowedActions: pageTaskGate.allowedActions,
        forbiddenActions: pageTaskGate.forbiddenActions,
        writeReadiness,
      }),
      forbidHostCompatibilityFallbackWhenIntegrationMissing:
        pageTaskGate.status !== "ready-to-generate",
      forbiddenIntegrationFallbacks,
      mustCreateBriefBeforeWriting: true,
      mustStartFromOfficialTemplate:
        generationWorkflow.replaceBusinessSlotsByDefault,
      mustStartFromOfficialReference: true,
      mayReplaceOnlyBusinessSlots:
        generationWorkflow.replaceBusinessSlotsByDefault,
      inputMode: normalizedInputMode.id,
      confirmationMode:
        normalizedConfirmedGenerationInput ||
        normalizedConfirmedDesignRestoreInput ||
        normalizedLegacyReconstructionInput
          ? "chat-confirmed"
          : "",
      requiresChatConfirmation:
        normalizedInputMode.id === "prototype-screenshot" ||
        isDesignRestoreInputMode(normalizedInputMode.id) ||
        normalizedInputMode.id === "legacy-system-reconstruction",
      confirmedPageFamily:
        normalizedLegacyReconstructionInput?.confirmation
          ?.confirmedPageFamily || "",
      confirmedPageType:
        normalizedConfirmedGenerationInput?.confirmation?.confirmedPageType ||
        normalizedLegacyReconstructionInput?.confirmation?.confirmedPageType ||
        "",
      finalPromptAvailable: Boolean(
        normalizedConfirmedDesignRestoreInput?.confirmation?.finalPrompt ||
          normalizedConfirmedGenerationInput?.confirmation?.finalPrompt ||
          normalizedLegacyReconstructionInput?.confirmation?.finalPrompt,
      ),
      generationPath: generationPath.id,
      generationPathLabel: generationPath.label,
      generationPathReason: generationPath.reason,
      pageAdjustmentContractStatus: pageAdjustmentDecision.status,
      pageAdjustmentContractProvided: Boolean(pageAdjustmentDecision.contract),
      pageAdjustmentContractSupported: pageAdjustmentDecision.supported,
      pageAdjustmentContractSource: pageAdjustmentDecision.source,
      selectedHeaderStrategy: headerOwnershipDecision.selectedHeaderStrategy,
      requiredHostAction: headerOwnershipDecision.requiredHostAction,
      mustStopForRequiredHostAction:
        headerOwnershipDecision.status === "requires-host-action" &&
        headerOwnershipDecision.requiredHostAction !== "none",
      migrationInvariantContractProvided: Boolean(
        normalizedMigrationInvariantContract,
      ),
      analyticsRefactorContractProvided: Boolean(
        normalizedAnalyticsRefactorContract,
      ),
      analyticsRefactorContractSource: normalizedAnalyticsRefactorContract
        ? "explicit"
        : effectiveAnalyticsRefactorContract
          ? "auto-assembled"
          : "",
      certifiedImplementationBoundary: certifiedImplementationPolicy.boundary,
      certifiedImplementationNotes: certifiedImplementationPolicy.notes,
      mustPreserveWorkflowModuleSet: generationWorkflow.requiredModuleSet,
      targetBusinessPath: businessTarget.targetBusinessPath,
      defaultBusinessPageDir: businessTarget.defaultBusinessPageDir,
      forbiddenOutputRoots: businessTarget.forbiddenOutputRoots,
      previewReferencePolicy: businessTarget.previewReferencePolicy,
      routeIsolationPolicy: businessTarget.routeIsolationPolicy,
      componentRuntimePolicy: {
        hiuiVisualPackagesMustResolveToMajor: 5,
        schemaPackagesExpectedMajor: 4,
        preferShellPublicImports: true,
        forbidLegacyHiuiVisualImportsInGeneratedPage: true,
        forbidAdHocComponentFallback: true,
        generatedSourceAllowedHiuiImports: [
          "local-managed-runtime/* managed runtime entrypoints",
          "@hi-ui/schema-* schema bridge packages",
          "@hi-ui/query-filter (inherited from the official template or shell-owned workflow reference)",
          "@hi-ui/icons",
          "hiui5 aliases declared in package.json",
        ],
        dependencyIsolationCommand: `node ${getContextScriptPath(
          "dependency-isolation-check.mjs",
        )} --target "$PWD"`,
        importGuidance: [
          `Generation-time guidance must be read before coding: ${
            generationGuidance.guidanceDoc ||
            contract.generationGuidanceRef ||
            "docs/generation/ai-page-generation-guidance.md"
          }.`,
          `For this host, visual HiUI5 components must import from ${
            hostImportPolicy.hiui5Components || "hiui5"
          } unless a manifest contract says otherwise.`,
          "Covered typical-page regions do not need repeated component/token proof; uncovered UI and escape hatches must declare componentDecision/tokenDecision before code is written.",
          "Page shell, QueryFilter, SchemaTable and page primitives must come from local-managed-runtime/* managed runtime entrypoints or the official workflow reference modules.",
          "QueryFilter is owned by the page shell and official workflow reference modules; generated business pages inherit that adaptation layer and should not hand-build a second one.",
          "Business-only actions may import from hiui5 or certified HiUI5 aliases; do not import visual components from legacy @hi-ui/* 3.x/4.x packages.",
          "Generated page source must not directly import @hi-ui/button/table/input/select/date-picker/tag/drawer/message/page-header or other visual packages from the legacy project root.",
          "Schema 4.x packages are allowed only as HiUI5 schema bridge packages; their visual peer dependencies must still resolve to HiUI5.",
          "If the dependency isolation command fails, stop generation and fix the runtime adaptation before writing or patching a page.",
          ...certifiedImplementationPolicy.notes,
        ],
      },
      mayPatchFormalRouteAutomatically: getAllowedAutoRoutePatch({
        mode: resolvedMode,
        hostProfile,
      }),
      mustRegisterToFormalNavigationRegistry:
        navigationDecision.shouldAppendToExistingNavigation ||
        navigationDecision.shouldAutoCreateFormalBusinessShell,
      formalNavigationRegistryPath:
        navigationDecision.formalNavigationRegistryPath,
      navigationBlocked: navigationDecision.navigationBlocked,
      navigationBlockReason: navigationDecision.blockReason,
      navigationExecutionBlocked: navigationExecution.blocked,
      navigationExecutionStatus: navigationExecution.status,
      navigationExecutionBlockedBy: navigationExecution.blockedBy,
      navigationExecutionReason: navigationExecution.reason,
      requiresManualNavigationRegistration:
        navigationExecution.status ===
        "manual-navigation-registration-required",
      requestedPageTypeStatus: requestedPageType.status,
      requestedPageTypeReason: requestedPageType.reason,
      requestedPageTypeBlockedBy: requestedPageType.blockedBy,
      requestedPageTypeSourcePath: requestedPageType.sourcePath,
      requestedPageTypeCapabilityStatus: requestedPageType.capabilityStatus,
      requestedPageTypeCapabilityReason: requestedPageType.reason,
      requestedPageTypeCapabilityBlockedBy:
        requestedPageType.capabilityBlockedBy,
      requestedPageTypeCapabilitySourcePath: requestedPageType.sourcePath,
      requestedPageTypeConditionalBlockedBy:
        requestedPageType.conditionalBlockedBy,
      requestedPageTypePreWriteAction: requestedPageType.preWriteAction,
      requestedPageTypePreWriteActionReason:
        requestedPageType.preWriteActionReason,
      requestedPageTypeNextCommand: requestedPageType.nextCommand,
      formalNavigationMustContainOnlyGeneratedBusinessPages:
        navigationDecision.formalNavigationMustContainOnlyGeneratedBusinessPages,
      forbidSyntheticLandingPage: navigationDecision.forbidSyntheticLandingPage,
      defaultLandingPolicy: navigationDecision.defaultLandingPolicy,
      browserValidationIsDefault: false,
      heavyValidationTriggers: [
        "first-hiui5-typical-page-integration",
        "host-shell-change",
        "typical-page-shells-version-upgrade",
        "multi-page-visual-regression",
        "explicit-user-request",
      ],
    },
    rollbackScope: [
      "target page directory",
      "mock or data files created for this page",
      "route entry created for this page",
      "menu entry created for this page",
      "micro-frontend expose created for this page",
      "business entry button created for this page",
    ],
  };
}

function renderArray(items, indent = "") {
  if (!Array.isArray(items) || items.length === 0) return `${indent}- —`;
  return items.map((item) => `${indent}- ${item}`).join("\n");
}

function renderImportList(imports) {
  if (!Array.isArray(imports) || imports.length === 0) return "- —";

  return imports
    .map((item) => {
      const symbols = Array.isArray(item.symbols)
        ? item.symbols.join(", ")
        : "";
      return `- ${item.source}${symbols ? `: ${symbols}` : ""}`;
    })
    .join("\n");
}

function renderJsonBlock(value) {
  return `\`\`\`json
${JSON.stringify(value ?? null, null, 2)}
\`\`\``;
}

function renderInlineList(items) {
  return Array.isArray(items) && items.length > 0 ? items.join(", ") : "—";
}

function summarizePrompt(value, maxChars = 300) {
  const normalized = normalizeString(value);
  if (!normalized) return "—";
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars)}...`;
}

function renderRecommendationCandidates(candidates, valueKey = "pageType") {
  if (!Array.isArray(candidates) || candidates.length === 0) return "- —";

  return candidates
    .map((candidate) => {
      const reasons = candidate.reasons?.length
        ? ` | reasons: ${candidate.reasons.join("、")}`
        : "";
      const score = candidate.score === null ? "—" : candidate.score;
      return `- ${candidate[valueKey] || "—"} | score: ${score}${reasons}`;
    })
    .join("\n");
}

function renderGenerationBriefMarkdownBody(brief) {
  const confirmedGenerationInput = brief.confirmedGenerationInput;
  const confirmedDesignRestoreInput = brief.confirmedDesignRestoreInput;
  const legacyReconstructionInput = brief.legacyReconstructionInput;
  const nonTypicalConversationSection =
    brief.pageSelector?.kind === "page-family" &&
    brief.nonTypicalConversationOutput
      ? `
## Non-Typical Conversation Output

${renderJsonBlock(brief.nonTypicalConversationOutput)}
`
      : "";
  const nonTypicalCoordinationSection =
    brief.pageSelector?.kind === "page-family" && brief.nonTypicalExecutionBrief
      ? `
## Non-Typical Coordination Pattern

- coordinationPatternId: ${
          brief.nonTypicalExecutionBrief.coordinationPattern
            ?.coordinationPatternId ||
          brief.nonTypicalExecutionBrief.coordinationBindings
            ?.coordinationPatternId ||
          brief.nonTypicalExecutionBrief.archetype?.coordinationPatternId ||
          "—"
        }
- coordinationPatternLabel: ${
          brief.nonTypicalExecutionBrief.coordinationPattern?.label || "—"
        }
- coordinationPatternManifestPath: ${
          brief.nonTypicalExecutionBrief.coordinationPatternManifestPath || "—"
        }
- blockDesignMapPath: ${
          brief.nonTypicalExecutionBrief.designMappingPlan?.designMapPath || "—"
        }
- dataShapeRegions: ${String(
          brief.nonTypicalExecutionBrief.decisionPackage?.dataShape
            ?.regionShapes?.length || 0,
        )}
- legacyArchetypeId(alias): ${
          brief.nonTypicalExecutionBrief.archetype?.archetypeId || "—"
        }
- legacyArchetypeManifestPath(alias): ${
          brief.nonTypicalExecutionBrief.archetypeManifestPath || "—"
        }
- requiredPrimitives: ${renderInlineList(
          brief.nonTypicalExecutionBrief.primitivePlan?.requiredPrimitives,
        )}
- optionalPrimitives: ${renderInlineList(
          brief.nonTypicalExecutionBrief.primitivePlan?.optionalPrimitives,
        )}
- restorePrimitiveBindings: ${String(
          brief.nonTypicalExecutionBrief.restorePrimitivePlan?.regionBindings
            ?.length || 0,
        )}

### Supported Coordination Patterns

${renderArray(
  brief.nonTypicalExecutionBrief.integrationPlan?.supportedCoordinationPatterns,
)}

### Supported Legacy Archetype Aliases

${renderArray(
  brief.nonTypicalExecutionBrief.integrationPlan?.supportedArchetypes,
)}

## Non-Typical Execution Brief

${renderJsonBlock(brief.nonTypicalExecutionBrief)}
`
      : "";
  const screenshotRecommendationSection =
    brief.inputMode.id === "prototype-screenshot"
      ? `
## Input Recommendation

- recommended: ${
          confirmedGenerationInput?.pageTypeRecommendation?.recommended || "—"
        }
- confidence: ${
          confirmedGenerationInput?.pageTypeRecommendation?.confidence || "—"
        }

### Recommendation Reasons

${renderArray(confirmedGenerationInput?.pageTypeRecommendation?.reasons)}

### Recommendation Candidates

${renderRecommendationCandidates(
  confirmedGenerationInput?.pageTypeRecommendation?.candidates,
)}

## Prompt Draft

- titleDraft: ${confirmedGenerationInput?.promptDraft?.titleDraft || "—"}
- pageGoal: ${confirmedGenerationInput?.promptDraft?.pageGoal || "—"}

### Observed Layout

${renderArray(confirmedGenerationInput?.promptDraft?.observedLayout)}

### Observed Modules

${renderJsonBlock(
  confirmedGenerationInput?.promptDraft?.observedModules ?? null,
)}

### Unknowns

${renderArray(confirmedGenerationInput?.promptDraft?.unknowns)}

## Chat Confirmation

- confirmationMode: ${brief.executionPolicy.confirmationMode || "—"}
- confirmedPageFamily: ${brief.executionPolicy.confirmedPageFamily || "—"}
- confirmedPageType: ${brief.executionPolicy.confirmedPageType || "—"}
- finalPromptSummary: ${summarizePrompt(
          confirmedGenerationInput?.confirmation?.finalPrompt,
        )}
`
      : "";
  const legacyReconstructionSection =
    brief.inputMode.id === "legacy-system-reconstruction"
      ? `
## Family Recommendation

- recommended: ${
          legacyReconstructionInput?.pageFamilyRecommendation?.recommended ||
          "—"
        }
- confidence: ${
          legacyReconstructionInput?.pageFamilyRecommendation?.confidence || "—"
        }

### Family Recommendation Reasons

${renderArray(legacyReconstructionInput?.pageFamilyRecommendation?.reasons)}

### Family Recommendation Candidates

${renderRecommendationCandidates(
  legacyReconstructionInput?.pageFamilyRecommendation?.candidates,
  "pageFamily",
)}

## Type Recommendation

- recommended: ${
          legacyReconstructionInput?.pageTypeRecommendation?.recommended || "—"
        }
- confidence: ${
          legacyReconstructionInput?.pageTypeRecommendation?.confidence || "—"
        }

### Type Recommendation Reasons

${renderArray(legacyReconstructionInput?.pageTypeRecommendation?.reasons)}

### Type Recommendation Candidates

${renderRecommendationCandidates(
  legacyReconstructionInput?.pageTypeRecommendation?.candidates,
)}

## Legacy Evidence

${renderJsonBlock(legacyReconstructionInput?.evidence ?? null)}

## Legacy Intake Source

${renderJsonBlock(legacyReconstructionInput?.sourceMeta ?? null)}

## Legacy Facts

- titleDraft: ${legacyReconstructionInput?.legacyFacts?.titleDraft || "—"}
- pageGoal: ${legacyReconstructionInput?.legacyFacts?.pageGoal || "—"}

### Layout Facts

${renderArray(legacyReconstructionInput?.legacyFacts?.layoutFacts)}

### Query Facts

${renderJsonBlock(legacyReconstructionInput?.legacyFacts?.queryFacts ?? [])}

### Table Facts

${renderJsonBlock(legacyReconstructionInput?.legacyFacts?.tableFacts ?? [])}

### Form Facts

${renderJsonBlock(legacyReconstructionInput?.legacyFacts?.formFacts ?? [])}

### Detail Facts

${renderJsonBlock(legacyReconstructionInput?.legacyFacts?.detailFacts ?? [])}

### API Contracts

${renderJsonBlock(legacyReconstructionInput?.legacyFacts?.apiContracts ?? [])}

### Interaction Contracts

${renderJsonBlock(
  legacyReconstructionInput?.legacyFacts?.interactionContracts ?? [],
)}

### Route Facts

${renderJsonBlock(legacyReconstructionInput?.legacyFacts?.routeFacts ?? null)}

### Permission Facts

${renderArray(legacyReconstructionInput?.legacyFacts?.permissionFacts)}

### Invariants

${renderArray(legacyReconstructionInput?.legacyFacts?.invariants)}

### Unknowns

${renderArray(legacyReconstructionInput?.legacyFacts?.unknowns)}

## Migration Invariants

${renderJsonBlock(brief.migrationInvariantContract ?? null)}

## Analytics Refactor Contract

${renderJsonBlock(brief.analyticsRefactorContract ?? null)}

## Analytics Refactor View Model

${renderJsonBlock(
  brief.pageGenerationDecision.analyticsRefactorViewModel ?? null,
)}

## Chat Confirmation

- confirmationMode: ${brief.executionPolicy.confirmationMode || "—"}
- confirmedPageFamily: ${brief.executionPolicy.confirmedPageFamily || "—"}
- confirmedPageType: ${brief.executionPolicy.confirmedPageType || "—"}
- finalPromptSummary: ${summarizePrompt(
          legacyReconstructionInput?.confirmation?.finalPrompt,
        )}
`
      : "";
  const designRestoreSection = isDesignRestoreInputMode(brief.inputMode.id)
    ? `
## Design Restore Evidence

- figmaUrl: ${confirmedDesignRestoreInput?.evidence?.figmaUrl || "—"}
- fileKey: ${confirmedDesignRestoreInput?.evidence?.fileKey || "—"}
- nodeId: ${confirmedDesignRestoreInput?.evidence?.nodeId || "—"}
- screenshotPath: ${
        confirmedDesignRestoreInput?.evidence?.screenshotPath || "—"
      }

## Design Restore Target

- viewportKind: ${confirmedDesignRestoreInput?.targetViewport?.kind || "—"}
- viewportWidth: ${confirmedDesignRestoreInput?.targetViewport?.width ?? "—"}
- targetStateId: ${confirmedDesignRestoreInput?.targetState?.stateId || "—"}
- targetStateLabel: ${confirmedDesignRestoreInput?.targetState?.label || "—"}
- allowedAdaptationLevel: ${
        confirmedDesignRestoreInput?.allowedAdaptationLevel || "—"
      }
- assetPolicy.icons: ${confirmedDesignRestoreInput?.assetPolicy?.icons || "—"}
- assetPolicy.images: ${confirmedDesignRestoreInput?.assetPolicy?.images || "—"}
- assetPolicy.allowHandwrittenReplacement: ${
        confirmedDesignRestoreInput?.assetPolicy?.allowHandwrittenReplacement ??
        "—"
      }

### Must Match Regions

${renderJsonBlock(confirmedDesignRestoreInput?.mustMatchRegions ?? [])}

## Restore Decision Package

- pageGoal: ${
        confirmedDesignRestoreInput?.restoreDecisionPackage?.pageGoal || "—"
      }
- layoutIntent: ${
        confirmedDesignRestoreInput?.restoreDecisionPackage?.layoutIntent || "—"
      }

### Region Decision Table

${renderJsonBlock(
  confirmedDesignRestoreInput?.restoreDecisionPackage?.regionDecisionTable ??
    [],
)}

## Design Restore Routing Decision

${renderJsonBlock(brief.designRestoreRoutingDecision ?? null)}

## Chat Confirmation

- confirmationMode: ${brief.executionPolicy.confirmationMode || "—"}
- confirmedPageFamily: ${brief.executionPolicy.confirmedPageFamily || "—"}
- confirmedPageType: ${brief.executionPolicy.confirmedPageType || "—"}
- finalPromptSummary: ${summarizePrompt(
        confirmedDesignRestoreInput?.confirmation?.finalPrompt,
      )}
`
    : "";
  return `## Target

- mode: ${brief.mode}
- requestedMode: ${brief.requestedMode}
- localizationMode: ${brief.localizationMode || DEFAULT_LOCALIZATION_MODE}
- inputMode: ${brief.inputMode.id}
- inputModeLabel: ${brief.inputMode.label}
- inputEvidenceType: ${brief.inputMode.evidenceType}
- pageSelector: ${brief.pageSelector?.kind || "page-type"} / ${
    brief.pageSelector?.id || brief.pageType.id || "—"
  }
- pageType: ${brief.pageType.id} / ${brief.pageType.label}
- pageFamily: ${brief.pageType.pageFamily}
- pageFamilyLabel: ${brief.pageGenerationDecision.pageFamilyContract.label}
- shell: ${brief.pageType.shell}
- title: ${brief.requestedBusiness.title || "—"}
- rawDest: ${brief.requestedBusiness.rawDest || "—"}
- dest: ${brief.requestedBusiness.dest || "—"}
- targetBusinessPath: ${brief.requestedBusiness.targetBusinessPath || "—"}
- defaultBusinessPageDir: ${
    brief.requestedBusiness.defaultBusinessPageDir || "—"
  }
- routePath: ${brief.requestedBusiness.routePath || "—"}
- detailSectionsCount: ${brief.requestedBusiness.detailSections?.length || 0}
- detailSectionsSource: ${brief.requestedBusiness.detailSectionsSource || "—"}
- feedbackVariantId: ${brief.requestedBusiness.feedbackVariantId || "—"}

## Output Target Evidence

- selectedSource: ${brief.outputTargetEvidence?.selectedSource || "—"}
- targetBusinessPathSource: ${
    brief.outputTargetEvidence?.targetBusinessPathSource || "—"
  }
- derivedDefaultBusinessPageDir: ${
    brief.outputTargetEvidence?.derivedDefaultBusinessPageDir || "—"
  }
- navigationContractDerivedDir: ${
    brief.outputTargetEvidence?.navigationContractDerivedDir || "—"
  }
- relatedPagePath: ${brief.outputTargetEvidence?.relatedPagePath || "—"}
- relatedPageAccepted: ${
    brief.outputTargetEvidence?.relatedPageAccepted === true
  }
- relatedPageDir: ${brief.outputTargetEvidence?.relatedPageDir || "—"}
- relatedPageRejectedReasons: ${
    Array.isArray(brief.outputTargetEvidence?.relatedPageRejectedReasons) &&
    brief.outputTargetEvidence.relatedPageRejectedReasons.length > 0
      ? brief.outputTargetEvidence.relatedPageRejectedReasons.join(", ")
      : "—"
  }
- implicitFeatureBaseDir: ${
    brief.outputTargetEvidence?.implicitFeatureBaseDir || "—"
  }
- policyDefaultBusinessPageDir: ${
    brief.outputTargetEvidence?.policyDefaultBusinessPageDir || "—"
  }

## Host Profile

- projectType: ${brief.hostProfile.projectType}
- framework: ${brief.hostProfile.framework}
- runtime: ${brief.hostProfile.runtime}
- routing: ${brief.hostProfile.routing}
- strategy: ${brief.hostProfile.strategy}
- reason: ${brief.hostProfile.reason}

## Integration Readiness

- status: ${brief.integrationReadiness?.status || "—"}
- ready: ${brief.integrationReadiness?.ready ?? "—"}
- appliedMode: ${brief.integrationReadiness?.appliedMode || "—"}
- contextRoot: ${brief.integrationReadiness?.contextRoot || "—"}
- applyStatePath: ${brief.integrationReadiness?.applyStatePath || "—"}
- applyProgressPath: ${brief.integrationReadiness?.applyProgressPath || "—"}
- applyProgressStatus: ${
    brief.integrationReadiness?.applyProgress?.status || "—"
  }
- applyProgressStage: ${brief.integrationReadiness?.applyProgress?.stage || "—"}
- reason: ${brief.integrationReadiness?.reason || "—"}

### Compatibility Warnings

${renderArray(brief.integrationReadiness?.compatibilityWarnings)}

### Missing Markers

${renderArray(brief.integrationReadiness?.missingMarkers)}

## Project Host Contract

- status: ${brief.projectHostContract?.status || "—"}
- required: ${brief.projectHostContract?.required === true}
- path: ${brief.projectHostContract?.path || "—"}
- schema: ${brief.projectHostContract?.schema || "—"}
- hostFamily: ${brief.projectHostContract?.hostFamily || "—"}
- publishMechanism: ${brief.projectHostContract?.publishMechanism || "—"}
- executionContractKind: ${
    brief.projectHostContract?.executionContractKind || "—"
  }
- executionContractConfirmationStatus: ${
    brief.projectHostContract?.executionContractConfirmationStatus || "—"
  }
- defaultBusinessPageDir: ${
    brief.projectHostContract?.defaultBusinessPageDir || "—"
  }
- hostExecutionAdapterKind: ${
    brief.projectHostContract?.hostExecutionAdapterKind || "—"
  }
- formalNavigationReady: ${
    brief.projectHostContract?.formalNavigationReady === true
  }
- fingerprintSource: ${brief.projectHostContract?.fingerprintSource || "—"}
- consumptionPolicy: ${brief.projectHostContract?.consumptionPolicy || "—"}

## Sources

- manifest: ${brief.sources.manifestPath}
- sourceTemplate: ${brief.sources.sourceTemplatePath}
- officialPreviewReference(reference-only): ${brief.sources.runtimeExamplePath}
- globalPreviewRoute(reference-only): ${brief.sources.globalPreviewRoute || "—"}
- preferredTemplate: ${brief.sources.preferredTemplatePath}
- preferredTemplateExists: ${brief.sources.preferredTemplateExists}
- preferredStyle: ${brief.sources.preferredStylePath || "—"}
- preferredStyleExists: ${
    brief.sources.preferredStylePath
      ? brief.sources.preferredStyleExists
      : "not-required"
  }
${screenshotRecommendationSection}
${designRestoreSection}
${legacyReconstructionSection}
${nonTypicalConversationSection}
${nonTypicalCoordinationSection}

## Detail Sections

${renderJsonBlock(brief.requestedBusiness.detailSections ?? [])}

## Business Slot Plan

${renderJsonBlock(brief.pageGenerationDecision.businessSlotPlan ?? {})}

## Page Generation Decision

- generationPath: ${brief.pageGenerationDecision.generationPath.id} / ${
    brief.pageGenerationDecision.generationPath.label
  }
- carrierStrategy(copyMode): ${brief.pageGenerationDecision.copyMode}
- workflowKind: ${brief.pageGenerationDecision.workflow.kind}
- workflowDefaultFlow: ${brief.pageGenerationDecision.workflow.defaultFlow}
- replaceBusinessSlotsByDefault: ${
    brief.pageGenerationDecision.workflow.replaceBusinessSlotsByDefault
  }
- generatorMode: ${brief.pageGenerationDecision.workflow.generatorMode}
- contentGenerationMode: ${
    brief.pageGenerationDecision.workflow.contentGenerationMode
  }
- templateUsageMode: ${brief.pageGenerationDecision.workflow.templateUsageMode}
- pageFamilySupportsBusinessSlotReplacement: ${
    brief.pageGenerationDecision.pageFamilyContract
      .supportsBusinessSlotReplacement
  }
- pageFamilySupportsLocalAdjustment: ${
    brief.pageGenerationDecision.pageFamilyContract.supportsLocalAdjustment
  }
- pageFamilyLegacyRefactorContractMode: ${
    brief.pageGenerationDecision.pageFamilyContract.legacyRefactorContractMode
  }
- hostCapability: ${brief.pageGenerationDecision.hostCapability.status}
- hostCapabilityReason: ${brief.pageGenerationDecision.hostCapability.reason}
- hasHostProviderBridge: ${
    brief.pageGenerationDecision.hostCapability.hasHostProviderBridge
  }
- hasSharedHeaderSlot: ${
    brief.pageGenerationDecision.hostCapability.hasSharedHeaderSlot
  }
- sharedHeaderSlotPolicy: ${
    brief.pageGenerationDecision.hostCapability.sharedHeaderSlotPolicy
  }
- hasContinuousHeightChain: ${
    brief.pageGenerationDecision.hostCapability.hasContinuousHeightChain
  }
- formalHostLayoutMode: ${
    brief.pageGenerationDecision.formalHostProfile?.layoutMode || "unknown"
  }
- formalHostHeaderSlotPolicy: ${
    brief.pageGenerationDecision.formalHostProfile?.headerSlotPolicy ||
    "unknown"
  }
- selectedHeaderStrategy: ${
    brief.pageGenerationDecision.selectedHeaderStrategy || "unknown"
  }
- requiredHostAction: ${
    brief.pageGenerationDecision.requiredHostAction || "none"
  }
- headerOwnershipDecisionStatus: ${
    brief.pageGenerationDecision.headerOwnershipDecision?.status || "unknown"
  }
- headerOwnershipDecisionReason: ${
    brief.pageGenerationDecision.headerOwnershipDecision?.reason || "—"
  }

## Page Relation Decision

- kind: ${
    brief.pageGenerationDecision.pageRelationDecision?.kind || "undetermined"
  }
- confidence: ${
    brief.pageGenerationDecision.pageRelationDecision?.confidence || "low"
  }
- reason: ${brief.pageGenerationDecision.pageRelationDecision?.reason || "—"}
- evidence: ${
    Array.isArray(
      brief.pageGenerationDecision.pageRelationDecision?.evidence,
    ) && brief.pageGenerationDecision.pageRelationDecision.evidence.length > 0
      ? brief.pageGenerationDecision.pageRelationDecision.evidence.join(", ")
      : "—"
  }

## Navigation Mount Decision (write-before-page gate)

- existingBusinessNavigation: ${
    brief.pageGenerationDecision.navigationMountDecision
      ?.existingBusinessNavigation || "missing"
  }
- action: ${
    brief.pageGenerationDecision.navigationMountDecision?.action || "ask-user"
  }
- routeRegistryPath: ${
    brief.pageGenerationDecision.navigationMountDecision?.routeRegistryPath ||
    "—"
  }
- menuRegistryPath: ${
    brief.pageGenerationDecision.navigationMountDecision?.menuRegistryPath ||
    "—"
  }
- formalShellPath: ${
    brief.pageGenerationDecision.navigationMountDecision?.formalShellPath || "—"
  }
- shellCertification: ${
    brief.pageGenerationDecision.navigationMountDecision?.shellCertification ||
    "missing"
  }
- shellCertificationEvidence: ${
    Array.isArray(
      brief.pageGenerationDecision.navigationMountDecision
        ?.shellCertificationEvidence,
    ) &&
    brief.pageGenerationDecision.navigationMountDecision
      .shellCertificationEvidence.length > 0
      ? brief.pageGenerationDecision.navigationMountDecision.shellCertificationEvidence.join(
          ", ",
        )
      : "—"
  }
- shellSource: ${
    brief.pageGenerationDecision.navigationMountDecision?.shellSource ||
    "unknown"
  }
- reason: ${
    brief.pageGenerationDecision.navigationMountDecision?.reason ||
    "Navigation mount point must be decided before writing page code."
  }

## Navigation Mount Action

- action: ${
    brief.pageGenerationDecision.navigationMountAction?.action || "ask-user"
  }
- targetShellPath: ${
    brief.pageGenerationDecision.navigationMountAction?.targetShellPath || "—"
  }
- targetRegistryPath: ${
    brief.pageGenerationDecision.navigationMountAction?.targetRegistryPath ||
    "—"
  }
- appEntryPath: ${
    brief.pageGenerationDecision.navigationMountAction?.appEntryPath || "—"
  }
- pageRoutePath: ${
    brief.pageGenerationDecision.navigationMountAction?.pageRoutePath || "—"
  }
- menuTitle: ${
    brief.pageGenerationDecision.navigationMountAction?.menuTitle || "—"
  }
- mustDoBeforePageCode: ${
    brief.pageGenerationDecision.navigationMountAction?.mustDoBeforePageCode !==
    false
  }
- reason: ${
    brief.pageGenerationDecision.navigationMountAction?.reason ||
    "Navigation mount action must be completed before writing page code."
  }

## Navigation Decision

- formalHostAction: ${
    brief.pageGenerationDecision.navigationDecision.formalHostAction
  }
- requiresFormalBusinessShell: ${
    brief.pageGenerationDecision.navigationDecision.requiresFormalBusinessShell
  }
- formalBusinessShellExists: ${
    brief.pageGenerationDecision.navigationDecision.formalBusinessShellExists
  }
- formalNavigationRegistryExists: ${
    brief.pageGenerationDecision.navigationDecision
      .formalNavigationRegistryExists
  }
- formalBusinessShellPath: ${
    brief.pageGenerationDecision.navigationDecision.formalBusinessShellPath ||
    "—"
  }
- formalNavigationRegistryPath: ${
    brief.pageGenerationDecision.navigationDecision
      .formalNavigationRegistryPath || "—"
  }
- shellCertification: ${
    brief.pageGenerationDecision.navigationDecision.shellCertification ||
    "missing"
  }
- shellCertificationEvidence: ${
    Array.isArray(
      brief.pageGenerationDecision.navigationDecision
        .shellCertificationEvidence,
    ) &&
    brief.pageGenerationDecision.navigationDecision.shellCertificationEvidence
      .length > 0
      ? brief.pageGenerationDecision.navigationDecision.shellCertificationEvidence.join(
          ", ",
        )
      : "—"
  }
- shellCertificationMarker: ${
    brief.pageGenerationDecision.navigationDecision.shellCertificationMarker ||
    "—"
  }
- ambiguousFormalNavigationEvidencePaths: ${
    Array.isArray(
      brief.pageGenerationDecision.navigationDecision
        .ambiguousFormalNavigationEvidencePaths,
    ) &&
    brief.pageGenerationDecision.navigationDecision
      .ambiguousFormalNavigationEvidencePaths.length > 0
      ? brief.pageGenerationDecision.navigationDecision.ambiguousFormalNavigationEvidencePaths.join(
          ", ",
        )
      : "—"
  }
- requiredNavigationStyleReference: ${
    brief.pageGenerationDecision.navigationDecision
      .requiredNavigationStyleReference
  }
- requiredRegistrationMode: ${
    brief.pageGenerationDecision.navigationDecision.requiredRegistrationMode
  }
- shouldAutoCreateFormalBusinessShell: ${
    brief.pageGenerationDecision.navigationDecision
      .shouldAutoCreateFormalBusinessShell
  }
- shouldAppendToExistingNavigation: ${
    brief.pageGenerationDecision.navigationDecision
      .shouldAppendToExistingNavigation
  }
- shouldReuseExistingProjectNavigation: ${
    brief.pageGenerationDecision.navigationDecision
      .shouldReuseExistingProjectNavigation
  }
- shouldBlockForMissingExistingNavigation: ${
    brief.pageGenerationDecision.navigationDecision
      .shouldBlockForMissingExistingNavigation
  }
- shouldBlockForAmbiguousNavigationEvidence: ${
    brief.pageGenerationDecision.navigationDecision
      .shouldBlockForAmbiguousNavigationEvidence
  }
- shouldBlockForUncertifiedExistingNavigation: ${
    brief.pageGenerationDecision.navigationDecision
      .shouldBlockForUncertifiedExistingNavigation
  }
- oldProjectMustNotCreateFormalNavigation: ${
    brief.pageGenerationDecision.navigationDecision
      .oldProjectMustNotCreateFormalNavigation
  }
- navigationBlocked: ${
    brief.pageGenerationDecision.navigationDecision.navigationBlocked
  }
- blockReason: ${
    brief.pageGenerationDecision.navigationDecision.blockReason || "—"
  }
- formalNavigationMustContainOnlyGeneratedBusinessPages: ${
    brief.pageGenerationDecision.navigationDecision
      .formalNavigationMustContainOnlyGeneratedBusinessPages
  }
- forbidSyntheticLandingPage: ${
    brief.pageGenerationDecision.navigationDecision.forbidSyntheticLandingPage
  }
- defaultLandingPolicy: ${
    brief.pageGenerationDecision.navigationDecision.defaultLandingPolicy
  }
- mustAutoMountFuturePages: ${
    brief.pageGenerationDecision.navigationDecision.mustAutoMountFuturePages
  }
- previewMustRemainIsolated: ${
    brief.pageGenerationDecision.navigationDecision.previewMustRemainIsolated
  }

### Host Shell Decision

- status: ${brief.pageGenerationDecision.hostShellDecision?.status || "—"}
- materializationStrategy: ${
    brief.pageGenerationDecision.hostShellDecision?.materializationStrategy ||
    "—"
  }
- baseHostTemplatePath: ${
    brief.pageGenerationDecision.hostShellDecision?.baseHostTemplatePath || "—"
  }
- managedHostImportSource: ${
    brief.pageGenerationDecision.hostShellDecision?.managedHostImportSource ||
    "—"
  }
- officialHostSourceStatus: ${
    brief.pageGenerationDecision.hostShellDecision?.officialHostSourceStatus ||
    "—"
  }
- targetShellDir: ${
    brief.pageGenerationDecision.hostShellDecision?.targetShellDir || "—"
  }
- targetShellPath: ${
    brief.pageGenerationDecision.hostShellDecision?.targetShellPath || "—"
  }
- targetRegistryPath: ${
    brief.pageGenerationDecision.hostShellDecision?.targetRegistryPath || "—"
  }
- preferredExtension: ${
    brief.pageGenerationDecision.hostShellDecision?.preferredExtension || "—"
  }
- shellCertification: ${
    brief.pageGenerationDecision.hostShellDecision?.shellCertification ||
    "missing"
  }
- sourceAppFramePath: ${
    brief.pageGenerationDecision.hostShellDecision?.sourceAppFramePath || "—"
  }
- mustUseThinWrapper: ${
    brief.pageGenerationDecision.hostShellDecision?.mustUseThinWrapper
  }
- mustNotPrecreateShell: ${
    brief.pageGenerationDecision.hostShellDecision?.mustNotPrecreateShell
  }
- mustKeepPreviewRouteTreeIsolated: ${
    brief.pageGenerationDecision.hostShellDecision
      ?.mustKeepPreviewRouteTreeIsolated
  }
- mustKeepFormalHostShellThinWrapper: ${
    brief.pageGenerationDecision.hostShellDecision
      ?.mustKeepFormalHostShellThinWrapper
  }

#### Allowed Replacements

${renderArray(
  brief.pageGenerationDecision.hostShellDecision?.allowedReplacements,
)}

#### Locked Regions

${renderArray(brief.pageGenerationDecision.hostShellDecision?.lockedRegions)}

#### Forbidden Patterns

${renderArray(
  brief.pageGenerationDecision.hostShellDecision?.forbiddenPatterns,
)}

### Workflow Module Set

${renderArray(brief.pageGenerationDecision.workflow.requiredModuleSet)}

### Workflow Fixed Regions

${renderArray(brief.pageGenerationDecision.workflow.fixedRegions)}

### Workflow Manual Refactor Owners

${renderArray(brief.pageGenerationDecision.workflow.manualRefactorOwners)}

### Workflow Reference Modules

${renderArray(brief.pageGenerationDecision.workflow.referenceModules)}

### Workflow Notes

- description: ${brief.pageGenerationDecision.workflow.description || "—"}
- summarySection.gridIndependence: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.summarySection
      ?.gridIndependence || "—"
  }
- summarySection.metricCardMiniChart: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.summarySection
      ?.metricCardMiniChart || "—"
  }
- summarySection.defaultMetricContent: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.summarySection
      ?.defaultMetricContent || "—"
  }
- chartSection.desktopBaseColumns: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.desktopBaseColumns ?? "—"
  }
- chartSection.allowedChartSpans: ${
    Array.isArray(
      brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
        ?.allowedChartSpans,
    )
      ? brief.pageGenerationDecision.workflow.sectionLayoutSemantics.chartSection.allowedChartSpans.join(
          ", ",
        )
      : "—"
  }
- chartSection.baseGridMode: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.baseGridMode || "—"
  }
- chartSection.primaryChartEmphasis: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.primaryChartEmphasis || "—"
  }
- chartSection.mixedRowGridModes: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.mixedRowGridModes || "—"
  }
- chartSection.avoidLastRowHoles: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.avoidLastRowHoles ?? "—"
  }
- chartSection.rowFillPolicy: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.rowFillPolicy || "—"
  }
- chartSection.remainderResolutionOrder: ${
    Array.isArray(
      brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
        ?.remainderResolutionOrder,
    )
      ? brief.pageGenerationDecision.workflow.sectionLayoutSemantics.chartSection.remainderResolutionOrder.join(
          " -> ",
        )
      : "—"
  }
- chartSection.cardStretchPolicy: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.cardStretchPolicy || "—"
  }
- chartSection.chartCardContentPolicy: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.chartCardContentPolicy || "—"
  }
- chartSection.chartCanvasMinHeight: ${
    brief.pageGenerationDecision.workflow.sectionLayoutSemantics?.chartSection
      ?.chartCanvasMinHeight ?? "—"
  }
- chartLayoutPlanningRequired: ${
    brief.pageGenerationDecision.workflow.chartLayoutPlanningRequired ?? "—"
  }
- chartCount: ${brief.pageGenerationDecision.workflow.chartCount ?? "—"}
- slotPlan: ${brief.pageGenerationDecision.workflow.slotPlan ?? "—"}
- slotRemainder: ${brief.pageGenerationDecision.workflow.slotRemainder ?? "—"}
- selectedChartArchetype: ${
    brief.pageGenerationDecision.workflow.selectedChartArchetype || "—"
  }
- rowFillDecision: ${
    brief.pageGenerationDecision.workflow.rowFillDecision || "—"
  }
- chartReusePolicy: ${
    brief.pageGenerationDecision.workflow.chartReusePolicy || "—"
  }
- stopAutoReplacementReason: ${
    brief.pageGenerationDecision.workflow.stopAutoReplacementReason || "—"
  }

## Coverage Decision

- status: ${brief.pageGenerationDecision.coverageDecision.status}
- managedByTemplate: ${
    brief.pageGenerationDecision.coverageDecision.managedByTemplate
  }
- localAdjustmentHandling(adjustmentHandling): ${
    brief.pageGenerationDecision.coverageDecision.adjustmentHandling
  }
- componentDecisionRequired: ${
    brief.pageGenerationDecision.coverageDecision.requiredDecisions
      .componentDecision
  }
- tokenDecisionRequired: ${
    brief.pageGenerationDecision.coverageDecision.requiredDecisions
      .tokenDecision
  }
- coverageValidation: ${brief.pageGenerationDecision.coverageValidation.status}

### Covered Regions

${renderArray(brief.pageGenerationDecision.coverageDecision.coveredRegions)}

### Uncovered UI

${renderArray(brief.pageGenerationDecision.coverageDecision.uncoveredUi)}

### Escape Hatches

${renderArray(brief.pageGenerationDecision.coverageDecision.escapeHatches)}

## Local Adjustment Decision

- status: ${brief.pageGenerationDecision.pageAdjustmentDecision.status}
- supported: ${brief.pageGenerationDecision.pageAdjustmentDecision.supported}
- source: ${brief.pageGenerationDecision.pageAdjustmentDecision.source || "—"}
- contractSpecPath: ${
    brief.pageGenerationDecision.pageAdjustmentDecision.specPath
  }
- contractSpecVersion: ${
    brief.pageGenerationDecision.pageAdjustmentDecision.specVersion
  }
- validation: ${
    brief.pageGenerationDecision.pageAdjustmentDecision.validation.status
  }

### Local Adjustment Validation Violations

${renderArray(
  brief.pageGenerationDecision.pageAdjustmentDecision.validation.violations,
)}

### Local Adjustment Contract

${renderJsonBlock(brief.pageAdjustmentContract)}

## Generation Path

- id: ${brief.pageGenerationDecision.generationPath.id}
- label: ${brief.pageGenerationDecision.generationPath.label}
- category: ${brief.pageGenerationDecision.generationPath.category}
- reason: ${brief.pageGenerationDecision.generationPath.reason}

## Host Import Policy

- contextPath: ${brief.pageGenerationDecision.hostImportPolicy.contextPath}
- hiui5Components: ${
    brief.pageGenerationDecision.hostImportPolicy.hiui5Components
  }
- typicalPageShells: ${
    brief.pageGenerationDecision.hostImportPolicy.typicalPageShells
  }
- icons: ${brief.pageGenerationDecision.hostImportPolicy.icons}

### Template Internal Allowed Visual Imports

${renderArray(
  brief.pageGenerationDecision.hostImportPolicy
    .templateInternalAllowedVisualImportSources,
)}

### Forbidden New Visual Imports

${renderArray(
  brief.pageGenerationDecision.hostImportPolicy.forbiddenNewVisualImports,
)}

## Generation Target Policy

- contextPath: ${
    brief.pageGenerationDecision.generationTargetPolicy.contextPath
  }
- scope: ${brief.pageGenerationDecision.generationTargetPolicy.scope || "—"}
- defaultBusinessPageDir: ${
    brief.pageGenerationDecision.generationTargetPolicy
      .defaultBusinessPageDir || "—"
  }
- forbiddenOutputRoots: ${
    brief.pageGenerationDecision.generationTargetPolicy.forbiddenOutputRoots.join(
      ", ",
    ) || "—"
  }
- previewReferencePolicy: ${
    brief.pageGenerationDecision.generationTargetPolicy
      .previewReferencePolicy || "—"
  }
- routeIsolationPolicy: ${
    brief.pageGenerationDecision.generationTargetPolicy.routeIsolationPolicy ||
    "—"
  }

### Generation Target Notes

${renderArray(brief.pageGenerationDecision.generationTargetPolicy.notes)}

## Generation Guidance

- guidanceDoc: ${brief.pageGenerationDecision.generationGuidance.guidanceDoc}
- defaultFlow: ${brief.pageGenerationDecision.generationGuidance.defaultFlow}
- enforceDangerousProps: ${
    brief.pageGenerationDecision.generationGuidance.enforceDangerousProps
  }
- enforceForbiddenSlots: ${
    brief.pageGenerationDecision.generationGuidance.enforceForbiddenSlots
  }
- enforceVisualTokens: ${
    brief.pageGenerationDecision.generationGuidance.enforceVisualTokens
  }
- enforceSemanticComponents: ${
    brief.pageGenerationDecision.generationGuidance.enforceSemanticComponents
  }
- enforceImportSourcePolicy: ${
    brief.pageGenerationDecision.generationGuidance.enforceImportSourcePolicy
  }

## Required Docs

${renderArray(brief.sources.requiredDocs)}

## Required Imports

${renderImportList(brief.generationContract.requiredImports)}

## Required Slots

${renderArray(brief.generationContract.requiredSlots)}

## Business Slots

${renderArray(brief.generationContract.businessSlots)}

## Locked Regions

${renderArray(brief.generationContract.lockedRegions)}

## Forbidden Tokens

${renderArray(brief.generationContract.forbiddenTokens)}

## Light Sanity Checks

${renderArray(brief.generationContract.lightSanityChecks)}

## Generation Notes

${renderArray(brief.generationContract.generationNotes)}

## Execution Policy

- integrationGate: ${brief.executionPolicy.integrationGate}
- mustPassIntegrationReadinessBeforeWriting: ${
    brief.executionPolicy.mustPassIntegrationReadinessBeforeWriting
  }
- mustPassPageTaskGateBeforeWriting: ${
    brief.executionPolicy.mustPassPageTaskGateBeforeWriting
  }
- requiresProjectLocalHiuiDesignContext: ${
    brief.executionPolicy.requiresProjectLocalHiuiDesignContext
  }
- mustAutoEnsureOrStopWhenIntegrationMissing: ${
    brief.executionPolicy.mustAutoEnsureOrStopWhenIntegrationMissing
  }
- mustStopWhenPageTaskGateClosed: ${
    brief.executionPolicy.mustStopWhenPageTaskGateClosed
  }
- pageTaskGateStatus: ${brief.executionPolicy.pageTaskGateStatus}
- pageTaskGateReason: ${brief.executionPolicy.pageTaskGateReason || "—"}
- pageTaskGateNextCommand: ${
    brief.executionPolicy.pageTaskGateNextCommand || "—"
  }
- requestedPageTypeStatus: ${
    brief.executionPolicy.requestedPageTypeStatus ||
    brief.executionPolicy.requestedPageTypeCapabilityStatus ||
    "not-checked"
  }
- requestedPageTypeReason: ${
    brief.executionPolicy.requestedPageTypeReason ||
    brief.executionPolicy.requestedPageTypeCapabilityReason ||
    "—"
  }
- writeReadiness: ${
    brief.executionPolicy.writeReadiness || "blocked-before-write"
  }
- forbidHostCompatibilityFallbackWhenIntegrationMissing: ${
    brief.executionPolicy.forbidHostCompatibilityFallbackWhenIntegrationMissing
  }
- forbiddenIntegrationFallbacks: ${
    brief.executionPolicy.forbiddenIntegrationFallbacks.join(", ") || "—"
  }
- mustCreateBriefBeforeWriting: ${
    brief.executionPolicy.mustCreateBriefBeforeWriting
  }
- mustStartFromOfficialTemplate: ${
    brief.executionPolicy.mustStartFromOfficialTemplate
  }
- mustStartFromOfficialReference: ${
    brief.executionPolicy.mustStartFromOfficialReference
  }
- mayReplaceOnlyBusinessSlots: ${
    brief.executionPolicy.mayReplaceOnlyBusinessSlots
  }
- inputMode: ${brief.executionPolicy.inputMode}
- confirmationMode: ${brief.executionPolicy.confirmationMode || "—"}
- requiresChatConfirmation: ${brief.executionPolicy.requiresChatConfirmation}
- confirmedPageFamily: ${brief.executionPolicy.confirmedPageFamily || "—"}
- confirmedPageType: ${brief.executionPolicy.confirmedPageType || "—"}
- finalPromptAvailable: ${brief.executionPolicy.finalPromptAvailable}
- generationPath: ${brief.executionPolicy.generationPath}
- generationPathLabel: ${brief.executionPolicy.generationPathLabel}
- generationPathReason: ${brief.executionPolicy.generationPathReason}
- pageAdjustmentContractStatus: ${
    brief.executionPolicy.pageAdjustmentContractStatus
  }
- pageAdjustmentContractProvided: ${
    brief.executionPolicy.pageAdjustmentContractProvided
  }
- pageAdjustmentContractSupported: ${
    brief.executionPolicy.pageAdjustmentContractSupported
  }
- pageAdjustmentContractSource: ${
    brief.executionPolicy.pageAdjustmentContractSource || "—"
  }
- migrationInvariantContractProvided: ${
    brief.executionPolicy.migrationInvariantContractProvided
  }
- analyticsRefactorContractProvided: ${
    brief.executionPolicy.analyticsRefactorContractProvided
  }
- analyticsRefactorContractSource: ${
    brief.executionPolicy.analyticsRefactorContractSource || "—"
  }
- mustPreserveWorkflowModuleSet: ${
    brief.executionPolicy.mustPreserveWorkflowModuleSet.join(", ") || "—"
  }
- targetBusinessPath: ${brief.executionPolicy.targetBusinessPath || "—"}
- defaultBusinessPageDir: ${brief.executionPolicy.defaultBusinessPageDir || "—"}
- forbiddenOutputRoots: ${
    brief.executionPolicy.forbiddenOutputRoots.join(", ") || "—"
  }
- previewReferencePolicy: ${brief.executionPolicy.previewReferencePolicy || "—"}
- routeIsolationPolicy: ${brief.executionPolicy.routeIsolationPolicy || "—"}
- mayPatchFormalRouteAutomatically: ${
    brief.executionPolicy.mayPatchFormalRouteAutomatically
  }
- mustRegisterToFormalNavigationRegistry: ${
    brief.executionPolicy.mustRegisterToFormalNavigationRegistry
  }
- formalNavigationRegistryPath: ${
    brief.executionPolicy.formalNavigationRegistryPath || "—"
  }
- navigationBlocked: ${brief.executionPolicy.navigationBlocked}
- navigationBlockReason: ${brief.executionPolicy.navigationBlockReason || "—"}
- navigationExecutionBlocked: ${
    brief.executionPolicy.navigationExecutionBlocked
  }
- navigationExecutionStatus: ${
    brief.executionPolicy.navigationExecutionStatus || "ready"
  }
- navigationExecutionBlockedBy: ${
    Array.isArray(brief.executionPolicy.navigationExecutionBlockedBy) &&
    brief.executionPolicy.navigationExecutionBlockedBy.length > 0
      ? brief.executionPolicy.navigationExecutionBlockedBy.join(", ")
      : "—"
  }
- navigationExecutionReason: ${
    brief.executionPolicy.navigationExecutionReason || "—"
  }
- requiresManualNavigationRegistration: ${
    brief.executionPolicy.requiresManualNavigationRegistration
  }
- formalNavigationMustContainOnlyGeneratedBusinessPages: ${
    brief.executionPolicy.formalNavigationMustContainOnlyGeneratedBusinessPages
  }
- forbidSyntheticLandingPage: ${
    brief.executionPolicy.forbidSyntheticLandingPage
  }
- defaultLandingPolicy: ${brief.executionPolicy.defaultLandingPolicy}
- browserValidationIsDefault: ${
    brief.executionPolicy.browserValidationIsDefault
  }

## Component Runtime Policy

- hiuiVisualPackagesMustResolveToMajor: ${
    brief.executionPolicy.componentRuntimePolicy
      .hiuiVisualPackagesMustResolveToMajor
  }
- schemaPackagesExpectedMajor: ${
    brief.executionPolicy.componentRuntimePolicy.schemaPackagesExpectedMajor
  }
- preferShellPublicImports: ${
    brief.executionPolicy.componentRuntimePolicy.preferShellPublicImports
  }
- forbidLegacyHiuiVisualImportsInGeneratedPage: ${
    brief.executionPolicy.componentRuntimePolicy
      .forbidLegacyHiuiVisualImportsInGeneratedPage
  }
- forbidAdHocComponentFallback: ${
    brief.executionPolicy.componentRuntimePolicy.forbidAdHocComponentFallback
  }
- dependencyIsolationCommand: ${
    brief.executionPolicy.componentRuntimePolicy.dependencyIsolationCommand
  }

${renderArray(brief.executionPolicy.componentRuntimePolicy.importGuidance)}

## Certified Implementation Boundary

- boundary: ${brief.executionPolicy.certifiedImplementationBoundary || "—"}

${renderArray(brief.executionPolicy.certifiedImplementationNotes)}

## Rollback Scope

${renderArray(brief.rollbackScope)}
`;
}

export function renderGenerationBriefMarkdown(brief) {
  const pageTaskGateStatus =
    brief?.executionPolicy?.pageTaskGateStatus ||
    brief?.pageTaskGate?.status ||
    "";
  const hardBlockedBeforeBrief =
    brief?.executionPolicy?.briefReadyToGenerate === false ||
    pageTaskGateStatus !== "ready-to-generate";

  if (hardBlockedBeforeBrief) {
    return renderBlockedGenerationBriefMarkdown(brief, brief?.targetRoot || "");
  }

  const detailBody = renderGenerationBriefMarkdownBody(brief);
  return `# HiUI5 Generation Brief

${detailBody}`;
}
