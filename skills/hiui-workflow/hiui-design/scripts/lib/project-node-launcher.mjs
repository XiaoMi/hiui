import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

async function isExecutableFile(targetPath) {
  try {
    await fs.access(targetPath, fs.constants.X_OK)
    return true
  } catch {
    return false
  }
}

export async function resolveComparablePath(targetPath) {
  const resolvedPath = path.resolve(targetPath)
  try {
    return await fs.realpath(resolvedPath)
  } catch {
    return resolvedPath
  }
}

async function readPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return {
      packageJsonPath,
      pkg: null,
    }
  }

  return {
    packageJsonPath,
    pkg: JSON.parse(await fs.readFile(packageJsonPath, 'utf8')),
  }
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`
}

export function normalizeRuntimeVersionSpec(spec) {
  return String(spec || '').trim().replace(/^v(?=\d)/, '')
}

function parseNumericVersion(spec) {
  const normalized = normalizeRuntimeVersionSpec(spec)
  const match = normalized.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/)
  if (!match) return null
  const parts = [match[1], match[2], match[3]].filter((part) => part != null)
  return {
    normalized,
    precision: parts.length,
    major: Number(match[1]),
    minor: Number(match[2] ?? 0),
    patch: Number(match[3] ?? 0),
  }
}

function compareNumericVersions(left, right) {
  if (left.major !== right.major) return left.major - right.major
  if (left.minor !== right.minor) return left.minor - right.minor
  return left.patch - right.patch
}

function getExplicitSourcePriority(source) {
  if (source === '.nvmrc') return 0
  if (source === '.node-version') return 1
  if (source === 'package.json volta.node') return 2
  return 99
}

function getExplicitVersionSpecificity(spec) {
  const parsed = parseNumericVersion(spec)
  return parsed ? parsed.precision : 0
}

function areExplicitNodeSpecsCompatible(left, right) {
  const normalizedLeft = normalizeRuntimeVersionSpec(left)
  const normalizedRight = normalizeRuntimeVersionSpec(right)
  if (!normalizedLeft || !normalizedRight) return false
  if (normalizedLeft === normalizedRight) return true

  const leftNumeric = parseNumericVersion(normalizedLeft)
  const rightNumeric = parseNumericVersion(normalizedRight)
  if (!leftNumeric || !rightNumeric) return false

  const sharedPrecision = Math.min(leftNumeric.precision, rightNumeric.precision)
  if (sharedPrecision >= 1 && leftNumeric.major !== rightNumeric.major) return false
  if (sharedPrecision >= 2 && leftNumeric.minor !== rightNumeric.minor) return false
  if (sharedPrecision >= 3 && leftNumeric.patch !== rightNumeric.patch) return false
  return true
}

export function matchesExplicitNodeVersion(actualVersion, explicitVersion) {
  return areExplicitNodeSpecsCompatible(actualVersion, explicitVersion)
}

function nextCaretUpperBound(version) {
  if (version.major > 0) return { major: version.major + 1, minor: 0, patch: 0 }
  if (version.minor > 0) return { major: 0, minor: version.minor + 1, patch: 0 }
  return { major: 0, minor: 0, patch: version.patch + 1 }
}

function nextTildeUpperBound(version) {
  return {
    major: version.major,
    minor: version.minor + 1,
    patch: 0,
  }
}

function parseSimpleRange(spec) {
  const normalized = String(spec || '').trim()
  if (!normalized || normalized.includes('||')) return null

  if (normalized.startsWith('^')) {
    const version = parseNumericVersion(normalized.slice(1))
    if (!version) return null
    return {
      lower: { version, inclusive: true },
      upper: { version: nextCaretUpperBound(version), inclusive: false },
    }
  }

  if (normalized.startsWith('~')) {
    const version = parseNumericVersion(normalized.slice(1))
    if (!version) return null
    return {
      lower: { version, inclusive: true },
      upper: { version: nextTildeUpperBound(version), inclusive: false },
    }
  }

  const exactVersion = parseNumericVersion(normalized)
  if (exactVersion) {
    return {
      lower: { version: exactVersion, inclusive: true },
      upper: { version: exactVersion, inclusive: true },
    }
  }

  const comparators = normalized.split(/\s+/).filter(Boolean)
  if (comparators.length === 0) return null

  const range = { lower: null, upper: null }
  for (const comparator of comparators) {
    const match = comparator.match(/^(>=|>|<=|<)(.+)$/)
    if (!match) return null
    const version = parseNumericVersion(match[2])
    if (!version) return null
    const operator = match[1]

    if (operator === '>=' || operator === '>') {
      const candidate = { version, inclusive: operator === '>=' }
      if (!range.lower) {
        range.lower = candidate
        continue
      }
      const comparison = compareNumericVersions(candidate.version, range.lower.version)
      if (comparison > 0 || (comparison === 0 && !candidate.inclusive && range.lower.inclusive)) {
        range.lower = candidate
      }
      continue
    }

    const candidate = { version, inclusive: operator === '<=' }
    if (!range.upper) {
      range.upper = candidate
      continue
    }
    const comparison = compareNumericVersions(candidate.version, range.upper.version)
    if (comparison < 0 || (comparison === 0 && !candidate.inclusive && range.upper.inclusive)) {
      range.upper = candidate
    }
  }

  return range
}

function parseSimpleRangeSet(spec) {
  const normalized = String(spec || '').trim()
  if (!normalized) return null

  const parts = normalized.split('||').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return null

  const ranges = parts.map((part) => parseSimpleRange(part))
  return ranges.every(Boolean) ? ranges : null
}

function isLowerBoundCompatible(actualLower, expectedLower) {
  if (!expectedLower) return true
  if (!actualLower) return false
  const comparison = compareNumericVersions(actualLower.version, expectedLower.version)
  if (comparison > 0) return true
  if (comparison < 0) return false
  return !actualLower.inclusive || expectedLower.inclusive
}

function isUpperBoundCompatible(actualUpper, expectedUpper) {
  if (!expectedUpper) return true
  if (!actualUpper) return false
  const comparison = compareNumericVersions(actualUpper.version, expectedUpper.version)
  if (comparison < 0) return true
  if (comparison > 0) return false
  return !actualUpper.inclusive || expectedUpper.inclusive
}

export function isVersionCompatible(actual, expected) {
  if (!expected) return true
  const normalizedActual = String(actual || '').trim()
  const normalizedExpected = String(expected || '').trim()
  if (!normalizedActual) return false
  if (normalizedActual === normalizedExpected) return true

  const actualRanges = parseSimpleRangeSet(normalizedActual)
  const expectedRanges = parseSimpleRangeSet(normalizedExpected)
  if (actualRanges && expectedRanges) {
    return actualRanges.every((actualRange) =>
      expectedRanges.some(
        (expectedRange) =>
          isLowerBoundCompatible(actualRange.lower, expectedRange.lower) &&
          isUpperBoundCompatible(actualRange.upper, expectedRange.upper)
      )
    )
  }

  if (normalizedExpected.startsWith('^')) {
    return normalizedActual === normalizedExpected || normalizedActual === normalizedExpected.slice(1)
  }
  if (normalizedExpected.startsWith('~')) {
    return normalizedActual === normalizedExpected || normalizedActual === normalizedExpected.slice(1)
  }
  return normalizedActual === normalizedExpected
}

function readNodeVersionFileValue(content) {
  const lines = String(content || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  return lines[0] ? normalizeRuntimeVersionSpec(lines[0]) : ''
}

async function resolveDirectExplicitNodeBinaryPath(explicitVersion) {
  const normalizedVersion = normalizeRuntimeVersionSpec(explicitVersion)
  if (!normalizedVersion) return ''

  const homeDir = process.env.HOME || ''
  const nvmDir = process.env.NVM_DIR || (homeDir ? path.join(homeDir, '.nvm') : '')
  const candidatePaths = []

  if (nvmDir) {
    candidatePaths.push(
      path.join(nvmDir, 'versions', 'node', `v${normalizedVersion}`, 'bin', 'node')
    )
  }

  const fnmDir = process.env.FNM_DIR || (homeDir ? path.join(homeDir, '.fnm') : '')
  if (fnmDir) {
    candidatePaths.push(
      path.join(fnmDir, 'node-versions', normalizedVersion, 'installation', 'bin', 'node')
    )
  }

  for (const candidatePath of candidatePaths) {
    if (await isExecutableFile(candidatePath)) return candidatePath
  }

  return ''
}

function buildNodeManagerShellSpec({
  shellPath,
  targetRoot,
  nodeArgs,
  explicitVersion,
  explicitSource,
  packageManager,
}) {
  const quotedNodeCommand = ['node', ...nodeArgs].map(shellQuote).join(' ')
  const missingManagerMessage = `Unable to activate project Node ${explicitVersion} declared by ${explicitSource} for ${targetRoot}. Install and initialize a supported Node manager (volta, fnm, or nvm), or rerun this command from the correct Node version.`
  const commandString = [
    'set -e',
    `TARGET_NODE_VERSION=${shellQuote(explicitVersion)}`,
    'VOLTA_HOME="${VOLTA_HOME:-$HOME/.volta}"',
    '[ -d "$VOLTA_HOME/bin" ] && PATH="$VOLTA_HOME/bin:$PATH"',
    'FNM_DIR="${FNM_DIR:-$HOME/.fnm}"',
    '[ -d "$FNM_DIR" ] && PATH="$FNM_DIR:$PATH"',
    'if command -v volta >/dev/null 2>&1; then',
    `  exec volta run --node "$TARGET_NODE_VERSION" ${quotedNodeCommand}`,
    'fi',
    'if command -v fnm >/dev/null 2>&1; then',
    `  exec fnm exec --using "$TARGET_NODE_VERSION" -- ${quotedNodeCommand}`,
    'fi',
    'NVM_DIR="${NVM_DIR:-$HOME/.nvm}"',
    'if [ -s "$NVM_DIR/nvm.sh" ]; then',
    '  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1',
    '  nvm use "$TARGET_NODE_VERSION" >/dev/null',
    `  exec ${quotedNodeCommand}`,
    'fi',
    `echo ${shellQuote(missingManagerMessage)} >&2`,
    'exit 1',
  ].join('\n')

  return {
    command: shellPath,
    args: ['-lc', commandString],
    cwd: targetRoot,
    source: 'project-node-explicit-version-via-shell',
    packageManager,
    targetNodeVersion: explicitVersion,
    targetNodeSource: explicitSource,
    requiresNodeManager: true,
  }
}

function sortExplicitSources(explicitSources) {
  return [...explicitSources].sort((left, right) => {
    const specificityDelta =
      getExplicitVersionSpecificity(right.value) - getExplicitVersionSpecificity(left.value)
    if (specificityDelta !== 0) return specificityDelta
    return getExplicitSourcePriority(left.source) - getExplicitSourcePriority(right.source)
  })
}

export async function resolveProjectNodeRequirement(targetRoot) {
  const normalizedTargetRoot = path.resolve(targetRoot)
  const { packageJsonPath, pkg } = await readPackageJson(normalizedTargetRoot)
  const nvmrcPath = path.join(normalizedTargetRoot, '.nvmrc')
  const nodeVersionPath = path.join(normalizedTargetRoot, '.node-version')

  const nvmrcValue = readNodeVersionFileValue(await readTextIfExists(nvmrcPath))
  const nodeVersionValue = readNodeVersionFileValue(await readTextIfExists(nodeVersionPath))
  const voltaNode = normalizeRuntimeVersionSpec(pkg?.volta?.node)
  const enginesNode = normalizeRuntimeVersionSpec(pkg?.engines?.node)

  const explicitSources = []
  if (nvmrcValue) {
    explicitSources.push({
      source: '.nvmrc',
      path: nvmrcPath,
      value: nvmrcValue,
    })
  }
  if (nodeVersionValue) {
    explicitSources.push({
      source: '.node-version',
      path: nodeVersionPath,
      value: nodeVersionValue,
    })
  }
  if (voltaNode) {
    explicitSources.push({
      source: 'package.json volta.node',
      path: packageJsonPath,
      value: voltaNode,
    })
  }

  const sortedExplicitSources = sortExplicitSources(explicitSources)
  const selectedExplicitSource = sortedExplicitSources[0] || null
  const conflictingSources = selectedExplicitSource
    ? explicitSources.filter(
        (item) => item !== selectedExplicitSource && !areExplicitNodeSpecsCompatible(item.value, selectedExplicitSource.value)
      )
    : []
  const explicitVersionConflictsWithEngineRange = Boolean(
    selectedExplicitSource?.value &&
    enginesNode &&
    !isVersionCompatible(selectedExplicitSource.value, enginesNode)
  )

  return {
    targetRoot: normalizedTargetRoot,
    packageJsonPath,
    pkg,
    explicitSources,
    explicitVersion: selectedExplicitSource?.value || '',
    explicitSource: selectedExplicitSource?.source || '',
    explicitPath: selectedExplicitSource?.path || '',
    conflictingSources,
    hasExplicitConflict: conflictingSources.length > 0,
    engineRange: enginesNode,
    engineSource: enginesNode ? 'package.json engines.node' : '',
    explicitVersionConflictsWithEngineRange,
  }
}

export async function detectProjectPackageManager(targetRoot) {
  const { pkg } = await readPackageJson(targetRoot)
  const packageManager = typeof pkg?.packageManager === 'string' ? pkg.packageManager.trim() : ''

  if (packageManager.startsWith('pnpm@')) return 'pnpm'
  if (packageManager.startsWith('yarn@')) return 'yarn'
  if (packageManager.startsWith('npm@')) return 'npm'
  if (packageManager.startsWith('bun@')) return 'bun'

  const lockfileManagers = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['package-lock.json', 'npm'],
    ['bun.lockb', 'bun'],
    ['bun.lock', 'bun'],
  ]

  for (const [filename, manager] of lockfileManagers) {
    if (await pathExists(path.join(targetRoot, filename))) {
      return manager
    }
  }

  return 'npm'
}

export async function buildProjectNodeInvocationSpec({
  targetRoot,
  nodeArgs = [],
  fallbackNodePath = process.execPath,
  preferLoginShell,
  launcherNodeVersion = process.versions?.node || process.version,
  shellPath = process.env.SHELL || '/bin/sh',
}) {
  const normalizedTargetRoot = path.resolve(targetRoot)
  const projectComparablePath = await resolveComparablePath(normalizedTargetRoot)
  const cwdComparablePath = await resolveComparablePath(process.cwd())
  const shouldPreferLoginShell =
    preferLoginShell == null ? projectComparablePath !== cwdComparablePath : preferLoginShell
  const packageManager = await detectProjectPackageManager(normalizedTargetRoot)
  const requirement = await resolveProjectNodeRequirement(normalizedTargetRoot)
  const normalizedLauncherNode = normalizeRuntimeVersionSpec(launcherNodeVersion)

  if (requirement.hasExplicitConflict) {
    const conflictingSources = requirement.conflictingSources
      .map((item) => `${item.source}=${item.value}`)
      .join(', ')
    throw new Error(
      `Conflicting project Node declarations were found for ${normalizedTargetRoot}: ` +
      `${requirement.explicitSource}=${requirement.explicitVersion}${conflictingSources ? `; ${conflictingSources}` : ''}.`
    )
  }

  if (requirement.explicitVersionConflictsWithEngineRange) {
    throw new Error(
      `Conflicting project Node policy was found for ${normalizedTargetRoot}: ` +
      `${requirement.explicitSource}=${requirement.explicitVersion} does not satisfy ` +
      `${requirement.engineSource}=${requirement.engineRange}.`
    )
  }

  if (requirement.explicitVersion) {
    if (matchesExplicitNodeVersion(normalizedLauncherNode, requirement.explicitVersion)) {
      return {
        command: fallbackNodePath,
        args: [...nodeArgs],
        cwd: normalizedTargetRoot,
        source: 'launcher-node-explicit-match',
        packageManager,
        targetNodeVersion: requirement.explicitVersion,
        targetNodeSource: requirement.explicitSource,
        requiresNodeManager: false,
      }
    }

    const directNodeBinaryPath = await resolveDirectExplicitNodeBinaryPath(
      requirement.explicitVersion
    )
    if (directNodeBinaryPath) {
      return {
        command: directNodeBinaryPath,
        args: [...nodeArgs],
        cwd: normalizedTargetRoot,
        source: 'project-node-explicit-version-via-node-binary',
        packageManager,
        targetNodeVersion: requirement.explicitVersion,
        targetNodeSource: requirement.explicitSource,
        requiresNodeManager: false,
      }
    }

    return buildNodeManagerShellSpec({
      shellPath,
      targetRoot: normalizedTargetRoot,
      nodeArgs,
      explicitVersion: requirement.explicitVersion,
      explicitSource: requirement.explicitSource,
      packageManager,
    })
  }

  const commandMatrix = {
    pnpm: ['pnpm', ['exec', 'node']],
    yarn: ['yarn', ['node']],
    bun: ['bun', ['run', 'node']],
    npm: ['npm', ['exec', '--', 'node']],
  }
  const selected = commandMatrix[packageManager]

  if (!selected) {
    return {
      command: fallbackNodePath,
      args: [...nodeArgs],
      cwd: normalizedTargetRoot,
      source: 'launcher-node',
      packageManager,
      targetNodeVersion: '',
      targetNodeSource: '',
      requiresNodeManager: false,
    }
  }

  const [command, launcherArgs] = selected
  if (shouldPreferLoginShell) {
    const commandString = [command, ...launcherArgs, ...nodeArgs].map(shellQuote).join(' ')

    return {
      command: shellPath,
      args: ['-lc', commandString],
      cwd: normalizedTargetRoot,
      source: `${packageManager}-runtime-via-shell`,
      packageManager,
      targetNodeVersion: '',
      targetNodeSource: '',
      requiresNodeManager: false,
    }
  }

  return {
    command,
    args: [...launcherArgs, ...nodeArgs],
    cwd: normalizedTargetRoot,
    source: `${packageManager}-runtime`,
    packageManager,
    targetNodeVersion: '',
    targetNodeSource: '',
    requiresNodeManager: false,
  }
}

export async function buildProjectNodeLaunchSpec({
  targetRoot,
  scriptPath,
  scriptArgs = [],
  fallbackNodePath = process.execPath,
  preferLoginShell,
  launcherNodeVersion,
  shellPath,
}) {
  return buildProjectNodeInvocationSpec({
    targetRoot,
    nodeArgs: [scriptPath, ...scriptArgs],
    fallbackNodePath,
    preferLoginShell,
    launcherNodeVersion,
    shellPath,
  })
}

export async function buildProjectNodeScriptExecutionSpec({
  targetRoot,
  scriptPath,
  scriptArgs = [],
  cwd = targetRoot,
  fallbackNodePath = process.execPath,
  launcherNodeVersion = process.versions?.node || process.version,
  preferLoginShell,
  shellPath,
}) {
  const requirement = await resolveProjectNodeRequirement(targetRoot)

  if (!requirement.explicitVersion) {
    return {
      command: fallbackNodePath,
      args: [scriptPath, ...scriptArgs],
      cwd,
      source: 'launcher-node-no-explicit-project-node',
      packageManager: await detectProjectPackageManager(targetRoot),
      targetNodeVersion: '',
      targetNodeSource: '',
      requiresNodeManager: false,
    }
  }

  return buildProjectNodeLaunchSpec({
    targetRoot,
    scriptPath,
    scriptArgs,
    fallbackNodePath,
    launcherNodeVersion,
    preferLoginShell,
    shellPath,
  })
}

export async function runProjectNodeScriptSync({
  targetRoot,
  scriptPath,
  scriptArgs = [],
  cwd = targetRoot,
  fallbackNodePath = process.execPath,
  launcherNodeVersion = process.versions?.node || process.version,
  preferLoginShell,
  shellPath,
  capture = false,
  env = process.env,
  maxBuffer,
}) {
  const launchSpec = await buildProjectNodeScriptExecutionSpec({
    targetRoot,
    scriptPath,
    scriptArgs,
    cwd,
    fallbackNodePath,
    launcherNodeVersion,
    preferLoginShell,
    shellPath,
  })

  return {
    launchSpec,
    result: spawnSync(launchSpec.command, launchSpec.args, {
      cwd: launchSpec.cwd,
      env,
      encoding: 'utf8',
      stdio: capture ? 'pipe' : 'inherit',
      ...(maxBuffer ? { maxBuffer } : {}),
    }),
  }
}

export async function ensureProjectNodeRuntime({
  targetRoot,
  scriptPath,
  scriptArgs = [],
  fallbackNodePath = process.execPath,
  launcherNodeVersion = process.versions?.node || process.version,
  preferLoginShell,
  shellPath,
}) {
  const requirement = await resolveProjectNodeRequirement(targetRoot)

  if (!requirement.explicitVersion) {
    return {
      reexecuted: false,
      reason: 'no-explicit-project-node',
      requirement,
      launchSpec: null,
    }
  }

  const launchSpec = await buildProjectNodeLaunchSpec({
    targetRoot,
    scriptPath,
    scriptArgs,
    fallbackNodePath,
    launcherNodeVersion,
    preferLoginShell,
    shellPath,
  })

  if (launchSpec.source === 'launcher-node-explicit-match') {
    return {
      reexecuted: false,
      reason: 'launcher-already-matches-explicit-project-node',
      requirement,
      launchSpec,
    }
  }

  const result = spawnSync(launchSpec.command, launchSpec.args, {
    cwd: launchSpec.cwd,
    stdio: 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  return {
    reexecuted: true,
    exitCode: result.status ?? 0,
    requirement,
    launchSpec,
  }
}
