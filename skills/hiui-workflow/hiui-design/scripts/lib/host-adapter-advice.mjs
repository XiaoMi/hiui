import fs from 'node:fs/promises'
import path from 'node:path'
import { getManagedLocalRuntimeRoot } from './managed-local-runtime-contract.mjs'
import { getContextPath } from './skill-identity.mjs'

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

function toPosixPath(input) {
  return input.replace(/\\/g, '/')
}

const LOCAL_RUNTIME_ROOT = `src/${getManagedLocalRuntimeRoot()}`
const LOCAL_RUNTIME_STYLE_SAMPLE =
  `// Adjust the relative path so it points at ${LOCAL_RUNTIME_ROOT}/styles.css\n` +
  "import '../components/hiui-design-runtime/styles.css'"
const LOCAL_RUNTIME_HOST_SAMPLE =
  `// Adjust the relative path so it points at ${LOCAL_RUNTIME_ROOT}/host\n` +
  "import { TypicalPageHostProvider } from '../components/hiui-design-runtime/host'"

function createAdvice(hostProfile) {
  const adapterGuide = hostProfile.adapterDoc
    ? getContextPath(hostProfile.adapterDoc)
    : ''
  const entryHints = hostProfile.adapterEntryHints ?? []
  const remoteOnlyRuntime = hostProfile.remoteOnlyRuntime || {}

  switch (hostProfile.framework) {
    case 'umi':
    case 'umi-max':
      return {
        title: 'Umi Host Adapter',
        summary:
          'Keep the existing Umi layout and route system. Mount TypicalPageHostProvider inside the current layout or app runtime entry instead of syncing the current project shell.',
        steps: [
          'Keep `rules-only` mode unless you explicitly need the fuller host-integration baseline while keeping official preview in the packaged preview runtime.',
          `Import the local managed runtime styles from \`${LOCAL_RUNTIME_ROOT}/styles.css\` in \`src/app.tsx\` or another stable runtime entry. Resolve the relative path from that entry file instead of using the old package path.`,
          `Mount \`TypicalPageHostProvider\` from the local managed runtime host module under \`${LOCAL_RUNTIME_ROOT}/host\` in \`src/layouts/index.tsx\` or the shared layout wrapper.`,
          'Keep standard page headers self-contained inside the page shell. Only wire a shared `headerPortal` when the existing Umi layout must explicitly preserve a legacy shared header carrier; keep `footerPortal` on the host side when footer content still belongs to the layout.',
          'Generate real business pages inside the current route tree, then smoke-test one table page, one full-page edit page, and one drawer page.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Runtime style import',
            language: 'ts',
            code: LOCAL_RUNTIME_STYLE_SAMPLE,
          },
          {
            title: 'Layout provider skeleton',
            language: 'tsx',
            code:
              `${LOCAL_RUNTIME_HOST_SAMPLE}\n\nexport default function LayoutShell({ children }) {\n  return (\n    <TypicalPageHostProvider footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}`,
          },
        ],
      }
    case 'next-app-router':
      return {
        title: 'Next App Router Host Adapter',
        summary:
          'Keep the App Router layout tree. Mount the host bridge inside a client boundary and let business pages stay inside the existing app directory.',
        steps: [
          'Keep `rules-only` mode. Do not create a project-local preview route tree in App Router.',
          `Import the local managed runtime styles from \`${LOCAL_RUNTIME_ROOT}/styles.css\` in the nearest safe global entry, usually \`app/layout.tsx\` or the matching root client boundary. Resolve the relative path from that file.`,
          `Keep standard page headers self-contained. Mount \`TypicalPageHostProvider\` from the local managed runtime host module in a client component wrapper, keep footer hosting in the layout when needed, and only opt into \`headerPortal\` for an explicit legacy shared-header contract.`,
          'Mark typical-page-based screens as client components when they rely on browser-only behavior or portals.',
          'Smoke-test a list page first to verify page-owned header behavior, then verify a full-page edit page for footer and scroll behavior.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Client host wrapper',
            language: 'tsx',
            code:
              `'use client'\n\n${LOCAL_RUNTIME_HOST_SAMPLE}\n\nexport function TypicalPageHostClient({ children }) {\n  return (\n    <TypicalPageHostProvider footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}`,
          },
          {
            title: 'Layout-level style import',
            language: 'tsx',
            code: `${LOCAL_RUNTIME_STYLE_SAMPLE}\n\nexport default function RootLayout({ children }) {\n  return <html><body>{children}</body></html>\n}`,
          },
        ],
      }
    case 'next-pages-router':
      return {
        title: 'Next Pages Router Host Adapter',
        summary:
          'Keep the Pages Router structure. Wire styles and host provider through `_app`, then mount real pages in the existing pages tree.',
        steps: [
          'Keep `rules-only` mode. Do not create a project-local preview route tree in the Pages Router.',
          `Import the local managed runtime styles from \`${LOCAL_RUNTIME_ROOT}/styles.css\` in \`pages/_app.tsx\` or the shared application shell. Resolve the relative path from that file.`,
          `Mount \`TypicalPageHostProvider\` from the local managed runtime host module in the shared layout used by \`_app\`. Keep standard page headers self-contained, keep footer hosting in the layout when needed, and only add \`headerPortal\` for an explicit legacy shared-header contract.`,
          'Generate real pages under the existing pages structure instead of keeping `src/typical-page-preview/*` as a permanent route entry.',
          'Smoke-test one table page, one drawer page, and one full-page edit page after wiring the host bridge.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Pages Router app entry',
            language: 'tsx',
            code: `${LOCAL_RUNTIME_STYLE_SAMPLE}\n\nexport default function App({ Component, pageProps }) {\n  return <Component {...pageProps} />\n}`,
          },
          {
            title: 'Shared layout provider skeleton',
            language: 'tsx',
            code:
              `${LOCAL_RUNTIME_HOST_SAMPLE}\n\nexport function AppLayout({ children }) {\n  return (\n    <TypicalPageHostProvider footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}`,
          },
        ],
      }
    case 'micro-frontend':
      return {
        title: 'Micro-Frontend Host Adapter',
        summary:
          'Treat the current container as the source of truth. Keep one managed local runtime path family, mount the host bridge in the child app layout, and prove the shared content outlet contract before generating pages.',
        steps: [
          'Keep `rules-only` mode and avoid copying the current project shell wholesale.',
          `Check that the child app uses one managed local runtime path family rooted at \`${LOCAL_RUNTIME_ROOT}\` and does not mix it with legacy shell package imports.`,
          `Mount \`TypicalPageHostProvider\` from the local managed runtime host module in the child app layout. Keep standard page headers self-contained, keep footer hosting in the child layout when needed, and only add \`headerPortal\` when the container must explicitly preserve a legacy shared header carrier.`,
          'Verify the child-app content outlet keeps `display:flex`, `flex-direction:column`, `flex:1 1 0%`, `min-height:0`, and `overflow:hidden` all the way to the routed page root.',
          'Keep the shared content outlet right-side viewport gutter at `16px`; if the menu can collapse, preserve the same `16px` gap between the collapsed menu rail and the main content.',
          'Choose one main scroll owner for the business content outlet; do not let the container shell and the typical-page shell compete with nested vertical scrollbars.',
          'Smoke-test a full-page edit page first; if both full-page edit and stat table fail, stop and fix the host/container contract.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [
          {
            title: 'Child-app host provider skeleton',
            language: 'tsx',
            code:
              `${LOCAL_RUNTIME_HOST_SAMPLE}\n\nexport function ChildAppShell({ children }) {\n  return (\n    <TypicalPageHostProvider footerPortal={PageFooterPortal}>\n      {children}\n    </TypicalPageHostProvider>\n  )\n}`,
          },
        ],
      }
    case 'rspack-module-federation':
    case 'webpack-module-federation':
      return {
        title: 'Module Federation Legacy Host Adapter',
        summary:
          'Treat this target as a high-risk legacy host. Preserve the existing Module Federation container, keep the compatibility bridge explicit, and verify react-dom/client plus HiUI5 replacement branches before generating pages.',
        steps: [
          'Keep `rules-only` mode unless you have already proven that the fuller host-integration baseline can coexist with the formal route tree while official preview stays in the packaged preview runtime.',
          'Preserve the existing Module Federation `exposes` contract; do not guess or rewrite expose names during page generation.',
          remoteOnlyRuntime.enabled
            ? 'Treat this as a remote-only local-debug host: opening `/` may 404, so verify the remote through `remoteEntry.js` or the project proxy path first.'
            : 'When debugging locally, verify the remote expose contract before attributing failures to page source.',
          `Keep the HiUI5 replacement bridge in the Rspack/Webpack config and make it issuer-scoped: cover the managed local runtime under \`${LOCAL_RUNTIME_ROOT}\` plus the @hi-ui/schema-*, @hi-ui/dumb-wrapper, and @hi-ui/number-range runtime chain. Start from .local-context/hiui-design/examples/host-integration/build/hiui5-peer-replacement-bridge.cjs and prefer createScopedHiui5PeerReplacementPlugins(...).`,
          'Only on legacy existing-system Module Federation hosts, audit the shared singleton contract as well: if package.json still carries old `@hi-ui/hiui` while the build also enables the scoped HiUI5 bridge, do not keep `@hi-ui/hiui` shared as an unexamined singleton and then blame generated page source for the runtime conflict.',
          'For shared business layouts, prove the routed content outlet contract explicitly: `display:flex`, `flex-direction:column`, `flex:1 1 0%`, `min-height:0`, `overflow:hidden`, one main scroll owner, and a persistent right-side `16px` viewport gutter.',
          'Add an explicit `react-dom/client` shim branch for React 16/17 carriers before attributing runtime failures to page source.',
          remoteOnlyRuntime.enabled
            ? 'After changing exposes, alias rules, or the replacement bridge, restart the remote dev server and re-check the live remoteEntry.js; Camora proxies the running localhost remote, not an old dist artifact.'
            : 'After changing exposes, alias rules, or the replacement bridge, restart the dev server and re-check the live remoteEntry.js before blaming the page source.',
          'Run one focused smoke path after wiring the page into the existing host; treat doctor pass as baseline confirmation, not full host validation.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [],
      }
    case 'rspack-react':
    case 'webpack-react':
      return {
        title: 'Legacy Build Host Adapter',
        summary:
          'This target uses a non-native host-integration build runtime. Keep the existing build contract in place and make compatibility branches explicit before generating pages at scale.',
        steps: [
          'Prefer `rules-only` mode and keep the existing route/layout system.',
          `Import the local managed runtime styles from \`${LOCAL_RUNTIME_ROOT}/styles.css\` and \`@hi-ui/patch-for-react\` in the stable app entry once. Resolve the relative path from that entry file.`,
          'If the project runs on React 16/17, add an explicit `react-dom/client` compatibility shim and resolver alias.',
          'Do not remove legacy build bridges that isolate HiUI5 dependencies from the root runtime.',
          'Verify one table page and one full-page edit page in the real host before batch generation.',
        ],
        entryHints,
        adapterGuide,
        codeSamples: [],
      }
    default:
      return {
        title: 'Host Adapter',
        summary:
          hostProfile.projectType === 'greenfield'
            ? 'This target looks like a greenfield project. It can usually adopt the managed host baseline and smoke/doctor guidance while official preview stays in the packaged preview runtime.'
            : 'This target looks like an existing system. Keep the current host and adapt typical pages inside it.',
        steps: [
          hostProfile.projectType === 'greenfield'
            ? 'Use `host-integration` when you need the fuller managed host baseline and smoke/doctor guidance; keep official preview in the packaged preview runtime.'
            : 'Use `rules-only` by default and keep the current route/layout system.',
          `Keep host provider and page shells on the same managed local runtime path family rooted at \`${LOCAL_RUNTIME_ROOT}\`.`,
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

export async function writeHostAdapterSnippet({ outputRoot, hostProfile }) {
  const advice = createAdvice(hostProfile)
  const remoteOnlyRuntime = hostProfile.remoteOnlyRuntime || {}
  const remoteDebugContract = hostProfile.remoteDebugContract || {}
  const snippetPath = path.join(outputRoot, 'HOST_ADAPTER_SNIPPET.md')
  const lines = [
    `# ${advice.title}`,
    '',
    `- detected project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- integration strategy: ${hostProfile.strategy}`,
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

  if (remoteOnlyRuntime.enabled) {
    lines.push('', '## Remote-only runtime hints', '')
    lines.push(`- root path may 404 locally: ${remoteOnlyRuntime.rootPathMay404 === true ? 'yes' : 'no'}`)
    if (remoteOnlyRuntime.remoteEntryFilenames?.length > 0) {
      lines.push(`- remote entry filenames: ${remoteOnlyRuntime.remoteEntryFilenames.join(', ')}`)
    }
    if (remoteOnlyRuntime.localOrigins?.length > 0) {
      lines.push(`- README localOrigin hints: ${remoteOnlyRuntime.localOrigins.join(', ')}`)
    }
    if (remoteOnlyRuntime.readmePath) {
      lines.push(`- README source: \`${toPosixPath(remoteOnlyRuntime.readmePath)}\``)
    }
    for (const hint of remoteOnlyRuntime.verificationHints || []) {
      lines.push(`- ${hint}`)
    }
  }

  if (remoteDebugContract.enabled) {
    lines.push('', '## Remote Debug Contract', '')
    lines.push(`- mode: ${remoteDebugContract.mode || 'unknown'}`)
    lines.push(`- runtime source status: ${remoteDebugContract.runtimeSourceStatus || 'unknown'}`)
    if (remoteDebugContract.localRuntimeSources?.length > 0) {
      lines.push(`- local runtime sources: ${remoteDebugContract.localRuntimeSources.join(', ')}`)
    }
    for (const rule of remoteDebugContract.camoraProxyRules || []) {
      lines.push(`- Camora proxy rule: ${rule.matcher} -> ${rule.target}`)
    }
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
