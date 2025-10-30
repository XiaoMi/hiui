
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-end-date-filled')

export const EndDateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9744"  ><path d="M870.4 486.4a42.666667 42.666667 0 0 1 42.666667 42.666667v292.266666a102.4 102.4 0 0 1-102.4 102.4H213.333333a102.4 102.4 0 0 1-102.4-102.4V529.066667a42.666667 42.666667 0 0 1 42.666667-42.666667h716.8zM661.333333 750.933333a38.4 38.4 0 1 0 0 76.8h106.666667a38.4 38.4 0 1 0 0-76.8h-106.666667z" p-id="9745"></path><path d="M661.333333 100.266667a38.4 38.4 0 0 1 38.4 38.4v46.933333H810.666667a102.4 102.4 0 0 1 102.4 102.4v78.933333a42.666667 42.666667 0 0 1-42.666667 42.666667H153.6a42.666667 42.666667 0 0 1-42.666667-42.666667v-78.933333A102.4 102.4 0 0 1 213.333333 185.6h110.933334V138.666667a38.4 38.4 0 1 1 76.8 0v46.933333h221.866666V138.666667A38.4 38.4 0 0 1 661.333333 100.266667z" p-id="9746"></path></svg>
    )
  }
)

if (__DEV__) {
  EndDateFilled.displayName = 'EndDateFilled'
}
  