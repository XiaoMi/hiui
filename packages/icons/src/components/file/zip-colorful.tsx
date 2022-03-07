
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-zip-colorful')

export const ZipColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}     viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M643.669333 110.336l205.994667 205.994667A85.333333 85.333333 0 0 1 874.666667 376.682667V810.666667a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h305.984a85.333333 85.333333 0 0 1 60.352 25.002667z" fill="#FAB007" /><path d="M405.333333 512v85.333333h106.666667v170.666667H298.666667v-85.333333h106.666666v-85.333334h-106.666666v-85.333333h106.666666z m106.666667-85.333333v85.333333h-106.666667v-85.333333h106.666667z m-106.666667-85.333334v85.333334h-106.666666v-85.333334h106.666666z m106.666667-85.333333v85.333333h-106.666667v-85.333333h106.666667z m-106.666667-85.333333v85.333333h-106.666666V170.666667h106.666666z" fill="#FFFFFF" /><path d="M554.666667 128v234.666667a42.666667 42.666667 0 0 0 42.666666 42.666666h234.666667c38.016 0 57.045333-45.952 30.165333-72.832l-234.666666-234.666666C600.618667 70.954667 554.666667 89.984 554.666667 128z" fill="#FEE789" /></svg>
    )
  }
)

if (__DEV__) {
  ZipColorful.displayName = 'ZipColorful'
}
