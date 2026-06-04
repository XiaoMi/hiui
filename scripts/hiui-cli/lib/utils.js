/**
 * Convert component input to kebab-case slug used in llms URLs.
 * e.g. Alert -> alert, BackTop -> back-top, check_cascader -> check-cascader
 */
function toComponentSlug (name) {
  return String(name)
    .trim()
    .replace(/_/g, '-')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function levenshtein (a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }

  return dp[m][n]
}

function suggestComponents (input, candidates, limit = 5) {
  const query = toComponentSlug(input)
  return candidates
    .map((name) => ({ name, distance: levenshtein(query, name) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((item) => item.name)
}

function writeStdout (text) {
  process.stdout.write(text.endsWith('\n') ? text : `${text}\n`)
}

function writeStderr (text) {
  process.stderr.write(text.endsWith('\n') ? text : `${text}\n`)
}

function outputJson (data) {
  writeStdout(JSON.stringify(data, null, 2))
}

function outputError (error, format) {
  const payload = {
    error: {
      code: error.code,
      message: error.message,
      ...(error.suggestions ? { suggestions: error.suggestions } : {}),
      ...(error.url ? { url: error.url } : {}),
    },
  }

  if (format === 'json') {
    outputJson(payload)
  } else {
    writeStderr(`Error [${error.code}]: ${error.message}`)
    if (error.suggestions && error.suggestions.length) {
      writeStderr(`Did you mean: ${error.suggestions.join(', ')}?`)
    }
  }

  process.exit(1)
}

module.exports = {
  toComponentSlug,
  levenshtein,
  suggestComponents,
  writeStdout,
  writeStderr,
  outputJson,
  outputError,
}
