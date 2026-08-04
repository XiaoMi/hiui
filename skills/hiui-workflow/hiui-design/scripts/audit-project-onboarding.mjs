#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { isAuditedModeOverride, resolveRecommendedMode } from './lib/install-mode-policy.mjs'

const MODE_LOCK_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-mode.json'
const INTEGRATION_STATE_RELATIVE_PATH =
  '.local-context/hiui-design/outputs/project-integration-state.json'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/audit-project-onboarding.mjs" [--target <project-root>] [--json]

Behavior:
  - reads package.json, hiui-design context, mode lock, integration state, and host profile
  - detects incomplete onboarding and install mode mismatches
  - does not modify files
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options.target = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

function collectDependencies(pkg) {
  return {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
    ...(pkg.peerDependencies || {}),
  }
}

function hasReactDependency(dependencies) {
  return Boolean(dependencies.react || dependencies['react-dom'])
}

function hasHiuiDependency(dependencies) {
  return Object.keys(dependencies).some(
    (name) =>
      name === 'hiui5' ||
      name === '@hi-ui/hiui' ||
      name === '@hiui-design/typical-page-shells' ||
      name.startsWith('@hi-ui/')
  )
}

function getTypicalPageScripts(pkg) {
  return Object.entries(pkg.scripts || {})
    .filter(([name]) => name.startsWith('typical-page:'))
    .map(([name, command]) => ({ name, command: String(command || '') }))
}

function getRecommendedMode({ hostProfile, modeLock, integrationState }) {
  return (
    String(modeLock?.recommendedMode || '').trim() ||
    String(integrationState?.recommendedMode || '').trim() ||
    resolveRecommendedMode({ hostProfile })
  )
}

function pushFinding(findings, { id, severity, summary, detail = '' }) {
  findings.push({ id, severity, summary, detail })
}

function deriveStatus(findings) {
  if (findings.some((finding) => finding.severity === 'error')) return 'fail'
  if (findings.some((finding) => finding.severity === 'warn')) return 'warn'
  return 'pass'
}

async function auditProject(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  const pkg = await readJsonIfExists(packageJsonPath)

  if (!pkg) {
    return {
      schemaVersion: 'hiui-project-onboarding-audit.v1',
      status: 'not-a-node-project',
      targetRoot,
      packageJsonPath,
      findings: [
        {
          id: 'package-json-missing',
          severity: 'error',
          summary: 'package.json is missing or unreadable',
          detail: packageJsonPath,
        },
      ],
    }
  }

  const dependencies = collectDependencies(pkg)
  const reactDetected = hasReactDependency(dependencies)
  const hiuiDetected = hasHiuiDependency(dependencies)
  const typicalPageScripts = getTypicalPageScripts(pkg)
  const hiuiContextPath = path.join(targetRoot, '.local-context', 'hiui-design')
  const hiuiContextExists = await pathExists(hiuiContextPath)
  const modeLockPath = path.join(targetRoot, MODE_LOCK_RELATIVE_PATH)
  const integrationStatePath = path.join(targetRoot, INTEGRATION_STATE_RELATIVE_PATH)
  const modeLock = await readJsonIfExists(modeLockPath)
  const integrationState = await readJsonIfExists(integrationStatePath)
  const hostProfile = await detectHostProfile(targetRoot, {
    ignoreRelativePaths: ['src/typical-page-reuse'],
  })
  const recommendedMode = getRecommendedMode({ hostProfile, modeLock, integrationState })
  const mode = String(modeLock?.mode || integrationState?.mode || '').trim()
  const findings = []

  if (reactDetected && hiuiDetected && !hiuiContextExists) {
    pushFinding(findings, {
      id: 'react-hiui-without-hiui-design-context',
      severity: 'error',
      summary: 'React + HiUI project has no hiui-design context',
      detail: 'Expected .local-context/hiui-design before declaring onboarding complete.',
    })
  }

  if (typicalPageScripts.length > 0 && !modeLock) {
    pushFinding(findings, {
      id: 'typical-page-scripts-without-mode-lock',
      severity: 'error',
      summary: 'typical-page scripts exist but project mode is not locked',
      detail: `Missing ${MODE_LOCK_RELATIVE_PATH}.`,
    })
  }

  if (mode && recommendedMode && mode !== recommendedMode) {
    const auditedOverride = isAuditedModeOverride({ modeLock, mode, recommendedMode })
    pushFinding(findings, {
      id: 'install-mode-mismatch',
      severity: auditedOverride ? 'warn' : 'error',
      summary: auditedOverride
        ? 'install mode differs from recommendation with an audited override'
        : 'install mode differs from recommendation without an audited override',
      detail: auditedOverride
        ? `recommendedMode=${recommendedMode}; mode=${mode}; overrideReason=${modeLock.overrideReason}`
        : `recommendedMode=${recommendedMode}; mode=${mode}; expected modeSelectionStatus=overridden and non-empty overrideReason in ${MODE_LOCK_RELATIVE_PATH}.`,
    })
  }

  if (modeLock && !integrationState) {
    pushFinding(findings, {
      id: 'mode-lock-without-integration-state',
      severity: 'error',
      summary: 'project mode is locked but integration state is missing',
      detail: `Missing ${INTEGRATION_STATE_RELATIVE_PATH}.`,
    })
  }

  if (integrationState && integrationState.onboardingCompletionReady !== true) {
    pushFinding(findings, {
      id: 'onboarding-completion-not-ready',
      severity: 'warn',
      summary: 'onboarding completion gates are not fully passed',
      detail: `onboardingCompletionReady=${String(integrationState.onboardingCompletionReady)}; doctorPassed=${integrationState.completionGates?.doctorPassed || 'unknown'}; engineeringPassed=${integrationState.completionGates?.engineeringPassed || 'unknown'}.`,
    })
  }

  if (reactDetected && !hiuiDetected) {
    pushFinding(findings, {
      id: 'react-without-hiui-runtime',
      severity: 'warn',
      summary: 'React project does not declare HiUI runtime dependencies',
      detail: 'This is expected only before starting HiUI onboarding.',
    })
  }

  return {
    schemaVersion: 'hiui-project-onboarding-audit.v1',
    status: deriveStatus(findings),
    targetRoot,
    packageName: String(pkg.name || '').trim(),
    detected: {
      react: reactDetected,
      hiui: hiuiDetected,
      hiuiDesignContext: hiuiContextExists,
      typicalPageScriptCount: typicalPageScripts.length,
      modeLock: Boolean(modeLock),
      integrationState: Boolean(integrationState),
    },
    hostProfile,
    recommendedMode,
    mode: mode || 'unlocked',
    modeSelectionStatus: String(modeLock?.modeSelectionStatus || integrationState?.modeSelectionStatus || '').trim() || 'unknown',
    onboardingCompletionReady: integrationState?.onboardingCompletionReady === true,
    typicalPageScripts,
    factPaths: {
      modeLock: MODE_LOCK_RELATIVE_PATH,
      integrationState: INTEGRATION_STATE_RELATIVE_PATH,
    },
    findings,
  }
}

function printHumanReport(report) {
  console.log('HiUI onboarding audit:')
  console.log(`- status: ${report.status}`)
  console.log(`- target: ${report.targetRoot}`)
  if (report.packageName) console.log(`- package: ${report.packageName}`)
  if (report.recommendedMode) console.log(`- recommended mode: ${report.recommendedMode}`)
  if (report.mode) console.log(`- current mode: ${report.mode}`)
  console.log(`- onboarding completion ready: ${report.onboardingCompletionReady ? 'yes' : 'no'}`)
  if (report.findings.length === 0) {
    console.log('- findings: none')
    return
  }
  console.log('- findings:')
  for (const finding of report.findings) {
    console.log(`  - [${finding.severity}] ${finding.id}: ${finding.summary}`)
    if (finding.detail) console.log(`    ${finding.detail}`)
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const report = await auditProject(targetRoot)

    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
    } else {
      printHumanReport(report)
    }

    if (report.status === 'fail' || report.status === 'not-a-node-project') {
      process.exitCode = 1
    }
  } catch (error) {
    console.error(`audit-project-onboarding failed: ${error.message}`)
    process.exitCode = 1
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}

export { auditProject }
