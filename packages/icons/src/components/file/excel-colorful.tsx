
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-excel-colorful')

export const ExcelColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}     viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M643.669333 110.336l205.994667 205.994667A85.333333 85.333333 0 0 1 874.666667 376.682667V810.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h305.984a85.333333 85.333333 0 0 1 60.352 25.002667z" fill="#38D677" /><path d="M554.666667 128v234.666667a42.666667 42.666667 0 0 0 42.666666 42.666666h234.666667c38.016 0 57.045333-45.952 30.165333-72.832l-234.666666-234.666666C600.618667 70.954667 554.666667 89.984 554.666667 128z" fill="#B3F2C6" /><path d="M474.005333 725.333333l49.322667-83.669333L570.026667 725.333333h62.336l-79.850667-127.146666 75.178667-118.528H568.32l-45.013333 79.850666-43.818667-79.850666h-61.333333l75.157333 120.512L414.336 725.333333z" fill="#FFFFFF" /></svg>
    )
  }
)

if (__DEV__) {
  ExcelColorful.displayName = 'ExcelColorful'
}
  