import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  getManagedPageSourceCommentLines,
  inspectManagedAnalyticsSharedShellUsage,
  validateManagedPageSource,
} from '../lib/managed-page-source-guard.mjs'
import { buildRulesOnlyPageContract } from '../lib/rules-only-page-contracts.mjs'

function createLegacyProjectCarrierContract(overrides = {}) {
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
    ...overrides,
  })
}

function createLegacyProjectTableStatContract() {
  return createLegacyProjectCarrierContract({
    pageType: {
      id: 'table-stat',
      label: '数据统计表',
      shell: 'StatListPageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/table-stat.tsx',
      examplePath: 'examples/host-integration/src/pages/table-stat.tsx',
    },
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-stat-page::StatListPageFrame',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'white-body', source: 'host-archetype:white-body' },
      { region: 'stat-section', source: 'host-archetype:stat-section' },
      { region: 'query-filter', source: 'host-archetype:query-filter' },
      { region: 'table', source: 'host-archetype:table' },
      { region: 'pagination', source: 'host-archetype:pagination' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'project-table-stat-carrier.v1',
      pageComponentStatus: 'selected',
      runtimeBridgeProfileId: 'table-stat.runtime-bridge.v1',
      runtimeBridgeStatus: 'available',
      runtimeComponentSource: 'src/page-components/ProjectTableStatCarrier.tsx::ProjectTableStatCarrier',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'runtime-bridged-page-component',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-table-stat-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight'],
    },
  })
}

function createLegacyProjectTreeTableContract() {
  return createLegacyProjectCarrierContract({
    pageType: {
      id: 'tree-table',
      label: '树形表格',
      shell: 'TablePageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/tree-table.tsx',
      examplePath: 'examples/host-integration/src/pages/tree-table.tsx',
    },
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-table-page::TablePageFrame',
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'project-tree-table-carrier.v1',
      pageComponentStatus: 'selected',
      runtimeBridgeProfileId: 'tree-table.runtime-bridge.v1',
      runtimeBridgeStatus: 'available',
      runtimeComponentSource: 'src/page-components/ProjectTreeTableCarrier.tsx::ProjectTreeTableCarrier',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'runtime-bridged-page-component',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-tree-table-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight'],
    },
  })
}

function createLegacyProjectFullPageEditContract() {
  return createLegacyProjectCarrierContract({
    pageType: {
      id: 'full-page-edit',
      label: '全页编辑',
      shell: 'ProEditPage',
      assetExamplePath: 'examples/host-integration/src/pages/full-page-edit.tsx',
      examplePath: 'examples/host-integration/src/pages/full-page-edit.tsx',
    },
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-edit-page::ProEditPage',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'header-leading', source: 'host-archetype:header-leading' },
      { region: 'header-actions', source: 'host-archetype:header-actions' },
      { region: 'white-body', source: 'host-archetype:white-body' },
      { region: 'form-body', source: 'host-archetype:form-body' },
      { region: 'footer', source: 'host-archetype:footer' },
      { region: 'footer-actions', source: 'host-archetype:footer-actions' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'project-full-page-edit-carrier.v1',
      pageComponentStatus: 'selected',
      runtimeBridgeProfileId: 'full-page-edit.runtime-bridge.v1',
      runtimeBridgeStatus: 'available',
      runtimeComponentSource: 'src/page-components/ProjectFullPageEditCarrier.tsx::ProjectFullPageEditCarrier',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'runtime-bridged-page-component',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-full-page-edit-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight'],
    },
  })
}

function createLegacyProjectDrawerFormContract() {
  return createLegacyProjectCarrierContract({
    pageType: {
      id: 'drawer-form',
      label: '抽屉表单',
      shell: 'ProFormDrawer',
      assetExamplePath: 'examples/host-integration/src/pages/drawer-form.tsx',
      examplePath: 'examples/host-integration/src/pages/drawer-form.tsx',
    },
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-form-drawer::ProFormDrawer',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'drawer-body', source: 'host-archetype:drawer-body' },
      { region: 'form-body', source: 'host-archetype:form-body' },
      { region: 'drawer-footer', source: 'host-archetype:drawer-footer' },
      { region: 'footer-actions', source: 'host-archetype:footer-actions' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'project-drawer-form-carrier.v1',
      pageComponentStatus: 'selected',
      runtimeBridgeProfileId: 'drawer-form.runtime-bridge.v1',
      runtimeBridgeStatus: 'available',
      runtimeComponentSource: 'src/page-components/ProjectDrawerFormCarrier.tsx::ProjectDrawerFormCarrier',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'runtime-bridged-page-component',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-drawer-form-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight'],
    },
  })
}

function createLegacyProjectFullPageDetailContract() {
  return createLegacyProjectCarrierContract({
    pageType: {
      id: 'full-page-detail',
      label: '全页详情',
      shell: 'ProDetailPage',
      assetExamplePath: 'examples/host-integration/src/pages/full-page-detail.tsx',
      examplePath: 'examples/host-integration/src/pages/full-page-detail.tsx',
    },
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-detail-page::ProDetailPage',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'white-body', source: 'host-archetype:white-body' },
      { region: 'detail-body', source: 'host-archetype:detail-body' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'page-component',
      legacyStrategyId: 'runtime-bridged-page-component',
      mode: 'legacy-host-compatible',
      pageComponentId: 'project-full-page-detail-carrier.v1',
      pageComponentStatus: 'selected',
      runtimeBridgeProfileId: 'full-page-detail.runtime-bridge.v1',
      runtimeBridgeStatus: 'available',
      runtimeComponentSource: 'src/page-components/ProjectFullPageDetailCarrier.tsx::ProjectFullPageDetailCarrier',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'runtime-bridged-page-component',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-full-page-detail-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight'],
    },
  })
}

function buildLegacyWrapperSource(
  contract,
  {
    carrierImportName = 'ProjectTableBasicCarrier',
    paginationVariant = 'none',
    queryFilterVariant = 'none',
    extraImports = '',
    customBusinessSlotsSource = '',
  } = {}
) {
  const contractLines = getManagedPageSourceCommentLines(contract)
  const queryFilterSourceByVariant = {
    none: `const businessSlots = adaptedSlots.businessSlots`,
    compliant: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
    drifted: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        showLabel
        appearance="line"
        filterFields={[]}
        formData={{}}
        append={
          <Button appearance="line" icon={<ResetOutlined />}>
            重置
          </Button>
        }
        onChange={() => {}}
      />
    ),
  }`,
  }
  const paginationSourceByVariant = {
    none: '',
    autoHide: `pagination: (
      <Pagination autoHide current={1} total={8} pageSize={20} />
    ),`,
    visible: `pagination: (
      <Pagination current={1} total={8} pageSize={20} />
    ),`,
  }

  const businessSlotsSource =
    customBusinessSlotsSource ||
    `const businessSlots = {
    ...adaptedSlots.businessSlots,
    ${
      queryFilterVariant === 'none'
        ? ''
        : `queryFilter: (
      ${queryFilterSourceByVariant[queryFilterVariant]
        .replace(/^const businessSlots = \{\n\s+\.\.\.adaptedSlots\.businessSlots,\n\s+queryFilter:\s*/, '')
        .replace(/\n\s+\},?$/, '')}
    ),`
    }
    ${paginationSourceByVariant[paginationVariant]}
  }`

  return `import type { SlotAdapterProps } from './slot-adapter.stub'
import { slotAdapter } from './slot-adapter.stub'
import { Button, Pagination, QueryFilter } from 'hiui5'
import { ResetOutlined } from '@hi-ui/icons'
import RuntimeBridgeShellAny from '../../page-components/${carrierImportName}'
${extraImports}

export default function OrdersPage(props: SlotAdapterProps) {
  const adaptedSlots = slotAdapter(props)
  ${businessSlotsSource}

  return (
    <>
      {/* source contract markers */}
${contractLines.map((line) => `      {/* ${line} */}`).join('\n')}
      {/* runtime bridge profile: ${String(contract.generationProfile?.runtimeBridgeProfileId || '')} */}
      {/* selected component: ${String(contract.generationProfile?.selectedDeliveryAssetId || '')} */}
      {/* runtime shell source: ${String(contract.generationProfile?.runtimeComponentSource || '')} */}
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

function buildProjectCarrierSource({
  withHeaderMarker = false,
  paginationBeforeTable = false,
  omitPaginationMarker = false,
} = {}) {
  const tableAndPaginationMarkup = paginationBeforeTable
    ? `        <div className={styles.pagination_region} data-hiui5-region="pagination">
          {businessSlots.pagination}
        </div>
        <div className={styles.table_region} data-hiui5-region="table">
          <div className={styles.table_viewport}>
            <div className={styles.table_scroll} data-hiui5-owner-main-scroll="true">
              {businessSlots.table}
            </div>
          </div>
        </div>`
    : `        <div className={styles.table_region} data-hiui5-region="table">
          <div className={styles.table_viewport}>
            <div className={styles.table_scroll} data-hiui5-owner-main-scroll="true">
              {businessSlots.table}
            </div>
          </div>
        </div>
        ${
          omitPaginationMarker
            ? ``
            : `<div className={styles.pagination_region} data-hiui5-region="pagination">
          {businessSlots.pagination}
        </div>`
        }`

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
      <div className={styles.header_region}${withHeaderMarker ? ' data-hiui5-region="header"' : ''}>
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
${tableAndPaginationMarkup}
      </div>
    </div>
  )
}
`
}

function buildProjectStatCarrierSource({
  withHeaderMarker = false,
  withStatSectionMarker = true,
  statSectionAfterQueryFilter = false,
  approvedStatSectionProof = true,
} = {}) {
  const statSectionMarkup = withStatSectionMarker
    ? `        <div
          className={styles.stat_region}
          data-hiui5-region="stat-section"${approvedStatSectionProof ? '\n          data-hiui5-stat-presentation="cards"' : ''}
        >
          ${
            approvedStatSectionProof
              ? `<StatOverviewGrid data={[{ key: 'total', label: '总单量', value: '128' }]} />`
              : `<div className={styles.summary_text}>总单量 128</div>`
          }
        </div>`
    : ''
  const bodyMarkup = statSectionAfterQueryFilter
    ? `        <div className={styles.query_region} data-hiui5-region="query-filter">
          {businessSlots.queryFilter}
        </div>
${statSectionMarkup}
        <div className={styles.table_region} data-hiui5-region="table">
          <div className={styles.table_viewport}>
            <div className={styles.table_scroll} data-hiui5-owner-main-scroll="true">
              {businessSlots.table}
            </div>
          </div>
        </div>
        <div className={styles.pagination_region} data-hiui5-region="pagination">
          {businessSlots.pagination}
        </div>`
    : `${statSectionMarkup}
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
        </div>`

  return `import React from 'react'
import { PageHeader, StatOverviewGrid } from 'hiui5'
import styles from './ProjectTableStatCarrier.module.scss'

type ProjectTableStatCarrierProps = {
  businessSlots?: {
    queryFilter?: React.ReactNode
    table?: React.ReactNode
    pagination?: React.ReactNode
  }
}

export default function ProjectTableStatCarrier({
  businessSlots = {},
}: ProjectTableStatCarrierProps) {
  return (
    <div
      className={styles.page_root}
      data-hiui5-shell="StatListPageFrame"
      data-hiui5-real-shell="true"
      data-hiui5-owner-outer-padding="true"
      data-hiui5-owner-content-slot="true"
    >
      <div className={styles.header_region}${withHeaderMarker ? ' data-hiui5-region="header"' : ''}>
        <PageHeader className={styles.page_header} title="经营统计" backIcon={false} />
      </div>
      <div
        className={styles.white_body}
        data-hiui5-region="white-body"
        data-hiui5-owner-white-body="true"
      >
${bodyMarkup}
      </div>
    </div>
  )
}
`
}

function buildProjectTreeTableCarrierSource({
  withHeaderMarker = false,
  withInlineTreeProof = true,
  withSplitDrift = false,
} = {}) {
  return `import React from 'react'
import { PageHeader } from 'hiui5'
import styles from './ProjectTreeTableCarrier.module.scss'

type ProjectTreeTableCarrierProps = {
  businessSlots?: {
    queryFilter?: React.ReactNode
    table?: React.ReactNode
    pagination?: React.ReactNode
  }
}

export default function ProjectTreeTableCarrier({
  businessSlots = {},
}: ProjectTreeTableCarrierProps) {
  return (
    <div
      className={styles.page_root}
      data-hiui5-shell="${withSplitDrift ? 'TreeSplitPageFrame' : 'TablePageFrame'}"
      data-hiui5-real-shell="true"
      ${withInlineTreeProof ? 'data-hiui5-tree-table-presentation="inline-tree"' : ''}
      data-hiui5-owner-outer-padding="true"
      data-hiui5-owner-content-slot="true"
    >
      ${withInlineTreeProof ? '{/* hiui-design tree-table-presentation: inline-tree */}' : ''}
      <div className={styles.header_region}${withHeaderMarker ? ' data-hiui5-region="header"' : ''}>
        <PageHeader className={styles.page_header} title="树形查询" backIcon={false} />
      </div>
      <div
        className={styles.white_body}
        data-hiui5-region="white-body"
        data-hiui5-owner-white-body="true"
      >
        ${
          withSplitDrift
            ? `<div className={styles.split_workspace} data-hiui5-region="split-workspace">
          <div className={styles.left_tree} data-hiui5-region="left-tree" />
          <div className={styles.right_list} data-hiui5-region="right-list">`
            : ''
        }
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
        ${withSplitDrift ? `</div>\n        </div>` : ''}
      </div>
    </div>
  )
}
`
}

function buildProjectFullPageEditCarrierSource({
  withHeaderMarker = false,
  pageHeaderAfterWhiteBody = false,
  footerBeforeFormBody = false,
  footerActionsBeforeFooter = false,
  omitFormBodyMarker = false,
  omitFooterMarker = false,
  omitFooterActionsMarker = false,
} = {}) {
  const formBodyMarkup = `        <div className={styles.form_body}${omitFormBodyMarker ? '' : ' data-hiui5-region="form-body"'}>
          <div className={styles.form_section}>表单主体</div>
        </div>`
  const footerMarkup = `        <div className={styles.footer_region}${omitFooterMarker ? '' : ' data-hiui5-region="footer"'}>
          <div className={styles.footer_actions}${omitFooterActionsMarker ? '' : ' data-hiui5-region="footer-actions"'}>
            保存
          </div>
        </div>`
  const whiteBodyChildren = footerBeforeFormBody
    ? `${footerMarkup}
${formBodyMarkup}`
    : `${formBodyMarkup}
${footerMarkup}`
  const whiteBodyMarkup = `      <div
        className={styles.white_body}
        data-hiui5-region="white-body"
        data-hiui5-owner-white-body="true"
      >
        ${footerActionsBeforeFooter ? `<div className={styles.footer_actions} data-hiui5-region="footer-actions">保存</div>\n` : ''}${whiteBodyChildren}
      </div>`
  const headerMarkup = `      <div className={styles.header_region}${withHeaderMarker ? ' data-hiui5-region="header"' : ''}>
        <PageHeader title="工单编辑" backIcon={false} />
      </div>`

  return `import React from 'react'
import { PageHeader } from 'hiui5'
import styles from './ProjectFullPageEditCarrier.module.scss'

type ProjectFullPageEditCarrierProps = {
  businessSlots?: Record<string, React.ReactNode>
}

export default function ProjectFullPageEditCarrier({
  businessSlots = {},
}: ProjectFullPageEditCarrierProps) {
  return (
    <div
      className={styles.page_root}
      data-hiui5-shell="ProEditPage"
      data-hiui5-real-shell="true"
      data-hiui5-owner-outer-padding="true"
      data-hiui5-owner-main-scroll="true"
    >
${pageHeaderAfterWhiteBody ? `${whiteBodyMarkup}
${headerMarkup}` : `${headerMarkup}
${whiteBodyMarkup}`}
      {false ? businessSlots : null}
    </div>
  )
}
`
}

function buildProjectDrawerFormCarrierSource({
  withHeaderMarker = false,
  withDrawerShellMarker = true,
  omitDrawerBodyMarker = false,
  omitFormBodyMarker = false,
  omitDrawerFooterMarker = false,
  omitFooterActionsMarker = false,
  footerBeforeFormBody = false,
  footerActionsBeforeFooter = false,
} = {}) {
  const formBodyMarkup = `          <div className={styles.form_body}${omitFormBodyMarker ? '' : ' data-hiui5-region="form-body"'}>
            表单主体
          </div>`
  const drawerFooterMarkup = `          <div className={styles.drawer_footer}${omitDrawerFooterMarker ? '' : ' data-hiui5-region="drawer-footer"'}>
            <div className={styles.footer_actions}${omitFooterActionsMarker ? '' : ' data-hiui5-region="footer-actions"'}>
              保存
            </div>
          </div>`
  const drawerChildren = footerBeforeFormBody
    ? `${drawerFooterMarkup}
${formBodyMarkup}`
    : `${formBodyMarkup}
${drawerFooterMarkup}`

  return `import React from 'react'
import { PageHeader } from 'hiui5'
import styles from './ProjectDrawerFormCarrier.module.scss'

type ProjectDrawerFormCarrierProps = {
  businessSlots?: Record<string, React.ReactNode>
}

export default function ProjectDrawerFormCarrier({
  businessSlots = {},
}: ProjectDrawerFormCarrierProps) {
  return (
    <div
      className={styles.page_root}
      data-hiui5-owner-outer-padding="true"
      data-hiui5-owner-main-scroll="true"
    >
      <div className={styles.header_region}${withHeaderMarker ? ' data-hiui5-region="header"' : ''}>
        <PageHeader title="抽屉表单" backIcon={false} />
      </div>
      <div className={styles.page_placeholder}>页面占位</div>
      <div
        className={styles.drawer_shell}
        ${withDrawerShellMarker ? 'data-hiui5-shell="ProFormDrawer" data-hiui5-owner-drawer-shell="true"' : ''}
      >
        <div className={styles.drawer_body}${omitDrawerBodyMarker ? '' : ' data-hiui5-region="drawer-body"'}>
          ${footerActionsBeforeFooter ? `<div className={styles.footer_actions} data-hiui5-region="footer-actions">保存</div>\n` : ''}${drawerChildren}
        </div>
      </div>
      {false ? businessSlots : null}
    </div>
  )
}
`
}

function buildProjectFullPageDetailCarrierSource({
  withHeaderMarker = false,
  pageHeaderAfterWhiteBody = false,
  omitWhiteBodyMarker = false,
  omitDetailBodyMarker = false,
  detailBodyBeforeWhiteBody = false,
} = {}) {
  const detailBodyMarkup = `        <div className={styles.detail_body}${omitDetailBodyMarker ? '' : ' data-hiui5-region="detail-body"'}>
          <div className={styles.detail_section}>详情主体</div>
        </div>`
  const whiteBodyMarkup = `      <div className={styles.white_body}${omitWhiteBodyMarker ? '' : ' data-hiui5-region="white-body"'}>
${detailBodyBeforeWhiteBody ? '' : detailBodyMarkup}
      </div>`
  const headerMarkup = `      <div className={styles.header_region}${withHeaderMarker ? ' data-hiui5-region="header"' : ''}>
        <PageHeader title="工单详情" backIcon={false} />
      </div>`

  return `import React from 'react'
import { PageHeader } from 'hiui5'
import styles from './ProjectFullPageDetailCarrier.module.scss'

type ProjectFullPageDetailCarrierProps = {
  businessSlots?: Record<string, React.ReactNode>
}

export default function ProjectFullPageDetailCarrier({
  businessSlots = {},
}: ProjectFullPageDetailCarrierProps) {
  return (
    <div
      className={styles.page_root}
      data-hiui5-shell="ProDetailPage"
      data-hiui5-real-shell="true"
      data-hiui5-owner-outer-padding="true"
      data-hiui5-owner-main-scroll="true"
    >
${detailBodyBeforeWhiteBody ? `${detailBodyMarkup}\n` : ''}${pageHeaderAfterWhiteBody ? `${whiteBodyMarkup}\n${headerMarkup}` : `${headerMarkup}\n${whiteBodyMarkup}`}
      {false ? businessSlots : null}
    </div>
  )
}
`
}

function buildBrokenCarrierStyle() {
  return `.page_root {
  display: flex;
  flex-direction: column;
}

.header_region {
  display: flex;
  min-height: 64px;
}

.white_body {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.query_region {}

.table_region {}

.pagination_region {}
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

function buildCompliantFullPageEditCarrierStyle() {
  return `.page_root {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.header_region {
  display: flex;
  align-items: center;
  min-height: 60px;
}

.white_body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.form_body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

.footer_region {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
}

.footer_actions {
  display: flex;
  justify-content: flex-end;
}
`
}

function buildCompliantDrawerFormCarrierStyle() {
  return `.page_root {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.header_region {
  display: flex;
  align-items: center;
  min-height: 60px;
}

.drawer_shell {
  display: flex;
  flex-direction: column;
}

.drawer_body {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.form_body {
  min-height: 0;
}

.drawer_footer {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
}

.footer_actions {
  display: flex;
  justify-content: flex-end;
}
`
}

function buildCompliantFullPageDetailCarrierStyle() {
  return `.page_root {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.header_region {
  display: flex;
  align-items: center;
  min-height: 60px;
}

.white_body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.detail_body {
  min-height: 0;
}
`
}

async function writeScenario({
  contract = createLegacyProjectCarrierContract(),
  carrierFileName = 'ProjectTableBasicCarrier',
  carrierSource,
  carrierStyle,
  paginationVariant = 'none',
  queryFilterVariant = 'none',
  extraImports = '',
  customBusinessSlotsSource = '',
  extraFiles = [],
}) {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-page-source-guard-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'orders')
  const carrierDir = path.join(targetRoot, 'src', 'page-components')

  await fs.mkdir(pageDir, { recursive: true })
  await fs.mkdir(carrierDir, { recursive: true })

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    buildLegacyWrapperSource(contract, {
      carrierImportName: carrierFileName,
      paginationVariant,
      queryFilterVariant,
      extraImports,
      customBusinessSlotsSource,
    })
  )
  await fs.writeFile(path.join(pageDir, 'slot-adapter.stub.ts'), SLOT_ADAPTER_SOURCE)
  await fs.writeFile(path.join(carrierDir, `${carrierFileName}.tsx`), carrierSource)
  await fs.writeFile(
    path.join(carrierDir, `${carrierFileName}.module.scss`),
    carrierStyle
  )

  for (const extraFile of extraFiles) {
    const relativePath = String(extraFile?.path || '').trim()
    if (!relativePath) continue
    const absolutePath = path.join(targetRoot, relativePath)
    await fs.mkdir(path.dirname(absolutePath), { recursive: true })
    await fs.writeFile(absolutePath, String(extraFile?.content || ''), 'utf8')
  }

  return { contract, targetRoot }
}

test('validateManagedPageSource blocks broken project-certified table-basic carriers in legacy fast path', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource(),
    carrierStyle: buildBrokenCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('does not expose a machine-checkable header carrier')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('does not prove a 60px header baseline')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('does not keep the PageHeader root stretched to full width')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('own horizontal scrolling')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows compliant project-certified table-basic carriers in legacy fast path', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('project-certified table-basic carrier')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('PageHeader root stretched to full width')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks handwritten primitive queryFilter slots even when the page still mounts TablePageFrame', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Button, DatePicker, Input, Select } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <div className="query-filter-grid">
        <Input appearance="filled" placeholder="工程师账号" />
        <Select appearance="contained" data={[]} />
        <DatePicker type="daterange" appearance="filled" />
        <Button type="primary">查询</Button>
      </div>
    ),
  }`,
  })

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

test('validateManagedPageSource blocks misaligned main-scroll owner on project-certified list carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle().replace('  overflow: auto;\n', ''),
    extraImports: `\nimport pageStyles from './index.module.scss'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    table: (
      <div className={pageStyles.tableScroller}>table content</div>
    ),
  }`,
    extraFiles: [
      {
        path: 'src/pages/orders/index.module.scss',
        content: `.tableScroller {
  display: flex;
  flex: 1 1 0%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
`,
      },
    ],
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('marks data-hiui5-owner-main-scroll on a project-certified list carrier')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks local table wrapper chains without min-width zero', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `\nimport pageStyles from './index.module.scss'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    table: (
      <div className={pageStyles.tableSlot}>
        <div className={pageStyles.tableSurface}>
          <div className={pageStyles.tableScroller}>table content</div>
        </div>
      </div>
    ),
  }`,
    extraFiles: [
      {
        path: 'src/pages/orders/index.module.scss',
        content: `.tableSlot {
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
}

.tableSurface {
  display: flex;
  flex: 1 1 0%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.tableScroller {
  display: flex;
  flex: 1 1 0%;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
`,
      },
    ],
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('adds a local table wrapper chain without min-inline-size: 0 / min-width: 0')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks QueryFilter drift inside strict project-certified table-basic rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'drifted',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('showLabel on inline QueryFilter')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('appearance away from the shared contained baseline')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('plain reset/clear Button into inline QueryFilter')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows QueryFilter inline baseline inside strict project-certified table-basic rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('inline QueryFilter')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('contained baseline')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('reset/clear Button')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('FieldMapProvider')),
    errors.join('\n')
  )
})

test('validateManagedPageSource does not treat QueryFilter child field appearance as a shell-level appearance drift', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Input } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'keyword',
            component: <Input appearance="filled" placeholder="关键词" />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('appearance away from the shared contained baseline')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks fixed QueryFilter field widths inside strict project-certified table-basic rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { DatePicker, Input } from 'hiui5'\nimport styles from './index.module.scss'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'withdrawId',
            component: <Input appearance="filled" className={styles.field_compact} />,
          },
          {
            field: 'dateRange',
            component: <DatePicker type="daterange" className={styles.field_date} />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
  })

  await fs.writeFile(
    path.join(targetRoot, 'src', 'pages', 'orders', 'index.module.scss'),
    `.field_compact {\n  width: 180px;\n}\n\n.field_date {\n  width: 320px;\n}\n`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('pins QueryFilter field controls to page-local fixed widths')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('withdrawId=180px') && reason.includes('dateRange=320px')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks non-keyword QueryFilter text fields that drift into search semantics', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Input, SearchInput } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'keyword',
            component: <SearchInput placeholder="关键词" />,
          },
          {
            field: 'withdrawId',
            component: <SearchInput placeholder="提现单号" />,
          },
          {
            field: 'merchantName',
            component: <Input appearance="filled" placeholder="商户名称" />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('non-keyword text filters drift into search-input semantics')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('withdrawId')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks non-keyword QueryFilter text fields that lose the shared filter surface', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Input, SearchInput } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'keyword',
            component: <SearchInput placeholder="关键词" />,
          },
          {
            field: 'withdrawId',
            component: <Input placeholder="提现单号" />,
          },
          {
            field: 'merchantName',
            component: <Input appearance="filled" placeholder="商户名称" />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) =>
      reason.includes('non-keyword text filters fall back to bare Input skin instead of the shared query-filter surface')
    ),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('withdrawId')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks select/date QueryFilter controls that explicitly drift away from the shared surface', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { DatePicker, SearchInput } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'keyword',
            component: <SearchInput placeholder="关键词" />,
          },
          {
            field: 'dateRange',
            component: <DatePicker type="daterange" appearance="line" />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) =>
      reason.includes('non-keyword text filters fall back to bare Input skin instead of the shared query-filter surface')
    ),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('dateRange')),
    errors.join('\n')
  )
})

test('validateManagedPageSource does not duplicate QueryFilter field-semantic errors on non-fast-path project-certified carriers', async () => {
  const contract = buildRulesOnlyPageContract({
    pageType: {
      id: 'table-basic',
      label: '普通表格',
      shell: 'TablePageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/basic-table.tsx',
      examplePath: 'examples/host-integration/src/pages/basic-table.tsx',
    },
    generatedPagePath: 'src/pages/orders/index.tsx',
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-table-page::TablePageFrame',
    archetypeMode: 'rules-only',
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
      mode: 'rules-only',
      pageComponentId: 'project-table-basic-carrier.v1',
      pageComponentStatus: 'selected',
      selectedSemanticStrategy: 'page-component',
      selectedSemanticVariantId: 'project-certified-carrier',
      selectedDeliveryAssetKind: 'project-certified-carrier',
      selectedDeliveryAssetId: 'project-table-basic-carrier.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'component-controlled',
      startFrom: 'page-component',
      sourceProofLevel: 'slot-boundary-proof',
      requiredGates: ['slot-gate', 'preflight', 'page-instance-validation'],
    },
  })

  const { targetRoot } = await writeScenario({
    contract,
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Input, SearchInput } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'keyword',
            component: <SearchInput placeholder="关键词" />,
          },
          {
            field: 'withdrawId',
            component: <SearchInput placeholder="提现单号" />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })
  const driftMatches = errors.filter((reason) =>
    reason.includes('non-keyword text filters drift into search-input semantics')
  )

  assert.equal(driftMatches.length, 1, errors.join('\n'))
})

test('validateManagedPageSource blocks narrow text/link columns without clipping guards inside strict project-certified table-basic rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Table } from 'hiui5'`,
    customBusinessSlotsSource: `const columns = [
    {
      title: '提现单号',
      dataKey: 'withdrawId',
      width: 180,
      render: (text) => <Button appearance="link">{text}</Button>,
    },
  ]

  const businessSlots = {
    ...adaptedSlots.businessSlots,
    table: <Table columns={columns} data={[]} />,
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('defines narrow text/link table columns without a clipping guard')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('withdrawId@180px')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks importing helper code from legacy tab implementation files', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: buildCompliantCarrierStyle(),
    extraImports: `import { Input } from 'hiui5'\nimport { formatLegacyKeyword } from './tabs/legacy-tab'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    queryFilter: (
      <QueryFilter
        filterFields={[
          {
            field: 'keyword',
            component: <Input appearance="filled" placeholder={formatLegacyKeyword('关键词')} />,
          },
        ]}
        formData={{}}
        onChange={() => {}}
      />
    ),
  }`,
    extraFiles: [
      {
        path: 'src/pages/orders/tabs/legacy-tab.tsx',
        content: `import React, { useEffect, useState } from 'react'
import { Input, Table } from 'hiui5'

export function formatLegacyKeyword(value: string) {
  return value
}

export default function LegacyTabPage() {
  const [keyword, setKeyword] = useState('')

  useEffect(() => {}, [])

  return (
    <div>
      <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} />
      <Table columns={[]} data={[]} />
    </div>
  )
}
`,
      },
    ],
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('imports page-local helper code from tab implementation files')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('src/pages/orders/tabs/legacy-tab.tsx')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks page-root gap on project-certified table-basic carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({ withHeaderMarker: true }),
    carrierStyle: `${buildCompliantCarrierStyle()}\n.page_root {\n  gap: 12px;\n}\n`,
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('page-root gap between the header region and white-body workspace')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks pagination drift inside strict project-certified table-basic rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    carrierSource: buildProjectCarrierSource({
      withHeaderMarker: true,
      paginationBeforeTable: true,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('pagination region before the table region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks missing stat-section proof inside strict project-certified table-stat rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTableStatContract(),
    carrierFileName: 'ProjectTableStatCarrier',
    carrierSource: buildProjectStatCarrierSource({
      withHeaderMarker: true,
      withStatSectionMarker: false,
      approvedStatSectionProof: false,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('white-body/stat-section/query-filter/table/pagination marker chain')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('does not prove a real stat card section')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks stat-section ordering drift inside strict project-certified table-stat rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTableStatContract(),
    carrierFileName: 'ProjectTableStatCarrier',
    carrierSource: buildProjectStatCarrierSource({
      withHeaderMarker: true,
      statSectionAfterQueryFilter: true,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('stat-section after the query-filter region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows compliant strict project-certified table-stat rollout carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTableStatContract(),
    carrierFileName: 'ProjectTableStatCarrier',
    carrierSource: buildProjectStatCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('strict project-certified table-stat')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('stat card section')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks split drift inside strict project-certified tree-table rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTreeTableContract(),
    carrierFileName: 'ProjectTreeTableCarrier',
    carrierSource: buildProjectTreeTableCarrierSource({
      withHeaderMarker: true,
      withSplitDrift: true,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('drifts into left-tree/right-list split semantics')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks missing inline-tree proof inside strict project-certified tree-table rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTreeTableContract(),
    carrierFileName: 'ProjectTreeTableCarrier',
    carrierSource: buildProjectTreeTableCarrierSource({
      withHeaderMarker: true,
      withInlineTreeProof: false,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('does not prove inline-tree semantics')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows compliant strict project-certified tree-table rollout carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTreeTableContract(),
    carrierFileName: 'ProjectTreeTableCarrier',
    carrierSource: buildProjectTreeTableCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('strict tree-table rollout')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('left-tree/right-list split semantics')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks pagination autoHide inside strict project-certified tree-table rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectTreeTableContract(),
    carrierFileName: 'ProjectTreeTableCarrier',
    carrierSource: buildProjectTreeTableCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantCarrierStyle(),
    paginationVariant: 'autoHide',
    queryFilterVariant: 'compliant',
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('enables pagination autoHide')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks missing marker chain inside strict project-certified full-page-edit rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageEditContract(),
    carrierFileName: 'ProjectFullPageEditCarrier',
    carrierSource: buildProjectFullPageEditCarrierSource({
      withHeaderMarker: true,
      omitFormBodyMarker: true,
      omitFooterActionsMarker: true,
    }),
    carrierStyle: buildCompliantFullPageEditCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('white-body/form-body/footer/footer-actions marker chain')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks footer ordering drift inside strict project-certified full-page-edit rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageEditContract(),
    carrierFileName: 'ProjectFullPageEditCarrier',
    carrierSource: buildProjectFullPageEditCarrierSource({
      withHeaderMarker: true,
      footerBeforeFormBody: true,
    }),
    carrierStyle: buildCompliantFullPageEditCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('places the managed footer before the form-body region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks floating footer-actions inside strict project-certified full-page-edit rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageEditContract(),
    carrierFileName: 'ProjectFullPageEditCarrier',
    carrierSource: buildProjectFullPageEditCarrierSource({
      withHeaderMarker: true,
      footerActionsBeforeFooter: true,
    }),
    carrierStyle: buildCompliantFullPageEditCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('places footer-actions before the footer region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows compliant strict project-certified full-page-edit rollout carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageEditContract(),
    carrierFileName: 'ProjectFullPageEditCarrier',
    carrierSource: buildProjectFullPageEditCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantFullPageEditCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('strict project-certified full-page-edit')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('white-body/form-body/footer/footer-actions marker chain')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks missing marker chain inside strict project-certified drawer-form rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectDrawerFormContract(),
    carrierFileName: 'ProjectDrawerFormCarrier',
    carrierSource: buildProjectDrawerFormCarrierSource({
      withHeaderMarker: true,
      omitDrawerBodyMarker: true,
      omitFooterActionsMarker: true,
    }),
    carrierStyle: buildCompliantDrawerFormCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('drawer-body/form-body/drawer-footer/footer-actions marker chain')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks drawer-footer ordering drift inside strict project-certified drawer-form rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectDrawerFormContract(),
    carrierFileName: 'ProjectDrawerFormCarrier',
    carrierSource: buildProjectDrawerFormCarrierSource({
      withHeaderMarker: true,
      footerBeforeFormBody: true,
    }),
    carrierStyle: buildCompliantDrawerFormCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('places the managed drawer-footer before the form-body region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks floating footer-actions inside strict project-certified drawer-form rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectDrawerFormContract(),
    carrierFileName: 'ProjectDrawerFormCarrier',
    carrierSource: buildProjectDrawerFormCarrierSource({
      withHeaderMarker: true,
      footerActionsBeforeFooter: true,
    }),
    carrierStyle: buildCompliantDrawerFormCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('places footer-actions before the drawer-footer region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows compliant strict project-certified drawer-form rollout carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectDrawerFormContract(),
    carrierFileName: 'ProjectDrawerFormCarrier',
    carrierSource: buildProjectDrawerFormCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantDrawerFormCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('strict project-certified drawer-form')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('drawer-body/form-body/drawer-footer/footer-actions marker chain')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks missing marker chain inside strict project-certified full-page-detail rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageDetailContract(),
    carrierFileName: 'ProjectFullPageDetailCarrier',
    carrierSource: buildProjectFullPageDetailCarrierSource({
      withHeaderMarker: true,
      omitDetailBodyMarker: true,
    }),
    carrierStyle: buildCompliantFullPageDetailCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('white-body/detail-body marker chain')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks header ordering drift inside strict project-certified full-page-detail rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageDetailContract(),
    carrierFileName: 'ProjectFullPageDetailCarrier',
    carrierSource: buildProjectFullPageDetailCarrierSource({
      withHeaderMarker: true,
      pageHeaderAfterWhiteBody: true,
    }),
    carrierStyle: buildCompliantFullPageDetailCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('renders PageHeader after the white-body region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks detail-body drift outside white-body inside strict project-certified full-page-detail rollout', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageDetailContract(),
    carrierFileName: 'ProjectFullPageDetailCarrier',
    carrierSource: buildProjectFullPageDetailCarrierSource({
      withHeaderMarker: true,
      detailBodyBeforeWhiteBody: true,
    }),
    carrierStyle: buildCompliantFullPageDetailCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('places detail-body before the white-body region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows compliant strict project-certified full-page-detail rollout carriers', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageDetailContract(),
    carrierFileName: 'ProjectFullPageDetailCarrier',
    carrierSource: buildProjectFullPageDetailCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantFullPageDetailCarrierStyle(),
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('strict project-certified full-page-detail')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('white-body/detail-body marker chain')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks page-local typography wrappers on full-page-detail Descriptions labels', async () => {
  const { contract, targetRoot } = await writeScenario({
    contract: createLegacyProjectFullPageDetailContract(),
    carrierFileName: 'ProjectFullPageDetailCarrier',
    carrierSource: buildProjectFullPageDetailCarrierSource({
      withHeaderMarker: true,
    }),
    carrierStyle: buildCompliantFullPageDetailCarrierStyle(),
    extraImports: `import { Descriptions } from 'hiui5'`,
    customBusinessSlotsSource: `const businessSlots = {
    ...adaptedSlots.businessSlots,
    detailBody: (
      <Descriptions
        placement="vertical"
        labelPlacement="left"
        column={3}
        data={[
          {
            label: <span style={{ fontSize: 12 }}>提现单号</span>,
            value: 'TX20260707001',
          },
        ]}
      />
    ),
  }`,
  })

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('wraps Descriptions labels with page-local typography')),
    errors.join('\n')
  )
})

function createManagedAnalyticsContract(overrides = {}) {
  return buildRulesOnlyPageContract({
    pageType: {
      id: 'data-visualization',
      label: '数据可视化',
      shell: 'StatListPageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/data-visualization.tsx',
      examplePath: 'examples/host-integration/src/pages/data-visualization.tsx',
    },
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-stat-page::StatListPageFrame',
    archetypeMode: 'host-integration',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'white-body', source: 'host-archetype:white-body' },
      { region: 'stat-section', source: 'host-archetype:stat-section' },
      { region: 'query-filter', source: 'host-archetype:query-filter' },
      { region: 'chart-section', source: 'host-archetype:chart-section' },
      { region: 'table', source: 'host-archetype:table' },
      { region: 'pagination', source: 'host-archetype:pagination' },
    ],
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', source: 'host-archetype:page-root' },
      { role: 'white-body', source: 'host-archetype:white-body' },
      { role: 'outer-padding', source: 'host-archetype:page-root' },
      { role: 'main-scroll', source: 'host-archetype:main-scroll' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'managed-analytics',
      legacyStrategyId: 'managed-analytics',
      mode: 'host-integration',
      selectedDeliveryAssetKind: 'managed-analytics-shell',
      selectedDeliveryAssetId: 'data-visualization.managed-analytics.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'managed-mold-slots-only',
      moldId: 'data-visualization.managed-mold.v1',
      startFrom: 'template',
      sourceProofLevel: 'slot-boundary-proof',
      fallback: 'block-and-request-managed-mold-or-certified-adapter',
      requiredGates: ['slot-gate', 'preflight'],
      lockedRegions: ['shell', 'header', 'white-body', 'stat-section', 'chart-section', 'table', 'main-scroll'],
      editableSlots: ['pageTitle', 'headerExtra', 'statItems', 'chartSections', 'tableColumns'],
      slotManifest: [
        { slotId: 'pageTitle' },
        { slotId: 'headerExtra' },
        { slotId: 'statItems' },
        { slotId: 'chartSections' },
        { slotId: 'tableColumns' },
      ],
    },
    chartUsageContract: {
      schemaVersion: 'chart-usage-contract.v1',
      contractStatus: 'ready',
      readingPath: ['summary', 'primary', 'secondary', 'detail-table'],
      chartIntentItems: [
        {
          chartId: 'trend',
          title: '转化趋势',
          businessQuestion: '面试转化是否持续改善',
          informationTask: 'trend',
          chartType: 'line',
          readingLane: 'primary',
        },
        {
          chartId: 'funnel',
          title: '阶段漏斗',
          businessQuestion: '面试转化是否在阶段间掉队',
          informationTask: 'process',
          chartType: 'funnel',
          readingLane: 'secondary',
        },
      ],
    },
    ...overrides,
  })
}

async function writeManagedAnalyticsSharedShellFixtures(targetRoot) {
  const sharedDir = path.join(targetRoot, 'src', 'shared', 'managed-page')
  await fs.mkdir(sharedDir, { recursive: true })

  await fs.writeFile(
    path.join(sharedDir, 'data-visualization-primitives.tsx'),
    `export function SectionBlock(props) {
  return <section {...props} />
}

export function DashboardControlStrip(props) {
  return <section data-hiui5-region="query-filter" {...props} />
}

export function JoinedTableSection(props) {
  return <section data-hiui5-region="table" {...props} />
}

export function ManagedChartCard(props) {
  return <section {...props} />
}
`,
    'utf8'
  )

  await fs.writeFile(
    path.join(sharedDir, 'fixed-dashboard-page-frame.tsx'),
    `export function FixedDashboardPageFrame(props) {
  return <div data-hiui5-shell-carrier="fixed-dashboard" {...props} />
}

export function ManagedWorkbenchPageFrame(props) {
  return <div data-hiui5-shell-carrier="fixed-dashboard" {...props} />
}
`,
    'utf8'
  )
}

test('validateManagedPageSource blocks local dashboard-shell lookalikes on managed analytics pages', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-lookalike-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })

  const contract = buildRulesOnlyPageContract({
    pageType: {
      id: 'data-visualization',
      label: '数据可视化',
      shell: 'StatListPageFrame',
      assetExamplePath: 'examples/host-integration/src/pages/data-visualization.tsx',
      examplePath: 'examples/host-integration/src/pages/data-visualization.tsx',
    },
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    hostArchetypePath: '@hiui-design/typical-page-shells/pro-stat-page::StatListPageFrame',
    archetypeMode: 'host-integration',
    regionMapping: [
      { region: 'header', source: 'host-archetype:header' },
      { region: 'white-body', source: 'host-archetype:white-body' },
      { region: 'stat-section', source: 'host-archetype:stat-section' },
      { region: 'query-filter', source: 'host-archetype:query-filter' },
      { region: 'chart-section', source: 'host-archetype:chart-section' },
      { region: 'table', source: 'host-archetype:table' },
      { region: 'pagination', source: 'host-archetype:pagination' },
    ],
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: [
      { role: 'content-slot', source: 'host-archetype:page-root' },
      { role: 'white-body', source: 'host-archetype:white-body' },
      { role: 'outer-padding', source: 'host-archetype:page-root' },
      { role: 'main-scroll', source: 'host-archetype:main-scroll' },
    ],
    generationProfile: {
      schemaVersion: 'generation-profile.v1',
      strategy: 'managed-analytics',
      legacyStrategyId: 'managed-analytics',
      mode: 'host-integration',
      selectedDeliveryAssetKind: 'managed-analytics-shell',
      selectedDeliveryAssetId: 'data-visualization.managed-analytics.v1',
      selectedDeliveryAssetStatus: 'available',
      extensionPolicyStatus: 'managed-mold-slots-only',
      moldId: 'data-visualization.managed-mold.v1',
      startFrom: 'template',
      sourceProofLevel: 'slot-boundary-proof',
      fallback: 'block-and-request-managed-mold-or-certified-adapter',
      requiredGates: ['slot-gate', 'preflight'],
      lockedRegions: ['shell', 'header', 'white-body', 'stat-section', 'chart-section', 'table', 'main-scroll'],
      editableSlots: ['pageTitle', 'headerExtra', 'statItems', 'chartSections', 'tableColumns'],
      slotManifest: [
        { slotId: 'pageTitle' },
        { slotId: 'headerExtra' },
        { slotId: 'statItems' },
        { slotId: 'chartSections' },
        { slotId: 'tableColumns' },
      ],
    },
    chartUsageContract: {
      schemaVersion: 'chart-usage-contract.v1',
      contractStatus: 'ready',
      readingPath: ['summary', 'primary', 'detail-table'],
      chartIntentItems: [
        {
          chartId: 'funnel',
          title: '漏斗转化',
          businessQuestion: '面试转化是否在阶段间掉队',
          informationTask: 'process',
          chartType: 'funnel',
          readingLane: 'primary',
        },
      ],
    },
  })

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { PageHeader, Radio } from 'hiui5'

function SectionBlock({ children }) {
  return <section>{children}</section>
}

function DashboardControlStrip({ children }) {
  return <section data-hiui5-region="query-filter">{children}</section>
}

function JoinedTableSection() {
  return <section data-hiui5-region="table" />
}

export default function DashboardPage() {
  return (
    <div data-hiui5-region="white-body">
      <PageHeader title="面试看板" />
      <SectionBlock>
        <Radio.Group type="button" value="week" />
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">chart</SectionBlock>
      <JoinedTableSection />
    </div>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: contract.generatedPagePath,
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('declares local dashboard-shell lookalikes')),
    errors.join('\n')
  )
})

test('inspectManagedAnalyticsSharedShellUsage accepts alias imports from governed dashboard helpers', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-alias-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame as DashboardFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip as ControlStrip,
  JoinedTableSection as TableSection,
  SectionBlock as DashboardSection,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <DashboardFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <DashboardSection region="stat-section">
        <Radio.Group type="button" value="week" />
      </DashboardSection>
      <ControlStrip>
        <Radio.Group type="button" value="week" />
      </ControlStrip>
      <DashboardSection region="chart-section">chart</DashboardSection>
      <TableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </DashboardFrame>
  )
}
`,
    'utf8'
  )

  const shellUsage = inspectManagedAnalyticsSharedShellUsage({
    entryFilePath: path.join(pageDir, 'index.tsx'),
    targetRoot,
  })
  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.equal(shellUsage.usesFixedFrame, true)
  assert.equal(shellUsage.usesSharedDashboardPrimitives, true)
  assert.equal(shellUsage.localDashboardPrimitiveLookalikes.size, 0)
  assert.ok(
    !errors.some((reason) => reason.includes('declares local dashboard-shell lookalikes')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks dashboard control strips placed after the stat-section', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-control-order-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <div>指标卡</div>
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">chart</SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div data-hiui5-region="table" />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('places dashboard-control-strip after the stat-section')),
    errors.join('\n')
  )
})

test('validateManagedPageSource allows a separate detail QueryFilter below charts on dashboard-control-strip pages', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-detail-filter-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { QueryFilter, Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="stat-section">
        <div>指标卡</div>
      </SectionBlock>
      <SectionBlock region="chart-section">chart</SectionBlock>
      <section>
        <QueryFilter />
      </section>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div data-hiui5-region="table" />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('merges dashboard control-strip semantics and QueryFilter detail filters')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('places a detail QueryFilter before the chart-section')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('places a detail QueryFilter after the detail table')),
    errors.join('\n')
  )
})

test('validateManagedPageSource requires managed analytics pages to import the governed runtime carrier path', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-carrier-proof-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })

  const sharedDir = path.join(targetRoot, 'src', 'shared', 'managed-page')
  await fs.mkdir(sharedDir, { recursive: true })
  await fs.writeFile(
    path.join(sharedDir, 'data-visualization-primitives.tsx'),
    `export function DashboardControlStrip(props) { return <div {...props} /> }
export function SectionBlock(props) { return <section {...props} /> }
export function ManagedChartCard(props) { return <section {...props} /> }
export function JoinedTableSection(props) { return <section {...props} /> }
`,
    'utf8'
  )

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { FixedDashboardPageFrame } from '@/shared/managed-page/dashboard-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedChartCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
      title="运营看板"
    >
      <DashboardControlStrip />
      <SectionBlock region="stat-section">summary</SectionBlock>
      <SectionBlock region="chart-section" data-hiui5-layout-group="primary-secondary">
        <ManagedChartCard title="趋势" />
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('generationProfile.runtimeCarrierPath')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks mixed-scope QueryFilter content inside dashboard control strip rows', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-mixed-row-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { QueryFilter, Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
        <QueryFilter />
      </DashboardControlStrip>
      <SectionBlock region="stat-section">
        <div>指标卡</div>
      </SectionBlock>
      <SectionBlock region="chart-section">chart</SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div data-hiui5-region="table" />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('merges dashboard control-strip semantics and QueryFilter detail filters')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks sibling mixed-scope rows that place DashboardControlStrip next to QueryFilter', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-mixed-siblings-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { QueryFilter, Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="stat-section">
        <div>指标卡</div>
      </SectionBlock>
      <SectionBlock region="chart-section">chart</SectionBlock>
      <div className="detailRow">
        <DashboardControlStrip>
          <Radio.Group type="button" value="month" />
        </DashboardControlStrip>
        <QueryFilter />
      </div>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div data-hiui5-region="table" />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('merges dashboard control-strip semantics and QueryFilter detail filters')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks panelized dashboard control strips on managed analytics pages', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-panelized-strip-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <DashboardControlStrip
        style={{
          backgroundColor: '#f5f7fa',
          border: '1px solid #d9dce5',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(17, 24, 39, 0.08)',
        }}
      >
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="stat-section">
        <div>指标卡</div>
      </SectionBlock>
      <SectionBlock region="chart-section">chart</SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div data-hiui5-region="table" />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('wraps dashboard-control-strip in panel chrome')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks managed analytics pages that keep chart cards on one flat wall without layout groups', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-flat-wall-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedChartCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <Radio.Group type="button" value="week" />
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">
        <ManagedChartCard title="趋势" />
        <ManagedChartCard title="构成" />
        <ManagedChartCard title="风险" />
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract({
      layoutStrategy: 'focus-plus-supporting-analysis',
      layoutArchetype: 'primary-secondary',
    }),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('does not expose both primary and secondary layout groups')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('equal-weight chart wall')),
    errors.join('\n')
  )
})

test('validateManagedPageSource accepts canonical parallel-sections layout groups', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-parallel-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedChartCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <Radio.Group type="button" value="week" />
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section" data-hiui5-layout-group="parallel-sections">
        <div data-hiui5-layout-group="parallel-primary">
          <ManagedChartCard title="主对比" />
        </div>
        <div data-hiui5-layout-group="parallel-secondary">
          <ManagedChartCard title="辅助对比" />
        </div>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract({
      layoutStrategy: 'parallel-comparison-analysis',
      layoutArchetype: 'parallel-sections',
    }),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('parallel-primary and parallel-secondary layout groups')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks summary-oriented charts from occupying the primary region by default', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-primary-funnel-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedChartCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <Radio.Group type="button" value="week" />
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section" data-hiui5-layout-group="primary-secondary">
        <div data-hiui5-layout-group="primary">
          <ManagedChartCard title="阶段漏斗" />
        </div>
        <div data-hiui5-layout-group="secondary">
          <ManagedChartCard title="辅助分析" />
        </div>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract({
      chartUsageContract: {
        schemaVersion: 'chart-usage-contract.v1',
        contractStatus: 'ready',
        readingPath: ['summary', 'primary', 'secondary', 'detail-table'],
        chartIntentItems: [
          {
            chartId: 'funnel',
            title: '阶段漏斗',
            businessQuestion: '面试转化是否在阶段间掉队',
            informationTask: 'process',
            chartType: 'funnel',
            readingLane: 'primary',
          },
        ],
      },
    }),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('assigns a chart to the primary region')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks mixed chart-section base grid modes', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-grid-mixed-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedMetricCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <ManagedCardGrid minItemWidth={180}>
          <ManagedMetricCard label="订单量" value="42" />
        </ManagedCardGrid>
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">
        <div data-hiui5-layout-group="primary" data-hiui5-chart-grid-span="12">
          <ManagedChartCard title="趋势" />
        </div>
        <ManagedCardGrid baseGridMode="three-column">
          <div data-hiui5-layout-group="secondary" data-hiui5-chart-grid-span="8">
            <ManagedChartCard title="辅助趋势" />
          </div>
          <div data-hiui5-layout-group="insight-summary" data-hiui5-chart-grid-span="4">
            <div>总结</div>
          </div>
        </ManagedCardGrid>
        <ManagedCardGrid baseGridMode="four-column">
          <div data-hiui5-layout-group="follow-up" data-hiui5-chart-grid-span="6">
            <ManagedChartCard title="补充分析" />
          </div>
          <div data-hiui5-chart-grid-span="6">
            <div>行动项</div>
          </div>
        </ManagedCardGrid>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('mixes multiple chart-section base grid modes')),
    errors.join('\n')
  )
})

test('validateManagedPageSource accepts neutral full-span rows and excludes metric cards from chart grid checks', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-grid-neutral-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedMetricCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <ManagedCardGrid minItemWidth={180}>
          <ManagedMetricCard label="订单量" value="42" />
          <ManagedMetricCard label="转化率" value="82%" />
        </ManagedCardGrid>
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">
        <div data-hiui5-layout-group="primary" data-hiui5-chart-grid-span="12">
          <ManagedChartCard title="趋势" />
        </div>
        <ManagedCardGrid baseGridMode="three-column">
          <div data-hiui5-layout-group="secondary" data-hiui5-chart-grid-span="8">
            <ManagedChartCard title="辅助趋势" />
          </div>
          <div data-hiui5-layout-group="insight-summary" data-hiui5-chart-grid-span="4">
            <div>总结</div>
          </div>
        </ManagedCardGrid>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('mixes multiple chart-section base grid modes')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('below the minimum span')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('raw auto-fit ManagedCardGrid usage')),
    errors.join('\n')
  )
})

test('validateManagedPageSource accepts scaffold-style ManagedChartGridItem markers', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-grid-component-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedChartGridItem,
  ManagedMetricCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <ManagedCardGrid minItemWidth={180}>
          <ManagedMetricCard label="订单量" value="42" />
        </ManagedCardGrid>
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">
        <ManagedChartGridItem gridSpan={12} layoutGroup="primary">
          <ManagedChartCard title="趋势" />
        </ManagedChartGridItem>
        <ManagedCardGrid baseGridMode="three-column">
          <ManagedChartGridItem gridSpan={8} layoutGroup="secondary">
            <ManagedChartCard title="辅助趋势" />
          </ManagedChartGridItem>
          <ManagedChartGridItem gridSpan={4} layoutGroup="insight-summary">
            <div>总结</div>
          </ManagedChartGridItem>
        </ManagedCardGrid>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    !errors.some((reason) => reason.includes('does not expose both primary and secondary layout groups')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('raw auto-fit ManagedCardGrid usage')),
    errors.join('\n')
  )
  assert.ok(
    !errors.some((reason) => reason.includes('not an allowed chart-section row pattern')),
    errors.join('\n')
  )
})

test('validateManagedPageSource blocks four-column chart rows whose chart span falls below the minimum', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-grid-span-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  const contract = createManagedAnalyticsContract()
  contract.visualizationRolePlan.chartSectionLayoutPlan = {
    ...contract.visualizationRolePlan.chartSectionLayoutPlan,
    baseGridMode: 'four-column',
    baseColumnCount: 4,
    allowedPatterns: ['6-6', '6-3-3', '3-3-6', '9-3', '3-9', '12'],
    forbiddenPatterns: ['3-3-3-3'],
    minChartSpanColumns: 2,
  }

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <Radio.Group type="button" value="week" />
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section">
        <ManagedCardGrid baseGridMode="four-column">
          <div data-hiui5-layout-group="primary" data-hiui5-chart-grid-span="3">
            <ManagedChartCard title="趋势" />
          </div>
          <div data-hiui5-chart-grid-span="9">
            <div>总结</div>
          </div>
        </ManagedCardGrid>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract,
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('below the minimum span allowed')),
    errors.join('\n')
  )
})

test('validateManagedPageSource does not fake-pass chart color helpers just because imported local files declare them', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-helper-fake-pass-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  await fs.mkdir(pageDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(pageDir, 'dashboard-theme.ts'),
    `export function createHiuiColorScale() {
  return ['#2660FF']
}

export function createHiuiColumnLikeScale() {
  return { type: 'band' }
}
`,
    'utf8'
  )

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Column } from '@ant-design/charts'
import { Radio } from 'hiui5'
import { createHiuiColorScale } from './dashboard-theme'
import { FixedDashboardPageFrame } from '@/shared/managed-page/fixed-dashboard-page-frame'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedChartCard,
  SectionBlock,
} from '@/shared/managed-page/data-visualization-primitives'

const palette = createHiuiColorScale()

export default function DashboardPage() {
  return (
    <FixedDashboardPageFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <SectionBlock region="stat-section">
        <Radio.Group type="button" value="week" />
      </SectionBlock>
      <DashboardControlStrip>
        <Radio.Group type="button" value="week" />
      </DashboardControlStrip>
      <SectionBlock region="chart-section" data-hiui5-layout-group="primary-secondary">
        <div data-hiui5-layout-group="primary">
          <ManagedChartCard title="趋势">
            <div data-hiui5-chart-body="adaptive">
              <Column data={[{ month: '1月', value: 12 }]} xField="month" yField="value" color={palette[0]} />
            </div>
          </ManagedChartCard>
        </div>
        <div data-hiui5-layout-group="secondary">
          <ManagedChartCard title="辅助分析" />
        </div>
      </SectionBlock>
      <JoinedTableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </FixedDashboardPageFrame>
  )
}
`,
    'utf8'
  )

  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.ok(
    errors.some((reason) => reason.includes('without the shared HiUI chart baseline')),
    errors.join('\n')
  )
  assert.ok(
    errors.some((reason) => reason.includes('without the shared HiUI color contract baseline')),
    errors.join('\n')
  )
})

test('inspectManagedAnalyticsSharedShellUsage accepts governed dashboard helpers re-exported through a local barrel', async () => {
  const targetRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-managed-analytics-barrel-'))
  const pageDir = path.join(targetRoot, 'src', 'pages', 'dashboard')
  const sharedDir = path.join(targetRoot, 'src', 'shared')
  await fs.mkdir(pageDir, { recursive: true })
  await fs.mkdir(sharedDir, { recursive: true })
  await writeManagedAnalyticsSharedShellFixtures(targetRoot)

  await fs.writeFile(
    path.join(sharedDir, 'dashboard-shell.ts'),
    `export { FixedDashboardPageFrame, ManagedWorkbenchPageFrame } from './managed-page/fixed-dashboard-page-frame'
export {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedChartCard,
  SectionBlock,
} from './managed-page/data-visualization-primitives'
`,
    'utf8'
  )

  await fs.writeFile(
    path.join(pageDir, 'index.tsx'),
    `import { Radio } from 'hiui5'
import {
  DashboardControlStrip as ControlStrip,
  FixedDashboardPageFrame as DashboardFrame,
  JoinedTableSection as TableSection,
  SectionBlock as DashboardSection,
} from '@/shared/dashboard-shell'

export default function DashboardPage() {
  return (
    <DashboardFrame
      pageRootProps={{
        'data-hiui5-owner-content-slot': true,
        'data-hiui5-owner-outer-padding': true,
        'data-hiui5-host-adapter': 'layout-search-stat-table-adapter',
      }}
      whiteBodyProps={{
        'data-hiui5-owner-white-body': true,
        'data-hiui5-owner-main-scroll': true,
      }}
    >
      <DashboardSection region="stat-section">
        <Radio.Group type="button" value="week" />
      </DashboardSection>
      <ControlStrip>
        <Radio.Group type="button" value="week" />
      </ControlStrip>
      <DashboardSection region="chart-section">chart</DashboardSection>
      <TableSection pagination={<div data-hiui5-region="pagination" />} table={<div />} />
    </DashboardFrame>
  )
}
`,
    'utf8'
  )

  const shellUsage = inspectManagedAnalyticsSharedShellUsage({
    entryFilePath: path.join(pageDir, 'index.tsx'),
    targetRoot,
  })
  const errors = validateManagedPageSource({
    contract: createManagedAnalyticsContract(),
    generatedPagePath: 'src/pages/dashboard/index.tsx',
    targetRoot,
  })

  assert.equal(shellUsage.usesFixedFrame, true)
  assert.equal(shellUsage.usesSharedDashboardPrimitives, true)
  assert.equal(shellUsage.localDashboardPrimitiveLookalikes.size, 0)
  assert.ok(
    !errors.some((reason) => reason.includes('declares local dashboard-shell lookalikes')),
    errors.join('\n')
  )
})
