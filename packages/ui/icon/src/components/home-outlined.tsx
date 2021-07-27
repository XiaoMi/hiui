
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-home-outlined'
const _prefix = getPrefixCls(_role)

export const HomeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M120 946a12 12 0 0 1-12-12V364.83a12 12 0 0 1 5.874-10.318L506.076 81.64a12 12 0 0 1 12.258 0.002l391.798 272.87a12 12 0 0 1 5.868 10.316V934a12 12 0 0 1-12 12H120zM512.182 171.05L188 403.538V866h170V634a8 8 0 0 1 8-8h292a8 8 0 0 1 8 8v232h170V403.514L512.182 171.05zM586 706h-148v160h148v-160z" p-id="12845"></path></svg>
    )
  }
)

if (__DEV__) {
  HomeOutlined.displayName = 'HomeOutlined'
}
  