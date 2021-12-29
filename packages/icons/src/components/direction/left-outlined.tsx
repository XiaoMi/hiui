
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-left-outlined'
const _prefix = getPrefixCls(_role)

export const LeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M609.834667 225.834667a42.666667 42.666667 0 0 1 62.826666 57.621333l-2.496 2.709333L444.373333 512l225.813334 225.834667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621334 2.496l-2.709333-2.496-256-256a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 256-256z" p-id="49586"></path></svg>
    )
  }
)

if (__DEV__) {
  LeftOutlined.displayName = 'LeftOutlined'
}
  