import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-tag-outlined')

export const TagOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M784.832 105.685333a128 128 0 0 1 128 128v150.848a128 128 0 0 1-37.504 90.517334L490.453333 859.925333a128 128 0 0 1-181.034666 0l-150.826667-150.826666a128 128 0 0 1 0-181.034667l384.853333-384.896a128 128 0 0 1 90.538667-37.482667h150.826667z m0 85.333334h-150.848a42.666667 42.666667 0 0 0-27.413333 9.962666l-2.773334 2.538667L218.922667 588.373333a42.666667 42.666667 0 0 0-2.176 58.026667l2.176 2.325333 150.826666 150.848a42.666667 42.666667 0 0 0 58.026667 2.176l2.346667-2.176 384.853333-384.896a42.666667 42.666667 0 0 0 12.352-26.410666l0.170667-3.754667v-150.826667A42.666667 42.666667 0 0 0 788.48 191.146667l-3.669333-0.149334zM682.666667 277.333333a64 64 0 1 1 0 128 64 64 0 0 1 0-128z"
          p-id="39035"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  TagOutlined.displayName = 'TagOutlined'
}
