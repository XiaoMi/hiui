#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { defaultLockPath, resolveBundleConfig } from './lib/workflow-bundle.mjs'
import {
  backupRootForTarget,
  decideAction,
  defaultTargetRoot,
  resolveInstalledSkillState,
  replacementActions,
  resolveRequestedSkill,
  rollbackActions,
  writeJournal,
} from './lib/workflow-install.mjs'

function parseArgs(argv) {
  const options = {
    allowDowngrade: false,
    dryRun: false,
    forceSync: false,
    json: false,
    lockfile: '',
    reinstall: false,
    target: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--allow-downgrade') {
      options.allowDowngrade = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--force-sync') {
      options.forceSync = true
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--reinstall') {
      options.reinstall = true
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
      console.log('Usage: node scripts/install-workflow-bundle.mjs [--lockfile <path>] [--target <skills-dir>] [--dry-run] [--reinstall] [--force-sync] [--allow-downgrade] [--json]')
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function removePathIfExists(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true }).catch(() => {})
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const config = await resolveBundleConfig(options.lockfile || defaultLockPath)
  const targetRoot = path.resolve(options.target || defaultTargetRoot())
  const replacementSet = replacementActions()
  const decisions = []
  const report = {
    status: 'planned',
    bundleName: config.lock.bundleName,
    bundleVersion: config.lock.bundleVersion,
    targetRoot,
    dryRun: options.dryRun,
    forceSync: options.forceSync,
    allowDowngrade: options.allowDowngrade,
    reinstall: options.reinstall,
    decisions: [],
  }
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'workflow-bundle-'))
  const stagingRoot = path.join(tempRoot, 'staged')
  await ensureDirectory(stagingRoot)

  try {
    for (const entry of config.lock.skills) {
      const resolvedEntry = await resolveRequestedSkill(entry, config.lockDir, stagingRoot)
      const targetDir = path.join(targetRoot, resolvedEntry.installName)
      const installedState = await resolveInstalledSkillState(resolvedEntry, targetRoot)
      const installed = installedState.installed
      const decision = decideAction(resolvedEntry, installed, config.installPolicy, options)
      decisions.push({
        ...resolvedEntry,
        decision,
        installed,
        targetDir,
        cleanupLegacyInstalls: installedState.cleanupLegacyInstalls,
      })
    }

    report.decisions = decisions.map((entry) => ({
      name: entry.name,
      installName: entry.installName,
      version: entry.requestedVersion,
      declaredVersion: entry.version,
      versionMode: entry.versionMode,
      action: entry.decision.action,
      reason: entry.decision.reason,
      installedVersion: entry.installed.version || '',
      installedDir: entry.installed.targetDir || '',
      installedSource: entry.installed.source || 'missing',
      cleanupLegacyInstalls: entry.cleanupLegacyInstalls.map((legacyInstall) => ({
        installName: legacyInstall.installName,
        targetDir: legacyInstall.targetDir,
        version: legacyInstall.version || '',
      })),
      targetDir: entry.targetDir,
    }))

    if (options.dryRun) {
      if (options.json) {
        console.log(JSON.stringify(report, null, 2))
      } else {
        console.log(`Workflow bundle install plan: ${report.bundleName}@${report.bundleVersion}`)
        for (const decision of report.decisions) {
          const suffix = decision.installedVersion ? ` (installed ${decision.installedVersion})` : ''
          const versionLabel = decision.versionMode === 'follow-source-manifest'
            ? `${decision.version} via source manifest`
            : decision.version
          console.log(`- ${decision.name}@${versionLabel}: ${decision.action}${suffix}`)
          console.log(`  - ${decision.reason}`)
        }
      }
      return
    }

    const stagedEntries = []
    for (const entry of decisions) {
      if (!replacementSet.has(entry.decision.action)) {
        continue
      }
      stagedEntries.push({
        ...entry,
      })
    }

    await ensureDirectory(targetRoot)
    const backupRoot = backupRootForTarget(targetRoot)
    const journal = {
      schemaVersion: 1,
      bundleName: config.lock.bundleName,
      bundleVersion: config.lock.bundleVersion,
      targetRoot,
      backupRoot,
      createdAt: new Date().toISOString(),
      actions: [],
    }

    try {
      for (const entry of decisions) {
        for (const legacyInstall of entry.cleanupLegacyInstalls) {
          const backupDir = path.join(backupRoot, legacyInstall.installName)
          await ensureDirectory(path.dirname(backupDir))
          await fs.rename(legacyInstall.targetDir, backupDir)
          journal.actions.push({
            kind: 'cleanup-legacy-install',
            name: entry.name,
            installName: entry.installName,
            legacyInstallName: legacyInstall.installName,
            backupDir,
            restoreDir: legacyInstall.targetDir,
          })
        }
      }

      for (const entry of stagedEntries) {
        const backupInstallName = entry.installed.exists
          ? entry.installed.installName || entry.installName
          : ''
        const backupDir = entry.installed.exists ? path.join(backupRoot, backupInstallName) : ''
        if (entry.installed.exists) {
          await ensureDirectory(path.dirname(backupDir))
          await fs.rename(entry.installed.targetDir, backupDir)
        }
        await ensureDirectory(path.dirname(entry.targetDir))
        await fs.rename(entry.stagedDir, entry.targetDir)
        journal.actions.push({
          kind: 'replace-skill',
          name: entry.name,
          installName: entry.installName,
          action: entry.decision.action,
          targetDir: entry.targetDir,
          restoreDir: entry.installed.targetDir || entry.targetDir,
          backupDir,
          installedVersion: entry.installed.version || '',
          targetVersion: entry.requestedVersion,
        })
      }
    } catch (error) {
      const rollbackFailures = await rollbackActions(journal)
      const detail = error instanceof Error ? error.message : String(error)
      const rollbackDetail = rollbackFailures.length
        ? ` Rollback failures: ${JSON.stringify(rollbackFailures)}`
        : ''
      throw new Error(`install failed: ${detail}.${rollbackDetail}`)
    }

    const journalPath = await writeJournal(backupRoot, journal)
    report.status = 'applied'
    report.backupRoot = backupRoot
    report.journalPath = journalPath
  } finally {
    await removePathIfExists(tempRoot)
  }

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log(`Workflow bundle installed: ${report.bundleName}@${report.bundleVersion}`)
  console.log(`- target: ${report.targetRoot}`)
  if (report.journalPath) {
    console.log(`- journal: ${report.journalPath}`)
  }
  for (const decision of report.decisions) {
    const suffix = decision.installedVersion ? ` (installed ${decision.installedVersion})` : ''
    const versionLabel = decision.versionMode === 'follow-source-manifest'
      ? `${decision.version} via source manifest`
      : decision.version
    console.log(`- ${decision.name}@${versionLabel}: ${decision.action}${suffix}`)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`install-workflow-bundle failed: ${message}`)
  process.exit(1)
})
