import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import {
  HeaderRowFunc,
  RowSelection,
  TableColumnItem,
  TableDataSource,
  TableFixedOptions,
} from './types'
import { PaginationProps } from '@hi-ui/pagination'
import {
  cloneTree,
  deleteNodeById,
  fFindNodeById,
  findNodeById,
  flattenTree,
  insertNodeById,
} from '@hi-ui/tree-utils'
import { useLatestCallback } from '@hi-ui/use-latest'
import {
  deleteRowByKey,
  getMaskItemsWIdth,
  parseFixedColumns,
  setColumnsDefaultWidth,
  setRowByKey,
} from './utils'
import { isArrayNonEmpty, isFunction, isPromise } from '@hi-ui/type-assertion'
import { useCheck, useSelect } from '@hi-ui/use-check'

const DEFAULT_COLUMNS = [] as []
const DEFAULT_DATA = [] as []
const DEFAULT_ERROR_ROW_KEYS = [] as []
const DEFAULT_HIGHLIGHTED_ROW_KEYS = [] as []
const DEFAULT_HIGHLIGHTED_COL_KEYS = [] as []

// const DEFAULT_FIELD_KEY = 'key'

const STANDARD_PRESET = {
  showColMenu: true,
  sticky: true,
  bordered: true,
  setting: true,
  striped: true,
}

const DEFAULT_DRAG_INFO = {
  dragKey: undefined,
  dropKey: undefined,
  rowData: undefined,
  dropRowData: undefined,
}

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
  rowExpandable,
  hiddenColKeys,
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
  const firstRowRef = useRef<HTMLTableRowElement>(null)

  const disabledDataRef = useRef([])

  const [fixedColWidth, setFixedColWidth] = useState<number[]>([])

  const [colWidths, setColWidths] = useState(() => {
    return columnsProp.map((c) => c.width || 'auto')
  })

  // 获取列宽的处理
  useEffect(() => {
    disabledDataRef.current = []

    // TODO: why don't dataSource
    if (!dataSource) {
      if (firstRowRef.current) {
        const _realColumnsWidth = Array.from(firstRowRef.current.childNodes).map((node) => {
          return (node as HTMLElement).clientWidth
        })

        setColWidths(_realColumnsWidth)
      }
    }
  }, [columnsProp, dataSource, data])

  /**
   * 获取 key 字段值
   */
  const getKeyField = React.useCallback((item: any) => item[fieldKey], [fieldKey])

  // ********************** cache *********************** //

  const [cacheData, setCacheData] = useState(data)
  const [columns, setColumns] = useState(columnsProp)

  // ********************** 展开收起 *********************** //

  /**
   * 树形节点展开
   */
  const [expandTreeRows, trySetExpandTreeRows] = useUncontrolledState(
    [],
    expandRowKeysProp,
    onExpand
  )

  const [onExpandTreeRowsChange, isExpandTreeRows] = useCheck({
    checkedIds: expandTreeRows,
    onCheck: trySetExpandTreeRows as any,
    idFieldName: 'key',
  })

  /**
   * 行内嵌面板展开
   */
  const [expandEmbedRows, trySetExpandEmbedRows] = useUncontrolledState(
    [],
    expandEmbedRowKeysProp,
    onEmbedExpand
  )

  const [onExpandEmbedRowsChange, isExpandTreeRows] = useCheck({
    checkedIds: expandTreeRows,
    onCheck: trySetExpandEmbedRows as any,
    idFieldName: 'key',
  })

  useEffect(() => {
    if (firstRowRef.current && fixedToColumn) {
      const fixedToIndex = columnsProp.findIndex((c) => c.dataKey === fixedToColumn)

      const _fixedColsWidth = Array.from(firstRowRef.current.childNodes)
        .map((node) => {
          const _node = node as HTMLElement
          return _node.getBoundingClientRect().width
        })
        .slice(0, fixedToIndex + 1)

      setFixedColWidth(_fixedColsWidth)
    }
  }, [columnsProp, data, fixedToColumn])

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
  const flattedColumns = useMemo(() => {
    const clonedColumns = cloneTree(columns)
    // TODO: flattenTree 支持不带 id 的
    // TODO: 支持多级表头
    // @ts-ignore
    return flattenTree(clonedColumns, (node) => {
      return { ...node }
    })
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

  // row Selection 做为 column 插入，而不是在代码里魔改 冻结列

  // 同步滚动条
  const headerTableRef = useRef(null)
  const stickyHeaderRef = useRef(null)
  const leftFixedBodyTableRef = useRef(null)
  const rightFixedBodyTableRef = useRef(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const bodyTableRef = useRef<HTMLTableElement>(null)

  // 固定列的宽度
  const {
    leftFixedColumnsWidth,
    rightFixedColumnsWidth,
    scrollHeight,
    scrollLeft,
  } = React.useMemo(() => {
    let leftFixedColumnsWidth = 0
    let rightFixedColumnsWidth = 0
    leftFixedColumnsWidth = getMaskItemsWIdth(leftFrozenColKeys)
    rightFixedColumnsWidth = getMaskItemsWIdth(rightFrozenColKeys)

    // mutationObserver
    const tableWidth = tableRef.current?.getBoundingClientRect().width ?? 0
    const tableBodyWidth = bodyTableRef.current?.getBoundingClientRect().width ?? 0

    return {
      leftFixedColumnsWidth,
      rightFixedColumnsWidth,
      scrollRight: tableWidth - tableBodyWidth,
      scrollLeft: 0,
    }
  }, [leftFrozenColKeys, rightFrozenColKeys])

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

  console.log('hoveredColKey', hoveredColKey)

  const [hoverRow, setHoverRow] = useState(null)

  // 分页
  const { current, onChange: onPageChange } = pagination || {}
  const [currentPage, trySetCurrentPage] = useUncontrolledState(1, current, onPageChange)

  const [serverTableConfig, setServerTableConfig] = useState({
    data: [],
    columns: [...columnsProp],
  })

  // useEffect(() => {
  //   if (dataSource) {
  //     const fetchConfig = dataSource(currentPage)

  //     axios(fetchConfig).then((res) => {
  //       setServerTableConfig(Object.assign({}, serverTableConfig, { data: res.data }))
  //     })
  //   }
  // }, [dataSource, currentPage])

  const [eachRowHeight, setEachRowHeight] = useState({})
  const loadChildren = useRef(null)

  // 有表头分组那么也要 bordered
  const bordered = borderedProp || flattedColumns.length > columns.length

  const [scrollSize, setScrollSize] = useState({ scrollLeft: 0, scrollRight: 1 })

  // 需要右对齐的列
  const alignRightColumns = columns.filter((c) => c.align === 'right').map((col) => col.dataKey)

  const baseTable = useRef(null)

  // 计算固定列的宽度
  // useEffect(() => {
  //   let left = getMaskItemsWIdth(leftFrozenColKeys)
  //   const right = getMaskItemsWIdth(rightFrozenColKeys)

  //   if (left > 0 && (rowSelection || expandedRender)) {
  //     // TODO: 魔法数字
  //     left += 50
  //   }

  //   setFixedColumnsWidth({ left, right })

  //   const tableWidth = tableRef.current?.getBoundingClientRect().width ?? 0
  //   const bodyWidth = bodyTableRef.current?.getBoundingClientRect().width ?? 0

  //   setScrollSize({ scrollRight: tableWidth - bodyWidth, scrollLeft: 0 })
  // }, [leftFrozenColKeys, rightFrozenColKeys, expandedRender, rowSelection])

  // 新增滚动优化
  const syncScrollLeft = (scrollLeft: number, syncTarget: any) => {
    let scrollRight = scrollSize.scrollRight
    if (syncTarget && syncTarget.scrollLeft !== scrollLeft) {
      syncTarget.scrollLeft = scrollLeft
    }

    if (
      tableRef &&
      tableRef.current &&
      bodyTableRef &&
      bodyTableRef.current &&
      rightFrozenColKeys
    ) {
      const { right: tableTefRight } = tableRef.current.getBoundingClientRect()
      const { right } = bodyTableRef.current.getBoundingClientRect()
      scrollRight = tableTefRight - right
    }
    setScrollSize({ scrollLeft, scrollRight })
  }

  const syncScrollTop = (scrollTop: number, syncTarget: any) => {
    if (syncTarget && syncTarget.scrollTop !== scrollTop) {
      syncTarget.scrollTop = scrollTop
    }
  }

  return {
    columns,
    data: cacheData,
    flattedColumns,
    flattedColumnsWithoutChildren,
    fixedColWidth,
    rowSelection,
    cacheData,
    firstRowRef,
    currentPage,
    trySetCurrentPage,
    errorRowKeys: [],
    // 冻结列
    freezeColKeys,
    setFreezeColKeys,
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
    alignRightColumns,

    dragRowRef,
    onDrop,

    // alignLeftColumns,
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
const useColsOperate = ({
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
  const hiddenColKeys = _hiddenColKeys.filter((key) => key != null)
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
    setDragRowKey: () => {},
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
  rowSelection?: RowSelection
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
