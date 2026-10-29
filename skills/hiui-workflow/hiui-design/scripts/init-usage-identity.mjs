#!/usr/bin/env node

import { createTelemetryRuntime, prepareLocalIdentity } from './lib/usage-telemetry.mjs'

function parseArgs(argv) {
  const options = {
    installId: '',
    json: false,
    userEmail: '',
    workspaceRoot: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--workspace-root' || arg === '--user-email' || arg === '--install-id') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--workspace-root') options.workspaceRoot = value
      if (arg === '--user-email') options.userEmail = value
      if (arg === '--install-id') options.installId = value
      index += 1
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/init-usage-identity.mjs [--workspace-root <project-root>] [--user-email <email>] [--install-id <id>] [--json]'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const runtime = await createTelemetryRuntime(options.workspaceRoot)
  const identity = await prepareLocalIdentity(runtime, {
    installId: options.installId,
    userEmail: options.userEmail,
  })

  if (options.json) {
    console.log(JSON.stringify({ identity, workspaceRoot: runtime.workspaceRoot }, null, 2))
    return
  }

  console.log(`workspace root: ${runtime.workspaceRoot}`)
  console.log(`- user_email: ${identity.user_email || '(empty)'}`)
  console.log(`- install_id: ${identity.install_id}`)
}

await main()
