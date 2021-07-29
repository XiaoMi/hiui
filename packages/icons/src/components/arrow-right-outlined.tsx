
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-arrow-right-outlined'
const _prefix = getPrefixCls(_role)

export const ArrowRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M589.656 212.186l294.158 294.158a8 8 0 0 1 0.274 11.024l-0.274 0.288-294.158 294.158a8 8 0 0 1-11.312 0l-45.256-45.256a8 8 0 0 1 0-11.314L736.332 552H146a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h590.332L533.088 268.756a8 8 0 0 1 0-11.314l45.256-45.256a8 8 0 0 1 11.312 0z" p-id="13845"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowRightOutlined.displayName = 'ArrowRightOutlined'
}
  