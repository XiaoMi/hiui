import React, { useContext, useRef } from 'react'
import Row from './Row'
import TableContext from './context'
import _ from 'lodash'
import { flatTreeData, setDepth } from './util'

const FixedBodyTable = ({ isFixed, rightFixedIndex }) => {
  const {
    data,
    leftFixedData,
    rightFixedData,
    leftFixedColumns,
    rightFixedColumns,
    columns,
    maxHeight,
    scrollBarSize,
    syncScrollTop,
    leftFixedBodyTableRef,
    rightFixedBodyTableRef,
    bodyTableRef,
    activeSorterColumn,
    activeSorterType,
    hoverColIndex,
    setHoverColIndex,
    realColumnsWidth,
    bordered,
    eachRowHeight,
    rowSelection,
    expandedRender,
    expandedTreeRows,
    setExpandedTreeRows
  } = useContext(TableContext)
  let _columns
  if (isFixed === 'left') {
    _columns = _.cloneDeep(leftFixedColumns)
  }
  if (isFixed === 'right') {
    _columns = _.cloneDeep(rightFixedColumns)
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
      return row.children && row.children.length
    })
  }

  const renderRow = (row, level, index, allRowData, isTree) => {
    let childrenHasTree = false
    if (allRowData.children && allRowData.children.length) {
      childrenHasTree = allRowData.children.some((child) => child.children && child.children.length)
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
          setExpandedTreeRows={setExpandedTreeRows}
          isTree={isTree}
        />
        {allRowData.children &&
          expandedTreeRows.includes(allRowData.key) &&
          allRowData.children.map((child, idx) => {
            return renderRow(child, level + 1, index, allRowData.children[idx], childrenHasTree || isTree)
          })}
      </React.Fragment>
    )
  }
  let fixedColumnsWidth
  if (isFixed === 'left') {
    fixedColumnsWidth = [rowSelection && 'checkbox']
      .concat(leftFixedColumns)
      .filter((column) => !!column)
      .map((c, idx) => realColumnsWidth[idx])
      .reduce((total, cur) => {
        return total + cur
      }, 0)
  }
  if (isFixed === 'right') {
    fixedColumnsWidth = rightFixedColumns
      .map((c, idx) => realColumnsWidth[rowSelection ? idx + 1 + rightFixedIndex : idx + rightFixedIndex])
      .reduce((total, cur) => {
        return total + cur
      }, 0)
  }
  const fixedBodyTableRef = isFixed === 'left' ? leftFixedBodyTableRef : rightFixedBodyTableRef
  // **************** 根据排序列处理数据
  let _fixedData = isFixed === 'left' ? leftFixedData : rightFixedData
  const fixedColumns = isFixed === 'left' ? leftFixedColumns : rightFixedColumns

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
            </tbody>
          </table>
        </div>
      </div>
    )
  )
}

export default FixedBodyTable
