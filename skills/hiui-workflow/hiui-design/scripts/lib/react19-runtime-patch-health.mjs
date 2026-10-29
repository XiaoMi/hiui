import fs from 'node:fs/promises'
import path from 'node:path'

const REACT19_RUNTIME_PATCH_REACT_RESIZE_DETECTOR_PACKAGE_PATHS = [
  ['@hi-ui', 'tag-input'],
  ['@hi-ui', 'textarea'],
  ['hiui5-tag-input'],
  ['hiui5-textarea'],
]

const REACT19_RUNTIME_PATCH_RC_RESIZE_OBSERVER_PACKAGE_PATHS = [
  ['@hi-ui', 'table'],
  ['@hi-ui', 'virtual-list'],
  ['@hi-ui', 'check-cascader'],
  ['hiui5-table'],
  ['hiui5-check-cascader'],
]

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

function buildReact19RuntimePatchDetectorTargets(targetRoot) {
  return REACT19_RUNTIME_PATCH_REACT_RESIZE_DETECTOR_PACKAGE_PATHS.flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'index.esm.js'),
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'index.js'),
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'withPolyfill.js'),
    ]
  })
}

function buildReact19RuntimePatchObserverTargets(targetRoot) {
  const baseTargets = REACT19_RUNTIME_PATCH_RC_RESIZE_OBSERVER_PACKAGE_PATHS.flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(packageRoot, 'lib', 'esm', 'node_modules', 'rc-resize-observer', 'es', 'index.js'),
      path.join(packageRoot, 'lib', 'cjs', 'node_modules', 'rc-resize-observer', 'es', 'index.js'),
    ]
  })

  const nestedCheckCascaderTargets = [
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

  return [...baseTargets, ...nestedCheckCascaderTargets]
}

function analyzeReact19RuntimePatchDetector(raw) {
  const source = String(raw || '')
  if (!source.includes('findDOMNode(')) return []

  const hasGuard =
    source.includes("typeof findDOMNode === 'function' ? findDOMNode(_this) : null;") ||
    source.includes("typeof ReactDOM.findDOMNode === 'function' ? ReactDOM.findDOMNode(_this) : null;") ||
    source.includes("typeof reactDom.findDOMNode === 'function' ? reactDom.findDOMNode(_this) : null;")

  return hasGuard ? [] : ['findDOMNode access is not guarded for React 19']
}

function analyzeReact19RuntimePatchObserver(raw) {
  const source = String(raw || '')
  if (!source.includes('childNode.ref')) return []
  return source.includes('childNode && childNode.props ? childNode.props.ref : undefined;')
    ? []
    : ['element.ref still reads childNode.ref directly under React 19']
}

export async function inspectInstalledReact19RuntimePatchCoverage({ targetRoot, reactMajor }) {
  const normalizedReactMajor = Number(reactMajor || 0)
  if (normalizedReactMajor < 19) {
    return {
      required: false,
      ok: true,
      checkedFiles: 0,
      failingFiles: [],
      detail:
        normalizedReactMajor > 0
          ? `Detected React ${normalizedReactMajor}; installed React 19 runtime patch coverage is not required.`
          : 'React major version could not be resolved; installed React 19 runtime patch coverage is not required.',
    }
  }

  const results = []

  for (const filePath of buildReact19RuntimePatchDetectorTargets(targetRoot)) {
    if (!(await pathExists(filePath))) continue
    const raw = await readTextIfExists(filePath)
    results.push({
      filePath,
      reasons: analyzeReact19RuntimePatchDetector(raw),
    })
  }

  for (const filePath of buildReact19RuntimePatchObserverTargets(targetRoot)) {
    if (!(await pathExists(filePath))) continue
    const raw = await readTextIfExists(filePath)
    results.push({
      filePath,
      reasons: analyzeReact19RuntimePatchObserver(raw),
    })
  }

  const failingFiles = results.filter((item) => item.reasons.length > 0)
  if (results.length === 0) {
    return {
      required: true,
      ok: true,
      checkedFiles: 0,
      failingFiles: [],
      detail:
        'No installed React 19-sensitive runtime files were found under node_modules. If this project expects those HiUI runtime packages, run dependency install before visual acceptance.',
    }
  }

  return {
    required: true,
    ok: failingFiles.length === 0,
    checkedFiles: results.length,
    failingFiles,
    detail:
      failingFiles.length === 0
        ? `Installed React 19 runtime patch coverage looks healthy across ${results.length} known runtime hotspot file(s).`
        : failingFiles
            .slice(0, 6)
            .map((item) => `${path.relative(targetRoot, item.filePath)} -> ${item.reasons.join('; ')}`)
            .join(' | '),
  }
}
