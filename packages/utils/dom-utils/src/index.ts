import React from 'react'
import { isBrowser } from '@hi-ui/env'

/**
 * 隐藏 dom 样式
 */
export const hiddenStyle: React.CSSProperties = {
  position: 'absolute',
  border: 0,
  margin: 0,
  opacity: 0,
  overflow: 'hidden',
}

/**
 * 模拟事件默认事件处理机制，以此执行传入的事件处理器
 *
 * @param handlers
 * @returns
 * @ref https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
 */
export function mockDefaultHandlers<T extends React.ReactEventHandler<any>>(
  ...handlers: (T | undefined)[]
) {
  return function mockedDefaultHandler(event: React.SyntheticEvent) {
    handlers.some((handler) => {
      if (handler) {
        // handler 执行中，可以阻止默认行为，即将 `defaultPrevented` 置为 `true`
        handler(event)
      }
      return event.defaultPrevented
    })
  }
}

/**
 * 设置 html  data 属性，表示状态
 */
export const setAttrStatus = (bool?: boolean) => (bool ? '' : undefined)

/**
 * 设置 html  aria 属性
 */
export const setAttrAria = (bool?: boolean) => (bool ? true : undefined)

/**
 * 设置 html  data 属性的 key
 */
export const setAttrDataKey = (key: string) => (key.startsWith('data-') ? key : `data-${key}`)

/**
 * 阻止事件的行为，包括默认事件和冒泡
 */
export const stopEvent = (evt?: React.SyntheticEvent) => {
  evt?.preventDefault()
  evt?.stopPropagation()
}

export const replaceChildren = (parentNode: HTMLElement, addedNodes: Element | Text) => {
  while (parentNode.lastChild) {
    parentNode.removeChild(parentNode.lastChild)
  }
  parentNode.append(addedNodes)
}

export const injectStyle = (css: string) => {
  if (!css || !isBrowser) return

  const cssText = document.createTextNode(css)

  const headElement = document.head || document.querySelector('head')
  const styleElement = document.createElement('style')

  styleElement.appendChild(cssText)
  headElement.appendChild(styleElement)

  return styleElement
}

export const replaceStyle = (dataKey: string, css: string, dataValue = '') => {
  if (!css || !isBrowser) return

  const cssText = document.createTextNode(css)

  const headElement = document.head || document.querySelector('head')
  const attr = setAttrDataKey(dataKey)

  let styleElement = Array.from(headElement.children).find(
    (node) => node.tagName === 'STYLE' && node.hasAttribute(attr)
  ) as HTMLStyleElement | undefined

  if (!styleElement) {
    styleElement = document.createElement('style')

    styleElement.appendChild(cssText)
    headElement.appendChild(styleElement)

    styleElement.setAttribute(attr, dataValue)
  } else {
    replaceChildren(styleElement, cssText)

    if (styleElement.getAttribute(attr) !== dataValue) {
      styleElement.setAttribute(attr, dataValue)
    }
  }

  return styleElement
}

/**
 * Add DOM Event listeners easily
 */
export const addDOMEvent = (
  target: HTMLElement | Window,
  eventType: string,
  callback: (evt: Event) => void,
  option: boolean | object
) => {
  target.addEventListener?.(eventType, callback, option)

  return {
    remove: () => {
      target.removeEventListener?.(eventType, callback, option)
    },
  }
}

/**
 * 获取滚动到左侧的距离
 */
export const getScrollLeft = (el?: Window | Element | null | undefined) => {
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
export const getScrollTop = (el?: Window | Element | null | undefined) => {
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

/**
 * 获取 DOM 元素到顶部的 offsetTop
 */
export const getOffsetTop = (
  element: HTMLElement,
  container: HTMLElement | Window | null | undefined
): number => {
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
