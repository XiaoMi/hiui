
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-caret-down-filled')

export const CaretDownFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M496.426667 683.498667L244.714667 381.482667a32 32 0 0 1 24.576-52.48H772.693333a32 32 0 0 1 24.576 52.48L545.578667 683.498667a32 32 0 0 1-49.173334 0z" p-id="49646"></path></svg>
    )
  }
)

if (__DEV__) {
  CaretDownFilled.displayName = 'CaretDownFilled'
}
  