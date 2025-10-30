
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-scissor-outlined')

export const ScissorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9312"  ><path d="M794.154667 161.728a38.4 38.4 0 0 1 54.314666 54.293333L570.581333 493.824l108.565334 108.586667a145.066667 145.066667 0 1 1-54.293334 54.293333l-108.565333-108.586667-108.544 108.586667a145.066667 145.066667 0 1 1-54.293333-54.293333l108.544-108.586667L184.170667 216.021333a38.4 38.4 0 1 1 54.314666-54.293333L516.266667 439.552 794.154667 161.706667z m-512.426667 498.453333a68.266667 68.266667 0 1 0 0 136.554667 68.266667 68.266667 0 0 0 0-136.533333z m469.162667 0a68.266667 68.266667 0 1 0 0.021333 136.576 68.266667 68.266667 0 0 0 0-136.576z"  p-id="9313"></path></svg>
    )
  }
)

if (__DEV__) {
  ScissorOutlined.displayName = 'ScissorOutlined'
}
  