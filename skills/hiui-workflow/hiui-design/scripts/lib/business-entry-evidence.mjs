import fs from "node:fs/promises";
import path from "node:path";

const BUSINESS_ENTRY_CONFIG_CANDIDATES = [
  "build/rspack.base.conf.js",
  "build/rspack.base.conf.ts",
  "build/rspack.dev.conf.js",
  "build/rspack.prod.conf.js",
  "build/webpack.base.conf.js",
  "build/webpack.base.conf.ts",
  "webpack.config.js",
  "webpack.config.ts",
  "rspack.config.js",
  "rspack.config.ts",
];
const GENERIC_DIRECTORY_TOKENS = new Set([
  "src",
  "app",
  "apps",
  "view",
  "views",
  "page",
  "pages",
  "component",
  "components",
  "layout",
  "layouts",
  "feature",
  "features",
  "module",
  "modules",
  "container",
  "containers",
]);

function normalizeString(value) {
  return String(value || "").trim();
}

export function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, "/");
}

function stripQuotedLiteral(value) {
  const normalized = normalizeString(value);
  const match = normalized.match(/^(['"`])([\s\S]*)\1$/);
  return match ? match[2] : normalized;
}

function splitCamelCaseToken(value) {
  return normalizeString(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeBusinessEntryRoutePath(value) {
  const normalized = stripQuotedLiteral(value);
  if (!normalized || normalized.includes("${")) return "";
  return normalized;
}

export function tokenizeBusinessEntryText(value) {
  const normalized = stripQuotedLiteral(value);
  if (!normalized) return [];

  const tokens = new Set();
  const pushToken = (token) => {
    const normalizedToken = normalizeString(token).toLowerCase();
    if (normalizedToken) tokens.add(normalizedToken);
  };

  pushToken(normalized);

  for (const segment of normalized.split(/[^A-Za-z0-9\u4e00-\u9fff]+/)) {
    pushToken(segment);
    for (const camelToken of splitCamelCaseToken(segment)) {
      pushToken(camelToken);
    }
  }

  return [...tokens];
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, "utf8");
  } catch {
    return "";
  }
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function countSharedTokens(leftTokens, rightTokens) {
  if (!Array.isArray(leftTokens) || !Array.isArray(rightTokens)) return 0;
  const rightSet = new Set(
    rightTokens
      .map((item) => normalizeString(item).toLowerCase())
      .filter(Boolean),
  );
  let count = 0;

  for (const token of leftTokens) {
    const normalizedToken = normalizeString(token).toLowerCase();
    if (normalizedToken && rightSet.has(normalizedToken)) count += 1;
  }

  return count;
}

function getBusinessEntryDirectorySignalPath(item) {
  if (item && typeof item === "object") {
    return normalizeRelativePath(
      item.entryPath || item.sourcePath || item.path || "",
    );
  }
  return normalizeRelativePath(item);
}

export function buildDirectoryTokens(relativePath) {
  const normalizedPath = normalizeRelativePath(relativePath);
  const directory = path.posix.dirname(normalizedPath);
  if (!directory || directory === ".") return [];

  return directory
    .split("/")
    .flatMap((segment) => tokenizeBusinessEntryText(segment))
    .filter((token) => !GENERIC_DIRECTORY_TOKENS.has(token));
}

function buildPathSignalTokens(relativePath) {
  const normalizedPath = normalizeRelativePath(relativePath);
  const tokens = [...buildDirectoryTokens(normalizedPath)];
  const basename = path.posix.basename(normalizedPath);
  const extension = path.posix.extname(basename);

  if (
    basename &&
    !extension &&
    !GENERIC_DIRECTORY_TOKENS.has(basename.toLowerCase())
  ) {
    tokens.push(...tokenizeBusinessEntryText(basename));
  }

  return [...new Set(tokens.filter(Boolean))];
}

export function scoreBusinessEntryEvidence(
  item,
  { routePath = "", title = "", dest = "" } = {},
) {
  const normalizedRoutePath = normalizeBusinessEntryRoutePath(routePath);
  const requestedTitleTokens = tokenizeBusinessEntryText(title);
  const requestedDestTokens = buildPathSignalTokens(dest);
  const itemTitleTokens = [
    ...(Array.isArray(item.titleTokens) ? item.titleTokens : []),
    ...(Array.isArray(item.nameTokens) ? item.nameTokens : []),
  ];
  const normalizedDest = normalizeRelativePath(dest);
  const normalizedFeatureBaseDir = normalizeRelativePath(
    item.featureBaseDir || "",
  );
  const directorySignalPath = getBusinessEntryDirectorySignalPath(item);

  let score =
    (item.kind === "window.addPage" || item.kind === "openNewPage"
      ? 100
      : item.kind === "module-federation-exposes"
        ? 160
        : item.kind === "module-federation-expose"
          ? 145
          : item.kind === "implicit-feature-registry"
            ? 120
            : 20) +
    (item.routePath ? 30 : 0) +
    (item.pathExpression ? 10 : 0) +
    (item.title ? 5 : 0) +
    (item.name ? 5 : 0) +
    (/^src\//.test(item.path) ? 5 : 0);

  if (
    item.kind === "module-federation-exposes" &&
    Array.isArray(item.exposes)
  ) {
    score += Math.min(item.exposes.length, 20) * 5;
  }

  if (item.kind === "module-federation-expose") {
    score += item.entryPath ? 25 : 0;
    score += item.publicName ? 20 : 0;
  }

  if (normalizedRoutePath && item.routePath === normalizedRoutePath) {
    score += 1000;
  }

  const sharedTitleTokens = countSharedTokens(
    requestedTitleTokens,
    itemTitleTokens,
  );
  if (sharedTitleTokens > 0) {
    score += 250 + sharedTitleTokens * 25;
  }

  const sharedDestTokens = countSharedTokens(
    requestedDestTokens,
    buildDirectoryTokens(directorySignalPath),
  );
  if (sharedDestTokens > 0) {
    score += sharedDestTokens * 25;
  }

  if (
    item.kind === "implicit-feature-registry" &&
    normalizedDest &&
    normalizedFeatureBaseDir &&
    (normalizedDest === normalizedFeatureBaseDir ||
      normalizedDest.startsWith(`${normalizedFeatureBaseDir}/`))
  ) {
    score += 500;
  }

  return score;
}

async function walkCodeFiles(rootDir, onFile) {
  let entries = [];
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      await walkCodeFiles(absolutePath, onFile);
      continue;
    }
    if (!/\.(?:js|jsx|ts|tsx)$/.test(entry.name)) continue;
    await onFile(absolutePath);
  }
}

function findBalancedBlock(
  source,
  openIndex,
  { openChar = "{", closeChar = "}" } = {},
) {
  if (openIndex < 0 || source[openIndex] !== openChar) return null;

  let depth = 0;
  let quote = "";
  let escaped = false;
  const contentStart = openIndex + 1;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) {
        quote = "";
      }
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      continue;
    }

    if (char === openChar) {
      depth += 1;
      continue;
    }

    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) {
        return {
          openIndex,
          closeIndex: index,
          body: source.slice(contentStart, index),
        };
      }
    }
  }

  return null;
}

export function findModuleFederationExposesBlock(source) {
  const exposesMatch = /exposes\s*:\s*\{/.exec(source);
  if (!exposesMatch || typeof exposesMatch.index !== "number") return null;
  const openIndex = exposesMatch.index + exposesMatch[0].lastIndexOf("{");
  return findBalancedBlock(source, openIndex, {
    openChar: "{",
    closeChar: "}",
  });
}

export function extractModuleFederationExposes(source) {
  const block = findModuleFederationExposesBlock(source)?.body ?? "";
  const exposes = [];
  const pattern = /['"](\.\/[^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g;
  let match = pattern.exec(block);

  while (match) {
    exposes.push({ publicName: match[1], sourcePath: match[2] });
    match = pattern.exec(block);
  }

  return exposes;
}

export async function findModuleFederationConfigs(targetRoot) {
  const configs = [];

  for (const relativePath of BUSINESS_ENTRY_CONFIG_CANDIDATES) {
    const absolutePath = path.join(targetRoot, relativePath);
    if (!(await pathExists(absolutePath))) continue;
    const source = await readTextIfExists(absolutePath);
    const exposesBlock = findModuleFederationExposesBlock(source);
    if (!source.includes("ModuleFederationPlugin") || !exposesBlock) continue;
    configs.push({
      relativePath,
      absolutePath,
      exposes: extractModuleFederationExposes(source),
    });
  }

  return configs;
}

export function findAddPageCalls(source) {
  const calls = [];
  const pattern =
    /(?:window(?:\?\.)?\.?addPage(?:\?\.)?|openNewPage)\s*\(\s*\{([\s\S]*?)\}\s*\)/g;
  let match = pattern.exec(source);

  while (match) {
    const body = match[1];
    const pathMatch = body.match(/path\s*:\s*(['"`])([^'"`]+)\1/);
    const pathExpressionMatch = body.match(/path\s*:\s*([^,\n}]+)/);
    const titleMatch = body.match(/title\s*:\s*(['"`])([^'"`]+)\1/);
    const nameMatch = body.match(/name\s*:\s*(['"`])([^'"`]+)\1/);
    const api = match[0].includes("openNewPage")
      ? "openNewPage"
      : "window.addPage";
    const normalizedRoutePath = normalizeBusinessEntryRoutePath(
      pathMatch?.[2] ?? pathExpressionMatch?.[1] ?? "",
    );
    calls.push({
      api,
      path: pathMatch?.[2] ?? "",
      pathExpression: pathExpressionMatch?.[1]?.trim() ?? "",
      title: titleMatch?.[2] ?? "",
      name: nameMatch?.[2] ?? "",
      normalizedRoutePath,
      routeTokens: tokenizeBusinessEntryText(normalizedRoutePath),
      titleTokens: tokenizeBusinessEntryText(titleMatch?.[2] ?? ""),
      nameTokens: tokenizeBusinessEntryText(nameMatch?.[2] ?? ""),
    });
    match = pattern.exec(source);
  }

  return calls;
}

export function findRouteConstants(source) {
  const constants = [];
  const propertyPattern = /([A-Za-z_$][\w$]*)\s*:\s*['"](@[^'"]+)['"]/g;
  let propertyMatch = propertyPattern.exec(source);

  while (propertyMatch) {
    constants.push({ key: propertyMatch[1], value: propertyMatch[2] });
    propertyMatch = propertyPattern.exec(source);
  }

  const assignmentPattern =
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*['"](@[^'"]+)['"]/g;
  let assignmentMatch = assignmentPattern.exec(source);

  while (assignmentMatch) {
    constants.push({ key: assignmentMatch[1], value: assignmentMatch[2] });
    assignmentMatch = assignmentPattern.exec(source);
  }

  return constants;
}

function normalizeImplicitFeatureEntryPattern(value) {
  const normalized = stripQuotedLiteral(value)
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");
  if (!normalized) return "";
  return normalized;
}

export function findImplicitFeatureRegistryContracts(source) {
  const contracts = [];
  const pattern =
    /import\.meta\.glob\(\s*(['"`])([^'"`]+)\1\s*(?:,\s*\{([\s\S]*?)\})?\s*\)/g;
  let match = pattern.exec(source);

  while (match) {
    const rawPattern = normalizeImplicitFeatureEntryPattern(match[2]);
    const rawOptions = String(match[3] || "");
    const eager = /\beager\s*:\s*true\b/.test(rawOptions);
    const featurePatternMatch = rawPattern.match(
      /^(src\/features)\/\*\/(index\.(?:jsx|tsx|js|ts))$/,
    );

    if (!eager || !featurePatternMatch) {
      match = pattern.exec(source);
      continue;
    }

    const [, featureBaseDir, featureEntryFileName] = featurePatternMatch;
    const featureEntryExtension = path.posix.extname(featureEntryFileName);

    contracts.push({
      featureBaseDir,
      featureEntryPattern: rawPattern,
      featureEntryFileName,
      featureEntryExtension,
      navigationRuntime: "vite-import-meta-glob",
    });
    match = pattern.exec(source);
  }

  return contracts;
}

export async function scanEntryEvidenceFiles(
  targetRoot,
  { roots = ["src"] } = {},
) {
  const files = [];

  for (const root of roots) {
    const absoluteRoot = path.join(targetRoot, root);
    await walkCodeFiles(absoluteRoot, async (absolutePath) => {
      const source = await readTextIfExists(absolutePath);
      const calls = findAddPageCalls(source);
      const routeConstants = findRouteConstants(source);
      const implicitFeatureRegistries =
        findImplicitFeatureRegistryContracts(source);
      if (
        calls.length === 0 &&
        routeConstants.length === 0 &&
        implicitFeatureRegistries.length === 0
      ) {
        return;
      }
      files.push({
        absolutePath,
        relativePath: normalizeRelativePath(
          path.relative(targetRoot, absolutePath),
        ),
        calls,
        routeConstants,
        implicitFeatureRegistries,
      });
    });
  }

  return files;
}

export async function detectBusinessEntryEvidence(
  targetRoot,
  { roots = ["src"], routePath = "", title = "", dest = "" } = {},
) {
  const evidence = [];
  const seen = new Set();
  const pushEvidence = (item) => {
    const key = [
      item.kind,
      item.path || "",
      item.routePath || "",
      item.featureBaseDir || "",
      item.featureEntryPattern || "",
      item.entryPath || "",
      item.sourcePath || "",
      item.publicName || "",
      item.title || "",
      item.name || "",
    ].join("::");
    if (seen.has(key)) return;
    seen.add(key);
    evidence.push(item);
  };

  const mfConfigs = await findModuleFederationConfigs(targetRoot);
  for (const config of mfConfigs) {
    const aggregatedExposeTokens = config.exposes.flatMap((entry) =>
      tokenizeBusinessEntryText(entry.publicName),
    );
    pushEvidence({
      kind: "module-federation-exposes",
      path: config.relativePath,
      routePath: "",
      title: "",
      name: "ModuleFederationExposes",
      titleTokens: [],
      nameTokens: aggregatedExposeTokens,
      exposes: config.exposes.map((entry) => entry.publicName),
    });

    for (const entry of config.exposes) {
      pushEvidence({
        kind: "module-federation-expose",
        path: config.relativePath,
        entryPath: normalizeRelativePath(entry.sourcePath),
        routePath: "",
        title: "",
        name: entry.publicName.replace(/^\.\//, ""),
        publicName: entry.publicName,
        sourcePath: normalizeRelativePath(entry.sourcePath),
        titleTokens: tokenizeBusinessEntryText(entry.publicName),
        nameTokens: [
          ...tokenizeBusinessEntryText(entry.publicName),
          ...buildDirectoryTokens(entry.sourcePath),
        ],
      });
    }
  }

  const entryFiles = await scanEntryEvidenceFiles(targetRoot, { roots });
  for (const file of entryFiles) {
    for (const call of file.calls) {
      pushEvidence({
        kind: call.api,
        path: file.relativePath,
        routePath: call.normalizedRoutePath || call.path,
        pathExpression: call.pathExpression,
        title: call.title,
        name: call.name,
        routeTokens: call.routeTokens,
        titleTokens: call.titleTokens,
        nameTokens: call.nameTokens,
      });
    }

    for (const contract of file.implicitFeatureRegistries || []) {
      pushEvidence({
        kind: "implicit-feature-registry",
        path: file.relativePath,
        routePath: "",
        title: "",
        name: "",
        titleTokens: [],
        nameTokens: [],
        featureBaseDir: contract.featureBaseDir,
        featureEntryPattern: contract.featureEntryPattern,
        featureEntryFileName: contract.featureEntryFileName,
        featureEntryExtension: contract.featureEntryExtension,
        navigationRuntime: contract.navigationRuntime,
      });
    }
  }

  return evidence
    .map((item, index) => ({
      item,
      index,
      score: scoreBusinessEntryEvidence(item, { routePath, title, dest }),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ item }) => item);
}
