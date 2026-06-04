const PATCH_PACKAGE = '@hi-ui/patch-for-react'
const DEFAULT_PATCH_VERSION = '^5.0.0'

const IMPORT_STATEMENT = "import '@hi-ui/patch-for-react'"

const ENTRY_CANDIDATES = [
  'src/index.tsx',
  'src/main.tsx',
  'src/index.ts',
  'src/main.ts',
  'src/index.jsx',
  'src/main.jsx',
  'index.tsx',
  'main.tsx',
]

module.exports = {
  PATCH_PACKAGE,
  DEFAULT_PATCH_VERSION,
  IMPORT_STATEMENT,
  ENTRY_CANDIDATES,
}
