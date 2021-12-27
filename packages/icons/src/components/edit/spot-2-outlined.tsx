
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-spot-2-outlined'
const _prefix = getPrefixCls(_role)

export const Spot2Outlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M597.333333 213.333333a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64V170.666667a64 64 0 0 1 64-64h42.666666a64 64 0 0 1 64 64v42.666666z m0 320a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666a64 64 0 0 1 64 64v42.666666z m0 320a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666666a64 64 0 0 1 64-64h42.666666a64 64 0 0 1 64 64v42.666666z" p-id="44986"></path></svg>
    )
  }
)

if (__DEV__) {
  Spot2Outlined.displayName = 'Spot2Outlined'
}
  