import { getBoolConfig, localCompare } from '@hi-ui/schema-utils'
import type { Row, BuiltInSortingFn as TanStackBuiltInSortingFn } from '@tanstack/react-table'
import type { FieldConfigType, FieldSorterConfigType } from '@hi-ui/schema-core'
import { PropsRefType } from '../../ctx'

export type BuiltInSortingFn = TanStackBuiltInSortingFn | 'textLocalCompare'

export function getSorterConfig(
  field: FieldConfigType,
  ctx: { propsRef: PropsRefType<AnyObject> }
): FieldSorterConfigType | undefined {
  const sorterConfig = field.control?.sorter
  if (!sorterConfig) return undefined

  const { propsRef } = ctx
  const { sorter: tableSorterConfig } = propsRef.current

  const config = getBoolConfig(
    sorterConfig,
    {
      sortingFn: 'textLocalCompare',
    },
    {
      mergeDft: true,
    }
  )

  if (config) {
    // 如果配置为 textLocalCompare，则使用内置的 textLocalCompare 函数
    if (config.sortingFn === 'textLocalCompare') config.sortingFn = textLocalCompare

    // 如果字段配置了 sortUndefined，则优先使用字段配置的 sortUndefined
    // 否则使用表格配置的 sortUndefined
    config.sortUndefined = config.sortUndefined || tableSorterConfig?.sortUndefined
  }

  return config
}

function textLocalCompare<TData extends AnyObject = AnyObject>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string
) {
  try {
    const a = rowA.getValue(columnId)
    const b = rowB.getValue(columnId)

    return localCompare(a, b)
  } catch (error) {
    console.log('textLocalCompare', error)
    return 0
  }
}
