#!/usr/bin/env node

import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import {
  checkSyncProfileContract,
  findSyncProfileContract,
  loadSyncProfileContracts,
} from './lib/sync-profile-contract.mjs'

function parseArgs(argv) {
  const args = {
    json: false,
    mode: '',
    profile: '',
    skillRoot: '',
    syncProfile: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (token === '--json') {
      args.json = true
      continue
    }
    if (token === '--profile') {
      args.profile = argv[index + 1] || ''
      index += 1
      continue
    }
    if (token === '--mode') {
      args.mode = argv[index + 1] || ''
      index += 1
      continue
    }
    if (token === '--sync-profile') {
      args.syncProfile = argv[index + 1] || ''
      index += 1
      continue
    }
    if (token === '--skill-root') {
      args.skillRoot = argv[index + 1] || ''
      index += 1
      continue
    }
    if (token === '--help' || token === '-h') {
      console.log(`Usage:
  node scripts/check-sync-profile-contract.mjs --profile <profile-id> [--skill-root <skill-root>] [--json]
  node scripts/check-sync-profile-contract.mjs --mode <mode> --sync-profile <minimal|workbench> [--skill-root <skill-root>] [--json]
`)
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${token}`)
  }

  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(args.skillRoot || path.join(scriptDir, '..'))
  const { payload } = await loadSyncProfileContracts(skillRoot)
  const profile = findSyncProfileContract(payload, {
    profileId: args.profile,
    mode: args.mode,
    syncProfile: args.syncProfile,
  })

  if (!profile) {
    throw new Error(
      `Sync profile contract was not found for ${args.profile || `${args.mode || '(any-mode)'}/${args.syncProfile || '(any-profile)'}`}`
    )
  }

  const scripts = getReusableScripts('', {
    mode: profile.mode,
    syncProfile: profile.syncProfile,
  })
  const result = await checkSyncProfileContract({ skillRoot, profile, scripts })

  if (args.json) {
    console.log(JSON.stringify(result, null, 2))
  } else if (result.status === 'passed') {
    console.log(`[hiui-design][sync-profile-contract] ${profile.profileId}: passed`)
  } else {
    console.error(`[hiui-design][sync-profile-contract] ${profile.profileId}: failed`)
    for (const issue of result.issues) console.error(`- ${issue}`)
  }

  if (result.status !== 'passed') {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
