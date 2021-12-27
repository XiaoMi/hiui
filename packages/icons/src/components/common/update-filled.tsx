
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-update-filled'
const _prefix = getPrefixCls(_role)

export const UpdateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-1.770667 213.354667l-0.426666 0.042667h-0.256l-1.898667 0.149333a51.093333 51.093333 0 0 0-4.586667 0.725333 42.261333 42.261333 0 0 0-15.210666 6.549334l-0.832 0.576a46.144 46.144 0 0 0-2.474667 1.941333l-0.192 0.149333c-0.853333 0.746667-1.706667 1.536-2.517333 2.346667l-128 128a42.666667 42.666667 0 0 0 57.621333 62.826667l2.709333-2.496L469.333333 444.373333V661.333333a42.666667 42.666667 0 1 0 85.333334 0V444.352l55.168 55.146667a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496a42.666667 42.666667 0 0 0 2.496-57.621334l-2.496-2.709333-128-128-1.6-1.536-0.341333-0.298667-0.213333-0.213333-0.213334-0.149333-0.149333-0.149334-0.746667-0.597333a44.821333 44.821333 0 0 0-1.92-1.493333l-0.832-0.576a46.122667 46.122667 0 0 0-2.858666-1.813334 42.496 42.496 0 0 0-20.629334-5.674666H512l-1.109333 0.021333 0.469333-0.021333-1.770667 0.064 0.64-0.042667z" p-id="15291"></path></svg>
    )
  }
)

if (__DEV__) {
  UpdateFilled.displayName = 'UpdateFilled'
}
  