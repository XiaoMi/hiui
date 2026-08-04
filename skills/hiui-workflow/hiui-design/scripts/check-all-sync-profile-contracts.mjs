#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import {
  checkSyncProfileContract,
  findSyncProfileContract,
  loadSyncProfileContracts,
} from './lib/sync-profile-contract.mjs'

async function pathExists(targetPath) {
  try {
    const fs = await import('node:fs/promises')
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJsonIfExists(targetPath) {
  try {
    const fs = await import('node:fs/promises')
    return JSON.parse(await fs.readFile(targetPath, 'utf8'))
  } catch {
    return null
  }
}

function parseArgs(argv) {
  const options = { allProfiles: false, json: false, mode: '', profileId: '', syncProfile: '' }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--') {
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--all-profiles') {
      options.allProfiles = true
      continue
    }
    if (arg === '--profile' || arg === '--mode' || arg === '--sync-profile') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--profile') options.profileId = value
      if (arg === '--mode') options.mode = value
      if (arg === '--sync-profile') options.syncProfile = value
      index += 1
      continue
    }
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }
  return options
}

function printUsage() {
  console.log(`Usage:
  node scripts/check-all-sync-profile-contracts.mjs [--json] [--all-profiles]
  node scripts/check-all-sync-profile-contracts.mjs --profile <profileId> [--json]
  node scripts/check-all-sync-profile-contracts.mjs --mode <mode> [--sync-profile <minimal|workbench>] [--json]

Validates sync profile contracts against reusable scripts, sync manifests, and vendor tarball hashes.
Maintainer/distribution packages should use --all-profiles. Project-local bundles default to the locked current mode when .local-context/hiui-design/outputs/project-mode.json exists.`)
}

async function selectProfiles({ skillRoot, payload, options }) {
  if (options.allProfiles) return payload.profiles

  const explicitProfile = findSyncProfileContract(payload, {
    profileId: options.profileId,
    mode: options.mode,
    syncProfile: options.syncProfile,
  })
  if (options.profileId || options.mode || options.syncProfile) {
    if (!explicitProfile) {
      throw new Error(`No sync profile contract matched ${options.profileId || `${options.mode}/${options.syncProfile || 'minimal'}`}`)
    }
    return [explicitProfile]
  }

  const targetRoot = path.resolve(skillRoot, '..', '..')
  const modeLock = await readJsonIfExists(path.join(skillRoot, 'outputs', 'project-mode.json'))
  if (modeLock?.mode) {
    const profile = findSyncProfileContract(payload, {
      mode: modeLock.mode,
      syncProfile: modeLock.syncProfile || 'minimal',
    })
    if (profile) return [profile]
  }

  const allManifestPathsExist = await Promise.all(
    payload.profiles.map((profile) => pathExists(path.join(skillRoot, profile.syncManifestPath || '')))
  )
  if (allManifestPathsExist.every(Boolean)) return payload.profiles

  const fallbackModeLock = await readJsonIfExists(path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json'))
  if (fallbackModeLock?.mode) {
    const profile = findSyncProfileContract(payload, {
      mode: fallbackModeLock.mode,
      syncProfile: fallbackModeLock.syncProfile || 'minimal',
    })
    if (profile) return [profile]
  }

  return payload.profiles.filter((profile, index) => allManifestPathsExist[index])
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printUsage()
    return
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { payload } = await loadSyncProfileContracts(skillRoot)
  const results = []

  const profiles = await selectProfiles({ skillRoot, payload, options })

  for (const profile of profiles) {
    const scripts = getReusableScripts('', {
      mode: profile.mode,
      syncProfile: profile.syncProfile,
    })
    results.push(await checkSyncProfileContract({ skillRoot, profile, scripts }))
  }

  const failed = results.filter((result) => result.status !== 'passed')
  const summary = {
    schemaVersion: 'hiui-design-sync-profile-contract-suite.v1',
    status: failed.length === 0 ? 'passed' : 'failed',
    checkedProfiles: results.length,
    selectedProfiles: profiles.map((profile) => profile.profileId),
    failedProfiles: failed.map((result) => result.profileId),
    results,
  }

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2))
  } else if (summary.status === 'passed') {
    console.log(`[hiui-design][sync-profile-contract-suite] passed (${results.length} profiles)`)
  } else {
    console.error(`[hiui-design][sync-profile-contract-suite] failed (${failed.length}/${results.length} profiles)`)
    for (const result of failed) {
      console.error(`- ${result.profileId}: ${result.issues.join('; ')}`)
    }
  }

  if (summary.status !== 'passed') {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
