import { getBoolConfig } from '@hi-ui/schema-utils'
import type { FieldConfigType, FieldGroupingConfigType } from '@hi-ui/schema-core'

export function getGroupingConfig(field: FieldConfigType): FieldGroupingConfigType | undefined {
  const groupingConfig = field.control?.grouping
  if (!groupingConfig) return undefined

  const config = getBoolConfig(
    groupingConfig,
    {
      aggregationFn: 'count',
    },
    {
      mergeDft: true,
    }
  )

  return config
}
