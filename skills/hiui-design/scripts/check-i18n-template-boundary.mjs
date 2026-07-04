#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_FORBIDDEN_TERMS = [
  'COMPETITION_ENTRY_TRANSLATION_OVERRIDES',
  '参赛作品管理',
  '作品赛道',
  '队长姓名',
  '协同小龙虾',
  'Lobster Lens',
]

const TEMPLATE_TRANSLATION_DIR = path.join('templates', 'i18n', 'src', 'translation')
const DEMO_OVERRIDES_FILE = path.join(TEMPLATE_TRANSLATION_DIR, 'demo-overrides.ts')
const ALLOWED_TRANSLATION_OVERRIDE_CONSTANTS = new Set(['DEMO_TRANSLATION_OVERRIDES'])

function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join('/')
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function collectFiles(rootDir, relativeDir = '') {
  const currentDir = relativeDir ? path.join(rootDir, relativeDir) : rootDir
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const childRelativePath = relativeDir ? path.join(relativeDir, entry.name) : entry.name
    const childPath = path.join(rootDir, childRelativePath)

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootDir, childRelativePath)))
      continue
    }

    if (entry.isFile()) {
      files.push(childPath)
    }
  }

  return files
}

function findCustomOverrideConstants(content, relativePath) {
  if (normalizeRelativePath(relativePath) !== normalizeRelativePath(DEMO_OVERRIDES_FILE)) {
    return []
  }

  const issues = []
  const constantPattern = /(?:^|\n)\s*(?:export\s+)?const\s+([A-Z0-9_]+_TRANSLATION_OVERRIDES)\b/g

  for (const match of content.matchAll(constantPattern)) {
    const constantName = match[1]
    if (!ALLOWED_TRANSLATION_OVERRIDE_CONSTANTS.has(constantName)) {
      issues.push({
        code: 'custom-template-translation-override-constant',
        detail: `${relativePath} defines ${constantName}; template i18n files may only export DEMO_TRANSLATION_OVERRIDES`,
        file: relativePath,
      })
    }
  }

  return issues
}

function findForbiddenTerms(content, relativePath, forbiddenTerms) {
  const issues = []

  for (const term of forbiddenTerms) {
    if (content.includes(term)) {
      issues.push({
        code: 'business-term-in-i18n-template',
        detail: `${relativePath} contains business-only term "${term}"`,
        file: relativePath,
      })
    }
  }

  return issues
}

export async function inspectI18nTemplateBoundary(options = {}) {
  const skillRoot = path.resolve(
    options.skillRoot || path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
  )
  const forbiddenTerms = options.forbiddenTerms || DEFAULT_FORBIDDEN_TERMS
  const translationRoot = path.join(skillRoot, TEMPLATE_TRANSLATION_DIR)
  const issues = []

  if (!(await pathExists(translationRoot))) {
    return {
      checkedFiles: 0,
      issues,
      translationRoot,
    }
  }

  const files = await collectFiles(translationRoot)

  for (const filePath of files) {
    const relativePath = normalizeRelativePath(path.relative(skillRoot, filePath))
    const content = await fs.readFile(filePath, 'utf8')
    issues.push(...findForbiddenTerms(content, relativePath, forbiddenTerms))
    issues.push(...findCustomOverrideConstants(content, relativePath))
  }

  return {
    checkedFiles: files.length,
    issues,
    translationRoot,
  }
}

function parseArgs(argv) {
  const options = {
    skillRoot: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--skill-root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --skill-root')
      }
      options.skillRoot = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/check-i18n-template-boundary.mjs [--skill-root <path>]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const report = await inspectI18nTemplateBoundary({
    skillRoot: options.skillRoot || undefined,
  })

  if (report.issues.length > 0) {
    console.error('[check-i18n-template-boundary] FAIL')
    console.error(`- checked files: ${report.checkedFiles}`)
    console.error(`- template root: ${report.translationRoot}`)
    for (const issue of report.issues) {
      console.error(`- ${issue.code}: ${issue.detail}`)
    }
    process.exit(1)
  }

  console.log('[check-i18n-template-boundary] PASS')
  console.log(`- checked files: ${report.checkedFiles}`)
  console.log(`- template root: ${report.translationRoot}`)
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[check-i18n-template-boundary] ${message}`)
    process.exit(1)
  })
}
