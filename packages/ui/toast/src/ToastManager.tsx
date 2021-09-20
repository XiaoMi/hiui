import React, { Component } from 'react'
import { Toast, ToastProps } from './Toast'
import { cx, getPrefixCls } from '@hi-ui/classname'

const _role = 'toast'
export const _prefix = getPrefixCls(_role)

export class ToastManager extends Component<ToastManagerProps, ToastManagerState> {
  static counter = 0
  static defaultProps = {
    prefixCls: _prefix,
    placement: 'top',
  }

  state: ToastManagerState = {
    queue: [],
  }

  add = (notice: ToastProps) => {
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

  create = (options: ToastOptions): ToastProps => {
    ToastManager.counter++
    const { id: idOption, onClose } = options
    const id = idOption ?? ToastManager.counter

    return {
      ...options,
      id,
      onClose: () => {
        this.remove(id)
        onClose?.()
      },
    }
  }

  open = (toast: ToastOptions) => {
    const option = this.create(toast)
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

  getStyle = (placement: ToastPlacement): React.CSSProperties => {
    let top: string | undefined
    let bottom: string | undefined
    let transform: string | undefined

    switch (placement) {
      case 'top':
        top = '0'
        break
      case 'bottom':
        bottom = '0'
        break
      case 'center':
        top = '50%'
        transform = `translateY('-50%')`
        break
    }

    return {
      zIndex: 1020,
      position: 'fixed',
      pointerEvents: 'none',
      transform,
      top,
      bottom,
      right: 0,
      left: 0,
    }
  }

  render() {
    const { queue } = this.state
    const { prefixCls, placement } = this.props

    return (
      <div
        className={cx(`${prefixCls}-manager`, `${prefixCls}-manager--placement-${placement}`)}
        style={this.getStyle(placement!)}
      >
        {queue.map((notice) => (
          <Toast key={notice.id} {...notice} />
        ))}
      </div>
    )
  }
}

type ToastManagerState = { queue: ToastProps[] }

type ToastPlacement = 'top' | 'bottom' | 'center'

interface ToastManagerProps {
  prefixCls?: string
  placement?: ToastPlacement
}

export interface ToastOptions extends Omit<ToastProps, 'id'> {
  id?: React.ReactText
}
