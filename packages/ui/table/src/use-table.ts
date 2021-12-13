import {
  isLeaf,
  getLeafChildren,
  groupByTreeDepth,
  cloneTree,
  deleteNodeById,
  findNodeById,
  flattenTree,
  insertNodeById,
} from '@hi-ui/tree-utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import {
  HeaderRowFunc,
  RowSelection,
  TableColumnItem,
  TableDataSource,
  TableFixedOptions,
  TableRowSelection,
} from './types'
import { PaginationProps } from '@hi-ui/pagination'

import { useLatestCallback } from '@hi-ui/use-latest'
import {
  deleteRowByKey,
  getMaskItemsWIdth,
  parseFixedColumns,
  setColumnsDefaultWidth,
  setRowByKey,
} from './utils'
import { isArrayNonEmpty, isFunction, isNullish, isPromise } from '@hi-ui/type-assertion'
import { useCheck, useSelect } from '@hi-ui/use-check'
import { __DEV__ } from '@hi-ui/env'
import Checkbox from '@hi-ui/checkbox'
import { useAsyncSwitch, useExpand } from './hooks'

const DEFAULT_COLUMNS = [] as []
const DEFAULT_DATA = [] as []
const DEFAULT_ERROR_ROW_KEYS = [] as []
const DEFAULT_HIGHLIGHTED_ROW_KEYS = [] as []
const DEFAULT_HIGHLIGHTED_COL_KEYS = [] as []
const DEFAULT_CHECKED_ROW_KEYS = [] as any[]

const DEFAULT_ROW_SELECTION = {} as TableRowSelection
const DEFAULT_ALLOW = () => true

export const useTable = ({
  data = DEFAULT_DATA,
  columns: columnsProp = DEFAULT_COLUMNS,
  fixedToColumn,
  rowSelection,
  striped = false,
  bordered: borderedProp = false,
  resizable = false,
  size,
  errorRowKeys = DEFAULT_ERROR_ROW_KEYS,
  highlightedRowKeys: highlightedRowKeysProp,
  highlightedColKeys: highlightedColKeysProp,
  expandRowKeys: expandRowKeysProp,
  onExpand,
  // expandERowKeys: expandRowKeysProp,
  expandEmbedRowKeys: expandEmbedRowKeysProp,
  onEmbedExpand,
  onHeaderRow,
  expandedRender,
  maxHeight,
  pagination,
  dataSource,
  showColMenu,
  showColHighlight,
  sticky,
  stickyTop = 0,
  setting,
  onLoadChildren,
  rowExpandable = DEFAULT_ALLOW,
  uniqueId,
  hiddenColKeys: hiddenColKeysProp,
  onHiddenColKeysChange,
  scrollWidth,
  draggable = false,
  fieldKey = 'key',
  onDragStart,
  onDrop: onDropProp,
  onDropEnd,
  // getColKeyValue,
  // sortCols,
  // setSortCols,
  // cacheSortCols,
  // setCacheSortCols,
  // cacheHiddenColKeys,
  // setCacheHiddenColKeys,
  // setHiddenColKeys,
  emptyContent,
}: UseTableProps) => {
  /**
   * 获取 key 字段值
   */
  const getRowKeyField = React.useCallback(
    (item: any) => {
      const val = item[fieldKey]
      if (__DEV__) {
        if (isNullish(val)) {
          console.error(`Error: Not found for the unique key attribute in data prop.`)
        }
      }
      return val
    },
    [fieldKey]
  )

  // ********************** cache *********************** //

  const [cacheData, setCacheData] = useState(data)
  const [columns, setColumns] = useState(columnsProp)

  // ************************ flat ************************ //

  const flattedData = useMemo(() => {
    const clonedData = cloneTree(cacheData)

    // @ts-ignore
    return flattenTree(clonedData, (node) => {
      // @ts-ignore

      return { ...node, id: getRowKeyField(node.raw) }
    })
  }, [cacheData, getRowKeyField])

  const disabledDataRef = useRef([])

  const [fixedColWidth, setFixedColWidth] = useState<number[]>([])

  const [colWidths, setColWidths] = useState(() => {
    return columnsProp.map((c) => c.width || 'auto')
  })

  // ********************** 行展开 *********************** //

  /**
   * 树形节点展开
   */
  // const [expandTreeRows, trySetExpandTreeRows] = useUncontrolledState(
  //   [],
  //   expandRowKeysProp,
  //   onExpand
  // )

  // const [onExpandTreeRowsChange, isExpandTreeRows] = useCheck({
  //   checkedIds: expandTreeRows,
  //   onCheck: trySetExpandTreeRows as any,
  //   idFieldName: 'key',
  // })

  // console.log('expandTreeRows', expandTreeRows)
  const [transitionData, onExpandTreeRowsChange, onNodeToggleEnd, isExpandTreeRows] = useExpand(
    flattedData,
    [],
    expandRowKeysProp,
    onExpand,
    false
  )

  // console.log('transitionData', transitionData)

  // const = useExpand()
  // 异步展开子树
  const [isLoadingTreeNodeId, onTreeNodeSwitch] = useAsyncSwitch(
    setCacheData,
    onExpandTreeRowsChange,
    onLoadChildren
  )

  /**
   * 行内嵌面板展开
   */
  const [expandEmbedRows, trySetExpandEmbedRows] = useUncontrolledState(
    // 展开全部
    [],
    expandEmbedRowKeysProp,
    onEmbedExpand
  )

  const [onExpandEmbedRowsChange, isExpandEmbedRows] = useCheck({
    checkedIds: expandEmbedRows,
    onCheck: trySetExpandEmbedRows as any,
    idFieldName: 'key',
  })

  // 异步

  // 异步展开内嵌面板

  const firstRowElementRef = useRef<HTMLTableRowElement>(null)

  /**
   * 获取每列宽度，数组维护
   */
  useEffect(() => {
    disabledDataRef.current = []

    // TODO: why don't dataSource
    if (!dataSource) {
      // 收集所有列宽，通过 table 的第一行
      if (firstRowElementRef.current) {
        console.log('firstRowElementRef.current', firstRowElementRef.current)

        const _realColumnsWidth = Array.from(firstRowElementRef.current.childNodes).map((node) => {
          return (node as HTMLElement).getBoundingClientRect().width || 0
        })

        setColWidths(_realColumnsWidth)
      }
    }
  }, [columnsProp, dataSource, data])

  useEffect(() => {
    if (firstRowElementRef.current && fixedToColumn) {
      const fixedToIndex = columnsProp.findIndex((c) => c.dataKey === fixedToColumn)

      const _fixedColsWidth = Array.from(firstRowElementRef.current.childNodes)
        .map((node) => {
          const _node = node as HTMLElement
          return _node.getBoundingClientRect().width
        })
        .slice(0, fixedToIndex + 1)

      setFixedColWidth(_fixedColsWidth)
    }
  }, [columnsProp, data, fixedToColumn])

  // ************************ 多选 ************************ //

  const [checkedRowKeys, trySetCheckedRowKeys] = useUncontrolledState(
    DEFAULT_CHECKED_ROW_KEYS,
    rowSelection?.selectedRowKeys,
    rowSelection?.onChange
  )

  const [onCheckedRowKeysChange, isCheckedRowKey] = useCheck({
    checkedIds: checkedRowKeys,
    onCheck: trySetCheckedRowKeys as any,
    idFieldName: 'key',
  })

  // TODO: 生成单独的 checkbox column
  // 自定义设置 checkbox 列宽度
  const checkboxColWidth =
    rowSelection && typeof rowSelection.checkboxColWidth === 'number'
      ? rowSelection.checkboxColWidth
      : 50

  const getRowSelection = React.useCallback(
    (rowData) => {
      const checkboxConfig = rowSelection?.getCheckboxConfig?.(rowData)
      const disabled = checkboxConfig?.disabled ?? false

      return { disabled, colWidth: checkboxColWidth }
    },
    [rowSelection, checkboxColWidth]
  )

  const checkRowIsDisabledCheckbox = React.useCallback(
    (item: any) => {
      return getRowSelection(item).disabled
    },
    [getRowSelection]
  )

  // 判断是否全选
  const [checkedAll, halfChecked] = React.useMemo(() => {
    if (rowSelection) {
      if (flattedData.length === 0 || checkedRowKeys.length === 0) {
        return [false, false]
      }

      // TODO: 对于分页来讲，此处的 flattedData 应该是当前页的数据
      // TODO: flattedTree 处理出来的对象对用户来说应该是无感知的。
      const checkedAll = flattedData
        .filter((item: any) => !checkRowIsDisabledCheckbox(item.raw))
        // TODO: 数组项内容完全匹配工具函数
        .every((item: any) => isCheckedRowKey(getRowKeyField(item.raw)))

      return [checkedAll, checkedAll ? false : checkedRowKeys.length > 0]
    }

    return [false, false]
  }, [
    flattedData,
    rowSelection,
    getRowKeyField,
    checkRowIsDisabledCheckbox,
    isCheckedRowKey,
    checkedRowKeys.length,
  ])
  const tryCheckAllRow = React.useCallback(() => {
    if (checkedAll) {
      trySetCheckedRowKeys([] as any, [], !checkedAll)
      return
    }

    const targetItems = flattedData.filter((item: any) => !checkRowIsDisabledCheckbox(item))
    const checkedRowKeys = targetItems.map((item: any) => getRowKeyField(item.raw))

    trySetCheckedRowKeys(checkedRowKeys, targetItems, !checkedAll)
  }, [trySetCheckedRowKeys, flattedData, checkRowIsDisabledCheckbox, getRowKeyField, checkedAll])

  // ************************ 拖拽 ************************ //

  const dragRowRef = React.useRef<any | null>(null)

  const onDropEndLatest = useLatestCallback(onDropEnd)

  const onDrop = useCallback(
    (sourceId, targetId, dragDirection) => {
      console.log(sourceId, targetId, dragDirection)

      if (!draggable) return
      if (targetId === sourceId) return

      // TODO： 根据 id 查询数据原始数据或者直接使用引用值，两者选择，避免bug
      // const { rowData, dropRowData, level } = dragRowRef.current

      const sourceNode = findNodeById(cacheData, sourceId, { idFieldName: 'key' })
      const targetNode = findNodeById(cacheData, targetId, { idFieldName: 'key' })

      if (!sourceNode || !targetNode) {
        // console.log('未找到任何节点(sourceNode, targetNode)', sourceNode, targetNode)
        return
      }

      const nextTreeData = cloneTree(cacheData)

      deleteNodeById(nextTreeData, sourceId, { idFieldName: 'key' })
      insertNodeById(nextTreeData, targetId, sourceNode, dragDirection === 'top' ? 0 : 1, {
        idFieldName: 'key',
      })

      const resultMaybePromise = isFunction(onDropProp)
        ? // TODO: 支持 tree 拖拽层级，第四个参数
          onDropProp(sourceNode, targetNode, { before: cacheData, after: nextTreeData }, 1)
        : true

      if (isPromise(resultMaybePromise)) {
        resultMaybePromise.then((returnResult) => {
          if (returnResult === true) {
            setCacheData(nextTreeData)
            onDropEndLatest(sourceNode, targetNode, cacheData)
          }
        })
      } else if (resultMaybePromise === true) {
        setCacheData(nextTreeData)
        onDropEndLatest(sourceNode, targetNode, cacheData)
      }
    },
    [draggable, onDropProp, cacheData, onDropEndLatest]
  )

  // 拉平后的数据
  const [flattedColumns, maxColumnDepth] = useMemo(() => {
    const clonedColumns = cloneTree(columns)
    let maxDepth = 0

    // TODO: flattenTree 支持不带 id 的
    // TODO: 支持多级表头
    // @ts-ignore
    const flattedColumns = flattenTree(clonedColumns, (node) => {
      if (node.depth > maxDepth) {
        maxDepth = node.depth
      }
      return { ...node }
    })

    return [flattedColumns, maxDepth] as const
  }, [columns])

  // 末级 column
  const flattedColumnsWithoutChildren = useMemo(() => {
    return flattedColumns.filter((col) => !isArrayNonEmpty(col.children))
  }, [flattedColumns])

  // ************************ 列冻结 ************************ //

  // 固定列的宽度
  const [fixedColumnsWidth, setFixedColumnsWidth] = useState({ left: 0, right: 0 })

  const [freezeColKeys, setFreezeColKeys] = useState([])

  // 2 种模式：从左往右冻结到指定列、只抽离并冻结指定列

  // 获取左右侧固定列的信息
  // const [leftFrozenColKeys, setLeftFrozenColKeys] = useState([])
  // const [rightFrozenColKeys, setRightFrozenColKeys] = useState([])

  // 左右 fixed 所在的列，抹平结构
  const fixedToColumnMemo = React.useMemo(() => {
    if (typeof fixedToColumn === 'string') {
      return { left: fixedToColumn }
    }

    if (!fixedToColumn) return {}

    return fixedToColumn
  }, [fixedToColumn])

  const { leftFrozenColKeys, rightFrozenColKeys } = React.useMemo(() => {
    const { left: leftFixedColumn, right: rightFixedColumn } = fixedToColumnMemo

    // 获取冻结类列的下标
    let leftFixedIndex: number | undefined
    let rightFixedIndex: number | undefined

    flattedColumns.some((column, index) => {
      if (typeof leftFixedColumn === 'string' && leftFixedColumn === column.raw.dataKey) {
        // 指向原始 column 根节点序列
        leftFixedIndex = index
      }

      if (typeof rightFixedColumn === 'string' && rightFixedColumn === column.raw.dataKey) {
        rightFixedIndex = index
      }

      return leftFixedIndex !== undefined && rightFixedIndex !== undefined
    })

    let nextColumns = cloneTree(columnsProp)

    // TODO: 为什么冻结列，需要设置默认宽度
    if (typeof leftFixedIndex === 'number' || typeof rightFixedIndex === 'number' || scrollWidth) {
      const lastColumns = flattedColumns.filter((item) => {
        return typeof item.isLast !== 'undefined' ? item.isLast : true
      })

      nextColumns = setColumnsDefaultWidth(
        nextColumns,
        scrollWidth ? scrollWidth / lastColumns.length : 100
      )
    }

    let leftColumns = [] as any[]
    // 左侧
    if (typeof leftFixedIndex === 'number') {
      leftColumns = nextColumns.slice(0, leftFixedIndex + 1)
      leftColumns.forEach((currentItem, index) => {
        parseFixedColumns(
          currentItem,
          index,
          leftColumns,
          'leftStickyWidth',
          expandedRender || rowSelection
        )

        nextColumns[index] = currentItem
      })
    }

    // 右侧
    let rightColumns = [] as any[]
    if (typeof rightFixedIndex === 'number') {
      rightColumns = nextColumns.slice(rightFixedIndex).reverse()

      rightColumns.forEach((currentItem, index) => {
        const _item = parseFixedColumns(
          currentItem,
          index,
          rightColumns,
          'rightStickyWidth',
          expandedRender || rowSelection
        )

        nextColumns[nextColumns.length - 1 - index] = _item
      })
    }

    return {
      leftFrozenColKeys: leftColumns,
      rightFrozenColKeys: rightColumns,
      columns: nextColumns,
    }
  }, [flattedColumns, fixedToColumnMemo, columnsProp, rowSelection, expandedRender, scrollWidth])

  const tableRef = useRef<HTMLTableElement>(null)
  const bodyTableRef = useRef<HTMLTableElement>(null)

  // 计算冻结列的宽度
  const {
    leftFixedColumnsWidth,
    rightFixedColumnsWidth,
    scrollLeft,
    scrollHeight,
  } = React.useMemo(() => {
    let leftFixedColumnsWidth = 0
    let rightFixedColumnsWidth = 0
    leftFixedColumnsWidth = getMaskItemsWIdth(leftFrozenColKeys)
    rightFixedColumnsWidth = getMaskItemsWIdth(rightFrozenColKeys)

    // mutationObserver
    const tableWidth = tableRef.current?.getBoundingClientRect?.().width ?? 0
    const tableBodyWidth = bodyTableRef.current?.getBoundingClientRect?.().width ?? 0

    return {
      leftFixedColumnsWidth,
      rightFixedColumnsWidth,
      scrollRight: tableWidth - tableBodyWidth,
      scrollLeft: 0,
    }
  }, [leftFrozenColKeys, rightFrozenColKeys])

  // console.log(leftFrozenColKeys, rightFrozenColKeys)

  // row Selection 做为 column 插入，而不是在代码里魔改 冻结列

  // 同步滚动条
  const headerTableRef = useRef(null)
  const stickyHeaderRef = useRef(null)
  const leftFixedBodyTableRef = useRef(null)
  const rightFixedBodyTableRef = useRef(null)

  const hiTable = useRef(null)
  const [activeSorterColumn, setActiveSorterColumn] = useState(null)
  const [activeSorterType, setActiveSorterType] = useState(null)

  // ************************ 列高亮 ************************ //

  /**
   * 控制列高亮，依据 column 中的 dataKey 控制
   */
  const [highlightedColKeys, trySetHighlightedColKeys] = useUncontrolledState(
    DEFAULT_HIGHLIGHTED_COL_KEYS,
    highlightedColKeysProp
  )

  const [onHighlightedColChange, isHighlightedCol] = useCheck({
    checkedIds: highlightedColKeys,
    onCheck: trySetHighlightedColKeys as any,
    idFieldName: 'dataKey',
  })

  /**
   * 设置列 hover 高亮，依据 column 中的 dataKey 控制
   */
  const [hoveredColKey, setHoveredColKey] = useState<React.ReactText>('')

  const [onHoveredColChange, isHoveredCol] = useSelect({
    selectedId: hoveredColKey,
    onSelect: setHoveredColKey,
    idFieldName: 'dataKey',
  })

  // ************************ 行高亮 ************************ //

  /**
   * 控制行高亮，依据 data 中的 key 控制
   */
  const [highlightedRowKeys, trySetHighlightedRowKeys] = useUncontrolledState(
    DEFAULT_HIGHLIGHTED_ROW_KEYS,
    highlightedRowKeysProp
  )
  const [onHighlightedRowChange, isHighlightedRow] = useCheck({
    checkedIds: highlightedRowKeys,
    onCheck: trySetHighlightedRowKeys as any,
    idFieldName: 'key',
  })

  // console.log('hoveredColKey', hoveredColKey)

  // ************************ 列操作 ************************ //

  const {
    mergedColumns,
    sortCols,
    cacheSortCols,
    setCacheSortCols,
    hiddenColKeys,
    cacheHiddenColKeys,
    setCacheHiddenColKeys,
    setHiddenColKeys,
  } = useColsAction({
    uniqueId,
    columns: columnsProp,
    hiddenColKeys: hiddenColKeysProp,
    onHiddenColKeysChange,
  })

  // ************************ 分页 ************************ //

  const [serverTableConfig, setServerTableConfig] = useState({
    data: [],
    columns: [...columnsProp],
  })

  const paginationMemo = React.useMemo(() => {
    return serverTableConfig.pagination || pagination || {}
  }, [serverTableConfig, pagination])

  const [currentPage, trySetCurrentPage] = useUncontrolledState(
    1,
    paginationMemo.current,
    paginationMemo.onPageChange
  )

  useEffect(() => {
    if (dataSource) {
      const fetchConfig = dataSource(currentPage)
      fetch(fetchConfig).then((res) => {
        setServerTableConfig(Object.assign({}, serverTableConfig, { data: res.data }))
      })
    }
  }, [dataSource, currentPage, serverTableConfig])

  const [eachRowHeight, setEachRowHeight] = useState({})
  const loadChildren = useRef(null)

  // 有表头分组那么也要 bordered
  const bordered = borderedProp || flattedColumns.length > columns.length
  const [scrollSize, setScrollSize] = useState({ scrollLeft: 0, scrollRight: 1 })

  // 新增滚动优化
  // const syncScrollLeft = (scrollLeft: number, syncTarget: any) => {
  //   let scrollRight = scrollSize.scrollRight
  //   if (syncTarget && syncTarget.scrollLeft !== scrollLeft) {
  //     syncTarget.scrollLeft = scrollLeft
  //   }

  //   if (
  //     tableRef &&
  //     tableRef.current &&
  //     bodyTableRef &&
  //     bodyTableRef.current &&
  //     rightFrozenColKeys
  //   ) {
  //     const { right: tableTefRight } = tableRef.current.getBoundingClientRect()
  //     const { right } = bodyTableRef.current.getBoundingClientRect()
  //     scrollRight = tableTefRight - right
  //   }
  //   setScrollSize({ scrollLeft, scrollRight })
  // }

  // const syncScrollTop = (scrollTop: number, syncTarget: any) => {
  //   if (syncTarget && syncTarget.scrollTop !== scrollTop) {
  //     syncTarget.scrollTop = scrollTop
  //   }
  // }

  // ************************ colgroup ************************ //

  // const isStickyHeaderRef = useRef(false)
  // isStickyHeaderRef.current = flattedColumns.some((col) => {
  //   return typeof col.leftStickyWidth !== 'undefined' || typeof col.rightStickyWidth !== 'undefined'
  // })

  const [mergedColumns2, groupedColumns] = React.useMemo(() => {
    const preset: TableColumnItem[] = [
      rowSelection && {
        type: 'checkbox',
        width: 50,
      },
      expandedRender && {
        type: 'embedPanel',
      },
    ].filter(Boolean)

    const nextColumns = preset.concat(
      flattedColumns.filter((col: any) => !isArrayNonEmpty(col.children))
    )

    // 在最后一层，colSpan = 1, rowSpan = maxDepth - depth + 1
    // 不在最后一层，rowSpan = 1, colSpan = 叶子节点后代数量
    flattedColumns.forEach((column: any) => {
      if (isLeaf(column)) {
        column.rowSpan = maxColumnDepth - column.depth + 1
        column.colSpan = 1
      } else {
        column.rowSpan = 1
        column.colSpan = getLeafChildren(column)
      }
    })

    const groupedColumns = groupByTreeDepth(columns)
    return [nextColumns, groupedColumns] as const
  }, [maxColumnDepth, expandedRender, columns, flattedColumns, rowSelection])

  // console.log(mergedColumns2)

  return {
    columns: mergedColumns2,
    data: cacheData,
    transitionData,
    flattedColumns,
    flattedColumnsWithoutChildren,
    fixedColWidth,
    expandedRender,
    // 行多选
    rowSelection,
    checkedRowKeys,
    trySetCheckedRowKeys,
    checkedAll,
    halfChecked,
    tryCheckAllRow,
    onCheckedRowKeysChange,
    isCheckedRowKey,
    cacheData,
    firstRowElementRef,
    // ui
    bordered,
    size,
    // 分页
    pagination: paginationMemo,
    currentPage,
    trySetCurrentPage,
    errorRowKeys: [],
    // 冻结列
    freezeColKeys,
    setFreezeColKeys,
    scrollSize,
    leftFrozenColKeys,
    rightFrozenColKeys,
    fixedColumnsWidth,
    // 行高亮
    onHighlightedRowChange,
    isHighlightedRow,
    highlightedRowKeys,
    trySetHighlightedRowKeys,
    // 列高亮
    onHighlightedColChange,
    isHighlightedCol,
    highlightedColKeys,
    trySetHighlightedColKeys,
    // 列 hover
    showColHighlight,
    isHoveredCol,
    onHoveredColChange,
    // 行拖拽
    draggable,
    highlightColumns: [],
    dragRowRef,
    onDrop,
    mergedColumns,
    // 列排序
    sortCols,
    cacheSortCols,
    setCacheSortCols,
    // 列隐藏
    hiddenColKeys,
    cacheHiddenColKeys,
    setCacheHiddenColKeys,
    setHiddenColKeys,
    // alignLeftColumns,
    groupedColumns,
    colWidths,
    // 子树展开
    onExpandTreeRowsChange,
    isExpandTreeRows,
    isLoadingTreeNodeId,
    onTreeNodeSwitch,
    // 内嵌面板展开
    onExpandEmbedRowsChange,
    isExpandEmbedRows,
    rowExpandable,
  }
}

const parseLocalArray = ({ key, defaultValue, disabled }: any) => {
  if (!disabled) {
    try {
      let localArr = window.localStorage.getItem(key)

      if (localArr) {
        localArr = JSON.parse(localArr)

        if (Array.isArray(localArr)) {
          return localArr
        }
      }
    } catch (error) {}
  }

  return defaultValue
}

/**
 * 列操作逻辑
 */
const useColsAction = ({
  uniqueId,
  columns = DEFAULT_COLUMNS,
  hiddenColKeys: hiddenColKeysProp,
  onHiddenColKeysChange,
}: UseTableProps) => {
  const [sortCols, setSortCols] = useState(() =>
    parseLocalArray({ key: `${uniqueId}_sortCols`, disabled: !uniqueId, defaultValue: columns })
  )

  // 用于维护列操作时排序临时状态
  const [cacheSortCols, setCacheSortCols] = useState(sortCols)

  const [_hiddenColKeys, setHiddenColKeys] = useUncontrolledState(
    () =>
      parseLocalArray({
        key: `${uniqueId}_hiddenColKeys`,
        disabled: !uniqueId,
        defaultValue: [],
      }),
    hiddenColKeysProp,
    onHiddenColKeysChange
  )

  // 用于维护列操作时显隐临时状态
  const [cacheHiddenColKeys, setCacheHiddenColKeys] = useState(_hiddenColKeys)

  // 过滤掉 undefined 和 null，保证 includes 匹配 column（对象可能未声明 `key` 属性 ） 是有效的可展示的列
  const hiddenColKeys = _hiddenColKeys.filter((key: any) => key != null)
  const mergedColumns = sortCols.filter((col: any) => !hiddenColKeys.includes(getColKeyValue(col)))

  useEffect(() => {
    if (uniqueId) {
      window.localStorage.setItem(`${uniqueId}_sortCols`, JSON.stringify(sortCols))
      window.localStorage.setItem(`${uniqueId}_hiddenColKeys`, JSON.stringify(hiddenColKeys))
    }
  }, [sortCols, hiddenColKeys, uniqueId])

  // 当column发生改变的时候，同步 setting 的 sortCols 设置
  useEffect(() => {
    setSortCols(columns)
  }, [columns])

  return {
    hiddenColKeys,
    mergedColumns,
    sortCols,
    cacheSortCols,
    cacheHiddenColKeys,
    setCacheHiddenColKeys,
    setCacheSortCols,
    setHiddenColKeys,
  }
}

export interface UseTableProps {
  /**
   *  表格数据
   */
  data?: object[]
  /**
   *  指定 data 表格数据中某一属性为 key
   */
  fieldKey?: string
  /**
   *  表格列配置信息
   */
  columns?: TableColumnItem[]
  /**
   *  是否显示边框（表头分组模式下，表格自带边框）
   */
  bordered?: boolean
  /**
   *  是否支持表头吸顶
   */
  sticky?: boolean
  /**
   *  表头吸顶距离视口顶部距离
   */
  stickyTop?: number
  /**
   *  高亮列（受控）
   */
  highlightedColKeys?: string[]
  /**
   *  表格展开项
   */
  expandedRender?: (
    record: TableColumnItem,
    index: number
  ) => React.ReactNode | Promise<React.ReactNode>
  /**
   *  设置是否允许行展开
   */
  rowExpandable?: (record: TableColumnItem) => React.ReactNode
  /**
   *  树形表格展开的行
   */
  expandRowKeys?: number[]
  /**
   *  树形表格展开时的回调函数
   */
  onExpand?: (expandIds: React.ReactText[], targetRow: TableColumnItem, expanded: boolean) => void

  /**
   *  内嵌式表格展开的行
   */
  expandEmbedRowKeys?: number[]
  /**
   *  内嵌式表格展开时的回调函数
   */
  onEmbedExpand?: (
    expandIds: React.ReactText[],
    targetRow: TableColumnItem,
    expanded: boolean
  ) => void
  /**
   *  表格最大高度，当穿过该高度时，展示滚动条且表头固定
   */
  maxHeight?: number
  /**
   *  表格列冻结设置，为 string 时仅支持从左侧冻结至某一列
   */
  fixedToColumn?: string | TableFixedOptions
  /**
   *  配置表格尺寸
   */
  size?: string
  /**
   *  表格分页配置项
   */
  pagination?: PaginationProps
  /**
   *  错误列（受控）
   */
  errorRowKeys?: string[]
  /**
   *  高亮行（受控）
   */
  highlightedRowKeys?: React.ReactText[]
  /**
   *  行可选（受控）
   */
  rowSelection?: TableRowSelection
  /**
   *  异步数据源
   */
  dataSource?: (current: number) => TableDataSource
  /**
   *  是否支持列操作
   */
  showColMenu?: boolean
  /**
   *  是否展示为斑马纹效果
   */
  striped?: boolean
  /**
   *  是否集成控制面板功能
   */
  setting?: boolean
  /**
   *  数据为空时的展示内容
   */
  emptyContent?: React.ReactNode
  /**
   *  是否能够动态控制列宽
   */
  resizable?: boolean
  /**
   *  标准模式，默认集成 `showColMenu = true, sticky = true, bordered = true, setting = true, striped = true`
   */
  standard?: boolean
  /**
   *  加载中状态
   */
  loading?: boolean
  /**
   *  表格滚动的宽度（当表格总设置宽度（含自适应列）大于表格父级容器宽度时需要设置）**3.7.0 版本以后，该属性不建议使用**
   */
  scrollWidth?: number
  /**
   *  表格某一列`hover`时，该列高亮
   */
  showColHighlight?: boolean
  /**
   *  表格行可拖拽
   */
  draggable?: boolean
  /**
   *  隐藏列（受控） (v3.9.0 新增)
   */
  hiddenColKeys?: string[]
  /**
   *  列隐藏设置时回调 (v3.9.0 新增)
   */
  onHiddenColKeysChange?: (hiddenColKeys: string[]) => void
  /**
   * 唯一 id 前缀
   */
  uniqueId?: string

  onHeaderRow?: HeaderRowFunc
  onDragStart?: (rowData: object) => void
  onDrop?: (
    dragRowData: object,
    dropRowData: object,
    data: object,
    level: Level
  ) => boolean | Promise<any>
  onDropEnd?: (dragRowData: object, dropRowData: object, data: object) => void
  expandedRowKeys?: string[]
}

export type UseTableReturn = ReturnType<typeof useTable>

const getColKeyValue = (obj: TableColumnItem) => {
  const val = obj.dataKey
  if (val == null) {
    console.error(`Error: Not found for the unique dataKey attribute in columns prop.`)
  }
  return val
}
