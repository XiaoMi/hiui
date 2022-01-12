
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-table-outlined')

export const TableOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667a128 128 0 0 1 128 128v554.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h554.666666zM341.333333 704H192v85.333333a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h106.666666v-128z m256 0h-170.666666v128h170.666666v-128z m234.666667 0h-149.333333v128h106.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333v-85.333333zM341.333333 490.666667H192v128h149.333333v-128z m85.333334 0v128h170.666666v-128h-170.666666zM789.333333 192H234.666667a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v170.666666h640v-170.666666a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192z m-106.666666 426.666667h149.333333v-128h-149.333333v128z" p-id="45076"></path></svg>
    )
  }
)

if (__DEV__) {
  TableOutlined.displayName = 'TableOutlined'
}
  