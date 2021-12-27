import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-tool-filled'
const _prefix = getPrefixCls(_role)

export const ToolFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M700.032 151.914667l4.416 4.288 2.154667 2.346666a42.666667 42.666667 0 0 1 0.106666 55.552l-2.261333 2.453334-66.602667 66.581333a21.333333 21.333333 0 0 0-1.642666 28.309333l1.642666 1.856 72.853334 72.853334a21.333333 21.333333 0 0 0 28.309333 1.642666l1.856-1.642666 66.581333-66.602667a42.666667 42.666667 0 0 1 60.352 0c83.306667 83.306667 61.973333 197.056-21.333333 280.362667-67.562667 67.562667-169.130667 80.341333-249.557333 38.357333l-233.173334 233.173333A149.333333 149.333333 0 0 1 148.693333 664.32l3.882667-4.053333 233.173333-233.173334c-41.088-78.741333-29.696-177.749333 34.176-245.248l4.181334-4.266666c81.834667-81.856 193.066667-103.893333 275.946666-25.642667zM256 725.333333a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334z"
          p-id="15551"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ToolFilled.displayName = 'ToolFilled'
}
