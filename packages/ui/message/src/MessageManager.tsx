import React, { Component } from 'react'
import { Message } from './Message'

type MessageOptions = {
  id?: React.ReactText
  type?: 'info' | 'success' | 'error' | 'warning'
  title: string
  duration?: number
  closeable?: boolean
  onClose?: () => void
}

type State = { queue: MessageOptions[] }

interface Props {
  prefixCls?: string
}

export class MessageManager extends Component<Props, State> {
  static counter = 0
  static defaultProps = {
    prefixCls: 'hi-v4-message-manager',
  }

  state: State = {
    queue: [],
  }

  add = (notice: MessageOptions) => {
    this.setState((prev) => {
      return {
        queue: prev.queue.concat(notice),
      }
    })
  }

  remove = (id: React.ReactText) => {
    this.setState((prev) => {
      return {
        queue: prev.queue.filter((item) => item.id !== id),
      }
    })
  }

  create = (options: MessageOptions): MessageOptions => {
    MessageManager.counter++
    const { id: idOption, onClose } = options
    const id = idOption ?? MessageManager.counter

    return {
      ...options,
      id,
      onClose: () => {
        this.remove(id)
        onClose?.()
      },
    }
  }

  open = (message: MessageOptions) => {
    const option = this.create(message)
    this.add(option)
    return option.id
  }

  close = (id: React.ReactText) => {
    this.setState((prev) => {
      return {
        queue: prev.queue.map((item) => (item.id === id ? { ...item, visible: false } : item)),
      }
    })
  }

  closeAll = () => {
    this.setState((prev) => {
      return {
        queue: prev.queue.map((item) => ({ ...item, visible: false })),
      }
    })
  }

  render() {
    const { queue } = this.state
    const { prefixCls } = this.props

    return (
      <div className={prefixCls}>
        {queue.map(({ id, ...notice }) => (
          <Message key={id} {...notice}>
            {notice.title}
          </Message>
        ))}
      </div>
    )
  }
}
