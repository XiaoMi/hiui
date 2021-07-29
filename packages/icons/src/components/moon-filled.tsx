
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-moon-filled'
const _prefix = getPrefixCls(_role)

export const MoonFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M476.516 66.764c-44.314 52.264-75.77 116.616-88.526 188.96-38.36 217.558 106.906 425.02 324.464 463.382 72.346 12.758 143.576 5.208 207.84-18.552-82.94 180.734-279.938 290.16-484.936 254.012C191.692 911.602 28.994 679.242 71.958 435.58 108.104 230.58 278.308 82.888 476.516 66.764z" p-id="12005"></path></svg>
    )
  }
)

if (__DEV__) {
  MoonFilled.displayName = 'MoonFilled'
}
  