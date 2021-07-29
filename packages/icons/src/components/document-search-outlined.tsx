
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-document-search-outlined'
const _prefix = getPrefixCls(_role)

export const DocumentSearchOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M717.318 519.474c68.418 68.42 76.902 174.074 25.454 251.73l131.522 131.522a8 8 0 0 1 0 11.314l-45.254 45.254a8 8 0 0 1-11.314 0l-131.522-131.52c-77.656 51.446-183.312 42.96-251.73-25.456-78.104-78.106-78.104-204.74 0-282.844 78.106-78.104 204.74-78.104 282.844 0zM866 64a8 8 0 0 1 8 8v392a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V144H230v736h142a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H158a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h708zM491.044 576.044c-46.864 46.862-46.864 122.84 0 169.704 46.862 46.864 122.84 46.864 169.704 0 46.864-46.862 46.864-122.842 0-169.704-46.862-46.864-122.842-46.864-169.704 0zM700 236a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H324a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h376z" p-id="13395"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentSearchOutlined.displayName = 'DocumentSearchOutlined'
}
  