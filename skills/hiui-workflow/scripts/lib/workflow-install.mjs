import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  compareVersions,
  pathExists,
  readJson,
  requestedVersionForEntry,
  resolveSkillEntry,
  validateSkillManifest,
  versionModeForEntry,
} from './workflow-bundle.mjs'

function workflowHome() {
  return process.env.WORKFLOW_HOME || process.env.CODEX_HOME || path.join(os.homedir(), '.codex')
}

function defaultTargetRoot() {
  return process.env.WORKFLOW_SKILLS_HOME
    ? path.resolve(process.env.WORKFLOW_SKILLS_HOME)
    : path.join(workflowHome(), 'skills')
}

function defaultInstallerPath() {
  return path.join(workflowHome(), 'skills', '.system', 'skill-installer', 'scripts', 'install-skill-from-github.py')
}

function timestampLabel() {
  return new Date().toISOString().replaceAll(':', '-')
}

function replacementActions() {
  return new Set(['install', 'upgrade', 'downgrade', 'reinstall', 'backup-and-upgrade'])
}

const COPY_EXCLUDED_NAMES = new Set([
  '.DS_Store',
  '.git',
  '__pycache__',
  '.learnings',
  'outputs',
  'tmp',
])

const COPY_EXCLUDED_EXACT_FILES = new Set([
  '.codex-write-check',
  '.env.release',
  '.env.release.local',
  '.release.env',
  '.release.env.example',
  '.release.env.local',
])

const COPY_EXCLUDED_PREFIXES = [
  '.backup-',
]

const COPY_EXCLUDED_SUFFIXES = [
  '.bak',
  '.pyc',
]

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

function shouldExcludeSegment(segment) {
  if (COPY_EXCLUDED_NAMES.has(segment)) {
    return true
  }
  if (COPY_EXCLUDED_EXACT_FILES.has(segment)) {
    return true
  }
  if (COPY_EXCLUDED_PREFIXES.some((prefix) => segment.startsWith(prefix))) {
    return true
  }
  if (COPY_EXCLUDED_SUFFIXES.some((suffix) => segment.endsWith(suffix))) {
    return true
  }
  if (segment.includes('.bak-')) {
    return true
  }

  return false
}

function shouldCopySkillPath(sourceRoot, sourcePath) {
  const relativePath = path.relative(sourceRoot, sourcePath)

  if (!relativePath || relativePath === '') {
    return true
  }

  const segments = relativePath
    .split(path.sep)
    .filter(Boolean)

  for (const segment of segments) {
    if (shouldExcludeSegment(segment)) {
      return false
    }
  }

  return true
}

async function copySkillTree(sourceRoot, targetDir) {
  await fs.cp(sourceRoot, targetDir, {
    recursive: true,
    errorOnExist: true,
    force: false,
    filter: (sourcePath) => shouldCopySkillPath(sourceRoot, sourcePath),
  })
}

async function readInstalledSkill(targetDir) {
  if (!(await pathExists(targetDir))) {
    return {
      exists: false,
      known: false,
      version: '',
      manifest: null,
      manifestPath: path.join(targetDir, 'skill.manifest.json'),
    }
  }

  const manifestPath = path.join(targetDir, 'skill.manifest.json')
  if (!(await pathExists(manifestPath))) {
    return {
      exists: true,
      known: false,
      version: '',
      manifest: null,
      manifestPath,
    }
  }

  try {
    const manifest = await readJson(manifestPath)
    validateSkillManifest(manifest, manifestPath)
    return {
      exists: true,
      known: true,
      version: manifest.version,
      manifest,
      manifestPath,
    }
  } catch (error) {
    return {
      exists: true,
      known: false,
      version: '',
      manifest: null,
      manifestPath,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function decideAction(entry, installed, policy, options) {
  const defaults = policy.defaultPolicy
  const requestedVersion = requestedVersionForEntry(entry)

  if (!installed.exists) {
    return {
      action: defaults.onMissing,
      reason: 'not installed locally',
    }
  }

  if (!installed.known) {
    return {
      action: defaults.onUnknownVersion,
      reason: installed.error
        ? `installed manifest is unreadable: ${installed.error}`
        : 'installed manifest is missing',
    }
  }

  const comparison = compareVersions(installed.version, requestedVersion)

  if (comparison === 0) {
    if (options.reinstall) {
      return {
        action: 'reinstall',
        reason: 'same version but --reinstall was requested',
      }
    }
    return {
      action: defaults.onSameVersion,
      reason: 'already at requested version',
    }
  }

  if (comparison < 0) {
    return {
      action: defaults.onOlderVersion,
      reason: `installed ${installed.version} is older than requested ${requestedVersion}`,
    }
  }

  if (options.forceSync || options.allowDowngrade) {
    return {
      action: 'downgrade',
      reason: `installed ${installed.version} is newer than requested ${requestedVersion}`,
    }
  }

  return {
    action: defaults.onNewerVersion,
    reason: `installed ${installed.version} is newer than requested ${requestedVersion}`,
  }
}

function installerCommand() {
  return {
    python: process.env.PYTHON_BIN || 'python3',
    script: process.env.CODEX_SKILL_INSTALLER || defaultInstallerPath(),
  }
}

function runInstaller(args) {
  const { python, script } = installerCommand()
  const result = spawnSync(python, [script, ...args], {
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `${python} ${script} failed`)
  }
}

function runGit(args, cwd = '') {
  const result = spawnSync('git', args, {
    cwd: cwd || undefined,
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || `git ${args.join(' ')} failed`)
  }
}

function isCommitShaRef(ref) {
  return /^[0-9a-f]{7,40}$/i.test(String(ref || '').trim())
}

function isDirectCloneRef(ref) {
  if (!ref) return false
  const normalizedRef = String(ref).trim()
  if (normalizedRef.startsWith('refs/')) return false
  if (isCommitShaRef(normalizedRef)) return false
  return true
}

async function stageGitSkill(entry, stagingRoot) {
  const source = entry.source
  const repoDir = path.join(stagingRoot, `${entry.installName}.repo`)
  const stagedDir = path.join(stagingRoot, entry.installName)
  const sourcePath = source.path === '.' ? '.' : source.path
  const cloneArgs = ['clone', '--filter=blob:none', '--depth', '1']
  const directCloneRef = isDirectCloneRef(source.ref)

  if (sourcePath !== '.') {
    cloneArgs.push('--sparse')
  }

  if (directCloneRef) {
    cloneArgs.push('--branch', source.ref)
  }

  if (source.ref && !directCloneRef) {
    cloneArgs.push('--no-checkout')
  }

  cloneArgs.push(source.repoUrl, repoDir)
  runGit(cloneArgs)

  if (sourcePath !== '.') {
    runGit(['-C', repoDir, 'sparse-checkout', 'set', '--no-cone', sourcePath])
  }

  if (source.ref && !directCloneRef) {
    runGit(['-C', repoDir, 'fetch', '--depth', '1', 'origin', source.ref])
    runGit(['-C', repoDir, 'checkout', '--detach', 'FETCH_HEAD'])
  } else if (source.ref) {
    runGit(['-C', repoDir, 'checkout', source.ref])
  }

  const repoSkillRoot = path.resolve(repoDir, sourcePath)
  if (!(await pathExists(repoSkillRoot))) {
    throw new Error(`Git source path does not exist after checkout: ${sourcePath}`)
  }

  await copySkillTree(repoSkillRoot, stagedDir)

  return {
    repoDir,
    stagedDir,
  }
}

async function stageSource(entry, resolved, stagingRoot) {
  const stagedDir = path.join(stagingRoot, entry.installName)

  await ensureDirectory(stagingRoot)
  await fs.rm(stagedDir, { recursive: true, force: true }).catch(() => {})

  if (entry.source.kind === 'local') {
    if (!resolved.sourceExists) {
      throw new Error(`Local source does not exist: ${resolved.sourceRoot}`)
    }
    await copySkillTree(resolved.sourceRoot, stagedDir)
    return {
      stagedDir,
      stagingSource: resolved.sourceRoot,
    }
  }

  if (entry.source.kind === 'github') {
    runInstaller([
      '--repo',
      entry.source.repo,
      '--ref',
      entry.source.ref,
      '--path',
      entry.source.path,
      '--dest',
      stagingRoot,
      '--name',
      entry.installName,
    ])
    return {
      stagedDir,
      stagingSource: `${entry.source.repo}#${entry.source.ref || 'HEAD'}`,
    }
  }

  if (entry.source.kind === 'git') {
    const staged = await stageGitSkill(entry, stagingRoot)
    return {
      stagedDir,
      stagingSource: `${entry.source.repoUrl}#${entry.source.ref || 'HEAD'}`,
      repoDir: staged.repoDir,
    }
  }

  throw new Error(`Unsupported source kind: ${entry.source.kind}`)
}

function validateResolvedManifestVersion(entry, stagedManifest, stagedManifestPath) {
  const versionMode = versionModeForEntry(entry)
  const manifestVersion = String(stagedManifest.version || '').trim()

  if (versionMode === 'locked') {
    if (manifestVersion !== entry.version) {
      throw new Error(
        `Staged skill version mismatch for ${entry.name}: expected ${entry.version}, got ${manifestVersion}`,
      )
    }
    return {
      versionMode,
      requestedVersion: manifestVersion,
    }
  }

  if (compareVersions(manifestVersion, entry.version) < 0) {
    throw new Error(
      `${stagedManifestPath}: staged version ${manifestVersion} is lower than minimum ${entry.version} required by ${entry.name}`,
    )
  }

  return {
    versionMode,
    requestedVersion: manifestVersion,
  }
}

async function resolveRequestedSkill(entry, lockDir, stagingRoot) {
  const resolved = await resolveSkillEntry(entry, lockDir)
  const staged = await stageSource(entry, resolved, stagingRoot)
  const stagedDir = staged.stagedDir

  const stagedManifestPath = path.join(stagedDir, entry.manifestPath)
  if (!(await pathExists(stagedManifestPath))) {
    throw new Error(`Staged skill is missing manifest: ${stagedManifestPath}`)
  }

  const stagedManifest = await readJson(stagedManifestPath)
  validateSkillManifest(stagedManifest, stagedManifestPath)
  if (stagedManifest.name !== entry.name) {
    throw new Error(`Staged skill name mismatch for ${entry.name}: ${stagedManifest.name}`)
  }
  const versionResolution = validateResolvedManifestVersion(entry, stagedManifest, stagedManifestPath)

  for (const requiredPath of stagedManifest.requiredPaths) {
    const absolutePath = path.join(stagedDir, requiredPath)
    if (!(await pathExists(absolutePath))) {
      throw new Error(`Staged skill ${entry.name} is missing required path: ${requiredPath}`)
    }
  }

  return {
    ...resolved,
    ...staged,
    stagedDir,
    stagedManifest,
    requestedVersion: versionResolution.requestedVersion,
    versionMode: versionResolution.versionMode,
  }
}

async function stageSkill(entry, lockDir, stagingRoot) {
  return resolveRequestedSkill(entry, lockDir, stagingRoot)
}

function backupRootForTarget(targetRoot) {
  return path.join(targetRoot, '.backup', 'workflow-bundle', timestampLabel())
}

async function writeJournal(backupRoot, journal) {
  await ensureDirectory(backupRoot)
  const journalPath = path.join(backupRoot, 'install-journal.json')
  await fs.writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`, 'utf8')
  return journalPath
}

async function removePathIfExists(targetPath) {
  if (await pathExists(targetPath)) {
    await fs.rm(targetPath, { recursive: true, force: true })
  }
}

async function rollbackActions(journal) {
  const errors = []
  const actions = [...journal.actions].reverse()

  for (const action of actions) {
    try {
      await removePathIfExists(action.targetDir)
      if (action.backupDir && await pathExists(action.backupDir)) {
        await ensureDirectory(path.dirname(action.targetDir))
        await fs.rename(action.backupDir, action.targetDir)
      }
    } catch (error) {
      errors.push({
        skill: action.name,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return errors
}

export {
  backupRootForTarget,
  decideAction,
  defaultTargetRoot,
  readInstalledSkill,
  replacementActions,
  resolveRequestedSkill,
  rollbackActions,
  stageSkill,
  writeJournal,
}
