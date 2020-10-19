import React, { useState, useContext, useRef } from 'react'
import Row from './Row'
import TableContext from './context'
import _ from 'lodash'
import { flatTreeData, setDepth } from './util'

const FixedBodyTable = ({ isFixed, rightFixedIndex }) => {
  const [expandedTreeRows, setExpandedTreeRows] = useState([])
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
    realColumnsWidth,
    bordered,
    eachRowHeight
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
  const columnsgroup = flatTreeData(_columns).filter((col) => col.isLast)
  // TODO: 这里是考虑了多级表头的冻结，待优化
  // *********全量 col group
  const allColumns = _.cloneDeep(columns)
  const _depthArray = []
  setDepth(allColumns, 0, _depthArray)
  const allColumnsgroup = flatTreeData(allColumns).filter((col) => col.isLast)
  // ***********
  const bodyInner = useRef(null)
  const renderRow = (row, level, index, allRowData) => {
    return (
      <React.Fragment key={row.key}>
        <Row
          rowData={row}
          allRowData={allRowData}
          isFixed={isFixed}
          level={level}
          index={index}
          rowHeight={eachRowHeight[index]}
          expandedTree={expandedTreeRows.includes(row.key)}
          expandedTreeRows={expandedTreeRows}
          setExpandedTreeRows={setExpandedTreeRows}
        />
        {row.children &&
          expandedTreeRows.includes(row.key) &&
          row.children.map((child) => {
            return renderRow(child, level + 1)
          })}
      </React.Fragment>
    )
  }
  let fixedColumnsWidth
  if (isFixed === 'left') {
    fixedColumnsWidth = leftFixedColumns
      .map((c, idx) => realColumnsWidth[idx])
      .reduce((total, cur) => {
        return total + cur
      }, 0)
  }
  if (isFixed === 'right') {
    fixedColumnsWidth = rightFixedColumns
      .map((c, idx) => realColumnsWidth[idx + rightFixedIndex])
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
    <div
      style={{
        marginBottom: -scrollBarSize,
        overflow: 'hidden',
        width:
          bodyTableRef.current && fixedColumnsWidth > bodyTableRef.current.clientWidth
            ? bodyTableRef.current.clientWidth
            : fixedColumnsWidth + 1
      }}
    >
      <div
        style={{
          maxHeight: maxHeight || 'auto',
          width:
            bodyTableRef.current && fixedColumnsWidth > bodyTableRef.current.clientWidth
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
            {columnsgroup.map((c, idx) => {
              // TODO: 这里是考虑了多级表头的冻结，待优化
              let width
              allColumnsgroup.forEach((col, index) => {
                if (col.dataKey === c.dataKey) {
                  width = realColumnsWidth[index]
                }
              })
              return (
                <col
                  key={idx}
                  style={{
                    width: width,
                    minWidth: width
                    // width:
                    //   isFixed === 'left'
                    //     ? realColumnsWidth[idx]
                    //     : realColumnsWidth[idx + rightFixedIndex],
                    // minWidth:
                    //   isFixed === 'left'
                    //     ? realColumnsWidth[idx]
                    //     : realColumnsWidth[idx + rightFixedIndex]
                  }}
                />
              )
            })}
          </colgroup>
          <tbody>{_fixedData.map((row, index) => renderRow(row, 1, index, data[index]))}</tbody>
        </table>
      </div>
    </div>
  )
}

export default FixedBodyTable
