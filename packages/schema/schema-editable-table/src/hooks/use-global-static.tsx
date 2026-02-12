import { useMemo } from 'react'
import { useLatest } from 'ahooks'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import type { FieldConfigType } from '@hi-ui/schema-core'
import { ROW_OPERATION_COL_WIDTH } from '../const'
import type { EditableSchemaTableCtxType, PropsRefType } from '../ctx'

export type GlobalStaticConfigType = {
  /** 是否启用异步数据 */
  enableAsyncData: boolean
  /** 是否为空 */
  isEmpty: boolean
  /** 是否展示表尾 */
  showFooter: boolean
  /** 是否存在粘性 Footer */
  hasStickyFooter: true | undefined
  /** 是否存在嵌套表头 */
  hasNestHeader: boolean
  /** 是否存在左固定列(不包括选择列) */
  hasLeftFixed: boolean
  /** 是否存在右固定列(不包括操作列) */
  hasRightFixed: boolean
  /** 启用行选择偏移 */
  enableRowSelection: boolean
  /** 启用行操作偏移 */
  enableRowOperation: boolean
  /** 启用行编辑 */
  enableRowEdit: boolean
  /** 操作列列宽 */
  operationColWidth: number
  /** 所有可编辑字段的 key */
  editableFieldKeys: string[]
  /** 是否启用分页 */
  enablePagination: boolean
  /** 是否仅在 hover 时显示表头操作 */
  enableHeaderActionHoverOnly: boolean
  /** 是否启用表头过滤 */
  enableFilter: boolean
  /** 表头过滤是否启用远程数据 */
  enableRemoteFilter: boolean
  /** 是否启用表头排序 */
  enableSorter: boolean
  /** 表头排序是否启用远程数据 */
  enableRemoteSorter: boolean
  /** 是否启用行展开 */
  enableRowExpanding: boolean
  /** 是否启用列分组 */
  enableRowGrouping: boolean
  /** 底部容器是否为空 */
  isBottomEmpty: boolean
}

// 此处不关心 TData 类型，所以使用 AnyType
type UseGlobalStaticCtxType = Pick<
  EditableSchemaTableCtxType<AnyType>,
  'table' | 'propsRef' | 'subscription'
> & {
  staticOptsRef: StaticOptsRefType
}

export type PropsStaticOptsType = ReturnType<typeof genStaticOptsFromPropsRef>
/**
 * 从 propsRef 中生成的静态配置的引用
 * @desc 仅用于 globalStaticRef 生成前，生成后则应统一使用 globalStaticRef
 */
export type StaticOptsRefType = ReadonlyRefObject<PropsStaticOptsType>

/**
 * 从 propsRef 中生成静态配置
 * @desc 是 useGlobalStatic 返回值的子集
 * @desc 也就是仅包含能直接从 propsRef 中获取的选项配置
 */
export function genStaticOptsFromPropsRef(propsRef: PropsRefType<AnyType>) {
  // 是否启用异步数据
  const enableAsyncData = !!propsRef.current.asyncData?.request

  // 存在嵌套表头
  const hasNestHeader = !!propsRef.current.fields.some((field) => !!field.children?.length)

  const enableRowSelection = !!propsRef.current?.rowSelection
  const enableRowOperation = !!propsRef.current?.rowOperation

  const enableRowEdit = !!propsRef.current?.rowOperation?.rowEdit

  // 操作列列宽是动态的，需要从配置中取出
  const operationColWidth = propsRef.current?.rowOperation?.width || ROW_OPERATION_COL_WIDTH

  const fields = propsRef.current.fields

  // 分页
  const enablePagination = !!propsRef.current?.pagination

  // 是否存在过滤字段
  const enableFilter = !!propsRef.current.filter && fields.some((field) => !!field.control?.filter)
  // 表头过滤是否启用远程数据
  const enableRemoteFilter = enableAsyncData && enableFilter && !!propsRef.current.filter?.remote
  // 是否存在排序字段
  const enableSorter = !!propsRef.current.sorter && fields.some((field) => !!field.control?.sorter)
  // 表头排序是否启用远程数据
  const enableRemoteSorter = enableAsyncData && enableSorter && !!propsRef.current.sorter?.remote

  // 是否启用行展开
  const enableRowExpanding = !!propsRef.current.expanding
  // 是否启用列分组
  const enableRowGrouping = !!propsRef.current.grouping

  // 底部容器是否为空
  const isBottomEmpty =
    // 没有左侧的行选择指示器
    !propsRef.current.rowSelection?.enableIndicator &&
    // 也没有分页器
    !propsRef.current.pagination

  return {
    enableAsyncData,
    hasNestHeader,
    enableRowSelection,
    enableRowOperation,
    enableRowEdit,
    operationColWidth,
    enablePagination,
    enableHeaderActionHoverOnly: !!propsRef.current.headerAction?.onlyVisibleOnHover,
    enableFilter,
    enableRemoteFilter,
    enableSorter,
    enableRemoteSorter,
    enableRowExpanding,
    enableRowGrouping,
    isBottomEmpty,
  } satisfies Partial<GlobalStaticConfigType>
}

/**
 * 全局静态配置
 * @desc 实际上并不是完全静态，而是指由配置生成后，禁止主动变化
 */
export function useGlobalStatic(ctx: UseGlobalStaticCtxType) {
  const { table, subscription, propsRef } = ctx

  const isEmpty =
    // 表格数据长度为0
    subscription.getValue().length === 0 ||
    // 表格数据过滤后长度为0
    table.getFilteredRowModel().rows.length === 0

  const showFooter = !isEmpty && !!propsRef.current?.showFooter
  const hasStickyFooter = (showFooter && !!propsRef.current?.sticky?.footer) || undefined

  const _columnPinning = table.getState().columnPinning
  const hasLeftFixed = _columnPinning.left !== undefined && _columnPinning.left.length > 0
  const hasRightFixed = _columnPinning.right !== undefined && _columnPinning.right.length > 0

  const fields = propsRef.current.fields
  const editableFieldKeys = useMemo(() => genEditableFieldKeys(fields), [fields])

  const staticOpts = ctx.staticOptsRef.current

  const globalStatic: GlobalStaticConfigType = {
    enableAsyncData: staticOpts.enableAsyncData,
    isEmpty,
    showFooter,
    hasStickyFooter,
    hasNestHeader: staticOpts.hasNestHeader,
    hasLeftFixed,
    hasRightFixed,
    enableRowSelection: staticOpts.enableRowSelection,
    enableRowOperation: staticOpts.enableRowOperation,
    enableRowEdit: staticOpts.enableRowEdit,
    operationColWidth: staticOpts.operationColWidth,
    editableFieldKeys,
    enablePagination: staticOpts.enablePagination,
    enableHeaderActionHoverOnly: staticOpts.enableHeaderActionHoverOnly,
    enableFilter: staticOpts.enableFilter,
    enableRemoteFilter: staticOpts.enableRemoteFilter,
    enableSorter: staticOpts.enableSorter,
    enableRemoteSorter: staticOpts.enableRemoteSorter,
    enableRowExpanding: staticOpts.enableRowExpanding,
    enableRowGrouping: staticOpts.enableRowGrouping,
    isBottomEmpty: staticOpts.isBottomEmpty,
  } as const

  return useLatest(globalStatic) as ReadonlyRefObject<GlobalStaticConfigType>
}

/**
 * 生成所有可编辑字段的 key
 * @desc 仅在可编辑表格中生效
 */
function genEditableFieldKeys(fields: FieldConfigType[]): string[] {
  const result: string[] = []

  const traverse = (field: FieldConfigType) => {
    // 如果有children，递归处理children
    if (field.children?.length) {
      field.children.forEach(traverse)
      return
    }

    const { readonly, editable } = field.control || {}
    // 明确只读，不可编辑
    if (readonly) return
    // 明确不可编辑
    if (editable === false) return

    result.push(field.dataIndex)
  }

  fields.forEach(traverse)

  return result
}
