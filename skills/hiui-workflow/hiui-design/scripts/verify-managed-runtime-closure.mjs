#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { getContextScriptPath } from './lib/skill-identity.mjs'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..')
const DEFAULT_RUNTIME_ROOT = path.join(
  SKILL_ROOT,
  'examples',
  'host-integration',
  'src',
  'components',
  'hiui-design-runtime'
)
const CHECKED_FILE_PATTERNS = [
  /\.d\.ts$/,
  /\.(js|jsx|ts|tsx)$/,
]
const REQUIRED_GLOBAL_TYPE_NAMES = ['AnyObject', 'UnknownObject']
const RISKY_GLOBAL_TYPES = ['AddEventListenerOptions']

function printUsage() {
  console.log(`Usage:
  node ${getContextScriptPath('verify-managed-runtime-closure.mjs')} [--runtime-root <dir>] [--json]

Options:
  --runtime-root  Override the managed runtime source root. Defaults to the built-in host-integration runtime source.
  --json          Print the full JSON report.`)
}

function normalizePath(targetPath) {
  return targetPath.split(path.sep).join('/')
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function parseArgs(argv) {
  const options = {
    runtimeRoot: DEFAULT_RUNTIME_ROOT,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--runtime-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --runtime-root')
      options.runtimeRoot = path.resolve(value)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
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

async function collectRuntimeFiles(rootDir, out = []) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      await collectRuntimeFiles(absPath, out)
      continue
    }

    if (CHECKED_FILE_PATTERNS.some((pattern) => pattern.test(entry.name))) {
      out.push(absPath)
    }
  }

  return out
}

function extractImportSpecifiers(source) {
  const patterns = [
    /(?:import|export)\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
  ]
  const specifiers = new Set()

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      specifiers.add(match[1])
    }
  }

  return [...specifiers]
}

async function resolveRelativeImport(fromFile, specifier) {
  const basePath = path.resolve(path.dirname(fromFile), specifier)
  if (path.extname(specifier)) {
    return (await pathExists(basePath)) ? basePath : ''
  }

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.d.ts`,
    `${basePath}.scss`,
    `${basePath}.css`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.jsx'),
    path.join(basePath, 'index.d.ts'),
    path.join(basePath, 'index.scss'),
    path.join(basePath, 'index.css'),
  ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate
    }
  }

  return ''
}

function findTokenLines(source, token) {
  const lines = source.split('\n')
  const matches = []
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].includes(token)) {
      matches.push(index + 1)
    }
  }
  return matches
}

async function buildClosureReport(runtimeRoot) {
  const report = {
    status: 'pass',
    runtimeRoot,
    fileCount: 0,
    unresolvedImports: [],
    missingGlobalTypeDefinitions: [],
    styleDeclarationImports: [],
    riskyGlobalTypeUsage: [],
  }

  if (!(await pathExists(runtimeRoot))) {
    return {
      ...report,
      status: 'fail',
      reason: `Managed runtime root does not exist: ${runtimeRoot}`,
    }
  }

  const files = await collectRuntimeFiles(runtimeRoot)
  report.fileCount = files.length

  const globalsPath = path.join(runtimeRoot, 'globals.d.ts')
  const globalsSource = (await pathExists(globalsPath))
    ? await fs.readFile(globalsPath, 'utf8')
    : ''

  for (const typeName of REQUIRED_GLOBAL_TYPE_NAMES) {
    const typePattern = new RegExp(`\\btype\\s+${typeName}\\s*=`)
    const valuePattern = new RegExp(`\\bdeclare\\s+const\\s+${typeName}\\s*:`)
    if (!typePattern.test(globalsSource) || !valuePattern.test(globalsSource)) {
      report.missingGlobalTypeDefinitions.push({
        typeName,
        globalsPath: normalizePath(globalsPath),
      })
    }
  }

  for (const filePath of files) {
    const relativePath = normalizePath(path.relative(runtimeRoot, filePath))
    const source = await fs.readFile(filePath, 'utf8')
    const isDeclarationFile = filePath.endsWith('.d.ts')

    for (const specifier of extractImportSpecifiers(source)) {
      if (!specifier.startsWith('.')) continue

      const resolvedPath = await resolveRelativeImport(filePath, specifier)
      if (!resolvedPath) {
        report.unresolvedImports.push({
          filePath: relativePath,
          specifier,
        })
      }

      if (isDeclarationFile && /\.module\.scss$/.test(specifier)) {
        report.styleDeclarationImports.push({
          filePath: relativePath,
          specifier,
        })
      }
    }

    for (const token of RISKY_GLOBAL_TYPES) {
      const lines = findTokenLines(source, token)
      if (lines.length === 0) continue
      report.riskyGlobalTypeUsage.push({
        filePath: relativePath,
        token,
        lines,
      })
    }
  }

  const hasFailures =
    report.unresolvedImports.length > 0 ||
    report.missingGlobalTypeDefinitions.length > 0 ||
    report.styleDeclarationImports.length > 0 ||
    report.riskyGlobalTypeUsage.length > 0

  return {
    ...report,
    status: hasFailures ? 'fail' : 'pass',
  }
}

function formatHumanReport(report) {
  const lines = [
    `managedRuntimeClosure.status=${report.status}`,
    `managedRuntimeClosure.runtimeRoot=${report.runtimeRoot}`,
    `managedRuntimeClosure.fileCount=${report.fileCount}`,
    `managedRuntimeClosure.unresolvedImports=${report.unresolvedImports.length}`,
    `managedRuntimeClosure.missingGlobalTypeDefinitions=${report.missingGlobalTypeDefinitions.length}`,
    `managedRuntimeClosure.styleDeclarationImports=${report.styleDeclarationImports.length}`,
    `managedRuntimeClosure.riskyGlobalTypeUsage=${report.riskyGlobalTypeUsage.length}`,
  ]

  if (report.reason) {
    lines.push(`managedRuntimeClosure.reason=${report.reason}`)
  }

  return `${lines.join('\n')}\n`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const report = await buildClosureReport(options.runtimeRoot)

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    process.stdout.write(formatHumanReport(report))
  }

  if (report.status !== 'pass') {
    process.exitCode = 1
  }
}

await main()
