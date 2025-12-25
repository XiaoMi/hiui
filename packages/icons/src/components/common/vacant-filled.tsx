
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-vacant-filled')

export const VacantFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5160"  ><path d="M456.384 133.461333a102.421333 102.421333 0 0 1 111.232 0l298.666667 193.28a102.4 102.4 0 0 1 46.784 85.952v391.850667a102.4 102.4 0 0 1-102.4 102.4H213.333333a102.4 102.4 0 0 1-102.4-102.4V412.693333a102.4 102.4 0 0 1 46.784-85.973333l298.666667-193.258667zM373.333333 638.144a38.4 38.4 0 0 0 0 76.8h277.333334a38.4 38.4 0 1 0 0-76.8h-277.333334z" p-id="5161"></path></svg>
    )
  }
)

if (__DEV__) {
  VacantFilled.displayName = 'VacantFilled'
}
  