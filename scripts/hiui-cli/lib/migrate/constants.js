const HIUI_SCOPE = '@hi-ui/'
const DEFAULT_V5_VERSION = '^5.0.0'
const CLASS_V4 = '.hi-v4'
const CLASS_V5 = '.hi-v5'
/** BEM 类名前缀，用于 [class^='hi-v4-'] 等非 .hi-v4 写法 */
const CLASS_PREFIX_V4 = 'hi-v4-'
const CLASS_PREFIX_V5 = 'hi-v5-'

/** 不参与升级的 @hi-ui 工具包 */
const PACKAGE_UPGRADE_EXCLUDE = new Set([
  '@hi-ui/hi-build',
  '@hi-ui/hi-docs',
  '@hi-ui/hiui-cli',
])

const DEPENDENCY_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
  'storybook-static',
  '.cache',
  '.history',
])

const SKIP_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
])

const MAX_FILE_SIZE = 2 * 1024 * 1024

module.exports = {
  HIUI_SCOPE,
  DEFAULT_V5_VERSION,
  CLASS_V4,
  CLASS_V5,
  CLASS_PREFIX_V4,
  CLASS_PREFIX_V5,
  PACKAGE_UPGRADE_EXCLUDE,
  DEPENDENCY_FIELDS,
  SKIP_DIRS,
  SKIP_FILES,
  MAX_FILE_SIZE,
}
