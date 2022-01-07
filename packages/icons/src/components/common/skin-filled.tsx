
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-skin-filled')

export const SkinFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M407.466667 106.666667c9.898667 24.362667 52.949333 42.666667 104.533333 42.666666s94.634667-18.304 104.533333-42.666666H746.666667c12.714667 0 24.533333 3.712 34.496 10.090666a105.898667 105.898667 0 0 1 50.581333 38.314667l3.157333 4.672 94.634667 148.309333 2.944 4.842667a128 128 0 0 1-42.538667 172.266667l-4.309333 2.581333L810.666667 531.029333V789.333333a128 128 0 0 1-128 128H341.333333a128 128 0 0 1-128-128V531.029333l-74.965333-43.285333a128 128 0 0 1-46.848-174.848l2.944-4.842667 94.634667-148.309333a106.069333 106.069333 0 0 1 53.717333-43.008A63.872 63.872 0 0 1 277.333333 106.666667h130.133334z" p-id="15251"></path></svg>
    )
  }
)

if (__DEV__) {
  SkinFilled.displayName = 'SkinFilled'
}
  