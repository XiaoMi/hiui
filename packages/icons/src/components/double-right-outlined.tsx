
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-double-right-outlined'
const _prefix = getPrefixCls(_role)

export const DoubleRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M272.476 229.158a8 8 0 0 0-11.314 0l-45.254 45.254a8 8 0 0 0 0 11.314L442.18 512 215.908 738.274a8 8 0 0 0 0 11.314l45.254 45.254a8 8 0 0 0 11.314 0l277.186-277.186a8 8 0 0 0 0.276-11.024l-0.276-0.288-277.186-277.186zM552.476 229.158a8 8 0 0 0-11.314 0l-45.254 45.254a8 8 0 0 0 0 11.314L722.18 512 495.908 738.274a8 8 0 0 0 0 11.314l45.254 45.254a8 8 0 0 0 11.314 0l277.186-277.186a8 8 0 0 0 0.276-11.024l-0.276-0.288-277.186-277.186z" p-id="13755"></path></svg>
    )
  }
)

if (__DEV__) {
  DoubleRightOutlined.displayName = 'DoubleRightOutlined'
}
  