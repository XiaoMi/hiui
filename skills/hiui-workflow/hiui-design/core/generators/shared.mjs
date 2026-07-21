import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const CURRENT_FILE = fileURLToPath(import.meta.url)
const CURRENT_DIR = path.dirname(CURRENT_FILE)

export const REPO_ROOT = path.resolve(CURRENT_DIR, '../../../..')
const EMBEDDED_PAGEGEN_ROOT = path.resolve(REPO_ROOT, '.local-context/hiui-design/core')
const MAINTAINER_PAGEGEN_ROOT = path.resolve(CURRENT_DIR, '..')
export const PAGEGEN_ROOT = fs.existsSync(EMBEDDED_PAGEGEN_ROOT)
  ? EMBEDDED_PAGEGEN_ROOT
  : MAINTAINER_PAGEGEN_ROOT
export const OFFICIAL_RUNTIME_REGISTRY_PATH = path.resolve(
  PAGEGEN_ROOT,
  'runtime-families',
  'official-runtime-pages.json'
)
export const PROJECT_MODE_LOCK_PATH = path.resolve(
  REPO_ROOT,
  '.local-context',
  'hiui-design',
  'outputs',
  'project-mode.json'
)
const PAGE_DIRECTORY_ONLY_FILE_BASENAMES = new Set([
  'index.tsx',
  'index.jsx',
  'index.ts',
  'index.js',
  'index.module.scss',
  'index.module.css',
  'page.schema.json',
  'hiui-pagegen.meta.json',
  'chart-usage.contract.json',
  'analytics-layout.plan.json',
])
const PAGE_DIRECTORY_ONLY_FILE_EXTENSIONS = new Set([
  '.tsx',
  '.jsx',
  '.ts',
  '.js',
  '.scss',
  '.css',
  '.json',
])

export function normalizeProjectModeId(mode) {
  const normalizedMode = String(mode || '').trim()
  if (normalizedMode === 'host-compatible') {
    return 'legacy-host-compatible'
  }
  return normalizedMode
}

export function parseArgs(argv) {
  const result = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      continue
    }

    const key = token.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) {
      result[key] = true
      continue
    }

    result[key] = next
    index += 1
  }

  return result
}

export function resolveFromRoot(targetPath) {
  return path.resolve(REPO_ROOT, targetPath)
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function readOfficialRuntimeRegistry() {
  return readJson(OFFICIAL_RUNTIME_REGISTRY_PATH)
}

export function readProjectModeLock() {
  if (!fs.existsSync(PROJECT_MODE_LOCK_PATH)) {
    return null
  }

  try {
    const payload = readJson(PROJECT_MODE_LOCK_PATH)
    const mode = normalizeProjectModeId(payload?.mode)
    return mode ? { ...payload, mode } : null
  } catch {
    return null
  }
}

export function isOfficialRuntimeModeAllowed(projectMode) {
  return normalizeProjectModeId(projectMode) === 'legacy-host-compatible'
}

export function assertOfficialRuntimeModeAllowed(commandName, projectModeLock = readProjectModeLock()) {
  const projectMode = normalizeProjectModeId(projectModeLock?.mode)

  assert(
    isOfficialRuntimeModeAllowed(projectMode),
    `${commandName} 仅允许在 legacy-host-compatible 模式下使用 official-runtime。当前项目 mode lock 位于 ${relativeToRoot(
      PROJECT_MODE_LOCK_PATH
    )}，解析结果为 ${projectMode || '(empty)'}。若目标是新项目或非 legacy 主树，请改走标准默认链路：greenfield 普通典型页优先 reference-asset，legacy 主树普通典型页优先 page-component + runtimeAdapterProof；只有 legacy-host-compatible 的隔离现代运行时子应用才允许 official-runtime。`
  )
}

export function assertStandardPagegenAllowed(commandName) {
  const projectMode = readProjectModeLock()

  assert(
    projectMode?.mode !== 'legacy-host-compatible',
    `${commandName} 默认不支持 legacy-host-compatible 主树。当前项目 mode lock 位于 ${relativeToRoot(
      PROJECT_MODE_LOCK_PATH
    )}，并且已标记为 legacy-host-compatible。普通典型页请沿 planner-selected certified page-component + runtime bridge 主链继续；当前治理若已证明 direct standard component 与宿主等价，它会先于 project-scoped carrier overlay 被选中，project-certified carrier 只保留为宿主事实要求下的受管 fallback。只有当前页缺少稳定页面落点、组合/非典型布局需要补规划事实，才单独运行 plan-page-task；如果确实需要标准壳运行时，请先执行 scripts/setup-isolated-standard-shell.mjs，为独立现代子应用准备运行时。`
  )
}

export function resolveOfficialRuntimePageIdForSchema(pageType, runtimeEntry, schema = {}) {
  assert(runtimeEntry?.pageId, `页型 ${pageType} 缺少官方 runtime pageId 声明`)

  const requestedVariant = String(schema?.variant || '').trim()
  if (!requestedVariant) {
    return runtimeEntry.pageId
  }

  if (!runtimeEntry.variantMap || typeof runtimeEntry.variantMap !== 'object') {
    return runtimeEntry.pageId
  }

  const resolvedPageId = runtimeEntry.variantMap[requestedVariant]
  assert(
    resolvedPageId,
    `页型 ${pageType} 不支持 variant=${requestedVariant}；请检查 ${relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH)}`
  )

  return resolvedPageId
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export function relativeToRoot(filePath) {
  return path.relative(REPO_ROOT, filePath) || '.'
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export function looksLikePageFilePath(targetPath) {
  const normalizedPath = String(targetPath || '')
    .trim()
    .replace(/\\/g, '/')
  const basename = path.posix.basename(normalizedPath).toLowerCase()

  if (PAGE_DIRECTORY_ONLY_FILE_BASENAMES.has(basename)) {
    return true
  }

  const ext = path.posix.extname(basename)
  return Boolean(ext) && PAGE_DIRECTORY_ONLY_FILE_EXTENSIONS.has(ext)
}

export function buildPageDirectoryOnlyError(flagName = '--page', targetPath = '') {
  const normalizedPath = String(targetPath || '')
    .trim()
    .replace(/\\/g, '/')

  return `${flagName} 必须指向页面目录，例如 src/views/<business-page>；不要传 ${
    normalizedPath || 'src/views/<business-page>/index.tsx'
  } 这类文件路径。`
}

export function assertPageDirectoryArg(targetPath, { flagName = '--page' } = {}) {
  assert(
    !looksLikePageFilePath(targetPath),
    buildPageDirectoryOnlyError(flagName, targetPath)
  )
}
