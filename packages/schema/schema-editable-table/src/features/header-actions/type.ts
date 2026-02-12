import type { Table, Column } from '@tanstack/react-table'
import type { FieldConfigType } from '@hi-ui/schema-core'

export type FieldCustomHeaderActionsCtxType = {
  /** 字段配置 */
  field: FieldConfigType
  builtin: {
    sorter: React.ReactNode
    filter: React.ReactNode
  }
  /** 表格实例 */
  table: Table<AnyType>
  /** 表格实例 */
  column: Column<AnyType, unknown>
}

export type FieldCustomHeaderActionComponent = React.ComponentType<FieldCustomHeaderActionsCtxType>

export type FieldCustomHeaderActionsFn = (ctx: FieldCustomHeaderActionsCtxType) => React.ReactNode[]

export type HeaderActionOptsType = {
  /** 是否仅在 hover 时显示 */
  onlyVisibleOnHover?: boolean
}
