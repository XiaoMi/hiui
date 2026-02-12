import type { BeCheckedPromiseType } from '@hi-ui/schema-utils'
import type { GetDataSourceParamsType, GetDataSourceType } from './normal'

export type AsyncDataOptsType<TData extends AnyObject = AnyObject> = {
  /**
   * 请求数据的方法
   */
  request: GetDataSourceType<TData>
  /**
   * 请求前的钩子
   * @desc 返回值为 falsy 时，不执行 request 函数
   */
  beforeRequest?: (params: GetDataSourceParamsType) => BeCheckedPromiseType<GetDataSourceParamsType>
  /**
   * 是否阻止默认的初始请求
   */
  blockInitialRequest?: boolean
  /**
   * 是否启用数据完整性验证
   * @desc 建议至少在开发环境下启用
   */
  enableDataValidate?: boolean
}
