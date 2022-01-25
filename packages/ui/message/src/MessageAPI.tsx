import { Message as MessageComponent, MessageProps, _prefix } from './Message'
import { ToastAPI, ToastAPIOptions } from '@hi-ui/toast'
import { withDefaultProps } from '@hi-ui/react-utils'

export class MessageAPI extends ToastAPI<MessageOptions> {
  static defaultOptions = {
    prefixCls: _prefix,
  }

  constructor(options: MessageAPIOptions) {
    options = withDefaultProps(options, MessageAPI.defaultOptions)
    super(options)
  }
}

export interface MessageAPIOptions extends ToastAPIOptions {}

export interface MessageOptions extends Omit<MessageProps, 'destroy' | 'visible'> {}

export const message = new MessageAPI({ component: MessageComponent })
