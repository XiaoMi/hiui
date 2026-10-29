function parseSimpleVersion(spec) {
  const match = String(spec || '')
    .trim()
    .match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/)
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2] ?? 0),
    patch: Number(match[3] ?? 0),
  }
}

function compareSimpleVersions(left, right) {
  if (left.major !== right.major) return left.major - right.major
  if (left.minor !== right.minor) return left.minor - right.minor
  return left.patch - right.patch
}

function nextCaretUpperBound(version) {
  if (version.major > 0) return { major: version.major + 1, minor: 0, patch: 0 }
  if (version.minor > 0) return { major: 0, minor: version.minor + 1, patch: 0 }
  return { major: 0, minor: 0, patch: version.patch + 1 }
}

function nextTildeUpperBound(version) {
  return {
    major: version.major,
    minor: version.minor + 1,
    patch: 0,
  }
}

function parseSimpleRange(spec) {
  const normalized = String(spec || '').trim()
  if (!normalized || normalized.includes('||')) return null

  if (normalized.startsWith('^')) {
    const version = parseSimpleVersion(normalized.slice(1))
    if (!version) return null
    return {
      lower: { version, inclusive: true },
      upper: { version: nextCaretUpperBound(version), inclusive: false },
    }
  }

  if (normalized.startsWith('~')) {
    const version = parseSimpleVersion(normalized.slice(1))
    if (!version) return null
    return {
      lower: { version, inclusive: true },
      upper: { version: nextTildeUpperBound(version), inclusive: false },
    }
  }

  const exactVersion = parseSimpleVersion(normalized)
  if (exactVersion) {
    return {
      lower: { version: exactVersion, inclusive: true },
      upper: { version: exactVersion, inclusive: true },
    }
  }

  const comparators = normalized.split(/\s+/).filter(Boolean)
  if (comparators.length === 0) return null

  const range = { lower: null, upper: null }
  for (const comparator of comparators) {
    const match = comparator.match(/^(>=|>|<=|<)(.+)$/)
    if (!match) return null
    const version = parseSimpleVersion(match[2])
    if (!version) return null
    const operator = match[1]

    if (operator === '>=' || operator === '>') {
      const candidate = { version, inclusive: operator === '>=' }
      if (!range.lower) {
        range.lower = candidate
        continue
      }
      const comparison = compareSimpleVersions(candidate.version, range.lower.version)
      if (comparison > 0 || (comparison === 0 && !candidate.inclusive && range.lower.inclusive)) {
        range.lower = candidate
      }
      continue
    }

    const candidate = { version, inclusive: operator === '<=' }
    if (!range.upper) {
      range.upper = candidate
      continue
    }
    const comparison = compareSimpleVersions(candidate.version, range.upper.version)
    if (comparison < 0 || (comparison === 0 && !candidate.inclusive && range.upper.inclusive)) {
      range.upper = candidate
    }
  }

  return range
}

function parseSimpleRangeSet(spec) {
  const normalized = String(spec || '').trim()
  if (!normalized) return null

  const parts = normalized.split('||').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return null

  const ranges = parts.map((part) => parseSimpleRange(part))
  return ranges.every(Boolean) ? ranges : null
}

function isLowerBoundCompatible(actualLower, expectedLower) {
  if (!expectedLower) return true
  if (!actualLower) return false
  const comparison = compareSimpleVersions(actualLower.version, expectedLower.version)
  if (comparison > 0) return true
  if (comparison < 0) return false
  return !actualLower.inclusive || expectedLower.inclusive
}

function isUpperBoundCompatible(actualUpper, expectedUpper) {
  if (!expectedUpper) return true
  if (!actualUpper) return false
  const comparison = compareSimpleVersions(actualUpper.version, expectedUpper.version)
  if (comparison < 0) return true
  if (comparison > 0) return false
  return !actualUpper.inclusive || expectedUpper.inclusive
}

function isVersionCompatible(actual, expected) {
  if (!expected) return true
  const normalizedActual = String(actual || '').trim()
  const normalizedExpected = String(expected || '').trim()
  if (!normalizedActual) return false
  if (normalizedActual === normalizedExpected) return true

  const actualRanges = parseSimpleRangeSet(normalizedActual)
  const expectedRanges = parseSimpleRangeSet(normalizedExpected)
  if (actualRanges && expectedRanges) {
    return actualRanges.every((actualRange) =>
      expectedRanges.some(
        (expectedRange) =>
          isLowerBoundCompatible(actualRange.lower, expectedRange.lower) &&
          isUpperBoundCompatible(actualRange.upper, expectedRange.upper)
      )
    )
  }

  if (normalizedExpected.startsWith('^')) {
    return normalizedActual === normalizedExpected || normalizedActual === normalizedExpected.slice(1)
  }
  if (normalizedExpected.startsWith('~')) {
    return normalizedActual === normalizedExpected || normalizedActual === normalizedExpected.slice(1)
  }
  return normalizedActual === normalizedExpected
}

function parseVersionFloor(spec) {
  const match = String(spec || '')
    .trim()
    .match(/(?:^|[<>=~^ ])(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([0-9A-Za-z-.]+))?/)
  if (!match) return null

  const prereleaseParts = String(match[4] || '')
    .split('.')
    .filter(Boolean)
  const prereleaseChannel = prereleaseParts[0] || ''
  const prereleaseSequenceRaw = prereleaseParts[prereleaseParts.length - 1] || ''
  const prereleaseSequence = /^\d+$/.test(prereleaseSequenceRaw)
    ? Number(prereleaseSequenceRaw)
    : null

  return {
    major: Number(match[1]),
    minor: Number(match[2] ?? 0),
    patch: Number(match[3] ?? 0),
    prerelease: match[4] || '',
    prereleaseChannel,
    prereleaseSequence,
  }
}

function compareVersionCore(left, right) {
  if (left.major !== right.major) return left.major - right.major
  if (left.minor !== right.minor) return left.minor - right.minor
  return left.patch - right.patch
}

export {
  compareSimpleVersions,
  compareVersionCore,
  isVersionCompatible,
  parseSimpleRange,
  parseSimpleRangeSet,
  parseSimpleVersion,
  parseVersionFloor,
}
