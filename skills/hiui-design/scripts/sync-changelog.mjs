#!/usr/bin/env node

import fs from 'node:fs/promises'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const CHANGELOG_HEADER = '# 更新日志'
const SNAPSHOT_VERSION = 2
const DEFAULT_WATCH_INTERVAL_MS = 1500
const CHANGELOG_HISTORY_FILE = 'outputs/CHANGELOG_HISTORY.json'
const CHANGELOG_SNAPSHOT_FILE = 'outputs/CHANGELOG_SNAPSHOT.json'
const execFileAsync = promisify(execFile)

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

async function readJson(filePath) {
  return JSON.parse(await readText(filePath))
}

async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}

async function writeJson(filePath, value) {
  await writeText(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function parseArgs(argv) {
  const options = {
    days: null,
    interval: DEFAULT_WATCH_INTERVAL_MS,
    output: '',
    rebuildHistory: false,
    watch: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--days') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --days')
      }

      const parsed = Number.parseInt(value, 10)
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error('--days must be a positive integer')
      }

      options.days = parsed
      index += 1
      continue
    }

    if (arg === '--interval') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --interval')
      }

      const parsed = Number.parseInt(value, 10)
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error('--interval must be a positive integer (milliseconds)')
      }

      options.interval = parsed
      index += 1
      continue
    }

    if (arg === '--output') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --output')
      }
      options.output = value
      index += 1
      continue
    }

    if (arg === '--watch') {
      options.watch = true
      continue
    }

    if (arg === '--rebuild-history') {
      options.rebuildHistory = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/sync-changelog.mjs [--days <n>] [--output <file-path>] [--watch] [--interval <ms>] [--rebuild-history]',
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function formatDate(date) {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfDay(date) {
  const clone = new Date(date)
  clone.setHours(0, 0, 0, 0)
  return clone
}

function subtractDays(date, days) {
  const clone = new Date(date)
  clone.setDate(clone.getDate() - days)
  return clone
}

function addDays(date, days) {
  const clone = new Date(date)
  clone.setDate(clone.getDate() + days)
  return clone
}

function parseDateKey(dateKey) {
  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return null
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function isDateWithinWindow(dateKey, days) {
  if (!days) {
    return true
  }

  const parsed = parseDateKey(dateKey)
  if (!parsed) {
    return true
  }

  const today = startOfDay(new Date())
  const cutoff = subtractDays(today, days - 1)
  return parsed >= cutoff
}

function parseVersionFile(content) {
  const metadata = { notes: [] }
  let inNotes = false

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (!trimmed) {
      continue
    }

    if (trimmed === 'notes:') {
      inNotes = true
      continue
    }

    if (inNotes && trimmed.startsWith('- ')) {
      metadata.notes.push(trimmed.slice(2))
      continue
    }

    const match = line.match(/^([a-z-]+):\s*(.+)$/)
    if (!match) {
      continue
    }

    const [, key, value] = match
    metadata[key] = value
    if (key !== 'notes') {
      inNotes = false
    }
  }

  return metadata
}

function parseReleaseReport(content) {
  const report = {
    steps: [],
  }
  let inCodeBlock = false

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()

    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) {
      continue
    }

    if (!line) {
      continue
    }

    const bulletMatch = line.match(/^- ([a-z-]+):\s*(.+)$/)
    if (bulletMatch) {
      const [, key, value] = bulletMatch
      report[key] = value
      continue
    }

    const stepMatch = rawLine.match(/^###\s+(.+)$/)
    if (stepMatch) {
      report.steps.push(stepMatch[1].trim())
    }
  }

  return report
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function isIgnoredRelativePath(relativePath) {
  if (!relativePath) {
    return false
  }

  const normalized = relativePath.split(path.sep).join('/')
  if (normalized === 'CHANGELOG.md' || normalized === 'outputs' || normalized.startsWith('outputs/')) {
    return true
  }

  return normalized.split('/').some((segment) => segment.startsWith('.'))
}

async function hasGitRepository(skillRoot) {
  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: skillRoot,
      maxBuffer: 1024 * 1024,
    })
    return stdout.trim() === 'true'
  } catch {
    return false
  }
}

function createDayEntry() {
  return {
    added: [],
    deleted: [],
    updated: [],
  }
}

function getOrCreateDayEntry(map, dateKey) {
  if (!map.has(dateKey)) {
    map.set(dateKey, createDayEntry())
  }

  return map.get(dateKey)
}

async function collectGitHistory(skillRoot) {
  if (!(await hasGitRepository(skillRoot))) {
    return new Map()
  }

  const { stdout } = await execFileAsync(
    'git',
    [
      'log',
      '--date=short',
      '--pretty=format:__COMMIT__\t%ad\t%H\t%s',
      '--name-status',
      '--no-renames',
      '--',
      '.',
    ],
    {
      cwd: skillRoot,
      maxBuffer: 32 * 1024 * 1024,
    },
  )

  const grouped = new Map()
  let currentDate = null

  for (const rawLine of stdout.split('\n')) {
    const line = rawLine.trimEnd()
    if (!line) {
      continue
    }

    if (line.startsWith('__COMMIT__\t')) {
      const [, dateKey] = line.split('\t', 4)
      currentDate = dateKey || null
      continue
    }

    if (!currentDate) {
      continue
    }

    const match = line.match(/^([A-Z][0-9]*)\t(.+)$/)
    if (!match) {
      continue
    }

    const status = match[1]
    const relativePath = match[2]
    if (isIgnoredRelativePath(relativePath)) {
      continue
    }

    const entry = getOrCreateDayEntry(grouped, currentDate)
    if (status.startsWith('A')) {
      entry.added.push(relativePath)
      continue
    }

    if (status.startsWith('D')) {
      entry.deleted.push(relativePath)
      continue
    }

    entry.updated.push(relativePath)
  }

  for (const entry of grouped.values()) {
    entry.added.sort()
    entry.deleted.sort()
    entry.updated.sort()
  }

  return grouped
}

async function walkFiles(rootDir, currentDir = rootDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)
    const relativePath = path.relative(rootDir, fullPath)

    if (isIgnoredRelativePath(relativePath)) {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(rootDir, fullPath)))
      continue
    }

    files.push(relativePath.split(path.sep).join('/'))
  }

  return files
}

function toFileSignature(stats) {
  return {
    mtimeMs: Math.trunc(stats.mtimeMs),
    size: stats.size,
  }
}

async function readOptionalFileSignature(filePath) {
  if (!(await pathExists(filePath))) {
    return null
  }

  const stats = await fs.stat(filePath)
  return toFileSignature(stats)
}

function sameSignature(left, right) {
  if (!left && !right) {
    return true
  }

  if (!left || !right) {
    return false
  }

  return left.mtimeMs === right.mtimeMs && left.size === right.size
}

async function collectVisibleState(skillRoot) {
  const relativeFiles = await walkFiles(skillRoot)
  const grouped = new Map()
  const snapshotFiles = {}

  for (const relativePath of relativeFiles) {
    const filePath = path.join(skillRoot, relativePath)
    const stats = await fs.stat(filePath)
    const dateKey = formatDate(stats.mtime)

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }

    grouped.get(dateKey).push(relativePath)
    snapshotFiles[relativePath] = toFileSignature(stats)
  }

  for (const files of grouped.values()) {
    files.sort()
  }

  return {
    grouped,
    snapshotFiles,
  }
}

async function collectSnapshotState(skillRoot) {
  const visibleState = await collectVisibleState(skillRoot)
  const releaseReportPath = path.join(skillRoot, 'outputs', 'RELEASE_REPORT.md')

  return {
    capturedAt: new Date().toISOString(),
    releaseReport: await readOptionalFileSignature(releaseReportPath),
    snapshotVersion: SNAPSHOT_VERSION,
    visibleState,
  }
}

function createEmptyHistory() {
  const timestamp = new Date().toISOString()
  return {
    createdAt: timestamp,
    days: {},
    historyVersion: SNAPSHOT_VERSION,
    updatedAt: timestamp,
  }
}

function normalizeHistoryEntry(entry) {
  const normalized = {
    added: Array.from(new Set(entry.added ?? [])).sort(),
    deleted: Array.from(new Set(entry.deleted ?? [])).sort(),
    updated: Array.from(new Set(entry.updated ?? [])).sort(),
  }

  return normalized
}

function mergeHistoryEntry(history, dateKey, delta) {
  const current = normalizeHistoryEntry(history.days[dateKey] ?? {})
  const next = normalizeHistoryEntry({
    added: [...current.added, ...(delta.added ?? [])],
    deleted: [...current.deleted, ...(delta.deleted ?? [])],
    updated: [...current.updated, ...(delta.updated ?? [])],
  })

  history.days[dateKey] = next
  history.updatedAt = new Date().toISOString()
}

function hasHistoryEntries(history) {
  return Object.keys(history.days ?? {}).length > 0
}

function shouldRebuildHistory(history, snapshot, options) {
  if (options.rebuildHistory) {
    return true
  }

  if (!history || history.historyVersion !== SNAPSHOT_VERSION) {
    return true
  }

  if (!snapshot || snapshot.snapshotVersion !== SNAPSHOT_VERSION) {
    return true
  }

  return false
}

function diffSnapshots(previousSnapshot, nextSnapshot) {
  const previousFiles = previousSnapshot?.files ?? {}
  const nextFiles = nextSnapshot.visibleState.snapshotFiles
  const added = []
  const deleted = []
  const updated = []
  const allPaths = new Set([...Object.keys(previousFiles), ...Object.keys(nextFiles)])

  for (const relativePath of allPaths) {
    const previous = previousFiles[relativePath]
    const next = nextFiles[relativePath]

    if (!previous && next) {
      added.push(relativePath)
      continue
    }

    if (previous && !next) {
      deleted.push(relativePath)
      continue
    }

    if (!sameSignature(previous, next)) {
      updated.push(relativePath)
    }
  }

  added.sort()
  deleted.sort()
  updated.sort()

  return {
    added,
    deleted,
    hasReleaseReportChange: !sameSignature(previousSnapshot?.releaseReport ?? null, nextSnapshot.releaseReport),
    hasVisibleChanges: added.length > 0 || deleted.length > 0 || updated.length > 0,
    updated,
  }
}

async function loadJsonOrDefault(filePath, fallbackFactory) {
  if (!(await pathExists(filePath))) {
    return fallbackFactory()
  }

  return readJson(filePath)
}

function buildBootstrapHistory({ fallbackObservedFiles, gitHistory }) {
  const history = createEmptyHistory()

  for (const [dateKey, entry] of gitHistory.entries()) {
    mergeHistoryEntry(history, dateKey, entry)
  }

  for (const [dateKey, files] of fallbackObservedFiles.entries()) {
    mergeHistoryEntry(history, dateKey, {
      added: [],
      deleted: [],
      updated: files,
    })
  }

  return history
}

function includesAny(notes, keywords) {
  return notes.some((note) => keywords.some((keyword) => note.includes(keyword)))
}

function buildVersionSummary(versionMetadata) {
  const notes = versionMetadata.notes ?? []
  const summary = []

  if (
    includesAny(notes, [
      'rules/ became the default AI decision layer',
      'canonical machine facts moved to rules/common.page-types.json',
      'SKILL.md became a navigation-only entrypoint',
    ])
  ) {
    summary.push(
      '重构规则层入口：`rules/` 成为默认 AI 决策层，`rules/common.page-types.json` 作为机读事实源，`SKILL.md` 收敛为导航入口。',
    )
  }

  if (
    includesAny(notes, ['dual metric-surface tokens', 'typography role mapping'])
  ) {
    summary.push(
      '同步指标与排版基线：区分 overview / embedded 两类 metric surface token，并统一页面标题、分区标题、正文、meta 的字号映射。',
    )
  }

  if (
    includesAny(notes, [
      'component-first hard gates',
      'forbidding business pages from overriding existing HiUI component skeleton layers',
      'common HiUI components including PageHeader, QueryFilter, Table',
    ])
  ) {
    summary.push(
      '收紧组件复用约束：要求优先复用既有 HiUI 组件，并禁止业务页面覆写常见组件的 skeleton 层。',
    )
  }

  if (
    includesAny(notes, [
      'non-typical page routing',
      'layout strategy',
      'layout-group, layout-region, layout-item, and full-span markers',
      'split-section closure',
    ])
  ) {
    summary.push(
      '补齐非典型页面规则：新增 `linear-stack`、`parallel-sections`、`primary-secondary` 布局策略、source/runtime marker，以及 `split-section closure` 收口要求。',
    )
  }

  if (
    includesAny(notes, [
      'data-visualization overlay guidance',
      'three-column KPI grids',
      'chart selection appendix',
    ])
  ) {
    summary.push(
      '增强数据可视化约束：补充 summary band / KPI 栅格限制、图表选型说明和图表标题文案要求。',
    )
  }

  if (
    includesAny(notes, [
      'cross-page i18n baseline',
      'typical-page:i18n:init',
      'scripts/init-i18n.mjs',
      'translation baseline assets',
      'i18n:sync',
    ])
  ) {
    summary.push(
      '引入国际化基线：覆盖 locale 策略、RTL、formatter、文本膨胀，并提供 `typical-page:i18n:init` 与 `scripts/init-i18n.mjs` 自动补齐翻译资产。',
    )
  }

  if (
    includesAny(notes, [
      'tightened delivery gates',
      'doctor-gate/finalize-page now require a warning-free PASS',
      'typical-page-source-gate',
      'hard rewrite loop',
    ])
  ) {
    summary.push(
      '强化交付闭环：要求 source gate、doctor、finalize 与真实页面/DOM/console 校验联动通过，重复命中同一根因两次后必须回到 mode/page-type/example/archetype 重新选型。',
    )
  }

  if (
    includesAny(notes, [
      'host style contamination audit',
      'managed-page source guards',
      'visual acceptance signals',
    ])
  ) {
    summary.push(
      '补充宿主污染与视觉验收审计：增加 host style contamination、managed-page source guard 与视觉验收信号，避免结构通过但视觉回退。',
    )
  }

  if (
    includesAny(notes, [
      'combo-page implementation facts requiring split ratio',
      'default split-layout contract',
      'hard-coded split right-track minimums',
      'missing min-inline-size: 0 on elastic panes',
    ])
  ) {
    summary.push(
      '收紧组合页分栏契约：左右布局默认独立滚动 owner，右侧内容区保持弹性，不允许默认 hard min track，并要求 elastic pane 明确声明 `min-inline-size: 0` / `min-width: 0`。',
    )
  }

  if (
    includesAny(notes, [
      'parent-adaptive table width strategy',
      'horizontal scroll must stay inside an inner table wrapper',
      'outer-container horizontal overflow ownership',
      'table overflow owner',
    ])
  ) {
    summary.push(
      '重写表格宽度与滚动策略：表格先适配父容器，外层 page/white-body/split pane 不得被表格撑破；宽度不足时，只允许表格内部 wrapper 持有横向滚动。',
    )
  }

  if (summary.length === 0 && versionMetadata['source-snapshot']) {
    summary.push(`版本快照：${versionMetadata['source-snapshot']}。`)
  }

  return summary
}

function takePaths(fileSet, matches) {
  const taken = []

  for (const relativePath of fileSet) {
    if (matches(relativePath)) {
      taken.push(relativePath)
    }
  }

  for (const relativePath of taken) {
    fileSet.delete(relativePath)
  }

  return taken
}

function buildObservedSummaries(entry) {
  const added = entry.added ?? []
  const deleted = entry.deleted ?? []
  const updated = entry.updated ?? []
  const allPaths = [...new Set([...added, ...updated, ...deleted])].sort()
  const fileSet = new Set(allPaths)
  const bullets = []
  const deltaParts = []

  if (added.length > 0) {
    deltaParts.push(`新增 ${added.length} 个文件`)
  }
  if (updated.length > 0) {
    deltaParts.push(`更新 ${updated.length} 个文件`)
  }
  if (deleted.length > 0) {
    deltaParts.push(`删除 ${deleted.length} 个文件`)
  }

  if (deltaParts.length > 0) {
    bullets.push(`记录到同日文件变更：${deltaParts.join('，')}。`)
  }

  const changelogAutomation = [
    'scripts/sync-changelog.mjs',
    'scripts/sync-feishu-release-doc.mjs',
    'scripts/release-skill-archive.mjs',
    'scripts/README.md',
  ]
  if (changelogAutomation.every((relativePath) => fileSet.has(relativePath))) {
    for (const relativePath of changelogAutomation) {
      fileSet.delete(relativePath)
    }

    bullets.push(
      '刷新发布链路：`release-skill-archive`、`sync-changelog` 与 `sync-feishu-release-doc` 的维护入口在同日被一起调整。',
    )
  }

  const exampleRuleFiles = [
    'SKILL.md',
    'rules/QUICK-START.md',
    'rules/generation-rules.md',
    'docs/onboarding/install-and-host.md',
  ]
  if (exampleRuleFiles.every((relativePath) => fileSet.has(relativePath))) {
    for (const relativePath of exampleRuleFiles) {
      fileSet.delete(relativePath)
    }

    bullets.push(
      '补充默认接入规则：外部新项目生成的页面一律视为业务页面，不再默认并入 `hiui-design` 官方示例、gallery、smoke 或 host-integration 路由。',
    )
  }

  const warrantyFiles = takePaths(
    fileSet,
    (relativePath) =>
      relativePath === 'examples/host-integration/src/routes/config.tsx' ||
      relativePath.includes('warranty-query'),
  )
  if (warrantyFiles.length > 0) {
    bullets.push(
      '移除 `三包查询` / `WarrantyQueryPage` 相关示例页、参考页及宿主示例路由入口，避免外部项目接入时被误当成默认示例页面。',
    )
  }

  const bucketSpecs = [
    { prefix: 'archetypes/', label: '`archetypes/` 页壳画像' },
    { prefix: 'agents/', label: '`agents/` agent 配置' },
    { prefix: 'rules/', label: '`rules/` 规则层' },
    { prefix: 'docs/onboarding/', label: '`docs/onboarding/` 接入文档' },
    { prefix: 'docs/generation/', label: '`docs/generation/` 生成说明' },
    { prefix: 'docs/business-lines/', label: '`docs/business-lines/` 业务线文档' },
    { prefix: 'scripts/', label: '`scripts/` 执行脚本' },
    { prefix: 'examples/', label: '`examples/` 示例工程' },
    { prefix: 'reference/', label: '`reference/` 参考资产' },
    { prefix: 'manifests/', label: '`manifests/` 清单定义' },
    { prefix: 'templates/', label: '`templates/` 模板资产' },
    { prefix: 'vendor/', label: '`vendor/` 分发快照' },
  ]

  const bucketCounts = []
  for (const spec of bucketSpecs) {
    const matched = takePaths(fileSet, (relativePath) => relativePath.startsWith(spec.prefix))
    if (matched.length > 0) {
      bucketCounts.push(`${spec.label} ${matched.length} 个文件`)
    }
  }

  if (fileSet.has('SKILL.md')) {
    fileSet.delete('SKILL.md')
    bucketCounts.push('`SKILL.md` skill 入口 1 个文件')
  }

  if (bucketCounts.length > 0) {
    bullets.push(`观察到同日规则资产变更：${bucketCounts.join('，')}。`)
  }

  return bullets
}

function buildDateSections({
  days,
  fallbackObservedFiles,
  history,
  releaseReport,
  versionMetadata,
}) {
  const observedEntries = new Map()

  if (hasHistoryEntries(history)) {
    for (const [dateKey, entry] of Object.entries(history.days)) {
      observedEntries.set(dateKey, normalizeHistoryEntry(entry))
    }
  } else {
    for (const [dateKey, files] of fallbackObservedFiles.entries()) {
      observedEntries.set(dateKey, {
        added: [],
        deleted: [],
        updated: files,
      })
    }
  }

  const dates = new Set(observedEntries.keys())

  if (releaseReport['released-at']) {
    dates.add(formatDate(new Date(releaseReport['released-at'])))
  }

  if (versionMetadata['last-updated']) {
    dates.add(versionMetadata['last-updated'])
  }

  const sortedRelevantDates = [...dates]
    .filter((dateKey) => isDateWithinWindow(dateKey, days))
    .sort((left, right) => left.localeCompare(right))

  if (sortedRelevantDates.length === 0) {
    return []
  }

  const firstDate = parseDateKey(sortedRelevantDates[0])
  const lastDate = parseDateKey(sortedRelevantDates[sortedRelevantDates.length - 1])
  const expandedDates = []

  if (firstDate && lastDate) {
    for (let cursor = firstDate; cursor <= lastDate; cursor = addDays(cursor, 1)) {
      const dateKey = formatDate(cursor)
      if (isDateWithinWindow(dateKey, days)) {
        expandedDates.push(dateKey)
      }
    }
  } else {
    expandedDates.push(...sortedRelevantDates)
  }

  return expandedDates
    .sort((left, right) => right.localeCompare(left))
    .map((dateKey) => {
      const bullets = []
      const entry = observedEntries.get(dateKey)

      if (releaseReport['released-at'] && formatDate(new Date(releaseReport['released-at'])) === dateKey) {
        const version = releaseReport.version || versionMetadata.version || '未标记版本'
        bullets.push(`发布 \`${version}\`，生成对外归档 \`outputs/archives/hiui-design.zip\`，并回写 \`outputs/RELEASE_REPORT.md\`。`)

        if ((releaseReport.steps ?? []).length > 0) {
          bullets.push(`发布前校验通过：${releaseReport.steps.map((step) => `\`${step}\``).join('、')}。`)
        }
      }

      if (versionMetadata['last-updated'] === dateKey) {
        bullets.push(...buildVersionSummary(versionMetadata))
      }

      if (entry) {
        bullets.push(...buildObservedSummaries(entry))
      }

      if (bullets.length === 0) {
        bullets.push('暂无可追溯修改记录（无 Git 提交、每日历史增量或可见文件时间戳）。')
      }

      return {
        bullets,
        dateKey,
      }
    })
}

function renderChangelog({ days, history, releaseReport, sections, versionMetadata, watch }) {
  const lines = [
    CHANGELOG_HEADER,
    '',
    '说明：',
    '- 本文件由 `scripts/sync-changelog.mjs` 自动生成。',
    '- 当前 changelog 维护一份持久化的每日变更历史；同一天内的多次修改会自动合并到同一个日期分组。',
    '- 历史补录优先使用 Git 提交日期；Git 无记录时，回退到当前可见文件的真实修改时间（mtime）按天回填。',
    '- 默认忽略 `.git/`、`outputs/`、`.DS_Store`、`.codex-write-check` 等隐藏或派生产物，避免噪声污染每日摘要。',
    '- 日期区间中的空白天会显式展示“暂无可追溯修改记录”，用于区分“没有记录”与“没有该日期分组”。',
    '- 当前 `hiui-design` skill 目录的历史仍属于最佳努力追溯；若某一天既无 Git 提交、又无可见文件时间戳，则无法还原更细的修改明细。',
    versionMetadata.version ? `- 当前版本：\`${versionMetadata.version}\`` : '- 当前版本：未标记',
    watch
      ? '- 当前执行启用了 `--watch`；脚本会在检测到技能目录变更后自动刷新 changelog。'
      : '- 如需在维护期自动刷新，可执行 `node scripts/sync-changelog.mjs --watch`。',
    '',
  ]

  if (days) {
    lines.splice(
      8,
      0,
      `- 当前输出通过 \`--days ${days}\` 临时收窄到最近 ${days} 天（含今天）的每日聚合结果。`,
    )
  }

  for (const section of sections) {
    if (section.bullets.length === 0) {
      continue
    }

    lines.push(`## ${section.dateKey}`)
    lines.push('')

    for (const bullet of section.bullets) {
      lines.push(`- ${bullet}`)
    }

    lines.push('')
  }

  if (sections.length === 0) {
    lines.push('## 暂无可追溯变更')
    lines.push('')
    lines.push('- 当前窗口内未观察到可见文件更新、每日历史快照或发布记录。')
    lines.push('')
  }

  lines.push('## 追溯来源')
  lines.push('')
  lines.push(`- 版本文件：\`rules/VERSION\`（last-updated: ${versionMetadata['last-updated'] || '未记录'}）`)
  lines.push(
    releaseReport['released-at']
      ? `- 发布报告：\`outputs/RELEASE_REPORT.md\`（released-at: ${releaseReport['released-at']}）`
      : '- 发布报告：未检测到 `outputs/RELEASE_REPORT.md`',
  )
  lines.push(
    hasHistoryEntries(history)
      ? `- 每日历史：\`${CHANGELOG_HISTORY_FILE}\`（按天合并 Git / mtime 推导出的新增 / 更新 / 删除路径）`
      : '- 每日历史：尚未建立持久化快照，当前内容含回退追溯结果',
  )
  lines.push(`- 快照文件：\`${CHANGELOG_SNAPSHOT_FILE}\``)
  lines.push('')

  return lines.join('\n').trimEnd() + '\n'
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function syncChangelog({
  days,
  gitHistory,
  history,
  historyPath,
  outputPath,
  previousSnapshot,
  skillRoot,
  snapshotPath,
  watch,
}) {
  const versionFilePath = path.join(skillRoot, 'rules', 'VERSION')
  const reportPath = path.join(skillRoot, 'outputs', 'RELEASE_REPORT.md')
  const versionMetadata = parseVersionFile(await readText(versionFilePath))
  const releaseReport = (await pathExists(reportPath))
    ? parseReleaseReport(await readText(reportPath))
    : { steps: [] }
  const currentSnapshot = await collectSnapshotState(skillRoot)
  const fallbackObservedFiles = currentSnapshot.visibleState.grouped
  const todayKey = formatDate(new Date())

  if (!previousSnapshot) {
    const bootstrapHistory = buildBootstrapHistory({
      fallbackObservedFiles,
      gitHistory,
    })
    history.createdAt = bootstrapHistory.createdAt
    history.days = bootstrapHistory.days
    history.historyVersion = bootstrapHistory.historyVersion
    history.updatedAt = bootstrapHistory.updatedAt
  } else {
    const delta = diffSnapshots(previousSnapshot, currentSnapshot)
    if (delta.hasVisibleChanges) {
      mergeHistoryEntry(history, todayKey, delta)
    }
  }

  const sections = buildDateSections({
    days,
    fallbackObservedFiles,
    history,
    releaseReport,
    versionMetadata,
  })
  const changelog = renderChangelog({
    days,
    history,
    releaseReport,
    sections,
    versionMetadata,
    watch,
  })

  await writeText(outputPath, changelog)
  await writeJson(historyPath, history)
  await writeJson(snapshotPath, {
    capturedAt: currentSnapshot.capturedAt,
    files: currentSnapshot.visibleState.snapshotFiles,
    releaseReport: currentSnapshot.releaseReport,
    snapshotVersion: SNAPSHOT_VERSION,
  })

  return {
    datedSections: sections.filter((section) => section.bullets.length > 0).length,
    historyUpdatedAt: history.updatedAt,
    outputPath,
    snapshot: {
      capturedAt: currentSnapshot.capturedAt,
      files: currentSnapshot.visibleState.snapshotFiles,
      releaseReport: currentSnapshot.releaseReport,
      snapshotVersion: SNAPSHOT_VERSION,
    },
    version: versionMetadata.version || 'unversioned',
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const outputPath = options.output
    ? path.resolve(options.output)
    : path.join(skillRoot, 'CHANGELOG.md')
  const historyPath = path.join(skillRoot, CHANGELOG_HISTORY_FILE)
  const snapshotPath = path.join(skillRoot, CHANGELOG_SNAPSHOT_FILE)
  const gitHistory = await collectGitHistory(skillRoot)
  let history = await loadJsonOrDefault(historyPath, createEmptyHistory)
  let previousSnapshot = await loadJsonOrDefault(snapshotPath, () => null)

  if (shouldRebuildHistory(history, previousSnapshot, options)) {
    history = createEmptyHistory()
    previousSnapshot = null
  }

  const runOnce = async (reason) => {
    const result = await syncChangelog({
      days: options.days,
      gitHistory,
      history,
      historyPath,
      outputPath,
      previousSnapshot,
      skillRoot,
      snapshotPath,
      watch: options.watch,
    })

    previousSnapshot = result.snapshot
    console.log(`Synced changelog: ${result.outputPath}`)
    console.log(`- scope: ${options.days ? `recent ${options.days} days` : 'full daily history'}`)
    console.log(`- dated sections: ${result.datedSections}`)
    console.log(`- version: ${result.version}`)
    if (reason) {
      console.log(`- trigger: ${reason}`)
    }
  }

  await runOnce('initial sync')

  if (!options.watch) {
    return
  }

  console.log(`Watching for changelog-relevant changes every ${options.interval}ms...`)

  while (true) {
    await sleep(options.interval)

    const nextSnapshot = await collectSnapshotState(skillRoot)
    const delta = previousSnapshot ? diffSnapshots(previousSnapshot, nextSnapshot) : null

    if (!delta || delta.hasVisibleChanges || delta.hasReleaseReportChange) {
      await runOnce(delta?.hasReleaseReportChange && !delta?.hasVisibleChanges ? 'release report changed' : 'visible files changed')
    }
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`sync-changelog failed: ${message}`)
  process.exit(1)
})
