
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pad-outlined')

export const PadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22862"  ><path d="M832 793.6a25.6 25.6 0 0 0 25.6-25.6V256a25.6 25.6 0 0 0-25.6-25.6H192A25.6 25.6 0 0 0 166.4 256v512A25.6 25.6 0 0 0 192 793.6h640zM192 870.4A102.4 102.4 0 0 1 89.6 768V256A102.4 102.4 0 0 1 192 153.6h640a102.4 102.4 0 0 1 102.4 102.4v512a102.4 102.4 0 0 1-102.4 102.4H192z" p-id="22863"></path><path d="M810.666667 512a53.333333 53.333333 0 1 1-106.666667 0 53.333333 53.333333 0 0 1 106.666667 0z" p-id="22864"></path></svg>
    )
  }
)

if (__DEV__) {
  PadOutlined.displayName = 'PadOutlined'
}
  