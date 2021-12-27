
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-export-outlined'
const _prefix = getPrefixCls(_role)

export const ExportOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M320 106.666667a42.666667 42.666667 0 0 1 3.2 85.226666L320 192h-85.333333a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v554.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h554.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333v-85.333333l0.106667-3.2a42.666667 42.666667 0 0 1 85.12 0L917.333333 704v85.333333a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h85.333333z m469.333333 0a128 128 0 0 1 128 128v298.666666a42.666667 42.666667 0 0 1-85.226666 3.2L832 533.333333V252.330667L531.498667 552.832a42.666667 42.666667 0 0 1-62.826667-57.621333l2.496-2.709334L771.626667 192H490.666667l-3.2-0.106667a42.666667 42.666667 0 0 1 0-85.12L490.666667 106.666667h298.666666z" p-id="39385"></path></svg>
    )
  }
)

if (__DEV__) {
  ExportOutlined.displayName = 'ExportOutlined'
}
  