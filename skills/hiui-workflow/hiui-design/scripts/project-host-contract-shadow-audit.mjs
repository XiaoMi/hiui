#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { inspectIntegrationReadiness } from './lib/integration-readiness.mjs'
import { formatInstallModeUsage } from './lib/mode-contract.mjs'
import {
  buildEnsureCommand,
  buildPreflightCommand,
  detectProjectPackageManager,
} from './lib/page-task-gate.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import {
  buildProjectHostContract,
  readProjectHostContract,
} from './lib/project-host-contract.mjs'
import { evaluateProjectGenerationReadiness } from './lib/generation-readiness.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, '/').replace(/^\.\//, '')
}

function normalizeStringArray(values) {
  return [...new Set((Array.isArray(values) ? values : []).map((item) => normalizeString(item)).filter(Boolean))].sort()
}

function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function normalizeForStableCompare(value) {
  if (Array.isArray(value)) {
    const normalizedItems = value.map((item) => normalizeForStableCompare(item))
    const allPrimitive = normalizedItems.every(
      (item) => item == null || ['string', 'number', 'boolean'].includes(typeof item)
    )
    return allPrimitive ? [...normalizedItems].sort() : normalizedItems
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, nested]) => nested !== undefined)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, nested]) => [key, normalizeForStableCompare(nested)])
    )
  }
  return value
}

function buildComparableFormalNavigation(formalNavigation = {}) {
  return normalizeForStableCompare({
    formalBusinessShellPath: normalizeRelativePath(formalNavigation?.formalBusinessShellPath),
    formalNavigationRegistryPath: normalizeRelativePath(
      formalNavigation?.formalNavigationRegistryPath
    ),
    formalNavigationRegistryKind: normalizeString(formalNavigation?.formalNavigationRegistryKind),
    formalNavigationRegistryAutoMountSupported:
      formalNavigation?.formalNavigationRegistryAutoMountSupported === true,
    formalNavigationRegistrySupportReason: normalizeString(
      formalNavigation?.formalNavigationRegistrySupportReason
    ),
    selectedBusinessEntryPath: normalizeRelativePath(formalNavigation?.selectedBusinessEntryPath),
    selectedBusinessEntryKind: normalizeString(formalNavigation?.selectedBusinessEntryKind),
    selectedLegacyMountEntryPath: normalizeRelativePath(
      formalNavigation?.selectedLegacyMountEntryPath
    ),
    selectedPublishEntryPath: normalizeRelativePath(formalNavigation?.selectedPublishEntryPath),
    selectedPublishEntryKind: normalizeString(formalNavigation?.selectedPublishEntryKind),
    selectedLegacyBackRoutePath: normalizeString(formalNavigation?.selectedLegacyBackRoutePath),
    selectedLegacyBackTitle: normalizeString(formalNavigation?.selectedLegacyBackTitle),
    selectedLegacyBackName: normalizeString(formalNavigation?.selectedLegacyBackName),
    businessEntrySelectionBlocked: formalNavigation?.businessEntrySelectionBlocked === true,
    businessEntrySelectionBlockReason: normalizeString(
      formalNavigation?.businessEntrySelectionBlockReason
    ),
    implicitFeatureBaseDir: normalizeRelativePath(formalNavigation?.implicitFeatureBaseDir),
    implicitFeatureRegistryPath: normalizeRelativePath(
      formalNavigation?.implicitFeatureRegistryPath
    ),
    implicitFeatureEntryPattern: normalizeString(formalNavigation?.implicitFeatureEntryPattern),
    implicitFeatureEntryFileName: normalizeString(formalNavigation?.implicitFeatureEntryFileName),
    implicitFeatureEntryExtension: normalizeString(
      formalNavigation?.implicitFeatureEntryExtension
    ),
    businessEntryEvidenceKinds: normalizeStringArray(formalNavigation?.businessEntryEvidenceKinds),
    businessEntryEvidencePaths: normalizeStringArray(formalNavigation?.businessEntryEvidencePaths),
    navigationEvidencePaths: normalizeStringArray(formalNavigation?.navigationEvidencePaths),
    ambiguousFormalNavigationEvidencePaths: normalizeStringArray(
      formalNavigation?.ambiguousFormalNavigationEvidencePaths
    ),
  })
}

function buildComparableProjectHostContract(contract = {}) {
  return normalizeForStableCompare({
    schema: normalizeString(contract?.schema),
    status: normalizeString(contract?.status),
    mode: normalizeString(contract?.mode),
    hostFamily: normalizeString(contract?.hostFamily),
    publishMechanism: normalizeString(contract?.publishMechanism),
    defaultBusinessPageDir: normalizeRelativePath(contract?.defaultBusinessPageDir),
    evidenceFiles: normalizeStringArray(contract?.evidenceFiles),
    fingerprint: {
      source: normalizeString(contract?.fingerprint?.source),
      value: normalizeString(contract?.fingerprint?.value),
    },
    projectEntryMountCapability: cloneJson(contract?.projectEntryMountCapability || {}),
    hostProfile: cloneJson(contract?.hostProfile || {}),
    formalNavigation: buildComparableFormalNavigation(contract?.formalNavigation || {}),
    executionContract: cloneJson(contract?.executionContract || {}),
    hostExecutionAdapter: cloneJson(contract?.hostExecutionAdapter || {}),
  })
}

function collectDiffs(savedValue, shadowValue, fieldPath = 'contract', diffs = []) {
  if (savedValue === shadowValue) return diffs

  const savedIsArray = Array.isArray(savedValue)
  const shadowIsArray = Array.isArray(shadowValue)
  if (savedIsArray || shadowIsArray) {
    const savedArray = savedIsArray ? savedValue : []
    const shadowArray = shadowIsArray ? shadowValue : []
    if (JSON.stringify(savedArray) !== JSON.stringify(shadowArray)) {
      diffs.push({
        path: fieldPath,
        saved: savedArray,
        shadow: shadowArray,
      })
    }
    return diffs
  }

  const savedIsObject = savedValue && typeof savedValue === 'object'
  const shadowIsObject = shadowValue && typeof shadowValue === 'object'
  if (savedIsObject || shadowIsObject) {
    const savedObject = savedIsObject ? savedValue : {}
    const shadowObject = shadowIsObject ? shadowValue : {}
    const keys = [...new Set([...Object.keys(savedObject), ...Object.keys(shadowObject)])].sort()
    for (const key of keys) {
      collectDiffs(savedObject[key], shadowObject[key], `${fieldPath}.${key}`, diffs)
    }
    return diffs
  }

  diffs.push({
    path: fieldPath,
    saved: savedValue,
    shadow: shadowValue,
  })
  return diffs
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    mode: 'auto',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') continue

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }

    if (arg === '--mode') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --mode')
      options.mode = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node ${getContextScriptPath('project-host-contract-shadow-audit.mjs')} [--target <project-root>] [--mode <${formatInstallModeUsage()}>] [--json]`
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const rawArgs = process.argv.slice(2)
  const options = parseArgs(rawArgs)
  const targetRoot = path.resolve(options.target)
  const scriptPath = fileURLToPath(import.meta.url)
  const runtimeReset = await ensureProjectNodeRuntime({
    targetRoot,
    scriptPath,
    scriptArgs: rawArgs,
    preferLoginShell: true,
  })
  if (runtimeReset.reexecuted) {
    process.exit(runtimeReset.exitCode ?? 0)
  }

  const scriptDir = path.dirname(scriptPath)
  const skillRoot = path.resolve(scriptDir, '..')
  const integrationReadiness = await inspectIntegrationReadiness(targetRoot)

  if (!integrationReadiness.ready) {
    const payload = {
      schema: 'hiui-design-project-host-shadow-audit.v1',
      status: 'blocked',
      targetRoot,
      reason: integrationReadiness.reason,
      integrationReadiness,
      nextCommand: await buildEnsureCommand({
        targetRoot,
        skillRoot,
        integrationReadiness,
      }),
      mismatchCount: 0,
      mismatches: [],
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
    } else {
      console.log(`project-host shadow audit blocked: ${payload.reason}`)
      console.log(`nextCommand: ${payload.nextCommand}`)
    }
    return
  }

  const savedContract = await readProjectHostContract(targetRoot)
  if (!savedContract) {
    const packageManager = await detectProjectPackageManager(targetRoot)
    const payload = {
      schema: 'hiui-design-project-host-shadow-audit.v1',
      status: 'blocked',
      targetRoot,
      reason:
        'PROJECT_HOST_CONTRACT.json is missing. Run typical-page:preflight before comparing the frozen project-scoped host contract with a fresh scan.',
      integrationReadiness,
      nextCommand: buildPreflightCommand({
        packageManager,
        mode: options.mode || integrationReadiness.appliedMode,
      }),
      mismatchCount: 0,
      mismatches: [],
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
    } else {
      console.log(`project-host shadow audit blocked: ${payload.reason}`)
      console.log(`nextCommand: ${payload.nextCommand}`)
    }
    return
  }

  const generationReadiness = await evaluateProjectGenerationReadiness({
    targetRoot,
    mode: normalizeString(options.mode || integrationReadiness.appliedMode),
    integrationReadiness,
    hostProfile: integrationReadiness?.hostCompatibility?.hostProfile || null,
  })
  const shadowContract = await buildProjectHostContract({
    targetRoot,
    generationReadiness,
  })
  const comparableSavedContract = buildComparableProjectHostContract(savedContract)
  const comparableShadowContract = buildComparableProjectHostContract(shadowContract)
  const mismatches = collectDiffs(comparableSavedContract, comparableShadowContract)
  const packageManager = await detectProjectPackageManager(targetRoot)
  const payload = {
    schema: 'hiui-design-project-host-shadow-audit.v1',
    status: mismatches.length === 0 ? 'pass' : 'mismatch',
    targetRoot,
    integrationReadiness,
    generationReadinessStatus: normalizeString(generationReadiness?.status) || 'unknown',
    reason:
      mismatches.length === 0
        ? 'Saved PROJECT_HOST_CONTRACT.json matches a fresh read-only project scan.'
        : 'Saved PROJECT_HOST_CONTRACT.json drifted from the fresh read-only project scan. Refresh the project-scoped contract with typical-page:preflight before downstream planning.',
    nextCommand:
      mismatches.length === 0
        ? ''
        : buildPreflightCommand({
            packageManager,
            mode: options.mode || integrationReadiness.appliedMode,
          }),
    comparableSavedContract,
    comparableShadowContract,
    mismatchCount: mismatches.length,
    mismatches,
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2))
  } else if (payload.status === 'pass') {
    console.log('pass: saved PROJECT_HOST_CONTRACT.json matches the fresh read-only scan')
  } else {
    console.log(`mismatch: ${payload.mismatchCount} contract facts drifted from the fresh scan`)
    for (const mismatch of payload.mismatches.slice(0, 10)) {
      console.log(`- ${mismatch.path}`)
    }
    console.log(`nextCommand: ${payload.nextCommand}`)
  }
}

try {
  await main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
