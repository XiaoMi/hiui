
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-shop-outlined'
const _prefix = getPrefixCls(_role)

export const ShopOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 85.333333a128 128 0 0 1 128 128v192c0 47.36-25.728 88.746667-63.978666 110.869334L853.333333 789.333333a128 128 0 0 1-128 128H298.666667a128 128 0 0 1-128-128V516.202667A127.957333 127.957333 0 0 1 106.666667 405.333333v-192a128 128 0 0 1 128-128z m-21.333333 448H256v256a42.666667 42.666667 0 0 0 39.466667 42.56L298.666667 832h170.666666v-106.666667a42.666667 42.666667 0 1 1 85.333334 0v106.666667h170.666666a42.666667 42.666667 0 0 0 42.666667-42.666667V533.333333z m21.333333-362.666666H234.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v192a42.666667 42.666667 0 0 0 42.666667 42.666667h128v-85.333333a42.666667 42.666667 0 1 1 85.333333 0v85.333333h128v-85.333333a42.666667 42.666667 0 1 1 85.333333 0v85.333333h128a42.666667 42.666667 0 0 0 42.666667-42.666667v-192a42.666667 42.666667 0 0 0-42.666667-42.666666z" p-id="38905"></path></svg>
    )
  }
)

if (__DEV__) {
  ShopOutlined.displayName = 'ShopOutlined'
}
  