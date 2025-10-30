
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-stop-filled')

export const StopFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14685"  ><path d="M205.781333 205.781333c169.130667-169.130667 443.328-169.130667 612.458667 0 169.109333 169.130667 169.130667 443.328 0 612.458667-169.130667 169.130667-443.328 169.109333-612.48 0-169.109333-169.130667-169.109333-443.328 0-612.48z m120.042667 65.749334a38.4 38.4 0 1 0-54.293333 54.293333l426.666666 426.666667a38.4 38.4 0 0 0 54.293334-54.293334l-426.666667-426.666666z" p-id="14686"></path></svg>
    )
  }
)

if (__DEV__) {
  StopFilled.displayName = 'StopFilled'
}
  