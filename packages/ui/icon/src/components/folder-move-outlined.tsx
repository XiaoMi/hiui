
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-folder-move-outlined'
const _prefix = getPrefixCls(_role)

export const FolderMoveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M399.954 136l122.984 104H952a8 8 0 0 1 8 8v632a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V144a8 8 0 0 1 8-8h327.954z m-29.292 80H144v592h736V320H493.646l-122.984-104z m206.64 232.698c1.818 0 3.58 0.62 5 1.76l139.192 111.864a8.06 8.06 0 0 1 0 12.55l-139.194 111.864a7.976 7.976 0 0 1-11.244-1.256 8.06 8.06 0 0 1-1.754-5.02v-71.68h-262c-4.418 0-8-3.6-8-8.038v-64.292c0-4.438 3.582-8.036 8-8.036h262v-71.68c0-4.44 3.582-8.036 8-8.036z" p-id="13455"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderMoveOutlined.displayName = 'FolderMoveOutlined'
}
  