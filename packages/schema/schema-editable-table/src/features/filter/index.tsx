import { useSubscription } from '@hi-ui/use-subscription'
import type { ColumnFiltersState } from '@tanstack/react-table'

export { useFilterOpts, getFilterOptions } from './use-opts'
export { getFilterConfig } from './get-filter-config'
export { TableFilterBridge } from './bridge'
export type { FilterOpts } from './use-opts'

export function useFilterState() {
  const filterState = useSubscription<ColumnFiltersState>([])
  return { filterState }
}
