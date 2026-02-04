import type { BuiltInFilterFn as TanStackBuiltInFilterFn } from '@tanstack/react-table'
import type { FieldConfigType, ValueTypePresets, FieldFilterConfigType } from '@hi-ui/schema-core'
import type { FilterType } from '@hi-ui/table-extensions'
import { mergeValues } from '@hi-ui/schema-utils'

export type BuiltInFilterFn = TanStackBuiltInFilterFn | 'inDateRange'

const typeMap: Partial<Record<ValueTypePresets, FilterType>> = {
  text: 'text',
  select: 'select',
  'check-select': 'select',
  tag: 'select',
  number: 'number',
  date: 'date',
}

const fnMap: Partial<Record<FilterType, BuiltInFilterFn>> = {
  text: 'includesString',
  select: 'arrIncludesSome',
  number: 'inNumberRange',
  date: 'inDateRange',
  custom: 'includesString',
}

export function getFilterConfig(field: FieldConfigType): FieldFilterConfigType | undefined {
  const filterConfig = field.control?.filter
  if (!filterConfig) return undefined

  const valueType = field.valueType as ValueTypePresets
  const matchedType = typeMap[valueType] || 'text'

  // 布尔值只返回默认配置
  if (typeof filterConfig === 'boolean') {
    return {
      type: matchedType,
      filterFn: fnMap[matchedType] as BuiltInFilterFn,
    }
  }
  // 对象类型，返回合并后的用户配置
  else {
    let type = (filterConfig.type || matchedType) as keyof typeof fnMap
    // 如果用户传入了自定义的过滤器，则使用 custom 类型
    if (filterConfig.custom) type = 'custom'

    // 总而言之，言而总之
    // type 经过上述处理后，已经可以完全确认取值，因此保留最高优先级
    // 也就是说，type 的优先级为：(存在自定义筛选器，取custom) > (存在type，取type) > 字段类型匹配 > 默认取text
    // filterFn 仅经过默认匹配，因此允许被 filterConfig 中的覆盖
    const dft: FieldFilterConfigType = { filterFn: fnMap[type] as BuiltInFilterFn }
    return mergeValues(dft, filterConfig, { type })
  }
}
