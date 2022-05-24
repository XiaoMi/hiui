import React, { useRef, useEffect } from 'react'
import { cx } from '@hi-ui/classname'

export const TabInk: React.FC<TabInkProps> = ({
  disabled,
  prefixCls,
  activeItemElement,
  direction,
  activeTabId,
  getTabOffset,
}) => {
  const inkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inkRef.current) return
    if (!activeItemElement) return

    const computedStyle = getComputedStyle(activeItemElement)
    const itemRect = activeItemElement.getBoundingClientRect()
    const offset = getTabOffset(activeTabId)

    let _style: React.CSSProperties

    if (direction === 'vertical') {
      const paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'))
      const paddingBottom = parseFloat(computedStyle.getPropertyValue('padding-bottom'))

      _style = {
        // 2px 保证尽量和文字顶部对齐，减少文本行高的影响
        top: offset + paddingTop + 2 + 'px',
        height: `${itemRect.height - paddingTop - paddingBottom - 4}px`,
        left: '',
        width: '',
      }
    } else {
      const paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left'))
      const paddingRight = parseFloat(computedStyle.getPropertyValue('padding-right'))

      _style = {
        left: offset + paddingLeft + 'px',
        width: `${itemRect.width - paddingRight - paddingLeft}px`,
        top: '',
        height: '',
      }
    }

    Object.assign(inkRef.current.style, _style)
  }, [activeItemElement, direction, activeTabId, getTabOffset])

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
  direction: 'vertical' | 'horizontal'
  activeTabId: React.ReactText
  getTabOffset: (tabId: React.ReactText) => number
}
