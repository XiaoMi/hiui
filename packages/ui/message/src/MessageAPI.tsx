import React from 'react'
import { Message as MessageComponent, MessageProps, _prefix } from './Message'
import { ToastAPI } from '@hi-ui/toast'

export const Message = new ToastAPI<MessageOptions>({
  prefixCls: _prefix,
  component: MessageComponent,
})

export interface MessageOptions extends Omit<MessageProps, '$destroy' | 'id'> {
  /**
   * 通知唯一标识
   */
  id?: React.ReactText
}
