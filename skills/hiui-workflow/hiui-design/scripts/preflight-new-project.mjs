#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/preflight-new-project.mjs" [--target <project-root>] [--create-vite-version <version>] [--json]

Default behavior:
  - target project: current working directory
  - verify local Node/package-manager/TypeScript/ESLint readiness
  - when --create-vite-version is passed, verify that create-vite version exists on npm
`)
}

function parseArgs(argv) {
  const options = {
    createViteVersion: '',
    json: false,
    line: '',
    target: process.cwd(),
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--target' || arg === '--create-vite-version' || arg === '--line') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--target') options.target = value
      if (arg === '--create-vite-version') options.createViteVersion = value
      if (arg === '--line') options.line = value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
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

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function stripJsonComments(source) {
  return String(source || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function parseNodeVersion(versionText) {
  const match = String(versionText || '').match(/v?(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

function isAtLeast(version, major, minor = 0, patch = 0) {
  if (!version) return false
  if (version.major !== major) return version.major > major
  if (version.minor !== minor) return version.minor > minor
  return version.patch >= patch
}

function detectPackageManager(pkg, files) {
  const packageManager = typeof pkg?.packageManager === 'string' ? pkg.packageManager : ''
  if (packageManager.startsWith('pnpm@')) return { manager: 'pnpm', source: 'packageManager' }
  if (packageManager.startsWith('yarn@')) return { manager: 'yarn', source: 'packageManager' }
  if (packageManager.startsWith('npm@')) return { manager: 'npm', source: 'packageManager' }
  if (packageManager.startsWith('bun@')) return { manager: 'bun', source: 'packageManager' }
  if (files.has('pnpm-lock.yaml')) return { manager: 'pnpm', source: 'lockfile' }
  if (files.has('yarn.lock')) return { manager: 'yarn', source: 'lockfile' }
  if (files.has('package-lock.json')) return { manager: 'npm', source: 'lockfile' }
  if (files.has('bun.lock') || files.has('bun.lockb')) return { manager: 'bun', source: 'lockfile' }
  return { manager: 'npm', source: 'fallback' }
}

function npmCreateViteVersionExists(version) {
  if (!version) return { checked: false, ok: true, detail: 'No create-vite version requested.' }

  const result = spawnSync('npm', ['view', 'create-vite', 'versions', '--json'], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  })

  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr?.trim() || result.stdout?.trim() || 'npm view create-vite versions failed'
    return { checked: true, ok: false, detail }
  }

  let versions = []
  try {
    versions = JSON.parse(result.stdout)
  } catch (error) {
    return { checked: true, ok: false, detail: `Unable to parse npm view output: ${error.message}` }
  }

  const ok = Array.isArray(versions) && versions.includes(version)
  return {
    checked: true,
    ok,
    detail: ok
      ? `create-vite@${version} exists on npm.`
      : `create-vite@${version} does not exist on npm. Pick an existing version before scaffolding.`,
  }
}

async function detectTsStrict(targetRoot) {
  const candidates = ['tsconfig.json', 'tsconfig.app.json']
  for (const candidate of candidates) {
    const filePath = path.join(targetRoot, candidate)
    if (!(await pathExists(filePath))) continue
    const raw = await fs.readFile(filePath, 'utf8')
    try {
      const parsed = JSON.parse(stripJsonComments(raw))
      if (parsed?.compilerOptions?.strict === true) {
        return { strict: true, file: candidate }
      }
    } catch {
      return { strict: false, file: candidate, parseFailed: true }
    }
  }
  return { strict: false, file: '' }
}

async function eslintMentionsTsNoCheckBan(targetRoot) {
  const candidates = [
    '.eslintrc',
    '.eslintrc.json',
    '.eslintrc.js',
    '.eslintrc.cjs',
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
  ]

  for (const candidate of candidates) {
    const filePath = path.join(targetRoot, candidate)
    if (!(await pathExists(filePath))) continue
    const raw = await fs.readFile(filePath, 'utf8')
    if (raw.includes('@typescript-eslint/ban-ts-comment') || raw.includes('ts-nocheck')) {
      return { banned: true, file: candidate }
    }
  }

  return { banned: false, file: '' }
}

function hasFloatingSassSpec(pkg) {
  const spec = pkg?.dependencies?.sass || pkg?.devDependencies?.sass || ''
  return {
    spec,
    floating: /^[~^]/.test(String(spec)),
  }
}

function pushCheck(checks, { id, ok, severity, summary, detail }) {
  checks.push({ id, ok, severity, summary, detail })
}

function summarizeStatus(checks) {
  if (checks.some((check) => !check.ok && check.severity === 'error')) return 'failed'
  if (checks.some((check) => !check.ok && check.severity === 'warn')) return 'warn'
  return 'passed'
}

async function collectPreflight({ targetRoot, createViteVersion }) {
  const targetRootExists = await pathExists(targetRoot)
  const pkg = await readJsonIfExists(path.join(targetRoot, 'package.json'))
  const rootEntries = new Set(targetRootExists ? await fs.readdir(targetRoot) : [])
  const packageManager = detectPackageManager(pkg, rootEntries)
  const nodeVersion = parseNodeVersion(process.version)
  const createVite = npmCreateViteVersionExists(createViteVersion)
  const tsStrict = await detectTsStrict(targetRoot)
  const eslintTsNoCheck = await eslintMentionsTsNoCheckBan(targetRoot)
  const sassSpec = hasFloatingSassSpec(pkg)
  const checks = []

  pushCheck(checks, {
    id: 'target-root',
    ok: targetRootExists,
    severity: 'error',
    summary: 'target project root exists before onboarding preflight',
    detail: targetRootExists ? `Target root exists: ${targetRoot}` : `Target root does not exist: ${targetRoot}`,
  })

  pushCheck(checks, {
    id: 'node-runtime',
    ok: isAtLeast(nodeVersion, 16),
    severity: 'error',
    summary: 'Node runtime can execute the current HiUI design onboarding toolchain',
    detail: nodeVersion
      ? `Detected Node ${process.version}; minimum supported baseline is Node >=16 because the host-integration Sass compiler line requires Node >=16.`
      : `Unable to parse Node version from ${process.version}`,
  })

  pushCheck(checks, {
    id: 'package-manager',
    ok: true,
    severity: 'info',
    summary: 'package manager selection is explicit or safely inferred',
    detail: `${packageManager.manager} selected from ${packageManager.source}`,
  })

  pushCheck(checks, {
    id: 'create-vite-version',
    ok: createVite.ok,
    severity: 'error',
    summary: 'requested create-vite version exists before scaffolding',
    detail: createVite.detail,
  })

  pushCheck(checks, {
    id: 'typescript-strict',
    ok: !tsStrict.strict,
    severity: 'warn',
    summary: 'TypeScript strict mode is known before syncing host-integration assets',
    detail: tsStrict.strict
      ? `${tsStrict.file} has compilerOptions.strict=true. Synced typical-page assets must be strict-safe or isolated from the host compile scope.`
      : tsStrict.file
        ? `${tsStrict.file} does not enable compilerOptions.strict=true.`
        : 'No tsconfig strict signal detected.',
  })

  pushCheck(checks, {
    id: 'eslint-ts-nocheck-policy',
    ok: !eslintTsNoCheck.banned,
    severity: 'warn',
    summary: 'ESLint ts-nocheck policy is known before using temporary TypeScript suppressions',
    detail: eslintTsNoCheck.banned
      ? `${eslintTsNoCheck.file} appears to restrict @ts-nocheck. Do not use @ts-nocheck as a formal hiui-design onboarding fix.`
      : 'No local ESLint ts-nocheck ban signal detected.',
  })

  pushCheck(checks, {
    id: 'sass-version-range',
    ok: !sassSpec.floating,
    severity: 'warn',
    summary: 'Sass dependency does not float into an unverified Node engine line',
    detail: sassSpec.spec
      ? sassSpec.floating
        ? `Detected floating sass spec ${sassSpec.spec}. Use the verified host-integration snapshot version instead of allowing npm to resolve a newer Node >=20-only Sass line.`
        : `Detected pinned sass spec ${sassSpec.spec}.`
      : 'No direct sass dependency declared yet.',
  })

  return {
    schemaVersion: 'hiui-design-new-project-preflight.v1',
    status: summarizeStatus(checks),
    targetRoot,
    createViteVersion: createViteVersion || '',
    checks,
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const report = await collectPreflight({ targetRoot, createViteVersion: options.createViteVersion })

    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
    } else {
      console.log(`HiUI New Project Preflight: ${report.status.toUpperCase()}`)
      console.log(`- target root: ${report.targetRoot}`)
      for (const check of report.checks) {
        const mark = check.ok ? 'PASS' : check.severity.toUpperCase()
        console.log(`[${mark}] ${check.summary}`)
        if (check.detail) console.log(`  ${check.detail}`)
      }
    }

    if (report.status === 'failed') {
      process.exit(1)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`preflight-new-project failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
