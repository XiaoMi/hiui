
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-message-filled')

export const MessageFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26157"  ><path d="M832 134.762667a102.4 102.4 0 0 1 102.4 102.4v447.722666a102.4 102.4 0 0 1-102.4 102.4h-196.608c-8.746667 0-16.917333 4.48-21.632 11.882667l-33.322667 52.501333c-31.850667 50.154667-105.024 50.154667-136.874666 0l-33.344-52.48a25.642667 25.642667 0 0 0-21.610667-11.904H192a102.4 102.4 0 0 1-102.4-102.4V237.162667a102.4 102.4 0 0 1 102.4-102.4h640z m-448 362.666666a38.4 38.4 0 1 0 0 76.8h256a38.4 38.4 0 1 0 0-76.8H384z m0-149.333333a38.4 38.4 0 1 0 0 76.8h256a38.4 38.4 0 1 0 0-76.8H384z" p-id="26158"></path></svg>
    )
  }
)

if (__DEV__) {
  MessageFilled.displayName = 'MessageFilled'
}
  