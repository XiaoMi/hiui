function normalizeRoutePath(path: string | undefined) {
  if (!path) return ''
  if (path === '/') return '/'

  return String(path).replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '')
}

function normalizeLocationPath(path: string | undefined) {
  const normalized = normalizeRoutePath(path)
  return normalized || '/'
}

function joinRoutePath(parentPath: string | undefined, routePath: string | undefined) {
  const parent = normalizeRoutePath(parentPath)
  const seg = normalizeRoutePath(routePath)

  if (seg === '/') return parent || '/'
  if (!parent || parent === '/') return seg || parent
  if (!seg) return parent

  return `${parent}/${seg}`
}

export function stripRouteBasePath(pathname: string | undefined, routeBasePath = '') {
  const normalizedPath = normalizeLocationPath(pathname)
  const normalizedBase = normalizeRoutePath(routeBasePath)

  if (!normalizedBase || normalizedBase === '/') return normalizedPath
  if (normalizedPath === normalizedBase) return '/'
  if (normalizedPath.startsWith(`${normalizedBase}/`)) {
    return normalizedPath.slice(normalizedBase.length + 1) || '/'
  }

  return normalizedPath
}

export function buildNavigationPath(path: string | undefined, routeBasePath = '') {
  const normalizedPath = normalizeLocationPath(path)
  const normalizedBase = normalizeRoutePath(routeBasePath)

  if (!normalizedBase || normalizedBase === '/') {
    return normalizedPath === '/' ? '/' : `/${normalizedPath}`
  }

  if (normalizedPath === '/') {
    return `/${normalizedBase}`
  }

  return `/${joinRoutePath(normalizedBase, normalizedPath)}`
}
