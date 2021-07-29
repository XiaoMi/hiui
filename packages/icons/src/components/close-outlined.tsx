
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-close-outlined'
const _prefix = getPrefixCls(_role)

export const CloseOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M834.44 234.814a8 8 0 0 1 0 11.314L568.568 512 834.44 777.872a8 8 0 0 1 0 11.314l-45.254 45.254a8 8 0 0 1-11.314 0L512 568.568 246.128 834.44a8 8 0 0 1-11.314 0L189.56 789.186a8 8 0 0 1 0-11.314L455.432 512 189.56 246.128a8 8 0 0 1 0-11.314l45.254-45.254a8 8 0 0 1 11.314 0L512 455.43 777.872 189.56a8 8 0 0 1 11.314 0l45.254 45.254z" p-id="13245"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseOutlined.displayName = 'CloseOutlined'
}
  