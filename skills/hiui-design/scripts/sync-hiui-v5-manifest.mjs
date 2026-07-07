#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildHiuiV5ManifestPaths,
  collectExplicitComponentMentions,
  parseHiuiV5ComponentIndex,
  pathExists,
  PUBLIC_HIUI_V5_SOURCE_LABEL,
  readJson,
  readText,
  resolveHiuiV5DocsRoot,
  stripGeneratedHiuiV5Catalog,
  writeJson,
} from './lib/hiui-v5-knowledge.mjs'

const DEFAULT_NON_COMPONENT_ALTERNATIVES = [
  'customInfoBlock',
  'fieldCard',
  'heroCard',
  'infoStrip',
  'mediaCard',
  'meta-row',
  'secondary-info-band',
  'summaryStrip',
  'text-row',
]

const AUTO_PRIORITY_OVERRIDES = {
  Alert: 'primary',
  Card: 'secondary',
  Cascader: 'primary',
  Descriptions: 'primary',
  Drawer: 'secondary',
  EmptyState: 'primary',
  Form: 'primary',
  GlobalContext: 'helper',
  Highlighter: 'helper',
  HiUI: 'helper',
  Input: 'primary',
  List: 'primary',
  LocaleContext: 'helper',
  Message: 'secondary',
  Modal: 'secondary',
  NumberInput: 'primary',
  PageHeader: 'primary',
  Pagination: 'secondary',
  Popover: 'secondary',
  Portal: 'helper',
  PortalContext: 'helper',
  Provider: 'helper',
  QueryFilter: 'primary',
  Result: 'primary',
  Search: 'secondary',
  Select: 'primary',
  Space: 'helper',
  Table: 'primary',
  Timeline: 'primary',
  Tooltip: 'helper',
  TreeSelect: 'primary',
}

function parseArgs(argv) {
  const options = {
    check: false,
    source: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--check') {
      options.check = true
      continue
    }

    if (arg === '--source') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --source')
      }
      options.source = value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/sync-hiui-v5-manifest.mjs [--check] [--source <hiui-v5-root>]\n' +
          '       or set HIUI_V5_DOCS_ROOT=/path/to/.local-context/hiui-v5',
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function mergeUnique(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right))
}

function sanitizeGeneratedNotes(notes) {
  return (notes ?? []).filter(
    (note) =>
      note !== 'A future sync-hiui-v5-manifest.mjs should expand this file to the full HiUI v5 catalog.' &&
      note !== 'Seed manifest only covers the first high-frequency component set.',
  )
}

function deriveFrequency({
  componentName,
  existingComponent,
  mediumMentions,
}) {
  if (componentName === 'HiUI') {
    return 'low'
  }

  if (existingComponent?.frequency) {
    return existingComponent.frequency
  }

  if (existingComponent?.quickReference?.group) {
    return 'high'
  }

  if (mediumMentions.has(componentName)) {
    return 'medium'
  }

  return 'low'
}

function deriveDefaultPriority(componentName, existingComponent) {
  if (existingComponent?.defaultPriority) {
    return existingComponent.defaultPriority
  }

  return AUTO_PRIORITY_OVERRIDES[componentName] ?? 'secondary'
}

function buildComponentRecord({
  componentName,
  docPath,
  summary,
  existingComponent,
  mediumMentions,
}) {
  return {
    name: componentName,
    aliases: Array.isArray(existingComponent?.aliases) ? existingComponent.aliases : [],
    importSource: existingComponent?.importSource || '@hi-ui/hiui',
    iconImportSource: existingComponent?.iconImportSource || '@hi-ui/icons',
    upstreamDocPath: docPath,
    upstreamSummary: summary,
    frequency: deriveFrequency({
      componentName,
      existingComponent,
      mediumMentions,
    }),
    ...(existingComponent?.quickReference && typeof existingComponent.quickReference === 'object'
      ? { quickReference: existingComponent.quickReference }
      : {}),
    semanticRoles: Array.isArray(existingComponent?.semanticRoles) ? existingComponent.semanticRoles : [],
    notFor: Array.isArray(existingComponent?.notFor) ? existingComponent.notFor : [],
    alternatives: Array.isArray(existingComponent?.alternatives) ? existingComponent.alternatives : [],
    defaultPriority: deriveDefaultPriority(componentName, existingComponent),
    notes: Array.isArray(existingComponent?.notes) ? existingComponent.notes : [],
  }
}

function buildSpecialTokens(existingSpecialTokens) {
  const nextSpecialTokens = {
    ...(existingSpecialTokens ?? {}),
  }

  nextSpecialTokens.nonComponentAlternatives = mergeUnique([
    ...(existingSpecialTokens?.nonComponentAlternatives ?? []),
    ...DEFAULT_NON_COMPONENT_ALTERNATIVES,
  ])

  return nextSpecialTokens
}

async function loadExistingManifest(componentManifestPath) {
  if (!(await pathExists(componentManifestPath))) {
    return {
      $schemaVersion: 1,
      status: 'seed-high-frequency-only',
      generated: {},
      defaults: {
        importSource: '@hi-ui/hiui',
        iconImportSource: '@hi-ui/icons',
      },
      specialTerms: {
        nonComponentAlternatives: DEFAULT_NON_COMPONENT_ALTERNATIVES,
      },
      components: {},
    }
  }

  return readJson(componentManifestPath)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const sourceRoot = await resolveHiuiV5DocsRoot(skillRoot, options.source)
  const {
    componentManifestPath,
    routingDocPath,
    componentMapDocPath,
  } = buildHiuiV5ManifestPaths(skillRoot)

  const [readmeText, routingDocText, componentMapText, existingManifest] =
    await Promise.all([
      readText(path.join(sourceRoot, 'README.md')),
      readText(routingDocPath),
      readText(componentMapDocPath),
      loadExistingManifest(componentManifestPath),
    ])

  const upstreamComponents = parseHiuiV5ComponentIndex(readmeText)
  const componentNames = upstreamComponents.map((item) => item.componentName)
  const manualComponentMapText = stripGeneratedHiuiV5Catalog(componentMapText)
  const mediumMentions = new Set([
    ...collectExplicitComponentMentions(routingDocText, componentNames),
    ...collectExplicitComponentMentions(manualComponentMapText, componentNames),
  ])

  const nextComponents = {}
  for (const item of upstreamComponents) {
    nextComponents[item.componentName] = buildComponentRecord({
      componentName: item.componentName,
      docPath: item.docPath,
      summary: item.summary,
      existingComponent: existingManifest.components?.[item.componentName],
      mediumMentions,
    })
  }

  const orphanComponents = Object.keys(existingManifest.components ?? {}).filter(
    (componentName) => !(componentName in nextComponents),
  )

  for (const componentName of orphanComponents.sort((left, right) => left.localeCompare(right))) {
    nextComponents[componentName] = existingManifest.components[componentName]
  }

  const nextManifest = {
    $schemaVersion: existingManifest.$schemaVersion ?? 1,
    status: upstreamComponents.length === Object.keys(nextComponents).length ? 'catalog-synced' : 'catalog-synced-with-orphans',
    generated: {
      source: PUBLIC_HIUI_V5_SOURCE_LABEL,
      componentCount: upstreamComponents.length,
      lastSyncedAt: options.check
        ? existingManifest.generated?.lastSyncedAt || ''
        : new Date().toISOString(),
      notes: mergeUnique([
        ...sanitizeGeneratedNotes(existingManifest.generated?.notes),
        'Auto-managed fields come from hiui-v5 README.md and local document-mention heuristics.',
        'Generated section tracks the full upstream HiUI v5 component catalog.',
        'Semantic and quick-reference fields should be preserved across sync runs and filled incrementally.',
        orphanComponents.length ? 'Orphan components are preserved until manually removed.' : '',
      ]),
    },
    defaults: {
      importSource: existingManifest.defaults?.importSource || '@hi-ui/hiui',
      iconImportSource: existingManifest.defaults?.iconImportSource || '@hi-ui/icons',
    },
    specialTerms: buildSpecialTokens(existingManifest.specialTerms),
    components: nextComponents,
  }

  const expected = `${JSON.stringify(nextManifest, null, 2)}\n`
  const actualManifest = await readText(componentManifestPath).catch((error) => {
    if (error?.code === 'ENOENT') {
      return ''
    }
    throw error
  })
  const actual = actualManifest.endsWith('\n') || !actualManifest ? actualManifest : `${actualManifest}\n`

  if (options.check) {
    if (actual !== expected) {
      console.log('HiUI v5 manifest is out of date:')
      console.log(`- ${path.relative(skillRoot, componentManifestPath)}`)
      console.log(`- source: ${PUBLIC_HIUI_V5_SOURCE_LABEL}`)
      process.exit(1)
    }

    console.log('HiUI v5 manifest already synced.')
    console.log(`- ${path.relative(skillRoot, componentManifestPath)}`)
    console.log(`- components: ${upstreamComponents.length}`)
    return
  }

  await writeJson(componentManifestPath, nextManifest)
  console.log('HiUI v5 manifest synced:')
  console.log(`- ${path.relative(skillRoot, componentManifestPath)}`)
  console.log(`- source: ${PUBLIC_HIUI_V5_SOURCE_LABEL}`)
  console.log(`- components: ${upstreamComponents.length}`)
  if (orphanComponents.length) {
    console.log(`- orphan-components-preserved: ${orphanComponents.join(', ')}`)
  }
}

await main()
