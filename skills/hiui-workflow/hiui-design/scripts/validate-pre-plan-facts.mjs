#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const VISUAL_TOP_LEVEL = new Set([
  'schemaVersion',
  'status',
  'statusReasons',
  'source',
  'observation',
  'extractedFacts',
  'normalization',
  'pageTypeCandidates',
  'prePlanBlockingFacts',
  'blockingIssues',
  'blockingReasons',
  'planningHints'
])

const HOST_TOP_LEVEL = new Set([
  'schemaVersion',
  'status',
  'statusReasons',
  'modeLock',
  'runtime',
  'componentQualification',
  'translationMapRefs',
  'preGenerationQualification',
  'postGenerationIsomorphism',
  'unverifiedObservations',
  'blockingIssues',
  'blockingReasons',
  'warnings',
  'automationLevel',
  'freshness'
])

const FORBIDDEN_VISUAL_KEYS = new Set([
  'requiredDocs',
  'requiredActions',
  'requiredCommands',
  'formalAcceptanceActions',
  'startFrom',
  'modeOverride',
  'finalPageType',
  'targetPage',
  'contractRegions',
  'ownership',
  'routeConfig',
  'componentStrategy',
  'acceptanceProfile',
  'finalReportContract',
  'api',
  'permissionMatrix',
  'flowSteps',
  'implementationPlan'
])

const VALID_STATUS = new Set(['ready', 'blocked', 'invalid'])
const VALID_AUTOMATION = new Set(['manual-observed', 'script-derived'])
const LEGACY_KEY_PATHS = [
  ['modeLock'],
  ['componentQualification', 'hiuiV5Available'],
  ['componentQualification', 'allowedComponentSource'],
  ['componentQualification', 'adapterExists'],
  ['translationMapRefs', 'shellCarrier'],
  ['translationMapRefs', 'contentSlotOwner'],
  ['translationMapRefs', 'mainScrollOwner'],
  ['translationMapRefs', 'footerOwner'],
  ['translationMapRefs', 'routeOwnership']
]

function usage() {
  console.error('Usage: node scripts/validate-pre-plan-facts.mjs <facts.json> [...]')
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function walk(value, visitor, trail = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visitor, [...trail, String(index)]))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    visitor(key, child, [...trail, key])
    walk(child, visitor, [...trail, key])
  }
}

function getPath(value, segments) {
  return segments.reduce((current, segment) => current && current[segment], value)
}

function hasOutputRef(field) {
  if (!field || typeof field !== 'object') return false
  if (field.outputRef && typeof field.outputRef === 'object') {
    return Boolean(field.outputRef.path || field.outputRef.summary || field.outputRef.hash)
  }
  return Boolean(field.sourcePath)
}

function validateCommon(doc, issues) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) issues.push('document must be an object')
  if (!VALID_STATUS.has(doc.status)) issues.push('status must be ready, blocked, or invalid')
  if (!Array.isArray(doc.statusReasons)) issues.push('statusReasons must be an array')
}

function validateTopLevel(doc, allowed, issues) {
  for (const key of Object.keys(doc)) {
    if (!allowed.has(key)) issues.push(`top-level field is not allowed: ${key}`)
  }
}

function validateVisual(doc, issues) {
  validateTopLevel(doc, VISUAL_TOP_LEVEL, issues)
  walk(doc, (key, _value, trail) => {
    if (FORBIDDEN_VISUAL_KEYS.has(key)) issues.push(`forbidden visual field at ${trail.join('.')}`)
  })
  const constraints = doc.planningHints?.constraints
  if (Array.isArray(constraints) && constraints.length > 3) issues.push('planningHints.constraints must have at most 3 items')
  if (Array.isArray(doc.pageTypeCandidates) && doc.pageTypeCandidates.length > 3) issues.push('pageTypeCandidates must have at most 3 items')
  const recommendations = doc.normalization?.hiuiRecommendations
  if (Array.isArray(recommendations) && recommendations.length > 3) issues.push('normalization.hiuiRecommendations must have at most 3 items')
}

function validateHost(doc, issues) {
  validateTopLevel(doc, HOST_TOP_LEVEL, issues)
  if (!VALID_AUTOMATION.has(doc.automationLevel)) issues.push('automationLevel must be manual-observed or script-derived')
  const freshnessStatus = doc.freshness?.status
  if (freshnessStatus && !['fresh', 'stale', 'invalid', 'unknown'].includes(freshnessStatus)) {
    issues.push('freshness.status must be fresh, stale, invalid, or unknown')
  }
  if (doc.status === 'ready' && doc.automationLevel === 'manual-observed') {
    issues.push('manual-observed host facts cannot be ready')
  }
  if (doc.status === 'ready' && ['stale', 'invalid'].includes(freshnessStatus)) {
    issues.push('stale or invalid host facts cannot be ready')
  }
  for (const segments of LEGACY_KEY_PATHS) {
    const field = getPath(doc, segments)
    if (!field) {
      if (doc.status === 'ready') issues.push(`ready host facts missing key field: ${segments.join('.')}`)
      continue
    }
    if (doc.status === 'ready') {
      if (field.verified !== true) issues.push(`ready host key must be verified: ${segments.join('.')}`)
      if (field.confidence === 'low') issues.push(`ready host key cannot be low confidence: ${segments.join('.')}`)
      if (!field.sourceType) issues.push(`ready host key missing sourceType: ${segments.join('.')}`)
      if (!hasOutputRef(field)) issues.push(`ready host key missing sourcePath/outputRef: ${segments.join('.')}`)
    }
  }
}

function validate(file) {
  const doc = readJson(file)
  const issues = []
  validateCommon(doc, issues)
  if (doc.schemaVersion === 'visual-translation-brief.v1') validateVisual(doc, issues)
  else if (doc.schemaVersion === 'host-qualification-facts.v1') validateHost(doc, issues)
  else issues.push(`unsupported schemaVersion: ${doc.schemaVersion}`)
  return { file, ok: issues.length === 0, issues }
}

const files = process.argv.slice(2)
if (files.length === 0) {
  usage()
  process.exit(2)
}

let failed = false
for (const file of files) {
  const result = validate(path.resolve(file))
  if (result.ok) {
    console.log(`OK ${file}`)
  } else {
    failed = true
    console.error(`FAIL ${file}`)
    for (const issue of result.issues) console.error(`  - ${issue}`)
  }
}
process.exit(failed ? 1 : 0)
