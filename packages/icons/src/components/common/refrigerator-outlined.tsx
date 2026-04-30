
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-refrigerator-outlined')

export const RefrigeratorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M714.666667 78.933333a102.4 102.4 0 0 1 102.4 102.4v661.333334c0 56.597333-45.952 102.4-102.464 102.4H309.397333A102.442667 102.442667 0 0 1 206.933333 842.666667v-661.333334a102.4 102.4 0 0 1 102.4-102.4h405.333334z m-405.333334 76.8a25.6 25.6 0 0 0-25.6 25.6v661.333334c0 14.08 11.477333 25.6 25.664 25.6h405.205334c14.186667 0 25.664-11.52 25.664-25.6v-661.333334a25.6 25.6 0 0 0-25.6-25.6h-405.333334z" p-id="6066"></path><path d="M411.733333 320a38.4 38.4 0 1 1-76.8 0v-42.666667a38.4 38.4 0 1 1 76.8 0v42.666667zM411.733333 704a38.4 38.4 0 1 1-76.8 0v-42.666667a38.4 38.4 0 1 1 76.8 0v42.666667zM768 430.933333a38.4 38.4 0 1 1 0 76.8H256a38.4 38.4 0 1 1 0-76.8h512z" p-id="6067"></path></svg>
    )
  }
)

if (__DEV__) {
  RefrigeratorOutlined.displayName = 'RefrigeratorOutlined'
}
  