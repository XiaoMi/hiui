import React, { forwardRef, useCallback } from 'react'
import { TabPaneProps } from './TabPane'
import { cx } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CloseOutlined } from '@hi-ui/icons'

interface TabItemProps extends TabPaneProps {
  active: boolean
  onTabClick: (key: string) => void
  prefixCls?: string
  editable?: boolean
  onDelete?: (deletedNode: TabPaneProps, index: number) => void
  index: number
}

export const TabItem = forwardRef<HTMLDivElement | null, TabItemProps>(
  (
    {
      className,
      style,
      disabled,
      tabTitle,
      prefixCls,
      tabId,
      onTabClick,
      active,
      editable,
      onDelete,
      index,
    },
    ref
  ) => {
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
        {editable && (
          <span
            className={`${prefixCls}__close-btn`}
            onClick={() => {
              if (onDelete) {
                onDelete({ tabId, tabTitle }, index)
              }
            }}
          >
            <CloseOutlined />
          </span>
        )}
      </div>
    )
  }
)
if (__DEV__) {
  TabItem.displayName = 'TabItem'
}
