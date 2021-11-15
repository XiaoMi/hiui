import React from 'react'

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
  return function bubbledFunc(event: React.SyntheticEvent) {
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
 * 阻止事件的行为，包括默认事件和冒泡
 */
export const stopEvent = (evt: React.SyntheticEvent) => {
  evt.preventDefault()
  evt.stopPropagation()
}
