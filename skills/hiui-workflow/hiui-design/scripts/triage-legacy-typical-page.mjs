#!/usr/bin/env node

import path from 'node:path'
import {
  defaultSkillRoot,
  getDefaultLegacyTypicalPageMigrationChangeScope,
  getLegacyTypicalPageMigrationChangeScopes,
  triageLegacyTypicalPage,
} from './lib/legacy-typical-page-migration.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/triage-legacy-typical-page.mjs" --page <relative-page-path> [--change-scope <bugfix|content-adjustment|slot-refactor|page-shell-refactor|entry-migration>] [--target <project-root>] [--skill-root <skill-root>] [--break-glass] [--json]

Notes:
  - This is a read-only migration triage tool for existing legacy typical pages.
  - It evaluates the packaged decision matrix from rules/legacy-typical-page-migration-decision.json.
  - Default change scope is ${getDefaultLegacyTypicalPageMigrationChangeScope()}.
`)
}

function parseArgs(argv) {
  const options = {
    breakGlass: false,
    changeScope: getDefaultLegacyTypicalPageMigrationChangeScope(),
    json: false,
    page: '',
    skillRoot: defaultSkillRoot(),
    target: process.cwd(),
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

    if (arg === '--break-glass') {
      options.breakGlass = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    if (arg === '--page' || arg === '--change-scope' || arg === '--target' || arg === '--skill-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page') options.page = value
      if (arg === '--change-scope') options.changeScope = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--skill-root') options.skillRoot = path.resolve(value)
      index += 1
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.page) {
    throw new Error('Missing required --page')
  }

  if (!getLegacyTypicalPageMigrationChangeScopes().includes(options.changeScope)) {
    throw new Error(
      `Unsupported --change-scope "${options.changeScope}". Expected one of: ${getLegacyTypicalPageMigrationChangeScopes().join(', ')}`
    )
  }

  return options
}

function printHumanReadableReport(report) {
  console.log(`Legacy typical-page triage status: ${report.status}`)
  console.log(`Legacy typical-page triage: ${report.decision}`)
  console.log(`- page: ${report.page}`)
  console.log(`- page type: ${report.pageType}`)
  console.log(`- change scope: ${report.changeScope}`)
  console.log(`- legacy carrier: ${report.usesLegacyCarrier ? 'yes' : 'no'}`)
  console.log(`- official runtime support: ${report.officialRuntimeSupport}`)
  console.log(`- canonical support: ${report.canonicalSupport}`)
  console.log(`- route stable cutover: ${report.routeCanStayStable ? 'yes' : 'no'}`)
  console.log(`- drift signals: ${report.legacyDriftSignals.join(', ') || '(none)'}`)
  console.log(`- reason codes: ${report.reasonCodes.join(', ') || '(none)'}`)
  console.log(`- next action: ${report.requiredNextAction || '(none)'}`)
}

try {
  const options = parseArgs(process.argv.slice(2))
  const report = triageLegacyTypicalPage({
    breakGlassRequested: options.breakGlass,
    changeScope: options.changeScope,
    pagePath: options.page,
    skillRoot: options.skillRoot,
    targetRoot: options.target,
  })

  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  } else {
    printHumanReadableReport(report)
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  if (process.argv.includes('--json')) {
    process.stdout.write(
      `${JSON.stringify(
        {
          schemaVersion: 'legacy-typical-page-triage.v1',
          status: 'invalid',
          error: message,
        },
        null,
        2
      )}\n`
    )
  } else {
    console.error(message)
  }
  process.exit(1)
}
