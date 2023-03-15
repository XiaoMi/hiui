import {
  cloneTree,
  // fFindNestedChildNodesByIndex,
  flattenTree,
  getLeafChildren,
  // getNodeAncestors,
  getNodeRootParent,
  // getNodeRootParent,
} from '@hi-ui/tree-utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import {
  TableColumnItem,
  TableFrozenColumnOptions,
  TableRowEventData,
  TableRowSelection,
  FlattedTableColumnItemData,
} from './types'
import { PaginationProps } from '@hi-ui/pagination'
import { useColWidth } from './hooks/use-col-width'
import { parseFixedColumns, setColumnsDefaultWidth } from './utils'
import { isArrayNonEmpty, isNullish } from '@hi-ui/type-assertion'
import { useCheck, useSelect } from '@hi-ui/use-check'
import { invariant } from '@hi-ui/env'
import { useAsyncSwitch, useExpand } from './hooks'
import { useColumns } from './hooks/use-colgroup'
import { setAttrStatus } from '@hi-ui/dom-utils'
import { useCache } from '@hi-ui/use-cache'
import { useTableDrag } from './hooks/use-drag'
import { useLatestCallback } from '@hi-ui/use-latest'

const DEFAULT_COLUMNS = [] as []
const DEFAULT_DATA = [] as []
const DEFAULT_ERROR_ROW_KEYS = [] as []
const DEFAULT_HIGHLIGHTED_ROW_KEYS = [] as []
const DEFAULT_HIGHLIGHTED_COL_KEYS = [] as []
const DEFAULT_EXPAND_ROW_KEYS = [] as []
const DEFAULT_FIXED_TO_COLUMN = {}

export const useTable = ({
  // basic
  data = DEFAULT_DATA,
  columns: columnsProp = DEFAULT_COLUMNS,
  // frozen columns
  defaultFixedToColumn = DEFAULT_FIXED_TO_COLUMN,
  fixedToColumn: fixedToColumnProp,
  onFixedToColumn,
  scrollWidth,
  resizable = false,
  // highlight
  errorRowKeys = DEFAULT_ERROR_ROW_KEYS,
  highlightedColKeys: highlightedColKeysProp,
  highlightedRowKeys: highlightedRowKeysProp,
  showColHighlight = false,
  showRowHighlight = true,
  highlightRowOnDoubleClick = true,
  // tree table
  defaultExpandedRowKeys = DEFAULT_EXPAND_ROW_KEYS,
  expandedRowKeys: expandRowKeysProp,
  onExpand,
  defaultExpandAll = false,
  onLoadChildren,
  // 表头吸顶
  maxHeight,
  sticky,
  stickyTop = 0,
  // drag
  draggable = false,
  onDragStart,
  onDrop: onDropProp,
  onDropEnd,
  // others
  showColMenu,
  rowSelection,
  cellRender,
  fieldKey = 'key',
  virtual,
  ...rootProps
}: UseTableProps) => {
  /**
   * 获取 key 字段值
   */
  const getRowKeyField = React.useCallback(
    (item: any) => {
      const val = item[fieldKey]
      invariant(
        !isNullish(val),
        'Not found for the unique %s attribute in each row of data prop.',
        fieldKey
      )
      return val
    },
    [fieldKey]
  )

  // ********************** cache *********************** //

  const [cacheData, setCacheData] = useCache(data)
  const [columns] = useCache(columnsProp)

  /**
   * 扁平化数据，支持树形 table
   */
  const flattedData = useMemo(() => {
    const clonedData = cloneTree(cacheData)

    return flattenTree(clonedData as any, (node: any) => {
      return { ...node, id: getRowKeyField(node.raw) }
    })
  }, [cacheData, getRowKeyField])

  // ********************** 树形表格 *********************** //

  const [transitionData, onExpandTreeRowsChange, isExpandTreeRows] = useExpand(
    flattedData,
    defaultExpandedRowKeys,
    expandRowKeysProp,
    onExpand,
    defaultExpandAll
  )

  // 异步展开子树
  const [isLoadingTreeNodeId, onTreeNodeSwitch] = useAsyncSwitch({
    setCascaderData: setCacheData,
    onExpand: onExpandTreeRowsChange,
    onLoadChildren,
    fieldKey,
  })

  // ************************ 拖拽 ************************ //

  const { onDrop, dragRowRef } = useTableDrag({
    cacheData,
    setCacheData,
    draggable,
    flattedData,
    onDropEnd,
    onDrop: onDropProp,
    fieldKey,
  })

  // ************************ colgroup ************************ //

  const { flattedColumns, mergedColumns: mergedColumns2, leafColumns } = useColumns({ columns })

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
   * 设置列 hover 时高亮，依据 column 中的 dataKey 控制
   * 与 highlightedColKeys 互不影响
   */
  const [hoveredColKey, setHoveredColKey] = useState<React.ReactText>('')

  const [onHoveredColChange, isHoveredHighlightCol] = useSelect({
    disabled: !showColHighlight,
    selectedId: hoveredColKey,
    onSelect: setHoveredColKey,
  })

  // ************************ 列宽 resizable ************************ //

  const { setMeasureRowElement, getColgroupProps, onColumnResizable, colWidths } = useColWidth({
    data,
    columns,
    resizable,
    virtual: virtual,
  })

  // ************************ 列冻结 ************************ //

  const bodyTableRef = useRef<HTMLTableElement>(null)
  const scrollBodyElementRef = useRef<HTMLTableElement>(null)

  /**
   * 左右 fixed 所在的列，抹平数据结构
   *
   * TODO: 支持 2 种模式：从左往右冻结到指定列、只抽离并冻结指定列
   */
  const [fixedToColumn, setFixedToColumn] = useUncontrolledState(
    defaultFixedToColumn,
    fixedToColumnProp,
    onFixedToColumn
  )

  const leftFreezeColumn = fixedToColumn.left
  const rightFreezeColumn = fixedToColumn.right

  const setLeftFreezeColumn = useCallback(
    (columnKey: React.ReactText) => {
      setFixedToColumn((prev) => {
        const next = { ...prev }
        next.left = columnKey
        if (next.right === columnKey) {
          next.right = ''
        }
        return next
      })
    },
    [setFixedToColumn]
  )

  const {
    leftFrozenColKeys,
    rightFrozenColKeys,
    columns: mergedColumns1,
    leftFixedColumnsWidth,
    rightFixedColumnsWidth,
  } = React.useMemo(() => {
    const leftFrozenColKey = leftFreezeColumn
    const rightFrozenKey = rightFreezeColumn

    // 获取左右冻结列的下标
    let leftFrozenColIndex: number | undefined
    let rightFrozenColIndex: number | undefined

    mergedColumns2.some((column, index) => {
      if (typeof leftFrozenColKey === 'string' && leftFrozenColKey === column.dataKey) {
        leftFrozenColIndex = index
      }

      if (typeof rightFrozenKey === 'string' && rightFrozenKey === column.dataKey) {
        rightFrozenColIndex = index
      }

      return leftFrozenColIndex !== undefined && rightFrozenColIndex !== undefined
    })

    // 保持内部循环引用关系，如果 cloneTree，将破坏关系
    let nextColumns = [...mergedColumns2]

    if (
      typeof leftFrozenColIndex === 'number' ||
      typeof rightFrozenColIndex === 'number' ||
      scrollWidth
    ) {
      const lastColumns = mergedColumns2

      nextColumns = setColumnsDefaultWidth(
        nextColumns,
        scrollWidth ? scrollWidth / lastColumns.length : 100
      )

      if (colWidths) {
        // colWidths 记录的是最新的列宽，当它有值时，重置一下列宽，否则会导致冻结列动态调整宽度后定位不准
        nextColumns = nextColumns.map((item, index) => {
          return {
            ...item,
            width: colWidths[index],
          }
        })
      }
    }

    let leftColumns = [] as any[]
    // 左侧
    if (typeof leftFrozenColIndex === 'number') {
      // TODO: 支持嵌套冻结列
      // const targetColumn = nextColumns[leftFrozenColIndex]
      // const beforeColumns = nextColumns.filter((_, idx) => idx < leftFrozenColIndex!)
      // // @ts-ignore
      // const afterColumns = fFindNestedChildNodesByIndex(nextColumns, leftFrozenColIndex)
      // // @ts-ignore
      // leftColumns = beforeColumns.concat(targetColumn).concat(afterColumns)
      leftColumns = nextColumns.filter(
        (item, index) => index <= leftFrozenColIndex! && item.depth === 0
      )

      leftColumns.forEach((currentItem, index) => {
        const item = parseFixedColumns(
          currentItem,
          index,
          nextColumns,
          leftColumns,
          'leftStickyWidth'
        )

        leftColumns[index] = item
        nextColumns[item.index] = item
      })
    }

    // @TODO: resizable 和 列冻结宽兼容，统一宽度设置来源
    // const leftFixedColumnsWidth = colWidths.reduce(
    //   (acc, width, index) => (acc += index <= leftFrozenColIndex! ? width : 0),
    //   0
    // )

    const getLeafNodes = (columns: any) => {
      return columns.reduce((acc: any, column: any) => {
        return acc.concat(getLeafChildren(column))
      }, [])
    }

    const leftLeafNodes = getLeafNodes(leftColumns)
    const leftColIndex = leftLeafNodes.length

    const leftFixedColumnsWidth = colWidths.reduce(
      (acc, width, index) => (acc += index < leftColIndex! ? width : 0),
      0
    )

    // 右侧
    let rightColumns = [] as any[]
    if (typeof rightFrozenColIndex === 'number') {
      const targetColumn = nextColumns[rightFrozenColIndex]
      // const beforeColumns = getNodeAncestors(targetColumn)
      // const afterColumns = nextColumns.filter((_, idx) => idx > rightFrozenColIndex!)
      // // @ts-ignore
      // rightColumns = beforeColumns.concat(targetColumn).concat(afterColumns)

      const root = getNodeRootParent(targetColumn)
      rightColumns = [root]
        .concat(
          nextColumns.filter((item, index) => index > rightFrozenColIndex! && item.depth === 0)
        )
        .reverse()

      rightColumns.forEach((currentItem, index) => {
        const item = parseFixedColumns(
          currentItem,
          index,
          nextColumns,
          rightColumns,
          'rightStickyWidth'
        )

        rightColumns[index] = item
        nextColumns[item.index] = item
      })
    }

    const rightLeafNodes = getLeafNodes(rightColumns)
    const rightColIndex = rightLeafNodes.length

    const rightFixedColumnsWidth = [...colWidths]
      .reverse()
      .reduce((acc, width, index) => (acc += index < rightColIndex! ? width : 0), 0)

    return {
      leftFrozenColKeys: leftColumns,
      rightFrozenColKeys: rightColumns,
      columns: nextColumns,
      leftFixedColumnsWidth,
      rightFixedColumnsWidth,
    }
  }, [mergedColumns2, scrollWidth, colWidths, leftFreezeColumn, rightFreezeColumn])

  const [scrollSize, setScrollSize] = useState({ scrollLeft: 0, scrollRight: 1 })

  useEffect(() => {
    // 计算冻结列的宽度
    // mutationObserver
    const tableWidth = bodyTableRef.current?.getBoundingClientRect?.().width ?? 0
    const tableBodyWidth = scrollBodyElementRef.current?.getBoundingClientRect?.().width ?? 0
    const scrollRight = tableWidth - tableBodyWidth
    // const scrollLeft = 0

    setScrollSize((prev) => ({
      scrollLeft: prev.scrollLeft,
      scrollRight,
    }))
  }, [leftFrozenColKeys, rightFrozenColKeys])

  // const canScroll = scrollSize.scrollRight > 0

  // 实时计算
  const canScroll =
    bodyTableRef.current && scrollBodyElementRef.current
      ? scrollBodyElementRef.current.clientWidth < bodyTableRef.current.clientWidth
      : false

  /**
   * 同步 双 table 左右滚动偏移
   */
  const syncScrollLeft = React.useCallback(
    (scrollLeft, syncTarget) => {
      let scrollRight = scrollSize.scrollRight
      if (syncTarget && syncTarget.scrollLeft !== scrollLeft) {
        syncTarget.scrollLeft = scrollLeft
      }
      if (
        bodyTableRef &&
        bodyTableRef.current &&
        scrollBodyElementRef &&
        scrollBodyElementRef.current &&
        isArrayNonEmpty(rightFrozenColKeys)
      ) {
        const { right: tableTefRight } = bodyTableRef.current.getBoundingClientRect()
        const { right } = scrollBodyElementRef.current.getBoundingClientRect()

        scrollRight = tableTefRight - right
      }

      setScrollSize({ scrollLeft, scrollRight })
    },
    [rightFrozenColKeys, scrollSize]
  )

  const scrollHeaderElementRef = useRef<HTMLTableElement>(null)

  const onTableBodyScroll = React.useCallback(
    (evt) => {
      evt.stopPropagation()
      if (scrollBodyElementRef.current) {
        syncScrollLeft(scrollBodyElementRef.current.scrollLeft, scrollHeaderElementRef.current)
      }
    },
    [syncScrollLeft]
  )

  // 1. 对于 sticky 的元素，触发滚轮滚动，需要模拟 onScroll 触发，比如 tableHeader 固定吸顶时
  // 2. 同时不允许其出现滚动条
  const onTableBodyScrollMock = React.useCallback(
    (evt) => {
      if (!scrollHeaderElementRef.current) return

      evt.stopPropagation()

      const { deltaX } = evt

      scrollHeaderElementRef.current.scrollLeft = scrollHeaderElementRef.current.scrollLeft + deltaX
      syncScrollLeft(scrollHeaderElementRef.current.scrollLeft, scrollBodyElementRef.current)
    },
    [syncScrollLeft]
  )

  // ************************ 行高亮 ************************ //

  /**
   * 控制行高亮，依据 data 中的 key 控制
   */
  const [highlightedRowKeys, trySetHighlightedRowKeys] = useUncontrolledState(
    DEFAULT_HIGHLIGHTED_ROW_KEYS,
    highlightedRowKeysProp
  )

  const [onHighlightedRowChange, isHighlightedRow] = useCheck({
    disabled: !highlightRowOnDoubleClick,
    checkedIds: highlightedRowKeys,
    onCheck: trySetHighlightedRowKeys as any,
  })

  const isErrorRow = useCallback((key: React.ReactText) => errorRowKeys.includes(key), [
    errorRowKeys,
  ])

  // 末级 column
  const flattedColumnsWithoutChildren = React.useMemo(() => {
    return mergedColumns1.filter((col) => !isArrayNonEmpty(col.children))
  }, [mergedColumns1])

  const groupedColumns = mergedColumns1.reduce((acc, cur) => {
    const depth = cur.depth
    if (!acc[depth]) {
      acc[depth] = []
    }
    acc[depth].push(cur)
    return acc
  }, [] as FlattedTableColumnItemData[][])

  const getStickyColProps = useLatestCallback((column) => {
    const { rightStickyWidth, leftStickyWidth, align } = column
    const sticky =
      canScroll &&
      (typeof rightStickyWidth !== 'undefined' || typeof leftStickyWidth !== 'undefined')

    const style: React.CSSProperties = {
      textAlign: align,
    }

    if (sticky) {
      style.position = 'sticky'
      style.right = rightStickyWidth + 'px'
      style.left = leftStickyWidth + 'px'
      // the value is same with v3
      style.zIndex = 5
    }

    return {
      style,
      'data-sticky': setAttrStatus(sticky),
    }
  })

  const getTableHeaderProps = React.useCallback(() => {
    const style: React.CSSProperties = {
      position: sticky ? 'sticky' : 'relative',
      top: sticky ? stickyTop : undefined,
      boxShadow: maxHeight ? '0px 2px 6px 0px rgba(0,0,0,0.12)' : undefined,
      overflow: 'hidden',
      zIndex: sticky ? 10 : undefined,
    }

    return {
      style,
      'data-sticky': setAttrStatus(sticky),
    }
  }, [sticky, stickyTop, maxHeight])

  const isTreeView = useMemo(() => {
    return isArrayNonEmpty(data)
      ? data.some((row) => {
          // @ts-ignore
          return (row.children && row.children.length) || (onLoadChildren && !row.isLeaf)
        })
      : false
  }, [data, onLoadChildren])

  const [activeSorterColumn, setActiveSorterColumn] = useState<string | null>(null)
  const [activeSorterType, setActiveSorterType] = useState<string | null>(null)

  //* *************** 根据排序列处理数据 ************** *//

  const showData = useMemo(() => {
    let _data = transitionData.concat()

    if (activeSorterColumn) {
      const sorter =
        columns.filter((d) => d.dataKey === activeSorterColumn)[0] &&
        columns.filter((d) => d.dataKey === activeSorterColumn)[0].sorter
      if (sorter) {
        _data =
          activeSorterType === 'ascend'
            ? [..._data].sort(sorter)
            : [..._data].sort(sorter).reverse()
      }
    }

    return _data
  }, [activeSorterColumn, activeSorterType, transitionData, columns])

  return {
    rootProps,
    scrollWidth,
    activeSorterColumn,
    setActiveSorterColumn,
    activeSorterType,
    setActiveSorterType,
    canScroll,
    maxHeight,
    getTableHeaderProps,
    isErrorRow,
    bodyTableRef,
    scrollBodyElementRef,
    columns: mergedColumns1,
    data: cacheData,
    // transitionData,
    transitionData: showData,
    flattedColumns,
    flattedColumnsWithoutChildren,

    // 行多选
    rowSelection,
    cacheData,
    setMeasureRowElement,
    leafColumns,
    // ui
    // 有表头分组那么也要 bordered
    bordered: flattedColumns.length > columns.length,
    scrollHeaderElementRef,
    errorRowKeys: [],
    // 冻结列
    leftFreezeColumn,
    setLeftFreezeColumn,
    onTableBodyScroll,
    onTableBodyScrollMock,
    scrollSize,
    leftFrozenColKeys,
    rightFrozenColKeys,
    leftFixedColumnsWidth,
    rightFixedColumnsWidth,
    ...scrollSize,
    getColgroupProps,
    getStickyColProps,
    // 行高亮
    onHighlightedRowChange,
    isHighlightedRow,
    highlightedRowKeys,
    trySetHighlightedRowKeys,
    // 行 hover
    showRowHighlight,
    // 列高亮
    onHighlightedColChange,
    isHighlightedCol,
    highlightedColKeys,
    trySetHighlightedColKeys,
    // 列 hover
    showColHighlight,
    isHoveredHighlightCol,
    onHoveredColChange,
    // 行拖拽
    draggable,
    highlightColumns: [] as any,
    dragRowRef,
    onDrop,
    groupedColumns,
    // 子树展开
    onExpandTreeRowsChange,
    isExpandTreeRows,
    isLoadingTreeNodeId,
    onTreeNodeSwitch,
    resizable,
    colWidths,
    onColumnResizable,
    isTree: isTreeView,
    cellRender,
    showColMenu,
    onLoadChildren,
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
   *  树形表格展开的行（受控）
   */
  expandedRowKeys?: React.ReactText[]
  /**
   *  树形表格默认展开的行
   */
  defaultExpandedRowKeys?: React.ReactText[]
  /**
   *  树形表格展开时的回调函数
   */
  onExpand?: (expandIds: React.ReactText[], targetRow: TableRowEventData, expanded: boolean) => void
  /**
   *  表格最大高度，当穿过该高度时，展示滚动条且表头固定
   */
  maxHeight?: number
  /**
   *  表格列冻结默认设置，为 string 时仅支持从左侧冻结至某一列
   */
  defaultFixedToColumn?: TableFrozenColumnOptions
  /**
   *  表格列冻结设置，为 string 时仅支持从左侧冻结至某一列
   */
  fixedToColumn?: TableFrozenColumnOptions
  /**
   *  表格列冻结设置时回调
   */
  onFixedToColumn?: (fixedToColumn: TableFrozenColumnOptions) => void
  /**
   *  表格分页配置项
   */
  pagination?: PaginationProps
  /**
   *  错误列（受控）
   */
  errorRowKeys?: React.ReactText[]
  /**
   *  高亮行（受控）
   */
  highlightedRowKeys?: React.ReactText[]
  /**
   *  行可选（受控）
   */
  rowSelection?: TableRowSelection
  /**
   *  是否支持列操作
   */
  showColMenu?: boolean
  /**
   *  是否集成控制面板功能
   */
  setting?: boolean
  /**
   *  是否能够动态控制列宽
   */
  resizable?: boolean
  /**
   * 是否支持虚拟滚动，
   * 列宽：column设置的width或200作为宽度，内容区填充不满时，宽度等比分配。
   * 滚动区域高度：使用maxHeight或300作为虚拟列表高度区域
   * TODO：
   * -可展开的内嵌面板
   * -支持拖拽排序
   * -支持列拖拽
   * -Row：onDoubleClick
   * -Cell: colspan，rowspan
   * -统计：平局行，总数行
   */
  virtual?: boolean
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
   *  表格某一行 `hover` 时，该行高亮
   */
  showRowHighlight?: boolean
  /**
   *  表格某一行被双击时，该行高亮
   */
  highlightRowOnDoubleClick?: boolean
  /**
   *  表格行可拖拽
   */
  draggable?: boolean
  /**
   * 唯一 id 前缀，废弃
   */
  uniqueId?: string
  /**
   * 开始拖拽时触发
   */
  onDragStart?: (
    evt: React.DragEvent,
    option: {
      dragNode: object
    }
  ) => void
  /**
   * 拖拽行放开时触发
   */
  onDrop?: (
    evt: React.DragEvent,
    option: {
      dragNode: object
      dropNode: object
      dataStatus: { after: object }
      // level: { before: number; after: number }
    }
  ) => boolean | Promise<any>
  /**
   * 拖拽成功时触发
   */
  onDropEnd?: (option: {
    dragNode: object
    dropNode: object
    dataStatus: { after: object }
  }) => void
  /**
   * 初始时展开所有行
   */
  defaultExpandAll?: boolean
  /**
   * 全局控制单元格自定义渲染，优先级低于 column 的 render 方法
   */
  cellRender?: (text: any) => React.ReactNode
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (item: TableRowEventData) => Promise<any[] | void> | void
}

export type UseTableReturn = ReturnType<typeof useTable>
