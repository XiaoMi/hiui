function parseVersionTuple(raw) {
  const match = String(raw ?? '')
    .trim()
    .match(/^v?(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:\.(0|[1-9]\d*))?(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/)

  if (!match) return null

  return {
    major: Number(match[1]),
    minor: Number(match[2] ?? 0),
    patch: Number(match[3] ?? 0),
    prerelease: match[4] ? match[4].split('.') : [],
  }
}

function compareVersionTuples(left, right) {
  if (left.major !== right.major) return left.major - right.major
  if (left.minor !== right.minor) return left.minor - right.minor
  if (left.patch !== right.patch) return left.patch - right.patch

  if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0
  if (left.prerelease.length === 0) return 1
  if (right.prerelease.length === 0) return -1

  const limit = Math.max(left.prerelease.length, right.prerelease.length)
  for (let index = 0; index < limit; index += 1) {
    const leftIdentifier = left.prerelease[index]
    const rightIdentifier = right.prerelease[index]
    if (leftIdentifier == null) return -1
    if (rightIdentifier == null) return 1

    const leftIsNumeric = /^\d+$/.test(leftIdentifier)
    const rightIsNumeric = /^\d+$/.test(rightIdentifier)

    if (leftIsNumeric && rightIsNumeric) {
      const difference = Number(leftIdentifier) - Number(rightIdentifier)
      if (difference !== 0) return difference
      continue
    }

    if (leftIsNumeric) return -1
    if (rightIsNumeric) return 1

    const difference = leftIdentifier.localeCompare(rightIdentifier)
    if (difference !== 0) return difference
  }

  return 0
}

function bumpPatch(versionTuple) {
  return {
    major: versionTuple.major,
    minor: versionTuple.minor,
    patch: versionTuple.patch + 1,
    prerelease: [],
  }
}

function normalizeFloorCandidate(rawCandidate) {
  const candidate = String(rawCandidate ?? '').trim()
  if (!candidate) return null
  if (candidate === '*' || candidate.toLowerCase() === 'x') {
    return { major: 0, minor: 0, patch: 0, prerelease: [] }
  }

  if (/^\d+(?:\.x|\.X|\.\*)?$/.test(candidate)) {
    return parseVersionTuple(candidate.replace(/[xX*]/g, '0'))
  }

  if (/^\d+\.\d+(?:\.x|\.X|\.\*)?$/.test(candidate)) {
    return parseVersionTuple(candidate.replace(/[xX*]/g, '0'))
  }

  return parseVersionTuple(candidate)
}

function extractClauseFloor(clause) {
  const normalizedClause = String(clause ?? '').trim()
  if (!normalizedClause) return null

  const hyphenRange = normalizedClause.match(/^(.+?)\s+-\s+(.+)$/)
  if (hyphenRange) {
    return normalizeFloorCandidate(hyphenRange[1])
  }

  let floor = null
  for (const token of normalizedClause.split(/\s+/)) {
    if (!token || token === '-' || token === '||') continue

    let candidate = null

    if (token.startsWith('>=')) {
      candidate = normalizeFloorCandidate(token.slice(2))
    } else if (token.startsWith('>')) {
      const parsed = normalizeFloorCandidate(token.slice(1))
      candidate = parsed ? bumpPatch(parsed) : null
    } else if (token.startsWith('=')) {
      candidate = normalizeFloorCandidate(token.slice(1))
    } else if (token.startsWith('^') || token.startsWith('~')) {
      candidate = normalizeFloorCandidate(token.slice(1))
    } else if (/^[v\d]/.test(token)) {
      candidate = normalizeFloorCandidate(token)
    }

    if (!candidate) continue

    if (!floor || compareVersionTuples(candidate, floor) > 0) {
      floor = candidate
    }
  }

  return floor
}

function extractRangeFloor(spec) {
  const clauses = String(spec ?? '')
    .trim()
    .split(/\s*\|\|\s*/)
    .filter(Boolean)

  if (clauses.length === 0) return null

  let floor = null
  for (const clause of clauses) {
    const clauseFloor = extractClauseFloor(clause)
    if (!clauseFloor) return null
    if (!floor || compareVersionTuples(clauseFloor, floor) < 0) {
      floor = clauseFloor
    }
  }

  return floor
}

function bumpMinor(versionTuple) {
  return {
    major: versionTuple.major,
    minor: versionTuple.minor + 1,
    patch: 0,
    prerelease: [],
  }
}

function bumpMajor(versionTuple) {
  return {
    major: versionTuple.major + 1,
    minor: 0,
    patch: 0,
    prerelease: [],
  }
}

function extractClauseUpperBound(clause) {
  const normalizedClause = String(clause ?? '').trim()
  if (!normalizedClause) return null

  const hyphenRange = normalizedClause.match(/^(.+?)\s+-\s+(.+)$/)
  if (hyphenRange) {
    const upperVersion = normalizeFloorCandidate(hyphenRange[2])
    return upperVersion ? { version: upperVersion, inclusive: true } : null
  }

  let upperBound = null
  for (const token of normalizedClause.split(/\s+/)) {
    if (!token || token === '-' || token === '||') continue

    let candidate = null
    let inclusive = false

    if (token.startsWith('<=')) {
      candidate = normalizeFloorCandidate(token.slice(2))
      inclusive = true
    } else if (token.startsWith('<')) {
      candidate = normalizeFloorCandidate(token.slice(1))
      inclusive = false
    } else if (token.startsWith('^')) {
      const parsed = normalizeFloorCandidate(token.slice(1))
      if (parsed) {
        candidate = parsed.major > 0 ? bumpMajor(parsed) : parsed.minor > 0 ? bumpMinor(parsed) : bumpPatch(parsed)
        inclusive = false
      }
    } else if (token.startsWith('~')) {
      const parsed = normalizeFloorCandidate(token.slice(1))
      if (parsed) {
        candidate = bumpMinor(parsed)
        inclusive = false
      }
    } else if (/^\d+(?:\.x|\.X|\.\*)$/.test(token)) {
      const parsed = normalizeFloorCandidate(token)
      if (parsed) {
        candidate = bumpMajor(parsed)
        inclusive = false
      }
    } else if (/^\d+\.\d+(?:\.x|\.X|\.\*)$/.test(token)) {
      const parsed = normalizeFloorCandidate(token)
      if (parsed) {
        candidate = bumpMinor(parsed)
        inclusive = false
      }
    } else if (/^[v\d]/.test(token) && !token.includes('x') && !token.includes('X') && !token.includes('*')) {
      const parsed = normalizeFloorCandidate(token)
      if (parsed) {
        candidate = parsed
        inclusive = true
      }
    }

    if (!candidate) continue

    if (!upperBound || compareVersionTuples(candidate, upperBound.version) < 0) {
      upperBound = { version: candidate, inclusive }
    }
  }

  return upperBound
}

function extractRangeUpperBound(spec) {
  const clauses = String(spec ?? '')
    .trim()
    .split(/\s*\|\|\s*/)
    .filter(Boolean)

  if (clauses.length === 0) return null

  let upperBound = null
  for (const clause of clauses) {
    const clauseUpperBound = extractClauseUpperBound(clause)
    if (!clauseUpperBound) return null

    if (
      !upperBound ||
      compareVersionTuples(clauseUpperBound.version, upperBound.version) < 0 ||
      (compareVersionTuples(clauseUpperBound.version, upperBound.version) === 0 && !clauseUpperBound.inclusive && upperBound.inclusive)
    ) {
      upperBound = clauseUpperBound
    }
  }

  return upperBound
}

export function isVersionRangeAtLeast(actualSpec, minimumSpec) {
  const actualFloor = extractRangeFloor(actualSpec)
  const minimumFloor = extractRangeFloor(minimumSpec)

  if (!actualFloor || !minimumFloor) return false
  return compareVersionTuples(actualFloor, minimumFloor) >= 0
}

export function isSpecBelowMajor(spec, major) {
  const threshold = { major, minor: 0, patch: 0, prerelease: [] }
  const clauses = String(spec ?? '')
    .trim()
    .split(/\s*\|\|\s*/)
    .filter(Boolean)

  if (clauses.length === 0) return false

  for (const clause of clauses) {
    const clauseUpperBound = extractClauseUpperBound(clause)
    if (!clauseUpperBound) return false

    const comparison = compareVersionTuples(clauseUpperBound.version, threshold)
    if (comparison > 0) return false
    if (comparison === 0 && clauseUpperBound.inclusive) return false
  }

  return true
}
