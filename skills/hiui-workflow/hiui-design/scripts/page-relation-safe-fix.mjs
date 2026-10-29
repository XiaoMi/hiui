#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { looksLikeManagedMfPublishEntryContent } from "./lib/managed-mf-publish-entry-template.mjs";
import {
  buildPageRelationDecision,
  readPersistedPageGenerationMeta,
} from "./lib/page-relation-decision.mjs";
import { buildPublishDeliveryDecision } from "./lib/publish-delivery-decision.mjs";
import { ensureProjectNodeRuntime } from "./lib/project-node-launcher.mjs";
import { buildStyleDeliveryDecision } from "./lib/style-delivery-decision.mjs";

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeRelativePath(value) {
  return normalizeString(value)
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/");
}

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--"))
    throw new Error(`Missing value for ${name}`);
  return value;
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    dest: "",
    pageType: "",
    title: "",
    relatedPagePath: "",
    relatedPageSource: "",
    routePath: "",
    exposeName: "",
    line: "",
    dryRun: false,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;

    if (arg === "--target") {
      options.target = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--dest") {
      options.dest = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--page-type") {
      options.pageType = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--title") {
      options.title = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--related-page-path") {
      options.relatedPagePath = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--related-page-source") {
      options.relatedPageSource = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--route-path") {
      options.routePath = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--expose-name") {
      options.exposeName = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--line") {
      options.line = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--json") {
      options.json = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node .local-context/hiui-design/scripts/page-relation-safe-fix.mjs --dest <relative-dir> [--page-type <id>] [--title <title>] [--related-page-path <relative-file>] [--related-page-source <source>] [--route-path <path>] [--expose-name <name>] [--line <prompt>] [--dry-run] [--json]",
      );
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.dest) {
    throw new Error("Missing required --dest");
  }

  return options;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
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

async function listManagedPublishEntryCandidates(targetRoot, dest) {
  const candidates = [];
  for (const baseName of ["mf-entry", "publish-entry"]) {
    for (const extension of [".tsx", ".jsx", ".ts", ".js"]) {
      const relativePath = `${normalizeRelativePath(
        dest,
      )}/${baseName}${extension}`;
      const absolutePath = path.join(targetRoot, relativePath);
      if (!(await pathExists(absolutePath))) continue;
      const source = await readTextIfExists(absolutePath);
      candidates.push({
        relativePath,
        absolutePath,
        managed: looksLikeManagedMfPublishEntryContent(source),
      });
    }
  }
  return candidates;
}

function normalizeRelativeDir(value) {
  const normalizedValue = normalizeRelativePath(value);
  return normalizedValue === "." ? "" : normalizedValue;
}

function buildRelatedPageEvidence(
  previousEvidence = {},
  relatedPagePath = "",
  relatedPageSource = "",
) {
  const normalizedRelatedPagePath = normalizeRelativePath(relatedPagePath);
  const normalizedRelatedPageSource =
    normalizeString(relatedPageSource) ||
    normalizeString(previousEvidence?.relatedPageSource || "");
  return {
    ...(previousEvidence && typeof previousEvidence === "object"
      ? previousEvidence
      : {}),
    relatedPagePath: normalizedRelatedPagePath,
    relatedPageAccepted: Boolean(normalizedRelatedPagePath),
    relatedPageDir: normalizedRelatedPagePath
      ? normalizeRelativeDir(path.posix.dirname(normalizedRelatedPagePath))
      : "",
    relatedPageSource: normalizedRelatedPageSource,
    relatedPageRejectedReasons: [],
  };
}

function buildManagedPublishEntryState({
  meta = null,
  managedCandidateFiles = [],
  keepManagedPublishEntry = false,
} = {}) {
  if (!keepManagedPublishEntry) {
    return {
      required: false,
      path: "",
      fileName: "",
      importsShellStyles: false,
      importsReactCompatPatch: false,
      appEntryPath: "",
    };
  }

  const currentManagedState =
    meta?.managedMfPublishEntry &&
    typeof meta.managedMfPublishEntry === "object"
      ? meta.managedMfPublishEntry
      : {};
  const managedPath = normalizeRelativePath(
    currentManagedState.path ||
      meta?.mfPublishEntryPath ||
      managedCandidateFiles[0]?.relativePath ||
      "",
  );

  return {
    required: Boolean(managedPath),
    path: managedPath,
    fileName:
      normalizeString(currentManagedState.fileName) ||
      (managedPath ? path.posix.basename(managedPath) : ""),
    importsShellStyles:
      currentManagedState.importsShellStyles === true ||
      meta?.mfPublishEntryShellStyles === true,
    importsReactCompatPatch:
      currentManagedState.importsReactCompatPatch === true,
    appEntryPath: normalizeRelativePath(
      currentManagedState.appEntryPath ||
        meta?.navigationMountAction?.appEntryPath ||
        "",
    ),
  };
}

function buildFixedNavigationMountAction({
  navigationMountAction = null,
  keepManagedPublishEntry = false,
} = {}) {
  const nextNavigationMountAction =
    navigationMountAction && typeof navigationMountAction === "object"
      ? JSON.parse(JSON.stringify(navigationMountAction))
      : {};

  if (
    !keepManagedPublishEntry &&
    nextNavigationMountAction?.action === "materialize-mf-publish-entry"
  ) {
    return {
      ...nextNavigationMountAction,
      action: "append-existing-entry",
      reason:
        "Safe fix converted this page back to same-module-subview, and the current host contract no longer requires a standalone managed publish entry.",
    };
  }

  return nextNavigationMountAction;
}

function buildFixedMeta(
  meta,
  {
    nextDecision,
    nextOutputTargetEvidence,
    nextPublishDeliveryDecision,
    nextStyleDeliveryDecision,
    nextNavigationMountAction,
    managedPublishEntryState,
    keepManagedPublishEntry = false,
  } = {},
) {
  const nextMeta = JSON.parse(JSON.stringify(meta || {}));
  nextMeta.outputTargetEvidence = nextOutputTargetEvidence;
  nextMeta.pageRelationDecision = nextDecision;
  nextMeta.publishDeliveryDecision = nextPublishDeliveryDecision;
  nextMeta.navigationMountAction = nextNavigationMountAction;
  nextMeta.styleDeliveryDecision = nextStyleDeliveryDecision;

  if (keepManagedPublishEntry) {
    nextMeta.mfPublishEntryPath = managedPublishEntryState.path;
    nextMeta.mfPublishEntryManaged = managedPublishEntryState.required;
    nextMeta.mfPublishEntryShellStyles =
      managedPublishEntryState.importsShellStyles;
    nextMeta.mfExposeUsesManagedPublishEntry =
      managedPublishEntryState.required;
    nextMeta.managedMfPublishEntry = managedPublishEntryState;
  } else {
    nextMeta.mfPublishEntryPath = "";
    nextMeta.mfPublishEntryManaged = false;
    nextMeta.mfPublishEntryShellStyles = false;
    nextMeta.mfExposeTargetPath = "";
    nextMeta.mfExposeUsesManagedPublishEntry = false;
    nextMeta.managedMfPublishEntry = managedPublishEntryState;
  }

  return nextMeta;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const options = parseArgs(rawArgs);
  const targetRoot = path.resolve(options.target);
  const scriptPath = fileURLToPath(import.meta.url);
  const runtimeReset = await ensureProjectNodeRuntime({
    targetRoot,
    scriptPath,
    scriptArgs: rawArgs,
    preferLoginShell: true,
  });
  if (runtimeReset.reexecuted) {
    process.exit(runtimeReset.exitCode ?? 0);
  }

  const { metaPath, meta } = await readPersistedPageGenerationMeta({
    targetRoot,
    dest: options.dest,
  });

  if (!meta) {
    throw new Error(
      `No persisted hiui-pagegen.meta.json found for ${options.dest}`,
    );
  }

  const relatedPagePath =
    normalizeRelativePath(options.relatedPagePath) ||
    normalizeRelativePath(meta?.outputTargetEvidence?.relatedPagePath || "");
  const pageType =
    normalizeString(options.pageType) || normalizeString(meta?.pageType);
  const title =
    normalizeString(options.title) ||
    normalizeString(meta?.requestedBusiness?.title);
  const routePath =
    normalizeString(options.routePath) ||
    normalizeString(meta?.requestedBusiness?.routePath);
  const exposeName = normalizeString(options.exposeName);
  const nextOutputTargetEvidence = buildRelatedPageEvidence(
    meta?.outputTargetEvidence || {},
    relatedPagePath,
    options.relatedPageSource,
  );
  const nextDecision = buildPageRelationDecision({
    pageTypeId: pageType,
    requestedBusiness: {
      targetBusinessPath:
        meta?.requestedBusiness?.targetBusinessPath || options.dest,
      dest: meta?.requestedBusiness?.targetBusinessPath || options.dest,
      routePath,
      rawDest: options.dest,
    },
    outputTargetEvidence: nextOutputTargetEvidence,
    promptText: options.line,
    exposeName,
  });
  const publishEntryCandidates = await listManagedPublishEntryCandidates(
    targetRoot,
    options.dest,
  );
  const managedCandidateFiles = publishEntryCandidates.filter(
    (item) => item.managed,
  );
  const unmanagedCandidateFiles = publishEntryCandidates.filter(
    (item) => !item.managed,
  );
  const nextPublishDeliveryDecision = buildPublishDeliveryDecision({
    pageRelationDecision: nextDecision,
    navigationMountAction: meta?.navigationMountAction || null,
    hostExecutionAdapter: meta?.hostExecutionAdapter || null,
  });
  const keepManagedPublishEntry =
    nextPublishDeliveryDecision.kind === "managed-mf-publish-entry";
  const managedPublishEntryState = buildManagedPublishEntryState({
    meta,
    managedCandidateFiles,
    keepManagedPublishEntry,
  });
  const nextNavigationMountAction = buildFixedNavigationMountAction({
    navigationMountAction: meta?.navigationMountAction || null,
    keepManagedPublishEntry,
  });
  const nextStyleDeliveryDecision = buildStyleDeliveryDecision({
    brief: {
      outputTargetEvidence: nextOutputTargetEvidence,
      requestedBusiness: meta?.requestedBusiness || {},
      pageGenerationDecision: {
        pageRelationDecision: nextDecision,
        publishDeliveryDecision: nextPublishDeliveryDecision,
        navigationMountAction: nextNavigationMountAction,
        hostExecutionAdapter: meta?.hostExecutionAdapter || {},
      },
    },
    pageFileRelativePath: normalizeRelativePath(
      meta?.contentSourcePath ||
        meta?.requestedBusiness?.targetBusinessPath ||
        options.dest,
    ),
    managedMfPublishEntry: managedPublishEntryState,
  });
  const hasStandaloneResidue =
    meta?.managedMfPublishEntry?.required === true ||
    meta?.mfPublishEntryManaged === true ||
    Boolean(normalizeString(meta?.mfPublishEntryPath)) ||
    managedCandidateFiles.length > 0 ||
    unmanagedCandidateFiles.length > 0;

  if (nextDecision.kind !== "same-module-subview") {
    const result = {
      schema: "hiui-design-page-relation-safe-fix.v1",
      status: "blocked",
      targetRoot,
      dest: normalizeRelativePath(options.dest),
      reason:
        "Current evidence does not prove this page is a same-module subview, so the safe fix entry will not remove standalone publish artifacts.",
      pageRelationDecision: nextDecision,
      metaPath,
      candidatePublishEntries: publishEntryCandidates,
    };
    process.stdout.write(
      options.json
        ? `${JSON.stringify(result, null, 2)}\n`
        : `${result.reason}\n`,
    );
    return;
  }

  if (unmanagedCandidateFiles.length > 0) {
    const result = {
      schema: "hiui-design-page-relation-safe-fix.v1",
      status: "blocked",
      targetRoot,
      dest: normalizeRelativePath(options.dest),
      reason:
        "A publish-entry file exists, but it does not look like a hiui-design managed file, so the safe fix entry refused to delete it automatically.",
      pageRelationDecision: nextDecision,
      metaPath,
      candidatePublishEntries: publishEntryCandidates,
    };
    process.stdout.write(
      options.json
        ? `${JSON.stringify(result, null, 2)}\n`
        : `${result.reason}\n`,
    );
    return;
  }

  if (keepManagedPublishEntry && managedPublishEntryState.required !== true) {
    const result = {
      schema: "hiui-design-page-relation-safe-fix.v1",
      status: "blocked",
      targetRoot,
      dest: normalizeRelativePath(options.dest),
      reason:
        "The updated page relation keeps the managed publish-entry delivery path, but no managed mf-entry file could be confirmed from metadata or generated files.",
      pageRelationDecision: nextDecision,
      metaPath,
      candidatePublishEntries: publishEntryCandidates,
    };
    process.stdout.write(
      options.json
        ? `${JSON.stringify(result, null, 2)}\n`
        : `${result.reason}\n`,
    );
    return;
  }

  const fixedMeta = buildFixedMeta(meta, {
    nextDecision,
    nextOutputTargetEvidence,
    nextPublishDeliveryDecision,
    nextStyleDeliveryDecision,
    nextNavigationMountAction,
    managedPublishEntryState,
    keepManagedPublishEntry,
  });
  const deletedFiles = keepManagedPublishEntry
    ? []
    : managedCandidateFiles.map((item) => item.relativePath);
  const writtenFiles = [
    path.relative(targetRoot, metaPath).replace(/\\/g, "/"),
  ];
  const metadataChanged =
    JSON.stringify(fixedMeta) !== JSON.stringify(meta || {});

  if (
    !metadataChanged &&
    deletedFiles.length === 0 &&
    (!hasStandaloneResidue || keepManagedPublishEntry)
  ) {
    const result = {
      schema: "hiui-design-page-relation-safe-fix.v1",
      status: "already-consistent",
      targetRoot,
      dest: normalizeRelativePath(options.dest),
      reason:
        "Page metadata and generated files are already consistent with the recomputed same-module-subview relationship and its current publish-delivery path.",
      pageRelationDecision: nextDecision,
      metaPath,
      candidatePublishEntries: publishEntryCandidates,
    };
    process.stdout.write(
      options.json
        ? `${JSON.stringify(result, null, 2)}\n`
        : `${result.reason}\n`,
    );
    return;
  }

  if (!options.dryRun) {
    await fs.writeFile(
      metaPath,
      `${JSON.stringify(fixedMeta, null, 2)}\n`,
      "utf8",
    );
    await Promise.all(
      deletedFiles.map((relativePath) =>
        fs.rm(path.join(targetRoot, relativePath), { force: true }),
      ),
    );
  }

  const result = {
    schema: "hiui-design-page-relation-safe-fix.v1",
    status: options.dryRun ? "dry-run" : "patched",
    targetRoot,
    dest: normalizeRelativePath(options.dest),
    reason: keepManagedPublishEntry
      ? "Safe fix rewrote the page metadata back to same-module-subview and preserved the managed publish-entry because the current host contract still requires that delivery path."
      : "Safe fix rewrote the page metadata back to same-module-subview and removed managed standalone publish-entry residue that is no longer required.",
    pageRelationDecision: nextDecision,
    metaPath,
    deletedFiles,
    writtenFiles,
    dryRun: options.dryRun,
    nextCommand:
      "node .local-context/hiui-design/scripts/integration-preflight.mjs --page-type <page-type> --dest <dest> --title <title> --json",
  };

  process.stdout.write(
    options.json
      ? `${JSON.stringify(result, null, 2)}\n`
      : `${result.reason}\n`,
  );
}

await main();
