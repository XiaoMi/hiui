
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-arrow-left-outlined'
const _prefix = getPrefixCls(_role)

export const ArrowLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M434.5 811.814L140.344 517.656a8 8 0 0 1-0.276-11.024l0.276-0.288L434.5 212.186a8 8 0 0 1 11.314 0l45.254 45.256a8 8 0 0 1 0 11.314L287.824 472h590.332a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H287.824l203.244 203.244a8 8 0 0 1 0 11.314l-45.254 45.256a8 8 0 0 1-11.314 0z" p-id="13815"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowLeftOutlined.displayName = 'ArrowLeftOutlined'
}
  