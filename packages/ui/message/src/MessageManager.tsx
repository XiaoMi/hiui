import React, { Component } from 'react'
import { Message } from './Message'

type MessageOptions = {
  id?: React.ReactText
  type?: 'info' | 'success' | 'error' | 'warning'
  title: string
  duration?: number
  status?: 'entering' | 'active' | 'exiting'
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
    const id = options.id ?? MessageManager.counter

    return {
      ...options,
      id,
      status: 'entering',
      onClose: () => this.remove(id),
    }
  }

  open = (message: MessageOptions) => {
    this.add(this.create(message))
  }

  close = (id: React.ReactText) => {
    this.setState((prev) => {
      return {
        queue: prev.queue.map((item) => (item.id === id ? { ...item, status: 'exiting' } : item)),
      }
    })
  }

  closeAll = () => {
    this.setState((prev) => {
      return {
        queue: prev.queue.map((item) => ({ ...item, status: 'exiting' })),
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
