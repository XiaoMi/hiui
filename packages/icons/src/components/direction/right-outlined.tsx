
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-right-outlined')

export const RightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2055"  ><path d="M392.725333 183.146667a38.4 38.4 0 1 0-54.293333 54.314666L612.992 512 338.410667 786.56a38.4 38.4 0 1 0 54.293333 54.293333L679.338667 554.24a59.733333 59.733333 0 0 0 0-84.48L392.725333 183.146667z" p-id="2056"></path></svg>
    )
  }
)

if (__DEV__) {
  RightOutlined.displayName = 'RightOutlined'
}
  