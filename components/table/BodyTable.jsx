import React, { useContext, useEffect, useCallback, useState } from 'react'
import classNames from 'classnames'

import Row from './Row'
import TableContext from './context'
import _ from 'lodash'
import { flatTreeData, setDepth, checkNeedTotalOrEvg, getTotalOrEvgRowData } from './util'

const BodyTable = ({ fatherRef, emptyContent }) => {
  const {
    bordered,
    data = [],
    columns,
    activeSorterColumn,
    activeSorterType,
    maxHeight,
    headerTableRef,
    bodyTableRef,
    tableRef,
    syncScrollLeft,
    firstRowRef,
    realColumnsWidth,
    resizable,
    prefix,
    hoverColIndex,
    setHoverColIndex,
    showColHighlight,
    setEachRowHeight,
    expandedRender,
    expandedRowKeys,
    rowSelection,
    localeDatas,
    expandedTreeRows,
    rowExpandable,
    setExpandedTreeRows,
    onLoadChildren,
    loadChildren
  } = useContext(TableContext)
  const [dragStatus, setDragStatus] = useState(null)
  const [dragRowKey, setDragRowKey] = useState(null)

  // **************** 获取colgroup
  const _columns = _.cloneDeep(columns)
  const depthArray = []
  setDepth(_columns, 0, depthArray)
  const columnsgroup = [rowSelection && 'checkbox', expandedRender && 'expandedButton']
    .concat(flatTreeData(_columns).filter((col) => col.isLast))
    .filter((column) => !!column)
  // ****************
  // **************** 同步滚动位置

  // **************** 根据排序列处理数据
  let _data = data.concat()

  if (activeSorterColumn) {
    const sorter =
      columns.filter((d) => d.dataKey === activeSorterColumn)[0] &&
      columns.filter((d) => d.dataKey === activeSorterColumn)[0].sorter

    if (sorter) {
      _data = activeSorterType === 'ascend' ? [...data].sort(sorter) : [...data].sort(sorter).reverse()
    }
  }

  // ************* 处理求和、平均数
  // 确保包含total属性，且值为数字类型的字符串
  const hasSumColumn = columns.filter((item) => checkNeedTotalOrEvg(_data, item, 'total')).length > 0
  const sumRow = { key: 'sum' }
  columns.forEach((c, index) => {
    if (index === 0) {
      sumRow[c.dataKey] = localeDatas.table.total
    }
    if (checkNeedTotalOrEvg(_data, c, 'total')) {
      // 获取当前数据最大小数点个数，并设置最后总和值小数点
      sumRow[c.dataKey] = getTotalOrEvgRowData(_data, c, false)
    }
  })

  // 确保包含avg属性，且值为数字类型的字符串
  const hasAvgColumn = columns.filter((item) => checkNeedTotalOrEvg(_data, item, 'avg')).length > 0
  const avgRow = { key: 'avg' }
  columns.forEach((c, index) => {
    if (index === 0) {
      avgRow[c.dataKey] = localeDatas.table.average
    }
    if (checkNeedTotalOrEvg(_data, c, 'avg')) {
      avgRow[c.dataKey] = getTotalOrEvgRowData(_data, c, true)
    }
  })

  useEffect(() => {
    if (tableRef.current && tableRef.current.children[1].children) {
      const rowHeightMap = {}
      Array.from(tableRef.current.children[1].children).forEach((tr) => {
        rowHeightMap[tr.id] = tr.clientHeight
      })
      setEachRowHeight(rowHeightMap)
    }
  }, [data, setEachRowHeight, columns, expandedTreeRows])

  let hasTree = false
  if (_data && _data.length) {
    hasTree = _data.some((row) => {
      return (row.children && row.children.length) || (onLoadChildren && row.isLeaf)
    })
  }

  const renderRow = (row, level, index, rowConfig = {}, isTree) => {
    let childrenHasTree = false
    const { key } = row
    if (loadChildren.current) {
      const { parentKey, data: children } = loadChildren.current
      if (parentKey === key) {
        Object.assign(row, { children })
        loadChildren.current = null
      }
    }
    const { children = [] } = row
    if (children && children.length) {
      childrenHasTree = children.some(
        (child) => (child.children && child.children.length) || (onLoadChildren && child.isLeaf)
      )
    }
    return (
      <React.Fragment key={key}>
        <Row
          innerRef={index === 0 ? firstRowRef : null}
          key={key}
          rowData={row}
          allRowData={row}
          level={level}
          dragStatus={dragStatus}
          dragRowKey={dragRowKey}
          setDragRowKey={setDragRowKey}
          setDragStatus={setDragStatus}
          index={index}
          hoverColIndex={hoverColIndex}
          setHoverColIndex={setHoverColIndex}
          expanded={Array.isArray(expandedRowKeys) ? expandedRowKeys.includes(row.key) : undefined}
          expandedTree={expandedTreeRows.includes(row.key)}
          expandedTreeRows={expandedTreeRows}
          setExpandedTreeRows={setExpandedTreeRows}
          isAvgRow={rowConfig.isAvgRow}
          isSumRow={rowConfig.isSumRow}
          isTree={isTree}
          rowExpandable={rowExpandable}
        />
        {children &&
          expandedTreeRows.includes(key) &&
          children.map((child) => {
            return renderRow(child, level + 1, index, _, childrenHasTree || isTree)
          })}
      </React.Fragment>
    )
  }
  const renderEmptyContent = useCallback(() => {
    return (
      <tr>
        <td colSpan={columnsgroup.length} style={{ textAlign: 'center', height: 60 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {typeof emptyContent === 'function' ? emptyContent() : emptyContent}
          </div>
        </td>
      </tr>
    )
  }, [columnsgroup.length, emptyContent])
  return (
    <div
      style={{
        maxHeight: maxHeight || 'auto',
        borderLeft: bordered ? '1px solid #e7e7e7' : 'none',
        overflowY: tableRef.current && tableRef.current.clientHeight > maxHeight ? 'scroll' : null, // maxHeight 小于 table 实际高度才处滚动条
        overflowX:
          (bodyTableRef.current && bodyTableRef.current.clientWidth) <
          (tableRef.current && tableRef.current.clientWidth)
            ? 'scroll'
            : null // 表格宽度大于div宽度才展示横向滚动条
      }}
      ref={bodyTableRef}
      className={classNames({
        [`${prefix}__body--darging`]: dragStatus
      })}
      onScroll={(e) => {
        e.stopPropagation()
        syncScrollLeft(bodyTableRef.current.scrollLeft, headerTableRef.current)
      }}
    >
      <table ref={tableRef}>
        <colgroup>
          {columnsgroup.map((c, index) => {
            const width = c === 'checkbox' ? 50 : c.width
            return (
              <col
                key={index}
                className={classNames({
                  [`${prefix}__col__hover--highlight`]: showColHighlight && hoverColIndex === c.dataKey
                })}
                style={{
                  width: resizable ? realColumnsWidth[index] : width,
                  minWidth: resizable ? realColumnsWidth[index] : width
                }}
              />
            )
          })}
        </colgroup>
        <tbody>
          {_data && _data.length > 0
            ? _data.map((row, index) => renderRow(row, 1, index, _, hasTree))
            : renderEmptyContent(emptyContent)}
          {hasSumColumn && renderRow(sumRow, 1, data.length, { isSumRow: true })}
          {hasAvgColumn && renderRow(avgRow, 1, data.length + 1, { isAvgRow: true })}
        </tbody>
      </table>
    </div>
  )
}

export default BodyTable
