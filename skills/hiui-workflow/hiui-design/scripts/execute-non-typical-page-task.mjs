#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { ensureProjectNodeRuntime } from './lib/project-node-launcher.mjs'
import { runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'

function readRequiredArg(argv, index, flag) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`)
  }
  return value
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageFamily: 'non-typical-page',
    mode: 'auto',
    inputMode: '',
    dest: '',
    title: '',
    routePath: '',
    exposeName: '',
    entryFile: '',
    remoteEntryUrl: '',
    confirmedGenerationInputJson: '',
    confirmedDesignRestoreInputJson: '',
    nonTypicalConversationOutputJson: '',
    navigationMountContract: '',
    telemetryPrompt: '',
    telemetryPromptFile: '',
    force: false,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--target') {
      options.target = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page-family') {
      options.pageFamily = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--mode') {
      options.mode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--input-mode') {
      options.inputMode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--dest') {
      options.dest = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--title') {
      options.title = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--route-path') {
      options.routePath = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--expose-name') {
      options.exposeName = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--entry-file') {
      options.entryFile = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--remote-entry-url') {
      options.remoteEntryUrl = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--confirmed-generation-input-json') {
      options.confirmedGenerationInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--confirmed-design-restore-input-json') {
      options.confirmedDesignRestoreInputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--non-typical-conversation-output-json') {
      options.nonTypicalConversationOutputJson = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--navigation-mount-contract') {
      options.navigationMountContract = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--telemetry-prompt') {
      options.telemetryPrompt = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--telemetry-prompt-file') {
      options.telemetryPromptFile = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node .local-context/hiui-design/scripts/execute-non-typical-page-task.mjs --dest <dir> --title <title> --non-typical-conversation-output-json <json> [--target <root>] [--page-family non-typical-page] [--mode auto|rules-only|host-integration] [--input-mode page-prompt|prototype-screenshot|figma-design-restore] [--route-path <path>] [--expose-name <Name>] [--entry-file <relative-file>] [--remote-entry-url <url>] [--confirmed-generation-input-json <json>] [--confirmed-design-restore-input-json <json>] [--navigation-mount-contract <json-or-path>] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--force] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (options.pageFamily !== 'non-typical-page') {
    throw new Error(
      `execute-non-typical-page-task only supports --page-family non-typical-page, received "${options.pageFamily}"`
    )
  }

  if (!options.dest) {
    throw new Error('Missing required --dest')
  }

  if (!options.title) {
    throw new Error('Missing required --title')
  }

  if (!options.nonTypicalConversationOutputJson && !options.confirmedGenerationInputJson) {
    throw new Error(
      'Pass --non-typical-conversation-output-json or --confirmed-generation-input-json'
    )
  }

  return options
}

function buildBaseArgs(options) {
  const args = [
    '--target',
    options.target,
    '--page-family',
    options.pageFamily,
    '--mode',
    options.mode,
    '--dest',
    options.dest,
    '--title',
    options.title,
  ]

  if (options.inputMode) {
    args.push('--input-mode', options.inputMode)
  }
  if (options.routePath) {
    args.push('--route-path', options.routePath)
  }
  if (options.confirmedGenerationInputJson) {
    args.push(
      '--confirmed-generation-input-json',
      options.confirmedGenerationInputJson
    )
  }
  if (options.confirmedDesignRestoreInputJson) {
    args.push(
      '--confirmed-design-restore-input-json',
      options.confirmedDesignRestoreInputJson
    )
  }
  if (options.nonTypicalConversationOutputJson) {
    args.push(
      '--non-typical-conversation-output-json',
      options.nonTypicalConversationOutputJson
    )
  }
  if (options.navigationMountContract) {
    args.push('--navigation-mount-contract', options.navigationMountContract)
  }
  if (options.telemetryPrompt) {
    args.push('--telemetry-prompt', options.telemetryPrompt)
  }
  if (options.telemetryPromptFile) {
    args.push('--telemetry-prompt-file', options.telemetryPromptFile)
  }

  return args
}

function buildAcceptanceArgs(options, generation) {
  const args = [
    '--target',
    options.target,
    '--page-family',
    options.pageFamily,
    '--mode',
    options.mode,
    '--dest',
    options.dest,
    '--title',
    options.title,
  ]

  if (options.inputMode) {
    args.push('--input-mode', options.inputMode)
  }
  if (options.routePath) {
    args.push('--route-path', options.routePath)
  }
  if (options.exposeName) {
    args.push('--expose-name', options.exposeName)
  }
  if (generation?.mfPublishEntryManaged === true && generation?.mfPublishEntryPath) {
    args.push('--expected-expose-target', generation.mfPublishEntryPath)
  }
  if (options.entryFile) {
    args.push('--entry-file', options.entryFile)
  }
  if (options.confirmedGenerationInputJson) {
    args.push(
      '--confirmed-generation-input-json',
      options.confirmedGenerationInputJson
    )
  }
  if (options.confirmedDesignRestoreInputJson) {
    args.push(
      '--confirmed-design-restore-input-json',
      options.confirmedDesignRestoreInputJson
    )
  }
  if (options.nonTypicalConversationOutputJson) {
    args.push(
      '--non-typical-conversation-output-json',
      options.nonTypicalConversationOutputJson
    )
  }

  return args
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeArray(value) {
  return Array.isArray(value) ? value.map((item) => normalizeString(item)).filter(Boolean) : []
}

function deriveExposeName(options) {
  const explicitExposeName = normalizeString(options.exposeName)
  if (explicitExposeName) return explicitExposeName.replace(/^\.\//, '')

  const routePath = normalizeString(options.routePath)
  const match = routePath.match(/^@common\/([^?&#/]+)$/)
  return match?.[1] || ''
}

function isLegacyModuleFederationHost(hostProfile = {}) {
  const framework = normalizeString(hostProfile.framework)
  const riskTags = normalizeArray(hostProfile.riskTags)

  return (
    hostProfile.legacyReactRuntime === true &&
    (
      [
        'rspack-module-federation',
        'webpack-module-federation',
        'micro-frontend',
      ].includes(framework) ||
      riskTags.includes('module-federation')
    )
  )
}

function requiresLegacyMfFormalAcceptance({ hostProfile, generation } = {}) {
  if (!isLegacyModuleFederationHost(hostProfile)) {
    return false
  }

  return (
    generation?.mfPublishEntryManaged === true ||
    generation?.navigationMountAction?.action === 'materialize-mf-publish-entry'
  )
}

function buildAcceptanceRequiredCommandIds({ requiredCommandIds, hostProfile, generation }) {
  const nextRequiredCommandIds = [...requiredCommandIds]
  if (!requiresLegacyMfFormalAcceptance({ hostProfile, generation })) {
    return nextRequiredCommandIds
  }

  if (!nextRequiredCommandIds.includes('integration-preflight')) {
    nextRequiredCommandIds.push('integration-preflight')
  }

  if (hostProfile?.remoteDebugContract?.enabled === true &&
    !nextRequiredCommandIds.includes('verify-remote-runtime-source')) {
    nextRequiredCommandIds.push('verify-remote-runtime-source')
  }

  return nextRequiredCommandIds
}

async function runJsonScript(targetRoot, scriptPath, args, { cwd }) {
  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath,
    scriptArgs: args,
    cwd,
    capture: true,
    maxBuffer: 16 * 1024 * 1024,
  })

  if (result.error) {
    throw result.error
  }

  const rawOutput = (result.stdout || result.stderr || '').trim()
  let payload = null
  if (result.stdout && result.stdout.trim().startsWith('{')) {
    payload = JSON.parse(result.stdout)
  }

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    rawOutput,
    payload,
  }
}

function buildPlanBlockedPayload({ options, plan, blockedBy }) {
  return {
    schemaVersion: 1,
    schema: 'hiui-design-execute-non-typical-page-task.v1',
    status: 'blocked-before-generate',
    executionStage: 'plan',
    blockedBy,
    reason:
      plan.readinessGate?.reason ||
      plan.blockingReasons?.[0] ||
      'Non-typical execution plan is not ready to generate.',
    targetRoot: plan.targetRoot || options.target,
    pageSelector: plan.pageSelector || {
      kind: 'page-family',
      id: options.pageFamily,
    },
    readinessGate: plan.readinessGate || null,
    nextStepCommand: plan.nextStepCommand || null,
    requiredCommandIds: Array.isArray(plan.requiredCommands)
      ? plan.requiredCommands.map((command) => command.id)
      : [],
    planSnapshot: {
      pageFamily: plan.pageFamily || options.pageFamily,
      startFrom: plan.startFrom || null,
      allowedActions: plan.allowedActions || [],
      forbiddenActions: plan.forbiddenActions || [],
      blockingReasons: plan.blockingReasons || [],
    },
  }
}

function buildContractDriftPayload({ options, plan, reason }) {
  return {
    schemaVersion: 1,
    schema: 'hiui-design-execute-non-typical-page-task.v1',
    status: 'blocked-before-generate',
    executionStage: 'plan',
    blockedBy: 'workflow-contract-drift',
    reason,
    targetRoot: plan.targetRoot || options.target,
    pageSelector: plan.pageSelector || {
      kind: 'page-family',
      id: options.pageFamily,
    },
    readinessGate: plan.readinessGate || null,
    nextStepCommand: plan.nextStepCommand || null,
    requiredCommandIds: Array.isArray(plan.requiredCommands)
      ? plan.requiredCommands.map((command) => command.id)
      : [],
  }
}

function resolvePlanBlockedBy(plan) {
  if (plan.nextStepCommand?.id === 'typical-page-ensure') {
    return 'typical-page-ensure-required'
  }

  if (plan.nextStepCommand?.id === 'typical-page-preflight') {
    return 'typical-page-preflight-required'
  }

  if (plan.nextStepCommand?.id === 'switch-node-runtime') {
    return 'node-runtime-mismatch'
  }

  if (plan.readinessGate?.status === 'blocked-until-execution-ready') {
    return 'execution-runtime-not-ready'
  }

  if (plan.readinessGate?.status === 'generator-pending') {
    return 'page-family-generator-not-ready'
  }

  return 'plan-readiness-gate-blocked'
}

function buildGenerateBlockedPayload({ options, plan, generation }) {
  return {
    schemaVersion: 1,
    schema: 'hiui-design-execute-non-typical-page-task.v1',
    status: 'blocked-during-generate',
    executionStage: 'generate',
    blockedBy: generation?.blockedBy || 'generate-page-from-brief-blocked',
    reason:
      generation?.reason ||
      'generate-page-from-brief blocked execution for the current non-typical page task.',
    targetRoot: generation?.targetRoot || plan.targetRoot || options.target,
    pageSelector: generation?.pageSelector ||
      plan.pageSelector || {
        kind: 'page-family',
        id: options.pageFamily,
      },
    readinessGate: plan.readinessGate || null,
    nextStepCommand: plan.nextStepCommand || null,
    requiredCommandIds: Array.isArray(plan.requiredCommands)
      ? plan.requiredCommands.map((command) => command.id)
      : [],
    generation,
  }
}

function buildSanityBlockedPayload({ options, plan, generation, lightSanity }) {
  return {
    schemaVersion: 1,
    schema: 'hiui-design-execute-non-typical-page-task.v1',
    status: 'blocked-after-write',
    executionStage: 'sanity',
    blockedBy: 'light-sanity-failed',
    reason:
      lightSanity?.violations?.[0] ||
      'non-typical-page-sanity reported violations after generation.',
    targetRoot: plan.targetRoot || options.target,
    pageSelector: plan.pageSelector || {
      kind: 'page-family',
      id: options.pageFamily,
    },
    readinessGate: plan.readinessGate || null,
    nextStepCommand: plan.nextStepCommand || null,
    requiredCommandIds: Array.isArray(plan.requiredCommands)
      ? plan.requiredCommands.map((command) => command.id)
      : [],
    generation,
    lightSanity,
  }
}

function buildAcceptanceBlockedPayload({
  options,
  plan,
  generation,
  lightSanity,
  hostProfile,
  blockedBy,
  reason,
  executionStage,
  integrationPreflight = null,
  runtimeVerification = null,
}) {
  return {
    schemaVersion: 1,
    schema: 'hiui-design-execute-non-typical-page-task.v1',
    status: 'blocked-after-write',
    executionStage,
    blockedBy,
    reason,
    targetRoot: plan.targetRoot || options.target,
    pageSelector: plan.pageSelector || {
      kind: 'page-family',
      id: options.pageFamily,
    },
    readinessGate: plan.readinessGate || null,
    nextStepCommand: plan.nextStepCommand || null,
    requiredCommandIds: buildAcceptanceRequiredCommandIds({
      requiredCommandIds: Array.isArray(plan.requiredCommands)
        ? plan.requiredCommands.map((command) => command.id)
        : [],
      hostProfile,
      generation,
    }),
    generation,
    lightSanity,
    integrationPreflight,
    runtimeVerification,
  }
}

function printPayload(payload, { json, success }) {
  if (json) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
  } else {
    process.stdout.write(
      `status: ${payload.status}\nexecutionStage: ${payload.executionStage}\nblockedBy: ${payload.blockedBy || '—'}\n`
    )
  }

  if (!success) {
    process.exitCode = 1
  }
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
  const planScriptPath = path.join(skillRoot, 'scripts', 'plan-page-task.mjs')
  const generatorScriptPath = path.join(skillRoot, 'scripts', 'generate-page-from-brief.mjs')
  const sanityScriptPath = path.join(skillRoot, 'scripts', 'non-typical-page-sanity.mjs')
  const integrationPreflightScriptPath = path.join(skillRoot, 'scripts', 'integration-preflight.mjs')
  const verifyRemoteRuntimeSourceScriptPath = path.join(skillRoot, 'scripts', 'verify-remote-runtime-source.mjs')
  const baseArgs = buildBaseArgs(options)

  const planResult = await runJsonScript(targetRoot, planScriptPath, [...baseArgs, '--json'], {
    cwd: skillRoot,
  })
  if (planResult.exitCode !== 0 || !planResult.payload) {
    throw new Error(planResult.rawOutput || 'plan-page-task failed')
  }

  const plan = planResult.payload
  const planRequiredCommandIds = Array.isArray(plan.requiredCommands)
    ? plan.requiredCommands.map((command) => command.id)
    : []

  if (plan.pageSelector?.kind !== 'page-family' || plan.pageSelector?.id !== 'non-typical-page') {
    printPayload(
      buildContractDriftPayload({
        options,
        plan,
        reason:
          'execute-non-typical-page-task expected a non-typical page-family plan but received a different page selector.',
      }),
      { json: options.json, success: false }
    )
    return
  }

  if (plan.readinessGate?.status !== 'ready-to-generate') {
    printPayload(
      buildPlanBlockedPayload({
        options,
        plan,
        blockedBy: resolvePlanBlockedBy(plan),
      }),
      { json: options.json, success: false }
    )
    return
  }

  if (plan.nextStepCommand?.id !== 'run-family-generator') {
    printPayload(
      buildContractDriftPayload({
        options,
        plan,
        reason:
          `execute-non-typical-page-task expected nextStepCommand.id=run-family-generator but received ${plan.nextStepCommand?.id || 'empty'}.`,
      }),
      { json: options.json, success: false }
    )
    return
  }

  if (!planRequiredCommandIds.includes('non-typical-page-sanity')) {
    printPayload(
      buildContractDriftPayload({
        options,
        plan,
        reason:
          'execute-non-typical-page-task expected requiredCommands to include non-typical-page-sanity before closing the workflow.',
      }),
      { json: options.json, success: false }
    )
    return
  }

  const generatorArgs = [...baseArgs]
  if (options.force) {
    generatorArgs.push('--force')
  }
  generatorArgs.push('--json')

  const generationResult = await runJsonScript(targetRoot, generatorScriptPath, generatorArgs, {
    cwd: skillRoot,
  })
  if (generationResult.exitCode !== 0) {
    if (generationResult.payload) {
      printPayload(
        buildGenerateBlockedPayload({
          options,
          plan,
          generation: generationResult.payload,
        }),
        { json: options.json, success: false }
      )
      return
    }

    throw new Error(generationResult.rawOutput || 'generate-page-from-brief failed')
  }

  if (!generationResult.payload) {
    throw new Error('generate-page-from-brief returned no JSON payload')
  }

  const sanityResult = await runJsonScript(targetRoot, sanityScriptPath, [...baseArgs, '--json'], {
    cwd: skillRoot,
  })
  if (sanityResult.exitCode !== 0 || !sanityResult.payload) {
    throw new Error(sanityResult.rawOutput || 'non-typical-page-sanity failed')
  }

  if (sanityResult.payload.status !== 'pass') {
    printPayload(
      buildSanityBlockedPayload({
        options,
        plan,
        generation: generationResult.payload,
        lightSanity: sanityResult.payload,
      }),
      { json: options.json, success: false }
    )
    return
  }

  const hostProfile = await detectHostProfile(targetRoot)
  const effectiveExposeName = deriveExposeName(options)
  const formalAcceptanceRequired = requiresLegacyMfFormalAcceptance({
    hostProfile,
    generation: generationResult.payload,
  })
  const requiredCommandIds = buildAcceptanceRequiredCommandIds({
    requiredCommandIds: planRequiredCommandIds,
    hostProfile,
    generation: generationResult.payload,
  })
  const executedCommandIds = ['run-family-generator', 'non-typical-page-sanity']
  let integrationPreflight = null
  let runtimeVerification = null

  if (formalAcceptanceRequired) {
    if (!effectiveExposeName || !normalizeString(options.entryFile)) {
      printPayload(
        buildAcceptanceBlockedPayload({
          options,
          plan,
          generation: generationResult.payload,
          lightSanity: sanityResult.payload,
          hostProfile,
          blockedBy: 'integration-preflight-arguments-missing',
          reason:
            'Legacy Module Federation publish acceptance requires --expose-name (or a routable @common/<ExposeName> route-path) and --entry-file before this executor can close the task.',
          executionStage: 'integration-preflight',
        }),
        { json: options.json, success: false }
      )
      return
    }

    const acceptanceArgs = buildAcceptanceArgs(
      {
        ...options,
        exposeName: effectiveExposeName,
      },
      generationResult.payload
    )
    const preflightResult = await runJsonScript(
      targetRoot,
      integrationPreflightScriptPath,
      [...acceptanceArgs, '--json'],
      { cwd: skillRoot }
    )

    if (preflightResult.exitCode !== 0 || !preflightResult.payload) {
      throw new Error(preflightResult.rawOutput || 'integration-preflight failed')
    }

    integrationPreflight = preflightResult.payload
    executedCommandIds.push('integration-preflight')

    if (integrationPreflight.status === 'pass-with-runtime-pending') {
      const verifyArgs = [
        '--target',
        options.target,
        '--expose-name',
        effectiveExposeName,
      ]
      if (normalizeString(options.remoteEntryUrl)) {
        verifyArgs.push('--remote-entry-url', options.remoteEntryUrl)
      }
      verifyArgs.push('--json')

      const verifyResult = await runJsonScript(
        targetRoot,
        verifyRemoteRuntimeSourceScriptPath,
        verifyArgs,
        { cwd: skillRoot }
      )
      if (verifyResult.exitCode !== 0 || !verifyResult.payload) {
        throw new Error(verifyResult.rawOutput || 'verify-remote-runtime-source failed')
      }

      runtimeVerification = verifyResult.payload
      executedCommandIds.push('verify-remote-runtime-source')

      const refreshedPreflightResult = await runJsonScript(
        targetRoot,
        integrationPreflightScriptPath,
        [...acceptanceArgs, '--json'],
        { cwd: skillRoot }
      )
      if (refreshedPreflightResult.exitCode !== 0 || !refreshedPreflightResult.payload) {
        throw new Error(refreshedPreflightResult.rawOutput || 'integration-preflight refresh failed')
      }

      integrationPreflight = refreshedPreflightResult.payload
    }

    if (integrationPreflight.status !== 'pass') {
      const blockedBy =
        integrationPreflight.status === 'pass-with-runtime-pending'
          ? 'runtime-verification-pending'
          : 'integration-preflight-blocked'
      const reason =
        integrationPreflight.checks?.runtimeVerification?.reason ||
        integrationPreflight.checks?.codeRegistered?.reason ||
        integrationPreflight.requiredManualActions?.[0] ||
        'Legacy Module Federation publish acceptance did not pass.'

      printPayload(
        buildAcceptanceBlockedPayload({
          options,
          plan,
          generation: generationResult.payload,
          lightSanity: sanityResult.payload,
          hostProfile,
          blockedBy,
          reason,
          executionStage:
            integrationPreflight.status === 'pass-with-runtime-pending'
              ? 'runtime-verification'
              : 'integration-preflight',
          integrationPreflight,
          runtimeVerification,
        }),
        { json: options.json, success: false }
      )
      return
    }
  }

  const payload = {
    schemaVersion: 1,
    schema: 'hiui-design-execute-non-typical-page-task.v1',
    status: 'completed',
    executionStage: 'completed',
    targetRoot: plan.targetRoot || options.target,
    pageSelector: plan.pageSelector,
    pageFamily: plan.pageFamily || options.pageFamily,
    workflowId: generationResult.payload.nonTypicalExecutionBrief?.workflowId || '',
    coordinationPatternId:
      generationResult.payload.coordinationPatternId ||
      generationResult.payload.nonTypicalExecutionBrief?.coordinationPattern?.coordinationPatternId ||
      generationResult.payload.nonTypicalExecutionBrief?.coordinationBindings?.coordinationPatternId ||
      '',
    readinessGate: plan.readinessGate || null,
    nextStepCommand: plan.nextStepCommand || null,
    requiredCommandIds,
    executedCommandIds,
    generation: generationResult.payload,
    lightSanity: sanityResult.payload,
  }

  if (integrationPreflight) {
    payload.integrationPreflight = integrationPreflight
  }
  if (runtimeVerification) {
    payload.runtimeVerification = runtimeVerification
  }

  printPayload(payload, { json: options.json, success: true })
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
