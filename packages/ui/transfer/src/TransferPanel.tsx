import React, { forwardRef, useCallback, useMemo, useState, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TransferDataItem } from './types'
import { useTransferContext } from './context'
import Input from '@hi-ui/input'
import { TransferItem } from './TransferItem'
import Checkbox from '@hi-ui/checkbox'
import { SearchOutlined, InfoCircleOutlined } from '@hi-ui/icons'
import { InputPagination } from '@hi-ui/pagination'

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
      overflowed = false,
      targetIds,
      targetSortType,
      onItemClick,
      draggable = false,
      ...rest
    },
    ref
  ) => {
    const { searchable, pageSize, showCheckAll } = useTransferContext()

    const [searchValue, setSearchValue] = useState('')

    const [cacheData, setCacheData] = useState(data)

    useEffect(() => {
      const updateDataWithSearch = () => {
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
      updateDataWithSearch()
    }, [data, searchValue, checkedIds, setCheckedIds])

    const [current, setCurrent] = useState(1)

    const handleSearch = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = evt.target.value
      setCurrent(1)
      setSearchValue(searchValue)
    }, [])

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
      () => currentPanelHasChecked && canCheckedItems.every((item) => isCheckedIds(item.id)),
      [currentPanelHasChecked, isCheckedIds, canCheckedItems]
    )

    const showData = useMemo(() => {
      return pageSize ? cacheData.slice((current - 1) * pageSize, current * pageSize) : cacheData
    }, [current, cacheData, pageSize])

    const showHeader = showCheckAll || title

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {disabled ? <div className={`${prefixCls}__mask`}></div> : null}
        {showHeader ? (
          <div className={`${prefixCls}__header`}>
            {showCheckAll ? (
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
            ) : null}
            {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
          </div>
        ) : null}
        <div className={`${prefixCls}__body`}>
          {searchable ? (
            <div className={`${prefixCls}__search`}>
              <Input
                size="md"
                appearance="underline"
                prefix={<SearchOutlined />}
                placeholder={placeholder}
                value={searchValue}
                onChange={handleSearch}
              />
            </div>
          ) : null}
          <div className={`${prefixCls}__list-scroller`}>
            {/* 滚动时吸附顶部，同时与 target 集合滚动高度保持一致 */}
            {overflowed ? (
              <div className={`${prefixCls}__limit`}>
                <InfoCircleOutlined className={`${prefixCls}__limit-icon`} />
                <span>数量达上限，无法添加</span>
              </div>
            ) : null}
            {showData.length > 0 ? (
              <ul className={`${prefixCls}__list`}>
                {showData.map((item) => {
                  return (
                    <TransferItem
                      key={item.id}
                      data={item}
                      onCheck={onCheck}
                      checked={isCheckedIds(item.id)}
                      draggable={draggable}
                      onClick={onItemClick}
                    />
                  )
                })}
              </ul>
            ) : (
              <div className={`${prefixCls}__empty`}>{emptyContent}</div>
            )}
          </div>
        </div>
        {pageSize ? (
          <div className={`${prefixCls}__footer`}>
            <InputPagination
              className={`${prefixCls}__pagination`}
              total={cacheData.length}
              current={current}
              onChange={setCurrent}
              pageSize={pageSize}
            />
          </div>
        ) : null}
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
   * 是否开启拖拽
   */
  draggable?: boolean
  /**
   * 是否超出限制
   */
  overflowed?: boolean
  checkedIds: React.ReactText[]
  setCheckedIds: (newState: React.ReactText[]) => void
  onCheck: (targetItem: TransferDataItem, shouldChecked: boolean) => void
  isCheckedIds: (id: React.ReactText) => boolean
  onItemClick: (item: TransferDataItem) => void
}

if (__DEV__) {
  TransferPanel.displayName = 'TransferPanel'
}
