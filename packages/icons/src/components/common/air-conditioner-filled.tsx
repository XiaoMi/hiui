
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-air-conditioner-filled')

export const AirConditionerFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5044"  ><path d="M955.733333 517.333333v32a102.4 102.4 0 0 1-102.4 102.4H170.666667a102.4 102.4 0 0 1-102.4-102.4v-32h887.466666zM68.266667 229.333333A102.4 102.4 0 0 1 170.666667 126.933333h682.666666a102.4 102.4 0 0 1 102.4 102.4v224H68.266667v-224zM228.842667 747.157333a38.4 38.4 0 0 1 54.314666-54.314666 128.917333 128.917333 0 0 1 0 182.314666 38.4 38.4 0 0 1-54.314666-54.314666c20.352-20.352 20.352-53.333333 0-73.685334zM473.6 858.666667v-138.666667a38.4 38.4 0 1 1 76.8 0v138.666667a38.4 38.4 0 1 1-76.8 0zM796.202667 747.157333a38.4 38.4 0 0 0-54.314667-54.314666 128.917333 128.917333 0 0 0 0 182.314666 38.4 38.4 0 0 0 54.314667-54.314666 52.096 52.096 0 0 1 0-73.685334z" p-id="5045"></path></svg>
    )
  }
)

if (__DEV__) {
  AirConditionerFilled.displayName = 'AirConditionerFilled'
}
  