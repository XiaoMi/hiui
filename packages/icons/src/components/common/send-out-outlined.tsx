import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-send-out-outlined')

export const SendOutOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        t="1641890736821"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5039"
      >
        <path
          d="M857.6 110.229333A42.666667 42.666667 0 0 1 917.333333 149.333333v597.333334a42.666667 42.666667 0 0 1-56.384 40.405333L675.413333 724.053333l-68.885333 160.469334c-14.08 32.810667-59.328 34.517333-76.309333 4.266666l-1.6-3.157333-116.032-250.218667-281.216-130.496c-32.234667-14.976-32.810667-59.946667-2.368-76.224l3.242666-1.578666zM832 214.506667L253.205333 467.370667l209.493334 97.237333a42.666667 42.666667 0 0 1 19.029333 17.408l1.706667 3.349333 82.389333 177.664 46.741333-108.885333a42.666667 42.666667 0 0 1 49.578667-24.533333l3.349333 0.96L832 687.104V214.506667z m-76.501333 117.973333a42.666667 42.666667 0 0 1 2.496 57.642667l-2.496 2.709333-170.666667 170.666667a42.666667 42.666667 0 0 1-62.826667-57.621334l2.496-2.709333 170.666667-170.666667a42.666667 42.666667 0 0 1 60.330667 0z"
          p-id="5040"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  SendOutOutlined.displayName = 'SendOutOutlined'
}
