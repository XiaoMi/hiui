
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-save-outlined'
const _prefix = getPrefixCls(_role)

export const SaveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904 112a8 8 0 0 1 8 8v784a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h784zM280 192H192v640h640V192h-88v276a8 8 0 0 1-8 8H288a8 8 0 0 1-8-8V192z m384 0H360v204h304V192z m-80 84a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-144a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h144z" p-id="13515"></path></svg>
    )
  }
)

if (__DEV__) {
  SaveOutlined.displayName = 'SaveOutlined'
}
  