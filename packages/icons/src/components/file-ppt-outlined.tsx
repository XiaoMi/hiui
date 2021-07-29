
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-ppt-outlined'
const _prefix = getPrefixCls(_role)

export const FilePptOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM644 566c0 59.05-47.392 107.032-106.214 107.986L536 674h-96.002l0.002 124h-64V458h160c59.646 0 108 48.354 108 108z m-64 0c0-24.3-19.7-44-44-44h-96v88h96c24.3 0 44-19.7 44-44z" p-id="11385"></path></svg>
    )
  }
)

if (__DEV__) {
  FilePptOutlined.displayName = 'FilePptOutlined'
}
  