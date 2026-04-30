
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-start-date-outlined')

export const StartDateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8695"  ><path d="M836.266667 486.4H187.733333v334.933333a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V486.4zM405.333333 558.933333a38.4 38.4 0 1 1 0 76.8h-106.666666a38.4 38.4 0 1 1 0-76.8h106.666666z m430.933334-270.933333a25.6 25.6 0 0 0-25.6-25.6h-110.933334v46.933333a38.4 38.4 0 1 1-76.8 0v-46.933333H401.066667v46.933333a38.4 38.4 0 1 1-76.8 0v-46.933333H213.333333a25.6 25.6 0 0 0-25.6 25.6v121.6h648.533334v-121.6z m76.8 533.333333a102.4 102.4 0 0 1-102.4 102.4H213.333333a102.4 102.4 0 0 1-102.4-102.4v-533.333333A102.4 102.4 0 0 1 213.333333 185.6h110.933334V138.666667a38.4 38.4 0 1 1 76.8 0v46.933333h221.866666V138.666667a38.4 38.4 0 1 1 76.8 0v46.933333H810.666667a102.4 102.4 0 0 1 102.4 102.4v533.333333z" p-id="8696"></path></svg>
    )
  }
)

if (__DEV__) {
  StartDateOutlined.displayName = 'StartDateOutlined'
}
  