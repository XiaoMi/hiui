import React, { useContext, useState } from 'react'
import classNames from 'classnames'
import TableContext from './context'
import Icon from '../icon'
import Indent from './Indent'
import IconLoading from './LoadingIcon'

const Cell = ({
  column,
  allRowData,
  columnIndex,
  level,
  expandedTree,
  expandedTreeRows,
  setExpandedTreeRows,
  rowIndex,
  isTree
}) => {
  const {
    highlightedColKeys,
    highlightColumns,
    alignRightColumns,
    prefix,
    onLoadChildren,
    loadChildren,
    hoverColIndex,
    setHoverColIndex,
    showColHighlight
  } = useContext(TableContext)

  const [loading, setLoading] = useState(false)
  // 处理自定义 render 或者合并单元格情况
  const cellContent = column.render
    ? column.render(allRowData[column.dataKey], allRowData, rowIndex, column.dataKey)
    : allRowData[column.dataKey]
  const isMergeCell = cellContent && typeof cellContent === 'object' && !cellContent.$$typeof
  if (isMergeCell && (cellContent.props.colSpan === 0 || cellContent.props.rowSpan === 0)) {
    return null
  }
  const { rightStickyWidth, leftStickyWidth, dataKey } = column
  const isSticky = typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined'
  return (
    <td
      key={dataKey}
      style={{
        textAlign: alignRightColumns.includes(dataKey) ? 'right' : 'left',
        right: rightStickyWidth + 'px',
        left: leftStickyWidth + 'px'
      }}
      colSpan={(isMergeCell && cellContent.props.colSpan) || ''}
      rowSpan={(isMergeCell && cellContent.props.rowSpan) || ''}
      className={classNames({
        [`${prefix}__col--highlight`]:
          highlightedColKeys.includes(column.dataKey) || highlightColumns.includes(dataKey),
        [`${prefix}__col__hover--highlight`]: showColHighlight && hoverColIndex === dataKey,
        [`${prefix}__col--sticky`]: isSticky
      })}
      // 频繁的set会特别消耗性能
      onMouseEnter={(e) => showColHighlight && setHoverColIndex(dataKey)}
      onMouseLeave={(e) => showColHighlight && setHoverColIndex(null)}
    >
      {level > 1 && columnIndex === 0 && <Indent times={level - 1} />}
      {/* 在异步加载子节点的时候，通过 isLeaf 进行判断 */}
      {loading && <IconLoading />}
      {columnIndex === 0 &&
        !loading &&
        ((allRowData.children && allRowData.children.length > 0) || (onLoadChildren && allRowData.isLeaf) ? (
          <Icon
            style={{ marginRight: 4, cursor: 'pointer' }}
            name={expandedTree ? 'caret-down' : 'caret-right'}
            onClick={async () => {
              // 存在即收起，并删除该key
              loadChildren.current = null
              const _expandedTreeRows = [...expandedTreeRows]
              if (onLoadChildren && !expandedTree) {
                const data = onLoadChildren(allRowData)
                if (data.toString() === '[object Promise]') {
                  setLoading(true)
                  await data
                    .then((res) => {
                      loadChildren.current = { parentKey: allRowData.key, data: res }
                      setLoading(false)
                    })
                    .catch(() => {
                      loadChildren.current = null
                      setLoading(false)
                    })
                } else {
                  loadChildren.current = { parentKey: allRowData.key, data }
                }
              }
              if (_expandedTreeRows.includes(allRowData.key)) {
                const idx = _expandedTreeRows.findIndex((row) => row === allRowData.key)
                _expandedTreeRows.splice(idx, 1)
                setExpandedTreeRows(_expandedTreeRows)
              } else {
                _expandedTreeRows.push(allRowData.key)
                setExpandedTreeRows(_expandedTreeRows)
              }
            }}
          />
        ) : (
          isTree && <span style={{ width: 18, display: 'inline-block' }} key={Math.random()} />
        ))}

      {(isMergeCell && cellContent.children) || cellContent}
    </td>
  )
}

export default Cell
