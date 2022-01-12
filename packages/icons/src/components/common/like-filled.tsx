
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-like-filled')

export const LikeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M806.314667 917.333333a128 128 0 0 0 126.72-109.888l48.768-341.333333A128 128 0 0 0 855.082667 320h-110.72a149.354667 149.354667 0 0 0-62.869334-187.477333l-18.474666-10.666667a128 128 0 0 0-174.869334 46.848l-108.565333 188.032A127.616 127.616 0 0 0 341.333333 448v341.333333a128 128 0 0 0 128 128zM192 915.349333a85.333333 85.333333 0 0 0 85.333333-85.333333v-320a85.333333 85.333333 0 0 0-85.333333-85.333333H170.666667a85.333333 85.333333 0 0 0-85.333334 85.333333v320a85.333333 85.333333 0 0 0 85.333334 85.333333h21.333333z" p-id="15511"></path></svg>
    )
  }
)

if (__DEV__) {
  LikeFilled.displayName = 'LikeFilled'
}
  