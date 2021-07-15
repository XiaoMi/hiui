
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-block-filled'
const _prefix = getPrefixCls(_role)

export const BlockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M918 360a8 8 0 0 1 8 8v552a8 8 0 0 1-8 8H366a8 8 0 0 1-8-8V664h304V360h256zM654 96a8 8 0 0 1 8 8v256H358v304H102a8 8 0 0 1-8-8V104a8 8 0 0 1 8-8h552z m-70 344v144h-144v-144h144z" p-id="11775"></path></svg>
    )
  }
)

if (__DEV__) {
  BlockFilled.displayName = 'BlockFilled'
}
  