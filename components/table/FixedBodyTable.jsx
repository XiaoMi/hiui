import React, { useContext, useRef } from 'react'
import classNames from 'classnames'

import Row from './Row'
import TableContext from './context'
import _ from 'lodash'
import { flatTreeData, setDepth, checkNeedTotalOrEvg, getTotalOrEvgRowData } from './util'

const FixedBodyTable = ({ isFixed, rightFixedIndex }) => {
  const {
    data,
    leftFixedData,
    rightFixedData,
    columns,
    maxHeight,
    scrollBarSize,
    syncScrollTop,
    leftFixedBodyTableRef,
    rightFixedBodyTableRef,
    bodyTableRef,
    activeSorterColumn,
    activeSorterType,
    prefix,
    showColHighlight,
    hoverColIndex,
    setHoverColIndex,
    realColumnsWidth,
    bordered,
    eachRowHeight,
    rowSelection,
    expandedRender,
    localeDatas,
    expandedTreeRows,
    setExpandedTreeRows,
    rowExpandable,
    flatLeftFixedColumns,
    flatRightFixedColumns,
    onLoadChildren,
    loadChildren
  } = useContext(TableContext)
  let _columns
  if (isFixed === 'left') {
    _columns = _.cloneDeep(flatLeftFixedColumns.filter((i) => !!i.dataKey))
  }
  if (isFixed === 'right') {
    _columns = _.cloneDeep(flatRightFixedColumns.filter((i) => !!i.dataKey))
  }
  const depthArray = []
  setDepth(_columns, 0, depthArray)
  // const columnsgroup = flatTreeData(_columns).filter((col) => col.isLast)
  const columnsgroup = [rowSelection && isFixed !== 'right' && 'checkbox', expandedRender && 'expandedButton']
    .concat(flatTreeData(_columns).filter((col) => col.isLast))
    .filter((column) => !!column)

  // TODO: 这里是考虑了多级表头的冻结，待优化
  // *********全量 col group
  const allColumns = _.cloneDeep(columns)
  const _depthArray = []
  setDepth(allColumns, 0, _depthArray)
  const allColumnsgroup = flatTreeData(allColumns).filter((col) => col.isLast)
  // ***********
  const bodyInner = useRef(null)

  let hasTree = false
  if (data && data.length) {
    hasTree = data.some((row) => {
      const { children = [] } = row
      return children.length || (onLoadChildren && row.isLeaf)
    })
  }

  // ************* 处理求和、平均数，功能同Bodytable
  const hasSumColumn = _columns.filter((item) => checkNeedTotalOrEvg(data, item, 'total')).length > 0
  const sumRowData = { key: 'sum' }
  _columns.forEach((c, index) => {
    if (index === 0) {
      sumRowData[c.dataKey] = localeDatas.table.total
    }
    if (checkNeedTotalOrEvg(data, c, 'total')) {
      // 获取当前数据最大小数点个数，并设置最后总和值小数点
      sumRowData[c.dataKey] = getTotalOrEvgRowData(data, c, false)
    }
  })

  const hasAvgColumn = _columns.filter((item) => checkNeedTotalOrEvg(data, item, 'avg')).length > 0
  const avgRowData = { key: 'avg' }
  _columns.forEach((c, index) => {
    if (index === 0) {
      avgRowData[c.dataKey] = localeDatas.table.average
    }
    if (checkNeedTotalOrEvg(data, c, 'avg')) {
      avgRowData[c.dataKey] = getTotalOrEvgRowData(data, c, true)
    }
  })

  const renderRow = (row, level, index, allRowData, isTree, rowConfig = {}) => {
    let childrenHasTree = false
    const { key } = allRowData
    if (loadChildren.current) {
      const { parentKey, data: children } = loadChildren.current
      if (parentKey === key) {
        Object.assign(allRowData, { children })
        loadChildren.current = null
      }
    }
    const { children = [] } = allRowData
    if (children.length) {
      childrenHasTree = children.some(
        (child) => (child.children && child.children.length) || (onLoadChildren && child.isLeaf)
      )
    }

    return (
      <React.Fragment key={row.key}>
        <Row
          rowData={row}
          allRowData={allRowData}
          isFixed={isFixed}
          level={level}
          index={index}
          hoverColIndex={hoverColIndex}
          setHoverColIndex={setHoverColIndex}
          rowHeight={eachRowHeight[row.key]}
          expandedTree={expandedTreeRows.includes(row.key)}
          expandedTreeRows={expandedTreeRows}
          flatLeftFixedColumns={flatLeftFixedColumns}
          setExpandedTreeRows={setExpandedTreeRows}
          isTree={isTree}
          isAvgRow={rowConfig.isAvgRow}
          isSumRow={rowConfig.isSumRow}
          rowExpandable={rowExpandable}
        />
        {expandedTreeRows.includes(allRowData.key) &&
          children.map((child, idx) => {
            return renderRow(child, level + 1, index, children[idx], childrenHasTree || isTree)
          })}
      </React.Fragment>
    )
  }
  let fixedColumnsWidth
  if (isFixed === 'left') {
    fixedColumnsWidth = [rowSelection && 'checkbox']
      .concat(_columns)
      .filter((column) => !!column)
      .map((c, idx) => realColumnsWidth[idx])
      .reduce((total, cur) => {
        return total + cur + 1
      }, 0)
  }
  if (isFixed === 'right') {
    fixedColumnsWidth = flatRightFixedColumns
      .filter((column) => !!column.dataKey)
      .map((c, idx) => realColumnsWidth[rowSelection ? idx + 1 + rightFixedIndex : idx + rightFixedIndex])
      .reduce((total, cur) => {
        return total + cur + 1
      }, 0)
  }
  const fixedBodyTableRef = isFixed === 'left' ? leftFixedBodyTableRef : rightFixedBodyTableRef
  // **************** 根据排序列处理数据
  let _fixedData = isFixed === 'left' ? leftFixedData : rightFixedData
  const fixedColumns = isFixed === 'left' ? flatLeftFixedColumns : flatRightFixedColumns

  if (activeSorterColumn) {
    const sorter =
      fixedColumns.filter((d) => d.dataKey === activeSorterColumn)[0] &&
      fixedColumns.filter((d) => d.dataKey === activeSorterColumn)[0].sorter

    if (sorter) {
      _fixedData = activeSorterType === 'ascend' ? [..._fixedData].sort(sorter) : [..._fixedData].sort(sorter).reverse()
    }
  }
  return (
    _fixedData &&
    _fixedData.length > 0 && (
      <div
        style={{
          marginBottom: -scrollBarSize,
          overflow: 'hidden',
          width: Number.isNaN(fixedColumnsWidth)
            ? 'auto'
            : bodyTableRef.current && fixedColumnsWidth > bodyTableRef.current.clientWidth
            ? bodyTableRef.current.clientWidth
            : fixedColumnsWidth + 1
        }}
      >
        <div
          style={{
            maxHeight: maxHeight || 'auto',
            width: Number.isNaN(fixedColumnsWidth)
              ? 'auto'
              : bodyTableRef.current && fixedColumnsWidth > bodyTableRef.current.clientWidth
              ? bodyTableRef.current.clientWidth
              : fixedColumnsWidth + 20,

            overflow: 'scroll',
            paddingRight: 0,
            marginRight: -scrollBarSize // 利用负 margin 隐藏滚动条
          }}
          ref={fixedBodyTableRef}
          onScroll={(e) => {
            syncScrollTop(fixedBodyTableRef.current.scrollTop, bodyTableRef.current)
            if (isFixed === 'left') {
              syncScrollTop(fixedBodyTableRef.current.scrollTop, rightFixedBodyTableRef.current)
            } else {
              syncScrollTop(fixedBodyTableRef.current.scrollTop, leftFixedBodyTableRef.current)
            }
          }}
        >
          <table
            style={{
              width: 'auto',
              borderLeft: bordered ? '1px solid #e7e7e7' : 'none'
            }}
            ref={bodyInner}
          >
            <colgroup>
              {columnsgroup.map((c, index) => {
                // TODO: 这里是考虑了多级表头的冻结，待优化
                let width
                if (isFixed === 'right') {
                  allColumnsgroup.forEach((col, idx) => {
                    if (col.dataKey === c.dataKey) {
                      // 有 rowSelection 需要往后移动一个
                      width = realColumnsWidth[rowSelection ? idx + 1 : idx]
                    }
                  })
                } else if (isFixed === 'left') {
                  width = realColumnsWidth[index]
                }
                return (
                  <col
                    key={index}
                    className={classNames({
                      [`${prefix}__col__hover--highlight`]: showColHighlight && hoverColIndex === c.dataKey
                    })}
                    style={{
                      width: width,
                      minWidth: width
                    }}
                  />
                )
              })}
            </colgroup>
            <tbody>
              {_fixedData.map((row, index) => {
                return renderRow(row, 1, index, data[index], hasTree)
              })}
              {hasSumColumn && renderRow(sumRowData, 1, data.length, sumRowData, hasTree, { isSumRow: true })}
              {hasAvgColumn && renderRow(avgRowData, 1, data.length + 1, avgRowData, hasTree, { isAvgRow: true })}
            </tbody>
          </table>
        </div>
      </div>
    )
  )
}

export default FixedBodyTable
