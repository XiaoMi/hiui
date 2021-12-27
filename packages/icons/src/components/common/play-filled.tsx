
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-play-filled'
const _prefix = getPrefixCls(_role)

export const PlayFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-106.666667 314.709334v223.914666c0 29.013333 31.018667 46.933333 55.381334 32l182.869333-111.957333c23.68-14.506667 23.68-49.493333 0-64l-182.869333-111.957333c-24.362667-14.933333-55.381333 2.986667-55.381334 32z" p-id="15591"></path></svg>
    )
  }
)

if (__DEV__) {
  PlayFilled.displayName = 'PlayFilled'
}
  