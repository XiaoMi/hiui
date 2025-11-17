import { createRef, createElement } from 'react'
import getReactDomRender from '@hi-ui/react-compat'
import * as Container from '@hi-ui/container'
import { _prefix, Loading, LoadingProps } from './Loading'
import { uuid } from '@hi-ui/use-id'
import { isPlus } from '@hi-ui/type-assertion'

const prefixCls = _prefix
const selector = `.${prefixCls}-wrapper`

const loadingInstanceCache: {
  [key: string]: () => void
} = {}

const open = (
  target?: HTMLElement | null,
  { content, key, duration, size = 'lg', autoClose = true }: LoadingApiProps = {}
) => {
  if (!key) {
    key = uuid()
  }

  let container: Element | null = Container.getContainer(`${selector}__${key}`)

  const innerRef = createRef<any>()

  const ClonedLoading = createElement(Loading, {
    innerRef: innerRef,
    content: content,
    container: target,
    full: !target,
    size: size,
    part: true,
  })

  const mockRender = getReactDomRender()
  const mockUnmount = mockRender(ClonedLoading, container)

  const close = () => {
    innerRef.current?.close()

    setTimeout(() => {
      if (container) {
        mockUnmount()
        container = null
      }
      Container.removeContainer(selector)
    }, 300)
  }

  if (key) {
    loadingInstanceCache[key] = close
  }

  // TODO: 迁移至 loading 内部实现
  if (autoClose && isPlus(duration)) {
    setTimeout(close, duration)
  }

  return key
}

const close = (key: string) => {
  if (typeof loadingInstanceCache[key] === 'function') {
    loadingInstanceCache[key]()
  }

  delete loadingInstanceCache[key]
}

export interface LoadingApiProps extends Pick<LoadingProps, 'content' | 'size'> {
  /**
   * 唯一标识
   */
  key?: string
  /**
   * 自动关闭的时间，单位为毫秒
   */
  duration?: number
  /**
   * 是否开启自动关闭
   */
  autoClose?: boolean
}

export function withLoading(instance: typeof Loading) {
  return Object.assign(instance, { open, close })
}
