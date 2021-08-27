import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TransferDataItem } from './types'
import { useTransferContext } from './context'
import Input from '@hi-ui/input'
import { TransferItem } from './TransferItem'
import Checkbox from '@hi-ui/checkbox'

const _role = 'transfer-panel'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TransferPanel
 */
export const TransferPanel = forwardRef<HTMLUListElement | null, TransferPanelProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      type,
      targetLimit,
      disabled,
      data,
      checkedIds,
      searchable,
      title,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {title ? (
          <div className={`${prefixCls}__header`}>
            <div className={`${prefixCls}__title`}>{title}</div>
          </div>
        ) : null}
        <div className={`${prefixCls}__body`}>
          {searchable ? <Input /> : null}
          <ul className={`${prefixCls}__list`}>
            {data.map((item) => {
              return <TransferItem key={item.id} data={item} />
            })}
          </ul>
        </div>
        <div className={`${prefixCls}__footer`}>
          <div className={`${prefixCls}__check-all`}>
            <Checkbox
              checked={checkedIds?.length === data.filter((item) => !item.disabled).length}
            />

            <span>
              {checkedIds.length + '/'}
              {data.length} 项
            </span>
          </div>
          <div className={`${prefixCls}__check-info`}></div>
        </div>
      </div>
    )
  }
)

export interface TransferPanelProps {
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
  checkedIds: React.ReactText[]
}

if (__DEV__) {
  TransferPanel.displayName = 'TransferPanel'
}
