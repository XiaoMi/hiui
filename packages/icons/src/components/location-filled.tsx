
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-location-filled'
const _prefix = getPrefixCls(_role)

export const LocationFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M787.772 164.044c151.08 151.08 152.83 394.852 5.07 547.492l-4.524 4.598L518.352 986.1a8.22 8.22 0 0 1-11.624-0.012l-270.5-270.5C83.622 562.98 83.38 315.8 235.682 163.498c152.304-152.304 399.484-152.06 552.09 0.546zM512 290c-83.948 0-152 68.052-152 152s68.052 152 152 152 152-68.052 152-152-68.052-152-152-152z" p-id="11895"></path></svg>
    )
  }
)

if (__DEV__) {
  LocationFilled.displayName = 'LocationFilled'
}
  