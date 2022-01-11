import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-folder-move-filled')

export const FolderMoveFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M399.68 149.333333a85.333333 85.333333 0 0 1 73.173333 41.429334L524.8 277.333333H810.666667a128 128 0 0 1 128 128v341.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V234.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h229.013333z m225.109333 308.672a42.666667 42.666667 0 0 0-60.117333 60.117334l2.496 2.709333 12.48 12.501333H384a42.666667 42.666667 0 1 0 0 85.333334h195.626667l-12.458667 12.501333-2.496 2.709333a42.666667 42.666667 0 0 0 0 54.912l2.496 2.709334 2.709333 2.496a42.666667 42.666667 0 0 0 54.912 0l2.709334-2.496 85.333333-85.333334 2.496-2.709333a42.666667 42.666667 0 0 0 0-54.912l-2.496-2.709333-85.333333-85.333334z"
          p-id="44806"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  FolderMoveFilled.displayName = 'FolderMoveFilled'
}
