
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-document-outlined'
const _prefix = getPrefixCls(_role)

export const DocumentOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M864 64a8 8 0 0 1 8 8v880a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h704z m-72 80H232v736h560V144zM528 664a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-192a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h192z m160-192a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h352z m0-192a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h352z" p-id="11545"></path></svg>
    )
  }
)

if (__DEV__) {
  DocumentOutlined.displayName = 'DocumentOutlined'
}
  