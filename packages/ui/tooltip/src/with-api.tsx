import { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'

import { _prefix, Tooltip, TooltipProps } from './Tooltip'

const prefixCls = _prefix
const selector = `.${prefixCls}-wrapper`
const DEFAULT_TOOLTIP_OPTIONS = {} as TooltipApiProps

const tooltipInstanceCache: {
  [key: string]: () => void
} = {}

// TODO： 抽离合并到 Toast API
const open = (
  target: HTMLElement,
  { key, title, popper }: TooltipApiProps = DEFAULT_TOOLTIP_OPTIONS
) => {
  let container: any = Container.getContainer(`${selector}__${key}`)

  const toastManagerRef = createRef<any>()

  const ClonedTooltip = createElement(Tooltip, {
    innerRef: toastManagerRef,
    title,
    visible: true,
    popper,
    onExited: () => {
      // 卸载
      if (container) {
        unmountComponentAtNode(container)
        Container.removeContainer(selector)
      }
      container = undefined
    },
    children: target,
    portal: { container },
  })

  // TODO：存在弹出时延迟感
  render(ClonedTooltip, container)

  const close = () => {
    toastManagerRef.current?.close()
  }

  if (key) {
    tooltipInstanceCache[key] = close
  }

  return { close }
}

const close = (key: string) => {
  if (typeof tooltipInstanceCache[key] === 'function') {
    tooltipInstanceCache[key]()
  }

  delete tooltipInstanceCache[key]
}

export interface TooltipApiProps extends Pick<TooltipProps, 'title' | 'popper'> {
  /**
   * 标识 tooltip 的唯一 key，仅用于关闭
   */
  key?: string
  /**
   * 要显示 tooltip 的元素	HTMLElement
   * TODO: 收敛进对象
   */
  // target: React.ReactNode
}

export function withTooltip(instance: typeof Tooltip) {
  return Object.assign(instance, { open, close })
}
