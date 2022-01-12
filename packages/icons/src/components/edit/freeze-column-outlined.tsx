
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-freeze-column-outlined')

export const FreezeColumnOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667a128 128 0 0 1 128 128v554.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h554.666666zM341.333333 682.666667H192v106.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h106.666666v-149.333333zM789.333333 192H426.666667v640h362.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333V234.666667a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192zM341.333333 597.333333v-170.666666H192v170.666666h149.333333z m0-256V192h-106.666666a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v106.666666h149.333333z" p-id="44816"></path></svg>
    )
  }
)

if (__DEV__) {
  FreezeColumnOutlined.displayName = 'FreezeColumnOutlined'
}
  