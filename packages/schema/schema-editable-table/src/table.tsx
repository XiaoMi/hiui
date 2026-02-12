import React, { useMemo, useRef } from 'react'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { useSetState } from 'ahooks'
import type { TableMeta, TableOptions } from '@tanstack/react-table'
import type { StandardProps } from 'ahooks/es/useControllableValue'
import { useSubscription } from '@hi-ui/use-subscription'
import { EditableControlProvider } from '@hi-ui/schema-fields'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { UseFieldMapOpts } from '@hi-ui/schema-fields'
import type { BoolConfig } from '@hi-ui/schema-utils'
import { EditableSchemaTableCtx, type EditableSchemaTableCtxType, type InnerRefType } from './ctx'
import { cls, clsPrefix } from './utils/cls'
import { TableContainer, BottomRender } from './container/index'
import Header from './header/index'
import Body from './body/index'
import Footer from './footer/index'
import Cell, { HeaderCell, FooterCell, AggregatedCell } from './cell/index'
import { usePropsRef } from './hooks/use-props'
import { useTableColumns } from './hooks/use-table-columns'
import { useTableUpdate } from './hooks/use-update'
import { useTableInnerCtx } from './hooks/use-inner-ctx'
import { useGlobalStatic } from './hooks/use-global-static'
import { useGlobalStaticActions, type GlobalStaticActionsType } from './hooks/use-global-actions'
import { useTableMeta } from './hooks/use-table-meta'
import * as Features from './features/_overrides'
import { AsyncDataGetter } from './features/async-data/getter'
import { useGetFieldsValue, useGetGroupedValues } from './hooks/use-get-fields-value'
import { useInitialColumnState } from './features/column-state'
import { TableRowController } from './features/row-controller'
import { useRowSelectionState, type RowSelectionOptsType } from './features/row-selection'
import { useRowSelectionOpts } from './features/row-selection/hooks'
import { usePaginationOpts, usePaginationState, type PaginationProps } from './features/pagination'
import { useFilterState } from './features/filter/index'
import { useFilterOpts, type FilterOpts } from './features/filter/use-opts'
import { useSorterState } from './features/sorter/index'
import { useSorterOpts, type SorterOpts } from './features/sorter/use-opts'
import { useRowExpandedOpts, type ExpandedOpts } from './features/row-expanding'
import { useRowGroupedOpts, type GroupingOpts } from './features/column-grouping'
import type { CustomCellType } from './cell/index'
import type { AsyncDataOptsType } from './features/async-data'
import type { RowOperationOptsType } from './features/row-operation'
import type { TableStickyOpts, VirtualizeConfig } from './container/index'
import type { HeaderActionOptsType } from './features/header-actions'
import type { BottomRenderConfigType } from './container/bottom'
import type { EditTableBodyProps, OnBodyRowMountedFn } from './body'
import './index.scss'

/** 对外暴露的表格上下文类型 */
// @doc-comment-start code-block
// ---
// title: TableCtxRefType
// api:
//   for: editable-table.basic
//   order: 20
// ---
export type TableCtxRefType<TData extends AnyObject = AnyObject> = Pick<
  EditableSchemaTableCtxType<TData>,
  'table' | 'subscription' | 'rowActions'
> & {
  /** 触发内部重渲染 */
  rerender: () => void
  /** 获取所有可编辑字段的值 */
  getFieldsValue: ReturnType<typeof useGetFieldsValue<TData>>
  /** 获取分组后的所有可编辑字段的值和只读字段的值 */
  getGroupedValues: ReturnType<typeof useGetGroupedValues<TData>>
  /** 滚动到顶部 */
  scrollIntoView: (behavior?: ScrollBehavior) => void
  /** 获取异步数据源（仅获取数据） */
  getDataSource: GlobalStaticActionsType<TData>['getDataSource']
  /** 更新异步数据源（获取数据并更新表格） */
  updateDataSource: GlobalStaticActionsType<TData>['updateDataSource']
  /** 重置分页、筛选状态 */
  resetDataSource: GlobalStaticActionsType<TData>['resetDataSource']
  /**
   * 设置表格数据源
   * - 本质是调用 subscription.setValue
   * - 支持直接传入新值或者取值函数
   * - 调用后将直接全量更新内部数据，并触发重渲染
   * - 若有开启 enableForceRerender 还会触发强制重渲染
   */
  setDataSource: GlobalStaticActionsType<TData>['setDataSource']
  /**
   * 获取单元格值
   * - 本质是调用 table.options.meta.getCellValue
   */
  getCellValue: TableMeta<TData>['getCellValue']
  /**
   * 设置单元格值
   * - 本质是调用 table.options.meta.updateData
   */
  setCellValue: TableMeta<TData>['updateData']
  /**
   * 设置行选择状态
   * - 传入数组时，选中指定行
   * - 传入 null 时，清空所有选中的行
   * - 传入函数时，调用者可获取当前选中的rowKeys，并自行返回新的rowKeys
   * - 传入函数时，返回 null 也可清空所有选中的行
   */
  setSelectedRowKeys: GlobalStaticActionsType<TData>['setSelectedRowKeys']
  /**
   * 完整的内部上下文引用
   * @desc 一般不应被外部读取，除非明确知道用途
   */
  innerRef: InnerRefType<TData>
}
// @doc-comment-end code-block

type TableDebugOpts<T extends AnyObject> = Pick<
  TableOptions<T>,
  'debugAll' | 'debugColumns' | 'debugHeaders' | 'debugCells' | 'debugRows' | 'debugTable'
>

// @doc-comment-start code-block
// ---
// title: EditTableProps
// api:
//   for: editable-table.basic
//   order: 10
// ---
export type EditableSchemaTableProps<TData extends AnyObject = AnyObject> = UseFieldMapOpts &
  Partial<StandardProps<TData[]>> & {
    fields: FieldConfigType[]
    asyncData?: AsyncDataOptsType<TData>
    innerCtxRef?: React.RefObject<TableCtxRefType<TData>>
    onValuesChange?: (changedValues: Record<number, Partial<TData>>, allValues: TData[]) => void
    getRowStyle?: EditTableBodyProps<TData>['getRowStyle']
    /** 是否默认激活全部可编辑单元格 */
    defaultActive?: boolean
    /** 是否固定表头和表尾 */
    sticky?: BoolConfig<TableStickyOpts>
    /** 虚拟化配置 */
    virtualize?: BoolConfig<VirtualizeConfig>
    /** 是否展示表尾 */
    showFooter?: boolean
    /** 调试配置 */
    debug?: BoolConfig<TableDebugOpts<TData>>
    /**
     * 是否开启强制重渲染
     * - 通常用在存在复杂的表格行数据操作时
     * - 启用后会在内部触发完全更新(即subscription.setValue)时，重新渲染整个表格
     * - 原理是给表格顶层容器增加了 key 属性，从而触发整个表格的重新渲染
     */
    enableForceRerender?: boolean
    /**
     * 行唯一标识
     * @desc 会根据行数据，取出【rowKey】的值作为唯一标识
     * @desc 用于行选择、行操作等功能，默认使用【数组索引】作为唯一标识
     * @desc 会在行 DOM 上增加 data-id 属性
     * @desc 仅做展示时可不传，开启【行选择】【分页】等依赖行唯一标识的功能时，则必须传入
     */
    rowKey?: string
    /**
     * 子行在父行中的取值字段
     * @desc 会从指定字段中取出【子行数据】
     * @desc 用于树形表格，默认使用【children】作为子行取值字段
     */
    subRowKey?: string
    /** 行选择配置 */
    rowSelection?: BoolConfig<RowSelectionOptsType<TData>>
    /** 行操作配置 */
    rowOperation?: BoolConfig<RowOperationOptsType<TData>>
    /** 是否开启只读模式 */
    readonly?: boolean
    /** 分页配置 */
    pagination?: BoolConfig<PaginationProps>
    /** 表头操作配置 */
    headerAction?: HeaderActionOptsType
    /** 筛选配置 */
    filter?: BoolConfig<FilterOpts>
    /** 排序配置 */
    sorter?: BoolConfig<SorterOpts>
    /** 行展开配置 */
    expanding?: BoolConfig<ExpandedOpts>
    /** 列分组配置 */
    grouping?: BoolConfig<GroupingOpts>
    /** 是否显示边框 */
    bordered?: boolean
    /** 底部的渲染配置 */
    bottom?: BottomRenderConfigType
    /**
     * 自定义单元格渲染
     * - 目前仅开放聚合单元格
     */
    customCell?: CustomCellType<TData>
    /** 自定义默认列配置 */
    defaultColumn?: TableOptions<TData>['defaultColumn']
    /** 自定义表格功能 */
    features?: TableOptions<TData>['_features']
    /** 自定义表格容器样式 */
    wrapperStyle?: React.CSSProperties
    /** 内部事件的集中入口 */
    on?: {
      /** 行挂载后触发 */
      rowMounted?: OnBodyRowMountedFn<TData>
    }
    /** 自定义 react-table 引擎选项 */
    customEngineOpts?: Partial<TableOptions<TData>>
  }
// @doc-comment-end code-block

export function EditableSchemaTable<TData extends AnyObject>(
  props: EditableSchemaTableProps<TData>
) {
  // propsRef 存在的意义是给内部组件一个统一的 props 引用
  // 避免 props 变化导致的内部 memo 值引用变化
  const { propsRef, staticOptsRef } = usePropsRef(props)
  // innerRef 存在的意义在于简化发生循环依赖时内部的实例对象的引用方式
  // 例如 useReactTable 需要 useRowSelectionOpts 来初始化行选择功能
  // 而 useRowSelectionOpts 又需要用到 table 实例，如果直接引用，则会报【声明之前已使用的块范围变量】的错误
  const innerRef = useRef({}) as InnerRefType<TData>

  // 核心数据订阅
  const tableValue = useSubscription<TData[]>(props.value ?? props.defaultValue ?? [])
  // 订阅表格级别的数据变化，自动触发重渲染
  const { rerender, forceRerenderFlag } = useTableUpdate(tableValue)

  // 表格列配置
  const columns = useTableColumns<TData>({ propsRef })
  // 初始化列状态
  const initialState = useInitialColumnState(props)
  // 分页配置
  const { paginationState } = usePaginationState({ propsRef, subscription: tableValue })
  const paginationOpts = usePaginationOpts({ innerRef, staticOptsRef })
  // 筛选配置
  const { filterState } = useFilterState()
  const filterOpts = useFilterOpts<TData>({ innerRef, staticOptsRef })
  // 排序配置
  const { sorterState } = useSorterState()
  const sorterOpts = useSorterOpts({ innerRef, staticOptsRef, propsRef })
  // 行展开配置
  const rowExpandedOpts = useRowExpandedOpts<TData>({ staticOptsRef })
  // 列分组配置
  const rowGroupedOpts = useRowGroupedOpts({ staticOptsRef })
  // 表格元数据/操作
  const tableMeta = useTableMeta(tableValue, {
    fieldMap: props.fieldMap,
    onValuesChange: props.onValuesChange,
    innerRef,
  })

  // 行选择功能
  const { rowSelectionState } = useRowSelectionState()
  const rowSelectionOpts = useRowSelectionOpts({
    rowSelection: propsRef.current.rowSelection,
    innerRef,
  })

  // 动态的 table 选项，会由内部组件主动调用
  const [dynamicOpts, setDynamicOpts] = useSetState({} as Partial<TableOptions<TData>>)
  // 核心表格实例
  const table = useReactTable<TData>({
    _features: [
      Features.OverridesFeature,
      Features.CustomGetterFeature,
      Features.CustomRowSelectionFeature,
      Features.CustomAggregatedFeature,
      Features.CustomGroupingFeature,
      ...(propsRef.current.features || []),
    ],
    data: tableValue.getValue(),
    columns,
    defaultColumn: {
      cell: Cell,
      header: HeaderCell,
      footer: FooterCell,
      aggregatedCell: props.customCell?.aggregatedCell ?? AggregatedCell,
      ...propsRef.current.defaultColumn,
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: props.rowKey ? (row) => row[props.rowKey as keyof TData] : undefined,
    getSubRows: (row) => row[propsRef.current.subRowKey],
    ...propsRef.current.debug,
    meta: tableMeta,
    ...rowSelectionOpts,
    ...paginationOpts,
    ...filterOpts,
    ...sorterOpts,
    // 未启用行展开时，会自动禁用子行选择
    // 因此不要修改 rowExpandedOpts 的位置
    ...rowExpandedOpts,
    ...rowGroupedOpts,
    initialState: {
      ...initialState,
      pagination: {
        ...paginationState.getValue(),
        ...(paginationOpts.initialState ? paginationOpts.initialState.pagination : {}),
      },
    },
    ...dynamicOpts, // 动态选项最后传入，会由底层组件修改后触发重渲染
    ...props.customEngineOpts, // 自定义引擎选项，交由用户完全控制
  })

  // 生成全局静态配置
  const _s_ = tableValue // 没啥用，就是太长了取个别名，防止换行
  const globalStaticRef = useGlobalStatic({ table, subscription: _s_, propsRef, staticOptsRef })
  // 生成全局静态函数
  const globalActionsRef = useGlobalStaticActions({ innerRef })

  // 虚拟滚动需要知道可滚动的容器元素
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // 行操作控制器
  const enableRowEdit = globalStaticRef.current.enableRowEdit
  const rowActions = useMemo(
    () => new TableRowController(tableValue, { rowEdit: enableRowEdit, propsRef }),
    [tableValue, enableRowEdit, propsRef]
  )

  // 获取所有可编辑字段的值
  const getFieldsValue = useGetFieldsValue<TData>({ innerRef })
  // 获取分组后的所有可编辑字段的值和只读字段的值
  const getGroupedValues = useGetGroupedValues<TData>({ innerRef })

  // 组装内部上下文
  const { ctxValue, exposeCtxValue } = useTableInnerCtx({
    table,
    setDynamicOpts,
    subscription: tableValue,
    tableContainerRef,
    rowActions,
    rerender,
    rowSelectionState,
    paginationState,
    filterState,
    sorterState,
    propsRef,
    globalStaticRef,
    globalActionsRef,
    getFieldsValue,
    getGroupedValues,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore 仅允许此处赋值
  innerRef.current = ctxValue
  React.useImperativeHandle(props.innerCtxRef, exposeCtxValue)

  // 表头和表尾的 fixed 配置
  const stickyOpts = propsRef.current.sticky

  const TableCtx = EditableSchemaTableCtx as React.Context<EditableSchemaTableCtxType<TData>>
  return (
    <TableCtx.Provider value={ctxValue}>
      <EditableControlProvider readonly={props.readonly || enableRowEdit}>
        <div
          key={props.enableForceRerender ? forceRerenderFlag : undefined}
          className={clsPrefix}
          data-is-empty={globalStaticRef.current.isEmpty}
          data-is-bordered={!!props.bordered}
          data-has-nest-header={globalStaticRef.current.hasNestHeader}
          data-has-sticky-footer={globalStaticRef.current.hasStickyFooter}
          data-has-selection={!!props.rowSelection}
          data-has-operation={!!props.rowOperation}
          data-has-left-fixed={globalStaticRef.current.hasLeftFixed}
          data-has-right-fixed={globalStaticRef.current.hasRightFixed}
          data-has-pagination={globalStaticRef.current.enablePagination}
        >
          <div className={cls('container')} ref={tableContainerRef}>
            <TableContainer virtualize={propsRef.current.virtualize}>
              <TableContainer.Header
                sticky={stickyOpts?.header}
                stickyOffset={stickyOpts?.headerTop}
              >
                <Header />
              </TableContainer.Header>
              <TableContainer.Body>
                <Body getRowStyle={props.getRowStyle} />
              </TableContainer.Body>
              {globalStaticRef.current.showFooter ? (
                <TableContainer.Footer
                  sticky={stickyOpts?.footer}
                  stickyOffset={stickyOpts?.footerBottom}
                >
                  <Footer />
                </TableContainer.Footer>
              ) : null}
            </TableContainer>
          </div>

          <BottomRender key="bottom-container" {...propsRef.current.bottom} />
        </div>

        {/* 监听内部状态变化，并异步获取表格数据 */}
        {globalStaticRef.current.enableAsyncData ? <AsyncDataGetter /> : null}
      </EditableControlProvider>
    </TableCtx.Provider>
  )
}
