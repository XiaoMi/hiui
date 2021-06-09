import React, { useContext, useRef, useState, useEffect } from 'react'
import TableContext from './context'
import ColumnMenu from './ColumnMenu'
import SettingMenu from './SettingMenu'
import _ from 'lodash'
import classnames from 'classnames'
import Checkbox from '../checkbox'
import { flatTreeData, setDepth, getLeafChildren, groupDataByDepth } from './util'
import { Resizable } from 'react-resizable'

const HeaderTable = ({ bodyWidth, rightFixedIndex }) => {
  const {
    rowSelection,
    data,
    columns,
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
    onHeaderRow,
    disabledData
  } = useContext(TableContext)
  const [isAllChecked, setIsAllChecked] = useState(false)
  const [groupedColumns, setGroupedColumns] = useState([])
  const [columnsgroup, setColumnsGroup] = useState([])
  // 隐藏滚动条
  const headerInner = useRef(null)
  // 控制列最小可调整宽度
  const [minColWidth, setMinColWidth] = useState(Array(columns.length).fill(0))
  useEffect(() => {
    // 判断是否全选
    if (rowSelection) {
      const { selectedRowKeys = [] } = rowSelection
      const flattedData = flatTreeData(data)
      const _isAllChecked =
        flattedData
          .filter((data) => !disabledData.current.includes(data.key))
          .every((d) => selectedRowKeys.includes(d.key)) && flattedData.length !== 0
      setIsAllChecked(_isAllChecked)
    }
  }, [data, rowSelection])

  // 处理列的深度
  useEffect(() => {
    const _columns = _.cloneDeep(columns)
    const depthArray = []
    setDepth(_columns, 0, depthArray)
    const maxDepth = depthArray.length > 0 ? Math.max.apply(null, depthArray) : 0
    const flatTreeDateColumns = flatTreeData(_columns)
    const _columnsgroup = [rowSelection && 'checkbox', expandedRender && 'expandedButton']
      .concat(flatTreeDateColumns.filter((col) => col.isLast))
      .filter((column) => !!column)

    flatTreeDateColumns.forEach((column) => {
      const leafChildren = []
      getLeafChildren(column, leafChildren)
      // 在最后一层，colspan = 1, rowspan = maxDepth - depth + 1
      // 不在最后一层，rowspan = 1, colspan = 叶子节点后代数量
      column.rowSpan = column.isLast ? maxDepth - column.depth + 1 : 1
      column.colSpan = column.isLast ? 1 : leafChildren.length
    })
    console.log('flatTreeDateColumns', flatTreeDateColumns)
    const _groupedColumns = groupDataByDepth(_columns, maxDepth)
    console.log('_groupedColumns', _groupedColumns)
    setColumnsGroup(_columnsgroup)
    setGroupedColumns(_groupedColumns)
  }, [columns])

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
    if (headerInner.current) {
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
  }, [headerInner, setEachHeaderHeight, columns, data])

  // ********************处理排序逻辑
  // 可以排序的必须的是最后一级列

  const hasSorterColumn = columnsgroup.filter((col) => col.sorter).map((sorterCol) => sorterCol.dataKey)

  // ******************** 行渲染 ***********************
  const renderBaseRow = (cols, index, isSticky) => {
    const _colums = [rowSelection && index === 0 && 'checkbox', expandedRender && index === 0 && 'expandedButton']
      .concat(cols)
      .filter((column) => !!column)
    const isStickyCol = _colums.some((item) => {
      return typeof item.leftStickyWidth !== 'undefined'
    })
    return (
      <tr key={index}>
        {_colums.map((c, idx) => {
          let cell
          if (c === 'checkbox') {
            cell = (
              <th
                rowSpan={groupedColumns.length}
                key="checkbox"
                className={classnames({ 'hi-table__col__sticky': isStickyCol })}
                style={{
                  boxSizing: 'border-box',
                  width: 50,
                  height: 'auto',
                  backgroundColor: '#fbfbfb'
                }}
              >
                <Checkbox
                  checked={isAllChecked}
                  indeterminate={!isAllChecked && rowSelection.selectedRowKeys.length > 0}
                  onChange={(e) => {
                    if (rowSelection.onChange) {
                      rowSelection.onChange(
                        isAllChecked
                          ? []
                          : flatTreeData(data)
                              .filter((data) => !disabledData.current.includes(data.key))
                              .map((d) => d.key)
                      )
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
                  height: 'auto'
                }}
              >
                <span />
              </th>
            )
          } else {
            const { rightStickyWidth, leftStickyWidth, dataKey } = c
            const isSticky = typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined'

            const isRowActive = highlightedColKeys.includes(dataKey) || highlightColumns.includes(dataKey)
            const isColActive = showColHighlight && hoverColIndex === dataKey
            cell = (
              <th
                key={idx}
                colSpan={c.colSpan}
                rowSpan={c.rowSpan}
                // 标题事件处理
                {...onHeaderRow(_colums, index)}
                className={classnames({ 'hi-table__col__sticky': isSticky })}
                style={{
                  height: 'auto',
                  boxSizing: 'border-box',
                  textAlign: alignRightColumns.includes(dataKey) ? 'right' : 'left',
                  background: isRowActive || isColActive ? '#F4F4F4' : '#fbfbfb',
                  right: rightStickyWidth + 'px',
                  left: leftStickyWidth + 'px'
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
        height: eachHeaderHeight || 'auto'
      }}
    >
      {setting && <SettingMenu />}
      <div
        className={`${prefix}__header`}
        key="normal"
        ref={headerTableRef}
        style={{
          overflowY: maxHeight ? 'scroll' : 'hidden',
          overflowX: 'scroll',
          marginBottom: -scrollBarSize,
          height: (eachHeaderHeight && eachHeaderHeight + 20) || 'auto'
        }}
        onScroll={(e) => {
          syncScrollLeft(headerTableRef.current.scrollLeft, bodyTableRef.current)
          syncScrollLeft(headerTableRef.current.scrollLeft, stickyHeaderRef.current)
        }}
      >
        <table style={{ width: '100%' }} ref={headerInner}>
          <colgroup>
            {columnsgroup.map((c, index) => {
              return (
                <col
                  key={index}
                  style={{
                    width: c.width,
                    minWidth: c.width
                  }}
                />
              )
            })}
          </colgroup>
          <thead>{groupedColumns.map((group, index) => renderBaseRow(group, index, false))}</thead>
        </table>
      </div>
    </div>,
    ceiling && (
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
    )
  ]
}

export default HeaderTable
