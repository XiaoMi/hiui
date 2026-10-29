#!/usr/bin/env node

import { intakeDesignRestoreInput } from './lib/design-restore-intake.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function parseArgs(argv) {
  const options = {
    inputMode: '',
    confirmedDesignRestoreInputJson: '',
    json: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--input-mode') {
      options.inputMode = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--confirmed-design-restore-input-json') {
      options.confirmedDesignRestoreInputJson = readRequiredArg(argv, i, arg)
      i += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/design-restore-intake.mjs --input-mode <figma-design-restore|design-screenshot-restore> --confirmed-design-restore-input-json <json> [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  let confirmedDesignRestoreInput = null

  if (options.confirmedDesignRestoreInputJson) {
    try {
      confirmedDesignRestoreInput = JSON.parse(options.confirmedDesignRestoreInputJson)
    } catch (error) {
      throw new Error(
        `Invalid JSON passed to --confirmed-design-restore-input-json: ${error.message}`
      )
    }
  }

  const payload = intakeDesignRestoreInput({
    inputMode: options.inputMode,
    confirmedDesignRestoreInput,
  })

  if (!payload.ok) {
    const output = JSON.stringify(payload, null, 2)
    if (options.json) {
      process.stdout.write(`${output}\n`)
      process.exitCode = 1
      return
    }
    throw new Error(payload.violations.join('; '))
  }

  if (options.json) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
    return
  }

  console.log('# Design Restore Intake')
  console.log('')
  console.log(`- inputMode: ${payload.inputMode?.id || ''}`)
  console.log(`- ok: ${payload.ok ? 'true' : 'false'}`)
  console.log(
    `- regionDecisionCount: ${payload.confirmedDesignRestoreInput?.restoreDecisionPackage?.regionDecisionTable?.length || 0}`
  )
}

main().catch((error) => {
  console.error(error.message || String(error))
  process.exit(1)
})
