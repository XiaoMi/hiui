
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-location-filled'
const _prefix = getPrefixCls(_role)

export const LocationFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c200.298667 0 362.666667 162.368 362.666667 362.666667 0 130.602667-106.581333 276.8-315.84 444.032l-20.565334 16.256-26.261333 20.522667-26.261333-20.522667-20.565334-16.256C255.893333 724.778667 149.333333 578.602667 149.333333 448c0-200.298667 162.368-362.666667 362.666667-362.666667z m0 256a106.666667 106.666667 0 1 0 0 213.333334 106.666667 106.666667 0 0 0 0-213.333334z" p-id="15111"></path></svg>
    )
  }
)

if (__DEV__) {
  LocationFilled.displayName = 'LocationFilled'
}
  