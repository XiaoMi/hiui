import type { FilterFn, Row } from '@tanstack/react-table'

/**
 * 自定义日期范围筛选函数
 * 用于筛选日期范围内的数据
 */
export const inDateRange: FilterFn<AnyObject> = (
  row: Row<AnyObject>,
  columnId: string,
  filterValue: unknown
): boolean => {
  // 如果没有筛选值或筛选值不完整，则不进行筛选
  if (!filterValue || !Array.isArray(filterValue) || filterValue.length !== 2) return true

  const [start, end] = filterValue
  if (!start || !end) return true

  const value = row.getValue<string>(columnId)
  if (!value) return false

  // 将日期字符串转换为时间戳进行比较
  const valueDate = new Date(value).getTime()
  const startDate = new Date(start).getTime()
  const endDate = new Date(end).getTime()

  return valueDate >= startDate && valueDate <= endDate
}
