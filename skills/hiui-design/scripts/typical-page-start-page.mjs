#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
} from './lib/managed-page-artifacts.mjs'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import {
  getManagedPageSourceCommentLines,
  getManagedPageSourceOwnershipAttributes,
  getManagedPageSourceRegionAttributes,
  getManagedPageSourceRootAttributes,
  renderManagedPageSourceContractSnippet,
} from './lib/managed-page-source-guard.mjs'
import {
  MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT,
  RULES_ONLY_OWNERSHIP_MODES,
  buildRulesOnlyPageContract,
  findArchetypeSmokeBaselineEntry,
  getDefaultScrollStrategyForPageType,
  getManagedPageRuntimeSmokeDefaultStatus,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  getRulesOnlyPageContractsDir,
  normalizeContractPath,
  renderRulesOnlyPageContractMarkdown,
  toContractSlug,
  validateRulesOnlyPageContract,
} from './lib/rules-only-page-contracts.mjs'

const FIXED_TEMPLATE_PAGE_TYPES = new Set([
  'data-visualization',
  'table-stat',
  'full-page-edit',
  'full-page-detail',
])

function parseMajorVersion(spec) {
  const match = String(spec || '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

async function readTargetPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  try {
    const raw = await fs.readFile(packageJsonPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function inferMode(pkg, hostProfile, requestedMode) {
  if (requestedMode && requestedMode !== 'auto') {
    return requestedMode
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
    return 'legacy-host-compatible'
  }

  return hostProfile?.recommendedMode || 'rules-only'
}

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-start-page.mjs" --page-type <page-type-id> --page <relative-page-path> [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--archetype <relative-host-archetype-path>] [--query-filter-region-role <table-query-filter|dashboard-control-strip|not-applicable>] [--region <name=target> ...] [--ownership-mode <${RULES_ONLY_OWNERSHIP_MODES.join('|')}>] [--ownership <role=target> ...] [--local-bypass <package=<pkg>;gap=<capability-gap>;adapter=<relative-path>;bridge=<relative-path>;containment=<${MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.join('|')}>> ...] [--line <line-id>] [--target <project-root>] [--force] [--json] [--contract-fixture <table-basic-started>]

Default behavior:
  1. resolve the packaged page type + archetype
  2. write a started contract stub with workflow.status=started
  3. stamp default semantic-contract rules such as query-filter role and single spacing-owner policy
  4. create a structured scaffold that already carries hiui-design source markers, root ownership, a real header carrier, one white-body workspace, and first-tier managed regions
  4. stop before delivery; current-page completion still requires typical-page:finalize-page
`)
}

function parseKeyValueList(values, flagName) {
  return values.map((value) => {
    const separatorIndex = value.indexOf('=')
    if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
      throw new Error(`Invalid ${flagName} value: ${value}. Expected name=target`)
    }

    const key = value.slice(0, separatorIndex).trim()
    const target = value.slice(separatorIndex + 1).trim()
    if (!key || !target) {
      throw new Error(`Invalid ${flagName} value: ${value}. Expected name=target`)
    }

    return { key, target }
  })
}

function parseArgs(argv) {
  const options = {
    archetype: '',
    contractFixture: '',
    force: false,
    json: false,
    line: '',
    localBypasses: [],
    mode: 'auto',
    ownershipMode: '',
    ownerships: [],
    page: '',
    pageTypeId: '',
    queryFilterRegionRole: '',
    regions: [],
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (
      arg === '--page-type' ||
      arg === '--page' ||
      arg === '--mode' ||
      arg === '--archetype' ||
      arg === '--line' ||
      arg === '--target' ||
      arg === '--ownership-mode' ||
      arg === '--query-filter-region-role' ||
      arg === '--contract-fixture'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--page') options.page = value
      if (arg === '--mode') options.mode = value
      if (arg === '--archetype') options.archetype = value
      if (arg === '--line') options.line = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--ownership-mode') options.ownershipMode = value
      if (arg === '--query-filter-region-role') options.queryFilterRegionRole = value
      if (arg === '--contract-fixture') options.contractFixture = value
      index += 1
      continue
    }

    if (arg === '--region' || arg === '--ownership' || arg === '--local-bypass') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--region') options.regions.push(value)
      if (arg === '--ownership') options.ownerships.push(value)
      if (arg === '--local-bypass') options.localBypasses.push(value)
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageTypeId) throw new Error('Missing --page-type')
  if (!options.page) throw new Error('Missing --page')
  if (options.contractFixture && !['table-basic-started'].includes(options.contractFixture)) {
    throw new Error('Expected --contract-fixture to be one of: table-basic-started')
  }

  return options
}

function parseLocalBypasses(values, targetRoot) {
  return values.map((value) => {
    const record = {}

    for (const segment of String(value || '').split(';')) {
      const trimmedSegment = segment.trim()
      if (!trimmedSegment) continue

      const separatorIndex = trimmedSegment.indexOf('=')
      if (separatorIndex <= 0 || separatorIndex === trimmedSegment.length - 1) {
        throw new Error(
          `Invalid --local-bypass value: ${value}. Expected package=<pkg>;gap=<capability-gap>;adapter=<path>;bridge=<path>;containment=<value>`
        )
      }

      const rawKey = trimmedSegment.slice(0, separatorIndex).trim()
      const rawValue = trimmedSegment.slice(separatorIndex + 1).trim()
      const normalizedKey = {
        package: 'packageSpec',
        packageSpec: 'packageSpec',
        gap: 'capabilityGap',
        capabilityGap: 'capabilityGap',
        adapter: 'adapterPath',
        adapterPath: 'adapterPath',
        bridge: 'tokenBridgePath',
        tokenBridgePath: 'tokenBridgePath',
        containment: 'ownerContainment',
        ownerContainment: 'ownerContainment',
      }[rawKey]

      if (!normalizedKey) {
        throw new Error(
          `Invalid --local-bypass key: ${rawKey}. Supported keys: package, gap, adapter, bridge, containment`
        )
      }

      record[normalizedKey] =
        normalizedKey === 'adapterPath' || normalizedKey === 'tokenBridgePath'
          ? normalizeContractPath(targetRoot, rawValue)
          : rawValue
    }

    if (
      record.ownerContainment &&
      !MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.includes(record.ownerContainment)
    ) {
      throw new Error(
        `Invalid --local-bypass containment: ${record.ownerContainment}. Expected one of: ${MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.join(
          ', '
        )}`
      )
    }

    return record
  })
}

function toComponentName(pagePath) {
  const baseName = path.basename(pagePath, path.extname(pagePath)) || 'managed-page'
  const parentName = path.basename(path.dirname(pagePath))
  const rawName = baseName === 'index' ? parentName || 'managed-page' : baseName
  const normalized = String(rawName || 'managed-page').replace(/[^a-zA-Z0-9]+/g, ' ')

  const pascal = normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('')

  return pascal || 'ManagedTypicalPage'
}

function toDirectoryArtifactEntryPagePath(pagePath) {
  const extension = path.extname(pagePath)
  const baseName = path.basename(pagePath, extension)
  if (baseName === 'index') {
    return pagePath
  }

  return path.join(path.dirname(pagePath), baseName, `index${extension}`).replace(/\\/g, '/')
}

function buildArtifactPathMap(entryPagePath) {
  const extension = path.extname(entryPagePath)
  const entryDir = path.dirname(entryPagePath)

  return {
    entryPagePath,
    sectionsPagePath: path.join(entryDir, `sections${extension}`).replace(/\\/g, '/'),
    sectionsStylePath: path.join(entryDir, 'sections.module.scss').replace(/\\/g, '/'),
  }
}

function indentBlock(text, prefix) {
  return String(text || '')
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
}

function replaceAllText(source, searchValue, replaceValue) {
  return String(source).split(String(searchValue)).join(String(replaceValue))
}

function toImportSpecifier(fromPagePath, targetPathWithoutExt) {
  const relativePath = path
    .relative(path.dirname(fromPagePath), targetPathWithoutExt)
    .replace(/\\/g, '/')

  if (!relativePath) return '.'
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

function toJsxAttrList(attrs) {
  return attrs.map((attr) => `${attr.name}="${attr.value}"`)
}

function toArtifactList(singlePath, source) {
  return [
    {
      filePath: singlePath,
      source,
    },
  ]
}

function renderJsObjectLiteral(attrs) {
  if (!attrs || attrs.length === 0) {
    return '{}'
  }

  const body = attrs
    .map((attr) => `  '${attr.name}': ${JSON.stringify(attr.value)},`)
    .join('\n')

  return `{\n${body}\n}`
}

function buildTemplateFileCandidates(templateDir) {
  const normalizedDir = String(templateDir || '').replace(/\\/g, '/').replace(/\/+$/, '')
  if (!normalizedDir) {
    return []
  }

  return [
    `${normalizedDir}/page.template.tsx`,
    `${normalizedDir}/page.template.jsx`,
    `${normalizedDir}/template.tsx`,
    `${normalizedDir}/template.jsx`,
  ]
}

async function resolveStrictTemplateAsset({ contract, skillRoot }) {
  if (!(contract?.strictExampleGeneration && FIXED_TEMPLATE_PAGE_TYPES.has(contract?.pageTypeId))) {
    return null
  }

  const candidates = buildTemplateFileCandidates(contract.archetypeTemplatePath)
  if (candidates.length === 0) {
    throw new Error(
      `strictExampleGeneration is enabled for ${contract.pageTypeId}, but archetypeTemplatePath is empty. start-page cannot fall back to a free-form scaffold for this page type.`
    )
  }

  for (const relativePath of candidates) {
    const absolutePath = path.join(skillRoot, relativePath)
    try {
      const source = await fs.readFile(absolutePath, 'utf8')
      if (String(source || '').trim()) {
        return {
          absolutePath,
          relativePath: relativePath.replace(/\\/g, '/'),
          source,
        }
      }
    } catch {
      // try the next candidate
    }
  }

  throw new Error(
    `strictExampleGeneration is enabled for ${contract.pageTypeId}, but no executable template was found under ${contract.archetypeTemplatePath}. Add page.template.tsx to the archetype template directory instead of relying on start-page scaffold synthesis.`
  )
}

function renderStrictTemplateSource({ contract, pagePath, templateAsset }) {
  const componentName = toComponentName(pagePath)
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const hasChartSection = Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some((item) => String(item?.region || '').trim().toLowerCase() === 'chart-section')
    : false
  const rootOwnerAttrs = ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  const whiteBodyOwnerAttrs = ownershipAttrs.filter((attr) => attr.role === 'white-body')
  const fixedDashboardFrameImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/fixed-dashboard-page-frame'
  )
  const dataVisualizationPrimitivesImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/data-visualization-primitives'
  )
  const hostPageHeaderPortalImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/layout/page-header-portal'
  )

  const templateMarkers = commentLines
    .map((line) => `      {/* ${line} */}`)
    .join('\n')
  const pageRootPropsLiteral = indentBlock(
    renderJsObjectLiteral([
      ...rootAttrs,
      ...rootOwnerAttrs,
      { name: 'data-hiui5-shell-inheritance', value: 'shared-shell-carrier' },
      { name: 'data-hiui5-shell-carrier', value: 'FixedDashboardPageFrame' },
      { name: 'data-hiui5-chart-stack', value: 'approved-wrapper' },
    ]),
    '          '
  ).trimStart()
  const whiteBodyPropsLiteral = indentBlock(
    renderJsObjectLiteral(whiteBodyOwnerAttrs),
    '          '
  ).trimStart()
  const pageRootAttrLines = indentBlock(
    toJsxAttrList([...rootAttrs, ...rootOwnerAttrs]).join('\n'),
    '        '
  ).trimStart()
  const whiteBodyAttrLines = indentBlock(
    toJsxAttrList(whiteBodyOwnerAttrs).join('\n'),
    '        '
  ).trimStart()
  const pageRootAttrLinesWithoutMainScroll = indentBlock(
    toJsxAttrList([
      ...rootAttrs,
      ...rootOwnerAttrs.filter((attr) => attr.role !== 'main-scroll'),
    ]).join('\n'),
    '        '
  ).trimStart()
  const optionalChartSection = hasChartSection
    ? [
        '            <div data-hiui5-region="chart-section">',
        '              {/* hiui-design chart-stack: approved-wrapper */}',
        '              {/* TODO: replace with the managed chart section + adaptive chart-body carriers here */}',
        '            </div>',
      ].join('\n')
    : ''

  return [
    ['__COMPONENT_NAME__', componentName],
    ['__HIUI_SOURCE_CONTRACT_MARKERS__', templateMarkers],
    ['__HIUI_PAGE_ROOT_PROPS__', pageRootPropsLiteral],
    ['__HIUI_WHITE_BODY_PROPS__', whiteBodyPropsLiteral],
    ['__HIUI_PAGE_ROOT_ATTR_LINES__', pageRootAttrLines],
    ['__HIUI_PAGE_ROOT_ATTR_LINES_NO_MAIN_SCROLL__', pageRootAttrLinesWithoutMainScroll],
    ['__HIUI_WHITE_BODY_ATTR_LINES__', whiteBodyAttrLines],
    ['__HIUI_OPTIONAL_CHART_SECTION__', optionalChartSection],
    ['__HIUI_TEMPLATE_PATH__', templateAsset.relativePath],
    ['__FIXED_DASHBOARD_FRAME_IMPORT__', fixedDashboardFrameImportPath],
    ['__DATA_VISUALIZATION_PRIMITIVES_IMPORT__', dataVisualizationPrimitivesImportPath],
    ['__HOST_PAGE_HEADER_PORTAL_IMPORT__', hostPageHeaderPortalImportPath],
  ].reduce(
    (source, [searchValue, replaceValue]) =>
      replaceAllText(source, searchValue, replaceValue),
    templateAsset.source
  )
}

function buildFullPageDetailShellArtifacts(pagePath, contract) {
  if (contract.pageTypeId !== 'full-page-detail') {
    return null
  }

  const entryPagePath = toDirectoryArtifactEntryPagePath(pagePath)
  const { entryPagePath: normalizedEntryPagePath, sectionsPagePath, sectionsStylePath } =
    buildArtifactPathMap(entryPagePath)
  const componentName = toComponentName(normalizedEntryPagePath)
  const detailBodyComponentName = `${componentName}Body`
  const supportingSectionsComponentName = `${componentName}SupportingSections`
  const hasChartSection = Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some((item) => String(item?.region || '').trim().toLowerCase() === 'chart-section')
    : false
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const shellImportPath = toImportSpecifier(
    normalizedEntryPagePath,
    'src/typical-page-reuse/components/managed-page/managed-full-page-detail-shell'
  )
  const primitivesImportPath = toImportSpecifier(
    sectionsPagePath,
    'src/typical-page-reuse/components/managed-page/data-visualization-primitives'
  )

  const entrySource = `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before finalize-page */
/* hiui-design shell: ManagedFullPageDetailShell */

import { ManagedFullPageDetailShell } from '${shellImportPath}'
import { ${detailBodyComponentName}${hasChartSection ? `, ${supportingSectionsComponentName}` : ''} } from './sections'

export default function ${componentName}() {
  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      <div
${indentBlock(toJsxAttrList(rootAttrs).join('\n'), '        ')}
      >
        <ManagedFullPageDetailShell
          title="TODO: replace page title"
          detailBody={<${detailBodyComponentName} />}
${hasChartSection ? `          chartSection={<${supportingSectionsComponentName} />}` : ''}
        />
      </div>
    </>
  )
}
`

  const sectionsSource = `import {
  ManagedSurfaceCard,
  SectionBlock,
} from '${primitivesImportPath}'
import styles from './sections.module.scss'

export function ${detailBodyComponentName}() {
  return (
    <div className={styles.groupStack}>
      <SectionBlock title="TODO_DETAIL_GROUP_TITLE">
        <div className={styles.sectionPlaceholder}>
          TODO: replace with grouped detail descriptions and long-text rows
        </div>
      </SectionBlock>

      <SectionBlock title="TODO_DETAIL_GROUP_TITLE">
        <div className={styles.sectionPlaceholder}>
          TODO: replace with the next detail group
        </div>
      </SectionBlock>
    </div>
  )
}

${hasChartSection ? `export function ${supportingSectionsComponentName}() {
  return (
    <div className={styles.supportingStack}>
      <SectionBlock region="chart-section" title="TODO_SUPPORTING_SECTION_TITLE">
        <ManagedSurfaceCard>
          {/* hiui-design chart-stack: approved-wrapper */}
          <div className={styles.sectionPlaceholder}>
            TODO: replace with a managed chart section only when the detail page really owns an independent analysis block
          </div>
        </ManagedSurfaceCard>
      </SectionBlock>
    </div>
  )
}
` : ''}
`

  const stylesSource = `.groupStack {
  display: grid;
  gap: 20px;
}

.supportingStack {
  display: grid;
  gap: 20px;
}

.sectionPlaceholder {
  color: #5f6a7a;
  line-height: 1.6;
}
`

  return [
    {
      filePath: normalizedEntryPagePath,
      source: entrySource,
    },
    {
      filePath: sectionsPagePath,
      source: sectionsSource,
    },
    {
      filePath: sectionsStylePath,
      source: stylesSource,
    },
  ]
}

function buildFixedDashboardManagedPageScaffold(pagePath, contract) {
  if (contract.pageTypeId !== 'data-visualization') {
    return ''
  }

  const componentName = toComponentName(pagePath)
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const regionNames = new Set(regionAttrs.map((attr) => attr.value))
  const rootOwnerAttrs = ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  const whiteBodyOwnerAttrs = ownershipAttrs.filter((attr) => attr.role === 'white-body')

  if (!regionNames.has('header') || !regionNames.has('white-body')) {
    return ''
  }

  const frameImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/fixed-dashboard-page-frame'
  )
  const primitivesImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/data-visualization-primitives'
  )

  return `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before finalize-page */

import { Button, Radio, Space } from '@hi-ui/hiui'
import { FixedDashboardPageFrame } from '${frameImportPath}'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedMetricCard,
  ManagedSurfaceCard,
  SectionBlock,
} from '${primitivesImportPath}'

export default function ${componentName}() {
  const viewModeOptions = [
    { id: 'day', title: 'day' },
    { id: 'week', title: 'week' },
    { id: 'month', title: 'month' },
  ]

  const headerExtra = (
    <Space>
      <Button appearance="line" type="default">
        TODO_ACTION
      </Button>
    </Space>
  )

  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      {/* hiui-design shell-inheritance: shared-shell-helper */}
      {/* hiui-design shell-carrier: FixedDashboardPageFrame -> ManagedWhiteBodyWorkspace */}
      {/* hiui-design shell-geometry guard: do not add pageRootStyle / whiteBodyStyle or style-bearing shell props here; geometry changes belong in shared shell variants */}
      {/* hiui-design chart-stack: approved-wrapper */}
      <FixedDashboardPageFrame
        extra={headerExtra}
        pageRootProps={${indentBlock(
          renderJsObjectLiteral([
            ...rootAttrs,
            ...rootOwnerAttrs,
            { name: 'data-hiui5-shell-inheritance', value: 'shared-shell-helper' },
            { name: 'data-hiui5-shell-carrier', value: 'FixedDashboardPageFrame' },
            { name: 'data-hiui5-chart-stack', value: 'approved-wrapper' },
          ]),
          '          '
        ).trimStart()}}
        title="TODO_PAGE_TITLE"
        whiteBodyProps={${indentBlock(renderJsObjectLiteral(whiteBodyOwnerAttrs), '          ').trimStart()}}
      >
        <SectionBlock
          description="TODO_OVERVIEW_DESCRIPTION"
          region="stat-section"
          title="TODO_OVERVIEW_TITLE"
        >
          <ManagedCardGrid minItemWidth={180}>
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
          </ManagedCardGrid>
        </SectionBlock>

        <DashboardControlStrip
          leading={
            <Radio.Group
              data={viewModeOptions}
              type="button"
              value="day"
            />
          }
          trailing={
            <>
              {/* TODO: when filters exceed 4 fields, keep them in inline dropdown controls instead of button groups */}
            </>
          }
        />

        <SectionBlock
          description="TODO_RISK_SECTION_DESCRIPTION"
          title="TODO_RISK_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>
              <div>TODO_RISK_LINE_NAME</div>
              <div>TODO_RISK_METRICS</div>
              <div>TODO_RISK_ACTIONS</div>
            </ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>

        <SectionBlock
          description="TODO_CHART_SECTION_DESCRIPTION"
          region="chart-section"
          title="TODO_CHART_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={320}>
            <ManagedChartCard
              body={<div>{/* TODO: replace with chart content */}</div>}
              description="TODO_CHART_DESCRIPTION"
              title="TODO_CHART_TITLE"
            />
            <ManagedChartCard
              body={<div>{/* TODO: replace with chart content */}</div>}
              description="TODO_CHART_DESCRIPTION"
              title="TODO_CHART_TITLE"
            />
          </ManagedCardGrid>
          <ManagedChartCard
            body={<div>{/* TODO: replace with chart content */}</div>}
            description="TODO_CHART_DESCRIPTION"
            title="TODO_CHART_TITLE"
          />
        </SectionBlock>

        <SectionBlock
          description="TODO_RECORD_SECTION_DESCRIPTION"
          title="TODO_RECORD_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>
              <div>TODO_RECORD_TIME</div>
              <div>TODO_RECORD_ROUTE</div>
              <div>TODO_RECORD_STATUS</div>
            </ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>

        <JoinedTableSection
          description="TODO_TABLE_SECTION_DESCRIPTION"
          pagination={<div>{/* TODO: replace with Pagination */}</div>}
          table={<div>{/* TODO: replace with managed Table region content */}</div>}
          title="TODO_TABLE_SECTION_TITLE"
        />
      </FixedDashboardPageFrame>
    </>
  )
}
`
}

function buildStructuredManagedPageScaffold(pagePath, contract) {
  const componentName = toComponentName(pagePath)
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const regionNames = new Set(regionAttrs.map((attr) => attr.value))
  const whiteBodyOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role === 'white-body')
  )
  const rootOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  )
  const portalImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/layout/page-header-portal'
  )
  const hasHeader = regionNames.has('header')
  const hasWhiteBody = regionNames.has('white-body')
  const hasPagination = regionNames.has('pagination')
  const bodyRegionOrder = getDeclaredBodyRegionOrder(contract)

  if (!hasHeader || !hasWhiteBody) {
    return ''
  }

  const regionLines = []
  for (const regionName of bodyRegionOrder) {
    if (regionName === 'table' && hasPagination) {
      regionLines.push(
        '        <section',
        `          data-hiui5-region="table"`,
        '        >',
        '          {/* TODO: mount the shared joined-table shell here; keep pagination inside the same container */}',
        '          <div data-hiui5-region="pagination">',
        '            {/* TODO: replace with real pagination inside the table shell */}',
        '          </div>',
        '        </section>'
      )
      continue
    }

    const regionSpecificComment =
      regionName === 'query-filter'
        ? 'TODO: mount the shared dashboard control strip here; do not rebuild this region as a form grid'
        : regionName === 'stat-section'
          ? 'TODO: mount shared stat-grid / stat-card primitives here; keep this top-level block flat and let the white-body own the surface'
          : regionName === 'chart-section'
            ? 'TODO: mount the shared chart section + adaptive chart-body carriers here'
            : `TODO: replace with the managed ${regionName} content`

    regionLines.push(
      '        <section',
      `          data-hiui5-region="${regionName}"`,
      '        >',
      `          {/* ${regionSpecificComment} */}`,
      '        </section>'
    )
  }

  return `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before finalize-page */

import { PageHeader } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '${portalImportPath}'

export default function ${componentName}() {
  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      <div
${indentBlock([...toJsxAttrList(rootAttrs), ...rootOwnerAttrs].join('\n'), '        ')}
      >
        <HostPageHeaderPortal>
          <PageHeader
            data-hiui5-region="header"
            style={{ minHeight: 60 }}
            title="TODO: replace page title"
          >
          </PageHeader>
        </HostPageHeaderPortal>
        <div
          data-hiui5-region="white-body"
${whiteBodyOwnerAttrs.length > 0 ? indentBlock(whiteBodyOwnerAttrs.join('\n'), '          ') : ''}
        >
${regionLines.join('\n')}
        </div>
      </div>
    </>
  )
}
`
}

function buildStructuredManagedPageArtifacts(pagePath, contract) {
  const entryPagePath = toDirectoryArtifactEntryPagePath(pagePath)
  const { entryPagePath: normalizedEntryPagePath, sectionsPagePath, sectionsStylePath } =
    buildArtifactPathMap(entryPagePath)
  const componentName = toComponentName(normalizedEntryPagePath)
  const sectionsComponentName = `${componentName}Sections`
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const regionNames = new Set(regionAttrs.map((attr) => attr.value))
  const whiteBodyOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role === 'white-body')
  )
  const rootOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  )
  const portalImportPath = toImportSpecifier(
    normalizedEntryPagePath,
    'src/typical-page-reuse/components/layout/page-header-portal'
  )
  const hasHeader = regionNames.has('header')
  const hasWhiteBody = regionNames.has('white-body')
  const hasPagination = regionNames.has('pagination')
  const bodyRegionOrder = getDeclaredBodyRegionOrder(contract)

  if (!hasHeader || !hasWhiteBody) {
    return null
  }

  const sectionLines = []
  for (const regionName of bodyRegionOrder) {
    if (regionName === 'table' && hasPagination) {
      sectionLines.push(
        '      <section',
        '        className={styles.sectionBlock}',
        '        data-hiui5-region="table"',
        '      >',
        '        <div className={styles.sectionPlaceholder}>',
        '          TODO: mount the shared joined-table shell here; keep pagination inside the same container',
        '        </div>',
        '        <div className={styles.paginationPlaceholder} data-hiui5-region="pagination">',
        '          TODO: replace with real pagination inside the table shell',
        '        </div>',
        '      </section>'
      )
      continue
    }

    const regionSpecificComment =
      regionName === 'query-filter'
        ? 'TODO: mount the shared dashboard control strip here; do not rebuild this region as a form grid'
        : regionName === 'stat-section'
          ? 'TODO: mount shared stat-grid / stat-card primitives here; keep this top-level block flat and let the white-body own the surface'
          : regionName === 'chart-section'
            ? 'TODO: mount the shared chart section + adaptive chart-body carriers here'
            : `TODO: replace with the managed ${regionName} content`

    sectionLines.push(
      '      <section',
      '        className={styles.sectionBlock}',
      `        data-hiui5-region="${regionName}"`,
      '      >',
      `        <div className={styles.sectionPlaceholder}>${regionSpecificComment}</div>`,
      '      </section>'
    )
  }

  const entrySource = `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before finalize-page */
/* hiui-design page entry: managed-directory-artifacts */

import { PageHeader } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '${portalImportPath}'
import { ${sectionsComponentName} } from './sections'

export default function ${componentName}() {
  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      <div
${indentBlock([...toJsxAttrList(rootAttrs), ...rootOwnerAttrs].join('\n'), '        ')}
      >
        <HostPageHeaderPortal>
          <PageHeader
            data-hiui5-region="header"
            style={{ minHeight: 60 }}
            title="TODO: replace page title"
          >
          </PageHeader>
        </HostPageHeaderPortal>
        <div
          data-hiui5-region="white-body"
${whiteBodyOwnerAttrs.length > 0 ? indentBlock(whiteBodyOwnerAttrs.join('\n'), '          ') : ''}
        >
          <${sectionsComponentName} />
        </div>
      </div>
    </>
  )
}
`

  const sectionsSource = `import styles from './sections.module.scss'

export function ${sectionsComponentName}() {
  return (
    <div className={styles.stack}>
${sectionLines.join('\n')}
    </div>
  )
}
`

  const stylesSource = `.stack {
  display: grid;
  gap: 20px;
}

.sectionBlock {
  display: grid;
  gap: 12px;
}

.sectionPlaceholder {
  color: #5f6a7a;
  line-height: 1.6;
}

.paginationPlaceholder {
  color: #7f8793;
  font-size: 12px;
}
`

  return [
    {
      filePath: normalizedEntryPagePath,
      source: entrySource,
    },
    {
      filePath: sectionsPagePath,
      source: sectionsSource,
    },
    {
      filePath: sectionsStylePath,
      source: stylesSource,
    },
  ]
}

function buildPlaceholderRegionMapping(pageTypeId, explicitRegions) {
  const requiredMappings = getRequiredRegionsForPageType(pageTypeId).map((region) => ({
    region,
    target: `TODO: map ${region} to a concrete host region`,
  }))

  if (explicitRegions.length === 0) {
    return requiredMappings
  }

  const requiredRegionNames = new Set(
    requiredMappings.map((item) => String(item.region || '').trim().toLowerCase())
  )
  const explicitMappingByRegion = new Map(
    explicitRegions.map(({ key, target }) => [
      String(key || '').trim().toLowerCase(),
      { region: key, target },
    ])
  )

  const mergedMappings = requiredMappings.map((item) => {
    const explicit = explicitMappingByRegion.get(String(item.region || '').trim().toLowerCase())
    return explicit || item
  })

  for (const { key, target } of explicitRegions) {
    const normalizedKey = String(key || '').trim().toLowerCase()
    if (!requiredRegionNames.has(normalizedKey)) {
      mergedMappings.push({ region: key, target })
    }
  }

  return mergedMappings
}

function buildPlaceholderOwnershipMapping(pageTypeId, explicitOwnerships) {
  if (explicitOwnerships.length > 0) {
    return explicitOwnerships.map(({ key, target }) => ({ role: key, target }))
  }

  return getRequiredOwnershipRolesForPageType(pageTypeId).map((role) => ({
    role,
    target: `TODO: bind ${role} to one concrete workspace owner`,
  }))
}

function getDeclaredBodyRegionOrder(contract) {
  const seen = new Set()
  return Array.isArray(contract?.regionMapping)
    ? contract.regionMapping
        .map((item) => String(item?.region || '').trim())
        .filter((regionName) => {
          const normalized = String(regionName || '').trim().toLowerCase()
          if (!normalized || ['header', 'white-body', 'pagination'].includes(normalized) || seen.has(normalized)) {
            return false
          }

          seen.add(normalized)
          return true
        })
    : []
}

async function buildScaffoldArtifacts({ skillRoot, pagePath, contract }) {
  const fullPageDetailArtifacts = buildFullPageDetailShellArtifacts(pagePath, contract)
  if (fullPageDetailArtifacts) {
    return fullPageDetailArtifacts
  }

  const strictTemplateAsset = await resolveStrictTemplateAsset({ contract, skillRoot })
  if (strictTemplateAsset) {
    return toArtifactList(
      pagePath,
      renderStrictTemplateSource({
        contract,
        pagePath,
        templateAsset: strictTemplateAsset,
      })
    )
  }

  const fixedDashboardScaffold = buildFixedDashboardManagedPageScaffold(pagePath, contract)
  if (fixedDashboardScaffold) {
    return toArtifactList(pagePath, fixedDashboardScaffold)
  }

  const structuredArtifacts = buildStructuredManagedPageArtifacts(pagePath, contract)
  if (structuredArtifacts) {
    return structuredArtifacts
  }

  const componentName = toComponentName(pagePath)
  const snippet = renderManagedPageSourceContractSnippet(contract)

  return toArtifactList(
    pagePath,
    `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before finalize-page */

export default function ${componentName}() {
  return (
${indentBlock(snippet, '    ')}
  )
}
`
  )
}

function buildStartPageReport({
  contract,
  contractJsonPath,
  contractMarkdownPath,
  mode,
  pagePath,
  pageType,
  requestedPagePath,
  scaffoldArtifacts,
}) {
  return {
    status: 'started',
    pageType: {
      id: pageType.id,
      label: pageType.label,
    },
    mode,
    requestedPagePath,
    pagePath,
    examplePath: contract.examplePath,
    hostArchetypePath: contract.hostArchetypePath,
    requiredRegions: getRequiredRegionsForPageType(pageType.id),
    requiredOwnershipRoles: getRequiredOwnershipRolesForPageType(pageType.id),
    requiredCapabilities: contract.adapterContract.requiredCapabilities,
    localBypasses: contract.adapterContract.localBypasses,
    scaffoldArtifacts: scaffoldArtifacts.map((artifact) => ({ filePath: artifact.filePath })),
    contract: {
      jsonPath: contractJsonPath,
      markdownPath: contractMarkdownPath,
      workflow: {
        status: contract.workflow.status,
        deliveryStatus: contract.workflow.deliveryStatus,
        preflightStatus: contract.workflow.preflightStatus,
        sourceGateStatus: contract.workflow.sourceGateStatus,
        doctorStatus: contract.workflow.doctorStatus,
        runtimeSmokeStatus: contract.workflow.runtimeSmokeStatus,
        sourceSnapshotHash: contract.workflow.sourceSnapshotHash || '',
      },
      strictTemplateRequired: Boolean(contract.strictTemplateRequired),
      templateStatus: contract.templateStatus || '',
      archetypeTemplatePath: contract.archetypeTemplatePath || '',
    },
    nextSteps: [
      'replace TODO contract targets',
      'run typical-page:preflight',
      'complete delivery with typical-page:finalize-page',
    ],
  }
}

function buildContractFixtureReport() {
  return {
    status: 'started',
    pageType: {
      id: 'table-basic',
      label: '普通表格',
    },
    mode: 'rules-only',
    requestedPagePath: 'src/pages/orders/index.tsx',
    pagePath: 'src/pages/orders/index.tsx',
    examplePath: 'examples/host-integration/src/pages/table-basic.tsx',
    hostArchetypePath: 'src/pages/orders/host-archetype.tsx',
    requiredRegions: ['header', 'white-body', 'query-filter', 'table', 'pagination'],
    requiredOwnershipRoles: ['content-slot', 'white-body', 'outer-padding', 'main-scroll'],
    requiredCapabilities: ['header-slot', 'white-body', 'query-filter', 'table', 'pagination'],
    localBypasses: [],
    scaffoldArtifacts: [{ filePath: 'src/pages/orders/index.tsx' }],
    contract: {
      jsonPath: '.local-context/hiui-design/outputs/page-contracts/src__pages__orders__index.json',
      markdownPath: '.local-context/hiui-design/outputs/page-contracts/src__pages__orders__index.md',
      workflow: {
        status: 'started',
        deliveryStatus: 'not-finalized',
        preflightStatus: 'not-run',
        sourceGateStatus: 'not-run',
        doctorStatus: 'not-run',
        runtimeSmokeStatus: 'not-required',
        sourceSnapshotHash: 'start-page-contract-fixture-source',
      },
      strictTemplateRequired: true,
      templateStatus: 'executable',
      archetypeTemplatePath: 'templates/archetypes/rules-only/table-basic',
    },
    nextSteps: [
      'replace TODO contract targets',
      'run typical-page:preflight',
      'complete delivery with typical-page:finalize-page',
    ],
  }
}

function emitJson(payload) {
  console.log(JSON.stringify(payload, null, 2))
}

async function ensureParentDir(targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const pkg = await readTargetPackageJson(targetRoot)
    const hostProfile = await detectHostProfile(targetRoot)
    const mode = inferMode(pkg, hostProfile, options.mode)
    const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
    const pageType = manifest.pageTypes.find((item) => item.id === options.pageTypeId)

    if (!pageType) {
      throw new Error(`Unknown page type: ${options.pageTypeId}`)
    }

    if (options.contractFixture) {
      emitJson(buildContractFixtureReport())
      return
    }

    const requestedPagePath = normalizeContractPath(targetRoot, options.page)
    let pagePath = requestedPagePath
    const pageExt = path.extname(pagePath)
    if (!['.jsx', '.tsx'].includes(pageExt)) {
      throw new Error(`typical-page:start-page expects a .jsx or .tsx page path. Received ${pagePath}`)
    }

    if (pageType.id === 'full-page-detail') {
      pagePath = toDirectoryArtifactEntryPagePath(pagePath)
    }

    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: pageType.id,
    })
    const baselineSpecPath = path.join(
      skillRoot,
      'docs',
      'validation',
      'archetype-smoke-baselines.json'
    )
    const baselineSpec = JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
    const regionMapping = buildPlaceholderRegionMapping(
      pageType.id,
      parseKeyValueList(options.regions, '--region')
    )
    const ownershipMapping = buildPlaceholderOwnershipMapping(
      pageType.id,
      parseKeyValueList(options.ownerships, '--ownership')
    )
    const localBypasses = parseLocalBypasses(options.localBypasses, targetRoot)
    const contract = buildRulesOnlyPageContract({
      pageType,
      archetypeDefinition,
      archetypeSmokeBaseline: findArchetypeSmokeBaselineEntry(baselineSpec, pageType.id),
      generatedPagePath: pagePath,
      hostArchetypePath: normalizeContractPath(
        targetRoot,
        options.archetype || `TODO: set host archetype path for ${pagePath}`
      ),
      archetypeMode: mode,
      scrollStrategy: getDefaultScrollStrategyForPageType(pageType.id),
      regionMapping,
      ownershipMode:
        options.ownershipMode ||
        (getRequiredOwnershipRolesForPageType(pageType.id).length > 0
          ? 'page-surface-owns-workspace'
          : ''),
      ownershipMapping,
      adapterContract: {
        localBypasses,
      },
      semanticContract: {
        queryFilterRegionRole: options.queryFilterRegionRole,
      },
      notes: [
        'Generated by typical-page:start-page.',
        'Replace TODO targets with concrete host regions/ownership before running finalize-page.',
      ],
      workflow: {
        status: 'started',
        deliveryStatus: 'not-finalized',
        preflightStatus: 'not-run',
        sourceGateStatus: 'not-run',
        doctorStatus: 'not-run',
        lastCommand: 'typical-page:start-page',
      },
    })

    const validation = validateRulesOnlyPageContract({
      contract,
      manifest,
      targetRoot,
      archetypeDefinition,
      baselineSpec,
    })

    if (validation.errors.length > 0) {
      throw new Error(validation.errors.join('; '))
    }

    const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
    const contractSlug =
      toContractSlug(pagePath.replace(/\.[cm]?[jt]sx?$/, '')) || `${pageType.id}-contract`
    const contractJsonPath = path.join(contractsDir, `${contractSlug}.json`)
    const contractMarkdownPath = path.join(contractsDir, `${contractSlug}.md`)
    const scaffoldArtifacts = await buildScaffoldArtifacts({
      skillRoot,
      pagePath,
      contract,
    })
    const entryArtifact = scaffoldArtifacts.find((artifact) => artifact.filePath === pagePath)
    const existingArtifacts = []

    for (const artifact of scaffoldArtifacts) {
      const artifactAbsPath = path.join(targetRoot, artifact.filePath)
      const exists = await fs
        .access(artifactAbsPath)
        .then(() => true)
        .catch(() => false)
      if (exists) {
        existingArtifacts.push(artifact.filePath)
      }
    }

    const existingContract = await fs
      .access(contractJsonPath)
      .then(() => true)
      .catch(() => false)

    if (!options.force && (existingArtifacts.length > 0 || existingContract)) {
      throw new Error(
        `Refusing to overwrite existing scaffold artifacts. Re-run with --force if you want to replace ${[...existingArtifacts, contractJsonPath].join(', ')}.`
      )
    }

    if (!entryArtifact) {
      throw new Error(
        `typical-page:start-page could not determine the entry artifact for ${pagePath}.`
      )
    }

    for (const artifact of scaffoldArtifacts) {
      const artifactAbsPath = path.join(targetRoot, artifact.filePath)
      await ensureParentDir(artifactAbsPath)
      await fs.writeFile(artifactAbsPath, artifact.source, 'utf8')
    }
    await ensureParentDir(contractJsonPath)
    const snapshot = computeManagedPageSourceSnapshot({
      generatedPagePath: pagePath,
      targetRoot,
    })
    contract.workflow = {
      ...contract.workflow,
      runtimeSmokeStatus: getManagedPageRuntimeSmokeDefaultStatus(contract),
      runtimeSmokeSnapshotHash: '',
      runtimeSmokeReportPath: '',
      sourceSnapshotHash: snapshot.hash,
    }
    await fs.writeFile(contractJsonPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8')
    await fs.writeFile(contractMarkdownPath, renderRulesOnlyPageContractMarkdown(contract), 'utf8')
    await syncManagedPageRegistry(targetRoot)

    if (options.json) {
      emitJson(
        buildStartPageReport({
          contract,
          contractJsonPath,
          contractMarkdownPath,
          mode,
          pagePath,
          pageType,
          requestedPagePath,
          scaffoldArtifacts,
        })
      )
      return
    }

    console.log('[typical-page:start-page] Started managed page scaffold:')
    console.log(`- page type: ${pageType.label} (${pageType.id})`)
    console.log(`- mode: ${mode}`)
    if (requestedPagePath !== pagePath) {
      console.log(`- requested page path: ${requestedPagePath}`)
      console.log(`- normalized entry page: ${pagePath}`)
    }
    console.log(`- page: ${pagePath}`)
    console.log(`- example path: ${contract.examplePath}`)
    console.log(`- host archetype path: ${contract.hostArchetypePath}`)
    console.log(`- required regions: ${getRequiredRegionsForPageType(pageType.id).join(', ') || '(none)'}`)
    console.log(
      `- required ownership roles: ${getRequiredOwnershipRolesForPageType(pageType.id).join(', ') || '(none)'}`
    )
    console.log(
      `- required capabilities: ${contract.adapterContract.requiredCapabilities.join(', ') || '(none)'}`
    )
    console.log(
      `- local bypasses: ${
        contract.adapterContract.localBypasses.length > 0
          ? contract.adapterContract.localBypasses
              .map(
                (item) =>
                  `${item.packageSpec} -> ${item.adapterPath} | token bridge: ${item.tokenBridgePath} | containment: ${item.ownerContainment}`
              )
              .join(' || ')
          : '(none)'
      }`
    )
    console.log(`- scaffold artifacts:`)
    scaffoldArtifacts.forEach((artifact) => {
      console.log(`  - ${path.join(targetRoot, artifact.filePath)}`)
    })
    console.log(`- scaffold contract: ${contractJsonPath}`)
    console.log(`- workflow status: ${contract.workflow.status}`)
    console.log(`- source snapshot hash: ${contract.workflow.sourceSnapshotHash}`)
    console.log('- next step: replace TODO contract targets, then run typical-page:preflight, then complete delivery with typical-page:finalize-page')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:start-page] ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
