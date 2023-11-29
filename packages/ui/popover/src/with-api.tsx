import { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'

import { prefix as popoverPrefix, Popover, PopoverProps } from './Popover'

const prefixCls = popoverPrefix
const selector = `.${prefixCls}-wrapper`

const tooltipInstanceCache: {
  [key: string]: () => void
} = {}

const open = (target: HTMLElement, { key, onClose, disabledPortal, ...rest }: PopoverApiProps) => {
  if (!key) {
    key = uuid()
  }

  let container: any = Container.getContainer(
    `${selector}__${key}`,
    undefined,
    (disabledPortal ? target.parentNode : undefined) as Element
  )

  const popoverRef = createRef<any>()

  const ClonedPopover = createElement(Popover, {
    ...rest,
    innerRef: popoverRef,
    container,
    attachEl: target,
    closeOnOutsideClick: false,
    shouldWrapChildren: true,
    placement: 'bottom-end',
    onExited: () => {
      // 卸载
      if (container) {
        unmountComponentAtNode(container)
        Container.removeContainer(selector)
      }
      container = undefined
    },
  })

  requestAnimationFrame(() => {
    render(ClonedPopover, container)
    popoverRef.current.open()
  })

  const close = () => {
    popoverRef.current?.close()
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

export interface PopoverApiProps extends PopoverProps {}

export function withPopover(instance: typeof Popover) {
  return Object.assign(instance, { open, close })
}
