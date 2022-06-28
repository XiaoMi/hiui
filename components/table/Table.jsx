import React, { useState, useRef, useEffect, useCallback } from 'react'
import HeaderTable from './HeaderTable'
import BodyTable from './BodyTable'
import TableContext from './context'
import classnames from 'classnames'
import {
  flatTreeData,
  parseFixedcolumns,
  setColumnsDefaultWidth,
  getMaskNums,
  setRowByKey,
  deleteRowByKey,
  cloneArray
} from './util'
import Pagination from '../pagination'
import axios from 'axios'
import Provider from '../context'
import Loading from '../loading'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import './style'
const defaultHeaderRow = () => {
  return {
    onClick: () => {},
    onDoubleClick: () => {},
    onContextMenu: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  }
}

const Table = ({
  striped,
  bordered,
  resizable,
  size,
  errorRowKeys = [],
  rowSelection,
  data: propsData,
  highlightedRowKeys = [],
  highlightedColKeys = [],
  expandedRowKeys: propsExpandRowKeys,
  expandRowKeys,
  onExpand,
  fixedColumnTrigger = 'auto',
  onHeaderRow = defaultHeaderRow,
  onRow = defaultHeaderRow,
  columns: propsColumns = [],
  expandedRender,
  maxHeight,
  pagination,
  dataSource,
  showColMenu,
  showColHighlight,
  prefix = 'hi-table',
  fixedToColumn,
  sticky,
  stickyTop = 0,
  setting,
  onLoadChildren,
  rowExpandable = () => true,
  // *********
  getColKeyValue,
  sortCols,
  setSortCols,
  cacheSortCols,
  setCacheSortCols,
  cacheHiddenColKeys,
  setCacheHiddenColKeys,
  hiddenColKeys,
  setHiddenColKeys,
  disabledResizableColKeys,
  scrollWidth,
  theme,
  draggable,
  localeDatas,
  fieldKey,
  onDragStart,
  onDrop,
  onDropEnd,
  cellRender,
  emptyContent = localeDatas.table.emptyContent,
  highlightRowOnDoubleClick = true
}) => {
  const isResizableColKey = useCallback(
    (colKey) => {
      return (
        resizable &&
        colKey &&
        (!Array.isArray(disabledResizableColKeys) || disabledResizableColKeys.indexOf(colKey) === -1)
      )
    },
    [resizable, disabledResizableColKeys]
  )

  const dargInfo = useRef({ dragKey: null })
  const [data, setData] = useState(propsData)

  useEffect(() => {
    const _data = () => {
      if (fieldKey) {
        return propsData.map((item) => {
          item.key = item[fieldKey]
          return item
        })
      }
      return propsData
    }
    setData(_data)
  }, [propsData, fieldKey])

  const updateData = useCallback(() => {
    if (typeof dargInfo.current.dropKey !== 'undefined') {
      const { rowData, dropRowData } = dargInfo.current
      if (dropRowData.key === rowData.key) return

      const restData = deleteRowByKey(cloneArray(data), dargInfo.current)
      const _data = setRowByKey(cloneArray(restData), dargInfo.current)
      dargInfo.current = {}
      onDropEnd && onDropEnd(rowData, dropRowData, _data)
      setData(_data)
    }
  }, [data])

  const expandedRowKeys = propsExpandRowKeys || expandRowKeys
  const [columns, setColumns] = useState(propsColumns)
  const hiTable = useRef(null)
  const disabledData = useRef([])
  const [activeSorterColumn, setActiveSorterColumn] = useState(null)
  const [activeSorterType, setActiveSorterType] = useState(null)
  const [highlightColumns, setHighlightColumns] = useState([])
  const [highlightRows, setHighlightRows] = useState([])
  const [freezeColumn, setFreezeColumn] = useState(null)
  const [hoverRow, setHoverRow] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [serverTableConfig, setServerTableConfig] = useState({ data: [], columns: [...propsColumns] })
  const [eachRowHeight, setEachRowHeight] = useState({})
  const [hoverColIndex, setHoverColIndex] = useState(null)
  const loadChildren = useRef(null)
  const [realColumnsWidth, setRealColumnsWidth] = useState(columns.map((c) => c.width || 'auto'))

  const [expandedTreeRows, _setExpandedTreeRows] = useState([])

  const setExpandedTreeRows = useCallback(
    (expandKeys, expanded, rowItem) => {
      _setExpandedTreeRows(expandKeys)
      // 仅支持树形 table onExpand 回调，由于之前设计局限，无法完成对 `expandedRowKeys` 的受控支持
      onExpand?.(expanded, rowItem)
    },
    [onExpand]
  )

  // 固定列的宽度
  const [fixedColumnsWidth, setFixedColumnsWidth] = useState({ left: 0, right: 0 })
  // 获取左右侧固定列的信息
  const [realLeftFixedColumns, setRealLeftFixedColumns] = useState([])
  const [realRightFixedColumns, setRealRightFixedColumns] = useState([])
  // 拉平后的数据
  const [flattedColumns, setFlattedColumns] = useState([])
  // scrollLeft
  const [scrollSize, setScrollSize] = useState({ scrollLeft: 0, scrollRight: 1 })
  const firstRowRef = useRef(null)
  // 处理拉平数据
  useEffect(() => {
    let _columns = cloneArray(dataSource ? serverTableConfig.columns || [] : propsColumns)
    const _flattedColumns = flatTreeData(_columns)
    const leftFixedColumn =
      freezeColumn || (typeof fixedToColumn === 'string' ? fixedToColumn : fixedToColumn && fixedToColumn.left)
    const rightFixedColumn = fixedToColumn && fixedToColumn.right
    // 获取冻结类列的下标
    let leftFixedIndex, rightFixedIndex
    _flattedColumns.forEach((c, index) => {
      if (leftFixedColumn === c.dataKey && typeof leftFixedColumn === 'string') leftFixedIndex = c._rootIndex
      if (rightFixedColumn === c.dataKey && typeof rightFixedColumn === 'string') rightFixedIndex = c._rootIndex
    })
    if (typeof leftFixedIndex === 'number' || rightFixedIndex === 'number' || scrollWidth) {
      const lastColumns = _flattedColumns.filter((item) => {
        return typeof item.isLast !== 'undefined' ? item.isLast : true
      })
      _columns = setColumnsDefaultWidth(_columns, scrollWidth ? scrollWidth / lastColumns.length : 100)
    }
    // 左侧
    const leftCloumns = _columns.slice(0, leftFixedIndex + 1)
    leftCloumns.forEach((currentItem, index) => {
      parseFixedcolumns(currentItem, index, leftCloumns, 'leftStickyWidth', expandedRender || rowSelection)
      _columns[index] = currentItem
    })
    // 右侧
    const rightCloumns = cloneArray(_columns.slice(rightFixedIndex || _flattedColumns.length).reverse())
    if (rightFixedIndex) {
      rightCloumns.forEach((currentItem, index) => {
        const _item = parseFixedcolumns(
          currentItem,
          index,
          rightCloumns,
          'rightStickyWidth',
          expandedRender || rowSelection
        )
        _columns[_columns.length - 1 - index] = _item
      })
    }
    setRealLeftFixedColumns(leftCloumns)
    setRealRightFixedColumns(rightCloumns)
    setColumns(_columns)
    setFlattedColumns(_flattedColumns)
  }, [propsColumns, freezeColumn, data, serverTableConfig])

  // 获取列宽的处理
  useEffect(() => {
    disabledData.current = []
    if (!dataSource) {
      if (firstRowRef.current) {
        const _realColumnsWidth = Array.from(firstRowRef.current.childNodes).map((node) => node.clientWidth)
        setRealColumnsWidth(_realColumnsWidth)
      }
    }
  }, [columns, dataSource, data])

  useEffect(() => {
    _setExpandedTreeRows(expandedRowKeys || [])
  }, [expandedRowKeys, data])

  // 有表头分组那么也要 bordered
  const _bordered = flattedColumns.length > columns.length || bordered

  // 计算固定列的宽度

  useEffect(() => {
    let left = 0
    let right = 0
    left = getMaskNums(realLeftFixedColumns)
    right = getMaskNums(realRightFixedColumns)
    if (left > 0 && (rowSelection || expandedRender)) {
      left += 50
    }
    setFixedColumnsWidth({ left, right })
    const { width: tableWidth } = tableRef.current.getBoundingClientRect()
    const { width: bodyWidth } = bodyTableRef.current.getBoundingClientRect()
    setScrollSize({ scrollRight: tableWidth - bodyWidth, scrollLeft: 0 })
  }, [realLeftFixedColumns, realRightFixedColumns])

  // 同步滚动条
  const headerTableRef = useRef(null)
  const stickyHeaderRef = useRef(null)
  const bodyTableRef = useRef(null)
  const leftFixedBodyTableRef = useRef(null)
  const rightFixedBodyTableRef = useRef(null)
  const tableRef = useRef(null)

  // 新增滚动优化
  const syncScrollLeft = (scrollLeft, syncTarget) => {
    let scrollRight = scrollSize.scrollRight
    if (syncTarget && syncTarget.scrollLeft !== scrollLeft) {
      syncTarget.scrollLeft = scrollLeft
    }
    if (tableRef && tableRef.current && bodyTableRef && bodyTableRef.current && realRightFixedColumns) {
      const { right: tableTefRight } = tableRef.current.getBoundingClientRect()
      const { right } = bodyTableRef.current.getBoundingClientRect()
      scrollRight = tableTefRight - right
    }
    setScrollSize({ scrollLeft, scrollRight })
  }
  const syncScrollTop = (scrollTop, syncTarget) => {
    if (syncTarget && syncTarget.scrollTop !== scrollTop) {
      syncTarget.scrollTop = scrollTop
    }
  }
  const paginationOnChange = useCallback(
    (current) => {
      setCurrentPage(current)
    },
    [currentPage]
  )
  const _pagination = (dataSource && serverTableConfig.pagination) || pagination
  // 高亮行
  const _highlightRows = highlightedRowKeys.concat(highlightRows.filter((row) => !highlightedRowKeys.includes(row.key)))
  // 需要右对齐的列
  const alignRightColumns = columns.filter((c) => c.align === 'right').map((col) => col.dataKey)
  // baseTable
  const baseTable = useRef(null)

  useEffect(() => {
    if (dataSource) {
      const fetchConfig = dataSource(currentPage)
      axios(fetchConfig).then((res) => {
        setServerTableConfig(Object.assign({}, serverTableConfig, { data: res.data }))
      })
    }
  }, [dataSource, currentPage])

  const onDropCallback = useCallback(() => {
    if (!draggable) return
    const { rowData, dropRowData, level } = dargInfo.current
    const onDropCallback = onDrop ? onDrop(rowData, dropRowData, data, level) : true
    if (onDropCallback.toString() === '[object Promise]') {
      onDropCallback.then((res) => {
        res && updateData()
      })
    } else {
      onDropCallback && updateData()
    }
  }, [data, draggable])

  // 自定义设置 checkbox 列宽度
  const checkboxColWidth =
    rowSelection && typeof rowSelection.checkboxColWidth === 'number' ? rowSelection.checkboxColWidth : 50

  const alwaysFixedColumn = fixedColumnTrigger === 'always'

  return (
    <TableContext.Provider
      value={{
        cellRender,
        checkboxColWidth,
        disabledData,
        rowExpandable,
        setting,
        firstRowRef,
        prefix,
        errorRowKeys,
        bordered: _bordered,
        resizable,
        isResizableColKey,
        rowSelection,
        highlightedRowKeys: _highlightRows,
        setHighlightRows,
        highlightedColKeys,
        tableRef,
        data: dataSource ? serverTableConfig.data : data,
        columns: columns,
        expandedRender,
        expandedRowKeys,
        // 标题点击回调事件
        onHeaderRow,
        onRow,
        onExpand,
        realColumnsWidth,
        setRealColumnsWidth,
        sticky,
        stickyTop,
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
        // hover 高亮列
        hoverColIndex,
        setHoverColIndex,
        showColMenu,
        // 是否展示hover高亮列
        showColHighlight,
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
        getColKeyValue,
        sortCols,
        setSortCols,
        cacheSortCols,
        setCacheSortCols,
        cacheHiddenColKeys,
        setCacheHiddenColKeys,
        hiddenColKeys,
        setHiddenColKeys,
        // 出现横向滚动条时的宽度
        scrollWidth,
        // 同步行高度
        eachRowHeight,
        setEachRowHeight,
        theme,
        localeDatas,
        expandedTreeRows,
        setExpandedTreeRows,
        onLoadChildren,
        loadChildren,
        draggable,
        dargInfo,
        onDragStart,
        onDrop,
        onDropEnd,
        highlightRowOnDoubleClick
      }}
    >
      <div
        className={classnames(prefix, `theme__${theme}`, {
          [`${prefix}--striped`]: striped,
          [`${prefix}--bordered`]: _bordered,
          [`${prefix}--${size}`]: size
        })}
        onDrop={onDropCallback}
        ref={hiTable}
      >
        {/* Normal table 普通表格 */}
        {/* bugfix: 表格头部和内容分离是卡顿的主要原因 */}
        <div className={`${prefix}__container`} ref={baseTable}>
          <HeaderTable />
          <BodyTable fatherRef={hiTable} emptyContent={emptyContent} />
          {/* 显示阴影 */}
          {(alwaysFixedColumn || scrollSize.scrollLeft > 0) && realLeftFixedColumns.length > 0 && (
            <div
              className={`${prefix}__shadow-mask  ${prefix}__shadow-left`}
              style={{ width: fixedColumnsWidth.left + 'px' }}
            >
              <div className={`${prefix}__shadow-lock`}></div>
            </div>
          )}
          {(alwaysFixedColumn || scrollSize.scrollRight > 0) && realRightFixedColumns.length > 0 && (
            <div
              className={`${prefix}__shadow-mask ${prefix}__shadow-right`}
              style={{ width: fixedColumnsWidth.right + 'px' }}
            >
              <div className={`${prefix}__shadow-lock `}></div>
            </div>
          )}
        </div>
        {/* Pagination 分页组件 */}
        {_pagination && (
          <div
            className={classnames(`${prefix}__pagination`, {
              [`${prefix}__pagination--${_pagination.placement}`]: _pagination.placement
            })}
          >
            <Pagination
              {..._pagination}
              onChange={(current, pre, pageSize) => {
                const { onChange } = _pagination || {}
                paginationOnChange(current)
                onChange && onChange(current, pre, pageSize)
              }}
            />
          </div>
        )}
      </div>
    </TableContext.Provider>
  )
}

const TableWrapper = ({
  columns,
  uniqueId,
  standard,
  data,
  loading,
  hiddenColKeys: hiddenColKeysProp,
  onHiddenColKeysChange,
  ...settingProps
}) => {
  const getColKeyValue = useCallback((obj) => {
    const val = obj.dataKey
    if (val == null) {
      console.error(`Error: Not found for the unique dataKey attribute in columns prop.`)
    }
    return val
  }, [])

  // 列操作逻辑

  const [sortCols, setSortCols] = useState(() => {
    if (uniqueId) {
      try {
        const localsSortCols = JSON.parse(window.localStorage.getItem(`${uniqueId}_sortCols`))

        if (Array.isArray(localsSortCols)) {
          return localsSortCols
        }
      } catch (error) {}
    }

    return columns
  })

  // 用于维护列操作时排序临时状态
  const [cacheSortCols, setCacheSortCols] = useState(sortCols)

  const [_hiddenColKeys, setHiddenColKeys] = useUncontrolledState(
    () => {
      if (uniqueId) {
        try {
          const localHiddenColKeys = JSON.parse(window.localStorage.getItem(`${uniqueId}_hiddenColKeys`))

          if (Array.isArray(localHiddenColKeys)) {
            return localHiddenColKeys
          }
        } catch (error) {}
      }

      return []
    },
    hiddenColKeysProp,
    onHiddenColKeysChange
  )

  // 用于维护列操作时显隐临时状态
  const [cacheHiddenColKeys, setCacheHiddenColKeys] = useState(_hiddenColKeys)

  // 过滤掉 undefined 和 null，保证 includes 匹配 column（对象可能未声明 `key` 属性 ） 是有效的可展示的列
  const hiddenColKeys = _hiddenColKeys.filter((key) => key != null)
  const mergedColumns = sortCols.filter((col) => !hiddenColKeys.includes(getColKeyValue(col)))

  // 当column发生改变的时候，同步 setting 的 sortCols 设置
  useEffect(() => {
    setSortCols(columns)
  }, [columns])

  useEffect(() => {
    if (uniqueId) {
      window.localStorage.setItem(`${uniqueId}_sortCols`, JSON.stringify(cacheSortCols))
      window.localStorage.setItem(`${uniqueId}_hiddenColKeys`, JSON.stringify(hiddenColKeys))
    }
  }, [cacheSortCols, hiddenColKeys, uniqueId])

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
  return loading !== undefined ? (
    <Loading visible={loading}>
      <Table
        columns={mergedColumns}
        data={data || []}
        {...settingProps}
        {...standardPreset}
        getColKeyValue={getColKeyValue}
        sortCols={sortCols}
        setSortCols={setSortCols}
        cacheSortCols={cacheSortCols}
        setCacheSortCols={setCacheSortCols}
        cacheHiddenColKeys={cacheHiddenColKeys}
        setCacheHiddenColKeys={setCacheHiddenColKeys}
        hiddenColKeys={hiddenColKeys}
        setHiddenColKeys={setHiddenColKeys}
      />
    </Loading>
  ) : (
    <Table
      columns={mergedColumns}
      data={data || []}
      {...settingProps}
      {...standardPreset}
      getColKeyValue={getColKeyValue}
      sortCols={sortCols}
      setSortCols={setSortCols}
      cacheSortCols={cacheSortCols}
      setCacheSortCols={setCacheSortCols}
      cacheHiddenColKeys={cacheHiddenColKeys}
      setCacheHiddenColKeys={setCacheHiddenColKeys}
      hiddenColKeys={hiddenColKeys}
      setHiddenColKeys={setHiddenColKeys}
    />
  )
}

export default Provider(TableWrapper)
