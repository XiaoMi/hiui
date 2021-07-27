
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-phone-outlined'
const _prefix = getPrefixCls(_role)

export const PhoneOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M307.46 102c27.242 0 45.494 17.98 45.856 45.04l0.006 0.824c0 55.032 9.17 110.066 27.514 163.264 3.67 12.84 0 31.184-9.17 45.86l-106.4 99.06c64.206 128.412 172.44 232.98 300.85 300.852l100.896-100.892c12.84-12.846 31.184-18.344 45.864-9.174 49.528 18.344 104.56 27.518 163.264 27.518 27.516 0 45.86 18.344 45.86 45.86v154.094c0 27.52-18.344 45.862-45.86 45.862C446.88 920.168 102 575.29 102 147.864 102 120.344 120.344 102 147.862 102h159.596z m399.372 627.32l-69.22 69.218 8.244 2.944c60.692 21.134 125.29 34.13 192.498 37.69l3.646 0.18v-85.926l-1.572-0.086c-46.134-2.64-90.3-10.454-131.8-23.45l-1.796-0.57zM274.336 182H182.822l0.006 0.17c3.304 68.186 16.4 133.722 37.93 195.248l2.894 8.068 74.676-69.526-0.566-1.874c-12.75-42.586-20.552-86.214-23.312-130.184l-0.114-1.902z" p-id="13075"></path></svg>
    )
  }
)

if (__DEV__) {
  PhoneOutlined.displayName = 'PhoneOutlined'
}
  