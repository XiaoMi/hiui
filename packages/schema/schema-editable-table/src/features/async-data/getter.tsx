import { useEffect } from 'react'
import { useDebounceFn } from 'ahooks'
import { isNil } from 'lodash-es'
import { useReadonlyRef, useIsFirstMount, useDeepCompareFlag } from '@hi-ui/schema-hooks'
import { useEditableSchemaTableCtx, type InnerRefType } from '../../ctx'
import type { GetDataSourceResType } from './normal'

// 单纯只是为了包装一下 useAsyncData
// ~~避免在 Table 最顶层调用时频繁触发重渲染~~
// NOTE 上述目的没有达到，暂时先留着吧，指不定后面又有新用途了
export function AsyncDataGetter() {
  const ctx = useEditableSchemaTableCtx()
  const innerRef = useReadonlyRef(() => ctx)
  useAsyncData({ innerRef })

  return null
}

type UseAsyncDataCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
}

export function useAsyncData<TData extends AnyObject>(ctx: UseAsyncDataCtxType<TData>) {
  const { innerRef } = ctx

  const { globalStaticRef } = innerRef.current
  const { enableAsyncData } = globalStaticRef.current

  // 分页/筛选状态变更时，table会自动触发重渲染，此处不必单独监听
  const { filterState, sorterState, paginationState } = innerRef.current

  // 异步数据源需要监听的状态
  const { pageSize, pageIndex } = paginationState.getValue()
  // 如果启用了远程筛选，则使用筛选状态，否则不监听 filters 变化
  const filters = filterState.getValue()
  const effectiveFilters = globalStaticRef.current.enableRemoteFilter ? filters : undefined
  const hasFilterChanged = useDeepCompareFlag([effectiveFilters])

  const sorters = sorterState.getValue()
  // 如果启用了远程排序，则使用排序状态，否则不监听 sorters 变化
  const effectiveSorters = globalStaticRef.current.enableRemoteSorter ? sorters : undefined
  const hasSorterChanged = useDeepCompareFlag([effectiveSorters])

  // 标记是否初次挂载
  const isFirstMountRef = useIsFirstMount()

  const { run: fetchData } = useDebounceFn(
    function fetchData() {
      // 内部主动设置的分页状态，不请求数据
      const fromCustomPagination = innerRef.current.table.getState().pagination.$fromCustom
      if (fromCustomPagination) return

      // 启用 blockInitialRequest 时，初次挂载时不请求数据
      const { propsRef } = innerRef.current
      const blockInitialRequest = propsRef.current.asyncData?.blockInitialRequest
      if (isFirstMountRef.current && blockInitialRequest) return

      // 真实请求逻辑
      if (enableAsyncData) {
        const { globalActionsRef } = innerRef.current
        globalActionsRef.current.updateDataSource()
      }
    },
    // 16 毫秒内的变更仅触发一次请求
    // 以达到短时间内多次状态变更的批处理效果
    { wait: 16 }
  )

  useEffect(() => {
    fetchData()
  }, [
    fetchData, // 不会触发重渲染
    isFirstMountRef,
    enableAsyncData,
    innerRef,
    // 以下为触发请求接口的值
    pageSize,
    pageIndex,
    hasFilterChanged,
    hasSorterChanged,
  ])
}

export function validateResData<TData extends AnyObject>(
  data: unknown
): data is GetDataSourceResType<TData> {
  // 空值检查
  if (isNil(data)) {
    console.warn('EditTable useAsyncData: 主数据不能为空')
    return false
  }

  // 对象类型检查
  if (typeof data !== 'object' || Array.isArray(data)) {
    console.warn('EditTable useAsyncData: useAsyncData: 主数据必须是对象类型')
    return false
  }

  let pass = true

  const res = data as GetDataSourceResType<TData>

  // 必要字段存在性检查
  if (!('list' in res)) {
    console.warn('EditTable useAsyncData: 主数据缺少必要字段: list')
    pass = false
  }
  if (!('total' in res)) {
    console.warn('EditTable useAsyncData: 主数据缺少必要字段: total')
    pass = false
  }
  if (!('pageSize' in res)) {
    console.warn('EditTable useAsyncData: 主数据缺少必要字段: pageSize')
    pass = false
  }
  if (!('current' in res)) {
    console.warn('EditTable useAsyncData: 主数据缺少必要字段: current')
    pass = false
  }

  // 分阶段检查，本阶段未通过，不再检查剩余项目
  if (!pass) return false

  // 字段类型检查
  if (!Array.isArray(res.list)) {
    console.warn('EditTable useAsyncData: list字段必须是数组类型')
    pass = false
  }

  if (typeof res.total !== 'number') {
    console.warn('EditTable useAsyncData: total字段必须是数字类型')
    pass = false
  }

  if (typeof res.pageSize !== 'number') {
    console.warn('EditTable useAsyncData: pageSize字段必须是数字类型')
    pass = false
  }

  if (typeof res.current !== 'number') {
    console.warn('EditTable useAsyncData: current字段必须是数字类型')
    pass = false
  }

  // list数组内容检查
  if (res.list.some((item) => isNil(item) || typeof item !== 'object' || Array.isArray(item))) {
    console.warn('EditTable useAsyncData: list数组的每一项必须是对象类型')
    pass = false
  }

  return pass
}
