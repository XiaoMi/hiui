import React, { forwardRef, useMemo, useCallback, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Button from '@hi-ui/button'
import { LeftOutlined, LeftRightOutlined, RightOutlined } from '@hi-ui/icons'
import { TransferPanel } from './TransferPanel'
import { TransferDataItem } from './types'
import { TransferProvider } from './context'
import { useCheck } from '@hi-ui/use-check'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseFieldNames, HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { transformData } from './utils'

const _role = 'transfer'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []
const allowCheck = (item: any) => !item.disabled

/**
 * 穿梭框
 */
export const Transfer = forwardRef<HTMLDivElement | null, TransferProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      disabled = false,
      showCheckAll = false,
      searchable = false,
      type = 'single',
      targetSortType = 'default',
      pagination = false,
      data = NOOP_ARRAY,
      fieldNames,
      defaultTargetIds = NOOP_ARRAY,
      targetIds: targetIdsProp,
      targetLimit,
      title,
      placeholder,
      emptyContent,
      render: titleRender,
      draggable = false,
      onChange,
      onDragStart,
      onDragLeave,
      onDragOver,
      onDragEnd,
      onDrop,
      ...rest
    },
    ref
  ) => {
    const [targetIds, tryChangeTargetIds] = useUncontrolledState(
      defaultTargetIds,
      targetIdsProp,
      onChange
    )

    const transformedData = useMemo(() => transformData(data, fieldNames), [data, fieldNames])

    const pageSize = useMemo(() => {
      if (pagination === true) return 10
      if (typeof pagination === 'object' && 'pageSize' in pagination) {
        return pagination.pageSize ?? 10
      }
      return 0
    }, [pagination])

    const [sourceCheckedIds, setSourceCheckedIds] = useState<React.ReactText[]>([])
    const [onSourceItemCheck, isSourceCheckedIds] = useCheck({
      disabled,
      checkedIds: sourceCheckedIds,
      onCheck: setSourceCheckedIds,
      allowCheck,
    })
    const [targetCheckedIds, setTargetCheckedIds] = useState<React.ReactText[]>([])
    const [onTargetItemCheck, isTargetCheckedIds] = useCheck({
      disabled,
      checkedIds: targetCheckedIds,
      onCheck: setTargetCheckedIds,
      allowCheck,
    })

    const [sourceList, targetList] = useMemo(() => splitData(transformedData, targetIds), [
      transformedData,
      targetIds,
    ])

    const isOverflowed = useMemo(() => {
      if (targetLimit === undefined) return false

      const sourceCheckedIdsLength = sourceCheckedIds.length
      const targetListLength = targetList.length

      const defaultLimited = sourceCheckedIdsLength + targetListLength > targetLimit

      if (type === 'single') {
        return defaultLimited || targetListLength >= targetLimit
      }

      return defaultLimited
    }, [targetLimit, targetList, sourceCheckedIds, type])

    const moveTo = useCallback(
      (direction: 'left' | 'right') => {
        let checkedIds: React.ReactText[]
        let nextTargetIds: React.ReactText[]

        if (direction === 'right') {
          checkedIds = sourceCheckedIds.slice()
          nextTargetIds =
            targetSortType === 'queue' ? targetIds.concat(checkedIds) : checkedIds.concat(targetIds)
          setSourceCheckedIds([])
        } else {
          checkedIds = targetCheckedIds.slice()
          nextTargetIds = targetIds.filter((id) => checkedIds.indexOf(id) === -1)
          setTargetCheckedIds([])
        }

        const moveData = transformedData.filter((item) => checkedIds.indexOf(item.id) !== -1)
        tryChangeTargetIds(nextTargetIds, direction, moveData)
      },
      [
        transformedData,
        tryChangeTargetIds,
        setSourceCheckedIds,
        setTargetCheckedIds,
        targetCheckedIds,
        sourceCheckedIds,
        targetIds,
        targetSortType,
      ]
    )

    const onItemClick = useCallback(
      (item: TransferDataItem, direction: 'left' | 'right') => {
        if (item.disabled) return

        const checkedId = item.id
        let nextTargetIds: React.ReactText[]

        if (direction === 'right') {
          nextTargetIds =
            targetSortType === 'queue' ? targetIds.concat(checkedId) : [checkedId].concat(targetIds)
          setSourceCheckedIds([])
        } else {
          nextTargetIds = targetIds.filter((id) => checkedId !== id)
          setTargetCheckedIds([])
        }

        tryChangeTargetIds(nextTargetIds, direction, [item])
      },
      [setSourceCheckedIds, setTargetCheckedIds, targetIds, targetSortType, tryChangeTargetIds]
    )

    const panelTitles = useMemo(() => {
      if (!title) return []
      if (title.length === 1) return [title[0], title[0]]
      return title
    }, [title])

    const i18n = useLocaleContext()

    const defaultPlaceholder = i18n.get('transfer.searchPlaceholder')
    const defaultEmptyContent = i18n.get('transfer.searchPlaceholder')

    const panelPlaceholders = useMemo(() => {
      if (!placeholder) {
        return [defaultPlaceholder, defaultPlaceholder]
      }
      if (placeholder.length === 1) return [placeholder[0], placeholder[0]]
      return placeholder
    }, [placeholder, defaultPlaceholder])

    const panelEmptyContents = useMemo(() => {
      if (!emptyContent) {
        return [defaultEmptyContent, defaultEmptyContent]
      }
      if (emptyContent.length === 1) return [emptyContent[0], emptyContent[0]]
      return emptyContent
    }, [emptyContent, defaultEmptyContent])

    const dropItem = useCallback(
      (
        evt: React.DragEvent,
        sourceId: React.ReactText,
        targetId: React.ReactText,
        direction: string | null
      ) => {
        if (sourceId === targetId) return

        let targetIdx = targetIds.findIndex((item) => item === targetId)
        const sourceIdx = targetIds.findIndex((item) => item === sourceId)

        if (targetIdx === -1 || sourceIdx === -1) return

        const targetItem = targetList[targetIdx]
        const sourceItem = targetList[sourceIdx]

        const nextTargetList = targetList.filter(({ id }) => id !== sourceId)
        // sourceId 被移除后，需要维护下标偏移纠正
        if (sourceIdx < targetIdx) {
          targetIdx = targetIdx - 1
        }

        nextTargetList.splice(direction === 'before' ? targetIdx : targetIdx + 1, 0, sourceItem)

        const nextTargetIds = nextTargetList.map(({ id }) => id)

        if (onDrop) {
          const result = onDrop(evt, {
            dropNode: targetItem,
            dragNode: sourceItem,
            dataStatus: {
              before: targetIds,
              after: nextTargetIds,
            },
          })

          if (result === true) {
            tryChangeTargetIds(nextTargetIds)
            onDragEnd?.({
              dataStatus: {
                before: targetIds,
                after: nextTargetIds,
              },
            })
          }
        } else {
          tryChangeTargetIds(nextTargetIds)
          onDragEnd?.({
            dataStatus: {
              before: targetIds,
              after: nextTargetIds,
            },
          })
        }
      },
      [targetIds, tryChangeTargetIds, onDrop, targetList, onDragEnd]
    )

    const providedValue = useMemo(
      () => ({
        disabled,
        showCheckAll: showCheckAll && type === 'multiple',
        searchable,
        emptyContent,
        type,
        targetSortType,
        targetIds,
        targetLimit,
        titleRender,
        pageSize,
        onDrop: dropItem,
        onDragStart,
        onDragLeave,
        onDragOver,
      }),
      [
        disabled,
        showCheckAll,
        searchable,
        emptyContent,
        type,
        targetSortType,
        targetIds,
        targetLimit,
        titleRender,
        pageSize,
        dropItem,
        onDragStart,
        onDragLeave,
        onDragOver,
      ]
    )

    const enabledSourceToTarget = sourceCheckedIds.length > 0
    const enabledTargetToSource = targetCheckedIds.length > 0

    const cls = cx(prefixCls, className, type && `${prefixCls}--type-${type}`)

    return (
      // @ts-ignore
      <TransferProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rest}>
          <TransferPanel
            disabled={disabled}
            title={panelTitles[0]}
            placeholder={panelPlaceholders[0]}
            emptyContent={panelEmptyContents[0]}
            data={sourceList}
            checkedIds={sourceCheckedIds}
            setCheckedIds={setSourceCheckedIds}
            onCheck={onSourceItemCheck}
            isCheckedIds={isSourceCheckedIds}
            overflowed={isOverflowed}
            draggable={false}
            onItemClick={(item) => {
              onItemClick(item, 'right')
            }}
          />
          <div className={`${prefixCls}-operation`}>
            {type === 'multiple' ? (
              <>
                <Button
                  shape="round"
                  type={enabledSourceToTarget ? 'secondary' : 'default'}
                  disabled={!enabledSourceToTarget || isOverflowed}
                  icon={<RightOutlined />}
                  onClick={() => moveTo('right')}
                />
                <Button
                  shape="round"
                  type={enabledTargetToSource ? 'secondary' : 'default'}
                  disabled={!enabledTargetToSource}
                  icon={<LeftOutlined />}
                  onClick={() => moveTo('left')}
                />
              </>
            ) : (
              <LeftRightOutlined className={`${prefixCls}-operation-arrow`} />
            )}
          </div>
          <TransferPanel
            disabled={disabled}
            title={panelTitles[1]}
            placeholder={panelPlaceholders[1]}
            emptyContent={panelEmptyContents[1]}
            data={targetList}
            checkedIds={targetCheckedIds}
            setCheckedIds={setTargetCheckedIds}
            onCheck={onTargetItemCheck}
            isCheckedIds={isTargetCheckedIds}
            overflowed={false}
            draggable={draggable}
            onItemClick={(item) => {
              onItemClick(item, 'left')
            }}
          />
        </div>
      </TransferProvider>
    )
  }
)

export interface TransferProps
  extends Omit<HiBaseHTMLProps<'div'>, 'placeholder' | 'onDragStart' | 'onDragEnd' | 'onDrop'> {
  /**
   * 穿梭框类型
   */
  type?: 'single' | 'multiple'
  /**
   * 是否展示全选按钮
   */
  showCheckAll?: boolean
  /**
   * 是否可筛选
   */
  searchable?: boolean
  /**
   * 是否开启拖拽
   */
  draggable?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 头部标题（数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题）
   */
  title?: React.ReactNode[]
  /**
   * 搜索输入框占位内容（数组长度为 1 或 2 位，1 位时左右标题将相同，2 位时将使用对应索引标题）
   */
  placeholder?: string[]
  /**
   * 数据为空时的显示内容
   */
  emptyContent?: React.ReactNode[]
  /**
   * 穿梭框数据源
   */
  data: TransferDataItem[]
  /**
   * 设置data中各项值对应的key
   **/
  fieldNames?: HiBaseFieldNames
  /**
   * 最大可穿梭上限
   */
  targetLimit?: number
  /**
   * 默认的目标框内的元素 id 集合
   */
  defaultTargetIds?: React.ReactText[]
  /**
   * 目标框内的元素 id 集合
   */
  targetIds: React.ReactText[]
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
  render?: (item: TransferDataItem) => React.ReactNode
  /**
   * 拖拽开始时的回调函数
   */
  onDragStart?: (evt: React.DragEvent, option: { dragNode: TransferDataItem }) => Boolean
  /**
   * 拖拽结束时的回调函数(完成拖拽)。暂不对外暴露
   * @private
   */
  onDragEnd?: (option: {
    dataStatus: {
      before: React.ReactText[]
      after: React.ReactText[]
    }
  }) => void
  /**
   * 放开拖拽元素时的回调函数，返回 false 将阻止拖拽到对应位置
   */
  onDrop?: (
    evt: React.DragEvent,
    option: {
      dropNode: TransferDataItem
      dragNode: TransferDataItem
      dataStatus: {
        before: React.ReactText[]
        after: React.ReactText[]
      }
    }
  ) => boolean | void
  /**
   * 开启分页
   */
  pagination?: boolean | { pageSize?: number }
}

if (__DEV__) {
  Transfer.displayName = 'Transfer'
}

const splitData = (data: TransferDataItem[], targetIds: React.ReactText[]) => {
  const sourceList = [] as TransferDataItem[]
  const targetList = [] as TransferDataItem[]

  const targetIdsSet = new Set(targetIds)
  const dataMap = new Map()
  let item: any

  data.forEach((item) => {
    dataMap.set(item.id, item)

    if (!targetIdsSet.has(item.id)) {
      sourceList.push(item)
    }
  })

  targetIds.forEach((id) => {
    item = dataMap.get(id)

    if (item) {
      targetList.push(item)
    }
  })

  return [sourceList, targetList] as const
}
