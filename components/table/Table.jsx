import React, { useState, useRef, useEffect } from 'react'
import HeaderTable from './HeaderTable'
import BodyTable from './BodyTable'
import TableContext from './context'
import classnames from 'classnames'
import { getFixedDataByFixedColumn, getScrollBarSize, flatTreeData } from './util'
import Pagination from '../pagination'
import axios from 'axios'
import FixedBodyTable from './FixedBodyTable'
import './style'

const Table = (props) => {
  const hiTable = useRef(null)
  const [ceiling, setCeiling] = useState(false)
  const [activeSorterColumn, setActiveSorterColumn] = useState(null)
  const [activeSorterType, setActiveSorterType] = useState(null)
  const [highlightColumns, setHighlightColumns] = useState([])
  const [highlightRows, setHighlightRows] = useState([])
  const [freezeColumn, setFreezeColumn] = useState(null)
  const [hoverRow, setHoverRow] = useState(null)
  const [serverTableConfig, setServerTableConfig] = useState({})
  const [eachRowHeight, setEachRowHeight] = useState([])
  const [eachHeaderHeight, setEachHeaderHeight] = useState(null)

  const {
    striped,
    bordered,
    resizable,
    size,
    errorRowKeys = [],
    rowSelection,
    data = [],
    highlightedRowKeys = [],
    highlightedColKeys = [],
    columns = [],
    expandedRender,
    maxHeight,
    pagination,
    dataSource,
    showColMenu,
    prefix = 'power-table',
    fixedToColumn,
    sticky: _ceiling,
    stickyTop = 0,
    setting,
    // *********
    sortCol,
    setSortCol,
    visibleCols,
    setVisibleCols,
    setCacheVisibleCols,
    scrollWidth,
    emptyContent = '暂无数据'
  } = props

  const [realColumnsWidth, setRealColumnsWidth] = useState(columns.map((c) => c.width || 'auto'))

  const firstRowRef = useRef(null)

  useEffect(() => {
    setRealColumnsWidth(columns.map((c) => c.width || 'auto'))
    setTimeout(() => {
      if (firstRowRef.current) {
        const _realColumnsWidth = Array.from(firstRowRef.current.childNodes).map((node) => node.clientWidth)
        setRealColumnsWidth(_realColumnsWidth)
      }
    })
  }, [columns])

  const flattedColumns = flatTreeData(columns)
  // 有表头分组那么也要 bordered
  const _bordered = flattedColumns.length > columns.length || bordered
  // ******************* 列冻结 ********************
  // 左侧冻结
  const leftFixedColumn =
    freezeColumn || (typeof fixedToColumn === 'string' ? fixedToColumn : fixedToColumn && fixedToColumn.left)
  // 右侧冻结
  const rightFixedColumn = fixedToColumn && fixedToColumn.right

  let leftFixedIndex, rightFixedIndex
  columns.forEach((c, index) => {
    if (leftFixedColumn === c.dataKey) {
      leftFixedIndex = index
    }
    if (rightFixedColumn === c.dataKey) {
      rightFixedIndex = index
    }
  })
  const realLeftFixedColumns = [...columns].splice(0, leftFixedIndex + 1)
  const leftFixedData = getFixedDataByFixedColumn(realLeftFixedColumns, data)
  const realRightFixedColumns = [...columns].splice(rightFixedIndex)

  const rightFixedData = getFixedDataByFixedColumn(realRightFixedColumns, data)
  // 同步滚动条
  const headerTableRef = useRef(null)
  const stickyHeaderRef = useRef(null)
  const bodyTableRef = useRef(null)
  const leftFixedBodyTableRef = useRef(null)
  const rightFixedBodyTableRef = useRef(null)
  const syncScrollLeft = (scrollLeft, syncTarget) => {
    if (syncTarget && syncTarget.scrollLeft !== scrollLeft) {
      syncTarget.scrollLeft = scrollLeft
    }
  }
  const syncScrollTop = (scrollTop, syncTarget) => {
    if (syncTarget && syncTarget.scrollTop !== scrollTop) {
      syncTarget.scrollTop = scrollTop
    }
  }

  const _pagination = (dataSource && serverTableConfig.pagination) || pagination
  // 高亮行
  const _highlightRows = highlightedRowKeys.concat(highlightRows.filter((row) => !highlightedRowKeys.includes(row.key)))
  // 需要右对齐的列
  const alignRightColumns = columns.filter((c) => c.align === 'right').map((col) => col.dataKey)
  // baseTable
  const baseTable = useRef(null)
  const [baseTableWidth, setBaseTableWidth] = useState('100%')
  const clientWidth = baseTable.current && baseTable.current.clientWidth
  useEffect(() => {
    setBaseTableWidth(clientWidth)
  }, [clientWidth])

  useEffect(() => {
    if (_ceiling) {
      window.addEventListener(
        'scroll',
        () => {
          if (
            hiTable &&
            hiTable.current &&
            hiTable.current.getBoundingClientRect().top <= stickyTop &&
            hiTable.current.getBoundingClientRect().bottom >= stickyTop + 35
          ) {
            setCeiling(true)
            syncScrollLeft(bodyTableRef.current.scrollLeft, stickyHeaderRef.current)
          } else {
            setCeiling(false)
          }
        },
        true
      )
    }
  }, [_ceiling, stickyTop])

  useEffect(() => {
    if (dataSource) {
      const fetchConfig = dataSource()
      axios(fetchConfig).then((res) => {
        setServerTableConfig(res.data)
      })
    }
  }, [dataSource])
  return (
    <TableContext.Provider
      value={{
        setting,
        firstRowRef,
        prefix,
        errorRowKeys,
        bordered: _bordered,
        resizable,
        rowSelection,
        highlightedRowKeys: _highlightRows,
        setHighlightRows,
        highlightedColKeys,
        data: (dataSource && (serverTableConfig.data || [])) || data,
        columns: (dataSource && (serverTableConfig.columns || [])) || columns,
        expandedRender,
        leftFixedColumns: realLeftFixedColumns,
        rightFixedColumns: realRightFixedColumns,
        realColumnsWidth,
        setRealColumnsWidth,
        leftFixedData,
        rightFixedData,
        ceiling,
        stickyTop,
        scrollBarSize: getScrollBarSize(), // 滚动条宽度
        // 排序逻辑
        activeSorterColumn,
        activeSorterType,
        setActiveSorterColumn: setActiveSorterColumn,
        setActiveSorterType: setActiveSorterType,
        // 高亮列
        highlightColumns,
        setHighlightColumns,
        // 冻结列
        freezeColumn,
        setFreezeColumn,
        // hover 高亮行
        hoverRow,
        setHoverRow,
        showColMenu,
        maxHeight,
        // 同步滚动条
        headerTableRef,
        stickyHeaderRef,
        bodyTableRef,
        syncScrollLeft,
        leftFixedBodyTableRef,
        rightFixedBodyTableRef,
        syncScrollTop,
        alignRightColumns,
        // setting 列操作相关
        sortCol,
        setSortCol,
        visibleCols,
        setVisibleCols,
        setCacheVisibleCols,
        // 出现横向滚动条时的宽度
        scrollWidth,
        // 同步行高度
        eachRowHeight,
        setEachRowHeight,
        // 同步表头高度
        eachHeaderHeight,
        setEachHeaderHeight
      }}
    >
      <div
        className={classnames(prefix, {
          [`${prefix}--striped`]: striped,
          [`${prefix}--bordered`]: _bordered,
          [`${prefix}--${size}`]: size
        })}
        ref={hiTable}
      >
        {/* Normal table 普通表格 */}
        <div className={`${prefix}__container`} ref={baseTable}>
          <HeaderTable bodyWidth={baseTableWidth} />
          <BodyTable fatherRef={hiTable} emptyContent={emptyContent} />
        </div>
        {/* Left fixed table 左侧固定列表格 */}
        {leftFixedColumn && realLeftFixedColumns.length > 0 && (
          <div className={classnames(`${prefix}__container`, `${prefix}__container--fixed-left`)}>
            <HeaderTable isFixed='left' />
            <FixedBodyTable isFixed='left' />
          </div>
        )}
        {/* Right fixed table 右侧固定列表格 */}
        {rightFixedColumn && realRightFixedColumns.length > 0 && (
          <div className={classnames(`${prefix}__container`, `${prefix}__container--fixed-right`)} style={{ right: 0 }}>
            <HeaderTable isFixed='right' rightFixedIndex={rightFixedIndex} />
            <FixedBodyTable isFixed='right' rightFixedIndex={rightFixedIndex} />
          </div>
        )}
        {/* Pagination 分页组件 */}
        {_pagination && (
          <div
            className={classnames(`${prefix}__pagination`, {
              [`${prefix}__pagination--${_pagination.placement}`]: _pagination.placement
            })}
          >
            <Pagination {..._pagination} />
          </div>
        )}
      </div>
    </TableContext.Provider>
  )
}

const TableWrapper = ({ columns, uniqueId, standard, ...settingProps }) => {
  const _sortCol =
    uniqueId && window.localStorage.getItem(`${uniqueId}_sortCol`)
      ? JSON.parse(window.localStorage.getItem(`${uniqueId}_sortCol`))
      : columns

  const _visibleCols =
    uniqueId && window.localStorage.getItem(`${uniqueId}_visibleCols`)
      ? JSON.parse(window.localStorage.getItem(`${uniqueId}_visibleCols`))
      : columns

  const _cacheVisibleCols =
    uniqueId && window.localStorage.getItem(`${uniqueId}_cacheVisibleCols`)
      ? JSON.parse(window.localStorage.getItem(`${uniqueId}_cacheVisibleCols`))
      : columns
  // 列操作逻辑
  const [sortCol, setSortCol] = useState(_sortCol)
  const [visibleCols, setVisibleCols] = useState(_visibleCols)
  const [cacheVisibleCols, setCacheVisibleCols] = useState(_cacheVisibleCols)
  useEffect(() => {
    if (uniqueId) {
      window.localStorage.setItem(`${uniqueId}_sortCol`, JSON.stringify(sortCol))
      window.localStorage.setItem(`${uniqueId}_visibleCols`, JSON.stringify(visibleCols))
      window.localStorage.setItem(`${uniqueId}_cacheVisibleCols`, JSON.stringify(cacheVisibleCols))
    }
  }, [sortCol, visibleCols, cacheVisibleCols, uniqueId])

  useEffect(() => {
    setCacheVisibleCols(_cacheVisibleCols)
  }, [_cacheVisibleCols])

  const standardPreset = standard
    ? {
      showColMenu: true,
      sticky: true,
      bordered: true,
      setting: true,
      striped: true
    }
    : {}

  // ***************
  return (
    <Table
      columns={cacheVisibleCols}
      {...settingProps}
      {...standardPreset}
      sortCol={sortCol}
      setSortCol={setSortCol}
      visibleCols={visibleCols}
      setVisibleCols={setVisibleCols}
      setCacheVisibleCols={setCacheVisibleCols}
    />
  )
}

export default TableWrapper
