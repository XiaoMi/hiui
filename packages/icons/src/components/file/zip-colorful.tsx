
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-zip-colorful')

export const ZipColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2681"  ><path d="M128 179.2a128 128 0 0 1 128-128h399.850667a85.333333 85.333333 0 0 1 60.352 25.002667l154.794666 154.816A85.333333 85.333333 0 0 1 896 291.349333V844.8a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V179.2z" fill="#FFBE0A" p-id="2682"></path><path d="M665.6 51.2c16.384 0 32.106667 6.528 43.712 18.112L793.6 153.6l84.309333 84.309333c11.584 11.584 18.090667 27.306667 18.090667 43.690667h-145.066667a85.333333 85.333333 0 0 1-85.333333-85.333333V51.2z" fill="#FFDF5E" p-id="2683"></path><path d="M405.333333 170.666667h-106.666666v85.333333h106.666666v85.333333h-106.666666v85.333334h106.666666v85.333333h-106.666666v85.333333h106.666666v85.333334h-106.666666v85.333333h213.333333v-170.666667h-106.666667v-85.333333h106.666667v-85.333333h-106.666667v-85.333334h106.666667v-85.333333h-106.666667V170.666667z" fill="#FFFFFF" p-id="2684"></path></svg>
    )
  }
)

if (__DEV__) {
  ZipColorful.displayName = 'ZipColorful'
}
  