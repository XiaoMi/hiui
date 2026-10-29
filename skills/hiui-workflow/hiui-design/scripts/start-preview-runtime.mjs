#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE,
  DEFAULT_PREVIEW_RUNTIME_HOST,
  DEFAULT_PREVIEW_RUNTIME_PORT,
  buildPreviewRuntimeBaseUrl,
  buildPreviewRuntimeExampleUrl,
} from './lib/preview-runtime.mjs'

function printUsage() {
  console.log(`Usage:
  node scripts/start-preview-runtime.mjs [--host <host>] [--port <port>] [--strict-port] [--install] [--no-install] [--install-only] [-- <extra vite args>]

Options:
  --host         Vite dev server host. Default: ${DEFAULT_PREVIEW_RUNTIME_HOST}
  --port         Vite dev server port. Default: ${DEFAULT_PREVIEW_RUNTIME_PORT}
  --strict-port  Forward --strictPort to Vite.
  --install      Ensure preview-runtime dependencies are installed before start. Default: true.
  --no-install   Skip dependency installation check.
  --install-only Install dependencies and exit without starting the dev server.
`)
}

function parseArgs(argv) {
  const options = {
    host: DEFAULT_PREVIEW_RUNTIME_HOST,
    port: DEFAULT_PREVIEW_RUNTIME_PORT,
    strictPort: false,
    install: true,
    installOnly: false,
    extraArgs: [],
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') {
      options.extraArgs.push(...argv.slice(index + 1))
      break
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    if (arg === '--strict-port') {
      options.strictPort = true
      continue
    }

    if (arg === '--install') {
      options.install = true
      continue
    }

    if (arg === '--no-install') {
      options.install = false
      continue
    }

    if (arg === '--install-only') {
      options.installOnly = true
      continue
    }

    if (arg === '--host' || arg === '--port') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options[arg === '--host' ? 'host' : 'port'] = value
      index += 1
      continue
    }

    options.extraArgs.push(arg)
  }

  return options
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function getViteBinPath(runtimeRoot) {
  return path.join(runtimeRoot, 'node_modules', 'vite', 'bin', 'vite.js')
}

async function ensureExampleDependencyBridge(skillRoot, runtimeRoot) {
  const examplesRoot = path.join(skillRoot, 'examples', 'host-integration')
  const bridgePath = path.join(examplesRoot, 'node_modules')
  const targetPath = path.join(runtimeRoot, 'node_modules')
  const relativeTarget = path.relative(examplesRoot, targetPath)

  let bridgeStat = null
  try {
    bridgeStat = await fs.lstat(bridgePath)
  } catch (error) {
    if (error && typeof error === 'object' && error.code !== 'ENOENT') {
      throw error
    }
  }

  if (!bridgeStat) {
    await fs.symlink(
      relativeTarget,
      bridgePath,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    return 'created'
  }

  if (bridgeStat.isSymbolicLink()) {
    const currentTarget = await fs.readlink(bridgePath)
    const resolvedCurrentTarget = path.resolve(examplesRoot, currentTarget)
    if (resolvedCurrentTarget === targetPath) {
      return 'reused-symlink'
    }

    await fs.rm(bridgePath, { recursive: true, force: true })
    await fs.symlink(
      relativeTarget,
      bridgePath,
      process.platform === 'win32' ? 'junction' : 'dir',
    )
    return 'repaired-symlink'
  }

  if (bridgeStat.isDirectory()) {
    return 'existing-directory'
  }

  throw new Error(
    `examples/host-integration/node_modules exists but is not a directory or symlink: ${bridgePath}`,
  )
}

async function ensureInstalled(runtimeRoot) {
  const requiredPaths = [
    getViteBinPath(runtimeRoot),
    path.join(runtimeRoot, 'node_modules', 'hiui5', 'package.json'),
    path.join(runtimeRoot, 'node_modules', 'hiui5-table', 'package.json'),
    path.join(runtimeRoot, 'node_modules', 'hiui5-descriptions', 'package.json'),
  ]

  const dependenciesReady = await Promise.all(requiredPaths.map((targetPath) => pathExists(targetPath)))
  if (dependenciesReady.every(Boolean)) {
    return {
      installed: true,
      installedNow: false,
    }
  }

  const result = spawnSync(getNpmCommand(), ['install'], {
    cwd: runtimeRoot,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    throw new Error('preview-runtime dependency install failed')
  }

  return {
    installed: true,
    installedNow: true,
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const runtimeRoot = path.join(skillRoot, 'preview-runtime')

    if (!(await pathExists(path.join(runtimeRoot, 'package.json')))) {
      throw new Error(`preview-runtime package.json is missing under ${runtimeRoot}`)
    }

    if (options.install) {
      await ensureInstalled(runtimeRoot)
    }

    const bridgeMode = await ensureExampleDependencyBridge(skillRoot, runtimeRoot)
    if (bridgeMode === 'created' || bridgeMode === 'repaired-symlink') {
      console.log(
        `preview-runtime dependency bridge ready: examples/host-integration/node_modules -> ../../preview-runtime/node_modules (${bridgeMode})`,
      )
    } else if (bridgeMode === 'existing-directory') {
      console.warn(
        'preview-runtime warning: examples/host-integration/node_modules already exists as a directory; reusing it instead of replacing it with a symlink bridge.',
      )
    }

    if (options.installOnly) {
      console.log(`preview-runtime dependencies are ready: ${runtimeRoot}`)
      return
    }

    const previewBaseUrl = buildPreviewRuntimeBaseUrl({
      host: options.host,
      port: options.port,
    })
    const previewExampleUrl = buildPreviewRuntimeExampleUrl({
      host: options.host,
      port: options.port,
      route: DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE,
    })
    console.log(`preview-runtime url: ${previewBaseUrl}`)
    console.log(
      `preview-runtime example: ${previewExampleUrl} (default route ${DEFAULT_PREVIEW_RUNTIME_EXAMPLE_ROUTE})`,
    )

    const viteArgs = [getViteBinPath(runtimeRoot), '--host', options.host, '--port', options.port]
    if (options.strictPort) viteArgs.push('--strictPort')
    viteArgs.push(...options.extraArgs)

    const child = spawn(process.execPath, viteArgs, {
      cwd: runtimeRoot,
      stdio: 'inherit',
    })

    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal)
        return
      }
      process.exit(code ?? 0)
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`start-preview-runtime failed: ${message}`)
    process.exit(1)
  }
}

await main()
