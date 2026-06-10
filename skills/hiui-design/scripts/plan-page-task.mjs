#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'

const CONTRACT_VERSION = 1
const LIST_SHELL_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'data-visualization',
])

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/plan-page-task.mjs" --change <text> [--page-type <page-type-id>] [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--target <project-root>] [--page <relative-page-path>] [--json]

Notes:
  - This is the machine planning entry for page-related work.
  - It does not implement the page; it returns task level, routing facts, required docs, required commands, contract fields, and blocking reasons.
`)
}

function parseMajorVersion(spec) {
  const match = String(spec || '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

async function readTargetPackageJson(targetRoot) {
  try {
    return JSON.parse(await fs.readFile(path.join(targetRoot, 'package.json'), 'utf8'))
  } catch {
    return null
  }
}

function inferMode(pkg, hostProfile, requestedMode) {
  if (requestedMode && requestedMode !== 'auto') {
    return { id: requestedMode, source: 'explicit' }
  }

  const dependencies = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
    ...(pkg?.peerDependencies ?? {}),
  }
  const reactMajor = parseMajorVersion(dependencies.react)
  const reactDomMajor = parseMajorVersion(dependencies['react-dom'])
  const hiuiMajor = parseMajorVersion(dependencies['@hi-ui/hiui'])
  const hasHiui5Alias = Boolean(dependencies.hiui5)

  if (
    (reactMajor > 0 && reactMajor < 18) ||
    (reactDomMajor > 0 && reactDomMajor < 18) ||
    (hasHiui5Alias && hiuiMajor > 0 && hiuiMajor < 5)
  ) {
    return { id: 'legacy-host-compatible', source: 'detected-dependencies' }
  }

  return {
    id: hostProfile?.recommendedMode || 'rules-only',
    source: hostProfile?.recommendedMode ? 'host-profile' : 'default',
  }
}

function inferTaskLevel(changeText, pageTypeId) {
  const text = String(changeText || '').toLowerCase()
  const isMinor =
    /(文案|copy|rename|改名|列名|颜色|间距|icon|图标|微调|修复)/i.test(text) &&
    !/(新增|新建|生成|重构|rearchitecture|redesign|页面|route)/i.test(text)

  if (isMinor) {
    return { id: 'minor-edit', source: 'inferred-from-change' }
  }

  if (pageTypeId || /(新增|新建|生成|页面|route|重构|redesign|rearchitecture)/i.test(text)) {
    return { id: 'new-page-or-rearchitecture', source: 'inferred-from-change' }
  }

  return { id: 'managed-page-change', source: 'default' }
}

function parseArgs(argv) {
  const options = {
    change: '',
    json: false,
    line: '',
    mode: 'auto',
    page: '',
    pageTypeId: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (
      arg === '--change' ||
      arg === '--page-type' ||
      arg === '--mode' ||
      arg === '--target' ||
      arg === '--page' ||
      arg === '--line'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--change') options.change = value
      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--mode') options.mode = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--page') options.page = value
      if (arg === '--line') options.line = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.change) {
    throw new Error('Missing --change')
  }

  return options
}

function requiredDocsForPlan({ isNonTypical, mode, pageTypeId }) {
  const docs = [
    'rules/QUICK-START.md',
    'rules/mode-selection.md',
    'rules/page-type-map.md',
    'rules/contract-regions.md',
    'rules/generation-rules.md',
    'docs/generation/ai-kickoff-template.md',
  ]

  if (isNonTypical) {
    docs.push('docs/generation/non-typical-pages.md')
  } else if (pageTypeId) {
    docs.push('docs/generation/figma-page-rules.md')
  }

  if (mode === 'rules-only') {
    docs.push('docs/generation/rules-only-component-matrix.md')
  }

  docs.push('docs/generation/i18n-baseline.md')
  return Array.from(new Set(docs))
}

function requiredCommandsForTask({ taskLevel }) {
  if (taskLevel.id === 'minor-edit') {
    return [
      {
        script: 'typical-page:doctor',
        args: [],
        when: 'after the small edit',
      },
    ]
  }

  return [
    {
      script: 'typical-page:select-archetype',
      args: ['--page-type <page-type>'],
      when: 'after page type is selected',
    },
    {
      script: 'typical-page:start-page',
      args: ['--page-type <page-type>', '--page <new-page>'],
      when: 'before implementation',
    },
    {
      script: 'typical-page:preflight',
      args: ['--page <new-page>'],
      when: 'before business JSX/detail implementation',
    },
    {
      script: 'typical-page:source-gate',
      args: ['--file <new-page>'],
      when: 'after implementation',
    },
    {
      script: 'typical-page:doctor',
      args: [],
      when: 'after implementation',
    },
    {
      script: 'typical-page:finalize-page',
      args: [
        '--page-type <page-type>',
        '--page <new-page>',
        '--archetype <host-archetype-path>',
        '--region <name=target>',
      ],
      when: 'before claiming managed delivery complete',
    },
  ]
}

function conditionalCommandsForTask({ taskLevel }) {
  if (taskLevel.id === 'minor-edit') {
    return []
  }

  return [
    {
      script: 'typical-page:runtime-smoke',
      args: ['--page <new-page>', '--url <url>'],
      when: 'runtime smoke is required by page type, scroll strategy, chart-section, or split pane contract',
    },
    {
      script: 'typical-page:preview-ready',
      args: ['--page <new-page>', '--url <url>', '--report-mode <mode>', '--prompt <prompt>'],
      when: 'before final response after a renderable page preview exists',
    },
  ]
}

function contractFieldsNeeded({ layoutArchetype, mode, pageTypeId }) {
  const fields = [
    'generatedPagePath',
    'pageTypeId',
    'archetypeMode',
    'examplePath',
    'hostArchetypePath',
    'regionMapping',
    'ownershipMode',
    'ownershipMapping',
    'layoutStrategy',
    'layoutArchetype',
    'workflow',
  ]

  if (
    ['rules-only', 'legacy-host-compatible'].includes(mode) &&
    LIST_SHELL_PAGE_TYPES.has(pageTypeId)
  ) {
    fields.push('shellInheritanceStrategy', 'shellCarrierPath')
  }

  if (layoutArchetype === 'context-main-split') {
    fields.push('splitShellInheritanceStrategy', 'splitShellCarrierPath')
  }

  return Array.from(new Set(fields))
}

async function buildPlan(options) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
  const pageType = options.pageTypeId
    ? manifest.pageTypes.find((item) => item.id === options.pageTypeId)
    : null
  const hostProfile = await detectHostProfile(options.target)
  const pkg = (await readTargetPackageJson(options.target)) || hostProfile.pkg
  const mode = inferMode(pkg, hostProfile, options.mode)
  const taskLevel = inferTaskLevel(options.change, options.pageTypeId)
  const blockingReasons = []

  if (options.pageTypeId && !pageType) {
    blockingReasons.push(`unknown pageType: ${options.pageTypeId}`)
  }

  if (taskLevel.id === 'new-page-or-rearchitecture' && !options.pageTypeId) {
    blockingReasons.push('missing pageType')
  }

  const archetype = pageType
    ? await loadArchetypeDefinition({ skillRoot, pageTypeId: pageType.id })
    : null
  const isNonTypical = !pageType && taskLevel.id !== 'minor-edit'
  const layoutArchetype = isNonTypical ? 'unknown' : 'typical-page'

  return {
    version: 1,
    contractVersion: CONTRACT_VERSION,
    taskLevel,
    mode,
    pageType: {
      id: pageType?.id || options.pageTypeId || '',
      label: pageType?.label || '',
      source: options.pageTypeId ? 'explicit' : '',
    },
    isNonTypical,
    layoutOverlayRequired: isNonTypical,
    requiredDocs: requiredDocsForPlan({
      isNonTypical,
      mode: mode.id,
      pageTypeId: pageType?.id || options.pageTypeId,
    }),
    requiredCommands: requiredCommandsForTask({ taskLevel }),
    conditionalCommands: conditionalCommandsForTask({ taskLevel }),
    contractFieldsNeeded: contractFieldsNeeded({
      layoutArchetype,
      mode: mode.id,
      pageTypeId: pageType?.id || options.pageTypeId,
    }),
    kickoffSkeleton: {
      mode: mode.id,
      pageType: pageType?.id || options.pageTypeId || '',
      taskLevel: taskLevel.id,
      examplePath: archetype?.archetype?.examplePath || pageType?.assetExamplePath || '',
      templateDir: archetype?.archetype?.modeAdapters?.[mode.id]?.templateDir || '',
    },
    runtimeSmokePlan: {
      required: LIST_SHELL_PAGE_TYPES.has(pageType?.id || options.pageTypeId),
      command: 'typical-page:runtime-smoke --page <new-page> --url <url>',
    },
    usagePolicy: {
      mode: 'follow-workspace-policy',
      source: '`PRIVACY.md`',
      requireNetworkAuthorization: 'when usage script exits 21',
    },
    factsSource: {
      mode: 'rules/mode-selection.md',
      pageTypes: 'rules/common.page-types.json',
      archetypes: 'archetypes/page-types/*/archetype.json',
      usagePolicy: '`PRIVACY.md`',
    },
    canStartImplementation: blockingReasons.length === 0,
    blockingReasons,
    decisionTracePath: '',
  }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const plan = await buildPlan(options)

    if (options.json) {
      console.log(JSON.stringify(plan, null, 2))
      return
    }

    console.log('HiUI page task plan:')
    console.log(`- task level: ${plan.taskLevel.id}`)
    console.log(`- mode: ${plan.mode.id}`)
    console.log(`- page type: ${plan.pageType.id || '(missing)'}`)
    console.log(`- can start implementation: ${plan.canStartImplementation}`)
    if (plan.blockingReasons.length > 0) {
      console.log(`- blocking reasons: ${plan.blockingReasons.join('; ')}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`plan-page-task failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
