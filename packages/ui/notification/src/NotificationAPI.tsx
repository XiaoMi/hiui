import {
  Notification as NotificationComponent,
  NotificationProps,
  notificationPrefix,
} from './Notification'
import { ToastAPI, ToastAPIOptions } from '@hi-ui/toast'
import { withDefaultProps } from '@hi-ui/react-utils'

export class NotificationAPI extends ToastAPI<NotificationOptions> {
  static defaultOptions = {
    prefixCls: notificationPrefix,
  }

  constructor(options: NotificationAPIOptions) {
    options = withDefaultProps(options, NotificationAPI.defaultOptions)
    super(options)
  }
}

export interface NotificationAPIOptions extends ToastAPIOptions {}

export interface NotificationOptions extends Omit<NotificationProps, 'destroy' | 'visible'> {}

export const createNotification = (options?: Omit<NotificationAPIOptions, 'component'>) => {
  return new NotificationAPI({ component: NotificationComponent, ...options })
}

export const notification = createNotification({})
