import React from 'react'
import type {
  Table,
  TableOptions,
  RowSelectionState,
  PaginationState,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table'
import type { SetState } from 'ahooks/es/useSetState'
import type { SubscriptionType } from '@hi-ui/use-subscription'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import type { TableRowController } from './features/row-controller'
import type { TableCtxRefType } from './table'
import type { NormalizedProps } from './hooks/use-props'
import type { GlobalStaticConfigType } from './hooks/use-global-static'
import type { GlobalStaticActionsType } from './hooks/use-global-actions'

export type EditableSchemaTableCtxType<TData extends AnyObject = AnyObject> = {
  table: Table<TData>
  setDynamicOpts: SetState<Partial<TableOptions<TData>>>
  subscription: SubscriptionType<TData[]>
  /** 虚拟滚动依赖的可滚动的容器元素 */
  tableContainerRef: React.RefObject<HTMLDivElement>
  /** 行操作控制器 */
  rowActions: TableRowController<TData>
  /** 行选择状态 */
  rowSelectionState: SubscriptionType<RowSelectionState>
  /** 分页状态 */
  paginationState: SubscriptionType<PaginationState>
  /** 筛选状态 */
  filterState: SubscriptionType<ColumnFiltersState>
  /** 排序状态 */
  sorterState: SubscriptionType<SortingState>
  /** 组件 props 的最新值 */
  propsRef: ReadonlyRefObject<NormalizedProps<TData>>
  /** 全局静态配置 */
  globalStaticRef: ReadonlyRefObject<GlobalStaticConfigType>
  /** 全局静态函数 */
  globalActionsRef: ReadonlyRefObject<GlobalStaticActionsType<TData>>
  /** 获取内部暴露给外部的值 */
  exposeCtxValueRef: ReadonlyRefObject<() => TableCtxRefType<TData>>
}

export const EditableSchemaTableCtx = React.createContext<EditableSchemaTableCtxType>(
  null as unknown as EditableSchemaTableCtxType
)

export function useEditableSchemaTableCtx<TData extends AnyObject = AnyObject>() {
  const ctx = React.useContext(EditableSchemaTableCtx)
  if (!ctx) throw new Error('useEditableSchemaTableCtx must be used within a EditableSchemaTable')
  return ctx as EditableSchemaTableCtxType<TData>
}

type EditableSchemaTableInnerRefType<TData extends AnyObject> = ReadonlyRefObject<
  EditableSchemaTableCtxType<TData>
>

type EditableSchemaTablePropsRefType<TData extends AnyObject> =
  EditableSchemaTableCtxType<TData>['propsRef']

type EditableSchemaTableGlobalStaticConfigType<TData extends AnyObject> =
  EditableSchemaTableCtxType<TData>['globalStaticRef']

export {
  EditableSchemaTableCtx as EditTableCtx,
  useEditableSchemaTableCtx as useEditTableCtx,
  type EditableSchemaTableCtxType as EditTableCtxType,
  type EditableSchemaTableInnerRefType as InnerRefType,
  type EditableSchemaTablePropsRefType as PropsRefType,
  type EditableSchemaTableGlobalStaticConfigType as GlobalStaticRefType,
}
