import { useCallback } from 'react'
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import { getPipeGetterValue, type PipeGetter } from '@hi-ui/schema-utils'
import type { InnerRefType } from '../../ctx'
import type { GetPageDataCtxType } from '../pagination/component'
import { validateResData } from './getter'

export type GetDataSourceCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
}

export type GetDataSourceBasicParamsType = {
  /**
   * 分页信息
   * @desc 启用分页时，分页信息必然存在
   */
  pagination?: GetPageDataCtxType
  /**
   * 表头筛选信息
   * @desc 启用远程筛选时，表头筛选信息必然存在
   */
  filters?: ColumnFiltersState
  /**
   * 表头排序信息
   * @desc 启用远程排序时，表头排序信息必然存在
   */
  sorters?: SortingState
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

export type InnerUpdateDataSourceType = (
  customParams?: PipeGetter<GetDataSourceParamsType>
) => Promise<void>

export function useGetDataSource<TData extends AnyObject>(ctx: GetDataSourceCtxType<TData>) {
  const { innerRef } = ctx

  const getDataSource: InnerGetDataSourceType<TData> = useCallback(
    async function getDataSource(customParams) {
      const { table, globalStaticRef, propsRef } = innerRef.current

      const { enableAsyncData } = globalStaticRef.current
      const { request: dataSourceFn } = propsRef.current.asyncData || {}

      const dftData = { list: [], total: 0, pageSize: 0, current: 0 }
      if (!enableAsyncData || !dataSourceFn) return dftData

      const {
        pagination: { pageIndex, pageSize },
        sorting,
        columnFilters,
      } = table.getState()

      const params = {} as GetDataSourceParamsType

      // 分页
      // 其实只要启用异步数据源，基本上一定会有分页
      // 还是判断一下吧，就当是用来收窄类型
      const { enablePagination } = globalStaticRef.current
      if (enablePagination) {
        params.pagination = { current: pageIndex + 1, pageSize }
      }

      // 筛选
      const { enableRemoteFilter } = globalStaticRef.current
      if (enableRemoteFilter) params.filters = columnFilters

      // 排序
      const { enableRemoteSorter } = globalStaticRef.current
      if (enableRemoteSorter) params.sorters = sorting

      // 若有传入 customParams，则使用 customParams 处理 params
      const pipeParams = getPipeGetterValue(params, customParams)

      // 使用 beforeRequest 处理 pipeParams
      const beforeRequest =
        propsRef.current.asyncData?.beforeRequest || ((params: AnyType) => params)
      const finalParams = await beforeRequest(pipeParams)
      if (!finalParams) return dftData

      return dataSourceFn(finalParams)
    },
    [innerRef]
  )

  const updateDataSource: InnerUpdateDataSourceType = useCallback(
    async function updateDataSource(params) {
      const data = await getDataSource(params)

      // 如果数据为空，则不更新表格数据
      if (!data) return

      const { propsRef, globalStaticRef } = innerRef.current
      // 如果启用了数据完整性验证，并且启用了分页，则验证数据
      const enableDataValidate = propsRef.current.asyncData?.enableDataValidate
      const enablePagination = globalStaticRef.current.enablePagination
      if (enableDataValidate && enablePagination) validateResData(data)

      const { subscription, paginationState, table } = innerRef.current

      // 表格数据直接更新到主数据订阅
      subscription.setValue(data.list)

      // 如果启用了分页，则更新分页状态
      if (enablePagination) {
        const {
          // 启用分页时，必须包含下面三个字段
          // 此处的默认值实际上用不到
          pageSize: dataPageSize = 10,
          current = 1,
          total: rowCount = 0,
        } = data

        const pageIndex = current - 1
        const nextState = { pageIndex, pageSize: dataPageSize, rowCount }
        // 更新分页状态订阅
        paginationState.setValue(nextState)
        // 最后更新 table 分页状态 // 不触发 onPaginationChange
        table.setState((state) => ({ ...state, pagination: nextState }))
      }
    },
    [getDataSource, innerRef]
  )

  return { getDataSource, updateDataSource }
}
