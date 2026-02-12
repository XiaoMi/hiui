import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { FieldConfigType } from '@hi-ui/schema-core'
import { getFilterConfig } from '../features/filter'
import { getSorterConfig } from '../features/sorter'
import { getGroupingConfig } from '../features/column-grouping'
import type { PropsRefType } from '../ctx'

export function MapFieldConfigToColumnDef<TData extends AnyObject>(
  fields: FieldConfigType[],
  ctx: { propsRef: PropsRefType<TData> }
): ColumnDef<TData>[] {
  const { propsRef } = ctx

  return fields.map((field) => {
    const filterConfig = getFilterConfig(field)
    const sorterConfig = getSorterConfig(field, { propsRef: propsRef as PropsRefType<AnyObject> })
    const groupingConfig = getGroupingConfig(field)

    // dataIndex 是必填项，否则无法正确渲染表格
    // NOTE header 采用复杂单元格渲染后，dataIndex 必填，否则会直接导致表格崩溃
    // 也就是说，打开下面 [header: field.title,] 这行的注释后，dataIndex 也可以不填[doge]
    if (!field.dataIndex) {
      const fieldName = field._titleText || field.title || field.key
      console.error(
        `EditableSchemaTable: 字段【${fieldName}】缺少 dataIndex 属性，请检查后补充！\n`
      )
    }

    return {
      // header: field.title,
      accessorKey: field.dataIndex,
      size: field.wrapperProps?.width,
      columns: field.children ? MapFieldConfigToColumnDef(field.children, ctx) : undefined,
      filterFn: filterConfig?.filterFn,
      sortingFn: sorterConfig?.sortingFn,
      sortUndefined: sorterConfig?.sortUndefined,
      aggregationFn: groupingConfig?.aggregationFn, // count
      meta: {
        field,
        ...field.control,
        filter: filterConfig,
        sorter: sorterConfig,
        grouping: groupingConfig,
        shouldUpdate: field.payload?.shouldUpdate,
      },
      // TODO 待确认还有其他的能直接透传给 ColumnDef 的属性
    } as ColumnDef<TData>
  })
}

type UseTableColumnsCtxType<TData extends AnyObject> = {
  propsRef: PropsRefType<TData>
}

export function useTableColumns<TData extends AnyObject>(ctx: UseTableColumnsCtxType<TData>) {
  const { propsRef } = ctx
  const { fields } = propsRef.current

  return useMemo(() => {
    const cols = MapFieldConfigToColumnDef<TData>(fields, { propsRef })
    return cols
  }, [fields, propsRef])
}
