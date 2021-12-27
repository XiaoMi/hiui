
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-power-off-outlined'
const _prefix = getPrefixCls(_role)

export const PowerOffOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M254.08 224.341333a42.666667 42.666667 0 0 1 3.370667 60.245334A339.84 339.84 0 0 0 170.666667 512c0 188.522667 152.810667 341.333333 341.333333 341.333333s341.333333-152.810667 341.333333-341.333333a339.84 339.84 0 0 0-86.741333-227.370667 42.666667 42.666667 0 0 1 63.616-56.874666A425.173333 425.173333 0 0 1 938.666667 512c0 235.648-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512a425.173333 425.173333 0 0 1 108.501334-284.288 42.666667 42.666667 0 0 1 60.245333-3.370667zM512 85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v256a42.666667 42.666667 0 1 1-85.333334 0V128a42.666667 42.666667 0 0 1 42.666667-42.666667z" p-id="38895"></path></svg>
    )
  }
)

if (__DEV__) {
  PowerOffOutlined.displayName = 'PowerOffOutlined'
}
  