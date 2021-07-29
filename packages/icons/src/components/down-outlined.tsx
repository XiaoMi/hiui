
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-down-outlined'
const _prefix = getPrefixCls(_role)

export const DownOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M228.378 427.692a8 8 0 0 1 0-11.314l45.254-45.256a8 8 0 0 1 11.314 0L511.22 597.396l226.274-226.274a8 8 0 0 1 11.314 0l45.256 45.256a8 8 0 0 1 0 11.314L516.878 704.878a8 8 0 0 1-11.026 0.274l-0.288-0.274-277.186-277.186z" p-id="13655"></path></svg>
    )
  }
)

if (__DEV__) {
  DownOutlined.displayName = 'DownOutlined'
}
  