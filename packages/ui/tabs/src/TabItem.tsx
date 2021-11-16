import React, { forwardRef, useCallback } from 'react'
import { TabPaneProps } from './TabPane'
import { cx } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

interface TabItemProps extends TabPaneProps {
  active: boolean
  onTabClick: (key: string) => void
  prefixCls?: string
}

export const TabItem = forwardRef<HTMLDivElement | null, TabItemProps>(
  ({ className, style, disabled, tabTitle, prefixCls, tabId, onTabClick, active }, ref) => {
    const _onClick = useCallback(
      (e: React.MouseEvent) => {
        if (onTabClick) {
          onTabClick(tabId)
        }
      },
      [onTabClick, tabId]
    )
    return (
      <div
        style={style}
        className={cx(`${prefixCls}__item`, className, { [`${prefixCls}__item--active`]: active })}
        ref={ref}
        tabIndex={disabled ? 0 : -1}
        onClick={_onClick}
      >
        <span>{tabTitle}</span>
      </div>
    )
  }
)
if (__DEV__) {
  TabItem.displayName = 'TabItem'
}
