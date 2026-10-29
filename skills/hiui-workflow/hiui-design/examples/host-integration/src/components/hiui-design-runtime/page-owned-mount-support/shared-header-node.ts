const EXPLICIT_SHARED_HEADER_SLOT_SELECTORS = [
  '[data-hiui-page-header-slot="true"]',
  '[data-page-header-slot="true"]',
]
const LEGACY_SHARED_HEADER_SELECTOR = '[role="page-header"]'
const PAGE_OWNED_BOUNDARY_SELECTOR = '[data-page-owned-mount-boundary="true"]'
const CONTENT_OUTLET_SELECTORS = [
  '[data-hiui-main-content-outlet="true"]',
  '[role="content"]',
  '[role="main-content"]',
]

function readClassName(node: Element | null) {
  return typeof node?.className === 'string' ? node.className : ''
}

function readTextContent(node: Node | null) {
  return typeof node?.textContent === 'string' ? node.textContent.trim() : ''
}

function isInsidePageOwnedBoundary(node: Element, boundaryNode: HTMLElement | null) {
  if (boundaryNode?.contains(node)) {
    return true
  }
  if (typeof node.closest === 'function') {
    return Boolean(node.closest(PAGE_OWNED_BOUNDARY_SELECTOR))
  }
  return false
}

function isSuppressedPageOwnedHeader(node: Element) {
  return node.getAttribute('data-page-owned-header-suppressed') === 'true'
}

function isExternalLegacyPageHeader(node: Element, boundaryNode: HTMLElement | null) {
  if (isSuppressedPageOwnedHeader(node)) return false
  if (isInsidePageOwnedBoundary(node, boundaryNode)) return false
  return true
}

function isHeaderCarrierNode(node: Element) {
  const tagName = String(node.tagName || '').toLowerCase()
  const role = String(node.getAttribute('role') || '').toLowerCase()
  const className = readClassName(node)

  return (
    tagName === 'header' ||
    role === 'banner' ||
    /(^|[\s_-])header([\s_-]|$)/i.test(className)
  )
}

function isEmptyHeaderCarrier(node: Element, boundaryNode: HTMLElement | null) {
  if (!isHeaderCarrierNode(node)) return false
  if (isInsidePageOwnedBoundary(node, boundaryNode)) return false
  if (readTextContent(node) !== '') return false

  for (const headerNode of Array.from(node.querySelectorAll(LEGACY_SHARED_HEADER_SELECTOR))) {
    if (isExternalLegacyPageHeader(headerNode, boundaryNode)) {
      return false
    }
  }

  return true
}

function findLegacySharedHeaderCarrier(boundaryNode: HTMLElement | null) {
  if (!boundaryNode || typeof boundaryNode.closest !== 'function') return null

  const contentOutletNode = CONTENT_OUTLET_SELECTORS.reduce<HTMLElement | null>((matchedNode, selector) => {
    if (matchedNode) return matchedNode
    const nextNode = boundaryNode.closest(selector)
    return nextNode instanceof HTMLElement ? nextNode : null
  }, null)
  if (!contentOutletNode) return null

  for (
    let candidate = contentOutletNode.previousElementSibling;
    candidate;
    candidate = candidate.previousElementSibling
  ) {
    if (candidate instanceof HTMLElement && isEmptyHeaderCarrier(candidate, boundaryNode)) {
      return candidate
    }
  }

  const contentParent = contentOutletNode.parentElement
  if (!contentParent?.children) return null

  for (const candidate of Array.from(contentParent.children)) {
    if (candidate === contentOutletNode) break
    if (candidate instanceof HTMLElement && isEmptyHeaderCarrier(candidate, boundaryNode)) {
      return candidate
    }
  }

  return null
}

export function getDefaultSharedHeaderNode(
  boundaryNode: HTMLElement | null = null,
  doc: Pick<Document, 'querySelector' | 'querySelectorAll'> | null = globalThis.document
): HTMLElement | null {
  if (!doc || typeof doc.querySelector !== 'function') return null

  for (const selector of EXPLICIT_SHARED_HEADER_SLOT_SELECTORS) {
    const node = doc.querySelector(selector)
    if (node instanceof HTMLElement) return node
  }

  if (typeof doc.querySelectorAll !== 'function') return null

  for (const node of Array.from(doc.querySelectorAll(LEGACY_SHARED_HEADER_SELECTOR))) {
    if (node instanceof HTMLElement && isExternalLegacyPageHeader(node, boundaryNode)) {
      return node
    }
  }

  return findLegacySharedHeaderCarrier(boundaryNode)
}
