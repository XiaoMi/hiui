import React, { createRef, createElement } from 'react'
import getReactDomRender from '@hi-ui/react-compat'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'
import { __DEV__ } from '@hi-ui/env'

import { modalPrefix, Modal, ModalProps } from './Modal'

const STATIC_CONTEXT_WARNING =
  'Static API `Modal.confirm` creates a new React root and cannot access React Context (e.g. theme, i18n). Prefer `Modal.useModal()` and place the returned contextHolder under your providers.'

const prefixCls = modalPrefix
const selector = `.${prefixCls}-wrapper`

const modalInstanceCache: {
  [key: string]: () => void
} = {}

// TODO： 抽离合并到 Toast API
const open = ({ key, onConfirm, onCancel, content, width = 400, ...rest }: ModalApiProps = {}) => {
  if (__DEV__) {
    console.warn(STATIC_CONTEXT_WARNING)
  }
  if (!key) {
    key = uuid()
  }

  const selectorId = `${selector}__${key}`
  let container: any = Container.getContainer(selectorId)
  let mockUnmount: any = null

  const toastManagerRef: NonNullable<ModalProps['innerRef']> = createRef<any>()

  const ClonedModal = createElement(Modal, {
    width,
    showHeaderDivider: false,
    type: 'info',
    ...rest,
    visible: true,
    innerRef: toastManagerRef,
    container,
    onExited: () => {
      // 卸载
      if (container) {
        mockUnmount()
        Container.removeContainer(selectorId)
      }

      container = undefined
    },
    onConfirm: async () => {
      toastManagerRef.current?.updateConfirmLoading(true)

      try {
        await onConfirm?.()
      } catch (error) {
        return
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
    const mockRender = getReactDomRender()
    mockUnmount = mockRender(ClonedModal, container)
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

export interface ModalApiProps extends Omit<ModalProps, 'visible' | 'innerRef'> {
  /**
   * 	confirm 的内容
   */
  content?: React.ReactNode
  /**
   * 组件实例唯一标识
   */
  key?: string
}

export const staticApis = {
  confirm: open,
  // 新增 open 方法暴露，与其他组件的静态 api 保持一致
  open,
  close,
}

// 其实内部没再使用了，保持导出以维持兼容性
export function withModal(instance: typeof Modal) {
  return Object.assign(instance, { confirm: open, close })
}
