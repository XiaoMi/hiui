import React, { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'

import { prefix as popoverPrefix, Popover, PopoverProps } from './Popover'

const prefixCls = popoverPrefix
const selector = `.${prefixCls}-wrapper`
const toastManagerRef = createRef<any>()

const open = (target: HTMLElement, { onOpen, onClose, ...rest }: PopoverApiProps) => {
  const selectorId = `${selector}__${uuid()}`
  let container: any = Container.getContainer(selectorId)
  console.log('target', target)

  const ClonedPopover = createElement(Popover, {
    ...rest,
    // visible: true,
    innerRef: toastManagerRef,
    container,
    attachEl: target,
    closeOnOutsideClick: false,
    shouldWrapChildren: true,
    // children: attachEl,
    onOpen: () => {
      onOpen?.()
    },
    onClose: () => {
      console.log('close', toastManagerRef.current)

      onClose?.()

      setTimeout(() => {
        if (container) {
          unmountComponentAtNode(container as Element)
          container = null
        }
        Container.removeContainer(selector)
      }, 300)
    },
  })

  requestAnimationFrame(() => {
    render(ClonedPopover, container)
    toastManagerRef.current.open()
  })
}

const close = () => {
  console.log('close.')

  toastManagerRef.current.close()
}

export interface PopoverApiProps extends PopoverProps {}

export function withModal(instance: typeof Popover) {
  return Object.assign(instance, { open, close })
}
