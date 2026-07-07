import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { computeManagedPageSourceSnapshot } from '../managed-page-artifacts.mjs'

export const CONTRACT_MARKER = 'hiui-design example alignment'
export const CANDIDATE_IGNORE_MARKER = 'hiui-design candidate: ignore'
export const PAGE_SOURCE_ROOTS = ['src/views/', 'src/pages/']
export const CONTRACTS_DIR = '.local-context/hiui-design/outputs/page-contracts'
export const TYPICAL_PAGE_SHELL_PACKAGE = '@hiui-design/typical-page-shells'

const PAGE_ENTRY_RE =
  /(^|\/)(index|detail|edit|list|table|apply|create|audit|management|drawer)(\.[jt]sx?)$/
const PATH_HINT_RE = /(detail|drawer|edit|list|table|split|apply|create|audit|management)/

export function toPosixPath(targetPath) {
  return targetPath.split(path.sep).join('/')
}

export function parseDiffArgs(argv) {
  const files = []
  let base = ''
  let head = ''

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--base' || arg === '--head') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--base') base = value
      if (arg === '--head') head = value
      index += 1
      continue
    }

    if (arg === '--files' || arg === '--file') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--files') {
        value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .forEach((item) => files.push(item))
      } else {
        files.push(value)
      }
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  return { base, head, files }
}

function resolveBaseAndHead(explicitBase, explicitHead) {
  const zeroSha = '0000000000000000000000000000000000000000'

  if (explicitBase || explicitHead) {
    if (!explicitBase || !explicitHead) {
      throw new Error('Both --base and --head are required when one of them is provided')
    }
    return { base: explicitBase, head: explicitHead, source: 'explicit' }
  }

  if (
    process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA &&
    process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA !== zeroSha &&
    process.env.CI_COMMIT_SHA
  ) {
    return {
      base: process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA,
      head: process.env.CI_COMMIT_SHA,
      source: 'ci-merge-request',
    }
  }

  if (
    process.env.CI_COMMIT_BEFORE_SHA &&
    process.env.CI_COMMIT_BEFORE_SHA !== zeroSha &&
    process.env.CI_COMMIT_SHA
  ) {
    return {
      base: process.env.CI_COMMIT_BEFORE_SHA,
      head: process.env.CI_COMMIT_SHA,
      source: 'ci-commit-before',
    }
  }

  return { base: 'HEAD~1', head: 'HEAD', source: 'default-head-range' }
}

function runGitCommand(args) {
  return spawnSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
}

function isInsideGitWorkTree() {
  const result = runGitCommand(['rev-parse', '--is-inside-work-tree'])
  return result.status === 0 && String(result.stdout || '').trim() === 'true'
}

function parseNameOnlyOutput(output) {
  return String(output || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => toPosixPath(item))
}

function parseStatusPath(statusEntry) {
  const normalizedEntry = String(statusEntry || '').replace(/\r$/, '')
  if (!normalizedEntry.trim()) return ''

  const payload = normalizedEntry.slice(3)
  if (!payload) return ''

  const renamedSegments = payload.split(' -> ')
  const targetPath = renamedSegments[renamedSegments.length - 1]
  return toPosixPath(targetPath.trim())
}

function parseStatusOutput(output) {
  return String(output || '')
    .split('\n')
    .map((entry) => parseStatusPath(entry))
    .filter(Boolean)
}

function getFallbackChangedFiles() {
  if (!isInsideGitWorkTree()) {
    throw new Error(
      'Could not detect changed files from the default HEAD~1..HEAD range because the current directory is not a git worktree. Pass --files explicitly when running outside git history.'
    )
  }

  const fallbackFiles = new Set()
  const stagedDiffResult = runGitCommand([
    'diff',
    '--cached',
    '--name-only',
    '--diff-filter=ACMR',
  ])

  if (stagedDiffResult.status === 0) {
    parseNameOnlyOutput(stagedDiffResult.stdout).forEach((filePath) => fallbackFiles.add(filePath))
  }

  const statusResult = runGitCommand(['status', '--porcelain', '--untracked-files=all'])
  if (statusResult.status === 0) {
    parseStatusOutput(statusResult.stdout).forEach((filePath) => fallbackFiles.add(filePath))
    return Array.from(fallbackFiles)
  }

  const stagedError = String(stagedDiffResult.stderr || '').trim()
  const statusError = String(statusResult.stderr || '').trim()
  throw new Error(
    [
      'Could not detect changed files from the default HEAD~1..HEAD range.',
      stagedError && `git diff --cached --name-only failed: ${stagedError}`,
      statusError && `git status --porcelain failed: ${statusError}`,
      'Pass --files explicitly when running outside a normal git history.',
    ]
      .filter(Boolean)
      .join(' ')
  )
}

export function getChangedFiles({ base, head, files }) {
  if (files.length > 0) {
    return Array.from(new Set(files.map((item) => toPosixPath(item))))
  }

  const refs = resolveBaseAndHead(base, head)
  const result = runGitCommand([
    'diff',
    '--name-only',
    '--diff-filter=ACMR',
    refs.base,
    refs.head,
  ])

  if (result.status !== 0) {
    if (refs.source === 'default-head-range') {
      return Array.from(new Set(getFallbackChangedFiles()))
    }

    const stderr = String(result.stderr || '').trim()
    throw new Error(stderr || `git diff ${refs.base} ${refs.head} failed`)
  }

  return Array.from(new Set(parseNameOnlyOutput(result.stdout)))
}

export function readFileSafe(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath)
  if (!fs.existsSync(absolutePath)) {
    return ''
  }
  return fs.readFileSync(absolutePath, 'utf8')
}

export function isPageSourceFile(filePath) {
  return PAGE_SOURCE_ROOTS.some((root) => filePath.startsWith(root)) && /\.(js|jsx|ts|tsx)$/.test(filePath)
}

export function usesTypicalPageShellPackage(fileContent) {
  return new RegExp(`['"]${TYPICAL_PAGE_SHELL_PACKAGE}(?:/[^'"]*)?['"]`).test(fileContent)
}

function looksLikeReactPageModule(fileContent) {
  return (
    /export\s+default\s+function\b/.test(fileContent) ||
    /export\s+default\s+[A-Z][A-Za-z0-9_]*\b/.test(fileContent) ||
    /\breturn\s*\(\s*</.test(fileContent) ||
    /<[A-Z][A-Za-z0-9]*/.test(fileContent)
  )
}

export function loadContracts() {
  const contractsRoot = path.join(process.cwd(), CONTRACTS_DIR)
  if (!fs.existsSync(contractsRoot)) {
    return new Map()
  }

  const contracts = new Map()
  fs.readdirSync(contractsRoot)
    .filter((fileName) => fileName.endsWith('.json'))
    .forEach((fileName) => {
      const contractPath = path.join(contractsRoot, fileName)
      const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
      const generatedPagePath = toPosixPath(contract.generatedPagePath || '')
      if (!generatedPagePath) return

      const relativeJsonPath = toPosixPath(path.relative(process.cwd(), contractPath))
      contracts.set(generatedPagePath, {
        contract,
        contractJsonPath: relativeJsonPath,
        contractMdPath: relativeJsonPath.replace(/\.json$/, '.md'),
      })
    })

  return contracts
}

function isFinalizedContractWorkflow(contract) {
  const workflow = contract?.workflow
  const runtimeSmokeRequired =
    String(contract?.pageTypeId || '').trim() === 'data-visualization' &&
    String(contract?.scrollStrategy || '').trim() === 'page-scroll'
  return (
    workflow?.status === 'finalized' &&
    workflow?.deliveryStatus === 'finalized' &&
    workflow?.sourceGateStatus === 'pass' &&
    workflow?.doctorStatus === 'pass' &&
    (!runtimeSmokeRequired || workflow?.runtimeSmokeStatus === 'pass')
  )
}

export function scoreCandidate(filePath, fileContent) {
  if (!isPageSourceFile(filePath)) {
    return { isCandidate: false, reasons: [] }
  }

  const reasons = []
  let score = 0

  if (PAGE_ENTRY_RE.test(filePath)) {
    score += 2
    reasons.push('page-entry file name')
  }

  if (PATH_HINT_RE.test(filePath)) {
    score += 1
    reasons.push('typical-page path keyword')
  }

  const signalGroups = [
    {
      label: 'table page shell',
      matched:
        /\bPageTable\b/.test(fileContent) ||
        (/\bTable\b/.test(fileContent) &&
          (/\bPagination\b/.test(fileContent) || /showPagination\s*:/.test(fileContent))),
      weight: 3,
    },
    {
      label: 'drawer shell',
      matched: /\bDrawer\b/.test(fileContent) || /\bXMSDrawer\b/.test(fileContent),
      weight: 3,
    },
    {
      label: 'detail semantics',
      matched: /\bDescriptions\b/.test(fileContent),
      weight: 2,
    },
    {
      label: 'header/back semantics',
      matched:
        /\bPageHeader\b/.test(fileContent) ||
        /\bonBack\b/.test(fileContent) ||
        /\bArrowLeftOutlined\b/.test(fileContent),
      weight: 2,
    },
    {
      label: 'form semantics',
      matched:
        /\bForm\b/.test(fileContent) ||
        /\bSchemaForm\b/.test(fileContent) ||
        /\bTextarea\b/.test(fileContent),
      weight: 2,
    },
    {
      label: 'search semantics',
      matched:
        /\bQueryFilter\b/.test(fileContent) ||
        /\bsearchConfig\b/.test(fileContent) ||
        /\bSearchForm\b/.test(fileContent) ||
        /\bgetSearchFields\b/.test(fileContent),
      weight: 2,
    },
    {
      label: 'stat semantics',
      matched:
        /\bStatOverviewGrid\b/.test(fileContent) ||
        /\bstatSection\b/.test(fileContent) ||
        /\bstatGrid\b/.test(fileContent),
      weight: 2,
    },
    {
      label: 'typical-page shell usage',
      matched:
        /\bProDetailPage\b/.test(fileContent) ||
        /\bProEditPage\b/.test(fileContent) ||
        /\bProListPageProvider\b/.test(fileContent) ||
        /\bStatListPageFrame\b/.test(fileContent) ||
        /\bTablePageFrame\b/.test(fileContent) ||
        /\bHostPageHeaderPortal\b/.test(fileContent) ||
        /\bTypicalPageHeaderPortal\b/.test(fileContent) ||
        /data-hiui5-region\s*=/.test(fileContent),
      weight: 3,
    },
    {
      label: 'typical-page package import',
      matched: usesTypicalPageShellPackage(fileContent),
      weight: 2,
    },
    {
      label: 'explicit drawer/page footer',
      matched: /footer=\{/.test(fileContent) || /\btableFooter\b/.test(fileContent),
      weight: 1,
    },
  ]

  signalGroups.forEach((signal) => {
    if (!signal.matched) return
    score += signal.weight
    reasons.push(signal.label)
  })

  return {
    isCandidate: score >= 4,
    reasons,
  }
}

export function inspectTypicalPageChanges(changedFiles) {
  const changedFileSet = new Set(changedFiles)
  const contracts = loadContracts()
  const managedPages = []
  const candidates = []
  const failures = []

  changedFiles
    .filter(isPageSourceFile)
    .forEach((filePath) => {
      const fileContent = readFileSafe(filePath)
      const ignoreCandidate = fileContent.includes(CANDIDATE_IGNORE_MARKER)
      const declaresAlignment = fileContent.includes(CONTRACT_MARKER)
      const contractEntry = contracts.get(filePath)
      const importsTypicalPageShellPackage = usesTypicalPageShellPackage(fileContent)
      const candidate = scoreCandidate(filePath, fileContent)
      const requiresManagedRegistration =
        importsTypicalPageShellPackage &&
        (candidate.isCandidate || declaresAlignment || Boolean(contractEntry) || looksLikeReactPageModule(fileContent))

      if (ignoreCandidate) return

      if (!candidate.isCandidate && !declaresAlignment && !contractEntry && !requiresManagedRegistration) {
        return
      }

      if (candidate.isCandidate) {
        candidates.push({ filePath, reasons: candidate.reasons })
      }

      if (declaresAlignment && !contractEntry) {
        failures.push(
          `${filePath} declares "${CONTRACT_MARKER}" but no contract exists in ${CONTRACTS_DIR}.`
        )
        return
      }

      if (!contractEntry) {
        if (requiresManagedRegistration) {
          failures.push(
            `${filePath} imports "${TYPICAL_PAGE_SHELL_PACKAGE}" but is not registered as a managed page. Any business page that imports the typical-page shell package must have a contract plus "${CONTRACT_MARKER}", or add "${CANDIDATE_IGNORE_MARKER}" with a reason if this file is not a managed typical page.`
          )
        } else {
          failures.push(
            `${filePath} looks like a new typical-page candidate (${candidate.reasons.join(
              ', '
            )}) but is not registered. Add a page contract plus "${CONTRACT_MARKER}", or add "${CANDIDATE_IGNORE_MARKER}" with a reason if this is not a typical page.`
          )
        }
        return
      }

      managedPages.push({
        filePath,
        contractEntry,
        fileContent,
        declaresAlignment,
      })

      const missingContractPaths = [contractEntry.contractJsonPath, contractEntry.contractMdPath].filter(
        (contractPath) => !changedFileSet.has(contractPath)
      )

      if (missingContractPaths.length > 0) {
        failures.push(
          `${filePath} changed without updating its contract files: ${missingContractPaths.join(
            ', '
          )}. Re-run npm run typical-page:finalize-page -- ...`
        )
      }

      if (!isFinalizedContractWorkflow(contractEntry.contract)) {
        failures.push(
          `${filePath} is registered but its contract workflow is not finalized. Re-run npm run typical-page:finalize-page -- ... so CI sees source/doctor PASS on the current page snapshot.`
        )
      } else {
        const currentSnapshot = computeManagedPageSourceSnapshot({
          generatedPagePath: filePath,
          targetRoot: process.cwd(),
        })
        const recordedSnapshotHash = String(
          contractEntry.contract?.workflow?.sourceSnapshotHash || ''
        ).trim()

        if (!recordedSnapshotHash) {
          failures.push(
            `${filePath} has a finalized contract but workflow.sourceSnapshotHash is missing. Re-run npm run typical-page:finalize-page -- ... so CI can invalidate stale finalize results after source changes.`
          )
        } else if (recordedSnapshotHash !== currentSnapshot.hash) {
          failures.push(
            `${filePath} changed after its last finalize-page result. Contract snapshot ${recordedSnapshotHash} does not match current source snapshot ${currentSnapshot.hash}. Re-run npm run typical-page:finalize-page -- ... on the latest source.`
          )
        }

        const runtimeSmokeRequired =
          String(contractEntry.contract?.pageTypeId || '').trim() === 'data-visualization' &&
          String(contractEntry.contract?.scrollStrategy || '').trim() === 'page-scroll'
        const runtimeSmokeSnapshotHash = String(
          contractEntry.contract?.workflow?.runtimeSmokeSnapshotHash || ''
        ).trim()
        const runtimeSmokeStatus = String(
          contractEntry.contract?.workflow?.runtimeSmokeStatus || ''
        ).trim()

        if (runtimeSmokeRequired) {
          if (runtimeSmokeStatus !== 'pass') {
            failures.push(
              `${filePath} requires runtime smoke on the current source snapshot, but workflow.runtimeSmokeStatus is ${runtimeSmokeStatus || '(missing)'}. Re-run npm run typical-page:runtime-smoke -- --page ${filePath} --url <dev-server-url>, then finalize again.`
            )
          } else if (!runtimeSmokeSnapshotHash) {
            failures.push(
              `${filePath} requires runtime smoke, but workflow.runtimeSmokeSnapshotHash is missing. Re-run npm run typical-page:runtime-smoke -- --page ${filePath} --url <dev-server-url> so CI can bind browser validation to the current source snapshot.`
            )
          } else if (runtimeSmokeSnapshotHash !== currentSnapshot.hash) {
            failures.push(
              `${filePath} has a stale runtime smoke result. workflow.runtimeSmokeSnapshotHash ${runtimeSmokeSnapshotHash} does not match current source snapshot ${currentSnapshot.hash}. Re-run npm run typical-page:runtime-smoke -- --page ${filePath} --url <dev-server-url>, then finalize again.`
            )
          }
        }
      }
    })

  return {
    contracts,
    candidates,
    managedPages,
    failures,
  }
}
