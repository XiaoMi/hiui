import React, { forwardRef, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TransferDataItem } from './types'
import { useTransferContext } from './context'
import Checkbox from '@hi-ui/checkbox'

const _role = 'transfer-item'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TransferItem
 */
export const TransferItem = forwardRef<HTMLLIElement | null, TransferItemProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      targetLimit,
      data: item,
      // targetDragId,
      // dividerPosition,
      checked,
      onCheck,
      onClick,
      draggable,
      ...rest
    },
    ref
  ) => {
    const {
      disabled: disabledContext,
      type = 'multiple',
      onItemClick,
      onItemKeydown,
      titleRender,
      onDragStart: onDragStartContext,
      onDragEnd: onDragEndContext,
      onDragLeave: onDragLeaveContext,
      onDragOver: onDragOverContext,
      onDrop: onDropContext,
    } = useTransferContext()

    const disabled = disabledContext || item.disabled

    const enabledFocus = !disabled && type === 'basic'

    const renderTitle = (data: TransferDataItem) => {
      // 如果 titleRender 返回 `true`，则使用默认 title
      const title = titleRender ? titleRender(data) : true

      if (title !== true) {
        return title
      }

      return data.title
    }

    const transferItemNodeRef = useRef<HTMLDivElement | null>(null)

    const [isDragging, setIsDragging] = useState(false)
    const [direction, setDirection] = useState<string | null>(null)
    const dragNodeRef = useRef<TransferDataItem | null>(null)

    const cls = cx(
      prefixCls,
      className,
      isDragging && `${prefixCls}--dragging`,
      direction && `${prefixCls}--drag-${direction}`,
      disabled && `${prefixCls}--disabled`
    )

    return (
      <li
        ref={ref}
        role={role}
        className={cls}
        onClick={onItemClick}
        tabIndex={enabledFocus ? 0 : -1}
        onKeyDown={onItemKeydown}
        {...rest}
      >
        <div
          className={`${prefixCls}__wrap`}
          ref={transferItemNodeRef}
          draggable={draggable}
          onDragStart={(evt) => {
            const { id } = item

            evt.stopPropagation()

            setIsDragging(true)
            dragNodeRef.current = item
            evt.dataTransfer.setData('transferNode', JSON.stringify({ sourceId: id }))

            onDragStartContext?.(item)
          }}
          onDragEnd={(evt) => {
            evt.preventDefault()
            evt.stopPropagation()
            evt.dataTransfer.clearData()
            dragNodeRef.current = null
            setDirection(null)
            setIsDragging(false)
            onDragEndContext?.(item)
          }}
          onDragLeave={(evt) => {
            evt.preventDefault()
            evt.stopPropagation()
            setDirection(null)
            onDragLeaveContext?.(item)
          }}
          onDragOver={(evt) => {
            const dragId = dragNodeRef.current?.id

            evt.preventDefault()
            evt.stopPropagation()

            // 这里需要考虑 2 点：
            // 1. 拖到自己的老位置，不处理
            // 2. 同层可以拖拽进行排序
            if (dragId !== item.id) {
              const targetBoundingRect = transferItemNodeRef.current?.getBoundingClientRect()
              if (!targetBoundingRect) return

              const hoverTargetSortY = (targetBoundingRect.bottom - targetBoundingRect.top) / 2

              // 鼠标垂直移动距离
              const hoverClientY = evt.clientY - targetBoundingRect.top

              // 将当前元素垂直平分为 2 层，每一层用来对应其放置的位置
              if (hoverClientY < hoverTargetSortY) {
                setDirection('before')
              } else {
                setDirection('after')
              }
            }

            onDragOverContext?.(item)
          }}
          onDrop={(evt) => {
            const dragId = dragNodeRef.current?.id

            evt.preventDefault()
            evt.stopPropagation()
            setDirection(null)

            const targetId = item.id

            if (onDropContext && dragId !== targetId) {
              try {
                const { sourceId } = JSON.parse(evt.dataTransfer.getData('transferNode'))
                onDropContext(sourceId, targetId, direction)
              } catch (error) {
                console.error(error)
              }
            }
          }}
        >
          {type === 'multiple' ? (
            <Checkbox
              checked={checked}
              disabled={disabled}
              onChange={(e) => {
                onCheck(item, e.target.checked)
              }}
            >
              {renderTitle(item)}
            </Checkbox>
          ) : (
            <span
              className={`${prefixCls}__title`}
              onClick={() => {
                onClick?.(item)
              }}
            >
              {renderTitle(item)}
            </span>
          )}
        </div>
      </li>
    )
  }
)

export interface TransferItemProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 穿梭框类型
   */
  type?: 'default' | 'multiple'
  /**
   * 是否展示全选按钮
   */
  showCheckAll?: boolean
  /**
   * 是否可筛选
   */
  searchable?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 穿梭框数据源
   */
  data: TransferDataItem
  /**
   * 最大可穿梭上限
   */
  targetLimit?: number
  /**
   * 目标框内的元素 id 集合
   */
  targetIds?: React.ReactText[]
  /**
   * 目标框内的排序方式
   */
  targetSortType?: 'default' | 'queue'
  /**
   * 自定义每项标题渲染
   */
  titleRender?: (item: TransferDataItem) => React.ReactNode
  onCheck?: any
  checked?: boolean
  /**
   * 是否开启拖拽
   */
  draggable?: boolean
  onClick?: (item: TransferDataItem) => void
}

if (__DEV__) {
  TransferItem.displayName = 'TransferItem'
}
