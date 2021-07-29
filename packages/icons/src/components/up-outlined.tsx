
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-up-outlined'
const _prefix = getPrefixCls(_role)

export const UpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M794.064 628.308a8 8 0 0 1 0 11.314l-45.256 45.256a8 8 0 0 1-11.314 0L511.22 458.604 284.946 684.878a8 8 0 0 1-11.314 0L228.38 639.62a8 8 0 0 1 0-11.314l277.186-277.186a8 8 0 0 1 11.024-0.274l0.29 0.274 277.186 277.186z" p-id="13675"></path></svg>
    )
  }
)

if (__DEV__) {
  UpOutlined.displayName = 'UpOutlined'
}
  