import React, { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'

import { modalPrefix, Modal, ModalProps } from './Modal'

const prefixCls = modalPrefix
const selector = `.${prefixCls}-wrapper`

// TODO： 抽离合并到 Toast API
const open = ({ onConfirm, onCancel, content, ...rest }: ModalApiProps = {}) => {
  // 支持多个 Modal 共存
  const selectorId = `${selector}__${uuid()}`
  let container: any = Container.getContainer(selectorId)

  const toastManagerRef = createRef<any>()

  const ClonedModal = createElement(Modal, {
    width: 400,
    showHeaderDivider: false,
    type: 'info',
    ...rest,
    visible: true,
    innerRef: toastManagerRef,
    container,
    onExited: () => {
      // 卸载
      if (container) {
        unmountComponentAtNode(container)
        Container.removeContainer(selectorId)
      }

      container = undefined
    },
    onConfirm: () => {
      onConfirm?.()
      toastManagerRef.current?.close()
    },
    onCancel: () => {
      onCancel?.()
      toastManagerRef.current?.close()
    },
    children: <div style={{ paddingLeft: 32 }}>{content}</div>,
  })

  requestAnimationFrame(() => {
    render(ClonedModal, container)
  })
}

export interface ModalApiProps
  extends Pick<
    ModalProps,
    | 'onConfirm'
    | 'onCancel'
    | 'title'
    | 'cancelText'
    | 'confirmText'
    | 'className'
    | 'type'
    | 'closeable'
    | 'showMask'
    | 'showHeaderDivider'
    | 'closeOnEsc'
    | 'maskClosable'
  > {
  /**
   * 	confirm 的内容
   */
  content?: React.ReactNode
}

export function withModal(instance: typeof Modal) {
  return Object.assign(instance, { confirm: open })
}
