
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-phone-filled')

export const PhoneFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27029"  ><path d="M384.512 289.472a830.997333 830.997333 0 0 1 252.714667 0l67.733333 10.410667a301.290667 301.290667 0 0 1 173.077333 90.794666 266.965333 266.965333 0 0 1 69.333334 227.264l-2.837334 17.045334c-14.72 88.213333-111.765333 135.872-190.549333 93.568l-87.274667-46.869334a102.421333 102.421333 0 0 1-53.866666-94.464l0.896-21.269333a25.6 25.6 0 0 0-25.6-26.666667h-154.538667a25.6 25.6 0 0 0-25.578667 26.666667l0.896 21.461333a102.4 102.4 0 0 1-53.461333 94.250667l-84.288 45.76c-79.018667 42.88-176.768-4.821333-191.552-93.504l-3.029333-18.261333A264.96 264.96 0 0 1 143.701333 391.893333a298.88 298.88 0 0 1 173.653334-92.096l67.178666-10.325333z"  p-id="27030"></path></svg>
    )
  }
)

if (__DEV__) {
  PhoneFilled.displayName = 'PhoneFilled'
}
  