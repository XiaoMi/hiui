#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const REQUIRED_CONTRACT_FIELDS = [
  'schemaVersion',
  'pageTypeId',
  'shell',
  'regions',
  'regionOrder',
  'ownership',
  'slotSchema',
  'componentSources',
  'visualTokens',
]

const SUPPORTED_SHELLS = new Set([
  'StatListPageFrame',
  'TablePageFrame',
  'TreeSplitPageFrame',
  'ProFormDrawer',
  'ProDetailDrawer',
  'ProEditPage',
  'ProDetailPage',
  'FeedbackStatePanel',
])

function parseArgs(argv) {
  const options = {
    contractsDir: '',
    outDir: '',
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--contracts-dir' || arg === '--out-dir') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--contracts-dir') options.contractsDir = path.resolve(value)
      if (arg === '--out-dir') options.outDir = path.resolve(value)
      index += 1
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(`Usage:
  node scripts/compile-legacy-page-specs.mjs [--contracts-dir <dir>] [--out-dir <dir>] [--json]

Default input : rules/typical-page-contracts
Default output: runtime/legacy/src/page-specs
`)
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

function toIdentifier(pageTypeId) {
  const normalized = String(pageTypeId || '').replace(/[^A-Za-z0-9]+(.)/g, (_, char) => char.toUpperCase())
  return `${normalized.replace(/^[^A-Za-z_$]+/, '')}Spec`
}

function assertArray(value, fieldName, contractPath) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${contractPath} must declare non-empty ${fieldName}`)
  }
}

function validateContract(contract, contractPath) {
  for (const fieldName of REQUIRED_CONTRACT_FIELDS) {
    if (contract[fieldName] == null) {
      throw new Error(`${contractPath} is missing ${fieldName}`)
    }
  }
  if (contract.schemaVersion !== 'typical-page-contract.v1') {
    throw new Error(`${contractPath} schemaVersion must be typical-page-contract.v1`)
  }
  if (!SUPPORTED_SHELLS.has(contract.shell)) {
    throw new Error(`${contractPath} declares unsupported shell: ${contract.shell}`)
  }
  assertArray(contract.regions, 'regions', contractPath)
  assertArray(contract.regionOrder, 'regionOrder', contractPath)
  assertArray(contract.slotSchema?.editableSlots, 'slotSchema.editableSlots', contractPath)
  for (const slotId of contract.slotSchema.editableSlots) {
    if (typeof slotId !== 'string' || !slotId.trim()) {
      throw new Error(`${contractPath} slotSchema.editableSlots must contain non-empty string ids`)
    }
  }
  if (typeof contract.ownership !== 'object' || Array.isArray(contract.ownership)) {
    throw new Error(`${contractPath} must declare ownership object`)
  }
  assertArray(contract.slotSchema?.editableSlots, 'slotSchema.editableSlots', contractPath)
  assertArray(contract.slotSchema?.slotManifest, 'slotSchema.slotManifest', contractPath)
  const slotManifestIds = new Set()
  for (const slot of contract.slotSchema.slotManifest) {
    const slotId = String(slot?.slotId || '').trim()
    if (!slotId) {
      throw new Error(`${contractPath} slotSchema.slotManifest entries must declare slotId`)
    }
    if (slotManifestIds.has(slotId)) {
      throw new Error(`${contractPath} slotSchema.slotManifest has duplicated slotId ${slotId}`)
    }
    slotManifestIds.add(slotId)
    if (!String(slot?.contentType || '').trim()) {
      throw new Error(`${contractPath} slot ${slotId} must declare contentType`)
    }
    if (!String(slot?.owner || '').trim()) {
      throw new Error(`${contractPath} slot ${slotId} must declare owner`)
    }
    if (/fields|columns|actions|items|sections|data/iu.test(slotId) && !(Number(slot.maxItems) > 0)) {
      throw new Error(`${contractPath} slot ${slotId} must declare positive maxItems`)
    }
    assertArray(slot.allowedChanges, `slotSchema.slotManifest.${slotId}.allowedChanges`, contractPath)
    assertArray(slot.forbiddenChanges, `slotSchema.slotManifest.${slotId}.forbiddenChanges`, contractPath)
    if (slot.forbiddenChanges.length === 0) {
      throw new Error(`${contractPath} slot ${slotId} must declare forbiddenChanges`)
    }
  }
  for (const slotId of contract.slotSchema.editableSlots) {
    if (!slotManifestIds.has(slotId)) {
      throw new Error(`${contractPath} slotSchema.slotManifest must cover editable slot ${slotId}`)
    }
  }
  for (const region of contract.regions) {
    if (typeof region !== 'string' || !region.trim()) {
      throw new Error(`${contractPath} regions must contain non-empty string ids`)
    }
    if (!contract.ownership[region]) {
      throw new Error(`${contractPath} ownership must declare owner for region ${region}`)
    }
  }
  for (const region of contract.regionOrder) {
    if (!contract.regions.includes(region)) {
      throw new Error(`${contractPath} regionOrder references unknown region ${region}`)
    }
  }
  if (typeof contract.componentSources !== 'object' || Array.isArray(contract.componentSources)) {
    throw new Error(`${contractPath} must declare componentSources object`)
  }
  if (contract.visualTokens?.scope !== 'data-hiui-page-root') {
    throw new Error(`${contractPath} visualTokens.scope must be data-hiui-page-root`)
  }
  if (contract.visualTokens?.tokenSource !== 'src/hiui-runtime/styles.css') {
    throw new Error(`${contractPath} visualTokens.tokenSource must be src/hiui-runtime/styles.css`)
  }
  assertArray(contract.visualTokens?.forbidPageLocalOverrides, 'visualTokens.forbidPageLocalOverrides', contractPath)
}

function buildSpecValue(contract) {
  return {
    pageType: contract.pageTypeId,
    shell: contract.shell,
    regions: contract.regions,
    regionOrder: contract.regionOrder,
    ownership: contract.ownership,
    editableSlots: contract.slotSchema.editableSlots,
    slotManifest: contract.slotSchema.slotManifest,
    componentSources: contract.componentSources,
    visualTokens: contract.visualTokens,
  }
}

function buildSpecSource(contract) {
  const identifier = toIdentifier(contract.pageTypeId)
  return `import type { LegacyPageSpec } from './types'

export const ${identifier}: LegacyPageSpec = ${JSON.stringify(buildSpecValue(contract), null, 2)}
`
}

function buildIndexSource(contracts) {
  const imports = contracts
    .map((contract) => `import { ${toIdentifier(contract.pageTypeId)} } from './${contract.pageTypeId}'`)
    .join('\n')
  const entries = contracts
    .map((contract) => `  '${contract.pageTypeId}': ${toIdentifier(contract.pageTypeId)},`)
    .join('\n')

  return `import type { LegacyPageType } from '../types'
import type { LegacyPageSpec } from './types'
${imports}

const specs: Record<LegacyPageType, LegacyPageSpec> = {
${entries}
}

export function getLegacyPageSpec(pageType: LegacyPageType): LegacyPageSpec {
  return specs[pageType]
}

export const legacyPageSpecs = specs
export type { LegacyPageSpec } from './types'
`
}

async function readContracts(contractsDir) {
  const fileNames = (await fs.readdir(contractsDir)).filter((fileName) => fileName.endsWith('.json')).sort()
  const contracts = []
  for (const fileName of fileNames) {
    const contractPath = path.join(contractsDir, fileName)
    const contract = JSON.parse(await fs.readFile(contractPath, 'utf8'))
    validateContract(contract, path.relative(process.cwd(), contractPath).replace(/\\/g, '/'))
    contracts.push(contract)
  }
  if (contracts.length === 0) {
    throw new Error(`No typical page contracts found in ${contractsDir}`)
  }
  return contracts
}

export async function compileLegacyPageSpecs({ contractsDir, outDir }) {
  const contracts = await readContracts(contractsDir)
  await fs.mkdir(outDir, { recursive: true })
  const writes = []

  for (const contract of contracts) {
    const outputPath = path.join(outDir, `${contract.pageTypeId}.ts`)
    await fs.writeFile(outputPath, buildSpecSource(contract), 'utf8')
    writes.push(outputPath)
  }

  const indexPath = path.join(outDir, 'index.ts')
  await fs.writeFile(indexPath, buildIndexSource(contracts), 'utf8')
  writes.push(indexPath)

  return {
    schemaVersion: 'legacy-page-spec-compile-result.v1',
    status: 'compiled',
    contracts: contracts.map((contract) => contract.pageTypeId),
    files: writes,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const contractsDir = options.contractsDir || path.join(skillRoot, 'rules', 'typical-page-contracts')
  const outDir = options.outDir || path.join(skillRoot, 'runtime', 'legacy', 'src', 'page-specs')
  const result = await compileLegacyPageSpecs({ contractsDir, outDir })

  if (options.json) {
    console.log(JSON.stringify({
      ...result,
      files: result.files.map((filePath) => path.relative(skillRoot, filePath).replace(/\\/g, '/')),
    }, null, 2))
    return
  }

  console.log(`[compile-legacy-page-specs] ${result.status}`)
  console.log(`- contracts: ${result.contracts.join(', ')}`)
  for (const filePath of result.files) {
    console.log(`- wrote: ${path.relative(skillRoot, filePath).replace(/\\/g, '/')}`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`[compile-legacy-page-specs] ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  })
}
