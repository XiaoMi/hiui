import React, { useContext } from 'react'
import classNames from 'classnames'
import TableContext from './context'
import Icon from '../icon'
import Indent from './Indent'

const Cell = ({
  column,
  rowData,
  allRowData,
  columnIndex,
  level,
  expandedTree,
  expandedTreeRows,
  setExpandedTreeRows,
  rowIndex,
  isTree
}) => {
  const { highlightedColKeys, highlightColumns, alignRightColumns, prefix } = useContext(TableContext)
  // 处理自定义 render 或者合并单元格情况
  let cellContent = column.render
    ? column.render(allRowData[column.dataKey], allRowData, rowIndex)
    : allRowData[column.dataKey]
  const isMergeCell = cellContent && typeof cellContent === 'object' && !cellContent['$$typeof']

  if (isMergeCell && (cellContent.props.colSpan === 0 || cellContent.props.rowSpan === 0)) {
    return null
  }
  return (
    <td
      key={column.dataKey}
      style={{
        textAlign: alignRightColumns.includes(column.dataKey) ? 'right' : 'left'
      }}
      colSpan={(isMergeCell && cellContent.props.colSpan) || ''}
      rowSpan={(isMergeCell && cellContent.props.rowSpan) || ''}
      className={classNames({
        [`${prefix}__col--highlight`]:
          highlightedColKeys.includes(column.dataKey) || highlightColumns.includes(column.dataKey)
      })}
    >
      {level > 1 && columnIndex === 0 && <Indent times={level - 1} />}
      {columnIndex === 0 &&
        (rowData.children ? (
          <Icon
            style={{ marginRight: 4, cursor: 'pointer' }}
            name={expandedTree ? 'caret-down' : 'caret-right'}
            onClick={() => {
              const _expandedTreeRows = [...expandedTreeRows]
              if (_expandedTreeRows.includes(rowData.key)) {
                const idx = _expandedTreeRows.findIndex((row) => row === rowData.key)
                _expandedTreeRows.splice(idx, 1)
                setExpandedTreeRows(_expandedTreeRows)
              } else {
                _expandedTreeRows.push(rowData.key)
                setExpandedTreeRows(_expandedTreeRows)
              }
            }}
          />
        ) : (
          isTree && <span style={{ width: 14, display: 'inline-block' }} key={Math.random()} />
        ))}

      {(isMergeCell && cellContent.children) || cellContent}
    </td>
  )
}

export default Cell
