import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-minus-square-outlined'
const _prefix = getPrefixCls(_role)

export const MinusSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M789.333333 106.666667H234.666667a128 128 0 0 0-128 128v554.666666a128 128 0 0 0 128 128h554.666666a128 128 0 0 0 128-128V234.666667a128 128 0 0 0-128-128zM234.666667 192h554.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v554.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H234.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V234.666667a42.666667 42.666667 0 0 1 42.666667-42.666667zM277.333333 469.333333m42.666667 0l384 0q42.666667 0 42.666667 42.666667l0 0q0 42.666667-42.666667 42.666667l-384 0q-42.666667 0-42.666667-42.666667l0 0q0-42.666667 42.666667-42.666667Z"
          p-id="47691"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  MinusSquareOutlined.displayName = 'MinusSquareOutlined'
}
