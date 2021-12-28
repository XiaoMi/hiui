
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-up-outlined'
const _prefix = getPrefixCls(_role)

export const UpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M798.165333 609.834667a42.666667 42.666667 0 0 1-57.621333 62.826666l-2.709333-2.496L512 444.373333 286.165333 670.165333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709333-2.496a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 256-256a42.666667 42.666667 0 0 1 57.621333-2.496l2.709333 2.496 256 256z" p-id="49566"></path></svg>
    )
  }
)

if (__DEV__) {
  UpOutlined.displayName = 'UpOutlined'
}
  