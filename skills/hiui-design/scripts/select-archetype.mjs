#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import { buildDefaultManagedPageI18nBaseline } from './lib/rules-only-page-contracts.mjs'

function parseMajorVersion(spec) {
  const match = String(spec || '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

async function readTargetPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  try {
    const raw = await fs.readFile(packageJsonPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function inferMode(pkg, hostProfile, requestedMode) {
  if (requestedMode && requestedMode !== 'auto') {
    return requestedMode
  }

  const dependencies = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
    ...(pkg?.peerDependencies ?? {}),
  }

  const reactMajor = parseMajorVersion(dependencies.react)
  const reactDomMajor = parseMajorVersion(dependencies['react-dom'])
  const hiuiMajor = parseMajorVersion(dependencies['@hi-ui/hiui'])
  const hasHiui5Alias = Boolean(dependencies.hiui5)

  if (
    (reactMajor > 0 && reactMajor < 18) ||
    (reactDomMajor > 0 && reactDomMajor < 18) ||
    (hasHiui5Alias && hiuiMajor > 0 && hiuiMajor < 5)
  ) {
    return 'legacy-host-compatible'
  }

  return hostProfile?.recommendedMode || 'rules-only'
}

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/select-archetype.mjs" --page-type <page-type-id> [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--target <project-root>] [--line <line-id>] [--json]
`)
}

function parseArgs(argv) {
  const options = {
    pageTypeId: '',
    target: process.cwd(),
    mode: 'auto',
    line: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--page-type' || arg === '--target' || arg === '--mode' || arg === '--line') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--mode') options.mode = value
      if (arg === '--line') options.line = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageTypeId) {
    throw new Error('Missing --page-type')
  }

  return options
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
    const pageType = manifest.pageTypes.find((item) => item.id === options.pageTypeId)

    if (!pageType) {
      throw new Error(`Unknown page type: ${options.pageTypeId}`)
    }

    const hostProfile = await detectHostProfile(options.target)
    const pkg = (await readTargetPackageJson(options.target)) || hostProfile.pkg
    const mode = inferMode(pkg, hostProfile, options.mode)
    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: pageType.id,
    })

    const payload = {
      pageTypeId: pageType.id,
      pageTypeLabel: pageType.label,
      mode,
      examplePath: archetypeDefinition?.archetype?.examplePath || pageType.assetExamplePath || '',
      archetypeId: archetypeDefinition?.archetype?.id || '',
      archetypeLabel: archetypeDefinition?.archetype?.label || '',
      shell: archetypeDefinition?.archetype?.shell || pageType.shell || '',
      requiredRegions: archetypeDefinition?.archetype?.requiredRegions || [],
      requiredOwnershipRoles: archetypeDefinition?.archetype?.requiredOwnershipRoles || [],
      requiredCapabilities: archetypeDefinition?.archetype?.requiredCapabilities || [],
      allowedOverrides: archetypeDefinition?.allowedOverrides || [],
      forbiddenEscapes: archetypeDefinition?.forbiddenEscapes || [],
      templateDir: archetypeDefinition?.archetype?.modeAdapters?.[mode]?.templateDir || '',
      i18nBaseline: buildDefaultManagedPageI18nBaseline(),
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      return
    }

    console.log('Selected archetype:')
    console.log(`- page type: ${payload.pageTypeLabel} (${payload.pageTypeId})`)
    console.log(`- mode: ${payload.mode}`)
    console.log(`- example path: ${payload.examplePath}`)
    console.log(`- archetype id: ${payload.archetypeId}`)
    console.log(`- shell: ${payload.shell}`)
    console.log(`- template dir: ${payload.templateDir || '(none)'}`)
    console.log(`- required regions: ${payload.requiredRegions.join(', ') || '(none)'}`)
    console.log(
      `- required ownership roles: ${payload.requiredOwnershipRoles.join(', ') || '(none)'}`
    )
    console.log(`- i18n reference doc: ${payload.i18nBaseline.referenceDoc}`)
    console.log(`- i18n baseline provisioning: ${payload.i18nBaseline.bootstrapCommands.join(' | ')}`)
    console.log(`- supported locales: ${payload.i18nBaseline.supportedLocales.join(', ')}`)
    console.log(`- formatter policy: ${payload.i18nBaseline.formatterPolicy.join(', ')}`)
    console.log(`- direction strategy: ${payload.i18nBaseline.directionStrategy}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`select-archetype failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
