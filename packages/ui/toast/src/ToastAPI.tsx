import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { ToastManager, ToastOptions } from './ToastManager'
import * as Container from '@hi-ui/container'
import { _prefix } from './Toast'

const toastApiSelector = `.${_prefix}__portal`

export class ToastAPI {
  private toastManager!: React.RefObject<ToastManager>
  private container!: Element | undefined
  private selector!: string

  constructor(selector: string = toastApiSelector) {
    this.selector = selector
    this.initManager()
  }

  static create(selector: string) {
    return new ToastAPI(selector)
  }

  initManager() {
    this.container = Container.getContainer(this.selector)
    this.toastManager = React.createRef<ToastManager>()

    render(<ToastManager ref={this.toastManager} />, this.container)
  }

  open = (props: ToastOptions) => {
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
