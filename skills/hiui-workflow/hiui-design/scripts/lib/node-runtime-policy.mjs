import { spawnSync } from 'node:child_process'
import {
  buildProjectNodeInvocationSpec,
  detectProjectPackageManager,
  isVersionCompatible,
  matchesExplicitNodeVersion,
  normalizeRuntimeVersionSpec,
  resolveProjectNodeRequirement,
} from './project-node-launcher.mjs'

const DEFAULT_RUNTIME_PROBE_TIMEOUT_MS = 8000

function resolveDeclaredNodeRuntime(requirement) {
  if (requirement.explicitVersion) {
    return {
      required: true,
      spec: requirement.explicitVersion,
      source: requirement.explicitSource,
      secondarySpec: requirement.engineRange,
      type: 'explicit-version',
    }
  }

  if (requirement.engineRange) {
    return {
      required: true,
      spec: requirement.engineRange,
      source: requirement.engineSource,
      secondarySpec: '',
      type: 'engine-range',
    }
  }

  return {
    required: false,
    spec: '',
    source: '',
    secondarySpec: '',
    type: 'none',
  }
}

async function resolveProjectNodeRuntime(targetRoot, options = {}) {
  const launcherNode = normalizeRuntimeVersionSpec(
    options.launcherNodeVersion || process.versions?.node || process.version
  )
  const requirement =
    options.requirement || (await resolveProjectNodeRequirement(targetRoot))

  if (!requirement.explicitVersion) {
    return {
      packageManager: await detectProjectPackageManager(targetRoot),
      source: 'launcher-node-no-explicit-project-node',
      nodeVersion: launcherNode,
      reliable: true,
      detail:
        'No explicit project Node version was declared; using the launcher Node runtime directly.',
    }
  }

  const invocationSpec = await buildProjectNodeInvocationSpec({
    targetRoot,
    nodeArgs: ['-v'],
    fallbackNodePath: options.fallbackNodePath || process.execPath,
    preferLoginShell: options.preferLoginShell,
    launcherNodeVersion: launcherNode,
    shellPath: options.shellPath,
  })
  const result = spawnSync(invocationSpec.command, invocationSpec.args, {
    cwd: invocationSpec.cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: options.runtimeProbeTimeoutMs || DEFAULT_RUNTIME_PROBE_TIMEOUT_MS,
  })
  const stdout = String(result.stdout || '').trim()
  const stderr = String(result.stderr || '').trim()
  const resolvedVersion = normalizeRuntimeVersionSpec(stdout)
  const errorMessage = result.error?.message ? `: ${result.error.message}` : stderr ? `: ${stderr}` : ''

  if ((result.status ?? 1) === 0 && resolvedVersion) {
    return {
      packageManager: invocationSpec.packageManager,
      source: invocationSpec.source,
      nodeVersion: resolvedVersion,
      reliable: true,
      detail: `Resolved target runtime via \`${invocationSpec.command} ${invocationSpec.args.join(' ')}\`.`,
    }
  }

  return {
    packageManager: invocationSpec.packageManager,
    source: invocationSpec.source,
    nodeVersion: launcherNode,
    reliable: false,
    detail: result.error?.code === 'ETIMEDOUT'
      ? `Timed out while resolving the target runtime via \`${invocationSpec.command} ${invocationSpec.args.join(' ')}\`${errorMessage}. Falling back to the launcher Node runtime.`
      : `Failed to resolve the target runtime via \`${invocationSpec.command} ${invocationSpec.args.join(' ')}\`${errorMessage}. Falling back to the launcher Node runtime.`,
  }
}

function buildConflictDetail(requirement) {
  if (requirement.hasExplicitConflict) {
    const conflictText = requirement.conflictingSources
      .map((item) => `${item.source}=${item.value}`)
      .join(', ')
    return (
      `Conflicting project Node declarations were found: ` +
      `${requirement.explicitSource}=${requirement.explicitVersion}` +
      `${conflictText ? `; ${conflictText}` : ''}.`
    )
  }

  if (requirement.explicitVersionConflictsWithEngineRange) {
    return (
      `Conflicting project Node policy was found: ` +
      `${requirement.explicitSource}=${requirement.explicitVersion} does not satisfy ` +
      `${requirement.engineSource}=${requirement.engineRange}.`
    )
  }

  return ''
}

export async function inspectNodeRuntimePolicy(targetRoot, options = {}) {
  const requirement = await resolveProjectNodeRequirement(targetRoot)
  const launcherNode = normalizeRuntimeVersionSpec(
    options.launcherNodeVersion || process.versions?.node || process.version
  )
  const expectation = resolveDeclaredNodeRuntime(requirement)
  const conflictDetail = buildConflictDetail(requirement)

  if (conflictDetail) {
    return {
      packageJsonPath: requirement.packageJsonPath,
      pkgPresent: Boolean(requirement.pkg),
      launcherNode,
      expectation,
      resolvedRuntime: {
        packageManager: await detectProjectPackageManager(targetRoot),
        source: 'project-node-policy-conflict',
        nodeVersion: launcherNode,
        reliable: false,
        detail: conflictDetail,
      },
      effectiveNodeVersion: launcherNode,
      compatible: false,
      blocking: true,
      detail: conflictDetail,
    }
  }

  const resolvedNodeRuntime = await resolveProjectNodeRuntime(targetRoot, {
    ...options,
    requirement,
  })
  const effectiveNodeVersion = resolvedNodeRuntime.nodeVersion || launcherNode
  const compatible = !expectation.required
    ? true
    : expectation.type === 'explicit-version'
      ? matchesExplicitNodeVersion(effectiveNodeVersion, expectation.spec)
      : isVersionCompatible(effectiveNodeVersion, expectation.spec)

  return {
    packageJsonPath: requirement.packageJsonPath,
    pkgPresent: Boolean(requirement.pkg),
    launcherNode,
    expectation,
    resolvedRuntime: resolvedNodeRuntime,
    effectiveNodeVersion,
    compatible,
    blocking: Boolean(expectation.required) && !compatible,
    detail: !expectation.required
      ? `No project Node policy was declared. Launcher Node is ${launcherNode}.`
      : compatible
        ? `Resolved target Node ${effectiveNodeVersion} via ${resolvedNodeRuntime.source} satisfies ${expectation.source} ${expectation.spec}${expectation.secondarySpec ? ` (package.json engines.node=${expectation.secondarySpec})` : ''}.${resolvedNodeRuntime.nodeVersion !== launcherNode ? ` Launcher Node is ${launcherNode}.` : ''}`
        : `Resolved target Node ${effectiveNodeVersion} via ${resolvedNodeRuntime.source} does not satisfy ${expectation.source} ${expectation.spec}${expectation.secondarySpec ? ` (package.json engines.node=${expectation.secondarySpec})` : ''}. Fix the local runtime before opening the hiui-design page-task gate. ${resolvedNodeRuntime.detail}`,
  }
}
