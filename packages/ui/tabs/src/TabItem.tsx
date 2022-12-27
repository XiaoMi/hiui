import React, { forwardRef, useCallback, useState } from 'react'
import { TabPaneProps } from './TabPane'
import { cx } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CloseOutlined } from '@hi-ui/icons'

export const TabItem = forwardRef<HTMLDivElement | null, TabItemProps>(
  (
    {
      className,
      style,
      disabled,
      tabTitle,
      tabDesc,
      prefixCls,
      tabId,
      onTabClick,
      active,
      editable,
      onDelete,
      index,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
      itemRef,
      draggable,
      type = 'line',
      closeable = true,
      direction: layout = 'horizontal',
    },
    ref
  ) => {
    const [dragId, setDragId] = useState<React.ReactText | null>(null)
    const [direction, setDirection] = useState<'prev' | 'next' | null>(null)
    const _onClick = useCallback(
      (e: React.MouseEvent) => {
        if (onTabClick) {
          onTabClick(tabId, e)
        }
      },
      [onTabClick, tabId]
    )
    return (
      <div
        style={style}
        className={cx(`${prefixCls}__item`, className, {
          [`${prefixCls}__item--active`]: active,
          [`${prefixCls}__item--disabled`]: disabled,
          [`${prefixCls}__item--${direction}`]: direction,
        })}
        ref={ref}
        draggable={draggable}
        tabIndex={disabled ? 0 : -1}
        onClick={disabled ? undefined : _onClick}
        onDragStart={(e) => {
          e.stopPropagation()
          e.dataTransfer.setData('tab', JSON.stringify({ tabId, tabTitle }))
          setDragId(tabId)
          if (onDragStart) {
            onDragStart(e, { dragNode: { tabId, tabTitle } as TabPaneProps })
          }
        }}
        onDragEnd={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.dataTransfer.clearData()
          setDragId(null)
          if (onDragEnd) {
            onDragEnd(e, { dragNode: { tabId, tabTitle } as TabPaneProps })
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDirection(null)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (dragId !== tabId && itemRef) {
            const targetBoundingRect = itemRef.getBoundingClientRect()
            const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 2
            const hoverTargetSortX = (targetBoundingRect.right - targetBoundingRect.left) / 2
            // 鼠标垂直移动距离
            const hoverClientY = e.clientY - targetBoundingRect.top
            const hoverClientX = e.clientX - targetBoundingRect.left
            if (layout === 'vertical') {
              if (hoverClientY < hoverTargetSortY) {
                setDirection('prev')
              } else {
                setDirection('next')
              }
            } else {
              if (hoverClientX < hoverTargetSortX) {
                setDirection('prev')
              } else {
                setDirection('next')
              }
            }
          }
          if (onDragOver) {
            onDragOver(e, { targetNode: { tabId, tabTitle } as TabPaneProps })
          }
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDirection(null)
          if (onDrop && dragId !== tabId) {
            const passedData = JSON.parse(e.dataTransfer.getData('tab')) as TabPaneProps
            onDrop(e, {
              dragNode: { tabId, tabTitle },
              targetNode: {
                tabId: passedData.tabId,
                tabTitle: passedData.tabTitle,
              },
              direction,
            })
          }
        }}
      >
        <span className={`${prefixCls}-item__title`}>{tabTitle}</span>
        {type === 'desc' && <span className={`${prefixCls}-item__desc`}>{tabDesc}</span>}
        {editable && closeable && (
          <span
            className={`${prefixCls}__close-btn`}
            onClick={(e) => {
              e.stopPropagation()
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

interface TabItemProps
  extends Omit<TabPaneProps, 'itemRef' | 'onDragEnd' | 'onDragOver' | 'onDragStart' | 'onDrop'> {
  active: boolean
  draggable?: boolean

  onTabClick: (key: React.ReactText, event: React.MouseEvent) => void
  prefixCls?: string
  editable?: boolean
  onDelete?: (deletedNode: TabPaneProps, index: number) => void
  index: number
  onDragStart?: (
    e: React.DragEvent<HTMLDivElement>,
    { dragNode }: { dragNode: TabPaneProps }
  ) => void
  onDragOver?: (
    e: React.DragEvent<HTMLDivElement>,
    { targetNode }: { targetNode: TabPaneProps }
  ) => void
  onDrop?: (
    e: React.DragEvent<HTMLDivElement>,
    {
      dragNode,
      targetNode,
      direction,
    }: { dragNode: TabPaneProps; targetNode: TabPaneProps; direction: 'prev' | 'next' | null }
  ) => void
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>, { dragNode }: { dragNode: TabPaneProps }) => void
  itemRef: HTMLDivElement | null
  direction: 'horizontal' | 'vertical'
  type: 'desc' | 'line' | 'button' | 'card'
}

if (__DEV__) {
  TabItem.displayName = 'TabItem'
}
