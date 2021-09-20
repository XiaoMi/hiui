import React, { Component } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { ToastPlacement, ToastOptions, ToastEventOptions } from './types'
import { isFunction } from '@hi-ui/type-assertion'

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

  add = (notice: ToastOptions) => {
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

  create = (options: ToastEventOptions): ToastOptions => {
    ToastManager.counter++
    const id = options.id ?? ToastManager.counter

    return {
      ...options,
      id,
      $destroy: () => this.remove(id),
    }
  }

  open = <T extends ToastEventOptions>(toast: T) => {
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
    const { prefixCls, placement, component: As, render } = this.props

    return (
      <div
        className={cx(`${prefixCls}-manager`, `${prefixCls}-manager--placement-${placement}`)}
        style={this.getStyle(placement!)}
      >
        {queue.map((notice) => {
          if (As) return <As key={notice.id} {...notice} />

          if (isFunction(render)) return render(notice)

          return notice.title
        })}
      </div>
    )
  }
}

type ToastManagerState = { queue: ToastOptions[] }

export interface ToastManagerProps {
  /**
   * 样式前缀
   */
  prefixCls?: string
  /**
   * 自定义组件渲染 toast 内容
   */
  component?: React.ComponentType<any>

  /**
   * 自定义函数渲染 toast 内容
   */
  render?: <T extends ToastOptions>(options: T) => React.ReactNode
  /**
   * 放置 toast 的位置
   */
  placement?: ToastPlacement
}
