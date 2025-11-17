
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-chat-filled')

export const ChatFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8408"  ><path d="M832 134.741333a102.4 102.4 0 0 1 102.4 102.4v447.722667a102.4 102.4 0 0 1-102.4 102.4h-196.608c-8.746667 0-16.917333 4.48-21.632 11.882667l-33.322667 52.501333c-31.850667 50.154667-105.024 50.154667-136.874666 0l-33.344-52.48a25.642667 25.642667 0 0 0-21.610667-11.904H192a102.4 102.4 0 0 1-102.4-102.4V237.141333a102.4 102.4 0 0 1 102.4-102.4h640z m-512 283.733334a53.333333 53.333333 0 1 0 0 106.666666 53.333333 53.333333 0 0 0 0-106.666666z m192 0a53.333333 53.333333 0 1 0 0 106.666666 53.333333 53.333333 0 0 0 0-106.666666z m192 0a53.333333 53.333333 0 1 0 0 106.666666 53.333333 53.333333 0 0 0 0-106.666666z" p-id="8409"></path></svg>
    )
  }
)

if (__DEV__) {
  ChatFilled.displayName = 'ChatFilled'
}
  