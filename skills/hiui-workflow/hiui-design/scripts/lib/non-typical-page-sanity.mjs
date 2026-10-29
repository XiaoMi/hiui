import path from 'node:path'

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function countOccurrences(source, needle) {
  if (!source || !needle) return 0
  return source.split(needle).length - 1
}

function findPlannedFile(plannedFiles, targetPathSuffix) {
  return plannedFiles.find((file) =>
    normalizeRelativePath(file.destPath).endsWith(normalizeRelativePath(targetPathSuffix))
  )
}

function extractStyleBlock(styleSource, className) {
  const escapedClassName = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return styleSource.match(new RegExp(`\\.${escapedClassName}\\s*\\{[\\s\\S]*?\\n\\}`))?.[0] || ''
}

function normalizeNonTypicalTargetBusinessPath(value) {
  const normalized = normalizeRelativePath(value)
  if (!normalized) return ''

  return /\.[cm]?[jt]sx?$/i.test(path.posix.basename(normalized))
    ? normalizeRelativePath(path.posix.dirname(normalized))
    : normalized
}

function collectPageShellViolations({ pageSource, coordinationPatternId }) {
  const violations = []

  if (!pageSource.includes("import styles from './index.module.scss'")) {
    violations.push('generated non-typical page must import ./index.module.scss')
  }

  if (countOccurrences(pageSource, '<NonTypicalPageFrame') !== 1) {
    violations.push('generated non-typical page must contain exactly one NonTypicalPageFrame')
  }

  if (countOccurrences(pageSource, '<WhiteBodyWorkspace>') !== 1) {
    violations.push('generated non-typical page must contain exactly one WhiteBodyWorkspace')
  }

  if (!pageSource.includes("from './page-owned-mount-support'")) {
    violations.push('generated non-typical page must import ./page-owned-mount-support')
  }

  if (countOccurrences(pageSource, '<PageOwnedMountBoundary') !== 1) {
    violations.push('generated non-typical page must contain exactly one PageOwnedMountBoundary')
  }

  if (!pageSource.includes('<ActionStrip')) {
    violations.push('generated non-typical page must include ActionStrip')
  }

  if (coordinationPatternId === 'process-stage-sync' && !pageSource.includes('<StageRail')) {
    violations.push('process-stage-sync page must include StageRail')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('<SelectionPane')
  ) {
    violations.push('selection-detail-sync page must include SelectionPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('<DetailHeaderPane')
  ) {
    violations.push('selection-detail-sync page must include DetailHeaderPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('<StatusTabStrip')
  ) {
    violations.push('selection-detail-sync page must include StatusTabStrip')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('<DataTable')
  ) {
    violations.push('selection-detail-sync page must include DataTable')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('searchPlaceholder=')
  ) {
    violations.push('selection-detail-sync page must wire a visible searchPlaceholder into SelectionPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('filters={pageModel.leftFilters}')
  ) {
    violations.push('selection-detail-sync page must wire leftFilters into SelectionPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('filterPolicy={pageModel.leftFiltersPolicy}')
  ) {
    violations.push('selection-detail-sync page must wire leftFiltersPolicy into SelectionPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes("searchCarrier={pageModel.leftSearch?.preferredCarrier || 'search'}")
  ) {
    violations.push('selection-detail-sync page must wire leftSearch preferredCarrier into SelectionPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes("filterCarrier={pageModel.leftFiltersPolicy?.preferredCarrier || 'tag'}")
  ) {
    violations.push('selection-detail-sync page must wire leftFilters preferredCarrier into SelectionPane')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('policy={activeSelection?.statusTabsPolicy}')
  ) {
    violations.push('selection-detail-sync page must wire statusTabsPolicy into StatusTabStrip')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('policy={activeSelection?.detailTable?.tablePolicy}')
  ) {
    violations.push('selection-detail-sync page must wire detailTable.tablePolicy into DataTable')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !pageSource.includes('rows={activeDetailRows}')
  ) {
    violations.push('selection-detail-sync page must render activeDetailRows through DataTable')
  }

  return violations
}

function collectStyleViolations({ styleSource, coordinationPatternId }) {
  const violations = []

  if (!styleSource.includes('.primaryStack') || !styleSource.includes('.sideStack')) {
    violations.push('generated non-typical page style must declare primaryStack and sideStack')
  }

  if (
    coordinationPatternId === 'process-stage-sync' &&
    !styleSource.includes('.processWorkspace')
  ) {
    violations.push('process-stage-sync style must declare .processWorkspace')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !styleSource.includes('.selectionWorkspace')
  ) {
    violations.push('selection-detail-sync style must declare .selectionWorkspace')
  }

  return violations
}

function collectRuntimePrimitiveStyleViolations({ styleSource, coordinationPatternId }) {
  const violations = []

  if (coordinationPatternId !== 'selection-detail-sync') {
    return violations
  }

  const pageFrameBlock = extractStyleBlock(styleSource, 'pageFrame')
  const detailHeaderPaneBlock = extractStyleBlock(styleSource, 'detailHeaderPane')
  const statusTabStripBlock = extractStyleBlock(styleSource, 'statusTabStrip')
  const tableSurfaceBlock = extractStyleBlock(styleSource, 'tableSurface')

  if (!/padding-inline\s*:\s*16px;/.test(pageFrameBlock)) {
    violations.push('selection-detail-sync runtime primitive style must keep pageFrame padding-inline: 16px baseline')
  }

  if (/padding\s*:\s*16px;/.test(pageFrameBlock)) {
    violations.push('selection-detail-sync runtime primitive style must not replace pageFrame padding-inline with padding shorthand')
  }

  if (/gap\s*:\s*16px;/.test(pageFrameBlock)) {
    violations.push('selection-detail-sync runtime primitive style must not simulate pageFrame side spacing through gap')
  }

  if (/linear-gradient\(/.test(detailHeaderPaneBlock)) {
    violations.push('selection-detail-sync runtime primitive style must not use gradient detailHeaderPane by default')
  }

  if (/border-bottom\s*:/.test(statusTabStripBlock)) {
    violations.push('selection-detail-sync runtime primitive style must not draw extra statusTabStrip border-bottom by default')
  }

  if (/border\s*:/.test(tableSurfaceBlock)) {
    violations.push('selection-detail-sync runtime primitive style must not add tableSurface border by default')
  }

  return violations
}

function collectMetadataViolations({ metadata, brief, coordinationPatternId, targetBusinessPath }) {
  const violations = []
  const pageHeaderPlan = brief.nonTypicalExecutionBrief.decisionPackage?.pageHeaderPlan || {}
  const whiteBodyPlan = brief.nonTypicalExecutionBrief.decisionPackage?.whiteBodyPlan || {}

  if (metadata.schema !== 'hiui-design-non-typical-pagegen-meta.v1') {
    violations.push('generated metadata schema must be hiui-design-non-typical-pagegen-meta.v1')
  }

  if (metadata.pageFamily !== 'non-typical-page') {
    violations.push('generated metadata pageFamily must equal non-typical-page')
  }

  if (metadata.workflowId !== brief.nonTypicalExecutionBrief.workflowId) {
    violations.push('generated metadata workflowId must match nonTypicalExecutionBrief.workflowId')
  }

  if (metadata.coordinationPatternId !== coordinationPatternId) {
    violations.push('generated metadata coordinationPatternId must match execution brief')
  }

  if (metadata.runtimePrimitivesPath !== 'src/runtime/non-typical-primitives') {
    violations.push('generated metadata runtimePrimitivesPath must equal src/runtime/non-typical-primitives')
  }

  if (
    normalizeRelativePath(metadata.pageOwnedSupportPath) !==
    normalizeRelativePath(`${targetBusinessPath}/page-owned-mount-support`)
  ) {
    violations.push('generated metadata pageOwnedSupportPath must match the page-owned support directory')
  }

  if (metadata.designMapPath !== brief.nonTypicalExecutionBrief.designMappingPlan?.designMapPath) {
    violations.push('generated metadata designMapPath must match designMappingPlan.designMapPath')
  }

  if (normalizeRelativePath(metadata.targetBusinessPath) !== normalizeRelativePath(targetBusinessPath)) {
    violations.push('generated metadata targetBusinessPath must match requested business path')
  }

  if (metadata.pageHeaderPlan?.hostConflictPolicy !== pageHeaderPlan.hostConflictPolicy) {
    violations.push('generated metadata pageHeaderPlan.hostConflictPolicy must match decision package')
  }

  if (metadata.pageHeaderPlan?.restorePolicy !== pageHeaderPlan.restorePolicy) {
    violations.push('generated metadata pageHeaderPlan.restorePolicy must match decision package')
  }

  if (metadata.whiteBodyPlan?.mountRegionFillPolicy !== whiteBodyPlan.mountRegionFillPolicy) {
    violations.push('generated metadata whiteBodyPlan.mountRegionFillPolicy must match decision package')
  }

  if (metadata.whiteBodyPlan?.hostEscalationRule !== whiteBodyPlan.hostEscalationRule) {
    violations.push('generated metadata whiteBodyPlan.hostEscalationRule must match decision package')
  }

  if (
    JSON.stringify(metadata.restorePrimitivePlan ?? null) !==
    JSON.stringify(brief.nonTypicalExecutionBrief.restorePrimitivePlan ?? null)
  ) {
    violations.push('generated metadata restorePrimitivePlan must match execution brief')
  }

  return violations
}

function collectRuntimePrimitiveViolations({ runtimePrimitiveSource, coordinationPatternId }) {
  const violations = []

  for (const marker of [
    'export function NonTypicalPageFrame',
    'export function WhiteBodyWorkspace',
    'export function SectionGroup',
    'export function ActionStrip',
  ]) {
    if (!runtimePrimitiveSource.includes(marker)) {
      violations.push(`runtime primitive source must export ${marker.replace('export function ', '')}`)
    }
  }

  if (
    coordinationPatternId === 'process-stage-sync' &&
    !runtimePrimitiveSource.includes('export function StageRail')
  ) {
    violations.push('runtime primitive source must export StageRail for process-stage-sync')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !runtimePrimitiveSource.includes('export function SelectionPane')
  ) {
    violations.push('runtime primitive source must export SelectionPane for selection-detail-sync')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !runtimePrimitiveSource.includes('export function DetailHeaderPane')
  ) {
    violations.push('runtime primitive source must export DetailHeaderPane for selection-detail-sync')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !runtimePrimitiveSource.includes('export function StatusTabStrip')
  ) {
    violations.push('runtime primitive source must export StatusTabStrip for selection-detail-sync')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    !runtimePrimitiveSource.includes('export function DataTable')
  ) {
    violations.push('runtime primitive source must export DataTable for selection-detail-sync')
  }

  if (
    !runtimePrimitiveSource.includes("from '@hi-ui/query-filter'") ||
    !runtimePrimitiveSource.includes('SearchInput')
  ) {
    violations.push('runtime primitive source must import SearchInput from @hi-ui/query-filter')
  }

  if (
    !runtimePrimitiveSource.includes("from 'hiui5'") ||
    !runtimePrimitiveSource.includes('Button') ||
    !runtimePrimitiveSource.includes('PageHeader') ||
    !runtimePrimitiveSource.includes('Table') ||
    !runtimePrimitiveSource.includes('Tabs') ||
    !runtimePrimitiveSource.includes('Tag')
  ) {
    violations.push(
      'runtime primitive source must import Button, PageHeader, Table, Tabs, and Tag from hiui5'
    )
  }

  if (runtimePrimitiveSource.includes("import { Button, PageHeader } from '@hi-ui/hiui'")) {
    violations.push(
      'runtime primitive source must not import Button and PageHeader from @hi-ui/hiui in legacy MF hosts'
    )
  }

  if (runtimePrimitiveSource.includes('<input')) {
    violations.push('runtime primitive source must not render raw input for selection-detail search')
  }

  if (runtimePrimitiveSource.includes('<table')) {
    violations.push('runtime primitive source must not render raw table for selection-detail detailTable')
  }

  if (
    runtimePrimitiveSource.includes('className={selected ? styles.filterChipActive : styles.filterChip}')
  ) {
    violations.push('runtime primitive source must not render button-based filter chips for selection-detail filters')
  }

  if (
    runtimePrimitiveSource.includes('className={selected ? styles.statusTabActive : styles.statusTab}')
  ) {
    violations.push('runtime primitive source must not render button-based status tabs for selection-detail tabs')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    /className=\{styles\.filterTag\}[\s\S]{0,220}?shape="round"/.test(runtimePrimitiveSource)
  ) {
    violations.push('selection-detail-sync runtime primitive source must not use round filter Tag by default')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    /<Tabs[\s\S]{0,200}?type="line"[\s\S]{0,200}?>/.test(runtimePrimitiveSource) &&
    !/<Tabs[\s\S]{0,200}?showDivider=\{false\}[\s\S]{0,200}?type="line"[\s\S]{0,200}?>/.test(runtimePrimitiveSource)
  ) {
    violations.push('selection-detail-sync runtime primitive source must disable extra divider on line Tabs by default')
  }

  if (
    coordinationPatternId === 'selection-detail-sync' &&
    /<Table[\s\S]{0,220}?\bbordered\b/.test(runtimePrimitiveSource)
  ) {
    violations.push('selection-detail-sync runtime primitive source must not enable bordered Table by default')
  }

  return violations
}

export function collectNonTypicalPageSanityViolations({ plannedFiles, brief }) {
  const violations = []
  const targetBusinessPath = normalizeRelativePath(
    normalizeNonTypicalTargetBusinessPath(
      brief.requestedBusiness?.targetBusinessPath || brief.requestedBusiness?.dest || ''
    )
  )
  const coordinationPatternId =
    brief.nonTypicalExecutionBrief?.coordinationPattern?.coordinationPatternId ||
    brief.nonTypicalExecutionBrief?.coordinationBindings?.coordinationPatternId ||
    ''

  const pageFile = findPlannedFile(plannedFiles, `${targetBusinessPath}/index.tsx`)
  const styleFile = findPlannedFile(plannedFiles, `${targetBusinessPath}/index.module.scss`)
  const metaFile = findPlannedFile(plannedFiles, `${targetBusinessPath}/hiui-pagegen.meta.json`)
  const runtimePrimitiveFile = findPlannedFile(
    plannedFiles,
    'src/runtime/non-typical-primitives/index.tsx'
  )
  const runtimePrimitiveStyleFile = findPlannedFile(
    plannedFiles,
    'src/runtime/non-typical-primitives/index.module.scss'
  )
  const pageOwnedSupportFile = findPlannedFile(
    plannedFiles,
    `${targetBusinessPath}/page-owned-mount-support/index.tsx`
  )
  const pageOwnedSupportStyleFile = findPlannedFile(
    plannedFiles,
    `${targetBusinessPath}/page-owned-mount-support/index.module.scss`
  )

  if (!pageFile) {
    violations.push('generated non-typical page missing index.tsx')
    return violations
  }

  if (!styleFile) {
    violations.push('generated non-typical page missing index.module.scss')
    return violations
  }

  if (!metaFile) {
    violations.push('generated non-typical page missing hiui-pagegen.meta.json')
    return violations
  }

  if (!runtimePrimitiveFile) {
    violations.push('generated non-typical page missing runtime primitive source')
    return violations
  }

  if (!runtimePrimitiveStyleFile) {
    violations.push('generated non-typical page missing runtime primitive style source')
    return violations
  }

  if (!pageOwnedSupportFile || !pageOwnedSupportStyleFile) {
    violations.push('generated non-typical page missing page-owned support runtime files')
    return violations
  }

  violations.push(
    ...collectPageShellViolations({
      pageSource: pageFile.content,
      coordinationPatternId,
    })
  )
  violations.push(
    ...collectStyleViolations({
      styleSource: styleFile.content,
      coordinationPatternId,
    })
  )
  violations.push(
    ...collectRuntimePrimitiveViolations({
      runtimePrimitiveSource: runtimePrimitiveFile.content,
      coordinationPatternId,
    })
  )
  violations.push(
    ...collectRuntimePrimitiveStyleViolations({
      styleSource: runtimePrimitiveStyleFile.content,
      coordinationPatternId,
    })
  )

  if (
    !Array.isArray(brief.nonTypicalExecutionBrief?.designMappingPlan?.regionBlockMappings) ||
    brief.nonTypicalExecutionBrief.designMappingPlan.regionBlockMappings.length === 0
  ) {
    violations.push('designMappingPlan.regionBlockMappings must be non-empty before non-typical page write')
  }

  if (brief.confirmedDesignRestoreInput) {
    if (
      !brief.nonTypicalExecutionBrief?.restorePrimitivePlan ||
      !Array.isArray(brief.nonTypicalExecutionBrief.restorePrimitivePlan.regionBindings) ||
      brief.nonTypicalExecutionBrief.restorePrimitivePlan.regionBindings.length === 0
    ) {
      violations.push(
        'restorePrimitivePlan.regionBindings must be non-empty before design-restore non-typical page write'
      )
    }
  }

  try {
    const metadata = JSON.parse(metaFile.content)
    violations.push(
      ...collectMetadataViolations({
        metadata,
        brief,
        coordinationPatternId,
        targetBusinessPath,
      })
    )
  } catch (error) {
    violations.push(`generated non-typical metadata must be valid JSON: ${error.message}`)
  }

  return violations
}
