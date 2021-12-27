import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-monitor-outlined'
const _prefix = getPrefixCls(_role)

export const MonitorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M789.333333 106.666667a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128H554.666667v85.333333h128a42.666667 42.666667 0 1 1 0 85.333333H341.333333a42.666667 42.666667 0 1 1 0-85.333333h128v-85.333333H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h554.666666z m0 85.333333H234.666667a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v384a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 661.333333h554.666666a42.666667 42.666667 0 0 0 42.56-39.466666L832 618.666667V234.666667a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192zM533.333333 533.333333a42.666667 42.666667 0 1 1 0 85.333334h-42.666666a42.666667 42.666667 0 1 1 0-85.333334h42.666666z"
          p-id="38755"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  MonitorOutlined.displayName = 'MonitorOutlined'
}
