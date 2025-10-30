
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-info-outlined')

export const InfoOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8582"  ><path d="M569.642667 224a53.333333 53.333333 0 1 1-106.666667 0 53.333333 53.333333 0 0 1 106.666667 0zM473.642667 384a42.666667 42.666667 0 0 1 85.333333 0v426.666667a42.666667 42.666667 0 1 1-85.333333 0V384z" p-id="8583"></path></svg>
    )
  }
)

if (__DEV__) {
  InfoOutlined.displayName = 'InfoOutlined'
}
  