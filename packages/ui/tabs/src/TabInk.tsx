import React, { useRef, useEffect, useCallback } from 'react'
import { cx } from '@hi-ui/classname'
import { useResizeObserver } from './hooks'

export const TabInk: React.FC<TabInkProps> = ({
  disabled,
  prefixCls,
  activeItemElement,
  activeTabId,
  getTabOffset,
  showHorizontal,
  containerElement,
}) => {
  const inkRef = useRef<HTMLDivElement>(null)

  const setTabLnkPositionStyle = useCallback(() => {
    if (!inkRef.current) return
    if (!activeItemElement) return

    const computedStyle = getComputedStyle(activeItemElement)
    // issue: https://github.com/XiaoMi/hiui/issues/2937
    // 当设置transform缩放后，getBoundingClientRect 获取的值不准确，所以这里使用offset
    // const itemRect = activeItemElement.getBoundingClientRect()
    const offset = getTabOffset(activeTabId)

    let _style: React.CSSProperties

    if (!showHorizontal) {
      const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'))
      const paddingBottom = parseFloat(computedStyle.getPropertyValue('padding-bottom'))
      const height = activeItemElement.offsetHeight

      _style = {
        // 2px 保证尽量和文字顶部对齐，减少文本行高的影响
        top: offset + paddingTop + 2 + 'px',
        height: `${height - paddingTop - paddingBottom - 4}px`,
        left: '',
        width: '',
      }
    } else {
      const paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left'))
      const paddingRight = parseFloat(computedStyle.getPropertyValue('padding-right'))
      const width = activeItemElement.offsetWidth

      _style = {
        left: offset + paddingLeft + 'px',
        width: `${width - paddingRight - paddingLeft}px`,
        top: '',
        height: '',
      }
    }
    Object.assign(inkRef.current.style, _style)
  }, [activeItemElement, getTabOffset, activeTabId, showHorizontal])

  useEffect(() => {
    setTabLnkPositionStyle()
  }, [setTabLnkPositionStyle])

  useResizeObserver({
    element: activeItemElement,
    getSize: (element) => {
      const itemRect = element.getBoundingClientRect()
      return showHorizontal ? itemRect.width : itemRect.height
    },
    onResize: setTabLnkPositionStyle,
  })

  useResizeObserver({
    element: containerElement,
    getSize: (element) => {
      const itemRect = element.getBoundingClientRect()
      return showHorizontal ? itemRect.width : itemRect.height
    },
    onResize: setTabLnkPositionStyle,
  })

  return (
    <div
      className={cx(`${prefixCls}__ink`, {
        [`${prefixCls}__ink--disabled`]: disabled,
      })}
      ref={inkRef}
    />
  )
}

interface TabInkProps {
  prefixCls?: string
  disabled?: boolean
  activeItemElement: HTMLElement | null
  containerElement: HTMLElement | null
  activeTabId: React.ReactText
  getTabOffset: (tabId: React.ReactText) => number
  showHorizontal: boolean
}
