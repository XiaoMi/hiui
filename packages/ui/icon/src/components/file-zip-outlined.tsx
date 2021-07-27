
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-zip-outlined'
const _prefix = getPrefixCls(_role)

export const FileZipOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M864 64a8 8 0 0 1 8 8v880a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h704z m-72 756H232v60h560v-60zM432 144H232v596h560V144H512v80h-80V144z m80 320v80h-80v-80h80z m80-80v80h-80v-80h80z m-80-80v80h-80v-80h80z m80-80v80h-80v-80h80z" p-id="11375"></path></svg>
    )
  }
)

if (__DEV__) {
  FileZipOutlined.displayName = 'FileZipOutlined'
}
  