
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-flag-outlined'
const _prefix = getPrefixCls(_role)

export const FlagOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M168 914a8 8 0 0 1-8 8H96a8 8 0 0 1-8-8V110a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v46h472a8 8 0 0 1 8 8v152h280a8 8 0 0 1 8 8v504a8 8 0 0 1-8 8H504a8 8 0 0 1-8-8v-128H168v214z m400-678H168v384h408v136h280V396H568v-160z" p-id="12805"></path></svg>
    )
  }
)

if (__DEV__) {
  FlagOutlined.displayName = 'FlagOutlined'
}
  