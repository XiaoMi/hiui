import fs from 'node:fs/promises'
import path from 'node:path'

function stripJsonComments(source) {
  let output = ''
  let inString = false
  let quote = ''
  let escaped = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    const next = source[index + 1]

    if (inString) {
      output += char
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        inString = false
        quote = ''
      }
      continue
    }

    if (char === '"' || char === "'") {
      inString = true
      quote = char
      output += char
      continue
    }

    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') index += 1
      output += '\n'
      continue
    }

    if (char === '/' && next === '*') {
      index += 2
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        if (source[index] === '\n') output += '\n'
        index += 1
      }
      index += 1
      continue
    }

    output += char
  }

  return output
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function normalizeStructureToken(value) {
  const text = String(value || '').trim().toLowerCase()
  if (!text) return ''
  if (/(detail[-\s]?table|明细表|数据表|表格|table)/i.test(text)) return 'table'
  if (/(pagination|分页)/i.test(text)) return 'pagination'
  if (/(query[-\s]?filter|筛选|过滤)/i.test(text)) return 'query-filter'
  if (/(stat[-\s]?section|dashboard|metrics|charts|图表|指标|看板)/i.test(text)) return 'stat-section'
  return text
}

function normalizeRelativePath(input) {
  return String(input || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function normalizeString(value) {
  return String(value || '').trim()
}

function isPathInsideRoot(targetPath, rootPath) {
  const target = normalizeRelativePath(targetPath)
  const root = normalizeRelativePath(rootPath)
  if (!target || !root) return false
  return target === root || target.startsWith(`${root}/`)
}

function collectKnownCoverage(contract) {
  return Object.keys(contract.managedCoverage || {})
}

function hasControlledAdjustmentRegion(coverageDecision = {}) {
  return asArray(coverageDecision?.uncoveredUi).includes('page-adjustment-controlled-region')
}

function isIndependentWorkflowCoverageContract(contract = {}) {
  return contract?.generationWorkflow?.replaceBusinessSlotsByDefault === false
}

function normalizeCoverageDecision(input, contract, pageType, manifestPath = '', pageAdjustmentContract = null) {
  const knownCoverage = collectKnownCoverage(contract)
  const derivedUncoveredUi =
    !input?.uncoveredUi && pageAdjustmentContract
      ? ['page-adjustment-controlled-region']
      : asArray(input?.uncoveredUi)
  const uncoveredUi = unique(derivedUncoveredUi)
  const escapeHatches = unique(asArray(input?.escapeHatches))
  const hasManagedCoverageContract = knownCoverage.length > 0
  const coveredRegions = unique(asArray(input?.coveredRegions).length > 0 ? input.coveredRegions : knownCoverage)
  const managedCoverageSet = new Set(knownCoverage)
  const inferredUnexpectedStructures =
    !input?.unexpectedStructures && pageAdjustmentContract?.intentContract?.mustNotAdd
      ? pageAdjustmentContract.intentContract.mustNotAdd
          .map((item) => normalizeStructureToken(item))
          .filter((item) => managedCoverageSet.has(item))
      : asArray(input?.unexpectedStructures)
  const unexpectedStructures = unique(inferredUnexpectedStructures)
  const managedByTemplate =
    uncoveredUi.length === 0 && escapeHatches.length === 0 && unexpectedStructures.length === 0
  const adjustmentHandling =
    input?.adjustmentHandling || (pageAdjustmentContract ? 'page-adjustment-contract' : 'template-only')
  const coveredStatus = isIndependentWorkflowCoverageContract(contract)
    ? 'covered-by-independent-workflow'
    : 'covered-by-typical-page'

  return {
    status:
      input?.status ||
      (adjustmentHandling === 'page-adjustment-contract'
        ? unexpectedStructures.length > 0
          ? 'requires-page-adjustment-contract'
          : 'requires-page-adjustment-contract'
        : managedByTemplate && hasManagedCoverageContract
          ? coveredStatus
          : managedByTemplate
            ? 'legacy-contract-without-managed-coverage'
            : unexpectedStructures.length > 0
              ? 'violates-intent-contract'
              : 'requires-hiui5-decision'),
    pageType: input?.pageType || pageType?.id || '',
    matchedManifestPath: input?.matchedManifestPath || manifestPath,
    managedRegions: unique(asArray(input?.managedRegions).length > 0 ? input.managedRegions : coveredRegions),
    businessSlots: unique(asArray(input?.businessSlots).length > 0 ? input.businessSlots : asArray(contract.businessSlots)),
    coveredRegions,
    uncoveredUi,
    escapeHatches,
    unexpectedStructures,
    adjustmentHandling,
    stopReason: input?.stopReason || '',
    approvedBypass: input?.approvedBypass || null,
    managedByTemplate,
    hasManagedCoverageContract,
    evidence: unique([
      contract.baseTemplatePath ? `baseTemplatePath:${contract.baseTemplatePath}` : '',
      contract.requiredShell ? `requiredShell:${contract.requiredShell}` : '',
      ...(asArray(input?.evidence)),
    ]),
  }
}

export async function loadHostImportPolicy({ skillRoot }) {
  const contextPath = path.join(skillRoot, '.context.jsonc')
  const raw = await fs.readFile(contextPath, 'utf8')
  const context = JSON.parse(stripJsonComments(raw))
  const hostImportPolicy = context.hostImportPolicy || {}
  const generationTargetPolicy = context.generationTargetPolicy || {}
  const generationGuidance = context.generationGuidance || {}

  return {
    contextPath,
    hostImportPolicy,
    generationTargetPolicy: {
      scope: generationTargetPolicy.scope || '',
      defaultBusinessPageDir: generationTargetPolicy.defaultBusinessPageDir || '',
      forbiddenOutputRoots: asArray(generationTargetPolicy.forbiddenOutputRoots),
      previewReferencePolicy: generationTargetPolicy.previewReferencePolicy || 'reference-only',
      routeIsolationPolicy: generationTargetPolicy.routeIsolationPolicy || '',
      notes: asArray(generationTargetPolicy.notes),
    },
    generationGuidance,
  }
}

export function buildCoverageDecision({
  pageType,
  contract,
  manifestPath = '',
  requestedCoverageDecision = null,
  pageAdjustmentContract = null,
} = {}) {
  if (!pageType || !contract) {
    throw new Error('buildCoverageDecision requires pageType and contract')
  }

  const coverageDecision = normalizeCoverageDecision(
    requestedCoverageDecision,
    contract,
    pageType,
    manifestPath,
    pageAdjustmentContract
  )
  const componentDecisionRequired = requiresComponentDecision({
    coverageDecision,
    pageAdjustmentContract,
  })
  const tokenDecisionRequired = requiresTokenDecision({
    coverageDecision,
    pageAdjustmentContract,
  })

  return {
    ...coverageDecision,
    pageTypeId: pageType.id,
    requiredDecisions: {
      componentDecision: componentDecisionRequired,
      tokenDecision: tokenDecisionRequired,
    },
  }
}

export function requiresComponentDecision({ coverageDecision, pageAdjustmentContract = null } = {}) {
  if (hasControlledAdjustmentRegion(coverageDecision)) {
    return true
  }

  if (
    (coverageDecision?.adjustmentHandling === 'page-adjustment-contract' || pageAdjustmentContract) &&
    asArray(coverageDecision?.escapeHatches).length === 0
  ) {
    return true
  }

  return asArray(coverageDecision?.uncoveredUi).length > 0 || asArray(coverageDecision?.escapeHatches).length > 0
}

export function requiresTokenDecision({ coverageDecision, pageAdjustmentContract = null } = {}) {
  if (hasControlledAdjustmentRegion(coverageDecision)) {
    return true
  }

  if (
    (coverageDecision?.adjustmentHandling === 'page-adjustment-contract' || pageAdjustmentContract) &&
    asArray(coverageDecision?.escapeHatches).length === 0
  ) {
    return true
  }

  return asArray(coverageDecision?.uncoveredUi).some((item) => /token|style|visual|className|badge|tag|chip|card/i.test(item)) ||
    asArray(coverageDecision?.escapeHatches).length > 0
}

export function validateCoverageDecision({
  pageType,
  contract,
  coverageDecision,
  componentDecision = null,
  tokenDecision = null,
  pageAdjustmentContract = null,
} = {}) {
  const violations = []
  const decision = normalizeCoverageDecision(
    coverageDecision,
    contract || {},
    pageType,
    '',
    pageAdjustmentContract
  )
  const knownCoverage = collectKnownCoverage(contract || {})
  const knownCoverageSet = new Set(knownCoverage)

  if (!pageType) violations.push('Missing pageType for coverage decision validation')
  if (!contract) violations.push('Missing generationContract for coverage decision validation')
  if (!decision.pageType) violations.push('coverageDecision.pageType is required')
  if (pageType?.id && decision.pageType && decision.pageType !== pageType.id) {
    violations.push(`${pageType.id}: coverageDecision.pageType must equal current pageType id ${pageType.id}`)
  }
  if (!decision.matchedManifestPath) violations.push('coverageDecision.matchedManifestPath is required')
  if (decision.adjustmentHandling === 'page-adjustment-contract' && !pageAdjustmentContract) {
    violations.push(`${pageType?.id || 'unknown'}: coverageDecision.adjustmentHandling requires pageAdjustmentContract`)
  }
  if (decision.stopReason) violations.push(`${pageType?.id || 'unknown'}: coverageDecision.stopReason blocks generation: ${decision.stopReason}`)
  if (knownCoverage.length === 0) {
    if (
      decision.adjustmentHandling !== 'page-adjustment-contract' &&
      (decision.uncoveredUi.length > 0 || decision.escapeHatches.length > 0)
    ) {
      violations.push(`${pageType?.id || 'unknown'}: generationContract.managedCoverage is missing; cannot validate uncovered UI ownership`)
    }
  }

  for (const region of asArray(decision.coveredRegions)) {
    if (!knownCoverageSet.has(region)) {
      violations.push(`${pageType?.id || 'unknown'}: coverageDecision.coveredRegions contains unknown region ${region}`)
    }
  }
  if (
    decision.unexpectedStructures.length > 0 &&
    decision.adjustmentHandling !== 'page-adjustment-contract'
  ) {
    violations.push(
      `${pageType?.id || 'unknown'}: unexpectedStructures require pageAdjustmentContract before writing code`
    )
  }

  if (decision.approvedBypass) {
    for (const requiredField of ['owner', 'expiry', 'reviewEvidence']) {
      if (!decision.approvedBypass[requiredField]) {
        violations.push(`${pageType?.id || 'unknown'}: approvedBypass.${requiredField} is required`)
      }
    }
  }

  if (
    decision.uncoveredUi.length === 0 &&
    decision.escapeHatches.length === 0 &&
    decision.unexpectedStructures.length === 0
  ) {
    if (!decision.managedByTemplate) {
      violations.push(`${pageType?.id || 'unknown'}: covered typical-page flow must set managedByTemplate=true`)
    }
    return { status: violations.length > 0 ? 'fail' : 'pass', violations, coverageDecision: decision }
  }

  const hasApprovedBypass = Boolean(decision.approvedBypass && ['owner', 'expiry', 'reviewEvidence'].every((field) => decision.approvedBypass[field]))

  if (
    requiresComponentDecision({ coverageDecision: decision, pageAdjustmentContract }) &&
    !componentDecision &&
    !hasApprovedBypass
  ) {
    violations.push(`${pageType?.id || 'unknown'}: uncovered UI or escape hatch requires componentDecision before writing code`)
  }

  if (
    requiresTokenDecision({ coverageDecision: decision, pageAdjustmentContract }) &&
    !tokenDecision &&
    !hasApprovedBypass
  ) {
    violations.push(`${pageType?.id || 'unknown'}: uncovered visual/token area requires tokenDecision before writing code`)
  }

  return { status: violations.length > 0 ? 'fail' : 'pass', violations, coverageDecision: decision }
}

export function validateOutputTargetDecision({
  pageType,
  requestedBusiness,
  generationTargetPolicy,
} = {}) {
  const violations = []
  const targetBusinessPath = normalizeRelativePath(requestedBusiness?.targetBusinessPath || requestedBusiness?.dest)
  const rawDest = normalizeRelativePath(requestedBusiness?.rawDest)
  const outputTargetSelectedSource = normalizeString(
    requestedBusiness?.outputTargetEvidence?.selectedSource ||
      requestedBusiness?.outputTargetSource
  )
  const defaultBusinessPageDir = normalizeRelativePath(
    requestedBusiness?.defaultBusinessPageDir || generationTargetPolicy?.defaultBusinessPageDir
  )
  const forbiddenOutputRoots = unique(
    asArray(
      requestedBusiness?.forbiddenOutputRoots?.length
      ? requestedBusiness.forbiddenOutputRoots
        : generationTargetPolicy?.forbiddenOutputRoots
    ).map((item) => normalizeRelativePath(item))
  )
  const rawDestOverrideAllowed =
    Boolean(rawDest) &&
    (outputTargetSelectedSource === '' || outputTargetSelectedSource === 'generation-target-policy')

  if (!targetBusinessPath) {
    violations.push(`${pageType?.id || 'unknown'}: targetBusinessPath is required before writing code`)
  }

  if (!defaultBusinessPageDir) {
    violations.push(`${pageType?.id || 'unknown'}: defaultBusinessPageDir is required before writing code`)
  }

  if (
    targetBusinessPath &&
    defaultBusinessPageDir &&
    !rawDestOverrideAllowed &&
    !isPathInsideRoot(targetBusinessPath, defaultBusinessPageDir)
  ) {
    violations.push(
      `${pageType?.id || 'unknown'}: targetBusinessPath ${targetBusinessPath} must stay inside defaultBusinessPageDir ${defaultBusinessPageDir}`
    )
  }

  for (const forbiddenRoot of forbiddenOutputRoots) {
    if (targetBusinessPath && forbiddenRoot && isPathInsideRoot(targetBusinessPath, forbiddenRoot)) {
      violations.push(
        `${pageType?.id || 'unknown'}: targetBusinessPath ${targetBusinessPath} must not be written into forbidden output root ${forbiddenRoot}`
      )
    }
  }

  return {
    status: violations.length > 0 ? 'fail' : 'pass',
    violations,
    rawDest,
    targetBusinessPath,
    defaultBusinessPageDir,
    forbiddenOutputRoots,
  }
}
