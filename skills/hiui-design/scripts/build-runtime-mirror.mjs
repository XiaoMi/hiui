#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assertTargetRequirements,
  getDistributionTarget,
  readDistributionManifest,
  selectFilesForTarget,
  walkFiles,
} from './lib/distribution-manifest.mjs'

function parseArgs(argv) {
  const options = {
    json: false,
    output: '',
    root: '',
    target: 'runtime-mirror',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--output') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --output')
      options.output = value
      index += 1
      continue
    }

    if (arg === '--root') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --root')
      options.root = value
      index += 1
      continue
    }

    if (arg === '--target') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target')
      options.target = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      console.log('Usage: node scripts/build-runtime-mirror.mjs --output <dir> [--target runtime-mirror|team-package|open-source-package] [--root <skill-root>] [--json]')
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.output) {
    throw new Error('Missing required --output <dir>')
  }

  return options
}

async function copyFilePreservingPath(sourceRoot, outputRoot, relativePath) {
  const sourcePath = path.join(sourceRoot, relativePath)
  const outputPath = path.join(outputRoot, relativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.copyFile(sourcePath, outputPath)
}

function buildOpenSourcePreviewReadyScript() {
  return `#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

function printUsage() {
  console.log(\`Usage:
  node scripts/typical-page-preview-ready.mjs --contract-fixture quality-pass

The open-source package keeps only the stable fixture-backed JSON contract for preview-ready.
Usage collection and network reporting are intentionally excluded.
\`)
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    return
  }

  const fixtureIndex = args.indexOf('--contract-fixture')
  const fixture = fixtureIndex >= 0 ? args[fixtureIndex + 1] : ''
  if (fixture !== 'quality-pass') {
    console.error('The open-source package supports typical-page-preview-ready only with --contract-fixture quality-pass.')
    process.exit(2)
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const fixturePath = path.join(scriptDir, 'tests', 'fixtures', 'public-cli', 'preview-ready.quality-pass.json')
  const raw = await fs.readFile(fixturePath, 'utf8')
  process.stdout.write(raw.endsWith('\\n') ? raw : \`\${raw}\\n\`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(\`typical-page-preview-ready failed: \${message}\`)
  process.exit(1)
})
`
}

function sanitizeOpenSourceText(rawText, relativePath) {
  let text = rawText

  text = text.replace(
    /usage stats 是企业内部版的 after-hook：可按 `docs\/onboarding\/usage-stats\.md` 采集最小必要使用数据；开源版不得采集，必须按 `PRIVACY\.md` 关闭或标记为不适用。/g,
    'usage stats 在开源版不得采集；必须按 `PRIVACY.md` 关闭或标记为不适用。企业内部版的采集规则不属于开源包。',
  )
  text = text.replace(
    /usage stats 是企业内部版 after-hook，唯一真相是 `docs\/onboarding\/usage-stats\.md`。标准 \/ 严格链路页面生成完成且可渲染后按文档收口；快速链路若只做槽位型典型页预览，可跳过或延后，不阻断最终回复。统计失败不能推翻页面交付，但必须在最终回复中单独呈现状态。开源版唯一真相是 `PRIVACY\.md`：不得采集 usage data，最终报告只能呈现 `not_applicable`、`skipped` 或 `unavailable`。/g,
    'usage stats 在开源版的唯一真相是 `PRIVACY.md`：不得采集 usage data，最终报告只能呈现 `not_applicable`、`skipped` 或 `unavailable`。企业内部版如需采集，应在内部包中使用专用文档和后端脚本。',
  )
  text = text.replace(/- usage stats：`docs\/onboarding\/usage-stats\.md`/g, '- usage stats：`PRIVACY.md`')
  text = text.replace(/`\.\.\/docs\/onboarding\/usage-stats\.md`/g, '`PRIVACY.md`')
  text = text.replace(/`docs\/onboarding\/usage-stats\.md`/g, '`PRIVACY.md`')
  text = text.replace(/`\.\.\/onboarding\/usage-stats\.md`/g, '`PRIVACY.md`')
  text = text.replace(/`\.\.\/docs\/onboarding\/usage-stats-contract\.md`/g, '`PRIVACY.md`')
  text = text.replace(/`docs\/onboarding\/usage-stats-contract\.md`/g, '`PRIVACY.md`')
  text = text.replace(/`\.\.\/onboarding\/usage-stats-contract\.md`/g, '`PRIVACY.md`')
  text = text.replace(/\[usage-stats\.md\]\(\.\.\/onboarding\/usage-stats\.md\)/g, '[PRIVACY.md](../../PRIVACY.md)')
  text = text.replace(/\.\.\/docs\/onboarding\/usage-stats-contract\.md/g, 'PRIVACY.md')
  text = text.replace(/\.\.\/docs\/onboarding\/usage-stats\.md/g, 'PRIVACY.md')
  text = text.replace(/\.\.\/onboarding\/usage-stats-contract\.md/g, 'PRIVACY.md')
  text = text.replace(/\.\.\/onboarding\/usage-stats\.md/g, 'PRIVACY.md')
  text = text.replace(/docs\/onboarding\/usage-stats-contract\.md/g, 'PRIVACY.md')
  text = text.replace(/docs\/onboarding\/usage-stats\.md/g, 'PRIVACY.md')

  if (relativePath === 'README.md') {
    text = text.replace(
      /# hiui-design\n/,
      '# hiui-design-skill\n\nThis is a sanitized public-edition package generated from the internal `hiui-design` Codex skill.\n\n',
    )
  }

  if (relativePath === 'scripts/README.md') {
    text = [
      '# HiUI Design Scripts',
      '',
      'This public package exposes only the machine-public CLI surface needed by page tasks. Maintainer-only publishing, internal usage backends, release archive, and private sync scripts are excluded from the open-source package.',
      '',
      '## Usage / Privacy Boundary',
      '',
      '- Open-source packages must not collect usage data by default.',
      '- `PRIVACY.md` is the only privacy source of truth in this package.',
      '- If a downstream project adds telemetry, it must be opt-in, documented, and disabled by default.',
      '',
      '## Machine Public CLI',
      '',
      'The stable machine-readable contract surface is listed in `scripts/public-cli-contracts.json` under the `machine-public` tier. Use these commands through the planned `requiredActions` from `plan-page-task`; do not invoke private maintenance flows from this package.',
      '',
      '- `plan-page-task.mjs` creates `page-task-plan.v1` before a page task reads detailed rules.',
      '- `typical-page-capabilities.mjs`, `typical-page-list-assets.mjs`, and `typical-page-inspect-asset.mjs` expose project and asset facts.',
      '- `typical-page-add-asset.mjs`, `typical-page-diff-asset.mjs`, and `typical-page-update-asset.mjs` provide dry-run asset previews.',
      '- `typical-page-start-page.mjs`, `typical-page-preflight.mjs`, `typical-page-runtime-smoke.mjs`, and `render-final-report.mjs` cover the standard generation and validation loop.',
      '',
      '## Human Entry Points',
      '',
      '- Start with `SKILL.md` for task routing and guardrails.',
      '- Use `README.md` for package scope and setup context.',
      '- Use `PRIVACY.md` for usage-data behavior in this public package.',
      '',
    ].filter(Boolean).join('\n')
  }

  if (relativePath === 'scripts/lib/reusable-script-entries.mjs') {
    text = text.replace(
      /\n\s*'typical-page:report-preview-ready':\n\s*`node "\.local-context\/hiui-design\/scripts\/report-preview-ready-usage\.mjs"\$\{lineSuffix\}`,/g,
      '',
    )
  }

  return text
}

async function copyFileForTarget(sourceRoot, outputRoot, relativePath, targetName) {
  const sourcePath = path.join(sourceRoot, relativePath)
  const outputPath = path.join(outputRoot, relativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  if (targetName === 'open-source-package' && /\.(?:css|html|js|json|jsx|md|mjs|ts|tsx|txt|ya?ml)$/i.test(relativePath)) {
    if (relativePath === 'scripts/typical-page-preview-ready.mjs') {
      await fs.writeFile(outputPath, buildOpenSourcePreviewReadyScript(), 'utf8')
      return
    }

    const rawText = await fs.readFile(sourcePath, 'utf8')
    await fs.writeFile(outputPath, sanitizeOpenSourceText(rawText, relativePath), 'utf8')
    return
  }

  await fs.copyFile(sourcePath, outputPath)
}

async function writeGeneratedMarker(outputRoot, report) {
  const marker = [
    '# Generated Do Not Edit',
    '',
    'This directory is generated from the hiui-design maintainer source by `scripts/build-runtime-mirror.mjs`.',
    '',
    `- target: ${report.target}`,
    `- manifestVersion: ${report.manifestVersion}`,
    `- files: ${report.files}`,
    '',
    'Make changes in the maintainer source, then regenerate this target.',
    '',
  ].join('\n')
  await fs.writeFile(path.join(outputRoot, 'GENERATED_DO_NOT_EDIT.md'), marker, 'utf8')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(options.root || path.join(scriptDir, '..'))
  const outputRoot = path.resolve(options.output)
  const manifest = await readDistributionManifest(path.join(root, 'distribution-manifest.json'))
  const target = getDistributionTarget(manifest, options.target)
  const files = await walkFiles(root)
  const selectedFiles = selectFilesForTarget(files, target)

  await assertTargetRequirements(root, options.target, target, selectedFiles)
  await fs.rm(outputRoot, { force: true, recursive: true })
  await fs.mkdir(outputRoot, { recursive: true })

  for (const relativePath of selectedFiles) {
    await copyFileForTarget(root, outputRoot, relativePath, options.target)
  }

  const report = {
    status: 'passed',
    target: options.target,
    source: root,
    output: outputRoot,
    manifestVersion: manifest.version,
    files: selectedFiles.length,
  }
  await writeGeneratedMarker(outputRoot, report)

  if (options.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`Built ${options.target}: ${outputRoot}`)
    console.log(`- files: ${selectedFiles.length}`)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`build-runtime-mirror failed: ${message}`)
  process.exit(1)
})
