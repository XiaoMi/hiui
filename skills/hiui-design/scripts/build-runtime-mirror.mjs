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
      console.log('Usage: node scripts/build-runtime-mirror.mjs --output <dir> [--target runtime-mirror|team-package|open-source-package|open-source-dev-bundle] [--root <skill-root>] [--json]')
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
  text = text.replace(
    /(?<!\.local-context\/hiui-design\/)reference\/host-integration\/src\//g,
    'examples/host-integration/src/',
  )
  text = text.replace(
    /(?<!\.local-context\/hiui-design\/)reference\/host-integration\//g,
    'examples/host-integration/',
  )

  if (relativePath === 'SKILL.md') {
    text = text.replace(
      '对象模型与字段分级：`references/core-object-model.md`',
      '对象模型与字段分级以 `rules/contract-regions.md`、`rules/page-task-lifecycle.md` 与 `scripts/public-cli-contracts.json` 为准。'
    )
    text = text.replace(
      '标准生成协议与页型 recipe：`references/standard-generation-protocol.md`',
      '标准生成协议与页型约束以 `rules/generation-rules.md`、`docs/generation/page-level-components.md` 与 `docs/validation/generation-recipe-forward-tests.md` 为准。'
    )
    text = text.replace(
      '生成门禁细节：`references/generation-gates.md`',
      '生成门禁细节：`rules/generation-rules.md` 与 `rules/page-governance.md`。'
    )
    text = text.replace(
      '交付门禁细节：`references/delivery-gates.md`',
      '交付门禁细节：`rules/page-governance.md` 与 `rules/validation-checklist.md`。'
    )
  }

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

function sanitizeTeamPackageText(rawText, relativePath) {
  if (relativePath === 'distribution-manifest.json') {
    const manifest = JSON.parse(rawText)
    const target = { ...manifest.targets['team-package'] }
    target.description =
      'Team-facing package for installing hiui-design into target projects. Excludes upstream release publishing, runtime usage backends, and global sync daemons.'
    target.exclude = target.exclude.filter(
      (entry) => !/maintainer|distribution-addresses|distribution-governance|build-runtime-mirror|check-distribution-boundary|validate-distribution-manifest/i.test(entry),
    )
    return `${JSON.stringify(
      {
        version: manifest.version,
        targets: {
          'team-package': target,
        },
      },
      null,
      2,
    )}\n`
  }

  if (relativePath === 'scripts/public-cli-contracts.json') {
    const manifest = JSON.parse(rawText)
    if (manifest.tiers && typeof manifest.tiers === 'object') {
      delete manifest.tiers['maintainer-only']
    }
    return `${JSON.stringify(manifest, null, 2)}\n`
  }

  if (relativePath === 'README.md') {
    return [
      '# hiui-design',
      '',
      'This package is the internal team delivery view for installing `hiui-design` into target projects.',
      '',
      'Start here:',
      '',
      '- `SKILL.md` for task routing, guardrails, and the source-of-truth index.',
      '- `docs/onboarding/install-and-host.md` for project installation and host integration.',
      '- `scripts/public-cli-contracts.json` for shipped machine-public CLI entry points.',
      '- `scripts/README.md` for the scripts that are actually shipped in this package.',
      '',
      'Consumer note:',
      '',
      '- Use this package directly as the internal team distribution view.',
      '- Only use scripts that are actually present under `scripts/` in the package you downloaded.',
      '- Upstream build and release governance details are intentionally omitted from this distribution view.',
      '',
    ].join('\n')
  }

  if (relativePath === 'docs/README.md') {
    return [
      '# hiui-design Docs',
      '',
      '`docs/` is the explanation layer for the shipped team package, not the default decision layer.',
      '',
      'Start with [`../rules/QUICK-START.md`](../rules/QUICK-START.md), then open `docs/` only when you need installation help, page-type explanations, or troubleshooting details.',
      '',
      '- AI should default to `../rules/`.',
      '- Humans should read `docs/` only after they know which task or page type they are working on.',
      '- If `docs/` conflicts with `rules/`, follow `rules/`.',
      '',
      '## Entry Points',
      '',
      '- `onboarding/`',
      '  Installation, host integration, and troubleshooting for team consumers.',
      '- `generation/`',
      '  Page-type explanations, shared generation guidance, and visual baselines.',
      '- `archetypes/`',
      '  Archetype and adapter contract explanations. Machine facts remain in `../archetypes/`.',
      '- `validation/`',
      '  Acceptance checklists and manual review guidance.',
      '- `business-lines/`',
      '  Business-line overlays when present.',
      '',
      '## Recommended Reading Order',
      '',
      '1. `../rules/mode-selection.md`',
      '2. `../rules/page-type-map.md`',
      '3. `../rules/generation-rules.md`',
      '4. `onboarding/install-and-host.md`',
      '5. `onboarding/host-profiles.md`',
      '6. `generation/figma-page-rules.md`',
      '7. `generation/non-typical-pages.md`',
      '8. `generation/non-typical-component-routing.md`',
      '9. `generation/hiui-v5-component-map.md`',
      '10. `generation/figma-pages/README.md`',
      '11. `validation/checklist.md`',
      '',
    ].join('\n')
  }

  if (relativePath === 'scripts/README.md') {
    return [
      '# Script Index',
      '',
      '`scripts/` is the execution layer shipped to team consumers.',
      '',
      '- Use the current package as-is; only rely on script files that are actually present under `scripts/`.',
      '- `scripts/public-cli-contracts.json` is the machine-readable contract surface for public CLI entry points.',
      '- `rules/` remains the default decision layer; scripts turn those rules into setup, apply, doctor, contract, and validation actions.',
      '',
      '## What Is Included Here',
      '',
      '- Project setup and host-integration scripts needed by downstream teams.',
      '- Page generation and validation scripts that are part of the shipped workflow.',
      '- Public CLI metadata and runtime helpers required by those shipped scripts.',
      '',
      '## What Is Not Included Here',
      '',
      '- Upstream release publishing workflows.',
      '- Global sync daemons and upstream-only distribution tooling.',
      '- Private usage backends, release credentials, or internal release automation.',
      '',
      '## Human Entry Points',
      '',
      '- Start with `SKILL.md` for task routing and guardrails.',
      '- Use `README.md` for package scope and installation context.',
      '- Use `docs/onboarding/install-and-host.md` for host integration details.',
      '',
    ].join('\n')
  }

  if (relativePath === 'scripts/lib/reusable-script-entries.mjs') {
    return rawText.replace(
      /\n\s*'typical-page:maintainer:self-check':\n\s*`node "\.local-context\/hiui-design\/scripts\/verify-typical-page-maintainer-regressions\.mjs"\$\{lineSuffix\}`,/g,
      '',
    )
  }

  if (relativePath === 'scripts/typical-page-doctor.mjs') {
    return rawText
      .replace(/maintainerSelfCheckScript/g, 'distributionSelfCheckScript')
      .replace(/typical-page:maintainer:self-check/g, 'typical-page:distribution:self-check')
      .replace(/maintainer-self-check-script/g, 'distribution-self-check-script')
      .replace(/bundled maintainer regression coverage/g, 'bundled distribution regression coverage')
      .replace(/packaged maintainer regression bundle entry/g, 'packaged distribution regression bundle entry')
  }

  if (relativePath === 'scripts/plan-page-task.mjs' || relativePath === 'scripts/tests/fixtures/public-cli/plan-page-task.table-stat.json') {
    return rawText.replace(
      /before final response after the fast-path page reaches preview_ready; maintainer\/internal builds must still close usage stats for newly generated pages/g,
      'before final response after the fast-path page reaches preview_ready; formal release builds must still close usage stats for newly generated pages',
    )
  }

  if (relativePath === 'rules/VERSION') {
    return rawText
      .replace(
        /^  - split maintainer runtime .*$/m,
        '  - split upstream runtime out of skill-root outputs into the dedicated runtime home, with an explicit override point for local machines',
      )
      .replace(
        /^  - reorganized scripts\/lib into shared, public, and maintainer layers .*$/m,
        '  - reorganized scripts/lib into shared, public, and upstream-distribution layers while keeping root-level shim exports for compatibility',
      )
      .replace(
        /^  - added maintainer-side qualification checks .*$/m,
        '  - added release-pipeline qualification checks so incomplete or version-stale local skill mirrors are rejected before they can become the machine-level source',
      )
      .replace(
        /^  - extended maintainer regression coverage .*$/m,
        '  - extended distribution regression coverage to include script-layer boundary checks, router contract drift, generated-doc drift, and usage-runtime state recovery',
      )
      .replace(
        /^  - clarified host-integration apply\/setup behavior .*$/m,
        '  - clarified host-integration apply/setup behavior so browser reuse and preview opening are explicit, and aligned onboarding docs with the upstream runtime/log paths',
      )
  }

  if (relativePath === 'references/delivery-gates.md' || relativePath === 'docs/validation/generation-recipe-forward-tests.md') {
    return rawText.replace(/\bmaintainers\b/g, 'skill owners')
  }

  if (relativePath === 'references/core-object-model.md') {
    return rawText.replace(/maintainers and the `hiui-design` skill maintainers/g, 'owners and the `hiui-design` skill owners')
  }

  return rawText
}

function shouldSanitizeTextForTarget(relativePath) {
  return /\.(?:css|html|js|json|jsx|md|mjs|ts|tsx|txt|ya?ml)$/i.test(relativePath) || relativePath === 'rules/VERSION'
}

async function copyFileForTarget(sourceRoot, outputRoot, relativePath, targetName) {
  const sourcePath = path.join(sourceRoot, relativePath)
  const outputPath = path.join(outputRoot, relativePath)
  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  if (targetName === 'team-package' && shouldSanitizeTextForTarget(relativePath)) {
    const rawText = await fs.readFile(sourcePath, 'utf8')
    await fs.writeFile(outputPath, sanitizeTeamPackageText(rawText, relativePath), 'utf8')
    return
  }

  if ((targetName === 'open-source-package' || targetName === 'open-source-dev-bundle') && shouldSanitizeTextForTarget(relativePath)) {
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
  const roleGuidance =
    report.target === 'team-package'
      ? [
          'This snapshot is the internal team-facing distribution view.',
          'This package intentionally keeps only the shipped team-facing files and excludes upstream release-governance details.',
          '',
        ]
      : []
  const generationLead =
    report.target === 'team-package'
      ? 'This directory is generated by `scripts/build-runtime-mirror.mjs` for internal team delivery.'
      : report.target === 'open-source-dev-bundle'
        ? 'This directory is generated by `scripts/build-runtime-mirror.mjs` as the local public-developer bundle.'
        : 'This directory is generated from the hiui-design maintainer source by `scripts/build-runtime-mirror.mjs`.'
  const nextStep =
    report.target === 'team-package'
      ? 'Do not edit this snapshot directly. Update the upstream source and regenerate the team package.'
      : report.target === 'open-source-dev-bundle'
        ? 'Do not edit this snapshot directly. Update the maintainer source and regenerate the developer bundle.'
      : 'Make changes in the maintainer source, then regenerate this target.'
  const marker = [
    '# Generated Do Not Edit',
    '',
    generationLead,
    '',
    ...roleGuidance,
    `- target: ${report.target}`,
    `- manifestVersion: ${report.manifestVersion}`,
    `- files: ${report.files}`,
    '',
    nextStep,
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
