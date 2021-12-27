
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-direction-right-outlined'
const _prefix = getPrefixCls(_role)

export const DirectionRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M481.834667 225.834667a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333L707.626667 512 481.834667 737.834667a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256a42.666667 42.666667 0 0 0 2.496-57.621333l-2.496-2.709333-256-256a42.666667 42.666667 0 0 0-60.330666 0z m-256 0a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333L451.626667 512 225.834667 737.834667a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256a42.666667 42.666667 0 0 0 2.496-57.621333l-2.496-2.709333-256-256a42.666667 42.666667 0 0 0-60.330666 0z" p-id="49606"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionRightOutlined.displayName = 'DirectionRightOutlined'
}
  