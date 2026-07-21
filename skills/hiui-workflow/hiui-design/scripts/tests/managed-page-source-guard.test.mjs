import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  getManagedPageSourceCommentLines,
  validateManagedPageSource,
} from '../lib/managed-page-source-guard.mjs'
import { buildRulesOnlyPageContract } from '../lib/rules-only-page-contracts.mjs'

function createLegacyProjectCarrierContract() {
  return buildRulesOnlyPageContract({
    pageType: {
      id: 'table-basic',
      label: '普通表格',
      shell: 'TablePageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/basic-table.tsx',
      examplePath: 'examples/host-integration/src/pages/basic-table.tsx',
    },
    generatedPagePath: 'src/pages/orders/index.tsx',
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-table-page::TablePageFrame',
    archetypeMode: 'legacy-host-compatible',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'white-body', source: 'host-archetype:white-body' },
      { region: 'query-filter', source: 'host-archetype:query-filter' },
      { region: 'table', source: 'host-archetype:table' },
      { region: 'pagination', source: 'host-archetype:pagination' },
    ],
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'page-root', source: 'host-archetype:page-root' },
      { role: 'main-scroll', source: 'host-archetype:main-scroll' },
      { role: 'white-body-owner', source: 'host-archetype:white-body' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'project-table-basic-carrier.v1',
      pageComponentStatus: 'selected',
      runtimeBridgeProfileId: 'table-basic.runtime-bridge.v1',
      runtimeBridgeStatus: 'available',
      runtimeComponentSource: 'src/page-components/ProjectTableBasicCarrier.tsx::ProjectTableBasicCarrier',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'runtime-bridged-page-component',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-table-basic-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight'],
    },
  })
}

function buildLegacyWrapperSource(contract) {
  const contractLines = getManagedPageSourceCommentLines(contract)

  return `import type { SlotAdapterProps } from './slot-adapter.stub'
import { slotAdapter } from './slot-adapter.stub'
import { Button, DatePicker, Input, Select } from 'hiui5'
import RuntimeBridgeShellAny from '../../page-components/ProjectTableBasicCarrier'

export default function OrdersPage(props: SlotAdapterProps) {
  const adaptedSlots = slotAdapter(props)
  const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <div className="query-filter-grid">
        <Input appearance="filled" placeholder="工程师账号" />
        <Select appearance="contained" data={[]} />
        <DatePicker type="daterange" appearance="filled" />
        <Button type="primary">查询</Button>
      </div>
    ),
  }

  return (
    <>
      {/* source contract markers */}
${contractLines.map((line) => `      {/* ${line} */}`).join('\n')}
      {/* runtime bridge profile: ${String(contract.generationProfile?.runtimeBridgeProfileId || '')} */}
      <RuntimeBridgeShellAny
        businessSlots={businessSlots}
        controlledExtensions={adaptedSlots.controlledExtensions}
        runtimeBridge={adaptedSlots.runtimeBridge}
      />
      {false ? adaptedSlots : null}
    </>
  )
}
`
}

const SLOT_ADAPTER_SOURCE = `export type SlotAdapterProps = {
  businessSlots: Record<string, unknown>
  controlledExtensions?: Record<string, unknown>
  runtimeBridge?: Record<string, unknown>
}

export function slotAdapter({
  businessSlots,
  controlledExtensions = {},
  runtimeBridge = {},
}: SlotAdapterProps) {
  return {
    businessSlots,
    controlledExtensions,
    runtimeBridge,
  }
}
`

function buildProjectCarrierSource() {
  return `import React from 'react'
import { PageHeader } from 'hiui5'
import styles from './ProjectTableBasicCarrier.module.scss'

type ProjectTableBasicCarrierProps = {
  businessSlots?: {
    queryFilter?: React.ReactNode
    table?: React.ReactNode
    pagination?: React.ReactNode
  }
}

export default function ProjectTableBasicCarrier({
  businessSlots = {},
}: ProjectTableBasicCarrierProps) {
  return (
    <div
      className={styles.page_root}
      data-hiui5-shell="TablePageFrame"
      data-hiui5-real-shell="true"
      data-hiui5-owner-outer-padding="true"
      data-hiui5-owner-content-slot="true"
    >
      <div className={styles.header_region} data-hiui5-region="header">
        <PageHeader className={styles.page_header} title="提现查询" backIcon={false} />
      </div>
      <div
        className={styles.white_body}
        data-hiui5-region="white-body"
        data-hiui5-owner-white-body="true"
      >
        <div className={styles.query_region} data-hiui5-region="query-filter">
          {businessSlots.queryFilter}
        </div>
        <div className={styles.table_region} data-hiui5-region="table">
          <div className={styles.table_viewport}>
            <div className={styles.table_scroll} data-hiui5-owner-main-scroll="true">
              {businessSlots.table}
            </div>
          </div>
        </div>
        <div className={styles.pagination_region} data-hiui5-region="pagination">
          {businessSlots.pagination}
        </div>
      </div>
    </div>
  )
}
`
}

function buildCompliantCarrierStyle() {
  return `.page_root {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 100%;
}

.header_region {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 60px;
}

.page_header {
  width: 100%;
  min-width: 0;
}

.white_body {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #fff;
  border-radius: 12px;
}

.query_region {
  min-width: 0;
  flex-shrink: 0;
}

.table_region {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding-inline: 20px;
}

.table_viewport {
  display: flex;
  flex: 1 1 0%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.table_scroll {
  display: flex;
  flex: 1 1 0%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.pagination_region {
  display: flex;
  justify-content: flex-end;
  min-width: 0;
  flex-shrink: 0;
  padding: 16px 20px;
}
`
}

async function writeScenario() {
  const contract = createLegacyProjectCarrierContract()
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-page-source-guard-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'orders')
  const carrierDir = path.join(targetRoot, 'src', 'page-components')

  await fs.mkdir(pageDir, { recursive: true })
  await fs.mkdir(carrierDir, { recursive: true })
  await fs.writeFile(path.join(pageDir, 'index.tsx'), buildLegacyWrapperSource(contract))
  await fs.writeFile(path.join(pageDir, 'slot-adapter.stub.ts'), SLOT_ADAPTER_SOURCE)
  await fs.writeFile(path.join(carrierDir, 'ProjectTableBasicCarrier.tsx'), buildProjectCarrierSource())
  await fs.writeFile(
    path.join(carrierDir, 'ProjectTableBasicCarrier.module.scss'),
    buildCompliantCarrierStyle()
  )

  return { contract, targetRoot }
}

test('validateManagedPageSource blocks handwritten primitive queryFilter slots even when the page still mounts TablePageFrame', async () => {
  const { contract, targetRoot } = await writeScenario()

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) =>
      reason.includes('hand-builds its filter region from primitive Input/Select/DatePicker controls')
    ),
    errors.join('\n')
  )
})
