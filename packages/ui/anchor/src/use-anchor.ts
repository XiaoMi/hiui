import React, { useCallback, useEffect, useMemo } from 'react'
import { isBrowser } from '@hi-ui/env'
import { isFunction } from '@hi-ui/type-assertion'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import {
  trimElementId,
  getOffsetTop,
  getScrollLeft,
  getScrollTop,
  addEventListener,
  isValidAnchorId,
} from './utils'
import { useAnchorContext } from './context'
import { useRegistry } from './hooks'

export const useAnchor = ({
  offset: offsetProp = 0,
  container,
  onChange,
  ...rest
}: UseAnchorProps) => {
  // 根据页面滚动内容所在位置，得到激活的锚点 id
  const [currentActiveAnchorId, setCurrentActiveAnchorId] = React.useState('')

  const {
    get: getAnchorItemById,
    keys: getAllAnchorItemIds,
    register: registerAnchorId,
    unregister: unregisterAnchorId,
  } = useRegistry<number | undefined>()

  const containerMemo = useMemo(() => {
    if (!isBrowser) return null

    if (container === undefined) {
      return window
    }

    if (isFunction(container)) {
      return container()
    }

    return container
  }, [container])

  const getOffsetById = useCallback(
    (anchorHref: string) => {
      const offset = getAnchorItemById(anchorHref) ?? offsetProp
      return offset
    },
    [getAnchorItemById, offsetProp]
  )

  const getActiveAnchorItem = useCallback(() => {
    const data = getAllAnchorItemIds()

    let activeAnchorItem = null
    let maxOffsetTop = -Infinity

    for (let i = 0; i < data.length; ++i) {
      const item = data[i]
      const linkHref = item
      const targetId = trimElementId(linkHref)
      if (!targetId) continue

      const targetElement = document.getElementById(targetId)
      if (!targetElement) continue

      const offsetTop = getOffsetTop(targetElement, containerMemo)
      const offset = getOffsetById(linkHref)

      if (offsetTop + offset > 0) continue
      // console.log('offsetTop', offsetTop, offset)

      if (maxOffsetTop < offsetTop) {
        maxOffsetTop = offsetTop
        activeAnchorItem = item
      }
    }

    console.log('activeAnchorItem', activeAnchorItem)

    return (activeAnchorItem && activeAnchorItem) || ''
  }, [containerMemo, getAllAnchorItemIds, getOffsetById])

  React.useEffect(() => {
    if (!isBrowser) return
    if (!containerMemo) return

    const handleScroll = () => {
      const activeAnchorItem = getActiveAnchorItem()
      setCurrentActiveAnchorId(activeAnchorItem)
      // const currentScrollTop = getScrollTop(null)
    }

    handleScroll()
    const cancelEvent = addEventListener(containerMemo, 'scroll', handleScroll, false)

    return () => {
      cancelEvent.remove()
    }
  }, [getActiveAnchorItem, containerMemo])

  console.log('currentActiveAnchorId', currentActiveAnchorId)

  // 初始计算滚动高亮
  // 点击切换滚动
  // 根据滚动高亮
  const scrollToAnchorItem = useCallback(
    (anchorHref: string | undefined) => {
      if (!anchorHref) return
      if (!containerMemo) return

      const scrollTop = getScrollTop(containerMemo)
      const targetId = trimElementId(anchorHref)
      if (!targetId) return

      const targetElement = document.getElementById(targetId)
      if (!targetElement) return

      const offsetTop = getOffsetTop(targetElement, containerMemo)
      const offset = getOffsetById(anchorHref)

      const targetScrollTop = scrollTop + offsetTop + offset

      containerMemo.scrollTo(getScrollLeft(containerMemo), targetScrollTop)
    },
    [containerMemo, getOffsetById]
  )

  const isActiveAnchorId = (id: string) => {
    return currentActiveAnchorId === id
  }

  return {
    rootProps: rest,
    scrollToAnchorItem,
    isActiveAnchorId,
    registerAnchorId,
    unregisterAnchorId,
  }
}

export interface UseAnchorProps {
  /**
   * 指定触发滚动的容器
   */
  container?: HTMLElement | null | (() => HTMLElement | null)
  /**
   * 滚动至距离目标锚点位置指定的偏移量 `offset` 时触发
   */
  offset?: number
  /**
   * 锚点切换时触发
   */
  onChange?: (id: string) => void
}

export type UseAnchorReturn = ReturnType<typeof useAnchor>

export const useAnchorItem = ({ href = '', offset, ...rest }: UseAnchorItemProps) => {
  const {
    isActiveAnchorId,
    scrollToAnchorItem,
    registerAnchorId,
    unregisterAnchorId,
  } = useAnchorContext()

  // 注入当前 field 及其验证规则到 Form
  useEffect(() => {
    if (!isValidAnchorId(href)) return

    registerAnchorId(href, offset)

    return () => {
      if (!isValidAnchorId(href)) return

      unregisterAnchorId(href)
    }
  }, [registerAnchorId, unregisterAnchorId, href, offset])

  return {
    ...rest,
    href,
    'data-active': isActiveAnchorId(href),
    onClick: mockDefaultHandlers((rest as any).onClick, (evt: React.MouseEvent) => {
      evt.preventDefault()
      scrollToAnchorItem(href)
    }),
  }
}

export interface UseAnchorItemProps {
  /**
   * 设置锚点的跳转链接
   */
  href?: string
  /**
   * 滚动至距离目标锚点位置指定的偏移量 `offset` 时触发，优先级高于 `AnchorProps` 中的设置
   */
  offset?: number
}

export type UseAnchorItemReturn = ReturnType<typeof useAnchorItem>
