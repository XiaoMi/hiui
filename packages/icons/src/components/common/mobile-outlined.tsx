
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mobile-outlined')

export const MobileOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M704 64a128 128 0 0 1 128 128v640a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h384z m0 85.333333H320a42.666667 42.666667 0 0 0-42.56 39.466667L277.333333 192v640a42.666667 42.666667 0 0 0 39.466667 42.56L320 874.666667h384a42.666667 42.666667 0 0 0 42.56-39.466667L746.666667 832V192a42.666667 42.666667 0 0 0-39.466667-42.56L704 149.333333z m-192 597.333334a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z" p-id="38745"></path></svg>
    )
  }
)

if (__DEV__) {
  MobileOutlined.displayName = 'MobileOutlined'
}
  