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

// /**
//  * 获取用于承载组件的容器，将挂载在 body 下面
//  *
//  * @param selector 以 `.` 开头的选择器类
//  * @returns 容器元素
//  */
// export const getContainer = (selector: string, options: any = {}) => {
//   let { tagName = 'div', doc = document, parent } = options

//   let rootElm = doc.querySelector(selector)

//   if (rootElm) return rootElm

//   rootElm = doc.createElement(tagName)

//   if (!rootElm) {
//     invariant(false, 'The tagName is not a valid html element.')
//     rootElm = doc.createElement('div')
//   }

//   rootElm.className = selector.slice(1)

//   if (!parent) {
//     parent = doc.body
//   }

//   parent.appendChild(rootElm)

//   return rootElm
// }

// /**
//  * 从 DOM 中移除指定的承载容器
//  *
//  * @param selector 以 `.` 开头的选择器类
//  */
// export const removeContainer = (selector: string, doc = document) => {
//   const rootElm = doc.querySelector(selector)

//   if (rootElm && rootElm.parentNode) {
//     rootElm.parentNode.removeChild(rootElm)
//   }
// }

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
