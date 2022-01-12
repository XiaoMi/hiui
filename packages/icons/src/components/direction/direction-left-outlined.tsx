
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-left-outlined')

export const DirectionLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M542.165333 225.834667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333L316.373333 512l225.813334 225.834667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621334 2.496l-2.709333-2.496-256-256a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 256-256a42.666667 42.666667 0 0 1 60.330667 0z m256 0a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333L572.373333 512l225.813334 225.834667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621334 2.496l-2.709333-2.496-256-256a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 256-256a42.666667 42.666667 0 0 1 60.330667 0z" p-id="49616"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionLeftOutlined.displayName = 'DirectionLeftOutlined'
}
  