import type { PaginationState } from '@tanstack/react-table'
import { useSubscription, type SubscriptionType } from '@hi-ui/use-subscription'
import { dftPageSize } from './use-opts'
import type { PropsRefType } from '../../ctx'

type UsePaginationStateCtx<TData extends AnyObject> = {
  propsRef: PropsRefType<TData>
  subscription: SubscriptionType<TData[]>
}

function getInitialState<TData extends AnyObject>(ctx: UsePaginationStateCtx<TData>) {
  const { propsRef, subscription } = ctx

  // dftPageSize 仅用于类型收窄
  // 实际上已经在 normalizeProps 中处理了
  const pageSize = propsRef.current.pagination?.pageSize ?? dftPageSize

  // 根据主数据订阅的长度设置 rowCount 的值
  // 前端分页时，直接就是主数据的长度
  // 后端分页时，rowCount 初始为0，后续会在 useAsyncData 中更新
  const rowCount = subscription.getValue().length

  // 初始化分页状态，最小值为0
  const pageIndex = propsRef.current.pagination?.defaultCurrent
    ? Math.max(propsRef.current.pagination.defaultCurrent - 1, 0)
    : 0

  return { pageIndex, pageSize, rowCount } as PaginationState
}

export function usePaginationState<TData extends AnyObject>(ctx: UsePaginationStateCtx<TData>) {
  const paginationState = useSubscription<PaginationState>(() => {
    return getInitialState(ctx)
  })

  return { paginationState }
}
