import type { TableFeature, Row } from '@tanstack/react-table'
import { EMPTY_VALUE } from '../../const'
import { isEmptyValue } from '../../utils'

/**
 * 自定义分组特性
 * 主要用于处理分组值为null或undefined的情况，将不同类型的空值统一为一个特殊标记
 * 这样所有的空值都会被归为同一组，而不是分散在不同的组中
 */
export const CustomGroupingFeature: TableFeature<unknown> = {
  createRow(row: Row<unknown>) {
    // 保存原始的getGroupingValue方法
    const originalGetGroupingValue = row.getGroupingValue

    // 重写getGroupingValue方法，统一处理空值
    row.getGroupingValue = function (columnId: string) {
      // 获取原始分组值
      const value = originalGetGroupingValue.call(this, columnId)

      // 如果是空值，统一返回特殊标记
      if (isEmptyValue(value)) {
        return EMPTY_VALUE
      }

      return value
    }
  },
}
