
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-tag-outlined'
const _prefix = getPrefixCls(_role)

export const TagOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M890.26 142.668l27.498 413.576a8 8 0 0 1-2.326 6.188L488.078 989.786a8 8 0 0 1-11.314 0L35.528 548.552a8 8 0 0 1 0-11.314L462.882 109.884a8 8 0 0 1 6.19-2.324l413.74 27.656a8 8 0 0 1 7.448 7.452z m-75.644 68.166L496.344 189.56 143.008 542.894 482.42 882.306 835.768 528.96l-21.152-318.126zM524.846 715.428a8 8 0 0 1 0 11.314L479.592 772a8 8 0 0 1-11.314 0l-214.96-214.96a8 8 0 0 1 0-11.314l45.254-45.256a8 8 0 0 1 11.314 0l214.96 214.96z m104.854-104.852a8 8 0 0 1 0 11.314l-45.256 45.254a8 8 0 0 1-11.314 0l-214.96-214.96a8 8 0 0 1 0-11.314l45.256-45.254a8 8 0 0 1 11.312 0l214.96 214.96z" p-id="12335"></path></svg>
    )
  }
)

if (__DEV__) {
  TagOutlined.displayName = 'TagOutlined'
}
  