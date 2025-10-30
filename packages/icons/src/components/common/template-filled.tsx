
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-template-filled')

export const TemplateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30324"  ><path d="M128 192a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v128a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V192zM128 512a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64v320a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V512zM448 192a64 64 0 0 1 64-64h320a64 64 0 0 1 64 64v640a64 64 0 0 1-64 64H512a64 64 0 0 1-64-64V192z" p-id="30325"></path></svg>
    )
  }
)

if (__DEV__) {
  TemplateFilled.displayName = 'TemplateFilled'
}
  