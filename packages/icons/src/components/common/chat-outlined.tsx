
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-chat-outlined')

export const ChatOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14178"  ><path d="M373.333333 480.128a53.333333 53.333333 0 1 1-106.666666 0 53.333333 53.333333 0 0 1 106.666666 0zM565.333333 480.128a53.333333 53.333333 0 1 1-106.666666 0 53.333333 53.333333 0 0 1 106.666666 0zM757.333333 480.128a53.333333 53.333333 0 1 1-106.666666 0 53.333333 53.333333 0 0 1 106.666666 0z" p-id="14179"></path><path d="M857.6 237.141333a25.6 25.6 0 0 0-25.6-25.6H192a25.6 25.6 0 0 0-25.6 25.6v447.722667a25.6 25.6 0 0 0 25.6 25.6h196.608c35.050667 0 67.669333 17.92 86.464 47.530667l33.322667 52.48a4.266667 4.266667 0 0 0 7.210666 0l33.322667-52.48a102.442667 102.442667 0 0 1 86.464-47.530667H832a25.6 25.6 0 0 0 25.6-25.6V237.141333z m76.8 447.722667a102.4 102.4 0 0 1-102.4 102.4h-196.608c-8.746667 0-16.917333 4.48-21.632 11.882667l-33.322667 52.501333c-31.850667 50.154667-105.024 50.154667-136.874666 0l-33.344-52.48a25.642667 25.642667 0 0 0-21.610667-11.904H192a102.4 102.4 0 0 1-102.4-102.4V237.141333a102.4 102.4 0 0 1 102.4-102.4h640a102.4 102.4 0 0 1 102.4 102.4v447.722667z" p-id="14180"></path></svg>
    )
  }
)

if (__DEV__) {
  ChatOutlined.displayName = 'ChatOutlined'
}
  