import React from 'react'
import { useAsyncOptsData } from './hooks'
import { omitInjectedProps } from './injector'
import type { AsyncOptsRequestType } from './hooks'
import type { AsyncOptsDataProps } from './injector'

export type AsyncOptsDataGetterProps = Omit<
  AsyncOptsDataProps,
  // 无需传入的属性
  'setSelectedRawOption'
>

export function AsyncOptsDataGetter(props: React.PropsWithChildren<AsyncOptsDataGetterProps>) {
  const {
    // props
    request,
    requestCtx: requestCtxProp,
    children,
    genInitialOptsData,
    ...rest
  } = props

  const requestCtx: Parameters<AsyncOptsRequestType>[1] = {
    ...requestCtxProp,
    renderCtx: rest.renderCtx,
  }

  const { data, loading } = useAsyncOptsData(
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
  return React.cloneElement(children as React.ReactElement<AsyncOptsDataGetterProps>, {
    ...pureProps,
    loading,
    data: data || [],
  })
}
