
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-ppt-colorful')

export const PptColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}     viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M643.669333 110.336l205.994667 205.994667A85.333333 85.333333 0 0 1 874.666667 376.682667V810.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h305.984a85.333333 85.333333 0 0 1 60.352 25.002667z" fill="#FE7840" /><path d="M554.666667 128v234.666667a42.666667 42.666667 0 0 0 42.666666 42.666666h234.666667c38.016 0 57.045333-45.952 30.165333-72.832l-234.666666-234.666666C600.618667 70.954667 554.666667 89.984 554.666667 128z" fill="#FEC7A3" /><path d="M486.997333 725.333333v-88.32h52.16c27.221333 0 48.170667-6.016 62.848-18.005333 14.656-12.010667 21.994667-32.512 21.994667-61.504 0-26.56-7.338667-46.165333-21.994667-58.837333-14.677333-12.672-34.346667-18.986667-59.008-18.986667h-106.986666V725.333333h50.986666z m47.829334-130.666666h-47.829334v-72.32h47.829334c12.117333 0 21.546667 2.709333 28.266666 8.149333 6.72 5.44 10.069333 14.549333 10.069334 27.328 0 12.8-3.349333 22.122667-10.069334 28.010667-6.741333 5.888-16.149333 8.832-28.266666 8.832z" fill="#FFFFFF" /></svg>
    )
  }
)

if (__DEV__) {
  PptColorful.displayName = 'PptColorful'
}
