import React, { useRef, useEffect } from 'react'
import { cx } from '@hi-ui/classname'

export const TabInk: React.FC<TabInkProps> = ({
  disabled,
  prefixCls,
  itemRef,
  tabListRef,
  direction,
  translate,
}) => {
  const inkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inkRef.current && itemRef && tabListRef) {
      const itemRect = itemRef.getBoundingClientRect()
      const listRect = tabListRef.getBoundingClientRect()
      let _style: React.CSSProperties = {}
      if (direction === 'vertical') {
        _style = {
          top: `${itemRect.top - listRect.top - translate + 2 + 8}px`,
          height: `${itemRect.height - 4 - 16}px`,
          left: '',
          width: '',
        }
      } else {
        _style = {
          left: `${itemRect.left - listRect.left - translate + 20}px`,
          width: `${itemRect.width - 40}px`,
          top: '',
          height: '',
        }
      }
      Object.assign(inkRef.current.style, _style)
    }
  }, [itemRef, tabListRef, direction])

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
  disabled?: boolean
  prefixCls?: string
  itemRef: HTMLElement
  tabListRef: HTMLElement
  direction: 'vertical' | 'horizontal'
  translate: number
}
