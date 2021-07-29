
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-check-outlined'
const _prefix = getPrefixCls(_role)

export const CheckOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M155.62 493.54a8 8 0 0 1 11.312 0l220.616 220.616 469.52-469.52a8 8 0 0 1 11.314 0l45.254 45.256a8 8 0 0 1 0 11.314L393.206 821.636a8 8 0 0 1-11.314 0L110.364 550.108a8 8 0 0 1 0-11.314l45.254-45.254z" p-id="13215"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckOutlined.displayName = 'CheckOutlined'
}
  