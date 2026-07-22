#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  compareVersions,
  defaultLockPath,
  pathExists,
  readJson,
  requestedVersionForEntry,
  resolveBundleConfig,
  validateSkillManifest,
} from './lib/workflow-bundle.mjs'
import { resolveTargetDescriptor } from './lib/workflow-hosts.mjs'
import { resolveRequestedSkill } from './lib/workflow-install.mjs'

function parseArgs(argv) {
  const options = {
    host: '',
    json: false,
    lockfile: '',
    target: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--host') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --host')
      options.host = value
      index += 1
      continue
    }

    if (arg === '--lockfile') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --lockfile')
      options.lockfile = value
      index += 1
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/verify-workflow-bundle.mjs [--lockfile <path>] [--host <host-name>] [--target <skills-dir>] [--json]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const config = await resolveBundleConfig(options.lockfile || defaultLockPath)
  const skills = []
  const targetResolution = resolveTargetDescriptor({
    host: options.host,
    target: options.target,
    purpose: 'verify',
  }, config.hostProfiles)
  const targetRoot = targetResolution.targetRoot
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'workflow-bundle-verify-'))
  const stagingRoot = path.join(tempRoot, 'staged')
  await fs.mkdir(stagingRoot, { recursive: true })

  try {
    for (const entry of config.lock.skills) {
      const issues = []
      let resolved = null

      try {
        resolved = await resolveRequestedSkill(entry, config.lockDir, stagingRoot)
      } catch (error) {
        issues.push(error instanceof Error ? error.message : String(error))
      }

      const requestedVersion = requestedVersionForEntry(resolved || entry)

      let installed = null
      if (targetRoot) {
        const installName = resolved?.installName || entry.installName
        const targetDir = path.join(targetRoot, installName)
        const manifestPath = path.join(targetDir, 'skill.manifest.json')
        const exists = await pathExists(targetDir)
        installed = {
          installName,
          targetDir,
          exists,
          manifestPath,
          status: exists ? 'missing-manifest' : 'missing',
          version: '',
        }

        if (exists && await pathExists(manifestPath)) {
          const manifest = await readJson(manifestPath)
          validateSkillManifest(manifest, manifestPath)
          const versionComparison = compareVersions(manifest.version, requestedVersion)
          if (versionComparison === 0) {
            installed.status = 'matched'
          } else if (
            versionComparison > 0 &&
            config.installPolicy.defaultPolicy.onNewerVersion === 'keep'
          ) {
            installed.status = 'kept-newer'
            installed.version = manifest.version
          } else {
            installed.status = 'version-mismatch'
          }
          installed.version = manifest.version
          if (manifest.name !== (resolved?.name || entry.name)) {
            issues.push(`installed manifest name mismatch: ${manifest.name}`)
          }
          if (
            installed.status === 'version-mismatch' &&
            manifest.version !== requestedVersion
          ) {
            issues.push(`installed manifest version mismatch: ${manifest.version}`)
          }
        } else if (exists) {
          issues.push(`installed manifest is missing: ${manifestPath}`)
        } else {
          issues.push(`installed target is missing: ${targetDir}`)
        }
      }

      skills.push({
        name: resolved?.name || entry.name,
        installName: resolved?.installName || entry.installName,
        required: resolved?.required ?? entry.required,
        version: requestedVersion,
        declaredVersion: entry.version,
        versionMode: resolved?.versionMode || entry.versionPolicy || 'locked',
        sourceKind: resolved?.source?.kind || entry.source.kind,
        sourceRoot: resolved?.sourceRoot || '',
        manifestPath: resolved ? path.join(resolved.stagedDir, entry.manifestPath) : '',
        status: issues.length === 0 ? 'passed' : 'failed',
        issues,
        installed,
      })
    }

    const report = {
      status: skills.every((skill) => skill.status === 'passed') ? 'passed' : 'failed',
      lockfile: config.lockPath,
      bundleName: config.lock.bundleName,
      bundleVersion: config.lock.bundleVersion,
      host: targetResolution.host,
      targetResolution: targetResolution.resolution,
      targetRoot,
      installPolicy: path.basename(config.installPolicyPath),
      compatibilityMatrix: path.basename(config.compatibilityMatrixPath),
      skills,
    }

    if (options.json) {
      console.log(JSON.stringify(report, null, 2))
      return
    }

    console.log(`Workflow bundle verification: ${report.status}`)
    console.log(`- bundle: ${report.bundleName}@${report.bundleVersion}`)
    console.log(`- lockfile: ${report.lockfile}`)
    for (const skill of skills) {
      const versionLabel = skill.versionMode === 'follow-source-manifest'
        ? `${skill.version} via source manifest`
        : skill.version
      console.log(`- ${skill.name}@${versionLabel}: ${skill.status}`)
      for (const issue of skill.issues) {
        console.log(`  - ${issue}`)
      }
    }

    if (report.status !== 'passed') {
      process.exitCode = 1
    }
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true }).catch(() => {})
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`verify-workflow-bundle failed: ${message}`)
  process.exit(1)
})
