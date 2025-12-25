
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-wash-machine-filled')

export const WashMachineFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5014"  ><path d="M913.066667 358.4V810.666667a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V358.4h802.133334zM110.933333 213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334a102.4 102.4 0 0 1 102.4 102.4v68.266667H110.933333V213.333333zM341.333333 640a170.666667 170.666667 0 1 0 341.333334 0 170.666667 170.666667 0 0 0-341.333334 0z" p-id="5015"></path></svg>
    )
  }
)

if (__DEV__) {
  WashMachineFilled.displayName = 'WashMachineFilled'
}
  