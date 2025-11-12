import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TabPaneProps } from './TabPane'
import { cx } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CloseOutlined } from '@hi-ui/icons'
import { Button } from '@hi-ui/button'
import { Input } from '@hi-ui/input'
import { Tooltip } from '@hi-ui/tooltip'

export const TabItem = forwardRef<HTMLDivElement | null, TabItemProps>(
  (
    {
      className,
      style,
      disabled,
      tabTitle: tabTitleProp,
      tabDesc,
      prefixCls,
      tabId,
      onTabClick,
      active,
      editable,
      editing: editingProp,
      editRender,
      onEdit,
      onCopy,
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
      maxTitleWidth,
    },
    ref
  ) => {
    const [dragId, setDragId] = useState<React.ReactText | null>(null)
    const [direction, setDirection] = useState<'prev' | 'next' | null>(null)
    const [editing, setEditing] = useState(editingProp)
    const [tabTitle, setTabTitle] = useState(tabTitleProp as string)
    const titleRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      setEditing(editingProp)
    }, [editingProp])

    useEffect(() => {
      setTabTitle(tabTitleProp as string)
    }, [tabTitleProp])

    const _onClick = useCallback(
      (e: React.MouseEvent) => {
        if (onTabClick) {
          onTabClick(tabId, e)
        }
      },
      [onTabClick, tabId]
    )

    const handleEditDone = useCallback(
      async (evt: React.FocusEvent<HTMLInputElement>) => {
        const value = evt.target.value as string
        let newTitle = value

        if (!value) {
          newTitle = tabTitleProp as string
        } else {
          newTitle = value
        }

        setTabTitle(newTitle)

        const result = await onEdit?.(newTitle)
        if (result === false) {
          return
        }

        setEditing(false)

        onTabClick?.(tabId, (evt as unknown) as React.MouseEvent)
      },
      [onEdit, onTabClick, tabId, tabTitleProp]
    )

    const renderEditor = useMemo(() => {
      if (editable) {
        if (editRender && active) {
          return editRender({ tabId, tabTitle }, index, {
            copy: (targetIndex) => onCopy?.(targetIndex),
            edit: () => setEditing(true),
            delete: () => onDelete?.({ tabId, tabTitle }, {} as React.MouseEvent),
          })
        }

        if (closeable && !editRender) {
          return (
            <Button
              className={`${prefixCls}__close-btn`}
              type={active ? 'primary' : 'default'}
              size="xs"
              appearance="link"
              icon={<CloseOutlined />}
              onClick={(evt) => {
                evt.stopPropagation()
                if (onDelete) {
                  onDelete({ tabId, tabTitle }, evt)
                }
              }}
            />
          )
        }
      }

      return null
    }, [
      active,
      closeable,
      editRender,
      editable,
      index,
      onCopy,
      onDelete,
      prefixCls,
      tabId,
      tabTitle,
    ])

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
        {...(editable
          ? {
              onDoubleClick: (e) => {
                e.stopPropagation()
                setEditing(true)
              },
            }
          : {})}
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
        {editing ? (
          <div className={`${prefixCls}__edit-input`}>
            <Input
              value={tabTitle}
              autoFocus
              onBlur={handleEditDone}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') {
                  handleEditDone((evt as unknown) as React.FocusEvent<HTMLInputElement>)
                }
              }}
              onChange={(e) => {
                setTabTitle(e.target.value as string)
              }}
            />
          </div>
        ) : (
          <>
            <Tooltip
              title={tabTitle}
              disabled={!maxTitleWidth || (titleRef.current?.offsetWidth ?? 0) < maxTitleWidth}
            >
              <span
                ref={titleRef}
                className={`${prefixCls}-item__title`}
                style={{ maxWidth: maxTitleWidth }}
              >
                {tabTitle}
              </span>
            </Tooltip>
            {type === 'desc' && <span className={`${prefixCls}-item__desc`}>{tabDesc}</span>}
            {renderEditor}
          </>
        )}
      </div>
    )
  }
)

export type EditActions = {
  copy: (targetIndex?: number) => void
  edit: () => void
  delete: () => void
}

interface TabItemProps
  extends Omit<
    TabPaneProps,
    'itemRef' | 'onDragEnd' | 'onDragOver' | 'onDragStart' | 'onDrop' | 'onCopy' | 'onDelete'
  > {
  active: boolean
  draggable?: boolean
  editing?: boolean
  onTabClick: (key: React.ReactText, event: React.MouseEvent) => void
  prefixCls?: string
  editable?: boolean
  editRender?: (item: TabPaneProps, index: number, actions: EditActions) => React.ReactNode
  onEdit?: (value: string) => void | boolean | Promise<boolean>
  onCopy?: (targetIndex?: number) => void
  onDelete?: (deletedNode: TabPaneProps, evt: React.MouseEvent) => void
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
  maxTitleWidth?: number
}

if (__DEV__) {
  TabItem.displayName = 'TabItem'
}
