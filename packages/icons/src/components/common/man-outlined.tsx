
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-man-outlined')

export const ManOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21638"  ><path d="M617.6 618.666667c0-120.192-97.429333-217.6-217.6-217.6-120.170667 0-217.6 97.408-217.6 217.6 0 120.170667 97.429333 217.6 217.6 217.6 120.170667 0 217.6-97.429333 217.6-217.6z m76.8 0c0 162.581333-131.797333 294.4-294.4 294.4-162.581333 0-294.4-131.818667-294.4-294.4 0-162.602667 131.818667-294.4 294.4-294.4 162.602667 0 294.4 131.797333 294.4 294.4z" p-id="21639"></path><path d="M831.509333 143.509333a38.4 38.4 0 1 1 54.314667 54.293334l-261.333333 261.333333a38.4 38.4 0 1 1-54.314667-54.293333l261.333333-261.333334z" p-id="21640"></path><path d="M880 110.933333a38.4 38.4 0 1 1 0 76.8h-163.349333a38.4 38.4 0 1 1 0-76.8h163.349333z" p-id="21641"></path><path d="M918.4 312.682667a38.4 38.4 0 1 1-76.8 0V149.333333a38.4 38.4 0 1 1 76.8 0v163.349334z" p-id="21642"></path></svg>
    )
  }
)

if (__DEV__) {
  ManOutlined.displayName = 'ManOutlined'
}
  