
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-paste-outlined'
const _prefix = getPrefixCls(_role)

export const PasteOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M780 104a8 8 0 0 1 8 8v377a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V184H192v536h68a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V112a8 8 0 0 1 8-8h660zM904 560a8 8 0 0 1 8 8v344a8 8 0 0 1-8 8H340a8 8 0 0 1-8-8V568a8 8 0 0 1 8-8h564z m-72 80H412v200h420V640z" p-id="13535"></path></svg>
    )
  }
)

if (__DEV__) {
  PasteOutlined.displayName = 'PasteOutlined'
}
  