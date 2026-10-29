#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  loadHostImportPolicy,
  validateOutputTargetDecision,
} from './lib/generation-decision-contract.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { collectPageSourceSanityViolations } from './lib/page-template-sanity.mjs'
import { getContextScriptPath } from './lib/skill-identity.mjs'

function readRequiredArg(argv, index, name) {
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`Missing value for ${name}`)
  return value
}

function parseArgs(argv) {
  const options = {
    pageType: '',
    page: '',
    style: '',
    copyMode: '',
    defaultBusinessPageDir: '',
    line: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--page-type') {
      options.pageType = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--page') {
      options.page = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--style') {
      options.style = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--copy-mode') {
      options.copyMode = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--default-business-page-dir') {
      options.defaultBusinessPageDir = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--line') {
      options.line = readRequiredArg(argv, index, arg)
      index += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node ${getContextScriptPath('typical-page-slot-gate.mjs')} --page-type <id> --page <index.tsx> [--style <index.module.scss>] [--copy-mode direct-copy|host-shell-fix-required] [--default-business-page-dir <dir>] [--line <line-id>] [--json]`)
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageType) throw new Error('Missing --page-type <id>')
  if (!options.page) throw new Error('Missing --page <file>')

  return options
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function resolveFromCwd(inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(process.cwd(), inputPath)
}

function toProjectRelativePath(projectRoot, targetPath) {
  return path.relative(projectRoot, targetPath).split(path.sep).join('/')
}

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeBusinessOutputTargetPath(value) {
  const normalized = normalizeRelativePath(value)
  if (!normalized) return ''

  const normalizedDir = /\.[a-z0-9]+$/i.test(path.posix.basename(normalized))
    ? path.posix.dirname(normalized)
    : normalized

  return normalizedDir === '.' ? '' : normalizeRelativePath(normalizedDir)
}

async function readJsonIfExists(targetPath) {
  try {
    return JSON.parse(await fs.readFile(targetPath, 'utf8'))
  } catch {
    return null
  }
}

async function resolvePageLevelOutputTargetContext({
  pagePath,
  targetRoot,
  explicitDefaultBusinessPageDir = '',
}) {
  const metaPath = path.join(path.dirname(pagePath), 'hiui-pagegen.meta.json')
  const metadata = await readJsonIfExists(metaPath)
  const metadataDefaultBusinessPageDir = normalizeRelativePath(
    metadata?.requestedBusiness?.defaultBusinessPageDir || ''
  )
  const metadataOutputTargetEvidence =
    metadata?.outputTargetEvidence && typeof metadata.outputTargetEvidence === 'object'
      ? metadata.outputTargetEvidence
      : null
  const normalizedExplicitDefaultBusinessPageDir = normalizeRelativePath(explicitDefaultBusinessPageDir)
  const metadataTargetBusinessPath = normalizeBusinessOutputTargetPath(
    metadata?.requestedBusiness?.targetBusinessPath ||
      metadata?.requestedBusiness?.dest ||
      metadataOutputTargetEvidence?.rawDest ||
      ''
  )
  const inferredPageDirTargetBusinessPath = normalizeBusinessOutputTargetPath(
    toProjectRelativePath(targetRoot, path.dirname(pagePath))
  )

  const defaultBusinessPageDir =
    normalizedExplicitDefaultBusinessPageDir ||
    metadataDefaultBusinessPageDir

  let source = 'generation-target-policy'
  if (normalizedExplicitDefaultBusinessPageDir) {
    source = 'cli-arg'
  } else if (metadataDefaultBusinessPageDir) {
    source = 'pagegen-meta'
  }

  return {
    metaPath: metadata ? metaPath : '',
    metadata,
    defaultBusinessPageDir,
    outputTargetEvidence: metadataOutputTargetEvidence,
    resolvedHostGenerationContract:
      metadata?.resolvedHostGenerationContract &&
      typeof metadata.resolvedHostGenerationContract === 'object' &&
      !Array.isArray(metadata.resolvedHostGenerationContract)
        ? metadata.resolvedHostGenerationContract
        : {},
    source,
    targetBusinessPath: metadataTargetBusinessPath || inferredPageDirTargetBusinessPath,
  }
}

function inferImportedStylePath(pagePath, source) {
  const importPattern = /import\s+\w+\s+from\s+['"](\.\.?\/[^'"]+\.module\.(?:scss|sass|css))['"]/g
  let match = importPattern.exec(source)

  while (match) {
    const candidate = path.resolve(path.dirname(pagePath), match[1])
    if (candidate.endsWith('.module.scss') || candidate.endsWith('.module.sass') || candidate.endsWith('.module.css')) {
      return candidate
    }
    match = importPattern.exec(source)
  }

  return ''
}

function hasLikelyMissingCssModuleAliasUsage(source) {
  return /(^|[^$\w'"\/])(?:styles|style|classes|classNames)\s*(?:\.|\?\.)/m.test(source)
}

function buildCheckedContracts(contract) {
  const layoutContract = contract.layoutContract || {}
  const slotBoundaryContract = contract.slotBoundaryContract || {}
  return {
    slotBoundaryContract: Boolean(contract.slotBoundaryContract),
    regionOwnershipContract: Boolean(contract.regionOwnershipContract),
    requiresFlexMinHeightChain: Boolean(layoutContract.requiresFlexMinHeightChain),
    rootMustAvoidViewportHeightHack: Boolean(layoutContract.rootMustAvoidViewportHeightHack),
    whiteBodyMustFillRemainingHeight: Boolean(layoutContract.whiteBodyMustFillRemainingHeight),
    dangerousProps: slotBoundaryContract.dangerousProps ?? [],
    forbiddenSlots: slotBoundaryContract.forbiddenSlots ?? [],
    visualTokenSource: Boolean(contract.defaultTokenDecisions || contract.localStyleAllowlist),
    semanticComponentSource: Boolean(contract.defaultComponentDecisions),
    importSourcePolicy: Boolean(contract.importPolicyRef),
    lightSanityChecks: contract.lightSanityChecks ?? [],
  }
}

function collectPagegenMetadataViolations({ pageTypeId, contract, metadata }) {
  if (!metadata || typeof metadata !== 'object') {
    return [`${pageTypeId}: generated output missing hiui-pagegen.meta.json`]
  }

  const violations = []
  const metadataPageType = normalizeString(metadata.pageType)
  const metadataBaseTemplatePath = normalizeRelativePath(metadata.baseTemplatePath)
  const expectedBaseTemplatePath = normalizeRelativePath(contract.baseTemplatePath)

  if (!metadataPageType) {
    violations.push(`${pageTypeId}: hiui-pagegen.meta.json missing pageType`)
  } else if (metadataPageType !== pageTypeId) {
    violations.push(
      `${pageTypeId}: hiui-pagegen.meta.json pageType must equal ${pageTypeId}, received ${metadataPageType}`
    )
  }

  if (!metadataBaseTemplatePath) {
    violations.push(`${pageTypeId}: hiui-pagegen.meta.json missing baseTemplatePath`)
  } else if (expectedBaseTemplatePath && metadataBaseTemplatePath !== expectedBaseTemplatePath) {
    violations.push(
      `${pageTypeId}: hiui-pagegen.meta.json baseTemplatePath must equal ${expectedBaseTemplatePath}, received ${metadataBaseTemplatePath}`
    )
  }

  const metadataResolvedHostGenerationContract =
    metadata?.resolvedHostGenerationContract &&
    typeof metadata.resolvedHostGenerationContract === 'object' &&
    !Array.isArray(metadata.resolvedHostGenerationContract)
      ? metadata.resolvedHostGenerationContract
      : {}
  if (Object.keys(metadataResolvedHostGenerationContract).length === 0) {
    violations.push(`${pageTypeId}: hiui-pagegen.meta.json missing resolvedHostGenerationContract`)
  }

  if (!normalizeString(metadata.visualImportModeApplied)) {
    violations.push(`${pageTypeId}: hiui-pagegen.meta.json missing visualImportModeApplied`)
  }

  if (!normalizeString(metadata.hookImportModeApplied)) {
    violations.push(`${pageTypeId}: hiui-pagegen.meta.json missing hookImportModeApplied`)
  }

  const metadataHostExecutionAdapter =
    metadata?.hostExecutionAdapter &&
    typeof metadata.hostExecutionAdapter === 'object' &&
    !Array.isArray(metadata.hostExecutionAdapter)
      ? metadata.hostExecutionAdapter
      : null
  const expectedHostExecutionAdapterKind = normalizeString(metadataHostExecutionAdapter?.kind)
  const publishDeliveryHostExecutionAdapterKind = normalizeString(
    metadata?.publishDeliveryDecision?.hostExecutionAdapterKind
  )
  const styleDeliveryHostExecutionAdapterKind = normalizeString(
    metadata?.styleDeliveryDecision?.hostExecutionAdapterKind
  )
  const requiresHostExecutionAdapterKind =
    Boolean(metadataHostExecutionAdapter) ||
    Boolean(publishDeliveryHostExecutionAdapterKind) ||
    Boolean(styleDeliveryHostExecutionAdapterKind)

  if (requiresHostExecutionAdapterKind && !expectedHostExecutionAdapterKind) {
    violations.push(
      `${pageTypeId}: hiui-pagegen.meta.json missing hostExecutionAdapter.kind`
    )
  }

  return violations
}

async function readOptionalStyle({ pagePath, source, explicitStylePath, violations, pageTypeId, contract }) {
  const stylePath = explicitStylePath ? resolveFromCwd(explicitStylePath) : inferImportedStylePath(pagePath, source)
  if (!stylePath) {
    if (hasLikelyMissingCssModuleAliasUsage(source) && contract.layoutContract?.requiresFlexMinHeightChain) {
      violations.push(`${pageTypeId}: page uses CSS module styles but no style file was provided or inferred`)
    }
    return { stylePath: '', styleSource: '' }
  }

  if (!(await pathExists(stylePath))) {
    violations.push(`${pageTypeId}: style file not found ${stylePath}`)
    return { stylePath, styleSource: '' }
  }

  return {
    stylePath,
    styleSource: await fs.readFile(stylePath, 'utf8'),
  }
}

async function run() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = process.cwd()
  const pagePath = resolveFromCwd(options.page)
  const earlyViolations = []
  const { generationTargetPolicy } = await loadHostImportPolicy({ skillRoot })

  const { manifest, manifestPath } = await loadPageTypeManifest({ skillRoot, line: options.line })
  const pageType = manifest.pageTypes.find((item) => item.id === options.pageType)
  if (!pageType) {
    const knownIds = manifest.pageTypes.map((item) => item.id).join(', ')
    throw new Error(`Unknown page type "${options.pageType}". Known page types: ${knownIds}`)
  }

  const contract = pageType.generationContract
  if (!contract) throw new Error(`Page type "${options.pageType}" is missing generationContract in ${manifestPath}`)

  const outputTargetContext = await resolvePageLevelOutputTargetContext({
    pagePath,
    targetRoot,
    explicitDefaultBusinessPageDir: options.defaultBusinessPageDir,
  })
  const effectiveContract = {
    ...contract,
    ...(outputTargetContext.resolvedHostGenerationContract || {}),
  }
  const outputTargetValidation = validateOutputTargetDecision({
    pageType,
    requestedBusiness: {
      targetBusinessPath: outputTargetContext.targetBusinessPath,
      defaultBusinessPageDir: outputTargetContext.defaultBusinessPageDir,
      outputTargetEvidence: outputTargetContext.outputTargetEvidence,
    },
    generationTargetPolicy,
  })
  earlyViolations.push(...outputTargetValidation.violations)

  if (!(await pathExists(pagePath))) {
    earlyViolations.push(`${options.pageType}: page file not found ${pagePath}`)
  }

  const source = earlyViolations.length === 0 ? await fs.readFile(pagePath, 'utf8') : ''
  const { stylePath, styleSource } = earlyViolations.length === 0
    ? await readOptionalStyle({
        pagePath,
        source,
        explicitStylePath: options.style,
        violations: earlyViolations,
        pageTypeId: options.pageType,
        contract: effectiveContract,
      })
    : { stylePath: options.style ? resolveFromCwd(options.style) : '', styleSource: '' }

  const violations = [
    ...earlyViolations,
    ...collectPagegenMetadataViolations({
      pageTypeId: options.pageType,
      contract: effectiveContract,
      metadata: outputTargetContext.metadata,
    }),
    ...(earlyViolations.length === 0
      ? collectPageSourceSanityViolations({
          pageType,
          contract: effectiveContract,
          source,
          styleSource,
          sourceLabel: pagePath,
          copyMode: options.copyMode,
        })
      : []),
  ]
  const result = {
    status: violations.length === 0 ? 'pass' : 'blocked',
    pageType: options.pageType,
    pagePath,
    stylePath,
    manifestPath,
    generationTargetPolicy,
    outputTargetContext: {
      defaultBusinessPageDir: outputTargetContext.defaultBusinessPageDir,
      source: outputTargetContext.source,
      metaPath: outputTargetContext.metaPath,
      outputTargetEvidence: outputTargetContext.outputTargetEvidence,
    },
    checkedContracts: buildCheckedContracts(effectiveContract),
    violations,
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else if (result.status === 'pass') {
    console.log(`pass: ${options.pageType} ${pagePath}`)
  } else {
    console.error(`blocked: ${options.pageType} ${pagePath}`)
    for (const violation of violations) console.error(`- ${violation}`)
  }

  process.exit(result.status === 'pass' ? 0 : 1)
}

try {
  await run()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
