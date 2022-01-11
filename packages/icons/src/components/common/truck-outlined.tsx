import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-truck-outlined')

export const TruckOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M576 149.333333a128 128 0 0 1 128 128v42.666667h42.666667a192 192 0 0 1 191.914666 186.346667L938.666667 512v128a127.957333 127.957333 0 0 1-65.28 111.594667 106.666667 106.666667 0 1 1-212.053334 16.426666L426.666667 768a106.666667 106.666667 0 0 1-213.333334 0l-4.8-0.085333A128 128 0 0 1 85.333333 640V277.333333a128 128 0 0 1 128-128zM341.333333 768h-42.666666a21.333333 21.333333 0 0 0 42.666666 0z m448 0.021333L746.666667 768l0.149333 2.496A21.333333 21.333333 0 0 0 789.333333 768zM618.666667 277.333333a42.666667 42.666667 0 0 0-39.466667-42.56L576 234.666667H213.333333a42.666667 42.666667 0 0 0-42.666666 42.666666v362.666667a42.666667 42.666667 0 0 0 42.666666 42.666667h405.333334z m128 128h-42.666667v277.333334h106.666667a42.666667 42.666667 0 0 0 42.666666-42.666667v-128a106.666667 106.666667 0 0 0-106.666666-106.666667z"
          p-id="38605"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  TruckOutlined.displayName = 'TruckOutlined'
}
