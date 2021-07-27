
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-link-outlined'
const _prefix = getPrefixCls(_role)

export const LinkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M749.952 613.824a6 6 0 0 1 0 8.484L362.46 1009.804a6 6 0 0 1-8.486 0L93.76 749.588a6 6 0 0 1 0-8.486l222.03-222.03a8 8 0 0 1 11.314 0l45.256 45.254a8 8 0 0 1 0 11.314l-169.706 169.706 155.564 155.562 282.842-282.842-130.108-130.108a8 8 0 0 1 0-11.314l45.256-45.254a8 8 0 0 1 11.312 0l182.434 182.434zM513.78 536.04a8 8 0 0 1 0 11.314l-45.254 45.254a8 8 0 0 1-11.314 0l-182.434-182.434a6 6 0 0 1 0-8.484L662.272 14.196a6 6 0 0 1 8.484 0l260.216 260.216a6 6 0 0 1 0 8.486L708.94 504.928a8 8 0 0 1-11.314 0l-45.254-45.254a8 8 0 0 1 0-11.314l169.706-169.706-155.564-155.562-282.842 282.842 130.106 130.108z" p-id="12935"></path></svg>
    )
  }
)

if (__DEV__) {
  LinkOutlined.displayName = 'LinkOutlined'
}
  