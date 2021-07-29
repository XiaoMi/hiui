
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-tag-filled'
const _prefix = getPrefixCls(_role)

export const TagFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M469.072 107.56l413.74 27.656a8 8 0 0 1 7.448 7.452l27.498 413.576a8 8 0 0 1-2.326 6.188L488.078 989.786a8 8 0 0 1-11.314 0L35.528 548.552a8 8 0 0 1 0-11.314L462.882 109.884a8 8 0 0 1 6.19-2.324z m-159.186 392.908a8 8 0 0 0-11.314 0l-45.254 45.256a8 8 0 0 0 0 11.312l214.96 214.96a8 8 0 0 0 11.314 0l45.254-45.254a8 8 0 0 0 0-11.314z m104.852-104.852a8 8 0 0 0-11.312 0l-45.256 45.254a8 8 0 0 0 0 11.314l214.96 214.96a8 8 0 0 0 11.314 0l45.256-45.254a8 8 0 0 0 0-11.314z" p-id="12085"></path></svg>
    )
  }
)

if (__DEV__) {
  TagFilled.displayName = 'TagFilled'
}
  