#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { syncArchetypeAssets } from './lib/archetypes/sync-archetype-assets.mjs'

function parseMajorVersion(spec) {
  const match = String(spec || '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

function inferMode(pkg, hostProfile, requestedMode) {
  if (requestedMode && requestedMode !== 'auto') {
    return requestedMode
  }

  const dependencies = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
    ...(pkg?.peerDependencies ?? {}),
  }

  const reactMajor = parseMajorVersion(dependencies.react)
  const reactDomMajor = parseMajorVersion(dependencies['react-dom'])
  const hiuiMajor = parseMajorVersion(dependencies['@hi-ui/hiui'])
  const hasHiui5Alias = Boolean(dependencies.hiui5)

  if (
    (reactMajor > 0 && reactMajor < 18) ||
    (reactDomMajor > 0 && reactDomMajor < 18) ||
    (hasHiui5Alias && hiuiMajor > 0 && hiuiMajor < 5)
  ) {
    return 'legacy-host-compatible'
  }

  return hostProfile?.recommendedMode || 'rules-only'
}

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/init-archetypes.mjs" [--target <project-root>] [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--force]
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    mode: 'auto',
    force: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--target' || arg === '--mode') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--mode') options.mode = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (
    !['auto', 'rules-only', 'host-integration', 'legacy-host-compatible'].includes(options.mode)
  ) {
    throw new Error(
      'Expected --mode to be auto, rules-only, host-integration, or legacy-host-compatible'
    )
  }

  return options
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const hostProfile = await detectHostProfile(options.target)
    const mode = inferMode(hostProfile.pkg, hostProfile, options.mode)
    const result = await syncArchetypeAssets({
      skillRoot,
      targetRoot: options.target,
      mode,
      force: options.force,
    })

    console.log('Archetype assets synced.')
    console.log(`- target: ${options.target}`)
    console.log(`- mode: ${mode}`)
    console.log(`- dest: ${result.destRoot}`)
    console.log(`- copied files: ${result.copiedFiles.length}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`init-archetypes failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
