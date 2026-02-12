import React from 'react'
import ReactDOM from 'react-dom'
import * as Container from '@hi-ui/container'
import { uuid } from '@hi-ui/use-id'
import { modalPrefix } from '@hi-ui/modal'
import { EnhancedModal, type EnhancedModalProps } from './component'

const selector = `.${modalPrefix}-wrapper`
const modals: Record<string, () => void> = {}

const open = (props: ModalApiProps = {}) => {
  const { content, ...rest } = props

  // 支持多个 Modal 共存
  const selectorId = `${selector}__${uuid()}`
  let container = Container.getContainer(selectorId) as HTMLElement | undefined

  const closeModal = () => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container)
      Container.removeContainer(selectorId)
    }

    container = undefined
  }

  const ClonedModal = React.createElement(EnhancedModal, {
    width: (rest.size ?? 400) as React.ReactText,
    showHeaderDivider: false,
    // type: 'info',
    ...rest,
    // visible: true,
    container,
    // 卸载
    onExited: () => {
      closeModal()
    },
    children: content,
  })

  requestAnimationFrame(() => {
    if (!container) return null
    ReactDOM.render(ClonedModal, container)
  })

  return { closeModal, id: selectorId }
}

export type ModalApiProps = Omit<EnhancedModalProps, 'content'> & {
  content?: React.ReactNode
}

export const ModalApi = {
  open: (props?: ModalApiProps) => {
    const { closeModal, id } = open(props)
    modals[id] = closeModal
    return id
  },
  close: (id: string) => {
    if (modals[id]) {
      modals[id]()
      delete modals[id]
    }
  },
  closeAll: () => {
    Object.keys(modals).forEach((id) => {
      if (modals[id]) {
        modals[id]()
        delete modals[id]
      }
    })
  },
}
