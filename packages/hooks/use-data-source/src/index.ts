import { useCallback, useRef, useState } from 'react'
import { isFunction, isArray, isPromise, isUndefined } from '@hi-ui/type-assertion'
import { useLatestRef } from '@hi-ui/use-latest'
import { invariant } from '@hi-ui/env'

/**
 * TODO: What is useDataSource
 * TODO: Using axios instead of fetch：https://www.geeksforgeeks.org/difference-between-fetch-and-axios-js-for-making-http-requests/
 */
export const useDataSource = <T = Record<string, any>[]>({
  dataSource: dataSourceProp,
  validate = isArray as any,
  abort = true,
}: UseDataSourceProps<T>) => {
  // pending | 'loading' | 'fulfilled' | 'rejected'
  const [status, setStatus] = useState('pending')

  const cancelControllerRef = useRef<AbortController | null>(null)

  const dataSourceLatestRef = useLatestRef(dataSourceProp)
  const validateLatestRef = useLatestRef(validate)

  const request = useCallback(
    (options: UseDataSourceAPIOptions, keyword: any) => {
      const {
        url: urlProp,
        method = 'GET',
        headers,
        data,
        params: paramsProp,
        credentials: credentialsProp,
        withCredentials = false,
        transformResponse,
        key,
        onError,
        ...rest
      } = options

      // Inject the keyword
      const params = key ? { [key]: keyword, ...paramsProp } : paramsProp
      const credentials = withCredentials ? 'include' : credentialsProp

      if (abort) {
        // @Optimize: Cancel the last request
        cancelControllerRef.current?.abort?.()
        cancelControllerRef.current = new AbortController()
      }

      let url: URL | string = urlProp

      if (params) {
        url = new URL(urlProp)
        url.search = new URLSearchParams(params).toString()
      }

      return fetch(url.toString(), {
        signal: cancelControllerRef.current ? cancelControllerRef.current.signal : undefined,
        ...rest,
        method,
        body: data as any,
        credentials,
        headers,
      })
        .then(
          (response) => {
            cancelControllerRef.current = null
            return response.json()
          },
          (error) => {
            cancelControllerRef.current = null
            onError?.(error)
          }
        )
        .then((response) => {
          return transformResponse?.(response)
        })
    },
    [abort]
  )

  const loadRemoteData = useCallback(
    (keyword: any) => {
      setStatus('pending')
      return new Promise<T>((resolve, reject) => {
        const dataSourceLatest = dataSourceLatestRef.current
        const validate = validateLatestRef.current

        const resultMayBePromise = isFunction(dataSourceLatest)
          ? dataSourceLatest(keyword)
          : dataSourceLatest

        if (isUndefined(resultMayBePromise)) {
          setStatus('rejected')
          reject(resultMayBePromise)
          return
        }

        if (validate(resultMayBePromise)) {
          setStatus('fulfilled')
          resolve(resultMayBePromise)
          return
        }

        if (isPromise(resultMayBePromise)) {
          setStatus('loading')

          resultMayBePromise
            .then((res) => {
              if (isUndefined(res)) {
                setStatus('rejected')
                reject(res)
                return
              }

              if (validate(res)) {
                setStatus('fulfilled')
                resolve(res)
                return
              }

              setStatus('rejected')
              reject(res)
            })
            .catch((err) => {
              setStatus('rejected')
              reject(err)
            })

          return
        }

        if (typeof resultMayBePromise.url !== 'string') {
          invariant(true, 'Please Return Correct result when using DataSource.')

          setStatus('rejected')
          reject(resultMayBePromise)
          return
        }

        setStatus('loading')
        request(resultMayBePromise, keyword)
          .then((data) => {
            if (isUndefined(data)) {
              setStatus('rejected')
              reject(data)
              return
            }

            if (validate(data)) {
              setStatus('fulfilled')
              resolve(data)
              return
            }

            setStatus('rejected')
            reject(data)
          })
          .catch((error) => {
            setStatus('rejected')
            reject(error)
          })
      })
    },
    [dataSourceLatestRef, request, validateLatestRef]
  )

  return {
    loading: status === 'loading',
    hasError: status === 'rejected',
    loadRemoteData,
  }
}

export interface UseDataSourceAPIOptions<T = any> {
  /**
   * 请求的 url
   */
  url: string
  /**
   * 请求方法
   */
  method?: 'GET' | 'POST'
  /**
   * post 请求时请求体参数
   */
  data?: Record<string, any>
  /**
   * url 查询参数
   */
  params?: Record<string, any>
  /**
   * 请求头
   */
  headers?: Record<string, any>
  /**
   * 请求模式
   */
  mode?: 'same-origin' | 'cors' | 'navigate' | 'no-cors'
  /**
   * 成功时的回调，用于对数据进行预处理
   */
  transformResponse?: (response: object) => T
  /**
   * 携带身份凭证
   */
  withCredentials?: boolean
  /**
   * 身份凭证策略
   */
  credentials?: 'include' | 'omit' | 'same-origin'
  /**
   * 注入的名称
   */
  key?: string
  /**
   * 请求 error 时回调
   */
  onError?: (error: any) => void
}

export type UseDataSource<T> =
  | T
  | ((keyword: any) => T | void | undefined)
  | ((keyword: any) => Promise<T | void | undefined>)
  | UseDataSourceAPIOptions<T>
  | ((keyword: any) => UseDataSourceAPIOptions<T>)

export interface UseDataSourceProps<T = any> {
  dataSource?: UseDataSource<T>
  validate?: (arg: unknown) => arg is T
  /**
   * 请求时，是否取消上一次请求
   */
  abort?: boolean
}

export type UseDataSourceReturn = ReturnType<typeof useDataSource>
