import { MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND } from './host-adapters/mf-direct-expose-legacy.mjs'

export const PUBLISH_DELIVERY_KINDS = {
  PARENT_FLOW_ONLY: 'parent-flow-only',
  MANAGED_MF_PUBLISH_ENTRY: 'managed-mf-publish-entry',
  PROJECT_OWNED_DIRECT_EXPOSE: 'project-owned-direct-expose',
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeArray(values = []) {
  return [...new Set((Array.isArray(values) ? values : [values]).map((item) => normalizeString(item)).filter(Boolean))]
}

function buildDecision({
  kind = '',
  reason = '',
  evidence = [],
  pageRelationKind = '',
  hostExecutionAdapterKind = '',
} = {}) {
  return {
    kind: normalizeString(kind),
    reason: normalizeString(reason),
    evidence: normalizeArray(evidence),
    pageRelationKind: normalizeString(pageRelationKind) || 'undetermined',
    hostExecutionAdapterKind: normalizeString(hostExecutionAdapterKind),
  }
}

export function buildPublishDeliveryDecision({
  pageRelationDecision = null,
  navigationMountAction = null,
  hostExecutionAdapter = null,
} = {}) {
  const pageRelationKind = normalizeString(pageRelationDecision?.kind) || 'undetermined'
  const hostExecutionAdapterKind = normalizeString(hostExecutionAdapter?.kind)
  const selectedMountSource = normalizeString(navigationMountAction?.selectedMountSource)
  const publishEntry = hostExecutionAdapter?.publishEntry || {}
  const targetEntryKind = normalizeString(
    navigationMountAction?.targetEntryKind || publishEntry?.configKind
  )
  const managedPublishEntryRequired = publishEntry?.managedPublishEntryRequired === true
  const explicitMfDirectExpose =
    selectedMountSource === 'explicit-business-entry-contract' &&
    ['module-federation-exposes', 'module-federation-expose'].includes(targetEntryKind)

  if (
    hostExecutionAdapterKind === MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND &&
    managedPublishEntryRequired
  ) {
    return buildDecision({
      kind: PUBLISH_DELIVERY_KINDS.MANAGED_MF_PUBLISH_ENTRY,
      reason:
        'This page is generated inside a rules-only legacy Module Federation direct-expose host, so publish delivery must go through a managed publish entry instead of exposing the page module directly.',
      evidence: [
        `page-relation:${pageRelationKind}`,
        `host-execution-adapter:${hostExecutionAdapterKind}`,
        'host-execution-adapter.publishEntry.managedPublishEntryRequired:true',
      ],
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  if (
    hostExecutionAdapterKind === MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND &&
    explicitMfDirectExpose
  ) {
    return buildDecision({
      kind: PUBLISH_DELIVERY_KINDS.PROJECT_OWNED_DIRECT_EXPOSE,
      reason:
        'The project provided an explicit legacy Module Federation business-entry contract, so publish delivery stays on the project-owned direct-expose path.',
      evidence: [
        `page-relation:${pageRelationKind}`,
        `host-execution-adapter:${hostExecutionAdapterKind}`,
        'navigation-mount-action.selectedMountSource:explicit-business-entry-contract',
      ],
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  return buildDecision({
    kind: PUBLISH_DELIVERY_KINDS.PARENT_FLOW_ONLY,
    reason:
      pageRelationKind === 'same-module-subview'
        ? 'The page remains inside the confirmed parent module flow, so no standalone publish entry is required.'
        : 'No independent publish delivery contract was proven for this page.',
    evidence: pageRelationKind === 'same-module-subview'
      ? [`page-relation:${pageRelationKind}`]
      : ['fallback:no-independent-publish-contract'],
    pageRelationKind,
    hostExecutionAdapterKind,
  })
}
