import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { MessageManager } from './MessageManager'
import Container from '@hi-ui/container'
import { _prefix } from './Message'

const messageApiSelector = '.' + _prefix

export class MessageAPI {
  private messageManager: any
  private container: any

  constructor() {
    this.container = Container.getContainer(messageApiSelector)

    this.messageManager = React.createRef<any>()

    render(<MessageManager ref={this.messageManager} />, this.container)
  }

  open = (props: any) => {
    this.messageManager.current?.open(props)
  }

  close = (id: React.ReactText) => {
    this.messageManager.current?.close(id)
  }

  destroy = () => {
    unmountComponentAtNode(this.container)
    Container.removeContainer(messageApiSelector)
  }
}

export const Message = new MessageAPI()
