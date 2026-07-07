#!/usr/bin/env node

import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { autoLaunchHostIntegrationPreview } from './lib/host-integration-browser-launch.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--line <line-id>] [--with-host-assets] [--dest <relative-dir>] [--route-file <relative-file>] [--shells-spec <version>] [--install] [--no-install] [--install-timeout-ms <ms>] [--force] [--init-i18n] [--skip-i18n-init] [--skip-project-images-init] [--skip-open-browser]

Default behavior:
  - target project: current working directory
  - dependency install: enabled
  - mode: auto
  - do not provision src/translation i18n baseline unless --init-i18n is passed
  - auto-provision src/typical-page-reuse/assets project image catalog scaffold unless --skip-project-images-init is passed
  - after a successful host-integration bootstrap, auto-start a local dev server when needed and open the first typical-page sample unless --skip-open-browser is passed
`)
}

function parseArgs(argv) {
  const passthrough = []
  let dest = 'src/typical-page-reuse'
  let install = true
  let skipOpenBrowser = false

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--install') {
      install = true
      continue
    }

    if (arg === '--no-install') {
      install = false
      continue
    }

    if (arg === '--skip-open-browser') {
      skipOpenBrowser = true
      continue
    }

    if (arg === '--with-host-assets') {
      passthrough.push('--mode', 'host-integration')
      continue
    }

    if (arg === '--with-reference-assets') {
      passthrough.push('--mode', 'rules-only')
      continue
    }

    if (
      arg === '--mode' ||
      arg === '--line' ||
      arg === '--dest' ||
      arg === '--route-file' ||
      arg === '--shells-spec' ||
      arg === '--install-timeout-ms'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      passthrough.push(arg, value)
      if (arg === '--dest') {
        dest = value
      }
      i += 1
      continue
    }

    if (arg === '--force' || arg === '--init-i18n' || arg === '--skip-i18n-init' || arg === '--skip-project-images-init') {
      passthrough.push(arg)
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { dest, install, passthrough, skipOpenBrowser }
}

async function main() {
  try {
    const { dest, install, passthrough, skipOpenBrowser } = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const bootstrapScript = path.join(scriptDir, 'bootstrap-target-project.mjs')
    const args = [bootstrapScript, '--target', process.cwd(), ...passthrough]

    if (install) {
      args.push('--install')
    }

    const result = spawnSync(process.execPath, args, {
      stdio: 'inherit',
    })

    if (result.error) {
      throw result.error
    }

    if ((result.status ?? 1) === 0 && !skipOpenBrowser) {
      const launchResult = await autoLaunchHostIntegrationPreview({
        targetRoot: process.cwd(),
        outputRootRelative: dest,
        logger: console,
      })

      if (launchResult.status === 'not-applicable') {
        // no-op: this run did not end in an auto-launchable host-integration setup
      } else if (launchResult.status !== 'skipped') {
        console.log(`- host-integration preview: ${launchResult.status}`)
        if (launchResult.url) {
          console.log(`  url: ${launchResult.url}`)
        }
      } else if (launchResult.detail) {
        console.log(`- host-integration preview: skipped (${launchResult.detail})`)
      }
    }

    process.exit(result.status ?? 0)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`apply-in-current-project failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
