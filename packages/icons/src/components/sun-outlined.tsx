
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-sun-outlined'
const _prefix = getPrefixCls(_role)

export const SunOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M544 832a8 8 0 0 1 8 8v124a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-124a8 8 0 0 1 8-8h64z m-280.9-116.354l45.254 45.256a8 8 0 0 1 0 11.314l-87.682 87.68a8 8 0 0 1-11.314 0l-45.254-45.254a8 8 0 0 1 0-11.314l87.68-87.68a8 8 0 0 1 11.314 0z m509.116 0l87.68 87.682a8 8 0 0 1 0 11.314l-45.254 45.254a8 8 0 0 1-11.314 0l-87.68-87.68a8 8 0 0 1 0-11.314l45.254-45.256a8 8 0 0 1 11.314 0zM512 224c159.058 0 288 128.942 288 288s-128.942 288-288 288-288-128.942-288-288 128.942-288 288-288z m0 80c-114.876 0-208 93.124-208 208s93.124 208 208 208 208-93.124 208-208-93.124-208-208-208z m452 168a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-124a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h124z m-780 0a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H60a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h124z m36.672-307.896l87.68 87.68a8 8 0 0 1 0 11.314l-45.254 45.256a8 8 0 0 1-11.314 0l-87.68-87.682a8 8 0 0 1 0-11.314l45.254-45.254a8 8 0 0 1 11.314 0z m593.97 0l45.254 45.254a8 8 0 0 1 0 11.314l-87.68 87.68a8 8 0 0 1-11.314 0l-45.256-45.254a8 8 0 0 1 0-11.314l87.682-87.68a8 8 0 0 1 11.314 0zM544 52a8 8 0 0 1 8 8v124a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V60a8 8 0 0 1 8-8h64z" p-id="12435"></path></svg>
    )
  }
)

if (__DEV__) {
  SunOutlined.displayName = 'SunOutlined'
}
  