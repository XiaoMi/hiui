import path from 'node:path'

export const BUSINESS_SEMANTIC_ARTIFACT_CLASSES = new Set([
  'business-page-source',
  'business-mock-data',
])

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

export function classifyGeneratedArtifact(file = {}) {
  if (String(file.artifactClass || '').trim()) {
    return String(file.artifactClass).trim()
  }

  if (file.isManagedLocalRuntimeAsset === true) return 'managed-runtime'
  if (file.isRuntimePrimitive === true) return 'runtime-primitive'
  if (file.isManagedFormalHostSupportAsset === true) return 'formal-host-support'
  if (file.isPage === true) return 'business-page-source'

  const normalizedPath = normalizeRelativePath(file.destName || file.destPath || '')
  const baseName = path.posix.basename(normalizedPath)

  if (baseName === 'hiui-pagegen.meta.json') return 'generation-meta'
  if (/^mock\.[cm]?[jt]sx?$/.test(baseName)) return 'business-mock-data'
  if (/\.mock\.[cm]?[jt]sx?$/.test(baseName)) return 'business-mock-data'
  if (/^page-localization\.[cm]?[jt]sx?$/.test(baseName)) return 'page-localization-support'
  if (normalizedPath.includes('/page-owned-mount-support/')) return 'page-owned-support'
  if (baseName === 'field-map-provider.tsx') return 'generated-support-file'
  if (baseName === 'chart-theme.ts') return 'generated-support-file'
  if (/\.(?:css|scss|sass)$/.test(baseName)) return 'page-style'

  return 'page-support'
}

export function annotateGeneratedArtifacts(files = []) {
  return files.map((file) => ({
    ...file,
    artifactClass: classifyGeneratedArtifact(file),
  }))
}

function normalizeSemanticReadiness(semanticReadiness) {
  return semanticReadiness && typeof semanticReadiness === 'object'
    ? semanticReadiness
    : {
        status: 'unknown',
        ready: true,
        blockedBy: [],
        reason: '',
      }
}

export function summarizeGeneratedArtifacts(files = []) {
  const summary = {
    totalFiles: 0,
    classes: [],
    countsByClass: {},
    businessSemanticArtifactClasses: [...BUSINESS_SEMANTIC_ARTIFACT_CLASSES],
    businessSemanticArtifactCount: 0,
  }

  for (const file of files) {
    const artifactClass = classifyGeneratedArtifact(file)
    summary.totalFiles += 1
    summary.countsByClass[artifactClass] = (summary.countsByClass[artifactClass] || 0) + 1
    if (BUSINESS_SEMANTIC_ARTIFACT_CLASSES.has(artifactClass)) {
      summary.businessSemanticArtifactCount += 1
    }
  }

  summary.classes = Object.keys(summary.countsByClass).sort()
  return summary
}

export function resolveGeneratedArtifactWritePlan({
  files = [],
  semanticReadiness = null,
} = {}) {
  const annotatedFiles = annotateGeneratedArtifacts(files)
  const readiness = normalizeSemanticReadiness(semanticReadiness)

  return {
    status: 'all-artifacts-writable',
    canWrite: true,
    reason:
      readiness.ready === false
        ? String(readiness.reason || '').trim() ||
          'Business semantics are incomplete, but managed generation no longer blocks page artifact writes on that signal alone.'
        : '',
    blockedBy: [],
    writableFiles: annotatedFiles,
    blockedFiles: [],
    writableArtifactSummary: summarizeGeneratedArtifacts(annotatedFiles),
    blockedArtifactSummary: summarizeGeneratedArtifacts([]),
  }
}
