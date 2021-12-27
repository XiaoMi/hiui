
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-down-outlined'
const _prefix = getPrefixCls(_role)

export const DownOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M798.165333 414.165333a42.666667 42.666667 0 0 0-57.621333-62.826666l-2.709333 2.496L512 579.626667 286.165333 353.834667a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333 256 256a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256z" p-id="49576"></path></svg>
    )
  }
)

if (__DEV__) {
  DownOutlined.displayName = 'DownOutlined'
}
  