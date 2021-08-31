import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TransferDataItem } from './types'
import { useTransferContext } from './context'
import Input from '@hi-ui/input'
import { TransferItem } from './TransferItem'
import Checkbox from '@hi-ui/checkbox'
import { SearchOutlined } from '@hi-ui/icons'

const _role = 'transfer-panel'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TransferPanel
 */
export const TransferPanel = forwardRef<HTMLDivElement | null, TransferPanelProps>(
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
      title,
      checkedIds,
      setCheckedIds,
      onCheck,
      isCheckedIds,
      placeholder,
      emptyContent,
      ...rest
    },
    ref
  ) => {
    const { searchable } = useTransferContext()

    const [cacheData, setCacheData] = useState(data)
    useEffect(() => {
      setCacheData(data)
    }, [data])

    const search = (searchValue) => {
      if (!searchValue) {
        setCacheData(data)
        setCheckedIds(checkedIds)
      } else {
        const nextData = data.filter((item) => {
          if (typeof item.title !== 'string') return false
          return item.title.includes(searchValue)
        })

        setCacheData(nextData)
      }
    }

    const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = evt.target.value
      search(searchValue)
    }

    const canCheckedItems = useMemo(() => cacheData.filter((item) => !item.disabled), [cacheData])

    const handleCheckAll = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        const shouldCheckedAll = evt.target.checked
        const nextCheckedIdsSet = new Set<React.ReactText>(checkedIds)
        if (shouldCheckedAll) {
          canCheckedItems.forEach(({ id }) => {
            nextCheckedIdsSet.add(id)
          })
        } else {
          canCheckedItems.forEach(({ id }) => {
            nextCheckedIdsSet.delete(id)
          })
        }

        const nextCheckedIds = Array.from(nextCheckedIdsSet)
        setCheckedIds(nextCheckedIds)
      },
      [canCheckedItems, checkedIds, setCheckedIds]
    )

    const currentPanelHasChecked = checkedIds.length > 0

    const checkedAll = useMemo(
      () =>
        currentPanelHasChecked &&
        canCheckedItems.length > 0 &&
        canCheckedItems.every((item) => isCheckedIds(item.id)),
      [currentPanelHasChecked, isCheckedIds, canCheckedItems]
    )

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={`${prefixCls}__header`}>
          <div className={`${prefixCls}__check-all`}>
            <Checkbox
              indeterminate={!checkedAll && currentPanelHasChecked}
              checked={checkedAll}
              onChange={handleCheckAll}
            />
            <span>
              {currentPanelHasChecked
                ? `${checkedIds.length}/${cacheData.length}`
                : `${cacheData.length}`}
            </span>
            <span>项</span>
          </div>
          {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
        </div>
        <div className={`${prefixCls}__body`}>
          {searchable ? (
            <div className={`${prefixCls}__search`}>
              <Input
                size="md"
                appearance="underline"
                prefix={<SearchOutlined />}
                placeholder={placeholder}
                onChange={handleSearch}
              />
            </div>
          ) : null}
          <div className={`${prefixCls}__list-scroller`}>
            {cacheData.length > 0 ? (
              <ul className={`${prefixCls}__list`}>
                {cacheData.map((item) => {
                  return (
                    <TransferItem
                      key={item.id}
                      data={item}
                      onCheck={onCheck}
                      checked={isCheckedIds(item.id)}
                    />
                  )
                })}
              </ul>
            ) : (
              <div className={`${prefixCls}__empty`}>{emptyContent}</div>
            )}
          </div>
        </div>
        <div className={`${prefixCls}__footer`}>
          <div className={`${prefixCls}__pagination`}>
            <span>left</span>
            <span>right</span>
          </div>
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
   * 标题
   */
  title?: React.ReactNode
  /**
   * 输入框占位内容
   */
  placeholder?: string
  /**
   * 数据为空时的显示内容
   */
  emptyContent?: React.ReactNode
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
  setCheckedIds: (newState: React.ReactText[]) => void
  onCheck: (targetItem: TransferDataItem, shouldChecked: boolean) => void
  isCheckedIds: (id: React.ReactText) => boolean
}

if (__DEV__) {
  TransferPanel.displayName = 'TransferPanel'
}
