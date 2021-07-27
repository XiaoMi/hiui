
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-sound-filled'
const _prefix = getPrefixCls(_role)

export const SoundFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M678.22 106.834a18 18 0 0 1 1.78 7.806v794.72a18 18 0 0 1-25.806 16.22L264.466 718H90a8 8 0 0 1-8-8V314a8 8 0 0 1 8-8h174.466L654.194 98.42a18 18 0 0 1 24.026 8.414zM766 672.928a8 8 0 0 1 10.554-3.13l0.374 0.202 124.708 72a8 8 0 0 1 3.13 10.554l-0.202 0.374-32 55.426a8 8 0 0 1-10.554 3.13l-0.374-0.202-124.708-72a8 8 0 0 1-3.13-10.554l0.202-0.374 32-55.426zM943.282 472a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-144a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h144z m-70.718-255.072l32 55.426a8 8 0 0 1-2.928 10.928l-124.708 72a8 8 0 0 1-10.928-2.928l-32-55.426a8 8 0 0 1 2.928-10.928l124.708-72a8 8 0 0 1 10.928 2.928z" p-id="12045"></path></svg>
    )
  }
)

if (__DEV__) {
  SoundFilled.displayName = 'SoundFilled'
}
  