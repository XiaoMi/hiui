import { useMemo } from 'react'
import { useRequest } from 'ahooks'
import { unionBy } from 'lodash-es'
import { mergeProps } from '@hi-ui/schema-utils'
import type React from 'react'
import type { Options as aHooksUseRequestOptions } from 'ahooks/es/useRequest/src/types'
import type { CascaderProps, CascaderDataItem } from '@hi-ui/cascader'
import type { CheckCascaderProps, CheckCascaderDataItem } from '@hi-ui/check-cascader'
import type { CheckTreeSelectProps, CheckTreeSelectDataItem } from '@hi-ui/check-tree-select'
import type { CheckSelectProps, CheckSelectMergedItem } from '@hi-ui/check-select'
import type { SelectProps, SelectMergedItem } from '@hi-ui/select'
import type { TreeSelectProps, TreeSelectDataItem } from '@hi-ui/tree-select'
import type { ProFieldRenderEditCellCtx, ProFieldRenderFormItemCtx } from '@hi-ui/schema-core'

/**
 * @deprecated HiUI组件 Props 类型 摆在这里没啥用，方便参考的
 */
export type HiUIOptionsConsumerType =
  | CascaderProps
  | CheckCascaderProps
  | CheckTreeSelectProps
  | CheckSelectProps
  | SelectProps
  | TreeSelectProps

/**
 * @deprecated HiUI组件数据项类型 摆在这里没啥用，方便参考的
 */
export type HiUIOptionItemType =
  | CascaderDataItem
  | CheckCascaderDataItem
  | CheckTreeSelectDataItem
  | CheckSelectMergedItem
  | SelectMergedItem
  | TreeSelectDataItem

/** 统一的基础数据项类型 */
export type BasicOptItemType = AnyObject & {
  /** 选择项值，唯一 id */
  id?: React.ReactText
  /** 选项标题 */
  title?: React.ReactNode
  /** 下一级选项列表 */
  children?: BasicOptItemType[]
}

export type AsyncOptsFieldRenderCtxType = ProFieldRenderFormItemCtx | ProFieldRenderEditCellCtx

export type GenInitialOptsDataCtxType = {
  data: unknown
  /** 组件上下文绑定的原始数据 */
  rawData: AsyncOptsFieldRenderCtxType['rawData']
  renderCtx: GetOptsDataProps['renderCtx']
}

/** 原始的 useRequest 配置类型 */
type UseRequestOptions<Params extends AnyType[] = AnyType[]> = aHooksUseRequestOptions<
  BasicOptItemType[],
  Params
>

export type GetOptsDataProps = {
  /** 选项数据源 */
  data?: BasicOptItemType[]
  /** 初始化请求一次数据 */
  initialRequest?: UseRequestOptions['manual']
  /** 自定义缓存key */
  cacheKey?: UseRequestOptions['cacheKey']
  /** 防抖等待时间，默认值为 300ms */
  debounceWait?: UseRequestOptions['debounceWait']
  /** 请求配置 */
  requestConfig?: UseRequestOptions
  /** 生成初始选中值显示数据的异步回调函数 */
  genInitialOptsData?: (ctx: GenInitialOptsDataCtxType) => MaybeAsync<BasicOptItemType[]>
  /** ProField 的渲染上下文 */
  renderCtx: AsyncOptsFieldRenderCtxType
}

export type GetOptsDataRequest<Params extends AnyType[] = AnyType[]> = (
  ...params: Params
) => Promise<BasicOptItemType[] | { data: BasicOptItemType[] }>

export type AsyncOptsRequestCtxType<TCtx = AnyObject> = TCtx & {
  /** ProField 的渲染上下文 */
  renderCtx: AsyncOptsFieldRenderCtxType
}

export type AsyncOptsRequestType<TCtx = AnyObject> = GetOptsDataRequest<
  [
    // 两个参数，第一个是搜索关键词，第二个是请求上下文
    keyword: string,
    ctx: AsyncOptsRequestCtxType<TCtx>
  ]
>

// 异步请求函数
export function useAsyncOptsData<Params extends AnyType[]>(
  request?: GetOptsDataRequest<Params>,
  props: GetOptsDataProps = { renderCtx: {} as ProFieldRenderFormItemCtx },
  innerOpts?: {
    requestCtx: AsyncOptsRequestCtxType
  }
) {
  const { data: initialData = [], genInitialOptsData } = props
  const { requestCtx } = innerOpts || {}

  // 处理异步请求
  const { data: asyncData = [], ...requestResult } = useRequest(
    async (...params: Params) => {
      if (!request) return initialData || []

      // 无参时，第一个参数为 undefined
      const _params = params.length === 0 ? [undefined] : params
      // @ts-expect-error 给 request 注入额外的上下文参数
      const promise = request(..._params, requestCtx)
      return promise
        .then((res) => {
          if (!res) return []

          // 处理数据可能在 res 或 res.data 中的情况
          const rawData = 'data' in res ? res.data : res

          // 确保返回数组
          return Array.isArray(rawData) ? rawData : [rawData]
        })
        .catch((err) => {
          console.error('SchemaComponents useAsyncOptsData: Failed to fetch async data', err)
          return []
        })
    },
    mergeProps(
      {
        manual: !props.initialRequest,
        debounceWait: props.debounceWait || 300,
        cacheKey: props.cacheKey,
      },
      props.requestConfig
    )
  )

  // 处理初始选中值的数据获取
  const { data: initialOptsData = [] } = useRequest(
    async () => {
      if (!genInitialOptsData) return []

      const ctx = {
        data: props.renderCtx?.formBinding.value,
        rawData: props.renderCtx?.rawData || {},
        renderCtx: props.renderCtx,
      }
      try {
        const res = await genInitialOptsData(ctx)
        if (!res) return []
        return Array.isArray(res) ? res : [res]
      } catch (error) {
        console.error('SchemaComponents useAsyncOptsData: Failed to fetch initial opts data', error)
        return []
      }
    },
    {
      manual: false,
    }
  )

  // 合并同步、异步和初始选中值数据并去重
  const data = useMemo(() => {
    return unionBy(asyncData, initialData, initialOptsData, 'id')
  }, [asyncData, initialOptsData, initialData])

  return { data, ...requestResult }
}
