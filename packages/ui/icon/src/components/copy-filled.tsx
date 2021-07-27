
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-copy-filled'
const _prefix = getPrefixCls(_role)

export const CopyFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M760 256a8 8 0 0 1 8 8v640a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V264a8 8 0 0 1 8-8h640z m152 528a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V192H240a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h664a8 8 0 0 1 8 8v664z" p-id="12195"></path></svg>
    )
  }
)

if (__DEV__) {
  CopyFilled.displayName = 'CopyFilled'
}
  