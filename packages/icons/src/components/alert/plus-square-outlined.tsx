import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-plus-square-outlined'
const _prefix = getPrefixCls(_role)

export const PlusSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M789.333333 106.666667H234.666667a128 128 0 0 0-128 128v554.666666a128 128 0 0 0 128 128h554.666666a128 128 0 0 0 128-128V234.666667a128 128 0 0 0-128-128zM234.666667 192h554.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v554.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H234.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V234.666667a42.666667 42.666667 0 0 1 42.666667-42.666667zM512 277.333333a42.666667 42.666667 0 0 1 42.666667 42.666667l-0.021334 149.333333H704a42.666667 42.666667 0 1 1 0 85.333334h-149.354667L554.666667 704a42.666667 42.666667 0 1 1-85.333334 0l-0.021333-149.333333H320a42.666667 42.666667 0 1 1 0-85.333334h149.312L469.333333 320a42.666667 42.666667 0 0 1 42.666667-42.666667z"
          p-id="47701"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  PlusSquareOutlined.displayName = 'PlusSquareOutlined'
}
