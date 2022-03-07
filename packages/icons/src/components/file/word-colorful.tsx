
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-word-colorful')

export const WordColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}     viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M643.669333 110.336l205.994667 205.994667A85.333333 85.333333 0 0 1 874.666667 376.682667V810.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h305.984a85.333333 85.333333 0 0 1 60.352 25.002667z" fill="#4A9EFF" /><path d="M554.666667 128v234.666667a42.666667 42.666667 0 0 0 42.666666 42.666666h234.666667c38.016 0 57.045333-45.952 30.165333-72.832l-234.666666-234.666666C600.618667 70.954667 554.666667 89.984 554.666667 128z" fill="#96CEFF" /><path d="M483.925333 725.333333l29.653334-143.658666 8.661333-47.509334 8.682667 47.509334L560.576 725.333333h49.002667l69.162666-245.674666h-52.16l-32.832 142.165333-7.509333 37.674667-7.488-39.168-29.162667-140.672h-54.186666l-27.648 141.504-7.168 38.336-6.997334-39.168-32.512-140.672h-54.485333L436.245333 725.333333z" fill="#FFFFFF" /></svg>
    )
  }
)

if (__DEV__) {
  WordColorful.displayName = 'WordColorful'
}
