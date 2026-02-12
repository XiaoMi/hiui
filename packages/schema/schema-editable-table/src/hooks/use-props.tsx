import { useLatest } from 'ahooks'
import { getBoolConfig } from '@hi-ui/schema-utils'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import type { EditableSchemaTableProps } from '../table'
import type { PropsRefType } from '../ctx'

import {
  // const
  DFT_ROW_SELECTION_TYPE,
  DFT_PAGINATION_PAGE_SIZE,
} from '../const'
import { genStaticOptsFromPropsRef, PropsStaticOptsType } from './use-global-static'

/** 标准化后的 props 类型 */
export type NormalizedProps<T extends AnyObject> = ReturnType<typeof getNormalizedProps<T>>

export function getNormalizedProps<T extends AnyObject>(props: EditableSchemaTableProps<T>) {
  const debugOpts = getBoolConfig(
    props.debug,
    { debugAll: true },
    { mergeDft: false } // 不合并默认值，用户只要传值，就都以用户为准
  )

  // 表头和表尾的 fixed 配置
  const stickyOpts = getBoolConfig(
    props.sticky, // stickyOpts
    { header: true, footer: true },
    { mergeDft: true }
  )

  // 虚拟化配置
  const virtualizeConfig = getBoolConfig(
    props.virtualize,
    { row: true, column: true },
    { mergeDft: true }
  )
  const virtualizeOpts = virtualizeConfig
    ? {
        row: getBoolConfig(virtualizeConfig?.row, {}),
        column: getBoolConfig(virtualizeConfig?.column, {}),
      }
    : undefined

  // 行选择配置
  const rowSelectionConfig = getBoolConfig(
    props.rowSelection,
    { type: DFT_ROW_SELECTION_TYPE },
    { mergeDft: true }
  )
  const rowSelectionOpts = rowSelectionConfig
    ? {
        ...rowSelectionConfig,
        enableIndicator: getBoolConfig(rowSelectionConfig?.enableIndicator, {}),
      }
    : undefined

  // 行操作配置
  const rowOperationOpts = getBoolConfig(props.rowOperation, {})

  // 分页配置
  const paginationOpts = getBoolConfig(
    props.pagination,
    { pageSize: DFT_PAGINATION_PAGE_SIZE },
    { mergeDft: true }
  )

  // 筛选配置
  const filterOpts = getBoolConfig(props.filter, {})
  // 排序配置
  const sorterOpts = getBoolConfig(
    props.sorter,
    {
      sortUndefined: 'last',
    },
    { mergeDft: true }
  )
  const sorterTooltipOpts = getBoolConfig(sorterOpts?.tooltip, {})
  const nextSorterOpts = sorterOpts ? { ...sorterOpts, tooltip: sorterTooltipOpts } : undefined

  // 列分组配置
  const groupingOpts = getBoolConfig(props.grouping, {})
  // 行展开配置
  // 如果列分组配置存在，则行展开配置默认开启
  const expandingOpts = getBoolConfig(props.expanding ?? !!groupingOpts, {})

  return {
    ...props,
    subRowKey: props.subRowKey || 'children',
    debug: debugOpts,
    sticky: stickyOpts,
    virtualize: virtualizeOpts,
    rowSelection: rowSelectionOpts,
    rowOperation: rowOperationOpts,
    pagination: paginationOpts,
    filter: filterOpts,
    sorter: nextSorterOpts,
    grouping: groupingOpts,
    expanding: expandingOpts,
  }
}

export function usePropsRef<T extends AnyObject>(props: EditableSchemaTableProps<T>) {
  const nextProps = getNormalizedProps(props)
  const propsRef = useLatest(nextProps) as ReadonlyRefObject<NormalizedProps<T>> as PropsRefType<T>

  // 把只依赖 propsRef 的选项配置提前到此处生成
  const staticOpts = genStaticOptsFromPropsRef(propsRef)
  const staticOptsRef = useLatest(staticOpts) as ReadonlyRefObject<PropsStaticOptsType>

  return { propsRef, staticOptsRef }
}
