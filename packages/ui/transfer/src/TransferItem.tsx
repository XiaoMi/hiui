import React, { forwardRef } from 'react'
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
      targetDragId,
      isDragging,
      dividerPosition,
      checked,
      onCheck,
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
    } = useTransferContext()
    const disabled = disabledContext || item.disabled

    const enabledFocus = !disabled && type === 'basic'

    const cls = cx(prefixCls, className)

    const renderTitle = (data) => {
      // 如果 titleRender 返回 `true`，则使用默认 title
      const title = titleRender ? titleRender(data) : true

      if (title !== true) {
        return title
      }

      return data.title
    }

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
        {targetDragId === item.id && isDragging ? (
          <div className={`${prefixCls}--divider-${dividerPosition}`} />
        ) : null}
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
          <span className={`${prefixCls}__title`}>{renderTitle(item)}</span>
        )}
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
   * 标题(数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题)
   */
  title?: React.ReactNode[]
  /**
   * 数据为空时的显示内容
   */
  emptyContent?: React.ReactNode[]
  /**
   * 穿梭框数据源
   */
  data: TransferDataItem[]
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
   * 选中元素被移动到目标框内后的回调
   */
  onChange?: (
    targetKey: React.ReactText[],
    direction: 'left' | 'right',
    targetItems: TransferDataItem[]
  ) => void
  /**
   * 自定义每项标题渲染
   */
  titleRender?: (item: TransferDataItem) => React.ReactNode
  /**
   * 拖拽开始时的回调函数
   */
  onDragStart?: (item: TransferDataItem) => Boolean
  /**
   * 拖拽结束时的回调函数(完成拖拽)
   */
  onDragEnd?: (item: TransferDataItem) => void
  /**
   * 放开拖拽元素时的回调函数，返回 false 将阻止拖拽到对应位置
   */
  onDrop?: (targetItem: TransferDataItem, sourceItem: TransferDataItem) => boolean
}

if (__DEV__) {
  TransferItem.displayName = 'TransferItem'
}
