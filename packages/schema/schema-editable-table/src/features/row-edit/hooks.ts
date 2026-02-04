import { useSubscribe, NOOP_SUBSCRIPTION } from '@hi-ui/use-subscription'
import { useEditableSchemaTableCtx } from '../../ctx'

export function useRuntimeRowEditable(rowIndex: number) {
  const { rowActions } = useEditableSchemaTableCtx()
  const { editingSubscription } = rowActions

  // 行编辑状态变化时触发重渲染
  // 未启用行编辑时使用空订阅，内部不会创建额外的无效订阅
  useSubscribe(editingSubscription || NOOP_SUBSCRIPTION, [rowIndex.toString()])

  // 未开启行编辑则返回 undefined
  if (!editingSubscription) return undefined

  // 最后由 rowActions 控制是否可编辑
  return rowActions.isRowEditing(rowIndex)
}
