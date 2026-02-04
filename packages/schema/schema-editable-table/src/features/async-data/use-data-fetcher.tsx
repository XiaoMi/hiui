import { mergeValues } from '@hi-ui/schema-utils'
import { useRequest } from 'ahooks'
import { Options as AhooksRequestOptions } from 'ahooks/es/useRequest/src/types'
import type { GetDataSourceType, GetDataSourceParamsType, GetDataSourceResType } from './normal'

/**
 * 定义的可编辑表的异步数据请求方法
 * @desc 默认需要手动调用 fetchData 方法
 * @desc 本质是 ahooks 的 useRequest 方法
 */
export function useDataFetcher<TData extends AnyObject = AnyObject>(
  getter: GetDataSourceType<TData>,
  extraOpts?: AhooksRequestOptions<GetDataSourceResType<TData>, [GetDataSourceParamsType]>
) {
  const { runAsync, ...rest } = useRequest(
    getter,
    mergeValues(
      {
        manual: true,
      },
      extraOpts
    )
  )

  return {
    ...rest,
    runAsync,
    fetchData: runAsync,
  }
}

/** 定义表格异步数据请求方法 */
export function defineDataFetcher<TData extends AnyObject = AnyObject>(
  getter: GetDataSourceType<TData>
) {
  return getter
}
