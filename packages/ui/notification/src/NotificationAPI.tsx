import React from 'react'
import { Notification as NotificationComponent, NotificationProps, _prefix } from './Notification'
import { ToastAPI } from '@hi-ui/toast'

export const Notification = new ToastAPI<NotificationOptions>({
  prefixCls: _prefix,
  component: NotificationComponent,
})

export interface NotificationOptions extends Omit<NotificationProps, '$destroy' | 'id'> {
  /**
   * 通知唯一标识
   */
  id?: React.ReactText
}
