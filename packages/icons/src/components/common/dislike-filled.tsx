
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-dislike-filled')

export const DislikeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9309"  ><path d="M659.285333 890.496l-18.474666 10.666667a128 128 0 0 1-174.869334-46.848l-108.565333-188.032a127.616 127.616 0 0 1-38.250667-91.264v-341.333334a128 128 0 0 1 128-128h336.981334a128 128 0 0 1 126.72 109.909334l48.768 341.333333a128 128 0 0 1-126.72 146.090667h-110.72a149.354667 149.354667 0 0 1-62.869334 187.477333zM148.458667 107.669333a85.333333 85.333333 0 0 0-85.333334 85.333334v320a85.333333 85.333333 0 0 0 85.333334 85.333333h21.333333a85.333333 85.333333 0 0 0 85.333333-85.333333v-320a85.333333 85.333333 0 0 0-85.333333-85.333334h-21.333333z" p-id="9310"></path></svg>
    )
  }
)

if (__DEV__) {
  DislikeFilled.displayName = 'DislikeFilled'
}
  