
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-delete-filled'
const _prefix = getPrefixCls(_role)

export const DeleteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M268 328v560h488V328a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8v616a16 16 0 0 1-16 16H212a16 16 0 0 1-16-16V328a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8z m-124-72a8 8 0 0 1-8-8V192a8 8 0 0 1 8-8h226V76a16 16 0 0 1 16-16h256a16 16 0 0 1 16 16v108h222a8 8 0 0 1 8 8v56a8 8 0 0 1-8 8H144z m442-124h-144v52h144V132zM196 238h632v676H196z" p-id="12235"></path></svg>
    )
  }
)

if (__DEV__) {
  DeleteFilled.displayName = 'DeleteFilled'
}
  