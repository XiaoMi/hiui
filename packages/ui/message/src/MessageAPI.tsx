import React from 'react'
import { Message as MessageComponent, MessageProps, _prefix } from './Message'
import { ToastAPI, ToastAPIOptions } from '@hi-ui/toast'

export class MessageAPI extends ToastAPI<MessageOptions> {
  static defaultOptions = {
    prefixCls: _prefix,
  }

  constructor(options: MessageAPIOptions) {
    super(options)

    if (options.prefixCls === undefined) {
      this.options.prefixCls = MessageAPI.defaultOptions.prefixCls
    }

    this.initManager()
  }
}

export interface MessageAPIOptions extends ToastAPIOptions {}

export interface MessageOptions extends Omit<MessageProps, '$destroy' | 'id'> {
  /**
   * 通知唯一标识
   */
  id?: React.ReactText
}

export const message = new MessageAPI({ component: MessageComponent })
