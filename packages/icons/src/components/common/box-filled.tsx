
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-box-filled')

export const BoxFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5190"  ><path d="M730.709333 132.266667a102.4 102.4 0 0 1 93.888 61.589333l88.469334 203.498667V789.333333a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 789.333333V398.165333l77.44-200.384a102.4 102.4 0 0 1 95.509334-65.493333h446.826666zM640 686.933333a38.4 38.4 0 1 0 0 76.8h106.666667a38.4 38.4 0 1 0 0-76.8h-106.666667zM283.882667 209.066667a25.6 25.6 0 0 0-23.893334 16.362666L205.354667 366.933333h267.306666l-3.797333-157.866666h-184.96z m265.6 157.866666h266.624l-61.930667-142.464a25.6 25.6 0 0 0-23.466667-15.402666h-185.024l3.818667 157.866666z" p-id="5191"></path></svg>
    )
  }
)

if (__DEV__) {
  BoxFilled.displayName = 'BoxFilled'
}
  