
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-folder-outlined'
const _prefix = getPrefixCls(_role)

export const FolderOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M399.954 136l122.984 104H952a8 8 0 0 1 8 8v632a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V144a8 8 0 0 1 8-8h327.954z m-29.292 80H144v592h736V320H493.646l-122.984-104z" p-id="12865"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderOutlined.displayName = 'FolderOutlined'
}
  