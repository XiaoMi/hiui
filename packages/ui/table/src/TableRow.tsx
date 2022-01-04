// @ts-nocheck
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
// import { Column, RowSelection } from './Table'
import { useTableContext } from './context'
// import { cloneTree } from '@hi-ui/tree-utils'
import { TableCell } from './TableCell'
import { TableExpandedRow } from './TableExpandedRow'
import { useLatestCallback } from '@hi-ui/use-latest'
import { setAttrAria } from '@hi-ui/dom-utils'
import { TableRowSelection, TableColumnItem } from './types'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableRow
 */
export const TableRow = forwardRef<HTMLTableRowElement | null, TableRowProps>(
  (
    {
      prefixCls = _prefix,
      rowData: rowDataProp,
      // allRowData,
      level,
      showColHighlight,
      hoverColIndex,
      setHoverColIndex,
      expandedTree,
      expandedTreeRows,
      setExpandedTreeRows,
      isSumRow, // 是否为合计行
      isAvgRow, // 是否为平均行
      rowIndex,
      isTree,
    },
    ref
  ) => {
    const {
      onHighlightedRowChange,
      isHighlightedRow,
      flattedColumnsWithoutChildren,
      isErrorRow,
      rowSelection,
      columns,
      expandedRender,
      hoverRow,
      // prefixCls,
      disabledData,
      draggable,
      onDragStart: onDragStartContext,
      onDragLeave: onDragLeaveContext,
      onDragEnd: onDragEndContext,
      onDrop: onDropContext,
      dragRowRef,
    } = useTableContext()
    const rowData = rowDataProp.raw
    const rowKey = rowData.key
    // const rowKey = rowData.key

    // ** ************** checkbox 处理 *************** *//

    // TODO: 提取到外部
    const checkboxConfig =
      rowSelection && rowSelection.getCheckboxConfig && rowSelection.getCheckboxConfig(rowData)
    const checkboxDisabled = (checkboxConfig && checkboxConfig.disabled) || false

    if (checkboxDisabled) {
      disabledData.current.push(rowKey)
    }

    // const rowExpand = rowExpandable && rowExpandable(rowData)

    // const sticky = flattedColumnsWithoutChildren.some((item) => {
    //   return (
    //     typeof item.leftStickyWidth !== 'undefined' || typeof item.rightStickyWidth !== 'undefined'
    //   )
    // })

    // ** ************** 拖拽管理 *************** *//

    const [dragging, setDragging] = React.useState(false)
    const [dragDirection, setDragDirection] = React.useState<string>()

    const onDragStartContextLatest = useLatestCallback(onDragStartContext)

    const onDragStart = React.useCallback(
      (evt) => {
        if (!draggable) return

        evt.stopPropagation()

        const clientY = evt.clientY

        dragRowRef.current = {
          startClientY: clientY,
          dragId: rowKey,
          level: level,
          rowData: rowData,
        }

        setDragging(true)

        evt.dataTransfer.setData('tableRow', JSON.stringify({ sourceId: rowKey }))

        onDragStartContextLatest(rowData)
      },
      [draggable, dragRowRef, onDragStartContextLatest, rowData, level, rowKey]
    )

    const onDragOver = React.useCallback(
      (evt) => {
        if (!draggable) return

        evt.preventDefault()
        evt.stopPropagation()

        if (!dragRowRef.current) return

        const { startClientY, dragId } = dragRowRef.current

        if (dragId === rowKey) return

        const hoverClientY = evt.clientY

        if (hoverClientY < startClientY) {
          setDragDirection('top')
        } else {
          setDragDirection('bottom')
        }
      },
      [draggable, dragRowRef, rowKey]
    )

    const onDragLeaveContextLatest = useLatestCallback(onDragLeaveContext)

    const onDragLeave = React.useCallback(
      (evt: React.DragEvent) => {
        if (!draggable) return

        evt.preventDefault()
        evt.stopPropagation()

        setDragDirection(undefined)
        onDragLeaveContextLatest(evt)
      },
      [draggable, onDragLeaveContextLatest]
    )

    const onDragEndContextLatest = useLatestCallback(onDragEndContext)

    const onDragEnd = React.useCallback(
      (evt: React.DragEvent) => {
        if (!draggable) return

        evt.preventDefault()
        evt.stopPropagation()

        evt.dataTransfer.clearData()
        dragRowRef.current = null
        setDragDirection(undefined)
        setDragging(false)

        onDragEndContextLatest(evt)
      },
      [draggable, dragRowRef, onDragEndContextLatest]
    )

    const onDropContextLatest = useLatestCallback(onDropContext)

    // 放置目标元素时触发事件
    const onDrop = React.useCallback(
      (evt: React.DragEvent) => {
        // console.log(dragRowRef.current)

        if (!draggable) return
        if (!dragRowRef.current) return

        const { dragId } = dragRowRef.current

        evt.preventDefault()
        evt.stopPropagation()

        setDragDirection(undefined)
        dragRowRef.current = null

        const targetId = rowKey

        if (dragId === targetId) return

        try {
          const { sourceId } = JSON.parse(evt.dataTransfer.getData('tableRow'))

          onDropContextLatest(sourceId, targetId, dragDirection)
        } catch (error) {
          console.error(error)
        }
      },
      [draggable, dragRowRef, onDropContextLatest, dragDirection, rowKey]
    )

    const handleRowDoubleClick = () => {
      onHighlightedRowChange(rowData, !highlighted)
    }

    // ** ************** 行状态管理 *************** *//

    const highlighted = isHighlightedRow(rowKey)
    const hovered = hoverRow === rowKey
    const hasError = isErrorRow(rowKey)

    const cls = cx(
      `${prefixCls}-row`,
      hasError && `${prefixCls}-row--error`,
      hovered && `${prefixCls}-row--hovered`,
      highlighted && `${prefixCls}-row--highlight`,
      draggable && `${prefixCls}-row--draggable`,
      draggable && dragging && `${prefixCls}-row--dragging`,
      draggable && dragDirection && `${prefixCls}-row--drag-${dragDirection}`,
      isSumRow && `${prefixCls}-row--total`,
      isAvgRow && `${prefixCls}-row--avg`
    )

    return [
      <tr
        ref={ref}
        className={cls}
        key="row"
        onDoubleClick={handleRowDoubleClick}
        draggable={setAttrAria(draggable)}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* 表格列数据 */}
        {flattedColumnsWithoutChildren.map((column, idx) => {
          return (
            <TableCell
              key={idx}
              column={column}
              columnIndex={idx}
              rowData={rowDataProp}
              depth={rowDataProp.depth}
              rowIndex={rowIndex}
              showColHighlight={showColHighlight}
              hoverColIndex={hoverColIndex}
              setHoverColIndex={setHoverColIndex}
              level={level}
              isTree={isTree}
              expandedTree={expandedTree}
              expandedTreeRows={expandedTreeRows}
              setExpandedTreeRows={setExpandedTreeRows}
            />
          )
        })}
      </tr>,

      // 可展开的内嵌面板
      expandedRender ? (
        <TableExpandedRow
          expandedRender={expandedRender}
          rowSelection={rowSelection}
          columns={columns}
          rowData={rowDataProp}
          rowIndex={rowIndex}
        />
      ) : null,
    ]
  }
)

export interface TableRowProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 列配置项
   */
  columns: TableColumnItem[]
  /**
   * 数据配置项
   */
  data: object[]
  /**
   * 第一行ref
   */
  firstRowRef: React.RefObject<HTMLTableRowElement>
  fixedColWidth: number[]
  rowSelection?: TableRowSelection
}

if (__DEV__) {
  TableRow.displayName = 'TableRow'
}
