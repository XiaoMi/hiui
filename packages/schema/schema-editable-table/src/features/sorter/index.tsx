import { useSubscription } from '@hi-ui/use-subscription'
import type { SortingState } from '@tanstack/react-table'

export { useSorterOpts, getSorterOptions } from './use-opts'
export { getSorterConfig } from './get-sorter-config'
export { TableSorterBridge } from './bridge'
export type { SorterOpts } from './use-opts'

export function useSorterState() {
  const sorterState = useSubscription<SortingState>([])
  return { sorterState }
}
