
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-tool-filled'
const _prefix = getPrefixCls(_role)

export const ToolFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M894.744 213.392c88.664 128.568 75.804 306.03-38.58 420.414-89.542 89.542-217.74 116.87-330.876 81.982L286.236 954.832a8 8 0 0 1-11.314 0L68.446 748.36a8 8 0 0 1 0-11.314l239.046-239.05c-34.888-113.138-7.56-241.336 81.98-330.88C503.86 52.734 681.32 39.874 809.89 128.538l-180 180 84.854 84.854 180.002-179.998z" p-id="12125"></path></svg>
    )
  }
)

if (__DEV__) {
  ToolFilled.displayName = 'ToolFilled'
}
  