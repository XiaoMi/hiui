
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-square-outlined')

export const CheckSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="41263"  ><path d="M836.266667 213.333333A25.6 25.6 0 0 0 810.666667 187.733333H213.333333A25.6 25.6 0 0 0 187.733333 213.333333v597.333334a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V213.333333z m76.8 597.333334a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 810.666667V213.333333A102.4 102.4 0 0 1 213.333333 110.933333h597.333334a102.4 102.4 0 0 1 102.4 102.4v597.333334z" p-id="41264"></path><path d="M658.602667 400.021333a38.4 38.4 0 0 1 55.317333 53.290667l-185.386667 192.426667a81.066667 81.066667 0 0 1-118.229333-1.557334l-78.848-86.314666-17.493333-17.749334a38.4 38.4 0 1 1 54.72-53.866666l17.877333 18.133333 0.512 0.512 0.469333 0.533333 79.466667 86.954667a4.266667 4.266667 0 0 0 6.229333 0.064l185.386667-192.426667z" p-id="41265"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckSquareOutlined.displayName = 'CheckSquareOutlined'
}
  