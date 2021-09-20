import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { MessageManager } from './MessageManager'
import * as Container from '@hi-ui/container'
import { MessageProps, _prefix } from './Message'

const messageApiSelector = `.${_prefix}__portal`

export class MessageAPI {
  private messageManager: any
  private container: any

  constructor() {
    this.initManager()
  }

  initManager() {
    this.container = Container.getContainer(messageApiSelector)
    this.messageManager = React.createRef<any>()

    render(<MessageManager ref={this.messageManager} />, this.container)
  }

  open = (props: MessageProps) => {
    if (!this.container) {
      this.initManager()
    }

    return this.messageManager.current?.open(props)
  }

  close = (id: React.ReactText) => {
    this.messageManager.current?.close(id)
  }

  closeAll = () => {
    this.messageManager.current?.closeAll()
  }

  destroy = () => {
    unmountComponentAtNode(this.container)
    Container.removeContainer(messageApiSelector)
    this.container = null
    this.messageManager = null
  }
}

export const Message = new MessageAPI()
