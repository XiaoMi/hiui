import { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'

import { POP_CONFIRM_PREFIX, PopConfirm, PopConfirmProps } from './PopConfirm'

const prefixCls = POP_CONFIRM_PREFIX
const selector = `.${prefixCls}-wrapper`

const popConfirmInstanceCache: {
  [key: string]: () => void
} = {}

const open = (target: HTMLElement, { key, disabledPortal, ...rest }: PopConfirmApiProps) => {
  if (!key) {
    key = uuid()
  }

  const selectId = `${selector}__${key}`
  let container: any = Container.getContainer(
    selectId,
    undefined,
    (disabledPortal ? target.parentNode : undefined) as Element
  )

  const popConfirmRef = createRef<any>()

  const ClonedPopConfirm = createElement(PopConfirm, {
    innerRef: popConfirmRef,
    container,
    attachEl: target,
    closeOnOutsideClick: false,
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
    render(ClonedPopConfirm, container)
    popConfirmRef.current.open()
  })

  const close = () => {
    popConfirmRef.current?.close()
  }

  if (key) {
    popConfirmInstanceCache[key] = close
  }

  return key
}

const close = (key: string) => {
  if (typeof popConfirmInstanceCache[key] === 'function') {
    popConfirmInstanceCache[key]()
  }

  delete popConfirmInstanceCache[key]
}

export interface PopConfirmApiProps extends PopConfirmProps {}

export function withPopConfirm(instance: typeof PopConfirm) {
  return Object.assign(instance, { open, close })
}
