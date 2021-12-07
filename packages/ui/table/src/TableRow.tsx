import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
// import { Column, RowSelection } from './Table'
import { Checkbox } from '@hi-ui/checkbox'
import { useTableContext } from './context'
// import { cloneTree } from '@hi-ui/tree-utils'
import { defaultLoadingIcon } from './icons'
import { IconButton } from '@hi-ui/icon-button'
import { TableCell } from './TableCell'
import { TableExpandedRow } from './TableExpandedRow'

const _role = 'table'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TableRow
 */
export const TableRow = forwardRef<HTMLDivElement | null, TableRowProps>(
  (
    {
      prefixCls = _prefix,
      rowData,
      // allRowData,
      level,
      showColHighlight,
      hoverColIndex,
      setHoverColIndex,
      expandedTree,
      expandedTreeRows,
      setExpandedTreeRows,
      isFixed,
      isSumRow, // 是否为合计行
      isAvgRow, // 是否为平均行
      rowIndex,
      innerRef,
      rowHeight,
      isTree,
      dragStatus,
      setDragStatus,
      dragRowKey,
      setDragRowKey,
      expanded,
      setExpanded,
    },
    ref
  ) => {
    const {
      checkboxColWidth,
      flattedColumns,
      flattedColumnsWithoutChildren,
      errorRowKeys,
      rowSelection,
      highlightedRowKeys,
      setHighlightRows,
      columns,
      expandedRender,
      hoverRow,
      // prefixCls,
      rowExpandable,
      onExpand,
      disabledData,
      draggable,
      onDragStart: onDragStartContext,
      dargInfo,
    } = useTableContext()

    // TODO: 提取到外部
    const checkboxConfig =
      rowSelection && rowSelection.getCheckboxConfig && rowSelection.getCheckboxConfig(rowData)
    const checkboxDisabled = (checkboxConfig && checkboxConfig.disabled) || false

    if (checkboxDisabled) {
      disabledData.current.push(rowData.key)
    }

    const rowExpand = rowExpandable && rowExpandable(rowData)
    const [dropHightLineStatus, setDropHightLineStatus] = React.useState(null)

    const rowKey = rowData.key

    const sticky = flattedColumnsWithoutChildren.some((item) => {
      return (
        typeof item.leftStickyWidth !== 'undefined' || typeof item.rightStickyWidth !== 'undefined'
      )
    })

    const handleRowDoubleClick = () => {
      if (highlightedRowKeys.includes(rowData.key)) {
        setHighlightRows(highlightedRowKeys.filter((rowKey) => rowKey !== rowData.key))
      } else {
        setHighlightRows(highlightedRowKeys.concat(rowData.key))
      }
    }

    const onDragStart = React.useCallback(
      (evt) => {
        if (!draggable) return

        const clientY = evt.clientY
        dargInfo.current = {
          startClientY: clientY,
          dragKey: rowKey,
          level: level,
          rowData: rowData,
        }
        onDragStartContext && onDragStartContext(rowData)
        setDragStatus(true)
        setDragRowKey(rowKey)
      },
      [
        rowData,
        // dragStatus,
        // dragRowKey,
        onDragStartContext,
        draggable,
        dargInfo,
        level,
        rowKey,
        setDragRowKey,
        setDragStatus,
      ]
    )

    const onDragEnter = React.useCallback(
      (evt) => {
        if (!draggable) return

        const { startClientY, dragKey } = dargInfo.current
        const clienY = evt.clientY
        dargInfo.current = {
          ...dargInfo.current,
          dropKey: rowKey,
          dropClientY: clienY,
          dropRowData: rowData,
        }
        dragKey !== rowKey && setDropHightLineStatus(clienY < startClientY ? 'top' : 'bottom')
      },
      [rowKey, draggable, rowData, dargInfo]
    )

    // draggable={draggable}
    const onMouseMove = () => {
      setDragRowKey(null)
      setDragStatus(false)
    }

    const onDragEnd = () => {
      if (!draggable) return
      dargInfo.current = {}
      setDropHightLineStatus(null)
    }

    const onDragOver = (e) => {
      if (!draggable) return
      e.preventDefault()
    }

    const onDragLeave = () => {
      if (!draggable) return
      setDropHightLineStatus(null)
    }

    console.log('errorRowKeys', errorRowKeys)

    const cls = cx(`${prefixCls}__row`, {
      [`${prefixCls}__row--error`]: errorRowKeys.includes(rowData.key),
      [`${prefixCls}__row--highlight`]:
        hoverRow === rowData.key || highlightedRowKeys.includes(rowData.key),
      [`${prefixCls}__row--total`]: isSumRow,
      [`${prefixCls}__row--draggable`]: draggable,
      [`${prefixCls}__row--draging`]: draggable && dragRowKey === rowKey,
      [`${prefixCls}__row--draggable__border--top`]:
        draggable &&
        typeof dargInfo.current.dropKey !== 'undefined' &&
        dropHightLineStatus === 'top',
      [`${prefixCls}__row--draggable__border--bottom`]:
        draggable &&
        typeof dargInfo.current.dropKey !== 'undefined' &&
        dropHightLineStatus === 'bottom',
      [`${prefixCls}__row--avg`]: isAvgRow,
    })

    return [
      <tr
        className={cls}
        key="row"
        onDoubleClick={handleRowDoubleClick}
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onMouseMove={onMouseMove}
        onDragEnd={onDragEnd}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
      >
        {rowSelection && isFixed !== 'right' && !isSumRow && !isAvgRow ? (
          <td
            style={{ width: checkboxColWidth }}
            className={cx(sticky && `${prefixCls}__col--sticky`)}
          >
            <Checkbox
              checked={rowSelection.selectedRowKeys.includes(rowData.key)}
              disabled={checkboxDisabled}
              onChange={(e) => {
                const { selectedRowKeys = [], onChange } = rowSelection
                const _selectedRowKeys = [...selectedRowKeys]

                if (_selectedRowKeys.includes(rowData.key)) {
                  onChange(
                    _selectedRowKeys.filter((key) => key !== rowData.key),
                    rowData,
                    false
                  )
                } else {
                  _selectedRowKeys.push(rowData.key)
                  onChange(_selectedRowKeys, rowData, true)
                }
              }}
            />
          </td>
        ) : null}

        {expandedRender ? (
          <td style={{ width: 50 }} className={cx(sticky && `${prefixCls}__col--sticky`)}>
            {renderSwitcher({
              prefixCls,
              rowExpand,
              sticky,
              expanded,
              onNodeExpand: () => {
                onExpand?.(!expanded, rowData)
              },
            })}
          </td>
        ) : null}

        {flattedColumnsWithoutChildren.map((column, idx) => {
          console.log(column)

          return (
            <TableCell
              key={idx}
              column={column}
              columnIndex={idx}
              rowData={rowData}
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
          expanded={expanded}
          setExpanded={setExpanded}
          onExpand={onExpand}
          rowSelection={rowSelection}
          columns={columns}
          rowData={rowData}
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
  columns: Column[]
  /**
   * 数据配置项
   */
  data: object[]
  /**
   * 第一行ref
   */
  firstRowRef: React.RefObject<HTMLTableRowElement>
  fixedColWidth: number[]
  rowSelection?: RowSelection
}

if (__DEV__) {
  TableRow.displayName = 'TableRow'
}

const renderSwitcher = ({
  prefixCls,
  rowExpand,
  sticky,
  expanded,
  onNodeExpand,
  expandIcon,
  collapseIcon,
}: {
  prefixCls: string
  rowExpand: boolean
  sticky: boolean
  expanded: string
  onNodeExpand: any
}) => {
  if (React.isValidElement(rowExpand)) {
    return rowExpand
  }

  if (rowExpand) {
    if (expanded === 'loading') {
      return (
        <IconButton
          className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}
          icon={defaultLoadingIcon}
        />
      )
    } else {
      return (
        <IconButton
          tabIndex={-1}
          className={cx(
            `${prefixCls}__switcher`,
            expanded ? `${prefixCls}__switcher--expanded` : `${prefixCls}__switcher--collapse`
          )}
          icon={expanded ? expandIcon : collapseIcon}
          onClick={onNodeExpand}
        />
      )
    }
  }

  return null
}
