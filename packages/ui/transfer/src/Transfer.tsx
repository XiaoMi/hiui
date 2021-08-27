import React, { forwardRef, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Button from '@hi-ui/button'
import { ArrowRightOutlined } from '@hi-ui/icons'
import { TransferPanel } from './TransferPanel'
import { TransferDataItem } from './types'

const _role = 'transfer'
const _prefix = getPrefixCls(_role)
const NOOP_ARRAY = [] as []
/**
 * TODO: What is Transfer
 */
export const Transfer = forwardRef<HTMLDivElement | null, TransferProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      disabled = false,
      type = 'default',
      targetSortType = 'default',
      data = NOOP_ARRAY,
      targetIds = NOOP_ARRAY,
      targetLimit,
      title,
      onChange,
      onDrop,
      onDragStart,
      onDragEnd,
      ...rest
    },
    ref
  ) => {
    const [sourceCheckedIds, setSourceCheckedIds] = useState([])
    const [targetCheckedIds, setTargetCheckedIds] = useState([])

    const [sourceList, targetList] = useMemo(() => splitData(data, targetIds), [data, targetIds])

    const isOverflowed = useMemo(() => {
      if (targetLimit === undefined) return false

      const sourceCheckedIdsLength = sourceCheckedIds.length
      const targetListLength = targetList.length

      const defaultLimited =
        sourceCheckedIdsLength > targetLimit ||
        sourceCheckedIdsLength + targetListLength > targetLimit

      if (type === 'default') {
        return defaultLimited || targetListLength >= targetLimit
      }

      return defaultLimited
    }, [targetLimit, targetList, sourceCheckedIds, type])

    const moveTo = (direction: 'left' | 'right') => {
      let checkedIds: React.ReactText[]
      let nextTargetIds: React.ReactText[]

      if (direction === 'right') {
        checkedIds = sourceCheckedIds.slice()
        nextTargetIds =
          targetSortType === 'queue' ? targetIds.concat(checkedIds) : checkedIds.concat(targetIds)
      } else {
        checkedIds = targetCheckedIds.slice()
        nextTargetIds = targetIds.filter((id) => checkedIds.indexOf(id) !== -1)
      }

      const moveData = data.filter((item) => checkedIds.indexOf(item.id) !== -1)
      onChange?.(nextTargetIds, direction, moveData)
    }

    // const search = (list, selectedKeys, searchValue) => {
    //   const filterResult = []

    //   list.forEach((item) => {
    //     item.title.includes(searchValue) && filterResult.push(item.id)
    //   })

    //   const checkoutStatue =
    //     searchValue.length > 0
    //       ? searchValue.every((item) => {
    //           return selectedKeys.includes(item)
    //         })
    //       : shallowEqual(selectedKeys.sort(), filterResult.sort())

    //   return checkoutStatue
    // }

    const handleSearch = (evt: React.ChangeEvent, direction: 'left' | 'right') => {
      const searchValue = evt.target.value
      const selectedKeys = direction === 'left' ? sourceCheckedIds : targetCheckedIds
      const list = direction === 'left' ? sourceList : targetList
      search(list, selectedKeys, searchValue)
    }

    const onItemClick = () => {}

    const handleKeydown = (evt: React.KeyboardEvent) => {
      if (evt.keyCode === 13) {
        evt.preventDefault()
        onItemClick?.()
      }
    }

    const handleDataMove = (direction: 'left' | 'right') => (evt: React.MouseEvent) => {}

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <TransferPanel
          data={sourceList}
          checkedIds={sourceCheckedIds}
          onCheck={setSourceCheckedIds}
        />
        <div className={`${prefixCls}-operation`}>
          {type === 'multiple' ? (
            <>
              <Button onClick={handleDataMove('left')}>
                <ArrowRightOutlined />
              </Button>
              <Button onClick={handleDataMove('left')}>
                <ArrowRightOutlined />
              </Button>
            </>
          ) : null}
        </div>
        <TransferPanel
          data={targetList}
          checkedIds={targetCheckedIds}
          onCheck={setTargetCheckedIds}
        />
      </div>
    )
  }
)

export interface TransferProps {
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
  Transfer.displayName = 'Transfer'
}

const splitData = (data: TransferDataItem[], targetIds: React.ReactText[]) => {
  const sourceList = [] as TransferDataItem[]
  const targetList = [] as TransferDataItem[]
  const targetIdsSet = new Set(targetIds)

  data.forEach((item) => {
    if (targetIdsSet.has(item.id)) {
      targetList.push(item)
    } else {
      sourceList.push(item)
    }
  })

  return [sourceList, targetList] as const
}
