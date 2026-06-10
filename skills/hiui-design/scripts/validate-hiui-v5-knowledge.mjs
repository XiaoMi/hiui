#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  HIUI_V5_QUICK_REFERENCE_GROUPS,
  buildHiuiV5ManifestPaths,
  collectExplicitComponentMentions,
  extractMarkdownSection,
  extractCandidateCodeTokens,
  readJson,
  readText,
} from './lib/hiui-v5-knowledge.mjs'

function parseArgs(argv) {
  const options = {
    strictCoverage: false,
  }

  for (const arg of argv) {
    if (arg === '--strict-coverage') {
      options.strictCoverage = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/validate-hiui-v5-knowledge.mjs [--strict-coverage]\n' +
          '       --strict-coverage makes documentation coverage gaps fail validation.',
      )
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function ensureArray(value, label, errors) {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array`)
    return []
  }

  return value
}

function expandReferenceTokens(value) {
  if (!value) {
    return []
  }

  return value
    .split(/[+/]/)
    .flatMap((segment) => segment.split(/\s+/))
    .map((segment) => segment.trim())
    .filter(Boolean)
}

function validateDocTokens({ filePath, text, allowedTokens, errors }) {
  const docTokens = extractCandidateCodeTokens(text)
  for (const token of docTokens) {
    if (!allowedTokens.has(token)) {
      errors.push(`${path.basename(filePath)} references unknown HiUI token: ${token}`)
    }
  }
}

function validateSemanticEvidence({ filePath, text, componentMap, checks, errors }) {
  for (const check of checks) {
    if (!text.includes(check.evidence)) {
      errors.push(`${path.basename(filePath)} is missing evidence snippet: ${check.evidence}`)
      continue
    }

    const component = componentMap[check.component]
    if (!component) {
      errors.push(`${path.basename(filePath)} expects missing manifest component: ${check.component}`)
      continue
    }

    const semanticRoles = Array.isArray(component.semanticRoles) ? component.semanticRoles : []
    if (!semanticRoles.includes(check.role)) {
      errors.push(
        `${path.basename(filePath)} expects ${check.component} to carry semantic role "${check.role}"`,
      )
    }
  }
}

function validateQuickReferenceConfig({ componentName, component, errors }) {
  if (component.quickReference == null) {
    return
  }

  if (typeof component.quickReference !== 'object' || Array.isArray(component.quickReference)) {
    errors.push(`${componentName}.quickReference must be an object or null`)
    return
  }

  const validGroups = new Set(HIUI_V5_QUICK_REFERENCE_GROUPS.map((item) => item.id))
  const { group, order, note } = component.quickReference

  if (!validGroups.has(group)) {
    errors.push(`${componentName}.quickReference.group references unknown quick-reference group: ${group}`)
  }

  if (!Number.isInteger(order) || order < 0) {
    errors.push(`${componentName}.quickReference.order must be a non-negative integer`)
  }

  if (note != null && typeof note !== 'string') {
    errors.push(`${componentName}.quickReference.note must be a string when present`)
  }

  if (component.frequency !== 'high') {
    errors.push(`${componentName} is in quickReference but frequency is not high`)
  }
}

function parseQuickReferenceSection(sectionText) {
  const groups = []
  const lines = sectionText.split('\n')
  let currentGroup = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      continue
    }

    if (line.startsWith('### ')) {
      currentGroup = {
        label: line.slice(4).trim(),
        items: [],
      }
      groups.push(currentGroup)
      continue
    }

    if (currentGroup && line.startsWith('- `')) {
      const match = line.match(/^- `([^`]+)`(?:（(.+)）)?$/)
      if (match) {
        currentGroup.items.push({
          name: match[1],
          note: match[2] ?? '',
        })
      }
    }
  }

  return groups
}

function buildExpectedQuickReferenceGroups(componentEntries) {
  const grouped = new Map(
    HIUI_V5_QUICK_REFERENCE_GROUPS.map((group) => [
      group.id,
      {
        label: group.label,
        items: [],
      },
    ]),
  )

  for (const [componentName, component] of componentEntries) {
    if (!component.quickReference?.group) {
      continue
    }

    const group = grouped.get(component.quickReference.group)
    if (!group) {
      continue
    }

    group.items.push({
      name: componentName,
      note: component.quickReference.note ?? '',
      order: component.quickReference.order ?? 0,
    })
  }

  return HIUI_V5_QUICK_REFERENCE_GROUPS.map((groupMeta) => ({
    label: groupMeta.label,
    items: grouped
      .get(groupMeta.id)
      .items.sort((left, right) => left.order - right.order || left.name.localeCompare(right.name))
      .map(({ name, note }) => ({ name, note })),
  }))
}

function validateQuickReferenceDoc({ quickReferenceText, componentEntries, errors }) {
  const sectionText = extractMarkdownSection(quickReferenceText, '## 典型页常用组件')
  if (!sectionText) {
    errors.push('hiui-v5-quick-reference.md is missing the "## 典型页常用组件" section')
    return
  }

  const actualGroups = parseQuickReferenceSection(sectionText)
  const expectedGroups = buildExpectedQuickReferenceGroups(componentEntries)

  if (actualGroups.length !== expectedGroups.length) {
    errors.push(
      `hiui-v5-quick-reference.md quick-reference group count mismatch: expected ${expectedGroups.length}, got ${actualGroups.length}`,
    )
    return
  }

  for (let index = 0; index < expectedGroups.length; index += 1) {
    const expectedGroup = expectedGroups[index]
    const actualGroup = actualGroups[index]

    if (actualGroup.label !== expectedGroup.label) {
      errors.push(
        `hiui-v5-quick-reference.md quick-reference group order mismatch at position ${index + 1}: expected "${expectedGroup.label}", got "${actualGroup.label}"`,
      )
      continue
    }

    if (actualGroup.items.length !== expectedGroup.items.length) {
      errors.push(
        `hiui-v5-quick-reference.md group "${expectedGroup.label}" item count mismatch: expected ${expectedGroup.items.length}, got ${actualGroup.items.length}`,
      )
      continue
    }

    for (let itemIndex = 0; itemIndex < expectedGroup.items.length; itemIndex += 1) {
      const expectedItem = expectedGroup.items[itemIndex]
      const actualItem = actualGroup.items[itemIndex]

      if (actualItem.name !== expectedItem.name) {
        errors.push(
          `hiui-v5-quick-reference.md group "${expectedGroup.label}" item order mismatch at position ${itemIndex + 1}: expected "${expectedItem.name}", got "${actualItem.name}"`,
        )
      }

      if ((actualItem.note ?? '') !== (expectedItem.note ?? '')) {
        errors.push(
          `hiui-v5-quick-reference.md group "${expectedGroup.label}" note mismatch for "${expectedItem.name}"`,
        )
      }
    }
  }
}

function buildCoverageReport({ componentEntries, docs }) {
  const highFrequencySemanticComponents = componentEntries
    .filter(([, component]) => component.frequency === 'high' && Array.isArray(component.semanticRoles) && component.semanticRoles.length)
    .map(([componentName, component]) => ({
      componentName,
      roles: component.semanticRoles,
    }))

  return docs.map((doc) => {
    const mentions = collectExplicitComponentMentions(
      doc.text,
      highFrequencySemanticComponents.map((item) => item.componentName),
    )
    const missing = highFrequencySemanticComponents.filter((item) => !mentions.has(item.componentName))

    return {
      ...doc,
      coveredCount: highFrequencySemanticComponents.length - missing.length,
      totalCount: highFrequencySemanticComponents.length,
      missing,
    }
  })
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const {
    componentManifestPath,
    semanticRolesPath,
    quickReferencePath,
    routingDocPath,
    aiKickoffTemplatePath,
    componentMapDocPath,
  } = buildHiuiV5ManifestPaths(skillRoot)

  const [
    componentManifest,
    semanticRolesManifest,
    quickReferenceText,
    routingDocText,
    aiKickoffTemplateText,
    componentMapText,
  ] =
    await Promise.all([
      readJson(componentManifestPath),
      readJson(semanticRolesPath),
      readText(quickReferencePath),
      readText(routingDocPath),
      readText(aiKickoffTemplatePath),
      readText(componentMapDocPath),
    ])

  const errors = []
  const componentEntries = Object.entries(componentManifest.components ?? {})
  const componentMap = Object.fromEntries(componentEntries)
  const componentNames = new Set(componentEntries.map(([componentName]) => componentName))
  const semanticRoles = new Set(semanticRolesManifest.roles ?? [])
  const specialTokens = new Set(componentManifest.specialTokens?.nonComponentAlternatives ?? [])
  const allowedReferenceTokens = new Set([...componentNames, ...specialTokens])

  for (const [componentName, component] of componentEntries) {
    if (component.name !== componentName) {
      errors.push(`Component name mismatch: key "${componentName}" does not match name "${component.name}"`)
    }

    const semanticRolesValue = ensureArray(component.semanticRoles, `${componentName}.semanticRoles`, errors)
    const notForValue = ensureArray(component.notFor, `${componentName}.notFor`, errors)
    const alternativesValue = ensureArray(component.alternatives, `${componentName}.alternatives`, errors)
    validateQuickReferenceConfig({ componentName, component, errors })

    for (const role of [...semanticRolesValue, ...notForValue]) {
      if (!semanticRoles.has(role)) {
        errors.push(`${componentName} references unknown semantic role: ${role}`)
      }
    }

    for (const alternative of alternativesValue) {
      const expandedTokens = allowedReferenceTokens.has(alternative)
        ? [alternative]
        : expandReferenceTokens(alternative)

      for (const token of expandedTokens) {
        if (!allowedReferenceTokens.has(token)) {
          errors.push(`${componentName} references unknown alternative token: ${alternative}`)
          break
        }
      }
    }

    if (component.frequency === 'high') {
      if (!semanticRolesValue.length) {
        errors.push(`${componentName} is frequency=high but semanticRoles is empty`)
      }
    }
  }

  validateDocTokens({
    filePath: quickReferencePath,
    text: quickReferenceText,
    allowedTokens: allowedReferenceTokens,
    errors,
  })
  validateQuickReferenceDoc({
    quickReferenceText,
    componentEntries,
    errors,
  })
  validateDocTokens({
    filePath: routingDocPath,
    text: routingDocText,
    allowedTokens: allowedReferenceTokens,
    errors,
  })
  validateDocTokens({
    filePath: aiKickoffTemplatePath,
    text: aiKickoffTemplateText,
    allowedTokens: allowedReferenceTokens,
    errors,
  })
  validateDocTokens({
    filePath: componentMapDocPath,
    text: componentMapText,
    allowedTokens: allowedReferenceTokens,
    errors,
  })

  validateSemanticEvidence({
    filePath: routingDocPath,
    text: routingDocText,
    componentMap,
    errors,
    checks: [
      { component: 'PageHeader', role: 'page-header', evidence: '- 标题 + 返回 + 主操作：优先 `PageHeader`' },
      { component: 'Button', role: 'action-trigger', evidence: '- 同层操作排布：`Space + Button`' },
      { component: 'Descriptions', role: 'detail-body', evidence: '- 成组字段、详情正文：优先 `Descriptions`' },
      { component: 'Timeline', role: 'time-sequence', evidence: '- 时间顺序记录：优先 `Timeline`' },
      { component: 'List', role: 'heterogeneous-reading-list', evidence: '- 简单异构条目：优先 `List`' },
      { component: 'Table', role: 'structured-data-list', evidence: '- 统一结构数据：优先 `Table`' },
      { component: 'Tree', role: 'hierarchical-browse', evidence: '- 层级节点浏览：优先 `Tree`' },
      { component: 'QueryFilter', role: 'query-filter', evidence: '- 标准列表筛选：优先 `QueryFilter`' },
      { component: 'Search', role: 'single-keyword-search', evidence: '- 单关键词检索：可在 `QueryFilter` 内组合 `Search`' },
      { component: 'Tag', role: 'status-indicator', evidence: '- 状态标签：优先 `Tag`' },
      { component: 'Form', role: 'multi-field-form', evidence: '- 多字段录入：优先 `Form`' },
      { component: 'Input', role: 'single-value-input', evidence: '- 单行文本：`Input`' },
      { component: 'Textarea', role: 'single-value-input', evidence: '- 长文本：`Textarea`' },
      { component: 'NumberInput', role: 'numeric-input', evidence: '- 数字：`NumberInput` 或 `Counter`' },
      { component: 'Switch', role: 'boolean-toggle', evidence: '- 布尔：`Switch`' },
      { component: 'Radio', role: 'single-choice-input', evidence: '- 少量互斥：`Radio`' },
      { component: 'Checkbox', role: 'multi-choice-input', evidence: '- 少量多选：`Checkbox`' },
      { component: 'Select', role: 'flat-selection', evidence: '- 普通单选：`Select`' },
      { component: 'TreeSelect', role: 'hierarchical-selection', evidence: '- 层级单选：`TreeSelect` 或 `Cascader`' },
      { component: 'Cascader', role: 'hierarchical-selection', evidence: '- 层级单选：`TreeSelect` 或 `Cascader`' },
      { component: 'Drawer', role: 'context-preserving-task', evidence: '- 中途编辑 / 查看详情：`Drawer`' },
      { component: 'Modal', role: 'blocking-confirmation', evidence: '- 阻断式任务：`Modal`' },
      { component: 'Popover', role: 'lightweight-overlay', evidence: '- 轻量补充信息：`Popover` / `Tooltip`' },
      { component: 'Message', role: 'global-feedback', evidence: '- 即时反馈：`Message` / `Toast`' },
    ],
  })

  validateSemanticEvidence({
    filePath: aiKickoffTemplatePath,
    text: aiKickoffTemplateText,
    componentMap,
    errors,
    checks: [
      { component: 'Tag', role: 'status-indicator', evidence: '- page-header secondary info: Tag + text row' },
      { component: 'Alert', role: 'inline-warning', evidence: '- risk reminder: Alert' },
      { component: 'List', role: 'heterogeneous-reading-list', evidence: '- supporting recommendation list: List' },
      { component: 'QueryFilter', role: 'query-filter', evidence: '- detail workspace: QueryFilter + Table + Pagination' },
      { component: 'Table', role: 'structured-data-list', evidence: '- detail workspace: QueryFilter + Table + Pagination' },
      { component: 'Pagination', role: 'pagination-nav', evidence: '- detail workspace: QueryFilter + Table + Pagination' },
      { component: 'Descriptions', role: 'detail-body', evidence: 'not Descriptions because it only serves title-adjacent identification, not detail body' },
      { component: 'Result', role: 'terminal-result', evidence: 'not Result because it is an in-flow reading notice, not a terminal outcome state' },
      { component: 'Card', role: 'local-panel', evidence: 'not Card grid because entries are heterogeneous and read sequentially' },
    ],
  })

  const coverageReport = buildCoverageReport({
    componentEntries,
    docs: [
      {
        filePath: routingDocPath,
        text: routingDocText,
      },
      {
        filePath: aiKickoffTemplatePath,
        text: aiKickoffTemplateText,
      },
    ],
  })

  const coverageWarnings = coverageReport
    .filter((report) => report.missing.length)
    .map((report) => {
      const missingSummary = report.missing
        .map((item) => `${item.componentName}(${item.roles.join('/')})`)
        .join(', ')
      return `${path.basename(report.filePath)} coverage ${report.coveredCount}/${report.totalCount}; missing: ${missingSummary}`
    })

  if (options.strictCoverage && coverageWarnings.length) {
    errors.push(...coverageWarnings)
  }

  if (errors.length) {
    console.log('HiUI v5 knowledge validation failed:')
    for (const error of errors) {
      console.log(`- ${error}`)
    }
    process.exit(1)
  }

  console.log('HiUI v5 knowledge validation passed.')
  console.log(`- manifest: ${path.relative(skillRoot, componentManifestPath)}`)
  console.log(`- semantic-roles: ${path.relative(skillRoot, semanticRolesPath)}`)
  console.log(`- components: ${componentEntries.length}`)
  console.log('- coverage:')
  for (const report of coverageReport) {
    console.log(
      `  - ${path.basename(report.filePath)}: ${report.coveredCount}/${report.totalCount} high-frequency semantic components explicitly covered`,
    )
  }
  if (coverageWarnings.length) {
    console.log('- coverage-warnings:')
    for (const warning of coverageWarnings) {
      console.log(`  - ${warning}`)
    }
  }
}

await main()
