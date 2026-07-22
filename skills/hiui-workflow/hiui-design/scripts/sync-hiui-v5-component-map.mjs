#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  HIUI_V5_QUICK_REFERENCE_GROUPS,
  PUBLIC_HIUI_V5_SOURCE_LABEL,
  buildHiuiV5ManifestPaths,
  readJson,
  readText,
  resolveHiuiV5DocsRoot,
  sanitizeHiuiV5SourceLabel,
} from './lib/hiui-v5-knowledge.mjs'

const GENERATED_START = '<!-- BEGIN GENERATED HIUI V5 COMPONENT CATALOG -->'
const GENERATED_END = '<!-- END GENERATED HIUI V5 COMPONENT CATALOG -->'
const GENERATED_SECTION_HEADING = '## 自动同步附录'

function parseArgs(argv) {
  const options = {
    check: false,
    source: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--check') {
      options.check = true
      continue
    }

    if (arg === '--source') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --source')
      }
      options.source = value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/sync-hiui-v5-component-map.mjs [--check] [--source <hiui-v5-root>]\n' +
          '       component catalog now renders from manifests/hiui-v5-components.json\n' +
          '       optional --source / HIUI_V5_DOCS_ROOT is kept for source-path verification and display'
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function renderSourceLabel({ manifest, skillRoot, sourceRoot }) {
  if (sourceRoot) {
    return PUBLIC_HIUI_V5_SOURCE_LABEL
  }

  return sanitizeHiuiV5SourceLabel(manifest.generated?.source)
}

function renderGeneratedCatalog({ manifest, skillRoot, sourceRoot }) {
  const sourceLabel = renderSourceLabel({ manifest, skillRoot, sourceRoot })
  const quickReferenceGroups = new Map(
    HIUI_V5_QUICK_REFERENCE_GROUPS.map((group) => [group.id, group.label]),
  )
  const components = Object.values(manifest.components ?? {}).sort((left, right) =>
    left.name.localeCompare(right.name),
  )
  const rows = components
    .map(
      (item) =>
        `| \`${item.name}\` | \`${item.upstreamDocPath}\` | \`${item.frequency}\` | \`${item.defaultPriority}\` | ${
          item.quickReference?.group ? `\`${quickReferenceGroups.get(item.quickReference.group) || item.quickReference.group}\`` : '-' 
        } | ${item.upstreamSummary.replace(/\|/g, '\\|')} |`
    )
    .join('\n')

  return `## 自动同步附录

这一节优先从 \`manifests/hiui-v5-components.json\` 渲染，用来把组件目录、来源路径、频度、默认优先级与 README 摘要展开成快速核对视图。

- 生成脚本：\`scripts/sync-hiui-v5-component-map.mjs\`
- 组件 facts：\`manifests/hiui-v5-components.json\`
- 上游来源：\`${sourceLabel}\`
- 作用边界：只展开 facts 层字段与 README 摘要，不覆盖上面的人工选型判断
- 当前数量：${components.length} 个组件

${GENERATED_START}
| 组件 | 来源 | 频度 | 默认优先级 | 最小速查分组 | README 摘要 |
| --- | --- | --- | --- | --- | --- |
${rows}
${GENERATED_END}`
}

function replaceGeneratedBlock(documentText, generatedSection) {
  const startIndex = documentText.indexOf(GENERATED_START)
  const endIndex = documentText.indexOf(GENERATED_END)

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error('Generated catalog markers are missing from docs/generation/hiui-v5-component-map.md')
  }

  const sectionStart = documentText.lastIndexOf(GENERATED_SECTION_HEADING, startIndex)
  const blockStart = sectionStart === -1 ? startIndex : sectionStart
  const blockEnd = endIndex + GENERATED_END.length

  return `${documentText.slice(0, blockStart)}${generatedSection}${documentText.slice(blockEnd)}`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { componentManifestPath, componentMapDocPath } = buildHiuiV5ManifestPaths(skillRoot)
  const sourceHint = options.source || process.env.HIUI_V5_DOCS_ROOT || ''
  const sourceRoot = sourceHint ? await resolveHiuiV5DocsRoot(skillRoot, sourceHint) : ''

  const [manifest, targetDocText] = await Promise.all([
    readJson(componentManifestPath),
    readText(componentMapDocPath),
  ])

  const generatedSection = renderGeneratedCatalog({ manifest, sourceRoot, skillRoot })
  const nextDocText = replaceGeneratedBlock(targetDocText, generatedSection)
  const expected = nextDocText.endsWith('\n') ? nextDocText : `${nextDocText}\n`
  const actual = targetDocText.endsWith('\n') ? targetDocText : `${targetDocText}\n`
  const sourceLabel = renderSourceLabel({ manifest, skillRoot, sourceRoot })
  const componentCount = Object.keys(manifest.components ?? {}).length

  if (options.check) {
    if (actual !== expected) {
      console.log('HiUI v5 component map is out of date:')
      console.log(`- ${path.relative(skillRoot, componentMapDocPath)}`)
      console.log(`- source: ${sourceLabel}`)
      process.exit(1)
    }

    console.log('HiUI v5 component map already synced.')
    console.log(`- ${path.relative(skillRoot, componentMapDocPath)}`)
    console.log(`- components: ${componentCount}`)
    return
  }

  await fs.writeFile(componentMapDocPath, expected, 'utf8')
  console.log('HiUI v5 component map synced:')
  console.log(`- ${path.relative(skillRoot, componentMapDocPath)}`)
  console.log(`- source: ${sourceLabel}`)
  console.log(`- components: ${componentCount}`)
}

await main()
