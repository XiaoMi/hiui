
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-chat-forwarding-filled')

export const ChatForwardingFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5190"  ><path d="M955.733333 505.962667c0 213.76-181.248 378.389333-443.733333 378.389333-44.586667 0-83.370667-1.386667-135.509333-17.984-10.645333-3.392-23.146667-8.362667-32.341334-12.181333l-1.28-0.554667-87.829333 36.416c-64.853333 26.88-130.922667-35.84-107.434667-101.994667l15.744-44.458666C99.306667 678.912 68.266667 588.266667 68.266667 505.941333 68.266667 292.245333 249.514667 127.573333 512 127.573333c262.485333 0 443.733333 164.650667 443.733333 378.410667zM695.253333 535.04a38.4 38.4 0 0 0 0-54.314667l-105.6-105.578666a38.4 38.4 0 1 0-54.293333 54.293333l40.234667 40.234667h-195.52a38.4 38.4 0 0 0 0.021333 76.8h195.136l-39.893333 39.850666a38.4 38.4 0 1 0 54.314666 54.293334l105.6-105.578667z" p-id="5191"></path></svg>
    )
  }
)

if (__DEV__) {
  ChatForwardingFilled.displayName = 'ChatForwardingFilled'
}
  