#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SUPPORTED_LOCALES = ['zh-CN', 'zh-TW', 'en-US', 'id-ID', 'th-TH', 'de-DE', 'ar-SA']
const DEFAULT_LOCALE = 'zh-CN'
const ENGLISH_BASELINE_LOCALE = 'en-US'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/init-i18n.mjs" [--target <project-root>] [--force] [--sync-only]

Default behavior:
  - create src/translation baseline assets when missing
  - create scripts/init-i18n.mjs wrapper in the target project
  - patch package.json with i18n:sync when missing
  - sync locale files and regenerate src/translation/messages.ts
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    force: false,
    syncOnly: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--sync-only') {
      options.syncOnly = true
      continue
    }

    if (arg === '--target') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --target')
      }
      options.target = path.resolve(value)
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

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

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function sortObject(input) {
  return Object.fromEntries(Object.entries(input).sort(([left], [right]) => left.localeCompare(right)))
}

async function copyTemplateFile({ from, to, force }) {
  const existed = await pathExists(to)

  if (!force && existed) {
    return 'unchanged'
  }

  await ensureDir(path.dirname(to))
  await fs.copyFile(from, to)
  return existed ? 'overwritten' : 'written'
}

function mergeMissingKeys(base, target = {}) {
  const next = { ...target }
  let added = 0

  for (const [key, value] of Object.entries(base)) {
    if (!(key in next)) {
      next[key] = value
      added += 1
    }
  }

  return { merged: sortObject(next), added }
}

function mergeLocaleCatalog(base, target = {}, options = {}) {
  if (!options.overwriteExisting) {
    return mergeMissingKeys(base, target)
  }

  let added = 0

  for (const key of Object.keys(base)) {
    if (!(key in target)) {
      added += 1
    }
  }

  return {
    merged: sortObject({
      ...target,
      ...base,
    }),
    added,
  }
}

async function writeJson(targetPath, value) {
  await ensureDir(path.dirname(targetPath))
  await fs.writeFile(targetPath, `${JSON.stringify(sortObject(value), null, 2)}\n`, 'utf8')
}

function buildMessagesTs(localePayloadMap) {
  return `export const TRANSLATION_MESSAGES = ${JSON.stringify(localePayloadMap, null, 2)} as const\n`
}

async function readTemplateLocalePayload(templatesRoot, locale, fallbackPayload) {
  const localeTemplatePath = path.join(templatesRoot, 'src', 'translation', `${locale}.json`)
  const localeTemplate = await readJsonIfExists(localeTemplatePath)

  if (localeTemplate) {
    return localeTemplate
  }

  return fallbackPayload
}

async function patchPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return { status: 'missing', addedScripts: [], skippedScripts: [] }
  }

  const raw = await fs.readFile(packageJsonPath, 'utf8')
  const pkg = JSON.parse(raw)
  const scripts = { ...(pkg.scripts ?? {}) }
  const addedScripts = []
  const skippedScripts = []

  const expectedScripts = {
    'i18n:sync': 'node "scripts/init-i18n.mjs"',
  }

  for (const [scriptName, scriptValue] of Object.entries(expectedScripts)) {
    if (scripts[scriptName] == null) {
      scripts[scriptName] = scriptValue
      addedScripts.push(scriptName)
      continue
    }

    if (scripts[scriptName] !== scriptValue) {
      skippedScripts.push(scriptName)
    }
  }

  const nextPkg = {
    ...pkg,
    scripts: sortObject(scripts),
  }
  const nextRaw = `${JSON.stringify(nextPkg, null, 2)}\n`

  if (nextRaw === raw) {
    return { status: 'unchanged', addedScripts, skippedScripts }
  }

  await fs.writeFile(packageJsonPath, nextRaw, 'utf8')
  return { status: 'updated', addedScripts, skippedScripts }
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const templatesRoot = path.join(skillRoot, 'templates', 'i18n')
    const targetRoot = options.target
    const translationDir = path.join(targetRoot, 'src', 'translation')
    const messagesPath = path.join(translationDir, 'messages.ts')
    const indexTemplatePath = path.join(templatesRoot, 'src', 'translation', 'index.ts')
    const demoOverridesTemplatePath = path.join(
      templatesRoot,
      'src',
      'translation',
      'demo-overrides.ts'
    )
    const wrapperTemplatePath = path.join(templatesRoot, 'scripts', 'init-i18n.mjs')
    const seededFiles = []
    let packageResult = { status: 'skipped', addedScripts: [], skippedScripts: [] }

    await ensureDir(translationDir)

    if (!options.syncOnly) {
      const indexPath = path.join(translationDir, 'index.ts')
      const wrapperPath = path.join(targetRoot, 'scripts', 'init-i18n.mjs')

      if ((await copyTemplateFile({ from: indexTemplatePath, to: indexPath, force: options.force })) !== 'unchanged') {
        seededFiles.push(path.relative(targetRoot, indexPath))
      }

      const demoOverridesPath = path.join(translationDir, 'demo-overrides.ts')
      if (
        (await copyTemplateFile({
          from: demoOverridesTemplatePath,
          to: demoOverridesPath,
          force: options.force,
        })) !== 'unchanged'
      ) {
        seededFiles.push(path.relative(targetRoot, demoOverridesPath))
      }

      if ((await copyTemplateFile({ from: wrapperTemplatePath, to: wrapperPath, force: options.force })) !== 'unchanged') {
        seededFiles.push(path.relative(targetRoot, wrapperPath))
      }

      packageResult = await patchPackageJson(targetRoot)
    }

    const zhSeed = await readTemplateLocalePayload(templatesRoot, 'zh-CN', {})
    const enSeed = await readTemplateLocalePayload(templatesRoot, 'en-US', {})

    const zhCnPath = path.join(translationDir, 'zh-CN.json')
    const enUsPath = path.join(translationDir, 'en-US.json')

    const zhCnExisting = (await readJsonIfExists(zhCnPath)) ?? {}
    const enUsExisting = (await readJsonIfExists(enUsPath)) ?? {}
    const zhCnMerge = mergeLocaleCatalog(zhSeed, zhCnExisting, {
      overwriteExisting: options.force,
    })
    const enUsMerge = mergeLocaleCatalog(enSeed, enUsExisting, {
      overwriteExisting: options.force,
    })

    await writeJson(zhCnPath, zhCnMerge.merged)
    await writeJson(enUsPath, enUsMerge.merged)

    const localePayloadMap = {
      'zh-CN': zhCnMerge.merged,
      'en-US': enUsMerge.merged,
    }

    const syncResults = [
      `zh-CN.json (+${zhCnMerge.added})`,
      `en-US.json (+${enUsMerge.added})`,
    ]

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === 'zh-CN' || locale === 'en-US') continue
      const fallback = locale === 'zh-TW' ? zhCnMerge.merged : enUsMerge.merged
      const localeTemplate = await readTemplateLocalePayload(templatesRoot, locale, fallback)
      const localePath = path.join(translationDir, `${locale}.json`)
      const existing = (await readJsonIfExists(localePath)) ?? {}
      const merged = mergeLocaleCatalog(localeTemplate, existing, {
        overwriteExisting: options.force,
      })
      await writeJson(localePath, merged.merged)
      localePayloadMap[locale] = merged.merged
      syncResults.push(`${locale}.json (+${merged.added})`)
    }

    await fs.writeFile(messagesPath, buildMessagesTs(localePayloadMap), 'utf8')

    console.log('[init-i18n] i18n baseline is ready.')
    console.log(`- target: ${targetRoot}`)
    console.log(`- locales: ${SUPPORTED_LOCALES.join(', ')}`)
    console.log(`- synced locale files: ${syncResults.join(', ')}`)
    console.log(`- generated: ${path.relative(targetRoot, messagesPath)}`)

    if (!options.syncOnly) {
      if (seededFiles.length > 0) {
        console.log(`- seeded files: ${seededFiles.join(', ')}`)
      }
      console.log(`- package.json: ${packageResult.status}`)
      if (packageResult.addedScripts.length > 0) {
        console.log(`- added scripts: ${packageResult.addedScripts.join(', ')}`)
      }
      if (packageResult.skippedScripts.length > 0) {
        console.log(`- preserved scripts: ${packageResult.skippedScripts.join(', ')}`)
      }
      console.log('- next: run `pnpm i18n:sync` after editing locale files, or rerun this init script with `--force` if you want to refresh the baseline wrappers.')
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[init-i18n] failed: ${message}`)
    process.exit(1)
  }
}

main()
