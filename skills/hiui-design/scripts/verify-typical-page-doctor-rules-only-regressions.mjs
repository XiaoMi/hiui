#!/usr/bin/env node

import assert from 'node:assert'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { syncManagedPageRegistry } from './lib/managed-page-artifacts.mjs'
import { renderManagedPageSourceContractSnippet } from './lib/managed-page-source-guard.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import {
  buildRulesOnlyPageContract,
  findArchetypeSmokeBaselineEntry,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  getRulesOnlyPageContractsDir,
  toContractSlug,
} from './lib/rules-only-page-contracts.mjs'

const currentFilePath = fileURLToPath(import.meta.url)
const scriptDir = path.dirname(currentFilePath)
const skillRoot = path.resolve(scriptDir, '..')
const doctorScriptPath = path.join(scriptDir, 'typical-page-doctor.mjs')
const ORDER_EDITOR_PAGE_PATH = path.join('src', 'pages', 'hiui-rule-lab', 'order-editor.jsx')
const ORDER_EDITOR_HOST_ARCHETYPE_PATH = path.join(
  'src',
  'typical-page-reuse',
  'archetypes',
  'table-basic',
  'order-editor-host.jsx'
)

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function removeTree(targetPath) {
  if (!(await pathExists(targetPath))) {
    return
  }

  const stat = await fs.lstat(targetPath)
  if (!stat.isDirectory()) {
    await fs.unlink(targetPath)
    return
  }

  const entries = await fs.readdir(targetPath)
  for (const entry of entries) {
    await removeTree(path.join(targetPath, entry))
  }
  await fs.rmdir(targetPath)
}

async function writeBaseHostIntegrationFixture(tempRoot) {
  await ensureDir(path.join(tempRoot, 'src'))
  await fs.writeFile(
    path.join(tempRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'doctor-rules-only-regression-fixture',
        private: true,
        version: '0.0.0',
      },
      null,
      2
    )}\n`,
    'utf8'
  )
  await fs.writeFile(
    path.join(tempRoot, 'src', 'main.jsx'),
    "export default function FixtureEntry() { return null }\n",
    'utf8'
  )
}

function indentSnippet(snippet, indent = '    ') {
  return String(snippet || '')
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n')
}

async function loadFixturePageType() {
  const { manifest } = await loadPageTypeManifest({ skillRoot })
  const pageType = manifest.pageTypes.find((item) => item.id === 'table-basic')
  assert(pageType, 'Expected table-basic page type in the packaged manifest.')
  return pageType
}

async function loadBaselineSpec() {
  const baselineSpecPath = path.join(skillRoot, 'docs', 'validation', 'archetype-smoke-baselines.json')
  return JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
}

async function writeManagedArtifactFixture(tempRoot) {
  await writeBaseHostIntegrationFixture(tempRoot)

  const pageType = await loadFixturePageType()
  const baselineSpec = await loadBaselineSpec()
  const contract = buildRulesOnlyPageContract({
    pageType,
    archetypeSmokeBaseline: findArchetypeSmokeBaselineEntry(baselineSpec, pageType.id),
    generatedPagePath: ORDER_EDITOR_PAGE_PATH,
    hostArchetypePath: ORDER_EDITOR_HOST_ARCHETYPE_PATH,
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: getRequiredOwnershipRolesForPageType(pageType.id).map((role) => ({
      role,
      target: `fixture ${role}`,
    })),
    regionMapping: getRequiredRegionsForPageType(pageType.id).map((region) => ({
      region,
      target: `fixture ${region}`,
    })),
  })

  const sourcePath = path.join(tempRoot, ORDER_EDITOR_PAGE_PATH)
  const sourceSnippet = renderManagedPageSourceContractSnippet(contract)
  const source = `export default function ManagedFixtureOrderEditor() {
  return (
${indentSnippet(sourceSnippet)}
  )
}
`

  await ensureDir(path.dirname(sourcePath))
  await fs.writeFile(sourcePath, source, 'utf8')

  const contractsDir = getRulesOnlyPageContractsDir(tempRoot)
  const contractSlug =
    toContractSlug(ORDER_EDITOR_PAGE_PATH.replace(/\.[cm]?[jt]sx?$/, '')) || 'order-editor'
  await ensureDir(contractsDir)
  await fs.writeFile(
    path.join(contractsDir, `${contractSlug}.json`),
    `${JSON.stringify(contract, null, 2)}\n`,
    'utf8'
  )

  await syncManagedPageRegistry(tempRoot)
}

async function writeHostRouteMenuFixture(tempRoot, variant) {
  await writeBaseHostIntegrationFixture(tempRoot)

  await ensureDir(path.join(tempRoot, 'src', 'typical-page-reuse', 'routes'))
  await fs.writeFile(
    path.join(tempRoot, 'src', 'typical-page-reuse', 'routes', 'config.tsx'),
    `export default [
  {
    title: '表格',
    path: 'table',
    children: [
      {
        title: '基础表格',
        path: 'common/basic',
        element: null,
      },
    ],
  },
]
`,
    'utf8'
  )

  const badAppSource = `import { Navigate, useRoutes } from 'react-router-dom'
import { AppStoreFilled } from '@hi-ui/icons'
import { TypicalPageAppFrame } from './typical-page-reuse/app-frame'
import typicalPageReuseRoutes from './typical-page-reuse/routes/config'

const appRoutes = [
  {
    path: '/',
    element: <Navigate to="/table/common/basic" replace />,
  },
  {
    title: '示例',
    icon: <AppStoreFilled />,
    children: typicalPageReuseRoutes,
  },
]

export default function App() {
  const element = useRoutes(appRoutes)
  return <TypicalPageAppFrame routes={typicalPageReuseRoutes}>{element}</TypicalPageAppFrame>
}
`

  const goodAppSource = `import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppStoreFilled } from '@hi-ui/icons'
import { TypicalPageAppFrame } from './typical-page-reuse/app-frame'
import typicalPageReuseRoutes from './typical-page-reuse/routes/config'

const typicalPageGalleryRoute = {
  title: '示例',
  path: 'examples',
  icon: <AppStoreFilled />,
  element: <Outlet />,
  children: typicalPageReuseRoutes,
}

const appRoutes = [
  {
    path: '/',
    element: <Navigate to="/examples/table/common/basic" replace />,
  },
  typicalPageGalleryRoute,
]

export default function App() {
  const element = useRoutes(appRoutes)
  return <TypicalPageAppFrame routes={[typicalPageGalleryRoute]}>{element}</TypicalPageAppFrame>
}
`

  await fs.writeFile(
    path.join(tempRoot, 'src', 'App.jsx'),
    variant === 'bad' ? badAppSource : goodAppSource,
    'utf8'
  )
}

async function writeTopLevelMenuIconFixture(tempRoot, variant) {
  await writeBaseHostIntegrationFixture(tempRoot)

  const sharedRouteChildren = `[
      {
        title: '列表',
        path: 'list',
        element: null,
      },
    ]`

  const badAppSource = `import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppStoreFilled } from '@hi-ui/icons'
import { TypicalPageAppFrame } from './typical-page-reuse/app-frame'

const businessRoutes = {
  title: '业务',
  path: 'business',
  icon: <AppStoreFilled />,
  element: <Outlet />,
  children: ${sharedRouteChildren},
}

const projectRoutes = {
  title: '项目',
  path: 'projects',
  icon: <AppStoreFilled />,
  element: <Outlet />,
  children: ${sharedRouteChildren},
}

const typicalPageGalleryRoute = {
  title: '示例',
  path: 'examples',
  icon: <AppStoreFilled />,
  element: <Outlet />,
  children: ${sharedRouteChildren},
}

const appRoutes = [
  {
    path: '/',
    element: <Navigate to="/business/list" replace />,
  },
  businessRoutes,
  projectRoutes,
  typicalPageGalleryRoute,
]

export default function App() {
  const element = useRoutes(appRoutes)
  return <TypicalPageAppFrame routes={appRoutes}>{element}</TypicalPageAppFrame>
}
`

  const goodAppSource = `import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppStoreFilled, BusinessCardFilled, FolderOpenFilled } from '@hi-ui/icons'
import { TypicalPageAppFrame } from './typical-page-reuse/app-frame'

const businessRoutes = {
  title: '业务',
  path: 'business',
  icon: <BusinessCardFilled />,
  element: <Outlet />,
  children: ${sharedRouteChildren},
}

const projectRoutes = {
  title: '项目',
  path: 'projects',
  icon: <FolderOpenFilled />,
  element: <Outlet />,
  children: ${sharedRouteChildren},
}

const typicalPageGalleryRoute = {
  title: '示例',
  path: 'examples',
  icon: <AppStoreFilled />,
  element: <Outlet />,
  children: ${sharedRouteChildren},
}

const appRoutes = [
  {
    path: '/',
    element: <Navigate to="/business/list" replace />,
  },
  businessRoutes,
  projectRoutes,
  typicalPageGalleryRoute,
]

export default function App() {
  const element = useRoutes(appRoutes)
  return <TypicalPageAppFrame routes={appRoutes}>{element}</TypicalPageAppFrame>
}
`

  await fs.writeFile(
    path.join(tempRoot, 'src', 'App.jsx'),
    variant === 'bad' ? badAppSource : goodAppSource,
    'utf8'
  )
}

function runDoctorJson(targetRoot) {
  const result = spawnSync(
    process.execPath,
    [doctorScriptPath, '--target', targetRoot, '--mode', 'host-integration', '--json'],
    {
      cwd: skillRoot,
      encoding: 'utf8',
      env: process.env,
    }
  )

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(
      `typical-page-doctor exited with code ${result.status}.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    )
  }

  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse doctor JSON output: ${detail}\nstdout:\n${result.stdout}`)
  }
}

function getCheck(payload, id) {
  return payload.checks.find((item) => item.id === id) || null
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hiui-doctor-rules-only-'))
  const noArtifactsRoot = path.join(tempRoot, 'host-no-artifacts')
  const managedArtifactsRoot = path.join(tempRoot, 'host-with-managed-artifacts')
  const badRouteMenuRoot = path.join(tempRoot, 'host-bad-route-menu')
  const goodRouteMenuRoot = path.join(tempRoot, 'host-good-route-menu')
  const badIconSemanticRoot = path.join(tempRoot, 'host-bad-icon-semantics')
  const goodIconSemanticRoot = path.join(tempRoot, 'host-good-icon-semantics')

  try {
    await writeBaseHostIntegrationFixture(noArtifactsRoot)
    await writeManagedArtifactFixture(managedArtifactsRoot)
    await writeHostRouteMenuFixture(badRouteMenuRoot, 'bad')
    await writeHostRouteMenuFixture(goodRouteMenuRoot, 'good')
    await writeTopLevelMenuIconFixture(badIconSemanticRoot, 'bad')
    await writeTopLevelMenuIconFixture(goodIconSemanticRoot, 'good')

    const noArtifactsPayload = runDoctorJson(noArtifactsRoot)
    const noArtifactsCheckIds = new Set(noArtifactsPayload.checks.map((item) => item.id))
    assert(!noArtifactsCheckIds.has('rules-only-page-contracts'))
    assert(!noArtifactsCheckIds.has('rules-only-managed-source-guard'))

    const managedArtifactsPayload = runDoctorJson(managedArtifactsRoot)
    const requiredCheckIds = [
      'rules-only-page-contracts',
      'rules-only-managed-page-coverage',
      'rules-only-managed-page-registry',
      'rules-only-managed-source-guard',
      'rules-only-runtime-smoke-closure',
    ]

    for (const checkId of requiredCheckIds) {
      assert(
        getCheck(managedArtifactsPayload, checkId),
        `Expected doctor to emit ${checkId} when host-integration contains rules-only managed page artifacts.`
      )
    }

    const contractsCheck = getCheck(managedArtifactsPayload, 'rules-only-page-contracts')
    assert(contractsCheck)
    assert.match(contractsCheck.summary, /rules-only managed page contracts/)

    const sourceGuardCheck = getCheck(managedArtifactsPayload, 'rules-only-managed-source-guard')
    assert(sourceGuardCheck)
    assert.match(sourceGuardCheck.summary, /rules-only managed pages/)

    const badRouteMenuPayload = runDoctorJson(badRouteMenuRoot)
    const badRouteMenuCheck = getCheck(
      badRouteMenuPayload,
      'host-route-menu-source-of-truth'
    )
    assert(badRouteMenuCheck, 'Expected doctor to emit host-route-menu-source-of-truth.')
    assert.equal(
      badRouteMenuCheck.ok,
      false,
      'Expected doctor to fail when TypicalPageAppFrame receives bare typicalPageReuseRoutes.'
    )
    assert.match(badRouteMenuCheck.detail, /bare typicalPageReuseRoutes/)

    const goodRouteMenuPayload = runDoctorJson(goodRouteMenuRoot)
    const goodRouteMenuCheck = getCheck(
      goodRouteMenuPayload,
      'host-route-menu-source-of-truth'
    )
    assert(goodRouteMenuCheck, 'Expected doctor to emit host-route-menu-source-of-truth.')
    assert.equal(
      goodRouteMenuCheck.ok,
      true,
      'Expected doctor to pass when useRoutes and TypicalPageAppFrame share typicalPageGalleryRoute.'
    )

    const badIconSemanticPayload = runDoctorJson(badIconSemanticRoot)
    const badIconSemanticCheck = getCheck(
      badIconSemanticPayload,
      'top-level-menu-icon-semantics'
    )
    assert(badIconSemanticCheck, 'Expected doctor to emit top-level-menu-icon-semantics.')
    assert.equal(
      badIconSemanticCheck.ok,
      false,
      'Expected doctor to fail when business/project/gallery groups reuse AppStoreFilled.'
    )
    assert.match(badIconSemanticCheck.detail, /业务 uses AppStoreFilled/)
    assert.match(badIconSemanticCheck.detail, /业务 \/ 项目 \/ 示例 share AppStoreFilled/)

    const goodIconSemanticPayload = runDoctorJson(goodIconSemanticRoot)
    const goodIconSemanticCheck = getCheck(
      goodIconSemanticPayload,
      'top-level-menu-icon-semantics'
    )
    assert(goodIconSemanticCheck, 'Expected doctor to emit top-level-menu-icon-semantics.')
    assert.equal(
      goodIconSemanticCheck.ok,
      true,
      'Expected doctor to pass when first-level route groups use distinct semantic Filled icons.'
    )

    console.log('[verify-typical-page-doctor-rules-only-regressions] PASS')
    console.log('- host-integration without managed artifacts does not emit rules-only doctor checks')
    console.log('- host-integration with managed page artifacts emits rules-only doctor checks before finalize-time gates')
    console.log('- host-integration doctor rejects bare TypicalPageAppFrame typicalPageReuseRoutes menus')
    console.log('- host-integration doctor accepts shared top-level 示例 gallery route menus')
    console.log('- host-integration doctor rejects duplicated first-level AppStoreFilled placeholders')
    console.log('- host-integration doctor accepts distinct semantic first-level Filled icons')
  } finally {
    await removeTree(tempRoot)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[verify-typical-page-doctor-rules-only-regressions] ${message}`)
  process.exit(1)
})
