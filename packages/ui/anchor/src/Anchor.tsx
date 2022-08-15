import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, isBrowser } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useAnchor, UseAnchorProps } from './use-anchor'
import { AnchorProvider } from './context'

import { AnchorDataItem, FlattedAnchorDataItem } from './types'
import { isFunction, isString } from '@hi-ui/type-assertion'
import { baseFlattenTree } from '@hi-ui/tree-utils'

const ANCHOR_PREFIX = getPrefixCls('anchor')

const NOOP_ARRAY = [] as []

/**
 * TODO: What is Anchor
 */
export const Anchor = forwardRef<HTMLDivElement | null, AnchorProps>(
  (
    {
      prefixCls = ANCHOR_PREFIX,
      role = 'anchor',
      className,
      children,
      offset = 0,
      data = NOOP_ARRAY,
      container,
      onChange,
      ...rest
    },
    ref
  ) => {
    const { rootProps, ...context } = useAnchor(rest)

    const flattedData = useMemo(() => {
      return baseFlattenTree({
        tree: data,
        transform: (node) => {
          const flattedNode = node as FlattedAnchorDataItem
          const raw = node.raw

          flattedNode.id = raw.id
          flattedNode.title = raw.title

          return flattedNode
        },
      }) as FlattedAnchorDataItem[]
    }, [data])

    console.log('flattedData', flattedData)

    // 根据页面滚动内容所在位置，得到激活的锚点
    const [currentActiveAnchor, setCurrentActiveAnchor] = React.useState('')

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

    const getActiveAnchorItem = useCallback(() => {
      let activeAnchorItem = null
      let maxOffsetTop = -Infinity
      // console.log('maxOffsetTop', maxOffsetTop)

      for (let i = 0; i < data.length; ++i) {
        const item = data[i]
        const linkHref = item.id
        const targetId = trimElementId(linkHref)
        if (!targetId) continue

        const targetElement = document.getElementById(targetId)
        if (!targetElement) continue

        const offsetTop = getOffsetTop(targetElement, containerMemo)

        if (offsetTop + offset > 0) continue
        // console.log('offsetTop', offsetTop, offset)

        if (maxOffsetTop < offsetTop) {
          maxOffsetTop = offsetTop
          activeAnchorItem = item
        }
      }

      console.log('activeAnchorItem', activeAnchorItem)

      return (activeAnchorItem && activeAnchorItem.id) || ''
    }, [data, containerMemo, offset])

    React.useEffect(() => {
      if (!isBrowser) return
      if (!containerMemo) return

      const handleScroll = () => {
        const activeAnchorItem = getActiveAnchorItem()
        setCurrentActiveAnchor(activeAnchorItem)
        // const currentScrollTop = getScrollTop(null)
      }

      const cancelEvent = addEventListener(containerMemo, 'scroll', handleScroll, false)

      return () => {
        cancelEvent.remove()
      }
    }, [getActiveAnchorItem, containerMemo])

    console.log('currentActiveAnchor', currentActiveAnchor)

    // 初始计算滚动高亮
    // 点击切换滚动
    // 根据滚动高亮
    const scrollToAnchorItem = useCallback(
      (anchorId: string) => {
        if (!containerMemo) return

        const scrollTop = getScrollTop(containerMemo)
        const targetId = trimElementId(anchorId)
        if (!targetId) return

        const targetElement = document.getElementById(targetId)
        if (!targetElement) return

        const offsetTop = getOffsetTop(targetElement, containerMemo)
        const targetScrollTop = scrollTop + offsetTop + offset

        containerMemo.scrollTo(getScrollLeft(containerMemo), targetScrollTop)
      },
      [containerMemo, offset]
    )

    // React.useEffect(() => {
    //   if (!isBrowser) return
    //   const node = document.getElementById(currentActiveAnchor)
    //   if (!node) return

    //   node.scrollIntoView()

    //   window.requestAnimationFrame(() => {
    //     const currentScrollTop = getScrollTop()
    //     window.scrollTo(0, currentScrollTop + offset)
    //   })
    // }, [currentActiveAnchor, offset])

    const cls = cx(prefixCls, className)

    return (
      <AnchorProvider value={context}>
        <div ref={ref} role={role} className={cls} {...rest}>
          <ul>
            {flattedData.map((item, index) => {
              const active = currentActiveAnchor === item.id
              return (
                <li key={index}>
                  <a
                    className={cx('link', active && 'active')}
                    id={`#${item.id}`}
                    onClick={(evt) => {
                      evt.preventDefault()
                      scrollToAnchorItem(item.id as string)
                    }}
                    style={{ paddingLeft: `${16 + item.depth * 12}px` }}
                  >
                    {item.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </AnchorProvider>
    )
  }
)

export interface AnchorProps extends HiBaseHTMLProps<'div'>, UseAnchorProps {
  /**
   * 锚点的列表数据
   */
  data?: AnchorDataItem[]
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

if (__DEV__) {
  Anchor.displayName = 'Anchor'
}

/**
 * 获取滚动到顶部的距离
 */
function getScrollLeft(el?: Window | Element | null | undefined) {
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
function getScrollTop(el?: Window | Element | null | undefined) {
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

const trimElementId = (id?: string) => {
  if (isString(id)) {
    if (id.startsWith('#')) return id.slice(1)
    return id
  }
  return ''
}

function getOffsetTop(
  element: HTMLElement,
  container: HTMLElement | Window | null | undefined
): number {
  if (!element.getClientRects().length) {
    return 0
  }

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
