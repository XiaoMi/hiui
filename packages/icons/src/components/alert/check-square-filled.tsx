
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-square-filled')

export const CheckSquareFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13591"  ><path d="M810.666667 110.933333a102.4 102.4 0 0 1 102.4 102.4v597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334z m-97.770667 288.085334a38.4 38.4 0 0 0-54.293333 1.002666l-185.386667 192.426667a4.266667 4.266667 0 0 1-6.208-0.064l-79.466667-86.954667-0.469333-0.533333-0.512-0.490667-17.877333-18.154666a38.4 38.4 0 1 0-54.698667 53.866666l17.493333 17.749334 78.826667 86.314666a81.066667 81.066667 0 0 0 118.229333 1.557334l185.386667-192.426667a38.4 38.4 0 0 0-1.024-54.293333z" p-id="13592"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckSquareFilled.displayName = 'CheckSquareFilled'
}
  