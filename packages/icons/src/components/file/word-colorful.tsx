
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-word-colorful')

export const WordColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2534"  ><path d="M128 179.2a128 128 0 0 1 128-128h399.850667a85.333333 85.333333 0 0 1 60.352 25.002667l154.794666 154.816A85.333333 85.333333 0 0 1 896 291.349333V844.8a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V179.2z" fill="#4D82FF" p-id="2535"></path><path d="M421.888 664.256l-63.36-234.666667h43.733333l40.448 172.437334h2.090667l43.178667-172.437334h39.786666l43.285334 172.565334h1.962666l40.448-172.586667h43.733334l-63.36 234.666667h-40.106667L508.8 499.626667h-1.749333l-45.056 164.650666h-40.106667z" fill="#FFFFFF" p-id="2536"></path><path d="M665.6 51.2c16.384 0 32.106667 6.528 43.712 18.112L793.6 153.6l84.309333 84.309333c11.584 11.584 18.090667 27.306667 18.090667 43.690667h-145.066667a85.333333 85.333333 0 0 1-85.333333-85.333333V51.2z" fill="#74A2FF" p-id="2537"></path></svg>
    )
  }
)

if (__DEV__) {
  WordColorful.displayName = 'WordColorful'
}
  