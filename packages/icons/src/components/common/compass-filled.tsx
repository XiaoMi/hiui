
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-compass-filled')

export const CompassFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9656"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m156.16 304.085334a21.333333 21.333333 0 0 0-27.178667-27.157334l-182.229333 63.509334a64 64 0 0 0-39.381333 39.381333l-63.509334 182.229333a21.333333 21.333333 0 0 0 27.157334 27.157334l182.229333-63.509334a64 64 0 0 0 39.381333-39.381333l63.509334-182.229333z" p-id="9657"></path></svg>
    )
  }
)

if (__DEV__) {
  CompassFilled.displayName = 'CompassFilled'
}
  