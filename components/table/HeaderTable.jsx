import React, { useContext, useRef, useState, useEffect } from 'react'
import TableContext from './context'
import ColumnMenu from './ColumnMenu'
import SettingMenu from './SettingMenu'
import _ from 'lodash'
import classnames from 'classnames'
import Checkbox from '../checkbox'
import { flatTreeData, setDepth, getLeafChildren, groupDataByDepth } from './util'
import { Resizable } from 'react-resizable'

const HeaderTable = ({ isFixed, bodyWidth, rightFixedIndex }) => {
  const {
    rowSelection,
    data,
    columns,
    leftFixedColumns,
    rightFixedColumns,
    expandedRender,
    ceiling,
    stickyTop,
    scrollBarSize,
    highlightedColKeys,
    highlightColumns,
    showColHighlight,
    hoverColIndex,
    showColMenu,
    maxHeight,
    headerTableRef,
    stickyHeaderRef,
    bodyTableRef,
    syncScrollLeft,
    bordered,
    alignRightColumns,
    prefix,
    realColumnsWidth,
    setRealColumnsWidth,
    resizable,
    setting,
    scrollWidth,
    eachHeaderHeight,
    setEachHeaderHeight,
    onHeaderRow
  } = useContext(TableContext)

  // ******************** 隐藏滚动条
  const headerInner = useRef(null)

  // *****控制列最小可调整宽度
  const [minColWidth, setMinColWidth] = useState(Array(columns.length).fill(0))
  // ********************

  // ********************* 判断是否全选
  let isAllChecked
  if (rowSelection) {
    const { selectedRowKeys = [] } = rowSelection
    const flattedData = flatTreeData(data)
    isAllChecked = flattedData.every((d) => selectedRowKeys.includes(d.key)) && flattedData.length !== 0
  }
  // *********************

  // *****************处理分组表头逻辑
  let headerColumns = columns
  if (isFixed === 'left') {
    headerColumns = leftFixedColumns
  }
  if (isFixed === 'right') {
    headerColumns = rightFixedColumns
  }
  const _columns = _.cloneDeep(headerColumns)
  const depthArray = []
  setDepth(_columns, 0, depthArray)

  const maxDepth = depthArray.length > 0 ? Math.max.apply(null, depthArray) : 0
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
  flatTreeData(_columns).forEach((column) => {
    const leafChildren = []
    getLeafChildren(column, leafChildren)
    // 在最后一层，colspan = 1, rowspan = maxDepth - depth + 1
    // 不在最后一层，rowspan = 1, colspan = 叶子节点后代数量
    column.rowSpan = column.isLast ? maxDepth - column.depth + 1 : 1
    column.colSpan = column.isLast ? 1 : leafChildren.length
  })

  const groupedColumns = groupDataByDepth(_columns, maxDepth)
  // ********************

  useEffect(() => {
    if (headerInner.current && headerInner.current.childNodes && headerInner.current.childNodes[1].childNodes[0]) {
      const _minColWidth = Array.from(headerInner.current.childNodes[1].childNodes[0].childNodes).map((th) => {
        return th.childNodes[0].className === 'hi-table__header__title' ? th.childNodes[0].offsetWidth : 0
      })
      setMinColWidth(_minColWidth)
    }
  }, [columns, headerInner])

  // ******************** 同步行高度
  useEffect(() => {
    if (headerInner.current && !isFixed) {
      setEachHeaderHeight(headerInner.current.clientHeight)
      if (!data || data.length === 0) {
        if (headerInner.current.childNodes && headerInner.current.childNodes[1].childNodes[0]) {
          const _realColumnsWidth = Array.from(headerInner.current.childNodes[1].childNodes[0].childNodes).map(
            (node) => {
              return node.clientWidth
            }
          )
          setRealColumnsWidth(_realColumnsWidth)
        }
      }
    }
  }, [headerInner, isFixed, setEachHeaderHeight, columns, data])

  // ********************处理排序逻辑
  // 可以排序的必须的是最后一级列

  const hasSorterColumn = columnsgroup.filter((col) => col.sorter).map((sorterCol) => sorterCol.dataKey)

  // ******************** 行渲染 ***********************
  const renderBaseRow = (cols, index, isSticky) => {
    const _colums = [
      rowSelection && isFixed !== 'right' && index === 0 && 'checkbox',
      expandedRender && index === 0 && 'expandedButton'
    ]
      .concat(cols)
      .filter((column) => !!column)
    return (
      <tr key={index}>
        {_colums.map((c, idx) => {
          let cell
          if (c === 'checkbox') {
            cell = (
              <th
                rowSpan={groupedColumns.length}
                key="checkbox"
                style={{
                  boxSizing: 'border-box',
                  width: 50,
                  height: isFixed ? eachHeaderHeight : 'auto'
                }}
              >
                <Checkbox
                  checked={isAllChecked}
                  indeterminate={!isAllChecked && rowSelection.selectedRowKeys.length > 0}
                  onChange={(e) => {
                    if (rowSelection.onChange) {
                      rowSelection.onChange(isAllChecked ? [] : flatTreeData(data).map((d) => d.key))
                    }
                  }}
                />
              </th>
            )
          } else if (c === 'expandedButton') {
            cell = (
              <th
                key="expandedButton"
                rowSpan={groupedColumns.length}
                style={{
                  boxSizing: 'border-box',
                  width: 50,
                  height: isFixed ? eachHeaderHeight : 'auto'
                }}
              >
                <span />
              </th>
            )
          } else {
            const isRowActive = highlightedColKeys.includes(c.dataKey) || highlightColumns.includes(c.dataKey)
            const isColActive = showColHighlight && hoverColIndex === c.dataKey
            cell = (
              <th
                key={idx}
                colSpan={c.colSpan}
                rowSpan={c.rowSpan}
                // 标题事件处理
                {...onHeaderRow(_colums, index)}
                style={{
                  height: isFixed && cols.length === 1 ? eachHeaderHeight : 'auto',
                  boxSizing: 'border-box',
                  textAlign: alignRightColumns.includes(c.dataKey) ? 'right' : 'left',
                  background: isRowActive || isColActive ? '#F4F4F4' : '#fbfbfb'
                }}
              >
                <span className="hi-table__header__title">
                  {typeof c.title === 'function' ? c.title() : c.title}
                  {showColMenu && c.isLast && (
                    <ColumnMenu
                      columnKey={c.dataKey}
                      canSort={hasSorterColumn.includes(c.dataKey)}
                      isSticky={isSticky}
                    />
                  )}
                </span>
              </th>
            )
          }
          return resizable && idx !== cols.length - 1 ? (
            <Resizable
              key={idx}
              width={realColumnsWidth[idx]}
              height={0}
              onResize={(e, { size }) => {
                const minWidth = minColWidth[idx] + 31
                const anotherMinWidth = minColWidth[idx + 1] + 31
                let nextWidth = size.width > minWidth ? size.width : minWidth
                let anotherWidth = realColumnsWidth[idx + 1] + realColumnsWidth[idx] - nextWidth
                if (anotherWidth <= anotherMinWidth) {
                  anotherWidth = anotherMinWidth
                  nextWidth = realColumnsWidth[idx + 1] - anotherMinWidth + realColumnsWidth[idx]
                }
                const newRealColumnsWidth = [...realColumnsWidth]
                newRealColumnsWidth[idx] = nextWidth
                newRealColumnsWidth[idx + 1] = anotherWidth
                setRealColumnsWidth(newRealColumnsWidth)
              }}
              draggableOpts={{ enableUserSelectHack: false }}
            >
              {cell}
            </Resizable>
          ) : (
            cell
          )
        })}
      </tr>
    )
  }

  return [
    <div
      key="normal"
      style={{
        borderLeft: bordered && '1px solid #e7e7e7',
        borderTop: bordered && '1px solid #e7e7e7',
        overflow: 'hidden',
        boxShadow: maxHeight && '0px 2px 6px 0px rgba(0,0,0,0.12)',
        position: 'relative',
        height: (eachHeaderHeight && (bordered ? eachHeaderHeight + 1 : eachHeaderHeight)) || 'auto'
      }}
    >
      {setting && !isFixed && <SettingMenu />}
      <div
        className={`${prefix}__header`}
        key="normal"
        ref={isFixed ? null : headerTableRef}
        style={{
          overflowY: maxHeight && !isFixed ? 'scroll' : 'hidden',
          overflowX: isFixed ? 'hidden' : 'scroll',
          marginBottom: !isFixed && -scrollBarSize,
          height: (eachHeaderHeight && eachHeaderHeight + 20) || 'auto'
        }}
        onScroll={(e) => {
          syncScrollLeft(headerTableRef.current.scrollLeft, bodyTableRef.current)
          syncScrollLeft(headerTableRef.current.scrollLeft, stickyHeaderRef.current)
        }}
      >
        <table
          style={{
            width: isFixed ? 'auto' : scrollWidth || '100%',
            height: isFixed ? eachHeaderHeight : 'auto'
          }}
          ref={headerInner}
        >
          <colgroup>
            {columnsgroup.map((c, index) => {
              let width
              if (isFixed === 'right') {
                allColumnsgroup.forEach((col, idx) => {
                  if (col.dataKey === c.dataKey) {
                    width = realColumnsWidth[rowSelection ? idx + 1 : idx]
                  }
                })
              } else if (isFixed === 'left' || resizable) {
                width = realColumnsWidth[index]
              } else {
                width = c.width
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
          <thead>{groupedColumns.map((group, index) => renderBaseRow(group, index, false))}</thead>
        </table>
      </div>
    </div>,
    !isFixed && ceiling && (
      <div
        key="ceiling"
        className={classnames(`${prefix}__header`, `${prefix}__header--sticky`)}
        ref={stickyHeaderRef}
        style={{
          top: stickyTop,
          width: bodyWidth,
          borderLeft: bordered && '1px solid #e7e7e7'
        }}
      >
        <table style={{ width: scrollWidth || '100%' }}>
          <colgroup>
            {columnsgroup.map((c, idx) => (
              <col
                key={idx}
                style={{
                  width: resizable ? realColumnsWidth[idx] : c.width,
                  minWidth: resizable ? realColumnsWidth[idx] : c.width
                }}
              />
            ))}
          </colgroup>
          <thead>{groupedColumns.map((group, idx) => renderBaseRow(group, idx, true))}</thead>
        </table>
      </div>
    ),
    isFixed && ceiling && (
      <div
        key="fixed-ceiling"
        className={classnames(`${prefix}__header`, `${prefix}__header--sticky`)}
        style={{
          top: stickyTop,
          display: ceiling ? 'block' : 'none',
          borderLeft: bordered && '1px solid #e7e7e7'
        }}
      >
        <table style={{ width: 'auto' }}>
          <colgroup>
            {columnsgroup.map((c, idx) => {
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
                  }}
                />
              )
            })}
          </colgroup>
          <thead>{groupedColumns.map((group, idx) => renderBaseRow(group, idx, true))}</thead>
        </table>
      </div>
    )
  ]
}

export default HeaderTable
