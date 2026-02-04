import { useSubscription } from '@hi-ui/use-subscription'
import type { RowSelectionState } from '@tanstack/react-table'

// 暂时没有太多逻辑，仅在此处包装
export function useRowSelectionState() {
  const rowSelectionState = useSubscription<RowSelectionState>({})
  return { rowSelectionState }
}

export { useRowSelectionOpts } from './use-opts'
export { useSyncHoverStyle } from './use-sync-hover-style'
