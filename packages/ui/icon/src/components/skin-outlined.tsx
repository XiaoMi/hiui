
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-skin-outlined'
const _prefix = getPrefixCls(_role)

export const SkinOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M378 78c0 71.798 58.202 130 130 130s130-58.202 130-130h272a8 8 0 0 1 8 8v344a8 8 0 0 1-8 8h-102v500a8 8 0 0 1-8 8H216a8 8 0 0 1-8-8V438H106a8 8 0 0 1-8-8V86a8 8 0 0 1 8-8h272z m460 80h-135.784l-0.72 1.74c-31.454 74.368-104.528 126.846-190.024 128.232L508 288c-86.984 0-161.618-52.886-193.498-128.26l-0.72-1.74H178v200h110l-0.002 508h440L728 358h110V158z" p-id="12275"></path></svg>
    )
  }
)

if (__DEV__) {
  SkinOutlined.displayName = 'SkinOutlined'
}
  