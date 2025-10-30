
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-archive-outlined')

export const ArchiveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11873"  ><path d="M814.933333 210.410667a25.6 25.6 0 0 0-25.6-25.6H234.666667a25.6 25.6 0 0 0-25.6 25.6v85.333333a25.6 25.6 0 0 0 25.6 25.6h554.666666a25.6 25.6 0 0 0 25.6-25.6v-85.333333z m76.8 85.333333a102.4 102.4 0 0 1-102.4 102.4H234.666667a102.4 102.4 0 0 1-102.4-102.4v-85.333333a102.4 102.4 0 0 1 102.4-102.4h554.666666a102.4 102.4 0 0 1 102.4 102.4v85.333333zM132.266667 813.589333v-309.333333a38.4 38.4 0 1 1 76.8 0v309.333333a25.6 25.6 0 0 0 25.6 25.6h554.666666a25.6 25.6 0 0 0 25.6-25.6v-309.333333a38.4 38.4 0 1 1 76.8 0v309.333333a102.4 102.4 0 0 1-102.4 102.4H234.666667a102.4 102.4 0 0 1-102.4-102.4z" p-id="11874"></path><path d="M472.704 516.010667a38.4 38.4 0 1 1 76.8 0v227.413333a38.4 38.4 0 1 1-76.8 0v-227.413333z" p-id="11875"></path><path d="M589.376 610.986667a38.4 38.4 0 1 1 54.293333 54.314666l-105.6 105.6a38.4 38.4 0 1 1-54.293333-54.293333l105.6-105.6z" p-id="11876"></path><path d="M378.176 665.301333a38.4 38.4 0 1 1 54.314667-54.293333l105.6 105.6a38.4 38.4 0 1 1-54.314667 54.293333l-105.6-105.6z" p-id="11877"></path></svg>
    )
  }
)

if (__DEV__) {
  ArchiveOutlined.displayName = 'ArchiveOutlined'
}
  