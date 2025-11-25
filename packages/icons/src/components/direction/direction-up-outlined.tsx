
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-up-outlined')

export const DirectionUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2781"  ><path d="M439.594667 227.328L183.168 483.776a38.4 38.4 0 1 0 54.293333 54.293333l256.426667-256.426666a25.6 25.6 0 0 1 36.224 0l256.426667 256.426666a38.4 38.4 0 1 0 54.314666-54.293333l-256.426666-256.426667a102.4 102.4 0 0 0-144.832 0z" p-id="2782"></path><path d="M439.594667 504.661333L183.168 761.109333a38.4 38.4 0 1 0 54.293333 54.293334l256.426667-256.426667a25.6 25.6 0 0 1 36.224 0l256.426667 256.426667a38.4 38.4 0 1 0 54.314666-54.293334l-256.426666-256.426666a102.4 102.4 0 0 0-144.832 0z" p-id="2783"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionUpOutlined.displayName = 'DirectionUpOutlined'
}
  