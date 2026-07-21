import fs from 'fs'
import path from 'path'
import {
  PAGEGEN_ROOT,
  REPO_ROOT,
  assertStandardPagegenAllowed,
  ensureDir,
  relativeToRoot,
  writeJson,
} from './shared.mjs'

const requiredRuntimeFiles = [
  'src/hiui-pagegen/host/types.ts',
  'src/hiui-pagegen/host/host-config.ts',
  'src/hiui-pagegen/host/HostAdapterProvider.tsx',
  'src/hiui-pagegen/host/useHostAdapter.ts',
  'src/hiui-pagegen/runtime-entry/OfficialRuntimeEntryPage.tsx',
  'src/hiui-pagegen/runtime-entry/OfficialRuntimeEntryPage.module.scss',
  'src/hiui-pagegen/runtime-entry/official-runtime-config.ts',
]

function toPascalCase(pageType) {
  return String(pageType)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

function collectRequiredProjectFiles() {
  const requiredProjectFiles = [...requiredRuntimeFiles]
  const canonicalAssetsRoot = path.resolve(PAGEGEN_ROOT, 'page-assets')

  if (!fs.existsSync(canonicalAssetsRoot)) {
    return requiredProjectFiles
  }

  const pageTypes = fs
    .readdirSync(canonicalAssetsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b))

  pageTypes.forEach((pageType) => {
    const pageName = `Canonical${toPascalCase(pageType)}Page`
    requiredProjectFiles.push(
      `src/hiui-pagegen/canonical/${pageType}/${pageName}.tsx`,
      `src/hiui-pagegen/canonical/${pageType}/${pageName}.module.scss`
    )
  })

  return requiredProjectFiles
}

function main() {
  assertStandardPagegenAllowed('typical-page:init')
  const outputsDir = path.resolve(PAGEGEN_ROOT, 'outputs')
  ensureDir(outputsDir)
  const requiredProjectFiles = collectRequiredProjectFiles()

  const fileChecks = requiredProjectFiles.map((file) => {
    const absolutePath = path.resolve(REPO_ROOT, file)
    return {
      file,
      exists: fs.existsSync(absolutePath),
    }
  })

  const missingFiles = fileChecks.filter((item) => !item.exists).map((item) => item.file)
  if (missingFiles.length > 0) {
    throw new Error(
      `hiui-pagegen 初始化失败，缺少页面生成骨架文件：${missingFiles.join(
        ', '
      )}。请重新执行 bootstrap-target-project.mjs 或 setup-for-designers.mjs 补齐基线。`
    )
  }

  const summary = {
    initializedAt: new Date().toISOString(),
    projectRoot: REPO_ROOT,
    hostFiles: fileChecks,
    status: 'ready',
    message: 'hiui-pagegen HostAdapter 接入已就绪，可开始生成典型页原型。',
  }

  const summaryPath = path.resolve(outputsDir, 'project-init-state.json')
  writeJson(summaryPath, summary)

  console.log(`hiui-pagegen init ready: ${relativeToRoot(summaryPath)}`)
}

main()
