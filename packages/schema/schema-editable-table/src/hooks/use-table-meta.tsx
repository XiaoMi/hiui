import { get, isEqual } from 'lodash-es'
import type { Table, TableMeta } from '@tanstack/react-table'
import type { Subscription } from '@hi-ui/use-subscription'
import type { EditableSchemaTableProps } from '../table'
import type { InnerRefType } from '../ctx'

type UseTableMetaCtxType<TData extends AnyObject = AnyObject> = {
  fieldMap?: EditableSchemaTableProps<TData>['fieldMap']
  onValuesChange?: EditableSchemaTableProps<TData>['onValuesChange']
  innerRef: InnerRefType<TData>
}

export const useTableMeta = <TData extends AnyObject = AnyObject>(
  tableValue: Subscription<TData[]>,
  ctx: UseTableMetaCtxType<TData>
) => {
  const updateData: TableMeta<TData>['updateData'] = (rowIndex, columnId, value) => {
    const patch = { [rowIndex]: { [columnId]: value } as Partial<TData> }

    // 行编辑模式下，不必检查是否相等，直接写入 draft
    const enableRowEdit = ctx.innerRef.current.globalStaticRef.current.enableRowEdit
    if (enableRowEdit) {
      tableValue.mergeDraft(patch)
      return
    }

    // 普通编辑模式
    const allValues = tableValue.getValue()
    const prevValue = get(allValues, [rowIndex, columnId])

    // 值相等，则不更新
    if (isEqual(prevValue, value)) return

    tableValue.batchMerge(patch).then((result) => {
      if (result) {
        ctx.onValuesChange?.(
          result.changedValues as Record<number, Partial<TData>>,
          result.allValues as TData[]
        )
      }
    })
  }

  const getCellValue: TableMeta<TData>['getCellValue'] = (rowIndex, columnId) => {
    return get(tableValue.getValue(), [rowIndex, columnId])
  }

  return {
    subscription: tableValue,
    fieldMap: ctx.fieldMap,
    updateData,
    getCellValue,
    innerRef: ctx.innerRef,
  } as TableMeta<TData>
}

export function getCellOpFn<TData extends AnyObject = AnyObject>(table: Table<TData>) {
  return {
    getCellValue: table.options.meta?.getCellValue as TableMeta<TData>['getCellValue'],
    setCellValue: table.options.meta?.updateData as TableMeta<TData>['updateData'],
  }
}
