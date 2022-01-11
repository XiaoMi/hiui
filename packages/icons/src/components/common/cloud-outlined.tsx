import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-cloud-outlined')

export const CloudOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M483.968 149.397333C332.586667 152.746667 208.725333 268.821333 193.578667 417.322667l-5.568 3.285333A255.957333 255.957333 0 0 0 64 640c0 141.376 114.624 256 256 256l432.938667-0.085333C880.256 892.224 981.333333 788.352 981.333333 661.333333l-0.085333-6.144c-2.88-112.448-84.885333-205.226667-192.448-224.746666l-0.128-2.346667C778.453333 272.426667 648.96 149.333333 490.666667 149.333333l-6.698667 0.064zM490.666667 234.666667c117.824 0 213.333333 95.509333 213.333333 213.333333 0 5.973333-0.234667 11.946667-0.725333 17.834667A42.666667 42.666667 0 0 0 746.282667 512h0.853333C829.162667 512 896 578.858667 896 661.333333a149.333333 149.333333 0 0 1-144.917333 149.269334L320 810.666667a170.666667 170.666667 0 0 1-68.202667-327.168 42.666667 42.666667 0 0 0 25.6-38.528C278.954667 328.448 373.973333 234.666667 490.666667 234.666667z"
          p-id="39275"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  CloudOutlined.displayName = 'CloudOutlined'
}
