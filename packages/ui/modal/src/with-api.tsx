import React, { createRef, createElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'

import { modalPrefix, Modal, ModalProps } from './Modal'

const prefixCls = modalPrefix
const selector = `.${prefixCls}-wrapper`

const modalInstanceCache: {
  [key: string]: () => void
} = {}

// TODO： 抽离合并到 Toast API
const open = ({ key, onConfirm, onCancel, content, ...rest }: ModalApiProps = {}) => {
  if (!key) {
    key = uuid()
  }

  const selectorId = `${selector}__${key}`
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
    onConfirm: async () => {
      toastManagerRef.current?.updateConfirmLoading(true)

      try {
        await onConfirm?.()
      } catch (error) {
        console.log('onConfirm error', error)
      } finally {
        toastManagerRef.current?.updateConfirmLoading(false)
      }

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

  const close = () => {
    toastManagerRef.current?.close()
  }

  if (key) {
    modalInstanceCache[key] = close
  }

  return key
}

const close = (key: string) => {
  if (typeof modalInstanceCache[key] === 'function') {
    modalInstanceCache[key]()
  }

  delete modalInstanceCache[key]
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
  /**
   * 组件实例唯一标识
   */
  key?: string
}

export function withModal(instance: typeof Modal) {
  return Object.assign(instance, { confirm: open, close })
}
