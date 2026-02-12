import type { PipeGetter } from '@hi-ui/schema-utils'

export type PaginationStateType = {
  current: number
  pageSize: number
}

export type FiltersStateType = {
  id: string
  value: unknown
}

export type SortingStateType = {
  id: string
  desc: boolean
}

export type GetDataSourceBasicParamsType = {
  /**
   * 分页信息
   * @desc 启用分页时，分页信息必然存在
   */
  pagination?: PaginationStateType
  /**
   * 表头筛选信息
   * @desc 启用远程筛选时，表头筛选信息必然存在
   */
  filters?: FiltersStateType[]
  /**
   * 表头排序信息
   * @desc 启用远程排序时，表头排序信息必然存在
   */
  sorters?: SortingStateType[]
}

export type GetDataSourceParamsType = AnyObject &
  GetDataSourceBasicParamsType & {
    /**
     * 原始参数
     * - 默认为空，可由上层组件自行决定参数类型
     */
    raw?: GetDataSourceBasicParamsType
  }

/**
 * 异步数据源的返回类型
 * @desc 请注意，启用分页时，返回类型中必须包含 total/pageSize/current 字段
 */
export type GetDataSourceResType<TData extends AnyObject = AnyObject> = {
  list: TData[]
  total?: number
  pageSize?: number
  current?: number
}

export type GetDataSourceType<TData extends AnyObject> = (
  params: GetDataSourceParamsType
) => Promise<GetDataSourceResType<TData>>

export type InnerGetDataSourceType<TData extends AnyObject> = (
  customParams?: PipeGetter<GetDataSourceParamsType>
) => Promise<GetDataSourceResType<TData>>
