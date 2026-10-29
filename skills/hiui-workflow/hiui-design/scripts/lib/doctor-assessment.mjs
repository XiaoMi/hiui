const LAYOUT_CONTRACT_CHECK_IDS = new Set([
  'formal-host-provider-bridge-for-package-shells',
  'formal-host-outlet-height-chain-contract',
  'formal-host-height-chain-for-official-shells',
  'formal-host-content-gutter-contract',
  'formal-host-shared-header-slot-collapse',
  'root-viewport-style-contract',
  'public-shell-viewport-compatibility',
])

export function overallStatusFromChecks(checks = []) {
  const failedHard = checks.some((item) => !item.ok && item.severity === 'error')
  if (failedHard) return 'fail'
  const needsManual = checks.some((item) => !item.ok && item.severity === 'manual')
  if (needsManual) return 'manual'
  const hasWarnings = checks.some((item) => !item.ok && item.severity === 'warn')
  if (hasWarnings) return 'warn'
  return 'pass'
}

function summarizeOutstandingChecks(checks = []) {
  const summaries = checks
    .map((item) => String(item?.summary || '').trim())
    .filter(Boolean)

  if (summaries.length === 0) {
    return ''
  }

  if (summaries.length <= 2) {
    return summaries.join('; ')
  }

  return `${summaries.slice(0, 2).join('; ')}; plus ${summaries.length - 2} more`
}

export function formatAssessmentStatusLabel(status) {
  return String(status || '').trim().toUpperCase() || 'UNKNOWN'
}

export function summarizeDoctorAssessment({ checks = [], overallStatus = '', hostProfile = null }) {
  const layoutChecks = checks.filter((item) => LAYOUT_CONTRACT_CHECK_IDS.has(item.id))
  const layoutFailedChecks = layoutChecks.filter((item) => !item.ok)
  const runtimeChecks = checks.filter((item) => !LAYOUT_CONTRACT_CHECK_IDS.has(item.id))
  const runtimeFailedChecks = runtimeChecks.filter((item) => !item.ok)
  const runtimeBaselineStatus = overallStatusFromChecks(runtimeChecks)

  let layoutContractStatus = 'pass'
  if (layoutFailedChecks.some((item) => item.severity === 'error' || item.severity === 'manual')) {
    layoutContractStatus = 'blocked'
  } else if (layoutFailedChecks.some((item) => item.severity === 'warn')) {
    layoutContractStatus = 'warn'
  } else if (hostProfile?.riskLevel === 'high') {
    layoutContractStatus = 'partial'
  }

  const runtimeOutstandingSummary = summarizeOutstandingChecks(runtimeFailedChecks)
  const layoutOutstandingSummary = summarizeOutstandingChecks(layoutFailedChecks)

  let runtimeBaselineSummary = 'Managed runtime baseline and generation wiring checks passed.'
  if (runtimeBaselineStatus === 'warn') {
    runtimeBaselineSummary = runtimeOutstandingSummary
      ? `Managed runtime baseline is mostly in place, but warning items remain: ${runtimeOutstandingSummary}.`
      : 'Managed runtime baseline is mostly in place, but warning items remain.'
  } else if (runtimeBaselineStatus === 'manual') {
    runtimeBaselineSummary = runtimeOutstandingSummary
      ? `Managed runtime baseline still needs manual integration evidence: ${runtimeOutstandingSummary}.`
      : 'Managed runtime baseline still needs manual integration evidence.'
  } else if (runtimeBaselineStatus === 'fail') {
    runtimeBaselineSummary = runtimeOutstandingSummary
      ? `Managed runtime baseline is not ready yet: ${runtimeOutstandingSummary}.`
      : 'Managed runtime baseline is not ready yet.'
  }

  let layoutContractSummary = 'Host layout contract checks passed for the current host shape.'
  if (layoutContractStatus === 'warn') {
    layoutContractSummary = layoutOutstandingSummary
      ? `Host layout contract has warning-level gaps: ${layoutOutstandingSummary}.`
      : 'Host layout contract has warning-level gaps.'
  } else if (layoutContractStatus === 'blocked') {
    layoutContractSummary = layoutOutstandingSummary
      ? `Host layout contract is not proven yet: ${layoutOutstandingSummary}.`
      : 'Host layout contract is not proven yet.'
  } else if (layoutContractStatus === 'partial') {
    layoutContractSummary =
      'No blocking layout-contract failure was found in this run, but high-risk legacy hosts are still treated as runtime-baseline pass with partial layout certification, not a full layout-contract pass.'
  }

  let decision = 'Runtime baseline passed and the current host layout contract checks also passed.'
  if (overallStatus === 'pass' && layoutContractStatus === 'partial') {
    decision =
      'Runtime baseline passed. Layout contract has no blocking findings in this run, but it is still only partially certified for this high-risk legacy host.'
  } else if (overallStatus === 'warn') {
    decision =
      layoutContractStatus === 'pass'
        ? 'Runtime baseline is basically ready and layout contract checks passed, but warning items should be cleared before large-scale page generation.'
        : 'Runtime baseline is basically ready, but layout contract or compatibility follow-up is still required before large-scale page generation.'
  } else if (overallStatus === 'manual') {
    decision =
      runtimeBaselineStatus === 'pass' && layoutContractStatus === 'blocked'
        ? 'Managed runtime baseline passed, but the host layout contract still needs manual proof before page generation should begin.'
        : 'Manual route or host integration work is still required before page generation should begin.'
  } else if (overallStatus === 'fail') {
    if (runtimeBaselineStatus === 'pass' && layoutContractStatus === 'blocked') {
      decision =
        'Managed runtime baseline passed, but the host layout contract failed. Fix the blocking layout checks before generating non-drawer pages.'
    } else if (runtimeBaselineStatus !== 'pass' && layoutContractStatus === 'pass') {
      decision =
        'Host layout contract checks passed, but the managed runtime baseline failed. Fix the runtime baseline before page generation.'
    } else {
      decision =
        'Do not continue with new hiui-design page generation or integration work yet. Fix the hard failures first.'
    }
  }

  return {
    runtimeBaseline: {
      status: runtimeBaselineStatus,
      failedCheckIds: runtimeFailedChecks.map((item) => item.id),
      summary: runtimeBaselineSummary,
    },
    layoutContract: {
      status: layoutContractStatus,
      failedCheckIds: layoutFailedChecks.map((item) => item.id),
      summary: layoutContractSummary,
    },
    decision,
  }
}

export function buildDoctorAssessmentDecisionLines(assessment) {
  return [
    `runtime baseline: ${formatAssessmentStatusLabel(assessment.runtimeBaseline.status)}. ${assessment.runtimeBaseline.summary}`,
    `layout contract: ${formatAssessmentStatusLabel(assessment.layoutContract.status)}. ${assessment.layoutContract.summary}`,
    `overall decision: ${assessment.decision}`,
  ]
}
