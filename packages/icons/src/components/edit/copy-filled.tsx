
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-copy-filled')

export const CopyFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31944"  ><path d="M725.333333 810.666667a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V362.666667a64 64 0 0 1 64-64h448a64 64 0 0 1 64 64v448z" p-id="31945"></path><path d="M187.733333 810.666667a25.6 25.6 0 0 0 25.6 25.6h448a25.6 25.6 0 0 0 25.6-25.6V362.666667a25.6 25.6 0 0 0-25.6-25.6H213.333333A25.6 25.6 0 0 0 187.733333 362.666667v448zM110.933333 362.666667a102.4 102.4 0 0 1 102.4-102.4h448a102.4 102.4 0 0 1 102.4 102.4v448a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V362.666667z" p-id="31946"></path><path d="M913.066667 213.333333v384a102.4 102.4 0 0 1-102.4 102.4v-76.8a25.6 25.6 0 0 0 25.6-25.6V213.333333A25.6 25.6 0 0 0 810.666667 187.733333H426.666667a25.6 25.6 0 0 0-25.6 25.6h-76.8A102.4 102.4 0 0 1 426.666667 110.933333h384a102.4 102.4 0 0 1 102.4 102.4z" p-id="31947"></path></svg>
    )
  }
)

if (__DEV__) {
  CopyFilled.displayName = 'CopyFilled'
}
  