import React, { useState, useContext, useEffect } from 'react'
import Cell from './Cell'
import TableContext from './context'
import classNames from 'classnames'
import _ from 'lodash'
import Checkbox from '../checkbox'
import Icon from '../icon'
import { flatTreeData, setDepth } from './util'

const Row = ({
  rowData,
  allRowData,
  level,
  expandedTree,
  expandedTreeRows,
  setExpandedTreeRows,
  isFixed,
  isSumRow, // 是否为合计行
  isAvgRow, // 是否为平均行
  index,
  innerRef,
  rowHeight,
  isTree,
  expanded: _expanded
}) => {
  const [expanded, setExpanded] = useState(_expanded || false)
  useEffect(() => {
    setExpanded(_expanded)
  }, [_expanded])
  const {
    errorRowKeys,
    rowSelection,
    highlightedRowKeys,
    setHighlightRows,
    columns,
    expandedRender,
    leftFixedColumns,
    rightFixedColumns,
    hoverRow,
    setHoverRow,
    prefix,
    onExpand
  } = useContext(TableContext)

  const _columns = _.cloneDeep(columns)
  const depthArray = []
  setDepth(_columns, 0, depthArray)

  let rowColumns = flatTreeData(_columns).filter((col) => col.isLast)
  if (isFixed === 'left') {
    rowColumns = leftFixedColumns
  }
  if (isFixed === 'right') {
    rowColumns = rightFixedColumns
  }
  return [
    <tr
      style={isFixed && rowHeight ? { height: rowHeight } : {}}
      ref={innerRef}
      className={classNames(`${prefix}__row`, {
        [`${prefix}__row--error`]: errorRowKeys.includes(rowData.key),
        [`${prefix}__row--highlight`]: hoverRow === rowData.key || highlightedRowKeys.includes(rowData.key),
        [`${prefix}__row--total`]: isSumRow,
        [`${prefix}__row--avg`]: isAvgRow
      })}
      key="row"
      onDoubleClick={(e) => {
        if (highlightedRowKeys.includes(rowData.key)) {
          setHighlightRows(highlightedRowKeys.filter((r) => r !== rowData.key))
        } else {
          setHighlightRows(highlightedRowKeys.concat(rowData.key))
        }
      }}
      onMouseEnter={(e) => setHoverRow(rowData.key)}
      onMouseLeave={(e) => setHoverRow(null)}
    >
      {rowSelection && isFixed !== 'right' && (
        <td style={{ width: 50 }}>
          <Checkbox
            checked={rowSelection.selectedRowKeys.includes(rowData.key)}
            onChange={(e) => {
              const { selectedRowKeys = [], onChange } = rowSelection
              const _selectedRowKeys = [...selectedRowKeys]
              if (_selectedRowKeys.includes(rowData.key)) {
                onChange(_selectedRowKeys.filter((key) => key !== rowData.key))
              } else {
                _selectedRowKeys.push(rowData.key)
                onChange(_selectedRowKeys)
              }
            }}
          />
        </td>
      )}
      {expandedRender && (
        <td style={{ width: 50 }}>
          <Icon
            style={{ cursor: 'pointer' }}
            name={expanded ? 'down' : 'right'}
            onClick={() => {
              if (_expanded === undefined) {
                setExpanded(!expanded)
              }
              if (onExpand) {
                onExpand(!expanded, rowData)
              }
            }}
          />
        </td>
      )}

      {rowColumns.map((column, idx) => (
        <Cell
          key={idx}
          column={column}
          rowData={rowData}
          allRowData={allRowData}
          level={level}
          columnIndex={idx}
          rowIndex={index}
          isTree={isTree}
          expandedTree={expandedTree}
          expandedTreeRows={expandedTreeRows}
          setExpandedTreeRows={setExpandedTreeRows}
        />
      ))}
    </tr>,
    // 可展开的内嵌部分
    expandedRender && expanded && (
      <tr key="expanded-row" className={`${prefix}--expanded`} style={{ background: 'rgba(251,251,251,1)' }}>
        {/* 多选占位 */}
        {rowSelection && <td />}
        {/* 可展开内嵌显示 */}
        <td colSpan={columns.length + 1} style={{ color: '#666666' }}>
          {expandedRender(rowData, index)}
        </td>
      </tr>
    )
  ]
}

export default Row
