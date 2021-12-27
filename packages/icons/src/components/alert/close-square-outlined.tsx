
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-close-square-outlined'
const _prefix = getPrefixCls(_role)

export const CloseSquareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667H234.666667a128 128 0 0 0-128 128v554.666666a128 128 0 0 0 128 128h554.666666a128 128 0 0 0 128-128V234.666667a128 128 0 0 0-128-128zM234.666667 192h554.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v554.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H234.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V234.666667a42.666667 42.666667 0 0 1 42.666667-42.666667zM677.930667 346.069333a42.666667 42.666667 0 0 1 0 60.330667L572.330667 512l105.6 105.6a42.666667 42.666667 0 1 1-60.330667 60.330667L512 572.330667l-105.6 105.6a42.666667 42.666667 0 1 1-60.330667-60.330667L451.626667 512l-105.6-105.6a42.666667 42.666667 0 1 1 60.373333-60.330667l105.557333 105.578667 105.6-105.6a42.666667 42.666667 0 0 1 60.373334 0z" p-id="47671"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseSquareOutlined.displayName = 'CloseSquareOutlined'
}
  