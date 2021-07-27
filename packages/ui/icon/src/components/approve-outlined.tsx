
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-approve-outlined'
const _prefix = getPrefixCls(_role)

export const ApproveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M524 64a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H232v736h560V412a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v540a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h364z m164 600a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h352z m0-192a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h352z m-163.846-192c4.334 0 7.846 3.58 7.846 8v64c0 4.42-3.512 8-7.846 8h-188.308c-4.334 0-7.846-3.58-7.846-8v-64c0-4.42 3.512-8 7.846-8h188.308zM627.55 186a8 8 0 0 1 11.312 0l62.224 62.224 164.052-164.048a8 8 0 0 1 11.312 0l45.256 45.256a8 8 0 0 1 0 11.314l-214.96 214.96a8 8 0 0 1-11.314 0l-113.138-113.138a8 8 0 0 1 0-11.314L627.55 186z" p-id="12555"></path></svg>
    )
  }
)

if (__DEV__) {
  ApproveOutlined.displayName = 'ApproveOutlined'
}
  