
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lease-filled')

export const LeaseFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5453"  ><path d="M456.384 133.482667a102.4 102.4 0 0 1 111.232 0l298.666667 193.28a102.4 102.4 0 0 1 46.784 85.952v391.850666a102.4 102.4 0 0 1-102.4 102.4H213.333333a102.4 102.4 0 0 1-102.4-102.4V412.714667a102.4 102.4 0 0 1 46.784-85.973334l298.666667-193.258666z m176.106667 255.936a38.4 38.4 0 0 0-54.314667 0L512 455.616l-66.176-66.197333a38.4 38.4 0 1 0-54.314667 54.293333l45.568 45.568H405.333333a38.4 38.4 0 0 0 0 76.8h68.266667v29.866667H405.333333a38.4 38.4 0 0 0 0 76.8h68.266667V723.2a38.4 38.4 0 1 0 76.8 0v-50.496H618.666667a38.4 38.4 0 1 0 0-76.8h-68.266667v-29.866667H618.666667a38.4 38.4 0 1 0 0-76.8h-31.744l45.568-45.546666a38.4 38.4 0 0 0 0-54.293334z" p-id="5454"></path></svg>
    )
  }
)

if (__DEV__) {
  LeaseFilled.displayName = 'LeaseFilled'
}
  