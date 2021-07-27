
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-shrink-outlined'
const _prefix = getPrefixCls(_role)

export const ShrinkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M849.196 128.344l45.254 45.254a8 8 0 0 1 0 11.314l-186.166 186.166 56.888 56.888a4 4 0 0 1 1.156 2.476l0.016 0.352a4 4 0 0 1-3.702 3.988l-0.3 0.012H592a4 4 0 0 1-3.99-3.7l-0.01-0.3v-170.344a4 4 0 0 1 6.574-3.06l0.254 0.232 56.888 56.888 186.166-186.166a8 8 0 0 1 11.314 0zM173.598 894.45l-45.254-45.254a8 8 0 0 1 0-11.314l186.166-186.166-56.888-56.888a4 4 0 0 1-1.156-2.476l-0.016-0.352a4 4 0 0 1 3.702-3.99l0.3-0.01h170.342a4 4 0 0 1 3.988 3.7l0.012 0.3v170.344a4 4 0 0 1-6.574 3.06l-0.254-0.232-56.888-56.888-186.166 186.166a8 8 0 0 1-11.314 0z" p-id="13635"></path></svg>
    )
  }
)

if (__DEV__) {
  ShrinkOutlined.displayName = 'ShrinkOutlined'
}
  