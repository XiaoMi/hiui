import { createRef, createElement } from 'react'
import getReactDomRender from '@hi-ui/react-compat'
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

  let mockUnmount: any = null
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
        mockUnmount()
        Container.removeContainer(selectId)
      }
      container = undefined
    },
    ...rest,
  })

  requestAnimationFrame(() => {
    const mockRender = getReactDomRender()
    mockUnmount = mockRender(ClonedPopover, container)

    // NOTE 适配 React19 后，此处可能并非完全标准意义上的同步渲染
    // 会导致 popoverRef 未被正确赋值，因此此处等待一帧后再唤起元素
    // 一帧的时间是预估的，若收到反馈无法正确唤起，可尝试调整此处等待时间
    setTimeout(() => popoverRef.current.open(), 16)
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
