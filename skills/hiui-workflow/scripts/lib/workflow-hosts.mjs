import os from 'node:os'
import path from 'node:path'

function availableHosts(hostProfiles) {
  return Object.keys(hostProfiles?.hosts || {}).sort()
}

function resolveHostProfile(hostProfiles, hostName) {
  const normalizedHost = String(hostName || '').trim()
  if (!normalizedHost) {
    return null
  }

  const profile = hostProfiles?.hosts?.[normalizedHost]
  if (!profile) {
    const supportedHosts = availableHosts(hostProfiles)
    throw new Error(
      `Unknown host "${normalizedHost}". Supported hosts: ${supportedHosts.join(', ') || '(none)'}`,
    )
  }

  return {
    name: normalizedHost,
    ...profile,
  }
}

function firstEnvValue(names, env = process.env) {
  for (const name of names || []) {
    const value = String(env?.[name] || '').trim()
    if (value) {
      return value
    }
  }
  return ''
}

function expandHomePath(targetPath) {
  const rawValue = String(targetPath || '').trim()
  if (!rawValue) {
    return ''
  }
  if (rawValue === '~') {
    return os.homedir()
  }
  if (rawValue.startsWith('~/')) {
    return path.join(os.homedir(), rawValue.slice(2))
  }
  return rawValue
}

function deriveTargetRootFromProfile(hostProfile, env = process.env) {
  if (!hostProfile) {
    throw new Error('Host profile is required to derive target root')
  }
  if (hostProfile.requiresExplicitTarget) {
    throw new Error(`Host "${hostProfile.name}" requires --target <skills-dir>`)
  }

  const skillsHomeOverride = firstEnvValue(hostProfile.skillsHomeEnv, env)
  if (skillsHomeOverride) {
    return path.resolve(skillsHomeOverride)
  }

  const homeRoot = firstEnvValue(hostProfile.homeEnv, env) || expandHomePath(hostProfile.defaultHome)
  if (!homeRoot) {
    throw new Error(`Host "${hostProfile.name}" has no resolvable home directory`)
  }

  if (!hostProfile.skillsDirName) {
    return path.resolve(homeRoot)
  }

  return path.resolve(homeRoot, hostProfile.skillsDirName)
}

function resolveTargetDescriptor(options, hostProfiles) {
  const {
    host = '',
    target = '',
    purpose = 'install',
    env = process.env,
  } = options || {}

  const explicitTarget = String(target || '').trim()
  const normalizedHost = String(host || '').trim()

  if (explicitTarget) {
    if (normalizedHost) {
      resolveHostProfile(hostProfiles, normalizedHost)
    }
    return {
      host: normalizedHost,
      targetRoot: path.resolve(explicitTarget),
      resolution: 'explicit-target',
    }
  }

  if (!normalizedHost) {
    if (purpose === 'verify') {
      return {
        host: '',
        targetRoot: '',
        resolution: 'source-only',
      }
    }

    if (purpose === 'release') {
      return {
        host: '',
        targetRoot: '',
        resolution: 'temporary-target',
      }
    }

    const supportedHosts = availableHosts(hostProfiles)
    throw new Error(
      `Missing install destination. Provide --target <skills-dir> or --host <${supportedHosts.join('|')}>.`,
    )
  }

  const hostProfile = resolveHostProfile(hostProfiles, normalizedHost)
  return {
    host: normalizedHost,
    targetRoot: deriveTargetRootFromProfile(hostProfile, env),
    resolution: 'host-profile',
  }
}

export {
  availableHosts,
  deriveTargetRootFromProfile,
  resolveHostProfile,
  resolveTargetDescriptor,
}
