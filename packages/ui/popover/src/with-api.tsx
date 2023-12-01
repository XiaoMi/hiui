import { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'

import { prefix as popoverPrefix, Popover, PopoverProps } from './Popover'

const prefixCls = popoverPrefix
const selector = `.${prefixCls}-wrapper`

const popoverInstanceCache: {
  [key: string]: () => void
} = {}

const open = (target: HTMLElement, { key, disabledPortal, ...rest }: PopoverApiProps) => {
  if (!key) {
    key = uuid()
  }

  const selectId = `${selector}__${key}`
  let container: any = Container.getContainer(
    selectId,
    undefined,
    (disabledPortal ? target.parentNode : undefined) as Element
  )

  const popoverRef = createRef<any>()

  const ClonedPopover = createElement(Popover, {
    innerRef: popoverRef,
    container,
    attachEl: target,
    closeOnOutsideClick: false,
    shouldWrapChildren: true,
    onExited: () => {
      // 卸载
      if (container) {
        unmountComponentAtNode(container)
        Container.removeContainer(selectId)
      }
      container = undefined
    },
    ...rest,
  })

  requestAnimationFrame(() => {
    render(ClonedPopover, container)
    popoverRef.current.open()
  })

  const close = () => {
    popoverRef.current?.close()
  }

  if (key) {
    popoverInstanceCache[key] = close
  }

  return key
}

const close = (key: string) => {
  if (typeof popoverInstanceCache[key] === 'function') {
    popoverInstanceCache[key]()
  }

  delete popoverInstanceCache[key]
}

export interface PopoverApiProps extends PopoverProps {}

export function withPopover(instance: typeof Popover) {
  return Object.assign(instance, { open, close })
}
