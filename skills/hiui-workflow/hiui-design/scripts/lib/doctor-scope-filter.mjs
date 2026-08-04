import path from 'node:path'
import { spawnSync } from 'node:child_process'

function printScopedDoctorUsage(scriptName, scope) {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/${scriptName}" [--target <project-root>] [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--line <line-id>] [--dest <relative-dir>] [--json]

Scope:
  ${scope}
`)
}

function parseScopedDoctorArgs(argv, { scriptName, scope }) {
  const passthrough = []
  let json = false
  let mode = ''

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      continue
    }

    if (arg === '--json') {
      json = true
      continue
    }

    if (arg === '--target' || arg === '--dest' || arg === '--mode' || arg === '--line') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      passthrough.push(arg, value)
      if (arg === '--mode') mode = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printScopedDoctorUsage(scriptName, scope)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { json, mode, passthrough }
}

function summarizeChecks(checks) {
  return {
    passed: checks.filter((item) => item.ok).length,
    failed: checks.filter((item) => !item.ok).length,
    hardFailures: checks.filter((item) => !item.ok && item.severity === 'error').length,
    manualSteps: checks.filter((item) => !item.ok && item.severity === 'manual').length,
    warnings: checks.filter((item) => !item.ok && item.severity === 'warn').length,
  }
}

function overallStatusFromChecks(checks) {
  if (checks.some((item) => !item.ok && item.severity === 'error')) return 'fail'
  if (checks.some((item) => !item.ok && item.severity === 'manual')) return 'manual'
  if (checks.some((item) => !item.ok && item.severity === 'warn')) return 'warn'
  return 'pass'
}

function checkModeScope(check) {
  const id = String(check?.id || '')
  if (id.startsWith('rules-only-')) return 'rules-only'
  if (id.startsWith('legacy-')) return 'legacy-host-compatible'
  if (id.startsWith('legacy') && id.endsWith('-script')) return 'legacy-host-compatible'
  if (['legacy-init-script', 'legacy-new-script', 'legacy-rewrite-script', 'legacy-verify-script', 'legacy-accept-script'].includes(id)) {
    return 'legacy-host-compatible'
  }
  return 'common'
}

function filterChecks(checks, scope, { mode = '' } = {}) {
  if (scope === 'integration') {
    const normalizedMode = String(mode || '').trim()
    if (!normalizedMode || normalizedMode === 'auto') return checks
    return checks.filter((check) => {
      const checkScope = checkModeScope(check)
      return checkScope === 'common' || checkScope === normalizedMode
    })
  }

  throw new Error(`Unknown doctor scope: ${scope}`)
}

function parseDoctorJson(stdout) {
  const raw = String(stdout || '').trim()
  if (!raw) {
    throw new Error('typical-page-doctor did not return JSON output')
  }
  return JSON.parse(raw)
}

function buildScopedReport(sourceReport, scope, options = {}) {
  const sourceChecks = sourceReport.checks || []
  const mode = options.mode || sourceReport.mode || ''
  const checks = filterChecks(sourceChecks, scope, { mode })
  const status = overallStatusFromChecks(checks)
  const selectedCheckIds = new Set(checks.map((item) => item.id))
  return {
    ...sourceReport,
    status,
    currentPageReady: status === 'pass',
    summary: summarizeChecks(checks),
    sourceDoctorStatus: sourceReport.status,
    scope,
    mode,
    checks,
    excludedCheckIds: sourceChecks.filter((item) => !selectedCheckIds.has(item.id)).map((item) => item.id),
  }
}

function runScopedDoctor({ argv, doctorScript, scriptName, scope }) {
  const options = parseScopedDoctorArgs(argv, { scriptName, scope })
  const result = spawnSync(process.execPath, [doctorScript, ...options.passthrough, '--json'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.error) {
    throw result.error
  }

  const sourceReport = parseDoctorJson(result.stdout)
  const report = buildScopedReport(sourceReport, scope, { mode: options.mode })

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`Typical Page Doctor (${scope}): ${report.status.toUpperCase()}`)
    console.log(`- source doctor status: ${report.sourceDoctorStatus}`)
    console.log(`- checked: ${report.checks.length}`)
    console.log(`- passed: ${report.summary.passed}`)
    console.log(`- failed: ${report.summary.failed}`)
    for (const item of report.checks) {
      const mark = item.ok ? 'PASS' : item.severity.toUpperCase()
      console.log(`[${mark}] ${item.summary}`)
      if (item.detail) console.log(`  ${item.detail}`)
    }
  }

  if (report.status === 'fail') {
    process.exit(1)
  }
}

export {
  buildScopedReport,
  filterChecks,
  runScopedDoctor,
}
