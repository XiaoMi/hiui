
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-tag-filled')

export const TagFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29888"  ><path d="M518.336 861.653333a102.4 102.4 0 0 1-144.810667 0l-211.178666-211.2a102.4 102.4 0 0 1 0-144.789333L505.642667 162.346667c19.2-19.2 45.226667-29.994667 72.384-29.994667h232.533333a81.066667 81.066667 0 0 1 81.066667 81.066667v232.533333a102.421333 102.421333 0 0 1-29.973334 72.384L518.336 861.653333z m187.242667-467.797333a53.333333 53.333333 0 1 0-75.456-75.434667 53.333333 53.333333 0 0 0 75.456 75.434667z" p-id="29889"></path></svg>
    )
  }
)

if (__DEV__) {
  TagFilled.displayName = 'TagFilled'
}
  