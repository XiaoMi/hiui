
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-bell-filled'
const _prefix = getPrefixCls(_role)

export const BellFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 44c26.51 0 48 21.49 48 48 0 2.59-0.206 5.132-0.6 7.612C708.11 122.42 822 250.91 822 406v342h50a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8l-201.24 0.002C660.92 906.928 593.594 968 512 968c-81.592 0-148.92-61.072-158.76-139.998L152 828a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h50V406c0-155.09 113.89-283.58 262.598-306.4A48.42 48.42 0 0 1 464 92c0-26.51 21.49-48 48-48z m77.48 784h-154.96c8.882 34.506 40.204 60 77.48 60 36.904 0 67.97-24.988 77.206-58.966l0.274-1.032z" p-id="11725"></path></svg>
    )
  }
)

if (__DEV__) {
  BellFilled.displayName = 'BellFilled'
}
  