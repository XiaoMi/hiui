
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-archive-outlined'
const _prefix = getPrefixCls(_role)

export const ArchiveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M912 444v470a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V444a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v398h640V444a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8zM928 102a8 8 0 0 1 8 8v264a8 8 0 0 1-8 8H96a8 8 0 0 1-8-8V110a8 8 0 0 1 8-8h832z m-72 80H168v120h688V182zM506.434 805.44a8 8 0 0 1-1.25-1.248l-111.354-139.194a8 8 0 0 1 6.246-12.998h71.356V430a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v222h71.354a8 8 0 0 1 6.248 12.998l-111.356 139.194a8 8 0 0 1-11.244 1.248z" p-id="12535"></path></svg>
    )
  }
)

if (__DEV__) {
  ArchiveOutlined.displayName = 'ArchiveOutlined'
}
  