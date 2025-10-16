import { createRef, createElement } from 'react'
import getReactDomRender from '@hi-ui/react-compat'
import * as Container from '@hi-ui/container'

import { _prefix, Tooltip, TooltipProps } from './Tooltip'
import { uuid } from '@hi-ui/use-id'

const prefixCls = _prefix
const selector = `.${prefixCls}-wrapper`
const DEFAULT_TOOLTIP_OPTIONS = {} as TooltipApiProps

const tooltipInstanceCache: {
  [key: string]: () => void
} = {}

// TODO： 抽离合并到 Toast API
const open = (
  target: HTMLElement,
  { key, title, ...popper }: TooltipApiProps = DEFAULT_TOOLTIP_OPTIONS
) => {
  if (!key) {
    key = uuid()
  }

  let container: any = Container.getContainer(`${selector}__${key}`)
  let mockUnmount: any = null

  const toastManagerRef = createRef<any>()

  const ClonedTooltip = createElement(Tooltip, {
    innerRef: toastManagerRef,
    title,
    visible: true,
    ...popper,
    onExited: () => {
      // 卸载
      if (container) {
        mockUnmount()
        Container.removeContainer(selector)
      }
      container = undefined
    },
    // @ts-ignore
    children: target,
    container,
  })

  // TODO：存在弹出时延迟感
  const mockRender = getReactDomRender()
  mockUnmount = mockRender(ClonedTooltip, container)

  const close = () => {
    toastManagerRef.current?.close()
  }

  if (key) {
    tooltipInstanceCache[key] = close
  }

  return key
}

const close = (key: string) => {
  if (typeof tooltipInstanceCache[key] === 'function') {
    tooltipInstanceCache[key]()
  }

  delete tooltipInstanceCache[key]
}

export interface TooltipApiProps extends TooltipProps {
  /**
   * 标识 tooltip 的唯一 key，仅用于关闭
   */
  key?: string
}

export function withTooltip(instance: typeof Tooltip) {
  return Object.assign(instance, { open, close })
}
