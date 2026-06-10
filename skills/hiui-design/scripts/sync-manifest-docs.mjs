#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content.endsWith('\n') ? content : `${content}\n`, 'utf8')
}

function parseArgs(argv) {
  const options = {
    check: false,
    line: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--line') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --line')
      }
      options.line = value
      i += 1
      continue
    }

    if (arg === '--check') {
      options.check = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/sync-manifest-docs.mjs [--check] [--line <line-id>]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

async function collectDirtyOutputs(outputs) {
  const dirtyOutputs = []

  for (const output of outputs) {
    const expected = output.content.endsWith('\n') ? output.content : `${output.content}\n`
    let actual = ''

    try {
      actual = await readText(output.filePath)
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error
      }
    }

    if (actual !== expected) {
      dirtyOutputs.push(output.filePath)
    }
  }

  return dirtyOutputs
}

function formatNodeId(value) {
  return value ?? '无独立默认节点'
}

function renderDocLinks(pageType) {
  return [...new Set([pageType.docEntry, ...(pageType.sharedDocs ?? [])])]
    .map((docPath) => docPath.replace(/^docs\/generation\//, ''))
    .join(' + ')
}

function getNonTypicalPageLayout(manifest) {
  const layout = manifest.nonTypicalPageLayout ?? {}
  return {
    docEntry: layout.docEntry ?? 'docs/generation/non-typical-pages.md',
    strategies: Array.isArray(layout.strategies) ? layout.strategies : [],
    archetypes: Array.isArray(layout.archetypes) ? layout.archetypes : [],
  }
}

function renderNonTypicalLayoutSection(manifest, options = {}) {
  const rulesPrefix = options.rulesPrefix ?? '.'
  const layout = getNonTypicalPageLayout(manifest)

  if (!layout.strategies.length && !layout.archetypes.length) {
    return ''
  }

  return `
## 非典型 / Overlay 路径

若页面未命中现成典型页型，或仍命中典型页型但内部一级分组需要额外布局判断，不要在本文件里继续定义 \`layout strategy\` 或 \`layout archetype\`。

统一做法：

1. 先保留当前 \`page type\` 结论，或明确“未命中典型页型”
2. 再读 \`${layout.docEntry.replace(/^docs\/generation\//, '')}\`
3. 由该文档负责 \`layout strategy\`、\`layout archetype\` 与布局 ownership 的解释
`
}

function renderGeneratedHeader({
  sourceLabel = 'rules/common.page-types.json',
  rulesVersion = '',
  lastUpdated = '',
} = {}) {
  return (
    [
    `<!-- Generated from ${sourceLabel} by scripts/sync-manifest-docs.mjs. -->`,
    '<!-- Do not edit page-type facts directly in this file. Canonical machine facts live in rules/common.page-types.json. -->',
    rulesVersion ? `<!-- Rules version: ${rulesVersion}${lastUpdated ? ` (${lastUpdated})` : ''}. -->` : '',
    ]
      .filter(Boolean)
      .join('\n') + '\n\n'
  )
}

function normalizeDocPrefix(prefix) {
  return prefix.replace(/\/+$/, '')
}

function rulesDoc(prefix, fileName) {
  if (prefix === '.') {
    return fileName
  }
  return `${normalizeDocPrefix(prefix)}/${fileName}`
}

function renderPageTypeMap(manifest, options = {}) {
  const rulesPrefix = options.rulesPrefix ?? '.'
  const rows = manifest.pageTypes
    .map((pageType) => {
      const nextStep = renderDocLinks(pageType)
      const registryDoc = manifest.registryDoc.replace(/^docs\/generation\//, '')
      return `| ${pageType.label} | ${pageType.whenToUse} | \`${pageType.shell}\` | \`${pageType.assetExamplePath}\` | \`${registryDoc}\` -> \`${nextStep}\` |`
    })
    .join('\n')

  return `${renderGeneratedHeader(options)}# 页型总表

## 这份文件负责什么

这份文件只做三件事：

1. 判页型
2. 选固定页壳
3. 选示例页起点

这是默认页型路由表，由 \`common.page-types.json\` 派生并保持同步。

## 这份文件不负责什么

- 不维护 kickoff 字段顺序
- 不维护 contract 字段形状
- 不维护非典型 / overlay 布局字段
- 不维护组合页增量 checklist
- 不维护验收完成定义

这些内容统一去看：

- kickoff 输出格式：\`../docs/generation/ai-kickoff-template.md\`
- 生成原则与阶段门槛：\`${rulesDoc(rulesPrefix, 'generation-rules.md')}\`
- contract 字段：\`${rulesDoc(rulesPrefix, 'contract-regions.md')}\`
- 非典型 / overlay 布局推理：\`../docs/generation/non-typical-pages.md\`
- 组合页增量要求：\`../docs/generation/implementation-checklist-template.md\`
- 验收证据：\`${rulesDoc(rulesPrefix, 'validation-checklist.md')}\`

## 页型路由表

| 页面类型 | 何时使用 | 固定页壳 | 示例起点 | 下一步 |
| --- | --- | --- | --- | --- |
${rows}

## 判型边界

- 指标卡 + 多图表 + 明细表：优先判为“数据可视化”，不要误判成数据统计表
- 页面主目标是空状态、加载失败、无权限、建设中、网络异常等反馈：优先判为“异常反馈页”，不要套表格/详情壳
- 指标卡 + 筛选 + 表格 + 分页：优先判为“数据统计表”，不要落回普通表格
- 常规列表：走“普通表格”，不要因为有筛选就误判成数据统计表
- 树在表格首列内展开：走“树形表格”，不要误判成左树右表
- 左树和右表是两个区域：走“左树右表”，不要误判成树形表格
- 可编辑字段 \`<= 16\`：优先考虑“抽屉表单”
- 只读描述项 \`<= 16\`：优先考虑“抽屉详情”
- 可编辑字段 \`> 16\`：切到“全页编辑”
- 只读描述项 \`> 16\`：切到“全页详情”

## 硬规则

- 数据可视化页必须从 \`data-visualization.tsx\` 起步
- 异常反馈页默认从 \`empty-state.tsx\` 起步；若需求命中错误态或权限态，再切到同组 feedback 子页
- 数据统计页必须从 \`table-stat.tsx\` 起步
- 全页编辑必须从 \`full-page-edit.tsx\` 起步
- 不要从空白文件发明新的典型页骨架
- 不要手拼裸 \`PageHeader + QueryFilter + Table\`
- 不要手拼裸 \`PageHeader + 多层白卡 + 一堆默认图表\`

## rules-only 附加约束

- 先锁定唯一示例页，再锁定唯一宿主 archetype
- 先明确页头、筛选区/表单区、主体区、分页/底栏分别落在哪个组件语义或宿主基座
- 写不出 \`example path\`、\`host archetype path\`、\`example -> host\` 区域映射时，不要开始生成
- page contract 的关键 region、ownership 与 structural guard 统一看 \`${rulesDoc(rulesPrefix, 'contract-regions.md')}\`

## 使用提醒

- 先读 \`${rulesDoc(rulesPrefix, 'generation-rules.md')}\`，再用本文件判型
- 外部项目默认不落模版页面；应在目标项目既有目录结构中生成首个真实业务页后，再验证宿主和样式基线是否正常
- 命中页型后，不要停在本文件；必须继续读 \`figma-page-rules.md\` 和对应专章
- 本文件只负责把页面送到正确入口，不再平行维护其它事实源
${renderNonTypicalLayoutSection(manifest, options)}

## 未命中现成页型时

- 先回到 \`${rulesDoc(rulesPrefix, 'generation-rules.md')}\`
- 判断它本质更像编辑、详情、列表、统计还是树/主从结构；若仍不命中典型页型，再从 \`../docs/generation/non-typical-pages.md\` 继续收口
- 选择最接近的固定页壳和示例页起步
- 只做最小偏移，不要绕开现有壳层另起一套页面语法`
}

function renderRegistryDoc(manifest, options = {}) {
  const rulesPrefix = options.rulesPrefix ?? '../../rules'
  const rows = manifest.pageTypes
    .map((pageType) => {
      const shared = renderDocLinks(pageType)
      const fileKey = pageType.fileKey ?? '—'
      return `| ${pageType.label} | \`${fileKey}\` | \`${formatNodeId(pageType.nodeId)}\` | \`${pageType.shell}\` | \`${shared}\` | ${pageType.registrySummary} |`
    })
    .join('\n')

  return `${renderGeneratedHeader(options)}# 当前项目 Figma 典型页注册总表

## 这份文件负责什么

这份文件只负责维护下面这些“注册信息”：

- 默认 \`fileKey\`
- 默认 \`nodeId\`
- 固定页壳
- 对应正文入口
- 每个页型的一句核心摘要

这是一份由 \`common.page-types.json\` 派生的展开说明，不是独立权威源。

## 这份文件不负责什么

- 不维护分档表
- 不维护具体 spacing / padding / 列数 / 宽度正文
- 不维护失败信号、自检清单、长篇禁止项

这些内容统一去看：

- AI 默认规则：\`${rulesDoc(rulesPrefix, 'generation-rules.md')}\`
- 机读事实来源：\`${rulesDoc(rulesPrefix, 'common.page-types.json')}\`
- 页型正文：\`figma-pages/*.md\`
- 表单共享规则：\`figma-pages/forms-shared.md\`
- 表格共享规则：\`figma-pages/table-shared.md\`

若本文件与页型专章或 shared 文档冲突，以后者为准。
本文件中的“默认规则”仅指注册信息默认值；页型专章与 shared 文档中的页面生成视觉、框架、交互约束仍按硬门槛执行。
${renderNonTypicalLayoutSection(manifest, options)}

## 使用顺序

1. 先看 \`${rulesDoc(rulesPrefix, 'generation-rules.md')}\` 建立共性生成边界
2. 再看 \`${rulesDoc(rulesPrefix, 'page-type-map.md')}\` 判页型
3. 命中现成页型后，再到本文件命中默认 \`fileKey\` / \`nodeId\` / 页壳 / 正文入口
4. 再读对应页型专章和 shared 文档
5. 需要速查和跨页陷阱时，再补看 \`figma-reference.md\`
6. 只有遇到少见边界时，再补看 \`figma-page-rules-appendix.md\`

## 跨页前置

- 必须优先复用 \`@hiui-design/typical-page-shells\`
- 必须优先从示例页起步，不要从空白文件发明典型页结构
- 外部项目默认只把 \`.local-context/hiui-design/\` 作为规则能力保留在项目中，不把模版页面、路由 gallery 或宿主桥接整包同步进 \`src/\`
- 外部项目应直接在目标项目既有目录结构中生成业务页，并用 \`examples/host-integration/src/pages/*\` 作为参考示例
- 若多个页型同时出现白卡消失、页头贴边、固定底栏失效、主区白底不延伸等整体失真，先修接入，不要逐页 patch

## 页型注册表

| 页型 | \`fileKey\` | 默认 \`nodeId\` | 固定页壳 | 正文入口 | 核心摘要 |
| --- | --- | --- | --- | --- | --- |
${rows}

## 允许偏离默认注册信息的场景

- 用户明确提供新的 Figma \`nodeId\`
- 产品或设计给出书面例外说明
- 目标项目有更高优先级宿主约束，但不影响页壳和页型本身

除以上情况外，一律先按本文件默认注册信息进入对应正文。
上面的偏离仅适用于 \`fileKey\`、\`nodeId\`、示例起点等注册信息；不构成放宽页壳语义、视觉节奏、框架语义或交互语义的授权。

若当前需求没有命中本表中的现成页型，不要在这里强行套注册项；应回到 \`${rulesDoc(rulesPrefix, 'generation-rules.md')}\`，按最近页壳和示例页生成。`
}

function renderMatrixDoc(manifest, options = {}) {
  const rows = manifest.pageTypes
    .map((pageType) => `| ${pageType.label} | \`${formatNodeId(pageType.nodeId)}\` | \`${pageType.shell}\` | \`${pageType.assetExamplePath}\` |`)
    .join('\n')

  return `${renderGeneratedHeader(options)}# Figma Typical Page Reuse Matrix

## 说明

这份矩阵现在只保留 \`hiui-design\` 的核心页型映射，作为外部项目复用时的总览。

它是从 \`common.page-types.json\` 派生的说明性矩阵，不是单独的规则源。

详细规则来源改为：

- \`.local-context/hiui-design/rules/generation-rules.md\`
- \`.local-context/hiui-design/rules/page-type-map.md\`
- \`.local-context/hiui-design/docs/generation/figma-page-rules.md\`
- \`.local-context/hiui-design/docs/generation/figma-page-rules-appendix.md\`
- \`.local-context/hiui-design/rules/common.page-types.json\`

## 页型矩阵

| 页型 | 默认 \`nodeId\` | 固定页壳 | 示例起点 |
| --- | --- | --- | --- |
${rows}

## 使用顺序

1. 先运行 \`typical-page:doctor\`
2. 先读生成原则
3. 再判页型
4. 命中已有页型后再命中默认 \`nodeId\` 和核心 P0
5. 再从示例页开始改
6. 最后只替换业务槽位
${renderNonTypicalLayoutSection(manifest, options)}

## 不再作为默认来源的内容

- 任何第二份独立的典型页规则 skill
- \`.local-context/hiui-pro-templates/views/*\`
- 当前项目 feature 业务页面路径`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const { manifest, baseManifestPath, overlayPath, lineId, rulesVersionMetadata } = await loadPageTypeManifest({
    skillRoot,
    line: options.line,
  })
  const sourceLabel = [baseManifestPath, overlayPath]
    .filter(Boolean)
    .map((item) => path.relative(skillRoot, item).replace(/\\/g, '/'))
    .join(' + ')
  const rulesRenderOptions = {
    sourceLabel,
    rulesVersion: manifest.rulesVersion ?? rulesVersionMetadata.version ?? '',
    lastUpdated: manifest.rulesLastUpdated ?? rulesVersionMetadata['last-updated'] ?? '',
    rulesPrefix: '.',
  }
  const generationRenderOptions = {
    ...rulesRenderOptions,
    rulesPrefix: '../../rules',
  }
  const businessLineRenderOptions = {
    ...generationRenderOptions,
    rulesPrefix: '../../../rules',
  }

  const outputs = lineId
    ? [
        {
          filePath: path.join(skillRoot, 'docs', 'business-lines', lineId, 'page-type-map.generated.md'),
          content: renderPageTypeMap(manifest, businessLineRenderOptions),
        },
        {
          filePath: path.join(skillRoot, 'docs', 'business-lines', lineId, 'figma-page-rules.generated.md'),
          content: renderRegistryDoc(manifest, businessLineRenderOptions),
        },
        {
          filePath: path.join(skillRoot, 'docs', 'business-lines', lineId, 'matrix.generated.md'),
          content: renderMatrixDoc(manifest, businessLineRenderOptions),
        },
      ]
    : [
        {
          filePath: path.join(skillRoot, 'rules', 'page-type-map.md'),
          content: renderPageTypeMap(manifest, rulesRenderOptions),
        },
        {
          filePath: path.join(skillRoot, 'docs', 'generation', 'figma-page-rules.md'),
          content: renderRegistryDoc(manifest, generationRenderOptions),
        },
        {
          filePath: path.join(skillRoot, 'docs', 'generation', 'figma-typical-page-reuse-matrix.md'),
          content: renderMatrixDoc(manifest, generationRenderOptions),
        },
        {
          filePath: path.join(skillRoot, 'docs', 'generation', 'page-types.manifest.json'),
          content: JSON.stringify(manifest, null, 2),
        },
      ]

  if (options.check) {
    const dirtyOutputs = await collectDirtyOutputs(outputs)

    if (dirtyOutputs.length) {
      console.log(lineId ? `Manifest-derived docs out of date for line: ${lineId}` : 'Manifest-derived docs out of date:')
      for (const filePath of dirtyOutputs) {
        console.log(`- ${path.relative(skillRoot, filePath)}`)
      }
      process.exit(1)
    }

    console.log(lineId ? `Manifest-derived docs already synced for line: ${lineId}` : 'Manifest-derived docs already synced.')
    for (const output of outputs) {
      console.log(`- ${path.relative(skillRoot, output.filePath)}`)
    }
    return
  }

  for (const output of outputs) {
    await writeText(output.filePath, output.content)
  }

  console.log(lineId ? `Manifest-derived docs synced for line: ${lineId}` : 'Manifest-derived docs synced:')
  for (const output of outputs) {
    console.log(`- ${path.relative(skillRoot, output.filePath)}`)
  }
}

await main()
