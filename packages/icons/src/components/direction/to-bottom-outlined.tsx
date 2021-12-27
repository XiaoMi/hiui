import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-to-bottom-outlined'
const _prefix = getPrefixCls(_role)

export const ToBottomOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M106.666667 874.666667a42.666667 42.666667 0 0 1 42.666666-42.666667h725.333334a42.666667 42.666667 0 1 1 0 85.333333H149.333333a42.666667 42.666667 0 0 1-42.666666-42.666666z m161.834666-435.498667a42.666667 42.666667 0 0 1 57.621334-2.496l2.709333 2.496L469.333333 579.690667V149.333333a42.666667 42.666667 0 1 1 85.333334 0v430.314667l140.501333-140.48a42.666667 42.666667 0 0 1 57.621333-2.496l2.709334 2.496a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709334-213.333334 213.333333-2.176 2.026667-0.341333 0.32 2.517333-2.346667a43.157333 43.157333 0 0 1-8.874666 6.826667A42.496 42.496 0 0 1 512 725.333333h-0.64l-1.856-0.064L512 725.333333a43.178667 43.178667 0 0 1-8.938667-0.938666 42.261333 42.261333 0 0 1-18.517333-9.066667l-0.192-0.149333a42.922667 42.922667 0 0 1-2.517333-2.346667l-213.333334-213.333333a42.666667 42.666667 0 0 1 0-60.330667z"
          p-id="49746"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ToBottomOutlined.displayName = 'ToBottomOutlined'
}
