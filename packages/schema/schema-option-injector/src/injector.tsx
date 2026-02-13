import React from 'react'
import { omit } from 'lodash-es'
import type { PickerProps } from '@hi-ui/picker'
import { useAsyncOptsData } from './hooks'
import type { AsyncOptsRequestType, GetOptsDataProps } from './hooks'

// 被包裹的组件一般包含 GetOptsDataProps 中的属性
export type AsyncOptsDataProps<RequestCtx = AnyObject> = GetOptsDataProps &
  Pick<PickerProps, 'loading' | 'searchable' | 'onSearch' | 'onOpen'> & {
    /** 请求数据的方法 */
    request?: AsyncOptsRequestType<RequestCtx>
    /** 由外部传入的，额外的请求上下文 */
    requestCtx?: RequestCtx
    /** 打开下拉框时重新请求一次数据 */
    refetchOnOpen?: boolean
    /** 选中值变化时回调 */
    onChange?: (...args: AnyArray) => void
    /** 表格模式下设置选中值的回调函数，用于在渲染时获取选中值的显示文本 */
    setSelectedRawOption?: (values?: AnyObject) => void
  }

export type WithAsyncOptsDataProps<T> =
  // 移除 renderCtx 属性，外部无需传入
  Omit<AsyncOptsDataProps, 'renderCtx'> & Omit<T, 'dataSource'>

export function AsyncOptsDataInjector(props: React.PropsWithChildren<AsyncOptsDataProps>) {
  const {
    request,
    requestCtx: requestCtxProp,
    refetchOnOpen,
    children,
    genInitialOptsData,
    setSelectedRawOption,
    ...rest
  } = props

  const keywordRef = React.useRef('')

  const requestCtx: Parameters<AsyncOptsRequestType>[1] = {
    ...requestCtxProp,
    renderCtx: rest.renderCtx,
  }

  const { data, run, loading } = useAsyncOptsData(
    request,
    {
      ...rest,
      genInitialOptsData,
    },
    { requestCtx }
  )

  // 若有其他自定义的非 HiUI 的属性，都需要在这里移除
  const pureProps = omitInjectedProps(rest)

  // 克隆 children 并注入props
  return React.cloneElement(children as React.ReactElement<AsyncOptsDataProps>, {
    ...pureProps,
    loading,
    data,
    searchable: rest.searchable ?? !!request,
    onSearch: (keyword: string) => {
      keywordRef.current = keyword
      run(keyword)
      rest.onSearch?.(keyword)
    },
    onOpen: () => {
      if (refetchOnOpen) {
        run(keywordRef.current)
      }
      rest.onOpen?.()
    },
    onChange: (...args) => {
      rest.onChange?.(...args)
      setSelectedRawOption?.(args)
    },
  })
}

export function omitInjectedProps<T extends AsyncOptsDataProps>(props: T) {
  const keys = [
    // 以下是 SchemaComponents 的功能，需要过滤
    'request',
    'requestCtx',
    'refetchOnOpen',
    'setSelectedRawOption',
    'initialRequest',
    'cacheKey',
    'debounceWait',
    'requestConfig',
    'genInitialOptsData',
    'refillFieldName',
    'renderCtx',
    // 以下是 HiUI 原生的支持，需要屏蔽
    'dataSource',
  ] as const

  // 返回新对象
  return omit(props, keys) as Omit<T, typeof keys[number]>
}
