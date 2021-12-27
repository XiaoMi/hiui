import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-scan-outlined'
const _prefix = getPrefixCls(_role)

export const ScanOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M192 682.666667v106.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h106.666666v85.333333h-106.666666a128 128 0 0 1-128-128v-106.666666h85.333333z m725.333333 0v106.666666a128 128 0 0 1-128 128h-106.666666v-85.333333h106.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333v-106.666666h85.333333z m-42.666666-213.333334a42.666667 42.666667 0 1 1 0 85.333334H149.333333a42.666667 42.666667 0 1 1 0-85.333334h725.333334zM789.333333 106.666667a128 128 0 0 1 128 128v106.666666h-85.333333v-106.666666a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192h-106.666666V106.666667h106.666666zM341.333333 106.666667v85.333333h-106.666666a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v106.666666H106.666667v-106.666666a128 128 0 0 1 128-128h106.666666z"
          p-id="38985"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ScanOutlined.displayName = 'ScanOutlined'
}
