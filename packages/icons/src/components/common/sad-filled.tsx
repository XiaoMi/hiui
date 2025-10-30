
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-sad-filled')

export const SadFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10063"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m0 480c-62.08 0-125.781333 31.061333-159.701333 80.746667a38.4 38.4 0 1 0 63.402666 43.306667C433.941333 656.256 472.768 635.733333 512 635.733333c39.232 0 78.058667 20.522667 96.298667 47.253334a38.4 38.4 0 1 0 63.402666-43.306667C637.781333 589.994667 574.08 558.933333 512 558.933333zM384 384a42.666667 42.666667 0 0 0-42.666667 42.666667v21.333333a42.666667 42.666667 0 1 0 85.333334 0v-21.333333a42.666667 42.666667 0 0 0-42.666667-42.666667z m256 0a42.666667 42.666667 0 0 0-42.666667 42.666667v21.333333a42.666667 42.666667 0 1 0 85.333334 0v-21.333333a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="10064"></path></svg>
    )
  }
)

if (__DEV__) {
  SadFilled.displayName = 'SadFilled'
}
  