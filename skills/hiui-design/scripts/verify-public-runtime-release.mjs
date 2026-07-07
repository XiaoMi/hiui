#!/usr/bin/env node

import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  loadRuntimeDeliveryContext,
  readJson,
  resolveDeclaredVendoredTarball,
  resolvePublicPackagePaths,
} from './lib/runtime-delivery.mjs'

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
      console.log(`Usage: node scripts/verify-public-runtime-release.mjs [--source-root <skill-root>] [--public-root <open-source-root>] [--registry <registry-url>] [--json]

Checks that the vendored typical-page-shells snapshot, the generated public package, and the public npm registry all agree on the released version.
`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function parseNpmViewVersion(stdout) {
  const text = String(stdout || '').trim()
  if (!text) {
    throw new Error('npm view returned empty stdout')
  }

  try {
    const parsed = JSON.parse(text)
    if (typeof parsed === 'string') return parsed
    if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0]
    if (parsed && typeof parsed === 'object' && typeof parsed.version === 'string') return parsed.version
  } catch {
    // Fall back to plain text parsing.
  }

  return text.replace(/^"+|"+$/g, '')
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
  const sourceContext = await loadRuntimeDeliveryContext(sourceRoot)
  const publicContext = await loadRuntimeDeliveryContext(publicRoot)
  const policy = sourceContext.policy
  const registry =
    String(options.registry || sourceContext.runtimePackage.publicRegistry || DEFAULT_PUBLIC_NPM_REGISTRY).trim() ||
    DEFAULT_PUBLIC_NPM_REGISTRY
  const runtimePackage = sourceContext.runtimePackage
  const releaseGate = policy.releaseGates['public-runtime-release']
  const snapshot = sourceContext.snapshot
  const publicSnapshot = publicContext.snapshot
  const sourceVendoredTarball = await resolveDeclaredVendoredTarball(sourceRoot, sourceContext)
  const publicVendoredTarball = await resolveDeclaredVendoredTarball(publicRoot, publicContext)
  const { packageRoot: publicPackageRoot, packageJsonPath: publicPackageJsonPath, packageJsonRelativePath } =
    resolvePublicPackagePaths(publicRoot, publicContext)
  const publicPackage = await readJson(publicPackageJsonPath)

  const checks = []

  checks.push({
    check: 'vendor-snapshot-manifest-present',
    status: 'passed',
    path: sourceContext.snapshotRelativePath,
  })
  checks.push({
    check: 'vendored-tarball-present',
    status: 'passed',
    path: sourceVendoredTarball.relativePath,
  })
  checks.push({
    check: 'public-vendor-snapshot-manifest-present',
    status: 'passed',
    path: publicContext.snapshotRelativePath,
  })
  checks.push({
    check: 'public-vendored-tarball-present',
    status: 'passed',
    path: publicVendoredTarball.relativePath,
  })
  checks.push({
    check: 'public-package-root-present',
    status: 'passed',
    path: packageJsonRelativePath,
  })

  if (snapshot.name !== runtimePackage.packageName) {
    throw new Error(`Vendored snapshot package name mismatch: expected ${runtimePackage.packageName}, received ${snapshot.name}`)
  }

  if (publicSnapshot.name !== runtimePackage.packageName) {
    throw new Error(
      `Public vendored snapshot package name mismatch: expected ${runtimePackage.packageName}, received ${publicSnapshot.name}`
    )
  }

  if (snapshot.version !== publicSnapshot.version) {
    throw new Error(
      `Public vendored snapshot version ${publicSnapshot.version} does not match source vendored snapshot version ${snapshot.version}`
    )
  }

  if (snapshot.runtimeDelivery?.vendoredTarball !== publicSnapshot.runtimeDelivery?.vendoredTarball) {
    throw new Error(
      `Public vendored tarball declaration ${publicSnapshot.runtimeDelivery?.vendoredTarball || '<missing>'} does not match source vendored tarball declaration ${snapshot.runtimeDelivery?.vendoredTarball || '<missing>'}`
    )
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

  const npmViewResult = runNpm(
    ['view', `${runtimePackage.packageName}@${publicPackage.version}`, 'version', '--json'],
    publicPackageRoot,
    registry
  )
  const publishedVersion = parseNpmViewVersion(npmViewResult.stdout)

  if (publishedVersion !== publicPackage.version) {
    throw new Error(
      `npm registry version mismatch: expected ${publicPackage.version}, received ${publishedVersion || 'empty response'}`
    )
  }

  checks.push({
    check: 'npm-registry-has-exact-public-package-version',
    status: 'passed',
    version: publishedVersion,
  })

  runNpm(['pack', '--dry-run'], publicPackageRoot, registry)
  checks.push({
    check: 'npm-pack-dry-run-passes',
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
    console.log(`Public runtime release: ${report.status}`)
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
  console.error(`verify-public-runtime-release failed: ${message}`)
  process.exit(1)
})
