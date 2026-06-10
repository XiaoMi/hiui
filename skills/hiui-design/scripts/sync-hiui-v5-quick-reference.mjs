#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  HIUI_V5_QUICK_REFERENCE_GROUPS,
  buildHiuiV5ManifestPaths,
  readJson,
  readText,
} from './lib/hiui-v5-knowledge.mjs'

const SECTION_HEADING = '## 典型页常用组件'

function parseArgs(argv) {
  const options = {
    check: false,
  }

  for (const arg of argv) {
    if (arg === '--check') {
      options.check = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/sync-hiui-v5-quick-reference.mjs [--check]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function renderQuickReferenceSection(manifest) {
  const groups = new Map(
    HIUI_V5_QUICK_REFERENCE_GROUPS.map((group) => [
      group.id,
      {
        ...group,
        components: [],
      },
    ]),
  )

  for (const component of Object.values(manifest.components ?? {})) {
    if (!component.quickReference?.group) {
      continue
    }

    const group = groups.get(component.quickReference.group)
    if (!group) {
      continue
    }

    group.components.push(component)
  }

  const renderedGroups = HIUI_V5_QUICK_REFERENCE_GROUPS.map((groupMeta) => {
    const group = groups.get(groupMeta.id)
    const components = (group?.components ?? []).sort((left, right) => {
      const orderDelta = (left.quickReference?.order ?? 0) - (right.quickReference?.order ?? 0)
      return orderDelta || left.name.localeCompare(right.name)
    })

    const lines = components.map((component) => {
      const note = component.quickReference?.note?.trim()
      return note ? `- \`${component.name}\`（${note}）` : `- \`${component.name}\``
    })

    return [`### ${groupMeta.label}`, '', ...lines].join('\n')
  }).join('\n\n')

  return `${SECTION_HEADING}

这一节优先从 \`manifests/hiui-v5-components.json\` 的 \`quickReference\` 配置渲染，只保留当前典型页最常用的 HiUI 组件与必要导入备注，减少和完整图谱的双写。

- 生成脚本：\`scripts/sync-hiui-v5-quick-reference.mjs\`
- 组件 facts：\`manifests/hiui-v5-components.json\`
- 作用边界：只保留典型页最小兜底，不覆盖非典型页面路由判断

${renderedGroups}`
}

function replaceQuickReferenceSection(documentText, renderedSection) {
  const startIndex = documentText.indexOf(SECTION_HEADING)
  if (startIndex === -1) {
    throw new Error('Quick reference section heading is missing from docs/hiui-v5-quick-reference.md')
  }

  const nextHeadingIndex = documentText.indexOf('\n## ', startIndex + SECTION_HEADING.length)
  const endIndex = nextHeadingIndex === -1 ? documentText.length : nextHeadingIndex + 1
  return `${documentText.slice(0, startIndex)}${renderedSection}\n\n${documentText.slice(endIndex)}`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { componentManifestPath, quickReferencePath } = buildHiuiV5ManifestPaths(skillRoot)

  const [manifest, quickReferenceText] = await Promise.all([
    readJson(componentManifestPath),
    readText(quickReferencePath),
  ])

  const renderedSection = renderQuickReferenceSection(manifest)
  const nextText = replaceQuickReferenceSection(quickReferenceText, renderedSection)
  const expected = nextText.endsWith('\n') ? nextText : `${nextText}\n`
  const actual = quickReferenceText.endsWith('\n') ? quickReferenceText : `${quickReferenceText}\n`
  const quickReferenceCount = Object.values(manifest.components ?? {}).filter(
    (component) => component.quickReference?.group,
  ).length

  if (options.check) {
    if (actual !== expected) {
      console.log('HiUI v5 quick reference is out of date:')
      console.log(`- ${path.relative(skillRoot, quickReferencePath)}`)
      process.exit(1)
    }

    console.log('HiUI v5 quick reference already synced.')
    console.log(`- ${path.relative(skillRoot, quickReferencePath)}`)
    console.log(`- components: ${quickReferenceCount}`)
    return
  }

  await fs.writeFile(quickReferencePath, expected, 'utf8')
  console.log('HiUI v5 quick reference synced:')
  console.log(`- ${path.relative(skillRoot, quickReferencePath)}`)
  console.log(`- components: ${quickReferenceCount}`)
}

await main()
