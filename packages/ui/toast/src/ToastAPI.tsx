import React from 'react'
import getReactDomRender from '@hi-ui/react-compat'
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
  protected mockUnmount: () => void = () => {}

  constructor(toastAPIOptions: ToastAPIOptions) {
    this.options = withDefaultProps(toastAPIOptions, ToastAPI.defaultOptions)
    // Ensure that Toast is a singleton.
    this.id = uuid()
    this.initManager(this.options.container)
  }

  static create(options: ToastAPIOptions) {
    return new ToastAPI(options)
  }

  get selector() {
    return `.${this.options.prefixCls}__portal__${this.id}`
  }

  initManager(container?: HTMLElement) {
    this.container = Container.getContainer(this.selector, document, container)
    this.toastManager = React.createRef<ToastManager>()

    const node = <ToastManager {...this.options} ref={this.toastManager} />
    const mockRender = getReactDomRender()
    this.mockUnmount = mockRender(node, this.container)
  }

  open = (props: T) => {
    if (!this.container) {
      this.initManager(this.options.container as HTMLElement)
    }

    return this.toastManager.current?.open(props as ToastEventOptions)
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
      this.mockUnmount()
      Container.removeContainer(this.selector)
    }
    this.container = undefined
  }
}

export interface ToastAPIOptions extends ToastManagerProps {}
