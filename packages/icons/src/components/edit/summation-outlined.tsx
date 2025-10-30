
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-summation-outlined')

export const SummationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9751"  ><path d="M209.962667 870.4c-51.968 0-79.146667-61.781333-44.053334-100.096L402.709333 512l-236.8-258.304C130.816 215.381333 157.994667 153.6 209.962667 153.6h634.154666a38.4 38.4 0 1 1 0 76.8H248.768l233.002667 254.208a40.533333 40.533333 0 0 1 0 54.784L248.746667 793.6h595.349333a38.4 38.4 0 1 1 0 76.8H209.962667z" p-id="9752"></path></svg>
    )
  }
)

if (__DEV__) {
  SummationOutlined.displayName = 'SummationOutlined'
}
  