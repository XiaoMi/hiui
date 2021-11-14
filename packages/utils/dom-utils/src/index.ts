import React from 'react'

/**
 * 模拟事件默认事件处理机制，以此执行传入的事件处理器
 *
 * @param handlers
 * @returns
 * @ref https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
 */
export function mockDefaultEventHandlers<T extends React.ReactEventHandler<any>>(
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
