
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-right-outlined'
const _prefix = getPrefixCls(_role)

export const RightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M450.552 794.842a8 8 0 0 1-11.312 0l-45.256-45.254a8 8 0 0 1 0-11.314L620.26 512 393.984 285.726a8 8 0 0 1 0-11.314l45.256-45.254a8 8 0 0 1 11.312 0L727.74 506.344a8 8 0 0 1 0.276 11.024l-0.276 0.288-277.186 277.186z" p-id="13685"></path></svg>
    )
  }
)

if (__DEV__) {
  RightOutlined.displayName = 'RightOutlined'
}
  