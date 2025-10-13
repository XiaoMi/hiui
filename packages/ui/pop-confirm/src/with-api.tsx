import { createRef, createElement } from 'react'
import getReactDomRender from '@hi-ui/react-compat'
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
  let mockUnmount: any = null

  const popConfirmRef = createRef<any>()

  const ClonedPopConfirm = createElement(PopConfirm, {
    innerRef: popConfirmRef,
    container,
    attachEl: target,
    closeOnOutsideClick: false,
    onExited: () => {
      // 卸载
      if (container) {
        mockUnmount()
        Container.removeContainer(selectId)
      }
      container = undefined
    },
    ...rest,
  })

  requestAnimationFrame(() => {
    const mockRender = getReactDomRender()
    mockUnmount = mockRender(ClonedPopConfirm, container)

    // NOTE 适配 React19 后，此处可能并非完全标准意义上的同步渲染
    // 会导致 popConfirmRef 未被正确赋值，因此此处等待一帧后再唤起元素
    // 一帧的时间是预估的，若收到反馈无法正确唤起，可尝试调整此处等待时间
    setTimeout(() => popConfirmRef.current.open(), 16)
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
