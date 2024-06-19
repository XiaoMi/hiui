import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import * as Container from '@hi-ui/container'
import { ToastManager, ToastManagerProps, _prefix } from './ToastManager'
import { ToastEventOptions } from './types'
import { withDefaultProps } from '@hi-ui/react-utils'
import { uuid } from '@hi-ui/use-id'

export class ToastAPI<T = ToastEventOptions> {
  static defaultOptions = {
    prefixCls: _prefix,
  }

  protected toastManager!: React.RefObject<ToastManager>
  protected container!: Element | undefined
  protected options!: ToastAPIOptions
  protected id!: string

  constructor(toastAPIOptions: ToastAPIOptions) {
    this.options = withDefaultProps(toastAPIOptions, ToastAPI.defaultOptions)

    // Ensure that Toast is a singleton.
    this.id = uuid()

    this.initManager()
  }

  static create(options: ToastAPIOptions) {
    return new ToastAPI(options)
  }

  get selector() {
    return `.${this.options.prefixCls}__portal__${this.id}`
  }

  initManager() {
    this.container = Container.getContainer(this.selector)
    this.toastManager = React.createRef<ToastManager>()

    render(<ToastManager {...this.options} ref={this.toastManager} />, this.container)
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
