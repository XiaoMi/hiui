import { isBrowser } from '@hi-ui/env'
import { isString } from '@hi-ui/type-assertion'

/**
 * 获取滚动到顶部的距离
 */
export function getScrollLeft(el?: Window | Element | null | undefined) {
  if (!isBrowser) return 0
  if (el === undefined) {
    el = window
  }

  if (!el) return 0

  return (
    (el === window
      ? Math.ceil(window.pageXOffset || window.scrollX)
      : (el as Element).scrollLeft) || 0
  )
}

/**
 * 获取滚动到顶部的距离
 */
export function getScrollTop(el?: Window | Element | null | undefined) {
  if (!isBrowser) return 0
  if (el === undefined) {
    el = window
  }

  if (!el) return 0

  return (
    (el === window ? Math.ceil(window.pageYOffset || window.scrollY) : (el as Element).scrollTop) ||
    0
  )
}

export function getOffsetTop(
  element: HTMLElement,
  container: HTMLElement | Window | null | undefined
): number {
  if (!element.getClientRects().length) return 0

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (!container || container === window) {
      container = element.ownerDocument!.documentElement!
      return rect.top - container.clientTop
    }

    return rect.top - (container as HTMLElement).getBoundingClientRect().top
  }

  return rect.top
}

export function addEventListener(
  target: HTMLElement | Window,
  eventType: string,
  callback: any,
  option: any
) {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option)
  }
  return {
    remove: () => {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, callback, option)
      }
    },
  }
}

export const isValidAnchorId = (id?: string) => {
  if (!isString(id)) return false

  id = id.trim()

  if (!id) return false

  return id[0] === '#' && id.length > 1
}

export const trimElementId = (id?: string) => {
  if (isString(id)) {
    id = id.trim()
    if (id.startsWith('#')) return id.slice(1)
    return id
  }
  return ''
}
