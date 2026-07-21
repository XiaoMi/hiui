import fs from 'fs'
import path from 'path'
import {
  OFFICIAL_RUNTIME_REGISTRY_PATH,
  PAGEGEN_ROOT,
  assert,
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  relativeToRoot,
  writeJson,
} from '../generators/shared.mjs'
import {
  ASSET_GOVERNANCE_REGISTRY_PATH,
  readAssetGovernanceRegistry,
  resolveAssetGovernanceState,
  resolvePageTypeGovernancePolicy,
} from '../generators/asset-governance.mjs'

const VISUAL_SPECS_PATH = path.resolve(PAGEGEN_ROOT, 'visual', 'specs.json')
const RUNTIME_BRIDGE_MATRIX_PATH = path.resolve(
  PAGEGEN_ROOT,
  '..',
  'rules',
  'runtime-bridged-component-matrix.json'
)
const LEGACY_RUNTIME_BRIDGE_PRIORITY_EQUIVALENTS = new Map([
  ['official-mirror', 'direct-standard-component'],
])

function collectLegacyBridgePrimaryEntries(values = []) {
  return values.reduce((entries, value, index) => {
    const normalizedValue =
      LEGACY_RUNTIME_BRIDGE_PRIORITY_EQUIVALENTS.get(value) || value

    if (normalizedValue === 'direct-standard-component') {
      entries.push({
        index,
        normalizedValue,
        rawValue: value,
      })
    }

    return entries
  }, [])
}

export function verifyGovernanceCoverage() {
  const governanceRegistry = readAssetGovernanceRegistry()
  const officialRuntimeRegistry = readOfficialRuntimeRegistry()
  const visualSpecs = readJson(VISUAL_SPECS_PATH)
  const runtimeBridgeMatrix = readJson(RUNTIME_BRIDGE_MATRIX_PATH)
  const runtimeBridgeProfileByPageType = new Map(
    (runtimeBridgeMatrix.profiles || []).map((profile) => [String(profile.pageTypeId || '').trim(), profile])
  )
  const visualSpecMap = new Map(visualSpecs.map((spec) => [spec.id, spec]))
  const OFFICIAL_MIRROR_MAX_DIFF_RATIO = 0.05
  const MANAGED_ANALYTICS_MAX_DIFF_RATIO = 0.05
  const failures = []
  const coveredPageTypes = []

  Object.keys(governanceRegistry.pageTypeProfiles || {}).forEach((pageType) => {
    const pagePolicy = resolvePageTypeGovernancePolicy(pageType, {
      projectMode: 'host-integration',
      projectType: 'brownfield',
    })
    const legacyPagePolicy = resolvePageTypeGovernancePolicy(pageType, {
      projectMode: 'legacy-host-compatible',
      projectType: 'brownfield',
    })
    const canonicalGovernance = resolveAssetGovernanceState({
      pageType,
      generationMode: 'canonical',
      projectMode: 'host-integration',
      projectType: 'brownfield',
    })
    const compatibilityProfile = pagePolicy.compatibilityProfile
    const isOfficialMirror = compatibilityProfile === 'official-mirror'
    const isManagedAnalyticsShell = compatibilityProfile === 'managed-analytics-shell'

    if (!isOfficialMirror && !isManagedAnalyticsShell) {
      return
    }

    coveredPageTypes.push(pageType)
    const parityPath = path.resolve(PAGEGEN_ROOT, 'parity', `${pageType}.json`)
    const runtimeEntry = officialRuntimeRegistry[pageType]
    const runtimeBridgeProfile = runtimeBridgeProfileByPageType.get(pageType)
    const visualSpec = visualSpecMap.get(pageType)

    if (!runtimeEntry) {
      failures.push(
        `${pageType} 已声明 ${compatibilityProfile}，但缺少官方 runtime 注册：${relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH)}`
      )
    }

    if (isOfficialMirror) {
      if (canonicalGovernance.parityStatus !== 'parity-manifest-required') {
        failures.push(`${pageType} official-mirror 必须声明 parityStatus=parity-manifest-required`)
      }
      if (canonicalGovernance.parityContract !== 'required') {
        failures.push(`${pageType} official-mirror 缺少 parityContract=required`)
      }
      if (canonicalGovernance.driftWhitelistPolicy !== 'zero-or-explicit-whitelist') {
        failures.push(`${pageType} official-mirror 缺少 driftWhitelistPolicy=zero-or-explicit-whitelist`)
      }
    }

    if (isManagedAnalyticsShell) {
      if (canonicalGovernance.parityStatus !== 'managed-analytics-wrapper-contract') {
        failures.push(
          `${pageType} managed-analytics-shell 必须声明 parityStatus=managed-analytics-wrapper-contract`
        )
      }
      if (canonicalGovernance.parityContract !== 'managed-analytics-wrapper-required') {
        failures.push(
          `${pageType} managed-analytics-shell 缺少 parityContract=managed-analytics-wrapper-required`
        )
      }
    }

    if (!fs.existsSync(parityPath)) {
      failures.push(`${pageType} 已声明 ${compatibilityProfile}，但缺少 parity manifest：${relativeToRoot(parityPath)}`)
    } else {
      const parity = readJson(parityPath)
      if (isOfficialMirror && !parity.canonicalSource?.path) {
        failures.push(`${pageType} parity manifest 缺少 canonicalSource.path`)
      }
      if (
        isManagedAnalyticsShell &&
        (!parity.managedAnalyticsWrapper ||
          !Array.isArray(parity.managedAnalyticsWrapper.requiredTokens) ||
          parity.managedAnalyticsWrapper.requiredTokens.length === 0)
      ) {
        failures.push(`${pageType} managed-analytics-shell parity manifest 缺少 managedAnalyticsWrapper.requiredTokens`)
      }
      if (isManagedAnalyticsShell && !parity.canonicalSource?.path) {
        failures.push(`${pageType} managed-analytics-shell parity manifest 缺少 canonicalSource.path`)
      }
      if (!parity.officialSnapshot && !parity.officialSource?.path) {
        failures.push(`${pageType} parity manifest 缺少官方 baseline`)
      }
    }

    if (!visualSpec) {
      failures.push(`${pageType} 已声明 ${compatibilityProfile}，但缺少视觉基线 spec：${relativeToRoot(VISUAL_SPECS_PATH)}`)
      return
    }

    if (runtimeBridgeProfile) {
      const expectedLegacyPrimaryEntries = collectLegacyBridgePrimaryEntries(
        runtimeBridgeProfile.resolutionOrder || []
      )
      const actualLegacyPrimaryEntries = collectLegacyBridgePrimaryEntries(
        legacyPagePolicy.truthSourcePriority || []
      )
      const expectedLegacyPrimaryOrder = expectedLegacyPrimaryEntries.map(
        (entry) => entry.normalizedValue
      )
      const actualLegacyPrimaryOrder = actualLegacyPrimaryEntries.map(
        (entry) => entry.normalizedValue
      )

      if (expectedLegacyPrimaryOrder.length === 0) {
        failures.push(
          `${pageType} runtime bridge profile 缺少可执行的 primary resolution order：${relativeToRoot(RUNTIME_BRIDGE_MATRIX_PATH)}`
        )
      } else if (
        expectedLegacyPrimaryOrder.length !== actualLegacyPrimaryOrder.length ||
        expectedLegacyPrimaryOrder.some((value, index) => actualLegacyPrimaryOrder[index] !== value)
      ) {
        failures.push(
          `${pageType} legacy truthSourcePriority 与 runtime bridge resolutionOrder 不一致；期望 ${expectedLegacyPrimaryOrder.join(
            ' -> '
          )}，实际 ${actualLegacyPrimaryOrder.join(' -> ')}`
        )
      }

    }

    const expectedPreviewPageId = `pagegen-${pageType}`
    if (visualSpec.previewPageId !== expectedPreviewPageId) {
      failures.push(
        `${pageType} visual spec previewPageId=${visualSpec.previewPageId || ''}，期望 ${expectedPreviewPageId}`
      )
    }

    if (runtimeEntry && visualSpec.officialPageId !== runtimeEntry.pageId) {
      failures.push(
        `${pageType} visual spec officialPageId=${visualSpec.officialPageId || ''}，应与 runtime registry pageId=${runtimeEntry.pageId} 对齐`
      )
    }

    if (isOfficialMirror && Number(visualSpec.maxDiffRatio || 0) > OFFICIAL_MIRROR_MAX_DIFF_RATIO) {
      failures.push(
        `${pageType} visual spec maxDiffRatio=${visualSpec.maxDiffRatio}，official-mirror 页型不得宽于 ${OFFICIAL_MIRROR_MAX_DIFF_RATIO}`
      )
    }

    if (
      isManagedAnalyticsShell &&
      Number(visualSpec.maxDiffRatio || 0) > MANAGED_ANALYTICS_MAX_DIFF_RATIO
    ) {
      failures.push(
        `${pageType} visual spec maxDiffRatio=${visualSpec.maxDiffRatio}，managed-analytics-shell 页型不得宽于 ${MANAGED_ANALYTICS_MAX_DIFF_RATIO}`
      )
    }
  })

  return {
    status: failures.length ? 'failed' : 'passed',
    coveredPageTypes,
    checkedFiles: [
      relativeToRoot(ASSET_GOVERNANCE_REGISTRY_PATH),
      relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH),
      relativeToRoot(RUNTIME_BRIDGE_MATRIX_PATH),
      relativeToRoot(VISUAL_SPECS_PATH),
    ],
    blockingIssues: failures,
  }
}

function main() {
  parseArgs(process.argv.slice(2))
  const outputPath = path.resolve(PAGEGEN_ROOT, 'outputs', 'verify-governance-coverage.json')

  try {
    const result = verifyGovernanceCoverage()
    writeJson(outputPath, {
      verifiedAt: new Date().toISOString(),
      ...result,
    })

    assert(result.status === 'passed', result.blockingIssues.join('\n'))
    console.log(`hiui-pagegen verify-governance-coverage passed: ${relativeToRoot(outputPath)}`)
  } catch (error) {
    writeJson(outputPath, {
      verifiedAt: new Date().toISOString(),
      status: 'failed',
      blockingIssues: [error.message],
    })
    console.error(`hiui-pagegen verify-governance-coverage failed: ${relativeToRoot(outputPath)}`)
    console.error(error.message)
    process.exitCode = 1
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main()
}
