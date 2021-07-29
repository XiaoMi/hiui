
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-double-left-outlined'
const _prefix = getPrefixCls(_role)

export const DoubleLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M471.53 229.158a8 8 0 0 1 11.312 0l45.256 45.254a8 8 0 0 1 0 11.314L301.824 512l226.274 226.274a8 8 0 0 1 0 11.314L482.84 794.84a8 8 0 0 1-11.312 0L194.344 517.656a8 8 0 0 1-0.276-11.024l0.276-0.288 277.186-277.186zM751.53 229.158a8 8 0 0 1 11.312 0l45.256 45.254a8 8 0 0 1 0 11.314L581.824 512l226.274 226.274a8 8 0 0 1 0 11.314L762.84 794.84a8 8 0 0 1-11.312 0L474.344 517.656a8 8 0 0 1-0.276-11.024l0.276-0.288 277.186-277.186z" p-id="13765"></path></svg>
    )
  }
)

if (__DEV__) {
  DoubleLeftOutlined.displayName = 'DoubleLeftOutlined'
}
  