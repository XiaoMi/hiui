
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-caret-down-outlined'
const _prefix = getPrefixCls(_role)

export const CaretDownOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M503.21 690.156L256.466 380.742a11.318 11.318 0 0 1 1.76-15.872 11.234 11.234 0 0 1 7.032-2.474H758.74c6.218 0 11.258 5.056 11.258 11.292a11.316 11.316 0 0 1-2.466 7.054L520.79 690.156a11.232 11.232 0 0 1-17.58 0z" p-id="13785"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretDownOutlined.displayName = 'CaretDownOutlined'
}
  