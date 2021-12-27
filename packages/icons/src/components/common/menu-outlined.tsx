import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-menu-outlined'
const _prefix = getPrefixCls(_role)

export const MenuOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M213.333333 746.666667a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64H170.666667a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666zM213.333333 426.666667a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64H170.666667a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666zM213.333333 106.666667a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64H170.666667a64 64 0 0 1-64-64V170.666667a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64V170.666667a64 64 0 0 1 64-64h42.666666z m320 0a64 64 0 0 1 64 64v42.666666a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64V170.666667a64 64 0 0 1 64-64h42.666666z"
          p-id="38725"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  MenuOutlined.displayName = 'MenuOutlined'
}
