const {
  DEFAULT_V5_VERSION,
  CLASS_V4,
  CLASS_V5,
  CLASS_PREFIX_V4,
  CLASS_PREFIX_V5,
} = require('./constants')

function normalizeMajor (value) {
  return String(value).trim().replace(/^v/i, '')
}

/**
 * @returns {{
 *   from: string,
 *   to: string,
 *   version: string,
 *   classReplace: { fromDot: string, toDot: string, fromPrefix: string, toPrefix: string } | null
 * }}
 */
function resolveMigration (from, to) {
  const fromMajor = normalizeMajor(from)
  const toMajor = normalizeMajor(to)
  const key = `${fromMajor}-${toMajor}`

  if (key === '4-5') {
    return {
      from: fromMajor,
      to: toMajor,
      version: DEFAULT_V5_VERSION,
      classReplace: {
        fromDot: CLASS_V4,
        toDot: CLASS_V5,
        fromPrefix: CLASS_PREFIX_V4,
        toPrefix: CLASS_PREFIX_V5,
      },
    }
  }

  const error = new Error(
    `Unsupported migration: V${fromMajor} → V${toMajor}. Currently only "hiui migrate 4 5" is supported.`
  )
  error.code = 'UNSUPPORTED_MIGRATION'
  throw error
}

module.exports = {
  normalizeMajor,
  resolveMigration,
}
