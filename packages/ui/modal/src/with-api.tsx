import React, { createRef, createElement, cloneElement } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { ValueOf } from '@hi-ui/core'
import * as Container from '@hi-ui/container'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@hi-ui/icons'
import { _prefix, Modal, ModalProps } from './Modal'

const prefixCls = _prefix
const selector = `.${prefixCls}-wrapper`

// TODO: 抽离公告定义
export const ModalType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type ModalType = ValueOf<typeof ModalType>

const confirmIconMap = {
  // TODO: designToken 颜色抽离 css 为代码
  [ModalType.SUCCESS]: { icon: <CheckCircleOutlined />, color: '#14ca64' },
  [ModalType.ERROR]: { icon: <CloseCircleOutlined />, color: '#ff5959' },
  [ModalType.WARNING]: { icon: <ExclamationCircleOutlined />, color: '#fab007' },
  [ModalType.INFO]: { icon: <InfoCircleOutlined />, color: '#237ffa' },
}

// TODO： 抽离合并到 Toast API
const open = ({
  className,
  title,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type,
  content,
}: ModalApiProps = {}) => {
  // TODO: 考虑是否支持多个 Modal 共存
  let container: any = Container.getContainer(selector)

  const toastManagerRef = createRef<any>()

  const ClonedModal = createElement(Modal, {
    innerRef: toastManagerRef,
    className,
    container,
    title,
    confirmText,
    cancelText,
    visible: true,
    width: 480,
    height: 240,
    onExited: () => {
      // 卸载
      if (container) {
        unmountComponentAtNode(container)
        Container.removeContainer(selector)
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
    children: (
      <div style={{ display: 'flex', flex: 1 }}>
        {type && confirmIconMap[type]
          ? cloneElement(confirmIconMap[type].icon, {
              style: {
                color: confirmIconMap[type].color,
                fontSize: '48px',
                marginInlineEnd: 12,
              },
            })
          : null}
        {content}
      </div>
    ),
  })

  // TODO：存在弹出时延迟感
  render(ClonedModal, container)
}

export interface ModalApiProps
  extends Pick<
    ModalProps,
    'onConfirm' | 'onCancel' | 'title' | 'cancelText' | 'confirmText' | 'className'
  > {
  /**
   * 	confirm 的类型
   */
  type?: ModalType
  /**
   * 	confirm 的内容
   */
  content?: React.ReactNode
}

export function withModal(instance: typeof Modal) {
  return Object.assign(instance, { confirm: open })
}
