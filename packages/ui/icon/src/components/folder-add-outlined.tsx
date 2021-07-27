
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-folder-add-outlined'
const _prefix = getPrefixCls(_role)

export const FolderAddOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M399.954 136l122.984 104H952a8 8 0 0 1 8 8v632a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V144a8 8 0 0 1 8-8h327.954z m-29.292 80H144v592h736V320H493.646l-122.984-104zM544 408a8 8 0 0 1 8 8v112h112a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-112.002l0.002 112a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8l-0.002-112H360a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h112v-112a8 8 0 0 1 8-8h64z" p-id="13485"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderAddOutlined.displayName = 'FolderAddOutlined'
}
  