
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-arrow-up-outlined'
const _prefix = getPrefixCls(_role)

export const ArrowUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M212.264 434.578L506.422 140.42a8 8 0 0 1 11.024-0.276l0.29 0.276 294.156 294.156a8 8 0 0 1 0 11.314l-45.256 45.254a8 8 0 0 1-11.314 0L552.08 287.902v590.332a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V287.902L268.834 491.146a8 8 0 0 1-11.314 0l-45.256-45.254a8 8 0 0 1 0-11.314z" p-id="13835"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowUpOutlined.displayName = 'ArrowUpOutlined'
}
  