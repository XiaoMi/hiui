function toPosixPath(inputPath) {
  return String(inputPath || '').replace(/\\/g, '/').replace(/^\.\/+/, '')
}

export function classifyTypicalPageTargetPath(inputPath) {
  const pagePath = toPosixPath(inputPath)

  if (!pagePath) {
    return {
      role: 'missing',
      isTypicalPageReuseAsset: false,
      isBusinessManagedPageTarget: false,
    }
  }

  if (!pagePath.startsWith('src/typical-page-reuse/')) {
    return {
      role: 'business-managed-page-target',
      isTypicalPageReuseAsset: false,
      isBusinessManagedPageTarget: true,
    }
  }

  if (pagePath.startsWith('src/typical-page-reuse/pages/')) {
    return {
      role: 'example-gallery-page',
      isTypicalPageReuseAsset: true,
      isBusinessManagedPageTarget: false,
    }
  }

  if (pagePath.startsWith('src/typical-page-reuse/routes/')) {
    return {
      role: 'example-gallery-route',
      isTypicalPageReuseAsset: true,
      isBusinessManagedPageTarget: false,
    }
  }

  return {
    role: 'typical-page-reuse-infrastructure',
    isTypicalPageReuseAsset: true,
    isBusinessManagedPageTarget: false,
  }
}

export function buildTypicalPageReuseTargetError(inputPath, commandName = 'typical-page command') {
  const pagePath = toPosixPath(inputPath)
  const ownership = classifyTypicalPageTargetPath(pagePath)

  if (!ownership.isTypicalPageReuseAsset) {
    return ''
  }

  return `${commandName} refused ${pagePath}: src/typical-page-reuse belongs to the host-integration example gallery, smoke baseline, and reusable shell assets, not business managed pages. Do not run start-page, preflight, or write-contract against this path. Generate or copy the typical page into a business route such as src/pages/<business-page>/index.jsx or src/views/<business-page>/index.tsx, then register that business route. Only modify src/typical-page-reuse explicitly for example-gallery or smoke-baseline maintenance.`
}

export function getTypicalPageReuseBlockingReason(inputPath) {
  const message = buildTypicalPageReuseTargetError(inputPath, 'plan-page-task')
  return message
    ? `${message} Route ownership must be resolved before implementation.`
    : ''
}
