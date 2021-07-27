
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-camera-filled'
const _prefix = getPrefixCls(_role)

export const CameraFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M722.63 128a12 12 0 0 1 11.642 9.09L770 272h174a8 8 0 0 1 8 8v608a8 8 0 0 1-8 8H80a8 8 0 0 1-8-8V280a8 8 0 0 1 8-8h174l35.728-134.91a12 12 0 0 1 11.64-9.09h421.262zM512 396c-92.784 0-168 75.216-168 168s75.216 168 168 168 168-75.216 168-168-75.216-168-168-168z" p-id="11745"></path></svg>
    )
  }
)

if (__DEV__) {
  CameraFilled.displayName = 'CameraFilled'
}
  