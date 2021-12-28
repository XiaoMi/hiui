
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-exclamation-outlined'
const _prefix = getPrefixCls(_role)

export const ExclamationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M533.333333 661.333333a21.333333 21.333333 0 0 0 21.333334-21.333333V192a21.333333 21.333333 0 0 0-21.333334-21.333333h-42.666666a21.333333 21.333333 0 0 0-21.333334 21.333333v448a21.333333 21.333333 0 0 0 21.333334 21.333333h42.666666z m-21.333333 192a64 64 0 1 0 0-128 64 64 0 0 0 0 128z" p-id="47721"></path></svg>
    )
  }
)

if (__DEV__) {
  ExclamationOutlined.displayName = 'ExclamationOutlined'
}
  