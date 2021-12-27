import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-delete-outlined'
const _prefix = getPrefixCls(_role)

export const DeleteOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M874.666667 234.666667a42.666667 42.666667 0 1 1 0 85.333333H149.333333a42.666667 42.666667 0 1 1 0-85.333333h725.333334zM618.666667 106.666667a42.666667 42.666667 0 1 1 0 85.333333H405.333333a42.666667 42.666667 0 1 1 0-85.333333h213.333334zM789.333333 405.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v341.333333a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V448l0.106667-3.2A42.666667 42.666667 0 0 1 277.333333 448v341.333333a42.666667 42.666667 0 0 0 39.466667 42.56L320 832h384a42.666667 42.666667 0 0 0 42.56-39.466667L746.666667 789.333333V448l0.106666-3.2A42.666667 42.666667 0 0 1 789.333333 405.333333z"
          p-id="44906"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  DeleteOutlined.displayName = 'DeleteOutlined'
}
