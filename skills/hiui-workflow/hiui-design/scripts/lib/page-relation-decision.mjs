import fs from "node:fs/promises";
import path from "node:path";

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeRelativePath(value) {
  return normalizeString(value)
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/");
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
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

function normalizeDecision(value = null) {
  if (!value || typeof value !== "object") return null;
  const kind = normalizeString(value.kind);
  if (!kind) return null;

  return {
    kind,
    confidence: normalizeString(value.confidence) || "low",
    reason: normalizeString(value.reason),
    evidence: Array.isArray(value.evidence)
      ? unique(value.evidence.map((item) => normalizeString(item)))
      : [],
  };
}

function buildPromptText(promptText = "", promptTexts = []) {
  return unique([
    normalizeString(promptText),
    ...promptTexts.map((item) => normalizeString(item)),
  ])
    .filter(Boolean)
    .join("\n");
}

function inferSubviewIntentFromPrompt(promptText = "") {
  const normalizedPrompt = normalizeString(promptText);
  if (!normalizedPrompt) {
    return {
      matched: false,
      evidence: [],
    };
  }

  const patterns = [
    {
      id: "button-enter-flow",
      pattern:
        /(增加|新增|添加).{0,24}(按钮|入口).{0,40}(点击|进入|打开|跳转)/u,
    },
    {
      id: "list-to-child-page",
      pattern:
        /(点击|进入|打开|跳转).{0,24}(详情|子页面|创建页|编辑页|详情页)/u,
    },
    {
      id: "subview-wording",
      pattern: /(子页面|详情页|创建页|编辑页|列表页点击)/u,
    },
  ];

  const evidence = patterns
    .filter((item) => item.pattern.test(normalizedPrompt))
    .map((item) => `prompt-signal:${item.id}`);

  return {
    matched: evidence.length > 0,
    evidence,
  };
}

function inferPublishIntentFromPrompt(promptText = "") {
  const normalizedPrompt = normalizeString(promptText);
  if (!normalizedPrompt) {
    return {
      matched: false,
      evidence: [],
    };
  }

  const patterns = [
    {
      id: "standalone-page",
      pattern: /(独立页面|独立发布|独立入口|独立路由)/u,
    },
    {
      id: "explicit-expose",
      pattern: /(暴露|expose|module federation|联邦入口)/iu,
    },
  ];

  const evidence = patterns
    .filter((item) => item.pattern.test(normalizedPrompt))
    .map((item) => `prompt-signal:${item.id}`);

  return {
    matched: evidence.length > 0,
    evidence,
  };
}

function inferExplicitPublishEntryKind(explicitNavigationMountContract = null) {
  const explicitEntryKind = normalizeString(
    explicitNavigationMountContract?.value?.entryKind,
  );
  const explicitContractKind = normalizeString(
    explicitNavigationMountContract?.contractKind ||
      explicitNavigationMountContract?.value?.contractKind,
  );
  const provided = explicitNavigationMountContract?.provided === true;
  const pointsToMf =
    explicitEntryKind === "module-federation-exposes" ||
    explicitEntryKind === "module-federation-expose";

  return {
    provided,
    explicitEntryKind,
    explicitContractKind,
    pointsToMf,
  };
}

export function buildPageRelationDecision({
  pageTypeId = "",
  requestedBusiness = {},
  outputTargetEvidence = {},
  explicitNavigationMountContract = null,
  promptText = "",
  promptTexts = [],
  exposeName = "",
} = {}) {
  const targetBusinessPath = normalizeRelativePath(
    requestedBusiness?.targetBusinessPath ||
      requestedBusiness?.dest ||
      requestedBusiness?.rawDest ||
      "",
  );
  const routePath = normalizeRelativePath(requestedBusiness?.routePath || "");
  const relatedPagePath = normalizeRelativePath(
    outputTargetEvidence?.relatedPagePath || "",
  );
  const relatedPageAccepted =
    outputTargetEvidence?.relatedPageAccepted === true;
  const relatedPageDir = normalizeRelativePath(
    outputTargetEvidence?.relatedPageDir || "",
  );
  const relatedPageSource = normalizeString(
    outputTargetEvidence?.relatedPageSource || "",
  );
  const relatedPageEntryDir = relatedPagePath
    ? normalizeRelativePath(path.posix.dirname(relatedPagePath))
    : "";
  const explicitPublishEntry = inferExplicitPublishEntryKind(
    explicitNavigationMountContract,
  );
  const normalizedExposeName = normalizeString(exposeName);
  const sharesRelatedPageModuleDir =
    Boolean(targetBusinessPath) &&
    Boolean(relatedPageEntryDir) &&
    isPathInsideRelativeRoot(targetBusinessPath, relatedPageEntryDir);
  const effectivePromptText = buildPromptText(promptText, promptTexts);
  const subviewIntent = inferSubviewIntentFromPrompt(effectivePromptText);
  const publishIntent = inferPublishIntentFromPrompt(effectivePromptText);
  const hasStandalonePublishSignal =
    Boolean(routePath) ||
    Boolean(normalizedExposeName) ||
    explicitPublishEntry.pointsToMf ||
    publishIntent.matched;
  const hasSubviewStructuralSignal =
    relatedPageAccepted &&
    sharesRelatedPageModuleDir &&
    !routePath &&
    !normalizedExposeName;
  const hasPromptBackedParentModuleSignal =
    subviewIntent.matched &&
    sharesRelatedPageModuleDir &&
    !hasStandalonePublishSignal;
  const evidence = unique([
    relatedPagePath ? `related-page-path:${relatedPagePath}` : "",
    relatedPageAccepted && relatedPagePath
      ? `accepted-related-page:${relatedPagePath}`
      : "",
    relatedPageDir ? `related-page-dir:${relatedPageDir}` : "",
    relatedPageSource ? `related-page-source:${relatedPageSource}` : "",
    sharesRelatedPageModuleDir && relatedPageEntryDir
      ? `target-under-related-page-dir:${relatedPageEntryDir}`
      : "",
    routePath ? `route-path:${routePath}` : "no-route-path",
    normalizedExposeName
      ? `expose-name:${normalizedExposeName}`
      : "no-expose-name",
    explicitPublishEntry.provided
      ? `explicit-navigation-contract:${
          explicitPublishEntry.explicitContractKind || "provided"
        }`
      : "",
    explicitPublishEntry.explicitEntryKind
      ? `explicit-entry-kind:${explicitPublishEntry.explicitEntryKind}`
      : "",
    ...subviewIntent.evidence,
    ...publishIntent.evidence,
  ]);

  if (routePath || normalizedExposeName || explicitPublishEntry.pointsToMf) {
    return {
      kind: "publish-unit",
      confidence: "high",
      reason:
        "An explicit standalone publish signal was provided through routePath, exposeName, or a Module Federation navigation contract, so this page should be treated as an independently publishable unit.",
      evidence,
    };
  }

  if (hasSubviewStructuralSignal && !hasStandalonePublishSignal) {
    return {
      kind: "same-module-subview",
      confidence: subviewIntent.matched ? "high" : "medium",
      reason:
        "Accepted relatedPagePath points at the parent module, the target business path stays under that module directory, and no standalone publish signal was requested, so the page should stay as a module-internal subview.",
      evidence,
    };
  }

  if (hasPromptBackedParentModuleSignal) {
    return {
      kind: "same-module-subview",
      confidence: "high",
      reason:
        "The prompt clearly describes a parent-page-to-child-page flow, the target business path still stays under that parent module directory, and no standalone publish signal was requested, so this page should remain a module-internal subview even if the exact relatedPagePath file still needs normalization.",
      evidence,
    };
  }

  if (
    relatedPageAccepted &&
    !hasStandalonePublishSignal &&
    subviewIntent.matched
  ) {
    return {
      kind: "same-module-subview",
      confidence: "medium",
      reason:
        "Accepted relatedPagePath plus the current prompt evidence suggests that the page belongs under the existing module rather than becoming a standalone publish unit.",
      evidence,
    };
  }

  if (publishIntent.matched && !relatedPageAccepted) {
    return {
      kind: "publish-unit",
      confidence: "medium",
      reason:
        "The prompt contains standalone publish wording and there is no accepted parent-page evidence proving a same-module subview relationship.",
      evidence,
    };
  }

  return {
    kind: "undetermined",
    confidence: "low",
    reason:
      "Current evidence does not yet prove whether this page is a module-internal subview or an independently publishable business unit.",
    evidence,
  };
}

export async function readPersistedPageGenerationMeta({
  targetRoot,
  dest = "",
} = {}) {
  const normalizedDest = normalizeRelativePath(dest);
  if (!targetRoot || !normalizedDest) {
    return {
      metaPath: "",
      meta: null,
    };
  }

  const metaPath = path.join(
    targetRoot,
    normalizedDest,
    "hiui-pagegen.meta.json",
  );

  try {
    const raw = await fs.readFile(metaPath, "utf8");
    return {
      metaPath,
      meta: JSON.parse(raw),
    };
  } catch {
    return {
      metaPath,
      meta: null,
    };
  }
}

export function resolveEffectivePageRelationDecision({
  briefPageRelationDecision = null,
  persistedPageRelationDecision = null,
  routePath = "",
  exposeName = "",
  expectedExposeTarget = "",
} = {}) {
  const normalizedBriefDecision = normalizeDecision(briefPageRelationDecision);
  const normalizedPersistedDecision = normalizeDecision(
    persistedPageRelationDecision,
  );
  const hasExplicitPublishSignal =
    Boolean(normalizeRelativePath(routePath)) ||
    Boolean(normalizeString(exposeName)) ||
    Boolean(normalizeString(expectedExposeTarget));

  if (
    normalizedPersistedDecision &&
    normalizedPersistedDecision.kind === "same-module-subview" &&
    !hasExplicitPublishSignal &&
    (!normalizedBriefDecision ||
      normalizedBriefDecision.kind === "undetermined")
  ) {
    return {
      decision: normalizedPersistedDecision,
      source: "pagegen-meta",
    };
  }

  if (normalizedBriefDecision) {
    return {
      decision: normalizedBriefDecision,
      source: "brief",
    };
  }

  if (normalizedPersistedDecision) {
    return {
      decision: normalizedPersistedDecision,
      source: "pagegen-meta",
    };
  }

  return {
    decision: {
      kind: "undetermined",
      confidence: "low",
      reason:
        "No page relation decision is available from either the current brief or persisted page metadata.",
      evidence: [],
    },
    source: "fallback",
  };
}

export function resolveEffectiveRelatedPagePath({
  relatedPagePath = "",
  briefOutputTargetEvidence = null,
  persistedMeta = null,
} = {}) {
  return (
    normalizeRelativePath(relatedPagePath) ||
    normalizeRelativePath(briefOutputTargetEvidence?.relatedPagePath || "") ||
    normalizeRelativePath(
      persistedMeta?.outputTargetEvidence?.relatedPagePath || "",
    ) ||
    ""
  );
}
