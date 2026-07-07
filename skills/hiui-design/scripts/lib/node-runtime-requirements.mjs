import { parseLeadingMajorVersion } from './legacy-runtime-guard.mjs'

function findDeclaredDependency(pkg, depName) {
  return (
    pkg?.dependencies?.[depName] ||
    pkg?.devDependencies?.[depName] ||
    pkg?.peerDependencies?.[depName] ||
    ''
  )
}

function normalizeNodeVersionLabel(version) {
  const raw = String(version || '').trim()
  if (!raw) return '(unknown)'
  return raw.startsWith('v') ? raw : `v${raw}`
}

export function getProjectNodeRuntimeRequirement({
  pkg,
  hostProfile = null,
  currentNodeVersion = process.versions.node,
} = {}) {
  const currentVersion = normalizeNodeVersionLabel(currentNodeVersion)
  const currentMajor = parseLeadingMajorVersion(currentNodeVersion)
  const viteSpec = findDeclaredDependency(pkg, 'vite')
  const viteMajor = parseLeadingMajorVersion(viteSpec)

  if (viteMajor >= 5) {
    return {
      required: true,
      ok: currentMajor >= 18,
      currentVersion,
      currentMajor,
      minimumMajor: 18,
      minimumVersionLabel: 'Node >=18',
      reason: `package.json declares vite ${viteSpec}, and Vite 5+ requires Node >=18`,
      advisory: '',
    }
  }

  const framework = String(hostProfile?.framework || '').trim()
  if (!viteSpec && ['react-vite', 'react-vite-router'].includes(framework)) {
    return {
      required: false,
      ok: true,
      currentVersion,
      currentMajor,
      minimumMajor: 0,
      minimumVersionLabel: '',
      reason: '',
      advisory:
        'The detected host profile is Vite-based. If this target project uses Vite 5 or newer, run install/dev/build commands under Node >=18.',
    }
  }

  return {
    required: false,
    ok: true,
    currentVersion,
    currentMajor,
    minimumMajor: 0,
    minimumVersionLabel: '',
    reason: '',
    advisory: '',
  }
}

export function formatNodeRuntimeRequirementDetail(requirement) {
  if (!requirement) {
    return 'Current Node runtime requirement is unknown.'
  }

  if (!requirement.required) {
    return requirement.advisory || `Current Node runtime: ${requirement.currentVersion}.`
  }

  if (requirement.ok) {
    return `${requirement.currentVersion} satisfies ${requirement.minimumVersionLabel}. ${requirement.reason}.`
  }

  return `${requirement.currentVersion} is below ${requirement.minimumVersionLabel}. ${requirement.reason}. Switch this workspace to Node ${requirement.minimumMajor}+ before running install, dev, or build.`
}
