
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-left-outlined')

export const DirectionLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2345"  ><path d="M227.328 439.594667l256.448-256.426667a38.4 38.4 0 1 1 54.314667 54.293333L281.621333 493.866667a25.6 25.6 0 0 0 0 36.224l256.426667 256.426666a38.4 38.4 0 1 1-54.293333 54.314667l-256.426667-256.426667a102.4 102.4 0 0 1 0-144.832z" p-id="2346"></path><path d="M504.661333 439.594667l256.448-256.426667a38.4 38.4 0 1 1 54.293334 54.293333l-256.426667 256.426667a25.6 25.6 0 0 0 0 36.224l256.426667 256.426667a38.4 38.4 0 1 1-54.293334 54.314666l-256.426666-256.426666a102.4 102.4 0 0 1 0-144.832z" p-id="2347"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionLeftOutlined.displayName = 'DirectionLeftOutlined'
}
  