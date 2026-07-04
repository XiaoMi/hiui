#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const DEFAULT_PUBLIC_NPM_REGISTRY = 'https://registry.npmjs.org'

function parseArgs(argv) {
  const options = {
    json: false,
    publicRoot: '',
    registry: '',
    sourceRoot: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--public-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --public-root')
      options.publicRoot = value
      index += 1
      continue
    }

    if (arg === '--registry') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --registry')
      options.registry = value
      index += 1
      continue
    }

    if (arg === '--source-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --source-root')
      options.sourceRoot = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/check-public-runtime-publish-readiness.mjs [--source-root <skill-root>] [--public-root <open-source-root>] [--registry <registry-url>] [--json]

Checks that the vendored typical-page-shells snapshot and generated public package agree, and that the public package can be packed and published in dry-run mode before a real npm publish.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function readJson(targetPath) {
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

async function findVendoredTarball(sourceRoot, tarballDirectory, tarballPattern) {
  const vendorRoot = path.join(sourceRoot, tarballDirectory)
  const pattern = new RegExp(tarballPattern)
  const entries = await fs.readdir(vendorRoot)
  const matches = entries.filter((entry) => pattern.test(entry)).sort()
  if (matches.length === 0) {
    throw new Error(`Missing vendored runtime tarball under ${path.relative(sourceRoot, vendorRoot) || tarballDirectory}`)
  }
  return path.join(vendorRoot, matches[matches.length - 1])
}

function runNpm(args, cwd, registry) {
  const result = spawnSync('npm', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_registry: registry,
    },
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.status !== 0) {
    const failureText = [result.stderr, result.stdout].filter(Boolean).join('\n').trim()
    throw new Error(failureText || `npm ${args.join(' ')} failed`)
  }

  return result
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const sourceRoot = path.resolve(options.sourceRoot || path.join(scriptDir, '..'))
  const publicRoot = path.resolve(options.publicRoot || sourceRoot)
  const policy = await readJson(path.join(sourceRoot, 'rules', 'runtime-delivery-policy.json'))
  const registry =
    String(options.registry || policy.runtimePackage.publicRegistry || DEFAULT_PUBLIC_NPM_REGISTRY).trim() ||
    DEFAULT_PUBLIC_NPM_REGISTRY
  const runtimePackage = policy.runtimePackage
  const releaseGate = policy.releaseGates['public-runtime-publish-readiness']
  const snapshot = await readJson(path.join(sourceRoot, runtimePackage.vendorSnapshotManifest))
  const publicPackageRoot = path.join(publicRoot, runtimePackage.publicPackageRoot)
  const publicPackageJsonPath = path.join(publicPackageRoot, 'package.json')
  const vendoredTarballPath = await findVendoredTarball(
    sourceRoot,
    runtimePackage.vendoredTarballDirectory,
    runtimePackage.vendoredTarballPattern
  )
  const publicPackage = await readJson(publicPackageJsonPath)

  const checks = []

  checks.push({
    check: 'vendor-snapshot-manifest-present',
    status: 'passed',
    path: path.relative(sourceRoot, path.join(sourceRoot, runtimePackage.vendorSnapshotManifest)),
  })
  checks.push({
    check: 'vendored-tarball-present',
    status: 'passed',
    path: path.relative(sourceRoot, vendoredTarballPath),
  })
  checks.push({
    check: 'public-package-root-present',
    status: 'passed',
    path: path.relative(publicRoot, publicPackageJsonPath),
  })

  if (snapshot.name !== runtimePackage.packageName) {
    throw new Error(`Vendored snapshot package name mismatch: expected ${runtimePackage.packageName}, received ${snapshot.name}`)
  }

  if (publicPackage.name !== runtimePackage.packageName) {
    throw new Error(`Public package name mismatch: expected ${runtimePackage.packageName}, received ${publicPackage.name}`)
  }

  if (snapshot.version !== publicPackage.version) {
    throw new Error(
      `Vendored snapshot version ${snapshot.version} does not match public package version ${publicPackage.version}`
    )
  }

  checks.push({
    check: 'snapshot-version-matches-public-package-version',
    status: 'passed',
    version: publicPackage.version,
  })

  runNpm(['pack', '--dry-run'], publicPackageRoot, registry)
  checks.push({
    check: 'npm-pack-dry-run-passes',
    status: 'passed',
  })

  runNpm(['publish', '--dry-run', '--access', 'public'], publicPackageRoot, registry)
  checks.push({
    check: 'npm-publish-dry-run-passes',
    status: 'passed',
  })

  const report = {
    status: 'passed',
    sourceRoot,
    publicRoot,
    packageName: runtimePackage.packageName,
    registry,
    version: publicPackage.version,
    requiredChecks: releaseGate.requiredChecks,
    checks,
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`Public runtime publish readiness: ${report.status}`)
    console.log(`- package: ${report.packageName}@${report.version}`)
    console.log(`- registry: ${report.registry}`)
    console.log(`- source root: ${sourceRoot}`)
    console.log(`- public root: ${publicRoot}`)
    for (const entry of checks) {
      console.log(`- ${entry.check}: ${entry.status}`)
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  if (process.argv.includes('--json')) {
    console.error(JSON.stringify({ error: { message } }, null, 2))
  }
  console.error(`check-public-runtime-publish-readiness failed: ${message}`)
  process.exit(1)
})
