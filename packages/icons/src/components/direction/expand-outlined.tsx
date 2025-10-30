
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-expand-outlined')

export const ExpandOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10759"  ><path d="M378.176 591.509333a38.4 38.4 0 1 1 54.314667 54.314667L246.293333 832H309.333333a32 32 0 0 1 0 64H181.184A38.4 38.4 0 0 1 121.6 864v-149.333333a38.4 38.4 0 1 1 76.8 0v56.64l179.776-179.797334zM864 121.6a38.4 38.4 0 0 1 38.4 38.4v149.333333a38.4 38.4 0 1 1-76.8 0v-56.64l-179.797333 179.797334a38.4 38.4 0 1 1-54.272-54.314667L771.285333 198.4H714.666667a38.4 38.4 0 1 1 0-76.8h149.333333z"  p-id="10760"></path></svg>
    )
  }
)

if (__DEV__) {
  ExpandOutlined.displayName = 'ExpandOutlined'
}
  