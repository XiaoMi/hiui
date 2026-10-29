import fs from 'node:fs/promises'
import path from 'node:path'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function patchTextFile(filePath, replacements) {
  if (!(await pathExists(filePath))) {
    return {
      status: 'missing',
      filePath,
      applied: [],
    }
  }

  const raw = await fs.readFile(filePath, 'utf8')
  let next = raw
  const applied = []

  for (const replacement of replacements) {
    if (!replacement.from.test(next)) continue
    next = next.replace(replacement.from, replacement.to)
    applied.push(replacement.id)
  }

  if (next === raw) {
    return {
      status: applied.length > 0 ? 'already-patched' : 'unchanged',
      filePath,
      applied,
    }
  }

  await fs.writeFile(filePath, next, 'utf8')
  return {
    status: 'patched',
    filePath,
    applied,
  }
}

function summarizeResults(results) {
  const counts = {
    patched: 0,
    alreadyPatched: 0,
    missing: 0,
    unchanged: 0,
  }

  for (const result of results) {
    if (result.status === 'patched') counts.patched += 1
    else if (result.status === 'already-patched') counts.alreadyPatched += 1
    else if (result.status === 'missing') counts.missing += 1
    else counts.unchanged += 1
  }

  return counts
}

const REACT_RESIZE_DETECTOR_PACKAGE_PATHS = [
  ['@hi-ui', 'tag-input'],
  ['@hi-ui', 'textarea'],
  ['hiui5-tag-input'],
  ['hiui5-textarea'],
]

function buildReactResizeDetectorTargets(targetRoot) {
  return REACT_RESIZE_DETECTOR_PACKAGE_PATHS.flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'index.esm.js'),
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'index.js'),
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'withPolyfill.js'),
    ]
  })
}

const RC_RESIZE_OBSERVER_PACKAGE_PATHS = [
  ['@hi-ui', 'table'],
  ['@hi-ui', 'virtual-list'],
  ['@hi-ui', 'check-cascader'],
  ['hiui5-table'],
  ['hiui5-check-cascader'],
]

function buildRcResizeObserverTargets(targetRoot) {
  const baseTargets = RC_RESIZE_OBSERVER_PACKAGE_PATHS.flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(packageRoot, 'lib', 'esm', 'node_modules', 'rc-resize-observer', 'es', 'index.js'),
      path.join(packageRoot, 'lib', 'cjs', 'node_modules', 'rc-resize-observer', 'es', 'index.js'),
    ]
  })

  const checkCascaderTargets = [
    ['@hi-ui', 'check-cascader'],
    ['hiui5-check-cascader'],
  ].flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(
        packageRoot,
        'lib',
        'esm',
        'ui',
        'virtual-list',
        'lib',
        'esm',
        'node_modules',
        'rc-resize-observer',
        'es',
        'index.js'
      ),
      path.join(
        packageRoot,
        'lib',
        'cjs',
        'ui',
        'virtual-list',
        'lib',
        'esm',
        'node_modules',
        'rc-resize-observer',
        'es',
        'index.js'
      ),
    ]
  })

  return [...baseTargets, ...checkCascaderTargets]
}

function buildQueryFilterTargets(targetRoot) {
  return [
    path.join(
      targetRoot,
      'node_modules',
      '@hi-ui',
      'query-filter',
      'lib',
      'esm',
      'FilterForm',
      'index.js'
    ),
    path.join(
      targetRoot,
      'node_modules',
      '@hi-ui',
      'query-filter',
      'lib',
      'cjs',
      'FilterForm',
      'index.js'
    ),
  ]
}

const REACT_RESIZE_DETECTOR_REPLACEMENTS = [
  {
    id: 'guard-finddomnode-esm-import',
    from: /var currentElement = findDOMNode\(_this\);/g,
    to: "var currentElement = typeof findDOMNode === 'function' ? findDOMNode(_this) : null;",
  },
  {
    id: 'guard-finddomnode-esm',
    from: /var currentElement = ReactDOM\.findDOMNode\(_this\);/g,
    to: "var currentElement = typeof ReactDOM.findDOMNode === 'function' ? ReactDOM.findDOMNode(_this) : null;",
  },
  {
    id: 'guard-finddomnode-cjs',
    from: /var currentElement = reactDom\.findDOMNode\(_this\);/g,
    to: "var currentElement = typeof reactDom.findDOMNode === 'function' ? reactDom.findDOMNode(_this) : null;",
  },
]

const RC_RESIZE_OBSERVER_REPLACEMENTS = [
  {
    id: 'avoid-element-ref-read',
    from: /((?:var|let|const)\s+[\w$]+\s*=\s*)childNode\.ref;/g,
    to: '$1childNode && childNode.props ? childNode.props.ref : undefined;',
  },
]

const QUERY_FILTER_GAP_FORWARDING_REPLACEMENTS = [
  {
    id: 'forward-gap-to-flex-layout',
    from:
      /style:\s*Object\.assign\(\{\s*'--filter-form-gap':\s*gap\s*\+\s*"px"\s*\},\s*styles\s*===\s*null\s*\|\|\s*styles\s*===\s*void\s*0\s*\?\s*void\s*0\s*:\s*styles\.form\)/g,
    to:
      'style: Object.assign({\n      \'--filter-form-gap\': gap + "px",\n      columnGap: gap + "px",\n      rowGap: gap + "px"\n    }, styles === null || styles === void 0 ? void 0 : styles.form)',
  },
]

const PATCH_DEFINITIONS = {
  'react19-compat': {
    title: 'React 19 compatibility runtime patch',
    async run(targetRoot) {
      const detectorResults = []
      for (const filePath of buildReactResizeDetectorTargets(targetRoot)) {
        detectorResults.push(await patchTextFile(filePath, REACT_RESIZE_DETECTOR_REPLACEMENTS))
      }

      const observerResults = []
      for (const filePath of buildRcResizeObserverTargets(targetRoot)) {
        observerResults.push(await patchTextFile(filePath, RC_RESIZE_OBSERVER_REPLACEMENTS))
      }

      const results = [...detectorResults, ...observerResults]
      const summary = summarizeResults(results)

      return {
        id: 'react19-compat',
        title: 'React 19 compatibility runtime patch',
        status: summary.patched > 0 ? 'patched' : 'noop',
        summary,
        results,
      }
    },
  },
  'query-filter-gap-forwarding': {
    title: '@hi-ui/query-filter gap forwarding runtime patch',
    async run(targetRoot) {
      const results = []
      for (const filePath of buildQueryFilterTargets(targetRoot)) {
        results.push(await patchTextFile(filePath, QUERY_FILTER_GAP_FORWARDING_REPLACEMENTS))
      }

      const summary = summarizeResults(results)

      return {
        id: 'query-filter-gap-forwarding',
        title: '@hi-ui/query-filter gap forwarding runtime patch',
        status: summary.patched > 0 ? 'patched' : 'noop',
        summary,
        results,
      }
    },
  },
}

export const MANAGED_RUNTIME_PATCH_IDS = Object.keys(PATCH_DEFINITIONS)

export async function runManagedRuntimePatches({ targetRoot, patchIds = MANAGED_RUNTIME_PATCH_IDS }) {
  const patches = []

  for (const patchId of patchIds) {
    const definition = PATCH_DEFINITIONS[patchId]
    if (!definition) {
      throw new Error(`Unknown runtime patch id: ${patchId}`)
    }
    patches.push(await definition.run(targetRoot))
  }

  const summary = {
    patchedGroups: 0,
    noopGroups: 0,
    patchedFiles: 0,
    alreadyPatchedFiles: 0,
    missingFiles: 0,
    unchangedFiles: 0,
  }

  for (const patch of patches) {
    if (patch.status === 'patched') summary.patchedGroups += 1
    else summary.noopGroups += 1

    summary.patchedFiles += patch.summary.patched
    summary.alreadyPatchedFiles += patch.summary.alreadyPatched
    summary.missingFiles += patch.summary.missing
    summary.unchangedFiles += patch.summary.unchanged
  }

  return {
    schema: 'hiui-design-runtime-patches.v1',
    targetRoot,
    status: summary.patchedGroups > 0 ? 'patched' : 'noop',
    summary,
    patches,
  }
}

export async function runReact19RuntimePatch({ targetRoot }) {
  const report = await runManagedRuntimePatches({
    targetRoot,
    patchIds: ['react19-compat'],
  })
  const react19Patch = report.patches[0]

  return {
    schema: 'hiui-design-react19-runtime-patch.v1',
    targetRoot,
    status: react19Patch.status,
    summary: react19Patch.summary,
    results: react19Patch.results,
  }
}
