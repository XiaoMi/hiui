
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-right-outlined')

export const DirectionRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3217"  ><path d="M796.672 439.594667L540.224 183.168a38.4 38.4 0 1 0-54.293333 54.293333l256.426666 256.426667a25.6 25.6 0 0 1 0 36.224l-256.426666 256.426667a38.4 38.4 0 1 0 54.293333 54.314666l256.426667-256.426666a102.4 102.4 0 0 0 0-144.832z" p-id="3218"></path><path d="M519.338667 439.594667L262.890667 183.168a38.4 38.4 0 1 0-54.293334 54.293333l256.426667 256.426667a25.6 25.6 0 0 1 0 36.224l-256.426667 256.426667a38.4 38.4 0 1 0 54.293334 54.314666l256.426666-256.426666a102.4 102.4 0 0 0 0-144.832z" p-id="3219"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionRightOutlined.displayName = 'DirectionRightOutlined'
}
  