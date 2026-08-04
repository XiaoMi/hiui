function normalizeStyleValue(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function isOneOf(value, acceptedValues) {
  return acceptedValues.includes(normalizeStyleValue(value))
}

export function pushSurfaceIssue(issues, code, message, severity = 'error') {
  issues.push({ code, message, severity })
}

export function runQueryFilterSurfaceCheck({ result = {}, profile = 'preview' } = {}) {
  const issues = []
  if (Number(result.queryFilterCount || 0) > 1) {
    pushSurfaceIssue(issues, 'duplicate-query-filter', 'runtime DOM contains more than one query-filter surface')
  }
  if (result.duplicateKeywordSearch === true) {
    pushSurfaceIssue(issues, 'duplicate-keyword-search', 'runtime DOM contains duplicate keyword search controls')
  }
  return {
    ok: profile === 'delivery' ? issues.filter((issue) => issue.severity !== 'warning').length === 0 : true,
    issues,
  }
}

export function runWhiteBodySurfaceCheck({ root = null, whiteBody = null, rootStyles = null, profile = 'preview' } = {}) {
  const issues = []
  const metrics = {
    whiteBodyBottomDelta: root && whiteBody ? Math.abs(whiteBody.bottom - root.bottom) : null,
  }

  if (root && whiteBody && whiteBody.width > root.width + 1) {
    pushSurfaceIssue(issues, 'white-body-overflows-root', 'white body must not overflow the managed page root width')
  }
  if (root && whiteBody && metrics.whiteBodyBottomDelta > 8) {
    pushSurfaceIssue(issues, 'white-body-bottom-detached-from-root', 'white body bottom must stay within 8px of managed page root bottom')
  }

  if (rootStyles) {
    const requiredRootStyles = [
      ['display', ['flex'], 'root-style-display', 'runtime root computed style must be display:flex'],
      ['flexDirection', ['column'], 'root-style-flex-direction', 'runtime root computed style must be flex-direction:column'],
      ['minHeight', ['0px', '0'], 'root-style-min-height', 'runtime root computed style must be min-height:0'],
      ['overflow', ['hidden'], 'root-style-overflow', 'runtime root computed style must be overflow:hidden'],
    ]
    for (const [property, acceptedValues, code, message] of requiredRootStyles) {
      if (!isOneOf(rootStyles[property], acceptedValues)) pushSurfaceIssue(issues, code, message, profile === 'delivery' ? 'error' : 'warning')
    }
  } else {
    pushSurfaceIssue(issues, 'computed-style-missing', 'runtime evidence should include computed root styles for flex height-chain validation', profile === 'delivery' ? 'error' : 'warning')
  }

  return {
    ok: profile === 'delivery' ? issues.filter((issue) => issue.severity !== 'warning').length === 0 : true,
    issues,
    metrics,
  }
}
