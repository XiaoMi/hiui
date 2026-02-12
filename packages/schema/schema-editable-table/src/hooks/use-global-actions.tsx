import { useLatest, useMemoizedFn } from 'ahooks'
import type { ReadonlyRefObject } from '@hi-ui/schema-hooks'
import { useGetDataSource, useResetDataSource } from '../features/async-data'
import { useSetSelectedRowKeys } from '../features/row-selection'
import type { InnerRefType } from '../ctx'
import type {
  InnerGetDataSourceType,
  InnerUpdateDataSourceType,
  InnerResetDataSourceType,
} from '../features/async-data'
import type { InnerSetSelectedRowKeys } from '../features/row-selection'

export type GlobalStaticActionsType<TData extends AnyObject> = {
  /** 获取异步数据源（仅获取数据） */
  getDataSource: InnerGetDataSourceType<TData>
  /** 更新异步数据源（获取数据并更新表格） */
  updateDataSource: InnerUpdateDataSourceType
  /** 重置分页、筛选状态 */
  resetDataSource: InnerResetDataSourceType
  /** 设置表格数据源 */
  setDataSource: (newValue: TData[] | ((prev: TData[]) => TData[])) => void
  /** 设置行选择状态 */
  setSelectedRowKeys: InnerSetSelectedRowKeys
}

// 此处不关心 TData 类型，所以使用 AnyType
type UseGlobalStaticActionsCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
}

/**
 * 全局静态函数
 */
export function useGlobalStaticActions<TData extends AnyObject>(
  ctx: UseGlobalStaticActionsCtxType<TData>
) {
  const { innerRef } = ctx

  // 获取异步数据源
  const { getDataSource, updateDataSource } = useGetDataSource<TData>({ innerRef })
  // 重置分页、筛选
  const resetDataSource = useResetDataSource<TData>({ innerRef })

  const setDataSource = useMemoizedFn(
    // 设置表格数据源
    function setDataSource(dataSource: TData[] | ((newValue: TData[]) => TData[])) {
      innerRef.current.subscription.setValue(dataSource)
    }
  )

  // 设置行选择状态
  const setSelectedRowKeys = useSetSelectedRowKeys({ innerRef })

  const globalStaticActions: GlobalStaticActionsType<TData> = {
    getDataSource,
    updateDataSource,
    resetDataSource,
    setDataSource,
    setSelectedRowKeys,
  } as const

  return useLatest(globalStaticActions) as ReadonlyRefObject<GlobalStaticActionsType<TData>>
}
