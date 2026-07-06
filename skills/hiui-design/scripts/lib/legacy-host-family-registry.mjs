import fs from 'node:fs'
import path from 'node:path'

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function readTextIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

function pathExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

function listSourceFiles(targetRoot, { maxFiles = 2500 } = {}) {
  const roots = ['src', 'build']
  const files = []
  const ignoredDirs = new Set(['node_modules', '.git', '.local-context', 'dist', 'build/static', 'coverage'])
  const allowedExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.scss', '.css'])

  function walk(relativeDir) {
    if (files.length >= maxFiles) return
    if (ignoredDirs.has(relativeDir)) return
    const absoluteDir = path.join(targetRoot, relativeDir)
    let entries = []
    try {
      entries = fs.readdirSync(absoluteDir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (files.length >= maxFiles) return
      const relativePath = path.join(relativeDir, entry.name)
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) walk(relativePath)
        continue
      }
      if (entry.isFile() && allowedExtensions.has(path.extname(entry.name))) files.push(relativePath)
    }
  }

  for (const root of roots) walk(root)
  return files
}

function dependenciesFromPackage(pkg) {
  return {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
    ...(pkg?.peerDependencies || {}),
  }
}

function parseMajor(versionSpec) {
  const match = String(versionSpec || '').match(/(?:^|[^0-9])([0-9]+)(?:\.|$)/)
  return match ? Number(match[1]) : null
}

function normalizeModeId(mode) {
  if (mode === 'host-compatible') return 'legacy-host-compatible'
  return String(mode || '')
}

function readProjectMode(targetRoot, modeOverride = '') {
  const normalizedOverride = normalizeModeId(modeOverride)
  if (normalizedOverride && normalizedOverride !== 'auto') return normalizedOverride

  const modePath = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json')
  const mode = readJsonIfExists(modePath)
  return normalizeModeId(mode?.mode || mode?.id || mode?.recommendedMode || '')
}

function readLegacyBoundaryFact(targetRoot) {
  return readJsonIfExists(path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'legacy-host-boundary.json')) || {}
}

function boundaryStatus(boundary, key) {
  return String(boundary?.[key]?.status || boundary?.[`${key}Status`] || '')
}

function hasPassedBoundary(boundary, key) {
  return boundaryStatus(boundary, key) === 'passed'
}

function detectModuleFederationRemote(targetRoot) {
  const configCandidates = [
    'build/webpack.base.conf.js',
    'build/webpack.base.config.js',
    'webpack.config.js',
    'webpack.base.conf.js',
  ]
  const matchedConfigs = []

  for (const relativePath of configCandidates) {
    const absolutePath = path.join(targetRoot, relativePath)
    const raw = readTextIfExists(absolutePath)
    if (!raw) continue
    if (/ModuleFederationPlugin/.test(raw) && /exposes\s*:/.test(raw)) {
      matchedConfigs.push(relativePath)
    }
  }

  return {
    status: matchedConfigs.length > 0 ? 'present' : 'missing',
    configFiles: matchedConfigs,
  }
}

function inferCleanContentMountFromProjectStructure(targetRoot) {
  const businessRoots = ['src/views', 'src/pages', 'src/routes'].filter((relativePath) =>
    pathExists(path.join(targetRoot, relativePath))
  )
  const moduleFederation = detectModuleFederationRemote(targetRoot)
  const hasLocalAppEntrypoint = ['src/index.ts', 'src/index.tsx', 'src/index.js', 'src/index.jsx'].some((relativePath) =>
    pathExists(path.join(targetRoot, relativePath))
  )

  const matchedEvidence = []
  if (businessRoots.length > 0) matchedEvidence.push('business-page-root')
  if (moduleFederation.status === 'present') matchedEvidence.push('module-federation-remote-exposes')
  if (hasLocalAppEntrypoint) matchedEvidence.push('local-remote-entrypoint')

  if (businessRoots.length > 0 && moduleFederation.status === 'present') {
    return {
      status: 'passed',
      source: 'project-structure-auto-detection',
      confidence: hasLocalAppEntrypoint ? 'high' : 'medium',
      reason: 'Project structure exposes business views as a Module Federation remote, so the host is expected to provide only the route/content mount while the remote page owns its internal page regions.',
      observedHostOwns: [
        'global-navigation',
        'sidebar-navigation',
        'business-route-entry',
        'stable-content-mount',
      ],
      observedPageOwns: [
        'page-header',
        'white-body',
        'query-filter',
        'table-or-form-or-detail-body',
        'pagination-or-footer',
        'page-main-scroll',
      ],
      evidence: {
        businessRoots,
        moduleFederationConfigFiles: moduleFederation.configFiles,
        localEntrypoint: hasLocalAppEntrypoint,
        matchedEvidence,
      },
    }
  }

  return {
    status: 'missing',
    source: 'project-structure-auto-detection',
    confidence: 'low',
    reason: 'Project structure did not prove an independent business content mount automatically.',
    evidence: {
      businessRoots,
      moduleFederationConfigFiles: moduleFederation.configFiles,
      localEntrypoint: hasLocalAppEntrypoint,
      matchedEvidence,
    },
  }
}

function readFirstMatchingFile(targetRoot, files, patterns, preferredFiles = []) {
  const preferred = preferredFiles.filter((relativePath) => files.includes(relativePath) || pathExists(path.join(targetRoot, relativePath)))
  for (const relativePath of preferred) {
    const raw = readTextIfExists(path.join(targetRoot, relativePath))
    if (!raw) continue
    if (patterns.some((pattern) => pattern.test(raw))) return { relativePath, raw }
  }

  for (const relativePath of files) {
    if (preferred.includes(relativePath)) continue
    const raw = readTextIfExists(path.join(targetRoot, relativePath))
    if (!raw) continue
    if (patterns.some((pattern) => pattern.test(raw))) return { relativePath, raw }
  }
  return null
}

function makeCapabilityEvidence({ id, status, source = '', reason = '' }) {
  return { id, status, source, reason }
}

function inferRuntimeBridgeFromProjectStructure(targetRoot, family) {
  const files = listSourceFiles(targetRoot)
  const dependencies = dependenciesFromPackage(readJsonIfExists(path.join(targetRoot, 'package.json')) || {})
  const requiredCapabilities = Array.isArray(family?.runtimeBridge?.requiredCapabilities)
    ? family.runtimeBridge.requiredCapabilities
    : ['request', 'auth', 'permission', 'user', 'route-navigation', 'theme']
  const capabilityEvidence = []

  const requestFile = readFirstMatchingFile(targetRoot, files, [
    /axios\.(create|get|post|put|delete|request)\s*\(/,
    /export\s+const\s+(get|post|request|putFile|postFile)\b/,
    /fetch\s*\(/,
  ], ['src/utils/network.ts', 'src/utils/network.js', 'src/utils/axios-instances.js', 'src/network/index.ts', 'src/network/index.js'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'request',
      status: requestFile ? 'passed' : 'missing',
      source: requestFile?.relativePath || '',
      reason: requestFile ? 'request client or request helpers found' : 'no request client or request helper found',
    })
  )

  const responseFile = readFirstMatchingFile(targetRoot, files, [
    /res\.data\.(code|data|message)/,
    /response\.(data|status)/,
    /AxiosResponse/,
  ], ['src/utils/network.ts', 'src/utils/network.js', 'src/utils/axios-instances.js', 'src/network/index.ts', 'src/network/index.js'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'response',
      status: responseFile ? 'passed' : 'missing',
      source: responseFile?.relativePath || '',
      reason: responseFile ? 'response parser or response schema handling found' : 'no response parser found',
    })
  )

  const messageFile = readFirstMatchingFile(targetRoot, files, [
    /message\.open\s*\(/,
    /Notification\.open\s*\(/,
    /Modal\.confirm\s*\(/,
  ], ['src/utils/message.ts', 'src/utils/message.js', 'src/utils/network.ts', 'src/utils/network.js'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'message',
      status: messageFile ? 'passed' : 'missing',
      source: messageFile?.relativePath || '',
      reason: messageFile ? 'HiUI message/notification/modal feedback bridge found' : 'no user feedback bridge found',
    })
  )

  const dictionaryFile = readFirstMatchingFile(targetRoot, files, [
    /TRANSLATION_MESSAGES/,
    /SUPPORTED_LOCALES/,
    /useTranslation\s*\(/,
    /dictionary|dict|locale|i18n/i,
  ], ['src/translation/index.ts', 'src/translation/index.js', 'src/i18n/index.ts', 'src/i18n/index.js', 'src/locales/index.ts'])
  const hasTranslationDir = ['src/translation', 'src/i18n', 'src/locales'].some((relativePath) =>
    pathExists(path.join(targetRoot, relativePath))
  )
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'dictionary',
      status: dictionaryFile ? 'passed' : hasTranslationDir ? 'partial' : 'missing',
      source: dictionaryFile?.relativePath || (hasTranslationDir ? 'src/translation|src/i18n|src/locales' : ''),
      reason: dictionaryFile
        ? 'dictionary/i18n source found'
        : hasTranslationDir
          ? 'translation directory exists, but no concrete dictionary bridge or locale catalog source was proven'
          : 'no dictionary or i18n source found',
    })
  )

  const permissionFile = readFirstMatchingFile(targetRoot, files, [
    /hasPermission\s*\(/,
    /hasAuth\s*\(/,
    /permissions?\s*[:=]/,
    /resourceTag/,
  ], ['src/utils/tools.ts', 'src/utils/tools.js', 'src/utils/permission.ts', 'src/utils/auth.ts'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'permission',
      status: permissionFile ? 'passed' : 'missing',
      source: permissionFile?.relativePath || '',
      reason: permissionFile ? 'permission helper or permission usage found' : 'no permission bridge found',
    })
  )

  const userFile = readFirstMatchingFile(targetRoot, files, [
    /globalUserInfo/,
    /userInfo/,
    /user(Name|Id)\b/,
    /miliao/,
  ], ['src/utils/user.ts', 'src/utils/auth.ts', 'src/utils/tools.ts'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'user',
      status: userFile ? 'passed' : 'missing',
      source: userFile?.relativePath || '',
      reason: userFile ? 'user info source or usage found' : 'no user info bridge found',
    })
  )

  const authFile = readFirstMatchingFile(targetRoot, files, [
    /401/,
    /login\s*timeout|登录超时/i,
    /auth|token|session/i,
  ], ['src/utils/network.ts', 'src/utils/network.js', 'src/utils/axios-instances.js', 'src/utils/auth.ts'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'auth',
      status: authFile ? 'passed' : 'missing',
      source: authFile?.relativePath || '',
      reason: authFile ? 'auth/session handling signal found' : 'no auth/session bridge found',
    })
  )

  const routeFile = readFirstMatchingFile(targetRoot, files, [
    /window\.history\.(back|pushState|replaceState)/,
    /history\.(push|replace|back)/,
    /navigate\s*\(/,
    /router\.(push|replace)/,
    /location\.(href|hash|assign)/,
  ], ['src/routes/index.ts', 'src/router/index.ts', 'src/utils/router.ts', 'src/utils/history.ts'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'route-navigation',
      status: routeFile ? 'passed' : 'missing',
      source: routeFile?.relativePath || '',
      reason: routeFile ? 'route/navigation signal found' : 'no route navigation bridge found',
    })
  )

  const themeFile = readFirstMatchingFile(targetRoot, files, [
    /ConfigProvider/,
    /theme\s*[:=]/,
    /--hiui|--hi-/,
    /global\.scss|tailwind\.config/,
  ], ['src/styles/global.scss', 'src/styles/global.css', 'src/index.tsx', 'src/index.ts', 'tailwind.config.js'])
  const hasHiuiRuntime = Boolean(dependencies.hiui5 || dependencies['@hi-ui/hiui'])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'theme',
      status: themeFile || hasHiuiRuntime ? 'passed' : 'missing',
      source: hasHiuiRuntime ? 'package.json' : themeFile?.relativePath || '',
      reason: themeFile || hasHiuiRuntime ? 'theme or HiUI runtime signal found' : 'no theme bridge found',
    })
  )

  const portalFile = readFirstMatchingFile(targetRoot, files, [
    /getPopupContainer/,
    /portalRoot|portal-root|modalRoot|modal-root/,
    /createPortal\s*\(/,
    /ConfigProvider[\s\S]{0,160}(container|getContainer|getPopupContainer)/,
  ], ['src/index.tsx', 'src/index.ts', 'src/utils/portal.ts', 'src/utils/portal-root.ts'])
  const modalUsageFile = readFirstMatchingFile(targetRoot, files, [/\b(Modal|Drawer|Popover|Tooltip|Select)\b/])
  capabilityEvidence.push(
    makeCapabilityEvidence({
      id: 'portal-root',
      status: 'passed',
      source: portalFile?.relativePath || modalUsageFile?.relativePath || '',
      reason: portalFile
        ? 'explicit portal container/root signal found'
        : modalUsageFile
          ? 'floating components are used; default portal container is acceptable unless the host declares clipping risks or custom popup containers'
          : 'no explicit portal root signal found; treat floating-layer mounting as a default runtime capability unless host boundary facts declare custom container or clipping risks',
    })
  )

  const requiredEvidence = capabilityEvidence.filter((item) => requiredCapabilities.includes(item.id))
  const passedCapabilities = capabilityEvidence.filter((item) => item.status === 'passed').map((item) => item.id)
  const partialCapabilities = capabilityEvidence.filter((item) => item.status === 'partial').map((item) => item.id)
  const missingCapabilities = requiredEvidence
    .filter((item) => item.status !== 'passed')
    .map((item) => item.id)
  const status = missingCapabilities.length === 0
    ? 'passed'
    : passedCapabilities.length > 0 || partialCapabilities.length > 0
      ? 'partial'
      : 'missing'

  return {
    status,
    source: 'project-structure-auto-detection',
    confidence: status === 'passed' ? 'medium' : status === 'partial' ? 'medium' : 'low',
    reason: status === 'passed'
      ? 'Project structure exposes all required runtime bridge capabilities.'
      : status === 'partial'
        ? 'Project structure exposes some runtime bridge capabilities, but required capabilities are still missing or only partially proven.'
        : 'Project structure did not prove runtime bridge capabilities automatically.',
    requiredCapabilities,
    passedCapabilities,
    partialCapabilities,
    missingCapabilities,
    capabilityEvidence,
  }
}

function pushEvidence(condition, list, value) {
  if (condition) list.push(value)
}

export function loadLegacyHostFamilyRegistry({ skillRoot }) {
  const registryPath = path.join(skillRoot, 'rules', 'legacy-host-family-registry.json')
  const registry = readJsonIfExists(registryPath) || {}
  const families = Array.isArray(registry.families) ? registry.families : []
  const byHostFamilyId = new Map()

  for (const family of families) {
    if (family?.hostFamilyId) byHostFamilyId.set(family.hostFamilyId, family)
  }

  return {
    schemaVersion: registry.schemaVersion || 'legacy-host-family-registry.v1',
    families,
    byHostFamilyId,
  }
}

export function detectLegacyHostFamily({ targetRoot, skillRoot, modeOverride = '' }) {
  const registry = loadLegacyHostFamilyRegistry({ skillRoot })
  const mode = readProjectMode(targetRoot, modeOverride)
  const pkg = readJsonIfExists(path.join(targetRoot, 'package.json')) || {}
  const dependencies = dependenciesFromPackage(pkg)
  const boundary = readLegacyBoundaryFact(targetRoot)
  const inferredCleanContentMount = hasPassedBoundary(boundary, 'cleanContentMount')
    ? null
    : inferCleanContentMountFromProjectStructure(targetRoot)
  const reactMajor = parseMajor(dependencies.react)
  const reactDomMajor = parseMajor(dependencies['react-dom'])
  const ahooksMajor = parseMajor(dependencies.ahooks)
  const hasLegacyReact = (reactMajor !== null && reactMajor < 18) || (reactDomMajor !== null && reactDomMajor < 18)
  const hasLegacyAhooks = ahooksMajor !== null && ahooksMajor < 3
  const hasHiui5Alias = Boolean(dependencies.hiui5 || String(dependencies['@hi-ui/hiui'] || '').includes('5.'))
  const hasModuleFederation = Boolean(boundary.moduleFederation?.status === 'present' || boundary.moduleFederationStatus === 'present')

  if (mode !== 'legacy-host-compatible') {
    return {
      schemaVersion: 'legacy-host-family-detection.v1',
      status: 'not_applicable',
      mode: mode || 'unknown',
      hostFamilyId: '',
      familyStatus: '',
      confidence: 'none',
      adapterPackId: '',
      adapterIds: [],
      supportedPageComponents: [],
      matchedEvidence: [],
      missingFacts: [],
      blockingReasons: [],
      source: '.local-context/hiui-design/outputs/project-mode.json',
    }
  }

  let bestResult = null
  for (const family of registry.families) {
    const matchedEvidence = []
    const missingFacts = []
    const inferredRuntimeBridge = hasPassedBoundary(boundary, 'runtimeBridge')
      ? null
      : inferRuntimeBridgeFromProjectStructure(targetRoot, family)

    pushEvidence(true, matchedEvidence, 'project-mode:legacy-host-compatible')
    if (hasPassedBoundary(boundary, 'cleanContentMount')) {
      matchedEvidence.push('clean-content-mount')
    } else if (inferredCleanContentMount.status === 'passed') {
      matchedEvidence.push('clean-content-mount')
      matchedEvidence.push('clean-content-mount:project-structure')
    } else {
      missingFacts.push('clean-content-mount')
    }

    if (hasPassedBoundary(boundary, 'runtimeBridge')) {
      matchedEvidence.push('runtime-bridge')
    } else if (inferredRuntimeBridge.status === 'passed') {
      matchedEvidence.push('runtime-bridge')
      matchedEvidence.push('runtime-bridge:project-structure')
    } else if (inferredRuntimeBridge.status === 'partial') {
      matchedEvidence.push('runtime-bridge:project-structure-partial')
      missingFacts.push('runtime-bridge')
    } else {
      missingFacts.push('runtime-bridge')
    }

    pushEvidence(hasLegacyReact, matchedEvidence, 'react-legacy-runtime')
    pushEvidence(hasLegacyAhooks, matchedEvidence, 'ahooks-legacy-runtime')
    pushEvidence(hasHiui5Alias, matchedEvidence, 'hiui5-alias')
    pushEvidence(hasModuleFederation, matchedEvidence, 'module-federation-host')
    pushEvidence(hasPassedBoundary(boundary, 'styleBoundary'), matchedEvidence, 'style-boundary')
    pushEvidence(hasPassedBoundary(boundary, 'portalBoundary'), matchedEvidence, 'portal-boundary')
    pushEvidence(hasPassedBoundary(boundary, 'routeOwner'), matchedEvidence, 'host-route-owner')

    const status = missingFacts.length === 0 ? 'matched' : 'unmatched'
    const confidence = status === 'matched'
      ? matchedEvidence.length >= 5
        ? 'high'
        : 'medium'
      : 'low'
    const result = {
      schemaVersion: 'legacy-host-family-detection.v1',
      status,
      mode,
      hostFamilyId: status === 'matched' ? family.hostFamilyId : '',
      familyStatus: status === 'matched' ? family.status : '',
      confidence,
      adapterPackId: status === 'matched' ? family.adapterPack?.adapterPackId || '' : '',
      adapterIds: status === 'matched' && Array.isArray(family.adapterPack?.adapterIds)
        ? family.adapterPack.adapterIds
        : [],
      supportedPageComponents: status === 'matched' && Array.isArray(family.componentMatrix)
        ? family.componentMatrix
        : [],
      contracts: status === 'matched'
        ? {
            mountContract: family.mountContract?.contractId || '',
            runtimeBridge: family.runtimeBridge?.contractId || '',
            styleBoundary: family.styleBoundary?.contractId || '',
            portalBoundary: family.portalBoundary?.contractId || '',
          }
        : {},
      matchedEvidence,
      inferredFacts: {
        cleanContentMount: inferredCleanContentMount?.status === 'passed'
          ? inferredCleanContentMount
          : null,
        runtimeBridge: inferredRuntimeBridge || null,
      },
      missingFacts,
      blockingReasons: status === 'matched'
        ? []
        : missingFacts.map((fact) => {
            if (fact === 'runtime-bridge' && inferredRuntimeBridge?.status === 'partial') {
              return `runtime bridge auto-scan is partial; missing capabilities: ${inferredRuntimeBridge.missingCapabilities.join(', ')}`
            }
            return `missing ${fact} evidence for legacy host family match`
          }),
      source: 'rules/legacy-host-family-registry.json',
    }

    if (result.status === 'matched') return result
    if (!bestResult || result.matchedEvidence.length > bestResult.matchedEvidence.length) bestResult = result
  }

  return bestResult || {
    schemaVersion: 'legacy-host-family-detection.v1',
    status: 'unmatched',
    mode,
    hostFamilyId: '',
    familyStatus: '',
    confidence: 'low',
    adapterPackId: '',
    adapterIds: [],
    supportedPageComponents: [],
    matchedEvidence: ['project-mode:legacy-host-compatible'],
    missingFacts: ['legacy-host-family-registry'],
    blockingReasons: ['missing legacy host family registry'],
    source: 'rules/legacy-host-family-registry.json',
  }
}
