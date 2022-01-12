
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mobile-filled')

export const MobileFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M704 64a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h384z m-192 725.333333a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334z" p-id="15521"></path></svg>
    )
  }
)

if (__DEV__) {
  MobileFilled.displayName = 'MobileFilled'
}
  