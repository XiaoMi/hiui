
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-ellipsis-outlined'
const _prefix = getPrefixCls(_role)

export const EllipsisOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 512m-56 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0ZM784 512m-56 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0ZM240 512m-56 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0Z" p-id="13435"></path></svg>
    )
  }
)

if (__DEV__) {
  EllipsisOutlined.displayName = 'EllipsisOutlined'
}
  