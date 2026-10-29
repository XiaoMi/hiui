import {
  compareVersionCore,
  isVersionCompatible,
  parseVersionFloor,
} from './version-compatibility.mjs'

const HIUI_EQUIVALENT_PRERELEASE_CHANNELS = new Set(['experimental', 'canary'])

function getVersionFromAliasSpec(spec) {
  if (!String(spec || '').startsWith('npm:')) return String(spec || '')
  const versionSeparatorIndex = spec.lastIndexOf('@')
  return versionSeparatorIndex > 'npm:'.length ? spec.slice(versionSeparatorIndex + 1) : ''
}

function parseNpmAliasSpec(spec) {
  const normalized = String(spec || '').trim()
  if (!normalized.startsWith('npm:')) return null

  const aliasTarget = normalized.slice('npm:'.length)
  const versionSeparatorIndex = aliasTarget.lastIndexOf('@')
  if (versionSeparatorIndex <= 0) return null

  return {
    sourceDepName: aliasTarget.slice(0, versionSeparatorIndex),
    sourceVersion: aliasTarget.slice(versionSeparatorIndex + 1),
  }
}

function isSameChannelOrHigherSequence(actualFloor, expectedFloor) {
  if (!actualFloor || !expectedFloor) return false
  if (compareVersionCore(actualFloor, expectedFloor) !== 0) return false
  if (actualFloor.prereleaseChannel !== expectedFloor.prereleaseChannel) return false
  if (!actualFloor.prereleaseChannel) return false
  if (
    Number.isFinite(actualFloor.prereleaseSequence) &&
    Number.isFinite(expectedFloor.prereleaseSequence)
  ) {
    return actualFloor.prereleaseSequence >= expectedFloor.prereleaseSequence
  }
  return actualFloor.prerelease === expectedFloor.prerelease
}

function isEquivalentHiuiChannelCompatibility(actualFloor, expectedFloor, expectedSourceDepName) {
  if (!actualFloor || !expectedFloor) return false
  if (!String(expectedSourceDepName || '').startsWith('@hi-ui/')) return false
  if (compareVersionCore(actualFloor, expectedFloor) !== 0) return false
  if (actualFloor.prereleaseChannel === expectedFloor.prereleaseChannel) return false
  if (!actualFloor.prereleaseChannel || !expectedFloor.prereleaseChannel) return false
  return (
    HIUI_EQUIVALENT_PRERELEASE_CHANNELS.has(actualFloor.prereleaseChannel) &&
    HIUI_EQUIVALENT_PRERELEASE_CHANNELS.has(expectedFloor.prereleaseChannel)
  )
}

function getIsolatedAliasCompatibility({
  actualSpec,
  expectedSourceDepName,
  expectedVersion,
}) {
  const parsedAlias = parseNpmAliasSpec(actualSpec)
  if (!parsedAlias) {
    return {
      compatible: false,
      exact: false,
      mode: 'invalid-alias-spec',
      actualVersion: '',
      actualSourceDepName: '',
    }
  }

  if (parsedAlias.sourceDepName !== expectedSourceDepName) {
    return {
      compatible: false,
      exact: false,
      mode: 'source-mismatch',
      actualVersion: parsedAlias.sourceVersion,
      actualSourceDepName: parsedAlias.sourceDepName,
    }
  }

  if (isVersionCompatible(parsedAlias.sourceVersion, expectedVersion)) {
    return {
      compatible: true,
      exact: parsedAlias.sourceVersion === expectedVersion,
      mode: 'version-contract-compatible',
      actualVersion: parsedAlias.sourceVersion,
      actualSourceDepName: parsedAlias.sourceDepName,
    }
  }

  const actualFloor = parseVersionFloor(parsedAlias.sourceVersion)
  const expectedFloor = parseVersionFloor(expectedVersion)
  if (isSameChannelOrHigherSequence(actualFloor, expectedFloor)) {
    return {
      compatible: true,
      exact: false,
      mode: 'same-channel-floor-compatible',
      actualVersion: parsedAlias.sourceVersion,
      actualSourceDepName: parsedAlias.sourceDepName,
    }
  }

  if (isEquivalentHiuiChannelCompatibility(actualFloor, expectedFloor, expectedSourceDepName)) {
    return {
      compatible: true,
      exact: false,
      mode: 'equivalent-hiui-prerelease-channel',
      actualVersion: parsedAlias.sourceVersion,
      actualSourceDepName: parsedAlias.sourceDepName,
    }
  }

  return {
    compatible: false,
    exact: false,
    mode: 'version-mismatch',
    actualVersion: parsedAlias.sourceVersion,
    actualSourceDepName: parsedAlias.sourceDepName,
  }
}

export {
  getIsolatedAliasCompatibility,
  getVersionFromAliasSpec,
  parseNpmAliasSpec,
}
