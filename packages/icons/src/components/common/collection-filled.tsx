import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-collection-filled')

export const CollectionFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M335.68 149.333333a85.333333 85.333333 0 0 1 73.173333 41.429334L460.8 277.333333H810.666667a128 128 0 0 1 128 128v341.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V234.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h165.013333z m158.442667 281.728l-26.752 54.165334-59.776 8.682666a43.733333 43.733333 0 0 0-25.024 12.757334l-2.389334 2.666666a43.733333 43.733333 0 0 0 3.2 59.178667l43.242667 42.154667-10.218667 59.541333a43.733333 43.733333 0 0 0 4.394667 27.733333l1.706667 2.986667a43.733333 43.733333 0 0 0 57.365333 15.381333L533.333333 688.213333l53.461334 28.117334c8.533333 4.48 18.261333 6.016 27.733333 4.394666l3.2-0.661333a43.733333 43.733333 0 0 0 32.533333-49.834667L640 610.666667l43.285333-42.154667a43.733333 43.733333 0 0 0 12.757334-25.024l0.341333-3.264a43.733333 43.733333 0 0 0-37.333333-46.293333l-59.797334-8.704-26.730666-54.186667a43.733333 43.733333 0 0 0-78.421334 0zM768 149.333333a42.666667 42.666667 0 1 1 0 85.333334H512a42.666667 42.666667 0 1 1 0-85.333334h256z"
          p-id="15571"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  CollectionFilled.displayName = 'CollectionFilled'
}
