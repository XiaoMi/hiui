
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-review-outlined')

export const ReviewOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  ><path d="M576 85.333333a128 128 0 0 1 87.744 221.184L717.653333 576H789.333333a128 128 0 0 1 128 128v106.666667a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128v-106.666667a128 128 0 0 1 128-128h71.68l53.909333-269.482667A128 128 0 0 1 448 85.333333z m256 704H192v21.333334l0.106667 3.2A42.666667 42.666667 0 0 0 234.666667 853.333333h554.666666l3.2-0.106666A42.666667 42.666667 0 0 0 832 810.666667v-21.333334z m-42.666667-128H234.666667l-3.2 0.106667A42.666667 42.666667 0 0 0 192 704h640l-0.106667-3.2A42.666667 42.666667 0 0 0 789.333333 661.333333z m-205.653333-320h-143.36l-46.933333 234.666667h237.226666l-46.933333-234.666667zM576 170.666667h-128l-3.2 0.106666A42.666667 42.666667 0 0 0 448 256h128l3.2-0.106667A42.666667 42.666667 0 0 0 576 170.666667z" p-id="11065"></path></svg>
    )
  }
)

if (__DEV__) {
  ReviewOutlined.displayName = 'ReviewOutlined'
}
  