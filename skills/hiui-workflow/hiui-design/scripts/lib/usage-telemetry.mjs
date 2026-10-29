import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import os from 'node:os'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { SKILL_PUBLIC_NAME } from './skill-identity.mjs'
import { resolveAutoInstallMode } from './install-mode-resolution.mjs'

const REPORT_PATH = '/skill-usage/report'
const CACHE_DIRNAME = '.hiui-design-cache'
const IDENTITY_FILENAME = 'identity.json'
const PENDING_FILENAME = 'pending-usage.jsonl'
const FINALIZE_STATE_FILENAME = 'usage-finalize-state.json'
const DEDUP_STATE_FILENAME = 'usage-dedup-state.json'
const PROMPTS_DIRNAME = 'prompts'
const RUNS_DIRNAME = 'runs'
const PAYLOADS_DIRNAME = 'payloads'
const USER_CONFIG_ENV = 'HIUI_DESIGN_STATS_CONFIG'
const WORKSPACE_ROOT_ENV = 'HIUI_DESIGN_WORKSPACE_ROOT'
const TRANSPORT_ENV = 'HIUI_DESIGN_USAGE_TRANSPORT'
const COMMAND_ENV = 'HIUI_DESIGN_USAGE_REPORT_COMMAND'
const SERVICE_URL_ENV = 'HIUI_DESIGN_USAGE_SERVICE_URL'
const SERVICE_TOKEN_ENV = 'HIUI_DESIGN_USAGE_SERVICE_TOKEN'
const STATS_ENABLED_ENV = 'HIUI_DESIGN_STATS_ENABLED'
const USER_EMAIL_ENV = 'HIUI_DESIGN_USER_EMAIL'
const INSTALL_ID_ENV = 'HIUI_DESIGN_INSTALL_ID'
const TELEMETRY_PROMPT_ENV = 'HIUI_DESIGN_TELEMETRY_PROMPT'
const TELEMETRY_PROMPT_FILE_ENV = 'HIUI_DESIGN_TELEMETRY_PROMPT_FILE'
const NESTED_ENV = 'HIUI_DESIGN_USAGE_NESTED'
const WORKER_ENV = 'HIUI_DESIGN_USAGE_WORKER'
const DISABLE_WORKER_ENV = 'HIUI_DESIGN_USAGE_DISABLE_WORKER'
const OPT_IN_ENV = 'HIUI_DESIGN_ENABLE_USAGE_STATS'
const LEGACY_OPEN_OPT_IN_ENV = 'HIUI_DESIGN_OPEN_ENABLE_USAGE_STATS'
const DEFAULT_TIMEOUT_MS = 8000
const PROMPT_DEDUP_WINDOW_MS = 30 * 60 * 1000
const VALID_REPORT_MODES = new Set(['rules-only', 'host-integration'])
const LEGACY_REPORT_MODE_ALIASES = new Map([
  ['legacy-host-compatible', 'rules-only'],
  ['host-compatible', 'host-integration'],
])
const TRACKED_SOURCES = new Set([
  'setup-for-designers',
  'apply-in-current-project',
  'plan-page-task',
  'generate-page',
  'generate-page-from-brief',
])
const SOURCE_NAME_MAP = {
  'setup-for-designers': 'designer_setup',
  'apply-in-current-project': 'project_apply',
  'plan-page-task': 'page_plan',
  'generate-page': 'page_generate_single_entry',
  'generate-page-from-brief': 'page_generate',
}
const WINDOWS_GIT_CANDIDATES = [
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
]
const UNIX_GIT_CANDIDATES = ['/usr/bin/git', '/opt/homebrew/bin/git', '/usr/local/bin/git']

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(MODULE_DIR, '..', '..')
const REPO_DEFAULT_CONFIG_FILE = path.join(SKILL_ROOT, 'config', 'stats.default.env')
const SKILL_MANIFEST_FILE = path.join(SKILL_ROOT, 'skill.manifest.json')

function stripOptionalQuotes(value) {
  if (value.length >= 2 && value[0] === value[value.length - 1] && ['"', "'"].includes(value[0])) {
    return value.slice(1, -1)
  }
  return value
}

function parseEnvFile(raw) {
  const config = {}
  for (const line of raw.split(/\r?\n/u)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
    const separatorIndex = normalized.indexOf('=')
    if (separatorIndex === -1) continue
    const key = normalized.slice(0, separatorIndex).trim()
    const value = stripOptionalQuotes(normalized.slice(separatorIndex + 1).trim())
    if (key) config[key] = value
  }
  return config
}

async function readEnvFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return parseEnvFile(raw)
  } catch {
    return {}
  }
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

function isEnabled(value) {
  return ['1', 'true', 'TRUE', 'yes', 'YES'].includes(String(value || '').trim())
}

export function normalizeOsName(raw) {
  const value = String(raw || '').trim()
  if (!value) return 'unknown'

  const lower = value.toLowerCase()
  if (lower === 'darwin') return 'macOS'
  if (lower === 'win32' || lower === 'windows_nt' || lower === 'windows') return 'Windows'

  return value
}

function normalizeServiceUrl(raw) {
  const value = String(raw || '').trim()
  if (!value) return ''
  let parsed
  try {
    parsed = new URL(value)
  } catch {
    return ''
  }

  const pathValue = parsed.pathname.replace(/\/+$/u, '')
  parsed.pathname = pathValue.endsWith(REPORT_PATH) ? pathValue : `${pathValue || ''}${REPORT_PATH}`
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function ensureCacheDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })

  if (process.platform !== 'win32') return

  try {
    spawnSync('cmd', ['/c', 'attrib', '+h', dirPath], {
      encoding: 'utf8',
      stdio: 'ignore',
    })
  } catch {
    // Windows hides may fail under restricted shells; keep the directory usable.
  }
}

function nowIso() {
  return new Date().toISOString()
}

function nowMs() {
  return Date.now()
}

function defaultRunId() {
  return `hiuid_run_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
}

function defaultInstallId() {
  return `hiuid_install_${crypto.randomUUID().replace(/-/gu, '')}`
}

function isTrackedSource(source) {
  return TRACKED_SOURCES.has(String(source || '').trim())
}

function normalizeTrackedSourceName(source) {
  const value = String(source || '').trim()
  if (!value) return 'unknown-source'
  return SOURCE_NAME_MAP[value] || value
}

function buildPromptFingerprint(promptText) {
  const normalized = String(promptText || '').trim()
  if (!normalized) return ''
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

function detectUserConfigCandidates(env) {
  const candidates = []
  const custom = String(env[USER_CONFIG_ENV] || '').trim()
  if (custom) candidates.push(path.resolve(custom))

  const homeDir = os.homedir()
  if (homeDir) {
    candidates.push(path.join(homeDir, '.hiui-design', 'stats.env'))
    candidates.push(path.join(homeDir, '.config', 'hiui-design', 'stats.env'))
  }

  const appData = String(env.APPDATA || '').trim()
  if (appData) {
    candidates.push(path.join(appData, 'hiui-design', 'stats.env'))
  }

  const localAppData = String(env.LOCALAPPDATA || '').trim()
  if (localAppData) {
    candidates.push(path.join(localAppData, 'hiui-design', 'stats.env'))
  }

  return Array.from(new Set(candidates))
}

async function loadUserConfig(env) {
  for (const candidate of detectUserConfigCandidates(env)) {
    const config = await readEnvFile(candidate)
    if (Object.keys(config).length > 0) {
      return {
        config,
        path: candidate,
      }
    }
  }

  const fallbackPath = detectUserConfigCandidates(env)[0] || path.join(os.homedir(), '.hiui-design', 'stats.env')
  return {
    config: {},
    path: fallbackPath,
  }
}

function commandCandidatesForGit() {
  const pathCandidates = process.platform === 'win32' ? WINDOWS_GIT_CANDIDATES : UNIX_GIT_CANDIDATES
  return ['git', ...pathCandidates]
}

function runCommandForText(command, args, options = {}) {
  try {
    const result = spawnSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    })
    if ((result.status ?? 1) === 0) {
      return String(result.stdout || '').trim()
    }
  } catch {
    return ''
  }
  return ''
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(String(value || '').trim())
}

function isPlaceholderTelemetryEmail(value) {
  return /@example\.(com|org|net)$/iu.test(String(value || '').trim())
}

function normalizePromptValue(promptText, source) {
  const value = typeof promptText === 'string' ? promptText : ''
  if (value.trim()) return value
  const normalizedSource = String(source || '').trim() || 'unknown-source'
  return `[auto] ${normalizedSource}`
}

function normalizeTelemetryMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return null
  }

  const normalized = {}
  for (const [rawKey, value] of Object.entries(metadata)) {
    const key = String(rawKey || '').trim()
    if (!key) continue

    if (typeof value === 'boolean') {
      normalized[key] = value
      continue
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      normalized[key] = value
      continue
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) normalized[key] = trimmed
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : null
}

async function normalizeReportMode(reportMode, workspaceRoot) {
  const value = String(reportMode || '').trim()
  if (VALID_REPORT_MODES.has(value)) return value
  if (LEGACY_REPORT_MODE_ALIASES.has(value)) return LEGACY_REPORT_MODE_ALIASES.get(value)

  try {
    const resolved = await resolveAutoInstallMode({
      requestedMode: 'auto',
      targetRoot: workspaceRoot,
    })
    if (VALID_REPORT_MODES.has(resolved.mode)) {
      return resolved.mode
    }
  } catch {
    // Fall through to the safest public mode below.
  }

  return 'host-integration'
}

function readEmailFromEnv(env) {
  const candidates = [
    USER_EMAIL_ENV,
    'USER_EMAIL',
    'EMAIL',
    'GIT_AUTHOR_EMAIL',
    'GIT_COMMITTER_EMAIL',
    'CODEX_USER_EMAIL',
    'CURSOR_USER_EMAIL',
  ]

  for (const key of candidates) {
    const value = String(env[key] || '').trim()
    if (looksLikeEmail(value)) return value
  }

  return ''
}

function readGitUserEmail(targetRoot) {
  const commands = []
  for (const command of commandCandidatesForGit()) {
    commands.push([command, ['-C', targetRoot, 'config', '--get', 'user.email']])
    commands.push([command, ['config', '--global', '--get', 'user.email']])
  }

  for (const [command, args] of commands) {
    const value = runCommandForText(command, args)
    if (looksLikeEmail(value)) {
      return value
    }
  }

  return ''
}

async function loadSkillVersion() {
  const manifest = await readJsonIfExists(SKILL_MANIFEST_FILE)
  return String(manifest?.version || 'unknown')
}

function parseCommandSpec(raw) {
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string' && item.trim())) {
      return parsed
    }
  } catch {
    return []
  }

  return []
}

async function writeEnvFile(filePath, values) {
  const current = await readEnvFile(filePath)
  const merged = {
    ...current,
    ...values,
  }
  const lines = Object.entries(merged)
    .filter(([, value]) => String(value || '').trim())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, `${lines.join('\n')}\n`, 'utf8')
}

async function appendPendingPayload(filePath, payload) {
  const existing = await readPendingPayloads(filePath)
  const deduped = existing.filter((item) => item?.run_id !== payload.run_id)
  deduped.push(payload)
  const serialized = deduped.map((item) => JSON.stringify(item)).join('\n')
  await fs.writeFile(filePath, serialized ? `${serialized}\n` : '', 'utf8')
  return deduped.length
}

export async function readPendingPayloads(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return raw
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line)
        } catch {
          return null
        }
      })
      .filter(Boolean)
  } catch {
    return []
  }
}

async function writePendingPayloads(filePath, payloads) {
  const serialized = payloads.map((item) => JSON.stringify(item)).join('\n')
  await fs.writeFile(filePath, serialized ? `${serialized}\n` : '', 'utf8')
}

function requestJson(urlValue, payload, token, timeoutMs) {
  const url = new URL(urlValue)
  const client = url.protocol === 'http:' ? http : https
  const body = JSON.stringify(payload)

  return new Promise((resolve, reject) => {
    const request = client.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
          ...(token ? { 'X-Report-Token': token } : {}),
        },
      },
      (response) => {
        let raw = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          raw += chunk
        })
        response.on('end', () => {
          if ((response.statusCode || 500) >= 200 && (response.statusCode || 500) < 300) {
            try {
              resolve(raw ? JSON.parse(raw) : {})
            } catch {
              resolve({})
            }
            return
          }

          reject(
            new Error(
              `Usage report request failed with status ${response.statusCode || 500}${raw ? `: ${raw.slice(0, 200)}` : ''}`
            )
          )
        })
      }
    )

    request.on('error', reject)
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Usage report request timed out after ${timeoutMs}ms`))
    })
    request.write(body)
    request.end()
  })
}

function buildRuntimeValue(envValue, userConfig, repoDefault, fallback = '') {
  const first = String(envValue || '').trim()
  if (first) return first
  const second = String(userConfig || '').trim()
  if (second) return second
  const third = String(repoDefault || '').trim()
  if (third) return third
  return fallback
}

export async function createTelemetryRuntime(targetRoot = process.cwd(), env = process.env) {
  const usageStatsOptIn = isEnabled(env[OPT_IN_ENV]) || isEnabled(env[LEGACY_OPEN_OPT_IN_ENV])
  const repoDefaultConfig = usageStatsOptIn ? await readEnvFile(REPO_DEFAULT_CONFIG_FILE) : {}
  const userConfigState = usageStatsOptIn
    ? await loadUserConfig(env)
    : {
        config: {},
        path: detectUserConfigCandidates(env)[0] || path.join(os.homedir(), '.hiui-design', 'stats.env'),
      }
  const workspaceRoot = path.resolve(String(env[WORKSPACE_ROOT_ENV] || targetRoot || process.cwd()))
  const cacheDir = path.join(workspaceRoot, CACHE_DIRNAME)
  const identityFile = path.join(cacheDir, IDENTITY_FILENAME)
  const pendingFile = path.join(cacheDir, PENDING_FILENAME)
  const finalizeStateFile = path.join(cacheDir, FINALIZE_STATE_FILENAME)
  const dedupStateFile = path.join(cacheDir, DEDUP_STATE_FILENAME)
  const promptsDir = path.join(cacheDir, PROMPTS_DIRNAME)
  const runsDir = path.join(cacheDir, RUNS_DIRNAME)
  const payloadsDir = path.join(cacheDir, PAYLOADS_DIRNAME)

  const serviceUrl = normalizeServiceUrl(
    buildRuntimeValue(
      env[SERVICE_URL_ENV],
      userConfigState.config[SERVICE_URL_ENV],
      repoDefaultConfig[SERVICE_URL_ENV]
    )
  )
  const transport = buildRuntimeValue(
    env[TRANSPORT_ENV],
    userConfigState.config[TRANSPORT_ENV],
    repoDefaultConfig[TRANSPORT_ENV],
    serviceUrl ? 'http' : 'disabled'
  )
  const commandSpec = parseCommandSpec(
    buildRuntimeValue(
      env[COMMAND_ENV],
      userConfigState.config[COMMAND_ENV],
      repoDefaultConfig[COMMAND_ENV]
    )
  )
  const statsEnabled =
    usageStatsOptIn &&
    (isEnabled(repoDefaultConfig[STATS_ENABLED_ENV]) ||
      isEnabled(env[STATS_ENABLED_ENV]) ||
      isEnabled(userConfigState.config[STATS_ENABLED_ENV]))

  const timeoutMs = Number.parseInt(
    buildRuntimeValue(
      env.HIUI_DESIGN_USAGE_TIMEOUT_MS,
      userConfigState.config.HIUI_DESIGN_USAGE_TIMEOUT_MS,
      repoDefaultConfig.HIUI_DESIGN_USAGE_TIMEOUT_MS,
      `${DEFAULT_TIMEOUT_MS}`
    ),
    10
  )

  return {
    cacheDir,
    commandSpec,
    dedupStateFile,
    env,
    finalizeStateFile,
    identityFile,
    nested: String(env[NESTED_ENV] || '').trim() === '1',
    payloadsDir,
    pendingFile,
    promptsDir,
    repoDefaultConfig,
    runsDir,
    serviceToken: buildRuntimeValue(
      env[SERVICE_TOKEN_ENV],
      userConfigState.config[SERVICE_TOKEN_ENV],
      repoDefaultConfig[SERVICE_TOKEN_ENV]
    ),
    serviceUrl,
    skillRoot: SKILL_ROOT,
    skillVersion: await loadSkillVersion(),
    statsEnabled,
    usageStatsOptIn,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS,
    transport,
    userConfig: userConfigState,
    workspaceRoot,
    workerScriptPath: path.join(SKILL_ROOT, 'scripts', 'usage-upload-worker.mjs'),
  }
}

export async function prepareLocalIdentity(runtime, overrides = {}, options = {}) {
  const persistWorkspace = options.persistWorkspace !== false
  const persistUserConfig = options.persistUserConfig !== false
  const workspaceIdentity = (await readJsonIfExists(runtime.identityFile)) || {}
  const resolvedUserEmailCandidates = [
    overrides.userEmail,
    runtime.env[USER_EMAIL_ENV],
    readEmailFromEnv(runtime.env),
    readGitUserEmail(runtime.workspaceRoot),
    workspaceIdentity.user_email,
    runtime.userConfig.config[USER_EMAIL_ENV],
  ]
  const resolvedInstallIdCandidates = [
    overrides.installId,
    runtime.env[INSTALL_ID_ENV],
    workspaceIdentity.install_id,
    runtime.userConfig.config[INSTALL_ID_ENV],
    defaultInstallId(),
  ]

  const userEmail = resolvedUserEmailCandidates.find((value) => looksLikeEmail(value)) || ''
  const installId = resolvedInstallIdCandidates.find((value) => String(value || '').trim()) || defaultInstallId()

  const identity = {
    install_id: installId,
    user_email: userEmail,
  }

  if (persistWorkspace) {
    try {
      await ensureCacheDir(runtime.cacheDir)
      await fs.writeFile(runtime.identityFile, `${JSON.stringify(identity, null, 2)}\n`, 'utf8')
    } catch {
      // Local cache failures should not block page generation.
    }
  }

  if (persistUserConfig) {
    try {
      await writeEnvFile(runtime.userConfig.path, {
        [INSTALL_ID_ENV]: installId,
        ...(userEmail ? { [USER_EMAIL_ENV]: userEmail } : {}),
      })
    } catch {
      // Global cache is best-effort only.
    }
  }

  return identity
}

async function readDedupState(filePath) {
  return (await readJsonIfExists(filePath)) || {}
}

async function writeDedupState(filePath, state) {
  await fs.writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

async function shouldSkipDuplicatePrompt(runtime, promptText) {
  const fingerprint = buildPromptFingerprint(promptText)
  if (!fingerprint) {
    return {
      fingerprint: '',
      shouldSkip: false,
    }
  }

  const currentTime = nowMs()
  const dedupState = await readDedupState(runtime.dedupStateFile)
  const previous = dedupState?.prompt_dedup
  const previousFingerprint = String(previous?.fingerprint || '').trim()
  const previousTimestamp = Number(previous?.timestamp || 0)
  const samePrompt = previousFingerprint === fingerprint
  const withinWindow =
    Number.isFinite(previousTimestamp) &&
    previousTimestamp > 0 &&
    currentTime - previousTimestamp >= 0 &&
    currentTime - previousTimestamp <= PROMPT_DEDUP_WINDOW_MS

  return {
    fingerprint,
    shouldSkip: samePrompt && withinWindow,
  }
}

async function rememberPromptFingerprint(runtime, fingerprint, source) {
  if (!fingerprint) return

  try {
    await ensureCacheDir(runtime.cacheDir)
    await writeDedupState(runtime.dedupStateFile, {
      prompt_dedup: {
        fingerprint,
        source: normalizeTrackedSourceName(source),
        timestamp: nowMs(),
      },
    })
  } catch {
    // Dedup state is best-effort only.
  }
}

async function resolvePromptText(runtime, options = {}) {
  if (typeof options.prompt === 'string' && options.prompt.trim()) {
    return options.prompt
  }

  const promptFileFromOption = String(options.promptFile || '').trim()
  if (promptFileFromOption) {
    try {
      return await fs.readFile(promptFileFromOption, 'utf8')
    } catch {
      return ''
    }
  }

  const promptFileFromEnv = String(runtime.env[TELEMETRY_PROMPT_FILE_ENV] || '').trim()
  if (promptFileFromEnv) {
    try {
      return await fs.readFile(promptFileFromEnv, 'utf8')
    } catch {
      return ''
    }
  }

  return String(runtime.env[TELEMETRY_PROMPT_ENV] || '')
}

export async function startUsageSession(options = {}) {
  const runtime = await createTelemetryRuntime(options.targetRoot || process.cwd(), options.env || process.env)
  const session = {
    active: false,
    identity: null,
    promptPath: '',
    promptText: '',
    reportMode: String(options.reportMode || '').trim(),
    runId: defaultRunId(),
    runtime,
    skillVersion: runtime.skillVersion,
    source: String(options.source || '').trim(),
    startedAt: nowIso(),
    skipReason: '',
  }

  if (!runtime.statsEnabled || runtime.nested || !session.source) {
    return session
  }

  if (!isTrackedSource(session.source)) {
    session.skipReason = 'source_not_tracked'
    return session
  }

  session.promptText = await resolvePromptText(runtime, options)
  const duplicatePromptState = await shouldSkipDuplicatePrompt(runtime, session.promptText)
  if (duplicatePromptState.shouldSkip) {
    session.skipReason = 'duplicate_prompt_window'
    return session
  }

  session.active = true
  session.identity = await prepareLocalIdentity(runtime, {
    installId: options.installId,
    userEmail: options.userEmail,
  }, {
    persistWorkspace: false,
  })
  await rememberPromptFingerprint(runtime, duplicatePromptState.fingerprint, session.source)

  return session
}

async function buildPayload(session, options = {}) {
  const identity = session.identity || (await prepareLocalIdentity(session.runtime))
  const source = normalizeTrackedSourceName(session.source)
  const prompt = normalizePromptValue(session.promptText, source)
  const reportMode = await normalizeReportMode(options.reportMode || session.reportMode || 'auto', session.runtime.workspaceRoot)
  const metadata = normalizeTelemetryMetadata(options.metadata)

  return {
    event: String(options.event || 'skill_run'),
    install_id: identity.install_id,
    os: normalizeOsName(os.platform()),
    prompt,
    report_mode: reportMode,
    run_id: session.runId,
    skill_name: SKILL_PUBLIC_NAME,
    skill_version: session.skillVersion,
    source,
    success: Boolean(options.success),
    timestamp: nowIso(),
    user_email: identity.user_email || '',
    ...(metadata ? { metadata } : {}),
  }
}

async function sanitizePendingPayload(payload, identity, runtime) {
  const source = normalizeTrackedSourceName(payload?.source)
  const prompt = normalizePromptValue(payload?.prompt, source)
  const normalizedIdentityEmail = String(identity?.user_email || '').trim()
  const currentEmail = String(payload?.user_email || '').trim()
  const reportMode = await normalizeReportMode(payload?.report_mode, runtime.workspaceRoot)
  const nextEmail =
    looksLikeEmail(normalizedIdentityEmail) && (!looksLikeEmail(currentEmail) || isPlaceholderTelemetryEmail(currentEmail))
      ? normalizedIdentityEmail
      : currentEmail

  return {
    ...payload,
    report_mode: reportMode,
    source,
    prompt,
    ...(nextEmail ? { user_email: nextEmail } : {}),
  }
}

async function writeFinalizeState(runtime, result) {
  try {
    await ensureCacheDir(runtime.cacheDir)
    await fs.writeFile(runtime.finalizeStateFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  } catch {
    // Ignore finalize-state write failures.
  }
}

function spawnUsageWorker(runtime) {
  if (!runtime.statsEnabled) return false
  if (String(runtime.env[DISABLE_WORKER_ENV] || '').trim() === '1') return false
  if (String(runtime.env[WORKER_ENV] || '').trim() === '1') return false
  if (!runtime.serviceUrl && runtime.transport !== 'command') return false
  if (!(runtime.transport === 'http' || runtime.transport === 'command')) return false
  if (runtime.transport === 'command' && runtime.commandSpec.length === 0) return false

  try {
    const child = spawn(
      process.execPath,
      [runtime.workerScriptPath, '--workspace-root', runtime.workspaceRoot],
      {
        detached: true,
        env: {
          ...runtime.env,
          [WORKSPACE_ROOT_ENV]: runtime.workspaceRoot,
          [WORKER_ENV]: '1',
        },
        stdio: 'ignore',
      }
    )
    child.unref()
    return true
  } catch {
    return false
  }
}

export async function finalizeUsageSession(session, options = {}) {
  if (!session?.active) {
    return {
      queued: false,
      skipped: true,
      workerSpawned: false,
    }
  }

  const payload = await buildPayload(session, options)
  let pendingCount = 0

  try {
    await ensureCacheDir(session.runtime.cacheDir)
    if (session.identity) {
      await fs.writeFile(session.runtime.identityFile, `${JSON.stringify(session.identity, null, 2)}\n`, 'utf8')
    }
    await fs.mkdir(session.runtime.promptsDir, { recursive: true })
    await fs.mkdir(session.runtime.runsDir, { recursive: true })
    if (session.promptText) {
      session.promptPath = path.join(session.runtime.promptsDir, `${session.runId}.txt`)
      await fs.writeFile(session.promptPath, session.promptText, 'utf8')
    }
    const runRecord = {
      finalized_at: payload.timestamp,
      metadata: payload.metadata || null,
      prompt_path: session.promptPath,
      prompt_present: Boolean(session.promptText),
      report_mode: payload.report_mode,
      run_id: session.runId,
      skill_name: SKILL_PUBLIC_NAME,
      skill_version: session.skillVersion,
      source: payload.source,
      started_at: session.startedAt,
      success: payload.success,
      target_root: session.runtime.workspaceRoot,
    }
    await fs.writeFile(
      path.join(session.runtime.runsDir, `${session.runId}.json`),
      `${JSON.stringify(runRecord, null, 2)}\n`,
      'utf8'
    )
    pendingCount = await appendPendingPayload(session.runtime.pendingFile, payload)
    await fs.mkdir(session.runtime.payloadsDir, { recursive: true })
    await fs.writeFile(
      path.join(session.runtime.payloadsDir, `${session.runId}.json`),
      `${JSON.stringify(payload, null, 2)}\n`,
      'utf8'
    )
  } catch {
    // Queue write failures are recorded in finalize state but must not fail the main task.
  }

  const workerSpawned = spawnUsageWorker(session.runtime)
  const result = {
    pendingCount,
    queued: true,
    runId: session.runId,
    success: Boolean(options.success),
    workerSpawned,
  }
  await writeFinalizeState(session.runtime, result)
  return result
}

async function sendPayloadWithCommand(runtime, payload) {
  if (runtime.commandSpec.length === 0) {
    throw new Error('Missing HIUI_DESIGN_USAGE_REPORT_COMMAND for command transport')
  }

  await fs.mkdir(runtime.payloadsDir, { recursive: true })
  const payloadFile = path.join(runtime.payloadsDir, `${payload.run_id}.json`)
  await fs.writeFile(payloadFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  const [command, ...args] = runtime.commandSpec
  const result = spawnSync(command, [...args, payloadFile], {
    encoding: 'utf8',
    env: runtime.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: runtime.timeoutMs,
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    throw new Error(String(result.stderr || result.stdout || 'External usage reporter failed').trim())
  }

  return payloadFile
}

async function sendPayload(runtime, payload) {
  if (runtime.transport === 'command') {
    return sendPayloadWithCommand(runtime, payload)
  }

  if (!runtime.serviceUrl) {
    throw new Error('Missing HIUI_DESIGN_USAGE_SERVICE_URL')
  }

  return requestJson(runtime.serviceUrl, payload, runtime.serviceToken, runtime.timeoutMs)
}

export async function flushPendingUsage(options = {}) {
  const runtime = await createTelemetryRuntime(options.workspaceRoot || process.cwd(), options.env || process.env)

  if (!runtime.statsEnabled) {
    return {
      flushedCount: 0,
      remainingCount: 0,
      status: 'disabled',
    }
  }

  if (runtime.transport === 'command' && runtime.commandSpec.length === 0) {
    return {
      flushedCount: 0,
      remainingCount: (await readPendingPayloads(runtime.pendingFile)).length,
      status: 'missing_command',
    }
  }

  if (runtime.transport === 'http' && !runtime.serviceUrl) {
    return {
      flushedCount: 0,
      remainingCount: (await readPendingPayloads(runtime.pendingFile)).length,
      status: 'missing_service_url',
    }
  }

  const pendingPayloads = await readPendingPayloads(runtime.pendingFile)
  if (pendingPayloads.length === 0) {
    return {
      flushedCount: 0,
      remainingCount: 0,
      status: 'empty',
    }
  }

  const remaining = []
  let flushedCount = 0
  let lastError = ''
  const identity = await prepareLocalIdentity(runtime, {}, {
    persistUserConfig: false,
    persistWorkspace: false,
  })

  for (const payload of pendingPayloads) {
    try {
      const normalizedPayload = await sanitizePendingPayload(payload, identity, runtime)
      await sendPayload(runtime, normalizedPayload)
      flushedCount += 1
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
      remaining.push(payload)
    }
  }

  try {
    await ensureCacheDir(runtime.cacheDir)
    await writePendingPayloads(runtime.pendingFile, remaining)
  } catch {
    return {
      flushedCount,
      lastError: lastError || 'Failed to rewrite pending queue',
      remainingCount: remaining.length || pendingPayloads.length,
      status: 'queue_write_failed',
    }
  }

  return {
    flushedCount,
    lastError,
    remainingCount: remaining.length,
    status: remaining.length === 0 ? 'flushed' : 'partial',
  }
}
