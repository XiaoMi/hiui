
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-printer-filled')

export const PrinterFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M682.666667 106.666667a128 128 0 0 1 128 128v23.104c60.544 10.176 106.666667 62.805333 106.666666 126.229333v170.666667a128 128 0 0 1-128 128h-42.666666v106.666666a128 128 0 0 1-128 128H405.333333a128 128 0 0 1-128-128v-106.666666h-42.666666a128 128 0 0 1-128-128v-170.666667a128.042667 128.042667 0 0 1 106.666666-126.229333V234.666667a128 128 0 0 1 128-128h341.333334zM362.666667 789.333333a42.666667 42.666667 0 0 0 39.466666 42.56L405.333333 832h213.333334a42.666667 42.666667 0 0 0 42.56-39.466667L661.333333 789.333333V576H362.666667v213.333333zM682.666667 192H341.333333a42.666667 42.666667 0 0 0-42.56 39.466667L298.666667 234.666667v21.333333h426.666666v-21.333333a42.666667 42.666667 0 0 0-39.466666-42.56L682.666667 192z" p-id="15371"></path></svg>
    )
  }
)

if (__DEV__) {
  PrinterFilled.displayName = 'PrinterFilled'
}
  