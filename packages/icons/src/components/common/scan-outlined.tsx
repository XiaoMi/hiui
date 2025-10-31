
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-scan-outlined')

export const ScanOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24937"  ><path d="M829.909333 309.333333v-85.333333a25.6 25.6 0 0 0-25.6-25.6h-85.333333a38.4 38.4 0 1 1 0-76.8h85.333333a102.4 102.4 0 0 1 102.4 102.4v85.333333a38.4 38.4 0 1 1-76.8 0zM202.709333 309.333333v-85.333333a25.6 25.6 0 0 1 25.6-25.6h85.333334a38.4 38.4 0 1 0 0-76.8h-85.333334a102.4 102.4 0 0 0-102.4 102.4v85.333333a38.4 38.4 0 1 0 76.8 0zM829.909333 714.666667v85.333333a25.6 25.6 0 0 1-25.6 25.6h-85.333333a38.4 38.4 0 1 0 0 76.8h85.333333a102.4 102.4 0 0 0 102.4-102.4v-85.333333a38.4 38.4 0 1 0-76.8 0zM202.709333 714.666667v85.333333a25.6 25.6 0 0 0 25.6 25.6h85.333334a38.4 38.4 0 1 1 0 76.8h-85.333334a102.4 102.4 0 0 1-102.4-102.4v-85.333333a38.4 38.4 0 1 1 76.8 0zM217.642667 550.4a38.4 38.4 0 1 1 0-76.8h597.333333a38.4 38.4 0 1 1 0 76.8h-597.333333z" p-id="24938"></path></svg>
    )
  }
)

if (__DEV__) {
  ScanOutlined.displayName = 'ScanOutlined'
}
  