import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

import { isVersionCompatible } from './version-compatibility.mjs'

export const DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE = 'auto'
export const DEFAULT_NON_TYPICAL_PROJECT_CHECK_OUT_DIR =
  '.local-context/hiui-design/tmp-non-typical-vite-build'
export const DEFAULT_PROJECT_CHECK_PROFILE = DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE

function normalizeString(value) {
  return String(value || '').trim()
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readProjectPackageJson(targetRoot) {
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

function quoteShellValue(value) {
  return `'${String(value).replace(/'/g, `'"'"'`)}'`
}

function normalizeNodeVersionSpec(spec) {
  return normalizeString(spec).replace(/^v/, '')
}

function resolveLauncherNodeVersion() {
  return normalizeNodeVersionSpec(process.versions?.node || process.version)
}

function resolveProjectNodeExpectation(pkg) {
  return normalizeNodeVersionSpec(pkg?.engines?.node || pkg?.volta?.node)
}

function buildNodeInvocation(nodePath, entryPath, args = []) {
  return [quoteShellValue(nodePath), quoteShellValue(entryPath), ...args.map(quoteShellValue)].join(' ')
}

async function resolveAvailableChecks(targetRoot, nodePath) {
  const checks = []
  const typecheckEntryPath = path.join(targetRoot, 'node_modules', 'typescript', 'bin', 'tsc')
  const viteEntryPath = path.join(targetRoot, 'node_modules', 'vite', 'bin', 'vite.js')

  if (await pathExists(typecheckEntryPath)) {
    checks.push({
      id: 'typecheck',
      command: buildNodeInvocation(nodePath, typecheckEntryPath, ['--noEmit']),
      reason: 'Selected local TypeScript `tsc --noEmit` as the minimal non-destructive engineering check.',
    })
  }

  if (await pathExists(viteEntryPath)) {
    checks.push({
      id: 'bundle-build',
      command: buildNodeInvocation(nodePath, viteEntryPath, [
        'build',
        '--outDir',
        DEFAULT_NON_TYPICAL_PROJECT_CHECK_OUT_DIR,
      ]),
      reason:
        'Selected local Vite build with an isolated output directory to verify bundle-level compatibility without touching the project default dist output.',
    })
  }

  return checks
}

function buildSkippedReason({ profile, launcherNodeVersion, nodeExpectation }) {
  if (profile === 'typecheck-only') {
    return 'Skipped isolated Vite build because the active project-check profile is `typecheck-only`.'
  }
  if (nodeExpectation) {
    return `Skipped isolated Vite build because launcher Node ${launcherNodeVersion} does not satisfy project Node policy ${nodeExpectation}.`
  }
  return 'Skipped isolated Vite build because no compatible launcher runtime policy could be established.'
}

export async function resolveNonTypicalProjectCheckPlan({
  targetRoot,
  projectCheckCommand = '',
  projectCheckProfile = DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE,
  nodePath = process.execPath,
} = {}) {
  const normalizedCommand = normalizeString(projectCheckCommand)
  const normalizedProfile = normalizeString(
    projectCheckProfile || DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE
  ).toLowerCase()

  if (normalizedCommand) {
    return {
      status: 'configured',
      profile: normalizedProfile,
      command: normalizedCommand,
      reason: 'Using explicit `--project-check-command` override.',
      selectedChecks: ['custom-command'],
    }
  }

  if (!['auto', 'typecheck-only', 'none'].includes(normalizedProfile)) {
    throw new Error(
      `Unsupported --project-check-profile value: ${normalizedProfile}. Expected auto, typecheck-only, or none.`
    )
  }

  if (normalizedProfile === 'none') {
    return {
      status: 'not-run',
      profile: normalizedProfile,
      command: '',
      reason: 'Project check was disabled by `--project-check-profile none`.',
      selectedChecks: [],
    }
  }

  const { pkg } = await readProjectPackageJson(targetRoot)
  const launcherNodeVersion = resolveLauncherNodeVersion()
  const nodeExpectation = resolveProjectNodeExpectation(pkg)
  const availableChecks = await resolveAvailableChecks(targetRoot, nodePath)
  const typecheckCheck = availableChecks.find((item) => item.id === 'typecheck')
  const viteCheck = availableChecks.find((item) => item.id === 'bundle-build')
  const selectedChecks = []
  const commands = []
  const reasons = []

  if (typecheckCheck) {
    selectedChecks.push(typecheckCheck.id)
    commands.push(typecheckCheck.command)
    reasons.push(typecheckCheck.reason)
  }

  if (viteCheck) {
    const launcherCanRunBundle =
      normalizedProfile === 'auto' &&
      (!nodeExpectation || isVersionCompatible(launcherNodeVersion, nodeExpectation))

    if (launcherCanRunBundle) {
      selectedChecks.push(viteCheck.id)
      commands.push(viteCheck.command)
      reasons.push(viteCheck.reason)
    } else {
      reasons.push(
        buildSkippedReason({
          profile: normalizedProfile,
          launcherNodeVersion,
          nodeExpectation,
        })
      )
    }
  }

  if (commands.length === 0) {
    return {
      status: 'not-run',
      profile: normalizedProfile,
      command: '',
      reason:
        reasons[0] ||
        'Project check was not run because no local TypeScript or Vite executables were found in node_modules.',
      selectedChecks,
    }
  }

  return {
    status: 'configured',
    profile: normalizedProfile,
    command: commands.join(' && '),
    reason: reasons.join(' '),
    selectedChecks,
  }
}

export async function resolveManagedProjectCheckPlan(options = {}) {
  return resolveNonTypicalProjectCheckPlan(options)
}

export function runNonTypicalProjectCheck(targetRoot, plan) {
  if (!plan || plan.status !== 'configured') {
    return {
      status: plan?.status || 'not-run',
      profile: plan?.profile || DEFAULT_NON_TYPICAL_PROJECT_CHECK_PROFILE,
      command: plan?.command || '',
      reason: plan?.reason || 'No project check command was provided.',
      selectionReason: plan?.reason || 'No project check command was provided.',
      selectedChecks: plan?.selectedChecks || [],
      exitCode: null,
      stdout: '',
      stderr: '',
    }
  }

  const result = spawnSync('/bin/zsh', ['-lc', plan.command], {
    cwd: targetRoot,
    encoding: 'utf8',
  })

  return {
    status: result.status === 0 ? 'pass' : 'fail',
    profile: plan.profile,
    command: plan.command,
    reason:
      result.status === 0
        ? 'Project check command passed.'
        : `Project check command failed with exit code ${result.status}.`,
    selectionReason: plan.reason,
    selectedChecks: plan.selectedChecks,
    exitCode: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  }
}

export function runManagedProjectCheck(targetRoot, plan) {
  return runNonTypicalProjectCheck(targetRoot, plan)
}
