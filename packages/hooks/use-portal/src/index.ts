import React, { useRef, useEffect, useCallback, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

export type UsePortalReturnPortal = ({
  children,
}: PropsWithChildren<any>) => React.ReactPortal | null

/**
 *
 *
 * @param selector
 * @returns
 */

export const usePortal = (selector: string) => {
  const portalElRef = useRef<Element | undefined>()

  const destroy = useCallback(() => {
    if (portalElRef.current) {
      portalElRef.current.parentElement?.removeChild(portalElRef.current)
      portalElRef.current = undefined
    } else {
      removeContainer(selector)
    }
  }, [])

  useEffect(() => {
    portalElRef.current = getContainer(selector)

    return () => {
      destroy()
    }
  }, [selector, destroy])

  const Portal: UsePortalReturnPortal = useCallback(({ children }) => {
    return portalElRef.current ? createPortal(children, portalElRef.current) : null
  }, [])

  return [Portal, destroy] as const
}

/**
 * 获取用于承载组件的容器，将挂载在 body 下面
 *
 * @param selector 以 `.` 开头的选择器类
 * @returns 容器元素
 */
export const getContainer = (selector: string) => {
  let rootElm = document.querySelector(selector)

  if (rootElm) return rootElm

  rootElm = document.createElement('div')
  rootElm.className = selector.slice(1)
  document.body.appendChild(rootElm)
  return rootElm
}

/**
 * 从 DOM 中移除指定的承载容器
 *
 * @param selector 以 `.` 开头的选择器类
 */
export const removeContainer = (selector: string) => {
  const rootElm = document.querySelector(selector)

  if (rootElm) {
    rootElm.parentElement?.removeChild(rootElm)
  }
}
