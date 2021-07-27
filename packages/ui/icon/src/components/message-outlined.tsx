
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-message-outlined'
const _prefix = getPrefixCls(_role)

export const MessageOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M944 110a8 8 0 0 1 8 8v640a8 8 0 0 1-8 8H542.374l-209.1 159.316a12 12 0 0 1-6.712 2.44l-0.562 0.014a12 12 0 0 1-11.992-11.55l-0.008-0.45V766H80a8 8 0 0 1-8-8V118a8 8 0 0 1 8-8h864z m-72 80H152v496h242v92.47L515.37 686H872V190z m-528 160a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-160a8 8 0 0 1 8-8h64z m200 0a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-160a8 8 0 0 1 8-8h64z m200 0a8 8 0 0 1 8 8v160a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-160a8 8 0 0 1 8-8h64z" p-id="13025"></path></svg>
    )
  }
)

if (__DEV__) {
  MessageOutlined.displayName = 'MessageOutlined'
}
  