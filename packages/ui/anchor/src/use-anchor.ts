import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isBrowser } from '@hi-ui/env'
import { isFunction } from '@hi-ui/type-assertion'
import {
  mockDefaultHandlers,
  setAttrStatus,
  getOffsetTop,
  getScrollLeft,
  getScrollTop,
  addDOMEvent,
} from '@hi-ui/dom-utils'
import { mergeRefs } from '@hi-ui/react-utils'
import { useRegistry } from '@hi-ui/use-registry'
import { trimElementId, isValidAnchorId } from './utils'
import { useAnchorContext } from './context'

// 锚点边界扩充距离，保证计算锚点位置更精确
const TARGET_BOUND = 3

export const useAnchor = ({
  offset: offsetProp = 0,
  container,
  onChange,
  ...rest
}: UseAnchorProps) => {
  // 根据页面滚动内容所在位置，得到激活的锚点 id
  const [currentActiveAnchorId, setCurrentActiveAnchorId] = useUncontrolledState<string>(
    '',
    undefined,
    onChange
  )

  const {
    get: getAnchorItemById,
    keys: getAllAnchorItemIds,
    register: registerAnchorId,
    unregister: unregisterAnchorId,
  } = useRegistry<{ offset?: number; element?: HTMLElement }>()

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
      const offset = getAnchorItemById(anchorHref)?.offset ?? offsetProp
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

      if (offsetTop + offset > TARGET_BOUND) continue

      if (maxOffsetTop < offsetTop) {
        maxOffsetTop = offsetTop
        activeAnchorItem = item
      }
    }

    return (activeAnchorItem && activeAnchorItem) || ''
  }, [containerMemo, getAllAnchorItemIds, getOffsetById])

  useEffect(() => {
    if (!isBrowser) return
    if (!containerMemo) return

    const handleScroll = () => {
      const activeAnchorItem = getActiveAnchorItem()
      setCurrentActiveAnchorId(activeAnchorItem)
    }

    handleScroll()
    const cancelEvent = addDOMEvent(containerMemo, 'scroll', handleScroll, false)

    return () => {
      cancelEvent.remove()
    }
  }, [getActiveAnchorItem, containerMemo])

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

      const targetScrollTop = scrollTop + offsetTop + offset + TARGET_BOUND

      containerMemo.scrollTo(getScrollLeft(containerMemo), targetScrollTop)
    },
    [containerMemo, getOffsetById]
  )

  const isActiveAnchorId = useCallback((id: string) => currentActiveAnchorId === id, [
    currentActiveAnchorId,
  ])

  const getAnchorInkProps = useCallback(() => {
    let style: React.CSSProperties | undefined

    const item = getAnchorItemById(currentActiveAnchorId)
    const activeElement = item && item.element

    if (activeElement) {
      const inkPadding = 6
      const inkHeight = activeElement.clientHeight - (inkPadding << 1)
      const inkTop = activeElement.offsetTop + inkPadding

      style = {
        position: 'absolute',
        height: `${inkHeight}px`,
        top: `${inkTop}px`,
      }
    }

    return { style }
  }, [currentActiveAnchorId, getAnchorItemById])

  return {
    rootProps: rest,
    getAnchorInkProps,
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
  onChange?: (href: string) => void
}

export type UseAnchorReturn = ReturnType<typeof useAnchor>

export const useAnchorItem = ({ href = '', offset, ...rest }: UseAnchorItemProps) => {
  const {
    isActiveAnchorId,
    scrollToAnchorItem,
    registerAnchorId,
    unregisterAnchorId,
  } = useAnchorContext()

  const [anchorItemElement, setAnchorItemElement] = useState<HTMLAnchorElement | null>(null)

  // 注入当前 href 及元素到 Anchor
  useEffect(() => {
    if (!isValidAnchorId(href)) return
    if (!anchorItemElement) return

    registerAnchorId(href, {
      offset,
      element: anchorItemElement,
    })

    return () => {
      if (!isValidAnchorId(href)) return

      unregisterAnchorId(href)
    }
  }, [registerAnchorId, unregisterAnchorId, href, offset, anchorItemElement])

  // 首次进入页面时定位到对应的锚点位置
  useEffect(() => {
    const hash = window.location.hash

    !!hash && scrollToAnchorItem(hash)
  }, [scrollToAnchorItem])

  const showActive = isActiveAnchorId(href)

  const getAnchorLinkProps = useCallback(
    (props = {}, ref = null) => {
      return {
        ref: mergeRefs(setAnchorItemElement, ref),
        ...props,
        href,
        'data-active': setAttrStatus(showActive),
        onClick: mockDefaultHandlers((props as any).onClick, (evt: React.MouseEvent) => {
          evt.preventDefault()
          scrollToAnchorItem(href)
        }),
      }
    },
    [showActive, href, scrollToAnchorItem]
  )

  return {
    rootProps: rest,
    getAnchorLinkProps,
    showActive,
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
