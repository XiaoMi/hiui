
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-exclamation-outlined'
const _prefix = getPrefixCls(_role)

export const ExclamationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M472 700V164h80v536h-80z m40 160c-30.928 0-56-25.072-56-56s25.072-56 56-56 56 25.072 56 56-25.072 56-56 56z" p-id="13265"></path></svg>
    )
  }
)

if (__DEV__) {
  ExclamationOutlined.displayName = 'ExclamationOutlined'
}
  