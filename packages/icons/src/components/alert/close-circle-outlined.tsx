
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-close-circle-outlined')

export const CloseCircleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8261"  ><path d="M612.842667 356.842667a38.4 38.4 0 1 1 54.293333 54.293333l-256 256a38.4 38.4 0 1 1-54.272-54.272l256-256z"  p-id="8262"></path><path d="M411.136 356.842667a38.4 38.4 0 1 0-54.272 54.293333l256 256a38.4 38.4 0 1 0 54.272-54.272l-256-256z"  p-id="8263"></path><path d="M868.266667 512c0-196.757333-159.509333-356.266667-356.266667-356.266667-196.757333 0-356.266667 159.509333-356.266667 356.266667 0 196.757333 159.509333 356.266667 356.266667 356.266667 196.757333 0 356.266667-159.509333 356.266667-356.266667z m76.8 0c0 239.168-193.898667 433.066667-433.066667 433.066667S78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333 945.066667 272.853333 945.066667 512z"  p-id="8264"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseCircleOutlined.displayName = 'CloseCircleOutlined'
}
  