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

export function managedInstanceReadinessForPageFact({ pageExists, contract, sourceMarkers }) {
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

  return `existing page has the target pageType contract but is not a ready managed page instance (${blockerCodes.join(', ') || 'missing source proof'})`
}
