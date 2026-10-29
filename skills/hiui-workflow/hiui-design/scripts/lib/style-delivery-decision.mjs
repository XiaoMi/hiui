import fs from 'node:fs/promises'
import path from 'node:path'

import { MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND } from './host-adapters/mf-direct-expose-legacy.mjs'
import {
  getManagedLocalRuntimeRoot,
  getManagedLocalRuntimeStylePath,
} from './managed-local-runtime-contract.mjs'

export const STYLE_DELIVERY_OWNERS = {
  MANAGED_PUBLISH_ENTRY: 'managed-publish-entry',
  PARENT_ENTRY: 'parent-entry',
  PROJECT_ENTRY: 'project-entry',
  PAGE_LOCAL_FALLBACK: 'page-local-fallback',
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value)
    .replace(/\\/gu, '/')
    .replace(/^\/+/u, '')
    .replace(/\/+/gu, '/')
}

function normalizeArray(values = []) {
  return [...new Set((Array.isArray(values) ? values : [values]).map((item) => normalizeString(item)).filter(Boolean))]
}

function ensureRelativeImportPath(value) {
  const normalizedValue = normalizeRelativePath(value)
  if (!normalizedValue) return './'
  return normalizedValue.startsWith('.') ? normalizedValue : `./${normalizedValue}`
}

function listImportSpecifiers(source = '') {
  const importPattern =
    /(?:^|\n)\s*import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]\s*;?/g
  const matches = []
  let match = null

  while ((match = importPattern.exec(source))) {
    matches.push(match[1])
  }

  return matches
}

async function readTextIfExists(targetPath = '') {
  const normalizedPath = normalizeString(targetPath)
  if (!normalizedPath) return ''

  try {
    return await fs.readFile(normalizedPath, 'utf8')
  } catch {
    return ''
  }
}

function buildDecision({
  owner,
  mode,
  proofSource = [],
  styleImportPath = '',
  effectiveEntryPath = '',
  verifiedBy = [],
  reason = '',
  pageRelationKind = '',
  hostExecutionAdapterKind = '',
} = {}) {
  return {
    owner: normalizeString(owner),
    mode: normalizeString(mode),
    proofSource: normalizeArray(proofSource),
    styleImportPath: normalizeRelativePath(styleImportPath),
    effectiveEntryPath: normalizeRelativePath(effectiveEntryPath),
    verifiedBy: normalizeArray(verifiedBy),
    reason: normalizeString(reason),
    pageRelationKind: normalizeString(pageRelationKind) || 'undetermined',
    hostExecutionAdapterKind: normalizeString(hostExecutionAdapterKind),
  }
}

function resolveProjectStylePath(candidatePath = '') {
  return normalizeRelativePath(getManagedLocalRuntimeStylePath(candidatePath || 'src/main.jsx'))
}

export function resolveStyleDeliveryImportSource({
  entryRelativePath = '',
  styleImportPath = '',
} = {}) {
  const normalizedEntryPath = normalizeRelativePath(entryRelativePath)
  const normalizedStylePath =
    normalizeRelativePath(styleImportPath) || resolveProjectStylePath(normalizedEntryPath)
  const entryDir = normalizeRelativePath(path.posix.dirname(normalizedEntryPath || 'src/index.tsx'))
  const relativeImport = path.posix.relative(entryDir || '.', normalizedStylePath)
  return ensureRelativeImportPath(relativeImport)
}

export function sourceContainsManagedRuntimeStyleImport({
  source = '',
  entryRelativePath = '',
  styleImportPath = '',
} = {}) {
  const normalizedEntryPath = normalizeRelativePath(entryRelativePath)
  const normalizedStylePath =
    normalizeRelativePath(styleImportPath) || resolveProjectStylePath(normalizedEntryPath)
  const normalizedStylePathWithoutSrc = normalizedStylePath.replace(/^src\//u, '')
  const normalizedManagedRuntimeImport = `${getManagedLocalRuntimeRoot()}/styles.css`
  const expectedRelativeImportSource = resolveStyleDeliveryImportSource({
    entryRelativePath: normalizedEntryPath,
    styleImportPath: normalizedStylePath,
  })
  const expectedSideEffectImports = [
    `import ${JSON.stringify(expectedRelativeImportSource)}`,
    `import '${expectedRelativeImportSource}'`,
    `import "${expectedRelativeImportSource}"`,
  ]

  if (expectedSideEffectImports.some((statement) => source.includes(statement))) {
    return true
  }

  return listImportSpecifiers(source).some((specifier) => {
    const normalizedSpecifier = normalizeRelativePath(specifier)
    if (!normalizedSpecifier) return false

    if (specifier.startsWith('.')) {
      const resolvedImportPath = normalizeRelativePath(
        path.posix.join(path.posix.dirname(normalizedEntryPath || 'src/index.tsx'), specifier)
      )
      return resolvedImportPath === normalizedStylePath
    }

    return (
      normalizedSpecifier === normalizedStylePath ||
      normalizedSpecifier === normalizedStylePathWithoutSrc ||
      normalizedSpecifier.endsWith(`/${normalizedStylePathWithoutSrc}`) ||
      normalizedSpecifier === normalizedManagedRuntimeImport ||
      normalizedSpecifier.endsWith(`/${normalizedManagedRuntimeImport}`)
    )
  })
}

function shouldUseManagedPublishEntry({ navigationMountAction = {}, managedMfPublishEntry = {} } = {}) {
  return (
    normalizeString(navigationMountAction?.action) === 'materialize-mf-publish-entry' ||
    managedMfPublishEntry?.required === true
  )
}

export function buildStyleDeliveryDecision({
  brief = null,
  pageFileRelativePath = '',
  managedMfPublishEntry = null,
} = {}) {
  const pageRelationDecision = brief?.pageGenerationDecision?.pageRelationDecision || {}
  const publishDeliveryDecision = brief?.pageGenerationDecision?.publishDeliveryDecision || {}
  const navigationMountAction = brief?.pageGenerationDecision?.navigationMountAction || {}
  const hostExecutionAdapter = brief?.pageGenerationDecision?.hostExecutionAdapter || {}
  const outputTargetEvidence = brief?.outputTargetEvidence || {}
  const pageRelationKind = normalizeString(pageRelationDecision?.kind) || 'undetermined'
  const publishDeliveryKind = normalizeString(publishDeliveryDecision?.kind)
  const hostExecutionAdapterKind = normalizeString(hostExecutionAdapter?.kind)
  const relatedPagePath = normalizeRelativePath(outputTargetEvidence?.relatedPagePath || '')
  const appEntryPath = normalizeRelativePath(
    navigationMountAction?.appEntryPath || brief?.projectHostContract?.projectEntryMountCapability?.appEntryPath || ''
  )
  const effectivePageFilePath =
    normalizeRelativePath(pageFileRelativePath) ||
    normalizeRelativePath(brief?.requestedBusiness?.targetBusinessPath)
  const effectiveStyleImportPath = resolveProjectStylePath(
    effectivePageFilePath || relatedPagePath || appEntryPath || 'src/main.jsx'
  )
  const managedPublishEntryPath = normalizeRelativePath(
    managedMfPublishEntry?.path || hostExecutionAdapter?.publishEntry?.managedPublishEntryPath || ''
  )

  if (
    (publishDeliveryKind === 'managed-mf-publish-entry' ||
      (pageRelationKind !== 'same-module-subview' &&
        shouldUseManagedPublishEntry({
          navigationMountAction,
          managedMfPublishEntry: managedMfPublishEntry || {},
        }))) &&
    managedPublishEntryPath
  ) {
    return buildDecision({
      owner: STYLE_DELIVERY_OWNERS.MANAGED_PUBLISH_ENTRY,
      mode: 'managed-mf-publish-entry',
      proofSource: [
        `publish-delivery:${publishDeliveryKind || 'managed-mf-publish-entry'}`,
        'navigation-mount-action:materialize-mf-publish-entry',
        managedMfPublishEntry?.required === true ? 'managed-mf-publish-entry:required' : '',
      ],
      styleImportPath: effectiveStyleImportPath,
      effectiveEntryPath: managedPublishEntryPath,
      verifiedBy: ['managed-publish-entry-style-import'],
      reason:
        'The page is delivered through a managed Module Federation publish entry, so that publish entry owns the typical-page runtime style import.',
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  if (publishDeliveryKind === 'project-owned-direct-expose') {
    return buildDecision({
      owner: STYLE_DELIVERY_OWNERS.PAGE_LOCAL_FALLBACK,
      mode: 'project-owned-direct-expose',
      proofSource: [
        `publish-delivery:${publishDeliveryKind}`,
        `page-relation:${pageRelationKind || 'undetermined'}`,
      ],
      styleImportPath: effectiveStyleImportPath,
      effectiveEntryPath: effectivePageFilePath,
      verifiedBy: ['page-local-style-import'],
      reason:
        'The project explicitly keeps ownership of the direct-expose publish path, so the generated page file remains the local runtime-style owner.',
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  if (
    pageRelationKind === 'same-module-subview' &&
    hostExecutionAdapterKind === MF_DIRECT_EXPOSE_LEGACY_ADAPTER_KIND
  ) {
    return buildDecision({
      owner: STYLE_DELIVERY_OWNERS.PAGE_LOCAL_FALLBACK,
      mode: 'same-module-subview-legacy-direct-expose',
      proofSource: [
        `page-relation:${pageRelationKind}`,
        `host-execution-adapter:${hostExecutionAdapterKind}`,
      ],
      styleImportPath: effectiveStyleImportPath,
      effectiveEntryPath: effectivePageFilePath,
      verifiedBy: ['page-local-style-import'],
      reason:
        'The page remains a same-module subview, but the legacy direct-expose adapter still requires the generated page file to carry the managed runtime styles locally.',
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  if (pageRelationKind === 'same-module-subview' && relatedPagePath) {
    return buildDecision({
      owner: STYLE_DELIVERY_OWNERS.PARENT_ENTRY,
      mode: 'same-module-subview-parent-entry',
      proofSource: ['output-target-evidence:related-page-path'],
      styleImportPath: effectiveStyleImportPath,
      effectiveEntryPath: relatedPagePath,
      verifiedBy: ['parent-entry-style-import'],
      reason:
        'The page stays inside the parent module flow, so the confirmed parent entry is the primary style-delivery owner when it explicitly carries the managed runtime styles.',
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  if (appEntryPath) {
    return buildDecision({
      owner: STYLE_DELIVERY_OWNERS.PROJECT_ENTRY,
      mode: 'project-entry-shell',
      proofSource: ['navigation-mount-action:app-entry-path'],
      styleImportPath: effectiveStyleImportPath,
      effectiveEntryPath: appEntryPath,
      verifiedBy: ['project-entry-style-import'],
      reason:
        'The project app entry is the confirmed delivery owner for this flow, so it should carry the managed runtime styles once.',
      pageRelationKind,
      hostExecutionAdapterKind,
    })
  }

  return buildDecision({
    owner: STYLE_DELIVERY_OWNERS.PAGE_LOCAL_FALLBACK,
    mode: 'page-local-fallback',
    proofSource: ['fallback:no-stable-entry-style-owner'],
    styleImportPath: effectiveStyleImportPath,
    effectiveEntryPath: effectivePageFilePath,
    verifiedBy: ['page-local-style-import'],
    reason:
      'No stable upstream entry could be proven as the effective style-delivery owner, so the generated page file must carry the managed runtime styles directly.',
    pageRelationKind,
    hostExecutionAdapterKind,
  })
}

export async function verifyStyleDeliveryDecision({
  targetRoot,
  styleDeliveryDecision = null,
} = {}) {
  const decision = styleDeliveryDecision && typeof styleDeliveryDecision === 'object'
    ? styleDeliveryDecision
    : null

  if (!decision) {
    return {
      ok: false,
      reason: 'styleDeliveryDecision is missing from the persisted page metadata.',
      evidence: {
        status: 'missing',
      },
    }
  }

  const owner = normalizeString(decision.owner)
  const effectiveEntryPath = normalizeRelativePath(decision.effectiveEntryPath)
  const styleImportPath = normalizeRelativePath(decision.styleImportPath)

  if (!owner || !effectiveEntryPath || !styleImportPath) {
    return {
      ok: false,
      reason:
        'styleDeliveryDecision is incomplete; owner, effectiveEntryPath, and styleImportPath are all required.',
      evidence: {
        status: 'invalid',
        owner,
        effectiveEntryPath,
        styleImportPath,
      },
    }
  }

  const entryAbsolutePath = path.join(targetRoot, effectiveEntryPath)
  const entrySource = await readTextIfExists(entryAbsolutePath)
  if (!entrySource) {
    return {
      ok: false,
      reason: `style-delivery owner file is missing or unreadable: ${effectiveEntryPath}`,
      evidence: {
        status: 'missing-entry-file',
        owner,
        effectiveEntryPath,
        styleImportPath,
      },
    }
  }

  const hasManagedStyleImport = sourceContainsManagedRuntimeStyleImport({
    source: entrySource,
    entryRelativePath: effectiveEntryPath,
    styleImportPath,
  })
  if (!hasManagedStyleImport) {
    return {
      ok: false,
      reason: `${owner} does not import the managed runtime styles declared by styleDeliveryDecision.`,
      evidence: {
        status: 'missing-style-import',
        owner,
        mode: normalizeString(decision.mode),
        proofSource: normalizeArray(decision.proofSource),
        verifiedBy: normalizeArray(decision.verifiedBy),
        effectiveEntryPath,
        styleImportPath,
        expectedImportSource: resolveStyleDeliveryImportSource({
          entryRelativePath: effectiveEntryPath,
          styleImportPath,
        }),
      },
    }
  }

  return {
    ok: true,
    reason: `${owner} imports the managed runtime styles declared by styleDeliveryDecision.`,
    evidence: {
      status: 'pass',
      owner,
      mode: normalizeString(decision.mode),
      proofSource: normalizeArray(decision.proofSource),
      verifiedBy: normalizeArray(decision.verifiedBy),
      effectiveEntryPath,
      styleImportPath,
      expectedImportSource: resolveStyleDeliveryImportSource({
        entryRelativePath: effectiveEntryPath,
        styleImportPath,
      }),
    },
  }
}
