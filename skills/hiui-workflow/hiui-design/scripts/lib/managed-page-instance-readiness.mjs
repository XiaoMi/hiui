export function readManagedInstanceSourceMarkers(sourceRaw) {
  const source = String(sourceRaw || '')
  const hasAttr = (name) => new RegExp(`data-hiui5-${name}=["'][^"']+["']`).test(source)
  const hasComment = (name) => new RegExp(`hiui-design ${name}:`).test(source)

  return {
    pageType: hasAttr('page-type') || hasComment('page-type'),
    example: hasAttr('example') || hasComment('example'),
    archetype: hasAttr('archetype') || hasComment('archetype'),
    shell: hasAttr('shell') || hasComment('shell'),
    scrollStrategy: hasAttr('scroll-strategy') || hasComment('scroll-strategy'),
    hostAdapter: hasAttr('host-adapter') || hasComment('host-adapter'),
    hostArchetype: hasComment('host-archetype'),
  }
}

function hasManagedSourceFingerprint(sourceMarkers) {
  return Boolean(
    sourceMarkers?.pageType &&
      sourceMarkers?.shell &&
      (sourceMarkers?.example || sourceMarkers?.hostArchetype || sourceMarkers?.archetype)
  )
}

const MANAGED_QUERY_FILTER_CHAIN_PAGE_TYPES = new Set([
  'table-basic',
  'table-stat',
  'tree-table',
  'tree-split',
])

function contractRequiresManagedQueryFieldChain(contract = {}) {
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const queryFilterRegionRole = String(contract?.semanticContract?.queryFilterRegionRole || '').trim()

  return (
    queryFilterRegionRole === 'table-query-filter' ||
    MANAGED_QUERY_FILTER_CHAIN_PAGE_TYPES.has(pageTypeId)
  )
}

function sourceDirectlyBindsManagedQueryFilterSlot(sourceRaw) {
  return /\bbusinessSlots\s*:\s*\{[\s\S]{0,2500}?\bqueryFilter\s*:/.test(String(sourceRaw || ''))
}

export function managedInstanceReadinessForPageFact({
  pageExists,
  contract,
  sourceMarkers,
  sourceRaw = '',
}) {
  if (!pageExists) {
    return {
      schemaVersion: 'managed-instance-readiness.v1',
      status: 'not-applicable',
      reuseEligible: false,
      blockerCodes: [],
      reason: 'target page does not exist yet',
      sourceMarkers,
    }
  }

  const blockerCodes = []
  const hasReferenceFingerprint =
    sourceMarkers.example ||
    sourceMarkers.hostArchetype ||
    sourceMarkers.archetype

  if (!String(contract?.pageTypeId || '').trim()) {
    blockerCodes.push('MANAGED_INSTANCE_CONTRACT_MISSING')
  }
  if (!sourceMarkers.pageType) {
    blockerCodes.push('MANAGED_INSTANCE_SOURCE_PAGE_TYPE_MISSING')
  }
  if (!sourceMarkers.shell) {
    blockerCodes.push('MANAGED_INSTANCE_SHELL_MARKER_MISSING')
  }
  if (!hasReferenceFingerprint) {
    blockerCodes.push('MANAGED_INSTANCE_REFERENCE_MARKER_MISSING')
  }
  if (String(contract?.preflightStatus || '').trim() === 'fail') {
    blockerCodes.push('MANAGED_INSTANCE_PREFLIGHT_FAILED')
  }
  if (String(contract?.workflowStatus || '').trim() === 'stale') {
    blockerCodes.push('MANAGED_INSTANCE_STALE')
  }
  if (
    contractRequiresManagedQueryFieldChain(contract) &&
    sourceDirectlyBindsManagedQueryFilterSlot(sourceRaw)
  ) {
    blockerCodes.push('MANAGED_INSTANCE_QUERY_FILTER_SLOT_REIMPLEMENTED')
  }

  const reuseEligible = blockerCodes.length === 0

  return {
    schemaVersion: 'managed-instance-readiness.v1',
    status: reuseEligible ? 'ready' : 'migration-required',
    reuseEligible,
    blockerCodes,
    reason: reuseEligible
      ? 'existing page exposes the managed source fingerprint needed for in-place contract reuse'
      : blockerCodes.includes('MANAGED_INSTANCE_CONTRACT_MISSING') && hasManagedSourceFingerprint(sourceMarkers)
        ? 'existing page already exposes managed-page source markers but is not registered under page-contracts yet'
        : 'existing page has a matching contract pageType but is not a ready managed page instance yet',
    sourceMarkers,
  }
}

export function evaluateManagedInstanceReadinessFromSource({ contract, pageExists, sourceRaw }) {
  const sourceMarkers = readManagedInstanceSourceMarkers(sourceRaw)
  return managedInstanceReadinessForPageFact({
    pageExists,
    contract,
    sourceMarkers,
    sourceRaw,
  })
}

export function buildManagedInstanceMigrationReason(readiness) {
  const blockerCodes = Array.isArray(readiness?.blockerCodes)
    ? readiness.blockerCodes.filter(Boolean)
    : []
  if (
    blockerCodes.includes('MANAGED_INSTANCE_CONTRACT_MISSING') &&
    hasManagedSourceFingerprint(readiness?.sourceMarkers)
  ) {
    return `existing page already exposes hiui-design managed-page markers but is not registered under page-contracts yet (${blockerCodes.join(', ')})`
  }
  if (blockerCodes.includes('MANAGED_INSTANCE_QUERY_FILTER_SLOT_REIMPLEMENTED')) {
    return `existing page still binds the queryFilter slot directly instead of migrating to the managed queryFields chain (${blockerCodes.join(', ')})`
  }

  return `existing page has the target pageType contract but is not a ready managed page instance (${blockerCodes.join(', ') || 'missing source proof'})`
}
