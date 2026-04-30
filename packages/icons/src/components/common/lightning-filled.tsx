
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-lightning-filled')

export const LightningFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24964"  ><path d="M680.661333 91.797333c46.208 0 74.922667 50.176 51.498667 89.984l-119.744 203.690667h186.986667c54.421333 0 80.490667 66.88 40.405333 103.722667L375.36 916.138667c-44.8 41.173333-115.306667-3.157333-97.578667-61.376l84.074667-276.245334h-137.322667c-42.410667 0-71.317333-43.008-55.296-82.282666L308.181333 155.52a102.4 102.4 0 0 1 94.826667-63.722667h277.653333z"  p-id="24965"></path></svg>
    )
  }
)

if (__DEV__) {
  LightningFilled.displayName = 'LightningFilled'
}
  