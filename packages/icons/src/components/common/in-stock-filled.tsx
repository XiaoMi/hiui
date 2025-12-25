
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-in-stock-filled')

export const InStockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5014"  ><path d="M456.384 139.584a102.4 102.4 0 0 1 111.232 0l298.666667 193.28a102.4 102.4 0 0 1 46.784 85.973333V810.666667a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V418.816a102.4 102.4 0 0 1 46.784-85.973333l298.666667-193.258667zM373.333333 665.6a38.4 38.4 0 0 0 0 76.8h277.333334a38.4 38.4 0 1 0 0-76.8h-277.333334z m0-149.333333a38.4 38.4 0 0 0 0 76.8h277.333334a38.4 38.4 0 1 0 0-76.8h-277.333334z" p-id="5015"></path></svg>
    )
  }
)

if (__DEV__) {
  InStockFilled.displayName = 'InStockFilled'
}
  