import fs from 'node:fs/promises'
import path from 'node:path'

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

function toPosixPath(input) {
  return input.replace(/\\/g, '/')
}

function createAdvice(hostProfile, recommendedMode = hostProfile.recommendedMode) {
  const adapterGuide = hostProfile.adapterDoc
    ? `.local-context/hiui-design/${hostProfile.adapterDoc}`
    : ''
  const entryHints = hostProfile.adapterEntryHints ?? []

  if (recommendedMode === 'legacy-host-compatible') {
    return {
      title: 'Legacy Host Compatibility Adapter',
      summary:
        'This target should keep its current runtime and host container contract. `legacy-host-compatible` still allows typical-page components through a project-certified carrier or a runtimeAdapterProof-backed standard component, but the host main tree should not be treated as a generic host-integration mount for the standard @hiui-design/typical-page-shells runtime.',
      steps: [
        'Use `legacy-host-compatible` mode and keep the existing route/layout system.',
        'Run `typical-page:plan-page-task` first and follow the selected `pageComponent` plus `runtimeAdapterProof` result before generating any business page.',
        'Prefer the planner-selected project-certified carrier first; only use a direct standard component when the plan proves runtime equivalence for the current host.',
        'Do not add ad hoc `@hiui-design/typical-page-shells` imports just to imitate `host-integration`; keep imports aligned with the planner-selected carrier/adapter path unless you first isolate a dedicated modern runtime entry.',
        'Reuse the target project’s own layout/container abstractions together with `hiui5` alias or local component wrappers.',
        'Read `.local-context/hiui-design/rules/generation-rules.md` first, then `.local-context/hiui-design/docs/generation/legacy-host-compatibility.md` before generating business pages.',
        'Generate real business pages inside the current project structure, then smoke-test one table page, one full-page page, and one drawer page through the real host.',
      ],
      entryHints,
      adapterGuide,
      codeSamples: [],
    }
  }

  switch (hostProfile.framework) {
    case 'umi':
    case 'umi-max':
      return {
        title: 'Umi Host Adapter',
        summary:
          'Keep the existing Umi layout and route system. Mount TypicalPageHostProvider inside the current layout or app runtime entry instead of syncing the current project shell.',
        steps: [
          'Keep `rules-only` mode unless you explicitly need a temporary smoke gallery.',
          'Import `@hiui-design/typical-page-shells/styles.css` in `src/app.tsx` or another stable runtime entry.',
          'Mount `TypicalPageHostProvider` in `src/layouts/index.tsx` or the shared layout wrapper.',
          'Provide header/footer portal slots from the existing Umi layout instead of copying the current project sidebar and route gallery.',
          'Generate real business pages inside the current route tree, then smoke-test one table page, one full-page edit page, and one drawer page.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Runtime style import',
            language: 'ts',
            code: "import '@hiui-design/typical-page-shells/styles.css'",
          },
          {
            title: 'Layout provider skeleton',
            language: 'tsx',
            code:
              "import { TypicalPageHostProvider } from '@hiui-design/typical-page-shells/host'\n\nexport default function LayoutShell({ children }) {\n  return (\n    <TypicalPageHostProvider headerPortal={PageHeaderPortal} footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}",
          },
        ],
      }
    case 'next-app-router':
      return {
        title: 'Next App Router Host Adapter',
        summary:
          'Keep the App Router layout tree. Mount the host bridge inside a client boundary and let business pages stay inside the existing app directory.',
        steps: [
          'Keep `rules-only` mode. Do not sync the current project route gallery into App Router.',
          'Import `@hiui-design/typical-page-shells/styles.css` in the nearest safe global entry, usually `app/layout.tsx` or the matching root client boundary.',
          'Expose header/footer slots from the existing app layout and mount `TypicalPageHostProvider` from a client component wrapper.',
          'Mark typical-page-based screens as client components when they rely on browser-only behavior or portals.',
          'Smoke-test a list page first to verify the header portal, then verify a full-page edit page for footer and scroll behavior.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Client host wrapper',
            language: 'tsx',
            code:
              "'use client'\n\nimport { TypicalPageHostProvider } from '@hiui-design/typical-page-shells/host'\n\nexport function TypicalPageHostClient({ children }) {\n  return (\n    <TypicalPageHostProvider headerPortal={PageHeaderPortal} footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}",
          },
          {
            title: 'Layout-level style import',
            language: 'tsx',
            code:
              "import '@hiui-design/typical-page-shells/styles.css'\n\nexport default function RootLayout({ children }) {\n  return <html><body>{children}</body></html>\n}",
          },
        ],
      }
    case 'next-pages-router':
      return {
        title: 'Next Pages Router Host Adapter',
        summary:
          'Keep the Pages Router structure. Wire styles and host provider through `_app`, then mount real pages in the existing pages tree.',
        steps: [
          'Keep `rules-only` mode. Do not copy the current project route gallery into the Pages Router.',
          'Import `@hiui-design/typical-page-shells/styles.css` in `pages/_app.tsx` or the shared application shell.',
          'Mount `TypicalPageHostProvider` in the shared layout used by `_app` and expose header/footer portal slots there.',
          'Generate real pages under the existing pages structure instead of keeping `src/typical-page-reuse/*` as a permanent route entry.',
          'Smoke-test one table page, one drawer page, and one full-page edit page after wiring the host bridge.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Pages Router app entry',
            language: 'tsx',
            code:
              "import '@hiui-design/typical-page-shells/styles.css'\n\nexport default function App({ Component, pageProps }) {\n  return <Component {...pageProps} />\n}",
          },
          {
            title: 'Shared layout provider skeleton',
            language: 'tsx',
            code:
              "import { TypicalPageHostProvider } from '@hiui-design/typical-page-shells/host'\n\nexport function AppLayout({ children }) {\n  return (\n    <TypicalPageHostProvider headerPortal={PageHeaderPortal} footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}",
          },
        ],
      }
    case 'micro-frontend':
      return {
        title: 'Micro-Frontend Host Adapter',
        summary:
          'Treat the current container as the source of truth. Keep one shell package instance, mount the host bridge in the child app layout, and verify the height chain before generating pages.',
        steps: [
          'Keep `rules-only` mode and avoid copying the current project shell wholesale.',
          'Check that the child app resolves a single `@hiui-design/typical-page-shells` package instance.',
          'Mount `TypicalPageHostProvider` in the child app layout and expose header/footer portal slots there.',
          'Verify the container height chain and scroll ownership before generating any business pages.',
          'Smoke-test a full-page edit page first; if both full-page edit and stat table fail, stop and fix the host/container contract.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Child-app host provider skeleton',
            language: 'tsx',
            code:
              "import { TypicalPageHostProvider } from '@hiui-design/typical-page-shells/host'\n\nexport function ChildAppShell({ children }) {\n  return (\n    <TypicalPageHostProvider headerPortal={PageHeaderPortal} footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}",
          },
        ],
      }
    default:
      return {
        title: 'Host Adapter',
        summary:
          hostProfile.projectType === 'greenfield'
            ? 'This target looks like a greenfield project. It can bring the current project shell and baseline smoke gallery together, but later generated pages should still default to business pages unless you explicitly mount them as examples.'
            : 'This target looks like an existing system. Keep the current host and adapt typical pages inside it.',
        steps: [
          hostProfile.projectType === 'greenfield'
            ? 'Use `host-integration` when you need the current project shell and smoke pages together.'
            : 'Use `rules-only` by default and keep the current route/layout system.',
          'Treat newly generated pages as business pages by default; only add them to official examples or smoke/gallery routes when the task explicitly asks for that.',
          'Keep host provider and page shells on the same package import path family.',
          'Smoke-test one table page, one drawer page, and one full-page edit page before large-scale generation.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [],
      }
  }
}

export function getHostAdapterAdvice(hostProfile) {
  return createAdvice(hostProfile)
}

export async function writeHostAdapterSnippet({
  outputRoot,
  hostProfile,
  recommendedModeOverride,
}) {
  const recommendedMode = recommendedModeOverride ?? hostProfile.recommendedMode
  const advice = createAdvice(hostProfile, recommendedMode)
  const snippetPath = path.join(outputRoot, 'HOST_ADAPTER_SNIPPET.md')
  const lines = [
    `# ${advice.title}`,
    '',
    `- detected project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- recommended mode: ${recommendedMode}`,
    '',
    '## Summary',
    '',
    advice.summary,
    '',
    '## Recommended steps',
    '',
  ]

  advice.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`)
  })

  if (advice.entryHints.length > 0) {
    lines.push('', '## Candidate host entry files', '')
    advice.entryHints.forEach((entry) => lines.push(`- \`${toPosixPath(entry)}\``))
  }

  if (advice.adapterGuide) {
    lines.push('', '## Reference', '')
    lines.push(`- \`${toPosixPath(advice.adapterGuide)}\``)
  }

  if (advice.codeSamples?.length) {
    lines.push('', '## Code skeletons', '')
    for (const sample of advice.codeSamples) {
      lines.push(`### ${sample.title}`)
      lines.push('')
      lines.push(`\`\`\`${sample.language}`)
      lines.push(sample.code)
      lines.push('```')
      lines.push('')
    }
  }

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, `${lines.join('\n')}\n`, 'utf8')
  return { advice, snippetPath }
}
