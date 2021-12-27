
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-columns-outlined'
const _prefix = getPrefixCls(_role)

export const ColumnsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667a128 128 0 0 1 128 128v554.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128zM341.333333 192h-106.666666a42.666667 42.666667 0 0 0-42.666667 42.666667v554.666666a42.666667 42.666667 0 0 0 42.666667 42.666667h106.666666V192z m256 0h-170.666666v640h170.666666V192z m192 0h-106.666666v640h106.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333V234.666667a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="44896"></path></svg>
    )
  }
)

if (__DEV__) {
  ColumnsOutlined.displayName = 'ColumnsOutlined'
}
  