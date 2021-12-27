import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-expand-outlined'
const _prefix = getPrefixCls(_role)

export const ExpandOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role={role}
        style={style}
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M388.544 575.338667a42.666667 42.666667 0 0 1 57.621333 62.826666L252.373333 832H341.333333l3.2 0.106667A42.666667 42.666667 0 0 1 341.333333 917.333333H149.333333l-3.2-0.106666A42.666667 42.666667 0 0 1 106.666667 874.666667v-192l0.106666-3.2A42.666667 42.666667 0 0 1 149.333333 640l3.2 0.106667A42.666667 42.666667 0 0 1 192 682.666667v88.981333l193.834667-193.813333zM874.666667 106.666667l3.2 0.106666A42.666667 42.666667 0 0 1 917.333333 149.333333v192l-0.106666 3.2A42.666667 42.666667 0 0 1 874.666667 384l-3.2-0.106667A42.666667 42.666667 0 0 1 832 341.333333v-88.981333l-193.834667 193.813333-2.709333 2.496a42.666667 42.666667 0 0 1-57.621333-62.826666L771.626667 192H682.666667l-3.2-0.106667A42.666667 42.666667 0 0 1 682.666667 106.666667h192z"
          p-id="49686"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ExpandOutlined.displayName = 'ExpandOutlined'
}
