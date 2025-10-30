
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-student-filled')

export const StudentFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29596"  ><path d="M814.549333 496.362667a42.666667 42.666667 0 0 1 55.850667 40.576v172.202666a102.442667 102.442667 0 0 1-68.672 96.704L546.261333 894.933333a102.442667 102.442667 0 0 1-67.306666 0.042667l-256.533334-89.152A102.4 102.4 0 0 1 153.6 709.077333v-170.538666a42.666667 42.666667 0 0 1 58.325333-39.68l290.538667 114.730666c6.058667 2.389333 12.842667 2.346667 18.901333-0.064l290.517334-116.224 2.666666-0.938666z"  p-id="29597"></path><path d="M475.52 130.090667c23.509333-8.96 49.450667-8.96 72.938667 0l383.338666 146.026666c47.616 18.133333 47.637333 85.525333 0 103.68l-383.36 146.026667c-23.466667 8.96-49.429333 8.96-72.896 0L92.16 379.797333c-47.616-18.154667-47.594667-85.546667 0.021333-103.68l383.338667-146.026666z"  p-id="29598"></path></svg>
    )
  }
)

if (__DEV__) {
  StudentFilled.displayName = 'StudentFilled'
}
  