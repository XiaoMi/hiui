
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-circle-filled')

export const CheckCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13194"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m202.112 320.085334a38.4 38.4 0 0 0-54.293333 1.002666l-185.386667 192.426667a4.266667 4.266667 0 0 1-6.229333-0.064l-79.445334-86.954667-0.490666-0.533333-0.490667-0.490667-17.877333-18.154666a38.4 38.4 0 1 0-54.72 53.866666l17.493333 17.749334 78.848 86.314666a81.066667 81.066667 0 0 0 118.229333 1.557334l185.386667-192.426667a38.4 38.4 0 0 0-1.024-54.293333z" p-id="13195"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckCircleFilled.displayName = 'CheckCircleFilled'
}
  