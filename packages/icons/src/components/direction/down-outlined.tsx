
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-down-outlined')

export const DownOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3508"  ><path d="M188.645878 377.688816a37.616327 37.616327 0 1 1 53.206204-53.206204l268.935836 268.956735 268.956735-268.956735a37.616327 37.616327 0 1 1 53.185306 53.206204L552.165878 658.432a58.514286 58.514286 0 0 1-82.755919 0L188.645878 377.709714z" p-id="3509"></path></svg>
    )
  }
)

if (__DEV__) {
  DownOutlined.displayName = 'DownOutlined'
}
  