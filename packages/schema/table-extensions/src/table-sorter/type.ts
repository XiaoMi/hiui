import { BoolConfig } from '@hi-ui/schema-utils'
import type { SortDirection as TanStackSortDirection } from '@tanstack/react-table'

export type SortDirection = TanStackSortDirection | null

export type TableSorterProps = {
  /** 当前排序方向 */
  direction?: SortDirection
  /** 排序变化时的回调 */
  onChange?: (direction: SortDirection) => void
  /** 是否禁用排序 */
  disabled?: boolean
  /** 是否启用 tooltip */
  tooltip?: BoolConfig<{
    /** 自定义 tooltip 文本 */
    text?: {
      asc?: string
      desc?: string
      default?: string
    }
  }>
}
