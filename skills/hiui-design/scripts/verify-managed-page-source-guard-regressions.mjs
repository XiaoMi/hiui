#!/usr/bin/env node

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getManagedPageSourceCommentLines,
  getManagedPageSourceOwnershipAttributes,
  getManagedPageSourceRootAttributes,
  validateManagedPageSource,
} from './lib/managed-page-source-guard.mjs'

const AREA_ERROR_MARKER = 'enables point markers in an area chart'
const RADIUS_ERROR_MARKER = 'drifts compact analytics cards away from the 8px radius baseline'
const INDEPENDENT_CHART_SECTION_MARKER = 'renders an independent chart analysis block'
const GLOBAL_CHART_BASELINE_MARKER = 'renders charts without the shared HiUI chart baseline'
const LABEL_AS_COLOR_VALUE_MARKER = 'treats chart category labels as direct color values'
const FIXED_DETAIL_LABEL_WIDTH_MARKER = 'hard-codes labelWidth on vertical detail Descriptions'
const DETAIL_LABEL_PLACEMENT_MARKER =
  'does not explicitly freeze vertical detail labelPlacement to left'
const SCHEMA_DETAIL_DEFAULTS_MARKER =
  'relies on SchemaDescriptionsBridge hidden vertical detail defaults'
const HOST_SLOT_ROOT_CHROME_MARKER = 'declares a host-slot-shell ownership chain'
const HOST_SLOT_SPLIT_OWNER_MARKER = 'splits host-slot ownership'
const DEMO_PROMPT_TOOLING_MARKER = 'includes demo prompt-copy tooling'
const SHELL_AUTHENTICITY_MARKER = 'must start from the executable example shell'
const TABLE_FRAME_INSET_MARKER = 'does not expose the TablePageFrame table-body horizontal inset contract'

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)
const skillRoot = path.resolve(scriptDir, '..')

function buildContract(generatedPagePath) {
  return {
    pageTypeId: 'data-visualization',
    shell: 'StatListPageFrame',
    generatedPagePath,
    examplePath: 'examples/host-integration/src/pages/data-visualization.tsx',
    hostArchetypePath: '',
    archetypeId: 'data-visualization-core',
    archetypeMode: 'rules-only',
    strictExampleGeneration: false,
    scrollStrategy: 'page-scroll',
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', target: 'host content slot' },
      { role: 'white-body', target: 'main white-body workspace' },
      { role: 'outer-padding', target: 'main white-body workspace' },
      { role: 'main-scroll', target: 'main white-body workspace' },
    ],
    adapterContract: {
      hostAdapterId: '',
      hostAdapterLabel: '',
      requiredCapabilities: [],
      allowedOverrides: [],
      forbiddenEscapes: [],
      localBypasses: [],
    },
    semanticContract: {
      queryFilterRegionRole: 'dashboard-control-strip',
      dimensionSwitchControl: 'segmented-radio-tabs',
      listShellComposition: 'forbid-table-list-scaffold',
      spacingOwnership: 'single-owner',
      areaChartFill: 'same-series-color-fill-0.2',
    },
    splitPaneContract: {
      enabled: false,
      leftPaneSelector: '',
      rightPaneSelector: '',
      tableRegionSelector: '',
      leftPaneScroll: 'not-applicable',
      rightPaneScroll: 'not-applicable',
    },
  }
}

function buildFullPageDetailContract(generatedPagePath, options = {}) {
  const { includeChartRegion = false } = options

  return {
    pageTypeId: 'full-page-detail',
    shell: 'ProDetailPage',
    generatedPagePath,
    examplePath: 'examples/host-integration/src/pages/full-page-detail.tsx',
    hostArchetypePath: '',
    archetypeId: 'full-page-detail-core',
    archetypeMode: 'rules-only',
    strictExampleGeneration: false,
    scrollStrategy: 'page-scroll',
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', target: 'host content slot' },
      { role: 'white-body', target: 'main white-body workspace' },
      { role: 'outer-padding', target: 'main white-body workspace' },
      { role: 'main-scroll', target: 'main white-body workspace' },
    ],
    regionMapping: [
      { region: 'header', target: 'detail header' },
      { region: 'white-body', target: 'detail white-body' },
      { region: 'detail-body', target: 'detail content body' },
      ...(includeChartRegion ? [{ region: 'chart-section', target: 'supplementary analytics section' }] : []),
    ],
    adapterContract: {
      hostAdapterId: '',
      hostAdapterLabel: '',
      requiredCapabilities: [],
      allowedOverrides: [],
      forbiddenEscapes: [],
      localBypasses: [],
    },
    semanticContract: {
      queryFilterRegionRole: 'not-applicable',
      dimensionSwitchControl: 'not-applicable',
      listShellComposition: 'page-type-shell',
      spacingOwnership: 'single-owner',
      areaChartFill: 'not-applicable',
    },
    splitPaneContract: {
      enabled: false,
      leftPaneSelector: '',
      rightPaneSelector: '',
      tableRegionSelector: '',
      leftPaneScroll: 'not-applicable',
      rightPaneScroll: 'not-applicable',
    },
  }
}

function buildTableBasicContract(generatedPagePath) {
  return {
    pageTypeId: 'table-basic',
    shell: 'TablePageFrame',
    generatedPagePath,
    examplePath: 'examples/host-integration/src/pages/basic-table.tsx',
    hostArchetypePath: '',
    archetypeId: 'table-basic-core',
    archetypeMode: 'rules-only',
    strictExampleGeneration: true,
    scrollStrategy: 'table-body-scroll',
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', target: 'page-root' },
      { role: 'white-body', target: 'white-body' },
      { role: 'outer-padding', target: 'page-root' },
      { role: 'main-scroll', target: 'page-root' },
    ],
    regionMapping: [
      { region: 'header', target: 'PageHeader' },
      { region: 'white-body', target: 'whiteBody' },
      { region: 'query-filter', target: 'QueryFilter' },
      { region: 'table', target: 'Table' },
      { region: 'pagination', target: 'Table.pagination' },
    ],
    adapterContract: {
      hostAdapterId: '',
      hostAdapterLabel: '',
      requiredCapabilities: ['header-slot', 'white-body', 'query-filter', 'table', 'pagination'],
      allowedOverrides: [],
      forbiddenEscapes: [],
      localBypasses: [],
    },
    semanticContract: {
      queryFilterRegionRole: 'table-query-filter',
      dimensionSwitchControl: 'not-applicable',
      listShellComposition: 'page-type-shell',
      spacingOwnership: 'single-owner',
      areaChartFill: 'not-applicable',
    },
    splitPaneContract: {
      enabled: false,
      leftPaneSelector: '',
      rightPaneSelector: '',
      tableRegionSelector: '',
      leftPaneScroll: 'not-applicable',
      rightPaneScroll: 'not-applicable',
    },
  }
}

function buildHostSlotWorkbenchContract(generatedPagePath, options = {}) {
  const { outerPaddingOwner = 'host-slot' } = options

  return {
    pageTypeId: 'non-typical-workbench',
    shell: 'host-slot-shell',
    generatedPagePath,
    examplePath: 'examples/host-integration/src/pages/non-typical-workbench.tsx',
    hostArchetypePath: '',
    archetypeId: 'host-slot-shell-workbench',
    archetypeMode: 'host-integration',
    strictExampleGeneration: false,
    scrollStrategy: 'page-scroll',
    ownershipMode: 'host-slot-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', target: 'host-slot' },
      { role: 'white-body', target: 'none' },
      { role: 'outer-padding', target: outerPaddingOwner },
      { role: 'main-scroll', target: 'host-slot' },
    ],
    regionMapping: [],
    adapterContract: {
      hostAdapterId: '',
      hostAdapterLabel: '',
      requiredCapabilities: [],
      allowedOverrides: [],
      forbiddenEscapes: [],
      localBypasses: [],
    },
    semanticContract: {
      queryFilterRegionRole: 'not-applicable',
      dimensionSwitchControl: 'not-applicable',
      listShellComposition: 'page-type-shell',
      spacingOwnership: 'single-owner',
      areaChartFill: 'not-applicable',
    },
    splitPaneContract: {
      enabled: false,
      leftPaneSelector: '',
      rightPaneSelector: '',
      tableRegionSelector: '',
      leftPaneScroll: 'not-applicable',
      rightPaneScroll: 'not-applicable',
    },
  }
}

function renderJsxAttributes(attributes) {
  return attributes.map((attr) => `${attr.name}="${attr.value}"`).join('\n        ')
}

function buildSyntheticManagedPageSource(contract, options = {}) {
  const {
    includeAreaPointSpread = false,
    includeDemoPromptTooling = false,
    includeLabelAsColorValue = false,
  } = options
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const ownershipAttrs = new Map(
    getManagedPageSourceOwnershipAttributes(contract).map((attr) => [attr.role, attr])
  )

  const rootOwnershipAttr = ownershipAttrs.get('content-slot')
  const whiteBodyOwnershipAttrs = [
    ownershipAttrs.get('white-body'),
    ownershipAttrs.get('outer-padding'),
    ownershipAttrs.get('main-scroll'),
  ].filter(Boolean)

  const areaPointConfigBlock = includeAreaPointSpread
    ? `
const recoveryAreaPointConfig = {
  point: {
    size: 4,
  },
}
`
    : ''

  const areaProps = includeAreaPointSpread
    ? '{...recoveryConfig} {...recoveryAreaPointConfig}'
    : '{...recoveryConfig}'

  const labelAsColorConfigBlock = includeLabelAsColorValue
    ? `
const localizedSeriesTrendData = [
  { day: 'Mon', series: '已完成', value: 8 },
  { day: 'Tue', series: '已完成', value: 6 },
]

const localizedSeriesTrendConfig = withHiuiResponsiveChart({
  axis: hiuiCartesianAxis,
  color: ({ series }) => series,
  colorField: 'series',
  data: localizedSeriesTrendData,
  height: 160,
  point: false,
  smooth: true,
  xField: 'day',
  yField: 'value',
})
`
    : ''

  const labelAsColorChartBlock = includeLabelAsColorValue
    ? `
          <div data-hiui5-region="chart-section">
            <ManagedSurfaceCard chartType="line">
              <Area {...localizedSeriesTrendConfig} />
            </ManagedSurfaceCard>
          </div>`
    : ''
  const demoPromptToolingImport = includeDemoPromptTooling
    ? `import { PromptCopyFloatingButton } from '../components/prompt-copy-floating-button'\n`
    : ''
  const demoPromptToolingBlock = includeDemoPromptTooling
    ? `
          <PromptCopyFloatingButton prompt="demo prompt" />`
    : ''

  return `${demoPromptToolingImport}import { Area } from '@ant-design/charts'
import { Pagination, Table } from '@hi-ui/hiui'
import { ManagedSurfaceCard } from '../components/managed-page/data-visualization-primitives'
import {
  createHiuiSingleSeriesScale,
  hiuiCartesianAxis,
  hiuiChartTokens,
  resolveHiuiSeriesColor,
  withHiuiResponsiveChart,
} from '../charts/hiui-chart-theme'

const recoveryData = [
  { day: 'Mon', duration: 6 },
  { day: 'Tue', duration: 5 },
  { day: 'Wed', duration: 4 },
  { day: 'Thu', duration: 3 },
]

const recoveryConfig = withHiuiResponsiveChart({
  axis: hiuiCartesianAxis,
  data: recoveryData,
  height: 280,
  line: {
    style: {
      lineWidth: 2,
      stroke: resolveHiuiSeriesColor('main'),
    },
  },
  scale: createHiuiSingleSeriesScale(),
  smooth: true,
  style: {
    fill: \`l(270) 0:\${hiuiChartTokens.primaryWash} 1:\${hiuiChartTokens.primary}\`,
    fillOpacity: 0.2,
  },
  xField: 'day',
  yField: 'duration',
})
${areaPointConfigBlock}
${labelAsColorConfigBlock}
export default function SyntheticManagedDataVisualizationPage() {
  return (
    <>
      ${commentLines.map((line) => `{/* ${line} */}`).join('\n      ')}
      <div
        ${renderJsxAttributes(rootAttrs)}
        ${rootOwnershipAttr ? `${rootOwnershipAttr.name}="${rootOwnershipAttr.value}"` : ''}
      >
        <div data-hiui5-region="header" />
        <div
          data-hiui5-region="white-body"
          ${whiteBodyOwnershipAttrs.map((attr) => `${attr.name}="${attr.value}"`).join('\n          ')}
        >
          <div data-hiui5-region="stat-section">
            <ManagedSurfaceCard>
              <div />
            </ManagedSurfaceCard>
          </div>
          <div data-hiui5-region="query-filter">
            <div />
          </div>
          <div data-hiui5-region="chart-section">
            <ManagedSurfaceCard chartType="area">
              <Area ${areaProps} />
            </ManagedSurfaceCard>
          </div>
${labelAsColorChartBlock}
          <div data-hiui5-region="table">
            <Table columns={[]} data={[]} rowKey="id" />
          </div>
          <div data-hiui5-region="pagination">
            <Pagination current={1} pageSize={10} total={0} />
          </div>
${demoPromptToolingBlock}
        </div>
      </div>
    </>
  )
  }
`
}

function buildSyntheticHostSlotWorkbenchSource(contract) {
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)

  return `import styles from './synthetic-host-slot-workbench.module.scss'

export default function SyntheticHostSlotWorkbenchPage() {
  return (
    <>
      ${commentLines.map((line) => `{/* ${line} */}`).join('\n      ')}
      <main
        className={styles.pageRoot}
        data-hiui-design-page="synthetic-host-slot-workbench"
        ${renderJsxAttributes(rootAttrs)}
        data-hiui5-owner-content-slot="host-slot"
        data-hiui5-owner-white-body="none"
        data-hiui5-owner-outer-padding="${contract.ownershipMapping.find((item) => item.role === 'outer-padding')?.target || 'host-slot'}"
        data-hiui5-owner-main-scroll="host-slot"
      >
        <section className={styles.sectionBody}>
          <div />
        </section>
      </main>
    </>
  )
}
`
}

function buildSyntheticHostSlotWorkbenchStyle(options = {}) {
  const { rootChrome = false } = options

  return `.pageRoot {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  background: ${rootChrome ? '#f5f8fc' : 'transparent'};
  ${rootChrome ? 'padding-inline: 20px;' : ''}
  ${rootChrome ? 'padding-block: 20px;' : ''}
  ${rootChrome ? 'overflow-y: auto;' : ''}
}

.sectionBody {
  display: grid;
  gap: 16px;
  padding: 16px;
}
`
}

function buildSyntheticFullPageDetailSource(options = {}) {
  const {
    declareChartRegion = false,
    useChartBaseline = true,
    includeFixedLabelWidth = false,
    includeExplicitLeftLabelPlacement = true,
    includeClearedSchemaLabelWidth = true,
  } = options
  const chartRegionAttr = declareChartRegion ? ' data-hiui5-region="chart-section"' : ''
  const labelWidthLine = includeFixedLabelWidth ? "      labelWidth: 120,\n" : ''
  const labelPlacementLine = includeExplicitLeftLabelPlacement ? "      labelPlacement: 'left',\n" : ''
  const clearLabelWidthLine =
    includeClearedSchemaLabelWidth && !includeFixedLabelWidth ? "      labelWidth: null,\n" : ''
  const chartImports = useChartBaseline
    ? `import {
  createHiuiSingleSeriesScale,
  hiuiCartesianAxis,
  hiuiChartTokens,
  resolveHiuiSeriesColor,
  withHiuiResponsiveChart,
} from '../charts/hiui-chart-theme'`
    : ''
  const chartConfig = useChartBaseline
    ? `const trendConfig = withHiuiResponsiveChart({
  axis: hiuiCartesianAxis,
  data: trendData,
  height: 280,
  line: {
    style: {
      lineWidth: 2,
      stroke: resolveHiuiSeriesColor('main'),
    },
  },
  scale: createHiuiSingleSeriesScale(),
  smooth: true,
  style: {
    fill: \`l(270) 0:\${hiuiChartTokens.primaryWash} 1:\${hiuiChartTokens.primary}\`,
    fillOpacity: 0.2,
  },
  xField: 'day',
  yField: 'value',
})`
    : `const trendConfig = {
  data: trendData,
  height: 280,
  smooth: true,
  xField: 'day',
  yField: 'value',
}`

  return `import { useMemo } from 'react'
import { PageHeader } from '@hi-ui/hiui'
import type { DescriptionsProps } from '@hi-ui/hiui'
import { D, G } from '@hi-ui/schema-core'
import { GroupMapProvider, SchemaGroup } from '@hi-ui/schema-group'
import { SchemaDescriptionsBridge } from '@hi-ui/schema-group/descriptions'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import {
  ProDetailPage,
  ProDetailPageProvider,
} from '@hiui-design/typical-page-shells/pro-detail-page'
import { Area } from '@ant-design/charts'
${chartImports}
import styles from './synthetic-full-page-detail-chart.module.scss'

const detailGroupMap = {
  descriptions: SchemaDescriptionsBridge,
}

const trendData = [
  { day: 'Mon', value: 8 },
  { day: 'Tue', value: 6 },
  { day: 'Wed', value: 7 },
  { day: 'Thu', value: 5 },
]

${chartConfig}

function SyntheticFullPageDetailInner() {
  const descriptionsProps = useMemo<DescriptionsProps>(
    () => ({
      placement: 'vertical',
${labelPlacementLine}${clearLabelWidthLine}${labelWidthLine}      column: 3,
    }),
    []
  )

  const groups = useMemo(
    () => [
      G('基础信息', 'basicInfo')
        .Descriptions({
          fields: [
            D('工单号', 'ticketNo').val,
            D('工单状态', 'status').val,
            D('服务方式', 'serviceMethod').val,
          ],
          props: { descriptionsProps },
        })
        .CardProps({ size: 'lg' })
        .val,
    ],
    [descriptionsProps]
  )

  return (
    <ProDetailPage>
      <TypicalPageHeaderPortal>
        <PageHeader title="全页详情" onBack={() => void 0} />
      </TypicalPageHeaderPortal>

      <div className={styles.detailBody}>
        <GroupMapProvider groups={detailGroupMap}>
          <SchemaGroup groups={groups} borderedGroups={false} />
        </GroupMapProvider>
        <div className={styles.chartSection}${chartRegionAttr}>
          <div data-hiui5-chart-body="supporting-analysis">
            <Area {...trendConfig} />
          </div>
        </div>
      </div>
    </ProDetailPage>
  )
}

export function SyntheticFullPageDetailChartPage() {
  return (
    <ProDetailPageProvider request={async () => ({ basicInfo: { ticketNo: 'WO-1', status: '待处理', serviceMethod: '上门' } })}>
      <SyntheticFullPageDetailInner />
    </ProDetailPageProvider>
  )
}
`
}

function buildSyntheticFullPageDetailStyle() {
  return `.detailBody {
  margin: 2px 0 0;
  box-sizing: border-box;
  min-width: 0;

  :global(.group-container.schema-group__container) {
    gap: 16px;
  }

  :global(.hi-v5-card.group-panel[data-nest-level='1'] > .hi-v5-card__body) {
    padding-left: 20px;
    padding-right: 20px;
  }
}

.chartSection {
  min-width: 0;
}
`
}


async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function copyTree(sourcePath, targetPath) {
  const stat = await fs.stat(sourcePath)

  if (stat.isDirectory()) {
    await ensureDir(targetPath)
    const entries = await fs.readdir(sourcePath)
    for (const entry of entries) {
      await copyTree(path.join(sourcePath, entry), path.join(targetPath, entry))
    }
    return
  }

  await ensureDir(path.dirname(targetPath))
  await fs.copyFile(sourcePath, targetPath)
}

async function removeTree(targetPath) {
  if (!(await pathExists(targetPath))) {
    return
  }

  const stat = await fs.lstat(targetPath)
  if (!stat.isDirectory()) {
    await fs.unlink(targetPath)
    return
  }

  const entries = await fs.readdir(targetPath)
  for (const entry of entries) {
    await removeTree(path.join(targetPath, entry))
  }
  await fs.rmdir(targetPath)
}

async function writeFixtureWorkspace(tempRoot, contract) {
  const referenceSrcRoot = path.join(skillRoot, 'reference', 'host-integration', 'src')
  await copyTree(path.join(referenceSrcRoot, 'components'), path.join(tempRoot, 'src', 'components'))
  await copyTree(path.join(referenceSrcRoot, 'charts'), path.join(tempRoot, 'src', 'charts'))
  await ensureDir(path.join(tempRoot, 'src', 'pages'))
  await fs.writeFile(
    path.join(tempRoot, contract.generatedPagePath),
    buildSyntheticManagedPageSource(contract),
    'utf8'
  )
}

async function writeSyntheticFullPageDetailWorkspace(tempRoot, contract, options = {}) {
  const referenceSrcRoot = path.join(skillRoot, 'reference', 'host-integration', 'src')
  await copyTree(path.join(referenceSrcRoot, 'components'), path.join(tempRoot, 'src', 'components'))
  await copyTree(path.join(referenceSrcRoot, 'charts'), path.join(tempRoot, 'src', 'charts'))
  await ensureDir(path.join(tempRoot, 'src', 'pages'))
  await fs.writeFile(
    path.join(tempRoot, contract.generatedPagePath),
    buildSyntheticFullPageDetailSource(options),
    'utf8'
  )
  await fs.writeFile(
    path.join(tempRoot, 'src', 'pages', 'synthetic-full-page-detail-chart.module.scss'),
    buildSyntheticFullPageDetailStyle(),
    'utf8'
  )
}

function buildSyntheticPseudoTablePageSource(contract) {
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const ownershipAttrs = new Map(
    getManagedPageSourceOwnershipAttributes(contract).map((attr) => [attr.role, attr])
  )

  return `import { PageHeader } from '@hi-ui/hiui'
import { ProListPage, QueryFilter, Table } from '@hiui-design/typical-page-shells/pro-list-page'
import styles from './synthetic-table-basic.module.scss'

export default function SyntheticTableBasic() {
  return (
    <div
      className={styles.pageRoot}
      ${renderJsxAttributes(rootAttrs)}
      ${ownershipAttrs.get('content-slot')?.name || 'data-hiui5-owner-content-slot'}="true"
      ${ownershipAttrs.get('outer-padding')?.name || 'data-hiui5-owner-outer-padding'}="true"
      ${ownershipAttrs.get('main-scroll')?.name || 'data-hiui5-owner-main-scroll'}="true"
    >
${commentLines.map((line) => `      ${line}`).join('\n')}
      <PageHeader data-hiui5-region="header" title="Synthetic table" />
      <div
        className={styles.whiteBody}
        data-hiui5-region="white-body"
        ${ownershipAttrs.get('white-body')?.name || 'data-hiui5-owner-white-body'}="true"
      >
        <ProListPage queryFields={[]} tableFields={[]}>
          <div className={styles.filterContainer} data-hiui5-region="query-filter">
            <QueryFilter />
          </div>
          <div className={styles.tableRegion} data-hiui5-region="table">
            <Table />
          </div>
          <div data-hiui5-region="pagination" />
        </ProListPage>
      </div>
    </div>
  )
}
`
}

function buildSyntheticPseudoTablePageStyle() {
  return `.pageRoot {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.whiteBody {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.filterContainer {
  padding-inline: 20px;
}

.tableRegion {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
}
`
}

async function writeSyntheticHostSlotWorkbenchWorkspace(tempRoot, contract, options = {}) {
  await ensureDir(path.join(tempRoot, 'src', 'pages'))
  await fs.writeFile(
    path.join(tempRoot, contract.generatedPagePath),
    buildSyntheticHostSlotWorkbenchSource(contract),
    'utf8'
  )
  await fs.writeFile(
    path.join(tempRoot, 'src', 'pages', 'synthetic-host-slot-workbench.module.scss'),
    buildSyntheticHostSlotWorkbenchStyle(options),
    'utf8'
  )
}

function findMarkerMessage(errors, marker) {
  return errors.find((item) => item.includes(marker)) || ''
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-design-source-guard-'))
  const generatedPagePath = path.join('src', 'pages', 'synthetic-data-visualization.tsx')
  const contract = buildContract(generatedPagePath)
  const pageAbsPath = path.join(tempRoot, generatedPagePath)
  const primitiveAbsPath = path.join(
    tempRoot,
    'src',
    'components',
    'managed-page',
    'data-visualization-primitives.tsx'
  )

  try {
    await writeFixtureWorkspace(tempRoot, contract)

    const baselineErrors = validateManagedPageSource({
      contract,
      generatedPagePath,
      targetRoot: tempRoot,
    })

    if (findMarkerMessage(baselineErrors, AREA_ERROR_MARKER)) {
      throw new Error(
        `Baseline synthetic page already triggers the area-point regression marker: ${findMarkerMessage(baselineErrors, AREA_ERROR_MARKER)}`
      )
    }

    if (findMarkerMessage(baselineErrors, RADIUS_ERROR_MARKER)) {
      throw new Error(
        `Baseline synthetic page already triggers the compact-card radius regression marker: ${findMarkerMessage(baselineErrors, RADIUS_ERROR_MARKER)}`
      )
    }

    if (findMarkerMessage(baselineErrors, LABEL_AS_COLOR_VALUE_MARKER)) {
      throw new Error(
        `Baseline synthetic page already triggers the chart-label-as-color regression marker: ${findMarkerMessage(baselineErrors, LABEL_AS_COLOR_VALUE_MARKER)}`
      )
    }

    const hostSlotGeneratedPagePath = path.join('src', 'pages', 'synthetic-host-slot-workbench.tsx')
    const hostSlotContract = buildHostSlotWorkbenchContract(hostSlotGeneratedPagePath)
    await writeSyntheticHostSlotWorkbenchWorkspace(tempRoot, hostSlotContract)
    const hostSlotBaselineErrors = validateManagedPageSource({
      contract: hostSlotContract,
      generatedPagePath: hostSlotGeneratedPagePath,
      targetRoot: tempRoot,
    })

    if (findMarkerMessage(hostSlotBaselineErrors, HOST_SLOT_ROOT_CHROME_MARKER)) {
      throw new Error(
        `Host-slot baseline synthetic page already triggers the root chrome marker: ${findMarkerMessage(hostSlotBaselineErrors, HOST_SLOT_ROOT_CHROME_MARKER)}`
      )
    }

    await writeSyntheticHostSlotWorkbenchWorkspace(tempRoot, hostSlotContract, { rootChrome: true })
    const hostSlotRootChromeErrors = validateManagedPageSource({
      contract: hostSlotContract,
      generatedPagePath: hostSlotGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const hostSlotRootChromeMessage = findMarkerMessage(
      hostSlotRootChromeErrors,
      HOST_SLOT_ROOT_CHROME_MARKER
    )

    if (!hostSlotRootChromeMessage) {
      throw new Error(
        'Host-slot root chrome regression was not detected. The source guard should fail when a host-slot-shell page root owns page-level padding/background/scroll.'
      )
    }

    const hostSlotSplitOwnerContract = buildHostSlotWorkbenchContract(hostSlotGeneratedPagePath, {
      outerPaddingOwner: 'page-root',
    })
    await writeSyntheticHostSlotWorkbenchWorkspace(tempRoot, hostSlotSplitOwnerContract)
    const hostSlotSplitOwnerErrors = validateManagedPageSource({
      contract: hostSlotSplitOwnerContract,
      generatedPagePath: hostSlotGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const hostSlotSplitOwnerMessage = findMarkerMessage(
      hostSlotSplitOwnerErrors,
      HOST_SLOT_SPLIT_OWNER_MARKER
    )

    if (!hostSlotSplitOwnerMessage) {
      throw new Error(
        'Host-slot split ownership regression was not detected. The source guard should fail when content/main-scroll stay on host-slot but page-root takes outer-padding while white-body is none.'
      )
    }

    await fs.writeFile(
      pageAbsPath,
      buildSyntheticManagedPageSource(contract, { includeAreaPointSpread: true }),
      'utf8'
    )
    const areaPointErrors = validateManagedPageSource({
      contract,
      generatedPagePath,
      targetRoot: tempRoot,
    })
    const areaPointMessage = findMarkerMessage(areaPointErrors, AREA_ERROR_MARKER)

    if (!areaPointMessage) {
      throw new Error(
        'Area-point regression was not detected. The source guard should fail when <Area /> spreads a config object that enables point markers.'
      )
    }

    await fs.writeFile(
      pageAbsPath,
      buildSyntheticManagedPageSource(contract, { includeLabelAsColorValue: true }),
      'utf8'
    )
    const labelAsColorErrors = validateManagedPageSource({
      contract,
      generatedPagePath,
      targetRoot: tempRoot,
    })
    const labelAsColorMessage = findMarkerMessage(labelAsColorErrors, LABEL_AS_COLOR_VALUE_MARKER)

    if (!labelAsColorMessage) {
      throw new Error(
        'Chart-label-as-color regression was not detected. The source guard should fail when chart configs return localized series/category text from color callbacks.'
      )
    }

    await fs.writeFile(
      pageAbsPath,
      buildSyntheticManagedPageSource(contract, { includeDemoPromptTooling: true }),
      'utf8'
    )
    const demoPromptToolingErrors = validateManagedPageSource({
      contract,
      generatedPagePath,
      targetRoot: tempRoot,
    })
    const demoPromptToolingMessage = findMarkerMessage(
      demoPromptToolingErrors,
      DEMO_PROMPT_TOOLING_MARKER
    )

    if (!demoPromptToolingMessage) {
      throw new Error(
        'Demo prompt-copy tooling regression was not detected. Generated managed pages must not include PromptCopyFloatingButton/examplePrompt helpers from the host-integration gallery.'
      )
    }

    await fs.writeFile(pageAbsPath, buildSyntheticManagedPageSource(contract), 'utf8')
    const primitiveRaw = await fs.readFile(primitiveAbsPath, 'utf8')
    await fs.writeFile(primitiveAbsPath, primitiveRaw.replace(/borderRadius:\s*8,/g, 'borderRadius: 16,'), 'utf8')

    const compactCardErrors = validateManagedPageSource({
      contract,
      generatedPagePath,
      targetRoot: tempRoot,
    })
    const compactCardMessage = findMarkerMessage(compactCardErrors, RADIUS_ERROR_MARKER)

    if (!compactCardMessage) {
      throw new Error(
        'Shared primitive radius regression was not detected. The source guard should fail when imported data-visualization primitives drift to 12/16px compact cards.'
      )
    }

    const detailGeneratedPagePath = path.join('src', 'pages', 'synthetic-full-page-detail-chart.tsx')
    const detailMissingChartRegionContract = buildFullPageDetailContract(detailGeneratedPagePath)
    await writeSyntheticFullPageDetailWorkspace(tempRoot, detailMissingChartRegionContract, {
      declareChartRegion: false,
      useChartBaseline: true,
    })
    const detailMissingChartRegionErrors = validateManagedPageSource({
      contract: detailMissingChartRegionContract,
      generatedPagePath: detailGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const detailMissingChartRegionMessage = findMarkerMessage(
      detailMissingChartRegionErrors,
      INDEPENDENT_CHART_SECTION_MARKER
    )

    if (!detailMissingChartRegionMessage) {
      throw new Error(
        'Independent chart-section regression was not detected on full-page-detail. The source guard should fail when a detail page mounts an independent chart analysis block without declaring chart-section.'
      )
    }

    const detailMissingBaselineContract = buildFullPageDetailContract(detailGeneratedPagePath, {
      includeChartRegion: true,
    })
    await writeSyntheticFullPageDetailWorkspace(tempRoot, detailMissingBaselineContract, {
      declareChartRegion: true,
      useChartBaseline: false,
    })
    const detailMissingBaselineErrors = validateManagedPageSource({
      contract: detailMissingBaselineContract,
      generatedPagePath: detailGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const detailMissingBaselineMessage = findMarkerMessage(
      detailMissingBaselineErrors,
      GLOBAL_CHART_BASELINE_MARKER
    )

    if (!detailMissingBaselineMessage) {
      throw new Error(
        'Global chart baseline regression was not detected on non-data-visualization pages. The source guard should fail when a managed page imports @ant-design/charts but skips the shared HiUI chart baseline.'
      )
    }

    const detailFixedLabelWidthContract = buildFullPageDetailContract(detailGeneratedPagePath)
    await writeSyntheticFullPageDetailWorkspace(tempRoot, detailFixedLabelWidthContract, {
      declareChartRegion: false,
      useChartBaseline: true,
      includeFixedLabelWidth: true,
    })
    const detailFixedLabelWidthErrors = validateManagedPageSource({
      contract: detailFixedLabelWidthContract,
      generatedPagePath: detailGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const detailFixedLabelWidthMessage = findMarkerMessage(
      detailFixedLabelWidthErrors,
      FIXED_DETAIL_LABEL_WIDTH_MARKER
    )

    if (!detailFixedLabelWidthMessage) {
      throw new Error(
        'Fixed vertical detail labelWidth regression was not detected. The source guard should fail when vertical detail Descriptions pin labelWidth and cause label text to visually center inside a fixed-width box.'
      )
    }

    const detailMissingLeftPlacementContract = buildFullPageDetailContract(detailGeneratedPagePath)
    await writeSyntheticFullPageDetailWorkspace(tempRoot, detailMissingLeftPlacementContract, {
      declareChartRegion: false,
      useChartBaseline: true,
      includeExplicitLeftLabelPlacement: false,
    })
    const detailMissingLeftPlacementErrors = validateManagedPageSource({
      contract: detailMissingLeftPlacementContract,
      generatedPagePath: detailGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const detailMissingLeftPlacementMessage = findMarkerMessage(
      detailMissingLeftPlacementErrors,
      DETAIL_LABEL_PLACEMENT_MARKER
    )

    if (!detailMissingLeftPlacementMessage) {
      throw new Error(
        'Missing explicit left labelPlacement regression was not detected. The source guard should fail when detail-shell vertical Descriptions rely on implicit label alignment defaults.'
      )
    }

    const detailHiddenSchemaDefaultsContract = buildFullPageDetailContract(detailGeneratedPagePath)
    await writeSyntheticFullPageDetailWorkspace(tempRoot, detailHiddenSchemaDefaultsContract, {
      declareChartRegion: false,
      useChartBaseline: true,
      includeClearedSchemaLabelWidth: false,
    })
    const detailHiddenSchemaDefaultsErrors = validateManagedPageSource({
      contract: detailHiddenSchemaDefaultsContract,
      generatedPagePath: detailGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const detailHiddenSchemaDefaultsMessage = findMarkerMessage(
      detailHiddenSchemaDefaultsErrors,
      SCHEMA_DETAIL_DEFAULTS_MARKER
    )

    if (!detailHiddenSchemaDefaultsMessage) {
      throw new Error(
        'Hidden SchemaDescriptionsBridge default regression was not detected. The source guard should fail when vertical detail pages inherit fixed label defaults from the bridge.'
      )
    }

    const pseudoTableGeneratedPagePath = path.join('src', 'pages', 'synthetic-table-basic.tsx')
    const pseudoTableContract = buildTableBasicContract(pseudoTableGeneratedPagePath)
    await fs.writeFile(
      path.join(tempRoot, pseudoTableGeneratedPagePath),
      buildSyntheticPseudoTablePageSource(pseudoTableContract),
      'utf8'
    )
    await fs.writeFile(
      path.join(tempRoot, 'src', 'pages', 'synthetic-table-basic.module.scss'),
      buildSyntheticPseudoTablePageStyle(),
      'utf8'
    )
    const pseudoTableErrors = validateManagedPageSource({
      contract: pseudoTableContract,
      generatedPagePath: pseudoTableGeneratedPagePath,
      targetRoot: tempRoot,
    })
    const shellAuthenticityMessage = findMarkerMessage(
      pseudoTableErrors,
      SHELL_AUTHENTICITY_MARKER
    )
    const tableFrameInsetMessage = findMarkerMessage(pseudoTableErrors, TABLE_FRAME_INSET_MARKER)

    if (!shellAuthenticityMessage) {
      throw new Error(
        'Pseudo TablePageFrame shell regression was not detected. The source guard should fail when table-basic declares TablePageFrame but rebuilds the shell locally from PageHeader/QueryFilter/Table.'
      )
    }

    if (!tableFrameInsetMessage) {
      throw new Error(
        'TablePageFrame table-body inset regression was not detected. The source guard should fail when translated table shells keep filter padding but omit the table body horizontal inset.'
      )
    }

    console.log('[verify-managed-page-source-guard-regressions] PASS')
    console.log(`- area-point spread regression caught: ${areaPointMessage}`)
    console.log(`- localized chart-label color regression caught: ${labelAsColorMessage}`)
    console.log(`- transitive compact-card radius regression caught: ${compactCardMessage}`)
    console.log(`- demo prompt-copy tooling regression caught: ${demoPromptToolingMessage}`)
    console.log(`- host-slot root chrome regression caught: ${hostSlotRootChromeMessage}`)
    console.log(`- host-slot split ownership regression caught: ${hostSlotSplitOwnerMessage}`)
    console.log(`- full-page-detail missing chart-section regression caught: ${detailMissingChartRegionMessage}`)
    console.log(`- full-page-detail missing chart baseline regression caught: ${detailMissingBaselineMessage}`)
    console.log(`- fixed vertical detail labelWidth regression caught: ${detailFixedLabelWidthMessage}`)
    console.log(`- missing explicit left detail labelPlacement regression caught: ${detailMissingLeftPlacementMessage}`)
    console.log(`- hidden SchemaDescriptionsBridge default regression caught: ${detailHiddenSchemaDefaultsMessage}`)
    console.log(`- pseudo TablePageFrame shell regression caught: ${shellAuthenticityMessage}`)
    console.log(`- table body inset regression caught: ${tableFrameInsetMessage}`)
  } finally {
    await removeTree(tempRoot)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[verify-managed-page-source-guard-regressions] ${message}`)
  process.exit(1)
})
