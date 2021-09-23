import React from 'react'
import { Notification as NotificationComponent, NotificationProps, _prefix } from './Notification'
import { ToastAPI, ToastAPIOptions } from '@hi-ui/toast'

export class NotificationAPI extends ToastAPI<NotificationOptions> {
  static defaultOptions = {
    prefixCls: _prefix,
  }

  constructor(options: NotificationAPIOptions) {
    super(options)

    if (options.prefixCls === undefined) {
      this.options.prefixCls = NotificationAPI.defaultOptions.prefixCls
    }

    this.initManager()
  }
}

export interface NotificationAPIOptions extends ToastAPIOptions {}

export interface NotificationOptions extends Omit<NotificationProps, '$destroy' | 'id'> {
  /**
   * 通知唯一标识
   */
  id?: React.ReactText
}

export const notification = new NotificationAPI({ component: NotificationComponent })
