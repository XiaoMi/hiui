import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { ToastManager, ToastManagerProps, _prefix } from './ToastManager'
import { ToastEventOptions } from './types'

export class ToastAPI<T = ToastEventOptions> {
  protected toastManager!: React.RefObject<ToastManager>
  protected container!: Element | undefined
  protected options!: ToastAPIOptions

  constructor(toastAPIOptions: ToastAPIOptions) {
    const options = { ...toastAPIOptions }
    if (options.prefixCls === undefined) {
      options.prefixCls = _prefix
    }

    this.options = options
    this.initManager()
  }

  static create(options: ToastAPIOptions) {
    return new ToastAPI(options)
  }

  get selector() {
    return `.${this.options.prefixCls}__portal`
  }

  initManager() {
    this.container = Container.getContainer(this.selector)
    this.toastManager = React.createRef<ToastManager>()

    render(<ToastManager ref={this.toastManager} {...this.options} />, this.container)
  }

  open = (props: T) => {
    if (!this.container) {
      this.initManager()
    }
    return this.toastManager.current?.open(props)
  }

  close = (id: React.ReactText) => {
    if (!this.container) return
    this.toastManager.current?.close(id)
  }

  closeAll = () => {
    if (!this.container) return
    this.toastManager.current?.closeAll()
  }

  destroy = () => {
    if (this.container) {
      unmountComponentAtNode(this.container)
      Container.removeContainer(this.selector)
    }
    this.container = undefined
  }
}

export interface ToastAPIOptions extends ToastManagerProps {}
