import { Column } from '@tanstack/react-table'

/**
 * 获取列宽
 * @deprecated 已废弃，列宽度状态同步逻辑不完善时的中间方案，目前已经不再使用
 * @param column 列
 * @returns 列宽
 */
export function getColWidth(column: Column<AnyType>) {
  const fieldMetaWidth = column.columnDef.meta?.field?.wrapperProps?.width as number | undefined
  return fieldMetaWidth || column.getSize()
}
