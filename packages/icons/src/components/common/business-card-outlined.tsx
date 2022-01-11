import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-business-card-outlined')

export const BusinessCardOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        t="1641890702087"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4776"
      >
        <path
          d="M853.333333 810.666667a128 128 0 0 1-128 128H298.666667a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h426.666666a128 128 0 0 1 128 128v597.333334z m-85.333333 0V213.333333a42.666667 42.666667 0 0 0-39.466667-42.56L725.333333 170.666667H298.666667a42.666667 42.666667 0 0 0-42.56 39.466666L256 213.333333v597.333334a42.666667 42.666667 0 0 0 39.466667 42.56L298.666667 853.333333h426.666666a42.666667 42.666667 0 0 0 42.56-39.466666L768 810.666667z"
          p-id="4777"
        ></path>
        <path
          d="M640 682.666667a42.666667 42.666667 0 1 1 0 85.333333H384a42.666667 42.666667 0 1 1 0-85.333333h256z m-128-234.666667a149.333333 149.333333 0 0 1 149.333333 149.333333 42.666667 42.666667 0 0 1-85.226666 3.2L576 597.333333a64 64 0 0 0-127.893333-3.754666L448 597.333333a42.666667 42.666667 0 1 1-85.333333 0 149.333333 149.333333 0 0 1 149.333333-149.333333z"
          p-id="4778"
        ></path>
        <path
          d="M512 469.333333a85.333333 85.333333 0 1 0 0-170.666666 85.333333 85.333333 0 0 0 0 170.666666z"
          p-id="4779"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  BusinessCardOutlined.displayName = 'BusinessCardOutlined'
}
