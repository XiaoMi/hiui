import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-zoom-in-outlined')

export const ZoomInOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M469.333333 106.666667c200.298667 0 362.666667 162.368 362.666667 362.666666 0 84.757333-29.077333 162.730667-77.802667 224.490667l150.634667 150.677333a42.666667 42.666667 0 0 1-57.621333 62.826667l-2.709334-2.496-150.677333-150.634667A361.109333 361.109333 0 0 1 469.333333 832c-200.298667 0-362.666667-162.368-362.666666-362.666667S269.034667 106.666667 469.333333 106.666667z m0 85.333333C316.16 192 192 316.16 192 469.333333s124.16 277.333333 277.333333 277.333334 277.333333-124.16 277.333334-277.333334S622.506667 192 469.333333 192z m0 106.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v85.333334h85.333333a42.666667 42.666667 0 1 1 0 85.333333h-85.333333v85.333333a42.666667 42.666667 0 1 1-85.333333 0v-85.333333h-85.333334a42.666667 42.666667 0 1 1 0-85.333333h85.333334v-85.333334a42.666667 42.666667 0 0 1 42.666666-42.666666z"
          p-id="44856"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ZoomInOutlined.displayName = 'ZoomInOutlined'
}
