
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-details-filled')

export const DetailsFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M746.666667 85.333333a128 128 0 0 1 128 128v597.333334a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334z m-128 469.333334H405.333333a42.666667 42.666667 0 1 0 0 85.333333h213.333334a42.666667 42.666667 0 1 0 0-85.333333z m0-170.666667H405.333333a42.666667 42.666667 0 1 0 0 85.333333h213.333334a42.666667 42.666667 0 1 0 0-85.333333z" p-id="44746"></path></svg>
    )
  }
)

if (__DEV__) {
  DetailsFilled.displayName = 'DetailsFilled'
}
  