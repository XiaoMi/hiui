import React, { forwardRef, useMemo, useCallback, useState, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { FlattedTransferDataItem, TransferDataItem } from './types'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseFieldNames, HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import Input from '@hi-ui/input'
import { CloseOutlined, DragDotOutlined, SearchOutlined } from '@hi-ui/icons'
import Checkbox from '@hi-ui/checkbox'
import Button from '@hi-ui/button'
import Highlighter from '@hi-ui/highlighter'
import Tree, { TreeDataItem, useTreeSearchProps } from '@hi-ui/tree'
import { useFlattenData } from './hooks/use-flatten-data'

const _role = 'fast-transfer'

const _prefix = getPrefixCls(_role)
const NOOP_ARRAY = [] as []

/**
 * 快速穿梭框
 */
export const FastTransfer = forwardRef<HTMLDivElement | null, FastTransferProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      disabled = false,
      searchable = {
        left: false,
        right: false,
      },
      keyword,
      onSearch,
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
    const i18n = useLocaleContext()

    const [targetIds, tryChangeTargetIds] = useUncontrolledState(
      defaultTargetIds,
      targetIdsProp,
      onChange
    )

    const flattedData = useFlattenData({ data, fieldNames })
    const targetList = useMemo(
      () => targetIds.map((id) => flattedData.find((item) => item.id === id)!),
      [flattedData, targetIds]
    )

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
        // console.log('nextTargetIds', nextTargetIds)

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

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <SourcePanel
          title={title?.[0] ?? i18n.get('transfer.allItems')}
          data={data}
          flattedData={flattedData}
          checkedIds={targetIds}
          searchable={searchable.left}
          keyword={keyword?.left}
          onSearch={(keyword) => onSearch?.(keyword, 'left')}
          onChange={(checkedIds) => tryChangeTargetIds(checkedIds)}
          placeholder={placeholder?.[0] ?? ''}
          emptyContent={emptyContent?.[0] ?? i18n.get('transfer.emptyContent')}
          render={titleRender}
        />
        <TargetPanel
          title={title?.[1] ?? i18n.get('transfer.checkedItems')}
          data={targetList}
          checkedIds={targetIds}
          searchable={searchable.right}
          keyword={keyword?.right}
          onSearch={(keyword) => onSearch?.(keyword, 'right')}
          onChange={(checkedIds) => tryChangeTargetIds(checkedIds)}
          placeholder={placeholder?.[1] ?? ''}
          emptyContent={emptyContent?.[1] ?? i18n.get('transfer.emptyContent')}
          render={titleRender}
          draggable={draggable}
          onDragStart={onDragStart}
          onDrop={dropItem}
        />
      </div>
    )
  }
)

export interface FastTransferProps
  extends Omit<HiBaseHTMLProps<'div'>, 'placeholder' | 'onDragStart' | 'onDragEnd' | 'onDrop'> {
  /**
   * 是否可筛选
   */
  searchable?: {
    left?: boolean
    right?: boolean
  }
  /**
   * 搜索关键词
   */
  keyword?: {
    left?: string
    right?: string
  }
  /**
   * 搜索回调
   */
  onSearch?: (keyword: string, direction: 'left' | 'right') => void
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
  FastTransfer.displayName = 'FastTransfer'
}

interface PanelProps {
  title?: React.ReactNode
  data?: TransferDataItem[]
  flattedData?: FlattedTransferDataItem[]
  checkedIds?: React.ReactText[]
  searchable?: boolean
  keyword?: string
  onSearch?: (keyword: string) => void
  onChange?: (checkedIds: React.ReactText[]) => void
  placeholder?: string
  emptyContent?: React.ReactNode
  render?: (item: TransferDataItem) => React.ReactNode
}

function SourcePanel({
  title,
  data = [],
  flattedData = [],
  checkedIds = [],
  searchable,
  keyword: keywordProp,
  onSearch,
  onChange,
  placeholder,
  emptyContent,
  render,
}: PanelProps) {
  const prefixCls = _prefix + '-source-panel'

  const [keyword, tryChangeKeyword] = useUncontrolledState(keywordProp || '', keywordProp, onSearch)
  const { filterTree, treeProps } = useTreeSearchProps({
    data: data as TreeDataItem[],
  })

  const isTreeData = useMemo(() => {
    return flattedData.some(
      (item) => item?.raw?.children?.length && !item?.groupId && !item?.groupTitle
    )
  }, [flattedData])

  const filteredData = useMemo(() => {
    return flattedData.filter(
      (item) =>
        (item?.title && item?.title?.toString().toLowerCase().includes(keyword.toLowerCase())) ||
        (item?.groupTitle &&
          item.children?.length &&
          item.children?.length > 0 &&
          item.children?.some(
            (child: TransferDataItem) =>
              child.title && child.title.toString().toLowerCase().includes(keyword.toLowerCase())
          ))
    ) as TransferDataItem[]
  }, [flattedData, keyword])

  const renderTitle = useCallback(
    (item: TransferDataItem) => {
      if (render) {
        return render(item)
      }
      return <Highlighter keyword={new RegExp(keyword, 'ig')}>{item.title}</Highlighter>
    },
    [render, keyword]
  )

  return (
    <div className={prefixCls}>
      {searchable && (
        <div className={`${prefixCls}__search`}>
          <Input
            size="md"
            prefix={<SearchOutlined />}
            placeholder={placeholder}
            value={keyword}
            onChange={(evt) => {
              tryChangeKeyword(evt.target.value)
              filterTree(evt.target.value)
            }}
          />
        </div>
      )}
      {filteredData.length > 0 && (
        <div className={`${prefixCls}__check-all`}>
          <Checkbox
            checked={checkedIds.length === filteredData.filter((item) => !item.disabled).length}
            indeterminate={
              checkedIds.length > 0 &&
              checkedIds.length < filteredData.filter((item) => !item.disabled).length
            }
            onChange={(evt) =>
              onChange?.(
                evt.target.checked
                  ? filteredData.filter((item) => !item.disabled).map((item) => item.id)
                  : []
              )
            }
          >
            {title}{' '}
            <span className={`${prefixCls}__check-all-count`}>
              (
              {checkedIds.length > 0
                ? `${checkedIds.length}/${filteredData.length}`
                : filteredData.length}
              )
            </span>
          </Checkbox>
        </div>
      )}
      {filteredData.length > 0 ? (
        <div className={`${prefixCls}__list`}>
          {!isTreeData ? (
            filteredData.map((item) => {
              if (item.groupTitle) {
                return (
                  <div key={item.id} className={`${prefixCls}__item-group`}>
                    <div className={`${prefixCls}__item-group-title`}>{item.groupTitle}</div>
                  </div>
                )
              }

              return (
                <div
                  key={item.id}
                  className={cx(
                    `${prefixCls}__item`,
                    item.disabled && `${prefixCls}__item--disabled`
                  )}
                  onClick={() =>
                    !item.disabled &&
                    onChange?.(
                      checkedIds.includes(item.id)
                        ? checkedIds.filter((id) => id !== item.id)
                        : [...checkedIds, item.id]
                    )
                  }
                >
                  <Checkbox
                    disabled={item.disabled}
                    checked={checkedIds.includes(item.id)}
                    onChange={() =>
                      onChange?.(
                        checkedIds.includes(item.id)
                          ? checkedIds.filter((id) => id !== item.id)
                          : [...checkedIds, item.id]
                      )
                    }
                    onClick={(evt) => evt.stopPropagation()}
                  />
                  <div className={`${prefixCls}__item-title`}>{renderTitle(item)}</div>
                </div>
              )
            })
          ) : (
            <Tree
              className={`${_prefix}-tree`}
              checkable
              checkedMode="SEPARATE"
              {...treeProps}
              checkedIds={checkedIds}
              onCheck={(checkedIds) => {
                onChange?.(checkedIds)
              }}
              render={render}
            />
          )}
        </div>
      ) : (
        <div className={`${prefixCls}__empty`}>{emptyContent}</div>
      )}
    </div>
  )
}

interface DragEventHandler {
  draggable?: boolean
  onDragStart?: (evt: React.DragEvent, option: { dragNode: TransferDataItem }) => void
  onDragEnd?: (evt: React.DragEvent, option: { dragNode: TransferDataItem }) => void
  onDragLeave?: (evt: React.DragEvent, option: { dropNode: TransferDataItem }) => void
  onDragOver?: (evt: React.DragEvent, option: { dropNode: TransferDataItem }) => void
  onDrop?: (
    evt: React.DragEvent,
    sourceId: React.ReactText,
    targetId: React.ReactText,
    direction: string | null
  ) => void
}

function TargetPanel({
  title,
  data = [],
  checkedIds = [],
  searchable,
  keyword: keywordProp,
  onSearch,
  onChange,
  placeholder,
  emptyContent,
  render,
  draggable,
  onDragStart,
  onDragEnd,
  onDragLeave,
  onDragOver,
  onDrop,
}: PanelProps & DragEventHandler) {
  const prefixCls = _prefix + '-target-panel'
  const i18n = useLocaleContext()

  const [keyword, tryChangeKeyword] = useUncontrolledState(keywordProp || '', keywordProp, onSearch)
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item?.title?.toString().toLowerCase().includes(keyword.toLowerCase())
    )
  }, [data, keyword])

  const renderTitle = useCallback(
    (item: TransferDataItem) => {
      if (render) {
        return render(item)
      }
      return <Highlighter keyword={new RegExp(keyword, 'ig')}>{item.title}</Highlighter>
    },
    [render, keyword]
  )

  return (
    <div className={prefixCls}>
      {searchable && (
        <div className={`${prefixCls}__search`}>
          <Input
            size="md"
            prefix={<SearchOutlined />}
            placeholder={placeholder}
            value={keyword}
            onChange={(evt) => tryChangeKeyword(evt.target.value)}
          />
        </div>
      )}
      {checkedIds.length > 0 && filteredData.length > 0 && (
        <div className={`${prefixCls}__checked`}>
          <div className={`${prefixCls}__checked-title`}>
            {title} ({checkedIds.length})
          </div>
          <Button size="xs" type="secondary" appearance="link" onClick={() => onChange?.([])}>
            {i18n.get('transfer.clear')}
          </Button>
        </div>
      )}
      {filteredData.length > 0 ? (
        <div className={`${prefixCls}__list`}>
          {filteredData.map((item) => (
            <TransferItem
              key={item.id}
              item={{ ...item, title: renderTitle(item) }}
              onClose={() => onChange?.(checkedIds.filter((id) => id !== item.id))}
              draggable={draggable}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      ) : (
        <div className={`${prefixCls}__empty`}>{emptyContent}</div>
      )}
    </div>
  )
}

function TransferItem({
  item,
  draggable,
  onClose,
  onDragStart,
  onDragEnd,
  onDragLeave,
  onDragOver,
  onDrop,
}: {
  item: TransferDataItem
  onClose: () => void
} & DragEventHandler) {
  const prefixCls = _prefix + '-target-panel__item'

  const transferItemNodeRef = useRef<HTMLDivElement | null>(null)
  const dragNodeRef = useRef<TransferDataItem | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [direction, setDirection] = useState<string | null>(null)

  const cls = cx(
    prefixCls,
    isDragging && `${prefixCls}--dragging`,
    direction && `${prefixCls}--drag-${direction}`
  )

  return (
    <div
      className={cls}
      ref={transferItemNodeRef}
      draggable={draggable}
      onDragStart={(evt) => {
        const { id } = item

        evt.stopPropagation()

        setIsDragging(true)
        dragNodeRef.current = item
        evt.dataTransfer.setData('transferNode', JSON.stringify({ sourceId: id }))

        onDragStart?.(evt, { dragNode: item })
      }}
      onDragEnd={(evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        evt.dataTransfer.clearData()
        dragNodeRef.current = null
        setDirection(null)
        setIsDragging(false)
        onDragEnd?.(evt, { dragNode: item })
      }}
      onDragLeave={(evt) => {
        evt.preventDefault()
        evt.stopPropagation()
        setDirection(null)
        onDragLeave?.(evt, { dropNode: item })
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

        onDragOver?.(evt, { dropNode: item })
      }}
      onDrop={(evt) => {
        const dragId = dragNodeRef.current?.id

        evt.preventDefault()
        evt.stopPropagation()
        setDirection(null)

        const targetId = item.id

        if (onDrop && dragId !== targetId) {
          try {
            const { sourceId } = JSON.parse(evt.dataTransfer.getData('transferNode'))
            onDrop(evt, sourceId, targetId, direction)
          } catch (error) {
            console.error(error)
          }
        }
      }}
    >
      {draggable && <DragDotOutlined className={`${prefixCls}-drag-dot`} />}
      <div className={`${prefixCls}-title`}>{item.title}</div>
      <Button
        className={`${prefixCls}-close`}
        size="xs"
        appearance="link"
        icon={<CloseOutlined />}
        onClick={onClose}
      />
    </div>
  )
}
